import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";

const SESSION_COOKIE_NAME = "alaz_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours in seconds
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute in milliseconds
const MAX_FAILED_ATTEMPTS = 5;

// In-memory sliding window rate limiter tracking failed attempt timestamps per IP
const failedAttemptsMap = new Map<string, number[]>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

function checkRateLimit(ip: string, now: number): { allowed: boolean; retryAfter?: number } {
  const attempts = failedAttemptsMap.get(ip);
  if (!attempts || attempts.length === 0) {
    return { allowed: true };
  }

  const validAttempts = attempts.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  if (validAttempts.length !== attempts.length) {
    if (validAttempts.length === 0) {
      failedAttemptsMap.delete(ip);
      return { allowed: true };
    }
    failedAttemptsMap.set(ip, validAttempts);
  }

  if (validAttempts.length >= MAX_FAILED_ATTEMPTS) {
    const oldest = validAttempts[0];
    const retryAfter = Math.max(1, Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000));
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

function recordFailedAttempt(ip: string, now: number): void {
  const attempts = failedAttemptsMap.get(ip) || [];
  const validAttempts = attempts.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  validAttempts.push(now);
  failedAttemptsMap.set(ip, validAttempts);

  // Periodic pruning if store exceeds 1000 items
  if (failedAttemptsMap.size > 1000) {
    for (const [key, timestamps] of failedAttemptsMap.entries()) {
      const active = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) {
        failedAttemptsMap.delete(key);
      } else {
        failedAttemptsMap.set(key, active);
      }
    }
  }
}

function clearFailedAttempts(ip: string): void {
  failedAttemptsMap.delete(ip);
}

function safeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function createSessionToken(adminPassword: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHmac("sha256", adminPassword)
    .update(`alaz_session:${timestamp}`)
    .digest("hex");
  return `${timestamp}.${signature}`;
}

function verifySessionToken(token: string, adminPassword: string): boolean {
  if (typeof token !== "string" || !token) {
    return false;
  }

  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) {
    return false;
  }

  const timestampStr = token.substring(0, dotIndex);
  const signature = token.substring(dotIndex + 1);

  const timestamp = parseInt(timestampStr, 10);
  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  // 8 hours absolute expiration; allow 60s clock skew
  if (now < timestamp - 60 || now - timestamp > SESSION_MAX_AGE) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", adminPassword)
    .update(`alaz_session:${timestamp}`)
    .digest("hex");

  return safeCompare(signature, expectedSignature);
}

export async function POST(request: NextRequest) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { success: false, error: "Server Misconfiguration: ADMIN_PASSWORD is required" },
        { status: 500 }
      );
    }

    const body = await request.json();

    if (body?.action === "logout") {
      const response = NextResponse.json({ success: true, message: "Logged out" });
      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return response;
    }

    const clientIp = getClientIp(request);
    const now = Date.now();

    // Check sliding window rate limit
    const rateLimit = checkRateLimit(clientIp, now);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many failed attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter || 60),
          },
        }
      );
    }

    const { password } = body;

    if (!password || typeof password !== "string") {
      recordFailedAttempt(clientIp, now);
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    if (!safeCompare(password, adminPassword)) {
      recordFailedAttempt(clientIp, now);
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    // Successful login: clear failed attempts for this IP
    clearFailedAttempts(clientIp);

    const token = createSessionToken(adminPassword);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
    });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { success: false, error: "Server Misconfiguration: ADMIN_PASSWORD is required" },
        { status: 500 }
      );
    }

    const cookieToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!cookieToken) {
      return NextResponse.json({ authenticated: false });
    }

    const isAuthenticated = verifySessionToken(cookieToken, adminPassword);
    return NextResponse.json({ authenticated: isAuthenticated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Authentication check failed" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

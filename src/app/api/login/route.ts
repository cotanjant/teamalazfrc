import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";

const SESSION_COOKIE_NAME = "alaz_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function safeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }
  const bufA = Buffer.from(a, "utf-8");
  const bufB = Buffer.from(b, "utf-8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
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
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      });
      return response;
    }

    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    if (!safeCompare(password, adminPassword)) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    const token = crypto
      .createHmac("sha256", adminPassword)
      .update("authenticated_admin_session_v1")
      .digest("hex");

    const response = NextResponse.json({ success: true, token });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
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

    const expectedToken = crypto
      .createHmac("sha256", adminPassword)
      .update("authenticated_admin_session_v1")
      .digest("hex");

    const isAuthenticated = safeCompare(cookieToken, expectedToken);
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
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}

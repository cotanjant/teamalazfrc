import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";
import * as fs from "fs/promises";
import * as path from "path";
import { revalidatePath } from "next/cache";

const SESSION_COOKIE_NAME = "alaz_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours in seconds
const ALLOWED_TARGET_PATH = "src/data/collection.json";
const REQUIRED_COLLECTION_KEYS = [
  "teamInfo",
  "navigation",
  "hero",
  "stats",
  "departments",
] as const;

function safeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function verifySessionToken(token: string, adminPassword: string): boolean {
  if (typeof token !== "string" || !token) {
    return false;
  }

  // 1. New timestamped HMAC format (<timestamp>.<signature>)
  const dotIndex = token.indexOf(".");
  if (dotIndex !== -1) {
    const timestampStr = token.substring(0, dotIndex);
    const signature = token.substring(dotIndex + 1);

    const timestamp = parseInt(timestampStr, 10);
    if (Number.isFinite(timestamp) && timestamp > 0) {
      const now = Math.floor(Date.now() / 1000);
      // 8 hours absolute expiration; allow 60s clock skew
      if (now >= timestamp - 60 && now - timestamp <= SESSION_MAX_AGE) {
        const expectedSignature = crypto
          .createHmac("sha256", adminPassword)
          .update(`alaz_session:${timestamp}`)
          .digest("hex");

        if (safeCompare(signature, expectedSignature)) {
          return true;
        }
      }
    }
  }

  // 2. Legacy HMAC format for backwards compatibility
  const legacyToken = crypto
    .createHmac("sha256", adminPassword)
    .update("authenticated_admin_session_v1")
    .digest("hex");

  return safeCompare(token, legacyToken);
}

function verifyToken(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return false;
  }

  // Check cookie first
  let token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Fallback to Authorization: Bearer <token> for backward compatibility
  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "").trim();
    }
  }

  if (!token) {
    return false;
  }

  return verifySessionToken(token, adminPassword);
}

interface ValidationSuccess {
  valid: true;
  base64Content: string;
  rawUtf8Content: string;
}

interface ValidationError {
  valid: false;
  error: string;
  status: number;
}

type ValidationResult = ValidationSuccess | ValidationError;

function validateCollectionContent(content: string, encoding: string): ValidationResult {
  let rawUtf8 = "";
  let base64 = "";

  if (encoding === "base64") {
    try {
      base64 = content;
      rawUtf8 = Buffer.from(content, "base64").toString("utf-8");
    } catch {
      return {
        valid: false,
        error: "Invalid base64 encoding",
        status: 422,
      };
    }
  } else {
    rawUtf8 = content;
    base64 = Buffer.from(content, "utf-8").toString("base64");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawUtf8);
  } catch {
    return {
      valid: false,
      error: "Invalid JSON format: unable to parse content",
      status: 422,
    };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      valid: false,
      error: "Invalid collection schema: root must be an object",
      status: 422,
    };
  }

  const parsedObj = parsed as Record<string, unknown>;
  const missingKeys = REQUIRED_COLLECTION_KEYS.filter(
    (key) => !(key in parsedObj) || parsedObj[key] === undefined
  );

  if (missingKeys.length > 0) {
    return {
      valid: false,
      error: `Invalid collection schema: missing required keys (${missingKeys.join(", ")})`,
      status: 422,
    };
  }

  return {
    valid: true,
    base64Content: base64,
    rawUtf8Content: rawUtf8,
  };
}

function revalidateHomePage(): void {
  try {
    revalidatePath("/", "page");
  } catch (err) {
    console.warn("[github-proxy] revalidatePath warning:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyToken(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const {
      action,
      path: targetPath,
      content,
      encoding = "utf-8",
      message = "Update data via Admin CMS",
      sha,
    } = body;

    if (!action || !targetPath || typeof targetPath !== "string") {
      return NextResponse.json(
        { success: false, error: "Action and path are required" },
        { status: 400 }
      );
    }

    if (action !== "get-sha" && action !== "save-file") {
      return NextResponse.json(
        { success: false, error: `Unknown action: ${String(action)}` },
        { status: 400 }
      );
    }

    // Path normalization and allowlist enforcement
    const sanitizedPath = path.normalize(targetPath).replace(/\\/g, "/").replace(/^\/+/, "");

    if (sanitizedPath !== ALLOWED_TARGET_PATH) {
      return NextResponse.json(
        { success: false, error: "Access to the requested path is forbidden" },
        { status: 403 }
      );
    }

    // SEC-03: Validate content schema for save-file
    let validationResult: ValidationSuccess | null = null;
    if (action === "save-file") {
      if (content === undefined || typeof content !== "string") {
        return NextResponse.json(
          { success: false, error: "Content is required for save-file" },
          { status: 400 }
        );
      }

      const validation = validateCollectionContent(content, String(encoding));
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: validation.status }
        );
      }
      validationResult = validation;
    }

    const githubPat = process.env.GITHUB_PAT?.trim();
    const githubOwner = process.env.GITHUB_OWNER || "cotanjant";
    const githubRepo = process.env.GITHUB_REPO || "teamalazfrc";
    const githubBranch = process.env.GITHUB_BRANCH || "main";

    const isPatConfigured = Boolean(githubPat && githubPat !== "github_pat_your_token_here");

    // ARCH-03: Ephemeral guard against serverless data loss in production
    if (process.env.NODE_ENV === "production" && !isPatConfigured) {
      return NextResponse.json(
        {
          success: false,
          error: "Misconfigured: GITHUB_PAT is required in production",
        },
        { status: 500 }
      );
    }

    // GITHUB REMOTE MODE
    if (isPatConfigured) {
      const ghUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${sanitizedPath}?ref=${githubBranch}`;

      if (action === "get-sha") {
        const ghRes = await fetch(ghUrl, {
          headers: {
            Authorization: `Bearer ${githubPat}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "Team-ALAZ-Admin-CMS",
          },
        });

        if (ghRes.status === 404) {
          return NextResponse.json({ success: true, sha: null, exists: false });
        }

        if (!ghRes.ok) {
          const errText = await ghRes.text();
          console.error("[github-proxy] GitHub get-sha error:", ghRes.status, errText);
          return NextResponse.json(
            { success: false, error: "Failed to fetch file metadata from GitHub" },
            { status: ghRes.status }
          );
        }

        const data = await ghRes.json();
        return NextResponse.json({ success: true, sha: data.sha, exists: true });
      }

      if (action === "save-file" && validationResult) {
        // Get latest SHA if not passed
        let fileSha = typeof sha === "string" ? sha : undefined;
        if (!fileSha) {
          const existingRes = await fetch(ghUrl, {
            headers: {
              Authorization: `Bearer ${githubPat}`,
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "Team-ALAZ-Admin-CMS",
            },
          });
          if (existingRes.ok) {
            const existingData = await existingRes.json();
            fileSha = existingData.sha;
          }
        }

        const putRes = await fetch(
          `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${sanitizedPath}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${githubPat}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
              "User-Agent": "Team-ALAZ-Admin-CMS",
            },
            body: JSON.stringify({
              message: typeof message === "string" ? message : "Update data via Admin CMS",
              content: validationResult.base64Content,
              branch: githubBranch,
              ...(fileSha ? { sha: fileSha } : {}),
            }),
          }
        );

        if (!putRes.ok) {
          const errText = await putRes.text();
          console.error("[github-proxy] GitHub commit error:", putRes.status, errText);
          return NextResponse.json(
            { success: false, error: "Failed to save file to GitHub repository" },
            { status: putRes.status }
          );
        }

        const putData = await putRes.json();

        // ARCH-05: Invalidate homepage cache after successful save
        revalidateHomePage();

        return NextResponse.json({
          success: true,
          commitSha: putData.commit?.sha,
          contentSha: putData.content?.sha,
          message: "Saved to GitHub repository",
        });
      }
    }

    // LOCAL DEVELOPMENT FALLBACK (Direct disk read/write)
    const localRoot = process.cwd();
    const resolvedPath = path.resolve(localRoot, sanitizedPath);

    // Security check: ensure path is inside localRoot
    if (!resolvedPath.startsWith(localRoot)) {
      return NextResponse.json(
        { success: false, error: "Illegal path resolution" },
        { status: 403 }
      );
    }

    if (action === "get-sha") {
      try {
        const fileBuffer = await fs.readFile(resolvedPath);
        const hash = crypto.createHash("sha1").update(fileBuffer).digest("hex");
        return NextResponse.json({ success: true, sha: hash, exists: true, mode: "local" });
      } catch (err: unknown) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
          return NextResponse.json({ success: true, sha: null, exists: false, mode: "local" });
        }
        console.error("[github-proxy] Local file read error:", err);
        return NextResponse.json(
          { success: false, error: "Failed to read local file" },
          { status: 500 }
        );
      }
    }

    if (action === "save-file" && validationResult) {
      try {
        await fs.mkdir(path.dirname(resolvedPath), { recursive: true });

        if (encoding === "base64") {
          const fileBuffer = Buffer.from(validationResult.base64Content, "base64");
          await fs.writeFile(resolvedPath, fileBuffer);
        } else {
          await fs.writeFile(resolvedPath, validationResult.rawUtf8Content, "utf-8");
        }
      } catch (fsErr) {
        console.error("[github-proxy] Local file write error:", fsErr);
        return NextResponse.json(
          { success: false, error: "Failed to save file to local filesystem" },
          { status: 500 }
        );
      }

      // ARCH-05: Invalidate homepage cache after successful save
      revalidateHomePage();

      return NextResponse.json({
        success: true,
        message: "Saved directly to local filesystem",
        path: sanitizedPath,
        mode: "local",
      });
    }

    return NextResponse.json(
      { success: false, error: `Unknown action: ${String(action)}` },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("[github-proxy] Unhandled exception:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while processing the request" },
      { status: 500 }
    );
  }
}


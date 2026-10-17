import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";
import * as fs from "fs/promises";
import * as path from "path";

const SESSION_COOKIE_NAME = "alaz_admin_session";
const ALLOWED_TARGET_PATH = "src/data/collection.json";

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

function verifyToken(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return false;
  }

  const expectedToken = crypto
    .createHmac("sha256", adminPassword)
    .update("authenticated_admin_session_v1")
    .digest("hex");

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

  return safeCompare(token, expectedToken);
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyToken(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, path: targetPath, content, encoding = "utf-8", message = "Update data via Admin CMS", sha } = body;

    if (!action || !targetPath || typeof targetPath !== "string") {
      return NextResponse.json(
        { success: false, error: "Action and path are required" },
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

    const githubPat = process.env.GITHUB_PAT?.trim();
    const githubOwner = process.env.GITHUB_OWNER || "cotanjant";
    const githubRepo = process.env.GITHUB_REPO || "teamalazfrc";
    const githubBranch = process.env.GITHUB_BRANCH || "main";

    // GITHUB REMOTE MODE
    if (githubPat && githubPat !== "github_pat_your_token_here") {
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
          return NextResponse.json(
            { success: false, error: `GitHub error: ${errText}` },
            { status: ghRes.status }
          );
        }

        const data = await ghRes.json();
        return NextResponse.json({ success: true, sha: data.sha, exists: true });
      }

      if (action === "save-file") {
        if (content === undefined) {
          return NextResponse.json(
            { success: false, error: "Content is required for save-file" },
            { status: 400 }
          );
        }

        let base64Content = "";
        if (encoding === "base64") {
          base64Content = content;
        } else {
          base64Content = Buffer.from(content, "utf-8").toString("base64");
        }

        // Get latest SHA if not passed
        let fileSha = sha;
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

        const putRes = await fetch(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${sanitizedPath}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubPat}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            "User-Agent": "Team-ALAZ-Admin-CMS",
          },
          body: JSON.stringify({
            message,
            content: base64Content,
            branch: githubBranch,
            ...(fileSha ? { sha: fileSha } : {}),
          }),
        });

        if (!putRes.ok) {
          const errText = await putRes.text();
          return NextResponse.json(
            { success: false, error: `GitHub commit error: ${errText}` },
            { status: putRes.status }
          );
        }

        const putData = await putRes.json();
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
        throw err;
      }
    }

    if (action === "save-file") {
      if (content === undefined) {
        return NextResponse.json(
          { success: false, error: "Content is required for save-file" },
          { status: 400 }
        );
      }

      await fs.mkdir(path.dirname(resolvedPath), { recursive: true });

      if (encoding === "base64") {
        const fileBuffer = Buffer.from(content, "base64");
        await fs.writeFile(resolvedPath, fileBuffer);
      } else {
        await fs.writeFile(resolvedPath, content, "utf-8");
      }

      return NextResponse.json({
        success: true,
        message: "Saved directly to local filesystem",
        path: sanitizedPath,
        mode: "local",
      });
    }

    return NextResponse.json(
      { success: false, error: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

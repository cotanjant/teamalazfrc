import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isVercel = Boolean(process.env.VERCEL);

const nextConfig: NextConfig = {
  output:
    !isVercel && (process.env.BUILD_STANDALONE || (process.platform !== "win32" && process.env.NODE_ENV === "production"))
      ? "standalone"
      : undefined,
  outputFileTracingRoot: isVercel ? undefined : __dirname,
  reactStrictMode: true,
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: false,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

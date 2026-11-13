import type { NextConfig } from "next";
import { withUnpeek } from "unpeek/next";

const projectRoot = typeof __dirname !== "undefined" ? __dirname : process.cwd();
const isVercel = Boolean(process.env.VERCEL);

const nextConfig = {
  output:
    !isVercel && (process.env.BUILD_STANDALONE || (process.platform !== "win32" && process.env.NODE_ENV === "production"))
      ? "standalone"
      : undefined,
  outputFileTracingRoot: isVercel ? undefined : projectRoot,
  reactStrictMode: true,
  reactCompiler: true,
  supportsImmutableAssets: false,
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
} satisfies NextConfig;

export default withUnpeek(nextConfig, {
  deterrentMode: "gradual",
  injectRuntimeShield: true,
});

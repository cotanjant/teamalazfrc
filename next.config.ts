import type { NextConfig } from "next";
import { transformJavaScript, computeFnv1aHash } from "unpeek";

const projectRoot = typeof __dirname !== "undefined" ? __dirname : process.cwd();
const isVercel = Boolean(process.env.VERCEL);

const nextConfig: NextConfig = {
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
  webpack: (config, { dev, isServer, webpack }) => {
    if (!dev && !isServer) {
      const baseSeed = Math.floor(Math.random() * 2147483647) || 322420463;
      interface WebpackCompilation {
        hooks: {
          processAssets: {
            tap(
              opts: { name: string; stage: number },
              cb: (assets: Record<string, unknown>) => void
            ): void;
          };
        };
        getAsset(name: string): { source: { source(): string | Buffer } } | undefined;
        updateAsset(name: string, source: unknown): void;
      }
      interface WebpackCompiler {
        hooks: {
          thisCompilation: {
            tap(name: string, cb: (compilation: WebpackCompilation) => void): void;
          };
        };
      }
      config.plugins.push({
        name: "unpeek-nextjs-assets",
        apply(compiler: WebpackCompiler) {
          compiler.hooks.thisCompilation.tap("unpeek-nextjs-assets", (compilation) => {
            compilation.hooks.processAssets.tap(
              {
                name: "unpeek-nextjs-assets",
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
              },
              (assets) => {
                for (const name of Object.keys(assets)) {
                  if (!name.endsWith(".js") || !name.startsWith("static/chunks/")) continue;
                  const asset = compilation.getAsset(name);
                  if (!asset) continue;
                  const code = asset.source.source().toString();
                  const seed = computeFnv1aHash(name, baseSeed);
                  const result = transformJavaScript(code, {
                    seed,
                    filename: name,
                    injectRuntimeShield: true,
                    deterrentMode: "gradual",
                  });
                  compilation.updateAsset(name, new webpack.sources.RawSource(result.code));
                }
              }
            );
          });
        },
      });
    }
    return config;
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

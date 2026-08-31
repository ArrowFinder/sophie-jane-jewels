import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const pagesBase = "/sophie-jane-jewels";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? pagesBase : "",
  },
  ...(isGithubPages
    ? {
        output: "export" as const,
        basePath: pagesBase,
        assetPrefix: pagesBase,
        trailingSlash: true,
      }
    : {}),
  images: {
    unoptimized: isGithubPages,
    // Local art placeholders are SVG; allow the optimizer to serve them.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "*.myshopify.com" },
    ],
  },
  ...(!isGithubPages
    ? {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "X-DNS-Prefetch-Control", value: "on" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
              ],
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;

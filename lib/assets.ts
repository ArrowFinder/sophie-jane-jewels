/** GitHub Pages is served from /sophie-jane-jewels; localhost has no prefix. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a local public-file path. Leave Shopify/CDN URLs alone. */
export function assetPath(path: string): string {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}

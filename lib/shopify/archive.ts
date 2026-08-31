import type { Product } from "@/lib/shopify/types";

/**
 * Previously sold pieces.
 *
 * In Shopify: keep the product published, set inventory to 0, tag it `sold`,
 * remove it from selling collections, and add it to the collection whose
 * handle is `sold-archives` (mapped from /archive). The site then serves it
 * at /archive/[handle] (and 301s the old /products URL).
 */
export const ARCHIVE_HANDLE = "archive";

export function isSold(product: Product): boolean {
  if (!product.availableForSale) return true;
  return product.tags.some((t) => t === "sold" || t === "archive" || t === "previously-sold");
}

export function pieceHref(product: Product): string {
  return isSold(product) ? `/archive/${product.handle}` : `/products/${product.handle}`;
}

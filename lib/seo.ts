import type { Product } from "@/lib/shopify/types";
import { siteConfig } from "@/lib/site";
import { isSold } from "@/lib/shopify/archive";

/** Title that can rank for long-tail queries like "vintage gold sapphire ring 1850". */
export function pieceSeoTitle(product: Product): string {
  if (product.seo.title && product.seo.title.length > 12) {
    return product.seo.title.replace(/\s*\|\s*Sophie Jane Jewels\s*$/i, "");
  }
  const circa = product.details?.circa;
  const core = circa && !product.title.includes(circa) ? `${product.title}, ${circa}` : product.title;
  return isSold(product) ? `${core} — Previously Sold` : `${core} | Antique Jewelry`;
}

export function pieceSeoDescription(product: Product): string {
  if (product.seo.description && product.seo.description.length > 80) {
    return product.seo.description;
  }
  const d = product.details;
  const facts = [d?.era, d?.circa, d?.material, d?.stone, product.productType]
    .filter(Boolean)
    .join(", ");
  if (isSold(product)) {
    return `${product.title} — previously sold at ${siteConfig.name}. ${facts}. Browse the archive of one-of-a-kind antique and vintage jewels, and shop similar pieces available now.`;
  }
  return product.description.slice(0, 155);
}

export function archiveIndexTitle() {
  return "Archive of Previously Sold Antique & Vintage Jewelry";
}

export function archiveIndexDescription() {
  return `Explore Sophie Jane's archive of previously sold antique, vintage and estate jewelry — Victorian gold, sapphire rings, Georgian diamonds, Art Deco platinum and more, sourced since ${siteConfig.est}. Shop similar pieces available now, or ask Sophie to find yours.`;
}

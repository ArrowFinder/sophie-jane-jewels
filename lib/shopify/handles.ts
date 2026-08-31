/**
 * Pretty site handles → actual Shopify collection handles on
 * sophiejanejewels.com. Keep URLs stable (/collections/rings) even when
 * Shopify's handle is longer.
 */
export const collectionAliases: Record<string, string> = {
  rings: "vintage-antique-rings",
  earrings: "vintage-estate-earrings",
  bracelets: "vintage-bracelets",
  necklaces: "necklaces",
  engagement: "engagement-rings",
  "antique-jewelry": "antique-jewelry",
  "vintage-jewelry": "vintage-estate-jewelry",
  "new-arrivals": "new-arrivals",
  victorian: "victorian-jewelry",
  "art-deco": "art-deco-jewelry-1",
  "art-nouveau": "art-nouveau-jewelry",
  edwardian: "edwardian-jewelry-1890s-to-1910s",
  georgian: "georgian-jewelry-1714-1840",
  retro: "retro-jewelry-1940s-to-1950s",
  "mid-century": "mid-century-vintage-jewelry",
  sapphire: "sapphire-antique-and-vintage-jewelry",
  emerald: "emerald-antique-and-vintage-jewelry",
  pearl: "pearl-antique-and-vintage-jewelry",
  turquoise: "turquoise-vintage-jewelry",
  snake: "vintage-antique-snake-jewelry",
  archive: "sold-archives",
};

export function toShopifyHandle(siteHandle: string): string {
  return collectionAliases[siteHandle] ?? siteHandle;
}

export function toSiteHandle(shopifyHandle: string): string {
  const match = Object.entries(collectionAliases).find(([, value]) => value === shopifyHandle);
  return match?.[0] ?? shopifyHandle;
}

export const PAGE_SIZE = 24;

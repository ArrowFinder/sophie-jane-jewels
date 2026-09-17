import { toSiteHandle } from "./handles";

/** Lifestyle frames used in the shop strip / mega menu, preferred over generic collection art. */
const atmosphereByHandle: Record<string, string> = {
  rings: "/photos/shop-rings.png",
  "vintage-antique-rings": "/photos/shop-rings.png",
  necklaces: "/photos/shop-necklaces.png",
  earrings: "/photos/shop-earrings.png",
  "vintage-estate-earrings": "/photos/shop-earrings.png",
  bracelets: "/photos/shop-bracelets.png",
  "vintage-bracelets": "/photos/shop-bracelets.png",
  engagement: "/photos/shop-engagement.png",
  "engagement-rings": "/photos/shop-engagement.png",
  "new-arrivals": "/photos/lifestyle-marble.png",
  "one-of-a-kind": "/photos/lifestyle-marble.png",
  "sophies-picks": "/photos/hero-desert.png",
  "antique-gold": "/photos/hero-hands.png",
  archive: "/photos/lifestyle-marble.png",
  "sold-archives": "/photos/lifestyle-marble.png",
};

export function collectionAtmosphere(handle: string): string | undefined {
  return atmosphereByHandle[toSiteHandle(handle)] ?? atmosphereByHandle[handle];
}

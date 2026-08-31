/**
 * Central site configuration — single source of truth for brand metadata,
 * navigation architecture, and SEO defaults.
 */

export const siteConfig = {
  name: "Sophie Jane Jewels",
  shortName: "Sophie Jane",
  legalName: "Sophie Jane Jewels",
  // Update to the production domain when deploying.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sophiejanejewels.com",
  locale: "en_US",
  est: "2001",
  tagline: "Fine Antique & Estate Jewelry",
  curatorLine: "Antique & vintage jewelry, chosen by eye.",
  description:
    "Fine antique, vintage and estate jewelry — rare, one-of-a-kind treasures with history and meaning, curated in Los Angeles by Sophie Jane since 2001.",
  email: "hello@sophiejanejewels.com",
  phone: "",
  founder: "Sophie Jane",
  social: {
    instagram: "https://www.instagram.com/",
    pinterest: "https://www.pinterest.com/",
  },
  addressLocality: "Los Angeles",
  addressRegion: "California",
} as const;

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavColumn = {
  heading: string;
  links: NavLink[];
};

export type NavItem = {
  label: string;
  href: string;
  /** Optional mega-menu content */
  columns?: NavColumn[];
  /** Optional featured card in the mega menu */
  feature?: {
    eyebrow: string;
    title: string;
    href: string;
    imageHandle: string;
    image?: string;
  };
};

/**
 * Primary navigation — an intentional, curated architecture rather than a
 * dump of every collection. Shop is organized by the way collectors actually
 * browse: what's new, what's rare, by type, and by Sophie's own eye.
 */
export const mainNav: NavItem[] = [
  {
    label: "Shop",
    href: "/collections",
    columns: [
      {
        heading: "By Type",
        links: [
          { label: "New Arrivals", href: "/collections/new-arrivals" },
          { label: "Engagement", href: "/collections/engagement" },
          { label: "Rings", href: "/collections/rings" },
          { label: "Necklaces", href: "/collections/necklaces" },
          { label: "Earrings", href: "/collections/earrings" },
          { label: "Bracelets", href: "/collections/bracelets" },
          { label: "Antique Gold", href: "/collections/antique-gold" },
          { label: "One of a Kind", href: "/collections/one-of-a-kind" },
          { label: "The Archive", href: "/archive" },
        ],
      },
      {
        heading: "By Era",
        links: [
          { label: "Georgian", href: "/collections/georgian" },
          { label: "Victorian", href: "/collections/victorian" },
          { label: "Art Nouveau", href: "/collections/art-nouveau" },
          { label: "Edwardian", href: "/collections/edwardian" },
          { label: "Art Deco", href: "/collections/art-deco" },
          { label: "Retro & Mid-Century", href: "/collections/retro" },
        ],
      },
      {
        heading: "By Stone",
        links: [
          { label: "Diamond", href: "/collections/diamond" },
          { label: "Sapphire", href: "/collections/sapphire" },
          { label: "Emerald", href: "/collections/emerald" },
          { label: "Turquoise", href: "/collections/turquoise" },
          { label: "Pearl", href: "/collections/pearl" },
          { label: "View All Collections", href: "/collections" },
        ],
      },
    ],
    feature: {
      eyebrow: "Just In",
      title: "Shop New Arrivals",
      href: "/collections/new-arrivals",
      imageHandle: "product-07",
      image: "/photos/lifestyle-marble.png",
    },
  },
  {
    label: "New Arrivals",
    href: "/collections/new-arrivals",
  },
  {
    label: "Engagement",
    href: "/collections/engagement",
  },
  {
    label: "Archive",
    href: "/archive",
  },
  {
    label: "Journal",
    href: "/journal",
  },
  {
    label: "About",
    href: "/about",
  },
];

export const footerNav: NavColumn[] = [
  {
    heading: "Shop",
    links: [
      { label: "Engagement Rings", href: "/collections/engagement" },
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Rings", href: "/collections/rings" },
      { label: "Necklaces", href: "/collections/necklaces" },
      { label: "Earrings", href: "/collections/earrings" },
      { label: "Bracelets", href: "/collections/bracelets" },
    ],
  },
  {
    heading: "By Era & Stone",
    links: [
      { label: "Victorian", href: "/collections/victorian" },
      { label: "Art Deco", href: "/collections/art-deco" },
      { label: "Edwardian", href: "/collections/edwardian" },
      { label: "Antique Gold", href: "/collections/antique-gold" },
      { label: "Sapphire", href: "/collections/sapphire" },
      { label: "Diamond", href: "/collections/diamond" },
    ],
  },
  {
    heading: "Discover",
    links: [
      { label: "The Archive", href: "/archive" },
      { label: "Sophie's Picks", href: "/collections/sophies-picks" },
      { label: "The Journal", href: "/journal" },
      { label: "About Sophie", href: "/about" },
      { label: "Find Your Piece", href: "/find-your-piece" },
    ],
  },
  {
    heading: "Client Care",
    links: [
      { label: "Contact", href: "/find-your-piece" },
      { label: "Shipping & Returns", href: "/journal/shipping-and-care" },
      { label: "Jewelry Care", href: "/journal/caring-for-antique-jewelry" },
      { label: "Authenticity", href: "/journal/how-we-authenticate" },
      { label: "Sizing & Resizing", href: "/journal/ring-sizing-guide" },
    ],
  },
];

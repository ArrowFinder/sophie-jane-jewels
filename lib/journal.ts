/**
 * The Journal — editorial + educational content. This is a core SEO surface
 * (era/stone/material guides, buying education, stories behind pieces) and the
 * clearest expression of Sophie's expertise. In production this could be
 * sourced from a CMS or Shopify blog; here it lives as structured content.
 */

export type JournalBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

export type JournalTopic = "guides" | "stories" | "education" | "care";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  topic: JournalTopic;
  topicLabel: string;
  heroArt: string;
  readingMinutes: number;
  date: string;
  author: string;
  seoDescription: string;
  /** Related product handles to weave commerce into editorial. */
  relatedProducts?: string[];
  relatedCollections?: string[];
  body: JournalBlock[];
};

export const topicLabels: Record<JournalTopic, string> = {
  guides: "Guides",
  stories: "Stories",
  education: "Education",
  care: "Care",
};

export const articles: Article[] = [
  {
    slug: "antique-vs-vintage-jewelry",
    title: "Antique vs. Vintage: What the Words Actually Mean",
    excerpt:
      "The terms get used interchangeably, but they describe two different worlds. A short, practical guide to the vocabulary of old jewelry.",
    topic: "guides",
    topicLabel: "Guides",
    heroArt: "journal-01",
    readingMinutes: 4,
    date: "2026-08-12",
    author: "Sophie Jane",
    seoDescription:
      "What's the difference between antique, vintage and estate jewelry? A clear, practical guide to the terms from Sophie Jane Jewels.",
    relatedCollections: ["antique-jewelry", "vintage-jewelry"],
    body: [
      {
        type: "p",
        text: "If you've spent any time shopping for old jewelry, you've seen the words antique, vintage and estate used almost interchangeably. They aren't the same thing, and knowing the difference will make you a sharper, more confident collector.",
      },
      { type: "h2", text: "Antique means 100 years or older" },
      {
        type: "p",
        text: "Strictly speaking, a piece is antique once it passes the century mark. In practice, that means Georgian, Victorian, Art Nouveau and Edwardian jewelry — pieces made in a world before mass production, almost entirely by hand. You can feel it in the slightly irregular cuts, the hand-pierced galleries, the warmth of high-karat gold.",
      },
      { type: "h2", text: "Vintage covers most of the 20th century" },
      {
        type: "p",
        text: "Vintage is the softer term. It generally describes pieces at least twenty to thirty years old — Art Deco, Retro, mid-century and the color-drenched jewelry of the 1970s. Vintage is where a lot of collectors begin: the design is extraordinary, and prices are often more approachable than true antiques.",
      },
      { type: "h2", text: "Estate simply means previously owned" },
      {
        type: "p",
        text: "Estate is the term that trips people up. It doesn't refer to an age at all — it just means a piece has had a previous owner. An estate ring could be antique, vintage or nearly new. When we describe something as estate, we're telling you it has already lived one life and is ready for the next.",
      },
      {
        type: "quote",
        text: "The label matters less than the piece. But knowing the vocabulary means no one can ever sell you a story you didn't ask for.",
      },
      {
        type: "p",
        text: "When in doubt, ask about the specifics: the era, the karat, the cut of the stones. A good dealer will always tell you exactly what you're looking at — and why it's special.",
      },
    ],
  },
  {
    slug: "guide-to-diamond-cuts-old-mine-old-european",
    title: "A Field Guide to Antique Diamond Cuts",
    excerpt:
      "Old mine, old European, rose cut — why century-old diamonds glow differently, and how to recognize each one.",
    topic: "guides",
    topicLabel: "Guides",
    heroArt: "journal-02",
    readingMinutes: 6,
    date: "2026-08-05",
    author: "Sophie Jane",
    seoDescription:
      "Learn to recognize antique diamond cuts — old mine, old European and rose cut — and understand why they sparkle differently from modern brilliants.",
    relatedProducts: ["victorian-old-mine-diamond-cluster-ring", "edwardian-diamond-solitaire-ring"],
    relatedCollections: ["antique-jewelry"],
    body: [
      {
        type: "p",
        text: "Modern diamonds are cut by machine to scatter as much light as possible. Antique diamonds were cut by hand, by candlelight, to do something subtler — to glow. Once you learn to see the difference, you can't unsee it.",
      },
      { type: "h2", text: "Rose cut (17th–19th century)" },
      {
        type: "p",
        text: "The oldest cut you'll commonly encounter. A flat base rises to a dome of triangular facets — like an unopened rosebud. Rose cuts don't sparkle so much as shimmer, which is exactly why they were beloved in candlelit rooms.",
      },
      { type: "h2", text: "Old mine cut (18th–19th century)" },
      {
        type: "p",
        text: "Chunky, cushion-shaped and full of character, with a high crown and a small flat facet on top (the culet). Old mine cuts have a warm, blocky flash that reads as unmistakably antique.",
      },
      { type: "h2", text: "Old European cut (late 19th–early 20th century)" },
      {
        type: "p",
        text: "The direct ancestor of the modern round brilliant, but rounder in feel and softer in light return. Old Europeans have a beautiful 'crushed ice' glow and are the classic choice for an antique engagement ring.",
      },
      {
        type: "quote",
        text: "A modern diamond flashes at you. An old cut invites you closer. That difference is the whole romance of antique jewelry.",
      },
    ],
  },
  {
    slug: "understanding-antique-gold-karats-and-color",
    title: "Why Antique Gold Looks Different",
    excerpt:
      "The warm, almost pink glow of old gold isn't your imagination. A short guide to karats, alloys and color.",
    topic: "guides",
    topicLabel: "Guides",
    heroArt: "journal-03",
    readingMinutes: 4,
    date: "2026-07-28",
    author: "Sophie Jane",
    seoDescription:
      "Antique gold has a warmth modern gold can't match. Learn how karat, alloy and hand-fabrication give antique gold jewelry its distinctive color.",
    relatedCollections: ["antique-gold"],
    body: [
      {
        type: "p",
        text: "Collectors talk about the color of antique gold the way wine people talk about terroir. There's a reason. Older gold really does look different — softer, warmer, a touch pink or green depending on the era and origin.",
      },
      { type: "h2", text: "It often starts with a higher karat" },
      {
        type: "p",
        text: "Much antique English gold is 15k or 18k; Georgian and early Victorian pieces are frequently higher still. More pure gold means a deeper, warmer color than the 10k and 14k that dominate the mass market today.",
      },
      { type: "h2", text: "And it ends with the alloy" },
      {
        type: "p",
        text: "The metals mixed with gold — copper for warmth, silver for coolness — were hand-measured in small workshops, batch by batch. That variability is exactly what gives antique gold its living, hand-made color.",
      },
      {
        type: "list",
        items: [
          "Rosy, warm gold: higher copper content, common in Retro and Victorian pieces.",
          "Greenish gold: more silver, often seen in Art Nouveau work.",
          "Deep, buttery yellow: high-karat Georgian and Etruscan Revival gold.",
        ],
      },
    ],
  },
  {
    slug: "how-we-authenticate",
    title: "How Every Piece Is Vetted",
    excerpt:
      "Provenance, hallmarks, construction, stones. The process behind every piece before it earns a place in the collection.",
    topic: "education",
    topicLabel: "Education",
    heroArt: "journal-04",
    readingMinutes: 5,
    date: "2026-07-20",
    author: "Sophie Jane",
    seoDescription:
      "How Sophie Jane Jewels authenticates antique and vintage jewelry: hallmarks, construction, stone assessment and provenance.",
    body: [
      {
        type: "p",
        text: "Every piece in the collection has been through the same process before it ever appears on this site. It's not glamorous, but it's the reason you can buy with confidence.",
      },
      {
        type: "list",
        items: [
          "Hallmarks and maker's marks are read and dated against reference archives.",
          "Construction is examined under magnification — hand-fabrication tells a very different story than casting.",
          "Stones are assessed for cut, era-appropriateness and condition.",
          "Provenance is documented wherever it exists, and never invented where it doesn't.",
          "Anything requiring conservation is handled by specialist antique jewelers, never over-restored.",
        ],
      },
      {
        type: "quote",
        text: "The goal is never to make an old piece look new. It's to make sure it can be worn and loved for another hundred years.",
      },
    ],
  },
  {
    slug: "caring-for-antique-jewelry",
    title: "Living With Antique Jewelry",
    excerpt:
      "These pieces have survived a century or more. A few simple habits will carry them through the next one.",
    topic: "care",
    topicLabel: "Care",
    heroArt: "journal-05",
    readingMinutes: 4,
    date: "2026-07-10",
    author: "Sophie Jane",
    seoDescription:
      "Practical care tips for antique and vintage jewelry: cleaning, storage, wear and when to see a specialist jeweler.",
    body: [
      {
        type: "p",
        text: "The single best thing you can do for an antique piece is wear it. Gold loves skin. But a handful of small habits will keep your jewelry beautiful for generations.",
      },
      { type: "h2", text: "Everyday habits" },
      {
        type: "list",
        items: [
          "Put jewelry on last — after perfume, lotion and hairspray.",
          "Take rings off before gardening, cleaning or the gym.",
          "Store pieces separately so they can't scratch one another.",
          "Keep foil-back and closed-set stones away from water; the foil can be damaged by moisture.",
        ],
      },
      { type: "h2", text: "Cleaning" },
      {
        type: "p",
        text: "For most pieces, a soft brush and warm (not hot) soapy water is plenty. Avoid ultrasonic cleaners entirely for antique and foiled stones — they can loosen old settings and destroy foil backings.",
      },
    ],
  },
  {
    slug: "shipping-and-care",
    title: "Shipping, Returns & the Details",
    excerpt:
      "How pieces travel to you, what happens if something isn't right, and everything else you might want to know.",
    topic: "care",
    topicLabel: "Care",
    heroArt: "journal-06",
    readingMinutes: 3,
    date: "2026-07-01",
    author: "Sophie Jane",
    seoDescription:
      "Shipping, returns and client-care details for Sophie Jane Jewels — insured delivery, considered returns and complimentary services.",
    body: [
      { type: "h2", text: "Shipping" },
      {
        type: "p",
        text: "Every order ships fully insured and signature-required, beautifully packaged and ready to gift. Domestic orders typically arrive within three to five business days; international shipping is available on request.",
      },
      { type: "h2", text: "Returns" },
      {
        type: "p",
        text: "Because these are one-of-a-kind pieces, we want you to be completely sure. Unworn pieces may be returned within fourteen days of delivery for a full refund. Resized rings and custom work are final sale.",
      },
      { type: "h2", text: "A standing invitation" },
      {
        type: "p",
        text: "If you ever have a question about a piece — before or long after you buy — write to us. We keep records on everything we sell and are always happy to talk.",
      },
    ],
  },
  {
    slug: "ring-sizing-guide",
    title: "Finding Your Ring Size (and Resizing Antiques)",
    excerpt:
      "How to measure at home, and what can — and can't — be safely resized in an antique ring.",
    topic: "guides",
    topicLabel: "Guides",
    heroArt: "journal-02",
    readingMinutes: 4,
    date: "2026-06-24",
    author: "Sophie Jane",
    seoDescription:
      "How to find your ring size at home and understand which antique and vintage rings can be safely resized.",
    relatedCollections: ["rings"],
    body: [
      { type: "h2", text: "Measuring at home" },
      {
        type: "p",
        text: "Wrap a strip of paper around the base of your finger, mark where it overlaps, and measure the length in millimeters. That circumference maps directly to a US ring size — write to us with the number and we'll confirm it.",
      },
      { type: "h2", text: "What can be resized" },
      {
        type: "p",
        text: "Most plain and diamond-set antique rings can be resized a size or two in either direction by a specialist. What we approach with caution: full eternity bands, rings with delicate hand-engraving across the shank, and pieces with foiled or closed-set stones. We'll always tell you honestly what a given piece can take.",
      },
      {
        type: "quote",
        text: "A resize is a small surgery on a century-old object. It should only ever be done by someone who works on antiques.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByTopic(topic?: string): Article[] {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  if (!topic || !(topic in topicLabels)) return sorted;
  return sorted.filter((a) => a.topic === topic);
}

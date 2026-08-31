import type { Collection, Product, ProductVariant } from "./types";

/**
 * Curated sample catalog used when Shopify is not yet connected. Every field
 * mirrors the shape returned by the Storefront API, so swapping to live data
 * requires no component changes — only environment variables.
 */

const CURRENCY = "USD";
const now = "2026-08-20T12:00:00Z";

function money(amount: number) {
  return { amount: amount.toFixed(2), currencyCode: CURRENCY };
}

function img(name: string, alt: string, portrait = true) {
  return {
    url: `/art/${name}.svg`,
    altText: alt,
    width: 1100,
    height: portrait ? 1375 : 900,
  };
}

type MockProduct = Product & { collections: string[] };

let handleCounter = 0;
const ringSizes = ["5", "5.5", "6", "6.5", "7", "7.5"];

function build(input: {
  handle: string;
  title: string;
  price: number;
  productType: string;
  art: string;
  description: string;
  sophiesNote: string;
  details: NonNullable<Product["details"]>;
  tags: string[];
  collections: string[];
  sized?: boolean;
  soldOut?: boolean;
  createdAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}): MockProduct {
  handleCounter += 1;
  const id = `gid://shopify/Product/${1000 + handleCounter}`;
  const alt = `${input.title} — antique and vintage jewelry from Sophie Jane Jewels`;

  const variants: ProductVariant[] = input.sized
    ? ringSizes.map((size, i) => ({
        id: `${id}/variant/${i}`,
        title: `Size ${size}`,
        availableForSale: !input.soldOut && size !== "5",
        quantityAvailable: size === "5" ? 0 : 1,
        selectedOptions: [{ name: "Ring Size", value: size }],
        price: money(input.price),
      }))
    : [
        {
          id: `${id}/variant/0`,
          title: "One Size",
          availableForSale: !input.soldOut,
          quantityAvailable: input.soldOut ? 0 : 1,
          selectedOptions: [{ name: "Size", value: "One Size" }],
          price: money(input.price),
        },
      ];

  return {
    id,
    handle: input.handle,
    title: input.title,
    description: input.description,
    descriptionHtml: `<p>${input.description}</p>`,
    availableForSale: !input.soldOut,
    productType: input.productType,
    vendor: "Sophie Jane Jewels",
    tags: input.tags,
    featuredImage: img(input.art, alt),
    images: [img(input.art, alt), img(`${input.art}-b`, `${input.title}, alternate view`)],
    options: input.sized
      ? [{ id: `${id}/opt/0`, name: "Ring Size", values: ringSizes }]
      : [{ id: `${id}/opt/0`, name: "Size", values: ["One Size"] }],
    variants,
    priceRange: {
      minVariantPrice: money(input.price),
      maxVariantPrice: money(input.price),
    },
    seo: {
      title:
        input.seoTitle ??
        (input.soldOut
          ? `${input.title}${input.details.circa ? `, ${input.details.circa}` : ""} — Previously Sold`
          : `${input.title} | ${input.details.era ?? "Antique"} Jewelry`),
      description: input.seoDescription ?? input.description.slice(0, 155),
    },
    updatedAt: now,
    createdAt: input.createdAt ?? now,
    details: input.details,
    sophiesNote: input.sophiesNote,
    collections: input.collections,
  };
}

export const mockProducts: MockProduct[] = [
  build({
    handle: "victorian-old-mine-diamond-cluster-ring",
    title: "Victorian Old Mine Cluster Ring",
    price: 6800,
    productType: "Rings",
    art: "product-01",
    description:
      "A softly domed cluster of old mine cut diamonds in 18k yellow gold, hand-fabricated circa 1880. The stones hold light the way only old cuts can — warm, uneven, and completely alive. A ring that reads as heirloom the moment it's on the hand.",
    sophiesNote:
      "This is the ring I reach for when someone says they want 'something with a little history but not fussy.' The cluster is generous but the profile stays low — it lives with you.",
    details: {
      era: "Victorian",
      circa: "c. 1880",
      material: "18k Yellow Gold",
      stone: "Old Mine Cut Diamond",
      style: "Cluster",
      origin: "English",
      condition: "Excellent antique condition",
    },
    tags: ["ring", "victorian", "diamond", "antique", "yellow-gold", "engagement", "one-of-a-kind"],
    collections: ["new-arrivals", "rings", "antique-jewelry", "antique-gold", "one-of-a-kind", "sophies-picks", "estate"],
    sized: true,
    createdAt: "2026-08-19T10:00:00Z",
  }),
  build({
    handle: "art-deco-emerald-cut-diamond-ring",
    title: "Art Deco Emerald-Cut Diamond Ring",
    price: 12400,
    productType: "Rings",
    art: "product-02",
    description:
      "Geometry at its most confident: a 1.6ct emerald-cut diamond framed by calibré-cut sapphires in platinum, circa 1925. Crisp, architectural, and unmistakably Deco — the kind of ring that looks modern precisely because it's a century old.",
    sophiesNote:
      "Deco does the impossible — it feels like the future and the past at once. Wear it with a plain gold band and let it do all the talking.",
    details: {
      era: "Art Deco",
      circa: "c. 1925",
      material: "Platinum",
      stone: "Emerald-Cut Diamond & Sapphire",
      style: "Geometric",
      origin: "French",
      condition: "Excellent",
    },
    tags: ["ring", "art-deco", "diamond", "sapphire", "platinum", "vintage", "engagement", "one-of-a-kind"],
    collections: ["new-arrivals", "rings", "vintage-jewelry", "one-of-a-kind", "featured", "estate"],
    sized: true,
    createdAt: "2026-08-18T10:00:00Z",
  }),
  build({
    handle: "georgian-foil-back-garnet-ring",
    title: "Georgian Foil-Back Garnet Ring",
    price: 3200,
    productType: "Rings",
    art: "product-03",
    description:
      "A flat-cut almandine garnet closed-set over foil in 15k gold, circa 1810. The foil makes the stone glow like a coal — a technique lost to modern jewelry. Over two hundred years old and still quietly astonishing.",
    sophiesNote:
      "Georgian pieces are where I fall hardest. Every one was made entirely by hand, and you can feel it. This garnet turns the most ordinary Tuesday into an occasion.",
    details: {
      era: "Georgian",
      circa: "c. 1810",
      material: "15k Gold",
      stone: "Foil-Back Garnet",
      style: "Closed-Set",
      origin: "English",
      condition: "Very good antique condition",
    },
    tags: ["ring", "georgian", "garnet", "antique", "gold", "one-of-a-kind"],
    collections: ["rings", "antique-jewelry", "antique-gold", "one-of-a-kind", "sophies-picks", "estate"],
    sized: true,
  }),
  build({
    handle: "retro-rose-gold-scroll-ring",
    title: "Retro Rose Gold Scroll Ring",
    price: 1450,
    productType: "Rings",
    art: "product-04",
    description:
      "1940s Retro exuberance in warm rose gold — bold scrolling shoulders rising to a citrine center. Sculptural, sunny, and endlessly wearable. Hollywood on the hand.",
    sophiesNote:
      "Retro is criminally underrated. This one is pure California optimism — it looks incredible against a tan and a linen shirt.",
    details: {
      era: "Retro",
      circa: "c. 1945",
      material: "14k Rose Gold",
      stone: "Citrine",
      style: "Scroll",
      origin: "American",
      condition: "Excellent",
    },
    tags: ["ring", "retro", "citrine", "rose-gold", "vintage"],
    collections: ["new-arrivals", "rings", "vintage-jewelry", "under-2000"],
  }),
  build({
    handle: "edwardian-diamond-solitaire-ring",
    title: "Edwardian Diamond Solitaire",
    price: 9200,
    productType: "Rings",
    art: "product-05",
    description:
      "An Old European cut diamond floats in a lace-fine platinum-over-gold mount, circa 1905. Milgrain edges and hand-pierced galleries make it feel like jewelry drawn in pencil. The definition of understated Edwardian romance.",
    sophiesNote:
      "If you want an antique engagement ring and don't know where to begin, begin here. It's classic without being expected.",
    details: {
      era: "Edwardian",
      circa: "c. 1905",
      material: "Platinum & 18k Gold",
      stone: "Old European Cut Diamond",
      style: "Solitaire",
      origin: "English",
      condition: "Excellent",
    },
    tags: ["ring", "edwardian", "diamond", "platinum", "antique", "engagement", "one-of-a-kind"],
    collections: ["rings", "antique-jewelry", "one-of-a-kind", "featured", "sophies-picks", "estate"],
    sized: true,
  }),
  build({
    handle: "mid-century-turquoise-cocktail-ring",
    title: "Mid-Century Turquoise Cocktail Ring",
    price: 1850,
    productType: "Rings",
    art: "product-06",
    description:
      "A high-domed Persian turquoise cabochon in a bright 14k gold bezel, circa 1960. Desert blue against warm gold — the whole of the Southwest in a single ring.",
    sophiesNote:
      "Turquoise is having a moment, but this piece never went out of style. It's the one I wear to Joshua Tree and never take off.",
    details: {
      era: "Mid-Century",
      circa: "c. 1960",
      material: "14k Yellow Gold",
      stone: "Persian Turquoise",
      style: "Cabochon",
      origin: "American",
      condition: "Excellent",
    },
    tags: ["ring", "mid-century", "turquoise", "vintage", "yellow-gold"],
    collections: ["new-arrivals", "rings", "vintage-jewelry", "under-2000", "sophies-picks"],
  }),
  build({
    handle: "victorian-snake-necklace-turquoise",
    title: "Victorian Snake Necklace",
    price: 8600,
    productType: "Necklaces",
    art: "product-07",
    description:
      "A fully articulated 18k gold serpent, its head pavé-set with turquoise and rose-cut diamond eyes, circa 1870. A Victorian emblem of eternal love that Queen Victoria herself made famous. Supple, heavy, and hypnotic.",
    sophiesNote:
      "A snake necklace is a statement of intent. This one moves like liquid gold and turns every neckline into an event.",
    details: {
      era: "Victorian",
      circa: "c. 1870",
      material: "18k Yellow Gold",
      stone: "Turquoise & Rose-Cut Diamond",
      style: "Serpent",
      origin: "English",
      condition: "Excellent antique condition",
    },
    tags: ["necklace", "victorian", "turquoise", "snake", "antique", "yellow-gold", "one-of-a-kind"],
    collections: ["new-arrivals", "necklaces", "antique-jewelry", "antique-gold", "one-of-a-kind", "featured", "sophies-picks", "estate"],
  }),
  build({
    handle: "art-nouveau-plique-a-jour-pendant",
    title: "Art Nouveau Plique-à-Jour Pendant",
    price: 5400,
    productType: "Necklaces",
    art: "product-08",
    description:
      "A stained-glass dragonfly in plique-à-jour enamel and 18k gold, set with a freshwater pearl, circa 1900. Light passes straight through the wings. A jewel that belongs as much in a museum vitrine as on a collarbone.",
    sophiesNote:
      "Plique-à-jour is one of the hardest techniques in all of jewelry, and almost no one makes it anymore. Hold it to the window once and you'll understand.",
    details: {
      era: "Art Nouveau",
      circa: "c. 1900",
      material: "18k Gold & Enamel",
      stone: "Freshwater Pearl",
      style: "Plique-à-Jour",
      origin: "French",
      condition: "Very good",
    },
    tags: ["necklace", "pendant", "art-nouveau", "enamel", "pearl", "antique", "one-of-a-kind"],
    collections: ["necklaces", "antique-jewelry", "one-of-a-kind", "sophies-picks", "estate"],
  }),
  build({
    handle: "antique-gold-book-chain-collar",
    title: "Antique Gold Book Chain Collar",
    price: 7400,
    productType: "Necklaces",
    art: "product-09",
    description:
      "A substantial Victorian book chain in 15k gold with a locket drop, circa 1875. Flat, folded links catch the light like a river. Antique gold at its most tactile and collectible.",
    sophiesNote:
      "Antique gold has a color modern gold simply can't replicate — softer, warmer, a little pink. Wear this alone; it needs nothing.",
    details: {
      era: "Victorian",
      circa: "c. 1875",
      material: "15k Gold",
      style: "Book Chain",
      origin: "English",
      condition: "Excellent antique condition",
    },
    tags: ["necklace", "victorian", "antique-gold", "chain", "antique", "one-of-a-kind"],
    collections: ["new-arrivals", "necklaces", "antique-jewelry", "antique-gold", "one-of-a-kind", "sophies-picks", "estate"],
  }),
  build({
    handle: "edwardian-seed-pearl-lavalier",
    title: "Edwardian Seed Pearl Lavalière",
    price: 1650,
    productType: "Necklaces",
    art: "product-10",
    description:
      "Delicate as breath — a platinum-topped lavalière of seed pearls and a single old-cut diamond on a fine gold chain, circa 1910. The kind of everyday antique that never feels precious in the wrong way.",
    sophiesNote:
      "This is my most-recommended 'first antique.' It's under two thousand dollars, goes with everything, and it's a real piece of history.",
    details: {
      era: "Edwardian",
      circa: "c. 1910",
      material: "Platinum & 14k Gold",
      stone: "Seed Pearl & Diamond",
      style: "Lavalière",
      origin: "American",
      condition: "Excellent",
    },
    tags: ["necklace", "edwardian", "pearl", "diamond", "antique", "under-2000"],
    collections: ["necklaces", "antique-jewelry", "under-2000", "sophies-picks", "estate"],
  }),
  build({
    handle: "1970s-lapis-and-gold-pendant",
    title: "1970s Lapis & Gold Pendant",
    price: 2200,
    productType: "Necklaces",
    art: "product-11",
    description:
      "A bold disc of deep lapis lazuli rimmed in textured 18k gold, circa 1975. Sun-warmed modernism — clean lines, saturated color, and unmistakable seventies confidence.",
    sophiesNote:
      "The seventies understood color better than any decade. This lapis is the exact blue of a desert sky just after sunset.",
    details: {
      era: "Vintage 1970s",
      circa: "c. 1975",
      material: "18k Yellow Gold",
      stone: "Lapis Lazuli",
      style: "Modernist",
      origin: "Italian",
      condition: "Excellent",
    },
    tags: ["necklace", "pendant", "vintage", "lapis", "yellow-gold", "1970s"],
    collections: ["new-arrivals", "necklaces", "vintage-jewelry", "sophies-picks"],
  }),
  build({
    handle: "art-deco-diamond-line-bracelet",
    title: "Art Deco Diamond Line Bracelet",
    price: 11800,
    productType: "Bracelets",
    art: "product-12",
    description:
      "A ribbon of old-cut diamonds in geometric platinum links, circa 1930. Flexible, brilliant, and precisely of its era. The bracelet you wear for the next forty years.",
    sophiesNote:
      "A great line bracelet is a forever thing. This one has the slightly irregular sparkle of old cuts — never that clinical modern flash.",
    details: {
      era: "Art Deco",
      circa: "c. 1930",
      material: "Platinum",
      stone: "Old European Cut Diamond",
      style: "Line / Tennis",
      origin: "American",
      condition: "Excellent",
    },
    tags: ["bracelet", "art-deco", "diamond", "platinum", "vintage", "one-of-a-kind"],
    collections: ["new-arrivals", "bracelets", "vintage-jewelry", "one-of-a-kind", "featured", "estate"],
  }),
  build({
    handle: "victorian-gate-link-bracelet-heart",
    title: "Victorian Gate-Link Bracelet",
    price: 2950,
    productType: "Bracelets",
    art: "product-13",
    description:
      "A 15k gold gate-link bracelet with a heart-shaped padlock clasp, circa 1885. The padlock was a Victorian token of devotion. Warm, sturdy, and full of sentiment.",
    sophiesNote:
      "The heart padlock gets me every time. These were given as love tokens — I love that you can still feel that intention in the gold.",
    details: {
      era: "Victorian",
      circa: "c. 1885",
      material: "15k Gold",
      style: "Gate-Link",
      origin: "English",
      condition: "Very good antique condition",
    },
    tags: ["bracelet", "victorian", "antique-gold", "antique", "one-of-a-kind"],
    collections: ["bracelets", "antique-jewelry", "antique-gold", "one-of-a-kind", "sophies-picks", "estate"],
  }),
  build({
    handle: "retro-tank-track-gold-bracelet",
    title: "Retro Tank-Track Gold Bracelet",
    price: 4300,
    productType: "Bracelets",
    art: "product-14",
    description:
      "Substantial 14k rose and yellow gold 'tank track' links, circa 1945. Bold wartime engineering translated into jewelry. Heavy in the hand, weightless in style.",
    sophiesNote:
      "Retro gold is my secret weapon for anyone who thinks they don't like 'antique.' It's chunky, chic, and reads completely modern.",
    details: {
      era: "Retro",
      circa: "c. 1945",
      material: "14k Rose & Yellow Gold",
      style: "Tank Track",
      origin: "American",
      condition: "Excellent",
    },
    tags: ["bracelet", "retro", "antique-gold", "rose-gold", "vintage"],
    collections: ["new-arrivals", "bracelets", "vintage-jewelry", "antique-gold"],
  }),
  build({
    handle: "georgian-cannetille-bangle",
    title: "Georgian Cannetille Bangle",
    price: 5200,
    productType: "Bracelets",
    art: "product-15",
    description:
      "Feather-light cannetille goldwork — fine coiled wire and beading — set with a foiled pink topaz, circa 1825. A masterclass in early nineteenth-century craft that weighs almost nothing.",
    sophiesNote:
      "Cannetille is like goldsmithing lace. You can't believe it survived, and you can't believe how light it is.",
    details: {
      era: "Georgian",
      circa: "c. 1825",
      material: "18k Gold",
      stone: "Foiled Pink Topaz",
      style: "Cannetille",
      origin: "French",
      condition: "Very good antique condition",
    },
    tags: ["bracelet", "bangle", "georgian", "topaz", "antique", "antique-gold", "one-of-a-kind"],
    collections: ["bracelets", "antique-jewelry", "antique-gold", "one-of-a-kind", "sophies-picks", "estate"],
  }),
  build({
    handle: "art-deco-diamond-drop-earrings",
    title: "Art Deco Diamond Drop Earrings",
    price: 9800,
    productType: "Earrings",
    art: "product-16",
    description:
      "Articulated platinum drops set throughout with old-cut diamonds, circa 1928. They move when you do and scatter light across the room. Red-carpet jewelry with a real pedigree.",
    sophiesNote:
      "Movement is everything in an earring. These sway with the smallest turn of the head — that's what makes antiques feel alive.",
    details: {
      era: "Art Deco",
      circa: "c. 1928",
      material: "Platinum",
      stone: "Old European Cut Diamond",
      style: "Drop",
      origin: "French",
      condition: "Excellent",
    },
    tags: ["earrings", "art-deco", "diamond", "platinum", "vintage", "one-of-a-kind"],
    collections: ["new-arrivals", "earrings", "vintage-jewelry", "one-of-a-kind", "featured", "sophies-picks", "estate"],
  }),
  build({
    handle: "victorian-gold-hoop-earrings",
    title: "Victorian Etruscan Gold Hoops",
    price: 1250,
    productType: "Earrings",
    art: "product-17",
    description:
      "Etruscan Revival 15k gold hoops with fine granulation and rope twist, circa 1870. Everyday antique gold that looks equally right with a swimsuit or a suit.",
    sophiesNote:
      "The perfect gold hoop is a lifelong search. These are mine — the granulation catches the light in a way no modern hoop does.",
    details: {
      era: "Victorian",
      circa: "c. 1870",
      material: "15k Gold",
      style: "Etruscan Revival Hoop",
      origin: "Italian",
      condition: "Excellent antique condition",
    },
    tags: ["earrings", "victorian", "antique-gold", "hoops", "antique", "under-2000"],
    collections: ["new-arrivals", "earrings", "antique-jewelry", "antique-gold", "under-2000", "sophies-picks"],
  }),
  build({
    handle: "edwardian-pearl-diamond-studs",
    title: "Edwardian Pearl & Diamond Studs",
    price: 1950,
    productType: "Earrings",
    art: "product-18",
    description:
      "Natural pearls haloed by old-cut diamonds in platinum-topped gold, circa 1910. The quietest luxury — the earring you forget you're wearing until someone leans in.",
    sophiesNote:
      "If you only own one pair of antique earrings, make it a pearl-and-diamond stud. They flatter absolutely everyone.",
    details: {
      era: "Edwardian",
      circa: "c. 1910",
      material: "Platinum & 18k Gold",
      stone: "Natural Pearl & Diamond",
      style: "Stud",
      origin: "English",
      condition: "Excellent",
    },
    tags: ["earrings", "edwardian", "pearl", "diamond", "antique", "under-2000"],
    collections: ["earrings", "antique-jewelry", "under-2000", "sophies-picks", "estate"],
  }),
  build({
    handle: "1960s-coral-cluster-earrings",
    title: "1960s Coral Cluster Earrings",
    price: 1350,
    productType: "Earrings",
    art: "product-19",
    description:
      "Clusters of Mediterranean coral in warm 18k gold, circa 1965. A pop of desert-sunset color that instantly reads vacation. Clip fittings, easily converted to posts.",
    sophiesNote:
      "Coral is pure joy. I wear these all summer — they're the color of a Palm Springs cocktail hour.",
    details: {
      era: "Vintage 1960s",
      circa: "c. 1965",
      material: "18k Yellow Gold",
      stone: "Mediterranean Coral",
      style: "Cluster / Clip",
      origin: "Italian",
      condition: "Excellent",
    },
    tags: ["earrings", "vintage", "coral", "yellow-gold", "1960s", "under-2000"],
    collections: ["new-arrivals", "earrings", "vintage-jewelry", "under-2000", "sophies-picks"],
  }),
  build({
    handle: "art-deco-onyx-diamond-brooch",
    title: "Art Deco Onyx & Diamond Brooch",
    price: 3600,
    productType: "Brooches",
    art: "product-20",
    description:
      "A crisp geometric panel of onyx, old-cut diamonds and platinum, circa 1925. Wear it on a lapel, a ribbon, or a knit. Deco graphics at their most wearable.",
    sophiesNote:
      "Brooches are the most modern thing you can do with antique jewelry. Pin this to a blazer and watch it transform the whole outfit.",
    details: {
      era: "Art Deco",
      circa: "c. 1925",
      material: "Platinum",
      stone: "Onyx & Diamond",
      style: "Geometric Brooch",
      origin: "French",
      condition: "Excellent",
    },
    tags: ["brooch", "art-deco", "onyx", "diamond", "platinum", "vintage", "one-of-a-kind"],
    collections: ["new-arrivals", "vintage-jewelry", "one-of-a-kind", "estate"],
  }),
  build({
    handle: "victorian-memento-locket",
    title: "Victorian Engraved Gold Locket",
    price: 1450,
    productType: "Necklaces",
    art: "product-21",
    description:
      "A hand-engraved 15k gold locket with a foliate front and glazed compartment, circa 1880. Made to hold what matters. Comes on an antique gold chain.",
    sophiesNote:
      "A locket is the most personal thing I sell. Put something small and secret inside — that's the whole point.",
    details: {
      era: "Victorian",
      circa: "c. 1880",
      material: "15k Gold",
      style: "Engraved Locket",
      origin: "English",
      condition: "Very good antique condition",
    },
    tags: ["necklace", "locket", "victorian", "antique-gold", "antique", "under-2000"],
    collections: ["necklaces", "antique-jewelry", "antique-gold", "under-2000", "sophies-picks", "estate"],
  }),
  build({
    handle: "edwardian-sapphire-cluster-ring",
    title: "Edwardian Sapphire Cluster Ring",
    price: 4700,
    productType: "Rings",
    art: "product-22",
    description:
      "A cornflower Ceylon sapphire encircled by old-cut diamonds in platinum and gold, circa 1908. The classic 'sweetheart cluster' — romantic, timeless, and a joy to wear daily.",
    sophiesNote:
      "The cornflower blue of a great Ceylon sapphire is my favorite color in all of jewelry. This one is exactly right.",
    details: {
      era: "Edwardian",
      circa: "c. 1908",
      material: "Platinum & 18k Gold",
      stone: "Ceylon Sapphire & Diamond",
      style: "Cluster",
      origin: "English",
      condition: "Excellent",
    },
    tags: ["ring", "edwardian", "sapphire", "diamond", "antique", "engagement", "one-of-a-kind"],
    collections: ["new-arrivals", "rings", "antique-jewelry", "one-of-a-kind", "featured", "sophies-picks", "estate"],
    sized: true,
  }),
  build({
    handle: "georgian-rose-cut-diamond-cross",
    title: "Georgian Rose-Cut Diamond Cross",
    price: 6200,
    productType: "Necklaces",
    art: "product-23",
    description:
      "Silver-topped gold set throughout with foiled rose-cut diamonds, circa 1800. Candlelit sparkle from a time before electricity. An extraordinary survivor.",
    sophiesNote:
      "Rose cuts were designed to glow by candlelight, and they still do. This cross is over two centuries old — I get chills every time I hold it.",
    details: {
      era: "Georgian",
      circa: "c. 1800",
      material: "Silver & 15k Gold",
      stone: "Rose-Cut Diamond",
      style: "Cross",
      origin: "Iberian",
      condition: "Very good antique condition",
    },
    tags: ["necklace", "georgian", "diamond", "antique", "one-of-a-kind"],
    collections: ["necklaces", "antique-jewelry", "one-of-a-kind", "featured", "sophies-picks", "estate"],
  }),
  build({
    handle: "vintage-emerald-gold-band",
    title: "Vintage Emerald Eternity Band",
    price: 3900,
    productType: "Rings",
    art: "product-24",
    description:
      "Channel-set emeralds in warm 18k gold, circa 1970. A green line of color that stacks beautifully or stands entirely on its own.",
    sophiesNote:
      "A colored eternity band is the most useful ring you can own. Stack it, wear it solo, layer it with an antique — it never fights.",
    details: {
      era: "Vintage 1970s",
      circa: "c. 1970",
      material: "18k Yellow Gold",
      stone: "Emerald",
      style: "Eternity Band",
      origin: "American",
      condition: "Excellent",
    },
    tags: ["ring", "vintage", "emerald", "yellow-gold", "band", "1970s"],
    collections: ["new-arrivals", "rings", "vintage-jewelry", "sophies-picks"],
    sized: true,
  }),

  // --- Archive: previously sold (keep published in Shopify, inventory 0) -----
  build({
    handle: "victorian-gold-sapphire-ring-1850",
    title: "Victorian Gold and Sapphire Ring",
    price: 4200,
    productType: "Rings",
    art: "product-01",
    soldOut: true,
    createdAt: "2024-03-12T12:00:00Z",
    seoTitle: "Victorian Gold and Sapphire Ring, c. 1850 — Previously Sold",
    seoDescription:
      "Victorian gold and sapphire ring, circa 1850 — previously sold at Sophie Jane Jewels. 15k yellow gold with a cushion sapphire. Browse the archive and shop similar antique sapphire rings available now.",
    description:
      "A mid-Victorian ring in 15k yellow gold, set with a cushion-cut sapphire the color of ink in water. Hand-fabricated circa 1850, with a closed-back setting and a shank worn smooth by a century and a half of wear. The kind of ring people search for by year, stone and gold — and the reason the archive exists.",
    sophiesNote:
      "This is the piece I still think about. Not because it was the most valuable — because it was exactly right. If you are looking for a vintage gold and sapphire ring from the 1850s, start here, then tell me what you loved.",
    details: {
      era: "Victorian",
      circa: "c. 1850",
      material: "15k Yellow Gold",
      stone: "Sapphire",
      style: "Single Stone",
      origin: "English",
      condition: "Sold — excellent antique condition at sale",
    },
    tags: ["sold", "archive", "ring", "victorian", "sapphire", "yellow-gold", "antique", "1850"],
    collections: ["archive"],
    sized: true,
  }),
  build({
    handle: "georgian-rose-cut-diamond-cluster-1820",
    title: "Georgian Rose Cut Diamond Cluster Ring",
    price: 9800,
    productType: "Rings",
    art: "product-03",
    soldOut: true,
    createdAt: "2023-11-02T12:00:00Z",
    seoTitle: "Georgian Rose Cut Diamond Cluster Ring, c. 1820 — Previously Sold",
    seoDescription:
      "Georgian rose cut diamond cluster ring, circa 1820 — previously sold. Silver-topped gold with foil-backed roses. See the archive at Sophie Jane Jewels and shop similar antique diamond rings.",
    description:
      "A late-Georgian cluster of foil-backed rose cut diamonds in silver-topped gold, circa 1820. Candlelight jewelry — the stones catch flame rather than daylight. Closed back, hand-cut, entirely of its century.",
    sophiesNote:
      "Georgian roses are the ones I miss most when they leave. Nothing modern has this kind of light.",
    details: {
      era: "Georgian",
      circa: "c. 1820",
      material: "Silver-Topped 18k Gold",
      stone: "Rose Cut Diamond",
      style: "Cluster",
      origin: "English",
      condition: "Sold — very good antique condition at sale",
    },
    tags: ["sold", "archive", "ring", "georgian", "diamond", "antique", "cluster"],
    collections: ["archive"],
    sized: true,
  }),
  build({
    handle: "art-deco-platinum-sapphire-diamond-ring-1925",
    title: "Art Deco Platinum Sapphire and Diamond Ring",
    price: 12500,
    productType: "Rings",
    art: "product-02",
    soldOut: true,
    createdAt: "2024-09-18T12:00:00Z",
    seoTitle: "Art Deco Platinum Sapphire and Diamond Ring, c. 1925 — Previously Sold",
    seoDescription:
      "Art Deco platinum sapphire and diamond ring, circa 1925 — previously sold at Sophie Jane Jewels. Calibre sapphires and old European diamonds. Shop similar Deco rings available now.",
    description:
      "A geometric Deco mount in platinum, circa 1925: a central old European cut diamond framed by calibre-cut sapphires. Straight lines, cold fire, the 1920s in a finger's width.",
    sophiesNote:
      "Deco platinum is architecture you wear. This one had the proportions I wait years for.",
    details: {
      era: "Art Deco",
      circa: "c. 1925",
      material: "Platinum",
      stone: "Sapphire & Diamond",
      style: "Geometric",
      origin: "American",
      condition: "Sold — excellent condition at sale",
    },
    tags: ["sold", "archive", "ring", "art-deco", "sapphire", "diamond", "platinum", "engagement"],
    collections: ["archive"],
    sized: true,
  }),
  build({
    handle: "edwardian-pearl-diamond-necklace-1910",
    title: "Edwardian Pearl and Diamond Necklace",
    price: 6400,
    productType: "Necklaces",
    art: "product-08",
    soldOut: true,
    createdAt: "2023-06-21T12:00:00Z",
    seoTitle: "Edwardian Pearl and Diamond Necklace, c. 1910 — Previously Sold",
    seoDescription:
      "Edwardian pearl and diamond necklace, circa 1910 — previously sold. Platinum-topped gold lavalier with seed pearls. Browse Sophie Jane's sold archive for similar pieces.",
    description:
      "A delicate Edwardian lavalier, circa 1910, of seed pearls and old cut diamonds on a fine chain. Platinum-topped gold, that particular pre-war lightness that does not photograph as well as it lives on the neck.",
    sophiesNote:
      "The quietest necklace I sold that year — and the one most people asked to try on.",
    details: {
      era: "Edwardian",
      circa: "c. 1910",
      material: "Platinum-Topped Gold",
      stone: "Pearl & Diamond",
      style: "Lavalier",
      origin: "French",
      condition: "Sold — excellent antique condition at sale",
    },
    tags: ["sold", "archive", "necklace", "edwardian", "pearl", "diamond", "antique"],
    collections: ["archive"],
  }),
  build({
    handle: "victorian-etruscan-gold-bracelet-1870",
    title: "Victorian Etruscan Gold Bracelet",
    price: 3800,
    productType: "Bracelets",
    art: "product-13",
    soldOut: true,
    createdAt: "2022-12-08T12:00:00Z",
    seoTitle: "Victorian Etruscan Gold Bracelet, c. 1870 — Previously Sold",
    seoDescription:
      "Victorian Etruscan revival gold bracelet, circa 1870 — previously sold. High-karat granulated gold. See similar antique gold bracelets in the current collection.",
    description:
      "An archaeological-revival bracelet in high-karat gold, circa 1870, with granulation the Victorians borrowed from Etruria. Warm, weighty, meant to be worn every day until it became part of the wrist.",
    sophiesNote:
      "Antique gold of this color is why people fall in love with old jewelry. Modern gold cannot do this.",
    details: {
      era: "Victorian",
      circa: "c. 1870",
      material: "18k Yellow Gold",
      stone: "None",
      style: "Etruscan Revival",
      origin: "English",
      condition: "Sold — very good antique condition at sale",
    },
    tags: ["sold", "archive", "bracelet", "victorian", "yellow-gold", "antique-gold", "antique"],
    collections: ["archive"],
  }),
  build({
    handle: "art-nouveau-enamel-pearl-pendant-1900",
    title: "Art Nouveau Enamel and Pearl Pendant",
    price: 5100,
    productType: "Necklaces",
    art: "product-07",
    soldOut: true,
    createdAt: "2024-01-30T12:00:00Z",
    seoTitle: "Art Nouveau Enamel and Pearl Pendant, c. 1900 — Previously Sold",
    seoDescription:
      "Art Nouveau enamel and pearl pendant, circa 1900 — previously sold at Sophie Jane Jewels. Plique-à-jour and organic goldwork. Shop similar Nouveau jewels available now.",
    description:
      "A fin-de-siècle pendant with plique-à-jour enamel and a drop pearl, circa 1900. The gold is modeled like vine, not stamped like jewelry. One of the pieces that made the archive worth keeping public.",
    sophiesNote:
      "Nouveau at this level does not come twice. I photographed it more than I needed to, which is how I know I loved it.",
    details: {
      era: "Art Nouveau",
      circa: "c. 1900",
      material: "18k Yellow Gold",
      stone: "Pearl & Enamel",
      style: "Pendant",
      origin: "French",
      condition: "Sold — excellent antique condition at sale",
    },
    tags: ["sold", "archive", "necklace", "art-nouveau", "pearl", "enamel", "antique"],
    collections: ["archive"],
  }),
  build({
    handle: "retro-ruby-gold-cocktail-ring-1945",
    title: "Retro Ruby and Gold Cocktail Ring",
    price: 4600,
    productType: "Rings",
    art: "product-04",
    soldOut: true,
    createdAt: "2023-04-14T12:00:00Z",
    seoTitle: "Retro Ruby and Gold Cocktail Ring, c. 1945 — Previously Sold",
    seoDescription:
      "Retro ruby and gold cocktail ring, circa 1945 — previously sold. 14k rose gold scrollwork. Browse Sophie Jane's archive of vintage cocktail rings.",
    description:
      "A 1940s cocktail ring in 14k rose gold, set with a cushion ruby and the scroll-and-ribbon work the Retro years did better than anyone. Substantial, warm, unapologetic.",
    sophiesNote:
      "Retro gold is for people who want jewelry that shows up in a room. This one did.",
    details: {
      era: "Retro",
      circa: "c. 1945",
      material: "14k Rose Gold",
      stone: "Ruby",
      style: "Cocktail",
      origin: "American",
      condition: "Sold — excellent vintage condition at sale",
    },
    tags: ["sold", "archive", "ring", "retro", "ruby", "rose-gold", "vintage"],
    collections: ["archive"],
    sized: true,
  }),
  build({
    handle: "victorian-turquoise-snake-ring-1885",
    title: "Victorian Turquoise Snake Ring",
    price: 2900,
    productType: "Rings",
    art: "product-06",
    soldOut: true,
    createdAt: "2024-06-02T12:00:00Z",
    seoTitle: "Victorian Turquoise Snake Ring, c. 1885 — Previously Sold",
    seoDescription:
      "Victorian turquoise snake ring, circa 1885 — previously sold. 18k gold coiled serpent with turquoise. Symbolic antique jewelry from the Sophie Jane archive.",
    description:
      "A coiled serpent in 18k gold, set with turquoise along the spine, circa 1885. Victorian snakes meant eternity — a ring that was never only decoration.",
    sophiesNote:
      "Snake rings sell because they mean something. This one had the right scale — not costume, not timid.",
    details: {
      era: "Victorian",
      circa: "c. 1885",
      material: "18k Yellow Gold",
      stone: "Turquoise",
      style: "Snake",
      origin: "English",
      condition: "Sold — very good antique condition at sale",
    },
    tags: ["sold", "archive", "ring", "victorian", "turquoise", "snake", "symbolic", "antique"],
    collections: ["archive"],
    sized: true,
  }),
  build({
    handle: "mid-century-emerald-cut-diamond-earrings-1955",
    title: "Mid-Century Emerald Cut Diamond Earrings",
    price: 8900,
    productType: "Earrings",
    art: "product-17",
    soldOut: true,
    createdAt: "2022-08-19T12:00:00Z",
    seoTitle: "Mid-Century Emerald Cut Diamond Earrings, c. 1955 — Previously Sold",
    seoDescription:
      "Mid-century emerald cut diamond earrings, circa 1955 — previously sold. Platinum drops. See similar vintage diamond earrings in the current collection.",
    description:
      "A pair of emerald-cut diamond drops in platinum, circa 1955. Clean, architectural, the opposite of fussy — the earrings you wear with a black dress and nothing else.",
    sophiesNote:
      "Some pairs are so complete you do not split them, even in the archive. These were that pair.",
    details: {
      era: "Mid-Century",
      circa: "c. 1955",
      material: "Platinum",
      stone: "Emerald Cut Diamond",
      style: "Drop Earrings",
      origin: "American",
      condition: "Sold — excellent vintage condition at sale",
    },
    tags: ["sold", "archive", "earrings", "mid-century", "diamond", "platinum", "vintage"],
    collections: ["archive"],
  }),
  build({
    handle: "victorian-gold-locket-hairwork-1860",
    title: "Victorian Gold Locket with Hairwork",
    price: 1850,
    productType: "Necklaces",
    art: "product-22",
    soldOut: true,
    createdAt: "2024-11-09T12:00:00Z",
    seoTitle: "Victorian Gold Locket with Hairwork, c. 1860 — Previously Sold",
    seoDescription:
      "Victorian gold locket with hairwork, circa 1860 — previously sold at Sophie Jane Jewels. 18k mourning locket. Browse the archive of antique lockets and gold chains.",
    description:
      "An 18k gold locket, circa 1860, still holding its original hairwork behind glass. Mourning jewelry at its most intimate — a piece that had already lived one life before it lived in the collection.",
    sophiesNote:
      "I keep lockets in the archive because they are the most human objects we sell. This one found the right person.",
    details: {
      era: "Victorian",
      circa: "c. 1860",
      material: "18k Yellow Gold",
      stone: "Glass & Hairwork",
      style: "Locket",
      origin: "English",
      condition: "Sold — original hairwork intact at sale",
    },
    tags: ["sold", "archive", "necklace", "victorian", "locket", "yellow-gold", "mourning", "antique"],
    collections: ["archive"],
  }),
  build({
    handle: "art-deco-old-european-diamond-engagement-ring-1930",
    title: "Art Deco Old European Diamond Engagement Ring",
    price: 11200,
    productType: "Rings",
    art: "product-05",
    soldOut: true,
    createdAt: "2023-02-11T12:00:00Z",
    seoTitle: "Art Deco Old European Diamond Engagement Ring, c. 1930 — Previously Sold",
    seoDescription:
      "Art Deco old European cut diamond engagement ring, circa 1930 — previously sold. Platinum filigree. Shop similar antique engagement rings at Sophie Jane Jewels.",
    description:
      "A platinum Deco engagement ring, circa 1930, holding an old European cut diamond in a filigree mount. The cut that makes candlelight look expensive. A ring with a past, sold to begin another.",
    sophiesNote:
      "If someone writes to me looking for an antique engagement ring, this is the silhouette I describe first.",
    details: {
      era: "Art Deco",
      circa: "c. 1930",
      material: "Platinum",
      stone: "Old European Cut Diamond",
      style: "Engagement",
      origin: "American",
      condition: "Sold — excellent vintage condition at sale",
    },
    tags: ["sold", "archive", "ring", "art-deco", "diamond", "platinum", "engagement", "vintage"],
    collections: ["archive"],
    sized: true,
  }),
  build({
    handle: "victorian-garnet-gold-cross-necklace-1875",
    title: "Victorian Garnet and Gold Cross Necklace",
    price: 1650,
    productType: "Necklaces",
    art: "product-23",
    soldOut: true,
    createdAt: "2025-01-22T12:00:00Z",
    seoTitle: "Victorian Garnet and Gold Cross Necklace, c. 1875 — Previously Sold",
    seoDescription:
      "Victorian garnet and gold cross necklace, circa 1875 — previously sold. 15k gold with almandine garnets. See similar antique gold necklaces in the archive and shop.",
    description:
      "A Latin cross in 15k gold, set with almandine garnets, circa 1875. Devotional jewelry that reads as design first — deep red against warm gold, on a fine belcher chain.",
    sophiesNote:
      "Crosses from this decade have a weight modern reproductions miss. This one sat perfectly at the collarbone.",
    details: {
      era: "Victorian",
      circa: "c. 1875",
      material: "15k Yellow Gold",
      stone: "Garnet",
      style: "Cross",
      origin: "English",
      condition: "Sold — very good antique condition at sale",
    },
    tags: ["sold", "archive", "necklace", "victorian", "garnet", "yellow-gold", "cross", "antique"],
    collections: ["archive"],
  }),
];

export const mockCollections: Collection[] = [
  {
    id: "gid://shopify/Collection/1",
    handle: "new-arrivals",
    title: "New Arrivals",
    eyebrow: "Just In",
    description:
      "The latest pieces to pass through Sophie's hands — freshly sourced, researched, and photographed. New finds are added weekly and, because most are one of a kind, they rarely last long.",
    intro:
      "Because each piece is chosen individually, no two weeks look alike. This is the first place to look — and the first place things sell.",
    seo: {
      title: "New Arrivals — Antique & Vintage Jewelry",
      description:
        "Newly sourced antique and vintage jewelry, added weekly. One-of-a-kind rings, necklaces, earrings and bracelets curated by Sophie Jane.",
    },
    image: { url: "/photos/lifestyle-marble.png", altText: "New arrivals", width: 1600, height: 1067 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/2",
    handle: "one-of-a-kind",
    title: "One of a Kind",
    eyebrow: "Singular",
    description:
      "Pieces that exist exactly once. When it's gone, it's gone — and that's the point. This is the heart of what we do: jewelry with a history that can't be reproduced.",
    intro:
      "Every piece here is the only one of its kind we'll ever have. Collect accordingly.",
    seo: {
      title: "One of a Kind Antique & Vintage Jewelry",
      description:
        "Singular, one-of-a-kind antique and vintage jewelry. Each piece exists exactly once — rings, necklaces, earrings and more, curated by Sophie Jane.",
    },
    image: { url: "/photos/hero-hands.png", altText: "One of a kind", width: 1536, height: 1024 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/3",
    handle: "sophies-picks",
    title: "Sophie's Picks",
    eyebrow: "Chosen by Eye",
    description:
      "The pieces I can't stop thinking about right now. Not the most expensive, not the flashiest — simply the ones with that indefinable rightness. Consider this my personal shortlist.",
    intro:
      "A rotating shortlist of the pieces I'd wear myself this season — chosen for character, not price.",
    seo: {
      title: "Sophie's Picks — Curated Antique & Vintage Jewelry",
      description:
        "A personally curated shortlist of antique and vintage jewelry, hand-selected by Sophie Jane for character, wearability and quiet distinction.",
    },
    image: { url: "/photos/hero-desert.png", altText: "Sophie's picks", width: 1600, height: 900 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/4",
    handle: "antique-jewelry",
    title: "Antique Jewelry",
    eyebrow: "100+ Years",
    description:
      "Georgian, Victorian, Art Nouveau and Edwardian jewelry — pieces made a century or more ago, entirely by hand. This is where craftsmanship becomes history you can wear.",
    intro:
      "Strictly speaking, 'antique' means one hundred years or older. In practice it means pieces made in a world without machines — and it shows in every detail.",
    seo: {
      title: "Antique Jewelry — Georgian, Victorian, Edwardian & More",
      description:
        "Shop authenticated antique jewelry over 100 years old: Georgian, Victorian, Art Nouveau and Edwardian rings, necklaces and earrings, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-antique.svg", altText: "Antique jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/5",
    handle: "vintage-jewelry",
    title: "Vintage Jewelry",
    eyebrow: "20th Century",
    description:
      "Art Deco through the 1970s — the jewelry of the twentieth century, from Deco geometry to Retro gold to seventies color. Distinctive, wearable, and often surprisingly affordable.",
    intro:
      "Vintage covers roughly the last hundred years — the decades that gave us Deco, Retro and mid-century modern. It's where great design meets everyday wearability.",
    seo: {
      title: "Vintage Jewelry — Art Deco, Retro & Mid-Century",
      description:
        "Shop vintage jewelry from the 20th century: Art Deco, Retro and mid-century rings, necklaces, earrings and bracelets, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-vintage.svg", altText: "Vintage jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/6",
    handle: "antique-gold",
    title: "Antique Gold",
    eyebrow: "Warm & Rare",
    description:
      "High-karat antique gold has a color modern gold can't match — softer, warmer, a little pink. Chains, bangles, hoops and lockets meant to be worn every single day.",
    intro:
      "There's a reason collectors chase antique gold: the color. Higher karat and hand-alloyed, it glows in a way contemporary gold simply doesn't.",
    seo: {
      title: "Antique Gold Jewelry — Chains, Bangles & Everyday Gold",
      description:
        "Shop antique gold jewelry: high-karat Victorian and Georgian chains, bangles, hoops and lockets with a warmth modern gold can't replicate.",
    },
    image: { url: "/photos/hero-hands.png", altText: "Antique gold jewelry", width: 1536, height: 1024 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/7",
    handle: "rings",
    title: "Rings",
    eyebrow: "For the Hand",
    description:
      "From Georgian garnets to Deco diamonds to antique engagement rings — the most personal category we carry. Complimentary resizing on most pieces.",
    seo: {
      title: "Antique & Vintage Rings",
      description:
        "Shop antique and vintage rings: engagement rings, cocktail rings and everyday gold, from Georgian to mid-century, curated by Sophie Jane.",
    },
    image: { url: "/photos/shop-rings.png", altText: "Antique and vintage rings", width: 1200, height: 1600 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/8",
    handle: "necklaces",
    title: "Necklaces",
    eyebrow: "For the Neckline",
    description:
      "Book chains, lavalières, lockets, pendants and statement collars — antique and vintage necklaces to layer or to wear entirely alone.",
    seo: {
      title: "Antique & Vintage Necklaces & Pendants",
      description:
        "Shop antique and vintage necklaces: gold chains, lockets, lavalières and pendants from Georgian to mid-century, curated by Sophie Jane.",
    },
    image: { url: "/photos/shop-necklaces.png", altText: "Antique and vintage necklaces", width: 1200, height: 1600 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/9",
    handle: "earrings",
    title: "Earrings",
    eyebrow: "For the Everyday",
    description:
      "Antique gold hoops, pearl studs, Deco drops and colorful clusters — from the pair you never take off to the pair you save for the evening.",
    seo: {
      title: "Antique & Vintage Earrings",
      description:
        "Shop antique and vintage earrings: gold hoops, pearl studs, Art Deco drops and colorful clusters, curated by Sophie Jane.",
    },
    image: { url: "/photos/shop-earrings.png", altText: "Antique and vintage earrings", width: 1200, height: 1600 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/10",
    handle: "bracelets",
    title: "Bracelets",
    eyebrow: "For the Wrist",
    description:
      "Line bracelets, gate-links, bangles and Retro gold — antique and vintage bracelets with the weight and movement that only time can give.",
    seo: {
      title: "Antique & Vintage Bracelets & Bangles",
      description:
        "Shop antique and vintage bracelets and bangles: diamond line bracelets, gate-links and Retro gold, curated by Sophie Jane.",
    },
    image: { url: "/photos/shop-bracelets.png", altText: "Antique and vintage bracelets", width: 1200, height: 1600 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/11",
    handle: "estate",
    title: "Estate Pieces",
    eyebrow: "Previously Loved",
    description:
      "Fine estate jewelry with provenance — pieces that have already lived one beautiful life and are ready for the next.",
    seo: {
      title: "Estate Jewelry",
      description:
        "Shop fine estate jewelry with provenance — antique and vintage rings, necklaces and earrings ready for their next chapter, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-antique.svg", altText: "Estate jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/12",
    handle: "under-2000",
    title: "Under $2,000",
    eyebrow: "An Easy First Heirloom",
    description:
      "Real antique and vintage jewelry that won't break the bank — the perfect place to begin a collection, or to find a gift with genuine history.",
    intro:
      "You don't need a five-figure budget to own something with real history. These are the pieces I recommend for a first antique.",
    seo: {
      title: "Antique & Vintage Jewelry Under $2,000",
      description:
        "Affordable antique and vintage jewelry under $2,000 — a beautiful place to begin collecting genuine antique pieces, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-earrings.svg", altText: "Jewelry under $2,000", width: 1000, height: 1250 },
    updatedAt: now,
  },

  // --- Engagement -----------------------------------------------------------
  {
    id: "gid://shopify/Collection/13",
    handle: "engagement",
    title: "Engagement Rings",
    eyebrow: "A Ring With a Past",
    description:
      "Antique and vintage engagement rings — old mine and old European cut diamonds, cornflower sapphires and hand-pierced platinum. A ring that already carries a century of love, ready to carry yours.",
    intro:
      "An antique engagement ring is the rarest thing you can propose with: a stone cut by hand, a mount made by a single jeweler, and a story that started long before yours. Complimentary sizing on most pieces.",
    seo: {
      title: "Antique & Vintage Engagement Rings",
      description:
        "Shop antique and vintage engagement rings: old European and old mine cut diamonds, sapphires and hand-crafted platinum settings, curated by Sophie Jane.",
    },
    image: { url: "/photos/shop-engagement.png", altText: "Antique engagement rings", width: 1200, height: 1600 },
    updatedAt: now,
  },

  // --- By Era ----------------------------------------------------------------
  {
    id: "gid://shopify/Collection/14",
    handle: "georgian",
    title: "Georgian",
    eyebrow: "c. 1714 – 1837",
    description:
      "The oldest jewelry we carry — foil-backed stones, cannetille goldwork and rose cuts made entirely by candlelight. Every Georgian piece is a hand-made survivor.",
    seo: {
      title: "Georgian Jewelry (c. 1714–1837)",
      description:
        "Shop authenticated Georgian jewelry: foil-back stones, cannetille goldwork and rose-cut diamonds, all hand-made over two centuries ago.",
    },
    image: { url: "/art/cat-antique.svg", altText: "Georgian jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/15",
    handle: "victorian",
    title: "Victorian",
    eyebrow: "c. 1837 – 1901",
    description:
      "Sentiment made solid: serpents for eternal love, lockets for keeping close, and the warm high-karat gold of the nineteenth century.",
    seo: {
      title: "Victorian Jewelry (c. 1837–1901)",
      description:
        "Shop authenticated Victorian jewelry: snake motifs, lockets, gate-link bracelets and warm antique gold, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-necklaces.svg", altText: "Victorian jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/16",
    handle: "art-nouveau",
    title: "Art Nouveau",
    eyebrow: "c. 1890 – 1910",
    description:
      "Nature dreamed in gold and enamel — plique-à-jour wings, sinuous lines and a romantic disregard for straight edges.",
    seo: {
      title: "Art Nouveau Jewelry (c. 1890–1910)",
      description:
        "Shop Art Nouveau jewelry: plique-à-jour enamel, naturalistic motifs and flowing gold forms, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-vintage.svg", altText: "Art Nouveau jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/17",
    handle: "edwardian",
    title: "Edwardian",
    eyebrow: "c. 1901 – 1915",
    description:
      "Lace in platinum — milgrain edges, hand-pierced galleries and the airy, garland-fine settings that define Edwardian romance.",
    seo: {
      title: "Edwardian Jewelry (c. 1901–1915)",
      description:
        "Shop Edwardian jewelry: platinum filigree, milgrain detail and old European cut diamonds in delicate garland settings, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-earrings.svg", altText: "Edwardian jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/18",
    handle: "art-deco",
    title: "Art Deco",
    eyebrow: "c. 1915 – 1935",
    description:
      "Geometry at its most confident — crisp lines, calibré-cut color and the architectural glamour that still reads as thoroughly modern.",
    seo: {
      title: "Art Deco Jewelry (c. 1915–1935)",
      description:
        "Shop Art Deco jewelry: geometric platinum, calibré-cut stones and old European cut diamonds with architectural glamour, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-rings.svg", altText: "Art Deco jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/19",
    handle: "retro",
    title: "Retro",
    eyebrow: "c. 1935 – 1950",
    description:
      "Hollywood on the hand — bold rose gold, sculptural scrolls and tank-track links with all the optimism of the era that made them.",
    seo: {
      title: "Retro Jewelry (c. 1935–1950)",
      description:
        "Shop Retro jewelry: bold rose gold, sculptural cocktail rings and tank-track bracelets from the 1940s, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-bracelets.svg", altText: "Retro jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/20",
    handle: "mid-century",
    title: "Mid-Century",
    eyebrow: "c. 1950 – 1970",
    description:
      "Clean modern lines and saturated color — turquoise cabochons, lapis discs and the easy confidence of mid-century design.",
    seo: {
      title: "Mid-Century Jewelry (c. 1950–1970)",
      description:
        "Shop mid-century jewelry: turquoise, coral and lapis in clean modern gold settings, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-vintage.svg", altText: "Mid-century jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },

  // --- By Stone --------------------------------------------------------------
  {
    id: "gid://shopify/Collection/21",
    handle: "diamond",
    title: "Diamond",
    eyebrow: "Old Cuts Only",
    description:
      "Old mine, old European and rose-cut diamonds — stones cut by hand to glow, not glitter. The warm, uneven light no modern cut can imitate.",
    seo: {
      title: "Antique Diamond Jewelry — Old Mine & Old European Cuts",
      description:
        "Shop antique diamond jewelry with old mine, old European and rose-cut stones — the warm hand-cut light of a bygone era, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-rings.svg", altText: "Antique diamond jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/22",
    handle: "sapphire",
    title: "Sapphire",
    eyebrow: "Cornflower Blue",
    description:
      "Ceylon and Kashmir-blue sapphires in antique settings — the single most collectible colored stone, and our favorite blue in all of jewelry.",
    seo: {
      title: "Antique & Vintage Sapphire Jewelry",
      description:
        "Shop antique and vintage sapphire jewelry: cornflower Ceylon sapphires in cluster rings and Deco settings, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-antique.svg", altText: "Sapphire jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/23",
    handle: "emerald",
    title: "Emerald",
    eyebrow: "Deep Green",
    description:
      "The green that has meant luxury for millennia — channel-set bands and antique mounts holding stones with garden-deep color.",
    seo: {
      title: "Antique & Vintage Emerald Jewelry",
      description:
        "Shop antique and vintage emerald jewelry: eternity bands and antique settings in deep green, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-vintage.svg", altText: "Emerald jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/24",
    handle: "turquoise",
    title: "Turquoise",
    eyebrow: "Desert Blue",
    description:
      "Persian turquoise and Victorian pavé — the blue of a desert sky, set in warm gold. The stone that ties the whole California story together.",
    seo: {
      title: "Antique & Vintage Turquoise Jewelry",
      description:
        "Shop antique and vintage turquoise jewelry: Persian cabochons and Victorian pavé in warm gold settings, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-necklaces.svg", altText: "Turquoise jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/25",
    handle: "pearl",
    title: "Pearl",
    eyebrow: "Natural & Seed",
    description:
      "Natural and seed pearls in Edwardian platinum and Art Nouveau gold — the quietest, most flattering luxury there is.",
    seo: {
      title: "Antique & Vintage Pearl Jewelry",
      description:
        "Shop antique and vintage pearl jewelry: natural and seed pearls in Edwardian and Art Nouveau settings, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-earrings.svg", altText: "Pearl jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },

  // --- Themes ----------------------------------------------------------------
  {
    id: "gid://shopify/Collection/26",
    handle: "snake",
    title: "Serpents & Symbols",
    eyebrow: "Meaningful Motifs",
    description:
      "Snakes for eternal love, hearts for devotion, hands and lockets for keeping close — the symbolic jewelry the Victorians did best.",
    seo: {
      title: "Antique Serpent & Symbolic Jewelry",
      description:
        "Shop antique symbolic jewelry: Victorian snake motifs, hearts, padlocks and lockets rich with meaning, curated by Sophie Jane.",
    },
    image: { url: "/art/cat-necklaces.svg", altText: "Serpent and symbolic jewelry", width: 1000, height: 1250 },
    updatedAt: now,
  },
  {
    id: "gid://shopify/Collection/27",
    handle: "archive",
    title: "The Archive",
    eyebrow: "Previously Sold",
    description:
      "One-of-a-kind antique, vintage and estate jewels that have already found their person — kept here so the work can still be found, studied, and used to find the next right piece. Victorian gold, sapphire rings from the 1850s, Georgian diamonds, Art Deco platinum and more.",
    intro:
      "The archive is the proof of the eye: pieces sourced since 2001 that sold, and that still teach us what to look for next.",
    seo: {
      title: "Archive of Previously Sold Antique & Vintage Jewelry",
      description:
        "Sophie Jane's archive of previously sold antique and vintage jewelry — Victorian gold sapphire rings, Georgian diamonds, Art Deco platinum and estate pieces sourced since 2001.",
    },
    image: { url: "/photos/lifestyle-marble.png", altText: "Archive of previously sold antique jewelry", width: 1600, height: 1067 },
    updatedAt: now,
  },
];

# Sophie Jane Jewels

A premium, editorial ecommerce experience for **Sophie Jane Jewels** — curated antique, vintage, estate and one-of-a-kind jewelry. Built to feel like a beautifully curated collection inside a modern California editorial world, with Shopify as the commerce backend.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site runs immediately with a **curated sample catalog** (see `lib/shopify/mock-data.ts`) so you can develop and preview the full experience without a Shopify connection.

## Connecting Shopify (commerce source of truth)

Shopify remains the source of truth for products, inventory, pricing, variants and checkout. The site already talks to the Storefront API when credentials are present.

### 1. Install the Headless channel

Shopify no longer creates new legacy custom apps from **Settings → Apps → App development**. Use the Headless sales channel instead:

1. Open [apps.shopify.com/headless](https://apps.shopify.com/headless) and install **Headless** on the Sophie Jane store.
2. Click **Create storefront** (or **Add storefront**).
3. Copy the **private Storefront API access token**. Also note the **public** token if you prefer that.
4. Under **Storefront API permissions**, confirm products, collections, inventory, and checkouts are allowed.
5. Publish the products/collections you want this site to show to the **Headless** channel (same idea as publishing to Online Store).

The **Build apps in Dev Dashboard** button on that Admin page is for building a full Shopify app with OAuth. You do not need it for this site.

### 2. Add credentials

```bash
# .env.local  (never commit this file)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=shpat_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SHOPIFY_STOREFRONT_ACCESS_TOKEN` (the public token) also works if you do not have the private one.

Restart the dev server, then:

```bash
npm run shopify:ping
```

That confirms the shop name, lists recent products, and checks that our pretty URLs (`/collections/rings`, `/archive`, …) map to the live collection handles (`vintage-antique-rings`, `sold-archives`, …).

### 3. Collection handles

Pretty URLs on this site stay short. They map to the existing Shopify collections:

| Site URL | Shopify handle |
|---|---|
| `/collections/rings` | `vintage-antique-rings` |
| `/collections/earrings` | `vintage-estate-earrings` |
| `/collections/bracelets` | `vintage-bracelets` |
| `/collections/engagement` | `engagement-rings` |
| `/archive` | `sold-archives` |
| `/collections/victorian` | `victorian-jewelry` |
| `/collections/art-deco` | `art-deco-jewelry-1` |

See `lib/shopify/handles.ts` for the full map.

Optional collections to add in Shopify (they 404 until they exist): `one-of-a-kind`, `sophies-picks`, `antique-gold`, `under-2000`, `diamond`.

`new-arrivals` currently points at the large “Antique, Vintage & Estate Jewelry” collection. For a true “just in” rail, create a Shopify smart collection of recently published products and either rename its handle to `new-arrivals` or update the alias.

### 4. Archive / sold pieces

Keep sold products **published**, inventory **0**, and in **Sold Archives** (`sold-archives`). Do not unpublish them — unpublished pieces cannot be indexed. Tag `sold` when possible.

### 5. Curatorial metafields (optional)

Product metafields, namespace `custom`, exposed to the Storefront API: `era`, `material`, `stone`, `style`, `circa`, `origin`, `condition`, `sophies_note`.

Collection metafields: `eyebrow`, `intro`.

### 6. Cache refresh

`SHOPIFY_REVALIDATION_SECRET` enables `POST /api/revalidate?secret=...` to bust product and collection caches after edits in Shopify.

## Architecture

```
app/
  page.tsx                    Homepage (Brand → Story → Curation → Discovery → Product → Conversion)
  collections/                Collections index + [handle] template (sorting, SEO)
  products/[handle]/          Product detail (gallery, add-to-cart, Product schema)
  journal/                    Editorial + education (era/stone guides, stories)
  about/                      Sophie's story & curation philosophy
  find-your-piece/            Personal concierge / conversion
  search/                     Site search
  sitemap.ts / robots.ts      SEO infrastructure
components/                   Design-system + feature components
lib/shopify/                  Storefront API client, queries, types, mock fallback
lib/journal.ts                Editorial content
lib/site.ts                   Brand config + navigation architecture
scripts/gen-art.mjs           Generates on-brand SVG art placeholders
```

## SEO

Server-rendered throughout, with the Metadata API (titles, descriptions, canonicals, Open Graph), JSON-LD structured data (Organization/JewelryStore, WebSite, Product, CollectionPage, Article, Breadcrumb), a dynamic XML sitemap, robots.txt, semantic HTML, descriptive alt text, and image optimization.

## Design system

- **Type:** Fraunces (antique-warmth display serif) + Jost (mid-century geometric sans)
- **Palette:** oxblood `#691C25`, dusty rose `#D79C9D`, desert terracotta `#D46A31`, sand gold `#E9C476` over warm paper neutrals — used intentionally and sparingly.
- Tokens live in `app/globals.css` (`@theme`).

## Art placeholders

Until real product photography is connected via Shopify, the site ships with cohesive, art-directed SVG placeholders (`public/art/`, generated by `scripts/gen-art.mjs`). Real Shopify imagery replaces them automatically.
```bash
node scripts/gen-art.mjs   # regenerate art
```

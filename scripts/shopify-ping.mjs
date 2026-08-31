#!/usr/bin/env node
/**
 * Diagnose the Shopify Storefront connection.
 * Usage: node scripts/shopify-ping.mjs
 * Reads .env.local from the project root.
 */

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync, existsSync } from "node:fs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

function loadEnv() {
  if (!existsSync(envPath)) return;
  for (const raw of readFileSync(envPath, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const domain = (process.env.SHOPIFY_STORE_DOMAIN ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "");
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ?? "";
const publicToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";
const token = privateToken || publicToken;

const expected = {
  "new-arrivals": "new-arrivals",
  rings: "vintage-antique-rings",
  necklaces: "necklaces",
  earrings: "vintage-estate-earrings",
  bracelets: "vintage-bracelets",
  engagement: "engagement-rings",
  archive: "sold-archives",
  "antique-jewelry": "antique-jewelry",
  victorian: "victorian-jewelry",
  "art-deco": "art-deco-jewelry-1",
};

if (!domain || !token) {
  console.log(`
Shopify is not connected yet.

Shopify no longer lets you create a legacy custom app from Admin.
Use the Headless sales channel instead:

1. Open https://apps.shopify.com/headless and install Headless on Sophie Jane.
2. Click Create storefront (or Add storefront).
3. Copy the private Storefront API token (or the public one).
4. Create ${envPath} with:

SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=shpat_...
NEXT_PUBLIC_SITE_URL=https://www.sophiejanejewels.com

Then run: npm run shopify:ping
`);
  process.exit(1);
}

const endpoint = `https://${domain}/api/2025-07/graphql.json`;

async function gql(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(privateToken
        ? { "Shopify-Storefront-Private-Token": privateToken }
        : { "X-Shopify-Storefront-Access-Token": publicToken }),
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  if (body.errors?.length) {
    throw new Error(body.errors.map((e) => e.message).join("; "));
  }
  return body.data;
}

try {
  const shop = await gql(`{ shop { name primaryDomain { url } } }`);
  console.log(`Connected: ${shop.shop.name}`);
  console.log(`Domain:    ${shop.shop.primaryDomain.url}`);
  console.log(`API:       ${endpoint}\n`);

  const products = await gql(`{
    products(first: 5, sortKey: CREATED_AT, reverse: true) {
      edges { node { title handle availableForSale } }
    }
  }`);
  console.log("Latest products:");
  for (const { node } of products.products.edges) {
    console.log(`  ${node.availableForSale ? "•" : "×"} ${node.title}  /${node.handle}`);
  }

  const collections = await gql(`{
    collections(first: 100, sortKey: TITLE) {
      edges { node { handle title } }
    }
  }`);
  const handles = new Set(collections.collections.edges.map((e) => e.node.handle));
  console.log(`\nCollections visible to Storefront: ${handles.size}`);
  console.log("Handle map (site → Shopify):");
  for (const [site, shopify] of Object.entries(expected)) {
    const ok = handles.has(shopify);
    console.log(`  ${ok ? "✓" : "✗"} /${site}  →  ${shopify}${ok ? "" : "  (missing)"}`);
  }

  const archive = await gql(`{
    collection(handle: "sold-archives") {
      title
      products(first: 3) {
        edges { node { title availableForSale } }
      }
    }
  }`);
  if (archive.collection) {
    console.log(`\nArchive collection: ${archive.collection.title}`);
    for (const { node } of archive.collection.products.edges) {
      console.log(`  ${node.availableForSale ? "still listed as for sale" : "sold"} — ${node.title}`);
    }
  } else {
    console.log("\n✗ Collection handle sold-archives is not visible to the Storefront API.");
  }

  console.log("\nOK — restart `npm run dev` so Next.js picks up .env.local.");
} catch (err) {
  console.error("\nShopify ping failed:");
  console.error(`  ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}

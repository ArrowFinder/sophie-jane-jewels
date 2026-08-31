import { isShopifyConfigured, shopifyFetch } from "./client";
import { mockCollections, mockProducts } from "./mock-data";
import { ARCHIVE_HANDLE, isSold } from "./archive";
import { toShopifyHandle } from "./handles";
import {
  GET_COLLECTION_PRODUCTS,
  GET_COLLECTIONS,
  GET_PRODUCT,
  GET_PRODUCTS,
} from "./queries";
import type { Collection, Image, Product } from "./types";

export type SortKey = "newest" | "price-asc" | "price-desc" | "featured" | "title";
export type Availability = "available" | "sold" | "all";

// ----------------------------------------------------------------------------
// Reshapers: Shopify's edge/node GraphQL shape -> our flat domain types.
// ----------------------------------------------------------------------------

type Edge<T> = { node: T };
type PageInfo = { hasNextPage: boolean; endCursor?: string | null };
type Connection<T> = { edges: Edge<T>[]; pageInfo?: PageInfo };
const flatten = <T>(c?: Connection<T>): T[] => (c?.edges ?? []).map((e) => e.node);

const PAGE = 250;

async function paginateShopify<T>({
  query,
  variables,
  connection,
  tags,
  max = PAGE,
  cache,
}: {
  query: string;
  variables: Record<string, unknown>;
  connection: (data: any) => Connection<T> | undefined;
  tags?: string[];
  max?: number;
  cache?: RequestCache;
}): Promise<T[]> {
  const nodes: T[] = [];
  let after: string | undefined;
  while (nodes.length < max) {
    const data = await shopifyFetch<any>({
      query,
      variables: { ...variables, first: Math.min(PAGE, max - nodes.length), after: after ?? null },
      tags,
      cache,
    });
    const conn = connection(data);
    nodes.push(...flatten(conn));
    if (!conn?.pageInfo?.hasNextPage || !conn.pageInfo.endCursor) break;
    after = conn.pageInfo.endCursor;
  }
  return nodes.slice(0, max);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function reshapeImage(node: any, fallbackAlt: string): Image {
  return {
    url: node?.url ?? "/art/product-01.svg",
    altText: node?.altText || fallbackAlt,
    width: node?.width ?? 1100,
    height: node?.height ?? 1375,
  };
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function reshapeProduct(node: any): Product {
  const title = node.title ?? "";
  const featured = node.featuredImage
    ? reshapeImage(node.featuredImage, title)
    : {
        url: "/art/product-01.svg",
        altText: title,
        width: 1100,
        height: 1375,
      };
  const images = flatten(node.images).map((img) => reshapeImage(img, title));
  return {
    id: node.id,
    handle: node.handle,
    title,
    description: node.description ?? "",
    descriptionHtml: node.descriptionHtml ?? "",
    availableForSale: node.availableForSale,
    productType: node.productType ?? "",
    vendor: node.vendor ?? "",
    tags: node.tags ?? [],
    featuredImage: featured,
    images: images.length > 0 ? images : [featured],
    options: node.options ?? [],
    variants: flatten(node.variants),
    priceRange: node.priceRange,
    seo: {
      title: node.seo?.title || node.title,
      description: node.seo?.description || node.description || "",
    },
    updatedAt: node.updatedAt,
    createdAt: node.createdAt,
    details: {
      era: node.era?.value,
      material: node.material?.value,
      stone: node.stone?.value,
      style: node.style?.value,
      circa: node.circa?.value,
      origin: node.origin?.value,
      condition: node.condition?.value,
    },
    sophiesNote: node.sophiesNote?.value,
  };
}

function reshapeCollection(node: any): Collection {
  const description = stripHtml(node.description ?? "");
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description,
    descriptionHtml: node.descriptionHtml,
    image: node.image ? reshapeImage(node.image, node.title) : undefined,
    seo: {
      title: node.seo?.title || node.title,
      description: node.seo?.description || description || "",
    },
    updatedAt: node.updatedAt,
    eyebrow: node.eyebrow?.value,
    intro: node.intro?.value,
  };
}

const shopifySortMap: Record<
  SortKey,
  { sortKey: string; reverse: boolean }
> = {
  newest: { sortKey: "CREATED", reverse: true },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
  featured: { sortKey: "BEST_SELLING", reverse: false },
  title: { sortKey: "TITLE", reverse: false },
};

function sortLocally(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  const price = (p: Product) => parseFloat(p.priceRange.minVariantPrice.amount);
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => price(a) - price(b));
    case "price-desc":
      return list.sort((a, b) => price(b) - price(a));
    case "title":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "newest":
      return list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    default:
      return list;
  }
}

function matchesQuery(product: Product, query: string): boolean {
  const weak = new Set([
    "and",
    "or",
    "the",
    "a",
    "an",
    "of",
    "with",
    "for",
    "from",
    "in",
    "to",
    "vintage",
    "antique",
    "estate",
    "jewelry",
    "jewel",
    "jewels",
    "piece",
    "sold",
  ]);
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/[^a-z0-9]/g, ""))
    .filter((t) => t.length > 1 && !weak.has(t));
  if (tokens.length === 0) {
    const q = query.toLowerCase();
    return (
      product.title.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q)
    );
  }
  const hay = [
    product.title,
    product.description,
    product.productType,
    product.tags.join(" "),
    ...Object.values(product.details ?? {}),
  ]
    .join(" ")
    .toLowerCase();
  return tokens.every((token) => hay.includes(token));
}

function filterAvailability(products: Product[], availability: Availability): Product[] {
  if (availability === "available") return products.filter((p) => !isSold(p));
  if (availability === "sold") return products.filter(isSold);
  return products;
}

// ----------------------------------------------------------------------------
// Public data functions.
// ----------------------------------------------------------------------------

export async function getProducts(opts?: {
  sort?: SortKey;
  query?: string;
  first?: number;
  availability?: Availability;
}): Promise<Product[]> {
  const { sort = "featured", query, first = 100, availability = "all" } = opts ?? {};

  if (isShopifyConfigured()) {
    const { sortKey, reverse } = shopifySortMap[sort];
    const availabilityQuery =
      availability === "available"
        ? "available_for_sale:true"
        : availability === "sold"
          ? "available_for_sale:false"
          : "";
    const combinedQuery = [query, availabilityQuery].filter(Boolean).join(" ");
    const nodes = await paginateShopify<any>({
      query: GET_PRODUCTS,
      variables: {
        sortKey: query ? "RELEVANCE" : sortKey,
        reverse,
        query: combinedQuery || undefined,
      },
      max: first,
      connection: (data: { products: Connection<any> & { pageInfo: PageInfo } }) => data.products,
      tags: ["products"],
    });
    return filterAvailability(nodes.map(reshapeProduct), availability).slice(0, first);
  }

  let list = mockProducts as Product[];
  list = filterAvailability(list, availability);
  if (query) {
    list = list.filter((p) => matchesQuery(p, query));
  }
  return sortLocally(list, sort).slice(0, first);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  if (isShopifyConfigured()) {
    const data = await shopifyFetch<{ product: any | null }>({
      query: GET_PRODUCT,
      variables: { handle },
      tags: ["products", `product:${handle}`],
    });
    return data.product ? reshapeProduct(data.product) : undefined;
  }
  return mockProducts.find((p) => p.handle === handle);
}

export async function getCollections(): Promise<Collection[]> {
  if (isShopifyConfigured()) {
    const nodes = await paginateShopify<any>({
      query: GET_COLLECTIONS,
      variables: {},
      connection: (data: { collections: Connection<any> }) => data.collections,
      tags: ["collections"],
      max: 250,
    });
    return nodes.map(reshapeCollection);
  }
  return mockCollections;
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const shopifyHandle = toShopifyHandle(handle);
  const collections = await getCollections();
  return collections.find((c) => c.handle === shopifyHandle || c.handle === handle);
}

export async function getCollectionProducts(
  handle: string,
  sort: SortKey = "featured",
  opts?: { max?: number },
): Promise<{ collection?: Collection; products: Product[] }> {
  const shopifyHandle = toShopifyHandle(handle);
  const isArchive = handle === ARCHIVE_HANDLE || shopifyHandle === toShopifyHandle(ARCHIVE_HANDLE);
  const max = opts?.max ?? (isArchive ? 500 : 250);

  if (isShopifyConfigured()) {
    const { sortKey, reverse } = shopifySortMap[sort];
    const pcSortKey =
      sortKey === "CREATED" ? "CREATED" : sortKey === "BEST_SELLING" ? "BEST_SELLING" : sortKey;
    let collectionNode: any = null;
    const productNodes: any[] = [];
    let after: string | undefined;

    while (productNodes.length < max) {
      const data = await shopifyFetch<{ collection: any | null }>({
        query: GET_COLLECTION_PRODUCTS,
        variables: {
          handle: shopifyHandle,
          first: Math.min(PAGE, max - productNodes.length),
          after: after ?? null,
          sortKey: pcSortKey,
          reverse,
        },
        tags: ["collections", "products", `collection:${shopifyHandle}`],
      });
      if (!data.collection) return { collection: undefined, products: [] };
      collectionNode = data.collection;
      const conn = data.collection.products as Connection<any>;
      productNodes.push(...flatten(conn));
      if (!conn?.pageInfo?.hasNextPage || !conn.pageInfo.endCursor) break;
      after = conn.pageInfo.endCursor;
    }

    const products = productNodes.map(reshapeProduct);
    const scoped = isArchive ? products : products.filter((p) => !isSold(p));
    return {
      collection: reshapeCollection(collectionNode),
      products: sortLocally(scoped, sort).slice(0, max),
    };
  }

  const collection = mockCollections.find((c) => c.handle === handle);
  const products = (mockProducts as (Product & { collections: string[] })[]).filter(
    (p) => p.collections.includes(handle) || p.tags.includes(handle),
  );
  const scoped = isArchive ? products.filter(isSold) : products.filter((p) => !isSold(p));
  return { collection, products: sortLocally(scoped, sort) };
}

export async function getArchiveProducts(sort: SortKey = "newest"): Promise<{
  collection?: Collection;
  products: Product[];
}> {
  const fromCollection = await getCollectionProducts(ARCHIVE_HANDLE, sort, { max: 500 });
  if (fromCollection.products.length > 0) return fromCollection;
  const products = await getProducts({ availability: "sold", sort, first: 250 });
  const collection = await getCollection(ARCHIVE_HANDLE);
  return { collection, products };
}

/** Related pieces — matched by type, then era, then shared tags. Shop PDP prefers in-stock. */
export async function getRelatedProducts(
  product: Product,
  count = 4,
  opts?: { availability?: Availability },
): Promise<Product[]> {
  const availability = opts?.availability ?? "available";
  const all = await getProducts({ first: 100, availability });
  const others = all.filter((p) => p.handle !== product.handle);
  const scored = others
    .map((p) => {
      let score = 0;
      if (p.productType === product.productType) score += 3;
      if (p.details?.era && p.details.era === product.details?.era) score += 2;
      if (p.details?.stone && p.details.stone === product.details?.stone) score += 2;
      score += p.tags.filter((t) => product.tags.includes(t) && t !== "sold" && t !== "archive").length;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.p);
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  return getProducts({ query, sort: "featured" });
}

/**
 * Thin Shopify Storefront API client. When the store credentials are present
 * the app talks to Shopify; otherwise the data layer transparently falls back
 * to the curated sample catalog (see ./index).
 */

const API_VERSION = "2025-07";

function storefrontHeaders(): Record<string, string> {
  const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  const publicToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (privateToken) {
    return { "Shopify-Storefront-Private-Token": privateToken };
  }
  if (publicToken) {
    return { "X-Shopify-Storefront-Access-Token": publicToken };
  }
  return {};
}

export function isShopifyConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN &&
      (process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ||
        process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN),
  );
}

function endpoint(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN!.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `https://${domain}/api/${API_VERSION}/graphql.json`;
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function shopifyFetch<T>({
  query,
  variables,
  cache = "force-cache",
  tags,
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<T> {
  const res = await fetch(endpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...storefrontHeaders(),
    },
    body: JSON.stringify({ query, variables }),
    cache,
    ...(tags ? { next: { tags } } : {}),
  });

  if (!res.ok) {
    const hint =
      res.status === 401 || res.status === 403
        ? " Check SHOPIFY_STOREFRONT_ACCESS_TOKEN and Storefront API scopes."
        : res.status === 404
          ? " Check SHOPIFY_STORE_DOMAIN (use your-store.myshopify.com)."
          : "";
    throw new Error(`Shopify request failed: ${res.status} ${res.statusText}.${hint}`);
  }

  const body = (await res.json()) as GraphQLResponse<T>;
  if (body.errors?.length) {
    throw new Error(body.errors.map((e) => e.message).join("; "));
  }
  if (!body.data) {
    throw new Error("Shopify returned no data.");
  }
  return body.data;
}

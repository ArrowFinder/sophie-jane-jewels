import { isShopifyConfigured, shopifyFetch } from "./client";
import { CREATE_CART } from "./queries";

export type CheckoutLine = { merchandiseId: string; quantity: number };

export type CheckoutResult =
  | { ok: true; checkoutUrl: string }
  | { ok: false; reason: "not-configured" | "error"; message?: string };

/**
 * Creates a Shopify cart from the given lines and returns the hosted checkout
 * URL. In demo mode (no Shopify credentials) it reports `not-configured` so
 * the UI can explain that commerce is ready to be connected.
 */
export async function createCheckout(lines: CheckoutLine[]): Promise<CheckoutResult> {
  if (!isShopifyConfigured()) {
    return { ok: false, reason: "not-configured" };
  }
  try {
    const data = await shopifyFetch<{
      cartCreate: {
        cart: { checkoutUrl: string } | null;
        userErrors: { field: string[] | null; message: string }[];
      };
    }>({
      query: CREATE_CART,
      variables: { lines },
      cache: "no-store",
    });
    const errors = data.cartCreate.userErrors;
    if (errors?.length) {
      return { ok: false, reason: "error", message: errors.map((e) => e.message).join("; ") };
    }
    const url = data.cartCreate.cart?.checkoutUrl;
    if (!url) return { ok: false, reason: "error", message: "Checkout URL missing from Shopify." };
    return { ok: true, checkoutUrl: url };
  } catch (err) {
    return {
      ok: false,
      reason: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

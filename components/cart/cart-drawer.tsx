"use client";

import { Image } from "@/components/ui/image";
import Link from "next/link";
import { useCart } from "./cart-provider";
import { Button } from "@/components/ui/button";
import { CloseIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";
import { LogoMark } from "@/components/layout/logo";
import { formatMoney } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    currencyCode,
    count,
    checkout,
    checkoutState,
  } = useCart();

  return (
    <>
      <div
        aria-hidden
        onClick={closeCart}
        className={cn(
          "fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-500",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        aria-label="Shopping bag"
        aria-hidden={!isOpen}
        className={cn(
          "fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-500 [transition-timing-function:var(--ease-editorial)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-sans text-[0.78rem] font-medium uppercase tracking-[0.22em]">
            Your Bag {count > 0 && <span className="text-ink-faint">({count})</span>}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close bag"
            className="text-ink-soft transition-colors hover:text-ink"
          >
            <CloseIcon />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <LogoMark size={44} />
            <p className="display-md">Your bag is empty</p>
            <p className="text-sm text-ink-soft">
              Every piece is one of a kind. When something catches your eye, it won&rsquo;t wait
              long.
            </p>
            <Button variant="outline" size="sm" onClick={closeCart} className="mt-2">
              Continue Browsing
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-4 py-5">
                  <Link
                    href={`/products/${item.productHandle}`}
                    onClick={closeCart}
                    className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-paper-deep"
                  >
                    <Image
                      src={item.image.url}
                      alt={item.image.altText}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <Link
                        href={`/products/${item.productHandle}`}
                        onClick={closeCart}
                        className="font-display text-[1.05rem] leading-snug hover:text-oxblood"
                      >
                        {item.productTitle}
                      </Link>
                      <span className="whitespace-nowrap text-sm">
                        {formatMoney(item.price)}
                      </span>
                    </div>
                    {item.variantTitle !== "One Size" && (
                      <span className="mt-0.5 text-xs uppercase tracking-wider text-ink-faint">
                        {item.variantTitle}
                      </span>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-line">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-ink-soft hover:text-ink"
                        >
                          <MinusIcon width={14} height={14} />
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center text-ink-soft hover:text-ink"
                        >
                          <PlusIcon width={14} height={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-xs uppercase tracking-wider text-ink-faint underline-offset-4 hover:text-oxblood hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-line px-6 py-6">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.18em] text-ink-soft">Subtotal</span>
                <span className="font-display text-2xl">
                  {formatMoney({ amount: subtotal.toFixed(2), currencyCode })}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-faint">
                Shipping &amp; any duties calculated at checkout. Every order ships insured.
              </p>

              {checkoutState === "not-configured" && (
                <p className="mt-4 border border-gold/60 bg-gold-soft/30 px-4 py-3 text-xs leading-relaxed text-ink-soft">
                  Checkout is powered by Shopify. Add your store credentials
                  (<code className="text-ink">SHOPIFY_STORE_DOMAIN</code>) to enable secure
                  checkout — the bag and catalog are already wired for it.
                </p>
              )}
              {checkoutState === "error" && (
                <p className="mt-4 border border-oxblood/40 bg-rose-soft/30 px-4 py-3 text-xs text-oxblood">
                  Something went wrong reaching checkout. Please try again.
                </p>
              )}

              <Button
                onClick={checkout}
                size="lg"
                className="mt-5 w-full"
                disabled={checkoutState === "loading"}
              >
                {checkoutState === "loading" ? "Preparing\u2026" : "Proceed to Checkout"}
              </Button>
              <button
                onClick={closeCart}
                className="mx-auto mt-3 block text-xs uppercase tracking-[0.18em] text-ink-soft underline-offset-4 hover:underline"
              >
                Continue Browsing
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}

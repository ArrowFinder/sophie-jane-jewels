"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const hasRealOptions =
    product.options.length > 0 && product.options[0].name !== "Size";
  const initial = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const [variantId, setVariantId] = useState(initial?.id);
  const [added, setAdded] = useState(false);

  const selected = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? initial,
    [variantId, product.variants, initial],
  );

  if (!selected) return null;

  const soldOut = !product.availableForSale || !selected.availableForSale;

  function handleAdd() {
    if (!selected || soldOut) return;
    addItem({
      variantId: selected.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: selected.title,
      image: {
        url: product.featuredImage.url,
        altText: product.featuredImage.altText,
      },
      price: selected.price,
      options: selected.selectedOptions,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mt-8">
      {hasRealOptions && (
        <div className="mb-6">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-[0.18em] text-ink-soft">
              {product.options[0].name}
            </span>
            <Link href="/journal/ring-sizing-guide" className="text-xs text-ink-faint underline-offset-2 hover:underline">
              Sizing guide
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => {
              const label = variant.selectedOptions[0]?.value ?? variant.title;
              const disabled = !variant.availableForSale;
              return (
                <button
                  key={variant.id}
                  onClick={() => setVariantId(variant.id)}
                  disabled={disabled}
                  className={cn(
                    "min-w-12 border px-4 py-2.5 text-sm transition-colors",
                    variant.id === variantId
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-ink hover:border-ink",
                    disabled && "cursor-not-allowed border-line/60 text-ink-faint line-through hover:border-line/60",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Button
        onClick={handleAdd}
        size="lg"
        className="w-full sm:w-auto sm:min-w-72"
        disabled={soldOut}
      >
        {soldOut ? "Sold — One of a Kind" : added ? "Added to Bag ✓" : "Add to Bag"}
      </Button>

      {soldOut && (
        <p className="mt-4 text-sm text-ink-soft">
          This piece has found its person. <Link href="/find-your-piece" className="link-underline text-oxblood">Tell Sophie what you&rsquo;re after</Link> and she&rsquo;ll look for something similar.
        </p>
      )}
    </div>
  );
}

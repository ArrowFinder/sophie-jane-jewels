import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "./product-card";

/**
 * Horizontal, scroll-snapping product rail. Editorial on desktop, swipeable on
 * mobile — no JS required.
 */
export function ProductRail({ products }: { products: Product[] }) {
  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="w-[68%] shrink-0 snap-start sm:w-[42%] md:w-[32%] lg:w-auto"
        >
          <ProductCard product={product} priority={i < 2} />
        </div>
      ))}
    </div>
  );
}

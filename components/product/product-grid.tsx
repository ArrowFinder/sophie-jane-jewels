import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

export function ProductGrid({
  products,
  columns = 4,
  priorityCount = 0,
  className,
}: {
  products: Product[];
  columns?: 3 | 4;
  priorityCount?: number;
  className?: string;
}) {
  const cols =
    columns === 3
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  return (
    <div className={cn("grid gap-x-5 gap-y-10 sm:gap-x-6 sm:gap-y-14", cols, className)}>
      {products.map((product, i) => (
        <div key={product.id} className="reveal" style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
          <ProductCard product={product} priority={i < priorityCount} />
        </div>
      ))}
    </div>
  );
}

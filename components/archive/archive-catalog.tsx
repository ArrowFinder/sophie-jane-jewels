"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
import { Pagination } from "@/components/ui/pagination";
import { PAGE_SIZE } from "@/lib/shopify/handles";
import type { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

const typeFilters = [
  { label: "All", value: "" },
  { label: "Rings", value: "Rings" },
  { label: "Necklaces", value: "Necklaces" },
  { label: "Earrings", value: "Earrings" },
  { label: "Bracelets", value: "Bracelets" },
];

export function ArchiveCatalog({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const filtered = type
    ? products.filter((p) => p.productType.toLowerCase().includes(type.toLowerCase()))
    : products;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-sm text-ink-soft">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          {type ? ` · ${type}` : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => {
            const active = type === filter.value;
            const href = filter.value
              ? `/archive?type=${encodeURIComponent(filter.value)}`
              : "/archive";
            return (
              <Link
                key={filter.label}
                href={href}
                scroll={false}
                className={cn(
                  "border px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-colors",
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink-soft hover:border-ink hover:text-ink",
                )}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>
      </div>

      {paged.length > 0 ? (
        <>
          <ProductGrid products={paged} priorityCount={current === 1 ? 8 : 0} />
          <Pagination
            page={current}
            totalPages={totalPages}
            hrefFor={(p) => {
              const params = new URLSearchParams();
              if (type) params.set("type", type);
              if (p > 1) params.set("page", String(p));
              const qs = params.toString();
              return qs ? `/archive?${qs}` : "/archive";
            }}
          />
        </>
      ) : (
        <div className="py-16 text-center">
          <p className="display-md">Nothing in this slice of the archive.</p>
          <Link href="/archive" className="link-underline mt-4 inline-block text-oxblood">
            View all sold pieces
          </Link>
        </div>
      )}
    </>
  );
}

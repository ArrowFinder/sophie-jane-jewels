"use client";

import { useSearchParams } from "next/navigation";
import { CollectionToolbar } from "@/components/collection/collection-toolbar";
import { ProductGrid } from "@/components/product/product-grid";
import { Pagination } from "@/components/ui/pagination";
import { ButtonLink } from "@/components/ui/button";
import { PAGE_SIZE } from "@/lib/shopify/handles";
import type { Product } from "@/lib/shopify/types";
import type { SortKey } from "@/lib/shopify";

const validSorts: SortKey[] = ["featured", "newest", "price-asc", "price-desc", "title"];

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    case "price-asc":
      return copy.sort(
        (a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount),
      );
    case "price-desc":
      return copy.sort(
        (a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount),
      );
    case "title":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return copy;
  }
}

export function CollectionCatalog({
  handle,
  products,
}: {
  handle: string;
  products: Product[];
}) {
  const searchParams = useSearchParams();
  const sortParam = searchParams.get("sort") ?? "";
  const sort: SortKey = validSorts.includes(sortParam as SortKey) ? (sortParam as SortKey) : "featured";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const sorted = sortProducts(products, sort);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const paged = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const sortQuery = sort === "featured" ? "" : `sort=${sort}`;

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-24 text-center">
        <p className="display-md">Nothing here just yet.</p>
        <p className="max-w-md text-ink-soft">
          New pieces arrive weekly, and this collection is being curated now. In the meantime, explore
          what&rsquo;s new.
        </p>
        <ButtonLink href="/collections/new-arrivals" variant="outline" size="sm">
          Shop New Arrivals
        </ButtonLink>
      </div>
    );
  }

  return (
    <>
      <CollectionToolbar count={sorted.length} sort={sort} />
      <div className="pt-10">
        <ProductGrid products={paged} priorityCount={current === 1 ? 4 : 0} />
        <Pagination
          page={current}
          totalPages={totalPages}
          hrefFor={(p) => {
            const params = [sortQuery, p > 1 ? `page=${p}` : ""].filter(Boolean).join("&");
            return params ? `/collections/${handle}?${params}` : `/collections/${handle}`;
          }}
        />
      </div>
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageClient } from "@/components/search/search-page";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Sophie Jane Jewels collection and archive of antique and vintage jewelry.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="px-6 py-16 text-sm text-ink-soft">Loading search…</div>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
}

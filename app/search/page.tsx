import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { SearchIcon } from "@/components/ui/icons";
import { searchProducts } from "@/lib/shopify";
import { isSold } from "@/lib/shopify/archive";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Sophie Jane Jewels collection and archive of antique and vintage jewelry.",
  robots: { index: false, follow: true },
};

const suggestions = [
  { label: "Victorian", href: "/search?q=victorian" },
  { label: "Art Deco", href: "/search?q=art+deco" },
  { label: "Sapphire", href: "/search?q=sapphire" },
  { label: "Antique gold", href: "/collections/antique-gold" },
  { label: "Archive", href: "/archive" },
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await searchProducts(query) : [];
  const available = results.filter((p) => !isSold(p));
  const sold = results.filter(isSold);

  return (
    <Container className="py-12 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow eyebrow-muted">Search</p>
        <form action="/search" method="get" className="mt-4 flex items-center gap-3 border-b border-ink pb-3">
          <SearchIcon className="text-ink-soft" width={22} height={22} />
          <input
            type="search"
            name="q"
            defaultValue={query}
            autoFocus
            placeholder="Search the collection…"
            aria-label="Search products"
            className="w-full bg-transparent font-display text-2xl outline-none placeholder:text-ink-faint sm:text-3xl"
          />
        </form>
      </div>

      <div className="mt-12">
        {query ? (
          results.length > 0 ? (
            <>
              {available.length > 0 && (
                <>
                  <p className="mb-8 text-sm text-ink-soft">
                    {available.length} {available.length === 1 ? "piece" : "pieces"} available for{" "}
                    <span className="text-ink">“{query}”</span>
                  </p>
                  <ProductGrid products={available} priorityCount={4} />
                </>
              )}
              {sold.length > 0 && (
                <div className={available.length > 0 ? "mt-16 border-t border-line pt-12" : ""}>
                  <p className="mb-3 text-sm text-ink-soft">
                    {sold.length} {sold.length === 1 ? "match" : "matches"} in the archive
                    {available.length === 0 ? (
                      <>
                        {" "}
                        for <span className="text-ink">“{query}”</span>
                      </>
                    ) : null}
                  </p>
                  <p className="mb-8 max-w-xl text-sm text-ink-faint">
                    These pieces have sold. They remain here so you can find them — and so Sophie
                    can look for the next one like them.{" "}
                    <Link href="/archive" className="link-underline text-oxblood">
                      Browse the full archive
                    </Link>
                    .
                  </p>
                  <ProductGrid products={sold} />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-5 py-16 text-center">
              <p className="display-md">No pieces match “{query}”.</p>
              <p className="max-w-md text-ink-soft">
                Search the shop and the archive — or try an era, a stone, or a year. If it has
                passed through Sophie&rsquo;s hands, it may still live in the archive.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/archive" className="link-underline text-oxblood">
                  Browse the archive
                </Link>
                <Link href="/find-your-piece" className="link-underline text-oxblood">
                  Ask Sophie to find it
                </Link>
              </div>
            </div>
          )
        ) : (
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-ink-faint">Try searching for</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

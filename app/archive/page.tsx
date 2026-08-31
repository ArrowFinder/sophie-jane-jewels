import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { ProductGrid } from "@/components/product/product-grid";
import { ButtonLink } from "@/components/ui/button";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/json-ld";
import { getArchiveProducts } from "@/lib/shopify";
import { siteConfig } from "@/lib/site";
import { assetPath } from "@/lib/assets";
import { archiveIndexDescription, archiveIndexTitle } from "@/lib/seo";
import { Pagination } from "@/components/ui/pagination";
import { PAGE_SIZE } from "@/lib/shopify/handles";
import { cn } from "@/lib/utils";

export const revalidate = 3600;
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: archiveIndexTitle(),
  description: archiveIndexDescription(),
  keywords: [
    "previously sold antique jewelry",
    "vintage gold sapphire ring",
    "Victorian gold ring 1850",
    "sold estate jewelry archive",
    "antique jewelry Los Angeles",
  ],
  alternates: { canonical: "/archive" },
  openGraph: {
    title: archiveIndexTitle(),
    description: archiveIndexDescription(),
    url: `${siteConfig.url}/archive`,
    images: [{ url: assetPath("/photos/lifestyle-marble.png"), alt: "Sophie Jane Jewels archive" }],
  },
};

const typeFilters = [
  { label: "All", value: "" },
  { label: "Rings", value: "Rings" },
  { label: "Necklaces", value: "Necklaces" },
  { label: "Earrings", value: "Earrings" },
  { label: "Bracelets", value: "Bracelets" },
];

type Search = { type?: string; page?: string };

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { type, page: pageParam } = await searchParams;
  const { products } = await getArchiveProducts("newest");
  const filtered = type ? products.filter((p) => p.productType.toLowerCase().includes(type.toLowerCase())) : products;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Archive", href: "/archive" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: archiveIndexTitle(),
          description: archiveIndexDescription(),
          url: `${siteConfig.url}/archive`,
          isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: products.length,
            itemListElement: products.slice(0, 40).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${siteConfig.url}/archive/${p.handle}`,
              name: p.title,
            })),
          },
        }}
      />

      <PageHero
        eyebrow="Previously Sold"
        title="The Archive"
        intro="Every piece Sophie has placed — still here to be found. Search for a Victorian gold and sapphire ring from 1850, a Georgian diamond, an Art Deco engagement ring: if it passed through her hands, the record lives in this archive. Similar jewels are often waiting in the shop."
        breadcrumbs={breadcrumbs}
        size="compact"
      />

      <section className="py-10 lg:py-14">
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-sm text-ink-soft">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
              {type ? ` · ${type}` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((filter) => {
                const active = (type ?? "") === filter.value;
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
              <ProductGrid products={paged} priorityCount={8} />
              <Pagination
                page={Math.min(page, totalPages)}
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

          <div className="mt-16 border-t border-line pt-12 text-center">
            <p className="eyebrow">Still looking</p>
            <h2 className="display-md mt-3 text-balance">
              The piece you want may not be sold — it may not have arrived yet.
            </h2>
            <p className="lede mx-auto mt-4 max-w-xl">
              Tell Sophie the era, the stone, the feeling. She will watch the market the way she built this archive: one piece at a time.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/collections/new-arrivals">Shop What&rsquo;s In</ButtonLink>
              <ButtonLink href="/find-your-piece" variant="outline">
                Find Your Piece
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

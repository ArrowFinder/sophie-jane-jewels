import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { ProductGrid } from "@/components/product/product-grid";
import { CollectionToolbar } from "@/components/collection/collection-toolbar";
import { ButtonLink } from "@/components/ui/button";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/json-ld";
import { getCollection, getCollections, getCollectionProducts, type SortKey } from "@/lib/shopify";
import { ARCHIVE_HANDLE } from "@/lib/shopify/archive";
import { PAGE_SIZE, collectionAliases, toShopifyHandle, toSiteHandle } from "@/lib/shopify/handles";
import { Pagination } from "@/components/ui/pagination";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;
export const dynamic = "force-static";

type Params = { handle: string };
type Search = { sort?: string; page?: string };

export async function generateStaticParams() {
  const collections = await getCollections();
  const fromShopify = collections.map((c) => ({ handle: toSiteHandle(c.handle) }));
  const fromAliases = Object.keys(collectionAliases).map((handle) => ({ handle }));
  const seen = new Set<string>();
  return [...fromAliases, ...fromShopify].filter(({ handle }) => {
    if (handle === ARCHIVE_HANDLE || handle === toShopifyHandle(ARCHIVE_HANDLE)) return false;
    if (seen.has(handle)) return false;
    seen.add(handle);
    return true;
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { handle } = await params;
  if (handle === ARCHIVE_HANDLE || handle === toShopifyHandle(ARCHIVE_HANDLE)) {
    return {
      title: "Archive of Previously Sold Antique & Vintage Jewelry",
      alternates: { canonical: "/archive" },
    };
  }
  const collection = await getCollection(handle);
  if (!collection) return { title: "Collection Not Found" };
  return {
    title: collection.seo.title,
    description: collection.seo.description,
    alternates: { canonical: `/collections/${handle}` },
    openGraph: {
      title: collection.seo.title,
      description: collection.seo.description,
      url: `${siteConfig.url}/collections/${handle}`,
      images: collection.image ? [{ url: collection.image.url }] : undefined,
    },
  };
}

const validSorts: SortKey[] = ["featured", "newest", "price-asc", "price-desc", "title"];

const relatedLinks = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "One of a Kind", href: "/collections/one-of-a-kind" },
  { label: "Antique Jewelry", href: "/collections/antique-jewelry" },
  { label: "Vintage Jewelry", href: "/collections/vintage-jewelry" },
  { label: "Antique Gold", href: "/collections/antique-gold" },
  { label: "Rings", href: "/collections/rings" },
  { label: "Necklaces", href: "/collections/necklaces" },
  { label: "Earrings", href: "/collections/earrings" },
  { label: "Sophie's Picks", href: "/collections/sophies-picks" },
  { label: "The Archive", href: "/archive" },
];

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { handle } = await params;
  if (handle === ARCHIVE_HANDLE || handle === toShopifyHandle(ARCHIVE_HANDLE)) {
    permanentRedirect("/archive");
  }
  const siteHandle = toSiteHandle(handle);
  if (siteHandle !== handle) permanentRedirect(`/collections/${siteHandle}`);
  const { sort: sortParam, page: pageParam } = await searchParams;
  const sort: SortKey = validSorts.includes(sortParam as SortKey)
    ? (sortParam as SortKey)
    : "featured";
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const { collection, products } = await getCollectionProducts(handle, sort);
  if (!collection) notFound();

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const paged = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const sortQuery = sort === "featured" ? "" : `sort=${sort}`;

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
    { name: collection.title, href: `/collections/${handle}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: collection.seo.title,
          description: collection.seo.description,
          url: `${siteConfig.url}/collections/${handle}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: products.length,
            itemListElement: products.slice(0, 20).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${siteConfig.url}/products/${p.handle}`,
              name: p.title,
            })),
          },
        }}
      />

      <PageHero
        eyebrow={collection.eyebrow ?? "The Collection"}
        title={collection.title}
        intro={collection.intro ?? collection.description}
        breadcrumbs={breadcrumbs}
        size="compact"
      />

      <section className="py-10 lg:py-14">
        <Container>
          <Suspense fallback={null}>
            <CollectionToolbar count={products.length} sort={sort} />
          </Suspense>

          {paged.length > 0 ? (
            <div className="pt-10">
              <ProductGrid products={paged} priorityCount={4} />
              <Pagination
                page={Math.min(page, totalPages)}
                totalPages={totalPages}
                hrefFor={(p) => {
                  const params = [sortQuery, p > 1 ? `page=${p}` : ""].filter(Boolean).join("&");
                  return params ? `/collections/${handle}?${params}` : `/collections/${handle}`;
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5 py-24 text-center">
              <p className="display-md">Nothing here just yet.</p>
              <p className="max-w-md text-ink-soft">
                New pieces arrive weekly, and this collection is being curated now. In the
                meantime, explore what&rsquo;s new.
              </p>
              <ButtonLink href="/collections/new-arrivals" variant="outline" size="sm">
                Shop New Arrivals
              </ButtonLink>
            </div>
          )}
        </Container>
      </section>

      {collection.intro && (
        <section className="border-t border-line bg-paper-deep/30 py-14">
          <Container size="narrow" className="text-center">
            <p className="eyebrow eyebrow-muted">About This Collection</p>
            <p className="lede mt-4">{collection.intro}</p>
          </Container>
        </section>
      )}

      {/* Internal linking for discovery + SEO */}
      <section className="border-t border-line py-14">
        <Container>
          <p className="eyebrow eyebrow-muted mb-6">Keep Exploring</p>
          <div className="flex flex-wrap gap-3">
            {relatedLinks
              .filter((l) => l.href !== `/collections/${handle}`)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border border-line px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
          </div>
        </Container>
      </section>
    </>
  );
}

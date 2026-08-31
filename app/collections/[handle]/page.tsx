import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { CollectionCatalog } from "@/components/collection/collection-catalog";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/json-ld";
import { getCollection, getCollections, getCollectionProducts } from "@/lib/shopify";
import { ARCHIVE_HANDLE } from "@/lib/shopify/archive";
import { collectionAliases, toShopifyHandle, toSiteHandle } from "@/lib/shopify/handles";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;
export const dynamic = "force-static";

type Params = { handle: string };

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

export default async function CollectionPage({ params }: { params: Promise<Params> }) {
  const { handle } = await params;
  if (handle === ARCHIVE_HANDLE || handle === toShopifyHandle(ARCHIVE_HANDLE)) {
    permanentRedirect("/archive");
  }
  const siteHandle = toSiteHandle(handle);
  if (siteHandle !== handle) permanentRedirect(`/collections/${siteHandle}`);

  const { collection, products } = await getCollectionProducts(handle, "featured");
  if (!collection) notFound();

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
          <Suspense fallback={<p className="text-sm text-ink-soft">Loading pieces…</p>}>
            <CollectionCatalog handle={handle} products={products} />
          </Suspense>
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

import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/json-ld";
import { ArchiveCatalog } from "@/components/archive/archive-catalog";
import { getArchiveProducts } from "@/lib/shopify";
import { siteConfig } from "@/lib/site";
import { assetPath } from "@/lib/assets";
import { archiveIndexDescription, archiveIndexTitle } from "@/lib/seo";

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

export default async function ArchivePage() {
  const { products } = await getArchiveProducts("newest");
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
          <Suspense fallback={<p className="text-sm text-ink-soft">Loading the archive…</p>}>
            <ArchiveCatalog products={products} />
          </Suspense>

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

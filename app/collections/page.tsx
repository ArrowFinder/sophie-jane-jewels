import type { Metadata } from "next";
import Link from "next/link";
import { Image } from "@/components/ui/image";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getCollections } from "@/lib/shopify";
import { toShopifyHandle } from "@/lib/shopify/handles";
import type { Collection } from "@/lib/shopify/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Collections — Antique & Vintage Jewelry",
  description:
    "Explore every collection at Sophie Jane Jewels — new arrivals, one-of-a-kind pieces, antique and vintage jewelry, antique gold, and jewelry by type.",
  alternates: { canonical: "/collections" },
};

const groups: { heading: string; handles: string[] }[] = [
  { heading: "Discover", handles: ["new-arrivals", "one-of-a-kind", "sophies-picks", "under-2000"] },
  { heading: "By Era & Origin", handles: ["antique-jewelry", "vintage-jewelry", "antique-gold", "estate"] },
  { heading: "By Type", handles: ["rings", "necklaces", "earrings", "bracelets", "engagement"] },
];

function CollectionCard({ collection, href }: { collection: Collection; href: string }) {
  return (
    <Link
      href={href}
      className="reveal group relative block overflow-hidden bg-paper-deep"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {collection.image && (
          <Image
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            fill
            sizes="(min-width:1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-[1100ms] [transition-timing-function:var(--ease-editorial)] group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-paper">
        {collection.eyebrow && (
          <p className="text-[0.62rem] uppercase tracking-[0.22em] text-gold">{collection.eyebrow}</p>
        )}
        <h3 className="mt-1 font-display text-xl leading-tight">{collection.title}</h3>
      </div>
    </Link>
  );
}

export default async function CollectionsIndexPage() {
  const collections = await getCollections();
  const byHandle = new Map(collections.map((c) => [c.handle, c]));
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <PageHero
        eyebrow="Explore"
        title="Collections"
        intro="Every piece is chosen individually — so the collections are simply doorways in. Start with what's new, what's rare, or the pieces Sophie loves most right now."
        breadcrumbs={breadcrumbs}
        size="compact"
      />

      {groups.map((group) => {
        const items = group.handles
          .map((siteHandle) => {
            const collection =
              byHandle.get(siteHandle) ?? byHandle.get(toShopifyHandle(siteHandle));
            return collection ? { siteHandle, collection } : null;
          })
          .filter((item): item is { siteHandle: string; collection: Collection } => Boolean(item));
        if (items.length === 0) return null;
        return (
          <section key={group.heading} className="py-12 lg:py-16">
            <Container>
              <p className="eyebrow mb-8">{group.heading}</p>
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                {items.map(({ siteHandle, collection }) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    href={`/collections/${siteHandle}`}
                  />
                ))}
              </div>
            </Container>
          </section>
        );
      })}

      <section className="border-t border-line bg-paper-deep/40 py-12 lg:py-16">
        <Container className="text-center">
          <p className="eyebrow">Previously Sold</p>
          <h2 className="display-md mt-3">The Archive</h2>
          <p className="lede mx-auto mt-4 max-w-xl">
            Pieces that have already found their person — kept so they can still be found,
            and so Sophie can source what comes next.
          </p>
          <div className="mt-8">
            <ButtonLink href="/archive">Browse the Archive</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

import { Container } from "@/components/ui/container";
import { Hero } from "@/components/home/hero";
import { ShopStrip } from "@/components/home/shop-strip";
import { ValueStrip } from "@/components/sections/value-strip";
import { SectionHeading } from "@/components/sections/section-heading";
import { FeaturedEdits } from "@/components/sections/featured-edits";
import { ProductRail } from "@/components/product/product-rail";
import { ConciergeCta } from "@/components/sections/concierge-cta";
import { JournalCards } from "@/components/sections/journal-cards";
import { getArchiveProducts, getCollectionProducts } from "@/lib/shopify";
import { getArticlesByTopic } from "@/lib/journal";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const revalidate = 3600;

const featuredEdits = [
  {
    title: "One of a Kind",
    href: "/collections/one-of-a-kind",
    image: "/photos/lifestyle-marble.png",
    caption: "Singular",
  },
  {
    title: "Antique Gold",
    href: "/collections/antique-gold",
    image: "/photos/hero-hands.png",
    caption: "By the piece",
  },
  {
    title: "Engagement",
    href: "/collections/engagement",
    image: "/photos/shop-engagement.png",
    caption: "A ring with a past",
  },
];

export default async function HomePage() {
  const [{ products: newArrivals }, { products: sophiesPicks }, { products: archive }] =
    await Promise.all([
      getCollectionProducts("new-arrivals", "newest"),
      getCollectionProducts("sophies-picks", "featured"),
      getArchiveProducts("newest"),
    ]);
  const articles = getArticlesByTopic().slice(0, 3);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }]} />
      <Hero />
      <ShopStrip />
      <ValueStrip />

      <section className="py-[var(--spacing-section)]">
        <Container>
          <SectionHeading
            eyebrow="Just In"
            title="New Arrivals"
            intro="Freshly sourced and researched. Most pieces are singular — the newest finds rarely last long."
            link={{ label: "Shop All New", href: "/collections/new-arrivals" }}
            className="reveal mb-8"
          />
          <ProductRail products={newArrivals.slice(0, 8)} />
        </Container>
      </section>

      <section className="pb-[var(--spacing-section)]">
        <Container>
          <SectionHeading
            eyebrow="Shop"
            title="The Edit"
            link={{ label: "All Collections", href: "/collections" }}
            className="reveal mb-8"
          />
          <FeaturedEdits edits={featuredEdits} />
        </Container>
      </section>

      <section className="bg-rose-wash py-[var(--spacing-section)]">
        <Container>
          <SectionHeading
            eyebrow="Chosen by Eye"
            title="Sophie's Picks"
            intro="A shortlist of the pieces she cannot stop thinking about — chosen for character, not price."
            link={{ label: "See All Picks", href: "/collections/sophies-picks" }}
            className="reveal mb-8"
          />
          <ProductRail products={sophiesPicks.slice(0, 8)} />
        </Container>
      </section>

      <section className="py-[var(--spacing-section)]">
        <Container>
          <SectionHeading
            eyebrow="Previously Sold"
            title="The Archive"
            intro="Twenty-five years of one-of-a-kind jewels, kept so they can still be found — and so the next piece can be sourced with the same eye."
            link={{ label: "Browse the Archive", href: "/archive" }}
            className="reveal mb-8"
          />
          <ProductRail products={archive.slice(0, 8)} />
        </Container>
      </section>

      <ConciergeCta />

      <section className="py-[var(--spacing-section)]">
        <Container>
          <SectionHeading
            eyebrow="Learn"
            title="From the Journal"
            link={{ label: "All Stories & Guides", href: "/journal" }}
            className="reveal mb-8"
          />
          <JournalCards articles={articles} />
        </Container>
      </section>
    </>
  );
}

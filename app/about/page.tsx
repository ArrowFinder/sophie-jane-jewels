import type { Metadata } from "next";
import { Image } from "@/components/ui/image";
import { Container } from "@/components/ui/container";
import { EditorialSplit } from "@/components/sections/editorial-split";
import { ConciergeCta } from "@/components/sections/concierge-cta";
import { Sparkle, SparkleRule } from "@/components/brand/marks";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Sophie — The Eye Behind the Collection",
  description:
    "Meet Sophie Jane, founder and curator of Sophie Jane Jewels. Since 2001 she has sourced rare antique, vintage and estate jewelry with history and meaning.",
  alternates: { canonical: "/about" },
};

const pillars = [
  {
    title: "Heritage",
    body: "Rooted in antique, vintage and estate traditions — with generational expertise behind every find.",
  },
  {
    title: "Rarity",
    body: "Unique, one-of-a-kind treasures that can't be replicated or mass-produced.",
  },
  {
    title: "Storytelling",
    body: "Each piece carries history, love and legacy. We tell it honestly — and never invent what isn't there.",
  },
  {
    title: "Luxury",
    body: "Fine craftsmanship, prestigious houses and the quiet prestige of a piece that has already lived a life.",
  },
  {
    title: "Sustainability",
    body: "The most eco-conscious jewel is the one that already exists. Pre-owned, given new life.",
  },
  {
    title: "Discovery",
    body: "The thrill of collecting rare and beautiful finds — and the pleasure of placing them with the right person.",
  },
  {
    title: "Trust",
    body: "Exceptional service and expertise, so every client feels guided, valued and inspired.",
  },
];

export default function AboutPage() {
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "About Sophie", href: "/about" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Sophie Jane Jewels",
          url: `${siteConfig.url}/about`,
          about: {
            "@type": "Person",
            name: siteConfig.founder,
            jobTitle: "Founder & Curator",
            worksFor: { "@type": "Organization", name: siteConfig.name },
          },
        }}
      />

      <section className="relative overflow-hidden">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="max-w-xl">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 text-[0.68rem] uppercase tracking-[0.16em] text-ink-faint"
            >
              Home / <span className="text-ink-soft">About Sophie</span>
            </nav>
            <p className="eyebrow">The Curator · Est. 2001</p>
            <h1 className="display-xl mt-4 text-balance">
              A good eye can&rsquo;t be taught.
              <span className="display-italic"> But it can be trusted.</span>
            </h1>
            <p className="lede mt-6">
              Sophie Jane has spent her life drawn to old things — the ring at the back of
              the case, the piece no one else looked at twice. Sophie Jane Jewels is what
              happens when that instinct becomes a collection.
            </p>
          </div>
          <div className="reveal relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-paper-deep frame-arch lg:max-w-none">
            <Image
              src="/photos/curator-at-work.png"
              alt="Sophie Jane, founder and curator of Sophie Jane Jewels"
              fill
              priority
              sizes="(min-width:1024px) 45vw, 90vw"
              className="object-cover object-[center_20%]"
            />
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-blush py-[var(--spacing-section)]">
        <Container size="narrow" className="text-center">
          <p className="eyebrow">Brand Values</p>
          <SparkleRule className="mt-6" />
          <p className="display-md mx-auto mt-8 max-w-2xl text-balance font-display italic leading-snug text-ink">
            At Sophie Jane Jewels, we believe jewelry is more than adornment — it is
            heritage, artistry, and story woven into each piece.
          </p>
          <p className="lede mx-auto mt-6 max-w-2xl">
            We value authenticity, sourcing only rare treasures with history and meaning.
            We champion sustainability, giving pre-owned jewels new life while honoring
            the craftsmanship of the past. We are driven by a passion for discovery,
            seeking out the extraordinary for our clients across the globe. Above all, we
            hold trust and care at the center of everything we do.
          </p>
        </Container>
      </section>

      <section className="py-[var(--spacing-section)]">
        <Container>
          <div className="mb-12 max-w-2xl">
            <p className="eyebrow">Pillars of the Brand</p>
            <h2 className="display-lg mt-4">What we stand on</h2>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar, i) => (
              <div key={pillar.title} className="reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <Sparkle size={14} className="text-gold" />
                <h3 className="mt-4 font-display text-xl italic leading-tight">{pillar.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{pillar.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-[var(--spacing-section)]">
        <Container>
          <EditorialSplit
            reverse
            arch
            eyebrow="The Salon"
            title="Old-world jewelry, a California state of mind."
            image="/photos/salon-lounge.png"
            imageAlt="The Sophie Jane Jewels salon in Los Angeles"
            body={
              <>
                <p>
                  There&rsquo;s something about the light here — in the desert, along the
                  coast — that suits antique gold. It&rsquo;s warm, unhurried, a little
                  sun-faded. History worn lightly.
                </p>
                <p>
                  Sophie Jane Jewels is rooted in that sensibility. Serious about the
                  jewelry, relaxed about everything else.
                </p>
              </>
            }
            cta={{ label: "Find Your Piece", href: "/find-your-piece" }}
          />
        </Container>
      </section>

      <ConciergeCta />
    </>
  );
}

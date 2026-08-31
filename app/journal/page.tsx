import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { JournalCards } from "@/components/sections/journal-cards";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getArticlesByTopic } from "@/lib/journal";
import { ArrowRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "The Journal — Antique Jewelry Guides & Stories",
  description:
    "Guides, stories and education on antique and vintage jewelry — from diamond cuts and eras to caring for heirloom pieces. Curated by Sophie Jane.",
  alternates: { canonical: "/journal" },
};

const topics = [
  { value: "", label: "All" },
  { value: "guides", label: "Guides" },
  { value: "stories", label: "Stories" },
  { value: "education", label: "Education" },
  { value: "care", label: "Care" },
];

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const articles = getArticlesByTopic(topic);
  const [featured, ...rest] = articles;
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "The Journal", href: "/journal" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <PageHero
        eyebrow="Stories & Guides"
        title="The Journal"
        intro="A field guide and a love letter — the history behind the pieces, and everything you need to buy antique and vintage jewelry with confidence."
        breadcrumbs={breadcrumbs}
      />

      <Container className="py-10 lg:py-14">
        {/* Topic filter */}
        <div className="mb-10 flex flex-wrap gap-2 border-b border-line pb-6">
          {topics.map((t) => {
            const active = (topic ?? "") === t.value;
            return (
              <Link
                key={t.label}
                href={t.value ? `/journal?topic=${t.value}` : "/journal"}
                className={cn(
                  "border px-5 py-2.5 text-xs uppercase tracking-[0.16em] transition-colors",
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink-soft hover:border-ink hover:text-ink",
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </div>

        {articles.length === 0 ? (
          <p className="py-16 text-center text-ink-soft">No stories here yet — check back soon.</p>
        ) : (
          <>
            {/* Featured */}
            {featured && !topic && (
              <Link
                href={`/journal/${featured.slug}`}
                className="reveal group mb-16 grid gap-8 lg:grid-cols-2 lg:gap-12"
              >
                <div className="relative aspect-[7/5] w-full overflow-hidden bg-paper-deep">
                  <Image
                    src={`/art/${featured.heroArt}.svg`}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(min-width:1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1100ms] [transition-timing-function:var(--ease-editorial)] group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="flex items-center gap-3 text-[0.66rem] uppercase tracking-[0.2em] text-ink-faint">
                    <span className="text-oxblood">{featured.topicLabel}</span>
                    <span aria-hidden>·</span>
                    <span>{featured.readingMinutes} min read</span>
                  </p>
                  <h2 className="display-md mt-3 transition-colors group-hover:text-oxblood">
                    {featured.title}
                  </h2>
                  <p className="mt-4 max-w-md leading-relaxed text-ink-soft">{featured.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.74rem] font-medium uppercase tracking-[0.18em]">
                    Read the Story
                    <ArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            )}

            <JournalCards articles={topic ? articles : rest} />
          </>
        )}
      </Container>
    </>
  );
}

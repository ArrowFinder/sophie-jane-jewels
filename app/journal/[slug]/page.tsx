import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { articles, getArticle, type JournalBlock } from "@/lib/journal";
import { getProduct } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";
import { siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

type Params = { slug: string };

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.seoDescription,
    alternates: { canonical: `/journal/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.seoDescription,
      url: `${siteConfig.url}/journal/${slug}`,
      publishedTime: article.date,
      authors: [article.author],
      images: [{ url: `/art/${article.heroArt}.svg` }],
    },
  };
}

function Block({ block }: { block: JournalBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="display-md mt-12 mb-4">{block.text}</h2>;
    case "quote":
      return (
        <blockquote className="my-10 border-l-2 border-terracotta pl-6 font-display text-2xl italic leading-snug text-ink">
          {block.text}
        </blockquote>
      );
    case "list":
      return (
        <ul className="my-6 space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-ink-soft">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-terracotta" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return <p className="my-5 leading-relaxed text-ink-soft">{block.text}</p>;
  }
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const relatedProducts = (
    await Promise.all((article.relatedProducts ?? []).map((h) => getProduct(h)))
  ).filter((p): p is Product => Boolean(p));

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "The Journal", href: "/journal" },
    { name: article.title, href: `/journal/${slug}` },
  ];

  const moreArticles = articles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ArticleJsonLd
        title={article.title}
        description={article.seoDescription}
        slug={slug}
        date={article.date}
        author={article.author}
        image={`/art/${article.heroArt}.svg`}
      />

      <article>
        <Container size="narrow" className="pt-10 lg:pt-16">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.16em] text-ink-faint">
            <Link href="/" className="hover:text-oxblood">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/journal" className="hover:text-oxblood">Journal</Link>
            <span aria-hidden>/</span>
            <span className="text-ink-soft">{article.topicLabel}</span>
          </nav>

          <p className="eyebrow">{article.topicLabel}</p>
          <h1 className="display-xl mt-4 text-balance">{article.title}</h1>
          <div className="mt-6 flex items-center gap-3 text-sm text-ink-faint">
            <span>By {article.author}</span>
            <span aria-hidden>·</span>
            <time dateTime={article.date}>{formatDate(article.date)}</time>
            <span aria-hidden>·</span>
            <span>{article.readingMinutes} min read</span>
          </div>
        </Container>

        <Container className="my-10 lg:my-14">
          <div className="reveal relative aspect-[16/9] w-full overflow-hidden bg-paper-deep">
            <Image
              src={`/art/${article.heroArt}.svg`}
              alt={article.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Container>

        <Container size="narrow" className="pb-[var(--spacing-section)]">
          <div className="text-[1.05rem]">
            {article.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>

          {(article.relatedCollections?.length || relatedProducts.length) && (
            <div className="mt-12 border-t border-line pt-8">
              <p className="eyebrow eyebrow-muted mb-4">Explore</p>
              <div className="flex flex-wrap gap-3">
                {article.relatedCollections?.map((handle) => (
                  <Link
                    key={handle}
                    href={`/collections/${handle}`}
                    className="border border-line px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
                  >
                    Shop {handle.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>

        {relatedProducts.length > 0 && (
          <section className="border-t border-line py-[var(--spacing-section)]">
            <Container>
              <p className="eyebrow mb-2">From the Collection</p>
              <h2 className="display-md mb-10">Pieces from this story</h2>
              <ProductGrid products={relatedProducts} />
            </Container>
          </section>
        )}
      </article>

      <section className="border-t border-line bg-paper-deep/30 py-[var(--spacing-section)]">
        <Container>
          <p className="eyebrow mb-10">Keep Reading</p>
          <div className="grid gap-8 sm:grid-cols-3">
            {moreArticles.map((a) => (
              <Link key={a.slug} href={`/journal/${a.slug}`} className="group">
                <p className="text-[0.66rem] uppercase tracking-[0.2em] text-oxblood">{a.topicLabel}</p>
                <h3 className="mt-2 font-display text-xl leading-snug transition-colors group-hover:text-oxblood">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

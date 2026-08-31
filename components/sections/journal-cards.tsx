import Link from "next/link";
import { Image } from "@/components/ui/image";
import type { Article } from "@/lib/journal";

export function JournalCards({ articles }: { articles: Article[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, i) => (
        <article key={article.slug} className="reveal group" style={{ transitionDelay: `${i * 70}ms` }}>
          <Link href={`/journal/${article.slug}`} className="block">
            <div className="relative aspect-[7/5] w-full overflow-hidden bg-paper-deep">
              <Image
                src={`/art/${article.heroArt}.svg`}
                alt={article.title}
                fill
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1100ms] [transition-timing-function:var(--ease-editorial)] group-hover:scale-105"
              />
            </div>
            <div className="pt-5">
              <p className="flex items-center gap-3 text-[0.66rem] uppercase tracking-[0.2em] text-ink-faint">
                <span className="text-oxblood">{article.topicLabel}</span>
                <span aria-hidden>·</span>
                <span>{article.readingMinutes} min read</span>
              </p>
              <h3 className="mt-2 font-display text-xl leading-snug transition-colors group-hover:text-oxblood">
                {article.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{article.excerpt}</p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

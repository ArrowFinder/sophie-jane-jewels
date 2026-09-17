import Link from "next/link";
import { Image } from "@/components/ui/image";
import { collectionAtmosphere } from "@/lib/shopify/atmosphere";
import type { Collection, Product } from "@/lib/shopify/types";

function heroImage(handle: string, collection: Collection, products: Product[]) {
  const curated = collectionAtmosphere(handle);
  if (curated) {
    return { url: curated, altText: collection.title };
  }
  if (collection.image?.url && !collection.image.url.endsWith(".svg")) {
    return { url: collection.image.url, altText: collection.image.altText || collection.title };
  }
  const first = products[0]?.featuredImage;
  if (first?.url) return { url: first.url, altText: first.altText || collection.title };
  return { url: "/photos/lifestyle-marble.png", altText: collection.title };
}

function trimIntro(text: string, max = 220): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const sentence = clean.match(/^.+?[.!?](?:\s|$)/);
  if (sentence && sentence[0].length >= 80 && sentence[0].length <= max + 40) {
    return sentence[0].trim();
  }
  return `${clean.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

export function CollectionHero({
  handle,
  collection,
  products,
  breadcrumbs,
  count,
}: {
  handle: string;
  collection: Collection;
  products: Product[];
  breadcrumbs: { name: string; href: string }[];
  count: number;
}) {
  const image = heroImage(handle, collection, products);
  const intro = collection.intro ?? collection.description;
  const copy = intro ? trimIntro(intro) : undefined;

  return (
    <section className="border-b border-line">
      <div className="flex flex-col lg:grid lg:min-h-[28rem] lg:grid-cols-12 xl:min-h-[34rem]">
        <div className="order-2 flex flex-col justify-end px-5 py-10 sm:px-8 lg:order-1 lg:col-span-5 lg:justify-center lg:px-12 lg:py-16 xl:pl-16">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.18em] text-ink-faint"
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} className="transition-colors hover:text-oxblood">
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-ink-soft">{crumb.name}</span>
                )}
              </span>
            ))}
          </nav>

          <p className="eyebrow">{collection.eyebrow ?? "The Collection"}</p>
          <h1 className="display-xl mt-3 max-w-[15ch] text-balance">{collection.title}</h1>
          <span className="mt-6 block h-px w-10 bg-gold" aria-hidden />
          {copy && <p className="lede mt-6 max-w-[28rem]">{copy}</p>}
          <p className="meta mt-8">
            {count} {count === 1 ? "piece" : "pieces"}
          </p>
        </div>

        <div className="relative order-1 min-h-[22rem] overflow-hidden bg-ink sm:min-h-[26rem] lg:order-2 lg:col-span-7 lg:min-h-full">
          <Image
            src={image.url}
            alt={image.altText}
            fill
            priority
            sizes="(min-width:1024px) 55vw, 100vw"
            className="keep-alive object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-paper/20" />
        </div>
      </div>
    </section>
  );
}

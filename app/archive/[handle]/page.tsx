import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { DiamondMark, ArrowRight } from "@/components/ui/icons";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/seo/json-ld";
import { getArchiveProducts, getProduct, getRelatedProducts } from "@/lib/shopify";
import { isSold } from "@/lib/shopify/archive";
import { pieceSeoDescription, pieceSeoTitle } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

type Params = { handle: string };

export async function generateStaticParams() {
  const { products } = await getArchiveProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product || !isSold(product)) return { title: "Archive Piece Not Found" };
  const title = pieceSeoTitle(product);
  const description = pieceSeoDescription(product);
  const images = product.images.map((img) => ({ url: img.url, alt: img.altText }));
  return {
    title,
    description,
    keywords: [
      product.title,
      product.details?.era,
      product.details?.circa,
      product.details?.stone,
      product.details?.material,
      product.productType,
      "previously sold",
      "antique jewelry",
    ].filter(Boolean) as string[],
    alternates: { canonical: `/archive/${handle}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${siteConfig.url}/archive/${handle}`,
      images,
    },
  };
}

const specOrder: { key: string; label: string }[] = [
  { key: "era", label: "Era" },
  { key: "circa", label: "Circa" },
  { key: "material", label: "Material" },
  { key: "stone", label: "Stone" },
  { key: "style", label: "Style" },
  { key: "origin", label: "Origin" },
  { key: "condition", label: "Condition" },
];

export default async function ArchivePiecePage({ params }: { params: Promise<Params> }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();
  if (!isSold(product)) permanentRedirect(`/products/${handle}`);

  const similar = await getRelatedProducts(product, 4, { availability: "available" });

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Archive", href: "/archive" },
    { name: product.title, href: `/archive/${handle}` },
  ];

  const specs = specOrder
    .map(({ key, label }) => ({
      label,
      value: (product.details as Record<string, string | undefined>)?.[key],
    }))
    .filter((s) => Boolean(s.value));

  const typeHandle = (product.productType || "rings").toLowerCase();

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ProductJsonLd product={product} url={`${siteConfig.url}/archive/${handle}`} />

      <Container className="py-8 lg:py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.16em] text-ink-faint"
        >
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>/</span>}
              {i < breadcrumbs.length - 1 ? (
                <Link href={crumb.href} className="transition-colors hover:text-oxblood">
                  {crumb.name}
                </Link>
              ) : (
                <span className="truncate text-ink-soft">{crumb.name}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery images={product.images} title={product.title} />
          </div>

          <div className="max-w-xl">
            <p className="eyebrow">
              Previously Sold
              {product.details?.era ? ` · ${product.details.era}` : ""}
              {product.details?.circa ? ` · ${product.details.circa}` : ""}
            </p>
            <h1 className="display-lg mt-3">{product.title}</h1>
            <p className="mt-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-terracotta">
              <DiamondMark width={13} height={13} />
              Sold — one of a kind
            </p>

            <p className="mt-6 leading-relaxed text-ink-soft">{product.description}</p>

            {product.sophiesNote && (
              <figure className="mt-7 border-l-2 border-gold bg-gold-soft/25 py-4 pl-5 pr-4">
                <figcaption className="mb-1.5 flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.2em] text-ink-soft">
                  <DiamondMark width={12} height={12} className="text-terracotta" /> Sophie&rsquo;s Note
                </figcaption>
                <blockquote className="font-display text-lg italic leading-snug text-ink">
                  “{product.sophiesNote}”
                </blockquote>
              </figure>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`/collections/${typeHandle}`} size="lg">
                Shop Similar {product.productType || "Pieces"}
              </ButtonLink>
              <ButtonLink href="/find-your-piece" size="lg" variant="outline">
                Find One Like This
              </ButtonLink>
            </div>
            <p className="mt-4 text-sm text-ink-soft">
              This jewel has a new home. The archive keeps the record so you can still find it —
              and so Sophie can look for the next one like it.
            </p>

            {specs.length > 0 && (
              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-8">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-[0.64rem] uppercase tracking-[0.18em] text-ink-faint">
                      {spec.label}
                    </dt>
                    <dd className="mt-1 text-sm text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-10">
              <Accordion
                items={[
                  {
                    title: "Why the archive exists",
                    content: (
                      <p>
                        One-of-a-kind jewelry disappears from the shop the day it sells — but not
                        from memory, and not from search. Sophie keeps every placed piece here so
                        collectors, researchers and the next wearer can still find it, and so she
                        can source what comes after.
                      </p>
                    ),
                  },
                  {
                    title: "Authenticity",
                    content: (
                      <p>
                        Every archived piece was examined, dated and authenticated before it sold.{" "}
                        <Link href="/journal/how-we-authenticate" className="link-underline text-oxblood">
                          How we vet each jewel
                        </Link>
                        .
                      </p>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </Container>

      {similar.length > 0 && (
        <section className="border-t border-line py-[var(--spacing-section)]">
          <Container>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="eyebrow">Available Now</p>
                <h2 className="display-md mt-3">In the Same Spirit</h2>
              </div>
              <Link
                href={`/collections/${typeHandle}`}
                className="group hidden items-center gap-2 text-[0.74rem] font-medium uppercase tracking-[0.18em] hover:text-oxblood sm:inline-flex"
              >
                Shop {product.productType || "the collection"}
                <ArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <ProductGrid products={similar} />
          </Container>
        </section>
      )}
    </>
  );
}

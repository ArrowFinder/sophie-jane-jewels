import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductActions } from "@/components/product/product-actions";
import { ProductGrid } from "@/components/product/product-grid";
import { Accordion } from "@/components/ui/accordion";
import { DiamondMark, ArrowRight } from "@/components/ui/icons";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/seo/json-ld";
import { getProduct, getProducts, getRelatedProducts } from "@/lib/shopify";
import { isSold } from "@/lib/shopify/archive";
import { siteConfig } from "@/lib/site";
import { formatMoney } from "@/lib/utils";

export const revalidate = 3600;

type Params = { handle: string };

export async function generateStaticParams() {
  const products = await getProducts({ first: 250, availability: "available" });
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Piece Not Found" };
  if (isSold(product)) {
    return {
      title: product.seo.title,
      robots: { index: false, follow: true },
      alternates: { canonical: `/archive/${handle}` },
    };
  }
  const images = product.images.map((img) => ({ url: img.url, alt: img.altText }));
  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: { canonical: `/products/${handle}` },
    openGraph: {
      type: "website",
      title: product.seo.title,
      description: product.seo.description,
      url: `${siteConfig.url}/products/${handle}`,
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

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();
  if (isSold(product)) permanentRedirect(`/archive/${handle}`);

  const related = await getRelatedProducts(product, 4);

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: product.productType || "Shop", href: `/collections/${(product.productType || "").toLowerCase()}` },
    { name: product.title, href: `/products/${handle}` },
  ];

  const specs = specOrder
    .map(({ key, label }) => ({
      label,
      value: (product.details as Record<string, string | undefined>)?.[key],
    }))
    .filter((s) => Boolean(s.value));

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ProductJsonLd product={product} />

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
            {product.details?.era && (
              <p className="eyebrow">
                {product.details.era}
                {product.productType ? ` · ${product.productType}` : ""}
              </p>
            )}
            <h1 className="display-lg mt-3">{product.title}</h1>
            <p className="mt-4 font-display text-2xl text-ink">
              {formatMoney(product.priceRange.minVariantPrice)}
            </p>
            {product.tags.includes("one-of-a-kind") && product.availableForSale && (
              <p className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-terracotta">
                <DiamondMark width={13} height={13} /> One of a kind — only one available
              </p>
            )}

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

            <ProductActions product={product} />

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
                    title: "Provenance & Authenticity",
                    content: (
                      <p>
                        Every piece is examined, dated and authenticated before it joins the
                        collection — hallmarks, construction and stones are all assessed by hand.{" "}
                        <Link href="/journal/how-we-authenticate" className="link-underline text-oxblood">
                          Read how we vet each piece
                        </Link>
                        .
                      </p>
                    ),
                  },
                  {
                    title: "Shipping & Returns",
                    content: (
                      <p>
                        Ships fully insured and signature-required, beautifully packaged. Unworn
                        pieces may be returned within 14 days; resized rings are final sale.{" "}
                        <Link href="/journal/shipping-and-care" className="link-underline text-oxblood">
                          Full details
                        </Link>
                        .
                      </p>
                    ),
                  },
                  {
                    title: "Care & Sizing",
                    content: (
                      <p>
                        Most rings can be sized by our specialist antique jeweler. For care and
                        resizing guidance, see our{" "}
                        <Link href="/journal/caring-for-antique-jewelry" className="link-underline text-oxblood">
                          care guide
                        </Link>{" "}
                        and{" "}
                        <Link href="/journal/ring-sizing-guide" className="link-underline text-oxblood">
                          sizing guide
                        </Link>
                        .
                      </p>
                    ),
                  },
                ]}
              />
            </div>

            <p className="mt-8 text-sm text-ink-soft">
              Questions about this piece?{" "}
              <Link href="/find-your-piece" className="link-underline text-oxblood">
                Ask Sophie directly
              </Link>
              .
            </p>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <section className="border-t border-line py-[var(--spacing-section)]">
          <Container>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="eyebrow">You Might Also Love</p>
                <h2 className="display-md mt-3">In the Same Spirit</h2>
              </div>
              <Link
                href="/collections/one-of-a-kind"
                className="group hidden items-center gap-2 text-[0.74rem] font-medium uppercase tracking-[0.18em] hover:text-oxblood sm:inline-flex"
              >
                More One of a Kind
                <ArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <ProductGrid products={related} />
          </Container>
        </section>
      )}
    </>
  );
}

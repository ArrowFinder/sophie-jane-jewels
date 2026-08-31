import { siteConfig } from "@/lib/site";
import type { Product } from "@/lib/shopify/types";

/** Renders a JSON-LD script tag. Server component — no client JS. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, generated server-side from our own content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "JewelryStore",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        email: siteConfig.email,
        image: `${siteConfig.url}/brand/logo-stamp-square.png`,
        areaServed: "US",
        priceRange: "$$$",
        founder: { "@type": "Person", name: siteConfig.founder },
        sameAs: [siteConfig.social.instagram, siteConfig.social.pinterest],
        hasOfferCatalog: [
          {
            "@type": "OfferCatalog",
            name: "Shop Antique & Vintage Jewelry",
            url: `${siteConfig.url}/collections`,
          },
          {
            "@type": "OfferCatalog",
            name: "Archive of Previously Sold Jewelry",
            url: `${siteConfig.url}/archive`,
          },
        ],
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; href: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${siteConfig.url}${item.href}`,
        })),
      }}
    />
  );
}

export function ProductJsonLd({
  product,
  url,
}: {
  product: Product;
  url?: string;
}) {
  const price = product.priceRange.minVariantPrice;
  const canonical = url ?? `${siteConfig.url}/products/${product.handle}`;
  const sold = !product.availableForSale;
  const absoluteImages = product.images.map((img) =>
    img.url.startsWith("http") ? img.url : `${siteConfig.url}${img.url}`,
  );
  const additionalProperty = [
    product.details?.era
      ? { "@type": "PropertyValue", name: "Era", value: product.details.era }
      : null,
    product.details?.circa
      ? { "@type": "PropertyValue", name: "Circa", value: product.details.circa }
      : null,
    product.details?.stone
      ? { "@type": "PropertyValue", name: "Stone", value: product.details.stone }
      : null,
    product.details?.style
      ? { "@type": "PropertyValue", name: "Style", value: product.details.style }
      : null,
    product.details?.origin
      ? { "@type": "PropertyValue", name: "Origin", value: product.details.origin }
      : null,
  ].filter((item): item is { "@type": string; name: string; value: string } => item !== null);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description,
        image: absoluteImages,
        sku: product.handle,
        category: product.productType,
        brand: { "@type": "Brand", name: siteConfig.name },
        ...(product.details?.material ? { material: product.details.material } : {}),
        ...(additionalProperty.length ? { additionalProperty } : {}),
        offers: {
          "@type": "Offer",
          url: canonical,
          priceCurrency: price.currencyCode,
          ...(sold ? {} : { price: parseFloat(price.amount).toFixed(2) }),
          itemCondition: "https://schema.org/UsedCondition",
          availability: sold
            ? "https://schema.org/SoldOut"
            : "https://schema.org/InStock",
          seller: { "@type": "Organization", name: siteConfig.name },
        },
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  date,
  author,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: string;
  image: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        datePublished: date,
        dateModified: date,
        author: { "@type": "Person", name: author },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          logo: { "@type": "ImageObject", url: `${siteConfig.url}/brand/logo-stamp-square.png` },
        },
        image: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
        mainEntityOfPage: `${siteConfig.url}/journal/${slug}`,
      }}
    />
  );
}

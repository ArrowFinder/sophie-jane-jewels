import type { MetadataRoute } from "next";
import { getArchiveProducts, getCollections, getProducts } from "@/lib/shopify";
import { ARCHIVE_HANDLE } from "@/lib/shopify/archive";
import { articles } from "@/lib/journal";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/collections`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/archive`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/journal`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/find-your-piece`, changeFrequency: "monthly", priority: 0.8 },
  ];

  const [collections, products, archive] = await Promise.all([
    getCollections(),
    getProducts({ first: 250, availability: "available" }),
    getArchiveProducts("newest"),
  ]);

  const collectionRoutes: MetadataRoute.Sitemap = collections
    .filter((c) => c.handle !== ARCHIVE_HANDLE)
    .map((c) => ({
      url: `${base}/collections/${c.handle}`,
      lastModified: c.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/products/${p.handle}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const archiveRoutes: MetadataRoute.Sitemap = archive.products.map((p) => ({
    url: `${base}/archive/${p.handle}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const journalRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/journal/${a.slug}`,
    lastModified: a.date,
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes, ...archiveRoutes, ...journalRoutes];
}

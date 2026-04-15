import type { MetadataRoute } from "next";
import { getNewsSlugs } from "@/lib/server/news";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const slugs = await getNewsSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/gizlilik-politikasi",
    "/cerez-politikasi",
    "/kullanim-kosullari",
    "/iletisim",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const newsRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${siteUrl}/haber/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...newsRoutes];
}

import type { MetadataRoute } from "next";
import { getNewsSlugs } from "@/lib/server/news";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://e-news.example.com");
  
  let slugs: string[] = [];
  try {
    slugs = await getNewsSlugs();
  } catch (error) {
    console.error("Failed to fetch news slugs for sitemap:", error);
    // Continue with empty slugs if database is unavailable
  }

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

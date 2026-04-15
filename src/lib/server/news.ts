import { prisma } from "@/lib/prisma";
import type { NewsItem } from "@/types/news";

function normalizeContent(content: unknown): string[] {
  if (!Array.isArray(content)) {
    return [];
  }

  return content.filter((item): item is string => typeof item === "string");
}

function formatDate(value: Date): string {
  return value.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function mapArticleToNewsItem(article: {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImage: string;
  content: unknown;
  publishedAt: Date;
  readTimeMin: number;
  category: { name: string };
}): NewsItem {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    category: article.category.name,
    summary: article.summary,
    content: normalizeContent(article.content),
    imageUrl: article.coverImage,
    publishedAt: formatDate(article.publishedAt),
    readTime: `${article.readTimeMin} dk`,
  };
}

export async function getPublishedNews() {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      {
        isFeatured: "desc",
      },
      {
        publishedAt: "desc",
      },
    ],
  });

  return articles.map(mapArticleToNewsItem);
}

export async function getNewsBySlug(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!article || article.status !== "PUBLISHED") {
    return null;
  }

  return mapArticleToNewsItem(article);
}

export async function getNewsSlugs() {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      slug: true,
    },
  });

  return articles.map((article) => article.slug);
}

export async function getNewsCategories() {
  const categories = await prisma.category.findMany({
    where: {
      articles: {
        some: {
          status: "PUBLISHED",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    select: {
      name: true,
    },
  });

  return ["Tüm", ...categories.map((category) => category.name)];
}

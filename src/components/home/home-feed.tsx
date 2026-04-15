"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { NewsGrid } from "@/components/home/news-grid";
import { TopMenu } from "@/components/home/top-menu";
import type { NewsItem } from "@/types/news";

type ApiArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  imageUrl: string;
  content: string[];
  contentHtml?: string;
  publishedAt: string;
  readTimeMin: number;
  category: {
    name: string;
    slug: string;
  };
};

const DEFAULT_CATEGORY = "Tüm";
const CATEGORY_QUERY_KEY = "kategori";
const SEARCH_QUERY_KEY = "q";
const SEARCH_DEBOUNCE_MS = 250;

function mapApiArticleToNewsItem(article: ApiArticle): NewsItem {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    category: article.category.name,
    summary: article.summary,
    imageUrl: article.imageUrl,
    content: article.content,
    contentHtml: article.contentHtml,
    publishedAt: new Date(article.publishedAt).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    readTime: `${article.readTimeMin} dk`,
  };
}

export function HomeFeed() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<string[]>([DEFAULT_CATEGORY]);

  const activeCategory = useMemo(() => {
    const categoryFromQuery = searchParams.get(CATEGORY_QUERY_KEY);
    if (categoryFromQuery && categories.includes(categoryFromQuery)) {
      return categoryFromQuery;
    }
    return DEFAULT_CATEGORY;
  }, [searchParams, categories]);

  const searchQuery = searchParams.get(SEARCH_QUERY_KEY) ?? "";
  const [searchInput, setSearchInput] = useState(searchQuery);

  const updateFilters = useCallback(
    (nextCategory: string, nextSearchText: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextCategory === DEFAULT_CATEGORY) {
        params.delete(CATEGORY_QUERY_KEY);
      } else {
        params.set(CATEGORY_QUERY_KEY, nextCategory);
      }

      const trimmedSearchText = nextSearchText.trim();
      if (trimmedSearchText.length === 0) {
        params.delete(SEARCH_QUERY_KEY);
      } else {
        params.set(SEARCH_QUERY_KEY, nextSearchText);
      }

      const queryString = params.toString();
      const nextUrl = queryString.length > 0 ? `${pathname}?${queryString}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const handleCategoryChange = (nextCategory: string) => {
    updateFilters(nextCategory, searchInput);
  };

  const handleSearchChange = (nextSearchText: string) => {
    setSearchInput(nextSearchText);
  };

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        updateFilters(activeCategory, searchInput);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(debounceTimer);
  }, [searchInput, searchQuery, activeCategory, updateFilters]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories", { signal: controller.signal });
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as {
          data: Array<{ name: string }>;
        };
        setCategories([DEFAULT_CATEGORY, ...payload.data.map((category) => category.name)]);
      } catch {
        // Keep default category on error.
      }
    }

    loadCategories();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadArticles() {
      const params = new URLSearchParams();
      if (activeCategory !== DEFAULT_CATEGORY) {
        params.set("category", activeCategory);
      }
      const query = searchQuery.trim();
      if (query) {
        params.set("q", query);
      }
      params.set("limit", "24");

      const response = await fetch(`/api/articles?${params.toString()}`, {
        signal: controller.signal,
      });
      if (!response.ok) {
        setArticles([]);
        return;
      }

      const payload = (await response.json()) as { data: ApiArticle[] };
      setArticles(payload.data.map(mapApiArticleToNewsItem));
    }

    loadArticles().catch(() => setArticles([]));
    return () => controller.abort();
  }, [activeCategory, searchQuery]);

  return (
    <div className="space-y-6">
      <TopMenu
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchText={searchInput}
        onSearchChange={handleSearchChange}
      />
      <NewsGrid articles={articles} />
    </div>
  );
}

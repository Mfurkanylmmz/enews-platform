"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SEARCH_QUERY_KEY = "q";
const PAGE_QUERY_KEY = "sayfa";
const SEARCH_DEBOUNCE_MS = 250;

type ArticlesSearchInputProps = {
  initialValue: string;
};

export function ArticlesSearchInput({ initialValue }: ArticlesSearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const current = searchParams.get(SEARCH_QUERY_KEY) ?? "";
      if (current === query) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      const trimmed = query.trim();
      if (trimmed) {
        params.set(SEARCH_QUERY_KEY, trimmed);
      } else {
        params.delete(SEARCH_QUERY_KEY);
      }
      params.delete(PAGE_QUERY_KEY);

      const nextQuery = params.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.replace(nextUrl, { scroll: false });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, searchParams, pathname, router]);

  return (
    <div className="mb-4 flex items-center gap-2">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Başlık, özet veya slug ara"
        className="w-full max-w-md rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { NewsItem } from "@/types/news";

type HeroSectionProps = {
  articles: NewsItem[];
};

export function HeroSection({ articles }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeNews = articles[activeIndex];

  if (!activeNews) {
    return null;
  }

  const activateIndex = (index: number) => {
    setActiveIndex((previousIndex) => (previousIndex === index ? previousIndex : index));
  };

  return (
    <section className="grid gap-8 rounded-3xl bg-gradient-to-br from-white via-sky-50 to-indigo-50 p-6 shadow-[0_10px_35px_rgba(30,64,175,0.12)] ring-1 ring-blue-100 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-slate-900 dark:to-zinc-950 dark:shadow-[0_10px_40px_rgba(30,64,175,0.18)] dark:ring-zinc-800 md:grid-cols-2 md:p-8">
      <div className="flex min-h-80 flex-col rounded-2xl bg-white/70 p-4 ring-1 ring-blue-100/70 dark:bg-white/[0.03] dark:ring-white/10">
        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 ring-1 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/30">
          Günün Manşeti
        </span>
        <h1 className="mt-5 line-clamp-2 min-h-[4.5rem] text-3xl font-bold leading-tight text-zinc-900 dark:text-white md:min-h-[5rem] md:text-4xl">
          <Link href={`/haber/${activeNews.slug}`} className="hover:text-blue-700 dark:hover:text-blue-400">
            {activeNews.title}
          </Link>
        </h1>
        <p className="mt-4 line-clamp-3 min-h-[5.25rem] text-base leading-7 text-zinc-600 dark:text-zinc-200">
          {activeNews.summary}
        </p>
        <div className="mt-4 flex min-h-5 items-center gap-3 text-sm text-zinc-500 dark:text-zinc-300/80">
          <span>{activeNews.category}</span>
          <span aria-hidden>-</span>
          <span>{activeNews.publishedAt}</span>
          <span aria-hidden>-</span>
          <span>{activeNews.readTime}</span>
        </div>
        <div className="mt-auto flex items-center gap-2 pt-5">
          <div className="flex items-center gap-2">
            {articles.map((article, index) => (
              <button
                key={article.slug}
                type="button"
                onMouseOver={() => activateIndex(index)}
                onMouseMove={() => activateIndex(index)}
                onFocus={() => activateIndex(index)}
                className={`flex h-10 min-w-10 items-center justify-center rounded-md border px-2 text-base font-semibold leading-none transition ${
                  index === activeIndex
                    ? "border-blue-700 bg-blue-700 text-white shadow-sm shadow-blue-800/40"
                    : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-white/20 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.1]"
                }`}
                aria-label={`${index + 1}. haberi göster`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Link
        key={activeNews.slug}
        href={`/haber/${activeNews.slug}`}
        className="relative block min-h-64 overflow-hidden rounded-2xl ring-1 ring-blue-100 dark:ring-white/10"
      >
        <Image
          src={activeNews.imageUrl}
          alt={activeNews.title}
          fill
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </Link>
    </section>
  );
}

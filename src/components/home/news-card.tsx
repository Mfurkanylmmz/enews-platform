import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/types/news";

type NewsCardProps = {
  article: NewsItem;
};

export function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white/90 shadow-[0_8px_24px_rgba(30,64,175,0.08)] ring-1 ring-blue-100 transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(30,64,175,0.16)] dark:bg-white/[0.03] dark:shadow-[0_10px_28px_rgba(15,23,42,0.35)] dark:ring-white/10">
      <Link
        href={`/haber/${article.slug}`}
        className="relative block h-48 w-full overflow-hidden"
      >
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </Link>
      <div className="space-y-3 p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          {article.category}
        </span>
        <h2 className="line-clamp-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          <Link href={`/haber/${article.slug}`} className="hover:text-blue-700 dark:hover:text-blue-400">
            {article.title}
          </Link>
        </h2>
        <p className="line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{article.summary}</p>
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{article.publishedAt}</span>
          <span aria-hidden>-</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </article>
  );
}

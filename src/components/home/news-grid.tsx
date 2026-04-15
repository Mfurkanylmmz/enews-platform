import type { NewsItem } from "@/types/news";
import { NewsCard } from "@/components/home/news-card";

type NewsGridProps = {
  articles: NewsItem[];
};

export function NewsGrid({ articles }: NewsGridProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Son Haberler</h2>
        <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-white/[0.08] dark:text-zinc-300 dark:ring-1 dark:ring-white/10">
          {articles.length} sonuç
        </span>
      </div>
      {articles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-10 text-center text-sm text-zinc-600 dark:border-white/15 dark:bg-white/[0.03] dark:text-zinc-400">
          Bu filtreye uygun haber bulunamadı.
        </div>
      )}
    </section>
  );
}

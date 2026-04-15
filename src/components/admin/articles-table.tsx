"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type AdminArticleRow = {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryName: string;
  publishedAt: string;
};

type ArticlesTableProps = {
  initialArticles: AdminArticleRow[];
};

type StatusFilter = "ALL" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

export function ArticlesTable({ initialArticles }: ArticlesTableProps) {
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [busySlug, setBusySlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (statusFilter === "ALL") {
      return articles;
    }
    return articles.filter((article) => article.status === statusFilter);
  }, [articles, statusFilter]);

  const onDelete = async (slug: string) => {
    if (!window.confirm("Bu haberi silmek istediğinize emin misiniz?")) {
      return;
    }

    setBusySlug(slug);
    try {
      const response = await fetch(`/api/articles/${slug}`, { method: "DELETE" });
      if (!response.ok) {
        return;
      }
      setArticles((previous) => previous.filter((article) => article.slug !== slug));
      router.refresh();
    } finally {
      setBusySlug(null);
    }
  };

  return (
    <section className="space-y-4 rounded-2xl bg-white/90 p-6 shadow-[0_10px_32px_rgba(30,64,175,0.1)] ring-1 ring-blue-100 dark:bg-white/3 dark:ring-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Haberler</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-600 dark:text-zinc-300">Durum:</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            className="rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="ALL">Tümü</option>
            <option value="PUBLISHED">Yayında</option>
            <option value="DRAFT">Taslak</option>
            <option value="ARCHIVED">Arşiv</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
              <th className="px-2 py-2">Başlık</th>
              <th className="px-2 py-2">Kategori</th>
              <th className="px-2 py-2">Durum</th>
              <th className="px-2 py-2">Tarih</th>
              <th className="px-2 py-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((article) => (
                <tr key={article.id} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="px-2 py-2">
                    <p className="font-medium text-zinc-800 dark:text-zinc-100">{article.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">/{article.slug}</p>
                  </td>
                  <td className="px-2 py-2 text-zinc-700 dark:text-zinc-300">{article.categoryName}</td>
                  <td className="px-2 py-2 text-zinc-700 dark:text-zinc-300">{article.status}</td>
                  <td className="px-2 py-2 text-zinc-700 dark:text-zinc-300">{article.publishedAt}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/articles/${article.slug}`}
                        className="rounded-md bg-blue-700 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-800"
                      >
                        Düzenle
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDelete(article.slug)}
                        disabled={busySlug === article.slug}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-500/50 dark:text-red-300 dark:hover:bg-red-900/30"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-2 py-6 text-center text-zinc-500 dark:text-zinc-400">
                  Gösterilecek haber bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

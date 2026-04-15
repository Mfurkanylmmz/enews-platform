"use client";

import { type FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type EditableArticle = {
  title: string;
  slug: string;
  summary: string;
  coverImage: string;
  contentHtml: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categorySlug: string;
};

type EditArticleFormProps = {
  article: EditableArticle;
  categories: CategoryOption[];
};

export function EditArticleForm({ article, categories }: EditArticleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [summary, setSummary] = useState(article.summary);
  const [coverImage, setCoverImage] = useState(article.coverImage);
  const [contentHtml, setContentHtml] = useState(article.contentHtml || "<p></p>");
  const [status, setStatus] = useState(article.status);
  const [categorySlug, setCategorySlug] = useState(article.categorySlug);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const plainContent = useMemo(
    () => contentHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    [contentHtml],
  );
  const estimatedReadTime = Math.max(1, Math.ceil(plainContent.length / 500));

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/articles/${article.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          summary,
          coverImage,
          contentHtml,
          status,
          categorySlug,
          readTimeMin: estimatedReadTime,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setMessage(payload.error ?? "Güncelleme başarısız oldu.");
        setIsError(true);
        return;
      }

      setMessage("Haber güncellendi.");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl bg-white/90 p-6 shadow-[0_10px_32px_rgba(30,64,175,0.1)] ring-1 ring-blue-100 dark:bg-white/3 dark:ring-white/10"
    >
      <div>
        <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">Başlık</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">Slug</label>
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">Özet</label>
        <input
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">Kapak Görseli URL</label>
        <input
          value={coverImage}
          onChange={(event) => setCoverImage(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">Kategori</label>
          <select
            value={categorySlug}
            onChange={(event) => setCategorySlug(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">Durum</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as EditableArticle["status"])}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="PUBLISHED">Yayında</option>
            <option value="DRAFT">Taslak</option>
            <option value="ARCHIVED">Arşiv</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">İçerik</label>
        <RichTextEditor value={contentHtml} onChange={setContentHtml} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
      >
        {isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
      </button>

      {message ? (
        <p className={`text-sm ${isError ? "text-red-600 dark:text-red-400" : "text-zinc-600 dark:text-zinc-300"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}

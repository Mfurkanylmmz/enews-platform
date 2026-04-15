"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type ArticleStatus = "DRAFT" | "PUBLISHED";

const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=80";

function slugify(input: string) {
  return input
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function NewArticleForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [contentHtml, setContentHtml] = useState("<p></p>");
  const [coverImage, setCoverImage] = useState(DEFAULT_COVER_IMAGE);
  const [status, setStatus] = useState<ArticleStatus>("PUBLISHED");
  const [categorySlug, setCategorySlug] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      const response = await fetch("/api/categories", { signal: controller.signal });
      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { data: CategoryOption[] };
      setCategories(payload.data);
      if (payload.data.length > 0) {
        setCategorySlug(payload.data[0].slug);
      }
    }

    loadCategories().catch(() => undefined);
    return () => controller.abort();
  }, []);

  const plainContent = useMemo(
    () => contentHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    [contentHtml],
  );
  const estimatedReadTime = Math.max(1, Math.ceil(plainContent.length / 500));
  const slugPreview = useMemo(() => slugify(title), [title]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug: slugPreview,
          summary,
          categorySlug,
          contentHtml,
          coverImage,
          readTimeMin: estimatedReadTime,
          status,
          isFeatured: false,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setMessage(payload.error ?? "Kayıt sırasında bir hata oluştu.");
        setIsError(true);
        return;
      }

      setMessage("Haber başarıyla eklendi.");
      setTitle("");
      setSummary("");
      setContentHtml("<p></p>");
      setCoverImage(DEFAULT_COVER_IMAGE);
      setStatus("PUBLISHED");
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
        <label htmlFor="title" className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Başlık
        </label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div>
        <label htmlFor="summary" className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Özet
        </label>
        <input
          id="summary"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Slug Önizlemesi
        </label>
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          {slugPreview ? `/haber/${slugPreview}` : "/haber/slug-onizleme"}
        </div>
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Kategori
        </label>
        <select
          id="category"
          value={categorySlug}
          onChange={(event) => setCategorySlug(event.target.value)}
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="coverImage" className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Kapak Görseli URL
        </label>
        <input
          id="coverImage"
          type="url"
          value={coverImage}
          onChange={(event) => setCoverImage(event.target.value)}
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div>
        <label htmlFor="status" className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Durum
        </label>
        <select
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as ArticleStatus)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="PUBLISHED">Yayında</option>
          <option value="DRAFT">Taslak</option>
        </select>
      </div>

      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          İçerik
        </label>
        <RichTextEditor value={contentHtml} onChange={setContentHtml} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Kaydediliyor..." : "Haberi Kaydet"}
      </button>

      {message ? (
        <p className={`text-sm ${isError ? "text-red-600 dark:text-red-400" : "text-zinc-600 dark:text-zinc-300"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}

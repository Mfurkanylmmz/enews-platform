import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, isValidAdminSecret } from "@/lib/server/admin-auth";
import { ArticlesTable } from "@/components/admin/articles-table";
import { ArticlesSearchInput } from "@/components/admin/articles-search-input";

const PAGE_SIZE = 12;

type PageProps = {
  searchParams: Promise<{
    q?: string;
    sayfa?: string;
  }>;
};

function toSafePage(input: string | undefined) {
  if (!input) {
    return 1;
  }
  const parsed = Number.parseInt(input, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
}

function withQuery(params: { q?: string; sayfa: number }) {
  const query = new URLSearchParams();
  if (params.q) {
    query.set("q", params.q);
  }
  query.set("sayfa", String(params.sayfa));
  return `/admin/articles?${query.toString()}`;
}

export default async function AdminArticlesPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isValidAdminSecret(session)) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const currentPage = toSafePage(params.sayfa);
  const offset = (currentPage - 1) * PAGE_SIZE;

  const where = {
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { summary: { contains: q, mode: "insensitive" as const } },
            { slug: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: PAGE_SIZE,
      skip: offset,
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Admin Haber Yönetimi</h1>
        <Link
          href="/admin/new-article"
          className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Yeni Haber
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <ArticlesSearchInput initialValue={q} />
        {q ? (
          <Link
            href="/admin/articles"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Temizle
          </Link>
        ) : null}
      </div>

      <div className="mb-3 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300">
        <span>
          Toplam {total} haber{q ? ` • "${q}" için sonuçlar` : ""}
        </span>
        <span>
          Sayfa {currentPage} / {totalPages}
        </span>
      </div>

      <ArticlesTable
        initialArticles={articles.map((article) => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          status: article.status,
          categoryName: article.category.name,
          publishedAt: new Intl.DateTimeFormat("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(article.publishedAt),
        }))}
      />

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link
          href={hasPrev ? withQuery({ q: q || undefined, sayfa: currentPage - 1 }) : "#"}
          aria-disabled={!hasPrev}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Önceki
        </Link>
        <Link
          href={hasNext ? withQuery({ q: q || undefined, sayfa: currentPage + 1 }) : "#"}
          aria-disabled={!hasNext}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Sonraki
        </Link>
      </div>
    </main>
  );
}

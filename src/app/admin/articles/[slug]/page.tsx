import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, isValidAdminSecret } from "@/lib/server/admin-auth";
import { EditArticleForm } from "@/components/admin/edit-article-form";

type PageContext = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminArticleEditPage({ params }: PageContext) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isValidAdminSecret(session)) {
    redirect("/admin/login");
  }

  const { slug } = await params;

  const [article, categories] = await Promise.all([
    prisma.article.findUnique({
      where: { slug },
      include: {
        category: {
          select: { slug: true },
        },
      },
    }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!article) {
    notFound();
  }

  const contentHtml = (() => {
    if (typeof article.content === "string") {
      return article.content;
    }
    if (Array.isArray(article.content)) {
      const paragraphs = article.content.filter((item): item is string => typeof item === "string");
      return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
    }
    return "<p></p>";
  })();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Haberi Düzenle</h1>
        <Link
          href="/admin/articles"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Listeye Dön
        </Link>
      </div>

      <EditArticleForm
        categories={categories}
        article={{
          title: article.title,
          slug: article.slug,
          summary: article.summary,
          coverImage: article.coverImage,
          contentHtml,
          status: article.status,
          categorySlug: article.category.slug,
        }}
      />
    </main>
  );
}

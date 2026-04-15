import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NewArticleForm } from "@/components/admin/new-article-form";
import { ADMIN_COOKIE_NAME, isValidAdminSecret } from "@/lib/server/admin-auth";

export default async function AdminNewArticlePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isValidAdminSecret(session)) {
    redirect("/admin/login");
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Haber Ekle</h1>
        <Link
          href="/admin/articles"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Haber Listesi
        </Link>
      </div>
      <NewArticleForm />
    </main>
  );
}

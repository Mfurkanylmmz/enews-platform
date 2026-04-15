import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { ADMIN_COOKIE_NAME, isValidAdminSecret } from "@/lib/server/admin-auth";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (isValidAdminSecret(session)) {
    redirect("/admin/new-article");
  }

  return (
    <main className="mx-auto w-full max-w-xl px-6 py-12">
      <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Admin Girişi</h1>
      <LoginForm />
    </main>
  );
}

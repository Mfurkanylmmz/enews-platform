import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | E-News",
  description: "E-News içerik kullanımı ve hizmet koşulları.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <article className="rounded-2xl bg-white/90 p-6 shadow-[0_8px_24px_rgba(30,64,175,0.08)] ring-1 ring-blue-100 dark:bg-white/[0.03] dark:ring-white/10">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Kullanım Koşulları</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          E-News üzerinde yer alan içerikler bilgilendirme amaçlıdır. İçeriklerin izinsiz
          kopyalanması veya ticari amaçla kullanımı yasaktır.
        </p>
      </article>
    </main>
  );
}

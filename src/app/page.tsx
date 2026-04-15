import type { Metadata } from "next";
import { Suspense } from "react";
import { AdSlot } from "@/components/ads/ad-slot";
import { HomeFeed } from "@/components/home/home-feed";
import { HeroSection } from "@/components/home/hero-section";
import { NewsNavbar } from "@/components/home/news-navbar";
import { SuperLigSidebar } from "@/components/home/superlig-sidebar";
import { ThemeToggle } from "@/components/home/theme-toggle";
import { getPublishedNews } from "@/lib/server/news";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const allNews = await getPublishedNews();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-blue-50 to-zinc-100 dark:bg-gradient-to-b dark:from-zinc-950 dark:via-slate-950 dark:to-zinc-900">
      <Suspense fallback={<div className="h-20 w-full" />}>
        <NewsNavbar />
      </Suspense>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-8 lg:py-12">
        <AdSlot label="Üst Banner (970x90 / 728x90)" />
        <HeroSection articles={allNews} />
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <Suspense fallback={<div className="text-sm text-zinc-500 dark:text-zinc-400">Yukleniyor...</div>}>
            <HomeFeed />
          </Suspense>
          <div className="space-y-6">
            <AdSlot label="Sağ Sidebar (300x250)" />
            <SuperLigSidebar />
          </div>
        </section>
      </main>
      <ThemeToggle />
    </div>
  );
}

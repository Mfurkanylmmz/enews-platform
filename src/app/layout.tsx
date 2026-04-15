import type { Metadata } from "next";
import Link from "next/link";
import { ConsentBanner } from "@/components/consent/consent-banner";
import { Geist, Geist_Mono } from "next/font/google";
import { AppThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "E-News | Modern Haber Sitesi",
  description: "Next.js, TypeScript ve Tailwind ile geliştirilmiş haber sitesi",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "E-News | Modern Haber Sitesi",
    description: "Güncel gelişmeler, analizler ve özel dosyalar",
    url: "/",
    siteName: "E-News",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "E-News ana sayfa Open Graph görseli",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-News | Modern Haber Sitesi",
    description: "Güncel gelişmeler, analizler ve özel dosyalar",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AppThemeProvider>
          <div className="flex min-h-full flex-col">
            <div className="flex-1">{children}</div>
            <footer className="border-t border-zinc-200/70 bg-white/70 px-6 py-4 text-xs text-zinc-600 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400">
              <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3">
                <p>E-News © 2026</p>
                <nav className="flex flex-wrap items-center gap-3">
                  <Link href="/gizlilik-politikasi" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                    Gizlilik
                  </Link>
                  <Link href="/cerez-politikasi" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                    Çerez
                  </Link>
                  <Link href="/kullanim-kosullari" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                    Kullanım Koşulları
                  </Link>
                  <Link href="/iletisim" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                    İletişim
                  </Link>
                </nav>
              </div>
            </footer>
          </div>
          <ConsentBanner />
        </AppThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/ad-slot";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { NewsItem } from "@/types/news";
import { prisma } from "@/lib/prisma";
import { toArticleResponse } from "@/lib/api/article-response";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

async function fetchArticleBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!article || article.status !== "PUBLISHED") {
      return null;
    }

    const mapped = toArticleResponse(article);

    return {
      id: mapped.id,
      slug: mapped.slug,
      title: mapped.title,
      summary: mapped.summary,
      imageUrl: mapped.imageUrl,
      content: mapped.content,
      contentHtml: mapped.contentHtml,
      category: mapped.category.name,
      publishedAt: new Date(mapped.publishedAt).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      readTime: `${mapped.readTimeMin} dk`,
    };
  } catch (error) {
    console.error(`Failed to fetch article by slug: ${slug}`, error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    return {
      title: "Haber Bulunamadı | E-News",
    };
  }

  return {
    title: `${article.title} | E-News`,
    description: article.summary,
    alternates: {
      canonical: `/haber/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `/haber/${article.slug}`,
      type: "article",
      locale: "tr_TR",
      images: [
        {
          url: `/haber/${article.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [`/haber/${article.slug}/opengraph-image`],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-blue-50 to-zinc-100 dark:bg-linear-to-b dark:from-zinc-950 dark:via-slate-950 dark:to-zinc-900">
      <main className="mx-auto w-full max-w-4xl px-6 py-10 md:px-8 lg:py-12">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li>
              <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-200">
                Ana Sayfa
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <span>Haber</span>
            </li>
            <li aria-hidden>/</li>
            <li className="line-clamp-1 text-zinc-700 dark:text-zinc-300">{article.title}</li>
          </ol>
        </nav>
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-700 shadow-[0_8px_20px_rgba(30,64,175,0.08)] ring-1 ring-blue-100 hover:text-zinc-900 dark:bg-white/4 dark:text-zinc-300 dark:ring-white/15 dark:hover:bg-white/8 dark:hover:text-zinc-100"
        >
          Ana Sayfaya Dön
        </Link>
        <article className="mt-6 overflow-hidden rounded-3xl bg-white/90 shadow-[0_10px_32px_rgba(30,64,175,0.1)] ring-1 ring-blue-100 dark:bg-white/3 dark:shadow-[0_10px_36px_rgba(15,23,42,0.35)] dark:ring-white/10">
          <div className="relative h-72 w-full md:h-96">
            <Image
              src={article.imageUrl || "https://via.placeholder.com/800x400?text=No+Image"}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 900px"
              priority
            />
          </div>
          <div className="space-y-6 p-6 md:p-10">
            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              {article.category}
            </span>
            <h1 className="text-3xl font-bold leading-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
              {article.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              <span>{article.publishedAt}</span>
              <span aria-hidden>-</span>
              <span>{article.readTime}</span>
            </div>
            <AdSlot label="İçerik Arası Reklam (728x90 / 320x100)" />
            <p className="text-lg leading-8 text-zinc-700 dark:text-zinc-300">{article.summary}</p>
            {article.contentHtml ? (
              <div
                className="text-base leading-8 text-zinc-700 dark:text-zinc-300 [&_a]:font-semibold [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-2 dark:[&_a]:text-blue-300 [&_blockquote]:my-6 [&_blockquote]:rounded-r-2xl [&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:bg-blue-50/70 [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:text-zinc-700 [&_blockquote]:italic dark:[&_blockquote]:border-blue-800 dark:[&_blockquote]:bg-blue-950/40 dark:[&_blockquote]:text-zinc-200 [&_figure]:my-7 [&_figure]:overflow-hidden [&_figure]:rounded-2xl [&_figure]:border [&_figure]:border-zinc-200/80 [&_figure]:bg-zinc-50/70 dark:[&_figure]:border-zinc-700 dark:[&_figure]:bg-zinc-900/40 [&_figure_img]:w-full [&_figure_img]:object-cover [&_figcaption]:border-t [&_figcaption]:border-zinc-200/70 [&_figcaption]:bg-white/70 [&_figcaption]:px-4 [&_figcaption]:py-2 [&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:font-medium [&_figcaption]:tracking-wide [&_figcaption]:text-zinc-500 dark:[&_figcaption]:border-zinc-700 dark:[&_figcaption]:bg-zinc-900/70 dark:[&_figcaption]:text-zinc-400 [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
                dangerouslySetInnerHTML={{ __html: article.contentHtml }}
              />
            ) : (
              <div className="space-y-4 text-base leading-8 text-zinc-700 dark:text-zinc-300">
                {article.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}

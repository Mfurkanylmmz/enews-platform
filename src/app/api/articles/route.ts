import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toArticleResponse } from "@/lib/api/article-response";
import { isAuthorizedRequest } from "@/lib/server/admin-auth";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

function toSafeInt(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
}

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q")?.trim();
  const limit = Math.min(Math.max(toSafeInt(searchParams.get("limit"), DEFAULT_LIMIT), 1), MAX_LIMIT);
  const offset = Math.max(toSafeInt(searchParams.get("offset"), 0), 0);

  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      ...(category && category !== "Tüm"
        ? {
            category: {
              OR: [{ name: category }, { slug: category.toLocaleLowerCase("tr-TR") }],
            },
          }
        : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { summary: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
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
    orderBy: {
      publishedAt: "desc",
    },
    take: limit,
    skip: offset,
  });

  const total = await prisma.article.count({
    where: {
      status: "PUBLISHED",
      ...(category && category !== "Tüm"
        ? {
            category: {
              OR: [{ name: category }, { slug: category.toLocaleLowerCase("tr-TR") }],
            },
          }
        : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { summary: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
  });

  return NextResponse.json({
    data: articles.map(toArticleResponse),
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  });
}

export async function POST(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    slug?: string;
    summary?: string;
    coverImage?: string;
    content?: string[];
    contentHtml?: string;
    publishedAt?: string;
    readTimeMin?: number;
    categorySlug?: string;
    authorSlug?: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    isFeatured?: boolean;
  };

  if (!body.title || !body.summary || !body.coverImage || !body.categorySlug) {
    return NextResponse.json(
      { error: "title, summary, coverImage and categorySlug are required" },
      { status: 400 },
    );
  }

  const slug = body.slug?.trim() || slugify(body.title);
  if (!slug) {
    return NextResponse.json({ error: "slug could not be generated" }, { status: 400 });
  }

  const category = await prisma.category.findUnique({
    where: { slug: body.categorySlug },
    select: { id: true },
  });

  if (!category) {
    return NextResponse.json({ error: "category not found" }, { status: 404 });
  }

  const author = body.authorSlug
    ? await prisma.author.findUnique({
        where: { slug: body.authorSlug },
        select: { id: true },
      })
    : null;

  const created = await prisma.article.create({
    data: {
      title: body.title,
      slug,
      summary: body.summary,
      coverImage: body.coverImage,
      content:
        typeof body.contentHtml === "string"
          ? body.contentHtml
          : Array.isArray(body.content)
            ? body.content
            : [],
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      readTimeMin: body.readTimeMin ?? 3,
      status: body.status ?? "DRAFT",
      isFeatured: body.isFeatured ?? false,
      categoryId: category.id,
      authorId: author?.id,
    },
    include: {
      category: { select: { name: true, slug: true } },
      author: { select: { name: true, slug: true } },
    },
  });

  return NextResponse.json({ data: toArticleResponse(created) }, { status: 201 });
}

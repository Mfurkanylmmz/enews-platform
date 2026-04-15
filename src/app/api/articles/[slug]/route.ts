import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toArticleResponse } from "@/lib/api/article-response";
import { isAuthorizedRequest } from "@/lib/server/admin-auth";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  const request = _;
  const { slug } = await context.params;

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

  const isAuthorized = isAuthorizedRequest(request);

  if (!article || (!isAuthorized && article.status !== "PUBLISHED")) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: toArticleResponse(article),
  });
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

export async function PUT(request: Request, context: RouteContext) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;
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

  const existing = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const nextTitle = body.title?.trim();
  const nextSlug = body.slug?.trim() || (nextTitle ? slugify(nextTitle) : undefined);

  let categoryId: string | undefined;
  if (body.categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: body.categorySlug },
      select: { id: true },
    });
    if (!category) {
      return NextResponse.json({ error: "category not found" }, { status: 404 });
    }
    categoryId = category.id;
  }

  let authorId: string | null | undefined;
  if (body.authorSlug === null) {
    authorId = null;
  } else if (body.authorSlug) {
    const author = await prisma.author.findUnique({
      where: { slug: body.authorSlug },
      select: { id: true },
    });
    if (!author) {
      return NextResponse.json({ error: "author not found" }, { status: 404 });
    }
    authorId = author.id;
  }

  const updated = await prisma.article.update({
    where: { slug },
    data: {
      ...(nextTitle ? { title: nextTitle } : {}),
      ...(nextSlug ? { slug: nextSlug } : {}),
      ...(body.summary ? { summary: body.summary } : {}),
      ...(body.coverImage ? { coverImage: body.coverImage } : {}),
      ...(typeof body.contentHtml === "string"
        ? { content: body.contentHtml }
        : Array.isArray(body.content)
          ? { content: body.content }
          : {}),
      ...(body.publishedAt ? { publishedAt: new Date(body.publishedAt) } : {}),
      ...(typeof body.readTimeMin === "number" ? { readTimeMin: body.readTimeMin } : {}),
      ...(body.status ? { status: body.status } : {}),
      ...(typeof body.isFeatured === "boolean" ? { isFeatured: body.isFeatured } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(authorId !== undefined ? { authorId } : {}),
    },
    include: {
      category: { select: { name: true, slug: true } },
      author: { select: { name: true, slug: true } },
    },
  });

  return NextResponse.json({ data: toArticleResponse(updated) });
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;

  const existing = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  await prisma.article.delete({ where: { slug } });
  return NextResponse.json({ success: true });
}

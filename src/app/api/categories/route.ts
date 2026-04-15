import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          articles: {
            where: {
              status: "PUBLISHED",
            },
          },
        },
      },
    },
  });

  return NextResponse.json({
    data: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      articleCount: category._count.articles,
    })),
  });
}

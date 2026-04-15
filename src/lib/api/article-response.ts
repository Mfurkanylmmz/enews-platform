type RawArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImage: string;
  content: unknown;
  publishedAt: Date;
  readTimeMin: number;
  category: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
    slug: string;
  } | null;
};

function normalizeContent(content: unknown): { content: string[]; contentHtml: string } {
  if (typeof content === "string") {
    const plainText = content
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return {
      content: plainText ? [plainText] : [],
      contentHtml: content,
    };
  }

  if (Array.isArray(content)) {
    const paragraphs = content.filter((item): item is string => typeof item === "string");
    return {
      content: paragraphs,
      contentHtml: paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join(""),
    };
  }

  return { content: [], contentHtml: "" };
}

export function toArticleResponse(article: RawArticle) {
  const normalized = normalizeContent(article.content);
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    imageUrl: article.coverImage || "https://via.placeholder.com/800x400?text=No+Image",
    content: normalized.content,
    contentHtml: normalized.contentHtml,
    publishedAt: article.publishedAt?.toISOString() || new Date().toISOString(),
    readTimeMin: article.readTimeMin || 3,
    category: article.category,
    author: article.author,
  };
}

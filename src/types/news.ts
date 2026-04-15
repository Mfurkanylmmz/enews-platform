export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string[];
  contentHtml?: string;
  imageUrl: string;
  publishedAt: string;
  readTime: string;
};

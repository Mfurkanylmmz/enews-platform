import { ImageResponse } from "next/og";
import { getNewsBySlug } from "@/lib/server/news";

type OpenGraphImageProps = {
  params: Promise<{ slug: string }>;
};

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { slug } = await params;
  let article = null;
  try {
    article = await getNewsBySlug(slug);
  } catch (error) {
    console.error(`Failed to fetch article for OG image: ${slug}`, error);
  }

  const title = article?.title ?? "Haber Bulunamadı";
  const category = article?.category ?? "E-News";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #111827, #1d4ed8)",
          color: "white",
          padding: "64px",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 1,
            opacity: 0.9,
          }}
        >
          {category} • E-News
        </div>
        <div
          style={{
            fontSize: 62,
            lineHeight: 1.1,
            fontWeight: 700,
            maxWidth: 1020,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 26, opacity: 0.9 }}>e-news.example.com</div>
      </div>
    ),
    size,
  );
}

import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a, #1d4ed8)",
          color: "white",
          padding: "72px",
        }}
      >
        <div
          style={{
            fontSize: 36,
            opacity: 0.9,
            letterSpacing: 2,
          }}
        >
          E-NEWS
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 920,
          }}
        >
          Modern Haber Platformu
        </div>
        <div style={{ marginTop: 24, fontSize: 30, opacity: 0.9 }}>
          Güncel gelişmeler, analizler ve özel dosyalar
        </div>
      </div>
    ),
    size,
  );
}

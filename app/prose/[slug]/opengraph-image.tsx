import { ImageResponse } from "next/og";
import { getWorkByPublicSegment } from "@/lib/works-store";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkByPublicSegment(slug);

  const title =
    work && work.category === "prose" && work.isPublished
      ? work.title
      : "Наталья Мельхер";

  const excerpt =
    work && work.category === "prose" && work.isPublished
      ? work.excerpt || "Проза и вдохновение"
      : "Проза и вдохновение";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #0c0a09 0%, #1c1410 42%, #1f1612 100%)",
          color: "white",
          padding: "64px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#fbbf24",
            letterSpacing: 2,
          }}
        >
          Наталья Мельхер
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 60,
              lineHeight: 1.1,
              fontWeight: 700,
              color: "#fffbeb",
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "#d1d5db",
              maxWidth: "900px",
            }}
          >
            {excerpt}
          </div>
        </div>

        <div
          style={{
            fontSize: 22,
            color: "#c084fc",
          }}
        >
          Проза • natalia-melkher.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

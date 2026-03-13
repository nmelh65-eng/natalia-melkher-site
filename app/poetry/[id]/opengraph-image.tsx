import { ImageResponse } from "next/og";
import { getWorkById } from "@/lib/works-store";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const work = await getWorkById(id);

  const title =
    work && work.category === "poetry" && work.isPublished
      ? work.title
      : "Наталья Мельхер";

  const excerpt =
    work && work.category === "poetry" && work.isPublished
      ? work.excerpt || "Поэзия и вдохновение"
      : "Поэзия и вдохновение";

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
            "linear-gradient(135deg, #09090f 0%, #140a1f 45%, #1b1026 100%)",
          color: "white",
          padding: "64px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#c084fc",
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
              fontSize: 64,
              lineHeight: 1.1,
              fontWeight: 700,
              color: "#f5f3ff",
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
            color: "#fbbf24",
          }}
        >
          Поэзия • natalia-melkher.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

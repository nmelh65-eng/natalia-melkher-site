import { ImageResponse } from "next/og";
import { getWorkByPublicSegment } from "@/lib/works-store";
import type { WorkCategory } from "@/types";
import { CATEGORY_DEF, type CategoryTheme } from "@/lib/work-categories";

export const WORK_OG_SIZE = { width: 1200, height: 630 };
export const WORK_OG_CONTENT_TYPE = "image/png";

const THEME_OG: Record<
  CategoryTheme,
  { gradient: string; accent: string; sub: string }
> = {
  purple: {
    gradient: "linear-gradient(135deg, #09090f 0%, #140a1f 45%, #1b1026 100%)",
    accent: "#c084fc",
    sub: "#fbbf24",
  },
  amber: {
    gradient: "linear-gradient(135deg, #0c0a08 0%, #1a1208 45%, #120d06 100%)",
    accent: "#fbbf24",
    sub: "#c084fc",
  },
  emerald: {
    gradient: "linear-gradient(135deg, #050f0c 0%, #0a1f18 50%, #061410 100%)",
    accent: "#6ee7b7",
    sub: "#a7f3d0",
  },
  sky: {
    gradient: "linear-gradient(135deg, #050a12 0%, #0a1520 50%, #061018 100%)",
    accent: "#7dd3fc",
    sub: "#bae6fd",
  },
  rose: {
    gradient: "linear-gradient(135deg, #10060a 0%, #1a0a12 50%, #120810 100%)",
    accent: "#fda4af",
    sub: "#fecdd3",
  },
  violet: {
    gradient: "linear-gradient(135deg, #0a0614 0%, #120a22 50%, #0c0818 100%)",
    accent: "#c4b5fd",
    sub: "#ddd6fe",
  },
};

export function createWorkOpengraphImage(expectedCategory: WorkCategory) {
  return async function OpengraphImage({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
    const { slug } = await params;
    const work = await getWorkByPublicSegment(slug);
    const ok =
      work &&
      work.category === expectedCategory &&
      work.isPublished &&
      CATEGORY_DEF[expectedCategory];

    const theme = ok
      ? THEME_OG[CATEGORY_DEF[expectedCategory].theme]
      : THEME_OG.purple;

    const title =
      ok ? work.title : "Наталья Мельхер";
    const excerpt =
      ok
        ? work.excerpt || CATEGORY_DEF[expectedCategory].sectionLabelRu
        : "Наталья Мельхер";

    const footer = ok
      ? `${CATEGORY_DEF[expectedCategory].ogFooterRu} • natalia-melkher.vercel.app`
      : "natalia-melkher.vercel.app";

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: theme.gradient,
            color: "white",
            padding: "64px",
            fontFamily: "serif",
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: theme.accent,
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
              color: theme.sub,
            }}
          >
            {footer}
          </div>
        </div>
      ),
      { ...WORK_OG_SIZE }
    );
  };
}

import type { Metadata } from "next";
import { getWorkByPublicSegment } from "@/lib/works-store";
import { getWorkSlug } from "@/lib/slug";
import { getPublicSiteUrl } from "@/lib/site-url";
import type { WorkCategory } from "@/types";
import { CATEGORY_DEF } from "@/lib/work-categories";

const BASE = getPublicSiteUrl();

export function buildWorkSlugGenerateMetadata(expectedCategory: WorkCategory) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }): Promise<Metadata> {
    const { slug } = await params;
    const work = await getWorkByPublicSegment(slug);
    const section = CATEGORY_DEF[expectedCategory].sectionLabelRu;

    const notFoundMeta: Metadata = {
      title: `Не найдено | ${section} | Наталья Мельхер`,
      description: "Запрашиваемое произведение не найдено.",
      robots: { index: false, follow: false },
    };

    if (!work || work.category !== expectedCategory || !work.isPublished) {
      return notFoundMeta;
    }

    const pathSlug = getWorkSlug(work);
    const url = `${BASE}/${expectedCategory}/${pathSlug}`;
    const description = work.excerpt || work.content.slice(0, 160);

    return {
      title: `${work.title} | ${section} | Наталья Мельхер`,
      description,
      alternates: { canonical: url },
      openGraph: {
        title: work.title,
        description,
        url,
        type: "article",
        siteName: "Наталья Мельхер",
        images: [
          {
            url: `/${expectedCategory}/${pathSlug}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: work.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: work.title,
        description,
        images: [`/${expectedCategory}/${pathSlug}/opengraph-image`],
      },
    };
  };
}

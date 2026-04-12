import type { Metadata } from "next";
import { getWorkByPublicSegment } from "@/lib/works-store";
import { getWorkSlug } from "@/lib/slug";
import { getPublicSiteUrl } from "@/lib/site-url";

const BASE = getPublicSiteUrl();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkByPublicSegment(slug);

  if (!work || work.category !== "poetry" || !work.isPublished) {
    return {
      title: "Стихотворение не найдено | Наталья Мельхер",
      description: "Запрашиваемое стихотворение не найдено.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const pathSlug = getWorkSlug(work);
  const url = `${BASE}/poetry/${pathSlug}`;

  return {
    title: `${work.title} | Поэзия | Наталья Мельхер`,
    description: work.excerpt || work.content.slice(0, 160),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: work.title,
      description: work.excerpt || work.content.slice(0, 160),
      url,
      type: "article",
      siteName: "Наталья Мельхер",
      images: [
        {
          url: `/poetry/${pathSlug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: work.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: work.title,
      description: work.excerpt || work.content.slice(0, 160),
      images: [`/poetry/${pathSlug}/opengraph-image`],
    },
  };
}

import type { Metadata } from "next";
import { getWorkByPublicSegment } from "@/lib/works-store";
import { getWorkSlug } from "@/lib/slug";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkByPublicSegment(slug);

  if (!work || work.category !== "prose" || !work.isPublished) {
    return {
      title: "Произведение не найдено | Наталья Мельхер",
      description: "Запрашиваемое произведение не найдено.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const pathSlug = getWorkSlug(work);
  const url = `${BASE}/prose/${pathSlug}`;

  return {
    title: `${work.title} | Проза | Наталья Мельхер`,
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
    },
    twitter: {
      card: "summary_large_image",
      title: work.title,
      description: work.excerpt || work.content.slice(0, 160),
    },
  };
}

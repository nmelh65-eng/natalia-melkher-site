import type { Metadata } from "next";
import { getWorkById } from "@/lib/works-store";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const work = await getWorkById(id);

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

  return {
    title: `${work.title} | Поэзия | Наталья Мельхер`,
    description: work.excerpt || work.content.slice(0, 160),
    alternates: {
      canonical: `${BASE}/poetry/${work.id}`,
    },
    openGraph: {
      title: work.title,
      description: work.excerpt || work.content.slice(0, 160),
      url: `${BASE}/poetry/${work.id}`,
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

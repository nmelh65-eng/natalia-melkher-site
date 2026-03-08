import type { Metadata } from "next";
import { getWorkById } from "@/data/works";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const work = getWorkById(params.id);
  if (!work) return { title: "Стихотворение не найдено" };

  const title = work.title;
  const description = work.excerpt || work.content.slice(0, 155).replace(/\n/g, " ");
  const url = `${BASE}/poetry/${work.id}`;

  return {
    title,
    description,
    keywords: [...work.tags, "поэзия", "стихи", "Наталья Мельхер"],
    openGraph: {
      title, description, url, type:"article",
      publishedTime: work.createdAt, modifiedTime: work.updatedAt,
      authors: ["Наталья Мельхер"],
      tags: work.tags,
      images: [{ url: `/poetry/${work.id}/opengraph-image`, width:1200, height:630 }],
    },
    twitter: { card:"summary_large_image", title, description },
    alternates: { canonical: url },
  };
}

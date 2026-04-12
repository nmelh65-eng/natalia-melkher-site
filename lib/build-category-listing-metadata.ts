import type { Metadata } from "next";
import type { WorkCategory } from "@/types";
import { CATEGORY_DEF } from "@/lib/work-categories";
import { getPublicSiteUrl } from "@/lib/site-url";

const BASE = getPublicSiteUrl();

const DESCRIPTIONS: Record<WorkCategory, string> = {
  poetry:
    "Авторская поэзия Натальи Мельхер: современные стихи, лирика и поэтические тексты.",
  prose:
    "Авторская проза: литературные миниатюры, короткие истории и размышления.",
  essay: "Эссе и эссеистика — короткие тексты о жизни, творчестве и смысле.",
  notes: "Заметки и наблюдения между поэзией и дневником.",
  quotes: "Цитаты и короткие формулировки для души.",
  inspiration: "Тексты о свете, надежде и внутреннем движении.",
};

export function buildCategoryListingMetadata(
  category: WorkCategory
): Metadata {
  const section = CATEGORY_DEF[category].sectionLabelRu;
  const url = `${BASE}/${category}`;
  const description = DESCRIPTIONS[category];

  return {
    title: `${section} | Наталья Мельхер`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: section,
      description,
      url,
      type: "website",
      siteName: "Наталья Мельхер",
    },
    twitter: {
      card: "summary_large_image",
      title: `${section} | Наталья Мельхер`,
      description,
    },
  };
}

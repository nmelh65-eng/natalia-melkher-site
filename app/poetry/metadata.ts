import type { Metadata } from "next";
import { withEnDeHints } from "@/lib/metadata-locale-hints";
import { getPublicSiteUrl } from "@/lib/site-url";

const BASE = getPublicSiteUrl();

const core: Metadata = {
  title: "Поэзия Натальи Мельхер",
  description:
    "Раздел поэзии Натальи Мельхер: современные стихи, лирические тексты, авторская поэзия и вдохновляющие произведения.",
  alternates: {
    canonical: `${BASE}/poetry`,
  },
  openGraph: {
    title: "Поэзия Натальи Мельхер",
    description:
      "Современная авторская поэзия Натальи Мельхер: стихи, лирика и вдохновение.",
    url: `${BASE}/poetry`,
    type: "website",
    siteName: "Наталья Мельхер",
  },
  twitter: {
    card: "summary_large_image",
    title: "Поэзия Натальи Мельхер",
    description:
      "Современная авторская поэзия Натальи Мельхер: стихи, лирика и вдохновение.",
  },
};

export const metadata = withEnDeHints(core, {
  titleEn: "Poetry by Natalia Melkher",
  titleDe: "Poesie von Natalia Melkher",
  descriptionEn:
    "Poetry by Natalia Melkher: contemporary verse, lyric texts, and inspiring work.",
  descriptionDe:
    "Poesie von Natalia Melkher: zeitgenössische Verse, Lyrik und inspirierende Texte.",
});

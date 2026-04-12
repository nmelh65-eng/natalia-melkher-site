import type { Metadata } from "next";
import { withEnDeHints } from "@/lib/metadata-locale-hints";
import { getPublicSiteUrl } from "@/lib/site-url";

const BASE = getPublicSiteUrl();

const core: Metadata = {
  title: "Все разделы — тексты Натальи Мельхер",
  description:
    "Сводная страница разделов: поэзия, проза, эссе, заметки, цитаты и вдохновение. Выберите направление и читайте опубликованные произведения.",
  alternates: {
    canonical: `${BASE}/texts`,
  },
  openGraph: {
    title: "Все разделы — Наталья Мельхер",
    description:
      "Поэзия, проза, эссе, заметки, цитаты и вдохновение: единая точка входа в литературные разделы сайта.",
    url: `${BASE}/texts`,
    type: "website",
    siteName: "Наталья Мельхер",
  },
  twitter: {
    card: "summary_large_image",
    title: "Все разделы — Наталья Мельхер",
    description:
      "Поэзия, проза, эссе, заметки, цитаты и вдохновение: единая точка входа в литературные разделы сайта.",
  },
};

export const metadata = withEnDeHints(core, {
  titleEn: "All sections — Natalia Melkher",
  titleDe: "Alle Rubriken — Natalia Melkher",
  descriptionEn:
    "A single hub for poetry, prose, essays, notes, quotes, and inspiration — browse published writing.",
  descriptionDe:
    "Überblick über Poesie, Prosa, Essays, Notizen, Zitate und Inspiration — veröffentlichte Texte entdecken.",
});

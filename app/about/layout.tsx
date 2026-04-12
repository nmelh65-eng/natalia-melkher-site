import type { Metadata } from "next";
import type { ReactNode } from "react";
import { withEnDeHints } from "@/lib/metadata-locale-hints";
import { getPublicSiteUrl } from "@/lib/site-url";

const BASE = getPublicSiteUrl();

const core: Metadata = {
  title: "Об авторе",
  description:
    "Наталья Мельхер — поэтесса и автор прозы: биография, творческий путь, философия текстов и многоязычные публикации.",
  alternates: {
    canonical: `${BASE}/about`,
  },
  openGraph: {
    title: "Об авторе — Наталья Мельхер",
    description:
      "Поэтесса, автор прозы и вдохновляющих текстов: знакомство с автором и её литературным пространством.",
    url: `${BASE}/about`,
    type: "profile",
    siteName: "Наталья Мельхер",
  },
  twitter: {
    card: "summary_large_image",
    title: "Об авторе — Наталья Мельхер",
    description:
      "Поэтесса и автор прозы: биография, творчество и вдохновляющие публикации.",
  },
};

export const metadata = withEnDeHints(core, {
  titleEn: "About Natalia Melkher",
  titleDe: "Über Natalia Melkher",
  descriptionEn:
    "Natalia Melkher — poet and prose author: biography, creative path, and multilingual work.",
  descriptionDe:
    "Natalia Melkher — Dichterin und Prosaautorin: Biografie, kreativer Weg und mehrsprachige Texte.",
});

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}

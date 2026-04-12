import type { Metadata } from "next";
import { withEnDeHints } from "@/lib/metadata-locale-hints";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

const core: Metadata = {
  title: "Проза Натальи Мельхер",
  description:
    "Раздел прозы Натальи Мельхер: авторские тексты, короткая проза, литературные миниатюры и вдохновляющие произведения.",
  alternates: {
    canonical: `${BASE}/prose`,
  },
  openGraph: {
    title: "Проза Натальи Мельхер",
    description:
      "Авторская проза Натальи Мельхер: литературные тексты, короткая проза и вдохновляющие истории.",
    url: `${BASE}/prose`,
    type: "website",
    siteName: "Наталья Мельхер",
  },
  twitter: {
    card: "summary_large_image",
    title: "Проза Натальи Мельхер",
    description:
      "Авторская проза Натальи Мельхер: литературные тексты, короткая проза и вдохновляющие истории.",
  },
};

export const metadata = withEnDeHints(core, {
  titleEn: "Prose by Natalia Melkher",
  titleDe: "Prosa von Natalia Melkher",
  descriptionEn:
    "Prose by Natalia Melkher: original literary texts, short prose, and inspiring stories.",
  descriptionDe:
    "Prosa von Natalia Melkher: literarische Texte, Kurzprosa und inspirierende Geschichten.",
});

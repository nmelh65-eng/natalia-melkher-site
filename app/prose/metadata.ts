import type { Metadata } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

export const metadata: Metadata = {
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

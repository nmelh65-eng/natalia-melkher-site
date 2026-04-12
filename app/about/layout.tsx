import type { Metadata } from "next";
import type { ReactNode } from "react";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

export const metadata: Metadata = {
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

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}

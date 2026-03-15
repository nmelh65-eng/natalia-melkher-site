import type { Metadata } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

export const metadata: Metadata = {
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

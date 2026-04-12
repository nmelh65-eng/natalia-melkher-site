import type { Metadata } from "next";
import type { ReactNode } from "react";
import { withEnDeHints } from "@/lib/metadata-locale-hints";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

const core: Metadata = {
  title: "Контакты",
  description:
    "Связаться с Натальей Мельхер: контактная форма, электронная почта, социальные сети и мессенджеры.",
  alternates: {
    canonical: `${BASE}/contact`,
  },
  openGraph: {
    title: "Контакты — Наталья Мельхер",
    description:
      "Написать автору, задать вопрос или предложить сотрудничество через форму и социальные сети.",
    url: `${BASE}/contact`,
    type: "website",
    siteName: "Наталья Мельхер",
  },
  twitter: {
    card: "summary_large_image",
    title: "Контакты — Наталья Мельхер",
    description: "Связь с автором: форма обратной связи и социальные сети.",
  },
};

export const metadata = withEnDeHints(core, {
  titleEn: "Contact Natalia Melkher",
  titleDe: "Kontakt — Natalia Melkher",
  descriptionEn:
    "Contact Natalia Melkher: form, email, social networks, and collaboration.",
  descriptionDe:
    "Kontakt zu Natalia Melkher: Formular, E-Mail, soziale Netzwerke und Kooperation.",
});

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}

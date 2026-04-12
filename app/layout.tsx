import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import HtmlLangSetter from "@/components/HtmlLangSetter";
import SkipToContent from "@/components/SkipToContent";
import GlobalAIButton from "@/components/GlobalAIButton";
import { AnalyticsPageViews, AnalyticsScripts } from "@/components/WebAnalytics";
import "./globals.css";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

const fontHeadline = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["600", "700", "800"],
  variable: "--font-headline",
  display: "swap",
});

const fontLiterary = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-literary",
  display: "swap",
});

const fontUi = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Наталья Мельхер — Поэзия, проза и пространство вдохновения",
    template: "%s | Наталья Мельхер",
  },
  description:
    "Официальный авторский сайт Натальи Мельхер: поэзия, проза, вдохновляющие тексты, литературное пространство и современные публикации на нескольких языках.",
  keywords: [
    "Наталья Мельхер",
    "поэзия",
    "стихи",
    "проза",
    "литература",
    "вдохновение",
    "авторский сайт",
    "Natalia Melkher",
    "poetry",
    "prose",
    "literary website",
  ],
  authors: [{ name: "Наталья Мельхер", url: BASE }],
  creator: "Наталья Мельхер",
  publisher: "Наталья Мельхер",
  category: "literature",
  verification: {
    google: "6qKVMK1SjsABpVoavBGJ_RcQzGf-mV7kvqJjMyr1GQI",
    other: {
      "msvalidate.01": "B07870CD4153726BF86686326E48AF8C",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    alternateLocale: ["en_US", "de_DE", "fr_FR", "zh_CN", "ko_KR"],
    url: BASE,
    siteName: "Наталья Мельхер",
    title: "Наталья Мельхер — Поэзия, проза и пространство вдохновения",
    description:
      "Авторский литературный сайт Натальи Мельхер: современные стихи, проза и вдохновляющие тексты.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Наталья Мельхер — Поэзия и проза",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Наталья Мельхер — Поэзия, проза и пространство вдохновения",
    description:
      "Авторский литературный сайт Натальи Мельхер: стихи, проза и вдохновляющие тексты.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: BASE,
    types: {
      "application/rss+xml": `${BASE}/feed.xml`,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${fontHeadline.variable} ${fontLiterary.variable} ${fontUi.variable}`}
    >
      <body
        className="min-h-screen flex flex-col antialiased font-sans"
        suppressHydrationWarning
      >
        <SkipToContent />
        <LanguageProvider>
          <HtmlLangSetter />
          <ParticleBackground />
          <Header />
          <main id="main-content" className="flex-1 relative z-10 pt-20">
            {children}
          </main>
          <Footer />
          <GlobalAIButton />
          <AnalyticsScripts />
          <AnalyticsPageViews />
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}

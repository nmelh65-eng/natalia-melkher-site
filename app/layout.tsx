import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import HtmlLangSetter from "@/components/HtmlLangSetter";
import SkipToContent from "@/components/SkipToContent";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Наталья Мельхер — Поэзия и Вдохновение",
    template: "%s | Наталья Мельхер",
  },
  description:
    "Личный сайт поэтессы и писательницы Натальи Мельхер. " +
    "Поэзия, проза и вдохновение на шести языках.",
  keywords: [
    "Наталья Мельхер",
    "поэзия",
    "стихи",
    "проза",
    "Natalia Melkher",
    "poetry",
  ],
  authors: [{ name: "Наталья Мельхер", url: BASE }],
  creator: "Наталья Мельхер",
  publisher: "Наталья Мельхер",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    alternateLocale: ["en_US", "de_DE", "fr_FR", "zh_CN", "ko_KR"],
    url: BASE,
    siteName: "Наталья Мельхер",
    title: "Наталья Мельхер — Поэзия и Вдохновение",
    description: "Пространство вдохновения, где слова обретают крылья",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Наталья Мельхер — Поэзия",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Наталья Мельхер — Поэзия и Вдохновение",
    description: "Пространство вдохновения, где слова обретают крылья",
    images: ["/og-default.png"],
  },
  alternates: { canonical: BASE },
};

export const viewport: Viewport = {
  themeColor: "#a855f7",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}
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
        </LanguageProvider>
      </body>
    </html>
  );
}

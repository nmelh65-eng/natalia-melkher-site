import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
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

export const metadata: Metadata = {
  title: "Наталья Мельхер — Поэзия и Вдохновение",
  description: "Личный сайт поэтессы и писательницы Натальи Мельхер. Поэзия, проза, вдохновение на шести языках.",
  keywords: ["Наталья Мельхер", "поэзия", "стихи", "проза", "литература", "Natalia Melkher", "poetry"],
  authors: [{ name: "Наталья Мельхер" }],
  openGraph: {
    title: "Наталья Мельхер — Поэзия и Вдохновение",
    description: "Пространство вдохновения, где слова обретают крылья",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <LanguageProvider>
          <ParticleBackground />
          <Header />
          <main className="flex-1 relative z-10 pt-20">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

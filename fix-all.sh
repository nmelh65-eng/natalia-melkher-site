#!/bin/bash
set -e

echo "🔧 Начинаю исправление проекта..."

# ═══════════════════════════════════════════
# 1. Удаляем все скрипты-генераторы
# ═══════════════════════════════════════════
echo "📦 Удаляю старые скрипты..."
rm -f setup.mjs setup2.mjs setup3.mjs
rm -f upgrade.mjs fix.mjs
rm -f fix-hero.cjs fix-admin.cjs fix-admin2.cjs
rm -f add-greeting.mjs
rm -f proxy.ts
rm -f output.txt

# ═══════════════════════════════════════════
# 2. Создаём HtmlLangSetter
# ═══════════════════════════════════════════
echo "📄 Создаю HtmlLangSetter..."
cat > components/HtmlLangSetter.tsx << 'ENDOFFILE'
"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const langMap: Record<string, string> = {
  ru: "ru",
  en: "en",
  de: "de",
  fr: "fr",
  zh: "zh-CN",
  ko: "ko",
};

export default function HtmlLangSetter() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = langMap[language] || "ru";
  }, [language]);

  return null;
}
ENDOFFILE

# ═══════════════════════════════════════════
# 3. Создаём SkipToContent
# ═══════════════════════════════════════════
echo "📄 Создаю SkipToContent..."
cat > components/SkipToContent.tsx << 'ENDOFFILE'
export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
                 focus:z-[9999] focus:px-6 focus:py-3 focus:rounded-xl
                 focus:bg-purple-600 focus:text-white focus:text-lg
                 focus:font-semibold focus:shadow-2xl focus:outline-none
                 focus:ring-2 focus:ring-white"
    >
      Перейти к содержимому
    </a>
  );
}
ENDOFFILE

# ═══════════════════════════════════════════
# 4. Исправляем layout.tsx
# ═══════════════════════════════════════════
echo "📄 Обновляю layout.tsx..."
cat > app/layout.tsx << 'ENDOFFILE'
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
ENDOFFILE

# ═══════════════════════════════════════════
# 5. Исправляем page.tsx (главная)
# ═══════════════════════════════════════════
echo "📄 Обновляю page.tsx..."
cat > app/page.tsx << 'ENDOFFILE'
"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getWorksByCategory } from "@/data/works";
import PoemCard from "@/components/PoemCard";
import ProseCard from "@/components/ProseCard";
import AnimatedSection from "@/components/AnimatedSection";

function shouldShowMarch8(): boolean {
  const now = new Date();
  return now.getMonth() === 2 && now.getDate() >= 7 && now.getDate() <= 9;
}

export default function HomePage() {
  const { t } = useLanguage();
  const latestPoems = getWorksByCategory("poetry").slice(0, 2);
  const latestProse = getWorksByCategory("prose").slice(0, 1);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section
        aria-label="Hero"
        className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4"
      >
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-[800px] h-[800px] bg-purple-500/8 rounded-full
                     blur-[150px] pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/3 left-1/4
                     w-[400px] h-[400px] bg-amber-500/5 rounded-full
                     blur-[120px] pointer-events-none"
        />

        <AnimatedSection delay={200}>
          <p className="font-serif text-xl sm:text-2xl text-purple-400/80 mb-2 italic tracking-wide">
            {t.hero.greeting}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <h1
            className="font-display text-[3.5rem] sm:text-[5rem] md:text-[7rem]
                       lg:text-[9rem] xl:text-[12rem] font-bold gradient-text
                       hero-name mb-8 leading-[0.85] tracking-tight"
          >
            {t.hero.title}
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={600}>
          <p className="font-serif max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed mb-12">
            {t.hero.subtitle}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={800}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/poetry"
              className="group relative px-10 py-4 rounded-2xl
                         bg-gradient-to-r from-purple-600 to-purple-500
                         text-white font-semibold text-lg overflow-hidden
                         transition-all hover:scale-105
                         hover:shadow-xl hover:shadow-purple-500/25
                         focus:outline-none focus:ring-2 focus:ring-purple-400
                         focus:ring-offset-2 focus:ring-offset-black"
            >
              <span className="relative z-10">{t.hero.cta}</span>
              <div
                className="absolute inset-0 bg-gradient-to-r from-purple-500
                           to-fuchsia-500 opacity-0 group-hover:opacity-100
                           transition-opacity"
              />
            </Link>

            <Link
              href="/prose"
              className="px-10 py-4 rounded-2xl glass text-gray-300
                         font-semibold text-lg hover:text-white
                         hover:bg-white/10 transition-all
                         focus:outline-none focus:ring-2 focus:ring-amber-400
                         focus:ring-offset-2 focus:ring-offset-black"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </AnimatedSection>

        {/* Scroll indicator */}
        <div
          role="presentation"
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-purple-400/60 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <AnimatedSection>
          <figure className="relative text-center py-16">
            <div
              aria-hidden="true"
              className="absolute top-0 left-1/2 -translate-x-1/2
                         text-8xl text-purple-500/10 font-display select-none"
            >
              &ldquo;
            </div>
            <blockquote
              className="font-serif text-2xl sm:text-3xl md:text-4xl
                         font-light text-gray-300 italic leading-relaxed"
            >
              Слово — это самый мощный инструмент, данный человеку.
              Оно способно исцелять, вдохновлять, пробуждать.
            </blockquote>
            <figcaption className="mt-8 flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/50" />
              <cite className="text-lg text-purple-400 italic font-serif not-italic">
                Наталья Мельхер
              </cite>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
            </figcaption>
          </figure>
        </AnimatedSection>
      </section>

      {/* Latest Poetry */}
      <section aria-labelledby="poetry-heading" className="max-w-5xl mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-10">
            <h2 id="poetry-heading" className="font-display text-3xl sm:text-4xl font-bold text-gray-100">
              {t.sections.poetry}
            </h2>
            <Link
              href="/poetry"
              className="text-purple-400 hover:text-purple-300 transition-colors
                         font-medium inline-flex items-center gap-1
                         focus:outline-none focus:ring-2 focus:ring-purple-400
                         rounded-lg px-2 py-1"
            >
              {t.sections.allWorks} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {latestPoems.map((poem, i) => (
            <AnimatedSection key={poem.id} delay={i * 200}>
              <PoemCard work={poem} index={i} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Latest Prose */}
      <section aria-labelledby="prose-heading" className="max-w-4xl mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-10">
            <h2 id="prose-heading" className="font-display text-3xl sm:text-4xl font-bold text-gray-100">
              {t.sections.prose}
            </h2>
            <Link
              href="/prose"
              className="text-amber-400 hover:text-amber-300 transition-colors
                         font-medium inline-flex items-center gap-1
                         focus:outline-none focus:ring-2 focus:ring-amber-400
                         rounded-lg px-2 py-1"
            >
              {t.sections.allWorks} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </AnimatedSection>
        {latestProse.map((item, i) => (
          <AnimatedSection key={item.id} delay={200}>
            <ProseCard work={item} index={i} />
          </AnimatedSection>
        ))}
      </section>
    </div>
  );
}
ENDOFFILE

# ═══════════════════════════════════════════
# 6. Обновляем .gitignore
# ═══════════════════════════════════════════
echo "📄 Обновляю .gitignore..."
cat > .gitignore << 'ENDOFFILE'
# Dependencies
node_modules/

# Next.js
.next/
out/

# Environment
.env
.env.local
.env.*.local

# Debug
npm-debug.log*

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Output
output.txt
ENDOFFILE

# ═══════════════════════════════════════════
# 7. Коммитим изменения
# ═══════════════════════════════════════════
echo ""
echo "✅ Все исправления применены!"
echo ""
echo "Теперь выполните:"
echo "  git add -A"
echo "  git commit -m 'fix: cleanup scripts, add a11y, fix encoding'"
echo "  git push"
echo ""
echo "После push Vercel автоматически пересоберёт сайт."

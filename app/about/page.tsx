"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/types";
import AnimatedSection from "@/components/AnimatedSection";

const HERO_SUBTITLE: Record<Language, string> = {
  ru: "Поэтесса, автор прозы и вдохновляющих текстов",
  en: "Poet, prose author, and creator of inspiring texts",
  de: "Poetin, Prosaautorin und Autorin inspirierender Texte",
  fr: "Poétesse, autrice de prose et de textes inspirants",
  zh: "诗人、散文作者与灵感文字创作者",
  ko: "시인이자 산문 작가, 영감을 전하는 글의 저자",
};

const ABOUT_STATS: Record<
  Language,
  { poems: string; prose: string; languages: string; inspiration: string }
> = {
  ru: {
    poems: "Стихи",
    prose: "Проза",
    languages: "Языки",
    inspiration: "Вдохновение",
  },
  en: {
    poems: "Poems",
    prose: "Prose",
    languages: "Languages",
    inspiration: "Inspiration",
  },
  de: {
    poems: "Gedichte",
    prose: "Prosa",
    languages: "Sprachen",
    inspiration: "Inspiration",
  },
  fr: {
    poems: "Poèmes",
    prose: "Prose",
    languages: "Langues",
    inspiration: "Inspiration",
  },
  zh: {
    poems: "诗作",
    prose: "散文",
    languages: "语言",
    inspiration: "灵感",
  },
  ko: {
    poems: "시",
    prose: "산문",
    languages: "언어",
    inspiration: "영감",
  },
};

export default function AboutPage() {
  const { t, language } = useLanguage();

  const heroSubtitle = HERO_SUBTITLE[language] ?? HERO_SUBTITLE.ru;
  const statLabels = ABOUT_STATS[language] ?? ABOUT_STATS.ru;

  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-16 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[760px] h-[420px] bg-purple-500/8 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection>
            <div className="overflow-hidden rounded-[34px] border border-white/[0.08] bg-white/[0.03] backdrop-blur shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
              <div className="p-2 sm:p-3">
                <div className="relative overflow-hidden rounded-[28px] h-[420px] sm:h-[540px] md:h-[620px]">
                  <Image
                    src="/about-hero.jpg"
                    alt="Художественный образ вдохновения и письма"
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, 1200px"
                    className="object-cover object-[center_12%] sm:object-[center_14%] md:object-[center_18%]"
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,18,0.08)_0%,rgba(10,7,18,0.06)_22%,rgba(10,7,18,0.24)_58%,rgba(10,7,18,0.68)_100%)]" />

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(245,158,11,0.12),transparent_28%),radial-gradient(circle_at_24%_78%,rgba(168,85,247,0.16),transparent_34%)]" />

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/20 backdrop-blur px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-purple-100/80 mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-300" />
                      {t.nav.about}
                    </div>

                    <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold gradient-text mb-4 leading-[0.98]">
                      Наталья Мельхер
                    </h1>

                    <p className="max-w-2xl font-serif text-gray-100/90 text-base sm:text-lg md:text-xl leading-7 sm:leading-8">
                      {heroSubtitle}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-8 md:px-12 pb-8 sm:pb-10 md:pb-12 pt-6 sm:pt-8">
                <div className="grid gap-8 md:gap-10">
                  <div className="text-gray-300 leading-relaxed text-base sm:text-lg">
                    <p>{t.about.bio}</p>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-4">
                      {t.about.philosophy}
                    </h2>
                    <blockquote className="border-l-2 border-purple-500/50 pl-6">
                      <p className="text-gray-300 text-lg italic leading-8">
                        {t.about.philosophyText}
                      </p>
                    </blockquote>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { v: "50+", l: statLabels.poems },
                      { v: "20+", l: statLabels.prose },
                      { v: "6", l: statLabels.languages },
                      { v: "∞", l: statLabels.inspiration },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
                      >
                        <div className="text-3xl font-bold gradient-text">
                          {s.v}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

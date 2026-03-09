"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getWorksByCategory } from "@/data/works";
import PoemCard from "@/components/PoemCard";
import ProseCard from "@/components/ProseCard";
import AnimatedSection from "@/components/AnimatedSection";
import AIWritingAgent from "@/components/AIWritingAgent";

export default function HomePage() {
  const { t } = useLanguage();
  const [showAI, setShowAI] = useState(false);
  const latestPoems = getWorksByCategory("poetry").slice(0, 2);
  const latestProse = getWorksByCategory("prose").slice(0, 1);

  return (
    <div className="relative min-h-screen">
      {/* ═══════════════════ Hero Section ═══════════════════ */}
      <section
        aria-label="Hero"
        className="relative flex flex-col items-center justify-start
                   min-h-[90vh] text-center px-4
                   pt-[12vh] sm:pt-[14vh] md:pt-[16vh]"
      >
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-[800px] h-[800px] bg-purple-500/8 rounded-full
                     blur-[150px] pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/4 left-1/4
                     w-[400px] h-[400px] bg-amber-500/5 rounded-full
                     blur-[120px] pointer-events-none"
        />

        {/* Приветствие */}
        <AnimatedSection delay={200}>
          <p className="font-serif text-xl sm:text-2xl md:text-3xl
                        text-purple-400/80 mb-4 sm:mb-6 italic tracking-wide">
            {t.hero.greeting}
          </p>
        </AnimatedSection>

        {/* ═══════ ИМЯ ═══════ */}
        <AnimatedSection delay={400}>
          <h1 className="font-display font-bold mb-6 sm:mb-8 leading-[0.85] tracking-tight hero-name-glow">
            <span
              className="block text-[3.2rem] sm:text-[5rem] md:text-[7rem]
                         lg:text-[9rem] xl:text-[11rem]
                         bg-gradient-to-r from-fuchsia-400 via-purple-400 to-pink-400
                         bg-clip-text text-transparent
                         drop-shadow-[0_0_40px_rgba(168,85,247,0.3)]
                         pb-1 sm:pb-2"
            >
              Натальи
            </span>
            <span
              className="block text-[3.2rem] sm:text-[5rem] md:text-[7rem]
                         lg:text-[9rem] xl:text-[11rem]
                         bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300
                         bg-clip-text text-transparent
                         drop-shadow-[0_0_40px_rgba(245,158,11,0.3)]
                         pb-2 sm:pb-4"
            >
              Мельхер
            </span>
          </h1>
        </AnimatedSection>

        {/* Подзаголовок */}
        <AnimatedSection delay={600}>
          <p className="font-serif max-w-2xl text-base sm:text-lg md:text-xl
                        text-gray-400 leading-relaxed mb-8 sm:mb-10">
            {t.hero.subtitle}
          </p>
        </AnimatedSection>

        {/* Кнопки */}
        <AnimatedSection delay={800}>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/poetry"
              className="group relative px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl
                         bg-gradient-to-r from-purple-600 to-purple-500
                         text-white font-semibold text-base sm:text-lg overflow-hidden
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
              className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl glass
                         text-gray-300 font-semibold text-base sm:text-lg
                         hover:text-white hover:bg-white/10 transition-all
                         focus:outline-none focus:ring-2 focus:ring-amber-400
                         focus:ring-offset-2 focus:ring-offset-black"
            >
              {t.hero.ctaSecondary}
            </Link>

            <button
              onClick={() => setShowAI(true)}
              className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl
                         bg-gradient-to-r from-emerald-600/80 to-teal-500/80
                         text-white font-semibold text-base sm:text-lg
                         hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25
                         transition-all
                         focus:outline-none focus:ring-2 focus:ring-emerald-400
                         focus:ring-offset-2 focus:ring-offset-black
                         flex items-center gap-2 justify-center"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1v4a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-4H7a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z"/>
                <circle cx="9.5" cy="10" r="1"/>
                <circle cx="14.5" cy="10" r="1"/>
                <path d="M9.5 15a3.5 3.5 0 0 0 5 0"/>
              </svg>
              <span>AI-Муза</span>
            </button>
          </div>
        </AnimatedSection>

        {/* Scroll indicator */}
        <div
          role="presentation"
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-purple-400/60 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ═══════ AI Modal ═══════ */}
      {showAI && <AIWritingAgent onClose={() => setShowAI(false)} />}

      {/* ═══════ Цитата ═══════ */}
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

      {/* ═══════ Poetry ═══════ */}
      <section aria-labelledby="poetry-heading" className="max-w-5xl mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-10">
            <h2 id="poetry-heading" className="font-display text-3xl sm:text-4xl font-bold text-gray-100">
              {t.sections.poetry}
            </h2>
            <Link href="/poetry" className="text-purple-400 hover:text-purple-300 transition-colors font-medium inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg px-2 py-1">
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

      {/* ═══════ Prose ═══════ */}
      <section aria-labelledby="prose-heading" className="max-w-4xl mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-10">
            <h2 id="prose-heading" className="font-display text-3xl sm:text-4xl font-bold text-gray-100">
              {t.sections.prose}
            </h2>
            <Link href="/prose" className="text-amber-400 hover:text-amber-300 transition-colors font-medium inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg px-2 py-1">
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

      {/* ═══════ Плавающая кнопка AI ═══════ */}
      {!showAI && (
        <button
          onClick={() => setShowAI(true)}
          aria-label="Открыть AI-Музу — помощник для написания"
          className="fixed bottom-6 right-6 z-50
                     w-14 h-14 sm:w-16 sm:h-16 rounded-full
                     bg-gradient-to-br from-emerald-500 to-teal-600
                     text-white
                     shadow-2xl shadow-emerald-500/30
                     hover:scale-110 hover:shadow-emerald-500/50
                     active:scale-95 transition-all duration-300
                     flex items-center justify-center
                     focus:outline-none focus:ring-4 focus:ring-emerald-400/50
                     group"
        >
          <svg className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1v4a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-4H7a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z"/>
            <circle cx="9.5" cy="10" r="1" fill="currentColor"/>
            <circle cx="14.5" cy="10" r="1" fill="currentColor"/>
            <path d="M9.5 15a3.5 3.5 0 0 0 5 0"/>
          </svg>
          {/* Пульсирующий индикатор */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full
                          border-2 border-gray-950 animate-pulse" />
        </button>
      )}
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getWorksByCategory } from "@/data/works";
import PoemCard from "@/components/PoemCard";
import ProseCard from "@/components/ProseCard";
import AnimatedSection from "@/components/AnimatedSection";

export default function HomePage() {
  const { t, mounted } = useLanguage();
  const latestPoems = getWorksByCategory("poetry").slice(0, 2);
  const latestProse = getWorksByCategory("prose").slice(0, 1);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

        <AnimatedSection delay={200}>
          <p className="font-serif text-xl sm:text-2xl text-purple-400/80 mb-4 italic tracking-wide">{t.hero.greeting}</p>
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <h1 className="font-display text-6xl sm:text-7xl md:text-9xl font-bold gradient-text mb-6 leading-[0.9] tracking-tight">
            {t.hero.title}
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={600}>
          <p className="font-serif max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed mb-12">{t.hero.subtitle}</p>
        </AnimatedSection>

        <AnimatedSection delay={800}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/poetry"
              className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25">
              <span className="relative z-10">{t.hero.cta}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/prose"
              className="px-10 py-4 rounded-2xl glass text-gray-300 font-semibold text-lg hover:text-white hover:bg-white/10 transition-all">
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </AnimatedSection>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-purple-400/60 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <AnimatedSection>
          <div className="relative text-center py-16">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-8xl text-purple-500/10 font-display select-none">&ldquo;</div>
            <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-gray-300 italic leading-relaxed">
              Слово — это самый мощный инструмент, данный человеку. Оно способно исцелять, вдохновлять, пробуждать.
            </blockquote>
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/50" />
              <p className="text-lg text-purple-400 italic font-serif">Наталья Мельхер</p>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Latest Poetry */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-100">{t.sections.poetry}</h2>
            <Link href="/poetry" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
              {t.sections.allWorks} →
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
      <section className="max-w-4xl mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-100">{t.sections.prose}</h2>
            <Link href="/prose" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
              {t.sections.allWorks} →
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

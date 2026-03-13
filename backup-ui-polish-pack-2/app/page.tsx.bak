"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";
import PoemCard from "@/components/PoemCard";
import ProseCard from "@/components/ProseCard";
import AnimatedSection from "@/components/AnimatedSection";

export default function HomePage() {
  const { t } = useLanguage();

  const [allWorks, setAllWorks] = useState<TranslatedWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadWorks() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/works", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Не удалось загрузить произведения");
        }

        const data = await res.json();

        if (!cancelled) {
          setAllWorks(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Ошибка загрузки произведений");
          setAllWorks([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWorks();

    return () => {
      cancelled = true;
    };
  }, []);

  const latestPoems = useMemo(
    () => allWorks.filter((w) => w.category === "poetry").slice(0, 2),
    [allWorks]
  );

  const latestProse = useMemo(
    () => allWorks.filter((w) => w.category === "prose").slice(0, 1),
    [allWorks]
  );

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section
        aria-label="Hero"
        className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4"
      >
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/8 rounded-full blur-[150px] pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"
        />

        <AnimatedSection delay={200}>
          <p className="font-serif text-xl sm:text-2xl text-purple-400/80 mb-2 italic tracking-wide">
            {t.hero.greeting}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <h1 className="font-display text-[3.2rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] xl:text-[6.5rem] 2xl:text-[7rem] font-bold gradient-text hero-name mb-5 leading-[0.88] tracking-tight">
            {t.hero.title}
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={600}>
          <p className="font-serif max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed mb-10">
            {t.hero.subtitle}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={800}>
          <div className="flex flex-col sm:flex-row gap-4 relative z-20">
            <Link
              href="/poetry"
              className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black"
            >
              <span className="relative z-10">{t.hero.cta}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="/prose"
              className="px-10 py-4 rounded-2xl glass text-gray-300 font-semibold text-lg hover:text-white hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </AnimatedSection>

        <div
          role="presentation"
          aria-hidden="true"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce z-10"
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
              className="absolute top-0 left-1/2 -translate-x-1/2 text-8xl text-purple-500/10 font-display select-none"
            >
              &ldquo;
            </div>

            <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-gray-300 italic leading-relaxed">
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
      <section
        aria-labelledby="poetry-heading"
        className="max-w-5xl mx-auto px-4 py-16"
      >
        <AnimatedSection>
          <div className="flex items-center justify-between mb-10">
            <h2
              id="poetry-heading"
              className="font-display text-3xl sm:text-4xl font-bold text-gray-100"
            >
              {t.sections.poetry}
            </h2>
            <Link
              href="/poetry"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg px-2 py-1"
            >
              {t.sections.allWorks} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </AnimatedSection>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-lg text-red-400">{error}</p>
          </div>
        ) : latestPoems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {latestPoems.map((poem, i) => (
              <AnimatedSection key={poem.id} delay={i * 200}>
                <PoemCard work={poem} index={i} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">{t.sections.noWorksFound}</p>
          </div>
        )}
      </section>

      {/* Latest Prose */}
      <section
        aria-labelledby="prose-heading"
        className="max-w-4xl mx-auto px-4 py-16"
      >
        <AnimatedSection>
          <div className="flex items-center justify-between mb-10">
            <h2
              id="prose-heading"
              className="font-display text-3xl sm:text-4xl font-bold text-gray-100"
            >
              {t.sections.prose}
            </h2>
            <Link
              href="/prose"
              className="text-amber-400 hover:text-amber-300 transition-colors font-medium inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg px-2 py-1"
            >
              {t.sections.allWorks} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </AnimatedSection>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-lg text-red-400">{error}</p>
          </div>
        ) : latestProse.length > 0 ? (
          latestProse.map((item, i) => (
            <AnimatedSection key={item.id} delay={200}>
              <ProseCard work={item} index={i} />
            </AnimatedSection>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">{t.sections.noWorksFound}</p>
          </div>
        )}
      </section>
    </div>
  );
}

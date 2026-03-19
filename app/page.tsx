"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";
import PoemCard from "@/components/PoemCard";
import ProseCard from "@/components/ProseCard";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

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
      } catch {
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

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Наталья Мельхер",
    alternateName: "Natalia Melkher",
    url: BASE,
    description:
      "Авторский литературный сайт Натальи Мельхер: поэзия, проза и вдохновляющие тексты.",
    inLanguage: ["ru", "en", "de", "fr", "zh", "ko"],
  };

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Наталья Мельхер",
    alternateName: "Natalia Melkher",
    url: BASE,
    jobTitle: "Поэтесса и автор",
    description: "Автор литературных произведений, поэзии и прозы.",
  };
  const heroTitleParts = useMemo(() => {
    const value = (t.hero.title || "").trim();
    const match = value.match(/^(.*)\s+([^\s]+)$/);

    if (!match) {
      return { first: value, last: "" };
    }

    return {
      first: match[1],
      last: match[2],
    };
  }, [t.hero.title]);

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <section
        aria-label="Hero"
        className="relative flex flex-col items-center justify-center min-h-[54vh] sm:min-h-[76vh] px-4 pt-6 sm:pt-16 text-center"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[220px] h-[220px] sm:w-[620px] sm:h-[620px] bg-purple-500/12 rounded-full blur-[70px] sm:blur-[150px]" />
          <div className="absolute top-[24%] left-[10%] w-[90px] h-[90px] sm:w-[320px] sm:h-[320px] bg-amber-500/8 rounded-full blur-[42px] sm:blur-[110px]" />
          <div className="absolute bottom-[10%] right-[8%] w-[70px] h-[70px] sm:w-[240px] sm:h-[240px] bg-fuchsia-500/7 rounded-full blur-[32px] sm:blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <p className="font-serif text-[0.82rem] sm:text-xl md:text-2xl text-purple-300/75 mb-2 italic tracking-[0.04em]">
            {t.hero.greeting}
          </p>

          <h1 className="font-display text-[2.15rem] leading-[0.92] sm:text-[4rem] md:text-[5.2rem] lg:text-[6rem] xl:text-[6.6rem] font-bold gradient-text tracking-tight mb-3 sm:mb-6">
            <span className="block sm:inline">{heroTitleParts.first}</span>
            {heroTitleParts.last ? (
              <>
                <span className="hidden sm:inline">&nbsp;</span>
                <span className="block sm:inline">{heroTitleParts.last}</span>
              </>
            ) : null}
          </h1>

          <p className="max-w-md sm:max-w-2xl mx-auto font-serif text-[0.95rem] sm:text-lg md:text-xl text-gray-400 leading-6 sm:leading-8 mb-5 sm:mb-8">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/poetry"
              className="group relative inline-flex items-center justify-center min-w-[220px] sm:min-w-[240px] px-6 py-3.5 sm:px-10 sm:py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-semibold text-[0.95rem] sm:text-lg overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_35px_rgba(168,85,247,0.28)] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black"
            >
              <span className="relative z-10">{t.hero.cta}</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-purple-500 via-fuchsia-500 to-amber-400" />
            </Link>

            <Link
              href="/prose"
              className="inline-flex items-center justify-center min-w-[220px] sm:min-w-[240px] px-6 py-3.5 sm:px-10 sm:py-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur text-gray-200 font-medium text-[0.95rem] sm:text-lg hover:bg-white/[0.06] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>

          <div className="mt-5 sm:mt-7 flex flex-wrap justify-center gap-2.5">
            <Link
              href="/poetry"
              className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-purple-200 hover:bg-purple-500/15 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              {t.sections.poetry}
            </Link>

            <Link
              href="/prose"
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-amber-200 hover:bg-amber-500/15 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {t.sections.prose}
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-gray-300 hover:bg-white/[0.05] transition-colors"
            >
              <span aria-hidden="true">✦</span>
              {t.nav.about}
            </Link>
          </div>

          <div className="mt-5 sm:mt-10 flex justify-center">
            <div
              role="presentation"
              aria-hidden="true"
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-white/[0.02]"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pt-1 pb-5 sm:pt-4 sm:pb-10">
        <div className="glass rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-white/[0.06] text-center shadow-[0_14px_40px_rgba(0,0,0,0.18)]">
          <div
            aria-hidden="true"
            className="mx-auto mb-4 h-0.5 w-20 rounded-full bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-80"
          />
          <blockquote className="font-serif text-[1.04rem] sm:text-2xl md:text-[2rem] text-gray-200 italic leading-[1.72] max-w-3xl mx-auto">
            Слово — это самый мощный инструмент, данный человеку. Оно способно
            исцелять, вдохновлять, пробуждать.
          </blockquote>
          <div className="mt-5 text-sm sm:text-base text-purple-200 italic">
            — Наталья Мельхер
          </div>
        </div>
      </section>

      <section
        aria-labelledby="poetry-heading"
        className="max-w-6xl mx-auto px-4 pt-2 pb-8 sm:pt-6 sm:pb-14"
      >
        <div className="flex items-end justify-between gap-4 mb-4 sm:mb-8">
          <div>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-purple-400/70 mb-2">
              Latest
            </p>
            <h2
              id="poetry-heading"
              className="font-display text-[1.7rem] sm:text-4xl md:text-[2.8rem] font-bold text-gray-100"
            >
              {t.sections.poetry}
            </h2>
          </div>

          <Link
            href="/poetry"
            className="text-sm sm:text-base text-purple-300 hover:text-purple-200 transition-colors font-medium inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg px-2 py-1"
          >
            {t.sections.allWorks}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[28px] border border-white/[0.06] bg-white/[0.03] p-6 sm:p-8 animate-pulse"
              >
                <div className="h-5 w-24 rounded-full bg-purple-500/20 mb-5" />
                <div className="h-8 w-2/3 rounded-lg bg-white/[0.06] mb-4" />
                <div className="space-y-3 mb-6">
                  <div className="h-4 rounded bg-white/[0.05]" />
                  <div className="h-4 rounded bg-white/[0.05]" />
                  <div className="h-4 w-5/6 rounded bg-white/[0.05]" />
                </div>
                <div className="h-px bg-white/[0.05] mb-4" />
                <div className="flex justify-between">
                  <div className="h-4 w-24 rounded bg-white/[0.05]" />
                  <div className="h-4 w-20 rounded bg-white/[0.05]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="glass rounded-[28px] p-6 sm:p-8 text-center">
            <p className="text-base sm:text-lg text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10 px-5 py-3 text-sm font-medium text-purple-200 hover:bg-purple-500/15 transition-colors"
            >
              {t.common.retry}
            </button>
          </div>
        ) : latestPoems.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8">
            {latestPoems.map((poem, i) => (
              <PoemCard key={poem.id} work={poem} index={i} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-[28px] p-6 sm:p-8 text-center">
            <p className="text-gray-400">{t.sections.noWorksFound}</p>
          </div>
        )}
      </section>

      <section
        aria-labelledby="prose-heading"
        className="max-w-5xl mx-auto px-4 pt-1 pb-12 sm:pt-4 sm:pb-16"
      >
        <div className="flex items-end justify-between gap-4 mb-4 sm:mb-7">
          <div>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-amber-400/70 mb-2">
              Featured
            </p>
            <h2
              id="prose-heading"
              className="font-display text-[1.7rem] sm:text-4xl md:text-[2.8rem] font-bold text-gray-100"
            >
              {t.sections.prose}
            </h2>
          </div>

          <Link
            href="/prose"
            className="text-sm sm:text-base text-amber-300 hover:text-amber-200 transition-colors font-medium inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg px-2 py-1"
          >
            {t.sections.allWorks}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-white/[0.06] bg-white/[0.03] p-5 sm:p-8 animate-pulse">
            <div className="h-5 w-24 rounded-full bg-amber-500/20 mb-5" />
            <div className="h-8 w-1/2 rounded-lg bg-white/[0.06] mb-4" />
            <div className="space-y-3 mb-6">
              <div className="h-4 rounded bg-white/[0.05]" />
              <div className="h-4 rounded bg-white/[0.05]" />
              <div className="h-4 w-4/5 rounded bg-white/[0.05]" />
            </div>
            <div className="h-px bg-white/[0.05] mb-4" />
            <div className="flex justify-between">
              <div className="h-4 w-24 rounded bg-white/[0.05]" />
              <div className="h-4 w-20 rounded bg-white/[0.05]" />
            </div>
          </div>
        ) : error ? (
          <div className="glass rounded-[28px] p-6 sm:p-8 text-center">
            <p className="text-base sm:text-lg text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10 px-5 py-3 text-sm font-medium text-amber-200 hover:bg-amber-500/15 transition-colors"
            >
              {t.common.retry}
            </button>
          </div>
        ) : latestProse.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {latestProse.map((item, i) => (
              <ProseCard key={item.id} work={item} index={i} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-[28px] p-6 sm:p-8 text-center">
            <p className="text-gray-400">{t.sections.noWorksFound}</p>
          </div>
        )}
      </section>
    </div>
  );
}

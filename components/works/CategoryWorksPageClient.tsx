"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork, WorkCategory } from "@/types";
import PoemCard from "@/components/PoemCard";
import ProseCard from "@/components/ProseCard";
import AnimatedSection from "@/components/AnimatedSection";
import { CATEGORY_DEF, THEME_HERO, type CategoryPresentation } from "@/lib/work-categories";

function introFor(
  category: WorkCategory,
  t: ReturnType<typeof useLanguage>["t"]
): string {
  switch (category) {
    case "poetry":
      return t.sections.poetryIntro;
    case "prose":
      return t.sections.proseIntro;
    case "essay":
      return t.sections.essayIntro;
    case "notes":
      return t.sections.notesIntro;
    case "quotes":
      return t.sections.quotesIntro;
    case "inspiration":
      return t.sections.inspirationIntro;
    default:
      return "";
  }
}

function sectionTitle(
  category: WorkCategory,
  t: ReturnType<typeof useLanguage>["t"]
): string {
  switch (category) {
    case "poetry":
      return t.sections.poetry;
    case "prose":
      return t.sections.prose;
    case "essay":
      return t.sections.essay;
    case "notes":
      return t.sections.notes;
    case "quotes":
      return t.sections.quotes;
    case "inspiration":
      return t.sections.inspiration;
    default:
      return "";
  }
}

function CategoryWorksInner({
  category,
  siteUrl,
}: {
  category: WorkCategory;
  siteUrl: string;
}) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const presentation: CategoryPresentation = CATEGORY_DEF[category].presentation;
  const theme = CATEGORY_DEF[category].theme;
  const hero = THEME_HERO[theme];

  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [items, setItems] = useState<TranslatedWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlTag = searchParams.get("tag");
    if (urlTag) setTag(urlTag);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/works?category=${category}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("fetch");
        const data = await res.json();
        if (!cancelled) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) {
          setError(t.common.error);
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [category, t.common.error]);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    items.forEach((p) => p.tags.forEach((tg) => s.add(tg)));
    return Array.from(s);
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase());
      return matchesSearch && (!tag || p.tags.includes(tag));
    });
  }, [items, search, tag]);

  const title = sectionTitle(category, t);
  const intro = introFor(category, t);

  const titleClass =
    theme === "purple"
      ? "gradient-text"
      : theme === "amber"
        ? "gradient-text-gold"
        : theme === "emerald"
          ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200"
          : theme === "sky"
            ? "text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-blue-200 to-indigo-200"
            : theme === "rose"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-fuchsia-200"
              : "text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${title} — Наталья Мельхер`,
    url: `${siteUrl}/${category}`,
    description: intro,
    inLanguage: "ru",
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative pt-20 pb-10 sm:pb-12 px-4">
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] ${hero.blur} rounded-full blur-[100px] pointer-events-none`}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <p
              className={`text-[10px] sm:text-[11px] uppercase tracking-[0.22em] ${hero.eyebrow} mb-3`}
            >
              {title}
            </p>
            <h1
              className={`text-5xl sm:text-6xl md:text-7xl font-bold ${titleClass} mb-4 leading-[1.06] pb-[0.06em]`}
            >
              {title}
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {intro}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="mt-8 max-w-md mx-auto">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.sections.searchPlaceholder}
                className="w-full px-6 py-3 rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setTag(null)}
                className={
                  "px-4 py-1.5 text-xs rounded-full transition-all " +
                  (!tag
                    ? `bg-white/10 text-gray-200 border border-white/20`
                    : "bg-white/5 text-gray-500 hover:text-gray-300")
                }
              >
                {t.sections.allWorks}
              </button>

              {allTags.map((tg) => (
                <button
                  type="button"
                  key={tg}
                  onClick={() => setTag(tag === tg ? null : tg)}
                  className={
                    "px-4 py-1.5 text-xs rounded-full transition-all " +
                    (tag === tg
                      ? `bg-white/10 text-gray-200 border border-white/20`
                      : "bg-white/5 text-gray-500 hover:text-gray-300")
                  }
                >
                  #{tg}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div
              className={`w-8 h-8 rounded-full border-2 ${hero.spin} border-t-transparent animate-spin`}
            />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-2xl text-red-400">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
            >
              {t.common.retry}
            </button>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filtered.map((work, i) => (
              <AnimatedSection key={work.id} delay={i * 150}>
                {presentation === "stanza" ? (
                  <PoemCard work={work} index={i} />
                ) : (
                  <ProseCard work={work} index={i} displayTheme={theme} />
                )}
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">{t.sections.noWorksFound}</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setTag(null);
              }}
              className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
            >
              {t.common.retry}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export function CategoryWorksPageClient({
  category,
  siteUrl,
}: {
  category: WorkCategory;
  siteUrl: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <CategoryWorksInner category={category} siteUrl={siteUrl} />
    </Suspense>
  );
}

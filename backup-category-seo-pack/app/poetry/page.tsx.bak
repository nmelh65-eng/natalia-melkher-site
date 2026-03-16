"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";
import PoemCard from "@/components/PoemCard";
import AnimatedSection from "@/components/AnimatedSection";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

function PoetryContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [allPoems, setAllPoems] = useState<TranslatedWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlTag = searchParams.get("tag");
    if (urlTag) setTag(urlTag);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function loadPoetry() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/works?category=poetry", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Не удалось загрузить поэзию");
        }

        const data = await res.json();

        if (!cancelled) {
          setAllPoems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Ошибка загрузки произведений");
          setAllPoems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPoetry();

    return () => {
      cancelled = true;
    };
  }, []);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    allPoems.forEach((p) => p.tags.forEach((tg) => s.add(tg)));
    return Array.from(s);
  }, [allPoems]);

  const filtered = useMemo(() => {
    return allPoems.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase());

      return matchesSearch && (!tag || p.tags.includes(tag));
    });
  }, [allPoems, search, tag]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Поэзия Натальи Мельхер",
    url: `${BASE}/poetry`,
    description:
      "Раздел поэзии Натальи Мельхер: современные стихи, лирические тексты и авторская поэзия.",
    inLanguage: "ru",
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative pt-20 pb-10 sm:pb-12 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-purple-400/70 mb-3">
              Poetry Collection
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text mb-4">
              {t.sections.poetry}
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Авторская поэзия Натальи Мельхер — современные стихи, лирика,
              вдохновляющие тексты и поэтические произведения, объединённые
              настроением, образами и внутренней глубиной.
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
                onClick={() => setTag(null)}
                className={
                  "px-4 py-1.5 text-xs rounded-full transition-all " +
                  (!tag
                    ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                    : "bg-white/5 text-gray-500 hover:text-gray-300")
                }
              >
                {t.sections.allWorks}
              </button>

              {allTags.map((tg) => (
                <button
                  key={tg}
                  onClick={() => setTag(tag === tg ? null : tg)}
                  className={
                    "px-4 py-1.5 text-xs rounded-full transition-all " +
                    (tag === tg
                      ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
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
            <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-2xl text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
            >
              {t.common.retry}
            </button>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filtered.map((poem, i) => (
              <AnimatedSection key={poem.id} delay={i * 150}>
                <PoemCard work={poem} index={i} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">{t.sections.noWorksFound}</p>
            <button
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

export default function PoetryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <PoetryContent />
    </Suspense>
  );
}

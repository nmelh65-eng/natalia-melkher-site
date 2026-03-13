"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getWorkById, getWorksByCategory } from "@/data/works";
import AnimatedSection from "@/components/AnimatedSection";
import ReadingProgress from "@/components/ReadingProgress";
import WorkStats from "@/components/WorkStats";

export default function PoemPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();

  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const work = getWorkById(id);

  const related = getWorksByCategory("poetry")
    .filter(
      (p) =>
        p.id !== id && p.tags.some((tag) => work?.tags.includes(tag))
    )
    .slice(0, 2);

  // 404
  if (!work || work.category !== "poetry") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="text-8xl select-none" aria-hidden="true">
          ✨
        </div>
        <h1 className="text-3xl font-bold text-gray-300">
          Стихотворение не найдено
        </h1>
        <p className="text-gray-500 max-w-md">
          Возможно, оно было удалено или вы перешли по неверной ссылке.
        </p>
        <Link
          href="/poetry"
          className="px-8 py-3 rounded-2xl bg-purple-600 text-white
                     hover:bg-purple-500 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-purple-400
                     focus:ring-offset-2 focus:ring-offset-black"
        >
          &larr; {t.nav.poetry}
        </Link>
      </div>
    );
  }

  const tr =
    language !== "ru" ? work.translations[language] : undefined;
  const title = tr?.title ?? work.title;
  const content = tr?.content ?? work.content;
  const stanzas = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="min-h-screen">
      <ReadingProgress />

      <div
        aria-hidden="true"
        className="fixed top-0 left-1/2 -translate-x-1/2
                   w-[700px] h-[500px] bg-purple-500/5 rounded-full
                   blur-[140px] pointer-events-none"
      />

      <div className="max-w-2xl mx-auto px-4 pt-16 pb-28 relative z-10">
        {/* Назад */}
        <AnimatedSection delay={0}>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600
                       hover:text-purple-400 transition-colors mb-14
                       group text-sm
                       focus:outline-none focus:text-purple-400"
          >
            <span
              className="group-hover:-translate-x-1 transition-transform inline-block"
              aria-hidden="true"
            >
              &larr;
            </span>
            <span>{t.nav.poetry}</span>
          </button>
        </AnimatedSection>

        {/* Заголовок */}
        <AnimatedSection delay={80}>
          <div className="mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5
                         rounded-full bg-purple-500/10 border border-purple-500/20 mb-8"
            >
              <span className="text-purple-400 text-xs" aria-hidden="true">
                ✦
              </span>
              <span className="text-purple-400 text-xs font-semibold tracking-widest uppercase">
                {t.sections.poetry}
              </span>
              <span className="text-purple-400 text-xs" aria-hidden="true">
                ✦
              </span>
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl md:text-6xl
                         font-bold text-white leading-tight mb-8"
            >
              {title}
            </h1>

            <WorkStats work={work} />
          </div>
        </AnimatedSection>

        {/* Стихотворение */}
        <AnimatedSection delay={160}>
          <article className="glass rounded-3xl overflow-hidden mb-10">
            <div
              aria-hidden="true"
              className="h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            />

            <div className="p-8 sm:p-12 md:p-16">
              <div className="space-y-8">
                {stanzas.map((stanza, i) => (
                  <div
                    key={i}
                    className="font-serif text-lg sm:text-xl text-gray-300
                               leading-[2] italic"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {stanza.trim()}
                  </div>
                ))}
              </div>
            </div>

            <div
              aria-hidden="true"
              className="h-[2px] bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"
            />
          </article>
        </AnimatedSection>

        {/* Теги */}
        <AnimatedSection delay={240}>
          <nav aria-label="Теги стихотворения" className="flex flex-wrap gap-2 mb-14">
            {work.tags.map((tag) => (
              <Link
                key={tag}
                href={`/poetry?tag=${encodeURIComponent(tag)}`}
                className="px-4 py-1.5 rounded-full text-sm
                           bg-white/5 border border-white/10
                           text-gray-400 hover:bg-purple-500/10
                           hover:border-purple-500/30 hover:text-purple-400
                           transition-all
                           focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                #{tag}
              </Link>
            ))}
          </nav>
        </AnimatedSection>

        {/* Похожие */}
        {related.length > 0 && (
          <AnimatedSection delay={320}>
            <section
              aria-labelledby="related-poems-heading"
              className="border-t border-white/[0.05] pt-14 mb-12"
            >
              <h2
                id="related-poems-heading"
                className="font-display text-2xl font-bold text-gray-300 mb-6"
              >
                {t.sections.poetry}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((poem) => {
                  const rTr =
                    language !== "ru"
                      ? poem.translations[language]
                      : undefined;

                  return (
                    <Link
                      key={poem.id}
                      href={`/poetry/${poem.id}`}
                      className="glass rounded-2xl p-6
                                 hover:border-purple-500/30 hover:-translate-y-1
                                 transition-all group block
                                 focus:outline-none focus:ring-2
                                 focus:ring-purple-400 focus:ring-offset-2
                                 focus:ring-offset-black"
                    >
                      <div
                        aria-hidden="true"
                        className="h-0.5 bg-gradient-to-r from-purple-500 to-fuchsia-500
                                   rounded-full mb-4 opacity-30
                                   group-hover:opacity-80 transition-opacity"
                      />
                      <h3
                        className="font-display text-lg font-bold text-gray-200
                                   group-hover:text-purple-300 transition-colors"
                      >
                        {rTr?.title ?? poem.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2 font-serif italic">
                        {rTr?.excerpt ?? poem.excerpt}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          </AnimatedSection>
        )}

        {/* Все произведения */}
        <AnimatedSection delay={380}>
          <div>
            <Link
              href="/poetry"
              className="inline-flex items-center gap-2 px-8 py-4
                         rounded-2xl glass text-purple-300
                         hover:text-white hover:bg-purple-500/20
                         transition-all font-medium
                         focus:outline-none focus:ring-2 focus:ring-purple-400
                         focus:ring-offset-2 focus:ring-offset-black"
            >
              <span aria-hidden="true">&larr;</span>
              {t.sections.allWorks}
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

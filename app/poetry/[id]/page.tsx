"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getWorkById, getWorksByCategory } from "@/data/works";
import AnimatedSection from "@/components/AnimatedSection";
import WorkStats from "@/components/WorkStats";
import ReadingProgress from "@/components/ReadingProgress";
import { formatDate, getLocale } from "@/lib/utils";

export default function PoemPage() {
  const params  = useParams();
  const router  = useRouter();
  const { language, t } = useLanguage();

  const id   = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const work = getWorkById(id);
  const related = getWorksByCategory("poetry").filter(p => p.id !== id && p.tags.some(tag => work?.tags.includes(tag))).slice(0,2);

  if (!work || work.category !== "poetry") return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-8xl select-none">📜</div>
      <h1 className="text-3xl font-bold text-gray-300">Стихотворение не найдено</h1>
      <Link href="/poetry" className="px-8 py-3 rounded-2xl bg-purple-600 text-white hover:bg-purple-500 transition-colors">← {t.nav.poetry}</Link>
    </div>
  );

  const tr      = language !== "ru" ? work.translations[language] : undefined;
  const title   = tr?.title   ?? work.title;
  const content = tr?.content ?? work.content;
  const stanzas = content.split(/\n\n+/);

  return (
    <div className="min-h-screen">
      <ReadingProgress />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-500/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 pt-16 pb-28 relative z-10">

        <AnimatedSection delay={0}>
          <button onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-400 transition-colors mb-14 group text-sm">
            <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
            <span>{t.nav.poetry}</span>
          </button>
        </AnimatedSection>

        <AnimatedSection delay={80}>
          <div className="mb-14 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
              <span className="text-purple-400 text-xs">✦</span>
              <span className="text-purple-400 text-xs font-semibold tracking-widest uppercase">{t.sections.poetry}</span>
              <span className="text-purple-400 text-xs">✦</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-8">
              {title}
            </h1>
            <WorkStats work={work} />
          </div>
        </AnimatedSection>

        {/* Poem */}
        <AnimatedSection delay={160}>
          <div className="glass-purple rounded-3xl overflow-hidden mb-10 glow-sm">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-shimmer" style={{backgroundSize:"200% auto"}} />
            <div className="p-8 sm:p-12 md:p-16 work-content">
              <div className="font-serif text-xl sm:text-2xl text-gray-100/90 leading-[2.2] tracking-wide space-y-10 text-center">
                {stanzas.map((stanza, si) => (
                  <div key={si} className="space-y-1">
                    {stanza.split("\n").map((line, li) => (
                      <p key={li} className="text-gray-200/80 hover:text-gray-100 transition-colors">{line || <>&nbsp;</>}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          </div>
        </AnimatedSection>

        {/* Tags */}
        <AnimatedSection delay={240}>
          <div className="flex flex-wrap gap-2 mb-14 justify-center">
            {work.tags.map(tag => (
              <Link key={tag} href={`/poetry?tag=${encodeURIComponent(tag)}`} className="tag-pill">#{tag}</Link>
            ))}
          </div>
        </AnimatedSection>

        {/* Related */}
        {related.length > 0 && (
          <AnimatedSection delay={320}>
            <div className="border-t border-white/[0.05] pt-14 mb-12">
              <h2 className="font-display text-2xl font-bold text-gray-300 mb-6 text-center">{t.sections.poetry}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map(poem => {
                  const rTr = language !== "ru" ? poem.translations[language] : undefined;
                  return (
                    <Link key={poem.id} href={`/poetry/${poem.id}`}
                      className="glass rounded-2xl p-6 hover:border-purple-500/30 hover:-translate-y-1 transition-all group block">
                      <div className="h-0.5 bg-gradient-to-r from-purple-500 to-amber-500 rounded-full mb-4 opacity-30 group-hover:opacity-80 transition-opacity" />
                      <h3 className="font-display text-lg font-bold text-gray-200 group-hover:text-purple-300 transition-colors">{rTr?.title ?? poem.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2 font-serif italic">{rTr?.excerpt ?? poem.excerpt}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection delay={380}>
          <div className="text-center">
            <Link href="/poetry"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl glass-purple text-purple-300 hover:text-white hover:bg-purple-500/20 transition-all font-medium">
              ← {t.sections.allWorks} {t.sections.poetry}
            </Link>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}

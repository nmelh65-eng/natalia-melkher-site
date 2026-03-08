"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getWorkById, getWorksByCategory } from "@/data/works";
import AnimatedSection from "@/components/AnimatedSection";
import WorkStats from "@/components/WorkStats";
import ReadingProgress from "@/components/ReadingProgress";

export default function ProsePiecePage() {
  const params  = useParams();
  const router  = useRouter();
  const { language, t } = useLanguage();

  const id   = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const work = getWorkById(id);
  const related = getWorksByCategory("prose").filter(p => p.id !== id && p.tags.some(tag => work?.tags.includes(tag))).slice(0,2);

  if (!work || work.category !== "prose") return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-8xl select-none">📖</div>
      <h1 className="text-3xl font-bold text-gray-300">Произведение не найдено</h1>
      <Link href="/prose" className="px-8 py-3 rounded-2xl bg-amber-600 text-white hover:bg-amber-500 transition-colors">← {t.nav.prose}</Link>
    </div>
  );

  const tr      = language !== "ru" ? work.translations[language] : undefined;
  const title   = tr?.title   ?? work.title;
  const content = tr?.content ?? work.content;
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="min-h-screen">
      <ReadingProgress />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 pt-16 pb-28 relative z-10">

        <AnimatedSection delay={0}>
          <button onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-400 transition-colors mb-14 group text-sm">
            <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
            <span>{t.nav.prose}</span>
          </button>
        </AnimatedSection>

        <AnimatedSection delay={80}>
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <span className="text-amber-400 text-xs">❧</span>
              <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">{t.sections.prose}</span>
              <span className="text-amber-400 text-xs">❧</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-8">
              {title}
            </h1>
            <WorkStats work={work} />
          </div>
        </AnimatedSection>

        {/* Prose text */}
        <AnimatedSection delay={160}>
          <div className="glass-gold rounded-3xl overflow-hidden mb-10">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div className="p-8 sm:p-12 md:p-16 work-content">
              <div className="space-y-6">
                {paragraphs.map((para, i) => {
                  const trimmed  = para.trim();
                  const isQuote  = trimmed.startsWith("«") || trimmed.startsWith('"');
                  const isLetter = ["Дорог","Dear","С любов","With love","P.S."].some(p => trimmed.startsWith(p));
                  return (
                    <p key={i} style={{ whiteSpace:"pre-line" }}
                      className={
                        "prose-text text-base sm:text-lg leading-[1.95] " +
                        (i===0&&!isQuote&&!isLetter ? "drop-cap text-gray-100 " : "text-gray-300 ") +
                        (isQuote  ? "pl-6 border-l-2 border-amber-400/30 text-gray-400 italic " : "") +
                        (isLetter ? "text-gray-400 italic font-serif " : "")
                      }>
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            </div>
            <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
          </div>
        </AnimatedSection>

        {/* Tags */}
        <AnimatedSection delay={240}>
          <div className="flex flex-wrap gap-2 mb-14">
            {work.tags.map(tag => (
              <Link key={tag} href={`/prose?tag=${encodeURIComponent(tag)}`}
                className="tag-pill hover:!bg-amber-500/10 hover:!border-amber-500/30 hover:!text-amber-400">
                #{tag}
              </Link>
            ))}
          </div>
        </AnimatedSection>

        {/* Related */}
        {related.length > 0 && (
          <AnimatedSection delay={320}>
            <div className="border-t border-white/[0.05] pt-14 mb-12">
              <h2 className="font-display text-2xl font-bold text-gray-300 mb-6">{t.sections.prose}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map(piece => {
                  const rTr = language !== "ru" ? piece.translations[language] : undefined;
                  return (
                    <Link key={piece.id} href={`/prose/${piece.id}`}
                      className="glass rounded-2xl p-6 hover:border-amber-500/30 hover:-translate-y-1 transition-all group block">
                      <div className="h-0.5 bg-gradient-to-r from-amber-500 to-purple-500 rounded-full mb-4 opacity-30 group-hover:opacity-80 transition-opacity" />
                      <h3 className="font-display text-lg font-bold text-gray-200 group-hover:text-amber-300 transition-colors">{rTr?.title ?? piece.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2 font-serif italic">{rTr?.excerpt ?? piece.excerpt}</p>
                      <p className="text-xs text-gray-700 mt-2">{piece.readingTime} {t.sections.minuteRead} · {piece.views} {t.sections.views}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection delay={380}>
          <div>
            <Link href="/prose"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl glass-gold text-amber-300 hover:text-white hover:bg-amber-500/20 transition-all font-medium">
              ← {t.sections.allWorks} {t.sections.prose}
            </Link>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}

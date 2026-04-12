"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork, WorkCategory } from "@/types";
import AnimatedSection from "@/components/AnimatedSection";
import ReadingProgress from "@/components/ReadingProgress";
import WorkStats from "@/components/WorkStats";
import { BookOpen, Quote } from "lucide-react";
import { workPublicPath } from "@/lib/slug";
import { CATEGORY_DEF, type CategoryTheme } from "@/lib/work-categories";

type WorkPiecePageClientProps = {
  category: WorkCategory;
  slug: string;
  initialWork: TranslatedWork;
  initialSameCategory: TranslatedWork[];
};

const TITLE_CLASS: Record<CategoryTheme, string> = {
  purple: "gradient-text",
  amber: "gradient-text-gold",
  emerald:
    "text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200",
  sky: "text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-blue-200 to-indigo-200",
  rose: "text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-fuchsia-200",
  violet:
    "text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200",
};

const PROSE_THEME: Record<
  CategoryTheme,
  {
    orb: string;
    backHover: string;
    backFocus: string;
    badgeWrap: string;
    badgeText: string;
    quote: string;
    bar: string;
    bar2: string;
    tag: string;
    relatedCard: string;
    relatedFocus: string;
    relatedLine: string;
    relatedTitle: string;
    bottomBtn: string;
    bottomFocus: string;
    quoteBorder: string;
  }
> = {
  amber: {
    orb: "bg-amber-500/6",
    backHover: "hover:text-amber-400",
    backFocus: "focus:text-amber-400",
    badgeWrap: "bg-amber-500/10 border-amber-500/20",
    badgeText: "text-amber-400",
    quote: "text-amber-400/80",
    bar: "via-amber-400",
    bar2: "via-amber-400/30",
    tag: "hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-300 focus:ring-amber-400",
    relatedCard:
      "hover:border-amber-400/25 focus:ring-amber-400 focus:ring-offset-black",
    relatedFocus: "focus:ring-amber-400",
    relatedLine: "from-amber-500 to-purple-500",
    relatedTitle: "group-hover:text-amber-200",
    bottomBtn:
      "text-amber-300 hover:text-white hover:bg-amber-500/15 focus:ring-amber-400",
    bottomFocus: "focus:ring-amber-400",
    quoteBorder: "border-amber-400/30",
  },
  emerald: {
    orb: "bg-emerald-500/6",
    backHover: "hover:text-emerald-400",
    backFocus: "focus:text-emerald-400",
    badgeWrap: "bg-emerald-500/10 border-emerald-500/20",
    badgeText: "text-emerald-400",
    quote: "text-emerald-400/80",
    bar: "via-emerald-400",
    bar2: "via-emerald-400/30",
    tag: "hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-300 focus:ring-emerald-400",
    relatedCard:
      "hover:border-emerald-400/25 focus:ring-emerald-400 focus:ring-offset-black",
    relatedFocus: "focus:ring-emerald-400",
    relatedLine: "from-emerald-500 to-teal-500",
    relatedTitle: "group-hover:text-emerald-200",
    bottomBtn:
      "text-emerald-300 hover:text-white hover:bg-emerald-500/15 focus:ring-emerald-400",
    bottomFocus: "focus:ring-emerald-400",
    quoteBorder: "border-emerald-400/30",
  },
  sky: {
    orb: "bg-sky-500/6",
    backHover: "hover:text-sky-400",
    backFocus: "focus:text-sky-400",
    badgeWrap: "bg-sky-500/10 border-sky-500/20",
    badgeText: "text-sky-400",
    quote: "text-sky-400/80",
    bar: "via-sky-400",
    bar2: "via-sky-400/30",
    tag: "hover:bg-sky-500/10 hover:border-sky-500/30 hover:text-sky-300 focus:ring-sky-400",
    relatedCard:
      "hover:border-sky-400/25 focus:ring-sky-400 focus:ring-offset-black",
    relatedFocus: "focus:ring-sky-400",
    relatedLine: "from-sky-500 to-blue-500",
    relatedTitle: "group-hover:text-sky-200",
    bottomBtn:
      "text-sky-300 hover:text-white hover:bg-sky-500/15 focus:ring-sky-400",
    bottomFocus: "focus:ring-sky-400",
    quoteBorder: "border-sky-400/30",
  },
  rose: {
    orb: "bg-rose-500/6",
    backHover: "hover:text-rose-400",
    backFocus: "focus:text-rose-400",
    badgeWrap: "bg-rose-500/10 border-rose-500/20",
    badgeText: "text-rose-400",
    quote: "text-rose-400/80",
    bar: "via-rose-400",
    bar2: "via-rose-400/30",
    tag: "hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300 focus:ring-rose-400",
    relatedCard:
      "hover:border-rose-400/25 focus:ring-rose-400 focus:ring-offset-black",
    relatedFocus: "focus:ring-rose-400",
    relatedLine: "from-rose-500 to-pink-500",
    relatedTitle: "group-hover:text-rose-200",
    bottomBtn:
      "text-rose-300 hover:text-white hover:bg-rose-500/15 focus:ring-rose-400",
    bottomFocus: "focus:ring-rose-400",
    quoteBorder: "border-rose-400/30",
  },
  violet: {
    orb: "bg-violet-500/6",
    backHover: "hover:text-violet-400",
    backFocus: "focus:text-violet-400",
    badgeWrap: "bg-violet-500/10 border-violet-500/20",
    badgeText: "text-violet-400",
    quote: "text-violet-400/80",
    bar: "via-violet-400",
    bar2: "via-violet-400/30",
    tag: "hover:bg-violet-500/10 hover:border-violet-500/30 hover:text-violet-300 focus:ring-violet-400",
    relatedCard:
      "hover:border-violet-400/25 focus:ring-violet-400 focus:ring-offset-black",
    relatedFocus: "focus:ring-violet-400",
    relatedLine: "from-violet-500 to-fuchsia-500",
    relatedTitle: "group-hover:text-violet-200",
    bottomBtn:
      "text-violet-300 hover:text-white hover:bg-violet-500/15 focus:ring-violet-400",
    bottomFocus: "focus:ring-violet-400",
    quoteBorder: "border-violet-400/30",
  },
  purple: {
    orb: "bg-purple-500/6",
    backHover: "hover:text-purple-400",
    backFocus: "focus:text-purple-400",
    badgeWrap: "bg-purple-500/10 border-purple-500/20",
    badgeText: "text-purple-400",
    quote: "text-purple-400/80",
    bar: "via-purple-400",
    bar2: "via-purple-400/30",
    tag: "hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-300 focus:ring-purple-400",
    relatedCard:
      "hover:border-purple-400/25 focus:ring-purple-400 focus:ring-offset-black",
    relatedFocus: "focus:ring-purple-400",
    relatedLine: "from-purple-500 to-fuchsia-500",
    relatedTitle: "group-hover:text-purple-200",
    bottomBtn:
      "text-purple-300 hover:text-white hover:bg-purple-500/15 focus:ring-purple-400",
    bottomFocus: "focus:ring-purple-400",
    quoteBorder: "border-purple-400/30",
  },
};

const STANZA_THEME = {
  orb: "bg-purple-500/6",
  backHover: "hover:text-purple-400",
  backFocus: "focus:text-purple-400",
  badgeWrap: "bg-purple-500/10 border-purple-500/20",
  badgeText: "text-purple-400",
  quote: "text-purple-400/80",
  bar: "via-purple-400",
  bar2: "via-purple-400/30",
  tag: "hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-300 focus:ring-purple-400",
  relatedCard:
    "hover:border-purple-400/25 focus:ring-purple-400 focus:ring-offset-black",
  relatedLine: "from-purple-500 to-fuchsia-500",
  relatedTitle: "group-hover:text-purple-200",
  bottomBtn:
    "text-purple-300 hover:text-white hover:bg-purple-500/15 focus:ring-purple-400",
  bottomFocus: "focus:ring-purple-400",
};

function sectionLabelForCategory(
  cat: WorkCategory,
  t: ReturnType<typeof useLanguage>["t"]
): string {
  switch (cat) {
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
      return t.sections.prose;
  }
}

export default function WorkPiecePageClient({
  category,
  slug,
  initialWork,
  initialSameCategory,
}: WorkPiecePageClientProps) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const def = CATEGORY_DEF[category];
  const themeKey = def.theme;
  const proseUi = PROSE_THEME[themeKey];

  const [work, setWork] = useState<TranslatedWork>(initialWork);
  const [sameCategory, setSameCategory] =
    useState<TranslatedWork[]>(initialSameCategory);

  useEffect(() => {
    setWork(initialWork);
    setSameCategory(initialSameCategory);
  }, [slug, initialWork, initialSameCategory]);

  useEffect(() => {
    const internalId = work.id;
    let cancelled = false;
    const key = `viewed:${internalId}`;

    if (typeof window !== "undefined" && sessionStorage.getItem(key)) {
      return () => {
        cancelled = true;
      };
    }

    async function sendView() {
      try {
        const res = await fetch("/api/works", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: internalId, action: "view" }),
        });

        if (!res.ok) return;

        const result = await res.json();

        if (!cancelled && result?.ok && result?.data) {
          setWork((prev) =>
            prev.id === internalId ? { ...prev, ...result.data } : prev
          );
        }

        if (!cancelled && typeof window !== "undefined") {
          sessionStorage.setItem(key, "1");
        }
      } catch (e) {
        console.error("View increment error:", e);
      }
    }

    sendView();
    return () => {
      cancelled = true;
    };
  }, [work.id]);

  const related = useMemo(() => {
    return sameCategory
      .filter(
        (p) =>
          p.id !== work.id && p.tags.some((tag) => work.tags.includes(tag))
      )
      .slice(0, 2);
  }, [sameCategory, work]);

  if (work.category !== category) {
    const miss = {
      border: "border-purple-500/20 bg-purple-500/10 text-purple-300/90",
      btn: "bg-purple-600 hover:bg-purple-500 focus:ring-purple-400",
    };
    if (def.presentation === "prose") {
      miss.border = "border-amber-500/20 bg-amber-500/10 text-amber-300/90";
      miss.btn = "bg-amber-600 hover:bg-amber-500 focus:ring-amber-400";
    }
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div
          className={`mb-2 flex h-16 w-16 items-center justify-center rounded-2xl border ${miss.border}`}
          aria-hidden
        >
          <BookOpen className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold text-gray-300">
          Произведение не найдено
        </h1>
        <p className="text-gray-500 max-w-md">
          Возможно, оно было удалено или ссылка устарела.
        </p>
        <Link
          href={`/${category}`}
          className={`px-8 py-3 rounded-2xl text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${miss.btn}`}
        >
          &larr; {sectionLabelForCategory(category, t)}
        </Link>
      </div>
    );
  }

  const tr = language !== "ru" ? work.translations[language] : undefined;
  const title = tr?.title ?? work.title;
  const content = tr?.content ?? work.content;
  const sectionLabel = sectionLabelForCategory(category, t);
  const listPath = `/${category}`;

  if (def.presentation === "stanza") {
    const st = STANZA_THEME;
    const stanzas = content.split(/\n\n+/).filter(Boolean);
    return (
      <div className="min-h-screen">
        <ReadingProgress />
        <div
          aria-hidden="true"
          className={`fixed top-0 left-1/2 -translate-x-1/2 w-[320px] h-[320px] sm:w-[620px] sm:h-[460px] ${st.orb} rounded-full blur-[90px] sm:blur-[140px] pointer-events-none`}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-28 relative z-10">
          <AnimatedSection delay={0}>
            <button
              type="button"
              onClick={() => router.back()}
              className={`inline-flex items-center gap-2 text-gray-600 ${st.backHover} transition-colors mb-10 sm:mb-14 group text-sm focus:outline-none ${st.backFocus}`}
            >
              <span
                className="group-hover:-translate-x-1 transition-transform inline-block"
                aria-hidden="true"
              >
                &larr;
              </span>
              <span>{sectionLabel}</span>
            </button>
          </AnimatedSection>

          <AnimatedSection delay={80}>
            <header className="mb-12 sm:mb-16">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 sm:mb-8 ${st.badgeWrap}`}
              >
                <Quote
                  className={`h-3.5 w-3.5 ${st.quote}`}
                  strokeWidth={2}
                  aria-hidden
                />
                <span
                  className={`${st.badgeText} text-xs font-semibold tracking-[0.22em] uppercase`}
                >
                  {sectionLabel}
                </span>
                <Quote
                  className={`h-3.5 w-3.5 scale-x-[-1] ${st.quote}`}
                  strokeWidth={2}
                  aria-hidden
                />
              </div>

              <h1
                className={`font-display text-3xl sm:text-5xl md:text-[3.9rem] font-bold ${TITLE_CLASS.purple} leading-[1.08] tracking-tight mb-6 sm:mb-8 pb-[0.04em]`}
              >
                {title}
              </h1>

              <div className="max-w-xl">
                <WorkStats work={work} />
              </div>
            </header>
          </AnimatedSection>

          <AnimatedSection delay={160}>
            <article className="relative rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur overflow-hidden mb-10 sm:mb-12">
              <div
                aria-hidden="true"
                className={`h-[2px] bg-gradient-to-r from-transparent ${st.bar} to-transparent`}
              />
              <div className="px-6 py-8 sm:px-10 sm:py-12 md:px-14 md:py-16">
                <div className="space-y-7 sm:space-y-8">
                  {stanzas.map((stanza, i) => (
                    <div
                      key={i}
                      className="font-serif text-[1.05rem] sm:text-[1.28rem] text-gray-200 leading-[2] sm:leading-[2.05] italic tracking-[0.01em]"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {stanza.trim()}
                    </div>
                  ))}
                </div>
              </div>
              <div
                aria-hidden="true"
                className={`h-[2px] bg-gradient-to-r from-transparent ${st.bar2} to-transparent`}
              />
            </article>
          </AnimatedSection>

          <AnimatedSection delay={240}>
            <nav
              aria-label="Теги"
              className="flex flex-wrap gap-2.5 mb-12 sm:mb-14"
            >
              {work.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`${listPath}?tag=${encodeURIComponent(tag)}`}
                  className={`px-4 py-2 rounded-full text-sm bg-white/[0.03] border border-white/[0.08] text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${st.tag}`}
                >
                  #{tag}
                </Link>
              ))}
            </nav>
          </AnimatedSection>

          {related.length > 0 && (
            <AnimatedSection delay={320}>
              <section
                aria-labelledby="related-heading"
                className="border-t border-white/[0.05] pt-12 sm:pt-14 mb-12"
              >
                <h2
                  id="related-heading"
                  className="font-display text-2xl sm:text-[2rem] font-bold text-gray-200 mb-6"
                >
                  Похожие произведения
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {related.map((piece) => {
                    const rTr =
                      language !== "ru"
                        ? piece.translations[language]
                        : undefined;
                    return (
                      <Link
                        key={piece.id}
                        href={workPublicPath(piece)}
                        className={`group rounded-[24px] border border-white/[0.06] bg-white/[0.03] backdrop-blur p-5 sm:p-6 hover:-translate-y-1 transition-all block focus:outline-none focus:ring-2 focus:ring-offset-2 ${st.relatedCard}`}
                      >
                        <div
                          aria-hidden="true"
                          className={`h-0.5 bg-gradient-to-r ${st.relatedLine} rounded-full mb-4 opacity-40 group-hover:opacity-90 transition-opacity`}
                        />
                        <h3
                          className={`font-display text-lg font-bold text-gray-200 transition-colors ${st.relatedTitle}`}
                        >
                          {rTr?.title ?? piece.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-3 font-serif italic leading-6">
                          {rTr?.excerpt ?? piece.excerpt}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            </AnimatedSection>
          )}

          <AnimatedSection delay={380}>
            <Link
              href={listPath}
              className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${st.bottomBtn} ${st.bottomFocus}`}
            >
              <span aria-hidden="true">&larr;</span>
              {t.sections.allWorks}
            </Link>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  const paragraphs = content.split(/\n\n+/).filter(Boolean);
  const ui = proseUi;

  return (
    <div className="min-h-screen">
      <ReadingProgress />
      <div
        aria-hidden="true"
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-[320px] h-[320px] sm:w-[620px] sm:h-[460px] ${ui.orb} rounded-full blur-[90px] sm:blur-[140px] pointer-events-none`}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-28 relative z-10">
        <AnimatedSection delay={0}>
          <button
            type="button"
            onClick={() => router.back()}
            className={`inline-flex items-center gap-2 text-gray-600 ${ui.backHover} transition-colors mb-10 sm:mb-14 group text-sm focus:outline-none ${ui.backFocus}`}
          >
            <span
              className="group-hover:-translate-x-1 transition-transform inline-block"
              aria-hidden="true"
            >
              &larr;
            </span>
            <span>{sectionLabel}</span>
          </button>
        </AnimatedSection>

        <AnimatedSection delay={80}>
          <header className="mb-12 sm:mb-16">
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 sm:mb-8 ${ui.badgeWrap}`}
            >
              <Quote
                className={`h-3.5 w-3.5 ${ui.quote}`}
                strokeWidth={2}
                aria-hidden
              />
              <span
                className={`${ui.badgeText} text-xs font-semibold tracking-[0.22em] uppercase`}
              >
                {sectionLabel}
              </span>
              <Quote
                className={`h-3.5 w-3.5 scale-x-[-1] ${ui.quote}`}
                strokeWidth={2}
                aria-hidden
              />
            </div>

            <h1
              className={`font-display text-3xl sm:text-5xl md:text-[3.9rem] font-bold ${TITLE_CLASS[themeKey]} leading-[1.08] tracking-tight mb-6 sm:mb-8 pb-[0.04em]`}
            >
              {title}
            </h1>

            <div className="max-w-xl">
              <WorkStats work={work} />
            </div>
          </header>
        </AnimatedSection>

        <AnimatedSection delay={160}>
          <article className="relative rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur overflow-hidden mb-10 sm:mb-12">
            <div
              aria-hidden="true"
              className={`h-[2px] bg-gradient-to-r from-transparent ${ui.bar} to-transparent`}
            />
            <div className="px-6 py-8 sm:px-10 sm:py-12 md:px-14 md:py-16 work-content">
              <div className="space-y-6 sm:space-y-7">
                {paragraphs.map((para, i) => {
                  const trimmed = para.trim();
                  const isQuote =
                    trimmed.startsWith("«") ||
                    trimmed.startsWith('"') ||
                    trimmed.startsWith("“");
                  const isLetter = [
                    "Дорог",
                    "Dear",
                    "Liebes",
                    "Chère",
                    "С любов",
                    "With love",
                    "P.S.",
                  ].some((p) => trimmed.startsWith(p));

                  let paragraphClass =
                    "prose-text text-[1rem] sm:text-[1.15rem] leading-[1.95] sm:leading-[2] ";

                  if (i === 0 && !isQuote && !isLetter) {
                    paragraphClass += "drop-cap text-gray-100 ";
                  } else {
                    paragraphClass += "text-gray-300 ";
                  }

                  if (isQuote) {
                    paragraphClass += `pl-5 sm:pl-6 border-l-2 ${ui.quoteBorder} text-gray-400 italic `;
                  }

                  if (isLetter) {
                    paragraphClass += "text-gray-400 italic font-serif ";
                  }

                  return (
                    <p
                      key={i}
                      style={{ whiteSpace: "pre-line" }}
                      className={paragraphClass}
                    >
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            </div>
            <div
              aria-hidden="true"
              className={`h-[2px] bg-gradient-to-r from-transparent ${ui.bar2} to-transparent`}
            />
          </article>
        </AnimatedSection>

        <AnimatedSection delay={240}>
          <nav
            aria-label="Теги произведения"
            className="flex flex-wrap gap-2.5 mb-12 sm:mb-14"
          >
            {work.tags.map((tag) => (
              <Link
                key={tag}
                href={`${listPath}?tag=${encodeURIComponent(tag)}`}
                className={`px-4 py-2 rounded-full text-sm bg-white/[0.03] border border-white/[0.08] text-gray-400 transition-all focus:outline-none focus:ring-2 ${ui.tag}`}
              >
                #{tag}
              </Link>
            ))}
          </nav>
        </AnimatedSection>

        {related.length > 0 && (
          <AnimatedSection delay={320}>
            <section
              aria-labelledby="related-prose-heading"
              className="border-t border-white/[0.05] pt-12 sm:pt-14 mb-12"
            >
              <h2
                id="related-prose-heading"
                className="font-display text-2xl sm:text-[2rem] font-bold text-gray-200 mb-6"
              >
                Похожие произведения
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {related.map((piece) => {
                  const rTr =
                    language !== "ru"
                      ? piece.translations[language]
                      : undefined;
                  return (
                    <Link
                      key={piece.id}
                      href={workPublicPath(piece)}
                      className={`group rounded-[24px] border border-white/[0.06] bg-white/[0.03] backdrop-blur p-5 sm:p-6 hover:-translate-y-1 transition-all block focus:outline-none focus:ring-2 focus:ring-offset-2 ${ui.relatedCard}`}
                    >
                      <div
                        aria-hidden="true"
                        className={`h-0.5 bg-gradient-to-r ${ui.relatedLine} rounded-full mb-4 opacity-40 group-hover:opacity-90 transition-opacity`}
                      />
                      <h3
                        className={`font-display text-lg font-bold text-gray-200 transition-colors ${ui.relatedTitle}`}
                      >
                        {rTr?.title ?? piece.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-3 font-serif leading-6">
                        {rTr?.excerpt ?? piece.excerpt}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          </AnimatedSection>
        )}

        <AnimatedSection delay={380}>
          <Link
            href={listPath}
            className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${ui.bottomBtn} ${ui.bottomFocus}`}
          >
            <span aria-hidden="true">&larr;</span>
            {t.sections.allWorks}
          </Link>
        </AnimatedSection>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { Language, TranslatedWork, WorkCategory } from "@/types";
import { Heart } from "lucide-react";
import { workPublicPath } from "@/lib/slug";
import { CATEGORY_DEF, type CategoryTheme } from "@/lib/work-categories";
import { PROSE_CARD_STYLES } from "@/lib/prose-card-styles";

const localeMap: Record<Language, string> = {
  ru: "ru-RU",
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
  zh: "zh-CN",
  ko: "ko-KR",
};

function sectionLabelForWork(
  category: WorkCategory,
  t: ReturnType<typeof useLanguage>["t"]
): string {
  switch (category) {
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

export default function ProseCard({
  work,
  displayTheme,
}: {
  work: TranslatedWork;
  index?: number;
  /** Тема листинга (все карточки одного раздела). Иначе — из work.category */
  displayTheme?: CategoryTheme;
}) {
  const { language, t } = useLanguage();

  const theme: CategoryTheme =
    displayTheme ?? CATEGORY_DEF[work.category].theme;
  const st = PROSE_CARD_STYLES[theme];
  const sectionLabel = sectionLabelForWork(work.category, t);

  const tr = language !== "ru" ? work.translations[language] : undefined;
  const title = tr?.title ?? work.title;
  const excerpt = tr?.excerpt ?? work.excerpt;
  const formattedDate = new Date(work.createdAt).toLocaleDateString(
    localeMap[language],
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <article
      className={
        "group relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-white/[0.035] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.045] " +
        st.article
      }
    >
      <div
        aria-hidden="true"
        className={
          "absolute -top-16 right-[-10px] h-32 w-32 rounded-full blur-3xl " +
          st.orb1
        }
      />
      <div
        aria-hidden="true"
        className={
          "absolute bottom-[-40px] left-[-10px] h-28 w-28 rounded-full blur-3xl " +
          st.orb2
        }
      />
      <div
        aria-hidden="true"
        className={
          "absolute inset-x-0 top-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity " +
          st.topLine
        }
      />

      <div className="relative p-5 sm:p-7 md:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] " +
                st.badge
              }
            >
              <span className={"h-1.5 w-1.5 rounded-full " + st.dot} />
              {sectionLabel}
            </span>

            <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-gray-400">
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] sm:text-xs text-gray-400">
            <span>
              {work.readingTime} {t.sections.minuteRead}
            </span>
            <span>
              {work.views} {t.sections.views}
            </span>
          </div>
        </div>

        <h3
          className={
            "font-display text-[1.45rem] sm:text-[2.1rem] leading-[1.05] font-bold text-gray-100 mb-4 transition-colors " +
            st.titleHover
          }
        >
          {title}
        </h3>

        <p className="font-serif text-[14px] sm:text-base text-gray-300/90 leading-6 sm:leading-8 mb-5 sm:mb-6 line-clamp-4">
          {excerpt}
        </p>

        {work.tags?.length > 0 && (
          <div className="mb-5 sm:mb-6 flex flex-wrap gap-2">
            {work.tags.slice(0, 4).map((tg) => (
              <span
                key={tg}
                className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-1 text-[11px] text-gray-300/85"
              >
                #{tg}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 border-t border-white/[0.05] pt-4">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-400">
            <Heart className="w-3.5 h-3.5 text-gray-500" strokeWidth={1.75} aria-hidden />
            {(work.likes ?? 0) > 0 ? (
              <span>
                {work.likes} {t.sections.likes}
              </span>
            ) : (
              <span className={"max-w-[11rem] sm:max-w-none leading-snug " + st.inviteHeart}>
                {t.sections.inviteFirstHeart}
              </span>
            )}
          </div>

          <Link
            href={workPublicPath(work)}
            prefetch
            className={
              "inline-flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 " +
              st.cta
            }
          >
            {t.sections.readMore}
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { Language, TranslatedWork } from "@/types";
import { Heart } from "lucide-react";
import { workPublicPath } from "@/lib/slug";

const localeMap: Record<Language, string> = {
  ru: "ru-RU",
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
  zh: "zh-CN",
  ko: "ko-KR",
};

export default function ProseCard({
  work,
}: {
  work: TranslatedWork;
  index?: number;
}) {
  const { language, t } = useLanguage();

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
    <article className="group relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-white/[0.035] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/25 hover:bg-white/[0.045] hover:shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
      <div
        aria-hidden="true"
        className="absolute -top-16 right-[-10px] h-32 w-32 rounded-full bg-amber-500/14 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[-40px] left-[-10px] h-28 w-28 rounded-full bg-purple-500/8 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent opacity-70 group-hover:opacity-100 transition-opacity"
      />

      <div className="relative p-5 sm:p-7 md:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-amber-300/90">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              {t.sections.prose}
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

        <h3 className="font-display text-[1.45rem] sm:text-[2.1rem] leading-[1.05] font-bold text-gray-100 mb-4 group-hover:text-amber-200 transition-colors">
          {title}
        </h3>

        <p className="font-serif text-[14px] sm:text-base text-gray-300/90 leading-6 sm:leading-8 mb-5 sm:mb-6 line-clamp-4">
          {excerpt}
        </p>

        {work.tags?.length > 0 && (
          <div className="mb-5 sm:mb-6 flex flex-wrap gap-2">
            {work.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-1 text-[11px] text-gray-300/85"
              >
                #{tag}
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
              <span className="text-amber-200/80 max-w-[11rem] sm:max-w-none leading-snug">
                {t.sections.inviteFirstHeart}
              </span>
            )}
          </div>

          <Link
            href={workPublicPath(work)}
            prefetch
            className="inline-flex items-center gap-2 rounded-2xl border border-amber-400/35 bg-amber-500/15 px-5 py-2.5 text-sm font-semibold text-amber-100 hover:bg-amber-500/25 hover:text-white hover:border-amber-400/50 shadow-[0_4px_20px_rgba(245,158,11,0.12)] transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
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

"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { Language, TranslatedWork } from "@/types";
import { Eye, Heart } from "lucide-react";
import { workPublicPath } from "@/lib/slug";

const localeMap: Record<Language, string> = {
  ru: "ru-RU",
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
  zh: "zh-CN",
  ko: "ko-KR",
};

export default function PoemCard({
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
    <article className="group relative h-full overflow-hidden rounded-[30px] border border-white/[0.07] bg-white/[0.035] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/25 hover:bg-white/[0.045] hover:shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
      <div
        aria-hidden="true"
        className="absolute -top-16 right-[-20px] h-32 w-32 rounded-full bg-purple-500/14 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[-40px] left-[-10px] h-28 w-28 rounded-full bg-fuchsia-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400/80 to-transparent opacity-70 group-hover:opacity-100 transition-opacity"
      />

      <div className="relative flex h-full flex-col p-6 sm:p-7 md:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-purple-300/90">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              {t.sections.poetry}
            </span>

            <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-gray-400">
              {formattedDate}
            </span>
          </div>

          <span className="shrink-0 text-xs text-gray-400">
            {work.readingTime} {t.sections.minuteRead}
          </span>
        </div>

        <h3 className="font-display text-2xl sm:text-[2rem] leading-[1.05] font-bold text-gray-100 mb-4 group-hover:text-purple-200 transition-colors">
          {title}
        </h3>

        <p className="font-serif text-[15px] sm:text-base text-gray-300/90 leading-7 italic mb-6 line-clamp-4">
          {excerpt}
        </p>

        {work.tags?.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {work.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-1 text-[11px] text-gray-300/85"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/[0.05] pt-5">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-gray-500" strokeWidth={1.75} aria-hidden />
              <span>
                {work.views} {t.sections.views}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-gray-500" strokeWidth={1.75} aria-hidden />
              <span>
                {work.likes} {t.sections.likes}
              </span>
            </span>
          </div>

          <Link
            href={workPublicPath(work)}
            className="inline-flex items-center gap-2 rounded-2xl border border-purple-400/20 bg-purple-500/10 px-4 py-2.5 text-sm font-medium text-purple-200 hover:bg-purple-500/15 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
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

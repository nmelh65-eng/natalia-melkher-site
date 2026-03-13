"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";

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

  return (
    <article className="group relative h-full rounded-[28px] border border-white/[0.06] bg-white/[0.03] backdrop-blur overflow-hidden transition-all duration-300 hover:border-purple-400/20 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.28)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400/70 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"
      />

      <div className="relative p-6 sm:p-7 md:p-8 flex flex-col h-full">
        <div className="flex items-center justify-between gap-3 mb-5">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-400/15 bg-purple-500/10 text-[11px] uppercase tracking-[0.2em] text-purple-300/90">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            {t.sections.poetry}
          </span>

          <span className="text-xs text-gray-600">
            {work.readingTime} {t.sections.minuteRead}
          </span>
        </div>

        <h3 className="font-display text-2xl sm:text-[1.9rem] leading-tight font-bold text-gray-100 mb-4 group-hover:text-purple-200 transition-colors">
          {title}
        </h3>

        <p className="font-serif text-[15px] sm:text-base text-gray-400 leading-7 italic mb-7 line-clamp-4">
          {excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-5 border-t border-white/[0.05]">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>{work.views} {t.sections.views}</span>
            <span>{work.likes} {t.sections.likes}</span>
          </div>

          <Link
            href={`/poetry/${work.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg px-2 py-1"
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

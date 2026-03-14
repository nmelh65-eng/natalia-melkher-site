"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";

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

  return (
    <article className="group relative rounded-[30px] border border-white/[0.06] bg-white/[0.03] backdrop-blur overflow-hidden transition-all duration-300 hover:border-amber-400/20 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.28)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"
      />

      <div className="relative p-6 sm:p-7 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/15 bg-amber-500/10 text-[11px] uppercase tracking-[0.2em] text-amber-300/90">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {t.sections.prose}
          </span>

          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>{work.readingTime} {t.sections.minuteRead}</span>
            <span>{work.views} {t.sections.views}</span>
          </div>
        </div>

        <h3 className="font-display text-2xl sm:text-[2rem] leading-tight font-bold text-gray-100 mb-4 group-hover:text-amber-200 transition-colors">
          {title}
        </h3>

        <p className="font-serif text-[15px] sm:text-base text-gray-400 leading-7 mb-7 line-clamp-4">
          {excerpt}
        </p>

        {work.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {work.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[11px] text-gray-500 bg-white/[0.03] border border-white/[0.05]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="pt-5 border-t border-white/[0.05] flex items-center justify-between gap-4">
          <div className="text-xs text-gray-600">
            {work.likes} {t.sections.likes}
          </div>

          <Link
            href={`/prose/${work.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-300 hover:text-amber-200 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg px-2 py-1"
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

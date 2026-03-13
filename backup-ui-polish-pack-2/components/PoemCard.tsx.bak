"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";

interface PoemCardProps {
  work: TranslatedWork;
  index: number;
}

export default function PoemCard({ work, index }: PoemCardProps) {
  const { language, t } = useLanguage();

  const tr = language !== "ru" ? work.translations[language] : undefined;
  const title = tr?.title ?? work.title;
  const excerpt = tr?.excerpt ?? work.excerpt;

  return (
    <Link
      href={`/poetry/${work.id}`}
      className="group glass rounded-3xl p-8 block
                 hover:border-purple-500/30 hover:-translate-y-2
                 transition-all duration-300
                 focus:outline-none focus:ring-2 focus:ring-purple-400
                 focus:ring-offset-2 focus:ring-offset-black"
    >
      <div
        aria-hidden="true"
        className="h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500
                   rounded-full mb-6 opacity-30 group-hover:opacity-80
                   transition-opacity"
      />

      <h3
        className="font-display text-2xl font-bold text-gray-100
                   group-hover:text-purple-300 transition-colors mb-4"
      >
        {title}
      </h3>

      <p className="font-serif text-gray-400 italic leading-relaxed line-clamp-3 mb-6">
        {excerpt}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {work.readingTime} {t.sections.minuteRead}
        </span>
        <span className="text-purple-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          {t.sections.readMore} <span aria-hidden="true">&rarr;</span>
        </span>
      </div>
    </Link>
  );
}

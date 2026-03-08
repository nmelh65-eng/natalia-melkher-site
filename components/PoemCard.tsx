"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";
import { formatDate, getLocale } from "@/lib/utils";

export default function PoemCard({ work, index = 0 }: { work: TranslatedWork; index?: number }) {
  const { language, t } = useLanguage();
  const [likes, setLikes] = useState(work.likes);
  const [liked, setLiked] = useState(false);

  const tr      = language !== "ru" ? work.translations[language] : undefined;
  const title   = tr?.title   ?? work.title;
  const excerpt = tr?.excerpt ?? work.excerpt;

  return (
    <article className="group relative bg-white/[0.025] backdrop-blur border border-white/[0.07] rounded-3xl overflow-hidden card-hover">
      {/* Top accent */}
      <div className="poem-accent" />

      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-amber-500/0 group-hover:from-purple-500/[0.03] group-hover:to-amber-500/[0.03] transition-all duration-500 pointer-events-none rounded-3xl" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <span className="px-3 py-1 text-[11px] font-semibold rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20 tracking-wide uppercase">
            {t.sections.poetry}
          </span>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span>{work.readingTime} {t.sections.minuteRead}</span>
            <span>·</span>
            <time>{formatDate(work.createdAt, getLocale(language))}</time>
          </div>
        </div>

        {/* Title */}
        <Link href={`/poetry/${work.id}`}>
          <h3 className="font-display text-2xl font-bold text-gray-100 group-hover:text-purple-200 transition-colors duration-300 mb-4 leading-snug">
            {title}
          </h3>
        </Link>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5 opacity-30">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
          <span className="text-purple-400 text-sm">✦</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
        </div>

        {/* Excerpt */}
        <p className="text-gray-400 leading-relaxed font-serif italic text-sm line-clamp-3 mb-5">
          {excerpt}
        </p>

        {/* Read more */}
        <Link href={`/poetry/${work.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium group/link">
          <span>{t.sections.readMore}</span>
          <span className="group-hover/link:translate-x-1 transition-transform inline-block">→</span>
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-5">
          {work.tags.slice(0, 4).map((tag) => (
            <Link key={tag} href={`/poetry?tag=${encodeURIComponent(tag)}`} className="tag-pill">
              #{tag}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/[0.04]">
          <button
            onClick={() => { setLiked(!liked); setLikes(p => liked ? p-1 : p+1); }}
            className={`flex items-center gap-1.5 text-sm transition-all duration-200 ${liked ? "text-red-400 scale-110" : "text-gray-600 hover:text-red-400"}`}>
            <span>{liked ? "❤️" : "🤍"}</span>
            <span className="font-medium">{likes}</span>
          </button>
          <span className="flex items-center gap-1.5 text-sm text-gray-600">
            <span>👁</span>
            <span>{work.views.toLocaleString()}</span>
          </span>
          <div className="ml-auto">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-amber-500/20 border border-white/5 flex items-center justify-center text-xs text-gray-500 group-hover:border-purple-500/30 transition-colors">
              ✦
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

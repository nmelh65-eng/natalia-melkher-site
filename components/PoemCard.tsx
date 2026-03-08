"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";
import { formatDate, getLocale } from "@/lib/utils";

export default function PoemCard({ work, index = 0 }: { work: TranslatedWork; index?: number }) {
  const { language, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [likes, setLikes] = useState(work.likes);
  const [liked, setLiked] = useState(false);

  const tr = language !== "ru" ? work.translations[language] : undefined;
  const title = tr?.title || work.title;
  const content = tr?.content || work.content;
  const excerpt = tr?.excerpt || work.excerpt;

  return (
    <article className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-500">
      <div className="h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-amber-500" />
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between mb-4">
          <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">{t.sections.poetry}</span>
          <time className="text-xs text-gray-600">{formatDate(work.createdAt, getLocale(language))}</time>
        </div>
        <h3 className="text-2xl font-bold text-gray-100 hover:text-purple-300 transition-colors mb-4">{title}</h3>
        <div className="flex items-center gap-3 mb-4 opacity-40">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          <span className="text-purple-400">✦</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>
        <div className="text-gray-300 leading-relaxed" style={{ whiteSpace: "pre-line" }}>
          {expanded ? content : excerpt}
        </div>
        <button onClick={() => setExpanded(!expanded)} className="mt-4 text-sm text-purple-400 hover:text-purple-300">
          {expanded ? t.common.close : t.sections.readMore}
        </button>
        <div className="flex flex-wrap gap-2 mt-4">
          {work.tags.map((tag) => <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 text-gray-500">#{tag}</span>)}
        </div>
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
          <button onClick={() => { setLiked(!liked); setLikes(p => liked ? p-1 : p+1); }}
            className={"text-sm " + (liked ? "text-red-400" : "text-gray-500")}>
            {liked ? "❤️" : "🤍"} {likes}
          </button>
          <span className="text-sm text-gray-500">👁 {work.views}</span>
        </div>
      </div>
    </article>
  );
}

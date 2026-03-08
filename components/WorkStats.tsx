"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";
import { formatDate, getLocale } from "@/lib/utils";

interface Props { work: TranslatedWork; }

export default function WorkStats({ work }: Props) {
  const { language, t, mounted } = useLanguage();
  const [likes,  setLikes]  = useState(work.likes);
  const [liked,  setLiked]  = useState(false);
  const [copied, setCopied] = useState(false);

  // Дата форматируется только после монтирования, чтобы не было mismatch
  const [dateStr, setDateStr] = useState("");
  useEffect(() => {
    setDateStr(formatDate(work.createdAt, getLocale(language)));
  }, [work.createdAt, language]);

  const handleLike = () => {
    const n = !liked;
    setLiked(n);
    setLikes(p => p + (n ? 1 : -1));
  };

  const handleCopy = async () => {
    try {
      const el = document.querySelector<HTMLElement>(".work-content");
      const text = el?.innerText || "";
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: work.title, url: location.href });
    } else {
      navigator.clipboard.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Meta */}
      <div
        className="flex items-center flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500"
        suppressHydrationWarning
      >
        {dateStr && (
          <span className="flex items-center gap-1.5">
            <span>📅</span>
            <span suppressHydrationWarning>{dateStr}</span>
          </span>
        )}
        {dateStr && <span className="text-gray-700 hidden sm:inline">·</span>}
        <span className="flex items-center gap-1.5">
          <span>⏱</span>
          <span>{work.readingTime} {mounted ? t.sections.minuteRead : "мин"}</span>
        </span>
        <span className="text-gray-700 hidden sm:inline">·</span>
        <span className="flex items-center gap-1.5">
          <span>👁</span>
          <span>{work.views.toLocaleString()} {mounted ? t.sections.views : "просм."}</span>
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleLike}
          className={
            "flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-medium transition-all duration-300 " +
            (liked
              ? "bg-red-500/15 border-red-500/40 text-red-400 scale-105 shadow-lg shadow-red-500/10"
              : "glass text-gray-400 hover:border-red-500/30 hover:text-red-400")
          }
        >
          <span>{liked ? "❤️" : "🤍"}</span>
          <span>{likes}</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl glass text-gray-400 hover:border-purple-500/40 hover:text-purple-400 text-sm font-medium transition-all duration-300"
        >
          <span>{copied ? "✅" : "📋"}</span>
          <span>{copied ? (mounted ? t.common.copied : "Скопировано") : (mounted ? t.common.copy : "Копировать")}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl glass text-gray-400 hover:border-amber-500/30 hover:text-amber-400 text-sm font-medium transition-all duration-300"
        >
          <span>🔗</span>
          <span>{mounted ? t.common.share : "Поделиться"}</span>
        </button>
      </div>
    </div>
  );
}

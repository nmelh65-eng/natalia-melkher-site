"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";

interface WorkStatsProps {
  work: TranslatedWork;
}

export default function WorkStats({ work }: WorkStatsProps) {
  const { t } = useLanguage();
  const [likes, setLikes] = useState(work.likes || 0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const formattedDate = new Date(work.createdAt).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function handleLike() {
    if (liked || likeLoading) return;

    try {
      setLikeLoading(true);

      const storageKey = `liked:${work.id}`;
      if (typeof window !== "undefined" && localStorage.getItem(storageKey)) {
        setLiked(true);
        return;
      }

      const res = await fetch("/api/works", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: work.id,
          action: "like",
        }),
      });

      if (res.ok) {
        setLikes((prev) => prev + 1);
        setLiked(true);
        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, "1");
        }
      }
    } catch (e) {
      console.error("Like error:", e);
    } finally {
      setLikeLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true">📅</span>
        <span>{formattedDate}</span>
      </span>

      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true">⏱</span>
        <span>
          {work.readingTime} {t.sections.minuteRead}
        </span>
      </span>

      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true">👁</span>
        <span>
          {work.views} {t.sections.views}
        </span>
      </span>

      <button
        type="button"
        onClick={handleLike}
        disabled={liked || likeLoading}
        className={
          "inline-flex items-center gap-1.5 transition-colors " +
          (liked
            ? "text-pink-400 cursor-default"
            : "text-gray-500 hover:text-pink-400")
        }
      >
        <span aria-hidden="true">❤️</span>
        <span>
          {likes} {t.sections.likes}
        </span>
      </button>
    </div>
  );
}

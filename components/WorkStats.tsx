"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";

interface WorkStatsProps {
  work: TranslatedWork;
}

export default function WorkStats({ work }: WorkStatsProps) {
  const { t } = useLanguage();

  const formattedDate = new Date(work.createdAt).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true">❤️</span>
        <span>
          {work.likes} {t.sections.likes}
        </span>
      </span>
    </div>
  );
}

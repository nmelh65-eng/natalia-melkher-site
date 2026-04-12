"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationStrings, WorkCategory } from "@/types";
import {
  CATEGORY_DEF,
  THEME_HERO,
  WORK_CATEGORIES,
} from "@/lib/work-categories";
import AnimatedSection from "@/components/AnimatedSection";

type SectionKey = keyof TranslationStrings["sections"];

const INTRO_KEY: Record<WorkCategory, SectionKey> = {
  poetry: "poetryIntro",
  prose: "proseIntro",
  essay: "essayIntro",
  notes: "notesIntro",
  quotes: "quotesIntro",
  inspiration: "inspirationIntro",
};

const TITLE_KEY: Record<WorkCategory, SectionKey> = {
  poetry: "poetry",
  prose: "prose",
  essay: "essay",
  notes: "notes",
  quotes: "quotes",
  inspiration: "inspiration",
};

export type TextsHubCounts = Record<WorkCategory, number>;

export default function TextsHubClient({ counts }: { counts: TextsHubCounts }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <section className="relative pt-24 pb-10 px-4 sm:px-6">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[min(920px,100vw)] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="mb-10 max-w-3xl">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-violet-300/80">
                {t.sections.textsHubEyebrow}
              </p>
              <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {t.nav.textsHub}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-gray-400 sm:text-base">
                {t.sections.textsHubIntro}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {WORK_CATEGORIES.map((category) => {
              const def = CATEGORY_DEF[category];
              const theme = THEME_HERO[def.theme];
              const title = t.sections[TITLE_KEY[category]] as string;
              const intro = t.sections[INTRO_KEY[category]] as string;
              const n = counts[category] ?? 0;

              return (
                <AnimatedSection key={category}>
                  <Link
                    href={`/${def.path}`}
                    className="group relative block overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.05]"
                  >
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl ${theme.blur}`}
                    />
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">{title}</h2>
                      </div>
                      <span
                        className={
                          "inline-flex shrink-0 items-center rounded-full border border-white/10 " +
                          "bg-black/20 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-gray-200"
                        }
                        aria-label={`${n} — ${title} — ${t.sections.latestWorks}`}
                      >
                        {n}
                      </span>
                    </div>
                    <p className="relative mt-4 line-clamp-3 text-sm leading-relaxed text-gray-400">
                      {intro}
                    </p>
                    <div className="relative mt-5 flex items-center gap-2 text-sm font-medium text-violet-200/90">
                      <span className="transition-transform group-hover:translate-x-0.5">
                        {t.sections.readMore}
                      </span>
                      <ArrowUpRight className="h-4 w-4 opacity-80" strokeWidth={2} aria-hidden />
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

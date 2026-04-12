import type { WorkCategory } from "@/types";

/** Порядок в URL и админке */
export const WORK_CATEGORIES: readonly WorkCategory[] = [
  "poetry",
  "prose",
  "essay",
  "notes",
  "quotes",
  "inspiration",
] as const;

export function isWorkCategory(value: string): value is WorkCategory {
  return (WORK_CATEGORIES as readonly string[]).includes(value);
}

/** Подписи для админки (RU) */
export const CATEGORY_LABEL_RU: Record<WorkCategory, string> = {
  poetry: "Стихи",
  prose: "Проза",
  essay: "Эссе",
  notes: "Заметки",
  quotes: "Цитаты",
  inspiration: "Вдохновение",
};

export type CategoryPresentation = "stanza" | "prose";

export type CategoryTheme =
  | "purple"
  | "amber"
  | "emerald"
  | "sky"
  | "rose"
  | "violet";

type CategoryDef = {
  path: WorkCategory;
  presentation: CategoryPresentation;
  theme: CategoryTheme;
  /** Подпись раздела для schema / метаданных (RU) */
  sectionLabelRu: string;
  /** Короткий ярлык для OG */
  ogFooterRu: string;
};

export const CATEGORY_DEF: Record<WorkCategory, CategoryDef> = {
  poetry: {
    path: "poetry",
    presentation: "stanza",
    theme: "purple",
    sectionLabelRu: "Поэзия",
    ogFooterRu: "Поэзия",
  },
  prose: {
    path: "prose",
    presentation: "prose",
    theme: "amber",
    sectionLabelRu: "Проза",
    ogFooterRu: "Проза",
  },
  essay: {
    path: "essay",
    presentation: "prose",
    theme: "emerald",
    sectionLabelRu: "Эссе",
    ogFooterRu: "Эссе",
  },
  notes: {
    path: "notes",
    presentation: "prose",
    theme: "sky",
    sectionLabelRu: "Заметки",
    ogFooterRu: "Заметки",
  },
  quotes: {
    path: "quotes",
    presentation: "prose",
    theme: "rose",
    sectionLabelRu: "Цитаты",
    ogFooterRu: "Цитаты",
  },
  inspiration: {
    path: "inspiration",
    presentation: "prose",
    theme: "violet",
    sectionLabelRu: "Вдохновение",
    ogFooterRu: "Вдохновение",
  },
};

/** Tailwind-классы для листингов / героев (полные строки для JIT) */
export const THEME_HERO: Record<
  CategoryTheme,
  { blur: string; eyebrow: string; spin: string }
> = {
  purple: {
    blur: "bg-purple-500/10",
    eyebrow: "text-purple-400/70",
    spin: "border-purple-500",
  },
  amber: {
    blur: "bg-amber-500/10",
    eyebrow: "text-amber-400/70",
    spin: "border-amber-500",
  },
  emerald: {
    blur: "bg-emerald-500/10",
    eyebrow: "text-emerald-400/70",
    spin: "border-emerald-500",
  },
  sky: {
    blur: "bg-sky-500/10",
    eyebrow: "text-sky-400/70",
    spin: "border-sky-500",
  },
  rose: {
    blur: "bg-rose-500/10",
    eyebrow: "text-rose-400/70",
    spin: "border-rose-500",
  },
  violet: {
    blur: "bg-violet-500/10",
    eyebrow: "text-violet-400/70",
    spin: "border-violet-500",
  },
};

export type ProseCardAccent = CategoryTheme;

import type { CategoryTheme } from "@/lib/work-categories";

/** Стили карточки прозы / эссе / заметок для Tailwind JIT (полные строки). */
export const PROSE_CARD_STYLES: Record<
  CategoryTheme,
  {
    article: string;
    orb1: string;
    orb2: string;
    topLine: string;
    badge: string;
    dot: string;
    titleHover: string;
    inviteHeart: string;
    cta: string;
  }
> = {
  amber: {
    article:
      "hover:border-amber-400/25 hover:shadow-[0_18px_50px_rgba(0,0,0,0.28)]",
    orb1: "bg-amber-500/14",
    orb2: "bg-purple-500/8",
    topLine:
      "bg-gradient-to-r from-transparent via-amber-400/80 to-transparent",
    badge: "border-amber-400/20 bg-amber-500/10 text-amber-300/90",
    dot: "bg-amber-400",
    titleHover: "group-hover:text-amber-200",
    inviteHeart: "text-amber-200/80",
    cta:
      "border-amber-400/35 bg-amber-500/15 text-amber-100 hover:bg-amber-500/25 hover:text-white hover:border-amber-400/50 shadow-[0_4px_20px_rgba(245,158,11,0.12)] focus:ring-amber-400",
  },
  emerald: {
    article:
      "hover:border-emerald-400/25 hover:shadow-[0_18px_50px_rgba(0,0,0,0.28)]",
    orb1: "bg-emerald-500/14",
    orb2: "bg-teal-500/8",
    topLine:
      "bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent",
    badge: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300/90",
    dot: "bg-emerald-400",
    titleHover: "group-hover:text-emerald-200",
    inviteHeart: "text-emerald-200/80",
    cta:
      "border-emerald-400/35 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/25 hover:text-white hover:border-emerald-400/50 shadow-[0_4px_20px_rgba(16,185,129,0.12)] focus:ring-emerald-400",
  },
  sky: {
    article:
      "hover:border-sky-400/25 hover:shadow-[0_18px_50px_rgba(0,0,0,0.28)]",
    orb1: "bg-sky-500/14",
    orb2: "bg-blue-500/8",
    topLine:
      "bg-gradient-to-r from-transparent via-sky-400/80 to-transparent",
    badge: "border-sky-400/20 bg-sky-500/10 text-sky-300/90",
    dot: "bg-sky-400",
    titleHover: "group-hover:text-sky-200",
    inviteHeart: "text-sky-200/80",
    cta:
      "border-sky-400/35 bg-sky-500/15 text-sky-100 hover:bg-sky-500/25 hover:text-white hover:border-sky-400/50 shadow-[0_4px_20px_rgba(14,165,233,0.12)] focus:ring-sky-400",
  },
  rose: {
    article:
      "hover:border-rose-400/25 hover:shadow-[0_18px_50px_rgba(0,0,0,0.28)]",
    orb1: "bg-rose-500/14",
    orb2: "bg-pink-500/8",
    topLine:
      "bg-gradient-to-r from-transparent via-rose-400/80 to-transparent",
    badge: "border-rose-400/20 bg-rose-500/10 text-rose-300/90",
    dot: "bg-rose-400",
    titleHover: "group-hover:text-rose-200",
    inviteHeart: "text-rose-200/80",
    cta:
      "border-rose-400/35 bg-rose-500/15 text-rose-100 hover:bg-rose-500/25 hover:text-white hover:border-rose-400/50 shadow-[0_4px_20px_rgba(244,63,94,0.12)] focus:ring-rose-400",
  },
  violet: {
    article:
      "hover:border-violet-400/25 hover:shadow-[0_18px_50px_rgba(0,0,0,0.28)]",
    orb1: "bg-violet-500/14",
    orb2: "bg-fuchsia-500/8",
    topLine:
      "bg-gradient-to-r from-transparent via-violet-400/80 to-transparent",
    badge: "border-violet-400/20 bg-violet-500/10 text-violet-300/90",
    dot: "bg-violet-400",
    titleHover: "group-hover:text-violet-200",
    inviteHeart: "text-violet-200/80",
    cta:
      "border-violet-400/35 bg-violet-500/15 text-violet-100 hover:bg-violet-500/25 hover:text-white hover:border-violet-400/50 shadow-[0_4px_20px_rgba(139,92,246,0.12)] focus:ring-violet-400",
  },
  purple: {
    article:
      "hover:border-purple-400/25 hover:shadow-[0_18px_50px_rgba(0,0,0,0.28)]",
    orb1: "bg-purple-500/14",
    orb2: "bg-fuchsia-500/8",
    topLine:
      "bg-gradient-to-r from-transparent via-purple-400/80 to-transparent",
    badge: "border-purple-400/20 bg-purple-500/10 text-purple-300/90",
    dot: "bg-purple-400",
    titleHover: "group-hover:text-purple-200",
    inviteHeart: "text-purple-200/80",
    cta:
      "border-purple-400/35 bg-purple-500/15 text-purple-100 hover:bg-purple-500/25 hover:text-white hover:border-purple-400/50 shadow-[0_4px_20px_rgba(168,85,247,0.12)] focus:ring-purple-400",
  },
};

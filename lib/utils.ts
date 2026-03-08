import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, locale = "ru-RU"): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric", month: "long", day: "numeric",
  });
}

export function getLocale(lang: string): string {
  const locales: Record<string, string> = {
    ru: "ru-RU", en: "en-US", de: "de-DE",
    fr: "fr-FR", zh: "zh-CN", ko: "ko-KR",
  };
  return locales[lang] || "ru-RU";
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function generateId(prefix: string): string {
  return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
}

export function truncate(str: string, len = 120): string {
  return str.length <= len ? str : str.slice(0, len).trimEnd() + "…";
}

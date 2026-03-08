import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, locale = "ru-RU"): string {
  return new Date(dateString).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}

export function getLocale(lang: string): string {
  const locales: Record<string, string> = { ru: "ru-RU", en: "en-US", de: "de-DE", fr: "fr-FR", zh: "zh-CN", ko: "ko-KR" };
  return locales[lang] || "ru-RU";
}

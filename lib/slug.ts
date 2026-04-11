import type { TranslatedWork } from "@/types";

const CYRILLIC: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

/** Латиница из заголовка для fallback slug (эмодзи и лишние символы убираются). */
export function slugifyTitle(title: string): string {
  const lower = title.toLowerCase().trim();
  let out = "";
  for (const ch of lower) {
    if (CYRILLIC[ch]) out += CYRILLIC[ch];
    else if (/[a-z0-9]/.test(ch)) out += ch;
    else if (/\s|[-_/.,:;!?'"«»()—–]/.test(ch)) out += "-";
  }
  const collapsed = out.replace(/-+/g, "-").replace(/^-|-$/g, "");
  return collapsed || "work";
}

/** Публичный сегмент URL: явный slug или автогенерация из заголовка. */
export function getWorkSlug(work: TranslatedWork): string {
  const s = work.slug?.trim();
  if (s) return s;
  return slugifyTitle(work.title);
}

export function workPublicPath(work: TranslatedWork): string {
  return `/${work.category}/${getWorkSlug(work)}`;
}

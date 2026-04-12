import type { Metadata } from "next";

/** Дополнительные en/de поля без отдельных URL (meta name + OG locales). */
export function withEnDeHints(
  base: Metadata,
  hints: {
    titleEn: string;
    titleDe: string;
    descriptionEn: string;
    descriptionDe: string;
  }
): Metadata {
  const og = base.openGraph;
  const openGraph =
    typeof og === "object" && og !== null && !Array.isArray(og)
      ? {
          ...og,
          locale: "ru_RU",
          alternateLocale: ["en_US", "de_DE"],
        }
      : {
          locale: "ru_RU",
          alternateLocale: ["en_US", "de_DE"],
        };

  const prevOther =
    base.other &&
    typeof base.other === "object" &&
    !Array.isArray(base.other)
      ? base.other
      : {};

  return {
    ...base,
    openGraph,
    other: {
      ...prevOther,
      "title:en": hints.titleEn,
      "title:de": hints.titleDe,
      "description:en": hints.descriptionEn,
      "description:de": hints.descriptionDe,
    },
  };
}

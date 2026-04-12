import type { TranslatedWork } from "@/types";
import { getWorkSlug } from "@/lib/slug";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

const AUTHOR = {
  "@type": "Person" as const,
  name: "Наталья Мельхер",
  alternateName: "Natalia Melkher",
  url: BASE,
};

export function buildWorkStructuredDataScripts(
  work: TranslatedWork,
  headline: string,
  description: string
): { creative: string; breadcrumbs: string } {
  const slug = getWorkSlug(work);
  const url = `${BASE}/${work.category}/${slug}`;
  const sectionName = work.category === "poetry" ? "Поэзия" : "Проза";
  const sectionPath = `${BASE}/${work.category}`;

  const creative =
    work.category === "poetry"
      ? {
          "@context": "https://schema.org",
          "@type": "Poem",
          "@id": `${url}#creative`,
          name: headline,
          headline,
          description,
          inLanguage: work.language,
          author: AUTHOR,
          publisher: AUTHOR,
          datePublished: work.createdAt,
          dateModified: work.updatedAt || work.createdAt,
          url,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          keywords: work.tags.join(", "),
          isAccessibleForFree: true,
          timeRequired: `PT${Math.max(1, work.readingTime)}M`,
        }
      : {
          "@context": "https://schema.org",
          "@type": "ShortStory",
          "@id": `${url}#creative`,
          name: headline,
          headline,
          description,
          inLanguage: work.language,
          author: AUTHOR,
          publisher: AUTHOR,
          datePublished: work.createdAt,
          dateModified: work.updatedAt || work.createdAt,
          url,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          keywords: work.tags.join(", "),
          isAccessibleForFree: true,
          timeRequired: `PT${Math.max(1, work.readingTime)}M`,
        };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: `${BASE}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: sectionName,
        item: sectionPath,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: headline,
        item: url,
      },
    ],
  };

  return {
    creative: JSON.stringify(creative),
    breadcrumbs: JSON.stringify(breadcrumbs),
  };
}

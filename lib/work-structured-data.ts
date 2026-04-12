import type { TranslatedWork } from "@/types";
import { getWorkSlug } from "@/lib/slug";
import { getPublicSiteUrl } from "@/lib/site-url";

export function buildWorkStructuredDataScripts(
  work: TranslatedWork,
  headline: string,
  description: string
): { creative: string; breadcrumbs: string } {
  const base = getPublicSiteUrl();
  const author = {
    "@type": "Person" as const,
    name: "Наталья Мельхер",
    alternateName: "Natalia Melkher",
    url: base,
  };

  const slug = getWorkSlug(work);
  const url = `${base}/${work.category}/${slug}`;
  const sectionName = work.category === "poetry" ? "Поэзия" : "Проза";
  const sectionPath = `${base}/${work.category}`;

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
          author,
          publisher: author,
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
          author,
          publisher: author,
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
        item: `${base}/`,
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

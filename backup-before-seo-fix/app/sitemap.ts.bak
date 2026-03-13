import type { MetadataRoute } from "next";
import { getAllPublishedWorks } from "@/data/works";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const works = getAllPublishedWorks();

  const workUrls = works.map((work) => ({
    url: `${BASE}/${work.category}/${work.id}`,
    lastModified: new Date(work.updatedAt),
    changeFrequency: "monthly" as const,
    priority: work.views > 400 ? 0.9 : work.views > 200 ? 0.8 : 0.7,
  }));

  const poetryTags = [...new Set(works.filter(w => w.category === "poetry").flatMap(w => w.tags))];
  const proseTags  = [...new Set(works.filter(w => w.category === "prose").flatMap(w => w.tags))];

  const tagUrls = [
    ...poetryTags.map(tag => ({ url: `${BASE}/poetry?tag=${encodeURIComponent(tag)}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...proseTags.map(tag  => ({ url: `${BASE}/prose?tag=${encodeURIComponent(tag)}`,   lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];

  return [
    { url: BASE,               lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/poetry`,  lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${BASE}/prose`,   lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${BASE}/about`,   lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    ...workUrls,
    ...tagUrls,
  ];
}

import type { MetadataRoute } from "next";
import { getPublishedWorks } from "@/lib/works-store";
import { getWorkSlug } from "@/lib/slug";
import { getPublicSiteUrl } from "@/lib/site-url";

const BASE = getPublicSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const works = await getPublishedWorks();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/poetry`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/prose`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/essay`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE}/notes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE}/quotes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE}/inspiration`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE}/texts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.88,
    },
  ];

  const workPages: MetadataRoute.Sitemap = works.map((work) => ({
    url: `${BASE}/${work.category}/${getWorkSlug(work)}`,
    lastModified: new Date(work.updatedAt || work.createdAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...workPages];
}

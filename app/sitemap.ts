import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://natalia-melkher.vercel.app";
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: baseUrl + "/poetry", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: baseUrl + "/prose", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: baseUrl + "/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: baseUrl + "/contact", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}

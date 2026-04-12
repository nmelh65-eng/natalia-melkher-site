import { getPublishedWorks } from "@/lib/works-store";
import { getWorkSlug } from "@/lib/slug";
import { getPublicSiteUrl } from "@/lib/site-url";

const BASE = getPublicSiteUrl();

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const works = await getPublishedWorks();
  const sorted = [...works].sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt).getTime() -
      new Date(a.updatedAt || a.createdAt).getTime()
  );

  const items = sorted
    .map((work) => {
      const slug = getWorkSlug(work);
      const link = `${BASE}/${work.category}/${slug}`;
      const rawDesc = (work.excerpt || work.content.slice(0, 280)).trim();
      const desc = escapeXml(rawDesc);
      const title = escapeXml(work.title);
      const pubDate = new Date(work.updatedAt || work.createdAt).toUTCString();
      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${desc}</description>
    </item>`;
    })
    .join("\n");

  const channelTitle = escapeXml("Наталья Мельхер — поэзия и проза");
  const channelDesc = escapeXml(
    "Новые и обновлённые публикации: стихи и проза на авторском сайте."
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${channelTitle}</title>
    <link>${BASE}/</link>
    <description>${channelDesc}</description>
    <language>ru</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

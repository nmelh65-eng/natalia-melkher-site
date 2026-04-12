import { getWorkByPublicSegment } from "@/lib/works-store";
import { buildWorkStructuredDataScripts } from "@/lib/work-structured-data";

export default async function StructuredData({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkByPublicSegment(slug);

  if (!work || work.category !== "poetry" || !work.isPublished) {
    return null;
  }

  const description = (
    work.excerpt ||
    work.content.slice(0, 280)
  ).trim();
  const { creative, breadcrumbs } = buildWorkStructuredDataScripts(
    work,
    work.title,
    description
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: creative }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbs }}
      />
    </>
  );
}

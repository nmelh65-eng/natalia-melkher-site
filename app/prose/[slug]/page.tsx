import { notFound } from "next/navigation";
import {
  getPublishedWorks,
  getWorkByPublicSegment,
} from "@/lib/works-store";
import ProseWorkPageClient from "./ProseWorkPageClient";

export default async function ProseWorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkByPublicSegment(slug);

  if (!work || work.category !== "prose" || !work.isPublished) {
    notFound();
  }

  const allProse = (await getPublishedWorks()).filter(
    (w) => w.category === "prose"
  );

  return (
    <ProseWorkPageClient
      key={slug}
      slug={slug}
      initialWork={work}
      initialAllProse={allProse}
    />
  );
}

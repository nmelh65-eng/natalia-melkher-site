import { notFound } from "next/navigation";
import {
  getPublishedWorks,
  getWorkByPublicSegment,
} from "@/lib/works-store";
import WorkPiecePageClient from "@/components/works/WorkPiecePageClient";

export default async function EssayWorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkByPublicSegment(slug);

  if (!work || work.category !== "essay" || !work.isPublished) {
    notFound();
  }

  const same = (await getPublishedWorks()).filter((w) => w.category === "essay");

  return (
    <WorkPiecePageClient
      key={slug}
      category="essay"
      slug={slug}
      initialWork={work}
      initialSameCategory={same}
    />
  );
}

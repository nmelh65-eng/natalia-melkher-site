import { notFound } from "next/navigation";
import {
  getPublishedWorks,
  getWorkByPublicSegment,
} from "@/lib/works-store";
import WorkPiecePageClient from "@/components/works/WorkPiecePageClient";

export default async function NotesWorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkByPublicSegment(slug);

  if (!work || work.category !== "notes" || !work.isPublished) {
    notFound();
  }

  const same = (await getPublishedWorks()).filter((w) => w.category === "notes");

  return (
    <WorkPiecePageClient
      key={slug}
      category="notes"
      slug={slug}
      initialWork={work}
      initialSameCategory={same}
    />
  );
}

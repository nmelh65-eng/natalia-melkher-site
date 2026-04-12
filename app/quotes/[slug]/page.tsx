import { notFound } from "next/navigation";
import {
  getPublishedWorks,
  getWorkByPublicSegment,
} from "@/lib/works-store";
import WorkPiecePageClient from "@/components/works/WorkPiecePageClient";

export default async function QuotesWorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkByPublicSegment(slug);

  if (!work || work.category !== "quotes" || !work.isPublished) {
    notFound();
  }

  const same = (await getPublishedWorks()).filter((w) => w.category === "quotes");

  return (
    <WorkPiecePageClient
      key={slug}
      category="quotes"
      slug={slug}
      initialWork={work}
      initialSameCategory={same}
    />
  );
}

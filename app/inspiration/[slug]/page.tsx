import { notFound } from "next/navigation";
import {
  getPublishedWorks,
  getWorkByPublicSegment,
} from "@/lib/works-store";
import WorkPiecePageClient from "@/components/works/WorkPiecePageClient";

export default async function InspirationWorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkByPublicSegment(slug);

  if (!work || work.category !== "inspiration" || !work.isPublished) {
    notFound();
  }

  const same = (await getPublishedWorks()).filter(
    (w) => w.category === "inspiration"
  );

  return (
    <WorkPiecePageClient
      key={slug}
      category="inspiration"
      slug={slug}
      initialWork={work}
      initialSameCategory={same}
    />
  );
}

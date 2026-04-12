import { notFound } from "next/navigation";
import {
  getPublishedWorks,
  getWorkByPublicSegment,
} from "@/lib/works-store";
import PoetryWorkPageClient from "./PoetryWorkPageClient";

export default async function PoetryWorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkByPublicSegment(slug);

  if (!work || work.category !== "poetry" || !work.isPublished) {
    notFound();
  }

  const allPoetry = (await getPublishedWorks()).filter(
    (w) => w.category === "poetry"
  );

  return (
    <PoetryWorkPageClient
      key={slug}
      slug={slug}
      initialWork={work}
      initialAllPoetry={allPoetry}
    />
  );
}

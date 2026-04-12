import { getPublishedWorks } from "@/lib/works-store";
import { WORK_CATEGORIES } from "@/lib/work-categories";
import type { WorkCategory } from "@/types";
import TextsHubClient, {
  type TextsHubCounts,
} from "@/components/texts/TextsHubClient";

export const dynamic = "force-dynamic";

function emptyCounts(): TextsHubCounts {
  return WORK_CATEGORIES.reduce((acc, c) => {
    acc[c] = 0;
    return acc;
  }, {} as TextsHubCounts);
}

export default async function TextsPage() {
  const works = await getPublishedWorks();
  const counts = emptyCounts();

  for (const w of works) {
    const c = w.category as WorkCategory;
    if (c in counts) counts[c] += 1;
  }

  return <TextsHubClient counts={counts} />;
}

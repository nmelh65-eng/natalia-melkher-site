import { getPublicSiteUrl } from "@/lib/site-url";
import { CategoryWorksPageClient } from "@/components/works/CategoryWorksPageClient";

export default function NotesIndexPage() {
  return <CategoryWorksPageClient category="notes" siteUrl={getPublicSiteUrl()} />;
}

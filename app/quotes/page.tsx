import { getPublicSiteUrl } from "@/lib/site-url";
import { CategoryWorksPageClient } from "@/components/works/CategoryWorksPageClient";

export default function QuotesIndexPage() {
  return <CategoryWorksPageClient category="quotes" siteUrl={getPublicSiteUrl()} />;
}

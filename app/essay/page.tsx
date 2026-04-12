import { getPublicSiteUrl } from "@/lib/site-url";
import { CategoryWorksPageClient } from "@/components/works/CategoryWorksPageClient";

export default function EssayIndexPage() {
  return <CategoryWorksPageClient category="essay" siteUrl={getPublicSiteUrl()} />;
}

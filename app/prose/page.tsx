import { getPublicSiteUrl } from "@/lib/site-url";
import { CategoryWorksPageClient } from "@/components/works/CategoryWorksPageClient";

export default function ProsePage() {
  return <CategoryWorksPageClient category="prose" siteUrl={getPublicSiteUrl()} />;
}

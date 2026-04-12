import { getPublicSiteUrl } from "@/lib/site-url";
import { CategoryWorksPageClient } from "@/components/works/CategoryWorksPageClient";

export default function InspirationIndexPage() {
  return (
    <CategoryWorksPageClient category="inspiration" siteUrl={getPublicSiteUrl()} />
  );
}

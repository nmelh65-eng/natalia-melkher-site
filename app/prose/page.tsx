import { getPublicSiteUrl } from "@/lib/site-url";
import { ProsePageClient } from "@/components/ProsePageClient";

export default function ProsePage() {
  return <ProsePageClient siteUrl={getPublicSiteUrl()} />;
}

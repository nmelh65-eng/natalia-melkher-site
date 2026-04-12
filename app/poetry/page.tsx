import { getPublicSiteUrl } from "@/lib/site-url";
import { PoetryPageClient } from "@/components/PoetryPageClient";

export default function PoetryPage() {
  return <PoetryPageClient siteUrl={getPublicSiteUrl()} />;
}

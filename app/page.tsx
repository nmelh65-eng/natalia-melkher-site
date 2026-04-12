import { getPublicSiteUrl } from "@/lib/site-url";
import { HomePageClient } from "@/components/HomePageClient";

export default function HomePage() {
  return <HomePageClient siteUrl={getPublicSiteUrl()} />;
}

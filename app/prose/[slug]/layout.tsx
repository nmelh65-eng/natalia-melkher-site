import type { ReactNode } from "react";
import WorkSlugStructuredData from "@/components/works/WorkSlugStructuredData";

export { generateMetadata } from "./metadata";

export default async function ProseWorkLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <WorkSlugStructuredData category="prose" params={params} />
      {children}
    </>
  );
}

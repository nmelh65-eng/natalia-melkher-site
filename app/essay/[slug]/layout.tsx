import type { ReactNode } from "react";
import WorkSlugStructuredData from "@/components/works/WorkSlugStructuredData";

export { generateMetadata } from "./metadata";

export default async function EssayWorkLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <WorkSlugStructuredData category="essay" params={params} />
      {children}
    </>
  );
}

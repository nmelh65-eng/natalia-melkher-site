import type { ReactNode } from "react";
import { generateMetadata } from "./metadata";
import StructuredData from "./StructuredData";

export { generateMetadata };

export default async function ProseWorkLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <StructuredData params={params} />
      {children}
    </>
  );
}

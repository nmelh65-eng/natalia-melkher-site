"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateId } from "@/lib/utils";
export default function NewWorkPage() {
  const router = useRouter();
  useEffect(() => { router.replace(`/admin/works/${generateId("work")}`); }, [router]);
  return null;
}

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getAllWorks, upsertWork, deleteWork, togglePublish } from "@/lib/works-store";
import type { TranslatedWork } from "@/types";

async function guard() {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const err = await guard(); if (err) return err;
  return NextResponse.json({ data: getAllWorks() });
}

export async function POST(req: NextRequest) {
  const err = await guard(); if (err) return err;
  const work: TranslatedWork = await req.json();
  work.updatedAt = new Date().toISOString();
  if (!work.createdAt) work.createdAt = work.updatedAt;
  upsertWork(work);
  return NextResponse.json({ ok: true, data: work });
}

export async function DELETE(req: NextRequest) {
  const err = await guard(); if (err) return err;
  const { id } = await req.json();
  deleteWork(id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const err = await guard(); if (err) return err;
  const { id } = await req.json();
  const work = togglePublish(id);
  if (!work) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, data: work });
}

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
  const err = await guard();
  if (err) return err;

  const works = await getAllWorks();
  return NextResponse.json({ data: works });
}

export async function POST(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  try {
    const work: TranslatedWork = await req.json();
    work.updatedAt = new Date().toISOString();
    if (!work.createdAt) work.createdAt = work.updatedAt;
    if (!work.id) work.id = `${work.category}-${Date.now()}`;

    const saved = await upsertWork(work);
    if (!saved) {
      return NextResponse.json(
        { error: "Не удалось сохранить. Проверьте Redis." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, data: work });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Ошибка: " + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  const { id } = await req.json();
  const deleted = await deleteWork(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Не найдено или нельзя удалить встроенное произведение" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  const { id } = await req.json();
  const work = await togglePublish(id);

  if (!work) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: work });
}

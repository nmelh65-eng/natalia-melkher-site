import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getAllWorks, upsertWork, deleteWork, togglePublish } from "@/lib/works-store";
import type { TranslatedWork } from "@/types";

const noStore = { "Cache-Control": "private, no-store, max-age=0" } as const;

function adminJson(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: noStore });
}

async function guard() {
  const ok = await getAdminSession();
  if (!ok) return adminJson({ error: "Unauthorized" }, 401);
  return null;
}

export async function GET() {
  const err = await guard();
  if (err) return err;
  const works = await getAllWorks();
  return adminJson({ data: works });
}

export async function POST(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  try {
    const work: TranslatedWork = await req.json();
    work.updatedAt = new Date().toISOString();
    if (!work.createdAt) work.createdAt = work.updatedAt;
    if (!work.id) work.id = (work.category || "work") + "-" + Date.now();

    const saved = await upsertWork(work);
    if (!saved) {
      return adminJson(
        { error: "Redis недоступен. Проверьте подключение." },
        500
      );
    }

    return adminJson({ ok: true, data: work });
  } catch (error: unknown) {
    const detail =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : null;
    return adminJson(
      {
        error: "Внутренняя ошибка сервера",
        ...(detail ? { detail } : {}),
      },
      500
    );
  }
}

export async function DELETE(req: NextRequest) {
  const err = await guard();
  if (err) return err;
  const { id } = await req.json();
  await deleteWork(id);
  return adminJson({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const err = await guard();
  if (err) return err;
  const { id } = await req.json();
  const work = await togglePublish(id);
  if (!work) return adminJson({ error: "Not found" }, 404);
  return adminJson({ ok: true, data: work });
}

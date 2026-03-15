import { NextRequest, NextResponse } from "next/server";
import {
  getAllWorks,
  getWorkById,
  incrementViews,
  incrementLikes,
} from "@/lib/works-store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const id = searchParams.get("id");

  if (id) {
    const work = await getWorkById(id);

    if (!work) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(work);
  }

  const allWorks = await getAllWorks();
  let filtered = allWorks.filter((w) => w.isPublished);

  if (category) {
    filtered = filtered.filter((w) => w.category === category);
  }

  return NextResponse.json(filtered);
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: "Missing id or action" },
        { status: 400 }
      );
    }

    if (action === "view") {
      const updated = await incrementViews(id);
      if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ ok: true, data: updated });
    }

    if (action === "like") {
      const updated = await incrementLikes(id);
      if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ ok: true, data: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error: " + error.message },
      { status: 500 }
    );
  }
}

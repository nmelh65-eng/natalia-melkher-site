import { NextRequest, NextResponse } from "next/server";
import { getAllWorks, getWorkByIdAsync } from "@/lib/works-store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const id = searchParams.get("id");

  if (id) {
    const work = await getWorkByIdAsync(id);
    if (!work) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(work);
  }

  const allWorks = await getAllWorks();
  let filtered = allWorks.filter(w => w.isPublished);

  if (category) {
    filtered = filtered.filter(w => w.category === category);
  }

  return NextResponse.json(filtered);
}

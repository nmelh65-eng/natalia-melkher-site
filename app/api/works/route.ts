import { NextRequest, NextResponse } from "next/server";
import { getPublishedWorks } from "@/lib/works-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query    = searchParams.get("q");
    const id       = searchParams.get("id");

    let results = getPublishedWorks();

    if (id)       results = results.filter(w => w.id === id);
    if (category) results = results.filter(w => w.category === category);
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.content.toLowerCase().includes(q) ||
        w.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return NextResponse.json({ success: true, data: results, total: results.length });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAllPublishedWorks, getWorksByCategory, searchWorks } from "@/data/works";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    let results;
    if (query) results = searchWorks(query);
    else if (category) results = getWorksByCategory(category);
    else results = getAllPublishedWorks();

    return NextResponse.json({ success: true, data: results, total: results.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

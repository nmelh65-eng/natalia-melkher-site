import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { works } from "@/data/works";
import { getWorkSlug } from "@/lib/slug";

/**
 * Редирект 308 со старых URL (/poetry/poem-001) на канонические slug.
 */
export function middleware(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  if (parts.length !== 2) return NextResponse.next();

  const [category, segment] = parts;
  if (category !== "poetry" && category !== "prose") {
    return NextResponse.next();
  }

  const work = works.find((w) => w.category === category && w.id === segment);
  if (!work) return NextResponse.next();

  const canonical = getWorkSlug(work);
  if (segment === canonical) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${category}/${canonical}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/poetry/:path*", "/prose/:path*"],
};

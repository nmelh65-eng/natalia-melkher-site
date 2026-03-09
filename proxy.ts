import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const parts = token.split(".");
      const b64 = parts[0];
      const sig = parts[1];
      if (!b64 || !sig) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      const secret = process.env.ADMIN_SECRET || "dev-secret-change-me";
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw", encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
      );
      const sigBuf = await crypto.subtle.sign("HMAC", key, encoder.encode(b64));
      const arr = new Uint8Array(sigBuf);
      let binary = "";
      for (let i = 0; i < arr.length; i++) { binary += String.fromCharCode(arr[i]); }
      const raw = btoa(binary);
      const expectedSig = raw.split("+").join("-").split("/").join("_").replace(/=+$/, "");

      if (expectedSig !== sig) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      const decoded = atob(b64.split("-").join("+").split("_").join("/"));
      const payload = JSON.parse(decoded);
      if (Date.now() >= payload.exp) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
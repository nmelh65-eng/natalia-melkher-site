const fs = require("fs");

// 1. middleware.ts
fs.writeFileSync("middleware.ts", `import { NextRequest, NextResponse } from "next/server";

export async function middleware(req) {
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
      const [b64, sig] = token.split(".");
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
      const expectedSig = btoa(String.fromCharCode(...new Uint8Array(sigBuf)))
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

      if (expectedSig !== sig) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      const payload = JSON.parse(atob(b64.replace(/-/g, "+").replace(/_/g, "/")));
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
`);
console.log("OK: middleware.ts");

// 2. lib/admin-auth.ts
fs.writeFileSync("lib/admin-auth.ts", `import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_SECRET || "dev-secret-change-me";
const PASSWORD = process.env.ADMIN_PASSWORD || "natalia2026";

function toBase64Url(str) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = "";
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary).replace(/\\+/g, "-").replace(/\\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(b64) {
  const padded = b64.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function uint8ToBase64Url(buf) {
  let binary = "";
  buf.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary).replace(/\\+/g, "-").replace(/\\//g, "_").replace(/=+$/g, "");
}

async function sign(payload) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return uint8ToBase64Url(new Uint8Array(sig));
}

export async function createToken() {
  const payload = JSON.stringify({ role: "admin", exp: Date.now() + 24 * 60 * 60 * 1000 });
  const b64 = toBase64Url(payload);
  const sig = await sign(b64);
  return b64 + "." + sig;
}

export async function verifyToken(token) {
  try {
    const [b64, sig] = token.split(".");
    if (!b64 || !sig) return false;
    const expected = await sign(b64);
    if (expected !== sig) return false;
    const data = JSON.parse(fromBase64Url(b64));
    return Date.now() < data.exp;
  } catch { return false; }
}

export function checkPassword(pwd) {
  return pwd === PASSWORD;
}

export async function getAdminSession() {
  try {
    const jar = await cookies();
    const token = jar.get("admin-token")?.value;
    if (!token) return false;
    return verifyToken(token);
  } catch { return false; }
}
`);
console.log("OK: lib/admin-auth.ts");

// 3. login route
fs.writeFileSync("app/api/admin/login/route.ts", `import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createToken } from "@/lib/admin-auth";

export async function POST(req) {
  try {
    const { password } = await req.json();

    if (!checkPassword(password)) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    const token = await createToken();
    const res = NextResponse.json({ ok: true });

    res.cookies.set("admin-token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 86400,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res;
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
`);
console.log("OK: login/route.ts");

// 4. logout route
fs.writeFileSync("app/api/admin/logout/route.ts", `import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin-token", "", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
`);
console.log("OK: logout/route.ts");

// 5. Delete proxy.ts
if (fs.existsSync("proxy.ts")) {
  fs.unlinkSync("proxy.ts");
  console.log("OK: proxy.ts deleted");
}

console.log("\n=== ALL FIXES APPLIED ===");

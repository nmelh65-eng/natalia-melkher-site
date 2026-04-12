import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin-token", "", {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 0,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
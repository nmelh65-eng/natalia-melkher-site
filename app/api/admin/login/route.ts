import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!checkPassword(password)) {
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
    }
    const token = await createToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin-token", token, {
      httpOnly: true, sameSite: "lax", maxAge: 86400,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

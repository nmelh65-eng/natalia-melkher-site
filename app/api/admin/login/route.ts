import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createToken } from "@/lib/admin-auth";

type LoginAttemptRecord = {
  count: number;
  resetTime: number;
};

const loginAttempts = new Map<string, LoginAttemptRecord>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000; // 15 минут

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return realIp || "unknown";
}

function isBlocked(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) return false;

  if (now > record.resetTime) {
    loginAttempts.delete(ip);
    return false;
  }

  return record.count >= MAX_ATTEMPTS;
}

function registerFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetTime) {
    loginAttempts.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return;
  }

  record.count += 1;
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    if (isBlocked(ip)) {
      return NextResponse.json(
        { error: "Слишком много попыток входа. Попробуйте позже." },
        { status: 429 }
      );
    }

    const { password } = await req.json();

    if (!checkPassword(password)) {
      registerFailedAttempt(ip);
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    clearAttempts(ip);

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

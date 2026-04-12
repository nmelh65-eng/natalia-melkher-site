import type { NextRequest } from "next/server";

/** Первый IP клиента (учёт X-Forwarded-For за прокси). */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return realIp?.trim() || "unknown";
}

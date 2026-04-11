import { NextResponse } from "next/server";
import Redis from "ioredis";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_ADMIN_DEBUG !== "true"
  ) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isAdmin = await getAdminSession();

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url =
    process.env.REDIS_URL ||
    process.env.STORAGE_URL ||
    process.env.KV_URL;

  let redisStatus = "no URL configured";
  let worksCount = 0;

  if (url) {
    try {
      const redis = new Redis(url, {
        connectTimeout: 5000,
        maxRetriesPerRequest: 1,
        tls: url.startsWith("rediss://") ? {} : undefined,
      });

      const data = await redis.get("natalia:works:v3");

      if (data) {
        const parsed = JSON.parse(data);
        worksCount = Array.isArray(parsed) ? parsed.length : 0;
      }

      await redis.quit();
      redisStatus = "connected";
    } catch {
      redisStatus = "error";
    }
  }

  return NextResponse.json({
    redis: {
      status: redisStatus,
      customWorks: worksCount,
    },
    admin: {
      authenticated: true,
    },
  });
}

import { NextResponse } from "next/server";
import Redis from "ioredis";

export async function GET() {
  const url = process.env.REDIS_URL
    || process.env.STORAGE_URL
    || process.env.KV_URL;

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
    } catch (e: any) {
      redisStatus = "error: " + e.message;
    }
  }

  return NextResponse.json({
    env: {
      REDIS_URL: !!process.env.REDIS_URL,
      STORAGE_URL: !!process.env.STORAGE_URL,
      KV_URL: !!process.env.KV_URL,
      ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
      OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
    },
    redis: {
      status: redisStatus,
      customWorks: worksCount,
    },
  });
}

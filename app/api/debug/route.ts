import { NextResponse } from "next/server";
import { createClient } from "@vercel/kv";

export async function GET() {
  const envCheck = {
    STORAGE_URL: !!process.env.STORAGE_URL,
    STORAGE_REST_API_URL: !!process.env.STORAGE_REST_API_URL,
    STORAGE_REST_API_TOKEN: !!process.env.STORAGE_REST_API_TOKEN,
    KV_URL: !!process.env.KV_URL,
    KV_REST_API_URL: !!process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
  };

  let redisStatus = "not configured";
  let redisData = null;

  const url = process.env.STORAGE_URL
    || process.env.STORAGE_REST_API_URL
    || process.env.KV_REST_API_URL
    || process.env.KV_URL;
  const token = process.env.STORAGE_REST_API_TOKEN
    || process.env.KV_REST_API_TOKEN;

  if (url && token) {
    try {
      const kv = createClient({ url, token });
      const data = await kv.get("natalia:works:v2");
      redisStatus = "connected";
      redisData = Array.isArray(data) ? `${data.length} works` : "empty";
    } catch (e: any) {
      redisStatus = "error: " + e.message;
    }
  }

  return NextResponse.json({
    env: envCheck,
    redis: { status: redisStatus, data: redisData },
    timestamp: new Date().toISOString(),
  });
}

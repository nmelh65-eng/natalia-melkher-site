import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@vercel/kv";
import { works as defaultWorks } from "@/data/works";
import type { TranslatedWork } from "@/types";

const WORKS_KEY = "natalia:works";

function getKV() {
  const url = process.env.STORAGE_URL
           || process.env.KV_REST_API_URL
           || process.env.KV_URL;
  const token = process.env.STORAGE_REST_API_TOKEN
             || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return createClient({ url, token });
}

async function getAllWorks(): Promise<TranslatedWork[]> {
  try {
    const kv = getKV();
    if (kv) {
      const custom = await kv.get<TranslatedWork[]>(WORKS_KEY);
      if (custom && Array.isArray(custom)) {
        const customIds = new Set(custom.map(w => w.id));
        const defaults = defaultWorks.filter(w => !customIds.has(w.id));
        return [...custom, ...defaults];
      }
    }
  } catch (e) {
    console.error("KV Error:", e);
  }
  return defaultWorks;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const id = searchParams.get("id");

  const allWorks = await getAllWorks();

  if (id) {
    const work = allWorks.find(w => w.id === id);
    if (!work) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(work);
  }

  let filtered = allWorks.filter(w => w.isPublished);
  if (category) {
    filtered = filtered.filter(w => w.category === category);
  }

  filtered.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json(filtered);
}

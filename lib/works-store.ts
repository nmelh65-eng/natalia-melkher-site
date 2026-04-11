import Redis from "ioredis";
import type { TranslatedWork } from "@/types";
import { works as initialWorks } from "@/data/works";
import { getWorkSlug, slugifyTitle } from "@/lib/slug";

const WORKS_KEY = "natalia:works:v3";

let redisClient: Redis | null = null;

function getRedis(): Redis | null {
  if (redisClient) return redisClient;

  const url =
    process.env.REDIS_URL ||
    process.env.STORAGE_URL ||
    process.env.KV_URL;

  if (!url) {
    console.warn("No REDIS_URL found");
    return null;
  }

  try {
    redisClient = new Redis(url, {
      maxRetriesPerRequest: 2,
      connectTimeout: 5000,
      tls: url.startsWith("rediss://") ? {} : undefined,
    });
    return redisClient;
  } catch (e) {
    console.error("Redis error:", e);
    return null;
  }
}

async function getCustomWorks(): Promise<TranslatedWork[]> {
  try {
    const redis = getRedis();
    if (!redis) return [];

    const data = await redis.get(WORKS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.error("Redis read:", e);
  }

  return [];
}

async function saveCustomWorks(works: TranslatedWork[]): Promise<boolean> {
  try {
    const redis = getRedis();
    if (!redis) return false;

    await redis.set(WORKS_KEY, JSON.stringify(works));
    return true;
  } catch (e) {
    console.error("Redis write:", e);
    return false;
  }
}

export async function getAllWorks(): Promise<TranslatedWork[]> {
  const custom = await getCustomWorks();
  const customIds = new Set(custom.map((w) => w.id));
  const defaults = initialWorks.filter((w) => !customIds.has(w.id));
  const all = [...custom, ...defaults];

  all.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return all;
}

export async function getPublishedWorks(): Promise<TranslatedWork[]> {
  return (await getAllWorks()).filter((w) => w.isPublished);
}

/** Точное совпадение по внутреннему id (просмотры, лайки, админка). */
export async function getWorkById(
  id: string
): Promise<TranslatedWork | undefined> {
  return (await getAllWorks()).find((w) => w.id === id);
}

/** Публичный URL: slug или устаревший id (poem-001). */
export async function getWorkByPublicSegment(
  segment: string
): Promise<TranslatedWork | undefined> {
  const all = await getAllWorks();
  const byId = all.find((w) => w.id === segment);
  if (byId) return byId;
  return all.find((w) => getWorkSlug(w) === segment);
}

export async function upsertWork(work: TranslatedWork): Promise<boolean> {
  const custom = await getCustomWorks();

  if (!work.id) work.id = (work.category || "work") + "-" + Date.now();

  if (typeof work.tags === "string") {
    work.tags = (work.tags as unknown as string)
      .split(/[,#\s]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }

  if (!Array.isArray(work.tags)) work.tags = [];

  work.readingTime = Math.max(
    1,
    Math.ceil((work.content || "").split(/\s+/).length / 200)
  );

  if (!work.excerpt && work.content) {
    work.excerpt = work.content.slice(0, 150).trim() + "...";
  }

  if (typeof work.views !== "number") work.views = 0;
  if (typeof work.likes !== "number") work.likes = 0;
  if (!work.translations) work.translations = {};
  if (!work.language) work.language = "ru";

  const allForSlug = [...custom, ...initialWorks.filter((w) => !custom.some((c) => c.id === w.id))];
  if (!work.slug?.trim()) {
    const base = slugifyTitle(work.title);
    let candidate = base;
    let n = 0;
    while (
      allForSlug.some(
        (w) => w.id !== work.id && getWorkSlug(w) === candidate
      )
    ) {
      n += 1;
      candidate = `${base}-${n}`;
    }
    work.slug = candidate;
  }

  const idx = custom.findIndex((w) => w.id === work.id);

  if (idx >= 0) {
    custom[idx] = { ...custom[idx], ...work };
  } else {
    const def = initialWorks.find((w) => w.id === work.id);
    custom.push(def ? { ...def, ...work } : work);
  }

  return saveCustomWorks(custom);
}

export async function deleteWork(id: string): Promise<boolean> {
  const custom = await getCustomWorks();
  const filtered = custom.filter((w) => w.id !== id);
  return saveCustomWorks(filtered);
}

export async function togglePublish(
  id: string
): Promise<TranslatedWork | null> {
  const custom = await getCustomWorks();
  const idx = custom.findIndex((w) => w.id === id);

  if (idx >= 0) {
    custom[idx].isPublished = !custom[idx].isPublished;
    custom[idx].updatedAt = new Date().toISOString();
    await saveCustomWorks(custom);
    return custom[idx];
  }

  const def = initialWorks.find((w) => w.id === id);
  if (def) {
    const copy = {
      ...def,
      isPublished: !def.isPublished,
      updatedAt: new Date().toISOString(),
    };
    custom.push(copy);
    await saveCustomWorks(custom);
    return copy;
  }

  return null;
}

export async function incrementViews(
  id: string
): Promise<TranslatedWork | null> {
  const existing = await getWorkById(id);
  if (!existing) return null;

  const updated: TranslatedWork = {
    ...existing,
    views: (existing.views || 0) + 1,
    updatedAt: new Date().toISOString(),
  };

  const ok = await upsertWork(updated);
  return ok ? updated : null;
}

export async function incrementLikes(
  id: string
): Promise<TranslatedWork | null> {
  const existing = await getWorkById(id);
  if (!existing) return null;

  const updated: TranslatedWork = {
    ...existing,
    likes: (existing.likes || 0) + 1,
    updatedAt: new Date().toISOString(),
  };

  const ok = await upsertWork(updated);
  return ok ? updated : null;
}

import { createClient } from "@vercel/kv";
import type { TranslatedWork } from "@/types";
import { works as initialWorks } from "@/data/works";

const WORKS_KEY = "natalia:works:v2";

function getKV() {
  // Пробуем все возможные имена переменных
  const url = process.env.STORAGE_URL
    || process.env.STORAGE_REST_API_URL
    || process.env.KV_REST_API_URL
    || process.env.KV_URL;
  const token = process.env.STORAGE_REST_API_TOKEN
    || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.warn("Redis KV not configured. Env vars:", {
      STORAGE_URL: !!process.env.STORAGE_URL,
      STORAGE_REST_API_URL: !!process.env.STORAGE_REST_API_URL,
      KV_REST_API_URL: !!process.env.KV_REST_API_URL,
      KV_URL: !!process.env.KV_URL,
      STORAGE_REST_API_TOKEN: !!process.env.STORAGE_REST_API_TOKEN,
      KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
    });
    return null;
  }

  return createClient({ url, token });
}

/** Получить кастомные работы из Redis */
async function getCustomWorks(): Promise<TranslatedWork[]> {
  try {
    const kv = getKV();
    if (!kv) return [];
    const data = await kv.get<TranslatedWork[]>(WORKS_KEY);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Redis read error:", e);
    return [];
  }
}

/** Сохранить кастомные работы в Redis */
async function saveCustomWorks(works: TranslatedWork[]): Promise<boolean> {
  try {
    const kv = getKV();
    if (!kv) {
      console.error("Redis not available for saving");
      return false;
    }
    await kv.set(WORKS_KEY, works);
    return true;
  } catch (e) {
    console.error("Redis write error:", e);
    return false;
  }
}

/** Получить ВСЕ работы */
export async function getAllWorks(): Promise<TranslatedWork[]> {
  const custom = await getCustomWorks();
  const customIds = new Set(custom.map(w => w.id));
  const defaults = initialWorks.filter(w => !customIds.has(w.id));
  const all = [...custom, ...defaults];
  all.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return all;
}

/** Получить опубликованные работы */
export async function getPublishedWorks(): Promise<TranslatedWork[]> {
  const all = await getAllWorks();
  return all.filter(w => w.isPublished);
}

/** Получить работу по ID */
export async function getWorkById(id: string): Promise<TranslatedWork | undefined> {
  const all = await getAllWorks();
  return all.find(w => w.id === id);
}

/** Создать или обновить работу */
export async function upsertWork(work: TranslatedWork): Promise<boolean> {
  const custom = await getCustomWorks();

  if (!work.id) {
    work.id = (work.category || "work") + "-" + Date.now();
  }

  // Парсим теги
  if (typeof work.tags === "string") {
    work.tags = (work.tags as unknown as string)
      .split(/[,#\s]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);
  }
  if (!Array.isArray(work.tags)) {
    work.tags = [];
  }

  // Время чтения
  work.readingTime = Math.max(1, Math.ceil(
    (work.content || "").split(/\s+/).length / 200
  ));

  // Excerpt
  if (!work.excerpt && work.content) {
    work.excerpt = work.content.slice(0, 150).trim() + "...";
  }

  // Значения по умолчанию
  if (!work.views) work.views = 0;
  if (!work.likes) work.likes = 0;
  if (!work.translations) work.translations = {};
  if (!work.language) work.language = "ru";

  const idx = custom.findIndex(w => w.id === work.id);
  if (idx >= 0) {
    custom[idx] = { ...custom[idx], ...work };
  } else {
    // Проверяем дефолтную
    const def = initialWorks.find(w => w.id === work.id);
    if (def) {
      custom.push({ ...def, ...work });
    } else {
      custom.push(work);
    }
  }

  return saveCustomWorks(custom);
}

/** Удалить работу */
export async function deleteWork(id: string): Promise<boolean> {
  const custom = await getCustomWorks();
  const isDefault = initialWorks.some(w => w.id === id);
  const inCustom = custom.some(w => w.id === id);

  if (isDefault && !inCustom) return false;

  const filtered = custom.filter(w => w.id !== id);
  return saveCustomWorks(filtered);
}

/** Переключить публикацию */
export async function togglePublish(id: string): Promise<TranslatedWork | null> {
  const custom = await getCustomWorks();
  const idx = custom.findIndex(w => w.id === id);

  if (idx >= 0) {
    custom[idx].isPublished = !custom[idx].isPublished;
    custom[idx].updatedAt = new Date().toISOString();
    await saveCustomWorks(custom);
    return custom[idx];
  }

  const def = initialWorks.find(w => w.id === id);
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

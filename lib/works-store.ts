import { createClient } from "@vercel/kv";
import { works as defaultWorks } from "@/data/works";
import type { TranslatedWork } from "@/types";

const WORKS_KEY = "natalia:works";

/** Создаём KV клиент */
function getKV() {
  const url = process.env.STORAGE_URL
           || process.env.KV_REST_API_URL
           || process.env.KV_URL;
  const token = process.env.STORAGE_REST_API_TOKEN
             || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return createClient({ url, token });
}

/** Получить кастомные работы из Redis */
async function getCustomWorks(): Promise<TranslatedWork[]> {
  try {
    const kv = getKV();
    if (kv) {
      const works = await kv.get<TranslatedWork[]>(WORKS_KEY);
      return works || [];
    }
  } catch (e) {
    console.error("KV read error:", e);
  }
  return [];
}

/** Сохранить кастомные работы в Redis */
async function saveCustomWorks(works: TranslatedWork[]): Promise<boolean> {
  try {
    const kv = getKV();
    if (kv) {
      await kv.set(WORKS_KEY, works);
      return true;
    }
  } catch (e) {
    console.error("KV write error:", e);
  }
  return false;
}

/** Получить ВСЕ работы (кастомные + встроенные) */
export async function getAllWorks(): Promise<TranslatedWork[]> {
  const custom = await getCustomWorks();
  const customIds = new Set(custom.map(w => w.id));
  const defaults = defaultWorks.filter(w => !customIds.has(w.id));

  const all = [...custom, ...defaults];
  all.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return all;
}

/** Получить одну работу по ID */
export async function getWorkByIdAsync(id: string): Promise<TranslatedWork | undefined> {
  const all = await getAllWorks();
  return all.find(w => w.id === id);
}

/** Создать или обновить работу */
export async function upsertWork(work: TranslatedWork): Promise<boolean> {
  const custom = await getCustomWorks();

  // Генерируем ID если нет
  if (!work.id) {
    work.id = `${work.category}-${Date.now()}`;
  }

  // Парсим теги если строка
  if (typeof work.tags === "string") {
    work.tags = (work.tags as unknown as string)
      .split(/[,#\s]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);
  }

  // Считаем время чтения
  work.readingTime = Math.max(1, Math.ceil(
    (work.content || "").split(/\s+/).length / 200
  ));

  // Генерируем excerpt если нет
  if (!work.excerpt) {
    work.excerpt = (work.content || "").slice(0, 150).trim() + "...";
  }

  // Обновляем или добавляем
  const idx = custom.findIndex(w => w.id === work.id);
  if (idx >= 0) {
    custom[idx] = { ...custom[idx], ...work };
  } else {
    // Может это дефолтная работа — копируем
    const defaultWork = defaultWorks.find(w => w.id === work.id);
    if (defaultWork) {
      custom.push({ ...defaultWork, ...work });
    } else {
      custom.push(work);
    }
  }

  return saveCustomWorks(custom);
}

/** Удалить работу */
export async function deleteWork(id: string): Promise<boolean> {
  const custom = await getCustomWorks();

  // Проверяем не дефолтная ли
  const isDefault = defaultWorks.some(w => w.id === id);
  if (isDefault && !custom.some(w => w.id === id)) {
    return false; // нельзя удалить встроенную
  }

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

  // Дефолтная работа — копируем с изменённым статусом
  const defaultWork = defaultWorks.find(w => w.id === id);
  if (defaultWork) {
    const copy: TranslatedWork = {
      ...defaultWork,
      isPublished: !defaultWork.isPublished,
      updatedAt: new Date().toISOString(),
    };
    custom.push(copy);
    await saveCustomWorks(custom);
    return copy;
  }

  return null;
}

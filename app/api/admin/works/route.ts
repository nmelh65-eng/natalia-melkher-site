import { NextRequest, NextResponse } from "next/server";
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

/** Проверка авторизации */
function checkAuth(req: NextRequest): boolean {
  // Проверяем cookie
  const cookie = req.cookies.get("admin-token")?.value;
  const password = process.env.ADMIN_PASSWORD || "";
  if (cookie && password) {
    return cookie === Buffer.from(password).toString("base64");
  }
  // Проверяем header
  const auth = req.headers.get("authorization");
  if (auth) {
    return auth.replace("Bearer ", "") === password;
  }
  return false;
}

/** Получить ВСЕ работы (кастомные + дефолтные) */
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
    console.error("KV read error:", e);
  }
  return [...defaultWorks];
}

/** Получить только кастомные работы */
async function getCustomWorks(): Promise<TranslatedWork[]> {
  try {
    const kv = getKV();
    if (kv) {
      const works = await kv.get<TranslatedWork[]>(WORKS_KEY);
      return works || [];
    }
  } catch {}
  return [];
}

/** Сохранить кастомные работы */
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

/** GET — список всех работ для админки */
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allWorks = await getAllWorks();

  // Сортировка по дате (новые первые)
  allWorks.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({ data: allWorks });
}

/** POST — создать новое произведение */
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { error: "Заполните заголовок, содержимое и категорию" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const id = body.id || `${body.category}-${Date.now()}`;

    // Парсим теги
    let tags: string[] = [];
    if (body.tags) {
      if (typeof body.tags === "string") {
        tags = body.tags
          .split(/[,#\s]+/)
          .map((t: string) => t.trim())
          .filter((t: string) => t.length > 0);
      } else if (Array.isArray(body.tags)) {
        tags = body.tags;
      }
    }

    const newWork: TranslatedWork = {
      id,
      title: body.title.trim(),
      content: body.content,
      excerpt: body.excerpt || body.content.slice(0, 150).trim() + "...",
      category: body.category,
      tags,
      createdAt: body.createdAt || now,
      updatedAt: now,
      isPublished: body.isPublished !== false,
      language: body.language || "ru",
      readingTime: Math.max(1, Math.ceil(body.content.split(/\s+/).length / 200)),
      views: body.views || 0,
      likes: body.likes || 0,
      translations: body.translations || {},
    };

    const customWorks = await getCustomWorks();

    // Проверяем нет ли уже такого ID
    const existingIdx = customWorks.findIndex(w => w.id === id);
    if (existingIdx >= 0) {
      customWorks[existingIdx] = newWork;
    } else {
      customWorks.push(newWork);
    }

    const saved = await saveCustomWorks(customWorks);

    if (!saved) {
      return NextResponse.json(
        { error: "Не удалось сохранить. Проверьте подключение Redis." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newWork,
      message: "Произведение сохранено!",
    });
  } catch (error: any) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Ошибка: " + error.message },
      { status: 500 }
    );
  }
}

/** PATCH — переключить публикацию */
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const customWorks = await getCustomWorks();
    const idx = customWorks.findIndex(w => w.id === id);

    if (idx >= 0) {
      // Переключаем в кастомных
      customWorks[idx].isPublished = !customWorks[idx].isPublished;
      customWorks[idx].updatedAt = new Date().toISOString();
      await saveCustomWorks(customWorks);
      return NextResponse.json({ success: true, isPublished: customWorks[idx].isPublished });
    }

    // Если это дефолтная работа — копируем в кастомные с изменённым статусом
    const defaultWork = defaultWorks.find(w => w.id === id);
    if (defaultWork) {
      const copy = {
        ...defaultWork,
        isPublished: !defaultWork.isPublished,
        updatedAt: new Date().toISOString(),
      };
      customWorks.push(copy);
      await saveCustomWorks(customWorks);
      return NextResponse.json({ success: true, isPublished: copy.isPublished });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/** DELETE — удалить произведение */
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const customWorks = await getCustomWorks();
    const filtered = customWorks.filter(w => w.id !== id);

    // Проверяем что что-то удалилось
    if (filtered.length === customWorks.length) {
      // Может это дефолтная работа — нельзя удалить
      const isDefault = defaultWorks.some(w => w.id === id);
      if (isDefault) {
        return NextResponse.json(
          { error: "Нельзя удалить встроенное произведение" },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await saveCustomWorks(filtered);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/** PUT — обновить произведение */
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    let tags = body.tags;
    if (typeof tags === "string") {
      tags = tags.split(/[,#\s]+/).map((t: string) => t.trim()).filter((t: string) => t.length > 0);
    }

    const customWorks = await getCustomWorks();
    const idx = customWorks.findIndex(w => w.id === body.id);

    if (idx >= 0) {
      customWorks[idx] = {
        ...customWorks[idx],
        ...body,
        tags: tags || customWorks[idx].tags,
        updatedAt: new Date().toISOString(),
        readingTime: Math.max(1, Math.ceil(
          (body.content || customWorks[idx].content).split(/\s+/).length / 200
        )),
      };
    } else {
      // Может это дефолтная — копируем и обновляем
      const defaultWork = defaultWorks.find(w => w.id === body.id);
      if (defaultWork) {
        customWorks.push({
          ...defaultWork,
          ...body,
          tags: tags || defaultWork.tags,
          updatedAt: new Date().toISOString(),
        });
      } else {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    }

    await saveCustomWorks(customWorks);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

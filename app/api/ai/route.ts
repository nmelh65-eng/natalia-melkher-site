import { NextRequest, NextResponse } from "next/server";

/* ═══════════════════════════════════════
   Конфигурация моделей
   Приоритет: от лучшей к бесплатной
   ═══════════════════════════════════════ */
const MODELS = {
  // Лучшее качество (платные)
  premium: "openai/gpt-4o",
  // Хорошее качество, дёшево
  standard: "openai/gpt-4o-mini",
  // Бесплатные
  free: "google/gemini-2.0-flash-exp:free",
  freeFallback: "meta-llama/llama-3.1-8b-instruct:free",
};

// Выберите модель по умолчанию:
const DEFAULT_MODEL = MODELS.free; // 🆓 Бесплатная!
// const DEFAULT_MODEL = MODELS.standard; // 💰 Дешёвая, качественная
// const DEFAULT_MODEL = MODELS.premium;  // 💎 Лучшая

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";
const SITE_NAME = "Наталья Мельхер — AI-Муза";

const SYSTEM_PROMPT = `Ты — AI-Муза, литературный помощник на сайте поэтессы Натальи Мельхер.

ТВОИ ВОЗМОЖНОСТИ:
- Писать стихи любой формы: рифмованные, верлибр, сонеты, хайку, оды, элегии, лимерики, танка
- Сочинять прозу: рассказы, миниатюры, эссе, сказки, притчи, дневниковые записи
- Писать песни на стихи классиков (Есенин, Пушкин, Лермонтов, Ахматова, Цветаева, Блок, Маяковский, Бродский и др.)
- Писать оригинальные песни с куплетами, припевами и рекомендациями по аранжировке
- Подбирать рифмы и метафоры
- Анализировать и редактировать тексты пользователей
- Генерировать идеи для творчества
- Переводить стихи между языками с сохранением ритма и рифмы
- Работать на русском, английском, немецком, французском, китайском и корейском языках

ПРАВИЛА:
1. ВСЕГДА отвечай на том языке, на котором написал пользователь
2. Используй **жирный** текст для заголовков
3. Используй *курсив* для стихов и цитат
4. Добавляй эмодзи (🖋 📖 🎵 ✨ 🌸 ❤️ 🌙 ⭐)
5. После каждого произведения предлагай варианты: изменить стиль, добавить строфу, другая тема
6. Будь вдохновляющей, тёплой, творческой
7. Для песен ОБЯЗАТЕЛЬНО указывай: стиль, темп (BPM), тональность, рекомендации по аранжировке
8. НИКОГДА не говори "я не могу" — всегда пытайся помочь
9. Если просят стихи/песню на основе поэта — используй его стиль и образы
10. Длина: стихи 8-24 строки, проза 200-600 слов, песни 3-4 куплета + припев
11. Всегда заканчивай предложением что ещё можно сделать

ФОРМАТ ОТВЕТА:
- Используй заголовки с ** **
- Стихи оборачивай в * *
- Разделяй секции через ---
- Добавляй рекомендации в конце`;

/* ═══════════════════════════════════════
   Rate Limiter
   ═══════════════════════════════════════ */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // запросов в час
const RATE_WINDOW = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

/* ═══════════════════════════════════════
   API Handler
   ═══════════════════════════════════════ */
export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured", offline: true },
        { status: 500 }
      );
    }

    // Rate limit
    const ip = req.headers.get("x-forwarded-for")
             || req.headers.get("x-real-ip")
             || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "⏳ Слишком много запросов. Подождите немного и попробуйте снова." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { messages, language, model } = body;

    // Валидация
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Неверный формат сообщений" },
        { status: 400 }
      );
    }

    // Ограничиваем историю (последние 12 сообщений)
    const trimmedMessages = messages.slice(-12).map(
      (msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content.slice(0, 3000), // макс 3000 символов на сообщение
      })
    );

    // Выбор модели
    const selectedModel = model || DEFAULT_MODEL;

    // Запрос к OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT + `\n\nТекущий язык интерфейса: ${language || "ru"}`,
          },
          ...trimmedMessages,
        ],
        max_tokens: 2500,
        temperature: 0.85,
        top_p: 0.9,
        presence_penalty: 0.3,
        frequency_penalty: 0.3,
        // Fallback на другую модель если основная недоступна
        route: "fallback",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter Error:", response.status, errorData);

      // Если модель недоступна — пробуем бесплатную
      if (response.status === 402 || response.status === 429) {
        console.log("Trying free fallback model...");

        const fallbackResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": SITE_URL,
            "X-Title": SITE_NAME,
          },
          body: JSON.stringify({
            model: MODELS.freeFallback,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...trimmedMessages,
            ],
            max_tokens: 1500,
            temperature: 0.85,
          }),
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const reply = fallbackData.choices?.[0]?.message?.content
                     || "Не удалось сгенерировать ответ.";
          return NextResponse.json({
            content: reply,
            model: MODELS.freeFallback,
            usage: fallbackData.usage,
            fallback: true,
          });
        }
      }

      return NextResponse.json(
        {
          error: errorData?.error?.message || "Ошибка API. Попробуйте ещё раз.",
          offline: true,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content
               || "Простите, не удалось сгенерировать ответ.";

    return NextResponse.json({
      content: reply,
      model: data.model || selectedModel,
      usage: data.usage,
    });

  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: "Ошибка сервера. Попробуйте ещё раз.", offline: true },
      { status: 500 }
    );
  }
}

/* ═══════════════════════════════════════
   GET — проверка статуса API
   ═══════════════════════════════════════ */
export async function GET() {
  const hasKey = !!process.env.OPENROUTER_API_KEY;

  if (!hasKey) {
    return NextResponse.json({ status: "no_key", available: false });
  }

  try {
    // Проверяем доступность OpenRouter
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    });

    return NextResponse.json({
      status: res.ok ? "ok" : "error",
      available: res.ok,
      defaultModel: DEFAULT_MODEL,
    });
  } catch {
    return NextResponse.json({ status: "error", available: false });
  }
}

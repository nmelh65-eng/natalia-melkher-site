import { NextRequest, NextResponse } from "next/server";
import { generateText, type CoreMessage } from "ai";
import { createGateway, gateway as defaultGateway } from "@ai-sdk/gateway";
import { getClientIp } from "@/lib/client-ip";
import { getPublicSiteUrl } from "@/lib/site-url";
import {
  AI_MODEL_OPTIONS,
  DEFAULT_AI_MODEL,
  OPENROUTER_DEFAULT_MODEL,
  OPENROUTER_FALLBACK_MODEL,
} from "@/lib/ai-models";

const ALLOWED_MODELS = new Set(AI_MODEL_OPTIONS.map((m) => m.id));

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
4. НЕ используй эмодзи и декоративные символы — только текст и типографика
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
- Добавляй рекомендации в конце (без эмодзи)`;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60 * 60 * 1000;

const ALLOWED_ROLES = new Set(["user", "assistant"]);

function useAiGateway(): boolean {
  const onVercel = process.env.VERCEL === "1";
  const hasGatewayKey = !!process.env.AI_GATEWAY_API_KEY?.trim();
  return onVercel || hasGatewayKey;
}

function getGateway() {
  const key = process.env.AI_GATEWAY_API_KEY?.trim();
  return key ? createGateway({ apiKey: key }) : defaultGateway;
}

function normalizeMessages(
  messages: unknown
): { role: string; content: string }[] | null {
  if (!Array.isArray(messages) || messages.length === 0) return null;

  const out: { role: string; content: string }[] = [];

  for (const msg of messages) {
    if (!msg || typeof msg !== "object") return null;
    const role = (msg as { role?: unknown }).role;
    const content = (msg as { content?: unknown }).content;
    if (typeof role !== "string" || !ALLOWED_ROLES.has(role)) return null;
    if (typeof content !== "string") return null;
    out.push({ role, content });
  }

  return out;
}

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

function resolveModel(requested: unknown, gatewayMode: boolean): string {
  if (
    typeof requested === "string" &&
    requested.length > 0 &&
    requested.length < 120 &&
    ALLOWED_MODELS.has(requested)
  ) {
    return requested;
  }
  return gatewayMode ? DEFAULT_AI_MODEL : OPENROUTER_DEFAULT_MODEL;
}

function buildSystemPrompt(language: unknown): string {
  const lang =
    typeof language === "string" && language.length < 24 ? language : "ru";
  return `${SYSTEM_PROMPT}\n\nТекущий язык интерфейса: ${lang}`;
}

export async function POST(req: NextRequest) {
  try {
    const siteUrl = getPublicSiteUrl();
    const ip = getClientIp(req);

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Слишком много запросов. Подождите немного и попробуйте снова." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { messages, language, model } = body;

    const normalized = normalizeMessages(messages);
    if (!normalized) {
      return NextResponse.json(
        { error: "Неверный формат сообщений" },
        { status: 400 }
      );
    }

    const trimmed = normalized.slice(-12).map((msg) => ({
      role: msg.role,
      content: msg.content.slice(0, 3000),
    }));

    const gatewayMode = useAiGateway();
    const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();

    if (gatewayMode) {
      const selectedModel = resolveModel(model, true);
      const system = buildSystemPrompt(language);
      const coreMessages: CoreMessage[] = trimmed.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      try {
        const gw = getGateway();
        const { text, usage } = await generateText({
          model: gw(selectedModel),
          system,
          messages: coreMessages,
          maxOutputTokens: 2500,
          temperature: 0.85,
          topP: 0.9,
          presencePenalty: 0.3,
          frequencyPenalty: 0.3,
        });

        return NextResponse.json({
          content: text || "Простите, не удалось сгенерировать ответ.",
          model: selectedModel,
          usage,
          provider: "gateway",
        });
      } catch (e) {
        console.error("AI Gateway Error:", e);
        if (!openRouterKey) {
          return NextResponse.json(
            {
              error: "Ошибка AI Gateway. Попробуйте ещё раз.",
              offline: true,
            },
            { status: 502 }
          );
        }
        /* fall through to OpenRouter below */
      }
    }

    if (!openRouterKey) {
      return NextResponse.json(
        { error: "API key not configured", offline: true },
        { status: 500 }
      );
    }

    const selectedModel = resolveModel(model, false);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": siteUrl,
        "X-Title": SITE_NAME,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: "system", content: buildSystemPrompt(language) },
          ...trimmed,
        ],
        max_tokens: 2500,
        temperature: 0.85,
        top_p: 0.9,
        presence_penalty: 0.3,
        frequency_penalty: 0.3,
        route: "fallback",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter Error:", response.status, errorData);

      if (response.status === 402 || response.status === 429) {
        const fallbackResponse = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openRouterKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": siteUrl,
              "X-Title": SITE_NAME,
            },
            body: JSON.stringify({
              model: OPENROUTER_FALLBACK_MODEL,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...trimmed,
              ],
              max_tokens: 1500,
              temperature: 0.85,
            }),
          }
        );

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const reply =
            fallbackData.choices?.[0]?.message?.content ||
            "Не удалось сгенерировать ответ.";
          return NextResponse.json({
            content: reply,
            model: OPENROUTER_FALLBACK_MODEL,
            usage: fallbackData.usage,
            fallback: true,
            provider: "openrouter",
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
    const reply =
      data.choices?.[0]?.message?.content ||
      "Простите, не удалось сгенерировать ответ.";

    return NextResponse.json({
      content: reply,
      model: data.model || selectedModel,
      usage: data.usage,
      provider: "openrouter",
    });
  } catch (error: unknown) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: "Ошибка сервера. Попробуйте ещё раз.", offline: true },
      { status: 500 }
    );
  }
}

export async function GET() {
  const gateway = useAiGateway();
  const openRouter = !!process.env.OPENROUTER_API_KEY?.trim();

  const ok = gateway || openRouter;
  const provider = gateway ? "gateway" : openRouter ? "openrouter" : null;

  return NextResponse.json({ ok, provider });
}

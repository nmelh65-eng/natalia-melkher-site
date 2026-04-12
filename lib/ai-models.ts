/**
 * Идентификаторы моделей в формате AI Gateway (`provider/model`).
 * Для fallback OpenRouter используйте те же id там, где провайдер совпадает.
 */
export const DEFAULT_AI_MODEL = "google/gemini-2.5-flash";

export type AiModelOption = {
  id: string;
  name: string;
  badge: string;
  desc: string;
};

export const AI_MODEL_OPTIONS: readonly AiModelOption[] = [
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    badge: "Fast",
    desc: "Быстрая",
  },
  {
    id: "meta/llama-3.3-70b",
    name: "Llama 3.3 70B",
    badge: "Open",
    desc: "Открытая",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o mini",
    badge: "Fast",
    desc: "Быстрая",
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    badge: "Pro",
    desc: "Лучшая",
  },
  {
    id: "anthropic/claude-3.5-haiku",
    name: "Claude 3.5 Haiku",
    badge: "Pro",
    desc: "Премиум",
  },
] as const;

/** Модель по умолчанию для OpenRouter, если выбранный id недоступен */
export const OPENROUTER_DEFAULT_MODEL = "openai/gpt-4o-mini";

export const OPENROUTER_FALLBACK_MODEL = "meta-llama/llama-3.1-8b-instruct:free";

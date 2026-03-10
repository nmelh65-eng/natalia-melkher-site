"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface AIWritingAgentProps {
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  model?: string;
}

/* ═══════════════════════════════════════
   Доступные модели для выбора
   ═══════════════════════════════════════ */
const AI_MODELS = [
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini Flash", badge: "🆓", desc: "Бесплатная" },
  { id: "meta-llama/llama-3.1-8b-instruct:free", name: "Llama 3.1", badge: "🆓", desc: "Бесплатная" },
  { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B", badge: "🆓", desc: "Бесплатная" },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", badge: "⚡", desc: "Быстрая" },
  { id: "openai/gpt-4o", name: "GPT-4o", badge: "💎", desc: "Лучшая" },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5", badge: "💎", desc: "Премиум" },
];

/* ═══════════════════════════════════════
   UI-тексты
   ═══════════════════════════════════════ */
const UI: Record<string, {
  title: string; subtitle: string; placeholder: string;
  send: string; thinking: string; suggestions: string;
  clear: string; copy: string; copied: string;
  greeting: string; disclaimer: string;
  errorMsg: string; modelLabel: string;
  prompts: string[];
}> = {
  ru: {
    title: "AI-Муза",
    subtitle: "Литературный помощник",
    placeholder: "Напишите запрос... (Shift+Enter — новая строка)",
    send: "→", thinking: "Сочиняю...",
    suggestions: "💡 Идеи для вдохновения:",
    clear: "🗑", copy: "📋", copied: "✅",
    modelLabel: "Модель:",
    greeting: "Здравствуйте! ✨ Я **AI-Муза** — ваш литературный помощник, работающий на передовых нейросетях.\n\nЯ умею:\n\n🖋 **Писать стихи** — любой формы: сонеты, хайку, оды, элегии\n📖 **Сочинять прозу** — рассказы, эссе, сказки, миниатюры\n🎵 **Писать песни** — на стихи классиков и оригинальные\n🔤 **Подбирать рифмы** — с примерами использования\n✏️ **Редактировать** — анализ и улучшение ваших текстов\n🌍 **6 языков** — русский, English, Deutsch, Français, 中文, 한국어\n💡 **Идеи** — генерация тем и образов\n\n🤖 Вы можете выбрать AI-модель в заголовке чата!\n\nПросто опишите, что хотите создать!",
    disclaimer: "AI-Муза • Powered by OpenRouter",
    errorMsg: "Ошибка. Переключаюсь в офлайн-режим...",
    prompts: [
      "Напиши стихотворение о весне 🌸",
      "Песня на стихи Есенина 🎵",
      "Рассказ о любви ❤️",
      "Хайку о море 🌊",
      "Рифмы к слову «мечта» 🔤",
      "Сонет о звёздах ⭐",
    ],
  },
  en: {
    title: "AI Muse",
    subtitle: "Literary Assistant",
    placeholder: "Type your request... (Shift+Enter — new line)",
    send: "→", thinking: "Composing...",
    suggestions: "💡 Ideas:",
    clear: "🗑", copy: "📋", copied: "✅",
    modelLabel: "Model:",
    greeting: "Hello! ✨ I'm **AI Muse** — your literary assistant powered by cutting-edge AI.\n\nI can:\n\n🖋 **Write poetry** — sonnets, haiku, odes, free verse\n📖 **Compose prose** — stories, essays, fairy tales\n🎵 **Write songs** — based on classic poets or original\n🔤 **Find rhymes** — with usage examples\n✏️ **Edit** — analyze and improve your texts\n🌍 **6 languages**\n\n🤖 You can select the AI model in the chat header!\n\nJust describe what you'd like to create!",
    disclaimer: "AI Muse • Powered by OpenRouter",
    errorMsg: "Error. Switching to offline mode...",
    prompts: [
      "Write a poem about spring 🌸",
      "Song based on Yesenin 🎵",
      "A love story ❤️",
      "Haiku about the sea 🌊",
      "Rhymes for 'dream' 🔤",
      "Sonnet about stars ⭐",
    ],
  },
  de: {
    title: "KI-Muse", subtitle: "Literarischer Assistent",
    placeholder: "Anfrage eingeben...", send: "→", thinking: "Komponiere...",
    suggestions: "💡 Ideen:", clear: "🗑", copy: "📋", copied: "✅",
    modelLabel: "Modell:",
    greeting: "Hallo! ✨ Ich bin **KI-Muse**.\n\nBeschreiben Sie, was Sie schreiben möchten!",
    disclaimer: "KI-Muse • OpenRouter", errorMsg: "Fehler...",
    prompts: ["Gedicht über Frühling 🌸", "Ein Lied schreiben 🎵", "Reime finden 🔤"],
  },
  fr: {
    title: "IA Muse", subtitle: "Assistant littéraire",
    placeholder: "Votre demande...", send: "→", thinking: "Je compose...",
    suggestions: "💡 Idées :", clear: "🗑", copy: "📋", copied: "✅",
    modelLabel: "Modèle :",
    greeting: "Bonjour ! ✨ Je suis **IA Muse**.\n\nDécrivez ce que vous souhaitez écrire !",
    disclaimer: "IA Muse • OpenRouter", errorMsg: "Erreur...",
    prompts: ["Poème sur le printemps 🌸", "Écrire une chanson 🎵", "Trouver des rimes 🔤"],
  },
  zh: {
    title: "AI缪斯", subtitle: "文学助手",
    placeholder: "输入请求...", send: "→", thinking: "创作中...",
    suggestions: "💡：", clear: "🗑", copy: "📋", copied: "✅",
    modelLabel: "模型：",
    greeting: "你好！✨ 我是 **AI缪斯**。\n\n描述您想创作什么！",
    disclaimer: "AI缪斯 • OpenRouter", errorMsg: "错误...",
    prompts: ["春天的诗 🌸", "写一首歌 🎵", "押韵 🔤"],
  },
  ko: {
    title: "AI 뮤즈", subtitle: "문학 도우미",
    placeholder: "요청 입력...", send: "→", thinking: "작곡 중...",
    suggestions: "💡:", clear: "🗑", copy: "📋", copied: "✅",
    modelLabel: "모델:",
    greeting: "안녕하세요! ✨ **AI 뮤즈**입니다.\n\n무엇을 만들고 싶은지 설명해주세요!",
    disclaimer: "AI 뮤즈 • OpenRouter", errorMsg: "오류...",
    prompts: ["봄에 대한 시 🌸", "노래 쓰기 🎵", "운율 찾기 🔤"],
  },
};

/* ═══════════════════════════════════════
   Офлайн fallback
   ═══════════════════════════════════════ */
function matchAny(t: string, k: string[]): boolean { return k.some(x => t.includes(x)); }

function offlineResponse(input: string): string {
  const q = input.toLowerCase();
  if (matchAny(q, ["весн", "spring"])) return "🌸 **Весна**\n\n*Апрель раскрыл ладони —*\n*И солнце потекло рекой,*\n*И в каждом тихом стоне*\n*Ветвей звучит: «Живой!»*\n\n---\n📴 Офлайн-режим";
  if (matchAny(q, ["любов", "love"])) return "❤️ **О любви**\n\n*Между нами — не расстоянье,*\n*А созвездие тихих слов.*\n\n---\n📴 Офлайн-режим";
  if (matchAny(q, ["есенин", "yesenin"])) return "🎵 **В стиле Есенина**\n\n*Отговорила роща золотая*\n*Берёзовым, весёлым языком...*\n\n---\n📴 Офлайн-режим";
  return "✨ Интересная тема!\n\n*Тишина обнимает слова,*\n*Что рождаются тихо внутри...*\n\n---\n📴 Офлайн-режим. Подключите API для полных ответов.";
}

/* ═══════════════════════════════════════
   Компонент
   ═══════════════════════════════════════ */
export default function AIWritingAgent({ onClose }: AIWritingAgentProps) {
  const { language } = useLanguage();
  const lang = language || "ru";
  const ui = UI[lang] || UI.ru;

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: ui.greeting },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
  const [showModelPicker, setShowModelPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Фокус
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 300); }, []);

  // Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  // Блокировка скролла
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Проверка API
  useEffect(() => {
    fetch("/api/ai")
      .then(r => r.json())
      .then(data => {
        setApiStatus(data.available ? "online" : "offline");
        if (data.defaultModel) {
          setSelectedModel(data.defaultModel);
        }
      })
      .catch(() => setApiStatus("offline"));
  }, []);

  // Отправка сообщения
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isThinking) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsThinking(true);

    if (apiStatus === "offline") {
      await new Promise(r => setTimeout(r, 500 + Math.random() * 700));
      const reply = offlineResponse(text);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      setIsThinking(false);
      return;
    }

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated
            .filter((_, i) => i > 0) // убираем greeting
            .map(m => ({ role: m.role, content: m.content })),
          language: lang,
          model: selectedModel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "API error");
      }

      const modelName = AI_MODELS.find(m => m.id === (data.model || selectedModel))?.name || "";

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.content,
        model: modelName,
      }]);

      if (data.fallback) {
        setApiStatus("online"); // всё ещё онлайн, просто сменили модель
      }
    } catch (error: any) {
      console.warn("API error:", error);

      // Fallback на офлайн
      const reply = offlineResponse(text);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `⚠️ ${ui.errorMsg}\n\n${reply}`,
      }]);
      setApiStatus("offline");
    }

    setIsThinking(false);
  }, [isThinking, messages, apiStatus, lang, selectedModel, ui.errorMsg]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const copyMessage = async (text: string, idx: number) => {
    const clean = text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/#{1,3}\s/g, "");
    try { await navigator.clipboard.writeText(clean); } catch {
      const ta = document.createElement("textarea");
      ta.value = clean; document.body.appendChild(ta);
      ta.select(); document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: ui.greeting }]);
    setShowModelPicker(false);
  };

  /** Рендер markdown */
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={i} className="text-emerald-300 font-semibold">{part.slice(2, -2)}</strong>;
      if (part.startsWith("*") && part.endsWith("*"))
        return <em key={i} className="text-gray-400">{part.slice(1, -1)}</em>;
      return <span key={i}>{part}</span>;
    });
  };

  const currentModel = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
         role="dialog" aria-modal="true" aria-label={ui.title}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full sm:w-[500px] md:w-[580px]
                      h-[94vh] sm:h-[82vh] sm:max-h-[780px]
                      bg-gray-950/98 backdrop-blur-xl border border-white/10
                      rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden
                      shadow-2xl shadow-emerald-500/10 animate-slide-up">

        {/* ═══════ Header ═══════ */}
        <div className="shrink-0 border-b border-white/10 bg-gray-950/50">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3">
            <div className="flex items-center gap-3">
              {/* Иконка */}
              <div className="relative w-10 h-10 rounded-2xl
                              bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500
                              flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1v4a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-4H7a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z"/>
                  <circle cx="9.5" cy="10" r="1" fill="currentColor"/>
                  <circle cx="14.5" cy="10" r="1" fill="currentColor"/>
                  <path d="M9.5 15a3.5 3.5 0 0 0 5 0"/>
                </svg>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-950
                  ${apiStatus === "online" ? "bg-green-400" : apiStatus === "offline" ? "bg-amber-400" : "bg-gray-500 animate-pulse"}`} />
              </div>
              <div>
                <h2 className="font-display font-bold text-white text-sm sm:text-base leading-tight">
                  {ui.title}
                </h2>
                <p className="text-[10px] text-emerald-400/60">
                  {apiStatus === "online" ? `⚡ ${currentModel.name}` : apiStatus === "offline" ? "📴 offline" : "..."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Выбор модели */}
              <button onClick={() => setShowModelPicker(!showModelPicker)}
                className="px-2 py-1.5 rounded-xl text-[10px] text-gray-500
                           hover:text-gray-300 hover:bg-white/5 transition-all"
                title={ui.modelLabel}>
                🧠
              </button>
              <button onClick={clearChat}
                className="px-2 py-1.5 rounded-xl text-[10px] text-gray-500
                           hover:text-gray-300 hover:bg-white/5 transition-all">
                {ui.clear}
              </button>
              <button onClick={onClose} aria-label="Закрыть"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500
                           hover:text-white hover:bg-white/10 transition-all
                           focus:outline-none focus:ring-2 focus:ring-emerald-400">
                ✕
              </button>
            </div>
          </div>

          {/* Model Picker */}
          {showModelPicker && (
            <div className="px-4 pb-3 border-t border-white/5">
              <p className="text-[10px] text-gray-500 mb-2 mt-2">{ui.modelLabel}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {AI_MODELS.map(m => (
                  <button key={m.id}
                    onClick={() => { setSelectedModel(m.id); setShowModelPicker(false); }}
                    className={`px-2.5 py-2 rounded-xl text-left text-[11px] transition-all
                      ${selectedModel === m.id
                        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                        : "bg-white/[0.02] border border-white/5 text-gray-400 hover:bg-white/5"}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{m.badge} {m.name}</span>
                    </div>
                    <span className="text-[9px] text-gray-600">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ═══════ Messages ═══════ */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3 scrollbar-thin overscroll-contain">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="relative group max-w-[92%] sm:max-w-[85%]">
                <div
                  className={`rounded-2xl px-3 sm:px-4 py-2.5 text-[13px] sm:text-sm leading-relaxed
                    ${msg.role === "user"
                      ? "bg-purple-600/80 text-white rounded-br-md"
                      : "bg-white/[0.03] text-gray-300 border border-white/5 rounded-bl-md"}`}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {renderText(msg.content)}
                </div>
                {/* Модель + копирование */}
                {msg.role === "assistant" && i > 0 && (
                  <div className="flex items-center justify-between mt-1 px-1
                                  opacity-0 group-hover:opacity-100 sm:opacity-60
                                  sm:hover:opacity-100 transition-opacity">
                    {msg.model && (
                      <span className="text-[9px] text-gray-700">🤖 {msg.model}</span>
                    )}
                    <button onClick={() => copyMessage(msg.content, i)}
                      className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors">
                      {copiedIdx === i ? ui.copied : ui.copy}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[11px] text-gray-500">{ui.thinking}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ═══════ Suggestions ═══════ */}
        {messages.length <= 1 && (
          <div className="px-3 sm:px-4 pb-2 shrink-0">
            <p className="text-[10px] text-gray-600 mb-1.5">{ui.suggestions}</p>
            <div className="flex flex-wrap gap-1.5">
              {ui.prompts.map((p, i) => (
                <button key={i} onClick={() => sendMessage(p.replace(/\s[^\s]*$/, ""))}
                  className="px-2.5 py-1 rounded-xl text-[10px]
                             bg-emerald-500/10 border border-emerald-500/20
                             text-emerald-400 hover:bg-emerald-500/20
                             active:scale-95 transition-all">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════ Input ═══════ */}
        <form onSubmit={handleSubmit}
              className="px-3 sm:px-4 py-2.5 border-t border-white/10 bg-gray-950/50 shrink-0">
          <div className="flex items-end gap-2">
            <textarea ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={ui.placeholder} rows={1}
              className="flex-1 resize-none px-3 sm:px-4 py-2.5
                         rounded-2xl bg-white/5 border border-white/10
                         text-gray-200 placeholder-gray-600
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                         text-[13px] sm:text-sm max-h-28"
              style={{ height: "auto", minHeight: "42px" }}
              onInput={e => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 112) + "px";
              }}
            />
            <button type="submit" disabled={!input.trim() || isThinking}
              className="w-10 h-10 rounded-2xl shrink-0
                         bg-gradient-to-r from-emerald-500 to-teal-600
                         text-white text-lg flex items-center justify-center
                         hover:scale-105 active:scale-95
                         disabled:opacity-30 transition-all
                         focus:outline-none focus:ring-2 focus:ring-emerald-400">
              ➤
            </button>
          </div>
          <p className="text-[9px] text-gray-700 text-center mt-1.5">{ui.disclaimer}</p>
        </form>
      </div>
    </div>
  );
}

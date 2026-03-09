"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface AIWritingAgentProps {
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

const WRITING_PROMPTS: Record<string, string[]> = {
  ru: [
    "Напиши стихотворение о весне",
    "Помоги написать рассказ о любви",
    "Напиши хайку о море",
    "Сочини сонет о звёздах",
    "Напиши эссе о вдохновении",
    "Помоги с рифмой к слову «мечта»",
  ],
  en: [
    "Write a poem about spring",
    "Help me write a love story",
    "Write a haiku about the sea",
    "Compose a sonnet about stars",
    "Write an essay about inspiration",
    "Help me rhyme the word 'dream'",
  ],
  de: [
    "Schreibe ein Gedicht über den Frühling",
    "Hilf mir, eine Liebesgeschichte zu schreiben",
    "Schreibe ein Haiku über das Meer",
  ],
  fr: [
    "Écris un poème sur le printemps",
    "Aide-moi à écrire une histoire d'amour",
    "Écris un haïku sur la mer",
  ],
  zh: [
    "写一首关于春天的诗",
    "帮我写一个爱情故事",
    "写一首关于大海的俳句",
  ],
  ko: [
    "봄에 대한 시를 써줘",
    "사랑 이야기를 쓰는 것을 도와줘",
    "바다에 대한 하이쿠를 써줘",
  ],
};

const UI_TEXT: Record<string, {
  title: string;
  subtitle: string;
  placeholder: string;
  send: string;
  thinking: string;
  suggestions: string;
  clear: string;
  greeting: string;
  disclaimer: string;
}> = {
  ru: {
    title: "AI-Помощник",
    subtitle: "Помощь в написании стихов и прозы",
    placeholder: "Опишите, что хотите написать...",
    send: "Отправить",
    thinking: "Думаю...",
    suggestions: "Попробуйте:",
    clear: "Очистить",
    greeting: "Здравствуйте! Я AI-помощник для написания литературных произведений. Я могу помочь вам:\n\n✨ Написать стихотворение на любую тему\n📖 Сочинить рассказ или эссе\n🎭 Подобрать рифмы и метафоры\n✏️ Отредактировать и улучшить текст\n💡 Подсказать идеи для вдохновения\n\nО чём бы вы хотели написать?",
    disclaimer: "AI генерирует текст. Результат рекомендуется проверять и редактировать.",
  },
  en: {
    title: "AI Assistant",
    subtitle: "Help with writing poetry and prose",
    placeholder: "Describe what you'd like to write...",
    send: "Send",
    thinking: "Thinking...",
    suggestions: "Try:",
    clear: "Clear",
    greeting: "Hello! I'm an AI writing assistant. I can help you:\n\n✨ Write poetry on any topic\n📖 Compose stories and essays\n🎭 Find rhymes and metaphors\n✏️ Edit and improve your text\n💡 Suggest ideas for inspiration\n\nWhat would you like to write about?",
    disclaimer: "AI generates text. Results should be reviewed and edited.",
  },
  de: {
    title: "KI-Assistent",
    subtitle: "Hilfe beim Schreiben von Gedichten und Prosa",
    placeholder: "Beschreiben Sie, was Sie schreiben möchten...",
    send: "Senden",
    thinking: "Denke nach...",
    suggestions: "Versuchen Sie:",
    clear: "Löschen",
    greeting: "Hallo! Ich bin ein KI-Schreibassistent. Ich kann Ihnen helfen, Gedichte und Prosa zu schreiben.\n\nWorüber möchten Sie schreiben?",
    disclaimer: "KI generiert Text. Ergebnisse sollten überprüft werden.",
  },
  fr: {
    title: "Assistant IA",
    subtitle: "Aide à l'écriture de poésie et de prose",
    placeholder: "Décrivez ce que vous souhaitez écrire...",
    send: "Envoyer",
    thinking: "Je réfléchis...",
    suggestions: "Essayez :",
    clear: "Effacer",
    greeting: "Bonjour ! Je suis un assistant IA pour l'écriture. Je peux vous aider à écrire des poèmes et de la prose.\n\nDe quoi aimeriez-vous écrire ?",
    disclaimer: "L'IA génère du texte. Les résultats doivent être vérifiés.",
  },
  zh: {
    title: "AI助手",
    subtitle: "诗歌和散文写作帮助",
    placeholder: "描述您想写什么...",
    send: "发送",
    thinking: "思考中...",
    suggestions: "试试：",
    clear: "清除",
    greeting: "你好！我是AI写作助手。我可以帮助你写诗歌和散文。\n\n你想写什么？",
    disclaimer: "AI生成文本，建议检查和编辑结果。",
  },
  ko: {
    title: "AI 도우미",
    subtitle: "시와 산문 작성 도움",
    placeholder: "무엇을 쓰고 싶은지 설명해주세요...",
    send: "보내기",
    thinking: "생각 중...",
    suggestions: "시도해보세요:",
    clear: "지우기",
    greeting: "안녕하세요! AI 작문 도우미입니다. 시와 산문을 쓰는 데 도움을 드릴 수 있습니다.\n\n무엇에 대해 쓰고 싶으신가요?",
    disclaimer: "AI가 텍스트를 생성합니다. 결과를 검토하고 편집하는 것이 좋습니다.",
  },
};

// Локальная генерация (без API — работает офлайн)
function generateLocalResponse(input: string, lang: string): string {
  const q = input.toLowerCase();

  // Детекция темы
  const themes: Record<string, { ru: string; en: string }> = {
    весн: {
      ru: "🌸 Вот стихотворение о весне:\n\n**Пробуждение**\n\nОпять весна сквозит теплом,\nИ тают льды на тихих реках,\nИ каждый куст становится крылом,\nНесущим свет в грядущих веках.\n\nБерёза шепчет: «Я жива!»\nИ соловей поёт от счастья,\nИ первая зелёная трава\nВстаёт навстречу солнцу — в настье.\n\n---\n*Хотите, я помогу доработать этот текст или напишу другой вариант?*",
      en: "🌸 Here's a poem about spring:\n\n**Awakening**\n\nThe warmth of spring seeps through the air,\nAnd ice dissolves on quiet streams,\nEach bud becomes a wing so fair,\nCarrying light through future dreams.\n\n---\n*Would you like me to refine this or write another version?*",
    },
    люб: {
      ru: "❤️ Вот стихотворение о любви:\n\n**Между строк**\n\nМежду строк моих стихов —\nТвоё имя, тихий вздох,\nТысяча несказанных слов\nИ один нечаянный вдох.\n\nЯ пишу тебе письмо\nИз чернил и лунных бликов,\nКаждое слово — как весло\nНа реке из тихих криков.\n\n---\n*Хотите продолжение или другую форму?*",
      en: "❤️ Here's a love poem:\n\n**Between the Lines**\n\nBetween the lines of every verse —\nYour name, a whispered sigh,\nA thousand words I can't rehearse\nAnd one unplanned goodbye.\n\n---\n*Would you like me to continue or try a different style?*",
    },
    мор: {
      ru: "🌊 Хайку о море:\n\n**Морское дыхание**\n\nВолна коснулась —\nПесок хранит её след.\nВечность в момент.\n\n---\n\nЕщё одно:\n\nСиний простор —\nОт горизонта до глаз\nТолько тоска.\n\n---\n*Хотите больше хайку или другую форму стиха?*",
      en: "🌊 Haiku about the sea:\n\n**Sea Breath**\n\nThe wave has touched —\nSand holds the memory still.\nEternity, brief.\n\n---\n*Would you like more haiku or a different form?*",
    },
    звёзд: {
      ru: "⭐ Сонет о звёздах:\n\n**Звёздный сонет**\n\nКогда ночной покров укроет мир,\nИ звёзды загорятся в высоте,\nЯ слышу тихий космоса клавир,\nИграющий мелодию в темноте.\n\nКаждая звезда — как нота в хоре,\nЧто пел до нас и будет петь потом,\nВ бескрайнем, вечном звёздном море\nМы все — лишь капля в океане том.\n\n---\n*Хотите, я допишу до полного сонета (14 строк)?*",
      en: "⭐ A sonnet about stars:\n\n**Stellar Sonnet**\n\nWhen night's dark curtain covers all the world,\nAnd stars ignite across the endless height,\nI hear the cosmic melody unfurled,\nA quiet symphony within the night.\n\n---\n*Would you like me to complete the full 14-line sonnet?*",
    },
    рифм: {
      ru: "🎵 **Помощь с рифмами:**\n\nРифмы к слову **«мечта»**:\n• Красота, высота, простота\n• Суета, доброта, пустота\n• Навсегда (ассонансная)\n• Слова, голова (приблизительные)\n\nРифмы к слову **«душа»**:\n• Хороша, не спеша, малыша\n• Тишина (ассонансная)\n\nРифмы к слову **«любовь»**:\n• Вновь, бровь, кровь, морковь\n• Слов, готов (приблизительные)\n\n---\n*Напишите слово, к которому нужна рифма, и я подберу варианты!*",
      en: "🎵 **Rhyme help:**\n\nRhymes for **'dream'**:\n• Stream, beam, gleam, cream, theme\n• Seem, team, extreme, supreme\n\nRhymes for **'love'**:\n• Above, dove, shove, of\n• Enough, tough (slant rhymes)\n\n---\n*Tell me a word and I'll find rhymes for you!*",
    },
  };

  // Ищем совпадение с темой
  for (const [key, value] of Object.entries(themes)) {
    if (q.includes(key)) {
      return lang === "en" ? value.en : value.ru;
    }
  }

  // Английские ключевые слова
  const enThemes: Record<string, string> = {
    spring: themes["весн"].en,
    love: themes["люб"].en,
    sea: themes["мор"].en,
    ocean: themes["мор"].en,
    star: themes["звёзд"].en,
    rhym: themes["рифм"].en,
  };

  for (const [key, value] of Object.entries(enThemes)) {
    if (q.includes(key)) return value;
  }

  // Общий ответ
  if (lang === "ru" || lang === "de" || lang === "fr" || lang === "zh" || lang === "ko") {
    return `✨ Отличная идея! Давайте поработаем над этим.\n\nЧтобы помочь вам лучше, расскажите:\n\n1. **Жанр** — стихотворение, рассказ, эссе, хайку, сонет?\n2. **Настроение** — радостное, грустное, философское, романтическое?\n3. **Длина** — короткое (4-8 строк) или длинное?\n4. **Особые пожелания** — рифма, ритм, конкретные образы?\n\n*Чем подробнее опишете, тем лучше получится результат!*`;
  }

  return `✨ Great idea! Let's work on this.\n\nTo help you better, please tell me:\n\n1. **Genre** — poem, story, essay, haiku, sonnet?\n2. **Mood** — joyful, sad, philosophical, romantic?\n3. **Length** — short (4-8 lines) or long?\n4. **Special requests** — rhyme, rhythm, specific imagery?\n\n*The more detail you provide, the better the result!*`;
}

export default function AIWritingAgent({ onClose }: AIWritingAgentProps) {
  const { language } = useLanguage();
  const lang = language || "ru";
  const ui = UI_TEXT[lang] || UI_TEXT.ru;
  const prompts = WRITING_PROMPTS[lang] || WRITING_PROMPTS.ru;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: ui.greeting,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Закрытие по Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;

    const userMsg: Message = {
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    // Имитация задержки "думания"
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1500));

    const response = generateLocalResponse(text, lang);

    const assistantMsg: Message = {
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsThinking(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: ui.greeting,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={ui.title}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full sm:w-[480px] md:w-[560px]
                   h-[85vh] sm:h-[75vh] sm:max-h-[700px]
                   bg-gray-950/95 backdrop-blur-xl
                   border border-white/10
                   rounded-t-3xl sm:rounded-3xl
                   flex flex-col overflow-hidden
                   shadow-2xl shadow-emerald-500/10
                   animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600
                         flex items-center justify-center text-lg"
            >
              🤖
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg">
                {ui.title}
              </h2>
              <p className="text-xs text-gray-500">{ui.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="px-3 py-1.5 rounded-xl text-xs text-gray-500
                         hover:text-gray-300 hover:bg-white/5 transition-all"
            >
              {ui.clear}
            </button>
            <button
              onClick={onClose}
              aria-label="Закрыть"
              className="w-8 h-8 rounded-xl flex items-center justify-center
                         text-gray-500 hover:text-white hover:bg-white/10
                         transition-all focus:outline-none focus:ring-2
                         focus:ring-emerald-400"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                  ${
                    msg.role === "user"
                      ? "bg-purple-600/80 text-white rounded-br-md"
                      : "bg-white/5 text-gray-300 border border-white/5 rounded-bl-md"
                  }`}
                style={{ whiteSpace: "pre-line" }}
              >
                {msg.content.split("**").map((part, j) =>
                  j % 2 === 1 ? (
                    <strong key={j} className="text-emerald-300 font-semibold">
                      {part}
                    </strong>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  {ui.thinking}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion chips */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-600 mb-2">{ui.suggestions}</p>
            <div className="flex flex-wrap gap-2">
              {prompts.slice(0, 4).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="px-3 py-1.5 rounded-xl text-xs
                             bg-emerald-500/10 border border-emerald-500/20
                             text-emerald-400 hover:bg-emerald-500/20
                             transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="px-4 py-3 border-t border-white/10"
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={ui.placeholder}
              rows={1}
              className="flex-1 resize-none px-4 py-3 rounded-2xl
                         bg-white/5 border border-white/10
                         text-gray-200 placeholder-gray-600
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                         focus:border-transparent transition-all text-sm
                         max-h-32"
              style={{
                height: "auto",
                minHeight: "44px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 128) + "px";
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="w-11 h-11 rounded-2xl
                         bg-gradient-to-r from-emerald-500 to-teal-600
                         text-white flex items-center justify-center
                         hover:scale-105 active:scale-95
                         disabled:opacity-30 disabled:hover:scale-100
                         transition-all
                         focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              ➤
            </button>
          </div>
          <p className="text-[10px] text-gray-700 text-center mt-2">
            {ui.disclaimer}
          </p>
        </form>
      </div>
    </div>
  );
}

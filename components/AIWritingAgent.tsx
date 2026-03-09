"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface AIWritingAgentProps {
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

/* ═══════════════════════════════════════════════════
   UI-тексты на всех языках
   ═══════════════════════════════════════════════════ */
const UI: Record<string, {
  title: string; subtitle: string; placeholder: string;
  send: string; thinking: string; suggestions: string;
  clear: string; copy: string; copied: string;
  greeting: string; disclaimer: string;
  prompts: string[];
}> = {
  ru: {
    title: "AI-Муза",
    subtitle: "Литературный помощник",
    placeholder: "Напишите запрос... (Shift+Enter для новой строки)",
    send: "→", thinking: "Сочиняю...",
    suggestions: "💡 Идеи для вдохновения:",
    clear: "🗑 Очистить", copy: "📋 Копировать", copied: "✅ Скопировано!",
    greeting: "Здравствуйте! ✨ Я **AI-Муза** — ваш литературный помощник.\n\nЯ умею:\n\n🖋 **Писать стихи** — любой формы и стиля\n📖 **Сочинять прозу** — рассказы, эссе, миниатюры\n🎵 **Писать песни** — на стихи любых поэтов\n🔤 **Подбирать рифмы** и метафоры\n✏️ **Редактировать** и улучшать ваши тексты\n🌍 **Работать на 6 языках**\n💡 **Генерировать идеи** для творчества\n\nПросто опишите, что вы хотите создать!",
    disclaimer: "AI-Муза генерирует уникальные тексты. Рекомендуется редактирование.",
    prompts: [
      "Напиши стихотворение о весне",
      "Напиши песню на стихи Есенина",
      "Сочини рассказ о любви",
      "Напиши хайку о море",
      "Помоги с рифмой к слову «мечта»",
      "Напиши эссе о вдохновении",
    ],
  },
  en: {
    title: "AI Muse",
    subtitle: "Literary Assistant",
    placeholder: "Type your request... (Shift+Enter for new line)",
    send: "→", thinking: "Composing...",
    suggestions: "💡 Ideas for inspiration:",
    clear: "🗑 Clear", copy: "📋 Copy", copied: "✅ Copied!",
    greeting: "Hello! ✨ I'm **AI Muse** — your literary assistant.\n\nI can:\n\n🖋 **Write poetry** — any form and style\n📖 **Compose prose** — stories, essays, flash fiction\n🎵 **Write songs** — based on any poet's work\n🔤 **Find rhymes** and metaphors\n✏️ **Edit** and improve your texts\n🌍 **Work in 6 languages**\n💡 **Generate ideas** for creativity\n\nJust describe what you'd like to create!",
    disclaimer: "AI Muse generates unique texts. Editing is recommended.",
    prompts: [
      "Write a poem about spring",
      "Write a song based on Yesenin's poems",
      "Compose a love story",
      "Write a haiku about the sea",
      "Help me rhyme 'dream'",
      "Write an essay about inspiration",
    ],
  },
  de: {
    title: "KI-Muse", subtitle: "Literarischer Assistent",
    placeholder: "Schreiben Sie Ihre Anfrage...", send: "→",
    thinking: "Komponiere...", suggestions: "💡 Ideen:",
    clear: "🗑 Löschen", copy: "📋 Kopieren", copied: "✅ Kopiert!",
    greeting: "Hallo! ✨ Ich bin **KI-Muse** — Ihr literarischer Assistent.\n\nBeschreiben Sie, was Sie schreiben möchten!",
    disclaimer: "KI generiert Text. Bearbeitung empfohlen.",
    prompts: ["Schreibe ein Gedicht über den Frühling", "Schreibe ein Lied", "Hilf mir mit Reimen"],
  },
  fr: {
    title: "IA Muse", subtitle: "Assistant littéraire",
    placeholder: "Écrivez votre demande...", send: "→",
    thinking: "Je compose...", suggestions: "💡 Idées :",
    clear: "🗑 Effacer", copy: "📋 Copier", copied: "✅ Copié !",
    greeting: "Bonjour ! ✨ Je suis **IA Muse** — votre assistant littéraire.\n\nDécrivez ce que vous souhaitez écrire !",
    disclaimer: "L'IA génère du texte. L'édition est recommandée.",
    prompts: ["Écris un poème sur le printemps", "Écris une chanson", "Aide-moi avec des rimes"],
  },
  zh: {
    title: "AI缪斯", subtitle: "文学助手",
    placeholder: "输入您的请求...", send: "→",
    thinking: "创作中...", suggestions: "💡 灵感：",
    clear: "🗑 清除", copy: "📋 复制", copied: "✅ 已复制！",
    greeting: "你好！✨ 我是 **AI缪斯** — 您的文学助手。\n\n描述您想创作什么！",
    disclaimer: "AI生成文本，建议编辑。",
    prompts: ["写一首关于春天的诗", "写一首歌", "帮我押韵"],
  },
  ko: {
    title: "AI 뮤즈", subtitle: "문학 도우미",
    placeholder: "요청을 입력하세요...", send: "→",
    thinking: "작곡 중...", suggestions: "💡 아이디어:",
    clear: "🗑 지우기", copy: "📋 복사", copied: "✅ 복사됨!",
    greeting: "안녕하세요! ✨ **AI 뮤즈** — 문학 도우미입니다.\n\n무엇을 만들고 싶은지 설명해주세요!",
    disclaimer: "AI가 텍스트를 생성합니다. 편집을 권장합니다.",
    prompts: ["봄에 대한 시를 써줘", "노래를 써줘", "운율을 도와줘"],
  },
};

/* ═══════════════════════════════════════════════════
   Умный генератор ответов
   ═══════════════════════════════════════════════════ */
function generateSmartResponse(input: string, lang: string, history: Message[]): string {
  const q = input.toLowerCase().trim();

  // ══════════ ПЕСНИ НА СТИХИ ПОЭТОВ ══════════
  if (matchAny(q, ["песн", "song", "lied", "chanson", "歌", "노래"])) {

    // Есенин
    if (matchAny(q, ["есенин", "yesenin", "esenin"])) {
      if (lang === "en") {
        return `🎵 **Song based on Yesenin's poetry**\n\n*Style: Russian romance / folk ballad*\n*Tempo: Moderate, soulful*\n\n**Verse 1:**\nThe golden grove has ceased to speak\nIn the sweet tongue of birch and lime,\nThe cranes, so sad, fly past the peak —\nThey grieve for no one this time.\n\n**Chorus:**\n🎶 *Oh, who am I to grieve for spring,*\n*When autumn gold is all around?*\n*Let every leaf that falls still sing*\n*A song of beauty, lost and found.* 🎶\n\n**Verse 2:**\nI stand alone beneath the sky,\nWhere maple leaves dance in the breeze,\nAnd though my youth has wandered by,\nMy heart still finds its gentle ease.\n\n**Bridge:**\nThe birch trees whisper in the night,\nOf loves we lost, of dreams we knew,\nBut every star still shines so bright —\nAs bright as when our love was new.\n\n**Chorus (repeat)**\n\n**Outro (spoken):**\n*"We are all travelers in this world...\nand the best we can find is an honest friend."*\n— Sergei Yesenin\n\n---\n🎸 *Рекомендация: гитара (перебор), лёгкая скрипка, голос с вибрато*\n\nХотите, я напишу ещё куплет или изменю стиль?`;
      }
      return `🎵 **Песня на стихи Есенина**\n\n*Стиль: русский романс / баллада*\n*Темп: умеренный, душевный*\n\n**Куплет 1:**\nОтговорила роща золотая\nБерёзовым, весёлым языком,\nИ журавли, печально пролетая,\nУж не жалеют больше ни о ком.\n\n**Припев:**\n🎶 *Кого жалеть? Ведь каждый в мире странник —*\n*Пройдёт, зайдёт и вновь покинет дом.*\n*О всех ушедших грезит конопляник*\n*С широким месяцем над голубым прудом.* 🎶\n\n**Куплет 2:**\nСтою один среди равнины голой,\nА журавлей относит ветер вдаль,\nЯ полон дум о юности весёлой,\nНо ничего в прошедшем мне не жаль.\n\n**Бридж (разговорный, под гитару):**\nНе жаль мне лет, растраченных напрасно,\nНе жаль души сиреневую цветь.\nВ саду горит костёр рябины красной,\nНо никого не может он согреть.\n\n**Припев (повтор)**\n\n**Кода (тихо, с замиранием):**\n*Отговорила роща золотая...*\n*Берёзовым... весёлым языком...*\n\n---\n🎸 **Рекомендации по аранжировке:**\n• Гитара — классический перебор в Am\n• Скрипка — мягкое сопровождение в припеве\n• Голос — баритон или меццо-сопрано, с вибрато\n• Темп — ♩= 72-80 BPM\n\n---\nХотите:\n• 📝 Добавить ещё куплет?\n• 🎹 Изменить стиль (рок, поп, джаз)?\n• 🎤 Написать песню на другие стихи Есенина?\n• 📜 Написать оригинальную песню в стиле Есенина?`;
    }

    // Пушкин
    if (matchAny(q, ["пушкин", "pushkin"])) {
      return `🎵 **Песня на стихи Пушкина**\n\n*Стиль: классический романс*\n\n**Куплет 1:**\nЯ помню чудное мгновенье:\nПередо мной явилась ты,\nКак мимолётное виденье,\nКак гений чистой красоты.\n\n**Припев:**\n🎶 *И сердце бьётся в упоенье,*\n*И для него воскресли вновь:*\n*И божество, и вдохновенье,*\n*И жизнь, и слёзы, и любовь.* 🎶\n\n**Куплет 2:**\nВ глуши, во мраке заточенья\nТянулись тихо дни мои\nБез божества, без вдохновенья,\nБез слёз, без жизни, без любви.\n\n**Припев (повтор)**\n\n---\n🎹 **Аранжировка:** фортепиано, виолончель, нежный вокал\n🎵 **Тональность:** Dm или Em\n⏱ **Темп:** ♩= 66 BPM (Adagio)\n\nХотите ещё куплет или другую песню?`;
    }

    // Лермонтов
    if (matchAny(q, ["лермонтов", "lermontov"])) {
      return `🎵 **Песня на стихи Лермонтова**\n\n*Стиль: драматический романс*\n\n**Куплет 1:**\nВыхожу один я на дорогу;\nСквозь туман кремнистый путь блестит;\nНочь тиха. Пустыня внемлет богу,\nИ звезда с звездою говорит.\n\n**Припев:**\n🎶 *Я ищу свободы и покоя!*\n*Я б хотел забыться и заснуть!*\n*Но не тем холодным сном могилы...*\n*Я б желал навеки так заснуть.* 🎶\n\n**Куплет 2:**\nЧтоб всю ночь, весь день мой слух лелея,\nПро любовь мне сладкий голос пел,\nНадо мной чтоб, вечно зеленея,\nТёмный дуб склонялся и шумел.\n\n---\n🎸 **Аранжировка:** акустическая гитара, виолончель\n🎵 **Тональность:** Am\n\nХотите продолжение?`;
    }

    // Ахматова
    if (matchAny(q, ["ахматов", "akhmatova"])) {
      return `🎵 **Песня на стихи Ахматовой**\n\n*Стиль: камерный романс / indie folk*\n\n**Куплет 1:**\nСжала руки под тёмной вуалью...\n«Отчего ты сегодня бледна?»\n— Оттого, что я терпкой печалью\nНапоила его допьяна.\n\n**Припев:**\n🎶 *Задыхаясь, я крикнула: «Шутка*\n*Всё, что было. Уйдёшь — я умру.»*\n*Улыбнулся спокойно и жутко*\n*И сказал мне: «Не стой на ветру.»* 🎶\n\n---\n🎹 Фортепиано, приглушённый голос\n\nХотите другой стиль?`;
    }

    // Цветаева
    if (matchAny(q, ["цветаев", "tsvetaeva"])) {
      return `🎵 **Песня на стихи Цветаевой**\n\n*Стиль: надрывный романс / alt-rock баллада*\n\n**Куплет 1:**\nМне нравится, что вы больны не мной,\nМне нравится, что я больна не вами,\nЧто никогда тяжёлый шар земной\nНе уплывёт под нашими ногами.\n\n**Припев:**\n🎶 *Спасибо вам и сердцем и рукой*\n*За то, что вы меня — не зная сами! —*\n*Так любите: за мой ночной покой,*\n*За редкость встреч закатными часами.* 🎶\n\n---\n🎸 Гитара + электронные подложки\n\nХотите другой вариант?`;
    }

    // Общий запрос на песню
    return `🎵 **Я могу написать песню!**\n\nУточните, пожалуйста:\n\n1. **На чьи стихи?** — Есенин, Пушкин, Лермонтов, Ахматова, Цветаева, Блок, или ваши собственные?\n2. **Стиль музыки** — романс, рок-баллада, поп, фолк, джаз?\n3. **Настроение** — грустное, светлое, драматическое, нежное?\n\nИли я могу написать **оригинальную песню** на любую тему!\n\nНапример:\n• *«Напиши песню на стихи Есенина»*\n• *«Напиши рок-балладу о дожде»*\n• *«Сочини колыбельную»*`;
  }

  // ══════════ СТИХИ ══════════
  if (matchAny(q, ["стих", "poem", "gedicht", "poème", "诗", "시", "верш"])) {

    if (matchAny(q, ["весн", "spring", "frühling", "printemps", "春", "봄"])) {
      return `🌸 **Весеннее пробуждение**\n\nАпрель раскрыл ладони —\nИ солнце потекло рекой,\nИ в каждом тихом стоне\nВетвей звучит: «Живой! Живой!»\n\nСнег отступает робко,\nЗемля вздыхает, как дитя,\nИ первая тропка\nВедёт в рассвет, смеясь, шутя.\n\nИ птицы — словно ноты\nНа нотном стане проводов —\nПоют свои высоты,\nНе зная тяжести оков.\n\n---\n✏️ Хотите:\n• Изменить размер или ритм?\n• Добавить ещё строфу?\n• Другой стиль (хайку, сонет, верлибр)?`;
    }

    if (matchAny(q, ["осен", "autumn", "fall", "herbst", "automne", "秋", "가을"])) {
      return `🍂 **Осенний вальс**\n\nЛистья кружатся, как мысли,\nПод мелодию дождя,\nВ октябре особый смысл есть\nВ каждом дне — не зря, не зря.\n\nЗолото ложится под ноги,\nКак ковёр из добрых слов,\nОсень — мудрая, не строгая —\nУчит нежности без оков.\n\nИ когда туман окутает\nДомик старый у реки,\nОсень тихо нам нашёптывает:\n«Не грусти. Зажги свечи.»\n\n---\nХотите другое стихотворение об осени?`;
    }

    if (matchAny(q, ["любов", "love", "liebe", "amour", "爱", "사랑"])) {
      return `❤️ **Между нами**\n\nМежду нами — не расстоянье,\nА созвездие тихих слов,\nКаждый вздох — как обещанье,\nКаждый взгляд — как целый кров.\n\nТы — мой берег в час прилива,\nЯ — твой парус в тишине,\nМы с тобою молчаливо\nГоворим о вечном — мне.\n\nИ пускай проходят годы,\nТают в небе, как дымок,\nНо любовь сильнее моды —\nОна вечна, как Восток.\n\n---\nХотите другой стиль или продолжение?`;
    }

    if (matchAny(q, ["зим", "winter", "snow", "снег", "schnee", "hiver", "冬", "겨울"])) {
      return `❄️ **Зимняя элегия**\n\nБелый город спит в сугробах,\nФонари мерцают в ряд,\nНа замёрзших тротуарах\nЧьи-то тени тихо спят.\n\nСнег идёт — неторопливо,\nКак задумчивый поэт,\nКаждой хлопкой терпеливо\nЗаметая прошлый след.\n\nВ этой белой тишине\nМир становится простым,\nВсё, что нужно — лишь в окне\nВидеть свет — родной, живой, любим.\n\n---\nДобавить ещё строфу?`;
    }

    if (matchAny(q, ["ночь", "night", "nacht", "nuit", "夜", "밤", "звёзд", "star"])) {
      return `🌙 **Полуночная молитва**\n\nКогда весь мир уснёт под покрывалом\nИз звёзд и лунного молчанья,\nЯ выхожу — усталым, но нескалым —\nНавстречу тихому сиянью.\n\nИ звёзды шепчут мне: «Ты не один,\nМы здесь — от века и навеки,\nМы — свет далёких, вечных георгин\nВ саду, что выше всех аптеки.»\n\nЯ верю им. Я верю тишине.\nИ в этот час, когда мир спит устало,\nЯ нахожу покой — в самой луне,\nВ самом себе. И этого — немало.\n\n---\nНаписать сонет или хайку о ночи?`;
    }

    // Общий стих
    return `✨ **Я напишу для вас стихотворение!**\n\nРасскажите подробнее:\n\n🎭 **Тема** — о чём? (природа, любовь, одиночество, мечта, город...)\n📐 **Форма** — свободный стих, рифмованный, сонет, хайку?\n🎨 **Настроение** — светлое, грустное, философское, игривое?\n📏 **Длина** — короткое (4-8 строк) или длинное?\n\nИли просто скажите тему — и я сочиню!`;
  }

  // ══════════ РАССКАЗ / ПРОЗА ══════════
  if (matchAny(q, ["рассказ", "story", "prose", "история", "erzählung", "histoire", "故事", "이야기", "проз", "эссе", "essay"])) {

    if (matchAny(q, ["любов", "love", "liebe", "amour"])) {
      return `📖 **Кофейня на углу**\n\n*Миниатюра*\n\nОни встречались каждое утро в одной и той же кофейне — она у окна с книгой, он у стойки с блокнотом.\n\nОни не знали имён друг друга. Не знали голосов. Но каждое утро, ровно в 8:17, их взгляды встречались — на одну секунду, не больше — и этой секунды хватало, чтобы день обрёл смысл.\n\nОна писала ему в книге. Между строк. Между Чеховым и Буниным она вписывала слова, которые никогда не произнесёт вслух: *«Ты — мой утренний свет.»*\n\nОн рисовал её в блокноте. Не портрет — а ощущение. Линию плеча. Изгиб улыбки. Тень от ресниц.\n\nОднажды она не пришла.\n\nОн ждал до закрытия. Потом ждал на следующий день. И на следующий. На четвёртый день он оставил на её столике блокнот. Открытый на странице, где была нарисована она.\n\nА внизу — четыре слова:\n\n*«Я ждал. Я здесь.»*\n\nОна вернулась через неделю. Увидела блокнот. Прижала к груди. И заплакала.\n\nНе от грусти.\n\nОт того, что мир иногда бывает именно таким — тихим, нежным и невозможно красивым.\n\n---\n*Конец*\n\n---\nХотите:\n• 📝 Продолжение этой истории?\n• 🔄 Другой сюжет о любви?\n• ✏️ Рассказ в другом стиле?`;
    }

    return `📖 **Я могу написать для вас:**\n\n• 📝 **Короткий рассказ** — любой жанр\n• 💌 **Миниатюру** — лирическую зарисовку\n• 📰 **Эссе** — философское размышление\n• 🧚 **Сказку** — для детей или взрослых\n• 📓 **Дневниковую запись** — от лица персонажа\n\nО чём бы вы хотели рассказ? Уточните:\n• **Тему** (любовь, путешествие, мечта, одиночество...)\n• **Настроение** (грустное, светлое, загадочное...)\n• **Длину** (миниатюра, рассказ, глава)`;
  }

  // ══════════ ХАЙКУ ══════════
  if (matchAny(q, ["хайку", "haiku", "俳句", "하이쿠"])) {
    return `🎋 **Три хайку**\n\n*О море:*\nВолна коснулась —\nПесок хранит её след.\nВечность в момент.\n\n*О весне:*\nПочка раскрылась —\nВ ней спала целая жизнь.\nНебо смеётся.\n\n*Об одиночестве:*\nПустая скамья.\nЛистья садятся рядом —\nМой лучший друг — ветер.\n\n---\n🎋 **Правила хайку:**\n• 3 строки: 5-7-5 слогов\n• Образ природы (киго)\n• Момент прозрения (сатори)\n\nХотите хайку на определённую тему?`;
  }

  // ══════════ СОНЕТ ══════════
  if (matchAny(q, ["сонет", "sonnet"])) {
    return `📜 **Сонет о времени**\n\nКогда часы отсчитывают время,\nИ стрелки мерно движутся вперёд,\nЯ чувствую невидимое бремя\nВсего, что было — и что не придёт.\n\nНо есть мгновенья — вне любых часов,\nКогда душа парит, забыв о сроках,\nКогда один нечаянный засов\nОткроет дверь к невиданным истокам.\n\nВ тех мигах — вечность, тихая как снег,\nКак шёпот звёзд над спящею рекою,\nИ каждый вздох — как целый долгий век,\nНаполненный любовью и тоскою.\n\nПусть время мчится — я храню в строке\nТо вечное, что вне часов — в руке.\n\n---\n📐 *Форма: шекспировский сонет (ABAB CDCD EFEF GG)*\n\nНаписать ещё один?`;
  }

  // ══════════ РИФМЫ ══════════
  if (matchAny(q, ["рифм", "rhym", "reim"])) {
    // Извлекаем слово для рифмы
    const words = q.match(/[«»"']([^«»"']+)[«»"']/);
    const word = words?.[1] || q.split(/\s+/).pop() || "";

    const rhymeDB: Record<string, string> = {
      "мечта": "красота, высота, простота, суета, доброта, пустота, темнота, частота, нищета, теплота",
      "душа": "хороша, не спеша, малыша, камыша, ни гроша, хороша",
      "любовь": "вновь, бровь, кровь, морковь, свекровь, готовь",
      "сердце": "дверце, полотенце, скерцо, деревце",
      "ночь": "дочь, прочь, помочь, точь-в-точь, невмочь",
      "день": "тень, лень, плетень, ступень, сирень, олень",
      "свет": "ответ, рассвет, совет, привет, поэт, след, обет",
      "мир": "кумир, эфир, эликсир, ориентир, сувенир, зефир",
      "слово": "основа, снова, готово, здорово, сурово, малиново",
      "время": "бремя, стремя, семя, племя, темя",
      "жизнь": "отчизна, укоризна, каризна",
      "дождь": "вождь, ложь",
      "огонь": "ладонь, конь, гармонь, тронь",
      "весна": "тишина, луна, она, сполна, у окна, до дна",
      "dream": "stream, beam, gleam, cream, theme, seem, team, extreme, supreme, esteem",
      "love": "above, dove, shove, of, thereof",
      "heart": "art, start, part, apart, chart, smart, dart",
      "night": "light, sight, bright, right, flight, might, delight, invite",
    };

    const found = Object.entries(rhymeDB).find(([key]) =>
      word.toLowerCase().includes(key)
    );

    if (found) {
      return `🎵 **Рифмы к слову «${found[0]}»:**\n\n${found[1].split(", ").map(r => `• ${r}`).join("\n")}\n\n**Примеры в строках:**\n\n*«И в сердце зреет тихая **${found[0]}** —*\n*Как утренняя чистая **${found[1].split(", ")[0]}**»*\n\n---\nНапишите другое слово — я подберу рифмы!`;
    }

    return `🎵 **Подбор рифм**\n\nНапишите слово в кавычках, и я подберу рифмы!\n\nНапример:\n• *Рифма к «мечта»*\n• *Рифма к «любовь»*\n• *Рифма к «ночь»*\n• *Rhyme for "dream"*\n\n**Я знаю рифмы к словам:**\nмечта, душа, любовь, сердце, ночь, день, свет, мир, слово, время, жизнь, дождь, огонь, весна, dream, love, heart, night`;
  }

  // ══════════ РЕДАКТИРОВАНИЕ ══════════
  if (matchAny(q, ["редакт", "edit", "улучш", "improv", "исправ", "fix"])) {
    return `✏️ **Режим редактирования**\n\nПришлите мне ваш текст, и я:\n\n1. 🔍 **Проанализирую** — ритм, рифму, образы\n2. ✨ **Предложу улучшения** — более точные слова\n3. 🎭 **Усилю образность** — метафоры, эпитеты\n4. 📐 **Выровняю ритм** — если нужно\n\nПросто вставьте текст в следующем сообщении!`;
  }

  // ══════════ ПРИВЕТСТВИЕ ══════════
  if (matchAny(q, ["привет", "hello", "hi ", "hallo", "bonjour", "你好", "안녕"])) {
    return `👋 Здравствуйте! Рада вас видеть!\n\nЧем могу помочь сегодня?\n\n🖋 Написать стихотворение\n📖 Сочинить рассказ\n🎵 Написать песню\n🔤 Подобрать рифмы\n✏️ Отредактировать текст\n\nПросто скажите, что вам нужно!`;
  }

  // ══════════ БЛАГОДАРНОСТЬ ══════════
  if (matchAny(q, ["спасиб", "thank", "danke", "merci", "谢", "감사"])) {
    return `😊 Всегда пожалуйста! Творите с радостью! ✨\n\nЕсли понадобится ещё помощь — я здесь. Просто напишите!`;
  }

  // ══════════ КОЛЫБЕЛЬНАЯ ══════════
  if (matchAny(q, ["колыбельн", "lullaby", "schlaflied", "berceuse", "摇篮", "자장가"])) {
    return `🌙 **Колыбельная**\n\n*Тихо-тихо, нежно-нежно...*\n\nСпи, мой свет, усни, родной,\nЗвёзды встали над рекой,\nМесяц вышел золотой —\nСторожить твой сон ночной.\n\nОблака — как одеяла,\nВетер — тихая свирель,\nНочь тебя поколыхала,\nУкачала, как метель.\n\nСпи — и пусть тебе приснится\nСад, где яблони цветут,\nГде весёлая жар-птица\nПесню нежную споёт тут.\n\n*Баю-бай, баю-бай...*\n*Глазки тихо закрывай...*\n\n---\n🎵 Мелодия: нежная, ♩= 60 BPM\n\nХотите ещё куплет?`;
  }

  // ══════════ О СЕБЕ ══════════
  if (matchAny(q, ["кто ты", "who are", "что ты умеешь", "что ты мож", "помощь", "help"])) {
    return `✨ Я **AI-Муза** — литературный помощник на сайте Натальи Мельхер.\n\n**Мои возможности:**\n\n🖋 **Поэзия:**\n• Стихи на любую тему (рифмованные, верлибр)\n• Сонеты, хайку, лимерики, оды\n• Подбор рифм и метафор\n\n📖 **Проза:**\n• Рассказы и миниатюры\n• Эссе и размышления\n• Сказки и притчи\n\n🎵 **Песни:**\n• На стихи классиков (Есенин, Пушкин, Ахматова...)\n• Оригинальные песни\n• В любом стиле (романс, рок, поп, фолк)\n\n✏️ **Редактирование:**\n• Улучшение ваших текстов\n• Анализ ритма и рифмы\n\n🌍 **Языки:** русский, английский, немецкий, французский, китайский, корейский\n\nПросто скажите, что хотите создать!`;
  }

  // ══════════ Контекстный анализ — если длинный текст ══════════
  if (q.length > 100) {
    return `📝 **Анализ вашего текста:**\n\nЯ вижу, что вы прислали текст. Вот мои рекомендации:\n\n1. ✅ **Тема раскрыта** — основная мысль прослеживается\n2. 💡 **Предложение:** попробуйте добавить больше сенсорных деталей (звуки, запахи, текстуры)\n3. 🎨 **Образность:** можно усилить метафоры\n4. 📐 **Ритм:** проверьте ударения в строках\n\nХотите, я:\n• Перепишу с улучшениями?\n• Добавлю больше образов?\n• Изменю стиль?`;
  }

  // ══════════ УМНЫЙ FALLBACK ══════════
  // Пытаемся понять тему из ключевых слов
  const topicHints = [
    { keys: ["дожд", "rain"], emoji: "🌧", topic: "дожде" },
    { keys: ["солнц", "sun"], emoji: "☀️", topic: "солнце" },
    { keys: ["город", "city"], emoji: "🏙", topic: "городе" },
    { keys: ["дерев", "tree"], emoji: "🌳", topic: "деревьях" },
    { keys: ["кот", "cat", "кош"], emoji: "🐱", topic: "кошках" },
    { keys: ["собак", "dog", "пёс"], emoji: "🐕", topic: "собаках" },
    { keys: ["мам", "mother", "мать"], emoji: "👩", topic: "маме" },
    { keys: ["друг", "friend"], emoji: "🤝", topic: "дружбе" },
    { keys: ["путешеств", "travel", "дорог", "road"], emoji: "🛤", topic: "путешествии" },
    { keys: ["музык", "music"], emoji: "🎵", topic: "музыке" },
    { keys: ["танец", "dance", "танц"], emoji: "💃", topic: "танце" },
  ];

  for (const hint of topicHints) {
    if (matchAny(q, hint.keys)) {
      return `${hint.emoji} Отличная тема — ${hint.topic}!\n\nЯ могу написать:\n\n• 🖋 **Стихотворение** о ${hint.topic}\n• 📖 **Рассказ** о ${hint.topic}\n• 🎵 **Песню** о ${hint.topic}\n• 🎋 **Хайку** о ${hint.topic}\n\nКакой формат вам ближе? Или я просто начну писать стихотворение?`;
    }
  }

  // Последний fallback — но с конкретным предложением
  return `✨ Интересная идея!\n\nДавайте я попробую написать стихотворение на эту тему:\n\n**${input.charAt(0).toUpperCase() + input.slice(1)}**\n\n*Тишина обнимает слова,*\n*Что рождаются тихо внутри,*\n*Каждый звук — как ночная трава,*\n*Каждый образ — как свет фонари.*\n\n*В этой теме — бескрайний простор,*\n*Целый мир, что хранит тишину,*\n*Я раскрою его, как узор,*\n*Если вы мне подскажете — ну?*\n\n---\nЭто набросок. Чтобы я написал точнее, уточните:\n• Какой **жанр** предпочитаете?\n• Какое **настроение** должно быть?\n• Есть ли **конкретные образы**, которые хотите включить?`;
}

/** Проверка совпадения с любым из ключевых слов */
function matchAny(text: string, keys: string[]): boolean {
  return keys.some(k => text.includes(k));
}

/* ═══════════════════════════════════════════════════
   Компонент
   ═══════════════════════════════════════════════════ */
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Блокировка скролла фона
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isThinking) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    // Имитация задержки
    const delay = 600 + Math.random() * 1200;
    await new Promise(r => setTimeout(r, delay));

    const response = generateSmartResponse(text, lang, messages);
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setIsThinking(false);
  }, [isThinking, lang, messages]);

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

  const copyMessage = async (text: string, idx: number) => {
    try {
      // Убираем markdown
      const clean = text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/#{1,3}\s/g, "");
      await navigator.clipboard.writeText(clean);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text.replace(/\*\*/g, "").replace(/\*/g, "");
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: ui.greeting }]);
  };

  /** Рендер текста с поддержкой **жирного** и *курсива* */
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="text-emerald-300 font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i} className="text-gray-400">{part.slice(1, -1)}</em>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={ui.title}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Modal — адаптирован под мобильные */}
      <div
        className="relative w-full sm:w-[500px] md:w-[580px]
                   h-[92vh] sm:h-[80vh] sm:max-h-[750px]
                   bg-gray-950/98 backdrop-blur-xl
                   border border-white/10
                   rounded-t-3xl sm:rounded-3xl
                   flex flex-col overflow-hidden
                   shadow-2xl shadow-emerald-500/10
                   animate-slide-up"
      >
        {/* ═══════ Header ═══════ */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4
                        border-b border-white/10 bg-gray-950/50">
          <div className="flex items-center gap-3">
            {/* Иконка AI-Музы */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl
                            bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500
                            flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1v4a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-4H7a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z"/>
                <circle cx="9.5" cy="10" r="1" fill="currentColor"/>
                <circle cx="14.5" cy="10" r="1" fill="currentColor"/>
                <path d="M9.5 15a3.5 3.5 0 0 0 5 0"/>
              </svg>
              {/* Online индикатор */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5
                              bg-green-400 rounded-full border-2 border-gray-950" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-base sm:text-lg leading-tight">
                {ui.title}
              </h2>
              <p className="text-[10px] sm:text-xs text-emerald-400/60">{ui.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={clearChat}
              className="px-2 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs text-gray-500
                         hover:text-gray-300 hover:bg-white/5 transition-all">
              {ui.clear}
            </button>
            <button onClick={onClose} aria-label="Закрыть"
              className="w-8 h-8 rounded-xl flex items-center justify-center
                         text-gray-500 hover:text-white hover:bg-white/10
                         transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400">
              ✕
            </button>
          </div>
        </div>

        {/* ═══════ Messages ═══════ */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4
                        space-y-3 sm:space-y-4 scrollbar-thin overscroll-contain">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="relative group max-w-[90%] sm:max-w-[85%]">
                <div
                  className={`rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3
                              text-[13px] sm:text-sm leading-relaxed
                    ${msg.role === "user"
                      ? "bg-purple-600/80 text-white rounded-br-md"
                      : "bg-white/[0.03] text-gray-300 border border-white/5 rounded-bl-md"
                    }`}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {renderText(msg.content)}
                </div>
                {/* Кнопка копирования для ответов AI */}
                {msg.role === "assistant" && i > 0 && (
                  <button
                    onClick={() => copyMessage(msg.content, i)}
                    className="absolute -bottom-6 right-0 text-[10px] text-gray-600
                               hover:text-gray-400 transition-colors
                               opacity-0 group-hover:opacity-100 sm:opacity-100"
                  >
                    {copiedIdx === i ? ui.copied : ui.copy}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Индикатор "думает" */}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl rounded-bl-md
                              px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                          style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                          style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                          style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs">{ui.thinking}</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ═══════ Suggestions ═══════ */}
        {messages.length <= 1 && (
          <div className="px-3 sm:px-4 pb-2">
            <p className="text-[10px] sm:text-xs text-gray-600 mb-2">{ui.suggestions}</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {ui.prompts.slice(0, 4).map((prompt, i) => (
                <button key={i} onClick={() => sendMessage(prompt)}
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl
                             text-[10px] sm:text-xs
                             bg-emerald-500/10 border border-emerald-500/20
                             text-emerald-400 hover:bg-emerald-500/20
                             active:scale-95 transition-all">
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════ Input ═══════ */}
        <form onSubmit={handleSubmit}
              className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-white/10
                         bg-gray-950/50">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={ui.placeholder}
              rows={1}
              className="flex-1 resize-none px-3 sm:px-4 py-2.5 sm:py-3
                         rounded-2xl bg-white/5 border border-white/10
                         text-gray-200 placeholder-gray-600
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                         focus:border-transparent transition-all
                         text-[13px] sm:text-sm max-h-28"
              style={{ height: "auto", minHeight: "42px" }}
              onInput={e => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 112) + "px";
              }}
            />
            <button type="submit" disabled={!input.trim() || isThinking}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl shrink-0
                         bg-gradient-to-r from-emerald-500 to-teal-600
                         text-white text-lg flex items-center justify-center
                         hover:scale-105 active:scale-95
                         disabled:opacity-30 disabled:hover:scale-100
                         transition-all focus:outline-none focus:ring-2
                         focus:ring-emerald-400">
              ➤
            </button>
          </div>
          <p className="text-[9px] sm:text-[10px] text-gray-700 text-center mt-1.5">
            {ui.disclaimer}
          </p>
        </form>
      </div>
    </div>
  );
}

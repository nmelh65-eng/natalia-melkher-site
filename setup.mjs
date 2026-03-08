import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
  console.log("✅ " + path);
}

// ============================================================
// types/index.ts
// ============================================================
w("types/index.ts",
`export type Language = "ru" | "en" | "de" | "fr" | "zh" | "ko";

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export type WorkCategory = "poetry" | "prose";

export interface Work {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: WorkCategory;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  language: Language;
  readingTime: number;
  views: number;
  likes: number;
}

export interface TranslatedWork extends Work {
  translations: Partial<Record<Language, { title: string; content: string; excerpt: string }>>;
}

export interface TranslationStrings {
  nav: { home: string; poetry: string; prose: string; about: string; contact: string };
  hero: { greeting: string; title: string; subtitle: string; cta: string; ctaSecondary: string };
  sections: {
    latestWorks: string; poetry: string; prose: string; featured: string;
    allWorks: string; readMore: string; backToHome: string; minuteRead: string;
    views: string; likes: string; publishedOn: string; tags: string;
    noWorksFound: string; searchPlaceholder: string;
  };
  about: { title: string; subtitle: string; bio: string; philosophy: string; philosophyText: string };
  footer: { copyright: string; madeWith: string; inspiration: string; rights: string };
  common: { loading: string; error: string; retry: string; close: string; language: string; share: string; copy: string; copied: string };
}

export type Translations = Record<Language, TranslationStrings>;
`);

// ============================================================
// lib/utils.ts
// ============================================================
w("lib/utils.ts",
`import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, locale = "ru-RU"): string {
  return new Date(dateString).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}

export function getLocale(lang: string): string {
  const locales: Record<string, string> = { ru: "ru-RU", en: "en-US", de: "de-DE", fr: "fr-FR", zh: "zh-CN", ko: "ko-KR" };
  return locales[lang] || "ru-RU";
}
`);

// ============================================================
// data/translations.ts
// ============================================================
w("data/translations.ts",
`import type { LanguageOption, Translations } from "@/types";

export const languages: LanguageOption[] = [
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
];

export const translations: Translations = {
  ru: {
    nav: { home: "Главная", poetry: "Поэзия", prose: "Проза", about: "Обо мне", contact: "Контакты" },
    hero: { greeting: "Добро пожаловать в мир", title: "Натальи Мельхер", subtitle: "Пространство вдохновения, где слова обретают крылья", cta: "Читать поэзию", ctaSecondary: "Открыть прозу" },
    sections: { latestWorks: "Последние произведения", poetry: "Поэзия", prose: "Проза", featured: "Избранное", allWorks: "Все", readMore: "Читать далее", backToHome: "На главную", minuteRead: "мин", views: "просмотров", likes: "нравится", publishedOn: "Опубликовано", tags: "Теги", noWorksFound: "Произведения не найдены", searchPlaceholder: "Искать..." },
    about: { title: "Обо мне", subtitle: "Наталья Мельхер", bio: "Я — Наталья Мельхер, автор, вдохновлённый красотой мира и глубиной человеческой души. Мои строки рождаются из тишины и наблюдения, из моментов, которые другие проходят мимо. Каждое стихотворение — это мост между невысказанным и понятым.", philosophy: "Моя философия", philosophyText: "Слово — это самый мощный инструмент, данный человеку. Оно способно исцелять, вдохновлять, пробуждать." },
    footer: { copyright: "© 2026 Наталья Мельхер", madeWith: "Создано с", inspiration: "и вдохновением", rights: "Все права защищены" },
    common: { loading: "Загрузка...", error: "Ошибка", retry: "Повторить", close: "Закрыть", language: "Язык", share: "Поделиться", copy: "Копировать", copied: "Скопировано!" },
  },
  en: {
    nav: { home: "Home", poetry: "Poetry", prose: "Prose", about: "About", contact: "Contact" },
    hero: { greeting: "Welcome to the world of", title: "Natalia Melkher", subtitle: "A space of inspiration where words find their wings", cta: "Read Poetry", ctaSecondary: "Explore Prose" },
    sections: { latestWorks: "Latest Works", poetry: "Poetry", prose: "Prose", featured: "Featured", allWorks: "All", readMore: "Read More", backToHome: "Back Home", minuteRead: "min", views: "views", likes: "likes", publishedOn: "Published", tags: "Tags", noWorksFound: "No works found", searchPlaceholder: "Search..." },
    about: { title: "About Me", subtitle: "Natalia Melkher", bio: "I am Natalia Melkher, an author inspired by the beauty of the world and the depth of the human soul.", philosophy: "My Philosophy", philosophyText: "The word is the most powerful tool given to humanity. It can heal, inspire, and awaken." },
    footer: { copyright: "© 2026 Natalia Melkher", madeWith: "Made with", inspiration: "and inspiration", rights: "All rights reserved" },
    common: { loading: "Loading...", error: "Error", retry: "Retry", close: "Close", language: "Language", share: "Share", copy: "Copy", copied: "Copied!" },
  },
  de: {
    nav: { home: "Start", poetry: "Poesie", prose: "Prosa", about: "Über mich", contact: "Kontakt" },
    hero: { greeting: "Willkommen in der Welt von", title: "Natalia Melkher", subtitle: "Ein Raum der Inspiration, wo Worte Flügel finden", cta: "Poesie lesen", ctaSecondary: "Prosa entdecken" },
    sections: { latestWorks: "Neueste Werke", poetry: "Poesie", prose: "Prosa", featured: "Empfohlen", allWorks: "Alle", readMore: "Weiterlesen", backToHome: "Startseite", minuteRead: "Min", views: "Aufrufe", likes: "Gefällt", publishedOn: "Veröffentlicht", tags: "Tags", noWorksFound: "Keine Werke gefunden", searchPlaceholder: "Suchen..." },
    about: { title: "Über mich", subtitle: "Natalia Melkher", bio: "Ich bin Natalia Melkher, inspiriert von der Schönheit der Welt.", philosophy: "Meine Philosophie", philosophyText: "Das Wort ist das mächtigste Werkzeug der Menschheit." },
    footer: { copyright: "© 2026 Natalia Melkher", madeWith: "Erstellt mit", inspiration: "und Inspiration", rights: "Alle Rechte vorbehalten" },
    common: { loading: "Laden...", error: "Fehler", retry: "Wiederholen", close: "Schließen", language: "Sprache", share: "Teilen", copy: "Kopieren", copied: "Kopiert!" },
  },
  fr: {
    nav: { home: "Accueil", poetry: "Poésie", prose: "Prose", about: "À propos", contact: "Contact" },
    hero: { greeting: "Bienvenue dans le monde de", title: "Natalia Melkher", subtitle: "Un espace d'inspiration où les mots trouvent leurs ailes", cta: "Lire la poésie", ctaSecondary: "Explorer la prose" },
    sections: { latestWorks: "Dernières œuvres", poetry: "Poésie", prose: "Prose", featured: "En vedette", allWorks: "Tout", readMore: "Lire la suite", backToHome: "Accueil", minuteRead: "min", views: "vues", likes: "j'aime", publishedOn: "Publié", tags: "Tags", noWorksFound: "Aucune œuvre trouvée", searchPlaceholder: "Rechercher..." },
    about: { title: "À propos", subtitle: "Natalia Melkher", bio: "Je suis Natalia Melkher, inspirée par la beauté du monde.", philosophy: "Ma philosophie", philosophyText: "Le mot est l'outil le plus puissant donné à l'humanité." },
    footer: { copyright: "© 2026 Natalia Melkher", madeWith: "Créé avec", inspiration: "et inspiration", rights: "Tous droits réservés" },
    common: { loading: "Chargement...", error: "Erreur", retry: "Réessayer", close: "Fermer", language: "Langue", share: "Partager", copy: "Copier", copied: "Copié !" },
  },
  zh: {
    nav: { home: "首页", poetry: "诗歌", prose: "散文", about: "关于", contact: "联系" },
    hero: { greeting: "欢迎来到", title: "娜塔莉亚·梅尔赫", subtitle: "灵感的空间，文字找到翅膀的地方", cta: "阅读诗歌", ctaSecondary: "探索散文" },
    sections: { latestWorks: "最新作品", poetry: "诗歌", prose: "散文", featured: "精选", allWorks: "全部", readMore: "阅读更多", backToHome: "返回首页", minuteRead: "分钟", views: "浏览", likes: "喜欢", publishedOn: "发布于", tags: "标签", noWorksFound: "未找到作品", searchPlaceholder: "搜索..." },
    about: { title: "关于我", subtitle: "娜塔莉亚·梅尔赫", bio: "我是娜塔莉亚·梅尔赫，被世界之美所启发的作家。", philosophy: "我的哲学", philosophyText: "文字是赋予人类最强大的工具。" },
    footer: { copyright: "© 2026 娜塔莉亚·梅尔赫", madeWith: "用", inspiration: "和灵感创建", rights: "版权所有" },
    common: { loading: "加载中...", error: "错误", retry: "重试", close: "关闭", language: "语言", share: "分享", copy: "复制", copied: "已复制！" },
  },
  ko: {
    nav: { home: "홈", poetry: "시", prose: "산문", about: "소개", contact: "연락처" },
    hero: { greeting: "환영합니다", title: "나탈리아 멜허", subtitle: "영감의 공간, 단어가 날개를 찾는 곳", cta: "시 읽기", ctaSecondary: "산문 탐색" },
    sections: { latestWorks: "최신 작품", poetry: "시", prose: "산문", featured: "추천", allWorks: "전체", readMore: "더 읽기", backToHome: "홈으로", minuteRead: "분", views: "조회", likes: "좋아요", publishedOn: "게시", tags: "태그", noWorksFound: "작품 없음", searchPlaceholder: "검색..." },
    about: { title: "소개", subtitle: "나탈리아 멜허", bio: "저는 세상의 아름다움에 영감을 받은 작가입니다.", philosophy: "나의 철학", philosophyText: "말은 인류에게 주어진 가장 강력한 도구입니다." },
    footer: { copyright: "© 2026 나탈리아 멜허", madeWith: "만든", inspiration: "영감으로", rights: "모든 권리 보유" },
    common: { loading: "로딩...", error: "오류", retry: "다시", close: "닫기", language: "언어", share: "공유", copy: "복사", copied: "복사됨!" },
  },
};
`);

// ============================================================
// context/LanguageContext.tsx
// ============================================================
w("context/LanguageContext.tsx",
`"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Language, TranslationStrings } from "@/types";
import { translations } from "@/data/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>("ru");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("natalia-lang") as Language;
      if (saved && translations[saved]) setLang(saved);
    } catch {}
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    try { localStorage.setItem("natalia-lang", lang); } catch {}
    document.documentElement.lang = lang;
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
`);

// ============================================================
// data/works.ts
// ============================================================
w("data/works.ts",
`import type { TranslatedWork } from "@/types";

export const works: TranslatedWork[] = [
  {
    id: "poem-001",
    title: "Тишина рассвета",
    content: "Когда мир ещё спит в объятьях ночи,\\nИ звёзды гаснут тихо, одна за одной,\\nРождается строка — нежнее, чем прочие,\\nКак первый луч рассвета золотой.\\n\\nВ той тишине я слышу голос вечности,\\nОн шепчет мне о том, что всё пройдёт,\\nНо красота останется в сердечности,\\nИ слово — словно птица — запоёт.",
    excerpt: "Когда мир ещё спит в объятьях ночи...",
    category: "poetry", tags: ["рассвет", "тишина", "природа"],
    createdAt: "2026-01-15T08:00:00Z", updatedAt: "2026-01-15T08:00:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 342, likes: 89,
    translations: {
      en: { title: "The Silence of Dawn", content: "When the world still sleeps in the embrace of night,\\nAnd stars fade quietly, one by one,\\nA line is born — more tender than the light,\\nLike the first golden ray of morning sun.", excerpt: "When the world still sleeps..." },
      de: { title: "Die Stille der Morgendämmerung", content: "Wenn die Welt noch schläft in der Umarmung der Nacht...", excerpt: "Wenn die Welt noch schläft..." },
      fr: { title: "Le Silence de l'Aube", content: "Quand le monde dort encore dans les bras de la nuit...", excerpt: "Quand le monde dort encore..." },
      zh: { title: "黎明的寂静", content: "当世界仍在夜的怀抱中沉睡...", excerpt: "当世界仍在夜的怀抱中沉睡..." },
      ko: { title: "새벽의 고요", content: "세상이 아직 밤의 품에서 잠들어 있을 때...", excerpt: "세상이 아직 밤의 품에서..." },
    },
  },
  {
    id: "poem-002",
    title: "Осенние строки",
    content: "Листья падают — как слова,\\nЧто не сказаны вовремя.\\nВетер пишет на земле\\nПисьма будущей весне.\\n\\nЗолотая тишина\\nРасстилается повсюду,\\nКаждый лист — как строчка та,\\nЧто хранить я вечно буду.",
    excerpt: "Листья падают — как слова...",
    category: "poetry", tags: ["осень", "природа", "мудрость"],
    createdAt: "2026-02-03T10:30:00Z", updatedAt: "2026-02-03T10:30:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 278, likes: 67,
    translations: {
      en: { title: "Autumn Lines", content: "Leaves fall — like words\\nThat were never said in time.", excerpt: "Leaves fall — like words..." },
      de: { title: "Herbstzeilen", content: "Blätter fallen — wie Worte...", excerpt: "Blätter fallen..." },
      fr: { title: "Lignes d'automne", content: "Les feuilles tombent — comme des mots...", excerpt: "Les feuilles tombent..." },
      zh: { title: "秋日诗行", content: "落叶——如同未曾及时说出的话语。", excerpt: "落叶——如同..." },
      ko: { title: "가을의 시구", content: "낙엽이 진다 — 마치 제때 하지 못한 말처럼.", excerpt: "낙엽이 진다..." },
    },
  },
  {
    id: "poem-003",
    title: "Колыбельная для звёзд",
    content: "Спите, звёзды, спите тихо,\\nНочь укроет вас собой,\\nПусть луна споёт вам лихо\\nПесню нежности ночной.",
    excerpt: "Спите, звёзды, спите тихо...",
    category: "poetry", tags: ["звёзды", "ночь", "космос"],
    createdAt: "2026-02-14T22:00:00Z", updatedAt: "2026-02-14T22:00:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 415, likes: 112,
    translations: {
      en: { title: "Lullaby for the Stars", content: "Sleep, dear stars, sleep so still...", excerpt: "Sleep, dear stars..." },
      de: { title: "Schlaflied für die Sterne", content: "Schlaft, ihr Sterne, schlaft ganz leise...", excerpt: "Schlaft, ihr Sterne..." },
      fr: { title: "Berceuse pour les étoiles", content: "Dormez, étoiles, dormez doucement...", excerpt: "Dormez, étoiles..." },
      zh: { title: "星星的摇篮曲", content: "安睡吧，星星们，静静地安睡...", excerpt: "安睡吧..." },
      ko: { title: "별들을 위한 자장가", content: "잠들어라, 별들아, 조용히 잠들어라...", excerpt: "잠들어라..." },
    },
  },
  {
    id: "poem-004",
    title: "Танец дождя",
    content: "Дождь танцует на стекле,\\nКаждой каплей — нота в песне,\\nМир становится светлей,\\nКогда небо плачет вместе.",
    excerpt: "Дождь танцует на стекле...",
    category: "poetry", tags: ["дождь", "танец", "весна"],
    createdAt: "2026-03-01T14:00:00Z", updatedAt: "2026-03-01T14:00:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 156, likes: 43,
    translations: {
      en: { title: "Dance of the Rain", content: "The rain is dancing on the glass...", excerpt: "The rain is dancing..." },
      de: { title: "Tanz des Regens", content: "Der Regen tanzt auf dem Glas...", excerpt: "Der Regen tanzt..." },
      fr: { title: "La Danse de la Pluie", content: "La pluie danse sur la vitre...", excerpt: "La pluie danse..." },
      zh: { title: "雨之舞", content: "雨在玻璃上跳舞...", excerpt: "雨在玻璃上..." },
      ko: { title: "비의 춤", content: "비가 유리 위에서 춤춘다...", excerpt: "비가 유리 위에서..." },
    },
  },
  {
    id: "prose-001",
    title: "Дорога к себе",
    content: "Есть пути, которые ведут через весь мир, и есть дорога, которая начинается в тишине собственного сердца.\\n\\nОна проснулась тем утром с ощущением, что что-то изменилось. Изменилось что-то внутри, словно невидимая стрелка компаса наконец-то нашла свой север.\\n\\n«Дорога к себе — это не путешествие куда-то. Это возвращение.»\\n\\nОна закрыла тетрадь, улыбнулась солнцу и пошла дальше.",
    excerpt: "Есть пути, которые ведут через весь мир...",
    category: "prose", tags: ["самопознание", "путь", "мудрость"],
    createdAt: "2026-01-20T12:00:00Z", updatedAt: "2026-01-20T12:00:00Z",
    isPublished: true, language: "ru", readingTime: 5, views: 523, likes: 147,
    translations: {
      en: { title: "The Road to Yourself", content: "There are paths that lead across the entire world, and there is a road that begins in the silence of your own heart.", excerpt: "There are paths..." },
      de: { title: "Der Weg zu sich selbst", content: "Es gibt Wege, die durch die ganze Welt führen...", excerpt: "Es gibt Wege..." },
      fr: { title: "Le Chemin vers soi", content: "Il y a des chemins qui traversent le monde entier...", excerpt: "Il y a des chemins..." },
      zh: { title: "通往自我的路", content: "有些路穿越整个世界...", excerpt: "有些路穿越整个世界..." },
      ko: { title: "자신에게로 가는 길", content: "온 세상을 가로지르는 길이 있고...", excerpt: "온 세상을 가로지르는..." },
    },
  },
  {
    id: "prose-002",
    title: "Письмо из будущего",
    content: "Дорогая я из прошлого,\\n\\nЯ пишу тебе из будущего. Перестань торопиться. Ты уже здесь.\\n\\nТы спрашиваешь, стоит ли это всё того? Да. Тысячу раз да.\\n\\nС любовью из твоего будущего,\\nТы.\\n\\nP.S. Та тетрадь, которую ты хочешь выбросить — не выбрасывай. В ней — начало всего.",
    excerpt: "Дорогая я из прошлого...",
    category: "prose", tags: ["письмо", "будущее", "надежда"],
    createdAt: "2026-02-10T18:00:00Z", updatedAt: "2026-02-10T18:00:00Z",
    isPublished: true, language: "ru", readingTime: 4, views: 687, likes: 203,
    translations: {
      en: { title: "A Letter from the Future", content: "Dear me from the past,\\n\\nI am writing from the future. Stop rushing. You are already here.", excerpt: "Dear me from the past..." },
      de: { title: "Ein Brief aus der Zukunft", content: "Liebes Ich aus der Vergangenheit...", excerpt: "Liebes Ich..." },
      fr: { title: "Une lettre du futur", content: "Chère moi du passé...", excerpt: "Chère moi..." },
      zh: { title: "来自未来的信", content: "亲爱的过去的我...", excerpt: "亲爱的过去的我..." },
      ko: { title: "미래에서 온 편지", content: "과거의 나에게...", excerpt: "과거의 나에게..." },
    },
  },
];

export function getWorksByCategory(category: string): TranslatedWork[] {
  return works.filter((w) => w.category === category && w.isPublished);
}
export function getWorkById(id: string): TranslatedWork | undefined {
  return works.find((w) => w.id === id);
}
export function getAllPublishedWorks(): TranslatedWork[] {
  return works.filter((w) => w.isPublished);
}
export function searchWorks(query: string): TranslatedWork[] {
  const q = query.toLowerCase();
  return works.filter((w) => w.isPublished && (w.title.toLowerCase().includes(q) || w.content.toLowerCase().includes(q)));
}
`);

// ============================================================
// components/AnimatedSection.tsx
// ============================================================
w("components/AnimatedSection.tsx",
`"use client";

import React, { useRef, useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
}

export default function AnimatedSection({ children, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);

  return (
    <div ref={ref} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: \`opacity 0.7s ease \${delay}ms, transform 0.7s ease \${delay}ms\` }}>
      {children}
    </div>
  );
}
`);

// ============================================================
// components/ParticleBackground.tsx
// ============================================================
w("components/ParticleBackground.tsx",
`"use client";

import React, { useMemo } from "react";

export default function ParticleBackground() {
  const particles = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i, left: Math.random() * 100 + "%", dur: 15 + Math.random() * 20 + "s",
    del: Math.random() * 15 + "s", size: 2 + Math.random() * 4 + "px", opacity: 0.1 + Math.random() * 0.3,
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full animate-bounce"
          style={{ left: p.left, width: p.size, height: p.size, opacity: p.opacity,
            animationDuration: p.dur, animationDelay: p.del,
            background: "radial-gradient(circle, rgba(217,70,239,0.8), rgba(234,179,8,0.4))" }} />
      ))}
    </div>
  );
}
`);

// ============================================================
// components/LanguageSwitcher.tsx
// ============================================================
w("components/LanguageSwitcher.tsx",
`"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { languages } from "@/data/translations";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languages.find((l) => l.code === language);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 backdrop-blur border border-white/10 text-sm text-gray-200 hover:text-white transition-all">
        <span className="text-xl">{current?.flag}</span>
        <span className="hidden sm:inline">{current?.nativeName}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 z-50 bg-gray-900/95 backdrop-blur rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {languages.map((lang) => (
            <button key={lang.code} onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={"w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-white/10 " + (language === lang.code ? "bg-purple-500/20 text-purple-300" : "text-gray-300")}>
              <span className="text-2xl">{lang.flag}</span>
              <div><div className="text-sm font-medium">{lang.nativeName}</div><div className="text-xs text-gray-500">{lang.name}</div></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
`);

// ============================================================
// components/Header.tsx
// ============================================================
w("components/Header.tsx",
`"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/poetry", label: t.nav.poetry },
    { href: "/prose", label: t.nav.prose },
    { href: "/about", label: t.nav.about },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header className={"fixed top-0 left-0 right-0 z-50 transition-all duration-500 " + (scrolled ? "bg-gray-950/80 backdrop-blur-xl shadow-lg py-3" : "bg-transparent py-5")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg">НМ</div>
          <div className="flex flex-col">
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 text-lg leading-tight">Наталья Мельхер</span>
            <span className="text-[10px] text-gray-500 tracking-widest uppercase">Poetry & Inspiration</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={"px-4 py-2 rounded-xl text-sm font-medium transition-all " + (active ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white hover:bg-white/5")}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <div className="flex flex-col gap-1.5">
              <span className={"w-6 h-0.5 bg-gray-300 rounded transition-all " + (mobileOpen ? "rotate-45 translate-y-2" : "")} />
              <span className={"w-6 h-0.5 bg-gray-300 rounded transition-all " + (mobileOpen ? "opacity-0" : "")} />
              <span className={"w-6 h-0.5 bg-gray-300 rounded transition-all " + (mobileOpen ? "-rotate-45 -translate-y-2" : "")} />
            </div>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-gray-950/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8" onClick={() => setMobileOpen(false)}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-3xl font-bold text-gray-300 hover:text-white transition-all">{item.label}</Link>
          ))}
        </div>
      )}
    </header>
  );
}
`);

// ============================================================
// components/Footer.tsx
// ============================================================
w("components/Footer.tsx",
`"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/"><span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 text-xl">Наталья Мельхер</span></Link>
        <p className="text-sm text-gray-500">{t.footer.copyright}. {t.footer.rights}.</p>
        <nav className="flex gap-4 text-sm">
          <Link href="/poetry" className="text-gray-500 hover:text-purple-400">{t.nav.poetry}</Link>
          <Link href="/prose" className="text-gray-500 hover:text-purple-400">{t.nav.prose}</Link>
          <Link href="/about" className="text-gray-500 hover:text-purple-400">{t.nav.about}</Link>
        </nav>
      </div>
    </footer>
  );
}
`);

// ============================================================
// components/PoemCard.tsx
// ============================================================
w("components/PoemCard.tsx",
`"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";
import { formatDate, getLocale } from "@/lib/utils";

export default function PoemCard({ work, index = 0 }: { work: TranslatedWork; index?: number }) {
  const { language, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [likes, setLikes] = useState(work.likes);
  const [liked, setLiked] = useState(false);

  const tr = language !== "ru" ? work.translations[language] : undefined;
  const title = tr?.title || work.title;
  const content = tr?.content || work.content;
  const excerpt = tr?.excerpt || work.excerpt;

  return (
    <article className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-500">
      <div className="h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-amber-500" />
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between mb-4">
          <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">{t.sections.poetry}</span>
          <time className="text-xs text-gray-600">{formatDate(work.createdAt, getLocale(language))}</time>
        </div>
        <h3 className="text-2xl font-bold text-gray-100 hover:text-purple-300 transition-colors mb-4">{title}</h3>
        <div className="flex items-center gap-3 mb-4 opacity-40">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          <span className="text-purple-400">✦</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>
        <div className="text-gray-300 leading-relaxed" style={{ whiteSpace: "pre-line" }}>
          {expanded ? content : excerpt}
        </div>
        <button onClick={() => setExpanded(!expanded)} className="mt-4 text-sm text-purple-400 hover:text-purple-300">
          {expanded ? t.common.close : t.sections.readMore}
        </button>
        <div className="flex flex-wrap gap-2 mt-4">
          {work.tags.map((tag) => <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 text-gray-500">#{tag}</span>)}
        </div>
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
          <button onClick={() => { setLiked(!liked); setLikes(p => liked ? p-1 : p+1); }}
            className={"text-sm " + (liked ? "text-red-400" : "text-gray-500")}>
            {liked ? "❤️" : "🤍"} {likes}
          </button>
          <span className="text-sm text-gray-500">👁 {work.views}</span>
        </div>
      </div>
    </article>
  );
}
`);

// ============================================================
// components/ProseCard.tsx
// ============================================================
w("components/ProseCard.tsx",
`"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";
import { formatDate, getLocale } from "@/lib/utils";

export default function ProseCard({ work, index = 0 }: { work: TranslatedWork; index?: number }) {
  const { language, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [likes, setLikes] = useState(work.likes);
  const [liked, setLiked] = useState(false);

  const tr = language !== "ru" ? work.translations[language] : undefined;
  const title = tr?.title || work.title;
  const content = tr?.content || work.content;
  const excerpt = tr?.excerpt || work.excerpt;

  return (
    <article className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-500">
      <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-purple-500" />
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between mb-4">
          <span className="px-3 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400">{t.sections.prose}</span>
          <time className="text-xs text-gray-600">{formatDate(work.createdAt, getLocale(language))}</time>
        </div>
        <h3 className="text-2xl font-bold text-gray-100 hover:text-amber-300 transition-colors mb-4">{title}</h3>
        <div className="flex items-center gap-3 mb-4 opacity-40">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          <span className="text-amber-400">❧</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        </div>
        <div className="text-gray-300 leading-relaxed">{expanded ? content : excerpt}</div>
        <button onClick={() => setExpanded(!expanded)} className="mt-4 text-sm text-amber-400 hover:text-amber-300">
          {expanded ? t.common.close : t.sections.readMore}
        </button>
        <div className="flex flex-wrap gap-2 mt-4">
          {work.tags.map((tag) => <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 text-gray-500">#{tag}</span>)}
        </div>
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
          <button onClick={() => { setLiked(!liked); setLikes(p => liked ? p-1 : p+1); }}
            className={"text-sm " + (liked ? "text-red-400" : "text-gray-500")}>
            {liked ? "❤️" : "🤍"} {likes}
          </button>
          <span className="text-sm text-gray-500">👁 {work.views}</span>
        </div>
      </div>
    </article>
  );
}
`);

// ============================================================
// app/globals.css
// ============================================================
w("app/globals.css",
`@import "tailwindcss";

:root {
  --color-midnight: #0a0a1a;
  --color-velvet: #1a0a2e;
  --color-ink: #0d1b2a;
}

body {
  background: var(--color-midnight);
  color: #e2e8f0;
}

.gradient-text {
  background: linear-gradient(135deg, #d946ef, #f59e0b, #d946ef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: gradient-shift 5s ease infinite;
}

.gradient-text-gold {
  background: linear-gradient(135deg, #f59e0b, #d946ef, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
`);

// ============================================================
// app/layout.tsx
// ============================================================
w("app/layout.tsx",
`import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "Наталья Мельхер — Поэзия и Вдохновение",
  description: "Пространство вдохновения, поэзии и прозы Натальи Мельхер",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <LanguageProvider>
          <ParticleBackground />
          <Header />
          <main className="flex-1 relative z-10 pt-20">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
`);

// ============================================================
// app/page.tsx (HOME)
// ============================================================
w("app/page.tsx",
`"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedSection from "@/components/AnimatedSection";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen">
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        <AnimatedSection delay={200}>
          <p className="text-xl sm:text-2xl text-purple-400/80 mb-4 italic">{t.hero.greeting}</p>
        </AnimatedSection>
        <AnimatedSection delay={400}>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold gradient-text mb-6 leading-tight">{t.hero.title}</h1>
        </AnimatedSection>
        <AnimatedSection delay={600}>
          <p className="max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed mb-10">{t.hero.subtitle}</p>
        </AnimatedSection>
        <AnimatedSection delay={800}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/poetry" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/25">{t.hero.cta}</Link>
            <Link href="/prose" className="px-8 py-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-gray-300 font-semibold text-lg hover:text-white hover:bg-white/10 transition-all">{t.hero.ctaSecondary}</Link>
          </div>
        </AnimatedSection>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <AnimatedSection>
          <blockquote className="text-2xl sm:text-3xl font-light text-gray-300 italic leading-relaxed">
            &ldquo;Слово — это самый мощный инструмент, данный человеку.&rdquo;
          </blockquote>
          <p className="mt-6 text-xl text-purple-400 italic">— Наталья Мельхер</p>
        </AnimatedSection>
      </section>
    </div>
  );
}
`);

// ============================================================
// app/poetry/page.tsx
// ============================================================
w("app/poetry/page.tsx",
`"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getWorksByCategory } from "@/data/works";
import PoemCard from "@/components/PoemCard";
import AnimatedSection from "@/components/AnimatedSection";

export default function PoetryPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const allPoems = getWorksByCategory("poetry");
  const allTags = useMemo(() => {
    const s = new Set<string>();
    allPoems.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [allPoems]);

  const filtered = useMemo(() => allPoems.filter((p) => {
    const ms = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
    const mt = !tag || p.tags.includes(tag);
    return ms && mt;
  }), [allPoems, search, tag]);

  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-12 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text mb-4">{t.sections.poetry}</h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">{t.hero.subtitle}</p>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="mt-8 max-w-md mx-auto">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.sections.searchPlaceholder}
                className="w-full px-6 py-3 rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button onClick={() => setTag(null)}
                className={"px-4 py-1.5 text-xs rounded-full transition-all " + (!tag ? "bg-purple-500/30 text-purple-300 border border-purple-500/50" : "bg-white/5 text-gray-500 hover:text-gray-300")}>{t.sections.allWorks}</button>
              {allTags.map((t2) => (
                <button key={t2} onClick={() => setTag(tag === t2 ? null : t2)}
                  className={"px-4 py-1.5 text-xs rounded-full transition-all " + (tag === t2 ? "bg-purple-500/30 text-purple-300 border border-purple-500/50" : "bg-white/5 text-gray-500 hover:text-gray-300")}>#{t2}</button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-4 pb-20">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filtered.map((poem, i) => (
              <AnimatedSection key={poem.id} delay={i * 150}>
                <PoemCard work={poem} index={i} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">{t.sections.noWorksFound}</p>
            <button onClick={() => { setSearch(""); setTag(null); }} className="mt-4 text-purple-400">{t.common.retry}</button>
          </div>
        )}
      </section>
    </div>
  );
}
`);

// ============================================================
// app/prose/page.tsx
// ============================================================
w("app/prose/page.tsx",
`"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getWorksByCategory } from "@/data/works";
import ProseCard from "@/components/ProseCard";
import AnimatedSection from "@/components/AnimatedSection";

export default function ProsePage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const allProse = getWorksByCategory("prose");
  const allTags = useMemo(() => {
    const s = new Set<string>();
    allProse.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [allProse]);

  const filtered = useMemo(() => allProse.filter((p) => {
    const ms = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
    const mt = !tag || p.tags.includes(tag);
    return ms && mt;
  }), [allProse, search, tag]);

  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-12 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text-gold mb-4">{t.sections.prose}</h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">{t.hero.subtitle}</p>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="mt-8 max-w-md mx-auto">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.sections.searchPlaceholder}
                className="w-full px-6 py-3 rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button onClick={() => setTag(null)}
                className={"px-4 py-1.5 text-xs rounded-full transition-all " + (!tag ? "bg-amber-500/30 text-amber-300 border border-amber-500/50" : "bg-white/5 text-gray-500")}>{t.sections.allWorks}</button>
              {allTags.map((t2) => (
                <button key={t2} onClick={() => setTag(tag === t2 ? null : t2)}
                  className={"px-4 py-1.5 text-xs rounded-full transition-all " + (tag === t2 ? "bg-amber-500/30 text-amber-300 border border-amber-500/50" : "bg-white/5 text-gray-500")}>#{t2}</button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 pb-20">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-8">
            {filtered.map((item, i) => (
              <AnimatedSection key={item.id} delay={i * 200}>
                <ProseCard work={item} index={i} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">{t.sections.noWorksFound}</p>
            <button onClick={() => { setSearch(""); setTag(null); }} className="mt-4 text-amber-400">{t.common.retry}</button>
          </div>
        )}
      </section>
    </div>
  );
}
`);

// ============================================================
// app/about/page.tsx
// ============================================================
w("app/about/page.tsx",
`"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedSection from "@/components/AnimatedSection";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-16 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <AnimatedSection>
            <h1 className="text-center text-5xl sm:text-6xl md:text-7xl font-bold gradient-text mb-16">{t.about.title}</h1>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-3xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-500 via-amber-500 to-purple-500" />
              <div className="p-8 sm:p-12">
                <div className="flex flex-col items-center mb-10">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-amber-500 to-purple-500 opacity-50 animate-spin" style={{animationDuration:"10s"}} />
                    <div className="absolute inset-1 rounded-full bg-gray-950" />
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-900 to-gray-900 flex items-center justify-center">
                      <span className="text-4xl sm:text-5xl font-bold gradient-text">НМ</span>
                    </div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-100">{t.about.subtitle}</h2>
                  <p className="text-lg text-purple-400/80 mt-1 italic">Poet & Writer</p>
                </div>
                <div className="text-gray-300 leading-relaxed text-lg"><p>{t.about.bio}</p></div>
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-100 mb-4">{t.about.philosophy}</h3>
                  <blockquote className="border-l-2 border-purple-500/50 pl-6">
                    <p className="text-gray-300 text-lg italic">{t.about.philosophyText}</p>
                  </blockquote>
                </div>
                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[{v:"50+",l:"Poems"},{v:"20+",l:"Stories"},{v:"6",l:"Languages"},{v:"\\u221e",l:"Inspiration"}].map((s,i) => (
                    <div key={i} className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="text-3xl font-bold gradient-text">{s.v}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
`);

// ============================================================
// app/api/works/route.ts
// ============================================================
w("app/api/works/route.ts",
`import { NextRequest, NextResponse } from "next/server";
import { getAllPublishedWorks, getWorksByCategory, searchWorks } from "@/data/works";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    let results;
    if (query) results = searchWorks(query);
    else if (category) results = getWorksByCategory(category);
    else results = getAllPublishedWorks();

    return NextResponse.json({ success: true, data: results, total: results.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
`);

console.log("\\n🎉 ALL FILES CREATED SUCCESSFULLY!");
console.log("\\nNow run:");
console.log("  npm run dev");
console.log("\\nThen open:");
console.log("  http://localhost:3000");
console.log("  http://localhost:3000/poetry");
console.log("  http://localhost:3000/prose");
console.log("  http://localhost:3000/about");
console.log("  http://localhost:3000/api/works");
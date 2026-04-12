export type Language = "ru" | "en" | "de" | "fr" | "zh" | "ko";

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export type WorkCategory =
  | "poetry"
  | "prose"
  | "essay"
  | "notes"
  | "quotes"
  | "inspiration";

export interface Work {
  id: string;
  /** Сегмент URL: /poetry/moy-stih, /prose/moy-rasskaz */
  slug?: string;
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
  nav: {
    home: string;
    poetry: string;
    prose: string;
    essay: string;
    notes: string;
    quotes: string;
    inspiration: string;
    more: string;
    textsHub: string;
    about: string;
    contact: string;
  };
  hero: { greeting: string; title: string; subtitle: string; cta: string; ctaSecondary: string };
  sections: {
    latestWorks: string; poetry: string; prose: string; featured: string;
    essay: string;
    notes: string;
    quotes: string;
    inspiration: string;
    poetryIntro: string;
    proseIntro: string;
    essayIntro: string;
    notesIntro: string;
    quotesIntro: string;
    inspirationIntro: string;
    allWorks: string; readMore: string; backToHome: string; minuteRead: string;
    views: string; likes: string; publishedOn: string; tags: string;
    noWorksFound: string; searchPlaceholder: string;
    /** Подсказка вместо «0 просмотров» — конверсия в чтение */
    inviteFirstRead: string;
    /** Подсказка вместо «0 лайков» на карточке прозы */
    inviteFirstHeart: string;
    /** Страница /texts — краткое описание хаба разделов */
    textsHubIntro: string;
    /** Короткая подпись над заголовком на /texts */
    textsHubEyebrow: string;
  };
  about: { title: string; subtitle: string; bio: string; philosophy: string; philosophyText: string };
  footer: { copyright: string; madeWith: string; inspiration: string; rights: string };
  common: { loading: string; error: string; retry: string; close: string; language: string; share: string; copy: string; copied: string };
}

export type Translations = Record<Language, TranslationStrings>;

export interface AdminWork extends TranslatedWork {
  _draft?: boolean;
}

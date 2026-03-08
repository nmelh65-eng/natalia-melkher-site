export type Language = "ru" | "en" | "de" | "fr" | "zh" | "ko";

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

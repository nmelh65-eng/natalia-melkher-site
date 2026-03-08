"use client";

import React, {
  createContext, useContext, useState, useEffect, useCallback
} from "react";
import type { Language, TranslationStrings } from "@/types";
import { translations } from "@/data/translations";

interface LanguageContextType {
  language:    Language;
  setLanguage: (lang: Language) => void;
  t:           TranslationStrings;
  mounted:     boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Всегда начинаем с "ru" на сервере — избегаем mismatch
  const [language, setLang] = useState<Language>("ru");
  const [mounted,  setMounted] = useState(false);

  useEffect(() => {
    // Читаем localStorage только на клиенте, после монтирования
    setMounted(true);
    try {
      const saved = localStorage.getItem("natalia-lang") as Language;
      if (saved && translations[saved]) setLang(saved);
    } catch {}
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    try { localStorage.setItem("natalia-lang", lang); } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, []);

  const value = {
    language,
    setLanguage,
    t: translations[language],
    mounted,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

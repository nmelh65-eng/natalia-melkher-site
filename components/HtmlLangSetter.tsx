"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const langMap: Record<string, string> = {
  ru: "ru",
  en: "en",
  de: "de",
  fr: "fr",
  zh: "zh-CN",
  ko: "ko",
};

export default function HtmlLangSetter() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = langMap[language] || "ru";
  }, [language]);

  return null;
}

"use client";

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

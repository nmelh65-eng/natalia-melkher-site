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
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Сменить язык"
        aria-expanded={open}
        className="group flex items-center gap-2 sm:gap-2.5 px-3.5 py-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur text-sm text-gray-200 hover:text-white hover:bg-white/[0.06] transition-all"
      >
        <span className="text-lg leading-none">{current?.flag}</span>
        <span className="hidden sm:inline text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
          {current?.nativeName}
        </span>
        <span className="text-[10px] text-gray-500 group-hover:text-gray-300 transition-colors">
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 z-50 rounded-3xl border border-white/[0.08] bg-[#0b0b12]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="px-4 pt-4 pb-2 text-[10px] uppercase tracking-[0.22em] text-gray-500">
            Language
          </div>

          <div className="p-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                className={
                  "w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-all " +
                  (language === lang.code
                    ? "bg-purple-500/15 text-purple-200 border border-purple-400/20"
                    : "text-gray-300 hover:bg-white/[0.05]")
                }
              >
                <span className="text-2xl leading-none">{lang.flag}</span>

                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">
                    {lang.nativeName}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {lang.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

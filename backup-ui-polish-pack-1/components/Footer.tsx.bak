"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  // Год рендерим только на клиенте
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  return (
    <footer className="relative mt-24 border-t border-white/[0.04] overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-400 text-2xl">
                Наталья Мельхер
              </span>
            </Link>
            <p className="font-serif text-gray-500 italic text-sm leading-relaxed">
              &ldquo;Где слова обретают крылья&rdquo;
            </p>
            <div className="mt-4 flex gap-2">
              <a href="mailto:natalia@melkher.com"
                className="w-9 h-9 rounded-xl glass flex items-center justify-center text-sm hover:border-purple-500/30 transition-colors">
                📧
              </a>
              <a href="https://t.me/nataliamelkher" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl glass flex items-center justify-center text-sm hover:border-amber-500/30 transition-colors">
                ✈️
              </a>
              <a href="#"
                className="w-9 h-9 rounded-xl glass flex items-center justify-center text-sm hover:border-pink-500/30 transition-colors">
                📸
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-5">Навигация</h4>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/poetry",  label: t.nav.poetry,  color: "hover:text-purple-400" },
                { href: "/prose",   label: t.nav.prose,   color: "hover:text-amber-400"  },
                { href: "/about",   label: t.nav.about,   color: "hover:text-purple-400" },
                { href: "/contact", label: t.nav.contact, color: "hover:text-purple-400" },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className={`text-gray-500 ${item.color} transition-colors text-sm flex items-center gap-2 group`}>
                  <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-purple-400 transition-colors" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-5">Контакты</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:natalia@melkher.com"
                className="flex items-center gap-2 text-gray-500 hover:text-purple-400 transition-colors text-sm group">
                <span className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xs group-hover:bg-purple-500/20 transition-colors">
                  📧
                </span>
                natalia@melkher.com
              </a>
              <a href="https://t.me/nataliamelkher" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-500 hover:text-amber-400 transition-colors text-sm group">
                <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs group-hover:bg-amber-500/20 transition-colors">
                  ✈️
                </span>
                @nataliamelkher
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600" suppressHydrationWarning>
            {year ? `© ${year} Наталья Мельхер. ${t.footer.rights}.` : `© Наталья Мельхер. ${t.footer.rights}.`}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span>{t.footer.madeWith}</span>
            <span className="text-purple-400 mx-1">💜</span>
            <span>{t.footer.inspiration}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

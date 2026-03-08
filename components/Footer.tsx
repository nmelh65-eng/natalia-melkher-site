"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 text-2xl">Наталья Мельхер</span>
            </Link>
            <p className="mt-3 font-serif text-gray-500 italic text-sm">&ldquo;Где слова обретают крылья&rdquo;</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Навигация</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/poetry" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">{t.nav.poetry}</Link>
              <Link href="/prose" className="text-gray-500 hover:text-amber-400 transition-colors text-sm">{t.nav.prose}</Link>
              <Link href="/about" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">{t.nav.about}</Link>
              <Link href="/contact" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">{t.nav.contact}</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Контакты</h4>
            <div className="flex flex-col gap-2">
              <a href="mailto:natalia@melkher.com" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">📧 natalia@melkher.com</a>
              <a href="https://t.me/nataliamelkher" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amber-400 transition-colors text-sm">✈️ Telegram</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">{t.footer.copyright}. {t.footer.rights}.</p>
          <p className="text-xs text-gray-600">{t.footer.madeWith} 💜 {t.footer.inspiration}</p>
        </div>
      </div>
    </footer>
  );
}

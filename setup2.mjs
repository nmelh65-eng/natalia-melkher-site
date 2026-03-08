import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
  console.log("✅ " + path);
}

w("context/LanguageContext.tsx", `"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Language, TranslationStrings } from "@/types";
import { translations } from "@/data/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>("ru");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], mounted }}>
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

w("app/layout.tsx", `import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], variable: "--font-display", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin", "cyrillic"], variable: "--font-serif", weight: ["300", "400", "500", "600", "700"], display: "swap" });
const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Наталья Мельхер — Поэзия и Вдохновение",
  description: "Личный сайт поэтессы и писательницы Натальи Мельхер. Поэзия, проза, вдохновение на шести языках.",
  keywords: ["Наталья Мельхер", "поэзия", "стихи", "проза", "литература", "Natalia Melkher", "poetry"],
  authors: [{ name: "Наталья Мельхер" }],
  openGraph: { title: "Наталья Мельхер — Поэзия и Вдохновение", description: "Пространство вдохновения, где слова обретают крылья", type: "website", locale: "ru_RU" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={\`\${playfair.variable} \${cormorant.variable} \${inter.variable}\`}>
      <body className="min-h-screen flex flex-col antialiased font-sans">
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

w("app/globals.css", `@import "tailwindcss";

@theme {
  --font-display: var(--font-display), "Playfair Display", Georgia, serif;
  --font-serif: var(--font-serif), "Cormorant Garamond", Georgia, serif;
  --font-sans: var(--font-sans), "Inter", system-ui, sans-serif;
  --color-midnight: #0a0a1a;
  --color-velvet: #1a0a2e;
  --color-ink: #0d1b2a;
}

body {
  background: var(--color-midnight);
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(120, 50, 180, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(200, 150, 50, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 100%, rgba(100, 50, 150, 0.05) 0%, transparent 50%);
  color: #e2e8f0;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0a0a1a; }
::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #a855f7, #f59e0b); border-radius: 3px; }
::selection { background: rgba(168, 85, 247, 0.3); color: #f3e8ff; }

.gradient-text {
  background: linear-gradient(135deg, #d946ef 0%, #a855f7 25%, #f59e0b 50%, #d946ef 75%, #a855f7 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  background-size: 300% 300%; animation: gradient-shift 6s ease infinite;
}
.gradient-text-gold {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 30%, #d946ef 60%, #f59e0b 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  background-size: 300% 300%; animation: gradient-shift 6s ease infinite;
}
@keyframes gradient-shift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

.glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
.glow-purple { box-shadow: 0 0 30px rgba(168,85,247,0.15); }
.glow-gold   { box-shadow: 0 0 30px rgba(245,158,11,0.15); }

.prose-text { font-family: var(--font-serif); line-height: 1.8; letter-spacing: 0.01em; }

.drop-cap::first-letter {
  font-family: var(--font-display); float: left; font-size: 3.5em; line-height: 0.8; margin: 0 0.1em 0 0;
  background: linear-gradient(135deg, #a855f7, #f59e0b);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 700;
}

@keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.6s ease forwards; }

@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.animate-float { animation: float 6s ease-in-out infinite; }

@keyframes pulse-glow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
.animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
`);

w("components/ParticleBackground.tsx", `"use client";
import React, { useMemo } from "react";
export default function ParticleBackground() {
  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100,
    duration: 20 + Math.random() * 30, delay: Math.random() * 20,
    size: 1 + Math.random() * 4, opacity: 0.05 + Math.random() * 0.2,
    color: i % 3 === 0 ? "168,85,247" : i % 3 === 1 ? "245,158,11" : "217,70,239",
  })), []);
  const orbs = useMemo(() => [
    { left: "15%", top: "20%", size: 300, color: "168,85,247", opacity: 0.03,  dur: 25 },
    { left: "75%", top: "60%", size: 250, color: "245,158,11", opacity: 0.025, dur: 30 },
    { left: "50%", top: "80%", size: 350, color: "217,70,239", opacity: 0.02,  dur: 35 },
  ], []);
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {orbs.map((orb, i) => (
        <div key={"orb-"+i} className="absolute rounded-full animate-pulse-glow"
          style={{ left: orb.left, top: orb.top, width: orb.size, height: orb.size,
            background: \`radial-gradient(circle, rgba(\${orb.color},\${orb.opacity}) 0%, transparent 70%)\`,
            animationDuration: orb.dur+"s", filter: "blur(60px)" }} />
      ))}
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full"
          style={{ left: p.left+"%", top: p.top+"%", width: p.size, height: p.size,
            backgroundColor: \`rgba(\${p.color},\${p.opacity})\`,
            animation: \`float \${p.duration}s ease-in-out \${p.delay}s infinite\` }} />
      ))}
    </div>
  );
}
`);

w("components/AnimatedSection.tsx", `"use client";
import React, { useRef, useEffect, useState } from "react";
interface Props { children: React.ReactNode; className?: string; delay?: number; }
export default function AnimatedSection({ children, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el); return () => obs.unobserve(el);
  }, []);
  return (
    <div ref={ref} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: \`opacity 0.7s ease \${delay}ms, transform 0.7s ease \${delay}ms\` }}>
      {children}
    </div>
  );
}
`);

w("components/LanguageSwitcher.tsx", `"use client";
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
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
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

w("components/Header.tsx", `"use client";
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
    { href: "/", label: t.nav.home }, { href: "/poetry", label: t.nav.poetry },
    { href: "/prose", label: t.nav.prose }, { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);
  return (
    <header className={"fixed top-0 left-0 right-0 z-50 transition-all duration-500 " + (scrolled ? "bg-gray-950/80 backdrop-blur-xl shadow-lg shadow-purple-500/5 py-3" : "bg-transparent py-5")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-amber-500 group-hover:rotate-6 transition-transform" />
            <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg">НМ</div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 text-lg leading-tight">Наталья Мельхер</span>
            <span className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Poetry & Inspiration</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={"relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 " + (active ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white hover:bg-white/5")}>
                {item.label}
                {active && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-purple-400 rounded-full" />}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            <div className="flex flex-col gap-1.5 w-6">
              <span className={"h-0.5 bg-gray-300 rounded transition-all duration-300 " + (mobileOpen ? "rotate-45 translate-y-2" : "")} />
              <span className={"h-0.5 bg-gray-300 rounded transition-all duration-300 " + (mobileOpen ? "opacity-0" : "")} />
              <span className={"h-0.5 bg-gray-300 rounded transition-all duration-300 " + (mobileOpen ? "-rotate-45 -translate-y-2" : "")} />
            </div>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-gray-950/98 backdrop-blur-2xl" />
          <div className="relative flex flex-col items-center justify-center h-full gap-8">
            {navItems.map((item, i) => (
              <Link key={item.href} href={item.href}
                className="font-display text-4xl font-bold text-gray-300 hover:text-white transition-all"
                style={{ animationDelay: i * 100 + "ms" }}>{item.label}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
`);

w("components/Footer.tsx", `"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link href="/"><span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 text-2xl">Наталья Мельхер</span></Link>
            <p className="mt-3 font-serif text-gray-500 italic text-sm">&ldquo;Где слова обретают крылья&rdquo;</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Навигация</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/poetry"  className="text-gray-500 hover:text-purple-400 transition-colors text-sm">{t.nav.poetry}</Link>
              <Link href="/prose"   className="text-gray-500 hover:text-amber-400  transition-colors text-sm">{t.nav.prose}</Link>
              <Link href="/about"   className="text-gray-500 hover:text-purple-400 transition-colors text-sm">{t.nav.about}</Link>
              <Link href="/contact" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">{t.nav.contact}</Link>
            </nav>
          </div>
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
`);

w("components/PoemCard.tsx", `"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";
import { formatDate, getLocale } from "@/lib/utils";
export default function PoemCard({ work, index = 0 }: { work: TranslatedWork; index?: number }) {
  const { language, t } = useLanguage();
  const [likes, setLikes] = useState(work.likes);
  const [liked, setLiked] = useState(false);
  const tr = language !== "ru" ? work.translations[language] : undefined;
  const title   = tr?.title   ?? work.title;
  const excerpt = tr?.excerpt ?? work.excerpt;
  return (
    <article className="group bg-white/[0.03] backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-500">
      <div className="h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-amber-500" />
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between mb-4">
          <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">{t.sections.poetry}</span>
          <time className="text-xs text-gray-600">{formatDate(work.createdAt, getLocale(language))}</time>
        </div>
        <Link href={\`/poetry/\${work.id}\`}>
          <h3 className="text-2xl font-bold text-gray-100 group-hover:text-purple-300 transition-colors mb-4 cursor-pointer">{title}</h3>
        </Link>
        <div className="flex items-center gap-3 mb-4 opacity-40">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          <span className="text-purple-400">✦</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>
        <p className="text-gray-300 leading-relaxed font-serif italic text-sm line-clamp-3">{excerpt}</p>
        <Link href={\`/poetry/\${work.id}\`} className="inline-block mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors">
          {t.sections.readMore} →
        </Link>
        <div className="flex flex-wrap gap-2 mt-4">
          {work.tags.map((tag) => <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 text-gray-500">#{tag}</span>)}
        </div>
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
          <button onClick={() => { setLiked(!liked); setLikes((p) => (liked ? p-1 : p+1)); }}
            className={"text-sm transition-colors " + (liked ? "text-red-400" : "text-gray-500 hover:text-red-400")}>
            {liked ? "❤️" : "🤍"} {likes}
          </button>
          <span className="text-sm text-gray-500">👁 {work.views}</span>
          <span className="ml-auto text-xs text-gray-600">{work.readingTime} {t.sections.minuteRead}</span>
        </div>
      </div>
    </article>
  );
}
`);

w("components/ProseCard.tsx", `"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";
import { formatDate, getLocale } from "@/lib/utils";
export default function ProseCard({ work, index = 0 }: { work: TranslatedWork; index?: number }) {
  const { language, t } = useLanguage();
  const [likes, setLikes] = useState(work.likes);
  const [liked, setLiked] = useState(false);
  const tr = language !== "ru" ? work.translations[language] : undefined;
  const title   = tr?.title   ?? work.title;
  const excerpt = tr?.excerpt ?? work.excerpt;
  return (
    <article className="group bg-white/[0.03] backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-500">
      <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-purple-500" />
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400">{t.sections.prose}</span>
            <span className="text-xs text-gray-600">{work.readingTime} {t.sections.minuteRead}</span>
          </div>
          <time className="text-xs text-gray-600">{formatDate(work.createdAt, getLocale(language))}</time>
        </div>
        <Link href={\`/prose/\${work.id}\`}>
          <h3 className="text-2xl font-bold text-gray-100 group-hover:text-amber-300 transition-colors mb-4 cursor-pointer">{title}</h3>
        </Link>
        <div className="flex items-center gap-3 mb-4 opacity-40">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          <span className="text-amber-400">❧</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        </div>
        <p className="text-gray-300 leading-relaxed font-serif text-sm line-clamp-4">{excerpt}</p>
        <Link href={\`/prose/\${work.id}\`} className="inline-block mt-4 text-sm text-amber-400 hover:text-amber-300 transition-colors">
          {t.sections.readMore} →
        </Link>
        <div className="flex flex-wrap gap-2 mt-4">
          {work.tags.map((tag) => <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 text-gray-500">#{tag}</span>)}
        </div>
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
          <button onClick={() => { setLiked(!liked); setLikes((p) => (liked ? p-1 : p+1)); }}
            className={"text-sm transition-colors " + (liked ? "text-red-400" : "text-gray-500 hover:text-red-400")}>
            {liked ? "❤️" : "🤍"} {likes}
          </button>
          <span className="text-sm text-gray-500">👁 {work.views}</span>
        </div>
      </div>
    </article>
  );
}
`);

w("app/page.tsx", `"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getWorksByCategory } from "@/data/works";
import PoemCard from "@/components/PoemCard";
import ProseCard from "@/components/ProseCard";
import AnimatedSection from "@/components/AnimatedSection";
export default function HomePage() {
  const { t } = useLanguage();
  const latestPoems = getWorksByCategory("poetry").slice(0, 2);
  const latestProse = getWorksByCategory("prose").slice(0, 1);
  return (
    <div className="relative min-h-screen">
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        <AnimatedSection delay={200}><p className="font-serif text-xl sm:text-2xl text-purple-400/80 mb-4 italic tracking-wide">{t.hero.greeting}</p></AnimatedSection>
        <AnimatedSection delay={400}><h1 className="font-display text-6xl sm:text-7xl md:text-9xl font-bold gradient-text mb-6 leading-[0.9] tracking-tight">{t.hero.title}</h1></AnimatedSection>
        <AnimatedSection delay={600}><p className="font-serif max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed mb-12">{t.hero.subtitle}</p></AnimatedSection>
        <AnimatedSection delay={800}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/poetry" className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25">
              <span className="relative z-10">{t.hero.cta}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/prose" className="px-10 py-4 rounded-2xl glass text-gray-300 font-semibold text-lg hover:text-white hover:bg-white/10 transition-all">{t.hero.ctaSecondary}</Link>
          </div>
        </AnimatedSection>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-purple-400/60 animate-pulse" />
          </div>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-20">
        <AnimatedSection>
          <div className="relative text-center py-16">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-8xl text-purple-500/10 font-display select-none">&ldquo;</div>
            <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-gray-300 italic leading-relaxed">{t.about.philosophyText}</blockquote>
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/50" />
              <p className="text-lg text-purple-400 italic font-serif">{t.about.subtitle}</p>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
            </div>
          </div>
        </AnimatedSection>
      </section>
      <section className="max-w-5xl mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-100">{t.sections.poetry}</h2>
            <Link href="/poetry" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">{t.sections.allWorks} →</Link>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {latestPoems.map((poem, i) => <AnimatedSection key={poem.id} delay={i*200}><PoemCard work={poem} index={i} /></AnimatedSection>)}
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-100">{t.sections.prose}</h2>
            <Link href="/prose" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">{t.sections.allWorks} →</Link>
          </div>
        </AnimatedSection>
        {latestProse.map((item, i) => <AnimatedSection key={item.id} delay={200}><ProseCard work={item} index={i} /></AnimatedSection>)}
      </section>
    </div>
  );
}
`);

w("app/poetry/page.tsx", `"use client";
import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getWorksByCategory } from "@/data/works";
import PoemCard from "@/components/PoemCard";
import AnimatedSection from "@/components/AnimatedSection";
function PoetryContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  useEffect(() => { const u = searchParams.get("tag"); if (u) setTag(u); }, [searchParams]);
  const allPoems = getWorksByCategory("poetry");
  const allTags = useMemo(() => { const s = new Set<string>(); allPoems.forEach((p) => p.tags.forEach((tg) => s.add(tg))); return Array.from(s); }, [allPoems]);
  const filtered = useMemo(() => allPoems.filter((p) => {
    const ms = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
    return ms && (!tag || p.tags.includes(tag));
  }), [allPoems, search, tag]);
  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-12 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection><h1 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text mb-4">{t.sections.poetry}</h1><p className="text-lg text-gray-400 max-w-xl mx-auto">{t.hero.subtitle}</p></AnimatedSection>
          <AnimatedSection delay={200}><div className="mt-8 max-w-md mx-auto"><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.sections.searchPlaceholder} className="w-full px-6 py-3 rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" /></div></AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button onClick={() => setTag(null)} className={"px-4 py-1.5 text-xs rounded-full transition-all " + (!tag ? "bg-purple-500/30 text-purple-300 border border-purple-500/50" : "bg-white/5 text-gray-500 hover:text-gray-300")}>{t.sections.allWorks}</button>
              {allTags.map((tg) => <button key={tg} onClick={() => setTag(tag === tg ? null : tg)} className={"px-4 py-1.5 text-xs rounded-full transition-all " + (tag === tg ? "bg-purple-500/30 text-purple-300 border border-purple-500/50" : "bg-white/5 text-gray-500 hover:text-gray-300")}>#{tg}</button>)}
            </div>
          </AnimatedSection>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-4 pb-20">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">{filtered.map((poem, i) => <AnimatedSection key={poem.id} delay={i*150}><PoemCard work={poem} index={i} /></AnimatedSection>)}</div>
        ) : (
          <div className="text-center py-20"><p className="text-2xl text-gray-500">{t.sections.noWorksFound}</p><button onClick={() => { setSearch(""); setTag(null); }} className="mt-4 text-purple-400 hover:text-purple-300 transition-colors">{t.common.retry}</button></div>
        )}
      </section>
    </div>
  );
}
export default function PoetryPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" /></div>}><PoetryContent /></Suspense>;
}
`);

w("app/prose/page.tsx", `"use client";
import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getWorksByCategory } from "@/data/works";
import ProseCard from "@/components/ProseCard";
import AnimatedSection from "@/components/AnimatedSection";
function ProseContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  useEffect(() => { const u = searchParams.get("tag"); if (u) setTag(u); }, [searchParams]);
  const allProse = getWorksByCategory("prose");
  const allTags = useMemo(() => { const s = new Set<string>(); allProse.forEach((p) => p.tags.forEach((tg) => s.add(tg))); return Array.from(s); }, [allProse]);
  const filtered = useMemo(() => allProse.filter((p) => {
    const ms = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
    return ms && (!tag || p.tags.includes(tag));
  }), [allProse, search, tag]);
  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-12 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection><h1 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text-gold mb-4">{t.sections.prose}</h1><p className="text-lg text-gray-400 max-w-xl mx-auto">{t.hero.subtitle}</p></AnimatedSection>
          <AnimatedSection delay={200}><div className="mt-8 max-w-md mx-auto"><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.sections.searchPlaceholder} className="w-full px-6 py-3 rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50" /></div></AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button onClick={() => setTag(null)} className={"px-4 py-1.5 text-xs rounded-full transition-all " + (!tag ? "bg-amber-500/30 text-amber-300 border border-amber-500/50" : "bg-white/5 text-gray-500 hover:text-gray-300")}>{t.sections.allWorks}</button>
              {allTags.map((tg) => <button key={tg} onClick={() => setTag(tag === tg ? null : tg)} className={"px-4 py-1.5 text-xs rounded-full transition-all " + (tag === tg ? "bg-amber-500/30 text-amber-300 border border-amber-500/50" : "bg-white/5 text-gray-500 hover:text-gray-300")}>#{tg}</button>)}
            </div>
          </AnimatedSection>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 pb-20">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-8">{filtered.map((item, i) => <AnimatedSection key={item.id} delay={i*200}><ProseCard work={item} index={i} /></AnimatedSection>)}</div>
        ) : (
          <div className="text-center py-20"><p className="text-2xl text-gray-500">{t.sections.noWorksFound}</p><button onClick={() => { setSearch(""); setTag(null); }} className="mt-4 text-amber-400 hover:text-amber-300 transition-colors">{t.common.retry}</button></div>
        )}
      </section>
    </div>
  );
}
export default function ProsePage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" /></div>}><ProseContent /></Suspense>;
}
`);

w("app/poetry/[id]/page.tsx", `"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getWorkById, getWorksByCategory } from "@/data/works";
import AnimatedSection from "@/components/AnimatedSection";
import { formatDate, getLocale } from "@/lib/utils";
export default function PoemPage() {
  const params = useParams(); const router = useRouter(); const { language, t } = useLanguage();
  const [likes, setLikes] = useState<number | null>(null); const [liked, setLiked] = useState(false); const [copied, setCopied] = useState(false);
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const work = getWorkById(id);
  const related = getWorksByCategory("poetry").filter((p) => p.id !== id && p.tags.some((tag) => work?.tags.includes(tag))).slice(0, 2);
  if (!work || work.category !== "poetry") return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-8xl">📜</div><h1 className="text-3xl font-bold text-gray-300">Стихотворение не найдено</h1>
      <Link href="/poetry" className="px-8 py-3 rounded-2xl bg-purple-600 text-white hover:bg-purple-500 transition-colors">← {t.nav.poetry}</Link>
    </div>
  );
  const tr = language !== "ru" ? work.translations[language] : undefined;
  const title = tr?.title ?? work.title; const content = tr?.content ?? work.content;
  const currentLikes = likes ?? work.likes;
  const handleLike = () => { const n = !liked; setLiked(n); setLikes((p) => (p ?? work.likes) + (n ? 1 : -1)); };
  const handleCopy = async () => { try { await navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {} };
  const handleShare = () => { if (navigator.share) navigator.share({ title, text: content.slice(0,100)+"…", url: location.href }); else navigator.clipboard.writeText(location.href); };
  const stanzas = content.split(/\\n\\n+/);
  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-24 relative z-10">
        <AnimatedSection delay={0}><button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-400 transition-colors mb-12 group"><span className="group-hover:-translate-x-1 transition-transform inline-block">←</span><span className="text-sm">{t.nav.poetry}</span></button></AnimatedSection>
        <AnimatedSection delay={100}>
          <div className="mb-12 text-center">
            <span className="inline-block px-4 py-1.5 text-xs rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 mb-6">{t.sections.poetry}</span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-gray-100 leading-tight mb-6">{title}</h1>
            <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
              <span>📅 {formatDate(work.createdAt, getLocale(language))}</span><span className="hidden sm:inline">·</span><span>⏱ {work.readingTime} {t.sections.minuteRead}</span><span className="hidden sm:inline">·</span><span>👁 {work.views} {t.sections.views}</span>
            </div>
            <div className="flex items-center justify-center gap-4 mt-8 opacity-50"><div className="h-px w-24 bg-gradient-to-r from-transparent to-purple-500" /><span className="text-purple-400 text-xl">✦</span><div className="h-px w-24 bg-gradient-to-l from-transparent to-purple-500" /></div>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={200}>
          <div className="glass rounded-3xl overflow-hidden mb-10">
            <div className="h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-amber-500" />
            <div className="p-8 sm:p-12 md:p-16">
              <div className="font-serif text-lg sm:text-xl text-gray-200 leading-[2.1] tracking-wide space-y-8 text-center">
                {stanzas.map((stanza, si) => (
                  <div key={si} className="space-y-0.5">{stanza.split("\\n").map((line, li) => <p key={li}>{line || <>&nbsp;</>}</p>)}</div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={280}><div className="flex flex-wrap gap-2 mb-10 justify-center">{work.tags.map((tag) => <Link key={tag} href={\`/poetry?tag=\${encodeURIComponent(tag)}\`} className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/40 hover:text-purple-400 transition-all">#{tag}</Link>)}</div></AnimatedSection>
        <AnimatedSection delay={320}>
          <div className="flex items-center justify-center gap-3 mb-16 flex-wrap">
            <button onClick={handleLike} className={"flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all text-sm font-medium " + (liked ? "bg-red-500/20 border-red-500/40 text-red-400 scale-105" : "bg-white/5 border-white/10 text-gray-400 hover:border-red-500/30 hover:text-red-400")}><span>{liked?"❤️":"🤍"}</span><span>{currentLikes}</span></button>
            <button onClick={handleCopy} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:border-purple-500/30 hover:text-purple-400 transition-all text-sm font-medium"><span>{copied?"✅":"📋"}</span><span>{copied?t.common.copied:t.common.copy}</span></button>
            <button onClick={handleShare} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:border-amber-500/30 hover:text-amber-400 transition-all text-sm font-medium"><span>🔗</span><span>{t.common.share}</span></button>
          </div>
        </AnimatedSection>
        {related.length > 0 && (
          <AnimatedSection delay={380}>
            <div className="border-t border-white/5 pt-12 mb-12">
              <h2 className="font-display text-2xl font-bold text-gray-200 mb-6 text-center">{t.sections.poetry}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((poem) => { const rTr = language !== "ru" ? poem.translations[language] : undefined; return (
                  <Link key={poem.id} href={\`/poetry/\${poem.id}\`} className="glass rounded-2xl p-6 hover:border-purple-500/30 hover:-translate-y-1 transition-all group">
                    <div className="h-0.5 bg-gradient-to-r from-purple-500 to-amber-500 rounded-full mb-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <h3 className="font-display text-lg font-bold text-gray-200 group-hover:text-purple-300 transition-colors mb-2">{rTr?.title ?? poem.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 font-serif italic">{rTr?.excerpt ?? poem.excerpt}</p>
                  </Link>
                ); })}
              </div>
            </div>
          </AnimatedSection>
        )}
        <AnimatedSection delay={420}><div className="text-center"><Link href="/poetry" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 hover:text-white transition-all font-medium">← {t.sections.allWorks} {t.sections.poetry}</Link></div></AnimatedSection>
      </div>
    </div>
  );
}
`);

w("app/prose/[id]/page.tsx", `"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getWorkById, getWorksByCategory } from "@/data/works";
import AnimatedSection from "@/components/AnimatedSection";
import { formatDate, getLocale } from "@/lib/utils";
export default function ProsePiecePage() {
  const params = useParams(); const router = useRouter(); const { language, t } = useLanguage();
  const [likes, setLikes] = useState<number | null>(null); const [liked, setLiked] = useState(false); const [copied, setCopied] = useState(false);
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const work = getWorkById(id);
  const related = getWorksByCategory("prose").filter((p) => p.id !== id && p.tags.some((tag) => work?.tags.includes(tag))).slice(0, 2);
  if (!work || work.category !== "prose") return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-8xl">📖</div><h1 className="text-3xl font-bold text-gray-300">Произведение не найдено</h1>
      <Link href="/prose" className="px-8 py-3 rounded-2xl bg-amber-600 text-white hover:bg-amber-500 transition-colors">← {t.nav.prose}</Link>
    </div>
  );
  const tr = language !== "ru" ? work.translations[language] : undefined;
  const title = tr?.title ?? work.title; const content = tr?.content ?? work.content;
  const currentLikes = likes ?? work.likes;
  const handleLike = () => { const n = !liked; setLiked(n); setLikes((p) => (p ?? work.likes) + (n ? 1 : -1)); };
  const handleCopy = async () => { try { await navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {} };
  const handleShare = () => { if (navigator.share) navigator.share({ title, text: tr?.excerpt ?? work.excerpt, url: location.href }); else navigator.clipboard.writeText(location.href); };
  const paragraphs = content.split(/\\n\\n+/).filter(Boolean);
  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-24 relative z-10">
        <AnimatedSection delay={0}><button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-400 transition-colors mb-12 group"><span className="group-hover:-translate-x-1 transition-transform inline-block">←</span><span className="text-sm">{t.nav.prose}</span></button></AnimatedSection>
        <AnimatedSection delay={100}>
          <div className="mb-12">
            <span className="inline-block px-4 py-1.5 text-xs rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-6">{t.sections.prose}</span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-gray-100 leading-tight mb-6">{title}</h1>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
              <span>📅 {formatDate(work.createdAt, getLocale(language))}</span><span className="hidden sm:inline">·</span><span>⏱ {work.readingTime} {t.sections.minuteRead}</span><span className="hidden sm:inline">·</span><span>👁 {work.views} {t.sections.views}</span>
            </div>
            <div className="h-px bg-gradient-to-r from-amber-500/50 via-purple-500/20 to-transparent mt-8" />
          </div>
        </AnimatedSection>
        <AnimatedSection delay={200}>
          <div className="glass rounded-3xl overflow-hidden mb-10">
            <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-purple-500" />
            <div className="p-8 sm:p-12 md:p-16">
              <div className="space-y-5">
                {paragraphs.map((para, i) => {
                  const trimmed = para.trim();
                  const isQuote = trimmed.startsWith("«") || trimmed.startsWith('"');
                  const isLetter = trimmed.startsWith("Дорог") || trimmed.startsWith("Dear") || trimmed.startsWith("С любовью") || trimmed.startsWith("With love") || trimmed.startsWith("P.S.");
                  return <p key={i} style={{ whiteSpace: "pre-line" }} className={"prose-text text-base sm:text-lg leading-[1.9] " + (i===0&&!isQuote&&!isLetter?"drop-cap text-gray-200 ":"text-gray-300 ") + (isQuote?"pl-5 border-l-2 border-amber-500/40 text-gray-400 italic ":"") + (isLetter?"text-gray-400 italic ":"")}>{trimmed}</p>;
                })}
              </div>
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={280}><div className="flex flex-wrap gap-2 mb-10">{work.tags.map((tag) => <Link key={tag} href={\`/prose?tag=\${encodeURIComponent(tag)}\`} className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-400 border border-white/10 hover:border-amber-500/40 hover:text-amber-400 transition-all">#{tag}</Link>)}</div></AnimatedSection>
        <AnimatedSection delay={320}>
          <div className="flex items-center gap-3 mb-16 flex-wrap">
            <button onClick={handleLike} className={"flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all text-sm font-medium " + (liked ? "bg-red-500/20 border-red-500/40 text-red-400 scale-105" : "bg-white/5 border-white/10 text-gray-400 hover:border-red-500/30 hover:text-red-400")}><span>{liked?"❤️":"🤍"}</span><span>{currentLikes}</span></button>
            <button onClick={handleCopy} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:border-amber-500/30 hover:text-amber-400 transition-all text-sm font-medium"><span>{copied?"✅":"📋"}</span><span>{copied?t.common.copied:t.common.copy}</span></button>
            <button onClick={handleShare} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:border-purple-500/30 hover:text-purple-400 transition-all text-sm font-medium"><span>🔗</span><span>{t.common.share}</span></button>
          </div>
        </AnimatedSection>
        {related.length > 0 && (
          <AnimatedSection delay={380}>
            <div className="border-t border-white/5 pt-12 mb-12">
              <h2 className="font-display text-2xl font-bold text-gray-200 mb-6">{t.sections.prose}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((piece) => { const rTr = language !== "ru" ? piece.translations[language] : undefined; return (
                  <Link key={piece.id} href={\`/prose/\${piece.id}\`} className="glass rounded-2xl p-6 hover:border-amber-500/30 hover:-translate-y-1 transition-all group">
                    <div className="h-0.5 bg-gradient-to-r from-amber-500 to-purple-500 rounded-full mb-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <h3 className="font-display text-lg font-bold text-gray-200 group-hover:text-amber-300 transition-colors mb-2">{rTr?.title ?? piece.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 font-serif italic">{rTr?.excerpt ?? piece.excerpt}</p>
                    <p className="text-xs text-gray-600 mt-2">{piece.readingTime} {t.sections.minuteRead} · {piece.views} {t.sections.views}</p>
                  </Link>
                ); })}
              </div>
            </div>
          </AnimatedSection>
        )}
        <AnimatedSection delay={420}><div><Link href="/prose" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-600/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 hover:text-white transition-all font-medium">← {t.sections.allWorks} {t.sections.prose}</Link></div></AnimatedSection>
      </div>
    </div>
  );
}
`);

w("app/about/page.tsx", `"use client";
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
          <AnimatedSection><h1 className="text-center text-5xl sm:text-6xl md:text-7xl font-bold gradient-text mb-16">{t.about.title}</h1></AnimatedSection>
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
                  <blockquote className="border-l-2 border-purple-500/50 pl-6"><p className="text-gray-300 text-lg italic">{t.about.philosophyText}</p></blockquote>
                </div>
                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[{v:"50+",l:"Poems"},{v:"20+",l:"Stories"},{v:"6",l:"Languages"},{v:"∞",l:"Inspiration"}].map((s,i) => (
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

w("app/contact/page.tsx", `"use client";
import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedSection from "@/components/AnimatedSection";
const CT: Record<string,{title:string;subtitle:string;name:string;email:string;subject:string;message:string;send:string;success:string;social:string;emailLabel:string;telegram:string}> = {
  ru:{title:"Контакты",subtitle:"Свяжитесь со мной",name:"Ваше имя",email:"Email",subject:"Тема",message:"Сообщение",send:"Отправить",success:"Спасибо! Ваше сообщение отправлено.",social:"Социальные сети",emailLabel:"Электронная почта",telegram:"Telegram"},
  en:{title:"Contact",subtitle:"Get in Touch",name:"Your Name",email:"Email",subject:"Subject",message:"Message",send:"Send",success:"Thank you! Your message has been sent.",social:"Social Media",emailLabel:"Email",telegram:"Telegram"},
  de:{title:"Kontakt",subtitle:"Kontaktieren Sie mich",name:"Ihr Name",email:"E-Mail",subject:"Betreff",message:"Nachricht",send:"Senden",success:"Vielen Dank! Ihre Nachricht wurde gesendet.",social:"Soziale Medien",emailLabel:"E-Mail",telegram:"Telegram"},
  fr:{title:"Contact",subtitle:"Contactez-moi",name:"Votre nom",email:"Email",subject:"Sujet",message:"Message",send:"Envoyer",success:"Merci ! Votre message a été envoyé.",social:"Réseaux sociaux",emailLabel:"Email",telegram:"Telegram"},
  zh:{title:"联系",subtitle:"与我联系",name:"您的姓名",email:"电子邮件",subject:"主题",message:"留言",send:"发送",success:"谢谢！您的消息已发送。",social:"社交媒体",emailLabel:"电子邮件",telegram:"Telegram"},
  ko:{title:"연락처",subtitle:"연락하기",name:"이름",email:"이메일",subject:"제목",message:"메시지",send:"보내기",success:"감사합니다! 메시지가 전송되었습니다.",social:"소셜 미디어",emailLabel:"이메일",telegram:"Telegram"},
};
export default function ContactPage() {
  const { language } = useLanguage(); const c = CT[language] ?? CT.ru;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({name:"",email:"",subject:"",message:""});
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 5000); setForm({name:"",email:"",subject:"",message:""}); };
  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-16 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <AnimatedSection><h1 className="text-center font-display text-5xl sm:text-6xl md:text-7xl font-bold gradient-text mb-4">{c.title}</h1><p className="text-center text-lg text-gray-400 mb-16">{c.subtitle}</p></AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedSection delay={200}>
              <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-6">
                <div className="h-1 bg-gradient-to-r from-purple-500 via-amber-500 to-purple-500 rounded-full -mt-8 -mx-8 mb-8 rounded-b-none" />
                {sent && <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 text-center">✨ {c.success}</div>}
                {(["name","email","subject"] as const).map((field) => (
                  <div key={field}><label className="block text-sm text-gray-400 mb-2">{c[field]}</label>
                  <input type={field==="email"?"email":"text"} required={field!=="subject"} value={form[field]} onChange={(e) => setForm({...form,[field]:e.target.value})}
                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" /></div>
                ))}
                <div><label className="block text-sm text-gray-400 mb-2">{c.message}</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({...form,message:e.target.value})}
                  className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none" /></div>
                <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-amber-600 text-white font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-purple-500/20">{c.send}</button>
              </form>
            </AnimatedSection>
            <AnimatedSection delay={400}>
              <div className="space-y-6">
                <div className="glass rounded-3xl p-8 hover:border-purple-500/30 transition-colors"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-2xl">📧</div><div><h3 className="font-display text-lg font-bold text-gray-100">{c.emailLabel}</h3><a href="mailto:natalia@melkher.com" className="text-purple-400 hover:text-purple-300 transition-colors">natalia@melkher.com</a></div></div></div>
                <div className="glass rounded-3xl p-8 hover:border-amber-500/30 transition-colors"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-2xl">✈️</div><div><h3 className="font-display text-lg font-bold text-gray-100">{c.telegram}</h3><a href="https://t.me/nataliamelkher" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 transition-colors">@nataliamelkher</a></div></div></div>
                <div className="glass rounded-3xl p-8"><h3 className="font-display text-lg font-bold text-gray-100 mb-6">{c.social}</h3><div className="grid grid-cols-2 gap-3">{[{name:"Instagram",icon:"📸"},{name:"Facebook",icon:"📘"},{name:"YouTube",icon:"🎬"},{name:"TikTok",icon:"🎵"}].map((s) => (<a key={s.name} href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group"><span className="text-xl">{s.icon}</span><span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{s.name}</span></a>))}</div></div>
                <div className="glass rounded-3xl p-8 text-center"><p className="font-serif text-gray-400 italic text-lg leading-relaxed">&ldquo;Каждое письмо — это мост между двумя сердцами&rdquo;</p><p className="text-purple-400/60 text-sm mt-3">— Н.М.</p></div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
`);

w("app/sitemap.ts", `import type { MetadataRoute } from "next";
import { getAllPublishedWorks } from "@/data/works";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://natalia-melkher.vercel.app";
  const workUrls = getAllPublishedWorks().map((work) => ({
    url: \`\${base}/\${work.category === "poetry" ? "poetry" : "prose"}/\${work.id}\`,
    lastModified: new Date(work.updatedAt), changeFrequency: "monthly" as const, priority: 0.8,
  }));
  return [
    { url: base,              lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: base+"/poetry",   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: base+"/prose",    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: base+"/about",    lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: base+"/contact",  lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...workUrls,
  ];
}
`);

w("app/robots.ts", `import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: "https://natalia-melkher.vercel.app/sitemap.xml" };
}
`);

w("app/manifest.ts", `import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Наталья Мельхер — Поэзия и Вдохновение", short_name: "Н. Мельхер",
    description: "Поэзия, проза и вдохновение Натальи Мельхер",
    start_url: "/", display: "standalone", background_color: "#0a0a1a", theme_color: "#a855f7",
    icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png" }],
  };
}
`);

console.log("\n🎉 Все файлы записаны!");
console.log("▶  npm run dev");
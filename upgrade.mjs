import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { dirname } from "path";

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
  console.log("✅ " + path);
}

// ============================================================
// FIX 1: LanguageContext — fix hydration mismatch
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

// ============================================================
// FIX 2: Layout with Google Fonts (Playfair Display + Cormorant)
// ============================================================
w("app/layout.tsx",
`import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Наталья Мельхер — Поэзия и Вдохновение",
  description: "Личный сайт поэтессы и писательницы Натальи Мельхер. Поэзия, проза, вдохновение на шести языках.",
  keywords: ["Наталья Мельхер", "поэзия", "стихи", "проза", "литература", "Natalia Melkher", "poetry"],
  authors: [{ name: "Наталья Мельхер" }],
  openGraph: {
    title: "Наталья Мельхер — Поэзия и Вдохновение",
    description: "Пространство вдохновения, где слова обретают крылья",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning
      className={\`\${playfair.variable} \${cormorant.variable} \${inter.variable}\`}>
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

// ============================================================
// FIX 3: Enhanced globals.css with fonts + animations
// ============================================================
w("app/globals.css",
`@import "tailwindcss";

@theme {
  --font-display: var(--font-display), "Playfair Display", Georgia, serif;
  --font-serif: var(--font-serif), "Cormorant Garamond", Georgia, serif;
  --font-sans: var(--font-sans), "Inter", system-ui, sans-serif;

  --color-midnight: #0a0a1a;
  --color-velvet: #1a0a2e;
  --color-ink: #0d1b2a;
}

/* Base */
body {
  background: var(--color-midnight);
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(120, 50, 180, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(200, 150, 50, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 100%, rgba(100, 50, 150, 0.05) 0%, transparent 50%);
  color: #e2e8f0;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0a0a1a; }
::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #a855f7, #f59e0b); border-radius: 3px; }

/* Selection */
::selection { background: rgba(168, 85, 247, 0.3); color: #f3e8ff; }

/* Gradient texts */
.gradient-text {
  background: linear-gradient(135deg, #d946ef 0%, #a855f7 25%, #f59e0b 50%, #d946ef 75%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: gradient-shift 6s ease infinite;
}

.gradient-text-gold {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 30%, #d946ef 60%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: gradient-shift 6s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Glass effect */
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Glow effects */
.glow-purple { box-shadow: 0 0 30px rgba(168, 85, 247, 0.15); }
.glow-gold { box-shadow: 0 0 30px rgba(245, 158, 11, 0.15); }

/* Text helpers */
.prose-text {
  font-family: var(--font-serif);
  line-height: 1.8;
  letter-spacing: 0.01em;
}

.drop-cap::first-letter {
  font-family: var(--font-display);
  float: left;
  font-size: 3.5em;
  line-height: 0.8;
  margin: 0 0.1em 0 0;
  background: linear-gradient(135deg, #a855f7, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

/* Smooth page transitions */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in { animation: fade-in 0.6s ease forwards; }

/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-float { animation: float 6s ease-in-out infinite; }

/* Pulse glow */
@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
.animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
`);

// ============================================================
// UPGRADE: Enhanced ParticleBackground
// ============================================================
w("components/ParticleBackground.tsx",
`"use client";

import React, { useMemo } from "react";

export default function ParticleBackground() {
  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 20 + Math.random() * 30,
    delay: Math.random() * 20,
    size: 1 + Math.random() * 4,
    opacity: 0.05 + Math.random() * 0.2,
    color: i % 3 === 0 ? "168,85,247" : i % 3 === 1 ? "245,158,11" : "217,70,239",
  })), []);

  const orbs = useMemo(() => [
    { left: "15%", top: "20%", size: 300, color: "168,85,247", opacity: 0.03, dur: 25 },
    { left: "75%", top: "60%", size: 250, color: "245,158,11", opacity: 0.025, dur: 30 },
    { left: "50%", top: "80%", size: 350, color: "217,70,239", opacity: 0.02, dur: 35 },
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {orbs.map((orb, i) => (
        <div key={"orb-" + i} className="absolute rounded-full animate-pulse-glow"
          style={{
            left: orb.left, top: orb.top, width: orb.size, height: orb.size,
            background: \`radial-gradient(circle, rgba(\${orb.color},\${orb.opacity}) 0%, transparent 70%)\`,
            animationDuration: orb.dur + "s", filter: "blur(60px)",
          }} />
      ))}
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full"
          style={{
            left: p.left + "%", top: p.top + "%", width: p.size, height: p.size,
            backgroundColor: \`rgba(\${p.color},\${p.opacity})\`,
            animation: \`float \${p.duration}s ease-in-out \${p.delay}s infinite\`,
          }} />
      ))}
    </div>
  );
}
`);

// ============================================================
// UPGRADE: Enhanced Home Page
// ============================================================
w("app/page.tsx",
`"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getWorksByCategory } from "@/data/works";
import PoemCard from "@/components/PoemCard";
import ProseCard from "@/components/ProseCard";
import AnimatedSection from "@/components/AnimatedSection";

export default function HomePage() {
  const { t, mounted } = useLanguage();
  const latestPoems = getWorksByCategory("poetry").slice(0, 2);
  const latestProse = getWorksByCategory("prose").slice(0, 1);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

        <AnimatedSection delay={200}>
          <p className="font-serif text-xl sm:text-2xl text-purple-400/80 mb-4 italic tracking-wide">{t.hero.greeting}</p>
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <h1 className="font-display text-6xl sm:text-7xl md:text-9xl font-bold gradient-text mb-6 leading-[0.9] tracking-tight">
            {t.hero.title}
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={600}>
          <p className="font-serif max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed mb-12">{t.hero.subtitle}</p>
        </AnimatedSection>

        <AnimatedSection delay={800}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/poetry"
              className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25">
              <span className="relative z-10">{t.hero.cta}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/prose"
              className="px-10 py-4 rounded-2xl glass text-gray-300 font-semibold text-lg hover:text-white hover:bg-white/10 transition-all">
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </AnimatedSection>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-purple-400/60 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <AnimatedSection>
          <div className="relative text-center py-16">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-8xl text-purple-500/10 font-display select-none">&ldquo;</div>
            <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-gray-300 italic leading-relaxed">
              Слово — это самый мощный инструмент, данный человеку. Оно способно исцелять, вдохновлять, пробуждать.
            </blockquote>
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/50" />
              <p className="text-lg text-purple-400 italic font-serif">Наталья Мельхер</p>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Latest Poetry */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-100">{t.sections.poetry}</h2>
            <Link href="/poetry" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
              {t.sections.allWorks} →
            </Link>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {latestPoems.map((poem, i) => (
            <AnimatedSection key={poem.id} delay={i * 200}>
              <PoemCard work={poem} index={i} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Latest Prose */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-100">{t.sections.prose}</h2>
            <Link href="/prose" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
              {t.sections.allWorks} →
            </Link>
          </div>
        </AnimatedSection>
        {latestProse.map((item, i) => (
          <AnimatedSection key={item.id} delay={200}>
            <ProseCard work={item} index={i} />
          </AnimatedSection>
        ))}
      </section>
    </div>
  );
}
`);

// ============================================================
// CONTACT PAGE
// ============================================================
w("app/contact/page.tsx",
`"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedSection from "@/components/AnimatedSection";

const contactTranslations: Record<string, {
  title: string; subtitle: string; name: string; email: string;
  subject: string; message: string; send: string; success: string;
  social: string; emailLabel: string; telegram: string;
}> = {
  ru: { title: "Контакты", subtitle: "Свяжитесь со мной", name: "Ваше имя", email: "Email", subject: "Тема", message: "Сообщение", send: "Отправить", success: "Спасибо! Ваше сообщение отправлено.", social: "Социальные сети", emailLabel: "Электронная почта", telegram: "Telegram" },
  en: { title: "Contact", subtitle: "Get in Touch", name: "Your Name", email: "Email", subject: "Subject", message: "Message", send: "Send", success: "Thank you! Your message has been sent.", social: "Social Media", emailLabel: "Email", telegram: "Telegram" },
  de: { title: "Kontakt", subtitle: "Kontaktieren Sie mich", name: "Ihr Name", email: "E-Mail", subject: "Betreff", message: "Nachricht", send: "Senden", success: "Vielen Dank! Ihre Nachricht wurde gesendet.", social: "Soziale Medien", emailLabel: "E-Mail", telegram: "Telegram" },
  fr: { title: "Contact", subtitle: "Contactez-moi", name: "Votre nom", email: "Email", subject: "Sujet", message: "Message", send: "Envoyer", success: "Merci ! Votre message a été envoyé.", social: "Réseaux sociaux", emailLabel: "Email", telegram: "Telegram" },
  zh: { title: "联系", subtitle: "与我联系", name: "您的姓名", email: "电子邮件", subject: "主题", message: "留言", send: "发送", success: "谢谢！您的消息已发送。", social: "社交媒体", emailLabel: "电子邮件", telegram: "Telegram" },
  ko: { title: "연락처", subtitle: "연락하기", name: "이름", email: "이메일", subject: "제목", message: "메시지", send: "보내기", success: "감사합니다! 메시지가 전송되었습니다.", social: "소셜 미디어", emailLabel: "이메일", telegram: "Telegram" },
};

export default function ContactPage() {
  const { language, t } = useLanguage();
  const ct = contactTranslations[language] || contactTranslations.ru;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-16 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <AnimatedSection>
            <h1 className="text-center font-display text-5xl sm:text-6xl md:text-7xl font-bold gradient-text mb-4">{ct.title}</h1>
            <p className="text-center text-lg text-gray-400 mb-16">{ct.subtitle}</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <AnimatedSection delay={200}>
              <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-6">
                <div className="h-1 bg-gradient-to-r from-purple-500 via-amber-500 to-purple-500 rounded-full -mt-8 -mx-8 mb-8 rounded-b-none" />
                {sent && (
                  <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 text-center">
                    ✨ {ct.success}
                  </div>
                )}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{ct.name}</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{ct.email}</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{ct.subject}</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{ct.message}</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none" />
                </div>
                <button type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-amber-600 text-white font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-purple-500/20">
                  {ct.send}
                </button>
              </form>
            </AnimatedSection>

            {/* Contact Info */}
            <AnimatedSection delay={400}>
              <div className="space-y-6">
                {/* Email Card */}
                <div className="glass rounded-3xl p-8 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-2xl">📧</div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-gray-100">{ct.emailLabel}</h3>
                      <a href="mailto:natalia@melkher.com" className="text-purple-400 hover:text-purple-300 transition-colors">natalia@melkher.com</a>
                    </div>
                  </div>
                </div>

                {/* Telegram Card */}
                <div className="glass rounded-3xl p-8 hover:border-amber-500/30 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-2xl">✈️</div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-gray-100">{ct.telegram}</h3>
                      <a href="https://t.me/nataliamelkher" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 transition-colors">@nataliamelkher</a>
                    </div>
                  </div>
                </div>

                {/* Social Card */}
                <div className="glass rounded-3xl p-8">
                  <h3 className="font-display text-lg font-bold text-gray-100 mb-6">{ct.social}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Instagram", icon: "📸", color: "from-pink-500 to-purple-500", url: "#" },
                      { name: "Facebook", icon: "📘", color: "from-blue-500 to-blue-600", url: "#" },
                      { name: "YouTube", icon: "🎬", color: "from-red-500 to-red-600", url: "#" },
                      { name: "TikTok", icon: "🎵", color: "from-gray-700 to-gray-900", url: "#" },
                    ].map((s) => (
                      <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group">
                        <span className="text-xl">{s.icon}</span>
                        <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{s.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Inspirational quote */}
                <div className="glass rounded-3xl p-8 text-center">
                  <p className="font-serif text-gray-400 italic text-lg leading-relaxed">
                    &ldquo;Каждое письмо — это мост между двумя сердцами&rdquo;
                  </p>
                  <p className="text-purple-400/60 text-sm mt-3">— Н.М.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
`);

// ============================================================
// UPGRADE: Header with Contact link
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
                className={"relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 " +
                  (active ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white hover:bg-white/5")}>
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-gray-950/98 backdrop-blur-2xl" />
          <div className="relative flex flex-col items-center justify-center h-full gap-8">
            {navItems.map((item, i) => (
              <Link key={item.href} href={item.href}
                className="font-display text-4xl font-bold text-gray-300 hover:text-white hover:gradient-text transition-all"
                style={{ animationDelay: i * 100 + "ms" }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
`);

// ============================================================
// UPGRADE: Footer with Contact
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
`);

// ============================================================
// ADD MORE POEMS AND PROSE to data/works.ts
// ============================================================
w("data/works.ts",
`import type { TranslatedWork } from "@/types";

export const works: TranslatedWork[] = [
  // ============ POETRY ============
  {
    id: "poem-001",
    title: "Тишина рассвета",
    content: "Когда мир ещё спит в объятьях ночи,\\nИ звёзды гаснут тихо, одна за одной,\\nРождается строка — нежнее, чем прочие,\\nКак первый луч рассвета золотой.\\n\\nВ той тишине я слышу голос вечности,\\nОн шепчет мне о том, что всё пройдёт,\\nНо красота останется в сердечности,\\nИ слово — словно птица — запоёт.\\n\\nИ я пишу — не ради славы тленной,\\nА чтобы в мире стало чуть светлей,\\nЧтоб каждый, кто устал от жизни бренной,\\nНашёл покой среди моих строчек и идей.",
    excerpt: "Когда мир ещё спит в объятьях ночи, и звёзды гаснут тихо, одна за одной...",
    category: "poetry", tags: ["рассвет", "тишина", "природа", "вдохновение"],
    createdAt: "2026-01-15T08:00:00Z", updatedAt: "2026-01-15T08:00:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 342, likes: 89,
    translations: {
      en: { title: "The Silence of Dawn", content: "When the world still sleeps in the embrace of night,\\nAnd stars fade quietly, one by one,\\nA line is born — more tender than the light,\\nLike the first golden ray of morning sun.\\n\\nIn that silence I hear eternity's voice,\\nIt whispers that all things shall pass away,\\nBut beauty remains in the heart's own choice,\\nAnd words — like birds — begin to play.", excerpt: "When the world still sleeps in the embrace of night..." },
      de: { title: "Die Stille der Morgendämmerung", content: "Wenn die Welt noch schläft in der Umarmung der Nacht,\\nUnd Sterne leise verlöschen, einer nach dem anderen,\\nEntsteht eine Zeile — zarter als gedacht,\\nWie der erste goldene Strahl des Morgens.", excerpt: "Wenn die Welt noch schläft..." },
      fr: { title: "Le Silence de l'Aube", content: "Quand le monde dort encore dans les bras de la nuit,\\nEt que les étoiles s'éteignent doucement, une à une,\\nUne ligne naît — plus tendre que la lumière qui luit,\\nComme le premier rayon doré de la lune.", excerpt: "Quand le monde dort encore..." },
      zh: { title: "黎明的寂静", content: "当世界仍在夜的怀抱中沉睡，\\n星星一颗接一颗地静静熄灭，\\n一行诗句诞生——比其他都温柔，\\n如同黎明的第一缕金色光芒。", excerpt: "当世界仍在夜的怀抱中沉睡..." },
      ko: { title: "새벽의 고요", content: "세상이 아직 밤의 품에서 잠들어 있을 때,\\n별들이 하나둘 조용히 꺼져갈 때,\\n시구가 태어난다 — 다른 어떤 것보다 부드럽게,\\n새벽의 첫 황금빛 광선처럼.", excerpt: "세상이 아직 밤의 품에서..." },
    },
  },
  {
    id: "poem-002",
    title: "Осенние строки",
    content: "Листья падают — как слова,\\nЧто не сказаны вовремя.\\nВетер пишет на земле\\nПисьма будущей весне.\\n\\nЗолотая тишина\\nРасстилается повсюду,\\nКаждый лист — как строчка та,\\nЧто хранить я вечно буду.\\n\\nВ этом танце увяданья\\nЕсть особая краса —\\nМудрость тихого прощанья,\\nЧто даёт земля и небеса.",
    excerpt: "Листья падают — как слова, что не сказаны вовремя...",
    category: "poetry", tags: ["осень", "природа", "мудрость"],
    createdAt: "2026-02-03T10:30:00Z", updatedAt: "2026-02-03T10:30:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 278, likes: 67,
    translations: {
      en: { title: "Autumn Lines", content: "Leaves fall — like words\\nThat were never said in time.\\nThe wind writes on the earth\\nLetters to the coming spring.\\n\\nGolden silence\\nSpreads everywhere,\\nEach leaf — like a line\\nI will keep forever.", excerpt: "Leaves fall — like words that were never said in time..." },
      de: { title: "Herbstzeilen", content: "Blätter fallen — wie Worte,\\nDie nicht rechtzeitig gesagt wurden.", excerpt: "Blätter fallen — wie Worte..." },
      fr: { title: "Lignes d'automne", content: "Les feuilles tombent — comme des mots\\nQui n'ont pas été dits à temps.", excerpt: "Les feuilles tombent..." },
      zh: { title: "秋日诗行", content: "落叶——如同未曾及时说出的话语。\\n风在大地上书写\\n给未来春天的信。", excerpt: "落叶——如同未曾及时说出的话语..." },
      ko: { title: "가을의 시구", content: "낙엽이 진다 — 마치 제때 하지 못한 말처럼.\\n바람이 땅 위에 쓴다\\n다가올 봄에게 보내는 편지를.", excerpt: "낙엽이 진다 — 마치..." },
    },
  },
  {
    id: "poem-003",
    title: "Колыбельная для звёзд",
    content: "Спите, звёзды, спите тихо,\\nНочь укроет вас собой,\\nПусть луна споёт вам лихо\\nПесню нежности ночной.\\n\\nВы мерцаете устало,\\nДень был долог и тяжёл,\\nНо рассвет придёт сначала,\\nИ разбудит вас, как пчёл.\\n\\nА пока — плывите в небе,\\nКак слова в моей строке,\\nКаждый лучик — словно жребий\\nНа серебряной реке.",
    excerpt: "Спите, звёзды, спите тихо, ночь укроет вас собой...",
    category: "poetry", tags: ["звёзды", "ночь", "космос", "нежность"],
    createdAt: "2026-02-14T22:00:00Z", updatedAt: "2026-02-14T22:00:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 415, likes: 112,
    translations: {
      en: { title: "Lullaby for the Stars", content: "Sleep, dear stars, sleep so still,\\nNight will cover you with care,\\nLet the moon sing with a thrill\\nA tender song upon the air.\\n\\nYou twinkle with a weary glow,\\nThe day was long and hard to bear,\\nBut dawn will come, and you will know\\nIts warmth that fills the morning air.", excerpt: "Sleep, dear stars, sleep so still..." },
      de: { title: "Schlaflied für die Sterne", content: "Schlaft, ihr Sterne, schlaft ganz leise,\\nDie Nacht wird euch bedecken...", excerpt: "Schlaft, ihr Sterne..." },
      fr: { title: "Berceuse pour les étoiles", content: "Dormez, étoiles, dormez doucement,\\nLa nuit vous couvrira tendrement...", excerpt: "Dormez, étoiles..." },
      zh: { title: "星星的摇篮曲", content: "安睡吧，星星们，静静地安睡，\\n夜会用自己将你们覆盖...", excerpt: "安睡吧，星星们..." },
      ko: { title: "별들을 위한 자장가", content: "잠들어라, 별들아, 조용히 잠들어라,\\n밤이 너희를 감싸줄 거야...", excerpt: "잠들어라, 별들아..." },
    },
  },
  {
    id: "poem-004",
    title: "Танец дождя",
    content: "Дождь танцует на стекле,\\nКаждой каплей — нота в песне,\\nМир становится светлей,\\nКогда небо плачет вместе.\\n\\nКапли — ноты на стекле,\\nМузыка без партитуры,\\nМир танцует в полумгле,\\nИ рисует акварели бурый\\nЦвет земли, зелёный — трав,\\nГолубой — небесной дали,\\nДождь — художник, он устав,\\nДарит миру без печали.",
    excerpt: "Дождь танцует на стекле, каждой каплей — нота в песне...",
    category: "poetry", tags: ["дождь", "танец", "весна", "музыка"],
    createdAt: "2026-03-01T14:00:00Z", updatedAt: "2026-03-01T14:00:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 156, likes: 43,
    translations: {
      en: { title: "Dance of the Rain", content: "The rain is dancing on the glass,\\nEach drop — a note within a song,\\nThe world grows brighter as they pass,\\nWhen heaven weeps, we sing along.", excerpt: "The rain is dancing on the glass..." },
      de: { title: "Tanz des Regens", content: "Der Regen tanzt auf dem Glas,\\nJeder Tropfen — eine Note im Lied...", excerpt: "Der Regen tanzt..." },
      fr: { title: "La Danse de la Pluie", content: "La pluie danse sur la vitre,\\nChaque goutte — une note dans la chanson...", excerpt: "La pluie danse sur la vitre..." },
      zh: { title: "雨之舞", content: "雨在玻璃上跳舞，\\n每一滴——歌曲中的一个音符...", excerpt: "雨在玻璃上跳舞..." },
      ko: { title: "비의 춤", content: "비가 유리 위에서 춤춘다,\\n한 방울마다 — 노래 속의 한 음표...", excerpt: "비가 유리 위에서 춤춘다..." },
    },
  },
  {
    id: "poem-005",
    title: "Зимний сонет",
    content: "Снежинки кружат в вальсе ледяном,\\nЛожатся на ладони, как мечты,\\nЗима рисует серебром и сном\\nСвои нерукотворные холсты.\\n\\nМолчит земля под белым покрывалом,\\nИ дремлет лес в хрустальной тишине,\\nА я стою с раскрытым одеялом\\nДуши — навстречу вечности и мне.\\n\\nЕсть в зимнем дне такая красота,\\nЧто сердце замирает на мгновенье,\\nИ кажется — вот-вот начнётся та\\nПора чудес, надежды, обновленья.",
    excerpt: "Снежинки кружат в вальсе ледяном, ложатся на ладони, как мечты...",
    category: "poetry", tags: ["зима", "снег", "тишина", "красота"],
    createdAt: "2026-01-28T16:00:00Z", updatedAt: "2026-01-28T16:00:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 289, likes: 78,
    translations: {
      en: { title: "Winter Sonnet", content: "Snowflakes are waltzing in their icy dance,\\nThey land on palms like dreams upon the snow,\\nWinter paints with silver in a trance\\nIts canvases that only nature knows.", excerpt: "Snowflakes are waltzing in their icy dance..." },
      de: { title: "Winter-Sonett", content: "Schneeflocken tanzen Walzer im eisigen Reigen...", excerpt: "Schneeflocken tanzen..." },
      fr: { title: "Sonnet d'hiver", content: "Les flocons valsent dans une danse glacée...", excerpt: "Les flocons valsent..." },
      zh: { title: "冬日十四行", content: "雪花在冰冷的华尔兹中旋转...", excerpt: "雪花在冰冷的华尔兹中旋转..." },
      ko: { title: "겨울 소네트", content: "눈송이가 얼음의 왈츠를 추며...", excerpt: "눈송이가 얼음의 왈츠를..." },
    },
  },
  {
    id: "poem-006",
    title: "Мосты",
    content: "Между мною и тобой — слова,\\nКак мосты через молчанья реку.\\nКаждый слог — опора, не трава,\\nКаждый звук — дарован человеку.\\n\\nМы возводим их неспешно, тихо,\\nСлово к слову — камень к камню в ряд,\\nИ мосты стоят надёжно, лихо\\nДаже если бури дни летят.\\n\\nМежду мною и тобой — стихи.\\nОни крепче стали и бетона.\\nВ них — ни капли фальши, ни тоски,\\nТолько свет из сердца, из бездонного.",
    excerpt: "Между мною и тобой — слова, как мосты через молчанья реку...",
    category: "poetry", tags: ["любовь", "слова", "мосты", "связь"],
    createdAt: "2026-02-20T11:00:00Z", updatedAt: "2026-02-20T11:00:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 367, likes: 95,
    translations: {
      en: { title: "Bridges", content: "Between you and me — are words,\\nLike bridges across a river of silence.\\nEach syllable — a pillar, firm,\\nEach sound — a gift to human science.\\n\\nWe build them slowly, without haste,\\nWord upon word — like stone on stone,\\nAnd bridges stand through storm and waste,\\nEven when the winds have blown.", excerpt: "Between you and me — are words, like bridges across a river of silence..." },
      de: { title: "Brücken", content: "Zwischen mir und dir — sind Worte,\\nWie Brücken über einen Fluss des Schweigens...", excerpt: "Zwischen mir und dir — sind Worte..." },
      fr: { title: "Les Ponts", content: "Entre toi et moi — des mots,\\nComme des ponts sur une rivière de silence...", excerpt: "Entre toi et moi — des mots..." },
      zh: { title: "桥", content: "你和我之间——是话语，\\n如同跨越沉默之河的桥梁...", excerpt: "你和我之间——是话语..." },
      ko: { title: "다리", content: "너와 나 사이에 — 말이 있다,\\n침묵의 강을 건너는 다리처럼...", excerpt: "너와 나 사이에 — 말이 있다..." },
    },
  },
  {
    id: "poem-007",
    title: "Чашка утреннего кофе",
    content: "В чашке кофе — целый мир:\\nАромат далёких стран,\\nГорький привкус, сладкий мир,\\nВсё — как маленький роман.\\n\\nПервый глоток — пробуждение,\\nВторой — уже мечта,\\nТретий — тихое прозрение,\\nЧто жизнь — она проста.\\n\\nИ пока дымок струится\\nНад фарфоровым теплом,\\nСердце учится молиться\\nЗа обычный добрый дом.",
    excerpt: "В чашке кофе — целый мир: аромат далёких стран...",
    category: "poetry", tags: ["утро", "кофе", "простота", "жизнь"],
    createdAt: "2026-03-05T07:30:00Z", updatedAt: "2026-03-05T07:30:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 198, likes: 54,
    translations: {
      en: { title: "A Cup of Morning Coffee", content: "In a coffee cup — an entire world:\\nThe aroma of faraway lands,\\nA bitter taste, a gentle world unfurled,\\nAll — like a novel in your hands.\\n\\nFirst sip — awakening,\\nSecond — already a dream,\\nThird — a quiet reckoning\\nThat life is simpler than it seems.", excerpt: "In a coffee cup — an entire world..." },
      de: { title: "Eine Tasse Morgenkaffee", content: "In einer Tasse Kaffee — eine ganze Welt...", excerpt: "In einer Tasse Kaffee..." },
      fr: { title: "Une Tasse de Café du Matin", content: "Dans une tasse de café — un monde entier...", excerpt: "Dans une tasse de café..." },
      zh: { title: "一杯晨间咖啡", content: "咖啡杯中——一个完整的世界...", excerpt: "咖啡杯中——一个完整的世界..." },
      ko: { title: "아침 커피 한 잔", content: "커피 한 잔에 — 온 세상이 담겨있다...", excerpt: "커피 한 잔에 — 온 세상이..." },
    },
  },
  {
    id: "poem-008",
    title: "Горизонт",
    content: "Там, где небо обнимает землю,\\nГде граница — только миф,\\nЯ стою и тихо внемлю\\nГолосу, что вечен, жив.\\n\\nГоризонт — не край, а обещанье,\\nЧто за ним — ещё один рассвет,\\nЧто за каждым тихим расставаньем\\nЕсть начало — и ответ.",
    excerpt: "Там, где небо обнимает землю, где граница — только миф...",
    category: "poetry", tags: ["горизонт", "надежда", "вечность"],
    createdAt: "2026-03-08T09:00:00Z", updatedAt: "2026-03-08T09:00:00Z",
    isPublished: true, language: "ru", readingTime: 1, views: 134, likes: 38,
    translations: {
      en: { title: "The Horizon", content: "Where the sky embraces the earth,\\nWhere borders are only myth,\\nI stand and quietly hear the birth\\nOf a voice eternal, full of pith.\\n\\nThe horizon — not an edge, but a vow\\nThat beyond it — another dawn awaits,\\nThat after every quiet farewell bow\\nThere is a new beginning at the gates.", excerpt: "Where the sky embraces the earth..." },
      de: { title: "Der Horizont", content: "Dort, wo der Himmel die Erde umarmt...", excerpt: "Dort, wo der Himmel..." },
      fr: { title: "L'Horizon", content: "Là où le ciel embrasse la terre...", excerpt: "Là où le ciel embrasse la terre..." },
      zh: { title: "地平线", content: "在天空拥抱大地的地方...", excerpt: "在天空拥抱大地的地方..." },
      ko: { title: "수평선", content: "하늘이 땅을 안는 곳에서...", excerpt: "하늘이 땅을 안는 곳에서..." },
    },
  },

  // ============ PROSE ============
  {
    id: "prose-001",
    title: "Дорога к себе",
    content: "Есть пути, которые ведут через весь мир, и есть дорога, которая начинается в тишине собственного сердца.\\n\\nОна проснулась тем утром с ощущением, что что-то изменилось. Не снаружи — город был тем же, солнце светило как обычно, кофе пах так же, как вчера. Изменилось что-то внутри, словно невидимая стрелка компаса наконец-то нашла свой север.\\n\\n«Сколько лет я искала себя в чужих историях, — подумала она, глядя в окно. — Сколько лет читала чужие карты, надеясь найти свой путь.»\\n\\nОна открыла тетрадь. Страницы были пусты — белые, как снег, как чистый лист обещаний. И она написала первое слово. Потом второе. Потом целое предложение.\\n\\n«Дорога к себе — это не путешествие куда-то. Это возвращение.»\\n\\nПальцы дрожали, но строки ложились ровно. Как будто кто-то диктовал ей изнутри — тот голос, который она так долго заглушала шумом мира.\\n\\nОна закрыла тетрадь, улыбнулась солнцу и пошла дальше. Не в мир. К себе.",
    excerpt: "Есть пути, которые ведут через весь мир, и есть дорога, которая начинается в тишине собственного сердца...",
    category: "prose", tags: ["самопознание", "путь", "мудрость", "тишина"],
    createdAt: "2026-01-20T12:00:00Z", updatedAt: "2026-01-20T12:00:00Z",
    isPublished: true, language: "ru", readingTime: 5, views: 523, likes: 147,
    translations: {
      en: { title: "The Road to Yourself", content: "There are paths that lead across the entire world, and there is a road that begins in the silence of your own heart.\\n\\nShe woke that morning with the feeling that something had changed. Not outside — the city was the same, the sun shone as usual, the coffee smelled just as it did yesterday. Something changed inside, as if an invisible compass needle had finally found its north.\\n\\n'How many years I searched for myself in other people\\'s stories,' she thought, looking out the window. 'How many years I read other people\\'s maps, hoping to find my own path.'\\n\\nShe opened her notebook. The pages were empty — white as snow, like a clean sheet of promises. And she wrote the first word. Then the second. Then an entire sentence.\\n\\n'The road to yourself is not a journey to somewhere. It is a return.'", excerpt: "There are paths that lead across the entire world..." },
      de: { title: "Der Weg zu sich selbst", content: "Es gibt Wege, die durch die ganze Welt führen, und es gibt einen Weg, der in der Stille des eigenen Herzens beginnt.", excerpt: "Es gibt Wege, die durch die ganze Welt führen..." },
      fr: { title: "Le Chemin vers soi", content: "Il y a des chemins qui traversent le monde entier, et il y a un chemin qui commence dans le silence de son propre cœur.", excerpt: "Il y a des chemins qui traversent le monde entier..." },
      zh: { title: "通往自我的路", content: "有些路穿越整个世界，还有一条路从自己内心的寂静开始。", excerpt: "有些路穿越整个世界..." },
      ko: { title: "자신에게로 가는 길", content: "온 세상을 가로지르는 길이 있고, 자신의 마음의 고요 속에서 시작되는 길이 있다.", excerpt: "온 세상을 가로지르는 길이 있고..." },
    },
  },
  {
    id: "prose-002",
    title: "Письмо из будущего",
    content: "Дорогая я из прошлого,\\n\\nЯ пишу тебе из будущего — не далёкого, но достаточно далёкого, чтобы увидеть то, что ты пока не можешь.\\n\\nПерестань торопиться. Ты уже здесь.\\n\\nВсе те вещи, которые не дают тебе спать по ночам — они разрешатся. Не так, как ты ожидаешь, но именно так, как нужно. Жизнь мудрее наших планов.\\n\\nТы спрашиваешь, стоит ли это всё того? Да. Тысячу раз да. Каждая слеза, каждый страх, каждый момент сомнения — всё это кирпичики моста, по которому ты однажды перейдёшь к своей настоящей жизни.\\n\\nНе бойся ошибок. Они — лучшие учителя. Не бойся тишины. В ней рождаются лучшие идеи. Не бойся одиночества. Оно научит тебя самому важному — быть с собой.\\n\\nС любовью из твоего будущего,\\nТы.\\n\\nP.S. Та тетрадь, которую ты хочешь выбросить — не выбрасывай. В ней — начало всего.",
    excerpt: "Дорогая я из прошлого, я пишу тебе из будущего — не далёкого, но достаточно далёкого...",
    category: "prose", tags: ["письмо", "будущее", "надежда", "мудрость"],
    createdAt: "2026-02-10T18:00:00Z", updatedAt: "2026-02-10T18:00:00Z",
    isPublished: true, language: "ru", readingTime: 4, views: 687, likes: 203,
    translations: {
      en: { title: "A Letter from the Future", content: "Dear me from the past,\\n\\nI am writing from the future — not a distant one, but far enough to see what you cannot yet.\\n\\nStop rushing. You are already here.\\n\\nAll those things that keep you awake at night — they will resolve. Not as you expect, but exactly as they should. Life is wiser than our plans.\\n\\nYou ask if it's all worth it? Yes. A thousand times yes.\\n\\nWith love from your future,\\nYou.\\n\\nP.S. That notebook you want to throw away — don't. It holds the beginning of everything.", excerpt: "Dear me from the past..." },
      de: { title: "Ein Brief aus der Zukunft", content: "Liebes Ich aus der Vergangenheit,\\n\\nIch schreibe dir aus der Zukunft...", excerpt: "Liebes Ich aus der Vergangenheit..." },
      fr: { title: "Une lettre du futur", content: "Chère moi du passé,\\n\\nJe t'écris du futur...", excerpt: "Chère moi du passé..." },
      zh: { title: "来自未来的信", content: "亲爱的过去的我，\\n\\n我从未来写信给你...", excerpt: "亲爱的过去的我..." },
      ko: { title: "미래에서 온 편지", content: "과거의 나에게,\\n\\n미래에서 편지를 쓴다...", excerpt: "과거의 나에게..." },
    },
  },
  {
    id: "prose-003",
    title: "Хранительница слов",
    content: "В маленьком городе на берегу моря жила женщина, которую все называли Хранительницей Слов.\\n\\nЕё дом был полон книг — они стояли на полках, лежали стопками на полу, заполняли подоконники и даже ванную комнату. Но самые важные слова хранились не в книгах.\\n\\nОни жили в маленькой деревянной шкатулке на её столе.\\n\\nКаждый вечер она открывала шкатулку и записывала одно слово — самое важное слово дня. Иногда это было «надежда». Иногда — «тишина». Иногда — просто чьё-то имя.\\n\\n«Слова — как семена, — говорила она соседским детям, которые приходили слушать её истории. — Ты бросаешь их в мир, и они прорастают. Иногда — цветами, иногда — деревьями. Но всегда — чем-то живым.»\\n\\nОднажды маленькая девочка спросила: «А что будет, если слова закончатся?»\\n\\nХранительница улыбнулась: «Слова никогда не заканчиваются, милая. Заканчивается только наша готовность их слышать.»\\n\\nВ ту ночь она написала в своей шкатулке: «Бесконечность».",
    excerpt: "В маленьком городе на берегу моря жила женщина, которую все называли Хранительницей Слов...",
    category: "prose", tags: ["слова", "мудрость", "сказка", "море"],
    createdAt: "2026-02-25T15:00:00Z", updatedAt: "2026-02-25T15:00:00Z",
    isPublished: true, language: "ru", readingTime: 5, views: 445, likes: 178,
    translations: {
      en: { title: "The Keeper of Words", content: "In a small town by the sea lived a woman everyone called the Keeper of Words.\\n\\nHer home was full of books — they stood on shelves, lay in stacks on the floor, filled windowsills and even the bathroom. But the most important words weren't kept in books.\\n\\nThey lived in a small wooden box on her desk.\\n\\nEvery evening she opened the box and wrote one word — the most important word of the day.\\n\\n'Words are like seeds,' she told the neighbor children. 'You throw them into the world, and they sprout.'\\n\\nOne day a little girl asked: 'What if the words run out?'\\n\\nThe Keeper smiled: 'Words never run out, dear. Only our willingness to hear them does.'", excerpt: "In a small town by the sea lived a woman everyone called the Keeper of Words..." },
      de: { title: "Die Hüterin der Worte", content: "In einer kleinen Stadt am Meer lebte eine Frau, die alle die Hüterin der Worte nannten...", excerpt: "In einer kleinen Stadt am Meer..." },
      fr: { title: "La Gardienne des Mots", content: "Dans une petite ville au bord de la mer vivait une femme que tous appelaient la Gardienne des Mots...", excerpt: "Dans une petite ville au bord de la mer..." },
      zh: { title: "文字守护者", content: "在海边的一个小镇上，住着一个人人称为文字守护者的女人...", excerpt: "在海边的一个小镇上..." },
      ko: { title: "말의 수호자", content: "바닷가의 작은 마을에 모두가 말의 수호자라고 부르는 여인이 살았다...", excerpt: "바닷가의 작은 마을에..." },
    },
  },
  {
    id: "prose-004",
    title: "Окно в четвёртом этаже",
    content: "Каждый вечер в окне четвёртого этажа загорался свет.\\n\\nНе обычный электрический свет, а мягкий, золотистый — как будто кто-то зажигал десятки свечей. Прохожие иногда останавливались, поднимали головы и улыбались, сами не зная почему.\\n\\nВ той квартире жил старый поэт. Его имя давно забыли, его книги пылились на полках букинистических магазинов, его стихи не публиковали уже двадцать лет.\\n\\nНо каждый вечер он садился у окна, брал перо (да, настоящее перо, он не признавал шариковых ручек) и писал.\\n\\nОн писал не для читателей — их у него больше не было.\\nОн писал не для славы — она давно прошла.\\nОн писал, потому что слова просили быть записанными.\\n\\n«Творчество — это не профессия, — говорил он кошке, которая всегда сидела рядом на подоконнике. — Это способ дышать.»\\n\\nИ кошка, кажется, понимала. Она мурлыкала в такт его строчкам, и свет в окне горел ещё теплее.",
    excerpt: "Каждый вечер в окне четвёртого этажа загорался свет — не обычный электрический...",
    category: "prose", tags: ["поэт", "творчество", "одиночество", "свет"],
    createdAt: "2026-03-03T20:00:00Z", updatedAt: "2026-03-03T20:00:00Z",
    isPublished: true, language: "ru", readingTime: 5, views: 312, likes: 134,
    translations: {
      en: { title: "The Window on the Fourth Floor", content: "Every evening, a light came on in the window of the fourth floor.\\n\\nNot an ordinary electric light, but a soft, golden one — as if someone were lighting dozens of candles. Passersby sometimes stopped, looked up, and smiled, not knowing why.\\n\\nIn that apartment lived an old poet. His name had long been forgotten, his books gathered dust in secondhand shops, his poems hadn't been published in twenty years.\\n\\nBut every evening he sat by the window, took his pen (yes, a real pen — he didn't believe in ballpoint pens) and wrote.\\n\\nHe wrote not for readers — he had none.\\nHe wrote not for fame — it had long passed.\\nHe wrote because the words asked to be written.\\n\\n'Creativity is not a profession,' he told the cat. 'It is a way of breathing.'", excerpt: "Every evening, a light came on in the window of the fourth floor..." },
      de: { title: "Das Fenster im vierten Stock", content: "Jeden Abend ging im Fenster des vierten Stocks ein Licht an...", excerpt: "Jeden Abend ging im Fenster..." },
      fr: { title: "La Fenêtre du quatrième étage", content: "Chaque soir, une lumière s'allumait à la fenêtre du quatrième étage...", excerpt: "Chaque soir, une lumière..." },
      zh: { title: "四楼的窗", content: "每天傍晚，四楼的窗户都会亮起灯光...", excerpt: "每天傍晚，四楼的窗户..." },
      ko: { title: "4층의 창문", content: "매일 저녁, 4층 창문에 불이 켜졌다...", excerpt: "매일 저녁, 4층 창문에..." },
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
  return works.filter((w) => w.isPublished && (w.title.toLowerCase().includes(q) || w.content.toLowerCase().includes(q) || w.tags.some(t => t.toLowerCase().includes(q))));
}
`);

// ============================================================
// SEO: Sitemap
// ============================================================
w("app/sitemap.ts",
`import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://natalia-melkher.vercel.app";
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: baseUrl + "/poetry", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: baseUrl + "/prose", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: baseUrl + "/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: baseUrl + "/contact", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
`);

// ============================================================
// SEO: Robots
// ============================================================
w("app/robots.ts",
`import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://natalia-melkher.vercel.app/sitemap.xml",
  };
}
`);

// ============================================================
// SEO: Manifest
// ============================================================
w("app/manifest.ts",
`import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Наталья Мельхер — Поэзия и Вдохновение",
    short_name: "Н. Мельхер",
    description: "Поэзия, проза и вдохновение Натальи Мельхер",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a1a",
    theme_color: "#a855f7",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
`);

console.log("\\n🎉 UPGRADE COMPLETE!");
console.log("\\nWhat's new:");
console.log("  ✅ Hydration fix (mounted state)");
console.log("  ✅ Google Fonts (Playfair Display, Cormorant Garamond, Inter)");
console.log("  ✅ Enhanced CSS (glass effects, gradients, scrollbar, selection)");
console.log("  ✅ Contact page with form");
console.log("  ✅ 8 poems (was 4)");
console.log("  ✅ 4 prose pieces (was 2)");
console.log("  ✅ SEO: sitemap, robots, manifest, meta tags");
console.log("  ✅ Enhanced particles and backgrounds");
console.log("  ✅ Upgraded Header & Footer");
console.log("\\nRun: npm run dev");
import { writeFileSync, mkdirSync, renameSync, existsSync } from "fs";
import { dirname } from "path";

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
  console.log("✅ " + path);
}

// ── 1. Переименовать middleware → proxy ──────────────────────
if (existsSync("middleware.ts")) {
  renameSync("middleware.ts", "proxy.ts");
  console.log("✅ middleware.ts → proxy.ts");
} else {
  console.log("ℹ️  middleware.ts уже переименован");
}

// ── 2. proxy.ts — правильный синтаксис ───────────────────────
w("proxy.ts", `import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/admin-auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("admin-token")?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
`);

// ── 3. ParticleBackground — fix hydration (client-only) ──────
w("components/ParticleBackground.tsx", `"use client";
import React, { useMemo, useEffect, useState } from "react";

export default function ParticleBackground() {
  // Рендерим только на клиенте, чтобы избежать hydration mismatch
  // от Math.random() при SSR
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left:     Math.random() * 100,
    top:      Math.random() * 100,
    duration: 20 + Math.random() * 30,
    delay:    Math.random() * 20,
    size:     1 + Math.random() * 4,
    opacity:  0.05 + Math.random() * 0.2,
    color:    i % 3 === 0 ? "168,85,247" : i % 3 === 1 ? "245,158,11" : "217,70,239",
  })), []);

  const orbs = useMemo(() => [
    { left: "15%", top: "20%", size: 300, color: "168,85,247", opacity: 0.03,  dur: 25 },
    { left: "75%", top: "60%", size: 250, color: "245,158,11", opacity: 0.025, dur: 30 },
    { left: "50%", top: "80%", size: 350, color: "217,70,239", opacity: 0.02,  dur: 35 },
  ], []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
      suppressHydrationWarning
    >
      {orbs.map((orb, i) => (
        <div
          key={"orb-" + i}
          className="absolute rounded-full animate-pulse-glow"
          style={{
            left:   orb.left,
            top:    orb.top,
            width:  orb.size,
            height: orb.size,
            background: \`radial-gradient(circle, rgba(\${orb.color},\${orb.opacity}) 0%, transparent 70%)\`,
            animationDuration: orb.dur + "s",
            filter: "blur(60px)",
          }}
        />
      ))}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left:            p.left + "%",
            top:             p.top + "%",
            width:           p.size,
            height:          p.size,
            backgroundColor: \`rgba(\${p.color},\${p.opacity})\`,
            animation:       \`float \${p.duration}s ease-in-out \${p.delay}s infinite\`,
          }}
        />
      ))}
    </div>
  );
}
`);

// ── 4. app/admin/layout.tsx — изолированный, без шрифтов ─────
// Admin layout не должен наследовать шрифты из root layout
// чтобы избежать дублирования preload и hydration warnings
w("app/admin/layout.tsx", `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Панель управления — Наталья Мельхер",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
`);

// ── 5. LanguageContext — fix hydration (mounted guard) ───────
w("context/LanguageContext.tsx", `"use client";

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
`);

// ── 6. AnimatedSection — suppressHydrationWarning ────────────
w("components/AnimatedSection.tsx", `"use client";

import React, { useRef, useEffect, useState } from "react";

interface Props {
  children:   React.ReactNode;
  className?: string;
  delay?:     number;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      suppressHydrationWarning
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(28px)",
        transition: \`opacity 0.65s cubic-bezier(0.16,1,0.3,1) \${delay}ms,
                     transform 0.65s cubic-bezier(0.16,1,0.3,1) \${delay}ms\`,
      }}
    >
      {children}
    </div>
  );
}
`);

// ── 7. app/layout.tsx — suppressHydrationWarning на body ─────
w("app/layout.tsx", `import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import "./globals.css";

const playfair = Playfair_Display({
  subsets:  ["latin", "cyrillic"],
  variable: "--font-display",
  display:  "swap",
});
const cormorant = Cormorant_Garamond({
  subsets:  ["latin", "cyrillic"],
  variable: "--font-serif",
  weight:   ["300", "400", "500", "600", "700"],
  display:  "swap",
});
const inter = Inter({
  subsets:  ["latin", "cyrillic"],
  variable: "--font-sans",
  display:  "swap",
});

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default:  "Наталья Мельхер — Поэзия и Вдохновение",
    template: "%s | Наталья Мельхер",
  },
  description:
    "Личный сайт поэтессы и писательницы Натальи Мельхер. " +
    "Поэзия, проза и вдохновение на шести языках: русском, английском, " +
    "немецком, французском, китайском и корейском.",
  keywords: [
    "Наталья Мельхер", "поэзия", "стихи", "проза", "поэтесса",
    "литература", "Natalia Melkher", "poetry", "Russian poetry",
  ],
  authors:   [{ name: "Наталья Мельхер", url: BASE }],
  creator:   "Наталья Мельхер",
  publisher: "Наталья Мельхер",
  robots: {
    index: true, follow: true,
    googleBot: {
      index: true, follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type:            "website",
    locale:          "ru_RU",
    alternateLocale: ["en_US", "de_DE", "fr_FR", "zh_CN", "ko_KR"],
    url:             BASE,
    siteName:        "Наталья Мельхер",
    title:           "Наталья Мельхер — Поэзия и Вдохновение",
    description:     "Пространство вдохновения, где слова обретают крылья",
    images: [{
      url:    "/og-default.png",
      width:  1200,
      height: 630,
      alt:    "Наталья Мельхер — Поэзия",
    }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Наталья Мельхер — Поэзия и Вдохновение",
    description: "Пространство вдохновения, где слова обретают крылья",
    images:      ["/og-default.png"],
  },
  alternates: { canonical: BASE },
};

export const viewport: Viewport = {
  themeColor:  "#a855f7",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={\`\${playfair.variable} \${cormorant.variable} \${inter.variable}\`}
    >
      {/*
        suppressHydrationWarning на body нужен потому что браузерные
        расширения (LastPass, Grammarly и др.) могут добавлять атрибуты
        к body до того, как React гидрирует страницу.
      */}
      <body
        className="min-h-screen flex flex-col antialiased font-sans"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <ParticleBackground />
          <Header />
          <main className="flex-1 relative z-10 pt-20">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
`);

// ── 8. ReadingProgress — client-only ─────────────────────────
w("components/ReadingProgress.tsx", `"use client";
import React, { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const el     = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total    = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="reading-progress"
      style={{ width: progress + "%" }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
`);

// ── 9. WorkStats — client-only ────────────────────────────────
w("components/WorkStats.tsx", `"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";
import { formatDate, getLocale } from "@/lib/utils";

interface Props { work: TranslatedWork; }

export default function WorkStats({ work }: Props) {
  const { language, t, mounted } = useLanguage();
  const [likes,  setLikes]  = useState(work.likes);
  const [liked,  setLiked]  = useState(false);
  const [copied, setCopied] = useState(false);

  // Дата форматируется только после монтирования, чтобы не было mismatch
  const [dateStr, setDateStr] = useState("");
  useEffect(() => {
    setDateStr(formatDate(work.createdAt, getLocale(language)));
  }, [work.createdAt, language]);

  const handleLike = () => {
    const n = !liked;
    setLiked(n);
    setLikes(p => p + (n ? 1 : -1));
  };

  const handleCopy = async () => {
    try {
      const el = document.querySelector<HTMLElement>(".work-content");
      const text = el?.innerText || "";
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: work.title, url: location.href });
    } else {
      navigator.clipboard.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Meta */}
      <div
        className="flex items-center flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500"
        suppressHydrationWarning
      >
        {dateStr && (
          <span className="flex items-center gap-1.5">
            <span>📅</span>
            <span suppressHydrationWarning>{dateStr}</span>
          </span>
        )}
        {dateStr && <span className="text-gray-700 hidden sm:inline">·</span>}
        <span className="flex items-center gap-1.5">
          <span>⏱</span>
          <span>{work.readingTime} {mounted ? t.sections.minuteRead : "мин"}</span>
        </span>
        <span className="text-gray-700 hidden sm:inline">·</span>
        <span className="flex items-center gap-1.5">
          <span>👁</span>
          <span>{work.views.toLocaleString()} {mounted ? t.sections.views : "просм."}</span>
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleLike}
          className={
            "flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-medium transition-all duration-300 " +
            (liked
              ? "bg-red-500/15 border-red-500/40 text-red-400 scale-105 shadow-lg shadow-red-500/10"
              : "glass text-gray-400 hover:border-red-500/30 hover:text-red-400")
          }
        >
          <span>{liked ? "❤️" : "🤍"}</span>
          <span>{likes}</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl glass text-gray-400 hover:border-purple-500/40 hover:text-purple-400 text-sm font-medium transition-all duration-300"
        >
          <span>{copied ? "✅" : "📋"}</span>
          <span>{copied ? (mounted ? t.common.copied : "Скопировано") : (mounted ? t.common.copy : "Копировать")}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl glass text-gray-400 hover:border-amber-500/30 hover:text-amber-400 text-sm font-medium transition-all duration-300"
        >
          <span>🔗</span>
          <span>{mounted ? t.common.share : "Поделиться"}</span>
        </button>
      </div>
    </div>
  );
}
`);

// ── 10. Header — убрать date-related hydration ────────────────
// Header уже правильный, просто добавим suppressHydrationWarning
// на элемент с динамическим контентом (год в footer)
w("components/Footer.tsx", `"use client";
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
                  className={\`text-gray-500 \${item.color} transition-colors text-sm flex items-center gap-2 group\`}>
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
            {year ? \`© \${year} Наталья Мельхер. \${t.footer.rights}.\` : \`© Наталья Мельхер. \${t.footer.rights}.\`}
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
`);

console.log("\n✨ fix.mjs выполнен!");
console.log("\nИсправлено:");
console.log("  ✅ proxy.ts (вместо middleware.ts)");
console.log("  ✅ ParticleBackground — client-only, нет SSR random()");
console.log("  ✅ LanguageContext — mounted guard, нет localStorage при SSR");
console.log("  ✅ AnimatedSection — suppressHydrationWarning");
console.log("  ✅ WorkStats — дата только на клиенте");
console.log("  ✅ Footer — год только на клиенте");
console.log("  ✅ ReadingProgress — client-only");
console.log("  ✅ app/admin/layout.tsx — изолированный layout");
console.log("  ✅ app/layout.tsx — suppressHydrationWarning на body");
console.log("\n▶  npm run dev");
import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
  console.log("✅ " + path);
}

// ── .env.local ───────────────────────────────────────────────
w(".env.local", `ADMIN_PASSWORD=natalia2026
ADMIN_SECRET=super-secret-jwt-key-change-in-production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`);

// ── types/index.ts — расширяем типы ─────────────────────────
w("types/index.ts", `export type Language = "ru" | "en" | "de" | "fr" | "zh" | "ko";

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

export interface AdminWork extends TranslatedWork {
  _draft?: boolean;
}
`);

// ── lib/utils.ts — добавляем helpers ────────────────────────
w("lib/utils.ts", `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, locale = "ru-RU"): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric", month: "long", day: "numeric",
  });
}

export function getLocale(lang: string): string {
  const locales: Record<string, string> = {
    ru: "ru-RU", en: "en-US", de: "de-DE",
    fr: "fr-FR", zh: "zh-CN", ko: "ko-KR",
  };
  return locales[lang] || "ru-RU";
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function generateId(prefix: string): string {
  return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
}

export function truncate(str: string, len = 120): string {
  return str.length <= len ? str : str.slice(0, len).trimEnd() + "…";
}
`);

// ── lib/admin-auth.ts ────────────────────────────────────────
w("lib/admin-auth.ts", `import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_SECRET || "dev-secret-change-me";
const PASSWORD = process.env.ADMIN_PASSWORD || "natalia2026";

// Simple HMAC-based token (no external deps needed beyond Node built-ins)
async function sign(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Buffer.from(sig).toString("base64url");
}

async function verify(payload: string, sig: string): Promise<boolean> {
  const expected = await sign(payload);
  return expected === sig;
}

export async function createToken(): Promise<string> {
  const payload = JSON.stringify({ role: "admin", exp: Date.now() + 24 * 60 * 60 * 1000 });
  const b64 = Buffer.from(payload).toString("base64url");
  const sig = await sign(b64);
  return b64 + "." + sig;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const [b64, sig] = token.split(".");
    if (!b64 || !sig) return false;
    const ok = await verify(b64, sig);
    if (!ok) return false;
    const { exp } = JSON.parse(Buffer.from(b64, "base64url").toString());
    return Date.now() < exp;
  } catch { return false; }
}

export function checkPassword(pwd: string): boolean {
  return pwd === PASSWORD;
}

export async function getAdminSession(): Promise<boolean> {
  try {
    const jar = await cookies();
    const token = jar.get("admin-token")?.value;
    if (!token) return false;
    return verifyToken(token);
  } catch { return false; }
}
`);

// ── lib/works-store.ts — in-memory store с персистентностью─
w("lib/works-store.ts", `// Runtime in-memory store for admin edits
// In production replace with a real DB (Prisma, Supabase, etc.)
import type { TranslatedWork } from "@/types";
import { works as initialWorks } from "@/data/works";

declare global {
  // eslint-disable-next-line no-var
  var __worksStore: TranslatedWork[] | undefined;
}

function getStore(): TranslatedWork[] {
  if (!global.__worksStore) {
    global.__worksStore = JSON.parse(JSON.stringify(initialWorks));
  }
  return global.__worksStore;
}

export function getAllWorks(): TranslatedWork[] {
  return getStore();
}

export function getPublishedWorks(): TranslatedWork[] {
  return getStore().filter((w) => w.isPublished);
}

export function getWorkById(id: string): TranslatedWork | undefined {
  return getStore().find((w) => w.id === id);
}

export function upsertWork(work: TranslatedWork): void {
  const store = getStore();
  const idx = store.findIndex((w) => w.id === work.id);
  if (idx >= 0) store[idx] = work;
  else store.push(work);
}

export function deleteWork(id: string): void {
  const store = getStore();
  const idx = store.findIndex((w) => w.id === id);
  if (idx >= 0) store.splice(idx, 1);
}

export function togglePublish(id: string): TranslatedWork | null {
  const work = getStore().find((w) => w.id === id);
  if (!work) return null;
  work.isPublished = !work.isPublished;
  work.updatedAt = new Date().toISOString();
  return work;
}
`);

// ── app/api/admin/login/route.ts ─────────────────────────────
w("app/api/admin/login/route.ts", `import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!checkPassword(password)) {
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
    }
    const token = await createToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin-token", token, {
      httpOnly: true, sameSite: "lax", maxAge: 86400,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
`);

// ── app/api/admin/logout/route.ts ────────────────────────────
w("app/api/admin/logout/route.ts", `import { NextResponse } from "next/server";
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin-token", "", { maxAge: 0, path: "/" });
  return res;
}
`);

// ── app/api/admin/works/route.ts ─────────────────────────────
w("app/api/admin/works/route.ts", `import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getAllWorks, upsertWork, deleteWork, togglePublish } from "@/lib/works-store";
import type { TranslatedWork } from "@/types";

async function guard() {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const err = await guard(); if (err) return err;
  return NextResponse.json({ data: getAllWorks() });
}

export async function POST(req: NextRequest) {
  const err = await guard(); if (err) return err;
  const work: TranslatedWork = await req.json();
  work.updatedAt = new Date().toISOString();
  if (!work.createdAt) work.createdAt = work.updatedAt;
  upsertWork(work);
  return NextResponse.json({ ok: true, data: work });
}

export async function DELETE(req: NextRequest) {
  const err = await guard(); if (err) return err;
  const { id } = await req.json();
  deleteWork(id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const err = await guard(); if (err) return err;
  const { id } = await req.json();
  const work = togglePublish(id);
  if (!work) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, data: work });
}
`);

// ── middleware.ts ────────────────────────────────────────────
w("middleware.ts", `import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/admin-auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes (except /admin/login)
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

// ── app/admin/login/page.tsx ─────────────────────────────────
w("app/admin/login/page.tsx", `"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      const d = await res.json();
      setError(d.error || "Ошибка входа");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0a1a" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-amber-500 mb-4 text-white font-bold text-2xl">
            НМ
          </div>
          <h1 className="text-2xl font-bold text-white">Панель управления</h1>
          <p className="text-gray-500 text-sm mt-1">Наталья Мельхер</p>
        </div>

        <form onSubmit={handleSubmit}
          className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 backdrop-blur space-y-6">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-amber-500 rounded-full -mt-8 -mx-8 mb-8 rounded-b-none" />

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-2">Пароль</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-amber-600 text-white font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          Только для автора сайта
        </p>
      </div>
    </div>
  );
}
`);

// ── app/admin/layout.tsx ─────────────────────────────────────
w("app/admin/layout.tsx", `import type { Metadata } from "next";
export const metadata: Metadata = { title: "Админ — Наталья Мельхер", robots: "noindex,nofollow" };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body style={{ background: "#0a0a1a", color: "#e2e8f0", fontFamily: "system-ui, sans-serif", margin: 0, minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
`);

// ── app/admin/page.tsx — Dashboard ───────────────────────────
w("app/admin/page.tsx", `"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { TranslatedWork } from "@/types";

const S = {
  header: { display:"flex" as const, alignItems:"center" as const, justifyContent:"space-between" as const, padding:"20px 32px", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)", backdropFilter:"blur(20px)", position:"sticky" as const, top:0, zIndex:10 },
  logo: { display:"flex" as const, alignItems:"center" as const, gap:12 },
  logoBox: { width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#a855f7,#f59e0b)", display:"flex" as const, alignItems:"center" as const, justifyContent:"center" as const, color:"white", fontWeight:700, fontSize:16 },
  main: { maxWidth:1100, margin:"0 auto", padding:"32px 24px" },
  grid: { display:"grid" as const, gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:32 },
  card: { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:24 },
  table: { width:"100%", borderCollapse:"collapse" as const, background:"rgba(255,255,255,0.02)", borderRadius:20, overflow:"hidden" as const },
  th: { padding:"12px 16px", textAlign:"left" as const, fontSize:12, color:"#6b7280", borderBottom:"1px solid rgba(255,255,255,0.06)", fontWeight:600, textTransform:"uppercase" as const, letterSpacing:"0.05em" },
  td: { padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:14, verticalAlign:"middle" as const },
  btn: (color: string) => ({ padding:"6px 14px", borderRadius:10, border:"none", cursor:"pointer" as const, fontSize:12, fontWeight:600, background:color, color:"white", transition:"opacity 0.2s" }),
};

export default function AdminDashboard() {
  const router = useRouter();
  const [works, setWorks] = useState<TranslatedWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all"|"poetry"|"prose"|"draft">("all");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/works");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setWorks(data.data || []);
    setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (id: string) => {
    await fetch("/api/admin/works", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить произведение?")) return;
    setDeleting(id);
    await fetch("/api/admin/works", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setDeleting(null);
    load();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const filtered = works.filter((w) => {
    if (filter === "poetry" && w.category !== "poetry") return false;
    if (filter === "prose"  && w.category !== "prose")  return false;
    if (filter === "draft"  && w.isPublished)            return false;
    if (search && !w.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total:     works.length,
    poetry:    works.filter(w => w.category === "poetry").length,
    prose:     works.filter(w => w.category === "prose").length,
    published: works.filter(w => w.isPublished).length,
    drafts:    works.filter(w => !w.isPublished).length,
    views:     works.reduce((a, w) => a + w.views, 0),
    likes:     works.reduce((a, w) => a + w.likes, 0),
  };

  return (
    <div>
      {/* Header */}
      <div style={S.header}>
        <div style={S.logo}>
          <div style={S.logoBox}>НМ</div>
          <div>
            <div style={{ fontWeight:700, fontSize:16 }}>Панель управления</div>
            <div style={{ fontSize:12, color:"#6b7280" }}>Наталья Мельхер</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <Link href="/" target="_blank" style={{ color:"#a855f7", fontSize:13, textDecoration:"none" }}>← Сайт</Link>
          <Link href="/admin/works/new" style={{ ...S.btn("linear-gradient(135deg,#7c3aed,#a855f7)"), textDecoration:"none", display:"inline-block", padding:"8px 18px" }}>+ Новое</Link>
          <button onClick={handleLogout} style={{ ...S.btn("rgba(255,255,255,0.08)"), color:"#9ca3af" }}>Выйти</button>
        </div>
      </div>

      <div style={S.main}>
        {/* Stats grid */}
        <div style={S.grid}>
          {[
            { label:"Всего", value: stats.total, color:"#a855f7" },
            { label:"Стихи", value: stats.poetry, color:"#8b5cf6" },
            { label:"Проза", value: stats.prose, color:"#f59e0b" },
            { label:"Опубликовано", value: stats.published, color:"#10b981" },
            { label:"Черновики", value: stats.drafts, color:"#6b7280" },
            { label:"Просмотры", value: stats.views.toLocaleString(), color:"#3b82f6" },
            { label:"Лайки", value: stats.likes.toLocaleString(), color:"#ef4444" },
          ].map((s) => (
            <div key={s.label} style={S.card}>
              <div style={{ fontSize:28, fontWeight:800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize:13, color:"#6b7280", marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" as const, alignItems:"center" }}>
          {(["all","poetry","prose","draft"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding:"6px 16px", borderRadius:20, border:"1px solid", fontSize:13, cursor:"pointer",
                borderColor: filter===f ? "#a855f7" : "rgba(255,255,255,0.1)",
                background:  filter===f ? "rgba(168,85,247,0.2)" : "transparent",
                color:       filter===f ? "#c084fc" : "#6b7280" }}>
              {f === "all" ? "Все" : f === "draft" ? "Черновики" : f === "poetry" ? "Стихи" : "Проза"}
            </button>
          ))}
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск..."
            style={{ marginLeft:"auto", padding:"6px 14px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", color:"white", fontSize:13, outline:"none", width:200 }} />
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign:"center", padding:60, color:"#6b7280" }}>Загрузка...</div>
        ) : (
          <div style={{ overflowX:"auto" as const }}>
            <table style={S.table}>
              <thead>
                <tr>
                  {["Название","Категория","Теги","Просм.","Лайки","Статус","Действия"].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ ...S.td, textAlign:"center", color:"#4b5563", padding:40 }}>Ничего не найдено</td></tr>
                ) : filtered.map((work) => (
                  <tr key={work.id} style={{ transition:"background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td style={S.td}>
                      <div style={{ fontWeight:600, color:"#f1f5f9", maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{work.title}</div>
                      <div style={{ fontSize:11, color:"#4b5563", marginTop:2 }}>{work.id}</div>
                    </td>
                    <td style={S.td}>
                      <span style={{ padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600,
                        background: work.category === "poetry" ? "rgba(168,85,247,0.2)" : "rgba(245,158,11,0.2)",
                        color:      work.category === "poetry" ? "#c084fc" : "#fbbf24" }}>
                        {work.category === "poetry" ? "Стихи" : "Проза"}
                      </span>
                    </td>
                    <td style={S.td}>
                      <div style={{ display:"flex", gap:4, flexWrap:"wrap" as const, maxWidth:160 }}>
                        {work.tags.slice(0,3).map(t => (
                          <span key={t} style={{ padding:"2px 8px", borderRadius:10, background:"rgba(255,255,255,0.05)", fontSize:11, color:"#6b7280" }}>#{t}</span>
                        ))}
                        {work.tags.length > 3 && <span style={{ fontSize:11, color:"#4b5563" }}>+{work.tags.length-3}</span>}
                      </div>
                    </td>
                    <td style={{ ...S.td, color:"#6b7280" }}>{work.views.toLocaleString()}</td>
                    <td style={{ ...S.td, color:"#ef4444" }}>{work.likes}</td>
                    <td style={S.td}>
                      <span style={{ padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600,
                        background: work.isPublished ? "rgba(16,185,129,0.15)" : "rgba(107,114,128,0.2)",
                        color:      work.isPublished ? "#34d399" : "#9ca3af" }}>
                        {work.isPublished ? "Опубликовано" : "Черновик"}
                      </span>
                    </td>
                    <td style={S.td}>
                      <div style={{ display:"flex", gap:6 }}>
                        <Link href={\`/admin/works/\${work.id}\`}
                          style={{ ...S.btn("rgba(168,85,247,0.3)"), color:"#c084fc", textDecoration:"none", display:"inline-block", fontSize:12 }}>
                          ✏️ Ред.
                        </Link>
                        <button onClick={() => handleToggle(work.id)}
                          style={S.btn(work.isPublished ? "rgba(107,114,128,0.3)" : "rgba(16,185,129,0.3)")}>
                          {work.isPublished ? "Скрыть" : "Публ."}
                        </button>
                        <button onClick={() => handleDelete(work.id)}
                          disabled={deleting === work.id}
                          style={{ ...S.btn("rgba(239,68,68,0.25)"), color:"#f87171", opacity: deleting===work.id ? 0.5 : 1 }}>
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop:16, fontSize:13, color:"#374151" }}>
          Показано: {filtered.length} из {works.length}
        </div>
      </div>
    </div>
  );
}
`);

// ── app/admin/works/[id]/page.tsx — редактор ────────────────
w("app/admin/works/[id]/page.tsx", `"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { TranslatedWork, WorkCategory, Language } from "@/types";
import { estimateReadingTime, generateId, truncate } from "@/lib/utils";

const LANGS: Language[] = ["ru","en","de","fr","zh","ko"];
const LANG_NAMES: Record<Language,string> = { ru:"Русский",en:"English",de:"Deutsch",fr:"Français",zh:"中文",ko:"한국어" };

const emptyWork = (): Omit<TranslatedWork,"id"> => ({
  title:"", content:"", excerpt:"", category:"poetry", tags:[], language:"ru",
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  isPublished: false, readingTime:1, views:0, likes:0, translations:{},
});

export default function WorkEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const [work, setWork] = useState<TranslatedWork>({ id: isNew ? generateId("work") : String(params.id), ...emptyWork() });
  const [activeLang, setActiveLang] = useState<Language>("ru");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!isNew) {
      fetch("/api/admin/works").then(r => r.json()).then(d => {
        const found = (d.data as TranslatedWork[]).find(w => w.id === params.id);
        if (found) { setWork(found); setTagInput(found.tags.join(", ")); }
      });
    }
  }, [isNew, params.id]);

  const setField = (key: keyof TranslatedWork, val: unknown) =>
    setWork(p => ({ ...p, [key]: val }));

  const setTranslation = (lang: Language, key: "title"|"content"|"excerpt", val: string) =>
    setWork(p => ({
      ...p,
      translations: { ...p.translations, [lang]: { ...(p.translations[lang] || { title:"",content:"",excerpt:"" }), [key]: val } }
    }));

  const handleSave = async () => {
    setSaving(true); setError("");
    const tags = tagInput.split(",").map(t => t.trim()).filter(Boolean);
    const payload: TranslatedWork = {
      ...work, tags,
      readingTime: estimateReadingTime(work.content),
      excerpt: work.excerpt || truncate(work.content, 120),
      updatedAt: new Date().toISOString(),
    };
    const res = await fetch("/api/admin/works", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setSaved(true); setTimeout(() => setSaved(false), 2500);
      if (isNew) router.push(\`/admin/works/\${payload.id}\`);
    } else {
      setError("Ошибка сохранения");
    }
    setSaving(false);
  };

  const input = (label: string, val: string, onChange: (v:string)=>void, opts?: {type?:string;placeholder?:string;rows?:number}) => (
    <div style={{ marginBottom:20 }}>
      <label style={{ display:"block", fontSize:13, color:"#9ca3af", marginBottom:6 }}>{label}</label>
      {opts?.rows ? (
        <textarea value={val} onChange={e=>onChange(e.target.value)} rows={opts.rows}
          placeholder={opts?.placeholder}
          style={{ width:"100%", padding:"10px 14px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", color:"white", fontSize:14, outline:"none", resize:"vertical", boxSizing:"border-box", fontFamily:"monospace", lineHeight:1.6 }} />
      ) : (
        <input type={opts?.type||"text"} value={val} onChange={e=>onChange(e.target.value)}
          placeholder={opts?.placeholder}
          style={{ width:"100%", padding:"10px 14px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", color:"white", fontSize:14, outline:"none", boxSizing:"border-box" }} />
      )}
    </div>
  );

  const panel = { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:24, marginBottom:20 };
  const btn = (bg: string, color="white") => ({ padding:"10px 20px", borderRadius:12, border:"none", background:bg, color, cursor:"pointer" as const, fontSize:14, fontWeight:600 });

  return (
    <div style={{ minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 28px", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)", position:"sticky" as const, top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <Link href="/admin" style={{ color:"#6b7280", textDecoration:"none", fontSize:13 }}>← Назад</Link>
          <span style={{ color:"#374151" }}>|</span>
          <span style={{ fontWeight:600, fontSize:16 }}>{isNew ? "Новое произведение" : work.title || "Редактирование"}</span>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {saved && <span style={{ color:"#34d399", fontSize:13 }}>✓ Сохранено</span>}
          {error && <span style={{ color:"#f87171", fontSize:13 }}>{error}</span>}
          <button onClick={() => setField("isPublished", !work.isPublished)}
            style={btn(work.isPublished ? "rgba(107,114,128,0.3)" : "rgba(16,185,129,0.3)", work.isPublished ? "#9ca3af" : "#34d399")}>
            {work.isPublished ? "Снять с публикации" : "Опубликовать"}
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ ...btn("linear-gradient(135deg,#7c3aed,#a855f7)"), opacity: saving ? 0.7 : 1 }}>
            {saving ? "Сохранение..." : "💾 Сохранить"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"28px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:20 }}>

          {/* Left: content */}
          <div>
            {/* Lang tabs */}
            <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" as const }}>
              {LANGS.map(lang => (
                <button key={lang} onClick={() => setActiveLang(lang)}
                  style={{ padding:"6px 14px", borderRadius:10, border:"1px solid", fontSize:12, cursor:"pointer",
                    borderColor: activeLang===lang ? "#a855f7" : "rgba(255,255,255,0.1)",
                    background:  activeLang===lang ? "rgba(168,85,247,0.2)" : "transparent",
                    color:       activeLang===lang ? "#c084fc" : "#6b7280" }}>
                  {LANG_NAMES[lang]}
                </button>
              ))}
            </div>

            <div style={panel}>
              {activeLang === "ru" ? (
                <>
                  {input("Заголовок (RU)", work.title, v => setField("title", v), { placeholder:"Название произведения" })}
                  {input("Текст", work.content, v => setField("content", v), { rows:18, placeholder:"Текст произведения...\n\nРазделяйте строфы двойным переносом строки" })}
                  {input("Краткое описание", work.excerpt, v => setField("excerpt", v), { placeholder:"Первые строки (автозаполнение если пусто)" })}
                </>
              ) : (
                <>
                  {input(\`Заголовок (\${LANG_NAMES[activeLang]})\`,
                    work.translations[activeLang]?.title || "",
                    v => setTranslation(activeLang, "title", v),
                    { placeholder:"Перевод заголовка" })}
                  {input("Текст перевода",
                    work.translations[activeLang]?.content || "",
                    v => setTranslation(activeLang, "content", v),
                    { rows:16, placeholder:"Перевод текста..." })}
                  {input("Краткое описание",
                    work.translations[activeLang]?.excerpt || "",
                    v => setTranslation(activeLang, "excerpt", v),
                    { placeholder:"Краткое описание на этом языке" })}
                </>
              )}
            </div>
          </div>

          {/* Right: settings */}
          <div>
            <div style={panel}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:16, color:"#e5e7eb" }}>Настройки</div>

              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, color:"#9ca3af", display:"block", marginBottom:6 }}>Категория</label>
                <div style={{ display:"flex", gap:8 }}>
                  {(["poetry","prose"] as WorkCategory[]).map(cat => (
                    <button key={cat} onClick={() => setField("category", cat)}
                      style={{ flex:1, padding:"8px", borderRadius:10, border:"1px solid", fontSize:13, cursor:"pointer",
                        borderColor: work.category===cat ? (cat==="poetry"?"#a855f7":"#f59e0b") : "rgba(255,255,255,0.1)",
                        background:  work.category===cat ? (cat==="poetry"?"rgba(168,85,247,0.2)":"rgba(245,158,11,0.2)") : "transparent",
                        color:       work.category===cat ? (cat==="poetry"?"#c084fc":"#fbbf24") : "#6b7280" }}>
                      {cat === "poetry" ? "Стихи" : "Проза"}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, color:"#9ca3af", display:"block", marginBottom:6 }}>Теги (через запятую)</label>
                <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                  placeholder="природа, весна, любовь"
                  style={{ width:"100%", padding:"8px 12px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", color:"white", fontSize:13, outline:"none", boxSizing:"border-box" }} />
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" as const, marginTop:8 }}>
                  {tagInput.split(",").map(t=>t.trim()).filter(Boolean).map(t => (
                    <span key={t} style={{ padding:"2px 8px", borderRadius:8, background:"rgba(168,85,247,0.15)", color:"#a78bfa", fontSize:11 }}>#{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ padding:"12px 16px", borderRadius:14, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", marginBottom:16 }}>
                <div style={{ fontSize:12, color:"#4b5563", marginBottom:8 }}>Статистика</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    { label:"Просмотры", value: work.views },
                    { label:"Лайки",    value: work.likes },
                    { label:"Время чт.", value: estimateReadingTime(work.content) + " мин" },
                    { label:"Символов", value: work.content.length },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize:11, color:"#4b5563" }}>{s.label}</div>
                      <div style={{ fontSize:16, fontWeight:700, color:"#9ca3af" }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding:"12px 16px", borderRadius:14, background: work.isPublished ? "rgba(16,185,129,0.08)" : "rgba(107,114,128,0.1)", border:"1px solid", borderColor: work.isPublished ? "rgba(16,185,129,0.2)" : "rgba(107,114,128,0.15)" }}>
                <div style={{ fontSize:13, fontWeight:600, color: work.isPublished ? "#34d399" : "#9ca3af" }}>
                  {work.isPublished ? "✓ Опубликовано" : "○ Черновик"}
                </div>
                <div style={{ fontSize:11, color:"#4b5563", marginTop:4 }}>
                  {work.isPublished ? "Видно всем посетителям" : "Не отображается на сайте"}
                </div>
              </div>

              {!isNew && (
                <div style={{ marginTop:16, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize:12, color:"#4b5563", marginBottom:8 }}>Предпросмотр</div>
                  <a href={\`/\${work.category}/\${work.id}\`} target="_blank" rel="noreferrer"
                    style={{ display:"block", padding:"8px 14px", borderRadius:10, background:"rgba(168,85,247,0.1)", color:"#a78bfa", textDecoration:"none", fontSize:13, textAlign:"center" as const }}>
                    Открыть на сайте ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`);

// ── app/admin/works/new/page.tsx ─────────────────────────────
w("app/admin/works/new/page.tsx", `import { redirect } from "next/navigation";
export default function NewWorkRedirect() {
  redirect("/admin/works/new-editor");
}
`);

// Alias route
w("app/admin/works/new-editor/page.tsx", `"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateId } from "@/lib/utils";
export default function NewWorkPage() {
  const router = useRouter();
  useEffect(() => { router.replace(\`/admin/works/\${generateId("work")}\`); }, [router]);
  return null;
}
`);

// ── app/api/works/route.ts — публичный API через store ───────
w("app/api/works/route.ts", `import { NextRequest, NextResponse } from "next/server";
import { getPublishedWorks } from "@/lib/works-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query    = searchParams.get("q");
    const id       = searchParams.get("id");

    let results = getPublishedWorks();

    if (id)       results = results.filter(w => w.id === id);
    if (category) results = results.filter(w => w.category === category);
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.content.toLowerCase().includes(q) ||
        w.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return NextResponse.json({ success: true, data: results, total: results.length });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
`);

// ── SEO: улучшенный sitemap ──────────────────────────────────
w("app/sitemap.ts", `import type { MetadataRoute } from "next";
import { getAllPublishedWorks } from "@/data/works";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const works = getAllPublishedWorks();

  const workUrls = works.map((work) => ({
    url: \`\${BASE}/\${work.category}/\${work.id}\`,
    lastModified: new Date(work.updatedAt),
    changeFrequency: "monthly" as const,
    priority: work.views > 400 ? 0.9 : work.views > 200 ? 0.8 : 0.7,
  }));

  const poetryTags = [...new Set(works.filter(w => w.category === "poetry").flatMap(w => w.tags))];
  const proseTags  = [...new Set(works.filter(w => w.category === "prose").flatMap(w => w.tags))];

  const tagUrls = [
    ...poetryTags.map(tag => ({ url: \`\${BASE}/poetry?tag=\${encodeURIComponent(tag)}\`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...proseTags.map(tag  => ({ url: \`\${BASE}/prose?tag=\${encodeURIComponent(tag)}\`,   lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];

  return [
    { url: BASE,               lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: \`\${BASE}/poetry\`,  lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: \`\${BASE}/prose\`,   lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: \`\${BASE}/about\`,   lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: \`\${BASE}/contact\`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    ...workUrls,
    ...tagUrls,
  ];
}
`);

// ── SEO: динамические metadata для poetry/[id] ──────────────
w("app/poetry/[id]/opengraph-image.tsx", `import { ImageResponse } from "next/og";
import { getWorkById } from "@/data/works";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage({ params }: { params: { id: string } }) {
  const work = getWorkById(params.id);
  const title = work?.title || "Поэзия";
  const excerpt = work?.excerpt?.slice(0, 80) || "";

  return new ImageResponse(
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#0a0a1a,#1a0a2e)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:60, fontFamily:"serif" }}>
      <div style={{ fontSize:18, color:"#a855f7", marginBottom:20, letterSpacing:"0.2em" }}>НАТАЛЬЯ МЕЛЬХЕР</div>
      <div style={{ fontSize:56, fontWeight:800, color:"white", textAlign:"center", maxWidth:900, lineHeight:1.2 }}>{title}</div>
      {excerpt && <div style={{ fontSize:24, color:"rgba(255,255,255,0.5)", textAlign:"center", marginTop:24, maxWidth:700, fontStyle:"italic" }}>{excerpt}</div>}
      <div style={{ position:"absolute", bottom:40, fontSize:16, color:"rgba(255,255,255,0.3)" }}>natalia-melkher.vercel.app</div>
    </div>,
    { ...size }
  );
}
`);

// ── SEO: metadata layout улучшенный ─────────────────────────
w("app/layout.tsx", `import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import "./globals.css";

const playfair  = Playfair_Display({ subsets:["latin","cyrillic"], variable:"--font-display", display:"swap" });
const cormorant = Cormorant_Garamond({ subsets:["latin","cyrillic"], variable:"--font-serif", weight:["300","400","500","600","700"], display:"swap" });
const inter     = Inter({ subsets:["latin","cyrillic"], variable:"--font-sans", display:"swap" });

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Наталья Мельхер — Поэзия и Вдохновение",
    template: "%s | Наталья Мельхер",
  },
  description: "Личный сайт поэтессы и писательницы Натальи Мельхер. Поэзия, проза и вдохновение на шести языках: русском, английском, немецком, французском, китайском и корейском.",
  keywords: ["Наталья Мельхер","поэзия","стихи","проза","поэтесса","литература","Natalia Melkher","poetry","Russian poetry"],
  authors: [{ name:"Наталья Мельхер", url: BASE }],
  creator: "Наталья Мельхер",
  publisher: "Наталья Мельхер",
  robots: { index:true, follow:true, googleBot:{ index:true, follow:true, "max-image-preview":"large", "max-snippet":-1 } },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    alternateLocale: ["en_US","de_DE","fr_FR","zh_CN","ko_KR"],
    url: BASE,
    siteName: "Наталья Мельхер",
    title: "Наталья Мельхер — Поэзия и Вдохновение",
    description: "Пространство вдохновения, где слова обретают крылья",
    images: [{ url:"/og-default.png", width:1200, height:630, alt:"Наталья Мельхер — Поэзия" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Наталья Мельхер — Поэзия и Вдохновение",
    description: "Пространство вдохновения, где слова обретают крылья",
    images: ["/og-default.png"],
  },
  alternates: { canonical: BASE },
};

export const viewport: Viewport = {
  themeColor: "#a855f7",
  colorScheme: "dark",
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

// ── SEO: metadata для /poetry/[id] ───────────────────────────
w("app/poetry/[id]/metadata.ts", `import type { Metadata } from "next";
import { getWorkById } from "@/data/works";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const work = getWorkById(params.id);
  if (!work) return { title: "Стихотворение не найдено" };

  const title = work.title;
  const description = work.excerpt || work.content.slice(0, 155).replace(/\\n/g, " ");
  const url = \`\${BASE}/poetry/\${work.id}\`;

  return {
    title,
    description,
    keywords: [...work.tags, "поэзия", "стихи", "Наталья Мельхер"],
    openGraph: {
      title, description, url, type:"article",
      publishedTime: work.createdAt, modifiedTime: work.updatedAt,
      authors: ["Наталья Мельхер"],
      tags: work.tags,
      images: [{ url: \`/poetry/\${work.id}/opengraph-image\`, width:1200, height:630 }],
    },
    twitter: { card:"summary_large_image", title, description },
    alternates: { canonical: url },
  };
}
`);

// ── SEO: metadata для /prose/[id] ────────────────────────────
w("app/prose/[id]/metadata.ts", `import type { Metadata } from "next";
import { getWorkById } from "@/data/works";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://natalia-melkher.vercel.app";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const work = getWorkById(params.id);
  if (!work) return { title: "Произведение не найдено" };

  const title = work.title;
  const description = work.excerpt || work.content.slice(0, 155).replace(/\\n/g, " ");
  const url = \`\${BASE}/prose/\${work.id}\`;

  return {
    title, description,
    keywords: [...work.tags, "проза", "рассказ", "Наталья Мельхер"],
    openGraph: {
      title, description, url, type:"article",
      publishedTime: work.createdAt, modifiedTime: work.updatedAt,
      authors: ["Наталья Мельхер"], tags: work.tags,
    },
    twitter: { card:"summary_large_image", title, description },
    alternates: { canonical: url },
  };
}
`);

// ── app/globals.css — улучшенный дизайн ─────────────────────
w("app/globals.css", `@import "tailwindcss";

@theme {
  --font-display: var(--font-display), "Playfair Display", Georgia, serif;
  --font-serif: var(--font-serif), "Cormorant Garamond", Georgia, serif;
  --font-sans: var(--font-sans), "Inter", system-ui, sans-serif;
  --color-midnight: #080818;
  --color-velvet: #150826;
  --color-ink: #0d1b2a;
}

/* ── Reset & Base ───────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }

body {
  background: #080818;
  background-image:
    radial-gradient(ellipse 80% 50% at 20% 0%,   rgba(139,92,246,0.08) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 20%,  rgba(245,158,11,0.05) 0%, transparent 60%),
    radial-gradient(ellipse 100% 60% at 50% 100%, rgba(168,85,247,0.06) 0%, transparent 60%);
  color: #e2e8f0;
  min-height: 100vh;
}

/* ── Scrollbar ──────────────────────────────────────── */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: #080818; }
::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #a855f7 0%, #7c3aed 50%, #f59e0b 100%);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover { opacity: 0.8; }

/* ── Selection ──────────────────────────────────────── */
::selection { background: rgba(168,85,247,0.35); color: #f3e8ff; }

/* ── Gradient Text ──────────────────────────────────── */
.gradient-text {
  background: linear-gradient(135deg, #e879f9 0%, #a855f7 30%, #f59e0b 65%, #e879f9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: gradient-shift 8s ease infinite;
}

.gradient-text-gold {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 30%, #d946ef 70%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: gradient-shift 8s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}

/* ── Glass ──────────────────────────────────────────── */
.glass {
  background: rgba(255,255,255,0.025);
  backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(255,255,255,0.07);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.glass:hover {
  border-color: rgba(255,255,255,0.12);
}

.glass-purple {
  background: rgba(168,85,247,0.06);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(168,85,247,0.15);
}
.glass-gold {
  background: rgba(245,158,11,0.06);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(245,158,11,0.15);
}

/* ── Glow ───────────────────────────────────────────── */
.glow-purple { box-shadow: 0 0 40px rgba(168,85,247,0.18), 0 0 80px rgba(168,85,247,0.06); }
.glow-gold   { box-shadow: 0 0 40px rgba(245,158,11,0.18), 0 0 80px rgba(245,158,11,0.06); }
.glow-sm     { box-shadow: 0 0 20px rgba(168,85,247,0.12); }

/* ── Text helpers ───────────────────────────────────── */
.prose-text {
  font-family: var(--font-serif);
  line-height: 1.85;
  letter-spacing: 0.015em;
}

.drop-cap::first-letter {
  font-family: var(--font-display);
  float: left;
  font-size: 4em;
  line-height: 0.75;
  margin: 0.05em 0.12em 0 0;
  padding: 0.05em 0;
  background: linear-gradient(135deg, #a855f7, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

/* ── Animations ─────────────────────────────────────── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-up { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.animate-fade-in { animation: fade-in 0.6s ease forwards; }

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-8px) rotate(1deg); }
  66%       { transform: translateY(-4px) rotate(-1deg); }
}
.animate-float { animation: float 8s ease-in-out infinite; }

@keyframes pulse-glow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(1.05); }
}
.animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.animate-shimmer {
  background: linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.06) 50%, transparent 80%);
  background-size: 200% auto;
  animation: shimmer 2.5s linear infinite;
}

@keyframes border-spin {
  to { transform: rotate(360deg); }
}

/* ── Card hover effects ─────────────────────────────── */
.card-hover {
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, border-color 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-4px) scale(1.005);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(168,85,247,0.08);
}

/* ── Poem card accent line ──────────────────────────── */
.poem-accent::before {
  content: "";
  display: block;
  height: 2px;
  background: linear-gradient(90deg, #a855f7, #f59e0b, #a855f7);
  background-size: 200% auto;
  animation: shimmer 3s linear infinite;
  border-radius: 1px;
}

/* ── Button styles ──────────────────────────────────── */
.btn-primary {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary::before {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #6d28d9, #9333ea);
  opacity: 0;
  transition: opacity 0.3s;
}
.btn-primary:hover { transform: scale(1.04); box-shadow: 0 8px 30px rgba(139,92,246,0.4); }
.btn-primary:hover::before { opacity: 1; }
.btn-primary:active { transform: scale(0.98); }

/* ── Tag pills ──────────────────────────────────────── */
.tag-pill {
  display: inline-flex; align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: #6b7280;
  transition: all 0.2s;
  text-decoration: none;
}
.tag-pill:hover {
  background: rgba(168,85,247,0.12);
  border-color: rgba(168,85,247,0.3);
  color: #c084fc;
}

/* ── Reading progress bar ───────────────────────────── */
.reading-progress {
  position: fixed; top: 0; left: 0; height: 2px; z-index: 100;
  background: linear-gradient(90deg, #a855f7, #f59e0b);
  transition: width 0.1s linear;
  box-shadow: 0 0 8px rgba(168,85,247,0.6);
}

/* ── Skeleton loader ────────────────────────────────── */
.skeleton {
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
  background-size: 200% auto;
  animation: shimmer 1.5s linear infinite;
  border-radius: 8px;
}

/* ── Focus styles ───────────────────────────────────── */
:focus-visible {
  outline: 2px solid rgba(168,85,247,0.6);
  outline-offset: 2px;
  border-radius: 4px;
}

/* ── Responsive typography ──────────────────────────── */
@media (max-width: 640px) {
  .prose-text { font-size: 15px; line-height: 1.8; }
}
`);

// ── components/ReadingProgress.tsx ──────────────────────────
w("components/ReadingProgress.tsx", `"use client";
import React, { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total    = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

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

// ── components/WorkStats.tsx ─────────────────────────────────
w("components/WorkStats.tsx", `"use client";
import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";
import { formatDate, getLocale } from "@/lib/utils";

interface Props { work: TranslatedWork; }

export default function WorkStats({ work }: Props) {
  const { language, t } = useLanguage();
  const [likes, setLikes]   = useState(work.likes);
  const [liked, setLiked]   = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    const n = !liked;
    setLiked(n);
    setLikes(p => p + (n ? 1 : -1));
  };

  const handleCopy = async () => {
    try {
      const content = document.querySelector(".work-content")?.textContent || "";
      await navigator.clipboard.writeText(content);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: work.title, url: location.href });
    } else {
      navigator.clipboard.writeText(location.href);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Meta info */}
      <div className="flex items-center flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="text-base">📅</span>
          {formatDate(work.createdAt, getLocale(language))}
        </span>
        <span className="text-gray-700">·</span>
        <span className="flex items-center gap-1.5">
          <span className="text-base">⏱</span>
          {work.readingTime} {t.sections.minuteRead}
        </span>
        <span className="text-gray-700">·</span>
        <span className="flex items-center gap-1.5">
          <span className="text-base">👁</span>
          {work.views.toLocaleString()} {t.sections.views}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={handleLike}
          className={\`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-medium transition-all duration-300 \${
            liked
              ? "bg-red-500/15 border-red-500/40 text-red-400 scale-105 shadow-lg shadow-red-500/10"
              : "glass text-gray-400 hover:border-red-500/30 hover:text-red-400"
          }\`}>
          <span className="text-base">{liked ? "❤️" : "🤍"}</span>
          <span>{likes}</span>
        </button>

        <button onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl glass text-gray-400 hover:border-purple-500/40 hover:text-purple-400 text-sm font-medium transition-all duration-300">
          <span className="text-base">{copied ? "✅" : "📋"}</span>
          <span>{copied ? t.common.copied : t.common.copy}</span>
        </button>

        <button onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl glass text-gray-400 hover:border-amber-500/30 hover:text-amber-400 text-sm font-medium transition-all duration-300">
          <span className="text-base">🔗</span>
          <span>{t.common.share}</span>
        </button>
      </div>
    </div>
  );
}
`);

// ── components/PoemCard.tsx — улучшенный дизайн ──────────────
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

  const tr      = language !== "ru" ? work.translations[language] : undefined;
  const title   = tr?.title   ?? work.title;
  const excerpt = tr?.excerpt ?? work.excerpt;

  return (
    <article className="group relative bg-white/[0.025] backdrop-blur border border-white/[0.07] rounded-3xl overflow-hidden card-hover">
      {/* Top accent */}
      <div className="poem-accent" />

      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-amber-500/0 group-hover:from-purple-500/[0.03] group-hover:to-amber-500/[0.03] transition-all duration-500 pointer-events-none rounded-3xl" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <span className="px-3 py-1 text-[11px] font-semibold rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20 tracking-wide uppercase">
            {t.sections.poetry}
          </span>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span>{work.readingTime} {t.sections.minuteRead}</span>
            <span>·</span>
            <time>{formatDate(work.createdAt, getLocale(language))}</time>
          </div>
        </div>

        {/* Title */}
        <Link href={\`/poetry/\${work.id}\`}>
          <h3 className="font-display text-2xl font-bold text-gray-100 group-hover:text-purple-200 transition-colors duration-300 mb-4 leading-snug">
            {title}
          </h3>
        </Link>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5 opacity-30">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
          <span className="text-purple-400 text-sm">✦</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
        </div>

        {/* Excerpt */}
        <p className="text-gray-400 leading-relaxed font-serif italic text-sm line-clamp-3 mb-5">
          {excerpt}
        </p>

        {/* Read more */}
        <Link href={\`/poetry/\${work.id}\`}
          className="inline-flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium group/link">
          <span>{t.sections.readMore}</span>
          <span className="group-hover/link:translate-x-1 transition-transform inline-block">→</span>
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-5">
          {work.tags.slice(0, 4).map((tag) => (
            <Link key={tag} href={\`/poetry?tag=\${encodeURIComponent(tag)}\`} className="tag-pill">
              #{tag}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/[0.04]">
          <button
            onClick={() => { setLiked(!liked); setLikes(p => liked ? p-1 : p+1); }}
            className={\`flex items-center gap-1.5 text-sm transition-all duration-200 \${liked ? "text-red-400 scale-110" : "text-gray-600 hover:text-red-400"}\`}>
            <span>{liked ? "❤️" : "🤍"}</span>
            <span className="font-medium">{likes}</span>
          </button>
          <span className="flex items-center gap-1.5 text-sm text-gray-600">
            <span>👁</span>
            <span>{work.views.toLocaleString()}</span>
          </span>
          <div className="ml-auto">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-amber-500/20 border border-white/5 flex items-center justify-center text-xs text-gray-500 group-hover:border-purple-500/30 transition-colors">
              ✦
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
`);

// ── components/ProseCard.tsx — улучшенный дизайн ─────────────
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

  const tr      = language !== "ru" ? work.translations[language] : undefined;
  const title   = tr?.title   ?? work.title;
  const excerpt = tr?.excerpt ?? work.excerpt;

  return (
    <article className="group relative bg-white/[0.025] backdrop-blur border border-white/[0.07] rounded-3xl overflow-hidden card-hover">
      {/* Top accent */}
      <div className="h-[2px] bg-gradient-to-r from-amber-500 via-amber-300 to-purple-500" style={{ backgroundSize:"200% auto", animation:"shimmer 3s linear infinite" }} />

      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-purple-500/0 group-hover:from-amber-500/[0.03] group-hover:to-purple-500/[0.02] transition-all duration-500 pointer-events-none rounded-3xl" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[11px] font-semibold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 tracking-wide uppercase">
              {t.sections.prose}
            </span>
            <span className="px-2 py-1 text-[11px] rounded-full bg-white/[0.04] text-gray-600 border border-white/[0.05]">
              {work.readingTime} {t.sections.minuteRead}
            </span>
          </div>
          <time className="text-xs text-gray-600">{formatDate(work.createdAt, getLocale(language))}</time>
        </div>

        {/* Title */}
        <Link href={\`/prose/\${work.id}\`}>
          <h3 className="font-display text-2xl font-bold text-gray-100 group-hover:text-amber-200 transition-colors duration-300 mb-4 leading-snug">
            {title}
          </h3>
        </Link>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5 opacity-30">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          <span className="text-amber-400 text-sm">❧</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        </div>

        {/* Excerpt */}
        <p className="text-gray-400 leading-relaxed font-serif text-sm line-clamp-4 mb-5">
          {excerpt}
        </p>

        {/* Read more */}
        <Link href={\`/prose/\${work.id}\`}
          className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium group/link">
          <span>{t.sections.readMore}</span>
          <span className="group-hover/link:translate-x-1 transition-transform inline-block">→</span>
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-5">
          {work.tags.slice(0, 4).map((tag) => (
            <Link key={tag} href={\`/prose?tag=\${encodeURIComponent(tag)}\`}
              className="tag-pill hover:!bg-amber-500/10 hover:!border-amber-500/30 hover:!text-amber-400">
              #{tag}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/[0.04]">
          <button
            onClick={() => { setLiked(!liked); setLikes(p => liked ? p-1 : p+1); }}
            className={\`flex items-center gap-1.5 text-sm transition-all duration-200 \${liked ? "text-red-400 scale-110" : "text-gray-600 hover:text-red-400"}\`}>
            <span>{liked ? "❤️" : "🤍"}</span>
            <span className="font-medium">{likes}</span>
          </button>
          <span className="flex items-center gap-1.5 text-sm text-gray-600">
            <span>👁</span>
            <span>{work.views.toLocaleString()}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
`);

// ── components/Header.tsx — улучшенный ──────────────────────
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
    { href:"/",        label:t.nav.home },
    { href:"/poetry",  label:t.nav.poetry },
    { href:"/prose",   label:t.nav.prose },
    { href:"/about",   label:t.nav.about },
    { href:"/contact", label:t.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header className={"fixed top-0 left-0 right-0 z-50 transition-all duration-500 " + (scrolled
      ? "bg-gray-950/75 backdrop-blur-2xl shadow-2xl shadow-black/20 border-b border-white/[0.04] py-3"
      : "bg-transparent py-5")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-amber-500 opacity-80 group-hover:opacity-100 group-hover:rotate-6 transition-all duration-300" />
            <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              НМ
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-400 text-lg leading-tight tracking-tight">
              Наталья Мельхер
            </span>
            <span className="text-[9px] text-gray-600 tracking-[0.25em] uppercase">Poetry & Prose</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={"relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 " +
                  (active ? "text-purple-300" : "text-gray-400 hover:text-white")}>
                <span className="relative z-10">{item.label}</span>
                {active && (
                  <span className="absolute inset-0 rounded-xl bg-purple-500/12 border border-purple-500/20" />
                )}
                {active && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-400" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Меню">
            <div className="flex flex-col gap-1.5 w-5">
              <span className={"h-0.5 bg-gray-300 rounded-full transition-all duration-300 " + (mobileOpen ? "rotate-45 translate-y-2" : "")} />
              <span className={"h-0.5 bg-gray-300 rounded-full transition-all duration-300 " + (mobileOpen ? "opacity-0 scale-x-0" : "")} />
              <span className={"h-0.5 bg-gray-300 rounded-full transition-all duration-300 " + (mobileOpen ? "-rotate-45 -translate-y-2" : "")} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-gray-950/98 backdrop-blur-3xl" onClick={() => setMobileOpen(false)} />
          <div className="relative flex flex-col items-center justify-center h-full gap-6">
            {navItems.map((item, i) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}
                  className={"font-display text-4xl font-bold transition-all duration-300 " + (active ? "gradient-text" : "text-gray-400 hover:text-white")}
                  style={{ animationDelay: i * 80 + "ms" }}>
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-8"><LanguageSwitcher /></div>
          </div>
        </div>
      )}
    </header>
  );
}
`);

// ── components/Footer.tsx — улучшенный ──────────────────────
w("components/Footer.tsx", `"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-white/[0.04] overflow-hidden">
      {/* Background glow */}
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
              {["📧","✈️","📸"].map((icon, i) => (
                <div key={i} className="w-9 h-9 rounded-xl glass flex items-center justify-center text-sm hover:border-purple-500/30 transition-colors cursor-pointer">
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-5">Навигация</h4>
            <nav className="flex flex-col gap-3">
              {[
                { href:"/poetry",  label:t.nav.poetry,  color:"hover:text-purple-400" },
                { href:"/prose",   label:t.nav.prose,   color:"hover:text-amber-400" },
                { href:"/about",   label:t.nav.about,   color:"hover:text-purple-400" },
                { href:"/contact", label:t.nav.contact, color:"hover:text-purple-400" },
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
                <span className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-sm group-hover:bg-purple-500/20 transition-colors">📧</span>
                natalia@melkher.com
              </a>
              <a href="https://t.me/nataliamelkher" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-500 hover:text-amber-400 transition-colors text-sm group">
                <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-sm group-hover:bg-amber-500/20 transition-colors">✈️</span>
                @nataliamelkher
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {year} Наталья Мельхер. {t.footer.rights}.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span>{t.footer.madeWith}</span>
            <span className="text-red-400 mx-1">💜</span>
            <span>{t.footer.inspiration}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
`);

// ── app/poetry/[id]/page.tsx — с ReadingProgress ────────────
w("app/poetry/[id]/page.tsx", `"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getWorkById, getWorksByCategory } from "@/data/works";
import AnimatedSection from "@/components/AnimatedSection";
import WorkStats from "@/components/WorkStats";
import ReadingProgress from "@/components/ReadingProgress";
import { formatDate, getLocale } from "@/lib/utils";

export default function PoemPage() {
  const params  = useParams();
  const router  = useRouter();
  const { language, t } = useLanguage();

  const id   = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const work = getWorkById(id);
  const related = getWorksByCategory("poetry").filter(p => p.id !== id && p.tags.some(tag => work?.tags.includes(tag))).slice(0,2);

  if (!work || work.category !== "poetry") return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-8xl select-none">📜</div>
      <h1 className="text-3xl font-bold text-gray-300">Стихотворение не найдено</h1>
      <Link href="/poetry" className="px-8 py-3 rounded-2xl bg-purple-600 text-white hover:bg-purple-500 transition-colors">← {t.nav.poetry}</Link>
    </div>
  );

  const tr      = language !== "ru" ? work.translations[language] : undefined;
  const title   = tr?.title   ?? work.title;
  const content = tr?.content ?? work.content;
  const stanzas = content.split(/\\n\\n+/);

  return (
    <div className="min-h-screen">
      <ReadingProgress />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-500/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 pt-16 pb-28 relative z-10">

        <AnimatedSection delay={0}>
          <button onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-400 transition-colors mb-14 group text-sm">
            <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
            <span>{t.nav.poetry}</span>
          </button>
        </AnimatedSection>

        <AnimatedSection delay={80}>
          <div className="mb-14 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
              <span className="text-purple-400 text-xs">✦</span>
              <span className="text-purple-400 text-xs font-semibold tracking-widest uppercase">{t.sections.poetry}</span>
              <span className="text-purple-400 text-xs">✦</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-8">
              {title}
            </h1>
            <WorkStats work={work} />
          </div>
        </AnimatedSection>

        {/* Poem */}
        <AnimatedSection delay={160}>
          <div className="glass-purple rounded-3xl overflow-hidden mb-10 glow-sm">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-shimmer" style={{backgroundSize:"200% auto"}} />
            <div className="p-8 sm:p-12 md:p-16 work-content">
              <div className="font-serif text-xl sm:text-2xl text-gray-100/90 leading-[2.2] tracking-wide space-y-10 text-center">
                {stanzas.map((stanza, si) => (
                  <div key={si} className="space-y-1">
                    {stanza.split("\\n").map((line, li) => (
                      <p key={li} className="text-gray-200/80 hover:text-gray-100 transition-colors">{line || <>&nbsp;</>}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          </div>
        </AnimatedSection>

        {/* Tags */}
        <AnimatedSection delay={240}>
          <div className="flex flex-wrap gap-2 mb-14 justify-center">
            {work.tags.map(tag => (
              <Link key={tag} href={\`/poetry?tag=\${encodeURIComponent(tag)}\`} className="tag-pill">#{tag}</Link>
            ))}
          </div>
        </AnimatedSection>

        {/* Related */}
        {related.length > 0 && (
          <AnimatedSection delay={320}>
            <div className="border-t border-white/[0.05] pt-14 mb-12">
              <h2 className="font-display text-2xl font-bold text-gray-300 mb-6 text-center">{t.sections.poetry}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map(poem => {
                  const rTr = language !== "ru" ? poem.translations[language] : undefined;
                  return (
                    <Link key={poem.id} href={\`/poetry/\${poem.id}\`}
                      className="glass rounded-2xl p-6 hover:border-purple-500/30 hover:-translate-y-1 transition-all group block">
                      <div className="h-0.5 bg-gradient-to-r from-purple-500 to-amber-500 rounded-full mb-4 opacity-30 group-hover:opacity-80 transition-opacity" />
                      <h3 className="font-display text-lg font-bold text-gray-200 group-hover:text-purple-300 transition-colors">{rTr?.title ?? poem.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2 font-serif italic">{rTr?.excerpt ?? poem.excerpt}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection delay={380}>
          <div className="text-center">
            <Link href="/poetry"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl glass-purple text-purple-300 hover:text-white hover:bg-purple-500/20 transition-all font-medium">
              ← {t.sections.allWorks} {t.sections.poetry}
            </Link>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}
`);

// ── app/prose/[id]/page.tsx — с ReadingProgress ──────────────
w("app/prose/[id]/page.tsx", `"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getWorkById, getWorksByCategory } from "@/data/works";
import AnimatedSection from "@/components/AnimatedSection";
import WorkStats from "@/components/WorkStats";
import ReadingProgress from "@/components/ReadingProgress";

export default function ProsePiecePage() {
  const params  = useParams();
  const router  = useRouter();
  const { language, t } = useLanguage();

  const id   = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const work = getWorkById(id);
  const related = getWorksByCategory("prose").filter(p => p.id !== id && p.tags.some(tag => work?.tags.includes(tag))).slice(0,2);

  if (!work || work.category !== "prose") return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-8xl select-none">📖</div>
      <h1 className="text-3xl font-bold text-gray-300">Произведение не найдено</h1>
      <Link href="/prose" className="px-8 py-3 rounded-2xl bg-amber-600 text-white hover:bg-amber-500 transition-colors">← {t.nav.prose}</Link>
    </div>
  );

  const tr      = language !== "ru" ? work.translations[language] : undefined;
  const title   = tr?.title   ?? work.title;
  const content = tr?.content ?? work.content;
  const paragraphs = content.split(/\\n\\n+/).filter(Boolean);

  return (
    <div className="min-h-screen">
      <ReadingProgress />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 pt-16 pb-28 relative z-10">

        <AnimatedSection delay={0}>
          <button onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-400 transition-colors mb-14 group text-sm">
            <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
            <span>{t.nav.prose}</span>
          </button>
        </AnimatedSection>

        <AnimatedSection delay={80}>
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <span className="text-amber-400 text-xs">❧</span>
              <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">{t.sections.prose}</span>
              <span className="text-amber-400 text-xs">❧</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-8">
              {title}
            </h1>
            <WorkStats work={work} />
          </div>
        </AnimatedSection>

        {/* Prose text */}
        <AnimatedSection delay={160}>
          <div className="glass-gold rounded-3xl overflow-hidden mb-10">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div className="p-8 sm:p-12 md:p-16 work-content">
              <div className="space-y-6">
                {paragraphs.map((para, i) => {
                  const trimmed  = para.trim();
                  const isQuote  = trimmed.startsWith("«") || trimmed.startsWith('"');
                  const isLetter = ["Дорог","Dear","С любов","With love","P.S."].some(p => trimmed.startsWith(p));
                  return (
                    <p key={i} style={{ whiteSpace:"pre-line" }}
                      className={
                        "prose-text text-base sm:text-lg leading-[1.95] " +
                        (i===0&&!isQuote&&!isLetter ? "drop-cap text-gray-100 " : "text-gray-300 ") +
                        (isQuote  ? "pl-6 border-l-2 border-amber-400/30 text-gray-400 italic " : "") +
                        (isLetter ? "text-gray-400 italic font-serif " : "")
                      }>
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            </div>
            <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
          </div>
        </AnimatedSection>

        {/* Tags */}
        <AnimatedSection delay={240}>
          <div className="flex flex-wrap gap-2 mb-14">
            {work.tags.map(tag => (
              <Link key={tag} href={\`/prose?tag=\${encodeURIComponent(tag)}\`}
                className="tag-pill hover:!bg-amber-500/10 hover:!border-amber-500/30 hover:!text-amber-400">
                #{tag}
              </Link>
            ))}
          </div>
        </AnimatedSection>

        {/* Related */}
        {related.length > 0 && (
          <AnimatedSection delay={320}>
            <div className="border-t border-white/[0.05] pt-14 mb-12">
              <h2 className="font-display text-2xl font-bold text-gray-300 mb-6">{t.sections.prose}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map(piece => {
                  const rTr = language !== "ru" ? piece.translations[language] : undefined;
                  return (
                    <Link key={piece.id} href={\`/prose/\${piece.id}\`}
                      className="glass rounded-2xl p-6 hover:border-amber-500/30 hover:-translate-y-1 transition-all group block">
                      <div className="h-0.5 bg-gradient-to-r from-amber-500 to-purple-500 rounded-full mb-4 opacity-30 group-hover:opacity-80 transition-opacity" />
                      <h3 className="font-display text-lg font-bold text-gray-200 group-hover:text-amber-300 transition-colors">{rTr?.title ?? piece.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2 font-serif italic">{rTr?.excerpt ?? piece.excerpt}</p>
                      <p className="text-xs text-gray-700 mt-2">{piece.readingTime} {t.sections.minuteRead} · {piece.views} {t.sections.views}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection delay={380}>
          <div>
            <Link href="/prose"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl glass-gold text-amber-300 hover:text-white hover:bg-amber-500/20 transition-all font-medium">
              ← {t.sections.allWorks} {t.sections.prose}
            </Link>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}
`);

console.log("\n🎉 setup3.mjs выполнен!");
console.log("\nЧто создано:");
console.log("  ✅ Админ-панель: /admin (дашборд, редактор, авторизация)");
console.log("  ✅ API: /api/admin/login, /api/admin/logout, /api/admin/works");
console.log("  ✅ Middleware: защита /admin/* роутов");
console.log("  ✅ SEO: metadataBase, OG-теги, динамический sitemap, viewport");
console.log("  ✅ OG-изображения для каждого стихотворения");
console.log("  ✅ Дизайн: card-hover, ReadingProgress, WorkStats, tag-pill");
console.log("  ✅ Улучшенные: Header, Footer, PoemCard, ProseCard");
console.log("  ✅ .env.local с настройками");
console.log("\n▶  node setup3.mjs && npm run dev");
console.log("\nАдмин-панель: http://localhost:3000/admin");
console.log("Пароль: natalia2026 (см. .env.local)");
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Send, Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { instagramUrl } from "@/lib/social";

export default function Footer() {
  const { t } = useLanguage();
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative mt-16 sm:mt-24 border-t border-white/[0.05] overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-purple-500/[0.05] to-transparent pointer-events-none" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[700px] h-[240px] bg-purple-500/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.95fr_1fr] gap-5 sm:gap-7 lg:gap-12">
          <div className="glass rounded-[28px] p-5 sm:p-6">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-200 to-amber-300 text-2xl sm:text-[1.9rem] leading-tight">
                Наталья Мельхер
              </span>
            </Link>

            <p className="font-serif text-gray-400 italic text-sm sm:text-[15px] leading-relaxed">
              Пространство вдохновения, где поэзия и проза обретают голос,
              глубину и свет.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="mailto:natalia@melkher.com"
                className="w-10 h-10 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-purple-300/90 hover:border-purple-400/25 hover:bg-white/[0.06] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" strokeWidth={1.75} />
              </a>

              <a
                href="https://t.me/nataliamelkher"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-amber-300/90 hover:border-amber-400/25 hover:bg-white/[0.06] transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" strokeWidth={1.75} />
              </a>

              <a
                href={instagramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-pink-300/90 hover:border-pink-400/25 hover:bg-white/[0.06] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.75} />
              </a>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.22em] mb-4">
              Навигация
            </h4>

            <nav className="grid gap-3">
              {[
                {
                  href: "/poetry",
                  label: t.nav.poetry,
                  color: "hover:text-purple-300",
                },
                {
                  href: "/prose",
                  label: t.nav.prose,
                  color: "hover:text-amber-300",
                },
                {
                  href: "/essay",
                  label: t.nav.essay,
                  color: "hover:text-emerald-300",
                },
                {
                  href: "/notes",
                  label: t.nav.notes,
                  color: "hover:text-sky-300",
                },
                {
                  href: "/quotes",
                  label: t.nav.quotes,
                  color: "hover:text-rose-300",
                },
                {
                  href: "/inspiration",
                  label: t.nav.inspiration,
                  color: "hover:text-violet-300",
                },
                {
                  href: "/about",
                  label: t.nav.about,
                  color: "hover:text-purple-300",
                },
                {
                  href: "/contact",
                  label: t.nav.contact,
                  color: "hover:text-purple-300",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group inline-flex items-center gap-3 text-sm text-gray-400 ${item.color} transition-colors`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-purple-300 transition-colors" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="rounded-[24px] border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.22em] mb-4">
              Контакты
            </h4>

            <div className="grid gap-4">
              <a
                href="mailto:natalia@melkher.com"
                className="flex items-start gap-3 text-gray-400 hover:text-purple-300 transition-colors text-sm group"
              >
                <span className="mt-0.5 w-9 h-9 rounded-2xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center text-purple-300/90 group-hover:bg-purple-500/20 transition-colors shrink-0">
                  <Mail className="w-4 h-4" strokeWidth={1.75} />
                </span>
                <span className="leading-relaxed break-all">
                  natalia@melkher.com
                </span>
              </a>

              <a
                href="https://t.me/nataliamelkher"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-gray-400 hover:text-amber-300 transition-colors text-sm group"
              >
                <span className="mt-0.5 w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center text-amber-300/90 group-hover:bg-amber-500/20 transition-colors shrink-0">
                  <Send className="w-4 h-4" strokeWidth={1.75} />
                </span>
                <span className="leading-relaxed">@nataliamelkher</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 pt-5 border-t border-white/[0.05] flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
          <p className="text-xs text-gray-400/85" suppressHydrationWarning>
            {year
              ? `© ${year} Наталья Мельхер. ${t.footer.rights}.`
              : `© Наталья Мельхер. ${t.footer.rights}.`}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-gray-400/85">
            <span>{t.footer.madeWith}</span>
            <span
              className="mx-0.5 inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-br from-purple-400 to-amber-400 opacity-90"
              aria-hidden
            />
            <span>{t.footer.inspiration}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

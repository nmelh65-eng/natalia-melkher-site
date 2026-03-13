"use client";

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
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 " +
        (scrolled
          ? "bg-[#07070d]/78 backdrop-blur-2xl border-b border-white/[0.05] shadow-[0_10px_40px_rgba(0,0,0,0.22)] py-3"
          : "bg-transparent py-4 sm:py-5")
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3 min-w-0">
            <div className="relative shrink-0 w-10 h-10 sm:w-11 sm:h-11">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-amber-400 opacity-75 blur-[1px] group-hover:opacity-95 transition-all duration-300" />
              <div className="relative w-full h-full rounded-2xl bg-[#110b1c] border border-white/10 flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
                <span className="text-sm sm:text-base font-bold tracking-wide text-white">
                  НМ
                </span>
              </div>
            </div>

            <div className="min-w-0 flex flex-col">
              <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-200 to-amber-300 text-[1rem] sm:text-[1.05rem] leading-tight tracking-tight truncate">
                Наталья Мельхер
              </span>
              <span className="text-[10px] sm:text-[11px] text-gray-500 tracking-[0.22em] uppercase truncate">
                Poetry • Prose • Inspiration
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "relative px-4 lg:px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 " +
                    (active
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-100")
                  }
                >
                  <span className="relative z-10">{item.label}</span>

                  {active && (
                    <span className="absolute inset-0 rounded-2xl bg-white/[0.05] border border-purple-400/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />
                  )}

                  {active && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-amber-300" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageSwitcher />

            <button
              className="md:hidden p-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Меню"
              aria-expanded={mobileOpen}
            >
              <div className="flex flex-col gap-1.5 w-5">
                <span
                  className={
                    "h-0.5 bg-gray-300 rounded-full transition-all duration-300 " +
                    (mobileOpen ? "rotate-45 translate-y-2" : "")
                  }
                />
                <span
                  className={
                    "h-0.5 bg-gray-300 rounded-full transition-all duration-300 " +
                    (mobileOpen ? "opacity-0 scale-x-0" : "")
                  }
                />
                <span
                  className={
                    "h-0.5 bg-gray-300 rounded-full transition-all duration-300 " +
                    (mobileOpen ? "-rotate-45 -translate-y-2" : "")
                  }
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-[#05050a]/96 backdrop-blur-2xl"
            onClick={() => setMobileOpen(false)}
          />

          <div className="relative h-full flex flex-col justify-between px-6 pt-28 pb-10">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      "rounded-3xl px-5 py-4 font-display text-3xl font-semibold transition-all duration-300 " +
                      (active
                        ? "bg-white/[0.05] border border-purple-400/20 text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.03]")
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-8 border-t border-white/[0.06] flex items-center justify-between gap-4">
              <div className="text-xs uppercase tracking-[0.22em] text-gray-500">
                Natalia Melkher
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

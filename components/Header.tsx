"use client";

import React, { useEffect, useState } from "react";
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
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const previousOverflow = document.body.style.overflow;

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow || "";
    }

    return () => {
      document.body.style.overflow = previousOverflow || "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 " +
        (scrolled
          ? "bg-[#07070d]/82 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_14px_40px_rgba(0,0,0,0.22)] py-2 sm:py-3"
          : "bg-transparent py-3 sm:py-5")
      }
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-[8%] top-[-80px] h-[180px] w-[180px] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute right-[10%] top-[-90px] h-[180px] w-[180px] rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2.5 sm:gap-3">
          <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="relative shrink-0 w-9 h-9 sm:w-12 sm:h-12">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-amber-400 opacity-80 blur-[1px] group-hover:opacity-100 transition-all duration-300" />
              <div className="relative w-full h-full rounded-2xl bg-[#110b1c] border border-white/10 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <span className="text-xs sm:text-base font-bold tracking-[0.08em] text-white">
                  НМ
                </span>
              </div>
            </div>

            <div className="min-w-0 flex flex-col">
              <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-200 to-amber-300 text-[0.94rem] sm:text-[1.08rem] leading-tight tracking-tight truncate">
                Наталья Мельхер
              </span>
              <span className="hidden sm:block text-[10px] sm:text-[11px] text-gray-500 tracking-[0.24em] uppercase truncate">
                Poetry • Prose • Inspiration
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

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
                    <span className="absolute inset-0 rounded-2xl bg-white/[0.05] border border-purple-400/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
                  )}

                  {active && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-amber-300" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-gray-200 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <span aria-hidden="true">✦</span>
              <span>{t.nav.contact}</span>
            </Link>

            <LanguageSwitcher />

            <button
              type="button"
              className="md:hidden p-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
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
            className="absolute inset-0 bg-[#05050a]/94 backdrop-blur-2xl"
            onClick={() => setMobileOpen(false)}
          />

          <div
            id="mobile-menu"
            className="relative ml-auto flex h-full w-full max-w-[84vw] flex-col justify-between border-l border-white/[0.06] bg-[#090910]/96 px-6 pt-24 pb-9 shadow-[-20px_0_60px_rgba(0,0,0,0.35)]"
          >
            <div>
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500 mb-2">
                  Navigation
                </p>
                <p className="font-display text-2xl text-white">
                  Наталья Мельхер
                </p>
              </div>

              <nav className="flex flex-col gap-3">
                {navItems.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={
                        "rounded-3xl px-5 py-4 font-display text-2xl font-semibold transition-all duration-300 " +
                        (active
                          ? "bg-white/[0.06] border border-purple-400/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.03]")
                      }
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-8 border-t border-white/[0.06] flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-gray-500">
                  Natalia Melkher
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Poetry • Prose
                </div>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

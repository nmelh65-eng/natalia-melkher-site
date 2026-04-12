"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronDown, Sparkles } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const primaryLinks = [
    { href: "/", label: t.nav.home },
    { href: "/poetry", label: t.nav.poetry },
    { href: "/prose", label: t.nav.prose },
  ];

  const moreLinks = [
    { href: "/texts", label: t.nav.textsHub },
    { href: "/essay", label: t.nav.essay },
    { href: "/notes", label: t.nav.notes },
    { href: "/quotes", label: t.nav.quotes },
    { href: "/inspiration", label: t.nav.inspiration },
  ];

  const aboutLink = { href: "/about", label: t.nav.about };

  const mobileNavLinks = [...primaryLinks, ...moreLinks, aboutLink];

  const moreActive = moreLinks.some((l) =>
    l.href === "/"
      ? pathname === "/"
      : pathname === l.href || pathname.startsWith(`${l.href}/`)
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
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

  function linkActive(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);
  }

  function navLinkClass(active: boolean) {
    return (
      "relative px-4 lg:px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 " +
      (active ? "text-white" : "text-gray-400 hover:text-gray-100")
    );
  }

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

            <div className="min-w-0 flex flex-col max-w-[190px] sm:max-w-none">
              <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-200 to-amber-300 text-[0.94rem] sm:text-[1.08rem] leading-tight tracking-tight truncate">
                Наталья Мельхер
              </span>
              <span className="hidden 2xl:block text-[10px] text-gray-500 tracking-[0.24em] uppercase truncate">
                Poetry • Prose • More
              </span>
            </div>
          </Link>

          <nav className="hidden 2xl:flex items-center gap-1.5 lg:gap-2">
            {primaryLinks.map((item) => {
              const active = linkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClass(active)}
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

            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((o) => !o)}
                className={
                  navLinkClass(moreActive) +
                  " inline-flex items-center gap-1.5 " +
                  (moreOpen ? "text-white" : "")
                }
                aria-expanded={moreOpen}
                aria-haspopup="true"
              >
                <span className="relative z-10">{t.nav.more}</span>
                <ChevronDown
                  className={
                    "relative z-10 w-4 h-4 transition-transform " +
                    (moreOpen ? "rotate-180" : "")
                  }
                  strokeWidth={2}
                  aria-hidden
                />
                {(moreActive || moreOpen) && (
                  <span className="absolute inset-0 rounded-2xl bg-white/[0.05] border border-purple-400/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
                )}
              </button>

              {moreOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-[45] cursor-default bg-transparent"
                    aria-label="Закрыть меню"
                    onClick={() => setMoreOpen(false)}
                  />
                  <div
                    className="absolute left-0 top-[calc(100%+10px)] z-[50] min-w-[220px] rounded-2xl border border-white/[0.1] bg-[#0a0a12]/95 backdrop-blur-xl py-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
                    role="menu"
                  >
                    {moreLinks.map((item) => {
                      const active = linkActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          className={
                            "block px-4 py-2.5 text-sm font-medium transition-colors " +
                            (active
                              ? "text-white bg-white/[0.06]"
                              : "text-gray-400 hover:text-white hover:bg-white/[0.04]")
                          }
                          onClick={() => setMoreOpen(false)}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <Link
              href={aboutLink.href}
              className={navLinkClass(linkActive(aboutLink.href))}
            >
              <span className="relative z-10">{aboutLink.label}</span>
              {linkActive(aboutLink.href) && (
                <span className="absolute inset-0 rounded-2xl bg-white/[0.05] border border-purple-400/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
              )}
              {linkActive(aboutLink.href) && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-amber-300" />
              )}
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/contact"
              className="hidden 2xl:inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-gray-200 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300/80" strokeWidth={1.75} aria-hidden />
              <span>{t.nav.contact}</span>
            </Link>

            <LanguageSwitcher />

            <button
              type="button"
              className="2xl:hidden p-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
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
        <div className="fixed inset-0 z-40 2xl:hidden">
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
                {mobileNavLinks.map((item) => {
                  const active = linkActive(item.href);

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
                <Link
                  href="/contact"
                  className="rounded-3xl px-5 py-4 font-display text-2xl font-semibold text-gray-400 hover:text-white hover:bg-white/[0.03] transition-all duration-300"
                >
                  {t.nav.contact}
                </Link>
              </nav>
            </div>

            <div className="pt-8 border-t border-white/[0.06] flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-gray-500">
                  Natalia Melkher
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Poetry • Prose • Essays
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

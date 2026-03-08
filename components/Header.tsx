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

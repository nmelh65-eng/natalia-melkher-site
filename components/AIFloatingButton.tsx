"use client";

import React from "react";

interface AIFloatingButtonProps {
  onClick: () => void;
}

export default function AIFloatingButton({
  onClick,
}: AIFloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Открыть AI-Музу"
      className="group fixed bottom-5 sm:bottom-7 right-3.5 sm:right-6 z-[90] flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-[20px] sm:rounded-full border border-white/[0.09] bg-gradient-to-br from-purple-600 via-fuchsia-500 to-amber-400 text-white shadow-[0_10px_24px_rgba(124,58,237,0.24)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(124,58,237,0.30)] active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400/20"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1px] rounded-[19px] sm:rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))] opacity-80"
      />

      <svg
        className="relative z-10 w-[18px] h-[18px] sm:w-7 sm:h-7 group-hover:scale-105 transition-transform"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1v4a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-4H7a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z" />
        <circle cx="9.5" cy="10" r="1" fill="currentColor" />
        <circle cx="14.5" cy="10" r="1" fill="currentColor" />
        <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
      </svg>

      <span className="absolute -top-0.5 -right-0.5 hidden lg:flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-35" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-300 border-2 border-gray-950" />
      </span>

      <span className="absolute right-[calc(100%+0.75rem)] hidden xl:inline-flex items-center rounded-xl border border-white/10 bg-[#101019]/95 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white shadow-lg">
        AI-Муза ✨
      </span>
    </button>
  );
}

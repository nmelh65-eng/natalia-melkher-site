"use client";

import React from "react";

interface AIFloatingButtonProps {
  onClick: () => void;
}

export default function AIFloatingButton({ onClick }: AIFloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Открыть AI-Музу"
      className="fixed bottom-5 sm:bottom-8 right-4 sm:right-6 z-[90]
      w-12 h-12 sm:w-14 sm:h-14
      rounded-full
      bg-gradient-to-br from-emerald-500 to-teal-600
      text-white
      shadow-[0_8px_22px_rgba(16,185,129,0.28)]
      hover:scale-105 hover:shadow-[0_8px_34px_rgba(16,185,129,0.38)]
      active:scale-95
      transition-all duration-300
      flex items-center justify-center
      focus:outline-none focus:ring-4 focus:ring-emerald-400/30
      group"
    >
      <svg
        className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-105 transition-transform"
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

      <span className="absolute -top-0.5 -right-0.5 hidden sm:flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50" />
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-400 border-2 border-gray-950" />
      </span>

      <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block shadow-lg border border-white/10">
        AI-Муза ✨
      </span>
    </button>
  );
}

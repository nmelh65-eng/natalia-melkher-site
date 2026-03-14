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
      className="fixed bottom-24 right-6 z-[90]
                 w-14 h-14 sm:w-16 sm:h-16
                 rounded-full
                 bg-gradient-to-br from-emerald-500 to-teal-600
                 text-white
                 shadow-[0_8px_30px_rgba(16,185,129,0.4)]
                 hover:scale-110 hover:shadow-[0_8px_40px_rgba(16,185,129,0.6)]
                 active:scale-95
                 transition-all duration-300
                 flex items-center justify-center
                 focus:outline-none focus:ring-4 focus:ring-emerald-400/50
                 group"
    >
      {/* Иконка */}
      <svg
        className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1v4a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-4H7a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z"/>
        <circle cx="9.5" cy="10" r="1" fill="currentColor"/>
        <circle cx="14.5" cy="10" r="1" fill="currentColor"/>
        <path d="M9.5 15a3.5 3.5 0 0 0 5 0"/>
      </svg>

      {/* Зелёный пульсирующий индикатор */}
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-400 border-2 border-gray-950" />
      </span>

      {/* Подсказка при наведении (десктоп) */}
      <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl
                        bg-gray-900 text-white text-xs font-medium
                        whitespace-nowrap opacity-0 group-hover:opacity-100
                        transition-opacity pointer-events-none
                        hidden sm:block
                        shadow-lg border border-white/10">
        AI-Муза ✨
      </span>
    </button>
  );
}

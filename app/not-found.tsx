import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Страница не найдена",
  description: "Запрашиваемая страница отсутствует. Вернитесь на главную или в раздел поэзии.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div
        className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/25 bg-purple-500/10 text-purple-300/90"
        aria-hidden
      >
        <Sparkles className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h1 className="font-display text-6xl sm:text-8xl font-bold gradient-text mb-4">404</h1>
      <p className="font-serif text-xl text-gray-400 italic mb-2">Страница не найдена...</p>
      <p className="text-gray-600 mb-8 max-w-md">Но поэзия — всюду.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 transition-all">На главную</Link>
        <Link href="/poetry" className="px-8 py-3 rounded-2xl glass text-gray-300 font-semibold hover:text-white hover:bg-white/10 transition-all">Читать поэзию</Link>
      </div>
    </div>
  );
}

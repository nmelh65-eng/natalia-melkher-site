import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-6 select-none" aria-hidden="true">✨</div>
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

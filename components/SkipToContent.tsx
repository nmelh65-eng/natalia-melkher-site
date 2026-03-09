export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
                 focus:z-[9999] focus:px-6 focus:py-3 focus:rounded-xl
                 focus:bg-purple-600 focus:text-white focus:text-lg
                 focus:font-semibold focus:shadow-2xl focus:outline-none
                 focus:ring-2 focus:ring-white"
    >
      Перейти к содержимому
    </a>
  );
}

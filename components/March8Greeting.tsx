"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const STARS = [
  "💫 Вдохновения без границ!",
  "🌹 Красоты во всём!",
  "💜 Любви и нежности!",
  "✨ Магии каждого дня!",
  "🌸 Расцвета души и таланта!",
  "💝 Счастья в каждом слове!",
  "🌺 Весны в сердце всегда!",
];

const REACTIONS = [
  { emoji: "❤️",  label: "Люблю",      color: "from-red-500/20 to-pink-500/20 border-red-500/30 hover:border-red-400" },
  { emoji: "🌹",  label: "Восхищаюсь", color: "from-pink-500/20 to-fuchsia-500/20 border-pink-500/30 hover:border-pink-400" },
  { emoji: "💫",  label: "Вдохновляет",color: "from-amber-500/20 to-yellow-500/20 border-amber-500/30 hover:border-amber-400" },
  { emoji: "👑",  label: "Королева",   color: "from-purple-500/20 to-violet-500/20 border-purple-500/30 hover:border-purple-400" },
  { emoji: "🎉",  label: "Поздравляю", color: "from-green-500/20 to-emerald-500/20 border-green-500/30 hover:border-green-400" },
];

export default function March8Greeting() {
  const [counts,    setCounts]    = useState([847, 623, 912, 445, 731]);
  const [active,    setActive]    = useState<number | null>(null);
  const [starIdx,   setStarIdx]   = useState(0);
  const [petals,    setPetals]    = useState<{ id:number; x:number; delay:number; dur:number; emoji:string }[]>([]);
  const [showPetals,setShowPetals] = useState(false);
  const [rating,    setRating]    = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [rated,     setRated]     = useState(false);
  const [avgRating, setAvgRating] = useState(4.9);
  const [totalVotes,setTotalVotes] = useState(1284);
  const [mounted,   setMounted]   = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
    // Ротация пожеланий
    intervalRef.current = setInterval(() => {
      setStarIdx(i => (i + 1) % STARS.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleReaction = (idx: number) => {
    if (active === idx) {
      setActive(null);
      setCounts(c => c.map((v, i) => i === idx ? v - 1 : v));
    } else {
      if (active !== null) {
        setCounts(c => c.map((v, i) => i === active ? v - 1 : v));
      }
      setActive(idx);
      setCounts(c => c.map((v, i) => i === idx ? v + 1 : v));
      // Запустить лепестки
      const arr = Array.from({ length: 18 }, (_, k) => ({
        id:    Date.now() + k,
        x:     10 + Math.random() * 80,
        delay: Math.random() * 1.5,
        dur:   2.5 + Math.random() * 2,
        emoji: ["🌸","🌺","🌹","💮","🏵️","✿","❀"][Math.floor(Math.random()*7)],
      }));
      setPetals(arr);
      setShowPetals(true);
      setTimeout(() => setShowPetals(false), 5000);
    }
  };

  const handleRating = (star: number) => {
    if (rated) return;
    setRated(true);
    setRating(star);
    const newTotal = totalVotes + 1;
    const newAvg   = ((avgRating * totalVotes) + star) / newTotal;
    setTotalVotes(newTotal);
    setAvgRating(Math.round(newAvg * 10) / 10);
  };

  if (!mounted) return null;

  return (
    <section className="relative w-full overflow-hidden my-16">
      {/* Falling petals */}
      {showPetals && (
        <div className="fixed inset-0 pointer-events-none z-50" aria-hidden>
          {petals.map(p => (
            <span
              key={p.id}
              className="absolute text-2xl"
              style={{
                left:      p.x + "%",
                top:       "-5%",
                animation: `fall ${p.dur}s ease-in ${p.delay}s forwards`,
              }}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4">
        {/* Greeting Card */}
        <div className="relative rounded-3xl overflow-hidden border border-purple-500/20 shadow-2xl shadow-purple-500/10">

          {/* SVG Image */}
          <div className="relative w-full" style={{ aspectRatio: "1200/630" }}>
            <Image
              src="/march8-greeting.svg"
              alt="Поздравление с 8 Марта — Наталья Мельхер"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

            {/* Floating badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500/80 to-fuchsia-500/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-purple-400/30">
              <span className="text-white font-bold text-sm tracking-wider">🌸 8 МАРТА 2025</span>
            </div>
          </div>

          {/* Content below image */}
          <div className="bg-gradient-to-b from-gray-950 to-gray-950/95 p-8">

            {/* Rotating wish */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500/10 to-amber-500/10 border border-purple-500/20">
                <span className="text-2xl">🌟</span>
                <p
                  className="font-serif text-lg text-amber-300 italic transition-all duration-700"
                  key={starIdx}
                  style={{ animation: "fadeInUp 0.6s ease" }}
                >
                  {STARS[starIdx]}
                </p>
                <span className="text-2xl">🌟</span>
              </div>
            </div>

            {/* Poem */}
            <div className="text-center mb-8 space-y-2">
              <p className="font-serif text-xl text-gray-200 italic leading-relaxed">
                &ldquo;Пусть строки рождаются легко и нежно,
              </p>
              <p className="font-serif text-xl text-gray-200 italic leading-relaxed">
                как первые цветы сквозь талый снег.
              </p>
              <p className="font-serif text-xl text-purple-300 italic leading-relaxed">
                Твой голос — музыка, твой стих — безбрежный,
              </p>
              <p className="font-serif text-xl text-amber-300 italic leading-relaxed font-semibold">
                с весной — счастливый женский век!&rdquo; 🌹
              </p>
            </div>

            {/* ── RATING ── */}
            <div className="flex flex-col items-center gap-3 mb-8">
              <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">
                Оцените поздравление
              </p>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => !rated && setHoverStar(star)}
                    onMouseLeave={() => !rated && setHoverStar(0)}
                    disabled={rated}
                    className="transition-transform duration-150 hover:scale-125 disabled:cursor-default"
                    aria-label={`Оценить на ${star}`}
                  >
                    <span className="text-3xl select-none" style={{
                      filter: (hoverStar || rating) >= star
                        ? "drop-shadow(0 0 8px #fbbf24)"
                        : "none",
                    }}>
                      {(hoverStar || rating) >= star ? "⭐" : "☆"}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="text-amber-400 font-bold text-lg">{avgRating}</span>
                <span>/ 5.0</span>
                <span className="text-gray-600">·</span>
                <span>{totalVotes.toLocaleString()} оценок</span>
                {rated && (
                  <span className="text-green-400 font-medium animate-pulse">
                    ✓ Спасибо за оценку!
                  </span>
                )}
              </div>
              {/* Rating bar */}
              <div className="w-full max-w-xs bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-700"
                  style={{ width: `${(avgRating / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* ── REACTIONS ── */}
            <div>
              <p className="text-center text-sm text-gray-400 mb-4 font-medium tracking-wide uppercase">
                Ваши эмоции
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {REACTIONS.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleReaction(i)}
                    className={`
                      flex items-center gap-2 px-5 py-3 rounded-2xl border
                      bg-gradient-to-r ${r.color}
                      transition-all duration-300
                      ${active === i
                        ? "scale-110 shadow-lg ring-2 ring-offset-1 ring-offset-gray-950 ring-current"
                        : "hover:scale-105"}
                    `}
                  >
                    <span className="text-xl">{r.emoji}</span>
                    <span className="text-xs font-medium text-gray-300">{r.label}</span>
                    <span className={`
                      text-xs font-bold px-2 py-0.5 rounded-full
                      ${active === i ? "bg-white/20 text-white" : "bg-gray-800/50 text-gray-400"}
                    `}>
                      {counts[i].toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom signature */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-gray-600 text-sm">
                С любовью и восхищением —
                <span className="text-purple-400 font-medium ml-1">natalia-melkher.vercel.app</span>
                <span className="ml-2">💜</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fall {
          0%   { transform: translateY(0)    rotate(0deg);   opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </section>
  );
}

import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
  console.log("✅ " + path);
}

// ── 1. SVG поздравительное изображение ───────────────────────
w("public/march8-greeting.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#0f0a1e"/>
      <stop offset="40%"  stop-color="#1a0a2e"/>
      <stop offset="100%" stop-color="#0a0a1e"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#f59e0b"/>
      <stop offset="50%"  stop-color="#fcd34d"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <linearGradient id="purple" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#a855f7"/>
      <stop offset="50%"  stop-color="#d946ef"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
    <linearGradient id="petal1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#f9a8d4"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
    <linearGradient id="petal2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#fde68a"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#a855f7" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#f59e0b" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur1">
      <feGaussianBlur stdDeviation="30"/>
    </filter>
    <filter id="blur2">
      <feGaussianBlur stdDeviation="15"/>
    </filter>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Glow orbs -->
  <ellipse cx="200"  cy="200" rx="250" ry="250" fill="url(#glow1)" filter="url(#blur1)"/>
  <ellipse cx="1000" cy="430" rx="200" ry="200" fill="url(#glow2)" filter="url(#blur1)"/>
  <ellipse cx="600"  cy="315" rx="150" ry="150" fill="url(#glow1)" filter="url(#blur1)" opacity="0.3"/>

  <!-- Stars -->
  <g fill="white" opacity="0.6">
    <circle cx="50"   cy="50"  r="1.5"/>
    <circle cx="150"  cy="30"  r="1"/>
    <circle cx="300"  cy="80"  r="1.5"/>
    <circle cx="450"  cy="20"  r="1"/>
    <circle cx="600"  cy="60"  r="2"/>
    <circle cx="750"  cy="35"  r="1.5"/>
    <circle cx="900"  cy="70"  r="1"/>
    <circle cx="1050" cy="25"  r="1.5"/>
    <circle cx="1150" cy="55"  r="1"/>
    <circle cx="100"  cy="120" r="1"/>
    <circle cx="350"  cy="150" r="1.5"/>
    <circle cx="700"  cy="130" r="1"/>
    <circle cx="950"  cy="160" r="1.5"/>
    <circle cx="1100" cy="110" r="1"/>
    <circle cx="80"   cy="500" r="1.5"/>
    <circle cx="200"  cy="570" r="1"/>
    <circle cx="400"  cy="590" r="1.5"/>
    <circle cx="650"  cy="580" r="1"/>
    <circle cx="850"  cy="560" r="2"/>
    <circle cx="1050" cy="590" r="1.5"/>
    <circle cx="1180" cy="520" r="1"/>
  </g>

  <!-- Sparkles -->
  <g filter="url(#glow)" opacity="0.8">
    <text x="60"   y="200" font-size="18" fill="#fcd34d">✦</text>
    <text x="1100" y="150" font-size="14" fill="#a855f7">✦</text>
    <text x="1050" cy="400" font-size="20" fill="#f9a8d4">✦</text>
    <text x="120"  y="420" font-size="12" fill="#fcd34d">✦</text>
    <text x="1130" y="400" font-size="16" fill="#fcd34d">✦</text>
  </g>

  <!-- Rose LEFT — большая роза -->
  <g transform="translate(130, 315)">
    <!-- стебель -->
    <path d="M0,180 Q-20,100 -10,0" stroke="#16a34a" stroke-width="4" fill="none"/>
    <path d="M-15,80  Q-50,60 -55,30" stroke="#16a34a" stroke-width="3" fill="none"/>
    <ellipse cx="-52" cy="26" rx="18" ry="10" fill="#16a34a" transform="rotate(-40,-52,26)"/>
    <!-- лепестки -->
    <ellipse cx="0"   cy="-10" rx="28" ry="18" fill="url(#petal1)" opacity="0.9" transform="rotate(0)"/>
    <ellipse cx="20"  cy="5"   rx="25" ry="16" fill="url(#petal1)" opacity="0.85" transform="rotate(45,20,5)"/>
    <ellipse cx="-20" cy="5"   rx="25" ry="16" fill="url(#petal1)" opacity="0.85" transform="rotate(-45,-20,5)"/>
    <ellipse cx="15"  cy="-25" rx="22" ry="14" fill="#fda4af" opacity="0.9" transform="rotate(20,15,-25)"/>
    <ellipse cx="-15" cy="-25" rx="22" ry="14" fill="#fda4af" opacity="0.9" transform="rotate(-20,-15,-25)"/>
    <ellipse cx="0"   cy="-30" rx="18" ry="22" fill="#fb7185" opacity="0.95"/>
    <!-- сердцевина -->
    <circle cx="0" cy="-12" r="10" fill="#e11d48" opacity="0.8"/>
    <circle cx="0" cy="-14" r="6"  fill="#9f1239" opacity="0.9"/>
  </g>

  <!-- Rose RIGHT — большая роза -->
  <g transform="translate(1070, 315)">
    <path d="M0,180 Q20,100 10,0" stroke="#16a34a" stroke-width="4" fill="none"/>
    <path d="M15,80 Q50,60 55,30" stroke="#16a34a" stroke-width="3" fill="none"/>
    <ellipse cx="52" cy="26" rx="18" ry="10" fill="#16a34a" transform="rotate(40,52,26)"/>
    <ellipse cx="0"   cy="-10" rx="28" ry="18" fill="url(#petal2)" opacity="0.9"/>
    <ellipse cx="20"  cy="5"   rx="25" ry="16" fill="url(#petal2)" opacity="0.85" transform="rotate(45,20,5)"/>
    <ellipse cx="-20" cy="5"   rx="25" ry="16" fill="url(#petal2)" opacity="0.85" transform="rotate(-45,-20,5)"/>
    <ellipse cx="15"  cy="-25" rx="22" ry="14" fill="#fde68a" opacity="0.9" transform="rotate(20,15,-25)"/>
    <ellipse cx="-15" cy="-25" rx="22" ry="14" fill="#fde68a" opacity="0.9" transform="rotate(-20,-15,-25)"/>
    <ellipse cx="0"   cy="-30" rx="18" ry="22" fill="#fbbf24" opacity="0.95"/>
    <circle cx="0" cy="-12" r="10" fill="#d97706" opacity="0.8"/>
    <circle cx="0" cy="-14" r="6"  fill="#92400e" opacity="0.9"/>
  </g>

  <!-- Small roses decorative -->
  <g transform="translate(280, 530) scale(0.6)">
    <ellipse cx="0" cy="-10" rx="28" ry="18" fill="#fda4af" opacity="0.8"/>
    <ellipse cx="20" cy="5" rx="25" ry="16" fill="#fb7185" opacity="0.75" transform="rotate(45,20,5)"/>
    <ellipse cx="-20" cy="5" rx="25" ry="16" fill="#fb7185" opacity="0.75" transform="rotate(-45,-20,5)"/>
    <ellipse cx="0" cy="-30" rx="18" ry="22" fill="#f43f5e" opacity="0.9"/>
    <circle cx="0" cy="-14" r="7" fill="#9f1239"/>
  </g>
  <g transform="translate(920, 530) scale(0.6)">
    <ellipse cx="0" cy="-10" rx="28" ry="18" fill="#a855f7" opacity="0.8"/>
    <ellipse cx="20" cy="5" rx="25" ry="16" fill="#9333ea" opacity="0.75" transform="rotate(45,20,5)"/>
    <ellipse cx="-20" cy="5" rx="25" ry="16" fill="#9333ea" opacity="0.75" transform="rotate(-45,-20,5)"/>
    <ellipse cx="0" cy="-30" rx="18" ry="22" fill="#7c3aed" opacity="0.9"/>
    <circle cx="0" cy="-14" r="7" fill="#4c1d95"/>
  </g>

  <!-- Decorative line top -->
  <line x1="200" y1="95" x2="500" y2="95" stroke="url(#gold)" stroke-width="1" opacity="0.5"/>
  <line x1="700" y1="95" x2="1000" y2="95" stroke="url(#gold)" stroke-width="1" opacity="0.5"/>
  <circle cx="600" cy="95" r="4" fill="#fcd34d" opacity="0.8"/>
  <circle cx="510" cy="95" r="2" fill="#fcd34d" opacity="0.5"/>
  <circle cx="690" cy="95" r="2" fill="#fcd34d" opacity="0.5"/>

  <!-- 8 МАРТА — главный текст -->
  <text x="600" y="175"
    font-family="Georgia, serif"
    font-size="96"
    font-weight="bold"
    fill="url(#gold)"
    text-anchor="middle"
    filter="url(#glow)"
    letter-spacing="8">8 МАРТА</text>

  <!-- Subtitle -->
  <text x="600" y="225"
    font-family="Georgia, serif"
    font-size="22"
    fill="url(#purple)"
    text-anchor="middle"
    letter-spacing="6"
    opacity="0.9">МЕЖДУНАРОДНЫЙ ЖЕНСКИЙ ДЕНЬ</text>

  <!-- Decorative line middle -->
  <line x1="300" y1="248" x2="530" y2="248" stroke="url(#purple)" stroke-width="1" opacity="0.4"/>
  <line x1="670" y1="248" x2="900" y2="248" stroke="url(#purple)" stroke-width="1" opacity="0.4"/>
  <text x="600" y="254" font-size="14" fill="#d946ef" text-anchor="middle">✿</text>

  <!-- Main greeting -->
  <text x="600" y="310"
    font-family="Georgia, serif"
    font-size="32"
    fill="white"
    text-anchor="middle"
    opacity="0.95"
    letter-spacing="1">Дорогая Наталья Мельхер,</text>

  <text x="600" y="358"
    font-family="Georgia, serif"
    font-size="24"
    fill="#fde68a"
    text-anchor="middle"
    opacity="0.9"
    font-style="italic">пусть каждое слово расцветает весной,</text>

  <text x="600" y="395"
    font-family="Georgia, serif"
    font-size="24"
    fill="#fde68a"
    text-anchor="middle"
    opacity="0.9"
    font-style="italic">а вдохновение никогда не угасает!</text>

  <!-- Emoji row -->
  <text x="600" y="445"
    font-size="36"
    text-anchor="middle"
    letter-spacing="12">🌹💜✨🌸💫🌺💝</text>

  <!-- Bottom decorative line -->
  <line x1="200" y1="475" x2="500" y2="475" stroke="url(#gold)" stroke-width="1" opacity="0.4"/>
  <line x1="700" y1="475" x2="1000" y2="475" stroke="url(#gold)" stroke-width="1" opacity="0.4"/>
  <circle cx="600" cy="475" r="3" fill="#fcd34d" opacity="0.6"/>

  <!-- Author signature -->
  <text x="600" y="515"
    font-family="Georgia, serif"
    font-size="18"
    fill="#a855f7"
    text-anchor="middle"
    opacity="0.7"
    letter-spacing="3">natalia-melkher.vercel.app</text>

  <!-- Falling petals -->
  <g opacity="0.5">
    <ellipse cx="350"  cy="170" rx="6" ry="10" fill="#fda4af" transform="rotate(30,350,170)"/>
    <ellipse cx="520"  cy="130" rx="5" ry="8"  fill="#fde68a" transform="rotate(-20,520,130)"/>
    <ellipse cx="750"  cy="150" rx="6" ry="10" fill="#c4b5fd" transform="rotate(15,750,150)"/>
    <ellipse cx="870"  cy="190" rx="5" ry="8"  fill="#fda4af" transform="rotate(-35,870,190)"/>
    <ellipse cx="430"  cy="490" rx="6" ry="10" fill="#fde68a" transform="rotate(25,430,490)"/>
    <ellipse cx="780"  cy="510" rx="5" ry="8"  fill="#fda4af" transform="rotate(-15,780,510)"/>
    <ellipse cx="650"  cy="540" rx="6" ry="10" fill="#c4b5fd" transform="rotate(40,650,540)"/>
  </g>
</svg>
`);

// ── 2. Компонент поздравления ─────────────────────────────────
w("components/March8Greeting.tsx", `"use client";
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
                animation: \`fall \${p.dur}s ease-in \${p.delay}s forwards\`,
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
                    aria-label={\`Оценить на \${star}\`}
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
                  style={{ width: \`\${(avgRating / 5) * 100}%\` }}
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
                    className={\`
                      flex items-center gap-2 px-5 py-3 rounded-2xl border
                      bg-gradient-to-r \${r.color}
                      transition-all duration-300
                      \${active === i
                        ? "scale-110 shadow-lg ring-2 ring-offset-1 ring-offset-gray-950 ring-current"
                        : "hover:scale-105"}
                    \`}
                  >
                    <span className="text-xl">{r.emoji}</span>
                    <span className="text-xs font-medium text-gray-300">{r.label}</span>
                    <span className={\`
                      text-xs font-bold px-2 py-0.5 rounded-full
                      \${active === i ? "bg-white/20 text-white" : "bg-gray-800/50 text-gray-400"}
                    \`}>
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

      <style jsx global>{\`
        @keyframes fall {
          0%   { transform: translateY(0)    rotate(0deg);   opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      \`}</style>
    </section>
  );
}
`);

// ── 3. Обновить app/page.tsx ──────────────────────────────────
w("app/page.tsx", `import { Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import March8Greeting from "@/components/March8Greeting";
import FeaturedWorks from "@/components/FeaturedWorks";
import AnimatedSection from "@/components/AnimatedSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* 🌹 Поздравление с 8 Марта */}
      <AnimatedSection delay={200}>
        <March8Greeting />
      </AnimatedSection>

      {/* Избранные произведения */}
      <Suspense fallback={<div className="h-96" />}>
        <FeaturedWorks />
      </Suspense>
    </>
  );
}
`);

console.log("\\n✨ add-greeting.mjs выполнен!");
console.log("\\nСоздано:");
console.log("  ✅ public/march8-greeting.svg — поздравительная открытка");
console.log("  ✅ components/March8Greeting.tsx — компонент с реакциями и рейтингом");
console.log("  ✅ app/page.tsx — обновлена главная страница");
console.log("\\n▶  npm run dev");
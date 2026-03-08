"use client";
import React, { useMemo, useEffect, useState } from "react";

export default function ParticleBackground() {
  // Рендерим только на клиенте, чтобы избежать hydration mismatch
  // от Math.random() при SSR
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left:     Math.random() * 100,
    top:      Math.random() * 100,
    duration: 20 + Math.random() * 30,
    delay:    Math.random() * 20,
    size:     1 + Math.random() * 4,
    opacity:  0.05 + Math.random() * 0.2,
    color:    i % 3 === 0 ? "168,85,247" : i % 3 === 1 ? "245,158,11" : "217,70,239",
  })), []);

  const orbs = useMemo(() => [
    { left: "15%", top: "20%", size: 300, color: "168,85,247", opacity: 0.03,  dur: 25 },
    { left: "75%", top: "60%", size: 250, color: "245,158,11", opacity: 0.025, dur: 30 },
    { left: "50%", top: "80%", size: 350, color: "217,70,239", opacity: 0.02,  dur: 35 },
  ], []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
      suppressHydrationWarning
    >
      {orbs.map((orb, i) => (
        <div
          key={"orb-" + i}
          className="absolute rounded-full animate-pulse-glow"
          style={{
            left:   orb.left,
            top:    orb.top,
            width:  orb.size,
            height: orb.size,
            background: `radial-gradient(circle, rgba(${orb.color},${orb.opacity}) 0%, transparent 70%)`,
            animationDuration: orb.dur + "s",
            filter: "blur(60px)",
          }}
        />
      ))}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left:            p.left + "%",
            top:             p.top + "%",
            width:           p.size,
            height:          p.size,
            backgroundColor: `rgba(${p.color},${p.opacity})`,
            animation:       `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

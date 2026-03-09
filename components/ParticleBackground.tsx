"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  opacitySpeed: number;
  color: string;
}

const COLORS = [
  "168, 85, 247",   // purple-500
  "245, 158, 11",   // amber-500
  "217, 70, 239",   // fuchsia-500
];

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(true);

  const FPS_LIMIT = 30;
  const FRAME_INTERVAL = 1000 / FPS_LIMIT;

  const getParticleCount = useCallback(() => {
    if (typeof window === "undefined") return 20;
    const width = window.innerWidth;
    if (width < 640) return 12;
    if (width < 1024) return 20;
    return 35;
  }, []);

  const createParticle = useCallback(
    (width: number, height: number): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.05,
      opacitySpeed: (Math.random() - 0.5) * 0.004,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }),
    []
  );

  useEffect(() => {
    // Проверяем prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setIsVisible(false);
      return;
    }

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsVisible(!e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      const count = getParticleCount();
      particlesRef.current = Array.from({ length: count }, () =>
        createParticle(window.innerWidth, window.innerHeight)
      );
    };

    resize();

    const animate = (currentTime: number) => {
      animationRef.current = requestAnimationFrame(animate);

      const elapsed = currentTime - lastTimeRef.current;
      if (elapsed < FRAME_INTERVAL) return;
      lastTimeRef.current = currentTime - (elapsed % FRAME_INTERVAL);

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      // Рисуем мягкие orbs (фоновое свечение)
      const orbs = [
        { x: w * 0.15, y: h * 0.2, r: 150, color: "168,85,247", a: 0.03 },
        { x: w * 0.75, y: h * 0.6, r: 125, color: "245,158,11", a: 0.025 },
        { x: w * 0.5, y: h * 0.8, r: 175, color: "217,70,239", a: 0.02 },
      ];

      orbs.forEach((orb) => {
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.r
        );
        gradient.addColorStop(0, `rgba(${orb.color}, ${orb.a})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(orb.x - orb.r, orb.y - orb.r, orb.r * 2, orb.r * 2);
      });

      // Рисуем частицы
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        p.opacity += p.opacitySpeed;
        if (p.opacity <= 0.03 || p.opacity >= 0.5) {
          p.opacitySpeed *= -1;
        }

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();
      });
    };

    animationRef.current = requestAnimationFrame(animate);

    // Пауза при скрытии вкладки
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationRef.current);
      } else {
        lastTimeRef.current = performance.now();
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, [getParticleCount, createParticle]);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none will-change-transform"
    />
  );
}

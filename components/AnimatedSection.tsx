"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "fade";
}

export default function AnimatedSection({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    // Уважаем настройки пользователя
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setPrefersReduced(true);
      setIsVisible(true);
      return;
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
      if (e.matches) setIsVisible(true);
    };
    motionQuery.addEventListener("change", handleChange);

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", handleChange);
    };
  }, [delay]);

  const getInitialTransform = (): string => {
    switch (direction) {
      case "up":    return "translate3d(0, 40px, 0)";
      case "down":  return "translate3d(0, -40px, 0)";
      case "left":  return "translate3d(40px, 0, 0)";
      case "right": return "translate3d(-40px, 0, 0)";
      case "fade":  return "translate3d(0, 0, 0)";
      default:      return "translate3d(0, 40px, 0)";
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate3d(0, 0, 0)" : getInitialTransform(),
        transition: prefersReduced
          ? "none"
          : "opacity 0.6s ease-out, transform 0.6s ease-out",
        willChange: isVisible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

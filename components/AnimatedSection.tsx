"use client";

import React, { useRef, useEffect, useState } from "react";

interface Props {
  children:   React.ReactNode;
  className?: string;
  delay?:     number;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      suppressHydrationWarning
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                     transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

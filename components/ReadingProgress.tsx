"use client";
import React, { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const el     = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total    = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="reading-progress"
      style={{ width: progress + "%" }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}

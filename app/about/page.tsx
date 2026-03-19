"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedSection from "@/components/AnimatedSection";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-16 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-purple-500/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <AnimatedSection>
            <div className="overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.03] backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
              <div className="relative h-[320px] sm:h-[420px] md:h-[480px]">
                <Image
                  src="/about-hero.jpg"
                  alt="Художественный образ вдохновения и письма"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0712] via-[#0a0712]/45 to-black/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_55%)]" />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-10">
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-purple-200/70 mb-3">
                    About the Author
                  </p>
                  <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold gradient-text mb-4">
                    {t.about.title}
                  </h1>
                  <p className="max-w-2xl font-serif text-gray-200/90 text-base sm:text-lg md:text-xl leading-7 sm:leading-8">
                    {t.about.subtitle}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 md:p-12">
                <div className="grid gap-8 md:gap-10">
                  <div className="text-gray-300 leading-relaxed text-base sm:text-lg">
                    <p>{t.about.bio}</p>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-4">
                      {t.about.philosophy}
                    </h2>
                    <blockquote className="border-l-2 border-purple-500/50 pl-6">
                      <p className="text-gray-300 text-lg italic leading-8">
                        {t.about.philosophyText}
                      </p>
                    </blockquote>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { v: "50+", l: "Poems" },
                      { v: "20+", l: "Stories" },
                      { v: "6", l: "Languages" },
                      { v: "∞", l: "Inspiration" },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
                      >
                        <div className="text-3xl font-bold gradient-text">
                          {s.v}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

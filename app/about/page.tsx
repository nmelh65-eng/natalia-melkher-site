"use client";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedSection from "@/components/AnimatedSection";
export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-16 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <AnimatedSection><h1 className="text-center text-5xl sm:text-6xl md:text-7xl font-bold gradient-text mb-16">{t.about.title}</h1></AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-3xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-500 via-amber-500 to-purple-500" />
              <div className="p-8 sm:p-12">
                <div className="flex flex-col items-center mb-10">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-amber-500 to-purple-500 opacity-50 animate-spin" style={{animationDuration:"10s"}} />
                    <div className="absolute inset-1 rounded-full bg-gray-950" />
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-900 to-gray-900 flex items-center justify-center">
                      <span className="text-4xl sm:text-5xl font-bold gradient-text">НМ</span>
                    </div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-100">{t.about.subtitle}</h2>
                  <p className="text-lg text-purple-400/80 mt-1 italic">Poet & Writer</p>
                </div>
                <div className="text-gray-300 leading-relaxed text-lg"><p>{t.about.bio}</p></div>
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-100 mb-4">{t.about.philosophy}</h3>
                  <blockquote className="border-l-2 border-purple-500/50 pl-6"><p className="text-gray-300 text-lg italic">{t.about.philosophyText}</p></blockquote>
                </div>
                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[{v:"50+",l:"Poems"},{v:"20+",l:"Stories"},{v:"6",l:"Languages"},{v:"∞",l:"Inspiration"}].map((s,i) => (
                    <div key={i} className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="text-3xl font-bold gradient-text">{s.v}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

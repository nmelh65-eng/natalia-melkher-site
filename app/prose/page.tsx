"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getWorksByCategory } from "@/data/works";
import ProseCard from "@/components/ProseCard";
import AnimatedSection from "@/components/AnimatedSection";

export default function ProsePage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const allProse = getWorksByCategory("prose");
  const allTags = useMemo(() => {
    const s = new Set<string>();
    allProse.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [allProse]);

  const filtered = useMemo(() => allProse.filter((p) => {
    const ms = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
    const mt = !tag || p.tags.includes(tag);
    return ms && mt;
  }), [allProse, search, tag]);

  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-12 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text-gold mb-4">{t.sections.prose}</h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">{t.hero.subtitle}</p>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="mt-8 max-w-md mx-auto">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.sections.searchPlaceholder}
                className="w-full px-6 py-3 rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button onClick={() => setTag(null)}
                className={"px-4 py-1.5 text-xs rounded-full transition-all " + (!tag ? "bg-amber-500/30 text-amber-300 border border-amber-500/50" : "bg-white/5 text-gray-500")}>{t.sections.allWorks}</button>
              {allTags.map((t2) => (
                <button key={t2} onClick={() => setTag(tag === t2 ? null : t2)}
                  className={"px-4 py-1.5 text-xs rounded-full transition-all " + (tag === t2 ? "bg-amber-500/30 text-amber-300 border border-amber-500/50" : "bg-white/5 text-gray-500")}>#{t2}</button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 pb-20">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-8">
            {filtered.map((item, i) => (
              <AnimatedSection key={item.id} delay={i * 200}>
                <ProseCard work={item} index={i} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">{t.sections.noWorksFound}</p>
            <button onClick={() => { setSearch(""); setTag(null); }} className="mt-4 text-amber-400">{t.common.retry}</button>
          </div>
        )}
      </section>
    </div>
  );
}

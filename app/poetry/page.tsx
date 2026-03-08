"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getWorksByCategory } from "@/data/works";
import PoemCard from "@/components/PoemCard";
import AnimatedSection from "@/components/AnimatedSection";

export default function PoetryPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const allPoems = getWorksByCategory("poetry");
  const allTags = useMemo(() => {
    const s = new Set<string>();
    allPoems.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [allPoems]);

  const filtered = useMemo(() => allPoems.filter((p) => {
    const ms = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
    const mt = !tag || p.tags.includes(tag);
    return ms && mt;
  }), [allPoems, search, tag]);

  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-12 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text mb-4">{t.sections.poetry}</h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">{t.hero.subtitle}</p>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="mt-8 max-w-md mx-auto">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.sections.searchPlaceholder}
                className="w-full px-6 py-3 rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button onClick={() => setTag(null)}
                className={"px-4 py-1.5 text-xs rounded-full transition-all " + (!tag ? "bg-purple-500/30 text-purple-300 border border-purple-500/50" : "bg-white/5 text-gray-500 hover:text-gray-300")}>{t.sections.allWorks}</button>
              {allTags.map((t2) => (
                <button key={t2} onClick={() => setTag(tag === t2 ? null : t2)}
                  className={"px-4 py-1.5 text-xs rounded-full transition-all " + (tag === t2 ? "bg-purple-500/30 text-purple-300 border border-purple-500/50" : "bg-white/5 text-gray-500 hover:text-gray-300")}>#{t2}</button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-4 pb-20">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filtered.map((poem, i) => (
              <AnimatedSection key={poem.id} delay={i * 150}>
                <PoemCard work={poem} index={i} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">{t.sections.noWorksFound}</p>
            <button onClick={() => { setSearch(""); setTag(null); }} className="mt-4 text-purple-400">{t.common.retry}</button>
          </div>
        )}
      </section>
    </div>
  );
}

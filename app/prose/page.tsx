"use client";
import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getWorksByCategory } from "@/data/works";
import ProseCard from "@/components/ProseCard";
import AnimatedSection from "@/components/AnimatedSection";
function ProseContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  useEffect(() => { const u = searchParams.get("tag"); if (u) setTag(u); }, [searchParams]);
  const allProse = getWorksByCategory("prose");
  const allTags = useMemo(() => { const s = new Set<string>(); allProse.forEach((p) => p.tags.forEach((tg) => s.add(tg))); return Array.from(s); }, [allProse]);
  const filtered = useMemo(() => allProse.filter((p) => {
    const ms = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
    return ms && (!tag || p.tags.includes(tag));
  }), [allProse, search, tag]);
  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-12 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection><h1 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text-gold mb-4">{t.sections.prose}</h1><p className="text-lg text-gray-400 max-w-xl mx-auto">{t.hero.subtitle}</p></AnimatedSection>
          <AnimatedSection delay={200}><div className="mt-8 max-w-md mx-auto"><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.sections.searchPlaceholder} className="w-full px-6 py-3 rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50" /></div></AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button onClick={() => setTag(null)} className={"px-4 py-1.5 text-xs rounded-full transition-all " + (!tag ? "bg-amber-500/30 text-amber-300 border border-amber-500/50" : "bg-white/5 text-gray-500 hover:text-gray-300")}>{t.sections.allWorks}</button>
              {allTags.map((tg) => <button key={tg} onClick={() => setTag(tag === tg ? null : tg)} className={"px-4 py-1.5 text-xs rounded-full transition-all " + (tag === tg ? "bg-amber-500/30 text-amber-300 border border-amber-500/50" : "bg-white/5 text-gray-500 hover:text-gray-300")}>#{tg}</button>)}
            </div>
          </AnimatedSection>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 pb-20">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-8">{filtered.map((item, i) => <AnimatedSection key={item.id} delay={i*200}><ProseCard work={item} index={i} /></AnimatedSection>)}</div>
        ) : (
          <div className="text-center py-20"><p className="text-2xl text-gray-500">{t.sections.noWorksFound}</p><button onClick={() => { setSearch(""); setTag(null); }} className="mt-4 text-amber-400 hover:text-amber-300 transition-colors">{t.common.retry}</button></div>
        )}
      </section>
    </div>
  );
}
export default function ProsePage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" /></div>}><ProseContent /></Suspense>;
}

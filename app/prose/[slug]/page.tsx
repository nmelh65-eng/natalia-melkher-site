"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslatedWork } from "@/types";
import AnimatedSection from "@/components/AnimatedSection";
import ReadingProgress from "@/components/ReadingProgress";
import WorkStats from "@/components/WorkStats";
import { BookOpen, Quote } from "lucide-react";
import { workPublicPath } from "@/lib/slug";

export default function ProsePiecePage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();

  const segment =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
        ? params.slug[0]
        : "";

  const [work, setWork] = useState<TranslatedWork | null>(null);
  const [allProse, setAllProse] = useState<TranslatedWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [workRes, proseRes] = await Promise.all([
          fetch(`/api/works?id=${encodeURIComponent(segment)}`, {
            cache: "no-store",
          }),
          fetch("/api/works?category=prose", { cache: "no-store" }),
        ]);

        if (!workRes.ok) {
          throw new Error("Не удалось загрузить произведение");
        }

        if (!proseRes.ok) {
          throw new Error("Не удалось загрузить список прозы");
        }

        const workData = await workRes.json();
        const proseData = await proseRes.json();

        if (!cancelled) {
          setWork(workData ?? null);
          setAllProse(Array.isArray(proseData) ? proseData : []);
        }
      } catch {
        if (!cancelled) {
          setError("Ошибка загрузки произведения");
          setWork(null);
          setAllProse([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (segment) {
      loadData();
    }

    return () => {
      cancelled = true;
    };
  }, [segment]);

  useEffect(() => {
    const internalId = work?.id;
    if (!internalId) return;

    let cancelled = false;
    const key = `viewed:${internalId}`;

    if (typeof window !== "undefined" && sessionStorage.getItem(key)) {
      return () => {
        cancelled = true;
      };
    }

    async function sendView() {
      try {
        const res = await fetch("/api/works", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: internalId, action: "view" }),
        });

        if (!res.ok) {
          return;
        }

        const result = await res.json();

        if (!cancelled && result?.ok && result?.data) {
          setWork((prev) =>
            prev && prev.id === internalId
              ? { ...prev, ...result.data }
              : prev
          );
        }

        if (!cancelled && typeof window !== "undefined") {
          sessionStorage.setItem(key, "1");
        }
      } catch (e) {
        console.error("View increment error:", e);
      }
    }

    sendView();

    return () => {
      cancelled = true;
    };
  }, [work?.id]);

  const related = useMemo(() => {
    if (!work) return [];
    return allProse
      .filter(
        (p) =>
          p.id !== work.id && p.tags.some((tag) => work.tags.includes(tag))
      )
      .slice(0, 2);
  }, [allProse, work]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-300">Ошибка</h1>
        <p className="text-gray-500 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 rounded-2xl bg-amber-600 text-white hover:bg-amber-500 transition-colors"
        >
          {t.common.retry}
        </button>
      </div>
    );
  }

  if (!work || work.category !== "prose") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div
          className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300/90"
          aria-hidden
        >
          <BookOpen className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold text-gray-300">
          Произведение не найдено
        </h1>
        <p className="text-gray-500 max-w-md">
          Возможно, оно было удалено или вы перешли по неверной ссылке.
        </p>
        <Link
          href="/prose"
          className="px-8 py-3 rounded-2xl bg-amber-600 text-white hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
        >
          &larr; {t.nav.prose}
        </Link>
      </div>
    );
  }

  const tr = language !== "ru" ? work.translations[language] : undefined;
  const title = tr?.title ?? work.title;
  const content = tr?.content ?? work.content;
  const paragraphs = content.split(/\n\n+/).filter(Boolean);
  return (
    <div className="min-h-screen">
      <ReadingProgress />

      <div
        aria-hidden="true"
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[320px] h-[320px] sm:w-[620px] sm:h-[460px] bg-amber-500/6 rounded-full blur-[90px] sm:blur-[140px] pointer-events-none"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-28 relative z-10">
        <AnimatedSection delay={0}>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-400 transition-colors mb-10 sm:mb-14 group text-sm focus:outline-none focus:text-amber-400"
          >
            <span
              className="group-hover:-translate-x-1 transition-transform inline-block"
              aria-hidden="true"
            >
              &larr;
            </span>
            <span>{t.nav.prose}</span>
          </button>
        </AnimatedSection>

        <AnimatedSection delay={80}>
          <header className="mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6 sm:mb-8">
              <Quote className="h-3.5 w-3.5 text-amber-400/80" strokeWidth={2} aria-hidden />
              <span className="text-amber-400 text-xs font-semibold tracking-[0.22em] uppercase">
                {t.sections.prose}
              </span>
              <Quote className="h-3.5 w-3.5 scale-x-[-1] text-amber-400/80" strokeWidth={2} aria-hidden />
            </div>

            <h1 className="font-display text-3xl sm:text-5xl md:text-[3.9rem] font-bold text-white leading-[1.02] tracking-tight mb-6 sm:mb-8">
              {title}
            </h1>

            <div className="max-w-xl">
              <WorkStats work={work} />
            </div>
          </header>
        </AnimatedSection>

        <AnimatedSection delay={160}>
          <article className="relative rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur overflow-hidden mb-10 sm:mb-12">
            <div
              aria-hidden="true"
              className="h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"
            />

            <div className="px-6 py-8 sm:px-10 sm:py-12 md:px-14 md:py-16 work-content">
              <div className="space-y-6 sm:space-y-7">
                {paragraphs.map((para, i) => {
                  const trimmed = para.trim();

                  const isQuote =
                    trimmed.startsWith("«") ||
                    trimmed.startsWith('"') ||
                    trimmed.startsWith("“");

                  const isLetter = [
                    "Дорог",
                    "Dear",
                    "Liebes",
                    "Chère",
                    "С любов",
                    "With love",
                    "P.S.",
                  ].some((p) => trimmed.startsWith(p));

                  let paragraphClass =
                    "prose-text text-[1rem] sm:text-[1.15rem] leading-[1.95] sm:leading-[2] ";

                  if (i === 0 && !isQuote && !isLetter) {
                    paragraphClass += "drop-cap text-gray-100 ";
                  } else {
                    paragraphClass += "text-gray-300 ";
                  }

                  if (isQuote) {
                    paragraphClass +=
                      "pl-5 sm:pl-6 border-l-2 border-amber-400/30 text-gray-400 italic ";
                  }

                  if (isLetter) {
                    paragraphClass += "text-gray-400 italic font-serif ";
                  }

                  return (
                    <p
                      key={i}
                      style={{ whiteSpace: "pre-line" }}
                      className={paragraphClass}
                    >
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            </div>

            <div
              aria-hidden="true"
              className="h-[2px] bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"
            />
          </article>
        </AnimatedSection>

        <AnimatedSection delay={240}>
          <nav
            aria-label="Теги произведения"
            className="flex flex-wrap gap-2.5 mb-12 sm:mb-14"
          >
            {work.tags.map((tag) => (
              <Link
                key={tag}
                href={`/prose?tag=${encodeURIComponent(tag)}`}
                className="px-4 py-2 rounded-full text-sm bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-300 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                #{tag}
              </Link>
            ))}
          </nav>
        </AnimatedSection>

        {related.length > 0 && (
          <AnimatedSection delay={320}>
            <section
              aria-labelledby="related-heading"
              className="border-t border-white/[0.05] pt-12 sm:pt-14 mb-12"
            >
              <h2
                id="related-heading"
                className="font-display text-2xl sm:text-[2rem] font-bold text-gray-200 mb-6"
              >
                Похожие произведения
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {related.map((piece) => {
                  const rTr =
                    language !== "ru" ? piece.translations[language] : undefined;

                  return (
                    <Link
                      key={piece.id}
                      href={workPublicPath(piece)}
                      className="group rounded-[24px] border border-white/[0.06] bg-white/[0.03] backdrop-blur p-5 sm:p-6 hover:border-amber-400/25 hover:-translate-y-1 transition-all block focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
                    >
                      <div
                        aria-hidden="true"
                        className="h-0.5 bg-gradient-to-r from-amber-500 to-purple-500 rounded-full mb-4 opacity-40 group-hover:opacity-90 transition-opacity"
                      />
                      <h3 className="font-display text-lg font-bold text-gray-200 group-hover:text-amber-200 transition-colors">
                        {rTr?.title ?? piece.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-3 font-serif leading-6">
                        {rTr?.excerpt ?? piece.excerpt}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          </AnimatedSection>
        )}

        <AnimatedSection delay={380}>
          <div>
            <Link
              href="/prose"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-amber-300 hover:text-white hover:bg-amber-500/15 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
            >
              <span aria-hidden="true">&larr;</span>
              {t.sections.allWorks}
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

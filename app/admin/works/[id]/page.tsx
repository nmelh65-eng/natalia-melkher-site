"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { TranslatedWork, WorkCategory, Language } from "@/types";
import { estimateReadingTime, generateId, truncate } from "@/lib/utils";

const LANGS: Language[] = ["ru","en","de","fr","zh","ko"];
const LANG_NAMES: Record<Language,string> = { ru:"Русский",en:"English",de:"Deutsch",fr:"Français",zh:"中文",ko:"한국어" };

const emptyWork = (): Omit<TranslatedWork,"id"> => ({
  title:"", content:"", excerpt:"", category:"poetry", tags:[], language:"ru",
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  isPublished: false, readingTime:1, views:0, likes:0, translations:{},
});

export default function WorkEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const [work, setWork] = useState<TranslatedWork>({ id: isNew ? generateId("work") : String(params.id), ...emptyWork() });
  const [activeLang, setActiveLang] = useState<Language>("ru");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!isNew) {
      fetch("/api/admin/works").then(r => r.json()).then(d => {
        const found = (d.data as TranslatedWork[]).find(w => w.id === params.id);
        if (found) { setWork(found); setTagInput(found.tags.join(", ")); }
      });
    }
  }, [isNew, params.id]);

  const setField = (key: keyof TranslatedWork, val: unknown) =>
    setWork(p => ({ ...p, [key]: val }));

  const setTranslation = (lang: Language, key: "title"|"content"|"excerpt", val: string) =>
    setWork(p => ({
      ...p,
      translations: { ...p.translations, [lang]: { ...(p.translations[lang] || { title:"",content:"",excerpt:"" }), [key]: val } }
    }));

  const handleSave = async () => {
    setSaving(true); setError("");
    const tags = tagInput.split(",").map(t => t.trim()).filter(Boolean);
    const payload: TranslatedWork = {
      ...work, tags,
      readingTime: estimateReadingTime(work.content),
      excerpt: work.excerpt || truncate(work.content, 120),
      updatedAt: new Date().toISOString(),
    };
    const res = await fetch("/api/admin/works", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setSaved(true); setTimeout(() => setSaved(false), 2500);
      if (isNew) router.push(`/admin/works/${payload.id}`);
    } else {
      setError("Ошибка сохранения");
    }
    setSaving(false);
  };

  const input = (label: string, val: string, onChange: (v:string)=>void, opts?: {type?:string;placeholder?:string;rows?:number}) => (
    <div style={{ marginBottom:20 }}>
      <label style={{ display:"block", fontSize:13, color:"#9ca3af", marginBottom:6 }}>{label}</label>
      {opts?.rows ? (
        <textarea value={val} onChange={e=>onChange(e.target.value)} rows={opts.rows}
          placeholder={opts?.placeholder}
          style={{ width:"100%", padding:"10px 14px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", color:"white", fontSize:14, outline:"none", resize:"vertical", boxSizing:"border-box", fontFamily:"monospace", lineHeight:1.6 }} />
      ) : (
        <input type={opts?.type||"text"} value={val} onChange={e=>onChange(e.target.value)}
          placeholder={opts?.placeholder}
          style={{ width:"100%", padding:"10px 14px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", color:"white", fontSize:14, outline:"none", boxSizing:"border-box" }} />
      )}
    </div>
  );

  const panel = { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:24, marginBottom:20 };
  const btn = (bg: string, color="white") => ({ padding:"10px 20px", borderRadius:12, border:"none", background:bg, color, cursor:"pointer" as const, fontSize:14, fontWeight:600 });

  return (
    <div style={{ minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 28px", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)", position:"sticky" as const, top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <Link href="/admin" style={{ color:"#6b7280", textDecoration:"none", fontSize:13 }}>← Назад</Link>
          <span style={{ color:"#374151" }}>|</span>
          <span style={{ fontWeight:600, fontSize:16 }}>{isNew ? "Новое произведение" : work.title || "Редактирование"}</span>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {saved && <span style={{ color:"#34d399", fontSize:13 }}>✓ Сохранено</span>}
          {error && <span style={{ color:"#f87171", fontSize:13 }}>{error}</span>}
          <button onClick={() => setField("isPublished", !work.isPublished)}
            style={btn(work.isPublished ? "rgba(107,114,128,0.3)" : "rgba(16,185,129,0.3)", work.isPublished ? "#9ca3af" : "#34d399")}>
            {work.isPublished ? "Снять с публикации" : "Опубликовать"}
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ ...btn("linear-gradient(135deg,#7c3aed,#a855f7)"), opacity: saving ? 0.7 : 1 }}>
            {saving ? "Сохранение..." : "💾 Сохранить"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"28px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:20 }}>

          {/* Left: content */}
          <div>
            {/* Lang tabs */}
            <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" as const }}>
              {LANGS.map(lang => (
                <button key={lang} onClick={() => setActiveLang(lang)}
                  style={{ padding:"6px 14px", borderRadius:10, border:"1px solid", fontSize:12, cursor:"pointer",
                    borderColor: activeLang===lang ? "#a855f7" : "rgba(255,255,255,0.1)",
                    background:  activeLang===lang ? "rgba(168,85,247,0.2)" : "transparent",
                    color:       activeLang===lang ? "#c084fc" : "#6b7280" }}>
                  {LANG_NAMES[lang]}
                </button>
              ))}
            </div>

            <div style={panel}>
              {activeLang === "ru" ? (
                <>
                  {input("Заголовок (RU)", work.title, v => setField("title", v), { placeholder:"Название произведения" })}
                  {input("Текст", work.content, v => setField("content", v), { rows:18, placeholder:"Текст произведения...\n\nРазделяйте строфы двойным переносом строки" })}
                  {input("Краткое описание", work.excerpt, v => setField("excerpt", v), { placeholder:"Первые строки (автозаполнение если пусто)" })}
                </>
              ) : (
                <>
                  {input(`Заголовок (${LANG_NAMES[activeLang]})`,
                    work.translations[activeLang]?.title || "",
                    v => setTranslation(activeLang, "title", v),
                    { placeholder:"Перевод заголовка" })}
                  {input("Текст перевода",
                    work.translations[activeLang]?.content || "",
                    v => setTranslation(activeLang, "content", v),
                    { rows:16, placeholder:"Перевод текста..." })}
                  {input("Краткое описание",
                    work.translations[activeLang]?.excerpt || "",
                    v => setTranslation(activeLang, "excerpt", v),
                    { placeholder:"Краткое описание на этом языке" })}
                </>
              )}
            </div>
          </div>

          {/* Right: settings */}
          <div>
            <div style={panel}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:16, color:"#e5e7eb" }}>Настройки</div>

              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, color:"#9ca3af", display:"block", marginBottom:6 }}>Категория</label>
                <div style={{ display:"flex", gap:8 }}>
                  {(["poetry","prose"] as WorkCategory[]).map(cat => (
                    <button key={cat} onClick={() => setField("category", cat)}
                      style={{ flex:1, padding:"8px", borderRadius:10, border:"1px solid", fontSize:13, cursor:"pointer",
                        borderColor: work.category===cat ? (cat==="poetry"?"#a855f7":"#f59e0b") : "rgba(255,255,255,0.1)",
                        background:  work.category===cat ? (cat==="poetry"?"rgba(168,85,247,0.2)":"rgba(245,158,11,0.2)") : "transparent",
                        color:       work.category===cat ? (cat==="poetry"?"#c084fc":"#fbbf24") : "#6b7280" }}>
                      {cat === "poetry" ? "Стихи" : "Проза"}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, color:"#9ca3af", display:"block", marginBottom:6 }}>Теги (через запятую)</label>
                <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                  placeholder="природа, весна, любовь"
                  style={{ width:"100%", padding:"8px 12px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", color:"white", fontSize:13, outline:"none", boxSizing:"border-box" }} />
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" as const, marginTop:8 }}>
                  {tagInput.split(",").map(t=>t.trim()).filter(Boolean).map(t => (
                    <span key={t} style={{ padding:"2px 8px", borderRadius:8, background:"rgba(168,85,247,0.15)", color:"#a78bfa", fontSize:11 }}>#{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ padding:"12px 16px", borderRadius:14, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", marginBottom:16 }}>
                <div style={{ fontSize:12, color:"#4b5563", marginBottom:8 }}>Статистика</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    { label:"Просмотры", value: work.views },
                    { label:"Лайки",    value: work.likes },
                    { label:"Время чт.", value: estimateReadingTime(work.content) + " мин" },
                    { label:"Символов", value: work.content.length },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize:11, color:"#4b5563" }}>{s.label}</div>
                      <div style={{ fontSize:16, fontWeight:700, color:"#9ca3af" }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding:"12px 16px", borderRadius:14, background: work.isPublished ? "rgba(16,185,129,0.08)" : "rgba(107,114,128,0.1)", border:"1px solid", borderColor: work.isPublished ? "rgba(16,185,129,0.2)" : "rgba(107,114,128,0.15)" }}>
                <div style={{ fontSize:13, fontWeight:600, color: work.isPublished ? "#34d399" : "#9ca3af" }}>
                  {work.isPublished ? "✓ Опубликовано" : "○ Черновик"}
                </div>
                <div style={{ fontSize:11, color:"#4b5563", marginTop:4 }}>
                  {work.isPublished ? "Видно всем посетителям" : "Не отображается на сайте"}
                </div>
              </div>

              {!isNew && (
                <div style={{ marginTop:16, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize:12, color:"#4b5563", marginBottom:8 }}>Предпросмотр</div>
                  <a href={`/${work.category}/${work.id}`} target="_blank" rel="noreferrer"
                    style={{ display:"block", padding:"8px 14px", borderRadius:10, background:"rgba(168,85,247,0.1)", color:"#a78bfa", textDecoration:"none", fontSize:13, textAlign:"center" as const }}>
                    Открыть на сайте ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

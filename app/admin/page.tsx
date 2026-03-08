"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { TranslatedWork } from "@/types";

const S = {
  header: { display:"flex" as const, alignItems:"center" as const, justifyContent:"space-between" as const, padding:"20px 32px", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)", backdropFilter:"blur(20px)", position:"sticky" as const, top:0, zIndex:10 },
  logo: { display:"flex" as const, alignItems:"center" as const, gap:12 },
  logoBox: { width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#a855f7,#f59e0b)", display:"flex" as const, alignItems:"center" as const, justifyContent:"center" as const, color:"white", fontWeight:700, fontSize:16 },
  main: { maxWidth:1100, margin:"0 auto", padding:"32px 24px" },
  grid: { display:"grid" as const, gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:32 },
  card: { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:24 },
  table: { width:"100%", borderCollapse:"collapse" as const, background:"rgba(255,255,255,0.02)", borderRadius:20, overflow:"hidden" as const },
  th: { padding:"12px 16px", textAlign:"left" as const, fontSize:12, color:"#6b7280", borderBottom:"1px solid rgba(255,255,255,0.06)", fontWeight:600, textTransform:"uppercase" as const, letterSpacing:"0.05em" },
  td: { padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:14, verticalAlign:"middle" as const },
  btn: (color: string) => ({ padding:"6px 14px", borderRadius:10, border:"none", cursor:"pointer" as const, fontSize:12, fontWeight:600, background:color, color:"white", transition:"opacity 0.2s" }),
};

export default function AdminDashboard() {
  const router = useRouter();
  const [works, setWorks] = useState<TranslatedWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all"|"poetry"|"prose"|"draft">("all");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/works");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setWorks(data.data || []);
    setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (id: string) => {
    await fetch("/api/admin/works", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить произведение?")) return;
    setDeleting(id);
    await fetch("/api/admin/works", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setDeleting(null);
    load();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const filtered = works.filter((w) => {
    if (filter === "poetry" && w.category !== "poetry") return false;
    if (filter === "prose"  && w.category !== "prose")  return false;
    if (filter === "draft"  && w.isPublished)            return false;
    if (search && !w.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total:     works.length,
    poetry:    works.filter(w => w.category === "poetry").length,
    prose:     works.filter(w => w.category === "prose").length,
    published: works.filter(w => w.isPublished).length,
    drafts:    works.filter(w => !w.isPublished).length,
    views:     works.reduce((a, w) => a + w.views, 0),
    likes:     works.reduce((a, w) => a + w.likes, 0),
  };

  return (
    <div>
      {/* Header */}
      <div style={S.header}>
        <div style={S.logo}>
          <div style={S.logoBox}>НМ</div>
          <div>
            <div style={{ fontWeight:700, fontSize:16 }}>Панель управления</div>
            <div style={{ fontSize:12, color:"#6b7280" }}>Наталья Мельхер</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <Link href="/" target="_blank" style={{ color:"#a855f7", fontSize:13, textDecoration:"none" }}>← Сайт</Link>
          <Link href="/admin/works/new" style={{ ...S.btn("linear-gradient(135deg,#7c3aed,#a855f7)"), textDecoration:"none", display:"inline-block", padding:"8px 18px" }}>+ Новое</Link>
          <button onClick={handleLogout} style={{ ...S.btn("rgba(255,255,255,0.08)"), color:"#9ca3af" }}>Выйти</button>
        </div>
      </div>

      <div style={S.main}>
        {/* Stats grid */}
        <div style={S.grid}>
          {[
            { label:"Всего", value: stats.total, color:"#a855f7" },
            { label:"Стихи", value: stats.poetry, color:"#8b5cf6" },
            { label:"Проза", value: stats.prose, color:"#f59e0b" },
            { label:"Опубликовано", value: stats.published, color:"#10b981" },
            { label:"Черновики", value: stats.drafts, color:"#6b7280" },
            { label:"Просмотры", value: stats.views.toLocaleString(), color:"#3b82f6" },
            { label:"Лайки", value: stats.likes.toLocaleString(), color:"#ef4444" },
          ].map((s) => (
            <div key={s.label} style={S.card}>
              <div style={{ fontSize:28, fontWeight:800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize:13, color:"#6b7280", marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" as const, alignItems:"center" }}>
          {(["all","poetry","prose","draft"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding:"6px 16px", borderRadius:20, border:"1px solid", fontSize:13, cursor:"pointer",
                borderColor: filter===f ? "#a855f7" : "rgba(255,255,255,0.1)",
                background:  filter===f ? "rgba(168,85,247,0.2)" : "transparent",
                color:       filter===f ? "#c084fc" : "#6b7280" }}>
              {f === "all" ? "Все" : f === "draft" ? "Черновики" : f === "poetry" ? "Стихи" : "Проза"}
            </button>
          ))}
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск..."
            style={{ marginLeft:"auto", padding:"6px 14px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", color:"white", fontSize:13, outline:"none", width:200 }} />
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign:"center", padding:60, color:"#6b7280" }}>Загрузка...</div>
        ) : (
          <div style={{ overflowX:"auto" as const }}>
            <table style={S.table}>
              <thead>
                <tr>
                  {["Название","Категория","Теги","Просм.","Лайки","Статус","Действия"].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ ...S.td, textAlign:"center", color:"#4b5563", padding:40 }}>Ничего не найдено</td></tr>
                ) : filtered.map((work) => (
                  <tr key={work.id} style={{ transition:"background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td style={S.td}>
                      <div style={{ fontWeight:600, color:"#f1f5f9", maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{work.title}</div>
                      <div style={{ fontSize:11, color:"#4b5563", marginTop:2 }}>{work.id}</div>
                    </td>
                    <td style={S.td}>
                      <span style={{ padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600,
                        background: work.category === "poetry" ? "rgba(168,85,247,0.2)" : "rgba(245,158,11,0.2)",
                        color:      work.category === "poetry" ? "#c084fc" : "#fbbf24" }}>
                        {work.category === "poetry" ? "Стихи" : "Проза"}
                      </span>
                    </td>
                    <td style={S.td}>
                      <div style={{ display:"flex", gap:4, flexWrap:"wrap" as const, maxWidth:160 }}>
                        {work.tags.slice(0,3).map(t => (
                          <span key={t} style={{ padding:"2px 8px", borderRadius:10, background:"rgba(255,255,255,0.05)", fontSize:11, color:"#6b7280" }}>#{t}</span>
                        ))}
                        {work.tags.length > 3 && <span style={{ fontSize:11, color:"#4b5563" }}>+{work.tags.length-3}</span>}
                      </div>
                    </td>
                    <td style={{ ...S.td, color:"#6b7280" }}>{work.views.toLocaleString()}</td>
                    <td style={{ ...S.td, color:"#ef4444" }}>{work.likes}</td>
                    <td style={S.td}>
                      <span style={{ padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600,
                        background: work.isPublished ? "rgba(16,185,129,0.15)" : "rgba(107,114,128,0.2)",
                        color:      work.isPublished ? "#34d399" : "#9ca3af" }}>
                        {work.isPublished ? "Опубликовано" : "Черновик"}
                      </span>
                    </td>
                    <td style={S.td}>
                      <div style={{ display:"flex", gap:6 }}>
                        <Link href={`/admin/works/${work.id}`}
                          style={{ ...S.btn("rgba(168,85,247,0.3)"), color:"#c084fc", textDecoration:"none", display:"inline-block", fontSize:12 }}>
                          ✏️ Ред.
                        </Link>
                        <button onClick={() => handleToggle(work.id)}
                          style={S.btn(work.isPublished ? "rgba(107,114,128,0.3)" : "rgba(16,185,129,0.3)")}>
                          {work.isPublished ? "Скрыть" : "Публ."}
                        </button>
                        <button onClick={() => handleDelete(work.id)}
                          disabled={deleting === work.id}
                          style={{ ...S.btn("rgba(239,68,68,0.25)"), color:"#f87171", opacity: deleting===work.id ? 0.5 : 1 }}>
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop:16, fontSize:13, color:"#374151" }}>
          Показано: {filtered.length} из {works.length}
        </div>
      </div>
    </div>
  );
}

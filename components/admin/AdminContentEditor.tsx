"use client";

import React, { useState } from "react";
import { CATEGORY_DEF, type CategoryPresentation } from "@/lib/work-categories";
import type { WorkCategory } from "@/types";

const panel = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  padding: 16,
  marginBottom: 12,
} as const;

const tabBtn = (active: boolean) =>
  ({
    padding: "8px 16px",
    borderRadius: 10,
    border: "1px solid",
    fontSize: 13,
    cursor: "pointer" as const,
    fontWeight: 600,
    borderColor: active ? "#a855f7" : "rgba(255,255,255,0.1)",
    background: active ? "rgba(168,85,247,0.2)" : "transparent",
    color: active ? "#e9d5ff" : "#6b7280",
  }) satisfies React.CSSProperties;

export function AdminContentEditor({
  value,
  onChange,
  category,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  category: WorkCategory;
  label: string;
}) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const presentation: CategoryPresentation =
    CATEGORY_DEF[category].presentation;
  const blocks = value.split(/\n\n+/).filter((b) => b.trim().length > 0);

  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: "block",
          fontSize: 13,
          color: "#9ca3af",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button type="button" onClick={() => setTab("edit")} style={tabBtn(tab === "edit")}>
          Редактор
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          style={tabBtn(tab === "preview")}
        >
          Превью (по абзацам)
        </button>
      </div>

      {tab === "edit" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={18}
          placeholder={
            presentation === "stanza"
              ? "Текст… Пустая строка между блоками = новая строфа"
              : "Текст… Двойной перенос = новый абзац"
          }
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            color: "white",
            fontSize: 14,
            outline: "none",
            resize: "vertical" as const,
            boxSizing: "border-box",
            fontFamily: "ui-monospace, monospace",
            lineHeight: 1.65,
          }}
        />
      ) : (
        <div style={panel}>
          {blocks.length === 0 ? (
            <span style={{ color: "#6b7280", fontSize: 14 }}>Пусто — переключитесь в «Редактор».</span>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {blocks.map((block, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily:
                      presentation === "stanza"
                        ? "Georgia, 'Times New Roman', serif"
                        : "Georgia, serif",
                    fontSize: presentation === "stanza" ? 16 : 15,
                    lineHeight: presentation === "stanza" ? 1.85 : 1.75,
                    fontStyle: presentation === "stanza" ? "italic" : "normal",
                    color: "#e5e7eb",
                    whiteSpace: "pre-line",
                    paddingBottom: 12,
                    borderBottom:
                      i < blocks.length - 1
                        ? "1px solid rgba(255,255,255,0.06)"
                        : undefined,
                  }}
                >
                  {block.trim()}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

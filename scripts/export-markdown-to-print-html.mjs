/**
 * Печатный HTML из Markdown-экспорта (UTF-8, для «Печать → PDF» в браузере).
 * node scripts/export-markdown-to-print-html.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const mdPath = join(root, "docs", "handoff", "PROJECT_FULL_EXPORT.md");
const outPath = join(root, "docs", "handoff", "PROJECT_FULL_EXPORT_PRINT.html");

function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const md = readFileSync(mdPath, "utf8");
const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>natalia-melkher-site — полный экспорт</title>
  <style>
    @page { margin: 14mm; }
    body {
      font-family: ui-monospace, "Cascadia Code", "Segoe UI Mono", Consolas, monospace;
      font-size: 8.5pt;
      line-height: 1.35;
      color: #111;
      background: #fff;
      margin: 0;
      padding: 12px 16px 32px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    h1 { font-size: 11pt; margin: 1.2em 0 0.4em; page-break-after: avoid; }
    @media print {
      body { font-size: 8pt; padding: 0; }
    }
  </style>
</head>
<body><pre>${esc(md)}</pre></body>
</html>`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, html, "utf8");
console.log("Wrote:", outPath);

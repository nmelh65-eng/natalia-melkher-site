/**
 * Собирает дерево проекта и полный текст исходников в один Markdown для PDF / Claude.
 * Запуск: node scripts/export-project-handoff.mjs
 */
import { execSync } from "node:child_process";
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "docs", "handoff");
const outMd = join(outDir, "PROJECT_FULL_EXPORT.md");

const SKIP_NAMES = new Set([
  "package-lock.json",
  ".DS_Store",
]);

const BINARY_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".pdf",
  ".zip",
]);

function langFromPath(p) {
  if (p.endsWith(".tsx")) return "tsx";
  if (p.endsWith(".ts")) return "ts";
  if (p.endsWith(".css")) return "css";
  if (p.endsWith(".json")) return "json";
  if (p.endsWith(".mjs")) return "js";
  if (p.endsWith(".js")) return "js";
  if (p.endsWith(".md")) return "markdown";
  return "";
}

function treeFromPaths(paths) {
  const rootNode = { name: "", children: new Map() };
  for (const rel of paths) {
    const parts = rel.split("/").filter(Boolean);
    let node = rootNode;
    for (const part of parts) {
      if (!node.children.has(part)) {
        node.children.set(part, { name: part, children: new Map() });
      }
      node = node.children.get(part);
    }
  }
  const lines = [];
  function walk(node, prefix) {
    const entries = [...node.children.values()].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const last = i === entries.length - 1;
      const branch = last ? "└── " : "├── ";
      const nextPrefix = prefix + (last ? "    " : "│   ");
      const hasKids = e.children.size > 0;
      lines.push(prefix + branch + e.name + (hasKids ? "/" : ""));
      if (hasKids) walk(e, nextPrefix);
    }
  }
  walk(rootNode, "");
  return lines.join("\n");
}

function main() {
  const raw = execSync("git ls-files", { cwd: root, encoding: "utf8" });
  const files = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((p) => !SKIP_NAMES.has(p.split("/").pop()))
    .sort();

  const textFiles = [];
  const skippedBinary = [];

  for (const p of files) {
    const ext = p.includes(".") ? "." + p.split(".").pop().toLowerCase() : "";
    if (BINARY_EXT.has(ext)) {
      skippedBinary.push(p);
      continue;
    }
    textFiles.push(p);
  }

  mkdirSync(outDir, { recursive: true });

  let md = `# Natalia Melkher Site — полный экспорт для передачи в другую модель\n\n`;
  md += `Сгенерировано: ${new Date().toISOString()}\n\n`;
  md += `> Исключены: бинарные файлы (изображения, шрифты и т.д.) — пути перечислены ниже. \`package-lock.json\` не включён (огромный); зависимости см. \`package.json\`.\n\n`;

  md += `## Дерево отслеживаемых файлов (git)\n\n\`\`\`text\n`;
  md += treeFromPaths(files);
  md += `\n\`\`\`\n\n`;

  if (skippedBinary.length) {
    md += `## Бинарные / пропущенные пути (только список)\n\n`;
    for (const p of skippedBinary) {
      md += `- \`${p}\`\n`;
    }
    md += `\n`;
  }

  md += `---\n\n# Содержимое файлов\n\n`;

  for (const rel of textFiles) {
    const abs = join(root, rel);
    if (!existsSync(abs)) continue;
    let content;
    try {
      content = readFileSync(abs, "utf8");
    } catch {
      md += `## \`${rel}\`\n\n_(не удалось прочитать как UTF-8)_\n\n`;
      continue;
    }
    const lang = langFromPath(rel);
    md += `## Файл: \`${rel}\`\n\n`;
    if (lang) {
      md += `\`\`\`${lang}\n`;
    } else {
      md += `\`\`\`\n`;
    }
    md += content.replace(/\u0000/g, "");
    if (!content.endsWith("\n")) md += "\n";
    md += `\`\`\`\n\n`;
  }

  writeFileSync(outMd, md, "utf8");
  console.log("Wrote:", outMd);
  console.log("Chars:", md.length);
}

main();

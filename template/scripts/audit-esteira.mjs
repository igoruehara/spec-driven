#!/usr/bin/env node
// Auditoria da esteira SDD — valida estrutura, frontmatter, links e specs.
// Uso: node scripts/audit-esteira.mjs [dir]   (default: ".")
// Sai com código 1 se houver violação (serve de gate na CI e no /auditar).

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative, resolve, extname } from "node:path";

const ROOT = resolve(process.argv[2] || ".");
const IGNORE_DIRS = new Set(["node_modules", ".git"]);
const NO_FRONTMATTER_OK = new Set(["RELEASING.md", "CHANGELOG.md"]);
const errors = [];
const err = (file, msg) => errors.push(`${relative(ROOT, file) || file}: ${msg}`);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (IGNORE_DIRS.has(name) || name.startsWith(".tmp")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (extname(full) === ".md") out.push(full);
  }
  return out;
}

function parseFrontmatter(text) {
  if (!text.startsWith("---")) return null;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return null;
  const block = text.slice(3, end).trim();
  const keys = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^([A-Za-z_][\w-]*)\s*:/);
    if (m) keys[m[1]] = line.slice(m[0].length).trim();
  }
  return keys;
}

const isSkillDialect = (f) =>
  f.replace(/\\/g, "/").includes("/.claude/skills/") ||
  /(?:^|\/)(skill|subagent)\.template\.md$/.test(f.replace(/\\/g, "/"));

const files = walk(ROOT);

// 1) Frontmatter + dialeto
for (const f of files) {
  if (NO_FRONTMATTER_OK.has(f.split(/[\\/]/).pop())) continue;
  const text = readFileSync(f, "utf8");
  const fm = parseFrontmatter(text);
  if (!fm) { err(f, "sem frontmatter"); continue; }
  if (!fm.name) err(f, "frontmatter sem `name`");
  if (!fm.description) err(f, "frontmatter sem `description`");
  if (isSkillDialect(f)) {
    if ("alwaysApply" in fm) err(f, "dialeto skill não deve ter `alwaysApply`");
  } else {
    if (!("alwaysApply" in fm)) err(f, "doc sem `alwaysApply`");
    else if (!/^(true|false)$/.test(fm.alwaysApply)) err(f, `alwaysApply inválido: ${fm.alwaysApply}`);
  }
}

// 2) Links relativos quebrados
const linkRe = /\]\(([^)]+)\)/g;
for (const f of files) {
  const text = readFileSync(f, "utf8");
  let m;
  while ((m = linkRe.exec(text))) {
    let target = m[1].trim();
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    if (/[<>]|XXXX|NNNN|\s/.test(target)) continue; // placeholders
    target = target.split("#")[0];
    if (!target) continue;
    if (!existsSync(resolve(dirname(f), target))) err(f, `link quebrado → ${target}`);
  }
}

// 3) Toda pasta specs/NNNN-* precisa de spec.md
const specsDir = join(ROOT, "specs");
if (existsSync(specsDir)) {
  for (const name of readdirSync(specsDir)) {
    if (/^\d{4}-/.test(name) && !existsSync(join(specsDir, name, "spec.md")))
      err(join(specsDir, name), "feature sem `spec.md`");
  }
}

// Relatório
if (errors.length) {
  console.error(`\n✗ Auditoria da esteira: ${errors.length} problema(s)\n`);
  for (const e of errors) console.error(`  • ${e}`);
  console.error("");
  process.exit(1);
} else {
  console.log(`✓ Auditoria da esteira: ${files.length} docs OK (frontmatter, links, specs).`);
}

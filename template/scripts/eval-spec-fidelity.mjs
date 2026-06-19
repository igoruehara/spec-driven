#!/usr/bin/env node
// Eval de fidelidade spec→implementação.
// Para cada specs/NNNN-*/: extrai os AC da spec, checa cobertura por task (tasks.md) e
// referência em código/teste (token AC-N), e conta SPEC_DEVIATION abertos.
// Falha (exit 1) se algum AC não é coberto por NENHUMA task (rastreabilidade quebrada).
// Referência em teste é AVISO até a feature ser implementada.
// Uso: node scripts/eval-spec-fidelity.mjs [dir]

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, extname } from "node:path";

const ROOT = resolve(process.argv[2] || ".");
const SKIP = new Set(["node_modules", ".git", ".claude", "specs", "docs", "scripts"]);
const CODE_EXT = new Set([".js",".mjs",".cjs",".ts",".tsx",".jsx",".py",".go",".java",".rb",".php",".cs",".rs",".kt",".swift",".sql",".feature",".test"]);

function walkCode(dir) {
  const out = [];
  for (const n of readdirSync(dir)) {
    if (SKIP.has(n) || n.startsWith(".tmp")) continue;
    const f = join(dir, n);
    if (statSync(f).isDirectory()) out.push(...walkCode(f));
    else if (CODE_EXT.has(extname(f))) out.push(f);
  }
  return out;
}

const acTokens = (s) => new Set(s.match(/AC-\d+/g) || []);

const specsDir = join(ROOT, "specs");
if (!existsSync(specsDir)) { console.log("Sem specs/ — nada a avaliar."); process.exit(0); }

let codeBlob = "";
try { for (const f of walkCode(ROOT)) codeBlob += "\n" + readFileSync(f, "utf8"); } catch {}
const codeACs = acTokens(codeBlob);
const deviations = (codeBlob.match(/SPEC_DEVIATION/g) || []).length;

let hardFail = 0;
const rows = [];
for (const name of readdirSync(specsDir)) {
  if (!/^\d{4}-/.test(name)) continue;
  const dir = join(specsDir, name);
  if (!existsSync(join(dir, "spec.md"))) continue;
  const acs = [...acTokens(readFileSync(join(dir, "spec.md"), "utf8"))].sort();
  if (!acs.length) continue;
  const taskACs = existsSync(join(dir, "tasks.md")) ? acTokens(readFileSync(join(dir, "tasks.md"), "utf8")) : new Set();
  const uncovered = acs.filter((ac) => !taskACs.has(ac));
  const noTest = acs.filter((ac) => !codeACs.has(ac));
  hardFail += uncovered.length;
  rows.push({ name, acs, byTask: acs.length - uncovered.length, byTest: acs.length - noTest.length, uncovered, noTest });
}

console.log("\nEval de fidelidade spec→implementação\n");
for (const r of rows) {
  console.log(`  ${r.name}`);
  console.log(`    AC: ${r.acs.length} · por task: ${r.byTask}/${r.acs.length} · em código/teste: ${r.byTest}/${r.acs.length}`);
  if (r.uncovered.length) console.log(`    ✗ AC sem task (rastreabilidade): ${r.uncovered.join(", ")}`);
  if (r.noTest.length) console.log(`    ⚠ AC sem referência em teste: ${r.noTest.join(", ")}`);
}
console.log(`\n  SPEC_DEVIATION abertos no código: ${deviations}`);

if (hardFail) {
  console.error(`\n✗ ${hardFail} AC sem cobertura de task — rastreabilidade quebrada.\n`);
  process.exit(1);
}
console.log(`\n✓ Rastreabilidade spec→task OK (referência em teste é aviso até implementar).\n`);

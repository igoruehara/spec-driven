#!/usr/bin/env node
// @igoruehara/spec-driven — esteira Spec-Driven Development para Claude Code.
//
// Uso:
//   npx @igoruehara/spec-driven [dir] [--force] [--yes]   scaffolda a esteira (init)
//   npx @igoruehara/spec-driven update [dir] [--yes]      atualiza só a "maquinaria" da esteira
//
// init    cria tudo; arquivos existentes são MANTIDOS (use --force para sobrescrever).
// update  refaz apenas os arquivos gerenciados (skills, hooks, settings, _templates, scripts,
//         workflow da esteira) — PRESERVA seus docs/specs. Mostra o que muda antes de aplicar.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = resolve(__dirname, "..", "template");
const VERSION = JSON.parse(readFileSync(resolve(__dirname, "..", "package.json"), "utf8")).version;
const STAMP = ".claude/.spec-driven-version";

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith("-"));
const positional = args.filter((a) => !a.startsWith("-"));
const cmd = positional[0] === "update" ? "update" : "init";
const targetArg = (cmd === "update" ? positional[1] : positional[0]) || ".";
const targetDir = resolve(process.cwd(), targetArg);
const force = flags.includes("--force");
const yes = flags.includes("--yes") || flags.includes("-y");

const c = {
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

function listFiles(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...listFiles(full, base));
    else out.push(relative(base, full));
  }
  return out;
}

// Arquivos "gerenciados" pela esteira — seguros de atualizar (a maquinaria, não seus docs).
function isManaged(rel) {
  const r = rel.replace(/\\/g, "/");
  return (
    r.startsWith(".claude/skills/") ||
    r.startsWith(".claude/hooks/") ||
    r === ".claude/settings.json" ||
    r.startsWith(".github/workflows/") ||
    r.startsWith("scripts/") ||
    r.includes("/_templates/")
  );
}

const same = (a, b) => existsSync(b) && readFileSync(join(TEMPLATE_DIR, a), "utf8") === readFileSync(b, "utf8");
const confirm = async (q) => {
  if (yes) return true;
  const rl = createInterface({ input: stdin, output: stdout });
  const ans = (await rl.question(`  ${q} ${c.dim("(s/N) ")}`)).trim().toLowerCase();
  rl.close();
  return ["s", "sim", "y", "yes"].includes(ans);
};
const copy = (rel) => {
  const dest = join(targetDir, rel);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(join(TEMPLATE_DIR, rel), dest);
};
const stampVersion = () => writeFileSync(join(targetDir, STAMP), VERSION + "\n");

async function init() {
  console.log(c.bold("\n  spec-driven") + c.dim(`  v${VERSION} — scaffold\n`));
  console.log(`  Destino: ${c.cyan(targetDir)}\n`);
  const files = listFiles(TEMPLATE_DIR);
  const collisions = files.filter((f) => existsSync(join(targetDir, f)));
  if (collisions.length && !force) {
    console.log(c.yellow(`  ${collisions.length} arquivo(s) já existem — serão MANTIDOS (use --force).`));
    console.log(c.dim(`  Dica: para só atualizar a esteira, use ${c.cyan("update")}.\n`));
  }
  if (!(await confirm(`Scaffoldar ${files.length} arquivos em ${c.cyan(relative(process.cwd(), targetDir) || ".")}?`))) {
    return console.log(c.dim("\n  Cancelado.\n"));
  }
  mkdirSync(targetDir, { recursive: true });
  let written = 0, skipped = 0;
  for (const f of files) {
    if (existsSync(join(targetDir, f)) && !force) { skipped++; continue; }
    copy(f); written++;
  }
  stampVersion();
  console.log(c.green(`\n  ✓ ${written} arquivos criados`) + (skipped ? c.dim(`  (${skipped} mantidos)`) : "") + "\n");
  console.log(c.bold("  Próximos passos:"));
  console.log(`    1. ${c.dim("git init")} ${c.dim("(se ainda não for um repo)")}`);
  console.log(`    2. No Claude Code: ${c.cyan("/integracoes")} → ${c.cyan("/kickoff")} → ${c.cyan("/nova-feature")}`);
  console.log(c.dim("\n  Leia o README.md gerado para a esteira completa.\n"));
}

async function update() {
  const prev = existsSync(join(targetDir, STAMP)) ? readFileSync(join(targetDir, STAMP), "utf8").trim() : "—";
  console.log(c.bold("\n  spec-driven update") + c.dim(`  ${prev} → v${VERSION}\n`));
  console.log(`  Alvo: ${c.cyan(targetDir)}\n`);
  if (!existsSync(join(targetDir, ".claude"))) {
    console.log(c.yellow("  Não parece um projeto da esteira (.claude ausente). Rode o init primeiro.\n"));
    process.exit(1);
  }
  const managed = listFiles(TEMPLATE_DIR).filter(isManaged);
  const isNew = managed.filter((f) => !existsSync(join(targetDir, f)));
  const changed = managed.filter((f) => existsSync(join(targetDir, f)) && !same(f, join(targetDir, f)));

  if (!isNew.length && !changed.length) {
    return console.log(c.green("  ✓ Esteira já está atualizada — nada a fazer.\n"));
  }
  console.log(c.bold("  Mudanças na maquinaria da esteira (seus docs/specs NÃO são tocados):"));
  for (const f of isNew) console.log(c.green(`    + ${f}`));
  for (const f of changed) console.log(c.yellow(`    ~ ${f}`));
  console.log("");
  if (!(await confirm(`Aplicar ${isNew.length + changed.length} atualização(ões)?`))) {
    return console.log(c.dim("\n  Cancelado.\n"));
  }
  for (const f of [...isNew, ...changed]) copy(f);
  stampVersion();
  console.log(c.green(`\n  ✓ Esteira atualizada para v${VERSION} (${isNew.length} novos, ${changed.length} atualizados).\n`));
  console.log(c.dim("  Rode /auditar e os testes para confirmar que tudo segue conforme.\n"));
}

(async () => {
  if (!existsSync(TEMPLATE_DIR)) {
    console.error(c.yellow("Template não encontrado. Pacote corrompido?"));
    process.exit(1);
  }
  await (cmd === "update" ? update() : init());
})().catch((e) => { console.error(e); process.exit(1); });

// Adapters de cliente de IA — como materializar o template canônico (layout Claude)
// para cada ferramenta. O Claude é a FONTE da verdade (o conteúdo do pacote está no
// formato dele) e os demais clientes são "views" geradas a partir dele. O Claude em si
// é opcional na saída: é um item escolhível como qualquer outro — quando não selecionado,
// suas views (CLAUDE.md + .claude/) não são gravadas, mas seguem servindo de fonte.
//
// Mapa (instruções · skills/commands):
//   Claude   CLAUDE.md                        .claude/skills/<n>/SKILL.md   (canônico, verbatim)
//   Codex    AGENTS.md                        .agents/skills/<n>/SKILL.md   (= Claude)
//   Cursor   .cursor/rules/sdd.mdc            .cursor/commands/<n>.md
//   Copilot  .github/copilot-instructions.md  .github/prompts/<n>.prompt.md
//   Gemini   GEMINI.md                        .gemini/commands/<n>.toml
//   Windsurf .windsurf/rules/sdd.md           .windsurf/workflows/<n>.md

// ── Helpers de parsing/transform ────────────────────────────────────────────

// Remove o bloco de frontmatter YAML, devolvendo só o corpo.
export function stripFrontmatter(text) {
  if (!text.startsWith("---")) return text;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return text;
  return text.slice(end + 4).replace(/^\s*\n/, "");
}

// Lê um SKILL.md → { name, description, body }.
export function parseSkill(text) {
  const out = { name: "", description: "", body: text };
  if (!text.startsWith("---")) return out;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return out;
  const fm = text.slice(3, end);
  out.body = text.slice(end + 4).replace(/^\s*\n/, "");
  const n = fm.match(/^\s*name\s*:\s*(.+)$/m);
  const d = fm.match(/^\s*description\s*:\s*(.+)$/m);
  if (n) out.name = n[1].trim();
  if (d) out.description = d[1].trim();
  return out;
}

// Transforms de skill (recebem o conteúdo cru do SKILL.md, devolvem o arquivo final).
const skillAsIs = (raw) => raw; // .md simples (Cursor/Copilot/Windsurf) — frontmatter é inofensivo
const skillAsToml = (raw) => {
  const { name, description, body } = parseSkill(raw);
  const desc = (description || name).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const prompt = body.replace(/\\/g, "\\\\").replace(/"""/g, '\\"\\"\\"');
  return `description = "${desc}"\nprompt = """\n${prompt}\n"""\n`;
};

// ── Registry ─────────────────────────────────────────────────────────────────

export const ADAPTERS = {
  claude: { id: "claude", label: "Claude Code", canonical: true, hint: "CLAUDE.md + .claude/" },
  codex: {
    id: "codex", label: "OpenAI Codex",
    instructions: { to: "AGENTS.md", frontmatter: "strip" },
    skills: { dir: ".agents/skills", layout: "skill-dir" },
  },
  cursor: {
    id: "cursor", label: "Cursor",
    instructions: { to: ".cursor/rules/sdd.mdc", frontmatter: "keep" }, // o dialeto já é o do Cursor
    skills: { dir: ".cursor/commands", layout: "flat", ext: "md", transform: skillAsIs },
  },
  copilot: {
    id: "copilot", label: "GitHub Copilot",
    instructions: { to: ".github/copilot-instructions.md", frontmatter: "strip" },
    skills: { dir: ".github/prompts", layout: "flat", ext: "prompt.md", transform: skillAsIs },
  },
  gemini: {
    id: "gemini", label: "Gemini CLI",
    instructions: { to: "GEMINI.md", frontmatter: "strip" },
    skills: { dir: ".gemini/commands", layout: "flat", ext: "toml", transform: skillAsToml },
  },
  windsurf: {
    id: "windsurf", label: "Windsurf",
    instructions: { to: ".windsurf/rules/sdd.md", frontmatter: "strip" },
    skills: { dir: ".windsurf/workflows", layout: "flat", ext: "md", transform: skillAsIs },
  },
};

// Todos os clientes escolhíveis (Claude primeiro) — opções do menu / da flag --agent.
export const ALL_AGENTS = Object.values(ADAPTERS);
// Clientes que geram "views" (tudo menos o Claude canônico) — usado na emissão.
export const EXTRA_AGENTS = ALL_AGENTS.filter((a) => !a.canonical);
export const isValidAgent = (id) => Object.prototype.hasOwnProperty.call(ADAPTERS, id);

// Gera o conteúdo do arquivo de instruções de um adapter a partir do CLAUDE.md canônico.
export function emitInstructions(adapter, claudeMd) {
  let body = adapter.instructions.frontmatter === "strip" ? stripFrontmatter(claudeMd) : claudeMd;
  return body.split(".claude/skills").join(adapter.skills.dir); // reaponta as refs de skills
}

// Plano de emissão de UM adapter extra: lista de { rel, content } a gravar.
// `skills` = [{ name, raw }] lidos de template/.claude/skills/<name>/SKILL.md.
export function emitFor(adapter, claudeMd, skills) {
  const out = [{ rel: adapter.instructions.to, content: emitInstructions(adapter, claudeMd) }];
  for (const { name, raw } of skills) {
    if (adapter.skills.layout === "skill-dir") {
      out.push({ rel: `${adapter.skills.dir}/${name}/SKILL.md`, content: raw });
    } else {
      out.push({ rel: `${adapter.skills.dir}/${name}.${adapter.skills.ext}`, content: adapter.skills.transform(raw) });
    }
  }
  return out;
}

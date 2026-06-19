---
name: agentic-layer
description: Mapa de rules/agents/skills/workflows. Puxe ao evoluir a camada agêntica.
alwaysApply: false
---

# Camada agêntica do projeto

Os mesmos insumos do kickoff (stack, ferramentas, processo, domínio) afinam a camada que faz
**humanos e agentes operarem a esteira SDD**. Quatro tipos de artefato, todos versionados —
gerados/propostos pelo `/kickoff` e evoluídos ao longo do projeto.

## 1. Rules — como o agente deve se comportar
- **`CLAUDE.md`** — convenções, linguagem ubíqua, regra de camadas, Definition of Done.
  Lido em toda sessão. (gerado no kickoff)
- **`.claude/settings.json`** — permissões (allowlist dos comandos comuns do stack, p/ reduzir
  prompts) e **hooks**. ⚠️ Sensível: confirme cada permissão/hook antes de gravar.

## 2. Docs — o conhecimento (a constituição)
vision · mvp-canvas · design · domain · spec · ADRs · glossary · context-map · roadmap · integrations.
A spec continua sendo a **fonte da verdade**.

## 3. Agents (subagentes) — especialistas sob demanda
`.claude/agents/<nome>.md` (ver `docs/engineering/_templates/subagent.template.md`). Exemplos típicos:
- **`spec-reviewer`** — valida critérios de aceite testáveis (gate *Definition of Ready*).
- **`domain-modeler`** — extrai linguagem ubíqua e agregados de uma spec; checa o glossário.
- **`adr-writer`** — rascunha um ADR a partir de uma decisão.
- **`<stack>-tester`** — roda e interpreta os testes do stack (ex.: pytest, vitest).

## 4. Skills — workflows reutilizáveis
`.claude/skills/<nome>/SKILL.md` (ver `docs/engineering/_templates/skill.template.md`). Exemplos:
As 8 skills do boilerplate, uma responsabilidade cada:

| Skill | Responsabilidade |
|---|---|
| **`/kickoff`** | orquestra a constituição (descoberta + 5 eixos + geração) |
| **`/mapear`** | brownfield as-is → `assessment.md` (re-execução independente) |
| **`/diagramar`** | arquitetura de alto nível em Mermaid → `diagrams.md` |
| **`/roadmap`** | constrói/revisa o roadmap com o time |
| **`/camada-agentica`** | propõe/gera rules, subagents, skills, workflows/CI |
| **`/integracoes`** | ferramentas do time + MCPs (ortogonal ao kickoff) |
| **`/nova-feature`** | loop por feature (tier → spec → tasks) |
| **`/validar`** | UAT local: gates, AC→teste, SPEC_DEVIATION, DoD |
| **`/revisar-pr`** | gate de conformidade SDD no PR/MR (posta via MCP) |
| **`/setup-ci`** | pipeline CI/CD que materializa os gates SDD |
| **`/metricas`** | Lead Time · Throughput · maturidade de CD → `metrics.md` |
| **`/auditar`** | valida conformidade da esteira (frontmatter, links, rastreabilidade) |
| **`/evals`** | fidelidade spec→código (AC por task/teste, SPEC_DEVIATION) |
| **`/handoff`** | pausa/retoma via `docs/STATE.md` (continuidade) |

- *Tools-aware* (geradas pela `/camada-agentica` se o MCP existir): **`/spec-to-jira`**, **`/publicar-confluence`**.

## 5. Workflows — automação da esteira
- **Hooks** (`settings.json`): `SessionStart` → `.claude/hooks/load-context.mjs` injeta o contexto
  base (`alwaysApply: true`); rodar lint/teste no `Stop`; alertar ao editar fora de escopo.
- **CI/CD** (`/setup-ci`): falhar PR que altera código **sem spec aprovada**; rodar os testes de
  aceite derivados da `spec.md`. É aqui que o gate SDD vira pipeline.
- **Gate de PR/MR** (`/revisar-pr`): conformidade de processo na revisão, complementando o
  `/code-review` do harness (que caça bugs).
- **Conformidade da esteira** (`.github/workflows/esteira.yml` → `scripts/audit-esteira.mjs`):
  valida frontmatter, links e specs em todo PR. O `/auditar` é o complemento com julgamento
  (rastreabilidade, specs órfãs, DoD).

## Como os insumos afinam cada artefato
| Insumo do kickoff               | Afina                                                   |
|---------------------------------|---------------------------------------------------------|
| Stack (ex.: Python/pytest)      | rules no `CLAUDE.md` · `<stack>-tester` · permissões     |
| Ferramentas (Jira/Confluence)   | skills `/spec-to-jira`, `/publicar-confluence`           |
| Processo (Scrum/Kanban)         | workflow de preparação de sprint; cadência do roadmap    |
| Domínio (bounded contexts)      | `domain-modeler` · sementes do glossário                 |
| Observabilidade                 | hooks/CI que checam métricas e SLO                       |

> Princípio: **proponha com justificativa, gere só o aprovado.** O que não for aprovado vira
> item do roadmap de adoção — sem big-bang.

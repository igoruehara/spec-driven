# @igoruehara/spec-driven

Scaffold de **Spec-Driven Development (SDD)** para [Claude Code](https://claude.com/claude-code).
Em qualquer projeto, rode um comando e ganhe a esteira completa: **Lean Inception → DDD →
Technical Design Docs → SDD**, com skills, templates, gates de qualidade e continuidade entre sessões.

```bash
# no diretório do seu projeto
npx @igoruehara/spec-driven

# ou criando numa pasta nova
npx @igoruehara/spec-driven meu-projeto
```

## Em que se baseia

| Prática | Sentido aqui | O que aporta à esteira |
|---|---|---|
| **Lean Inception** | workshop de descoberta (Paulo Caroli) | visão, personas e MVP — *o que construir primeiro* |
| **DDD** | Domain-Driven Design (Eric Evans) | linguagem ubíqua e bounded contexts — *o modelo do negócio* |
| **TDD** | Technical Design Doc / RFC | design antes de codar, com alternativas — *como no nível de sistema* |
| **SDD** | Spec-Driven Development | a spec é a fonte da verdade — *o contrato que dirige a implementação* |

Encadeadas: **Lean Inception** (descobrir) → **DDD** (modelar) → **TDD** (desenhar) → **SDD** (especificar e implementar).

## O que ele instala

```
seu-projeto/
├── CLAUDE.md                  # convenções que o agente segue (verificação de conhecimento, camadas, DoD)
├── README.md                  # o manual da esteira SDD
├── .claude/skills/            # 13 skills (ver abaixo)
├── .github/workflows/         # esteira.yml — gate de conformidade na CI
├── scripts/                   # audit-esteira.mjs — validador estrutural
├── docs/
│   ├── glossary.md · STATE.md
│   ├── product/               # vision · stakeholders · journeys · features · mvp-canvas · roadmap
│   ├── architecture/          # overview (5 eixos) · context-map · diagrams · assessment · adr/
│   └── engineering/           # TESTING · metrics · integrations · agentic-layer (+ _templates)
├── specs/                     # uma pasta por feature (0001-…) + quick/ + _templates/
└── src/                       # estrutura em camadas DDD
```

## As skills

| Skill | Responsabilidade |
|---|---|
| `/kickoff` | orquestra a constituição do projeto (greenfield ou brownfield) |
| `/integracoes` | ferramentas do time + MCPs (read-first, trava de conta/workspace) |
| `/mapear` | mapeia um codebase existente → `assessment.md` |
| `/diagramar` | arquitetura de alto nível em Mermaid → `diagrams.md` |
| `/roadmap` | constrói/revisa o roadmap com o time |
| `/camada-agentica` | gera rules, subagents, skills e workflows/CI |
| `/nova-feature` | abre uma feature no padrão SDD (tier → spec → tasks) |
| `/validar` | UAT: gates, AC→teste, SPEC_DEVIATION, DoD |
| `/revisar-pr` | gate de conformidade SDD no PR/MR |
| `/setup-ci` | pipeline CI/CD que materializa os gates |
| `/metricas` | Lead Time, Throughput e maturidade de Continuous Delivery/Deployment |
| `/auditar` | valida a conformidade da esteira (frontmatter, links, rastreabilidade) |
| `/handoff` | pausa/retoma a sessão via `docs/STATE.md` |

## Uso

```bash
npx @igoruehara/spec-driven [diretório-alvo] [opções]
```

### Exemplos

```bash
npx @igoruehara/spec-driven                # scaffolda no diretório atual
npx @igoruehara/spec-driven meu-projeto    # cria/usa a pasta ./meu-projeto
npx @igoruehara/spec-driven . --force      # sobrescreve arquivos existentes
npx @igoruehara/spec-driven update         # atualiza só a esteira, preserva seus docs
```

### Comandos

| Comando  | O que faz |
|----------|-----------|
| *(init)* | scaffolda a esteira completa. Arquivos existentes são **mantidos** (use `--force`). |
| `update` | atualiza só a **maquinaria** (skills, hooks, `_templates`, scripts, CI). **Preserva** seus docs/specs e mostra o diff antes de aplicar. |

### Opções

| Opção         | O que faz                            |
|---------------|--------------------------------------|
| `--force`     | sobrescreve arquivos que já existem  |
| `--yes`, `-y` | pula a confirmação interativa        |

> 🔒 **Seguro em projeto existente:** no init, arquivos existentes são **mantidos** (nada sobrescrito
> sem `--force`). No `update`, só a maquinaria da esteira é refeita — seus docs e specs ficam intactos.

## Depois de scaffoldar

1. `git init` (se ainda não for um repo).
2. No Claude Code, **aprove o hook de contexto** na 1ª sessão — um `SessionStart`
   (`.claude/settings.json`) que carrega o contexto base (STATE, vision, roadmap) automaticamente.
   Requer Node na máquina.
3. Rode `/integracoes` (se já conhece o ferramental) → `/kickoff`.
4. Comece a primeira feature com `/nova-feature`.

## Licença

MIT

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

## O que ele instala

```
seu-projeto/
├── CLAUDE.md                  # convenções que o agente segue (verificação de conhecimento, camadas, DoD)
├── README.md                  # o manual da esteira SDD
├── .claude/skills/            # 10 skills (ver abaixo)
├── docs/
│   ├── glossary.md · STATE.md
│   ├── product/               # vision · mvp-canvas · roadmap
│   ├── architecture/          # context-map · assessment · adr/
│   └── engineering/           # TESTING · integrations · agentic-layer (+ _templates)
├── specs/                     # uma pasta por feature (0001-…) + quick/ + _templates/
└── src/                       # estrutura em camadas DDD
```

## As skills

| Skill | Responsabilidade |
|---|---|
| `/kickoff` | orquestra a constituição do projeto (greenfield ou brownfield) |
| `/integracoes` | ferramentas do time + MCPs (read-first, trava de conta/workspace) |
| `/mapear` | mapeia um codebase existente → `assessment.md` |
| `/roadmap` | constrói/revisa o roadmap com o time |
| `/camada-agentica` | gera rules, subagents, skills e workflows/CI |
| `/nova-feature` | abre uma feature no padrão SDD (tier → spec → tasks) |
| `/validar` | UAT: gates, AC→teste, SPEC_DEVIATION, DoD |
| `/revisar-pr` | gate de conformidade SDD no PR/MR |
| `/setup-ci` | pipeline CI/CD que materializa os gates |
| `/handoff` | pausa/retoma a sessão via `docs/STATE.md` |

## Uso

```bash
npx @igoruehara/spec-driven [diretório-alvo] [--force] [--yes]
```

- `diretório-alvo` — destino (padrão: diretório atual `.`)
- `--force` — sobrescreve arquivos existentes (por padrão, mantém os que já existem)
- `--yes`, `-y` — não pergunta confirmação

Arquivos já existentes no destino são **mantidos** por padrão — seguro rodar em projeto em andamento.

## Depois de scaffoldar

1. `git init` (se ainda não for um repo).
2. No Claude Code: `/integracoes` (se já conhece o ferramental) → `/kickoff`.
3. Comece a primeira feature com `/nova-feature`.

## Licença

MIT

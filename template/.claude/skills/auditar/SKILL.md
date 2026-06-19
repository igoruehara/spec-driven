---
name: auditar
description: Use para auditar a conformidade da esteira SDD — roda o validador estrutural (frontmatter, links, specs) e checa o que exige julgamento (rastreabilidade AC→teste→commit, DoD, specs órfãs, docs vivas atualizadas). Reporta violações com o arquivo. Acione com /auditar.
---

# Skill: Auditar a esteira SDD

Verifica se o projeto respeita o padrão da esteira. Duas camadas: **estrutural** (script, determinístico)
e **semântica** (julgamento do agente).

## 1. Checagem estrutural (determinística)
Rode o validador e reporte a saída:
```
node scripts/audit-esteira.mjs .
```
Cobre: frontmatter presente + dialeto certo (`alwaysApply` nos docs; `name`+`description` nas
skills), links relativos quebrados e toda `specs/NNNN-*/` com `spec.md`. Exit ≠ 0 = falhou.

## 2. Checagem semântica (julgamento)
O script não pega tudo. Verifique também:
- **Rastreabilidade:** cada `AC-N` da spec aparece em `tasks.md` (coluna "Cobre AC") e tem teste?
- **Specs órfãs:** features em `specs/` sem PR/implementação correspondente, ou paradas há tempo
  (cruze com `STATE.md`).
- **Docs vivas:** glossário e `context-map.md` refletem os termos/fronteiras atuais? ADRs cobrem
  as decisões difíceis de reverter já tomadas?
- **DoD pendente:** features marcadas prontas com `SPEC_DEVIATION` aberto ou AC sem teste.
- **Frontmatter `alwaysApply`:** o que é base está `true`; o resto `false` com `description` que diz quando puxar.

## Saída
Liste as violações por arquivo, separando **estrutural** (corrigir já) de **semântica** (revisar).
Ofereça corrigir as triviais (frontmatter, links). Não invente conformidade — relate o que achou.

> Esta skill é o complemento humano/agente do gate de CI (`/setup-ci` roda o mesmo script).

---
name: roadmap
description: Use para construir ou atualizar docs/product/roadmap.md em horizontes Now/Next/Later, com valor, esforço, dono e dependências, priorizando quick wins de baixo risco. No brownfield inclui a adoção incremental do SDD. Pensado para revisar com o time a cada ciclo. É chamada pelo /kickoff e também roda sozinha periodicamente. Acione com /roadmap.
---

# Skill: Roadmap (construir / revisar com o time)

Constrói ou atualiza o roadmap. **Idempotente**: re-rodar revisa o que existe, não recomeça.
Princípio: **quick wins de baixo risco primeiro** para gerar tração e confiança do time.

## Reúna os insumos
- **Greenfield:** `vision.md`, `mvp-canvas.md` (features sequenciadas por valor × esforço).
- **Brownfield:** `assessment.md` (dívidas/riscos e gaps dos 5 eixos) → itens de melhoria.
- **Sempre:** `docs/STATE.md` (todos soltos, ideias adiadas) e pendências de `integrations.md`.
- **Capacidade:** Throughput recente em `docs/engineering/metrics.md` (via `/metricas`) — dimensione
  as ondas pela **vazão real**, não pelo otimismo.

## Construa
- Horizontes **Now / Next / Later** (datas só no "Agora" — evita falsa precisão).
- Cada item: valor, esforço, **dono**, dependências, "pronto quando".
- **Brownfield:** inclua a seção de **adoção incremental do SDD** (sem big-bang: próxima feature
  já nasce com spec; backfill de ADRs e context-map depois).
- Defina a **cadência de revisão** e quem decide prioridade.

## Saída
- `docs/product/roadmap.md` (use `docs/product/_templates/roadmap.template.md`).
- Ofereça commit se for repositório git.

## Próximo passo
Aponte a primeira feature do "Agora" → `/nova-feature`.

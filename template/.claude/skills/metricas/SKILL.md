---
name: metricas
description: Use para acompanhar métricas de entrega/fluxo — Lead Time (tempo até produção) e Throughput (itens concluídos por ciclo) — e avaliar a maturidade de Continuous Delivery vs Continuous Deployment. Lê git/Jira/CI quando há MCP conectado e atualiza docs/engineering/metrics.md. Acione com /metricas.
---

# Skill: Métricas de entrega (Lead Time · Throughput · CD)

Acompanha a saúde do fluxo de entrega. **Idempotente**: re-rodar recalcula o período.
Princípio: usar para **achar gargalo**, não para ranquear pessoas (não incentive gaming).

## Defina o período
Pergunte (`AskUserQuestion`) o ciclo (sprint / semana / mês) e a janela de datas.

## 1. Lead Time — quanto tempo até produção
Tempo de **"começou" → "em produção"** por item.
- **Início** (use o que houver): data da spec/STATE, criação da issue (Jira) ou 1º commit.
- **Fim:** deploy em prod — tag/release, log de CI/CD, ou status "done" do Jira.
- Calcule por item e o agregado: **mediana** e **p85** (mais robusto que média). Quebre por
  tier/tipo (feature/bug) se útil.

## 2. Throughput — itens concluídos no ciclo
Número de itens que chegaram a **"pronto"/prod** no período (histórias, bugs, tarefas).
- Fontes: `specs/` marcadas implementadas, PRs mergeados, issues fechadas (Jira), deploys.
- Reporte o **número absoluto** por ciclo e a **tendência** (↑ / → / ↓ vs ciclo anterior).

## 3. Continuous Delivery vs Continuous Deployment
Avalie onde o time está e o gap:

| Prática | Definição | Pergunta de verificação |
|---|---|---|
| **Continuous Delivery** | toda mudança fica **deployável** (pipeline verde); o release é decisão de negócio (um botão) | o pipeline garante deployabilidade? há staging? |
| **Continuous Deployment** | toda mudança aprovada vai para prod **automaticamente**, sem gate manual | ainda há gate manual? quanto da pipeline é automático? |

- Reporte também a **Deployment Frequency** (quantos deploys no período).
- Aponte o próximo passo de automação → `/setup-ci`.

## Fontes (tools-aware)
Se Jira/GitHub/GitLab/CI MCP estiver conectado (conta validada — ver `/integracoes`), **puxe os
dados** (issues, PRs, releases, runs de pipeline). Senão, use `git log`/tags locais e peça os
números que faltarem. Cite a origem.

## Saída
- Atualize `docs/engineering/metrics.md` (tabelas + tendência + data e período).
- Resuma: Lead Time (mediana/p85), Throughput (total + tendência), maturidade CD e o gargalo nº 1.
- **Realimente o `/roadmap`:** o Throughput recente é a **capacidade observada** — não planeje
  ondas além da vazão real do time.

> Contexto: Lead Time e Deployment Frequency são métricas **DORA**; Throughput é métrica de fluxo.
> Olhe a **tendência**, não o número isolado.

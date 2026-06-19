---
name: evals
description: Use para avaliar a fidelidade da implementação à spec — roda o eval que checa se cada AC-N é coberto por task e referenciado em teste, conta SPEC_DEVIATION e reporta um score por feature. Acione com /evals.
---

# Skill: Evals de fidelidade spec→código

Mede se **o que foi construído reflete a spec** — a métrica de qualidade da saída do agente.
Duas camadas: determinística (script) e de julgamento.

## 1. Camada determinística
```
node scripts/eval-spec-fidelity.mjs .
```
Reporta, por feature: AC totais, **cobertos por task**, **referenciados em teste/código** e
**SPEC_DEVIATION** abertos. Falha (exit 1) se algum AC não tem task — rastreabilidade quebrada.
Referência em teste é aviso até a feature ser implementada.

## 2. Camada de julgamento (o script não pega isso)
- O teste de cada `AC-N` realmente exercita o **Given/When/Then** — ou só cita o ID num teste vazio?
- A implementação cobre os **casos de borda** e respeitou o **"Fora de escopo"** da spec?
- Os `SPEC_DEVIATION` abertos têm resolução (corrigir código **ou** atualizar a spec/ADR)?

## Saída
Score por feature + os gaps. Complementa o `/validar` (UAT de uma feature) com uma visão de
**fidelidade do portfólio**. O mesmo eval roda na CI (`esteira.yml`) — aqui é o complemento com julgamento.

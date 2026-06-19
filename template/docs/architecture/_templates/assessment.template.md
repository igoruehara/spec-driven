---
name: assessment
description: Retrato as-is (brownfield). Puxe ao mapear ou avaliar o codebase.
alwaysApply: false
---

# Assessment (as-is) — <nome do projeto>

> Mapa do estado atual de um projeto **já em andamento** (brownfield), gerado no kickoff.
> Objetivo: entender o que existe antes de propor mudanças. Fotografe, não julgue ainda.

## Visão geral
<O que o sistema faz hoje, está em produção, quantos usuários/serviços, idade do código.>

## Stack detectada
| Camada            | Tecnologia atual            | Observação |
|-------------------|-----------------------------|------------|
| Linguagem/runtime | <…>                         |            |
| Frameworks        | <…>                         |            |
| Persistência      | <…>                         |            |
| Infra/deploy      | <…>                         |            |

## Arquitetura atual
<Estilo real (monolito, serviços, big ball of mud?), camadas, acoplamentos perigosos,
pontos de entrada. Onde o domínio está misturado com infra?>

## Estrutura de pastas
<Como o código se organiza (por camada? por feature? por tipo?), onde estão os pontos de
entrada, e o que destoa do esperado.>

## Convenções de código
<Padrões reais observados: nomenclatura, estilo, tratamento de erro, padrões de teste.
O que é convenção tácita (não escrita) e deveria ir para o `CLAUDE.md`?>

## Bounded contexts implícitos
> Inferidos do código/estrutura — raramente explícitos em brownfield.

| Contexto (inferido) | Onde vive no código | Core/Support/Generic | Fronteira clara? |
|---------------------|---------------------|----------------------|------------------|
| <…>                 | <pasta/módulo>      | <…>                  | não / parcial    |

## Testes & CI
<Tipos de teste existentes, cobertura aproximada, o que a CI roda, comandos de gate.
Alimenta o `docs/engineering/TESTING.md`.>

## Integrações
| Integração       | Tipo (API/lib/fila) | Como é usada            | Risco/acoplamento |
|------------------|---------------------|-------------------------|-------------------|
| <ex.: gateway X> | REST                | <…>                     | <…>               |

## Maturidade nos 5 eixos
| Eixo            | Estado atual                  | Gap vs padrão SDD        | Risco |
|-----------------|-------------------------------|--------------------------|-------|
| Tech stack      | <…>                           | <…>                      | baixo/médio/alto |
| Arquitetura     | <…>                           | <…>                      |       |
| Infra           | <…>                           | <…>                      |       |
| Qualidade       | <testes? cobertura? CI?>      | <…>                      |       |
| Observabilidade | <logs/métricas/tracing/SLO?>  | <…>                      |       |

## Dívidas e riscos principais
1. <maior risco — o que pode causar incidente ou travar evolução>

## Decisões históricas a capturar como ADR
> Escolhas estruturais já tomadas, mas sem registro. Vire ADR retroativo (status: aceito).
- [ ] <ex.: "uso de X como banco" — por que foi escolhido, se ainda se sustenta>

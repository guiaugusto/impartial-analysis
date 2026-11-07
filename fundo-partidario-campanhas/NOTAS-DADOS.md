# Notas sobre a estrutura dos dados do TSE

Notas técnicas de apoio. A visão geral do projeto está em [`LEIAME.md`](LEIAME.md).

## Objetivo

Mostrar, por eleição (2018, 2022 e, quando fechada, 2026): o fundo disponível aos partidos, quanto cada partido e cada candidato gastou, separando 1º e 2º turno, sempre apontando para a fonte oficial em vez de reproduzir todos os dados.

Fontes oficiais:

- [Distribuição do FEFC, Eleições 2026 (TSE)](https://www.tse.jus.br/eleicoes/eleicoes-2026-content/prestacao-de-contas/distribuicao-dos-recursos-do-fundo-especial-de-financiamento-de-campanha-fefc-eleicoes-2026)
- [DivulgaCandContas (TSE)](https://divulgacandcontas.tse.jus.br/divulga/#/home)
- Dados abertos de prestação de contas (CDN do TSE), baixados por `coleta/baixar.ps1`.

## Segurança dos dados (leia antes de mexer)

Regras completas em [`.claude/skills/dados-sensiveis/SKILL.md`](../.claude/skills/dados-sensiveis/SKILL.md). Em resumo:

- Brutos ficam em `dados-brutos/` (ignorado pelo Git) e **nunca** são commitados.
- Só saem agregados por ano, partido, turno e fonte do recurso. Sem CPF/CNPJ, doadores, fornecedores, contas, e-mails ou telefones.
- Antes de commitar: `powershell -File scripts/verificar-dados-sensiveis.ps1 fundo-partidario-campanhas`.

## Estrutura dos dados de órgãos partidários (2022, conferida no arquivo)

Arquivos `*_BRASIL.csv` (latin-1, separador `;`). Colunas que o agregador pode usar (lista permitida):

- **Receitas:** `SG_PARTIDO`, `DS_ESFERA_PARTIDARIA` (Nacional, Federal/Estadual, Municipal, Zonal), `SG_UF`, `DS_FONTE_RECEITA` ("Fundo Partidario", "Fundo Especial", "Outros Recursos"; sem acento nos dados), `DS_ORIGEM_RECEITA`, `DT_RECEITA`, `VR_RECEITA`.
- **Despesas pagas:** `SG_UF`, `DS_FONTE_DESPESA`, `DS_ORIGEM_DESPESA`, `DT_PAGTO_DESPESA`, `VR_PAGTO_DESPESA`. Não traz o partido: cruzar por `SQ_PRESTADOR_CONTAS` com as receitas.
- **Despesas contratadas:** `SG_PARTIDO`, `DS_ESFERA_PARTIDARIA`, `SG_UF`, `DT_DESPESA`, `VR_DESPESA_CONTRATADA`.
- A data (`DT_*`) permite separar 1º e 2º turno.

O arquivo de 2018 tem as mesmas colunas e os mesmos valores de fonte (53.530 receitas); o `receitas_..._doador_originario_` só existe para identificar doadores e **não será usado**.

### Candidatos (2018 e 2022, mesmo formato nos dois anos)

- **Despesas pagas** (541 MB em 2018, 802 MB em 2022, 1,65 e 2,41 milhões de linhas): `ST_TURNO`, `DS_ELEICAO`, `SG_UF`, `SQ_PRESTADOR_CONTAS`, `DS_FONTE_DESPESA` ("Fundo Especial de Financiamento de Campanha", "Fundo Partidário", "Outros Recursos"), `DT_PAGTO_DESPESA`, `VR_PAGTO_DESPESA`. Não traz o partido nem o cargo.
- **Receitas** (223 MB e 412 MB): `ST_TURNO`, `SG_PARTIDO`, `DS_CARGO`, `SG_UF`, `SQ_PRESTADOR_CONTAS`, `DS_FONTE_RECEITA`, `DT_RECEITA`, `VR_RECEITA`. É por aqui que se liga o gasto ao partido e ao cargo, via `SQ_PRESTADOR_CONTAS`.
- Há dois grupos de eleição: "Eleições Gerais Estaduais" (governador, senador, deputados) e "Eleição Geral Federal" (presidente).
- Colunas pessoais descartadas: `NR_CPF_CANDIDATO`, `NR_CPF_VICE_CANDIDATO`, `NM_CANDIDATO`/`NR_CANDIDATO` se não forem necessárias, mais as de doador e fornecedor. `DS_GENERO` e `DS_COR_RACA` só poderiam sair agregadas.

Colunas **descartadas de propósito** (pessoais ou de terceiros): todas as `*_CPF_CNPJ_*`, `NM_DOADOR*`, `NM_FORNECEDOR*`, `NR_CNPJ_PRESTADOR_CONTA`, documentos e recibos.

## Limitações já conhecidas

- Fundo partidário (anual, manutenção do partido) e FEFC (eleitoral, desde 2018) são fundos diferentes e aparecem separados.
- Nos arquivos de **candidatos**, o turno vem do TSE (`ST_TURNO`: 1 ou 2), junto de `DS_ELEICAO` e `DT_ELEICAO`. Ele diz a que turno a prestação se refere, e não a data em que o dinheiro foi gasto; isso deve ser dito na página. Os arquivos de órgãos partidários não têm `ST_TURNO`.
- 2026 só entra como parcial até a prestação de contas final.

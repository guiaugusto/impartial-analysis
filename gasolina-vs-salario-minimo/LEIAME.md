# Gasolina e salário mínimo, mês a mês

Página estática (HTML, CSS e JS sem dependências) que cruza o preço médio da gasolina comum (ANP) com o salário mínimo nacional, de jan/2013 a out/2026.

## O que mostra

- Índice (início do período = 100) de gasolina e salário mínimo, e litros de gasolina que um salário mínimo compra, mês a mês.
- Período ajustável (atalhos e dois controles), mês selecionável por controle ou arrastando sobre os gráficos, com tooltip no hover.
- 12 períodos de alta ou queda explicados, com variação do preço e fontes; faixas coloridas nos gráficos.
- Comparação por município (até 4, mais a média nacional) e ranking dos 5 mais caros e mais baratos do mês.

## Dados

`data/dados.json` é gerado por `scripts/gerar-dados.ps1` a partir de planilhas públicas da ANP:

- Brasil: série semanal desde 2013 (média das semanas de cada mês).
- Municípios: séries mensais por município. Ficam os municípios com pelo menos 12 meses de dados (555 na última geração); a ANP não pesquisa todos os municípios do país.
- Salário mínimo: tabela dos decretos anuais, dentro do próprio script, com os reajustes fora de janeiro em 2020 e 2023. O valor de 2026 (R$ 1.621) não foi conferido em fonte oficial: confira no DIEESE.

Para atualizar, rode (baixa cerca de 45 MB de planilhas na primeira vez e guarda em cache):

```
powershell -File gasolina-vs-salario-minimo/scripts/gerar-dados.ps1 -FimMes 2026-11
```

## Ver localmente

O navegador não deixa a página ler `data/dados.json` pelo arquivo direto; use o servidor da outra pasta, a partir da raiz do repositório:

```
powershell -File resumo-imparcial-eleicoes-2026/servir.ps1 -Raiz (Get-Location).Path
```

e abra `http://localhost:8080/gasolina-vs-salario-minimo/`.

## Limitações

- Preços nominais, sem correção pela inflação.
- Setembro de 2020 não tem dado de gasolina (a ANP não pesquisou entre 18/8 e 17/10).
- Preço médio de município com poucos postos pesquisados é pouco confiável; a tabela mostra a média de postos por município.
- As explicações de cada período ligam o evento à variação no tempo, sem medir o efeito isolado de cada causa. As de 2013, out/2015, 2017, 2018, 2020 e 2021 não têm fonte linkada.

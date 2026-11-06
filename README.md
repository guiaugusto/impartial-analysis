| Guia político explicado (enciclopédia de processos, cargos, instituições e conceitos da política brasileira, com exemplos e fontes; federal, estadual, DF e municipal) | [`guia-politico-explicado/`](guia-politico-explicado/) |
# impartial-analysis

Espaço de estudo sobre política e economia, para formar pensamento crítico a partir de dados públicos. Cada microprojeto cita as fontes, marca o que não é confirmado e declara o que os dados não permitem concluir. A página inicial, publicada no GitHub Pages, indexa todos os projetos.

## Projetos

| Projeto | Pasta |
|---|---|
| Resumo imparcial do 2º turno de 2026 (mapa, horário de votação, ocorrências, análise) | [`resumo-imparcial-eleicoes-2026/`](resumo-imparcial-eleicoes-2026/) |
| Gasolina e salário mínimo, mês a mês (preço da gasolina por mês e por município, litros por salário, contexto de cada variação) | [`gasolina-vs-salario-minimo/`](gasolina-vs-salario-minimo/) |
| Empresas na Nova República, setor por setor (linha do tempo de 1985 até hoje com entradas, saídas e mudanças, faixas por governo, filtro por setor) | [`linha-do-tempo-nova-republica/`](linha-do-tempo-nova-republica/) |
| Guia político explicado (enciclopédia de processos, cargos, instituições e conceitos da política brasileira, com exemplos e fontes; federal, estadual, DF e municipal) | [`guia-politico-explicado/`](guia-politico-explicado/) |

## Padrão obrigatório

Todo projeto segue a skill [`analise-imparcial`](.claude/skills/analise-imparcial/SKILL.md): **link de fonte em cada fato**, imparcialidade (sem veredito, divergências à mostra, justificativa separada de interpretação), limites declarados e páginas que funcionam bem na web e no celular. O Claude Code do projeto carrega essa skill sozinho ao criar ou alterar projetos.

## Como adicionar um projeto

1. Crie uma pasta na raiz com o projeto (HTML/JS/CSS estáticos, **caminhos relativos**, sem `/` inicial).
2. Inclua nela um link de volta: `<a href="../">← Todos os projetos</a>`.
3. Acrescente uma entrada em [`projetos.json`](projetos.json) (`id`, `titulo`, `descricao`, `tags`, `status`, `statusTexto`, `atualizado`, `url`). A página inicial lê esse arquivo.

## Ver localmente

```
powershell -File resumo-imparcial-eleicoes-2026/servir.ps1 -Raiz (Get-Location).Path
```

Abre em `http://localhost:8080` (a raiz mostra o índice).

## Publicar no GitHub Pages

Em *Settings → Pages*, use *Source: GitHub Actions*. O workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) publica a raiz a cada push na `master`. O endereço será `https://guiaugusto.github.io/impartial-analysis/`.

## Princípios

Fonte em cada fato, espectro do veículo explicado, confiança explícita (confirmado, alegado, não verificado, desmentido), divergências mostradas e limitações declaradas.

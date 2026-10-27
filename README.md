# impartial-analysis

Microprojetos de leitura imparcial de fatos e dados públicos. Página inicial em GitHub Pages, com índice de todos os projetos.

## Projetos

| Projeto | Pasta |
|---|---|
| Resumo imparcial do 2º turno de 2026 (mapa, horário de votação, ocorrências, análise) | [`resumo-imparcial-eleicoes-2026/`](resumo-imparcial-eleicoes-2026/) |

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

Em *Settings → Pages*, use *Deploy from a branch*, branch `main`, pasta `/ (root)`. O endereço será `https://guiaugusto.github.io/impartial-analysis/`.

## Princípios

Fonte em cada fato, espectro do veículo explicado, confiança explícita (confirmado, alegado, não verificado, desmentido), divergências mostradas e limitações declaradas.

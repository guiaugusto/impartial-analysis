# Resumo imparcial — 2º turno 2026

## Ver o site
```
powershell -File servir.ps1
```
Abra `http://localhost:8080`. No celular (mesma rede Wi-Fi), use o endereço "Celular" que o script imprime.

## Atualizar os dados
`scripts/build_dados.ps1 -Cache <pasta>` lê os JSONs municipais do TSE (`mun/6257-*.json`, `mun/6258-*.json`), o CSV de zonas e gera `data/*.json`.
Os arquivos municipais do TSE devem ser baixados **devagar** (o TSE já respondeu 429 quando baixamos rápido). Ritmo usado: 1 requisição a cada 5 s, sequencial, parando no primeiro erro. Preferir os arquivos em massa dos Dados Abertos quando o TSE publicar o 2º turno por zona.

## Estado atual (26/10/2026)
- Mapa por estado e por município: 1º e 2º turno, completo (5.571 municípios, 27 estados; a soma dos municípios bate com o total oficial do TSE).
- Detalhe por zona: apenas 1º turno; 2º turno aguarda os Dados Abertos do TSE.
- Horário de votação, ocorrências e análise: baseados em notícias de 25–26/10; ver as "lacunas" nas abas.
- Classificação de espectro dos veículos: em `data/conteudo.js`, editável.

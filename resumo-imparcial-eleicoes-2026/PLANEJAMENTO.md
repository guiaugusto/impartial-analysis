# Planejamento — Resumo Imparcial do 2º Turno das Eleições 2026

Status: **planejamento (nada implementado ainda)**. Data de criação: 26/10/2026 (um dia após o 2º turno, 25/10).

## 1. Viabilidade
Sim, é viável criar tudo em `analises-imparciais/resumo-imparcial-eleicoes-2026/` como site estático (HTML + JS + JSON), sem servidor, abrindo bem no celular e publicável em GitHub Pages/Netlify/Artifact.

## 2. Arquitetura proposta
- Site estático mobile-first, uma página com 4 abas: **Mapa**, **Horário de votação**, **Ocorrências**, **Análise**.
- Mapa: Leaflet (ou D3) + GeoJSON de UF → município → zona. Azul = Flávio, vermelho = Lula; clique/toque abre painel com 1º vs 2º turno (votos por candidato, outros, brancos, nulos, aptos, comparecimento, abstenção, apurado).
- Dados: script de build (Python) baixa os CSVs do TSE e gera JSONs agregados e pequenos em `data/`. O site só lê esses JSONs.
- Tooltips (hover no desktop, toque no celular) em todo elemento com resumo + link da fonte.
- Cada fato em `data/fatos.json` com: descrição, data, fonte, URL, espectro da fonte, nível de confiança (confirmado / alegado / desmentido).

## 3. Fontes de dados
| Uso | Fonte |
|---|---|
| Votos 1º/2º turno | Dados Abertos TSE (`dadosabertos.tse.jus.br`): *Resultados 2026* (CSV por município/zona/seção) e *Boletim de Urna* (CSV por UF). Verificado que existem datasets 2026 com 1º e 2º turnos. |
| Painel oficial | `resultados.tse.jus.br/oficial/app/index.html` — é uma SPA (carrega via JS); não serve para raspagem direta, os CSVs são o caminho correto. |
| Horário / prorrogação | TSE/TREs (resoluções, ofícios, notas), prefeituras, imprensa. |
| Ocorrências | TSE/TREs/PF/PM/MPE (notas oficiais) + imprensa classificada. |

## 4. Limitações (importantes)
1. **Dados do 2º turno são de ontem.** Totalização pode estar incompleta ou ser retificada; CSVs por seção/boletim costumam ser publicados com atraso (horas a dias). O site mostrará "atualizado em" e eu rodarei o build de novo quando o TSE publicar.
2. **Não consegui confirmar até agora nenhum fato do 2º turno** (resultado final, pedidos de extensão de horário, incidentes): minha busca só retornou cobertura do 1º turno e pesquisas. Meu conhecimento próprio termina antes disso. Tudo será apurado em fontes e **nada será escrito sem fonte verificável**; onde não houver, o site dirá "sem informação confirmada".
3. **Mapa por zona eleitoral:** o TSE publica dados por zona, mas **não há shapefile oficial público de zonas** de todo o país. Opções: (a) mapa por município, com detalhamento por zona em tabela/painel (recomendado); (b) aproximar zonas por pontos geocodificados dos locais de votação (aproximação, não limite oficial). Mapa poligonal exato de zona é inviável sem dados de terceiros.
4. **Peso dos dados:** ~5.570 municípios e ~3 mil zonas × 2 turnos. Será pré-agregado e carregado sob demanda (por UF) para funcionar bem no celular.
5. **"Votos úteis":** o TSE não mede isso. Só posso mostrar a **migração aparente** (votos de terceiros e brancos/nulos no 1º turno vs. variação dos dois finalistas no 2º) e explicar que é inferência agregada, não comportamento individual (risco de falácia ecológica).
6. **Dados de urna detalhados** (BU, log, RDV): disponíveis em ZIP gigantes; usarei BU para totais, sem entrar em logs/RDV, exceto se você pedir para um caso específico.
7. **Horário de votação:** só poderei explicar a imparcialidade do pedido e o precedente histórico com base em documentos (decisões do TSE/TRE, notas dos partidos/campanhas). Julgamentos de "houve parcialidade" serão apresentados como **o que cada lado alegou e o que a Justiça decidiu**, sem veredito próprio. Precedentes (ex.: prorrogações pontuais por filas/falhas em zonas) serão pesquisados e citados, não presumidos.
8. **Contabilização de escândalos:** não existe contagem oficial. Farei um registro de casos **com fonte primária ou ≥2 fontes de espectros diferentes**, separando confirmado / alegado / desmentido. A contagem será de *casos documentados*, não do total real de ocorrências, e isso será dito na tela. Fake news: usar checagens (Aos Fatos, Lupa, Comprova, Estadão Verifica, etc.).
9. **Classificação de espectro de mídia:** é inevitavelmente subjetiva. Critério proposto: (i) referência pública externa (AllSides-like/Ad Fontes não cobrem bem o Brasil; usar levantamentos acadêmicos, ex.: FGV/ECA-USP, Reuters Institute Digital News Report, Manchetômetro/IESP-UERJ), (ii) linha editorial declarada, (iii) histórico de cobertura. Mostrarei o critério e a fonte de cada classificação, e a classificação é **editável** num arquivo. Proporção alvo: maioria centro-esquerda/centro-direita, com extremos como contraponto.
   - Exemplos de partida (a validar): centro-esquerda: Folha, Globo/g1, Nexo; centro-direita: Estadão, O Globo (editorial), Valor/InfoMoney; esquerda: Brasil 247, Carta Capital, Fórum; direita: Gazeta do Povo, Jovem Pan, Revista Oeste.
10. **Paywall/robôs:** algumas matérias não podem ser lidas por mim; nesse caso cito a manchete e link sem resumir além do que consigo verificar. Não reproduzo trechos longos (direitos autorais): só resumos próprios.
11. **Imparcialidade:** o design (cores azul/vermelho conforme você pediu, ordem alfabética dos candidatos, mesma estrutura de texto para os dois lados, mesmo tratamento de "alegado") reduz viés, mas não elimina: a seleção de casos já é uma escolha editorial. A metodologia ficará visível no site.
12. **Análise final:** limitada a comparar magnitudes e correlações dos dados (ex.: casos × margem de votos por região). Sem inferir causalidade; mostrarei o que os dados **não** permitem concluir.

## 5. Etapas
1. Coletar e validar dados TSE (resultado final 2º turno, 1º turno) → JSON agregado. *Depende de publicação do TSE.*
2. Montar o mapa + painel de detalhe + comparativo 1º×2º turno.
3. Pesquisar e documentar horário de votação (pedidos, quem pediu, decisão, urnas/locais afetados, precedentes).
4. Pesquisar e registrar ocorrências, classificar fontes e escrever a metodologia.
5. Aba de análise + tooltips + fontes.
6. Teste em viewport de celular e entrega (pasta local; publicação só se você pedir).

## 6. Estrutura de pastas
```
resumo-imparcial-eleicoes-2026/
  PLANEJAMENTO.md
  index.html
  assets/ (css, js)
  data/   (resultados/*.json, fatos.json, veiculos.json, geo/*.geojson)
  scripts/ (build_dados.py)
```

## 7. Decisões para você
- Mapa por **município com detalhe por zona** (recomendado) ou aproximação por pontos?
- Escopo geográfico: Brasil inteiro (pesado) ou começar por estados/capitais e expandir?
- Idioma: PT-BR.
- Publicação: apenas local ou também online?

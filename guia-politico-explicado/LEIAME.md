# Guia político explicado

Enciclopédia navegável da política brasileira: processos (impeachment, PEC, inelegibilidade...), cargos (do vereador ao presidente), instituições e conceitos, em linguagem simples, com fonte e exemplos reais. Cobre as esferas federal, estadual, Distrito Federal e municipal. Planejamento completo em [PLANEJAMENTO.md](PLANEJAMENTO.md).

## O que tem hoje (44 verbetes)

- **Fundamentos:** quóruns e maiorias (com calculadora), separação de Poderes, federalismo, hierarquia das normas, Distrito Federal.
- **Processos:** como uma lei é feita, medida provisória, PEC, impeachment (presidente e governador), cassação de prefeito e de parlamentar, CPI, orçamento, controle de constitucionalidade, foro, imunidade.
- **Eleições:** voto majoritário e proporcional, quociente eleitoral (com calculadora), cláusula de desempenho, inelegibilidade.
- **Cargos:** presidente, vice, governador, prefeito, vereador, deputados (federal, estadual, distrital), senador, suplente, presidentes da Câmara e do Senado, ministros do STF e de Estado.
- **Órgãos:** Congresso, Câmara, Senado, Assembleia, Câmara Municipal, STF, TSE, Ministério Público, tribunais de contas.
- 7 trilhas de leitura e links entre verbetes ("veja também" e "citado em").

## Como funciona

Página estática (HTML, CSS e JS sem dependências), com roteamento por hash (`#/v/<id>`, `#/trilha/<id>`). O conteúdo fica em `data/*.js`, um objeto por verbete; abre direto do arquivo, sem servidor.

Campos de um verbete: `id`, `tipo` (processo, cargo, orgao, conceito), `titulo`, `esferas`, `resumo`, `tags`, `ficha`, `etapas`, `secoes`, `porEsfera`, `exemplo`, `erros`, `relacionados`, `fontes`. Nos textos, `[[id]]` ou `[[id|texto]]` cria link para outro verbete e `**x**` é negrito.

Para adicionar um verbete: acrescente o objeto em um dos arquivos de `data/` (ou crie um novo e inclua o `<script>` no `index.html`) e, se fizer sentido, coloque o `id` em uma trilha em `data/trilhas.js`.

## Limitações

- **Conteúdo ainda não conferido linha a linha** nas fontes oficiais. Cada página avisa isso; o link da fonte está ao final. Pontos mais sujeitos a mudança: regras de sobras eleitorais, prazos da Ficha Limpa (alterados em 2025), entendimento do STF sobre foro e números de votações dos exemplos.
- Estados e municípios têm regras próprias; os verbetes descrevem a regra geral e indicam onde confirmar a local.
- Os exemplos descrevem o rito e não opinam sobre os casos.
- Não é aconselhamento jurídico.

## Próximos passos

Mais verbetes (Defensoria, TCU em detalhe, financiamento de campanha, calendário eleitoral, intervenção, plebiscito e iniciativa popular, fidelidade partidária), comparador de esferas lado a lado e conferência das fontes verbete a verbete.

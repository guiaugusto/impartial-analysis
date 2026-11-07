# Empresas na Nova República, setor por setor

Linha do tempo de 1985 até hoje com entradas, saídas e mudanças de empresas no Brasil, organizada por setor e por governo.

## O que tem hoje (fase 1)

- 14 setores, cada um com botão de ícone que filtra a linha do tempo (vários ao mesmo tempo; sem nenhum marcado, mostra todos).
- Faixas por presidente em cores neutras, de propósito.
- 13 marcos nacionais como contexto (Plano Real, câmbio, crise de 2008, Lava Jato, pandemia etc.).
- 62 casos curados, cada um com resumo, justificativa (e quem a deu), comparação internacional quando conhecida, referência de ações e onde conferir.
- Tabela por governo e lista cronológica.

## Dados

Tudo está em [`data/dados.json`](data/dados.json). Para adicionar um caso, acrescente um objeto em `eventos` com `id`, `empresa`, `setor`, `data` (`AAAA` ou `AAAA-MM`, `aprox: true` se incerta), `tipo` (`entrada`, `saida` ou `mudanca`), `rotulo`, `resumo`, `motivo`, `motivoTipo` (`declarado`, `interpretacao` ou `indisponivel`), `internacional` (texto ou `null`), `acoes`, `fontes` (lista de `{titulo, url, tipo}`, com `tipo` entre `oficial`, `empresa`, `imprensa`, `academico` e `parte`; ao menos um link) e `fato` (`confirmado` ou `a-conferir`). `internacional` é `{texto, fontes}` ou `null`.

## Limites

- É uma amostra de casos conhecidos, não o cadastro de todas as empresas.
- A data mostra quando algo ocorreu, não que o governo da época causou o fato. Câmbio, juros, crises globais e pandemia afetam todos.
- Cada caso e marco tem links (188 nos casos). Os links vieram de busca na web e os fatos foram conferidos pelos resumos dos resultados, nem sempre pelo texto completo. Quando só há imprensa, falta o documento primário (comunicado, fato relevante, decisão judicial). Os casos marcados “a conferir” têm fontes divergentes sobre a data.
- Esses limites aparecem na própria página: aviso no topo, seção “O que esta página ainda não garante” (com a contagem calculada dos dados) e o selo “Sem documento primário” no detalhe de cada caso que só tem imprensa, estudo ou parte interessada.
- Cada fonte é rotulada (oficial, empresa, imprensa, estudo, parte interessada). Se a fonte tem lado, o rótulo diz.
- Governos mais recentes têm mais cobertura, o que infla a contagem por ano.

## Próximas fases

1. Trocar as fontes de imprensa por documentos primários onde existirem e revisar os casos “a conferir”.
2. Série agregada de abertura e baixa de CNPJs por governo (Receita Federal, IBGE Demografia das Empresas).
3. Séries de preços das ações das empresas listadas, em janelas em torno de cada acontecimento.
4. Comparação internacional mais completa.

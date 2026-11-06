# Benefícios sociais no Brasil

Página estática (HTML, CSS e JS sem dependências) que documenta benefícios federais: quem pode receber, por quanto tempo, quanto vale, se estrangeiros também têm direito e onde pedir.

## O que mostra

- Fichas por benefício (12 no piloto), com filtro por área, tipo e se estrangeiros podem receber, e busca por texto.
- Cada ficha traz critérios, duração, condições para continuar, valor, como pedir, base legal e fontes oficiais.
- Dois níveis de confiança: o da ficha e o da informação sobre estrangeiros (confirmado, parcial, não verificado).

## Dados

Tudo vem de `data/beneficios.json`, editado à mão a partir de páginas oficiais (gov.br, INSS, MTE, MDS, MEC, Ministério da Saúde, Planalto). Para acrescentar um benefício, copie uma entrada existente e preencha os mesmos campos:

`id`, `nome`, `categoria`, `orgao`, `tipo` (assistencial, previdenciário, trabalhista ou universal), `resumo`, `quem` (lista), `estrangeiros` (`pode`: sim, depende ou nao; `texto`; `confianca`), `duracao`, `condicoes`, `valor`, `comoPedir`, `baseLegal`, `confianca`, `fontes`.

Atualize `verificadoEm` ao conferir os valores.

## Ver localmente

O navegador não deixa a página ler o JSON pelo arquivo direto; use o servidor da outra pasta, a partir da raiz do repositório:

```
powershell -File resumo-imparcial-eleicoes-2026/servir.ps1 -Raiz (Get-Location).Path
```

e abra `http://localhost:8080/beneficios-sociais-brasil/`.

## Limitações

- Só nível federal e uma amostra inicial. Faltam Minha Casa Minha Vida, Seguro-Defeso, auxílio-reclusão, programas para migrantes e refugiados, e estados e municípios.
- A parte sobre estrangeiros é a menos verificada: várias páginas oficiais não tratam de nacionalidade, e a ficha marca isso como “não verificado”.
- Há relatos de reajustes de 2026 (por exemplo, no Bolsa Família) que não foram confirmados em fonte oficial.
- A tabela de parcelas do seguro-desemprego e os prazos de pedido não foram lidos em norma oficial completa.
- Não é aconselhamento jurídico.

# Fundos de campanha: partidos e candidatos

Página estática (`index.html`) que mostra, para as eleições gerais de **2018 e 2022**, quanto do **Fundo Eleitoral (FEFC)** e do **Fundo Partidário** foi pago por partidos e candidaturas, no 1º e no 2º turno, com link para a fonte oficial. Estado: piloto.

## O que tem

- `index.html`, `assets/`: página (filtros de eleição e turno, tabela por partido, detalhe por cargo e por candidatura em diálogo).
- `data/candidatos-AAAA.json`, `data/orgaos-AAAA.json`: totais agregados por partido, cargo, turno e fonte do recurso.
- `data/candidatos/AAAA/PARTIDO.json`: valores por candidatura (nome, número, cargo, UF), carregados só ao abrir o detalhe de um partido.
- `data/oficial.json`: total oficial do FEFC por ano, marcado como **a conferir** (ver limites).
- `coleta/baixar.ps1`, `coleta/agregar.ps1`: download e agregação. Rodam só na máquina de quem atualiza.
- [`NOTAS-DADOS.md`](NOTAS-DADOS.md): estrutura dos arquivos do TSE e colunas usadas e descartadas.

## Como atualizar os dados

1. `powershell -File coleta/baixar.ps1 -Ano 2022 -Tipo candidatos` mostra nome, URL e tamanho. Só baixa com `-Confirmar` (pausa entre requisições; para no primeiro erro HTTP, como o 429). Repita para `orgaos_partidarios` e para os outros anos. Os zips vão para `dados-brutos/`, que o Git ignora.
2. `powershell -File coleta/agregar.ps1 -Anos "2018,2022"` gera os JSONs em `data/`.
3. `powershell -File ../scripts/verificar-dados-sensiveis.ps1 .` (rode na pasta do projeto): precisa terminar com "OK" antes de qualquer commit.
4. Commit só dos arquivos de `data/`, `assets/` e páginas, pelo nome. Nunca `git add .`.

O mesmo verificador roda no workflow de publicação e bloqueia o deploy se achar dado sensível.

## Dados sensíveis

Regras em [`.claude/skills/dados-sensiveis/SKILL.md`](../.claude/skills/dados-sensiveis/SKILL.md). Neste projeto:

- O agregador lê só uma lista de colunas (listada no cabeçalho de `coleta/agregar.ps1`). CPF/CNPJ, doadores, fornecedores, documentos, gênero e cor/raça não são lidos.
- Nomes de candidatura são públicos (DivulgaCandContas). Quando o campo de nome traz e-mail, endereço de site ou sequência longa de dígitos, o nome é trocado por “(nome omitido)”. Na rodada de 2018 e 2022, 1 nome foi omitido.

## Limites (também declarados na página)

- Valores declarados ao TSE, sem auditoria nem correção de retificações posteriores.
- FEFC e Fundo Partidário são fundos diferentes e aparecem separados.
- Há dupla contagem entre etapas (diretório nacional → estadual → candidatura → outra candidatura). A página separa “gasto próprio” de “repasses” usando a origem da despesa, e a coluna “Repasses” pode superar o total do fundo. Em 2018 a soma das receitas de FEFC declaradas pelas candidaturas (R$ 1,83 bi) ficou acima do total oficial lido (R$ 1,72 bi).
- O turno é o campo `ST_TURNO` da prestação de contas da candidatura, e não a data do gasto. Órgãos partidários não têm turno.
- **Total oficial do FEFC: “a conferir”.** O site do TSE respondeu 403 à leitura automática. Os valores (R$ 1.716.209.431 em 2018 e R$ 4.961.519.777 em 2022) vieram do resumo de uma busca que cita as páginas do TSE, e não de leitura direta da página. Confira nos links de `data/oficial.json`.
- **Fundo Partidário: total anual por partido não incluído.** Não localizei em fonte que eu conseguisse ler.
- Não inclui eleições municipais (2020, 2024) nem 2026 (prestação de contas ainda em andamento).
- Não mede eficiência nem resultado eleitoral, e não julga a regularidade dos gastos.

## Próximas fases

- Conferir os totais oficiais direto nas páginas do TSE e incluir a tabela de distribuição do FEFC por partido.
- Incluir o total anual do Fundo Partidário por partido, com fonte.
- Avaliar 2014 e anteriores (os arquivos têm outros nomes e formato) e as eleições municipais.
- Incluir 2026 quando a prestação de contas for concluída.

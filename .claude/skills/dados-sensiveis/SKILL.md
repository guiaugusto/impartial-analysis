---
name: dados-sensiveis
description: Use sempre que o trabalho neste repositório envolver baixar, tratar, agregar ou publicar dados de fontes públicas (TSE, ANP, IBGE, Câmara, Senado etc.), criar ou editar scripts de coleta, gerar JSON/CSV que vai para o GitHub Pages, mexer em .gitignore ou no workflow de publicação, ou fazer commit/push com arquivos de dados. Garante que dado pessoal ou sensível não vaze e que arquivos brutos não entrem no Git.
---

# Dados sensíveis: regras do repositório analises-imparciais

Este repositório é **público** e é publicado inteiro no GitHub Pages (`path: .`). Tudo o que for commitado fica na internet e no histórico do Git, mesmo se apagado depois. Por isso a regra é: **na dúvida, não publica**.

## Regras inegociáveis

1. **Brutos nunca entram no Git.** Zips, CSVs e qualquer arquivo baixado de fonte externa ficam em `dados-brutos/` (ignorado pelo Git), dentro da pasta do projeto. Só entram no repositório os **agregados** gerados por script.
2. **Nenhum dado pessoal nos agregados.** Proibido publicar: CPF, CNPJ de pessoa física/MEI, título de eleitor, e-mail, telefone, endereço, data de nascimento, número de conta ou agência, nome de doador ou fornecedor pessoa física, chave Pix, ID de documento. Candidato e partido (nome de urna, número, sigla) são públicos e podem aparecer; doadores e fornecedores não precisam aparecer, então não aparecem.
3. **Agregue antes de publicar.** Publique totais por ano, partido, turno e fonte do recurso. Se uma célula agregada tiver poucos registros e puder identificar uma pessoa, junte categorias ou omita.
4. **Whitelist, não blacklist.** O script de agregação escolhe explicitamente as colunas que saem. Nunca copie o registro inteiro nem faça `to_json` do dataframe bruto.
5. **Sem segredos.** Nunca commitar tokens, chaves de API, `.env`, credenciais ou caminhos locais com nome de usuário. Se um dia houver segredo, vai em variável de ambiente.
6. **Arquivo grande é sinal de alerta.** Se um arquivo a commitar passar de 5 MB, pare e investigue: provavelmente é dado bruto.
7. **Não baixar sem avisar.** Antes de baixar um arquivo, diga ao usuário nome, fonte e tamanho e espere o sim. Respeite os limites da fonte: pausa entre requisições e parada imediata em 429 (o TSE já limitou antes).
8. **Fonte em cada número.** Todo dado publicado cita a fonte oficial e o link, e as limitações são declaradas na página (princípio do repositório).

## Antes de cada commit que toque dados

1. Rode o verificador do projeto:
   ```
   powershell -File scripts/verificar-dados-sensiveis.ps1 <pasta-do-projeto>
   ```
   Ele falha se achar CPF/CNPJ/e-mail/telefone, colunas proibidas, arquivos brutos (`.zip`, `.csv`, `.parquet`, `.xlsx`) ou arquivos grandes.
2. Rode `git status` e `git diff --stat` e **leia a lista de arquivos**. Confirme que só há código, páginas e JSONs agregados.
3. Se o verificador falhar, **não use `--no-verify`, não contorne**: corrija o script de agregação.
4. Nunca use `git add .` ou `git add -A` em pasta com dados: adicione arquivos pelo nome.

## Se algo sensível já foi commitado ou publicado

1. Avise o usuário imediatamente, sem minimizar.
2. Remover o arquivo em um novo commit **não basta**: o dado continua no histórico. A solução é reescrever o histórico (por exemplo `git filter-repo`) e forçar push, o que **só o usuário pode autorizar**. Não faça sozinho.
3. Se o dado estiver exposto de verdade, considere-o público e informe quem for afetado, quando aplicável.

## Ao criar um projeto novo com dados

- Crie `dados-brutos/` já no `.gitignore` antes da primeira coleta.
- Documente no README do projeto: fontes, quais campos saem, quais são descartados e por quê.
- Mantenha a coleta **local**. O workflow de Pages só publica arquivos estáticos já prontos.

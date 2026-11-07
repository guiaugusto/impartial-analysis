---
name: analise-imparcial
description: Padrão obrigatório para criar ou alterar qualquer projeto deste repositório (análises sobre política, economia e sociedade). Exige link de fonte em cada fato, imparcialidade, declaração de limites e páginas acessíveis na web e no celular. Use ao criar um projeto novo, adicionar dados, escrever texto de análise ou revisar um projeto existente.
---

# Análise imparcial: padrão do repositório

Este repositório forma pensamento crítico a partir de dados públicos. Quem lê deve poder **conferir tudo** e **chegar à própria conclusão**. Estas regras valem para todo projeto novo e para toda alteração em projeto existente.

## 1. Regra de ouro: nenhum fato sem link

- **Todo fato, número, data, citação e justificativa leva ao menos um link clicável** para onde foi apurado. Se não há link, o fato não entra na página.
- O link abre em nova aba (`target="_blank" rel="noopener noreferrer"`) e o texto do link diz o que é ("Planalto: Lei 9.478/1997"), nunca "clique aqui".
- **Prefira a fonte primária**: lei no Planalto, decisão ou nota do órgão (Cade, Anatel, ANP, BC, IBGE, TSE), comunicado ou fato relevante da empresa na CVM/SEC, documento judicial. Use imprensa quando não houver o primário e diga que é imprensa.
- **Nunca invente nem complete de memória.** Se uma data ou valor veio da sua memória e não de uma fonte lida, não o escreva. Busque na web (WebSearch/WebFetch) e leia. Se não achar, escreva "não localizei" e deixe de fora o dado.
- **Só use URLs que você viu** em resultado de busca ou abriu. Não monte URL por padrão de endereço.
- Anote a data da consulta quando o dado muda (preços, cotações, contagens).

### Rótulo de cada fonte
Cada fonte recebe um tipo, para o leitor pesar o ponto de vista:
`oficial` (documento ou órgão público), `empresa` (comunicado da própria empresa), `imprensa`, `academico` (estudo ou análise), `parte` (sindicato, partido, associação, crítico ou defensor declarado).

### Espectro do veículo
Quando o tema é politicamente disputado, traga fontes de lados diferentes e diga qual é qual. Uma só fonte de um lado não basta para fato controverso.

## 2. Imparcialidade

- **Sem veredito.** Descreva, compare, mostre o contexto. Não diga que um governo, partido ou empresa "acertou", "errou" ou "é culpado". Deixe a conclusão ao leitor.
- **Correlação não é causa.** Uma data coincidir com um governo não mostra que o governo causou o fato. Câmbio, juros, crises globais e pandemia afetam todos. Escreva isso onde houver comparação entre períodos ou governos.
- **Mostre as divergências.** Se duas fontes dão datas ou valores diferentes, mostre os dois e cite quem diz o quê. Não escolha em silêncio.
- **Quem disse o quê.** Separe o fato (ocorreu), a justificativa declarada (a parte disse que fez por tal motivo) e a interpretação (imprensa ou analistas leem assim). Marque cada uma.
- **Dê o outro lado.** Em decisão polêmica, registre o argumento de quem defende e o de quem critica, cada um atribuído e com link.
- **Termos neutros.** Evite adjetivos e rótulos carregados ("rombo", "desastre", "entreguista", "escândalo") a menos que estejam numa citação atribuída. Prefira o termo técnico ("recuperação judicial", "privatização", "tarifa adicional").
- **Cores neutras** para partidos e governos. Não use cor de partido.
- **Nível de confiança explícito**: `confirmado`, `alegado`, `não verificado`, `desmentido`, ou, em fatos datados, `a conferir`. Diga o que mudaria a classificação.
- **Declare os limites.** Toda página diz o que os dados não permitem concluir (amostra, viés de sobrevivência, cobertura desigual, período curto, dado ausente).
- **Limite de fonte também é limite a declarar, dentro do projeto.** Se parte dos dados só tem imprensa e falta o documento primário, ou se as fontes foram lidas só pelo resumo da busca, diga isso (a) num aviso no topo da página, (b) numa seção de limites, com a contagem calculada dos dados, e (c) com selo no item afetado. Não deixe essa informação só no `LEIAME.md`.

## 3. Máximo de informação, de forma acessível

Traga o máximo de informação útil, mas em camadas: primeiro o essencial, depois o detalhe sob demanda (painel, `<details>`, diálogo).

- Cada item tem **resumo curto** (o que aconteceu), **contexto** (por que importa), **justificativa/contraponto**, **comparação** quando fizer sentido (outros períodos, outros países) e **fontes**.
- Use **filtros** (por setor, período, tema) e **busca** quando houver mais de ~15 itens.
- Dê a **lista em texto** além de qualquer gráfico ou mapa, para leitura linear.
- Explique siglas na primeira vez (Cade, ANP, CVM, RJ).

## 4. Acessibilidade e mobile (web e celular)

Teste sempre em largura de celular (375 px) e de desktop. Checklist:

- **Sem rolagem lateral na página.** Se um componente é largo (linha do tempo, tabela), a rolagem é só dentro dele, com aviso de que dá para rolar.
- **Alvos de toque de pelo menos 44×44 px** e espaço entre eles. Campos de texto com fonte de 16 px (evita o zoom no iOS).
- **Funciona sem mouse**: tudo que se clica é `<button>` ou `<a>`, com foco visível e ordem lógica de tabulação. Diálogos usam `<dialog>` (fecha com Esc, devolve o foco).
- **Contraste suficiente** (texto normal ≥ 4,5:1). Não dependa só da cor: use também forma, ícone ou texto (por exemplo, entrada = círculo, saída = losango).
- **Texto alternativo e rótulos**: `aria-label` em botões só de ícone, `title` quando ajuda, `alt` em imagens, `aria-pressed` em botões de filtro.
- **Tema escuro** com variáveis CSS (`--bg`, `--card`, `--txt`...) como nos projetos existentes; respeite `prefers-reduced-motion`.
- **Texto legível**: fonte ≥ 14 px no corpo, linhas de até ~75 caracteres, frases curtas, português simples.
- **Carrega rápido e offline-friendly**: HTML/CSS/JS estáticos, sem dependência de CDN para o essencial, dados em JSON.
- **Falha com elegância**: sem JavaScript ou com erro de carregamento, mostre mensagem clara (`<noscript>`, aviso de erro).

## 5. Estrutura técnica do projeto

Siga [`README.md`](../../../README.md) na raiz. Resumo:

1. Pasta própria na raiz (`meu-projeto/`) com `index.html`, `assets/app.js`, `assets/styles.css`, `data/*.json`, `LEIAME.md`.
2. **Caminhos relativos**, sem `/` inicial (o site é publicado em subcaminho no GitHub Pages).
3. Link de volta: `<a href="../">← Todos os projetos</a>`.
4. Entrada em `projetos.json` (`id`, `titulo`, `descricao`, `tags`, `status`, `statusTexto`, `atualizado`, `url`) e linha na tabela do `README.md`.
5. Dados em JSON, sem texto de análise escondido no JavaScript. Cada registro com `fontes: [{ titulo, url, tipo }]`, ao menos um.
6. `LEIAME.md` do projeto com: o que tem, como atualizar os dados, **limites** e próximas fases.

### Modelo de registro de dado
```json
{
  "id": "slug-unico",
  "titulo": "…",
  "data": "AAAA-MM",
  "resumo": "O que aconteceu, em 1 a 3 frases.",
  "motivo": "Justificativa dada, atribuída a quem disse.",
  "motivoTipo": "declarado | interpretacao | indisponivel",
  "fato": "confirmado | a-conferir",
  "fontes": [
    { "titulo": "Órgão ou veículo: título", "url": "https://…", "tipo": "oficial | empresa | imprensa | academico | parte" }
  ]
}
```

## 6. Fluxo de trabalho

1. **Pesquise antes de escrever.** Para cada fato, busque e leia a fonte. Registre o link. Quando as fontes divergirem, anote as duas.
2. **Escreva o dado** já com `fontes`. Sem fonte, sem registro.
3. **Valide**: o JSON abre; todo registro tem ao menos um link; nenhum link malformado; setores/categorias existem.
4. **Teste no navegador** em desktop e celular: filtros, diálogo, foco por teclado, sem rolagem lateral na página, sem erro no console.
5. **Revise o texto**: tem veredito? tem adjetivo carregado? causa sem evidência? limite declarado?
6. **Respeite as fontes**: não reproduza trechos longos de material protegido; resuma com suas palavras e cite o link. Em baixar dados de órgãos públicos (TSE, ANP, IBGE), vá devagar, pare no erro 429 e respeite os limites de requisição.
7. **Commit**: título no formato `{type}: descrição curta` (feat, fix, docs, chore…).

## 7. Checklist final (marque tudo antes de entregar)

- [ ] Todo fato, número e data tem link; nenhum link foi inventado.
- [ ] Fontes rotuladas (oficial, empresa, imprensa, análise, parte) e, no tema polêmico, há mais de um lado.
- [ ] Divergências entre fontes aparecem na página.
- [ ] Fato, justificativa declarada e interpretação estão separados e marcados.
- [ ] Sem veredito, sem adjetivo carregado, sem causa afirmada sem evidência.
- [ ] Limites declarados na página e no `LEIAME.md`.
- [ ] Funciona em 375 px sem rolagem lateral; alvos de toque ≥ 44 px; teclado ok; contraste ok.
- [ ] Registrado em `projetos.json` e no `README.md`.

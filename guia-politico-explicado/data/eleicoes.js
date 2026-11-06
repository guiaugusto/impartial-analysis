/* Sistema eleitoral. */
(window.VERBETES = window.VERBETES || []).push(

{
  id: 'sistema-proporcional-majoritario', tipo: 'conceito', titulo: 'Voto majoritário e proporcional: qual cargo usa qual',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['eleição', 'segundo turno', 'maioria', 'cadeiras', 'sistema eleitoral'],
  resumo: 'Cargos do Executivo e senador são decididos por maioria de votos; deputados e vereadores, pela divisão de cadeiras entre partidos.',
  tabela: { cab: ['Sistema', 'Cargos', 'Como o vencedor é decidido'], linhas: [
    ['Majoritário', 'Presidente, governador, prefeito, senador', 'Vence quem tem mais votos. Para presidente, governador e prefeito, é preciso mais da metade dos **votos válidos**; senão, há 2º turno entre os dois mais votados.'],
    ['Proporcional', 'Deputado federal, estadual, distrital e vereador', 'As vagas são divididas entre partidos (ou federações) em proporção aos votos; dentro de cada partido, ocupam as vagas os candidatos mais votados. Ver [[quociente-eleitoral]].']
  ] },
  secoes: [
    { t: 'Segundo turno', l: [
      'Presidente e governador: segundo turno em qualquer caso, se ninguém passar de 50% dos votos válidos.',
      'Prefeito: segundo turno **apenas em municípios com mais de 200 mil eleitores**. Nos demais, vence quem tiver mais votos (CF, art. 29, II).',
      'Senador: eleito por maioria simples, sem segundo turno.'
    ] },
    { t: 'O que são votos válidos', p: [
      'São os votos dados a candidatos e a partidos (legenda). **Votos em branco e nulos não entram no cálculo** (CF, art. 77, §2º; Lei 9.504/1997, art. 5º). Por isso é possível vencer no primeiro turno mesmo com muitos votos brancos e nulos.'
    ] },
    { t: 'Por que dois sistemas', p: [
      'O majoritário dá um vencedor para um cargo único. O proporcional busca que o Legislativo reflita a variedade de forças da sociedade, com vários partidos representados.'
    ] }
  ],
  relacionados: ['quociente-eleitoral', 'clausula-de-desempenho', 'prefeito', 'senador', 'deputado-federal', 'vereador'],
  fontes: [
    { r: 'Constituição Federal, art. 29 II, 77', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Lei 9.504/1997 (Lei das Eleições)', u: 'https://www.planalto.gov.br/ccivil_03/leis/l9504.htm' }
  ]
},

{
  id: 'quociente-eleitoral', tipo: 'processo', titulo: 'Quociente eleitoral e partidário: como as cadeiras são distribuídas',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['quociente eleitoral', 'quociente partidário', 'sobras', 'D\'Hondt', 'proporcional', 'federação'],
  resumo: 'Como os votos viram cadeiras em eleição para deputado e vereador. Inclui uma calculadora para testar números.',
  ferramenta: 'quociente',
  etapas: [
    { q: '1. Votos válidos', t: 'Soma-se todos os votos válidos da eleição (nos candidatos e nas legendas). Brancos e nulos ficam de fora.', v: '—' },
    { q: '2. Quociente eleitoral (QE)', t: 'Votos válidos ÷ número de vagas. Frações até 0,5 são desprezadas; acima de 0,5, arredonda-se para 1.', v: 'Código Eleitoral, art. 106' },
    { q: '3. Quociente partidário (QP)', t: 'Votos do partido (ou federação) ÷ QE, desprezada a fração. É o número de cadeiras que o partido ganha de início.', v: 'Código Eleitoral, art. 107' },
    { q: '4. Candidatos', t: 'Dentro de cada partido, ocupam as cadeiras os candidatos mais votados, desde que cada um tenha pelo menos **10% do QE** de votos.', v: 'Código Eleitoral, art. 108' },
    { q: '5. Sobras', t: 'As cadeiras que sobrarem são divididas pelo método da **maior média**: divide-se os votos de cada partido por (cadeiras já obtidas + 1), e a vaga vai para o partido com maior resultado, repetindo o cálculo até acabarem.', v: 'Código Eleitoral, art. 109' }
  ],
  secoes: [
    { t: 'Exemplo com números inventados', p: [
      'Um estado tem **10 vagas** e **1.000.000** de votos válidos: QE = 100.000.',
      'Partido A: 450.000 votos → QP = 4. Partido B: 300.000 → 3. Partido C: 150.000 → 1. Partido D: 100.000 → 1. Total: 9 cadeiras, sobra 1.',
      'Maiores médias: A = 450.000 ÷ 5 = 90.000; B = 300.000 ÷ 4 = 75.000; C = 150.000 ÷ 2 = 75.000; D = 100.000 ÷ 2 = 50.000. A sobra vai para o **Partido A**, que fica com 5 cadeiras.',
      'Use a calculadora acima para testar outros números.'
    ] },
    { t: 'Detalhes que mudaram nos últimos anos', l: [
      'Desde a reforma de 2021 (Lei 14.211), a distribuição das sobras era restrita a partidos que alcançassem 80% do QE e a candidatos com 20% do QE. O STF decidiu em 2024 que esses limites não valem, de modo que **todos os partidos e candidatos podem disputar as sobras**. Confira o texto e a decisão vigentes antes de usar para uma eleição específica.',
      'Os partidos podem formar **federações**, que valem como um único partido por pelo menos 4 anos (Lei 9.504/1997, art. 6º-A).',
      '**Coligações** em eleição proporcional foram proibidas desde 2020.'
    ] },
    { t: 'Efeitos que surpreendem', l: [
      'Um candidato muito votado pode "puxar" colegas menos votados do mesmo partido: o voto na legenda ou em qualquer candidato conta para o partido.',
      'Um candidato com mais votos pode ficar de fora se seu partido tiver poucos votos no total.',
      'A cadeira pertence ao partido (ou federação): a troca de partido sem justa causa pode levar à perda do mandato ([[suplente]]).'
    ] }
  ],
  porEsfera: {
    federal: 'Deputado federal: o estado (ou DF) é a circunscrição; as vagas vão de 8 a 70 por estado.',
    estadual: 'Deputado estadual: a circunscrição é o estado.',
    df: 'Deputado distrital: a circunscrição é o DF, com 24 vagas.',
    municipal: 'Vereador: a circunscrição é o município; o número de vagas depende da população.'
  },
  relacionados: ['sistema-proporcional-majoritario', 'clausula-de-desempenho', 'suplente', 'deputado-federal', 'vereador'],
  fontes: [
    { r: 'Código Eleitoral (Lei 4.737/1965), art. 106 a 109', u: 'https://www.planalto.gov.br/ccivil_03/leis/l4737compilado.htm' },
    { r: 'Lei 9.504/1997', u: 'https://www.planalto.gov.br/ccivil_03/leis/l9504.htm' },
    { r: 'TSE: sistema eleitoral', u: 'https://www.tse.jus.br' }
  ]
},

{
  id: 'clausula-de-desempenho', tipo: 'conceito', titulo: 'Cláusula de desempenho (cláusula de barreira)',
  esferas: ['federal'],
  tags: ['fundo partidário', 'propaganda gratuita', 'EC 97', 'partidos'],
  resumo: 'Regra que limita o acesso de partidos pequenos ao dinheiro público e ao tempo de propaganda no rádio e na TV.',
  tabela: { cab: ['Eleição', 'Votos válidos para deputado federal', 'Ou número de deputados federais eleitos'], linhas: [
    ['2018', '1,5%, em pelo menos 9 estados, com no mínimo 1% em cada', '9 deputados, em pelo menos 9 estados'],
    ['2022', '2%, em pelo menos 9 estados, com no mínimo 1% em cada', '11 deputados, em pelo menos 9 estados'],
    ['2026', '2,5%, em pelo menos 9 estados, com no mínimo 1,5% em cada', '13 deputados, em pelo menos 9 estados'],
    ['2030', '3%, em pelo menos 9 estados, com no mínimo 2% em cada', '15 deputados, em pelo menos 9 estados']
  ] },
  secoes: [
    { t: 'O que acontece com partido que não atinge', l: [
      'Perde o acesso ao **Fundo Partidário** (dinheiro público para manutenção) e ao **tempo de rádio e TV**.',
      'Mantém o direito de existir, de lançar candidatos e de eleger parlamentares.',
      'Partidos podem formar **federações** para somar votos e atingir a cláusula.'
    ] }
  ],
  relacionados: ['quociente-eleitoral', 'sistema-proporcional-majoritario'],
  fontes: [
    { r: 'Constituição Federal, art. 17, §3º (EC 97/2017)', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'inelegibilidade', tipo: 'processo', titulo: 'Inelegibilidade: quem não pode ser candidato e como se contesta',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['Ficha Limpa', 'impugnação', 'AIRC', 'AIJE', 'registro de candidatura', 'LC 64'],
  resumo: 'Inelegível é quem a lei impede de se candidatar. Qualquer partido, candidato ou o Ministério Público pode contestar um registro de candidatura.',
  etapas: [
    { q: 'Partido ou candidato', t: 'Pede o **registro de candidatura** na Justiça Eleitoral, até 15 de agosto do ano da eleição, juntando documentos.', v: 'Lei 9.504/1997, art. 11' },
    { q: 'Justiça Eleitoral', t: 'Publica edital com os pedidos de registro.', v: '—' },
    { q: 'Candidato, partido, coligação ou Ministério Público', t: 'Podem apresentar **impugnação** (AIRC, Ação de Impugnação de Registro de Candidatura) em até **5 dias** após o edital. Qualquer eleitor pode avisar o MP de uma causa de inelegibilidade.', v: 'LC 64/1990, art. 3º' },
    { q: 'Candidato impugnado', t: 'Tem 7 dias para contestar e apresentar provas.', v: '7 dias' },
    { q: 'Juiz ou tribunal eleitoral', t: 'Julga o pedido de registro e a impugnação. Pode haver recurso ao TRE e ao TSE; em eleições presidenciais, o TSE julga o registro.', v: 'Decisão colegiada' },
    { q: 'Resultado', t: 'Registro **deferido** (candidato pode concorrer) ou **indeferido** (não pode, ou pode concorrer com o recurso pendente, conforme o caso).', v: '—' }
  ],
  secoes: [
    { t: 'Condições de elegibilidade (para se candidatar)', l: [
      'Ser brasileiro e estar no pleno exercício dos direitos políticos.',
      'Estar alistado como eleitor e ter domicílio eleitoral na circunscrição.',
      'Estar filiado a um partido (prazo de filiação e domicílio de pelo menos 6 meses antes da eleição).',
      'Ter a idade mínima do cargo.'
    ] },
    { t: 'Causas de inelegibilidade mais citadas', l: [
      '**Analfabetos e inalistáveis** (CF, art. 14, §4º).',
      '**Reeleição ilimitada**: chefe do Executivo não pode ter terceiro mandato seguido.',
      '**Parentes**: cônjuge e parentes até o 2º grau do titular do Executivo, no mesmo território onde ele governa, com algumas exceções (art. 14, §7º).',
      '**Condenados por órgão colegiado** (tribunal de segunda instância ou superior) por determinados crimes, desde a condenação até um período após o cumprimento da pena (Ficha Limpa, LC 135/2010).',
      '**Rejeição de contas** por irregularidade insanável que configure improbidade administrativa.',
      '**Cassação de mandato** por quebra de decoro; **abuso de poder** econômico ou político reconhecido pela Justiça Eleitoral.',
      'Prazos e contagens foram alterados por mudança legislativa em 2025; confira o texto atual da LC 64/1990 antes de calcular qualquer prazo.'
    ] },
    { t: 'Inelegibilidade, cassação e perda de mandato: diferenças', l: [
      '**Inelegibilidade** impede a candidatura (ou o registro) por um período.',
      '**Cassação do registro ou do diploma** (por exemplo, por abuso de poder, via AIJE ou AIME) tira o candidato eleito do cargo e costuma gerar inelegibilidade.',
      '**Perda de mandato** é a saída do cargo durante o exercício ([[cassacao-de-parlamentar]], [[cassacao-prefeito]]).',
      '**AIJE** (Ação de Investigação Judicial Eleitoral) apura abuso de poder no processo eleitoral; **AIME** (Ação de Impugnação de Mandato Eletivo) pode ser proposta em até 15 dias após a diplomação, por abuso do poder econômico, corrupção ou fraude.'
    ] }
  ],
  porEsfera: {
    federal: 'Registro de candidatura de presidente e vice no TSE; deputados federais e senadores nos TREs.',
    estadual: 'Governador, deputado estadual e distrital: TRE.',
    df: 'TRE-DF.',
    municipal: 'Prefeito e vereador: juiz eleitoral da zona; recurso ao TRE.'
  },
  exemplo: { t: 'Dois mecanismos diferentes, dois casos', p: [
    '**2018, Luiz Inácio Lula da Silva.** Condenado em segunda instância (TRF-4), teve o registro de candidatura à Presidência **indeferido** pelo TSE, com base na Ficha Limpa (condenação por órgão colegiado), em 1/9/2018, por 6 votos a 1. Anos depois o STF anulou as condenações (2021), o que restabeleceu sua elegibilidade. O caso mostra a inelegibilidade por **condenação**.',
    '**2023, Jair Bolsonaro.** O TSE o declarou inelegível por 8 anos, em 30/6/2023, por 5 votos a 2, em AIJE por abuso de poder político e uso indevido dos meios de comunicação, em reunião com embaixadores em 2022. O caso mostra a inelegibilidade por **abuso de poder**, em uma ação eleitoral, sem condenação criminal.',
    'Os dois casos geraram debates políticos acalorados; esta página só descreve o mecanismo jurídico de cada um. Confira as decisões completas no site do TSE.'
  ] },
  relacionados: ['cassacao-de-parlamentar', 'cassacao-prefeito', 'tse', 'ministerio-publico', 'como-uma-lei-e-feita'],
  fontes: [
    { r: 'Constituição Federal, art. 14', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Lei Complementar 64/1990', u: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp64.htm' },
    { r: 'Lei Complementar 135/2010 (Ficha Limpa)', u: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp135.htm' },
    { r: 'TSE: jurisprudência e notícias', u: 'https://www.tse.jus.br' }
  ]
}

);

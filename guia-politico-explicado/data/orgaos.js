/* Órgãos e instituições. */
(window.VERBETES = window.VERBETES || []).push(

{
  id: 'congresso-nacional', tipo: 'orgao', titulo: 'Congresso Nacional',
  esferas: ['federal'],
  tags: ['bicameral', 'Câmara', 'Senado', 'sessão conjunta', 'Poder Legislativo'],
  resumo: 'O Poder Legislativo federal. É formado por duas Casas, a Câmara dos Deputados e o Senado Federal, que votam juntas ou separadas conforme o tema.',
  secoes: [
    { t: 'Composição', tabela: {
      cab: ['Casa', 'Membros', 'Representa', 'Mandato'],
      linhas: [
        ['[[camara-dos-deputados]]', '513 deputados', 'O povo, em proporção à população de cada estado', '4 anos'],
        ['[[senado-federal]]', '81 senadores (3 por estado e pelo DF)', 'Os estados e o DF, em igualdade', '8 anos']
      ] } },
    { t: 'Quando as Casas votam juntas', l: [
      'Em **sessão conjunta**, presidida pelo presidente do Senado: analisam vetos presidenciais, votam o orçamento e a LDO, e dão posse ao Presidente e ao vice.',
      'No restante, cada Casa vota separadamente e uma revisa o que a outra aprovou ([[como-uma-lei-e-feita]]).'
    ] },
    { t: 'Funções', l: [
      '**Legislar:** leis, PECs e medidas provisórias ([[pec]], [[medida-provisoria]]).',
      '**Orçar:** votar o orçamento da União ([[orcamento-publico]]).',
      '**Fiscalizar:** convocar ministros, criar CPIs, contar com o Tribunal de Contas ([[cpi]], [[tribunais-de-contas]]).',
      '**Julgar:** o Senado julga o Presidente em crime de responsabilidade; a Câmara autoriza ([[impeachment-presidente]]).'
    ] }
  ],
  relacionados: ['camara-dos-deputados', 'senado-federal', 'presidente-do-senado', 'presidente-da-camara', 'separacao-de-poderes'],
  fontes: [
    { r: 'Constituição Federal, art. 44 a 75', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Congresso Nacional', u: 'https://www.congressonacional.leg.br' }
  ]
},

{
  id: 'camara-dos-deputados', tipo: 'orgao', titulo: 'Câmara dos Deputados',
  esferas: ['federal'],
  tags: ['513 deputados', 'Mesa Diretora', 'comissões', 'plenário'],
  resumo: 'Casa do Congresso que representa o povo. Em regra, é onde os projetos de lei começam a tramitar e onde se autoriza o impeachment.',
  ficha: { 'Membros': '513 deputados', 'Mandato': '4 anos', 'Direção': 'Mesa Diretora, presidida pelo presidente da Câmara', 'Quórum de votação': 'Maioria absoluta presente (257)', 'Maioria absoluta': '257', '3/5': '308', '2/3': '342' },
  secoes: [
    { t: 'Competências privativas (CF, art. 51)', l: [
      'Autorizar, por 2/3, a instauração de processo contra o Presidente, o vice e os ministros de Estado ([[impeachment-presidente]]).',
      'Tomar as contas do Presidente quando não forem apresentadas em 60 dias.',
      'Elaborar seu regimento interno, dispor sobre sua organização e eleger a Mesa ([[presidente-da-camara]]).'
    ] },
    { t: 'Como funciona por dentro', l: [
      '**Plenário:** reúne todos os deputados para votar.',
      '**Comissões:** permanentes (por tema, como a de Constituição e Justiça) e temporárias (especiais, CPIs).',
      '**Bancadas e blocos:** deputados se organizam por partido e por blocos; os **líderes** negociam a pauta e orientam os votos.'
    ] }
  ],
  relacionados: ['deputado-federal', 'presidente-da-camara', 'congresso-nacional', 'senado-federal', 'quoruns-e-maiorias'],
  fontes: [
    { r: 'Constituição Federal, art. 45 e 51', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Câmara dos Deputados', u: 'https://www.camara.leg.br' }
  ]
},

{
  id: 'senado-federal', tipo: 'orgao', titulo: 'Senado Federal',
  esferas: ['federal'],
  tags: ['81 senadores', 'revisor', 'sabatina', 'julgamento do Presidente'],
  resumo: 'Casa do Congresso que representa os estados. Revisa as leis da Câmara, aprova nomeações de autoridades e julga o Presidente em caso de impeachment.',
  ficha: { 'Membros': '81 senadores', 'Mandato': '8 anos', 'Direção': 'Mesa do Senado, presidida pelo presidente do Senado', 'Maioria absoluta': '41', '3/5': '49', '2/3': '54' },
  secoes: [
    { t: 'Competências privativas (CF, art. 52)', l: [
      '**Processar e julgar** o Presidente, o vice, ministros de Estado e do STF, o Procurador-Geral da República, entre outros, em crimes de responsabilidade ([[impeachment-presidente]]).',
      '**Aprovar nomeações**, após sabatina: ministros do STF e de tribunais superiores, Procurador-Geral da República, diretores do Banco Central, embaixadores, ministros do TCU indicados pelo Presidente ([[ministro-do-stf]]).',
      'Fixar limites para a dívida pública da União, dos estados e dos municípios.',
      'Suspender a execução de lei declarada inconstitucional pelo STF.'
    ] }
  ],
  relacionados: ['senador', 'presidente-do-senado', 'congresso-nacional', 'camara-dos-deputados', 'stf'],
  fontes: [
    { r: 'Constituição Federal, art. 46 e 52', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Senado Federal', u: 'https://www.senado.leg.br' }
  ]
},

{
  id: 'assembleia-legislativa', tipo: 'orgao', titulo: 'Assembleia Legislativa (e Câmara Legislativa do DF)',
  esferas: ['estadual', 'df'],
  tags: ['Legislativo estadual', 'deputados estaduais', 'constituição estadual'],
  resumo: 'O Poder Legislativo do estado. Faz leis estaduais, vota o orçamento, fiscaliza o governador e emenda a constituição estadual.',
  secoes: [
    { t: 'O que faz', l: [
      'Faz **leis estaduais** e **emenda a constituição estadual** ([[federalismo]]).',
      'Vota o orçamento do estado ([[orcamento-publico]]).',
      'Fiscaliza o governador, com ajuda do Tribunal de Contas do Estado ([[tribunais-de-contas]]).',
      'Participa do julgamento do governador (cinco deputados no tribunal especial) ([[impeachment-governador]]).'
    ] },
    { t: 'Quem a compõe', p: [
      'Os [[deputado-estadual|deputados estaduais]]. No DF, a Câmara Legislativa tem 24 [[deputado-distrital|deputados distritais]] e acumula funções de Assembleia e de Câmara de Vereadores.'
    ] }
  ],
  relacionados: ['deputado-estadual', 'deputado-distrital', 'governador', 'distrito-federal'],
  fontes: [
    { r: 'Constituição Federal, art. 27 e 32', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'camara-municipal', tipo: 'orgao', titulo: 'Câmara Municipal',
  esferas: ['municipal'],
  tags: ['Legislativo municipal', 'vereadores', 'Lei Orgânica'],
  resumo: 'O Poder Legislativo do município. Faz as leis municipais, vota o orçamento da cidade, fiscaliza o prefeito e julga as contas dele.',
  secoes: [
    { t: 'O que faz', l: [
      'Faz **leis municipais** e aprova a **Lei Orgânica** do município, que funciona como a "constituição" local.',
      'Vota o orçamento, o plano diretor e as leis de uso do solo ([[orcamento-publico]]).',
      '**Fiscaliza** o prefeito e **julga suas contas** com parecer do Tribunal de Contas ([[tribunais-de-contas]]).',
      '**Cassa o prefeito** por infração político-administrativa ([[cassacao-prefeito]]).'
    ] },
    { t: 'Quem a compõe', p: [
      'Os [[vereador|vereadores]], de 9 a 55 por município. Quase todo município tem uma Câmara; o DF não tem.'
    ] }
  ],
  relacionados: ['vereador', 'prefeito', 'cassacao-prefeito', 'tribunais-de-contas'],
  fontes: [
    { r: 'Constituição Federal, art. 29 a 31', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'stf', tipo: 'orgao', titulo: 'Supremo Tribunal Federal (STF)',
  esferas: ['federal'],
  tags: ['guardião da Constituição', 'Plenário', 'Turmas', 'repercussão geral', 'súmula vinculante'],
  resumo: 'Mais alta corte do país e guardião da Constituição. Julga se leis e atos respeitam a Constituição e julga autoridades em crimes comuns.',
  ficha: { 'Membros': '11 ministros', 'Presidente': 'Eleito pelos pares, mandato de 2 anos', 'Quórum para declarar inconstitucionalidade': '6 ministros', 'Súmula vinculante': '8 ministros (2/3)' },
  secoes: [
    { t: 'Competências principais (CF, art. 102)', l: [
      '**Controle de constitucionalidade:** ADI, ADC e ADPF ([[controle-de-constitucionalidade]]).',
      '**Foro por prerrogativa de função:** crimes comuns de Presidente, vice, deputados federais, senadores, ministros de Estado e Procurador-Geral ([[foro-por-prerrogativa]]).',
      '**Recurso extraordinário:** decide questões constitucionais em última instância, com **repercussão geral** (efeito para casos iguais).',
      '**Súmula vinculante:** orientação que obriga os demais órgãos do Judiciário e a administração pública.',
      'Resolve **conflitos entre entes da Federação** e entre Poderes.'
    ] },
    { t: 'No impeachment', p: [
      'O presidente do STF **preside o julgamento do Presidente da República no Senado**, mas não vota ([[impeachment-presidente]]).'
    ] }
  ],
  relacionados: ['ministro-do-stf', 'tse', 'controle-de-constitucionalidade', 'separacao-de-poderes'],
  fontes: [
    { r: 'Constituição Federal, art. 101 a 103-B', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'STF', u: 'https://portal.stf.jus.br' }
  ]
},

{
  id: 'tse', tipo: 'orgao', titulo: 'TSE e Justiça Eleitoral',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['TSE', 'TRE', 'juiz eleitoral', 'urna eletrônica', 'calendário eleitoral'],
  resumo: 'Ramo do Judiciário que organiza as eleições, registra candidaturas, apura os votos, diploma os eleitos e julga conflitos eleitorais.',
  secoes: [
    { t: 'Estrutura', tabela: { cab: ['Órgão', 'Composição', 'Onde atua'], linhas: [
      ['TSE (Tribunal Superior Eleitoral)', '7 ministros: 3 do STF, 2 do STJ e 2 juristas nomeados pelo Presidente; presidido por um ministro do STF', 'Eleições presidenciais; instância final'],
      ['TRE (Tribunal Regional Eleitoral)', '7 juízes, um por estado e um no DF', 'Eleições estaduais, federais (deputados e senadores) e recursos de municípios'],
      ['Juízes e zonas eleitorais', 'Juiz estadual que exerce função eleitoral', 'Eleições municipais, alistamento, local de votação']
    ] } },
    { t: 'O que faz', l: [
      'Cadastra eleitores e organiza a **votação e a apuração**, inclusive com a urna eletrônica.',
      'Faz o **calendário eleitoral** e expede **resoluções** com regras para cada eleição.',
      'Julga **registro de candidatura**, inelegibilidade, abuso de poder e propaganda ([[inelegibilidade]]).',
      'Proclama os eleitos e entrega o **diploma**.',
      'Responde a consultas sobre a lei eleitoral.'
    ] }
  ],
  relacionados: ['stf', 'inelegibilidade', 'quociente-eleitoral', 'ministerio-publico'],
  fontes: [
    { r: 'Constituição Federal, art. 118 a 121', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'TSE', u: 'https://www.tse.jus.br' }
  ]
},

{
  id: 'ministerio-publico', tipo: 'orgao', titulo: 'Ministério Público',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['promotor', 'procurador', 'PGR', 'fiscal da lei', 'ação penal'],
  resumo: 'Instituição independente que defende a ordem jurídica, o regime democrático e os interesses sociais. É quem, em regra, acusa em crimes e fiscaliza as eleições.',
  secoes: [
    { t: 'O que faz', l: [
      '**Titular da ação penal pública**: oferece a denúncia criminal.',
      '**Fiscal da lei**: atua em processos civis de interesse público e em eleições (**promotor eleitoral**).',
      'Investiga e propõe **ação civil pública** (meio ambiente, consumidor, improbidade administrativa).',
      'Exerce o controle externo da atividade policial.',
      'Pode **impugnar candidaturas** e propor ações eleitorais ([[inelegibilidade]]).',
      'Recebe os relatórios de CPIs para decidir se investiga ou denuncia ([[cpi]]).'
    ] },
    { t: 'Estrutura', l: [
      '**MP da União** (MPF, MPT, MPM e MP do DF e Territórios): chefiado pelo **Procurador-Geral da República (PGR)**, nomeado pelo Presidente após aprovação do Senado, com mandato de 2 anos.',
      '**MPs dos estados**: chefiados por procuradores-gerais de Justiça, escolhidos entre lista tríplice pelo governador.',
      'Autonomia funcional e administrativa; não pertence a nenhum dos três Poderes.'
    ] }
  ],
  relacionados: ['cpi', 'inelegibilidade', 'stf', 'tse'],
  fontes: [
    { r: 'Constituição Federal, art. 127 a 130-A', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Ministério Público Federal', u: 'https://www.mpf.mp.br' }
  ]
},

{
  id: 'tribunais-de-contas', tipo: 'orgao', titulo: 'Tribunais de Contas (TCU, TCEs e TCMs)',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['TCU', 'contas públicas', 'parecer prévio', 'auditoria', 'fiscalização'],
  resumo: 'Órgãos que fiscalizam como o dinheiro público é gasto. Auxiliam o Legislativo e julgam as contas de quem administra recursos públicos.',
  secoes: [
    { t: 'Quem é quem', l: [
      '**TCU** (Tribunal de Contas da União): fiscaliza a União. Tem 9 ministros, escolhidos pelo Presidente (com aprovação do Senado) e pelo Congresso.',
      '**TCE** (Tribunal de Contas do Estado): fiscaliza o estado e, em geral, os municípios do estado. Tem 7 conselheiros.',
      '**TCM** (Tribunal de Contas do Município): existe apenas em alguns grandes municípios (como São Paulo e Rio de Janeiro).'
    ] },
    { t: 'O que fazem', l: [
      'Dão **parecer prévio** sobre as contas anuais do chefe do Executivo. A decisão final cabe ao Legislativo, mas contrariar o parecer do Tribunal de Contas sobre contas de prefeito exige 2/3 da Câmara de Vereadores (CF, art. 31, §2º).',
      '**Julgam as contas** dos demais administradores públicos e aplicam multas.',
      'Fazem **auditorias** e podem sustar atos ilegais.',
      'Rejeição de contas por irregularidade insanável pode gerar inelegibilidade ([[inelegibilidade]]).'
    ] },
    { t: 'O que costuma ser mal entendido', p: [
      'Tribunais de Contas **não são do Judiciário** e não condenam criminalmente: são órgãos de controle externo auxiliares do Legislativo. As decisões podem ser revistas pelo Judiciário.'
    ] }
  ],
  relacionados: ['cassacao-prefeito', 'orcamento-publico', 'camara-municipal', 'congresso-nacional'],
  fontes: [
    { r: 'Constituição Federal, art. 31, 70 a 75', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'TCU', u: 'https://portal.tcu.gov.br' }
  ]
}

);

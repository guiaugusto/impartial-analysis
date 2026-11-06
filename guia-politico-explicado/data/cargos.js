/* Cargos: o que faz cada pessoa eleita (ou nomeada), como assume, como perde o cargo.
   Idades mínimas (CF, art. 14, §3º, VI): 35 presidente, vice e senador; 30 governador e vice; 21 deputado, prefeito, vice-prefeito; 18 vereador. */
(window.VERBETES = window.VERBETES || []).push(

{
  id: 'presidente-da-republica', tipo: 'cargo', titulo: 'Presidente da República',
  esferas: ['federal'],
  tags: ['Executivo', 'chefe de Estado', 'chefe de governo', 'Planalto'],
  resumo: 'Chefe do Executivo federal: dirige a administração, sanciona ou veta leis, nomeia ministros e representa o país.',
  ficha: { 'Como se chega': 'Eleição direta; vence quem tiver mais da metade dos votos válidos (2º turno se necessário)', 'Mandato': '4 anos, com uma reeleição seguida', 'Idade mínima': '35 anos', 'Substituto': 'Vice-presidente; depois presidentes da Câmara, do Senado e do STF', 'Perde o cargo por': 'Impeachment, condenação criminal, renúncia, morte' },
  secoes: [
    { t: 'O que faz (CF, art. 84)', l: [
      'Chefia o governo e a administração federal; **nomeia e demite ministros de Estado**.',
      '**Sanciona ou veta** projetos aprovados pelo Congresso e promulga leis ([[como-uma-lei-e-feita]]).',
      'Edita **medidas provisórias** e decretos ([[medida-provisoria]]).',
      'Tem iniciativa privativa de leis sobre organização administrativa, servidores federais, orçamento e outras ([[orcamento-publico]]).',
      '**Indica ministros do STF**, do STJ e de outros tribunais superiores e o Procurador-Geral da República, sujeito à aprovação do Senado ([[ministro-do-stf]]).',
      'Comanda as Forças Armadas; conduz a política externa e celebra tratados (que o Congresso precisa aprovar).',
      'Concede **indulto** e comutação de penas; decreta estado de defesa e de sítio, com aprovação do Congresso.'
    ] },
    { t: 'Quem substitui', p: [
      'O vice-presidente assume em caso de impedimento ou vacância. Se os dois cargos ficarem vagos: assume o presidente da Câmara, depois o do Senado e depois o do STF (art. 80).',
      'Se a vacância ocorrer nos **dois primeiros anos** do mandato, nova eleição direta em 90 dias. Nos **dois últimos anos**, o Congresso elege indiretamente, em 30 dias (art. 81).'
    ] },
    { t: 'Responsabilização', l: [
      '**Crime de responsabilidade:** [[impeachment-presidente]] (Câmara autoriza por 2/3; Senado julga).',
      '**Crime comum:** a Câmara precisa autorizar, por 2/3, e o STF julga ([[foro-por-prerrogativa]]). Na vigência do mandato, o Presidente não pode ser responsabilizado por atos estranhos ao exercício das funções (art. 86, §4º).'
    ] }
  ],
  relacionados: ['vice', 'governador', 'prefeito', 'congresso-nacional', 'ministro-de-estado', 'impeachment-presidente'],
  fontes: [
    { r: 'Constituição Federal, art. 76 a 86', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'vice', tipo: 'cargo', titulo: 'Vice-presidente, vice-governador e vice-prefeito',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['vice', 'substituto', 'chapa'],
  resumo: 'O vice é eleito junto com o titular na mesma chapa. Substitui em ausências e assume o cargo se ele ficar vago.',
  secoes: [
    { t: 'Como funciona', l: [
      'É eleito **na mesma chapa** do presidente, governador ou prefeito, com o mesmo voto.',
      '**Substitui** o titular em viagens, licenças e impedimentos, e **sucede** em caso de vacância (morte, renúncia, cassação).',
      'Tem as funções que a lei lhe atribuir e auxilia o titular. Não tem poderes próprios.',
      'Se o titular for cassado por causa da chapa, o vice também pode perder o cargo (chapa é indivisível na Justiça Eleitoral).'
    ] },
    { t: 'Vacância dos dois cargos', p: [
      'Se vagarem titular e vice, assume o presidente da Câmara, e depois o do Senado e o do STF (no governo federal; art. 80). Nos estados e municípios, as regras estão na constituição estadual ou Lei Orgânica: costuma assumir o presidente da Assembleia ou da Câmara de Vereadores, que convoca nova eleição quando for o caso.'
    ] }
  ],
  relacionados: ['presidente-da-republica', 'governador', 'prefeito', 'presidente-da-camara'],
  fontes: [
    { r: 'Constituição Federal, art. 79 a 81 e art. 28, 29', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'governador', tipo: 'cargo', titulo: 'Governador',
  esferas: ['estadual', 'df'],
  tags: ['Executivo estadual', 'estado', 'secretários', 'polícia militar'],
  resumo: 'Chefe do Executivo do estado (ou do DF): administra, sanciona leis da Assembleia, comanda as polícias e executa o orçamento estadual.',
  ficha: { 'Como se chega': 'Eleição direta; 2º turno se ninguém tiver mais da metade dos votos válidos', 'Mandato': '4 anos, com uma reeleição seguida', 'Idade mínima': '30 anos', 'Substituto': 'Vice-governador; depois o presidente da Assembleia ou do Tribunal de Justiça, conforme a constituição estadual', 'Perde o cargo por': 'Impeachment, condenação, renúncia, morte' },
  secoes: [
    { t: 'O que faz', l: [
      'Chefia a administração estadual e **nomeia secretários**.',
      '**Sanciona ou veta** leis da Assembleia Legislativa; propõe leis e o orçamento do estado ([[orcamento-publico]]).',
      'Comanda a **Polícia Militar, a Polícia Civil e o Corpo de Bombeiros** (no DF, essas forças são mantidas pela União; o governador as comanda).',
      'Executa as políticas estaduais: saúde (junto com municípios e União), segurança, ensino médio, estradas estaduais, entre outras ([[federalismo]]).',
      'Arrecada o ICMS e define as alíquotas dentro dos limites federais.'
    ] },
    { t: 'Responsabilização', l: [
      'Crime de responsabilidade: [[impeachment-governador]] (tribunal misto).',
      'Crime comum: julgado pelo STJ ([[foro-por-prerrogativa]]).',
      'Contas: examinadas pela Assembleia, com parecer do Tribunal de Contas do Estado ([[tribunais-de-contas]]).'
    ] }
  ],
  relacionados: ['vice', 'deputado-estadual', 'deputado-distrital', 'prefeito', 'presidente-da-republica', 'distrito-federal'],
  fontes: [
    { r: 'Constituição Federal, art. 28 e 25', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'prefeito', tipo: 'cargo', titulo: 'Prefeito',
  esferas: ['municipal'],
  tags: ['Executivo municipal', 'município', 'secretários municipais'],
  resumo: 'Chefe do Executivo do município: cuida dos serviços locais, executa o orçamento e sanciona as leis da Câmara de Vereadores.',
  ficha: { 'Como se chega': 'Eleição direta; 2º turno só em municípios com mais de 200 mil eleitores', 'Mandato': '4 anos, com uma reeleição seguida', 'Idade mínima': '21 anos', 'Substituto': 'Vice-prefeito; depois o presidente da Câmara, conforme a Lei Orgânica', 'Perde o cargo por': 'Cassação pela Câmara, condenação criminal, renúncia, morte' },
  secoes: [
    { t: 'O que faz (assuntos de interesse local, CF, art. 30)', l: [
      'Administra a cidade: **transporte coletivo municipal, iluminação pública, coleta de lixo, zoneamento, trânsito local, IPTU e ISS**.',
      'Mantém, junto com o estado e a União, a **educação infantil e fundamental** e a **atenção básica de saúde** (postos de saúde).',
      '**Propõe e executa o orçamento** do município; sanciona ou veta as leis aprovadas pela Câmara ([[orcamento-publico]]).',
      'Nomeia secretários e dirige a administração municipal.',
      'Presta contas anualmente à Câmara, que julga com parecer do Tribunal de Contas ([[tribunais-de-contas]]).'
    ] },
    { t: 'Responsabilização', l: [
      'Infração político-administrativa: [[cassacao-prefeito]] (Câmara, 2/3).',
      'Crime comum e crime de responsabilidade do DL 201: julgado pelo Tribunal de Justiça ([[foro-por-prerrogativa]]).',
      'Prefeito pode ser inelegível por contas rejeitadas, entre outras causas ([[inelegibilidade]]).'
    ] }
  ],
  relacionados: ['vereador', 'camara-municipal', 'vice', 'governador', 'cassacao-prefeito', 'federalismo'],
  fontes: [
    { r: 'Constituição Federal, art. 29, 30 e 31', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Decreto-Lei 201/1967', u: 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del0201.htm' }
  ]
},

{
  id: 'vereador', tipo: 'cargo', titulo: 'Vereador',
  esferas: ['municipal'],
  tags: ['Câmara Municipal', 'Legislativo municipal', 'fiscalização', 'proporcional'],
  resumo: 'Legislador do município: faz as leis locais, aprova o orçamento da cidade e fiscaliza o prefeito.',
  ficha: { 'Como se chega': 'Eleição proporcional (quociente eleitoral)', 'Mandato': '4 anos, sem limite de reeleições', 'Idade mínima': '18 anos', 'Substituto': 'Suplente do mesmo partido ou federação', 'Perde o cargo por': 'Cassação pela Câmara, decisão da Justiça Eleitoral, faltas, renúncia' },
  secoes: [
    { t: 'O que faz', l: [
      '**Faz leis municipais** sobre assuntos de interesse local (uso do solo, transporte coletivo, tributos municipais, nomes de ruas).',
      '**Aprova o orçamento** do município (PPA, LDO e LOA), que o prefeito propõe ([[orcamento-publico]]).',
      '**Fiscaliza o prefeito**: pede informações, convoca secretários, cria CPI ([[cpi]]).',
      '**Julga as contas** do prefeito, com parecer do Tribunal de Contas (CF, art. 31).',
      '**Pode cassar o prefeito** por infração político-administrativa ([[cassacao-prefeito]]).',
      'Não executa obras nem contrata: isso é do Executivo.'
    ] },
    { t: 'Quantos vereadores e quanto ganham', l: [
      'O número é proporcional à população do município: no mínimo 9 e no máximo 55 (CF, art. 29, IV).',
      'O subsídio é fixado por lei de cada Câmara, para a legislatura seguinte, com teto entre 20% e 75% do subsídio de deputado estadual, conforme a população (art. 29, VI).'
    ] },
    { t: 'Imunidade', p: [
      'Inviolável por suas opiniões, palavras e votos **no exercício do mandato e na circunscrição do município** (art. 29, VIII). Não tem foro privilegiado na Constituição Federal ([[imunidade-parlamentar]]).'
    ] }
  ],
  relacionados: ['camara-municipal', 'prefeito', 'quociente-eleitoral', 'suplente', 'cassacao-de-parlamentar'],
  fontes: [
    { r: 'Constituição Federal, art. 29, 29-A, 30 e 31', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'deputado-estadual', tipo: 'cargo', titulo: 'Deputado estadual',
  esferas: ['estadual'],
  tags: ['Assembleia Legislativa', 'Legislativo estadual', 'proporcional'],
  resumo: 'Legislador do estado: faz leis estaduais, aprova o orçamento do estado e fiscaliza o governador.',
  ficha: { 'Como se chega': 'Eleição proporcional', 'Mandato': '4 anos, sem limite de reeleições', 'Idade mínima': '21 anos', 'Substituto': 'Suplente do mesmo partido ou federação', 'Perde o cargo por': 'Cassação pela Assembleia, decisão da Justiça Eleitoral, faltas, renúncia' },
  secoes: [
    { t: 'O que faz', l: [
      'Faz **leis estaduais** (nos temas de competência do estado) e **emendas à constituição estadual** ([[federalismo]]).',
      '**Aprova o orçamento** do estado ([[orcamento-publico]]).',
      '**Fiscaliza o governador** e o Executivo estadual; cria CPIs ([[cpi]]).',
      'Julga, junto com desembargadores, o governador em caso de impeachment ([[impeachment-governador]]).',
      'Escolhe, com o governador, os conselheiros do Tribunal de Contas do Estado ([[tribunais-de-contas]]).',
      'Pode propor leis, mas algumas matérias só o governador pode propor.'
    ] },
    { t: 'Quantos deputados e quanto ganham', l: [
      'O número é o **triplo da bancada do estado na Câmara dos Deputados** até 36; acima disso, acrescenta-se um deputado para cada deputado federal acima de 12 (CF, art. 27).',
      'O subsídio é fixado por lei da Assembleia, limitado a 75% do subsídio de deputado federal.'
    ] }
  ],
  relacionados: ['governador', 'deputado-distrital', 'deputado-federal', 'quociente-eleitoral', 'suplente', 'impeachment-governador'],
  fontes: [
    { r: 'Constituição Federal, art. 27', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'deputado-distrital', tipo: 'cargo', titulo: 'Deputado distrital',
  esferas: ['df'],
  tags: ['Câmara Legislativa', 'Distrito Federal', 'proporcional'],
  resumo: 'Legislador do Distrito Federal: faz as leis que, nos estados, ficam divididas entre Assembleia e Câmara de Vereadores.',
  ficha: { 'Como se chega': 'Eleição proporcional', 'Mandato': '4 anos, sem limite de reeleições', 'Idade mínima': '21 anos', 'Quantos': '24 deputados distritais', 'Perde o cargo por': 'Cassação pela Câmara Legislativa, decisão da Justiça Eleitoral, faltas, renúncia' },
  secoes: [
    { t: 'O que faz', l: [
      'Faz **leis distritais**: o DF acumula competências de estado e município, então o deputado distrital legisla sobre temas estaduais (por exemplo, segurança local) e municipais (uso do solo, transporte coletivo).',
      '**Aprova o orçamento** do DF e **fiscaliza o governador** do DF ([[orcamento-publico]]).',
      'Julga, em tribunal especial, o governador do DF em caso de impeachment ([[impeachment-governador]]).',
      'Aprova a indicação dos conselheiros do Tribunal de Contas do DF.'
    ] },
    { t: 'Por que 24', p: [
      'Pela regra aplicável ao DF (CF, art. 32, §3º), usa-se a regra dos deputados estaduais: o triplo da bancada federal do DF (8 deputados federais), ou seja, 24.'
    ] }
  ],
  relacionados: ['distrito-federal', 'deputado-estadual', 'governador', 'quociente-eleitoral'],
  fontes: [
    { r: 'Constituição Federal, art. 32', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'deputado-federal', tipo: 'cargo', titulo: 'Deputado federal',
  esferas: ['federal'],
  tags: ['Câmara dos Deputados', 'Congresso', 'Legislativo federal', 'proporcional'],
  resumo: 'Representa o povo do seu estado no Congresso: vota leis federais e o orçamento da União, fiscaliza o Executivo e autoriza o impeachment do Presidente.',
  ficha: { 'Como se chega': 'Eleição proporcional por estado e pelo DF', 'Mandato': '4 anos, sem limite de reeleições', 'Idade mínima': '21 anos', 'Quantos': '513 no total; mínimo de 8 e máximo de 70 por estado', 'Substituto': 'Suplente do mesmo partido ou federação', 'Perde o cargo por': 'Cassação pela Câmara, decisão da Justiça Eleitoral, faltas, condenação, renúncia' },
  secoes: [
    { t: 'O que faz', l: [
      '**Vota projetos de lei, leis complementares e PECs** ([[como-uma-lei-e-feita]], [[pec]]).',
      '**Vota o orçamento** da União e pode apresentar emendas ([[orcamento-publico]]).',
      '**Fiscaliza** o Executivo: pode convocar ministros, pedir informações e criar CPIs ([[cpi]]).',
      '**Autoriza**, por 2/3, o processo contra o Presidente, o vice e os ministros de Estado ([[impeachment-presidente]]).',
      'Escolhe a Mesa Diretora e o presidente da Câmara ([[presidente-da-camara]]).',
      'Não executa: não administra ministérios, não dirige obras e não nomeia.'
    ] },
    { t: 'Prerrogativas', l: [
      '[[imunidade-parlamentar]]: não responde por opiniões, palavras e votos.',
      '[[foro-por-prerrogativa]]: julgado pelo STF nos crimes comuns, nos termos da jurisprudência atual.'
    ] },
    { t: 'Quantos por estado', p: [
      'A distribuição é proporcional à população, com piso de 8 e teto de 70 (LC 78/1993). Isso faz estados menos populosos terem mais deputados por habitante do que São Paulo, o que é uma característica do sistema, não um erro. Os números são revistos por lei complementar.'
    ] }
  ],
  relacionados: ['camara-dos-deputados', 'senador', 'deputado-estadual', 'suplente', 'quociente-eleitoral', 'cassacao-de-parlamentar'],
  fontes: [
    { r: 'Constituição Federal, art. 45, 51 e 53 a 56', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Lei Complementar 78/1993 (número de deputados)', u: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp78.htm' }
  ]
},

{
  id: 'senador', tipo: 'cargo', titulo: 'Senador',
  esferas: ['federal'],
  tags: ['Senado Federal', 'Congresso', 'representação dos estados', 'majoritário'],
  resumo: 'Representa o estado (ou o DF) no Congresso, com mandato de 8 anos. Julga o Presidente em caso de impeachment e aprova nomeações importantes.',
  ficha: { 'Como se chega': 'Eleição majoritária (o mais votado); 3 senadores por estado e pelo DF', 'Mandato': '8 anos; a cada 4 anos renova-se 1/3 ou 2/3 do Senado', 'Idade mínima': '35 anos', 'Quantos': '81', 'Substituto': 'Um dos dois suplentes eleitos junto com o senador', 'Perde o cargo por': 'Cassação pelo Senado, decisão da Justiça Eleitoral, faltas, condenação, renúncia' },
  secoes: [
    { t: 'O que faz', l: [
      'Vota leis federais, junto com a Câmara, e é a Casa **revisora** na maior parte dos projetos ([[como-uma-lei-e-feita]]).',
      '**Julga** o Presidente e o vice, ministros de Estado e do STF, o Procurador-Geral da República e outros, em crimes de responsabilidade ([[impeachment-presidente]]).',
      '**Aprova indicações** feitas pelo Presidente, após sabatina: ministros do STF, STJ e tribunais superiores, diretores do Banco Central, Procurador-Geral da República, embaixadores ([[ministro-do-stf]]).',
      'Fixa limites da dívida pública e autoriza operações externas de crédito.',
      'Suspende a execução de lei declarada inconstitucional pelo STF.'
    ] },
    { t: 'Eleição e renovação', p: [
      'Cada estado e o DF elegem 3 senadores. A cada 4 anos a eleição alterna: numa elege-se 1 vaga por estado (27 vagas) e na outra 2 vagas por estado (54 vagas). O mandato de 8 anos dá mais continuidade à Casa.'
    ] },
    { t: 'Suplentes', p: [
      'Cada candidato a senador tem dois suplentes, eleitos na mesma chapa ([[suplente]]).'
    ] }
  ],
  relacionados: ['senado-federal', 'deputado-federal', 'suplente', 'presidente-do-senado', 'cassacao-de-parlamentar'],
  fontes: [
    { r: 'Constituição Federal, art. 46, 52 e 53 a 56', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'suplente', tipo: 'cargo', titulo: 'Suplente',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['suplência', 'vaga', 'licença', 'convocação'],
  resumo: 'Quem assume o mandato quando o titular sai ou se licencia. Funciona de modo diferente para senadores e para deputados e vereadores.',
  secoes: [
    { t: 'Senador: o suplente é eleito junto', l: [
      'Cada candidato a senador tem **dois suplentes** na chapa, que não são votados separadamente.',
      'O suplente é convocado em caso de **vaga**, de **licença superior a 120 dias** ou quando o senador assume cargo como ministro ou secretário (CF, art. 56).',
      'Se vagar a cadeira e não houver suplente, faz-se eleição para preencher a vaga se faltarem **mais de 15 meses** para o fim do mandato.'
    ] },
    { t: 'Deputado e vereador: o próximo da lista do partido', l: [
      'Suplente é o **candidato mais votado do partido (ou da federação) que não foi eleito**, na ordem de votos.',
      'Assume em caso de vaga, licença superior a 120 dias ou quando o deputado vira ministro ou secretário.',
      'Em eleição proporcional, a vaga é do partido ou da federação, não do candidato individual; por isso a mudança de partido do titular pode levar à perda do mandato por infidelidade ([[quociente-eleitoral]]).'
    ] },
    { t: 'Prefeito, governador e Presidente', p: [
      'Não têm suplente: têm [[vice]].'
    ] }
  ],
  exemplo: { t: 'Por que é importante', p: [
    'Senadores que assumem ministérios ou governos são substituídos por suplentes, e há casos em que o suplente (que nunca foi votado nominalmente) exerce o mandato por anos. Por isso conhecer os suplentes de um candidato ao Senado faz parte de escolher em quem votar.'
  ] },
  relacionados: ['senador', 'deputado-federal', 'vereador', 'quociente-eleitoral', 'cassacao-de-parlamentar'],
  fontes: [
    { r: 'Constituição Federal, art. 46 §3º e art. 56', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Código Eleitoral, art. 112', u: 'https://www.planalto.gov.br/ccivil_03/leis/l4737compilado.htm' }
  ]
},

{
  id: 'presidente-da-camara', tipo: 'cargo', titulo: 'Presidente da Câmara dos Deputados',
  esferas: ['federal'],
  tags: ['Mesa Diretora', 'pauta', 'impeachment', 'linha sucessória'],
  resumo: 'Deputado eleito pelos colegas para dirigir a Casa. Define o que será votado, recebe pedidos de impeachment e é o segundo na linha de sucessão presidencial.',
  ficha: { 'Como se chega': 'Eleito pelos 513 deputados', 'Mandato': '2 anos; não pode ser reeleito para o mesmo cargo na eleição imediatamente seguinte dentro da mesma legislatura', 'Posição na sucessão': '1º na linha, depois do vice-presidente' },
  secoes: [
    { t: 'O que faz', l: [
      '**Dirige as sessões** do plenário e a Mesa Diretora.',
      'Controla a **pauta**: decide, junto com os líderes, o que e quando será votado. Esse é o seu maior poder prático.',
      '**Recebe ou arquiva** os pedidos de impeachment do Presidente da República ([[impeachment-presidente]]).',
      'Despacha os projetos às comissões e pode submeter urgências a voto.',
      'Assume a Presidência da República se presidente e vice estiverem impedidos ([[presidente-da-republica]]).'
    ] }
  ],
  relacionados: ['camara-dos-deputados', 'presidente-do-senado', 'deputado-federal', 'impeachment-presidente'],
  fontes: [
    { r: 'Constituição Federal, art. 57 e 80', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Regimento Interno da Câmara dos Deputados', u: 'https://www.camara.leg.br' }
  ]
},

{
  id: 'presidente-do-senado', tipo: 'cargo', titulo: 'Presidente do Senado Federal (e do Congresso)',
  esferas: ['federal'],
  tags: ['Mesa do Senado', 'Congresso Nacional', 'sessão conjunta', 'linha sucessória'],
  resumo: 'Senador eleito pelos colegas para dirigir o Senado. Preside também o Congresso Nacional, inclusive as sessões conjuntas.',
  ficha: { 'Como se chega': 'Eleito pelos 81 senadores', 'Mandato': '2 anos', 'Posição na sucessão': '2º na linha, depois do presidente da Câmara' },
  secoes: [
    { t: 'O que faz', l: [
      'Dirige as sessões e a pauta do Senado.',
      '**Preside as sessões conjuntas** do Congresso, como as de análise de vetos e de votação do orçamento (CF, art. 57, §5º).',
      'Promulga a lei quando o Presidente da República não o faz no prazo de 48 horas após sanção tácita ou derrubada de veto (art. 66, §7º).',
      'Recebe e instala a **CPI** quando o requerimento reúne as assinaturas ([[cpi]]).',
      'Em casos de crime de responsabilidade, **o julgamento no Senado é presidido pelo presidente do STF**, não por ele ([[impeachment-presidente]]).',
      'Assume a Presidência da República se presidente, vice e presidente da Câmara estiverem impedidos.'
    ] }
  ],
  relacionados: ['presidente-da-camara', 'senado-federal', 'congresso-nacional', 'senador'],
  fontes: [
    { r: 'Constituição Federal, art. 57 e 80', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'ministro-do-stf', tipo: 'cargo', titulo: 'Ministro do Supremo Tribunal Federal',
  esferas: ['federal'],
  tags: ['STF', 'indicação', 'sabatina', 'Judiciário', 'aposentadoria compulsória'],
  resumo: 'Um dos 11 juízes da mais alta corte do país. É indicado pelo Presidente e aprovado pelo Senado; fica no cargo até os 75 anos.',
  ficha: { 'Como se chega': 'Indicação do Presidente, aprovação por maioria absoluta do Senado (41 votos) após sabatina', 'Requisitos': 'Entre 35 e 70 anos, notável saber jurídico e reputação ilibada', 'Mandato': 'Vitalício, até a aposentadoria compulsória aos 75 anos', 'Quantos': '11', 'Perde o cargo por': 'Impeachment pelo Senado (crime de responsabilidade), aposentadoria, renúncia' },
  secoes: [
    { t: 'O que faz', l: [
      'Julga ações de **controle de constitucionalidade** (ADI, ADC, ADPF) ([[controle-de-constitucionalidade]]).',
      'Julga em crimes comuns o Presidente, o vice, deputados federais, senadores, ministros e o Procurador-Geral ([[foro-por-prerrogativa]]).',
      'Decide habeas corpus, mandados de segurança e conflitos entre entes da Federação.',
      'O STF se divide em duas Turmas de 5 ministros e no Plenário de 11.'
    ] },
    { t: 'Equilíbrio entre os Poderes', p: [
      'O Presidente indica, o Senado aprova e o STF pode declarar inconstitucionais leis e atos de ambos. O ministro só pode ser removido por impeachment, julgado pelo Senado. O presidente do STF, eleito pelos colegas para mandato de 2 anos, também preside o julgamento de impeachment no Senado.'
    ] }
  ],
  relacionados: ['stf', 'senado-federal', 'presidente-da-republica', 'controle-de-constitucionalidade'],
  fontes: [
    { r: 'Constituição Federal, art. 101 a 103; EC 88/2015 (aposentadoria aos 75)', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'ministro-de-estado', tipo: 'cargo', titulo: 'Ministro de Estado',
  esferas: ['federal'],
  tags: ['ministério', 'nomeação', 'Executivo', 'auxiliar do Presidente'],
  resumo: 'Auxiliar direto do Presidente, nomeado e demitido livremente por ele, que dirige um ministério e executa as políticas do governo.',
  ficha: { 'Como se chega': 'Nomeado e demitido livremente pelo Presidente', 'Requisitos': 'Brasileiro, maior de 21 anos, no exercício dos direitos políticos', 'Julgado por': 'STF, nos crimes comuns; Senado, nos crimes de responsabilidade conexos com o Presidente (senão, STF)' },
  secoes: [
    { t: 'O que faz (CF, art. 87)', l: [
      'Orienta, coordena e supervisiona os órgãos do ministério.',
      'Expede **instruções e portarias** para executar leis e decretos.',
      'Apresenta ao Presidente o relatório anual do ministério.',
      'Responde a **pedidos de informação** e pode ser **convocado** pela Câmara e pelo Senado ou comissões; falta injustificada é crime de responsabilidade (art. 50).'
    ] },
    { t: 'Parlamentar que vira ministro', p: [
      'O deputado ou senador que assume ministério precisa se licenciar do mandato; o suplente assume enquanto isso ([[suplente]]).'
    ] }
  ],
  relacionados: ['presidente-da-republica', 'camara-dos-deputados', 'senado-federal', 'impeachment-presidente'],
  fontes: [
    { r: 'Constituição Federal, art. 50, 76 e 87', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
}

);

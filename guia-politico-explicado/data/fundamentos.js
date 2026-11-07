/* Fundamentos: conceitos que os outros verbetes usam.
   Marcação nos textos: [[id]] ou [[id|texto]] = link para outro verbete; **negrito**. */
(window.VERBETES = window.VERBETES || []).push(

{
  id: 'quoruns-e-maiorias', tipo: 'conceito', titulo: 'Quóruns e maiorias',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['votação', 'maioria absoluta', 'dois terços', 'três quintos', 'quórum'],
  resumo: 'Quantos votos uma decisão precisa. Quase tudo na política depende de saber qual das quatro maiorias a regra exige.',
  ferramenta: 'quorum',
  secoes: [
    { t: 'Não confundir quórum e maioria', p: [
      '**Quórum** é quantos parlamentares precisam estar presentes para a sessão votar. **Maioria** é quantos votos precisam ser a favor para a decisão passar.',
      'A regra geral (CF, art. 47): as decisões saem por **maioria dos votos, desde que esteja presente a maioria absoluta dos membros** da Casa. Ou seja, numa Câmara com 513 deputados, a votação só vale se pelo menos 257 estiverem presentes.'
    ] },
    { t: 'As quatro maiorias mais usadas', tabela: {
      cab: ['Maioria', 'Como se calcula', 'Câmara (513)', 'Senado (81)', 'Exemplos de decisões'],
      linhas: [
        ['Simples', 'Mais votos a favor do que contra, entre os presentes (com quórum)', 'depende da presença', 'depende da presença', 'Lei ordinária; maior parte das votações'],
        ['Absoluta', 'Metade mais um do total de membros, estejam presentes ou não', '257', '41', 'Lei complementar; aprovar ministro do STF e o Procurador-Geral da República no Senado; derrubar veto'],
        ['Três quintos (3/5)', '60% do total de membros', '308', '49', 'PEC (em cada turno e em cada Casa)'],
        ['Dois terços (2/3)', 'Dois terços do total de membros', '342', '54', 'Autorizar o processo de impeachment (Câmara); condenar no Senado; cassar prefeito (Câmara Municipal)']
      ] } },
    { t: 'Fração mínima para pedir algo', l: [
      '**Um terço (1/3)** dos membros: criar uma CPI (171 deputados ou 27 senadores) e propor uma PEC.',
      'Os números de cadeiras de Assembleias Legislativas, da Câmara Legislativa do DF e das Câmaras de Vereadores são outros: use a calculadora acima com o total da Casa.'
    ] },
    { t: 'Como funciona em cada esfera', p: [
      'A Constituição fixa as maiorias do Congresso. Nos estados, no DF e nos municípios, as maiorias vêm da constituição estadual, da Lei Orgânica e do regimento interno, que costumam repetir as federais "por simetria". Quando houver dúvida, vale o texto local.'
    ] },
    { t: 'O que costuma ser mal entendido', l: [
      'Maioria absoluta é calculada sobre **todos os membros**, não sobre os presentes. Se faltam muitos, atingi-la fica mais difícil.',
      'Maioria "simples" não é "metade mais um": é só ter mais votos a favor do que contra entre os presentes.',
      'Os números de cadeiras podem mudar (por exemplo, com vacância de cargos); a regra é sobre o total de membros da Casa.'
    ] }
  ],
  relacionados: ['pec', 'como-uma-lei-e-feita', 'impeachment-presidente', 'cpi', 'camara-dos-deputados', 'senado-federal'],
  fontes: [
    { r: 'Constituição Federal, art. 47 (regra geral de votação), art. 60 (PEC), art. 66 (veto), art. 51 e 52 (impeachment)', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'separacao-de-poderes', tipo: 'conceito', titulo: 'Separação de Poderes',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['executivo', 'legislativo', 'judiciário', 'freios e contrapesos'],
  resumo: 'Executivo, Legislativo e Judiciário são independentes e harmônicos entre si; cada um pode limitar o outro.',
  secoes: [
    { t: 'O que a Constituição diz', p: [
      'O art. 2º da Constituição diz que são Poderes da União, "independentes e harmônicos entre si", o Legislativo, o Executivo e o Judiciário. A separação é cláusula pétrea: não pode ser abolida nem por PEC (art. 60, §4º).'
    ] },
    { t: 'Quem faz o quê', tabela: {
      cab: ['Poder', 'Função principal', 'Federal', 'Estadual', 'Municipal'],
      linhas: [
        ['Executivo', 'Administrar, executar as leis e prestar serviços públicos', 'Presidente e ministros', 'Governador e secretários', 'Prefeito e secretários'],
        ['Legislativo', 'Fazer leis, aprovar orçamento e fiscalizar o Executivo', 'Câmara dos Deputados e Senado (Congresso)', 'Assembleia Legislativa (no DF, Câmara Legislativa)', 'Câmara de Vereadores'],
        ['Judiciário', 'Julgar conflitos e controlar se leis e atos respeitam a Constituição', 'STF, STJ, tribunais federais, TSE, entre outros', 'Tribunais de Justiça e juízes estaduais', 'Não há Judiciário municipal']
      ] } },
    { t: 'Freios e contrapesos: exemplos', l: [
      'O Presidente **veta** um projeto aprovado pelo Congresso; o Congresso pode **derrubar o veto** ([[como-uma-lei-e-feita]]).',
      'O Senado **aprova** (ou rejeita) a indicação de ministro do STF feita pelo Presidente ([[ministro-do-stf]]).',
      'O STF pode declarar uma lei **inconstitucional** ([[controle-de-constitucionalidade]]).',
      'O Legislativo pode **afastar** o chefe do Executivo por crime de responsabilidade ([[impeachment-presidente]]).',
      'O Tribunal de Contas, auxiliar do Legislativo, **fiscaliza** as contas do Executivo ([[tribunais-de-contas]]).'
    ] },
    { t: 'O que costuma ser mal entendido', l: [
      'Cada Poder também exerce funções "atípicas": o Legislativo julga (impeachment) e o Judiciário administra seus próprios tribunais. A separação não é rígida.',
      'Ministério Público e Tribunais de Contas não pertencem a nenhum dos três Poderes de forma simples; a Constituição lhes dá autonomia própria ([[ministerio-publico]]).'
    ] }
  ],
  relacionados: ['federalismo', 'hierarquia-das-normas', 'stf', 'congresso-nacional'],
  fontes: [
    { r: 'Constituição Federal, art. 2º, art. 44 a 135 (Poderes) e art. 60, §4º', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'federalismo', tipo: 'conceito', titulo: 'Federalismo e competências: União, estados, DF e municípios',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['competência', 'União', 'estados', 'municípios', 'autonomia'],
  resumo: 'O Brasil tem três níveis de governo autônomos (União, estados e municípios, mais o DF). A Constituição divide o que cada um pode legislar e executar.',
  secoes: [
    { t: 'Quem é quem', p: [
      'A República Federativa é formada pela união indissolúvel de **União, 26 estados, Distrito Federal e municípios** (CF, art. 1º e 18). Todos são autônomos: têm governo próprio, eleito, e podem legislar nos limites da Constituição.',
      'Não existe hierarquia política entre eles: o prefeito não é subordinado ao governador, e o governador não é subordinado ao Presidente. O que existe é **divisão de competências**.'
    ] },
    { t: 'Tipos de competência', l: [
      '**Privativa da União** (art. 22): só leis federais tratam de direito civil, penal, eleitoral, trânsito, energia, entre outros. A União pode delegar por lei complementar.',
      '**Comum** (art. 23): União, estados, DF e municípios cuidam juntos de saúde, educação, meio ambiente, patrimônio histórico etc.',
      '**Concorrente** (art. 24): a União edita as **normas gerais** e os estados completam (tributário, orçamento, consumo, educação, proteção ao meio ambiente etc.).',
      '**Dos municípios** (art. 30): assuntos de **interesse local**, como transporte coletivo municipal, uso do solo urbano e IPTU/ISS; completam a legislação federal e estadual no que couber.',
      '**Dos estados** (art. 25): o que a Constituição não proíbe nem reserva a outros (competência residual), como organizar a polícia estadual e a Assembleia.'
    ] },
    { t: 'Distrito Federal: caso especial', p: [
      'O DF não pode ser dividido em municípios e acumula as competências legislativas de estado e de município (art. 32, §1º). Tem governador, Câmara Legislativa (com deputados distritais) e Lei Orgânica, mas parte das suas polícias e do Judiciário é organizada e mantida pela União.'
    ] },
    { t: 'Dinheiro: quem arrecada o quê', p: [
      'Cada nível tem impostos próprios (União: imposto de renda; estados: ICMS; municípios: IPTU e ISS) e há **transferências** da União para estados e municípios (fundos de participação, FPE e FPM). Detalhes ficam para um verbete próprio.'
    ] },
    { t: 'O que costuma ser mal entendido', l: [
      'Prefeitos não "mandam" nos serviços de saúde e educação sozinhos: a Constituição os divide entre as três esferas, o que explica por que a responsabilidade por um problema é muitas vezes compartilhada.',
      'Conflito entre lei federal, estadual e municipal se resolve pela divisão de competência, não por "hierarquia": ver [[hierarquia-das-normas]].'
    ] }
  ],
  relacionados: ['separacao-de-poderes', 'hierarquia-das-normas', 'distrito-federal', 'prefeito', 'governador'],
  fontes: [
    { r: 'Constituição Federal, art. 1º, 18, 21 a 32 e 145 a 162', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'hierarquia-das-normas', tipo: 'conceito', titulo: 'Hierarquia das normas (Constituição, lei, decreto, portaria)',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['lei complementar', 'lei ordinária', 'decreto', 'medida provisória', 'resolução'],
  resumo: 'Do mais alto ao mais baixo: Constituição, leis (complementar, ordinária), decretos e atos administrativos. Norma de baixo não pode contrariar a de cima.',
  secoes: [
    { t: 'Da Constituição ao ato administrativo', tabela: {
      cab: ['Nível', 'Quem edita', 'Como é aprovada', 'Para que serve'],
      linhas: [
        ['Constituição e emendas', 'Congresso (poder constituinte derivado)', 'PEC: 3/5, dois turnos, em cada Casa', 'Regras fundamentais do Estado e dos direitos'],
        ['Lei complementar', 'Congresso', 'Maioria absoluta', 'Matérias que a Constituição exige expressamente (ex.: inelegibilidades, Ficha Limpa)'],
        ['Lei ordinária', 'Congresso, com sanção do Presidente', 'Maioria simples', 'Regra geral para o resto'],
        ['Medida provisória', 'Presidente', 'Vale logo; o Congresso precisa converter em lei', 'Relevância e urgência'],
        ['Decreto legislativo / resolução', 'Congresso ou cada Casa', 'Votação, sem sanção', 'Assuntos internos ou de competência exclusiva do Congresso'],
        ['Decreto do Executivo', 'Presidente, governador, prefeito', 'Ato do chefe do Executivo', 'Regulamentar leis; não pode criar direito nem obrigação nova'],
        ['Portaria, instrução normativa', 'Ministros, secretários, órgãos', 'Ato administrativo', 'Orientar a execução no órgão']
      ] } },
    { t: 'E os estados e municípios?', p: [
      'A constituição estadual e a Lei Orgânica municipal ocupam, em cada esfera, o lugar mais alto abaixo da Constituição Federal. Leis estaduais e municipais valem desde que respeitem a Constituição Federal e a divisão de competências ([[federalismo]]).'
    ] },
    { t: 'Tratados internacionais', p: [
      'Tratados sobre direitos humanos aprovados com o mesmo rito de uma PEC (3/5, dois turnos) têm status de emenda constitucional (CF, art. 5º, §3º). Os demais entram como lei ordinária ou, no caso dos de direitos humanos aprovados por rito comum, num nível "supralegal", segundo o STF.'
    ] },
    { t: 'O que costuma ser mal entendido', l: [
      'Decreto não substitui lei: ele regulamenta. Decreto que cria obrigação nova pode ser derrubado pelo Congresso (decreto legislativo) ou anulado pelo STF.',
      'Medida provisória tem força de lei, mas só por prazo limitado ([[medida-provisoria]]).'
    ] }
  ],
  relacionados: ['como-uma-lei-e-feita', 'pec', 'controle-de-constitucionalidade', 'federalismo'],
  fontes: [
    { r: 'Constituição Federal, art. 5º §3º, art. 59 a 69', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'distrito-federal', tipo: 'orgao', titulo: 'Distrito Federal',
  esferas: ['df'],
  tags: ['Brasília', 'governador', 'Câmara Legislativa', 'deputado distrital'],
  resumo: 'Ente federativo que não é estado nem município: não se divide em municípios e acumula as competências de estado e de município.',
  secoes: [
    { t: 'Como é organizado', l: [
      'Governa-se por **Lei Orgânica** (não por constituição estadual) e tem **governador** e **Câmara Legislativa** com 24 deputados distritais (CF, art. 32).',
      'Não tem prefeito, vereadores ou Assembleia Legislativa.',
      'Tem 3 senadores e 8 deputados federais, como os demais estados com representação mínima.',
      'Eleições seguem as mesmas regras de estados, inclusive segundo turno para governador.'
    ] },
    { t: 'O que é da União no DF', p: [
      'A União organiza e mantém o Judiciário, o Ministério Público e a Defensoria do DF, e as polícias civil, militar e o corpo de bombeiros (CF, art. 21, XIII e XIV). O governo local usa as polícias, mas a estrutura é mantida por fundo federal.'
    ] },
    { t: 'Governador e deputados distritais', p: [
      'Os crimes de responsabilidade do governador do DF seguem a Lei 7.106/1983 e o rito de julgamento por tribunal especial ([[impeachment-governador]]). O deputado distrital tem papel equivalente ao do deputado estadual ([[deputado-distrital]]).'
    ] }
  ],
  relacionados: ['deputado-distrital', 'governador', 'federalismo', 'impeachment-governador'],
  fontes: [
    { r: 'Constituição Federal, art. 32, 21 (XIII e XIV)', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Lei 7.106/1983 (crimes de responsabilidade do governador do DF)', u: 'https://www.planalto.gov.br/ccivil_03/leis/l7106.htm' }
  ]
}

);

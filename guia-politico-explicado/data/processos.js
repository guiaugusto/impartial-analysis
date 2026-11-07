/* Processos: como cada coisa funciona, passo a passo.
   etapas: { q: quem, t: o que acontece, v: votos/prazo }.  porEsfera: como muda em cada esfera. */
(window.VERBETES = window.VERBETES || []).push(

{
  id: 'como-uma-lei-e-feita', tipo: 'processo', titulo: 'Como uma lei é feita',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['projeto de lei', 'sanção', 'veto', 'iniciativa', 'tramitação'],
  resumo: 'Da ideia à lei: quem pode propor, quem vota, quem sanciona ou veta e como o veto pode ser derrubado.',
  etapas: [
    { q: 'Iniciativa', t: 'Quem pode propor: deputado, senador, comissão, Presidente da República, STF e tribunais superiores, Procurador-Geral da República e cidadãos (iniciativa popular: 1% do eleitorado, em pelo menos 5 estados, com 0,3% em cada um). Alguns temas só o Presidente pode propor (organização da administração, servidores federais, orçamento).', v: 'CF, art. 61' },
    { q: 'Casa iniciadora (em geral a Câmara)', t: 'Passa pelas comissões (a de Constituição e Justiça verifica se o projeto é constitucional) e depois vai ao plenário.', v: 'Maioria simples (lei ordinária); maioria absoluta (lei complementar)' },
    { q: 'Casa revisora (em geral o Senado)', t: 'Analisa de novo. Se aprovar sem mudanças, segue para sanção. Se mudar, volta à Casa iniciadora, que decide quais mudanças aceita. Se rejeitar, o projeto é arquivado.', v: 'Mesma maioria' },
    { q: 'Presidente da República', t: 'Tem 15 dias úteis para **sancionar** (concordar) ou **vetar**, no todo ou em parte, por considerar o projeto inconstitucional ou contrário ao interesse público. Se não responder nesse prazo, a sanção é tácita.', v: '15 dias úteis' },
    { q: 'Congresso (se houve veto)', t: 'Em sessão conjunta das duas Casas, em até 30 dias, pode **derrubar o veto**. Se derrubar, o trecho vetado volta ao texto e a lei é promulgada.', v: 'Maioria absoluta de cada Casa: 257 deputados e 41 senadores' },
    { q: 'Promulgação e publicação', t: 'A lei é promulgada (em regra, pelo Presidente) e publicada no Diário Oficial da União. Só então vale.', v: '—' }
  ],
  porEsfera: {
    federal: 'Câmara dos Deputados e Senado, com sanção ou veto do Presidente.',
    estadual: 'Assembleia Legislativa vota; o governador sanciona ou veta. Prazos e quóruns seguem a constituição estadual, em geral iguais aos federais.',
    df: 'Câmara Legislativa vota; o governador sanciona ou veta, conforme a Lei Orgânica.',
    municipal: 'Câmara de Vereadores vota; o prefeito sanciona ou veta, conforme a Lei Orgânica.'
  },
  exemplo: { t: 'Exemplo: iniciativa popular da Lei da Ficha Limpa (2010)', p: [
    'O projeto foi apresentado por organizações da sociedade civil com mais de 1,3 milhão de assinaturas, tramitou no Congresso, foi aprovado e sancionado como Lei Complementar 135/2010. É um exemplo de iniciativa popular e de lei complementar (maioria absoluta). Ver [[inelegibilidade]].'
  ] },
  erros: [
    'Veto não "mata" o projeto: o Congresso pode derrubá-lo.',
    'A sanção do Presidente não é necessária para PEC (promulgação pelas Mesas) nem para decretos legislativos e resoluções.',
    'Lei complementar e lei ordinária têm o mesmo nível prático, mas a complementar exige maioria absoluta e só vale para os temas que a Constituição reserva a ela.'
  ],
  relacionados: ['quoruns-e-maiorias', 'medida-provisoria', 'pec', 'hierarquia-das-normas', 'congresso-nacional', 'presidente-da-republica'],
  fontes: [
    { r: 'Constituição Federal, art. 59 a 69', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Câmara dos Deputados: tramitação de projetos', u: 'https://www.camara.leg.br' }
  ]
},

{
  id: 'medida-provisoria', tipo: 'processo', titulo: 'Medida provisória (MP)',
  esferas: ['federal', 'estadual'],
  tags: ['decreto', 'urgência', 'conversão em lei', 'trancamento de pauta'],
  resumo: 'Ato do Presidente com força de lei que vale desde o primeiro dia, mas precisa ser aprovado pelo Congresso para continuar valendo.',
  etapas: [
    { q: 'Presidente da República', t: 'Edita a MP em caso de **relevância e urgência**. Ela passa a valer na hora.', v: 'Assinatura do Presidente' },
    { q: 'Comissão mista e Câmara', t: 'Uma comissão com deputados e senadores dá parecer; depois a Câmara vota.', v: 'Maioria simples' },
    { q: 'Senado', t: 'Vota o texto aprovado pela Câmara.', v: 'Maioria simples' },
    { q: 'Prazo', t: 'Vale por **60 dias, prorrogáveis por mais 60**. Se não for votada, **perde a eficácia**. Depois de 45 dias sem votação, tranca a pauta da Casa em que estiver.', v: '60 + 60 dias' },
    { q: 'Presidente', t: 'Se a MP foi aprovada com mudanças, vira projeto de lei de conversão e vai para sanção ou veto.', v: '15 dias úteis' }
  ],
  secoes: [
    { t: 'O que não pode ser tema de MP', l: [
      'Nacionalidade, cidadania, direitos políticos, partidos e **direito eleitoral**; direito penal, processual penal e processual civil; organização do Judiciário e do Ministério Público; plano plurianual, diretrizes orçamentárias e orçamentos; sequestro de bens ou poupança (CF, art. 62, §1º).'
    ] }
  ],
  porEsfera: {
    federal: 'Presidente da República edita; Congresso converte em lei ou deixa caducar.',
    estadual: 'Alguns estados preveem MP do governador nas suas constituições; o STF já admitiu, desde que haja previsão na constituição estadual com regras simétricas às federais.',
    df: 'Verificar a Lei Orgânica do DF.',
    municipal: 'A Constituição Federal não prevê MP municipal; cada Lei Orgânica define o que o prefeito pode fazer por decreto.'
  },
  exemplo: { t: 'Exemplo', p: [
    'Medidas provisórias foram muito usadas para decidir rapidamente sobre temas econômicos e emergenciais (por exemplo, benefícios pagos durante a pandemia de covid-19). Para um caso específico, consulte o histórico da MP no site do Congresso (Congresso Nacional > Medidas Provisórias), que mostra datas, comissão, votos e resultado.'
  ] },
  erros: [
    'MP não é decreto comum: tem força de lei, mas só vale por prazo limitado.',
    'MP que caduca perde a eficácia, mas o Congresso deve disciplinar por decreto legislativo as relações jurídicas surgidas durante a vigência; se não o fizer, elas continuam regidas pela MP.'
  ],
  relacionados: ['como-uma-lei-e-feita', 'hierarquia-das-normas', 'presidente-da-republica', 'congresso-nacional'],
  fontes: [
    { r: 'Constituição Federal, art. 62', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'pec', tipo: 'processo', titulo: 'PEC: Proposta de Emenda à Constituição',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['emenda constitucional', 'cláusula pétrea', 'três quintos', 'dois turnos', 'Constituição'],
  resumo: 'O caminho para mudar a Constituição: exige mais votos e mais etapas que uma lei comum, e algumas partes não podem ser mudadas.',
  etapas: [
    { q: 'Proposta', t: 'Pode ser apresentada por pelo menos **1/3 dos deputados** (171) ou **1/3 dos senadores** (27), pelo **Presidente da República** ou por **mais da metade das Assembleias Legislativas** (cada uma por maioria relativa).', v: 'CF, art. 60, I a III' },
    { q: 'Comissão de Constituição e Justiça', t: 'Verifica se a proposta pode tramitar (se não fere cláusula pétrea, por exemplo).', v: 'Admissibilidade' },
    { q: 'Comissão especial', t: 'Debate o mérito, ouve especialistas e vota um parecer. O regimento da Câmara prevê prazo de até 40 sessões.', v: 'Regimento Interno' },
    { q: '1º turno na Casa iniciadora', t: 'Plenário vota. Depois de um intervalo mínimo de sessões (cinco na Câmara, pelo regimento), vota-se o 2º turno.', v: '3/5 dos membros: 308 deputados ou 49 senadores' },
    { q: '2º turno', t: 'Nova votação do mesmo texto.', v: '3/5 dos membros' },
    { q: 'Outra Casa', t: 'Repete todo o processo: dois turnos, com 3/5. Se mudar o texto, volta à Casa de origem para votar só a parte alterada.', v: '3/5 em cada turno' },
    { q: 'Promulgação', t: 'As **Mesas da Câmara e do Senado** promulgam a emenda com um número de ordem (EC 132, por exemplo). **Não há sanção nem veto do Presidente.**', v: '—' }
  ],
  secoes: [
    { t: 'O que a PEC não pode mudar (cláusulas pétreas)', l: [
      'A forma federativa de Estado.',
      'O voto direto, secreto, universal e periódico.',
      'A separação dos Poderes.',
      'Os direitos e garantias individuais (CF, art. 60, §4º). O STF decide, no controle de constitucionalidade, o que cabe nesse conceito.'
    ] },
    { t: 'Outros limites', l: [
      'A Constituição não pode ser emendada durante **intervenção federal, estado de defesa ou estado de sítio** (art. 60, §1º).',
      'Matéria rejeitada ou prejudicada não pode ser proposta de novo na **mesma sessão legislativa** (art. 60, §5º).'
    ] }
  ],
  porEsfera: {
    federal: 'Rito do art. 60 da Constituição Federal.',
    estadual: 'A constituição estadual define quem pode propor e o quórum; a maioria das constituições estaduais segue o modelo federal (por simetria).',
    df: 'A Lei Orgânica do DF define o rito de emenda; confira o quórum no texto da Lei Orgânica.',
    municipal: 'A Lei Orgânica é emendada em dois turnos, com intervalo mínimo de dez dias, e aprovação por 2/3 dos vereadores (CF, art. 29, caput, para a elaboração; as regras de emenda constam de cada Lei Orgânica).'
  },
  exemplo: { t: 'Exemplo: reforma tributária (EC 132/2023)', p: [
    'A PEC 45/2019 foi aprovada em dois turnos na Câmara em 2023, seguiu para o Senado, que fez alterações, e voltou à Câmara para votar as mudanças. Foi promulgada pelas Mesas do Congresso em 20/12/2023 como Emenda Constitucional 132. Para os votos exatos de cada turno, consulte a página da PEC no site da Câmara.'
  ] },
  erros: [
    'PEC não vai à sanção do Presidente: a promulgação é do próprio Congresso.',
    'São 3/5 dos **membros** da Casa (308 e 49), não dos presentes.',
    'Aprovar PEC não significa que ela não possa ser questionada no STF se violar cláusula pétrea.'
  ],
  relacionados: ['quoruns-e-maiorias', 'como-uma-lei-e-feita', 'hierarquia-das-normas', 'controle-de-constitucionalidade', 'congresso-nacional'],
  fontes: [
    { r: 'Constituição Federal, art. 60', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Câmara dos Deputados: tramitação da PEC 45/2019', u: 'https://www.camara.leg.br' }
  ]
},

{
  id: 'impeachment-presidente', tipo: 'processo', titulo: 'Impeachment do Presidente da República',
  esferas: ['federal'],
  tags: ['crime de responsabilidade', 'Lei 1.079', 'afastamento', 'Câmara', 'Senado'],
  resumo: 'Processo político-jurídico pelo qual o Presidente pode perder o cargo por crime de responsabilidade. A Câmara autoriza e o Senado julga.',
  etapas: [
    { q: 'Qualquer cidadão', t: 'Apresenta a **denúncia** ao presidente da Câmara dos Deputados, por escrito, com fatos e provas (Lei 1.079/1950, art. 14).', v: 'Sem número mínimo de assinaturas' },
    { q: 'Presidente da Câmara', t: 'Decide se **recebe ou arquiva** a denúncia. Se arquivar, o autor pode recorrer ao plenário.', v: 'Decisão do presidente da Câmara' },
    { q: 'Comissão especial da Câmara', t: 'Formada de modo proporcional aos partidos, analisa a denúncia, ouve a defesa e vota um parecer.', v: 'Maioria na comissão' },
    { q: 'Plenário da Câmara', t: 'Vota se **autoriza** o processo contra o Presidente.', v: '2/3 dos deputados: 342 de 513' },
    { q: 'Senado: instauração', t: 'Decide se abre o processo. Se abrir, o Presidente é **afastado por até 180 dias** (o vice assume).', v: 'Maioria simples dos senadores, segundo o entendimento do STF' },
    { q: 'Senado: julgamento', t: 'Presidido pelo **presidente do STF**. O Presidente da República pode se defender.', v: 'Condenação: 2/3 dos senadores, 54 de 81' },
    { q: 'Resultado', t: 'Se condenado, **perde o cargo** e fica **inabilitado por 8 anos** para função pública. Se não alcançar 54 votos, é absolvido e volta ao cargo.', v: 'CF, art. 52, parágrafo único' }
  ],
  secoes: [
    { t: 'O que é "crime de responsabilidade"', p: [
      'São atos do Presidente que atentam contra a Constituição, em especial contra: a existência da União; o livre exercício dos Poderes; o exercício dos direitos políticos, individuais e sociais; a segurança interna do país; a probidade na administração; a lei orçamentária; o cumprimento das leis e das decisões judiciais (CF, art. 85). A Lei 1.079/1950 lista os casos.',
      'Não é crime no sentido penal: a punição é política (perda do cargo e inabilitação). Para **crimes comuns** (como corrupção), o processo é outro: a Câmara precisa autorizar por 2/3 e o STF julga ([[foro-por-prerrogativa]]).'
    ] }
  ],
  porEsfera: {
    federal: 'Presidente e vice; ministros de Estado e comandantes das Forças Armadas nos crimes conexos com o Presidente.',
    estadual: 'Ver [[impeachment-governador]].',
    df: 'Ver [[impeachment-governador]].',
    municipal: 'Ver [[cassacao-prefeito]].'
  },
  exemplo: { t: 'Dois casos históricos', p: [
    '**1992, Fernando Collor.** A Câmara autorizou o processo em 29/9/1992 por 441 votos a 38. O Senado instaurou o processo e afastou Collor; em 29/12/1992, no dia do julgamento, ele renunciou. O Senado seguiu com o julgamento e o condenou à inabilitação por 8 anos.',
    '**2016, Dilma Rousseff.** A Câmara autorizou em 17/4/2016 por 367 votos a 137. O Senado instaurou o processo e afastou a presidente em 12/5/2016. Em 31/8/2016, o Senado a condenou por 61 votos a 20 (eram necessários 54) e, em votação separada, não aprovou a inabilitação (42 votos a favor, 36 contra, faltando votos para chegar aos 54).',
    'Os dois casos tiveram debate político e jurídico intenso sobre os fundamentos; esta página só descreve o rito. Para os argumentos de cada lado, consulte as fontes primárias (denúncia, defesa e votos no site do Senado e da Câmara).'
  ] },
  erros: [
    'O presidente da Câmara decide sozinho se recebe a denúncia; o plenário só vota depois da comissão.',
    'Dois terços na Câmara apenas **autorizam**: quem julga é o Senado.',
    'O STF não julga o mérito: preside o julgamento (por seu presidente) e decide questões de rito quando provocado.'
  ],
  relacionados: ['presidente-da-republica', 'presidente-da-camara', 'senado-federal', 'stf', 'quoruns-e-maiorias', 'impeachment-governador', 'cassacao-prefeito'],
  fontes: [
    { r: 'Constituição Federal, art. 51, I; art. 52, I e parágrafo único; art. 85 e 86', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Lei 1.079/1950 (crimes de responsabilidade)', u: 'https://www.planalto.gov.br/ccivil_03/leis/l1079.htm' },
    { r: 'Senado Federal: processos de impeachment', u: 'https://www.senado.leg.br' }
  ]
},

{
  id: 'impeachment-governador', tipo: 'processo', titulo: 'Impeachment de governador',
  esferas: ['estadual', 'df'],
  tags: ['crime de responsabilidade', 'tribunal misto', 'Assembleia Legislativa', 'Lei 1.079'],
  resumo: 'Governador perde o cargo por crime de responsabilidade em julgamento por um tribunal especial, formado por deputados estaduais e desembargadores.',
  etapas: [
    { q: 'Qualquer cidadão', t: 'Denúncia à Assembleia Legislativa (Câmara Legislativa, no DF).', v: 'Lei 1.079/1950, art. 74' },
    { q: 'Assembleia Legislativa', t: 'Analisa e vota se admite a acusação. O quórum depende da constituição estadual e do regimento.', v: 'Conferir regra do estado' },
    { q: 'Tribunal especial misto', t: 'Se admitida, o governador é julgado por um tribunal composto por **cinco deputados estaduais e cinco desembargadores**, presidido pelo presidente do Tribunal de Justiça.', v: 'Lei 1.079/1950, art. 78' },
    { q: 'Julgamento', t: 'Condenação por 2/3 dos membros do tribunal.', v: '2/3 do tribunal' },
    { q: 'Resultado', t: 'Perda do cargo e inabilitação por até 5 anos para função pública, segundo a Lei 1.079.', v: '—' }
  ],
  secoes: [
    { t: 'Quem pode legislar sobre isso', p: [
      'Pela Súmula Vinculante 46 do STF, só a **União** pode definir os crimes de responsabilidade e o rito de julgamento: um estado não pode inventar o seu. Por isso a Lei 1.079 vale para todos os estados e o DF tem lei própria federal (Lei 7.106/1983).'
    ] },
    { t: 'Crimes comuns do governador', p: [
      'Para crimes comuns (corrupção, por exemplo), o governador é julgado pelo **STJ**, sem precisar de autorização da Assembleia, segundo o STF ([[foro-por-prerrogativa]]). O STJ pode afastar o governador do cargo em decisão cautelar.'
    ] }
  ],
  porEsfera: {
    federal: 'Ver [[impeachment-presidente]].',
    estadual: 'Rito da Lei 1.079 e da constituição estadual.',
    df: 'Lei 7.106/1983 e Lei Orgânica do DF.',
    municipal: 'Ver [[cassacao-prefeito]].'
  },
  exemplo: { t: 'Exemplo: Rio de Janeiro, 2020-2021', p: [
    'O governador Wilson Witzel foi afastado do cargo por decisão do STJ em agosto de 2020 (processo criminal) e, em paralelo, respondeu ao processo de impeachment na Assembleia (Alerj). O tribunal misto o condenou em 30/4/2021, por 10 votos a 0 (cinco deputados e cinco desembargadores), com perda do cargo e inabilitação por 5 anos. O exemplo mostra os dois caminhos paralelos: o criminal (STJ) e o político (tribunal misto).'
  ] },
  erros: [
    'O impeachment de governador não é votado pela Assembleia inteira: quem julga é o tribunal misto.',
    'A inabilitação de 5 anos vem da Lei 1.079; para o Presidente, a Constituição fixa 8 anos.'
  ],
  relacionados: ['governador', 'impeachment-presidente', 'cassacao-prefeito', 'deputado-estadual', 'distrito-federal'],
  fontes: [
    { r: 'Lei 1.079/1950, art. 74 a 79', u: 'https://www.planalto.gov.br/ccivil_03/leis/l1079.htm' },
    { r: 'Lei 7.106/1983 (governador do DF)', u: 'https://www.planalto.gov.br/ccivil_03/leis/l7106.htm' },
    { r: 'STF: Súmula Vinculante 46', u: 'https://portal.stf.jus.br' }
  ]
},

{
  id: 'cassacao-prefeito', tipo: 'processo', titulo: 'Cassação de prefeito',
  esferas: ['municipal'],
  tags: ['Decreto-Lei 201', 'Câmara Municipal', 'comissão processante', 'infração político-administrativa'],
  resumo: 'A Câmara de Vereadores pode cassar o mandato do prefeito por infração político-administrativa; crimes de responsabilidade são julgados pelo Judiciário.',
  etapas: [
    { q: 'Qualquer eleitor', t: 'Apresenta denúncia escrita à Câmara Municipal, indicando a infração (DL 201/1967, art. 5º).', v: 'Denúncia escrita' },
    { q: 'Câmara Municipal', t: 'Lê a denúncia e vota se a recebe. Se receber, sorteia uma **comissão processante** de 3 vereadores.', v: 'Maioria dos presentes' },
    { q: 'Comissão processante', t: 'Notifica o prefeito, que tem 10 dias para se defender; colhe provas; dá parecer. Tem **90 dias** para concluir.', v: '90 dias' },
    { q: 'Plenário', t: 'Julgamento em sessão pública. O prefeito pode se defender.', v: '2/3 dos vereadores para cassar' },
    { q: 'Resultado', t: 'Cassado, o mandato é extinto e assume o vice-prefeito. Se absolvido, o processo é arquivado.', v: '—' }
  ],
  secoes: [
    { t: 'Duas coisas diferentes no DL 201/1967', l: [
      '**Infrações político-administrativas** (art. 4º): julgadas pela **Câmara de Vereadores**. Exemplos: impedir o exame de documentos por vereadores ou pelo Tribunal de Contas; desatender pedido de informações; retardar a publicação de leis; deixar de prestar contas; omitir-se na defesa de bens do município.',
      '**Crimes de responsabilidade** (art. 1º): como se apropriar de bens públicos ou desviar rendas. São julgados pelo **Tribunal de Justiça** e dependem de decisão judicial; a condenação definitiva tem como efeito a perda do cargo e a inabilitação por 5 anos.'
    ] },
    { t: 'Contas rejeitadas', p: [
      'Cabe à Câmara julgar as contas do prefeito, com parecer prévio do Tribunal de Contas. O parecer só deixa de prevalecer por voto de 2/3 dos vereadores (CF, art. 31, §2º). Contas rejeitadas por irregularidade insanável podem tornar o prefeito inelegível ([[inelegibilidade]]).'
    ] }
  ],
  porEsfera: {
    federal: 'Ver [[impeachment-presidente]].',
    estadual: 'Ver [[impeachment-governador]].',
    df: 'Não há prefeito no DF.',
    municipal: 'Rito do DL 201/1967, completado pela Lei Orgânica e pelo regimento da Câmara. O STF exige que o rito respeite o contraditório e a ampla defesa.'
  },
  exemplo: { t: 'Como acompanhar um caso', p: [
    'Cassações de prefeitos ocorrem com frequência em cidades de todo o país. Os documentos públicos de cada caso (denúncia, parecer da comissão, ata da sessão e resultado da votação) ficam no site da Câmara Municipal ou no Diário Oficial do município. Nesses casos, o primeiro item a conferir é o quórum registrado no resultado: 2/3 dos membros da Câmara.'
  ] },
  erros: [
    'Câmara não pode cassar por motivo qualquer: só pelas infrações da lei e depois de dar defesa ao prefeito.',
    'Cassação pela Câmara não é condenação criminal; o prefeito pode responder a processo penal separado, no Tribunal de Justiça ([[foro-por-prerrogativa]]).',
    'Cassação por Câmara pode ser anulada pela Justiça se o rito tiver sido desrespeitado.'
  ],
  relacionados: ['prefeito', 'vereador', 'camara-municipal', 'tribunais-de-contas', 'inelegibilidade', 'impeachment-presidente'],
  fontes: [
    { r: 'Decreto-Lei 201/1967', u: 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del0201.htm' },
    { r: 'Constituição Federal, art. 29 e 31', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'cassacao-de-parlamentar', tipo: 'processo', titulo: 'Perda de mandato de deputado e senador',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['quebra de decoro', 'Conselho de Ética', 'art. 55', 'cassação'],
  resumo: 'Parlamentar pode perder o mandato por quebra de decoro, faltas, condenação ou decisão da Justiça Eleitoral. Quem decide depende do motivo.',
  tabelaTopo: { cab: ['Motivo (CF, art. 55)', 'Quem decide', 'Votos'], linhas: [
    ['Incompatibilidades (aceitar cargo vedado, por exemplo) ou **quebra de decoro**', 'Plenário da Câmara ou do Senado', 'Maioria absoluta: 257 ou 41, em votação aberta'],
    ['**Condenação criminal definitiva** (sentença transitada em julgado)', 'Plenário da Casa (segundo a Constituição)', 'Maioria absoluta'],
    ['**Faltas**: mais de 1/3 das sessões ordinárias, sem justificativa', 'A Mesa da Casa declara a perda', 'Declaração da Mesa'],
    ['Perda ou suspensão de **direitos políticos**', 'A Mesa declara', 'Declaração da Mesa'],
    ['Decisão da **Justiça Eleitoral** (por exemplo, cassação por abuso de poder)', 'A Mesa declara', 'Declaração da Mesa']
  ] },
  etapas: [
    { q: 'Mesa ou partido político', t: 'Apresenta a representação contra o parlamentar ao Conselho de Ética (art. 55, §2º).', v: 'Representação' },
    { q: 'Conselho de Ética e Decoro Parlamentar', t: 'Instaura o processo, dá defesa, colhe provas e vota um parecer.', v: 'Maioria na comissão' },
    { q: 'Comissão de Constituição e Justiça (na Câmara)', t: 'Analisa recurso sobre aspectos jurídicos do processo.', v: '—' },
    { q: 'Plenário', t: 'Vota a perda do mandato.', v: 'Maioria absoluta dos membros' }
  ],
  secoes: [
    { t: 'Cassação de mandato e inelegibilidade', p: [
      'Parlamentar cassado por quebra de decoro fica **inelegível** durante o restante do mandato e pelos 8 anos seguintes ao fim da legislatura (LC 64/1990). Ver [[inelegibilidade]].'
    ] }
  ],
  porEsfera: {
    federal: 'Câmara dos Deputados e Senado Federal, com Conselho de Ética em cada uma.',
    estadual: 'Assembleia Legislativa, com regras semelhantes na constituição estadual (por simetria, art. 27, §1º).',
    df: 'Câmara Legislativa, conforme a Lei Orgânica.',
    municipal: 'Câmara de Vereadores: o rito está na Lei Orgânica e no regimento, com base no DL 201/1967. Confira o quórum local.'
  },
  exemplo: { t: 'Exemplo: Eduardo Cunha (2016)', p: [
    'O então presidente da Câmara foi cassado pelo plenário em 12/9/2016, por 450 votos a favor (eram necessários 257), por quebra de decoro parlamentar, depois de processo no Conselho de Ética. Perdeu o mandato e ficou inelegível por 8 anos após o fim da legislatura em que foi eleito.'
  ] },
  erros: [
    'Perda do mandato por decisão da Justiça Eleitoral é automática: a Mesa só declara.',
    'Votação é aberta desde 2013 (EC 76/2013).',
    'A suplência assume em seguida ([[suplente]]).'
  ],
  relacionados: ['deputado-federal', 'senador', 'vereador', 'suplente', 'imunidade-parlamentar', 'inelegibilidade'],
  fontes: [
    { r: 'Constituição Federal, art. 55 e art. 27 §1º', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Câmara dos Deputados: Conselho de Ética', u: 'https://www.camara.leg.br' }
  ]
},

{
  id: 'cpi', tipo: 'processo', titulo: 'CPI: Comissão Parlamentar de Inquérito',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['investigação', 'fato determinado', 'um terço', 'direito da minoria'],
  resumo: 'Comissão do Legislativo que investiga um fato específico. Um terço dos parlamentares basta para criá-la; ela tem poderes de investigação, mas não de punir.',
  etapas: [
    { q: 'Parlamentares', t: 'Apresentam um requerimento com assinatura de **1/3 dos membros** da Casa (171 deputados ou 27 senadores), indicando **fato determinado** e **prazo certo**.', v: 'CF, art. 58, §3º' },
    { q: 'Presidente da Casa', t: 'Lê o requerimento em plenário e instala a CPI. Com o apoio exigido, a criação é direito da minoria e não depende de maioria.', v: '—' },
    { q: 'Comissão', t: 'Ouve testemunhas e investigados, requisita documentos e pode quebrar sigilos bancário, fiscal e de dados telefônicos.', v: 'Votação dos membros' },
    { q: 'Relatório final', t: 'É votado e encaminhado ao Ministério Público e a outros órgãos para providências. A CPI não condena ninguém.', v: 'Maioria dos membros' }
  ],
  secoes: [
    { t: 'Limites: o que a CPI não pode fazer', l: [
      'Decretar prisão (só em flagrante), busca e apreensão em casa, ou interceptação telefônica: essas decisões dependem de juiz (cláusula de reserva de jurisdição).',
      'Punir ou condenar: só o Judiciário faz isso.',
      'Investigar fatos que não sejam o "fato determinado" do requerimento.'
    ] }
  ],
  porEsfera: {
    federal: 'CPI da Câmara, do Senado ou mista (CPMI, com deputados e senadores).',
    estadual: 'CPI da Assembleia Legislativa, criada por 1/3 de seus membros.',
    df: 'CPI da Câmara Legislativa.',
    municipal: 'CPI da Câmara de Vereadores, com as mesmas regras por simetria.'
  },
  exemplo: { t: 'Exemplo: CPI da Pandemia (Senado, 2021)', p: [
    'O requerimento reunia as assinaturas exigidas, mas a instalação demorou. Em abril de 2021, o STF determinou ao presidente do Senado que a instalasse, por entender que o apoio de 1/3 garante o direito de criar a comissão. A CPI foi instalada em 27/4/2021 e apresentou o relatório final em outubro de 2021. O caso mostra o direito da minoria e o papel do STF em conflitos de procedimento.'
  ] },
  erros: [
    'A CPI não precisa da maioria da Casa para existir, e a maioria também não pode simplesmente barrar a sua criação.',
    'Quebrar sigilo bancário ou fiscal é permitido para CPI; interceptar o conteúdo de telefonemas não.',
    'O relatório não é sentença: só o MP e o Judiciário podem seguir adiante.'
  ],
  relacionados: ['congresso-nacional', 'ministerio-publico', 'quoruns-e-maiorias', 'stf'],
  fontes: [
    { r: 'Constituição Federal, art. 58, §3º', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Lei 1.579/1952 (Comissões Parlamentares de Inquérito)', u: 'https://www.planalto.gov.br/ccivil_03/leis/l1579.htm' }
  ]
},

{
  id: 'orcamento-publico', tipo: 'processo', titulo: 'Orçamento público: PPA, LDO e LOA',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['PPA', 'LDO', 'LOA', 'emenda parlamentar', 'orçamento'],
  resumo: 'O governo só pode gastar o que está previsto no orçamento. Três leis se encaixam: o plano de 4 anos, as diretrizes do ano e o orçamento do ano.',
  tabela: { cab: ['Lei', 'O que define', 'Duração', 'Quem propõe'], linhas: [
    ['PPA (Plano Plurianual)', 'Programas e metas do governo', '4 anos (vale do 2º ano de um mandato ao 1º do seguinte)', 'Chefe do Executivo'],
    ['LDO (Lei de Diretrizes Orçamentárias)', 'Metas fiscais e prioridades do ano seguinte; regras para elaborar o orçamento', '1 ano', 'Chefe do Executivo'],
    ['LOA (Lei Orçamentária Anual)', 'Quanto o governo pode gastar e em quê, e quanto estima arrecadar', '1 ano', 'Chefe do Executivo']
  ] },
  etapas: [
    { q: 'Executivo', t: 'Elabora e envia o projeto de LOA ao Legislativo (no âmbito federal, até 31 de agosto).', v: 'Prazo constitucional' },
    { q: 'Comissão de orçamento', t: 'No Congresso, é a Comissão Mista de Planos, Orçamentos Públicos e Fiscalização (CMO). Deputados e senadores apresentam **emendas**.', v: '—' },
    { q: 'Congresso, em sessão conjunta', t: 'Vota o projeto.', v: 'Maioria simples' },
    { q: 'Executivo', t: 'Sanciona ou veta. Depois executa o orçamento, podendo contingenciar (segurar) gastos se a arrecadação ficar abaixo da prevista.', v: '15 dias úteis' }
  ],
  secoes: [
    { t: 'Emendas parlamentares', p: [
      'Deputados e senadores podem destinar parte do orçamento a obras e serviços. Há emendas **individuais**, de **bancada** e de **comissão**; desde 2015, parte delas é de execução obrigatória (impositivas). O regime de "emenda de relator" ficou conhecido como orçamento secreto e foi considerado inconstitucional pelo STF em 2022. O tema evolui; confira o rito atual no site da Comissão Mista de Orçamento.'
    ] }
  ],
  porEsfera: {
    federal: 'Congresso Nacional vota o PPA, a LDO e a LOA.',
    estadual: 'A Assembleia Legislativa vota as leis do estado.',
    df: 'A Câmara Legislativa vota as leis do DF.',
    municipal: 'A Câmara de Vereadores vota as leis do município; sem LOA aprovada, o prefeito não pode gastar além do previsto.'
  },
  erros: [
    'Contingenciar não é cortar de vez: o gasto está previsto e é liberado se a receita permitir.',
    'Quem propõe o orçamento é o Executivo; o Legislativo pode alterar por emendas dentro de limites.'
  ],
  relacionados: ['congresso-nacional', 'tribunais-de-contas', 'como-uma-lei-e-feita', 'deputado-federal'],
  fontes: [
    { r: 'Constituição Federal, art. 165 a 169', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
},

{
  id: 'controle-de-constitucionalidade', tipo: 'processo', titulo: 'Controle de constitucionalidade: ADI, ADC e ADPF',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['ADI', 'ADC', 'ADPF', 'STF', 'inconstitucional'],
  resumo: 'Como o STF decide se uma lei ou ato respeita a Constituição. Algumas ações só podem ser propostas por quem a Constituição lista.',
  tabela: { cab: ['Ação', 'Para que serve', 'Contra o quê'], linhas: [
    ['ADI (Ação Direta de Inconstitucionalidade)', 'Declarar que uma norma fere a Constituição', 'Lei ou ato normativo federal ou estadual'],
    ['ADC (Ação Declaratória de Constitucionalidade)', 'Confirmar que uma lei federal é constitucional, quando há decisões divergentes', 'Lei ou ato normativo federal'],
    ['ADPF (Arguição de Descumprimento de Preceito Fundamental)', 'Proteger preceitos fundamentais; cabe contra leis municipais e leis anteriores à Constituição', 'Atos do poder público em geral'],
    ['ADO (Ação Direta de Inconstitucionalidade por Omissão)', 'Cobrar que se regulamente algo que a Constituição manda regulamentar', 'Omissão do legislador']
  ] },
  secoes: [
    { t: 'Quem pode propor (CF, art. 103)', l: [
      'Presidente da República; Mesa do Senado, da Câmara, de Assembleia Legislativa ou da Câmara Legislativa do DF; governador de estado ou do DF; Procurador-Geral da República; Conselho Federal da OAB; partido político com representação no Congresso; confederação sindical ou entidade de classe de âmbito nacional.',
      'Cidadão comum e prefeito **não** podem propor ADI diretamente.'
    ] },
    { t: 'Quantos votos', l: [
      'Para declarar uma lei inconstitucional: **6 dos 11 ministros** (maioria absoluta).',
      'Para limitar os efeitos da decisão no tempo (modulação): **8 ministros** (2/3).',
      'Súmula vinculante: 8 ministros.'
    ] },
    { t: 'Efeito', p: [
      'A decisão em ADI, ADC e ADPF vale para todos (efeito *erga omnes*) e vincula os demais órgãos do Judiciário e a administração pública.'
    ] }
  ],
  porEsfera: {
    federal: 'STF julga leis federais e estaduais contra a Constituição Federal.',
    estadual: 'Os Tribunais de Justiça julgam leis estaduais e municipais contra a constituição estadual.',
    df: 'O Tribunal de Justiça do DF julga leis distritais contra a Lei Orgânica.',
    municipal: 'Leis municipais podem ser contestadas por ADPF no STF ou por representação no Tribunal de Justiça do estado.'
  },
  exemplo: { t: 'Exemplo: doação de empresas a campanhas (2015)', p: [
    'Na ADI 4650, proposta pelo Conselho Federal da OAB, o STF decidiu em setembro de 2015 que doações de empresas a campanhas eleitorais e partidos eram inconstitucionais. A decisão vale para todo o país e mudou as eleições seguintes.'
  ] },
  erros: [
    'Quem declara a inconstitucionalidade de lei federal e estadual (no controle concentrado) é só o STF; qualquer juiz pode deixar de aplicar uma lei no caso concreto (controle difuso).'
  ],
  relacionados: ['stf', 'ministro-do-stf', 'hierarquia-das-normas', 'pec', 'separacao-de-poderes'],
  fontes: [
    { r: 'Constituição Federal, art. 102 e 103', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'Lei 9.868/1999 (ADI e ADC)', u: 'https://www.planalto.gov.br/ccivil_03/leis/l9868.htm' }
  ]
},

{
  id: 'foro-por-prerrogativa', tipo: 'conceito', titulo: 'Foro por prerrogativa de função (foro privilegiado)',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['foro privilegiado', 'STF', 'STJ', 'Tribunal de Justiça', 'crime comum'],
  resumo: 'Algumas autoridades são julgadas em crimes comuns diretamente por tribunais, não por juiz de primeira instância.',
  tabela: { cab: ['Autoridade', 'Quem julga crimes comuns'], linhas: [
    ['Presidente, vice, deputados federais, senadores, ministros de Estado, Procurador-Geral', 'STF'],
    ['Governadores', 'STJ'],
    ['Deputados estaduais e distritais', 'Tribunal de Justiça (conforme a constituição estadual)'],
    ['Prefeitos', 'Tribunal de Justiça do estado'],
    ['Vereadores', 'Primeira instância (não têm foro, salvo o previsto na constituição estadual)']
  ] },
  secoes: [
    { t: 'Mudanças recentes', p: [
      'Em 2018 (AP 937), o STF restringiu o foro de deputados e senadores a crimes cometidos durante o mandato e relacionados ao cargo. O entendimento foi revisto mais de uma vez nos anos seguintes. Confira o entendimento atual do STF.'
    ] },
    { t: 'Crimes de responsabilidade são diferentes', p: [
      'Foro é para crimes comuns. Crimes de responsabilidade têm outro julgamento: [[impeachment-presidente]], [[impeachment-governador]], [[cassacao-prefeito]].'
    ] }
  ],
  relacionados: ['stf', 'imunidade-parlamentar', 'governador', 'prefeito', 'deputado-federal'],
  fontes: [
    { r: 'Constituição Federal, art. 29, X; art. 102, I, b e c; art. 105, I, a', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
    { r: 'STF: Questão de Ordem na Ação Penal 937', u: 'https://portal.stf.jus.br' }
  ]
},

{
  id: 'imunidade-parlamentar', tipo: 'conceito', titulo: 'Imunidade parlamentar',
  esferas: ['federal', 'estadual', 'df', 'municipal'],
  tags: ['inviolabilidade', 'prisão em flagrante', 'art. 53', 'prerrogativa'],
  resumo: 'Proteção dada ao mandato, não à pessoa: parlamentar não responde por opiniões, palavras e votos e só pode ser preso em flagrante de crime inafiançável.',
  secoes: [
    { t: 'Imunidade material (inviolabilidade)', p: [
      'Deputados e senadores são **invioláveis, civil e penalmente, por quaisquer de suas opiniões, palavras e votos** (CF, art. 53). O STF entende que a proteção cobre manifestações ligadas ao exercício do mandato.'
    ] },
    { t: 'Imunidade formal', l: [
      '**Prisão:** só em flagrante de crime inafiançável. A Casa tem 24 horas para decidir, por maioria dos membros, se mantém a prisão.',
      '**Processo:** o STF pode receber a denúncia contra o parlamentar sem autorização prévia, mas a Casa pode, por maioria absoluta e por iniciativa de partido, **sustar o andamento** da ação por crime ocorrido depois da diplomação (art. 53, §3º a §5º).'
    ] },
    { t: 'Em cada esfera', l: [
      '**Deputados estaduais e distritais:** as mesmas regras, por simetria (art. 27, §1º).',
      '**Vereadores:** só a inviolabilidade por opiniões, palavras e votos, e apenas no município (art. 29, VIII). Não têm imunidade formal.'
    ] }
  ],
  exemplo: { t: 'Exemplo: prisão em flagrante de deputado (2021)', p: [
    'Em fevereiro de 2021, o STF mandou prender em flagrante um deputado federal por declarações. A Constituição exigia que a Câmara decidisse sobre a manutenção da prisão, e o plenário votou para mantê-la. O caso mostra a regra do art. 53, §2º, e o debate sobre os limites da inviolabilidade de opiniões.'
  ] },
  relacionados: ['cassacao-de-parlamentar', 'foro-por-prerrogativa', 'deputado-federal', 'senador', 'vereador'],
  fontes: [
    { r: 'Constituição Federal, art. 53, 27 §1º e 29 VIII', u: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' }
  ]
}

);

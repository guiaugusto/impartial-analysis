(function () {
  'use strict';

  var ANOS = [2022, 2018];
  var TURNOS = [['todos', 'Os dois'], ['1', '1º turno'], ['2', '2º turno']];
  var estado = { ano: 2022, turno: 'todos', ordem: 'cf' };
  var cache = {};
  var oficial = null;

  var nf0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  var nf1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var nf2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function brl(v) {
    var a = Math.abs(v);
    if (a >= 1e9) return 'R$ ' + nf2.format(v / 1e9) + ' bi';
    if (a >= 1e6) return 'R$ ' + nf1.format(v / 1e6) + ' mi';
    if (a >= 1e3) return 'R$ ' + nf0.format(v / 1e3) + ' mil';
    return 'R$ ' + nf0.format(v);
  }
  function cheio(v) { return 'R$ ' + nf2.format(v); }

  function el(tag, attrs, filhos) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'texto') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    (filhos || []).forEach(function (f) { e.appendChild(typeof f === 'string' ? document.createTextNode(f) : f); });
    return e;
  }
  function $(id) { return document.getElementById(id); }
  function slug(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]/g, '').toUpperCase(); }
  function mostrarErro(msg) { var e = $('erro'); e.textContent = msg; e.hidden = false; }

  function json(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error(url + ' (' + r.status + ')'); return r.json(); });
  }
  function carregar(ano) {
    if (cache[ano]) return Promise.resolve(cache[ano]);
    return Promise.all([json('data/candidatos-' + ano + '.json'), json('data/orgaos-' + ano + '.json')]).then(function (r) {
      cache[ano] = { c: r[0], o: r[1] }; return cache[ano];
    });
  }

  function passaTurno(t) { return estado.turno === 'todos' || t === estado.turno; }

  function porPartido(d) {
    var m = {};
    function get(p) { return m[p] || (m[p] = { partido: p, cf: 0, cp: 0, co: 0, pf: 0, pp: 0, rep: 0 }); }
    d.c.despesas.forEach(function (x) {
      if (!passaTurno(x.turno)) return;
      var r = get(x.partido);
      if (x.tipo === 'repasse') return;
      if (x.fonte === 'fefc') r.cf += x.pago; else if (x.fonte === 'fp') r.cp += x.pago; else r.co += x.pago;
    });
    d.o.despesas.forEach(function (x) {
      var r = get(x.partido);
      if (x.tipo === 'repasse') { if (x.fonte === 'fefc' || x.fonte === 'fp') r.rep += x.pago; }
      else if (x.fonte === 'fefc') r.pf += x.pago; else if (x.fonte === 'fp') r.pp += x.pago;
    });
    return Object.keys(m).map(function (k) { return m[k]; });
  }

  function metrica(rotulo, valor, detalhe, cor, extra) {
    var forte = el('strong', { texto: brl(valor), title: cheio(valor) });
    if (cor) forte.className = cor;
    var f = [el('span', { texto: rotulo }), forte, el('small', { texto: detalhe })];
    if (extra) f.push(extra);
    return el('div', { 'class': 'metrica' }, f);
  }

  function renderResumo(d, linhas) {
    var soma = function (k) { return linhas.reduce(function (a, r) { return a + r[k]; }, 0); };
    var box = $('metricas'); box.textContent = '';
    box.appendChild(metrica('Candidaturas: Fundo Eleitoral pago', soma('cf'), 'gasto próprio, ' + (estado.turno === 'todos' ? 'dois turnos' : estado.turno + 'º turno'), 'c-azul'));
    box.appendChild(metrica('Candidaturas: Fundo Partidário pago', soma('cp'), 'gasto próprio, ' + (estado.turno === 'todos' ? 'dois turnos' : estado.turno + 'º turno'), 'c-laranja'));
    box.appendChild(metrica('Partidos: Fundo Eleitoral + Partidário pagos', soma('pf') + soma('pp'), 'gasto próprio dos partidos, sem repasses', 'c-verde'));
    box.appendChild(metrica('Repasses dos partidos', soma('rep'), 'enviados a candidaturas e outros partidos', null));
    var of = oficial && oficial[estado.ano];
    if (of) {
      var link = el('a', { href: of.fontes[0].url, target: '_blank', rel: 'noopener noreferrer', texto: 'TSE: montante do fundo' });
      var cartao = metrica('Total oficial do Fundo Eleitoral', of.fefc_total, 'disponibilizado aos partidos no ano', null, link);
      cartao.firstChild.appendChild(el('span', { 'class': 'selo', texto: 'a conferir' }));
      box.appendChild(cartao);
    }
  }

  function celula(v) { return el('td', { 'class': 'num', title: cheio(v), texto: v ? brl(v) : '–' }); }

  function renderTabela(d, linhas) {
    var k = estado.ordem;
    linhas = linhas.filter(function (r) { return r.cf + r.cp + r.co + r.pf + r.pp + r.rep > 0; });
    linhas.sort(function (a, b) { return k === 'nome' ? a.partido.localeCompare(b.partido, 'pt-BR') : b[k] - a[k]; });
    var corpo = $('corpo'); corpo.textContent = '';
    linhas.forEach(function (r) {
      var btn = el('button', { type: 'button', 'class': 'btn link', 'aria-label': 'Detalhes de ' + r.partido, texto: 'Detalhes' });
      btn.addEventListener('click', function () { abrirDetalhe(r.partido, btn); });
      corpo.appendChild(el('tr', null, [
        el('th', { scope: 'row', texto: r.partido }),
        celula(r.cf), celula(r.cp), celula(r.pf), celula(r.pp), celula(r.rep),
        el('td', null, [btn])
      ]));
    });
  }

  function renderLimites(d) {
    var ul = $('limites'); ul.textContent = '';
    var mc = d.c.meta, mo = d.o.meta;
    var of = oficial && oficial[estado.ano];
    var recFefc = d.c.receitas.reduce(function (a, x) { return a + (x.fonte === 'fefc' ? x.recebido : 0); }, 0);
    var itens = [
      'Fonte única: contas declaradas por partidos e candidaturas ao TSE. Erros, omissões e retificações posteriores não são corrigidos aqui. Dados lidos em ' + nf0.format(mc.linhas_despesas_pagas) + ' despesas pagas de ' + nf0.format(mc.candidaturas_com_receita) + ' candidaturas e ' + nf0.format(mo.linhas_despesas_pagas) + ' despesas pagas de ' + nf0.format(mo.orgaos_com_receita) + ' órgãos partidários (' + estado.ano + ').',
      'Fundo Eleitoral (FEFC) e Fundo Partidário são fundos diferentes, com regras e finalidades diferentes. O FEFC existe desde 2018 e financia campanhas; o Fundo Partidário é anual e mantém os partidos. Por isso são mostrados em colunas separadas e não somados.',
      'O dinheiro passa de mão em mão: o diretório nacional repassa a estaduais e municipais, os partidos repassam a candidaturas, e candidaturas repassam a outras. Por isso a coluna “Repasses” soma etapas da mesma cadeia e pode superar o total do fundo. Para não contar duas vezes, a tabela separa “gasto próprio” de “repasses”. Mesmo assim, os totais devem ser lidos como declarados, não como saldo do fundo.',
      'O turno vem do campo informado pelo TSE em cada prestação de contas de candidatura. Ele indica a qual turno a prestação se refere, não necessariamente o dia em que o dinheiro foi gasto. Os órgãos partidários não têm esse campo.',
      'Comparar partidos pelo valor absoluto não mede eficiência nem resultado: o tamanho do fundo depende da representação do partido no Congresso, e o número de candidaturas varia muito. Gastar mais ou menos não prova que algo foi bem ou mal feito.',
      'Parte das despesas de campanha usa “Outros recursos” (doações privadas, recursos próprios), que não aparece nas colunas de fundos. Há também receitas e despesas sem fonte informada no arquivo do TSE.',
      'Não localizei o total anual oficial do Fundo Partidário por partido em fonte que eu conseguisse ler. Por isso ele não aparece na página. O total do Fundo Eleitoral acima é “a conferir”: foi lido no resumo de uma busca, porque o site do TSE bloqueou a leitura automática (erro 403).',
      'Eleições municipais (2020 e 2024) e a de 2026 não estão incluídas. A prestação de contas de 2026 ainda não foi concluída.'
    ];
    if (of) {
      var cmp = recFefc > of.fefc_total ? 'acima' : 'abaixo';
      itens.splice(3, 0, 'Exemplo da dupla contagem: em ' + estado.ano + ', a soma das receitas de FEFC declaradas pelas candidaturas foi ' + cheio(recFefc) + ', ' + cmp + ' do total oficial lido (' + cheio(of.fefc_total) + '). Quando a soma passa do total, parte do dinheiro foi contada mais de uma vez por causa de repasses. Por isso a página usa o valor pago, separado em gasto próprio e repasses.');
    }
    itens.forEach(function (t) { ul.appendChild(el('li', { texto: t })); });
  }

  function renderFontes() {
    var ul = $('lista-fontes'); ul.textContent = '';
    function item(titulo, url, tipo, nota) {
      var li = el('li', null, [el('span', { 'class': 'fonte-tipo', texto: tipo }), el('a', { href: url, target: '_blank', rel: 'noopener noreferrer', texto: titulo })]);
      if (nota) li.appendChild(document.createTextNode(' ' + nota));
      ul.appendChild(li);
    }
    item('DivulgaCandContas (TSE): consulta de contas por candidatura e partido', 'https://divulgacandcontas.tse.jus.br/divulga/#/home', 'oficial', 'Use para conferir qualquer valor desta página. Busque pelo nome, cargo e UF.');
    item('TSE: distribuição dos recursos do FEFC, Eleições 2026', 'https://www.tse.jus.br/eleicoes/eleicoes-2026-content/prestacao-de-contas/distribuicao-dos-recursos-do-fundo-especial-de-financiamento-de-campanha-fefc-eleicoes-2026', 'oficial', 'Página do ciclo atual, com a distribuição do fundo por partido.');
    Object.keys(oficial || {}).sort().forEach(function (a) {
      oficial[a].fontes.forEach(function (f) { item(f.titulo, f.url, f.tipo, '(consultado em 06/11/2026; total lido só no resumo da busca)'); });
    });
    item('TSE, dados abertos: prestação de contas de candidatos 2018 (zip, 306 MB)', 'https://cdn.tse.jus.br/estatistica/sead/odsele/prestacao_contas/prestacao_de_contas_eleitorais_candidatos_2018.zip', 'oficial');
    item('TSE, dados abertos: prestação de contas de candidatos 2022 (zip, 495 MB)', 'https://cdn.tse.jus.br/estatistica/sead/odsele/prestacao_contas/prestacao_de_contas_eleitorais_candidatos_2022.zip', 'oficial');
    item('TSE, dados abertos: órgãos partidários 2018 (zip, 24 MB)', 'https://cdn.tse.jus.br/estatistica/sead/odsele/prestacao_contas/prestacao_de_contas_eleitorais_orgaos_partidarios_2018.zip', 'oficial');
    item('TSE, dados abertos: órgãos partidários 2022 (zip, 21 MB)', 'https://cdn.tse.jus.br/estatistica/sead/odsele/prestacao_contas/prestacao_de_contas_eleitorais_orgaos_partidarios_2022.zip', 'oficial');
  }

  function tabelaSimples(cabecalho, linhas) {
    var t = el('table', { style: 'min-width:0' });
    t.appendChild(el('thead', null, [el('tr', null, cabecalho.map(function (h, i) { return el('th', { scope: 'col', 'class': i ? 'num' : '', texto: h }); }))]));
    var tb = el('tbody');
    linhas.forEach(function (l) { tb.appendChild(el('tr', null, l.map(function (c, i) { return i ? celula(c) : el('th', { scope: 'row', texto: c }); }))); });
    t.appendChild(tb);
    return el('div', { 'class': 'tabela-wrap' }, [t]);
  }

  function abrirDetalhe(partido, origem) {
    var d = cache[estado.ano];
    var dlg = $('dlg'); var corpo = $('dlg-corpo');
    $('dlg-titulo').textContent = partido + ' · ' + estado.ano + (estado.turno === 'todos' ? '' : ' · ' + estado.turno + 'º turno');
    corpo.textContent = '';

    var cargos = {};
    d.c.despesas.forEach(function (x) {
      if (x.partido !== partido || !passaTurno(x.turno) || x.tipo === 'repasse') return;
      var c = cargos[x.cargo] || (cargos[x.cargo] = { fefc: 0, fp: 0, outros: 0 });
      if (x.fonte === 'fefc') c.fefc += x.pago; else if (x.fonte === 'fp') c.fp += x.pago; else c.outros += x.pago;
    });
    var linhasCargo = Object.keys(cargos).map(function (k) { return [k, cargos[k].fefc, cargos[k].fp, cargos[k].outros]; })
      .sort(function (a, b) { return (b[1] + b[2]) - (a[1] + a[2]); });
    corpo.appendChild(el('h3', { texto: 'Gasto próprio das candidaturas, por cargo' }));
    corpo.appendChild(linhasCargo.length ? tabelaSimples(['Cargo', 'Fundo Eleitoral', 'Fundo Partidário', 'Outros recursos'], linhasCargo) : el('p', { 'class': 'dica', texto: 'Sem despesas neste recorte.' }));

    corpo.appendChild(el('h3', { texto: 'Candidaturas que mais pagaram com os fundos' }));
    var area = el('div', null, [el('p', { 'class': 'dica', texto: 'Carregando…' })]);
    corpo.appendChild(area);
    corpo.appendChild(el('p', { 'class': 'dica', texto: 'Valores pagos pela própria candidatura, não o quanto o partido repassou a ela. Para conferir, busque o nome, cargo e UF no DivulgaCandContas (link em Fontes).' }));

    dlg.showModal();
    dlg._origem = origem;

    json('data/candidatos/' + estado.ano + '/' + slug(partido) + '.json').then(function (lista) {
      var mapa = {};
      lista.forEach(function (x) {
        if (!passaTurno(x.turno)) return;
        var k = [x.numero, x.uf, x.cargo, x.nome].join('|');
        var o = mapa[k] || (mapa[k] = { nome: x.nome, numero: x.numero, uf: x.uf, cargo: x.cargo, fefc: 0, fp: 0 });
        o.fefc += x.fefc; o.fp += x.fp;
      });
      var itens = Object.keys(mapa).map(function (k) { return mapa[k]; }).filter(function (x) { return x.fefc + x.fp > 0; })
        .sort(function (a, b) { return (b.fefc + b.fp) - (a.fefc + a.fp); });
      area.textContent = '';
      var pos = 0;
      var botao = el('button', { type: 'button', 'class': 'btn', texto: 'Mostrar mais' });
      function mais() {
        itens.slice(pos, pos + 15).forEach(function (x) {
          area.insertBefore(el('div', { 'class': 'cand' }, [
            el('div', null, [el('b', { texto: x.nome }), el('small', { texto: x.cargo + ' · ' + x.uf + ' · nº ' + x.numero })]),
            el('div', { 'class': 'vals', title: 'Fundo Eleitoral ' + cheio(x.fefc) + '; Fundo Partidário ' + cheio(x.fp) }, [
              el('div', { texto: 'FEFC ' + brl(x.fefc) }), el('small', { texto: 'FP ' + brl(x.fp) })])
          ]), botao);
        });
        pos += 15;
        if (pos >= itens.length) botao.hidden = true;
      }
      if (!itens.length) { area.appendChild(el('p', { 'class': 'dica', texto: 'Nenhuma candidatura com pagamento dos fundos neste recorte.' })); return; }
      area.appendChild(botao);
      botao.addEventListener('click', mais);
      mais();
    }).catch(function () { area.textContent = ''; area.appendChild(el('p', { 'class': 'aviso', texto: 'Não foi possível carregar a lista de candidaturas.' })); });
  }

  function botoes(id, opcoes, atual, aoEscolher) {
    var box = $(id); box.textContent = '';
    opcoes.forEach(function (o) {
      var b = el('button', { type: 'button', 'class': 'chip', 'aria-pressed': String(String(o[0]) === String(atual)), texto: o[1] });
      b.addEventListener('click', function () { aoEscolher(o[0]); });
      box.appendChild(b);
    });
  }

  function render() {
    botoes('anos', ANOS.map(function (a) { return [a, String(a)]; }), estado.ano, function (a) { estado.ano = a; render(); });
    botoes('turnos', TURNOS, estado.turno, function (t) { estado.turno = t; render(); });
    carregar(estado.ano).then(function (d) {
      var linhas = porPartido(d);
      renderResumo(d, linhas);
      renderTabela(d, linhas);
      renderLimites(d);
    }).catch(function (e) { mostrarErro('Não foi possível carregar os dados (' + e.message + '). Tente recarregar a página.'); });
  }

  $('ordem').addEventListener('change', function (e) { estado.ordem = e.target.value; render(); });
  $('dlg-fechar').addEventListener('click', function () { $('dlg').close(); });
  $('dlg').addEventListener('close', function () { var o = $('dlg')._origem; if (o && document.contains(o)) o.focus(); });
  $('dlg').addEventListener('click', function (e) { if (e.target === $('dlg')) $('dlg').close(); });

  json('data/oficial.json').catch(function () { return null; }).then(function (o) {
    oficial = o; renderFontes(); render();
  });
})();

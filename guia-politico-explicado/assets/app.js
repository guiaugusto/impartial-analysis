(function () {
  'use strict';
  var V = window.VERBETES || [], T = window.TRILHAS || [];
  var META = { redigido: '06/11/2026' };
  var TIPOS = { processo: 'Processo', cargo: 'Cargo', orgao: 'Órgão', conceito: 'Conceito' };
  var TIPOS_PLURAL = { processo: 'Processos', cargo: 'Cargos', orgao: 'Órgãos e instituições', conceito: 'Conceitos' };
  var ESFERAS = { federal: 'Federal (país)', estadual: 'Estadual', df: 'Distrito Federal', municipal: 'Municipal' };
  var ESF_CURTO = { federal: 'Federal', estadual: 'Estadual', df: 'DF', municipal: 'Municipal' };
  var app = document.getElementById('app');
  var porId = {};
  V.forEach(function (v) { porId[v.id] = v; });

  /* ---------- utilidades ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function fmt(s) {
    var t = esc(s);
    t = t.replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, function (m, id, txt) {
      var v = porId[id];
      if (!v) return '<span class="quebrado" title="verbete ainda não escrito">' + (txt || id) + '</span>';
      return '<a href="#/v/' + id + '">' + (txt || esc(v.titulo)) + '</a>';
    });
    t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
    return t;
  }
  function h(tag, cls, html) { return '<' + tag + (cls ? ' class="' + cls + '"' : '') + '>' + html + '</' + tag + '>'; }
  function lista(arr) { return '<ul>' + arr.map(function (i) { return h('li', '', fmt(i)); }).join('') + '</ul>'; }
  function tabela(t) {
    return '<div class="tabela-wrap"><table><thead><tr>' + t.cab.map(function (c) { return '<th>' + fmt(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      t.linhas.map(function (l) { return '<tr>' + l.map(function (c, i) { return '<td' + (i === 0 ? ' class="c1"' : '') + '>' + fmt(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function chipsEsfera(v) { return (v.esferas || []).map(function (e) { return '<span class="selo esf-' + e + '">' + ESF_CURTO[e] + '</span>'; }).join(''); }

  /* inversos: quem cita cada verbete */
  var citadoPor = {};
  V.forEach(function (v) {
    var alvo = {};
    (v.relacionados || []).forEach(function (r) { alvo[r] = 1; });
    var re = /\[\[([a-z0-9-]+)/g, m, txt = JSON.stringify(v);
    while ((m = re.exec(txt))) alvo[m[1]] = 1;
    Object.keys(alvo).forEach(function (id) { if (id !== v.id) (citadoPor[id] = citadoPor[id] || []).push(v.id); });
  });

  /* ---------- ferramentas ---------- */
  function ferramentaQuorum(el) {
    el.innerHTML = '<h2>Calculadora de maiorias</h2>' +
      '<p class="muted">Digite o total de membros da casa (por exemplo, o número de vereadores da sua cidade).</p>' +
      '<div class="chips"><button type="button" class="chip" data-n="513">Câmara dos Deputados (513)</button><button type="button" class="chip" data-n="81">Senado (81)</button>' +
      '<label class="campo">Membros <input id="q-n" type="number" min="1" max="1000" value="513" inputmode="numeric"></label></div>' +
      '<div id="q-res" class="resultados"></div>';
    var inp = el.querySelector('#q-n');
    function calc() {
      var n = Math.max(1, parseInt(inp.value, 10) || 0);
      var itens = [
        ['Um terço (pedir CPI, propor PEC)', Math.ceil(n / 3)],
        ['Maioria absoluta', Math.floor(n / 2) + 1],
        ['Três quintos (PEC)', Math.ceil(3 * n / 5)],
        ['Dois terços (impeachment, cassação de prefeito)', Math.ceil(2 * n / 3)]
      ];
      el.querySelector('#q-res').innerHTML = itens.map(function (i) { return '<div class="res"><span>' + i[0] + '</span><strong>' + i[1] + '</strong><small>de ' + n + '</small></div>'; }).join('');
    }
    inp.addEventListener('input', calc);
    el.querySelectorAll('.chip').forEach(function (b) { b.addEventListener('click', function () { inp.value = b.getAttribute('data-n'); calc(); }); });
    calc();
  }

  function ferramentaQuociente(el) {
    var linhas = [['Partido A', 450000], ['Partido B', 300000], ['Partido C', 150000], ['Partido D', 100000]];
    el.innerHTML = '<h2>Calculadora de quociente eleitoral</h2>' +
      '<p class="muted">Números inventados para treinar. Altere os votos e as vagas; o cálculo não considera a regra dos 10% do quociente para candidatos nem a cláusula de desempenho.</p>' +
      '<label class="campo">Vagas em disputa <input id="qe-vagas" type="number" min="1" max="100" value="10" inputmode="numeric"></label>' +
      '<div id="qe-linhas"></div><button type="button" class="btn" id="qe-add">+ Adicionar partido</button><div id="qe-out"></div>';
    var box = el.querySelector('#qe-linhas'), out = el.querySelector('#qe-out'), vagasEl = el.querySelector('#qe-vagas');
    function desenhar() {
      box.innerHTML = linhas.map(function (l, i) {
        return '<div class="linha-partido"><input type="text" value="' + esc(l[0]) + '" data-i="' + i + '" data-k="0" aria-label="Nome do partido"><input type="number" min="0" value="' + l[1] + '" data-i="' + i + '" data-k="1" inputmode="numeric" aria-label="Votos"><button type="button" class="x" data-rm="' + i + '" aria-label="Remover partido">×</button></div>';
      }).join('');
      box.querySelectorAll('input').forEach(function (inp) {
        inp.addEventListener('input', function () {
          var i = +inp.getAttribute('data-i'), k = +inp.getAttribute('data-k');
          linhas[i][k] = k === 1 ? Math.max(0, parseInt(inp.value, 10) || 0) : inp.value;
          calc();
        });
      });
      box.querySelectorAll('[data-rm]').forEach(function (b) { b.addEventListener('click', function () { linhas.splice(+b.getAttribute('data-rm'), 1); desenhar(); calc(); }); });
    }
    function calc() {
      var vagas = Math.max(1, parseInt(vagasEl.value, 10) || 1);
      var valid = linhas.reduce(function (s, l) { return s + l[1]; }, 0);
      if (!valid) { out.innerHTML = '<p class="muted">Informe os votos.</p>'; return; }
      var q = valid / vagas, f = Math.floor(q), qe = (q - f) > 0.5 ? f + 1 : f;
      if (qe < 1) qe = 1;
      var cad = linhas.map(function (l) { return Math.floor(l[1] / qe); });
      var usadas = cad.reduce(function (a, b) { return a + b; }, 0);
      var qp = cad.slice(), sobras = linhas.map(function () { return 0; });
      var restantes = vagas - usadas;
      if (usadas === 0) { out.innerHTML = '<p class="aviso">Nenhum partido atingiu o quociente eleitoral. Nesse caso a lei prevê outra regra (as vagas vão para os candidatos mais votados), não coberta aqui.</p>'; return; }
      while (restantes > 0) {
        var best = -1, bm = -1;
        linhas.forEach(function (l, i) { var m = l[1] / (cad[i] + 1); if (m > bm || (m === bm && l[1] > linhas[best][1])) { bm = m; best = i; } });
        cad[best]++; sobras[best]++; restantes--;
      }
      var html = '<p><strong>Votos válidos:</strong> ' + valid.toLocaleString('pt-BR') + ' &nbsp; <strong>Quociente eleitoral:</strong> ' + qe.toLocaleString('pt-BR') + '</p>';
      html += '<div class="tabela-wrap"><table><thead><tr><th>Partido</th><th>Votos</th><th>Cadeiras pelo quociente partidário</th><th>Cadeiras por sobra</th><th>Total</th></tr></thead><tbody>' +
        linhas.map(function (l, i) { return '<tr><td class="c1">' + esc(l[0]) + '</td><td>' + l[1].toLocaleString('pt-BR') + '</td><td>' + qp[i] + '</td><td>' + sobras[i] + '</td><td><strong>' + cad[i] + '</strong></td></tr>'; }).join('') + '</tbody></table></div>';
      out.innerHTML = html;
    }
    el.querySelector('#qe-add').addEventListener('click', function () { linhas.push(['Partido ' + String.fromCharCode(65 + linhas.length % 26), 50000]); desenhar(); calc(); });
    vagasEl.addEventListener('input', calc);
    desenhar(); calc();
  }

  /* ---------- páginas ---------- */
  var filtro = { q: '', tipo: '', esfera: '' };

  function pagInicio() {
    document.title = 'Guia político explicado';
    var html = '<header class="intro"><p class="crumb"><a href="../">← Todos os projetos</a></p>' +
      '<p class="kicker">Enciclopédia da política brasileira</p>' +
      h('h1', '', 'Guia político explicado') +
      '<p class="lead">Como funcionam os processos, os cargos e as instituições da política brasileira, em linguagem simples e com a fonte de cada regra. Escolha uma trilha, busque um assunto ou filtre por tipo e esfera de governo.</p></header>' +
      '<div class="aviso-conf">Conteúdo redigido a partir da Constituição e das leis, <strong>ainda não conferido linha a linha</strong> na fonte oficial. Confira o link da fonte antes de citar. Exemplos reais descrevem o rito, sem opinião sobre os casos.</div>';

    html += '<section aria-labelledby="t-trilhas"><h2 id="t-trilhas" class="serif">Comece por uma trilha</h2><div class="grade">' +
      T.map(function (t) {
        var n = t.ids.filter(function (id) { return porId[id]; }).length;
        return '<a class="cartao" href="#/trilha/' + t.id + '"><h3>' + esc(t.titulo) + '</h3><p>' + esc(t.descricao) + '</p><span class="meta">' + n + ' verbetes →</span></a>';
      }).join('') + '</div></section>';

    html += '<section aria-labelledby="t-busca"><h2 id="t-busca" class="serif">Todos os verbetes</h2>' +
      '<label class="busca">Buscar<input id="busca" type="search" placeholder="Ex.: impeachment, vereador, quórum, suplente…" autocomplete="off" value="' + esc(filtro.q) + '"></label>' +
      '<div class="filtros"><div class="chips" id="f-tipo" role="group" aria-label="Filtrar por tipo"></div><div class="chips" id="f-esfera" role="group" aria-label="Filtrar por esfera"></div></div>' +
      '<p id="contagem" class="muted" aria-live="polite"></p><div id="lista"></div></section>';

    html += rodape();
    app.innerHTML = html;

    function chips(el, mapa, chave, todos) {
      var itens = [['', todos]].concat(Object.keys(mapa).map(function (k) { return [k, mapa[k]]; }));
      el.innerHTML = itens.map(function (i) { return '<button type="button" class="chip' + (filtro[chave] === i[0] ? ' on' : '') + '" data-v="' + i[0] + '">' + esc(i[1]) + '</button>'; }).join('');
      el.querySelectorAll('.chip').forEach(function (b) { b.addEventListener('click', function () { filtro[chave] = b.getAttribute('data-v'); chips(el, mapa, chave, todos); lista(); }); });
    }
    chips(document.getElementById('f-tipo'), TIPOS_PLURAL, 'tipo', 'Todos os tipos');
    chips(document.getElementById('f-esfera'), ESFERAS, 'esfera', 'Todas as esferas');
    var busca = document.getElementById('busca');
    busca.addEventListener('input', function () { filtro.q = busca.value; lista(); });

    function lista() {
      var q = norm(filtro.q).trim().split(/\s+/).filter(Boolean);
      var res = V.filter(function (v) {
        if (filtro.tipo && v.tipo !== filtro.tipo) return false;
        if (filtro.esfera && (v.esferas || []).indexOf(filtro.esfera) < 0) return false;
        if (!q.length) return true;
        var alvo = norm([v.titulo, v.resumo, (v.tags || []).join(' ')].join(' '));
        return q.every(function (w) { return alvo.indexOf(w) >= 0; });
      }).sort(function (a, b) { return a.titulo.localeCompare(b.titulo, 'pt-BR'); });
      document.getElementById('contagem').textContent = res.length + (res.length === 1 ? ' verbete' : ' verbetes') + ' de ' + V.length;
      var grupos = {};
      res.forEach(function (v) { (grupos[v.tipo] = grupos[v.tipo] || []).push(v); });
      var out = Object.keys(TIPOS_PLURAL).filter(function (t) { return grupos[t]; }).map(function (t) {
        return '<h3 class="grupo">' + TIPOS_PLURAL[t] + '</h3><div class="grade">' + grupos[t].map(function (v) {
          return '<a class="cartao" href="#/v/' + v.id + '"><div class="selos">' + chipsEsfera(v) + '</div><h3>' + esc(v.titulo) + '</h3><p>' + esc(v.resumo) + '</p></a>';
        }).join('') + '</div>';
      }).join('');
      document.getElementById('lista').innerHTML = out || '<p class="muted">Nenhum verbete encontrado. Tente outra palavra ou limpe os filtros.</p>';
    }
    lista();
  }

  function rodape() {
    return '<footer>Projeto pessoal, sem vínculo com candidatos, partidos, veículos ou órgãos públicos. Não é aconselhamento jurídico: processos reais exigem advogado. Redigido em ' + META.redigido + '. <a href="../">Todos os projetos</a></footer>';
  }

  function pagTrilha(id) {
    var t = T.filter(function (x) { return x.id === id; })[0];
    if (!t) return pagNaoEncontrada();
    document.title = t.titulo + ' · Guia político explicado';
    var itens = t.ids.map(function (i) { return porId[i]; }).filter(Boolean);
    app.innerHTML = '<header class="intro"><p class="crumb"><a href="#/">← Guia político explicado</a></p><p class="kicker">Trilha de leitura</p>' + h('h1', '', esc(t.titulo)) +
      '<p class="lead">' + esc(t.descricao) + ' Leia na ordem sugerida; cada verbete linka os outros.</p></header>' +
      '<ol class="trilha">' + itens.map(function (v) {
        return '<li><a class="cartao" href="#/v/' + v.id + '"><div class="selos"><span class="selo tipo">' + TIPOS[v.tipo] + '</span>' + chipsEsfera(v) + '</div><h3>' + esc(v.titulo) + '</h3><p>' + esc(v.resumo) + '</p></a></li>';
      }).join('') + '</ol>' + rodape();
  }

  function pagNaoEncontrada() {
    document.title = 'Não encontrado · Guia político explicado';
    app.innerHTML = '<header class="intro"><p class="crumb"><a href="#/">← Guia político explicado</a></p>' + h('h1', '', 'Verbete não encontrado') + '<p class="lead">Esse verbete ainda não foi escrito ou o endereço mudou. <a href="#/">Voltar ao índice</a>.</p></header>' + rodape();
  }

  function pagVerbete(id) {
    var v = porId[id];
    if (!v) return pagNaoEncontrada();
    document.title = v.titulo + ' · Guia político explicado';
    var html = '<article><header class="intro"><p class="crumb"><a href="#/">← Guia político explicado</a> · <a href="../">Todos os projetos</a></p>' +
      '<div class="selos"><span class="selo tipo">' + TIPOS[v.tipo] + '</span>' + chipsEsfera(v) + '</div>' +
      h('h1', '', esc(v.titulo)) + '<p class="lead">' + fmt(v.resumo) + '</p></header>' +
      '<div class="aviso-conf">Redigido em ' + META.redigido + ' a partir do texto da Constituição e das leis; <strong>ainda não conferido linha a linha</strong>. Confira nas fontes ao final antes de citar.</div>';

    if (v.ficha) {
      html += '<dl class="ficha">' + Object.keys(v.ficha).map(function (k) { return '<div><dt>' + esc(k) + '</dt><dd>' + fmt(v.ficha[k]) + '</dd></div>'; }).join('') + '</dl>';
    }
    if (v.ferramenta) html += '<section class="ferramenta" id="ferramenta"></section>';
    if (v.tabelaTopo) html += '<section>' + tabela(v.tabelaTopo) + '</section>';
    if (v.tabela) html += '<section>' + tabela(v.tabela) + '</section>';
    if (v.etapas) {
      html += '<section><h2 class="serif">Passo a passo</h2><ol class="etapas">' + v.etapas.map(function (e) {
        return '<li><div class="quem">' + fmt(e.q) + '</div><div class="o-que">' + fmt(e.t) + (e.v && e.v !== '—' ? '<div class="voto">' + fmt(e.v) + '</div>' : '') + '</div></li>';
      }).join('') + '</ol></section>';
    }
    (v.secoes || []).forEach(function (s) {
      html += '<section><h2 class="serif">' + fmt(s.t) + '</h2>' + (s.p || []).map(function (p) { return h('p', '', fmt(p)); }).join('') + (s.l ? lista(s.l) : '') + (s.tabela ? tabela(s.tabela) : '') + '</section>';
    });
    if (v.porEsfera) {
      html += '<section><h2 class="serif">Em cada esfera</h2><div class="esferas">' + Object.keys(ESFERAS).filter(function (k) { return v.porEsfera[k]; }).map(function (k) {
        return '<div class="esf-card"><h3>' + ESFERAS[k] + '</h3><p>' + fmt(v.porEsfera[k]) + '</p></div>';
      }).join('') + '</div></section>';
    }
    if (v.exemplo) html += '<section class="exemplo"><h2 class="serif">' + fmt(v.exemplo.t) + '</h2>' + v.exemplo.p.map(function (p) { return h('p', '', fmt(p)); }).join('') + '</section>';
    if (v.erros) html += '<section><h2 class="serif">O que costuma ser mal entendido</h2>' + lista(v.erros) + '</section>';

    var rel = (v.relacionados || []).filter(function (r) { return porId[r]; });
    if (rel.length) html += '<section><h2 class="serif">Veja também</h2><div class="chips">' + rel.map(function (r) { return '<a class="chip link" href="#/v/' + r + '">' + esc(porId[r].titulo) + '</a>'; }).join('') + '</div></section>';
    var cit = (citadoPor[id] || []).filter(function (r) { return rel.indexOf(r) < 0; });
    if (cit.length) html += '<section><h2 class="serif">Citado em</h2><div class="chips">' + cit.map(function (r) { return '<a class="chip link" href="#/v/' + r + '">' + esc(porId[r].titulo) + '</a>'; }).join('') + '</div></section>';

    if (v.fontes) html += '<section><h2 class="serif">Fontes</h2><ul class="fontes">' + v.fontes.map(function (f) { return '<li><a href="' + esc(f.u) + '" target="_blank" rel="noopener">' + esc(f.r) + '</a></li>'; }).join('') + '</ul></section>';
    html += '</article>' + rodape();
    app.innerHTML = html;
    var ft = document.getElementById('ferramenta');
    if (ft && v.ferramenta === 'quorum') ferramentaQuorum(ft);
    if (ft && v.ferramenta === 'quociente') ferramentaQuociente(ft);
  }

  /* ---------- roteamento ---------- */
  function rota() {
    var p = (location.hash || '#/').replace(/^#\/?/, '').split('/');
    if (p[0] === 'v' && p[1]) pagVerbete(p[1]);
    else if (p[0] === 'trilha' && p[1]) pagTrilha(p[1]);
    else pagInicio();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', rota);
  rota();
})();

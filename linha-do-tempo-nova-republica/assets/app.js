(() => {
  const PX = 38;            // pixels por ano
  const ROTULO_W = 170;     // largura da coluna de rótulos
  const INI = 1985.0, FIM = 2027.0;
  const LINHA = 28;         // altura de cada fileira de marcadores
  const MESES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  const TIPOS = {
    entrada: { nome: 'Entrada', plural: 'Entradas' },
    saida: { nome: 'Saída', plural: 'Saídas' },
    mudanca: { nome: 'Mudança', plural: 'Mudanças' },
  };
  const MOTIVO = {
    declarado: ['ok', 'Declarada pelas partes ou pelo governo'],
    interpretacao: ['int', 'Leitura da imprensa ou de analistas, não declarada'],
    indisponivel: ['sem', 'Motivo não divulgado ou não apurado'],
  };
  const FATO = {
    confirmado: ['ok', 'Fato bem documentado'],
    'a-conferir': ['ver', 'Data ou detalhes a conferir'],
  };

  const $ = (s) => document.querySelector(s);
  let D = null;
  const setoresSel = new Set();            // vazio = todos
  const tiposOn = new Set(Object.keys(TIPOS));
  let ultimoGatilho = null;

  function h(tag, attrs, ...filhos) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === false || v == null) continue;
      if (k === 'class') e.className = v;
      else if (k === 'style') e.style.cssText = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const f of filhos.flat()) {
      if (f == null || f === false) continue;
      e.append(f.nodeType ? f : document.createTextNode(String(f)));
    }
    return e;
  }

  const isoAno = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    return y + ((m - 1) + (d - 1) / 31) / 12;
  };
  const dataAno = (e) => {
    const p = e.data.split('-');
    return p[1] ? +p[0] + (+p[1] - 0.5) / 12 : +p[0] + 0.5;
  };
  const dataTxt = (e) => {
    const p = e.data.split('-');
    const base = p[1] ? `${MESES[+p[1] - 1]}/${p[0]}` : p[0];
    return e.aprox ? `${base} (aprox.)` : base;
  };
  const x = (ano) => (ano - INI) * PX;
  const setorDe = (id) => D.setores.find((s) => s.id === id);
  const governoDe = (ano) => D.presidentes.find((p) => ano >= p.t0 && ano < p.t1) || D.presidentes[D.presidentes.length - 1];

  function eventosFiltrados() {
    return D.eventos
      .filter((e) => (setoresSel.size === 0 || setoresSel.has(e.setor)) && tiposOn.has(e.tipo))
      .sort((a, b) => a.t - b.t);
  }

  // ---------- filtros ----------
  function renderFiltros() {
    const box = $('#setores');
    box.innerHTML = '';
    const total = D.eventos.length;
    box.append(
      h('button', {
        type: 'button', class: 'setor', 'aria-pressed': String(setoresSel.size === 0),
        title: 'Mostrar todos os setores',
        onclick: () => { setoresSel.clear(); renderTudo(); },
      }, h('span', { class: 'ic', 'aria-hidden': 'true' }, '🌐'), h('span', { class: 'nm' }, 'Todos'), h('span', { class: 'ct' }, total)),
    );
    for (const s of D.setores) {
      const n = D.eventos.filter((e) => e.setor === s.id).length;
      box.append(
        h('button', {
          type: 'button', class: 'setor', 'aria-pressed': String(setoresSel.has(s.id)), title: s.nome,
          onclick: () => {
            if (setoresSel.has(s.id)) setoresSel.delete(s.id); else setoresSel.add(s.id);
            renderTudo();
          },
        }, h('span', { class: 'ic', 'aria-hidden': 'true' }, s.icone), h('span', { class: 'nm' }, s.nome), h('span', { class: 'ct' }, n)),
      );
    }

    const tb = $('#tipos');
    tb.innerHTML = '';
    for (const [id, t] of Object.entries(TIPOS)) {
      tb.append(
        h('button', {
          type: 'button', class: 'chip', 'aria-pressed': String(tiposOn.has(id)),
          onclick: () => { if (tiposOn.has(id)) tiposOn.delete(id); else tiposOn.add(id); renderTudo(); },
        }, h('i', { class: 'forma ' + id }), t.plural),
      );
    }

    const evs = eventosFiltrados();
    const nSet = setoresSel.size === 0 ? 'todos os setores' : `${setoresSel.size} setor${setoresSel.size > 1 ? 'es' : ''}`;
    $('#filtro-resumo').textContent = `${evs.length} acontecimento${evs.length === 1 ? '' : 's'} em ${nSet}`;
  }

  // ---------- empilhamento de marcadores ----------
  function empilhar(itens, largura) {
    const fins = [];
    for (const it of itens) {
      const esq = it.px - 7;
      let r = 0;
      while (fins[r] !== undefined && fins[r] > esq - 4) r++;
      fins[r] = esq + largura(it);
      it.fileira = r;
    }
    return Math.max(fins.length, 1);
  }
  const largRotulo = (nome) => 14 + 6 + Math.min(nome.length, 26) * 6.4 + 10;

  // ---------- timeline ----------
  function renderTimeline() {
    const root = $('#tl');
    root.innerHTML = '';
    const plotW = Math.round((FIM - INI) * PX);
    const inner = h('div', { class: 'tl-inner', style: `width:${ROTULO_W + plotW}px` });

    // grade de fundo (faixas de governo, anos e marcos)
    const grade = h('div', { class: 'tl-grid', style: `left:${ROTULO_W}px;width:${plotW}px` });
    D.presidentes.forEach((p, i) => {
      const l = x(p.t0), w = x(p.t1) - x(p.t0);
      grade.append(h('div', { class: 'tl-faixa', style: `left:${l}px;width:${w}px;background:${i % 2 ? 'var(--faixa-b)' : 'var(--faixa-a)'}` }));
    });
    for (let y = 1985; y <= 2026; y++) {
      grade.append(h('div', { class: 'tl-ano' + (y % 5 === 0 ? ' cinco' : ''), style: `left:${x(y)}px` }));
    }
    for (const m of D.marcos) grade.append(h('div', { class: 'tl-marcolinha', style: `left:${x(m.t)}px` }));
    inner.append(grade);

    // cabeçalho: governos e anos
    const topoPlot = h('div', { class: 'tl-plot', style: `width:${plotW}px;height:58px` });
    D.presidentes.forEach((p, i) => {
      topoPlot.append(h('div', { class: 'gov-nome' + (i % 2 ? ' b' : ''), style: `left:${x(p.t0)}px;width:${x(p.t1) - x(p.t0)}px`, title: p.nome }, p.curto));
    });
    for (let y = 1985; y <= 2025; y += 5) topoPlot.append(h('div', { class: 'ano-txt', style: `left:${x(y)}px${y === 1985 ? ';transform:none;padding-left:3px' : ''}` }, y));
    inner.append(h('div', { class: 'tl-linha tl-topo', style: 'border-top:0' },
      h('div', { class: 'tl-rotulo', style: `width:${ROTULO_W}px;height:58px` }, 'Governo'),
      topoPlot));

    // marcos nacionais
    const marcos = D.marcos.map((m) => ({ ...m, px: x(m.t) }));
    const nFil = empilhar(marcos, (m) => largRotulo(m.nome) - 6);
    const hMarcos = nFil * LINHA + 14;
    const plotMarcos = h('div', { class: 'tl-plot', style: `width:${plotW}px;height:${hMarcos}px` });
    for (const m of marcos) {
      plotMarcos.append(h('button', {
        type: 'button', class: 'mk marco', style: `left:${m.px - 7}px;top:${7 + m.fileira * LINHA}px`,
        'aria-label': `Marco nacional: ${m.nome}`, title: m.nome,
        onclick: (ev) => abrirMarco(m, ev.currentTarget),
      }, h('i', { class: 'forma' }), h('span', null, m.nome)));
    }
    inner.append(h('div', { class: 'tl-linha tl-marcos' },
      h('div', { class: 'tl-rotulo', style: `width:${ROTULO_W}px;height:${hMarcos}px` }, h('span', { class: 'ic', 'aria-hidden': 'true' }, '🏛️'), h('span', { class: 'nm' }, 'Marcos nacionais')),
      plotMarcos));

    // fileiras de setores
    const evs = eventosFiltrados();
    const setores = D.setores.filter((s) => setoresSel.size === 0 ? evs.some((e) => e.setor === s.id) : setoresSel.has(s.id));
    for (const s of setores) {
      const itens = evs.filter((e) => e.setor === s.id).map((e) => ({ e, px: x(e.t) }));
      const n = empilhar(itens, (it) => largRotulo(it.e.empresa));
      const alt = Math.max(n * LINHA + 14, 46);
      const plot = h('div', { class: 'tl-plot', style: `width:${plotW}px;height:${alt}px` });
      if (itens.length === 0) plot.append(h('span', { class: 'tl-vazio' }, 'Nenhum acontecimento com os filtros de tipo escolhidos.'));
      for (const it of itens) {
        const e = it.e;
        plot.append(h('button', {
          type: 'button', class: `mk ${e.tipo}`, style: `left:${it.px - 7}px;top:${7 + it.fileira * LINHA}px`,
          'aria-label': `${e.empresa}, ${dataTxt(e)}, ${TIPOS[e.tipo].nome}`, title: `${e.empresa} · ${dataTxt(e)}`,
          'data-id': e.id,
          onclick: (ev) => abrirEvento(e, ev.currentTarget),
        }, h('i', { class: 'forma' }), h('span', null, e.empresa)));
      }
      inner.append(h('div', { class: 'tl-linha' },
        h('div', { class: 'tl-rotulo', style: `width:${ROTULO_W}px;height:${alt}px` },
          h('span', { class: 'ic', 'aria-hidden': 'true' }, s.icone), h('span', { class: 'nm' }, s.nome)),
        plot));
    }
    root.append(inner);
  }

  // ---------- por governo ----------
  function renderGov() {
    const evs = eventosFiltrados();
    const corpo = $('#gov-corpo');
    corpo.innerHTML = '';
    const anoHoje = D.hoje;
    for (const p of D.presidentes) {
      const lista = evs.filter((e) => governoDe(e.t) === p);
      const c = (t) => lista.filter((e) => e.tipo === t).length;
      const anos = Math.min(p.t1, anoHoje) - p.t0;
      const ini = p.inicio.slice(0, 4);
      const fim = p.fim ? p.fim.slice(0, 4) : 'hoje';
      corpo.append(h('tr', null,
        h('td', null, h('strong', null, p.nome), p.nota ? h('div', { class: 'pequeno' }, p.nota) : null),
        h('td', null, `${ini}–${fim}`),
        h('td', null, c('entrada')), h('td', null, c('saida')), h('td', null, c('mudanca')),
        h('td', null, h('strong', null, lista.length)),
        h('td', null, (lista.length / anos).toFixed(1).replace('.', ',')),
      ));
    }
  }

  // ---------- lista ----------
  function renderLista() {
    const evs = eventosFiltrados();
    const box = $('#lista');
    box.innerHTML = '';
    $('#sem-eventos').hidden = evs.length > 0;
    $('#lista-intro').textContent = `${evs.length} acontecimento${evs.length === 1 ? '' : 's'}, em ordem cronológica. Toque para abrir o detalhe.`;
    for (const e of evs) {
      const s = setorDe(e.setor);
      box.append(h('button', { type: 'button', class: 'item', onclick: (ev) => abrirEvento(e, ev.currentTarget) },
        h('span', { class: 'dt' }, dataTxt(e)),
        h('span', { class: 'ic', 'aria-hidden': 'true', title: s.nome }, s.icone),
        h('span', { class: 'tt ' + e.tipo }, h('span', { style: 'display:inline-flex;align-items:center;gap:8px' }, h('i', { class: 'forma ' + e.tipo }), e.empresa), h('small', null, e.rotulo)),
        h('span', { class: 'gv' }, governoDe(e.t).curto),
      ));
    }
  }

  // ---------- detalhe ----------
  const dlg = $('#detalhe');
  function mostrar(filhos, gatilho) {
    ultimoGatilho = gatilho;
    dlg.innerHTML = '';
    dlg.append(h('div', { class: 'det' }, filhos));
    if (!dlg.open) dlg.showModal();
  }
  const bloco = (titulo, conteudo) => h('div', { class: 'bloco' }, h('h3', null, titulo), conteudo);

  const TIPO_FONTE = {
    oficial: 'Documento oficial',
    empresa: 'Empresa',
    imprensa: 'Imprensa',
    academico: 'Estudo ou análise',
    parte: 'Parte interessada',
  };
  function listaFontes(fontes) {
    return h('ul', { class: 'fontes' }, fontes.map((f) => h('li', null,
      h('a', { href: f.url, target: '_blank', rel: 'noopener noreferrer' }, f.titulo),
      ' ',
      h('span', { class: 'tipo-fonte' }, TIPO_FONTE[f.tipo] || ''),
    )));
  }

  // Sem fonte oficial nem da própria empresa: só imprensa, estudo ou parte interessada.
  const semPrimaria = (fontes) => !fontes.some((f) => f.tipo === 'oficial' || f.tipo === 'empresa');

  function abrirEvento(e, gatilho) {
    const s = setorDe(e.setor);
    const g = governoDe(e.t);
    const [fk, ft] = FATO[e.fato];
    const [mk, mt] = MOTIVO[e.motivoTipo];
    mostrar([
      h('div', { class: 'det-topo' },
        h('div', null,
          h('h2', { id: 'det-titulo' }, e.empresa),
          h('p', { class: 'sub' }, e.rotulo)),
        h('button', { type: 'button', class: 'fechar', 'aria-label': 'Fechar', onclick: () => dlg.close() }, '×')),
      h('div', { class: 'badges' },
        h('span', { class: 'badge' }, h('i', { class: 'forma ' + e.tipo }), TIPOS[e.tipo].nome),
        h('span', { class: 'badge' }, dataTxt(e)),
        h('span', { class: 'badge' }, `${s.icone} ${s.nome}`),
        h('span', { class: 'badge' }, `Governo ${g.curto}`),
        h('span', { class: 'badge ' + fk }, ft),
        semPrimaria(e.fontes) ? h('span', { class: 'badge ver' }, 'Sem documento primário') : null),
      semPrimaria(e.fontes)
        ? h('p', { class: 'aviso-fonte' }, 'Limite deste caso: as fontes abaixo são imprensa, estudo ou parte interessada. Não incluí o documento original (comunicado ou fato relevante da empresa, decisão de órgão público ou da Justiça). Confira os detalhes nas fontes antes de citar.')
        : null,
      bloco('O que aconteceu', h('p', null, e.resumo)),
      bloco('Justificativa', h('div', { class: 'bloco' }, h('p', null, e.motivo), h('div', { class: 'badges' }, h('span', { class: 'badge ' + mk }, mt)))),
      bloco('E em outros países?', e.internacional
        ? h('div', { class: 'bloco' }, h('p', null, e.internacional.texto), listaFontes(e.internacional.fontes))
        : h('p', { class: 'vazio' }, 'Comparação ainda não pesquisada para este caso.')),
      bloco('Ações', h('p', null, e.acoes + ' A série de preços ainda não foi coletada.')),
      bloco('Fontes (abrem em nova aba)', listaFontes(e.fontes)),
    ], gatilho);
    dlg.querySelector('.fechar').focus();
  }

  function abrirMarco(m, gatilho) {
    mostrar([
      h('div', { class: 'det-topo' },
        h('div', null, h('h2', { id: 'det-titulo' }, m.nome), h('p', { class: 'sub' }, 'Marco nacional')),
        h('button', { type: 'button', class: 'fechar', 'aria-label': 'Fechar', onclick: () => dlg.close() }, '×')),
      h('div', { class: 'badges' },
        h('span', { class: 'badge' }, dataTxt(m)),
        h('span', { class: 'badge' }, `Governo ${governoDe(m.t).curto}`)),
      bloco('Contexto', h('p', null, m.texto)),
      bloco('Fontes (abrem em nova aba)', listaFontes(m.fontes)),
    ], gatilho);
    dlg.querySelector('.fechar').focus();
  }

  dlg.addEventListener('click', (ev) => { if (ev.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { if (ultimoGatilho && document.contains(ultimoGatilho)) ultimoGatilho.focus(); });

  function renderTudo() {
    renderFiltros();
    renderTimeline();
    renderGov();
    renderLista();
  }

  // ---------- início ----------
  fetch('data/dados.json')
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((d) => {
      D = d;
      const hoje = new Date();
      D.hoje = hoje.getFullYear() + (hoje.getMonth() + hoje.getDate() / 31) / 12;
      for (const p of D.presidentes) { p.t0 = isoAno(p.inicio); p.t1 = p.fim ? isoAno(p.fim) : D.hoje; }
      for (const e of D.eventos) e.t = dataAno(e);
      for (const m of D.marcos) m.t = dataAno(m);
      const n = D.eventos.length;
      const nSem = D.eventos.filter((e) => semPrimaria(e.fontes)).length;
      const nConf = D.eventos.filter((e) => e.fato === 'a-conferir').length;
      $('#limite-contagem').textContent = `Hoje, ${nSem} dos ${n} casos (${Math.round((nSem / n) * 100)}%) não têm documento primário entre as fontes, e ${nConf} estão marcados “a conferir” por divergência de data.`;
      renderTudo();
    })
    .catch((err) => {
      const el = $('#erro');
      el.hidden = false;
      el.textContent = 'Não consegui carregar os dados (' + err.message + '). Abra o projeto por um servidor local ou pelo GitHub Pages; abrir o arquivo direto do disco bloqueia a leitura do JSON.';
    });
})();

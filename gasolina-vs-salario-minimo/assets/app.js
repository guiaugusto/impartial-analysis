(() => {
'use strict';

const CURTO = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const LONGO = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const UF = {'ACRE':'AC','ALAGOAS':'AL','AMAPA':'AP','AMAZONAS':'AM','BAHIA':'BA','CEARA':'CE','DISTRITO FEDERAL':'DF','ESPIRITO SANTO':'ES','GOIAS':'GO','MARANHAO':'MA','MATO GROSSO':'MT','MATO GROSSO DO SUL':'MS','MINAS GERAIS':'MG','PARA':'PA','PARAIBA':'PB','PARANA':'PR','PERNAMBUCO':'PE','PIAUI':'PI','RIO DE JANEIRO':'RJ','RIO GRANDE DO NORTE':'RN','RIO GRANDE DO SUL':'RS','RONDONIA':'RO','RORAIMA':'RR','SANTA CATARINA':'SC','SAO PAULO':'SP','SERGIPE':'SE','TOCANTINS':'TO'};
const SLOT = ['#f2c14e', '#c792ea', '#4dd0e1', '#ff7aa2'];
const AZUL = '#6aaaf2', LARANJA = '#f58f62', VERDE = '#3ec99a', CINZA = '#a8a79e';

// Períodos em que o preço mudou de forma relevante: [início, fim, direção, título, texto]
const EVENTOS = [
['2013-12','2013-12','up','Reajuste nas refinarias','A Petrobras reajustou a gasolina em cerca de 4% no fim de novembro de 2013, e o repasse chegou às bombas em dezembro.'],
['2015-02','2015-02','up','Volta da Cide e alta de PIS/Cofins','Em 1º de fevereiro de 2015 entrou em vigor o aumento de PIS/Cofins sobre a gasolina e a volta da Cide, como parte do ajuste fiscal do governo.'],
['2015-10','2015-12','up','Reajuste da Petrobras no fim de 2015','A Petrobras reajustou a gasolina em torno de 6% no fim de setembro de 2015, e o repasse aparece nas bombas de outubro em diante.'],
['2017-08','2017-12','up','Preço diário e mais tributos','Em julho de 2017 a Petrobras passou a ajustar os preços com mais frequência, acompanhando petróleo e câmbio, e o governo elevou tributos federais sobre combustíveis. O efeito aparece nas bombas de agosto em diante.'],
['2018-05','2018-10','up','Greve dos caminhoneiros, dólar e petróleo','A greve dos caminhoneiros no fim de maio de 2018 somou-se à alta do dólar e do petróleo, levando a gasolina até o pico de outubro de 2018.'],
['2018-11','2018-12','down','Queda do petróleo no fim de 2018','O petróleo recuou forte no fim de 2018 e a Petrobras reduziu o preço nas refinarias, o que chegou às bombas como queda.'],
['2020-03','2020-05','down','Pandemia derruba demanda e petróleo','Com a covid-19, a demanda por combustíveis despencou, o petróleo caiu e a Petrobras reduziu os preços nas refinarias.'],
['2021-02','2021-11','up','Retomada do petróleo e dólar alto','Com a recuperação da economia, o petróleo voltou a subir e o dólar ficou alto. A Petrobras fez reajustes sucessivos nas refinarias ao longo de 2021, e a gasolina subiu quase todo mês até novembro.'],
['2022-03','2022-05','up','Guerra na Ucrânia','Com a invasão da Ucrânia o petróleo disparou. Em 11 de março de 2022 a Petrobras reajustou a gasolina nas refinarias em cerca de 18,7%, e o pico das bombas veio em maio.'],
['2022-07','2022-09','down','Teto de ICMS e queda dos tributos','A lei do teto do ICMS (17% a 18%), aplicada pelos estados a partir de 27 de junho de 2022, e a redução de tributos federais sobre combustíveis derrubaram o preço nas bombas. Houve também cortes da Petrobras no período.'],
['2023-03','2023-03','up','Volta dos tributos federais','Em 1º de março de 2023 voltaram parte do PIS/Cofins sobre a gasolina, o que a Abicom estimou em cerca de R$ 0,25 por litro nas bombas.'],
['2024-02','2024-02','up','ICMS fixo sobe para R$ 1,37','Em 1º de fevereiro de 2024 o ICMS fixo (ad rem) da gasolina subiu de R$ 1,22 para R$ 1,37 por litro.'],
['2025-02','2025-02','up','ICMS fixo sobe para R$ 1,47','Em 1º de fevereiro de 2025 o ICMS fixo (ad rem) da gasolina subiu de R$ 1,37 para R$ 1,47 por litro.']
];

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const br = (v, d) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
const nn = (v) => v !== null;
const pct = (a, b) => (a === null || b === null || a === undefined || b === undefined ? null : (a / b - 1) * 100);
const fp = (p) => (p === null ? '—' : (p > 0.05 ? '+' : p < -0.05 ? '−' : '') + br(Math.abs(p), 1) + '%');
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const SMALL = { de: 1, da: 1, do: 1, das: 1, dos: 1, e: 1 };
const titulo = (str) => str.toLowerCase().split(' ').map((w, i) => ((i > 0 && SMALL[w]) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join(' ');

let D, n, meses, gas, sal, lit, LIST, BYID, EV;
const S = { start: 0, end: 0, sel: 0, hover: null, cities: null, q: '' };

fetch('data/dados.json').then((r) => r.json()).then(iniciar).catch(() => {
  const e = $('erro');
  e.hidden = false;
  e.textContent = 'Não foi possível carregar data/dados.json. Abra o projeto por um servidor (veja o LEIAME) e não direto pelo arquivo.';
});

function iniciar(dados) {
  D = dados;
  n = D.brasil.length;
  gas = D.brasil;
  sal = D.salarioMinimo;
  meses = [];
  for (let i = 0; i < n; i++) meses.push((2013 + Math.floor(i / 12)) + '-' + String(i % 12 + 1).padStart(2, '0'));
  lit = gas.map((g, i) => (g === null ? null : Math.round(sal[i] / g)));
  LIST = D.municipios.map((m) => {
    const uf = UF[m.estado] || m.estado;
    return { id: m.estado + '|' + m.nome, label: titulo(m.nome) + ' (' + uf + ')', norm: norm(m.nome + ' ' + m.estado), postos: m.postos, p: m.p };
  });
  BYID = {};
  LIST.forEach((x) => { BYID[x.id] = x; });
  EV = EVENTOS.map((e) => {
    const a = meses.indexOf(e[0]), b = meses.indexOf(e[1]);
    const ref = gas[a - 1], c = pct(gas[b], ref);
    return { a, b, dir: e[2], titulo: e[3], texto: e[4], change: c === null ? '—' : fp(c),
      precos: ref === null || gas[b] === null ? '' : '(R$ ' + br(ref, 2) + ' em ' + lab(a - 1) + ' → R$ ' + br(gas[b], 2) + ' em ' + lab(b) + ')' };
  });
  S.start = 0; S.end = n - 1; S.sel = n - 1;
  S.cities = ['SAO PAULO|SAO PAULO', 'ACRE|CRUZEIRO DO SUL'].filter((id) => BYID[id]);
  $('mun-intro').textContent = 'Busque uma cidade e compare o preço médio da gasolina com a média nacional e com outras cidades, no mesmo período e no mesmo mês selecionados acima. A ANP pesquisa ' + LIST.length + ' municípios ao longo da série, não todos os do país, e cada cidade tem poucos ou muitos postos pesquisados (veja a coluna de postos).';
  ligar();
  render();
}

const lab = (i) => CURTO[+meses[i].slice(5) - 1] + '/' + meses[i].slice(0, 4);
const labLongo = (i) => LONGO[+meses[i].slice(5) - 1] + ' de ' + meses[i].slice(0, 4);
const idxOf = (k) => meses.indexOf(k);

function ligar() {
  $('inicio').addEventListener('input', (e) => { S.start = Math.min(+e.target.value, S.end - 1); render(); });
  $('fim').addEventListener('input', (e) => { S.end = Math.max(+e.target.value, S.start + 1); render(); });
  $('mes').addEventListener('input', (e) => { S.sel = +e.target.value; render(); });
  $('aproximar').addEventListener('click', () => { S.start = Math.max(0, S.sel - 12); S.end = Math.min(n - 1, S.sel + 12); render(); });
  $('ver-tudo').addEventListener('click', () => { S.start = 0; S.end = n - 1; render(); });
  $('busca').addEventListener('input', (e) => { S.q = e.target.value; renderBusca(); });
  document.querySelectorAll('.hit').forEach((el) => {
    const mover = (e) => {
      const r = el.getBoundingClientRect();
      const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      S.sel = S.start + Math.round(f * (S.end - S.start));
      S.hover = el.dataset.chart;
      render();
    };
    el.addEventListener('pointermove', mover);
    el.addEventListener('pointerdown', mover);
    el.addEventListener('pointerleave', () => { S.hover = null; render(); });
  });
  document.body.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.preset !== undefined) {
      const [a, z] = b.dataset.preset.split(',').map(Number);
      S.start = a; S.end = z; render();
    } else if (b.dataset.add !== undefined) {
      S.cities = S.cities.filter((x) => x !== b.dataset.add).concat(b.dataset.add).slice(-4);
      S.q = ''; $('busca').value = ''; render();
    } else if (b.dataset.remove !== undefined) {
      S.cities = S.cities.filter((x) => x !== b.dataset.remove); render();
    } else if (b.dataset.ev !== undefined) {
      const ev = EV[+b.dataset.ev];
      S.start = Math.max(0, ev.a - 4); S.end = Math.min(n - 1, ev.b + 4); S.sel = ev.a; render();
      $('t-c1').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// ---------- escalas e caminhos ----------
function nice(lo, hi, cands) {
  const span = Math.max(hi - lo, 0.5 * (cands[0] < 0.5 ? cands[0] * 4 : 1));
  let step = cands[cands.length - 1];
  for (const c of cands) { if (span * 1.1 / c <= 5) { step = c; break; } }
  const min = Math.floor((lo - span * 0.05) / step) * step;
  const max = Math.ceil((hi + span * 0.05) / step) * step;
  const ticks = [];
  for (let t = min; t <= max + 1e-9; t += step) ticks.push(t);
  return { min, max, ticks };
}
const ypct = (v, sc) => 100 - (v - sc.min) / (sc.max - sc.min) * 100;
function caminho(vals, sc, degrau, len) {
  let d = '', py = null;
  vals.forEach((v, j) => {
    if (v === null) { py = null; return; }
    const x = (j / (len - 1) * 1000).toFixed(1), y = ypct(v, sc).toFixed(2);
    if (py === null) d += 'M' + x + ' ' + y + ' ';
    else if (degrau) d += 'L' + x + ' ' + py + ' L' + x + ' ' + y + ' ';
    else d += 'L' + x + ' ' + y + ' ';
    py = y;
  });
  return d;
}
const CAND = [1, 2, 5, 10, 20, 25, 50, 100];

// ---------- renderização ----------
function render() {
  S.start = Math.max(0, Math.min(S.start, n - 2));
  S.end = Math.max(S.start + 1, Math.min(S.end, n - 1));
  S.sel = Math.max(S.start, Math.min(S.end, S.sel));
  const c = calcular();
  renderPeriodo(c);
  renderDetalhe(c);
  renderCharts(c);
  renderMunicipios(c);
  renderEventos();
  renderBusca();
}

function calcular() {
  const { start, end, sel } = S;
  const len = end - start + 1, selJ = sel - start;
  const salR = sal.slice(start, end + 1), gasR = gas.slice(start, end + 1), litR = lit.slice(start, end + 1);
  const gb = gasR.find(nn);
  const idxW = salR.map((v) => v / salR[0] * 100);
  const idxG = gasR.map((v) => (v === null ? null : v / gb * 100));
  const all1 = idxW.concat(idxG.filter(nn));
  const sc1 = nice(Math.min(...all1), Math.max(...all1), CAND);
  const litv = litR.filter(nn);
  const sc2 = nice(Math.min(...litv), Math.max(...litv), CAND);
  let k = 24;
  for (const q of [1, 2, 3, 6, 12, 24]) { if (len / q <= 7) { k = q; break; } }
  const xticks = [];
  for (let j = 0; j < len; j++) {
    const i = start + j;
    if (i % k !== 0) continue;
    xticks.push({ left: (j / (len - 1) * 100) + '%', label: k >= 12 ? meses[i].slice(0, 4) : lab(i) });
  }
  const f = selJ / (len - 1);
  const evVis = EV.map((e, i) => Object.assign({ i }, e)).filter((e) => e.b >= start && e.a <= end);
  const bandas = evVis.map((e) => {
    const a = Math.max(e.a, start), b = Math.min(e.b, end);
    const l = Math.max(0, (a - start - 0.5) / (len - 1) * 100);
    const r = Math.min(100, (b - start + 0.5) / (len - 1) * 100);
    return { left: l + '%', width: (r - l) + '%', bg: e.dir === 'up' ? 'rgba(245,143,98,0.14)' : 'rgba(62,201,154,0.14)' };
  });
  return { len, selJ, salR, gasR, litR, idxW, idxG, sc1, sc2, xticks, selLeft: (f * 100) + '%',
    tipTx: f < 0.3 ? 'translateX(14px)' : (f > 0.7 ? 'translateX(calc(-100% - 14px))' : 'translateX(-50%)'),
    evVis, bandas };
}

function renderPeriodo() {
  $('periodo-label').textContent = lab(S.start) + ' a ' + lab(S.end) + ' · ' + (S.end - S.start + 1) + ' meses';
  const set = (id, min, max, v) => { const el = $(id); el.min = min; el.max = max; el.value = v; };
  set('inicio', 0, n - 2, S.start); set('fim', 1, n - 1, S.end); set('mes', S.start, S.end, S.sel);
  $('inicio-label').textContent = lab(S.start); $('fim-label').textContent = lab(S.end);
  const yr = (y1, y2) => [y1 + '–' + String(y2).slice(2), idxOf(y1 + '-01'), Math.min(n - 1, idxOf(y2 + '-12') < 0 ? n - 1 : idxOf(y2 + '-12'))];
  const presets = [['Tudo', 0, n - 1], yr(2013, 2015), yr(2016, 2018), yr(2019, 2021), yr(2022, 2024),
    ['Pico de 2022', idxOf('2021-09'), idxOf('2023-03')], ['Últimos 12 meses', n - 12, n - 1]];
  $('presets').innerHTML = presets.map((p) =>
    '<button type="button" class="chip' + (S.start === p[1] && S.end === p[2] ? ' on' : '') + '" data-preset="' + p[1] + ',' + p[2] + '">' + esc(p[0]) + '</button>').join('');
}

function renderDetalhe() {
  const sel = S.sel;
  const t = labLongo(sel);
  $('mes-titulo').textContent = t.charAt(0).toUpperCase() + t.slice(1);
  $('m-gas').textContent = gas[sel] === null ? 'sem pesquisa' : 'R$ ' + br(gas[sel], 2);
  $('m-sal').textContent = 'R$ ' + br(sal[sel], 0);
  $('m-lit').textContent = lit[sel] === null ? '—' : String(lit[sel]);
  const linha = (rotulo, ref) => '<tr><td>' + esc(rotulo) + '</td><td><strong>' + fp(pct(gas[sel], gas[ref])) + '</strong></td><td><strong>' +
    fp(pct(sal[sel], sal[ref])) + '</strong></td><td><strong>' + fp(pct(lit[sel], lit[ref])) + '</strong></td></tr>';
  let rows = '';
  if (sel > 0) rows += linha('mês anterior (' + lab(sel - 1) + ')', sel - 1);
  if (sel >= 12) rows += linha('12 meses antes (' + lab(sel - 12) + ')', sel - 12);
  if (sel > S.start) rows += linha('início do período (' + lab(S.start) + ')', S.start);
  if (!rows) rows = '<tr><td>Primeiro mês da série</td><td>—</td><td>—</td><td>—</td></tr>';
  $('var-corpo').innerHTML = rows;
  let nota = '';
  if (sel > 0 && sal[sel] !== sal[sel - 1]) nota = 'Reajuste do salário mínimo neste mês: de R$ ' + br(sal[sel - 1], 0) + ' para R$ ' + br(sal[sel], 0) + '.';
  if (gas[sel] === null) nota = (nota ? nota + ' ' : '') + 'A ANP não pesquisou preços neste mês, por isso não há valor de gasolina.';
  $('nota').hidden = !nota; $('nota').textContent = nota;
  const cur = EV.find((e) => sel >= e.a && sel <= e.b);
  const box = $('contexto');
  box.hidden = !cur;
  if (cur) {
    box.innerHTML = '<div class="rot">Contexto deste mês</div><div class="tit">' + esc(cur.titulo) +
      (cur.change === '—' ? '' : ' (gasolina ' + esc(cur.change) + ' no período)') + '</div><div class="txt">' + esc(cur.texto) + '</div>';
  }
}

function plotar(id, o, c) {
  const el = $(id).querySelector('.camada');
  let h = '';
  (o.bandas || []).forEach((b) => { h += '<div class="faixa" style="left:' + b.left + ';width:' + b.width + ';background:' + b.bg + '"></div>'; });
  o.grid.forEach((g) => { h += '<div class="grade" style="top:' + g.top + '"><span>' + g.label + '</span></div>'; });
  h += '<svg viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">' + o.paths.map((p) =>
    '<path d="' + p.d + '" fill="none" stroke="' + p.cor + '" stroke-width="' + (p.w || 2.5) + '"' + (p.dash ? ' stroke-dasharray="' + p.dash + '"' : '') +
    ' stroke-linejoin="round" vector-effect="non-scaling-stroke"/>').join('') + '</svg>';
  h += '<div class="cursor" style="left:' + c.selLeft + '"></div>';
  o.dots.forEach((d) => { h += '<div class="ponto" style="left:' + c.selLeft + ';top:' + d.top + ';background:' + d.cor + '"></div>'; });
  c.xticks.forEach((t) => { h += '<span class="xt" style="left:' + t.left + '">' + esc(t.label) + '</span>'; });
  if (S.hover === id) {
    h += '<div class="tip" style="left:' + c.selLeft + ';transform:' + c.tipTx + '"><b>' + esc(labLongo(S.sel)) + '</b>' +
      o.tip.map((r) => '<div><span class="sw" style="background:' + r.cor + '"></span>' + esc(r.rot) + ': <strong>' + esc(r.val) + '</strong></div>').join('') + '</div>';
  }
  el.innerHTML = h;
  el.parentNode.setAttribute('role', 'img');
}
const gradeNum = (sc, d) => sc.ticks.map((t) => ({ top: ypct(t, sc) + '%', label: d === undefined ? String(Math.round(t)) : br(t, d) }));

function renderCharts(c) {
  const { selJ, idxW, idxG, sc1, sc2, litR, len } = c;
  const sel = S.sel;
  $('c1').setAttribute('aria-label', 'Gráfico de linhas do índice do salário mínimo e da gasolina no período escolhido');
  plotar('c1', {
    bandas: c.bandas, grid: gradeNum(sc1),
    paths: [{ d: caminho(idxW, sc1, true, len), cor: AZUL }, { d: caminho(idxG, sc1, false, len), cor: LARANJA, dash: '7 5' }],
    dots: [{ top: ypct(idxW[selJ], sc1) + '%', cor: AZUL }].concat(idxG[selJ] === null ? [] : [{ top: ypct(idxG[selJ], sc1) + '%', cor: LARANJA }]),
    tip: [
      { cor: AZUL, rot: 'Salário mínimo', val: 'R$ ' + br(sal[sel], 0) + ' (índice ' + Math.round(idxW[selJ]) + ')' },
      { cor: LARANJA, rot: 'Gasolina', val: gas[sel] === null ? 'sem pesquisa' : 'R$ ' + br(gas[sel], 2) + '/L (índice ' + Math.round(idxG[selJ]) + ')' }
    ]
  }, c);
  $('c2').setAttribute('aria-label', 'Gráfico de linha dos litros de gasolina que um salário mínimo compra, mês a mês, no período escolhido');
  plotar('c2', {
    bandas: c.bandas, grid: gradeNum(sc2),
    paths: [{ d: caminho(litR, sc2, false, len), cor: VERDE }],
    dots: litR[selJ] === null ? [] : [{ top: ypct(litR[selJ], sc2) + '%', cor: VERDE }],
    tip: [
      { cor: VERDE, rot: 'Litros por salário', val: lit[sel] === null ? '—' : String(lit[sel]) },
      { cor: LARANJA, rot: 'Gasolina', val: gas[sel] === null ? 'sem pesquisa' : 'R$ ' + br(gas[sel], 2) + '/L' },
      { cor: AZUL, rot: 'Salário mínimo', val: 'R$ ' + br(sal[sel], 0) }
    ]
  }, c);
  let iMin = S.start, iMax = S.start;
  for (let i = S.start; i <= S.end; i++) {
    if (lit[i] === null) continue;
    if (lit[iMin] === null || lit[i] < lit[iMin]) iMin = i;
    if (lit[iMax] === null || lit[i] > lit[iMax]) iMax = i;
  }
  $('lit-resumo').textContent = 'No período escolhido, o pior mês foi ' + lab(iMin) + ' (' + lit[iMin] + ' litros) e o melhor foi ' + lab(iMax) + ' (' + lit[iMax] + ' litros).';
}

function renderMunicipios(c) {
  const { selJ, len, salR } = c;
  const sel = S.sel;
  const chosen = S.cities.map((id) => BYID[id]).filter(Boolean);
  const mv = (x) => salR.map((_, j) => (x.p[S.start + j] > 0 ? x.p[S.start + j] / 100 : null));
  const series = [c.gasR].concat(chosen.map(mv));
  let todos = [];
  series.forEach((a) => { todos = todos.concat(a.filter(nn)); });
  const sc = nice(Math.min(...todos), Math.max(...todos), [0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5]);
  const cores = [CINZA].concat(SLOT);
  const paths = series.map((a, i) => ({ d: caminho(a, sc, false, len), cor: cores[i], w: i === 0 ? 2 : 2.5, dash: i === 0 ? '3 5' : '' }));
  const dots = [];
  series.forEach((a, i) => { if (a[selJ] !== null) dots.push({ top: ypct(a[selJ], sc) + '%', cor: cores[i] }); });
  const tip = [{ cor: CINZA, rot: 'Brasil', val: gas[sel] === null ? 'sem pesquisa' : 'R$ ' + br(gas[sel], 2) }]
    .concat(chosen.map((x, i) => ({ cor: SLOT[i], rot: x.label, val: x.p[sel] > 0 ? 'R$ ' + br(x.p[sel] / 100, 2) : 'sem pesquisa' })));
  plotar('cm', { grid: gradeNum(sc, 2), paths, dots, tip }, c);

  $('escolhidos').innerHTML = '<span class="tag fixo"><i class="traco" style="width:10px;border-top:3px dashed ' + CINZA + '"></i>Brasil</span>' +
    chosen.map((x, i) => '<span class="tag"><span class="sw" style="background:' + SLOT[i] + '"></span>' + esc(x.label) +
      '<button type="button" data-remove="' + esc(x.id) + '" aria-label="Remover ' + esc(x.label) + '">×</button></span>').join('');
  $('contagem').textContent = chosen.length + ' de 4 municípios escolhidos. Ao escolher o quinto, o mais antigo sai.';

  $('mun-tabela-titulo').textContent = 'Comparação em ' + labLongo(sel);
  let rows = '<tr><td><span class="sw" style="background:' + CINZA + ';margin-right:8px"></span>Brasil (média nacional)</td><td><strong>' +
    (gas[sel] === null ? '—' : 'R$ ' + br(gas[sel], 2)) + '</strong></td><td>—</td><td>—</td><td><strong>' + (lit[sel] === null ? '—' : lit[sel]) + '</strong></td></tr>';
  chosen.forEach((x, i) => {
    const pv = x.p[sel] > 0 ? x.p[sel] / 100 : null;
    const dv = pv !== null && gas[sel] !== null ? pv - gas[sel] : null;
    rows += '<tr><td><span class="sw" style="background:' + SLOT[i] + ';margin-right:8px"></span>' + esc(x.label) + '</td><td><strong>' +
      (pv === null ? 'sem pesquisa' : 'R$ ' + br(pv, 2)) + '</strong></td><td>' +
      (dv === null ? '—' : (dv > 0 ? '+' : dv < 0 ? '−' : '') + 'R$ ' + br(Math.abs(dv), 2) + ' (' + fp(pct(pv, gas[sel])) + ')') +
      '</td><td>' + x.postos + '</td><td><strong>' + (pv === null ? '—' : Math.round(sal[sel] / pv)) + '</strong></td></tr>';
  });
  $('mun-corpo').innerHTML = rows;

  const disp = LIST.filter((x) => x.p[sel] > 0).sort((a, b) => a.p[sel] - b.p[sel]);
  const rk = (x) => '<div class="rk"><span>' + esc(x.label) + ' <small>· ' + x.postos + ' postos</small></span><span class="dir"><strong>R$ ' + br(x.p[sel] / 100, 2) +
    '</strong><button type="button" class="btn mini" data-add="' + esc(x.id) + '" aria-label="Comparar ' + esc(x.label) + '">Comparar</button></span></div>';
  $('rk-caros').textContent = 'Mais caros em ' + labLongo(sel);
  $('rk-baratos').textContent = 'Mais baratos em ' + labLongo(sel);
  $('lista-caros').innerHTML = disp.slice(-5).reverse().map(rk).join('');
  $('lista-baratos').innerHTML = disp.slice(0, 5).map(rk).join('');
}

function renderBusca() {
  const qn = norm(S.q);
  let res = [];
  if (qn.length >= 2) {
    res = LIST.filter((x) => S.cities.indexOf(x.id) < 0 && x.norm.indexOf(qn) >= 0)
      .sort((a, b) => ((a.norm.indexOf(qn) === 0 ? 0 : 1) - (b.norm.indexOf(qn) === 0 ? 0 : 1)) || (a.label < b.label ? -1 : 1))
      .slice(0, 8);
  }
  $('resultados').innerHTML = res.map((x) => '<button type="button" class="chip" data-add="' + esc(x.id) + '">+ ' + esc(x.label) + '</button>').join('');
  $('sem-resultado').hidden = !(qn.length >= 2 && res.length === 0);
}

function renderEventos() {
  const vis = EV.map((e, i) => Object.assign({ i }, e)).filter((e) => e.b >= S.start && e.a <= S.end);
  $('sem-eventos').hidden = vis.length > 0;
  $('eventos').innerHTML = vis.map((e) =>
    '<article class="evento"><div class="linha"><span class="selo ' + (e.dir === 'up' ? 'alta' : 'queda') + '">' + (e.dir === 'up' ? 'Alta' : 'Queda') + '</span><span class="muted">' +
    (e.a === e.b ? labLongo(e.a) : lab(e.a) + ' a ' + lab(e.b)) + '</span></div><h3>' + esc(e.titulo) + '</h3>' +
    '<div class="texto">Gasolina: <strong>' + esc(e.change) + '</strong> ' + esc(e.precos) + '</div><p>' + esc(e.texto) + '</p>' +
    '<div><button type="button" class="btn" data-ev="' + e.i + '" style="color:var(--link)">Ver no gráfico</button></div></article>').join('');
}
})();

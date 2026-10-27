(function () {
'use strict';
const C = window.CONTEUDO;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => (n == null || isNaN(n)) ? '—' : Number(n).toLocaleString('pt-BR');
const pc = (a, b, d = 1) => b ? (100 * a / b).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }) + '%' : '—';
const pp = x => (x >= 0 ? '+' : '') + (100 * x).toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + ' p.p.';
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const IDX = { apt: 0, comp: 1, abst: 2, l: 3, f: 4, o: 5, br: 6, nu: 7, val: 8 };
const margem = t => t && t[8] ? (t[3] - t[4]) / t[8] : null;
let G = null, GU = null, U = null, M = null, R = null, modo = 't2', ufSel = '', byCod = {};

// ---------- tooltips ----------
const tip = $('#tip');
function showTip(el) {
  const t = el.getAttribute('data-tip'); if (!t) return;
  tip.textContent = t; tip.hidden = false;
  const r = el.getBoundingClientRect();
  const w = tip.offsetWidth, h = tip.offsetHeight;
  let x = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), innerWidth - w - 8);
  let y = r.top - h - 8; if (y < 8) y = r.bottom + 8;
  tip.style.left = x + 'px'; tip.style.top = y + 'px';
}
document.addEventListener('mouseover', e => { const el = e.target.closest('[data-tip]'); if (el) showTip(el); });
document.addEventListener('mouseout', e => { if (e.target.closest('[data-tip]')) tip.hidden = true; });
document.addEventListener('click', e => { const el = e.target.closest('[data-tip]'); if (el) showTip(el); else tip.hidden = true; });
document.addEventListener('scroll', () => { tip.hidden = true; }, true);

// ---------- abas ----------
$$('.tabs button').forEach(b => b.addEventListener('click', () => {
  $$('.tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
  $$('.panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + b.dataset.tab));
  if (b.dataset.tab === 'mapa' && map) setTimeout(() => map.invalidateSize(), 50);
  scrollTo({ top: 0 });
}));

// ---------- fontes ----------
function badge(id) {
  const f = C.fontes[id]; if (!f) return '';
  return `<a class="badge ${f.esp}" href="${esc(f.url)}" target="_blank" rel="noopener" data-tip="${esc(f.nome + ' — ' + C.espectros[f.esp] + '. ' + f.nota)}">${esc(f.nome)} · ${esc(C.espectros[f.esp])}</a>`;
}
const badges = ids => ids.map(badge).join(' ');
const CONF = { ok: ['Confirmado', 'conf-ok', 'Confirmado por fonte oficial ou por duas ou mais fontes.'], al: ['Alegado / parcial', 'conf-al', 'Relatado por uma parte ou por fonte única; sem confirmação independente ainda.'], di: ['Desmentido', 'conf-di', 'Desmentido por fonte oficial ou por checagem.'], nv: ['Não verificado', 'conf-nv', 'Visto apenas em manchete ou resumo; conteúdo não lido.'] };
const conf = k => `<span class="conf ${CONF[k][1]}" data-tip="${esc(CONF[k][2])}">${CONF[k][0]}</span>`;

// ---------- dados ----------
async function j(u) { const r = await fetch(u); if (!r.ok) throw new Error(u + ' ' + r.status); return r.json(); }
let map, pMun = null;
// Município: malha (3,6 MB) + dados. Só é necessário ao abrir um estado; carrega uma vez, em segundo plano.
function carregarMun() {
  if (!pMun) pMun = Promise.all([j('data/geo/brasil.json'), j('data/municipios.json')]).then(([g, m]) => {
    G = g; M = m; byUF = {};
    G.features.forEach(f => { const u = UFCOD[String(f.properties.codarea).slice(0, 2)]; (byUF[u] = byUF[u] || []).push(f); });
    renderHorario(); renderAnalise(); return true;
  }).catch(e => { pMun = null; console.error(e); return false; });
  return pMun;
}
async function init() {
  renderFontes(); renderOcorrencias();
  try { [GU, U, R] = await Promise.all([j('data/geo/uf.json'), j('data/ufs.json'), j('data/resumo.json')]); }
  catch (e) { $('#resumo').innerHTML = `<div class="box warn">Os dados ainda não foram gerados (${esc(e.message)}). Rode <code>scripts/build_dados.ps1</code>.</div>`; renderHorario(); renderAnalise(); return; }
  const parcial = (R.falhas || []).length;
  if (parcial) $('#resumo').insertAdjacentHTML('beforebegin', `<div class="box warn"><b>Dados parciais:</b> ${fmt(parcial)} arquivos municipais do TSE ainda não foram baixados (o download é feito aos poucos para não sobrecarregar o servidor do TSE). Municípios sem dados aparecem em cinza e os totais abaixo usam só os baixados.</div>`);
  try { renderResumo(); } catch (e) { console.error(e); }
  montarUF(); montarMapa(); renderHorario(); renderAnalise();
  carregarMun(); // malha e dados dos municípios (maiores) carregam em segundo plano
  const o = R.oficial && R.oficial.t2;
  $('#atualizado').textContent = `Dados do TSE (2º turno) gerados em ${o ? o.geradoEm : '—'} · seções apuradas: ${o ? o.secoesApuradasPct + '%' : '—'} · pesquisa de notícias em ${C.pesquisadoEm}.`;
}

function renderResumo() {
  const sum = R.somaMunicipios;
  const pega = k => {
    const o = R.oficial && R.oficial[k];
    if (o) return { l: o.candidatos.find(c => c.n === '13').votos, f: o.candidatos.find(c => c.n === '22').votos, val: o.validos, br: o.brancos, nu: o.nulos, comp: o.comparecimento, apt: o.aptos, abst: o.abstencao };
    const s = sum[k]; return { l: s[3], f: s[4], val: s[8], br: s[6], nu: s[7], comp: s[1], apt: s[0], abst: s[2] };
  };
  const sg = n => (n > 0 ? '+' : '') + fmt(n);
  const sp = x => (x > 0 ? '+' : '') + (100 * x).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' p.p.';
  if (modo === 'mud') {
    const a = pega('t1'), b = pega('t2');
    $('#resumo').innerHTML = `
     <div class="card f" data-tip="Variação dos votos de Flávio do 1º para o 2º turno (4/10 → 25/10). Entre parênteses, a variação da sua parcela dos votos válidos em pontos percentuais."><b>${sg(b.f - a.f)}</b><span>Flávio · ${sp(b.f / b.val - a.f / a.val)} dos válidos<br>${pc(a.f, a.val, 2)} → ${pc(b.f, b.val, 2)}</span></div>
     <div class="card l" data-tip="Variação dos votos de Lula do 1º para o 2º turno (4/10 → 25/10)."><b>${sg(b.l - a.l)}</b><span>Lula · ${sp(b.l / b.val - a.l / a.val)} dos válidos<br>${pc(a.l, a.val, 2)} → ${pc(b.l, b.val, 2)}</span></div>
     <div class="card" data-tip="Variação de brancos + nulos. Não entram nos votos válidos."><b>${sg((b.br + b.nu) - (a.br + a.nu))}</b><span>Brancos+nulos · de ${fmt(a.br + a.nu)} para ${fmt(b.br + b.nu)}</span></div>
     <div class="card" data-tip="Variação do comparecimento (percentual sobre os aptos)."><b>${sp(b.comp / b.apt - a.comp / a.apt)}</b><span>Comparecimento · ${pc(a.comp, a.apt)} → ${pc(b.comp, b.apt)}</span></div>`;
    return;
  }
  const v = pega(modo), tn = modo === 't1' ? '1º turno (04/10/2026)' : '2º turno (25/10/2026)';
  const so = modo === 't1' ? '' : '';
  $('#resumo').innerHTML = `
   <div class="card f" data-tip="Votos nominais válidos de Flávio Bolsonaro (PL) no ${tn}, segundo o TSE."><b>${fmt(v.f)}</b><span>Flávio Bolsonaro · ${pc(v.f, v.val, 2)} dos válidos<br>${modo === 't1' ? '1º' : '2º'} turno</span></div>
   <div class="card l" data-tip="Votos nominais válidos de Lula (PT) no ${tn}, segundo o TSE."><b>${fmt(v.l)}</b><span>Lula · ${pc(v.l, v.val, 2)} dos válidos<br>${modo === 't1' ? '1º' : '2º'} turno</span></div>
   <div class="card" data-tip="Brancos e nulos do ${tn}. Não entram no cálculo de votos válidos."><b>${fmt(v.br + v.nu)}</b><span>Brancos ${fmt(v.br)} · nulos ${fmt(v.nu)}</span></div>
   <div class="card" data-tip="Comparecimento = eleitores que votaram. Abstenção = aptos que não compareceram."><b>${pc(v.comp, v.apt)}</b><span>${fmt(v.comp)} de ${fmt(v.apt)} aptos · abst. ${fmt(v.abst)}</span></div>`;
}

const UFCOD = { 11: 'RO', 12: 'AC', 13: 'AM', 14: 'RR', 15: 'PA', 16: 'AP', 17: 'TO', 21: 'MA', 22: 'PI', 23: 'CE', 24: 'RN', 25: 'PB', 26: 'PE', 27: 'AL', 28: 'SE', 29: 'BA', 31: 'MG', 32: 'ES', 33: 'RJ', 35: 'SP', 41: 'PR', 42: 'SC', 43: 'RS', 50: 'MS', 51: 'MT', 52: 'GO', 53: 'DF' };
const UFNOME = { RO: 'Rondônia', AC: 'Acre', AM: 'Amazonas', RR: 'Roraima', PA: 'Pará', AP: 'Amapá', TO: 'Tocantins', MA: 'Maranhão', PI: 'Piauí', CE: 'Ceará', RN: 'Rio Grande do Norte', PB: 'Paraíba', PE: 'Pernambuco', AL: 'Alagoas', SE: 'Sergipe', BA: 'Bahia', MG: 'Minas Gerais', ES: 'Espírito Santo', RJ: 'Rio de Janeiro', SP: 'São Paulo', PR: 'Paraná', SC: 'Santa Catarina', RS: 'Rio Grande do Sul', MS: 'Mato Grosso do Sul', MT: 'Mato Grosso', GO: 'Goiás', DF: 'Distrito Federal' };
let ufLayer = null, munLayer = null, byUF = {}, DFZ = null;

function montarUF() {
  const ufs = Object.keys(UFNOME).sort();
  $('#uf').innerHTML = '<option value="">Brasil (estados)</option>' + ufs.map(u => `<option value="${u}">${u} — ${UFNOME[u]}</option>`).join('');
  $('#uf').addEventListener('change', e => e.target.value ? entrarUF(e.target.value) : sairUF());
  $('#voltar').addEventListener('click', sairUF);
}

const CINZA = { weight: .5, color: '#fff', opacity: .6, fillColor: '#bbb', fillOpacity: .3 };
// Estilo a partir de um registro {t1, t2} (município ou UF)
function estiloRec(m) {
  const base = { weight: .5, color: '#fff', opacity: .7, fillOpacity: .85 };
  if (!m) return CINZA;
  let v, d, mud = false;
  if (modo === 'mud') {
    const a = margem(m.t1), b = margem(m.t2); if (a == null || b == null) return CINZA;
    v = b - a; d = Math.min(1, Math.abs(v) / .10); mud = true;
  } else { const x = margem(m[modo]); if (x == null) return CINZA; v = x; d = Math.min(1, Math.abs(x) / .5); }
  return { ...base, fillColor: v >= 0 ? '#c62828' : '#1f5fbf', fillOpacity: mud ? .2 + .75 * d : .4 + .55 * d };
}
const estilo = f => estiloRec(M[f.properties.codarea]);
const estiloUF = f => estiloRec(U[UFCOD[f.properties.codarea]]);

// Comparativo Lula x Flávio em texto (usado nos tooltips)
function cmp(t, rot) {
  if (!t || !t[8]) return `${rot}: <i>sem dados</i>`;
  const l = t[3], f = t[4], v = t[8], x = (l - f) / v;
  const pct = n => (100 * n / v).toFixed(1).replace('.', ',') + '%';
  return `${rot}: <span style="color:#ff8a80">Lula ${pct(l)}</span> (${fmt(l)}) × <span style="color:#82b1ff">Flávio ${pct(f)}</span> (${fmt(f)})<br>&nbsp;&nbsp;${x >= 0 ? 'Lula' : 'Flávio'} +${(Math.abs(x) * 100).toFixed(1).replace('.', ',')} p.p. · outros candidatos ${t[5] ? pct(t[5]) + ' dos válidos' : '— (2º turno tem só 2 candidatos)'}<br>&nbsp;&nbsp;brancos+nulos: ${fmt(t[6] + t[7])} (${t[1] ? (100 * (t[6] + t[7]) / t[1]).toFixed(1).replace('.', ',') + '% de quem compareceu' : '—'}; não entram nos válidos)`;
}
function tipRec(nome, m, parcial) {
  if (!m) return `<b>${esc(nome)}</b><br>sem dados`;
  const delta = (m.t1 && m.t2 && m.t1[8] && m.t2[8]) ? `<br>Mudança de margem: ${pp(margem(m.t2) - margem(m.t1))}` : '';
  return `<b>${esc(nome)}</b>${parcial ? ' <i>(parcial)</i>' : ''}<br>${cmp(m.t1, '1º turno')}<br>${cmp(m.t2, '2º turno')}${delta}`;
}

function montarMapa() {
  map = L.map('map', { zoomSnap: .25, preferCanvas: false, attributionControl: false, zoomControl: true, minZoom: 3 });
  L.control.attribution({ prefix: false }).addAttribution('Malha: IBGE · Votos: TSE').addTo(map);
  ufLayer = L.geoJSON(GU, {
    style: estiloUF,
    onEachFeature: (f, l) => {
      const u = UFCOD[f.properties.codarea];
      l.on('click', () => entrarUF(u));
      l.bindTooltip(() => tipRec(`${UFNOME[u]} (${u})`, U[u], U[u] && (U[u].p1 || U[u].p2)), { sticky: true, className: 'tipmap' });
    }
  }).addTo(map);
  map.fitBounds(brasilBounds());
  ufLayer.eachLayer(l => { centros[UFCOD[l.feature.properties.codarea]] = l.getBounds().getCenter(); });
  labelLayer = L.layerGroup().addTo(map);
  map.on('zoomend moveend', () => { if (ufSel && ufSel !== 'DF') refreshLabels(); });
  const chk = $('#vals'); chk.checked = mostrarVal;
  chk.addEventListener('change', () => { mostrarVal = chk.checked; try { localStorage.setItem('mostrarVal', mostrarVal ? '1' : '0'); } catch (e) {} refreshLabels(); desenharDFSe(); });
  $$('.seg button').forEach(b => b.addEventListener('click', () => {
    modo = b.dataset.modo; $$('.seg button').forEach(x => x.classList.toggle('on', x === b)); restyle(); legenda(); renderResumo();
  }));
  legenda();
}
// ----- Rótulos de valores sobre o mapa (liga/desliga) -----
let labelLayer = null, centros = {}, mostrarVal = true;
try { mostrarVal = localStorage.getItem('mostrarVal') !== '0'; } catch (e) {}
const LBL_OFF = { RN: [-4.4, -31.5], PB: [-6.2, -31.5], PE: [-8.0, -31.5], AL: [-9.8, -31.5], SE: [-11.6, -31.5], ES: [-19.6, -35.0], RJ: [-24.0, -37.0], DF: [-12.0, -45.0] };
const brn = (x, d = 1) => Math.abs(x).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
// Valor mostrado no rótulo: em "Mudança", variação da margem em p.p. (+ = rumo a Lula, − = rumo a Flávio);
// em 1º/2º turno, a margem do líder (L = Lula, F = Flávio), em p.p. dos válidos.
function valorRec(m) {
  if (!m) return null;
  if (modo === 'mud') { const a = margem(m.t1), b = margem(m.t2); if (a == null || b == null) return null; const d = (b - a) * 100; return { txt: (d >= 0 ? '+' : '−') + brn(d), lula: d >= 0 }; }
  const x = margem(m[modo]); if (x == null) return null; return { txt: (x >= 0 ? 'L +' : 'F +') + brn(x * 100), lula: x >= 0 };
}
function lblIcon(prefixo, v) { return L.divIcon({ className: 'lblwrap', iconSize: [0, 0], html: `<div class="lbl ${v.lula ? 'l' : 'f'}">${prefixo ? prefixo + ' ' : ''}${v.txt}</div>` }); }
function refreshLabels() {
  if (!labelLayer) return; labelLayer.clearLayers();
  $('#valsWrap').hidden = ($('#dfgrid') && !$('#dfgrid').hidden);
  if (!mostrarVal || ufSel === 'DF') return;
  if (ufSel === '') {
    Object.keys(centros).forEach(u => {
      const v = valorRec(U[u]); if (!v) return; const c = centros[u], off = LBL_OFF[u];
      if (off) { L.polyline([c, off], { color: '#888', weight: 1, interactive: false }).addTo(labelLayer); L.marker(off, { icon: lblIcon(u, v), interactive: false }).addTo(labelLayer); }
      else L.marker(c, { icon: lblIcon(u, v), interactive: false }).addTo(labelLayer);
    });
    return;
  }
  // municípios: só os que ocupam espaço suficiente na tela, para não poluir
  if (!munLayer) return;
  const view = map.getBounds(); let n = 0;
  munLayer.eachLayer(l => {
    if (n > 350) return; const b = l.getBounds(); if (!view.intersects(b)) return;
    const p1 = map.latLngToLayerPoint(b.getNorthWest()), p2 = map.latLngToLayerPoint(b.getSouthEast());
    if (Math.abs(p2.x - p1.x) < 44 || Math.abs(p2.y - p1.y) < 20) return;
    const c = l.feature.properties.codarea, v = valorRec(M[c]); if (!v) return; n++;
    L.marker(b.getCenter(), { icon: lblIcon('', v), interactive: false }).addTo(labelLayer);
  });
}
function brasilBounds() { const b = ufLayer.getBounds(); Object.values(LBL_OFF).forEach(p => b.extend(p)); return b.pad(0.03); }
function restyle() {
  if (ufSel === '') ufLayer.setStyle(estiloUF);
  else if (munLayer) munLayer.setStyle(estilo);
  if (ufSel === 'DF') desenharDF();
}
async function entrarUF(u) {
  ufSel = u; $('#uf').value = u; $('#voltar').hidden = false;
  if (map.hasLayer(ufLayer)) map.removeLayer(ufLayer);
  if (munLayer) { map.removeLayer(munLayer); munLayer = null; }
  $('#viewTitle').textContent = `${UFNOME[u]} (${u})`;
  mostrarUFDetalhe(u);
  if (u === 'DF') {
    $('#map').hidden = true; $('#dfgrid').hidden = false; carregarDF(); legenda(); return;
  }
  $('#map').hidden = false; $('#dfgrid').hidden = true; setTimeout(() => map.invalidateSize(), 30);
  if (!M) $('#viewTitle').textContent = `${UFNOME[u]} (${u}) — carregando municípios…`;
  const ok = await carregarMun();
  if (ufSel !== u) return; // usuário já mudou de estado
  $('#viewTitle').textContent = `${UFNOME[u]} (${u})`;
  if (!ok) { $('#viewTitle').textContent += ' — não foi possível carregar os municípios'; return; }
  munLayer = L.geoJSON({ type: 'FeatureCollection', features: byUF[u] || [] }, {
    style: estilo,
    onEachFeature: (f, l) => {
      const c = f.properties.codarea;
      l.on('click', () => mostrarDetalhe(c));
      l.bindTooltip(() => tipRec(`${(M[c] || {}).n || c} — ${u}`, M[c]), { sticky: true, className: 'tipmap' });
    }
  }).addTo(map);
  map.fitBounds(munLayer.getBounds());
  legenda();
}
function sairUF() {
  ufSel = ''; $('#uf').value = ''; $('#voltar').hidden = true; $('#viewTitle').textContent = 'Brasil por estado';
  $('#detalhe').hidden = true;
  $('#map').hidden = false; $('#dfgrid').hidden = true;
  if (munLayer) { map.removeLayer(munLayer); munLayer = null; }
  if (!map.hasLayer(ufLayer)) ufLayer.addTo(map);
  ufLayer.setStyle(estiloUF); setTimeout(() => { map.invalidateSize(); map.fitBounds(brasilBounds()); }, 30);
  legenda();
}
function mostrarUFDetalhe(u) {
  const r = U[u]; const box = $('#detalhe'); box.hidden = false;
  if (!r) { box.innerHTML = `<h3>${esc(UFNOME[u])}</h3><p class="pend">Sem dados.</p>`; return; }
  box.innerHTML = `<h3>${esc(UFNOME[u])} (${u}) — total do estado</h3>${(r.p1 || r.p2) ? '<p class="pend">Total parcial: soma dos municípios já baixados. Será substituído pelo total oficial do estado.</p>' : ''}${tabela(r.t1, r.t2)}<p class="src">Toque num município (ou numa zona, no DF) para ver o detalhe dele.</p>`;
}

// ----- Distrito Federal: um único município; a divisão é por zona eleitoral -----
async function carregarDF() {
  if (!DFZ) { try { const z = await j('data/zonas/df.json'); DFZ = z[Object.keys(z)[0]] || {}; } catch (e) { DFZ = {}; } }
  desenharDF();
}
function desenharDF() {
  const el = $('#dfgrid'); const ks = Object.keys(DFZ || {}).sort((a, b) => a - b);
  if (!ks.length) { el.innerHTML = '<p class="pend">Sem dados por zona para o DF.</p>'; return; }
  el.innerHTML = `<div class="dfwrap">${ks.map(k => {
    const z = DFZ[k]; const st = estiloRec(modo === 't2' && !z.t2 ? { t1: z.t1, t2: z.t1 } : z); const tip = `Zona ${k} (DF)\n` + [z.t1 ? zonaTxt(z.t1, '1º turno') : '', z.t2 ? zonaTxt(z.t2, '2º turno') : '2º turno: aguardando o TSE publicar por zona'].filter(Boolean).join('\n');
    return `<button class="dftile" style="background:${st.fillColor};opacity:${st === CINZA ? .55 : st.fillOpacity}" data-tip="${esc(tip)}" data-zona="${k}"><b>${k}</b>${(() => { const v = mostrarVal && valorRec(modo === 't2' && !z.t2 ? { t1: z.t1, t2: z.t1 } : z); return v ? `<small>${v.txt}</small>` : ''; })()}</button>`;
  }).join('')}</div><p class="note">Cada bloco é uma zona eleitoral do DF (não é a posição geográfica). ${modo === 't2' ? '<b>As cores mostram o 1º turno:</b> o TSE ainda não publicou o 2º turno por zona.' : modo === 'mud' ? 'A visão “Mudança” por zona depende do 2º turno por zona, ainda não publicado (blocos em cinza).' : ''} Não existe malha oficial de zonas nem de regiões administrativas nos dados do TSE.</p>`;
  $$('.dftile', el).forEach(b => b.addEventListener('click', () => mostrarDetalhe('5300108')));
}
function zonaTxt(t, rot) {
  if (!t[8]) return rot + ': sem dados';
  const p = n => (100 * n / t[8]).toFixed(1).replace('.', ',') + '%';
  return `${rot}: Lula ${p(t[3])} (${fmt(t[3])}) × Flávio ${p(t[4])} (${fmt(t[4])}) · outros ${p(t[5])} · aptos ${fmt(t[0])}`;
}

function desenharDFSe() { if (ufSel === 'DF') desenharDF(); }
function legenda() {
  setTimeout(refreshLabels, 0);
  const sw = c => `<span class="sw" style="background:${c}"></span>`;
  $('#legenda').innerHTML = modo === 'mud'
    ? `<span>${sw('#1f5fbf')}Mudou para Flávio</span><span>${sw('#c62828')}Mudou para Lula</span><span class="note">cor mais forte = mudança maior (até 10 p.p.). Rótulo: variação da margem em p.p. (+ rumo a Lula, − rumo a Flávio)</span>`
    : `<span>${sw('#1f5fbf')}Flávio Bolsonaro à frente</span><span>${sw('#c62828')}Lula à frente</span><span class="note">cor mais forte = margem maior (até 50 p.p.). Rótulo: margem do líder (L = Lula, F = Flávio), em p.p.</span>`;
  $('#mapaNota').textContent = ufSel === ''
    ? 'Passe o mouse (ou toque) num estado para ver o comparativo Lula × Flávio; clique para abrir os municípios dele. “À frente” compara apenas Lula e Flávio; os demais candidatos do 1º turno entram em “outros”.'
    : (ufSel === 'DF' ? 'O DF é um único município; veja a divisão por zona eleitoral. Use “← Brasil” para voltar.' : 'Passe o mouse (ou toque) num município para o comparativo; clique para o detalhe e as zonas. Use “← Brasil” para voltar.');
}

// ---------- detalhe ----------
function linhaDet(rot, tip, a, b, tipo, base1, base2) {
  const d = (a != null && b != null) ? b - a : null;
  const p = (v, base) => tipo === 'n' || !base ? '' : ` <span class="src">(${pc(v, base)})</span>`;
  return `<tr class="${tipo === 'l' ? 'l' : tipo === 'f' ? 'f' : ''}"><td data-tip="${esc(tip)}">${rot}</td><td>${a == null ? '—' : fmt(a)}${a == null ? '' : p(a, base1)}</td><td>${b == null ? '—' : fmt(b)}${b == null ? '' : p(b, base2)}</td><td class="${d > 0 ? 'up' : d < 0 ? 'dn' : ''}">${d == null ? '—' : (d > 0 ? '+' : '') + fmt(d)}</td></tr>`;
}
function tabela(t1, t2) {
  const g = (t, i) => t ? t[i] : null;
  return `<div class="tblwrap"><table><tr><th></th><th>1º turno (04/10)</th><th>2º turno (25/10)</th><th>Diferença</th></tr>
   ${linhaDet('Eleitores aptos', 'Eleitores com título regular e aptos a votar na área.', g(t1, 0), g(t2, 0), 'n')}
   ${linhaDet('Comparecimento', 'Quem foi votar. Percentual sobre os aptos.', g(t1, 1), g(t2, 1), 'p', g(t1, 0), g(t2, 0))}
   ${linhaDet('Abstenção', 'Aptos que não compareceram. Percentual sobre os aptos.', g(t1, 2), g(t2, 2), 'p', g(t1, 0), g(t2, 0))}
   ${linhaDet('Flávio Bolsonaro', 'Votos nominais válidos. Percentual sobre os votos válidos.', g(t1, 4), g(t2, 4), 'f', g(t1, 8), g(t2, 8))}
   ${linhaDet('Lula', 'Votos nominais válidos. Percentual sobre os votos válidos.', g(t1, 3), g(t2, 3), 'l', g(t1, 8), g(t2, 8))}
   ${linhaDet('Outros candidatos', 'Soma dos demais candidatos. No 2º turno só há dois candidatos, então o valor é zero.', g(t1, 5), g(t2, 5), 'p', g(t1, 8), g(t2, 8))}
   ${linhaDet('Brancos', 'Votos em branco; não entram nos válidos. Percentual sobre o comparecimento.', g(t1, 6), g(t2, 6), 'p', g(t1, 1), g(t2, 1))}
   ${linhaDet('Nulos', 'Votos nulos (inclui anulados); não entram nos válidos. Percentual sobre o comparecimento.', g(t1, 7), g(t2, 7), 'p', g(t1, 1), g(t2, 1))}
   ${linhaDet('Total apurado (válidos)', 'Votos válidos apurados: Lula + Flávio + outros.', g(t1, 8), g(t2, 8), 'n')}
  </table></div>`;
}
async function mostrarDetalhe(cod) {
  const m = M[cod]; if (!m) return;
  const box = $('#detalhe'); box.hidden = false;
  const mm = margem(m.t2), m1 = margem(m.t1);
  box.innerHTML = `<h3>${esc(m.n)} — ${m.u}</h3>
   <p class="src">${m.z.length} zona(s) eleitoral(is). ${m1 != null && mm != null ? 'Margem Lula–Flávio: ' + pp(m1) + ' no 1º turno → ' + pp(mm) + ' no 2º.' : ''}</p>
   ${tabela(m.t1, m.t2)}<h3>Por zona eleitoral</h3><div id="zonas" class="src">Carregando zonas…</div>`;
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  try {
    const z = await j(`data/zonas/${m.u.toLowerCase()}.json`);
    const mz = z[m.c];
    if (!mz) { $('#zonas').innerHTML = '<span class="pend">Sem dados por zona para este município.</span>'; return; }
    const ks = Object.keys(mz).sort((a, b) => a - b);
    $('#zonas').innerHTML = `<div class="zonas">${ks.map(k => zonaCard(k, mz[k])).join('')}</div>
     <p class="pend">2º turno por zona: aguardando publicação do CSV por zona pelo TSE (hoje só o 1º turno está nos Dados Abertos). Os totais do município acima já incluem o 2º turno.</p>`;
  } catch (e) { $('#zonas').innerHTML = '<span class="pend">Dados por zona ainda não disponíveis neste conjunto.</span>'; }
}
function zonaCard(k, z) {
  const a = z.t1, b = z.t2;
  const bar = t => { const tot = t[3] + t[4] + t[5]; return tot ? `<div class="bar"><i style="width:${100 * t[4] / tot}%;background:var(--flavio)"></i><i style="width:${100 * t[5] / tot}%;background:var(--neutro)"></i><i style="width:${100 * t[3] / tot}%;background:var(--lula)"></i></div>` : ''; };
  const resumo = (t) => `<span class="src">Flávio ${fmt(t[4])} (${pc(t[4], t[8])}) · Lula ${fmt(t[3])} (${pc(t[3], t[8])}) · outros ${fmt(t[5])}<br>aptos ${fmt(t[0])} · compar. ${fmt(t[1])} · abst. ${fmt(t[2])} · brancos ${fmt(t[6])} · nulos ${fmt(t[7])} · válidos ${fmt(t[8])}</span>`;
  return `<div class="zona"><b>Zona ${k}</b>
    <div data-tip="1º turno (04/10/2026) nesta zona. Barra: azul = Flávio, cinza = outros, vermelho = Lula.">1º turno${a ? bar(a) + resumo(a) : '<br><span class="pend">sem dado</span>'}</div>
    <div style="margin-top:6px">2º turno${b ? bar(b) + resumo(b) : '<br><span class="pend">aguardando o TSE</span>'}</div></div>`;
}

// ---------- horário ----------
function citadosTabela(lista) {
  const idx = {}; Object.values(M).forEach(m => { idx[m.u + norm(m.n)] = m; });
  let A1 = [0, 0, 0], A2 = [0, 0, 0], falta = 0;
  const linhas = lista.map(([uf, nome]) => {
    const m = idx[uf + norm(nome)];
    if (!m || !m.t1 || !m.t2) { falta++; return `<tr><td>${esc(nome)}-${uf}</td><td colspan="4" class="pend" style="text-align:left">sem dados</td></tr>`; }
    A1[0] += m.t1[0]; A1[1] += m.t1[2]; A2[0] += m.t2[0]; A2[1] += m.t2[2];
    const a1 = m.t1[2] / m.t1[0], a2 = m.t2[2] / m.t2[0];
    return `<tr><td>${esc(m.n)}-${uf}</td><td>${fmt(m.t2[0])}</td><td>${pc(m.t1[2], m.t1[0])}</td><td>${pc(m.t2[2], m.t2[0])}</td><td class="${a2 - a1 > 0 ? 'dn' : 'up'}">${pp(a2 - a1)}</td></tr>`;
  }).join('');
  const t1 = A1[1] / A1[0], t2 = A2[1] / A2[0];
  return { html: `<div class="tblwrap"><table><tr><th>Município</th><th>Aptos</th><th>Abst. 1º</th><th>Abst. 2º</th><th>Δ</th></tr>${linhas}<tr><td><b>Conjunto${falta ? ' (parcial: ' + falta + ' sem dados)' : ''}</b></td><td><b>${fmt(A2[0])}</b></td><td><b>${pc(A1[1], A1[0])}</b></td><td><b>${pc(A2[1], A2[0])}</b></td><td><b>${pp(t2 - t1)}</b></td></tr></table></div>`, d: t2 - t1, aptos: A2[0] };
}
let HOR = null;
function renderHorario() {
  const el = $('#tab-horario');
  const nac = R && R.oficial && R.oficial.t1 && R.oficial.t2 ? (R.oficial.t2.abstencao / R.oficial.t2.aptos - R.oficial.t1.abstencao / R.oficial.t1.aptos) : null;
  let cit = '';
  if (M) {
    const pt = citadosTabela(C.citados.pt), pl = citadosTabela(C.citados.pl); HOR = { pt, pl, nac };
    cit = `<h2>Comparecimento nos municípios citados</h2>
     <p>Abstenção do 1º para o 2º turno nos municípios apontados em cada pedido. ${nac != null ? `No país, a abstenção variou <b>${pp(nac)}</b>.` : ''}</p>
     <div class="two"><div class="box"><h3 style="margin-top:0"><span class="sw" style="background:var(--lula)"></span>Pedido da campanha de Lula (BA)</h3>${pt.html}</div>
     <div class="box"><h3 style="margin-top:0"><span class="sw" style="background:var(--flavio)"></span>Pedido da campanha de Flávio (SP, PR, SC)</h3>${pl.html}</div></div>
     <p class="note">${esc(C.citadosNota)} Uma variação de abstenção maior ou menor que a nacional não prova efeito do horário nem da chuva ou dos ônibus: a abstenção também muda por clima de campanha, perfil do eleitorado e voto em trânsito.</p>`;
  }
  el.innerHTML = `
   <h2>O que aconteceu em 25/10</h2>
   <p>Linha do tempo reconstruída a partir da cobertura. Cor do ponto: <span class="sw" style="background:var(--lula)"></span>campanha de Lula · <span class="sw" style="background:var(--flavio)"></span>campanha de Flávio · <span class="sw" style="background:var(--ink)"></span>Justiça/TSE/STF.</p>
   <ul class="tl">${C.linhaDoTempo.map(i => `<li class="${i.lado}"><time>${esc(i.h)}</time> ${conf(i.conf)} ${esc(i.t)}<div>${badges(i.f)}</div>${i.obs ? `<div class="src">⚠ ${esc(i.obs)}</div>` : ''}</li>`).join('')}</ul>
   <h2>Perguntas centrais</h2>
   ${C.horarioPerguntas.map(p => `<div class="box"><b>${esc(p.q)}</b><p>${esc(p.a)}</p><div>${badges(p.f)}</div></div>`).join('')}
   ${cit}`;
}

// ---------- ocorrências ----------
function renderOcorrencias() {
  const esp = Object.keys(C.espectros).filter(k => k !== 'nc');
  const cont = {}; esp.forEach(k => cont[k] = 0);
  C.casos.forEach(c => { const s = new Set(c.f.map(i => C.fontes[i].esp)); s.forEach(k => { if (cont[k] != null) cont[k]++; }); });
  $('#tab-ocorrencias').innerHTML = `
   <h2>Números oficiais do dia</h2>
   <div class="box warn"><b>Atenção:</b> os balanços mudam ao longo do dia e entre órgãos. Onde há divergência, ela está indicada.</div>
   <div class="tblwrap"><table><tr><th>Indicador</th><th>Valor</th></tr>${C.numerosOficiais.map(n => `<tr><td>${esc(n.t)}<div>${badges(n.f)}</div>${n.obs ? `<div class="src">${esc(n.obs)}</div>` : ''}</td><td><b>${esc(n.v)}</b></td></tr>`).join('')}</table></div>
   <h2>Vídeos e postagens em redes sociais</h2>
   <div class="box warn"><b>Limitação desta página:</b>
    <p>Este resumo <b>não consegue coletar nem filtrar vídeos do Instagram</b> (nem de outras redes) sobre violência, adesivos em urnas ou agressões, de nenhum dos lados. Os motivos: as redes exigem login e bloqueiam coleta automática; não há como ver, de forma confiável, onde, quando e por quem um vídeo foi gravado; e vídeos virais costumam circular fora de contexto, ser de outras eleições ou ser editados.</p>
    <p>Por isso, o que vem de redes sociais só entra como <span class="conf conf-nv">Não verificado</span>, com a moldura tracejada, e apenas quando alguém nos informa o caso. Ele passa a <span class="conf conf-ok">Confirmado</span> quando há fonte oficial (TSE, TRE, polícia, Ministério da Justiça) ou reportagem identificável.</p>
    <p><b>Como pesar um vídeo desses:</b> veja se há local e data verificáveis, se algum veículo ou órgão oficial confirmou, e se a mesma cena já circulou em outra eleição. A ausência de um caso aqui não significa que ele não ocorreu, e a presença de um vídeo viral não prova que ocorreu como descrito. Por isso, não dá para comparar a quantidade de casos “de cada lado”: a amostra reflete o que foi documentado, não o que aconteceu.</p></div>
   <h2>Casos documentados</h2>
   <div class="box warn"><b>Como ler:</b> casos <span class="conf conf-ok">Confirmado</span> têm fonte oficial ou duas ou mais fontes. Casos <span class="conf conf-al">Alegado / parcial</span> e <span class="conf conf-nv">Não verificado</span> também aparecem, mas <b>não são confirmados</b>: eles trazem uma moldura tracejada e dizem o que falta para confirmar. Cada caso informa <i>quem foi apontado como prejudicado pela fonte</i>; não inferimos o lado.</div>
   ${C.casos.map(c => `<div class="box ${c.conf === 'ok' ? '' : 'unconf'}"><b>${esc(c.titulo)}</b> ${conf(c.conf)}${c.conf === 'ok' ? '' : ' <b class="aviso">NÃO CONFIRMADO</b>'}<div class="src">${esc(c.tipo)} · ${esc(c.lado)}</div><p>${esc(c.txt)}</p>${c.falta ? `<p class="falta">${esc(c.falta)}</p>` : ''}<div>${c.f.length ? badges(c.f) : '<span class="src">Nenhuma fonte jornalística ou oficial localizada.</span>'}</div></div>`).join('')}
   <h2>Casos por lado apontado como prejudicado</h2>
   <p>Contagem dos casos acima, conforme o que a <b>fonte</b> diz sobre quem foi atingido (não é nosso julgamento). Não inclui eventos que a fonte não atribui a um lado.</p>
   <div class="tblwrap"><table><tr><th>Lado apontado</th><th>Confirmado</th><th>Alegado / parcial</th><th>Não verificado</th><th>Desmentido</th></tr>${[['lula', 'Eleitores/apoiadores de Lula/PT'], ['flavio', 'Eleitores/apoiadores de Flávio/PL'], ['ambos', 'Ambos os lados'], ['nd', 'Sem lado informado']].map(([k, r]) => `<tr><td>${r}</td>${['ok', 'al', 'nv', 'di'].map(c => `<td>${C.casos.filter(x => x.tag === k && x.conf === c).length}</td>`).join('')}</tr>`).join('')}</table></div>
   <p class="note">Leia com cuidado: a maior parte dos casos de violência vem de uma fonte de esquerda (Fórum) e de portais regionais. Não achamos, em veículos de direita, relatos equivalentes de apoiadores de Flávio agredidos, e o caso mais claro do lado de Flávio é a contestação do resultado (e a alegação sobre os fiscais na sala-cofre, desmentida pelo TSE). Isso pode refletir o que cada lado publica, e não a distribuição real. Por isso os números não devem ser lidos como “quem sofreu mais”.</p>
   <h2>Quantos casos cada espectro cobriu</h2>
   <p>Número de casos acima que têm ao menos uma fonte de cada espectro. A amostra é pequena e reflete o que foi possível ler, não o que cada veículo publicou.</p>
   <div class="tblwrap"><table><tr><th>Espectro das fontes</th><th>Casos</th></tr>${esp.map(k => `<tr><td><span class="badge ${k}">${esc(C.espectros[k])}</span></td><td>${cont[k]} de ${C.casos.length}</td></tr>`).join('')}</table></div>
   <h2>Contexto histórico</h2>
   ${C.contexto.map(c => `<div class="box"><p>${esc(c.t)}</p><div>${badges(c.f)}</div><div class="src">${esc(c.obs)}</div></div>`).join('')}
   <h2>Lacunas desta versão</h2>
   <div class="box warn"><ul>${C.lacunas.map(l => `<li>${esc(l)}</li>`).join('')}</ul></div>`;
}

// ---------- análise ----------
function renderAnalise() {
  const el = $('#tab-analise');
  let dados = '';
  const tt = k => { const o = R && R.oficial && R.oficial[k]; if (o) return o; const s = R && R.somaMunicipios && R.somaMunicipios[k]; return s ? { aptos: s[0], comparecimento: s[1], abstencao: s[2], validos: s[8], brancos: s[6], nulos: s[7], candidatos: [{ n: '13', votos: s[3] }, { n: '22', votos: s[4] }], parcial: true } : null; };
  if (R && tt('t1') && tt('t2')) {
    const a = tt('t1'), b = tt('t2');
    const aviso = (a.parcial || b.parcial) ? `<div class="box warn"><b>Números parciais:</b> calculados só com os municípios já baixados do TSE. Serão atualizados quando o download for concluído.</div>` : `<p class="note">Totais nacionais oficiais do TSE. O mapa e as tabelas por município ainda estão sendo completados.</p>`;
    const L2 = b.candidatos.find(c => c.n === '13').votos, F2 = b.candidatos.find(c => c.n === '22').votos;
    const L1 = a.candidatos.find(c => c.n === '13').votos, F1 = a.candidatos.find(c => c.n === '22').votos;
    const dif2 = L2 - F2, dif1 = L1 - F1;
    const ab1 = a.abstencao / a.aptos, ab2 = b.abstencao / b.aptos;
    const tot1 = a.validos, tot2 = b.validos;
    const conjAptos = HOR ? HOR.pt.aptos + HOR.pl.aptos : null;
    dados = `<h2>O que os dados mostram</h2>${aviso}
     <ul>
      <li><b>Resultado:</b> Lula ${fmt(L2)} (${pc(L2, tot2, 2)}) × Flávio ${fmt(F2)} (${pc(F2, tot2, 2)}). Diferença de <b>${fmt(dif2)}</b> votos (${pc(dif2, tot2, 2)} dos válidos). No 1º turno a diferença era de ${fmt(Math.abs(dif1))} votos a favor de ${dif1 < 0 ? 'Flávio' : 'Lula'}.</li>
      <li><b>Mudança entre turnos:</b> Lula foi de ${pc(L1, tot1, 2)} para ${pc(L2, tot2, 2)} dos válidos; Flávio, de ${pc(F1, tot1, 2)} para ${pc(F2, tot2, 2)}. Os demais candidatos somaram ${pc(tot1 - L1 - F1, tot1, 2)} no 1º turno.</li>
      <li><b>Comparecimento:</b> abstenção de ${pc(a.abstencao, a.aptos, 2)} no 1º turno e ${pc(b.abstencao, b.aptos, 2)} no 2º (${pp(ab2 - ab1)}).</li>
      <li><b>Dimensão dos pedidos de horário:</b> os municípios citados nos dois pedidos (somente os que já têm dados baixados) somam ${conjAptos ? fmt(conjAptos) : '—'} eleitores aptos. A margem do resultado (${fmt(dif2)} votos) é ${conjAptos ? (dif2 / conjAptos * 100).toFixed(1).replace('.', ',') + '% desse total' : '—'}. Como a decisão valeu para todo o país, o universo potencialmente afetado é maior que os municípios citados.</li>
      <li><b>Conta simples sobre o efeito do horário:</b> para o vencedor mudar, as duas horas extras teriam de ter acrescentado mais de ${fmt(dif2)} votos líquidos para um único lado (cada voto extra reduz a diferença em 1). Isso equivale a ${pc(dif2, b.aptos, 1)} de todos os eleitores aptos do país e a ${pc(dif2, b.comparecimento, 1)} de quem compareceu. Seria preciso um efeito líquido muito grande e a favor de um só lado, o que não aparece em nenhum dado que temos. Esta conta mostra a ordem de grandeza; ela não mede o efeito real do horário nem prova ausência de efeito.</li>
     </ul>`;
  } else dados = '<p class="pend">Dados de votação ainda não carregados.</p>';
  el.innerHTML = `<h2>Análise imparcial</h2>
   <p>Esta aba só compara o que está nos dados e nas fontes das outras abas. Não atribui intenção a ninguém.</p>
   ${dados}
   <h2>O que se pode afirmar</h2>
   <ul>
    <li>Duas campanhas pediram extensão do horário com justificativas distintas e para regiões distintas: transporte (PT) e chuvas (PL). Ambas foram mencionadas por Zanin em sua nota.</li>
    <li>A decisão foi única, do STF, e valeu para as seções ainda abertas em todo o país, o que inclui os locais citados por ambos os lados.</li>
    <li>Pela primeira vez em nossa busca, houve prorrogação geral do horário. O precedente conhecido é a regra de senhas para quem estava na fila.</li>
    <li>Os balanços oficiais não atribuem as ocorrências criminais a nenhum candidato; as atribuições de “lado prejudicado” vêm das campanhas.</li>
   </ul>
   <h2>O que não se pode afirmar (ainda)</h2>
   <ul>
    <li><b>Que a prorrogação mudou o resultado, ou favoreceu um lado.</b> Não há dado por seção do horário de fechamento nem do voto de quem votou após as 17h. O resultado só poderia ser testado com os boletins de urna por seção, que o TSE ainda não publicou para o 2º turno.</li>
    <li><b>Que os eventos de cada lado tiveram o mesmo peso.</b> Faltam números comparáveis: o PT citou falhas de transporte em vários Estados; o PL citou números de eleitores com seções transferidas só em Curitiba, Guaratuba e Itapevi.</li>
    <li><b>Qualquer conclusão sobre fake news ou violência no 2º turno.</b> Não há, até aqui, checagens ou casos individuais suficientes e bem fontados.</li>
    <li><b>“Voto útil”.</b> O TSE não mede isso. A comparação de colunas entre turnos é agregada e não diz de onde veio cada voto.</li>
   </ul>
   <h2>Próximos passos para melhorar a análise</h2>
   <ul>
    <li>Quando o TSE publicar o 2º turno por zona e por seção (Dados Abertos), rodar de novo <code>scripts/build_dados.ps1</code>: o mapa e o detalhe por zona passam a mostrar o 2º turno.</li>
    <li>Ler a íntegra da decisão de Zanin, a manifestação do MPE e as notas oficiais de TRE-BA e Prefeitura de Salvador.</li>
    <li>Ampliar a cobertura de veículos de direita e esquerda sobre a prorrogação.</li>
   </ul>`;
}

// ---------- fontes e método ----------
function renderFontes() {
  const ids = Object.keys(C.fontes);
  $('#tab-fontes').innerHTML = `
   <h2>Critério de espectro dos veículos</h2>
   <div class="box"><p>A classificação é <b>nossa e discutível</b>. Usamos: (1) linha editorial declarada pelo próprio veículo; (2) histórico de cobertura e de opinião; (3) estudos públicos de mídia, quando existem. Sem base suficiente, o veículo fica como <i>Não classificado</i>. Fontes oficiais (TSE, Ministério da Justiça, Senado) aparecem à parte.</p>
   <p>Meta de equilíbrio: priorizar centro-esquerda e centro-direita e incluir veículos dos extremos como contraponto. Nesta versão há mais veículos de centro e poucos de direita e esquerda lidos de fato; veja as lacunas na aba Ocorrências.</p>
   <p class="src">Para trocar uma classificação, edite <code>data/conteudo.js</code> (campo <code>esp</code>).</p></div>
   <h2>Fontes usadas</h2>
   <div class="tblwrap"><table><tr><th>Veículo</th><th>Espectro</th><th>Observação</th></tr>
   ${ids.map(i => { const f = C.fontes[i]; return `<tr><td><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.nome)}</a></td><td><span class="badge ${f.esp}">${esc(C.espectros[f.esp])}</span></td><td style="text-align:left">${esc(f.nota)}</td></tr>`; }).join('')}</table></div>
   <h2>Dados eleitorais</h2>
   <div class="box"><ul>
    <li><b>Município (1º e 2º turno):</b> arquivos JSON do painel oficial do TSE (eleições 6257 e 6258), baixados e agregados em <code>data/municipios.json</code>.</li>
    <li><b>Zona (1º turno):</b> Dados Abertos do TSE, <i>Votação por candidato e por município/zona</i> e <i>Detalhe da apuração por município e zona</i>.</li>
    <li><b>2º turno por zona:</b> ainda não publicado nesses conjuntos na data da coleta.</li>
    <li><b>Mapa:</b> malha municipal do IBGE. Não existe malha oficial de zonas eleitorais; por isso o mapa é por município e o detalhe por zona é em cartões.</li>
    <li>“Outros candidatos” = votos válidos − (Lula + Flávio).</li>
   </ul></div>
   <h2>Como tratamos divergências</h2>
   <div class="box"><p>Quando duas fontes divergem (ex.: 17 vs. 19 municípios no pedido do PL; 548, 618 ou 694 ocorrências), mostramos todas as versões e a etiqueta de confiança: <span class="conf conf-ok">Confirmado</span> <span class="conf conf-al">Alegado / parcial</span> <span class="conf conf-di">Desmentido</span> <span class="conf conf-nv">Não verificado</span>.</p></div>`;
}

init();
})();
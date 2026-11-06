(function () {
  "use strict";

  var NIVEL = { "confirmado": "Confirmado", "parcial": "Parcial", "nao-verificado": "Não verificado" };
  var ESTR = { "sim": "Estrangeiros: sim", "depende": "Estrangeiros: depende", "nao": "Estrangeiros: não" };
  var ESTR_FILTRO = [["", "Todos"], ["sim", "Sim"], ["depende", "Depende"]];
  var TIPOS = [["", "Todos"], ["assistencial", "Assistencial"], ["previdenciário", "Previdenciário"], ["trabalhista", "Trabalhista"], ["universal", "Universal"]];

  var dados = null;
  var filtro = { busca: "", cat: "", estr: "", tipo: "" };

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function chips(container, opcoes, chave) {
    container.textContent = "";
    opcoes.forEach(function (o) {
      var b = el("button", { type: "button", class: "chip" + (filtro[chave] === o[0] ? " on" : ""), "aria-pressed": filtro[chave] === o[0] ? "true" : "false", text: o[1] });
      b.addEventListener("click", function () { filtro[chave] = o[0]; desenhar(); });
      container.appendChild(b);
    });
  }

  function bloco(titulo, conteudo) {
    return el("div", { class: "bloco" }, [el("h3", { text: titulo }), conteudo]);
  }
  function par(texto) { return el("p", { text: texto }); }
  function lista(itens) {
    return el("ul", null, itens.map(function (t) { return el("li", { text: t }); }));
  }
  function selo(texto, cls) { return el("span", { class: "sel " + cls, text: texto }); }

  function ficha(b) {
    var d = el("details", { class: "ficha", id: b.id });
    var sels = el("div", { class: "sels" }, [
      selo("Ficha: " + NIVEL[b.confianca], "conf-" + b.confianca),
      selo(ESTR[b.estrangeiros.pode], "estr-" + b.estrangeiros.pode),
      selo(b.tipo, "")
    ]);
    var sum = el("summary", null, [
      el("div", { class: "f-topo" }, [el("span", { class: "f-nome", text: b.nome }), el("span", { class: "f-cat", text: b.categoria })]),
      el("p", { class: "f-resumo", text: b.resumo }),
      sels
    ]);
    var corpo = el("div", { class: "corpo" });
    corpo.appendChild(bloco("Quem pode receber", lista(b.quem)));
    var estr = el("div", { class: "destaque" }, [
      el("p", { text: b.estrangeiros.texto }),
      el("p", null, [selo("Confiança desta informação: " + NIVEL[b.estrangeiros.confianca], "conf-" + b.estrangeiros.confianca)])
    ]);
    corpo.appendChild(bloco("E quem vem de fora?", estr));
    corpo.appendChild(bloco("Por quanto tempo", par(b.duracao)));
    if (b.condicoes) corpo.appendChild(bloco("Condições para continuar", par(b.condicoes)));
    corpo.appendChild(bloco("Valor", par(b.valor)));
    corpo.appendChild(bloco("Como pedir", par(b.comoPedir)));
    corpo.appendChild(bloco("Base legal", par(b.baseLegal)));
    var ul = el("ul", null, b.fontes.map(function (f) {
      return el("li", null, [el("a", { href: f.url, rel: "noopener", target: "_blank", text: f.texto })]);
    }));
    corpo.appendChild(bloco("Fontes", ul));
    d.appendChild(sum);
    d.appendChild(corpo);
    return d;
  }

  function passa(b) {
    if (filtro.cat && b.categoria !== filtro.cat) return false;
    if (filtro.estr && b.estrangeiros.pode !== filtro.estr) return false;
    if (filtro.tipo && b.tipo !== filtro.tipo) return false;
    if (filtro.busca) {
      var alvo = norm([b.nome, b.resumo, b.categoria, b.quem.join(" ")].join(" "));
      var termos = norm(filtro.busca).split(/\s+/).filter(Boolean);
      for (var i = 0; i < termos.length; i++) if (alvo.indexOf(termos[i]) === -1) return false;
    }
    return true;
  }

  function desenhar() {
    chips(document.getElementById("f-cat"), [["", "Todas"]].concat(dados.categorias.map(function (c) { return [c, c]; })), "cat");
    chips(document.getElementById("f-estr"), ESTR_FILTRO, "estr");
    chips(document.getElementById("f-tipo"), TIPOS, "tipo");
    var abertos = {};
    Array.prototype.forEach.call(document.querySelectorAll(".ficha[open]"), function (n) { abertos[n.id] = true; });
    var visiveis = dados.beneficios.filter(passa);
    var cont = document.getElementById("lista");
    cont.textContent = "";
    visiveis.forEach(function (b) {
      var f = ficha(b);
      if (abertos[b.id]) f.open = true;
      cont.appendChild(f);
    });
    document.getElementById("vazio").hidden = visiveis.length > 0;
    document.getElementById("contagem").textContent = visiveis.length + " de " + dados.beneficios.length + " benefícios.";
  }

  function erro(msg) {
    var e = document.getElementById("erro");
    e.textContent = msg;
    e.hidden = false;
  }

  document.getElementById("busca").addEventListener("input", function (ev) {
    filtro.busca = ev.target.value;
    desenhar();
  });

  fetch("data/beneficios.json")
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (j) {
      dados = j;
      var p = j.verificadoEm.split("-");
      document.getElementById("verificado").textContent = p[2] + "/" + p[1] + "/" + p[0];
      desenhar();
      if (location.hash) {
        var alvo = document.getElementById(location.hash.slice(1));
        if (alvo && alvo.tagName === "DETAILS") { alvo.open = true; alvo.scrollIntoView(); }
      }
    })
    .catch(function (e) {
      erro("Não foi possível carregar os dados (" + e.message + "). Abra a página por um servidor local; veja o LEIAME.");
    });
})();

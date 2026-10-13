(function () {
  window.slideRenderers = window.slideRenderers || {};

  window.slideRenderers.validacion = function () {
    var d = window.VALIDACION || {};

    function esc(s) { return String(s); }

    function chips(items, cls) {
      return (items || []).map(function (t) {
        return '<span class="' + cls + '">' + esc(t) + '</span>';
      }).join('');
    }

    /* Nodo central: validación de la propuesta, método y criterios. */
    var core = '<div class="vl-core">' +
      '<span class="vl-core-ico">' + window.Icons.svg('check', 22) + '</span>' +
      '<span class="vl-core-t">' + (d.core && d.core.titulo || []).map(esc).join('<br>') + '</span>' +
      '<span class="vl-core-m">' + esc(d.core && d.core.metodo || '') + '</span>' +
      '<span class="vl-core-d">' + esc(d.core && d.core.detalle || '') + '</span>' +
      '<span class="vl-core-c">' + esc(d.core && d.core.criterios || '') + '</span>' +
    '</div>';

    /* Rama izquierda: panel de expertos (mismo formato que una ronda). */
    var panel = '<aside class="vl-panel">' +
      '<header class="vl-r-head">' +
        '<span class="vl-r-ico">' + window.Icons.svg(d.panel && d.panel.icono || 'users', 16) + '</span>' +
        '<span class="vl-r-num">' + esc(d.panel && d.panel.titulo || '') + '</span>' +
        '<span class="vl-r-etapa">' + esc(d.panel && d.panel.expertos || '') + '</span>' +
      '</header>' +
      '<ul class="vl-r-props">' +
        (d.panel && d.panel.areas || []).map(function (a) {
          return '<li class="vl-r-prop">' + esc(a) + '</li>';
        }).join('') +
      '</ul>' +
      '<div class="vl-r-dic">' + (d.panel && d.panel.apoyo || []).map(esc).join(' · ') + '</div>' +
    '</aside>';

    /* Bloques de ronda (clicables). */
    function ronda(r) {
      var prop = (r.proposito || []).map(function (t) {
        return '<span class="vl-r-prop">' + esc(t) + '</span>';
      }).join('');
      var res = (r.resultado || []).map(function (t) {
        return '<span class="vl-r-res-i">' + esc(t) + '</span>';
      }).join('');
      return '<article class="vl-round vl-round--' + esc(r.color) + '" data-focus="' + esc(r.key) + '" ' +
        'role="button" tabindex="0" aria-label="Abrir la tabla de la ' + esc(r.num) + '">' +
        '<header class="vl-r-head">' +
          '<span class="vl-r-ico">' + window.Icons.svg(r.icono || 'check', 16) + '</span>' +
          '<span class="vl-r-num">' + esc(r.num) + '</span>' +
          '<span class="vl-r-etapa">' + esc(r.etapa) + '</span>' +
        '</header>' +
        '<ul class="vl-r-props">' + prop + '</ul>' +
        '<div class="vl-r-meta">' +
          '<span class="vl-r-meta-i"><b>Instrumento</b>' + esc(r.instrumento) + '</span>' +
          '<span class="vl-r-meta-i"><b>Criterio</b>' + esc(r.criterio) + '</span>' +
        '</div>' +
        '<div class="vl-r-res">' + res + '</div>' +
        '<div class="vl-r-dic">' + esc(r.dictamen) + '</div>' +
      '</article>';
    }

    /* Conectores del mapa (SVG decorativo del core a cada rama). */
    var links = '<svg class="vl-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
      '<line x1="50" y1="50" x2="17" y2="50"/>' +
      '<line x1="50" y1="50" x2="50" y2="15"/>' +
      '<line x1="50" y1="50" x2="83" y2="50"/>' +
      '<line x1="50" y1="50" x2="50" y2="85"/>' +
    '</svg>';

    var map = '<div class="vl-map">' + links + panel + core +
      (d.rondas || []).map(function (r) {
        return ronda(r);
      }).join('') +
    '</div>';

    /* Banda inferior: síntesis del proceso (clic abre la tabla comparativa). */
    var syn = d.sintesis || {};
    var flow = (syn.flujo || []).map(function (t, i) {
      return (i > 0 ? '<span class="vl-syn-arrow" aria-hidden="true">' +
        window.Icons.svg('chevRight', 14) + '</span>' : '') +
        '<span class="vl-syn-node">' + esc(t) + '</span>';
    }).join('');
    var caps = (syn.capsulas || []).map(function (c) {
      return '<span class="vl-cap vl-cap--' + esc(c.color) + '">' +
        '<em>' + esc(c.label) + '</em>' + '<b>' + esc(c.valor) + '</b>' +
      '</span>';
    }).join('');
    var sintesis = '<div class="vl-synth" data-focus="' + esc(syn.key || 'rn') + '" role="button" tabindex="0" ' +
      'aria-label="Abrir la síntesis metodológica del proceso Delphi">' +
      '<div class="vl-syn-l">' +
        '<span class="vl-syn-k">' +
          '<span class="vl-syn-ico">' + window.Icons.svg(syn.icono || 'flag', 14) + '</span>' +
          esc(syn.titulo || '') +
        '</span>' +
        '<div class="vl-syn-flow">' + flow + '</div>' +
        '<span class="vl-syn-concl">' + esc(syn.conclusion || '') + '</span>' +
      '</div>' +
      '<div class="vl-syn-r">' +
        '<div class="vl-caps">' + caps + '</div>' +
        '<span class="vl-syn-dic">' + esc(syn.dictamen || '') + '</span>' +
      '</div>' +
    '</div>';

    /* Modales: tabla resumida por ronda y síntesis comparativa. */
    function filasTable(rows) {
      return '<table class="vl-table"><tbody>' +
        rows.map(function (f) {
          return '<tr><th scope="row">' + esc(f[0]) + '</th><td>' + esc(f[1]) + '</td></tr>';
        }).join('') +
      '</tbody></table>';
    }

    function modalCard(key, color, titulo, cuerpo, interpretacion) {
      return '<div class="vl-modal vl-modal--' + esc(key) + '">' +
        '<div class="vl-card vl-card--' + esc(color) + '" role="dialog" aria-label="' + esc(titulo) + '">' +
          '<header class="vl-card-h">' +
            '<span class="vl-card-k">' + esc(titulo) + '</span>' +
            '<button class="vl-card-x" type="button" data-focus="' + esc(key) + '" aria-label="Cerrar">' +
              window.Icons.svg('compress', 16) + '</button>' +
          '</header>' +
          cuerpo +
          (interpretacion ? '<p class="vl-card-p">' + esc(interpretacion) + '</p>' : '') +
        '</div>' +
      '</div>';
    }

    var modales = (d.rondas || []).map(function (r) {
      var m = r.modal || {};
      return modalCard(r.key, r.color, m.titulo || r.num, filasTable(m.filas || []), m.interpretacion);
    }).join('');

    var ms = syn.modal || {};
    if (ms.filas) {
      var comp = '<table class="vl-table vl-table--comp"><thead><tr>' +
        (ms.cabeceras || []).map(function (h) {
          return '<th scope="col">' + esc(h) + '</th>';
        }).join('') +
      '</tr></thead><tbody>' +
        ms.filas.map(function (f) {
          return '<tr>' + f.map(function (c) {
            return '<td>' + esc(c) + '</td>';
          }).join('') + '</tr>';
        }).join('') +
      '</tbody></table>';
      modales += modalCard(syn.key || 'rn', 'green', ms.titulo || '', comp, '');
    }

    return '<section class="slide slide-validacion" data-slide="10">' +
      '<header class="slide-head">' +
        '<h2>' + esc(d.title || '') + '</h2>' +
        '<span class="vl-subtitle">' + esc(d.subtitle || '') + '</span>' +
        '<div class="head-rule"></div>' +
      '</header>' +
      '<div class="vl-body">' +
        map +
        sintesis +
        '<p class="vl-note">' + esc(d.nota || '') + '</p>' +
        modales +
      '</div>' +
    '</section>';
  };

  /* Guarda del modal: un clic dentro de la tarjeta (salvo el botón de cierre,
     que lleva data-focus) no debe llegar a app.js y cerrar el panel. */
  (function () {
    function init() {
      var frame = document.getElementById('slideFrame');
      if (!frame) return;
      frame.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var scope = t.closest('.vl-body');
        if (!scope || !scope.getAttribute('data-focus')) return;
        var card = t.closest('.vl-card');
        var item = t.closest('[data-focus]');
        if (card && (!item || !card.contains(item))) {
          e.stopPropagation();
        }
      }, true);
    }
    document.addEventListener('DOMContentLoaded', init);
  })();
})();

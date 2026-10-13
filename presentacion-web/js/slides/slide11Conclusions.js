(function () {
  window.slideRenderers = window.slideRenderers || {};

  window.slideRenderers.conclusiones = function () {
    var d = window.CONCLUSIONES || {};

    function esc(s) { return String(s); }

    function lista(items, cls) {
      return '<ul class="' + cls + '">' + (items || []).map(function (t) {
        if (t && typeof t === 'object') {
          return '<li><span class="cn-li-t">' + esc(t.t) + '</span>' +
            (t.c ? '<span class="cn-li-c">' + esc(t.c) + '</span>' : '') + '</li>';
        }
        return '<li>' + esc(t) + '</li>';
      }).join('') + '</ul>';
    }

    function parrafo(texto) {
      return esc(texto).split('\n\n').map(function (p) {
        return '<p class="cn-dialog-p">' + p + '</p>';
      }).join('');
    }

    /* Tarjeta de bloque (1-6): clic abre el panel con la conclusión completa. */
    function bloque(b, zoom) {
      var cuerpo;
      if (b.stats) {
        cuerpo = '<div class="cn-stats">' + b.stats.map(function (s) {
          return '<span class="cn-stat"><b>' + esc(s.valor) + '</b>' +
            '<em>' + esc(s.label) + '</em></span>';
        }).join('') + '</div>' + lista(b.ideas, 'cn-list');
      } else if (b.minis) {
        cuerpo = b.minis.map(function (m) {
          var lista;
          if (m.tipo === 'cajas') {
            lista = '<div class="cn-bgrid">' + m.items.map(function (it) {
              return '<div class="cn-caja">' +
                '<b class="cn-caja-r">' + esc(it.r) + '</b>' +
                '<b class="cn-caja-v">' + esc(it.v) + '</b>' +
                (it.cv ? '<em class="cn-caja-cv">' + esc(it.cv) + '</em>' : '') +
                (it.d ? '<em class="cn-caja-d">' + esc(it.d) + '</em>' : '') +
              '</div>';
            }).join('') + '</div>';
          } else {
            lista = '<ul class="cn-list cn-list--mini">' + m.items.map(function (it) {
              return '<li><b>' + esc(it.fuerte) + '</b><span>' + esc(it.resto) + '</span></li>';
            }).join('') + '</ul>';
          }
          return '<div class="cn-mini">' +
            '<span class="cn-mini-k">' +
              '<span class="cn-mini-ico">' + window.Icons.svg(m.icono || 'flag', 12) + '</span>' +
              esc(m.titulo) +
            '</span>' +
            lista +
          '</div>';
        }).join('');
      } else if (b.checks) {
        cuerpo = '<ul class="cn-checks">' + b.checks.map(function (t) {
          return '<li><span class="cn-checks-ico">' + window.Icons.svg('check', 11) + '</span>' + esc(t) + '</li>';
        }).join('') + '</ul>';
      } else {
        cuerpo = lista(b.ideas, 'cn-list');
      }

      var inter = zoom
        ? ''
        : ' data-focus="z' + esc(b.key) + '" role="button" tabindex="0" ' +
          'aria-label="Ampliar el bloque ' + esc(b.num) + '"';
      return '<article class="cn-card cn-card--' + esc(b.color) + (zoom ? ' cn-zoom-card' : '') + '"' + inter + '>' +
        '<header class="cn-card-h">' +
          '<span class="cn-card-ico">' + window.Icons.svg(b.icono || 'flag', 17) + '</span>' +
          '<span class="cn-card-num">' + esc(b.num) + '</span>' +
        '</header>' +
        '<h3 class="cn-card-t">' + (b.titulo || []).map(esc).join(' ') + '</h3>' +
        cuerpo +
        (b.conceptual ? '<span class="cn-card-k">' + esc(b.conceptual) + '</span>' : '') +
      '</article>';
    }

    /* Fila superior: seis tarjetas unidas por flechas horizontales. */
    var flow = (d.bloques || []).map(function (b, i) {
      return (i > 0 ? '<span class="cn-arrow" aria-hidden="true">' +
        window.Icons.svg('chevRight', 15) + '</span>' : '') + bloque(b);
    }).join('');

    /* Conectores radiales de cada tarjeta hacia el nodo central. */
    var color = { green: 'var(--cn-verde)', red: 'var(--cn-rojo)', dark: 'var(--cn-verde-osc)' };
    var links = '<svg class="cn-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
      (d.bloques || []).map(function (b, i) {
        var x = ((i + 0.5) / 6 * 100).toFixed(2);
        return '<path d="M ' + x + ' 0 C ' + x + ' 55, 50 45, 50 100" ' +
          'fill="none" stroke="' + color[b.color] + '"/>' +
          '<circle cx="' + x + '" cy="0" r="1.4" fill="' + color[b.color] + '"/>';
      }).join('') +
      '<circle cx="50" cy="100" r="1.4" fill="var(--cn-verde-osc)"/>' +
    '</svg>';

    /* Nodo central inferior. */
    var nodo = d.nodo || {};
    var node = '<div class="cn-node">' +
      '<span class="cn-node-ico">' + window.Icons.svg(nodo.icono || 'trend', 26) + '</span>' +
      '<span class="cn-node-t">' + esc(nodo.titulo || '') + '</span>' +
    '</div>';

    /* Franja inferior: aporte central. */
    var ap = d.aporte || {};
    var aporte = '<div class="cn-aporte">' +
      '<span class="cn-aporte-k">' +
        '<span class="cn-aporte-ico">' + window.Icons.svg(ap.icono || 'target', 15) + '</span>' +
        esc(ap.etiqueta || '') +
      '</span>' +
      '<span class="cn-aporte-c">' + esc(ap.mensaje || '') + '</span>' +
    '</div>';

    /* Nivel intermedio: el mismo bloque agrandado y centrado. Un clic sobre
       la tarjeta lo agranda (foco zbN); otro clic sobre la copia agrandada
       abre su conclusión (foco bN -> panel). */
    var zooms = (d.bloques || []).map(function (b) {
      return '<div class="cn-zoom cn-zoom--' + esc(b.key) + '" data-focus="' + esc(b.key) + '" ' +
        'role="button" tabindex="0" aria-label="Ver la conclusión ' + esc(b.num) + '">' +
        bloque(b, true) +
      '</div>';
    }).join('');

    /* Paneles: conclusión completa de cada bloque. */
    var modales = (d.bloques || []).map(function (b) {
      return '<div class="cn-modal cn-modal--' + esc(b.key) + '">' +
        '<div class="cn-dialog cn-dialog--' + esc(b.color) + '" role="dialog" ' +
          'aria-label="Conclusión ' + esc(b.num) + '">' +
          '<header class="cn-dialog-h">' +
            '<span class="cn-dialog-k">' + (b.titulo || []).map(esc).join(' ') + '</span>' +
            '<button class="cn-dialog-x" type="button" data-focus="' + esc(b.key) + '" aria-label="Cerrar">' +
              window.Icons.svg('compress', 16) + '</button>' +
          '</header>' +
          parrafo(b.conclusion || '') +
        '</div>' +
      '</div>';
    }).join('');

    return '<section class="slide slide-conclusiones" data-slide="11">' +
      '<header class="slide-head">' +
        '<h2>' + esc(d.title || '') + '</h2>' +
        '<span class="cn-subtitle">' + esc(d.subtitle || '') + '</span>' +
        '<div class="head-rule"></div>' +
      '</header>' +
      '<div class="cn-body">' +
        '<div class="cn-flow">' + flow + '</div>' +
        '<div class="cn-strata">' + links + '</div>' +
        '<div class="cn-node-row">' + node + '</div>' +
        aporte +
        zooms +
        modales +
      '</div>' +
    '</section>';
  };

  /* Guarda de los paneles: un clic dentro del diálogo (salvo el botón de cierre,
     que lleva data-focus) no debe cerrar el panel desde app.js. */
  (function () {
    function init() {
      var frame = document.getElementById('slideFrame');
      if (!frame) return;
      frame.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var scope = t.closest('.cn-body');
        if (!scope || !scope.getAttribute('data-focus')) return;
        var dialog = t.closest('.cn-dialog');
        var item = t.closest('[data-focus]');
        if (dialog && (!item || !dialog.contains(item))) {
          e.stopPropagation();
        }
      }, true);
    }
    document.addEventListener('DOMContentLoaded', init);
  })();
})();

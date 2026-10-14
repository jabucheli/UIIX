(function () {
  window.slideRenderers = window.slideRenderers || {};

  window.slideRenderers.recomendaciones = function () {
    var d = window.RECOMENDACIONES || {};

    function esc(s) { return String(s); }

    /* diagrama radial del cuestionario de chequeo: hub «C. Chequeo» arriba,
       los tipos de riesgo sobre la elipse y, al pie, la cadena NTP 324->330.
       Se reutiliza en el subbloque y, agrandado (`big`), en su detalle. */
    function radial(sub, big) {
      return '<div class="rc-radial' + (big ? ' rc-radial--big' : '') + '">' +
        '<div class="rc-radial-canvas">' +
          '<span class="rc-radial-hub">' + esc(sub.hub) + '</span>' +
          '<span class="rc-radial-ring" aria-hidden="true"></span>' +
          (sub.radios || []).map(function (r, i) {
            return '<span class="rc-radial-node rc-radial-node--n' + (i + 1) + '">' + esc(r) + '</span>';
          }).join('') +
        '</div>' +
        '<div class="rc-radial-ntp">' + (sub.ntp || []).map(function (n, i) {
          return (i > 0 ? '<span class="rc-radial-arrow">' + window.Icons.svg('chevRight', 11) + '</span>' : '') +
            '<span class="rc-ntp">' + esc(n) + '</span>';
        }).join('') + '</div>' +
      '</div>';
    }

    /* flujo en dos niveles: TL -> TR -> BR -> BL -> TL (ciclo cerrado).
       Se reutiliza en el subbloque y, agrandado (`big`), en su detalle. */
    function flujo2(sub, big) {
      var nodos = sub.kws || [];
      var pos = ['tl', 'tr', 'br', 'bl'];
      return '<div class="rc-flujo2' + (big ? ' rc-flujo2--big' : '') + '">' +
        nodos.map(function (k, i) {
          return '<span class="rc-f2-node rc-f2-node--' + pos[i] + '">' + esc(k) + '</span>';
        }).join('') +
        '<span class="rc-f2-arrow rc-f2-arrow--r" aria-hidden="true">' + window.Icons.svg('chevRight', 16) + '</span>' +
        '<span class="rc-f2-arrow rc-f2-arrow--d" aria-hidden="true">' + window.Icons.svg('chevRight', 16) + '</span>' +
        '<span class="rc-f2-arrow rc-f2-arrow--l" aria-hidden="true">' + window.Icons.svg('chevRight', 16) + '</span>' +
        '<span class="rc-f2-arrow rc-f2-arrow--u" aria-hidden="true">' + window.Icons.svg('chevRight', 16) + '</span>' +
      '</div>';
    }

    /* flujo vertical: encadena los nodos en columna aprovechando la altura del
       bloque. Se reutiliza en el subbloque y, agrandado (`big`), en su detalle. */
    function flujoV(sub, big) {
      var nodos = sub.kws || [];
      var out = [];
      nodos.forEach(function (k, i) {
        if (i > 0) out.push('<span class="rc-fv-arrow" aria-hidden="true">' + window.Icons.svg('chevRight', 14) + '</span>');
        out.push('<span class="rc-fv-node">' + esc(k) + '</span>');
      });
      return '<div class="rc-fv' + (big ? ' rc-fv--big' : '') + '">' + out.join('') + '</div>';
    }

    /* subbloque clicable: número + título, palabras clave, línea de sentido
       y franja final con la idea síntesis. El clic abre su detalle ampliado. */
    function subt(sub) {
      var cuerpo;
      if (sub.modo === 'lista') {
        cuerpo = '<ul class="rc-lista">' + (sub.kws || []).map(function (k) {
          return '<li><span class="rc-lista-ico">' + window.Icons.svg('check', 12) + '</span>' +
            esc(k) + '</li>';
        }).join('') + '</ul>';
      } else if (sub.modo === 'radial') {
        cuerpo = radial(sub, false);
      } else if (sub.modo === 'flujo2') {
        cuerpo = flujo2(sub, false);
      } else if (sub.modo === 'flujoV') {
        cuerpo = flujoV(sub, false);
      } else {
        cuerpo = '<div class="rc-kws">' + (sub.kws || []).map(function (k) {
          return '<span class="rc-kw">' + esc(k) + '</span>';
        }).join('') + '</div>';
      }
      return '<article class="rc-sub" data-focus="' + esc(sub.key) + '" ' +
        'role="button" tabindex="0" aria-label="Ampliar la recomendación ' + esc(sub.num) + ': ' + esc(sub.titulo) + '">' +
        '<header class="rc-sub-h">' +
          '<span class="rc-sub-num">' + esc(sub.num) + '</span>' +
          '<span class="rc-sub-ico">' + window.Icons.svg(sub.icono || 'check', 13) + '</span>' +
          '<h4 class="rc-sub-t">' + esc(sub.titulo) + '</h4>' +
        '</header>' +
        cuerpo +
        (sub.sentido ? '<p class="rc-sub-s">' + esc(sub.sentido) + '</p>' : '') +
        (sub.cierre ? '<div class="rc-sub-c">' + esc(sub.cierre) + '</div>' : '') +
      '</article>';
    }

    /* columna de un ámbito: cabecera en color sólido + subbloques. */
    function ambito(a) {
      return '<section class="rc-amb rc-amb--' + esc(a.color) + '">' +
        '<header class="rc-amb-h">' +
          '<span class="rc-amb-ico">' + window.Icons.svg(a.icono || 'clipboard', 16) + '</span>' +
          '<span class="rc-amb-tt">' +
            '<b>' + esc(a.titulo) + '</b>' +
            (a.subtitulo ? '<em>' + esc(a.subtitulo) + '</em>' : '') +
          '</span>' +
        '</header>' +
        '<div class="rc-subs">' + (a.subs || []).map(subt).join('') + '</div>' +
      '</section>';
    }

    /* nodo superior eliminado: las columnas de ámbito ocupan toda la altura. */

    var cols = '<div class="rc-cols">' + (d.ambitos || []).map(ambito).join('') + '</div>';

    /* banda inferior: cierre lógico Ampliar -> Aplicar -> Actualizar -> Investigar. */
    var flow = (d.flujo || []).map(function (n, i) {
      return (i > 0 ? '<span class="rc-arrow" aria-hidden="true">' +
        window.Icons.svg('chevRight', 15) + '</span>' : '') +
        '<span class="rc-fn rc-fn--' + esc(n.color) + '">' +
          '<span class="rc-fn-ico">' + window.Icons.svg(n.icono || 'check', 15) + '</span>' +
          esc(n.t) +
        '</span>';
    }).join('');

    /* detalle ampliado de cada subbloque. */
    var modales = [];
    (d.ambitos || []).forEach(function (a) {
      (a.subs || []).forEach(function (sub) {
        modales.push('<div class="rc-modal rc-modal--' + esc(sub.key) + '">' +
          '<div class="rc-card rc-card--' + esc(a.color) +
            ((sub.modo === 'radial' || sub.modo === 'flujo2' || sub.modo === 'flujoV') ? ' rc-card--fig' : '') +
            '" role="dialog" aria-label="' + esc(sub.titulo) + '">' +
            '<header class="rc-card-h">' +
              '<span class="rc-card-num">' + esc(sub.num) + '</span>' +
              '<span class="rc-card-k">' + esc(sub.titulo) + '</span>' +
              '<button class="rc-card-x" type="button" data-focus="' + esc(sub.key) + '" aria-label="Cerrar">' +
                window.Icons.svg('compress', 16) +
              '</button>' +
            '</header>' +
            '<div class="rc-card-body">' +
              '<div class="rc-card-txt">' +
                (sub.detalle || []).map(function (p) {
                  return '<p class="rc-card-p">' + esc(p) + '</p>';
                }).join('') +
                (sub.cierre ? '<div class="rc-card-c">' + esc(sub.cierre) + '</div>' : '') +
              '</div>' +
              (sub.modo === 'radial' ? '<div class="rc-card-fig">' + radial(sub, true) + '</div>' :
               sub.modo === 'flujo2' ? '<div class="rc-card-fig">' + flujo2(sub, true) + '</div>' :
               sub.modo === 'flujoV' ? '<div class="rc-card-fig">' + flujoV(sub, true) + '</div>' : '') +
            '</div>' +
          '</div>' +
        '</div>');
      });
    });

    return '<section class="slide slide-recomendaciones" data-slide="12">' +
      '<header class="slide-head">' +
        '<h2>' + esc(d.title || '') + '</h2>' +
        '<span class="rc-subtitle">' + esc(d.subtitle || '') + '</span>' +
        '<div class="head-rule"></div>' +
      '</header>' +
      '<div class="rc-body">' +
        cols +
        '<div class="rc-flow">' + flow + '</div>' +
        modales.join('') +
      '</div>' +
    '</section>';
  };

  /* Guarda del detalle: un clic dentro de la tarjeta (salvo el botón de cierre,
     que lleva data-focus) no debe llegar a app.js y cerrar el panel. */
  (function () {
    function init() {
      var frame = document.getElementById('slideFrame');
      if (!frame) return;
      frame.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var scope = t.closest('.rc-body');
        if (!scope || !scope.getAttribute('data-focus')) return;
        var card = t.closest('.rc-card');
        var item = t.closest('[data-focus]');
        if (card && (!item || !card.contains(item))) {
          e.stopPropagation();
        }
      }, true);
    }
    document.addEventListener('DOMContentLoaded', init);
  })();
})();

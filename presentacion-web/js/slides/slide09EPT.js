(function () {
  window.slideRenderers = window.slideRenderers || {};

  window.slideRenderers.ept = function (thesis, p, o, t, m, r) {
    var d = window.EPT || {};

    function esc(s) { return String(s); }

    /* Nodo con icono circular + texto (lógica de transformación y resultado). */
    function nodo(n) {
      return '<span class="ept-nodo">' +
        '<span class="ept-ico">' + window.Icons.svg(n.icono || 'check', 16) + '</span>' +
        '<span class="ept-nodo-t">' + esc(n.texto) + '</span>' +
      '</span>';
    }

    function secuencia(nodos, arrowSvg) {
      return nodos.map(function (n, i) {
        return (i > 0 ? '<span class="ept-arrow ept-arrow--nodo">' + arrowSvg + '</span>' : '') + nodo(n);
      }).join('');
    }

    /* Bloque superior: LÓGICA DE TRANSFORMACIÓN. */
    var logicaNodos = secuencia(d.logica && d.logica.nodos || [],
      window.Icons.svg('chevRight', 14));
    var logica = '<section class="ept-logica">' +
      '<span class="ept-band-k">' + esc(d.logica && d.logica.key || '') + '</span>' +
      '<div class="ept-nodos">' + logicaNodos + '</div>' +
    '</section>';

    /* Laterales de la franja central. */
    function lado(side, cls) {
      var lineas = (side.contenido || []).map(function (ln) {
        return '<span class="ept-side-t">' + esc(ln) + '</span>';
      }).join('');
      return '<aside class="ept-side ' + cls + '">' +
        '<span class="ept-side-ico">' + window.Icons.svg(side.icono || 'book', 18) + '</span>' +
        '<span class="ept-side-k">' + esc(side.titulo) + '</span>' +
        lineas +
      '</aside>';
    }

    /* Tarjeta de etapa: encabezado · componente · contenidos · recursos ·
       franja de salida. Alterna la paleta (verde/rojo) según el data. */
    function etapa(et) {
      var nombre = (et.componente || []).map(esc).join('<br>');
      var capsula = et.capsula
        ? '<span class="ept-e-cap">' + esc(et.capsula) + '</span>'
        : '';
      var items = (et.items || []).map(function (it) {
        return '<li>' +
          '<span class="ept-e-bullet" aria-hidden="true"></span>' +
          '<span class="ept-e-item">' + esc(it) + '</span>' +
        '</li>';
      }).join('');
      var pills = (et.recursos || []).map(function (rc) {
        return '<span class="ept-pill">' + esc(rc) + '</span>';
      }).join('');

      return '<article class="ept-e ept-e--' + et.color + '">' +
        '<div class="ept-e-head">' + esc(et.etapa) + '</div>' +
        '<div class="ept-e-comp">' +
          '<span class="ept-e-ico">' + window.Icons.svg(et.icono || 'check', 17) + '</span>' +
          '<span class="ept-e-nombre">' + nombre + '</span>' +
          capsula +
        '</div>' +
        '<ul class="ept-e-list">' + items + '</ul>' +
        '<div class="ept-e-rec">' +
          '<span class="ept-e-rec-k">Recursos requeridos</span>' +
          '<div class="ept-e-pills">' + pills + '</div>' +
        '</div>' +
        '<div class="ept-e-out">' + esc(et.salida) + '</div>' +
      '</article>';
    }

    /* Franja central: Fundamento → Etapa 1 → Etapa 2 → Etapa 3 → Propósito.
       Las flechas son anchas y alternan la paleta en la secuencia. */
    var etapas = (d.etapas || []).map(function (et, i) {
      var arrowColor = ['green', 'red', 'green'][i] || 'green';
      return '<span class="ept-arrow ept-arrow--' + arrowColor + '">' +
        window.Icons.svg('chevRight', 30) + '</span>' + etapa(et);
    });
    var central = '<div class="ept-central">' +
      lado(d.fundamento || {}, 'ept-side--fund') +
      etapas.join('') +
      '<span class="ept-arrow ept-arrow--green">' +
        window.Icons.svg('chevRight', 30) + '</span>' +
      lado(d.proposito || {}, 'ept-side--prop') +
    '</div>';

    /* Franja de resultado esperado. */
    var rsNodos = secuencia(d.resultado && d.resultado.nodos || [],
      window.Icons.svg('chevRight', 14));
    var result = '<section class="ept-result">' +
      '<span class="ept-rs-k">' + esc(d.resultado && d.resultado.key || '') + '</span>' +
      '<div class="ept-rs">' + rsNodos + '</div>' +
    '</section>';

    /* Franja final: recursos clave. */
    var rcItems = (d.recursosClave && d.recursosClave.items || []).map(function (it, i) {
      return (i > 0 ? '<span class="ept-rc-sep" aria-hidden="true">·</span>' : '') +
        '<span class="ept-rc-it">' + esc(it) + '</span>';
    }).join('');
    var recursos = '<div class="ept-rc">' +
      '<span class="ept-rc-k">' +
        '<span class="ept-rc-gear">' + window.Icons.svg('gear', 14) + '</span>' +
        esc(d.recursosClave && d.recursosClave.key || '') +
      '</span>' +
      '<div class="ept-rc-items">' + rcItems + '</div>' +
    '</div>';

    return '<section class="slide slide-ept" data-slide="9">' +
      '<header class="slide-head">' +
        '<h2>' + esc(d.title) + '</h2>' +
        '<span class="ept-subtitle">' + esc(d.subtitle || '') + '</span>' +
        '<div class="head-rule"></div>' +
      '</header>' +
      '<div class="ept-body">' +
        logica +
        central +
        result +
        recursos +
      '</div>' +
    '</section>';
  };
})();
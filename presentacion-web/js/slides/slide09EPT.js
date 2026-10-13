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

      return '<article class="ept-e ept-e--' + et.color + '" data-focus="' + esc(et.num) + '" ' +
        'role="button" tabindex="0" aria-label="Abrir el detalle de la ' + esc(et.etapa) + '">' +
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
       Las flechas alternan la paleta en la secuencia (verde, rojo, verde, rojo). */
    var etapas = (d.etapas || []).map(function (et, i) {
      var arrowColor = ['green', 'red', 'green'][i] || 'green';
      return '<span class="ept-arrow ept-arrow--' + arrowColor + '">' +
        window.Icons.svg('chevRight', 30) + '</span>' + etapa(et);
    });
    var central = '<div class="ept-central">' +
      lado(d.fundamento || {}, 'ept-side--fund') +
      etapas.join('') +
      '<span class="ept-arrow ept-arrow--red">' +
        window.Icons.svg('chevRight', 30) + '</span>' +
      lado(d.proposito || {}, 'ept-side--prop') +
    '</div>';

    /* Franja de resultado esperado. */
    var rsNodos = secuencia(d.resultado && d.resultado.nodos || [],
      window.Icons.svg('chevRight', 14));
    var result = '<section class="ept-result" data-focus="rs" role="button" tabindex="0" ' +
      'aria-label="Abrir el detalle del resultado esperado">' +
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

    /* Overlays de detalle (clic en una etapa o en el resultado esperado):
       imagen en primer plano sobre el ghost de la lámina. La Etapa 2 abre un
       par (pt2 -> riesgos1/riesgos2) y la Etapa 3 abre otro par (pt3 + pt4),
       ambos en paralelo con un solo clic. El panel (.ept-img) no lleva
       data-focus: clic fuera de la imagen cierra. */
    function imgOverlay(key, caption, src) {
      return '<span class="ept-img-cap">' + esc(caption) + '</span>' +
        '<figure class="ept-fig" data-focus="' + key + '" role="button" tabindex="0" ' +
          'aria-label="' + esc(caption) + '">' +
          '<img src="' + src + '" alt="' + esc(caption) + '">' +
        '</figure>';
    }
    /* Segundo nivel de la Etapa 2 y de la Etapa 3: dos imágenes en paralelo. */
    function parOverlay(caption, pairFocus, pares) {
      var figs = pares.map(function (pr) {
        return '<figure class="ept-fig" data-focus="' + pairFocus + '" role="button" tabindex="0" ' +
          'aria-label="' + esc(pr.alt) + '">' +
          '<img src="' + pr.src + '" alt="' + esc(pr.alt) + '">' +
        '</figure>';
      }).join('');
      return '<span class="ept-img-cap">' + esc(caption) + '</span>' +
        '<div class="ept-pair">' + figs + '</div>';
    }
    var overlays =
      '<div class="ept-img ept-img--1">' + imgOverlay('1', 'Etapa 1 · base técnica y normativa', 'assets/pt1.png') + '</div>' +
      '<div class="ept-img ept-img--2">' + imgOverlay('2img', 'Etapa 2 · cuestionarios de chequeo', 'assets/pt2.png') + '</div>' +
      '<div class="ept-img ept-img--2b">' + parOverlay('Etapa 2 · riesgos identificados por tipo de obra', '2img', [
        { src: 'assets/riesgos1.png', alt: 'Matriz de riesgos de edificación' },
        { src: 'assets/riesgos2.png', alt: 'Matriz de riesgos de infraestructura' }
      ]) + '</div>' +
      '<div class="ept-img ept-img--3">' + parOverlay('Etapa 3 · valoración del riesgo y ampliación del cuadro', '3', [
        { src: 'assets/pt3.png', alt: 'Etapa 3 · valoración del riesgo (pt3)' },
        { src: 'assets/pt4.png', alt: 'Etapa 3 · ampliación del cuadro (pt4)' }
      ]) + '</div>' +
      '<div class="ept-img ept-img--5">' + imgOverlay('rs', 'Resultado esperado · gestión preventiva fortalecida', 'assets/pt5.png') + '</div>';

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
        overlays +
      '</div>' +
    '</section>';
  };
})();
(function () {
  window.slideRenderers = window.slideRenderers || {};

  /* Diapositiva 8 · RESULTADOS (3): resultados de la prueba piloto en el
     proyecto de infraestructura, en secuencia.

     Página seccionada en dos bandas, como la del slide 7:
       · banda superior (18.75% del alto): secuencia de seis pasos;
       · banda inferior: el resultado ampliado (gráfico, tabla o figura).
     Los seis pasos son pulsables: abren su imagen en la banda inferior con la
     lectura del resultado. Un segundo clic, ESC o un clic fuera lo cierran.
     La secuencia y las lecturas viven en js/data/resultsData3.js. */
  function paso(p, i) {
    var c = p.color || (i % 2 === 0 ? 'green' : 'red');
    return '<div class="rs3-paso rs3-paso--' + c + '" data-focus="' + p.key + '"' +
        ' tabindex="0" role="button" aria-label="Ampliar el resultado ' + p.clave + ': ' + p.titulo + '">' +
      '<div class="rs3-p-c">' + p.clave + '</div>' +
      '<div class="rs3-p-t">' + p.titulo + '</div>' +
      '<div class="rs3-p-s">' + p.sub + '</div>' +
    '</div>';
  }

  function flecha() {
    return '<span class="rs3-fx" aria-hidden="true">' + window.Icons.svg('chevRight', 11) + '</span>';
  }

  /* El resultado ampliado: cabecera con la cifra y el título, la imagen tal
     cual (los gráficos y tablas van como imagen) y al pie la lectura y la
     fuente.      Un clic sobre la imagen la proyecta a máximo tamaño (nivel 2), donde un
     nuevo clic sobre la imagen la acerca más, se arrastra para desplazarla y un
     clic fuera de la imagen vuelve a esta pantalla (js/slides/slide08Zoom.js). La
     clave del nivel 2 es la del paso con una "i" (`p1` -> `p1i`), el nivel
     anidado que `app.js` resuelve con `parents`. */
  function panel(p) {
    return '<article class="rs3-panel rs3-panel--' + p.color + ' rs3-panel--' + p.key + '" data-panel="' + p.key + '" data-focus="' + p.key + '"' +
        ' tabindex="0" role="button" aria-label="Cerrar el resultado ' + p.clave + '">' +
      '<header class="rs3-pn-h">' +
        '<span class="rs3-pn-c">' + p.clave + '</span>' +
        '<span class="rs3-pn-t">' + p.titulo + '</span>' +
        '<span class="rs3-pn-s">' + p.sub + '</span>' +
      '</header>' +
      '<div class="rs3-pn-body">' +
        '<figure class="rs3-pn-zoom" data-focus="' + p.key + 'i" tabindex="0" role="button"' +
        ' aria-label="Ampliar la imagen de ' + p.titulo + ' al máximo tamaño">' +
          '<img class="rs3-pn-img ' + (p.imagen.indexOf('nd-res.png') > -1 ? 'rs3-pn-img--sm' : '') + '" src="' + p.imagen + '" alt="' + p.titulo + '">' +
        '</figure>' +
      '</div>' +
      '<p class="rs3-zoom-tip" aria-hidden="true">' +
        '<span class="rs3-zoom-nv">×1,0</span>' +
        '<span>clic: acercar &middot; arrastrar: desplazar &middot; clic fuera: volver</span>' +
      '</p>' +
      (p.mostrarPie === false ? '' : '<footer class="rs3-pn-f">' +
        '<em>' + p.detalle + '</em>' +
        '<span>' + p.pie + '</span>' +
      '</footer>') +
    '</article>';
  }

  /* En reposo, la banda inferior no lleva ninguna información: solo las
     fotografías de la prueba piloto en una retícula de dos filas. Cada
     miniatura se amplía con un clic y un clic fuera (o ESC) la devuelve a su
     tamaño normal; el estado lo lleva js/slides/slide08Photos.js, que es
     quien rellena el visor `.rs3-gal-big`. */
  function reposo(d) {
    var fotos = d.fotos || [];
    var mini = fotos.map(function (src, i) {
      return '<button class="rs3-gal-i" type="button" data-foto="' + i + '"' +
          ' aria-label="Ampliar la fotografía ' + (i + 1) + ' de ' + fotos.length + '">' +
        '<img class="rs3-gal-t" src="' + src + '" alt="">' +
      '</button>';
    }).join('');
    return '<section class="rs3-idle" aria-label="Fotografías de la prueba piloto">' +
      '<div class="rs3-gal">' + mini + '</div>' +
      '<figure class="rs3-gal-view">' +
        '<img class="rs3-gal-big" alt="">' +
      '</figure>' +
    '</section>';
  }

  window.slideRenderers.resultados3 = function (thesis, p, o, t, m, r) {
    var d = window.RESULTADOS3 || {};
    var pasos = d.pasos || [];

    var flow = '<section class="rs3-flow" aria-label="Secuencia de resultados">' +
      '<div class="rs3-chain">' + pasos.map(function (x, i) {
        return (i > 0 ? flecha() : '') + paso(x, i);
      }).join('') + '</div>' +
      (d.nota ? '<p class="rs3-note">' + d.nota + '</p>' : '') +
    '</section>';

    var screens = '<section class="rs3-screens" aria-label="Resultado ampliado">' +
      pasos.map(panel).join('') +
    '</section>';

    return '<section class="slide slide-resultados" data-slide="8">' +
      '<header class="slide-head">' +
        '<h2>' + d.title + '</h2>' +
        (d.subtitle ? '<span class="rs-subtitle">' + d.subtitle + '</span>' : '') +
        '<div class="head-rule"></div>' +
      '</header>' +
      '<div class="rs3-body"><div class="rs3-cols">' + flow + reposo(d) + screens + '</div></div>' +
    '</section>';
  };
})();

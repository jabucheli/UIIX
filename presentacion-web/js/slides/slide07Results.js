(function () {
  window.slideRenderers = window.slideRenderers || {};

  /* Diapositiva 7 · RESULTADOS (2): desarrollo de la Fase 3 (NTP 330).
     Página seccionada en dos bandas:
       · banda superior (18.75% del alto): flujograma principal de ntp330.md;
       · banda inferior: dos recuadros reservados para fotografías.
     Los bloques NE, NP, NC, NR y NI son pulsables: abren en pantalla el cuadro
     que les corresponde de ER.docx (window.ER_TABLES, generado por
     tools/extract_er_tables.js). Un segundo clic lo cierra.
     El renderer tolera que falte cualquiera de las dos bandas. */
  function nodo(n) {
    var f = n.focus
      ? ' data-focus="' + n.focus + '" tabindex="0" role="button" aria-label="' + (n.aria || 'Ver el cuadro de ' + n.code) + '"'
      : '';
    return '<div class="rs2-fn rs2-fn--' + n.color + (n.rama ? ' rs2-fn--rama' : '') + '"' + f + '>' +
      '<div class="rs-fn-c">' + n.code + '</div>' +
      '<div class="rs-fn-t">' + n.title + '</div>' +
      '<div class="rs-fn-s' + (n.fx ? ' rs-fn-s--fx' : '') + '">' + n.sub + '</div>' +
      (n.rama ? '<div class="rs-fn-r">rama paralela</div>' : '') +
    '</div>';
  }

  function flecha(i) {
    var suave = i === 4; /* convergencia NC -> NR */
    return '<span class="rs2-fx' + (suave ? ' rs2-fx--merge' : '') + '" aria-hidden="true">' +
      window.Icons.svg('chevRight', 11) + '</span>';
  }

  /* La Fotografía 1 aloja la aplicación web de evaluación (un <iframe> a la
     módulo integrado ntp330/0). El <iframe> no se pinta aquí: se monta la
     primera vez que se abre y se retira al cerrar, para no cargar los ~800KB
     de la app en cada arranque de la presentación. */
  function foto(f) {
    var app = f.app;
    var cls = 'rs2-foto' + (app ? ' rs2-foto--app' : '') + (f.key === 'f2' ? ' rs2-foto--raw' : '');
    var imgs = '';
    if (f.imagen2 && f.key === 'f2') {
      imgs = '<div class="rs-ft-imgs"><img class="rs-ft-img" src="' + f.imagen + '" alt="' + f.titulo + '"><img class="rs-ft-img" src="' + f.imagen2 + '" alt="' + f.titulo + '"></div>';
    } else if (f.imagen) {
      imgs = '<img class="rs-ft-img" src="' + f.imagen + '" alt="' + f.titulo + '">';
    }
    return '<div class="' + cls + '" data-foto="' + f.key + '">' +
      '<div class="rs-ft-t">' + f.titulo + '</div>' +
      imgs +
      (f.nota ? '<div class="rs-ft-n">' + f.nota + '</div>' : '') +
      (app ? '<div class="rs-ft-hint">' + app.aviso + '</div>' +
        '<div class="rs-ft-frame" data-frame="' + f.key + '"></div>' : '') +
    '</div>';
  }

  /* Monta la app dentro del recuadro. Se hace al vuelo, con un <iframe> normal:
     al estar en otra carpeta, `file://` lo trata como origen aparte y la
     lámina no puede tocarlo, que es justo lo que hace falta. */
  function montaApp(key) {
    var slot = document.querySelector('[data-frame="' + key + '"]');
    if (!slot || slot.firstChild) return;
    var r = (window.RESULTADOS2.fotos || []).filter(function (f) { return f.key === key; })[0];
    if (!r || !r.app) return;
    var fr = document.createElement('iframe');
    fr.className = 'rs-ft-app';
    fr.src = r.app.src;
    fr.title = r.app.etiqueta;
    /* La app guarda sus datos en localStorage; con un origen propio no se
       mezclan con los de la presentación. */
    fr.setAttribute('loading', 'eager');
    slot.appendChild(fr);
  }

  /* app.js avisa de cada cambio de foco del slide 7: se monta la app en su
     recuadro y se desmonta en cuanto el foco es otro o ninguno. Se escucha en
     el documento, no en el recuadro, para no depender de en qué orden se
     pinten las láminas. */
  document.addEventListener('slide:focus', function (ev) {
    if (!ev.detail || ev.detail.scope !== 'rs2-body') return;
    (window.RESULTADOS2.fotos || []).forEach(function (f) {
      if (!f.app) return;
      var slot = document.querySelector('[data-frame="' + f.key + '"]');
      if (!slot) return;
      if (ev.detail.key === f.key) montaApp(f.key);
      else if (slot.firstChild) slot.textContent = '';
    });
  });

  /* ---------- cuadros de ER.docx (uno por bloque pulsable) ---------- */

  var CLAVES = ['ne', 'np', 'nc', 'nr', 'ni'];

  function celdaSimple(t, i) {
    return '<td' + (i === 0 ? ' class="rs2-tb-v"' : '') + '>' + (t || '') + '</td>';
  }

  function filaSimple(f) {
    return '<tr class="rs2-tb-r rs2-tb-r--' + f.tono + '">' +
      '<th scope="row"><span class="rs2-tb-cod">' + f.cod + '</span>' + (f.etiqueta || '') + '</th>' +
      f.celdas.map(celdaSimple).join('') +
    '</tr>';
  }

  function filaMatriz(f, i, t) {
    /* en la matriz el color va en cada celda (nivel de intervencion), no en la fila.
       La primera fila lleva el titulo del eje de las filas, vertical, replicado
       con rowspan sobre todas. */
    return '<tr class="rs2-tb-r rs2-tb-r--mix">' +
      (i === 0 ? '<th class="rs2-tb-vert" scope="rowgroup" rowspan="' + t.filas.length + '">' +
        '<span>' + t.tituloFilas + '</span></th>' : '') +
      '<th scope="row"><span class="rs2-tb-cod">' + f.nc + '</span>' +
        '<span class="rs2-tb-nc">' + (f.etiqueta || '') +
        (f.cod ? '<i>(' + f.cod + ')</i>' : '') + '</span></th>' +
      f.celdas.map(function (c) {
        return '<td class="rs2-tb-v"><span class="rs2-tb-nr">' +
          c.niveles.map(function (n) {
            return '<b class="rs2-tb-lv--' + n.tono + '">' + n.nivel + '</b><span>' + n.valor + '</span>';
          }).join('') +
        '</span></td>';
      }).join('') +
    '</tr>';
  }

  /* La matriz trae las cabeceras de columna como { rango, etiqueta, cod }:
     se pinta el nombre del nivel de probabilidad y su tramo debajo. */
  function thColumna(c, esMatriz, i) {
    var clase = esMatriz || i === 0 ? ' class="rs2-tb-v"' : '';
    if (typeof c === 'string') return '<th' + clase + '>' + c + '</th>';
    return '<th' + clase + '>' +
      '<span class="rs2-tb-np">' + (c.etiqueta || '') + (c.cod ? '<i>(' + c.cod + ')</i>' : '') + '</span>' +
      '<span class="rs2-tb-rng">' + c.rango + '</span>' +
    '</th>';
  }

  /* la matriz lleva dos filas de cabecera: el banner del eje de columnas,
     con span de las cuatro, y debajo los cuatro niveles de probabilidad */
  function cabecera(t, esMatriz) {
    if (!esMatriz) {
      return '<thead><tr><th>' + t.encabezado.esquina + '</th>' +
        t.encabezado.columnas.map(function (c, i) { return thColumna(c, false, i); }).join('') +
      '</tr></thead>';
    }
    return '<thead>' +
      '<tr class="rs2-tb-hb">' +
        '<th class="rs2-tb-esq" rowspan="2"></th>' +
        '<th class="rs2-tb-esq rs2-tb-esq--nc" rowspan="2"></th>' +
        '<th class="rs2-tb-span" colspan="' + t.encabezado.columnas.length + '">' +
          '<span>' + t.tituloColumnas + '</span></th>' +
      '</tr>' +
      '<tr class="rs2-tb-hn">' +
        t.encabezado.columnas.map(function (c, i) { return thColumna(c, true, i); }).join('') +
      '</tr>' +
    '</thead>';
  }

  function cuadro(k, t) {
    var esMatriz = !!t.tituloColumnas;
    return '<article class="rs2-tbl rs2-tbl--' + k + '" data-tbl="' + k + '" data-focus="' + k + '"' +
        ' tabindex="0" role="button" aria-label="Cerrar el cuadro de ' + t.code + '">' +
      '<header class="rs2-tb-h">' +
        '<span class="rs2-tb-code">' + t.code + '</span>' +
        '<span class="rs2-tb-t">' + t.titulo + '</span>' +
        '<span class="rs2-tb-src">ER.docx · ' + (esMatriz ? 'matriz NP × NC' : 'tabla ' + t.code) + '</span>' +
      '</header>' +
      '<div class="rs2-tb-wrap"><table class="rs2-tb' + (esMatriz ? ' rs2-tb--matriz' : '') + '">' +
      cabecera(t, esMatriz) + '<tbody>' +
      t.filas.map(function (f, i) { return esMatriz ? filaMatriz(f, i, t) : filaSimple(f); }).join('') +
      '</tbody></table></div>' +
      '<footer class="rs2-tb-f">' +
        (t.nota ? '<em>' + t.nota + '</em>' : '') +
        '<span>' + t.pie + '</span>' +
      '</footer>' +
    '</article>';
  }

  function pantallas(tabs) {
    if (!tabs) return '';
    return '<section class="rs2-screens" aria-label="Cuadros de ER.docx">' +
      CLAVES.filter(function (k) { return tabs[k]; })
        .map(function (k) { return cuadro(k, tabs[k]); })
        .join('') +
    '</section>';
  }

  window.slideRenderers.resultados2 = function (thesis, p, o, t, m, r) {
    r = r === window.RESULTADOS ? window.RESULTADOS2 : (r || window.RESULTADOS2);

    var flow = '<section class="rs2-flow" aria-label="Flujograma de la fase 3">' +
      '<div class="rs2-chain">' + (r.flujo || []).map(function (n, i) {
        return (i > 0 ? flecha(i - 1) : '') + nodo(n);
      }).join('') + '</div>' +
      (r.ui && r.ui.nota ? '<p class="rs2-note">' + r.ui.nota + '</p>' : '') +
    '</section>';

    var fotos = '<section class="rs2-fotos" aria-label="Espacio para fotografías">' +
      (r.fotos || []).map(foto).join('') + '</section>';

    return '<section class="slide slide-resultados" data-slide="7">' +
      '<header class="slide-head">' +
        '<h2>' + r.title + '</h2>' +
        (r.subtitle ? '<span class="rs-subtitle">' + r.subtitle + '</span>' : '') +
        '<div class="head-rule"></div>' +
      '</header>' +
      '<div class="rs2-body"><div class="rs2-cols">' + flow + fotos + pantallas(window.ER_TABLES) + '</div></div>' +
    '</section>';
  };
})();

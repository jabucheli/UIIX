(function () {
  window.slideRenderers = window.slideRenderers || {};

  window.slideRenderers.metodologia = function (thesis, p, o, t, m) {
    var enfoqueFlow = m.enfoque.flow.map(function (f, i) {
      return (i > 0 ? '<span class="md-farr">' + window.Icons.svg('chevRight', 13) + '</span>' : '') +
        '<div class="md-fnode md-fnode--' + f.color + '">' +
          '<b>' + f.tag + '</b>' +
          (f.main ? '<span class="md-fmain">' + f.main + '</span>' : '') +
          '<span>' + f.det + '</span>' +
        '</div>';
    }).join('');

    var types = '<div class="md-types">' + m.enfoque.types.map(function (tp, i) {
      var red = i === 1;
      return '<div class="md-type' + (red ? ' md-type--red' : '') + '">' +
        '<b>' + tp.t + '</b>' +
        '<span>' + tp.d + '</span>' +
      '</div>';
    }).join('') + '</div>';

    var pilot = '<div class="md-pilot">' + m.enfoque.pilot + '</div>';
    var synthesis = '<div class="md-synth">' + m.enfoque.synthesis + '</div>';

    var enfoqueBlock = '<div class="md-panel md-panel--focus" data-focus="1" tabindex="0" role="button" aria-label="Ampliar el bloque 1, enfoque y diseño">' +
      '<div class="md-panel-head"><span class="md-num">1</span><h3>Enfoque, diseño y tipo de investigación</h3>' +
        '<span class="md-hint">' + m.ui.hint + '</span>' +
        '<span class="md-hint--off">' + m.ui.cerrar + '</span></div>' +
      '<div class="md-focus-body">' +
        '<div class="md-flow">' + enfoqueFlow + '</div>' +
        types +
        pilot +
        synthesis +
      '</div>' +
    '</div>';

    var phases = m.phases.map(function (ph, i) {
      return (i > 0 ? '<span class="md-parr">' + window.Icons.svg('chevRight', 12) + '</span>' : '') +
        '<div class="md-pnode md-pnode--' + ph.color + '">' +
          '<span class="md-pnum">Fase ' + ph.num + '</span>' +
          '<span class="md-pkind">' + ph.kind + '</span>' +
          '<b>' + ph.name + '</b>' +
          '<span class="md-pdo">' + ph.det + '</span>' +
          '<span class="md-pout"><b>Salida:</b> ' + ph.out + '</span>' +
        '</div>';
    }).join('');

    var pipeline = '<div class="md-pipeline">' + m.pipeline.map(function (tok, i) {
      return (i > 0 ? '<span class="md-parr2">→</span>' : '') +
        '<span class="md-ptok' + (i === 0 || i === 4 ? ' md-ptok--edge' : '') + '">' + tok + '</span>';
    }).join('') + '</div>';

    var phasesBlock = '<div class="md-panel md-panel--phases" data-focus="2" tabindex="0" role="button" aria-label="Ampliar el bloque 2, estructura metodológica">' +
      '<div class="md-panel-head"><span class="md-num">2</span><h3>Estructura metodológica · cinco fases</h3>' +
        '<span class="md-hint">' + m.ui.hint + '</span>' +
        '<span class="md-hint--off">' + m.ui.cerrar + '</span></div>' +
      '<div class="md-phases">' + phases + '</div>' +
      pipeline +
    '</div>';

    /* ---- Bloque 3 · Mapa radial: una rama por fase metodológica (pob1.md) ---- */

    var MW = 1366, MH = 378;

    /* Columnas laterales: fases 1 y 4 (izquierda), fases 2 y 3 (derecha) */
    var COLW = 550, COLH = 124, ROW2 = 128, RX = MW - COLW;
    /* Fase 5 centrada bajo el círculo */
    var FW = 500, FH = 120, FX = (MW - FW) / 2, FY = MH - FH;
    /* Nodo central: centrado en el eje horizontal del bloque 3 */
    var CX = MW / 2, CY = 126, CR = 120;

    var RAMCOL = { green: '#006E49', red: '#C0242A' };

    var RAM = {
      lt: { x: 0, y: 0, w: COLW, h: COLH },
      lb: { x: 0, y: ROW2, w: COLW, h: COLH },
      rt: { x: RX, y: 0, w: COLW, h: COLH },
      rb: { x: RX, y: ROW2, w: COLW, h: COLH },
      cb: { x: FX, y: FY, w: FW, h: FH }
    };

    /* Tamaño de letra proporcional al recuadro de cada bloque */
    function escala(b) {
      var e = Math.min(b.w / COLW, b.h / COLH);
      return Math.max(0.78, Math.min(1.06, e)).toFixed(3);
    }

    var SVG = [];

    function curva(x1, y1, x2, y2, c) {
      var mx = (x1 + x2) / 2;
      SVG.push('<path d="M ' + x1 + ' ' + y1 + ' C ' + mx + ' ' + y1 + ', ' + mx + ' ' + y2 + ', ' + x2 + ' ' + y2 +
        '" fill="none" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/>');
      SVG.push('<circle cx="' + x2 + '" cy="' + y2 + '" r="4" fill="' + c + '"/>');
    }

    function conectores(ramas) {
      ramas.forEach(function (r) {
        var b = RAM[r.pos], c = RAMCOL[r.color];
        if (r.pos === 'cb') {
          curva(CX, CY + CR, CX, b.y, c);
          return;
        }
        var xBorde = r.pos.charAt(0) === 'l' ? b.x + b.w : b.x;
        var yBorde = b.y + b.h / 2;
        var ang = Math.atan2(yBorde - CY, xBorde - CX);
        curva(
          Math.round(CX + CR * Math.cos(ang)), Math.round(CY + CR * Math.sin(ang)),
          xBorde, Math.round(yBorde), c
        );
      });
    }

    function logo(k) {
      return '<span class="mm-lg' + (k.length > 1 ? ' mm-lg--w' : '') + '">' + k + '</span>';
    }

    function lista(items) {
      return '<ul class="mm-list">' + items.map(function (it) {
        return '<li>' + logo(it.k) + '<span>' + it.v + '</span></li>';
      }).join('') + '</ul>';
    }

    function ramaHtml(r) {
      var b = RAM[r.pos];
      return '<div class="mm-rama mm-rama--' + r.color + '" data-focus="' + r.pos + '" tabindex="0" role="button" aria-label="Ampliar la fase ' + r.n + ', ' + r.title + '" style="--mm-fs:' + escala(b) + ';left:' + b.x + 'px;top:' + b.y + 'px;width:' + b.w + 'px;height:' + b.h + 'px">' +
        '<div class="mm-rhead">' +
          '<span class="mm-rn">' + r.n + '</span>' +
          '<div class="mm-rtt"><b>' + r.title + '</b><span>' + r.sub +
            (r.chips.length ? '<span class="mm-rchips">' + r.chips.map(function (c) {
              return '<span class="mm-chip">' + c + '</span>';
            }).join('') + '</span>' : '') +
          '</span></div>' +
          '<span class="mm-rico">' + window.Icons.svg(r.icon, 14) + '</span>' +
        '</div>' +
        '<div class="mm-subs">' +
          '<div class="mm-sub mm-sub--a">' +
            '<div class="mm-sub-h">' + window.Icons.svg('users', 10) + '<span>Población y muestra</span></div>' +
            lista(r.pob) +
          '</div>' +
          '<div class="mm-sub mm-sub--b">' +
            '<div class="mm-sub-h"><span class="mm-sub-ht">Métodos, Técnicas e Instrumentos</span></div>' +
            r.mti.map(function (x) {
              return '<ul class="mm-list">' +
                '<li>' + logo('M') + '<span>' + x.m + '</span></li>' +
                '<li>' + logo('T') + '<span>' + x.t + '</span></li>' +
                '<li>' + logo('I') + '<span>' + x.i + '</span></li>' +
              '</ul>';
            }).join('') +
          '</div>' +
        '</div>' +
        (r.prod ? '<div class="mm-prod"><span class="mm-pb">Prod.</span><span class="mm-pv">' + r.prod + '</span></div>' : '') +
      '</div>';
    }

    var mapa = m.mapa;
    conectores(mapa.ramas);

    var mapHtml = '<div class="mm-map" style="width:' + MW + 'px;height:' + MH + 'px">' +
      '<svg class="mm-svg" viewBox="0 0 ' + MW + ' ' + MH + '" preserveAspectRatio="none" aria-hidden="true">' + SVG.join('') + '</svg>' +
      mapa.ramas.map(ramaHtml).join('') +
      '<div class="mm-center" style="left:' + (CX - CR) + 'px;top:' + (CY - CR) + 'px;width:' + (CR * 2) + 'px;height:' + (CR * 2) + 'px">' +
        '<span class="mm-cico">' + window.Icons.svg(mapa.center.icon, 20) + '</span>' +
        '<b>' + mapa.center.title.join('<br>') + '</b>' +
        '<span class="mm-csub">' + mapa.center.sub + '</span>' +
      '</div>' +
    '</div>';

    var ruta = '<div class="mm-ruta">' +
      '<span class="mm-ruta-l"><span class="mm-ruta-b">Ruta metodológica</span>' +
        m.ruta.map(function (tok, i) {
          return (i > 0 ? '<span class="mm-ruta-a">→</span>' : '') +
            '<span class="mm-ruta-t mm-ruta-t--' + tok.c + '">' + tok.t + '</span>';
        }).join('') +
      '</span>' +
      '<span class="mm-note">' + m.note + '</span>' +
    '</div>';

    var mapaBlock = '<div class="md-panel md-panel--mapa">' +
      '<div class="md-panel-head"><span class="md-num">3</span><h3>Metodología, población y muestra · fases 1–5</h3>' +
        '<span class="md-hint">' + m.ui.hintRama + '</span>' +
        '<span class="md-hint--off">' + m.ui.cerrar + '</span></div>' +
      mapHtml +
      ruta +
    '</div>';

    return '<section class="slide slide-metodologia" data-slide="5">' +
      '<header class="slide-head">' +
        '<h2>' + m.title + '</h2>' +
        '<span class="md-subtitle">' + m.subtitle + '</span>' +
        '<div class="head-rule"></div>' +
      '</header>' +
      '<div class="md-body">' +
        '<div class="md-top">' + enfoqueBlock + phasesBlock + '</div>' +
        mapaBlock +
      '</div>' +
    '</section>';
  };
})();
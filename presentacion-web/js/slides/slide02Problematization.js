(function () {
  window.slideRenderers = window.slideRenderers || {};

  function pct(v, max) { return Math.round(v / max * 100); }
  function dec(v) { return String(v).replace('.', ','); }

  window.slideRenderers.problematizacion = function (thesis, p) {
    var tilesHtml = '<div class="ev-hist">' + p.historical.map(function (g) {
      return '<div class="ev-period">' +
        '<div class="ev-period-label">' + g.period + '</div>' +
        '<div class="ev-period-stats">' +
          g.stats.map(function (s) {
            return '<div class="ev-tile">' +
              '<div class="ev-value">' + s.value + '</div>' +
              '<div class="ev-caption">' + s.caption + '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
        (g.note ? '<div class="ev-period-note">' + g.note + '</div>' : '') +
      '</div>';
    }).join('') + '</div>';

    var max = p.bars.items[0].value;
    var bars = p.bars.items.map(function (b) {
      var w = pct(b.value, max);
      var op = (0.4 + 0.6 * (b.value / max)).toFixed(2);
      return '<div class="hbar">' +
        '<div class="hbar-top"><span class="hbar-label">' + b.label + '</span><span class="hbar-value">' + dec(b.value) + '%</span></div>' +
        '<div class="hbar-track"><div class="hbar-fill" style="width:' + w + '%;opacity:' + op + '"></div></div>' +
      '</div>';
    }).join('');

    var donutHtml = '<div class="ev-donut">' +
      '<div class="ev-donut-chart">' + window.Icons.donut(p.donut.percent, 82, '#C0242A') +
        '<div class="ev-donut-center">' + p.donut.percent + '%</div>' +
      '</div>' +
      '<div class="ev-donut-text">' +
        '<div class="ev-donut-cap">' + p.donut.label + '</div>' +
        '<div class="ev-donut-src">' + p.donut.caption + '</div>' +
      '</div>' +
    '</div>';

    var evPanel = '<aside class="ev-column" data-focus="ev" role="button" tabindex="0" aria-label="Ampliar la evidencia">' +
      '<div class="ev-panel">' +
        '<div class="accent"></div>' +
        '<div class="ev-header">' + p.evidenceLabel + '</div>' +
        '<div class="ev-cards">' +
          tilesHtml +
          '<div class="ev-footnote">' + p.footnote + '</div>' +
          '<div class="ev-block ev-donut-block">' +
            '<div class="ev-block-title">Accidentalidad en obra</div>' + donutHtml +
          '</div>' +
          '<div class="ev-block ev-bars-block">' +
            '<div class="ev-block-title">' + p.bars.title + '</div>' +
            '<div class="ev-bars">' + bars + '</div>' +
            '<div class="ev-source">Fuente: ' + p.bars.source + '</div>' +
          '</div>' +
          '<div class="ev-block ev-sources-block">' +
            '<div class="ev-block-title">Fuentes de consulta</div>' +
            '<div class="ev-sources">' +
              p.sources.map(function (s) {
                return '<div class="src-item">' +
                  '<span class="src-num">' + s.n + '</span>' +
                  '<span class="src-text">' + s.text + '</span>' +
                '</div>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</aside>';

    var flowHtml = '';
    for (var i = 0; i < p.flow.length; i++) {
      if (i > 0) {
        flowHtml += '<div class="flow-arrow">' + window.Icons.svg('downArrow', 26) + '</div>';
      }
      var n = p.flow[i];
      var cls = 'flow-node';
      var nc = n.color || '#4c4a4f';
      var pos = i + 1;
      if (n.central) {
        cls = 'flow-node central';
        nc = '#C0242A';
      } else if (n.green) {
        cls = 'flow-node green';
        nc = '#006E49';
      } else {
        if (n.tall) cls = 'flow-node tall';
        nc = (pos % 2 === 1) ? '#006E49' : '#C0242A';
      }
      var fattr = (i === 6) ? ' data-focus="q7" role="button" tabindex="0" aria-label="Ampliar la pregunta científica"' : '';
      flowHtml += '<div class="' + cls + '" style="--nc:' + nc + ';--nc-soft:' + nc + '26"' + fattr + '>' +
        '<div class="tnode-dot">' + (i + 1) + '</div>' +
        '<div class="node-icon">' + window.Icons.svg(n.icon, 21) + '</div>' +
        '<div class="node-text">' +
          '<div class="node-tag">' + n.tag + '</div>' +
          '<div class="node-title">' + n.title + '</div>' +
          '<div class="node-body">' + n.body + '</div>' +
        '</div>' +
      '</div>';
    }

    var objBlock = '<div class="obj-block">' +
      '<div class="obj-head">' + p.studyObjectHeader + '</div>' +
      '<div class="obj-text"><span class="obj-short">' + p.studyObject + '</span><span class="obj-full">' + p.studyObjectFull + '</span></div>' +
    '</div>';

    var lvlWidths = [100, 82, 64, 46, 28];
    var lvlColors = ['green', 'red', 'green', 'red', 'green'];
    var pyramid = p.hierarchy.levels.map(function (lv, i) {
      var active = i === 2;
      return '<div class="p-level p-level--' + lvlColors[i] + (active ? ' p-active' : '') + '" style="width:' + lvlWidths[i] + '%">' +
        '<span>' + lv + '</span>' +
      '</div>';
    }).join('');

    var pyramidBlock = '<div class="pyramid-block">' +
      '<div class="pyramid-title">Jerarquía de controles de riesgos</div>' +
      '<div class="pyramid">' + pyramid + '</div>' +
      '<div class="pyramid-scale">' +
        '<span class="ps-top">Más eficaz</span>' +
        '<span class="ps-arrow">' + window.Icons.svg('downArrow', 10) + '</span>' +
        '<span class="ps-bottom">Menos eficaz</span>' +
      '</div>' +
      '<div class="pyramid-caption">Control en origen, medio y receptor — C.D. 513 (art. 53) · D.E. 255</div>' +
    '</div>';

    var campoBlock = '<div class="campo-block">' +
      '<div class="campo-head">' + p.actionFieldHeader + '</div>' +
      '<div class="campo-line">' + p.actionField + '</div>' +
    '</div>';

    var cards = p.justifications.map(function (j) {
      return window.JustificationCard.render(j);
    }).join('');

    return '<section class="slide slide-problem" data-slide="2">' +
      '<header class="slide-head"><h2>' + p.title + '</h2><div class="head-rule"></div></header>' +
      '<div class="problem-body">' +
        evPanel +
        '<div class="flow">' +
          flowHtml +
          '<div class="flow-link">' + window.Icons.svg('chevRight', 13) + '</div>' +
        '</div>' +
        '<aside class="just-column" data-focus="jf" role="button" tabindex="0" aria-label="Ampliar la justificación">' +
          '<div class="just-panel">' +
            '<div class="accent"></div>' +
            '<div class="just-header">' + p.justHeader + '</div>' +
            '<div class="just-cards">' + cards + '</div>' +
            pyramidBlock +
            objBlock +
            campoBlock +
          '</div>' +
        '</aside>' +
        '<div class="q7-overlay" data-focus="q7" role="button" tabindex="0" aria-label="Cerrar la pregunta científica ampliada">' +
          '<div class="q7-card">' +
            '<div class="accent"></div>' +
            '<div class="q7-header">' + p.flow[6].tag + '</div>' +
            '<div class="q7-content">' +
              '<div class="q7-body">' + p.flow[6].body + '</div>' +
              '<div class="q7-hint">Clic o Escape para cerrar</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';
  };
})();

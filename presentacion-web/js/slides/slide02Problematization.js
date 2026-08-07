(function () {
  window.slideRenderers = window.slideRenderers || {};

  function pct(v, max) { return Math.round(v / max * 100); }
  function dec(v) { return String(v).replace('.', ','); }

  window.slideRenderers.problematizacion = function (thesis, p) {
    var tiles = p.indicators.map(function (s) {
      return '<div class="ev-tile">' +
        '<div class="ev-value">' + s.value + '</div>' +
        '<div class="ev-caption">' + s.caption + '</div>' +
      '</div>';
    }).join('');

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

    var evPanel = '<aside class="ev-column">' +
      '<div class="ev-label">' + p.evidenceLabel + '</div>' +
      '<div class="ev-tiles">' + tiles + '</div>' +
      '<div class="ev-block ev-donut-block">' +
        '<div class="ev-block-title">Accidentalidad en obra</div>' + donutHtml +
      '</div>' +
      '<div class="ev-block ev-bars-block">' +
        '<div class="ev-block-title">' + p.bars.title + '</div>' +
        '<div class="ev-bars">' + bars + '</div>' +
        '<div class="ev-source">Fuente: ' + p.bars.source + '</div>' +
      '</div>' +
      '<div class="ev-footnote">' + p.footnote + '</div>' +
    '</aside>';

    var flowHtml = '';
    for (var i = 0; i < p.flow.length; i++) {
      if (i > 0) {
        flowHtml += '<div class="flow-arrow">' + window.Icons.svg('downArrow', 26) + '</div>';
      }
      var n = p.flow[i];
      var cls = 'flow-node';
      if (n.central) cls += ' central';
      if (n.green) cls += ' green';
      else if (n.tall) cls += ' tall';
      var nc = n.color || '#4c4a4f';
      flowHtml += '<div class="' + cls + '" style="--nc:' + nc + ';--nc-soft:' + nc + '26">' +
        '<div class="tnode-dot">' + (i + 1) + '</div>' +
        '<div class="node-icon">' + window.Icons.svg(n.icon, 21) + '</div>' +
        '<div class="node-text">' +
          '<div class="node-tag">' + n.tag + '</div>' +
          '<div class="node-title">' + n.title + '</div>' +
          '<div class="node-body">' + n.body + '</div>' +
        '</div>' +
      '</div>';
    }

    var lvlWidths = [100, 82, 64, 46, 28];
    var pyramid = p.hierarchy.levels.map(function (lv, i) {
      var active = i === 2;
      return '<div class="p-level' + (active ? ' p-active' : '') + '" style="width:' + lvlWidths[i] + '%">' +
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
      '<div class="pyramid-caption">Control en origen, medio y receptor — C.D. 513 (art. 53)</div>' +
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
          '<div class="flow-link" style="top:510px">' + window.Icons.svg('chevRight', 13) + '</div>' +
        '</div>' +
        '<aside class="just-column">' +
          '<div class="just-panel">' +
            '<div class="accent"></div>' +
            '<div class="just-header">' + p.justHeader + '</div>' +
            '<div class="just-cards">' + cards + '</div>' +
            pyramidBlock +
          '</div>' +
        '</aside>' +
      '</div>' +
    '</section>';
  };
})();

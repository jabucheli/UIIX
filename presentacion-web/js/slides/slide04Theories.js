(function () {
  window.slideRenderers = window.slideRenderers || {};

  window.slideRenderers.teorias = function (thesis, p, o, t) {
    var intro = t.introFlow.map(function (g, i) {
      var chips = g.map(function (k) {
        return '<span class="th-kw">' + k + '</span>';
      }).join('');
      return (i > 0 ? '<span class="th-karr">&#8594;</span>' : '') + '<span class="th-kgroup">' + chips + '</span>';
    }).join('');

    var gallery = t.gallery.map(function (b) {
      var cls = b.cls ? ' th-box--' + b.cls : '';
      var timeline = '';
      if (b.timeline) {
        timeline = '<div class="th-timeline">' + b.timeline.map(function (m, i) {
          var cls2 = i % 2 === 1 ? ' th-milestone--red' : '';
          return '<div class="th-milestone' + cls2 + '"><b>' + m.y + '</b><span>' + m.t + '</span></div>';
        }).join('') + '</div>';
      }
      var flow = '';
      if (b.flow) {
        flow = '<div class="th-bflow">' + b.flow.map(function (f, i) {
          return (i > 0 ? '<span class="th-barr">&#10132;</span>' : '') +
            '<div class="th-bflow-item"><b>' + f.kw + '</b><span>' + f.det + '</span></div>';
        }).join('') + '</div>';
      }
      var boxNflow = '';
      if (b.nflow) {
        boxNflow = '<div class="th-nflow">' + t.numerals.map(function (c, i) {
          return (i > 0 ? '<span class="th-narr">&#10132;</span>' : '') +
            '<span class="th-ncell"><b>' + c[0] + '</b>' + c[1] + '</span>';
        }).join('') + '</div>';
      }
      var mc = '';
      if (b.mc) {
        mc = '<div class="th-steps">' + b.mc.map(function (st, i) {
          var red = i === 5 || i === 7;
          return '<div class="th-step' + (red ? ' th-step--red' : '') + '">' +
            '<span class="th-step-o">' + (i + 1) + '</span>' +
            '<div><b>' + st.t + '</b>' + (st.s ? '<span>' + st.s + '</span>' : '') + '</div>' +
          '</div>';
        }).join('') + '</div>';
      }
      var content = b.flow ? flow : (b.mc ? mc : '<p>' + (b.lines || '') + '</p>');
      return '<div class="th-box' + cls + '">' +
        '<h3>' + b.h + '</h3>' +
        content +
        timeline +
        boxNflow +
        (b.ref ? '<p class="th-ref">' + b.ref + '</p>' : '') +
      '</div>';
    }).join('');

    var theories = t.theories.map(function (th) {
      var r = th.accent ? ' red' : '';
      return '<div class="th-theory">' +
        '<div class="th-lvl1' + r + '">' +
          '<span class="th-n">' + th.num + '</span>' +
          '<strong>' + th.name + '</strong>' +
          '<div class="th-key">' + th.key + '</div>' +
        '</div>' +
        '<div class="th-lvl2' + r + '">' +
          '<p>' + th.text + '</p>' +
          '<p class="th-apa">' + th.apa + '</p>' +
        '</div>' +
      '</div>';
    }).join('');

    var flow = t.flow.map(function (f, i) {
      return (i > 0 ? '<div class="th-farr">&#10132;</div>' : '') +
        '<div class="th-fnode' + (f.red ? ' red' : '') + '">' +
          '<b>' + f.name + '</b>' +
          '<span>' + f.text + '</span>' +
        '</div>';
    }).join('');

    return '<section class="slide slide-teorias" data-slide="4">' +
      '<header class="slide-head">' +
        '<span class="th-tag">' + t.tag + '</span>' +
        '<h2>' + t.title + '</h2>' +
        '<span class="th-subtitle">' + t.subtitle + '</span>' +
        '<div class="head-rule"></div>' +
      '</header>' +
      '<div class="th-body">' +
        '<div class="th-intro"><div class="th-kflow">' + intro + '</div></div>' +
        '<div class="th-grid">' +
          '<div class="th-left">' + gallery + '</div>' +
          '<div class="th-right">' +
            '<div class="th-panel">' +
              '<div class="th-panel-title"><h3>2.2 Marco teórico — TEORÍAS BASE</h3></div>' +
              '<div class="th-theories">' + theories + '</div>' +
              '<div class="th-flow">' +
                '<div class="th-flow-title">' + t.flowTitle + '</div>' +
                '<div class="th-flow-row">' + flow + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="th-legal">' +
              '<h4>' + t.legalTitle + '</h4>' +
              '<p>' + t.legalText + '</p>' +
              '<div class="th-legal-img">' + t.legalImage + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';
  };
})();
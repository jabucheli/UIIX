(function () {
  window.slideRenderers = window.slideRenderers || {};

  function panelHead(n, icon, text, color) {
    return '<div class="rs-phead rs-phead--' + color + '">' +
      '<span class="rs-num">' + n + '</span>' +
      '<h3>' + text + '</h3>' +
      '<span class="rs-pico">' + window.Icons.svg(icon, 15) + '</span>' +
    '</div>';
  }

  function panel(num, icon, header, color, width, body) {
    return '<div class="rs-panel rs-panel--w' + width + '" data-focus="' + num + '" tabindex="0" role="button" aria-label="Ampliar ' + header + '">' +
      panelHead(num, icon, header, color) +
      '<div class="rs-pbody">' + body + '</div>' +
    '</div>';
  }

  function subViewP(p, g, i) {
    var key = '1' + (i === 0 ? 'a' : 'b');
    var items = g.items.map(function (it, k) {
      return '<li><span class="rs-on">' + (k + 1) + '</span><span class="rs-ot">' + it + '</span></li>';
    }).join('');
    return '<div class="rs-subview rs-subview--' + key + '" data-focus="' + key + '">' +
      '<div class="rs-subinfo">' +
        '<div class="rs-subv-top">' +
          '<span class="rs-subv-v rs-subv-v--' + g.color + '">' + g.count + '</span>' +
          '<span class="rs-subv-t"><span class="rs-subv-n">' + g.name + '</span>' +
            '<span class="rs-subv-u">' + p.totalUnit + '</span></span>' +
        '</div>' +
        '<ol class="rs-olist rs-olist--sub">' + items + '</ol>' +
      '</div>' +
      '<figure class="rs-subpic">' +
        '<img src="' + g.image + '" alt="Procesos por actividad — ' + g.name + '" onerror="window.RS_FIG_FALLBACK(this)">' +
        '<figcaption>' + g.name + ' · ' + g.count + ' ' + p.totalUnit + '</figcaption>' +
      '</figure>' +
    '</div>';
  }

  function bloque1(r) {
    var p = r.procesos;

    var total = '<div class="rs-total">' +
      '<span class="rs-total-l">' + p.totalLabel + '</span>' +
      '<span class="rs-total-n">' + p.total + '</span>' +
      '<span class="rs-total-u">' + p.totalUnit + '</span>' +
    '</div>';

    var groups = p.groups.map(function (g, i) {
      var items = g.items.map(function (it, k) {
        return '<li><span class="rs-on">' + (k + 1) + '</span><span class="rs-ot">' + it + '</span></li>';
      }).join('');
      return '<div class="rs-group rs-group--' + g.color + '" data-focus="1' + (i === 0 ? 'a' : 'b') +
        '" tabindex="0" role="button" aria-label="Ampliar la información de ' + g.name + '">' +
        '<div class="rs-ghead"><span class="rs-gname">' + g.name + '</span>' +
          '<span class="rs-gcount">' + g.count + ' ' + g.unit +
          window.Icons.svg('expand', 10) + '</span></div>' +
        '<ol class="rs-olist">' + items + '</ol>' +
      '</div>';
    }).join('');

    var dist = '<div class="rs-dist">' +
      '<div class="rs-dist-h">' + r.dist.header + '</div>' +
      '<div class="rs-bar">' + r.dist.parts.map(function (pt) {
        return '<span class="rs-bar-s rs-bar-s--' + pt.color + '" style="width:' +
          (pt.value / p.total * 100).toFixed(1) + '%">' + pt.value + '</span>';
      }).join('') + '</div>' +
      '<div class="rs-dist-l">' + r.dist.parts.map(function (pt) {
        return '<span class="rs-dist-i"><span class="rs-dot rs-dot--' + pt.color + '"></span>' +
          pt.name + ' · <b>' + pt.value + '</b></span>';
      }).join('') + '</div>' +
    '</div>';

    return panel(p.num, p.icon, p.header, p.color, 30, total + groups + dist +
      subViewP(p, p.groups[0], 0) + subViewP(p, p.groups[1], 1));
  }

  window.RS_FIG_FALLBACK = function (img) {
    img.style.display = 'none';
    var fig = img.parentNode;
    var s = document.createElement('span');
    s.className = 'rs-pic-missing';
    s.textContent = 'Imagen pendiente: ' + (img.getAttribute('src') || '');
    fig.appendChild(s);
  };

  function groupsHtml(r) {
    return '<div class="rs-groups"><div class="rs-groups-h">Grupos de riesgo</div>' + r.groups.map(function (g) {
      var chips = g.items.map(function (it) {
        return '<span class="rs-chip rs-chip--' + g.color + '">' + it + '</span>';
      }).join('');
      return '<div class="rs-gline">' +
        '<span class="rs-glab rs-glab--' + g.color + '">' + g.label + '</span>' +
        '<span class="rs-chips">' + chips + '</span>' +
      '</div>';
    }).join('') + '</div>';
  }

  function noteHtml(r) {
    return '<div class="rs-note">' +
      '<span class="rs-note-t">' + r.noteTitle + '</span>' +
      '<span class="rs-note-m">' + r.noteMain + '</span>' +
      '<span class="rs-note-s">' + r.noteSub + '</span>' +
      '<span class="rs-note-s"><b>' + r.noteMec + '</b></span>' +
    '</div>';
  }

  function subView(r, s, i) {
    var key = '2' + (i === 0 ? 'a' : 'b');
    return '<div class="rs-subview rs-subview--' + key + '" data-focus="' + key + '">' +
      '<div class="rs-subinfo">' +
        '<div class="rs-subv-top">' +
          '<span class="rs-subv-v rs-subv-v--' + s.color + '">' + s.total + '</span>' +
          '<span class="rs-subv-t"><span class="rs-subv-n">' + s.name + '</span>' +
            '<span class="rs-subv-u">riesgos asociados</span></span>' +
        '</div>' +
        '<div class="rs-bar rs-bar--big">' +
          '<span class="rs-bar-s rs-bar-s--green" style="width:' + (s.seg / s.total * 100).toFixed(1) + '%"></span>' +
          '<span class="rs-bar-s rs-bar-s--red" style="width:' + (s.comp / s.total * 100).toFixed(1) + '%"></span>' +
        '</div>' +
        '<div class="rs-subv-split">' +
          '<span class="rs-seg"><b class="rs-subv-b rs-subv-b--green">' + s.seg + '</b> riesgos de seguridad</span>' +
          '<span class="rs-op">+</span>' +
          '<span class="rs-com"><b class="rs-subv-b rs-subv-b--red">' + s.comp + '</b> complementarios</span>' +
        '</div>' +
        groupsHtml(r) +
        noteHtml(r) +
      '</div>' +
      '<figure class="rs-subpic">' +
        '<img src="' + s.image + '" alt="Riesgos asociados por actividad — ' + s.name + '" onerror="window.RS_FIG_FALLBACK(this)">' +
        '<figcaption>' + s.name + ' · ' + s.total + ' riesgos asociados (NTP 330)</figcaption>' +
      '</figure>' +
    '</div>';
  }

  function bloque2(r) {
    var series = r.series.map(function (s, i) {
      var pct = function (n) { return (n / s.total * 100).toFixed(1) + '%'; };
      return '<div class="rs-risk rs-risk--' + s.color + '" data-focus="2' + (i === 0 ? 'a' : 'b') +
        '" tabindex="0" role="button" aria-label="Ampliar la información de ' + s.name + '">' +
        '<div class="rs-risk-t"><span class="rs-risk-n">' + s.name + '</span>' +
          '<span class="rs-risk-v">' + s.total + '</span>' +
          '<span class="rs-risk-u">riesgos asociados</span></div>' +
        '<div class="rs-risk-b">' +
          '<span class="rs-seg"><b>' + s.seg + '</b> seguridad</span>' +
          '<span class="rs-op">+</span>' +
          '<span class="rs-com"><b>' + s.comp + '</b> complementarios</span>' +
        '</div>' +
        '<div class="rs-bar rs-bar--thin">' +
          '<span class="rs-bar-s rs-bar-s--green" style="width:' + pct(s.seg) + '"></span>' +
          '<span class="rs-bar-s rs-bar-s--red" style="width:' + pct(s.comp) + '"></span>' +
        '</div>' +
      '</div>';
    }).join('');

    return panel(r.num, r.icon, r.header, r.color, 33, series + groupsHtml(r) + noteHtml(r) +
      subView(r, r.series[0], 0) + subView(r, r.series[1], 1));
  }

  function tabla(f, ctx) {
    var head = '<tr>' + f.cols.map(function (c, i) {
      return '<th' + (i === 0 ? ' class="rs-c-n"' : '') +
        (f.colw && f.colw[i] ? ' style="width:' + f.colw[i] + 'px"' : '') + '>' + c + '</th>';
    }).join('') + '</tr>';

    var rows = f.rows.map(function (row) {
      return '<tr>' + row.map(function (cell, i) {
        return '<td' + (i === 0 ? ' class="rs-c-n"' : '') + '>' + cell + '</td>';
      }).join('') + '</tr>';
    }).join('');

    return '<div class="rs-thead">' + f.table + '</div>' +
      '<div class="rs-ctx">' + window.Icons.svg('search', 10) + '<span>' + ctx + '</span></div>' +
      '<table class="rs-tbl"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table>';
  }

  function fase(f, ctx, key) {
    var msg = f.msg.map(function (m, i) {
      return (i > 0 ? '<span class="rs-msg-a">' + window.Icons.svg('chevRight', 9) + '</span>' : '') +
        '<span>' + m + '</span>';
    }).join('');

    var pic = f.image
      ? '<figure class="rs-fpic" data-focus="' + key + 'img" tabindex="0" role="button" aria-label="Ampliar la imagen ' + f.title + ' al tamaño de la pantalla"><img src="' + f.image +
        '" alt="' + f.title + '" onerror="window.RS_FIG_FALLBACK(this)">' +
        '<figcaption>' + f.n + ' · ' + f.title + '</figcaption></figure>'
      : '';

    return '<div class="rs-fase rs-fase--' + f.color + '" data-focus="' + key +
      '" tabindex="0" role="button" aria-label="Ampliar la fase ' + f.n + '">' +
      '<div class="rs-fhead"><span class="rs-fnum">' + f.n + '</span>' +
        '<span class="rs-ftitle">' + f.title + '</span></div>' +
      '<div class="rs-ftext">' + f.text + '</div>' +
      tabla(f, ctx) +
      pic +
      '<div class="rs-fmsg">' + msg + '</div>' +
    '</div>';
  }

  function bloque3(i3) {
    var link = '<div class="rs-link">' +
      window.Icons.svg('downArrow', 11) +
      '<span>' + i3.link + '</span>' +
      window.Icons.svg('downArrow', 11) +
    '</div>';

    return panel(i3.num, i3.icon, i3.header, i3.color, 37, fase(i3.fases[0], i3.context, '3a') + link +
      fase(i3.fases[1], i3.context, '3b'));
  }

  window.slideRenderers.resultados = function (thesis, p, o, t, m, r) {
    var cols = '<div class="rs-cols">' +
      bloque1(r) + bloque2(r.riesgos) + bloque3(r.instrumentos) +
    '</div>';

    var seq = '<div class="rs-seq"><span class="rs-seq-l">Secuencia</span>' +
      r.secuencia.map(function (s, i) {
        return (i > 0 ? '<span class="rs-seq-a">' + window.Icons.svg('chevRight', 11) + '</span>' : '') +
          '<span class="rs-seq-t rs-seq-t--' + s.c + '">' + s.t + '</span>';
      }).join('') +
      '<span class="rs-hint">' + r.ui.hint + '</span>' +
    '</div>';

    return '<section class="slide slide-resultados" data-slide="6">' +
      '<header class="slide-head">' +
        '<h2>' + r.title + '</h2>' +
        (r.subtitle ? '<span class="rs-subtitle">' + r.subtitle + '</span>' : '') +
        '<div class="head-rule"></div>' +
      '</header>' +
      '<div class="rs-body">' + cols + seq + '</div>' +
    '</section>';
  };
})();

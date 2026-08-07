(function () {
  window.slideRenderers = window.slideRenderers || {};

  window.slideRenderers.cover = function (thesis) {
    var sil = '<div class="sil-a">' + window.Icons.svg('building', 90, '') + '</div>' +
              '<div class="sil-b">' + window.Icons.svg('building', 70, '') + '</div>' +
              '<div class="sil-c">' + window.Icons.svg('building', 116, '') + '</div>';

    return '<section class="slide slide-cover" data-slide="1">' +
      '<div class="cover-band">' +
        window.Icons.emblem(52) +
        '<div class="cover-univ">' + thesis.universityPlaceholder + '</div>' +
        '<div class="cover-sub">' + thesis.programPlaceholder + '</div>' +
      '</div>' +
      '<div class="cover-body">' +
        '<div class="cover-kicker">TESIS DOCTORAL</div>' +
        '<h1 class="cover-title">' + thesis.title + '</h1>' +
        '<div class="cover-rule"></div>' +
        '<div class="cover-meta">' +
          '<div class="cover-meta-row"><span class="m-label">PRESENTA</span><span class="m-line">' + thesis.doctorandoPlaceholder + '</span></div>' +
          '<div class="cover-meta-row"><span class="m-label">DIRECCIÓN</span><span class="m-line">' + thesis.direccionPlaceholder + '</span></div>' +
          '<div class="cover-meta-row"><span class="m-label">CIUDAD Y FECHA</span><span class="m-line">' + thesis.ciudadFechaPlaceholder + '</span></div>' +
        '</div>' +
        '<div class="cover-sil">' + sil + '</div>' +
      '</div>' +
      '<div class="cover-foot"><div class="c-red"></div><div class="c-line"></div></div>' +
    '</section>';
  };
})();

(function () {
  window.slideRenderers = window.slideRenderers || {};

  /* Carátula: réplica del slide 1 de Ejemplo.pptx (texto y forma).
     Banda negra superior con logocaratula.png centrado, textos centrados en
     el mismo orden (Presentación Tesis Doctoral / título / DOCTORADO… /
     candidato / asesora) y acentos: franjas verticales a la izquierda,
     tira abstracta rojo/verde a la derecha y etiqueta vertical al pie. */
  window.slideRenderers.cover = function (thesis) {
    return '<section class="slide slide-cover" data-slide="1">' +
      '<div class="cover-band">' +
        '<img class="cover-logo" src="assets/logocaratula.png" alt="">' +
      '</div>' +
      '<div class="cover-body">' +
        '<div class="cover-kicker">' + thesis.kickerPresentacion + '</div>' +
        '<h1 class="cover-title">' + thesis.title + '</h1>' +
        '<div class="cover-prog">' + thesis.programaDoctorado + '</div>' +
        '<div class="cover-candidato"><span class="c-label">Candidato:</span> ' + thesis.candidato + '</div>' +
        '<div class="cover-asesora"><span class="c-label">Asesora:</span> ' + thesis.asesora + '</div>' +
      '</div>' +
      '<div class="cover-accents" aria-hidden="true">' +
        '<span class="cacc-red"></span>' +
        '<span class="cacc-green"></span>' +
        '<span class="cacc-black"></span>' +
        '<img class="cacc-abstract" src="assets/cover-abstract.png" alt="">' +
      '</div>' +
    '</section>';
  };
})();
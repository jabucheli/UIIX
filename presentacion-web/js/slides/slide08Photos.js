/* Galería de fotografías del slide 8 (RESULTADOS (3)).

   Petición del usuario (2026-10-06): la banda inferior en reposo no debe
   llevar ninguna información (ni cifras ni pista de uso), solo las ocho
   fotografías de la prueba piloto que están en `fotos/`; cada una se amplía
   con un clic y un clic fuera de ella la devuelve a su tamaño normal.

   Estado y comportamiento, que es de interacción y no de la lámina, así que
   va en su propio módulo (mismo criterio que slide08Zoom.js):

     · el módulo no añade ni quita focos a app.js: las miniaturas no llevan
       `data-focus`, de modo que el clic que las pulsa es indiferente para
       `onFrameClick` (sin `data-focus` que conmutar, app.js no hace nada);
     · el estado vive en la propia banda: `.rs3-idle.is-open` con
       `data-foto="N"`, y el CSS se encarga de mostrar el visor
       `.rs3-gal-view` con la fotografía N;
     · el clic se escucha en fase de burbuja sobre `#slideFrame`, como el de
       app.js: si el clic cae en una miniatura se amplía; si la foto ya está
       ampliada, cualquier otro clic de la banda (visor, fondo o miniatura)
       la cierra. Un clic fuera de la banda también la cierra y, si cae en un
       paso, app.js abrirá su resultado con normalidad;
     · ESC cierra la fotografía ampliada, y el evento `slide:focus` que app.js
       emite en cada `setScopeFocus` reinicia el estado, para que al volver a
       reposo (o al cambiar de lámina) la galería quede limpia. */
(function () {
  var abierto = null;   /* la banda `.rs3-idle` con una foto ampliada, o null */

  function banda() {
    return document.querySelector('.slide.active .rs3-idle');
  }

  function abrir(banda, i) {
    var big = banda.querySelector('.rs3-gal-big');
    var mini = banda.querySelector('.rs3-gal-i[data-foto="' + i + '"] .rs3-gal-t');
    if (big && mini) {
      big.src = mini.getAttribute('src');
      big.alt = mini.getAttribute('alt') || '';
    }
    /* aria-expanded en la miniatura pulsada: el visor es la imagen ampliada
       de esa misma foto, no una región aparte. */
    Array.prototype.forEach.call(banda.querySelectorAll('.rs3-gal-i'), function (b) {
      if (b.getAttribute('data-foto') === String(i)) b.setAttribute('aria-expanded', 'true');
      else b.removeAttribute('aria-expanded');
    });
    banda.setAttribute('data-foto', String(i));
    banda.classList.add('is-open');
    abierto = banda;
  }

  function cerrar() {
    if (!abierto) return;
    abierto.classList.remove('is-open');
    abierto.removeAttribute('data-foto');
    Array.prototype.forEach.call(abierto.querySelectorAll('.rs3-gal-i'), function (b) {
      b.removeAttribute('aria-expanded');
    });
    abierto = null;
  }

  function dentro(el, sel) {
    return (el && el.closest && el.closest(sel)) || null;
  }

  function onClick(e) {
    var caja = banda(); if (!caja) return;
    var mini = dentro(e.target, '.rs3-gal-i');
    if (mini) {
      /* con la foto ampliada las miniaturas quedan bajo el visor, así que un
         clic aquí solo puede ser el de una galería en reposo */
      if (caja.classList.contains('is-open')) cerrar();
      else abrir(caja, mini.getAttribute('data-foto'));
      return;
    }
    /* clic fuera de la fotografía (visor, fondo de la banda o cualquier otra
       cosa de la lámina): vuelve a su tamaño normal */
    if (caja.classList.contains('is-open')) cerrar();
  }

  function onKey(e) {
    if (e.key === 'Escape') cerrar();
  }

  function init() {
    var frame = document.getElementById('slideFrame');
    if (frame) frame.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    document.addEventListener('slide:focus', cerrar);
  }

  document.addEventListener('DOMContentLoaded', init);
})();

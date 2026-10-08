/* Navegación por las imágenes del ART en el slide 8 (RESULTADOS (3)).

   Petición del usuario (2026-10-07): el último resultado, el ART (paso p6),
   no se acerca como los demás: en su imagen a máximo tamaño (el nivel 2
   `p6i`) se navega por la secuencia de las tres figuras de la Fase 4 —
   art-fin.png, art1.png y art2.png — con un clic sobre la imagen, y un clic
   fuera de ella (o ESC) cierra la exploración por completo y deja la lámina
   en reposo, con la galería de fotografías.

   Cómo se integra con app.js, sin tocar su lógica:

     · app.js escucha el clic en fase de burbuja sobre `#slideFrame` y conmuta
       el foco cuando el destino tiene un `data-focus`. Aquí el clic se
       intercepta en fase de captura sobre el mismo contenedor, igual que hace
       `slide08Zoom.js`, y solo cuando el cuerpo está en `p6i`:
         - si cae dentro de la imagen contenida, se avanza a la siguiente
           figura de `CADENA` (art-fin -> art1 -> art2, y vuelta al inicio);
         - si cae fuera (borde de la ventana o zona vacía), se cierra la
           exploración entera: se quitan la clase, el `data-focus` y el ghost,
           lo mismo que haría app.js al cerrar, de modo que `currentFocus()`
           deja de ver foco y la lámina queda en reposo de forma coherente
           para la siguiente pulsación.
     · el estado se reinicia con el evento `slide:focus` que app.js emite en
       cada `setScopeFocus`: al abrir o cerrar cualquier nivel vuelve la
       primera figura y el contador de la pista.
     · el clic dentro de la imagen no acerca nada: `slide08Zoom.js` ignora el
       nivel `p6i` (su `esNivel2` solo acepta p1i..p5i), así que los dos
       módulos conviven sin pisarse. */
(function () {
  var CADENA = ['assets/art-fin.png', 'assets/art1.png', 'assets/art2.png'];
  var CLAVE = 'p6i';
  var FOCOS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p1i', 'p2i', 'p3i', 'p4i', 'p5i', 'p6i'];
  var idx = 0;

  function activo() {
    var b = document.querySelector('.slide.active .rs3-body');
    return !!(b && b.getAttribute('data-focus') === CLAVE);
  }

  function panel() { return document.querySelector('.slide.active .rs3-panel--p6'); }
  function zoom() { return panel() && panel().querySelector('.rs3-pn-zoom'); }

  function pintar() {
    var p = panel();
    var mi = p && p.querySelector('.rs3-pn-img');
    var nv = p && p.querySelector('.rs3-zoom-nv');
    var tx = p && p.querySelector('.rs3-zoom-tip > span:last-child');
    if (mi) mi.src = CADENA[idx];
    if (nv) nv.textContent = (idx + 1) + '/' + CADENA.length;
    if (tx) tx.textContent = 'clic: siguiente imagen \u00B7 clic fuera: volver';
    var z = zoom();
    if (z) {
      /* la navegación sustituye al acercamiento: si quedara algo del estado
         del zoom (de otra apertura) se limpia al volver a la secuencia */
      z.style.removeProperty('--rs3-z');
      z.style.removeProperty('--rs3-tx');
      z.style.removeProperty('--rs3-ty');
      z.classList.remove('is-zoom', 'is-drag');
    }
  }

  function avanzar() {
    idx = (idx + 1) % CADENA.length;
    pintar();
  }

  /* «La zona» es la imagen real, la contenida por `object-fit: contain`:
     los clics en la banda vacía que la rodea cuentan como fuera. Sin tamaño
     intrínseco (jsdom, o la imagen aún sin cargar) todo el marco es la imagen. */
  function enImagenContenida(e) {
    var z = zoom();
    if (!z) return false;
    if (!(e.target && e.target.closest && e.target.closest('.rs3-pn-zoom'))) return false;
    var p = panel();
    var mi = p && p.querySelector('.rs3-pn-img');
    var nw = mi ? mi.naturalWidth : 0;
    var nh = mi ? mi.naturalHeight : 0;
    if (!nw || !nh) return true;
    var b = z.getBoundingClientRect();
    var fit = Math.min(b.width / nw, b.height / nh);
    var cw = nw * fit;
    var ch = nh * fit;
    var iz = b.left + (b.width - cw) / 2;
    var ar = b.top + (b.height - ch) / 2;
    return e.clientX >= iz && e.clientX <= iz + cw &&
           e.clientY >= ar && e.clientY <= ar + ch;
  }

  /* Cierra a reposo replicando lo que haría app.js: sin tocar nada interno,
     se quitan la clase y el `data-focus` del cuerpo y se retira el ghost;
     `currentFocus()` lee el DOM, así que para app.js no hay foco que cerrar. */
  function cerrarTodo() {
    var slide = document.querySelector('.slide.active');
    var b = slide && slide.querySelector('.rs3-body');
    if (b) {
      b.removeAttribute('data-focus');
      FOCOS.forEach(function (k) { b.classList.remove('rs3-body--f' + k); });
    }
    var g = slide && slide.querySelector('.scope-ghost');
    if (g && g.parentNode) g.parentNode.removeChild(g);
    idx = 0;
    pintar();
  }

  function onClick(e) {
    if (!activo()) return;
    /* solo interviene aquí en el nivel 2 del ART; cualquier otro clic lo
       resuelve app.js con normalidad */
    if (!zoom()) return;
    e.stopPropagation();
    e.preventDefault();
    if (enImagenContenida(e)) avanzar();
    else cerrarTodo();
  }

  function onKey(e) {
    if (e.key !== 'Escape') return;
    if (!activo()) return;
    e.preventDefault();
    cerrarTodo();
  }

  function onFocus() {
    /* cada cambio de foco de app.js reinicia la secuencia del ART */
    idx = 0;
    pintar();
  }

  function init() {
    var frame = document.getElementById('slideFrame');
    if (frame) frame.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKey);
    document.addEventListener('slide:focus', onFocus);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
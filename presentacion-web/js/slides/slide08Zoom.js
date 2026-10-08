/* Zoom y desplazamiento de la imagen de un resultado del slide 8.

   Petición del usuario (2026-10-02): en la imagen ya ampliada (el nivel 2
   `pNi`, la "imagen a máximo tamaño") se quiere:

     · un clic sobre la imagen la acerca más, teniendo en cuenta **dónde**
       se ha clicado (el punto bajo el cursor se queda quieto);
     · con el mouse, arrastrar la imagen para desplazarla;
     · un clic **fuera** de la imagen vuelve a la pantalla principal, en
       cualquier nivel de acercamiento.

   Cómo se integra con app.js, sin tocar su lógica:

     · app.js escucha el clic en fase de burbuja sobre `#slideFrame` y, si el
       destino tiene un `data-focus`, conmuta el foco (por eso un clic sobre la
       imagen cerraba el panel). Aquí se intercepta el clic **en fase de
       captura** sobre el mismo contenedor y se llama a `stopPropagation()`
       solo cuando el clic cae dentro de la imagen en el nivel 2: así el
       acercamiento no llega a `toggleFocus`, y cualquier otro clic (el de
       fuera) sigue su camino y lo resuelve app.js, que devuelve el panel.
     · el estado se reinicia con el evento `slide:focus` que `app.js` emite en
       cada `setScopeFocus`, de modo que al abrir cualquier nivel 2 la imagen
       empieza sin acercar.

   La transformación va en el marco de la imagen (`.rs3-pn-zoom`) con tres
   variables CSS — `--rs3-z`, `--rs3-tx`, `--rs3-ty` — y `transform-origin` en
   el centro, que es la misma caja que usa el `object-fit: contain` del <img>.
   El límite del desplazamiento sale del tamaño real del contenido: con la
   imagen contenida en la caja, `contentW = naturalW * fit`, y el recorrido
   máximo en cada eje es `(contentW * escala - cajaW) / 2`. Así la imagen no
   sale volando pero tampoco deja huecos mientras está ampliada. */
(function () {
  var PASO = 1.6;        /* cada clic acerca x1,6 */
  var ESCALA_MAX = 8;    /* tope: a partir de aquí el texto ya se lee bien */

  var frame = null;
  var ctx = null;        /* { body, panel, marco, caja, img, escala, tx, ty } */
  var arrastre = null;   /* { x0, y0, tx0, ty0, movido } */

  function esNivel2(body) {
    var k = body && body.getAttribute('data-focus');
    /* p6i (el ART) queda fuera: ahí no se acerca, se navega por las tres
       figuras de la secuencia (js/slides/slide08Art.js). */
    return !!k && /^p[1-5]i$/.test(k);
  }

  /* Los elementos se leen del panel que está visible: el renderer deja los
     seis paneles en el DOM, así que sin esto se mediría el primero. El panel se
     localiza por `data-panel`, con la clave del paso sin la "i" del nivel 2
     (`p1i` -> `p1`); el `data-focus` del panel es el del paso, y la `i` la
     lleva el marco de la imagen. */
  function contexto() {
    var body = document.querySelector('.slide.active .rs3-body');
    if (!esNivel2(body)) return null;
    var clave = body.getAttribute('data-focus').replace(/i$/, '');
    var panel = document.querySelector('.slide.active .rs3-panel[data-panel="' + clave + '"]');
    if (!panel) return null;
    var marco = panel.querySelector('.rs3-pn-zoom');
    var caja = panel.querySelector('.rs3-pn-body');
    var img = panel.querySelector('.rs3-pn-img');
    if (!marco || !caja || !img) return null;
    return { body: body, panel: panel, marco: marco, caja: caja, img: img,
      escala: 1, tx: 0, ty: 0 };
  }

  function conEstado() {
    if (!ctx) ctx = contexto();
    return ctx;
  }

  function factorContenido() {
    var bw = ctx.caja.clientWidth;
    var bh = ctx.caja.clientHeight;
    var nw = ctx.img.naturalWidth;
    var nh = ctx.img.naturalHeight;
    if (!bw || !bh || !nw || !nh) return null;
    var fit = Math.min(bw / nw, bh / nh);
    return { bw: bw, bh: bh, cw: nw * fit, ch: nh * fit };
  }

  function limitar() {
    var m = factorContenido();
    /* sin medidas reales (jsdom, o una caja sin tamaño) no hay tope que
       aplicar: se deja el desplazamiento libre para poder probarlo. */
    if (!m) return;
    var maxX = Math.max(0, (m.cw * ctx.escala - m.bw) / 2);
    var maxY = Math.max(0, (m.ch * ctx.escala - m.bh) / 2);
    ctx.tx = Math.min(maxX, Math.max(-maxX, ctx.tx));
    ctx.ty = Math.min(maxY, Math.max(-maxY, ctx.ty));
  }

  function pintar() {
    ctx.marco.style.setProperty('--rs3-z', String(ctx.escala));
    ctx.marco.style.setProperty('--rs3-tx', ctx.tx + 'px');
    ctx.marco.style.setProperty('--rs3-ty', ctx.ty + 'px');
    ctx.marco.classList.toggle('is-zoom', ctx.escala > 1);
    var nv = ctx.panel.querySelector('.rs3-zoom-nv');
    if (nv) nv.textContent = '×' + ctx.escala.toFixed(1).replace('.', ',');
  }

  function reiniciar() {
    if (!ctx) return;
    ctx.escala = 1;
    ctx.tx = 0;
    ctx.ty = 0;
    pintar();
  }

  /* Acerca manteniendo fijo el punto del cursor:
     t' = t + (p - centro - t) * (1 - escala' / escala) */
  function acercar(px, py) {
    var antes = ctx.escala;
    var despues = Math.min(ESCALA_MAX, antes * PASO);
    if (despues === antes) return;
    var r = ctx.caja.getBoundingClientRect();
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height / 2;
    var k = 1 - despues / antes;
    ctx.tx += (px - cx - ctx.tx) * k;
    ctx.ty += (py - cy - ctx.ty) * k;
    ctx.escala = despues;
    limitar();
    pintar();
  }

  function enImagen(e) {
    return !!(e.target && e.target.closest && e.target.closest('.rs3-pn-zoom'));
  }
  function onClick(e) {
    /* Solo interviene en el nivel 2. El clic que ABRE la imagen (nivel 1) lo
       resuelve app.js con normalidad: no se intercepta, para que abrir no
       venga ya con un acercamiento de regalo. */
    ctx = conEstado();
    if (!ctx) return;
    /* El clic que sigue a un arrastre se traga y limpia el estado: asi un
       arrastre que ha acabado fuera de la imagen no cierra la lámina. */
    if (arrastre && arrastre.movido) {
      arrastre = null;
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if (!enImagen(e)) {
      /* clic fuera de la imagen: no se intercepta, lo resuelve app.js y
         vuelve al resultado, la pantalla principal. */
      return;
    }
    /* El clic cae dentro de la imagen: se queda aquí (fase de captura) porque
       app.js lo leería como "cerrar". */
    e.stopPropagation();
    e.preventDefault();
    acercar(e.clientX, e.clientY);
  }

  function onDblClick(e) {
    if (!contexto() || !enImagen(e)) return;
    e.preventDefault();
    e.stopPropagation();
  }

  function onDown(e) {
    if (e.button !== 0) return;
    arrastre = null;   /* una pulsacion nueva limpia el estado del anterior */
    ctx = conEstado();
    if (!ctx || ctx.escala <= 1) return;   /* sin acercar no hay nada que desplazar */
    if (!enImagen(e)) return;
    e.preventDefault();
    arrastre = { x0: e.clientX, y0: e.clientY, tx0: ctx.tx, ty0: ctx.ty, movido: false };
    ctx.marco.classList.add('is-drag');
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function onMove(e) {
    if (!arrastre || !ctx) return;
    var dx = e.clientX - arrastre.x0;
    var dy = e.clientY - arrastre.y0;
    if (!arrastre.movido && Math.abs(dx) + Math.abs(dy) < 3) return;
    arrastre.movido = true;
    ctx.tx = arrastre.tx0 + dx;
    ctx.ty = arrastre.ty0 + dy;
    limitar();
    pintar();
    e.preventDefault();
  }

  function onUp() {
    if (!arrastre) return;
    ctx && ctx.marco.classList.remove('is-drag');
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    /* El clic que el navegador emite al soltar se traga en `onClick`: hasta
       entonces el estado queda a la espera de consumirlo. */
    arrastre = { movido: arrastre.movido };
  }

  function init() {
    frame = document.getElementById('slideFrame');
    if (!frame) return;
    frame.addEventListener('click', onClick, true);
    frame.addEventListener('dblclick', onDblClick, true);
    frame.addEventListener('mousedown', onDown);
    /* app.js emite esto en cada setScopeFocus: el acercamiento y el
       desplazamiento se ponen a cero al abrir cualquier nivel 2 (y también se
       dejan a cero en la lámina que se acaba de cerrar, que es la que se ve). */
    document.addEventListener('slide:focus', function () {
      if (ctx) reiniciar();
      ctx = null;
      arrastre = null;
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();

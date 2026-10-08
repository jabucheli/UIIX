const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'presentacion-web');

const dom = new JSDOM(
  '<!doctype html><html><body>'
  + '<div id="app"><header class="app-header">'
  + '<span id="brandText"></span>'
  + '<nav class="tabs" id="tabs"></nav>'
  + '<span class="counter" id="counter"></span>'
  + '<button id="btnPrev"></button><button id="btnNext"></button><button id="btnFullscreen"></button>'
  + '</header><main class="stage" id="stage">'
  + '<div class="scale-wrap" id="scaleWrap"><div class="slide-frame" id="slideFrame"></div></div>'
  + '</main></div></body></html>',
  { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost:8080/index.html' }
);
const win = dom.window;
const doc = win.document;

/* la hoja real se inyecta para que getComputedStyle resuelva la visibilidad */
const styleEl = doc.createElement('style');
styleEl.textContent = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
doc.head.appendChild(styleEl);
const gcs = win.getComputedStyle.bind(win);

win.Icons = {
  svg: function (n, s) { return '<svg class="i-' + n + '" width="' + s + '" height="' + s + '" viewBox="0 0 24 24"></svg>'; },
  emblem: function (n) { return '<span class="emblem-' + n + '"></span>'; },
  donut: function () { return '<span class="donut"></span>'; }
};

function load(p) {
  win.eval(fs.readFileSync(path.join(ROOT, p), 'utf8'));
}

load('js/data/thesisData.js');
load('js/data/problematizationData.js');
load('js/data/objectivesData.js');
load('js/data/theoriesData.js');
load('js/data/methodologyData.js');
load('js/data/resultsData.js');
load('js/data/resultsData2.js');
load('js/data/resultsData3.js');
load('js/data/transformationData.js');
load('js/data/erTables.js');
load('js/components/justificationCard.js');
load('js/slides/slide01Cover.js');
load('js/slides/slide02Problematization.js');
load('js/slides/slide03Objectives.js');
load('js/slides/slide04Theories.js');
load('js/slides/slide05Methodology.js');
load('js/slides/slide06Results.js');
load('js/slides/slide07Results.js');
load('js/slides/slide08Results.js');
load('js/slides/slide08Zoom.js');
load('js/slides/slide08Photos.js');
load('js/slides/slide08Art.js');
load('js/slides/slide09EPT.js');
load('js/app.js');

/* app.js arranca con DOMContentLoaded; en jsdom ya paso, lo disparamos a mano */
doc.dispatchEvent(new win.Event('DOMContentLoaded', { bubbles: true }));

const checks = [];
function has(ok, label) { checks.push([label, !!ok]); }

function body() { return doc.querySelector('.slide.active .rs-body'); }
function panels() { return Array.prototype.slice.call(doc.querySelectorAll('.slide.active .rs-panel')); }
function focusOf() { return body() ? body().getAttribute('data-focus') : null; }
function classes() { return body() ? body().className : ''; }
function click(el) {
  el.dispatchEvent(new win.MouseEvent('click', { bubbles: true, cancelable: true }));
}
function key(k) {
  const e = new win.KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true });
  doc.dispatchEvent(e);
  return e.defaultPrevented;
}

/* Ir a un slide por su etiqueta de pestaña (robusto al añadir más slides) */
function tabGo(label) {
  Array.prototype.slice.call(doc.querySelectorAll('#tabs .tab')).forEach(function (b) {
    if (b.textContent.indexOf(label) === 0) {
      b.dispatchEvent(new win.MouseEvent('click', { bubbles: true, cancelable: true }));
    }
  });
}
function goRs6() { tabGo('6. Resultados'); }

/* --- ir al slide 6 --- */
goRs6();
has(!!body(), 'slide 6 (Resultados) activo');
has(panels().length === 3, '3 paneles en el slide 6');
has(focusOf() === null, 'sin foco al entrar');
has(/rs-hint/.test(doc.querySelector('.slide.active .rs-seq').innerHTML), 'pista de clic presente en la barra de secuencia');
has(panels().every(function (p) { return p.getAttribute('data-focus') && p.getAttribute('role') === 'button'; }),
  'los 3 paneles son accionables (data-focus + role)');

/* --- clic en el panel 1 --- */
click(panels()[0]);
has(focusOf() === '1', 'clic en panel 1 -> data-focus=1');
has(/rs-body--f1/.test(classes()), 'clic en panel 1 -> clase rs-body--f1');
has(!!doc.querySelector('.slide.active .scope-ghost.is-on'), 'ghost: sombra de la lámina original visible al ampliar (slide 6)');

/* --- clic en otro panel cambia el foco --- */
click(panels()[2]);
has(focusOf() === '3', 'clic en panel 3 -> data-focus=3');
has(/rs-body--f3/.test(classes()) && !/rs-body--f1/.test(classes()), 'clase anterior eliminada');

/* --- clic de nuevo en el mismo panel lo cierra --- */
click(panels()[2]);
has(focusOf() === null, 'segundo clic en el mismo panel -> sin foco');
has(!/rs-body--f\d/.test(classes()), 'clases de foco limpiadas');

/* --- ESC cierra el foco --- */
click(panels()[1]);
has(focusOf() === '2', 'clic en panel 2 -> data-focus=2');
const prevented = key('Escape');
has(focusOf() === null, 'ESC -> sin foco');
has(prevented, 'ESC previene el default cuando hay foco');

/* --- ESC sin foco no se consume --- */
has(key('Escape') === false, 'ESC sin foco no previene nada');

/* --- clic fuera de los paneles (en la barra de secuencia) --- */
click(panels()[0]);
has(focusOf() === '1', 'foco abierto antes de clic fuera');
click(doc.querySelector('.slide.active .rs-seq'));
has(focusOf() === null, 'clic fuera -> cierra el foco');

/* --- navegar limpia el foco --- */
click(panels()[0]);
has(focusOf() === '1', 'foco abierto antes de navegar');
key('ArrowRight');
has(doc.querySelector('.slide.active') === null || focusOf() === null, 'navegar a otro slide -> sin foco');
key('Home');
has(focusOf() === null, 'Home -> slide 1, sin foco');

/* --- teclado: Enter sobre el panel enfocado --- */
goRs6();
panels()[0].focus();
has(doc.activeElement === panels()[0], 'panel 1 recibe el foco del teclado (tabindex)');
has(key('Enter'), 'Enter sobre el panel -> default evitado');
has(focusOf() === '1', 'Enter sobre el panel 1 -> data-focus=1');
has(key('Enter'), 'segundo Enter -> default evitado');
has(focusOf() === null, 'segundo Enter -> sin foco');

/* --- CSS: los estados de foco existen --- */
const css = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
const appJs = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
has(/\.rs-body--f1 \.rs-panel--w30[\s\S]{0,220}flex: 1 1 100%/.test(css), 'CSS: el panel enfocado crece a 100%');
has(/\.rs-body--f1 \.rs-panel:not\(\.rs-panel--w30\)[\s\S]{0,400}flex: 0 0 0/.test(css), 'CSS: los otros paneles se repliegan');
has(/--rs-k: 1\.22/.test(css), 'CSS: escala tipografica al enfocar');
has((css.match(/var\(--rs-k/g) || []).length >= 30, 'CSS: tipografia del slide 6 usa var(--rs-k)');

/* --- el hint viene de los datos, no del HTML --- */
has(typeof win.RESULTADOS.ui.hint === 'string' && win.RESULTADOS.ui.hint.length > 20, 'pista definida en resultsData.js');

/* =================================================================
   Slide 6 · bloque 1: sub-bloques de procesos (info ampliada + imagen)
   ================================================================= */

function procCards() {
  return Array.prototype.slice.call(doc.querySelectorAll('.slide.active .rs-panel--w30 .rs-group'));
}

key('End');
goRs6();
const pcards = procCards();
has(pcards.length === 2, '2 sub-bloques de procesos (Infraestructura / Edificación)');
has(pcards.every(function (c) {
  return c.getAttribute('data-focus') && c.getAttribute('role') === 'button' && c.getAttribute('tabindex') === '0';
}), 'los 2 sub-bloques de procesos son accionables (data-focus + role + tabindex)');
has(pcards[0].getAttribute('data-focus') === '1a' && pcards[1].getAttribute('data-focus') === '1b',
  'data-focus 1a/1b en los sub-bloques de procesos');

click(pcards[0]);
has(focusOf() === '1a', 'clic en Infraestructura -> data-focus=1a');
has(/rs-body--f1a/.test(classes()), 'clic en Infraestructura -> clase rs-body--f1a');
const pv = doc.querySelector('.slide.active .rs-subview--1a');
const pvB = doc.querySelector('.slide.active .rs-subview--1b');
has(!!pv && pv.getAttribute('data-focus') === '1a', 'la vista ampliada del sub-bloque de procesos se genera');
has(!!doc.querySelector('.slide.active .rs-subview--1a .rs-subpic img'), 'la vista ampliada incluye la imagen');
has(/assets\/procesos1\.png/.test(doc.querySelector('.slide.active .rs-subview--1a .rs-subpic img').getAttribute('src')),
  'Infraestructura usa assets/procesos1.png');

click(pv);
has(focusOf() === null, 'segundo clic sobre la vista ampliada -> pantalla principal');

click(pcards[1]);
has(focusOf() === '1b', 'clic en Edificación -> data-focus=1b');
const imgP2 = doc.querySelector('.slide.active .rs-subview--1b .rs-subpic img');
has(!!imgP2 && /assets\/procesos2\.png/.test(imgP2.getAttribute('src')), 'Edificación usa assets/procesos2.png');
key('Escape');
has(focusOf() === null, 'ESC -> pantalla principal');

/* --- teclado: Enter sobre el sub-bloque --- */
pcards[0].focus();
has(doc.activeElement === pcards[0], 'el sub-bloque de procesos recibe el foco del teclado');
has(key('Enter'), 'Enter sobre Infraestructura -> default evitado');
has(focusOf() === '1a', 'Enter sobre Infraestructura -> vista ampliada');
key('Escape');
has(focusOf() === null, 'ESC -> pantalla principal');

/* --- CSS: estados de sub-bloque en el bloque 1 --- */
has(/\.rs-body--f1a \.rs-panel--w30[\s\S]{0,80}flex: 1 1 100%/.test(css), 'CSS: bloque 1 llena la lámina en sub-foco');
has(/\.rs-body--f1a \.rs-subview--1a[\s\S]{0,80}display: flex/.test(css), 'CSS: solo la vista ampliada del sub-bloque se muestra');
has(/\.rs-body--f1a \.rs-pbody > \.rs-total[\s\S]{0,320}display: none/.test(css), 'CSS: el contenido normal se oculta en sub-foco');

/* =================================================================
   Slide 6 · bloque 2: sub-bloques de riesgos (info ampliada + imagen)
   ================================================================= */

function riskCards() {
  return Array.prototype.slice.call(doc.querySelectorAll('.slide.active .rs-panel--w33 .rs-risk'));
}

key('End');
goRs6();
const cards = riskCards();
has(cards.length === 2, '2 sub-bloques de riesgos (Infraestructura / Edificación)');
has(cards.every(function (c) { return c.getAttribute('data-focus') && c.getAttribute('role') === 'button' && c.getAttribute('tabindex') === '0'; }),
  'los 2 sub-bloques son accionables (data-focus + role + tabindex)');
has(cards[0].getAttribute('data-focus') === '2a' && cards[1].getAttribute('data-focus') === '2b',
  'data-focus 2a/2b en los sub-bloques');

click(cards[0]);
has(focusOf() === '2a', 'clic en Infraestructura -> data-focus=2a');
has(/rs-body--f2a/.test(classes()), 'clic en Infraestructura -> clase rs-body--f2a');
const subv = doc.querySelector('.slide.active .rs-subview--2a');
const subvB = doc.querySelector('.slide.active .rs-subview--2b');
has(!!subv && subv.getAttribute('data-focus') === '2a', 'la vista ampliada del sub-bloque se genera');
has(subv.offsetParent !== null || subv.getAttribute('data-focus') === '2a',
  'vista ampliada 2a presente en la lámina');
has(!/rs-body--f1|rs-body--f2(?!a)/.test(classes()) || focusOf() === '2a', 'los paneles 1 y 3 quedan replegados');
has(!!doc.querySelector('.slide.active .rs-subview--2a .rs-subpic img'), 'la vista ampliada incluye la imagen');
has(/assets\/riesgos2\.png/.test(doc.querySelector('.slide.active .rs-subview--2a .rs-subpic img').getAttribute('src')),
  'la imagen derecha apunta a assets/riesgos2.png');

click(subv);
has(focusOf() === null, 'segundo clic sobre la vista ampliada -> pantalla principal');

click(cards[1]);
has(focusOf() === '2b', 'clic en Edificación -> data-focus=2b');
const img2 = doc.querySelector('.slide.active .rs-subview--2b .rs-subpic img');
has(!!img2 && /assets\/riesgos1\.png/.test(img2.getAttribute('src')), 'Edificación usa assets/riesgos1.png');
key('Escape');
has(focusOf() === null, 'ESC -> pantalla principal');

/* --- teclado: Enter sobre el sub-bloque --- */
cards[0].focus();
has(doc.activeElement === cards[0], 'el sub-bloque recibe el foco del teclado');
has(key('Enter'), 'Enter sobre el sub-bloque -> default evitado');
has(focusOf() === '2a', 'Enter sobre Infraestructura -> vista ampliada');
key('Escape');
has(focusOf() === null, 'ESC -> pantalla principal');

/* --- navegar limpia el sub-foco --- */
click(cards[1]);
has(focusOf() === '2b', 'foco abierto antes de navegar');
key('Home');
has(doc.querySelector('.slide.active') === null || focusOf() === null, 'navegar limpia el sub-foco');

/* --- CSS: estados de sub-bloque y layout de la vista ampliada --- */
has(/\.rs-body--f2a \.rs-panel--w33[\s\S]{0,60}flex: 1 1 100%/.test(css), 'CSS: bloque 2 llena la lámina en sub-foco');
has(/\.rs-body--f2a \.rs-subview--2a[\s\S]{0,60}display: flex/.test(css), 'CSS: solo la vista ampliada del sub-bloque se muestra');
has(/\.rs-body--f2a \.rs-pbody > \.rs-risk[\s\S]{0,280}display: none/.test(css), 'CSS: las tarjetas normales se ocultan en sub-foco');
has(/\.rs-subview[\s\S]{0,120}display: none/.test(css), 'CSS: la vista ampliada está oculta en el estado normal');

/* =================================================================
   Slide 6 · bloque 3: sub-bloques de instrumentos (fase 1 / fase 2)
   ================================================================= */

function faseEls() {
  return Array.prototype.slice.call(doc.querySelectorAll('.slide.active .rs-fase[data-focus]'));
}

key('End');
goRs6();
const f3s = faseEls();
has(f3s.length === 2, '2 sub-bloques de instrumentos (Fase 1 / Fase 2)');
has(f3s.every(function (c) { return c.getAttribute('data-focus') && c.getAttribute('role') === 'button' && c.getAttribute('tabindex') === '0'; }),
  'las 2 fases son accionables (data-focus + role + tabindex)');
has(f3s[0].getAttribute('data-focus') === '3a' && f3s[1].getAttribute('data-focus') === '3b',
  'data-focus 3a/3b en las fases de instrumentos');
has(f3s[0].classList.contains('rs-fase--green') && f3s[1].classList.contains('rs-fase--red'),
  'fase 1 verde y fase 2 roja');

/* --- Fase 1: al ampliar se quita la Tabla 17 y se muestra ref-norm.png --- */
click(f3s[0]);
has(focusOf() === '3a', 'clic en Fase 1 -> data-focus=3a');
has(/rs-body--f3a/.test(classes()), 'clic en Fase 1 -> clase rs-body--f3a');
has(!!doc.querySelector('.slide.active .scope-ghost.is-on'), 'ghost: sombra visible al ampliar la Fase 1');
has(!!doc.querySelector('.slide.active .rs-fase--green .rs-fpic img'), 'la fase 1 ampliada incluye la imagen');
has(/assets\/ref-norm\.png/.test(doc.querySelector('.slide.active .rs-fase--green .rs-fpic img').getAttribute('src')),
  'la fase 1 usa assets/ref-norm.png');
has(/\.rs-body--f3a \.rs-fase--green \.rs-tbl[\s\S]{0,600}display: none/.test(css),
  'CSS: la Tabla 17 y su contenido se ocultan al ampliar la Fase 1');
has(/\.rs-body--f3a \.rs-fase--green \.rs-fpic[\s\S]{0,60}display: flex/.test(css),
  'CSS: la imagen de la Fase 1 se muestra al ampliar');
has(/\.rs-body--f3a \.rs-panel--w37[\s\S]{0,120}box-shadow: 0 0 0 2px var\(--green\)/.test(css),
  'CSS: la Fase 1 ampliada queda resaltada en verde');

click(f3s[0]);
has(focusOf() === null, 'segundo clic sobre la Fase 1 -> pantalla principal');
has(!!doc.querySelector('.slide.active .rs-fase--green .rs-fpic img') && focusOf() === null,
  'al achicar vuelve el contenido original (la imagen se oculta)');

/* --- Fase 2: se amplía de forma independiente; se quita la Tabla 18 y se muestra c-cheq.png --- */
click(f3s[1]);
has(focusOf() === '3b', 'clic en Fase 2 -> data-focus=3b');
has(/rs-body--f3b/.test(classes()), 'clic en Fase 2 -> clase rs-body--f3b');
has(!!doc.querySelector('.slide.active .scope-ghost.is-on'), 'ghost: sombra visible al ampliar la Fase 2');
has(!!doc.querySelector('.slide.active .rs-fase--red .rs-fpic img'), 'la fase 2 ampliada incluye la imagen');
has(/assets\/c-cheq\.png/.test(doc.querySelector('.slide.active .rs-fase--red .rs-fpic img').getAttribute('src')),
  'la fase 2 usa assets/c-cheq.png');
has(/\.rs-body--f3b \.rs-fase--red \.rs-tbl[\s\S]{0,600}display: none/.test(css),
  'CSS: la Tabla 18 y su contenido se ocultan al ampliar la Fase 2');
has(/\.rs-body--f3b \.rs-fase--red \.rs-fpic[\s\S]{0,60}display: flex/.test(css),
  'CSS: la imagen de la Fase 2 se muestra al ampliar');
has(/\.rs-body--f3b \.rs-panel--w37[\s\S]{0,120}box-shadow: 0 0 0 2px var\(--red\)/.test(css),
  'CSS: la Fase 2 ampliada queda resaltada en rojo');

click(f3s[1]);
has(focusOf() === null, 'segundo clic sobre la Fase 2 -> pantalla principal');
has(!!doc.querySelector('.slide.active .rs-fase--red .rs-fpic img') && focusOf() === null,
  'al achicar vuelve el contenido original (la imagen se oculta)');
key('Escape');
has(focusOf() === null, 'ESC -> pantalla principal');

/* --- teclado: Enter sobre la fase --- */
f3s[0].focus();
has(doc.activeElement === f3s[0], 'la Fase 1 recibe el foco del teclado');
has(key('Enter'), 'Enter sobre la Fase 1 -> default evitado');
has(focusOf() === '3a', 'Enter sobre la Fase 1 -> vista ampliada');
key('Escape');
has(focusOf() === null, 'ESC -> pantalla principal');

/* --- Nivel 2: la imagen de la Fase 1 se agranda al máximo de la pantalla --- */
has(/<figure class="rs-fpic"[^>]*data-focus="3aimg"/.test(doc.querySelector('.slide.active .rs-fase--green').innerHTML),
  'la imagen de la Fase 1 es clickable (data-focus=3aimg)');
has(/\.rs-body--f3aimg[\s\S]{0,40}\.rs-fpic[\s\S]{0,180}display: flex/.test(css),
  'CSS: nivel 2 muestra la imagen a máximo tamaño');
has(/\.rs-body--f3aimg \.rs-cols[\s\S]{0,40}visibility: hidden/.test(css),
  'CSS: nivel 2 oculta el resto del bloque');

click(f3s[0]);
has(focusOf() === '3a', 'preparar nivel 1 (3a) para el clic en la imagen');
var imgFig = doc.querySelectorAll('.slide.active .rs-fase--green .rs-fpic')[0];
click(imgFig);
has(focusOf() === '3aimg', 'clic sobre la imagen -> nivel 2 (3aimg)');
has(/rs-body--f3aimg/.test(classes()), 'clic sobre la imagen -> clase rs-body--f3aimg');
has(!!doc.querySelector('.slide.active .scope-ghost.is-on'), 'ghost: sombra visible en el nivel 2');

click(imgFig);
has(focusOf() === '3a', 'clic sobre la imagen a pantalla completa -> vuelve al nivel 1 (3a)');
has(/rs-body--f3a/.test(classes()), 'clic sobre la imagen -> clase rs-body--f3a');

click(imgFig);
has(focusOf() === '3aimg', 'segundo clic de ampliación -> nivel 2 otra vez');
key('Escape');
has(focusOf() === '3a', 'ESC en el nivel 2 -> vuelve al nivel 1 (3a)');

/* Petición: desde 3a, clic DENTRO de la imagen -> máximo tamaño; clic FUERA -> pantalla inicial como ESC */
click(imgFig);
has(focusOf() === '3aimg', 'desde 3a, clic DENTRO de la imagen -> máximo tamaño (nivel 2)');
key('Escape');
has(focusOf() === '3a', 'ESC en el nivel 2 -> vuelve al nivel 1 (3a)');
var fhead = doc.querySelector('.slide.active .rs-fase--green .rs-fhead');
click(fhead);
has(focusOf() === null, 'desde 3a, clic FUERA de la imagen (sobre el encabezado de la fase) -> pantalla original (como ESC)');
has(!!doc.querySelector('.slide.active .rs-fase--green .rs-fpic img') && focusOf() === null,
  'al volver a la inicial, la imagen vuelve a estar oculta');

/* --- Nivel 2 Fase 2: c-cheq.png a máximo tamaño (mismo fondo y forma de volver que la Fase 1) --- */
has(/<figure class="rs-fpic"[^>]*data-focus="3bimg"/.test(f3s[1].innerHTML),
  'la imagen de la Fase 2 es clickable (data-focus=3bimg)');
has(/\.rs-body--f3bimg[\s\S]{0,40}\.rs-fpic[\s\S]{0,220}display: flex/.test(css),
  'CSS: nivel 2 de la Fase 2 muestra la imagen a máximo tamaño');
has(/\.rs-body--f3bimg \.rs-cols[\s\S]{0,40}visibility: hidden/.test(css),
  'CSS: nivel 2 de la Fase 2 oculta el resto del bloque');
has(/\.rs-body--f3bimg \.rs-fase--red \.rs-fpic[\s\S]{0,400}(rgba\(0, 110, 73|#ffffff)/.test(css),
  'CSS: fondo del nivel 2 de la Fase 2 replicado (blanco con tonos tenues verde/rojo)');
has(/\.rs-body--f3bimg \.rs-panel--w37[\s\S]{0,120}box-shadow: 0 0 0 2px var\(--red\)/.test(css),
  'CSS: el nivel 2 de la Fase 2 mantiene el anillo rojo');

click(f3s[1]);
has(focusOf() === '3b', 'preparar nivel 1 (3b) para el clic en la imagen');
var imgFig2 = doc.querySelectorAll('.slide.active .rs-fase--red .rs-fpic')[0];
click(imgFig2);
has(focusOf() === '3bimg', 'clic sobre la imagen de la Fase 2 -> nivel 2 (máximo tamaño)');
click(imgFig2);
has(focusOf() === '3b', 'clic sobre la imagen a pantalla completa -> vuelve al nivel 1 (3b)');
click(imgFig2);
has(focusOf() === '3bimg', 'segundo clic de ampliación -> nivel 2 otra vez');
key('Escape');
has(focusOf() === '3b', 'ESC en el nivel 2 -> vuelve al nivel 1 (3b)');
click(imgFig2);
has(focusOf() === '3bimg', 'desde 3b, clic DENTRO de la imagen -> máximo tamaño');
key('Escape');
has(focusOf() === '3b', 'ESC en el nivel 2 -> vuelve al nivel 1 (3b)');
var fhead2 = doc.querySelector('.slide.active .rs-fase--red .rs-fhead');
click(fhead2);
has(focusOf() === null, 'desde 3b, clic FUERA de la imagen (encabezado de la fase) -> pantalla original (como ESC)');
has(!!doc.querySelector('.slide.active .rs-fase--red .rs-fpic img') && focusOf() === null,
  'al volver a la inicial, la imagen de la Fase 2 vuelve a estar oculta');

/* =================================================================
   Slide 7 · Resultados (2): pagina seccionada en dos bandas
   (flujograma de la fase 3 al 18.75% del alto + dos recuadros para
   fotografias), con el contenido de las fotos pendiente
   ================================================================= */

function rs2BodyEl() { return doc.querySelector('.slide.active .rs2-body'); }
function rs2Focus() { return rs2BodyEl() ? rs2BodyEl().getAttribute('data-focus') : null; }
function rs2EtapasCount() { return doc.querySelectorAll('.slide.active .rs2-fn[data-focus]').length; }
function rs2Cuadros() {
  return Array.prototype.slice.call(doc.querySelectorAll('.slide.active .rs2-screens .rs2-tbl'));
}
function rs2Nodes() {
  return Array.prototype.slice.call(doc.querySelectorAll('.slide.active .rs2-chain .rs2-fn'));
}
function rs2Fotos() {
  return Array.prototype.slice.call(doc.querySelectorAll('.slide.active .rs2-fotos .rs2-foto'));
}

tabGo('7. Resultados (2)');
has(/7\. Resultados \(2\)/.test(doc.querySelector('#tabs .tab.active').textContent), 'slide 7 (Resultados 2) activo via pestaña');

/* --- encabezado que referencia el desarrollo de la fase 3 --- */
has(/Resultados \(2\)/.test(doc.querySelector('.slide.active .slide-head h2').textContent), 'el titulo de la lamina se mantiene');
has(/Fase 3/.test(doc.querySelector('.slide.active .rs-subtitle').textContent) &&
  /NTP 330/.test(doc.querySelector('.slide.active .rs-subtitle').textContent),
  'el encabezado referencia el desarrollo de la fase 3 (NTP 330)');
has(!!doc.querySelector('.slide.active .head-rule'), 'se conserva la linea divisoria del encabezado');

/* --- seccion: banda del flujograma (18.75%) y banda de las fotos --- */
const r7flow = doc.querySelector('.slide.active .rs2-flow');
const r7fotos = doc.querySelector('.slide.active .rs2-fotos');
has(!!r7flow && !!r7fotos, 'la pagina esta seccionada en dos bandas');
has(r7flow && r7fotos && r7flow.nextElementSibling === r7fotos,
  'el flujograma va arriba y los recuadros de fotos abajo');
has(/flex: 0 0 18\.75%/.test(css) && r7flow && /rs2-flow \{[^}]*flex: 0 0 18\.75%/.test(css),
  'la banda del flujograma ocupa el 18.75% del alto disponible (75% de la altura anterior)');

/* --- flujograma de ntp330.md --- */
const r7n = rs2Nodes();
has(r7n.length === 7, 'el flujograma tiene los 7 nodos de ntp330.md');
has(r7n.map(function (n) { return n.querySelector('.rs-fn-c').textContent; }).join(' ') ===
  'Riesgo ND NE NP NC NR NI', 'secuencia: Riesgo · ND · NE · NP · NC · NR · NI');
has(doc.querySelectorAll('.slide.active .rs2-chain > .rs2-fx').length === 6, '6 conectores entre los 7 nodos');
has(r7n[1].querySelector('.rs-fn-s').textContent.indexOf('Cuestionario') === 0, 'ND: cuestionario de chequeo');
has(r7n[2].querySelector('.rs-fn-s').textContent.indexOf('Observación') === 0, 'NE: observación de campo');
has(r7n[3].querySelector('.rs-fn-s--fx').textContent === 'NP = ND × NE', 'NP: fórmula NP = ND × NE');
has(r7n[4].classList.contains('rs2-fn--green'), 'NC: bloque en verde (par de la alternancia)');
has(r7n[5].querySelector('.rs-fn-s--fx').textContent === 'NR = NP × NC', 'NR: fórmula NR = NP × NC');
has(r7n[6].querySelector('.rs-fn-s').textContent === 'Prioridad de actuación', 'NI: prioridad de actuación');
has(r7n.map(function (n) { return n.classList.contains('rs2-fn--red') ? 'R' : 'G'; }).join('') === 'GRGRGRG',
  'colores alternos verde/rojo en los 7 bloques: R · G · R · G · R · G · R');
has(r7n[0].classList.contains('rs2-fn--green') && r7n[1].classList.contains('rs2-fn--red') &&
  r7n[6].classList.contains('rs2-fn--green') && !r7n.some(function (n) { return n.classList.contains('rs2-fn--ink'); }),
  'solo verde y rojo en los bloques del flujograma (nada de tinta)');
has(!!doc.querySelector('.slide.active .rs2-fx--merge'), 'conector de convergencia NC -> NR');
has(r7n[4].querySelector('.rs-fn-s').textContent === 'Magnitud del daño esperado',
  'NC: magnitud del daño esperado');
/* --- el NC va como los demás: verde, con borde solido y sin etiqueta --- */
has(r7n[4].className === 'rs2-fn rs2-fn--green' && r7n[4].querySelectorAll('.rs-fn-s').length === 1,
  'NC: tarjeta verde con una sola línea de contenido');
has(r7n.every(function (n) { return !n.querySelector('.rs-fn-r'); }),
  'ningún bloque lleva la etiqueta de rama paralela');
has(!/\.rs2-fn[^{]*\{[^}]*border-style: dashed/.test(css),
  'CSS: ningún bloque del flujograma va con el borde entrecortado');
has(r7n.every(function (n) { return !n.querySelector('.rs-fn-escala'); }),
  'sin escalas dentro de los bloques: el NC conserva su texto original');
/* --- tipografía del bloque: la 1ª línea (código) va resaltada --- */
has(r7n.every(function (n) { return n.firstElementChild.classList.contains('rs-fn-c'); }),
  'la primera línea de cada bloque es el código resaltado (.rs-fn-c)');
has(r7n.every(function (n) { return n.querySelectorAll('.rs-fn-c').length === 1; }),
  'un solo código por bloque');
has(/\.rs-fn-c \{[^}]*font-weight: 700/.test(css) && /\.rs-fn-c \{[^}]*color: var\(--fn-c\)/.test(css),
  'CSS: el código del bloque en negrita y con el color del propio bloque');
has(/\.rs-fn-c \{[^}]*font-size: 18\.98px/.test(css), 'CSS: el código del bloque a 18.98px (+10% y +15%)');
has(/\.rs-fn-t \{[^}]*font-size: 12\.65px/.test(css) && /\.rs-fn-s \{[^}]*font-size: 10\.75px/.test(css),
  'CSS: título a 12.65px y línea de contenido a 10.75px (+10% y +15%)');
has(/\.rs-fn-s--fx \{[^}]*font-weight: 600/.test(css),
  'CSS: las fórmulas (NP/NR) con su propio realce');
has(!doc.querySelector('.slide.active .rs2-note') &&
  !/converge con el NP/.test(doc.querySelector('.slide.active').textContent),
  'sin nota al pie del flujograma (se retiró la línea del NC)');

/* --- banda inferior: recuadro 1 con la foto zanja, recuadro 2 vacio --- */
const r7f = rs2Fotos();
has(r7f.length === 2, 'dos recuadros reservados para fotografias');
has(r7f[0].getAttribute('data-foto') === 'f1' && r7f[1].getAttribute('data-foto') === 'f2',
  'recuadro izquierdo f1 y recuadro derecho f2');
has(r7f[0].querySelector('.rs-ft-t').textContent === 'Fotografía 1' &&
  r7f[1].querySelector('.rs-ft-t').textContent === 'Fotografía 2', 'recuadros rotulados');
const imgF1 = r7f[0].querySelector('img.rs-ft-img');
has(!!imgF1 && /zanja\.jpe?g$/.test(imgF1.getAttribute('src') || '') &&
  r7f[0].querySelectorAll('img, svg').length === 1,
  'el recuadro 1 muestra la imagen zanja');
has(r7f[1].querySelectorAll('img, svg').length === 0,
  'el recuadro 2 sigue vacio (sin imagen todavia)');
has(r7f[0].parentNode === r7f[1].parentNode && r7f[0] !== r7f[1],
  'los dos recuadros comparten la banda inferior');
has(rs2EtapasCount() === 6, 'seis objetivos accionables (NE, NP, NC, NR, NI y Riesgo)');
has(['ne', 'np', 'nc', 'nr', 'ni', 'f1'].every(function (k) {
  const n = doc.querySelector('.slide.active .rs2-body [data-focus="' + k + '"]');
  return n && n.classList.contains('rs2-fn');
}), 'los seis bloques pulsables son NE, NP, NC, NR, NI y Riesgo');
has(rs2Fotos().every(function (f) { return !f.getAttribute('data-focus'); }),
  'los huecos de foto no son accionables (la app se abre desde Riesgo)');
has(rs2Focus() === null, 'sin foco al entrar en el slide 7');

/* --- los cinco cuadros de ER.docx, ocultos en reposo --- */
has(rs2Cuadros().length === 5, 'cinco cuadros de tabla (uno por bloque pulsable)');
has(rs2Cuadros().map(function (c) { return c.getAttribute('data-tbl'); }).join(',') === 'ne,np,nc,nr,ni',
  'los cuadros son ne, np, nc, nr y ni en el orden del flujograma');
has(rs2Cuadros().every(function (c) { return gcs(c).display === 'none'; }),
  'en reposo ningun cuadro se ve');
has(rs2Cuadros().every(function (c) {
  /* la matriz del NR lleva dos filas de cabecera (banner + niveles) */
  const cab = c.querySelectorAll('thead tr').length;
  return c.querySelectorAll('table').length === 1 && c.querySelectorAll('tr').length === 4 + cab;
}), 'cada cuadro trae una tabla de 4 filas de datos (la matriz, dos de cabecera)');
has(rs2Cuadros().filter(function (c) { return c.getAttribute('data-tbl') === 'nr'; })[0]
  .querySelectorAll('thead tr').length === 2, 'solo la matriz del NR tiene dos filas de cabecera');
has(typeof win.ER_TABLES === 'object' && win.ER_TABLES.ne && win.ER_TABLES.nr &&
  Object.keys(win.ER_TABLES).join(',') === 'ne,np,nc,nr,ni',
  'ER_TABLES cargado con las cinco tablas extraidas de ER.docx');
has(rs2Cuadros().every(function (c) { return /ER\.docx/.test(c.textContent); }),
  'cada cuadro cita su origen ER.docx');

/* --- teclado: Enter abre NE y el segundo clic cierra --- */
const neNodo = doc.querySelector('.slide.active .rs2-body [data-focus="ne"]');
neNodo.focus();
has(doc.activeElement === neNodo, 'el bloque NE recibe el foco del teclado');
has(key('Enter'), 'Enter sobre NE -> default evitado');
has(rs2Focus() === 'ne', 'Enter sobre NE -> data-focus=ne');
has(/rs2-body--fne/.test(rs2BodyEl().className), 'Enter sobre NE -> clase rs2-body--fne');
has(!!doc.querySelector('.slide.active .scope-ghost.is-on'), 'ghost: la sombra del slide aparece al abrir un cuadro');

/* --- solo se ve el cuadro del bloque pulsado --- */
key('Escape');
has(rs2Focus() === null, 'bucle: se parte de nuevo en reposo');
['ne', 'np', 'nc', 'nr', 'ni'].forEach(function (k) {
  click(doc.querySelector('.slide.active .rs2-body [data-focus="' + k + '"]'));
  const vis = rs2Cuadros().filter(function (c) { return gcs(c).display !== 'none'; });
  has(rs2Focus() === k && vis.length === 1 && vis[0].getAttribute('data-tbl') === k,
    'clic en ' + k.toUpperCase() + ' -> solo se abre su cuadro');
});

/* --- severidad en verde y rojo --- */
has(['ne', 'np', 'nc', 'ni'].every(function (k) {
  const t = doc.querySelector('.slide.active .rs2-tbl[data-tbl="' + k + '"]');
  const c = Array.prototype.slice.call(t.querySelectorAll('tbody tr')).map(function (tr) {
    return tr.className.indexOf('--red') > -1 ? 'r' : 'g';
  }).join('');
  return c === 'rrgg';
}), 'NE/NP/NC/NI: dos filas rojas y dos verdes (severidad)');
has(['nr'].every(function (k) {
  const t = doc.querySelector('.slide.active .rs2-tbl[data-tbl="' + k + '"]');
  const b = Array.prototype.slice.call(t.querySelectorAll('b.rs2-tb-lv--red, b.rs2-tb-lv--green'));
  return b.length === 19 && b.every(function (x) {
    return /^(I|II)$/.test(x.textContent) === x.classList.contains('rs2-tb-lv--red');
  });
}), 'matriz NR: las 19 celdas de nivel, con I/II en rojo y III/IV en verde');

/* --- segundo clic en el bloque cierra --- */
click(doc.querySelector('.slide.active .rs2-body [data-focus="ni"]'));
has(rs2Focus() === null, 'segundo clic en el mismo bloque -> sin foco');
has(rs2Cuadros().every(function (c) { return gcs(c).display === 'none'; }),
  'al cerrar, los cinco cuadros vuelven a ocultarse');
has(!doc.querySelector('.slide.active .scope-ghost'), 'ghost: la sombra se quita al cerrar');

/* --- ESC y clic fuera cierran --- */
click(doc.querySelector('.slide.active .rs2-body [data-focus="nc"]'));
has(rs2Focus() === 'nc', 'foco NC abierto antes de ESC');
key('Escape');
has(rs2Focus() === null, 'ESC -> sin foco en el slide 7');
click(doc.querySelector('.slide.active .rs2-body [data-focus="nr"]'));
has(rs2Focus() === 'nr', 'foco NR abierto antes del clic fuera');
click(doc.querySelector('.slide.active .rs2-flow'));
has(rs2Focus() === null, 'clic fuera (banda del flujograma) -> cierra el foco');

/* --- la matriz NR nombra los dos ejes (no solo los numeros) --- */
const nrDatos = win.ER_TABLES.nr;
has(nrDatos.encabezado.columnas.every(function (c) {
  return typeof c === 'object' && c.rango && c.etiqueta && c.cod;
}), 'NR: las cuatro columnas de NP traen rango, nombre y código');
has(nrDatos.encabezado.columnas.map(function (c) { return c.etiqueta + '(' + c.cod + ') ' + c.rango; }).join(',') ===
  'Muy alta(MA) 40-24,Alta(A) 20-10,Media(M) 8-6,Baja(B) 4-2',
  'NR: las columnas se llaman Muy alta/MA, Alta/A, Media/M y Baja/B con su tramo');
has(nrDatos.filas.every(function (f) { return f.etiqueta && f.cod; }),
  'NR: las cuatro filas de NC traen nombre y código');
has(nrDatos.filas.map(function (f) { return f.nc + ' ' + f.etiqueta + '(' + f.cod + ')'; }).join(',') ===
  '100 Mortal o Catastrófico(M),60 Muy Grave(MG),25 Grave(G),10 Leve(L)',
  'NR: las filas se llaman Mortal o Catastrófico/M, Muy Grave/MG, Grave/G y Leve/L');
has(nrDatos.filas.every(function (f) { return f.celdas.length === 4; }) && nrDatos.filas.length === 4,
  'NR: sigue siendo la matriz completa de 4 x 4');
has(win.ER_TABLES.np.filas.map(function (f) { return f.cod + ':' + f.etiqueta; }).join('|') === 'MA:Muy alta|A:Alta|M:Media|B:Baja' &&
  win.ER_TABLES.nc.filas.map(function (f) { return f.celdas[0] + ':' + f.etiqueta; }).join('|') === '100:Mortal o Catastrófico|60:Muy Grave|25:Grave|10:Leve',
  'los nombres de los ejes salen de las tablas NP y NC del mismo ER.docx');

/* --- CSS de la pantalla ampliada --- */
has(/\.rs2-screens \{[\s\S]{0,200}flex: 0 0 0[\s\S]{0,200}opacity: 0[\s\S]{0,200}transform: scale\(\.94\)/.test(css),
  'CSS: la pantalla arranca colapsada y encogida (scale .94)');
has(/\.rs2-body--fne \.rs2-screens,[\s\S]{0,240}flex: 1 1 auto[\s\S]{0,120}opacity: 1[\s\S]{0,120}transform: scale\(1\)/.test(css),
  'CSS: al abrir, la pantalla crece a todo el ancho y a escala 1');
has(/\.rs2-screens \{[\s\S]{0,320}transition: flex-grow \.3s ease, flex-basis \.3s ease, opacity \.22s ease, transform \.3s ease/.test(css),
  'CSS: transición de agrandamiento al abrir y de achicamiento al cerrar');
has(/\.rs2-body--fnr \.rs2-fotos[\s\S]{0,200}flex: 0 0 0[\s\S]{0,200}visibility: hidden/.test(css),
  'CSS: con un cuadro abierto los huecos de foto ceden el sitio y se ocultan');
has(/\.rs2-screens \{[\s\S]{0,120}z-index: 2/.test(css), 'CSS: el cuadro abierto queda por encima del ghost');
has(!(/\.rs2-body\s*\{[\s\S]{0,120}?z-index:\s*[1-9]/.test(css)),
  'CSS: el cuerpo del slide 7 no crea contexto que tape el ghost');
has(/\.rs2-tb-wrap \{[\s\S]{0,200}align-items: center/.test(css), 'CSS: la tabla se centra en la pantalla ampliada');
has(/\.rs2-tb-r--mix/.test(css), 'CSS: las filas de la matriz no se tiñen (el color va por celda)');

/* --- el cuadro NR se pinta con los dos ejes nombrados --- */
key('Escape');
click(doc.querySelector('.slide.active .rs2-body [data-focus="nr"]'));
const nrTabla = doc.querySelector('.slide.active .rs2-tbl[data-tbl="nr"] .rs2-tb');
const nrCab = Array.prototype.slice.call(nrTabla.querySelectorAll('thead tr'));
const nrThs = Array.prototype.slice.call(nrTabla.querySelectorAll('thead tr')[1].children);
has(nrCab.length === 2, 'NR pintado: dos filas de cabecera (banner de columnas + niveles de NP)');
has(nrCab[0].children.length === 3 && nrCab[0].children[2].getAttribute('colspan') === '4',
  'NR pintado: la celda extendida abarca las cuatro columnas');
has(nrCab[0].children[2].classList.contains('rs2-tb-span') &&
  nrCab[0].children[2].textContent === 'Nivel de Probabilidad (NP)',
  'NR pintado: el banner dice «Nivel de Probabilidad (NP)» sobre las columnas, de Muy alta a Baja');
has(nrThs.map(function (th) { return th.textContent; }).join('|') ===
  'Muy alta(MA)40-24|Alta(A)20-10|Media(M)8-6|Baja(B)4-2',
  'NR pintado: las cabeceras muestran nombre, código y tramo del NP, de izquierda a derecha de mayor a menor');

/* el rotulo vertical del eje de las filas */
const nrVert = nrTabla.querySelector('tbody .rs2-tb-vert');
has(!!nrVert && nrVert.getAttribute('rowspan') === '4',
  'NR pintado: una celda vertical con rowspan 4 cubre todas las filas del NC');
has(nrVert && nrVert.textContent === 'Nivel de Consecuencias (NC)',
  'NR pintado: el rotulo vertical de la izquierda dice «Nivel de Consecuencias (NC)»');
has(nrVert && nrTabla.querySelectorAll('tbody tr')[0].firstElementChild === nrVert &&
  Array.prototype.slice.call(nrTabla.querySelectorAll('tbody tr')).every(function (tr) {
    return tr.children[tr === nrTabla.querySelectorAll('tbody tr')[0] ? 1 : 0].tagName === 'TH';
  }), 'NR pintado: el rotulo va en la primera columna y las etiquetas NC en la segunda');
has(Array.prototype.slice.call(nrTabla.querySelectorAll('tbody th')).slice(1).map(function (th) { return th.textContent; }).join('|') ===
  '100Mortal o Catastrófico(M)|60Muy Grave(MG)|25Grave(G)|10Leve(L)',
  'NR pintado: la segunda columna muestra el número, el nombre y el código del NC');
has(Array.prototype.slice.call(nrTabla.querySelectorAll('tbody td')).every(function (td) {
  return /^(I{1,2}|III|IV)/.test(td.textContent);
}), 'NR pintado: cada celda sigue empezando por su nivel de intervención');
has(/\.rs2-tb--matriz \{ table-layout: fixed/.test(css) &&
  /\.rs2-tb--matriz thead th\.rs2-tb-esq--nc \{ width: 232px/.test(css) &&
  /\.rs2-tb--matriz thead th\.rs2-tb-vert,[\s\S]{0,120}width: 34px/.test(css),
  'CSS: la matriz reparte el ancho con la columna de rótulo a 34px y las etiquetas NC a 232px');
has(/\.rs2-tb-span span \{ white-space: nowrap/.test(css),
  'CSS: el banner de columnas va en una línea y centrado (lo hereda de la celda)');
has(/\.rs2-tb-vert span \{[\s\S]{0,200}writing-mode: vertical-rl[\s\S]{0,80}rotate\(180deg\)/.test(css),
  'CSS: el rótulo de filas se escribe en vertical (de abajo arriba)');
has(/\.rs2-tb-np \{[\s\S]{0,120}display: block/.test(css) && /\.rs2-tb-rng \{[\s\S]{0,120}display: block/.test(css),
  'CSS: el nombre del nivel y su tramo van en dos líneas dentro de la cabecera');

/* --- todo el contenido de las celdas, centrado en horizontal y vertical --- */
has(/\.rs2-tb th, \.rs2-tb td \{[\s\S]{0,220}text-align: center;[\s\S]{0,60}vertical-align: middle;/.test(css),
  'CSS: las celdas se centran en horizontal y en vertical');
has(!/\.rs2-tb th, \.rs2-tb td \{[\s\S]{0,220}text-align: left/.test(css) &&
  !/\.rs2-tb th, \.rs2-tb td \{[\s\S]{0,220}vertical-align: top/.test(css) &&
  !/\.rs2-tb thead th \+ th/.test(css) && !/\.rs2-tb td\.rs2-tb-v \{ text-align/.test(css),
  'CSS: no queda ninguna regla que vuelva a alinear el contenido a la izquierda o arriba');
has(rs2Cuadros().every(function (c) {
  return Array.prototype.every.call(c.querySelectorAll('th, td'), function (celda) {
    return /center/.test(win.getComputedStyle(celda).textAlign);
  });
}), 'las cinco tablas: todas sus celdas se centran en horizontal');
key('Escape');

/* =================================================================
   Slide 7 · Fotografía 1: la aplicación web de evaluación (tesis/0)
   Al pulsarla crece a toda la banda y monta un <iframe> con la app, que
   arranca en su pestaña «Evaluación».
   ================================================================= */

const APP = win.RESULTADOS2.fotos[0];
const APP_DIR = path.join(__dirname, '..', '..', 'tesis', '0');

has(!!APP.app, 'la Fotografía 1 lleva los datos de la app que aloja');
has(!!APP.app && /(^|\/)tesis\/0\/index\.html$/.test(APP.app.src.replace(/\\/g, '/')),
  'la app apunta a la carpeta hermana tesis/0/index.html');
has(!!APP.app && fs.existsSync(path.resolve(__dirname, '..', 'presentacion-web', APP.app.src)),
  'esa ruta existe en disco: el <iframe> no dará 404');
has(!!APP.app && fs.existsSync(path.join(APP_DIR, 'index.html')),
  'la aplicación de tesis/0 está presente');

/* la app abre en «Evaluación»: es lo que el usuario pidió como pestaña inicial */
const appHtml = fs.readFileSync(path.join(APP_DIR, 'index.html'), 'utf8');
has(/class="tab-btn activo" data-tab="evaluacion"/.test(appHtml),
  'la app arranca con la pestaña «Evaluación» marcada como activa');
has(/id="tab-evaluacion" class="tab-panel activo"/.test(appHtml),
  'el panel «Evaluación» es el que se muestra al abrir');

const f1 = doc.querySelector('.slide.active .rs2-foto[data-foto="f1"]');
const f2 = doc.querySelector('.slide.active .rs2-foto[data-foto="f2"]');
const rs2Frame = doc.querySelector('.slide.active .rs2-ft-frame, .slide.active [data-frame="f1"]');
const riesgo = doc.querySelector('.slide.active .rs2-body [data-focus="f1"]');

has(riesgo && riesgo.classList.contains('rs2-fn') && riesgo.querySelector('.rs-fn-c').textContent === 'Riesgo',
  'el bloque Riesgo es el que abre la aplicación (data-focus=f1)');
has(/Abrir la aplicación/.test(riesgo.getAttribute('aria-label') || ''),
  'el bloque Riesgo anuncia que abre la aplicación');
has(!f1.getAttribute('data-focus') && !f1.getAttribute('tabindex') && !f1.getAttribute('role'),
  'la Fotografía 1 ya no es pulsable (sin data-focus, tabindex ni role)');
has(f1.classList.contains('rs2-foto--app') && !f2.classList.contains('rs2-foto--app'),
  'solo la Fotografía 1 aloja la app; la 2 sigue siendo un hueco vacío');
has(!f1.querySelector('iframe'), 'en reposo no se carga la app (los ~800KB se esperan al abrir)');
has(!!rs2Frame && !rs2Frame.firstChild, 'el hueco del iframe está vacío en reposo');
const repImg = f1.querySelector('img.rs-ft-img');
has(!!repImg && gcs(repImg).display !== 'none',
  'en reposo la Fotografía 1 muestra la imagen zanja');
has(gcs(f1.querySelector('.rs-ft-n')).display === 'none' &&
  gcs(f1.querySelector('.rs-ft-hint')).display === 'none',
  'en reposo no hay textos bajo la imagen (nota y aviso ocultos)');

click(riesgo);
has(rs2Focus() === 'f1', 'un clic en el bloque Riesgo abre el foco f1');
has(/rs2-body--ff1/.test(rs2BodyEl().className),
  'la clase del cuerpo es rs2-body--ff1 (prefijo rs2-body--f + clave f1)');
const appFr = f1.querySelector('iframe');
has(!!appFr, 'al abrir se monta el <iframe> de la aplicación');
has(!!appFr && appFr.getAttribute('src') === APP.app.src, 'el <iframe> apunta a la ruta de la app');
has(!!appFr && appFr.title === APP.app.etiqueta, 'el <iframe> lleva el título de la app para lectores de pantalla');
const ghostApp = doc.querySelector('.slide.active .scope-ghost');
has(gcs(f1).position === 'relative' && gcs(f1).zIndex === '2' && ghostApp && gcs(ghostApp).zIndex === '0',
  'Fotografía 1 abierta queda delante del ghost atenuado');
has(gcs(f1).backgroundColor === 'rgb(255, 255, 255)',
  'Fotografía 1 abierta conserva un fondo blanco sólido');
has(gcs(r7flow).visibility === 'hidden' && gcs(r7flow).opacity === '0',
  'al abrir la app, el grupo de 7 bloques se oculta con efecto');
has(!!appFr && !f2.querySelector('iframe'), 'la Fotografía 2 no recibe la app');
has(rs2Cuadros().every(function (c) { return gcs(c).display === 'none'; }),
  'al abrir la app, los cinco cuadros de ER.docx se retiran');
has(/volver/.test(f1.querySelector('.rs-ft-hint').textContent), 'el recuadro avisa de cómo volver');
has(gcs(repImg).display === 'none', 'con la app abierta la imagen de reposo no se ve');
has(/\.rs2-body--ff1 \.rs2-foto--app \.rs-ft-img \{ display: none; \}/.test(css),
  'CSS: la imagen de reposo queda oculta con el foco f1');

/* En jsdom el <iframe> no se carga (no se piden recursos externos), así que aquí
   se comprueba que el elemento se monta y se apunta bien; que la app de verdad
   pinte dentro lo verifica la captura con png_stats.js. */

click(doc.querySelector('.slide.active .rs2-body [data-focus="nr"]'));
has(rs2Focus() === 'nr', 'abrir un cuadro de ER.docx cambia el foco a nr');
has(!f1.querySelector('iframe'), 'al abrir un cuadro, el <iframe> de la app se desmonta');
key('Escape');
has(rs2Focus() === null, 'Esc deja el slide 7 en reposo');

click(riesgo);
has(!!f1.querySelector('iframe'), 'un segundo clic en Riesgo vuelve a montar la app');
key('Escape');
has(!f1.querySelector('iframe'), 'Esc desmonta la app otra vez');

has(/\.rs2-body--ff1 \.rs2-foto--app \{[\s\S]{0,200}flex: 1 1 auto/.test(css),
  'CSS: con el foco f1 la Fotografía 1 crece a toda la banda');
has(/\.rs2-body--ff1 \.rs2-foto:not\(\.rs2-foto--app\) \{[\s\S]{0,160}flex: 0 0 0/.test(css),
  'CSS: la Fotografía 2 se retira cuando se abre la app');
has(/\.rs2-body--ff1 \.rs2-screens \{[\s\S]{0,120}flex: 0 0 0/.test(css),
  'CSS: los cuadros de ER.docx ceden el sitio a la app');
has(/\.rs-ft-frame \{ display: none; \}/.test(css) && /\.rs2-body--ff1 \.rs-ft-frame \{[\s\S]{0,200}flex: 1 1 auto/.test(css),
  'CSS: el marco del iframe solo ocupa alto con la app abierta');
has(/\.rs-ft-app \{[\s\S]{0,120}width: 100%[\s\S]{0,60}height: 100%/.test(css),
  'CSS: el iframe ocupa todo el marco');

/* --- CSS de las dos bandas --- */
has(/\.rs2-cols \{[\s\S]{0,200}gap: 12px/.test(css), 'CSS: las dos bandas separadas por un hueco');
has(/\.rs2-flow \{[\s\S]{0,120}flex: 0 0 18\.75%/.test(css), 'CSS: banda del flujograma al 18.75%');
has(/\.rs2-fotos \{[\s\S]{0,200}gap: 14px/.test(css), 'CSS: los dos recuadros de fotos uno al lado del otro');
has(/\.rs2-foto \{[\s\S]{0,400}border: 1px dashed var\(--light\)/.test(css), 'CSS: recuadros de fotos con marco visible');
has(/\.rs2-chain \{[\s\S]{0,160}display: flex[\s\S]{0,80}align-items: stretch/.test(css),
  'CSS: el flujograma es una fila horizontal');
has(/\.rs2-body--ff1 \.rs2-flow \{[\s\S]{0,200}opacity: 0[\s\S]{0,80}visibility: hidden/.test(css),
  'CSS: al abrir la app, los 7 bloques se ocultan con efecto');

/* --- ir y volver --- */
goRs6();
has(!doc.querySelector('.slide.active .rs2-body'), 'navegar al slide 6 -> sin cuerpo del slide 7 activo');
tabGo('7. Resultados (2)');
has(rs2Nodes().length === 7 && rs2Fotos().length === 2 && /Fase 3/.test(doc.querySelector('.slide.active .rs-subtitle').textContent),
  'al volver, el slide 7 mantiene las dos bandas y el encabezado de la fase 3');

/* =================================================================
   Slide 5 · Metodología: bloques 1-2 y las 5 ramas del mapa
   ================================================================= */

function mdBody() { return doc.querySelector('.slide.active .md-body'); }
function mdFocus() { return mdBody() ? mdBody().getAttribute('data-focus') : null; }
function mdClasses() { return mdBody() ? mdBody().className : ''; }
function mdGo() { key('Home'); key('ArrowRight'); key('ArrowRight'); key('ArrowRight'); key('ArrowRight'); }
function mdPanels() {
  return Array.prototype.slice.call(doc.querySelectorAll('.slide.active [data-focus]'));
}

key('Home');
mdGo();
has(!!mdBody(), 'slide 5 activo (bloques 1-2 y ramas)');
const acc = mdPanels();
has(acc.length === 7, '7 objetivos accionables (bloques 1-2 + 5 ramas)');
has(acc.every(function (p) { return p.getAttribute('role') === 'button' && p.getAttribute('tabindex') === '0'; }),
  'los 7 objetivos son role=button con tabindex=0');
has(['1', '2'].every(function (k) {
  return acc.some(function (p) { return p.classList.contains('md-panel') && p.getAttribute('data-focus') === k; });
}), 'bloques 1 y 2 con data-focus 1 y 2');
has(['lt', 'lb', 'rt', 'rb', 'cb'].every(function (k) {
  return acc.some(function (p) { return p.classList.contains('mm-rama') && p.getAttribute('data-focus') === k; });
}), 'las 5 ramas con data-focus lt/lb/rt/rb/cb');
has(mdFocus() === null, 'sin foco al entrar en el slide 5');

/* --- clic en el bloque 1 y rama lt --- */
click(acc[0]);
has(mdFocus() === '1', 'clic en bloque 1 -> data-focus=1');
has(/md-body--f1/.test(mdClasses()), 'clic en bloque 1 -> clase md-body--f1');
has(!!doc.querySelector('.slide.active .scope-ghost.is-on'), 'ghost: sombra de la lámina original visible al ampliar');
click(doc.querySelector('.slide.active [data-focus="lt"]'));
has(mdFocus() === 'lt', 'clic en rama lt -> data-focus=lt');
has(/md-body--flt/.test(mdClasses()) && !/md-body--f1/.test(mdClasses()), 'la clase del bloque 1 se limpia al pasar a una rama');
has(!!doc.querySelector('.slide.active .scope-ghost.is-on'), 'ghost: la sombra de la lámina original también aparece al ampliar una rama');

/* --- segundo clic en la misma rama cierra --- */
click(doc.querySelector('.slide.active [data-focus="lt"]'));
has(mdFocus() === null, 'segundo clic en rama lt -> sin foco');
has(!doc.querySelector('.slide.active .scope-ghost'), 'ghost: la sombra se quita al cerrar el foco');

/* --- ESC cierra el foco --- */
click(doc.querySelector('.slide.active [data-focus="cb"]'));
has(mdFocus() === 'cb', 'clic en rama cb -> data-focus=cb');
key('Escape');
has(mdFocus() === null, 'ESC -> sin foco en el slide 5');

/* --- clic fuera (en el pie del panel mapa) cierra --- */
click(doc.querySelector('.slide.active [data-focus="rt"]'));
const ruta = doc.querySelector('.slide.active .mm-ruta');
has(mdFocus() === 'rt', 'foco abierto antes de clic fuera');
click(ruta);
has(mdFocus() === null, 'clic fuera (banda de ruta) -> cierra el foco');

/* --- teclado: Enter sobre la rama --- */
const rt = doc.querySelector('.slide.active [data-focus="rt"]');
rt.focus();
has(doc.activeElement === rt, 'la rama rt recibe el foco del teclado');
has(key('Enter'), 'Enter sobre la rama -> default evitado');
has(mdFocus() === 'rt', 'Enter sobre la rama rt -> data-focus=rt');
has(key(' '), 'Espacio sobre la rama -> default evitado');
has(mdFocus() === null, 'Espacio de nuevo -> sin foco');

/* --- hints del slide 5 vienen de los datos --- */
has(typeof win.METODOLOGIA.ui.hint === 'string' && win.METODOLOGIA.ui.hint.length > 0, 'pista de los bloques definida en methodologyData.js');
has(typeof win.METODOLOGIA.ui.hintRama === 'string' && win.METODOLOGIA.ui.hintRama.length > 0, 'pista de las ramas definida en methodologyData.js');

/* --- el bloque 3 tambien es ampliable con su pista propia --- */
has(/md-hint--off/.test(doc.querySelector('.slide.active .md-panel--mapa').innerHTML), 'pista de cierre presente en el panel mapa');

/* --- navegar limpia el foco --- */
click(doc.querySelector('.slide.active [data-focus="1"]'));
has(mdFocus() === '1', 'foco antes de navegar');
key('ArrowRight');
has(doc.querySelector('.slide.active') && (!doc.querySelector('.slide.active .md-body') || mdFocus() === null),
  'navegar al slide 6 -> sin foco en el slide 5');

/* --- CSS del slide 5: escala y selectores de foco --- */
has(/\.md-body--f1,?[^{]*\{[^}]*--md-k: 2/.test(css) || /\.md-body--f1[^{]*\{[^}]*--md-k: 2/.test(css), 'CSS: el bloque ampliado escala al 200% (--md-k 2)');
has(/\.md-body--f1 \.md-panel--focus[\s\S]{0,80}(flex: 0 0 100%|width: 100%)[\s\S]{0,40}height: auto/.test(css),
  'CSS: el bloque 1 ocupa todo el ancho con alto al contenido');
has(/\.md-body--f1 \.md-top[\s\S]{0,220}radial-gradient/.test(css), 'CSS: fondo degradado al ampliar el bloque 1');
has(/\.md-top,[\s\S]{0,160}flex-grow \.35s/.test(css), 'CSS: transición de agrandamiento/achicamiento (flex-grow/basis)');
has(/\[data-focus="lt"\]\.mm-rama[\s\S]{0,300}height: auto !important[\s\S]{0,120}--mm-fs: 2 !important/.test(css), 'CSS: la rama llena el ancho con escala 2 y alto al contenido');
has(/\.md-body--flt \.mm-rama:not\(\[data-focus="lt"\]\.mm-rama\)[\s\S]{0,1400}opacity: 0/.test(css), 'CSS: las demas ramas se ocultan');
has((css.match(/var\(--md-k/g) || []).length >= 20, 'CSS: tipografia del slide 5 usa var(--md-k)');
has(/\.scope-ghost[\s\S]{0,200}opacity: 0[\s\S]{0,320}is-on[\s\S]{0,80}opacity: \.12/.test(css), 'CSS: capa ghost (sombra de la pantalla original, atenuada)');
has(/\.md-body, \.rs-body[^{]*\{\s*position: relative; z-index: 1;/.test(css), 'CSS: el contenido real queda por encima del ghost');
has(/\.md-body--flt \.md-panel--mapa[\s\S]{0,260}background: transparent/.test(css), 'CSS: el panel mapa deja ver la sombra al ampliar una rama');
has(/\.md-body--flt \.mm-map[\s\S]{0,220}background: transparent/.test(css), 'CSS: el mm-map deja ver la sombra al ampliar una rama');
has(/\.scope-ghost-inner[\s\S]{0,140}flex-direction: column/.test(css), 'CSS: la capa ghost replica el layout en reposo');

/* =====================================================================
   Slide 8 · RESULTADOS (3): secuencia de los seis resultados de la prueba
   piloto en el proyecto de infraestructura. Cada paso abre en la banda
   inferior la imagen de su resultado (grafico, tabla o figura).
   ===================================================================== */

/* se ejecuta aparte en un window propio: los datos solo necesitan el global */
const w3 = { RESULTADOS3: null };
new Function('window', fs.readFileSync(path.join(ROOT, 'js/data/resultsData3.js'), 'utf8'))(w3);
const pasos8 = w3.RESULTADOS3.pasos || [];

function rs3Body() { return doc.querySelector('.slide.active .rs3-body'); }
function rs3Pasos() { return Array.prototype.slice.call(doc.querySelectorAll('.slide.active .rs3-paso')); }
function rs3Paneles() { return Array.prototype.slice.call(doc.querySelectorAll('.slide.active .rs3-panel')); }
function rs3Focus() { return rs3Body() ? rs3Body().getAttribute('data-focus') : null; }
function rs3Panel(k) { return doc.querySelector('.slide.active .rs3-panel--' + k); }
function rs3Marco(k) { return doc.querySelector('.slide.active .rs3-panel--' + k + ' .rs3-pn-zoom'); }
function rs3Var(el, v) { return el ? parseFloat(el.style.getPropertyValue(v)) || 0 : 0; }
function clicEn(el, x, y) {
  el.dispatchEvent(new win.MouseEvent('click',
    { bubbles: true, cancelable: true, clientX: x || 0, clientY: y || 0 }));
}
function raton(tipo, x, y) {
  return new win.MouseEvent(tipo,
    { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 });
}
function arrastreDe(marco, x0, y0, x1, y1) {
  marco.dispatchEvent(raton('mousedown', x0, y0));
  doc.dispatchEvent(raton('mousemove', x1, y1));
  doc.dispatchEvent(raton('mouseup', x1, y1));
}

has(win.SLIDES.length === 9 && win.SLIDES[7].key === 'resultados3',
  'el slide 8 (Resultados 3) está en la lista de láminas');
has(win.SLIDES[8].id === 9 && win.SLIDES[8].key === 'ept',
  'el slide 9 (EPT) está en la lista de láminas como { id: 9, key: ept }');
has(win.SLIDES[8].label === 'Transformación',
  'la pestaña del slide 9 se titula solo "Transformación"');
has(win.SLIDES.slice(1).every(function (s) {
  return /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ0-9() ]*$/.test(s.label);
}), 'las pestañas 2-9 van en minúsculas salvo la primera letra');
has(pasos8.length === 6, 'RESULTADOS3 lleva los seis pasos de la secuencia');
has(pasos8.map(function (p) { return p.key; }).join(',') === 'p1,p2,p3,p4,p5,p6',
  'las claves de los pasos son p1 a p6');
has(pasos8.every(function (p) {
  return p.clave && p.sub && p.detalle && p.pie && p.imagen && p.color;
}), 'cada paso trae clave, título, sub, detalle, pie, imagen y color');
has(pasos8.every(function (p) {
  return fs.existsSync(path.resolve(ROOT, p.imagen));
}), 'las seis imágenes de los resultados existen en assets/');
has(pasos8.map(function (p) { return p.imagen; }).join(',') ===
  'assets/MatrizER.png,assets/nd-res.png,assets/nd-res1.png,assets/riesgos-res.png,assets/riesgos-res1.png,assets/art-fin.png',
  'las imágenes son las seis del proyecto de infraestructura, en orden');
has(pasos8.every(function (p, i) {
  var exp = [ 'green', 'red', 'green', 'red', 'green', 'red' ][i];
  return p.color === exp;
}), 'los colores se alternan según el orden solicitado');
has(/83 cuestionarios/.test(w3.RESULTADOS3.nota) && /infraestructura/.test(w3.RESULTADOS3.nota),
  'la nota aclara que la muestra es del proyecto de infraestructura');
has(/infraestructura/.test(w3.RESULTADOS3.subtitle) &&
  /toma de decisiones/.test(w3.RESULTADOS3.subtitle),
  'el subtítulo anuncia la prueba piloto y la toma de decisiones');

tabGo('8. Resultados');
has(!!rs3Body(), 'slide 8 (Resultados 3) activo');
has(doc.querySelector('.slide.active h2').textContent === 'Resultados (3)',
  'el título de la lámina es Resultados (3)');
has(rs3Pasos().length === 6, 'seis pasos en la banda superior');
has(rs3Paneles().length === 6, 'seis resultados ampliados prepared en la banda inferior');
has(doc.querySelectorAll('.slide.active .rs3-chain > .rs3-fx').length === 5,
  'cinco conectores entre los seis pasos');
has(rs3Pasos().map(function (n) { return n.querySelector('.rs3-p-c').textContent; }).join(' | ') ===
  'Matriz de Riesgos | Deficiencia (ND) global | Deficiencia por factor de riesgo | Riesgos analizados | Riesgos analizados | ART',
  'cada paso muestra su cifra resumen');
has(rs3Pasos()[4].querySelector('.rs3-p-t').textContent === 'Distribución gráfica' &&
  rs3Pasos()[4].querySelector('.rs3-p-s').textContent === '6,02 %' &&
  rs3Pasos()[4].querySelector('.rs3-p-c').textContent === 'Riesgos analizados',
  'el paso 5 lleva sus tres niveles: Riesgos analizados · Distribución gráfica · 6,02 %');
has(rs3Pasos().every(function (n) {
  return n.getAttribute('data-focus') && n.getAttribute('role') === 'button' &&
    /Ampliar el resultado/.test(n.getAttribute('aria-label') || '');
}), 'los seis pasos son accionables y anuncian qué amplían');
has(rs3Pasos().every(function (n) { return gcs(n).cursor === 'pointer'; }),
  'los pasos muestran cursor de puntero');
has(rs3Focus() === null, 'sin foco al entrar en el slide 8');
has(rs3Paneles().every(function (p) { return gcs(p).display === 'none'; }),
  'en reposo los seis resultados ampliados están ocultos');
has(gcs(doc.querySelector('.slide.active .rs3-screens')).visibility === 'hidden',
  'en reposo la pantalla de resultados no se ve');

/* --- banda inferior en reposo: galería de fotografías, sin información --- */
const fotos8 = w3.RESULTADOS3.fotos || [];
const idle = doc.querySelector('.slide.active .rs3-idle');
has(fotos8.length === 8, 'RESULTADOS3 lleva las ocho fotografías de la prueba piloto');
has(fotos8.every(function (f) {
  return /^assets\/fotos\/\d+\.jpeg$/.test(f) && fs.existsSync(path.resolve(ROOT, f));
}), 'las ocho fotos apuntan a assets/fotos/ y existen en disco');
has(!w3.RESULTADOS3.resumen && !w3.RESULTADOS3.pista,
  'ya no hay resumen ni pista: la banda inferior no lleva información');
has(!/87,95 %|Pulse un resultado|cuestionarios/.test(idle.textContent) &&
  !idle.querySelector('.rs3-idle-b'),
  'en reposo la banda inferior no muestra ninguna información');
has(idle.querySelectorAll('.rs3-gal-i').length === 8,
  'la galería pinta las ocho miniaturas');
has(Array.prototype.every.call(idle.querySelectorAll('.rs3-gal-i'), function (b) {
  return b.getAttribute('type') === 'button' &&
    /Ampliar la fotografía/.test(b.getAttribute('aria-label') || '') &&
    /assets\/fotos\/\d+\.jpeg$/.test(b.querySelector('.rs3-gal-t').getAttribute('src'));
}), 'cada miniatura es un botón accesible que anuncia qué amplía');
has(gcs(idle).position === 'relative', 'la banda es el contenedor del visor ampliado');
has(/\.rs3-gal \{[\s\S]{0,200}grid-template-columns: repeat\(4, 1fr\)[\s\S]{0,120}repeat\(2, 1fr\)/.test(css),
  'CSS: la galería va en una retícula de 4 x 2');
has(/\.rs3-gal-t[\s\S]{0,140}object-fit: cover/.test(css) &&
  /\.rs3-gal-big[\s\S]{0,160}object-fit: contain/.test(css),
  'CSS: la miniatura recorta y la foto ampliada se ve entera');

/* --- clic en una foto: se amplía; un clic fuera la devuelve --- */
const gal1 = idle.querySelectorAll('.rs3-gal-i')[0];
click(gal1);
has(idle.classList.contains('is-open'), 'clic en una miniatura amplía la fotografía');
has(idle.getAttribute('data-foto') === '0', 'la banda recuerda qué fotografía está ampliada');
has(gcs(idle.querySelector('.rs3-gal-view')).display === 'flex',
  'el visor cubre la banda con la foto ampliada');
has(idle.querySelector('.rs3-gal-big').getAttribute('src') ===
  gal1.querySelector('.rs3-gal-t').getAttribute('src'),
  'el visor muestra la misma foto que la miniatura pulsada');
has(rs3Focus() === null, 'ampliar una foto no toca el foco de app.js');
has(gcs(idle.querySelector('.rs3-gal-i')).cursor === 'zoom-in',
  'las miniaturas invitan a ampliar (cursor zoom-in)');
has(gcs(idle.querySelector('.rs3-gal-big')).cursor === 'zoom-out',
  'la foto ampliada invita a volver (cursor zoom-out)');
click(idle.querySelector('.rs3-gal-view'));
has(!idle.classList.contains('is-open'), 'clic fuera de la foto la devuelve a su tamaño normal');
click(gal1);
has(idle.classList.contains('is-open'), 'la fotografía vuelve a ampliarse');
key('Escape');
has(!idle.classList.contains('is-open'), 'ESC también cierra la foto ampliada');
click(idle.querySelectorAll('.rs3-gal-i')[3]);
has(idle.getAttribute('data-foto') === '3', 'clic en otra foto amplía esa');
click(idle.querySelector('.rs3-gal-view'));
has(!idle.classList.contains('is-open'), 'se cierra dejando la galería en reposo');

/* --- clic en un paso: abre su resultado y solo ese --- */
click(rs3Pasos()[1]);
has(rs3Focus() === 'p1' || rs3Focus() === 'p2', 'un clic en un paso abre su foco');
const abierto = rs3Focus();
has(/rs3-body--f/.test(rs3Body().className), 'la clase del cuerpo es rs3-body--f + clave');
const vis = rs3Paneles().filter(function (p) { return gcs(p).display !== 'none'; });
has(vis.length === 1 && vis[0].getAttribute('data-panel') === abierto,
  'se abre exactamente un resultado, el del paso pulsado');
const imgAbierto = vis[0].querySelector('.rs3-pn-img');
has(!!imgAbierto && /assets\//.test(imgAbierto.getAttribute('src') || ''),
  'el resultado abierto muestra su imagen');
has(/nd-res/.test((imgAbierto && imgAbierto.getAttribute('src')) || ''),
  'el segundo paso abre la imagen del nivel de deficiencia');
has(!!doc.querySelector('.slide.active .scope-ghost'), 'el ghost atenúa la lámina al abrir');
has(/76,02|6,02|87,95|83|art-fin/.test(vis[0].querySelector('.rs3-pn-f').textContent) ||
  vis[0].querySelector('.rs3-pn-f').textContent.length > 20,
  'el pie del resultado lleva la lectura y la fuente');

/* --- otro paso cambia el resultado abierto --- */
click(rs3Pasos()[5]);
has(rs3Focus() === 'p6', 'un clic en otro paso cambia el resultado abierto');
has(rs3Paneles().filter(function (p) { return gcs(p).display !== 'none'; }).length === 1,
  'sigue habiendo un solo resultado visible');

/* --- cierre --- */
key('Escape');
has(rs3Focus() === null, 'ESC deja el slide 8 en reposo');
has(gcs(doc.querySelector('.slide.active .rs3-idle')).display !== 'none',
  'al cerrar vuelve la galería de fotografías');
has(rs3Paneles().every(function (p) { return gcs(p).display === 'none'; }),
  'al cerrar, los seis resultados vuelven a ocultarse');
has(!doc.querySelector('.slide.active .scope-ghost'), 'al cerrar desaparece el ghost');
click(rs3Pasos()[0]);
click(rs3Pasos()[0]);
has(rs3Focus() === null, 'un segundo clic en el mismo paso lo cierra');

/* --- CSS del slide 8 --- */
has(/\.rs3-flow \{[\s\S]{0,120}flex: 0 0 18\.75%/.test(css),
  'CSS: la banda de la secuencia va al 18.75% del alto');
has(/\.rs3-paso--green \{ --fn-c: var\(--green\)/.test(css) &&
  /\.rs3-paso--red\s+\{ --fn-c: var\(--red\)/.test(css),
  'CSS: los pasos usan el verde y el rojo de la paleta');
has(/\.rs3-screens \{[\s\S]{0,400}transform: scale\(\.94\)/.test(css),
  'CSS: la pantalla entra agrandándose desde el 94%');
has(/\.rs3-panel \{[\s\S]{0,80}display: none/.test(css) &&
  /\.rs3-body--fp1 \.rs3-panel--p1[\s\S]{0,200}display: flex/.test(css),
  'CSS: cada resultado se muestra solo con su foco');
has(/\.rs3-pn-img \{[\s\S]{0,140}object-fit: contain/.test(css),
  'CSS: la imagen se centra sin deformarse');
has(/\.rs3-p-c \{[\s\S]{0,200}color: var\(--fn-c\)/.test(css) &&
  /font-size: 17\.08px/.test(css),
  'CSS: el primer nivel conserva su tamaño y va en el color sólido del bloque');
has(/\.rs3-p-t \{[\s\S]{0,120}color: #000/.test(css),
  'CSS: el segundo nivel va en negro');
has(/\.rs3-p-s \{[\s\S]{0,160}color: #000/.test(css) &&
  /font-size: 9\.8px/.test(css),
  'CSS: el tercer nivel va en negro y en tamaño menor');

/* --- nivel 2: clic en la imagen -> máximo tamaño; clic de nuevo -> panel --- */
has(/\{ sel: 'rs3-body'[\s\S]{0,220}parents: \{ p1i: 'p1', p2i: 'p2', p3i: 'p3', p4i: 'p4', p5i: 'p5', p6i: 'p6' \}/.test(appJs),
  'app.js: los seis niveles de imagen cuelgan de su resultado (p1i -> p1, ...)');
has(rs3Paneles().every(function (p) {
  const z = p.querySelector('.rs3-pn-zoom');
  return z && z.getAttribute('data-focus') === p.getAttribute('data-panel') + 'i' &&
    z.getAttribute('role') === 'button' && /al máximo tamaño/.test(z.getAttribute('aria-label') || '');
}), 'cada resultado lleva su imagen ampliable con aria-label propio');
has(rs3Paneles().every(function (p) { return gcs(p.querySelector('.rs3-pn-zoom')).cursor === 'zoom-in'; }),
  'el marco de la imagen ofrece cursor zoom-in');

click(rs3Pasos()[0]);
has(rs3Focus() === 'p1', 'el paso 1 abre su resultado antes de ampliar la imagen');

/* la pista de uso solo aparece con la imagen a máximo tamaño */
const tip1 = doc.querySelector('.slide.active .rs3-panel--p1 .rs3-zoom-tip');
has(rs3Paneles().every(function (p) { return !!p.querySelector('.rs3-zoom-tip'); }),
  'cada resultado lleva su pista de uso del nivel 2');
has(tip1 && gcs(tip1).display === 'none',
  'la pista se oculta mientras el resultado está en la banda inferior');
has(tip1 && /acercar/.test(tip1.textContent) && /desplazar/.test(tip1.textContent) &&
  /volver/.test(tip1.textContent), 'la pista explica acercar, desplazar y volver');

const marco1 = rs3Marco('p1');
clicEn(marco1, 120, 80);
has(gcs(doc.querySelector('.slide.active .rs3-panel--p1')).display !== 'none',
  'en el nivel 2 el resultado sigue visible');
has(gcs(doc.querySelector('.slide.active .rs3-pn-body')).display === 'none' ||
  gcs(doc.querySelector('.slide.active .rs3-flow')).display === 'none',
  'en el nivel 2 se oculta la secuencia');
has(gcs(doc.querySelector('.slide.active .rs3-panel--p1 .rs3-pn-h')).display === 'none',
  'en el nivel 2 se oculta la cabecera del resultado');
has(gcs(doc.querySelector('.slide.active .rs3-idle')).display === 'none',
  'en el nivel 2 se oculta la galería de fotografías');
has(gcs(doc.querySelector('.slide.active .rs3-panel--p1 .rs3-pn-f')).display === 'none',
  'en el nivel 2 se oculta el pie del resultado');
has(gcs(doc.querySelector('.slide.active .rs3-panel--p1 .rs3-pn-zoom')).cursor === 'zoom-in',
  'en el nivel 2 el cursor sigue siendo zoom-in (ahora acerca)');
has(/\.rs3-body--fp1i \.rs3-pn-body[\s\S]{0,600}radial-gradient/.test(css),
  'CSS: la imagen maximizada lleva el fondo tenue verde/rojo del slide 6');
has(/\.rs3-body--fp1i \.rs3-pn-body[\s\S]{0,700}box-shadow: 0 0 0 2px var\(--fn-c\)/.test(css),
  'CSS: la imagen maximizada se anilla en el color del resultado');

/* --- zoom y desplazamiento dentro de la imagen maximizada --- */
const zoomJs = fs.readFileSync(path.join(ROOT, 'js/slides/slide08Zoom.js'), 'utf8');
has(/addEventListener\('click', onClick, true\)/.test(zoomJs),
  'slide08Zoom.js intercepta el clic en fase de captura (app.js no lo ve)');
has(/var PASO = 1\.6/.test(zoomJs) && /var ESCALA_MAX = 8/.test(zoomJs),
  'el acercamiento es de ×1,6 por clic hasta ×8');

/* la pista de uso solo aparece con la imagen a máximo tamaño */
has(gcs(doc.querySelector('.slide.active .rs3-panel--p1 .rs3-zoom-tip')).display === 'flex',
  'la pista se ve con la imagen a máximo tamaño');
has(/\.rs3-zoom-tip \{[^}]*display: none/.test(css) &&
  /\.rs3-body--fp1i \.rs3-zoom-tip[^}]*pointer-events: none/.test(css),
  'CSS: la pista solo vive en el nivel 2 y no intercepta los clics');
has(/\.rs3-pn-zoom \{[^}]*scale\(var\(--rs3-z, 1\)\)/.test(css) &&
  /\.rs3-pn-zoom\.is-zoom \{ cursor: grab; \}/.test(css) &&
  css.indexOf('.rs3-pn-zoom.is-zoom') > css.indexOf('.rs3-body--fp1i .rs3-pn-zoom'),
  'CSS: el marco lleva la transformación y ofrece cursor grab al desplazar');

/* 1) un clic sobre la imagen la acerca, sin cerrar el nivel 2 */
/* 1) un clic sobre la imagen la acerca, sin cerrar el nivel 2 */
has(!marco1.style.getPropertyValue('--rs3-z'),
  'al abrir el nivel 2 la imagen empieza sin acercar (sin transformación)');
has(rs3Focus() === 'p1i', 'el clic que abre la imagen lleva al nivel 2 (p1i)');
clicEn(marco1, 120, 80);
has(rs3Focus() === 'p1i', 'el clic que acerca no cierra el nivel 2');
has(Math.abs(rs3Var(marco1, '--rs3-z') - 1.6) < 0.001, 'el clic acerca ×1,6 (de 1,0 a 1,6)');
has(marco1.classList.contains('is-zoom'), 'el marco se marca como ampliado');
has(gcs(marco1).cursor === 'grab', 'al haber acercamiento el cursor pasa a grab');
has(rs3Panel('p1').querySelector('.rs3-zoom-nv').textContent === '×1,6',
  'la pista muestra el factor de acercamiento');
clicEn(marco1, 160, 100);
has(Math.abs(rs3Var(marco1, '--rs3-z') - 2.56) < 0.001, 'otro clic vuelve a acercar (×2,6)');

/* 2) el punto del cursor es el que se amplía: el marco se desplaza hacia él */
has(rs3Var(marco1, '--rs3-tx') !== 0 || rs3Var(marco1, '--rs3-ty') !== 0,
  'el acercamiento ancla en el punto pulsado (la imagen se desplaza)');
const antesX = rs3Var(marco1, '--rs3-tx');
clicEn(marco1, 100, 100);
const trasX = rs3Var(marco1, '--rs3-tx');
has(Math.abs(rs3Var(marco1, '--rs3-z') - 4.096) < 0.001, 'el tercer clic acerca a ×4,1');
has(trasX < antesX, 'acercar por encima del centro arrastra la imagen hacia ese lado');
clicEn(marco1, 0, 0);
has(Math.abs(rs3Var(marco1, '--rs3-z') - 6.5536) < 0.001, 'el cuarto clic llega a ×6,6');
has(Math.abs(rs3Var(marco1, '--rs3-tx')) > Math.abs(trasX),
  'acercar en el centro mantiene el centro y empuja la imagen hacia el borde');
clicEn(marco1, 200, 200);
has(rs3Var(marco1, '--rs3-z') === 8, 'el acercamiento se detiene en ×8');
clicEn(marco1, 200, 200);
has(rs3Var(marco1, '--rs3-z') === 8, 'en el tope no sigue acercando');

/* 3) arrastrar con el mouse desplaza la imagen */
const antesArrastre = [rs3Var(marco1, '--rs3-tx'), rs3Var(marco1, '--rs3-ty')];
arrastreDe(marco1, 200, 200, 260, 250);
has(rs3Var(marco1, '--rs3-tx') !== antesArrastre[0] || rs3Var(marco1, '--rs3-ty') !== antesArrastre[1],
  'arrastrar el mouse desplaza la imagen');
has(!marco1.classList.contains('is-drag'), 'al soltar el mouse se libera el estado de arrastre');
clicEn(marco1, 200, 200);
has(rs3Var(marco1, '--rs3-z') === 8, 'el clic que cierra un arrastre no acerca más');
has(rs3Focus() === 'p1i', 'el arrastre no cierra el nivel 2');

has(/\.rs3-body \{[\s\S]{0,160}flex: 1 1 auto/.test(css),
  'CSS: el cuerpo del slide 8 ocupa el alto restante');
has(/\.rs3-body--fp1 \.rs3-idle[\s\S]{0,200}display: none/.test(css),
  'CSS: la galería se oculta al abrir cualquier resultado');

/* 4) un clic fuera de la imagen vuelve a la pantalla principal */
clicEn(doc.querySelector('.slide.active .rs3-panel--p1 .rs3-pn-body'), 5, 5);
has(rs3Focus() === 'p1', 'un clic fuera de la imagen vuelve al resultado (p1)');
has(gcs(doc.querySelector('.slide.active .rs3-flow')).display !== 'none',
  'al volver reaparece la secuencia');

/* 5) al reabrir el nivel 2 el acercamiento vuelve a empezar en ×1 */
clicEn(marco1, 300, 300);
has(rs3Focus() === 'p1i', 'la imagen vuelve a máximo tamaño');
has(rs3Var(marco1, '--rs3-z') === 1 && rs3Var(marco1, '--rs3-tx') === 0 &&
  rs3Var(marco1, '--rs3-ty') === 0, 'al reabrir, el acercamiento se reinicia en ×1,0');
has(!marco1.classList.contains('is-zoom'), 'al reabrir desaparece la marca de ampliado');
has(rs3Panel('p1').querySelector('.rs3-zoom-nv').textContent === '×1,0',
  'la pista vuelve a marcar ×1,0');
key('Escape');
has(rs3Focus() === 'p1', 'ESC en el nivel 2 -> vuelve al resultado (p1)');
key('Escape');
has(rs3Focus() === null, 'ESC otra vez -> reposo');

/* 6) el desplazamiento solo existe si hay acercamiento, y en cualquier paso */
click(rs3Pasos()[3]);
has(rs3Focus() === 'p4', 'el paso 4 abre su resultado');
const marco4 = rs3Marco('p4');
arrastreDe(marco4, 200, 200, 260, 250);
has(rs3Var(marco4, '--rs3-z') <= 1 && rs3Var(marco4, '--rs3-tx') === 0,
  'sin acercar no hay desplazamiento: el arrastre no hace nada');
clicEn(marco4, 220, 160);
has(rs3Focus() === 'p4i', 'la imagen del resultado 4 también se abre a máximo tamaño');
clicEn(marco4, 220, 160);
has(rs3Focus() === 'p4i' && Math.abs(rs3Var(marco4, '--rs3-z') - 1.6) < 0.001,
  'el acercamiento también funciona en el resultado 4 (p4i, ×1,6)');
clicEn(doc.querySelector('.slide.active .rs3-panel--p4 .rs3-pn-body'), 5, 5);
has(rs3Focus() === 'p4', 'el clic fuera de la imagen devuelve también el resultado 4');
key('Escape');
has(rs3Focus() === null, 'ESC en reposo');

/* --- ART (p6): la imagen a máximo tamaño navega por las tres figuras ------
   El ART no se acerca como los demás: un clic dentro de la imagen avanza en
   la secuencia art-fin -> art1 -> art2 (con vuelta), y un clic fuera (o ESC)
   cierra la exploración entera y deja la lámina en reposo. */
const artJs = fs.readFileSync(path.join(ROOT, 'js/slides/slide08Art.js'), 'utf8');
has(/addEventListener\('click', onClick, true\)/.test(artJs),
  'slide08Art.js intercepta el clic en fase de captura (app.js no lo conmuta)');
has(/art-fin\.png/.test(artJs) && /art1\.png/.test(artJs) && /art2\.png/.test(artJs),
  'slide08Art.js conoce las tres figuras de la secuencia del ART');
has(/\/\^p\[1-5\]i\$\/\.test\(k\)/.test(zoomJs),
  'slide08Zoom.js: solo p1i..p5i se acercan; el ART queda fuera del zoom');
const imgArt = function () {
  const p = rs3Panel('p6');
  return p ? p.querySelector('.rs3-pn-img') : null;
};

click(rs3Pasos()[5]);
has(rs3Focus() === 'p6', 'el ART abre su resultado');
const mar6 = rs3Marco('p6');
has(imgArt().getAttribute('src') === 'assets/art-fin.png',
  'al abrir el resultado, el ART proyecta art-fin.png');
clicEn(mar6, 200, 120);
has(rs3Focus() === 'p6i', 'el clic sobre la figura la agranda (nivel 2 p6i)');
clicEn(mar6, 200, 120);
has(rs3Focus() === 'p6i', 'en el nivel 2 el clic no cierra la exploración');
has(imgArt().getAttribute('src') === 'assets/art1.png',
  'el siguiente clic muestra art1.png agrandada');
has(rs3Panel('p6').querySelector('.rs3-zoom-nv').textContent === '2/3',
  'la pista anuncia la segunda figura de tres');
clicEn(mar6, 200, 120);
has(imgArt().getAttribute('src') === 'assets/art2.png',
  'un clic sobre art1 muestra art2.png');
has(rs3Panel('p6').querySelector('.rs3-zoom-nv').textContent === '3/3',
  'la pista anuncia la tercera figura de tres');
clicEn(mar6, 200, 120);
has(imgArt().getAttribute('src') === 'assets/art-fin.png',
  'después de art2 la secuencia vuelve a art-fin (ciclo)');
has(rs3Focus() === 'p6i', 'el ciclo se hace sin salir del nivel 2');
clicEn(mar6, 200, 120);
has(imgArt().getAttribute('src') === 'assets/art1.png',
  'el ciclo sigue tras volver a art-fin');
has(rs3Var(mar6, '--rs3-z') === 0 && !mar6.classList.contains('is-zoom'),
  'en el ART la imagen no se acerca (nunca hay transformación)');

/* --- el clic fuera de la imagen del ART vuelve a la página principal ------ */
clicEn(doc.querySelector('.slide.active .rs3-panel--p6 .rs3-pn-body'), 5, 5);
has(rs3Focus() === null, 'un clic fuera de la figura ART vuelve al reposo');
has(!doc.querySelector('.slide.active .scope-ghost'), 'el clic fuera deja la lámina sin ghost');
has(imgArt().getAttribute('src') === 'assets/art-fin.png',
  'al cerrar la exploración se reinicia la primera figura');
has(gcs(doc.querySelector('.slide.active .rs3-idle')).display !== 'none',
  'al cerrar el ART reaparece la galería de fotografías');

/* ESC dentro de la exploración cierra igual que el clic fuera */
clicEn(mar6, 200, 120);
clicEn(mar6, 200, 120);
has(rs3Focus() === 'p6i' && imgArt().getAttribute('src') === 'assets/art1.png',
  'reabierto: la navegación vuelve a empezar en la primera figura');
key('Escape');
has(rs3Focus() === null, 'ESC dentro del ART deja la lámina en reposo');
has(!doc.querySelector('.slide.active .scope-ghost'), 'ESC elimina también el ghost');

/* tras el ART, los demás resultados siguen comportándose con normalidad */
click(rs3Pasos()[0]);
has(rs3Focus() === 'p1', 'después del ART, los otros resultados se abren igual');
key('Escape');
has(rs3Focus() === null, 'reposo tras la secuencia del ART');

/* --- el logo va en la esquina superior derecha de todos los slides -------- */
var slidesAll = Array.prototype.slice.call(doc.querySelectorAll('#slideFrame .slide'));
has(slidesAll.length === 9, 'la lámina contiene los nueve slides');
var logos = Array.prototype.slice.call(doc.querySelectorAll('#slideFrame .slide .slide-logo'));
has(logos.length === 8, 'los ocho slides de contenido llevan un .slide-logo (la carátula no)');
has(logos.every(function (l) { return l.getAttribute('src') === 'assets/logo.png'; }),
  'todos los logos apuntan a assets/logo.png');
has(logos.every(function (l) { return l.getAttribute('alt') === 'Logotipo'; }),
  'todos los logos llevan alt="Logotipo"');
has(fs.existsSync(path.join(ROOT, 'assets', 'logo.png')),
  'el fichero assets/logo.png existe en disco');
var logoCss = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
has(/\.slide-logo\s*\{[^}]*position\s*:\s*absolute/.test(logoCss),
  'CSS: .slide-logo se posiciona en absoluto');
has(/\.slide-logo\s*\{[^}]*right\s*:\s*12px/.test(logoCss),
  'CSS: .slide-logo anclado a la derecha (right:12px)');
has(!/\.slide-cover\s*\.slide-logo\s*\{/.test(logoCss),
  'CSS: la carátula ya no tiene regla .slide-cover .slide-logo');

/* --- la carátula reproduce slide 1 de Ejemplo.pptx ------------------------- */
var coverEl = doc.querySelector('#slideFrame .slide-cover');
has(coverEl !== null, 'la carátula existe como .slide-cover');
has(coverEl.querySelectorAll('.slide-logo').length === 0,
  'la carátula NO lleva el .slide-logo de logo.bmp');
var coverLogo = coverEl.querySelector('.cover-logo');
has(coverLogo && coverLogo.getAttribute('src') === 'assets/logocaratula.png',
  'la carátula lleva logocaratula.png centrado en la banda negra');
has(fs.existsSync(path.join(ROOT, 'assets', 'logocaratula.png')),
  'el fichero assets/logocaratula.png existe en disco');
var coverAbstract = coverEl.querySelector('.cacc-abstract');
has(coverAbstract && coverAbstract.getAttribute('src') === 'assets/cover-abstract.png',
  'la tira abstracta derecha usa assets/cover-abstract.png');
has(fs.existsSync(path.join(ROOT, 'assets', 'cover-abstract.png')),
  'el fichero assets/cover-abstract.png existe en disco');
has(coverEl.querySelector('.cover-kicker').textContent === 'Presentación Tesis Doctoral',
  'kicker de la carátula: Presentación Tesis Doctoral');
has(coverEl.querySelector('.cover-prog').textContent === 'DOCTORADO EN DIRECCIÓN DE PROYECTOS',
  'la carátula muestra el programa DOCTORADO EN DIRECCIÓN DE PROYECTOS');
has(/Jorge Alexander Bucheli García/.test(coverEl.querySelector('.cover-candidato').textContent),
  'la carátula muestra Candidato: Jorge Alexander Bucheli García');
has(/Dra\. Julia Ayuso, Ph\.D\./.test(coverEl.querySelector('.cover-asesora').textContent),
  'la carátula muestra Asesora: Dra. Julia Ayuso, Ph.D.');
has(/\.slide-cover\s*\{\s*background:\s*#fff(?:fff)?[\s;]*\}/.test(logoCss),
  'CSS: fondo blanco de la carátula');
has(/\.cover-band\s*\{[^}]*height:\s*211px/.test(logoCss),
  'CSS: banda superior negra de 211px (26,7% del alto, igual que el pptx)');
has(/\.cover-band\s*\{[^}]*background:\s*#262626/.test(logoCss),
  'CSS: la banda es #262626 como el ejemplo');
has(/\.cover-logo\s*\{[^}]*width:\s*430px/.test(logoCss),
  'CSS: logocaratula de 430px de ancho, centrado en la banda');
has(/\.cover-kicker\s*\{[^}]*font-size:\s*41px/.test(logoCss),
  'CSS: kicker a 41px (28pt del ejemplo)');
has(/\.cover-title\s*\{[^}]*text-wrap:\s*balance/.test(logoCss),
  'CSS: el título equilibra sus líneas (text-wrap: balance) para que 2026 no quede solo');
has(/\.cacc-abstract\s*\{[^}]*opacity:\s*0?\.5/.test(logoCss),
  'CSS: la tira abstracta derecha va atenuada al 50% (opacity .5)');

/* --- el pie institucional (logo-inf.png) solo en pantalla completa ---------- */
var feet = Array.prototype.slice.call(doc.querySelectorAll('#slideFrame .slide .slide-foot'));
has(feet.length === 9, 'los nueve slides llevan un .slide-foot (pie)');
has(feet.every(function (f) {
  var i = f.querySelector('img');
  return i && i.getAttribute('src') === 'assets/logo-inf.png';
}), 'el pie apunta a assets/logo-inf.png');
has(fs.existsSync(path.join(ROOT, 'assets', 'logo-inf.png')),
  'el fichero assets/logo-inf.png existe en disco');
var footCss = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
has(/\.slide-foot\s*\{[^}]*flex:\s*0\s*0\s*80px/.test(footCss),
  'CSS: el pie es una banda propia de 80px (en flujo, no superpuesto)');
has(/\.slide-foot\s*\{[^}]*align-items:\s*flex-end/.test(footCss),
  'CSS: el pie se apoya en el borde inferior de la banda');
has(/\.slide-foot\s*img\s*\{[^}]*width\s*:\s*1119px/.test(footCss),
  'CSS: el pie reduce su ancho un 15% frente al original (1316 -> 1119)');
has(/body\.is-fullscreen-presentation\s*\.slide-frame\s*\{\s*height:\s*800px;\s*\}/.test(footCss),
  'CSS: en pantalla completa el marco crece a 800px (banda del pie)');
has(/body\.is-fullscreen-presentation\s*\.slide-foot\s*\{[^}]*display\s*:\s*flex/.test(footCss),
  'CSS: el pie se muestra solo con is-fullscreen-presentation');
has(gcs(doc.querySelector('#slideFrame .slide .slide-foot')).display === 'none',
  'sin pantalla completa el pie permanece oculto');

/* --- diapositiva 9 · EPT (diagrama EPTransf.md, cinco franjas) ------------- */
tabGo('9. Transformación');
var eptEl = doc.querySelector('#slideFrame .slide-ept');
has(eptEl !== null, 'el slide 9 (EPT) existe como .slide-ept');
has(eptEl.getAttribute('data-slide') === '9', 'data-slide="9" en el slide EPT');
has(eptEl.querySelector('.slide-logo') !== null, 'el slide EPT lleva el .slide-logo (top-right)');
has(eptEl.querySelector('.slide-head h2').textContent === 'Estructura de la propuesta de transformación',
  'el título del slide es "Estructura de la propuesta de transformación" (sin "(EPT)")');
var h2s = Array.prototype.slice.call(doc.querySelectorAll('#slideFrame .slide .slide-head h2'));
has(h2s.length === 8, 'los ocho slides de contenido (2-9) llevan su título en el encabezado');
has(h2s[0].textContent === 'Problematización' &&
  h2s[1].textContent === 'Objetivos - hipótesis' &&
  h2s[2].textContent === 'Teorías, conceptos y referentes normativos o legales' &&
  h2s[3].textContent === 'Metodología' &&
  h2s[4].textContent === 'Resultados' &&
  h2s[5].textContent === 'Resultados (2)' &&
  h2s[6].textContent === 'Resultados (3)' &&
  h2s[7].textContent === 'Estructura de la propuesta de transformación',
  'títulos de los slides 2-9 en sentence case (solo la primera letra en mayúscula)');
has(h2s.slice(0, 7).every(function (h) {
  var t = h.textContent;
  return t.charAt(0) === t.charAt(0).toUpperCase() && !/[A-ZÁÉÍÓÚÑÑ]/.test(t.slice(1));
}), 'slides 2-8: ninguna mayúscula interna en el título');
has(/Secuencia metodológica orientada al fortalecimiento/.test(eptEl.querySelector('.ept-subtitle').textContent) &&
  /Quito/.test(eptEl.querySelector('.ept-subtitle').textContent),
  'subtítulo: la secuencia metodológica de EPTransf.md (fortalecimiento de la gestión preventiva en Quito)');

/* --- cinco franjas: lógica · central · resultado · recursos clave ----------- */
var q9 = function (s) { return Array.prototype.slice.call(eptEl.querySelectorAll(s)); };
var logica = eptEl.querySelector('.ept-logica');
var central = eptEl.querySelector('.ept-central');
var result = eptEl.querySelector('.ept-result');
var rc = eptEl.querySelector('.ept-rc');
has(!!logica && !!central && !!result && !!rc,
  'las franjas del diagrama están montadas (lógica, central, resultado, recursos clave)');
has(/Lógica de transformación/i.test(logica.querySelector('.ept-band-k').textContent),
  'franja superior rotulada "Lógica de transformación"');
var logicaNodos = q9('.ept-logica .ept-nodo');
has(logicaNodos.length === 4, 'cuatro nodos en la lógica de transformación');
has(logicaNodos.map(function (n) { return n.querySelector('.ept-nodo-t').textContent; }).join('|') ===
  'Análisis normativo|Verificación técnica|Valoración del riesgo|Control de ingeniería',
  'secuencia: análisis normativo → verificación técnica → valoración del riesgo → control de ingeniería');
has(logicaNodos.every(function (n) { return !!n.querySelector('.ept-ico'); }),
  'cada nodo de la lógica lleva su icono circular');
has(q9('.ept-logica .ept-arrow').length === 3, 'tres flechas unen los cuatro nodos de la lógica');
var fund = eptEl.querySelector('.ept-side--fund');
var prop = eptEl.querySelector('.ept-side--prop');
has(!!fund && /Fundamento/.test(fund.textContent), 'bloque lateral izquierdo "Fundamento"');
has(/Normativa vigente/.test(fund.textContent) && /Evidencia de campo/.test(fund.textContent),
  'Fundamento: normativa vigente · evidencia de campo');
has(!!prop && /Propósito/.test(prop.textContent), 'bloque lateral derecho "Propósito"');
has(/Mitigación efectiva/.test(prop.textContent) && /Aplicación en obra/.test(prop.textContent),
  'Propósito: mitigación efectiva del riesgo · aplicación en obra');
var etapas = q9('.ept-e');
has(etapas.length === 3, 'tres tarjetas de etapa en la franja central');
has(etapas[0].className.indexOf('ept-e--green') > -1 &&
  etapas[1].className.indexOf('ept-e--red') > -1 &&
  etapas[2].className.indexOf('ept-e--green') > -1,
  'paleta alternada: Etapa 1 y 3 en verde, Etapa 2 en rojo');
has(etapas.map(function (e) { return e.querySelector('.ept-e-head').textContent; }).join(',') === 'Etapa 1,Etapa 2,Etapa 3',
  'encabezados de etapa en flujo 1 → 2 → 3');
has(etapas.map(function (e) { return e.querySelector('.ept-e-nombre').textContent.replace(/\s+/g, ' '); }).join('|') ===
  'Componente técnico-normativo base|Cuestionarios de chequeo|ART + controles de ingeniería',
  'componentes exactos de EPTransf (base → chequeo → ART)');
has(etapas[0].querySelector('.ept-e-cap') === null, 'la Etapa 1 no lleva cápsula de norma');
has(etapas[1].querySelector('.ept-e-cap').textContent === 'NTP 324', 'la Etapa 2 muestra su cápsula NTP 324');
has(etapas[2].querySelector('.ept-e-cap').textContent === 'NTP 330', 'la Etapa 3 muestra su cápsula NTP 330');
has(etapas.map(function (e) { return e.querySelectorAll('.ept-e-item').length; }).join(',') === '4,4,5',
  'contenidos clave por etapa: 4, 4 y 5 viñetas');
has(etapas[0].querySelectorAll('.ept-e-item')[0].textContent === 'Análisis de normativa aplicable' &&
  etapas[1].querySelectorAll('.ept-e-item')[0].textContent === 'Verificación técnica en campo' &&
  etapas[2].querySelectorAll('.ept-e-item')[0].textContent === 'Valoración cuantitativa del riesgo',
  'primera viñeta de cada etapa según EPTransf');
has(etapas.every(function (e) { return /Recursos requeridos/i.test(e.querySelector('.ept-e-rec-k').textContent); }),
  'cada etapa lleva su subbloque "Recursos requeridos"');
has(etapas.map(function (e) { return e.querySelectorAll('.ept-pill').length; }).join(',') === '5,5,5',
  'cinco recursos requeridos por etapa (solo nombrados, sin desarrollo)');
has(etapas[0].querySelectorAll('.ept-pill')[0].textContent === 'D.E. 255-2024' &&
  etapas[0].querySelectorAll('.ept-pill')[1].textContent === 'AM-MDT-2024-196' &&
  etapas[0].querySelectorAll('.ept-pill')[2].textContent === 'AM-MDT-2025-122',
  'Etapa 1: D.E. 255-2024 y los acuerdos ministeriales AM-MDT como recursos');
has(etapas[1].querySelectorAll('.ept-pill')[0].textContent === 'NTP 324' &&
  etapas[2].querySelectorAll('.ept-pill')[0].textContent === 'NTP 330',
  'cada etapa inicia sus recursos por su NTP de referencia');
has(etapas.map(function (e) { return e.querySelector('.ept-e-out').textContent; }).join('|') ===
  'Base técnica y normativa|Diagnóstico y medición|Intervención operativa',
  'franjas de salida: base técnica → diagnóstico y medición → intervención operativa');
has(q9('.ept-central .ept-arrow').length === 4,
  'cuatro flechas de transición al centro (fundamento → etapa 1 hasta el propósito)');
has(/Resultado esperado/i.test(result.querySelector('.ept-rs-k').textContent),
  'franja inferior rotulada "Resultado esperado"');
var rsNodos = q9('.ept-rs .ept-nodo');
has(rsNodos.length === 3, 'tres nodos en el resultado esperado');
has(rsNodos.map(function (n) { return n.querySelector('.ept-nodo-t').textContent; }).join('|') ===
  'Gestión preventiva fortalecida|Condiciones de seguridad mejoradas|Actuación técnica más segura y controlada',
  'resultado: gestión fortalecida → condiciones mejoradas → actuación más segura y controlada');
has(q9('.ept-rs .ept-arrow').length === 2, 'dos flechas conectan los tres nodos del resultado');
has(/Recursos clave/i.test(rc.querySelector('.ept-rc-k').textContent), 'banda final "Recursos clave"');
has(rc.querySelector('.ept-rc-gear') !== null, 'la banda lleva su icono de engranaje');
has(q9('.ept-rc-it').map(function (it) { return it.textContent; }).join('|') ===
  'Normativa|NTP 324|NTP 330|Matrices|Registros de campo|Formatos ART|Personal técnico',
  'recursos clave completos (solo nombrados)');
has(eptEl.querySelectorAll('.ept-arrow').length === 9, 'nueve flechas en total (3 lógica + 4 central + 2 resultado)');

/* CSS: cabecera propia, paleta EPTransf y bandas de la lámina. */
has(/\.slide-ept \.slide-head\s*\{\s*height:\s*92px/.test(logoCss),
  'CSS: cabecera propia del slide EPT (subtítulo de hasta dos líneas)');
has(/\.ept-e--green \.ept-e-head\s*\{[^}]*background:\s*var\(--ept-verde\)/.test(logoCss),
  'CSS: cabeceras de etapa 1 y 3 en verde');
has(/\.ept-e--red \.ept-e-head\s*\{[^}]*background:\s*var\(--ept-rojo\)/.test(logoCss),
  'CSS: la Etapa 2 va en rojo (alternancia verde/rojo/verde)');
has(/\.ept-e--green \.ept-e-out\s*\{[^}]*background:\s*var\(--ept-verde-claro\)/.test(logoCss),
  'CSS: salida verde sobre verde muy claro');
has(/\.ept-e--red \.ept-e-out\s*\{[^}]*background:\s*var\(--ept-rojo-claro\)/.test(logoCss),
  'CSS: salida roja sobre rojo claro');
has(/\.ept-result\s*\{[^}]*background:\s*var\(--ept-rojo-claro\)/.test(logoCss),
  'CSS: el resultado esperado va sobre rojo claro');
has(/\.ept-rc\s*\{[^}]*background:\s*var\(--ept-gris\)/.test(logoCss),
  'CSS: la banda de recursos clave va sobre gris claro');
has(/\.ept-body\s*\{[^}]*flex:\s*1/.test(logoCss),
  'CSS: la lámina EPT usa el cuerpo flex:1 común para absorger el pie en pantalla completa');

var slideBefore = doc.querySelector('#slideFrame .slide.active');
var victim = slideBefore ? slideBefore.children[0] : null;
var bodyEl = slideBefore ? slideBefore.querySelector('.cover-body, .problem-body, .md-body, .rs-body, .rs2-body, .rs3-body, .ept-body') : null;
var topBefore = victim ? victim.offsetTop : -1;
var bodyHBefore = bodyEl ? bodyEl.offsetHeight : -1;
var fakeFs = doc.createElement('div');
Object.defineProperty(doc, 'fullscreenElement', { configurable: true, get: function () { return fakeFs; } });
doc.dispatchEvent(new win.Event('fullscreenchange'));
has(doc.body.classList.contains('is-fullscreen-presentation'),
  'pantalla completa: el cuerpo recibe la clase is-fullscreen-presentation');
has(gcs(doc.querySelector('#slideFrame .slide .slide-foot')).display === 'flex',
  'pantalla completa: el pie se hace visible (flex)');
has(victim && topBefore === victim.offsetTop,
  'el pie no desplaza el contenido (misma altura de inicio)');
has(bodyEl && bodyHBefore === bodyEl.offsetHeight,
  'el cuerpo del slide conserva su altura: el pie va por debajo, no encima');
delete doc.fullscreenElement;
Object.defineProperty(doc, 'fullscreenElement', { configurable: true, get: function () { return null; } });
doc.dispatchEvent(new win.Event('fullscreenchange'));
has(!doc.body.classList.contains('is-fullscreen-presentation'),
  'al salir de pantalla completa se retira la clase y el pie');

let fail = 0;
checks.forEach(function (c) { if (!c[1]) { fail++; console.log('FAIL:', c[0]); } });
console.log((checks.length - fail) + '/' + checks.length + ' checks ok (foco por clic, slides 1-9)');
process.exit(fail ? 1 : 0);

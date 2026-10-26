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
load('js/data/validationData.js');
load('js/data/conclusionsData.js');
load('js/data/recomendacionesData.js');
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
load('js/slides/slide10Validation.js');
load('js/slides/slide11Conclusions.js');
load('js/slides/slide12Recomendaciones.js');
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
function goRs6() { tabGo('6. Resultados (1)'); }

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
has(r7f[1].querySelector('img'),
  'el recuadro 2 muestra imagen th.png');
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
   Slide 7 · Fotografía 1: la aplicación web de evaluación integrada (ntp330/0)
   Al pulsarla crece a toda la banda y monta un <iframe> con la app, que
   arranca en su pestaña «Evaluación».
   ================================================================= */

const APP = win.RESULTADOS2.fotos[0];
const APP_DIR = path.join(ROOT, 'ntp330', '0');

has(!!APP.app, 'la Fotografía 1 lleva los datos de la app que aloja');
has(!!APP.app && APP.app.src === 'ntp330/0/index.html',
  'la app apunta al módulo interno ntp330/0/index.html');
has(!!APP.app && fs.existsSync(path.resolve(__dirname, '..', 'presentacion-web', APP.app.src)),
  'esa ruta existe en disco: el <iframe> no dará 404');
has(!!APP.app && fs.existsSync(path.join(APP_DIR, 'index.html')) &&
  !fs.existsSync(path.join(ROOT, 'ntp330', '.git')),
  'la aplicación integrada está presente y pertenece al repositorio único');

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

has(win.SLIDES.length === 12 && win.SLIDES[7].key === 'resultados3',
  'el slide 8 (Resultados 3) está en la lista de láminas');
has(win.SLIDES[8].id === 9 && win.SLIDES[8].key === 'ept',
  'el slide 9 (EPT) está en la lista de láminas como { id: 9, key: ept }');
has(win.SLIDES[8].label === 'P. Transformación',
  'la pestaña del slide 9 se titula "P. Transformación"');
has(win.SLIDES[9].id === 10 && win.SLIDES[9].key === 'validacion' &&
   win.SLIDES[9].label === 'Validación',
  'el slide 10 (Validación) está en la lista de láminas como { id: 10, key: validacion }');
has(win.SLIDES[10].id === 11 && win.SLIDES[10].key === 'conclusiones' &&
   win.SLIDES[10].label === 'Conclusiones',
  'el slide 11 (Conclusiones) está en la lista de láminas como { id: 11, key: conclusiones }');
has(win.SLIDES[11].id === 12 && win.SLIDES[11].key === 'recomendaciones' &&
   win.SLIDES[11].label === 'Recomendaciones',
  'el slide 12 (Recomendaciones) está en la lista de láminas como { id: 12, key: recomendaciones }');
has(win.SLIDES.slice(1).every(function (s) {
  return /^[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ0-9(). ]*$/.test(s.label);
}), 'las pestañas 2-12 van en minúsculas salvo la primera letra (abreviaturas 6-9)');
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
  'assets/MatrizER.png,assets/nd-res.png,assets/barras.png,assets/riesgos-res.png,assets/riesgos-res1.png,assets/art-fin.png',
  'las seis imágenes están en orden; Deficiencia por factor de riesgo usa barras.png');
has(pasos8.every(function (p, i) {
  var exp = [ 'green', 'red', 'green', 'red', 'green', 'red' ][i];
  return p.color === exp;
}), 'los colores se alternan según el orden solicitado');
has(/83 cuestionarios/.test(w3.RESULTADOS3.nota) && /infraestructura/.test(w3.RESULTADOS3.nota),
  'la nota aclara que la muestra es del proyecto de infraestructura');
has(/infraestructura/.test(w3.RESULTADOS3.subtitle) &&
  /toma de decisiones/.test(w3.RESULTADOS3.subtitle),
  'el subtítulo anuncia la prueba piloto y la toma de decisiones');

tabGo('8. Resultados (3)');
has(!!rs3Body(), 'slide 8 (Resultados 3) activo');
has(doc.querySelector('.slide.active h2').textContent === 'Resultados (3)',
  'el título de la lámina es Resultados (3)');
has(rs3Pasos().length === 6, 'seis pasos en la banda superior');
has(rs3Paneles().length === 6, 'seis resultados ampliados prepared en la banda inferior');
has(!rs3Panel('p3').querySelector('.rs3-pn-f') && rs3Paneles().filter(function (panel) {
  return panel.getAttribute('data-panel') !== 'p3';
}).every(function (panel) { return !!panel.querySelector('.rs3-pn-f'); }),
  'solo Deficiencia por factor de riesgo retira la lectura y la fuente inferiores para ampliar barras.png');
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
click(rs3Pasos()[2]);
has(rs3Focus() === 'p3' && gcs(rs3Body().querySelector('.rs3-flow')).display !== 'none' &&
  gcs(rs3Panel('p3').querySelector('.rs3-pn-h')).display === 'none' &&
  gcs(doc.querySelector('.slide.active .slide-head')).display !== 'none' &&
  gcs(doc.querySelector('.slide.active .slide-logo')).display !== 'none',
  'barras.png se abre en la banda inferior con la cabecera, el logo y la secuencia visibles');
key('Escape');
has(rs3Focus() === null && gcs(rs3Body().querySelector('.rs3-flow')).display !== 'none' &&
  gcs(doc.querySelector('.slide.active .slide-head')).display !== 'none' &&
  gcs(doc.querySelector('.slide.active .slide-logo')).display !== 'none' &&
  gcs(idle).display !== 'none',
  'cerrar barras.png devuelve la galería y conserva la cabecera, el logotipo y la secuencia del slide 8');
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
has(slidesAll.length === 12, 'la lámina contiene los doce slides');
var logos = Array.prototype.slice.call(doc.querySelectorAll('#slideFrame .slide .slide-logo'));
has(logos.length === 11, 'los once slides de contenido llevan un .slide-logo (la carátula no)');
has(logos.every(function (l) { return l.getAttribute('src') === 'assets/logo.png'; }),
  'todos los logos apuntan a assets/logo.png');
has(logos.every(function (l) { return l.getAttribute('alt') === 'Logotipo'; }),
  'todos los logos llevan alt="Logotipo"');
has(fs.existsSync(path.join(ROOT, 'assets', 'logo.png')) &&
  fs.existsSync(path.join(ROOT, '..', 'logo1.png')) &&
  fs.readFileSync(path.join(ROOT, 'assets', 'logo.png')).equals(fs.readFileSync(path.join(ROOT, '..', 'logo1.png'))),
  'assets/logo.png es una copia exacta de logo1.png, sin recomprimir ni reducir la resolución');
var logoCss = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
has(/\.slide-logo\s*\{[^}]*position\s*:\s*absolute/.test(logoCss) &&
  /\.slide-logo\s*\{[^}]*width\s*:\s*175px/.test(logoCss) &&
  /\.slide-logo\s*\{[^}]*height\s*:\s*38\.55px/.test(logoCss) &&
  /\.slide-logo\s*\{[^}]*object-fit\s*:\s*contain/.test(logoCss) &&
  /\.slide-logo\s*\{[^}]*object-position\s*:\s*right top/.test(logoCss) &&
  /\.slide\[data-slide="8"\] \.rs-subtitle\s*\{[^}]*margin-top\s*:\s*11px/.test(logoCss),
  'CSS: logo1.png se ajusta proporcionalmente al espacio actual de 175x38,55px, con espacio para el subtítulo del slide 8');
has(/\.slide-logo\s*\{[^}]*right\s*:\s*12px/.test(logoCss),
  'CSS: .slide-logo anclado a la derecha (right:12px)');
has(!/\.slide-cover\s*\.slide-logo\s*\{/.test(logoCss),
  'CSS: la carátula ya no tiene regla .slide-cover .slide-logo');

/* --- la carátula reproduce slide 1 de Ejemplo.pptx ------------------------- */
var coverEl = doc.querySelector('#slideFrame .slide-cover');
has(coverEl !== null, 'la carátula existe como .slide-cover');
has(coverEl.querySelectorAll('.slide-logo').length === 0,
  'la carátula NO lleva el .slide-logo de logo1.png');
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
has(feet.length === 12, 'los doce slides llevan un .slide-foot (pie)');
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
tabGo('9. P. Transformación');
var eptEl = doc.querySelector('#slideFrame .slide-ept');
has(eptEl !== null, 'el slide 9 (EPT) existe como .slide-ept');
has(eptEl.getAttribute('data-slide') === '9', 'data-slide="9" en el slide EPT');
has(eptEl.querySelector('.slide-logo') !== null, 'el slide EPT lleva el .slide-logo (top-right)');
has(eptEl.querySelector('.slide-head h2').textContent === 'Estructura de la propuesta de transformación',
  'el título del slide es "Estructura de la propuesta de transformación" (sin "(EPT)")');
var h2s = Array.prototype.slice.call(doc.querySelectorAll('#slideFrame .slide .slide-head h2'));
has(h2s.length === 11, 'los once slides de contenido (2-12) llevan su título en el encabezado');
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
has(h2s[8].textContent === 'Proceso de validación de la propuesta' &&
   h2s[9].textContent === 'CONCLUSIONES' &&
   h2s[10].textContent === 'RECOMENDACIONES',
  'los títulos de los slides 10, 11 y 12 aparecen en el encabezado');
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
has(/Secuencia de transformación/i.test(logica.querySelector('.ept-band-k').textContent),
  'franja superior rotulada "Secuencia de transformación"');
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

/* --- clic en las etapas: imagen de detalle (assets/pt1..pt4) en primer plano,
      con el ghost de la lámina atenuado detrás; clic fuera vuelve a la vista
      principal. La Etapa 2 despliega el par riesgos1/riesgos2 y la Etapa 3 el
      par pt3+pt4, ambos con un solo clic. ---------------------------------- */
var eptBody = eptEl.querySelector('.ept-body');
function eptFocus() { return eptBody.getAttribute('data-focus'); }
var eptFigs = Array.prototype.slice.call(eptBody.querySelectorAll('.ept-fig'));
has(etapas.every(function (e) {
  return !!e.getAttribute('data-focus') && e.getAttribute('role') === 'button' && e.getAttribute('tabindex') === '0';
}), 'las tarjetas de etapa son accionables (data-focus + role + tabindex)');
has(etapas.map(function (e) { return e.getAttribute('data-focus'); }).join(',') === '1,2,3',
  'data-focus de las etapas: Etapa 1 -> 1, Etapa 2 -> 2, Etapa 3 -> 3');
has(eptFigs.length === 7, 'siete figuras de detalle en el cuerpo EPT (3 sencillas + dos pares)');
has(eptFigs.map(function (f) { return f.getAttribute('data-focus'); }).join(',') === '1,2img,2img,2img,3,3,rs',
  'pt1 cierra sola; pt2 abre el par de riesgos (2img); la Etapa 3 abre su par pt3+pt4 (3); el resultado esperado (rs) lleva pt5');
has(/assets\/pt1\.png/.test(eptBody.innerHTML) && /assets\/pt2\.png/.test(eptBody.innerHTML) &&
  /assets\/pt3\.png/.test(eptBody.innerHTML) && /assets\/pt4\.png/.test(eptBody.innerHTML) &&
  /assets\/pt5\.png/.test(eptBody.innerHTML),
  'las cinco imágenes de detalle apuntan a assets/ptN.png');
has(/assets\/riesgos1\.png/.test(eptBody.innerHTML) && /assets\/riesgos2\.png/.test(eptBody.innerHTML),
  'el segundo nivel de la Etapa 2 apunta a assets/riesgos1.png y assets/riesgos2.png');
has(eptFigs.every(function (f) { return !!f.querySelector('img'); }), 'cada figura de detalle contiene su imagen');
has(eptBody.querySelectorAll('.ept-pair').length === 2 &&
  eptBody.querySelectorAll('.ept-pair .ept-fig').length === 4,
  'la Etapa 2 y la Etapa 3 colocan sendos pares de figuras en .ept-pair (riesgos y pt3+pt4)');

click(etapas[0]);
has(eptFocus() === '1' && /ept-body--f1/.test(eptBody.className),
  'clic en Etapa 1 -> data-focus=1 y clase ept-body--f1');
has(gcs(eptBody.querySelector('.ept-img--1')).visibility === 'visible', 'Etapa 1: el detalle pt1 se muestra en primer plano');
has(gcs(eptBody.querySelector('.ept-img--2')).visibility === 'hidden', 'Etapa 1: el resto de detalles permanece oculto');
has(!!doc.querySelector('.slide.active .scope-ghost.is-on'), 'ghost: la lámina EPT queda atenuada detrás del detalle');
click(eptBody.querySelector('.ept-img--1 .ept-fig'));
has(eptFocus() === null, 'clic sobre la imagen pt1 -> pantalla principal');
has(gcs(eptBody.querySelector('.ept-img--1')).visibility === 'hidden', 'al cerrar, el detalle pt1 vuelve a ocultarse');

click(etapas[1]);
has(eptFocus() === '2' && /ept-body--f2/.test(eptBody.className), 'clic en Etapa 2 -> data-focus=2');
has(gcs(eptBody.querySelector('.ept-img--2')).visibility === 'visible', 'Etapa 2: el detalle pt2 se muestra');
has(gcs(eptBody.querySelector('.ept-img--2b')).visibility === 'hidden', 'Etapa 2: el par de riesgos aún no se muestra');
click(eptBody.querySelector('.ept-img--2 .ept-fig'));
has(eptFocus() === '2img' && /ept-body--f2img/.test(eptBody.className),
  'clic sobre la imagen pt2 -> segundo nivel (2img) con el par de riesgos');
has(gcs(eptBody.querySelector('.ept-img--2')).visibility === 'hidden' &&
  gcs(eptBody.querySelector('.ept-img--2b')).visibility === 'visible',
  'segundo nivel: pt2 pasa atrás y se despliegan riesgos1 y riesgos2 en paralelo');
has(!!doc.querySelector('.slide.active .scope-ghost.is-on'), 'ghost: atenuado también en el nivel 2 de la Etapa 2');
click(eptBody.querySelector('.ept-img--2b .ept-fig'));
has(eptFocus() === null && gcs(eptBody.querySelector('.ept-img--2b')).visibility === 'hidden',
  'clic fuera de las imágenes de riesgos -> pantalla principal');

click(etapas[2]);
has(eptFocus() === '3' && /ept-body--f3/.test(eptBody.className), 'clic en Etapa 3 -> data-focus=3');
has(gcs(eptBody.querySelector('.ept-img--3')).visibility === 'visible',
  'Etapa 3: un solo clic despliega el par pt3 + pt4 en paralelo');
has(eptBody.querySelector('.ept-img--3').querySelectorAll('.ept-fig').length === 2,
  'Etapa 3: el par contiene las dos imágenes (pt3 y pt4) a la vez');
has(!!doc.querySelector('.slide.active .scope-ghost.is-on'), 'ghost: atenuado también con el par de la Etapa 3');
click(eptBody.querySelector('.ept-img--3 .ept-fig'));
has(eptFocus() === null && gcs(eptBody.querySelector('.ept-img--3')).visibility === 'hidden',
  'clic sobre una imagen de la Etapa 3 -> pantalla principal');

/* --- clic en el resultado esperado: despliega assets/pt5.png ----------------- */
var resultSec = eptEl.querySelector('.ept-result');
has(!!resultSec && resultSec.getAttribute('data-focus') === 'rs' &&
  resultSec.getAttribute('role') === 'button' && resultSec.getAttribute('tabindex') === '0',
  'el bloque Resultado esperado es accionable (data-focus=rs + role + tabindex)');
click(resultSec);
has(eptFocus() === 'rs' && /ept-body--frs/.test(eptBody.className),
  'clic en Resultado esperado -> data-focus=rs y clase ept-body--frs');
has(gcs(eptBody.querySelector('.ept-img--5')).visibility === 'visible',
  'Resultado esperado: se despliega el detalle pt5');
has(gcs(eptBody.querySelector('.ept-img--1')).visibility === 'hidden',
  'Resultado esperado: el resto de detalles permanece oculto');
has(!!doc.querySelector('.slide.active .scope-ghost.is-on'),
  'ghost: la lámina EPT queda atenuada detrás del detalle pt5');
click(eptBody.querySelector('.ept-img--5 .ept-fig'));
has(eptFocus() === null && gcs(eptBody.querySelector('.ept-img--5')).visibility === 'hidden',
  'clic sobre la imagen pt5 -> pantalla principal');
click(resultSec);
has(eptFocus() === 'rs', 'Resultado esperado abierto de nuevo para probar ESC');
key('Escape');
has(eptFocus() === null, 'ESC con pt5 abierto -> pantalla principal');
resultSec.focus();
has(key('Enter'), 'Enter sobre Resultado esperado -> default evitado');
has(eptFocus() === 'rs', 'Enter sobre Resultado esperado -> abre el detalle pt5');
key('Escape');
has(eptFocus() === null, 'ESC tras Enter sobre Resultado esperado -> pantalla principal');

click(etapas[2]);
has(eptFocus() === '3', 'desde principal, Etapa 3 abre su par pt3 + pt4');
key('Escape');
has(eptFocus() === null, 'ESC con el par de la Etapa 3 abierto -> pantalla principal');

click(etapas[2]);
key('Escape');
has(eptFocus() === null, 'ESC con pt3 abierto -> pantalla principal');

click(etapas[0]);
has(eptFocus() === '1', 'Etapa 1 abierta para probar el clic fuera de la imagen');
click(eptEl.querySelector('.slide-head h2'));
has(eptFocus() === null, 'clic fuera de la imagen (sobre la cabecera) -> pantalla principal');

etapas[0].focus();
has(doc.activeElement === etapas[0], 'la tarjeta Etapa 1 recibe el foco del teclado');
has(key('Enter'), 'Enter sobre la tarjeta Etapa 1 -> default evitado');
has(eptFocus() === '1', 'Enter sobre la tarjeta Etapa 1 -> abre su detalle');
key('Escape');
has(eptFocus() === null, 'ESC -> pantalla principal');
var eptFig1 = eptBody.querySelector('.ept-img--1 .ept-fig');
eptFig1.focus();
has(key('Enter'), 'Enter sobre la imagen pt1 -> default evitado');
has(eptFocus() === '1', 'Enter sobre la imagen pt1 -> abre el detalle');
key('Escape');
has(eptFocus() === null, 'ESC -> pantalla principal');

/* CSS y motor: overlays, aparición sencilla y registro del scope en app.js. */
has(/\.ept-body\s*\{[^}]*position:\s*relative/.test(logoCss),
  'CSS: ept-body relativo como ancla de los detalles');
has(/\.ept-img\s*\{[^}]*position:\s*absolute[\s\S]{0,140}z-index:\s*3/.test(logoCss),
  'CSS: el detalle va en primer plano sobre el ghost (absolute, z-index 3)');
has(/\.ept-img\s*\{[^}]*background:\s*rgba\(240, 240, 242, 0\.72\)/.test(logoCss),
  'CSS: el panel del detalle es translúcido para ver la lámina atenuada');
has(/\.ept-img\s*\{[^}]*opacity:\s*0;[\s\S]{0,160}visibility:\s*hidden/.test(logoCss),
  'CSS: el detalle nace oculto (opacity 0 + visibility hidden)');
has(/\.ept-fig\s*\{[^}]*transform:\s*scale\(0\.5\);[\s\S]{0,160}opacity:\s*0/.test(logoCss),
  'CSS: la imagen parte pequeña (escala 0.5) y transparente');
has(/\.ept-body--f1 \.ept-img--1[\s\S]{0,220}visibility:\s*visible/.test(logoCss) &&
  /\.ept-body--f2 \.ept-img--2[\s\S]{0,220}visibility:\s*visible/.test(logoCss) &&
  /\.ept-body--f2img \.ept-img--2b[\s\S]{0,220}visibility:\s*visible/.test(logoCss) &&
  /\.ept-body--f3 \.ept-img--3[\s\S]{0,220}visibility:\s*visible/.test(logoCss) &&
  /\.ept-body--frs \.ept-img--5[\s\S]{0,220}visibility:\s*visible/.test(logoCss),
  'CSS: cada estado de foco muestra su detalle (f1 -> pt1, f2 -> pt2, f2img -> par de riesgos, f3 -> par pt3+pt4, frs -> pt5)');
has(!/f3img/.test(logoCss) && !/ept-img--4/.test(logoCss),
  'CSS: retirado el segundo nivel de la Etapa 3 (f3img / .ept-img--4)');
has(/\.ept-pair\s*\{[^}]*flex-direction:\s*row/.test(logoCss) &&
  /\.ept-pair \.ept-fig\s*\{[^}]*flex:\s*1\s*1\s*50%/.test(logoCss),
  'CSS: .ept-pair reparte las dos imágenes al 50% en fila (una al lado de otra)');
has(/\.ept-body--f1 \.ept-img--1 \.ept-fig[\s\S]{0,360}transform:\s*scale\(1\)/.test(logoCss),
  'CSS: al abrir, la imagen se proyecta de menos a más (escala .5 -> 1)');
has(/transition: opacity 0\.28s ease, visibility 0s linear 0\.28s/.test(logoCss),
  'CSS: al cerrar, la visibilidad se retrasa para ver la salida (de más a menos)');
has(!/ept-rotate/.test(logoCss), 'CSS: eliminado el giro de 360° (ept-rotate): efecto más sencillo');
has(/sel: 'ept-body'[\s\S]{0,80}keys: \['1', '2', '2img', '3', 'rs'\]/.test(appJs),
  'app.js: FOCUS_SCOPES registra ept-body con los focos 1, 2, 2img, 3 y rs');
has(/'ept-body': \{ nodes: \['\.ept-logica', '\.ept-central', '\.ept-result', '\.ept-rc'\]/.test(appJs),
  'app.js: GHOST_CFG atenda las cuatro franjas del EPT (lógica, central, resultado, recursos)');

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

/* ======================= DIAPOSITIVA 10 · VALIDACIÓN ======================= */
tabGo('10. Validación');
var vl = doc.querySelector('#slideFrame .slide.active');
has(!!vl && vl.classList.contains('slide-validacion'),
  'slide 10: se renderiza .slide-validacion como décima diapositiva');
has(/Proceso de validación de la propuesta/i.test(vl.querySelector('.slide-head h2').textContent),
  'slide 10: el encabezado titula «Proceso de validación de la propuesta»');
has(/Método Delphi/i.test(vl.querySelector('.vl-subtitle').textContent) &&
   /resultados globales/i.test(vl.querySelector('.vl-subtitle').textContent),
  'slide 10: el subtítulo sitúa el Método Delphi y los resultados globales');
has(!!vl.querySelector('.slide-logo') && !!vl.querySelector('.slide-foot'),
  'slide 10: la lámina lleva logotipo y pie institucional');

/* núcleo central */
var vlCore = vl.querySelector('.vl-core');
has(!!vlCore, 'slide 10: el mapa tiene nodo central .vl-core');
has(/Validación/i.test(vlCore.textContent) && /de la propuesta/i.test(vlCore.textContent),
  'slide 10: el núcleo rotula «Validación de la propuesta»');
has(/Método Delphi/i.test(vlCore.textContent) && /3 rondas/i.test(vlCore.textContent) &&
   /8 expertos/i.test(vlCore.textContent),
  'slide 10: el núcleo describe el método (Delphi · 3 rondas · 8 expertos)');

/* panel de expertos (rama izquierda, mismo formato que Ronda 2) */
var vlPanel = vl.querySelector('.vl-panel');
has(!!vlPanel && /Panel de expertos/i.test(vlPanel.textContent) && /8 expertos/i.test(vlPanel.textContent),
  'slide 10: a la izquierda, el panel titulado "Panel de expertos" con 8 expertos');
has(!!vlPanel && !!vlPanel.querySelector('.vl-r-head .vl-r-ico') &&
   !!vlPanel.querySelector('.vl-r-head .vl-r-num'),
  'slide 10: el panel reutiliza el encabezado de ronda (icono + título)');
has(vlPanel.querySelectorAll('.vl-r-props .vl-r-prop').length === 5,
  'slide 10: el panel lista las cinco áreas de conocimiento como píldoras');
has(/Consulta estructurada/i.test(vlPanel.querySelector('.vl-r-dic').textContent) &&
   /Consenso progresivo/i.test(vlPanel.querySelector('.vl-r-dic').textContent),
  'slide 10: el panel cierra con el chip de apoyo aplicado');
has(/\.vl-panel\s*\{[^}]*grid-area:\s*panel/.test(logoCss) &&
   /\.vl-panel\s*\{[^}]*border:\s*1px solid var\(--vl-rojo\)/.test(logoCss) &&
   /\.vl-panel \.vl-r-ico\s*\{[^}]*background:\s*var\(--vl-rojo\)/.test(logoCss),
  'CSS: el panel adopta el formato de ronda conservando su rojo (fondo rojo claro, borde e icono rojos)');

/* tres rondas clicables */
var vlRounds = Array.prototype.slice.call(vl.querySelectorAll('.vl-round'));
has(vlRounds.length === 3, 'slide 10: el mapa contiene tres rondas (r1, r2, r3)');
has(vlRounds.every(function (r) {
  return r.getAttribute('data-focus') && r.getAttribute('role') === 'button' &&
    r.getAttribute('tabindex') === '0';
}), 'slide 10: las tres rondas son accionables (data-focus + role + tabindex)');
has(vl.querySelector('.vl-round[data-focus="r1"]').classList.contains('vl-round--green') &&
   vl.querySelector('.vl-round[data-focus="r2"]').classList.contains('vl-round--red') &&
   vl.querySelector('.vl-round[data-focus="r3"]').classList.contains('vl-round--green'),
  'slide 10: alternancia verde/rojo/verde de las rondas');
has(/Ronda 1/i.test(vl.querySelector('.vl-round[data-focus="r1"]').textContent) &&
   /Aceptación inicial/i.test(vl.querySelector('.vl-round[data-focus="r1"]').textContent),
  'slide 10: ronda 1 «Aceptación inicial»');
has(/Ronda 2/i.test(vl.querySelector('.vl-round[data-focus="r2"]').textContent) &&
   /Evaluación técnica/i.test(vl.querySelector('.vl-round[data-focus="r2"]').textContent),
  'slide 10: ronda 2 «Evaluación técnica»');
has(/Ronda 3/i.test(vl.querySelector('.vl-round[data-focus="r3"]').textContent) &&
   /Consenso final/i.test(vl.querySelector('.vl-round[data-focus="r3"]').textContent),
  'slide 10: ronda 3 «Consenso final»');
has(vl.querySelectorAll('.vl-round[data-focus="r1"] .vl-r-prop').length === 6 &&
   vl.querySelectorAll('.vl-round[data-focus="r2"] .vl-r-prop').length === 7 &&
   vl.querySelectorAll('.vl-round[data-focus="r3"] .vl-r-prop').length === 3,
  'slide 10: cada ronda lista su propósito (6, 7 y 3 puntos)');
has(/99,46/.test(vl.querySelector('.vl-round[data-focus="r1"]').textContent) &&
    vl.querySelector('.vl-round[data-focus="r1"] .vl-r-res-i:last-child').textContent ===
      '183 Sí de 184 valoraciones (23 ítems evaluados)',
  'slide 10: Ronda 1 indica 183 Sí de 184 valoraciones (23 ítems evaluados) junto al consenso de 99,46 %');
has(/4,958/.test(vl.querySelector('.vl-round[data-focus="r2"]').textContent) &&
   /4,04/.test(vl.querySelector('.vl-round[data-focus="r2"]').textContent),
  'slide 10: la ronda 2 declara media 4,958 y CV 4,04 %');
has(/2,973/.test(vl.querySelector('.vl-round[data-focus="r3"]').textContent) &&
   /97,32/.test(vl.querySelector('.vl-round[data-focus="r3"]').textContent),
  'slide 10: la ronda 3 declara media 2,973 y 97,32 % de acuerdo');
has(vl.querySelectorAll('.vl-round .vl-r-dic').length === 3,
  'slide 10: las tres rondas muestran su dictamen');

/* banda de síntesis */
var vlSynth = vl.querySelector('.vl-synth');
has(!!vlSynth && vlSynth.getAttribute('data-focus') === 'rn' &&
   vlSynth.getAttribute('role') === 'button',
  'slide 10: la banda de síntesis es accionable (data-focus rn)');
has(vl.querySelectorAll('.vl-syn-node').length === 3,
  'slide 10: la síntesis encadena tres etapas (aceptación → evaluación → consenso)');
has(vl.querySelectorAll('.vl-cap').length === 3,
  'slide 10: la síntesis muestra las tres cápsulas (inicial, intermedia, final)');
has(/Respaldo académico/i.test(vlSynth.textContent) &&
   /validada en su versión final/i.test(vlSynth.textContent),
  'slide 10: la síntesis concluye con la validación por triangulación');

/* modales */
has(vl.querySelectorAll('.vl-modal').length === 4,
  'slide 10: cuatro modales (r1, r2, r3 y síntesis)');
has(vl.querySelectorAll('.vl-modal--r1 .vl-card, .vl-modal--r2 .vl-card, ' +
   '.vl-modal--r3 .vl-card, .vl-modal--rn .vl-card').length === 4,
  'slide 10: cada modal contiene su tarjeta .vl-card');
has(vl.querySelectorAll('.vl-modal--r1 .vl-table tr').length === 7 &&
   vl.querySelectorAll('.vl-modal--r2 .vl-table tr').length === 9 &&
   vl.querySelectorAll('.vl-modal--r3 .vl-table tr').length === 13,
  'slide 10: las tablas de ronda detallan sus indicadores');
has(vl.querySelectorAll('.vl-modal--rn .vl-table--comp thead th').length === 5,
  'slide 10: la tabla comparativa de la síntesis tiene cinco columnas');
has(vl.querySelectorAll('.vl-card-x').length === 4,
  'slide 10: cada tarjeta lleva su botón de cierre');

/* interacción: los modales sólo aparecen con su foco */
var vlBody = vl.querySelector('.vl-body');
has(gcs(vl.querySelector('.vl-modal--r1')).visibility === 'hidden',
  'slide 10: los modales nacen ocultos (visibility hidden)');
click(vl.querySelector('.vl-round[data-focus="r1"]'));
has(vlBody.getAttribute('data-focus') === 'r1' && vlBody.classList.contains('vl-body--fr1'),
  'slide 10: al pulsar la ronda 1 se abre su foco (vl-body--fr1)');
has(gcs(vl.querySelector('.vl-modal--r1')).visibility === 'visible',
  'slide 10: el modal de la ronda 1 se hace visible');
has(gcs(vl.querySelector('.vl-modal--r2')).visibility === 'hidden',
  'slide 10: los modales de las otras rondas siguen ocultos');
has(!!vl.querySelector('.scope-ghost.is-on'),
  'slide 10: la sombra de la lámina (ghost) se activa al enfocar');
click(vl.querySelector('.vl-modal--r1 .vl-table td'));
has(vlBody.getAttribute('data-focus') === 'r1',
  'slide 10: un clic dentro de la tarjeta no cierra el modal');
click(vl.querySelector('.vl-modal--r1 .vl-card-x'));
has(!vlBody.getAttribute('data-focus') && gcs(vl.querySelector('.vl-modal--r1')).visibility === 'hidden',
  'slide 10: el botón de cierre cierra el modal');
click(vl.querySelector('.vl-round[data-focus="r1"]'));
has(vlBody.getAttribute('data-focus') === 'r1', 'slide 10: se reabre la ronda 1');
key('Escape');
has(!vlBody.getAttribute('data-focus'), 'slide 10: Escape cierra el foco abierto');
click(vl.querySelector('.vl-round[data-focus="r2"]'));
has(vlBody.classList.contains('vl-body--fr2') &&
   gcs(vl.querySelector('.vl-modal--r2')).visibility === 'visible' &&
   gcs(vl.querySelector('.vl-modal--r1')).visibility === 'hidden',
  'slide 10: al abrir la ronda 2 se cierra la 1 (foco único)');
click(vl.querySelector('.vl-modal--r2'));
has(!vlBody.getAttribute('data-focus'),
  'slide 10: un clic en el fondo del modal cierra el foco');
vl.querySelector('.vl-round[data-focus="r3"]').focus();
key('Enter');
has(vlBody.classList.contains('vl-body--fr3'),
  'slide 10: la ronda 3 también se abre con el teclado (Enter)');
click(vl.querySelector('.vl-round[data-focus="r3"]'));

/* CSS propio */
has(/\.slide-validacion \.slide-head\s*\{\s*height:\s*92px/.test(logoCss),
  'CSS: cabecera propia del slide de validación (subtítulo de hasta dos líneas)');
has(/\.vl-body--fr1 \.vl-modal--r1[\s\S]{0,220}visibility:\s*visible/.test(logoCss) &&
   /\.vl-body--fr2 \.vl-modal--r2[\s\S]{0,220}visibility:\s*visible/.test(logoCss) &&
   /\.vl-body--fr3 \.vl-modal--r3[\s\S]{0,220}visibility:\s*visible/.test(logoCss) &&
   /\.vl-body--frn \.vl-modal--rn[\s\S]{0,220}visibility:\s*visible/.test(logoCss),
  'CSS: cada estado de foco muestra su modal (fr1/fr2/fr3/frn)');
has(/\.vl-body--fr1 \.vl-modal--r1 \.vl-card[\s\S]{0,220}transform:\s*scale\(1\)/.test(logoCss),
  'CSS: al abrir, la tarjeta crece de .86 a 1');
has(/\.vl-modal\s*\{[^}]*opacity:\s*0;[\s\S]{0,120}visibility:\s*hidden/.test(logoCss),
  'CSS: el modal nace oculto (opacity 0 + visibility hidden)');
has(/sel: 'vl-body'[\s\S]{0,80}keys: \['r1', 'r2', 'r3', 'rn'\]/.test(appJs),
  'app.js: FOCUS_SCOPES registra vl-body con los focos r1, r2, r3 y rn');
has(/'vl-body': \{ nodes: \['\.vl-map', '\.vl-synth'\]/.test(appJs),
  'app.js: GHOST_CFG atenda el mapa y la banda de síntesis');
has(/\.vl-body\s*\{[^}]*flex:\s*1/.test(logoCss),
  'CSS: la lámina de validación usa el cuerpo flex:1 común para absorger el pie');
has(/\.vl-body\s*\{[^}]*justify-content:\s*center/.test(logoCss),
  'CSS: el cuerpo del slide 10 centra verticalmente el conjunto en la lámina');
has(/\.vl-map\s*\{[^}]*flex:\s*0\s*0\s*auto/.test(logoCss),
  'CSS: el mapa de validación no se estira (altura natural) y el conjunto queda centrado');

var slideBefore = doc.querySelector('#slideFrame .slide.active');
var victim = slideBefore ? slideBefore.children[0] : null;
var bodyEl = slideBefore ? slideBefore.querySelector('.cover-body, .problem-body, .md-body, .rs-body, .rs2-body, .rs3-body, .ept-body, .vl-body') : null;
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
var fsHeader = doc.querySelector('.app-header');
var fsTabs = Array.prototype.slice.call(doc.querySelectorAll('#tabs .tab'));
has(gcs(fsHeader).display === 'flex' && fsTabs.length === 12,
  'pantalla completa: la navegación con las doce diapositivas permanece visible');
has(fsTabs.every(function (tab, i) {
  click(tab);
  return doc.body.classList.contains('is-fullscreen-presentation') &&
    gcs(fsHeader).display === 'flex' && tab.classList.contains('active') &&
    doc.querySelector('#slideFrame').children[i].classList.contains('active') &&
    doc.getElementById('counter').textContent === (i + 1) + ' / 12';
}), 'pantalla completa: las doce pestañas cambian de slide manteniendo visible la navegación');
click(fsTabs[9]);
var fsExitCalls = 0;
var previousExitFullscreen = doc.exitFullscreen;
doc.exitFullscreen = function () {
  fsExitCalls++;
  fakeFs = null;
  doc.dispatchEvent(new win.Event('fullscreenchange'));
  return Promise.resolve();
};
click(doc.getElementById('btnFullscreen'));
doc.exitFullscreen = previousExitFullscreen;
delete doc.fullscreenElement;
Object.defineProperty(doc, 'fullscreenElement', { configurable: true, get: function () { return null; } });
has(fsExitCalls === 1 && !doc.body.classList.contains('is-fullscreen-presentation') &&
  gcs(fsHeader).display === 'flex',
  'el botón visible permite salir de pantalla completa y conserva la navegación');

var fsStage = doc.getElementById('stage');
var fsWrap = doc.getElementById('scaleWrap');
var previousStagePadding = fsStage.style.padding;
Object.defineProperty(fsStage, 'clientWidth', { configurable: true, value: 1920 });
Object.defineProperty(fsStage, 'clientHeight', { configurable: true, value: 1000 });
fsStage.style.padding = '20px 30px';
win.dispatchEvent(new win.Event('resize'));
has(Math.abs(parseFloat(fsWrap.style.width) - 1860) < .01 && parseFloat(fsWrap.style.height) <= 960,
  'la escala normal aprovecha el ancho útil y respeta los márgenes del escenario');
click(doc.getElementById('btnFullscreen'));
has(doc.body.classList.contains('is-fullscreen-presentation') && gcs(fsHeader).display === 'flex' &&
  !!doc.querySelector('#btnFullscreen .i-compress'),
  'sin API nativa, el modo ampliado mantiene la navegación y ofrece el botón de salida');
has(Math.abs(parseFloat(fsWrap.style.height) - 960) < .01 && parseFloat(fsWrap.style.width) <= 1860,
  'la escala de pantalla completa respeta el espacio útil bajo la navegación y los márgenes');
click(doc.getElementById('btnFullscreen'));
has(!doc.body.classList.contains('is-fullscreen-presentation') && gcs(fsHeader).display === 'flex' &&
  !!doc.querySelector('#btnFullscreen .i-expand'),
  'el botón también cierra el modo ampliado sin API nativa');
delete fsStage.clientWidth;
delete fsStage.clientHeight;
fsStage.style.padding = previousStagePadding;
win.dispatchEvent(new win.Event('resize'));

/* ======================= DIAPOSITIVA 11 · CONCLUSIONES ===================== */
tabGo('11. Conclusiones');

var cn = doc.querySelector('#slideFrame .slide.active');
has(!!cn && cn.classList.contains('slide-conclusiones'),
  'slide 11: se renderiza .slide-conclusiones como undécima diapositiva');
has(/CONCLUSIONES/i.test(cn.querySelector('.slide-head h2').textContent),
  'slide 11: el encabezado titula «CONCLUSIONES»');
has(/Síntesis de hallazgos/i.test(cn.querySelector('.cn-subtitle').textContent) &&
   /aporte de la estrategia metodológica/i.test(cn.querySelector('.cn-subtitle').textContent),
  'slide 11: el subtítulo sintetiza hallazgos, validación y aporte');
has(!!cn.querySelector('.slide-logo') && !!cn.querySelector('.slide-foot'),
  'slide 11: la lámina lleva logotipo y pie institucional');

/* seis bloques encadenados clicables (primer clic -> bloque agrandado zbN) */
var cnCards = Array.prototype.slice.call(cn.querySelectorAll('.cn-flow .cn-card'));
has(cnCards.length === 6, 'slide 11: el diagrama tiene seis bloques');
has(cnCards.every(function (c) {
  return /^zb[1-6]$/.test(c.getAttribute('data-focus') || '') &&
    c.getAttribute('role') === 'button' && c.getAttribute('tabindex') === '0';
}), 'slide 11: los seis bloques son accionables (data-focus zbN + role + tabindex)');
has(cnCards.map(function (c) { return c.getAttribute('data-focus'); }).join(',') === 'zb1,zb2,zb3,zb4,zb5,zb6',
  'slide 11: los bloques van etiquetados zb1..zb6 en orden');
has(cn.querySelector('.cn-card[data-focus="zb1"]').classList.contains('cn-card--green') &&
   cn.querySelector('.cn-card[data-focus="zb2"]').classList.contains('cn-card--red') &&
   cn.querySelector('.cn-card[data-focus="zb3"]').classList.contains('cn-card--green') &&
   cn.querySelector('.cn-card[data-focus="zb4"]').classList.contains('cn-card--red') &&
   cn.querySelector('.cn-card[data-focus="zb5"]').classList.contains('cn-card--green') &&
   cn.querySelector('.cn-card[data-focus="zb6"]').classList.contains('cn-card--red'),
  'slide 11: los bloques alternan verde/rojo y el bloque 6 va en rojo');
has(/SISTEMATIZACIÓN/i.test(cn.querySelector('.cn-card[data-focus="zb1"]').textContent) &&
   /DIAGNÓSTICO/i.test(cn.querySelector('.cn-card[data-focus="zb2"]').textContent) &&
   /ESTRATEGIA/i.test(cn.querySelector('.cn-card[data-focus="zb3"]').textContent) &&
   /APLICACIÓN PILOTO/i.test(cn.querySelector('.cn-card[data-focus="zb4"]').textContent) &&
   /RESULTADOS CRÍTICOS/i.test(cn.querySelector('.cn-card[data-focus="zb5"]').textContent) &&
   /CONFIRMACIÓN/i.test(cn.querySelector('.cn-card[data-focus="zb6"]').textContent),
  'slide 11: cada bloque lleva su rótulo (1..6)');
has(cn.querySelectorAll('.cn-flow .cn-arrow').length === 5,
  'slide 11: cinco flechas horizontales encadenan 1→2→3→4→5→6');
has(cn.querySelectorAll('.cn-links path').length === 6,
  'slide 11: seis conectores radiales van de las tarjetas al nodo central');

/* copias agrandadas: segundo clic abre la conclusión (foco bN) */
has(cn.querySelectorAll('.cn-body > .cn-zoom').length === 6,
  'slide 11: cada bloque tiene su copia agrandada (.cn-zoom)');
has(Array.prototype.map.call(cn.querySelectorAll('.cn-zoom'), function (z) {
  return z.getAttribute('data-focus');
}).join(',') === 'b1,b2,b3,b4,b5,b6',
  'slide 11: las copias agrandadas llevan el foco b1..b6 (abren la conclusión)');
has(Array.prototype.every.call(cn.querySelectorAll('.cn-zoom'), function (z) {
  return z.getAttribute('role') === 'button' && z.getAttribute('tabindex') === '0' &&
    !!z.querySelector('.cn-zoom-card');
}), 'slide 11: las copias agrandadas son accionables y clonan la tarjeta');

/* contenido clave por bloque */
has(cn.querySelectorAll('.cn-card[data-focus="zb4"] .cn-stat').length === 3 &&
   /189/.test(cn.querySelector('.cn-card[data-focus="zb4"]').textContent) &&
   /106/.test(cn.querySelector('.cn-card[data-focus="zb4"]').textContent) &&
   /83/.test(cn.querySelector('.cn-card[data-focus="zb4"]').textContent),
  'slide 11: el bloque 4 destaca 189 / 106 / 83');
has(cn.querySelectorAll('.cn-card[data-focus="zb5"] .cn-mini').length === 2 &&
   /RIESGOS CRÍTICOS/i.test(cn.querySelector('.cn-card[data-focus="zb5"]').textContent) &&
   /VALIDACIÓN DELPHI/i.test(cn.querySelector('.cn-card[data-focus="zb5"]').textContent) &&
   /3733/.test(cn.querySelector('.cn-card[data-focus="zb5"]').textContent) &&
   /2691/.test(cn.querySelector('.cn-card[data-focus="zb5"]').textContent),
  'slide 11: el bloque 5 se divide en riesgos críticos (3733/2691) y validación Delphi');
has(cn.querySelectorAll('.cn-card[data-focus="zb6"] .cn-checks li').length === 6 &&
   /Se confirma la hipótesis/i.test(cn.querySelector('.cn-card[data-focus="zb6"]').textContent),
  'slide 11: el bloque 6 cierra con las seis confirmaciones');

/* nodo central y aporte */
has(/CONCLUSIONES/i.test(cn.querySelector('.cn-node').textContent),
  'slide 11: el nodo central inferior se rotula «CONCLUSIONES»');
has(/APORTE CENTRAL/i.test(cn.querySelector('.cn-aporte').textContent) &&
   /Prevención como componente estructural de la dirección de proyectos/i.test(cn.querySelector('.cn-aporte').textContent),
  'slide 11: la franja inferior destaca el aporte central');

/* un panel por bloque con la conclusión textual del docx */
has(cn.querySelectorAll('.cn-modal').length === 6 && cn.querySelectorAll('.cn-dialog').length === 6,
  'slide 11: cada bloque tiene su panel de conclusión');
has(/sistematización teórica referencial/i.test(cn.querySelector('.cn-dialog--green').textContent) &&
   /componente estructural de la dirección de proyectos/i.test(cn.querySelector('.cn-modal--b6 .cn-dialog').textContent),
  'slide 11: las conclusiones transcriben CONCLUSIONES.docx (bloques 1 y 6)');

/* interacción en dos pasos: 1er clic agranda el bloque (zbN), 2º abre la conclusión (bN) */
var cnBody = cn.querySelector('.cn-body');
var cnZoom1 = cn.querySelector('.cn-zoom--b1');
click(cn.querySelector('.cn-card[data-focus="zb1"]'));
has(cnBody.getAttribute('data-focus') === 'zb1' && /cn-body--fzb1/.test(cnBody.className),
  'slide 11: primer clic en el bloque 1 -> foco zb1 (bloque agrandado)');
has(gcs(cnZoom1).visibility === 'visible',
  'slide 11: el bloque 1 se muestra agrandado y centrado');
has(gcs(cn.querySelector('.cn-modal--b1')).visibility === 'hidden',
  'slide 11: la conclusión no se abre todavía con el primer clic');
has(!!doc.querySelector('.slide.active .scope-ghost.is-on'),
  'ghost: la lámina de conclusiones queda atenuada tras el bloque agrandado');
click(cnZoom1.querySelector('.cn-zoom-card'));
has(cnBody.getAttribute('data-focus') === 'b1' && /cn-body--fb1/.test(cnBody.className) &&
   gcs(cn.querySelector('.cn-modal--b1')).visibility === 'visible',
  'slide 11: segundo clic -> se abre la conclusión del bloque 1');
has(gcs(cnZoom1).visibility === 'hidden',
  'slide 11: al abrir la conclusión se retira el bloque agrandado');
click(cn.querySelector('.cn-modal--b1 .cn-dialog-x'));
has(cnBody.getAttribute('data-focus') === 'zb1' && gcs(cn.querySelector('.cn-modal--b1')).visibility === 'hidden',
  'slide 11: cerrar la conclusión vuelve al bloque agrandado');
key('Escape');
has(!cnBody.getAttribute('data-focus'),
  'slide 11: Escape desde el bloque agrandado cierra el foco');
click(cn.querySelector('.cn-card[data-focus="zb3"]'));
click(cn.querySelector('.cn-zoom--b3 .cn-zoom-card'));
has(/cn-body--fb3/.test(cnBody.className) &&
   gcs(cn.querySelector('.cn-modal--b3')).visibility === 'visible' &&
   gcs(cn.querySelector('.cn-modal--b1')).visibility === 'hidden',
  'slide 11: al abrir otro bloque se cierra el anterior (foco único)');
click(cn.querySelector('.cn-modal--b3'));
has(cnBody.getAttribute('data-focus') === 'zb3',
  'slide 11: un clic en el fondo de la conclusión vuelve al bloque agrandado');
key('Escape');
has(!cnBody.getAttribute('data-focus'), 'slide 11: Escape cierra el bloque agrandado');
cn.querySelector('.cn-card[data-focus="zb6"]').focus();
key('Enter');
has(/cn-body--fzb6/.test(cnBody.className), 'slide 11: el bloque 6 se agranda con Enter');
cn.querySelector('.cn-zoom--b6').focus();
key('Enter');
has(/cn-body--fb6/.test(cnBody.className), 'slide 11: la copia agrandada abre el bloque 6 con Enter');
key('Escape');
has(cnBody.getAttribute('data-focus') === 'zb6', 'slide 11: Escape vuelve al bloque 6 agrandado');
key('Escape');
has(!cnBody.getAttribute('data-focus'), 'slide 11: Escape final cierra el foco abierto');

/* CSS propio */

has(/\.slide-conclusiones \.slide-head\s*\{\s*height:\s*92px/.test(logoCss),
  'CSS: cabecera propia del slide de conclusiones');
has(/\.cn-body--fb1 \.cn-modal--b1[\s\S]{0,220}visibility:\s*visible/.test(logoCss) &&
   /\.cn-body--fb6 \.cn-modal--b6[\s\S]{0,220}visibility:\s*visible/.test(logoCss),
  'CSS: cada bloque muestra su panel (fb1..fb6)');
has(/\.cn-body--fzb1 \.cn-zoom--b1[\s\S]{0,180}visibility:\s*visible/.test(logoCss) &&
   /\.cn-body--fzb6 \.cn-zoom--b6[\s\S]{0,180}visibility:\s*visible/.test(logoCss),
  'CSS: cada bloque agranda su copia centrada (fzb1..fzb6)');
has(/\.cn-zoom-card\s*\{[^}]*transform:\s*scale\(/.test(logoCss),
  'CSS: la copia agrandada del bloque se escala para centrarse');
has(/\.cn-card\s*\{[^}]*height:\s*338px/.test(logoCss),
  'CSS: las tarjetas tienen altura fija (338px) para el esquema doctoral');
has(/\.cn-node\s*\{[^}]*box-shadow:\s*0 0 0 4px var\(--cn-rojo\)/.test(logoCss),
  'CSS: el nodo central lleva borde doble verde + rojo');
has(/sel: 'cn-body'[\s\S]{0,240}'zb1'[\s\S]{0,240}parents: \{ b1: 'zb1'/.test(appJs),
  'app.js: FOCUS_SCOPES registra los focos zb1..zb6 y b1..b6 (dos niveles)');
has(/'cn-body': \{ nodes: \['\.cn-flow'/.test(appJs),
  'app.js: GHOST_CFG atenda el diagrama de conclusiones');
has(/\.cn-body\s*\{[^}]*flex:\s*1/.test(logoCss),
  'CSS: la lámina de conclusiones usa el cuerpo flex:1 común');

/* ======================= DIAPOSITIVA 12 · RECOMENDACIONES ================== */
tabGo('12. Recomendaciones');

var rc = doc.querySelector('#slideFrame .slide.active');
has(!!rc && rc.classList.contains('slide-recomendaciones'),
  'slide 12: se renderiza .slide-recomendaciones como duodécima diapositiva');
has(/RECOMENDACIONES/i.test(rc.querySelector('.slide-head h2').textContent),
  'slide 12: el encabezado titula «RECOMENDACIONES»');
has(/Proyección metodológica/i.test(rc.querySelector('.rc-subtitle').textContent) &&
   /continuidad académica/i.test(rc.querySelector('.rc-subtitle').textContent),
  'slide 12: el subtítulo anuncia proyección, aplicación práctica y continuidad académica');
has(!!rc.querySelector('.slide-logo') && !!rc.querySelector('.slide-foot'),
  'slide 12: la lámina lleva logotipo y pie institucional');
has(!rc.querySelector('.rc-node'),
  'slide 12: el bloque superior verde (nodo) fue eliminado');

/* tres ámbitos en columnas */
var rcAmbs = Array.prototype.slice.call(rc.querySelectorAll('.rc-cols .rc-amb'));
has(rcAmbs.length === 3, 'slide 12: tres columnas de ámbito');
has(rcAmbs[0].classList.contains('rc-amb--green') &&
   rcAmbs[1].classList.contains('rc-amb--red') &&
   rcAmbs[2].classList.contains('rc-amb--green'),
  'slide 12: metodológico y académico en verde; práctico (3-5) en rojo');
has(/ÁMBITO METODOLÓGICO/i.test(rcAmbs[0].textContent) &&
   /Fortalecer instrumentos y enfoques/i.test(rcAmbs[0].textContent) &&
   /ÁMBITO PRÁCTICO/i.test(rcAmbs[1].textContent) &&
   /Aplicación operativa en obra/i.test(rcAmbs[1].textContent) &&
   /ÁMBITO ACADÉMICO/i.test(rcAmbs[2].textContent) &&
   /Proyección investigativa/i.test(rcAmbs[2].textContent),
  'slide 12: cada ámbito lleva su título y subtítulo');

/* seis subbloques clicables */
var rcSubs = Array.prototype.slice.call(rc.querySelectorAll('.rc-sub'));
has(rcSubs.length === 6, 'slide 12: seis subbloques (1-6)');
has(rcSubs.every(function (s) {
  return s.getAttribute('data-focus') && s.getAttribute('role') === 'button' &&
    s.getAttribute('tabindex') === '0';
}), 'slide 12: los seis subbloques son accionables (data-focus + role + tabindex)');
has(rcSubs.map(function (s) { return s.getAttribute('data-focus'); }).join(',') ===
  'rc1,rc2,rc3,rc4,rc5,rc6',
  'slide 12: los subbloques van etiquetados rc1..rc6 en orden');
has(rcAmbs[0].querySelectorAll('.rc-sub').length === 2 &&
   rcAmbs[1].querySelectorAll('.rc-sub').length === 3 &&
   rcAmbs[2].querySelectorAll('.rc-sub').length === 1,
  'slide 12: 2 subbloques metodológicos, 3 prácticos y 1 académico');
 has(/AMPLIACIÓN DE INSTRUMENTOS/i.test(rc.querySelector('.rc-sub[data-focus="rc1"]').textContent) &&
   /Cuestionario de chequeo/i.test(rc.querySelector('.rc-sub[data-focus="rc1"]').textContent) &&
   /NTP 324/i.test(rc.querySelector('.rc-sub[data-focus="rc1"]').textContent) &&
   /Herramienta más integral/i.test(rc.querySelector('.rc-sub[data-focus="rc1"]').textContent),
   'slide 12: subbloque 1 amplía instrumentos (NTP 324/330) con su franja de cierre');
 has(rc.querySelector('.rc-sub[data-focus="rc1"] .rc-radial-ring') &&
   rc.querySelectorAll('.rc-sub[data-focus="rc1"] .rc-radial-node').length === 5 &&
   /Físicos/.test(rc.querySelector('.rc-sub[data-focus="rc1"] .rc-radial').textContent) &&
   /Psicosociales/.test(rc.querySelector('.rc-sub[data-focus="rc1"] .rc-radial').textContent) &&
   rc.querySelectorAll('.rc-sub[data-focus="rc1"] .rc-radial-ntp .rc-ntp').length === 2,
   'slide 12: subbloque 1 diagrama radial (Cuestionario de chequeo + 5 riesgos + cadena NTP 324/330)');
 has(/ENFOQUE CUANTITATIVO O MIXTO/i.test(rc.querySelector('.rc-sub[data-focus="rc2"]').textContent) &&
    /Menor subjetividad/i.test(rc.querySelector('.rc-sub[data-focus="rc2"]').textContent),
   'slide 12: subbloque 2 sostiene el enfoque cuantitativo o mixto');
has(rc.querySelectorAll('.rc-sub[data-focus="rc2"] .rc-flujo2 .rc-f2-node').length === 4 &&
   rc.querySelectorAll('.rc-sub[data-focus="rc2"] .rc-flujo2 .rc-f2-arrow').length === 4 &&
   rc.querySelector('.rc-sub[data-focus="rc2"] .rc-f2-node--tl').textContent === 'Objetividad' &&
   rc.querySelector('.rc-sub[data-focus="rc2"] .rc-f2-node--bl').textContent === 'Menor subjetividad',
  'slide 12: subbloque 2 en flujo de dos niveles (Objetividad->Trazabilidad->Comparabilidad->Menor subjetividad)');
has(rc.querySelectorAll('.rc-sub[data-focus="rc3"] .rc-flujo2 .rc-f2-node').length === 4 &&
   rc.querySelectorAll('.rc-sub[data-focus="rc3"] .rc-flujo2 .rc-f2-arrow').length === 4 &&
   rc.querySelector('.rc-sub[data-focus="rc3"] .rc-f2-node--tl').textContent === 'Trabajadores',
  'slide 12: subbloque 3 en flujo de dos niveles (actores de la socialización de los ART)');
has(rc.querySelector('.rc-sub[data-focus="rc4"] .rc-radial-ring') &&
   rc.querySelectorAll('.rc-sub[data-focus="rc4"] .rc-radial-node').length === 5 &&
   rc.querySelectorAll('.rc-sub[data-focus="rc4"] .rc-radial-ntp .rc-ntp').length === 2 &&
   /Entidades públicas/.test(rc.querySelector('.rc-sub[data-focus="rc4"] .rc-radial').textContent),
  'slide 12: subbloque 4 en diagrama radial (alineación normativa + 5 elementos + cadena)');
has(rc.querySelectorAll('.rc-sub[data-focus="rc5"] .rc-flujo2 .rc-f2-node').length === 4 &&
   rc.querySelectorAll('.rc-sub[data-focus="rc5"] .rc-flujo2 .rc-f2-arrow').length === 4 &&
   /Cambios normativos/.test(rc.querySelector('.rc-sub[data-focus="rc5"] .rc-flujo2').textContent),
  'slide 12: subbloque 5 en flujo de dos niveles (actualización permanente)');
has(/SOCIALIZACIÓN DE LOS ART/i.test(rc.querySelector('.rc-sub[data-focus="rc3"]').textContent) &&
   /Difusión sistemática/i.test(rc.querySelector('.rc-sub[data-focus="rc3"]').textContent),
  'slide 12: subbloque 3 socializa los ART entre los actores de obra');
has(/ALINEACIÓN NORMATIVA/i.test(rc.querySelector('.rc-sub[data-focus="rc4"]').textContent) &&
   /Gestión preventiva verificable/i.test(rc.querySelector('.rc-sub[data-focus="rc4"]').textContent),
  'slide 12: subbloque 4 alinea la gestión con la normativa');
has(/ACTUALIZACIÓN PERMANENTE/i.test(rc.querySelector('.rc-sub[data-focus="rc5"]').textContent) &&
   /Cambios normativos/i.test(rc.querySelector('.rc-sub[data-focus="rc5"]').textContent),
  'slide 12: subbloque 5 mantiene la actualización permanente');
 has(/BASE PARA FUTURAS INVESTIGACIONES/i.test(rc.querySelector('.rc-sub[data-focus="rc6"]').textContent) &&
    rc.querySelectorAll('.rc-sub[data-focus="rc6"] .rc-fv .rc-fv-node').length === 7 &&
    rc.querySelectorAll('.rc-sub[data-focus="rc6"] .rc-fv .rc-fv-arrow').length === 6 &&
    /Aplicaciones longitudinales en obra/i.test(rc.querySelector('.rc-sub[data-focus="rc6"]').textContent),
   'slide 12: subbloque 6 (académico) encadena en flujo vertical las siete líneas de proyección');

/* banda operacional inferior */
var rcFlow = rc.querySelector('.rc-flow');
has(rcFlow.querySelectorAll('.rc-fn').length === 4 &&
   rcFlow.querySelectorAll('.rc-arrow').length === 3,
  'slide 12: la banda inferior encadena cuatro nodos con tres flechas');
has(Array.prototype.map.call(rcFlow.querySelectorAll('.rc-fn'), function (n) {
  return n.textContent.replace(/\s+/g, ' ').trim();
}).join('|') === 'Ampliar|Aplicar|Actualizar|Investigar',
  'slide 12: la secuencia es Ampliar -> Aplicar -> Actualizar -> Investigar');
has(Array.prototype.map.call(rcFlow.querySelectorAll('.rc-fn'), function (n) {
  return (n.classList.contains('rc-fn--red') ? 'r' : n.classList.contains('rc-fn--green') ? 'g' : '?');
}).join('') === 'grgr',
  'slide 12: la banda inferior alterna verde/rojo (Ampliar, Aplicar, Actualizar, Investigar)');

/* detalle ampliado por subbloque */
has(rc.querySelectorAll('.rc-modal').length === 6 && rc.querySelectorAll('.rc-card').length === 6,
  'slide 12: cada subbloque tiene su detalle ampliado');
 has(/NTP 324 \+ NTP 330/i.test(rc.querySelector('.rc-modal--rc1 .rc-card').textContent) &&
   /Eficacia de controles/i.test(rc.querySelector('.rc-modal--rc6 .rc-card').textContent),
   'slide 12: los detalles amplían el contenido del documento (bloques 1 y 6)');
 has(rc.querySelector('.rc-modal--rc1 .rc-card-fig .rc-radial--big .rc-radial-ring') &&
   rc.querySelectorAll('.rc-modal--rc1 .rc-card-fig .rc-radial-node').length === 5 &&
   rc.querySelectorAll('.rc-modal--rc1 .rc-card-fig .rc-radial-ntp .rc-ntp').length === 2,
   'slide 12: el detalle del subbloque 1 incluye el diagrama radial agrandado');
 has(rc.querySelectorAll('.rc-modal--rc2 .rc-card-fig .rc-flujo2--big .rc-f2-node').length === 4 &&
   rc.querySelectorAll('.rc-modal--rc2 .rc-card-fig .rc-flujo2--big .rc-f2-arrow').length === 4,
   'slide 12: el detalle del subbloque 2 incluye el flujo agrandado');
 has(rc.querySelectorAll('.rc-modal--rc3 .rc-card-fig .rc-flujo2--big .rc-f2-node').length === 4 &&
   rc.querySelectorAll('.rc-modal--rc3 .rc-card-fig .rc-flujo2--big .rc-f2-arrow').length === 4,
   'slide 12: el detalle del subbloque 3 incluye el flujo agrandado');
 has(rc.querySelectorAll('.rc-modal--rc4 .rc-card-fig .rc-radial--big .rc-radial-node').length === 5 &&
   rc.querySelectorAll('.rc-modal--rc4 .rc-card-fig .rc-radial--big .rc-radial-ntp .rc-ntp').length === 2,
   'slide 12: el detalle del subbloque 4 incluye el diagrama radial agrandado');
 has(rc.querySelectorAll('.rc-modal--rc5 .rc-card-fig .rc-flujo2--big .rc-f2-node').length === 4 &&
   rc.querySelectorAll('.rc-modal--rc5 .rc-card-fig .rc-flujo2--big .rc-f2-arrow').length === 4,
   'slide 12: el detalle del subbloque 5 incluye el flujo agrandado');
 has(rc.querySelectorAll('.rc-modal--rc6 .rc-card-fig .rc-fv--big .rc-fv-node').length === 7 &&
   rc.querySelectorAll('.rc-modal--rc6 .rc-card-fig .rc-fv--big .rc-fv-arrow').length === 6,
   'slide 12: el detalle del subbloque 6 incluye el flujo vertical agrandado');

/* interacción: un foco único abre el detalle */
var rcBody = rc.querySelector('.rc-body');
has(gcs(rc.querySelector('.rc-modal--rc1')).visibility === 'hidden',
  'slide 12: los detalles nacen ocultos (visibility hidden)');
click(rc.querySelector('.rc-sub[data-focus="rc1"]'));
has(rcBody.getAttribute('data-focus') === 'rc1' && rcBody.classList.contains('rc-body--frc1'),
  'slide 12: al pulsar el subbloque 1 se abre su foco (rc-body--frc1)');
has(gcs(rc.querySelector('.rc-modal--rc1')).visibility === 'visible' &&
   gcs(rc.querySelector('.rc-modal--rc2')).visibility === 'hidden',
  'slide 12: solo se abre el detalle del subbloque pulsado');
has(!!rc.querySelector('.scope-ghost.is-on'),
  'ghost: la lámina de recomendaciones queda atenuada al abrir un detalle');
click(rc.querySelector('.rc-modal--rc1 .rc-card-p'));
has(rcBody.getAttribute('data-focus') === 'rc1',
  'slide 12: un clic dentro de la tarjeta no cierra el detalle');
click(rc.querySelector('.rc-modal--rc1 .rc-card-x'));
has(!rcBody.getAttribute('data-focus') && gcs(rc.querySelector('.rc-modal--rc1')).visibility === 'hidden',
  'slide 12: el botón de cierre cierra el detalle');
click(rc.querySelector('.rc-sub[data-focus="rc3"]'));
has(rcBody.classList.contains('rc-body--frc3') &&
   gcs(rc.querySelector('.rc-modal--rc3')).visibility === 'visible' &&
   gcs(rc.querySelector('.rc-modal--rc1')).visibility === 'hidden',
  'slide 12: al abrir otro subbloque se cierra el anterior (foco único)');
click(rc.querySelector('.rc-modal--rc3'));
has(!rcBody.getAttribute('data-focus'),
  'slide 12: un clic en el fondo del detalle cierra el foco');
key('Escape');
has(!rcBody.getAttribute('data-focus'), 'slide 12: Escape deja la lámina en reposo');
rc.querySelector('.rc-sub[data-focus="rc6"]').focus();
has(key('Enter'), 'slide 12: Enter sobre el subbloque 6 -> default evitado');
has(rcBody.classList.contains('rc-body--frc6'), 'slide 12: el subbloque 6 también se abre con Enter');
key('Escape');
has(!rcBody.getAttribute('data-focus'), 'slide 12: Escape tras Enter cierra el foco');
click(rc.querySelector('.rc-sub[data-focus="rc2"]'));
has(rcBody.getAttribute('data-focus') === 'rc2', 'slide 12: foco abierto antes del clic fuera');
click(rc.querySelector('.rc-flow'));
has(!rcBody.getAttribute('data-focus'), 'slide 12: clic fuera (banda operacional) cierra el foco');

/* CSS y motor */
has(/\.slide-recomendaciones \.slide-head\s*\{\s*height:\s*92px/.test(logoCss),
  'CSS: cabecera propia del slide de recomendaciones');
has(/\.rc-body--frc1 \.rc-modal--rc1[\s\S]{0,220}visibility:\s*visible/.test(logoCss) &&
   /\.rc-body--frc6 \.rc-modal--rc6[\s\S]{0,220}visibility:\s*visible/.test(logoCss),
  'CSS: cada subbloque muestra su detalle (frc1..frc6)');
has(/\.rc-body--frc1 \.rc-modal--rc1 \.rc-card[\s\S]{0,220}transform:\s*scale\(1\)/.test(logoCss),
  'CSS: al abrir, la tarjeta crece de .86 a 1');
has(/\.rc-modal\s*\{[^}]*opacity:\s*0;[\s\S]{0,120}visibility:\s*hidden/.test(logoCss),
  'CSS: el detalle nace oculto (opacity 0 + visibility hidden)');
has(/\.rc-sub\[data-focus="rc4"\][\s\S]{0,180}--rc-accent:\s*#006e49/.test(logoCss) &&
   /\.rc-modal--rc4 \.rc-card[\s\S]{0,140}--rc-accent:\s*var\(--rc-verde\)/.test(logoCss),
  'CSS: el bloque 4 toma el verde del bloque 1 (subbloque y detalle)');
has(/\.rc-amb--green \{ --rc-accent: #006e49/.test(logoCss) &&
   /\.rc-amb--red \{ --rc-accent: #c0242a/.test(logoCss),
  'CSS: los ámbitos usan el verde y el rojo de la paleta del deck');
has(/sel: 'rc-body'[\s\S]{0,80}keys: \['rc1', 'rc2', 'rc3', 'rc4', 'rc5', 'rc6'\]/.test(appJs),
  'app.js: FOCUS_SCOPES registra rc-body con los focos rc1..rc6');
has(/'rc-body': \{ nodes: \['\.rc-cols', '\.rc-flow'\]/.test(appJs),
  'app.js: GHOST_CFG atenda las columnas y la banda operacional');
has(/\.rc-body\s*\{[^}]*flex:\s*1/.test(logoCss),
  'CSS: la lámina de recomendaciones usa el cuerpo flex:1 común');

/* ======================= DIAPOSITIVA 3 · OBJETIVOS ================= */
tabGo('3. Objetivos');
var ob = doc.querySelector('#slideFrame .slide.active');
has(!!ob && ob.classList.contains('slide-objectives') &&
  !!ob.querySelector('.og-block') && ob.querySelectorAll('.oe-card').length === 4 &&
  ob.querySelectorAll('.photo').length === 2 &&
  !!ob.querySelector('.hyp-card') && !!ob.querySelector('.alc-card') && !!ob.querySelector('.delim-card'),
  'slide 3: existen los bloques (general, 4 específicos, fotos, hipótesis, alcance y delimitación)');
has(/\.og-block,[\s\S]{0,160}\.delim-card\s*\{\s*position:\s*relative;\s*transition:\s*transform[^}]*box-shadow/.test(logoCss),
  'CSS: los bloques del slide 3 declaran transición de movimiento y sombra');
has(/\.og-block:hover,[\s\S]{0,160}\.delim-card:hover\s*\{[^}]*transform:\s*translateY\(-2px\)/.test(logoCss),
  'CSS: cada bloque del slide 3 se desplaza al pasar el ratón (translateY -2px + sombra)');
has(/\.alc-item:nth-child\(odd\) \.alc-num\s*\{[^}]*background:\s*var\(--green\)/.test(logoCss) &&
  /\.alc-item:nth-child\(even\) \.alc-num\s*\{[^}]*background:\s*var\(--red\)/.test(logoCss) &&
  /\.alc-title\s*\{[^}]*font-weight:\s*bold/.test(logoCss),
  'CSS: el número de cada recuadro del alcance va en caja verde/roja alterna y los títulos en negrilla');
has(/\.alc-item:nth-child\(odd\)\s*\{\s*border-bottom:\s*1\.5px solid var\(--green\)/.test(logoCss) &&
  /\.alc-item:nth-child\(even\)\s*\{\s*border-bottom:\s*1\.5px solid var\(--red\)/.test(logoCss),
  'CSS: la separación entre los recuadros del alcance alterna líneas verde/roja');
has(ob && ob.querySelectorAll('.oe-card').length === 4 &&
  Array.prototype.slice.call(ob.querySelectorAll('.oe-card')).map(function (c) {
    return c.classList.contains('oe-card--r') ? 'r' : (c.classList.contains('oe-card--g') ? 'g' : '?');
  }).join('') === 'grrg',
  'slide 3: los objetivos específicos alternan la clase verde/rojo (grrg)');
has(/\.oe-card--g\s*\{[^}]*background:\s*rgba\(0,\s*110,\s*73,\s*\.08\)/.test(logoCss) &&
  /\.oe-card--r\s*\{[^}]*background:\s*rgba\(192,\s*36,\s*42,\s*\.08\)/.test(logoCss) &&
  /\.oe-main\s*\{[^}]*color:\s*var\(--ink\)/.test(logoCss) &&
  /\.oe-num\s*\{[^}]*color:\s*#fff/.test(logoCss),
  'CSS: los objetivos específicos llevan fondo verde/rojo muy atenuado con texto negro y número en blanco');

/* ======================= DIAPOSITIVA 2 · PROBLEMATIZACIÓN ================= */
tabGo('2. Problematización');
var pb = doc.querySelector('#slideFrame .slide.active');
has(!!pb && pb.classList.contains('slide-problem'),
  'slide 2: se renderiza .slide-problem como segunda diapositiva');
var pbBody = pb.querySelector('.problem-body');
var evCol = pb.querySelector('.ev-column');
has(!!pbBody && pbBody.children.length === 5 &&
  !!pbBody.querySelector('.ev-column') && !!pbBody.querySelector('.flow') &&
  !!pbBody.querySelector('.just-column') && !!pbBody.querySelector('.q7-overlay') &&
  !!pbBody.querySelector('.hierarchy-overlay'),
  'slide 2: el cuerpo tiene las tres columnas y las vistas ampliadas de jerarquía y pregunta');
has(!!evCol && evCol.getAttribute('data-focus') === 'ev' &&
  evCol.getAttribute('role') === 'button' && evCol.getAttribute('tabindex') === '0',
  'slide 2: el bloque Evidencia es accionable (data-focus=ev + role + tabindex)');
has(!!evCol.querySelector('.ev-panel .accent') &&
  /EVIDENCIA/i.test(evCol.querySelector('.ev-header').textContent),
  'slide 2: Evidencia lleva el formato del panel de Justificación (accent + cabecera oscura)');
has(gcs(evCol.querySelector('.ev-panel')).overflow === 'hidden' && !!evCol.querySelector('.ev-cards'),
  'slide 2: el panel de Evidencia recorta su contenido (overflow hidden)');
has(evCol.querySelectorAll('.ev-cards .ev-hist .ev-period').length === 2 &&
  evCol.querySelectorAll('.ev-cards .ev-block').length === 3 &&
  !!evCol.querySelector('.ev-cards .ev-sources-block') &&
  !!evCol.querySelector('.ev-cards .ev-footnote'),
  'slide 2: Evidencia conserva todo su contenido (histórico, bloques y fuentes)');

/* foco por clic sobre el bloque de la izquierda */
click(evCol);
has(pbBody.classList.contains('problem-body--fev') && pbBody.getAttribute('data-focus') === 'ev',
  'slide 2: al pulsar Evidencia se agranda en el mismo lugar (problem-body--fev)');
has(!!pb.querySelector('.scope-ghost.is-on'),
  'ghost: la lámina original queda atenuada al agrandar Evidencia');
var pbGhost = pb.querySelector('.scope-ghost .scope-ghost-inner');
has(pbGhost && pbGhost.style.flexDirection === 'row' &&
  !!pbGhost.querySelector('.ev-column') && !!pbGhost.querySelector('.flow') &&
  !!pbGhost.querySelector('.just-column'),
  'slide 2: el ghost conserva las tres columnas en fila');
has(gcs(pbBody.querySelector('.flow')).display === 'none' &&
  gcs(pbBody.querySelector('.just-column')).display === 'none',
  'slide 2: al agrandar Evidencia, el flujo y Justificación se ocultan');
click(evCol);
has(!pbBody.getAttribute('data-focus') && !pbBody.classList.contains('problem-body--fev'),
  'slide 2: segundo clic en Evidencia vuelve al reposo');
evCol.focus();
has(key('Enter'), 'slide 2: Enter sobre Evidencia -> default evitado');
has(pbBody.classList.contains('problem-body--fev'), 'slide 2: Evidencia también se agranda con Enter');
key('Escape');
has(!pbBody.getAttribute('data-focus'), 'slide 2: Escape devuelve la lámina al reposo');

/* CSS y motor */
has(/\.problem-body--fev \.ev-column\s*\{\s*flex:\s*0 0 50%/.test(logoCss) &&
  /\.problem-body--fev \.flow,[\s\S]{0,60}\.just-column\s*\{\s*display:\s*none/.test(logoCss),
  'CSS: el foco de Evidencia ocupa el 50% del ancho y oculta las otras columnas');
has(/\.problem-body--fev \.ev-cards\s*\{[^}]*grid-template-columns:\s*1fr 1fr/.test(logoCss),
  'CSS: la Evidencia agrandada reordena su contenido en una rejilla de dos columnas');
has(/\.problem-body--fev \{\s*justify-content:\s*center;\s*align-items:\s*center;\s*\}/.test(logoCss) &&
  /\.problem-body--fev \.ev-panel\s*\{\s*height:\s*auto;\s*max-height:\s*100%/.test(logoCss),
  'CSS: la Evidencia agrandada se centra horizontal y verticalmente en la lámina');
has(/\.ev-period-label\s*\{[^}]*color:\s*var\(--red\)/.test(logoCss) &&
  /\.ev-period \.ev-tile \.ev-value\s*\{[^}]*color:\s*var\(--green\)/.test(logoCss),
  'CSS: en las tarjetas de periodo el verde y el rojo están invertidos (cabecera roja, cifras verdes)');
has(/\.problem-body--fev \.ev-donut-block\s*\{[^}]*justify-content:\s*center/.test(logoCss) &&
  /\.problem-body--fev \.ev-donut\s*\{[^}]*justify-content:\s*center/.test(logoCss),
  'CSS: el subbloque «Accidentalidad» centra su contenido al agrandar Evidencia');
has(/\.problem-body--fev \.ev-sources-block\s*\{[^}]*justify-content:\s*center/.test(logoCss),
  'CSS: al agrandar Evidencia, «Fuentes de consulta» se centra verticalmente');
has(/\.ev-panel \.accent\s*\{[^}]*linear-gradient\(180deg, var\(--green\), var\(--red\)\)/.test(logoCss) &&
  /\.ev-header\s*\{[^}]*border-bottom:\s*3px solid var\(--red\)/.test(logoCss),
  'CSS: el panel de Evidencia usa el verde y el rojo de la paleta (accent y cabecera)');
has(/sel: 'problem-body'[\s\S]{0,60}keys: \['ev', 'jf', 'p4', 'q7'\]/.test(appJs),
  "app.js: FOCUS_SCOPES registra problem-body con los focos 'ev', 'jf', 'p4' y 'q7'");
has(/'problem-body': \{ nodes: \['\.ev-column', '\.flow', '\.just-column'\][^}]*dir: 'row'/.test(appJs),
  'app.js: GHOST_CFG clona las tres columnas en fila (dir row)');

/* foco por clic sobre el bloque Justificación */
var jfCol = pb.querySelector('.just-column');
has(!!jfCol && jfCol.getAttribute('data-focus') === 'jf' &&
  jfCol.getAttribute('role') === 'button' && jfCol.getAttribute('tabindex') === '0',
  'slide 2: el bloque Justificación es accionable (data-focus=jf + role + tabindex)');
click(jfCol);
has(pbBody.classList.contains('problem-body--fjf') && pbBody.getAttribute('data-focus') === 'jf',
  'slide 2: al pulsar Justificación se agranda en el mismo lugar (problem-body--fjf)');
has(gcs(pbBody.querySelector('.ev-column')).display === 'none' &&
  gcs(pbBody.querySelector('.flow')).display === 'none',
  'slide 2: al agrandar Justificación, Evidencia y el flujo se ocultan');
has(gcs(jfCol.querySelector('.pyramid-block')).display === 'none' &&
  gcs(pbBody.querySelector('.hierarchy-overlay')).display === 'none' &&
  gcs(jfCol.querySelector('.just-cards')).display !== 'none' &&
  gcs(jfCol.querySelector('.obj-block')).display !== 'none' &&
  gcs(jfCol.querySelector('.campo-block')).display !== 'none',
  'slide 2: Justificación ampliada conserva tarjetas, objeto y campo, pero retira la jerarquía');
click(jfCol);
has(!pbBody.getAttribute('data-focus') && !pbBody.classList.contains('problem-body--fjf'),
  'slide 2: segundo clic en Justificación vuelve al reposo');
has(gcs(jfCol.querySelector('.pyramid-block')).display !== 'none',
  'slide 2: al cerrar Justificación reaparece la jerarquía en su lugar original');
jfCol.focus();
has(key('Enter'), 'slide 2: Enter sobre Justificación -> default evitado');
has(pbBody.classList.contains('problem-body--fjf'), 'slide 2: Justificación también se agranda con Enter');
key('Escape');
has(!pbBody.getAttribute('data-focus'), 'slide 2: Escape devuelve la Justificación al reposo');

has(/\.problem-body--fjf \.just-column\s*\{\s*flex:\s*0 0 50%/.test(logoCss) &&
  /\.problem-body--fjf \.ev-column,[\s\S]{0,40}\.flow\s*\{\s*display:\s*none/.test(logoCss),
  'CSS: el foco de Justificación ocupa el 50% del ancho y oculta Evidencia y el flujo');
has(/\.problem-body--fjf \.just-cards\s*\{[^}]*grid-template-columns:\s*1fr 1fr/.test(logoCss) &&
  /\.problem-body--fjf \{\s*justify-content:\s*center;\s*align-items:\s*center;\s*\}/.test(logoCss),
  'CSS: la Justificación agrandada se centra y reordena su contenido en dos columnas');

/* colores alternos verde/rojo en justificaciones y pirámide */
has(pb.querySelectorAll('.just-card--green').length === 2 &&
  pb.querySelectorAll('.just-card--red').length === 2 &&
  !!pb.querySelector('.just-card--red .just-card-icon.red') &&
  !!pb.querySelector('.just-card--green .just-card-icon.green'),
  'slide 2: las tarjetas de justificación alternan verde/rojo/verde/rojo (borde e icono)');
has(/\.just-card--green\s*\{[^}]*border-left-color:\s*var\(--green\)/.test(logoCss) &&
  /\.just-card--red\s*\{[^}]*border-left-color:\s*var\(--red\)/.test(logoCss) &&
  /\.just-card-icon\.green\s*\{[^}]*background:\s*rgba\(0, 110, 73, \.12\)[^}]*color:\s*var\(--green\)/.test(logoCss) &&
  /\.just-card-icon\.red\s*\{[^}]*background:\s*rgba\(192, 36, 42, \.12\)[^}]*color:\s*var\(--red\)/.test(logoCss),
  'CSS: las tarjetas de justificación usan el estilo del nodo central (borde fino + icono en tinte claro)');
var plevels = jfCol.querySelectorAll('.p-level');
has(plevels.length === 5 &&
  plevels[0].classList.contains('p-level--green') && plevels[1].classList.contains('p-level--red') &&
  plevels[2].classList.contains('p-level--green') && plevels[2].classList.contains('p-active') &&
  plevels[3].classList.contains('p-level--red') && plevels[4].classList.contains('p-level--green'),
  'slide 2: la jerarquía de controles alterna verde/rojo/verde/rojo/verde');
has(/\.p-level--green\s*\{[^}]*background:\s*var\(--green\)/.test(logoCss) &&
  /\.p-level--red\s*\{[^}]*background:\s*var\(--red\)/.test(logoCss),
  'CSS: los niveles de la pirámide usan el verde y el rojo sólidos (colores previos)');
has(pb.querySelectorAll('.just-card-body').length === 4 &&
  Array.prototype.every.call(pb.querySelectorAll('.just-card-body'), function (e) { return (e.textContent || '').trim().length > 0; }),
  'slide 2: las tarjetas de justificación muestran su contenido');
has(/\.just-card-extra\s*\{\s*display:\s*none;\s*\}/.test(logoCss) &&
  /\.problem-body--fjf \.just-card-extra\s*\{\s*display:\s*inline;/.test(logoCss),
  'CSS: el contenido extra de las justificaciones solo se muestra al agrandar el bloque');
has(!!pb.querySelector('.obj-text .obj-short') && !!pb.querySelector('.obj-text .obj-full') &&
  /\.obj-full\s*\{\s*display:\s*none;\s*\}/.test(logoCss) &&
  /\.problem-body--fjf \.obj-short\s*\{\s*display:\s*none;\s*\}/.test(logoCss) &&
  /\.problem-body--fjf \.obj-full\s*\{\s*display:\s*inline;/.test(logoCss),
  'CSS: el «Objeto del estudio» usa un texto corto en reposo y el completo al agrandarlo');
var fnodes = pb.querySelectorAll('.flow-node');
has(fnodes.length === 6 && gcs(pbBody.querySelector('.flow')).justifyContent === 'center' &&
  /Estrategia metodológica de gestión de proyectos basada en controles de ingeniería/.test(fnodes[4].querySelector('.node-body').textContent) &&
  fnodes[4].querySelector('.node-tag').textContent.trim() === 'BRECHA' &&
  Array.prototype.map.call(fnodes, function (node) { return node.querySelector('.tnode-dot').textContent; }).join(',') === '1,2,3,4,5,6' &&
  !Array.prototype.some.call(fnodes, function (node) { return node.querySelector('.node-tag').textContent.trim() === 'EFECTOS'; }),
  'slide 2: quedan seis bloques centrados y numerados, sin Efectos, y Brecha ocupa el lugar 5');
var p4node = fnodes[3];
var hierarchyOverlay = pbBody.querySelector('.hierarchy-overlay');
var expandedProblem = hierarchyOverlay.querySelector('.hierarchy-problem');
has(p4node.getAttribute('data-focus') === 'p4' && p4node.getAttribute('role') === 'button' &&
  p4node.getAttribute('tabindex') === '0',
  'slide 2: el subbloque 4 Problema permite abrir la jerarquía con clic o teclado');
has(hierarchyOverlay.getAttribute('data-focus') === 'p4' &&
  hierarchyOverlay.getAttribute('role') === 'button' && hierarchyOverlay.getAttribute('tabindex') === '0' &&
  gcs(hierarchyOverlay).display === 'none',
  'slide 2: la vista ampliada de jerarquía está oculta en reposo y permite cerrarse');
has(expandedProblem.querySelector('.hierarchy-problem-tag').textContent === win.PROBLEMA.flow[3].tag &&
  expandedProblem.querySelector('.hierarchy-problem-title').textContent === win.PROBLEMA.flow[3].title &&
  expandedProblem.querySelector('.hierarchy-problem-body').textContent === win.PROBLEMA.flow[3].body,
  'slide 2: la vista ampliada incluye Problema, Problema central y el texto completo de Ausencia de una metodología integral');
has(Array.prototype.map.call(hierarchyOverlay.querySelectorAll('.p-level'), function (level) {
  return level.textContent.trim();
}).join('|') === win.PROBLEMA.hierarchy.levels.join('|') &&
  hierarchyOverlay.querySelector('.p-level.p-active').textContent.trim() === 'Controles de ingeniería',
  'slide 2: la jerarquía ampliada conserva los cinco niveles en orden y resalta los controles de ingeniería');
click(p4node.querySelector('.node-body'));
has(pbBody.getAttribute('data-focus') === 'p4' && pbBody.classList.contains('problem-body--fp4') &&
  gcs(hierarchyOverlay).display === 'flex' && gcs(expandedProblem).display === 'flex',
  'slide 2: pulsar Problema muestra su contenido y la jerarquía ampliados juntos');
has(gcs(evCol).display === 'none' && gcs(jfCol).display === 'none' &&
  gcs(pbBody.querySelector('.flow')).display === 'none' && gcs(pbBody.querySelector('.q7-overlay')).display === 'none' &&
  !!pb.querySelector('.scope-ghost.is-on'),
  'slide 2: la jerarquía ampliada se muestra sola sobre la lámina original atenuada');
click(hierarchyOverlay.querySelector('.p-level.p-active span'));
has(!pbBody.getAttribute('data-focus') && !pbBody.classList.contains('problem-body--fp4') &&
  gcs(hierarchyOverlay).display === 'none' && gcs(jfCol.querySelector('.pyramid-block')).display !== 'none' &&
  !pb.querySelector('.scope-ghost'),
  'slide 2: un segundo clic en la jerarquía cierra la ampliación y restaura el resumen');
p4node.focus();
has(key('Enter') && pbBody.getAttribute('data-focus') === 'p4',
  'slide 2: Enter sobre Problema abre la jerarquía');
has(key('Escape') && !pbBody.getAttribute('data-focus') && gcs(hierarchyOverlay).display === 'none',
  'slide 2: Escape cierra la jerarquía ampliada');
has(key(' ') && pbBody.getAttribute('data-focus') === 'p4',
  'slide 2: Espacio sobre Problema también abre la jerarquía');
click(pb.querySelector('.slide-head'));
has(!pbBody.getAttribute('data-focus') && gcs(hierarchyOverlay).display === 'none',
  'slide 2: un clic fuera de la jerarquía vuelve al estado normal');
click(p4node);
tabGo('4. Teorías');
tabGo('2. Problematización');
has(!pbBody.getAttribute('data-focus') && !pbBody.classList.contains('problem-body--fp4') &&
  gcs(hierarchyOverlay).display === 'none' && !pb.querySelector('.scope-ghost'),
  'slide 2: al volver desde otra diapositiva no queda la jerarquía abierta');
has(fnodes[5].querySelector('.node-tag').textContent.trim() === 'PREGUNTA CIENTÍFICA' &&
  !/Necesidad/i.test(fnodes[5].textContent) &&
  /^¿Cómo contribuir a la mejora de condiciones de seguridad laboral/.test(fnodes[5].querySelector('.node-body').textContent.trim()) &&
  fnodes[5].querySelector('.node-title').textContent.trim() === '',
  'slide 2: el bloque 6 es la Pregunta científica con su texto de investigación');
var q7node = fnodes[5];
has(q7node.getAttribute('data-focus') === 'q7' && q7node.getAttribute('role') === 'button' &&
  q7node.getAttribute('tabindex') === '0',
  'slide 2: el bloque 6 (pregunta científica) conserva la ampliación (data-focus=q7 + role + tabindex)');
var q7ov = pb.querySelector('.q7-overlay');
has(!!q7ov && q7ov.getAttribute('data-focus') === 'q7' && !!q7ov.querySelector('.q7-card'),
  'slide 2: existe el overlay de la pregunta ampliada (data-focus=q7 con su tarjeta)');
has(!!q7ov.querySelector('.q7-card .accent') && !!q7ov.querySelector('.q7-card .q7-header') &&
  !!q7ov.querySelector('.q7-card .q7-content .q7-body'),
  'slide 2: el recuadro de la pregunta usa el formato de panel (accent + cabecera + cuerpo)');
click(q7node);
has(pbBody.classList.contains('problem-body--fq7') && pbBody.getAttribute('data-focus') === 'q7' &&
  gcs(q7ov).display === 'flex',
  'slide 2: al pulsar el bloque 6 se muestra el overlay ampliado (problem-body--fq7)');
has(gcs(pbBody.querySelector('.flow')).display === 'none' && !!pb.querySelector('.scope-ghost.is-on'),
  'slide 2: al ampliar la pregunta se oculta el contenido real y queda el fondo atenuado (ghost)');
click(q7ov);
has(!pbBody.getAttribute('data-focus') && gcs(q7ov).display === 'none',
  'slide 2: un clic sobre el overlay ampliado lo cierra');
q7node.focus();
has(key('Enter'), 'slide 2: Enter sobre el bloque 6 -> default evitado');
has(pbBody.classList.contains('problem-body--fq7'), 'slide 2: el bloque 6 también se amplía con Enter');
key('Escape');
has(!pbBody.getAttribute('data-focus') && gcs(q7ov).display === 'none',
  'slide 2: Escape cierra la pregunta ampliada');
has(/\.problem-body--fq7 \.q7-overlay\s*\{\s*display:\s*flex;\s*\}/.test(logoCss),
  'CSS: el overlay de la pregunta solo aparece con problem-body--fq7');
has(/\.problem-body--fq7 \.ev-column,[\s\S]{0,80}\.just-column\s*\{\s*display:\s*none/.test(logoCss),
  'CSS: al ampliar la pregunta se ocultan las tres columnas y se revela el fondo atenuado');
has(/\.q7-overlay\s*\{[^}]*background:\s*transparent/.test(logoCss),
  'CSS: el overlay de la pregunta no oscurece; deja ver el fondo atenuado como Evidencia/Justificación');
has(/\.q7-card\s*\{[^}]*width:\s*50%/.test(logoCss) &&
  /\.q7-card \.accent\s*\{[^}]*width:\s*4px/.test(logoCss) &&
  /\.q7-header\s*\{[^}]*linear-gradient\(135deg, #4c4a4f, #262626\)[^}]*border-bottom:\s*4px solid var\(--green\)/.test(logoCss),
  'CSS: el recuadro de la pregunta replica el panel de Evidencia/Justificación (50% + accent + cabecera oscura)');
has(q7node.classList.contains('flow-node--question') &&
  /\.flow-node--question\s*\{[^}]*background:\s*linear-gradient\(135deg, rgba\(192, 36, 42, \.10\), rgba\(192, 36, 42, \.16\)\)/.test(logoCss) &&
  /\.flow-node--question \.node-tag\s*\{[^}]*color:\s*var\(--ink\)/.test(logoCss),
  'CSS: la pregunta científica del bloque 6 usa rojo atenuado con etiqueta oscura');
has(/\.flow-node\[data-focus="q7"\]\s*\{[^}]*transition:\s*box-shadow[^}]*transform/.test(logoCss) &&
  /\.flow-node\[data-focus="q7"\]:hover\s*\{[^}]*transform:\s*translateY\(-1px\)/.test(logoCss),
  'CSS: el bloque 6 replica el realce al pasar el ratón (translateY -1px + sombra)');

/* ========================= DIAPOSITIVA 4 · MARCO TEÓRICO ==================== */
tabGo('4. Teorías');
var th = doc.querySelector('#slideFrame .slide.active');
has(!!th && th.classList.contains('slide-teorias') && !!th.querySelector('.th-grid') &&
  !!th.querySelector('.th-legal-fig'),
  'slide 4: se renderiza .slide-teorias con la galería y el marco normativo');
var thBody = th ? th.querySelector('.th-body') : null;
var thHist = th ? th.querySelector('.th-box--hist') : null;
has(!!thHist && thHist.getAttribute('data-focus') === 'hist' &&
  thHist.getAttribute('role') === 'button' && thHist.getAttribute('tabindex') === '0',
  'slide 4: el bloque «Marco histórico» es accionable (data-focus=hist + role + tabindex)');
has(!!thHist && thHist.querySelectorAll('.th-milestone').length === 5 &&
  !!thHist.querySelector('.th-timeline') && !!thHist.querySelector('p.th-ref'),
  'slide 4: el bloque «Marco histórico» trae los 5 hitos, la línea de tiempo y la referencia');
has(gcs(thHist.querySelector('p')).display === 'none' &&
  Array.prototype.slice.call(thHist.querySelectorAll('.th-milestone span')).every(function (s) {
    return gcs(s).display === 'none';
  }),
  'slide 4: en reposo el bloque solo enseña los años (p y descripciones ocultas)');
has(gcs(thHist.querySelector('p.th-ref')).display === 'none' &&
  Array.prototype.slice.call(thHist.querySelectorAll('.th-milestone b')).every(function (b) {
    return gcs(b).display !== 'none' && b.textContent.length > 0;
  }),
  'slide 4: en reposo la referencia queda oculta y los años siguen visibles');

click(thHist);
has(!!thBody && thBody.classList.contains('th-body--fhist') &&
  thBody.getAttribute('data-focus') === 'hist',
  'slide 4: al pulsar «Marco histórico» se amplía (th-body--fhist + data-focus=hist)');
has(!!th.querySelector('.scope-ghost.is-on'),
  'ghost: la lámina original queda atenuada al ampliar el «Marco histórico»');
var thGhost = th.querySelector('.scope-ghost .scope-ghost-inner');
has(!!thGhost && !!thGhost.querySelector('.th-intro') && !!thGhost.querySelector('.th-grid'),
  'slide 4: el ghost conserva la cabecera de conceptos y la rejilla en reposo');
has(!!thGhost && !/th-body--fhist/.test(thGhost.className) &&
  gcs(thGhost.querySelector('.th-box--hist')).visibility !== 'hidden',
  'slide 4: el ghost no hereda la ampliación y muestra la rejilla atenuada');
has(!!thBody && gcs(thBody.querySelector('.th-intro')).visibility === 'hidden' &&
  gcs(thBody.querySelector('.th-grid')).visibility === 'hidden',
  'slide 4: al ampliar se oculta el contenido real (se conserva el sitio del ghost)');
has(gcs(thHist.querySelector('p')).display === 'block' &&
  Array.prototype.slice.call(thHist.querySelectorAll('.th-milestone span')).every(function (s) {
    return gcs(s).display === 'block';
  }),
  'slide 4: al ampliar se muestra el detalle completo (párrafo y descripciones)');
has(/\.th-body--fhist \.th-box--hist,\s*\.th-body--fapl \.th-box--apl\s*\{[^}]*position:\s*absolute[^}]*left:\s*50%[^}]*top:\s*50%[^}]*transform:\s*translate\(-50%,\s*-50%\)[^}]*z-index:\s*2/.test(logoCss),
  'CSS: cada bloque ampliable se centra sobre el cuerpo (absolute + translate) y va sobre el ghost');
has(/\.th-body\s*\{[^}]*position:\s*relative[^}]*z-index:\s*1/.test(logoCss),
  'CSS: el cuerpo del slide 4 es el contenedor de referencia y queda sobre el ghost');
has(/\.th-box--hist p,\s*\.th-box--hist \.th-milestone span,\s*\.th-box--apl \.th-bflow-item span\s*\{\s*display:\s*none/.test(logoCss) &&
  /\.th-body--fhist \.th-box--hist p,\s*\.th-body--fhist \.th-box--hist \.th-milestone span,\s*\.th-body--fapl \.th-box--apl \.th-bflow-item span\s*\{\s*display:\s*block/.test(logoCss),
  'CSS: el detalle de los bloques ampliables se oculta en reposo y se muestra al ampliar');
has(/\.th-body--fhist \.th-intro,\s*\.th-body--fhist \.th-grid,\s*\.th-body--fapl \.th-intro,\s*\.th-body--fapl \.th-grid\s*\{\s*visibility:\s*hidden/.test(logoCss),
  'CSS: la ampliación esconde (visibility) la cabecera de conceptos y la rejilla');
has(/\.th-legal-fig\s*\{[^}]*display:\s*flex/.test(logoCss) &&
  /\.th-lh-row:nth-child\(1\)\s*\{\s*width:\s*48%/.test(logoCss) &&
  /\.th-lh-row:nth-child\(6\)\s*\{\s*width:\s*100%/.test(logoCss),
  'CSS: la jerarquía es una pirámide de anchos proporcionales (48% → 100%)');

click(thHist);
has(!!thBody && !thBody.getAttribute('data-focus') &&
  !thBody.classList.contains('th-body--fhist') && !th.querySelector('.scope-ghost'),
  'slide 4: un segundo clic cierra el «Marco histórico» y retira el ghost');
thHist.focus();
has(key('Enter') && !!thBody && thBody.classList.contains('th-body--fhist'),
  'slide 4: Enter sobre «Marco histórico» también lo amplía');
key('Escape');
has(!!thBody && !thBody.getAttribute('data-focus') &&
  !thBody.classList.contains('th-body--fhist'),
  'slide 4: Escape cierra el «Marco histórico» ampliado');

/* --- bloque «Aplicación»: mismo comportamiento --- */
var thApl = th ? th.querySelector('.th-box--apl') : null;
has(!!thApl && thApl.getAttribute('data-focus') === 'apl' &&
  thApl.getAttribute('role') === 'button' && thApl.getAttribute('tabindex') === '0' &&
  thApl.classList.contains('th-box--red'),
  'slide 4: el bloque «Aplicación» es accionable (data-focus=apl + role + tabindex)');
has(!!thApl && thApl.querySelectorAll('.th-bflow-item').length === 3 &&
  thApl.querySelectorAll('.th-bflow-item b').length === 3,
  'slide 4: el bloque «Aplicación» trae su cadena de tres pasos (keywords + detalle)');
has(!!thApl && Array.prototype.slice.call(thApl.querySelectorAll('.th-bflow-item span')).every(function (s) {
  return gcs(s).display === 'none';
}) && Array.prototype.slice.call(thApl.querySelectorAll('.th-bflow-item b')).every(function (b) {
  return gcs(b).display !== 'none' && b.textContent.length > 0;
}),
  'slide 4: en reposo «Aplicación» solo enseña las palabras clave (detalle oculto)');

click(thApl);
has(!!thBody && thBody.classList.contains('th-body--fapl') &&
  thBody.getAttribute('data-focus') === 'apl',
  'slide 4: al pulsar «Aplicación» se amplía (th-body--fapl + data-focus=apl)');
has(!!th.querySelector('.scope-ghost.is-on') &&
  !thBody.classList.contains('th-body--fhist'),
  'ghost: al ampliar «Aplicación» se atenúa la lámina y se cierra el foco anterior');
has(!!thBody && gcs(thBody.querySelector('.th-grid')).visibility === 'hidden' &&
  Array.prototype.slice.call(thApl.querySelectorAll('.th-bflow-item span')).every(function (s) {
    return gcs(s).display === 'block';
  }),
  'slide 4: al ampliar «Aplicación» se oculta la rejilla y se muestra el detalle completo');
click(thApl);
has(!!thBody && !thBody.getAttribute('data-focus') &&
  !thBody.classList.contains('th-body--fapl') && !th.querySelector('.scope-ghost'),
  'slide 4: un segundo clic cierra «Aplicación» y retira el ghost');
thApl.focus();
has(key('Enter') && !!thBody && thBody.classList.contains('th-body--fapl'),
  'slide 4: Enter sobre «Aplicación» también lo amplía');
key('Escape');
has(!!thBody && !thBody.getAttribute('data-focus') &&
  !thBody.classList.contains('th-body--fapl'),
  'slide 4: Escape cierra «Aplicación» ampliada');
has(/\.th-box--hist,\s*\.th-box--apl\s*\{\s*cursor:\s*pointer;\s*\}/.test(logoCss) &&
  /\.th-box--apl \.th-bflow-item b\s*\{\s*margin-bottom:\s*0/.test(logoCss) &&
  /\.th-body--fapl \.th-box--apl \.th-bflow-item span\s*\{\s*font-size:\s*12\.5px/.test(logoCss),
  'CSS: «Aplicación» comparte el realce de cursor y el escalado del bloque ampliado');

/* --- bloque «Marco Legal y Normativo» (2.4): ampliable y con la jerarquía
   generada en bloques verde/rojo alternos atenuados --- */
var thLeg = th ? th.querySelector('.th-legal') : null;
has(!!thLeg && thLeg.getAttribute('data-focus') === 'leg' &&
  thLeg.getAttribute('role') === 'button' && thLeg.getAttribute('tabindex') === '0',
  'slide 4: el bloque «Marco Legal y Normativo» es accionable (data-focus=leg + role + tabindex)');
has(!!thLeg && thLeg.querySelectorAll('.th-lh-row').length === 6 &&
  !!thLeg.querySelector('.th-legal-fig') && !!thLeg.querySelector('.th-lh-cap'),
  'slide 4: el marco legal trae el diagrama generado, con su rótulo y la jerarquía de 6 niveles');
has(!!thLeg && thLeg.querySelectorAll('.th-lh--g').length === 3 &&
  thLeg.querySelectorAll('.th-lh--r').length === 3 &&
  Array.prototype.slice.call(thLeg.querySelectorAll('.th-lh-row')).every(function (r, i) {
    return i % 2 === 0 ? /th-lh--g/.test(r.className) : /th-lh--r/.test(r.className);
  }),
  'slide 4: los niveles de la jerarquía alternan verde/rojo (g-r-g-r-g-r)');
has(!!thLeg && gcs(thLeg.querySelector('h4')).display !== 'none' &&
  gcs(thLeg.querySelector('p')).display !== 'none' &&
  Array.prototype.slice.call(thLeg.querySelectorAll('.th-lh-row')).every(function (r) {
    return gcs(r).display !== 'none' && gcs(r.querySelector('.th-lh-name')).display !== 'none';
  }),
  'slide 4: en reposo el marco legal ya enseña todo su contenido (título, párrafo y jerarquía)');

click(thLeg);
has(!!thBody && thBody.classList.contains('th-body--fleg') &&
  thBody.getAttribute('data-focus') === 'leg',
  'slide 4: al pulsar el marco legal se amplía (th-body--fleg + data-focus=leg)');
has(!!th.querySelector('.scope-ghost.is-on') &&
  !thBody.classList.contains('th-body--fhist') && !thBody.classList.contains('th-body--fapl'),
  'ghost: al ampliar el marco legal se atenúa la lámina y se cierran los focos anteriores');
has(!!thBody && gcs(thBody.querySelector('.th-grid')).visibility === 'hidden' &&
  gcs(thLeg).visibility === 'visible' &&
  Array.prototype.slice.call(thLeg.querySelectorAll('.th-lh-row')).every(function (r) {
    return gcs(r).visibility !== 'hidden';
  }),
  'slide 4: al ampliar el marco legal se oculta la rejilla y se conserva todo el contenido');
click(thLeg);
has(!!thBody && !thBody.getAttribute('data-focus') &&
  !thBody.classList.contains('th-body--fleg') && !th.querySelector('.scope-ghost'),
  'slide 4: un segundo clic cierra el marco legal y retira el ghost');
thLeg.focus();
has(key('Enter') && !!thBody && thBody.classList.contains('th-body--fleg'),
  'slide 4: Enter sobre el marco legal también lo amplía');
key('Escape');
has(!!thBody && !thBody.getAttribute('data-focus') &&
  !thBody.classList.contains('th-body--fleg'),
  'slide 4: Escape cierra el marco legal ampliado');
has(/\.th-legal\[data-focus\]\s*\{\s*cursor:\s*pointer;\s*\}/.test(logoCss) &&
  /\.th-body--fleg \.th-legal\s*\{[^}]*position:\s*absolute[^}]*left:\s*50%[^}]*top:\s*50%[^}]*transform:\s*translate\(-50%,\s*-50%\)[^}]*z-index:\s*2/.test(logoCss) &&
  /\.th-lh-row\s*\{[^}]*background:\s*rgba\(0,\s*110,\s*73,\s*\.09\)/.test(logoCss) &&
  /\.th-lh--r\s*\{[^}]*background:\s*rgba\(192,\s*36,\s*42,\s*\.08\)/.test(logoCss),
  'CSS: el marco legal comparte el centrado y sus bandas van en verde/rojo atenuados');

/* --- recuadro «Marco contextual actual»: panel contextual de 8 tarjetas --- */
has(!!th && th.querySelectorAll('.th-ccard').length === 8 &&
  th.querySelectorAll('.th-ccard-b span').length === 25 &&
  !!th.querySelector('.th-ctx-sub') &&
  /Condiciones económicas y políticas/.test(th.querySelector('.th-ctx-sub').textContent),
  'slide 4: el marco contextual actual trae su panel de 8 tarjetas (24 líneas + la 4ª de la tarjeta 5) + subtítulo');
has(!!th && Array.prototype.slice.call(th.querySelectorAll('.th-ccard')).map(function (c) {
  return /th-ccard--r/.test(c.className) ? 'r' : 'g';
}).join('') === 'grgrgrgr' &&
  Array.prototype.slice.call(th.querySelectorAll('.th-ccard-n')).map(function (n) {
    return n.textContent;
  }).join('') === '12345678',
  'slide 4: el panel contextual numera 1-8 en alternancia verde/rojo (1v, 2r … 8r)');
has(/\.th-ctx\s*\{[^}]*position:\s*relative[^}]*height:\s*186px/.test(logoCss) &&
  /\.th-ccard\s*\{[^}]*position:\s*absolute[^}]*transform:\s*translate\(-50%,\s*-50%\)[^}]*width:\s*128px/.test(logoCss) &&
  /\.th-ccard--p3\s*\{\s*left:\s*87%;\s*top:\s*93px/.test(logoCss) &&
  /\.th-ccard--p7\s*\{\s*left:\s*13%;\s*top:\s*93px/.test(logoCss) &&
  /\.th-ctx-sub\s*\{[^}]*position:\s*absolute[^}]*border-radius:\s*50%/.test(logoCss),
  'CSS: en reposo el marco contextual es un óvalo radial con el subtítulo al centro (p3/p7 a 87 %/13 %)');
has(!!th && Array.prototype.slice.call(th.querySelectorAll('.th-ccard-b span')).every(function (s) {
    return gcs(s).display === 'none';
  }) &&
  Array.prototype.slice.call(th.querySelectorAll('.th-ccard-b b')).every(function (b) {
    return gcs(b).display !== 'none' && b.textContent.length > 0;
  }),
  'slide 4: en reposo el marco contextual enseña solo los 8 títulos (detalle oculto)');
var thCtx = th ? th.querySelector('.th-box--ctx') : null;
has(!!thCtx && thCtx.getAttribute('data-focus') === 'ctx' &&
  thCtx.getAttribute('role') === 'button' && thCtx.getAttribute('tabindex') === '0',
  'slide 4: el bloque «Marco contextual actual» es accionable (data-focus=ctx + role + tabindex)');

click(thCtx);
has(!!thBody && thBody.classList.contains('th-body--fctx') &&
  thBody.getAttribute('data-focus') === 'ctx',
  'slide 4: al pulsar «Marco contextual actual» se amplía (th-body--fctx + data-focus=ctx)');
has(!!th.querySelector('.scope-ghost.is-on'),
  'ghost: la lámina original queda atenuada al ampliar el «Marco contextual actual»');
var thCtxG = th.querySelector('.scope-ghost .scope-ghost-inner');
has(!!thCtxG && !!thCtxG.querySelector('.th-grid .th-box--ctx') &&
  gcs(thCtxG.querySelector('.th-box--ctx')).visibility !== 'hidden',
  'slide 4: el ghost conserva el marco contextual en reposo, atenuado');
has(gcs(th.querySelector('.th-intro')).visibility === 'hidden' &&
  gcs(th.querySelector('.th-grid')).visibility === 'hidden',
  'slide 4: al ampliar el marco contextual se oculta el contenido real (sitio del ghost)');
has(!!thCtx && Array.prototype.slice.call(thCtx.querySelectorAll('.th-ccard-b span')).every(function (s) {
    return gcs(s).display === 'block';
  }),
  'slide 4: al ampliar se muestra el texto completo de las 8 tarjetas');
has(!!thCtx && gcs(thCtx.querySelector('.th-ctxrad-hub')).display === 'flex' &&
  gcs(thCtx.querySelector('.th-ctxrad-ring')).display === 'block' &&
  thCtx.querySelectorAll('.th-ctxrad-lk').length === 8 &&
  Array.prototype.slice.call(thCtx.querySelectorAll('.th-ctxrad-lk')).every(function (l) {
    return gcs(l).display === 'block';
  }),
  'slide 4: al ampliar el diagrama muestra el óvalo central, el anillo y los 8 radios');
has(/\.th-body--fctx \.th-ccard--p3\s*\{\s*left:\s*87%;\s*top:\s*230px/.test(logoCss) &&
  /\.th-body--fctx \.th-ccard--p7\s*\{\s*left:\s*13%;\s*top:\s*230px/.test(logoCss) &&
  /\.th-body--fctx \.th-ctxrad-ring\s*\{[^}]*width:\s*74%[^}]*height:\s*65\.9%/.test(logoCss) &&
  /\.th-body--fctx \.th-box--ctx\s*\{[^}]*position:\s*absolute[^}]*left:\s*50%[^}]*top:\s*50%[^}]*transform:\s*translate\(-50%,\s*-50%\)[^}]*z-index:\s*2/.test(logoCss),
  'CSS: el marco contextual ampliado se centra sobre el ghost con p3/p7 en los extremos (87 %/13 %)');
click(thCtx);
has(!!thBody && !thBody.getAttribute('data-focus') &&
  !thBody.classList.contains('th-body--fctx') && !th.querySelector('.scope-ghost'),
  'slide 4: un segundo clic cierra el «Marco contextual actual» y retira el ghost');
thCtx.focus();
has(key('Enter') && !!thBody && thBody.classList.contains('th-body--fctx'),
  'slide 4: Enter sobre «Marco contextual actual» también lo amplía');
key('Escape');
has(!!thBody && !thBody.getAttribute('data-focus') &&
  !thBody.classList.contains('th-body--fctx'),
  'slide 4: Escape cierra el «Marco contextual actual» ampliado');

/* --- panel «Marco teórico — TEORÍAS BASE»: mismo comportamiento --- */
var thTeo = th ? th.querySelector('.th-panel') : null;
has(!!thTeo && thTeo.getAttribute('data-focus') === 'teo' &&
  thTeo.getAttribute('role') === 'button' && thTeo.getAttribute('tabindex') === '0',
  'slide 4: el panel «Teorías base» es accionable (data-focus=teo + role + tabindex)');
has(!!thTeo && thTeo.querySelectorAll('.th-theory').length === 4 &&
  thTeo.querySelectorAll('.th-fnode').length === 4,
  'slide 4: el panel «Teorías base» trae sus 4 teorías y los 4 nodos del enfoque');
click(thTeo);
has(!!thBody && thBody.classList.contains('th-body--fteo') &&
  thBody.getAttribute('data-focus') === 'teo',
  'slide 4: al pulsar «Teorías base» se amplía (th-body--fteo + data-focus=teo)');
has(!!th.querySelector('.scope-ghost.is-on'),
  'ghost: la lámina original queda atenuada al ampliar «Teorías base»');
has(gcs(th.querySelector('.th-intro')).visibility === 'hidden' &&
  gcs(th.querySelector('.th-grid')).visibility === 'hidden' &&
  gcs(thTeo).visibility !== 'hidden' &&
  gcs(thBody.querySelector('.th-legal')).visibility !== 'hidden' &&
  thBody.querySelectorAll('.th-legal .th-lh-row').length === 6,
  'slide 4: Teorías base ampliada muestra ambos paneles y los seis niveles del marco legal');
has((/\.th-body--fteo \.th-panel\s*\{[^}]*position:\s*absolute[^}]*top:\s*50%[^}]*transform:\s*translateY\(-50%\)[^}]*z-index:\s*2/.test(logoCss) ||
   /\.th-body--fteo \.th-panel\s*\{[^}]*position:\s*absolute[^}]*left:\s*50%[^}]*top:\s*50%[^}]*transform:\s*translate\(-50%,\s*-50%\)[^}]*z-index:\s*2/.test(logoCss)) &&
  /\.th-panel\[data-focus\]\s*\{\s*cursor:\s*pointer/.test(logoCss),
  'CSS: el panel «Teorías base» se centra sobre el ghost y anuncia cursor pointer');
click(thTeo);
has(!!thBody && !thBody.getAttribute('data-focus') &&
  !thBody.classList.contains('th-body--fteo') && !th.querySelector('.scope-ghost'),
  'slide 4: un segundo clic cierra «Teorías base» y retira el ghost');
thTeo.focus();
has(key('Enter') && !!thBody && thBody.classList.contains('th-body--fteo'),
  'slide 4: Enter sobre «Teorías base» también lo amplía');
key('Escape');
has(!!thBody && !thBody.getAttribute('data-focus') &&
  !thBody.classList.contains('th-body--fteo'),
  'slide 4: Escape cierra «Teorías base» ampliado');

let fail = 0;
checks.forEach(function (c) { if (!c[1]) { fail++; console.log('FAIL:', c[0]); } });
console.log((checks.length - fail) + '/' + checks.length + ' checks ok (foco por clic, slides 1-12)');
process.exit(fail ? 1 : 0);

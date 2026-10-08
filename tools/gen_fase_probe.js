const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'presentacion-web');
const OUT = path.join(__dirname, 'out');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const probe = `
<script>
window.addEventListener('DOMContentLoaded', function () {
  var O = '';
  var NL = String.fromCharCode(10);
  function rec(label, v) { O += label + ' = ' + v + NL; }
  function disp(sel) { var e = document.querySelector(sel); return e ? getComputedStyle(e).display : 'MISSING'; }
  function ghostInfo() { var g = document.querySelector('.slide.active .scope-ghost'); return g ? g.className.split(' ').join('|') + ' opa=' + getComputedStyle(g).opacity + ' l=' + g.offsetLeft + ' t=' + g.offsetTop + ' w=' + g.offsetWidth + ' h=' + g.offsetHeight : 'NO-GHOST'; }
  function body() { return document.querySelector('.slide.active .rs-body'); }
  function fire(type, el, key) {
    var e = typeof KeyboardEvent === 'function'
      ? new KeyboardEvent(type, { key: key, bubbles: true, cancelable: true })
      : (function () { var x = document.createEvent('Event'); x.initEvent(type, true, true); x.key = key; return x; })();
    el.dispatchEvent(e);
  }
  function clickInto(sel) { var el = document.querySelector(sel); if (!el) return 'MISSING'; clickOn(el); return 'ok'; }
  function clickOn(el) {
    var e = typeof MouseEvent === 'function' ? new MouseEvent('click', { bubbles: true, cancelable: true }) :
      (function () { var x = document.createEvent('Event'); x.initEvent('click', true, true); return x; })();
    el.dispatchEvent(e);
  }

  function fase1() { return document.querySelector('.slide.active .rs-fase[data-focus="3a"]'); }
  function panelW() { return document.querySelector('.slide.active .rs-panel--w37'); }
  function cols() { return document.querySelector('.slide.active .rs-cols'); }
  try {
    rec('DIAG window.SLIDES', (typeof window.SLIDES) + (window.SLIDES ? ' len=' + window.SLIDES.length : ''));
    rec('DIAG slideRenderers', typeof window.slideRenderers);
    rec('DIAG frame html len', document.getElementById('slideFrame').innerHTML.length);
    rec('DIAG tabs', document.querySelectorAll('#tabs .tab').length);
    fire('keydown', document, 'End');
    rec('DIAG post-End activo', document.querySelector('#slideFrame .slide.active') ? document.querySelector('#slideFrame .slide.active').className : 'NINGUNO');
    if (!document.querySelector('.slide.active .rs-body')) {
      var tabs6 = document.querySelectorAll('#tabs .tab');
      for (var i = 0; i < tabs6.length; i++) {
        if (tabs6[i].textContent.indexOf('6. ') === 0) { tabs6[i].click(); break; }
      }
      rec('DIAG click-tab activo', document.querySelector('#slideFrame .slide.active') ? document.querySelector('#slideFrame .slide.active').className : 'NINGUNO');
    }
    rec('EN REPOSO', 'focus=' + (body().getAttribute('data-focus') || '-'));
    rec('  fpic display', disp('.slide.active .rs-fase--green .rs-fpic'));
    rec('  tabla17 display', disp('.slide.active .rs-fase--green .rs-tbl'));
    rec('  w37 width', panelW().offsetWidth + 'x' + panelW().offsetHeight);
    rec('  ghost', ghostInfo());
    clickInto('.slide.active .rs-fase[data-focus="3a"]');
    rec('F1 CLIC', 'focus=' + body().getAttribute('data-focus') + ' clase=' + body().className.replace('rs-body', '').trim());
    rec('  ghost', ghostInfo());
    rec('  w37 width', panelW().offsetWidth + ' (cols ' + cols().clientWidth + ') boxShadow=' + getComputedStyle(panelW()).boxShadow);
    rec('  tabla17 display', disp('.slide.active .rs-fase--green .rs-tbl'));
    rec('  thead display', disp('.slide.active .rs-fase--green .rs-thead'));
    rec('  ctx display', disp('.slide.active .rs-fase--green .rs-ctx'));
    rec('  fpic display', disp('.slide.active .rs-fase--green .rs-fpic'));
    var img = document.querySelector('.slide.active .rs-fase--green .rs-fpic img');
    rec('  img src', img ? img.getAttribute('src') + ' complete=' + img.complete + ' nat=' + (img.naturalWidth || 0) + 'x' + (img.naturalHeight || 0) : 'MISSING');
    var p = document.querySelector('.slide.active .rs-panel--w30');
    rec('  panel1 width', p ? p.offsetWidth : 'NA');
    rec('  fase2 display', disp('.slide.active .rs-fase--red'));
    rec('  link display', disp('.slide.active .rs-link'));
    clickInto('.slide.active .rs-fase--green .rs-fpic');
    rec('F1 IMG CLIC', 'focus=' + body().getAttribute('data-focus') + ' clase=' + body().className.replace('rs-body', '').trim());
    rec('  ghost', ghostInfo());
    rec('  fpic box', (function () { var f = document.querySelector('.slide.active .rs-fase--green .rs-fpic'); var cs = getComputedStyle(f); return 'layout ' + f.offsetWidth + 'x' + f.offsetHeight + ' css ' + cs.width + 'x' + cs.height + ' pos ' + cs.position + ' l' + cs.left + ' t' + cs.top; })());
    rec('  img render', (function () { var i = document.querySelector('.slide.active .rs-fase--green .rs-fpic img'); return Math.round(i.getBoundingClientRect().width) + 'x' + Math.round(i.getBoundingClientRect().height); })());
    rec('  figcaption display', disp('.slide.active .rs-fase--green .rs-fpic figcaption'));
    rec('  cols visibility', getComputedStyle(document.querySelector('.slide.active .rs-cols')).visibility);
    rec('  fase childs', (function () { var f = document.querySelector('.slide.active .rs-fase--green'); var s = ''; Array.prototype.forEach.call(f.children, function (c) { s += c.className.split(' ')[0] + '=' + c.offsetHeight + '(' + getComputedStyle(c).display + ') '; }); return s; })());
    rec('  panel h', panelW().offsetHeight + ' rsbody h ' + document.querySelector('.slide.active .rs-body').offsetHeight);
    clickInto('.slide.active .rs-fase--green .rs-fpic');
    rec('F1 IMG RE-CLIC', 'focus=' + body().getAttribute('data-focus') + ' clase=' + body().className.replace('rs-body', '').trim());
    clickInto('.slide.active .rs-fase--green .rs-fpic');
    fire('keydown', document, 'Escape');
    rec('F1 IMG ESC', 'focus=' + body().getAttribute('data-focus'));
    clickInto('.slide.active .rs-fase[data-focus="3a"]');
    rec('F1 BASE', 'focus=' + (body().getAttribute('data-focus') || '-'));

    /* petición: desde 3a, clic dentro de la imagen -> máximo tamaño; clic fuera -> inicial (como ESC) */
    clickInto('.slide.active .rs-fase[data-focus="3a"]');
    rec('F1 CLIC DENTRO-IMG', (function () { clickInto('.slide.active .rs-fase--green .rs-fpic'); return 'focus=' + (body().getAttribute('data-focus') || '-' ); })());
    clickInto('.slide.active .rs-fase--green .rs-fpic');
    rec('F1 CLIC FUERA-IMG', (function () { clickInto('.slide.active .rs-fase--green .rs-fhead'); return 'focus=' + (body().getAttribute('data-focus') || '-' ); })());

    /* segundo clic en la fase: restaurar */
    clickInto('.slide.active .rs-fase[data-focus="3a"]');
    clickInto('.slide.active .rs-fase[data-focus="3a"]');
    rec('F1 RE-CLIC', 'focus=' + (body().getAttribute('data-focus') || '-'));
    rec('  tabla17 display', disp('.slide.active .rs-fase--green .rs-tbl'));
    rec('  fpic display', disp('.slide.active .rs-fase--green .rs-fpic'));
    rec('  ghost', ghostInfo());
    rec('  w37 width', panelW().offsetWidth);
    clickInto('.slide.active .rs-fase[data-focus="3b"]');
    rec('F2 CLIC', 'focus=' + body().getAttribute('data-focus') + ' clase=' + body().className.replace('rs-body', '').trim());
    rec('  ghost', ghostInfo());
    rec('  w37 boxShadow', getComputedStyle(panelW()).boxShadow);
    rec('  tabla18 display', disp('.slide.active .rs-fase--red .rs-tbl'));
    rec('  thead display', disp('.slide.active .rs-fase--red .rs-thead'));
    rec('  fpic display', disp('.slide.active .rs-fase--red .rs-fpic'));
    rec('  fase1 display', disp('.slide.active .rs-fase--green'));
    var img2 = document.querySelector('.slide.active .rs-fase--red .rs-fpic img');
    rec('  img2 src', img2 ? img2.getAttribute('src') + ' complete=' + img2.complete + ' nat=' + (img2.naturalWidth || 0) + 'x' + (img2.naturalHeight || 0) : 'MISSING');
    clickInto('.slide.active .rs-fase--red .rs-fpic');
    rec('F2 IMG CLIC', 'focus=' + body().getAttribute('data-focus') + ' clase=' + body().className.replace('rs-body', '').trim());
    rec('  ghost', ghostInfo());
    rec('  fpic box', (function () { var f = document.querySelector('.slide.active .rs-fase--red .rs-fpic'); var cs = getComputedStyle(f); return 'layout ' + f.offsetWidth + 'x' + f.offsetHeight + ' css ' + cs.width + 'x' + cs.height + ' pos ' + cs.position + ' l' + cs.left + ' t' + cs.top; })());
    rec('  bg', (function () { var f = document.querySelector('.slide.active .rs-fase--red .rs-fpic'); return getComputedStyle(f).backgroundImage.slice(0, 42) + ' | boxShadow ' + getComputedStyle(f).boxShadow.slice(0, 26); })());
    rec('  img render', (function () { var i = document.querySelector('.slide.active .rs-fase--red .rs-fpic img'); return Math.round(i.getBoundingClientRect().width) + 'x' + Math.round(i.getBoundingClientRect().height); })());
    rec('  figcaption display', disp('.slide.active .rs-fase--red .rs-fpic figcaption'));
    clickInto('.slide.active .rs-fase--red .rs-fpic');
    rec('F2 IMG RE-CLIC', 'focus=' + (body().getAttribute('data-focus') || '-'));
    clickInto('.slide.active .rs-fase--red .rs-fhead');
    rec('F2 CLIC FUERA-IMG', 'focus=' + (body().getAttribute('data-focus') || '-'));

    /* --- Slide 7 · Resultados (2): dos bandas (flujograma 25% + recuadros de fotos) --- */
    var tabs7 = document.querySelectorAll('#tabs .tab');
    for (var i7 = 0; i7 < tabs7.length; i7++) {
      if (tabs7[i7].textContent.indexOf('7. ') === 0) { tabs7[i7].click(); break; }
    }
    function b2() { return document.querySelector('.slide.active .rs2-body'); }
    rec('S7 EN REPOSO', 'h2=' + document.querySelector('.slide.active .slide-head h2').textContent +
      ' sub=' + document.querySelector('.slide.active .rs-subtitle').textContent);
    rec('  bandas', (function () {
      var f = document.querySelector('.slide.active .rs2-flow');
      var p = document.querySelector('.slide.active .rs2-fotos');
      return 'flujo ' + f.offsetWidth + 'x' + f.offsetHeight + ' | fotos ' + p.offsetWidth + 'x' + p.offsetHeight;
    })());
    rec('  nodos', Array.prototype.slice.call(document.querySelectorAll('.slide.active .rs2-fn')).map(function (n) {
      return n.querySelector('.rs-fn-c').textContent + '(' + n.offsetWidth + 'x' + n.offsetHeight + ')';;
    }).join(' ') + ' conectores=' + document.querySelectorAll('.slide.active .rs2-chain > .rs2-fx').length);
    rec('  recuadros', Array.prototype.slice.call(document.querySelectorAll('.slide.active .rs2-foto')).map(function (f) {
      return f.getAttribute('data-foto') + ':' + f.offsetWidth + 'x' + f.offsetHeight +
        ' ' + f.textContent.trim().replace(/s+/g, ' ') + ' (img=' + f.querySelectorAll('img').length + ')';;
    }).join(' | '));
    rec('S7 FIN', 'focus=' + (b2() ? (b2().getAttribute('data-focus') || '-') : '-'));
  } catch (err) {
    O += 'PROBE ERROR: ' + err.message + NL;
  }
  var pre = document.createElement('pre');
  pre.id = 'report';
  pre.textContent = O;
  document.body.appendChild(pre);
});
</script>
`;

const assets = [
  'css/styles.css',
  'js/icons.js',
  'js/data/thesisData.js',
  'js/data/problematizationData.js',
  'js/data/objectivesData.js',
  'js/data/theoriesData.js',
  'js/data/methodologyData.js',
  'js/data/resultsData.js',
  'js/data/resultsData2.js',
  'js/components/justificationCard.js',
  'js/slides/slide01Cover.js',
  'js/slides/slide02Problematization.js',
  'js/slides/slide03Objectives.js',
  'js/slides/slide04Theories.js',
  'js/slides/slide05Methodology.js',
  'js/slides/slide06Results.js',
  'js/slides/slide07Results.js',
  'js/app.js'
];

const html =
  '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">' +
  '<link rel="stylesheet" href="../../presentacion-web/css/styles.css">' +
  '<style>*{transition:none !important;animation:none !important}</style>' +
  '</head><body>' +
  '<div id="app">' +
  '<header class="app-header"><div class="brand"><span class="brand-dot"></span><span class="brand-text">Tesis</span></div>' +
  '<nav class="tabs" id="tabs" aria-label="Diapositivas"></nav>' +
  '<div class="controls"><span class="counter" id="counter"></span>' +
  '<button class="btn-nav" id="btnPrev"></button><button class="btn-nav" id="btnNext"></button>' +
  '<button class="btn-fs" id="btnFullscreen"></button></div></header>' +
  '<main class="stage" id="stage"><div class="scale-wrap" id="scaleWrap"><div class="slide-frame" id="slideFrame"></div></div></main>' +
  '</div>' +
  assets.map(function (a) { return '<script src="../../presentacion-web/' + a + '"></script>'; }).join('') +
  probe +
  '</body></html>';

fs.writeFileSync(path.join(OUT, 'fase_probe.html'), html);
console.log('ok fase_probe.html');

/* copia assets para la vista headless (la app usa rutas relativas) */
var ASSET_OUT = path.join(OUT, 'assets');
if (!fs.existsSync(ASSET_OUT)) fs.mkdirSync(ASSET_OUT, { recursive: true });
fs.readdirSync(path.join(ROOT, 'assets')).forEach(function (f) {
  fs.copyFileSync(path.join(ROOT, 'assets', f), path.join(ASSET_OUT, f));
});
console.log('assets copiados a out/assets');
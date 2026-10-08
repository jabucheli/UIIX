const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'out');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const dom = new JSDOM('<!doctype html><html><body></body></html>', { runScripts: 'outside-only', pretendToBeVisual: true });
const win = dom.window;

win.Icons = {
  svg: function (n, s) { return '<svg class="i-' + n + '" width="' + s + '" height="' + s + '" viewBox="0 0 24 24"></svg>'; }
};

function load(p) {
  const code = fs.readFileSync(path.join(ROOT, p), 'utf8');
  win.eval(code);
}

load('presentacion-web/js/data/methodologyData.js');
load('presentacion-web/js/slides/slide05Methodology.js');

const m = win.METODOLOGIA;
const html = win.slideRenderers.metodologia('', {}, {}, { a: 0 }, m);

const checks = [];
function has(b, label) { checks.push([label, !!b]); }

function mm_svg_ok(h){ return /mm-svg/.test(h) && (h.match(/<path /g)||[]).length === 5; }
const RAM_X = { lt:[0,0], lb:[0,128], rt:[816,0], rb:[816,128], cb:[433,258] };
/* --- estructura del mapa radial (pob1.md: 5 fases) --- */
has(/class="md-panel md-panel--mapa"/.test(html), 'panel mapa (bloque 3) present');
has(/class="mm-map"/.test(html), 'mm-map present');
has(/class="mm-center"/.test(html) && html.includes('METODOLOGÍA ·') && html.includes('POBLACIÓN Y') && html.includes('MUESTRA'), 'center node text');
has(mm_svg_ok(html), '5 conectores curvos');
checks.push(['ramas == 5', (html.match(/class="mm-rama mm-rama--/g) || []).length === 5]);
['lt', 'rt', 'rb', 'lb', 'cb'].forEach(function (p) {
  has(html.includes('left:' + RAM_X[p][0] + 'px;top:' + RAM_X[p][1] + 'px'), 'posición ' + p);
});
const colores = m.mapa.ramas.map(function (r) { return r.color; }).join(',');
checks.push(['colores por fase = verde,rojo,verde,rojo,verde (alterna)', colores === 'green,red,green,red,green']);
['green', 'red'].forEach(function (c) {
  has(html.includes('mm-rama--' + c), 'rama color ' + c);
});
const subs = (html.match(/class="mm-sub mm-sub--/g) || []).length;
checks.push(['subbloques A+B == 10', subs === 10]);
const pobLists = (html.match(/class="mm-list"/g) || []).length;
checks.push(['listas == 5 pob + 5 mti == 10', pobLists === 10]);
['P', 'M', 'Mt', 'C'].forEach(function (k) {
  checks.push(['insignia ' + k + ' en subbloque de población', new RegExp('class="mm-lg[^"]*">' + k + '<').test(html)]);
});
['M', 'T', 'I'].forEach(function (k) {
  checks.push(['insignia ' + k + ' en subbloque M/T/I', new RegExp('class="mm-lg[^"]*">' + k + '<').test(html)]);
});
const logos = (html.match(/class="mm-lg/g) || []).length;
checks.push(['insignias == 35 (5 ramas x 4 + 5 ramas x 3)', logos === 35]);
checks.push(['sin rótulos largos de población', !/Población:|Muestra:|Muestreo:|Criterio:|Unidad de análisis:/.test(html)]);
has((html.match(/class="mm-sub-h"/g) || []).length === 10 && /Métodos, Técnicas e Instrumentos/.test(html) && /Población y muestra/.test(html) && !/Método:|Técnicas:|Instrumentos:/.test(html), 'títulos de subbloque completos y sin rótulos');
has(/Intencionada/.test(html) && !/ntencional/.test(html), 'muestreo = "intencionada" (pob1.md §8.3)');
['Fase 1 · Revisión normativa', 'Fase 2 · Elaboración de cuestionarios', 'Fase 3 · Aplicación piloto', 'Fase 4 · ART y priorización', 'Fase 5 · Validación'].forEach(function (t) {
  has(html.includes(t), 'fase: ' + t);
});
const prods = (html.match(/class="mm-prod"/g) || []).length;
checks.push(['productos == 4 (fases 2-5)', prods === 4]);
has(/ND → NE → NP → NC → NR → NI\./.test(html), 'producto fase 3 (ND→NI)');
has(/Determinación del ND\./.test(html), 'producto fase 2');
has(/2024–2026/.test(html) && /NTP 324\/330/.test(html) && /12 procesos/.test(html) && /21 riesgos/.test(html) && /106\+83 aplicaciones\*/.test(html) && /8 validadores/.test(html) && /3 rondas Delphi/.test(html), 'indicadores superiores por fase');
has(/ART y priorización/.test(html) && /106 \(edificación\) \+ 83 \(infraestructura\)/.test(html), 'ruta y nota exactas de pob1.md');
has(!/Selección crítica/.test(html), 'no "selección crítica"');

checks.push(['circulo centrado en el eje horizontal del bloque 3', html.includes('left:563px;top:6px;width:240px;height:240px')]);
const escalas = [...html.matchAll(/--mm-fs:([\d.]+)/g)].map(function (x) { return Number(x[1]); });
checks.push(['escala de letra por bloque (4 x 1.000 + 1 menor en fase 5)', escalas.length === 5 && escalas.filter(function (v) { return Math.abs(v - 1) < 0.001; }).length === 4 && escalas.some(function (v) { return v > 0.85 && v < 0.98; })]);
const anchos = [...html.matchAll(/class="mm-rama mm-rama--[^"]*"[^>]*style="--mm-fs:[\d.]+;left:(\d+)px;top:(\d+)px;width:(\d+)px/g)].map(function (x) { return [+x[1], +x[2], +x[3]]; });
checks.push(['fase 5 mas estrecha que las laterales y centrada', anchos[4][2] === 500 && anchos[4][0] === (1366 - 500) / 2 && anchos[4][1] >= 128 + 124]);
const vals = [];
m.mapa.ramas.forEach(function (r) { r.pob.forEach(function (i) { vals.push(i.v); }); r.mti.forEach(function (x) { vals.push(x.m, x.t, x.i); }); });
checks.push(['valores de items <= 50 caracteres (una linea)', vals.every(function (v) { return v.length <= 50; })]);
checks.push(['ruta verde,rojo,verde,rojo,verde (coincide con las fases)', /mm-ruta-t--green[^>]*>Marco normativo/.test(html) && /mm-ruta-t--red[^>]*>Instrumentos/.test(html) && /mm-ruta-t--green[^>]*>Diagnóstico/.test(html) && /mm-ruta-t--red[^>]*>ART y priorización/.test(html) && /mm-ruta-t--green[^>]*>Validación/.test(html)]);

checks.push(['bloque 2: 5 insignias "Fase N" antes del numero', (html.match(/class="md-pnum">Fase [1-5]</g) || []).length === 5]);

/* --- ruta y nota --- */
has(/class="mm-ruta"/.test(html) && /class="mm-ruta-l"/.test(html), 'banda de ruta');
const rutaTokens = (html.match(/mm-ruta-t mm-ruta-t--/g) || []).length;
checks.push(['ruta tokens == 5', rutaTokens === 5]);
['green', 'red'].forEach(function (c) {
  has(html.includes('mm-ruta-t--' + c), 'ruta color ' + c);
});
has(/class="mm-note"/.test(html) && html.indexOf('mm-note') > html.indexOf('mm-ruta'), 'nota metodológica dentro de la banda de ruta');

/* --- bloques 1 y 2 intactos --- */
has(/md-panel--focus/.test(html) && /md-panel--phases/.test(html), 'bloques 1 y 2 intactos');
has(!/md-panel--pop/.test(html) && !/md-mid/.test(html) && !/md-bottom/.test(html), 'bloque 4 eliminado (fusionado en 3)');

/* ---:higiene --- */
checks.push(['no old md-mti', !/md-mti|md-pop-list|md-pop-item|md-chip|md-pob-|md-mc|md-mn|md-mcenter|md-map/.test(html)]);
checks.push(['no mermaid', !/mermaid/i.test(html)]);
checks.push(['no FOCUS_BLUE', !/173A5E/.test(html)]);
checks.push(['no naranja/violeta', !/f27a0a|6734c4|mm-rama--orange|mm-rama--violet/i.test(html)]);

let fail = 0;
checks.forEach(function (c) { if (!c[1]) { fail++; console.log('FAIL:', c[0]); } });
console.log((checks.length - fail) + '/' + checks.length + ' checks ok');
console.log('fases:');
m.mapa.ramas.forEach(function (r) {
  console.log(' ', r.pos, r.color, '·', r.title, '· pob', r.pob.length, '· mti', r.mti.length, '· chips', r.chips.length, '· prod', r.prod ? 'si' : 'no');
});
console.log('center:', m.mapa.center.title.join(' / '));

fs.writeFileSync(path.join(OUT, 'map_dom.html'),
  '<html><head><style>body{margin:0}.wrap{zoom:0.85;background:#fff;border:1px solid #ccc}</style></head><body><div class="wrap">' + html + '</div></body></html>');
console.log('written map_dom.html, len=' + html.length);
process.exit(fail ? 1 : 0);

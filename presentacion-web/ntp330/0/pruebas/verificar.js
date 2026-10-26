/* Verificación completa de la app NTP 330, en el orden que fija AGENTS.md §7:
     1. sintaxis de cada archivo JS
     2. carga en Chrome headless sin errores de consola y suite 52/52
     3. recorrido del bloque 2 y medidas de la fila de identificación
   Deja capturas y el informe en 0/pruebas/out/.

   Uso (desde la raíz del repositorio):
     node 0/pruebas/verificar.js
     node 0/pruebas/verificar.js --rapido    omite el recorrido del bloque 2
*/
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const AQUI = __dirname;
const RAIZ = path.resolve(AQUI, '..', '..');
const OUT = path.join(AQUI, 'out');
const rapido = process.argv.indexOf('--rapido') !== -1;

const NL = '\n';
const pasos = [];
let fallos = 0;

function titulo(t) {
  pasos.push({ paso: t, ok: null });
  console.log(NL + '== ' + t + ' ==');
}
function detalle(ok, mensaje) {
  pasos[pasos.length - 1].ok = ok;
  if (!ok) fallos++;
  console.log((ok ? '  OK   ' : '  FALLA ') + mensaje);
}
function correr(comando, args) {
  return spawnSync(comando, args, { cwd: RAIZ, encoding: 'utf8', shell: true });
}

/* ---------------------------------------------- 1. sintaxis de los JS */
titulo('1. Sintaxis (node --check)');
const js = fs.readdirSync(path.join(RAIZ, '0', 'js')).filter((f) => f.endsWith('.js'));
let conFallo = [];
js.forEach((f) => {
  const r = correr('node', ['--check', path.join('0', 'js', f)]);
  if (r.status !== 0) conFallo.push(f);
});
detalle(conFallo.length === 0,
  js.length + ' archivo(s) comprobados' + (conFallo.length ? ': fallan ' + conFallo.join(', ') : ''));

/* ------------------------------------- 2. carga y suite de 52 pruebas */
titulo('2. Carga en Chrome headless y suite de pruebas');
fs.mkdirSync(OUT, { recursive: true });
const r1 = correr('node', [
  path.join('0', 'pruebas', 'verificar-cdp.js'),
  path.join('0', 'pruebas', 'out', 'verificacion.png'),
  '--tab=pruebas', '--run'
]);
let informe1 = {};
try { informe1 = JSON.parse(r1.stdout.slice(r1.stdout.indexOf('{'))); } catch (e) { /* sin informe */ }
const veredicto = informe1.veredicto || '(sin veredicto)';
detalle(veredicto.indexOf('52/52') !== -1, 'Suite de pruebas: ' + veredicto);
const errores1 = informe1.consolaErrores || [];
detalle(errores1.length === 0,
  errores1.length ? 'errores de consola: ' + errores1.join(' | ') : 'sin errores de consola');

/* ---------------------------------- 3. recorrido del bloque 2 y medidas */
if (rapido) {
  console.log(NL + '== 3. Recorrido del bloque 2 ==');
  detalle(true, 'omitido con --rapido');
} else {
  titulo('3. Recorrido del bloque 2, aislamiento y alineación');
  const r2 = correr('node', [path.join('0', 'pruebas', 'prueba-bloque2.js')]);
  let informe2 = {};
  try { informe2 = JSON.parse(r2.stdout.slice(r2.stdout.indexOf('{'))); } catch (e) { /* sin informe */ }
  const errores2 = informe2.errores || [];
  const recorridoCorrecto = r2.status === 0 && !!informe2.bloque2 && errores2.length === 0;
  detalle(recorridoCorrecto,
    recorridoCorrecto ? 'recorrido completo sin errores, incluidos cinco PDF locales' :
      (errores2.join(' | ') || r2.stderr || 'No se obtuvo un informe válido del recorrido'));
  const fila = informe2.filaIdentificacion || {};
  if (fila.tipo && fila.proyecto && fila.proceso) {
    detalle(fila.tipo.top === fila.proyecto.top && fila.tipo.top === fila.proceso.top,
      'numeral 1 alineado: top ' + fila.tipo.top + ' / ' + fila.proyecto.top + ' / ' + fila.proceso.top +
      ', alto ' + fila.tipo.alto + ' px');
  }
  const movil = informe2.filaIdentificacionMovil || {};
  if (movil.proyecto) {
    detalle(!!movil.apilados && !!movil.listaDentro && !movil.desbordeH,
      'móvil: campos apilados, lista dentro de la ventana, sin desborde');
  }
}

/* ------------------------------------------------------------ resumen */
console.log(NL + '== Resumen ==');
pasos.forEach((p) => console.log('  ' + (p.ok === null ? '·' : p.ok ? 'OK' : 'FALLA') + ' ' + p.paso));
console.log(fallos === 0
  ? NL + 'VERIFICACIÓN CORRECTA' + NL
  : NL + 'VERIFICACIÓN CON ' + fallos + ' FALLO(S): revisar antes de entregar' + NL);

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'verificacion.json'),
  JSON.stringify({ fecha: new Date().toISOString(), fallos: fallos, pasos: pasos }, null, 2));
process.exit(fallos === 0 ? 0 : 1);

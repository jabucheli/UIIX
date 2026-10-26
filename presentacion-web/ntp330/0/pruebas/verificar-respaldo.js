/* Comprueba que un archivo de respaldo sirve, sin abrir el navegador.
   Sirve para no descubrir que el JSON estaba vacío o corrupto justo cuando ya
   se necesita: un respaldo que no se valida es una suposición.

   Uso:
     node 0/pruebas/verificar-respaldo.js <archivo.json>
     node 0/pruebas/verificar-respaldo.js            (busca el más reciente)
*/
'use strict';

const fs = require('fs');
const path = require('path');

const PREFIJO = 'ntp330.';
const SALIDA = path.join(__dirname, 'out', 'respaldos');

function msg(m) { console.log("  " + m); }
function fallo(m) { console.error('  FALLA ' + m); process.exitCode = 1; }

/** Elige el respaldo más reciente por fecha de nombre o de modificación. */
function masReciente() {
  if (!fs.existsSync(SALIDA)) return null;
  const archivos = fs.readdirSync(SALIDA).filter((f) => f.endsWith('.json'));
  if (!archivos.length) return null;
  archivos.sort((a, b) => {
    const fa = fs.statSync(path.join(SALIDA, a)).mtimeMs;
    const fb = fs.statSync(path.join(SALIDA, b)).mtimeMs;
    return fb - fa;
  });
  return path.join(SALIDA, archivos[0]);
}

console.log('== Verificación de respaldo NTP 330 ==');

const ruta = process.argv[2] ? path.resolve(process.argv[2]) : masReciente();
if (!ruta) {
  fallo('No hay ningún respaldo. Indica la ruta de un archivo .json');
  console.log('  Se guardan en: ' + SALIDA);
  process.exit(1);
}
msg('Archivo: ' + ruta);
if (!fs.existsSync(ruta)) {
  fallo('El archivo no existe');
  process.exit(1);
}

let paquete;
try {
  paquete = JSON.parse(fs.readFileSync(ruta, 'utf8'));
} catch (e) {
  fallo('No es un JSON legible: ' + e.message);
  process.exit(1);
}

/* --- forma del paquete --- */
if (!paquete || typeof paquete !== 'object' || !paquete.datos) {
  fallo('Falta la propiedad "datos": no lo generó esta aplicación');
  process.exit(1);
}
const claves = Object.keys(paquete.datos).filter((k) => k.indexOf(PREFIJO) === 0);
if (!claves.length) {
  fallo('No contiene ninguna clave "ntp330.*"');
  process.exit(1);
}

/* --- contenido --- */
function leerJson(clave) {
  try { return JSON.parse(paquete.datos[clave] || '[]'); } catch (e) { return null; }
}
const evaluaciones = leerJson(PREFIJO + 'evaluaciones');
const proyectos = leerJson(PREFIJO + 'proyectos');
if (evaluaciones === null || proyectos === null) {
  fallo('"ntp330.evaluaciones" o "ntp330.proyectos" no contiene un JSON válido');
  process.exit(1);
}

const riesgos = evaluaciones.reduce((n, ev) => n + Object.keys(ev.riesgos || {}).length, 0);
/* Una evaluación cuenta como «con datos» si tiene riesgos o respuestas: se mira
   cualquiera de los dos, porque `respuestas` puede venir vacío y aun así la
   evaluación tener sus riesgos evaluados. */
const conDatos = evaluaciones.filter(function (ev) {
  return Object.keys(ev.riesgos || {}).length || Object.keys(ev.respuestas || {}).length;
}).length;

console.log('  Claves ntp330.*: ' + claves.length);
msg('  Evaluaciones: ' + evaluaciones.length);
msg('  Proyectos: ' + proyectos.length);
msg('  Riesgos evaluados: ' + riesgos);
msg('  Generado: ' + (paquete.generadoEn || '(sin fecha)'));

if (!evaluaciones.length) {
  fallo('El respaldo no tiene evaluaciones: solo sirve como copia del catálogo');
}
if (!riesgos && claves.length > 2) {
  fallo('Hay claves pero ningún riesgo guardado: revisa si la exportación se hizo a medias');
}
if (paquete.resumen && (paquete.resumen.evaluaciones !== evaluaciones.length)) {
  fallo('El resumen del archivo dice ' + paquete.resumen.evaluaciones +
    ' evaluaciones pero contiene ' + evaluaciones.length);
}
if (!process.exitCode) {
  console.log('\n  RESPALDO CORRECTO (' + conDatos + ' evaluación(es) con datos)');
}
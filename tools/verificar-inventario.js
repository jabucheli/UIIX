'use strict';
/*
 * verificar-inventario.js
 *
 * Comprueba que la carpeta presentacion contiene TODO lo necesario para retomar el
 * trabajo en este u otro computador, a partir de tools/inventario.json.
 *
 * Uso:
 *   node tools/verificar-inventario.js          (desde cualquier directorio)
 *   node verificar-inventario.js                (desde tools/)
 *
 * Devuelve (código de salida):
 *   0 = TODOS los elementos requeridos existen (INVENTARIO OK)
 *   1 = falta al menos un archivo o carpeta requerida
 *
 * No usa dependencias: solo módulos nativos de Node.
 *
 * Notas:
 * - Los directorios/carpetas "generadas" (tools/node_modules, tools/out, ...)
 *   NO son requeridas: se regeneran y no viajan entre equipos.
 * - La app NTP 330 y sus fuentes forman parte del mismo arbol presentacion.
 * - Lo que git tenga sin commitear se informa como aviso: no rompe la
 *   verificación de "presencia física", pero sin commit el código no viaja en
 *   git (sí viaja en el paquete de tools/traspaso.cmd).
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const tools = __dirname;
const tes = path.resolve(tools, '..');
const inventario = JSON.parse(fs.readFileSync(path.join(tools, 'inventario.json'), 'utf8'));

function existeArchivo(r) {
  const p = path.join(tes, r);
  try { return fs.statSync(p).isFile(); } catch (e) { return false; }
}

function existeDir(r) { return path.join(tes, r); }

function estadoDir(r) {
  try {
    const st = fs.statSync(path.join(tes, r));
    if (!st.isDirectory()) return null;
    return fs.readdirSync(path.join(tes, r)).length;
  } catch (e) { return null; }
}

function normal(r) { return r.replace(/\\/g, '/'); }

const ok = [];
const falta = [];
const avisos = [];

/* 1. Archivos requeridos */
for (const r of inventario.archivosReq) {
  if (existeArchivo(r)) ok.push(r); else falta.push(r);
}

/* 2. Directorios requeridos */
for (const d of inventario.directoriosReq) {
  const n = estadoDir(d.ruta);
  if (n === null) falta.push(d.ruta + '/');
  else if (n < d.min) falta.push(d.ruta + '/ (solo ' + n + ' elementos; mínimo ' + d.min + ')');
  else ok.push(d.ruta + '/ (' + n + ' elementos)');
}

/* 4. Generados: se informa pero NO son requeridos */
for (const g of inventario.generados) {
  const p = path.resolve(tes, g);
  if (fs.existsSync(p)) avisos.push('generado presente: ' + g + '  (no viaja en el paquete)');
}

/* 5. Basura: si existe, avisar (no viaja ni se commitea) */
for (const b of inventario.basura) {
  if (fs.existsSync(path.resolve(tes, b))) avisos.push('basura presente: ' + b + '  (excluida de git y del paquete)');
}

/* 6. Estado de git (lo que no está guardado en el historial) */
function esBasuraOGenerado(q) {
  if (q === 'f') return true;
  if (/^~\$/.test(q) || /^~WRL/.test(q)) return true;
  if (/\.tmp$/.test(q)) return true;
  if (q.indexOf('tools/node_modules/') === 0) return true;
  if (q.indexOf('tools/out/') === 0) return true;
  if (q.indexOf('presentacion-web/ntp330/0/pruebas/out/') === 0) return true;
  return false;
}

let git = null;
let gitBranch = '';
const sinCommit = [];
const borrados = [];
const hayGit = fs.existsSync(path.join(tes, '.git'));
if (!hayGit) {
  avisos.push('sin carpeta .git (copia extraída del paquete de traspaso): el historial se restaura con historial-presentacion.bundle.');
} else {
  try { git = spawnSync('git', ['-C', tes, 'status', '--porcelain', '--branch'], { encoding: 'utf8' }); }
  catch (e) { git = null; }
}

if (hayGit && (!git || git.error)) {
  avisos.push('git no disponible: no se pudo comprobar el estado del historial.');
} else if (hayGit) {
  const lineas = git.stdout.split(/\r?\n/);
  for (const ln0 of lineas) {
    if (!ln0) continue;
    if (/^##/.test(ln0)) { gitBranch = ln0.replace(/^## /, ''); continue; }
    // Porcelain: 2 primeros caracteres = estado (X Y); el 3º es un espacio.
    const st = ln0.slice(0, 2).replace(/\s+/g, '') || '??';
    let q = ln0.slice(3).trim().replace(/^"|"$/g, '');
    if (q.indexOf(' -> ') > 0) q = q.split(' -> ').pop(); // rename "old -> new"
    if (st === 'D') { borrados.push(q); continue; }
    if (esBasuraOGenerado(normal(q))) continue;
    sinCommit.push({ st: st, q: q });
  }
}

/* ------------------------------------------------------------------ */
/* SALIDA                                                              */
/* ------------------------------------------------------------------ */
console.log('==================================================');
console.log(' Inventario de ' + inventario.proyecto + ' — ' + tes);
console.log(' ' + inventario.descripcion);
console.log('==================================================');

console.log('\n[REQUERIDOS] ' + ok.length + ' OK  |  ' + falta.length + ' FALTAN');
for (const f of falta) console.log('  [FALTA] ' + f);
for (const o of ok) console.log('  [OK]    ' + o);

console.log('\n[AVISOS] ' + avisos.length);
if (avisos.length === 0) console.log('  (ninguno)');
for (const a of avisos) console.log('  [!] ' + a);

console.log('\n[GIT] ' + (hayGit ? ('rama ' + (gitBranch || '(no detectada)')) : 'sin repositorio .git en esta copia'));
const totalGC = sinCommit.length + borrados.length;
if (!hayGit) {
  console.log('  (nada que comprobar: el historial se restaura con historial-presentacion.bundle)');
} else if (totalGC === 0) {
  console.log('  Arbol limpio: nada pendiente de commit.');
} else {
  console.log('  ' + sinCommit.length + ' archivo(s) sin commitear y ' + borrados.length + ' borrado(s) de git:');
  for (const s of sinCommit) {
    const suf = /\/$/.test(s.q) ? '  (carpeta nueva completa)' : '   (' + (s.st || 'nuevo') + ')';
    console.log('    * ' + s.q + suf);
  }
  for (const b of borrados) console.log('    - (borrado) ' + b);
  console.log('  guardar.cmd conserva estos archivos en el ZIP junto con el historial Git existente.');
}

console.log('\n[PROXIMO PASO]');
console.log('  guardar.cmd                  respaldo verificado del proyecto integrado');
console.log('  tools\\traspaso.cmd            verificacion solo (igual que esto)');
console.log('  tools\\traspaso.cmd paquete     ademas genera el .zip portable para otro equipo');

if (falta.length > 0) {
  console.log('\nINVENTARIO INCOMPLETO: faltan ' + falta.length + ' elemento(s) requerido(s).');
  process.exit(1);
}
console.log('\nINVENTARIO OK: la carpeta tiene todo lo necesario.');
process.exit(0);

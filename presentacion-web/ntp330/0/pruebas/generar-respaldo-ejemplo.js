/* Genera un respaldo de EJEMPLO para poder probar el validador sin depender del
   navegador donde está el trabajo real. Los datos que crea son ficticios.
   No es una herramienta de uso diario: el respaldo de verdad sale de la
   pestaña Catálogo → «Exportar respaldo (JSON)».

   Uso: node 0/pruebas/generar-respaldo-ejemplo.js
*/
'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const CHROME = process.env.NTP330_CHROME ||
  'C:/Program Files/Google/Chrome/Application/chrome.exe';
const APP = path.resolve(__dirname, '..', 'index.html');
const WORK = path.resolve(__dirname, '..', '..', '..', '..', 'tools', 'out', 'ntp330_respaldo_demo_' + process.pid);
const DESTINO = path.join(__dirname, 'out', 'respaldos', 'ntp330-respaldo-ejemplo.json');
const NL = '\n';
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

function esperarJson(puerto, intentos) {
  return new Promise((res, rej) => {
    /* Sin pausa entre intentos se agotan los 60 antes de que Chrome levante */
    const intento = (n) => {
      if (n <= 0) return rej(new Error('Chrome no respondió en el puerto ' + puerto));
      const pet = http.get({ host: '127.0.0.1', port: puerto, path: '/json/version', timeout: 1000 }, (r) => {
        let d = '';
        r.on('data', (c) => { d += c; });
        r.on('end', () => {
          try { res(JSON.parse(d)); } catch (e) { setTimeout(() => intento(n - 1), 250); }
        });
      });
      pet.on('error', () => setTimeout(() => intento(n - 1), 250));
      pet.on('timeout', () => { pet.destroy(); setTimeout(() => intento(n - 1), 250); });
    };
    intento(intentos);
  });
}

async function main() {
  fs.rmSync(WORK, { recursive: true, force: true });
  fs.mkdirSync(WORK, { recursive: true });
  const puerto = 9700 + Math.floor(Math.random() * 200);
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-first-run',
    '--host-resolver-rules=MAP cdnjs.cloudflare.com 127.0.0.1:1',
    '--remote-debugging-port=' + puerto,
    '--user-data-dir=' + path.join(WORK, 'perfil'),
    'about:blank'
  ], { stdio: 'ignore' });

  const v = await esperarJson(puerto, 60);
  const ws = new WebSocket(v.webSocketDebuggerUrl);
  await new Promise((r, j) => {
    ws.addEventListener('open', r, { once: true });
    ws.addEventListener('error', j, { once: true });
  });
  let id = 0;
  const pendientes = new Map();
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id !== undefined && pendientes.has(m.id)) {
      const p = pendientes.get(m.id);
      pendientes.delete(m.id);
      if (m.error) p.rej(new Error(m.error.message)); else p.res(m.result);
    }
  });
  const enviar = (method, params, sessionId) => new Promise((res, rej) => {
    const i = ++id;
    const msg = { id: i, method: method, params: params || {} };
    if (sessionId) msg.sessionId = sessionId;
    pendientes.set(i, { res: res, rej: rej });
    ws.send(JSON.stringify(msg));
  });

  const { targetId } = await enviar('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await enviar('Target.attachToTarget', { targetId: targetId, flatten: true });
  await enviar('Runtime.enable', {}, sessionId);
  await enviar('Page.navigate', {
    url: 'file:///' + APP.split(path.sep).join('/')
  }, sessionId);
  await dormir(2500);

  const evaluar = async (expresion) => {
    const r = await enviar('Runtime.evaluate',
      { expression: expresion, returnByValue: true, awaitPromise: true }, sessionId);
    /* Un error dentro de la página no lanza excepción en Node: llega en
       exceptionDetails. Sin esto, un simple ReferenceError pasaba por bueno y
       el respaldo salía vacío. */
    if (r.exceptionDetails) {
      const d = r.exceptionDetails;
      throw new Error('error en la página: ' +
        ((d.exception && d.exception.description) || d.text || 'desconocido').split(NL)[0]);
    }
    return r.result.value;
  };

/* Datos ficticios: un proyecto, dos procesos evaluados y una edición del catálogo.
     Los códigos salen de APP_CATALOGO, que es el global real del catálogo. */
  await evaluar(`(function () {
    var codigos = APP_CATALOGO.map(function (c) { return c.codigo; });
    DBApp.crearProyecto('Ejemplo Edificio Norte', 'Estructura');
    ['Excavaciones', 'Cimentacion'].forEach(function (proceso, pi) {
      var ev = DBApp.nuevaEvaluacion({
        tipoProyecto: 'Estructura', proyecto: 'Ejemplo Edificio Norte', proceso: proceso
      });
      ev.riesgos = {};
      ev.respuestas = {};
      for (var i = 0; i < 8; i++) {
        var k = 'R' + i;
        ev.riesgos[k] = {
          codigo: codigos[(pi * 8 + i) % codigos.length],
          grupo: 'G', ne: (i % 4) * 20, nc: 9,
          respuestas: {}, actualizado: new Date().toISOString()
        };
      }
      ev.riesgos.R0.ne = 20; ev.riesgos.R0.nc = 25;
      DBApp.guardarEvaluacion(ev);
    });
    return true;
  })()`);

  const paquete = await evaluar('BackupApp.construir()');
  if (!paquete || !paquete.datos || !paquete.resumen.evaluaciones) {
    throw new Error('el respaldo salió sin evaluaciones; no sirve como prueba');
  }
  fs.mkdirSync(path.dirname(DESTINO), { recursive: true });
  fs.writeFileSync(DESTINO, JSON.stringify(paquete, null, 2));
  console.log('Respaldo de ejemplo: ' + DESTINO);
  console.log('Resumen: ' + JSON.stringify(paquete.resumen));

  chrome.kill();
  /* Chrome puede dejar archivos tomados en el perfil temporal */
  await dormir(400);
  try { fs.rmSync(WORK, { recursive: true, force: true }); } catch (e) { /* temporal */ }
}

main().then(() => process.exit(0), (e) => {
  console.error('No se pudo generar el respaldo de ejemplo: ' + e.message);
  process.exit(1);
});

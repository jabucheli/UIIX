/* Controlador CDP de la app NTP 330 (D:\ejemplo\tesis\0).
   Herramienta de trabajo para verificar cambios visuales y funcionales:
   carga la app en Chrome headless, recoge errores de consola, abre la
   pestaña pedida, ejecuta la suite de pruebas, audita el DOM y captura
   pantalla. Sin dependencias npm: usa el WebSocket global de Node 22.

   Uso:
     node app_cdp.js <salida.png> [--tab=pruebas] [--run] [--full]
                    [--width=1368] [--height=900] [--scale=1] [--keep]
                    [--viewport] [--flow] [--pdf]

   Opciones:
     --tab=<id>   pulsa la pestaña con data-tab=<id> tras cargar
     --run        pulsa #btnEjecutarPruebas y espera al veredicto
     --full       captura la página completa, no solo la ventana
     --keep       no borra la copia de trabajo ni el perfil temporal
     --viewport   fija exactamente el tamaño interior (para simular el iframe)
     --flow       recorre proyecto, proceso, checklist, guardado, ART y gráficos
     --pdf        carga las bibliotecas del CDN y guarda los PDF del recorrido
*/
'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP = path.resolve(__dirname, '..', '..', 'tesis', '0', 'index.html');
const WORK = path.join(__dirname, 'out', '_cdp_' + process.pid);
const NL = '\n';
let navegador;
let conexion;
let cliente;

/* ---------------------------------------------------------------- opciones */
const argv = process.argv.slice(2);
const salida = argv.find((a) => !a.startsWith('--'));
const flag = (n) => argv.indexOf('--' + n) !== -1;
const opt = (n, d) => {
  const a = argv.find((x) => x.startsWith('--' + n + '='));
  return a ? a.slice(n.length + 3) : d;
};
const tab = opt('tab', '');
const run = flag('run');
const full = flag('full');
const keep = flag('keep');
const viewport = flag('viewport');
const flow = flag('flow');
const pdf = flag('pdf');
const W = parseInt(opt('width', '1368'), 10);
const H = parseInt(opt('height', '900'), 10);
const SCALE = parseFloat(opt('scale', '1'));

if (!salida) {
  console.error('uso: node app_cdp.js <salida.png> [--tab=pruebas] [--run] [--flow] [--pdf] [--full]');
  process.exit(2);
}

/* ------------------------------------------------- copia de trabajo propia */
fs.rmSync(WORK, { recursive: true, force: true });
fs.mkdirSync(WORK, { recursive: true });
const APP_COPY = path.join(WORK, 'app');
fs.cpSync(path.dirname(APP), APP_COPY, { recursive: true });
const url = 'file:///' + path.join(APP_COPY, 'index.html').split(path.sep).join('/');
const perfil = path.join(WORK, 'perfil');

/* ------------------------------------------------------- cliente CDP mínimo */
function esperarJson(puerto, intentos) {
  return new Promise((res, rej) => {
    const intento = (n) => {
      const pet = http.get({ host: '127.0.0.1', port: puerto, path: '/json/version', timeout: 1000 }, (r) => {
        let d = '';
        r.on('data', (c) => { d += c; });
        r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { retry(n, e); } });
      });
      pet.on('error', (e) => retry(n, e));
      pet.on('timeout', () => { pet.destroy(); retry(n, new Error('timeout')); });
    };
    const retry = (n, e) => {
      if (n <= 0) return rej(e);
      setTimeout(() => intento(n - 1), 250);
    };
    intento(intentos || 40);
  });
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pendientes = new Map();
    this.oyentes = [];
    ws.addEventListener('message', (ev) => {
      let m;
      try { m = JSON.parse(ev.data); } catch (e) { return; }
      if (m.id !== undefined && this.pendientes.has(m.id)) {
        const { res, rej } = this.pendientes.get(m.id);
        this.pendientes.delete(m.id);
        if (m.error) rej(new Error(m.error.message + ' (' + JSON.stringify(m.error) + ')'));
        else res(m.result);
      } else if (m.method) {
        this.oyentes.forEach((f) => f(m));
      }
    });
  }
  on(f) { this.oyentes.push(f); }
  enviar(method, params, sessionId) {
    const id = ++this.id;
    const msg = { id, method, params: params || {} };
    if (sessionId) msg.sessionId = sessionId;
    return new Promise((res, rej) => {
      const timeout = setTimeout(() => {
        this.pendientes.delete(id);
        rej(new Error('timeout CDP: ' + method));
      }, 75000);
      this.pendientes.set(id, {
        res: (result) => { clearTimeout(timeout); res(result); },
        rej: (error) => { clearTimeout(timeout); rej(error); }
      });
      this.ws.send(JSON.stringify(msg));
    });
  }
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/* Se ejecuta dentro de la página y solo en el perfil desechable del driver. */
function verificarFlujo() {
  var o = {}, alertas = [];
  var alertaOriginal = window.alert, confirmarOriginal = window.confirm;
  var abrirOriginal = window.open;
  function exigir(ok, mensaje) { if (!ok) throw new Error(mensaje); }
  function pulsar(selector) {
    var e = document.querySelector(selector);
    exigir(!!e && !e.disabled, 'Control no disponible: ' + selector);
    e.click();
  }
  function cambiar(selector, valor) {
    var e = document.querySelector(selector);
    exigir(!!e, 'Campo no disponible: ' + selector);
    e.value = valor;
    e.dispatchEvent(new Event('change', { bubbles: true }));
  }
  window.alert = function (texto) { alertas.push(texto); };
  window.confirm = function () { return true; };
  try {
    pulsar('.tab-btn[data-tab="evaluacion"]');
    pulsar('#btnCrearProyecto');
    cambiar('#inpNuevoProyectoNombre', 'Verificación visual del tema');
    cambiar('#selNuevoProyectoTipo', 'Estructura');
    pulsar('#proyecto-guardar');
    var proyecto = DBApp.listarProyectos()[0];
    exigir(proyecto && proyecto.id === 'PROY-0001', 'No se creó el proyecto');
    o.proyecto = proyecto.id;

    var opciones = Array.prototype.slice.call(document.querySelectorAll('#selProceso option'));
    var opcion = opciones.filter(function (op) {
      if (!op.value) return false;
      var riesgos = AppUI.getRiesgosDeProceso('Estructura', op.value);
      return riesgos.length && riesgos[0].catalogo.preguntas.length;
    })[0];
    exigir(!!opcion, 'No hay proceso con lista de chequeo');
    cambiar('#selProceso', opcion.value);
    pulsar('.riesgo-tab');
    o.proceso = opcion.value;
    o.riesgosGenerados = document.querySelectorAll('.riesgo-tab').length;
    pulsar('.btn-guardar');
    exigir(alertas[alertas.length - 1].indexOf('no puede guardarse') !== -1,
      'No se bloqueó el guardado incompleto');
    o.guardadoIncompletoBloqueado = true;

    var radios = document.querySelectorAll('.ck-radio[value="no"]');
    exigir(radios.length > 0, 'No se renderizó el checklist');
    Array.prototype.forEach.call(radios, function (e) {
      e.checked = true;
      e.dispatchEvent(new Event('change', { bubbles: true }));
    });
    o.preguntasRespondidas = radios.length;
    cambiar('.sel-ne', '2');
    cambiar('.jus-ne', 'Exposición frecuente verificada en campo');
    cambiar('.sel-nc', '25');
    cambiar('.jus-nc', 'Lesión grave con incapacidad temporal');
    pulsar('.btn-guardar');
    var riesgo = AppUI.riesgoActivo(), resultado = AppUI.resultadoDe(riesgo);
    var guardada = DBApp.listarEvaluaciones()[0];
    exigir(guardada && guardada.riesgos[riesgo.id].evaluadoEn, 'No se guardó el resultado');
    exigir(resultado.nd === 10 && resultado.np === 20 && resultado.nr === 500,
      'Resultado inesperado al completar la lista');
    o.evaluacion = guardada.id;
    o.resultado = { nd: resultado.nd, ne: resultado.ne.valor, np: resultado.np,
      nc: resultado.nc.valor, nr: resultado.nr, ni: resultado.ni.ni };
    o.badgeGuardado = getComputedStyle(document.getElementById('estado-cambios')).backgroundColor;
    pulsar('.btn-traza');
    o.tituloTraza = getComputedStyle(document.querySelector('#traza-contenido h4')).color;
    pulsar('#traza-cerrar');

    /* Capturar la vista imprimible real sin abrir el diálogo del navegador. */
    var vistas = [];
    window.open = function () {
      var doc = document.implementation.createHTMLDocument('Reporte de verificación');
      vistas.push(doc);
      return { document: doc, print: function () {} };
    };
    pulsar('#btnARTPreview');
    exigir(vistas[0].body.textContent.indexOf(guardada.id) !== -1, 'ART sin ID de evaluación');
    o.filasART = vistas[0].querySelectorAll('table tr').length - 1;

    if (window.__pdfVerificacion) {
      pulsar('#btnDescargarPDF');
      pulsar('#btnART_A3');
      pulsar('.btn-pdf-campo');
      pulsar('.btn-pdf-lista');
    }
    var biblioteca = window.jspdf;
    try {
      window.jspdf = undefined;
      pulsar('.btn-pdf-campo');
    } finally { window.jspdf = biblioteca; }
    var campo = vistas[vistas.length - 1];
    var filasCampo = Array.prototype.slice.call(campo.querySelectorAll('table tr'), 1);
    exigir(filasCampo.length === radios.length, 'Lista de campo incompleta');
    exigir(filasCampo.every(function (fila) {
      return [2, 3, 4].every(function (col) { return fila.cells[col].textContent === ''; });
    }), 'La lista de campo tiene respuestas impresas');
    o.listaCampoVacia = true;

    pulsar('.tab-btn[data-tab="matriz-unificada"]');
    var selector = document.getElementById('selProyectoUnificado');
    cambiar('#selProyectoUnificado', selector.options[1].value);
    o.filasUnificadas = document.querySelectorAll('#tabla-unificada tbody tr').length;
    o.graficos = ['chart-riesgos-proceso', 'chart-nr-promedio', 'chart-ni-distribucion'].map(function (id) {
      var canvas = document.getElementById(id), ctx = canvas.getContext('2d');
      var pixeles = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      var colores = {}, pintados = 0;
      for (var i = 0; i < pixeles.length; i += 4) {
        if (!pixeles[i + 3]) continue;
        pintados++;
        colores[[pixeles[i], pixeles[i + 1], pixeles[i + 2]].join(',')] = true;
      }
      exigir(pintados > 0, 'Gráfico vacío: ' + id);
      return { id: id, pixelesPintados: pintados, fuente: ctx.font,
        verdeTema: !!colores['0,110,73'], rojoTema: !!colores['192,36,42'],
        naranjaNI: !!colores['239,108,0'] };
    });
    exigir(o.graficos[0].verdeTema && o.graficos[1].rojoTema && o.graficos[2].naranjaNI,
      'Los gráficos no respetan el tema o los colores NI');
    window.scrollTo(0, 0);
    return o;
  } finally {
    window.alert = alertaOriginal;
    window.confirm = confirmarOriginal;
    window.open = abrirOriginal;
  }
}

function instrumentarPdf() {
  window.__pdfVerificacion = [];
  var crear = window.jspdf.jsPDF;
  window.jspdf.jsPDF = function (opciones) {
    var doc = new crear(opciones), tablas = [], tabla = doc.autoTable;
    doc.autoTable = function (o) {
      var resumen = { filas: o.body.length,
        respuestasVacias: o.head[0][1] === 'Pregunta / Acción sujeta a evaluación'
          ? o.body.every(function (fila) { return fila[2] === '' && fila[3] === '' && fila[4] === ''; })
          : null };
      var resultado = tabla.call(doc, o);
      var ancho = doc.lastAutoTable.columns.reduce(function (suma, col) { return suma + col.width; }, 0);
      resumen.cabeEnPagina = doc.lastAutoTable.settings.margin.left + ancho
        <= doc.internal.pageSize.getWidth() - doc.lastAutoTable.settings.margin.right + 0.01;
      tablas.push(resumen);
      return resultado;
    };
    doc.save = function (nombre) {
      window.__pdfVerificacion.push({ nombre: nombre, tablas: tablas,
        ancho: doc.internal.pageSize.getWidth(), alto: doc.internal.pageSize.getHeight(),
        paginas: doc.internal.getNumberOfPages(),
        base64: doc.output('datauristring').split(',')[1] });
    };
    return doc;
  };
  return true;
}

async function main() {
  const puerto = 9400 + Math.floor(Math.random() * 400);
  const perfilTmp = perfil;
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--hide-scrollbars',
    '--force-device-scale-factor=' + SCALE,
    '--window-size=' + W + ',' + H,
    /* jsPDF/autotable vienen de CDN y sin internet se quedan pendientes
       eternamente. La app contempla ese caso y cae al HTML imprimible, así
       que los hacemos fallar de inmediato para no bloquear la carga. */
    '--host-resolver-rules=MAP cdnjs.cloudflare.com 127.0.0.1:1',
    '--remote-debugging-port=' + puerto,
    '--user-data-dir=' + perfilTmp,
    'about:blank'
  ], { stdio: 'ignore' });
  navegador = chrome;

  let ws;
  try {
    const v = await esperarJson(puerto, 60);
    ws = new WebSocket(v.webSocketDebuggerUrl);
    conexion = ws;
    await new Promise((res, rej) => {
      ws.addEventListener('open', res, { once: true });
      ws.addEventListener('error', rej, { once: true });
    });
  } catch (e) {
    chrome.kill();
    throw new Error('no se pudo hablar con Chrome: ' + e.message);
  }

  const cdp = new Cdp(ws);
  cliente = cdp;
  const errores = [];
  const avisos = [];
  cdp.on((m) => {
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails;
      errores.push('excepción: ' + (d.exception && d.exception.description ? d.exception.description.split(NL)[0] : d.text));
    }
    if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'warning')) {
      const txt = m.params.args.map((a) => (a.value !== undefined ? a.value : a.description || a.type)).join(' ');
      if (m.params.type === 'error') errores.push('consola: ' + txt);
      else avisos.push('consola: ' + txt);
    }
    if (m.method === 'Log.entryAdded') {
      const e = m.params.entry;
      const txt = e.text + (e.url ? ' (' + String(e.url).split('/').pop() + ')' : '');
      if (e.level === 'error') {
        /* Sin internet los dos CDN no cargan: es esperado y la app lo
           contempla, así que no cuenta como error de la app. */
        if (/^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/(jspdf|jspdf-autotable)\//.test(e.url || '')) avisos.push('red: ' + txt);
        else errores.push('log: ' + txt);
      } else if (e.level === 'warning') {
        avisos.push('log: ' + txt);
      }
    }
  });

  const { targetId } = await cdp.enviar('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.enviar('Target.attachToTarget', { targetId, flatten: true });
  const S = sessionId;

  await cdp.enviar('Runtime.enable', {}, S);
  await cdp.enviar('Log.enable', {}, S);
  await cdp.enviar('Page.enable', {}, S);
  if (viewport) {
    await cdp.enviar('Emulation.setDeviceMetricsOverride', {
      width: W, height: H, deviceScaleFactor: SCALE, mobile: false
    }, S);
  }

  const cargado = new Promise((res) => {
    const f = (m) => { if (m.method === 'Page.loadEventFired' && m.sessionId === S) res(); };
    cdp.on(f);
  });
  await cdp.enviar('Page.navigate', { url }, S);
  await Promise.race([cargado, dormir(30000)]);
  await dormir(1200); // los scripts de la app resuelven al final del load

  const evaluar = async (expression) => {
    const r = await cdp.enviar('Runtime.evaluate', {
      expression, returnByValue: true, awaitPromise: true
    }, S);
    if (r.exceptionDetails) {
      throw new Error('evaluate: ' + (r.exceptionDetails.exception ? r.exceptionDetails.exception.description : r.exceptionDetails.text));
    }
    return r.result.value;
  };

  /* En la página se espera con reloj real (aquí no hay tiempo virtual). */
  const esperarEn = (expr, ms) => evaluar(
    'new Promise(function(res){var t0=Date.now();(function w(){' +
    'try{if(' + expr + '){return res(true);}}catch(e){}' +
    'if(Date.now()-t0>' + ms + '){return res(false);}' +
    'setTimeout(w,100);})();})'
  );

  const informe = {};

  if (tab) {
    const ok = await esperarEn(
      '!!document.querySelector(\'.tab-btn[data-tab="' + tab + '"]\')', 5000
    );
    if (!ok) throw new Error('no existe la pestaña ' + tab);
    await evaluar('document.querySelector(\'.tab-btn[data-tab="' + tab + '"]\').click(), true');
    await dormir(700);
  }

  if (run) {
    const ok = await esperarEn('!!document.getElementById("btnEjecutarPruebas")', 5000);
    if (!ok) throw new Error('no existe #btnEjecutarPruebas');
    await evaluar('document.getElementById("btnEjecutarPruebas").click(), true');
    const termino = await esperarEn(
      '(function(){var r=document.getElementById("resumen-pruebas");' +
      'return !!r && !r.classList.contains("oculto") && r.textContent.length>0;})()', 60000
    );
    if (!termino) throw new Error('las pruebas no terminaron en 60 s');
    informe.veredicto = await evaluar('document.getElementById("resumen-pruebas").textContent');
    informe.fallos = await evaluar(
      'document.querySelectorAll("#detalle-pruebas .prueba-item.fail").length'
    );
    informe.detalles = await evaluar(
      'Array.prototype.map.call(document.querySelectorAll("#detalle-pruebas .prueba-item.fail"),' +
      'function(d){return d.textContent.trim().slice(0,160);})'
    );
    if (informe.veredicto !== 'TODAS LAS PRUEBAS PASARON (52/52)' || informe.fallos !== 0) {
      errores.push('suite de pruebas: ' + informe.veredicto);
    }
  }

  if (pdf) {
    if (!flow) throw new Error('--pdf necesita --flow');
    /* Cargar exactamente las versiones que usa index.html. La conexión del
       driver no tiene el bloqueo de CDN del navegador para la prueba offline. */
    for (const src of [
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js'
    ]) {
      const response = await fetch(src, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error('CDN: HTTP ' + response.status);
      await evaluar(await response.text());
    }
    await evaluar('(' + instrumentarPdf.toString() + ')()');
  }
  if (flow) {
    informe.flujo = await evaluar('(' + verificarFlujo.toString() + ')()');
    if (pdf) {
      const documentos = await evaluar('window.__pdfVerificacion');
      if (documentos.length !== 4) throw new Error('No se generaron los cuatro PDF');
      if (documentos.slice(0, 3).some((documento) => documento.ancho <= documento.alto)) {
        throw new Error('ART o lista de campo sin orientación horizontal');
      }
      if (!documentos[2].tablas[0].respuestasVacias) throw new Error('PDF de campo con respuestas');
      if (documentos.some((documento) => documento.tablas.some((tabla) => !tabla.cabeEnPagina))) {
        throw new Error('Tabla PDF fuera de los márgenes de la página');
      }
      informe.pdf = documentos.map((documento, indice) => {
        const archivo = path.join(path.dirname(path.resolve(salida)), 'reporte_' + indice + '.pdf');
        fs.writeFileSync(archivo, Buffer.from(documento.base64, 'base64'));
        delete documento.base64;
        return { ...documento, archivo };
      });
    }
  }

  /* Auditoría del DOM: útil para ver cambios de tema y desbordes. */
  informe.estructura = await evaluar(`(function () {
    var o = {};
    o.doc = document.documentElement.scrollWidth + 'x' + document.documentElement.scrollHeight;
    o.pestanas = Array.prototype.map.call(document.querySelectorAll('.tab-btn'), function (b) {
      return b.dataset.tab + (b.classList.contains('activo') ? '*' : '');
    });
    var p = document.querySelector('.tab-panel.activo');
    o.panelActivo = p ? p.id : null;
    o.desbordeH = document.documentElement.scrollWidth > window.innerWidth + 1;
    o.colores = (function () {
      var cs = {};
      ['body', '.zona', '.btn-primario', '.btn-secundario', 'input', 'select', 'textarea', 'table thead th', '.tab-btn.activo'].forEach(function (sel) {
        var e = document.querySelector(sel);
        if (!e) return;
        var s = getComputedStyle(e);
        cs[sel] = s.backgroundColor + ' / ' + s.color + ' / ' + s.fontFamily.split(',')[0];
      });
      return cs;
    })();
    o.fuentes = (function () {
      var f = {};
      Array.prototype.forEach.call(document.querySelectorAll('link[rel=stylesheet],style'), function (e) {
        var u = e.getAttribute('href') || '(inline)';
        f[u] = 1;
      });
      return Object.keys(f);
    })();
    o.nivelesIntervencion = ['I', 'II', 'III', 'IV'].map(function (nivel) {
      var e = document.createElement('span');
      e.className = 'ni-' + nivel;
      e.style.display = 'none';
      document.body.appendChild(e);
      var color = getComputedStyle(e).backgroundColor;
      e.remove();
      return nivel + ': ' + color;
    });
    return o;
  })()`);

  fs.mkdirSync(path.dirname(path.resolve(salida)), { recursive: true });
  const shot = await cdp.enviar('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: full,
    ...(full ? { clip: { x: 0, y: 0, width: W, height: Math.min(informe.estructura.doc.split('x')[1] * 1, 6000), scale: 1 } } : {})
  }, S);
  fs.writeFileSync(path.resolve(salida), Buffer.from(shot.data, 'base64'));

  informe.captura = salida + ' (' + fs.statSync(path.resolve(salida)).size + ' bytes)';
  informe.consolaErrores = errores;
  informe.consolaAvisos = avisos;

  console.log(JSON.stringify(informe, null, 2));

  return errores.length || informe.estructura.desbordeH ? 1 : 0;
}

/* Chrome sigue escribiendo en el perfil un momento después de Browser.close,
   así que se espera a que muera el proceso y se reintenta el borrado. */
function cerrar(proceso) {
  return new Promise((res) => {
    if (proceso.exitCode !== null || proceso.signalCode !== null) return res();
    proceso.once('exit', res);
    setTimeout(() => { try { proceso.kill(); } catch (e) { /* ya no está */ } res(); }, 4000);
  });
}

async function borrar(dir) {
  for (let i = 0; i < 5; i++) {
    try { fs.rmSync(dir, { recursive: true, force: true }); return; } catch (e) {
      if (e.code !== 'EBUSY' && e.code !== 'EPERM' && e.code !== 'ENOTEMPTY') throw e;
      await dormir(400);
    }
  }
  console.error('aviso: no se pudo borrar ' + dir);
}

async function limpiar() {
  if (cliente && conexion.readyState === WebSocket.OPEN) {
    try {
      await Promise.race([cliente.enviar('Browser.close', {}), dormir(3000)]);
    } catch (e) { /* Chrome ya se cerró */ }
  }
  if (conexion) conexion.close();
  if (navegador) await cerrar(navegador);
  if (!keep) await borrar(WORK);
}

main().then(async (codigo) => {
  await limpiar();
  process.exit(codigo);
}).catch(async (e) => {
  console.error('FALLO: ' + e.message);
  try { await limpiar(); } catch (x) { console.error('limpieza: ' + x.message); }
  process.exit(1);
});

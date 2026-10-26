'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const net = require('net');
const { spawn, execFileSync } = require('child_process');
const { pathToFileURL } = require('url');
const { randomUUID } = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'out');
const RUN = path.join(OUT, 'integracion-' + randomUUID());
const WEB = path.join(RUN, 'presentacion-web');
const CHROME = process.env.NTP330_CHROME || process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
function option(name, fallback) {
  const value = process.argv.find(argument => argument.startsWith('--' + name + '='));
  return value ? value.slice(name.length + 3) : fallback;
}
const SITE = path.resolve(ROOT, option('site', 'presentacion-web'));
const BASE_PATH = '/' + option('base-path', '').replace(/^\/+|\/+$/g, '') + '/';
const HTTP_PREFIX = BASE_PATH === '//' ? '/' : BASE_PATH;
const PUBLISHED_URL = option('url', '');

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.contexts = new Map();
    this.errors = [];
    ws.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.method === 'Runtime.executionContextCreated') {
        const context = message.params.context;
        if (context.auxData && context.auxData.isDefault) this.contexts.set(context.auxData.frameId, context.id);
      }
      if (message.method === 'Runtime.executionContextsCleared') this.contexts.clear();
      if (message.method === 'Runtime.executionContextDestroyed') {
        for (const [frame, context] of this.contexts) if (context === message.params.executionContextId) this.contexts.delete(frame);
      }
      if (message.method === 'Runtime.exceptionThrown') {
        const detail = message.params.exceptionDetails;
        this.errors.push(detail.exception ? detail.exception.description : detail.text);
      }
      if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
        this.errors.push(message.params.args.map(value => value.value || value.description || value.type).join(' '));
      }
      const request = this.pending.get(message.id);
      if (!request) return;
      clearTimeout(request.timer);
      this.pending.delete(message.id);
      if (message.error) request.reject(new Error(JSON.stringify(message.error)));
      else request.resolve(message.result);
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error('Tiempo agotado: ' + method)); }, 20000);
      this.pending.set(id, { resolve, reject, timer });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async evaluate(fn, argument, contextId) {
    const params = { expression: '(' + fn.toString() + ')(' + JSON.stringify(argument) + ')', returnByValue: true, awaitPromise: true, userGesture: true };
    if (contextId) params.contextId = contextId;
    const result = await this.send('Runtime.evaluate', params);
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
}

async function waitFor(check, label) {
  for (let i = 0; i < 150; i++) {
    const value = await check();
    if (value) return value;
    await pause(100);
  }
  throw new Error('No se completó: ' + label);
}

function port() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => { const value = server.address().port; server.close(() => resolve(value)); });
  });
}

async function appContext(cdp) {
  return waitFor(async () => {
    const tree = (await cdp.send('Page.getFrameTree')).frameTree;
    function find(node) {
      if (/\/ntp330\/0\/index\.html(?:[?#]|$)/.test(node.frame.url)) return node.frame;
      for (const child of node.childFrames || []) { const found = find(child); if (found) return found; }
      return null;
    }
    const frame = find(tree);
    const context = frame && cdp.contexts.get(frame.id);
    if (!context) return null;
    try {
      return await cdp.evaluate(() => document.readyState === 'complete' && !!window.AppUI && !!window.DBApp, null, context) ? context : null;
    } catch (_) { return null; }
  }, 'carga de la app dentro del slide 7');
}

function checkApp() {
  function requireValue(ok, message) { if (!ok) throw new Error(message); }
  requireValue(document.querySelector('.tab-btn[data-tab="evaluacion"]').classList.contains('activo'), 'La app no abre en Evaluación');
  requireValue(window.jspdf && typeof window.jspdf.jsPDF === 'function', 'jsPDF local ausente');
  const doc = new window.jspdf.jsPDF({ orientation: 'landscape' });
  requireValue(typeof doc.autoTable === 'function', 'AutoTable local ausente');
  doc.autoTable({ head: [['Integración', 'Resultado']], body: [['NTP 330', 'PDF local sin red']] });
  const bytes = doc.output('arraybuffer').byteLength;
  requireValue(bytes > 1000, 'No se generó un PDF real');
  const directory = location.href.replace(/index\.html.*$/, '');
  requireValue(Array.from(document.scripts).filter(script => script.src).every(script => script.src.startsWith(directory)), 'La app requiere scripts externos');
  requireValue(DBApp.listarEvaluaciones().length === 0 && DBApp.listarProyectos().length === 0, 'El perfil de verificación no está aislado');
  document.querySelector('.tab-btn[data-tab="pruebas"]').click();
  document.getElementById('btnEjecutarPruebas').click();
  const verdict = document.getElementById('resumen-pruebas').textContent;
  requireValue(verdict === 'TODAS LAS PRUEBAS PASARON (52/52)', 'La suite no pasó: ' + verdict);
  document.querySelector('.tab-btn[data-tab="evaluacion"]').click();
  const project = DBApp.crearProyecto('Integración portable', 'Infraestructura');
  requireValue(project.id && !project.error, 'No se creó el proyecto de verificación');
  const evaluation = DBApp.nuevaEvaluacion({ proyectoId: project.id, proyecto: project.nombre, tipoProyecto: project.tipo, proceso: 'Obras preliminares' });
  DBApp.guardarEvaluacion(evaluation);
  return { suite: verdict, pdfBytes: bytes, proyecto: project.id, evaluacion: evaluation.id, scriptsLocales: true };
}

async function main() {
  fs.mkdirSync(RUN, { recursive: true });
  if (!PUBLISHED_URL) execFileSync(process.execPath, [path.join(__dirname, 'gen_slide7_shot.js')]);
  const originalWeb = path.join(ROOT, 'presentacion-web');
  const generated = path.join(SITE, 'ntp330', '0', 'pruebas', 'out');
  fs.cpSync(SITE, WEB, { recursive: true, filter: source => source !== generated });
  if (fs.existsSync(path.join(RUN, 'tesis'))) throw new Error('La copia aislada contiene una dependencia externa');
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' };
  const server = http.createServer((request, response) => {
    const requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!requested.startsWith(HTTP_PREFIX)) { response.writeHead(404); response.end(); return; }
    const pathname = '/' + requested.slice(HTTP_PREFIX.length);
    const file = path.resolve(WEB, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(WEB + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end(); return; }
    response.setHeader('Content-Type', types[path.extname(file).toLowerCase()] || 'application/octet-stream');
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const debuggingPort = await port();
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--disable-extensions', '--disable-background-networking', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    '--force-device-scale-factor=1', '--window-size=1920,1080', '--host-resolver-rules=MAP cdnjs.cloudflare.com 127.0.0.1:1',
    '--remote-debugging-port=' + debuggingPort, '--user-data-dir=' + path.join(RUN, 'perfil'), 'about:blank'], { stdio: 'ignore' });
  let launchError;
  chrome.on('error', error => { launchError = error; });
  let cdp;
  let success = false;
  try {
    const target = await waitFor(async () => {
      if (launchError) throw launchError;
      try { return (await (await fetch('http://127.0.0.1:' + debuggingPort + '/json/list')).json()).find(target => target.type === 'page'); }
      catch (_) { return null; }
    }, 'inicio de Chrome');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
    cdp = new Cdp(ws);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    const results = [];
    const sources = PUBLISHED_URL ? [['pages', PUBLISHED_URL]] : [
      ['file', pathToFileURL(path.join(WEB, 'index.html')).href],
      ['http', 'http://127.0.0.1:' + server.address().port + HTTP_PREFIX + 'index.html']
    ];
    for (const [mode, url] of sources) {
      await cdp.send('Page.navigate', { url: url + '#7' });
      await waitFor(() => cdp.evaluate(() => document.readyState === 'complete' && !!document.querySelector('.slide.active[data-slide="7"]')), 'slide 7');
      await cdp.evaluate(() => {
        const style = document.createElement('style'); style.textContent = '*{animation:none!important;transition:none!important}'; document.head.appendChild(style);
        document.querySelector('.slide.active .rs2-body [data-focus="f1"]').click();
      });
      let context = await appContext(cdp);
      const state = await cdp.evaluate(checkApp, null, context);
      await cdp.evaluate(() => document.querySelector('.slide.active .slide-head').click());
      if (!await cdp.evaluate(() => !document.querySelector('.slide.active iframe'))) throw new Error('No se desmontó la app al cerrar');
      await cdp.evaluate(() => document.querySelector('.slide.active .rs2-body [data-focus="f1"]').click());
      context = await appContext(cdp);
      const restored = await cdp.evaluate(() => ({ proyectos: DBApp.listarProyectos().map(project => project.id), evaluaciones: DBApp.listarEvaluaciones().map(evaluation => evaluation.id) }), null, context);
      if (restored.proyectos[0] !== state.proyecto || restored.evaluaciones[0] !== state.evaluacion) throw new Error('Los datos no persisten al reabrir la app');
      const frame = await cdp.evaluate(() => {
        const app = document.querySelector('.slide.active iframe'); const r = app.getBoundingClientRect();
        return { src: app.src, width: r.width, height: r.height };
      });
      if (!frame.src.endsWith('/ntp330/0/index.html') || frame.width < 100 || frame.height < 100) throw new Error('Ruta o tamaño de iframe incorrectos');
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(path.join(OUT, 'slide07_integrada_' + mode + '.png'), Buffer.from(shot.data, 'base64'));
      results.push({ modo: mode, ...state, persistencia: true, iframe: frame });
      console.log(JSON.stringify(results[results.length - 1]));
    }
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 2816, height: 1440, deviceScaleFactor: 1, mobile: false });
    for (const name of PUBLISHED_URL ? [] : ['res2_heights.html', 'res2_focos.html']) {
      const originalPath = originalWeb.replace(/\\/g, '/');
      const copyPath = WEB.replace(/\\/g, '/');
      const html = fs.readFileSync(path.join(OUT, name), 'utf8').replace('zoom:1 !important', 'zoom:2 !important').split(originalPath).join(copyPath);
      const probe = path.join(WEB, '_probe.html');
      fs.writeFileSync(probe, html);
      await cdp.send('Page.navigate', { url: pathToFileURL(probe).href + '?' + name });
      const report = await waitFor(() => cdp.evaluate(() => {
        if (document.readyState !== 'complete') return null;
        const error = document.getElementById('err');
        const report = document.getElementById('report');
        return error ? { error: error.textContent } : report ? { text: report.textContent } : null;
      }), name);
      if (report.error) throw new Error(report.error);
      const problems = report.text.split(/\r?\n/).filter(line => /^\s+(clip|tx|frame OVERFLOW)\b/.test(line) || /\b(ERROR|MISSING)\b/.test(line));
      if (problems.length) throw new Error(name + ': ' + problems.join('\n'));
      fs.writeFileSync(path.join(OUT, name.replace('.html', '_integrada.txt')), report.text);
      console.log(name + ': 0 clip / 0 textx-overflow / 0 frame OVERFLOW');
    }
    if (cdp.errors.length) throw new Error(cdp.errors.join('\n'));
    const reportName = PUBLISHED_URL ? 'integracion_pages.json' : SITE !== originalWeb ? 'integracion_pages_local.json' : 'integracion_ntp330.json';
    fs.writeFileSync(path.join(OUT, reportName), JSON.stringify({ fecha: new Date().toISOString(), proyectoIndependiente: true, basePath: HTTP_PREFIX, sitioPublicado: PUBLISHED_URL || null, resultados: results, errores: cdp.errors }, null, 2));
    console.log(PUBLISHED_URL ? 'PAGES OK: slide 7 publicado, 52/52, PDF local y datos persistentes.' :
      'INTEGRACION OK: copia independiente, slide 7 en file/HTTP, 52/52 en ambos modos, PDF sin CDN y datos persistentes.');
    success = true;
  } finally {
    if (cdp) { await cdp.send('Browser.close').catch(() => {}); cdp.ws.close(); }
    if (chrome.exitCode === null && chrome.signalCode === null) {
      await new Promise(resolve => {
        const timer = setTimeout(() => { chrome.kill(); resolve(); }, 6000);
        chrome.once('exit', () => { clearTimeout(timer); resolve(); });
      });
    }
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    if (success) {
      await pause(500);
      try { await fs.promises.rm(RUN, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); }
      catch (error) {
        if (!['EBUSY', 'EPERM'].includes(error.code)) throw error;
        // Windows puede mantener abierto el perfil unos segundos después de cerrar Chrome.
        fs.rmSync(WEB, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
      }
    }
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });

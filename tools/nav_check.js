'use strict';
const fs = require('fs');
const path = require('path');
const net = require('net');
const { spawn } = require('child_process');
const { pathToFileURL } = require('url');
const { randomUUID } = require('crypto');

const ROOT = path.resolve(__dirname, '..', 'presentacion-web');
const OUT = path.join(__dirname, 'out');
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = pathToFileURL(path.join(ROOT, process.argv.includes('--probe') ? '_probe.html' : 'index.html')).href;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', event => {
      const message = JSON.parse(event.data);
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
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error('Tiempo agotado: ' + method));
      }, 20000);
      this.pending.set(id, { resolve, reject, timer });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async evaluate(fn, argument) {
    const result = await this.send('Runtime.evaluate', {
      expression: '(' + fn.toString() + ')(' + JSON.stringify(argument) + ')',
      returnByValue: true, awaitPromise: true, userGesture: true
    });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
}

function availablePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

async function fullscreen(enabled) {
  if (!!document.fullscreenElement !== enabled) {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        document.removeEventListener('fullscreenchange', changed);
        reject(new Error('No se cambio el modo de pantalla completa'));
      }, 5000);
      function changed() {
        if (!!document.fullscreenElement !== enabled) return;
        clearTimeout(timer);
        document.removeEventListener('fullscreenchange', changed);
        resolve();
      }
      document.addEventListener('fullscreenchange', changed);
      document.getElementById('btnFullscreen').click();
    });
  }
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  if (document.body.classList.contains('is-fullscreen-presentation') !== enabled) throw new Error('Estado de pantalla completa incoherente');
  return enabled;
}

function check(navigate) {
  const header = document.querySelector('.app-header');
  const tabs = Array.from(document.querySelectorAll('#tabs .tab'));
  const frame = document.getElementById('slideFrame');
  const stage = document.getElementById('stage');
  if (tabs.length !== 12) throw new Error('La navegacion no tiene doce diapositivas');
  const nativeFullscreen = !!document.fullscreenElement;
  const selections = navigate ? tabs : [document.querySelector('#tabs .tab.active')];
  for (const selected of selections) {
    if (navigate) selected.click();
    const index = tabs.indexOf(selected);
    if (!frame.children[index].classList.contains('active') || document.getElementById('counter').textContent !== (index + 1) + ' / 12') throw new Error('Navegacion incorrecta: slide ' + (index + 1));
    if (!!document.fullscreenElement !== nativeFullscreen) throw new Error('La navegacion cambio el modo de pantalla');
    const hr = header.getBoundingClientRect();
    if (getComputedStyle(header).display === 'none' || hr.height <= 0 || hr.top < -1 || hr.bottom > innerHeight + 1) throw new Error('Panel de navegacion oculto o recortado');
    for (const tab of tabs) {
      const r = tab.getBoundingClientRect();
      if (!r.width || !r.height || r.left < -1 || r.right > innerWidth + 1 || r.top < hr.top - 1 || r.bottom > hr.bottom + 1) throw new Error('Pestana recortada: ' + tab.textContent);
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      if (hit !== tab && !tab.contains(hit)) throw new Error('Pestana tapada: ' + tab.textContent);
    }
    const sr = stage.getBoundingClientRect();
    const fr = frame.getBoundingClientRect();
    const style = getComputedStyle(stage);
    if (fr.top < hr.bottom - 1 || fr.left < sr.left + parseFloat(style.paddingLeft) - 1 ||
      fr.top < sr.top + parseFloat(style.paddingTop) - 1 ||
      fr.right > sr.right - parseFloat(style.paddingRight) + 1 ||
      fr.bottom > sr.bottom - parseFloat(style.paddingBottom) + 1) throw new Error('Lamina fuera del espacio util: slide ' + (index + 1));
  }
  return {
    mode: nativeFullscreen ? 'pantalla completa nativa' : 'normal',
    viewport: innerWidth + 'x' + innerHeight,
    slides: selections.length,
    headerHeight: header.getBoundingClientRect().height,
    tabRows: new Set(tabs.map(tab => Math.round(tab.getBoundingClientRect().top))).size
  };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const port = await availablePort();
  const profile = path.join(OUT, 'chrome-nav-' + randomUUID());
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    '--no-default-browser-check', '--force-device-scale-factor=1', '--window-size=2816,1600',
    '--remote-debugging-port=' + port, '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });
  let launchError;
  chrome.on('error', error => { launchError = error; });
  let client;
  try {
    let page;
    for (let i = 0; i < 80; i++) {
      if (launchError) throw launchError;
      try {
        const response = await fetch('http://127.0.0.1:' + port + '/json/list');
        page = (await response.json()).find(target => target.type === 'page');
        if (page) break;
      } catch (_) {}
      await pause(100);
    }
    if (!page) throw new Error('Chrome no publico su conexion CDP');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', reject, { once: true });
    });
    client = new Cdp(ws);
    await client.send('Page.enable');
    await client.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    await client.send('Page.navigate', { url: URL });
    let ready = false;
    for (let i = 0; i < 100; i++) {
      ready = await client.evaluate(() => document.readyState === 'complete' && document.querySelectorAll('#tabs .tab').length === 12);
      if (ready) break;
      await pause(100);
    }
    if (!ready) throw new Error('La presentacion no termino de cargar');
    await client.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = '*{animation:none!important;transition:none!important}';
      document.head.appendChild(style);
    });
    async function capture(name) {
      await client.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const shot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(path.join(OUT, name), Buffer.from(shot.data, 'base64'));
    }
    for (const [width, height] of [[1024, 768], [1366, 768], [1920, 1080], [2816, 1600]]) {
      await client.send('Emulation.setDeviceMetricsOverride', { width, height, screenWidth: width, screenHeight: height, deviceScaleFactor: 1, mobile: false });
      await client.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      console.log(JSON.stringify(await client.evaluate(check, true)));
      await client.evaluate(fullscreen, true);
      console.log(JSON.stringify(await client.evaluate(check, true)));
      if (width === 1366) await capture('nav_fs_1366.png');
      if (width === 1920) {
        for (const index of [0, 7, 11]) {
          await client.evaluate(i => document.querySelectorAll('#tabs .tab')[i].click(), index);
          await capture('nav_fs_slide' + String(index + 1).padStart(2, '0') + '.png');
        }
        await client.evaluate(() => {
          document.querySelectorAll('#tabs .tab')[7].click();
          document.querySelector('.slide.active .rs3-paso[data-focus="p3"]').click();
        });
        console.log(JSON.stringify(await client.evaluate(check, false)));
        await capture('nav_fs_slide08_barras.png');
      }
      if (width === 2816) await capture('nav_fs_2816.png');
      await client.evaluate(fullscreen, false);
      await client.evaluate(check, false);
    }
    console.log('NAVEGACION OK: 12 slides en 4 resoluciones, modo normal y pantalla completa nativa; entrada y salida con el boton.');
  } finally {
    if (client) {
      await client.send('Browser.close').catch(() => {});
      client.ws.close();
    }
    if (chrome.exitCode === null) chrome.kill();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });

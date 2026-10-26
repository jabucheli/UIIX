'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, 'presentacion-web');
const OUT = path.join(__dirname, 'out');

function filesIn(directory, base = directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(file, base) : [path.relative(base, file).replace(/\\/g, '/')];
  });
}

function preparePages(destination = path.join(OUT, 'pages')) {
  const target = path.resolve(destination);
  if (!target.startsWith(OUT + path.sep)) throw new Error('El sitio generado debe estar dentro de tools/out/');
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });
  for (const relative of ['index.html', 'css', 'js', 'assets', 'ntp330/0/index.html', 'ntp330/0/css', 'ntp330/0/js', 'ntp330/0/vendor']) {
    const output = path.join(target, relative);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.cpSync(path.join(WEB, relative), output, { recursive: true });
  }
  fs.writeFileSync(path.join(target, '.nojekyll'), '');

  const baseUrl = new URL('https://jabucheli.github.io/UIIX/');
  let checked = 0;
  function checkResource(value, document) {
    if (!value || /^(?:#|data:|blob:|mailto:|javascript:)/i.test(value)) return;
    const url = new URL(value, new URL(document, baseUrl));
    if (url.origin !== baseUrl.origin) return;
    if (!url.pathname.startsWith(baseUrl.pathname)) throw new Error('Ruta fuera del sitio /UIIX/: ' + value);
    const relative = decodeURIComponent(url.pathname.slice(baseUrl.pathname.length));
    let current = target;
    for (const part of relative.split('/').filter(Boolean)) {
      if (!fs.statSync(current).isDirectory() || !fs.readdirSync(current).includes(part)) {
        throw new Error('Recurso ausente o con mayúsculas distintas: ' + value + ' en ' + document);
      }
      current = path.join(current, part);
    }
    if (!fs.statSync(current).isFile()) throw new Error('El recurso no es un archivo: ' + value);
    checked++;
  }

  const files = filesIn(target);
  for (const relative of files) {
    if (relative.endsWith('.html')) {
      const html = fs.readFileSync(path.join(target, relative), 'utf8');
      for (const match of html.matchAll(/\b(?:src|href)\s*=\s*(["'])(.*?)\1/g)) checkResource(match[2], relative);
    }
    if (relative.startsWith('js/') && relative.endsWith('.js')) {
      const script = fs.readFileSync(path.join(target, relative), 'utf8');
      for (const match of script.matchAll(/(["'])(assets\/[^"'\r\n]+)\1/g)) {
        if (/\.(?:png|jpe?g|bmp|svg|webp)(?:[?#].*)?$/i.test(match[2])) checkResource(match[2], 'index.html');
      }
    }
  }
  checkResource('ntp330/0/index.html', 'index.html');
  if (files.some(file => /(?:^|\/)(?:pruebas|respaldos|legacy|\.git)(?:\/|$)/.test(file) || /\.(?:bundle|docx|xlsx|pptx)$/.test(file))) {
    throw new Error('El sitio generado contiene archivos ajenos a la aplicación web');
  }
  return { output: target, files: files.length, bytes: files.reduce((total, file) => total + fs.statSync(path.join(target, file)).size, 0), resourcesChecked: checked };
}

module.exports = { preparePages };
if (require.main === module) console.log(JSON.stringify(preparePages(process.argv[2]), null, 2));

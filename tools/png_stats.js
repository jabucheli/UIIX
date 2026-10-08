/* png_stats.js — lee un PNG de Chrome y dice qué hay pintado en un rectángulo.
   Sirve para comprobar de un vistazo si un <iframe>.cross-origin ha cargado de
   verdad, ya que no se puede leer su DOM y las capturas no se pueden mirar.
   Solo PNG no entrelazado, que es lo que produce Chrome.

   uso: node png_stats.js <archivo.png> [x y w h]                          */
const fs = require('fs');
const zlib = require('zlib');

function decode(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('no es un PNG');
  let p = 8, w = 0, h = 0, depth = 0, color = 0, interlace = 0;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString('ascii', p + 4, p + 8);
    const data = buf.slice(p + 8, p + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4);
      depth = data[8]; color = data[9]; interlace = data[12];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    p += 12 + len;
  }
  if (depth !== 8) throw new Error('profundidad ' + depth + ' no soportada');
  if (interlace) throw new Error('PNG entrelazado no soportado');
  const canales = { 0: 1, 2: 3, 4: 2, 6: 4 }[color];
  if (!canales) throw new Error('tipo de color ' + color + ' no soportado');

  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bpp = canales, stride = w * bpp;
  const out = Buffer.alloc(h * stride);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const filtro = raw[y * (stride + 1)];
    const linea = raw.slice(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const cur = out.slice(y * stride, (y + 1) * stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0;
      const b = prev[i];
      const c = i >= bpp ? prev[i - bpp] : 0;
      let v = linea[i];
      if (filtro === 1) v += a;
      else if (filtro === 2) v += b;
      else if (filtro === 3) v += (a + b) >> 1;
      else if (filtro === 4) {
        const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      }
      cur[i] = v & 255;
    }
    prev = cur;
  }
  return { w, h, canales, pixeles: out };
}

function stats(img, rect) {
  const { w, h, canales, pixeles } = img;
  const x0 = Math.max(0, rect.x), y0 = Math.max(0, rect.y);
  const x1 = Math.min(w, rect.x + rect.w), y1 = Math.min(h, rect.y + rect.h);
  const colores = new Set();
  let pintados = 0, total = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * w + x) * canales;
      const rgb = canales >= 3 ? [pixeles[i], pixeles[i + 1], pixeles[i + 2]] : [pixeles[i]];
      colores.add(rgb.join(','));
      if (canales < 3 || rgb[0] < 246 || rgb[1] < 246 || rgb[2] < 246) pintados++;
      total++;
    }
  }
  return {
    rect: [x0, y0, x1 - x0, y1 - y0],
    colores: colores.size,
    pintados: pintados,
    total: total,
    pctPintado: total ? +(100 * pintados / total).toFixed(1) : 0
  };
}

const [, , archivo, ...resto] = process.argv;
if (!archivo) { console.error('uso: node png_stats.js <archivo.png> [x y w h]'); process.exit(1); }
const img = decode(fs.readFileSync(archivo));
console.log('PNG ' + img.w + 'x' + img.h + ' canales=' + img.canales);
const rect = resto.length === 4
  ? { x: +resto[0], y: +resto[1], w: +resto[2], h: +resto[3] }
  : { x: 0, y: 0, w: img.w, h: img.h };
console.log('rect ' + JSON.stringify(rect) + ' -> ' + JSON.stringify(stats(img, rect)));

/* Extrae del ER.docx los cuadros que corresponden a los bloques NE, NP, NC,
   NR y NI del flujograma del slide 7 y los deja como datos para la
   presentacion (presentacion-web/js/data/erTables.js).

   De los 7 cuadros del documento se usan estos cinco:
     · NE -> "Nivel de exposición NE"        (significado, 4 filas)
     · NP -> "Nivel de probabilidad NP"      (significado, 4 filas)
     · NC -> "Nivel de consecuencias NC"     (4 filas x 4 columnas)
     · NR -> matriz "Nivel de probabilidad (NP) x Nivel de consecuencias (NC)"
     · NI -> "Nivel de intervencion"         (I, II, III, IV)
   Los dos que quedan fuera son la tabla del ND y la matriz ND x NE: no hay
   ningun bloque del flujograma que las pida (el ND no es pulsable).

   El color verde/rojo se asigna por severidad (intencion de diseno, no del
   documento): en verde los niveles que no requieren intervencion y en rojo los
   que si. Se conserva el texto y los valores tal cual aparecen en ER.docx.

   Uso:  node tools/extract_er_tables.js                                        */
'use strict';

var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var cp = require('child_process');

var RAIZ = path.resolve(__dirname, '..');
var DOCX = path.join(RAIZ, 'ER.docx');
var SALIDA = path.join(RAIZ, 'presentacion-web', 'js', 'data', 'erTables.js');

/* ---------- lectura del .docx (zip) sin dependencias externas ---------- */

function leerDocumento(docx) {
  var xml = null;
  try {
    xml = cp.execFileSync('unzip', ['-p', docx, 'word/document.xml'],
      { maxBuffer: 64 * 1024 * 1024, encoding: 'utf8' });
  } catch (e) {
    xml = null;
  }
  if (xml && xml.indexOf('<w:tbl>') > -1) return xml;
  /* alternativa: descomprimir a mano el zip si no hay `unzip` en el PATH */
  var buf = fs.readFileSync(docx);
  var eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) throw new Error('ER.docx no parece un zip valido');
  var n = buf.readUInt16LE(eocd + 10);
  var off = buf.readUInt32LE(eocd + 16);
  for (var i = 0; i < n; i++) {
    var nameLen = buf.readUInt16LE(off + 28);
    var extraLen = buf.readUInt16LE(off + 30);
    var commentLen = buf.readUInt16LE(off + 32);
    var name = buf.toString('utf8', off + 46, off + 46 + nameLen);
    var method = buf.readUInt16LE(off + 10);
    var compSize = buf.readUInt32LE(off + 20);
    var start = buf.readUInt32LE(off + 42);
    if (name === 'word/document.xml') {
      var data = buf.slice(start + 30 + nameLen + extraLen,
        start + 30 + nameLen + extraLen + compSize);
      return (method === 0 ? data : zlib.inflateRawSync(data)).toString('utf8');
    }
    off += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error('no se encontro word/document.xml dentro de ER.docx');
}

/* ---------- limpieza del texto de Word ---------- */

function texto(xml) {
  return xml
    .replace(/<w:instrText[^>]*>[\s\S]*?<\/w:instrText>/g, ' ')   /* citas Zotero */
    .replace(/<w:tab[^>]*\/>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

var NOTA = /Nota:\s*INSST\s*\(1991\)/;
/* Word mete dentro de la ultima celda el texto que sigue a la tabla
   (encabezados y pies de la pagina siguiente): se corta ahi. */
var COLA = /Tabla\s*\d+|Nivel de (Riesgo|Intervenci[oó]n|Probabilidad|Consecuencias|Exposici[oó]n|Deficiencia)|Metodolog[ií]a|m[eé]todo\b/i;

function sinNota(t) {
  var m = t.match(NOTA);
  var cuerpo = t.replace(NOTA, '');
  var c = cuerpo.search(COLA);
  /* solo se corta si el encabezado aparece detras de texto: si la celda es
     justo el titulo de la tabla ("Nivel de probabilidad (NP)") se respeta */
  if (c > 0) cuerpo = cuerpo.slice(0, c);
  return { limpio: cuerpo.replace(/\s+/g, ' ').trim(), nota: m ? m[0] : '' };
}

/* "Continuada(EC)" -> { label: 'Continuada', cod: 'EC' }
   "II" (solo el numero romano) -> { label: '', cod: 'II' }                */
function separarCodigo(t) {
  var m = t.match(/^(.*?)\s*\(([A-Z]{1,3}(?:[IVX]+)?)\)\s*$/);
  if (!m) {
    if (/^I{1,3}V?$/.test(t.trim())) return { label: '', cod: t.trim() };
    return { label: t, cod: '' };
  }
  var label = m[1].replace(/\s+/g, ' ').trim();
  return { label: label.charAt(0).toUpperCase() + label.slice(1), cod: m[2] };
}

/* Erratas del documento original que se corrigen al extraer: el texto se
   mantiene literal salvo en estos casos, que se anotan aqui. */
var CORRECCIONES = { 'Recuente': 'Frecuente' };

/* "Nivel deconsecuencias" -> "Nivel de consecuencias"; "Entre40 y 24" -> "Entre 40 y 24" */
function bonito(t) {
  return t
    .replace(/Nivel de(\S)/g, 'Nivel de $1')
    .replace(/Entre\s*(\d)/g, 'Entre $1');
}

function celdasDe(fila) {
  return fila.split(/<w:tc>/).slice(1).map(function (c) { return sinNota(texto(c)).limpio; });
}

function tablaDe(xml, indice) {
  var tablas = xml.split('<w:tbl>').slice(1);
  var cruda = tablas[indice];
  if (!cruda) throw new Error('ER.docx no tiene la tabla ' + (indice + 1));
  var filas = cruda.split(/<w:tr[ >]/).slice(1);
  var salida = [];
  var nota = '';
  filas.forEach(function (f) {
    var celdas = celdasDe(f);
    celdas.forEach(function (c) {
      var n = sinNota(c);
      if (n.nota) nota = n.nota;
    });
    if (celdas.some(function (c) { return c; })) salida.push(celdas);
  });
  return { filas: salida, nota: nota };
}

/* ---------- configuracion de los cinco cuadros ---------- */

var CFG = [
  {
    key: 'ne', indice: 1, code: 'NE', titulo: 'Nivel de exposición',
    col0: 'Nivel de exposición', col1: 'NE', col2: 'Significado',
    severidad: { EC: 'red', EF: 'red', EO: 'green', EE: 'green' },
    pie: 'La exposición se valora segun la frecuencia con que el agente se\n          presenta en la jornada laboral.'
  },
  {
    key: 'np', indice: 3, code: 'NP', titulo: 'Nivel de probabilidad',
    col0: 'Nivel de probabilidad', col1: 'NP', col2: 'Significado',
    severidad: { MA: 'red', A: 'red', M: 'green', B: 'green' },
    pie: 'El NP se obtiene combinando el ND con el NE en la matriz ND × NE.'
  },
  {
    key: 'nc', indice: 4, code: 'NC', titulo: 'Nivel de consecuencias',
    col0: 'Nivel de consecuencias', col1: 'NC', col2: 'Daños personales',
    col3: 'Daños materiales', sub2: true,
    severidad: { M: 'red', MG: 'red', G: 'green', L: 'green' },
    pie: 'La consecuencia se valora por el daño personal y por el daño\n          material, y se queda con la peor de las dos.'
  },
  {
    key: 'nr', indice: 5, code: 'NR', titulo: 'Nivel de riesgo',
    matriz: true, severidadNivel: { I: 'red', II: 'red', III: 'green', IV: 'green' },
    pie: 'Cruce del NP con el NC: cada celda indica el NR y su nivel de\n          intervención (I a IV).'
  },
  {
    key: 'ni', indice: 6, code: 'NI', titulo: 'Nivel de intervención',
    col0: 'Nivel de intervención', col1: 'NR', col2: 'Significado',
    severidad: { I: 'red', II: 'red', III: 'green', IV: 'green' },
    pie: 'El NR se traduce en un nivel de intervención: I y II requieren\n          actuar, III y IV no.'
  }
];

/* "I4000-2400" / "II240 III 120" -> [{nivel:'I',valor:'4000-2400'},{nivel:'III',valor:'120'}] */
function nivelesDeNR(t) {
  var out = [];
  var re = /I{1,3}V?\s*\d+(?:\s*-\s*\d+)?/g;
  var m;
  while ((m = re.exec(t)) !== null) {
    var p = m[0].match(/^(I{1,3}V?)\s*([\d\s.-]*)$/);
    if (p) out.push({ nivel: p[1], valor: p[2].replace(/\s+/g, ' ').trim() });
  }
  return out.length ? out : [{ nivel: '', valor: t.trim() }];
}

/* ---------- los nombres de los dos ejes de la matriz ----------
   La matriz del NR solo trae los numeros (40-24, 100...), asi que se cruzan
   con las tablas ya construidas del NP y del NC:
     · NP: la columna 0 de cada fila es el tramo ("Entre40 y 24"), que se
       normaliza a "40-24" para emparejarlo con la cabecera de la matriz;
     · NC: la columna 0 de cada fila es el numero (100, 60, 25, 10).
   Si el emparejamiento falla se devuelve cadena vacia y la celda se queda
   solo con el numero, que es lo que habia antes.                        */

function tramoNormalizado(t) {
  return String(t || '')
    .replace(/^Entre\s*/i, '')
    .replace(/\s*(?:y|-|a)\s*/i, '-')
    .replace(/\s+/g, '')
    .trim();
}

function filaNP(out, rango, i) {
  var t = out.np;
  if (!t) return null;
  var want = tramoNormalizado(rango);
  for (var j = 0; j < t.filas.length; j++) {
    if (tramoNormalizado(t.filas[j].celdas[0]) === want) return t.filas[j];
  }
  return t.filas[i] || null;   /* respaldo: mismo orden que la matriz */
}

function filaNC(out, nc) {
  var t = out.nc;
  if (!t) return null;
  var want = String(nc || '').replace(/\s+/g, '');
  for (var j = 0; j < t.filas.length; j++) {
    if (String(t.filas[j].celdas[0] || '').replace(/\s+/g, '') === want) return t.filas[j];
  }
  return null;
}

function nombreNP(out, rango, i) { var f = filaNP(out, rango, i); return f ? f.etiqueta : ''; }
function codNP(out, rango, i) { var f = filaNP(out, rango, i); return f ? f.cod : ''; }
function nombreNC(out, nc) { var f = filaNC(out, nc); return f ? f.etiqueta : ''; }
function codNC(out, nc) { var f = filaNC(out, nc); return f ? f.cod : ''; }

function construir(xml) {
  var out = {};
  CFG.forEach(function (cfg) {
    var t = tablaDe(xml, cfg.indice);
    var item = { code: cfg.code, titulo: cfg.titulo, nota: t.nota, pie: cfg.pie, filas: [] };

    if (cfg.matriz) {
      /* matriz NP x NC: fila 1 = los cuatro tramos de NP, filas siguientes =
         NC 100/60/25/10 con los cuatro NR que salen de combinar cada uno.
         Los nombres de los dos ejes no estan en la matriz: se toman de las
         tablas del NP (indice 3) y del NC (indice 4), que ya se han
         construido porque van antes en CFG. */
      item.encabezado = { esquina: 'Nivel de consecuencias (NC) ↓', columnas: t.filas[1].slice(2) };
      /* los dos titulos de los ejes: el de las columnas va en horizontal
         sobre el banner y el de las filas, vertical, a la izquierda */
      item.tituloColumnas = 'Nivel de Probabilidad (NP)';
      item.tituloFilas = 'Nivel de Consecuencias (NC)';
      item.encabezado.columnas = item.encabezado.columnas.map(function (rango, i) {
        return { rango: rango, etiqueta: nombreNP(out, rango, i), cod: codNP(out, rango, i) };
      });
      t.filas.slice(2).forEach(function (f, i) {
        item.filas.push({
          nc: f[1] || '',
          etiqueta: nombreNC(out, f[1] || ''),
          cod: codNC(out, f[1] || ''),
          celdas: f.slice(2).map(function (c) {
            var niveles = nivelesDeNR(c).map(function (x) {
              return { nivel: x.nivel, valor: x.valor, tono: cfg.severidadNivel[x.nivel] || 'green' };
            });
            return {
              niveles: niveles,
              valor: niveles.map(function (x) { return x.valor; }).join(' · '),
              tono: niveles[0].tono
            };
          })
        });
      });
    } else {
      var head = t.filas[0];
      var sub = cfg.sub2 ? t.filas[1] : null;
      var columnas = sub ? [head[1]].concat(sub.slice(1)) : head.slice(1);
      item.encabezado = {
        esquina: bonito(head[0]),
        columnas: columnas.filter(function (c, i) { return c || i === 0; }).map(bonito)
      };
      t.filas.slice(cfg.sub2 ? 2 : 1).forEach(function (f) {
        var c0 = separarCodigo(bonito(f[0]));
        if (CORRECCIONES[c0.label]) c0.label = CORRECCIONES[c0.label];
        item.filas.push({
          cod: c0.cod,
          etiqueta: c0.label,
          celdas: f.slice(1).map(bonito),
          tono: cfg.severidad[c0.cod] || 'green'
        });
      });
    }
    out[cfg.key] = item;
  });
  return out;
}

/* ---------- escritura del fichero de datos ---------- */

function literal(v, sangria) {
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    return '[\n' + v.map(function (x) { return sangria + '  ' + literal(x, sangria + '  '); }).join(',\n') +
      '\n' + sangria + ']';
  }
  if (v && typeof v === 'object') {
    var claves = Object.keys(v);
    if (!claves.length) return '{}';
    return '{\n' + claves.map(function (k) {
      return sangria + '  ' + k + ': ' + literal(v[k], sangria + '  ');
    }).join(',\n') + '\n' + sangria + '}';
  }
  return JSON.stringify(String(v));
}

function comentario(s) {
  return String(s).replace(/\n\s*/g, ' ');
}

var tablas = construir(leerDocumento(DOCX));

var cuerpo = Object.keys(tablas).map(function (k) {
  var t = tablas[k];
  return '  ' + k + ': {\n' +
    '    code: ' + JSON.stringify(t.code) + ',\n' +
    '    titulo: ' + JSON.stringify(t.titulo) + ',\n' +
    (t.tituloColumnas ? '    tituloColumnas: ' + JSON.stringify(t.tituloColumnas) + ',\n' : '') +
    (t.tituloFilas ? '    tituloFilas: ' + JSON.stringify(t.tituloFilas) + ',\n' : '') +
    '    encabezado: ' + literal(t.encabezado, '    ') + ',\n' +
    (t.nota ? '    nota: ' + JSON.stringify(t.nota) + ',\n' : '') +
    '    pie: ' + JSON.stringify(comentario(t.pie)) + ',\n' +
    '    filas: ' + literal(t.filas, '    ') + '\n' +
    '  }';
}).join(',\n');

var salida = '/* Tablas extraidas de ER.docx para los bloques NE, NP, NC, NR y NI del\n' +
  '   slide 7. Fichero GENERADO por tools/extract_er_tables.js: no editar a mano.\n\n' +
  '   El tono (green/red) es la intencion de diseno por severidad; el texto y los\n' +
  '   valores provienen literalmente del documento. */\n' +
  'window.ER_TABLES = {\n' + cuerpo + '\n};\n';

fs.writeFileSync(SALIDA, salida, 'utf8');

/* resumen en consola */
Object.keys(tablas).forEach(function (k) {
  var t = tablas[k];
  console.log(t.code + ' (' + k + '): ' + t.filas.length + ' filas' +
    (t.encabezado && !t.encabezado.columnas ? ' x ' + t.filas[0].celdas.length + ' columnas' : ''));
});
console.log('escrito: ' + path.relative(RAIZ, SALIDA));

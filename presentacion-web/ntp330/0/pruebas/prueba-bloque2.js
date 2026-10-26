/* Prueba del bloque 2: matriz editable con dropdowns, cuestionario modal y NE/NC modales */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

/* Chrome se puede localizar en otro sitio con la variable NTP330_CHROME */
const CHROME = process.env.NTP330_CHROME ||
  'C:/Program Files/Google/Chrome/Application/chrome.exe';
const APP = path.resolve(__dirname, '..', 'index.html');
/* Las copias van fuera del módulo para evitar copiar la app dentro de sí misma. */
const SALIDA_DIR = path.join(__dirname, 'out');
const WORK = path.resolve(__dirname, '..', '..', '..', '..', 'tools', 'out', 'ntp330_prueba_bloque2_' + process.pid);
/* Las capturas y el informe van a 0/pruebas/out/, dentro del repo */
const SALIDA = SALIDA_DIR.split(path.sep).join('/');
const NL = '\n';
let navegador;
let conexion;
let cliente;

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


function expresionRecarga() {
  var o = {};
  var evals = DBApp.listarEvaluaciones();
  o.evaluaciones = evals.length;
  var ev = evals.filter(function (e) { return e.riesgos && Object.keys(e.riesgos).length; })[0];
  if (!ev) return o;
  var ids = Object.keys(ev.riesgos);
  var conDatos = ids.filter(function (id) { return ev.riesgos[id].respuestas && Object.keys(ev.riesgos[id].respuestas).length; });
  o.riesgosGuardados = ids.length;
  o.riesgosConChecklist = conDatos.length;
  if (conDatos.length) {
    var r = ev.riesgos[conDatos[0]];
    o.codigo = r.codigo;
    o.ne = r.ne ? r.ne.valor : null;
    o.nc = r.nc ? r.nc.valor : null;
  }
  return o;
}
function verificarRestauracionUI() {
  var o = {};
  function exigir(ok, mensaje) { if (!ok) throw new Error(mensaje); }
  var tipo = document.getElementById('selTipoProyecto');
  tipo.value = 'Estructura';
  tipo.dispatchEvent(new Event('change', { bubbles: true }));
  var inp = document.getElementById('inpProyecto');
  inp.value = 'Test Bloque 2';
  inp.dispatchEvent(new Event('change', { bubbles: true }));
  exigir(!document.getElementById('zona-evals-proyecto').classList.contains('oculto'), 'No se listaron las evaluaciones del proyecto');
  var abrir = document.querySelector('#tabla-evals-proyecto .btn-abrir-eval');
  exigir(!!abrir, 'No hay botón Abrir en la tabla de evaluaciones');
  abrir.click();

  var filas = document.querySelectorAll('#tabla-resumen tbody tr');
  o.filas = filas.length;
  /* Solo deben volver los riesgos agregados: nada de los pre-generados del proceso */
  var esperadas = 0;
  DBApp.listarEvaluacionesDeProyecto('Test Bloque 2', 'Estructura').forEach(function (e) {
    esperadas += Object.keys(e.riesgos || {}).length;
  });
  o.filasEsperadas = esperadas;
  exigir(esperadas >= 2, 'La evaluación guardada no conserva los riesgos agregados');
  exigir(filas.length === esperadas, 'Se restauraron ' + filas.length + ' filas; se esperaban ' + esperadas + ' (solo los agregados)');

  var f0 = filas[0];
  function celda(f, n) { return f.querySelector('td:nth-child(' + n + ')').textContent.trim(); }
  o.codigo = celda(f0, 5);
  exigir(celda(f0, 5) === '020 - E', 'No se restauró el código del riesgo: ' + celda(f0, 5));
  exigir(/^[0-9.,]+$/.test(celda(f0, 8)), 'No se restauró el ND: ' + celda(f0, 8));
  o.restaurado = { nd: celda(f0, 8), ne: celda(f0, 9), np: celda(f0, 10), nc: celda(f0, 11), nr: celda(f0, 12), ni: celda(f0, 13) };
  exigir(celda(f0, 9) === '2' && celda(f0, 11) === '25', 'No se restauraron NE/NC: ' + celda(f0, 9) + '/' + celda(f0, 11));

  /* El dropdown debe mostrar el riesgo restaurado, no el placeholder */
  var sel = f0.querySelector('.sel-riesgo');
  exigir(sel && sel.value !== '', 'El dropdown del riesgo restaurado quedó en el placeholder');
  var etiqueta = sel.options[sel.selectedIndex].textContent;
  exigir(etiqueta.indexOf('020 - E') !== -1 || etiqueta.indexOf('020-E') !== -1, 'El dropdown muestra otra opción: ' + etiqueta);
  o.etiquetaDropdown = etiqueta;

  /* El riesgo manual debe volver sin lista de chequeo y sin ND */
  var fm = filas[1];
  o.manual = { riesgo: celda(fm, 1), nd: celda(fm, 8) };
  exigir(celda(fm, 1).indexOf('sílice') !== -1, 'No se restauró el riesgo manual: ' + celda(fm, 1));
  exigir(celda(fm, 8) === '—', 'El riesgo manual no debería tener ND: ' + celda(fm, 8));

  /* Un dropdown nuevo no debe ofrecer riesgos ya usados */
  var libre = document.getElementById('btnAgregarRiesgo');
  exigir(libre, 'No existe el botón Agregar riesgo tras restaurar');
  libre.click();
  var selNuevo = document.querySelectorAll('#tabla-resumen tbody tr')[esperadas].querySelector('.sel-riesgo');
  var valores = Array.prototype.slice.call(selNuevo.options).filter(function (op) { return op.value !== ''; }).map(function (op) { return op.textContent; });
  o.opcionesLibres = valores.length;
  exigir(valores.every(function (t) { return t.indexOf('020 - E') === -1; }), 'El riesgo ya evaluado sigue disponible en el dropdown');
  o.desbordeTrasAgregar = document.documentElement.scrollWidth > window.innerWidth + 1;
  exigir(!o.desbordeTrasAgregar, 'La página desborda al agregar una fila');
  return o;
}
/** Conexión de datos entre la matriz del numeral 2 y la unificada, y acumulación
    progresiva entre varios procesos constructivos. */
function verificarConexionMatriz() {
  var o = {}, alertas = [];
  function exigir(ok, mensaje) { if (!ok) throw new Error(mensaje); }
  function pulsar(selector) {
    var e = document.querySelector(selector);
    exigir(!!e && !e.disabled, 'Control no disponible: ' + selector);
    e.click();
  }
  function cambiar(selector, valor, evento) {
    var e = document.querySelector(selector);
    exigir(!!e, 'Campo no disponible: ' + selector);
    e.value = valor;
    e.dispatchEvent(new Event(evento || 'change', { bubbles: true }));
  }
  function celdas(tr) {
    return Array.prototype.map.call(tr.cells, function (c) { return c.textContent.trim(); });
  }
  var alertaOriginal = window.alert, confirmarOriginal = window.confirm;
  window.alert = function (t) { alertas.push(t); };
  window.confirm = function () { return true; };

  try {
    /* --- 1. La columna Proyecto debe mostrar el proyecto, no el proceso --- */
    pulsar('.tab-btn[data-tab="matriz-unificada"]');
    AppUI.verMatrizUnificada();
    var riesgo = document.querySelector('#tabla-unificada tbody tr:not(.fila-grupo)');
    exigir(!!riesgo, 'La matriz unificada no tiene riesgos');
    var c = celdas(riesgo);
    o.proyectoEnFila = c[2];
    o.procesoEnFila = c[3];
    exigir(c[2] === 'Test Bloque 2', 'La columna Proyecto muestra "' + c[2] + '" en vez del nombre del proyecto');
    exigir(c[3] === 'Obras preliminares', 'La columna Proceso no muestra el proceso: ' + c[3]);

    /* --- 2. Los NP/NR de la unificada deben coincidir con el numeral 2 --- */
    var ev = DBApp.listarEvaluaciones().filter(function (e) {
      return e.proyecto === 'Test Bloque 2' && e.tipoProyecto === 'Estructura';
    })[0];
    exigir(!!ev, 'No se encontró la evaluación del proyecto');
    var guardado = ev.riesgos[Object.keys(ev.riesgos)[0]];
    var calc = AppUI.resultadoDeGuardado(guardado);
    exigir(celdas(riesgo)[5] === NTP330.fmt(calc.res.nd),
      'El ND de la unificada (' + celdas(riesgo)[5] + ') no coincide con el motor (' + NTP330.fmt(calc.res.nd) + ')');

    /* --- 3. Un riesgo sin NE/NC no puede inventar NP, NR ni NI --- */
    var incompletos = Array.prototype.filter.call(
      document.querySelectorAll('#tabla-unificada tbody tr:not(.fila-grupo)'), function (tr) {
        return celdas(tr)[6] === '' || celdas(tr)[8] === '';
      });
    o.riesgosIncompletos = incompletos.length;
    exigir(incompletos.length > 0, 'No hay riesgos incompletos para comprobar el guion');
    incompletos.forEach(function (tr) {
      var cc = celdas(tr);
      exigir(cc[7] === '—', 'Un riesgo sin NE muestra NP=' + cc[7] + ' en vez de —');
      exigir(cc[9] === '—', 'Un riesgo sin NE/NC muestra NR=' + cc[9] + ' en vez de —');
      exigir(cc[10] === '', 'Un riesgo sin NE/NC muestra NI=' + cc[10] + ' en vez de vacío');
    });

    /* --- 4. Acumulación progresiva: un segundo proceso añade su propio grupo --- */
    cambiar('#selProceso', 'Obras de cimentación');
    var opciones = Array.prototype.slice.call(document.getElementById('selProceso').options)
      .map(function (o2) { return o2.value; }).filter(function (v) { return v !== ''; });
    if (opciones.indexOf('Obras de cimentación') === -1 && opciones.length > 1) {
      cambiar('#selProceso', opciones[1]);
      o.segundoProceso = opciones[1];
    } else {
      o.segundoProceso = 'Obras de cimentación';
    }
    pulsar('#btnAgregarRiesgo');
    var filasProc = document.querySelectorAll('#tabla-resumen tbody tr');
    var selProc = filasProc[filasProc.length - 1].querySelector('.sel-riesgo');
    selProc.value = selProc.options[1].value;
    selProc.dispatchEvent(new Event('change', { bubbles: true }));
    var cerrar = document.getElementById('checklist-cerrar');
    if (cerrar) cerrar.click();
    AppUI.verMatrizUnificada();
    var gruposProc = document.querySelectorAll('#tabla-unificada tbody tr.fila-grupo');
    o.gruposAcumulados = gruposProc.length;
    exigir(gruposProc.length === 2, 'La matriz acumulada debe mostrar 2 procesos y muestra ' + gruposProc.length);
    var riesgosProc = document.querySelectorAll('#tabla-unificada tbody tr:not(.fila-grupo)');
    o.riesgosAcumulados = riesgosProc.length;
    exigir(riesgosProc.length >= 4, 'La matriz acumulada debe listar los riesgos de ambos procesos: ' + riesgosProc.length);

    /* --- 5. Volver a escoger un proceso NO debe borrar su evaluación --- */
    var antes = DBApp.listarEvaluacionesDeProyecto('Test Bloque 2', 'Estructura');
    var riesgosPorProceso = {};
    antes.forEach(function (e) { riesgosPorProceso[e.proceso] = Object.keys(e.riesgos || {}).length; });
    cambiar('#selProceso', o.segundoProceso);
    var despues = DBApp.listarEvaluacionesDeProyecto('Test Bloque 2', 'Estructura');
    o.procesosTrasReseleccion = despues.length;
    o.evaluacionesAntes = antes.length;
    exigir(despues.length === antes.length,
      'Re-seleccionar un proceso borró evaluaciones: ' + antes.length + ' → ' + despues.length);
    despues.forEach(function (e) {
      exigir(riesgosPorProceso[e.proceso] === Object.keys(e.riesgos || {}).length,
        'Re-seleccionar el proceso "' + e.proceso + '" perdió sus riesgos');
    });
    var filasRestauradas = document.querySelectorAll('#tabla-resumen tbody tr').length;
    var guardadosSegundo = riesgosPorProceso[o.segundoProceso] || 0;
    o.filasRestauradasAlVolver = filasRestauradas;
    o.riesgosGuardadosSegundoProceso = guardadosSegundo;
    exigir(filasRestauradas === guardadosSegundo,
      'Al volver al proceso "' + o.segundoProceso + '" se restauraron ' + filasRestauradas +
      ' filas; había ' + guardadosSegundo);
    AppUI.verMatrizUnificada();
    o.gruposAlFinal = document.querySelectorAll('#tabla-unificada tbody tr.fila-grupo').length;
    exigir(o.gruposAlFinal === 2, 'Al volver al proceso la matriz perdió grupos: ' + o.gruposAlFinal);

    /* --- 6. Editar una lista en el Catálogo no debe desincronizar las matrices --- */
    var riesgoCompleto = null;
    DBApp.listarEvaluacionesDeProyecto('Test Bloque 2', 'Estructura').forEach(function (e) {
      Object.keys(e.riesgos || {}).forEach(function (rid) {
        var g = e.riesgos[rid];
        if (riesgoCompleto) return;
        if (g.ne && g.ne.valor && g.nc && g.nc.valor && g.sheet) riesgoCompleto = { g: g, evId: e.id, rid: rid };
      });
    });
    exigir(!!riesgoCompleto, 'No hay un riesgo completo con lista de chequeo');
    var sheet = riesgoCompleto.g.sheet;
    var cat0 = null;
    for (var ci = 0; ci < APP_CATALOGO.length; ci++) {
      if (APP_CATALOGO[ci].sheet === sheet) { cat0 = APP_CATALOGO[ci]; break; }
    }
    exigir(!!cat0, 'No se encontró la lista ' + sheet);
    var evObj = DBApp.listarEvaluaciones().filter(function (e) { return e.id === riesgoCompleto.evId; })[0];
    var gObj = evObj.riesgos[riesgoCompleto.rid];
    var respuestasOriginales = JSON.parse(JSON.stringify(gObj.respuestas));
    var original = DBApp.leerOverrides();
    function leerNd(codigo) {
      var v = null;
      Array.prototype.some.call(document.querySelectorAll('#tabla-resumen tbody tr'), function (tr) {
        if (celdas(tr)[4] === codigo) { v = celdas(tr)[7]; return true; }
        return false;
      });
      return v;
    }
    /* Con todas las respuestas en "No", ΣNDP = 10 siempre: el ND valdría 10
       con cualquier NDR y la prueba no detectaría nada. Se pasa una pregunta a "Si"
       para que el ND baje del tope y el reparto de NDR sea observable. */
    var no1 = null, no2 = null;
    cat0.preguntas.forEach(function (p) {
      if (gObj.respuestas[p.n] === 'no') { if (!no1) no1 = p; else if (!no2) no2 = p; }
    });
    exigir(!!no1 && !!no2, 'El riesgo de prueba no tiene dos respuestas "No"');
    gObj.respuestas[no1.n] = 'si';
    DBApp.guardarEvaluacion(evObj);
    AppUI.abrirEvaluacion(evObj.id);
    var ndBase = leerNd(gObj.codigo);
    o.ndBase = ndBase;
    exigir(ndBase !== null && +ndBase < 10,
      'No se pudo bajar el ND del tope (base ' + ndBase + '); la prueba no sería válida');

    var copia = JSON.parse(JSON.stringify(original));
    if (!copia[sheet]) copia[sheet] = {};
    copia[sheet].preguntas = JSON.parse(JSON.stringify(cat0.preguntas));
    var idxNo2 = -1;
    copia[sheet].preguntas.forEach(function (p, i) { if (p.n === no2.n) idxNo2 = i; });
    exigir(idxNo2 >= 0, 'No se localizó la pregunta a editar');
    copia[sheet].preguntas[idxNo2].ndr = 0;
    /* El catálogo trae `ndp` precalculado y el motor lo prefiere al NDR: hay que
       recalcularlo como hace la pestaña Catálogo (AdminApp.recalcularNDP). */
    var sumaNdr = copia[sheet].preguntas.reduce(function (s, p) { return s + (+p.ndr || 0); }, 0);
    copia[sheet].preguntas.forEach(function (p) {
      p.ndp = sumaNdr > 0 ? Math.round((+p.ndr * 10 / sumaNdr) * 10000) / 10000 : 0;
    });
    DBApp.setOverrides(copia);
    try {
      document.querySelector('.tab-btn[data-tab="evaluacion"]').click();
      AppUI.abrirEvaluacion(evObj.id);
      AppUI.verMatrizUnificada();
      var ndUnif = null;
      Array.prototype.some.call(document.querySelectorAll('#tabla-unificada tbody tr:not(.fila-grupo)'),
        function (tr) {
          var cc = celdas(tr);
          if (gObj.codigo && cc[4].indexOf(gObj.codigo) !== -1) { ndUnif = cc[5]; return true; }
          return false;
        });
      var ndNum2 = leerNd(gObj.codigo);
      o.ndConOverrideCatalogo = { unificada: ndUnif, numeral2: ndNum2, base: ndBase };
      exigir(!!ndUnif, 'No se encontró el riesgo en la matriz unificada tras editar el catálogo');
      exigir(ndNum2 !== ndBase && +ndNum2 < +ndBase,
        'Poner a 0 un NDR no bajó el ND del numeral 2 (' + ndBase + ' → ' + ndNum2 + ')');
      exigir(ndUnif !== ndBase && +ndUnif < +ndBase,
        'La matriz unificada ignoró la edición del catálogo: ND ' + ndBase + ' → ' + ndUnif);
      exigir(ndUnif === ndNum2,
        'Tras editar la lista del Catálogo el ND difiere: unificada ' + ndUnif + ' vs numeral 2 ' + ndNum2);
    } finally {
      DBApp.setOverrides(original);
      gObj.respuestas = respuestasOriginales;
      DBApp.guardarEvaluacion(evObj);
      document.querySelector('.tab-btn[data-tab="evaluacion"]').click();
      AppUI.abrirEvaluacion(evObj.id);
    }
    o.erroresInternos = alertas;
  } finally {
    window.alert = alertaOriginal;
    window.confirm = confirmarOriginal;
  }
  return o;
}
/** Cada proyecto arranca desde cero: escribir un nombre nuevo no puede arrastrar datos
    de otro proyecto, ni de Estructura ni de Infraestructura. Y un proyecto anterior
    elegido por su nombre sí retoma su información. */
function verificarAislamientoProyectos() {
  var o = {}, alertas = [];
  function exigir(ok, mensaje) { if (!ok) throw new Error(mensaje); }
  function pulsar(selector) {
    var e = document.querySelector(selector);
    exigir(!!e && !e.disabled, 'Control no disponible: ' + selector);
    e.click();
  }
  function cambiar(selector, valor, evento) {
    var e = document.querySelector(selector);
    exigir(!!e, 'Campo no disponible: ' + selector);
    e.value = valor;
    e.dispatchEvent(new Event(evento || 'change', { bubbles: true }));
  }
  function nombreProyecto() { return document.getElementById('inpProyecto').value.trim(); }
  /* Solo filas de riesgo: la tabla emite además una fila de aviso de 1 celda */
  function filasRiesgoUnificado() {
    return Array.prototype.filter.call(
      document.querySelectorAll('#tabla-unificada tbody tr'), function (tr) {
        return !tr.classList.contains('fila-grupo') && tr.cells.length === 13;
      });
  }
  var alertaOriginal = window.alert, confirmarOriginal = window.confirm;
  var confirmaciones = [];
  window.alert = function (t) { alertas.push(String(t)); };
  window.confirm = function (m) { confirmaciones.push(String(m)); return true; };

  try {
    /* --- 0. Flecha permanente y los tres campos en la misma línea --- */
    var btnFlecha = document.getElementById('btnComboProyecto');
    exigir(btnFlecha, 'No existe el botón de la flecha del desplegable');
    o.flechaVisible = btnFlecha.offsetWidth > 0 && btnFlecha.offsetHeight > 0;
    exigir(o.flechaVisible, 'La flecha del desplegable no es visible');
    var cajaTipo = document.getElementById('selTipoProyecto').getBoundingClientRect();
    var cajaProc = document.getElementById('selProceso').getBoundingClientRect();
    var cajaProyecto = document.getElementById('inpProyecto').getBoundingClientRect();
    o.alineacion = {
      tipo: Math.round(cajaTipo.top), proyecto: Math.round(cajaProyecto.top), proceso: Math.round(cajaProc.top),
      altoTipo: Math.round(cajaTipo.height), altoProyecto: Math.round(cajaProyecto.height)
    };
    exigir(Math.abs(cajaTipo.top - cajaProyecto.top) <= 1,
      'El nombre del proyecto no está a la misma altura que Tipo de proyecto: ' +
      Math.round(cajaTipo.top) + ' vs ' + Math.round(cajaProyecto.top));
    exigir(Math.abs(cajaTipo.top - cajaProc.top) <= 1,
      'El proceso no está a la misma altura que Tipo de proyecto: ' +
      Math.round(cajaTipo.top) + ' vs ' + Math.round(cajaProc.top));
    exigir(Math.abs(cajaTipo.height - cajaProyecto.height) <= 1,
      'El campo de proyecto y el de tipo no miden lo mismo: ' +
      Math.round(cajaTipo.height) + ' vs ' + Math.round(cajaProyecto.height));

    /* --- 1. Las sugerencias ofrecen el proyecto anterior con sus evaluaciones --- */
    /* Base conocida: la prueba anterior dejó «Test Bloque 2» abierto con sus riesgos.
       Se pone el numeral 2 en cero, porque con trabajo en curso TODO cambio de nombre
       debe preguntar, y aquí se quiere comprobar que un nombre nuevo entra limpio. */
    AppUI.inicializarParaProyecto('Test Bloque 2', 'Estructura');
    cambiar('#selTipoProyecto', 'Estructura');
    exigir(!AppUI.hayTrabajoEnCurso(), 'La base no quedó sin trabajo en curso');
    AppUI.abrirComboProyecto();
    exigir(AppUI.comboAbierto(), 'La flecha no abrió el desplegable');
    var sugerencias = document.getElementById('listaProyectosSugeridos');
    exigir(sugerencias, 'No existe el desplegable de proyectos anteriores');
    o.listaVisible = !sugerencias.classList.contains('oculto');
    exigir(o.listaVisible, 'La lista se abrió oculta');
    /* Un nombre inexistente sí debe ofrecerse como proyecto nuevo */
    document.getElementById('inpProyecto').value = 'Proyecto Inédito X';
    AppUI.abrirComboProyecto();
    var nuevo = sugerencias.querySelector('.combo-opcion--nuevo');
    o.ofreceNombreNuevoLibre = !!nuevo && nuevo.getAttribute('data-valor') === 'Proyecto Inédito X';
    exigir(o.ofreceNombreNuevoLibre,
      'No ofreció como proyecto nuevo un nombre que no existe');
    document.getElementById('inpProyecto').value = '';
    AppUI.abrirComboProyecto();
    var valores = Array.prototype.map.call(sugerencias.querySelectorAll('.combo-opcion'),
      function (op) { return op.getAttribute('data-valor'); });
    o.sugerencias = valores;
    exigir(valores.indexOf('Test Bloque 2') !== -1,
      'El proyecto actual no aparece entre los proyectos anteriores: ' + valores.join(', '));
    var etiquetas = Array.prototype.map.call(sugerencias.querySelectorAll('.combo-opcion'),
      function (op) {
        var d = op.querySelector('.combo-detalle');
        return d ? d.textContent : '';
      });
    o.etiquetaSugerencia = etiquetas.filter(function (t) { return /evaluaci/.test(t); })[0] || null;
    exigir(/[1-9]\d* evaluaci/.test(o.etiquetaSugerencia || ''),
      'La sugerencia no indica cuántas evaluaciones tiene: ' + o.etiquetaSugerencia);

    /* --- 2. Nombre nuevo: el numeral 2 y la matriz quedan en cero --- */
    var evaluacionesAntes = DBApp.listarEvaluaciones().length;
    o.evaluacionesGlobalAntes = evaluacionesAntes;
    cambiar('#inpProyecto', 'Obra Nueva Cero');
    exigir(nombreProyecto() === 'Obra Nueva Cero', 'No se aceptó el nombre nuevo');
    exigir(alertas.length === 0, 'Un proyecto nuevo lanzó aviso inesperado: ' + alertas.join(' | '));
    exigir(confirmaciones.length === 0,
      'Un proyecto nuevo pidió confirmar guardado: ' + confirmaciones.join(' | '));
    o.filasEnNuevoProyecto = document.querySelectorAll('#tabla-resumen tbody tr').length;
    exigir(o.filasEnNuevoProyecto === 0 || document.getElementById('zona-riesgos').classList.contains('oculto'),
      'El numeral 2 conservó ' + o.filasEnNuevoProyecto + ' filas del proyecto anterior');
    o.evalsVisiblesNuevo = DBApp.listarEvaluacionesDeProyecto('Obra Nueva Cero', 'Estructura').length;
    exigir(o.evalsVisiblesNuevo === 0, 'El proyecto nuevo heredó evaluaciones');
    var selUnif = document.getElementById('selProyectoUnificado');
    o.matrizEnNuevoProyecto = selUnif.value;
    exigir(selUnif.value === 'Obra Nueva Cero||Estructura',
      'La matriz no apuntó al proyecto nuevo: ' + selUnif.value);
    exigir(filasRiesgoUnificado().length === 0,
      'La matriz unificada trajo riesgos de otro proyecto');
    pulsar('.tab-btn[data-tab="matriz-unificada"]');
    exigir(filasRiesgoUnificado().length === 0,
      'Al abrir la pestaña 2 la matriz del proyecto nuevo trae datos ajenos');
    pulsar('.tab-btn[data-tab="evaluacion"]');

    /* --- 3. Estructura e Infraestructura nunca se mezclan con el mismo nombre --- */
    cambiar('#selTipoProyecto', 'Infraestructura');
    cambiar('#inpProyecto', 'Test Bloque 2');
    exigir(alertas.length === 1, 'No se avisó del cruce Estructura/Infraestructura: ' + alertas.length);
    o.avisoCruce = alertas[0];
    exigir(/ya existe como proyecto de tipo Estructura/.test(o.avisoCruce),
      'El aviso no explica el choque de tipo: ' + o.avisoCruce);
    exigir(nombreProyecto() === 'Obra Nueva Cero',
      'El nombre que chocó no se revirtió: ' + nombreProyecto());
    o.sugerenciasInfraestructura = Array.prototype.map.call(
      document.getElementById('listaProyectosSugeridos').querySelectorAll('.combo-opcion'),
      function (op) { return op.getAttribute('data-valor'); });
    exigir(o.sugerenciasInfraestructura.indexOf('Test Bloque 2') === -1,
      'Se ofreció un proyecto de Estructura al elegir Infraestructura: ' + o.sugerenciasInfraestructura.join(', '));
    /* Con el nombre conflictivo escrito y el tipo en Infraestructura, la lista no debe
       ofrecerlo como proyecto nuevo: ese cambio se rechazaría después. */
    document.getElementById('inpProyecto').value = 'Test Bloque 2';
    AppUI.abrirComboProyecto();
    var opNuevo = sugerencias.querySelector('.combo-opcion--nuevo');
    o.ofreceNombreNuevoEnUso = !!opNuevo &&
      opNuevo.getAttribute('data-valor') === 'Test Bloque 2';
    exigir(!o.ofreceNombreNuevoEnUso,
      'Ofreció como proyecto nuevo un nombre que ya existe en otro tipo');
    var notaChoque = document.getElementById('notaProyectoSugerido').textContent;
    o.notaChoque = notaChoque;
    exigir(/ya está en uso/.test(notaChoque),
      'La nota no avisó del nombre ya usado: ' + notaChoque);
    document.getElementById('inpProyecto').value = 'Obra Nueva Cero';
    AppUI.cerrarComboProyecto();

    /* --- 4. Elegir el proyecto desde la lista lo retoma --- */
    cambiar('#selTipoProyecto', 'Estructura');
    AppUI.abrirComboProyecto();
    var opcionesLista = document.querySelectorAll('#listaProyectosSugeridos .combo-opcion');
    var destino = null;
    Array.prototype.some.call(opcionesLista, function (op) {
      if (op.getAttribute('data-valor') === 'Test Bloque 2') { destino = op; return true; }
      return false;
    });
    exigir(!!destino, 'El proyecto anterior no aparece en la lista desplegada');
    o.flechaEnFoco = document.activeElement === document.getElementById('btnComboProyecto');
    destino.click();
    exigir(!AppUI.comboAbierto(), 'La lista siguió abierta tras elegir un proyecto');
    exigir(nombreProyecto() === 'Test Bloque 2',
      'Elegir en la lista no puso el nombre del proyecto: ' + nombreProyecto());
    o.elegidoDesdeLista = true;
    var procesos = Array.prototype.slice.call(document.getElementById('selProceso').options)
      .map(function (op) { return op.value; }).filter(function (v) { return v !== ''; });
    exigir(procesos.length > 0, 'No hay procesos para el proyecto retomado');
    cambiar('#selProceso', procesos[0]);
    var evaluadas = DBApp.listarEvaluacionesDeProyecto('Test Bloque 2', 'Estructura')
      .filter(function (e) { return e.proceso === procesos[0]; });
    o.evaluacionesProcesoRetomado = evaluadas.length;
    var filasRetomadas = document.querySelectorAll('#tabla-resumen tbody tr').length;
    o.filasRetomadas = filasRetomadas;
    if (evaluadas.length) {
      var guardados = Object.keys(evaluadas[0].riesgos || {}).length;
      exigir(filasRetomadas === guardados,
        'Retomar el proyecto no restauró sus riesgos: ' + filasRetomadas + ' vs ' + guardados);
    }
    AppUI.verMatrizUnificada();
    o.gruposRetomados = document.querySelectorAll('#tabla-unificada tbody tr.fila-grupo').length;
    exigir(o.gruposRetomados >= 1, 'La matriz del proyecto retomado está vacía');

    /* --- 5. El trabajo en curso se ofrece guardar en el proyecto al que pertenece --- */
    pulsar('#btnAgregarRiesgo');
    var filas = document.querySelectorAll('#tabla-resumen tbody tr');
    var selRiesgo = filas[filas.length - 1].querySelector('.sel-riesgo');
    selRiesgo.value = selRiesgo.options[1].value;
    selRiesgo.dispatchEvent(new Event('change', { bubbles: true }));
    var cerrarCk = document.getElementById('checklist-cerrar');
    if (cerrarCk) cerrarCk.click();
    confirmaciones = [];
    cambiar('#inpProyecto', 'Tercer Proyecto');
    o.pedidosConfirmacion = confirmaciones;
    exigir(confirmaciones.length === 1, 'No se pidió confirmar el guardado del trabajo en curso');
    exigir(/Test Bloque 2/.test(confirmaciones[0]),
      'La confirmación no menciona el proyecto de origen: ' + confirmaciones[0]);
    var guardadoEnOrigen = DBApp.listarEvaluacionesDeProyecto('Test Bloque 2', 'Estructura')
      .filter(function (e) { return e.proceso === procesos[0]; });
    exigir(guardadoEnOrigen.length === 1, 'No se guardó el trabajo en el proyecto de origen');
    o.riesgosEnOrigen = guardadoEnOrigen.length
      ? Object.keys(guardadoEnOrigen[0].riesgos).length : 0;
    exigir(o.riesgosEnOrigen >= 2,
      'El trabajo en curso no llegó al proyecto de origen: ' + o.riesgosEnOrigen);
    exigir(DBApp.listarEvaluacionesDeProyecto('Tercer Proyecto', 'Estructura').length === 0,
      'El trabajo se copió también al proyecto nuevo');
    o.proyectosFinales = DBApp.listarProyectos().length;
    o.evaluacionesFinales = DBApp.listarEvaluaciones().length;
    /* La evaluación del origen ya existía: se actualizó en su sitio, así que el total
       no cambia. Lo importante es que no se creó ninguna evaluación del proyecto nuevo. */
    exigir(o.evaluacionesFinales === evaluacionesAntes,
      'El total de evaluaciones cambió al cambiar de proyecto: ' + evaluacionesAntes + ' → ' + o.evaluacionesFinales);
    exigir(DBApp.listarEvaluaciones().every(function (e) {
      return e.proyecto !== 'Tercer Proyecto' && e.proyecto !== 'Obra Nueva Cero';
    }), 'Quedaron evaluaciones en los proyectos nuevos');
  } finally {
    window.alert = alertaOriginal;
    window.confirm = confirmarOriginal;
  }
  return o;
}
function verificarBloque2() {
  var o = {}, alertas = [];
  var alertaOriginal = window.alert, confirmarOriginal = window.confirm;
  function exigir(ok, mensaje) { if (!ok) throw new Error(mensaje); }
  function pulsar(selector) {
    var e = document.querySelector(selector);
    exigir(!!e && !e.disabled, 'Control no disponible: ' + selector);
    e.click();
  }
  function cambiar(selector, valor, evento) {
    var e = document.querySelector(selector);
    exigir(!!e, 'Campo no disponible: ' + selector);
    e.value = valor;
    e.dispatchEvent(new Event(evento || 'change', { bubbles: true }));
  }
  window.alert = function (texto) { alertas.push(texto); };
  window.confirm = function () { return true; };
  try {
    pulsar('.tab-btn[data-tab="evaluacion"]');
    pulsar('#btnCrearProyecto');
    cambiar('#inpNuevoProyectoNombre', 'Test Bloque 2');
    cambiar('#selNuevoProyectoTipo', 'Estructura');
    pulsar('#proyecto-guardar');

    var opciones = Array.prototype.slice.call(document.querySelectorAll('#selProceso option'));
    var opcion = opciones.filter(function (op) {
      if (!op.value) return false;
      var riesgos = AppUI.getRiesgosDeProceso('Estructura', op.value);
      return riesgos.length && riesgos[0].catalogo.preguntas.length;
    })[0];
    exigir(!!opcion, 'No hay proceso con lista de chequeo');
    cambiar('#selProceso', opcion.value);
    o.proceso = opcion.value;

    // Verificar que el bloque 2 está visible y tiene la estructura correcta
    var zonaRiesgos = document.getElementById('zona-riesgos');
    exigir(zonaRiesgos && !zonaRiesgos.classList.contains('oculto'), 'El bloque 2 no está visible');
    var titulo = zonaRiesgos.querySelector('.zona-titulo').textContent;
    exigir(titulo.indexOf('Aplicación de Cuestionarios') !== -1, 'Título incorrecto: ' + titulo);

    // Verificar que existe el botón Agregar riesgo
    var btnAgregar = document.getElementById('btnAgregarRiesgo');
    exigir(btnAgregar, 'No existe el botón Agregar riesgo');

    // Verificar que ya hay una fila (agregada automáticamente al seleccionar proceso)
    var filasIniciales = document.querySelectorAll('#tabla-resumen tbody tr');
    exigir(filasIniciales.length >= 1, 'No hay filas iniciales: ' + filasIniciales.length);

    // Agregar otra fila con el botón
    pulsar('#btnAgregarRiesgo');
    var filas = document.querySelectorAll('#tabla-resumen tbody tr');
    exigir(filas.length === filasIniciales.length + 1, 'No se agregó la fila: ' + filas.length + ' (iniciales: ' + filasIniciales.length + ')');

    // Verificar que el dropdown tiene opciones
    var selRiesgo = document.querySelector('.sel-riesgo');
    exigir(selRiesgo, 'No existe el dropdown de riesgo');
    var opcionesRiesgo = selRiesgo.querySelectorAll('option');
    exigir(opcionesRiesgo.length > 1, 'El dropdown no tiene opciones');

    // Seleccionar un riesgo del dropdown
    var riesgoIdx = 1;
    selRiesgo.value = selRiesgo.options[riesgoIdx].value;
    selRiesgo.dispatchEvent(new Event('change', { bubbles: true }));

    // Verificar que se abrió el modal del cuestionario
    var modalChecklist = document.getElementById('modal-checklist-overlay');
    exigir(modalChecklist && !modalChecklist.classList.contains('oculto'), 'No se abrió el modal del cuestionario');

    // Responder algunas preguntas del cuestionario
    var radios = document.querySelectorAll('#checklist-contenido input[type="radio"][value="no"]');
    exigir(radios.length > 0, 'No hay preguntas en el cuestionario');
    Array.prototype.forEach.call(radios, function (e) {
      e.checked = true;
      e.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Guardar el cuestionario
    pulsar('#checklist-guardar');
    exigir(modalChecklist.classList.contains('oculto'), 'No se cerró el modal del cuestionario');

    // Verificar que el ND se guardó en la matriz
    function filaDe(i) { return document.querySelectorAll('#tabla-resumen tbody tr')[i]; }
    function celda(f, n) { return f.querySelector('td:nth-child(' + n + ')').textContent.trim(); }
    var fila = filaDe(0);
    exigir(/^[0-9.,]+$/.test(celda(fila, 8)), 'El ND no se guardó en la matriz: ' + celda(fila, 8));
    exigir(celda(fila, 10) === '—', 'NP no debe calcularse sin NE: ' + celda(fila, 10));
    exigir(celda(fila, 12) === '—', 'NR no debe calcularse sin NC: ' + celda(fila, 12));

    // Probar modal NE (justificación obligatoria)
    pulsar('#tabla-resumen tbody tr:nth-child(1) .btn-ne');
    var modalNE = document.getElementById('modal-ne-overlay');
    exigir(modalNE && !modalNE.classList.contains('oculto'), 'No se abrió el modal NE');
    pulsar('input[name="ne-nivel"][value="2"]');
    pulsar('#ne-guardar');
    exigir(!modalNE.classList.contains('oculto'), 'El NE se guardó sin justificación');
    exigir(alertas.some(function (t) { return t.indexOf('justificación del NE') !== -1; }), 'No avisó de la justificación obligatoria');
    pulsar('#ne-cancelar');
    pulsar('input[name="ne-nivel"][value="2"]');
    cambiar('#ne-justificacion', 'Exposición frecuente verificada en campo');
    pulsar('#ne-guardar');
    exigir(modalNE.classList.contains('oculto'), 'No se cerró el modal NE');
    fila = filaDe(0);
    exigir(celda(fila, 9) === '2', 'El NE no quedó en la matriz: ' + celda(fila, 9));
    exigir(celda(fila, 12) === '—', 'NR no debe calcularse sin NC: ' + celda(fila, 12));
    /* El panel de detalle debe reflejar el NE recién guardado (no quedar obsoleto).
       renderTabPanel reemplaza el innerHTML, así que hay que volver a consultarlo. */
    function detalle() {
      var s = Array.prototype.filter.call(document.querySelectorAll('#riesgo-tab-panel .riesgo-seccion'), function (x) {
        var h = x.querySelector('h4');
        return h && h.textContent.indexOf('Evaluación del riesgo') !== -1;
      })[0];
      exigir(!!s, 'No se encontró la sección de detalle del riesgo');
      return s;
    }
    var btnNeDetalle = detalle().querySelector('.btn-ne');
    exigir(btnNeDetalle && btnNeDetalle.textContent.indexOf('(2)') !== -1,
      'El botón NE del panel de detalle quedó obsoleto: ' + (btnNeDetalle ? btnNeDetalle.textContent : 'no existe'));

    // Probar modal NC desde el botón de la matriz
    fila = filaDe(0);
    exigir(!!fila.querySelector('.btn-nc'), 'No existe el botón NC en la matriz');
    pulsar('#tabla-resumen tbody tr:nth-child(1) .btn-nc');
    var modalNC = document.getElementById('modal-nc-overlay');
    exigir(modalNC && !modalNC.classList.contains('oculto'), 'No se abrió el modal NC');
    pulsar('input[name="nc-nivel"][value="25"]');
    cambiar('#nc-justificacion', 'Lesión grave con incapacidad temporal');
    pulsar('#nc-guardar');
    exigir(modalNC.classList.contains('oculto'), 'No se cerró el modal NC');

    // Verificar los cálculos automáticos NP = ND × NE y NR = NP × NC
    fila = filaDe(0);
    var riesgo = AppUI.riesgoActivo();
    var res = AppUI.resultadoDe(riesgo);
    exigir(celda(fila, 9) === String(res.ne.valor), 'NE de la matriz no coincide');
    exigir(celda(fila, 10) === NTP330.fmt(res.np), 'NP de la matriz no coincide con el motor');
    exigir(celda(fila, 11) === String(res.nc.valor), 'NC de la matriz no coincide');
    exigir(celda(fila, 12) === NTP330.fmt(res.nr), 'NR de la matriz no coincide con el motor');
    exigir(celda(fila, 13) === res.ni.ni, 'NI de la matriz no coincide con el motor');
    exigir(res.np === res.nd * res.ne.valor, 'NP no cumple NP = ND × NE');
    exigir(res.nr === res.nd * res.ne.valor * res.nc.valor, 'NR no cumple NR = NP × NC');
    var btnNcDetalle = detalle().querySelector('.btn-nc');
    exigir(btnNcDetalle && btnNcDetalle.textContent.indexOf('(25)') !== -1,
      'El botón NC del panel de detalle quedó obsoleto: ' + (btnNcDetalle ? btnNcDetalle.textContent : 'no existe'));

    o.resultado = {
      nd: celda(fila, 8), ne: celda(fila, 9), np: celda(fila, 10),
      nc: celda(fila, 11), nr: celda(fila, 12), ni: celda(fila, 13),
      preguntas: (riesgo.catalogo ? riesgo.catalogo.preguntas.length : 0)
    };

    // Agregar otra fila y seleccionar otro riesgo
    var btnAgregar2 = document.getElementById('btnAgregarRiesgo');
    exigir(btnAgregar2, 'No existe el botón Agregar riesgo después de guardar NC');
    btnAgregar2.click();
    var filas2 = document.querySelectorAll('#tabla-resumen tbody tr');
    exigir(filas2.length === 3, 'No se agregó la segunda fila: ' + filas2.length);

    o.filas = filas2.length;
    o.riesgosDisponibles = opcionesRiesgo.length - 1;

    // Guardado del resultado del riesgo evaluado
    pulsar('#tabla-resumen tbody tr:nth-child(1) .btn-traza');
    exigir(!document.getElementById('modal-traza-overlay').classList.contains('oculto'), 'No se abrió la trazabilidad');
    pulsar('#traza-cerrar');

    // Exclusión con justificación y re-inclusión
    pulsar('#tabla-resumen tbody tr:nth-child(1) .btn-excluir');
    exigir(!document.getElementById('modal-justif-overlay').classList.contains('oculto'), 'No se abrió la justificación de exclusión');
    pulsar('#justif-cancelar');
    exigir(!!document.querySelectorAll('#tabla-resumen tbody tr')[0].querySelector('.btn-excluir'), 'La cancelación revirtió la exclusión');

    // Exclusión efectiva: motivo obligatorio, fila marcada y botón de re-inclusión
    pulsar('#tabla-resumen tbody tr:nth-child(1) .btn-excluir');
    pulsar('#justif-guardar');
    exigir(!document.getElementById('modal-justif-overlay').classList.contains('oculto'), 'La exclusión se aplicó sin motivo');
    exigir(alertas.some(function (t) { return t.indexOf('motivo de exclusión') !== -1; }), 'No avisó del motivo de exclusión obligatorio');
    pulsar('#tabla-resumen tbody tr:nth-child(1) .btn-excluir');
    var motivo = document.querySelector('input[name="justif-motivo"]');
    exigir(!!motivo, 'No hay motivos de exclusión en el modal');
    motivo.checked = true;
    cambiar('#justif-texto', 'Riesgo no aplica a este proceso');
    pulsar('#justif-guardar');
    var filaExcluida = document.querySelectorAll('#tabla-resumen tbody tr')[0];
    exigir(filaExcluida.classList.contains('fila-excluida'), 'La fila no se marcó como excluida');
    exigir(!!filaExcluida.querySelector('.badge-excluido'), 'Falta la insignia Excluido');
    exigir(!!filaExcluida.querySelector('.btn-reincluir'), 'No apareció el botón de re-inclusión');
    exigir(celda(filaExcluida, 13).indexOf('EXCL') !== -1 || filaExcluida.textContent.indexOf('Excluido') !== -1,
      'La fila excluida no indica su estado: ' + filaExcluida.textContent.replace(/\s+/g, ' ').trim());
    o.filaExcluida = filaExcluida.textContent.replace(/\s+/g, ' ').trim().slice(0, 80);

    // Re-inclusión: la fila vuelve a estar activa y conserva ND/NE/NC
    pulsar('#tabla-resumen tbody tr:nth-child(1) .btn-reincluir');
    fila = filaDe(0);
    exigir(!fila.classList.contains('fila-excluida'), 'La fila sigue excluida tras la re-inclusión');
    exigir(celda(fila, 9) === '2' && celda(fila, 11) === '25', 'La re-inclusión perdió NE/NC: ' + celda(fila, 9) + '/' + celda(fila, 11));

    // Riesgo manual fuera del catálogo del proceso
    pulsar('#btnAgregarRiesgoManual');
    exigir(!document.getElementById('form-riesgo-manual').classList.contains('oculto'), 'No se abrió el formulario de riesgo manual');
    pulsar('#btnGuardarRiesgoManual');
    exigir(alertas.some(function (t) { return t.indexOf('nombre del riesgo es obligatorio') !== -1; }), 'No avisó del nombre obligatorio');
    cambiar('#rm-nombre', 'Exposición a polvo de sílice');
    cambiar('#rm-tipo', 'Químico');
    cambiar('#rm-consecuencias', 'Enfermedad respiratoria');
    pulsar('#btnGuardarRiesgoManual');
    exigir(alertas.some(function (t) { return t.indexOf('justificación de la inclusión es obligatoria') !== -1; }), 'No avisó de la justificación obligatoria');
    cambiar('#rm-justificacion', 'Riesgo detectado en obra, sin lista de chequeo en el catálogo');
    pulsar('#btnGuardarRiesgoManual');
    exigir(document.getElementById('form-riesgo-manual').classList.contains('oculto'), 'El formulario manual no se cerró');
    exigir(document.getElementById('rm-nombre').value === '', 'El formulario manual no se limpió');
    var filasManual = document.querySelectorAll('#tabla-resumen tbody tr');
    var celdasManual = filasManual[filasManual.length - 1].querySelectorAll('td');
    exigir(celdasManual[0].textContent.indexOf('sílice') !== -1, 'El riesgo manual no aparece en la matriz: ' + celdasManual[0].textContent.trim());
    exigir(celdasManual[7].textContent.trim() === '—', 'El riesgo manual sin lista no debe tener ND: ' + celdasManual[7].textContent.trim());
    o.filasFinales = filasManual.length;

    // Métricas de layout del bloque 2
    o.layout = (function () {
      var q = {};
      q.anchoVentana = window.innerWidth;
      q.anchoPagina = document.documentElement.scrollWidth;
      q.desbordeH = q.anchoPagina > q.anchoVentana + 1;
      q.columnas = document.querySelectorAll('#tabla-resumen thead th').length;
      var tabla = document.getElementById('tabla-resumen');
      q.anchoTabla = tabla ? tabla.scrollWidth : 0;
      q.anchoVisible = tabla ? tabla.clientWidth : 0;
      var cont = tabla ? tabla.parentNode : null;
      q.claseContenedor = cont ? (cont.className || cont.id) : null;
      q.overflowX = cont ? getComputedStyle(cont).overflowX : null;
      var sel = document.querySelector('.sel-riesgo');
      q.anchoSelect = sel ? Math.round(sel.getBoundingClientRect().width) : 0;
      q.opcionesSelect = sel ? sel.options.length : 0;
      q.titulo = document.querySelector('#zona-riesgos .zona-titulo').textContent.replace(/\s+/g, ' ').trim();
      q.breadcrumb = (document.getElementById('riesgo-breadcrumb') || {}).textContent;
      return q;
    })();
    exigir(!o.layout.desbordeH, 'La página desborda horizontalmente: ' + o.layout.anchoPagina + ' > ' + o.layout.anchoVentana);

    // Bloque 4: los controles del ART deben estar disponibles
    o.zonaArtVisible = !document.getElementById('zona-articulo').classList.contains('oculto');
    exigir(o.zonaArtVisible, 'El bloque de ART no está visible');
    ['btnDescargarPDF', 'btnART_A3', 'btnARTPreview', 'btnExportarExcel', 'btnExportarCSV', 'btnExportarJSON'].forEach(function (id) {
      exigir(!!document.getElementById(id), 'Falta el control del ART: ' + id);
    });

    // Matriz unificada: debe listar la evaluación sin errores
    document.querySelector('.tab-btn[data-tab="matriz-unificada"]').click();
    AppUI.refreshMatrizUnificada();
    o.filasUnificadas = document.querySelectorAll('#tabla-unificada tbody tr').length;

    // Cierre del numeral 2: guardar y ver en la matriz unificada
    document.querySelector('.tab-btn[data-tab="evaluacion"]').click();
pulsar('#btnVerMatrizUnificada');
    exigir(document.querySelector('.tab-btn[data-tab="matriz-unificada"]').classList.contains('activo'),
      'No se activó la pestaña Matriz unificada');
    exigir(!document.getElementById('matriz-unificada-contenido').classList.contains('oculto'),
      'La matriz unificada quedó oculta');

    var selUnif = document.getElementById('selProyectoUnificado');
    o.proyectoUnificado = selUnif.value;
    exigir(selUnif.value === 'Test Bloque 2||Estructura', 'No se seleccionó el proyecto del numeral 2: ' + selUnif.value);

    // Clasificación por proceso constructivo
    var grupos = Array.prototype.slice.call(document.querySelectorAll('#tabla-unificada tbody tr.fila-grupo'));
    o.gruposProceso = grupos.length;
    exigir(grupos.length === 1, 'Se esperaban 1 grupo de proceso y hay ' + grupos.length);
    exigir(grupos[0].cells[0].textContent.indexOf('Obras preliminares') !== -1,
      'El grupo no nombra el proceso: ' + grupos[0].cells[0].textContent.replace(/\s+/g, ' ').trim());
    var columnasGrupo = Array.prototype.reduce.call(grupos[0].cells, function (s, c) { return s + (c.colSpan || 1); }, 0);
    exigir(columnasGrupo === 13, 'La fila de grupo cubre ' + columnasGrupo + ' columnas en vez de 13');
    exigir(grupos[0].textContent.indexOf('riesgo') !== -1, 'El grupo no indica el número de riesgos: ' + grupos[0].textContent.replace(/\s+/g, ' ').trim());
    var filasRiesgo = document.querySelectorAll('#tabla-unificada tbody tr:not(.fila-grupo)');
    o.filasUnificadasTrasCierre = filasRiesgo.length;
    exigir(filasRiesgo.length === 2, 'La matriz unificada debe listar 2 riesgos incluidos y lista ' + filasRiesgo.length);

    // Los 5 cuadros con sombra alternada verde y roja
    var cuadros = Array.prototype.slice.call(document.querySelectorAll('#stats-graficos .cuadro-grafico'));
    o.cuadros = cuadros.length;
    exigir(cuadros.length === 5, 'Se esperaban 5 cuadros y hay ' + cuadros.length);
    var sombras = cuadros.map(function (c) { return getComputedStyle(c).boxShadow; });
    o.sombras = sombras;
    exigir(sombras.every(function (s) { return s && s !== 'none'; }), 'Alguno de los 5 cuadros no tiene sombra');
    var verde = sombras.filter(function (s) { return s.indexOf('0, 110, 73') !== -1; }).length;
    var rojo = sombras.filter(function (s) { return s.indexOf('192, 36, 42') !== -1; }).length;
    o.sombrasVerde = verde; o.sombrasRojo = rojo;
    exigir(verde === 3 && rojo === 2, 'La alternancia de sombras no es 3 verde / 2 rojo: ' + verde + '/' + rojo);
    cuadros.forEach(function (c) {
      exigir(!!c.querySelector('figcaption'), 'Un cuadro no tiene título');
      var cv = c.querySelector('canvas');
      exigir(!!cv && cv.width > 0, 'Un cuadro no tiene lienzo con contenido');
    });

    // Presentación de los cuadros: retícula y tamaño visible de los lienzos
    o.estiloCuadros = (function () {
      var cont = document.getElementById('stats-graficos');
      var cs = getComputedStyle(cont);
      var cv = document.querySelector('#stats-graficos canvas');
      var r = cv.getBoundingClientRect();
      var borde = getComputedStyle(document.querySelector('#tabla-unificada tbody tr.fila-grupo td')).borderTopColor;
      return {
        display: cs.display,
        columnas: cs.gridTemplateColumns.split(' ').length,
        lienzoAncho: Math.round(r.width),
        lienzoAlto: Math.round(r.height),
        bordeGrupo: borde
      };
    })();
    exigir(o.estiloCuadros.display === 'grid', 'Los cuadros no usan retícula: ' + o.estiloCuadros.display);
    exigir(o.estiloCuadros.columnas >= 2, 'La retícula de cuadros colapsa a ' + o.estiloCuadros.columnas + ' columna(s)');
    exigir(o.estiloCuadros.lienzoAncho >= 200 && o.estiloCuadros.lienzoAlto >= 100,
      'El lienzo se ve muy pequeño: ' + o.estiloCuadros.lienzoAncho + 'x' + o.estiloCuadros.lienzoAlto);
    exigir(o.estiloCuadros.bordeGrupo === 'rgb(0, 110, 73)',
      'La fila de grupo no usa el verde institucional: ' + o.estiloCuadros.bordeGrupo);

    // Los 5 gráficos deben tener algo pintado (incluidos los dos que antes quedaban vacíos)
    o.graficos = ['chart-riesgos-proceso', 'chart-nr-promedio', 'chart-ni-distribucion',
      'chart-riesgos-criticos', 'chart-matriz-calor'].map(function (id) {
        var cv = document.getElementById(id);
        if (!cv) return id + ':ausente';
        var ctx = cv.getContext('2d');
        var d = ctx.getImageData(0, 0, cv.width, cv.height).data;
        var pintados = 0;
        for (var i = 3; i < d.length; i += 4) if (d[i] > 0) pintados++;
        return { id: id, pintados: pintados };
      });
    o.graficos.forEach(function (g) {
      exigir(typeof g === 'string' ? false : g.pintados > 200,
        'El gráfico ' + (g.id || g) + ' está vacío (' + (g.pintados || 0) + ' píxeles)');
    });

    exigir(window.jspdf && typeof window.jspdf.jsPDF === 'function', 'No se cargó jsPDF local');
    var bibliotecaPDF = window.jspdf;
    var crearPDF = bibliotecaPDF.jsPDF;
    window.__pdfPrueba = [];
    bibliotecaPDF.jsPDF = function (opciones) {
      var doc = new crearPDF(opciones);
      var tabla = doc.autoTable;
      var tablas = [];
      exigir(typeof tabla === 'function', 'No se cargó AutoTable local');
      doc.autoTable = function (opcionesTabla) {
        var campo = opcionesTabla.head && opcionesTabla.head[0][1] === 'Pregunta / Acción sujeta a evaluación';
        if (campo) exigir(opcionesTabla.body.every(function (fila) {
          return fila[2] === '' && fila[3] === '' && fila[4] === '';
        }), 'La lista para campo contiene respuestas');
        var result = tabla.call(doc, opcionesTabla);
        var ancho = doc.lastAutoTable.columns.reduce(function (total, columna) { return total + columna.width; }, 0);
        exigir(ancho + doc.lastAutoTable.settings.margin.left <= doc.internal.pageSize.getWidth() + .2,
          'La tabla PDF sale de la página');
        tablas.push({ filas: opcionesTabla.body.length, campoSinRespuestas: campo ? true : null });
        return result;
      };
      doc.save = function (nombre) {
        window.__pdfPrueba.push({ nombre: nombre, ancho: doc.internal.pageSize.getWidth(),
          alto: doc.internal.pageSize.getHeight(), tablas: tablas,
          base64: doc.output('datauristring').split(',')[1] });
      };
      return doc;
    };
    try {
      ReportesApp.exportarUnificadoPDF();
      ReportesApp.descargarART();
      ReportesApp.descargarART_A3();
      ReportesApp.descargarListaCampo(riesgo);
      ReportesApp.descargarListaCompletada(riesgo);
    } finally { bibliotecaPDF.jsPDF = crearPDF; }
    exigir(window.__pdfPrueba.length === 5, 'No se generaron los cinco PDF con las bibliotecas locales');
    exigir(window.__pdfPrueba.slice(0, 4).every(function (pdf) { return pdf.ancho > pdf.alto; }),
      'La matriz, los ART o la lista de campo no están en horizontal');
    o.pdfLocales = window.__pdfPrueba.map(function (pdf) {
      return { nombre: pdf.nombre, ancho: pdf.ancho, alto: pdf.alto, tablas: pdf.tablas };
    });

    // Se simula la ausencia de bibliotecas para verificar también la alternativa imprimible.
    var abierto = null;
    var impreso = 0;
    var abiertoOriginal = window.open;
    window.open = function () { return { document: { write: function (h) { abierto = h; }, close: function () {} }, focus: function () {}, print: function () { impreso++; } }; };
    try {
      window.jspdf = undefined;
      ReportesApp.exportarUnificadoPDF();
      exigir(!!abierto, 'El PDF sin jsPDF no abrió la vista imprimible');
      o.pdfSinJsPDF = 'vista imprimible';
    } finally { window.open = abiertoOriginal; window.jspdf = bibliotecaPDF; }
    exigir(abierto.indexOf('PROCESO') !== -1 || abierto.indexOf('Proceso constructivo:') !== -1,
      'La vista imprimible no agrupa por proceso');
    exigir(abierto.indexOf('Obras preliminares') !== -1, 'La vista imprimible no nombra el proceso');
    exigir(abierto.indexOf('A4 landscape') !== -1, 'La vista imprimible no define la orientación horizontal');

    abierto = null; impreso = 0;
    window.open = function () { return { document: { write: function (h) { abierto = h; }, close: function () {} }, focus: function () {}, print: function () { impreso++; } }; };
    try { ReportesApp.imprimirUnificado(); } finally { window.open = abiertoOriginal; }
    exigir(abierto.indexOf('Tabla unificada') === -1 && abierto.indexOf('<table>') !== -1, 'La impresión no generó la tabla');
    o.filasImpresion = (abierto.match(/<tr>/g) || []).length;
    exigir(o.filasImpresion === 3, 'La impresión debe traer encabezado + 2 riesgos: ' + o.filasImpresion);

    // La matriz queda vinculada al numeral 2 y el aviso lo refleja
    var notaVinculo = document.getElementById('estadoVinculoMatriz');
    exigir(notaVinculo.classList.contains('vinculo-on'), 'El aviso de vínculo no está en estado vinculado');
    exigir(notaVinculo.textContent.indexOf('Test Bloque 2') !== -1, 'El aviso de vínculo no nombra el proyecto');
    o.vinculo = 'vinculado';

    // Replicación automática: un riesgo agregado en el numeral 2 aparece en la pestaña 2
    document.querySelector('.tab-btn[data-tab="evaluacion"]').click();
    pulsar('#btnAgregarRiesgo');
    var filaNueva = document.querySelectorAll('#tabla-resumen tbody tr');
    var selNueva = filaNueva[filaNueva.length - 1].querySelector('.sel-riesgo');
    selNueva.value = selNueva.options[2].value;
    selNueva.dispatchEvent(new Event('change', { bubbles: true }));
    pulsar('#checklist-cerrar');
    document.querySelector('.tab-btn[data-tab="matriz-unificada"]').click();
    var riesgosUnif = document.querySelectorAll('#tabla-unificada tbody tr:not(.fila-grupo)');
    o.riesgosReplicados = riesgosUnif.length;
    exigir(riesgosUnif.length === 3, 'El riesgo agregado en el numeral 2 no se replicó: ' + riesgosUnif.length + ' riesgos');
    exigir(riesgosUnif[riesgosUnif.length - 1].textContent.indexOf('Abrir') !== -1,
      'La fila replicada no ofrece acción');

    // Inicializar la matriz: la deja en blanco y corta el vínculo, sin borrar evaluaciones
    var guardadasAntes = DBApp.listarEvaluacionesDeProyecto('Test Bloque 2', 'Estructura').length;
    pulsar('#btnInicializarMatriz');
    exigir(AppUI.matrizVinculada() === false, 'Inicializar la matriz no cortó el vínculo');
    exigir(document.getElementById('selProyectoUnificado').value === '', 'Inicializar la matriz no vació el selector');
    exigir(!document.getElementById('matriz-unificada-contenido').classList.contains('oculto') === false,
      'Inicializar la matriz no ocultó el contenido');
    exigir(document.querySelectorAll('#tabla-unificada tbody tr').length === 0 ||
      document.querySelector('#tabla-unificada tbody tr').classList.contains('nota') ||
      document.querySelector('#tabla-unificada tbody').children.length === 0,
      'Inicializar la matriz no vació la tabla');
    exigir(notaVinculo.classList.contains('vinculo-off'), 'El aviso de vínculo no refleja la inicialización');
    exigir(DBApp.listarEvaluacionesDeProyecto('Test Bloque 2', 'Estructura').length === guardadasAntes,
      'Inicializar la matriz borró evaluaciones guardadas');
    o.evaluacionesTrasInicializar = guardadasAntes;

    // Sin vínculo, la pestaña 2 NO debe adoptar sola el proyecto del numeral 2
    document.querySelector('.tab-btn[data-tab="evaluacion"]').click();
    document.querySelector('.tab-btn[data-tab="matriz-unificada"]').click();
    exigir(document.getElementById('selProyectoUnificado').value === '',
      'La matriz se revinculó sola tras inicializar');

    // Vincular de nuevo: recupera el proyecto del numeral 2 y sus datos
    pulsar('#btnVincularMatriz');
    exigir(AppUI.matrizVinculada() === true, 'Vincular la matriz no restauró el vínculo');
    exigir(document.getElementById('selProyectoUnificado').value === 'Test Bloque 2||Estructura',
      'Vincular no seleccionó el proyecto del numeral 2: ' + document.getElementById('selProyectoUnificado').value);
    var riesgosRevinculados = document.querySelectorAll('#tabla-unificada tbody tr:not(.fila-grupo)');
    exigir(riesgosRevinculados.length === 3, 'Revincular no recuperó los riesgos: ' + riesgosRevinculados.length);
    exigir(document.querySelectorAll('#tabla-unificada tbody tr.fila-grupo').length === 1,
      'Revincular no restauró la clasificación por proceso');

    // Reinicio por tipo de proyecto
    document.querySelector('.tab-btn[data-tab="evaluacion"]').click();
    cambiar('#selTipoProyecto', 'Infraestructura');
    exigir(AppUI.matrizVinculada() === false, 'Cambiar el tipo de proyecto no reinició la matriz');
    exigir(document.getElementById('selProyectoUnificado').value === '',
      'Cambiar el tipo de proyecto dejó un proyecto en la matriz');
    exigir(document.getElementById('matriz-unificada-vacio') &&
      !document.getElementById('matriz-unificada-vacio').classList.contains('oculto'),
      'No se mostró el estado vacío de la matriz unificada');
    o.matrizReiniciada = true;
    document.querySelector('.tab-btn[data-tab="matriz-unificada"]').click();

    o.alertas = alertas;
    return o;
  } finally {
    window.alert = alertaOriginal;
    window.confirm = confirmarOriginal;
  }
}

async function main() {
  const puerto = 9500 + Math.floor(Math.random() * 400);
  fs.rmSync(WORK, { recursive: true, force: true });
  fs.mkdirSync(WORK, { recursive: true });
  fs.mkdirSync(SALIDA_DIR, { recursive: true });
  const APP_COPY = path.join(WORK, 'app');
  fs.cpSync(path.dirname(APP), APP_COPY, {
    recursive: true,
    filter: source => source !== path.join(path.dirname(APP), 'pruebas', 'out')
  });
  const url = 'file:///' + path.join(APP_COPY, 'index.html').split(path.sep).join('/');
  const perfil = path.join(WORK, 'perfil');

  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1368,900', '--host-resolver-rules=MAP cdnjs.cloudflare.com 127.0.0.1:1',
    '--remote-debugging-port=' + puerto, '--user-data-dir=' + perfil, 'about:blank'
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
  cdp.on((m) => {
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails;
      errores.push('excepción: ' + (d.exception && d.exception.description ? d.exception.description.split(NL)[0] : d.text));
    }
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
      const txt = m.params.args.map((a) => (a.value !== undefined ? a.value : a.description || a.type)).join(' ');
      errores.push('consola: ' + txt);
    }
  });

  const { targetId } = await cdp.enviar('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.enviar('Target.attachToTarget', { targetId, flatten: true });
  const S = sessionId;

  await cdp.enviar('Runtime.enable', {}, S);
  await cdp.enviar('Page.enable', {}, S);

  const cargado = new Promise((res) => {
    const f = (m) => { if (m.method === 'Page.loadEventFired' && m.sessionId === S) res(); };
    cdp.on(f);
  });
  await cdp.enviar('Page.navigate', { url }, S);
  await Promise.race([cargado, dormir(30000)]);
  await dormir(1200);

  const evaluar = async (expression) => {
    const r = await cdp.enviar('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, S);
    if (r.exceptionDetails) {
      throw new Error('evaluate: ' + (r.exceptionDetails.exception ? r.exceptionDetails.exception.description : r.exceptionDetails.text));
    }
    return r.result.value;
  };

  const informe = {};
  informe.bloque2 = await evaluar('(' + verificarBloque2.toString() + ')()');
  const documentos = await evaluar('window.__pdfPrueba');
  informe.pdfLocales = documentos.map(function (documento, indice) {
    const archivo = path.join(SALIDA_DIR, 'pdf-local-' + (indice + 1) + '.pdf');
    const contenido = Buffer.from(documento.base64, 'base64');
    if (contenido.toString('ascii', 0, 5) !== '%PDF-' || contenido.length < 1000) throw new Error('PDF local no válido');
    fs.writeFileSync(archivo, contenido);
    return { archivo: archivo, nombre: documento.nombre, bytes: contenido.length };
  });

  // Captura del bloque 2 para revisión visual
  await evaluar("(function () { document.querySelector('.tab-btn[data-tab=evaluacion]').click(); document.getElementById('zona-riesgos').scrollIntoView({ block: 'start' }); return true; })()");
  await dormir(600);
  {
    const shot = await cdp.enviar('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }, S);
    fs.writeFileSync(SALIDA + '/bloque2-captura.png', Buffer.from(shot.data, 'base64'));
    informe.captura = SALIDA + '/bloque2-captura.png';
  }
  // Captura de la matriz unificada y sus 5 cuadros
  await evaluar("(function () { document.querySelector('.tab-btn[data-tab=matriz-unificada]').click(); var s = document.getElementById('selProyectoUnificado'); if (s) { AppUI.verMatrizUnificada(); } document.getElementById('stats-graficos').scrollIntoView({ block: 'start' }); return true; })()");
  await dormir(700);
  {
    const shotU = await cdp.enviar('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }, S);
    fs.writeFileSync(SALIDA + '/unificada-captura.png', Buffer.from(shotU.data, 'base64'));
    informe.capturaUnificada = SALIDA + '/unificada-captura.png';
  }
  await evaluar("(function () { document.querySelector('.tab-btn[data-tab=evaluacion]').click(); return true; })()");
  await dormir(300);
  // Vista móvil: el bloque 2 no debe desbordar horizontalmente
  await cdp.enviar('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }, S);
  await dormir(700);
  informe.movil = await evaluar("(function () { var z = document.getElementById('zona-riesgos'); return { anchoVentana: window.innerWidth, anchoPagina: document.documentElement.scrollWidth, desbordeH: document.documentElement.scrollWidth > window.innerWidth + 1, tablaScroll: (function () { var t = document.getElementById('tabla-resumen'); return t ? { scroll: t.scrollWidth, visible: t.clientWidth } : null; })() }; })()");
  {
    const shotM = await cdp.enviar('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }, S);
    fs.writeFileSync(SALIDA + '/bloque2-movil.png', Buffer.from(shotM.data, 'base64'));
  }
  await cdp.enviar('Emulation.clearDeviceMetricsOverride', {}, S);
  await dormir(300);
  // Recarga: la evaluación debe conservarse en localStorage
  await cdp.enviar('Page.navigate', { url }, S);
  await dormir(2200);
  informe.trasRecarga = await evaluar('(' + expresionRecarga.toString() + ')()');
  informe.restauracionUI = await evaluar('(' + verificarRestauracionUI.toString() + ')()');
  informe.conexionMatriz = await evaluar('(' + verificarConexionMatriz.toString() + ')()');
  informe.aislamientoProyectos = await evaluar('(' + verificarAislamientoProyectos.toString() + ')()');
  /* Fila del numeral 1 medida sobre la app recién cargada (sin datos de la prueba) */
  informe.filaIdentificacion = await evaluar(`(function () {
    document.querySelector('.tab-btn[data-tab="evaluacion"]').click();
    function caja(id) { var e = document.getElementById(id); if (!e) return null;
      var b = e.getBoundingClientRect();
      return { top: Math.round(b.top), left: Math.round(b.left), ancho: Math.round(b.width), alto: Math.round(b.height) }; }
    var selT = document.getElementById('selTipoProyecto');
    selT.value = 'Estructura';
    selT.dispatchEvent(new Event('change', { bubbles: true }));
    var lista = document.getElementById('listaProyectosSugeridos');
    AppUI.abrirComboProyecto();
    var abierta = !lista.classList.contains('oculto');
    var opciones = lista.querySelectorAll('.combo-opcion').length;
    AppUI.cerrarComboProyecto();
    var cerrada = lista.classList.contains('oculto');
    var nota = document.getElementById('notaProyectoSugerido');
    return {
      tipo: caja('selTipoProyecto'), proyecto: caja('inpProyecto'), proceso: caja('selProceso'),
      flecha: caja('btnComboProyecto'),
      listaAbre: abierta, listaCierra: cerrada, opcionesVisibles: opciones,
      notaAbajo: Math.round(nota.getBoundingClientRect().top) >
        Math.round(document.getElementById('inpProyecto').getBoundingClientRect().top),
      desbordeH: document.documentElement.scrollWidth > window.innerWidth + 1
    };
  })()`);
  {
    const shotF = await cdp.enviar('Page.captureScreenshot',
      { format: 'png', clip: { x: 0, y: 0, width: 1368, height: 460, scale: 1 } }, S);
    fs.writeFileSync(SALIDA + '/numeral1.png', Buffer.from(shotF.data, 'base64'));
  }
  /* Móvil: la fila pasa a una columna y la lista abierta no debe salirse */
  await cdp.enviar('Emulation.setDeviceMetricsOverride',
    { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }, S);
  await dormir(700);
  informe.filaIdentificacionMovil = await evaluar(`(function () {
    document.querySelector('.tab-btn[data-tab="evaluacion"]').click();
    var selT = document.getElementById('selTipoProyecto');
    selT.value = 'Estructura';
    selT.dispatchEvent(new Event('change', { bubbles: true }));
    AppUI.abrirComboProyecto();
    function caja(id) { var e = document.getElementById(id); var b = e.getBoundingClientRect();
      return { top: Math.round(b.top), left: Math.round(b.left), ancho: Math.round(b.width) }; }
    var combo = caja('comboProyecto'), lista = caja('listaProyectosSugeridos');
    return {
      tipo: caja('selTipoProyecto'), proyecto: caja('inpProyecto'), proceso: caja('selProceso'),
      combo: combo, lista: lista,
      apilados: caja('selTipoProyecto').top < caja('inpProyecto').top &&
        caja('inpProyecto').top < caja('selProceso').top,
      listaDentro: lista.left >= 0 && lista.left + lista.ancho <= window.innerWidth + 1,
      desbordeH: document.documentElement.scrollWidth > window.innerWidth + 1
    };
  })()`);
  {
    const shotM1 = await cdp.enviar('Page.captureScreenshot', { format: 'png' }, S);
    fs.writeFileSync(SALIDA + '/numeral1-movil.png', Buffer.from(shotM1.data, 'base64'));
  }
  await cdp.enviar('Emulation.clearDeviceMetricsOverride', {}, S);
  await dormir(300);
  informe.errores = errores;

  console.log(JSON.stringify(informe, null, 2));

  if (cliente && conexion.readyState === WebSocket.OPEN) {
    try { await Promise.race([cliente.enviar('Browser.close', {}), dormir(3000)]); } catch (e) {}
  }
  if (conexion) conexion.close();
  if (navegador) {
    await new Promise((res) => {
      if (navegador.exitCode !== null || navegador.signalCode !== null) return res();
      navegador.once('exit', res);
      setTimeout(() => { try { navegador.kill(); } catch (e) {} res(); }, 4000);
    });
  }
  fs.rmSync(WORK, { recursive: true, force: true });

  return errores.length ? 1 : 0;
}

main().then((codigo) => process.exit(codigo)).catch((e) => {
  console.error('FALLO: ' + e.message);
  process.exit(1);
});

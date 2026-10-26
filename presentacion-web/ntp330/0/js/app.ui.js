/**
 * app.ui.js
 * Interfaz de usuario. Flujo simplificado con la matriz dentro del numeral 3:
 *
 *   1. Identificación del proyecto (Tipo, Nombre, Proceso)
 *   Evaluaciones múltiples por proyecto (§4)
 *   3. Identificación y evaluación por riesgo del proceso (matriz con incluir/excluir)
 *   4. Determinación de estrategias de control ART
 *   Matriz unificada y análisis estadístico en su propia pestaña
 *
 * Fórmulas: NP = ND × NE, NR = NP × NC = ND × NE × NC
 * Respuestas de checklist: Sí / No / No aplica
 */
(function () {
  'use strict';

  var CATALOGO = (typeof window.APP_CATALOGO !== 'undefined') ? window.APP_CATALOGO : [];
  var REFERENCIA = (typeof window.APP_REFERENCIA !== 'undefined') ? window.APP_REFERENCIA : {};
  var CATEGORIAS_BASE = (typeof window.APP_CATEGORIAS_PROYECTO !== 'undefined') ? window.APP_CATEGORIAS_PROYECTO : [];
  var PROCESOS_BASE = (typeof window.APP_PROCESOS_POR_TIPO !== 'undefined') ? window.APP_PROCESOS_POR_TIPO : {};

  var estado = {
    tipoProyecto: '',
    proyecto: '',
    proceso: '',
    proyectoActivo: null,   // { id, nombre, tipo } — proyecto seleccionado
    ev: null,
    riesgos: [],
    riesgoActivo: '',
    ordenNR: 'desc',
    filtroNI: '',
    filtroTexto: '',
    soloIncompletos: false,
    justifRiesgoId: '',
    justifPendiente: false,  // true si la exclusión está a la espera de confirmar el motivo
    sincambios: false,      // true si hay respuestas/modificaciones sin guardar
    matrizVinculada: true   // la matriz unificada sigue al proyecto del numeral 2
  };

  /* ============================================================
     Acceso a datos: categorías, tipos, procesos, catálogo
     ============================================================ */

  function getCategorias() {
    var ov = DBApp.leerProyectosOverride();
    return (ov.categorias && ov.categorias.length) ? ov.categorias : CATEGORIAS_BASE;
  }

  /** Tipos generales de proyecto: solo las categorías (correcciones2 §2). */
  function getTiposProyecto() {
    var out = [];
    getCategorias().forEach(function (c) {
      if (c.activo === false) return;
      out.push({ nombre: c.nombre, activo: true, prefijo: c.prefijo || '' });
    });
    return out;
  }

  function getProcesos(tipo) {
    var ov = DBApp.leerProyectosOverride();
    if (ov.procesos && ov.procesos[tipo]) return ov.procesos[tipo];
    return PROCESOS_BASE[tipo] || [];
  }

  /** Clave del dataset de referencia: Estructura usa el bloque "Edificación". */
  function claveDataset(tipo) {
    return (tipo === 'Estructura') ? 'Edificación' : tipo;
  }

  function prefijoTipo(tipo) {
    var cats = getCategorias();
    for (var i = 0; i < cats.length; i++) {
      if (cats[i].nombre === tipo) return cats[i].prefijo || '';
    }
    return window.PREFIJO_TIPO ? window.PREFIJO_TIPO(tipo) : '';
  }

  /** Aplica sobreescrituras de administración a una lista de chequeo. */
  function aplicarOverrides(catalogo) {
    var ov = DBApp.leerOverrides();
    var clave = catalogo.sheet;
    if (ov[clave]) {
      var preg = ov[clave].preguntas;
      if (Array.isArray(preg) && preg.length) catalogo.preguntas = preg;
      if (ov[clave].riesgo) catalogo.riesgo = ov[clave].riesgo;
      if (typeof ov[clave].activa !== 'undefined') catalogo.activa = !!ov[clave].activa;
    }
    return catalogo;
  }

  function clonarCatalogo(sheet) {
    for (var i = 0; i < CATALOGO.length; i++) {
      if (CATALOGO[i].sheet === sheet) {
        return aplicarOverrides(JSON.parse(JSON.stringify(CATALOGO[i])));
      }
    }
    return null;
  }

  /** Listas de chequeo relacionadas con un riesgo (despliegue automático §4/§7). */
  function findListas(pre, nombre) {
    var n = String(nombre || '').trim().toLowerCase();
    var conPrefijo = [], sinPrefijo = [];
    for (var i = 0; i < CATALOGO.length; i++) {
      if (String(CATALOGO[i].riesgo).trim().toLowerCase() !== n) continue;
      var c = JSON.parse(JSON.stringify(CATALOGO[i]));
      aplicarOverrides(c);
      if (c.activa === false) continue;
      if (pre && String(c.sheet).indexOf(pre) === 0) conPrefijo.push(c);
      else if (!pre) conPrefijo.push(c);
      else sinPrefijo.push(c);
    }
    return conPrefijo.length ? conPrefijo : sinPrefijo;
  }

  /** Construye los riesgos automáticos de un (tipo, proceso). */
  function construirRiesgos(tipo, proceso) {
    var lista = [];
    var clave = claveDataset(tipo);
    var arr = REFERENCIA[clave] && REFERENCIA[clave][proceso];
    if (!arr) return lista;
    var pre = prefijoTipo(tipo);

    arr.forEach(function (bloque) {
      (bloque.riesgos || []).forEach(function (r) {
        var nombre = r[0];
        var listas = findListas(pre, nombre);
        if (!listas.length) {
          if (typeof console !== 'undefined' && console.warn) console.warn('Riesgo sin lista de chequeo en catálogo:', nombre);
          return;
        }
        var c = listas[0];
        for (var j = 0; j < lista.length; j++) {
          if (lista[j].sheet === c.sheet) return;
        }
        lista.push(nuevoRiesgo({
          nombre: c.riesgo || nombre,
          codigo: c.codigo || '',
          sheet: c.sheet || '',
          catalogo: c,
          origen: 'auto',
          confirmado: true,
          proceso: proceso,
          actividad: bloque.nombre || ''
        }));
      });
    });

    lista.sort(function (a, b) { return MotorNTP330.compararCodigos(a.codigo, b.codigo); });
    return lista;
  }

  /** Crea la estructura interna de un riesgo (auto o manual). */
  function nuevoRiesgo(o) {
    var m = window.METADATA_RIESGO ? window.METADATA_RIESGO(o.nombre) : { tipo: '', fuente: '', consecuencias: '' };
    var c = o.catalogo || { sheet: o.sheet || '', codigo: o.codigo || '', riesgo: o.nombre, preguntas: [], activa: true };
    return {
      id: o.id || (c.sheet || ('manual-' + Date.now().toString(36))),
      nombre: o.nombre,
      codigo: c.codigo || o.codigo || '',
      sheet: c.sheet || '',
      clasificacion: c.clasificacion || '',
      tipo: c.tipo || m.tipo || '',
      peligro: m.tipo || '',
      fuente: o.fuente || m.fuente || '',
      descripcion: o.descripcion || '',
      consecuencias: o.consecuencias || m.consecuencias || '',
      proceso: o.proceso || estado.proceso || '',
      actividad: o.actividad || '',
      catalogo: c,
      origen: o.origen || 'auto',
      confirmado: o.confirmado !== false,
      incluido: true,
      justificacion: o.justificacion || '',
      justificacionExclusion: '',
      respuestas: {},
      ne: null,                       // { valor, justificacion, observaciones }
      nc: null,                       // { valor, justificacion, observaciones }
      controles: [],
      residualNDManual: null,
      residualNEManual: null,
      observaciones: '',
      controlesPropuestos: '',
      evaluadoEn: '',
      trazabilidad: []
    };
  }

  /* ============================================================
     Evaluación: motor y estado
     ============================================================ */

  function resultadoDeR(r, respuestas) {
    return MotorNTP330.evaluarRiesgo({
      preguntas: (r.catalogo && r.catalogo.preguntas) || [],
      respuestas: respuestas || r.respuestas || {},
      ne: (r.ne && r.ne.valor) || undefined,
      nc: (r.nc && r.nc.valor) || undefined,
      neElegido: !!(r.ne && r.ne.valor),
      ncElegido: !!(r.nc && r.nc.valor),
      neJustificado: !!(r.ne && r.ne.valor && String(r.ne.justificacion || '').trim()),
      ncJustificado: !!(r.nc && r.nc.valor && String(r.nc.justificacion || '').trim()),
      activo: r.confirmado,
      aprobado: !!r.aprobado
    });
  }

  function resultadoDe(r) { return resultadoDeR(r, null); }

  /** Recalcula un riesgo ya guardado (nivel de entrada en la matriz unificada).
      Usa la MISMA lista de chequeo efectiva que el numeral 2: `clonarCatalogo()`
      aplica las ediciones de la pestaña Catálogo (texto y NDR), de modo que el ND de
      la matriz unificada coincide siempre con el del bloque 2. Leer `CATALOGO` sin
      aplicar los overrides hacía divergir ambos ND en cuanto se editaba una lista. */
  function resultadoDeGuardado(g) {
    var preguntas = (clonarCatalogo(g.sheet) || {}).preguntas || [];
    var res = MotorNTP330.evaluarRiesgo({
      preguntas: preguntas,
      respuestas: g.respuestas || {},
      ne: (g.ne && g.ne.valor) || undefined,
      nc: (g.nc && g.nc.valor) || undefined,
      neElegido: !!(g.ne && g.ne.valor),
      ncElegido: !!(g.nc && g.nc.valor),
      neJustificado: !!(g.ne && g.ne.valor && String(g.ne.justificacion || '').trim()),
      ncJustificado: !!(g.nc && g.nc.valor && String(g.nc.justificacion || '').trim()),
      activo: true,
      aprobado: false
    });
    /* Sin NE y NC el motor usa 1 como valor por defecto: NP y NR serían inventados.
        `completo` es la bandera que impide mostrarlos o promediarlos. */
    return { res: res, completo: !!(g.ne && g.ne.valor && g.nc && g.nc.valor) };
  }

  function residualDe(r, res) {
    var cats = [];
    (r.controles || []).forEach(function (i) {
      var g = ControlesApp.getControles(r.codigo);
      if (g && g[i]) cats.push(g[i].categoria);
    });
    var ne = (r.residualNEManual != null) ? r.residualNEManual : ((r.ne && r.ne.valor) || 1);
    return ControlesApp.evaluarResidual({
      nrInicial: res.nr,
      ndInicial: res.nd,
      neValor: ne,
      ncValor: (r.nc && r.nc.valor) || 10,
      categoriasAplicadas: cats,
      ndOverride: r.residualNDManual
    });
  }

  /** Interpretación del NI (§18) — datos centralizados en NTP330.NI_PERFIL (correcciones6 §2.6). */
  function interpretacionNI(ni) {
    var perfil = (window.NTP330 && NTP330.NI_PERFIL) || [];
    for (var i = 0; i < perfil.length; i++) {
      if (perfil[i].ni === ni) {
        return {
          prioridad: perfil[i].prioridad || '',
          accion: perfil[i].accion || perfil[i].prioridad || '',
          aceptable: perfil[i].aceptable || '',
          fuente: perfil[i].fuente || '330.pdf · Tabla 9'
        };
      }
    }
    return { prioridad: '', accion: '', aceptable: '', fuente: '330.pdf · Tabla 9' };
  }

  /** Rango de NP según las bandas NTP 330 (≥24 MA, >8 A, >4 M, ≤4 B). */
  function rangoNP(np) {
    np = +np || 0;
    if (np >= 24) return '≥ 24';
    if (np > 8) return '8 < NP < 24';
    if (np > 4) return '4 < NP ≤ 8';
    return '≤ 4';
  }

  /** Interpretación de la categoría de probabilidad. */
  function interpretacionNP(sigla) {
    var mapa = {
      MA: 'Probabilidad muy alta: el riesgo se presenta de forma permanente o casi segura.',
      A:  'Probabilidad alta: es esperable que ocurra con frecuencia.',
      M:  'Probabilidad media: ocurrencia ocasional.',
      B:  'Probabilidad baja: ocurrencia rara o poco probable.'
    };
    return mapa[sigla] || '';
  }

  /* ============================================================
     Persistencia
     ============================================================ */

  function sincronizarEV() {
    if (!estado.ev) return;
    estado.ev.tipoProyecto = estado.tipoProyecto;
    estado.ev.proyecto = estado.proyecto;
    estado.ev.proceso = estado.proceso;
    estado.ev.updatedAt = Date.now();
    estado.ev.riesgos = {};
    estado.riesgos.forEach(function (r) {
      /* Las filas en blanco no se persisten: solo existen como borrador en pantalla */
      if (!r.nombre && !r.codigo && !r.sheet) return;
      estado.ev.riesgos[r.id] = {
        origenIdx: (r.origenIdx != null) ? r.origenIdx : null,
        nombre: r.nombre,
        codigo: r.codigo,
        sheet: r.sheet,
        origen: r.origen,
        confirmado: r.confirmado,
        incluido: r.incluido,
        justificacion: r.justificacion,
        justificacionExclusion: r.justificacionExclusion,
        respuestas: r.respuestas,
        ne: r.ne,
        nc: r.nc,
        controles: r.controles,
        residualNDManual: r.residualNDManual,
        residualNEManual: r.residualNEManual,
        observaciones: r.observaciones,
        controlesPropuestos: r.controlesPropuestos,
        proceso: r.proceso,
        actividad: r.actividad,
        aprobado: !!r.aprobado,
        evaluadoEn: r.evaluadoEn,
        trazabilidad: r.trazabilidad
      };
    });
  }

  function restaurarEstado(ev) {
    DBApp.migrarEvaluacion(ev);
    estado.ev = JSON.parse(JSON.stringify(ev));
    estado.tipoProyecto = ev.tipoProyecto || '';
    estado.proyecto = ev.proyecto || '';
    estado.proceso = ev.proceso || '';
    if (estado.tipoProyecto === 'Edificación') {
      estado.tipoProyecto = 'Estructura';
    }

    /* El bloque 2 no pre-genera los riesgos del proceso: solo se restauran los riesgos
       que el evaluador agregó, en el mismo orden en que los agregó. */
    var guardados = ev.riesgos || {};
    estado.riesgos = [];
    Object.keys(guardados).forEach(function (clave) {
      var g = guardados[clave];
      if (!g) return;
      var c = g.sheet ? clonarCatalogo(g.sheet) : null;
      var r = nuevoRiesgo({
        id: clave,
        nombre: g.nombre,
        codigo: g.codigo,
        sheet: g.sheet,
        catalogo: c || { sheet: g.sheet || '', codigo: g.codigo || '', riesgo: g.nombre || '', preguntas: [], activa: true },
        origen: g.origen || 'manual',
        confirmado: g.confirmado !== false,
        fuente: g.fuente,
        descripcion: g.descripcion,
        consecuencias: g.consecuencias,
        proceso: g.proceso || estado.proceso
      });
      r.origenIdx = (g.origenIdx != null) ? g.origenIdx : null;
      assignRiesgo(r, g);
      estado.riesgos.push(r);
    });
  }

  function assignRiesgo(r, g) {
    r.respuestas = g.respuestas || {};
    r.ne = g.ne || null;
    r.nc = g.nc || null;
    r.controles = g.controles || [];
    r.residualNDManual = (g.residualNDManual != null) ? g.residualNDManual : null;
    r.residualNEManual = (g.residualNEManual != null) ? g.residualNEManual : null;
    r.aprobado = !!g.aprobado;
    r.incluido = (g.incluido !== undefined) ? g.incluido : true;
    r.justificacion = g.justificacion || '';
    r.justificacionExclusion = g.justificacionExclusion || '';
    r.observaciones = g.observaciones || '';
    r.controlesPropuestos = g.controlesPropuestos || '';
    r.evaluadoEn = g.evaluadoEn || '';
    r.trazabilidad = g.trazabilidad || [];
    if (g.proceso) r.proceso = g.proceso;
    if (g.actividad) r.actividad = g.actividad;
  }

  function guardarEvaluacion() {
    sincronizarEV();
    DBApp.guardarEvaluacion(estado.ev);
    poblarTablaEvaluaciones();
    poblarSugerenciasProyecto();
    actualizarBotones();
  }

  function registrarTraza(r, campo, detalle) {
    if (!r.trazabilidad) r.trazabilidad = [];
    r.trazabilidad.push({
      cuando: new Date().toISOString(),
      usuario: 'evaluador',
      campo: campo,
      detalle: detalle
    });
  }

  /* ============================================================
     Zona 1 · Identificación del proyecto
     ============================================================ */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function escAttr(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function chipEstado(est) {
    return '<span class="badge estado-' + esc(est.sigla) + '">' + esc(est.texto) + '</span>';
  }

  function chipNI(ni) {
    return '<span class="chip-ni ni-' + esc(ni.ni) + '">' + esc(ni.ni) + '</span>';
  }

  function poblarTipos() {
    var sel = document.getElementById('selTipoProyecto');
    if (!sel) return;
    var html = '<option value="">-- Seleccione tipo de proyecto --</option>';
    getTiposProyecto().forEach(function (t) {
      html += '<option value="' + escAttr(t.nombre) + '"' + (t.nombre === estado.tipoProyecto ? ' selected' : '') + '>' +
        esc(t.nombre) + '</option>';
    });
    sel.innerHTML = html;
  }

  function poblarProcesos() {
    var procs = getProcesos(estado.tipoProyecto);
    var sel = document.getElementById('selProceso');
    if (sel) {
      var html = '<option value="">' + (procs.length ? '-- Seleccione proceso --' : '-- Sin procesos definidos --') + '</option>';
      procs.forEach(function (p) {
        html += '<option value="' + escAttr(p) + '"' + (p === estado.proceso ? ' selected' : '') + '>' + esc(p) + '</option>';
      });
      sel.innerHTML = html;
    }
    var nota = document.getElementById('zona2-nota');
    if (nota) nota.textContent = procs.length ? '' : 'No hay procesos definidos para este tipo de proyecto. Consúltelos en la pestaña Catálogo (administración).';
  }

  function leerZona1() {
    estado.tipoProyecto = document.getElementById('selTipoProyecto').value;
    estado.proyecto = document.getElementById('inpProyecto').value;
    estado.proceso = document.getElementById('selProceso').value;
  }

  /* ============================================================
     Identidad del proyecto: nombre + tipo de proyecto
     ============================================================ */

  /** Clave de un proyecto. Nombre y tipo van juntos: una evaluación de Estructura
      nunca se confunde con una de Infraestructura aunque se llamen igual. */
  function identidadProyecto(nombre, tipo) {
    return String(nombre || '').trim() + '||' + String(tipo || '').trim();
  }

  /** Proyecto registrado con ese nombre, sea del tipo que sea. */
  function buscarProyectoPorNombre(nombre) {
    var n = String(nombre || '').trim().toLowerCase();
    if (!n) return null;
    var proys = DBApp.listarProyectos();
    for (var i = 0; i < proys.length; i++) {
      if (String(proys[i].nombre || '').trim().toLowerCase() === n) return proys[i];
    }
    var evs = DBApp.listarEvaluaciones();
    for (var j = 0; j < evs.length; j++) {
      if (String(evs[j].proyecto || '').trim().toLowerCase() === n && evs[j].tipoProyecto) {
        return { nombre: evs[j].proyecto, tipo: evs[j].tipoProyecto, sinRegistro: true };
      }
    }
    return null;
  }

  /** Desplegable con los proyectos anteriores del tipo elegido. Solo se ofrecen los
  /** Desplegable con los proyectos anteriores del tipo elegido. Solo se ofrecen los
      del tipo seleccionado: proponer uno de otro tipo sería justo el cruce de datos
      que se quiere evitar. Un nombre que no está en la lista es un proyecto nuevo y
      arranca desde cero; se ofrece como primera opción para dejarlo explícito. */
  function poblarSugerenciasProyecto() {
    var lista = document.getElementById('listaProyectosSugeridos');
    var nota = document.getElementById('notaProyectoSugerido');
    var inp = document.getElementById('inpProyecto');
    var tipo = document.getElementById('selTipoProyecto').value;
    if (!lista) return;
    var vistos = {};
    var items = [];
    DBApp.listarEvaluaciones().forEach(function (ev) {
      if (!ev.proyecto || !ev.tipoProyecto) return;
      if (tipo && ev.tipoProyecto !== tipo) return;
      var clave = identidadProyecto(ev.proyecto, ev.tipoProyecto);
      if (vistos[clave]) return;
      vistos[clave] = true;
      var n = DBApp.listarEvaluacionesDeProyecto(ev.proyecto, ev.tipoProyecto).length;
      items.push({
        titulo: ev.proyecto,
        detalle: ev.tipoProyecto + ' · ' + n + (n === 1 ? ' evaluación' : ' evaluaciones') +
          ' · retoma la información ingresada'
      });
    });
    DBApp.listarProyectos().forEach(function (p) {
      if (!p.nombre || !p.tipo) return;
      if (tipo && p.tipo !== tipo) return;
      var clave = identidadProyecto(p.nombre, p.tipo);
      if (vistos[clave]) return;
      vistos[clave] = true;
      items.push({
        titulo: p.nombre,
        detalle: p.tipo + ' · sin evaluaciones · parte de cero'
      });
    });
    items.sort(function (a, b) { return a.titulo.localeCompare(b.titulo, 'es'); });

    var escrito = inp ? inp.value.trim() : '';
    var html = '';
    /* El nombre escrito solo se ofrece como proyecto nuevo si no está en uso. Si ya
       existe con otro tipo, ofrecerlo «como nuevo» sería una contradicción: el cambio
       se rechazaría después con el aviso de choque. */
    var escritoEnUso = !!buscarProyectoPorNombre(escrito);
    if (escrito && !escritoEnUso &&
        !items.some(function (i) { return i.titulo === escrito; })) {
      html += '<li class="combo-opcion combo-opcion--nuevo" role="option" data-valor="' + escAttr(escrito) + '">' +
        '<span class="combo-titulo">' + esc(escrito) + '</span>' +
        '<span class="combo-detalle">Nombre nuevo' + (tipo ? ' de tipo ' + esc(tipo) : '') +
        ' · la evaluación empieza desde cero</span></li>';
    }
    items.forEach(function (i) {
      html += '<li class="combo-opcion" role="option" data-valor="' + escAttr(i.titulo) + '">' +
        '<span class="combo-titulo">' + esc(i.titulo) + '</span>' +
        '<span class="combo-detalle">' + esc(i.detalle) + '</span></li>';
    });
    lista.innerHTML = html;
    if (nota) {
      nota.textContent = items.length
        ? 'Escriba un nombre nuevo para empezar de cero, o abra la lista para retomar un proyecto anterior.'
        : 'Nombre nuevo: el proyecto se evaluará desde cero.';
      if (escritoEnUso) {
        nota.textContent = '«' + escrito + '» ya está en uso. Para no mezclar ' +
          (tipo || 'tipos') + ' con otro tipo de proyecto, escriba otro nombre.';
      }
    }
  }

  function comboAbierto() {
    var combo = document.getElementById('comboProyecto');
    return !!(combo && combo.classList.contains('abierto'));
  }

  function cerrarComboProyecto() {
    var combo = document.getElementById('comboProyecto');
    var lista = document.getElementById('listaProyectosSugeridos');
    var boton = document.getElementById('btnComboProyecto');
    var inp = document.getElementById('inpProyecto');
    if (combo) combo.classList.remove('abierto');
    if (lista) lista.classList.add('oculto');
    if (boton) boton.setAttribute('aria-expanded', 'false');
    if (inp) inp.setAttribute('aria-expanded', 'false');
  }

  function abrirComboProyecto() {
    var combo = document.getElementById('comboProyecto');
    var lista = document.getElementById('listaProyectosSugeridos');
    var boton = document.getElementById('btnComboProyecto');
    var inp = document.getElementById('inpProyecto');
    if (!combo || !lista) return;
    poblarSugerenciasProyecto();
    combo.classList.add('abierto');
    lista.classList.remove('oculto');
    if (boton) boton.setAttribute('aria-expanded', 'true');
    if (inp) inp.setAttribute('aria-expanded', 'true');
  }

  function alternarComboProyecto() {
    if (comboAbierto()) cerrarComboProyecto();
    else abrirComboProyecto();
  }

  /** Elige un proyecto de la lista. Si el nombre no cambia no dispara nada: de otro
      modo se reinicializaría el proyecto que ya está en curso. */
  function elegirProyectoDeLista(valor) {
    var inp = document.getElementById('inpProyecto');
    cerrarComboProyecto();
    if (!inp) return;
    var anterior = inp.value.trim();
    inp.value = valor;
    if (inp.value.trim() !== anterior) {
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  /** ¿Hay algo real (no filas en blanco) en la evaluación en curso? */
  function hayTrabajoEnCurso() {
    if (!estado.ev || !estado.riesgos.length) return false;
    return estado.riesgos.some(function (r) {
      return !!(r.nombre || r.codigo || r.sheet || (r.respuestas && Object.keys(r.respuestas).length));
    });
  }

  /** Antes de cambiar de proyecto se ofrece guardar el trabajo en curso **en el
      proyecto al que pertenece**. Nunca se arrastra a otro: eso era lo que hacía
      `sincronizarEV()` al cambiar solo el nombre. */
  function confirmarCambioIdentidad(nombreAnt, tipoAnt, nombreNuevo, tipoNuevo) {
    if (!hayTrabajoEnCurso()) return true;
    var mensaje = 'El trabajo en curso pertenece a «' + nombreAnt + '» (' + tipoAnt + ').\n\n' +
      '¿Guardarlo en ese proyecto antes de continuar con «' + nombreNuevo + '» (' + tipoNuevo + ')?\n\n' +
      'Si cancela, el nombre vuelve a «' + nombreAnt + '» y el trabajo en curso se conserva sin guardar.';
    if (!window.confirm(mensaje)) return false;
    estado.proyecto = nombreAnt;
    estado.tipoProyecto = tipoAnt;
    guardarEvaluacion();
    return true;
  }

  /** Deja el numeral 2 y la matriz unificada en cero para un proyecto distinto. */
  function inicializarParaProyecto(nombre, tipo) {
    estado.tipoProyecto = tipo || '';
    estado.proyecto = nombre || '';
    estado.proceso = '';
    estado.ev = null;
    estado.riesgos = [];
    estado.riesgoActivo = '';
    var selP = document.getElementById('selProceso');
    if (selP) selP.value = '';
    poblarProcesos();
    if (selP) selP.value = '';
    ocultarZonasEvaluacion();
    limpiarCambiosSinGuardar();
    poblarTablaEvaluaciones();
    renderZonaRiesgos();
    actualizarBotones();
    actualizarEstadoGeneral();
    apuntarMatrizAProyecto(nombre, tipo);
  }

  function onCampoIdentificacion() {
    var nombreAnt = estado.proyecto;
    var tipoAnt = estado.tipoProyecto;
    var inp = document.getElementById('inpProyecto');
    var nombreNuevo = (inp ? inp.value : '').trim();
    var tipoNuevo = document.getElementById('selTipoProyecto').value;

    if (identidadProyecto(nombreNuevo, tipoNuevo) === identidadProyecto(nombreAnt, tipoAnt)) return;

    /* Un nombre ya usado con otro tipo de proyecto no se admite: se avisaría para no
       mezclar estructuras con infraestructuras bajo el mismo nombre. */
    var choque = buscarProyectoPorNombre(nombreNuevo);
    if (nombreNuevo && choque && choque.tipo && choque.tipo !== tipoNuevo) {
      window.alert('«' + nombreNuevo + '» ya existe como proyecto de tipo ' + choque.tipo +
        '.\n\nSeleccione ese tipo de proyecto o escriba otro nombre: un proyecto nuevo debe ' +
        'empezar desde cero.');
      if (inp) inp.value = nombreAnt;
      poblarSugerenciasProyecto();
      cerrarComboProyecto();
      return;
    }

    if (!confirmarCambioIdentidad(nombreAnt, tipoAnt, nombreNuevo, tipoNuevo)) {
      if (inp) inp.value = nombreAnt;
      poblarSugerenciasProyecto();
      cerrarComboProyecto();
      return;
    }

    estado.proyectoActivo = choque || null;
    inicializarParaProyecto(nombreNuevo, tipoNuevo);
  }

  function nuevaEvaluacionDesdeZona1() {
    estado.ev = DBApp.nuevaEvaluacion({
      tipoProyecto: estado.tipoProyecto,
      proyecto: estado.proyecto,
      proceso: estado.proceso
    });
  }

  /* ============================================================
     §2 Creación de proyecto nuevo
     ============================================================ */

  function abrirModalProyecto() {
    var overlay = document.getElementById('modal-proyecto-overlay');
    if (overlay) overlay.classList.remove('oculto');
    var inp = document.getElementById('inpNuevoProyectoNombre');
    if (inp) { inp.value = ''; inp.focus(); }
    var sel = document.getElementById('selNuevoProyectoTipo');
    if (sel) sel.value = '';
  }

  function cerrarModalProyecto() {
    var overlay = document.getElementById('modal-proyecto-overlay');
    if (overlay) overlay.classList.add('oculto');
  }

  function guardarNuevoProyecto() {
    var nombre = document.getElementById('inpNuevoProyectoNombre');
    var tipo = document.getElementById('selNuevoProyectoTipo');
    var nombreVal = nombre ? nombre.value.trim() : '';
    var tipoVal = tipo ? tipo.value : '';
    if (!nombreVal) { alert('El nombre del proyecto es obligatorio.'); if (nombre) nombre.focus(); return; }
    if (!tipoVal) { alert('Seleccione un tipo de proyecto (Estructura o Infraestructura).'); if (tipo) tipo.focus(); return; }

    /* Un proyecto nuevo no hereda nada: si había trabajo en curso se ofrece guardarlo
       en el proyecto al que pertenece antes de inicializar el nuevo. */
    var nombreAnt = estado.proyecto, tipoAnt = estado.tipoProyecto;
    if (identidadProyecto(nombreVal, tipoVal) !== identidadProyecto(nombreAnt, tipoAnt)) {
      if (!confirmarCambioIdentidad(nombreAnt, tipoAnt, nombreVal, tipoVal)) return;
    }

    var resultado = DBApp.crearProyecto(nombreVal, tipoVal);
    if (resultado.error) { alert(resultado.error); return; }
    cerrarModalProyecto();
    estado.proyectoActivo = resultado;
    var selT = document.getElementById('selTipoProyecto');
    if (selT) selT.value = tipoVal;
    var inpP = document.getElementById('inpProyecto');
    if (inpP) inpP.value = nombreVal;
    inicializarParaProyecto(nombreVal, tipoVal);
    poblarSugerenciasProyecto();
    alert('Proyecto "' + nombreVal + '" creado (' + resultado.id + '). Empieza desde cero.');
  }

  /* ============================================================
     §4.6 Indicador de cambios sin guardar
     ============================================================ */

  function marcarCambiosSinGuardar() {
    estado.sincambios = true;
    var badge = document.getElementById('estado-cambios');
    if (badge) {
      badge.textContent = 'Cambios sin guardar';
      badge.className = 'badge badge-sincambios';
      badge.style.display = '';
    }
  }

  function limpiarCambiosSinGuardar() {
    estado.sincambios = false;
    var badge = document.getElementById('estado-cambios');
    if (badge) {
      badge.textContent = 'Resultado registrado';
      badge.className = 'badge badge-registrado';
      // Ocultar después de 3 segundos
      setTimeout(function () { if (badge) badge.style.display = 'none'; }, 3000);
    }
  }

  function advertirSalidaSinGuardar(e) {
    if (!estado.sincambios) return;
    var msg = 'Existen cambios sin guardar. ¿Desea guardarlos antes de salir?';
    e.returnValue = msg;
    return msg;
  }

  /* ============================================================
     §4.4 Tabla de evaluaciones del proyecto
     ============================================================ */

  function poblarTablaEvaluaciones() {
    poblarARTs();

    var cont = document.getElementById('zona-evals-proyecto');
    var tbody = document.querySelector('#tabla-evals-proyecto tbody');
    if (!cont || !tbody) return;

    var nombreProyecto = estado.proyecto;
    var tipoProyecto = estado.tipoProyecto;
    if (!nombreProyecto || !tipoProyecto) {
      cont.classList.add('oculto');
      return;
    }

    var evals = DBApp.listarEvaluacionesDeProyecto(nombreProyecto, tipoProyecto);
    if (!evals.length) {
      cont.classList.add('oculto');
      return;
    }

    cont.classList.remove('oculto');
    var html = '';
    evals.forEach(function (ev) {
      var riesgos = ev.riesgos || {};
      var ids = Object.keys(riesgos);
      var incluidos = 0;
      ids.forEach(function (id) {
        if (riesgos[id].incluido !== false) incluidos++;
      });
      var estadoEval = ev.aprobado ? 'Aprobada' : (ids.length ? 'En proceso' : 'Sin evaluar');
      var esActiva = estado.ev && estado.ev.id === ev.id;
      html += '<tr' + (esActiva ? ' class="fila-activa"' : '') + '>';
      html += '<td><b>' + esc(ev.id) + '</b></td>';
      html += '<td>' + esc(nombreProyecto) + '</td>';
      html += '<td>' + esc(tipoProyecto) + '</td>';
      html += '<td>' + esc(ev.proceso || '—') + '</td>';
      html += '<td>' + incluidos + ' / ' + ids.length + '</td>';
      html += '<td>' + esc(estadoEval) + '</td>';
      html += '<td>' + esc(ev.fecha || '—') + '</td>';
      html += '<td><button type="button" class="btn btn-secundario btn-sm btn-abrir-eval" data-id="' + escAttr(ev.id) + '">Abrir</button></td>';
      html += '</tr>';
    });
    tbody.innerHTML = html;
  }

  function abrirEvaluacion(id) {
    var evals = DBApp.listarEvaluaciones();
    var ev = null;
    for (var i = 0; i < evals.length; i++) {
      if (evals[i].id === id) { ev = evals[i]; break; }
    }
    if (!ev) return;
    restaurarEstado(ev);
    document.getElementById('selTipoProyecto').value = estado.tipoProyecto;
    document.getElementById('inpProyecto').value = estado.proyecto;
    poblarProcesos();
    document.getElementById('selProceso').value = estado.proceso;
    if (!estado.riesgos.length) agregarRiesgoFila();
    estado.riesgoActivo = '';
    poblarTablaEvaluaciones();
    renderZonaRiesgos();
    actualizarBotones();
  }

  function estadoGeneral() {
    if (!estado.tipoProyecto || !estado.proceso) {
      return { texto: 'Pendiente', sigla: 'PEN' };
    }
    var conf = estado.riesgos.filter(function (r) { return r.confirmado && r.incluido; });
    if (!conf.length) return { texto: 'Pendiente', sigla: 'PEN' };
    var todosAprob = true, todosComp = true, algunAvance = false;
    conf.forEach(function (r) {
      var res = resultadoDe(r);
      if (!r.aprobado) todosAprob = false;
      if (res.estado.texto !== 'Evaluación completa' && res.estado.texto !== 'Evaluación aprobada') todosComp = false;
      if (res.detalle.marcados > 0 || (r.ne && r.ne.valor) || (r.nc && r.nc.valor)) algunAvance = true;
    });
    if (todosAprob) return { texto: 'Evaluación aprobada', sigla: 'APROB' };
    if (todosComp) return { texto: 'Evaluación completa', sigla: 'COMP' };
    if (algunAvance) return { texto: 'En proceso', sigla: 'PROC' };
    return { texto: 'Lista incompleta', sigla: 'LI' };
  }

  function actualizarEstadoGeneral() {
    var cont = document.getElementById('estado-general');
    if (!cont) return;
    var eg = estadoGeneral();
    var nConf = estado.riesgos.filter(function (r) { return r.confirmado && r.incluido; }).length;
    var nTotal = estado.riesgos.length;
    cont.innerHTML = '<span class="badge estado-' + esc(eg.sigla) + '">' + esc(eg.texto) + '</span>' +
      '<span class="cat-meta">' + nConf + ' riesgo(s) incluido(s) de ' + nTotal + ' · ' +
      esc(estado.tipoProyecto || '—') + ' · ' + esc(estado.proceso || '—') + '</span>';
  }

  function actualizarBotones() {
    var btnE = document.getElementById('btnEliminarEvaluacion');
    if (btnE) btnE.disabled = !(estado.ev && estado.ev.id);
  }

  /* ============================================================
     3. Evaluación por riesgo del proceso (zona-riesgos)
     ============================================================ */

  function buscarRiesgo(id) {
    for (var i = 0; i < estado.riesgos.length; i++) {
      if (estado.riesgos[i].id === id) return estado.riesgos[i];
    }
    return null;
  }

  function renderZonaRiesgos() {
    var zona = document.getElementById('zona-riesgos');
    if (zona) zona.classList.remove('oculto');
    var zonaArt = document.getElementById('zona-articulo');
    if (zonaArt) zonaArt.classList.remove('oculto');
    renderBreadcrumb();
    if (!estado.riesgoActivo && estado.riesgos.length) {
      estado.riesgoActivo = estado.riesgos[0].id;
    }
    renderTabPanel(buscarRiesgo(estado.riesgoActivo));
    actualizarEstadoGeneral();
    actualizarBotones();
  }

  function renderBreadcrumb() {
    var cont = document.getElementById('riesgo-breadcrumb');
    if (!cont) return;
    cont.innerHTML = 'Tipo de proyecto: <b>' + esc(estado.tipoProyecto) + '</b> → Proceso constructivo: <b>' +
      esc(estado.proceso) + '</b> → Seleccione un riesgo en la matriz de este bloque para identificarlo y evaluarlo.';
  }

  function renderTabPanel(r) {
    var panel = document.getElementById('riesgo-tab-panel');
    if (!panel) return;
    if (!r) {
      panel.innerHTML = '<p class="nota">No hay riesgos para este proceso. Puede agregar riesgos manualmente con el botón "+ Agregar riesgo".</p>';
      return;
    }

    if (r.incluido === false) {
      panel.innerHTML = '<div class="riesgo-seccion"><h4 class="seccion-num">Matriz de evaluación de riesgos NTP 330</h4>' + matrizHtml() + '</div>' +
        '<div class="riesgo-id"><p class="nota"><b>Este riesgo está excluido.</b></p>' +
        '<p>Justificación: ' + esc(r.justificacionExclusion || 'No especificada.') + '</p>' +
        '<button type="button" class="btn btn-primario btn-reincluir" data-id="' + escAttr(r.id) + '">Re-incluir riesgo</button></div>';
      bindResumenDinamico();
      actualizarResumen();
      return;
    }

    var res = resultadoDe(r);
    var html = '';

    // Matriz de evaluación de riesgos NTP 330 (§5): una fila por riesgo evaluado
    html += '<div class="riesgo-seccion"><h4 class="seccion-num">Matriz de evaluación de riesgos NTP 330</h4>' + matrizHtml() + '</div>';

    // Identificación del riesgo (§6)
    html += '<div class="riesgo-id"><h4 class="seccion-num">Identificación del riesgo</h4>';
    html += '<table class="tabla-riesgos"><tbody>';
    html += '<tr><th>Riesgo</th><td><b>' + esc(r.nombre) + '</b></td><th>Código</th><td>' + esc(r.codigo || '—') + '</td></tr>';
    html += '<tr><th>Tipo de peligro</th><td>' + esc(r.tipo || '—') + '</td><th>Proceso constructivo</th><td>' + esc(r.proceso || estado.proceso || '—') + '</td></tr>';
    html += '<tr><th>Lista de chequeo</th><td>' + esc(r.sheet || 'Sin lista') + '</td><th>Estado</th><td>' + chipEstado(res.estado) + '</td></tr>';
    html += '<tr><th>Descripción</th><td colspan="3">' + esc(r.descripcion || 'No documentada.') + '</td></tr>';
    html += '<tr><th>Posibles consecuencias</th><td colspan="3">' + esc(r.consecuencias || 'No documentadas.') + '</td></tr>';
    html += '<tr><th>Resultado</th><td colspan="3">ND=' + NTP330.fmt(res.nd) +
      ' · NE=' + (r.ne ? r.ne.valor : '—') + ' · NP=' + NTP330.fmt(res.np) +
      ' · NC=' + (r.nc ? r.nc.valor : '—') + ' · NR=' + NTP330.fmt(res.nr) +
      ' · NI=' + res.ni.ni + '</td></tr>';
    html += '</tbody></table></div>';

    // Acciones de evaluación: el cuestionario, el NE y el NC se resuelven en ventanas independientes
    html += '<div class="riesgo-seccion"><h4 class="seccion-num">Evaluación del riesgo</h4>';
    html += '<div class="campo-acciones">';
    html += '<button type="button" class="btn btn-primario btn-checklist" data-id="' + escAttr(r.id) + '">Aplicar cuestionario de chequeo (ND)</button>';
    html += '<button type="button" class="btn btn-primario btn-ne" data-id="' + escAttr(r.id) + '">Nivel de exposición NE' + (r.ne && r.ne.valor ? ' (' + r.ne.valor + ')' : '') + '</button>';
    html += '<button type="button" class="btn btn-primario btn-nc" data-id="' + escAttr(r.id) + '">Nivel de consecuencia NC' + (r.nc && r.nc.valor ? ' (' + r.nc.valor + ')' : '') + '</button>';
    html += '</div>';
    html += '<div class="campo-acciones" style="margin-top:8px">';
    html += '<button type="button" class="btn btn-secundario btn-pdf-campo" data-id="' + escAttr(r.id) + '">Descargar lista de chequeo para campo</button>';
    html += '<button type="button" class="btn btn-secundario btn-pdf-lista" data-id="' + escAttr(r.id) + '">Descargar lista de chequeo completada</button>';
    html += '<button type="button" class="btn btn-secundario btn-traza" data-id="' + escAttr(r.id) + '">Ver trazabilidad</button>';
    html += '</div></div>';

    // Observaciones y controles
    html += '<div class="riesgo-seccion"><h4>Observaciones y controles</h4>';
    html += '<div class="campo"><label>Observaciones del evaluador:</label><textarea class="obs-riesgo" data-id="' + escAttr(r.id) + '" rows="2" placeholder="Observaciones del evaluador">' + esc(r.observaciones || '') + '</textarea></div>';
    html += '<div class="campo"><label>Controles propuestos / medidas adicionales:</label>';
    html += '<textarea class="ctrl-riesgo" data-id="' + escAttr(r.id) + '" rows="2" placeholder="Medidas de control propuestas">' + esc(r.controlesPropuestos || '') + '</textarea></div>';
    html += '</div>';

    // Guardado del resultado
    html += '<div class="riesgo-seccion"><h4>Resultado guardado</h4>';
    html += '<span id="estado-cambios" class="badge" style="display:none"></span>';
    html += '<div id="guardado-info-' + escAttr(r.id) + '">' + renderGuardadoHtml(r, res) + '</div>';
    html += '<div class="campo-acciones">';
    html += '<button type="button" class="btn btn-primario btn-guardar" data-id="' + escAttr(r.id) + '">Guardar resultado</button>';
    html += '<button type="button" class="btn btn-secundario btn-volver-matriz" data-id="' + escAttr(r.id) + '">Guardar y volver a la matriz</button>';
    html += '</div></div>';

    panel.innerHTML = html;
    bindResumenDinamico();
    actualizarResumen();
  }

  /** Descripción completa de referencias legales (panel al hacer clic). */
  function renderLegalDetalle(legal) {
    var refs = (legal && legal.refs) || [];
    var h = '';
    for (var i = 0; i < refs.length; i++) {
      h += '<div class="q-legal-item"><span class="q-legal-ref">' + esc(refs[i].ref) + '</span><div class="q-legal-texto-detalle">' + esc(refs[i].detalle || '') + '</div></div>';
    }
    return h;
  }

  function renderNDInfoHtml(r, res) {
    var d = res.detalle;
    var html = '<table class="tabla-ndinfo">';
    html += '<tr><th>Total de preguntas</th><td>' + d.total + '</td></tr>';
    html += '<tr><th>Respuestas "Sí"</th><td>' + d.si + '</td></tr>';
    html += '<tr><th>Respuestas "No"</th><td>' + d.no + '</td></tr>';
    html += '<tr><th>Respuestas "No aplica"</th><td>' + d.na + '</td></tr>';
    html += '<tr><th>Preguntas sin responder</th><td>' + d.sinResponder + '</td></tr>';
    html += '<tr><th>Preguntas aplicables</th><td>' + d.aplicables + '</td></tr>';
    html += '<tr><th>Puntaje obtenido (ΣNDP "No")</th><td>' + NTP330.fmt(d.puntajeObtenido) + '</td></tr>';
    html += '<tr><th>Puntaje máximo aplicable</th><td>' + NTP330.fmt(d.puntajeMaximoAplicable) + '</td></tr>';
    html += '<tr><th>% cumplimiento</th><td>' + d.pctCumplimiento + ' %</td></tr>';
    html += '<tr><th>% incumplimiento</th><td>' + d.pctIncumplimiento + ' %</td></tr>';
    html += '<tr><th>Nivel de deficiencia (ND)</th><td><b>' + NTP330.fmt(res.nd) + '</b> (' + esc(res.ndCls.nivel) + ')</td></tr>';
    html += '<tr><th>Fórmula</th><td>' + esc(d.formula) + '</td></tr>';
    html += '</table>';
    if (d.sinResponder > 0) {
      html += '<p class="nota">Complete todas las preguntas para calcular el ND definitivo (' + d.sinResponder + ' pendiente' + (d.sinResponder === 1 ? '' : 's') + ').</p>';
    }
    return html;
  }

  function renderNPInfoHtml(r, res) {
    if (!(r.ne && r.ne.valor)) {
      return '<p class="nota">Seleccione el nivel de exposición para calcular el nivel de probabilidad (NP = ND × NE).</p>';
    }
    return '<table class="tabla-niveles"><tbody>' +
      '<tr><th>ND utilizado</th><td>' + NTP330.fmt(res.nd) + ' (' + esc(res.ndCls.nivel) + ')</td></tr>' +
      '<tr><th>NE utilizado</th><td>' + esc(res.ne.nivel) + ' (' + res.ne.valor + ') · ' + esc(res.ne.desc) + '</td></tr>' +
      '<tr><th>Operación</th><td>NP = ND × NE = ' + NTP330.fmt(res.nd) + ' × ' + res.ne.valor + ' = <b>' + NTP330.fmt(res.np) + '</b></td></tr>' +
      '<tr><th>Rango</th><td>' + rangoNP(res.np) + '</td></tr>' +
      '<tr><th>Categoría de probabilidad</th><td>' + esc(res.npCls.nivel) + ' (' + esc(res.npCls.sigla) + ')</td></tr>' +
      '<tr><th>Interpretación</th><td>' + esc(interpretacionNP(res.npCls.sigla)) + '</td></tr>' +
      '</tbody></table>';
  }

  function renderNRInfoHtml(r, res) {
    if (!(r.nc && r.nc.valor)) {
      return '<p class="nota">Seleccione el nivel de consecuencia para calcular el nivel de riesgo (NR = NP × NC = ND × NE × NC).</p>';
    }
    var interp = interpretacionNI(res.ni.ni);
    return '<table class="tabla-niveles"><tbody>' +
      '<tr><th>ND</th><td>' + NTP330.fmt(res.nd) + '</td></tr>' +
      '<tr><th>NE</th><td>' + res.ne.valor + '</td></tr>' +
      '<tr><th>NP = ND × NE</th><td>' + NTP330.fmt(res.np) + '</td></tr>' +
      '<tr><th>NC</th><td>' + res.nc.valor + ' (' + esc(res.nc.nivel) + ')</td></tr>' +
      '<tr><th>NR = NP × NC</th><td><b>' + NTP330.fmt(res.nr) + '</b></td></tr>' +
      '<tr><th>NR = ND × NE × NC</th><td>' + NTP330.fmt(res.nd) + ' × ' + res.ne.valor + ' × ' + res.nc.valor + ' = <b>' + NTP330.fmt(res.nr) + '</b></td></tr>' +
      '<tr><th>Nivel de intervención</th><td>' + chipNI(res.ni) + ' · ' + esc(res.ni.texto) + '</td></tr>' +
      '<tr><th>Prioridad de actuación</th><td>' + esc(interp.prioridad) + '</td></tr>' +
      '<tr><th>Aceptabilidad</th><td>' + esc(interp.aceptable) + '</td></tr>' +
      '</tbody></table>';
  }

  function renderGuardadoHtml(r, res) {
    var html = '';
    if (r.evaluadoEn) {
      var f = new Date(r.evaluadoEn);
      html += '<p>Resultado guardado el ' + f.toLocaleString('es-EC') + ' · ' + chipEstado(res.estado) + '</p>';
    } else {
      html += '<p class="nota">El resultado se registra automáticamente en la tabla de la página principal a medida que completa la evaluación. Use "Guardar resultado" cuando el riesgo esté completo (correcciones2 §17).</p>';
    }
    return html;
  }

  /** Actualiza los bloques calculados de la pestaña sin perder el foco. */
  function actualizarPanel(r) {
    if (!r) return;
    var res = resultadoDe(r);
    setHtml('nd-info-' + r.id, renderNDInfoHtml(r, res));
    setHtml('np-info-' + r.id, renderNPInfoHtml(r, res));
    setHtml('nr-info-' + r.id, renderNRInfoHtml(r, res));
    setHtml('guardado-info-' + r.id, renderGuardadoHtml(r, res));
    actualizarResumen();
    actualizarEstadoGeneral();
  }

  function setHtml(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function problemasRiesgo(r, res) {
    var problemas = [];
    if (!r.sheet) problemas.push('Sin lista de chequeo asignada.');
    if (res.detalle.sinResponder > 0) problemas.push('Lista incompleta (' + res.detalle.sinResponder + ' pendiente' + (res.detalle.sinResponder === 1 ? '' : 's') + ').');
    if (!(r.ne && r.ne.valor)) problemas.push('NE no seleccionado.');
    else if (!String(r.ne.justificacion || '').trim()) problemas.push('Falta la justificación del NE.');
    if (!(r.nc && r.nc.valor)) problemas.push('NC no seleccionado.');
    else if (!String(r.nc.justificacion || '').trim()) problemas.push('Falta la justificación del NC.');
    return problemas;
  }

  function guardarResultado(id, permitirIncompleto) {
    var r = buscarRiesgo(id);
    if (!r) return false;
    var res = resultadoDe(r);
    // Riesgo excluido: su evaluación NO es obligatoria (correcciones6 §5.2).
    if (r.incluido === false) {
      if (!estado.ev) nuevaEvaluacionDesdeZona1();
      guardarEvaluacion();
      limpiarCambiosSinGuardar();
      actualizarResumen();
      actualizarEstadoGeneral();
      return true;
    }
    var problemas = problemasRiesgo(r, res);
    if (problemas.length) {
      if (!permitirIncompleto) {
        alert('El riesgo "' + r.nombre + '" no puede guardarse como evaluado:\n• ' + problemas.join('\n• '));
        return false;
      }
      registrarTraza(r, 'Guardado parcial', 'Guardado sin completar: ' + problemas.join('; '));
    } else {
      r.evaluadoEn = new Date().toISOString();
      registrarTraza(r, 'Guardado', 'Resultado registrado (ND=' + NTP330.fmt(res.nd) +
        ', NE=' + res.ne.valor + ', NP=' + NTP330.fmt(res.np) + ', NC=' + res.nc.valor + ', NR=' + NTP330.fmt(res.nr) + ', NI=' + res.ni.ni + ').');
    }
    if (!estado.ev) nuevaEvaluacionDesdeZona1();
    guardarEvaluacion();
    limpiarCambiosSinGuardar();
    actualizarPanel(r);
    actualizarResumen();
    actualizarEstadoGeneral();
    return true;
  }

  /** Guarda y vuelve a la matriz del numeral 3 para continuar con otro riesgo. */
  function guardarYVolver(id) {
    var r = buscarRiesgo(id);
    if (!r) { mostrarMatrizRiesgos(); return; }
    if (r.incluido !== false) {
      var res = resultadoDe(r);
      var problemas = problemasRiesgo(r, res);
      if (problemas.length) {
        if (!confirm('La evaluación del riesgo "' + r.nombre + '" está incompleta:\n• ' +
          problemas.join('\n• ') + '\n\n¿Guardar y volver a la matriz de todos modos?')) {
          return;
        }
      }
    }
    if (!guardarResultado(id, true)) return;
    mostrarMatrizRiesgos();
  }

  /** Desplaza la pantalla hasta el numeral 1 (Identificación del proyecto). */
  function scrollAZona1() {
    var el = document.getElementById('zona-id');
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 0);
  }

  /* ============================================================
     Matriz de evaluación de riesgos integrada en el numeral 3
     ============================================================ */

  function mostrarMatrizRiesgos() {
    var zona = document.getElementById('zona-riesgos');
    if (zona) zona.classList.remove('oculto');
    actualizarResumen();
    var tabla = document.getElementById('tabla-resumen');
    if (tabla && tabla.scrollIntoView) tabla.scrollIntoView({ block: 'start' });
  }

  /** Lista desplegable de motivos de exclusión (correcciones6 §5.2). Se mantienen las opciones originales. */
  var MOTIVOS_EXCLUSION = [
    'El riesgo no está presente',
    'La actividad no se ejecuta',
    'El riesgo corresponde a otra fase',
    'No existen trabajadores expuestos',
    'Otro'
  ];

  function celdaJustificacion(r) {
    if (r.incluido !== false) {
      return '<span class="nota" style="font-style:italic">—</span>';
    }
    var actual = r.justificacionExclusion || '';
    var preseleccionado = '';
    for (var i = 0; i < MOTIVOS_EXCLUSION.length; i++) {
      if (actual === MOTIVOS_EXCLUSION[i] || actual.indexOf(MOTIVOS_EXCLUSION[i] + ' — ') === 0) {
        preseleccionado = MOTIVOS_EXCLUSION[i];
      }
    }
    var h = '<select class="sel-justif" data-id="' + escAttr(r.id) + '" title="Motivo de exclusión">';
    h += '<option value="">Seleccione el motivo...</option>';
    for (var j = 0; j < MOTIVOS_EXCLUSION.length; j++) {
      h += '<option value="' + escAttr(MOTIVOS_EXCLUSION[j]) + '"' + (preseleccionado === MOTIVOS_EXCLUSION[j] ? ' selected' : '') + '>' + esc(MOTIVOS_EXCLUSION[j]) + '</option>';
    }
    h += '</select>';
    h += ' <button type="button" class="btn btn-secundario btn-sm btn-reincluir" data-id="' + escAttr(r.id) + '" title="Re-incluir riesgo">Re-incluir</button>';
    return h;
  }

  /** HTML de la matriz del bloque 2: tabla editable con dropdowns de riesgos. */
  function matrizHtml() {
    var h = '';
    h += '<p class="nota">Seleccione un riesgo del desplegable para abrir su cuestionario de chequeo. El ND se guarda en la matriz. Pulse NE o NC para seleccionar el nivel. Los cálculos NP, NR y NI se actualizan automáticamente.</p>';
    h += '<div class="tabla-matrix-wrapper">';
    h += '<table class="tabla-evaluacion" id="tabla-resumen">';
    h += '<thead><tr>';
    h += '<th>Riesgo</th><th>Tipo de riesgo</th><th>Lista de chequeo</th><th>Descripción</th><th>Código</th><th>Proceso constructivo</th><th>Posibles consecuencias</th>';
    h += '<th>ND</th><th>NE</th><th>NP</th><th>NC</th><th>NR</th><th>NI</th><th>Acciones</th>';
    h += '</tr></thead><tbody></tbody></table></div>';
    return h;
  }

  /* ============================================================
     ARTs generados (pestaña 6)
     ============================================================ */

  var ART_ENLACES = [
    ['art', 'ART A4'],
    ['art3', 'ART A3'],
    ['prev', 'Vista previa'],
    ['xls', 'Excel'],
    ['csv', 'CSV'],
    ['json', 'JSON']
  ];

  /** Valor clave del proyecto seleccionado en el selector de ARTs ("nombre||tipo"). */
  function proyectoARTsSeleccionado() {
    var sel = document.getElementById('selProyectoARTs');
    var val = (sel && sel.value) || '';
    if (!val) return null;
    var partes = val.split('||');
    return { nombre: partes[0] || '', tipo: partes[1] || '' };
  }

  /** Puebla el selector de proyectos de la pestaña ARTs conservando la selección actual. */
  function poblarSelectorARTs() {
    var sel = document.getElementById('selProyectoARTs');
    if (!sel) return;
    var actual = sel.value;
    var proyectos = DBApp.proyectosExistentes();
    var html = '<option value="">-- Seleccione proyecto --</option>';
    proyectos.forEach(function (p) {
      var v = (p.nombre || '') + '||' + (p.tipo || '');
      html += '<option value="' + escAttr(v) + '"' + (actual === v ? ' selected' : '') + '>' +
        esc(p.nombre || '—') + (p.tipo ? ' (' + esc(p.tipo) + ')' : '') + '</option>';
    });
    sel.innerHTML = html;
    if (!actual && estado.proyecto) {
      var def = estado.proyecto + '||' + (estado.tipoProyecto || '');
      for (var i = 0; i < proyectos.length; i++) {
        if ((proyectos[i].nombre || '') + '||' + (proyectos[i].tipo || '') === def) {
          sel.value = def;
          break;
        }
      }
    }
  }

  /** Lista los ARTs del proyecto seleccionado con sus enlaces de descarga (solo enlaces, en orden). */
  function poblarARTs() {
    var cont = document.getElementById('arts-lista');
    if (!cont) return;
    poblarSelectorARTs();
    var proy = proyectoARTsSeleccionado();
    if (!proy || !proy.nombre) {
      cont.innerHTML = '<p class="nota" style="text-align:center;margin-top:20px">Seleccione un proyecto para ver sus ARTs generados.</p>';
      return;
    }
    var evals = DBApp.listarEvaluacionesDeProyecto(proy.nombre, proy.tipo)
      .filter(function (e) {
        var ids = Object.keys(e.riesgos || {});
        return ids.length > 0;
      });
    if (!evals.length) {
      cont.innerHTML = '<p class="nota" style="text-align:center;margin-top:20px">Aún no hay ARTs generados para el proyecto "' +
        esc(proy.nombre) + '". Guarde la evaluación de un proceso constructivo para ver aquí su ART. Los ARTs de un proceso se eliminan al reiniciarlo (volver a seleccionar el proceso constructivo).</p>';
      return;
    }
    var html = '<div class="tabla-matrix-wrapper"><table class="tabla-riesgos tabla-arts" id="tabla-arts"><thead><tr>';
    html += '<th>N.°</th><th>Proceso constructivo</th><th>Tipo de proyecto</th><th>Proyecto</th><th>Fecha</th><th>Estado</th><th>Descargas</th>';
    html += '</tr></thead><tbody>';
    for (var i = 0; i < evals.length; i++) {
      var ev = evals[i];
      var ids = Object.keys(ev.riesgos || {});
      var estadoEval = ev.aprobado ? 'Evaluación aprobada' : (ids.length ? 'Evaluación guardada' : 'Sin evaluar');
      html += '<tr data-id="' + escAttr(ev.id) + '">';
      html += '<td>' + (i + 1) + '</td>';
      html += '<td><b>' + esc(ev.proceso || '—') + '</b></td>';
      html += '<td>' + esc(ev.tipoProyecto || '—') + '</td>';
      html += '<td>' + esc(ev.proyecto || '—') + '</td>';
      html += '<td>' + esc(ev.fecha || '—') + '</td>';
      html += '<td>' + esc(estadoEval) + '</td>';
      html += '<td class="art-descargas">';
      for (var j = 0; j < ART_ENLACES.length; j++) {
        if (j > 0) html += ' <span class="art-sep">·</span> ';
        html += '<a href="#" class="art-link" data-id="' + escAttr(ev.id) + '" data-tipo="' + ART_ENLACES[j][0] + '">' + esc(ART_ENLACES[j][1]) + '</a>';
      }
      html += '</td>';
      html += '</tr>';
    }
    html += '</tbody></table></div>';
    cont.innerHTML = html;
  }

  /** Genera el ART/exportación de una evaluación guardada del proyecto activo sin alterar la evaluación en curso. */
  function generarARTDesdeEvaluacion(id, tipo) {
    var proy = proyectoARTsSeleccionado();
    var evals = DBApp.listarEvaluacionesDeProyecto(proy ? proy.nombre : '', proy ? proy.tipo : '');
    var ev = null;
    for (var i = 0; i < evals.length; i++) {
      if (evals[i].id === id) { ev = evals[i]; break; }
    }
    if (!ev) { alert('Evaluación no encontrada en el proyecto seleccionado.'); return; }
    if (typeof ReportesApp === 'undefined') { alert('Módulo de reportes no disponible.'); return; }

    var prev = JSON.parse(JSON.stringify(estado));
    restaurarEstado(JSON.parse(JSON.stringify(ev)));
    try {
      if (tipo === 'art') ReportesApp.descargarART();
      else if (tipo === 'art3') ReportesApp.descargarART_A3();
      else if (tipo === 'prev') ReportesApp.vistaPreviaART();
      else if (tipo === 'xls') ReportesApp.exportarExcel();
      else if (tipo === 'csv') ReportesApp.exportarCSV();
      else if (tipo === 'json') ReportesApp.exportarJSON();
    } finally {
      estado = prev;
    }
  }

  function bindARTs() {
    var cont = document.getElementById('arts-lista');
    if (cont) cont.addEventListener('click', function (e) {
      var a = e.target.closest('.art-link');
      if (!a) return;
      e.preventDefault();
      generarARTDesdeEvaluacion(a.dataset.id, a.dataset.tipo);
    });
    var sel = document.getElementById('selProyectoARTs');
    if (sel) sel.addEventListener('change', poblarARTs);
  }

  function actualizarResumen() {
    var tbody = document.querySelector('#tabla-resumen tbody');
    if (!tbody) return;

    var html = '';
    if (!estado.riesgos.length) {
      html = '<tr><td colspan="14" class="nota" style="text-align:center">No hay filas en la matriz. Pulse "+ Agregar riesgo" para añadir una.</td></tr>';
    } else {
      estado.riesgos.forEach(function (r, idx) {
        var res = resultadoDe(r);
        var asignado = !!r.codigo;
        var neListo = !!(r.ne && r.ne.valor);
        var ncListo = !!(r.nc && r.nc.valor);
        var excluido = (r.incluido === false);
        var cls = (r.id === estado.riesgoActivo ? ' fila-activa' : '') + (excluido ? ' fila-excluida' : '');
        html += '<tr data-id="' + escAttr(r.id) + '" class="' + cls + '">';
        html += '<td class="celda-riesgo">' + selectorRiesgo(r, idx) +
          (excluido ? '<br><span class="badge badge-excluido">Excluido</span>' : '') + '</td>';
        html += '<td>' + esc(r.tipo || '—') + '</td>';
        html += '<td><small>' + esc(r.sheet || '—') + '</small></td>';
        html += '<td style="max-width:200px"><small>' + esc(r.descripcion || '—') + '</small></td>';
        html += '<td><small>' + esc(r.codigo || '—') + '</small></td>';
        html += '<td><small>' + esc(r.proceso || estado.proceso || '—') + '</small></td>';
        html += '<td style="max-width:200px"><small>' + esc(r.consecuencias || '—') + '</small></td>';
        html += '<td class="celda-numerica">' + (asignado ? NTP330.fmt(res.nd) : '—') + '</td>';
        html += '<td class="celda-numerica"><button type="button" class="btn btn-secundario btn-sm btn-ne" data-id="' + escAttr(r.id) + '" title="Seleccionar nivel de exposición">' + (neListo ? r.ne.valor : '—') + '</button></td>';
        html += '<td class="celda-numerica">' + (asignado && neListo ? NTP330.fmt(res.np) : '—') + '</td>';
        html += '<td class="celda-numerica"><button type="button" class="btn btn-secundario btn-sm btn-nc" data-id="' + escAttr(r.id) + '" title="Seleccionar nivel de consecuencia">' + (ncListo ? r.nc.valor : '—') + '</button></td>';
        html += '<td class="celda-numerica"><b>' + (asignado && neListo && ncListo ? NTP330.fmt(res.nr) : '—') + '</b></td>';
        html += '<td class="celda-numerica">' + (asignado && neListo && ncListo ? chipNI(res.ni) : '—') + '</td>';
        html += '<td class="celda-acciones">';
        html += '<button type="button" class="btn btn-secundario btn-sm btn-checklist" data-id="' + escAttr(r.id) + '">Cuestionario</button> ';
        html += '<button type="button" class="btn btn-secundario btn-sm btn-traza" data-id="' + escAttr(r.id) + '">Trazabilidad</button> ';
        if (excluido) {
          html += '<button type="button" class="btn btn-primario btn-sm btn-reincluir" data-id="' + escAttr(r.id) + '">Re-incluir</button>';
        } else if (asignado) {
          html += '<button type="button" class="btn btn-secundario btn-sm btn-excluir" data-id="' + escAttr(r.id) + '">Excluir</button>';
        }
        html += '</td>';
        html += '</tr>';
      });
    }
    tbody.innerHTML = html;
  }

  /** Posición de un riesgo ya evaluado dentro de la lista de riesgos del proceso. */
  function indiceDeRiesgo(r, disponibles) {
    if (r.origenIdx !== undefined && r.origenIdx !== null && disponibles[r.origenIdx] &&
      disponibles[r.origenIdx].codigo === r.codigo && disponibles[r.origenIdx].nombre === r.nombre) {
      return r.origenIdx;
    }
    for (var i = 0; i < disponibles.length; i++) {
      if (disponibles[i].codigo === r.codigo && disponibles[i].nombre === r.nombre) return i;
    }
    return -1;
  }

  /** Dropdown de riesgos disponibles para el proceso constructivo. */
  function selectorRiesgo(r, idx) {
    var disponibles = construirRiesgos(estado.tipoProyecto, estado.proceso);
    var usados = {};
    var propio = indiceDeRiesgo(r, disponibles);
    estado.riesgos.forEach(function (otro) {
      if (otro.id === r.id) return;
      var i = indiceDeRiesgo(otro, disponibles);
      if (i >= 0) usados[i] = true;
    });
    var h = '<select class="sel-riesgo" data-idx="' + idx + '">';
    h += '<option value="">-- Seleccione riesgo --' +
      (propio < 0 && r.nombre ? ' (fila: ' + esc(r.nombre) + ')' : '') + '</option>';
    disponibles.forEach(function (d, i) {
      if (usados[i] && i !== propio) return;
      h += '<option value="' + i + '"' + (i === propio ? ' selected' : '') + '>' +
        esc(d.nombre) + (d.codigo ? ' (' + esc(d.codigo) + ')' : '') + '</option>';
    });
    h += '</select>';
    return h;
  }

  /* ============================================================
     Bloque 2: Cuestionario modal, NE/NC modales y agregar riesgo
     ============================================================ */

  /** Abre el cuestionario de chequeo en un modal. */
  function abrirChecklistModal(id) {
    var r = buscarRiesgo(id);
    if (!r) return;
    estado.riesgoActivo = id;
    estado.checklistLimpio = false;
    var preguntas = (r.catalogo && r.catalogo.preguntas) || [];
    var html = '<p class="nota" style="margin-top:0">Lista de chequeo: <b>' + esc(r.sheet || 'Sin lista') + '</b> · ' +
      preguntas.length + ' preguntas. Responda todas las preguntas para calcular el ND.</p>';
    html += '<div class="campo-acciones" style="margin-bottom:8px">' +
      '<button type="button" class="btn btn-secundario btn-sm ck-marcar-no">Marcar todo «No»</button> ' +
      '<button type="button" class="btn btn-secundario btn-sm ck-marcar-na">Marcar todo «No aplica»</button> ' +
      '<button type="button" class="btn btn-secundario btn-sm ck-limpiar">Limpiar respuestas</button></div>';
    if (!preguntas.length) {
      html += '<p class="nota">Este riesgo no tiene lista de chequeo asignada. Puede configurarla en la pestaña Catálogo.</p>';
    } else {
      html += '<table class="tabla-riesgos checklist"><thead><tr>';
      html += '<th style="width:40px">N°</th><th style="text-align:left">Acción sujeta a evaluación</th>';
      html += '<th style="width:70px">Sí</th><th style="width:70px">No</th><th style="width:70px">No aplica</th>';
      html += '</tr></thead><tbody>';
      preguntas.forEach(function (p) {
        var sel = r.respuestas[p.n] || '';
        var cls = sel === 'si' ? 'fila-si' : (sel === 'no' ? 'fila-no' : (sel === 'na' ? 'fila-na' : ''));
        var legal = null;
        if (window.APP_LEGAL && r.catalogo && r.catalogo.codigo) {
          var porCodigo = window.APP_LEGAL[r.catalogo.codigo];
          if (porCodigo && porCodigo[p.n]) legal = porCodigo[p.n];
        }
        var conLegal = !!(legal && legal.refs && legal.refs.length);
        html += '<tr class="' + cls + '" data-pregunta="' + p.n + '">';
        html += '<td>' + p.n + '</td>';
        html += '<td style="text-align:left" class="q-legal' + (conLegal ? ' tiene-legal' : '') + '">';
        html += '<div class="q-legal-texto">' + esc(p.texto) + '</div>';
        if (conLegal) {
          html += '<button type="button" class="q-legal-toggle" data-n="' + p.n + '">Ver requisito legal</button>';
          html += '<div class="q-legal-detalle oculto">' + renderLegalDetalle(legal) + '</div>';
        }
        html += '</td>';
        html += '<td><input type="radio" name="ck-' + escAttr(r.id) + '-' + p.n + '" value="si" data-n="' + p.n + '"' + (sel === 'si' ? ' checked' : '') + '></td>';
        html += '<td><input type="radio" name="ck-' + escAttr(r.id) + '-' + p.n + '" value="no" data-n="' + p.n + '"' + (sel === 'no' ? ' checked' : '') + '></td>';
        html += '<td><input type="radio" name="ck-' + escAttr(r.id) + '-' + p.n + '" value="na" data-n="' + p.n + '"' + (sel === 'na' ? ' checked' : '') + '></td>';
        html += '</tr>';
      });
      html += '</tbody></table>';
      html += '<p class="nota">"No" aumenta el NDP. "No aplica" excluye la pregunta del cálculo.</p>';
    }
    html += '<div id="nd-info-' + escAttr(r.id) + '" class="nd-info-modal"></div>';
    document.getElementById('checklist-contenido').innerHTML = html;
    var info = document.getElementById('nd-info-' + r.id);
    if (info) info.innerHTML = renderNDInfoHtml(r, resultadoDe(r));
    document.getElementById('modal-checklist-overlay').classList.remove('oculto');
    marcarPendientesModal(r);
  }

  /** Resalta en el modal las preguntas aún sin responder. */
  function marcarPendientesModal(r) {
    var preguntas = (r.catalogo && r.catalogo.preguntas) || [];
    preguntas.forEach(function (p) {
      var sel = r.respuestas[p.n] || '';
      if (sel) return;
      var tr = document.querySelector('#checklist-contenido tr[data-pregunta="' + p.n + '"]');
      if (tr) tr.style.background = '#fff8e1';
    });
  }

  /** Marca todas las preguntas del modal con la misma respuesta. */
  function marcarTodosModal(valor) {
    var radios = document.querySelectorAll('#checklist-contenido input[type="radio"][value="' + valor + '"]');
    radios.forEach(function (radio) { radio.checked = true; });
    if (valor === 'no') {
      document.querySelectorAll('#checklist-contenido tbody tr').forEach(function (tr) {
        tr.classList.add('fila-no');
        tr.classList.remove('fila-si', 'fila-na');
      });
    } else if (valor === 'na') {
      document.querySelectorAll('#checklist-contenido tbody tr').forEach(function (tr) {
        tr.classList.add('fila-na');
        tr.classList.remove('fila-si', 'fila-no');
      });
    }
  }

  /** Guarda las respuestas del cuestionario y actualiza el ND en la matriz. */
  function guardarChecklistModal() {
    var r = buscarRiesgo(estado.riesgoActivo);
    if (!r) return;
    var radios = document.querySelectorAll('#checklist-contenido input[type="radio"]:checked');
    if (estado.checklistLimpio) r.respuestas = {};
    radios.forEach(function (radio) {
      var n = +radio.dataset.n;
      r.respuestas[n] = radio.value;
      registrarTraza(r, 'Lista de chequeo', 'Pregunta ' + n + ' → ' + radio.value.toUpperCase());
    });
    estado.checklistLimpio = false;
    var res = resultadoDe(r);
    if (res.detalle.sinResponder > 0) {
      alert('Quedan ' + res.detalle.sinResponder + ' pregunta(s) sin responder. ' +
        'El ND se calcula cuando la lista de chequeo esté completa.');
    }
    if (estado.ev) guardarEvaluacion();
    cerrarChecklistModal();
    renderTabPanel(r);
    actualizarResumen();
    actualizarEstadoGeneral();
  }

  function cerrarChecklistModal() {
    var overlay = document.getElementById('modal-checklist-overlay');
    if (overlay) overlay.classList.add('oculto');
  }

  /** Abre el modal de selección de NE. */
  function abrirModalNE(id) {
    var r = buscarRiesgo(id);
    if (!r) return;
    estado.riesgoActivo = id;
    var html = '';
    NTP330.NE_NIVELES.forEach(function (n) {
      var checked = (r.ne && r.ne.valor === n.valor) ? ' checked' : '';
      html += '<label><input type="radio" name="ne-nivel" value="' + n.valor + '"' + checked + '> <b>' + n.nivel + ' (' + n.valor + ')</b> — ' + esc(n.desc) + '</label>';
    });
    document.getElementById('ne-opciones').innerHTML = html;
    document.getElementById('ne-justificacion').value = (r.ne && r.ne.justificacion) || '';
    document.getElementById('modal-ne-overlay').classList.remove('oculto');
  }

  function guardarModalNE() {
    var r = buscarRiesgo(estado.riesgoActivo);
    if (!r) return;
    var seleccion = document.querySelector('input[name="ne-nivel"]:checked');
    if (!seleccion) { alert('Seleccione un nivel de exposición.'); return; }
    var justificacion = document.getElementById('ne-justificacion').value.trim();
    if (!justificacion) { alert('La justificación del NE es obligatoria.'); return; }
    if (!r.ne) r.ne = {};
    r.ne.valor = +seleccion.value;
    r.ne.justificacion = justificacion;
    var nN = NTP330.getNE(r.ne.valor);
    registrarTraza(r, 'NE', 'Nivel de exposición → ' + nN.nivel + ' (' + r.ne.valor + ')');
    if (estado.ev) guardarEvaluacion();
    cerrarModalNE();
    actualizarResumen();
    actualizarEstadoGeneral();
    renderTabPanel(r);
  }

  function cerrarModalNE() {
    var overlay = document.getElementById('modal-ne-overlay');
    if (overlay) overlay.classList.add('oculto');
  }

  /** Abre el modal de selección de NC. */
  function abrirModalNC(id) {
    var r = buscarRiesgo(id);
    if (!r) return;
    estado.riesgoActivo = id;
    var html = '';
    NTP330.NC_NIVELES.forEach(function (n) {
      var checked = (r.nc && r.nc.valor === n.valor) ? ' checked' : '';
      html += '<label><input type="radio" name="nc-nivel" value="' + n.valor + '"' + checked + '> <b>' + n.nivel + ' (' + n.valor + ')</b> — ' + esc(n.desc) + '</label>';
    });
    document.getElementById('nc-opciones').innerHTML = html;
    document.getElementById('nc-justificacion').value = (r.nc && r.nc.justificacion) || '';
    document.getElementById('modal-nc-overlay').classList.remove('oculto');
  }

  function guardarModalNC() {
    var r = buscarRiesgo(estado.riesgoActivo);
    if (!r) return;
    var seleccion = document.querySelector('input[name="nc-nivel"]:checked');
    if (!seleccion) { alert('Seleccione un nivel de consecuencia.'); return; }
    var justificacion = document.getElementById('nc-justificacion').value.trim();
    if (!justificacion) { alert('La justificación del NC es obligatoria.'); return; }
    if (!r.nc) r.nc = {};
    r.nc.valor = +seleccion.value;
    r.nc.justificacion = justificacion;
    var nC = NTP330.getNC(r.nc.valor);
    registrarTraza(r, 'NC', 'Nivel de consecuencia → ' + nC.nivel + ' (' + r.nc.valor + ')');
    if (estado.ev) guardarEvaluacion();
    cerrarModalNC();
    actualizarResumen();
    actualizarEstadoGeneral();
    renderTabPanel(r);
  }

  function cerrarModalNC() {
    var overlay = document.getElementById('modal-nc-overlay');
    if (overlay) overlay.classList.add('oculto');
  }

  /** Agrega una nueva fila vacía a la matriz. */
  function agregarRiesgoFila() {
    var id = 'fila-' + Date.now().toString(36);
    var r = nuevoRiesgo({
      id: id,
      nombre: '',
      codigo: '',
      sheet: '',
      catalogo: { sheet: '', codigo: '', riesgo: '', preguntas: [], activa: true },
      origen: 'manual',
      confirmado: true,
      proceso: estado.proceso
    });
    estado.riesgos.push(r);
    estado.riesgoActivo = id;
    if (!estado.ev) nuevaEvaluacionDesdeZona1();
    // La fila vacía no se persiste: se guarda cuando se le asigna un riesgo
    if (r.codigo && estado.ev) guardarEvaluacion();
    actualizarResumen();
    actualizarEstadoGeneral();
    var sel = document.querySelector('#tabla-resumen tbody tr[data-id="' + r.id + '"] .sel-riesgo');
    if (sel) sel.focus();
  }

  /** Selecciona un riesgo del dropdown y abre su cuestionario. */
  function seleccionarRiesgo(idxOrigen, idxFila) {
    if (idxOrigen === '' || idxOrigen === undefined || idxOrigen === null) return;
    var disponibles = construirRiesgos(estado.tipoProyecto, estado.proceso);
    var datos = disponibles[+idxOrigen];
    if (!datos) return;
    var r = estado.riesgos[idxFila];
    if (!r) return;

    // Si la fila ya tenía otro riesgo, se reinicia su evaluación antes de asignar el nuevo
    if (r.codigo && (r.codigo !== datos.codigo || r.nombre !== datos.nombre)) {
      var tieneDatos = r.respuestas && Object.keys(r.respuestas).length;
      if (tieneDatos && !confirm('Esta fila ya tiene un riesgo evaluado (' + r.nombre + '). ¿Desea reemplazarlo?')) return;
      r.respuestas = {};
      r.ne = null;
      r.nc = null;
      r.aprobado = false;
      r.incluido = true;
      r.justificacionExclusion = '';
      registrarTraza(r, 'Asignación', 'Riesgo reemplazado por: ' + datos.nombre);
    }

    r.origenIdx = +idxOrigen;
    r.nombre = datos.nombre;
    r.codigo = datos.codigo;
    r.tipo = datos.tipo;
    r.sheet = datos.sheet;
    r.descripcion = datos.descripcion;
    r.consecuencias = datos.consecuencias;
    r.proceso = datos.proceso || estado.proceso;
    r.catalogo = clonarCatalogo(datos.sheet) || { sheet: datos.sheet, codigo: datos.codigo, riesgo: datos.nombre, preguntas: [], activa: true };
    estado.riesgoActivo = r.id;
    if (estado.ev) guardarEvaluacion();
    renderTabPanel(r);
    actualizarResumen();
    actualizarEstadoGeneral();
    abrirChecklistModal(r.id);
  }

  /* ============================================================
     Trazabilidad (§21)
     ============================================================ */

  function abrirTraza(id) {
    var r = buscarRiesgo(id);
    if (!r) return;
    var res = resultadoDe(r);
    var overlay = document.getElementById('modal-traza-overlay');
    if (!overlay) return;
    var html = '';

    html += '<h4 style="margin-top:0;color:var(--tinta)">' + esc(r.nombre) + ' <small>(' + esc(r.codigo || '') + ')</small></h4>';
    html += '<table class="tabla-niveles"><tbody>';
    html += '<tr><th>Tipo de proyecto</th><td>' + esc(estado.tipoProyecto) + '</td></tr>';
    html += '<tr><th>Proceso constructivo</th><td>' + esc(r.proceso || estado.proceso || '—') + '</td></tr>';
    html += '<tr><th>Lista de chequeo</th><td>' + esc(r.sheet || '—') + ' (' + ((r.catalogo && r.catalogo.preguntas.length) || 0) + ' preguntas)</td></tr>';
    html += '<tr><th>Versión de la lista</th><td>nd.xlsx · v1</td></tr>';
    html += '<tr><th>Versión de la metodología</th><td>NTP 330 · ' + esc((window.NTP330 && NTP330.version) || '1.1.0') + '</td></tr>';
    html += '<tr><th>Fórmula utilizada</th><td>NP = ND × NE · NR = NP × NC</td></tr>';
    html += '<tr><th>Archivos de origen</th><td>330.pdf · nd.xlsx · ER · procesos.doc</td></tr>';
    html += '<tr><th>Usuario</th><td>' + esc('evaluador') + '</td></tr>';
    html += '<tr><th>Fecha de evaluación</th><td>' + esc(estado.ev && estado.ev.fecha || '—') + '</td></tr>';
    html += '<tr><th>Resultado</th><td>ND=' + NTP330.fmt(res.nd) + ' · NE=' + (res.ne ? res.ne.valor : '—') +
      ' · NP=' + NTP330.fmt(res.np) + ' · NC=' + (res.nc ? res.nc.valor : '—') +
      ' · NR=' + NTP330.fmt(res.nr) + ' · NI=' + res.ni.ni + '</td></tr>';
    html += '<tr><th>Estado</th><td>' + chipEstado(res.estado) + '</td></tr>';
    html += '</tbody></table>';

    // Preguntas, respuestas y puntajes
    var preguntas = (r.catalogo && r.catalogo.preguntas) || [];
    if (preguntas.length) {
      html += '<h4 style="color:var(--tinta)">Preguntas · Respuestas · Puntajes</h4>';
      html += '<table class="tabla-riesgos"><thead><tr><th>N°</th><th style="text-align:left">Pregunta</th><th>Respuesta</th><th>NDP</th></tr></thead><tbody>';
      preguntas.forEach(function (p) {
        var resp = r.respuestas[p.n] || 'Sin responder';
        html += '<tr><td>' + p.n + '</td><td style="text-align:left">' + esc(p.texto) + '</td><td>' + esc(resp) + '</td><td>' + NTP330.fmt(p.ndp) + '</td></tr>';
      });
      html += '</tbody></table>';
    }

    // Historial
    html += '<h4 style="color:var(--tinta)">Historial de cambios</h4>';
    if (r.trazabilidad && r.trazabilidad.length) {
      html += '<table class="tabla-niveles"><tbody>';
      r.trazabilidad.forEach(function (t) {
        html += '<tr><td style="width:150px">' + esc(new Date(t.cuando).toLocaleString('es-EC')) + '</td><td><b>' + esc(t.campo) + '</b><br>' + esc(t.detalle) + '</td></tr>';
      });
      html += '</tbody></table>';
    } else {
      html += '<p class="nota">Sin cambios registrados.</p>';
    }

    var cont = document.getElementById('traza-contenido');
    cont.innerHTML = html;
    document.getElementById('traza-titulo').textContent = 'Trazabilidad del riesgo';
    overlay.classList.remove('oculto');
  }

  function cerrarTraza() {
    var overlay = document.getElementById('modal-traza-overlay');
    if (overlay) overlay.classList.add('oculto');
  }

  /* ============================================================
     Agregar riesgos adicionales (§4)
     ============================================================ */

  function abrirFormAgregarRiesgo() {
    var cont = document.getElementById('form-riesgo-manual');
    if (!cont) return;
    cont.classList.remove('oculto');
    cont.scrollIntoView({ block: 'nearest' });
  }

  function poblarOpcionesAgregar() {
    var sel = document.getElementById('rm-lista');
    if (!sel) return;
    var html = '<option value="">-- Sin lista (pendiente de configuración) --</option>';
    CATALOGO.forEach(function (c) {
      html += '<option value="' + escAttr(c.sheet) + '">' + esc(c.sheet) + ' · ' + esc(c.riesgo) + '</option>';
    });
    sel.innerHTML = html;
  }

  function guardarRiesgoManual() {
    var nombre = document.getElementById('rm-nombre').value.trim();
    var justificacion = document.getElementById('rm-justificacion').value.trim();
    if (!nombre) { alert('El nombre del riesgo es obligatorio.'); return; }
    if (!justificacion) { alert('La justificación de la inclusión es obligatoria.'); return; }
    var sheet = document.getElementById('rm-lista').value;
    var c = sheet ? clonarCatalogo(sheet) : null;
    var id = 'manual-' + Date.now().toString(36);
    var r = nuevoRiesgo({
      id: id,
      nombre: nombre,
      tipo: document.getElementById('rm-tipo').value.trim(),
      descripcion: document.getElementById('rm-descripcion').value.trim(),
      fuente: document.getElementById('rm-fuente').value.trim(),
      consecuencias: document.getElementById('rm-consecuencias').value.trim(),
      proceso: document.getElementById('rm-proceso').value.trim() || estado.proceso,
      catalogo: c || { sheet: sheet || '', codigo: '', riesgo: nombre, preguntas: [], activa: true },
      origen: 'manual',
      confirmado: true,
      justificacion: justificacion
    });
    estado.riesgos.push(r);
    estado.riesgoActivo = id;
    registrarTraza(r, 'Riesgo agregado', 'Riesgo adicional incluido manualmente: ' + nombre);
    if (!estado.ev) nuevaEvaluacionDesdeZona1();
    guardarEvaluacion();
    renderTabPanel(r);
    actualizarResumen();
    actualizarEstadoGeneral();
    document.getElementById('form-riesgo-manual').classList.add('oculto');
    ['rm-nombre', 'rm-tipo', 'rm-descripcion', 'rm-proceso', 'rm-fuente', 'rm-consecuencias', 'rm-justificacion'].forEach(function (idn) {
      var el = document.getElementById(idn);
      if (el) el.value = '';
    });
    var sel = document.getElementById('rm-lista');
    if (sel) sel.value = '';
  }

  /* ============================================================
     Eventos
     ============================================================ */

  function onTipoProyecto() {
    var sel = document.getElementById('selTipoProyecto');
    var tipoNuevo = sel.value;
    var nombreAnt = estado.proyecto, tipoAnt = estado.tipoProyecto;
    if (tipoNuevo !== tipoAnt) {
      /* Cambiar Estructura ↔ Infraestructura es cambiar de proyecto: se ofrece guardar
         el trabajo en curso en el anterior y el nuevo arranca desde cero. */
      if (!confirmarCambioIdentidad(nombreAnt, tipoAnt, nombreAnt, tipoNuevo)) {
        sel.value = tipoAnt;
        return;
      }
    }
    estado.tipoProyecto = tipoNuevo;
    estado.proceso = '';
    estado.riesgos = [];
    estado.riesgoActivo = '';
    estado.ev = null;
    poblarSugerenciasProyecto();
    poblarProcesos();
    var s = document.getElementById('selProceso');
    if (s) s.value = '';
    ocultarZonasEvaluacion();
    limpiarCambiosSinGuardar();
    poblarTablaEvaluaciones();
    renderZonaRiesgos();
    actualizarBotones();
    actualizarEstadoGeneral();
    /* Escoger un tipo de proyecto reinicia la matriz unificada */
    reiniciarMatrizUnificada();
  }

  /** Vacía la selección de la matriz unificada: el usuario debe volver a elegir proyecto. */
  function reiniciarMatrizUnificada() {
    estado.matrizVinculada = false;
    var sel = document.getElementById('selProyectoUnificado');
    if (sel) sel.value = '';
    poblarProyectosUnificados();
    renderMatrizUnificada();
  }

  /** Guarda la evaluación en curso y abre la matriz unificada de su proyecto. */
  function verMatrizUnificada() {
    if (estado.ev) guardarEvaluacion();
    if (!vincularMatriz()) {
      var tab = document.querySelector('.tab-btn[data-tab="matriz-unificada"]');
      if (tab) tab.click();
      return;
    }
    var tab = document.querySelector('.tab-btn[data-tab="matriz-unificada"]');
    if (tab) tab.click();
    var zona = document.getElementById('matriz-unificada-contenido');
    if (zona) zona.scrollIntoView({ block: 'start' });
  }

  function onProceso() {
    var sel = document.getElementById('selProceso');
    estado.proceso = sel.value;
    leerZona1();
    if (!estado.proceso) {
      ocultarZonasEvaluacion();
      actualizarBotones();
      actualizarEstadoGeneral();
      return;
    }
    /* La matriz unificada es progresiva y acumulada entre procesos: si este proceso
       ya tiene evaluación se RESTAURA, nunca se borra. Re-seleccionar un proceso no
       puede destruir trabajo previo; antes `DBApp.eliminarEvaluacion()` lo eliminaba
       y la matriz consolidada perdía el proceso completo. */
    var evals = DBApp.listarEvaluacionesDeProyecto(estado.proyecto, estado.tipoProyecto);
    var previa = null;
    for (var i = 0; i < evals.length; i++) {
      if (evals[i].proceso === estado.proceso) { previa = evals[i]; break; }
    }
    if (previa) {
      restaurarEstado(previa);
      if (!estado.riesgos.length) agregarRiesgoFila();
    } else {
      estado.ev = null;
      nuevaEvaluacionDesdeZona1();
      estado.riesgos = [];
      agregarRiesgoFila();
    }
    estado.riesgoActivo = '';
    poblarTablaEvaluaciones();
    renderZonaRiesgos();
    actualizarBotones();
    actualizarEstadoGeneral();
  }

  function ocultarZonasEvaluacion() {
    var zR = document.getElementById('zona-riesgos');
    var zA = document.getElementById('zona-articulo');
    if (zR) zR.classList.add('oculto');
    if (zA) zA.classList.add('oculto');
  }

  function onNuevaEvaluacion() {
    if (!estado.proceso) {
      alert('Seleccione un proceso constructivo primero.');
      return;
    }
    // Check if eval already exists for this process
    var evals = DBApp.listarEvaluacionesDeProyecto(estado.proyecto, estado.tipoProyecto);
    for (var i = 0; i < evals.length; i++) {
      if (evals[i].proceso === estado.proceso) {
        alert('Ya existe una evaluación para el proceso "' + estado.proceso + '".');
        return;
      }
    }
    nuevaEvaluacionDesdeZona1();
    guardarEvaluacion();
    poblarTablaEvaluaciones();
    renderZonaRiesgos();
    alert('Nueva evaluación creada para el proceso: ' + estado.proceso);
  }

  function onGuardarEvaluacion() {
    leerZona1();
    if (!estado.ev) nuevaEvaluacionDesdeZona1();
    guardarEvaluacion();
    poblarTablaEvaluaciones();
    alert('Evaluación guardada.');
  }

  function onEliminarEvaluacion() {
    if (!estado.ev || !estado.ev.id) return;
    if (!confirm('¿Eliminar la evaluación guardada?')) return;
    DBApp.eliminarEvaluacion(estado.ev.id);
    estado.ev = null;
    estado.riesgos = [];
    estado.riesgoActivo = '';
    poblarTablaEvaluaciones();
    ocultarZonasEvaluacion();
    actualizarBotones();
  }

  function onAprobar() {
    var problemas = [];
    var confirmados = estado.riesgos.filter(function (r) { return r.confirmado && r.incluido; });
    confirmados.forEach(function (r) {
      var res = resultadoDe(r);
      if (!r.sheet) {
        problemas.push('• ' + r.nombre + ': sin lista de chequeo asignada.');
        return;
      }
      if (res.detalle.sinResponder > 0) {
        problemas.push('• ' + r.nombre + ': hay preguntas sin responder (' + res.detalle.sinResponder + ').');
      }
      if (!(r.ne && r.ne.valor)) problemas.push('• ' + r.nombre + ': NE no seleccionado.');
      if (!(r.nc && r.nc.valor)) problemas.push('• ' + r.nombre + ': NC no seleccionado.');
      if (r.ne && r.ne.valor && !String(r.ne.justificacion || '').trim()) {
        problemas.push('• ' + r.nombre + ': falta la justificación del NE.');
      }
      if (r.nc && r.nc.valor && !String(r.nc.justificacion || '').trim()) {
        problemas.push('• ' + r.nombre + ': falta la justificación del NC.');
      }
    });
    if (!confirmados.length) problemas.push('• No hay riesgos confirmados.');

    if (problemas.length) {
      alert('No se puede aprobar la evaluación:\n' + problemas.join('\n'));
      return;
    }

    if (!confirm('¿Aprobar la evaluación completa?')) return;
    if (!estado.ev) nuevaEvaluacionDesdeZona1();
    estado.ev.aprobado = true;
    estado.riesgos.forEach(function (r) { r.aprobado = true; });
    guardarEvaluacion();
    var activo = buscarRiesgo(estado.riesgoActivo);
    if (activo) renderTabPanel(activo);
    actualizarResumen();
    actualizarEstadoGeneral();
    alert('Evaluación aprobada.');
  }

  /* ============================================================
     Bindings
     ============================================================ */

  function bindZona1() {
    var elT = document.getElementById('selTipoProyecto');
    if (elT) elT.addEventListener('change', onTipoProyecto);
    var elP = document.getElementById('selProceso');
    if (elP) elP.addEventListener('change', onProceso);
    ['inpProyecto'].forEach(function (idn) {
      var el = document.getElementById(idn);
      if (el) el.addEventListener('change', onCampoIdentificacion);
    });

    /* Desplegable de proyectos anteriores: flecha, clic en la lista y teclado */
    var comboProyecto = document.getElementById('comboProyecto');
    var btnCombo = document.getElementById('btnComboProyecto');
    if (btnCombo) btnCombo.addEventListener('click', function (e) {
      e.preventDefault();
      alternarComboProyecto();
    });
    if (comboProyecto) {
      comboProyecto.addEventListener('click', function (e) {
        var opcion = e.target.closest('.combo-opcion');
        if (!opcion) return;
        e.preventDefault();
        elegirProyectoDeLista(opcion.getAttribute('data-valor') || opcion.textContent);
      });
      document.addEventListener('click', function (e) {
        if (!comboAbierto()) return;
        if (comboProyecto.contains(e.target)) return;
        cerrarComboProyecto();
      });
    }
    var inpProyecto = document.getElementById('inpProyecto');
    if (inpProyecto) {
      inpProyecto.addEventListener('input', function () {
        if (comboAbierto()) poblarSugerenciasProyecto();
      });
      inpProyecto.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' && !comboAbierto()) {
          e.preventDefault();
          abrirComboProyecto();
        } else if (e.key === 'Escape' && comboAbierto()) {
          e.preventDefault();
          cerrarComboProyecto();
        } else if (e.key === 'Enter' && comboAbierto()) {
          var lista = document.getElementById('listaProyectosSugeridos');
          var primero = lista ? lista.querySelector('.combo-opcion') : null;
          if (primero) {
            e.preventDefault();
            elegirProyectoDeLista(primero.getAttribute('data-valor') || '');
          }
        }
      });
    }
    var bN = document.getElementById('btnNuevaEvaluacion');
    if (bN) bN.addEventListener('click', onNuevaEvaluacion);

    // §4.4: Open evaluation from table
    var evalsTable = document.getElementById('tabla-evals-proyecto');
    if (evalsTable) evalsTable.addEventListener('click', function (e) {
      var bAbrir = e.target.closest('.btn-abrir-eval');
      if (bAbrir) abrirEvaluacion(bAbrir.dataset.id);
    });
  }

  function bindZonaRiesgos() {
    var btnV1 = document.getElementById('btnVolverZona1');
    if (btnV1) btnV1.addEventListener('click', function () {
      scrollAZona1();
    });

    var panel = document.getElementById('riesgo-tab-panel');
    if (panel) panel.addEventListener('input', function (e) {
      var obs = e.target.closest('.obs-riesgo');
      if (obs) {
        var r = buscarRiesgo(obs.dataset.id);
        if (!r) return;
        r.observaciones = obs.value;
        return;
      }
      var ctrl = e.target.closest('.ctrl-riesgo');
      if (ctrl) {
        var r2 = buscarRiesgo(ctrl.dataset.id);
        if (!r2) return;
        r2.controlesPropuestos = ctrl.value;
      }
    });

    if (panel) panel.addEventListener('click', function (e) {
      var bG = e.target.closest('.btn-guardar');
      if (bG) {
        guardarResultado(bG.dataset.id);
        return;
      }
      var bV = e.target.closest('.btn-volver-matriz');
      if (bV) {
        guardarYVolver(bV.dataset.id);
        return;
      }
      var bT = e.target.closest('.btn-traza');
      if (bT) abrirTraza(bT.dataset.id);
      var bPDF = e.target.closest('.btn-pdf-lista');
      if (bPDF) {
        var rPDF = buscarRiesgo(bPDF.dataset.id);
        if (rPDF && typeof ReportesApp !== 'undefined' && ReportesApp.descargarListaCompletada) {
          ReportesApp.descargarListaCompletada(rPDF);
        }
      }
      var bPDFCampo = e.target.closest('.btn-pdf-campo');
      if (bPDFCampo) {
        var rCampo = buscarRiesgo(bPDFCampo.dataset.id);
        if (rCampo && typeof ReportesApp !== 'undefined' && ReportesApp.descargarListaCampo) {
          ReportesApp.descargarListaCampo(rCampo);
        }
      }
      var bIncluir = e.target.closest('.btn-incluir-riesgo');
      if (bIncluir) {
        reincluirRiesgo(bIncluir.dataset.id);
        return;
      }
      var bRe = e.target.closest('.btn-reincluir');
      if (bRe) {
        reincluirRiesgo(bRe.dataset.id);
        return;
      }
      var bEx = e.target.closest('.btn-excluir');
      if (bEx) {
        abrirJustificacion(bEx.dataset.id, false);
        return;
      }
      var bCheck = e.target.closest('.btn-checklist');
      if (bCheck) {
        abrirChecklistModal(bCheck.dataset.id);
        return;
      }
      var bNE = e.target.closest('.btn-ne');
      if (bNE) {
        abrirModalNE(bNE.dataset.id);
        return;
      }
      var bNC = e.target.closest('.btn-nc');
      if (bNC) {
        abrirModalNC(bNC.dataset.id);
        return;
      }
    });
    var bM = document.getElementById('btnGuardarRiesgoManual');
    if (bM) bM.addEventListener('click', guardarRiesgoManual);
    var bAM = document.getElementById('btnAgregarRiesgoManual');
    if (bAM) bAM.addEventListener('click', abrirFormAgregarRiesgo);
  }

  /* ============================================================
     §5.4 Justificación de exclusión
     ============================================================ */

  function abrirJustificacion(riesgoId, desdeCheck) {
    estado.justifRiesgoId = riesgoId;
    estado.justifPendiente = !!desdeCheck;
    var overlay = document.getElementById('modal-justif-overlay');
    if (overlay) overlay.classList.remove('oculto');
  }

  function cerrarJustificacion() {
    var overlay = document.getElementById('modal-justif-overlay');
    if (overlay) overlay.classList.add('oculto');
    // Si la exclusión quedó a la espera del motivo, se revierte el riesgo
    if (estado.justifPendiente) {
      var rP = estado.justifRiesgoId ? buscarRiesgo(estado.justifRiesgoId) : null;
      if (rP) {
        rP.incluido = true;
        rP.justificacionExclusion = '';
        registrarTraza(rP, 'Inclusión', 'Exclusión cancelada; el riesgo permanece incluido');
        if (estado.ev) guardarEvaluacion();
      }
    }
    estado.justifPendiente = false;
    estado.justifRiesgoId = '';
    var radios = document.querySelectorAll('input[name="justif-motivo"]');
    for (var i = 0; i < radios.length; i++) radios[i].checked = false;
    var txt = document.getElementById('justif-texto');
    if (txt) txt.value = '';
    actualizarResumen();
    actualizarEstadoGeneral();
    var activo = estado.riesgoActivo ? buscarRiesgo(estado.riesgoActivo) : null;
    if (activo) renderTabPanel(activo);
  }

  function guardarJustificacion() {
    var id = estado.justifRiesgoId;
    var r = buscarRiesgo(id);
    if (!r) return;
    var seleccionado = '';
    var radios = document.querySelectorAll('input[name="justif-motivo"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) seleccionado = radios[i].value;
    }
    if (!seleccionado) { alert('Seleccione un motivo de exclusión.'); return; }
    var txt = document.getElementById('justif-texto');
    var detalle = (txt ? txt.value.trim() : '');
    var justificacion = seleccionado + (detalle ? ' — ' + detalle : '');
    r.incluido = false;
    r.justificacionExclusion = justificacion;
    registrarTraza(r, 'Exclusión', 'Riesgo excluido: ' + justificacion);
    estado.justifPendiente = false;
    cerrarJustificacion();
    if (estado.ev) guardarEvaluacion();
    actualizarResumen();
    actualizarEstadoGeneral();
    var activo = buscarRiesgo(estado.riesgoActivo);
    if (activo) renderTabPanel(activo);
  }

  /** Incluye un riesgo desde la casilla de la matriz del numeral 3. */
  function incluirRiesgo(r) {
    r.incluido = true;
    r.justificacionExclusion = '';
    registrarTraza(r, 'Inclusión', 'Riesgo incluido en la evaluación');
    if (estado.ev) guardarEvaluacion();
    actualizarResumen();
    actualizarEstadoGeneral();
    if (r.id === estado.riesgoActivo) renderTabPanel(r);
  }

  /** §5.5 Reincluir riesgo. */
  function reincluirRiesgo(id) {
    var r = buscarRiesgo(id);
    if (!r) return;
    r.incluido = true;
    r.justificacionExclusion = '';
    registrarTraza(r, 'Re-inclusión', 'Riesgo re-incluido en la evaluación');
    if (estado.ev) guardarEvaluacion();
    estado.riesgoActivo = r.id;
    renderTabPanel(r);
    actualizarResumen();
    actualizarEstadoGeneral();
  }

  /** Vincula los controles dinámicos de la matriz; se vuelven a enlazar tras cada render del panel (numeral 3). */
  function bindResumenDinamico() {
    var btn = document.getElementById('btnOrdenarNR');
    if (btn) btn.addEventListener('click', function () {
      estado.ordenNR = (estado.ordenNR === 'desc') ? 'asc' : 'desc';
      btn.textContent = 'Ordenar por NR (' + (estado.ordenNR === 'desc' ? 'desc' : 'asc') + ')';
      actualizarResumen();
    });

    var fltNI = document.getElementById('filtroNI');
    if (fltNI) fltNI.addEventListener('change', function () {
      estado.filtroNI = fltNI.value;
      actualizarResumen();
    });

    var fltTxt = document.getElementById('filtroTexto');
    if (fltTxt) fltTxt.addEventListener('input', function () {
      estado.filtroTexto = fltTxt.value.trim();
      actualizarResumen();
    });

    var inc = document.getElementById('chkIncompletos');
    if (inc) inc.addEventListener('change', function () {
      estado.soloIncompletos = inc.checked;
      actualizarResumen();
    });

    // §5.5 Select all / deselect all
    var btnSelTodos = document.getElementById('btnSeleccionarTodos');
    if (btnSelTodos) btnSelTodos.addEventListener('click', function () {
      if (!estado.riesgos.length) return;
      estado.riesgos.forEach(function (r) {
        r.incluido = true;
        r.justificacionExclusion = '';
      });
      if (estado.ev) guardarEvaluacion();
      actualizarResumen();
      actualizarEstadoGeneral();
      renderTabPanel(buscarRiesgo(estado.riesgoActivo));
    });

    var btnDesTodos = document.getElementById('btnDesmarcarTodos');
    if (btnDesTodos) btnDesTodos.addEventListener('click', function () {
      if (!estado.riesgos.length) return;
      estado.riesgos.forEach(function (r) {
        r.incluido = false;
        if (!r.justificacionExclusion) r.justificacionExclusion = '';
      });
      if (estado.ev) guardarEvaluacion();
      actualizarResumen();
      actualizarEstadoGeneral();
      renderTabPanel(buscarRiesgo(estado.riesgoActivo));
    });

    // §5.5 Select all checkbox in header
    var chkAll = document.getElementById('chkTodosIncluir');
    if (chkAll) chkAll.addEventListener('change', function () {
      var val = chkAll.checked;
      estado.riesgos.forEach(function (r) { r.incluido = val; if (!val) r.justificacionExclusion = ''; });
      if (estado.ev) guardarEvaluacion();
      actualizarResumen();
      actualizarEstadoGeneral();
      renderTabPanel(buscarRiesgo(estado.riesgoActivo));
    });

    // Eventos de la tabla del bloque 2 (las acciones se delegan en el panel)
    var tabla = document.querySelector('#tabla-resumen tbody');
    if (tabla) {
      // Cambio en el desplegable de riesgo: asigna el riesgo y abre su cuestionario
      tabla.addEventListener('change', function (e) {
        var sel = e.target.closest('.sel-riesgo');
        if (!sel) return;
        seleccionarRiesgo(sel.value, +sel.dataset.idx);
      });
    }

    // Botones de descarga del numeral 4 (Determinación de estrategias de control ART)
    if (typeof ReportesApp !== 'undefined') {
      var dP = document.getElementById('btnDescargarPDF');
      if (dP) dP.addEventListener('click', ReportesApp.descargarART);
      var dA3 = document.getElementById('btnART_A3');
      if (dA3 && ReportesApp.descargarART_A3) dA3.addEventListener('click', ReportesApp.descargarART_A3);
      var dPrev = document.getElementById('btnARTPreview');
      if (dPrev && ReportesApp.vistaPreviaART) dPrev.addEventListener('click', ReportesApp.vistaPreviaART);
      var dX = document.getElementById('btnExportarExcel');
      if (dX) dX.addEventListener('click', ReportesApp.exportarExcel);
      var dC = document.getElementById('btnExportarCSV');
      if (dC) dC.addEventListener('click', ReportesApp.exportarCSV);
      var dJ = document.getElementById('btnExportarJSON');
      if (dJ) dJ.addEventListener('click', ReportesApp.exportarJSON);
    }
  }

  function bindModal() {
    var c1 = document.getElementById('traza-cerrar');
    if (c1) c1.addEventListener('click', cerrarTraza);
    var c2 = document.getElementById('traza-cerrar2');
    if (c2) c2.addEventListener('click', cerrarTraza);
    var overlay = document.getElementById('modal-traza-overlay');
    if (overlay) overlay.addEventListener('click', function (e) {
      if (e.target === overlay) cerrarTraza();
    });

    // Modal de cuestionario
    var ckCerrar = document.getElementById('checklist-cerrar');
    if (ckCerrar) ckCerrar.addEventListener('click', cerrarChecklistModal);
    var ckCancelar = document.getElementById('checklist-cancelar');
    if (ckCancelar) ckCancelar.addEventListener('click', cerrarChecklistModal);
    var ckGuardar = document.getElementById('checklist-guardar');
    if (ckGuardar) ckGuardar.addEventListener('click', guardarChecklistModal);
    var ckOverlay = document.getElementById('modal-checklist-overlay');
    if (ckOverlay) {
      ckOverlay.addEventListener('click', function (e) {
        if (e.target === ckOverlay) { cerrarChecklistModal(); return; }
        var legal = e.target.closest('.q-legal-toggle');
        if (legal) {
          var td = legal.closest('.q-legal');
          var det = td ? td.querySelector('.q-legal-detalle') : null;
          if (det) {
            var activo = !det.classList.contains('oculto');
            det.classList.toggle('oculto', activo);
            legal.textContent = activo ? 'Ver requisito legal' : 'Ocultar requisito legal';
          }
          return;
        }
        if (e.target.closest('.ck-marcar-no')) { marcarTodosModal('no'); return; }
        if (e.target.closest('.ck-marcar-na')) { marcarTodosModal('na'); return; }
        if (e.target.closest('.ck-limpiar')) {
          estado.checklistLimpio = true;
          document.querySelectorAll('#checklist-contenido input[type="radio"]').forEach(function (radio) {
            radio.checked = false;
          });
          document.querySelectorAll('#checklist-contenido tbody tr').forEach(function (tr) {
            tr.classList.remove('fila-si', 'fila-no', 'fila-na');
          });
          actualizarNdModal();
        }
      });
      ckOverlay.addEventListener('change', function (e) {
        var radio = e.target.closest('input[type="radio"]');
        if (!radio) return;
        var tr = radio.closest('tr');
        if (tr) {
          tr.classList.remove('fila-si', 'fila-no', 'fila-na');
          tr.classList.add('fila-' + radio.value);
          tr.style.background = '';
        }
        actualizarNdModal();
      });
    }

/** Refresca la tabla de resultados ND del modal sin guardar. */
    function actualizarNdModal() {
      var r = buscarRiesgo(estado.riesgoActivo);
      if (!r) return;
      var mapa = {};
      var dom = document.querySelectorAll('#checklist-contenido input[type="radio"]:checked');
      for (var i = 0; i < dom.length; i++) {
        mapa[dom[i].dataset.n] = dom[i].value;
      }
      var previas = r.respuestas || {};
      var combined = {};
      var k;
      if (!estado.checklistLimpio) {
        for (k in previas) { if (previas.hasOwnProperty(k)) combined[k] = previas[k]; }
      }
      for (k in mapa) { if (mapa.hasOwnProperty(k)) combined[k] = mapa[k]; }
      r.respuestas = combined;
      var res = resultadoDe(r);
      var info = document.getElementById('nd-info-' + r.id);
      if (info) info.innerHTML = renderNDInfoHtml(r, res);
      r.respuestas = previas;
    }

    // Modal NE
    var neCerrar = document.getElementById('ne-cerrar');
    if (neCerrar) neCerrar.addEventListener('click', cerrarModalNE);
    var neCancelar = document.getElementById('ne-cancelar');
    if (neCancelar) neCancelar.addEventListener('click', cerrarModalNE);
    var neGuardar = document.getElementById('ne-guardar');
    if (neGuardar) neGuardar.addEventListener('click', guardarModalNE);
    var neOverlay = document.getElementById('modal-ne-overlay');
    if (neOverlay) neOverlay.addEventListener('click', function (e) {
      if (e.target === neOverlay) cerrarModalNE();
    });

    // Modal NC
    var ncCerrar = document.getElementById('nc-cerrar');
    if (ncCerrar) ncCerrar.addEventListener('click', cerrarModalNC);
    var ncCancelar = document.getElementById('nc-cancelar');
    if (ncCancelar) ncCancelar.addEventListener('click', cerrarModalNC);
    var ncGuardar = document.getElementById('nc-guardar');
    if (ncGuardar) ncGuardar.addEventListener('click', guardarModalNC);
    var ncOverlay = document.getElementById('modal-nc-overlay');
    if (ncOverlay) ncOverlay.addEventListener('click', function (e) {
      if (e.target === ncOverlay) cerrarModalNC();
    });

    // Botón agregar riesgo
    var btnAgregar = document.getElementById('btnAgregarRiesgo');
    if (btnAgregar) btnAgregar.addEventListener('click', agregarRiesgoFila);

    // §5.4 Justificación modal
    var jC = document.getElementById('justif-cerrar');
    if (jC) jC.addEventListener('click', cerrarJustificacion);
    var jCancel = document.getElementById('justif-cancelar');
    if (jCancel) jCancel.addEventListener('click', cerrarJustificacion);
    var jSave = document.getElementById('justif-guardar');
    if (jSave) jSave.addEventListener('click', guardarJustificacion);
    var jOverlay = document.getElementById('modal-justif-overlay');
    if (jOverlay) jOverlay.addEventListener('click', function (e) {
      if (e.target === jOverlay) cerrarJustificacion();
    });

    // §2 Crear proyecto modal
    var bCP1 = document.getElementById('btnCrearProyecto');
    if (bCP1) bCP1.addEventListener('click', abrirModalProyecto);
    var bCP2 = document.getElementById('btnCrearProyecto2');
    if (bCP2) bCP2.addEventListener('click', abrirModalProyecto);
    var pC = document.getElementById('proyecto-cerrar');
    if (pC) pC.addEventListener('click', cerrarModalProyecto);
    var pCancel = document.getElementById('proyecto-cancelar');
    if (pCancel) pCancel.addEventListener('click', cerrarModalProyecto);
    var pSave = document.getElementById('proyecto-guardar');
    if (pSave) pSave.addEventListener('click', guardarNuevoProyecto);
    var pOverlay = document.getElementById('modal-proyecto-overlay');
    if (pOverlay) pOverlay.addEventListener('click', function (e) {
      if (e.target === pOverlay) cerrarModalProyecto();
    });

    // §8 Unified matrix tab
    var selProy = document.getElementById('selProyectoUnificado');
    if (selProy) selProy.addEventListener('change', renderMatrizUnificada);
    var uTable = document.querySelector('#tabla-unificada tbody');
    if (uTable) uTable.addEventListener('click', function (e) {
      var bAbrir = e.target.closest('.btn-abrir-eval');
      if (bAbrir) abrirEvaluacion(bAbrir.dataset.id);
    });

    // §10 Export unified matrix
    if (typeof ReportesApp !== 'undefined') {
      var dUP = document.getElementById('btnExportarUnificadoPDF');
      if (dUP) dUP.addEventListener('click', function () { if (ReportesApp.exportarUnificadoPDF) ReportesApp.exportarUnificadoPDF(); });
      var dUPrint = document.getElementById('btnImprimirUnificado');
      if (dUPrint) dUPrint.addEventListener('click', function () { if (ReportesApp.imprimirUnificado) ReportesApp.imprimirUnificado(); });
      var dUE = document.getElementById('btnExportarUnificadoExcel');
      if (dUE) dUE.addEventListener('click', function () { if (ReportesApp.exportarUnificadoExcel) ReportesApp.exportarUnificadoExcel(); });
      var dUC = document.getElementById('btnExportarUnificadoCSV');
      if (dUC) dUC.addEventListener('click', function () { if (ReportesApp.exportarUnificadoCSV) ReportesApp.exportarUnificadoCSV(); });
    }
    var bVerUnif = document.getElementById('btnVerMatrizUnificada');
    if (bVerUnif) bVerUnif.addEventListener('click', verMatrizUnificada);
    var bVincular = document.getElementById('btnVincularMatriz');
    if (bVincular) bVincular.addEventListener('click', function () {
      if (vincularMatriz()) {
        var zona = document.getElementById('matriz-unificada-contenido');
        if (zona) zona.scrollIntoView({ block: 'start' });
      }
    });
    var bInicializar = document.getElementById('btnInicializarMatriz');
    if (bInicializar) bInicializar.addEventListener('click', inicializarMatriz);
    actualizarEstadoVinculo();
  }

  /* ============================================================
     §8 Matriz unificada y análisis estadístico
     ============================================================ */

  function poblarProyectosUnificados() {
    var sel = document.getElementById('selProyectoUnificado');
    if (!sel) return;
    /* Se conserva el proyecto activo: al cambiar de pestaña se repuebla el
       selector y, sin esto, la matriz quedaría vacía. */
    var previo = sel.value;
    var proyectos = DBApp.proyectosExistentes();
    var html = '<option value="">-- Seleccione proyecto --</option>';
    proyectos.forEach(function (p) {
      html += '<option value="' + escAttr(p.nombre) + '||' + escAttr(p.tipo) + '">' + esc(p.nombre) + ' (' + esc(p.tipo) + ')</option>';
    });
    sel.innerHTML = html;
    if (previo && Array.prototype.some.call(sel.options, function (o) { return o.value === previo; })) {
      sel.value = previo;
    }
  }

    /** Apunta la matriz consolidada a un proyecto concreto. Con datos los muestra; si el
      proyecto es nuevo, la matriz queda vinculada pero vacía: nunca conserva la del
      proyecto anterior. */
  function apuntarMatrizAProyecto(nombre, tipo) {
    var sel = document.getElementById('selProyectoUnificado');
    estado.matrizVinculada = true;
    if (!nombre || !tipo) {
      if (sel) sel.value = '';
      renderMatrizUnificada();
      return;
    }
    poblarProyectosUnificados();
    if (!sel) { renderMatrizUnificada(); return; }
    var valor = identidadProyecto(nombre, tipo);
    if (!Array.prototype.some.call(sel.options, function (o) { return o.value === valor; })) {
      sel.innerHTML += '<option value="' + escAttr(valor) + '">' + esc(nombre) + ' (' + esc(tipo) + ')</option>';
    }
    sel.value = valor;
    renderMatrizUnificada();
  }

  /** Vincula la matriz consolidada al proyecto identificado en el numeral 2. */
  function vincularMatriz() {
    if (!estado.tipoProyecto || !estado.proyecto) {
      window.alert('Identifique el proyecto (numeral 1) antes de vincular la matriz.');
      return false;
    }
    apuntarMatrizAProyecto(estado.proyecto, estado.tipoProyecto);
    return true;
  }

  /** Deja la matriz consolidada en blanco y corta el vínculo con el numeral 2.
      No borra ninguna evaluación: solo descarta la vista acumulada. */
  function inicializarMatriz() {
    if (!confirm('Se inicializará la matriz consolidada: quedará en blanco y dejará de seguir al proyecto del numeral 2. Las evaluaciones guardadas no se borran. ¿Continuar?')) {
      return;
    }
    estado.matrizVinculada = false;
    var sel = document.getElementById('selProyectoUnificado');
    if (sel) sel.value = '';
    renderMatrizUnificada();
    var zona = document.getElementById('matriz-unificada-vacio');
    if (zona) zona.scrollIntoView({ block: 'center' });
  }

  /** Refleja el estado del vínculo en el aviso de la pestaña. */
  function actualizarEstadoVinculo() {
    var nota = document.getElementById('estadoVinculoMatriz');
    if (!nota) return;
    var sel = document.getElementById('selProyectoUnificado');
    if (!estado.matrizVinculada) {
      nota.className = 'nota vinculo vinculo-off';
      nota.innerHTML = '<b>Matriz inicializada.</b> No está vinculada al numeral 2: los riesgos que ' +
        'agregue allí no se consolidarán aquí hasta que pulse <b>Vincular al proyecto del numeral 2</b>.';
      return;
    }
    var proyecto = estado.proyecto || (sel && sel.value ? sel.value.split('||')[0] : '');
    if (!proyecto) {
      nota.className = 'nota vinculo vinculo-off';
      nota.innerHTML = '<b>Vinculada</b>, pero todavía no hay un proyecto identificado en el numeral 1.';
      return;
    }
    nota.className = 'nota vinculo vinculo-on';
    nota.innerHTML = '<b>Vinculada al numeral 2</b> · proyecto «' + esc(proyecto) + '». ' +
      'Cada riesgo que agregue o evalúe en el numeral 2 se replica aquí, clasificado por ' +
      'proceso constructivo, junto con el análisis estadístico.';
  }

  /** Agrupa los resultados de la matriz unificada por proceso constructivo,
      conservando el orden en que se registró cada evaluación. */
  function agruparPorProceso(resultados) {
    var grupos = [];
    var porNombre = {};
    resultados.forEach(function (item) {
      var proc = item.f.procesoConstructivo || 'Sin proceso';
      if (!porNombre[proc]) {
        porNombre[proc] = { proceso: proc, items: [], evIds: [] };
        grupos.push(porNombre[proc]);
      }
      porNombre[proc].items.push(item);
      if (porNombre[proc].evIds.indexOf(item.f.evId) === -1) porNombre[proc].evIds.push(item.f.evId);
    });
    return grupos;
  }

  function renderMatrizUnificada() {
    var sel = document.getElementById('selProyectoUnificado');
    if (!sel) return;
    var val = sel.value;
    var contenido = document.getElementById('matriz-unificada-contenido');
    var vacio = document.getElementById('matriz-unificada-vacio');
    if (!val) {
      if (contenido) contenido.classList.add('oculto');
      if (vacio) vacio.classList.remove('oculto');
      /* Matriz en blanco de verdad: sin filas, sin estadísticas y sin gráficos
         dibujados, para no dejar datos de la vista anterior. */
      var tbodyVacio = document.querySelector('#tabla-unificada tbody');
      if (tbodyVacio) tbodyVacio.innerHTML = '';
      var statsVacio = document.getElementById('stats-tabla-procesos');
      if (statsVacio) statsVacio.innerHTML = '';
      ['chart-riesgos-proceso', 'chart-nr-promedio', 'chart-ni-distribucion',
        'chart-riesgos-criticos', 'chart-matriz-calor'].forEach(function (id) {
        var cv = document.getElementById(id);
        if (cv && cv.getContext) cv.getContext('2d').clearRect(0, 0, cv.width, cv.height);
      });
      actualizarEstadoVinculo();
      return;
    }
    var partes = val.split('||');
    var nombreProyecto = partes[0] || '';
    var tipoProyecto = partes[1] || '';

    actualizarEstadoVinculo();

    var evals = DBApp.listarEvaluacionesDeProyecto(nombreProyecto, tipoProyecto);
    var filasMatriz = [];
    evals.forEach(function (ev) {
      var riesgos = ev.riesgos || {};
      Object.keys(riesgos).forEach(function (rid) {
        var g = riesgos[rid];
        if (g.incluido === false) return;
        filasMatriz.push({
          evId: ev.id,
          tipo: ev.tipoProyecto,
          proyecto: ev.proyecto || '—',
          procesoConstructivo: ev.proceso || '—',
          nombre: g.nombre || rid,
          codigo: g.codigo || '',
          sheet: g.sheet || '',
          respuestas: g.respuestas || {},
          ne: g.ne,
          nc: g.nc
        });
      });
    });

    /* Mismo motor y mismo catálogo efectivo que el numeral 2 */
    var resultados = filasMatriz.map(function (f) {
      var calc = resultadoDeGuardado(f);
      return { f: f, res: calc.res, completo: calc.completo };
    });

    // Populate table: agrupado por proceso constructivo
    var tbody = document.querySelector('#tabla-unificada tbody');
    if (tbody) {
      var html = '';
      if (!resultados.length) {
        html = '<tr><td colspan="13" class="nota" style="text-align:center">No hay riesgos incluidos en las evaluaciones de este proyecto.</td></tr>';
      } else {
        var procesos = agruparPorProceso(resultados);
        procesos.forEach(function (grupo) {
          var n = grupo.items.length;
          var ndSuma = 0, nCompletos = 0;
          var npSuma = 0, nrSuma = 0;
          var niCont = { I: 0, II: 0, III: 0, IV: 0 };
          grupo.items.forEach(function (it) {
            ndSuma += it.res.nd;
            /* Los promedios de NP y NR solo pueden promediar riesgos con NE y NC:
               sin ellos el motor trabaja con 1 y las medias saldrían falseadas. */
            if (!it.completo) return;
            nCompletos++;
            npSuma += it.res.np;
            nrSuma += it.res.nr;
            niCont[it.res.ni.ni] = (niCont[it.res.ni.ni] || 0) + 1;
          });
          var ndProm = n ? ndSuma / n : 0;
          var npProm = nCompletos ? npSuma / nCompletos : null;
          var nrProm = nCompletos ? nrSuma / nCompletos : null;
          var media = function (v) { return v == null ? '—' : NTP330.fmt(v); };
          html += '<tr class="fila-grupo">';
          html += '<td colspan="5"><span class="grupo-nombre">' + esc(grupo.proceso) + '</span>' +
            ' <span class="grupo-meta">· ' + n + (n === 1 ? ' riesgo' : ' riesgos') + '</span></td>';
          html += '<td class="grupo-meta">' + media(ndProm) + '</td>';
          html += '<td class="grupo-meta">—</td>';
          html += '<td class="grupo-meta">' + media(npProm) + '</td>';
          html += '<td class="grupo-meta">—</td>';
          html += '<td class="grupo-total">' + media(nrProm) + '</td>';
          html += '<td class="grupo-meta">I ' + (niCont.I || 0) + ' · II ' + (niCont.II || 0) +
            ' · III ' + (niCont.III || 0) + ' · IV ' + (niCont.IV || 0) + '</td>';
          html += '<td class="grupo-meta">' + nCompletos + ' / ' + n + ' completos</td>';
          html += '<td class="grupo-meta">' + grupo.evIds.length + (grupo.evIds.length === 1 ? ' evaluación' : ' evaluaciones') + '</td>';
          html += '</tr>';

          grupo.items.forEach(function (item) {
            var f = item.f, res = item.res;
            html += '<tr>';
            html += '<td>' + esc(f.evId) + '</td>';
            html += '<td>' + esc(f.tipo) + '</td>';
            html += '<td>' + esc(f.proyecto) + '</td>';
            html += '<td>' + esc(f.procesoConstructivo) + '</td>';
            html += '<td style="text-align:left"><b>' + esc(f.nombre) + '</b>' +
              (f.codigo ? ' <span class="grupo-meta">(' + esc(f.codigo) + ')</span>' : '') + '</td>';
            html += '<td class="celda-numerica">' + NTP330.fmt(res.nd) + '</td>';
            html += '<td>' + (f.ne && f.ne.valor ? res.ne.valor : '') + '</td>';
            html += '<td>' + (item.completo ? NTP330.fmt(res.np) : '—') + '</td>';
            html += '<td>' + (f.nc && f.nc.valor ? res.nc.valor : '') + '</td>';
            html += '<td><b>' + (item.completo ? NTP330.fmt(res.nr) : '—') + '</b></td>';
            html += '<td>' + (item.completo ? chipNI(res.ni) : '') + '</td>';
            html += '<td>' + chipEstado(res.estado) + '</td>';
            html += '<td><button type="button" class="btn btn-secundario btn-sm btn-abrir-eval" data-id="' + escAttr(f.evId) + '">Abrir</button></td>';
            html += '</tr>';
          });
        });
      }
      tbody.innerHTML = html;
    }

    if (contenido) contenido.classList.remove('oculto');
    if (vacio) vacio.classList.add('oculto');

    // §9 Statistics
    renderEstadisticas(resultados);
  }

  /* ============================================================
     §9 Análisis estadístico por proceso constructivo
     ============================================================ */

  function renderEstadisticas(resultados) {
    var porProceso = {};
    resultados.forEach(function (item) {
      var proc = item.f.procesoConstructivo || 'Sin proceso';
      if (!porProceso[proc]) porProceso[proc] = [];
      /* Solo cuentan los riesgos con NE y NC elegidos: un riesgo a medio evaluar
         tiene NR artificialmente bajo y no puede clasificarse en un nivel de
         intervención. Es el mismo criterio con el que la tabla oculta la sigla NI. */
      porProceso[proc].push({
        res: item.res,
        completo: item.completo
      });
    });

    var tablaCont = document.getElementById('stats-tabla-procesos');
    if (!tablaCont) return;

    var procesos = Object.keys(porProceso);
    if (!procesos.length) {
      tablaCont.innerHTML = '<p class="nota">No hay datos suficientes para análisis estadístico.</p>';
      dibujarGraficoRiesgosCriticos([]);
      dibujarGraficoMatrizCalor([]);
      return;
    }

    var html = '<table class="tabla-riesgos"><thead><tr>';
    html += '<th>Proceso constructivo</th><th>Riesgos evaluados</th><th>NR promedio</th><th>NR máximo</th>';
    html += '<th>Nivel I</th><th>Nivel II</th><th>Nivel III</th><th>Nivel IV</th></tr></thead><tbody>';

    var datosGrafico1 = [];
    var datosGrafico2 = [];
    var datosGrafico3 = { I: 0, II: 0, III: 0, IV: 0 };
    var datosCriticos = [];
    var datosCalor = {};

    procesos.forEach(function (proc) {
      var riesgos = porProceso[proc];
      var n = riesgos.length;
      var nrSuma = 0, nrMax = 0;
      var niCont = { I: 0, II: 0, III: 0, IV: 0 };
      var criticos = 0;
      riesgos.forEach(function (it) {
        if (!it.completo) return;
        nrSuma += it.res.nr;
        if (it.res.nr > nrMax) nrMax = it.res.nr;
        niCont[it.res.ni.ni] = (niCont[it.res.ni.ni] || 0) + 1;
        datosGrafico3[it.res.ni.ni] = (datosGrafico3[it.res.ni.ni] || 0) + 1;
        if (it.res.ni.ni === 'I' || it.res.ni.ni === 'II') criticos++;
        var clave = it.res.ndCls.sigla + '|' + it.res.npCls.sigla;
        datosCalor[clave] = (datosCalor[clave] || 0) + 1;
      });
      var nCompletos = (niCont.I || 0) + (niCont.II || 0) + (niCont.III || 0) + (niCont.IV || 0);
      var nrProm = nCompletos ? Math.round((nrSuma / nCompletos) * 100) / 100 : 0;
      datosGrafico1.push({ nombre: proc, total: n });
      datosGrafico2.push({ nombre: proc, promedio: nrProm });
      datosCriticos.push({ nombre: proc, criticos: criticos, total: nCompletos });

      html += '<tr>';
      html += '<td style="text-align:left"><b>' + esc(proc) + '</b></td>';
      html += '<td>' + nCompletos + (nCompletos === n ? '' : ' / ' + n) + '</td>';
      html += '<td>' + NTP330.fmt(nrProm) + '</td>';
      html += '<td><b>' + NTP330.fmt(nrMax) + '</b></td>';
      html += '<td class="ni-I">' + (niCont.I || 0) + '</td>';
      html += '<td class="ni-II">' + (niCont.II || 0) + '</td>';
      html += '<td class="ni-III">' + (niCont.III || 0) + '</td>';
      html += '<td class="ni-IV">' + (niCont.IV || 0) + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    tablaCont.innerHTML = html;

    var listaCalor = Object.keys(datosCalor).map(function (clave) {
      var partes = clave.split('|');
      return { nd: partes[0], np: partes[1], total: datosCalor[clave] };
    });
    listaCalor.sort(function (a, b) { return b.total - a.total; });

    // Charts
    dibujarGraficoRiesgosPorProceso(datosGrafico1);
    dibujarGraficoNRPromedio(datosGrafico2);
    dibujarGraficoNIDistribucion(datosGrafico3);
    dibujarGraficoRiesgosCriticos(datosCriticos);
    dibujarGraficoMatrizCalor(listaCalor);
  }

  /* Los gráficos de canvas no heredan el CSS, así que se leen los tokens de
     la hoja de estilos: el tema sigue teniendo una sola fuente de verdad. */
  function tokensTema() {
    var cs = getComputedStyle(document.documentElement);
    var leer = function (n, d) { var v = cs.getPropertyValue(n); return (v && v.trim()) || d; };
    return {
      tinta: leer('--tinta', '#262626'),
      acento: leer('--acento', '#006e49'),
      alerta: leer('--rojo', '#c0242a'),
      linea: leer('--linea', '#e0e0e0'),
      ni: {
        I: leer('--ni-I', '#8c1a1f'),
        II: leer('--ni-II', '#c0242a'),
        III: leer('--ni-III', '#006e49'),
        IV: leer('--ni-IV', '#497f64')
      },
      fuente: getComputedStyle(document.body).fontFamily
    };
  }

  function dibujarGraficoRiesgosPorProceso(datos) {
    var canvas = document.getElementById('chart-riesgos-proceso');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (!datos.length) return;
    var tema = tokensTema();
    var maxVal = Math.max.apply(null, datos.map(function (d) { return d.total; }));
    var barW = Math.min(60, Math.floor((w - 60) / datos.length) - 10);
    var chartH = h - 60;
    var startX = 50;

    ctx.fillStyle = tema.tinta;
    ctx.font = '12px ' + tema.fuente;
    ctx.textAlign = 'center';
    ctx.fillText('Riesgos por proceso constructivo', w / 2, 16);

    datos.forEach(function (d, i) {
      var x = startX + i * (barW + 10);
      var barH = maxVal > 0 ? (d.total / maxVal) * chartH : 0;
      var y = chartH - barH + 20;
      ctx.fillStyle = tema.acento;
      ctx.fillRect(x, y, barW, barH);
      ctx.fillStyle = tema.tinta;
      ctx.font = '10px ' + tema.fuente;
      ctx.textAlign = 'center';
      ctx.fillText(d.total, x + barW / 2, y - 4);
      ctx.save();
      ctx.translate(x + barW / 2, chartH + 35);
      ctx.rotate(-Math.PI / 6);
      ctx.textAlign = 'right';
      ctx.fillText(d.nombre.substring(0, 15), 0, 0);
      ctx.restore();
    });

    ctx.strokeStyle = tema.linea;
    ctx.beginPath();
    ctx.moveTo(startX, 20);
    ctx.lineTo(startX, chartH + 20);
    ctx.lineTo(w - 10, chartH + 20);
    ctx.stroke();
  }

  function dibujarGraficoNRPromedio(datos) {
    var canvas = document.getElementById('chart-nr-promedio');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (!datos.length) return;
    var tema = tokensTema();
    var maxVal = Math.max.apply(null, datos.map(function (d) { return d.promedio; }));
    var barW = Math.min(60, Math.floor((w - 60) / datos.length) - 10);
    var chartH = h - 60;
    var startX = 50;

    ctx.fillStyle = tema.tinta;
    ctx.font = '12px ' + tema.fuente;
    ctx.textAlign = 'center';
    ctx.fillText('NR promedio por proceso', w / 2, 16);

    datos.forEach(function (d, i) {
      var x = startX + i * (barW + 10);
      var barH = maxVal > 0 ? (d.promedio / maxVal) * chartH : 0;
      var y = chartH - barH + 20;
      ctx.fillStyle = tema.alerta;
      ctx.fillRect(x, y, barW, barH);
      ctx.fillStyle = tema.tinta;
      ctx.font = '10px ' + tema.fuente;
      ctx.textAlign = 'center';
      ctx.fillText(NTP330.fmt(d.promedio), x + barW / 2, y - 4);
      ctx.save();
      ctx.translate(x + barW / 2, chartH + 35);
      ctx.rotate(-Math.PI / 6);
      ctx.textAlign = 'right';
      ctx.fillText(d.nombre.substring(0, 15), 0, 0);
      ctx.restore();
    });

    ctx.strokeStyle = tema.linea;
    ctx.beginPath();
    ctx.moveTo(startX, 20);
    ctx.lineTo(startX, chartH + 20);
    ctx.lineTo(w - 10, chartH + 20);
    ctx.stroke();
  }

  function dibujarGraficoNIDistribucion(contador) {
    var canvas = document.getElementById('chart-ni-distribucion');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    var total = (contador.I || 0) + (contador.II || 0) + (contador.III || 0) + (contador.IV || 0);
    if (total === 0) return;
    var tema = tokensTema();
    var colores = tema.ni;
    var labels = { I: 'Nivel I (Crítico)', II: 'Nivel II', III: 'Nivel III', IV: 'Nivel IV' };
    var order = ['I', 'II', 'III', 'IV'];
    var pieR = Math.min(w, h) / 2 - 40;
    var cx = w / 2 - 40, cy = h / 2;
    var startAngle = -Math.PI / 2;

    ctx.fillStyle = tema.tinta;
    ctx.font = '12px ' + tema.fuente;
    ctx.textAlign = 'center';
    ctx.fillText('Distribución de niveles de intervención', w / 2, 16);

    order.forEach(function (ni) {
      var val = contador[ni] || 0;
      if (val === 0) return;
      var slice = (val / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, pieR, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = colores[ni];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      startAngle += slice;
    });

    var legendX = w - 100, legendY = 40;
    order.forEach(function (ni) {
      ctx.fillStyle = colores[ni];
      ctx.fillRect(legendX, legendY, 12, 12);
      ctx.fillStyle = tema.tinta;
      ctx.font = '10px ' + tema.fuente;
      ctx.textAlign = 'left';
      ctx.fillText(labels[ni] + ': ' + (contador[ni] || 0), legendX + 18, legendY + 10);
      legendY += 18;
    });
  }

  /** Riesgos que exigen intervención inmediata o próxima (NI I y II) por proceso. */
  function dibujarGraficoRiesgosCriticos(datos) {
    var canvas = document.getElementById('chart-riesgos-criticos');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    var total = (datos || []).reduce(function (s, d) { return s + d.criticos; }, 0);
    if (!total) return;
    var tema = tokensTema();
    var colores = { I: tema.ni.I, II: tema.ni.II };

    ctx.fillStyle = tema.tinta;
    ctx.font = '12px ' + tema.fuente;
    ctx.textAlign = 'center';
    ctx.fillText('Riesgos críticos (NI I y II)', w / 2, 16);

    var izq = 30, arriba = 40, ancho = w - 50, alto = h - arriba - 20;
    var maximo = Math.max.apply(null, datos.map(function (d) { return d.criticos; }));
    var n = datos.length;
    var paso = n ? ancho / n : ancho;
    var anchoBarra = Math.max(8, Math.min(46, paso - 10));

    ctx.strokeStyle = tema.linea;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(izq, arriba);
    ctx.lineTo(izq, arriba + alto);
    ctx.lineTo(izq + ancho, arriba + alto);
    ctx.stroke();

    datos.forEach(function (d, i) {
      var x = izq + paso * i + (paso - anchoBarra) / 2;
      var bh = maximo ? (d.criticos / maximo) * (alto - 10) : 0;
      ctx.fillStyle = d.criticos ? tema.alerta : tema.linea;
      ctx.fillRect(x, arriba + alto - bh, anchoBarra, bh);
      ctx.fillStyle = tema.tinta;
      ctx.font = 'bold 10px ' + tema.fuente;
      ctx.textAlign = 'center';
      if (d.criticos) ctx.fillText(String(d.criticos), x + anchoBarra / 2, arriba + alto - bh - 3);
      ctx.font = '9px ' + tema.fuente;
      ctx.fillStyle = tema.tinta;
      ctx.fillText(recortar(d.nombre, 12), x + anchoBarra / 2, arriba + alto + 12);
    });

    ctx.textAlign = 'left';
    ctx.fillStyle = tema.alerta;
    ctx.font = '10px ' + tema.fuente;
    ctx.fillText('Total críticos: ' + total, izq, h - 6);
  }

  /** Matriz de calor con la frecuencia de cada combinación de bandas ND × NP. */
  function dibujarGraficoMatrizCalor(datos) {
    var canvas = document.getElementById('chart-matriz-calor');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (!datos || !datos.length) return;
    var tema = tokensTema();

    var bandasND = ['MD', 'D', 'M', 'B'];
    var bandasNP = ['MA', 'A', 'M', 'B'];
    var m = {};
    var maximo = 0;
    datos.forEach(function (d) { m[d.nd + '|' + d.np] = d.total; if (d.total > maximo) maximo = d.total; });

    ctx.fillStyle = tema.tinta;
    ctx.font = '12px ' + tema.fuente;
    ctx.textAlign = 'center';
    ctx.fillText('Matriz de calor ND × NP', w / 2, 16);

    var izquierda = 58, arriba = 46, ancho = w - izquierda - 20, alto = h - arriba - 40;
    var celdaW = ancho / 4, celdaH = alto / 4;

    /* Filas = bandas de ND, columnas = bandas de NP */
    ctx.font = '9px ' + tema.fuente;
    for (var r = 0; r < 4; r++) {
      for (var c = 0; c < 4; c++) {
        var val = m[bandasND[r] + '|' + bandasNP[c]] || 0;
        var x = izquierda + c * celdaW, y = arriba + r * celdaH;
        var relleno = val ? tema.acento : tema.linea;
        if (val && maximo > 1) {
          /* La intensidad se modula con el canal rojo del tema, sin salir de la paleta */
          var k = val / maximo;
          relleno = 'rgba(' + rgbDe(tema.acento) + ', ' + (0.25 + 0.75 * k) + ')';
        }
        ctx.fillStyle = relleno;
        ctx.fillRect(x, y, celdaW - 1, celdaH - 1);
        ctx.fillStyle = val ? '#fff' : tema.tinta;
        ctx.font = (val ? 'bold ' : '') + '10px ' + tema.fuente;
        ctx.textAlign = 'center';
        ctx.fillText(val ? String(val) : '·', x + celdaW / 2 - 0.5, y + celdaH / 2 + 4);
      }
    }

    ctx.font = '9px ' + tema.fuente;
    ctx.fillStyle = tema.tinta;
    for (var i = 0; i < 4; i++) {
      ctx.textAlign = 'center';
      ctx.fillText(bandasNP[i], izquierda + i * celdaW + celdaW / 2 - 0.5, arriba - 6);
      ctx.textAlign = 'right';
      ctx.fillText(bandasND[i], izquierda - 5, arriba + i * celdaH + celdaH / 2 + 3);
    }
    ctx.textAlign = 'center';
    ctx.fillText('Banda de NP →', izquierda + ancho / 2, arriba - 18);
    ctx.save();
    ctx.translate(14, arriba + alto / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Banda de ND →', 0, 0);
    ctx.restore();
    ctx.textAlign = 'left';
    ctx.fillStyle = tema.tinta;
    ctx.fillText('Máx. ' + maximo + ' riesgo(s) por celda', izquierda, h - 6);
  }

  function rgbDe(color) {
    if (!/^#[0-9a-f]{6}$/i.test(color)) return '0,110,73';
    return parseInt(color.slice(1, 3), 16) + ',' + parseInt(color.slice(3, 5), 16) + ',' + parseInt(color.slice(5, 7), 16);
  }

  function recortar(texto, n) {
    texto = String(texto == null ? '' : texto);
    return texto.length > n ? texto.slice(0, n - 1) + '…' : texto;
  }

  /** Al entrar a la pestaña: si la matriz está vinculada y no tiene proyecto elegido,
      adopta el del numeral 2 para que la Consolidation siga a la evaluación en curso. */
  function refreshMatrizUnificada() {
    poblarProyectosUnificados();
    var sel = document.getElementById('selProyectoUnificado');
    if (estado.matrizVinculada && sel && !sel.value && estado.proyecto && estado.tipoProyecto) {
      var valor = identidadProyecto(estado.proyecto, estado.tipoProyecto);
      if (!Array.prototype.some.call(sel.options, function (o) { return o.value === valor; })) {
        sel.innerHTML += '<option value="' + escAttr(valor) + '">' + esc(estado.proyecto) + ' (' + esc(estado.tipoProyecto) + ')</option>';
      }
      sel.value = valor;
    }
    renderMatrizUnificada();
  }

  /* ============================================================
     Pestaña catálogo (visualización)
     ============================================================ */

  function renderCatalogo(filtroActividad, buscar) {
    var cont = document.getElementById('catalogo-lista');
    if (!cont) return;
    var html = '';
    var n = 0;
    CATALOGO.forEach(function (c) {
      var pre = prefijoTipo(filtroActividad);
      if (filtroActividad && pre && String(c.sheet).indexOf(pre) !== 0) return;
      if (filtroActividad && !pre && String(c.sheet).indexOf(filtroActividad) !== 0) return;
      if (buscar) {
        var b = buscar.toLowerCase();
        var hay = String(c.riesgo).toLowerCase().indexOf(b) >= 0 ||
          String(c.codigo).toLowerCase().indexOf(b) >= 0 ||
          String(c.sheet).toLowerCase().indexOf(b) >= 0;
        if (!hay) return;
      }
      n++;
      var items = c.preguntas.length;
      html += '<div class="cat-item" data-sheet="' + escAttr(c.sheet) + '">';
      html += '<h4>' + esc(c.riesgo) + ' <small>(' + esc(c.codigo) + ')</small></h4>';
      html += '<div class="cat-meta">Hoja: ' + esc(c.sheet) + ' · ' + items + ' acciones · ' + esc(c.clasificacion || '') + (c.tipo ? ' · ' + esc(c.tipo) : '') + '</div>';
      html += '<p class="cat-meta">ΣNDR=' + esc(NTP330.fmt(c.preguntas.reduce(function (s, p) { return s + (+p.ndr || 0); }, 0))) +
        ' · ΣNDP=' + esc(NTP330.fmt(c.preguntas.reduce(function (s, p) { return s + (+p.ndp || 0); }, 0))) + '</p>';
      html += '<button class="btn btn-secundario cat-editar" data-sheet="' + escAttr(c.sheet) + '">Editar catálogo</button>';
      html += '<div class="cat-editor" style="display:none"></div>';
      html += '</div>';
    });
    cont.innerHTML = n ? html : '<p class="nota">Sin resultados.</p>';
  }

  function bindCatalogo() {
    var buscar = document.getElementById('catBuscar');
    var act = document.getElementById('catActividad');
    if (!buscar || !act) return;

    buscar.addEventListener('input', function () { renderCatalogo(act.value, buscar.value.trim()); });
    act.addEventListener('change', function () { renderCatalogo(act.value, buscar.value.trim()); });
    var rC = document.getElementById('btnRestaurarCatalogo');
    if (rC) rC.addEventListener('click', function () {
      if (!confirm('¿Restaurar el catálogo original? Se perderán las ediciones guardadas.')) return;
      DBApp.setOverrides({});
      alert('Catálogo restaurado.');
      renderCatalogo(act.value, buscar.value.trim());
    });
  }

  /* ============================================================
     Pestaña metodología
     ============================================================ */

  function renderAyuda() {
    var cont = document.getElementById('ayuda-contenido');
    if (!cont) return;
    var h = '';

    h += '<div class="ntp330">';

    h += '<h3>Método específico de evaluación de riesgos</h3>';
    h += '<h4>NTP 330: Sistema simplificado de evaluación de riesgos de accidente</h4>';
    h += '<p>El INSST (1991) ha desarrollado la presente metodología, la cual tiene como objetivo facilitar la ' +
      'evaluación de riesgos laborales. Se basa en la identificación y cuantificación de las deficiencias en el ' +
      'entorno laboral, la exposición a los riesgos y la probabilidad de que ocurran accidentes. Utiliza ' +
      'cuestionarios de chequeo para evaluar estos factores. El nivel de riesgo se calcula multiplicando los ' +
      'niveles de deficiencia, exposición y consecuencias, lo que permite priorizar las intervenciones necesarias ' +
      'para mejorar la seguridad en el trabajo.</p>';
    h += '<p>La metodología de la NTP 330 se centra en simplificar la evaluación de riesgos laborales mediante un ' +
      'enfoque cuantitativo. Los principales componentes del método incluyen:</p>';

    /* Nivel de Deficiencia (ND) */
    h += '<h3>Nivel de Deficiencia (ND)</h3>';
    h += '<p>Evalúa las deficiencias en el entorno laboral mediante cuestionarios de chequeo, clasificando las ' +
      'deficiencias en cuatro niveles: Muy Deficiente, Deficiente, Mejorable y Aceptable. El nivel de deficiencia ' +
      'puede estimarse de muchas formas, el idóneo es a través de cuestionarios de chequeo que analicen los ' +
      'posibles factores de riesgo en cada situación (NTP 324).</p>';
    h += '<table class="tbl-nd">';
    h += '<thead><tr><th>Nivel de deficiencia</th><th>ND</th><th>Significado</th></tr></thead>';
    h += '<tbody>';
    h += '<tr><td class="ntp-ma">Muy deficiente (MD)</td><td class="num">10</td><td>Se han detectado factores de riesgo significativos que determinan como muy posible la generación de fallos, el conjunto de medidas preventivas existentes respecto al riesgo resulta ineficaz.</td></tr>';
    h += '<tr><td class="ntp-a">Deficiente (D)</td><td class="num">6</td><td>Se han detectado algún factor de riesgo significativo que precisa ser corregido. La eficacia del conjunto de medidas preventivas existentes se ve reducida de forma apreciable.</td></tr>';
    h += '<tr><td class="ntp-m">Mejorable (M)</td><td class="num">2</td><td>Se han detectado factores de riesgo de menor importancia. La eficacia del conjunto de medidas preventivas existentes respecto al riesgo no se ve reducida de forma apreciable.</td></tr>';
    h += '<tr><td class="ntp-b">Aceptable (B)</td><td class="num">-</td><td>No se han detectado anomalía destacable alguna. El riesgo está controlado. No se valora.</td></tr>';
    h += '</tbody></table>';
    h += '<p class="nota">Nota: INSST (1991)</p>';

    /* Nivel de Exposición (NE) */
    h += '<h3>Nivel de Exposición (NE)</h3>';
    h += '<p>Mide la frecuencia y duración de la exposición a los riesgos, basado en el tiempo de permanencia en ' +
      'áreas de riesgo y la frecuencia de operaciones peligrosas.</p>';
    h += '<table class="tbl-ne">';
    h += '<thead><tr><th>Nivel de exposición</th><th>NE</th><th>Significado</th></tr></thead>';
    h += '<tbody>';
    h += '<tr><td class="ntp-ma">Continuada (EC)</td><td class="num">4</td><td>Continuamente. Varias veces en su jornada laboral con tiempo prolongado.</td></tr>';
    h += '<tr><td class="ntp-a">Frecuente (EF)</td><td class="num">3</td><td>Varias veces en su jornada laboral, aunque sea con tiempos cortos.</td></tr>';
    h += '<tr><td class="ntp-m">Ocasional (EO)</td><td class="num">2</td><td>Alguna vez en su jornada laboral y con período corto de tiempo.</td></tr>';
    h += '<tr><td class="ntp-b">Esporádica (EE)</td><td class="num">1</td><td>Irregularmente.</td></tr>';
    h += '</tbody></table>';
    h += '<p class="nota">Nota: INSST (1991)</p>';

    /* Nivel de Probabilidad (NP) */
    h += '<h3>Nivel de Probabilidad (NP)</h3>';
    h += '<p>Se calcula como el producto del ND y NE. Este factor determina la probabilidad de que ocurra un accidente.</p>';
    h += '<table class="tbl-np-matrix">';
    h += '<thead>';
    h += '<tr><th class="ntp-blanco"></th><th class="ntp-blanco"></th><th colspan="4">Nivel de exposición (NE)</th></tr>';
    h += '</thead>';
    h += '<tbody>';
    h += '<tr><td class="ntp-blanco"></td><td class="ntp-blanco"></td><td class="num">4</td><td class="num">3</td><td class="num">2</td><td class="num">1</td></tr>';
    h += '<tr><th class="ntp-gris" rowspan="3">Nivel de<br>deficiencia<br>(ND)</th><td class="num">10</td><td class="matrix ntp-ma">MA-40</td><td class="matrix ntp-ma">MA-30</td><td class="matrix ntp-a">A-20</td><td class="matrix ntp-a">A-10</td></tr>';
    h += '<tr><td class="num">6</td><td class="matrix ntp-ma">MA-24</td><td class="matrix ntp-a">A-18</td><td class="matrix ntp-a">A-12</td><td class="matrix ntp-m">M-6</td></tr>';
    h += '<tr><td class="num">2</td><td class="matrix ntp-m">M-8</td><td class="matrix ntp-m">M-6</td><td class="matrix ntp-b">B-A</td><td class="matrix ntp-b">B-2</td></tr>';
    h += '</tbody></table>';
    h += '<p class="nota">Nota: INSST (1991)</p>';

    h += '<table class="tbl-np">';
    h += '<thead><tr><th>Nivel de probabilidad</th><th>NP</th><th>Significado</th></tr></thead>';
    h += '<tbody>';
    h += '<tr><td class="ntp-ma">Muy alta (MA)</td><td class="num">Entre 40 y 24</td><td>Situación deficiente con exposición continuada, o muy deficiente con exposición frecuente. Normalmente la materialización del riesgo ocurre con frecuencia.</td></tr>';
    h += '<tr><td class="ntp-a">Alta (A)</td><td class="num">Entre 20 y 10</td><td>Situación deficiente con exposición frecuente u ocasional, o bien situación muy deficiente con exposición ocasional o esporádica. La materialización del riesgo es posible que suceda varias veces en el ciclo de vida laboral.</td></tr>';
    h += '<tr><td class="ntp-m">Media (M)</td><td class="num">Entre 8 y 6</td><td>Situación deficiente con exposición esporádica, o bien situación mejorable con exposición continuada o frecuente. Es posible que suceda el daño alguna vez.</td></tr>';
    h += '<tr><td class="ntp-b">Baja (B)</td><td class="num">Entre 4 y 2</td><td>Situación mejorable con exposición ocasional o esporádica. No es esperable que se materialice el riesgo, aunque puede ser concebible.</td></tr>';
    h += '</tbody></table>';
    h += '<p class="nota">Nota: INSST (1991)</p>';

    /* Nivel de Consecuencias (NC) */
    h += '<h3>Nivel de Consecuencias (NC)</h3>';
    h += '<p>Clasifica los posibles daños resultantes de un accidente, considerando tanto las lesiones físicas como ' +
      'los daños materiales. Se dan cuatro niveles de consecuencias.</p>';
    h += '<table class="tbl-nc">';
    h += '<thead><tr><th rowspan="2">Nivel de consecuencias</th><th rowspan="2">NC</th><th colspan="2">Significado</th></tr>';
    h += '<tr><th>Daños personales</th><th>Daños materiales</th></tr></thead>';
    h += '<tbody>';
    h += '<tr><td class="ntp-ma">Mortal o Catastrófico (M)</td><td class="num">100</td><td>1 muerto o más</td><td>Destrucción total del sistema (difícil renovarlo)</td></tr>';
    h += '<tr><td class="ntp-a">Muy Grave (MG)</td><td class="num">60</td><td>Lesiones graves que pueden ser irreparables</td><td>Destrucción parcial del sistema (compleja y costosa la reparación)</td></tr>';
    h += '<tr><td class="ntp-m">Grave (G)</td><td class="num">25</td><td>Lesiones con incapacidad laboral transitoria (I.L.T.)</td><td>Se requiere paro de proceso para efectuar la reparación</td></tr>';
    h += '<tr><td class="ntp-b">Leve (L)</td><td class="num">10</td><td>Pequeñas lesiones que no requieren hospitalización</td><td>Reparable sin necesidad de paro del proceso</td></tr>';
    h += '</tbody></table>';
    h += '<p class="nota">Nota: INSST (1991)</p>';

    /* Nivel de Riesgo (NR) y Nivel de Intervención (NI) */
    h += '<h3>Nivel de Riesgo (NR) y Nivel de Intervención (NI)</h3>';
    h += '<p>Se obtiene multiplicando el NP por el NC, lo cual permite priorizar las intervenciones y medidas de ' +
      'control necesarias.</p>';
    h += '<table class="tbl-nr-matrix">';
    h += '<thead>';
    h += '<tr><th class="ntp-blanco"></th><th class="ntp-blanco"></th><th colspan="4">Nivel de probabilidad (NP)</th></tr>';
    h += '</thead>';
    h += '<tbody>';
    h += '<tr><td class="ntp-blanco"></td><td class="ntp-blanco"></td><td class="num">40-24</td><td class="num">20-10</td><td class="num">8-6</td><td class="num">4-2</td></tr>';
    h += '<tr><th class="ntp-gris" rowspan="4">Nivel de<br>consecuencias<br>(NC)</th><td class="num">100</td><td class="matrix ntp-i">I 4000-2400</td><td class="matrix ntp-i">I 2000-1200</td><td class="matrix ntp-i">I 800-600</td><td class="matrix ntp-ii">II 400-200</td></tr>';
    h += '<tr><td class="num">60</td><td class="matrix ntp-i">I 2400-1440</td><td class="matrix ntp-i">I 1200-600</td><td class="matrix ntp-ii">II 480-360</td><td class="matrix"><span class="chip ntp-ii">II 240</span> <span class="chip ntp-iii">III 120</span></td></tr>';
    h += '<tr><td class="num">25</td><td class="matrix ntp-i">I 1000-600</td><td class="matrix ntp-ii">II 500-250</td><td class="matrix ntp-ii">II 200-150</td><td class="matrix ntp-iii">III 100-50</td></tr>';
    h += '<tr><td class="num">10</td><td class="matrix ntp-ii">II 400-240</td><td class="matrix"><span class="chip ntp-ii">II 200</span> <span class="chip ntp-iii">III 100</span></td><td class="matrix ntp-iii">III 80-60</td><td class="matrix"><span class="chip ntp-iii">III 40</span> <span class="chip ntp-iv">IV 20</span></td></tr>';
    h += '</tbody></table>';
    h += '<p class="nota">Nota: INSST (1991)</p>';

    h += '<table class="tbl-ni">';
    h += '<thead><tr><th>Nivel de intervención</th><th>NR</th><th>Significado</th></tr></thead>';
    h += '<tbody>';
    h += '<tr><td class="ntp-i">I</td><td class="num">4000-600</td><td>Situación crítica. Corrección Urgente.</td></tr>';
    h += '<tr><td class="ntp-ii">II</td><td class="num">500-150</td><td>Corregir y adoptar medidas de control.</td></tr>';
    h += '<tr><td class="ntp-iii">III</td><td class="num">120-40</td><td>Mejorar si es posible. Sería conveniente justificar la intervención y su rentabilidad.</td></tr>';
    h += '<tr><td class="ntp-iv">IV</td><td class="num">20</td><td>No intervenir, salvo que un análisis más preciso lo justifique.</td></tr>';
    h += '</tbody></table>';
    h += '<p class="nota">Nota: INSST (1991)</p>';

    h += '<p>El método facilita la identificación de riesgos y la implementación de medidas preventivas en el lugar ' +
      'de trabajo (INSST, 1991).</p>';

    h += '</div>';

    cont.innerHTML = h;
  }

  /* ============================================================
     Inicialización
     ============================================================ */

  function init() {
    if (typeof NTP330 === 'undefined' || typeof MotorNTP330 === 'undefined') return;
    if (!document.getElementById('selTipoProyecto')) return;

    poblarTipos();
    poblarProcesos();
    poblarSugerenciasProyecto();
    poblarTablaEvaluaciones();
    poblarOpcionesAgregar();
    poblarProyectosUnificados();

    bindZona1();
    bindZonaRiesgos();
    bindModal();
    bindCatalogo();
    bindARTs();
    renderAyuda();

    var catAct = document.getElementById('catActividad');
    if (catAct) {
      catAct.innerHTML = '<option value="">-- Todos --</option>';
      getTiposProyecto().forEach(function (t) {
        var op = document.createElement('option');
        op.value = t.nombre; op.textContent = t.nombre;
        catAct.appendChild(op);
      });
    }
    renderCatalogo('', '');

    var btnP = document.getElementById('btnEjecutarPruebas');
    if (btnP) btnP.addEventListener('click', function () {
      AppPruebas.ejecutar();
    });

    if (typeof AdminApp !== 'undefined' && AdminApp.init) AdminApp.init();

    // §4.6 Advertir al salir con cambios sin guardar
    window.addEventListener('beforeunload', advertirSalidaSinGuardar);

    actualizarBotones();
    actualizarEstadoGeneral();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.AppUI = {
    getEstado: function () { return estado; },
    resultadoDe: resultadoDe,
    residualDe: residualDe,
    getRiesgosDeProceso: function (t, p) { return construirRiesgos(t, p); },
    riesgoActivo: function () {
      if (estado.riesgoActivo) return buscarRiesgo(estado.riesgoActivo);
      return estado.riesgos.length ? estado.riesgos[0] : null;
    },
    refreshMatrizUnificada: refreshMatrizUnificada,
    poblarProyectosUnificados: poblarProyectosUnificados,
    resultadoDeGuardado: resultadoDeGuardado,
    abrirEvaluacion: abrirEvaluacion,
    identidadProyecto: identidadProyecto,
    inicializarParaProyecto: inicializarParaProyecto,
    abrirComboProyecto: abrirComboProyecto,
    cerrarComboProyecto: cerrarComboProyecto,
    comboAbierto: comboAbierto,
    hayTrabajoEnCurso: hayTrabajoEnCurso,
    verMatrizUnificada: verMatrizUnificada,
    vincularMatriz: vincularMatriz,
    inicializarMatriz: inicializarMatriz,
    matrizVinculada: function () { return estado.matrizVinculada; },
    reiniciarMatrizUnificada: reiniciarMatrizUnificada,
    refreshARTs: poblarARTs,
    generarARTDesdeEvaluacion: generarARTDesdeEvaluacion,
    _refreshCatalogo: function () {
      var act = document.getElementById('catActividad');
      var bus = document.getElementById('catBuscar');
      renderCatalogo(act ? act.value : '', bus ? bus.value.trim() : '');
    },
    _refreshTipos: function () {
      poblarTipos();
      poblarProcesos();
      var catAct = document.getElementById('catActividad');
      if (catAct) {
        var actual = catAct.value;
        catAct.innerHTML = '<option value="">-- Todos --</option>';
        getTiposProyecto().forEach(function (t) {
          var op = document.createElement('option');
          op.value = t.nombre; op.textContent = t.nombre;
          if (t.nombre === actual) op.selected = true;
          catAct.appendChild(op);
        });
      }
    }
  };

})();

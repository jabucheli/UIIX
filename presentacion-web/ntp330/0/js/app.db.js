/**
 * app.db.js
 * Persistencia en localStorage (sin servidor). Almacena:
 *   - evaluaciones (identificación, riesgos, respuestas, NE/NC, justificaciones,
 *     controles, residual, trazabilidad, estado de aprobación, incluidos/excluidos)
 *   - sobreescrituras del catálogo (módulo de administración)
 *   - configuración de tipos de proyecto / procesos / actividades / tareas
 *   - configuración general (perfil NI, etc.)
 *
 * Claves: "ntp330.evaluaciones", "ntp330.catalogo.override",
 *         "ntp330.proyectos.override", "ntp330.config".
 *
 * correcciones4: modelo de datos §13, IDs EVAL-XXXX, campos de proyecto simplificados.
 */
(function () {
  'use strict';

  var PREFIJO = 'ntp330.';
  var K_EV = PREFIJO + 'evaluaciones';
  var K_OV = PREFIJO + 'catalogo.override';
  var K_PR = PREFIJO + 'proyectos.override';
  var K_CF = PREFIJO + 'config';
  var K_CONTADOR = PREFIJO + 'contador';
  var K_PROY = PREFIJO + 'proyectos';
  var K_CONTADOR_PROY = PREFIJO + 'contadorProy';

  function leer(clave, defecto) {
    try {
      var v = localStorage.getItem(clave);
      return v ? JSON.parse(v) : defecto;
    } catch (e) {
      return defecto;
    }
  }

  function escribir(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (e) {
      return false;
    }
  }

  /** Genera un ID incremental tipo EVAL-0001, EVAL-0002, etc. */
  function generarIdEvaluacion() {
    var contador = leer(K_CONTADOR, 0) + 1;
    escribir(K_CONTADOR, contador);
    var str = String(contador);
    while (str.length < 4) str = '0' + str;
    return 'EVAL-' + str;
  }

  /** Genera un ID incremental tipo PROY-0001, PROY-0002, etc. */
  function generarIdProyecto() {
    var contador = leer(K_CONTADOR_PROY, 0) + 1;
    escribir(K_CONTADOR_PROY, contador);
    var str = String(contador);
    while (str.length < 4) str = '0' + str;
    return 'PROY-' + str;
  }

  // ---------------- Proyectos ----------------
  function listarProyectos() {
    return leer(K_PROY, []);
  }

  function obtenerProyecto(id) {
    var lista = listarProyectos();
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id === id) return lista[i];
    }
    return null;
  }

  function crearProyecto(nombre, tipo) {
    var lista = listarProyectos();
    // Verificar nombre duplicado
    var nombreLower = String(nombre || '').trim().toLowerCase();
    for (var i = 0; i < lista.length; i++) {
      if (String(lista[i].nombre || '').trim().toLowerCase() === nombreLower) {
        return { error: 'Ya existe un proyecto con el nombre "' + nombre.trim() + '".' };
      }
    }
    var ahora = new Date();
    var proyecto = {
      id: generarIdProyecto(),
      nombre: nombre.trim(),
      tipo: tipo || '',
      fechaCreacion: ahora.toISOString(),
      usuario: 'evaluador',
      estado: 'Activo',
      procesosEvaluados: 0,
      riesgosEvaluados: 0,
      versionMetodologica: 'NTP 330 · 1.1.0'
    };
    lista.push(proyecto);
    lista.sort(function (a, b) { return (b.fechaCreacion || '').localeCompare(a.fechaCreacion || ''); });
    escribir(K_PROY, lista);
    return proyecto;
  }

  function actualizarProyecto(id, stats) {
    var lista = listarProyectos();
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id === id) {
        if (stats.procesosEvaluados !== undefined) lista[i].procesosEvaluados = stats.procesosEvaluados;
        if (stats.riesgosEvaluados !== undefined) lista[i].riesgosEvaluados = stats.riesgosEvaluados;
        if (stats.estado !== undefined) lista[i].estado = stats.estado;
        break;
      }
    }
    escribir(K_PROY, lista);
  }

  function eliminarProyecto(id) {
    var lista = listarProyectos().filter(function (p) { return p.id !== id; });
    escribir(K_PROY, lista);
    // También eliminar evaluaciones del proyecto
    var evals = listarEvaluaciones().filter(function (e) { return e.proyectoId !== id; });
    escribir(K_EV, evals);
  }

  // ---------------- Evaluaciones ----------------
  function listarEvaluaciones() {
    return leer(K_EV, []);
  }

  /** Lista todas las evaluaciones de un proyecto específico. */
  function listarEvaluacionesDeProyecto(nombreProyecto, tipoProyecto) {
    var lista = listarEvaluaciones();
    var np = String(nombreProyecto || '').trim().toLowerCase();
    var tp = String(tipoProyecto || '').trim().toLowerCase();
    return lista.filter(function (e) {
      var matchNombre = String(e.proyecto || '').trim().toLowerCase() === np;
      var matchTipo = !tp || String(e.tipoProyecto || '').trim().toLowerCase() === tp;
      return matchNombre && matchTipo;
    });
  }

  function guardarEvaluacion(ev) {
    var lista = listarEvaluaciones();
    var idx = -1;
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id === ev.id) { idx = i; break; }
    }
    if (idx >= 0) {
      lista[idx] = ev;
    } else {
      lista.push(ev);
    }
    lista.sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); });
    escribir(K_EV, lista);
    return ev;
  }

  function eliminarEvaluacion(id) {
    var lista = listarEvaluaciones().filter(function (e) { return e.id !== id; });
    escribir(K_EV, lista);
  }

  /** Crea una evaluación nueva (correcciones4 §4.3). */
  function nuevaEvaluacion(opts) {
    opts = opts || {};
    var ahora = new Date();
    return {
      id: generarIdEvaluacion(),
      nombre: opts.proceso + ' · ' + opts.tipoProyecto + ' · ' + ahora.toLocaleDateString('es-EC'),
      categoria: opts.categoria || '',
      tipoProyecto: opts.tipoProyecto || '',
      proyecto: opts.proyecto || opts.proceso || '',
      proyectoId: opts.proyectoId || '',
      codigo: opts.codigo || '',
      proceso: opts.proceso || '',
      subproceso: opts.subproceso || '',
      actividad: opts.actividad || '',
      tarea: opts.tarea || '',
      ubicacion: opts.ubicacion || '',
      empresa: opts.empresa || '',
      evaluador: opts.evaluador || '',
      cargo: opts.cargo || '',
      fecha: opts.fecha || ahora.toISOString().slice(0, 10),
      frente: opts.frente || '',
      etapa: opts.etapa || '',
      trabajadores: opts.trabajadores || '',
      obsGenerales: opts.obsGenerales || '',
      usuario: opts.usuario || 'evaluador',
      versionMetodologica: opts.versionMetodologica || 'NTP 330 · 1.1.0',
      fuente: '330.pdf · nd.xlsx · ER · procesos.doc',
      creadoPor: 'evaluador',
      createdAt: ahora.toISOString(),
      updatedAt: Date.now(),
      aprobado: false,
      aprobadoPor: '',
      aprobadoEn: null,
      riesgos: {}
    };
  }

  /** Migra evaluaciones de versiones anteriores. */
  function migrarEvaluacion(ev) {
    if (ev && !ev.tipoProyecto && ev.actividad) {
      ev.tipoProyecto = ev.actividad;
      ev.proyecto = ev.proyecto || '';
      ev.subproceso = ev.subproceso || '';
      ev.actividad = ev.actividadTarea || '';
      ev.tarea = ev.tareaTarea || '';
      ev.aprobado = !!ev.aprobado;
      if (!ev.versionMetodologica) ev.versionMetodologica = 'NTP 330 · 1.1.0';
    }
    // Migrar IDs viejos a formato EVAL-XXXX si es necesario
    if (ev && ev.id && ev.id.indexOf('ev-') === 0) {
      ev.id = generarIdEvaluacion();
    }
    return ev;
  }

  /** Devuelve los nombres de proyecto únicos de todas las evaluaciones. */
  function proyectosExistentes() {
    // Primero intentar desde el almacén de proyectos nuevos
    var proys = listarProyectos();
    if (proys.length) {
      return proys.map(function (p) {
        return { nombre: p.nombre, tipo: p.tipo, id: p.id };
      });
    }
    // Fallback: extraer de evaluaciones existentes
    var lista = listarEvaluaciones();
    var vistos = {};
    var out = [];
    lista.forEach(function (e) {
      var clave = (e.proyecto || '') + '||' + (e.tipoProyecto || '');
      if (vistos[clave]) return;
      vistos[clave] = true;
      out.push({ nombre: e.proyecto || '', tipo: e.tipoProyecto || '' });
    });
    return out;
  }

  // ---------------- Catálogo (overrides de listas de chequeo) ----------------
  function leerOverrides() {
    return leer(K_OV, {});
  }

  function setOverrides(ov) {
    return escribir(K_OV, ov);
  }

  // ---------------- Config de proyectos (tipos/procesos/actividades/tareas) ----------------
  function leerProyectosOverride() {
    return leer(K_PR, {});
  }

  function guardarProyectosOverride(ov) {
    return escribir(K_PR, ov);
  }

  // ---------------- Config ----------------
  function leerConfig() {
    return leer(K_CF, { perfilNI: 'estandar' });
  }

  function guardarConfig(cfg) {
    return escribir(K_CF, cfg);
  }

  window.DBApp = {
    listarEvaluaciones: listarEvaluaciones,
    listarEvaluacionesDeProyecto: listarEvaluacionesDeProyecto,
    guardarEvaluacion: guardarEvaluacion,
    eliminarEvaluacion: eliminarEvaluacion,
    nuevaEvaluacion: nuevaEvaluacion,
    migrarEvaluacion: migrarEvaluacion,
    proyectosExistentes: proyectosExistentes,
    listarProyectos: listarProyectos,
    obtenerProyecto: obtenerProyecto,
    crearProyecto: crearProyecto,
    actualizarProyecto: actualizarProyecto,
    eliminarProyecto: eliminarProyecto,
    leerOverrides: leerOverrides,
    setOverrides: setOverrides,
    leerProyectosOverride: leerProyectosOverride,
    guardarProyectosOverride: guardarProyectosOverride,
    leerConfig: leerConfig,
    guardarConfig: guardarConfig
  };

})();

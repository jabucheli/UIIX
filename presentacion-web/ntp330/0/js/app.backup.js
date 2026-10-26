/**
 * app.backup.js
 * Copia de seguridad de los datos de la aplicación (localStorage).
 *
 * Los datos NO viven en los archivos del proyecto: viven en el localStorage del
 * navegador (perfil del equipo). Para cambiar de computador o de navegador sin
 * perder las evaluaciones, hay que exportar un JSON y restaurarlo en el destino.
 *
 * Claves incluidas (prefijo "ntp330."):
 *   - evaluaciones      evaluaciones guardadas (ID, riesgos, respuestas, NE/NC, controles...)
 *   - proyectos        proyectos creados (PROY-XXXX)
 *   - contador         último consecutivo de evaluación
 *   - contadorProy     último consecutivo de proyecto
 *   - catalogo.override  ediciones de listas de chequeo
 *   - proyectos.override  tipos/procesos/actividades/tareas configurados
 *   - config           configuración general (perfil de NI)
 *
 * docs/continuidad.md describe el procedimiento completo.
 */
(function () {
  'use strict';

  var PREFIJO = 'ntp330.';
  var VERSION_FORMATO = 1;
  var FILE = 'ntp330-respaldo';

  /** Devuelve {clave: valor} de todas las claves ntp330.* del navegador. */
  function leerTodas() {
    var datos = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(PREFIJO) === 0) datos[k] = localStorage.getItem(k);
    }
    return datos;
  }

  /** Resumen legible para mostrar antes de exportar. */
  function resumen() {
    var claves = Object.keys(leerTodas());
    var evals = 0, proyectos = 0;
    try { evals = JSON.parse(localStorage.getItem(PREFIJO + 'evaluaciones') || '[]').length; } catch (e) { evals = -1; }
    try { proyectos = JSON.parse(localStorage.getItem(PREFIJO + 'proyectos') || '[]').length; } catch (e) { proyectos = -1; }
    return { claves: claves.length, evaluaciones: evals, proyectos: proyectos };
  }

  function nombreArchivo(ext) {
    var d = new Date();
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return FILE + '-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) +
      '-' + p(d.getHours()) + p(d.getMinutes()) + '.' + ext;
  }

  function descargar(nombre, contenido, tipo) {
    var blob = new Blob([contenido], { type: tipo });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
  }

  /** Genera el objeto de respaldo (sin escribir nada en disco). */
  function construir() {
    var datos = leerTodas();
    var r = resumen();
    return {
      app: 'Evaluación de riesgos laborales NTP 330',
      formato: VERSION_FORMATO,
      generadoEn: new Date().toISOString(),
      resumen: { claves: r.claves, evaluaciones: r.evaluaciones, proyectos: r.proyectos },
      datos: datos
    };
  }

  /** Descarga el respaldo completo en JSON. */
  function exportar() {
    var b = construir();
    if (!b.resumen.claves) {
      alert('No hay datos guardados en este navegador (ninguna clave "ntp330.*").\n\n' +
        'Si es un equipo nuevo, cree primero un proyecto y guarde una evaluación.');
      return null;
    }
    descargar(nombreArchivo('json'), JSON.stringify(b, null, 2), 'application/json');
    return b;
  }

  /**
   * Restaura un respaldo.
   * @param {Object} paqueteObjeto Objeto ya parseado del JSON de respaldo.
   * @param {string} modo 'reemplazar' (default) borra lo existente; 'combinar' conserva lo actual.
   * @returns {{ok:boolean, mensaje:string, detalles:string[]}}
   */
  function restaurar(paqueteObjeto, modo) {
    if (!paqueteObjeto || typeof paqueteObjeto !== 'object' || !paqueteObjeto.datos) {
      return { ok: false, mensaje: 'El archivo no tiene el formato de respaldo (falta "datos").', detalles: [] };
    }
    var claves = Object.keys(paqueteObjeto.datos).filter(function (k) {
      return k.indexOf(PREFIJO) === 0;
    });
    if (!claves.length) {
      return { ok: false, mensaje: 'El archivo no contiene ninguna clave "ntp330.*".', detalles: [] };
    }

    var detalles = [];
    if (modo === 'reemplazar') {
      Object.keys(leerTodas()).forEach(function (k) { localStorage.removeItem(k); });
      detalles.push('Se borraron los datos anteriores del navegador.');
    }
    claves.forEach(function (k) {
      localStorage.setItem(k, paqueteObjeto.datos[k]);
    });
    var evals = 0, proyectos = 0;
    try { evals = JSON.parse(localStorage.getItem(PREFIJO + 'evaluaciones') || '[]').length; } catch (e) { evals = -1; }
    try { proyectos = JSON.parse(localStorage.getItem(PREFIJO + 'proyectos') || '[]').length; } catch (e) { proyectos = -1; }
    detalles.push(claves.length + ' clave(s) restaurada(s).');
    detalles.push('Evaluaciones: ' + evals + ' · Proyectos: ' + proyectos);
    if (paqueteObjeto.generadoEn) detalles.push('Respaldo generado el ' + paqueteObjeto.generadoEn);
    return {
      ok: true,
      mensaje: 'Respaldo restaurado. Recargue la página para ver los datos.',
      detalles: detalles
    };
  }

  /** Abre el selector de archivos y restaura el JSON elegido. */
  function restaurarDesdeArchivo(modo) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.addEventListener('change', function () {
      var f = input.files && input.files[0];
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        var paquete;
        try {
          paquete = JSON.parse(fr.result);
        } catch (e) {
          alert('El archivo no es un JSON válido.\n\n' + e.message);
          return;
        }
        var r = restaurar(paquete, modo);
        if (!r.ok) { alert(r.mensaje); return; }
        var extra = r.detalles.length ? '\n\n' + r.detalles.join('\n') : '';
        if (confirm(r.mensaje + extra + '\n\n¿Recargar la página ahora?')) {
          window.location.reload();
        }
      };
      fr.readAsText(f);
    });
    input.click();
  }

  function iniciar() {
    var btnExp = document.getElementById('btnBackupExportar');
    if (btnExp) btnExp.addEventListener('click', exportar);

    var btnRep = document.getElementById('btnBackupRestaurar');
    if (btnRep) btnRep.addEventListener('click', function () { restaurarDesdeArchivo('reemplazar'); });

    var btnCom = document.getElementById('btnBackupCombinar');
    if (btnCom) btnCom.addEventListener('click', function () { restaurarDesdeArchivo('combinar'); });

    var info = document.getElementById('backup-resumen');
    if (info) {
      var r = resumen();
      info.textContent = 'En este navegador: ' + r.evaluaciones + ' evaluación(es) · ' +
        r.proyectos + ' proyecto(s) · ' + r.claves + ' clave(s) "ntp330.*". ' +
        'Los datos NO están en los archivos del proyecto: usa "Exportar respaldo" antes de cambiar de equipo.';
    }
  }

  window.BackupApp = {
    exportar: exportar,
    restaurar: restaurar,
    restaurarDesdeArchivo: restaurarDesdeArchivo,
    construir: construir,
    resumen: resumen
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

})();

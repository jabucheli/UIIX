/**
 * app.admin.js
 * Administración:
 *   - Tipos de proyecto (agregar, editar, activar/desactivar) — correcciones §4.
 *   - Procesos por tipo, subprocesos, actividades y tareas — §5.
 *   - Edición de listas de chequeo (texto y NDR), alta/eliminación de acciones
 *     y activación/desactivación de listas.
 * Los cambios se guardan en localStorage (sobreescrituras) sin modificar los
 * archivos de datos del catálogo.
 */
(function () {
  'use strict';

  function getPreguntas(sheet) {
    var ov = DBApp.leerOverrides();
    if (ov[sheet] && Array.isArray(ov[sheet].preguntas)) return ov[sheet].preguntas;
    var base = (window.APP_CATALOGO || []).filter(function (c) { return c.sheet === sheet; })[0];
    return base ? JSON.parse(JSON.stringify(base.preguntas)) : [];
  }

  function recalcularNDP(preguntas) {
    var suma = preguntas.reduce(function (s, p) { return s + (+p.ndr || 0); }, 0);
    preguntas.forEach(function (p) {
      p.ndp = (suma > 0) ? Math.round(((+p.ndr || 0) * 10 / suma) * 10000) / 10000 : 0;
    });
    return { suma: suma, ndpTotal: Math.round(preguntas.reduce(function (s, p) { return s + p.ndp; }, 0) * 100) / 100 };
  }

  function guardar(sheet, preguntas, activa) {
    var ov = DBApp.leerOverrides();
    if (!ov[sheet]) ov[sheet] = {};
    ov[sheet].preguntas = preguntas;
    if (typeof activa !== 'undefined') ov[sheet].activa = !!activa;
    DBApp.setOverrides(ov);
  }

  /* ============================================================
     Editor de listas de chequeo (por hoja)
     ============================================================ */

  function abrirEditor(btn) {
    var item = btn.closest('.cat-item');
    var editor = item.querySelector('.cat-editor');
    var sheet = item.dataset.sheet;
    var preguntas = getPreguntas(sheet);
    var ov = DBApp.leerOverrides();
    var activa = (ov[sheet] && typeof ov[sheet].activa !== 'undefined') ? !!ov[sheet].activa : true;

    var h = '<table class="tabla-riesgos" style="font-size:12px">';
    h += '<thead><tr><th>N°</th><th style="text-align:left">Acción sujeta a evaluación</th><th>NDR</th><th></th></tr></thead><tbody>';
    preguntas.forEach(function (p, i) {
      h += '<tr data-i="' + i + '">';
      h += '<td>' + (i + 1) + '</td>';
      h += '<td style="text-align:left"><input type="text" class="ed-texto" value="' + escAttr(p.texto) + '" style="width:100%"></td>';
      h += '<td><input type="number" class="ed-ndr" min="0" step="1" value="' + p.ndr + '" style="width:60px"></td>';
      h += '<td><button class="btn btn-peligro ed-del" data-i="' + i + '">Eliminar</button></td>';
      h += '</tr>';
    });
    h += '</tbody></table>';
    h += '<div style="margin-top:8px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">';
    h += '<button class="btn btn-secundario ed-add">Añadir acción</button>';
    h += '<button class="btn btn-primario ed-save">Guardar cambios</button>';
    h += '<button class="btn ed-cancel">Cancelar</button>';
    h += '<label style="font-size:13px"><input type="checkbox" class="ed-activa" ' + (activa ? 'checked' : '') + '> Lista activa</label>';
    h += '<span class="cat-meta ed-resumen"></span>';
    h += '</div>';

    editor.innerHTML = h;
    editor.style.display = 'block';
    btn.style.display = 'none';
    actualizarResumen(editor, preguntas);
  }

  function actualizarResumen(editor, preguntas) {
    var calc = recalcularNDP(preguntas);
    editor.querySelector('.ed-resumen').textContent =
      'ΣNDR=' + calc.suma + ' · ΣNDP=' + calc.ndpTotal + ' (debe ser 10.00)';
  }

  function leerPreguntas(editor) {
    var preguntas = [];
    editor.querySelectorAll('tbody tr').forEach(function (tr) {
      var texto = tr.querySelector('.ed-texto').value.trim();
      var ndr = Math.max(0, Math.round(+tr.querySelector('.ed-ndr').value) || 0);
      preguntas.push({ n: preguntas.length + 1, texto: texto, ndr: ndr, ndp: 0 });
    });
    return preguntas;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function escAttr(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function bindEditorListas() {
    var lista = document.getElementById('catalogo-lista');
    if (!lista) return;

    lista.addEventListener('click', function (e) {
      var btnEdit = e.target.closest('.cat-editar');
      if (btnEdit) { abrirEditor(btnEdit); return; }

      var editor = e.target.closest('.cat-editor');
      if (!editor) return;
      var item = editor.closest('.cat-item');
      var sheet = item.dataset.sheet;

      var del = e.target.closest('.ed-del');
      if (del) {
        del.closest('tr').remove();
        actualizarResumen(editor, leerPreguntas(editor));
        return;
      }

      if (e.target.closest('.ed-add')) {
        var tbody = editor.querySelector('tbody');
        var trNew = document.createElement('tr');
        trNew.innerHTML = '<td></td><td style="text-align:left"><input type="text" class="ed-texto" value="" style="width:100%" placeholder="Nueva acción"></td>' +
          '<td><input type="number" class="ed-ndr" min="0" step="1" value="1" style="width:60px"></td>' +
          '<td><button class="btn btn-peligro ed-del">Eliminar</button></td>';
        tbody.appendChild(trNew);
        return;
      }

      if (e.target.closest('.ed-cancel')) {
        editor.innerHTML = '';
        editor.style.display = 'none';
        var b = item.querySelector('.cat-editar');
        if (b) b.style.display = '';
        return;
      }

      if (e.target.closest('.ed-save')) {
        var preguntas = leerPreguntas(editor);
        var vacias = preguntas.filter(function (p) { return !p.texto; }).length;
        if (vacias) { alert('Hay acciones con texto vacío.'); return; }
        var activa = !!(editor.querySelector('.ed-activa') && editor.querySelector('.ed-activa').checked);
        var calc = recalcularNDP(preguntas);
        guardar(sheet, preguntas, activa);
        alert('Cambios guardados en el catálogo local. ΣNDP = ' + calc.ndpTotal + '. Lista ' + (activa ? 'activa' : 'inactiva') + '.');
        editor.innerHTML = '';
        editor.style.display = 'none';
        var b2 = item.querySelector('.cat-editar');
        if (b2) b2.style.display = '';
        if (typeof AppUI !== 'undefined' && AppUI._refreshCatalogo) AppUI._refreshCatalogo();
      }
    });
  }

  /* ============================================================
     Tipos de proyecto y procesos (§4 / §5)
     ============================================================ */

  function getOv() {
    return DBApp.leerProyectosOverride();
  }

  function saveOv(ov) {
    DBApp.guardarProyectosOverride(ov);
    if (typeof AppUI !== 'undefined' && AppUI._refreshTipos) AppUI._refreshTipos();
    renderProyectosAdmin();
  }

  function baseProcesos() {
    return (window.APP_PROCESOS_POR_TIPO || {});
  }

  function baseTipos() {
    return (window.APP_TIPOS_PROYECTO || []);
  }

  function getTiposEfectivos() {
    var ov = getOv();
    return (ov.tipos && ov.tipos.length) ? ov.tipos : baseTipos();
  }

  function getProcesosEfectivos(tipo) {
    var ov = getOv();
    if (ov.procesos && ov.procesos[tipo]) return ov.procesos[tipo];
    return baseProcesos()[tipo] || [];
  }

  function getLista(clave) {
    var ov = getOv();
    return (ov[clave] && ov[clave].length) ? ov[clave] : [];
  }

  function renderProyectosAdmin() {
    var cont = document.getElementById('proyectos-admin');
    if (!cont) return;
    var tipos = getTiposEfectivos();
    var h = '<div class="panel-selectores" style="align-items:flex-start">';
    h += '<div style="flex:1 1 100%"><h3 style="margin:0 0 8px;color:var(--tinta)">Administración · Tipos de proyecto y procesos</h3></div>';

    // Tipos
    h += '<div style="flex:1 1 100%"><b>Tipos de proyecto</b> <button class="btn btn-secundario btn-tipo-add" style="margin-left:8px">+ Agregar tipo</button></div>';
    tipos.forEach(function (t, i) {
      h += '<div class="fila-admin" data-i="' + i + '">';
      h += '<input type="checkbox" class="tipo-activo" data-i="' + i + '" ' + (t.activo === false ? '' : 'checked') + '>';
      h += '<input type="text" class="tipo-nombre" data-i="' + i + '" value="' + escAttr(t.nombre) + '" style="flex:1">';
      h += '<button class="btn btn-peligro tipo-del" data-i="' + i + '">Eliminar</button>';
      h += '</div>';
    });

    // Procesos por tipo
    h += '<div style="flex:1 1 100%;margin-top:12px"><b>Procesos por tipo de proyecto</b></div>';
    tipos.forEach(function (t) {
      if (t.activo === false) return;
      var procs = getProcesosEfectivos(t.nombre);
      h += '<div class="bloque-proceso"><div style="font-weight:bold">' + escAttr(t.nombre) + '</div>';
      procs.forEach(function (p, j) {
        h += '<div class="fila-admin" data-tipo="' + escAttr(t.nombre) + '" data-j="' + j + '">';
        h += '<span style="flex:1">' + esc(p) + '</span>';
        h += '<button class="btn btn-peligro proc-del" data-tipo="' + escAttr(t.nombre) + '" data-j="' + j + '">Quitar</button>';
        h += '</div>';
      });
      h += '<div class="fila-admin"><input type="text" class="proc-nuevo" data-tipo="' + escAttr(t.nombre) + '" placeholder="Nuevo proceso">' +
        '<button class="btn btn-secundario proc-add" data-tipo="' + escAttr(t.nombre) + '">Agregar</button></div>';
      h += '</div>';
    });

    // Subprocesos / actividades / tareas
    ['subprocesos', 'actividades', 'tareas'].forEach(function (clave) {
      var items = getLista(clave);
      h += '<div style="flex:1 1 100%;margin-top:12px"><b>' + etiquetaLista(clave) + '</b></div>';
      items.forEach(function (it, j) {
        h += '<div class="fila-admin" data-clave="' + clave + '" data-j="' + j + '">' +
          '<span style="flex:1">' + esc(it) + '</span>' +
          '<button class="btn btn-peligro lista-del" data-clave="' + clave + '" data-j="' + j + '">Quitar</button></div>';
      });
      h += '<div class="fila-admin"><input type="text" class="lista-nuevo" data-clave="' + clave + '" placeholder="Nueva opción">' +
        '<button class="btn btn-secundario lista-add" data-clave="' + clave + '">Agregar</button></div>';
    });

    h += '<div style="flex:1 1 100%;margin-top:12px" class="nota">Los cambios se guardan localmente (sin modificar el código fuente) y se reflejan en la Zona 1 de Evaluación.</div>';
    h += '</div>';
    cont.innerHTML = h;
  }

  function etiquetaLista(clave) {
    return { subprocesos: 'Subprocesos', actividades: 'Actividades', tareas: 'Tareas' }[clave] || clave;
  }

  function bindProyectosAdmin() {
    var cont = document.getElementById('proyectos-admin');
    if (!cont) return;

    cont.addEventListener('click', function (e) {
      var ov = getOv();
      var tipos = getTiposEfectivos();

      if (e.target.closest('.btn-tipo-add')) {
        var nombre = prompt('Nombre del nuevo tipo de proyecto:');
        if (!nombre || !nombre.trim()) return;
        ov.tipos = JSON.parse(JSON.stringify(tipos));
        ov.tipos.push({ nombre: nombre.trim(), activo: true, nota: '' });
        saveOv(ov);
        return;
      }

      var tipoDel = e.target.closest('.tipo-del');
      if (tipoDel) {
        var i = +tipoDel.dataset.i;
        if (!confirm('¿Eliminar el tipo "' + tipos[i].nombre + '"?')) return;
        ov.tipos = JSON.parse(JSON.stringify(tipos));
        ov.tipos.splice(i, 1);
        saveOv(ov);
        return;
      }

      var procDel = e.target.closest('.proc-del');
      if (procDel) {
        var tipo = procDel.dataset.tipo;
        var j = +procDel.dataset.j;
        if (!confirm('¿Quitar el proceso seleccionado del tipo "' + tipo + '"?')) return;
        if (!ov.procesos) ov.procesos = JSON.parse(JSON.stringify(baseProcesos()));
        ov.procesos[tipo].splice(j, 1);
        saveOv(ov);
        return;
      }

      var procAdd = e.target.closest('.proc-add');
      if (procAdd) {
        var tipo2 = procAdd.dataset.tipo;
        var input = cont.querySelector('.proc-nuevo[data-tipo="' + tipo2 + '"]');
        var val = input ? input.value.trim() : '';
        if (!val) return;
        if (!ov.procesos) ov.procesos = JSON.parse(JSON.stringify(baseProcesos()));
        if (!ov.procesos[tipo2]) ov.procesos[tipo2] = JSON.parse(JSON.stringify(baseProcesos()[tipo2] || []));
        ov.procesos[tipo2].push(val);
        saveOv(ov);
        return;
      }

      var listaAdd = e.target.closest('.lista-add');
      if (listaAdd) {
        var clave = listaAdd.dataset.clave;
        var input = cont.querySelector('.lista-nuevo[data-clave="' + clave + '"]');
        var val = input ? input.value.trim() : '';
        if (!val) return;
        if (!ov[clave]) ov[clave] = JSON.parse(JSON.stringify(getLista(clave)));
        ov[clave].push(val);
        saveOv(ov);
        return;
      }

      var listaDel = e.target.closest('.lista-del');
      if (listaDel) {
        var clave2 = listaDel.dataset.clave;
        var j2 = +listaDel.dataset.j;
        if (!confirm('¿Quitar la opción?')) return;
        if (!ov[clave2]) ov[clave2] = JSON.parse(JSON.stringify(getLista(clave2)));
        ov[clave2].splice(j2, 1);
        saveOv(ov);
        return;
      }
    });

    cont.addEventListener('change', function (e) {
      var ov = getOv();
      var tipos = getTiposEfectivos();
      var act = e.target.closest('.tipo-activo');
      if (act) {
        var i = +act.dataset.i;
        ov.tipos = JSON.parse(JSON.stringify(tipos));
        ov.tipos[i].activo = act.checked;
        saveOv(ov);
        return;
      }
      var nom = e.target.closest('.tipo-nombre');
      if (nom) {
        var i2 = +nom.dataset.i;
        ov.tipos = JSON.parse(JSON.stringify(tipos));
        ov.tipos[i2].nombre = nom.value.trim();
        saveOv(ov);
      }
    });
  }

  /* ============================================================
     Inicialización
     ============================================================ */

  function init() {
    if (!document.getElementById('proyectos-admin')) return;
    renderProyectosAdmin();
    bindProyectosAdmin();
    bindEditorListas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.AdminApp = {
    init: init,
    getPreguntas: getPreguntas,
    recalcularNDP: recalcularNDP,
    guardar: guardar,
    renderProyectosAdmin: renderProyectosAdmin
  };

})();

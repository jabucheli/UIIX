/**
 * app.reportes.js
 * Generación de reportes: CSV, JSON y ART (PDF).
 * El PDF usa las copias locales de jsPDF + AutoTable; si no están
 * disponibles se ofrece una vista imprimible como alternativa.
 */
(function () {
  'use strict';

  function estado() {
    return AppUI.getEstado();
  }

  /* PDF y vistas imprimibles comparten la paleta de Ejemplo.pptx con la interfaz. */
  function temaReporte() {
    var cs = getComputedStyle(document.documentElement);
    function leer(nombre, defecto) {
      var valor = cs.getPropertyValue(nombre).trim();
      return /^#[0-9a-f]{6}$/i.test(valor) ? valor : defecto;
    }
    return {
      tinta: leer('--tinta', '#262626'),
      cabecera: leer('--fondo-tabla', '#e7e6e6'),
      linea: leer('--linea-fuerte', '#cacaca'),
      acento: leer('--acento', '#006e49'),
      rojo: leer('--rojo', '#c0242a')
    };
  }

  function rgb(color) {
    return [parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16)];
  }

  function estilosTemaReporte() {
    var tema = temaReporte();
    return 'body{font-family:Arial,Helvetica,sans-serif;color:' + tema.tinta + '}' +
      'td,th{border-color:' + tema.linea + '}th{background:' + tema.cabecera + ';color:' + tema.tinta + '}' +
      'button{font-family:inherit}.no-print{background:' + tema.acento + ';color:#fff}';
  }

  function escCSV(s) {
    s = String(s == null ? '' : s);
    if (/[";\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
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

  /* ============================================================
     CSV
     ============================================================ */

  function exportarCSV() {
    var st = estado();
    if (!st.riesgos.length) { alert('No hay evaluación cargada.'); return; }

    var lineas = [];
    lineas.push('Evaluacion de riesgos laborales - NTP 330');
    lineas.push('Tipo de proyecto;' + escCSV(st.tipoProyecto) + ';Proyecto;' + escCSV(st.proyecto || '') +
      ';Proceso;' + escCSV(st.proceso));
    lineas.push('Fecha;' + escCSV(st.fecha || new Date().toLocaleDateString('es-EC')) + ';Evaluador;' + escCSV(st.evaluador || ''));
    lineas.push('');
    lineas.push('Riesgo;Codigo;ND;NE;NP;NC;NR;NI;Intervencion;Estado');
    st.riesgos.forEach(function (r) {
      if (!r.confirmado) return;
      var res = AppUI.resultadoDe(r);
      if (res.sinEvaluar && !res.detalle.si && !res.detalle.no && !res.detalle.nv) return;
      lineas.push([
        escCSV(r.nombre), escCSV(r.codigo),
        NTP330.fmt(res.nd), (res.ne ? res.ne.valor : ''), NTP330.fmt(res.np), (res.nc ? res.nc.valor : ''),
        NTP330.fmt(res.nr), res.ni.ni, escCSV(res.ni.texto), escCSV(res.estado.texto)
      ].join(';'));
    });

    lineas.push('');
    lineas.push('Detalle de controles recomendados');
    lineas.push('Codigo;Riesgo;Categoria;Medida');
    st.riesgos.forEach(function (r) {
      var g = ControlesApp.getControles(r.codigo);
      if (!g) return;
      g.forEach(function (grupo) {
        grupo.medidas.forEach(function (m) {
          lineas.push([escCSV(r.codigo), escCSV(r.nombre), escCSV(grupo.categoria), escCSV(m)].join(';'));
        });
      });
    });

    descargar('evaluacion_riesgos_' + (st.proceso || 'proceso') + '.csv', lineas.join('\r\n'), 'text/csv;charset=utf-8');
  }

  /* ============================================================
     JSON
     ============================================================ */

  function exportarJSON() {
    var st = estado();
    if (!st.riesgos.length) { alert('No hay evaluación cargada.'); return; }
    var datos = {
      herramienta: 'Evaluacion de riesgos laborales NTP 330',
      tipoProyecto: st.tipoProyecto,
      proyecto: st.proyecto || '',
      proceso: st.proceso,
      evaluador: st.evaluador || '',
      fecha: st.fecha || new Date().toISOString(),
      versionMetodologica: (st.ev && st.ev.versionMetodologica) || 'NTP 330 · 1.1.0',
      aprobado: !!(st.ev && st.ev.aprobado),
      riesgos: st.riesgos.filter(function (r) { return r.confirmado; }).map(function (r) {
        var res = AppUI.resultadoDe(r);
        var resR = AppUI.residualDe(r, res);
        return {
          riesgo: r.nombre,
          codigo: r.codigo,
          hoja: r.sheet,
          tipoPeligro: r.tipo,
          fuente: r.fuente,
          descripcion: r.descripcion,
          consecuencias: r.consecuencias,
          origen: r.origen,
          justificacion: r.justificacion,
          respuestas: r.respuestas,
          ne: r.ne,
          nc: r.nc,
          nd: res.nd,
          np: res.np,
          nr: res.nr,
          ni: res.ni.ni,
          estado: res.estado.texto,
          controles: r.controles,
          controlesPropuestos: r.controlesPropuestos || '',
          residual: resR
        };
      })
    };
    descargar('evaluacion_riesgos_' + (st.proceso || 'proceso') + '.json', JSON.stringify(datos, null, 2), 'application/json');
  }

  /* ============================================================
     Excel (SpreadsheetML, sin dependencias)
     ============================================================ */

  function escXML(s) {
    s = String(s == null ? '' : s);
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/\r?\n/g, '&#10;');
  }

  function celda(valor, extra) {
    extra = extra || '';
    return '<Cell ' + extra + '><Data ss:Type="String">' + escXML(valor) + '</Data></Cell>';
  }

  function exportarExcel() {
    var st = estado();
    if (!st.riesgos.length) { alert('No hay evaluación cargada.'); return; }

    var filas = [];
    filas.push('<Row><Cell ss:MergeAcross="11"><Data ss:Type="String">Evaluacion de riesgos laborales - NTP 330</Data></Cell></Row>');
    filas.push('<Row>' + celda('Categoría') + celda(st.categoria || '') + celda('Tipo de proyecto') + celda(st.tipoProyecto) +
      celda('Proyecto') + celda(st.proyecto || '') + celda('Proceso') + celda(st.proceso) + '</Row>');
    filas.push('<Row>' + celda('Proyecto') + celda(st.proyecto || '') + celda('Proceso') + celda(st.proceso) +
      celda('Fecha') + celda(st.fecha || new Date().toLocaleDateString('es-EC')) +
      celda('Evaluador') + celda(st.evaluador || '') + '</Row>');
    filas.push('<Row></Row>');
    filas.push('<Row>' + celda('Riesgo', 'ss:StyleID="hdr"') + celda('Código', 'ss:StyleID="hdr"') +
      celda('Hoja', 'ss:StyleID="hdr"') + celda('ND', 'ss:StyleID="hdr"') + celda('NE', 'ss:StyleID="hdr"') +
      celda('NP', 'ss:StyleID="hdr"') + celda('NC', 'ss:StyleID="hdr"') + celda('NR', 'ss:StyleID="hdr"') +
      celda('NI', 'ss:StyleID="hdr"') + celda('Intervención', 'ss:StyleID="hdr"') + celda('Estado', 'ss:StyleID="hdr"') +
      celda('Controles', 'ss:StyleID="hdr"') + '</Row>');

    st.riesgos.forEach(function (r) {
      if (!r.confirmado) return;
      var res = AppUI.resultadoDe(r);
      if (res.sinEvaluar && !res.detalle.si && !res.detalle.no && !res.detalle.nv) return;
      var g = ControlesApp.getControles(r.codigo);
      var medidas = (g && g.length)
        ? g.map(function (gr) { return gr.categoria + ': ' + gr.medidas.join('; '); }).join('\n')
        : '';
      if (r.controlesPropuestos) medidas += (medidas ? '\n' : '') + 'Propuestas: ' + r.controlesPropuestos;
      filas.push('<Row>' + celda(r.nombre) + celda(r.codigo) + celda(r.sheet || '') +
        celda(NTP330.fmt(res.nd)) + celda(res.ne ? res.ne.valor : '') + celda(NTP330.fmt(res.np)) +
        celda(res.nc ? res.nc.valor : '') + celda(NTP330.fmt(res.nr)) + celda(res.ni.ni) +
        celda(res.ni.texto) + celda(res.estado.texto) + celda(medidas) + '</Row>');
    });

    var xml = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>' +
      '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"' +
      ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
      '<Styles><Style ss:ID="hdr"><Font ss:Bold="1"/></Style></Styles>' +
      '<Worksheet ss:Name="Evaluacion"><Table>' +
      filas.join('') +
      '</Table></Worksheet></Workbook>';

    descargar('evaluacion_riesgos_' + (st.proceso || 'proceso') + '.xls', xml, 'application/vnd.ms-excel');
  }

  /* ============================================================
     PDF (ART)
     ============================================================ */

  function construirFilasART() {
    var st = estado();
    var filas = [];
    var totales = { I: 0, II: 0, III: 0, IV: 0 };
    var nTrabajadores = (st.ev && st.ev.trabajadores) ? String(st.ev.trabajadores) : '—';

    st.riesgos.forEach(function (r) {
      if (!r.confirmado) return;
      var res = AppUI.resultadoDe(r);
      if (res.sinEvaluar && !res.detalle.si && !res.detalle.no && !res.detalle.nv) return;
      totales[res.ni.ni] = (totales[res.ni.ni] || 0) + 1;

      var g = ControlesApp.getControles(r.codigo);
      var existentes = (g && g.length)
        ? g.map(function (gr) { return gr.categoria; }).join('; ')
        : '—';
      var medidasTexto = (g && g.length)
        ? g.map(function (gr) { return gr.categoria + ': ' + gr.medidas.join('; '); }).join('\n')
        : 'Medidas no definidas.';
      if (r.controlesPropuestos) medidasTexto += (medidasTexto ? '\n' : '') + 'Propuestas: ' + r.controlesPropuestos;

      filas.push({
        n: filas.length + 1,
        actividad: r.actividad || '—',
        peligro: r.nombre,
        codigo: r.codigo,
        riesgo: r.sheet,
        trabajadores: nTrabajadores,
        controles: existentes,
        nr: NTP330.fmt(res.nr),
        ni: res.ni.ni,
        nd: NTP330.fmt(res.nd),
        ne: (res.ne ? res.ne.valor : ''),
        np: NTP330.fmt(res.np),
        nc: (res.nc ? res.nc.valor : ''),
        estado: res.estado.texto,
        medidas: medidasTexto,
        responsable: r.responsable || '—',
        observaciones: r.observaciones || '—'
      });
    });

    return { filas: filas, totales: totales };
  }

  function colorNI(ni) {
    if (ni === 'I') return [198, 40, 40];
    if (ni === 'II') return [239, 108, 0];
    if (ni === 'III') return [249, 168, 37];
    return [46, 125, 50];
  }

  /** Columnas del ART en horizontal (correcciones6 §4.4/§4.7). */
  var ART_HEAD = ['N°', 'Actividad / Tarea', 'Peligro / Riesgo', 'Hoja', 'Trab.', 'Controles existentes', 'ND', 'NE', 'NP', 'NC', 'NR', 'NI', 'Medidas de control / Propuestas', 'Responsable', 'Observaciones'];
  var ART_WIDTHS = [8, 26, 30, 14, 8, 24, 9, 8, 9, 9, 10, 8, 52, 20, 30];

  function descargarART() {
    return descargarARTTamano('a4');
  }

  function descargarART_A3() {
    return descargarARTTamano('a3');
  }

  function vistaPreviaART() {
    var st = estado();
    if (!st.riesgos.length) { alert('No hay evaluación cargada.'); return; }
    vistaImprimible(construirFilasART());
  }

  /** Genera el ART en horizontal (A4 o A3) sin cortes ni superposición (§4). */
  function descargarARTTamano(formato) {
    var st = estado();
    if (!st.riesgos.length) { alert('No hay evaluación cargada.'); return; }
    var datos = construirFilasART();

    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF !== 'function') {
      vistaImprimible(datos);
      return;
    }

    var doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: formato });
    var tema = temaReporte();
    doc.setTextColor(tema.tinta);
    var w = doc.internal.pageSize.getWidth();
    var h = doc.internal.pageSize.getHeight();
    var pageNum = 1;

    // Escala de anchos proporcional al ancho útil (A4≈283 mm, A3≈406 mm)
    var usableW = w - 14;
    var suma = 0;
    for (var sw = 0; sw < ART_WIDTHS.length; sw++) suma += ART_WIDTHS[sw];
    var escala = usableW / suma;
    var widths = ART_WIDTHS.map(function (x) { return x * escala; });

    function cabecera() {
      doc.setFontSize(13); doc.setFont('helvetica', 'bold');
      doc.text('Análisis de Riesgo de Tarea (ART) - NTP 330', w / 2, 12, { align: 'center' });
      doc.setFontSize(9); doc.setFont('helvetica', 'normal');
      doc.setFont('helvetica', 'bold');
      doc.text('Proyecto: ' + (st.proyecto || '-'), 7, 19);
      doc.setFont('helvetica', 'normal');
      doc.text('Tipo: ' + st.tipoProyecto + '  |  Proceso: ' + st.proceso, 7, 24);
      doc.text('Fecha: ' + (st.fecha || new Date().toLocaleDateString('es-EC')) + '  |  Evaluador: ' + (st.evaluador || '-'), 7, 29);
      doc.text('Código evaluación: ' + ((st.ev && st.ev.id) || '-') + '  |  Versión: ' + ((st.ev && st.ev.versionMetodologica) || 'NTP 330 · 1.1.0') + '  |  Formato: ' + formato.toUpperCase() + ' horizontal', 7, 34);
      doc.setFontSize(7); doc.setFont('helvetica', 'italic');
      doc.text('Herramienta de apoyo al técnico de prevención. Método NTP 330 (INSST, 1991).', 7, 39);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Página ' + pageNum, w - 7, 12, { align: 'right' });
    }

    cabecera();

    doc.autoTable({
      startY: 43,
      margin: { left: 7, right: 7 },
      head: [ART_HEAD],
      body: datos.filas.map(function (f) {
        return [
          String(f.n), f.actividad, f.peligro, f.riesgo, f.trabajadores, f.controles,
          f.nd, f.ne, f.np, f.nc,
          { content: f.nr, styles: { fontStyle: 'bold' } },
          { content: f.ni, styles: { halign: 'center' } },
          f.medidas, f.responsable, f.observaciones
        ];
      }),
      styles: { fontSize: 6.5, textColor: rgb(tema.tinta), lineColor: rgb(tema.linea), lineWidth: 0.15, valign: 'top', cellPadding: 1.5 },
      headStyles: { fillColor: rgb(tema.cabecera), textColor: rgb(tema.tinta), fontStyle: 'bold', halign: 'center', fontSize: 6.5 },
      columnStyles: {
        0: { cellWidth: widths[0], halign: 'center' },
        1: { cellWidth: widths[1] },
        2: { cellWidth: widths[2] },
        3: { cellWidth: widths[3], halign: 'center' },
        4: { cellWidth: widths[4], halign: 'center' },
        5: { cellWidth: widths[5] },
        6: { cellWidth: widths[6], halign: 'center' },
        7: { cellWidth: widths[7], halign: 'center' },
        8: { cellWidth: widths[8], halign: 'center' },
        9: { cellWidth: widths[9], halign: 'center' },
        10: { cellWidth: widths[10], halign: 'center' },
        11: { cellWidth: widths[11], halign: 'center' },
        12: { cellWidth: widths[12] },
        13: { cellWidth: widths[13] },
        14: { cellWidth: widths[14] }
      },
      didDrawPage: function (data) {
        pageNum = data.pageNumber;
        if (data.pageNumber > 1) {
          doc.setFontSize(8); doc.setFont('helvetica', 'normal');
          doc.text('Página ' + data.pageNumber, w - 7, 12, { align: 'right' });
        }
      },
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 11) {
          var c = colorNI(data.cell.text[0]);
          data.cell.styles.fillColor = c;
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    // Resumen de nivel de intervención
    var y = doc.lastAutoTable.finalY + 8;
    if (y > h - 40) { doc.addPage(); y = 20; }
    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text('Resumen por nivel de intervención:', 10, y);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    var txt = 'I (crítico): ' + (datos.totales.I || 0) + '   |   II: ' + (datos.totales.II || 0) +
      '   |   III: ' + (datos.totales.III || 0) + '   |   IV: ' + (datos.totales.IV || 0);
    doc.text(txt, 10, y + 6);

    var obs = 'Observaciones: Declaro haber recibido por parte del área de Seguridad Industrial, la capacitación y el entrenamiento respecto a los peligros y riesgos en la ejecución de las tareas, y los métodos específicos para eliminar o minimizar éstos, con la correcta ejecución de los trabajos y cumplimiento de los procedimientos establecidos.';
    var y2 = y + 14;
    if (y2 > h - 30) { doc.addPage(); y2 = 20; }
    doc.setFontSize(9);
    doc.text(doc.splitTextToSize(obs, w - 20), 10, y2);

    // Firmas
    var fy = y2 + 14;
    if (fy > h - 20) { doc.addPage(); fy = 30; }
    doc.setDrawColor(0); doc.setLineWidth(0.2);
    var fx1 = 30, fx2 = w - 30 - 60;
    doc.line(fx1, fy, fx1 + 60, fy);
    doc.line(fx2, fy, fx2 + 60, fy);
    doc.setFontSize(10);
    doc.text('Supervisor SST', fx1 + 30, fy + 6, { align: 'center' });
    doc.text('Encargado/Supervisor', fx2 + 30, fy + 6, { align: 'center' });

    doc.save('ART_' + (st.proceso || 'proceso') + '_' + (st.tipoProyecto || 'proyecto') + '_' + formato + '.pdf');
  }

  /* ============================================================
     Matriz unificada: exportación (correcciones4 §10)
     ============================================================ */

  function obtenerFilasUnificadas() {
    var sel = document.getElementById('selProyectoUnificado');
    if (!sel || !sel.value) return [];
    var partes = sel.value.split('||');
    var nombreProyecto = partes[0] || '';
    var tipoProyecto = partes[1] || '';
    var evals = DBApp.listarEvaluacionesDeProyecto(nombreProyecto, tipoProyecto);
    var filas = [];
    evals.forEach(function (ev) {
      var riesgos = ev.riesgos || {};
      Object.keys(riesgos).forEach(function (rid) {
        var g = riesgos[rid];
        if (g.incluido === false) return;
        /* Reutiliza el cálculo del numeral 2 (AppUI.resultadoDeGuardado) para que el
           PDF no difiera de la pantalla: mismo catálogo con las ediciones del Catálogo
           y NP/NR/NI en blanco mientras falten NE o NC. */
        var calc = null;
        if (window.AppUI && typeof window.AppUI.resultadoDeGuardado === 'function') {
          calc = window.AppUI.resultadoDeGuardado(g);
        } else {
          var catLista = window.APP_CATALOGO || [];
          var catalogo = null;
          for (var i = 0; i < catLista.length; i++) {
            if (catLista[i].sheet === g.sheet) { catalogo = catLista[i]; break; }
          }
          var res0 = MotorNTP330.evaluarRiesgo({
            preguntas: (catalogo && catalogo.preguntas) || [],
            respuestas: g.respuestas || {},
            ne: (g.ne && g.ne.valor) || undefined,
            nc: (g.nc && g.nc.valor) || undefined,
            neElegido: !!(g.ne && g.ne.valor),
            ncElegido: !!(g.nc && g.nc.valor),
            neJustificado: !!g.ne && !!g.ne.valor,
            ncJustificado: !!g.nc && !!g.nc.valor,
            activo: true,
            aprobado: false
          });
          calc = { res: res0, completo: !!(g.ne && g.ne.valor && g.nc && g.nc.valor) };
        }
        var res = calc.res;
        filas.push({
          evId: ev.id, tipo: ev.tipoProyecto, proyecto: ev.proyecto || '—',
          proceso: ev.proceso || '—',
          nombre: g.nombre || rid, codigo: g.codigo || '',
          nd: res.nd, ne: res.ne ? res.ne.valor : '',
          np: calc.completo ? res.np : null,
          nc: res.nc ? res.nc.valor : '',
          nr: calc.completo ? res.nr : null,
          ni: calc.completo ? res.ni.ni : '',
          completo: calc.completo,
          estado: res.estado.texto
        });
      });
    });
    return filas;
  }

  function exportarUnificadoPDF() {
    var filas = obtenerFilasUnificadas();
    if (!filas.length) { alert('No hay datos en la matriz unificada.'); return; }

    var sel = document.getElementById('selProyectoUnificado');
    var partes = sel ? sel.value.split('||') : [];

    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF !== 'function') {
      imprimirUnificado();
      return;
    }

    var grupos = agruparUnificadoPorProceso(filas);
    var doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    var tema = temaReporte();
    doc.setTextColor(tema.tinta);
    var w = doc.internal.pageSize.getWidth();

    doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    doc.text('Matriz Unificada de Riesgos Laborales - NTP 330', w / 2, 13, { align: 'center' });
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text('Proyecto: ' + (partes[0] || '-') + '   |   Tipo: ' + (partes[1] || '-') +
      '   |   Procesos: ' + grupos.length + '   |   Riesgos: ' + filas.length +
      '   |   Fecha: ' + new Date().toLocaleDateString('es-EC'), w / 2, 19, { align: 'center' });

    /* Cuerpo agrupado por proceso constructivo: una banda por proceso con su
       subtotal, seguida de los riesgos de ese proceso. */
    var cuerpo = [];
    grupos.forEach(function (g) {
      var completa = g.filas.filter(function (f) { return f.completo; });
      var nrSuma = completa.reduce(function (s, f) { return s + f.nr; }, 0);
      var nrProm = completa.length ? nrSuma / completa.length : null;
      cuerpo.push([{
        content: 'PROCESO CONSTRUCTIVO: ' + g.proceso.toUpperCase() +
          '   ·   ' + g.filas.length + ' riesgo(s)   ·   NR promedio ' + fmtAusente(nrProm) +
          '   ·   con NE y NC: ' + completa.length,
        colSpan: 9,
        styles: {
          fillColor: rgb(tema.cabecera), textColor: rgb(tema.tinta),
          fontStyle: 'bold', fontSize: 8, cellPadding: { top: 1.6, bottom: 1.6, left: 1.5, right: 1.5 }
        }
      }]);
      g.filas.forEach(function (f) {
        cuerpo.push([
          f.evId, f.codigo || '—', f.nombre,
          NTP330.fmt(f.nd), String(f.ne), fmtAusente(f.np), String(f.nc),
          { content: fmtAusente(f.nr), styles: { fontStyle: 'bold' } },
          (f.ni ? f.ni + ' · ' : '') + f.estado
        ]);
      });
    });

    doc.autoTable({
      startY: 24,
      margin: { left: 7, right: 7, bottom: 14 },
      head: [['ID', 'Código', 'Riesgo', 'ND', 'NE', 'NP', 'NC', 'NR', 'NI y estado']],
      body: cuerpo,
      styles: { fontSize: 7.5, textColor: rgb(tema.tinta), lineColor: rgb(tema.linea), lineWidth: 0.1, valign: 'top' },
      headStyles: { fillColor: rgb(tema.acento), textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        0: { cellWidth: 18 }, 1: { cellWidth: 16 }, 2: { cellWidth: 'auto' },
        3: { halign: 'center' }, 4: { halign: 'center' }, 5: { halign: 'center' },
        6: { halign: 'center' }, 7: { halign: 'center' }, 8: { cellWidth: 42 }
      },
      didDrawPage: function (data) {
        var paginas = doc.internal.getNumberOfPages();
        doc.setFontSize(7.5);
        doc.setTextColor(110, 110, 110);
        doc.text('Matriz unificada NTP 330 · ' + (partes[0] || '-'),
          data.settings.margin.left, doc.internal.pageSize.getHeight() - 6);
        doc.text('Página ' + paginas + ' de ' + paginas,
          doc.internal.pageSize.getWidth() - data.settings.margin.right, doc.internal.pageSize.getHeight() - 6, { align: 'right' });
      }
    });

    doc.save('MatrizUnificada_' + (partes[0] || 'proyecto') + '.pdf');
  }

  /** Agrupa las filas de la matriz unificada por proceso, en orden de aparición. */
  function agruparUnificadoPorProceso(filas) {
    var grupos = [];
    var porNombre = {};
    filas.forEach(function (f) {
      var proc = f.proceso || 'Sin proceso';
      if (!porNombre[proc]) { porNombre[proc] = { proceso: proc, filas: [] }; grupos.push(porNombre[proc]); }
      porNombre[proc].filas.push(f);
    });
    return grupos;
  }

  /** Vista imprimible de la matriz unificada: sirve también de respaldo sin jsPDF. */
  function imprimirUnificado() {
    var filas = obtenerFilasUnificadas();
    if (!filas.length) { alert('No hay datos en la matriz unificada.'); return; }
    var sel = document.getElementById('selProyectoUnificado');
    var partes = sel ? sel.value.split('||') : [];
    var grupos = agruparUnificadoPorProceso(filas);
    var tema = temaReporte();

    var cuerpo = '';
    grupos.forEach(function (g) {
      var completa = g.filas.filter(function (f) { return f.completo; });
      var nrSuma = completa.reduce(function (s, f) { return s + f.nr; }, 0);
      var nrProm = completa.length ? nrSuma / completa.length : null;
      cuerpo += '<tr class="grupo"><td colspan="9">Proceso constructivo: ' + escHTML(g.proceso) +
        ' · ' + g.filas.length + ' riesgo(s) · NR promedio ' + fmtAusente(nrProm) +
        ' · con NE y NC: ' + completa.length + '</td></tr>';
      g.filas.forEach(function (f) {
        cuerpo += '<tr><td>' + escHTML(f.evId) + '</td><td>' + escHTML(f.codigo || '—') + '</td>' +
          '<td>' + escHTML(f.nombre) + '</td><td>' + NTP330.fmt(f.nd) + '</td>' +
          '<td>' + f.ne + '</td><td>' + fmtAusente(f.np) + '</td><td>' + f.nc + '</td>' +
          '<td><b>' + fmtAusente(f.nr) + '</b></td><td>' +
          escHTML((f.ni ? f.ni + ' · ' : '') + f.estado) + '</td></tr>';
      });
    });

    var totales = { I: 0, II: 0, III: 0, IV: 0 };
    filas.forEach(function (f) { if (totales[f.ni] !== undefined) totales[f.ni]++; });

    var w = window.open('', '_blank', 'width=1100,height=760');
    if (!w) { alert('Active ventanas emergentes para imprimir la matriz.'); return; }
    w.document.write(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Matriz unificada</title>' +
      '<style>@page{size:A4 landscape;margin:8mm}' +
      '@media print{body{margin:0}.no-print{display:none}tr{break-inside:avoid}}' +
      'body{font-size:9px;padding:14px}' +
      'table{border-collapse:collapse;width:100%}td,th{border:1px solid;padding:3px;vertical-align:top}' +
      'th{font-size:8px;text-align:center}td:nth-child(n+4):not(:last-child){text-align:center}' +
      'tr.grupo td{background:' + tema.cabecera + ';font-weight:bold;font-size:9px;border-top:2px solid ' + tema.acento + '}' +
      'h2{font-size:14px;text-align:center;margin:0 0 4px}' +
      '.meta{font-size:9px;text-align:center;margin:0 0 10px}' +
      '.pie{font-size:9px;margin-top:8px}' +
      estilosTemaReporte() + '</style></head><body>' +
      '<button class="no-print" onclick="window.print()" style="margin-bottom:10px;padding:8px 16px;border:none;cursor:pointer">Imprimir / Guardar como PDF</button>' +
      '<h2>Matriz Unificada de Riesgos Laborales · NTP 330</h2>' +
      '<p class="meta"><b>Proyecto:</b> ' + escHTML(partes[0] || '-') + ' &nbsp;·&nbsp; <b>Tipo:</b> ' + escHTML(partes[1] || '-') +
      ' &nbsp;·&nbsp; <b>Procesos constructivos:</b> ' + grupos.length +
      ' &nbsp;·&nbsp; <b>Riesgos:</b> ' + filas.length +
      ' &nbsp;·&nbsp; <b>Fecha:</b> ' + new Date().toLocaleDateString('es-EC') + '</p>' +
      '<table><tr><th>ID</th><th>Código</th><th>Riesgo</th><th>ND</th><th>NE</th><th>NP</th><th>NC</th><th>NR</th><th>NI y estado</th></tr>' +
      cuerpo + '</table>' +
      '<p class="pie"><b>Resumen por nivel de intervención:</b> I (crítico): ' + totales.I +
      ' · II: ' + totales.II + ' · III: ' + totales.III + ' · IV: ' + totales.IV +
      ' &nbsp;·&nbsp; Método NTP 330 (INSST, 1991).</p>' +
      '</body></html>'
    );
    w.document.close();
    setTimeout(function () { w.focus(); w.print(); }, 300);
  }

  /** Formatea un valor que puede no existir: un riesgo sin NE o NC no tiene NP ni NR
      (el motor usaría 1 y daría un valor inventado), así que se muestra un guion. */
  function fmtAusente(v) {
    return (v === null || typeof v === 'undefined' || v === '') ? '—' : NTP330.fmt(v);
  }

  function escHTML(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function exportarUnificadoExcel() {
    var filas = obtenerFilasUnificadas();
    if (!filas.length) { alert('No hay datos en la matriz unificada.'); return; }

    var grupos = agruparUnificadoPorProceso(filas);
    var filasXml = [];
    filasXml.push('<Row><Cell ss:MergeAcross="9"><Data ss:Type="String">Matriz Unificada de Riesgos - NTP 330</Data></Cell></Row>');
    filasXml.push('<Row>' + celda('ID', 'ss:StyleID="hdr"') + celda('Proceso', 'ss:StyleID="hdr"') +
      celda('Riesgo', 'ss:StyleID="hdr"') + celda('ND', 'ss:StyleID="hdr"') + celda('NE', 'ss:StyleID="hdr"') +
      celda('NP', 'ss:StyleID="hdr"') + celda('NC', 'ss:StyleID="hdr"') + celda('NR', 'ss:StyleID="hdr"') +
      celda('NI', 'ss:StyleID="hdr"') + celda('Estado', 'ss:StyleID="hdr"') + '</Row>');

    grupos.forEach(function (g) {
      filasXml.push('<Row><Cell ss:MergeAcross="9" ss:StyleID="grp"><Data ss:Type="String">Proceso constructivo: ' +
        escCSV(g.proceso) + ' (' + g.filas.length + ' riesgos)</Data></Cell></Row>');
      g.filas.forEach(function (f) {
        filasXml.push('<Row>' + celda(f.evId) + celda(f.proceso) + celda(f.nombre) +
          celda(NTP330.fmt(f.nd)) + celda(f.ne) + celda(fmtAusente(f.np)) +
          celda(f.nc) + celda(fmtAusente(f.nr)) + celda(f.ni) + celda(f.estado) + '</Row>');
      });
    });

    var xml = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>' +
      '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"' +
      ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
      '<Styles><Style ss:ID="hdr"><Font ss:Bold="1"/></Style>' +
      '<Style ss:ID="grp"><Font ss:Bold="1"/><Interior ss:Color="#E4EFE9" ss:Pattern="Solid"/></Style></Styles>' +
      '<Worksheet ss:Name="Matriz Unificada"><Table>' +
      filasXml.join('') +
      '</Table></Worksheet></Workbook>';

    descargar('MatrizUnificada.xlsx', xml, 'application/vnd.ms-excel');
  }

  function exportarUnificadoCSV() {
    var filas = obtenerFilasUnificadas();
    if (!filas.length) { alert('No hay datos en la matriz unificada.'); return; }

    var lineas = ['ID evaluación;Proceso constructivo;Riesgo;Código;ND;NE;NP;NC;NR;NI;Estado'];
    agruparUnificadoPorProceso(filas).forEach(function (g) {
      lineas.push(';;PROCESO CONSTRUCTIVO: ' + escCSV(g.proceso) + ' (' + g.filas.length + ' riesgos);;;;;;');
      g.filas.forEach(function (f) {
        lineas.push([escCSV(f.evId), escCSV(f.proceso), escCSV(f.nombre), escCSV(f.codigo),
          NTP330.fmt(f.nd), f.ne, fmtAusente(f.np), f.nc, fmtAusente(f.nr), f.ni, escCSV(f.estado)].join(';'));
      });
    });

    descargar('MatrizUnificada.csv', lineas.join('\r\n'), 'text/csv;charset=utf-8');
  }

  /* ============================================================
     Lista de chequeo completada en PDF (con respuestas y ND)
     ============================================================ */

  function descargarListaCompletada(r) {
    var st = estado();
    if (!r || !r.sheet) { alert('Este riesgo no tiene una lista de chequeo asignada.'); return; }
    var preguntas = (r.catalogo && r.catalogo.preguntas) || [];
    var res = AppUI.resultadoDe(r);
    var d = res.detalle;

    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF !== 'function') {
      descargarListaCompletadaHTML(r, st, preguntas, res, d);
      return;
    }

    var doc = new window.jspdf.jsPDF();
    var tema = temaReporte();
    doc.setTextColor(tema.tinta);
    var w = doc.internal.pageSize.getWidth();
    var fnt = 'helvetica';

    doc.setFontSize(14); doc.setFont(fnt, 'bold');
    doc.text('Lista de chequeo completada — Determinación del nivel de deficiencia', w / 2, 15, { align: 'center' });
    doc.setFontSize(11); doc.setFont(fnt, 'normal');
    doc.text('NTP 330 · Evaluación de riesgos laborales', w / 2, 21, { align: 'center' });

    var y = 30;
    doc.setFontSize(10);
    var info = [
      ['Proyecto', st.proyecto || '—'],
      ['Código', st.codigo || '—'],
      ['Tipo de proyecto', st.tipoProyecto || '—'],
      ['Ubicación', st.ubicacion || '—'],
      ['Empresa', st.empresa || '—'],
      ['Evaluador', st.evaluador || '—'],
      ['Fecha', st.fecha || '—'],
      ['Proceso constructivo', r.proceso || st.proceso || '—'],
      ['Riesgo evaluado', r.nombre],
      ['Código del riesgo', r.codigo || '—'],
      ['Lista de chequeo', r.sheet],
      ['N° de preguntas', preguntas.length + ''],
      ['Estado', res.estado.texto]
    ];
    info.forEach(function (par) {
      doc.setFont(fnt, 'bold'); doc.text(par[0] + ':', 10, y);
      doc.setFont(fnt, 'normal'); doc.text(par[1], 60, y);
      y += 5;
    });

    y += 3;

    if (preguntas.length) {
      var header = [['N°', 'Pregunta', 'Resp.', 'NDP']];
      var body = preguntas.map(function (p) {
        var resp = r.respuestas[p.n] || 'Sin responder';
        var respTxt = resp === 'si' ? 'Sí' : (resp === 'no' ? 'No' : (resp === 'na' ? 'No aplica' : resp));
        return [p.n + '', p.texto, respTxt, NTP330.fmt(p.ndp)];
      });
      doc.autoTable({
        startY: y,
        margin: { left: 7, right: 7 },
        head: header,
        body: body,
        styles: { fontSize: 8, textColor: rgb(tema.tinta), lineColor: rgb(tema.linea), lineWidth: 0.1, valign: 'top' },
        headStyles: { fillColor: rgb(tema.cabecera), textColor: rgb(tema.tinta), fontStyle: 'bold' },
        columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: w - 59 }, 2: { cellWidth: 20 }, 3: { cellWidth: 15 } }
      });
      y = doc.lastAutoTable.finalY + 6;
    }

    // Reservar sitio para el resumen y las firmas tras una tabla de varias páginas.
    if (y > doc.internal.pageSize.getHeight() - 65) { doc.addPage(); y = 15; }
    doc.setFontSize(10); doc.setFont(fnt, 'bold');
    doc.text('Resultado del ND', 10, y); y += 5;
    doc.setFont(fnt, 'normal');
    var resLines = [
      'Respuestas Sí: ' + d.si + ' · No: ' + d.no + ' · No aplica: ' + d.na + ' · Sin responder: ' + d.sinResponder,
      'Puntaje obtenido: ' + NTP330.fmt(d.puntajeObtenido) + ' / ' + NTP330.fmt(d.puntajeMaximoAplicable),
      'ND calculado: ' + NTP330.fmt(res.nd) + ' (' + res.ndCls.nivel + ')',
      'Fórmula: ' + d.formula
    ];
    resLines.forEach(function (ln) {
      // Helvetica de jsPDF no incluye Σ: escribir su equivalente textual en el PDF.
      var lineas = doc.splitTextToSize(ln.replace(/Σ/g, 'suma'), w - 20);
      doc.text(lineas, 10, y);
      y += 5 * lineas.length;
    });

    y += 5;
    doc.setFontSize(9); doc.setFont(fnt, 'normal');
    doc.text('Evaluador: ' + (st.evaluador || '—') + '   Fecha: ' + (st.fecha || '—'), 10, y);
    y += 5;
    doc.text('Versión metodológica: ' + ((st.ev && st.ev.versionMetodologica) || 'NTP 330 · 1.1.0'), 10, y);

    doc.save('ListaCompletada_' + (r.sheet || r.codigo || 'riesgo') + '.pdf');
  }

  function descargarListaCompletadaHTML(r, st, preguntas, res, d) {
    var w = window.open('', '_blank', 'width=900,height=700');
    if (!w) { alert('Active ventanas emergentes para generar el PDF.'); return; }
    var filas = preguntas.map(function (p) {
      var resp = r.respuestas[p.n] || 'Sin responder';
      var respTxt = resp === 'si' ? 'Sí' : (resp === 'no' ? 'No' : (resp === 'na' ? 'No aplica' : resp));
      return '<tr><td>' + p.n + '</td><td>' + p.texto + '</td><td>' + respTxt + '</td><td>' + NTP330.fmt(p.ndp) + '</td></tr>';
    }).join('');
    w.document.write(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Lista completada</title>' +
      '<style>body{font-size:11px}table{border-collapse:collapse;width:100%}td,th{border:1px solid;padding:4px;vertical-align:top;text-align:left}' + estilosTemaReporte() + '</style>' +
      '</head><body><h2>Lista de chequeo completada — Determinación del nivel de deficiencia</h2>' +
      '<p><b>Proyecto:</b> ' + (st.proyecto || '-') + ' · <b>Tipo:</b> ' + (st.tipoProyecto || '-') + ' · <b>Proceso:</b> ' + (r.proceso || st.proceso || '-') + '</p>' +
      '<p><b>Riesgo:</b> ' + r.nombre + ' · <b>Código:</b> ' + (r.codigo || '-') + ' · <b>Lista:</b> ' + r.sheet + '</p>' +
      '<table><tr><th>N°</th><th>Pregunta</th><th>Respuesta</th><th>NDP</th></tr>' + filas + '</table>' +
      '<p><b>ND calculado:</b> ' + NTP330.fmt(res.nd) + ' (' + res.ndCls.nivel + ')</p>' +
      '<p><b>Evaluador:</b> ' + (st.evaluador || '-') + ' · <b>Fecha:</b> ' + (st.fecha || '-') + '</p>' +
      '</body></html>'
    );
    w.document.close();
    setTimeout(function () { w.print(); }, 300);
  }

  /* ============================================================
     Lista de chequeo para campo (en blanco, §5/§6/§8)
     ============================================================ */

  function descargarListaCampo(r) {
    var st = estado();
    if (!r || !r.sheet) { alert('Este riesgo no tiene una lista de chequeo asignada.'); return; }
    var preguntas = (r.catalogo && r.catalogo.preguntas) || [];

    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF !== 'function') {
      descargarListaCampoHTML(r, st, preguntas);
      return;
    }

    var doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    var tema = temaReporte();
    doc.setTextColor(tema.tinta);
    var pageW = doc.internal.pageSize.getWidth();
    var pageH = doc.internal.pageSize.getHeight();
    var fnt = 'helvetica';
    var marginLeft = 10;
    var marginRight = 10;
    var usableW = pageW - marginLeft - marginRight;
    var y = 0;
    var pageNum = 1;

    function drawHeader() {
      y = 10;
      doc.setFontSize(9); doc.setFont(fnt, 'bold');
      doc.text('Evaluación de riesgos laborales · NTP 330', marginLeft, y);
      doc.setFont(fnt, 'normal');
      doc.text('Página ' + pageNum, pageW - marginRight, y, { align: 'right' });
      y += 5;
      doc.setFontSize(11); doc.setFont(fnt, 'bold');
      doc.text('Lista de chequeo para campo — Determinación del nivel de deficiencia', pageW / 2, y, { align: 'center' });
      y += 6;
      doc.setFontSize(9); doc.setFont(fnt, 'normal');
      doc.text('Código: ' + (r.sheet || '—') + '  |  Riesgo: ' + (r.nombre || '—') + '  |  Versión: ' + ((st.ev && st.ev.versionMetodologica) || 'NTP 330 · 1.1.0'), pageW / 2, y, { align: 'center' });
      y += 5;
    }

    drawHeader();

    // Identificación del proyecto
    doc.setFontSize(8); doc.setFont(fnt, 'bold');
    doc.text('IDENTIFICACIÓN DEL PROYECTO', marginLeft, y); y += 4;
    doc.setFont(fnt, 'normal');
    var camposProy = [
      'Nombre del proyecto: ________________________________________________',
      'Código del proyecto: ' + ((st.ev && st.ev.id) || '_____________') + '        Tipo de proyecto:   [ ] Estructura   [ ] Infraestructura',
      'Proceso constructivo: ' + (r.proceso || st.proceso || '________________________________'),
      'Actividad o tarea: ________________________________________________',
      'Riesgo: ' + (r.nombre || '________________________________')
    ];
    camposProy.forEach(function (c) { doc.text(c, marginLeft, y); y += 4; });
    y += 2;

    // Datos de inspección
    doc.setFont(fnt, 'bold');
    doc.text('DATOS DE INSPECCIÓN', marginLeft, y); y += 4;
    doc.setFont(fnt, 'normal');
    var camposInsp = [
      'Ubicación: ________________________________________________',
      'Fecha: ____/____/________      Hora: __________      Evaluador: ________________________________________________',
      'Cargo: ________________________________________________      N° trabajadores expuestos: __________'
    ];
    camposInsp.forEach(function (c) { doc.text(c, marginLeft, y); y += 4; });
    y += 3;

    // Tabla de preguntas
    doc.setFont(fnt, 'bold');
    doc.text('LISTA DE CHEQUEO', marginLeft, y); y += 2;

    if (preguntas.length) {
      // Correcciones6 §3.2/§3.4: celdas Sí/No/N/A totalmente vacías (sin marcas) para
      // permitir el marcado manual en campo. Se genera una copia vacía de la lista,
      // nunca se usan las respuestas almacenadas.
      var bodyRows = [];
      preguntas.forEach(function (p) {
        bodyRows.push([p.n + '', p.texto, '', '', '', '']);
      });

      doc.autoTable({
        startY: y,
        margin: { left: marginLeft, right: marginRight },
        head: [['N°', 'Pregunta / Acción sujeta a evaluación', 'Sí', 'No', 'N/A', 'Observaciones']],
        body: bodyRows,
        styles: { fontSize: 7, textColor: rgb(tema.tinta), lineColor: rgb(tema.linea), lineWidth: 0.15, valign: 'middle', minCellHeight: 9 },
        headStyles: { fillColor: rgb(tema.cabecera), textColor: rgb(tema.tinta), fontStyle: 'bold', halign: 'center', fontSize: 7 },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: usableW - 70 },
          2: { cellWidth: 12, halign: 'center' },
          3: { cellWidth: 12, halign: 'center' },
          4: { cellWidth: 12, halign: 'center' },
          // El resto de columnas suma usableW - 24; Observaciones completa el ancho útil.
          5: { cellWidth: 24 }
        },
        didDrawPage: function (data) {
          if (data.pageNumber > 1) {
            pageNum = data.pageNumber;
          }
        }
      });
      y = doc.lastAutoTable.finalY + 4;
    } else {
      doc.setFont(fnt, 'normal');
      doc.text('No hay preguntas registradas para esta lista de chequeo.', marginLeft, y);
      y += 6;
    }

    // Cierre — firmas
    if (y > pageH - 40) { doc.addPage(); pageNum++; drawHeader(); }
    doc.setFontSize(8); doc.setFont(fnt, 'bold');
    doc.text('OBSERVACIONES GENERALES', marginLeft, y); y += 4;
    doc.setFont(fnt, 'normal');
    doc.text('____________________________________________________________________________________________________', marginLeft, y); y += 4;
    doc.text('____________________________________________________________________________________________________', marginLeft, y); y += 6;

    doc.setFont(fnt, 'bold');
    doc.text('FIRMAS', marginLeft, y); y += 5;
    doc.setFont(fnt, 'normal');
    doc.text('Nombre y firma del evaluador: _______________________________', marginLeft, y);
    doc.text('Nombre y firma del responsable del área: _______________________________', pageW / 2 + 10, y);

    doc.save('ListaCampo_' + (r.sheet || r.codigo || 'riesgo') + '.pdf');
  }

  function descargarListaCampoHTML(r, st, preguntas) {
    var w = window.open('_blank', 'width=1000,height=700');
    if (!w) { alert('Active ventanas emergentes para generar el PDF.'); return; }
    var filas = preguntas.map(function (p) {
      return '<tr><td style="text-align:center">' + p.n + '</td><td>' + p.texto + '</td>' +
        '<td style="text-align:center"></td>' +
        '<td style="text-align:center"></td>' +
        '<td style="text-align:center"></td>' +
        '<td></td></tr>';
    }).join('');
    w.document.write(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Lista para campo</title>' +
      '<style>@media print{body{margin:0}.no-print{display:none}}' +
      'body{font-size:11px;padding:15px}' +
      'table{border-collapse:collapse;width:100%}td,th{border:1px solid;padding:5px;vertical-align:middle}' +
      'th{font-size:10px}.campo-linea{border-bottom:1px solid #333;display:inline-block;min-width:200px;margin:2px 0}' +
      'h2{font-size:14px;margin-bottom:4px}h3{font-size:12px;margin:10px 0 4px}' +
      '.sig-linea{border-bottom:1px solid #333;display:inline-block;width:250px;margin:0 20px}' + estilosTemaReporte() + '</style>' +
      '</head><body>' +
      '<button class="no-print" onclick="window.print()" style="margin-bottom:10px;padding:8px 16px;border:none;cursor:pointer">Imprimir / Guardar como PDF</button>' +
      '<h2>Evaluación de riesgos laborales · NTP 330</h2>' +
      '<h3>Lista de chequeo para campo — Determinación del nivel de deficiencia</h3>' +
      '<p style="font-size:10px"><b>Código:</b> ' + (r.sheet || '-') + ' · <b>Riesgo:</b> ' + (r.nombre || '-') + ' · <b>Versión:</b> ' + ((st.ev && st.ev.versionMetodologica) || 'NTP 330 · 1.1.0') + '</p>' +
      '<h3>IDENTIFICACIÓN DEL PROYECTO</h3>' +
      '<p>Nombre del proyecto: <span class="campo-linea">&nbsp;</span></p>' +
      '<p>Código del proyecto: <span class="campo-linea" style="min-width:120px">&nbsp;</span> &nbsp; Tipo de proyecto: ☐ Estructura ☐ Infraestructura</p>' +
      '<p>Proceso constructivo: <span class="campo-linea">&nbsp;</span></p>' +
      '<p>Actividad o tarea: <span class="campo-linea">&nbsp;</span></p>' +
      '<p>Riesgo: <span class="campo-linea">&nbsp;</span></p>' +
      '<h3>DATOS DE INSPECCIÓN</h3>' +
      '<p>Ubicación: <span class="campo-linea">&nbsp;</span></p>' +
      '<p>Fecha: ___/___/______ &nbsp; Hora: ________ &nbsp; Evaluador: <span class="campo-linea">&nbsp;</span></p>' +
      '<p>Cargo: <span class="campo-linea">&nbsp;</span> &nbsp; N° trabajadores expuestos: ________</p>' +
      '<h3>LISTA DE CHEQUEO</h3>' +
      '<table><tr><th style="width:30px">N°</th><th>Pregunta / Acción sujeta a evaluación</th>' +
      '<th style="width:35px">Sí</th><th style="width:35px">No</th><th style="width:35px">N/A</th>' +
      '<th style="width:120px">Observaciones</th></tr>' + filas + '</table>' +
      '<h3>OBSERVACIONES GENERALES</h3>' +
      '<p style="min-height:40px;border:1px solid #ccc;padding:5px">&nbsp;</p>' +
      '<h3>FIRMAS</h3>' +
      '<p style="margin-top:20px;text-align:center">' +
      '<span class="sig-linea"></span> &nbsp;&nbsp; <span class="sig-linea"></span></p>' +
      '<p style="text-align:center;font-size:10px">Nombre y firma del evaluador &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Nombre y firma del responsable del área</p>' +
      '</body></html>'
    );
    w.document.close();
    setTimeout(function () { w.print(); }, 300);
  }

  /* Vista imprimible (fallback sin jsPDF y vista previa ART) */
  function vistaImprimible(datos) {
    var st = estado();
    var w = window.open('', '_blank', 'width=1000,height=700');
    if (!w) { alert('Active ventanas emergentes para generar el reporte.'); return; }
    var filas = datos.filas.map(function (f) {
      return '<tr><td>' + f.n + '</td><td>' + f.actividad + '</td><td>' + f.peligro + '</td><td>' + f.riesgo + '</td><td>' + f.trabajadores + '</td><td>' + f.controles + '</td><td>' + f.nd + '</td><td>' + f.ne + '</td><td>' + f.np + '</td><td>' + f.nc + '</td><td><b>' + f.nr + '</b></td><td class="ni">' + f.ni + '</td><td>' + f.medidas.replace(/\n/g, '<br>') + '</td><td>' + f.responsable + '</td><td>' + f.observaciones + '</td></tr>';
    }).join('');
    w.document.write(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>ART</title>' +
      '<style>@media print{body{margin:8mm}.no-print{display:none}}' +
      'body{font-size:9px}table{border-collapse:collapse;width:100%}td,th{border:1px solid;padding:3px;vertical-align:top;text-align:left}.ni{font-weight:bold;text-align:center}th{font-size:8px}' +
      estilosTemaReporte() + '</style></head><body>' +
      '<button class="no-print" onclick="window.print()" style="margin-bottom:8px;padding:8px 16px;border:none;cursor:pointer">Imprimir / Guardar como PDF</button>' +
      '<h2 style="text-align:center">Análisis de Riesgo de Tarea (ART) - NTP 330</h2>' +
      '<p style="font-size:9px"><b>Proyecto:</b> ' + (st.proyecto || '-') + ' &nbsp; <b>Tipo:</b> ' + st.tipoProyecto + ' &nbsp; <b>Proceso:</b> ' + st.proceso +
      ' &nbsp; <b>Fecha:</b> ' + (st.fecha || '-') + ' &nbsp; <b>Evaluador:</b> ' + (st.evaluador || '-') + '</p>' +
      '<p style="font-size:9px"><b>Código evaluación:</b> ' + ((st.ev && st.ev.id) || '-') + ' &nbsp; <b>Versión:</b> ' + ((st.ev && st.ev.versionMetodologica) || 'NTP 330 · 1.1.0') + '</p>' +
      '<table><tr>' + ART_HEAD.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>' +
      filas + '</table>' +
      '<p style="font-size:9px"><b>Resumen por nivel de intervención:</b> I (crítico): ' + (datos.totales.I || 0) + ' | II: ' + (datos.totales.II || 0) + ' | III: ' + (datos.totales.III || 0) + ' | IV: ' + (datos.totales.IV || 0) + '</p>' +
      '</body></html>'
    );
    w.document.close();
    setTimeout(function () { w.print(); }, 300);
  }

  window.ReportesApp = {
    exportarCSV: exportarCSV,
    exportarJSON: exportarJSON,
    exportarExcel: exportarExcel,
    descargarART: descargarART,
    descargarART_A3: descargarART_A3,
    vistaPreviaART: vistaPreviaART,
    construirFilasART: construirFilasART,
    descargarListaCompletada: descargarListaCompletada,
    descargarListaCampo: descargarListaCampo,
    exportarUnificadoPDF: exportarUnificadoPDF,
    imprimirUnificado: imprimirUnificado,
    obtenerFilasUnificadas: obtenerFilasUnificadas,
    exportarUnificadoExcel: exportarUnificadoExcel,
    exportarUnificadoCSV: exportarUnificadoCSV
  };

})();

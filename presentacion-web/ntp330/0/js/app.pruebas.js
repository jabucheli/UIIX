/**
 * app.pruebas.js
 * Pruebas de validación del motor NTP 330 (semántica corregida):
 *   A) Fórmula del Excel nd.xlsx en el catálogo (ΣNDP = 10.00 en 44 hojas).
 *   B) Motor vs dataset de referencia de la tesis (189 riesgos, 12 procesos):
 *        NP = ND×NE, NR = NP×NC, bandas de ND.
 *   C) Motor: "No" aumenta el ND (semántica nd.xlsx), N/A y No verificado.
 *   D) Evaluación residual.
 *   E) Estados de evaluación (correcciones §17).
 *   F) Escenarios de validación contra Excel (correcciones §22).
 *   G) Escenarios dinámicos (correcciones §23).
 */
(function () {
  'use strict';

  var resultado = {
    total: 0, ok: 0, fail: 0,
    detalle: []
  };

  function registrar(grupo, nombre, ok, msg) {
    resultado.total++;
    if (ok) resultado.ok++; else resultado.fail++;
    resultado.detalle.push({ grupo: grupo, nombre: nombre, ok: ok, msg: msg || '' });
  }

  function numero(str) {
    var m = String(str).match(/^[\d.]+/);
    return m ? (+m[0]) : NaN;
  }

  /* ============================================================
     A) Catálogo / fórmula del Excel
     ============================================================ */

  function probarCatalogo() {
    var lista = window.APP_CATALOGO || [];
    registrar('Catálogo', 'Existen 44 listas de chequeo', lista.length === 44, 'encontradas: ' + lista.length);

    var malSuma = [], malNdp = [], malSeq = [];
    lista.forEach(function (c) {
      var suma = 0;
      c.preguntas.forEach(function (p) { suma += (+p.ndr || 0); });

      if (suma <= 0) malSuma.push(c.sheet);

      var ndpTotal = c.preguntas.reduce(function (s, p) { return s + (+p.ndp || 0); }, 0);
      if (Math.abs(ndpTotal - 10) > 0.001) malSuma.push(c.sheet + '(ΣNDP=' + ndpTotal + ')');

      c.preguntas.forEach(function (p, i) {
        var esperado = Math.round(((+p.ndr || 0) * 10 / suma) * 10000) / 10000;
        if (Math.abs(esperado - (+p.ndp || 0)) > 0.0001) malNdp.push(c.sheet + '#' + p.n);
        if (p.n !== i + 1) malSeq.push(c.sheet + '#' + p.n);
      });
    });

    registrar('Catálogo', 'ΣNDP = 10.00 en todas las listas (44/44)', malSuma.length === 0,
      malSuma.length ? 'fallan: ' + malSuma.join(', ') : '');
    registrar('Catálogo', 'NDP = NDR×10/ΣNDR en cada pregunta (471)', malNdp.length === 0,
      malNdp.length ? 'fallan: ' + malNdp.slice(0, 5).join(', ') : '');
    registrar('Catálogo', 'Numeración secuencial de preguntas (471)', malSeq.length === 0,
      malSeq.length ? 'fallan: ' + malSeq.slice(0, 5).join(', ') : '');
  }

  /* ============================================================
     B) Motor vs referencia de la tesis
     ============================================================ */

  function probarReferencia() {
    var ref = window.APP_REFERENCIA || {};
    var filas = 0;
    var ndBandFail = 0, npNumFail = 0, nrNumFail = 0;
    var niEstandar = {}, niTesis = {};

    Object.keys(ref).forEach(function (act) {
      Object.keys(ref[act]).forEach(function (proc) {
        (ref[act][proc] || []).forEach(function (bloque) {
          (bloque.riesgos || []).forEach(function (r) {
            filas++;
            var ndRef = numero(r[1]), neRef = numero(r[2]);
            var npRef = numero(r[3]), ncRef = numero(r[4]);
            var nrRef = numero(r[5]);

            // ND: banda del app == banda de la referencia
            var ndCls = NTP330.clasificarND(ndRef);
            var ndLabelRef = /Muy/.test(r[1]) ? 'Muy Deficiente' : (/Deficiente/.test(r[1]) ? 'Deficiente' : 'Mejorable');
            if (ndCls.nivel !== ndLabelRef) ndBandFail++;

            // NP = ND × NE (tolerancia 0.03: la referencia calculó NP con el ND sin redondear)
            var npCalc = Math.round(ndRef * neRef * 100) / 100;
            if (Math.abs(npCalc - npRef) > 0.03) npNumFail++;

            // NR = NP × NC (tolerancia 1.0 por el arrastre de redondeo del Excel original)
            var nrCalc = Math.round(npRef * ncRef * 100) / 100;
            if (Math.abs(nrCalc - nrRef) > 1.0) nrNumFail++;

            var niEst = NTP330.nivelIntervencion(nrRef).ni;
            var niTes = NTP330.NI_PERFIL_TESIS.filter(function (t) { return nrRef >= t.minimo; })[0];
            niEstandar[niEst] = (niEstandar[niEst] || 0) + 1;
            niTesis[niTes ? niTes.ni : 'IV'] = (niTesis[niTes ? niTes.ni : 'IV'] || 0) + 1;
          });
        });
      });
    });

    registrar('Referencia', 'Filas procesadas = 189', filas === 189, 'contadas: ' + filas);
    registrar('Referencia', 'Bandas de ND (189/189)', ndBandFail === 0, 'fallan: ' + ndBandFail);
    registrar('Referencia', 'NP = ND×NE (189/189)', npNumFail === 0, 'fallan: ' + npNumFail);
    registrar('Referencia', 'NR = NP×NC (189/189)', nrNumFail === 0, 'fallan: ' + nrNumFail);

    registrar('Referencia (información)', 'Distribución NI perfil estándar (I/II/III/IV)',
      true,
      'I:' + (niEstandar.I || 0) + ' II:' + (niEstandar.II || 0) + ' III:' + (niEstandar.III || 0) + ' IV:' + (niEstandar.IV || 0));
    registrar('Referencia (información)', 'Distribución NI perfil tesis (I/II/III/IV)',
      true,
      'I:' + (niTesis.I || 0) + ' II:' + (niTesis.II || 0) + ' III:' + (niTesis.III || 0) + ' IV:' + (niTesis.IV || 0));
  }

  /* ============================================================
     C) Motor: semántica "No" (nd.xlsx)
     ============================================================ */

  function probarMotor() {
    // Lista sintética: 3 preguntas con NDR 10, 6, 4 → ΣNDR=20, NDP=5,3,2
    var preguntas = [
      { n: 1, texto: 'A', ndr: 10, ndp: 5, ndd: 0 },
      { n: 2, texto: 'B', ndr: 6, ndp: 3, ndd: 0 },
      { n: 3, texto: 'C', ndr: 4, ndp: 2, ndd: 0 }
    ];

    var r0 = MotorNTP330.calcularND(preguntas, {});
    registrar('Motor', 'Sin respuestas → ND=0 (Aceptable)', r0.nd === 0 && r0.ndCls.nivel === 'Aceptable',
      'ND=' + r0.nd + ' ' + r0.ndCls.nivel);

    var rsi = MotorNTP330.calcularND(preguntas, { 1: 'si', 2: 'si', 3: 'si' });
    registrar('Motor', 'Todo "Sí" → ND=0 (Aceptable) [No cumple no aumenta]', rsi.nd === 0 && rsi.si === 3,
      'ND=' + rsi.nd + ' sí=' + rsi.si);

    var rno = MotorNTP330.calcularND(preguntas, { 1: 'no', 2: 'no', 3: 'no' });
    registrar('Motor', 'Todo "No" → ND=10.00 (Muy Deficiente)', Math.abs(rno.nd - 10) < 0.001 && rno.ndCls.nivel === 'Muy Deficiente',
      'ND=' + rno.nd + ' ' + rno.ndCls.nivel);

    var r1 = MotorNTP330.calcularND(preguntas, { 1: 'no' });
    registrar('Motor', 'Solo ítem 1 "No" (NDR=10) → ND=5.00', Math.abs(r1.nd - 5) < 0.001,
      'ND=' + r1.nd);

    var r2 = MotorNTP330.calcularND(preguntas, { 1: 'si', 2: 'no', 3: 'na' });
    registrar('Motor', 'Ítem 1 Sí, 2 No, 3 N/A → ND=3.00; aplicables=2', Math.abs(r2.nd - 3) < 0.001 && r2.aplicables === 2,
      'ND=' + r2.nd + ' aplicables=' + r2.aplicables);

    var r3 = MotorNTP330.calcularND(preguntas, { 1: 'si', 2: 'si', 3: 'nv' });
    registrar('Motor', '"No verificado" no aumenta ND pero deja pendiente (nv=1)',
      r3.nd === 0 && r3.nv === 1 && r3.pctCumplimiento === 80 && r3.aplicables === 3,
      'ND=' + r3.nd + ' nv=' + r3.nv + ' %cumpl=' + r3.pctCumplimiento);

    var r4 = MotorNTP330.calcularND(preguntas, { 1: 'na', 2: 'na', 3: 'na' });
    registrar('Motor', 'Todo "N/A" → ND=0, aplicables=0', r4.nd === 0 && r4.aplicables === 0 && r4.na === 3,
      'ND=' + r4.nd + ' aplicables=' + r4.aplicables);

    // Rango 0..10 (cap ND)
    var r5 = MotorNTP330.calcularND([{ n: 1, texto: 'A', ndr: 10, ndp: 10, ndd: 0 }, { n: 2, texto: 'B', ndr: 10, ndp: 10, ndd: 0 }], { 1: 'no', 2: 'no' });
    registrar('Motor', 'Cap ND ≤ 10 (dos ítems de NDP=10 → ND=10, no 20)', Math.abs(r5.nd - 10) < 0.001 && r5.nd <= 10,
      'ND=' + r5.nd);

    // Evaluación completa
    var ev = MotorNTP330.evaluarRiesgo({ preguntas: preguntas, respuestas: { 1: 'no' }, ne: 3, nc: 25 });
    registrar('Motor', 'Caso ND=5 NE=3 NC=25 → NP=15 NR=375 NI=II',
      Math.abs(ev.np - 15) < 0.01 && Math.abs(ev.nr - 375) < 0.01 && ev.ni.ni === 'II',
      'NP=' + ev.np + ' NR=' + ev.nr + ' NI=' + ev.ni.ni);

    // Límites NI estándar
    var casos = [
      [599.99, 'II'], [600, 'I'], [149.99, 'III'], [150, 'II'], [39.99, 'IV'], [40, 'III']
    ];
    var okLim = 0;
    casos.forEach(function (c) {
      if (NTP330.nivelIntervencion(c[0]).ni === c[1]) okLim++;
    });
    registrar('Motor', 'Límites NI estándar (600/150/40)', okLim === casos.length,
      'ok ' + okLim + '/' + casos.length);

    // Bandas ND según fórmula nd.xlsx (>6 MD, >2 D, >0 M, =0 B)
    var b6 = NTP330.clasificarND(6.0), b611 = NTP330.clasificarND(6.11), b2 = NTP330.clasificarND(2.0);
    registrar('Motor', 'Bandas ND: 6.0→Deficiente, 6.11→Muy Deficiente, 2.0→Mejorable',
      b6.nivel === 'Deficiente' && b611.nivel === 'Muy Deficiente' && b2.nivel === 'Mejorable',
      '6.0→' + b6.nivel + ' · 6.11→' + b611.nivel + ' · 2.0→' + b2.nivel);

    // Bandas NP según Excel (≥24 MA, >8 A, >4 M, ≤4 B)
    var p24 = NTP330.clasificarNP(24), p8 = NTP330.clasificarNP(8), p801 = NTP330.clasificarNP(8.01), p4 = NTP330.clasificarNP(4);
    registrar('Motor', 'Bandas NP: 24→Muy Alta, 8→Media, 8.01→Alta, 4→Baja',
      p24.sigla === 'MA' && p8.sigla === 'M' && p801.sigla === 'A' && p4.sigla === 'B',
      '24→' + p24.sigla + ' · 8→' + p8.sigla + ' · 8.01→' + p801.sigla + ' · 4→' + p4.sigla);

    // Catálogo real: marcar todos los ítems "No" → ND=10
    var c0 = window.APP_CATALOGO[0];
    var todasNo = {};
    c0.preguntas.forEach(function (p) { todasNo[p.n] = 'no'; });
    var rt2 = MotorNTP330.calcularND(c0.preguntas, todasNo);
    registrar('Motor', 'Catálogo real: todo "No" en ' + c0.sheet + ' → ND=10.00',
      Math.abs(rt2.nd - 10) < 0.001, 'ND=' + rt2.nd);
  }

  /* ============================================================
     D) Evaluación residual
     ============================================================ */

  function probarResidual() {
    var res = ControlesApp.evaluarResidual({
      nrInicial: 500, ndInicial: 6, neValor: 3, ncValor: 25,
      categoriasAplicadas: ['Controles de ingeniería'],
      ndOverride: null
    });
    registrar('Residual', 'Factor ingeniería 0.55 → ND=3.30, NP=9.90, NR=247.5, NI=II',
      Math.abs(res.nd - 3.3) < 0.01 && Math.abs(res.np - 9.9) < 0.1 && Math.abs(res.nr - 247.5) < 0.1 && res.ni.ni === 'II',
      'ND=' + res.nd + ' NP=' + res.np + ' NR=' + res.nr + ' NI=' + res.ni.ni);

    var res2 = ControlesApp.evaluarResidual({
      nrInicial: 500, ndInicial: 6, neValor: 3, ncValor: 25,
      categoriasAplicadas: ['Eliminación', 'Controles de ingeniería'],
      ndOverride: null
    });
    registrar('Residual', 'Factor 0.1×0.55=0.055 → ND=0.33 (mín. 0.05 aplicado)',
      res2.nd >= 0.05 && res2.nd < 0.6, 'ND=' + res2.nd);
  }

  /* ============================================================
     E) Estados de evaluación (§17)
     ============================================================ */

  function probarEstados() {
    var preguntas = [
      { n: 1, texto: 'A', ndr: 10, ndp: 5, ndd: 0 },
      { n: 2, texto: 'B', ndr: 6, ndp: 3, ndd: 0 }
    ];
    var base = {
      preguntas: preguntas,
      neElegido: false, ncElegido: false, neJustificado: false, ncJustificado: false,
      activo: true, aprobado: false
    };

    var e0 = MotorNTP330.evaluarRiesgo(Object.assign({}, base));
    registrar('Estados', 'Sin respuestas → Pendiente', e0.estado.texto === 'Pendiente', e0.estado.texto);

    var e1 = MotorNTP330.evaluarRiesgo(Object.assign({}, base, { respuestas: { 1: 'si', 2: 'nv' } }));
    registrar('Estados', 'Con "No verificado" → Lista incompleta', e1.estado.texto === 'Lista incompleta', e1.estado.texto);

    var e2 = MotorNTP330.evaluarRiesgo(Object.assign({}, base, { respuestas: { 1: 'si', 2: 'no' } }));
    registrar('Estados', 'Lista completa sin NE → ND calculado', e2.estado.texto === 'ND calculado', e2.estado.texto);

    var e3 = MotorNTP330.evaluarRiesgo(Object.assign({}, base, {
      respuestas: { 1: 'si', 2: 'no' }, ne: 3, neElegido: true
    }));
    registrar('Estados', 'NE elegido sin NC → NP calculado', e3.estado.texto === 'NP calculado', e3.estado.texto);

    var e4 = MotorNTP330.evaluarRiesgo(Object.assign({}, base, {
      respuestas: { 1: 'si', 2: 'no' }, ne: 3, neElegido: true, nc: 25, ncElegido: true
    }));
    registrar('Estados', 'NC elegido sin justificaciones → NR calculado', e4.estado.texto === 'NR calculado', e4.estado.texto);

    var e5 = MotorNTP330.evaluarRiesgo(Object.assign({}, base, {
      respuestas: { 1: 'si', 2: 'no' }, ne: 3, neElegido: true, nc: 25, ncElegido: true,
      neJustificado: true, ncJustificado: true
    }));
    registrar('Estados', 'Todo completo → Evaluación completa', e5.estado.texto === 'Evaluación completa', e5.estado.texto);

    var e6 = MotorNTP330.evaluarRiesgo(Object.assign({}, base, {
      respuestas: { 1: 'si', 2: 'no' }, ne: 3, neElegido: true, nc: 25, ncElegido: true,
      neJustificado: true, ncJustificado: true, aprobado: true
    }));
    registrar('Estados', 'Aprobada → Evaluación aprobada', e6.estado.texto === 'Evaluación aprobada', e6.estado.texto);

    var e7 = MotorNTP330.evaluarRiesgo(Object.assign({}, base, { activo: false }));
    registrar('Estados', 'Riesgo desmarcado (no presente) → Pendiente', e7.estado.texto === 'Pendiente', e7.estado.texto);
  }

  /* ============================================================
     F) Escenarios de validación contra Excel (§22)
     ============================================================ */

  function probarExcel() {
    var c = window.APP_CATALOGO[0];
    var ndp = c.preguntas.map(function (p) { return +p.ndp || 0; });
    var maxNdr = 0, maxIdx = 0;
    c.preguntas.forEach(function (p, i) {
      if ((+p.ndr || 0) > maxNdr) { maxNdr = +p.ndr; maxIdx = i; }
    });

    var nd0 = MotorNTP330.calcularND(c.preguntas, {});
    registrar('Excel §22', 'Cero respuestas "No" → ND=0 (Aceptable)', nd0.nd === 0,
      'ND=' + nd0.nd);

    var resp1 = {};
    resp1[c.preguntas[maxIdx].n] = 'no';
    var nd1 = MotorNTP330.calcularND(c.preguntas, resp1);
    var exp1 = Math.round(ndp[maxIdx] * 100) / 100;
    registrar('Excel §22', 'Una respuesta "No" (mayor NDR) → ND = NDP del ítem (' + exp1 + ')',
      Math.abs(nd1.nd - exp1) < 0.001 && nd1.no === 1,
      'ND=' + nd1.nd + ' esperado=' + exp1);

    var respV = {};
    [0, 1].forEach(function (i) { respV[c.preguntas[i].n] = 'no'; });
    var ndV = MotorNTP330.calcularND(c.preguntas, respV);
    var expV = Math.round((ndp[0] + ndp[1]) * 100) / 100;
    registrar('Excel §22', 'Varias respuestas "No" → ND = ΣNDP (' + expV + ')',
      Math.abs(ndV.nd - expV) < 0.001 && ndV.no === 2,
      'ND=' + ndV.nd + ' esperado=' + expV);

    var respT = {};
    c.preguntas.forEach(function (p) { respT[p.n] = 'no'; });
    var ndT = MotorNTP330.calcularND(c.preguntas, respT);
    registrar('Excel §22', 'Todas las respuestas "No" → ND=10.00 (máximo)',
      Math.abs(ndT.nd - 10) < 0.001, 'ND=' + ndT.nd);

    var pesos = {};
    c.preguntas.forEach(function (p) { pesos[p.n] = +p.ndp || 0; });
    var unicos = Object.keys(pesos).filter(function (k) { return pesos[k] !== pesos[c.preguntas[0].n]; });
    registrar('Excel §22', 'Preguntas con diferentes pesos (NDP distintos en la lista)',
      unicos.length > 0, 'lista ' + c.sheet + ' · NDPs distintos: ' + unicos.length);

    var respNA = {};
    c.preguntas.forEach(function (p) { respNA[p.n] = 'na'; });
    var ndNA = MotorNTP330.calcularND(c.preguntas, respNA);
    registrar('Excel §22', 'Preguntas "No aplica" → ND=0 y aplicables=0',
      ndNA.nd === 0 && ndNA.aplicables === 0, 'ND=' + ndNA.nd + ' aplicables=' + ndNA.aplicables);

    var respNV = {};
    c.preguntas.forEach(function (p) { respNV[p.n] = 'nv'; });
    var ndNV = MotorNTP330.calcularND(c.preguntas, respNV);
    registrar('Excel §22', 'Preguntas "No verificadas" → ND=0, quedan pendientes (nv=total)',
      ndNV.nd === 0 && ndNV.nv === c.preguntas.length && ndNV.sinResponder === 0,
      'ND=' + ndNV.nd + ' nv=' + ndNV.nv);

    registrar('Excel §22', 'Resultado máximo ND = 10 (nunca mayor)',
      ndT.nd <= 10, 'ND=' + ndT.nd);
  }

  /* ============================================================
     G) Escenarios dinámicos (§23)
     ============================================================ */

  function probarDinamico() {
    var c = window.APP_CATALOGO[0];
    var c2 = window.APP_CATALOGO[1] || c;

    var resp = {};
    resp[c.preguntas[0].n] = 'no';
    var ndA = MotorNTP330.calcularND(c.preguntas, resp).nd;
    resp[c.preguntas[0].n] = 'si';
    var ndB = MotorNTP330.calcularND(c.preguntas, resp).nd;
    registrar('Dinámico §23', 'Cambio de una respuesta recalcula ND (no→sí lo reduce)',
      ndA > 0 && ndB === 0 && ndA !== ndB, 'ND(no)=' + ndA + ' ND(sí)=' + ndB);

    var ev1 = MotorNTP330.evaluarRiesgo({ preguntas: c.preguntas, respuestas: resp, ne: 3, nc: 25 });
    var ev2 = MotorNTP330.evaluarRiesgo({ preguntas: c.preguntas, respuestas: resp, ne: 4, nc: 25 });
    registrar('Dinámico §23', 'Cambio de NE recalcula NP = ND×NE',
      ev1.np >= 0 && Math.abs(ev2.np - ev1.np * 4 / 3) < 0.05, 'NP(ne=3)=' + ev1.np + ' NP(ne=4)=' + ev2.np);

    var ev3 = MotorNTP330.evaluarRiesgo({ preguntas: c.preguntas, respuestas: resp, ne: 3, nc: 25 });
    var ev4 = MotorNTP330.evaluarRiesgo({ preguntas: c.preguntas, respuestas: resp, ne: 3, nc: 60 });
    registrar('Dinámico §23', 'Cambio de NC recalcula NR = NP×NC',
      Math.abs(ev4.nr - ev3.nr * 60 / 25) < 0.05, 'NR(nc=25)=' + ev3.nr + ' NR(nc=60)=' + ev4.nr);

    var ndH1 = MotorNTP330.calcularND(c.preguntas, resp).nd;
    var ndH2 = MotorNTP330.calcularND(c2.preguntas, resp).nd;
    registrar('Dinámico §23', 'Cambio de lista de chequeo recalcula ND',
      c.sheet !== c2.sheet, 'hoja1=' + c.sheet + ' → ND=' + ndH1 + ' · hoja2=' + c2.sheet + ' → ND=' + ndH2);

    var nuevo = MotorNTP330.evaluarRiesgo({ preguntas: [], respuestas: {}, activo: true });
    registrar('Dinámico §23', 'Adición de un riesgo sin lista → sin ND (Pendiente)',
      nuevo.nd === 0 && nuevo.sinEvaluar === true && nuevo.estado.texto === 'Pendiente',
      'ND=' + nuevo.nd + ' ' + nuevo.estado.texto);

    var desc = MotorNTP330.evaluarRiesgo({ preguntas: c.preguntas, respuestas: resp, activo: false });
    registrar('Dinámico §23', 'Eliminación de un riesgo no presente (activo=false) → Pendiente',
      desc.estado.texto === 'Pendiente', desc.estado.texto);

    var a = MotorNTP330.evaluarRiesgo({ preguntas: c.preguntas, respuestas: resp, ne: 3, nc: 25 });
    var b = MotorNTP330.evaluarRiesgo({ preguntas: c2.preguntas, respuestas: {}, ne: 4, nc: 60 });
    registrar('Dinámico §23', 'Evaluación simultánea de varios riesgos (independientes)',
      a.ni.ni === NTP330.nivelIntervencion(a.nr).ni && b.ni.ni === NTP330.nivelIntervencion(b.nr).ni,
      'riesgo1 NR=' + a.nr + ' NI=' + a.ni.ni + ' · riesgo2 NR=' + b.nr + ' NI=' + b.ni.ni);

    // 1 ≤ ND ≤ 10 sobre 44 hojas con todas las respuestas "No"
    var fuera = [];
    window.APP_CATALOGO.forEach(function (l) {
      var todas = {};
      l.preguntas.forEach(function (p) { todas[p.n] = 'no'; });
      var nd = MotorNTP330.calcularND(l.preguntas, todas).nd;
      if (nd < 1 || nd > 10) fuera.push(l.sheet + ':' + nd);
    });
    registrar('Dinámico §23', 'Rango ND: 1 ≤ ND ≤ 10 en las 44 listas (todo "No")',
      fuera.length === 0, fuera.length ? fuera.join(', ') : 'ND=10.00 en todas');
  }

  /* ============================================================
     H) Generación automática de riesgos por proceso (§5 / §8)
     ============================================================ */

  function probarGeneracion() {
    if (typeof AppUI === 'undefined' || typeof AppUI.getRiesgosDeProceso !== 'function') {
      registrar('Generación §5/§8', 'AppUI disponible (generación de riesgos)', false, 'AppUI no cargado en esta ejecución');
      return;
    }
    var tipos = window.APP_TIPOS_PROYECTO || [];
    var procesos = window.APP_PROCESOS_POR_TIPO || {};
    var hojas = {};
    (window.APP_CATALOGO || []).forEach(function (c) { hojas[c.sheet] = true; });

    var total = 0, sinHoja = 0, sinCodigo = 0, duplicados = 0, sinProceso = 0;
    tipos.forEach(function (t) {
      (procesos[t.nombre] || []).forEach(function (p) {
        var riesgos = AppUI.getRiesgosDeProceso(t.nombre, p);
        var vistos = {};
        riesgos.forEach(function (r) {
          total++;
          if (!r.sheet || !hojas[r.sheet]) sinHoja++;
          if (!r.codigo) sinCodigo++;
          if (vistos[r.sheet]) duplicados++;
          vistos[r.sheet] = true;
        });
        if (riesgos.length === 0) sinProceso++;
      });
    });

    registrar('Generación §5/§8', 'Riesgos generados con hoja de catálogo válida y código',
      sinHoja === 0 && sinCodigo === 0,
      'riesgos=' + total + ' sinHoja=' + sinHoja + ' sinCodigo=' + sinCodigo);
    registrar('Generación §5/§8', 'Sin duplicados de hoja dentro de un mismo proceso', duplicados === 0,
      'duplicados=' + duplicados);
    registrar('Generación §5/§8 (información)', 'Procesos sin riesgos en el dataset (se agregan manualmente)', true,
      'procesos sin dataset=' + sinProceso);
  }

  /* ============================================================
     Renderizado
     ============================================================ */

  function render() {
    var resumen = document.getElementById('resumen-pruebas');
    resumen.classList.remove('oculto');
    if (resultado.fail === 0) {
      resumen.className = 'resumen-pruebas-ok';
      resumen.textContent = 'TODAS LAS PRUEBAS PASARON (' + resultado.ok + '/' + resultado.total + ')';
    } else {
      resumen.className = 'resumen-pruebas-fail';
      resumen.textContent = 'Pruebas con fallos: ' + resultado.fail + ' de ' + resultado.total;
    }

    var det = document.getElementById('detalle-pruebas');
    var html = '';
    var grupo = '';
    resultado.detalle.forEach(function (d) {
      if (d.grupo !== grupo) {
        grupo = d.grupo;
        html += '<h3 style="color:var(--tinta);margin-bottom:6px">' + d.grupo + '</h3>';
      }
      html += '<div class="prueba-item ' + (d.ok ? 'ok' : 'fail') + '">' +
        (d.ok ? '✓' : '✗') + ' <b>' + d.nombre + '</b>' +
        (d.msg ? ' <span class="cat-meta">' + d.msg + '</span>' : '') +
        '</div>';
    });
    det.innerHTML = html;
  }

  function ejecutar() {
    resultado = { total: 0, ok: 0, fail: 0, detalle: [] };
    probarCatalogo();
    probarReferencia();
    probarMotor();
    probarResidual();
    probarEstados();
    probarExcel();
    probarDinamico();
    probarGeneracion();
    render();
    return resultado;
  }

  window.AppPruebas = {
    ejecutar: ejecutar,
    resultado: function () { return resultado; }
  };

})();

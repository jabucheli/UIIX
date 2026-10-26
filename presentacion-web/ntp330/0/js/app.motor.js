/**
 * app.motor.js
 * Motor de cálculo NTP 330. Replica exactamente las fórmulas del libro nd.xlsx:
 *
 *   NDP  = (NDR × 10) / Σ(NDR de la lista)     [ya precalculado en APP_CATALOGO]
 *   NDD  = NDP si el ítem está marcado "No", 0 en caso contrario
 *   ND   = Σ(NDD)  →  máximo 10.00 (validado en las 44 listas)
 *   NP   = ND × NE
 *   NR   = NP × NC
 *   NI   = f(NR) según perfil estándar NTP 330
 *
 * Semántica de respuestas (alineada con nd.xlsx, columna "No"):
 *   - "Sí": la condición evaluada cumple. No aporta NDD.
 *   - "No": la condición no cumple → incrementa el ND en su NDP.
 *   - "No aplica": no corresponde al riesgo/actividad/proceso. No aporta NDD
 *     y no forma parte de las preguntas aplicables.
 *   - "No verificado": no hay evidencia. No aporta NDD (no se considera
 *     incumplimiento automático) pero deja la lista en estado pendiente y
 *     bloquea la aprobación de la evaluación.
 */
(function () {
  'use strict';

  function round2(v) { return Math.round((+v || 0) * 100) / 100; }

  /** Limita el ND al rango [0, 10] de la escala establecida en nd.xlsx. */
  function capND(nd) {
    nd = +nd || 0;
    if (nd < 0) return 0;
    if (nd > 10) return 10;
    return nd;
  }

  /**
   * Calcula el ND (nivel de deficiencia) de una lista de chequeo.
   * @param {Array} preguntas  [{ n, texto, ndr, ndp, ndd }]
   * @param {Object} respuestas { n: 'si' | 'no' | 'na' | 'nv' }
   * @returns {Object} detalle completo del cálculo:
   *   { nd, ndCls, total, si, no, na, nv, sinResponder, aplicables,
   *     puntajeObtenido, puntajeMaximoAplicable, pctCumplimiento,
   *     pctIncumplimiento, sumaNdr, marcados, sinResponder }
   */
  function calcularND(preguntas, respuestas) {
    var sumaNdr = 0, total = preguntas.length;
    preguntas.forEach(function (p) { sumaNdr += (+p.ndr || 0); });

    var si = 0, no = 0, na = 0, nv = 0, sinResponder = 0;
    var puntajeNo = 0, puntajeSi = 0, puntajeAplicable = 0;

    preguntas.forEach(function (p) {
      var ndp = (p.ndp != null) ? (+p.ndp) : (((+p.ndr || 0) * 10) / (sumaNdr || 1));
      var r = respuestas && respuestas[p.n];

      if (r === 'no') { no++; puntajeNo += ndp; }
      else if (r === 'si') { si++; puntajeSi += ndp; }
      else if (r === 'na') { na++; }
      else if (r === 'nv') { nv++; }
      else { sinResponder++; }

      // Preguntas aplicables: todas excepto las marcadas "No aplica".
      if (r !== 'na') puntajeAplicable += ndp;
    });

    var nd = round2(capND(puntajeNo));
    var maxAplicable = round2(puntajeAplicable);
    var pctInc = (maxAplicable > 0) ? round2((puntajeNo / maxAplicable) * 100) : 0;
    var pctCum = (maxAplicable > 0) ? round2((puntajeSi / maxAplicable) * 100) : 0;

    return {
      nd: nd,
      ndCls: NTP330.clasificarND(nd),
      total: total,
      si: si,
      no: no,
      na: na,
      nv: nv,
      sinResponder: sinResponder,
      marcados: si + no + na + nv,
      aplicables: total - na,
      puntajeObtenido: round2(puntajeNo),
      puntajeMaximoAplicable: maxAplicable,
      pctCumplimiento: pctCum,
      pctIncumplimiento: pctInc,
      sumaNdr: sumaNdr,
      formula: 'ND = Σ(NDP) de las preguntas respondidas "No", con NDP = (NDR×10) / ΣNDR'
    };
  }

  /**
   * Determina el estado de evaluación de un riesgo (según correcciones §17).
   * Estados: Pendiente, Lista incompleta, ND calculado, NE pendiente,
   * NP calculado, NC pendiente, NR calculado, Evaluación completa,
   * Evaluación aprobada.
   */
  function determinarEstado(res, o) {
    o = o || {};
    if (o.activo === false) return { texto: 'Pendiente', sigla: 'PEN' };
    if (res.total === 0) return { texto: 'Pendiente', sigla: 'PEN' }; // sin lista de chequeo validada no puede calcularse el ND
    if (res.sinResponder === res.total) {
      return { texto: 'Pendiente', sigla: 'PEN' };
    }
    if (res.sinResponder > 0 || res.nv > 0) {
      return { texto: 'Lista incompleta', sigla: 'LI' };
    }
    if (!o.neElegido) return { texto: 'ND calculado', sigla: 'ND' };
    if (!o.ncElegido) return { texto: 'NP calculado', sigla: 'NP' };
    if (!o.neJustificado || !o.ncJustificado) return { texto: 'NR calculado', sigla: 'NR' };
    if (o.aprobado) return { texto: 'Evaluación aprobada', sigla: 'APROB' };
    return { texto: 'Evaluación completa', sigla: 'COMP' };
  }

  /**
   * Evalúa un riesgo completo con el método NTP 330.
   * @param {Object} o { preguntas, respuestas, ne, nc, neElegido, ncElegido,
   *                     neJustificado, ncJustificado, activo, aprobado }
   * @returns {Object} resultado completo (incluye estado y detalle de ND)
   */
  function evaluarRiesgo(o) {
    o = o || {};
    var ndInfo = calcularND(o.preguntas || [], o.respuestas || {});
    var ne = NTP330.getNE(o.ne);
    var nc = NTP330.getNC(o.nc);
    var np = round2(ndInfo.nd * ne.valor);
    var nr = round2(np * nc.valor);
    var ni = NTP330.nivelIntervencion(nr);
    var npCls = NTP330.clasificarNP(np);

    return {
      nd: ndInfo.nd,
      ndCls: ndInfo.ndCls,
      ne: ne,
      np: np,
      npCls: npCls,
      nc: nc,
      nr: nr,
      ni: ni,
      marcados: ndInfo.marcados,
      total: ndInfo.total,
      sinResponder: ndInfo.sinResponder,
      sinEvaluar: (ndInfo.sinResponder === ndInfo.total),
      detalle: ndInfo,
      estado: determinarEstado(ndInfo, {
        activo: o.activo,
        neElegido: o.neElegido,
        ncElegido: o.ncElegido,
        neJustificado: o.neJustificado,
        ncJustificado: o.ncJustificado,
        aprobado: o.aprobado
      })
    };
  }

  /**
   * Ordena dos códigos de riesgo para presentación (numéricos primero).
   */
  function compararCodigos(a, b) {
    var na = +a.replace(/\D.*$/, '');
    var nb = +b.replace(/\D.*$/, '');
    return na - nb || (a < b ? -1 : a > b ? 1 : 0);
  }

  window.MotorNTP330 = {
    round2: round2,
    capND: capND,
    calcularND: calcularND,
    evaluarRiesgo: evaluarRiesgo,
    determinarEstado: determinarEstado,
    compararCodigos: compararCodigos
  };

})();

/**
 * app.controles.js
 * Controles de ingeniería / administrativos / EPP por código de riesgo
 * (extraídos del script original de la tesis) y cálculo de la evaluación residual.
 *
 * La evaluación residual es una adaptación documentada (docs/adaptaciones.md):
 * aplicar controles reduce el ND por un factor según la jerarquía de control.
 */
(function () {
  'use strict';

  /** Normaliza un código del catálogo al formato usado en APP_CONTROLES. */
  function normalizarCodigo(codigo) {
    return String(codigo || '')
      .replace(/\(\s*(\w)\)/g, '$1')   // (a) -> a, (b) -> b
      .replace(/\s+/g, '')             // quita espacios
      .replace(/-/g, '-');             // normaliza guiones
  }

  /**
   * Devuelve los grupos de control para un código, o null si no hay definidos.
   * @returns {Array|null} [{categoria, medidas: []}]
   */
  function getControles(codigo) {
    var k = normalizarCodigo(codigo);
    var controles = window.APP_CONTROLES || {};
    if (controles[k]) return controles[k];
    // intento con el código en minúsculas (sufijos de infraestructura)
    if (controles[k.toLowerCase()]) return controles[k.toLowerCase()];
    return null;
  }

  /**
   * Calcula la evaluación residual tras marcar controles implementados.
   * @param {Object} o {
   *   nrInicial, ndInicial, neValor, ncValor,
   *   categoriasAplicadas: [ 'Controles de ingeniería', ... ],
   *   ndOverride: número (null para automático)
   * }
   */
  function evaluarResidual(o) {
    var cfg = NTP330.RESIDUAL;
    var factor = 1;
    (o.categoriasAplicadas || []).forEach(function (cat) {
      if (cfg.factoresCategoria[cat] != null) factor *= cfg.factoresCategoria[cat];
    });
    factor = Math.max(factor, cfg.reduccionMinima);

    var ndResidual = (o.ndOverride != null && !isNaN(o.ndOverride))
      ? (+o.ndOverride)
      : MotorNTP330.round2((o.ndInicial || 0) * factor);

    var ne = NTP330.getNE(o.neValor);
    var nc = NTP330.getNC(o.ncValor);
    var np = MotorNTP330.round2(ndResidual * ne.valor);
    var nr = MotorNTP330.round2(np * nc.valor);
    var ni = NTP330.nivelIntervencion(nr);

    return {
      factor: MotorNTP330.round2(factor),
      nd: ndResidual,
      ndCls: NTP330.clasificarND(ndResidual),
      ne: ne,
      np: np,
      npCls: NTP330.clasificarNP(np),
      nc: nc,
      nr: nr,
      ni: ni
    };
  }

  /** Devuelve las categorías disponibles en el catálogo de controles. */
  function categorias() {
    var cats = [];
    (window.APP_CONTROLES || {});
    Object.keys(window.APP_CONTROLES || {}).forEach(function (k) {
      (window.APP_CONTROLES[k] || []).forEach(function (g) {
        if (cats.indexOf(g.categoria) < 0) cats.push(g.categoria);
      });
    });
    return cats;
  }

  window.ControlesApp = {
    normalizarCodigo: normalizarCodigo,
    getControles: getControles,
    evaluarResidual: evaluarResidual,
    categorias: categorias
  };

})();

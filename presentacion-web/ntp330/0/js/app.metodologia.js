/**
 * app.metodologia.js
 * Tablas y umbrales del método NTP 330 (INSST, 1991) y su adaptación al proyecto.
 *
 * Motor NTP 330:
 *   ND = Σ NDP de los ítems marcados como "No" (NDP = NDR×10 / ΣNDR de la lista).
 *   NP = ND × NE
 *   NR = NP × NC
 *   NI = f(NR) según tabla 9 (perfil estándar NTP 330).
 *
 * Decisiones metodológicas (verificadas contra nd.xlsx y el dataset de la tesis):
 *   - El ND es continuo (ΣNDP de respuestas "No"), limitado a [0, 10].
 *     Bandas según la fórmula del Excel (hoja "Rangos"): ND>6 Muy Deficiente,
 *     ND>2 Deficiente, ND>0 Mejorable, ND=0 Aceptable.
 *   - El NP usa las bandas del Excel: ≥24 Muy Alta, >8 Alta, >4 Media, ≤4 Baja
 *     (equivalente continuo de la tabla 6 de la NTP 330).
 *   - El NI usa el perfil ESTÁNDAR NTP 330 (acordado con el autor):
 *       I:   600 ≤ NR ≤ 4000
 *       II:  150 ≤ NR < 600
 *       III: 40  ≤ NR < 150
 *       IV:  NR < 40
 *     (El dataset de la tesis usaba umbrales adaptados I≥501/II≥121/III≥21;
 *      se documenta en docs/adaptaciones.md.)
 */
(function () {
  'use strict';

  window.NTP330 = {
    version: '1.1.0',

    /** Tabla 3 · Nivel de Deficiencia (bandas para ND continuo, fórmula nd.xlsx). */
    ND_BANDAS: [
      { limite: 6,  nivel: 'Muy Deficiente', sigla: 'MD', valor: 10, criterio: 'ND > 6' },
      { limite: 2,  nivel: 'Deficiente',     sigla: 'D',  valor: 6,  criterio: '2 < ND ≤ 6' },
      { limite: 0,  nivel: 'Mejorable',      sigla: 'M',  valor: 2,  criterio: '0 < ND ≤ 2' },
      { limite: -1, nivel: 'Aceptable',      sigla: 'B',  valor: 0,  criterio: 'ND = 0 (sin incumplimientos)' }
    ],

    /**
     * Tabla 4 · Nivel de Exposición.
     * Frecuencia/duración según NTP 330 y carpeta ER de la tesis.
     */
    NE_NIVELES: [
      { valor: 4, nivel: 'Continuada',  sigla: 'EC',
        desc: 'Varias veces al día con tiempo prolongado, o de forma permanente en la jornada.',
        criterio: 'Exposición diaria, habitual y prolongada.' },
      { valor: 3, nivel: 'Frecuente',   sigla: 'EF',
        desc: 'Varias veces al día, aunque sea con tiempos cortos.',
        criterio: 'Repetida durante la jornada, con intervalos.' },
      { valor: 2, nivel: 'Ocasional',   sigla: 'EO',
        desc: 'Alguna vez al día, con periodo corto de tiempo, o con frecuencia semanal.',
        criterio: 'Exposición ocasional o eventual.' },
      { valor: 1, nivel: 'Esporádica',  sigla: 'EE',
        desc: 'Irregularmente, de forma eventual o esporádica.',
        criterio: 'Exposición excepcional, mensual o puntual.' }
    ],

    /** Tabla 7 · Nivel de Consecuencias. */
    NC_NIVELES: [
      { valor: 100, nivel: 'Mortal o Catastrófico', sigla: 'M',
        desc: '1 muerto o más; daños materiales elevados o catastróficos.',
        ejemplos: 'Fallecimiento; pérdidas materiales que impiden la continuidad de la obra.' },
      { valor: 60,  nivel: 'Muy Grave',             sigla: 'MG',
        desc: 'Lesiones graves que pueden originar incapacidad permanente o invalidez.',
        ejemplos: 'Amputaciones, fracturas múltiples, daños importantes a la propiedad.' },
      { valor: 25,  nivel: 'Grave',                 sigla: 'G',
        desc: 'Lesiones con incapacidad laboral transitoria (baja temporal).',
        ejemplos: 'Fracturas, quemaduras moderadas, lesiones con reposo.' },
      { valor: 10,  nivel: 'Leve',                  sigla: 'L',
        desc: 'Lesiones sin incapacidad o de pequeña entidad.',
        ejemplos: 'Pequeños cortes, contusiones, molestias menores.' }
    ],

    /**
     * Tabla 6 · Interpretación del Nivel de Probabilidad.
     * Bandas continuas equivalentes a la fórmula del Excel (L3): ≥24 Muy Alta,
     * >8 Alta, >4 Media, ≤4 Baja.
     */
    NP_BANDAS: [
      { limite: 24, nivel: 'Muy Alta', sigla: 'MA' },
      { limite: 8,  nivel: 'Alta',     sigla: 'A'  },
      { limite: 4,  nivel: 'Media',    sigla: 'M'  },
      { limite: -1, nivel: 'Baja',     sigla: 'B'  }
    ],

    /**
     * Tabla 9 · Nivel de Intervención (perfil estándar NTP 330, decisión del autor).
     * Rangos deterministas sin solapamientos (fuente: 330.pdf):
     *   I   : 600–4000
     *   II  : 150–599
     *   III : 40–149
     *   IV  : <40
     * Configuración centralizada (correcciones6 §2.6): mínimo, máximo, nivel,
     * significado, prioridad, acción recomendada y aceptabilidad.
     */
    NI_PERFIL_ESTANDAR: [
      { minimo: 600, maximo: 4000, ni: 'I', texto: 'Situación crítica. Corrección urgente.',
        prioridad: 'Urgente · actuación inmediata',
        accion: 'Detener la actividad o corregir de forma inmediata; implantar medidas de emergencia.',
        aceptable: 'No aceptable', fuente: '330.pdf · Tabla 9' },
      { minimo: 150, maximo: 599, ni: 'II', texto: 'Corregir y adoptar medidas de control.',
        prioridad: 'Alta · programar corrección',
        accion: 'Programar la corrección y adoptar medidas de control a corto plazo.',
        aceptable: 'No aceptable', fuente: '330.pdf · Tabla 9' },
      { minimo: 40, maximo: 149, ni: 'III', texto: 'Mejorar si es posible. Justificar la intervención y su rentabilidad.',
        prioridad: 'Media · mejorar si es posible',
        accion: 'Mejorar si es posible; justificar la intervención en función de su rentabilidad.',
        aceptable: 'Aceptable con control', fuente: '330.pdf · Tabla 9' },
      { minimo: 0, maximo: 39, ni: 'IV', texto: 'No intervenir, salvo que un análisis más preciso lo justifique.',
        prioridad: 'Baja · vigilar',
        accion: 'No intervenir, salvo que un análisis más preciso lo justifique; mantener vigilancia.',
        aceptable: 'Aceptable', fuente: '330.pdf · Tabla 9' }
    ],

    /**
     * Perfil alternativo documentado (umbrales usados en el dataset de la tesis:
     * I≥501 / II 121-500 / III 21-120 / IV≤20). Se conserva como referencia,
     * pero NO es el perfil activo (ver docs/adaptaciones.md).
     */
    NI_PERFIL_TESIS: [
      { minimo: 501, maximo: 4000, ni: 'I', texto: 'Situación crítica. Corrección urgente.',
        prioridad: 'Urgente · actuación inmediata',
        accion: 'Detener la actividad o corregir de forma inmediata.',
        aceptable: 'No aceptable', fuente: '330.pdf · Tabla 9' },
      { minimo: 121, maximo: 500, ni: 'II', texto: 'Corregir y adoptar medidas de control.',
        prioridad: 'Alta · programar corrección',
        accion: 'Programar la corrección y adoptar medidas de control a corto plazo.',
        aceptable: 'No aceptable', fuente: '330.pdf · Tabla 9' },
      { minimo: 21, maximo: 120, ni: 'III', texto: 'Mejorar si es posible. Justificar la intervención y su rentabilidad.',
        prioridad: 'Media · mejorar si es posible',
        accion: 'Mejorar si es posible; justificar la intervención en función de su rentabilidad.',
        aceptable: 'Aceptable con control', fuente: '330.pdf · Tabla 9' },
      { minimo: 0, maximo: 20, ni: 'IV', texto: 'No intervenir, salvo que un análisis más preciso lo justifique.',
        prioridad: 'Baja · vigilar',
        accion: 'No intervenir, salvo que un análisis más preciso lo justifique; mantener vigilancia.',
        aceptable: 'Aceptable', fuente: '330.pdf · Tabla 9' }
    ],

    /** Perfil activo. */
    NI_PERFIL: null,

    /** Factores de reducción de la evaluación residual (adaptación documentada). */
    RESIDUAL: {
      factoresCategoria: {
        'Eliminación': 0.1,
        'Sustitución': 0.3,
        'Controles de ingeniería': 0.55,
        'Controles administrativos': 0.8,
        'EPP': 0.95
      },
      reduccionMinima: 0.05
    }
  };

  /** Inicializa el perfil de NI (estándar por defecto). */
  NTP330.init = function (perfil) {
    if (perfil === 'tesis') {
      NTP330.NI_PERFIL = NTP330.NI_PERFIL_TESIS;
    } else {
      NTP330.NI_PERFIL = NTP330.NI_PERFIL_ESTANDAR;
    }
    return NTP330.NI_PERFIL;
  };

  /** Clasifica un ND continuo en su banda (fórmula nd.xlsx: >6 MD, >2 D, >0 M, =0 B). */
  NTP330.clasificarND = function (nd) {
    nd = +nd || 0;
    if (nd > 6) return { nivel: 'Muy Deficiente', sigla: 'MD', valor: 10, banda: NTP330.ND_BANDAS[0] };
    if (nd > 2) return { nivel: 'Deficiente', sigla: 'D', valor: 6, banda: NTP330.ND_BANDAS[1] };
    if (nd > 0) return { nivel: 'Mejorable', sigla: 'M', valor: 2, banda: NTP330.ND_BANDAS[2] };
    return { nivel: 'Aceptable', sigla: 'B', valor: 0, banda: NTP330.ND_BANDAS[3] };
  };

  /** Clasifica un NP continuo en su banda (≥24 MA, >8 A, >4 M, ≤4 B). */
  NTP330.clasificarNP = function (np) {
    np = +np || 0;
    for (var i = 0; i < NTP330.NP_BANDAS.length; i++) {
      var banda = NTP330.NP_BANDAS[i];
      var cumple = (i === 0) ? (np >= banda.limite) : (np > banda.limite);
      if (cumple) {
        return { nivel: banda.nivel, sigla: banda.sigla };
      }
    }
    return { nivel: 'Baja', sigla: 'B' };
  };

  /** Devuelve el nivel de exposición (objeto) por su valor 4/3/2/1. */
  NTP330.getNE = function (v) {
    for (var i = 0; i < NTP330.NE_NIVELES.length; i++) {
      if (NTP330.NE_NIVELES[i].valor === (+v)) return NTP330.NE_NIVELES[i];
    }
    return NTP330.NE_NIVELES[3];
  };

  /** Devuelve el nivel de consecuencias (objeto) por su valor 100/60/25/10. */
  NTP330.getNC = function (v) {
    for (var i = 0; i < NTP330.NC_NIVELES.length; i++) {
      if (NTP330.NC_NIVELES[i].valor === (+v)) return NTP330.NC_NIVELES[i];
    }
    return NTP330.NC_NIVELES[3];
  };

  /**
   * Clasifica un NR en Nivel de Intervención según el perfil activo.
   * Devuelve toda la información centralizada (correcciones6 §2.6):
   * nivel, significado, rango, prioridad, acción recomendada, aceptabilidad y fuente.
   * Es un cálculo 100 % automático derivado del NR (numeral 3.6), sin entrada manual.
   */
  NTP330.clasificarNivelIntervencion = function (nr) {
    if (!NTP330.NI_PERFIL) NTP330.init();
    nr = +nr || 0;
    var p = null;
    for (var i = 0; i < NTP330.NI_PERFIL.length; i++) {
      if (nr >= NTP330.NI_PERFIL[i].minimo) {
        p = NTP330.NI_PERFIL[i];
        break;
      }
    }
    if (!p) {
      var ult = NTP330.NI_PERFIL[NTP330.NI_PERFIL.length - 1];
      p = ult;
    }
    return {
      ni: p.ni,
      texto: p.texto,
      minimo: p.minimo,
      maximo: p.maximo,
      rango: (p.maximo === undefined) ? ('≥ ' + p.minimo) : (p.minimo + ' – ' + p.maximo),
      prioridad: p.prioridad,
      accion: p.accion,
      aceptable: p.aceptable,
      fuente: p.fuente || '330.pdf · Tabla 9'
    };
  };

  /** Clasifica un NR en Nivel de Intervención según el perfil activo. */
  NTP330.nivelIntervencion = function (nr) {
    return NTP330.clasificarNivelIntervencion(nr);
  };

  /** Formatea un número con 2 decimales sin signos raros. */
  NTP330.fmt = function (v) {
    var n = Math.round((+v || 0) * 100) / 100;
    return (Math.abs(n) < 0.005) ? '0' : String(n);
  };

  /** Etiqueta corta de una clasificación. */
  NTP330.sigla = function (o) { return (o && o.sigla) ? o.sigla : ''; };

  // Inicialización por defecto
  NTP330.init('estandar');

})();

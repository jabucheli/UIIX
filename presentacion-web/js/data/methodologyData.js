window.METODOLOGIA = {
  title: 'Metodología',
  subtitle: 'DISEÑO METODOLÓGICO DE LA INVESTIGACIÓN DOCTORAL',
  ui: {
    hint: 'Clic para ampliar',
    hintRama: 'Clic en una rama del mapa para ampliarla',
    cerrar: 'Clic de nuevo o tecla ESC para volver'
  },
  enfoque: {
    header: '01 · ENFOQUE, DISEÑO Y TIPO DE INVESTIGACIÓN',
    flow: [
      { tag: 'ENFOQUE', main: 'Mixto', det: 'Métodos cuali + cuanti', color: 'green' },
      { tag: 'DISEÑO', main: 'Secuencial exploratorio', det: 'Fases sucesivas', color: 'red' },
      { tag: 'FASE CUALITATIVA', det: 'Fundamenta instrumentos', color: 'green' },
      { tag: 'FASE CUANTITATIVA', det: 'Valora riesgos', color: 'red' },
      { tag: 'INTEGRACIÓN', det: 'Sustenta estrategia y validación', color: 'green' }
    ],
    types: [
      { t: 'FINALIDAD', d: 'Aplicada + propositiva' },
      { t: 'MANIPULACIÓN', d: 'No experimental' },
      { t: 'TEMPORALIDAD', d: 'Transversal' }
    ],
    pilot: '<b>APLICACIÓN PILOTO ≠ EXPERIMENTO</b>: sin manipulación deliberada · sin comparación pre/post · sin grupos de control.',
    synthesis: '<b>Síntesis doctoral:</b> cualitativa → cuantitativa → integración aseguran trazabilidad: norma, medición, estrategia y validación.'
  },
  phasesHeader: '02 · ESTRUCTURA METODOLÓGICA · CINCO FASES',
  phases: [
    { num: '1', color: 'green', kind: 'CUALITATIVA', name: 'Revisión normativa', det: 'D.E. 255 · ISO 45001 · NTP 324/330', out: 'matriz procesos–riesgos' },
    { num: '2', color: 'red', kind: 'CUALITATIVA', name: 'Cuestionarios de chequeo', det: 'Requisitos → indicadores verificables', out: 'NTP 324 → ND' },
    { num: '3', color: 'green', kind: 'CUANTITATIVA', name: 'Aplicación piloto', det: 'Observación en obra · NTP 330: ND·NP·NR·NI', out: 'jerarquizar riesgos' },
    { num: '4', color: 'red', kind: 'MIXTA', name: 'ART + controles de ingeniería', det: 'Tarea → peligro → riesgo → control', out: 'ART + controles' },
    { num: '5', color: 'green', kind: 'MIXTA', name: 'Validación integral', det: 'Criterio experto · Delphi', out: '3 rondas → consenso' }
  ],
  pipeline: ['NORMA', 'VERIFICACIÓN', 'MEDICIÓN', 'INTERVENCIÓN', 'VALIDACIÓN'],
  mapa: {
    center: {
      icon: 'trend',
      title: ['METODOLOGÍA ·', 'POBLACIÓN Y', 'MUESTRA'],
      sub: 'Integración secuencial de población, muestra, métodos, técnicas e instrumentos.'
    },
    ramas: [
      {
        n: '1', color: 'green', icon: 'book', pos: 'lt',
        title: 'Fase 1 · Revisión normativa y fundamentación teórica',
        sub: 'Base documental',
        chips: ['2024–2026', 'NTP 324/330'],
        pob: [
          { k: 'P', v: 'Fuentes normativas, técnicas y científicas.' },
          { k: 'M', v: 'Documentos seleccionados.' },
          { k: 'Mt', v: 'Intencionada · no probabilística.' },
          { k: 'C', v: 'Relevancia, vigencia y aplicabilidad.' }
        ],
        mti: [
          { m: 'Analítico-documental.', t: 'Revisión documental y análisis comparativo.', i: 'Fichas legales y matrices de requisitos.' }
        ],
        prod: ''
      },
      {
        n: '2', color: 'red', icon: 'clipboard', pos: 'rt',
        title: 'Fase 2 · Elaboración de cuestionarios',
        sub: 'Construcción de instrumentos',
        chips: [],
        pob: [
          { k: 'P', v: 'Base documental de las fases 1–2.' },
          { k: 'M', v: 'Requisitos de documentos técnicos legales' },
          { k: 'Mt', v: 'Intencionada · no probabilística.' },
          { k: 'C', v: 'Pertinencia normativa y aplicabilidad.' }
        ],
        mti: [
          { m: 'Inductivo-categorial.', t: 'Análisis de contenido y categorización.', i: 'Listas de chequeo y cuestionarios NTP 324.' }
        ],
        prod: 'Determinación del ND.'
      },
      {
        n: '3', color: 'green', icon: 'building', pos: 'rb',
        title: 'Fase 3 · Aplicación piloto y evaluación de riesgos',
        sub: 'Etapa de campo',
        chips: ['12 procesos', '21 riesgos', '106+83 aplicaciones*'],
        pob: [
          { k: 'P', v: 'Procesos, riesgos y proyectos de Quito.' },
          { k: 'M', v: 'Proyectos reales seleccionados.' },
          { k: 'Mt', v: 'Intencionada · no probabilística.' },
          { k: 'C', v: 'Pertinencia y presencia en obra.' }
        ],
        mti: [
          { m: 'Descriptivo y analítico de campo.', t: 'Observación directa y registro técnico.', i: 'Fichas de campo y matrices NTP 330.' }
        ],
        prod: 'ND → NE → NP → NC → NR → NI.'
      },
      {
        n: '4', color: 'red', icon: 'target', pos: 'lb',
        title: 'Fase 4 · ART y priorización de tareas críticas',
        sub: 'Selección según resultados de la NTP 330',
        chips: [],
        pob: [
          { k: 'P', v: 'Actividades evaluadas.' },
          { k: 'M', v: 'Tareas críticas seleccionadas.' },
          { k: 'Mt', v: 'Intencionada por criticidad.' },
          { k: 'C', v: 'Riesgos intolerables (NTP 330).' }
        ],
        mti: [
          { m: 'Triangulación y desarrollo instrumental.', t: 'Análisis de riesgos y revisión de ART.', i: 'Formatos ART y controles de ingeniería.' }
        ],
        prod: 'Controles sobre fuente, medio y condiciones de ejecución.'
      },
      {
        n: '5', color: 'green', icon: 'check', pos: 'cb',
        title: 'Fase 5 · Validación',
        sub: 'Juicio de expertos – Delphi',
        chips: ['8 validadores', '3 rondas Delphi'],
        pob: [
          { k: 'P', v: 'Expertos en SST y prevención.' },
          { k: 'M', v: '8 validadores seleccionados.' },
          { k: 'Mt', v: 'Intencionada · criterio experto.' },
          { k: 'C', v: 'Formación, experiencia y trayectoria.' }
        ],
        mti: [
          { m: 'Delphi.', t: 'Juicio experto y consulta estructurada.', i: 'Likert 1–5 y matrices comparativas.' }
        ],
        prod: 'Validación de pertinencia, coherencia y aplicabilidad.'
      }
    ]
  },
  ruta: [
    { t: 'Marco normativo', c: 'green' },
    { t: 'Instrumentos', c: 'red' },
    { t: 'Diagnóstico', c: 'green' },
    { t: 'ART y priorización', c: 'red' },
    { t: 'Validación', c: 'green' }
  ],
  note: '* 106 (edificación) + 83 (infraestructura): aplicaciones piloto; evidencia de campo, no universo estadístico.'
};
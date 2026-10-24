window.PROBLEMA = {
  title: 'Problematización',
  evidenceLabel: 'EVIDENCIA',
  historical: [
    { period: '2014–2019', stats: [
      { value: '5.927', caption: 'accidentes laborales en construcción' },
      { value: '167', caption: 'trabajadores fallecidos en obra' }
    ] },
    { period: '2024', note: 'De un total de 16.067 accidentes laborales reportados', stats: [
      { value: '508', caption: 'accidentes del sector construcción' },
      { value: '20', caption: 'casos mortales en obra' }
    ] }
  ],
  donut: {
    percent: 64,
    label: 'corresponde a obreros con lesiones graves y muy graves con incapacidad laboral, en estos 6 años murieron 167 obreros',
    caption: '3.807 de 5.927 · 2014–2019'
  },
  bars: {
    title: 'Acciones que más exponen al trabajador',
    source: 'CAMICON · 2018',
    items: [
      { label: 'No señalar o advertir el peligro - Evaluar riesgos', value: 45.3 },
      { label: 'Falla en asegurar adecuadamente', value: 10.6 },
      { label: 'Falta de coordinación en operaciones', value: 5.1 },
      { label: 'Adoptar una posición inadecuada', value: 4.5 },
      { label: 'Colocar la carga de manera incorrecta', value: 4.0 },
      { label: 'Usar mal o no usar el EPP', value: 2.4 }
    ]
  },
  footnote: '2024: 3,16% de los accidentes nacionales (508 de 16.067) · 27,17% concentrados en Pichincha',
  sources: [
    { n: 1, text: '5.927 accidentes, 167 fallecidos y 64% obreros (2014–2019) — P. González (2023) · SGRT–IESS' },
    { n: 2, text: '508 accidentes, 20 mortales y 27,17% en Pichincha (2024) — DAIE–IESS (2026)' },
    { n: 3, text: 'Acciones que más exponen al trabajador — CAMICON (2020)' }
  ],
  flow: [
    { tag: 'CONTEXTO', color: '#4e7f9d', icon: 'building', title: 'Contexto del sector', body: 'Pilar de la economía — 7,9% del PIB · 6.206 empresas · 158.303 empleos' },
    { tag: 'CAUSAS', color: '#b8822f', icon: 'hardhat', title: 'Condiciones de riesgo laboral', body: 'Mano de obra no calificada · gestión reactiva · altura, excavación e izaje', tall: true },
    { tag: 'DEFICIENCIAS', color: '#c26a1e', icon: 'clipboard', title: 'Limitaciones de la gestión de riesgos', body: 'Prevención como requisito legal, no cultura · evaluación cualitativa y fragmentada', tall: true },
    { tag: 'PROBLEMA', color: '#a5151f', icon: 'target', title: 'PROBLEMA CENTRAL', body: 'Ausencia de una metodología integral que articule la identificación, evaluación y control de riesgos desde un enfoque de ingeniería', central: true },
    { tag: 'EFECTOS', color: '#c0242a', icon: 'trend', title: 'Consecuencias', body: 'Accidentes, incapacidades y fatalidades · costo humano y económico — 2,78 M muertes/año (OIT)' },
    { tag: 'BRECHA', color: '#7d3b5e', icon: 'balance', title: 'Brecha de gestión', body: 'Marco normativo vigente sin materialización efectiva en obra — D.E. 255-2024 · AM-MDT-2025-122 · AM-MDT-2024-196 (Anexo 3) · C.D. 513 (IESS) - Estrategia metodológica de gestión de proyectos basada en controles de ingeniería', tall: true },
    { tag: 'PREGUNTA CIENTÍFICA', color: '#0a7a55', icon: 'flag', title: '', body: '¿Cómo contribuir a la mejora de condiciones de seguridad laboral y la prevención de riesgos en proyectos de construcción de la ciudad de Quito, en conformidad con la normativa ecuatoriana vigente entre 2024 y 2026?', green: true }
  ],
  hierarchy: {
    focus: 'Foco: controles de ingeniería',
    levels: ['Eliminación', 'Sustitución', 'Controles de ingeniería', 'Controles administrativos', 'EPP'],
    source: 'Jerarquía de controles · C.D. 513 (art. 53)'
  },
  justHeader: 'JUSTIFICACIÓN',
  studyObjectHeader: 'OBJETO DEL ESTUDIO',
  studyObject: 'Diseño de cuestionarios de chequeo NTP 324 basados en normativa local (2024-2026) para la generación de ART como mecanismo de prevención.',
  studyObjectFull: 'El objeto de estudio es una estrategia metodológica de gestión de proyectos basada en controles de ingeniería, que integra NTP 324 para determinar deficiencias, NTP 330 para evaluar riesgos y generación de ART para definir controles sobre actividades críticas',
  actionFieldHeader: 'CAMPO DE ESTUDIO',
  actionField: 'Proyectos de edificaciones e infraestructura básica en Quito.',
  justifications: [
    { icon: 'book', title: 'TEÓRICA', body: 'La investigación integra normativa, evaluación técnica del riesgo y controles de ingeniería en una sola metodología', color: 'green' },
    { icon: 'wrench', title: 'PRÁCTICA', body: 'Controles de ingeniería aplicables en obra — AM-MDT-2025-122 · AM-MDT-2024-196 (Anexo 3) y NTP 330', extra: ', como parte de la estrategia metodológica de dirección de proyectos basada en controles de ingeniería', color: 'red' },
    { icon: 'users', title: 'SOCIAL', body: 'Protege la vida y salud de trabajadores, familias y comunidad', extra: ' · reducción de accidentalidad', color: 'green' },
    { icon: 'user', title: 'PERSONAL', body: 'Experiencia profesional en proyectos de construcción e identificación de una brecha entre exigencias normativas y su aplicación efectiva en obra', color: 'red' }
  ]
};

window.PROBLEMA = {
  title: 'PROBLEMATIZACIÓN',
  evidenceLabel: 'EVIDENCIA',
  historical: [
    { period: '2014–2019', stats: [
      { value: '5.927', caption: 'accidentes laborales en construcción' },
      { value: '167', caption: 'trabajadores fallecidos en obra' }
    ] },
    { period: '2024', stats: [
      { value: '508', caption: 'accidentes del sector construcción' },
      { value: '20', caption: 'casos mortales en obra' }
    ] }
  ],
  donut: {
    percent: 64,
    label: 'de los accidentes corresponden a obreros dentro de las obras',
    caption: '3.807 de 5.927 · 2014–2019'
  },
  bars: {
    title: 'Acciones que más exponen al trabajador',
    source: 'CAMICON · 2018',
    items: [
      { label: 'No señalar o advertir el peligro', value: 45.3 },
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
    { tag: 'BRECHA', color: '#7d3b5e', icon: 'balance', title: 'Brecha de gestión', body: 'Marco normativo vigente sin materialización efectiva en obra — D.E. 255-2024 · AM-MDT-2025-122 · AM-MDT-2024-196 (Anexo 3) · C.D. 513 (IESS)', tall: true },
    { tag: 'NECESIDAD', color: '#0a7a55', icon: 'flag', title: 'Necesidad de investigación', body: 'Estrategia metodológica de gestión de proyectos basada en controles de ingeniería', green: true }
  ],
  hierarchy: {
    focus: 'Foco: controles de ingeniería',
    levels: ['Eliminación', 'Sustitución', 'Controles de ingeniería', 'Controles administrativos', 'EPP'],
    source: 'Jerarquía de controles · C.D. 513 (art. 53)'
  },
  justHeader: 'JUSTIFICACIÓN',
  studyObjectHeader: 'OBJETO DEL ESTUDIO',
  studyObject: 'Estructurar una estrategia metodológica de gestión de proyectos basada en controles de ingeniería para mejorar la seguridad laboral y prevenir riesgos en proyectos de edificaciones e infraestructura en Quito (2024–2026).',
  actionFieldHeader: 'CAMPO DE ESTUDIO',
  actionField: 'Proyectos de edificaciones e infraestructura básica en Quito (público/privado).',
  justifications: [
    { icon: 'book', title: 'TEÓRICA', body: 'Aporta conocimiento científico a la prevención de riesgos en construcción', color: 'green' },
    { icon: 'wrench', title: 'PRÁCTICA', body: 'Controles de ingeniería aplicables en obra — AM-MDT-2025-122 · AM-MDT-2024-196 (Anexo 3) y NTP 330', color: 'dark' },
    { icon: 'users', title: 'SOCIAL', body: 'Protege la vida y salud de trabajadores, familias y comunidad', color: 'red' },
    { icon: 'user', title: 'PERSONAL', body: 'Compromiso profesional del investigador con la seguridad laboral', color: 'light' }
  ]
};

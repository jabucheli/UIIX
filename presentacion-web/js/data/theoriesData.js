window.TEORIAS = {
  tag: 'MARCO TEÓRICO',
  title: 'Teorías, conceptos y referentes normativos o legales',
  subtitle: 'Estado del arte → contexto → teorías base → enfoque integrado → marco legal',
  justificacion: '&#8220;Diseño de estrategias de control de ingeniería para la gestión de prevención de riesgos laborales en proyectos de construcción de la ciudad de Quito&#8221; es un mecanismo requerido por la inminente presencia de proyectos públicos y privados existentes y proyectados para dinamizar la economía del Ecuador. Es importante mencionar el estudio abordado presenta un interés regional e incluso mundial, por ejemplo, la tesis doctoral de Suárez Sánchez (2021) constituye un antecedente pertinente para la presente investigación, ya que aborda la gestión de los riesgos laborales en el sector de la construcción desde una perspectiva técnica y cuantitativa, mediante un modelo de simulación y predicción aplicado a edificios en Colombia. Su aporte principal radica en demostrar que la accidentalidad en obra puede estudiarse de manera sistemática a partir de variables de riesgo, lo que permite fortalecer la toma de decisiones en seguridad y salud ocupacional.',
  introFlow: [
    ['GESTIÓN DE PROYECTOS', 'SEGURIDAD Y SALUD', 'CONTROLES DE INGENIERÍA'],
    ['TOMA DE DECISIONES', 'OPTIMIZACIÓN DE RECURSOS', 'MENOR IMPACTO NEGATIVO'],
    ['GESTIÓN PREVENTIVA ÉTICA · TÉCNICA · SOSTENIBLE']
  ],
  gallery: [
    { cls: '', h: 'Estado del Arte', lines: '<b>EVOLUCIÓN:</b> obligación legal → prevención → gestión sistémica → control de ingeniería.', ref: '' },
    {
      cls: 'red', h: 'Marco histórico', focus: 'hist', lines: '<b>Secuencia normativa clave en Ecuador</b>', ref: '(Chancusi et al., 2018; Reglamento de Seguridad y Salud en el Trabajo, 2024; Ministerio de Trabajo, 2025)',
      timeline: [
        { y: '1921–1929', t: 'Ley de Accidentes de Trabajo → Ley de Prevención de Accidentes → Ley de Responsabilidad por Accidentes.' },
        { y: '1978', t: 'Decreto Supremo No. 2213: prestaciones por accidentes de trabajo y enfermedades profesionales.' },
        { y: '1986', t: 'D.E. 2393: Reglamento de Seguridad y Salud de los Trabajadores.' },
        { y: '2024', t: 'D.E. 255-2024 reemplaza al D.E. 2393 y actualiza el Reglamento de SST. AM MDT-2024-196 (3 Anexos).' },
        { y: '2025', t: 'AM MDT-2025-122: Reglamento de Seguridad en el Trabajo y Prevención de Riesgos Laborales para la Construcción y Obras Públicas y Privadas.' }
      ]
    },
    {
      cls: '', h: 'Marco contextual actual', focus: 'ctx',
      ctxSub: 'Condiciones económicas y políticas',
      ctx: [
        { n: '1', t: 'Contexto del sector', tone: 'g', lines: ['Pilar de la economía', 'Contribuye al PIB', 'Generador de empleo'] },
        { n: '2', t: 'Desempeño económico', tone: 'r', lines: ['Economía 2023: 1,5 %', 'Construcción 2022: 1,1 %', 'Construcción 2024: 1,7 %'] },
        { n: '3', t: 'PIB construcción', tone: 'g', lines: ['USD 10.887 millones (2023)', 'USD 11.179 millones (2024)', 'Fuente: BCE / EKOS'] },
        { n: '4', t: 'Empleo y concentración', tone: 'r', lines: ['6,3 % del empleo nacional', '521.599 contrataciones', 'Guayas 36,2 % · Pichincha 33,4 %'] },
  { n: '5', t: 'Siniestralidad laboral', tone: 'g', lines: ['PEA 2017: 8.084.382', '22.405 accidentes', '1.044 enfermedades profesionales'] },
  { n: '6', t: 'Marco regulatorio', tone: 'r', lines: ['SGRT – IESS', 'Ministerio del Trabajo', 'Normativa obligatoria'] },
  { n: '7', t: 'Responsabilidad patronal', tone: 'g', lines: ['Auditoría técnico-administrativa', 'Indemnizaciones y sanciones', 'Prevención como obligación'] },
  { n: '8', t: 'Perspectiva técnica y sistémica', tone: 'r', lines: ['Suárez Sánchez (2021)', 'Nørgaard (2018)', 'Prevención integrada a la dirección de proyectos'] }
      ],
      ref: '(Zabala & Guamán, 2024; Toro et al., 2021; Suárez Sánchez, 2021; Nørgaard, 2018)'
    },
    {
      cls: 'red', h: 'Aplicación', focus: 'apl',
      flow: [
        { kw: 'DISEÑO DE ESTRATEGIAS DE INGENIERÍA', det: 'mecanismo requerido por proyectos públicos y privados existentes y proyectados → dinamiza la economía del Ecuador' },
        { kw: 'INTERÉS REGIONAL Y MUNDIAL', det: 'antecedente: tesis doctoral Suárez Sánchez (2021) — simulación y predicción aplicada a edificios' },
        { kw: 'APORTE PRINCIPAL', det: 'accidentalidad en obra analizada sistemáticamente → fortalece la toma de decisiones en SST' }
      ]
    },
    { cls: '', h: 'Marco Teórico — Técnicas aplicadas', nflow: true }
  ],
  theories: [
    { num: 'TEORÍA 01', name: 'Gestión basada en riesgo', key: '<b>IDENTIFICAR</b> → <b>EVALUAR</b> → <b>CONTROLAR</b>', accent: false, text: '<b>Criterios cuantificables</b> · toma de decisiones · reducción de siniestros · <b>OSH-PRM</b> · criticidad · asignación de recursos preventivos.', apa: '(Ganiyev et al., 2024; Sousa et al., 2015)' },
    { num: 'TEORÍA 02', name: 'Sistemas de gestión de SST', key: '<b>ISO 45001</b> · <b>PDCA</b> · mejora continua', accent: true, text: '<b>Marco estructural</b> · Planificar–Hacer–Verificar–Actuar · identificación de peligros · evaluación de riesgos · mejora del desempeño.', apa: '(International Organization for Standardization, 2018; Viswanathan et al., 2024)' },
    { num: 'TEORÍA 03', name: 'Jerarquía de controles', key: '<b>ACTUAR SOBRE LA FUENTE</b>', accent: false, text: '<b>Eliminación</b> → sustitución → <b>controles de ingeniería</b> → controles administrativos → EPP. Prioridad a medidas con mayor eficacia preventiva.', apa: '(National Institute for Occupational Safety and Health [NIOSH], 2026; Ajslev et al., 2022)' },
    { num: 'TEORÍA 04', name: 'Sostenibilidad + gestión de proyectos', key: '<b>RESILIENCIA</b> · <b>IA</b> · <b>BIM</b> · datos', accent: true, text: '<b>Seguridad = desempeño organizacional y social</b> · sostenibilidad social · resiliencia · impacto en el entorno · inteligencia artificial · modelación predictiva · BIM · gestión precisa y predictiva.', apa: '(Kathayat et al., 2025; Tong et al., 2025)' }
  ],
  flowTitle: 'ENFOQUE INTEGRADO DE LA INVESTIGACIÓN',
  flow: [
    { name: 'Cuestionarios de chequeo', text: 'Criterios normativos estructurados', red: false },
    { name: 'Evaluación de riesgos', text: 'Metodologías reconocidas', red: true },
    { name: 'Análisis de riesgo en el trabajo', text: 'Identificación + valoración + control', red: false },
    { name: 'Propuesta metodológica', text: 'Técnica · sistémica · mejora continua · estándares + normativa vigente', red: true }
  ],
  numerals: [
    ['Principios de Seguridad', 'y Salud'],
    ['Estrategias de Control', 'de Ingeniería'],
    ['Identificación y Evaluación', 'de Riesgos'],
    ['Gestión Integrada', 'de SST']
  ],
  legalTitle: 'Marco Legal y Normativo',
  legalText: '<b>D.E. 255-2024</b> · <b>AM-MDT-2024-196</b> · <b>AM-MDT-2025-122</b> · IESS / SGRT',
  legalHint: 'Jerarquía de instrumentos aplicables en Ecuador',
  legalHierarchy: [
    { n: '1', name: 'Constitución de la República del Ecuador', det: 'Art. 326, num. 5' },
    { n: '2', name: 'Convenios internacionales — OIT', det: 'Convenio 155' },
    { n: '3', name: 'Leyes orgánicas y ordinarias', det: 'Código del Trabajo · LOSEP' },
    { n: '4', name: 'Decretos ejecutivos', det: 'D.E. 255-2024' },
    { n: '5', name: 'Acuerdos ministeriales', det: 'AM-MDT-2024-196 · AM-MDT-2025-122' },
    { n: '6', name: 'Resoluciones y normas técnicas', det: 'IESS / SGRT' }
  ]
};
window.RESULTADOS = {
  title: 'Resultados',
  subtitle: 'Procesos por actividad, riesgos asociados y aplicación de instrumentos (Fases 1 y 2)',
  ui: {
    hint: 'Clic en un bloque para ampliarlo · clic de nuevo o tecla ESC para volver'
  },
  procesos: {
    num: '1',
    header: 'Procesos por actividad',
    icon: 'building',
    color: 'green',
    total: 12,
    totalLabel: 'TOTAL',
    totalUnit: 'procesos constructivos',
    groups: [
      {
        name: 'Infraestructura',
        color: 'green',
        count: 5,
        unit: 'procesos',
        image: 'assets/procesos1.png',
        items: [
          'Obras preliminares',
          'Movimiento de tierras',
          'Obras complementarias (pozos y estructuras auxiliares)',
          'Trabajos en zanjas (tubería)',
          'Relleno'
        ]
      },
      {
        name: 'Edificación',
        color: 'red',
        count: 7,
        unit: 'procesos',
        image: 'assets/procesos2.png',
        items: [
          'Obras preliminares',
          'Movimiento de tierras',
          'Estructura de hormigón armado',
          'Estructura metálica',
          'Instalaciones eléctricas',
          'Instalaciones hidrosanitarias',
          'Acabados'
        ]
      }
    ]
  },
  dist: {
    header: 'Distribución por tipo de proyecto',
    parts: [
      { name: 'Infraestructura', color: 'green', value: 5 },
      { name: 'Edificación', color: 'red', value: 7 }
    ]
  },
  riesgos: {
    num: '2',
    header: 'Riesgos asociados por actividad',
    icon: 'hardhat',
    color: 'red',
    series: [
      { name: 'Infraestructura', color: 'green', total: 23, seg: 17, comp: 6, image: 'assets/riesgos2.png' },
      { name: 'Edificación', color: 'red', total: 21, seg: 15, comp: 6, image: 'assets/riesgos1.png' }
    ],
    groups: [
      {
        label: 'Seguridad',
        color: 'green',
        items: ['Locativos', 'Mecánicos', 'Eléctricos', 'Industriales mayores']
      },
      {
        label: 'Complementarios',
        color: 'red',
        items: ['Físicos', 'Químicos', 'Ergonómicos']
      }
    ],
    noteTitle: 'Nota de clasificación',
    noteMain: 'La clasificación integra riesgos de seguridad y riesgos complementarios.',
    noteSub: 'Seguridad: locativos, mecánicos, eléctricos e industriales mayores · Complementarios: físicos, químicos y ergonómicos.',
    noteMec: 'Los riesgos mecánicos forman parte de los riesgos de seguridad.'
  },
  instrumentos: {
    num: '3',
    header: 'Aplicación de instrumentos',
    icon: 'clipboard',
    color: 'green',
    context: 'Riesgo de seguridad: <b>Locativo</b> · Organización incorrecta del trabajo',
    link: 'Sistematización técnico-legal → criterios verificables',
    fases: [
      {
        n: 'FASE 1',
        color: 'green',
        title: 'Revisión normativa y fundamentación teórica',
        text: 'Sistematización de requisitos técnico-legales para construir criterios verificables.',
        table: 'Tabla 17. Extracto del instrumento',
        image: 'assets/ref-norm.png',
        cols: ['N°', 'Acción sujeta a evaluación', 'Base normativa'],
        colw: [22, null, 56],
        rows: [
          ['1', '¿Se cuenta con la certificación de competencias laborales en prevención de riesgos laborales?', 'A.M. 122'],
          ['2', '¿Se identifican y evalúan los riesgos locativos?', 'A.M. 196'],
          ['3', '¿Las áreas de almacenamiento de materiales son seguras y adecuadas para los trabajadores?', 'A.M. 196'],
          ['4', '¿Se dispone de un plan de emergencia en los lugares donde se almacenan agentes peligrosos?', 'A.M. 196']
        ],
        msg: ['Normativa', 'requisito técnico', 'criterio verificable']
      },
      {
        n: 'FASE 2',
        color: 'red',
        title: 'Elaboración de cuestionarios de chequeo',
        text: 'Traducción de criterios normativos a ítems observables para determinar niveles de deficiencia.',
        table: 'Tabla 18. Extracto del cuestionario de chequeo',
        image: 'assets/c-cheq.png',
        cols: ['N°', 'Ítem', 'NDR', 'NDP'],
        colw: [22, null, 36, 42],
        rows: [
          ['1', 'Certificación de competencias laborales', '10', '1.35'],
          ['2', 'Identificación y evaluación de riesgos locativos', '10', '1.35'],
          ['3', 'Almacenamiento seguro de materiales', '6', '0.81'],
          ['4', 'Plan de emergencia para agentes peligrosos', '10', '1.35']
        ],
        msg: ['Criterio verificable', 'ítem observable', 'NDR', 'NDP']
      }
    ]
  },
  secuencia: [
    { t: 'Procesos por actividad', c: 'green' },
    { t: 'Riesgos asociados', c: 'red' },
    { t: 'Fase 1: revisión normativa', c: 'green' },
    { t: 'Fase 2: cuestionario de chequeo', c: 'red' }
  ]
};

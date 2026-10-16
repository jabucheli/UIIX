window.RECOMENDACIONES = {
  title: 'RECOMENDACIONES',
  subtitle: 'Proyección metodológica, aplicación práctica y continuidad académica',

  /* Tres ámbitos que replican RECOMENDACIONES.docx. El metodológico y el
     académico van en verde; el práctico (bloques 3-5) en rojo, como foco
     operativo prioritario. Cada subbloque lleva número, título, palabras
     clave, una línea de sentido y la franja final de síntesis; el detalle
     (modal) amplía sin salir del documento. */
  ambitos: [
    {
      key: 'met',
      color: 'green',
      icono: 'wrench',
      titulo: 'ÁMBITO METODOLÓGICO',
      subtitulo: 'Fortalecer instrumentos y enfoques',
      subs: [
        {
          key: 'rc1',
          num: '1',
          icono: 'clipboard',
          titulo: 'AMPLIACIÓN DE INSTRUMENTOS',
          modo: 'radial',
          hub: 'Cuestionario de chequeo',
          radios: ['Físicos', 'Químicos', 'Biológicos', 'Ergonómicos', 'Psicosociales'],
          ntp: ['NTP 324', 'NTP 330'],
          sentido: 'Más allá de los riesgos de seguridad.',
          cierre: 'Herramienta más integral',
          detalle: [
            'Ampliar los cuestionarios a riesgos físicos, químicos, biológicos, ergonómicos y psicosociales.',
            'Mantener la lógica NTP 324 + NTP 330 como referencia técnica.',
            'Favorecer una herramienta más integral de seguridad y salud en el trabajo.'
          ]
        },
        {
          key: 'rc2',
          num: '2',
          icono: 'trend',
          titulo: 'ENFOQUE CUANTITATIVO O MIXTO',
          modo: 'flujo2',
          kws: ['Objetividad', 'Trazabilidad', 'Comparabilidad', 'Menor subjetividad'],
          sentido: 'Consistencia y evidencia en la evaluación.',
          cierre: 'Evaluación más consistente',
          detalle: [
            'Sostener enfoques cuantitativos o mixtos en los futuros estudios.',
            'Fortalecer la objetividad, la trazabilidad y la comparabilidad.',
            'Reducir la subjetividad en la valoración de los riesgos.'
          ]
        }
      ]
    },
    {
      key: 'prac',
      color: 'red',
      icono: 'hardhat',
      titulo: 'ÁMBITO PRÁCTICO',
      subtitulo: 'Aplicación operativa en obra',
      subs: [
        {
          key: 'rc3',
          num: '3',
          icono: 'users',
          titulo: 'SOCIALIZACIÓN DE LOS ART',
          modo: 'flujo2',
          kws: ['Trabajadores', 'Supervisores', 'Equipos técnicos', 'SST'],
          sentido: 'Difusión sistemática entre los actores de obra.',
          cierre: 'Comprensión de tareas, riesgos y controles',
          detalle: [
            'Divulgar los ART entre trabajadores, supervisores y equipos técnicos.',
            'Reforzar la comprensión de tareas, riesgos y medidas de control.',
            'Contribuir al cumplimiento del MDT-2025-122.'
          ]
        },
        {
          key: 'rc4',
          num: '4',
          icono: 'balance',
          titulo: 'ALINEACIÓN NORMATIVA',
          modo: 'radial',
          hub: 'Alineación normativa',
          radios: ['Entidades públicas', 'Entidades privadas', 'SST', 'Cuestionarios', 'Evaluación'],
          ntp: ['Normativa ecuatoriana', 'ART'],
          sentido: 'SST alineada con la normativa ecuatoriana.',
          cierre: 'Gestión preventiva verificable',
          detalle: [
            'Alinear la gestión de SST con la normativa ecuatoriana.',
            'Integrar cuestionarios, evaluación de riesgos y ART.',
            'Asegurar una gestión preventiva verificable.'
          ]
        },
        {
          key: 'rc5',
          num: '5',
          icono: 'gear',
          titulo: 'ACTUALIZACIÓN PERMANENTE',
          modo: 'flujo2',
          kws: ['Revisión continua', 'Cambios normativos', 'Cambios técnicos', 'Cambios operativos'],
          sentido: 'Instrumentos vivos ante cada cambio.',
          cierre: 'Ajuste oportuno en obra',
          detalle: [
            'Considerar los cuestionarios como instrumentos dinámicos.',
            'Revisarlos ante cambios normativos, técnicos y operativos.',
            'Garantizar la coherencia regulatoria y el ajuste oportuno en obra.'
          ]
        }
      ]
    },
    {
      key: 'aca',
      color: 'green',
      icono: 'book',
      titulo: 'ÁMBITO ACADÉMICO',
      subtitulo: 'Proyección investigativa',
      subs: [
        {
          key: 'rc6',
          num: '6',
          icono: 'flask',
          titulo: 'BASE PARA FUTURAS INVESTIGACIONES',
          modo: 'flujoV',
          kws: ['Estrategia validada', 'Método Delphi', 'Aplicaciones longitudinales en obra', 'Indicadores preventivos', 'Reducción de incidentes', 'Eficacia de controles', 'Adopción técnica'],
          sentido: 'La estrategia validada como punto de partida.',
          cierre: 'Contraste empírico y continuidad académica',
          detalle: [
            'Usar la estrategia validada como base para estudios futuros.',
            'Promover aplicaciones longitudinales que confirmen los hallazgos.',
            'Incorporar indicadores preventivos, reducción de incidentes y eficacia de controles.'
          ]
        }
      ]
    }
  ],

  /* Banda inferior: síntesis operacional que cierra la presentación. */
  flujo: [
    { t: 'Ampliar', icono: 'wrench', color: 'green' },
    { t: 'Aplicar', icono: 'hardhat', color: 'red' },
    { t: 'Actualizar', icono: 'refresh', color: 'green' },
    { t: 'Investigar', icono: 'trend', color: 'red' }
  ]
};

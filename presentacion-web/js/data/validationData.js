/* Diapositiva 10 · PROCESO DE VALIDACIÓN DE LA PROPUESTA (1Validacion.md).
   Contenido tomado literalmente de Validacion.docx: método Delphi con 8
   expertos en 3 rondas (Ronda 1 aceptación inicial, Ronda 2 evaluación técnica,
   Ronda 3 consenso final). Solo datos: sin HTML ni estilos. Las tablas que se
   abren al hacer clic en cada bloque viven aquí (modal.rondas). */
window.VALIDACION = {
  title: 'Proceso de validación de la propuesta',
  subtitle: 'Método Delphi con expertos · estructura de rondas, criterios de análisis y resultados globales',
  nota: 'La validación permitió valorar pertinencia, coherencia, aplicabilidad, viabilidad y aporte técnico-científico.',

  /* Nodo central del mapa. */
  core: {
    titulo: ['Validación', 'de la propuesta'],
    metodo: 'Método Delphi',
    detalle: '3 rondas · 8 expertos',
    criterios: 'Pertinencia · coherencia · aplicabilidad · viabilidad · aporte técnico-científico'
  },

  /* Rama izquierda: panel de expertos. */
  panel: {
    titulo: 'Panel de expertos',
    icono: 'users',
    expertos: '8 expertos',
    areas: [
      'Dirección de proyectos',
      'Investigación científica',
      'SST',
      'Prevención de riesgos',
      'Construcción'
    ],
    apoyo: ['Consulta estructurada', 'Juicio especializado', 'Consenso progresivo']
  },

  /* Ramas de ronda: contenido visible y tabla del modal. */
  rondas: [
    {
      key: 'r1',
      num: 'Ronda 1',
      etapa: 'Aceptación inicial',
      color: 'green',
      icono: 'search',
      proposito: [
        'Interés del tema',
        'Novedad',
        'Pertinencia contextual',
        'Aplicabilidad',
        'Orientación metodológica',
        'Alineación problema–objetivo'
      ],
      instrumento: 'Sí / No / No aplica + observaciones cualitativas',
      criterio: 'Frecuencia · Porcentaje · Aceptación inicial',
      resultado: ['99,46 % consenso afirmativo', '183 Sí de 184 valoraciones (23 ítems evaluados)'],
      dictamen: 'Apta para continuar',
      modal: {
        titulo: 'Ronda 1 — Resultados generales',
        filas: [
          ['Expertos participantes', '8'],
          ['Ítems valorados', '23'],
          ['Total de valoraciones', '184'],
          ['Valoraciones Sí', '183'],
          ['Valoraciones No', '1'],
          ['Valoraciones No aplica', '0'],
          ['Consenso global afirmativo (%)', '99,46']
        ],
        interpretacion: 'Resultado representativo: aceptación inicial altamente favorable de la propuesta.'
      }
    },
    {
      key: 'r2',
      num: 'Ronda 2',
      etapa: 'Evaluación técnica',
      color: 'red',
      icono: 'clipboard',
      proposito: [
        'Claridad',
        'Coherencia metodológica',
        'Coherencia técnica',
        'Pertinencia',
        'Viabilidad',
        'Aplicabilidad',
        'Aporte técnico-científico'
      ],
      instrumento: 'Escala de 1 a 5',
      criterio: 'Promedio · DE · CV · Consenso técnico',
      resultado: ['4,958 / 5', 'CV = 4,04 %', 'Alto consenso'],
      dictamen: 'Aprobada técnicamente',
      modal: {
        titulo: 'Ronda 2 — Resultados técnicos',
        filas: [
          ['Expertos participantes', '8'],
          ['Ítems evaluados', '18'],
          ['Valoraciones numéricas totales', '144'],
          ['Valoraciones en nivel 5 (Muy bueno)', '138 (95,83 %)'],
          ['Valoraciones en nivel 4 (Bueno)', '6 (4,17 %)'],
          ['Promedio global por ítems', '4,958'],
          ['Desviación estándar global', '0,201'],
          ['Coeficiente de variación global', '4,04 %'],
          ['Nivel de consenso general', 'Alto consenso']
        ],
        interpretacion: 'Resultado representativo: valoración técnica muy alta y baja dispersión de las respuestas.'
      }
    },
    {
      key: 'r3',
      num: 'Ronda 3',
      etapa: 'Consenso final',
      color: 'green',
      icono: 'check',
      proposito: [
        'Versión ajustada',
        'Suficiencia de cambios',
        'Aceptación final'
      ],
      instrumento: 'Sí / Parcialmente / No · Escala final de consenso',
      criterio: 'Promedio · DE · CV · Dictamen final',
      resultado: ['2,973 / 3', '97,32 % Sí', 'Alto consenso'],
      dictamen: 'Validada en su versión final',
      modal: {
        titulo: 'Ronda 3 — Resumen general de resultados',
        filas: [
          ['Expertos participantes', '8'],
          ['Ítems evaluados', '14'],
          ['Valoraciones procesadas', '112'],
          ['Respuestas Sí', '109'],
          ['Respuestas Parcialmente', '3'],
          ['Respuestas No', '0'],
          ['Porcentaje de respuestas Sí', '97,32'],
          ['Porcentaje de respuestas Parcialmente', '2,68'],
          ['Promedio global', '2,973 / 3'],
          ['DE global', '0,162'],
          ['CV global', '5,45 %'],
          ['Nivel de consenso', 'Alto consenso'],
          ['Dictamen final', '8 de 8 expertos aprueban la propuesta en su versión final']
        ],
        interpretacion: 'Resultado representativo: confirmación del consenso final y aprobación integral de la versión ajustada.'
      }
    }
  ],

  /* Banda inferior: síntesis del proceso y modal comparativo. */
  sintesis: {
    key: 'rn',
    titulo: 'Síntesis del proceso',
    icono: 'flag',
    flujo: ['Aceptación inicial', 'Evaluación técnica', 'Consenso final'],
    conclusion: 'Respaldo académico y técnico suficiente',
    capsulas: [
      { label: 'Ronda 1', valor: '99,46 %', color: 'green' },
      { label: 'Ronda 2', valor: '4,958 / 5', color: 'red' },
      { label: 'Ronda 3', valor: '2,973 / 3', color: 'green' }
    ],
    dictamen: 'Propuesta validada en su versión final',
    modal: {
      titulo: 'Síntesis metodológica del proceso Delphi',
      cabeceras: ['Ronda', 'Propósito', 'Instrumento', 'Criterio de análisis', 'Resultado obtenido'],
      filas: [
        ['Ronda 1', 'Aceptación inicial de la propuesta', 'Sí / No / No aplica + observaciones', 'Frecuencia y porcentaje', '99,46 % de consenso afirmativo'],
        ['Ronda 2', 'Evaluación técnica de la propuesta', 'Escala 1 a 5', 'Promedio, DE y CV', '4,958 / 5 y CV 4,04 %'],
        ['Ronda 3', 'Confirmación final de la versión ajustada', 'Escala final de consenso', 'Promedio, DE, CV y dictamen final', '2,973 / 3 y aprobación de 8 expertos']
      ]
    }
  }
};

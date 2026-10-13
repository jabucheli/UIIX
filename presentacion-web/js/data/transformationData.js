/* Diapositiva 9 · ESTRUCTURA DE LA PROPUESTA DE TRANSFORMACIÓN (EPTransf.md).
   Configuración del diagrama esquemático ejecutivo según el documento
   EPTransf.md ("Instrucciones específicas para la realización del diagrama"):
   una única lámina que comunica, en cinco franjas, la lógica de la propuesta
      - Secuencia de transformación (4 nodos);
     - Fundamento · Etapa 1 · Etapa 2 · Etapa 3 · Propósito (franja central);
     - Resultado esperado (3 nodos);
     - Recursos clave (banda inferior).
   Cada etapa alterna la paleta de la plantilla (verde/rojo) y va detallada
   con su componente, contenidos clave, recursos requeridos (solo nombrados,
   sin desarrollo) y franja de salida. */
window.EPT = {
  title: 'Estructura de la propuesta de transformación',
  subtitle: 'Secuencia metodológica orientada al fortalecimiento de la gestión preventiva en proyectos de construcción de edificaciones e infraestructura básica en Quito',

  /* Franja superior: secuencia de transformación (cuatro nodos en cadena). */
  logica: {
    key: 'Secuencia de transformación',
    nodos: [
      { icono: 'balance', texto: 'Análisis normativo' },
      { icono: 'search', texto: 'Verificación técnica' },
      { icono: 'trend', texto: 'Valoración del riesgo' },
      { icono: 'wrench', texto: 'Control de ingeniería' }
    ]
  },

  /* Franja central: entradas y salidas laterales del flujo de etapas. */
  fundamento: {
    titulo: 'Fundamento',
    icono: 'book',
    contenido: ['Normativa vigente', 'Evidencia de campo']
  },

  proposito: {
    titulo: 'Propósito',
    icono: 'target',
    contenido: ['Mitigación efectiva', 'del riesgo', 'Aplicación en obra']
  },

  etapas: [
    {
      num: '1',
      etapa: 'Etapa 1',
      color: 'green',
      icono: 'balance',
      componente: ['Componente', ' técnico-normativo base'],
      capsula: null,
      items: [
        'Análisis de normativa aplicable',
        'Sistematización de requisitos',
        'Reconocimiento de peligros y riesgos',
        'Criterios técnico-preventivos'
      ],
      recursos: [
        'D.E. 255-2024',
        'AM-MDT-2024-196',
        'AM-MDT-2025-122',
        'Matrices normativas',
        'Literatura técnica'
      ],
      salida: 'Base técnica y normativa'
    },
    {
      num: '2',
      etapa: 'Etapa 2',
      color: 'red',
      icono: 'clipboard',
      componente: ['Cuestionarios de chequeo'],
      capsula: 'NTP 324',
      items: [
        'Verificación técnica en campo',
        'Identificación de condiciones inseguras',
        'Requisitos técnico-legales por riesgo',
        'Determinación de NE y NC'
      ],
      recursos: [
        'NTP 324',
        'Formatos de verificación',
        'Cuestionarios',
        'Registros de campo',
        'Hojas de cálculo'
      ],
      salida: 'Diagnóstico y medición'
    },
    {
      num: '3',
      etapa: 'Etapa 3',
      color: 'green',
      icono: 'hardhat',
      componente: ['ART + controles', ' de ingeniería'],
      capsula: 'NTP 330',
      items: [
        'Valoración cuantitativa del riesgo',
        'Jerarquización de riesgos',
        'Prioridades de intervención',
        'Controles sobre fuente, medio y ejecución',
        'Respuesta operativa en obra'
      ],
      recursos: [
        'NTP 330',
        'Formatos ART',
        'Matrices de riesgo',
        'Personal técnico',
        'Acceso a obra'
      ],
      salida: 'Intervención operativa'
    }
  ],

  /* Franja inferior intermedia: resultado esperado (tres nodos en secuencia). */
  resultado: {
    key: 'Resultado esperado',
    icono: 'check',
    nodos: [
      { icono: 'check', texto: 'Gestión preventiva fortalecida' },
      { icono: 'users', texto: 'Condiciones de seguridad mejoradas' },
      { icono: 'hardhat', texto: 'Actuación técnica más segura y controlada' }
    ]
  },

  /* Franja inferior final: recursos clave, solo nombrados. */
  recursosClave: {
    key: 'Recursos clave',
    icono: 'gear',
    items: [
      'Normativa',
      'NTP 324',
      'NTP 330',
      'Matrices',
      'Registros de campo',
      'Formatos ART',
      'Personal técnico'
    ]
  }
};
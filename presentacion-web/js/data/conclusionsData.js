window.CONCLUSIONES = {
  title: 'CONCLUSIONES',
  subtitle: 'Síntesis de hallazgos, validación y aporte de la estrategia metodológica',

  /* Seis bloques del diagrama de flujo (1 -> 6). El color alterna verde/rojo
     como en el resto del deck; el bloque 6 va en verde oscuro sólido. */
  bloques: [
    {
      key: 'b1',
      num: '1',
      color: 'green',
      icono: 'book',
      titulo: ['SISTEMATIZACIÓN', 'TEÓRICA Y NORMATIVA'],
      ideas: [
        'Fundamentos conceptuales, técnicos y normativos',
        'SST, gestión de proyectos y controles de ingeniería',
        'Base técnica para NTP 324 y NTP 330',
        { t: 'Soporte del componente técnico-normativo', c: 'D.E. 255, A.M. 196; A.M. 122' }
      ],
      conceptual: 'Fundamentación → criterios técnicos → instrumentos',
      conclusion: 'La sistematización teórica referencial permitió establecer los fundamentos conceptuales, técnicos y normativos que sustentaron la investigación, particularmente en torno a la gestión de proyectos, los controles de ingeniería, la seguridad y salud en el trabajo, la prevención de riesgos laborales, la jerarquía de controles y la evaluación técnica del riesgo. Esta revisión permitió justificar la utilización de la NTP 324 y la NTP 330 como referentes técnicos para la construcción de los instrumentos de verificación y evaluación, en correspondencia con la normativa ecuatoriana vigente entre 2024 y 2026. A partir de este soporte, se estructuró el componente técnico-normativo base de la propuesta, el cual sirvió como fundamento para los cuestionarios de chequeo, las matrices de evaluación de riesgos y los Análisis de Riesgo en el Trabajo (ART).'
    },
    {
      key: 'b2',
      num: '2',
      color: 'red',
      icono: 'building',
      titulo: ['DIAGNÓSTICO DE', 'PROCESOS Y RIESGOS'],
      ideas: [
        'Edificación e infraestructura básica en Quito',
        { t: 'Identificación de procesos constructivos y riesgos', c: '5-I, 7-E' },
        { t: 'Cuestionarios de chequeo como base técnica', c: '23-I, 21-E' },
        'Determinación de niveles de deficiencia'
      ],
      conceptual: 'Procesos → peligros/riesgos → condiciones de trabajo → ND',
      conclusion: 'El análisis de los riesgos laborales de seguridad en proyectos de edificación e infraestructura básica permitió identificar procesos constructivos, condiciones de trabajo y factores de riesgo relevantes en el contexto de la ciudad de Quito. Los cuestionarios de chequeo se sustentaron en los Anexos A al H y se sistematizaron en la Tabla 19, mientras que la identificación de procesos y riesgos se organizó en las Figuras 6 y 7 para infraestructura y en las Figuras 8 y 9 para edificación. La aplicación de estos instrumentos permitió determinar niveles de deficiencia conforme a la NTP 324 y generar una base técnica para la evaluación objetiva de riesgos mediante la NTP 330.'
    },
    {
      key: 'b3',
      num: '3',
      color: 'green',
      icono: 'clipboard',
      titulo: ['ESTRATEGIA', 'METODOLÓGICA'],
      ideas: [
        'Integración del componente técnico-normativo',
        'Cuestionarios de verificación',
        { t: 'Matrices de evaluación de riesgos', c: 'NTP-330' },
        'ART y controles de ingeniería',
        'Estrategia aplicable, coherente y alineada con la normativa'
      ],
      conceptual: 'Normativa + verificación + evaluación + ART = estrategia metodológica',
      conclusion: 'La estrategia metodológica de gestión de proyectos basada en controles de ingeniería se estructuró mediante la integración del componente técnico-normativo base, los cuestionarios de verificación, las matrices de evaluación de riesgos y los ART, desarrollados específicamente para proyectos de edificación e infraestructura básica. Los cuestionarios de chequeo se sustentaron en los Anexos A al H y se sistematizaron en la Tabla 19, mientras que las matrices de evaluación de riesgos se presentaron en las Tablas 20 y 21. Esta estructura permitió vincular el diagnóstico normativo con la evaluación técnica de los riesgos laborales de seguridad, generando una estrategia metodológica aplicable, coherente y alineada con las exigencias normativas ecuatorianas vigentes entre 2024 y 2026.'
    },
    {
      key: 'b4',
      num: '4',
      color: 'red',
      icono: 'users',
      titulo: ['APLICACIÓN PILOTO', 'Y EVALUACIÓN'],
      stats: [
        { valor: '189', label: 'cuestionarios aplicados' },
        { valor: '106', label: 'registros en edificación' },
        { valor: '83', label: 'registros en infraestructura' }
      ],
      ideas: [
        'Integración de ND, NE y NC mediante NTP 330',
        'Valoración objetiva de los riesgos laborales de seguridad'
      ],
      conceptual: 'Aplicación real → datos de campo → valoración objetiva',
      conclusion: 'La aplicación piloto de la estrategia metodológica en proyectos reales permitió comprobar su coherencia técnica, operativa y normativa. Este proceso se sustentó en un total de 106 registros para edificación, contenidos en el Anexo I, y 83 registros para infraestructura, contenidos en el Anexo J. En conjunto, se aplicaron 189 cuestionarios de chequeo, incluyendo, para edificación, 10 cuestionarios orientados a riesgos mecánicos y 1 para riesgo eléctrico; para infraestructura, 12 cuestionarios para riesgos mecánicos y 1 para riesgo eléctrico; además de cuestionarios complementarios correspondientes a 4 riesgos físicos, 1 químico, 1 ergonómico, 1 locativo y 3 riesgos mayores, recopilados en la Tabla 15 para edificación y en la Tabla 16 para infraestructura. Estos resultados permitieron integrar los niveles de deficiencia, exposición y consecuencia conforme a la NTP 330, generando una valoración objetiva de los riesgos laborales de seguridad.'
    },
    {
      key: 'b5',
      num: '5',
      color: 'green',
      icono: 'flag',
      titulo: ['RESULTADOS CRÍTICOS', 'Y VALIDACIÓN'],
      minis: [
        {
          titulo: 'RIESGOS CRÍTICOS',
          icono: 'flag',
          items: [
            { fuerte: 'Edificación: NR = 3733', resto: 'Riesgo mecánico: caída de objetos en manipulación' },
            { fuerte: 'Infraestructura: NR = 2691', resto: 'Riesgo mecánico: atrapamiento por vuelco de máquinas' }
          ]
        },
        {
          titulo: 'VALIDACIÓN DELPHI',
          icono: 'users',
          tipo: 'cajas',
          items: [
            { r: 'Ronda 1', v: '99,46 %', d: 'Aceptación inicial favorable' },
            { r: 'Ronda 2', v: '4,958 / 5', cv: 'CV 4,04 %', d: 'Alto consenso técnico' },
            { r: 'Ronda 3', v: '2,973 / 3', cv: 'CV 5,45 %', d: 'DE global 0,162' },
            { r: 'Ronda final', v: '8 expertos aprueban', d: 'Aprobación final de la propuesta' }
          ]
        }
      ],
      conceptual: 'Jerarquización objetiva → prioridad preventiva → controles de ingeniería',
      conclusion: 'La evaluación de riesgos permitió evidenciar condiciones críticas relevantes en los proyectos piloto. En el proyecto de edificación se obtuvo un nivel de riesgo de 3733 unidades, asociado al riesgo mecánico de caída de objetos en manipulación, mientras que en el proyecto de infraestructura básica se obtuvo un nivel de riesgo de 2691 unidades, vinculado al riesgo mecánico de atrapamiento por vuelco de máquinas. Estos resultados demostraron que la estrategia metodológica permite jerarquizar objetivamente los riesgos, priorizar intervenciones preventivas y orientar la definición de controles de ingeniería sustentados en evidencia técnica. Las medidas de control desarrolladas en los Anexos K, L y M, complementadas con los Anexos N y O, permitieron transformar los resultados de la evaluación en propuestas operativas aplicables en obra.\n\nLa validación de la propuesta de transformación mediante el método Delphi permitió confirmar su pertinencia, coherencia metodológica, aplicabilidad, viabilidad y aporte técnico-científico. En la primera ronda se obtuvo un consenso afirmativo global del 99,46 %, evidenciando una aceptación inicial favorable. En la segunda ronda se alcanzó un promedio global de 4,958 sobre 5 y un coeficiente de variación global de 4,04 %, lo que reflejó alto consenso técnico. En la tercera ronda se obtuvo un promedio global de 2,973 sobre 3, una desviación estándar global de 0,162 y un coeficiente de variación global de 5,45 %, confirmándose la aprobación final de la propuesta por parte de los ocho expertos participantes. Estos resultados, procesados en las tablas de síntesis de validación Delphi, respaldan la validez académica, técnica y metodológica de la estrategia formulada.'
    },
    {
      key: 'b6',
      num: '6',
      color: 'red',
      icono: 'target',
      titulo: ['CONFIRMACIÓN', 'Y APORTE'],
      checks: [
        'Se confirma la hipótesis',
        'La estrategia fortalece la gestión de riesgos laborales de seguridad',
        'Mejora la identificación, evaluación y control de riesgos',
        'Prioriza actividades críticas y sustenta los ART',
        'Ofrece una ruta técnica, contextualizada y verificable',
        'Aplicable a proyectos de edificación e infraestructura básica en Quito'
      ],
      conclusion: 'Los resultados obtenidos permiten confirmar la hipótesis planteada, al evidenciar que la estrategia metodológica de gestión de proyectos basada en controles de ingeniería contribuye significativamente al fortalecimiento de la gestión de riesgos laborales de seguridad. Esta contribución se manifestó en la mejora de los procesos de identificación, evaluación y control de riesgos, en la jerarquización objetiva de actividades críticas, en la formulación de ART con controles de ingeniería y en la validación favorable de la propuesta mediante el método Delphi. En consecuencia, la estrategia metodológica favorece la implementación de prácticas preventivas orientadas a reducir la exposición al riesgo en las actividades constructivas y a mejorar las condiciones de seguridad laboral en proyectos de edificación e infraestructura básica.\n\nLa investigación permitió proponer una estrategia metodológica de gestión de proyectos basada en controles de ingeniería, orientada a la mejora de las condiciones de seguridad laboral y la prevención de riesgos en proyectos de construcción de la ciudad de Quito, conforme a la normativa ecuatoriana vigente entre 2024 y 2026. La propuesta integró el análisis normativo, la identificación sistemática de peligros, la determinación de niveles de deficiencia, la evaluación objetiva de riesgos, la elaboración de ART y la definición de controles de ingeniería aplicables a procesos constructivos críticos. Su principal aporte consiste en ofrecer una ruta técnica, contextualizada y verificable para incorporar la prevención como componente estructural de la dirección de proyectos, fortalecer la toma de decisiones preventivas, priorizar intervenciones en función del nivel de riesgo y mejorar las condiciones de seguridad laboral en obras de edificación e infraestructura básica. Asimismo, su estructura favorece su adaptación a distintos tipos de proyectos de construcción, reforzando su pertinencia técnica, su aplicabilidad en el contexto ecuatoriano y su contribución académica a los campos de la ingeniería civil, la seguridad y salud en el trabajo y la dirección de proyectos.'
    }
  ],

  /* Nodo central inferior: todos los bloques convergen aquí. */
  nodo: {
    titulo: 'CONCLUSIONES',
    icono: 'trend'
  },

  /* Banda inferior: aporte central de la investigación. */
  aporte: {
    etiqueta: 'APORTE CENTRAL:',
    icono: 'target',
    mensaje: 'Prevención como componente estructural de la dirección de proyectos'
  }
};

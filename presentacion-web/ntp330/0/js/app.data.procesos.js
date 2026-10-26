/**
 * app.data.procesos.js
 * Catálogo de categorías, tipos de proyecto, procesos constructivos por tipo y
 * metadatos de riesgo (tipo de peligro, fuente generadora, consecuencias).
 *
 * Estructura según la solicitud de correcciones §23 (correcciones2.md):
 *   Tipo de proyecto (solo Estructura / Infraestructura) → Proceso constructivo
 *   → Pestañas por riesgo → Evaluación (checklist, ND, NE, NP, NC, NR, NI) →
 *   Registro automático de resultados en la página principal.
 *
 * Tipos generales de proyecto (únicos permitidos en el flujo de evaluación):
 *   - Estructura      (prefijo de hojas "E-"; usa los riesgos de "Edificación")
 *   - Infraestructura (prefijo de hojas "I-")
 *
 * Fuentes:
 *   - Procesos: procesos.doc (Edificación: 7, Infraestructura: 5) y claves del
 *     dataset de referencia (APP_REFERENCIA).
 *   - Metadatos de riesgo: catálogo nd.xlsx y script original de la tesis.
 *
 * APP_TIPOS_PROYECTO / APP_TIPOS_POR_CATEGORIA / APP_PROCESOS_POR_TIPO se
 * conservan por compatibilidad (módulo de administración y pruebas), pero el
 * flujo de evaluación solo usa las dos categorías generales.
 */

/** Categorías generales de proyecto (correcciones2 §2: solo estas dos). */
window.APP_CATEGORIAS_PROYECTO = [
  {
    nombre: 'Estructura',
    prefijo: 'E-',
    activo: true,
    nota: 'Edificación y obras de estructura: edificaciones, estructuras de hormigón armado y metálicas, vivienda, edificios institucionales, naves industriales, rehabilitación y demolición estructural.'
  },
  {
    nombre: 'Infraestructura',
    prefijo: 'I-',
    activo: true,
    nota: 'Obras civiles e infraestructura: puentes, vías, obras hidráulicas y sanitarias, túneles, obras eléctricas, urbanizaciones, movimiento de tierras e infraestructura industrial.'
  }
];

/** Tipos de proyecto por categoría (§6.1 / §6.2). */
window.APP_TIPOS_POR_CATEGORIA = {
  'Estructura': [
    'Edificación',
    'Estructuras de hormigón armado',
    'Estructuras metálicas',
    'Vivienda',
    'Edificios institucionales',
    'Naves industriales',
    'Rehabilitación estructural',
    'Demolición estructural',
    'Otro'
  ],
  'Infraestructura': [
    'Puentes',
    'Vías',
    'Obras hidráulicas',
    'Obras sanitarias',
    'Túneles',
    'Obras eléctricas',
    'Urbanizaciones',
    'Movimiento de tierras',
    'Infraestructura industrial',
    'Otro'
  ]
};

/** Lista plana de tipos de proyecto (compatibilidad con la versión anterior). */
window.APP_TIPOS_PROYECTO = [];
window.APP_CATEGORIAS_PROYECTO.forEach(function (c) {
  (window.APP_TIPOS_POR_CATEGORIA[c.nombre] || []).forEach(function (t) {
    window.APP_TIPOS_PROYECTO.push({ nombre: t, activo: true, categoria: c.nombre, nota: '' });
  });
});

/** Lista de procesos por defecto de cada categoría (procesos.doc). */
window.APP_PROCESOS_DEFAULT = {
  'E-': [
    'Obras preliminares',
    'Movimiento de tierras',
    'Estructura de hormigón armado',
    'Estructura metálica',
    'Instalaciones eléctricas',
    'Instalaciones hidrosanitarias',
    'Acabados'
  ],
  'I-': [
    'Obras preliminares',
    'Movimiento de tierras',
    'Obras complementarias (Pozos y estructuras auxiliares)',
    'Trabajos en zanjas (Tubería)',
    'Relleno'
  ]
};

/**
 * Procesos constructivos por tipo de proyecto (procesos.doc + APP_REFERENCIA).
 * "Edificación" (7 procesos) e "Infraestructura" (5 procesos) tienen desglose
 * propio; el resto hereda la lista de su categoría (editable por el admin).
 */
window.APP_PROCESOS_POR_TIPO = {
  'Edificación': window.APP_PROCESOS_DEFAULT['E-'].slice(),
  'Estructura': window.APP_PROCESOS_DEFAULT['E-'].slice(),
  'Infraestructura': window.APP_PROCESOS_DEFAULT['I-'].slice()
};

// Los tipos restantes heredan la lista de procesos de su categoría.
window.APP_TIPOS_PROYECTO.forEach(function (t) {
  if (window.APP_PROCESOS_POR_TIPO[t.nombre]) return;
  var pre = '';
  window.APP_CATEGORIAS_PROYECTO.forEach(function (c) {
    if (c.nombre === t.categoria) pre = c.prefijo;
  });
  window.APP_PROCESOS_POR_TIPO[t.nombre] = (window.APP_PROCESOS_DEFAULT[pre] || []).slice();
});

/** Devuelve la categoría (objeto) de un tipo de proyecto. */
window.CATEGORIA_DE_TIPO = function (tipo) {
  for (var i = 0; i < window.APP_CATEGORIAS_PROYECTO.length; i++) {
    var c = window.APP_CATEGORIAS_PROYECTO[i];
    if (tipo === c.nombre) return c;
    if ((window.APP_TIPOS_POR_CATEGORIA[c.nombre] || []).indexOf(tipo) >= 0) return c;
  }
  return null;
};

/** Devuelve el prefijo de hojas de un tipo de proyecto ("E-" / "I-"). */
window.PREFIJO_TIPO = function (tipo) {
  var c = window.CATEGORIA_DE_TIPO(tipo);
  return c ? c.prefijo : '';
};

/**
 * Metadatos por factor de riesgo: tipo de peligro, fuente generadora y posibles
 * consecuencias. Los nombres coinciden con los del catálogo (APP_CATALOGO) y
 * del dataset de referencia (APP_REFERENCIA).
 */
window.APP_METADATA_RIESGO = {
  'Ruido': {
    tipo: 'Físico',
    fuente: 'Niveles sonoros (maquinaria, equipos, herramientas)',
    consecuencias: 'Pérdida auditiva progresiva, molestias, disminución de la concentración y de la percepción de señales.'
  },
  'Vibración': {
    tipo: 'Físico',
    fuente: 'Movimientos oscilatorios de máquinas y herramientas',
    consecuencias: 'Trastornos musculoesqueléticos y vasculares por vibraciones de mano-brazo o cuerpo completo.'
  },
  'Iluminación': {
    tipo: 'Físico',
    fuente: 'Niveles lumínicos inadecuados en el puesto o área de trabajo',
    consecuencias: 'Fatiga visual, errores de apreciación y accidentes por deficiente visibilidad.'
  },
  'Radiaciones ionizantes': {
    tipo: 'Físico',
    fuente: 'Fuentes emisoras de energía (equipos de radiografía industrial, mediciones)',
    consecuencias: 'Daño celular, quemaduras y efectos sobre la salud a corto y largo plazo.'
  },
  'Exposición a sustancias nocivas': {
    tipo: 'Químico',
    fuente: 'Sustancias químicas: polvos, humos, vapores, gases y solventes',
    consecuencias: 'Intoxicaciones, irritaciones, enfermedades respiratorias o dérmicas.'
  },
  'Organización del trabajo incorrecta': {
    tipo: 'Organizativo',
    fuente: 'Condiciones inadecuadas de organización, planificación y supervisión',
    consecuencias: 'Errores humanos, fatiga y aumento de la probabilidad de accidente.'
  },
  'Caída de personas a distinto nivel': {
    tipo: 'Mecánico',
    fuente: 'Trabajo en altura o zonas con desnivel',
    consecuencias: 'Golpes, fracturas, traumatismos graves o muerte.'
  },
  'Caída de personas al mismo nivel': {
    tipo: 'Mecánico',
    fuente: 'Superficies irregulares u obstruidas',
    consecuencias: 'Contusiones, esguinces y fracturas menores.'
  },
  'Caída de objetos por desplome': {
    tipo: 'Mecánico',
    fuente: 'Estructuras inestables o espacios confinados',
    consecuencias: 'Golpes y aplastamientos, lesiones graves o muerte.'
  },
  'Caída de objetos en manipulación': {
    tipo: 'Mecánico',
    fuente: 'Desprendimiento de objetos durante su manejo',
    consecuencias: 'Golpes en extremidades y contusiones.'
  },
  'Golpes/cortes por objetos o herramientas': {
    tipo: 'Mecánico',
    fuente: 'Manipulación de máquinas, herramientas y materiales',
    consecuencias: 'Cortes, heridas y laceraciones.'
  },
  'Proyección de fragmentos o partículas': {
    tipo: 'Mecánico',
    fuente: 'Operaciones de conformado, corte y esmerilado',
    consecuencias: 'Lesiones oculares, cortes y quemaduras.'
  },
  'Atrapamiento por o entre objetos': {
    tipo: 'Mecánico',
    fuente: 'Objetos fijos o móviles, partes en movimiento',
    consecuencias: 'Aplastamiento, amputaciones y lesiones graves.'
  },
  'Atrapamiento por vuelco de máquinas': {
    tipo: 'Mecánico',
    fuente: 'Maquinaria pesada en movimiento',
    consecuencias: 'Aplastamiento, lesiones graves o muerte.'
  },
  'Contactos eléctricos': {
    tipo: 'Eléctrico',
    fuente: 'Energía eléctrica: instalaciones, cables, equipos',
    consecuencias: 'Quemaduras, paro cardiorrespiratorio y electrocución.'
  },
  'Contactos térmicos a) inherentes al trabajador': {
    tipo: 'Térmico',
    fuente: 'Fuentes de calor cercanas al trabajador',
    consecuencias: 'Quemaduras de diversa gravedad.'
  },
  'Contactos térmicos b) inherentes a la manipulación de elementos estructurales': {
    tipo: 'Térmico',
    fuente: 'Superficies calientes de elementos estructurales',
    consecuencias: 'Quemaduras por contacto.'
  },
  'Contactos térmicos c) inherentes al proceso de soldadura': {
    tipo: 'Térmico',
    fuente: 'Procesos de soldadura: arco, chispas y radiación',
    consecuencias: 'Quemaduras y lesiones oculares.'
  },
  'Atropellos o golpes con vehículos': {
    tipo: 'Mecánico',
    fuente: 'Colisión o impacto vehicular en la obra',
    consecuencias: 'Atropello, lesiones graves o muerte.'
  },
  'Otros riesgos de accidente a) inherentes a la manipulación de herramientas eléctricas': {
    tipo: 'Mecánico',
    fuente: 'Situaciones fortuitas en el uso de herramientas eléctricas',
    consecuencias: 'Cortes, descargas y lesiones diversas.'
  },
  'Otros riesgos de accidente b) Inherentes a la manipulación de herramientas manuales': {
    tipo: 'Mecánico',
    fuente: 'Situaciones fortuitas en el uso de herramientas manuales',
    consecuencias: 'Cortes, golpes y heridas.'
  },
  'Otra exposición a) asfixia o intoxicación': {
    tipo: 'Químico',
    fuente: 'Atmósferas contaminadas o deficientes de oxígeno',
    consecuencias: 'Asfixia, intoxicación y pérdida de conciencia.'
  },
  'Sobreesfuerzos': {
    tipo: 'Ergonómico',
    fuente: 'Posturas forzadas y manipulación manual de cargas',
    consecuencias: 'Lesiones musculoesqueléticas y lumbalgias.'
  }
};

/** Devuelve los metadatos de un factor de riesgo (o valores genéricos). */
window.METADATA_RIESGO = function (nombre) {
  var m = (nombre && window.APP_METADATA_RIESGO[nombre]) ? window.APP_METADATA_RIESGO[nombre] : null;
  if (m) return m;
  return {
    tipo: '',
    fuente: 'No documentada en el catálogo.',
    consecuencias: 'A determinar por el evaluador.'
  };
};

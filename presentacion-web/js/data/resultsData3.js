/* Diapositiva 8 · RESULTADOS (3) — resultados de la prueba piloto.

   Muestra solo el proyecto de INFRAESTRUCTURA (Quito), según la Tabla 23 y la
   Tabla 25 de `Resultados.docx`, que son las que corresponden a ese tipo de
   obra: 83 cuestionarios de chequeo y 83 registros de presencia de riesgos.
   Los seis resultados se presentan en orden, como una secuencia de pasos:
   la base de cálculo (matriz ND x NE), los dos resultados de deficiencia
   (global y por proceso), los dos de presencia de riesgos y, al final, la
   respuesta preventiva (los ART de la Fase 4).

   Cada paso lleva la cifra que lo resume (`clave`), el título del resultado,
   una línea de contexto (`sub`), la lectura amplía (`detalle`), la fuente
   (`pie`) y la imagen del gráfico o tabla (`imagen`), que es la que se abre
   al pulsarlo.

   Los colores de los seis subbloques del flujograma horizontal alternan con la
   paleta de la plantilla: verde, rojo, verde, rojo, verde, rojo. Dentro de
   cada subbloque, el primer nivel (la cifra) mantiene su tamaño y va en el
   color sólido del propio bloque; el segundo y el tercero van en negro, el
   tercero un poco más pequeño.

   La banda inferior, en reposo, no lleva ninguna información: solo las
   fotografías de la prueba piloto (`fotos`), que se amplían con un clic y
   vuelven a su tamaño normal con un clic fuera. */
window.RESULTADOS3 = {
  title: 'Resultados (3)',
  subtitle: 'Fase 3 · Resultados de la prueba piloto en proyectos de infraestructura para la toma de decisiones en la dirección de proyectos',
  nota: 'Muestra representativa · proyecto piloto de infraestructura en Quito · 83 cuestionarios de chequeo · Fases 1 a 4',

  /* Fotografías de la prueba piloto: son lo único que se muestra en la banda
     inferior en reposo. Sin rótulos ni cifras, solo la imagen; cada una se
     amplía con un clic y un clic fuera la devuelve a su tamaño normal
     (js/slides/slide08Photos.js). */
  fotos: [
    'assets/fotos/1.jpeg',
    'assets/fotos/2.jpeg',
    'assets/fotos/3.jpeg',
    'assets/fotos/4.jpeg',
    'assets/fotos/5.jpeg',
    'assets/fotos/6.jpeg',
    'assets/fotos/7.jpeg',
    'assets/fotos/8.jpeg'
  ],

  pasos: [
    {
      key: 'p1',
      clave: 'Matriz de Riesgos',
      titulo: '',
      sub: 'Base de cálculo · NTP 330',
      detalle: 'Combina el nivel de deficiencia (ND) con el nivel de exposición (NE) para obtener el nivel de probabilidad (NP) que sostiene la valoración del riesgo conforme a la NTP 330.',
      pie: 'NTP 330 · matriz de riesgos ND × NE',
      imagen: 'assets/MatrizER.png',
      color: 'green'
    },
    {
      key: 'p2',
      clave: 'Deficiencia (ND) global',
      titulo: '',
      sub: '73 de 83 · Muy Deficiente',
      detalle: 'De los 83 cuestionarios de chequeo aplicados en el proyecto piloto de infraestructura, 73 (87,95 %) se catalogan como Muy Deficiente (MD) y 10 (12,05 %) como Deficiente (D). No se registran niveles Mejorable (M) ni Aceptable (B): el 100 % de los cuestionarios se concentra en categorías críticas.',
      pie: 'Resultados.docx · Tabla 23 · proyecto de infraestructura',
      imagen: 'assets/nd-res.png',
      color: 'red'
    },
    {
      key: 'p3',
      clave: 'Deficiencia por factor de riesgo',
      titulo: '',
      sub: 'ND máximo · 10,00 · vibración',
      detalle: 'El nivel Muy Deficiente domina en los cinco procesos del proyecto de infraestructura (obras preliminares, movimiento de tierras, obras complementarias, trabajos en zanjas y relleno). Los ND más altos se concentran en vibración (10,00), sobreesfuerzos (8,93), ruido (8,44) y contactos eléctricos (8,17).',
      pie: 'Resultados.docx · gráficas 10 a 14 · cinco procesos',
      imagen: 'assets/barras.png',
      mostrarPie: false,
      color: 'green'
    },
    {
      key: 'p4',
      clave: 'Riesgos analizados',
      titulo: '',
      sub: '83 riesgos presentes · 20 riesgos evaluados',
      detalle: 'La evaluación registró 83 cuestionarios sobre 20 tipos de riesgo. Los más frecuentes —organización incorrecta del trabajo, caídas, golpes o cortes, proyección de partículas, atrapamientos, contactos eléctricos, ruido, vibración, iluminación y sobreesfuerzos— concentran 5 registros cada uno (6,02 %).',
      pie: 'Resultados.docx · Tabla 25 · presencia de riesgos en infraestructura',
      imagen: 'assets/riesgos-res.png',
      color: 'red'
    },
    {
      key: 'p5',
      clave: 'Riesgos analizados',
      titulo: 'Distribución gráfica',
      sub: '6,02 %',
      detalle: 'En el extremo opuesto están el atrapamiento por vuelco de máquinas (1,20 %), la asfixia o intoxicación (2,41 %) y las radiaciones ionizantes (3,61 %); la exposición a sustancias nocivas no fue reportada (0 %).',
      pie: 'Resultados.docx · figura 11 · distribución de la presencia de riesgos',
      imagen: 'assets/riesgos-res1.png',
      color: 'green'
    },
    {
      key: 'p6',
      clave: 'ART',
      titulo: 'Controles de ingeniería',
      sub: 'Fase 4 · respuesta preventiva',
      detalle: 'Los Análisis de Riesgo en el Trabajo (ART) estructuran la respuesta preventiva sobre los procesos críticos: protecciones colectivas, señalización, estabilización de excavaciones y control de accesos, con seguimiento y reevaluación del ND.',
      pie: 'Resultados.docx · figura 12 · implementación de los ART',
      imagen: 'assets/art-fin.png',
      color: 'red'
    }
  ]
};

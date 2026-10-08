/* Diapositiva 7 · RESULTADOS (2) — desarrollo de la Fase 3 según la NTP 330.
   Página seccionada en dos bandas:
     · superior: flujograma principal de ntp330.md (18.75% del alto disponible);
     · inferior: dos recuadros reserved para fotografías (izquierda y derecha).
   El contenido de los recuadros se completará más adelante. */
window.RESULTADOS2 = {
  title: 'Resultados (2)',
  subtitle: 'Fase 3 · Determinación del nivel de riesgo según la metodología NTP 330',

  /* Nivel 2 del flujograma · cadena principal obligatoria (§6 de ntp330.md) */
  flujo: [
    { key: 'n1', code: 'Riesgo', title: 'Riesgo identificado', sub: 'Proceso · peligro · riesgo', color: 'green', focus: 'f1', aria: 'Abrir la aplicación de evaluación de riesgos' },
    { key: 'n2', code: 'ND', title: 'Nivel de deficiencia', sub: 'Cuestionario de chequeo', color: 'red' },
    { key: 'n3', code: 'NE', title: 'Nivel de exposición', sub: 'Observación de campo', color: 'green', focus: 'ne' },
    { key: 'n4', code: 'NP', title: 'Nivel de probabilidad', sub: 'NP = ND × NE', fx: true, color: 'red', focus: 'np' },
    { key: 'n5', code: 'NC', title: 'Nivel de consecuencia', sub: 'Magnitud del daño esperado', color: 'green', focus: 'nc' },
    { key: 'n6', code: 'NR', title: 'Nivel de riesgo', sub: 'NR = NP × NC', fx: true, color: 'red', focus: 'nr' },
    { key: 'n7', code: 'NI', title: 'Nivel de intervención', sub: 'Prioridad de actuación', color: 'green', focus: 'ni' }
  ],
  /* Banda inferior. La Fotografía 1 muestra en reposo la foto de la zanja
     (`imagen`) y, al pulsar el bloque «Riesgo» del flujograma, se aloja en
     ese hueco la aplicación web de evaluación de riesgos, la que está en la
     carpeta hermana `tesis/0` (D:\ejemplo\tesis\0). Se carga con un <iframe>
     en vivo —no se copia nada— y su pestaña inicial es «Evaluación», que es la
     que la app abre por defecto. La ruta va aquí, en un solo sitio, por si hay
     que corregirla. */
  fotos: [
    {
      key: 'f1',
      titulo: 'Fotografía 1',
      nota: 'Aplicación de evaluación de riesgos NTP 330',
      imagen: 'assets/zanja.jpeg',
      app: {
        src: '../../tesis/0/index.html',
        etiqueta: 'Evaluación de riesgos laborales · NTP 330',
        pestana: 'evaluacion',
        aviso: 'Aplicación web de tesis/0 · clic en el título o fuera para volver'
      }
    },
    { key: 'f2', titulo: 'Fotografía 2', nota: 'Espacio reservado · derecha' }
  ]
};

/* Tablas extraidas de ER.docx para los bloques NE, NP, NC, NR y NI del
   slide 7. Fichero GENERADO por tools/extract_er_tables.js: no editar a mano.

   El tono (green/red) es la intencion de diseno por severidad; el texto y los
   valores provienen literalmente del documento. */
window.ER_TABLES = {
  ne: {
    code: "NE",
    titulo: "Nivel de exposición",
    encabezado: {
      esquina: "Nivel de exposición",
      columnas: [
        "NE",
        "Significado"
      ]
    },
    pie: "La exposición se valora segun la frecuencia con que el agente se presenta en la jornada laboral.",
    filas: [
      {
        cod: "EC",
        etiqueta: "Continuada",
        celdas: [
          "4",
          "Continuamente. Varias veces en su jornada laboral con tiempo prolongado."
        ],
        tono: "red"
      },
      {
        cod: "EF",
        etiqueta: "Frecuente",
        celdas: [
          "3",
          "Varias veces en su jornada laboral, aunque sea con tiempos cortos."
        ],
        tono: "red"
      },
      {
        cod: "EO",
        etiqueta: "Ocasional",
        celdas: [
          "2",
          "Alguna vez en su jornada laboral y con período corto de tiempo."
        ],
        tono: "green"
      },
      {
        cod: "EE",
        etiqueta: "Esporádica",
        celdas: [
          "1",
          "Irregularmente."
        ],
        tono: "green"
      }
    ]
  },
  np: {
    code: "NP",
    titulo: "Nivel de probabilidad",
    encabezado: {
      esquina: "Nivel de probabilidad",
      columnas: [
        "NP",
        "Significado"
      ]
    },
    pie: "El NP se obtiene combinando el ND con el NE en la matriz ND × NE.",
    filas: [
      {
        cod: "MA",
        etiqueta: "Muy alta",
        celdas: [
          "Entre 40 y 24",
          "Situación deficiente con exposición continuada, o muy deficiente con exposición frecuente. Normalmente la materialización del riesgo ocurre con frecuencia."
        ],
        tono: "red"
      },
      {
        cod: "A",
        etiqueta: "Alta",
        celdas: [
          "Entre 20 y 10",
          "Situación deficiente con exposición frecuente u ocasional, o bien situación muy deficiente con exposición ocasional o esporádica. La materialización del riesgo es posible que suceda varias veces en el ciclo de vida laboral."
        ],
        tono: "red"
      },
      {
        cod: "M",
        etiqueta: "Media",
        celdas: [
          "Entre 8 y 6",
          "Situación deficiente con exposición esporádica, o bien situación mejorable con exposición continuada o frecuente. Es posible que suceda el daño alguna vez."
        ],
        tono: "green"
      },
      {
        cod: "B",
        etiqueta: "Baja",
        celdas: [
          "Entre 4 y 2",
          "Situación mejorable con exposición ocasional o esporádica. No es esperable que se materialice el riesgo, aunque puede ser concebible."
        ],
        tono: "green"
      }
    ]
  },
  nc: {
    code: "NC",
    titulo: "Nivel de consecuencias",
    encabezado: {
      esquina: "Nivel de consecuencias",
      columnas: [
        "NC",
        "Daños personales",
        "Daños materiales"
      ]
    },
    pie: "La consecuencia se valora por el daño personal y por el daño material, y se queda con la peor de las dos.",
    filas: [
      {
        cod: "M",
        etiqueta: "Mortal o Catastrófico",
        celdas: [
          "100",
          "1 muerto o más",
          "Destrucción total del sistema (difícil renovarlo)"
        ],
        tono: "red"
      },
      {
        cod: "MG",
        etiqueta: "Muy Grave",
        celdas: [
          "60",
          "Lesiones graves que pueden ser irreparables",
          "Destrucción parcial del sistema (compleja y costosa la reparación)"
        ],
        tono: "red"
      },
      {
        cod: "G",
        etiqueta: "Grave",
        celdas: [
          "25",
          "Lesiones con incapacidad laboral transitoria (I.L.T.)",
          "Se requiere paro de proceso para efectuar la reparación"
        ],
        tono: "green"
      },
      {
        cod: "L",
        etiqueta: "Leve",
        celdas: [
          "10",
          "Pequeñas lesiones que no requieren hospitalización",
          "Reparable sin necesidad de paro del proceso"
        ],
        tono: "green"
      }
    ]
  },
  nr: {
    code: "NR",
    titulo: "Nivel de riesgo",
    tituloColumnas: "Nivel de Probabilidad (NP)",
    tituloFilas: "Nivel de Consecuencias (NC)",
    encabezado: {
      esquina: "Nivel de consecuencias (NC) ↓",
      columnas: [
        {
          rango: "40-24",
          etiqueta: "Muy alta",
          cod: "MA"
        },
        {
          rango: "20-10",
          etiqueta: "Alta",
          cod: "A"
        },
        {
          rango: "8-6",
          etiqueta: "Media",
          cod: "M"
        },
        {
          rango: "4-2",
          etiqueta: "Baja",
          cod: "B"
        }
      ]
    },
    pie: "Cruce del NP con el NC: cada celda indica el NR y su nivel de intervención (I a IV).",
    filas: [
      {
        nc: "100",
        etiqueta: "Mortal o Catastrófico",
        cod: "M",
        celdas: [
          {
            niveles: [
              {
                nivel: "I",
                valor: "4000-2400",
                tono: "red"
              }
            ],
            valor: "4000-2400",
            tono: "red"
          },
          {
            niveles: [
              {
                nivel: "I",
                valor: "2000-1200",
                tono: "red"
              }
            ],
            valor: "2000-1200",
            tono: "red"
          },
          {
            niveles: [
              {
                nivel: "I",
                valor: "800-600",
                tono: "red"
              }
            ],
            valor: "800-600",
            tono: "red"
          },
          {
            niveles: [
              {
                nivel: "II",
                valor: "400-200",
                tono: "red"
              }
            ],
            valor: "400-200",
            tono: "red"
          }
        ]
      },
      {
        nc: "60",
        etiqueta: "Muy Grave",
        cod: "MG",
        celdas: [
          {
            niveles: [
              {
                nivel: "I",
                valor: "2400-1440",
                tono: "red"
              }
            ],
            valor: "2400-1440",
            tono: "red"
          },
          {
            niveles: [
              {
                nivel: "I",
                valor: "1200-600",
                tono: "red"
              }
            ],
            valor: "1200-600",
            tono: "red"
          },
          {
            niveles: [
              {
                nivel: "II",
                valor: "480-360",
                tono: "red"
              }
            ],
            valor: "480-360",
            tono: "red"
          },
          {
            niveles: [
              {
                nivel: "II",
                valor: "240",
                tono: "red"
              },
              {
                nivel: "III",
                valor: "120",
                tono: "green"
              }
            ],
            valor: "240 · 120",
            tono: "red"
          }
        ]
      },
      {
        nc: "25",
        etiqueta: "Grave",
        cod: "G",
        celdas: [
          {
            niveles: [
              {
                nivel: "I",
                valor: "1000-600",
                tono: "red"
              }
            ],
            valor: "1000-600",
            tono: "red"
          },
          {
            niveles: [
              {
                nivel: "II",
                valor: "500-250",
                tono: "red"
              }
            ],
            valor: "500-250",
            tono: "red"
          },
          {
            niveles: [
              {
                nivel: "II",
                valor: "200-150",
                tono: "red"
              }
            ],
            valor: "200-150",
            tono: "red"
          },
          {
            niveles: [
              {
                nivel: "III",
                valor: "100-50",
                tono: "green"
              }
            ],
            valor: "100-50",
            tono: "green"
          }
        ]
      },
      {
        nc: "10",
        etiqueta: "Leve",
        cod: "L",
        celdas: [
          {
            niveles: [
              {
                nivel: "II",
                valor: "400-240",
                tono: "red"
              }
            ],
            valor: "400-240",
            tono: "red"
          },
          {
            niveles: [
              {
                nivel: "II",
                valor: "200",
                tono: "red"
              },
              {
                nivel: "III",
                valor: "100",
                tono: "green"
              }
            ],
            valor: "200 · 100",
            tono: "red"
          },
          {
            niveles: [
              {
                nivel: "III",
                valor: "80-60",
                tono: "green"
              }
            ],
            valor: "80-60",
            tono: "green"
          },
          {
            niveles: [
              {
                nivel: "III",
                valor: "40",
                tono: "green"
              },
              {
                nivel: "IV",
                valor: "20",
                tono: "green"
              }
            ],
            valor: "40 · 20",
            tono: "green"
          }
        ]
      }
    ]
  },
  ni: {
    code: "NI",
    titulo: "Nivel de intervención",
    encabezado: {
      esquina: "Nivel de intervención",
      columnas: [
        "NR",
        "Significado"
      ]
    },
    pie: "El NR se traduce en un nivel de intervención: I y II requieren actuar, III y IV no.",
    filas: [
      {
        cod: "I",
        etiqueta: "",
        celdas: [
          "4000-600",
          "Situación crítica. Corrección Urgente."
        ],
        tono: "red"
      },
      {
        cod: "II",
        etiqueta: "",
        celdas: [
          "500-150",
          "Corregir y adoptar medidas de control."
        ],
        tono: "red"
      },
      {
        cod: "III",
        etiqueta: "",
        celdas: [
          "120-40",
          "Mejorar si es posible. Sería conveniente justificar la intervención y su rentabilidad."
        ],
        tono: "green"
      },
      {
        cod: "IV",
        etiqueta: "",
        celdas: [
          "20",
          "No intervenir, salvo que un análisis más preciso lo justifique.El"
        ],
        tono: "green"
      }
    ]
  }
};

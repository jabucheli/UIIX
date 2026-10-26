/**
 * Datos de referencia de la investigacion (valores ND/NE/NP/NC/NR/NI por proceso).
 * Extraidos de script.js original (tesis). Sirven como caso de validacion en pruebas.
 * Estructura: APP_REFERENCIA[Actividad][Proceso][0].riesgos = [[riesgo, ND, NE, NP, NC, NR, NI]]
 */
window.APP_REFERENCIA = {
  "Edificación": {
    "Obras preliminares": [
      {
        nombre: "Obras preliminares",
        riesgos: [
          ["Ruido", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Iluminación", "6.84 Muy Deficiente", "1 Esporádica", "6.84 Media", "25 Grave", "171", "II Corregir y adoptar medidas de control"],
          ["Organización del trabajo incorrecta", "7.03 Muy Deficiente", "3 Frecuente", "21.08 Alta", "25 Grave", "527", "I Situación Crítica. Corrección urgente"],
          ["Caída de personas al mismo nivel", "5.77 Deficiente", "3 Frecuente", "17.31 Alta", "25 Grave", "433", "II Corregir y adoptar medidas de control"],
          ["Caída de objetos en manipulación", "2.33 Deficiente", "3 Frecuente", "7.00 Media", "25 Grave", "175", "II Corregir y adoptar medidas de control"],
          ["Golpes/cortes por objetos o herramientas", "5.36 Deficiente", "4 Continuada", "21.43 Alta", "60 Muy Grave", "1286", "I Situación Crítica. Corrección urgente"],
          ["Proyección de fragmentos o partículas", "8.75 Muy Deficiente", "3 Frecuente", "26.25 Muy Alta", "60 Muy Grave", "1575", "I Situación Crítica. Corrección urgente"],
          ["Atrapamiento por o entre objetos", "6.67 Muy Deficiente", "3 Frecuente", "20.00 Alta", "25 Grave", "500", "II Corregir y adoptar medidas de control"],
          ["Atropellos o golpes con vehículos", "5.28 Deficiente", "2 Ocasional", "10.56 Alta", "100 Mortal", "1056", "I Situación Crítica. Corrección urgente"],
          ["Otros riesgos de accidente a) inherentes a la manipulación de herramientas eléctricas","9.62 Muy Deficiente","3 Frecuente","28.85 Muy Alta","60 Muy Grave","1731","I Situación Crítica. Corrección urgente"],
          ["Otros riesgos de accidente b) Inherentes a la manipulación de herramientas manuales","6.50 Muy Deficiente","3 Frecuente","19.50 Alta","60 Muy Grave","1170","I Situación Crítica. Corrección urgente"],
          ["Contactos eléctricos", "8.38 Muy Deficiente", "3 Frecuente", "25.14 Muy Alta", "25 Grave", "628", "I Situación Crítica. Corrección urgente"],
          ["Sobreesfuerzos", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"]
        ]
      }
    ],
    "Movimiento de tierras": [
  {
        nombre: "Movimiento de tierras",
        riesgos: [
          ["Ruido", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Vibración", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Iluminación", "9.47 Muy Deficiente", "2 Ocasional", "18.95 Alta", "25 Grave", "474", "II Corregir y adoptar medidas de control"],
          ["Organización del trabajo incorrecta", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Caída de personas a distinto nivel", "7.36 Muy Deficiente", "3 Frecuente", "22.08 Alta", "100 Mortal", "2208", "I Situación Crítica. Corrección urgente"],
          ["Caída de personas al mismo nivel", "8.85 Muy Deficiente", "2 Ocasional", "17.69 Alta", "60 Muy Grave", "1062", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos por desplome", "7.29 Muy Deficiente", "4 Continuada", "29.17 Muy Alta", "60 Muy Grave", "1750", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos en manipulación", "4.33 Deficiente", "3 Frecuente", "13.00 Alta", "25 Grave", "325", "II Corregir y adoptar medidas de control"],
          ["Golpes/cortes por objetos o herramientas", "5.00 Deficiente", "3 Frecuente", "15.00 Alta", "60 Muy Grave", "900", "I Situación Crítica. Corrección urgente"],
          ["Proyección de fragmentos o partículas", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "60 Muy Grave", "1800", "I Situación Crítica. Corrección urgente"],
          ["Atrapamiento por o entre objetos", "9.00 Muy Deficiente", "4 Continuada", "36.00 Muy Alta", "25 Grave", "900", "I Situación Crítica. Corrección urgente"],
          ["Atropellos o golpes con vehículos", "7.50 Muy Deficiente", "4 Continuada", "30.00 Muy Alta", "100 Mortal", "3000", "I Situación Crítica. Corrección urgente"],
          ["Otros riesgos de accidente a) inherentes a la manipulación de herramientas eléctricas", "9.62 Muy Deficiente", "3 Frecuente","28.85 Muy Alta", "25 Grave", "721", "I Situación Crítica. Corrección urgente"],
          ["Otros riesgos de accidente b) Inherentes a la manipulación de herramientas manuales", "6.50 Muy Deficiente", "3 Frecuente","19.50 Alta", "25 Grave","488", "II Corregir y adoptar medidas de control"],
          ["Contactos eléctricos", "8.38 Muy Deficiente", "3 Frecuente", "25.14 Muy Alta", "25 Grave", "628", "I Situación Crítica. Corrección urgente"],
          ["Sobreesfuerzos", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"]
        ]
      }
    ],
    "Estructura de hormigón armado": [
  {
        nombre: "Estructura de hormigón armado",
        riesgos: [
          ["Ruido", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Vibración", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Iluminación", "9.47 Muy Deficiente", "2 Ocasional", "18.95 Alta", "25 Grave", "474", "II Corregir y adoptar medidas de control"],
          ["Exposición a sustancias nocivas", "10.00 Muy Deficiente", "4 Continuada", "40.00 Muy Alta", "25 Grave", "1000", "I Situación Crítica. Corrección urgente"],
          ["Organización del trabajo incorrecta", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Caída de personas a distinto nivel", "9.06 Muy Deficiente", "4 Continuada", "36.23 Muy Alta", "100 Mortal", "3623", "I Situación Crítica. Corrección urgente"],
          ["Caída de personas al mismo nivel", "8.46 Muy Deficiente", "3 Frecuente", "25.38 Muy Alta", "60 Muy Grave", "1523", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos en manipulación", "9.33 Muy Deficiente", "3 Frecuente", "28.00 Muy Alta", "60 Muy Grave", "1680", "I Situación Crítica. Corrección urgente"],
          ["Golpes/cortes por objetos o herramientas", "7.14 Muy Deficiente", "3 Frecuente", "21.43 Alta", "60 Muy Grave", "1286", "I Situación Crítica. Corrección urgente"],
          ["Proyección de fragmentos o partículas", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "60 Muy Grave", "1800", "I Situación Crítica. Corrección urgente"],
          ["Atrapamiento por o entre objetos", "9.00 Muy Deficiente", "3 Frecuente", "27.00 Muy Alta", "60 Muy Grave", "1620", "I Situación Crítica. Corrección urgente"],
          ["Atropellos o golpes con vehículos", "6.11 Muy Deficiente", "2 Ocasional", "12.22 Alta", "100 Mortal", "1222", "I Situación Crítica. Corrección urgente"],
          ["Otros riesgos de accidente a) inherentes a la manipulación de herramientas eléctricas","9.62 Muy Deficiente","4 Continuada","38.46 Muy Alta","60 Muy Grave","2308","I Situación Crítica. Corrección urgente"],
          ["Otros riesgos de accidente b) Inherentes a la manipulación de herramientas manuales","6.50 Muy Deficiente","4 Continuada","26.00 Muy Alta","25 Grave","650","I Situación Crítica. Corrección urgente"],
          ["Contactos eléctricos", "9.46 Muy Deficiente", "3 Frecuente", "28.38 Muy Alta", "60 Muy Grave", "1703", "I Situación Crítica. Corrección urgente"],
          ["Sobreesfuerzos", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"]
        ]
      }
    ],
    "Estructura metálica": [
  {
        nombre: "Estructura metálica",
        riesgos: [
          ["Ruido", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Vibración", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Iluminación", "9.47 Muy Deficiente", "2 Ocasional", "18.95 Alta", "25 Grave", "474", "II Corregir y adoptar medidas de control"],
          ["Exposición a sustancias nocivas", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Organización del trabajo incorrecta", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Caída de personas a distinto nivel", "6.79 Muy Deficiente", "4 Continuada", "27.17 Muy Alta", "100 Mortal", "2717", "I Situación Crítica. Corrección urgente"],
          ["Caída de personas al mismo nivel", "9.62 Muy Deficiente", "3 Frecuente", "28.85 Muy Alta", "60 Muy Grave", "1731", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos en manipulación", "9.33 Muy Deficiente", "4 Continuada", "37.33 Muy Alta", "100 Mortal", "3733", "I Situación Crítica. Corrección urgente"],
          ["Golpes/cortes por objetos o herramientas", "6.43 Muy Deficiente", "4 Continuada", "25.71 Muy Alta", "60 Muy Grave", "1543", "I Situación Crítica. Corrección urgente"],
          ["Proyección de fragmentos o partículas", "10.00 Muy Deficiente", "4 Continuada", "40.00 Muy Alta", "60 Muy Grave", "2400", "I Situación Crítica. Corrección urgente"],
          ["Atrapamiento por o entre objetos", "7.67 Muy Deficiente", "4 Continuada", "30.67 Muy Alta", "60 Muy Grave", "1840", "I Situación Crítica. Corrección urgente"],
          ["Atropellos o golpes con vehículos", "6.11 Muy Deficiente", "4 Continuada", "24.44 Muy Alta", "60 Muy Grave", "1467", "I Situación Crítica. Corrección urgente"],
          ["Otros riesgos de accidente a) inherentes a la manipulación de herramientas eléctricas","9.62 Muy Deficiente","4 Continuada","38.46 Muy Alta","60 Muy Grave","2308","I Situación Crítica. Corrección urgente"],
          ["Otros riesgos de accidente b) Inherentes a la manipulación de herramientas manuales","7.50 Muy Deficiente","2 Ocasional","15.00 Alta","25 Grave","375","II Corregir y adoptar medidas de control"],
          ["Contactos eléctricos", "8.65 Muy Deficiente", "3 Frecuente", "25.95 Muy Alta", "60 Muy Grave", "1557", "I Situación Crítica. Corrección urgente"],
          ["Contactos térmicos a) inherentes al trabajador","10.00 Muy Deficiente","4 continuada","40.00 Muy Alta","60 Muy Grave","2400","I Situación Crítica. Corrección urgente"],
          ["Contactos térmicos b) inherentes a la manipulación de elementos estructurales","8.98 Muy Deficiente","4 Continuada","35.92 Muy Alta","60 Muy Grave","2155","I Situación Crítica. Corrección urgente"],
          ["Contactos térmicos c) inherentes al proceso de soldadura","9.55 Muy Deficiente","4 Continuada","38.18 Muy Alta","60 Muy Grave","2291","I Situación Crítica. Corrección urgente"],
          ["Sobreesfuerzos", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "60 Muy Grave", "1800", "I Situación Crítica. Corrección urgente"]
        ]
  }
    ],
    "Instalaciones eléctricas": [
  {
        nombre: "Instalaciones eléctricas",
        riesgos: [
          ["Ruido", "10.00 Muy Deficiente", "2 Ocasional", "20.00 Alta", "10 Leve", "200", "II Corregir y adoptar medidas de control"],
          ["Vibración", "10.00 Muy Deficiente", "2 Ocasional", "20.00 Alta", "10 Leve", "200", "II Corregir y adoptar medidas de control"],
          ["Iluminación", "9.47 Muy Deficiente", "1 Esporádica", "9.47 Alta", "10 Leve", "95", "III Mejorar si es posible"],
          ["Organización del trabajo incorrecta", "10.00 Muy Deficiente", "2 Ocasional", "20.00 Alta", "25 Grave", "500", "II Corregir y adoptar medidas de control"],
          ["Caída de personas a distinto nivel", "8.49 Muy Deficiente", "3 Frecuente", "25.47 Muy Alta", "60 Muy Grave", "1528", "I Situación Crítica. Corrección urgente"],
          ["Caída de personas al mismo nivel", "9.62 Muy Deficiente", "3 Frecuente", "28.85 Muy Alta", "60 Muy Grave", "1731", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos en manipulación", "3.00 Deficiente", "2 Ocasional", "6.00 Media", "25 Grave", "150", "II Corregir y adoptar medidas de control"],
          ["Golpes/cortes por objetos o herramientas", "1.79 Mejorable", "2 Ocasional", "3.57 Baja", "25 Grave", "89", "III Mejorar si es posible"],
          ["Proyección de fragmentos o partículas", "3.75 Deficiente", "2 Ocasional", "7.50 Media", "25 Grave", "188", "II Corregir y adoptar medidas de control"],
          ["Otros riesgos de accidente a) inherentes a la manipulación de herramientas eléctricas","5.00 Deficiente","3 Frecuente","15.00 Alta","10 Leve","150","II Corregir y adoptar medidas de control"],
          ["Otros riesgos de accidente b) Inherentes a la manipulación de herramientas manuales","4.00 Deficiente","3 Frecuente","12.00 Alta","10 Leve","120","III Mejorar si es posible"],
          ["Contactos eléctricos", "8.11 Muy Deficiente", "4 Continuada", "32.43 Muy Alta", "60 Muy Grave", "1946", "I Situación Crítica. Corrección urgente"],
          ["Sobreesfuerzos", "10.00 Muy Deficiente", "2 Ocasional", "20.00 Alta", "25 Grave", "500", "II Corregir y adoptar medidas de control"]
        ]
  }
    ],
    "Instalaciones hidrosanitarias": [
  {
        nombre: "Instalaciones hidrosanitarias",
        riesgos: [
          ["Ruido", "10.00 Muy Deficiente", "1 Esporádica", "10.00 Alta", "10 Leve", "100", "III Mejorar si es posible"],
          ["Vibración", "10.00 Muy Deficiente", "1 Esporádica", "10.00 Alta", "10 Leve", "100", "III Mejorar si es posible"],
          ["Iluminación", "9.47 Muy Deficiente", "2 Ocasional", "18.95 Alta", "25 Grave", "474", "II Corregir y adoptar medidas de control"],
          ["Exposición a sustancias nocivas", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Organización del trabajo incorrecta", "10.00 Muy Deficiente", "2 Ocasional", "20.00 Alta", "25 Grave", "500", "II Corregir y adoptar medidas de control"],
          ["Caída de personas a distinto nivel", "7.36 Muy Deficiente", "2 Ocasional", "14.72 Alta", "60 Muy Grave", "883", "I Situación Crítica. Corrección urgente"],
          ["Caída de personas al mismo nivel", "8.08 Muy Deficiente", "3 Frecuente", "24.23 Muy Alta", "60 Muy Grave", "1454", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos en manipulación", "7.33 Muy Deficiente", "2 Ocasional", "14.67 Alta", "60 Muy Grave", "880", "I Situación Crítica. Corrección urgente"],
          ["Golpes/cortes por objetos o herramientas", "2.86 Deficiente", "2 Ocasional", "5.71 Media", "25 Grave", "143", "II Corregir y adoptar medidas de control"],
          ["Proyección de fragmentos o partículas", "5.83 Deficiente", "2 Ocasional", "11.67 Alta", "10 Leve", "117", "III Mejorar si es posible"],
          ["Otros riesgos de accidente a) inherentes a la manipulación de herramientas eléctricas","1.54 Mejorable","2 Ocasional","3.08 Baja","10 Leve","31","III Mejorar si es posible"],
          ["Otros riesgos de accidente b) Inherentes a la manipulación de herramientas manuales","2.00 Mejorable","2 Ocasional","4.00 Baja","10 Leve","41","III Mejorar si es posible"],
          ["Contactos eléctricos", "8.11 Muy Deficiente", "2 Ocasional", "16.22 Alta", "25 Grave", "405", "II Corregir y adoptar medidas de control"],
          ["Sobreesfuerzos", "10.00 Muy Deficiente", "2 Ocasional", "20.00 Alta", "25 Grave", "500", "II Corregir y adoptar medidas de control"]
        ]
  }
    ],
    "Acabados": [
      {
        nombre: "Acabados",
        riesgos: [
          ["Ruido", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Vibración", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Iluminación", "9.47 Muy Deficiente", "1 Esporádica", "9.47 Alta", "10 Leve", "95", "III Mejorar si es posible"],
          ["Exposición a sustancias nocivas", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Organización del trabajo incorrecta", "10.00 Muy Deficiente", "2 Ocasional", "20.00 Alta", "25 Grave", "500", "II Corregir y adoptar medidas de control"],
          ["Caída de personas a distinto nivel", "6.98 Muy Deficiente", "2 Ocasional", "13.96 Alta", "60 Muy Grave", "838", "I Situación Crítica. Corrección urgente"],
          ["Caída de personas al mismo nivel", "7.69 Muy Deficiente", "3 Frecuente", "23.08 Alta", "60 Muy Grave", "1385", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos en manipulación", "9.00 Muy Deficiente", "3 Frecuente", "27.00 Muy Alta", "60 Muy Grave", "1620", "I Situación Crítica. Corrección urgente"],
          ["Golpes/cortes por objetos o herramientas", "3.93 Deficiente", "2 Ocasional", "7.86 Media", "25 Grave", "196", "II Corregir y adoptar medidas de control"],
          ["Proyección de fragmentos o partículas", "5.83 Deficiente", "3 Frecuente", "17.50 Alta", "25 Grave", "438", "II Corregir y adoptar medidas de control"],
          ["Atrapamiento por o entre objetos", "6.67 Muy Deficiente", "3 Frecuente", "20.00 Alta", "60 Muy Grave", "1200", "I Situación Crítica. Corrección urgente"],
          ["Otros riesgos de accidente a) inherentes a la manipulación de herramientas eléctricas","3.08 Deficiente","3 Frecuente","9.23 Alta","25 Grave","231","II Corregir y adoptar medidas de control"],
          ["Otros riesgos de accidente b) Inherentes a la manipulación de herramientas manuales","2.00 Mejorable","2 Ocasional","4.00 Baja","10 Leve","40","III Mejorar si es posible"],
          ["Contactos eléctricos", "8.11 Muy Deficiente", "2 Ocasional", "16.22 Alta", "10 Leve", "162", "II Corregir y adoptar medidas de control"],
          ["Sobreesfuerzos", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"]
        ]
  }
    ]
  },
  "Infraestructura": {
    "Obras preliminares": [
  {
        nombre: "Obras preliminares",
        riesgos: [
          ["Ruido", "8.44 Muy Deficiente", "2 Ocasional", "16.88 Alta", "25 Grave", "422", "II Corregir y adoptar medidas de control"],
          ["Vibración", "10.00 Muy Deficiente", "2 Ocasional", "20.00 Alta", "25 Grave", "500", "II Corregir y adoptar medidas de control"],
          ["Iluminación", "6.84 Muy Deficiente", "1 Esporádica", "6.84 Media", "25 Grave", "171", "II Corregir y adoptar medidas de control"],
          ["Organización del trabajo incorrecta", "7.03 Muy Deficiente", "2 Ocasional", "14.05 Alta", "25 Grave", "351", "II Corregir y adoptar medidas de control"],
          ["Caída de personas al mismo nivel", "7.50 Muy Deficiente", "3 Frecuente", "22.50 Alta", "25 Grave", "563", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos en manipulación", "6.86 Muy Deficiente", "3 Frecuente", "20.57 Alta", "25 Grave", "514", "I Situación Crítica. Corrección urgente"],
          ["Golpes/cortes por objetos o herramientas", "6.88 Muy Deficiente", "3 Frecuente", "20.63 Alta", "25 Grave", "516", "I Situación Crítica. Corrección urgente"],
          ["Proyección de fragmentos o partículas", "7.74 Muy Deficiente", "3 Frecuente", "23.23 Alta", "25 Grave", "581", "I Situación Crítica. Corrección urgente"],
          ["Atrapamiento por o entre objetos", "7.71 Muy Deficiente", "2 Ocasional", "15.42 Alta", "25 Grave", "385", "II Corregir y adoptar medidas de control"],
          ["Atropellos o golpes con vehículos", "6.67 Muy Deficiente", "2 Ocasional", "13.33 Alta", "60 Muy Grave", "800", "I Situación Crítica. Corrección urgente"],
          ["Otros riesgos de accidente a) inherentes a la manipulación de herramientas eléctricas", "5.28 Deficiente", "3 Frecuente", "15.83 Alta", "60 Muy Grave", "950", "I Situación Crítica. Corrección urgente"],
          ["Otros riesgos de accidente b) Inherentes a la manipulación de herramientas manuales", "5.12 Deficiente", "3 Frecuente", "15.37 Alta", "25 Grave", "384", "II Corregir y adoptar medidas de control"],
          ["Contactos eléctricos", "8.17 Muy Deficiente", "2 Ocasional", "16.33 Alta", "25 Grave", "408", "II Corregir y adoptar medidas de control"],
          ["Sobreesfuerzos", "8.93 Muy Deficiente", "3 Frecuente", "26.79 Muy Alta", "60 Muy Grave", "1607", "I Situación Crítica. Corrección urgente"]
        ]
  }
    ],
    "Movimiento de tierras": [
    {
        nombre: "Movimiento de tierras",
        riesgos: [
          ["Ruido", "8.44 Muy Deficiente", "3 Frecuente", "25.31 Muy Alta", "25 Grave", "633", "I Situación Crítica. Corrección urgente"],
          ["Vibración", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Iluminación", "6.84 Muy Deficiente", "2 Ocasional", "13.68 Alta", "25 Grave", "342", "II Corregir y adoptar medidas de control"],
          ["Organización del trabajo incorrecta", "7.03 Muy Deficiente", "2 Ocasional", "14.05 Alta", "25 Grave", "351", "II Corregir y adoptar medidas de control"],
          ["Caída de personas a distinto nivel", "7.42 Muy Deficiente", "3 Frecuente", "22.26 Alta", "100 Mortal", "2226", "I Situación Crítica. Corrección urgente"],
          ["Caída de personas al mismo nivel", "7.50 Muy Deficiente", "3 Frecuente", "22.50 Alta", "60 Muy Grave", "1350", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos por desplome", "6.49 Muy Deficiente", "3 Frecuente", "19.46 Alta", "60 Muy Grave", "1168", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos en manipulación", "6.86 Muy Deficiente", "3 Frecuente", "20.57 Alta", "25 Grave", "514", "I Situación Crítica. Corrección urgente"],
          ["Golpes/cortes por objetos o herramientas", "6.88 Muy Deficiente", "2 Ocasional", "13.75 Alta", "25 Grave", "344", "II Corregir y adoptar medidas de control"],
          ["Proyección de fragmentos o partículas", "7.74 Muy Deficiente", "3 Frecuente", "23.23 Alta", "25 Grave", "581", "I Situación Crítica. Corrección urgente"],
          ["Atrapamiento por o entre objetos", "7.71 Muy Deficiente", "2 Ocasional", "15.42 Alta", "25 Grave", "385", "II Corregir y adoptar medidas de control"],
          ["Atrapamiento por vuelco de máquinas", "6.73 Muy Deficiente", "4 Continuada", "26.91 Muy Alta", "100 Mortal", "2691", "I Situación Crítica. Corrección urgente"],
          ["Atropellos o golpes con vehículos", "6.67 Muy Deficiente", "4 Continuada", "26.67 Muy Alta", "100 Mortal", "2667", "I Situación Crítica. Corrección urgente"],
          ["Otros riesgos de accidente a) inherentes a la manipulación de herramientas eléctricas", "5.28 Deficiente", "2 Ocasional", "10.56 Alta", "25 Grave", "264", "II Corregir y adoptar medidas de control"],
          ["Otros riesgos de accidente b) Inherentes a la manipulación de herramientas manuales", "5.12 Deficiente", "2 Ocasional", "10.24 Alta", "25 Grave", "256", "II Corregir y adoptar medidas de control"],
          ["Contactos eléctricos", "8.17 Muy Deficiente", "2 Ocasional", "16.33 Alta", "25 Grave", "408", "II Corregir y adoptar medidas de control"],
          ["Sobreesfuerzos", "8.93 Muy Deficiente", "2 Ocasional", "17.86 Alta", "25 Grave", "446", "II Corregir y adoptar medidas de control"]
        ]
    }
      ],
    "Obras complementarias (Pozos y estructuras auxiliares)": [
  {
        nombre: "Obras complementarias (Pozos y estructuras auxiliares)",
        riesgos: [
          ["Ruido", "8.44 Muy Deficiente", "3 Frecuente", "25.31 Muy Alta", "25 Grave", "633", "I Situación Crítica. Corrección urgente"],
          ["Vibración", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Radiaciones ionizantes", "7.88 Muy Deficiente", "2 Ocasional", "15.77 Alta", "60 Muy Grave", "946", "I Situación Crítica. Corrección urgente"],
          ["Iluminación", "6.84 Muy Deficiente", "2 Ocasional", "13.68 Alta", "25 Grave", "342", "II Corregir y adoptar medidas de control"],
          ["Organización del trabajo incorrecta", "7.03 Muy Deficiente", "2 Ocasional", "14.05 Alta", "25 Grave", "351", "II Corregir y adoptar medidas de control"],
          ["Caída de personas a distinto nivel", "7.42 Muy Deficiente", "3 Frecuente", "22.26 Alta", "100 Mortal", "2226", "I Situación Crítica. Corrección urgente"],
          ["Caída de personas al mismo nivel", "7.50 Muy Deficiente", "3 Frecuente", "22.50 Alta", "60 Muy Grave", "1350", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos por desplome", "6.49 Muy Deficiente", "3 Frecuente", "19.46 Alta", "100 Mortal", "1946", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos en manipulación", "6.86 Muy Deficiente", "3 Frecuente", "20.57 Alta", "25 Grave", "514", "I Situación Crítica. Corrección urgente"],
          ["Golpes/cortes por objetos o herramientas", "6.88 Muy Deficiente", "3 Frecuente", "20.63 Alta", "25 Grave", "516", "I Situación Crítica. Corrección urgente"],
          ["Proyección de fragmentos o partículas", "7.74 Muy Deficiente", "3 Frecuente", "23.23 Alta", "25 Grave", "581", "I Situación Crítica. Corrección urgente"],
          ["Atrapamiento por o entre objetos", "7.71 Muy Deficiente", "3 Frecuente", "23.13 Alta", "100 Mortal", "2313", "I Situación Crítica. Corrección urgente"],
          ["Otros riesgos de accidente a) inherentes a la manipulación de herramientas eléctricas", "5.28 Deficiente", "3 Frecuente", "15.83 Alta", "25 Grave", "396", "II Corregir y adoptar medidas de control"],
          ["Otros riesgos de accidente b) Inherentes a la manipulación de herramientas manuales", "5.12 Deficiente", "3 Frecuente", "15.37 Alta", "60 Muy Grave", "922", "I Situación Crítica. Corrección urgente"],
          ["Otra exposición a) asfixia o intoxicación", "7.92 Muy Deficiente", "2 Ocasional", "15.83 Alta", "100 Mortal", "1583", "I Situación Crítica. Corrección urgente"],
          ["Contactos eléctricos", "8.17 Muy Deficiente", "2 Ocasional", "16.33 Alta", "25 Grave", "408", "II Corregir y adoptar medidas de control"],
          ["Sobreesfuerzos", "8.93 Muy Deficiente", "3 Frecuente", "26.79 Muy Alta", "25 Grave", "670", "I Situación Crítica. Corrección urgente"]
        ]
  }
    ],
    "Trabajos en zanjas (Tubería)": [
  {
        nombre: "Trabajos en zanjas (Tubería)",
        riesgos: [
          ["Ruido", "8.44 Muy Deficiente", "3 Frecuente", "25.31 Muy Alta", "25 Grave", "633", "I Situación Crítica. Corrección urgente"],
          ["Vibración", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Radiaciones ionizantes", "7.88 Muy Deficiente", "2 Ocasional", "15.77 Alta", "60 Muy Grave", "946", "I Situación Crítica. Corrección urgente"],
          ["Iluminación", "6.84 Muy Deficiente", "3 Frecuente", "20.53 Alta", "25 Grave", "513", "I Situación Crítica. Corrección urgente"],
          ["Organización del trabajo incorrecta", "7.03 Muy Deficiente", "2 Ocasional", "14.05 Alta", "25 Grave", "351", "II Corregir y adoptar medidas de control"],
          ["Caída de personas a distinto nivel", "7.42 Muy Deficiente", "3 Frecuente", "22.26 Alta", "60 Muy Grave", "1335", "I Situación Crítica. Corrección urgente"],
          ["Caída de personas al mismo nivel", "7.50 Muy Deficiente", "3 Frecuente", "22.50 Alta", "25 Grave", "563", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos por desplome", "6.49 Muy Deficiente", "3 Frecuente", "19.46 Alta", "60 Muy Grave", "1168", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos en manipulación", "6.86 Muy Deficiente", "3 Frecuente", "20.57 Alta", "25 Grave", "514", "I Situación Crítica. Corrección urgente"],
          ["Golpes/cortes por objetos o herramientas", "6.88 Muy Deficiente", "3 Frecuente", "20.63 Alta", "25 Grave", "516", "I Situación Crítica. Corrección urgente"],
          ["Proyección de fragmentos o partículas", "7.74 Muy Deficiente", "3 Frecuente", "23.23 Alta", "25 Grave", "581", "I Situación Crítica. Corrección urgente"],
          ["Atrapamiento por o entre objetos", "7.71 Muy Deficiente", "3 Frecuente", "23.13 Alta", "60 Muy Grave", "1388", "I Situación Crítica. Corrección urgente"],
          ["Atropellos o golpes con vehículos", "6.67 Muy Deficiente", "2 Ocasional", "13.33 Alta", "100 Mortal", "1333", "I Situación Crítica. Corrección urgente"],
          ["Otros riesgos de accidente a) inherentes a la manipulación de herramientas eléctricas", "5.28 Deficiente", "3 Frecuente", "15.83 Alta", "25 Grave", "396", "II Corregir y adoptar medidas de control"],
          ["Otros riesgos de accidente b) Inherentes a la manipulación de herramientas manuales", "5.12 Deficiente", "3 Frecuente", "15.37 Alta", "60 Muy Grave", "922", "I Situación Crítica. Corrección urgente"],
          ["Otra exposición a) asfixia o intoxicación", "7.92 Muy Deficiente", "3 Frecuente", "23.75 Alta", "60 Muy Grave", "1425", "I Situación Crítica. Corrección urgente"],
          ["Contactos eléctricos", "8.17 Muy Deficiente", "2 Ocasional", "16.33 Alta", "25 Grave", "408", "II Corregir y adoptar medidas de control"],
          ["Sobreesfuerzos", "8.93 Muy Deficiente", "2 Ocasional", "17.86 Alta", "25 Grave", "446", "II Corregir y adoptar medidas de control"]
        ]
  }
   ],
    "Relleno": [
  {
        nombre: "Relleno",
        riesgos: [
          ["Ruido", "8.44 Muy Deficiente", "3 Frecuente", "25.31 Muy Alta", "25 Grave", "633", "I Situación Crítica. Corrección urgente"],
          ["Vibración", "10.00 Muy Deficiente", "3 Frecuente", "30.00 Muy Alta", "25 Grave", "750", "I Situación Crítica. Corrección urgente"],
          ["Radiaciones ionizantes", "7.88 Muy Deficiente", "3 Frecuente", "23.65 Alta", "60 Muy Grave", "1419", "I Situación Crítica. Corrección urgente"],
          ["Iluminación", "7.88 Muy Deficiente", "1 Esporádica", "7.88 Media", "10 Leve", "79", "III Mejorar si es posible"],
          ["Organización del trabajo incorrecta", "7.03 Muy Deficiente", "1 Esporádica", "7.03 Media", "10 Leve", "70", "III Mejorar si es posible"],
          ["Caída de personas a distinto nivel", "7.42 Muy Deficiente", "2 Ocasional", "14.84 Alta", "60 Muy Grave", "890", "I Situación Crítica. Corrección urgente"],
          ["Caída de personas al mismo nivel", "7.50 Muy Deficiente", "3 Frecuente", "22.50 Alta", "25 Grave", "563", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos por desplome", "6.49 Muy Deficiente", "3 Frecuente", "19.46 Alta", "60 Muy Grave", "1168", "I Situación Crítica. Corrección urgente"],
          ["Caída de objetos en manipulación", "6.86 Muy Deficiente", "2 Ocasional", "13.71 Alta", "25 Grave", "343", "II Corregir y adoptar medidas de control"],
          ["Golpes/cortes por objetos o herramientas", "6.88 Muy Deficiente", "3 Frecuente", "20.63 Alta", "25 Grave", "516", "I Situación Crítica. Corrección urgente"],
          ["Proyección de fragmentos o partículas", "7.74 Muy Deficiente", "3 Frecuente", "23.23 Alta", "25 Grave", "581", "I Situación Crítica. Corrección urgente"],
          ["Atrapamiento por o entre objetos", "7.71 Muy Deficiente", "3 Frecuente", "23.13 Alta", "60 Muy Grave", "1388", "I Situación Crítica. Corrección urgente"],
          ["Atropellos o golpes con vehículos", "6.67 Muy Deficiente", "3 Frecuente", "20.00 Alta", "100 Mortal", "2000", "I Situación Crítica. Corrección urgente"],
          ["Otros riesgos de accidente a) inherentes a la manipulación de herramientas eléctricas", "5.28 Deficiente", "2 Ocasional", "10.56 Alta", "25 Grave", "264", "II Corregir y adoptar medidas de control"],
          ["Otros riesgos de accidente b) Inherentes a la manipulación de herramientas manuales", "5.12 Deficiente", "3 Frecuente", "15.37 Alta", "25 Grave", "384", "II Corregir y adoptar medidas de control"],
          ["Contactos eléctricos", "8.17 Muy Deficiente", "2 Ocasional", "16.33 Alta", "25 Grave", "408", "II Corregir y adoptar medidas de control"],
          ["Sobreesfuerzos", "8.93 Muy Deficiente", "3 Frecuente", "26.79 Muy Alta", "25 Grave", "670", "I Situación Crítica. Corrección urgente"]
        ]
  }
      ]
    }
};

window.APP_REFERENCIA_VALIDO = true;

# Continuación de la página web — pestaña **Objetivos**

## Instrucción general

Continuar trabajando **sobre la misma página web ya desarrollada**, sin crear una página independiente y sin alterar la navegación, encabezado, pie de página ni el lenguaje visual general existente.

Trabajar exclusivamente en la pestaña **“Objetivos”**.

El título visible de esta sección debe ser:

# Objetivos - Hipótesis

Esta sección forma parte de la **presentación de una tesis doctoral**, por lo que debe tener una apariencia académica, sobria, profesional, clara y visualmente equilibrada.

---

# 1. Archivos de referencia

## Referencia de contenido

Usar como fuente principal:

`D:\ejemplo\tes\Obj.docx`

El contenido debe corresponder a la investigación doctoral sobre:

**Estrategia metodológica de gestión de proyectos basada en controles de ingeniería, orientada a la mejora de las condiciones de seguridad laboral y la prevención de riesgos en proyectos de construcción de la ciudad de Quito, en conformidad con la normativa ecuatoriana vigente entre 2024 y 2026.**

Para mantener coherencia conceptual con la problemática, utilizar como contexto complementario:

`D:\ejemplo\tes\probl.docx`

El archivo `probl.docx` es únicamente contextual.  
**No sustituir ni modificar los objetivos, hipótesis o alcances establecidos en `Obj.docx`.**

## Referencia visual

Usar como referencia de estructura la **diapositiva 3** de:

`D:\ejemplo\tes\Ejemplo.pptx`

La diapositiva 3 utiliza una composición horizontal 16:9 con:

- título grande centrado en la parte superior;
- una franja gráfica institucional superior;
- un bloque rectangular horizontal grande en la zona superior izquierda;
- cuatro bloques rectangulares inferiores organizados en una secuencia 2 × 2;
- conectores o flechas entre los bloques;
- una zona derecha independiente;
- un contenedor principal de esquinas redondeadas en la parte derecha;
- elementos gráficos circulares y rectangulares complementarios;
- abundante espacio en blanco;
- líneas finas y composición limpia;
- pie gráfico inferior.

**Mantener esta lógica compositiva**, pero adaptar los elementos para incorporar el contenido de la tesis doctoral.

No es necesario reproducir logos dentro del contenido de la pestaña si la página web ya posee su propio encabezado institucional.

---

# 2. Restricción principal de tamaño

La sección completa debe caber en una sola vista equivalente a **una diapositiva 16:9**.

Diseñar el contenido dentro de un lienzo de referencia aproximado:

```css
aspect-ratio: 16 / 9;
width: 100%;
max-width: 1600px;
```

En escritorio, todo el contenido académico debe poder verse **simultáneamente**, sin scroll interno.

Prioridades:

1. conservar completo el objetivo general;
2. sintetizar los objetivos específicos;
3. sintetizar generosamente la hipótesis;
4. condensar los alcances en frases esenciales;
5. mantener la delimitación espacial visible;
6. dejar espacios para fotografías;
7. no reducir la tipografía hasta hacerla difícil de leer.

---

# 3. Distribución general

La composición debe respetar la lógica espacial de la diapositiva 3.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                         OBJETIVOS - HIPÓTESIS                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────┐      ┌───────────────────────┐ │
│  │ OBJETIVO GENERAL                         │      │ HIPÓTESIS             │ │
│  │ texto completo                           │      │ síntesis generosa     │ │
│  └──────────────────────────────────────────┘      └───────────────────────┘ │
│                    ↓                                  ○                      │
│  ┌────────────────────┐ → ┌────────────────────┐      ┌───────────────────┐ │
│  │ OE 01              │   │ OE 02              │      │ ALCANCE           │ │
│  └────────────────────┘   └────────────────────┘      │ • estudio         │ │
│                    ↓                                  │ • teórico         │ │
│  ┌────────────────────┐ → ┌────────────────────┐      │ • práctico        │ │
│  │ OE 03              │   │ OE 04              │      │ • metodológico    │ │
│  └────────────────────┘   └────────────────────┘      │ • temporal        │ │
│                                                       └───────────────────┘ │
│                                          ┌──────────────┐ ┌──────────────┐  │
│                                          │ FOTO 01      │ │ FOTO 02      │  │
│                                          └──────────────┘ └──────────────┘  │
│                                          DELIMITACIÓN ESPACIAL              │
└──────────────────────────────────────────────────────────────────────────────┘
```

La distribución anterior es una guía funcional.  
La versión final debe conservar las proporciones y equilibrio visual de la diapositiva 3 de `Ejemplo.pptx`.

---

# 4. Bloque superior izquierdo — OBJETIVO GENERAL

Este bloque debe ocupar la posición del rectángulo horizontal grande de la diapositiva 3.

### Encabezado
**OBJETIVO GENERAL**

### Texto — colocar COMPLETO, sin resumir

> Proponer una estrategia metodológica de gestión de proyectos basada en controles de ingeniería, orientada a la mejora de las condiciones de seguridad laboral y la prevención de riesgos en proyectos de construcción de la ciudad de Quito, en conformidad con la normativa ecuatoriana vigente entre 2024 y 2026.

### Reglas

- No eliminar palabras.
- No parafrasear.
- No resumir.
- El objetivo general debe conservar exactamente su sentido académico.
- Puede utilizarse negrita selectiva en:
  - **estrategia metodológica de gestión de proyectos**;
  - **controles de ingeniería**;
  - **seguridad laboral y prevención de riesgos**;
  - **Quito**;
  - **2024–2026**.
- Evitar que todo el párrafo aparezca en negrita.

---

# 5. Secuencia inferior izquierda — OBJETIVOS ESPECÍFICOS

Mantener la disposición de **cuatro rectángulos conectados**, equivalente a la estructura 2 × 2 de la diapositiva 3.

Utilizar números grandes o discretamente destacados:

**01 — 02 — 03 — 04**

Los textos deben presentarse sintetizados para exposición oral, pero conservar fielmente la intención de `Obj.docx`.

---

## 01 — FUNDAMENTAR

**Determinar los fundamentos teóricos y normativos** de la gestión de proyectos, controles de ingeniería, seguridad y salud en el trabajo, prevención y evaluación de riesgos aplicables al sector de la construcción en Quito.

---

## 02 — ANALIZAR Y EVALUAR

**Analizar los riesgos laborales de seguridad** en proyectos de edificaciones e infraestructura básica mediante análisis normativo, técnico y de campo, cuestionarios de chequeo y las metodologías **NTP 324 y NTP 330**.

---

## 03 — ESTRUCTURAR

**Estructurar la estrategia metodológica** integrando diagnóstico, cuestionarios de verificación, matrices de evaluación de riesgos y **Análisis de Riesgo en el Trabajo (ART)**, con base en controles de ingeniería y normativa ecuatoriana vigente.

---

## 04 — VALIDAR

**Validar la estrategia mediante aplicación piloto** en proyectos de edificación e infraestructura básica, valorando su coherencia **teórica, técnica, operativa y normativa** y su contribución a la mejora de la seguridad laboral.

---

# 6. Zona derecha superior — HIPÓTESIS

Utilizar el gran contenedor de **esquinas redondeadas** de la zona derecha de la diapositiva 3.

### Encabezado
**HIPÓTESIS**

### Síntesis recomendada

> Una estrategia metodológica de gestión de proyectos basada en controles de ingeniería y articulada con la normativa ecuatoriana vigente **contribuirá significativamente a fortalecer la gestión de riesgos laborales de seguridad** en los proyectos de construcción de Quito, al mejorar la **identificación, evaluación y control de riesgos** y favorecer prácticas preventivas que reduzcan los niveles de exposición durante las actividades constructivas.

La hipótesis debe conservar de manera explícita:

- estrategia metodológica de gestión de proyectos;
- controles de ingeniería;
- normativa ecuatoriana;
- fortalecimiento de la gestión de riesgos laborales;
- identificación, evaluación y control;
- reducción de la exposición al riesgo;
- proyectos de construcción de Quito.

No reducirla a una frase excesivamente corta.

---

# 7. Zona derecha media — ALCANCE TEMÁTICO

Debajo de la hipótesis incorporar un bloque visual compacto titulado:

**ALCANCE TEMÁTICO**

No utilizar párrafos largos.  
Presentar cada alcance mediante **título corto + una frase esencial**.

---

### Alcance del estudio

**Estrategia metodológica para edificaciones e infraestructura básica en Quito**, integrando identificación y evaluación de riesgos, cuestionarios de chequeo, ART y controles de ingeniería dentro de la gestión del proyecto.

---

### Alcance teórico

Integra **gestión de proyectos, prevención de riesgos laborales, controles de ingeniería, NTP 324, NTP 330** y el marco ecuatoriano: **D.E. 255-2024, AM-MDT-2024-196 y AM-MDT-2025-122**.

---

### Alcance práctico

Aplicación de **cuestionarios NTP 324**, evaluación mediante **NTP 330** y desarrollo de **ART con controles de ingeniería**, incorporables a alcance, recursos, cronograma, control y comunicación del proyecto.

---

### Alcance metodológico

Secuencia integrada:

**diagnóstico → nivel de deficiencia → evaluación del riesgo → priorización → ART → controles de ingeniería → seguimiento y control del proyecto.**

---

### Alcance temporal

**2024–2026**, en coherencia con el período de desarrollo de la investigación y la normativa ecuatoriana analizada.

---

# 8. Delimitación espacial

Crear un bloque compacto e independiente, preferiblemente de formato horizontal y esquinas redondeadas, inspirado en el elemento rectangular inferior derecho de la diapositiva 3.

### Encabezado
**DELIMITACIÓN ESPACIAL**

### Texto sintetizado

> **Ciudad de Quito, Ecuador:** proyectos públicos y privados de **edificación e infraestructura básica**, considerando sus procesos constructivos, condiciones de trabajo, peligros y riesgos laborales de seguridad.

Puede acompañarse con un pequeño ícono de ubicación, pero sin convertirlo en un elemento dominante.

---

# 9. Cuadros reservados para fotografías

Dejar **dos espacios claramente definidos para fotografías posteriores**.

### FOTO 01
Placeholder relacionado con:

**Evaluación de condiciones de seguridad / actividad constructiva**

### FOTO 02
Placeholder relacionado con:

**Aplicación de controles de ingeniería / proyecto piloto**

### Diseño de placeholders

- no insertar imágenes genéricas;
- usar borde fino o fondo gris muy claro;
- mantener relación de aspecto horizontal aproximada de `4:3` o `16:10`;
- incluir únicamente una pequeña etiqueta:
  - `FOTOGRAFÍA 01`
  - `FOTOGRAFÍA 02`
- permitir que posteriormente una fotografía pueda sustituir el placeholder sin modificar la distribución general;
- mantener ambos cuadros compactos para que no resten espacio a la información central.

---

# 10. Relación conceptual entre los objetivos

Conservar las flechas o conectores de la diapositiva 3 para comunicar una **secuencia metodológica**, no como decoración.

La lectura debe ser:

```text
OBJETIVO GENERAL
       ↓
01 FUNDAMENTAR
       →
02 ANALIZAR Y EVALUAR
       ↓
03 ESTRUCTURAR
       →
04 VALIDAR
```

Esta secuencia debe ser fácil de comprender visualmente y reflejar la lógica de la investigación doctoral.

---

# 11. Jerarquía visual

Usar la siguiente prioridad:

1. **Objetivos - Hipótesis**
2. **Objetivo General**
3. **Hipótesis**
4. **Objetivos Específicos**
5. **Alcance Temático**
6. **Delimitación Espacial**
7. **Fotografías**

El título principal debe mantener un tamaño semejante al título de la diapositiva 3.

Los títulos internos deben ser muy breves y utilizar contraste suficiente.

---

# 12. Estilo visual a conservar del ejemplo

Tomar como referencia directa la diapositiva 3:

- fondo blanco;
- composición limpia;
- predominio de líneas negras finas;
- cajas rectangulares sin exceso de rellenos;
- esquinas rectas en la secuencia de objetivos;
- esquinas redondeadas en los bloques de la derecha;
- utilización controlada del **verde institucional** y **rojo institucional** como acentos;
- texto principal en gris oscuro / negro;
- grandes zonas de respiración visual;
- evitar sombras fuertes;
- evitar degradados;
- evitar efectos 3D;
- mantener una apariencia académica institucional.

No convertir la diapositiva en un tablero de muchas tarjetas de colores.

---

# 13. Optimización para exposición doctoral

La sección será utilizada durante una **defensa de tesis doctoral**.

Por ello:

- cada bloque debe poder comprenderse en pocos segundos;
- el objetivo general debe ser legible completo;
- los objetivos específicos deben funcionar como ideas guía para la exposición oral;
- la hipótesis debe mantener suficiente contenido para que el tribunal comprenda la relación causal propuesta;
- los alcances deben ser visibles pero secundarios;
- destacar las expresiones clave, no párrafos completos;
- evitar información redundante;
- no incluir estadísticas en esta pestaña;
- no introducir antecedentes ni justificación;
- no incorporar información que corresponda a metodología, resultados o conclusiones fuera de lo necesario para expresar los alcances.

---

# 14. Comportamiento responsive

## Escritorio

La vista principal debe mantener la composición **16:9 equivalente a una diapositiva**.

No permitir que el contenido se convierta en una página vertical extensa.

## Tablet / móvil

Puede reorganizarse verticalmente únicamente para garantizar legibilidad.

Orden recomendado:

1. Objetivo general
2. Objetivos específicos
3. Hipótesis
4. Alcance temático
5. Delimitación espacial
6. Fotografías

La versión móvil no debe afectar el diseño de escritorio utilizado para la presentación.

---

# 15. Prohibiciones

- No utilizar contenido del plan de tesis de Bonilla Albán.
- No sustituir la tesis por un estudio de alcantarillado de Shushufindi.
- No utilizar GTC 45 como metodología principal de esta investigación.
- No modificar el objetivo general.
- No inventar nuevos objetivos.
- No añadir objetivos específicos adicionales.
- No cambiar **NTP 324**, **NTP 330** ni **ART** por otras metodologías.
- No cambiar la delimitación espacial de **Quito**.
- No cambiar el período **2024–2026**.
- No saturar la diapositiva con texto.
- No crear scroll interno en la vista de presentación.
- No insertar fotografías definitivas todavía.
- No eliminar los espacios reservados para fotografías.
- No alterar el resto de la página web.

---

# 16. Verificación final obligatoria

Antes de dar por terminada la pestaña comprobar:

- [ ] El título dice exactamente **“Objetivos - Hipótesis”**.
- [ ] El objetivo general está completo.
- [ ] Existen exactamente cuatro objetivos específicos.
- [ ] Los cuatro objetivos aparecen sintetizados y conectados visualmente.
- [ ] Se conservan NTP 324, NTP 330 y ART.
- [ ] La hipótesis representa fielmente la formulación de `Obj.docx`.
- [ ] Están presentes los cinco alcances: estudio, teórico, práctico, metodológico y temporal.
- [ ] Aparece la delimitación espacial en Quito.
- [ ] El período 2024–2026 es visible.
- [ ] Hay dos placeholders para fotografías.
- [ ] La composición mantiene la lógica de la diapositiva 3 de `Ejemplo.pptx`.
- [ ] Todo cabe en una sola vista 16:9 en escritorio.
- [ ] La tipografía continúa siendo legible a distancia durante una defensa doctoral.
- [ ] No se ha utilizado contenido de otra tesis.

---

# Resultado esperado

La pestaña **Objetivos** debe presentar una síntesis visual académica de la investigación doctoral en una única composición equivalente a una diapositiva, conservando la estructura de la diapositiva 3 de `Ejemplo.pptx`:

- **arriba / izquierda:** objetivo general completo;
- **debajo:** cuatro objetivos específicos conectados;
- **derecha:** hipótesis;
- **continuación:** alcance temático;
- **parte inferior derecha:** delimitación espacial y dos espacios para fotografías.

El resultado debe funcionar simultáneamente como **sección de la página web** y como **lámina de apoyo para la presentación y defensa de la tesis doctoral**.

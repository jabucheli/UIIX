# Registro de adaptaciones metodológicas

Aplicación de evaluación de riesgos laborales · NTP 330
Documento de trazabilidad entre los archivos fuente de la investigación y su implementación.

---

## 1. Semántica de la lista de chequeo (nd.xlsx)

El libro `nd.xlsx` define la columna **"No"** como la única que genera puntaje:

```
NDD = IF(F="X", NDP, 0)
ND  = Σ NDD   (máx. 10.00)
```

Es decir:

| Opción | Efecto en ND |
|---|---|
| **Sí** | La condición evaluada **cumple**. No aporta NDD. |
| **No** | La condición **no cumple**. Aporta su peso NDP = (NDR × 10) / ΣNDR de la lista. |
| **No aplica** | No corresponde al riesgo/actividad/proceso. No aporta y **no se cuenta** como pregunta aplicable. |
| **No verificado** | Sin evidencia suficiente. No aporta (no se considera incumplimiento automático) pero deja la lista **pendiente** y **bloquea la aprobación**. |

Esta semántica es la implementada en `js/app.motor.js` (`calcularND`, `capND`) y validada en
`js/app.pruebas.js` (grupos "Excel §22" y "Dinámico §23"). Reemplaza a la inversión
"Sí suma" que usaba la versión anterior de la aplicación.

## 2. Bandas del Nivel de Deficiencia (ND)

Según la fórmula del Excel (hoja de rangos), con ND continuo limitado a [0, 10]:

| Banda | Valor | Criterio |
|---|---|---|
| Muy Deficiente (MD) | 10 | ND > 6 |
| Deficiente (D) | 6 | 2 < ND ≤ 6 |
| Mejorable (M) | 2 | 0 < ND ≤ 2 |
| Aceptable (B) | 0 | ND = 0 (sin incumplimientos) |

## 3. Bandas del Nivel de Probabilidad (NP)

El Excel clasifica el NP continuo (NP = ND × NE) con los umbrales de la tabla 6 de la NTP 330:

| Nivel | Sigla | Criterio |
|---|---|---|
| Muy Alta | MA | NP ≥ 24 |
| Alta | A | NP > 8 |
| Media | M | NP > 4 |
| Baja | B | NP ≤ 4 |

Nota: el tope superior de cada banda usa **≥** (el valor 24 cae en "Muy Alta"), acorde a la
fórmula `L3` del libro.

## 4. Nivel de Intervención (NI)

El dataset de la tesis utilizaba umbrales adaptados (I ≥ 501 / II 121–500 / III 21–120 / IV ≤ 20).
**Decisión acordada:** la aplicación usa el **perfil estándar de la NTP 330** (tabla 9) como perfil activo:

| NI | NR | Interpretación |
|---|---|---|
| I | 600 – 4000 | Situación crítica. Corrección urgente. |
| II | 150 – 599 | Corregir y adoptar medidas de control. |
| III | 40 – 149 | Mejorar si es posible. Justificar la intervención. |
| IV | < 40 | No intervenir, salvo análisis más preciso. |

El perfil de la tesis se conserva como `NI_PERFIL_TESIS` (accesible vía `NTP330.init('tesis')`)
y se documenta en la pestaña Metodología.

## 5. Niveles de Exposición (NE) y de Consecuencias (NC)

- **NE** (tabla 4 NTP 330): Continuada (4), Frecuente (3), Ocasional (2), Esporádica (1),
  con descripciones de frecuencia/duración tomadas de la NTP 330 y de la carpeta `ER`.
- **NC** (tabla 7 NTP 330): Mortal o Catastrófico (100), Muy Grave (60), Grave (25), Leve (10),
  con descripción y ejemplos.

## 6. Tipos de proyecto y procesos constructivos

> **Actualización (correcciones2.md §2/§23):** el flujo de evaluación usa **solo dos tipos**
> generales de proyecto — **Estructura** e **Infraestructura** — como desplegable obligatorio.
> La clave `Edificación` del dataset de referencia se mapea internamente a la categoría
> `Estructura` (misma lista de riesgos). Los 13 subtipos y los campos Subproceso/Actividad/Tarea
> se eliminaron del flujo principal (se conservan en datos y administración por compatibilidad).

- **Tipos generales de proyecto** (únicos en el flujo de evaluación, `js/app.data.procesos.js`):
  - Estructura (prefijo "E-") → usa los riesgos de "Edificación".
  - Infraestructura (prefijo "I-").
- **Procesos por tipo** según `procesos.doc` y las claves del dataset de referencia:
  - Estructura / Edificación (7): Obras preliminares · Movimiento de tierras · Estructura de hormigón armado ·
    Estructura metálica · Instalaciones eléctricas · Instalaciones hidrosanitarias · Acabados.
  - Infraestructura (5): Obras preliminares · Movimiento de tierras · Obras complementarias
    (Pozos y estructuras auxiliares) · Trabajos en zanjas (Tubería) · Relleno.

Ambos catálogos son editables sin modificar el código (módulo de administración → `ntp330.proyectos.override`).

## 7. Generación automática de riesgos

Para cada (tipo, proceso) la aplicación genera los riesgos del dataset de referencia
(`APP_REFERENCIA`) y los asocia a la lista de chequeo correspondiente (`APP_CATALOGO`):

- La lista se busca por coincidencia exacta del nombre del riesgo; si el tipo tiene prefijo
  (Edificación "E-", Infraestructura "I-") se priorizan las listas con ese prefijo.
- Si hay varias listas relacionadas, el usuario elige en Zona 2 (cambiar de lista reinicia las respuestas).
- Se evitan duplicados de hoja dentro del mismo proceso.
- Los 12 procesos con dataset generan **189 riesgos**, todos con hoja y código válidos (validado
  por la suite de pruebas).

Un riesgo sin lista de chequeo validada **no puede calcular ND** (queda Pendiente) — se puede
agregar manualmente y configurarle una lista desde el catálogo.

## 8. Estados de una evaluación (§17)

`Pendiente (PEN)` → `Lista incompleta (LI)` → `ND calculado (ND)` → `NP calculado (NP)` →
`NR calculado (NR)` → `Evaluación completa (COMP)` → `Evaluación aprobada (APROB)`.

- `Pendiente`: sin respuestas o sin lista asignada.
- `Lista incompleta`: preguntas sin responder o "No verificadas".
- `ND calculado`: lista completa, sin NE.
- `NP calculado`: NE elegido, sin NC.
- `NR calculado`: NC elegido, faltan justificaciones de NE/NC.
- `Evaluación completa`: NE y NC elegidos y justificados.
- `Evaluación aprobada`: completa y aprobada por el evaluador.

La aprobación se bloquea si: hay riesgos confirmados sin lista, preguntas sin responder,
respuestas "No verificadas", NE/NC no seleccionados o no justificados.

## 9. Evaluación residual (controles)

Factores de reducción por categoría de control (jerarquía de controles de la tesis):

| Categoría | Factor |
|---|---|
| Eliminación | 0.10 |
| Sustitución | 0.30 |
| Controles de ingeniería | 0.55 |
| Controles administrativos | 0.80 |
| EPP | 0.95 |

Reducción mínima aplicada: 0.05. ND residual = ND inicial × producto de factores.
La categoría central de la investigación (controles de ingeniería) es la tratada con
prioridad en la interfaz y en el ART.

## 10. Persistencia (localStorage)

- `ntp330.evaluaciones` — evaluaciones completas (identificación, riesgos, respuestas,
  NE/NC, justificaciones, controles, residual, trazabilidad, aprobación).
- `ntp330.catalogo.override` — ediciones de listas de chequeo (texto y NDR; ΣNDP debe ser 10.00).
- `ntp330.proyectos.override` — tipos, procesos, subprocesos, actividades y tareas.
- `ntp330.config` — configuración general (perfil NI).

Las evaluaciones antiguas se migran (`migrarEvaluacion`): el campo `actividad` de la versión
anterior se interpreta como `tipoProyecto`.

## 11. Validación (suite de pruebas)

`js/app.pruebas.js` (52 pruebas, ejecutables en la pestaña Pruebas o sin navegador):

- Catálogo: 44 listas, ΣNDP = 10.00, NDP = NDR×10/ΣNDR, numeración secuencial.
- Referencia: 189 riesgos, NP = ND×NE, NR = NP×NC, bandas de ND.
- Motor: semántica "No"/N/A/"No verificado", cap ND a [0,10], bandas, límites de NI.
- Estados (§17), escenarios contra Excel (§22) y escenarios dinámicos (§23).
- Generación: 189 riesgos con hoja y código válidos, sin duplicados.

Headless (sin Node ni navegador): `cscript //E:JScript jsrun.js <archivos...>` desde el
directorio `bin` del extractor (`jsrun.js` incluye stubs de DOM/localStorage y polyfills ES5).

## 12. Fuentes y versiones

| Elemento | Fuente |
|---|---|
| Metodología NTP 330 | `330.pdf` |
| Listas de chequeo, fórmulas, rangos | `nd.xlsx` |
| NE / NC | NTP 330 · carpeta `ER` |
| Procesos constructivos | `procesos.doc` |
| Riesgos por proceso (189) | Dataset de referencia de la tesis (`APP_REFERENCIA`) |
| Metadatos de riesgo (tipo/fuente/consecuencias) | `nd.xlsx` · script original de la tesis |
| Versión metodológica implementada | NTP 330 · 1.1.0 |

## 13. Reorganización de la interfaz (correcciones2.md)

La interfaz se reorganizó conforme a correcciones2.md (sustituye el asistente de 8 pasos y el
modal de lista de chequeo):

1. **Tipo de proyecto** (§2): desplegable obligatorio con únicamente `Estructura` e `Infraestructura`.
2. **Proceso constructivo** (§3): desplegable cargado según el tipo (procesos.doc, 7 y 5 procesos).
3. **Pestañas por riesgo** (§4/§19): cada riesgo genera su propia pestaña; una pestaña = un riesgo.
4. **Lista de chequeo inline** (§7/§8): se muestra dentro de la pestaña, no en ventana aparte.
   Respuestas únicamente **Sí / No** (la exclusión de preguntas es función administrativa).
5. **ND** (§9): se calcula automáticamente desde las respuestas (ΣNDP de los "No", cap 10).
6. **NE** (§10): lista desplegable (NTP 330) con justificación obligatoria.
7. **NP = ND × NE** (§11): solo lectura, con rango, categoría e interpretación.
8. **NC** (§12): lista desplegable (NTP 330) con justificación obligatoria.
9. **NR = NP × NC** (§13): solo lectura; **no** se vuelve a multiplicar por NE.
10. **NI** (§14): nivel de intervención automático con interpretación, prioridad y aceptabilidad.
11. **Registro automático en la página principal** (§17): la tabla general se actualiza en tiempo
    real con las columnas Tipo de proyecto · Proceso · Riesgo · ND · NE · NP · NC · NR · NI · Estado,
    con orden por NR, filtros (proceso/NI/texto/solo incompletos), exportación y trazabilidad (§21).
12. La trazabilidad conserva tipo, proceso, riesgo, lista, preguntas, respuestas, puntajes,
    ND/NE/NP/NC/NR/NI, usuario, fecha, versiones de lista y metodología, fórmula y archivos de origen.

La secuencia matemática obligatoria se mantiene: `NP = ND × NE`, `NR = NP × NC`
(motor sin cambios; validado por la suite de 52 pruebas).

## 14. Reorganización de la interfaz (correcciones3.md)

Reordenamiento de la pestaña Evaluación conforme a correcciones3.md, sin eliminar la
programación de cálculo NTP 330:

### Estructura de la pestaña Evaluación

```text
1. Identificación del proyecto
2. Matriz de evaluación de riesgos NTP 330
3. Evaluación por riesgo del proceso
   3.1 Determinación de los niveles de deficiencia ND
   3.2 Determinación del nivel de exposición NE
   3.3 Cálculo del nivel de probabilidad NP
   3.4 Determinación del nivel de consecuencia NC
   3.5 Cálculo del nivel de riesgo NR
   3.6 Determinación del nivel de intervención
```

### Cambios principales

1. **Reordenación**: la matriz (antes numeral 3) ahora es el numeral 2, ubicada antes de
   la evaluación por riesgo (antes numeral 2, ahora numeral 3).
2. **Identificación ampliada** (§1.1): se agregaron código del proyecto, ubicación,
   empresa/contratista, cargo del evaluador, frente de trabajo, etapa de obra, número de
   trabajadores expuestos y observaciones generales.
3. **Checklist con tres opciones** (§3.1.4): se restauró "No aplica" junto a "Sí" y "No".
   El motor ya manejaba "No aplica" (no aporta ND, excluye de preguntas aplicables).
4. **Sub-secciones numeradas** (§3.1–3.6): cada subpestaña de riesgo muestra títulos
   numerados correspondientes a los apartados del documento de correcciones.
5. **PDF por lista de chequeo** (§3.1.7): cada subpestaña incluye un botón "Descargar
   lista de chequeo en PDF" con identificación completa, preguntas, respuestas y resultado ND.
6. **Matriz consolidada** (§2.4): columnas N.° · Tipo de proyecto · Proceso constructivo ·
   Peligro · Riesgo · Lista de chequeo · ND · NE · NP · NC · NR · NI · Estado · Acciones.
7. **Navegación inversa** (§4): cada fila de la matriz permite abrir directamente la
   subpestaña del riesgo correspondiente.
8. **NR = ND × NE × NC** (§3.5): el panel de NR ahora muestra ambas formas de la fórmula:
   `NR = NP × NC` y `NR = ND × NE × NC`.
9. **Actualización en tiempo real** (§2.5): la matriz se actualiza cuando cambia cualquier
   dato de la evaluación por riesgo (checklist, ND, NE, NP, NC, NR, NI).

## 15. Identificación del proyecto, evaluaciones múltiples y matriz unificada (correcciones4.md)

### 15.1 Numeral 1 reducido a tres campos

La identificación quedó limitada a **Tipo de proyecto · Nombre del proyecto · Proceso
constructivo**, más el botón «+ Crear nuevo proyecto» (modal con nombre y tipo). Los campos
ampliados de `correcciones3.md` §1.1 (código, ubicación, empresa, cargo, frente, etapa,
n.º de trabajadores) se retiraron del flujo principal; permanecen disponibles en la
evaluación para los PDF mediante valores por defecto.

El proyecto se materializa como un registro en `ntp330.proyectos` con identificador
`PROY-XXXX`, nombre único (se rechaza el duplicado) y fecha de creación. La fecha de creación
sirve además para ordenar los proyectos del desplegable.

### 15.2 Evaluación = proyecto + proceso

Una evaluación se identifica como la combinación **proyecto + proceso constructivo** y recibe
un identificador `EVAL-XXXX` (`DBApp.nuevaEvaluacion`, `DBApp.generarIdEvaluacion`).
El proyecto puede tener tantas evaluaciones como procesos tenga, y un mismo proceso puede
repetirse en nuevas evaluaciones. La tabla «Evaluaciones del proyecto» muestra ID, proyecto,
tipo, proceso, riesgos incluidos, estado, fecha y acción de abrir o eliminar.

`DBApp.migrarEvaluacion` conserva la compatibilidad con el modelo anterior, donde el campo
`actividad` de la versión previa jugaba el papel de tipo de proyecto.

### 15.3 Matriz unificada

La pestaña «Matriz unificada y análisis» consolida **todas** las evaluaciones del proyecto
seleccionado en una sola tabla (ID evaluación, tipo, proyecto, proceso, riesgo, ND, NE, NP,
NC, NR, nivel de intervención, estado y acción), con análisis estadístico por proceso y cinco
gráficos: riesgos por proceso, NR promedio, distribución de NI, riesgos críticos y matriz de
calor. Se exporta a PDF, Excel y CSV.

## 16. Proyecto nuevo, ND automático y PDF de campo (correcciones5.md)

1. **Alta de proyecto** desde el numeral 1 y desde la propia pestaña de matriz unificada
   (`#btnCrearProyecto` y `#btnCrearProyecto2`), con el mismo modal y la misma validación de
   nombre único.
2. **ND automático**: no se escribe el ND. Se obtiene de las respuestas de la lista de
   chequeo mediante `MotorNTP330.calcularND` (§1 de este registro), que solo suma el peso
   NDP/NDD de las preguntas respondidas «No».
3. **Dos PDF de lista de chequeo**, diferenciados y con botones propios en cada pestaña de
   riesgo:
   - **Para campo** (`ReportesApp.descargarListaCampo`): A4 horizontal, sin respuestas, sin
     ND, sin porcentajes. Conserva la identificación (proyecto, código de evaluación, tipo,
     proceso, actividad, riesgo, código y versión de la lista), incluye los datos de
     inspección en blanco (ubicación, fecha, hora, evaluador, cargo, n.º de trabajadores
     expuestos) y espacio para firmas. Las celdas **Sí / No / N/A** se dibujan vacías, con
     bordes visibles, y se repiten los encabezados en cada página.
   - **Completada** (`ReportesApp.descargarListaCompletada`): mismas columnas con las
     respuestas registradas, su puntaje, el ND y el porcentaje de cumplimiento.
4. Si jsPDF/autotable no están disponibles (sin internet a CDN), ambos documentos caen a una
   **vista imprimible HTML** con el mismo contenido, para que la impresión en campo nunca se
   bloquee.
5. La lista de campo se construye sobre una copia temporal: la evaluación almacenada no se
   modifica al generar el PDF.

## 17. Nivel de intervención, PDF de campo y ART horizontal (correcciones6.md)

1. **NI derivado del NR, nunca manual.** El numeral 3.6 no ofrece control de entrada: toma el
   NR calculado en 3.5 y lo clasifica con `NTP330.nivelIntervencion(nr)`, que usa la tabla de
   rangos centralizada (§4 de este registro). Cualquier cambio en una respuesta, en NE o en
   NC dispara la cadena de recálculo ND → NP → NR → NI y la actualización de la matriz parcial
   y de la matriz unificada, de modo que no pueden quedar desincronizados.
2. **Configuración centralizada**: los rangos de NI (mínimo, máximo, nivel, significado,
   prioridad y acción recomendada) existen en un único lugar, `NTP330` en
   `js/app.metodologia.js`; ni la interfaz ni los reportes los duplican.
3. **PDF de campo**: se mantuvo la separación entre el PDF en blanco y el completado, con las
   celdas Sí / No / N/A vacías y bordes visibles (`descargarListaCampo`).
4. **ART en horizontal**: A4 horizontal por defecto y A3 horizontal como alternativa, con
   vista previa antes de descargar. El encabezado lleva título, proyecto, tipo, proceso,
   fecha, evaluador, código de evaluación, versión y formato; el pie numera las páginas y el
   nombre del proyecto se repite. Las columnas N.°, ND, NE, NP, NC, NR y NI llevan ancho
   reducido; actividad, peligro, riesgo, medidas, responsable y observaciones llevan el ancho
   restante, con salto de línea dentro de la celda y encabezados repetidos en cada página.
   Los anchos por columna están definidos una sola vez (`ART_HEAD`, `ART_WIDTHS` en
   `js/app.reportes.js`).
5. **Fórmulas sin cambios**: `NP = ND × NE` y `NR = NP × NC` permanecen intactas; el panel de
    NR muestra ambas formas (`NR = NP × NC` y `NR = ND × NE × NC`) como ayuda de lectura.

## 18. Identificación y evaluación de riesgos en el bloque 3 (2026-09-30)

Por solicitud del usuario se retiró el bloque 2 independiente de la pestaña Evaluación,
que duplicaba la selección de riesgos ya disponible en la matriz del bloque 3.

- El flujo principal pasa de **Identificación del proyecto / Proceso constructivo**
  (numeral 1) a **Evaluación por riesgo del proceso** (numeral 3), y luego a **ART**
  (numeral 4). La numeración de las subsecciones 3.1–3.6 conserva sus referencias.
- La matriz del numeral 3 es el punto de selección: cada fila permite abrir el riesgo,
  incluirlo o excluirlo con justificación, y reincluirlo. La fila activa se resalta.
- La identificación detallada, el checklist y los niveles se muestran en ese mismo
  bloque. Los filtros, la selección masiva y la adición de riesgos manuales operan allí.
- **Guardar y volver a la matriz** guarda y desplaza la página a la tabla del numeral 3.
  **Volver al numeral 1 (sin guardar)** desplaza la página hasta la identificación del
  proyecto y permite regresar a la evaluación sin ocultar sus controles.

## 19. Matriz editable del bloque 2: agregar riesgos uno a uno (2026-10-01)

El bloque 2 volvió a la pestaña Evaluación y ahora es el punto de trabajo principal,
sustituyendo la selección desde la matriz del bloque 3.

### 19.1 Qué cambió

- El bloque 2 se titula **Aplicación de Cuestionarios de chequeo / Evaluación de Riesgos**.
- Al elegir el proceso constructivo se crea **una fila en blanco**; el botón
  «+ Agregar riesgo» añade las que hagan falta. **Ya no se generan los 14 riesgos del
  proceso de una vez**: el evaluador decide cuáles entran.
- Cada fila tiene un desplegable con los riesgos disponibles del proceso. Al elegir uno se
  abre automáticamente su cuestionario de chequeo.
- Un riesgo ya usado en otra fila no aparece en el desplegable (evita duplicados).
- Si la fila ya tenía un riesgo con respuestas, se pide confirmación y se reinician
  respuestas, NE, NC, aprobación e inclusión.
- Las filas en blanco **no se persisten**: solo se guardan cuando tienen riesgo asignado.

### 19.2 Preguntas, NE y NC en modales

- El cuestionario de chequeo se responde en un modal (`#modal-checklist-overlay`) con
  referencias legales de `APP_LEGAL`, marcado masivo de Sí / No / No aplica, botón de
  limpiar, resaltado de preguntas pendientes y vista previa del ND en vivo.
- NE y NC se eligen en modales propios (`#modal-ne-overlay`, `#modal-nc-overlay`), ambos con
  **justificación obligatoria**. La justificación de NE además bloquea la aprobación del
  riesgo (requisito de `correcciones5.md`).
- El panel de detalle se vuelve a renderizar al guardar NE o NC, de modo que sus botones
  y el resumen de resultado nunca quedan obsoletos.

### 19.3 Cálculos que muestra la matriz

Las 14 columnas son: Riesgo · Tipo · Lista · Descripción · Código · Proceso ·
Consecuencias · **ND** · **NE** · **NP** · **NC** · **NR** · **NI** · Acciones.

- ND lo calcula el motor a partir del cuestionario; NE y NC los elige el evaluador.
- **NP = ND × NE** y **NR = NP × NC**, igual que en el resto de la aplicación.
- NP, NR y NI muestran `—` mientras falte ND, NE o NC. No se muestran ceros engañosos.
- Las fórmulas y umbrales de `NTP330` no se modificaron.

### 19.4 Lo que se conservó

- Exclusión con motivo obligatorio, insignia «Excluido» y re-inclusión que conserva
  ND, NE y NC.
- Riesgos fuera del catálogo del proceso mediante
  «+ Riesgo fuera del catálogo del proceso» (nombre y justificación obligatorios).
- Trazabilidad, observaciones, controles, ART, matriz unificada y copia de seguridad.
- Persistencia: al reabrir una evaluación se restauran **solo los riesgos agregados**, en
  el mismo orden, con sus respuestas, NE, NC, exclusión y ND calculado.

### 19.5 Verificación

Recorrido automatizado en Chrome headless (perfil temporal aislado): proyecto → proceso →
agregar riesgos → cuestionario → NE → NC → exclusión/re-inclusión → riesgo manual → recarga,
con 0 errores de consola, sin desbordes horizontales a 1368 px ni a 585 px, y la suite
interna en **52/52**. Las descargas de PDF y ART siguen requiriendo acceso al CDN de jsPDF;
sin conexión la aplicación cae a la vista imprimible en HTML.

## 20. Matriz unificada clasificada por proceso, PDF e impresión (2026-10-01)

### 20.1 Cierre del numeral 2

- El bloque 2 termina con **«✓ Guardar y ver en Matriz unificada»**
  (`#btnVerMatrizUnificada` → `AppUI.verMatrizUnificada()`): guarda la evaluación en curso,
  selecciona el proyecto en `#selProyectoUnificado`, abre la pestaña
  *Matriz unificada y análisis* y deja la matriz a la vista.
- Si el proyecto no está identificado, avisa en lugar de abrir una matriz vacía.

### 20.2 Clasificación por proceso constructivo

La matriz consolidada ya no es una tabla plana. `agruparPorProceso()` la ordena por proceso y
coloca delante de cada grupo una **fila de encabezado** (`.fila-grupo`) con:

| Columna | Contenido del grupo |
|---|---|
| ID · Tipo · Proyecto · Proceso · Riesgo (5 columnas) | nombre del proceso y número de riesgos |
| ND | ND promedio del proceso |
| NE, NC | `—` |
| NP | NP promedio del proceso |
| NR | NR promedio del proceso, en negrita |
| Nivel de intervención | recuento I · II · III · IV |
| Estado | riesgos completos sobre el total del grupo |
| Acción | número de evaluaciones del proceso |

Los riesgos excluidos no aparecen, igual que en la exportación.

### 20.3 Solo cuentan los riesgos completos

El análisis estadístico y la fila de grupo cuentan **únicamente los riesgos con NE y NC
elegidos**. Antes se contaban todos, y como el motor usa NE = NC = 1 por defecto cuando faltan,
un riesgo a medio evaluar caía en el nivel IV y falseaba el promedio y los gráficos. Ahora la
columna «Riesgos evaluados» muestra `completos / total` cuando difieren, que es el mismo
criterio con el que la tabla oculta la sigla de NI.

### 20.4 Guardar en PDF e imprimir

- **Guardar matriz en PDF**: A4 **horizontal**, agrupado por proceso. Cada proceso abre con
  una banda de encabezado (autoescala `colSpan`) que indica riesgos, NR promedio y cuántos
  tienen NE y NC. Encabezado verde institucional, pie con proyecto y «Página X de Y».
  Si no hay jsPDF (sin conexión al CDN), **cae a la vista imprimible** en lugar de abortar
  con un aviso, como ya hacían la lista de campo y el ART.
- **Imprimir matriz** (`#btnImprimirUnificado`): abre una vista imprimible en A4 horizontal
  con `@page{size:A4 landscape}`, filas sin partir entre páginas y el resumen de niveles de
  intervención. Sirve también para «Guardar como PDF» desde el diálogo del navegador.
- Excel y CSV conservan la clasificación: Excel con una fila de grupo fusionada y sombreada;
  CSV con una línea separadora por proceso.

### 20.5 Reinicio por tipo de proyecto

`onTipoProyecto()` llama a `reiniciarMatrizUnificada()`, que vacía `#selProyectoUnificado` y
muestra el estado vacío. `poblarProyectosUnificados()` **conserva la selección** al repoblar:
sin eso, cambiar de pestaña borraba el proyecto activo y la matriz aparecía vacía.

### 20.6 Los 5 cuadros con imagen

Los cinco gráficos pasan de `<div>` sueltos a `<figure class="cuadro-grafico">` con
`<figcaption>`, en retícula `repeat(auto-fit, minmax(300px, 1fr))` y **sombra alternada**
verde `#006e49` y rojo `#c0242a` de `Ejemplo.pptx`: verde, rojo, verde, rojo, verde. La
alternancia es decorativa y no codifica datos; los niveles de intervención conservan su
color propio dentro de los gráficos.

Los dos gráficos que quedaban vacíos se implementaron:

- **Riesgos críticos por proceso (NI I y II)**: barras por proceso con el total en rojo.
- **Matriz de calor ND × NP**: retícula 4 × 4 con las bandas de ND (MD, D, M, B) en filas y
  las de NP (MA, A, M, B) en columnas; la intensidad usa el verde institucional con alfa
  proporcional a la frecuencia.

### 20.7 Verificación

Chrome headless, perfil temporal: 52/52 pruebas internas, 0 errores de consola, un grupo por
proceso, 2 riesgos listados, 5 cuadros con `box-shadow` alterna (3 verde / 2 rojo), los 5
lienzos pintados, PDF sin jsPDF cayendo en la vista imprimible agrupada y en A4 horizontal, y
la matriz reiniciada al cambiar el tipo de proyecto.

## 21. Vínculo entre el numeral 2 y la matriz unificada (2026-10-01)

La matriz que el evaluador arma en el numeral 2 debe verse **replicada** en la segunda pestaña
con su análisis estadístico, sin tener que consolidar nada a mano.

### 21.1 Estado de vínculo

`estado.matrizVinculada` (por defecto `true`) decide si la matriz consolidada sigue al
proyecto del numeral 2:

- **Vinculada**: la matriz muestra la evaluación en curso, clasificada por proceso
  constructivo. Cada riesgo que se agregue, excluya o evalúe en el numeral 2 se replica en la
  pestaña *Matriz unificada y análisis* al entrar en ella, con ND/NE/NP/NC/NR/NI, sus
  promedios y los cinco cuadros repintados.
- **Inicializada**: la matriz queda en blanco y deja de consolidar. Sirve para limpiar la
  vista sin perder trabajo: el evaluador puede seguir respondiendo en el numeral 2 y volver
  a consolidar cuando quiera con **Vincular**.

`refreshMatrizUnificada()` adopta automáticamente el proyecto del numeral 2 cuando la matriz
está vinculada y el selector está vacío, de modo que la pestaña nunca aparece vacía mientras
se está evaluando.

### 21.2 Botones

| Botón | Función | Efecto |
|---|---|---|
| `btnVerMatrizUnificada` | «✓ Guardar y ver en Matriz unificada» | Guarda, **víncula** y abre la pestaña |
| `btnVincularMatriz` | «↔ Vincular al proyecto del numeral 2» | Reactiva el vínculo y adopta el proyecto actual |
| `btnInicializarMatriz` | «⟲ Inicializar matriz» | Deja la matriz en blanco y corta el vínculo |

`inicializarMatriz()` pide confirmación y **no borra ninguna evaluación**: solo descarta la
vista acumulada (filas, estadísticas y lienzos se vacían). Es la operación segura; eliminar
evaluaciones sigue siendo responsabilidad de la tabla de evaluaciones del numeral 1.

El aviso `#estadoVinculoMatriz` deja constancia del estado: verde (`vinculo-on`) con el
nombre del proyecto cuando está vinculada, rojo (`vinculo-off`) cuando está inicializada.

### 21.3 Matriz en blanco de verdad

Cuando no hay proyecto seleccionado, `renderMatrizUnificada()` vacía el `tbody` de
`#tabla-unificada`, `#stats-tabla-procesos` y los cinco lienzos, además de ocultar el
contenido. Así no quedan datos de la vista anterior en el DOM ni en la impresión.

## 22. La matriz unificada conectada al numeral 2 (2026-10-01)

La matriz consolidada no es una vista paralela: **es la misma evaluación del numeral 2**, con
las mismas reglas de cálculo. Se corrigieron cuatro defectos que la hacían mostrar datos
distintos o destruir trabajo.

### 22.1 Misma lista de chequeo y mismo motor

`AppUI.resultadoDeGuardado(g)` es ahora el **único** punto de cálculo de un riesgo ya
guardado, y tanto la tabla de la pestaña 2 como la matriz unificada y los reportes lo usan.

Antes, `renderMatrizUnificada()` y `obtenerFilasUnificadas()` buscaban la lista en
`CATALOGO` directamente, saltándose `clonarCatalogo()` y por tanto **ignorando las
ediciones de la pestaña Catálogo**. El resultado: en cuanto se editaba el texto o los NDR de
una lista, el ND del numeral 2 cambiaba y el de la matriz unificada se quedaba en el valor
antiguo. Los dos números coexistían en pantalla.

> `app.data.catalogo.js` trae `ndp` precalculado en cada pregunta y
> `MotorNTP330` lo prefiere al NDR (`p.ndp != null ? p.ndp : NDR×10/ΣNDR`). Por eso la
> pestaña Catálogo recalcula `ndp` al guardar (`AdminApp.recalcularNDP`): sin ese recálculo,
> editar un NDR no cambiaría el ND.

### 22.2 La columna «Proyecto» mostraba el proceso

Las filas se armaban con `proyecto: ev.proceso`, de modo que la columna **Proyecto** repetía
el proceso constructivo y el nombre del proyecto no aparecía en ninguna celda. Ahora es
`proyecto: ev.proyecto`.

### 22.3 NP, NR y NI no se inventan

Sin NE y NC el motor usa 1 como valor por defecto, de modo que un riesgo a medio evaluar
mostraba `NP = ND` y `NR = ND` en la matriz unificada: números que no significan nada pero
parecían reales. `resultadoDeGuardado()` devuelve además `completo`, y:

- la tabla muestra `—` en NP y NR y deja NI vacío mientras falten NE o NC, igual que el
  bloque 2;
- los promedios de NP y NR de la fila de grupo se calculan **solo sobre riesgos completos**;
  si un grupo no tiene ninguno, muestran `—` en vez de un promedio sobre ceros;
- el PDF, la vista imprimible, el Excel y el CSV usan `fmtAusente()` para lo mismo, porque
  `NTP330.fmt(null)` devolvía `0`.

### 22.4 La matriz es progresiva y acumulada entre procesos

`onProceso()` **borraba la evaluación del proceso elegido** con `DBApp.eliminarEvaluacion()`
y partía de cero, con el comentario «correcciones6 §4.2». Revisada la fuente,
`correcciones6.md` §3.4 solo pide no modificar la evaluación almacenada al generar el PDF de
campo; no pide borrar nada al seleccionar un proceso. El efecto era la pérdida de todo el
trabajo del proceso y la desaparición de su grupo en la matriz consolidada.

Ahora, si el proceso ya tiene evaluación, **se restaura**; si no, se crea una nueva. Así el
evaluador puede recorrer varios procesos y la matriz los va acumulando, clasificados y con
sus subtotales.

### 22.5 Verificación

`test-bloque2.js`, fase `verificarConexionMatriz()`:

| Comprobación | Resultado |
|---|---|
| Columna Proyecto | `Test Bloque 2` (antes mostraba `Obras preliminares`) |
| Riesgos incompletos con `—` en NP/NR y NI vacío | 2 |
| Acumulación: segundo proceso | 2 grupos, 4 riesgos |
| Re-seleccionar el proceso | 2 evaluaciones antes y después, riesgos intactos |
| Volver al proceso | se restauran exactamente sus 1 riesgo guardado |
| Edición de la lista (NDR a 0 + recálculo de `ndp`) | 8.08 → **8 en las dos matrices** |

## 23. Cada proyecto empieza de cero (2026-10-01)

Un proyecto nuevo no puede heresar nada de otros proyectos, ni siquiera de otro tipo.

### 23.1 La fuga de datos

`onCampoIdentificacion()` era:

```js
leerZona1();
if (estado.ev) sincronizarEV();   // re-etiquetaba la evaluación en curso
poblarTablaEvaluaciones();
```

`sincronizarEV()` asigna `estado.ev.proyecto = estado.proyecto`, o sea el **nombre nuevo**, y
conserva `estado.riesgos`. El resultado era que al escribir otro nombre, los riesgos del
proyecto anterior quedaban etiquetados con el proyecto nuevo y se guardaban con él. Bastaba
cambiar el texto del campo para herdar todo.

### 23.2 Identidad del proyecto

`identidadProyecto(nombre, tipo)` devuelve `nombre||tipo`. El tipo forma parte de la clave:
una evaluación de Estructura nunca se confunde con una de Infraestructura aunque coincida el
nombre. `buscarProyectoPorNombre()` localiza el proyecto sea del tipo que sea.

### 23.3 Reglas aplicadas

| Situación | Comportamiento |
|---|---|
| Nombre nuevo | Numeral 2 y matriz unificada quedan **en cero**; la matriz sigue vinculada pero vacía |
| Nombre de un proyecto anterior del mismo tipo | Retoma su información: se listan sus evaluaciones y, al elegir un proceso, se restaura lo evaluado |
| Nombre ya usado con **otro** tipo | Se avisa y **se revierte** el campo: no se mezclan estructuras con infraestructuras |
| Había trabajo en curso | Se pregunta si se guarda **en el proyecto al que pertenece**; nunca se arrastra |
| Cambiar Estructura ↔ Infraestructura | Es cambiar de proyecto: mismo aviso y mismo reinicio |

`inicializarParaProyecto(nombre, tipo)` centraliza el reinicio: proceso vacío, `ev` a null,
riesgos vacíos, zonas ocultas, tabla de evaluaciones del proyecto nuevo y matriz apuntada a
este proyecto. `guardarNuevoProyecto()` y `onTipoProyecto()` la usan, de modo que el modal de
nuevo proyecto y el selector de tipo no pueden divergir del campo de nombre.

`apuntarMatrizAProyecto(nombre, tipo)` sustituye la lógica duplicada que añadía la opción al
selector; una matriz nunca conserva el proyecto anterior.

### 23.4 Desplegable de proyectos anteriores (sustituido en §24)

`inpProyecto` lleva entonces un `<datalist id="listaProyectosSugeridos">` con los proyectos del **tipo
seleccionado**, etiquetados según su información:

- `Estructura · 2 evaluaciones · retoma información`
- `Estructura · sin evaluaciones · parte de cero`

El desplegable se rellena con los proyectos que tienen evaluaciones más los registrados en
Catálogo; un nombre que no aparece es un proyecto nuevo y arranca de cero. El texto bajo el
campo lo indica.

### 23.5 Corrección adicional

`DBApp.nuevaEvaluacion()` asignaba `proyecto: opts.proceso`, ignorando `opts.proyecto`. Como
`tipoProyecto`/`proyecto`/`proceso` llegan juntos desde `nuevaEvaluacionDesdeZona1()`, solo se
manifestaba si se guardaba una evaluación sin pasar por `sincronizarEV()`. Ahora respeta
`opts.proyecto`.

### 23.6 Verificación

`test-bloque2.js`, fase `verificarAislamientoProyectos()`:

| Comprobación | Resultado |
|---|---|
| Sugerencia del proyecto anterior | `Estructura · 2 evaluaciones · retoma información` |
| Nombre nuevo: filas en el numeral 2 | 0 |
| Nombre nuevo: evaluaciones heredadas | 0 |
| Nombre nuevo: proyecto de la matriz | `Obra Nueva Cero\|\|Estructura`, sin riesgos |
| Choque de tipo | avisa y revierte el campo |
| Sugerencias al elegir Infraestructura | ninguna (no ofrece proyectos de Estructura) |
| Retomar el proyecto anterior | 3 riesgos restaurados y 2 grupos en la matriz |
| Cambio con trabajo en curso | pide confirmarlo y lo guarda en el origen (4 riesgos) |
| Evaluaciones en los proyectos nuevos | 0 |

---

## §24. Campo «Nombre del proyecto» con lista desplegable propia y alineada

### 24.1 Problema

El campo de nombre de proyecto usaba un `<datalist>` nativo. El navegador solo dibuja su
flecha al pasar el cursor o al enfocar el campo, de modo que el control no anunciaba que
fuera desplegable en reposo. Además el numeral 1 se armaba con
`.panel-selectores { display: flex; flex-wrap: wrap; align-items: flex-end }`: al differing la
altura intrínseca del `<input>` (36 px) frente al `<select>` (34 px), `align-items: flex-end`
subía los controles y los tres campos no compartían línea.

### 24.2 Solución

Desplegable propio en `index.html`, dentro de `#comboProyecto`:

| Elemento | Papel |
|---|---|
| `#btnComboProyecto` | botón con `&#9662;`, siempre visible; alterna la lista |
| `#listaProyectosSugeridos` | `<ul role="listbox">` de `.combo-opcion`, cada una con `data-valor` |
| `.combo-titulo` / `.combo-detalle` | nombre del proyecto y su detalle (tipo, nº de evaluaciones) |

La lista se repuebla con `poblarSugerenciasProyecto()` y se controla con
`abrirComboProyecto()`, `cerrarComboProyecto()`, `alternarComboProyecto()` y
`elegirProyectoDeLista()`. Interactúa con la flecha, con el clic en una opción, con
`ArrowDown` para abrir, `Enter` para tomar la primera opción y `Escape` para cerrar; el clic
fuera del combo la cierra. Cuando el nombre escrito ya existe entre las sugerencias no se
añade la opción «nombre nuevo», para no ofrecer dos entradas con el mismo valor.

`elegirProyectoDeLista()` solo dispara `change` si el nombre realmente cambia: si no, se
reinicializaría el proyecto que ya está en curso.

Alineación: `.panel-selectores--tres` es una rejilla de tres columnas
(`repeat(3, minmax(0, 1fr))`) en lugar del flex-box. No se toca `.panel-selectores` a secas
porque el mismo bloque se usa en otros formularios. La altura se fija en 36 px para `select`
e `input` de esa fila, y `.nota-campo` pasa a ocupar las tres columnas en una fila inferior
para que la nota no desalinee los controles. Por debajo de 760 px la rejilla pasa a una
columna.

### 24.3 Verificación

`test-bloque2.js`, fases `verificarAislamientoProyectos()` y `filaIdentificacion` (1368 px) y
`filaIdentificacionMovil` (390 px):

| Comprobación | Resultado |
|---|---|
| Flecha visible en reposo | 28 × 34 px, dentro del campo |
| Alineación de los tres campos | `top` 30 px y `alto` 36 px los tres |
| Sin solaparse | tipo 125→481, proyecto 497→853, proceso 869→1225 |
| Flecha abre y cierra la lista | `listaAbre` y `listaCierra` verdaderos |
| Nota bajo los campos | `notaAbajo` verdadero |
| Elegir proyecto desde la lista | retoma el proyecto y cierra la lista |
| Móvil: una columna | `apilados` verdadero (488 / 561 / 635) |
| Móvil: lista dentro de la ventana | `listaDentro` verdadero |
| Desborde horizontal | ninguno a 1368 px ni a 390 px |
| Suite interna | 52/52, 0 errores de consola |

### 24.4 Nombre escrito que ya está en uso

La opción «nombre nuevo» solo se ofrece si el nombre no está en uso. Si el texto escrito
pertenece ya a un proyecto de otro tipo, ofrecerlo «como nuevo» sería una contradicción
—el cambio se rechazaría después con el aviso de choque—, así que la lista no lo propone y
la nota pasa a decir:

> «Test Bloque 2» ya está en uso. Para no mezclar Infraestructura con otro tipo de proyecto,
> escriba otro nombre.

Un nombre inexistente (`Proyecto Inédito X`) sí se ofrece como proyecto nuevo, que es el caso
legítimo de la opción.

## §25. Identidad visual institucional: verde y rojo de `Ejemplo.pptx`

### 25.1 De dónde salen los colores

El tema de Office del archivo (`ppt/theme/theme1.xml`) **no** es la fuente: sus acentos
propios son los de Office (`accent1` `#4472c4`, `accent4` `#00bf98`…) y el verde que
aparece ahí, `#00bf98`, no es el de la presentación. Los colores institucionales están
escritos a mano en las diapositivas, como `srgbClr val="…"` dentro de `solidFill`, y son:

| Color | Valor | Ocurrencias | Papel en la presentación |
|---|---|---|---|
| Verde institucional | `#006e49` | 7 | identidad, títulos, acentos |
| Rojo institucional | `#c0242a` | 24 | bloques de la portada, avisos |
| Carbón | `#4c4a4f` | 27 | texto de apoyo |
| Verde medio | `#497f64` | 2 | secundario |
| Gris | `#a8a8a8` | 3 | deshabilitado, exclusiones |

Se toman estos valores y no los del tema. Quedan expuestos como variables en `:root`
(`--verde`, `--verde-medio`, `--verde-oscuro`, `--rojo`, `--rojo-oscuro`, `--carbon`), de
modo que cambiar la paleta es tocar un solo sitio.

### 25.2 Reparto del color

La regla que se siguió es semántica, no decorativa: **verde = estructura y aceptable;
rojo = peligro, pendiente o crítico.** El naranja queda únicamente para el aviso «sin
cambios», que no describe un estado de riesgo.

| Elemento | Tratamiento |
|---|---|
| Cabecera | banda de dos bloques, verde y rojo, como la portada; título en `--verde-oscuro` |
| Pestaña activa | relleno verde, borde inferior rojo |
| `.zona` | filete lateral verde y numeral verde |
| `#zona-riesgos` | filete y numeral rojos: es donde se detecta el peligro |
| Cabeceras de tabla de datos | verde con texto blanco |
| Tablas auxiliares | sin tocar: checklist, ayuda y ficha de identificación siguen en gris claro |
| `.estado-PEN` | rojo: pendiente bloquea la aprobación, no es un aviso neutro |
| `.estado-APROB` | verde sólido |

Las tablas auxiliares se dejan en gris a propósito: son de lectura larga (checklist de 471
preguntas, tablas de la pestaña Metodología) y un fondo verde en cada encabezado las haría
competir con las tablas de resultados, que son las que se leen para decidir.

### 25.3 Niveles de intervención

Las siglas y el orden no se tocan: **NI I es el peor**. Lo que cambia es el color, que pasa
del tema Material (rojo/naranja/ámbar/verde) a la paleta institucional, repartida por
familias: la familia roja para lo intolerable y la verde para lo aceptable.

| Nivel | Color | Razón |
|---|---|---|
| I | `--ni-I` `#8c1a1f` | rojo **oscuro**: es el peor y el rojo más intenso queda reservado para él |
| II | `--ni-II` `#c0242a` | rojo institucional |
| III | `--ni-III` `#006e49` | verde institucional |
| IV | `--ni-IV` `#497f64` | verde medio, para que se distinga del III dentro de una celda blanca |

La primera versión usó `#c0242a` para I y `#8c1a1f` para II, pero eso invertiría la lectura
—el nivel II se vería más grave que el I—, que es justo lo que el orden NTP 330 no permite.

Con esta rampa desaparece el ámbar, que junto al rojo y al verde quedaba ambiguo entre
«moderado» y «aceptable».

Los gráficos de canvas **tenían los colores escritos en el JS** (`#c62828`, `#ef6c00`,
`#f9a825`, `#2e7d32`), así que cambiar la hoja de estilos no los habría movido. Ahora
`tokensTema()` lee los cuatro `--ni-*` del CSS, como ya hacía con el resto de tokens: la
paleta tiene una sola fuente de verdad.

### 25.4 Contraste

Se comprobaron los 16 pares texto/fondo nuevos con la fórmula de WCAG 2.1. Todos cumplen AA:

| Par | Contraste | Mínimo |
|---|---|---|
| Título de cabecera `#004b33` sobre blanco | 10.22:1 | 4.5 |
| Pestaña activa y `th` `#ffffff` sobre `#006e49` | 6.31:1 | 4.5 |
| Numeral de zona rojo `#ffffff` sobre `#c0242a` | 5.95:1 | 3 |
| `ni-I` `#ffffff` sobre `#8c1a1f` | 9.20:1 | 4.5 |
| `ni-II` `#ffffff` sobre `#c0242a` | 5.95:1 | 4.5 |
| `ni-III` `#ffffff` sobre `#006e49` | 6.31:1 | 4.5 |
| `ni-IV` `#ffffff` sobre `#497f64` | **4.66:1** | 4.5 |
| Pendiente `#8c1a1f` sobre `#fbe9ea` | 7.86:1 | 4.5 |

`ni-IV` es el más ajustado (4.66:1). Es texto de 13 px en negrita dentro de una celda, que
WCAG trata como texto grande, así que tiene margen; aun así no se oscurece más porque
`#497f64` es un color de la presentación y no conviene inventar un cuarto tono.

### 25.5 Verificación

`node 0/pruebas/verificar.js` y `node 0/pruebas/prueba-bloque2.js` el 2026-10-02:

| Comprobación | Resultado |
|---|---|
| Sintaxis de los 14 JS | OK |
| Suite interna | 52/52 |
| Errores de consola | 0 |
| Estilos calculados en Chrome | cabecera, pestaña activa, zonas y `thead th` con los valores nuevos |
| Cuadros de gráficos | 5, sombra alternada 3 verde / 2 rojo |
| Gráficos pintados | 5 (los cinco con conteo de píxeles > 0) |
| Desborde horizontal | ninguno a 1368 px ni a 390 px |

Los estilos se comprobaron leyendo `getComputedStyle` en Chrome headless, no a ojo: el
modelo no puede ver la captura.

### 25.6 Lo que no se hizo

- No se tocó ninguna fórmula, umbral ni tabla de `app.metodologia.js` ni de `app.motor.js`.
- No se añadieron datos a la cabecera: solo el título que ya estaba en `<title>`, para no
  inventar el nombre de la institución.
- No se cambió el comportamiento de ninguna pestaña.

---

## 26. Integración en presentacion y PDF locales (2026-10-25)

La aplicación, sus fuentes y sus pruebas se incorporan al repositorio único
`presentacion`, bajo `presentacion-web/ntp330/`. El slide 7 utiliza
`ntp330/0/index.html`, una ruta interna válida en archivos locales y por HTTP.

Se incluyen las versiones **jsPDF 2.5.1** y **AutoTable 3.5.28** en `0/vendor/`,
con sus licencias. La generación de PDF funciona sin descargar dependencias.
La prueba con bibliotecas reales detectó que la matriz unificada enviaba un
array a `doc.setTextColor()`: se sustituyó por el color hexadecimal del mismo
tema, formato admitido por jsPDF. Las fórmulas y los umbrales metodológicos se
conservan.

El recorrido automatizado verifica **cinco PDF locales**: matriz unificada,
ART A4, ART A3, lista de campo y lista completada. Comprueba tablas contenidas
en página, orientaciones horizontales y celdas Sí/No/N/A vacías para campo.
También se mantiene la prueba de la alternativa imprimible, simulando la
ausencia de las bibliotecas.

Verificado con **52/52** pruebas del motor y recorrido completo sin errores.
Los cinco archivos de muestra se generan en `0/pruebas/out/pdf-local-1.pdf`
… `pdf-local-5.pdf`. La integración se comprueba además desde una copia
independiente de la presentación, en modos `file://` y HTTP.

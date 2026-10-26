# Estado del proyecto

Última actualización: **2026-10-25**

Documento vivo. **Toda modificación de comportamiento debe añadir una línea en §4.**

---

## 1. Qué es

Aplicación web estática (sin framework, sin build) que implementa la evaluación de riesgos
laborales por el método **NTP 330** (INSST, 1991), adaptada a la normativa ecuatoriana y
aplicada a proyectos de construcción. Entregable de tesis doctoral.

- Código: carpeta `0/` (HTML + CSS + JS clásico).
- Contexto para sesiones de trabajo: `../AGENTS.md`.
- Cómo ejecutarla: `../README.md`.
- Retomar el trabajo (este equipo u otro): `continuidad.md`.
- Herramientas de verificación: `../pruebas/*.js` (Node + Chrome headless, sin npm).
- Decisiones metodológicas: `adaptaciones.md`.

## 2. Estado de las rondas de correcciones

| Documento | Alcance | Estado |
|---|---|---|
| `instrucciones.md` | enunciado original del trabajo | implementado |
| `correcciones.md` | flujo obligatorio: tipo de proyecto, proceso, riesgos automáticos, ND, NE, NP, NC, NR, controles, ART | implementado |
| `correcciones1.md` | orden del flujo de evaluación | superado por `correcciones2.md` (reorganización posterior) |
| `correcciones2.md` | dos tipos de proyecto, procesos desplegables, pestañas por riesgo, lista de chequeo inline, `NR = NP × NC` | implementado |
| `correcciones3.md` | reordenación de la pestaña Evaluación (numerales 1–4, matriz en el 2), identificación ampliada, matriz consolidada, trazabilidad | implementado |
| `correcciones4.md` | identificación del proyecto con 3 campos, evaluaciones múltiples por proceso, `EVAL-XXXX`/`PROY-XXXX`, matriz unificada | implementado |
| `correcciones5.md` | creación de proyecto nuevo, matriz unificada por proyecto con análisis, ND automático, PDF de campo y PDF completada | implementado |
| `correcciones6.md` | NI derivado automáticamente del NR, PDF de campo con celdas Sí/No/N/A vacías, ART en horizontal (A4 y A3) con vista previa | implementado |

Notas de implementación relevantes:

- Tipos de proyecto: solo **Estructura** e **Infraestructura** (7 y 5 procesos). La clave
  `Edificación` del dataset se mapea a `Estructura`.
- La suite de 52 pruebas valida el motor contra `nd.xlsx` y contra las 189 filas de
  referencia de la tesis.
- Los rangos de NI viven centralizados en `NTP330` (perfil estándar de la norma, con el
  perfil de la tesis conservado como alternativa).

## 3. Verificación realizada (2026-09-26)

Chrome headless (`--headless=new` + CDP sobre WebSocket), perfil temporal aislado por
ejecución para no tocar los datos del usuario.

| Comprobación | Resultado |
|---|---|
| Carga de `index.html` | 6 pestañas, catálogos, CSS y CDN OK, **0 errores de consola** |
| Suite de pruebas (pestaña Pruebas) | **52/52** |
| Crear proyecto | `PROY-0001`; alerta correcta si el nombre ya existe |
| Selección de proceso | matriz de 13 riesgos generada, primera pestaña abierta |
| Lista de chequeo | 15 preguntas, "marcar todos" responde, ND/NE/NC/NR se recalculan |
| Guardado | bloquea con "lista incompleta" si faltan respuestas o NE/NC; guarda con `EVAL-XXXX` |
| Matriz unificada | 13 filas + tabla estadística; 3 de 5 gráficos con contenido |
| ART y exportaciones | A4, A3, vista previa, CSV, JSON y Excel sin excepciones |
| Catálogo | 44 listas, 156 filas de administración, búsqueda por texto operativa |
| Copia de seguridad | exporta 4 claves, borra y restaura correctamente, validaciones OK |

### 3.1. Tema visual y regresión (2026-09-30)

El primer ajuste visual usó la paleta de la presentación de `D:\ejemplo\tes`: fondo `#e8e8ea`,
texto `#262626`, verde `#006e49`, rojo `#c0242a` y Arial. Los tokens están en
`css/style.css`; títulos dinámicos y gráficos de canvas leen ese mismo tema.
Los colores NI I–IV conservan exactamente `#c62828`, `#ef6c00`, `#f9a825`, `#2e7d32`.

Verificado con Chrome headless y CDP, copia de la app y perfil desechable:

| Comprobación | Resultado |
|---|---|
| Sintaxis de los cuatro JS modificados | `node --check` OK |
| Pestaña Pruebas | **52/52**, sin fallos |
| Evaluación, Catálogo y Pruebas | **0 errores de JavaScript**, Arial en textos y controles, sin desborde horizontal |
| Crear proyecto → proceso → checklist → guardar | `PROY-0001`, Obras preliminares, 13 riesgos y 10 preguntas; guardado incompleto bloqueado; resultado guardado en `EVAL-0001`: ND 10, NE 2, NP 20, NC 25, NR 500, NI II |
| Trazabilidad y badge de guardado | títulos en tinta del tema; «Resultado registrado» con fondo verde válido |
| Matriz unificada | 13 filas y los tres gráficos implementados con contenido; barras verde/rojo, Arial y distribución NI con los colores originales |
| PDF ART A4 y A3 | horizontal, una página en la muestra, tablas dentro de los márgenes; revisión visual OK |
| PDF de campo y lista completada | 10 preguntas de `E-RM-CMN`; celdas Sí/No/N/A vacías en campo; Observaciones visible; resumen y fórmula de la completada sin cortes |
| App dentro de Fotografía 1 | viewport `1338×392`, abre en Evaluación y mantiene el tema actualizado |
| Regresión de la presentación | **54/54 + 305/305**, `verify-all.cmd shot` termina en `TODO OK` |

El driver está en `D:\ejemplo\tes\tools\app_cdp.js`; las capturas antes/después y los
cuatro PDF de muestra están en `tools/out/tema/` de ese repositorio. La carga offline
produce dos avisos de red esperados por jsPDF/autotable; para verificar los PDF, el
driver carga por separado las mismas versiones de CDN que declara `index.html`.

### 3.2. Plantilla Ejemplo.pptx y secuencia desplazable (2026-09-30)

Se contrastaron los colores de las diapositivas y el tema de `Ejemplo.pptx`, en la
raíz del repositorio. La interfaz utiliza texto gris carbón `#262626`, fondo claro
`#ececec`, tablas `#e7e6e6`, bordes `#cacaca`, botones y casillas verdes `#006e49`, y
numerales y flechas rojos `#c0242a`. Los PDF y las vistas imprimibles leen los mismos
tokens de color; las vistas HTML usan Arial.

Se retiró `position: sticky` de `#flujo-evaluacion`: la secuencia de identificación,
proceso, checklist, evaluación y ART sigue el desplazamiento normal de la página.

Verificado en Chrome headless, con perfil temporal aislado:

| Comprobación | Resultado |
|---|---|
| Sintaxis de `app.reportes.js` y revisión del diff | `node --check` y `git diff --check` OK |
| Suite y recorrido completo | **52/52**, **0 errores de JavaScript**; crear proyecto, seleccionar proceso, completar checklist, guardar y generar ART OK |
| Secuencia al bajar | Posición calculada `static`; al desplazar 378 px, el borde inferior pasa de 353,56 a −24,44 px y queda fuera de la vista |
| Escritorio y móvil | Colores verificados por estilos calculados; sin desborde horizontal en la pantalla inicial de 390 × 844 px |
| Reportes PDF | ART A4/A3 horizontal, lista de campo con respuestas vacías y lista completada; cabeceras grises, tablas dentro de los márgenes y revisión visual sin cortes |
| Matriz unificada PDF y vistas imprimibles | PDF de 13 filas dentro de los márgenes; cabeceras `#e7e6e6` y texto `#262626`; ART/campo/completada HTML con Arial |

### 3.3. Pantalla inicial sin encabezado (2026-09-30)

Se eliminó el encabezado negro con letras blancas. La página comienza con las
pestañas, a 16 px del borde superior, en escritorio y móvil. Verificado con Chrome
headless: **52/52**, **0 errores de JavaScript**, recorrido de evaluación y generación
de PDF OK; ART horizontal dentro de los márgenes y lista de campo con respuestas vacías.

### 3.4. Identificación y evaluación concentradas en el bloque 3 (2026-09-30)

Se retiró el bloque 2 independiente de la pestaña Evaluación. Tras elegir el proceso
en el numeral 1, la identificación, la matriz y la evaluación de los riesgos se
realizan en el numeral 3. Se abre cada riesgo desde su fila o el botón «Abrir» y se
resalta la fila activa. «Guardar y volver a la matriz» regresa a la tabla de este
mismo bloque; «Volver al numeral 1» desplaza la página y permite retomar la evaluación.

Verificado con Chrome headless y perfil aislado:

| Comprobación | Resultado |
|---|---|
| Sintaxis y suite | `node --check 0/js/app.ui.js` y `git diff --check` OK; **52/52**, **0 errores de JavaScript** |
| Flujo desde la matriz del bloque 3 | 13 riesgos automáticos, checklist completado, guardado y ART OK |
| Selección de riesgos | Abrir por botón/fila, excluir con motivo, cancelar la exclusión, reincluir desde la casilla y desde otra fila, seleccionar/desmarcar todos OK |
| Filtros y navegación | Búsqueda, filtro NI, incompletos y orden por NR OK; volver a la matriz y al numeral 1 permite continuar sin perder respuestas |
| Riesgo manual y restauración | Riesgo adicional agregado desde el bloque 3; evaluación de 14 riesgos restaurada desde la tabla del proyecto con ND/NE/NC y respuestas conservados |
| PDF y pantalla inicial móvil | ART A4/A3 horizontal y listas dentro de los márgenes; celdas de campo vacías; pantalla inicial de 390 × 844 px sin desborde horizontal |

## 4. Cambios recientes

| Fecha | Cambio |
|---|---|
| 2026-10-25 | **Integración en el proyecto único `presentacion`**: app, fuentes, documentación y pruebas en `presentacion-web/ntp330/`. El slide 7 abre `ntp330/0/index.html` dentro del mismo árbol web. Bibliotecas jsPDF 2.5.1 y AutoTable 3.5.28 incluidas con sus licencias para generar PDF sin red. El arranque, respaldo y recuperación se gestionan desde la raíz principal. Historial anterior conservado en `historial-origen.bundle`; `ORIGEN.json` registra la procedencia. Pruebas con perfiles aislados y copias en `tools/out/`; el recorrido comprueba también los cinco PDF locales y las celdas vacías de la lista de campo. |
| 2026-10-02 | **Identidad visual institucional (verde y rojo de `Ejemplo.pptx`)**: se reconstruye el sistema de color sobre los valores que aparecen **explícitamente** en las diapositivas — verde `#006e49`, rojo `#c0242a`, carbón `#4c4a4f` y verde medio `#497f64`—, y no sobre el tema de Office, cuyo verde (`#00bf98`) no es el de la presentación. (a) Cabecera institucional nueva, con la composición de la portada: banda vertical de dos bloques, verde y rojo, con el título en verde oscuro; sustituye a la banda negra que se había retirado en septiembre, pero ahora con los colores del trabajo. (b) La pestaña activa se rellena de verde y se remata con un borde inferior rojo, de modo que los dos colores se leen de un vistazo. (c) Las zonas llevan filete lateral verde y el numeral en verde, salvo `#zona-riesgos`, que los lleva rojos por ser donde se detecta el peligro. (d) Las cabeceras de las tablas de datos (matriz del bloque 2, matriz unificada, evaluaciones del proyecto) pasan a verde con texto blanco; las tablas auxiliares —checklist, ayuda, ficha de identificación— conservan el gris claro para no competir con ellas. (e) El estado «pendiente», que bloquea la aprobación, pasa de naranja a rojo. (f) Los niveles de intervención conservan sus siglas y su orden —I es el peor— pero se recolorean con la paleta institucional: `--ni-I` `#8c1a1f` (rojo oscuro), `--ni-II` `#c0242a`, `--ni-III` `#006e49`, `--ni-IV` `#497f64`; el naranja y el ámbar del tema anterior desaparecen de las celdas y de los gráficos. Los gráficos de canvas dejaron de llevar los colores a fuego en el JS: `tokensTema()` lee ahora los cuatro `--ni-*` de la hoja de estilos, igual que ya hacía con los demás, para que la paleta tenga una sola fuente de verdad. Los 16 pares texto/fondo nuevos se comprobaron contra WCAG AA y todos cumplen (el más ajustado, `ni-IV`, queda en 4.66:1). Verificado el 2026-10-02: 52/52, 0 errores de consola, los 5 cuadros con sombra alternada 3 verde / 2 rojo, los 5 gráficos pintados y sin desborde horizontal a 1368 px ni a móvil. Ver `adaptaciones.md` §25. |
| 2026-10-02 | **Proceso para retomar el trabajo y herramientas dentro del repo**: `0/pruebas/` deja de estar reservada y aloja las herramientas de verificación, que hasta ahora vivían fuera del repositorio (`D:ejemplo	es	ools`, con `jsdom` de por medio) y se perdían al cambiar de equipo. `verificar.js` ejecuta en el orden que fija `AGENTS.md` §7 los tres puntos —sintaxis de los 14 JS, carga en Chrome headless con 52/52 y 0 errores de consola, y recorrido del bloque 2 con aislamiento de proyectos y medidas de alineación— y sale con código 1 si algo falla; `verificar.js --rapido` omite el recorrido. `prueba-bloque2.js` y `verificar-cdp.js` quedaron con rutas relativas al repositorio y con la copia de trabajo en el temporal del sistema: dentro de `0/` Chrome se copiaba la carpeta de la app a una subcarpeta de sí misma y fallaba con «Cannot copy … to a subdirectory of self». `verificar-respaldo.js` valida un JSON de respaldo **antes** de confiar en él (formato, claves `ntp330.*`, evaluaciones y riesgos reales, cuadre del resumen) y `generar-respaldo-ejemplo.js` produce uno ficticio para probar el validador sin tocar los datos del usuario. Se reescribe `continuidad.md` con las rutinas de inicio y de cierre de sesión, qué se commitea y qué no, y una tabla de problemas frecuentes. `0/pruebas/out/` queda en `.gitignore`. Verificado el 2026-10-02: `node 0/pruebas/verificar.js` termina con «VERIFICACIÓN CORRECTA» y el validador acepta el respaldo de ejemplo y rechaza uno vacío. |
| 2026-10-01 | **El campo «Nombre del proyecto» pasa a desplegable propio y alineado**: el `<datalist>` nativo se sustituye por un combo (`#comboProyecto` + `#btnComboProyecto` + `#listaProyectosSugeridos`, un `<ul role="listbox">`) porque la flecha del `<datalist>` solo aparece al enfocar el campo y no anunciaba que fuera desplegable en reposo; ahora el botón `▼` está siempre visible. Interactúa con la flecha, el clic en una opción, `ArrowDown`, `Enter` y `Escape`, y se cierra al pulsar fuera. Los tres campos del numeral 1 (tipo, nombre, proceso) se alinean en una rejilla de tres columnas `.panel-selectores--tres` de 36 px de alto —el flex-box anterior, con `align-items: flex-end`, subía los controles porque el `<input>` mide 36 px y el `<select>` 34—, y la nota pasa a una fila inferior a todo el ancho; por debajo de 760 px la rejilla se apila en una columna. Además, la opción «nombre nuevo» solo se ofrece si el nombre no está en uso: ofrecer un nombre que ya pertenece a un proyecto de otro tipo era una contradicción, porque ese cambio se rechaza después con el aviso de choque; en ese caso la nota lo dice. `elegirProyectoDeLista()` no dispara `change` si el nombre no cambia, para no reinicializar el proyecto en curso. Ver `adaptaciones.md` §24. |
| 2026-10-01 | **Cada proyecto empieza de cero**: `onCampoIdentificacion()` re-etiquetaba la evaluación en curso con el nombre nuevo (`sincronizarEV()` asigna `ev.proyecto = estado.proyecto` y conservaba los riesgos), así que escribir otro nombre heredaba el trabajo del proyecto anterior. Ahora la identidad del proyecto es `nombre||tipo` (`identidadProyecto()`), el nombre va con el desplegable que ofrece los proyectos anteriores **del tipo seleccionado** con su número de evaluaciones, y `inicializarParaProyecto()` pone el numeral 2 y la matriz unificada en cero para un proyecto nuevo. Si el nombre ya existe con **otro** tipo se avisa y se revierte el campo, para no mezclar Estructura e Infraestructura. Si había trabajo en curso se pregunta si se guarda **en el proyecto al que pertenece**, nunca se arrastra. `apuntarMatrizAProyecto()` sustituye la lógica duplicada del selector, de modo que una matriz nunca conserva el proyecto anterior. Además `DBApp.nuevaEvaluacion()` ya respeta `opts.proyecto` (antes ponía el proceso). Ver `adaptaciones.md` §23. |
| 2026-10-01 | **La matriz unificada se conecta al numeral 2** (datos incorrectos corregidos): (a) la matriz y el bloque 2 ahora calculan con el **mismo helper**, `AppUI.resultadoDeGuardado()`, que usa `clonarCatalogo()` y por tanto respeta las ediciones de la pestaña Catálogo; antes la matriz leía `CATALOGO` en crudo, así que al editar una lista el ND del numeral 2 cambiaba y el de la matriz se quedaba atrás. (b) La columna «Proyecto» mostraba `ev.proceso`: ahora muestra `ev.proyecto`. (c) Un riesgo sin NE/NC ya no inventa NP y NR (el motor usa 1 por defecto): la tabla muestra `—`, NI vacío, y los promedios de NP/NR de la fila de grupo se calculan solo sobre riesgos completos; PDF, impresión, Excel y CSV usan `fmtAusente()` porque `NTP330.fmt(null)` devolvía 0. (d) `onProceso()` **borraba la evaluación del proceso** al seleccionarlo, perdiendo el trabajo y su grupo en la matriz; ahora la restaura, de modo que la matriz es progresiva y acumulada entre procesos. Ver `adaptaciones.md` §22. |
| 2026-10-01 | **Vínculo entre el numeral 2 y la matriz unificada**: la matriz consolidada pasa a seguir por defecto al proyecto del numeral 2 (`estado.matrizVinculada`), así que cada riesgo que se agrega, excluye o evalúa en el bloque 2 se replica en la segunda pestaña, clasificado por proceso, con su análisis estadístico; `refreshMatrizUnificada()` adopta sola el proyecto en curso para que la pestaña nunca aparezca vacía mientras se evalúa. Se añaden dos botones: «↔ Vincular al proyecto del numeral 2» y «⟲ Inicializar matriz». Inicializar pide confirmación, deja la matriz en blanco y corta el vínculo **sin borrar evaluaciones**, y vacía de verdad `tbody`, estadísticas y los cinco lienzos para no dejar datos de la vista anterior. Un aviso `#estadoVinculoMatriz` deja constancia del estado (verde vinculado con el nombre del proyecto / rojo inicializado). Escoger un tipo de proyecto nuevo ahora también corta el vínculo: el nombre del proyecto anterior sobreviviría al cambio de tipo y produciría una combinación inválida. Ver `adaptaciones.md` §21. |
| 2026-10-01 | **Matriz unificada clasificada por proceso, PDF e impresión**: el bloque 2 cierra con «✓ Guardar y ver en Matriz unificada», que guarda la evaluación y abre la pestaña con el proyecto ya seleccionado. La matriz consolidada se agrupa por proceso constructivo con una fila de encabezado y subtotales (ND/NP/NR promedio, recuento de niveles, completos sobre total). El análisis estadístico pasa a contar solo riesgos con NE y NC, que antes inflaba el nivel IV por el valor por defecto del motor. PDF en A4 horizontal agrupado por proceso con pie de página, e impresión en vista imprimible que también sirve de respaldo sin jsPDF; Excel y CSV conservan la clasificación. Los 5 gráficos pasan a `<figure class="cuadro-grafico">` con título y **sombra alternada verde `#006e49` / rojo `#c0242a`** de `Ejemplo.pptx`, y se implementan los dos que quedaban vacíos (riesgos críticos y matriz de calor ND × NP). La matriz se reinicia al escoger un tipo de proyecto y `poblarProyectosUnificados()` conserva el proyecto activo. Ver `adaptaciones.md` §20. |
| 2026-10-01 | **Bloque 2 reformado como matriz editable**: al elegir el proceso se crea una fila en blanco y el evaluador agrega riesgos uno a uno desde un desplegable (antes se generaban los 14 del proceso de una vez). El cuestionario de chequeo, el NE y el NC pasan a modales con justificación obligatoria; el panel de detalle se re-renderiza al guardar NE/NC para que no quede obsoleto; NP, NR y NI muestran `—` mientras falte ND, NE o NC. Se conservan exclusión con motivo, re-inclusión, riesgos fuera de catálogo, trazabilidad y ART. Al reabrir una evaluación se restauran **solo los riesgos agregados** (`restaurarEstado` ya no pre-genera el catálogo del proceso) y las filas en blanco no se persisten. Ver `adaptaciones.md` §19. |
| 2026-09-30 | **Bloque 2 retirado de Evaluación**: identificación, selección e inclusión/exclusión de riesgos concentradas en la matriz del bloque 3. Se eliminaron los recuadros duplicados y sus eventos/estilos; guardar y volver regresa a la matriz del bloque 3 y volver al numeral 1 permite retomar la evaluación. |
| 2026-09-30 | **Encabezado superior eliminado**: se retiró la banda negra con letras blancas y sus estilos; la página comienza directamente con las pestañas de la aplicación. |
| 2026-09-30 | **Colores según `Ejemplo.pptx`**: cabecera gris carbón, fondos y tablas claros, bordes grises, numerales y flechas rojos, botones y casillas verdes. Los encabezados y bordes PDF y las vistas imprimibles comparten el tema CSS de la aplicación. |
| 2026-09-30 | **Secuencia de procesos desplazable**: se eliminó la fijación de `#flujo-evaluacion`; ahora se desplaza con el contenido y desaparece de la vista al bajar por la evaluación. |
| 2026-09-30 | **Tema global de la interfaz** alineado con la presentación: Arial, escala gris neutra, acentos verde/rojo, cabecera oscura con filete verde, pestaña activa verde, tablas neutras y botones secundarios de contorno. Los títulos de Catálogo/Pruebas/trazabilidad y los gráficos usan el tema CSS. Colores NI I–IV conservados. |
| 2026-09-30 | **Badge de resultado registrado**: se reemplazó la variable inexistente `--verde-medio` por el acento verde del tema. |
| 2026-09-30 | **Formato de listas PDF**: la columna Observaciones de campo se limita a 24 mm, la pregunta de la lista completada ocupa el ancho útil restante y el resumen reserva espacio al final. Se envuelve la fórmula al ancho del papel y se representan Σ y las casillas con texto compatible con Helvetica de jsPDF. |
| 2026-09-26 | **Corrección de error fatal**: `app.admin.js` usaba `esc()` sin definirla (la función vivía solo en el IIFE de `app.ui.js`). Provocaba 4 `ReferenceError` al iniciar y abortaba `AppUI.init()`, dejando sin enlazar parte de la interfaz. Se añadió `esc()` local en `app.admin.js`. |
| 2026-09-26 | Nuevo `js/app.backup.js` (`BackupApp`): exporta e importa **todas** las claves `ntp330.*` en un JSON, para migrar los datos del navegador a otro equipo. Botones en la pestaña Catálogo. |
| 2026-09-26 | Documentación de continuidad: `AGENTS.md` (raíz), `0/README.md`, `0/docs/ESTADO.md`, `0/docs/continuidad.md` y §15–§17 de `adaptaciones.md`. |
| 2026-09-26 | Repositorio git inicializado con el estado completo del proyecto, más `.gitignore` (archivos de bloqueo `~$*`) y `.gitattributes` (fin de línea normalizado entre equipos). |

## 5. Pendientes

Prioridad alta:

- [x] **Revisión visual de los PDF de muestra** (2026-09-30): ART A4/A3 horizontal,
      lista de campo con celdas vacías y Observaciones visible, lista completada con
      resumen legible; tablas dentro de los márgenes. Caso: `E-RM-CMN`, 10 preguntas.
- [ ] Revisar que `adaptaciones.md` §15–§17 reflejen exactamente lo implementado en las
      correcciones 4–6 (se escribió a partir del código, falta contraste con el enunciado).

Prioridad media:

- [x] **Los 2 gráficos vacíos de la matriz unificada** (2026-10-01): implementados «riesgos
      críticos por proceso (NI I y II)» y «matriz de calor ND × NP». Ya no quedan cuadros
      vacíos y se puede retirar esta nota.
- [ ] El recorrido automático `--flow` de `D:\ejemplo\tes\tools\app_cdp.js` sigue usando los
      selectores de la interfaz anterior (`.riesgo-tab`, `.sel-ne`, `.ck-radio`): falla con
      «Control no disponible». Adaptarlo al bloque 2 actual o darlo por obsoleto. Mientras
      tanto, el recorrido vigente está en `adaptaciones.md` §19.5 y §20.7.
- [ ] `#estado-general` y `#btnEliminarEvaluacion` (`app.ui.js:641` y `:652`) no existen en
      `index.html` ni en ningún template: código muerto. Decidir si se agrega el badge de
      estado general y el botón de eliminar evaluación, o se elimina el código.
- [ ] Revisión visual por el usuario de los PDF locales de muestra. La matriz unificada,
      ART A4/A3 y las dos listas se generan y verifican estructuralmente sin conexión.
- [x] `pruebas/` contiene el verificador completo y el recorrido automatizado.

Descartado / sin pendiente:

- El flujo de 8 pasos de `correcciones1.md` fue sustituido por la reorganización de
  `correcciones2.md`; no es trabajo perdido.

## 6. Cómo volver a verificar

```bash
# 1. sintaxis de todos los scripts
for f in 0/js/*.js; do node --check "$f"; done

# 2. suite de pruebas dentro de la app
#    abrir 0/index.html → pestaña Pruebas → "Ejecutar pruebas de validación" → debe dar 52/52

# 3. consola del navegador: 0 errores
# 4. recorrido manual: crear proyecto → proceso → agregar riesgos → checklist → NE → NC
#    → guardar → ART
```

El recorrido del bloque 2 está cubierto por `adaptaciones.md` §19.5 y se verificó en Chrome
headless el 2026-10-01: solo los riesgos agregados se restauran al reabrir la evaluación,
las filas en blanco no se persisten y no hay desbordes horizontales a 1368 px ni a 585 px.

Verificación automatizada desde la raíz del proyecto único `presentacion`:

```bash
tools\reanudar.cmd app
node tools/integration_check.js
node tools/app_cdp.js tools/out/ntp330_pruebas.png --tab=pruebas --run
```

El recorrido completo comprueba cinco PDF reales con las bibliotecas locales.
Las pruebas usan perfiles aislados bajo `tools/out/`; los proyectos y las
evaluaciones del navegador del usuario no se tocan.

Para migrar los datos a otro equipo, seguir `continuidad.md`.

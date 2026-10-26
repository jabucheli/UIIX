# AGENTS.md — Módulo NTP 330 integrado en presentacion

Aplicación web estática (HTML + CSS + JavaScript sin framework ni build) que implementa la
evaluación de riesgos laborales según el método **NTP 330** (INSST, 1991), adaptada a la
normativa ecuatoriana y aplicada a proyectos de construcción.

Este archivo es el punto de entrada para cualquier sesión de trabajo (incluido opencode).
Léelo antes de tocar código.

Este módulo pertenece al repositorio único **`presentacion`**. Aplican también
las reglas de **`../../AGENTS.md`**. El arranque, verificación y respaldo se
realizan con `iniciar.cmd`, `tools/reanudar.cmd app` y `guardar.cmd` desde la
raíz de ese proyecto. Los comandos `node 0/...` de esta guía son relativos a
esta carpeta del módulo.

---

## 1. Regla de oro: los datos NO están en los archivos

Todo lo que el usuario crea (proyectos, evaluaciones, ediciones del catálogo) vive en el
**localStorage del navegador**, claves con prefijo `ntp330.`:

| Clave | Contenido |
|---|---|
| `ntp330.evaluaciones` | evaluaciones completas (riesgos, respuestas, ND/NE/NP/NC/NR, controles, aprobación) |
| `ntp330.proyectos` | proyectos creados (`PROY-XXXX`) |
| `ntp330.contador` / `ntp330.contadorProy` | consecutivos de `EVAL-XXXX` / `PROY-XXXX` |
| `ntp330.catalogo.override` | ediciones de listas de chequeo (texto y NDR) |
| `ntp330.proyectos.override` | tipos, procesos, subprocesos, actividades y tareas configurados |
| `ntp330.config` | configuración general (perfil de NI) |

Consecuencia práctica: **cambiar de equipo, de navegador o de perfil pierde las evaluaciones**
salvo que se exporte un respaldo. La app tiene copia de seguridad en la pestaña Catálogo
(«Copia de seguridad de los datos») y también por consola:

```js
BackupApp.exportar()                                   // descarga ntp330-respaldo-AAAAMMDD-HHMM.json
localStorage.setItem('ntp330.respaldo', BackupApp.construir())  // backup rápido en el propio navegador
```

Protocolo completo de traspaso entre equipos: `0/docs/continuidad.md`.

---

## 2. Estructura del repositorio

```text
D:\ejemplo\presentacion\presentacion-web\ntp330\
├── AGENTS.md                  este archivo (contexto para cualquier sesión)
├── README.md, ORIGEN.json     integración y procedencia
├── historial-origen.bundle   historial anterior para consulta
├── 330.pdf                    NTP 330 (INSST 1991) — fuente metodológica
├── nd.xlsx                    listas de chequeo, fórmulas y rangos — fuente del cálculo
├── matriz.xlsx, procesos.docx, legal.docx, ER.docx   fuentes de la investigación
├── instrucciones.md           contexto original del trabajo
├── correcciones.md … correcciones6.md   solicitudes de corrección (1 a 6 rondas)
└── 0/                         LA APLICACIÓN
    ├── index.html             estructura y orden de carga de scripts
    ├── css/style.css
    ├── vendor/                jsPDF y AutoTable locales, con licencias
    ├── js/                    código (ver §4)
    ├── docs/                  adaptaciones.md · ESTADO.md · continuidad.md
    ├── legacy/                index_original.html, script_original.js, style_original.css
    ├── pruebas/               herramientas de verificación (Node + Chrome headless por CDP)
    └── sql/                   (vacío, reservado: la app no usa servidor)
```

`0/legacy/` contiene la aplicación original de un solo archivo: **no editar**, sirve de
referencia histórica.

## 3. Cómo ejecutar y probar

- **Uso**: abrir `0/index.html` en Chrome/Edge. Funciona con `file://` (scripts clásicos).
  Para evitar restricciones del navegador, alternativa: `npx serve 0` o
  `python -m http.server` dentro de `0/`.
- jsPDF y autotable se cargan **desde `0/vendor/`** y generan PDF sin Internet.
  La vista imprimible sigue disponible (`js/app.reportes.js`).
- **Suite de pruebas**: pestaña *Pruebas* → «Ejecutar pruebas de validación». Son 52 pruebas
  que validan el motor contra `nd.xlsx` y contra las 189 filas de referencia. Deben dar
  **52/52** antes de dar por buena cualquier modificación del motor, del catálogo o de la
  metodología.
- **Verificación automatizada** (Chrome headless por CDP, sin dependencias npm: solo módulos
  nativos de Node y el WebSocket global de Node 22). Vive **dentro del repo**, en
  `0/pruebas/`, para no depender de nada de un equipo concreto:

  ```bash
  node 0/pruebas/verificar.js           # los 3 puntos de §7 en orden; sale con código 1 si falla
  node 0/pruebas/verificar.js --rapido  # solo sintaxis + suite de 52
  node 0/pruebas/prueba-bloque2.js      # recorrido del numeral 2 y aislamiento de proyectos
  node 0/pruebas/verificar-cdp.js <salida.png> --tab=pruebas --run
  node 0/pruebas/verificar-respaldo.js [<archivo.json>]   # valida un respaldo de datos
  ```

  Cada ejecución usa un perfil desechable y una copia de la app en `tools/out/`
  del proyecto principal: nunca tocan los `localStorage` del usuario. Si Chrome está en otro sitio, se
  fija con la variable `NTP330_CHROME`. Las salidas (capturas, informes, respaldos) van a
  `0/pruebas/out/`, que está en `.gitignore`.

- **Retomar el trabajo más adelante**: la rutina de inicio y de cierre de sesión está en
  `0/docs/continuidad.md`. En corto: `git status` → abrir la app → leer
  `0/docs/ESTADO.md` §4 y los pendientes de §8 → `node 0/pruebas/verificar.js` → al
  terminar, exportar respaldo y ejecutar `guardar.cmd` en el proyecto principal.

## 4. Arquitectura de `0/js`

Orden de carga obligatorio (definido en `index.html`): primero datos, luego núcleo, luego interfaz.

| Archivo | Global que publica | Rol |
|---|---|---|
| `app.data.catalogo.js` | `APP_CATALOGO` | 44 listas de chequeo (471 preguntas) de `nd.xlsx`. **Generado, no editar a mano.** |
| `app.data.legal.js` | `APP_LEGAL` | anexos normativos A–H por riesgo, desde `legal.docx`. **Generado.** |
| `app.data.controles.js` | `APP_CONTROLES` | controles por código de riesgo (34 códigos, 447 medidas). **Generado.** |
| `app.data.referencia.js` | `APP_REFERENCIA`, `APP_REFERENCIA_VALIDO` | 189 riesgos con ND/NE/NP/NC/NR de la tesis. **Generado.** |
| `app.data.procesos.js` | `APP_TIPOS_PROYECTO`, `APP_PROCESOS_POR_TIPO`, `APP_METADATA_RIESGO`, … | tipos de proyecto (Estructura/Infraestructura) y procesos constructivos. |
| `app.metodologia.js` | `NTP330` | tablas y umbrales NTP 330: NE, NC, bandas de ND/NP, NI, residuales. |
| `app.motor.js` | `MotorNTP330` | cálculo: `calcularND`, `capND`, NP, NR, redondeo. |
| `app.db.js` | `DBApp` | persistencia en localStorage + IDs `EVAL-XXXX`/`PROY-XXXX` + migración. |
| `app.controles.js` | `ControlesApp` | controles por código y evaluación residual. |
| `app.ui.js` | `AppUI` | interfaz: 6 pestañas, zonas 1/3/4, matriz integrada en el 3, formularios y eventos. |
| `app.reportes.js` | `ReportesApp` | CSV, JSON, Excel, ART (A4/A3 horizontal), vista previa, listas de chequeo (campo/completada). |
| `app.admin.js` | `AdminApp` | administración del catálogo (tipos, procesos, preguntas, NDR). |
| `app.backup.js` | `BackupApp` | export/import de todas las claves `ntp330.*`. |
| `app.pruebas.js` | `AppPruebas` | suite de 52 pruebas. |

Cada archivo es un IIFE con `'use strict'`, `var`, funciones `function` y comentarios en
español. **Cada IIFE es un ámbito cerrado**: una función definida en un archivo NO es visible
desde otro. Si un archivo necesita algo de otro, se accede por el global (`NTP330`, `DBApp`,
`AppUI`…) o se define una copia local. Esto ya causó un error real: `esc()` vivía solo en
`app.ui.js` y `app.admin.js` la usaba sin definirla (`ReferenceError` al iniciar).

## 5. Fórmulas intocables

Están fijadas por el enunciado de la tesis y por las correcciones:

```text
NDP = (NDR × 10) / ΣNDR de la lista        ΣNDP = 10.00 exacto
NDD = NDP si la respuesta es "No", 0 en cualquier otro caso
ND  = Σ NDD                                topado a [0, 10]
NP  = ND × NE
NR  = NP × NC                              (no volver a multiplicar por NE)
NI  = f(NR)                                automático, nunca manual
```

Semántica de la columna «No» de `nd.xlsx`: **«Sí» = cumple (no aporta), «No» = no cumple
(aporta NDP), «No aplica» = no aporta y no cuenta, «No verificado» = no aporta pero deja la
lista pendiente y bloquea la aprobación**. Detalle completo en `0/docs/adaptaciones.md`.

## 6. Flujo de la interfaz

0. **Identidad del proyecto** (`identidadProyecto(nombre, tipo)` → `nombre||tipo`): el campo
   «Nombre del proyecto» es un desplegable propio (`#comboProyecto` + `#btnComboProyecto` +
   `#listaProyectosSugeridos`, un `<ul role="listbox">`) con los proyectos anteriores **del tipo
   seleccionado**; el botón con `▼` está siempre visible, no solo al enfocar el campo. Un
   nombre nuevo **arranca desde cero**: `inicializarParaProyecto()` vacía
   el numeral 2 y apunta la matriz unificada al proyecto nuevo (vinculada pero vacía). Elegir
   un proyecto anterior retoma su información. Un nombre ya usado con **otro** tipo se avisa y
   se revierte: Estructura e Infraestructura nunca se mezclan. Si había trabajo en curso se
   pregunta si se guarda **en el proyecto al que pertenece** (`confirmarCambioIdentidad()`);
   nunca se arrastra al nuevo.

1. **Identificación del proyecto** (numeral 1: tipo Estructura/Infraestructura + nombre +
   proceso). Los tres campos van en `.panel-selectores--tres`, una rejilla de tres columnas
   con altura fija de 36 px para que `<input>` y `<select>` compartan línea. No aplicar
   `.panel-selectores` a secas: se comparte con otros formularios. Detalle en
   `0/docs/adaptaciones.md` §24.
2. **Aplicación de cuestionarios de chequeo / Evaluación de riesgos** (numeral 2): al elegir el
   proceso se crea **una fila en blanco** y el evaluador **agrega los riesgos uno a uno** con un
   desplegable; al elegir uno se abre su cuestionario en modal. NE y NC se eligen en modales
   propios con justificación obligatoria. La matriz muestra ND, NE, NP, NC, NR y NI; NP/NR/NI
   muestran `—` mientras falte ND, NE o NC. También hay exclusión con motivo, re-inclusión,
   riesgos fuera del catálogo, trazabilidad y un panel de detalle del riesgo activo.
3. **Determinación de estrategias de control ART** (numeral 4): descargas A4/A3, vista previa y exports.

En el numeral 2 **no se generan de una vez todos los riesgos del proceso**: el desplegable de
cada fila ofrece los riesgos disponibles y omite los ya usados en otra fila. Al reabrir una
evaluación se restauran **solo los riesgos agregados**, en el mismo orden; las filas en blanco
no se persisten. Detalle en `0/docs/adaptaciones.md` §19.

El bloque 2 cierra con **«✓ Guardar y ver en Matriz unificada»** (`AppUI.verMatrizUnificada`),
que guarda la evaluación, **vincula** la matriz consolidada al proyecto y abre la pestaña
*Matriz unificada y análisis*. La matriz unificada **no es una vista paralela**: es la misma
evaluación del numeral 2. Todo riesgo ya guardado se calcula con
`AppUI.resultadoDeGuardado(g)`, que usa `clonarCatalogo()` (respeta las ediciones de la
pestaña Catálogo) y devuelve `{ res, completo }`. **Nadie debe recalcular un riesgo guardado
leyendo `CATALOGO` en crudo**: eso fue la causa de que el ND de las dos matrices divergiera.
Sin NE y NC, `completo` es `false` y NP/NR se muestran `—` (el motor usaría 1); los promedios
de grupo y del análisis solo usan riesgos completos.

La matriz **sigue por defecto al numeral 2** (`estado.matrizVinculada`): cada riesgo que se
agregue, excluya o evalúe en el bloque 2 se replica en la segunda pestaña, clasificado por
proceso constructivo, con su análisis estadístico; `refreshMatrizUnificada()` adopta sola el
proyecto en curso. Hay dos botones:
**«↔ Vincular al proyecto del numeral 2»** (`vincularMatriz`) y **«⟲ Inicializar matriz»**
(`inicializarMatriz`), que pide confirmación, deja la matriz en blanco y corta el vínculo
**sin borrar evaluaciones**. Allí la matriz se muestra **clasificada por proceso constructivo**, con una fila
de encabezado por proceso (ND/NP/NR promedio, recuento de niveles, completos sobre total), y
se puede **guardar en PDF (A4 horizontal, agrupado)** o **imprimir** (vista imprimible que
también sirve de respaldo sin jsPDF). Escoger un nuevo tipo de proyecto en el numeral 1
**reinicia la matriz y corta el vínculo**. Seleccionar un proceso **restaura** su evaluación
si ya existe (`onProceso`): la matriz es progresiva y acumulada entre procesos. Los cinco
gráficos van en `<figure class="cuadro-grafico">` con **sombra alternada** verde `#006e49` /
rojo `#c0242a` de `Ejemplo.pptx`. Detalle en §20, §21 y §22.

Pestañas adicionales: *Matriz unificada y análisis* (5 gráficos + estadísticas), *ARTs
generados*, *Catálogo* (administración + copia de seguridad), *Pruebas*, *Metodología NTP 330*.

## 7. Verificación antes de entregar cualquier cambio

1. `node --check js/<cada archivo tocado>.js` (sintaxis).
2. Abrir en Chrome headless y confirmar **0 errores de consola** y **pestaña Pruebas 52/52**.
3. Recorrer el flujo: crear proyecto → elegir proceso → agregar riesgos → responder checklist →
   NE → NC → excluir/re-incluir → guardar → ver en Matriz unificada → PDF/impresión.
4. Verificar los PDF (celdas vacías en la lista de campo; ART horizontal sin cortes).
5. Actualizar `0/docs/ESTADO.md` (qué cambió) y, si aplica, `0/docs/adaptaciones.md`.

Herramienta usada para los puntos 2–4: `0/pruebas/verificar.js` (Chrome con
`--headless=new` + `--remote-debugging-port` y CDP sobre WebSocket, sin dependencias npm).
Perfil temporal distinto por ejecución para no contaminar el localStorage del usuario.

## 8. Estado actual (resumen)

La aplicación implementa `correcciones.md` … `correcciones6.md` y el rediseño del bloque 2
documentado en `0/docs/adaptaciones.md` §19 a §23. Verificado en Chrome headless el
2026-10-01: carga sin errores, 52/52 pruebas, recorrido completo del bloque 2 (agregar
riesgos, cuestionario, NE, NC, exclusión/re-inclusión, riesgo manual, recarga) con 0 errores,
replicación automática de la matriz en la segunda pestaña, inicialización sin pérdida de datos
y re-vinculación, conexión de datos entre ambas matrices (mismo ND con la lista de chequeo
editada, `—` en NP/NR sin NE/NC, columna Proyecto correcta) y acumulación de dos procesos
constructivos sin que re-seleccionar uno borre su evaluación, aislamiento entre proyectos
(nombre nuevo desde cero, sin suggestions cruzadas entre tipos, trabajo en curso guardado en
el proyecto de origen), matriz unificada clasificada por
proceso, PDF/verificación de impresión y reinicio al cambiar de tipo de proyecto, 5 cuadros con
sombra alternada 3 verde / 2 rojo y los 5 gráficos pintados, sin desbordes horizontales a
1368 px ni a 585 px, respaldo export/import funcionando.

Pendientes conocidos:

- `#estado-general` y `#btnEliminarEvaluacion` se referencian en `app.ui.js` pero no existen
  en `index.html` ni en ningún template: código muerto protegido con `if (!x) return`.
- El recorrido `--flow` del driver antiguo de `D:\ejemplo\tes\tools\app_cdp.js` usaba los
  selectores de la interfaz anterior (`.riesgo-tab`, `.sel-ne`, `.ck-radio`) y falla con
  «Control no disponible». Está obsoleto: el recorrido vigente es
  `node 0/pruebas/prueba-bloque2.js`, que ya vive en el repo.
- `docs/adaptaciones.md` §15–§17 (correcciones 4–6) son un resumen pendiente de revisión.
- El PDF de la matriz unificada está verificado por estructura; la revisión visual
  corresponde al usuario.

## 9. Reglas de trabajo

- No cambiar fórmulas ni umbrales sin actualizar `docs/adaptaciones.md` y la suite de pruebas.
- No editar los `app.data.*.js` generados a mano: se regeneran desde las fuentes.
- Todo cambio de comportamiento va acompañado de una línea en `0/docs/ESTADO.md`.
- Idioma de la interfaz, comentarios y documentación: **español**.
- Solo crear commits cuando el usuario lo solicite. El respaldo conserva el árbol
  actual y el historial del repositorio principal. No incluir bloqueos de Office.

# Continuidad — Presentación web de tesis doctoral

> Documento de trabajo autónomo para retomar el trabajo **en este computador o en otro**.
> Alcance actual: **los 12 slides de la presentación** de `presentacion-web` + integración con la app
> de `D:\ejemplo\tesis\0` (desde el bloque Riesgo del slide 7).
> Última actualización: **2026-10-13**.

---

## 0. TL;DR

| | |
|---|---|
| **Reanudar (este equipo)** | `cd tools` y ejecutar **`reanudar.cmd`** → comprueba Node/Chrome/jsdom/app hermana, verifica todo (**54/54 + 770/770**), genera capturas, y muestra el estado git de los dos repos y dónde sigue la doc. Variantes: `reanudar.cmd shot` (además genera los PNG) y `reanudar.cmd app` (además ejecuta las **52/52** pruebas de la app). Ver §17. |
| **Guardar / llevar a otro equipo** | `cd tools` y **`traspaso.cmd paquete`** → comprueba el **inventario** completo (`verificar-inventario.js`, manifiesto en `tools/inventario.json`), avisa de lo que git no ha guardado y genera el zip portable `tools\out\traspaso\presentacion-tesis-AAAAMMDD-HHMM.zip` (presentacion + tesis hermana + respaldos JSON + historial git + LEEME). Procedimiento completo en `TRASPASO.md`. |

**Regla de oro para mover el trabajo:** `presentacion` y `tesis` son carpetas **hermanas**
(al mismo nivel) y viajan **juntas**: la presentación embebe la app `tesis\0`
desde el bloque Riesgo del slide 7. El paquete de `traspaso.cmd paquete` lleva
ambas.
| Estado | **Los 12 slides están desarrollados y verificados**: carátula (réplica del slide 1 de `Ejemplo.pptx`), problematización, objetivos+hipótesis, marco teórico, metodología (5 fases + mapa circular con zoom por clic), resultados (3 columnas + sub-bloques + nivel 2 de imágenes), resultados (2) (flujograma NTP 330 + cuadros de `ER.docx` + embebido de la app de `tesis/0`), resultados (3) (6 resultados + ART + galería de fotos) y **EPT** (diagrama esquemático de 5 franjas aplicado **muy detalladamente** según `EPTransf.md`: secuencia de transformación arriba, franja central Fundamento → Etapa 1 → Etapa 2 → Etapa 3 → Propósito, resultado esperado y recursos clave, con la paleta verde/rojo del deck; banda central al **75 % de alto (309 px)**, conjunto **centrado verticalmente**, títulos de etapa **+20 %** y flechas centrales **verde → rojo → verde → rojo**, §27-§28; y **clic en cada etapa → imagen de detalle** `pt1..pt4.png` en primer plano con aparición sencilla (proyección de escala `scale(.5→1)` al abrir y de más a menos al cerrar, sin giro), nivel 2 en Etapa 3 (pt3 → pt4) y clic fuera/ESC → pantalla principal, con el slide atenuado detrás, §29; y **nivel 2 en Etapa 2**: clic sobre pt2 → `riesgos1.png` + `riesgos2.png` lado a lado, §33); y **Validación** (slide 10 nuevo, §31: mapa mental del proceso Delphi con núcleo «Validación de la propuesta», panel de 8 expertos, tres rondas —verde/rojo/verde— y banda de síntesis, con **clic en cada ronda o en la síntesis** → modal con su tabla y comparativa final; y mapa a **altura natural con el conjunto centrado en vertical**, §32); y **Conclusiones** (slide 11 nuevo, §34: seis bloques encadenados 1→6 —verde/rojo, **el bloque 6 en rojo**— con conectores radiales hacia el nodo central «CONCLUSIONES» y franja de aporte central, códigos normativos como chips y la validación Delphi como cajas; **interacción en dos pasos**: 1.er clic → el bloque se **agranda y centra**, 2.º clic → pantalla con la conclusión completa del bloque, §34); y **Recomendaciones** (slide 12 nuevo, §35: tres columnas de ámbito —metodológico y académico en verde, práctico en rojo— con seis subbloques 1-6 que llevan número, título, palabras clave y franja de cierre, y una banda operacional «Ampliar → Aplicar → Actualizar → Investigar»; **un clic en cualquier subbloque** abre su detalle ampliado). Ver §18-§36 para la historia reciente. |
| Carátula (slide 1) | **Reescrita en §23**: banda negra `#262626` de 211px con `logocaratula.png` centrado (430px, `aspect-ratio:306/65`), textos del ejemplo ("Presentación Tesis Doctoral", título, "DOCTORADO EN DIRECCIÓN DE PROYECTOS", "Candidato: Jorge Alexander Bucheli García", "Asesora: Dra. Julia Ayuso, Ph.D."), franjas verticales a la izquierda, tira abstracta rojo/verde a la derecha **atenuada al 50%** (`opacity: 0.5`, §24). **Sin** el logotipo de `logo.bmp` y **sin** la etiqueta "ETIQUETA". |
| Encabezado | Pestañas de navegación con el índice; **retirado el texto** "Tesis Doctoral · Gestión de proyectos…" (`.brand-text`), queda solo el punto verde de la izquierda. |
| Logo superior | `logo.bmp` convertido a `assets/logo.png` en la **esquina superior derecha de los slides 2-9** (no en la carátula), `top:8px; right:12px; width:140px`. Ver §21. |
| Pie institucional | `logo-inf.png` → `assets/logo-inf.png` (1316→1119px, −15%) **solo en pantalla completa**: banda de 80px en flujo al pie del marco (720→800px) que NO desplaza el contenido; `align-items:flex-end` lo apoya en el borde inferior. Ver §22. |
| Paleta | Verde `#006E49` · Rojo `#C0242A` · negros/grises de `Ejemplo.pptx` (banda `#262626`, textos `#4C4A4F`/`#595959`, verde de programa `#006E49`). |
| Verificación | **`cd tools && reanudar.cmd`** (una orden: entorno + todo + estado git); atajo: `verify-all.cmd shot`. Objetivo actual: **54/54 (map) + 770/770 (focus, los 12 slides) + `TODO OK`**. |
| Capturas | `tools/out/slide01_cover.png` y `slide01_cover_fs.png` (carátula normal/pantalla completa) · `slide_fs_foot.png` (pie en pantalla completa) · `slide05_map.png`, `md_shot*.png` · `slide06*.png` · `slide07*.png` · `slide08*.png` · `slide09.png` + `slide09_f1/f2/f3/f3img.png` + `slide09_f2img.png` + `slide09_frs.png` (EPT y sus detalles) · `slide10.png` + `slide10_fr1/fr2/fr3/frn.png` (Validación y sus modales) · `slide11.png` + `slide11_zoom1..6.png` (bloque agrandado) + `slide11_fb1..6.png` (conclusión) [Conclusiones] · `slide12.png` + `slide12_frc1..6.png` (Recomendaciones y sus detalles) · `res2_shot*.png` · `res3_shot*.png` |
| Revisar a ojo (no las puede leer el asistente) | `slide01_cover.png` (banda negra + logos + tira al 50%), `slide_fs_foot.png` (pie 1119px al borde), `slide09.png` (esquema EPT) y `slide09_f1/f2/f3/f3img.png` (imágenes de detalle al hacer clic en cada Etapa) + `slide09_f2img.png` (riesgos1 + riesgos2 en paralelo, §33), `slide10.png` (mapa de validación) y `slide10_fr1/fr2/fr3/frn.png` (modales de ronda y tabla comparativa), las capturas de logos en los slides 2-11, más `slide11.png` + `slide11_zoom1..6.png` (el bloque agrandado y centrado) + `slide11_fb1..6.png` (la conclusión) del slide de Conclusiones, y `slide12.png` + `slide12_frc1..6.png` (las tres columnas de ámbito y el detalle ampliado de cada subbloque) del slide de Recomendaciones. El usuario impone el diseño; el asistente mide geometría con Chrome y el usuario valida lo visual. |
 | Pendiente | Nada bloqueado. Próximos pasos típicos: revisión visual del usuario de las capturas (en especial del slide 12: `slide12.png` y `slide12_frc1..6.png` — el subbloque 1 es ahora un **diagrama radial** «C. Chequeo» + 5 riesgos + cadena NTP 324→330, §37), ajustes de textos/tamaños, nuevos contenidos por slide. Pendiente aparte: transcribir a HTML las imágenes `pt1..pt5` del slide 9 (falta fuente para `pt5`). |

---

## 1. Entorno y cómo retomar el trabajo

> **En este computador, lo más rápido es:** `cd tools` y `reanudar.cmd`
> (comprueba el entorno, verifica todo, enseña el estado git y te dice dónde
> está la documentación). Si todo termina con `REANUDACION COMPLETA`, el
> proyecto está tal y como se dejó.

### Requisitos
- **Node.js 22+** (probado con v22.14.0) y npm.
- **Google Chrome** solo para la captura y la auditoría visual (ruta por defecto
  `C:\Program Files\Google\Chrome\Application\chrome.exe`, configurable en `tools/verify-all.cmd`
  con `set CHROME=...`).

### Puesta en marcha en otra máquina
Lo que hay que llevar (clone/zip de la carpeta del repo): **todo EXCEPTO** `tools/node_modules/`,
`tools/out/` y dumps temporales (ver `.gitignore`). Son imprescindibles las **imágenes de
`presentacion-web/assets/`** (ref-norm.png, c-cheq.png, procesos1/2.png, riesgos1/2.png,
Imagen1.png) — si el clone no las trae, las fases/sub-bloques mostrarán «Imagen pendiente».

> **Atajo:** `traspaso.cmd paquete` genera un único `.zip` con `presentacion` y la app hermana
> `tesis` listo para otro equipo; el procedimiento completo está en `TRASPASO.md`.
> La carpeta hermana `tesis` hay que llevarla **sí o sí** (slide 7 y `reanudar.cmd`
> la requieren todo el tiempo).

```bash
# 1. Instalar Node.js 22+ (npm incluido). Chrome solo si se quieren capturas.

# 2. Dependencias de verificación (UNA SOLA VEZ)
cd tools
npm install            # instala jsdom ^24 (única dependencia)

# 3. Verificación completa.
#    En Windows:  verify-all.cmd  /  verify-all.cmd shot
#    En macOS/Linux (los scripts son .cmd; usa los comandos sueltos):
node --check ../presentacion-web/js/app.js   # y demás JS (verify-all los lista)
node map_check.js                            # 54 checks jsdom (slide 5)
node focus_check.js                          # 763 checks jsdom (los 12 slides)
node gen_map_shot.js && node gen_heights.js  # harness slide 5
node gen_results_heights.js                  # harness slide 6 (+ copia assets a out/)
# capturas (opcional): apuntar CHROME a la ruta local y usar
#   chrome --headless=new --screenshot=... file:///ruta/tools/out/results_shot.html
```

En otra máquina, ajustar en `tools/verify-all.cmd` la línea `set CHROME=...` si Chrome está en
otra ruta (p. ej. macOS/Linux: `set CHROME=/usr/bin/google-chrome`).

### Ver la presentación
`presentacion-web/index.html` usa **scripts planos** (sin `type="module"`), así que funciona
abriendo el archivo directamente (`file://`) o servido por HTTP:
```bash
npx serve presentacion-web -l 8080     # o: python -m http.server 8080
# abrir http://localhost:8080/index.html y llegar al slide 5 con la flecha derecha
```
Navegación: `←` `→` cambian de slide, `Home`/`End` primero/último; hay botones y pantalla
completa en la cabecera.

### Herramientas de verificación (`tools/`)
| Archivo | Qué hace |
|---|---|
| `verify-all.cmd` | Orquestador: `node --check` × 8 (incluye `js/data/erTables.js`) → `map_check.js` → `focus_check.js` → `gen_map_shot.js` → `gen_heights.js` → `gen_results_heights.js` → `gen_slide7_shot.js` → captura opcional (incluye `slide07*.png` y `res2_shot*.html`). |
| `reanudar.cmd` | **Punto de entrada al retomar el trabajo**: [1] entorno (Node, jsdom con `npm install` automático, Chrome, app hermana `../../tesis/0`), [2] `verify-all`, [3] opcional `app` → `app_cdp.js --tab=pruebas --run` (52/52), [4] `git status` de `presentacion` y `tesis`, [5] rutas de doc y comandos. Uso: `reanudar.cmd` · `reanudar.cmd shot` · `reanudar.cmd app` · `reanudar.cmd shot app` (ver §17). |
| `verificar-inventario.js` | **Comprueba el inventario** (`tools/inventario.json`): que existan todos los archivos y carpetas requeridos de `presentacion` **y** de la hermana `tesis`, avisa de la basura y de lo que git tiene sin commitear. `node verificar-inventario.js`. |
| `traspaso.cmd` | **Guardado y traspaso**: `traspaso.cmd` (inventario + git), `traspaso.cmd paquete` (además genera el zip portable en `tools\out\traspaso\`), `traspaso.cmd todo` (paquete + `verify-all`). Todo el procedimiento en `TRASPASO.md`. |
| `traspaso-empaquetar.ps1` | Empaquetador que llama `traspaso.cmd` (PowerShell, sin dependencias): comprime `presentacion` + `tesis` + respaldos JSON + historial git en `tools\out\traspaso\.` |
| `map_check.js` | **54 checks** en jsdom: estructura, posiciones, colores, insignias, textos prohibidos, ruta, nota, higiene. No necesita Chrome. |
`focus_check.js` | **383 checks** en jsdom de la interacción (mínimo histórico; **hoy el total es 654** y desde §21 también comprueba el logo superior de los slides 2-10, el pie de pantalla completa, los contenidos/forma de la carátula de §23-§25 y el esquema EPT del §26): foco por clic/teclado/ESC del slide 6 (**sub-bloques 1a/1b/2a/2b, fases 3a/3b y nivel 2 3aimg/3bimg** + ghost), del slide 5 (bloques 1-2 y 5 ramas + ghost) y del slide 7 (**página seccionada**: banda del flujograma al 18.75% con los 7 nodos, banda inferior con los dos recuadros de fotos, **los cinco cuadros de `ER.docx`**: cinco objetivos `data-focus` ne/np/nc/nr/ni, `window.ER_TABLES` cargado, los cinco cuadros ocultos en reposo, `Enter` y clic abriendo **solo** el cuadro del bloque pulsado, severidad rojo/verde, cierre con segundo clic y con `ESC`/clic fuera, ghost al abrir y ausente al cerrar, el CSS del crecimiento/encogimiento, **el centrado de todas las celdas**, **la matriz NR con sus tres ejes rotulados** — banner «Nivel de Probabilidad (NP)» con `colspan` de 4, rótulo vertical «Nivel de Consecuencias (NC)» con `rowspan` de 4, y los nombres del NP en las columnas y del NC en las filas — y **el bloque Riesgo abre la app de `tesis/0`**: `data-focus="f1"`, aria-label «Abrir la aplicación de evaluación de riesgos», iframe perezoso con `src` y `title` correctos, los 7 bloques ocultos con efecto (`opacity: 0; visibility: hidden`), fondo blanco opaco del recuadro abierto delante del ghost (`z-index: 2` sobre `z-index: 0`), y los recuadros de foto sin `data-focus`/`tabindex`/`role`) y **del slide 8** (`RESULTADOS3`: seis pasos `p1`…`p6` en secuencia con sus seis imágenes en disco y en orden, cifras resumen, verde/rojo, clic abre un único resultado y abre el de ese paso, cierre con segundo clic y `ESC`, ghost al abrir, resumen `.rs3-idle` visible en reposo y oculto al abrir, y el CSS de `.rs3-body`/`.rs3-panel`) y **del slide 9** (`EPT`: título "Estructura de la propuesta de transformación", subtítulo de EPTransf.md (secuencia metodológica orientada al fortalecimiento de la gestión preventiva en proyectos de construcción de edificaciones e infraestructura básica en Quito), el registro en `SLIDES`, las **5 franjas** de la lámina, la franja de lógica con sus 4 nodos, el central con Fundamento/Propósito y las 3 etapas (nombres exactos de EPTransf con su segunda línea, 4+4+5 viñetas exactas, cápsulas `NTP 324`/`NTP 330` solo en las etapas 2-3, los 3 grupos de "Recursos requeridos" con 5 pill cada uno y las 3 franjas de salida), el resultado esperado con sus 3 nodos, los 7 ítems de recursos clave, y el CSS verde/rojo (alternancia) / tintes EPTransf / `flex:1` del cuerpo). Inyecta `css/styles.css` para poder usar `getComputedStyle` (jsdom no carga el `<link>`). No necesita Chrome. |
| `gen_map_shot.js` | Escribe `out/map_shot.html` para la captura. |
| `gen_heights.js` | Escribe `out/heights.html` con un `<pre id="report">` de geometría del slide 5: estado normal detallado + auditoría de **9 estados** (normal, f1, f2, las 5 ramas, restaurado). También escribe `out/md_shot*.html`. |
| `gen_results_heights.js` | Igual para el **slide 6**: escribe `out/results_heights.html` y `out/results_shot*.html` (anchos de columna, clips, holgura por panel, líneas por ítem y por celda). Audita **13 estados** (reposo, f1, f1a, f1b, f2, f3, f2a, f2b, **f3a, f3b, f3aimg, f3bimg**, restaurado). |
| `gen_slide8_shot.js` | Audita el **slide 8**: `out/res3_heights.html` (reposo), `out/res3_focos.html` (los seis focos **y sus seis niveles 2**, 12 estados) y `out/res3_shot.html` + `out/res3_shot_fp1..fp6.html` y `fp1i..fp6i.html`. Los informes se lanzan en `load` para que las imagenes tengan `naturalWidth`. Encabezado 1408×76, cuerpo 1408×644, banda de pasos 1368×118 con 6 nodos de 209×102 y 5 conectores. En reposo: `.rs3-idle` 1368×486 y pantalla 1368×0. Con foco: resumen oculto y un panel 1368×498 (imagen centrada `object-fit: contain`, caja 1346×445). En el nivel 2 (`pNi`): secuencia y resumen ocultos, panel 1368×628 y caja de imagen 1350×610, cursor `zoom-out`. **0 clip/tx/OVERFLOW** en los trece estados. Reporta también `panel -` cuando ningún panel queda visible: así se detecta al vuelo un selector de clase mal escrito. |
| `gen_slide7_shot.js` | Audita el **slide 7**: `out/res2_heights.html` (reposo), `out/res2_focos.html` (seis focos) y `out/res2_shot.html` + `out/res2_shot_f{ne,np,nc,nr,ni,f1}.html`. Encabezado 1408×76, cuerpo 1408×644, flujo 1368×118 y 7 nodos de 166×118. En reposo: fotos 1368×486 y recuadros 677×486, sin iframe. Con tabla: fotos colapsadas y un cuadro 1368×486. Con `f1`: foto 1352×486 e iframe 1338×431 (`app-rect 27 259 1338 431`). **0 clip/tx/OVERFLOW** en los siete estados. Resuelve a absoluta la ruta de la app (`path.resolve(ROOT, …fotos[0].app.src)`) y falla si falta `tesis/0`. Excluye el ghost y los elementos colapsados al medir. |
| `gen_ept_shot.js` | Audita el **slide 9 (EPT)**: escribe `out/ept_shot.html` con un `#report` fuera de pantalla (`left:-9999px`). Cabecera 1408×92 (subtítulo de 2 líneas), cuerpo 1408×628, franjas lógica 1364×75 / central 1364×309 / resultado 1364×73 / recursos 1364×28; 3 tarjetas de 316×309 (anchos iguales 3/3), 4 nodos de lógica, 3 nodos de resultado, 7 ítems de recursos, logo y pie presentes. **0 clip/tx/OVERFLOW**. La franja central tiene **alto fijo de 309 px** (el 75 % de los 412 px anteriores) y el resultado esperado va **pegado a continuación** (sin `margin-top: auto`); los laterales Fundamento/Propósito la igualan con `align-items: stretch` (ver §27). Inyecta el logo y el pie (oculto sin pantalla completa) como `app.js`. |
| `png_stats.js` | Lee un PNG de Chrome (decodifica IDAT con `zlib`, sin dependencias) e informa de **cuántos colores distintos y qué porcentaje de píxeles pintados** hay en un rectángulo. Comprueba que el iframe cargó aunque su DOM sea de otro origen. La captura actual, con fondo sólido, da **7 980 colores y 32,8 % pintado** en `54 518 2676 862`. `uso: node png_stats.js <archivo.png> [x y w h]`; las coordenadas salen de `app-rect` en el reporte de `gen_slide7_shot.js`, multiplicadas por 2 por la escala de la captura. |
| `app_cdp.js` | Controlador Chrome/CDP de la app hermana, sin dependencias npm (WebSocket de Node 22). Captura errores JS, estilos calculados, colores NI y desborde horizontal. `--tab=pruebas --run` exige **52/52**; `--flow` recorre la evaluación y comprueba los gráficos; `--pdf` genera y revisa cuatro PDF con las bibliotecas reales; `--viewport --width=1338 --height=431` simula el tamaño interior actual de Fotografía 1. Copia de trabajo y perfil aislados por ejecución. |
| `gen_fase_probe.js` | Probe de **app real** (Chrome `--dump-dom`): clic real sobre las fases 3a/3b y sus imágenes (**nivel 2 3aimg/3bimg**), y el bloque **S7** del slide 7, que con la lámina en blanco comprueba el encabezado (`h2=RESULTADOS (2)`, subtítulo de la Fase 3), el cuerpo 1408×644 con `texto=""` y 0 etapas/0 flechas/0 paneles/0 secuencia, y que no queda foco. Debe ejecutarse con `*{transition:none !important;animation:none !important}`. Cuando el slide 7 tenga contenido accionable, el bloque S7 deberá ampliar bloques reales y **excluir la capa `scope-ghost`** (`!x.closest('.scope-ghost')`) al medirlos, si no cada bloque se cuenta dos veces. |
| `extract_er_tables.js` | Lee `ER.docx` (descomprime `word/document.xml` a `tools/tmp_er/`, ya borrado) y genera `presentacion-web/js/data/erTables.js` con las cinco tablas `ne, np, nc, nr, ni`. Limpia campos Zotero (`ADDIN ZOTERO…`) y el texto posterior a las tablas, y aplica correcciones menores de espaciado/erratas documentadas en el propio archivo. `node tools/extract_er_tables.js`. El `tono` (`green`/`red`) es decisión de diseño por severidad, no del documento. |
| `out/` | `map_dom.html`, `map_shot.html`, `heights.html`, `results_heights.html`, `res2_heights.html`, `res2_focos.html`, `res2_shot*.html`, `slide05_map.png`, `slide06*.png`, `slide07.png`, `slide07_f*.png`, `md_shot*.png`. |

Auditoría visual en Chrome (imprime el reporte en stdout):
```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu \
  --window-size=1408,760 --dump-dom "file:///D:/ejemplo/presentacion/tools/out/heights.html"
# y para el slide 6:
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu \
  --window-size=1408,760 --dump-dom "file:///D:/ejemplo/presentacion/tools/out/results_heights.html"
# y para el slide 7:
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu \
  --window-size=1408,720 --dump-dom "file:///D:/ejemplo/presentacion/tools/out/res2_heights.html"
```
> Objetivo del reporte del slide 6: **0 `clip`, 0 `textx-overflow`, 0 `OVERLAP`/`OVERFLOW`, holgura
> menor de ~25px en los tres paneles** (hoy 18/22/19).
>
> Objetivo del reporte del slide 7: **0 `clip`, 0 `tx`, 0 `frame OVERFLOW`** en el **reposo** y
> en los **seis estados de foco** (ne/np/nc/nr/ni/f1). Valores actuales en reposo: `.slide-head`
> 1408×76, `.rs2-body` 1408×644 con un solo hijo (`.rs2-cols`), banda del flujograma 1368×118,
> banda de fotos 1368×486, pantalla de cuadros 1368×0 y `foco -`. Con un cuadro abierto:
> banda de fotos 1368×0, pantalla 1368×486, un solo `.rs2-tbl` visible, 7 nodos de 166×118 y
> ghost presente. Ojo: el harness debe desactivar también las **animaciones** (ver la trampa 8
> de la sección de errores), o la medición se hace durante el `fadeIn` y aparece un
> `frame OVERFLOW bottom` falso de 6px.
>
> Objetivo del reporte del slide 5: **0 `clip`, 0 `textx`, 0 `OVERLAP`/`OVERFLOW` en los 9
> estados**; en foco de rama, la rama enfocada usa todo el ancho del mapa (`1406x559` aprox.)
> con `--mm-fs 2`, centrada verticalmente.

> Todo lo temporal de sesiones anteriores vivía en `%TEMP%\opencode`. Ya está migrado a
> `tools/`: **no dependas de `%TEMP%`**.

---

## 1a. Proceso de trabajo estándar (cómo continuar cada cambio)

Guía operativa para las futuras sesiones en **este** equipo. Reglas de oro:
**verificar todo al terminar**, **medir con Chrome antes de afirmar**, y **dejar
documentado lo que se hizo** (una sección nueva numerada en este mismo archivo,
con qué se quería / qué se hizo / verificación / capturas para revisar a ojo).

### Flujo de un cambio de código (app de presentación)

1. **Leer antes de tocar.** Cada slide tiene un renderer (`js/slides/slide0N*.js`)
   alimentado por datos (`js/data/*.js`) y estilos (`css/styles.css`, un bloque por
   slide, ver `/* ==== DIAPOSITIVA N ...==== */`). Seguir su patrón.
2. **Cambiar** lo mínimo. Convenciones del proyecto: **sin comentarios** en el
   código salvo que expliquen una decisión no obvia; textos en español; clases BEM-ish;
   las imágenes van como `<img src="assets/…">` (el CSS **no** usa `url()`); las
   paletas usan variables `--red`/`--green`/`--ink`/`--gray` o los hex del ejemplo
   (`#262626`, `#006E49`, `#C0242A`, `#4C4A4F`, `#595959`).
3. **Sincronizar las autoverificaciones** en `tools/focus_check.js` (jsdom) cuando
   cambies DOM/clases/CSS/recuentos: añade `has(…)` y actualiza las cantidades
   (total = nº de `has()`; avísalo en la sección nueva del doc). El objetivo es
   **54/54 (map) + 654/654 (focus) + `TODO OK`** de `verify-all.cmd`.
4. **Verificar:** `cd tools && verify-all.cmd` (o `reanudar.cmd` para entorno+git).
   Nunca terminar al rojo.
5. **Auditoría de layout real** (cuando el cambio afecte a la geometría): crear un
   **harness temporal** `presentacion-web/_probe.html` que inyecte
   `css/styles.css` + `js/data/*` + el renderer en un `.slide-frame`, medir rectángulos
   con `--dump-dom` en Chrome headless y **borrarlo después** (`rm`). Detalles y
   trampas: añade `animation: none !important` (el `fadeIn` mueve 6px y da
   `FRAMEOV` falso), y respeta el `zoom: 2` real del marco (las ventanas de captura
   son **2816×1440** normal y **2816×1600** en pantalla completa; divide por 2 para
   obtener CSS). Comando patrón:
   `"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --hide-scrollbars --run-all-compositor-stages-before-draw --virtual-time-budget=5000 --force-device-scale-factor=1 --window-size=2816,1440 --user-data-dir=%TEMP%\covN --screenshot=… --dump-dom file:///D:/ejemplo/tes/presentacion-web/_probe.html`
   (use `--user-data-dir` distinto por ejecución para evitar bloqueos de perfil).
6. **Captura de artefactos** en `tools/out/*.png` para que el usuario revise a ojo.
7. **Documentar** en `CONTINUIDAD.md`: nueva sección numerada + actualizar el
   `## 0. TL;DR` (estado, cifras y capturas) y el `tools/focus_check.js` si cambia el total.

### Recursos e imágenes

- Los **originales** viven en la raíz del repo (`logo.bmp`, `LOGOCARATULA.png`,
  `logo-inf.png`, `fotos/`, tablas/imágenes de los `.docx`, …). Los de la
  presentación van en `presentacion-web/assets/`.
- **Conversión blanco→transparente**: los BMP/PNG con fondo blanco se re-encodifican
  a PNG RGBA con un script temporal node/zlib (patrón `bmp2png.js`/`png2png.js`,
  `--white=alpha`). `LOGOCARATULA.png` ya era RGBA (no hizo falta convertir).
- **Extraer de Office**: PowerPoint/Word = ZIP; se descomprime con PowerShell
  `Expand-Archive` a `%TEMP%\opencode\…` y se copian `ppt/media/*` o
  `word/media/*`. Ej.: `cover-abstract.png` salió de `Ejemplo.pptx` (`ppt/media/image5.png`,
  tira rojo/verde sobre transparente, paleta de la plantilla).
- Las conversiones y extracciones terminadas se borran de `%TEMP%` (no depender de él).

### Geometría/base de diseño

- Lámina base **1408×720 CSS** (diseño), marco con `zoom: 2` → las capturas salen a
  **2816×1440** y se miden /2. Pantalla completa: el marco crece a **800px**
  (ventana 2816×1600) y el pie institucional ocupa la banda inferior de 80px sin
  desplazar el contenido (los cuerpos `flex:1` absorben).
- Cualquier proporción geométrica que quieras replicar de `Ejemplo.pptx`:
  EMU→CSS con `k = 1408 / 12192000` (anchura); el slide de ejemplo es 16:9 con
  textos en pt (pt × 96/72 = px a 96dpi, y ×1.1 por pasar de 1280 a 1408 de ancho).

### Reglas del asistente heredadas

- No se hacen **commits git** salvo que el usuario lo pida explícitamente.
- El asistente **no puede leer imágenes**: mide geometría con Chrome y deja
  capturas para la revisión visual del usuario.
- Si una instrucción de estilo es ambigua entre dos lecturas plausibles, se toma
  la que reproduzca el comportamiento/fuente de referencia (p. ej. `Ejemplo.pptx`)
  y se anota la decisión para que el usuario la valide.

---

## 2. Estructura del proyecto

```
D:\ejemplo\presentacion\
├─ presentacion-web\            # la presentación (abre index.html)
│  ├─ index.html                # carga icons + 6 data + 6 slides + app.js
│  ├─ assets\
│  ├─ css\styles.css            # tokens + .md-* (bloques 1-2) + .mm-* (bloque 3) + .rs-* (slide 6)
│  └─ js\
│     ├─ icons.js               # window.Icons.svg(nombre, px)
│     ├─ app.js                 # shell, navegación, escalado
│     ├─ components\justificationCard.js
│     ├─ data\                  # un archivo por slide (contenido puro, sin HTML)
│     │  ├─ thesisData.js  problematizationData.js  objectivesData.js
│     │  ├─ theoriesData.js  methodologyData.js      ← slide 5
│     │  └─ resultsData.js                           ← slide 6
│     └─ slides\
│        ├─ slide01Cover.js … slide04Theories.js
│        ├─ slide05Methodology.js                    ← render del bloque 3
│        └─ slide06Results.js                        ← 3 columnas + secuencia
├─ tools\                       # harness de verificación (NO ignorar en git)
├─ CONTINUIDAD.md               # este archivo
├─ pob1.md                      # especificación de contenido del bloque 3
└─ resultados.md                # especificación de contenido del slide 6
```

**Separación de responsabilidades (no romperla):**
- `js/data/*.js` = **solo datos**. Sin HTML, sin estilos.
- `js/slides/slide05Methodology.js` = **solo estructura y geometría**.
- `css/styles.css` = **todo el aspecto visual**.

### Especificaciones y borradores
| Archivo | Estado |
|---|---|
| `pob1.md` | Especificación de **contenido** del bloque 3 (5 fases, textos, ruta, nota). Vigente. |
| `resultados.md` | Especificación de **contenido del slide 6** (3 bloques, tablas 17 y 18, secuencia). Vigente. |
| `Resultados.docx` | Fuente original de `resultados.md`; no editar. |
| `pob.md` | Especificación anterior de 4 macro-ramas. Superada. |
| `pob-m.md` / `pob-m.png` | Mockup anterior. Superado. |
| `bloque3-5.md`, `diap4-1.md`, `diap5_met.md`, `met.docx`, `Obj.docx`, `teor.docx`, `probl.docx` | Borradores previos. |
| `instrucciones.md`, `instrucciones1.md`, `obj-hip.md`, `backup-presentacion-web.md` | Contexto general del proyecto. |

> Nota: `pob1.md` sugería otros colores y un centro azul. **Manda la última instrucción del
> usuario** (ver §4), no `pob1.md`.
>
> Nota: `resultados.md` §3 pide el título «TRABAJO DE CAMPO Y RESULTADOS» y su propia paleta
> (`#087A59`/`#C9252D`). **Manda el usuario**: título «RESULTADOS» y los tokens del deck
> (`--green #006e49`, `--red #c0242a`), con tintes claros `#eaf6f1` / `#fcf0f1` para los chips.
> Lo que sí se respeta de la especificación: los 3 bloques 30/33/37, los conteos, las dos
> tablas como extractos, los mensajes por fase, la conexión Fase 1 → Fase 2 y la barra de
> secuencia. **No se incluyen** códigos de riesgo (§7.1, §8.1, §21).

### Iconos disponibles (`window.Icons`)
`balance book building check chevLeft chevRight clipboard compress downArrow expand flag flask
hardhat pin search target trend user users wrench`
El slide 5 usa: `trend` (centro), `book`, `clipboard`, `building`, `target`, `check` (fases) y
`users` (subbloque de población). El slide 6 usa `building` (bloque 1), `hardhat` (bloque 2),
`clipboard` (bloque 3), `search` (contexto de riesgo) y `chevRight` / `downArrow` (conectores).
**No inventar nombres**: `Icons.svg` no valida y dibuja vacío.

---

## 3. Tokens y tipografía (no cambiar sin motivo)

```css
--ink:#262626  --gray:#4c4a4f  --mid:#595959  --light:#a8a8a8  --line:#e0e0e0
--red:#c0242a  --green:#006e49  --bg:#e8e8ea
--font: Arial, "Helvetica Neue", Helvetica, sans-serif
--font-title: "Arial Black", "Helvetica Neue", Arial, sans-serif
```
- Paleta tomada de `Ejemplo.pptx` (verificado descomprimiendo el .pptx). **Naranja y violeta
  están eliminados**: no reintroducirlos ni como tokens ni como clases.
- Todo el deck (no solo el slide 5) se normalizó a esta paleta.
- El slide es de **1408px de ancho fijo** con `zoom`; los tamaños del mapa son px absolutos.

---

## 4. Diseño actual del bloque 3 (slide 5)

Panel único `.md-panel--mapa` de **438px** con: cabecera (34px) + mapa (378px) + banda de
ruta/nota (24px). El panel está debajo de `.md-top`, que contiene los bloques 1 (enfoque) y
2 (estructura metodológica / cinco fases).

### 4.1 Composición (decidida por el usuario)
```
┌──────────────────────────┬───────────┬──────────────────────────┐
│ FASE 1  (verde)  550×124 │           │ FASE 2  (rojo)   550×124 │
│                          │  CÍRCULO  │                          │
│                          │   NEGRO   │                          │
├──────────────────────────┤   240×240 ├──────────────────────────┤
│ FASE 4  (rojo)   550×124 │  centro   │ FASE 3  (verde)  550×124 │
│                          │  x = 683  │                          │
├──────────────────────────┴───────────┴──────────────────────────┤
│              FASE 5 (verde)  500×120 centrada                   │
└─────────────────────────────────────────────────────────────────┘
```
- **Círculo central** `.mm-center`: 240×240, **centrado en el eje horizontal del bloque 3**
  (`CX = MW/2 = 683`), fondo **negro** `radial-gradient(#262626→#000)`, borde 5px `#4c4a4f`,
  icono `trend`, título `METODOLOGÍA · / POBLACIÓN Y / MUESTRA` + subtítulo.
  **Negro por instrucción explícita del usuario** (aunque `pob1.md` sugiera azul).
- Posiciones (`pos` en `methodologyData.js` → es la **única fuente de verdad**):
  `lt`=F1 (0,0) · `rt`=F2 (816,0) · `rb`=F3 (816,128) · `lb`=F4 (0,128) · `cb`=F5 (433,258).
- **Colores por fase (confirmados por el usuario):** **alternan** — F1 verde · F2 **rojo** ·
  F3 **verde** · F4 rojo · F5 verde. Coinciden con los colores del **bloque 2** (`phases`), que ya
  traía esa alternancia, y la **ruta** la replica (Marco normativo verde → Instrumentos rojo →
  Diagnóstico verde → ART y priorización rojo → Validación verde).
- **Fase 5 acortada a 500px**: con 550px invadía 6px los bloques de las fases 3 y 4.

### 4.2 Anatomía de cada bloque
```
.mm-rama
├─ .mm-rhead        nº + título + subtÍtulo (con los CHIPS dentro de la misma línea) + icono
├─ .mm-subs         dos subbloques lado a lado
│  ├─ .mm-sub--a    "Población y muestra" (icono users) + 4 ítems P/M/Mt/C
│  └─ .mm-sub--b    "Métodos, Técnicas e Instrumentos" (solo texto) + 3 ítems M/T/I
└─ .mm-prod         badge "Prod." + producto de la fase
```
- **Insignias**: `.mm-lg` = 20 de tipo **P/M/Mt/C** (4 por bloque) + 15 de tipo **M/T/I**
  (3 por bloque) = 35 en total. Los rótulos con dos puntos (`Población:`, `Método:`…) están
  **prohibidos**: hay checks que los rechazan.
- **Los rótulos de subbloque son títulos completos**, no letras: `Población y muestra` y
  `Métodos, Técnicas e Instrumentos` (10 cabeceras en total, 2 por bloque).
- **Muestreo** dice siempre **`Intencionada`**; check que prohíbe `intencional`.
- **Los chips viven dentro de la línea de subtítulo** (`.mm-rchips` dentro de `.mm-rtt span`),
  no en una fila propia: ahorra ~14px por bloque y fue clave para cerrar el alto disponible.
- **Ruta** (banda oscura, 23px): Marco normativo (verde) → Instrumentos (**verde**) →
  Diagnóstico (rojo) → ART y priorización (**rojo**) → Validación (verde).
  La **nota** `.mm-note` (cursiva 7.4px) va en la **misma banda** que la ruta.
  Nota exacta: `* 106 (edificación) + 83 (infraestructura): aplicaciones piloto; evidencia de campo, no universo estadístico.`
- **Conectores**: 5 curvas Bézier SVG (stroke 3px) con punto de unión (r=4). Las 4 laterales
  unen el círculo con el borde vertical del bloque; la de la **fase 5 es vertical**
  (`cb` → `curva(CX, CY+CR, CX, b.y, c)`).

### 4.3 Letra proporcional al recuadro
Cada `.mm-rama` emite `--mm-fs` en su `style`:
```js
escala(b) = clamp(0.78, 1.06, min(b.w / COLW, b.h / COLH))
```
Todas las tipografías internas usan `calc(<base>px * var(--mm-fs))`, de modo que el bloque 5
(más bajo) escribe ~9% más pequeño **solo**. Hoy: 4 bloques con `1.000` y F5 con `0.969`.
Un check valida que sigan siendo 4 × 1.000 + 1 menor.

### 4.4 Geometría exacta (constantes al inicio de `slide05Methodology.js`)
| Constante | Valor | Significado |
|---|---|---|
| `MW`, `MH` | 1366, 378 | mapa |
| `COLW`, `COLH` | 550, 124 | bloques laterales |
| `ROW2` | 128 | `y` de la segunda fila |
| `RX` | `MW - COLW` = 816 | `x` de la columna derecha |
| `FW`, `FH` | 500, 120 | bloque de la fase 5 |
| `FX`, `FY` | 433, 258 | fase 5 centrada bajo el círculo |
| `CX`, `CY`, `CR` | 683, 126, 120 | círculo (240 de diámetro) |

Densidad CSS actual (ajustada hasta 0 overflow y una línea por ítem): listas **9px**/1.12
con `padding:.5px 0`, título de bloque 10.4px, subtítulo 8.6px, chips 8.2px, cabecera de
subbloque 8.8px, insignia 19×13px, ruta 9.4/9px, nota 7.4px, gap interno del bloque 1px,
padding del bloque `2px 7px 3px`.

### 4.5 Sangría francesa y una línea por ítem
- Todas las insignias inline miden **19px de ancho fijo** (también `Mt`), así **el texto de
  cada valor arranca siempre en el mismo x** dentro del bloque.
- `.mm-list li > span:not(.mm-lg) { flex: 1 }` alinea las líneas si un texto llegara a envolver.
- Los **35 valores se sintetizaron a una sola línea** (check: ninguno pasa de 50 caracteres).
  Al agregar o editar un valor, hay que mantenerlo **≤ 50 caracteres**.

---

## 5. Reglas invariables (con check asociado)

| Regla | Check en `map_check.js` |
|---|---|
| 5 bloques, 5 conectores, 10 subbloques, 10 listas | estructura |
| Posiciones `lt/rt/rb/lb/cb` exactas | `RAM_X` (actualizar si mueves un bloque) |
| Círculo en `left:563px;top:6px;width:240px` | centrado horizontal |
| Colores `green,red,green,red,green` (alternos) | color por fase |
| 4 escalas `--mm-fs` = 1.000 + 1 menor | letra según recuadro |
| Fase 5 más estrecha y centrada, sin invadir | geometría de F5 |
| Ningún valor de ítem > 50 caracteres | una línea por ítem |
| 35 insignias `.mm-lg` | P/M/Mt/C + M/T/I |
| Títulos `Población y muestra` / `Métodos, Técnicas e Instrumentos` completos | rótulos |
| `Intencionada` y nunca `intencional` | muestreo |
| Ruta verde,rojo,verde,rojo,verde + nota exacta | ruta y nota |
| Sin `Selección crítica`, sin naranja/violeta, sin mermaid | higiene |
| Bloques 1 y 2 intactos; bloque 4 fusionado en el 3 | no regresión |
| Las 5 insignias del bloque 2 dicen `Fase N` (pastilla, no círculo) | rótulo de fase |
| Las 5 insignias del bloque 2 dicen `Fase N` (pastilla, no círculo) | rótulo de fase |
| Sin claves `map` ni `population` en los datos | higiene |

---

## 6. Recetas

### Cambiar un texto del diagrama
1. Editar `presentacion-web/js/data/methodologyData.js` (**solo datos**).
2. Mantener el valor **≤ 50 caracteres** si va junto a una insignia.
3. `cd tools && verify-all.cmd shot`.
4. Abrir el reporte de `out/heights.html` y confirmar `items 35 una-linea 35`, `list0`,
   sin `textx-overflow` ni `box OVERLAP`.

### Cambiar la geometría
1. Editar las constantes de `slide05Methodology.js` (§4.4).
2. **Actualizar `RAM_X` y la posición del círculo en `tools/map_check.js`** (si no, el check falla).
3. Si se cambia `MH`, reajustar `COLH/ROW2/FH/CY`: el panel no tiene holgura vertical
   (2 borde + 34 cabecera + mapa + 24 ruta = 438 exactos).
4. Verificar con la auditoría: `clip 0`, `inner0`, `subs0`, `list0`, sin `box OVERLAP`.

### Cambiar colores
Solo hay dos: `--red` y `--green` en `:root`. Para cambiar el color de una fase, tocar
`color` en `methodologyData.js` y, si aplica, el token correspondiente de `ruta`.

### Cambiar un texto del slide 6
1. Editar `presentacion-web/js/data/resultsData.js` (**solo datos**; la fuente es `resultados.md`).
2. Si el texto vive en una tabla, no alargar más de lo que cabe: el ancho de las columnas se
   fija con `colw` (px) y la columna de texto se queda con el resto.
3. `cd tools && verify-all.cmd`.
4. Auditar `out/results_heights.html` con Chrome (`--dump-dom`): sin `clip`, sin `textx-overflow`,
   sin `OVERLAP`/`OVERFLOW`, y holgura por panel menor de ~25px.
5. Si creció demasiado el bloque 3 (`.rs-tbl td`), el ancho de la columna de texto se reduce solo:
   la holgura del panel 2 es la que avisa.

### Foco por clic (slide 6)
Los tres bloques son accionables: `data-focus="1|2|3"` + `role="button"` + `tabindex="0"`.
Al enfocar, `.rs-body--fN` hace que ese panel crezca a `flex: 1 1 100%` y los otros dos se
repliegan a `flex: 0 0 0` con `opacity: 0`; además sube la tipografía con `--rs-k` (1.22 en
bloques 1-2, 1.12 en el 3).

| Pieza | Dónde |
|---|---|
| `data-focus` / `role` / `tabindex` | `js/slides/slide06Results.js` (`panel()`) |
| Estado del foco | `js/app.js` (`FOCUS_SCOPES`, `setScopeFocus`, `toggleFocus`, `onFrameClick`, `onKey`) |
| Reglas `.rs-body--fN` y `var(--rs-k)` | `css/styles.css` (bloque «Foco por clic») |
| Texto de la pista | `resultsData.js` → `ui.hint`, se pinta en `.rs-hint` (barra de secuencia) |

Reglas que **no** hay que romper:
- `.rs-cols` necesita `min-height: 0` en modo foco. Sin eso, los paneles colapsados (ancho 0)
  siguen aportando su altura mínima y la lámina crece a miles de píxeles.
- Toda `font-size` del slide 6 va como `calc(Npx * var(--rs-k, 1))`; si se añade una regla nueva
  con un tamaño fijo, el bloque enfocado quedará con letra más pequeña que el resto.
- `.rs-glab` (rótulo de grupo) usa `width: calc(112px * var(--rs-k, 1))`: si se ensancha la
  columna hay que revisar que los chips no sumen una fila (`chips0 filas 3` en reposo).
- `verify-all.cmd` llama a `focus_check.js` (jsdom, 114 checks) y captura los 10 estados:
  `out/slide06.png` + `out/slide06_foco1-3.png` + `out/slide06_foco1a-1b.png` +
  `out/slide06_foco2a-2b.png`.
- Para capturas headless fiables usar
  `--run-all-compositor-stages-before-draw --virtual-time-budget=5000`; sin el primero las
  imágenes salen a medio pintar.

### Bloque 1 «Procesos por actividad»: sub-bloques ampliables
Cada grupo `rs-group` (Infraestructura / Edificación) es un sub-bloque accionable:
`data-focus="1a|1b"` + `role="button"` + `tabindex="0"` (+ icono `expand` en `.rs-gcount`).
Al hacer clic, `.rs-body--f1a/f1b` muestra una vista ampliada del sub-bloque: **izquierda** =
la información del sub-bloque original agrandada (total + nombre + unidad + lista de procesos
con `--rs-k: 1.22`); **derecha** = la imagen del sub-bloque (`assets/procesos1.png`
Infraestructura, `assets/procesos2.png` Edificación). Un segundo clic (o `ESC`) vuelve a la
pantalla principal. Claves de implementación (mismo patrón que el bloque 2):
- Las claves `1a/1b` están en `FOCUS_SCOPES` de `js/app.js` (scope `rs-body`).
- La vista ampliada se pre-renderiza en `slide06Results.js` como `.rs-subview--1a/1b`
  (oculta en reposo con `display: none`; por eso el **estado normal no cambia**). Su contenedor
  lleva `data-focus` para que un segundo clic cierre el foco.
- Datos: `resultsData.js` → `procesos.groups[].image` (una imagen por sub-bloque).
- Imágenes reales en `presentacion-web/assets/`; `gen_results_heights.js` las copia a
  `tools/out/assets/` para las capturas headless.
- Si la imagen no existe, el `onerror` delega en `window.RS_FIG_FALLBACK(img)` (aviso
  `.rs-pic-missing`).
- El harness `gen_results_heights.js` audita también `1a/1b` (`FOCO 1a/1b`) y genera
  `results_shot_f1a/f1b.html`; en reposo el bloque 1 coincide con el resto de paneles
  (`405x576 k=1`).

### Bloque 2 «Riesgos asociados por actividad»: sub-bloques ampliables
Cada tarjeta `rs-risk` (Infraestructura / Edificación) es un sub-bloque accionable:
`data-focus="2a|2b"` + `role="button"` + `tabindex="0"`. Al hacer clic, `.rs-body--f2a/f2b`
muestra una vista ampliada del sub-bloque: **izquierda** = la información del sub-bloque
agrandada (total + barra seguridad/complementarios + leyenda + grupos de riesgo + nota);
**derecha** = la imagen del sub-bloque (`assets/riesgos2.png` Infraestructura,

`assets/riesgos1.png` Edificación). Un segundo clic (o `ESC`) vuelve a la pantalla principal.
Claves de implementación:
- Las claves `2a/2b` están en `FOCUS_SCOPES` de `js/app.js` (scope `rs-body`).
- La vista ampliada se pre-renderiza en `slide06Results.js` como `.rs-subview--2a/2b`
  (oculta en reposo con `display: none`; por eso el **estado normal no cambia**). Su contenedor
  lleva `data-focus` para que un segundo clic cierre el foco.
- Datos: `resultsData.js` → `riesgos.series[].image` (una imagen por sub-bloque).
- Si la imagen no existe aún, `window.RS_FIG_FALLBACK(img)` (definido en `slide06Results.js`)
  la sustituye por el aviso `.rs-pic-missing`; se activa vía `onerror` del `<img>`.
- El harness `gen_results_heights.js` audita también `2a/2b` (`FOCO 2a/2b`); en `results_heights.html`
  el reposo y `== RESTAURADO ==` deben salir idénticos (p. ej. `panel0 405x576 k=1`).

### Bloque 3 «Aplicación de instrumentos»: fases ampliables (Fase 1 `ref-norm.png`, Fase 2 `c-cheq.png`)
Cada tarjeta `rs-fase` (Fase 1 verde / Fase 2 roja) es un sub-bloque accionable:
`data-focus="3a|3b"` + `role="button"` + `tabindex="0"`. Al hacer clic, `.rs-body--f3a/f3b`
agranda el panel w37 a todo el ancho (`flex: 1 1 100%`), colapsa los paneles 1-2, oculta la
otra fase y el conector `.rs-link`, eleva `--rs-k` a **1.22** y resalta el panel con un anillo
(`0 0 0 2px var(--green)` en 3a, `var(--red)` en 3b) más sombra, con el **ghost** atenuado
(`0.12`) detrás. Al ampliar, cada fase **oculta su Tabla (17/18) y su contenido** (`.rs-thead`,
`.rs-ctx`, `.rs-tbl`) y en su lugar muestra su imagen — **`assets/ref-norm.png`** (Fase 1) y
**`assets/c-cheq.png`** (Fase 2) — en la figura `.rs-fpic` (`display:none` en reposo). Un
segundo clic (o `ESC`) vuelve a la pantalla principal y restaura la Tabla. Claves de
implementación:
- Las claves `3a/3b` están en `FOCUS_SCOPES` de `js/app.js` (scope `rs-body`).
- La figura `.rs-fpic` se pre-renderiza dentro de la propia fase en `slide06Results.js` solo si
  `f.image` existe (datos: `resultsData.js` → `fase[0].image = 'assets/ref-norm.png'`,
  `fase[1].image = 'assets/c-cheq.png'`); su `data-focus` es `key + 'img'` (`3aimg`/`3bimg`);
  `display:none` en reposo ⇒ **el estado normal no cambia**.
- Reglas en `css/styles.css`: sección «Bloque 3 · sub-bloques de instrumentos» tras las de 2a/2b.
- El anillo verde/rojo (`box-shadow`) no debe ir en `transition` por defecto (se verifica sin
  transiciones en el probe). El clue original `.rs-panel` conserva su sombra; el anillo se
  aplica solo en `.rs-body--f3a/f3b/f3aimg/f3bimg .rs-panel--w37`.
- Harness: `gen_results_heights.js` audita `3a/3b/3aimg/3bimg` (`FOCO 3a/3b/3aimg/3bimg`:
  `visibles 1`, `0 clip`, `holgura` no negativa); `verify-all.cmd` captura
  `out/slide06_foco3a/3b/3aimg/3bimg.png`; `tools/gen_fase_probe.js` prueba la app real
  (clic → 3a/3b: tabla oculta + imagen visible + ghost 0.12 + `w37 ≈ 1348`; re-clic restaura
  `499`; F2 → anillo rojo).
- **Imágenes**: originales solo en la raíz del repo (`D:\ejemplo\tes\ref-norm.png`,
  `D:\ejemplo\tes\c-cheq.png`); copiadas a `presentacion-web/assets/` y a `tools/out/assets/`
  (lo hace `gen_results_heights.js`). Dimensiones: ref-norm 1282×861, c-cheq 955×856.

### Nivel 2 de la imagen (3aimg / 3bimg): `ref-norm.png` y `c-cheq.png` a máximo tamaño de la pantalla
Sobre la Fase 1 ampliada (3a), la **imagen es clicable** (`<figure class="rs-fpic">` lleva
`data-focus="3aimg"` + `role="button"` + `tabindex="0"`; lo mismo para la Fase 2 con
`data-focus="3bimg"`). Al hacer clic:
- `.rs-body--f3aimg` / `.rs-body--f3bimg` proyectan la imagen en una **caja absoluta 1392×628**
  (8px de margen sobre `.rs-body`, que mide 1408×644) con `object-fit: contain` sobre un
  **fondo blanco `#ffffff` con lavados muy tenues** de verde y rojo
  (`radial-gradient` `rgba(0,110,73,.09)` esquina sup-izq + `rgba(192,36,42,.08)` esquina
  inf-der), anillo **verde** (3aimg) / **rojo** (3bimg) y `cursor: zoom-out`; el resto de la
  lámina queda invisible (`.rs-cols { visibility: hidden }`; se reaparece la figura con
  `visibility: visible`).
- **Clic de nuevo → vuelve a la vista 3a/3b**; **otro clic sobre la Fase 1/2 → pantalla
  inicial**. Desde 3a/3b: **clic dentro de la imagen → máximo tamaño**; **clic fuera de la
  imagen** (p. ej. el encabezado/texto de la fase) **→ pantalla original**, igual que ESC.
  Claves:
- La lista `parents: { '3aimg': '3a', '3bimg': '3b' }` en `FOCUS_SCOPES` (`app.js`) define el
  nivel padre; `closeOrStep()` se usa al cerrar (clics fuera / `ESC` / `item===scope`) para
  volver al padre en vez de a la pantalla inicial; `toggleFocus` hace igual al re-clicar el
  nivel actual.
- `f3aimg/f3bimg` heredan todas las reglas de `3a/3b`: colapso de paneles (`flex: 0 0 0`),
  ocultar la Tabla 17/18 (`thead/ctx/tbl`), `fhead/ftext/fmsg` y `figcaption`, y
  **`--rs-k: 1.22`**.
- **Imprescindible**: `.rs-body--f3aimg .rs-cols, .rs-body--f3bimg .rs-cols { flex: 1 1 auto;
  min-height: 0; }` — sin `min-height: 0` el contenido no colapsa y la fila crece a ~1086px
  (misma lección que 3a).
- `focus_check.js` prueba la cadena completa de ambas fases (clic fase→3a/3b, clic imagen→
  3aimg/3bimg, clic→3a/3b, ESC→3a/3b, clic fase→reposo). `gen_results_heights.js` audita
  `3aimg` y `3bimg` (`FOCO 3aimg/3bimg`: `visibles 1`, `panel0 1348x591`, 0 clip/0 overflow).
  `verify-all.cmd` captura `out/slide06_foco3aimg.png` y `out/slide06_foco3bimg.png`.

### Foco por clic (slide 5)
La interacción sigue el **mismo motor** que el slide 6, generalizado en `js/app.js` para dos
scopes (`md-body` y `rs-body`, lista `FOCUS_SCOPES`). Al hacer clic:

- **Bloques 1 y 2** → `.md-body--f1` / `md-body--f2`: el bloque para y se **proyecta centrado**
  usando todo el ancho de la lámina (quita el padding lateral de `.md-body`, `padding: 6px 0 12px`)
  con el alto ajustado al contenido (`height: auto`, ≈1408×242 / 1408×257) y tipografía al
  **200%** (`--md-k: 2`).
- **Ramas del bloque 3** (`lt/lb/rt/rb/cb`) → `.md-body--f{pos}`: `.md-top` se repliega, el panel
  mapa crece a todo el alto, `.mm-map` pasa a `flex: 1` (≈1406×559) y la rama enfocada ocupa
  **todo el ancho** del mapa con `width: 100% !important`, `height: auto !important`
  (alto al contenido, ≈1406×200-225), escala tipográfica al **200%** (`--mm-fs: 2 !important`) y
  quedan **centradas verticalmente** (`top: 50% !important; transform: translateY(-50%)`);
  las demás ramas, el círculo y el SVG se ocultan.

| Pieza | Dónde |
|---|---|
| `data-focus` / `role` / `tabindex` (bloques 1-2) | `js/slides/slide05Methodology.js` (`enfoqueBlock`, `phasesBlock`) |
| `data-focus` / `role` / `tabindex` (ramas) | `slide05Methodology.js` → `ramaHtml()` (usa la `pos` del dato) |
| Estado del foco (compartido) | `js/app.js` (`FOCUS_SCOPES`, `setScopeFocus`, `toggleFocus`, `onFrameClick`, `onKey`) |
| Reglas `.md-body--f*`, `var(--md-k)`, `.mm-rama` en foco | `css/styles.css` (bloque «Ampliación por clic») |
| Fondo degradado del área ampliada | `styles.css`: `radial-gradient` + `linear-gradient` sobre `.md-top` (bloques) o `.md-panel--mapa` (ramas) |
| Transición de agrandamiento/achicamiento | `styles.css` («Transiciones»): `flex-basis/grow/shrink`, `width`, `height`, `top`, `left`, `transform`, `gap`, `opacity` |
| Sombra de la pantalla original | `js/app.js` (`showGhost`/`hideGhost`/`buildGhost`) + `styles.css` (`.scope-ghost`, `.scope-ghost.is-on`, `.scope-ghost-inner`) |
| Pistas | `methodologyData.js` → `ui.{hint, hintRama, cerrar}`; se pintan `.md-hint` / `.md-hint--off` en cada cabecera |

### Sombra de la pantalla original (ghost)
Al ampliar cualquier bloque se muestra detrás, **atenuada**, la lámina original completa.
- Mecánica: `app.js` clona los nodos del layout en reposo (slide 5 → `.md-top` + `.md-panel--mapa`;
  slide 6 → `.rs-cols`) dentro de `.scope-ghost`, una capa `position:absolute` del tamaño exacto
  de `.md-body`/`.rs-body` (`offsetLeft/offsetTop/offsetWidth/offsetHeight`), `z-index: 0`,
  `pointer-events: none`, `aria-hidden`/`inert`, con `opacity` de 0 → **0.12** al activar el foco
  (muy atenuada, para no competir con el bloque ampliado).
- El `inner` replica el `padding`/`gap` en reposo de cada body (constantes `GHOST_CFG` en `app.js`)
  para que los clones caigan **en las mismas coordenadas** que el layout original; como los clones
  viven fuera de `.md-body--f*`/`.rs-body--f*`, no reciben `--md-k`/`--rs-k` de foco y quedan a
  escala 1 (estado reposo).
- En el foco de **ramas** (bloque 3 del slide 5) el panel mapa y el `.mm-map` pasan a
  `background: transparent` (`styles.css`), porque su blanco opaco cubría toda la lámina y tapaba
  la sombra; así la sombra se ve alrededor de la rama ampliada igual que en los bloques 1-2.
- Los clones llevan los `id` y `tabindex` removidos y `button` con `tabindex="-1"` (no interfieren
  con teclado/ARIA). El contenido real se eleva con `.md-body, .rs-body { position: relative; z-index: 1; }`.
- El ghost se **crea y destruye** con cada apertura/cierre del foco (`hideGhost` en
  `setScopeFocus`), así nunca contamina los contadores `[data-focus]` del estado normal.
- El fondo del ghost replica el degradado de la pantalla original
  (`radial-gradient` verde/rojo 5%, `#fff`).

Reglas que **no** hay que romper:
- El **estado normal debe quedar idéntico**: `--md-k` y `--mm-fs` valen 1 en reposo y todos los
  `font-size` del slide 5 van como `calc(Npx * var(--md-k, 1))` (ramas: `var(--mm-fs)`).
- El bloque ampliado usa **`flex: 0 0 100%`** (NO `width: 100%`). La base `flex: 1` de reposo
  tiene `flex-basis: 0%`, así que `0` → `100%` **interpola** y la transición anima el
  crecimiento; con `width: 100%` el salto era instantáneo.
- El panel ampliado lleva `height: auto` (alto al contenido) y `.md-top` en foco usa
  `flex: 1 1 100%` (base `180px` → `100%`, ambas porcentuales/interpolables).
- Las ramas se identifican por **`[data-focus="lt"]`**, **no** por clases `mm-rama--lt` (esas
  clases indican el color: `mm-rama--green/red`). Los selectores de foco usan `data-focus`.
- `.md-top` y `.md-panel--mapa` colapsados necesitan `min-height: 0` / `min-width: 0`
  (misma lección que `.rs-cols`).
- `focus_check.js` cubre los 7 objetivos del slide 5 con clic, teclado, ESC y clic fuera
  (incluye checks del degradado y de `flex-grow .35s`).
- El harness de geometría (`gen_heights.js`) audita los 9 estados; capturas `out/md_shot*.png`.
- El harness fuerza `transition: none` para medir **estados finales**; las transiciones solo
  viven en la app real (no alteran la geometría auditada).
- Ver `heights.html` `== FOCO {1,2,lt,lb,rt,rb,cb} ==`: objetivo `visibles 1`, `0 clip/0 textx`,
  en bloques `panel0 1408x242/257` (alto al contenido) y en ramas `ramaN 1406x200-225 fs2`
  centrada dentro del mapa (`1406x559`) sin desbordes.

---

## 7. Cómo leer el reporte de `heights.html`

| Métrica | Significado | Objetivo |
|---|---|---|
| `clip <panel> N` | píxeles que se salen del panel | **0** |
| `ramaN WxH innerN subsN headN` | tamaño y desbordes internos de cada bloque | `inner0 subs0` |
| `subN hN listN [cli/scroll li …]` | subbloque, desbordes de su lista y alto de cada ítem | `list0` |
| `items 35 una-linea 35 sangria 20-22` | ítems de una línea y sangría de la insignia | `35/35`, sangría uniforme |
| `w subN textoN insigniaN` | ancho del subbloque, del texto y de la insignia | texto ~228, insignia 19 |
| `box OVERLAP i<->j` | dos cajas se pisan | **ninguna** |
| `boxN OVERFLOW …` | caja fuera del mapa | **ninguno** |
| `textx-overflow` | texto recortado | **ninguno** |
| `center innerN swN` | desbordes del círculo | `0 0` |

Medición de referencia del estado actual: `clip 0` en todos los paneles · `inner0`/`subs0` en
los 5 bloques · `list0` en los 10 subbloques · `items 35 una-linea 35` · `sangria 20-22` ·
`center inner0 sw0 sub-sw0` · **sin** `box OVERLAP` ni texto recortado.

---

## 8. Errores ya cometidos (no repetirlos)

1. **`.mm-list li > span` sin `:not(.mm-lg)`** → el badge (que es un `span`) recibía
   `flex: 1` y partía la fila a la mitad (insignia 124px / texto 124px), lo que rompía la
   alineación y forzaba cortes de línea. Usar siempre `:not(.mm-lg)`.
2. **Filtrar el reporte con `/overlap/` en minúscula** → la auditoría escribe
   `box OVERLAP` en mayúsculas; el filtro se la tragaba y se coló un solapamiento real de 6px
   entre la fase 5 y los bloques de las fases 3 y 4. Filtrar con `/OVERLAP|OVERFLOW/i`.
3. **Sustituciones de texto frágiles en CSS/JS**: un `MISMATCH` con recuento distinto de 1
   aborta el script **antes de escribir**, lo que es seguro, pero obliga a releer el archivo.
   Con valores repetidos (p. ej. `calc(8.6px * var(--mm-fs))` aparece en `.mm-sub-h` y
   `.mm-sub-ht`) hay que incluir el selector en el patrón.
4. **Colores de `pob1.md` ≠ colores pedidos por el usuario**: cuando discrepan, **gana la
   última instrucción del usuario** (y se deja anotado en este archivo).
5. **No reintroducir `viewBox` escalado en el SVG del mapa**: es 1:1 con el div del mapa
   (1366×378) y las ramas van en px absolutos.
6. **Selectores de clase que no existen como token**: en la versión anterior del slide 7 las
   etapas llevaban `rs2-et` + `rs2-et--<clave>` (el token *con* sufijo) y **no** existía un token
   `rs2-et--` suelto. Un selector mal escrito (`.rs2-body--fe2 .rs2-et:not(.rs2-et-e2)`) no casa
   **jamás** y las etapas colapsadas se quedan en su ancho original con el texto visible en vez
   de `0/hidden`. El síntoma es silencioso: nada falla en jsdom, solo se ve en el reporte
   Chrome (`vis=visible` donde debería ser `hidden`). Al reimplementar el contenido, comprobar
   siempre el `visibility` real en el reporte, no solo que el DOM exista.
7. **El `--rs-k` (1.6) va en el bloque enfocado, no en el scope** (slide 6 y antigua cadena del
   slide 7): puesto en el scope escalaba también la barra de secuencia y los paneles de apoyo,
   lo que provocó `frame OVERFLOW` en `.rs-hint` (la pista crecía 1.6× y se salía del marco).
   Además, para que los bloques ocultos midan **0 de verdad** hay que anular `padding` y
   `border-width` (`padding:0; border-width:0`), no solo `flex:0 0 0`.
8. **En los harnesses hay que desactivar también las ANIMACIONES**, no solo las transiciones:
   `.slide.active` tiene `animation: fadeIn .4s ease` con `translateY(6px)` en el `from`. Medir
   durante la animación desplaza la lámina 6px y provoca un `frame OVERFLOW bottom` falso en el
   elemento que llega al borde. Por eso `gen_slide7_shot.js` y `gen_fase_probe.js` inyectan
   `*{transition:none !important;animation:none !important}`. Además, al escribir el código de
   auditoría inyectado desde Node, **hay que declarar `NL` dentro de la página**: si solo existe
   en el script de Node, la página lanza `ReferenceError` y el `--dump-dom` sale sin el `<pre>`
   del reporte, sin ningún error visible. Comprobar siempre que el `<pre id="report">` existe
   antes de dar por buena una auditoría.
9. **En `gen_*_shot.js`, `[['a','b']].forEach(function(k){...})` escribe UN solo archivo
   `..._fa,b.html`**: si quieres N archivos usa `forEach(keys => keys.forEach(k => ...))`; si no,
   `verify-all.cmd` intenta cargar un `.html` que no existe y Chrome hace un screenshot en blanco.
   En el slide 7 la lista de estados era un array plano `KEYS = ['e1',…,'e8']` (ahora vacío: la
   lámina está en blanco) y por cada clave se escribían `out/res2_shot_feN.html` +
   `out/slide07_feN.png` desde `verify-all.cmd`. Al reintroducir contenido, **crear también las
   capturas por clave en `verify-all.cmd`**, o se audita el reposo y no los estados ampliados.

---

## 9. Historial de diseños del bloque 3

| Fecha | Diseño | Estado |
|---|---|---|
| 2026-09-26 | 5 fases como 15 tarjetas `.md-mc` + 4 tarjetas de población en bloque 4 | ~~superado~~ |
| 2026-09-26 | 4 macro-ramas de 528×179 (`lt/rt/lb/rb`), `MH=365`, `CX=683/CY=183` | ~~superado~~ |
| 2026-09-27 | 5 fases, 2+3 columnas (360×185 / 710×124) | ~~superado~~ |
| **2026-09-27** | **5 fases en espejo con fase 5 centrada y acortada (550×124 ×4 + 500×120)** | **vigente** |

## 10. Pendientes

- [x] Colores por fase confirmados y **alternos**: F1 verde · F2 rojo · F3 verde · F4 rojo · F5 verde.
- [x] Composición en espejo confirmada (círculo centrado; 1 arriba-izq, 2 arriba-der,
      3 bajo 2, 4 bajo 1, 5 centrada abajo).
- [x] Sangría uniforme y 35/35 ítems en una línea.
- [x] Fase 5 sin invadir los demás bloques.
- [x] **Interacción por clic en el slide 5**: bloques 1 y 2 a pantalla completa y cada rama del
       mapa ampliada para presentación y el **bloque 2 del slide 6 con sub-bloques 2a/2b**
       (`focus_check.js` 84/84, `gen_heights.js` 9 estados slide 5, `gen_results_heights.js`
       estados 1/2/3/2a/2b slide 6).
- [x] **Bloque 3 del slide 6**: fases 3a/3b ampliables de forma independiente; al ampliar, la
       Fase 1 quita la Tabla 17 y muestra `assets/ref-norm.png`; la Fase 2 quita la Tabla 18 y
       muestra `assets/c-cheq.png`; anillo verde/rojo + ghost (`focus_check.js` **172/172**,
       `gen_results_heights.js` **13 estados** con auditoría `FOCO 3a/3b` `1348x591` 0 clip/0
       overflow, `gen_fase_probe.js` app real, capturas `slide06_foco3a/3b.png`).
- [x] **Nivel 2 de la imagen (`3aimg/3bimg`)**: clic sobre `ref-norm.png`/`c-cheq.png` →
       máximo tamaño de la pantalla (caja 1392×628, **fondo blanco con tonos tenues
       verde/rojo**, anillo verde/rojo), clic → vuelve a 3a/3b, clic → pantalla inicial
       (`focus_check.js` **172/172** con cadena completa de ambas fases, `gen_results_heights.js`
       **13 estados** con auditoría `FOCO 3aimg/3bimg`, probe app real, capturas
       `slide06_foco3aimg/3bimg.png`).
- [x] **Confirmar visualmente `tools/out/slide05_map.png` y `tools/out/md_shot*.png` con el usuario.**
- [x] **Slide 7 «RESULTADOS (2)»**: `resultsData2.js` (RESULTADOS2) + `slide07Results.js`,
       SLIDES id 7, scope `rs2-body` + ghost, CSS DIAPOSITIVA 7, `focus_check.js`,
       `gen_slide7_shot.js` (auditoría de la lámina en blanco + `res2_shot.html` + captura
       `slide07.png`), probe app real S7 en `gen_fase_probe.js`.
- [x] **Historial de contenido del slide 7**: 3 fases v3/v4/v5 (Tablas 19-21 «pendiente de
       información») → **Fase 3 única** con la matriz de niveles de riesgo NTP 330
       (ND de la Fase 2 → NE/NP/NC/NR/NI, extracto de 3 filas que se amplía a 4, cadena
       `NP = ND × NE · NR = NP × NC → NI`) → **contenido vaciado** (1ª vez) →
       **cadena horizontal de 8 etapas + 3 paneles de apoyo** (Fase 3 según `ntp330.md`) →
       **contenido vaciado otra vez** (2ª vez, petición actual).
- [x] **Lámina 7 en blanco, solo el título y la referencia a la fase 3** (2ª vez): se vaciaron
       `etapas`/`apoyo`/`secuencia`, el renderer quedó en `<header>` + cuerpo vacío y el CSS
       DIAPOSITIVA 7 en `.rs2-body`/`.rs2-cols`; `FOCUS_SCOPES` con `keys: []`;
       `focus_check.js` **190/190**. Y a continuación, por petición del usuario, se seccionó la
       página en dos bandas (ver la línea siguiente).
- [x] **Página 7 seccionada: flujograma 25% arriba + dos recuadros de fotos abajo**
       (petición del usuario):
       · `resultsData2.js` pasa a `flujo` (7 nodos con `code`/`title`/`sub` y `color`, en
         alternancia verde/rojo) + `fotos` (2 huecos rotulados);
       · el renderer pinta `.rs2-flow` (`.rs2-chain` con `.rs2-fn` y `.rs2-fx`; `.rs2-note`
         solo si el dato trae `ui.nota`, ya retirado) y `.rs2-fotos` (dos `.rs2-foto` vacíos con `data-foto`);
       · CSS: `.rs2-flow { flex: 0 0 25% }`, `.rs2-fotos { flex: 1 1 auto }`, tarjetas
         `.rs2-fn` con variables por color (`--fn-c/--fn-bg/--fn-bd`) y `.rs2-fx--merge`
         para la convergencia NC→NR; **la 1ª línea de cada bloque (el código) va resaltada**
         (18.98px/700 con el color del bloque) y el título a 12.65px/600, con la línea de
         contenido a 10.75px y las fórmulas (NP/NR) con realce propio (el usuario pidió
         +10% y luego un +15% adicional; la etiqueta de rama quedó a 10.12px). Ojo: al borrar el CSS
         de la escala descartada se perdieron por error las reglas `.rs-fn-c/.rs-fn-t/.rs-fn-s`
         y los bloques se veían en 16px normal; se restauraron y hay checks que lo fijan.
         En el NC se probó y se descartó la escala M/MG/G/L
         dentro del bloque (el usuario pidió su texto original) y el borde discontinuo
         (le confundía). El NC quedó como tarjeta verde normal, con el texto
         «Magnitud del daño esperado» en una sola línea;
       · `focus_check.js` **218/218** (incluye asserts de alternancia estricta `GRGRGRG`,
         borde sólido del NC y tipografía del bloque), `gen_slide7_shot.js` y
         `gen_fase_probe.js` auditando las dos bandas, captura única `slide07.png`
         (0 clip, 0 tx, 0 overflow).
- [x] **Los cinco bloques del slide 7 abren su cuadro de `ER.docx`** (petición del usuario):
      · `tools/extract_er_tables.js` extrae de `ER.docx` las tablas de **NE** (nivel de
        exposición), **NP** (probabilidad), **NC** (consecuencias), **NR** (matriz NP × NC) e
        **NI** (intervención) a `presentacion-web/js/data/erTables.js` (`window.ER_TABLES`,
        4 filas de datos por clave). Se descartaron la tabla ND y la matriz ND × NE porque el
        usuario solo pidió las de los cinco bloques pulsables. El extractor limpia los campos
        Zotero y el texto posterior a las tablas;
      · los nodos de `resultsData2.js` llevan `focus: 'ne' | 'np' | 'nc' | 'nr' | 'ni'` y
        `FOCUS_SCOPES` pasa a `keys: ['ne','np','nc','nr','ni']`;
      · el renderer añade `.rs2-screens` con los cinco `.rs2-tbl` (`data-tbl`, `tabindex`,
        `role=button`; tablas simples y la matriz con `.rs2-tb-nr` por celda);
      · CSS: `.rs2-screens` colapsada (`flex: 0 0 0`, `opacity: 0`, `visibility: hidden`,
        `transform: scale(.94)`) que al abrir pasa a `flex: 1 1 auto` / `scale(1)`, con
        `transition` de `flex-grow`, `flex-basis`, `opacity` y `transform` (agranda al abrir,
        achica al cerrar); `.rs2-fotos` ceden el sitio; el cuadro lleva `z-index: 2` y
        `.rs2-body` **no** crea contexto de apilado, para que el ghost quede detrás;
      · severidad: NE/NP/NC/NI con dos filas rojas y dos verdes (`rrgg`); en la matriz el
        color va **por celda** (I/II rojo, III/IV verde), las filas son `--mix`. Ojo: las
        filas de `erTables.js` no traen `tono`, y usarlo producía `rs2-tb-r--undefined`;
      · los dos ejes de la matriz, que solo traían números, se nombran cruzándolos con las
        tablas del NP y del NC del mismo documento (Tablas 5 y 7 del `ER.docx`): las
        columnas quedan «Muy alta (MA) 40-24», «Alta (A) 20-10», «Media (M) 8-6»,
        «Baja (B) 4-2» y las filas «100 Mortal o Catastrófico (M)», «60 Muy Grave (MG)»,
        «25 Grave (G)», «10 Leve (L)». Los rótulos de los ejes también se pintan, que antes
        no: `extract_er_tables.js` sacaba `tituloColumnas` y el renderer **nunca lo mostraba**.
        La matriz lleva ahora **dos filas de cabecera** y tres ejes rotulados, como pidió el
        usuario: un banner «Nivel de Probabilidad (NP)» con `colspan="4"` sobre las columnas
        (de Muy alta a Baja) y, a la izquierda de las filas, un rótulo vertical
        «Nivel de Consecuencias (NC)» con `rowspan="4"` y `writing-mode: vertical-rl;
        transform: rotate(180deg)`. Ojo: eso deja la matriz con **6 `tr`** (2 de cabecera + 4
        de datos) frente a las 5 de las otras cuatro tablas, y el check de «4 filas de datos»
        tiene que contar también las filas de cabecera. Con `table-layout: fixed` la columna
        del rótulo mide 34px y la de las etiquetas NC 232px, así que las cuatro columnas de NP
        quedan en 269px cada una (tabla 1342×263 dentro de un hueco de 380px, sin scroll);
      · **todas las celdas de las cinco tablas se centran en horizontal y en vertical** (lo
        pidió el usuario). Se hizo en la regla base `.rs2-tb th, .rs2-tb td`, que pasó de
        `text-align: left; vertical-align: top` a `text-align: center; vertical-align: middle`,
        en vez de parchear tabla por tabla: así el banner del NP, el rótulo vertical del NC,
        los nombres del NP, las etiquetas del NC, los chips de nivel y **las frases largas de
        «Significado»** quedan centrados sin tocar el renderer. Al heredar el centrado de la
        celda se pudieron **borrar** tres reglas que lo pisaban: `.rs2-tb thead th + th,
        .rs2-tb td.rs2-tb-v`, el `text-align: center !important` de `.rs2-tb-span` y de
        `.rs2-tb-vert`, y el `vertical-align: bottom` de `.rs2-tb-esq` y de
        `.rs2-tb thead th.rs2-tb-v`. Hay un check que falla si vuelve a aparecer cualquiera de
        ellas o un `text-align: left`, y otro que comprueba con `getComputedStyle` que **las
        cinco** tablas tienen todas sus celdas centradas. El centrado no cambia las alturas:
        la matriz sigue en 23 + 37 + 37 + 64 + 37 + 64 = 263px y el hueco en 380px, sin scroll;
      · `focus_check.js` **276/276** (los cinco objetivos, `ER_TABLES`, los cinco cuadros
        ocultos en reposo, apertura de uno solo por clic, `Enter`, severidad, cierre con
        segundo clic/`ESC`/clic fuera, ghost, el CSS del zoom, el centrado de las celdas y los
        tres ejes de la matriz
        nombrados tanto en los datos como en el HTML pintado). `gen_slide7_shot.js` audita
         reposo + los cinco focos con **0 clip / 0 tx / 0 OVERFLOW**; capturas
         `slide07_f{ne,np,nc,nr,ni}.png` añadidas a `verify-all.cmd`.
- [x] **Fotografía 1 del slide 7 aloja la aplicación web de evaluación (petición del usuario,
      2026-09-29).** Al pulsarla se muestra, dentro de ese hueco, la app de la carpeta hermana
      `D:\ejemplo\tesis\0` y arranca en su pestaña «Evaluación».
      - Decisiones que se tomaron con el usuario: que **Fotografía 1 crezca a toda la banda
        inferior** en vez de quedarse en sus 677×459 (medido: a 677 de ancho la barra de 6
        pestañas se parte en dos filas y el contenido queda en 716px de alto contra 363
        visibles), y que la app se cargara **en vivo con un `<iframe>`**, sin copiarla.
      - Datos en `js/data/resultsData2.js`: `fotos[0].app = { src: '../../tesis/0/index.html',
        etiqueta, pestana: 'evaluacion', aviso }`. La ruta está en ese único sitio, por si hay
        que corregirla. Es relativa al documento: `presentacion-web/` → `../../tesis/0/`.
      - `app.js`: se añadió `'f1'` a las claves del scope `rs2-body`, y `setScopeFocus` ahora
        lanza un `CustomEvent('slide:focus', { detail: { key, scope }, bubbles: true })`.
        **Con `bubbles: true` a propósito**: sin él el evento se queda en el `.rs2-body` y
        quien escuche en `document` no se entera — fue el primer fallo, con el `data-focus`
        puesto y el `<iframe>` sin aparecer. Se lanza al final de `setScopeFocus`, con el ghost
        ya construido, para que la copia atenuada salga sin el `<iframe>` dentro.
      - `slide07Results.js`: `foto()` pinta el recuadro con `data-focus`, `tabindex`,
        `role="button"`, `aria-label` y un hueco `.rs-ft-frame`. El `<iframe>` **no** se pinta
        en el HTML: lo monta `montaApp()` al recibir `slide:focus` con `key === 'f1'` y lo
        borra en cuanto el foco es otro o ninguno. Así los ~800KB (16 scripts) de la app no se
        cargan al arrancar la presentación. El listener está en `document`, no en el recuadro,
        para no depender del orden de los `<script>` (y de paso lo puede testear jsdom).
      - CSS: `.rs2-body--ff1` (ojo: el prefijo del scope es `rs2-body--f` y la clave `f1`, así
        que sale `ff1`) hace crecer `f1` a `flex: 1 1 auto`, retira `f2` (`flex: 0 0 0` +
        `visibility: hidden`) y los cinco cuadros, y enciende `.rs-ft-frame`. En reposo
        `app-rect` mide `0 0 0 0`.
      - La app abre en «Evaluación» **sin tocar `D:\ejemplo\tesis\0`**: ya es su pestaña por
        defecto (`class="tab-btn activo" data-tab="evaluacion"`), y como el `<iframe>` se
        recrea en cada apertura, siempre se entra por ahí. Hay un check que lo lee del
        `index.html` real para que siga siendo cierto.
      - **Limitación de `file://` que conviene recordar**: dos `file://` son orígenes opacos,
        así que la lámina no puede leer ni escribir dentro del `<iframe>`. No hace falta, pero
        también significa que **el `Esc` no cierra la app**: el teclado va al `iframe` mientras
        tenga el foco. Para volver hay que clicar en el título del recuadro o fuera de él, que
        es lo que dice el `aviso`. La app usa `localStorage` con su propio prefijo `ntp330.`,
        así que sus datos no se mezclan con los de la presentación.
      - `focus_check.js` **305/305** (29 checks nuevos). Uno de ellos cambió de significado:
        el antiguo «los huecos de foto no son accionables todavia» es ahora «de los dos huecos
        de foto, solo Fotografía 1 es accionable», porque ya es justo lo que se pidió.
      - `gen_slide7_shot.js` audita un sexto foco, `f1`, y **resuelve la ruta de la app a
        absoluta** antes de meterla en el `<iframe>`: el harness vive en `tools/out/`, dos
        niveles más abajo que `presentacion-web/`, así que la ruta relativa tal cual daría 404 y
        la captura saldría con el marco vacío. Si `tesis/0` no está, el script **falla con un
        error claro** en vez de generar capturas mudas. `verify-all.cmd` gana un `:shotapp` con
        `--virtual-time-budget=40000` (los 5000 de `:shot` no bastan para 16 scripts) y la
        captura `slide07_ff1.png`.
      - `png_stats.js` (nuevo, sin dependencias): decodifica el PNG a mano y dice cuántos
        colores y qué porcentaje de píxeles pintados hay en un rectángulo. Es la forma de
        comprobar que el `<iframe>` **realmente pinta**, ya que su DOM es de otro origen.
        Resultado antes del cambio de tema: el marco de la app en `slide07_ff1.png` tenía
        **11 873 colores y 81,6 % pintado**; la captura actual se describe en §12.
- [x] **Slide 8 «RESULTADOS (3)»**: `resultsData3.js` (RESULTADOS3 con `pasos`, `resumen`,
       `pista`) + `slide08Results.js`, SLIDES id 8, scope `rs3-body` + ghost, CSS `.rs3-*`,
       seis imágenes de `assets/` copiadas de `Resultados.docx`/`ER.docx`, `focus_check.js`
       (365/365) y `gen_slide8_shot.js` integrado en `verify-all.cmd` (`slide08.png` +
       `slide08_fp1..fp6.png`). En reposo la banda inferior muestra el resumen de la muestra
       (`.rs3-idle`, 1368×486); al pulsar un paso se abre su imagen (1368×498) y el resumen se
       oculta. Detalle y errores evitados en §18.
- [ ] **Confirmar el diseño de `tools/out/slide08*.png` con el usuario**; el agente no puede ver
       las imágenes, así que solo hay evidencia geométrica y de píxeles (`gen_slide8_shot.js` y
       `png_stats.js`), no revisión visual. Conviene validar rótulos, pies de fuente y que las
       seis gráficos sean los del orden acordado.
- [ ] **Confirmar el diseño de `tools/out/slide07*.png` con el usuario**; capturas de la app
       y de Fotografía 1 revisadas visualmente por el agente el 2026-09-30.
- [ ] Commit en git de `presentacion-web/`, `tools/` y `CONTINUIDAD.md` **cuando el usuario lo pida**.

## 11. Estado del repo (git)

- Rama `main`; último commit: `2a3a334 Presentación web - objetivos e hipótesis, marco teórico y referentes legales`.
- `.gitignore` nuevo: excluye `tools/node_modules/`, `tools/out/` (se regeneran), `*.out` y el
  dump `f`; **las imágenes de `presentacion-web/assets/` SÍ se incluyen en el commit**.
- Modificados y sin commitear: `presentacion-web/css/styles.css`, `presentacion-web/index.html`,
  `presentacion-web/js/app.js`, `presentacion-web/js/data/theoriesData.js`,
  `presentacion-web/js/data/thesisData.js`, `presentacion-web/js/slides/slide04Theories.js`.
- Nuevos y sin rastrear (de esta tarea): `presentacion-web/assets/**` (ref-norm.png, c-cheq.png,
  procesos1/2.png, riesgos1/2.png, Imagen1.png), `presentacion-web/js/data/methodologyData.js`,
  `presentacion-web/js/data/resultsData.js`, `presentacion-web/js/data/resultsData2.js`,
  `presentacion-web/js/slides/slide05Methodology.js`, `presentacion-web/js/slides/slide06Results.js`,
  `presentacion-web/js/slides/slide07Results.js`, **`presentacion-web/js/slides/slide08Results.js`**,
  **`presentacion-web/js/data/resultsData3.js`**,
  **`presentacion-web/assets/MatrizER.png`, `nd-res.png`, `nd-res1.png`, `riesgos-res.png`,
  `riesgos-res1.png`, `art-fin.png`**,
  `tools/**` (verify-all.cmd, map_check.js,
  focus_check.js 383/383, gen_slide7_shot.js, **gen_slide8_shot.js**, gen_fase_probe.js, etc.), `resultados.md`,
  `CONTINUIDAD.md`, `.gitignore`.
- **Ajenos a esta tarea, no tocar**: `Imagen1.png`, `Obj.docx`, `im2.jpg`, `ley.png`,
  `logo-original.bmp`, `logo.bmp`, `met.docx`, `met1.png`, `probl.docx`, `spa.traineddata`,
  `teor.docx`, `bloque3-5.md`, `diap4-1.md`, `diap5_met.md`, `pob.md`, `pob-m.md`, `pob-m.png`,
  `~$Ejemplo.pptx`, `~$met.docx`.
- **`Presentacion_Tesis_Doctoral.pptx` figura como borrado (`D`) desde antes de esta sesión**:
  no borrarlo ni restaurarlo sin avisar al usuario.
- **NO usar `git checkout` / `git reset`**: hay cambios sin rastrear y ajenos a esta tarea.
- **NO ignorar `tools/`**: es necesario para la continuidad.
- **Nuevos (2026-10-07)**: `tools/inventario.json`, `tools/verificar-inventario.js`,
  `tools/traspaso.cmd` y `TRASPASO.md` = **proceso de guardado/traspaso** de la carpeta.
  Comprobar la carpeta y generar el paquete portable: `cd tools && traspaso.cmd paquete`.
- Sigue habiendo archivos importantes sin commitear (la tabla de git status los lista):
  no es un error del proceso, es justo lo que `verificar-inventario.js` avisa para
  decidir cuándo guardarlos en git. El paquete de traspaso los incluye de todas formas.

## 12. Tema visual de la aplicación hermana (2026-09-30)

El usuario pidió modificar **la app real de `D:\ejemplo\tesis\0`**, con el tema de la
presentación y Arial. La app se carga en vivo en Fotografía 1, así que el cambio también
se ve dentro de la lámina.

- Hoja cargada: `D:\ejemplo\tesis\0\css\style.css`. Tokens semánticos `--tinta`,
  `--acento`, `--rojo`, `--fondo`, escala de grises y `--fuente`; se retiraron los
  azules/turquesas decorativos. Cabecera oscura→verde, pestañas activas verdes,
  tablas con cabeceras neutras y secundarios de contorno.
- `app.ui.js`, `app.admin.js`, `app.pruebas.js`: cinco títulos dinámicos leen
  `var(--tinta)`; los canvas leen colores y fuente del CSS. Barras de recuento verdes,
  barras de NR promedio rojas; la distribución NI conserva sus cuatro colores.
- `.badge-registrado` usaba `--verde-medio` sin definición; ahora usa `--acento`.
- Al revisar los PDF se detectaron anchos incorrectos en las listas de chequeo.
  `app.reportes.js` ajusta Observaciones a 24 mm en campo y la pregunta de la completada
  al ancho restante. El resumen reserva espacio y envuelve la fórmula; los símbolos no
  disponibles en Helvetica se muestran como texto equivalente. Los cálculos se conservan.
- Verificación: sintaxis JS OK, **52/52**, **0 errores JS** en Evaluación, Catálogo,
  Pruebas y recorrido completo. Muestra: `PROY-0001` → Obras preliminares → 13 riesgos,
  checklist de 10 preguntas → `EVAL-0001`, ND 10 / NE 2 / NP 20 / NC 25 / NR 500 / NI II.
  Matriz de 13 filas y tres gráficos con contenido, Arial y colores correctos.
- ART A4/A3 horizontal, lista de campo vacía y completada generados con jsPDF 2.5.1
  y autotable 3.5.28 reales: tablas dentro de los márgenes, revisión visual OK.
- `verify-all.cmd shot`: **54/54 + 307/307**, `TODO OK`. Captura actual
  `tools/out/slide07_ff1.png`: **11 546 colores y 60,3 % pintado** en el rectángulo
  `54 596 2676 784`; el tema está visible dentro del iframe.
- Capturas antes/después: `tools/out/tema/antes_evaluacion.png`,
  `antes_pruebas.png`, `despues_evaluacion.png`, `despues_pruebas.png`,
  `despues_catalogo.png`, `despues_iframe.png`, `despues_flujo.png`.
  PDF de muestra: `reporte_0.pdf` (ART A4), `reporte_1.pdf` (ART A3),
  `reporte_2.pdf` (campo), `reporte_3.pdf` (completada), en la misma carpeta.

Comandos desde `D:\ejemplo\tes\tools`:

```bash
node app_cdp.js out/tema/despues_evaluacion.png
node app_cdp.js out/tema/despues_pruebas.png --tab=pruebas --run
node app_cdp.js out/tema/despues_flujo.png --flow --pdf --full
node app_cdp.js out/tema/despues_iframe.png --viewport --width=1338 --height=392
```

El driver bloquea los dos CDN en Chrome para verificar la carga offline y cuenta sus
fallos de red como avisos esperados; `--pdf` necesita conexión y carga por separado las
mismas bibliotecas para probar los PDF reales. Usa una copia y un perfil desechables:
no modifica el localStorage del usuario. Los intentos previos con `app_shot.js` y los
scripts de depuración se retiraron; `app_cdp.js` es la herramienta vigente.

## 13. Altura de los siete bloques al 75% (2026-09-30)

Por petición del usuario, Riesgo/ND/NE/NP/NC/NR/NI pasan de 157px a 117.75px
(118px redondeados). `.rs2-flow` usa `flex: 0 0 18.75%`: el 75% de su anterior
25% del alto disponible. El espacio liberado amplía la banda inferior a 486px
y el iframe de Fotografía 1 a 1338×431. Comentarios del renderer/datos y las
dos comprobaciones de altura de `focus_check.js` actualizados.

Verificado: `verify-all.cmd` **54/54 + 307/307**, auditoría Chrome en reposo y
los seis focos con **0 clip/tx/OVERFLOW**. Capturas `tools/out/slide07.png` y
`tools/out/slide07_ff1.png` actualizadas y revisadas visualmente.

## 14. Fondo sólido al abrir la app (2026-09-30)

La copia atenuada de la lámina (`.scope-ghost`, `z-index: 0`) se pintaba encima
de la app, dejando ver los rótulos «Fotografía 1/2» y sus marcos sobre el iframe.
El recuadro abierto `.rs2-body--ff1 .rs2-foto--app` tiene
`position: relative; z-index: 2` y su fondo blanco sólido. La app queda delante
de esa copia, igual que los cuadros de ER.docx.

## 15. La app se abre desde el bloque Riesgo (2026-09-30)

Por petición del usuario, el disparador de la app ya no es Fotografía 1 sino el
**primer bloque del flujograma, «Riesgo»** (`data-focus: 'f1'`). Al pulsarlo:

- Los **7 bloques se ocultan con un efecto** (`.rs2-body--ff1 .rs2-flow` pasa a
  `opacity: 0; visibility: hidden; flex: 0 0 0`, con `transition` de
  `flex-grow`/`flex-basis`/`opacity`/`visibility`).
- La app crece en la banda inferior (1352×486, iframe 1338×431), arrancando en
  «Evaluación».
- Los **recuadros de foto quedan intactos pero no son pulsables**: ya no llevan
  `data-focus`, `tabindex` ni `role="button"`, y el cursor ya no es `pointer`.
- Se cierra con un segundo clic en Riesgo, `ESC` o un clic fuera.

Verificado: **54/54 + 310/310**, **0 clip/tx/OVERFLOW** en los seis focos,
iframe 1338×431. Capturas `tools/out/slide07.png` y `tools/out/slide07_ff1.png`
actualizadas y revisadas visualmente.

## 16. Fotografía 1 muestra zanja.jpeg en reposo (2026-10-01)

Por petición del usuario, el recuadro **Fotografía 1** muestra en reposo la
imagen de la zanja (`assets/zanja.jpeg`, copiada desde `tes/zanja.jpeg`,
4168182 bytes):

- Dato nuevo `imagen` en `resultsData2.js → fotos[0]`; el renderer
  (`slide07Results.js`) pinta `<img class="rs-ft-img">` entre el rótulo y la
  nota. Fotografía 2 sigue vacía.
- CSS `.rs-ft-img`: `flex: 1 1 auto; object-fit: cover`, y con el foco de la
  app abierta queda oculta (`.rs2-body--ff1 .rs2-foto--app .rs-ft-img { display: none }`),
  de modo que al abrir la app no queda la foto por debajo.
- **Sin textos bajo la imagen en reposo** (petición del usuario): la nota
  «Aplicación de evaluación de riesgos NTP 330» y el aviso de cierre solo
  aparecen con la app abierta, como barra superior (regla
  `.rs2-foto--app .rs-ft-n, .rs2-foto--app .rs-ft-hint { display: none }`,
  que además corrige el selector erróneo `.rs2-ft-hint` que dejaba el aviso
  visible en reposo).
- `focus_check.js` adaptado: el recuadro 1 debe llevar exactamente una imagen
  `zanja.jpe?g`, el 2 cero, la imagen visible en reposo y oculta con
  `rs2-body--ff1` (más el check de CSS).

Verificado: **54/54 + 315/315**, **TODO OK**, sin clip/tx/OVERFLOW.
Capturas `tools/out/slide07.png` (reposo con la foto) y
`tools/out/slide07_ff1.png` (app abierta, sin foto) revisadas visualmente.

## 17. Proceso de reanudación en este equipo (2026-10-01)

Para retomar el trabajo **más adelante, desde este mismo computador**, el punto
de entrada es **`tools/reanudar.cmd`** (creado el 2026-10-01). Una sola orden
recorre el proceso completo:

```bat
cd /d D:\ejemplo\tes\tools
reanudar.cmd            :: entorno + verificación (rápido, sin capturas)
reanudar.cmd shot       :: + PNG de todos los estados en tools\out\
reanudar.cmd app        :: + pruebas de la app de tesis (52/52)
reanudar.cmd shot app   :: todo
```

**Qué comprueba, en orden:**

| Paso | Qué hace | Si falla |
|---|---|---|
| 1. Entorno | Node 22+ en el PATH; `node_modules\jsdom` (si falta, ejecuta `npm install` solo); Chrome en la ruta por defecto (solo aviso); app hermana `..\..\tesis\0\index.html` presente | sale con código 1 e indica qué falta |
| 2. Presentación | `verify-all.cmd` (sin argumentos) o con `shot`: sintaxis, 54 checks mapa, 383 checks de foco, harness y —con `shot`— los PNG | sale con código 1 (el detalle está arriba) |
| 3. App (opcional `app`) | `app_cdp.js out\reanudar_pruebas.png --tab=pruebas --run` → exige **52/52** y 0 errores JS | sale con código 1 si hay fallos |
| 4. Estado git | `git status --short --branch` de `tes` y de `tesis` — para ver de un vistazo qué hay sin confirmar antes de tocar nada | — |
| 5. Dónde seguir | Rutas de `CONTINUIDAD.md`, `tesis/0/docs/ESTADO.md`, `tesis/AGENTS.md`, capturas y comandos habituales | — |

Todo verde se reconoce por el cierre **`REANUDACION COMPLETA`** (y `TODO OK`
del paso 2). Última pasada completa el **2026-10-02**: `54/54 + 383/383`,
`52/52` de la app, exit 0.

**Primeros pasos al volver:**

1. `cd /d D:\ejemplo\tes\tools` y `reanudar.cmd shot app`.
2. Leer este documento desde §0 (TL;DR) y el último § pendiente de trabajo.
3. Si se va a tocar la app de tesis: leer `D:\ejemplo\tesis\AGENTS.md` primero
   (no tocar fórmulas ni `js/app.data.*`) y `0/docs/ESTADO.md` para el estado.

**Recordatorio:** hay **cambios sin confirmar en los dos repos** (ver paso 4
del script): en `tes` están sin commitear, entre otros, `CONTINUIDAD.md`,
`tools/`, `resultsData2.js`, `slide07Results.js` y `assets/` (incluida
`zanja.jpeg`); en `tesis`, los cambios de tema de `0/css/style.css`,
`0/js/app.*.js` y `0/docs/ESTADO.md`. Antes de llevar el proyecto a otro
equipo conviene hacer `git add -A && git commit` en ambos.

## 18. Slide 8 «RESULTADOS (3)»: la prueba piloto en infraestructura (2026-10-02)

Ochoava lámina, con el mismo patrón de banda que el slide 7: la **banda
superior (18,75 % del alto)** lleva la secuencia y la **banda inferior** el
resultado abierto. Los seis resultados se muestran **en orden** y cada uno es
pulsable; el segundo clic, `ESC` o un clic fuera lo cierran.

| # | Clave | Contenido | Imagen |
|---|---|---|---|
| p1 | `ND × NE` | **Matriz de Riesgos** (base de cálculo) | `assets/MatrizER.png` |
| p2 | `87,95 %` | Deficiencia (ND) global: 73 de 83 Muy Deficientes | `assets/nd-res.png` |
| p3 | `10,00` | Deficiencia por proceso (ND máximo: vibración) | `assets/nd-res1.png` |
| p4 | `83` | Riesgos presentes (20 tipos evaluados) | `assets/riesgos-res.png` |
| p5 | `6,02 %` | Distribución de riesgos (los menos frecuentes) | `assets/riesgos-res1.png` |
| p6 | `ART` | Controles de ingeniería (Fase 4) | `assets/art-fin.png` |

- **Archivos nuevos:** `js/data/resultsData3.js` (`window.RESULTADOS3` con
  `pasos`, `resumen`, `pista`, `nota`) y `js/slides/slide08Results.js`
  (`window.slideRenderers.resultados3`). Registrados en `index.html` y en
  `js/data/thesisData.js` como `{ id: 8, key: 'resultados3' }`.
- **Assets copiados** a `presentacion-web/assets/` (las seis imágenes de
  `Resultados.docx`/`ER.docx` del proyecto de infraestructura de Quito).
- **Scope de foco** `rs3-body` en `js/app.js` (`FOCUS_SCOPES` con `p1`…`p6` **y
  `p1i`…`p6i`**, ghost `4px 20px 12px`, `gap 8px`), igual que `rs2-body`.
- **CSS** `.rs3-*` al final de `css/styles.css`. Verde en p1 y p6 (base
  metodológica y respuesta preventiva), rojo en los cuatro hallazgos.
- **Reposo:** la banda inferior muestra `.rs3-idle` (1368×486) con las cuatro
  cifras de la muestra (`resumen`: 87,95 % / 83 / 20 / 5) y la pista de uso;
  al abrir un resultado se oculta (`display: none` con `rs3-body--fpN`).

### Nivel 2: la imagen a máximo tamaño

Petición del usuario (2026-10-02): al abrir un resultado, **un clic sobre su
imagen la agranda al máximo** y un segundo clic devuelve el resultado a la
banda inferior. Es el mismo criterio que el nivel 2 del slide 6 (`3aimg`/`3bimg`).

- La clave del nivel 2 es la del paso con una `i` (`p1` → `p1i`) y `app.js` la
  resuelve como **nivel anidado**: `parents: { p1i: 'p1', … p6i: 'p6' }`, de modo
  que el segundo clic, `ESC` o un clic fuera **vuelven al panel**, no al reposo.
- El marco pulsable es `.rs3-pn-zoom` (`<figure>` con `data-focus="pNi"`,
  `tabindex="0"`, `role="button"`, aria-label «Ampliar la imagen de … al máximo
  tamaño»): cursor `zoom-in` y `zoom-out` en el nivel 2.
- CSS: con `rs3-body--fpNi` se ocultan la secuencia (`.rs3-flow`), el resumen
  (`.rs3-idle`), la cabecera y el pie del panel, y `.rs3-pn-body` pasa a
  `position: absolute; inset: 8px` con el fondo blanco de tonos tenues
  verde/rojo y `box-shadow: 0 0 0 2px var(--fn-c)`. La banda inferior pasa de
  1368×498 a **1368×628** y la imagen de 1346×445 a **1350×610** (×1,37).
- Las imágenes se ven **enteras** gracias a `object-fit: contain` dentro de un
  marco `position: absolute` (§8, error 7). Ganancia real medida con
  `png_stats.js`: `nd-res.png` pasa de 318×219 naturales a ~862×594 painted
  (×2,7) y `MatrizER.png` (817×1734) ocupa 560×1188 en lugar de recortarse.
- **Verificación:** `focus_check.js` subió a **383 checks** (18 nuevos del nivel 2:
  marco pulsable y su aria-label, cursor, ocultación de secuencia/resumen/cabecera/
  pie, anillo, segundo clic → panel, otro paso, `ESC` → panel → reposo, y el CSS)
  y `gen_slide8_shot.js` audita **12 estados** (los seis focos + sus seis niveles
  2), ya integrado en `verify-all.cmd` (`slide08.png`, `slide08_fp1`…`fp6.png`,
  `slide08_fp1i`…`fp6i.png`).
- **Resultado:** **54/54 + 383/383**, **TODO OK**, app **52/52**, exit 0. Los 13
  estados del slide 8 (reposo + 6 + 6) sin `clip/tx/OVERFLOW`.

### Zoom y desplazamiento dentro de la imagen ampliada

Petición del usuario (2026-10-02, segunda vuelta): en la imagen ya ampliada se
quiere **un clic en el punto exacto donde se pulse** que la acerque más, poder
**desplazarla con el mouse** y **volver a la pantalla principal con un clic
fuera de la imagen en cualquier nivel de acercamiento**.

- **Archivo nuevo:** `js/slides/slide08Zoom.js`, cargado en `index.html` justo
  antes de `app.js`. Es el primer archivo del proyecto cuyo comportamiento no
  depende solo de los datos: el estado (escala y desplazamiento) es de
  interacción, no de la lámina, así que va en su propio módulo.
- **Cómo convive con `app.js` sin tocar su lógica:** `app.js` escucha el clic en
  fase de **burbuja** sobre `#slideFrame` y conmute el foco de lo que tenga
  `data-focus` (por eso un clic sobre la imagen cerraba el panel). El módulo
  intercepta el clic en fase de **captura** sobre el mismo contenedor y llama a
  `stopPropagation()` **solo** cuando el clic cae dentro de la imagen y ya se está
  en el nivel 2; el clic que abre el nivel 2 no se intercepta (abrir no viene con
  acercamiento de regalo) y el clic de fuera sigue su camino, con lo que
  `app.js` resuelve el nivel anidado y devuelve el resultado. El estado se pone a
  cero con el evento `slide:focus` que `app.js` emite en cada `setScopeFocus`.
- **Transformación en el marco, no en la imagen:** el `<figure class="rs3-pn-zoom">`
  lleva `transform: translate(var(--rs3-tx), var(--rs3-ty)) scale(var(--rs3-z))`
  con `transform-origin: 50% 50%` (la misma caja que usa el `object-fit: contain`
  del `<img>`). Así el punto que se amplía es exactamente el que hay bajo el
  cursor. El JS solo escribe las tres variables y alterna `is-zoom` / `is-drag`.
- **Acercamiento:** ×1,6 por clic hasta **×8**. El anclaje es
  `t' = t + (p − centro − t) × (1 − escala'/escala)`. Sin medidas reales
  (jsdom, o una caja sin tamaño) el tope de desplazamiento no se aplica, para que
  la interacción se pueda probar sin navegador.
- **Desplazamiento:** `mousedown` solo inicia arrastre si hay escala > 1; el tope
  sale del contenido real, `(contentW × escala − cajaW) / 2`, así la imagen no
  sale volando pero tampoco deja huecos. El `click` que el navegador emite al
  soltar se traga y limpia el estado (si no, un arrastre que acababa fuera
  cerraba la lámina).
- **Pista de uso:** `.rs3-zoom-tip` (`.rs3-zoom-nv` con el factor, `×1,0`,
  `×1,6`…) solo se ve en el nivel 2, con `pointer-events: none` para no tapar
  nada. Cursor: `zoom-in` al abrir, `grab` con escala > 1, `grabbing` arrastrando.
- **Verificación:** `focus_check.js` subió a **418 checks** (35 nuevos: captura
  en lugar de burbuja, ×1,6 y tope ×8, anclaje en el punto pulsado, arrastre con
  `mousemove`/`mouseup`, el clic del arrastre no acerca ni cierra, clic fuera →
  panel, reinicio a ×1,0 al reabrir, la pista, `pointer-events`, cursor `grab`,
  y el mismo comportamiento en el resultado 4). `gen_slide8_shot.js` añadió dos
  capturas con acercamiento (`slide08_fp1z.png`, `slide08_fp2z.png`) y dos líneas
  al informe (`acercamiento`, `pista`). Evidencia por píxeles: en
  `slide08_fp1i.png` la matriz ocupa 570 px de ancho y en `slide08_fp1z.png`
  (×2,56) ~980 px, o sea que desborda la caja y se recorta, que es lo pedido.
- **Resultado:** **54/54 + 418/418**, **TODO OK**, app **52/52**, exit 0.

**Errores cometidos al hacerlo (no repetirlos):**

1. **Selectores de clase inexistentes**: el CSS fijaba
   `.rs3-body--fp1 .rs3-panel--p1` pero el renderer solo emitía
   `rs3-panel--green|red`. Con un panel abierto la banda quedaba a
   1368×498 pero **sin imagen**. El panel necesita **las dos** clases:
   `rs3-panel--<color> rs3-panel--<clave>`. El harness lo detecta (`panel -`).
2. **Falta de la regla base `.rs3-body`**: sin `flex: 1 1 auto` + `min-height: 0`
   el cuerpo medía 1408×**99** y los pasos se recortaban 22 px. El harness lo
   delata en reposo (`cuerpo ...x99` y `clip .rs3-paso0 22`).
3. **Resumen sin ocultar en el nivel 2**: al abrir `p1i` se ocultaba `.rs3-flow`
   pero no `.rs3-idle`, así que la banda se quedaba en 1368×**280**. El resumen
   va en la misma regla de `display: none` que la secuencia.
4. **`try` anidados sin cerrar** en `gen_slide8_shot.js`: el informe de los doce
   estados salía vacío (error de sintaxis silencioso en Chrome). Un solo `try`
   por paso; el harness se lee por `<pre id="report">`, y si no aparece es que el
   script no compiló.
5. **Auditoría antes de cargar las imágenes**: `offsetWidth` de un `<img>` sin
   `naturalWidth` da 0 y `object-fit` no se puede comprobar. Los informes se
   lanzan en `window.addEventListener('load', …)`; las capturas no lo necesitan
   (`--virtual-time-budget`).
6. **Paréntesis sin escapar en `verify-all.cmd`**: escribir `(imagen a máximo
   tamaño)` dentro del `echo` de un bloque `if ( … )` rompe el bloque y `cmd`
   responde `No se esperaba … en este momento.` con exit 255. Usar corchetes
   `[nivel 2]`.
7. **`max-height: 100%` sobre un padre elástico**: no resuelve, así que
   `MatrizER.png` (817×1734) y `art-fin.png` (1979×2500) se dibujaban a su
   tamaño natural y **se veían recortadas** (el `overflow: hidden` las cortaba).
   El marco de la imagen va `position: absolute; inset: 0` y el `<img>` con
   `width/height: 100%; object-fit: contain`: la caja es de tamaño definido y la
   imagen entra entera.

## 19. Slide 8: colores alternos, tres niveles de texto y galería de fotos (2026-10-06)

Petición del usuario para el diseño de la página 8 «RESULTADOS (3)»:

1. **Colores del flujograma horizontal**: los subbloques alternan los colores
   de la plantilla quedando **verde, rojo, verde, rojo, verde, rojo**.
2. **Tres niveles de texto** en cada subbloque: el primero (la cifra)
   **mantiene su tamaño** y va en el **color sólido del bloque**; el segundo
   en **negro**; el tercero en **negro y con menor tamaño**.
3. **La banda inferior en reposo no lleva ninguna información.** En su lugar se
   presentan **todas las fotografías de la carpeta `fotos/`** (formato JPG,
   con extensión `.jpeg`): al hacer clic sobre cada una **se amplía** y al
   hacer clic fuera **vuelve a su tamaño normal**.

### Qué cambió

- **`js/data/resultsData3.js`**: los seis pasos pasan a `green`/`red` alternos
  (antes todos rojos). Desaparecen `resumen` y `pista`; aparece `fotos`, el
  array con las ocho rutas `assets/fotos/1.jpeg`…`8.jpeg`. La galería se
  nutre de él.
- **`fotos/`** se copió a **`presentacion-web/assets/fotos/`** (mismas rutas
  relativas desde `index.html`).
- **`js/slides/slide08Results.js`**: `reposo()` ya no pinta cifras ni pista;
  construye la **galería** `.rs3-gal` (8 botones `.rs3-gal-i` con miniatura
  `.rs3-gal-t`) y el **visor** `.rs3-gal-view` con un único `.rs3-gal-big`,
  que el módulo rellena al abrir.
- **Nuevo `js/slides/slide08Photos.js`** (registrado en `index.html` y en
  `verify-all.cmd`): el estado y la interacción de la galería. No toca el foco
  de `app.js`: las miniaturas no llevan `data-focus`, así que el clic de
  `app.js` las ignora. El estado vive en la banda (`.rs3-idle.is-open` +
  `data-foto="N"`), y el CSS muestra el visor. Un clic en una miniatura la
  amplía; cualquier otro clic (el visor, el fondo, o cualquier parte de la
  lámina) la devuelve; `ESC` también; y el evento `slide:focus` de `app.js`
  limpia el estado al abrir un resultado o cambiar de lámina.
- **`css/styles.css`**: `.rs3-p-t` y `.rs3-p-s` en `#000`; `.rs3-p-s` baja a
  `9.8px`; `.rs3-p-c` se mantiene (`17.08px`, `var(--fn-c)` = el color sólido
  del bloque). La banda `.rs3-idle` pasa de cifras a la **retícula 4×2** (`.rs3-gal`,
  `grid-template-columns: repeat(4, 1fr)` + `repeat(2, 1fr)`, gap 8px):
  miniaturas `object-fit: cover` (recortan, como es lo propio de una galería)
  y el visor `.rs3-gal-view` a `position: absolute; inset: 0` con fondo
  oscuro y `object-fit: contain` para el `.rs3-gal-big` (se ve entera).

### Verificación

- **`tools/focus_check.js`** pasó de 418 a **433 checks**: se quitaron los de
  resumen/pista (y el viejo «solo la cifra crítica en rojo» que ya no aplica),
  se corrigió la expectativa de colores a `green/red/green/red/green/red` y se
  añadieron los de la galería (8 miniaturas accesibles, sin información en
  reposo, apertura/cierre con clic y con `ESC`, el cursor `zoom-in`/`zoom-out`,
  el visor con la misma foto que la miniatura, y el CSS de los tres niveles).
- **`tools/gen_slide8_shot.js`**: copia también `assets/fotos/` al harness,
  audita `galeria`/`foto` y añade `res3_shot_foto1.html`/`foto2.html`.
  **`tools/gen_results_heights.js`**: la copia de `assets/` es ahora
  **recursiva**, porque `assets/` ya contiene la subcarpeta `fotos/` (antes
  `copyFileSync` de un directorio rompía el paso). `verify-all.cmd` añade las
  capturas `slide08_foto1.png` y `slide08_foto2.png`.
- **Resultado:** **54/54 + 433/433**, `TODO OK`, 0 clip/tx/OVERFLOW en los 15
  estados. En reposo la banda mide 1368×486 con la retícula y, con una foto
  abierta, el visor cubre 1366×484: la foto 1 (horizontal 1280×720) se dibuja
  a 832×468 y la 2 (vertical 720×1280) a 263×468, ambas enteras.
- Capturas para revisar a ojo: `tools/out/slide08.png` (reposo con la
  galería), `tools/out/slide08_foto1.png` y `slide08_foto2.png` (ampliadas).

**Errores cometidos al hacerlo (no repetirlos):**

1. **`dentro()` devolvía un booleano**: el módulo de la galería nació con
   `return !!(el && el.closest && el.closest(sel))` y luego usaba el resultado
   como si fuera el elemento (`mini.getAttribute`). `focus_check` lo delata
   con `TypeError: mini.getAttribute is not a function`. Devuelve el elemento
   o `null`; lo booleano se ajusta solo con `if (mini)`.
2. **`assets/fotos/` rompía `gen_results_heights.js`**: copiaba `assets/`
   con `copyFileSync` por entrada, y un directorio no se copia así (`EPERM`).
   La copia es recursiva con `readdirSync(..., { withFileTypes: true })`.

## 20. Slide 8: el ART navega por sus tres figuras (2026-10-07)

Petición del usuario para el bloque ART (paso p6) del slide 8:

- **1er clic**: se proyecta `art-fin.png` (abre el resultado, como los demás).
- **2º clic**: la imagen se agranda (nivel 2 `p6i`).
- **A partir de ahí se navega**: el siguiente clic muestra `art1.png`
  agrandada; un clic sobre art1 muestra `art2.png`; después de art2 la
  secuencia vuelve a art-fin (ciclo, confirmado por el usuario).
- **Clic fuera de la zona de la imagen** (o ESC): vuelve a la **página
  principal**, es decir, cierra la exploración por completo y deja la lámina
  en reposo con la galería de fotografías (confirmado por el usuario).
- El ART **ya no se acerca** como los resultados p1..p5: el zoom y el
  arrastre quedan fuera de `p6i`.

### Qué cambió

- **`js/slides/slide08Art.js`** (nuevo): módulo de interacción, mismo patrón
  que `slide08Zoom.js`/`slide08Photos.js` —criterio de interacción fuera de
  app.js—. Intercepta el clic en **fase de captura** sobre `#slideFrame`
  cuando el cuerpo está en `p6i` y lo traga con `stopPropagation`:
  - un clic **dentro de la imagen contenida** avanza en
    `CADENA = ['assets/art-fin.png','assets/art1.png','assets/art2.png']`
    (con vuelta al inicio); «dentro» se calcula con `object-fit: contain`
    (ancho/alto real vs. caja): los clics en la banda vacía que rodea la
    figura cuentan como **fuera**;
  - un clic **fuera** (o ESC) cierra a reposo replicando lo que haría app.js:
    se quitan `data-focus`, las clases `rs3-body--f*` y el `scope-ghost`;
    como `currentFocus()` lee el DOM, app.js deja de ver foco y la lámina
    queda limpia para la siguiente pulsación;
  - el evento `slide:focus` (emitido por app.js en cada `setScopeFocus`)
    reinicia la secuencia: vuelve la primera figura y el contador `1/3`.
  - la pista `.rs3-zoom-tip` del ART pasa a mostrar `N/3` y
    «clic: siguiente imagen · clic fuera: volver».
- **`js/slides/slide08Zoom.js`**: `esNivel2` pasa de `/^p[1-6]i$/` a
  `/^p[1-5]i$/` — el ART queda fuera del zoom, no estorba al nuevo módulo.
- **`css/styles.css`**: `.rs3-body--fp6i .rs3-pn-zoom { cursor: pointer; }`
  en el ART (después de la regla del nivel 2, misma especificidad), el cursor
  ya no «invita a acercar» sino a pulsar.
- **`js/data/resultsData3.js`**: sin cambios (el ART sigue llevando
  `art-fin.png` como imagen base; art1/art2 las conoce el módulo).
- **`assets/`**: se copian `art1.png` y `art2.png` (estaban en la raíz del
  repo, no en la web).
- **`index.html`**: se registra `js/slides/slide08Art.js` entre
  `slide08Photos.js` y `app.js`.

### Verificación

- **`tools/focus_check.js`**: carga el módulo y pasa de 433 a **458 checks**.
  Nuevos: el clic abre p6 y p6i, el avance art-fin→art1→art2 con su contador
  `2/3`/`3/3`, el ciclo (vuelta a art-fin), que no hay transformación
  (`--rs3-z` se queda en 0), el cierre con clic fuera (a reposo, sin ghost, con
  la galería otra vez visible), el cierre con ESC, y que tras el ART los demás
  resultados (p1) siguen abriéndose con normalidad. También que
  `slide08Zoom.js` solo acepta `p1i..p5i`.
- **`tools/gen_slide8_shot.js`**: copia `art1.png`/`art2.png` al harness y
  añade `res3_shot_art1.html`/`art2.html` (abren `p6i` y ponen la figura + el
  contador a mano, pues el harness no carga el módulo). `verify-all.cmd` añade
  las capturas `slide08_art1.png` y `slide08_art2.png`.
- **Resultado:** **54/54 + 458/458**, `TODO OK`, `verify-all.cmd` completo sin
  errores.
- Capturas para revisar a ojo (no las puedo leer yo):
  `tools/out/slide08_art1.png` (art1 agrandada) y `slide08_art2.png` (art2);
  también `slide08_fp6i.png` para la primera figura a máximo tamaño.

## 21. El logo va en la esquina superior derecha de todos los slides (2026-10-07)

### Qué se quería

Colocar la imagen `logo.bmp` en la esquina superior derecha de los 8 slides
sin cruzar información existente, reacomodando la información si hiciera falta.

### Qué se hizo

- **Origen del logo**: `logo.bmp` = BMP 24-bit de 454x100, fondo blanco,
  contenido oscuro con acentos rojo (216,0,0) y verde (0,120,72), la paleta de
  la plantilla. `logo.svg` y `logo-original.bmp` no se usan (el usuario pidió
  `logo.bmp`).
- **Conversión BMP->PNG**: el BMP no tiene canal alfa; los PNG con transparencia
  parcial rompen la lectura del BMP original, así que se convirtió con un
  script temporal de node/zlib sin dependencias
  (`C:\Users\JABUCH~1\AppData\Local\Temp\opencodemp2png.js`,
  bandera `--white=alpha`): **blanco puro -> transparente**, y el resto de
  colores se conservan. Resultado: `presentacion-web/assets/logo.png`
  (~20 KB). Antes de servir conviene revisarlo a ojo contra el original.
- **`js/app.js` (`buildSlides`)**: tras pintar cada slide se le añade
  `<img class="slide-logo" src="assets/logo.png" alt="Logotipo">`, así el logo
  aparece en la app real en los 8 slides.
- **`css/styles.css`**: `.slide` pasa a `position: relative` (era el valor
  por defecto del navegador, ahora explícito para anclar el logo). Nuevas
  reglas tras `.head-rule`:

  ```css
  .slide-logo {
    position: absolute;
    top: 8px;
    right: 12px;
    width: 140px;
    height: auto;
    z-index: 2;
  }
  .slide-cover .slide-logo { top: 150px; }
  ```

  La carátula no tiene `.slide-head`: su banda oscura `.cover-band` mide 140px,
  así que el logo de la portada baja a la zona blanca (top 150px).

### Verificación de colisiones (layout real, no jsdom)

jsdom no calcula rects, así que se midió con Chrome headless
(`--dump-dom`) sobre un harness temporal que monta los 8 slides del app,
inyecta el logo y vuelca rects de logo vs. h2, subtítulo y banda:

- logo a ñajo, títulos centrados: no hay intersección en ningún slide
  (el borde derecho de los títulos/subtítulos queda lejos del logo).
- El caso más justo es el subtítulo largo del slide 8, que se acerca al logo
  por abajo con 7px de aire (1408px de ancho de diseño). No se reacomodó
  nada: con 140x31px a top:8 no hace falta.
- El harness temporal se borró después de medir.

### Harness de captura con logo

- `gen_map_shot.js`, `gen_heights.js`, `gen_results_heights.js`,
  `gen_slide7_shot.js` y `gen_slide8_shot.js` (boot de cada uno) inyectan el
  `.slide-logo` igual que app.js, y copian `assets/logo.png` a
  `tools/out/assets/` para que las capturas headless lo muestren.
- Los PNG de `tools/out/` se regeneraron con `verify-all.cmd shot`:
  el logo ya aparece en reposo y foco (level 1/2, zoom, galería y ART).
- **Corrección**: `gen_results_heights.js` generaba `results_shot_f1.html`
  (un solo fichero con nombre separado por comas) porque el `forEach` envolvía
  la lista de focos en un array extra; `results_shot_f3bimg.html` nunca había
  existido. Se quitó el nivel extra y ahora genera los 11 ficheros
  (f1, f1a, f1b, f2, f3, f2a, f2b, f3a, f3b, f3aimg, f3bimg).

### Estado

- **`tools/focus_check.js`**: pasa de 458 a **466 checks** (los 8 slides llevan
  el `.slide-logo` con `src=assets/logo.png` y `alt=Logotipo`, el fichero
  existe, y el CSS fija absolute+right:12px y top:150px en la carátula).
- **Resultado:** **54/54 + 466/466**, `TODO OK`, `verify-all.cmd` y
  `verify-all.cmd shot` completos.
- Para revisar a ojo (no las puedo leer yo): `tools/out/md_shot.png`,
  `slide06.png`, `slide07.png`, `slide08.png` y `slide08_art1.png`
  (logo arriba a la derecha; en la carátula, bajo la banda).
## 21. El logo va en la esquina superior derecha de todos los slides (2026-10-07)

### Qué se quería

Colocar la imagen `logo.bmp` en la esquina superior derecha de los 8 slides
sin cruzar información existente, reacomodando la información si hiciera falta.

### Qué se hizo

- **Origen del logo**: `logo.bmp` = BMP 24-bit de 454x100, fondo blanco,
  contenido oscuro con acentos rojo (216,0,0) y verde (0,120,72), la paleta de
  la plantilla. `logo.svg` y `logo-original.bmp` no se usan (el usuario pidió
  `logo.bmp`).
- **Conversión BMP->PNG**: el BMP no tiene canal alfa; se convirtió con un
  script temporal de node/zlib sin dependencias
  (`C:\Users\JABUCH~1\AppData\Local\Temp\opencode\bmp2png.js`,
  bandera `--white=alpha`): **blanco puro -> transparente**, y el resto de
  colores se conservan. Resultado: `presentacion-web/assets/logo.png`
  (~20 KB). Antes de servir conviene revisarlo a ojo contra el original.
- **`js/app.js` (`buildSlides`)**: tras pintar cada slide se le añade
  `<img class="slide-logo" src="assets/logo.png" alt="Logotipo">`, así el logo
  aparece en la app real en los 8 slides.
- **`css/styles.css`**: `.slide` pasa a `position: relative` (era el valor
  por defecto del navegador, ahora explícito para anclar el logo). Nuevas
  reglas tras `.head-rule`:

  ```css
  .slide-logo {
    position: absolute;
    top: 8px;
    right: 12px;
    width: 140px;
    height: auto;
    z-index: 2;
  }
  .slide-cover .slide-logo { top: 150px; }
  ```

  La carátula no tiene `.slide-head`: su banda oscura `.cover-band` mide 140px,
  así que el logo de la portada baja a la zona blanca (top 150px).

### Verificación de colisiones (layout real, no jsdom)

jsdom no calcula rects, así que se midió con Chrome headless
(`--dump-dom`) sobre un harness temporal que monta los 8 slides del app,
inyecta el logo y vuelca rects de logo vs. h2, subtítulo y banda:

- logo a la derecha, títulos centrados: no hay intersección en ningún slide
  (el borde derecho de los títulos/subtítulos queda lejos del logo).
- El caso más justo es el subtítulo largo del slide 8, que se acerca al logo
  por abajo con ~7px de aire (1408px de ancho de diseño). No se reacomodó
  nada: con 140x31px a top:8 no hace falta.
- El harness temporal se borró después de medir.

### Harness de captura con logo

- `gen_map_shot.js`, `gen_heights.js`, `gen_results_heights.js`,
  `gen_slide7_shot.js` y `gen_slide8_shot.js` (boot de cada uno) inyectan el
  `.slide-logo` igual que app.js, y copian `assets/logo.png` a
  `tools/out/assets/` para que las capturas headless lo muestren.
- Los PNG de `tools/out/` se regeneraron con `verify-all.cmd shot`:
  el logo ya aparece en reposo y foco (level 1/2, zoom, galería y ART).
- **Corrección**: `gen_results_heights.js` generaba `results_shot_f1.html`
  (un solo fichero con nombre separado por comas) porque el `forEach` envolvía
  la lista de focos en un array extra; `results_shot_f3bimg.html` nunca había
  existido. Se quitó el nivel extra y ahora genera los 11 ficheros
  (f1, f1a, f1b, f2, f3, f2a, f2b, f3a, f3b, f3aimg, f3bimg).

### Estado

- **`tools/focus_check.js`**: pasa de 458 a **466 checks** (los 8 slides llevan
  el `.slide-logo` con `src=assets/logo.png` y `alt=Logotipo`, el fichero
  existe, y el CSS fija absolute+right:12px y top:150px en la carátula).
- **Resultado:** **54/54 + 466/466**, `TODO OK`, `verify-all.cmd` y
  `verify-all.cmd shot` completos.
- Para revisar a ojo (no las puedo leer yo): `tools/out/md_shot.png`,
  `slide06.png`, `slide07.png`, `slide08.png` y `slide08_art1.png`
  (logo arriba a la derecha; en la carátula, bajo la banda).
## 22. Pie institucional (logo-inf.png) solo en pantalla completa (2026-10-07)

### Qué se quería

Al pulsar el botón de pantalla completa, cada slide muestra la imagen
`logo-inf.png` en su parte inferior, **sin cambiar el contenido**.

### Qué se hizo

- **`assets/logo-inf.png`**: la fuente `logo-inf.png` (1316x68, fondo blanco)
  se convirtió a PNG RGBA con el blanco puro transparente (script temporal
  `C:\Users\JABUCH~1\AppData\Local\Temp\opencode\png2png.js`, decodifica
  IHDR/IDAT con zlib y re-empaqueta con el encoder sin dependencias).
- **`js/app.js` (`buildSlides`)**: además del logotipo superior, cada lámina
  recibe un `.slide-foot` con `<img src="assets/logo-inf.png" alt="">`.
- **`js/app.js` (`onFullscreen`)**: al conmutar la pantalla completa se pasa
  `document.body.classList.toggle('is-fullscreen-presentation', !!document.fullscreenElement)`
  (se dispara con el evento `fullscreenchange`).
- **`js/app.js` (`fit`)**: en pantalla completa el área de proyección pasa de
  2816x1440 a **2816x1600**, los 160px extra son la banda del pie.
- **`css/styles.css`**:

  ```css
  .slide-foot { flex: 0 0 80px; display: none; justify-content: center; align-items: flex-end; }
  .slide-foot img { width: 1119px; max-width: 96%; height: auto; }
  body.is-fullscreen-presentation .slide-frame { height: 800px; }
  body.is-fullscreen-presentation .slide-foot { display: flex; }
  ```

  El pie es un **hijo en flujo** del slide (una banda propia de 80px en la
  base de 720px del diseño, que con `zoom:2` del marco se proyecta como 160px
  bajo el contenido). En pantalla completa el marco crece de 720 a 800px, así
  que los cuerpos `flex:1` conservan EXACTAMENTE su altura: el pie va **por
  debajo** del contenido desarrollado, sin superponerse. La imagen mide
  **1119px** de ancho (un 15% menos que el original de 1316px, 1316 * 0.85 =
  1118.6) y con `align-items: flex-end` se apoya **pegado al borde inferior**
  de la banda (y por tanto del slide), lo más abajo posible sin tocar el
  contenido. Fuera de pantalla completa el pie está oculto y el marco vuelve
  a 720px.

### Verificación

- **`tools/focus_check.js`**: pasa de 466 a **480 checks**. Nuevos: las 8
  láminas llevan su `.slide-foot` con `src=assets/logo-inf.png`, el fichero
  existe, la banda CSS es de 80px en flujo, el pie se apoya en el borde
  inferior (`align-items: flex-end`) y su ancho es 1119px (15% menos), el
  marco crece a 800px solo en pantalla completa, el pie está oculto
  (`display:none`) sin pantalla completa, con `fullscreenchange` + un
  `fullscreenElement` falso el `body` recibe la clase y el pie pasa a `flex`,
  al salir se retira, y el contenido conserva posición y altura (va por
  debajo, no encima).
- **Verificación de layout real en Chrome** (harness temporal, borrado tras
  medir, `zoom:1` en el marco): en los **8 slides** el contenido llega
  exactamente hasta y=720, el pie mide 1119px y ocupa de y=742 a y=800
  (pegado al borde inferior, sin superponerse). `TODO OK`.
- **Resultado:** **54/54 + 480/480**, `TODO OK`.
- Captura para revisar a ojo (pie bajo el contenido, slide 2 «Problemática»,
  como se vería en pantalla completa, 2816x1600):
  `tools/out/slide_fs_foot.png`.

## 23. La carátula replica el slide 1 de Ejemplo.pptx (2026-10-07)

### Qué se quería

Rehacer la diapositiva 1 (carátula) para que su **contenido en texto y su
forma** reproduzcan el slide 1 de `Ejemplo.pptx`: banda negra superior con el
logo centrado dentro, textos centrados en el mismo orden del ejemplo, franjas
verticales a la izquierda, tira abstracta rojo/verde a la derecha y etiqueta
vertical. Si hacía falta, colocar `logocaratula.png` centrado en la banda
negra. Y **quitar el logotipo de `logo.bmp` (`logo.png`) de la carátula**.

### Qué se hizo

- **Fuentes**: se descomprimió `Ejemplo.pptx` (PowerShell Expand-Archive) en
  `C:\Users\JABUCH~1\AppData\Local\Temp\opencode\ejemplo_pptx` y se leyó
  `ppt/slides/slide1.xml` + `_rels/slide1.xml.rels`. El slide 1 es 16:9
  (12192000x6858000 EMU); la banda negra mide 1828799 EMU (~26,7% del alto =
  **211px** del diseño de 720px) y es `#262626`; el logo del pptx (media/image6
  = 898x192) está centrado en la banda y tiene la misma proporción que
  `logocaratula.png` (306x65).
- **Recursos**: `D:\ejemplo\tes\LOGOCARATULA.png` -> `assets/logocaratula.png`
  (ya era PNG RGBA transparente con glifos blanco/rojo/verde, sin conversión) y
  `ppt/media/image5.png` (la tira abstracta 754x2001, rojo 223,0,0 y verde
  0,110,73 sobre transparente, la paleta de la plantilla) ->
  `assets/cover-abstract.png`.
- **Proporciones** (la conversión EMU->CSS usa k=1408/12192000; el resultado se
  midió en Chrome y coincide): banda 211px; logo 430px de ancho centrado
  (`aspect-ratio:306/65` para que no colapse a alto 0 antes de cargar la
  imagen); kicker "Presentación Tesis Doctoral" a 41px (~28pt) `#4c4a4f`
  empezando en y≈250; título a 26px (~18pt) `#4c4a4f`; "DOCTORADO EN DIRECCIÓN
  DE PROYECTOS" a 23,5px (~16pt) negrita `#006e49`; "Candidato: Jorge
  Alexander Bucheli García" y "Asesora: Dra. Julia Ayuso, Ph.D." a 20,5px
  (~14pt) negrita `#595959`. Fondo del slide blanco.
- **Forma**: `.cover-accents` (position:absolute, pointer-events:none) con
  tres franjas a la izquierda de 9px (`rgba(255,0,0,.77)` 473px arriba,
  `rgba(73,127,100,.77)` 247px abajo, `rgba(12,12,12,.77)` a x=7px todo el
  alto, replicando el alpha 76862 del pptx), la tira abstracta
  `assets/cover-abstract.png` de 298px a la derecha (object-fit:fill, el pptx
  la estira) y la etiqueta vertical roja `#c0242a` "ETIQUETA" de 43x155px
  `writing-mode:vertical-rl` al pie-derecho (`right:0;bottom:74px`).
- **`js/slides/slide01Cover.js`**: reescrito. Quita kicker "TESIS DOCTORAL",
  la regla/acentos, los iconos de edificios y el `.cover-foot`; usa los nuevos
  campos de `js/data/thesisData.js` (`kickerPresentacion`, `programaDoctorado`,
  `candidato`, `asesora` con los valores reales del ejemplo; los placeholders
  de universidad/programa/doctorando quedan sin uso en la carátula). Conserva
  `.cover-body` (lo usa focus_check para medir alturas).
- **`js/app.js` (`buildSlides`)**: el `.slide-logo` de `logo.bmp` se sigue
  inyectando en los 7 slides de contenido pero **no en `.slide-cover`** (allí
  va su propio `logocaratula.png`). El `.slide-foot` se inyecta en todos.
- **`css/styles.css`**: bloque de carátula reescrito; se eliminó la regla
  `.slide-cover .slide-logo { top:150px }` (y su comentario). El pie y la
  animación no cambian.
- **`tools/focus_check.js`**: pasa de 480 a **496 checks**: el número de
  `.slide-logo` pasa de 8 a **7** (la carátula no lo lleva), se verifica que la
  carátula NO tiene `.slide-logo` y que el CSS ya no define
  `.slide-cover .slide-logo`, la carátula lleva `cover-logo` con
  `assets/logocaratula.png`, `cacc-abstract` con `assets/cover-abstract.png`
  (y ambos ficheros existen), los textos del ejemplo (kicker, programa,
  candidato y asesora) y las reglas CSS clave (fondo blanco, banda 211px
  `#262626`, logo 430px, kicker 41px, etiqueta `#c0242a`).

### Verificación

- **`tools/focus_check.js`**: **496/496 check ok** (carátula sin `.slide-logo`,
  textos y forma del ejemplo presentes).
- **`tools/map_check.js`**: 54/54; `verify-all.cmd`: `TODO OK`.
- **Verificación de layout real en Chrome** (harness temporal borrado tras
  medir, `zoom:2` como la app real, `animation:none` para anular el fadeIn):
  el `.slide` llena exactamente el marco (y0..1440 normal / y0..1600 en
  pantalla completa); banda y0..422 (=211px), logo centrado (cX=1408) en la
  banda, textos centrados y en orden, sin FRAMEOV, sin TEXTX y sin solapes con
  la etiqueta; en pantalla completa el contenido conserva exactamente su
  altura y el `.slide-foot` (y1440..1600 = 720..800px) va debajo.
  **Nota**: como en el propio pptx, el contenedor del título (1060px centrado,
  líneas L0-L3) queda ~115px por debajo de la tira abstracta derecha; la
  fuente la tiene igual (caja del título 333..1332 vs abstract desde 1109).
- Capturas para revisar a ojo (no las puedo leer yo):
  `tools/out/slide01_cover.png` (normal, 2816x1440) y
  `tools/out/slide01_cover_fs.png` (pantalla completa con pie, 2816x1600).
- **Resultado:** **54/54 + 496/496**, `TODO OK`.
- Para revisar a ojo: `logocaratula.png` (306x65) convertido a transparente
  dentro de la banda negra, y la tira abstracta derecha (rojo/verde).

## 24. Carátula: tira abstracta atenuada 25% y fuera la etiqueta ETIQUETA (2026-10-07)

### Qué se quería

En el slide 1, atenuar un 25% el color de los símbolos rojo/verde de la tira
abstracta derecha y **retirar** el rectángulo rojo con el texto "ETIQUETA".

### Qué se hizo

- **`css/styles.css`**: `.cacc-abstract { ... opacity: 0.75; }` (el color queda
  al 75% = atenuado un 25%). Se eliminó por completo la regla `.cacc-tag`
  (cuadro rojo vertical `#c0242a` con "ETIQUETA", que procedía del ejemplo).
- **`js/slides/slide01Cover.js`**: se quitó el `<span class="cacc-tag">ETIQUETA</span>`.
- **`tools/focus_check.js`**: se sustituye el check CSS de `.cacc-tag` por el
  de `.cacc-abstract` con `opacity: 0.75` (mismo total, 496).
- **Ajuste posterior del usuario**: "atenúa más el color de esos símbolos" ->
  `.cacc-abstract` pasa a `opacity: 0.5` (al 50%) y el check de focus_check se
  actualiza a `opacity: 0.5` (sigue en 496).

### Verificación

- Chrome (harness temporal borrado tras medir, `zoom:2`): `tagPresent? no`,
  `abstract opacity 0.5`, el `.slide` llena el marco exactamente y sin
  FRAMEOV; el contenido conserva su altura en pantalla completa (pie y1440..1600).
- **54/54 + 496/496**, `TODO OK`.
- Capturas actualizadas: `tools/out/slide01_cover.png` (2816x1440) y
  `tools/out/slide01_cover_fs.png` (pantalla completa, 2816x1600). Revisar a
  ojo cómo queda la tira abstracta al 75% sobre el fondo blanco.

## 25. Carátula: título repartido en líneas equilibradas (2026-10-07)

### Qué se quería

El título de la carátula cerraba con **"2026" solo en la última línea** (el
`text-wrap` natural dejaba una línea final huérfana de una sola palabra).
Repartir mejor el texto para que 2026 no quedara solo.

### Qué se hizo

- **`css/styles.css`**: `.cover-title { … text-wrap: balance; }`. El navegador
  equilibra las líneas del párrafo: sigue en 5 líneas pero ahora casi iguales
  (8 / 10 / 10 / 9 / 9 palabras); la última lleva
  **"con la normativa ecuatoriana vigente entre 2024 y 2026"** y 2026 ya no
  va solo. Es mejora progresiva: si el navegador no soporta `text-wrap`,
  el título vuelve al reparto natural.
- **`tools/focus_check.js`**: un check nuevo para `text-wrap: balance` en
  `.cover-title` → total **497**.

### Verificación

- Chrome (harness temporal borrado tras medir): `LINES 5` con la última línea
  de 9 tokens que termina en "2026"; la geometría del título no cambia
  (y345..1019 ≈ igual a antes; margen hasta el programa intacto).
- **54/54 + 497/497**, `TODO OK`.
- Capturas actualizadas: `tools/out/slide01_cover.png` y
  `tools/out/slide01_cover_fs.png`. Revisar a ojo el reparto de líneas del
  título (última línea completa, sin huérfana "2026").

## 26. Slide 9 «Estructura de la propuesta de transformación (EPT)» (2026-10-07)

### Qué se quería

Desarrollar el slide 9 con título **"Estructura de la propuesta de
transformación"** (petición posterior del usuario: retirar el "(EPT)" del
encabezado, manteniendo el tipo de letra y el espaciado entre letras), un
diagrama que **resalte lo prioritario** de la lámina, manteniendo los colores
del formato inicial y los pedidos que están en todas las diapositivas (cabecera
con título, regla roja/verde, logotipo superior y pie institucional de pantalla
completa).

**Rework del contenido (última instrucción del usuario):** "rehacer el slide 9,
eliminar el contenido actual y aplicar **muy detalladamente** lo descrito en
`EPTransf.md`, manteniendo la estructura y el formato de colores". El esquema
anterior (flujo 1→2→3 de `PTransf.docx` con la cinta "Prioritario") se **borró
por completo** y se sustituyó por el nuevo diagrama esquemático de **cinco
franjas** de `EPTransf.md` conservando la paleta verde/rojo del deck.

### Contenido de origen (EPTransf.md)

`EPTransf.md` ("Instrucciones específicas para la realización del diagrama")
define la lámina **"ESTRUCTURA DE LA PROPUESTA DE TRANSFORMACIÓN"**: un
esquema en **5 franjas**:

1. **Lógica de transformación** · 4 nodos en cadena verde:
   Análisis normativo, Verificación técnica, Valoración del riesgo (rojo) y
   Control de ingeniería.
2. **Franja central** · Fundamento (izquierda) → **Etapa 1** → **Etapa 2** →
   **Etapa 3** → Propósito (derecha), según EPTransf §4.3: cada etapa como
   tarjeta vertical con su componente (con icono y cápsula de norma) y
   contenidos de verificación.
3. **Resultado esperado** · 3 nodos en cadena verde/rojo/verde:
   Gestión preventiva fortalecida → Condiciones de seguridad mejoradas →
   Actuación técnica más segura y controlada.
4. **Recursos clave** · 7 ítems (Normativa, NTP 324, NTP 330, Matrices,
   Registros de campo, Formatos ART, Personal técnico) con el icono de
   ajustes al inicio.

Contenido por etapa (fiel a EPTransf.md §4.3, con sus viñetas y los
"Recursos requeridos" enumerados por la especificación):

| Etapa | Componente | Viñetas (contenidos) | Recursos |
|---|---|---|---|
| 1 | Componente técnico-normativo base | 4 | 5 pill (solo nombres) |
| 2 | Cuestionarios de chequeo · cápsula **NTP 324** | 4 | 5 pill (solo nombres) |
| 3 | ART + controles de ingeniería · cápsula **NTP 330** | 5 | 5 pill (solo nombres) |

Cada etapa termina con su **franja de salida**: Base técnica y normativa ·
Diagnóstico y medición · Intervención operativa.

### Qué se hizo

- **`presentacion-web/js/data/transformationData.js`** (reescrito):
  `window.EPT = { title, subtitle, logica[4], fundamento, proposito,
  etapas[3], resultado[3], recursosClave[7] }` con todos los textos de
  EPTransf.md. `title` en sentence case (regla del deck). Nota: las dos
  líneas del nombre del componente por etapa van en **un solo string con un
  `<br>`** (`' técnico-normativo base'`, `' de ingeniería'` llevan un espacio
  inicial porque el `<br>` no produce espacio en `textContent`; así los checks
  de texto exacto pasan igual en jsdom).
- **`presentacion-web/js/slides/slide09EPT.js`** (reescrito):
  `window.slideRenderers.ept`, misma firma que los demás. Cabecera común
  (`<header class="slide-head">` con `h2` + `span.ept-subtitle` + regla).
  Bandas: `.ept-logica` (4 `.ept-nodo`), `.ept-central` (`.ept-side--fund`,
  3 `.ept-e` y `.ept-side--prop` con 4 `.ept-arrow`), `.ept-result`
  (`.ept-rs` con 3 `.ept-nodo`), `.ept-rc` (`.ept-rc-items` con 7 ítems e
  icono `gear`). Clases nuevas: `ept-e-head/comp/nombre/cap/list/item/rec/pill/
  out`, `ept-arrow--green/--red/--nodo`. La franja de recursos usa la altura
  restante (`flex: 1`) para apoyar el pie en pantalla completa.
- **`presentacion-web/css/styles.css`**: bloque `DIAPOSITIVA 9 - EPT`
  reemplazado. Nuevas variables `--ept-verde #006e49`,
  `--ept-verde-osc #005a40`, `--ept-verde-claro #eaf6f1`,
  `--ept-rojo #c0242a`, `--ept-rojo-osc #9e1d23`, `--ept-rojo-claro #fcedee`,
  `--ept-gris #eff3f4`, `--ept-line #c9d1d5`. **Cabecera propia de 92px**
  (`.slide-ept .slide-head`) porque el subtítulo de EPTransf.md ocupa **dos
  líneas**; el cuerpo queda en 628px (720−92). Alternancia rojo/verde en
  lógica, etapas y resultado; cápsulas de norma verdes.
- **`presentacion-web/js/icons.js`**: icono **`gear`** añadido (aditivo).
- **`presentacion-web/index.html`**: siguen cargándose `js/data/
  transformationData.js` y `js/slides/slide09EPT.js` (mismos `<script>` de la
  versión anterior).
- **`tools/focus_check.js`**: bloque EPT reescrito; total 527 → **549**.
  Comprueba: registro en `SLIDES`, título exacto (sin "(EPT)", sentence case),
  subtítulo (fortalecimiento de la gestión preventiva en Quito), las 5 franjas,
  4 nodos de lógica (Análisis normativo → … → Control de ingeniería), el
  central con Fundamento/Propósito, las 3 etapas con sus **nombres exactos**
  (segunda línea con el `<br>` y su espacio inicial), **4+4+5 viñetas exactas**
  de EPTransf, cápsulas `NTP 324`/`NTP 330` **solo** en las etapas 2-3 (la 1 no
  lleva), 3 grupos de "Recursos requeridos" con **5 pill** cada uno, las 3
  franjas de salida (Base técnica y normativa | Diagnóstico y medición |
  Intervención operativa), el resultado esperado con sus **3 nodos**, los **7
  ítems** de recursos clave y el CSS verde/rojo (alternancia) / tintes EPTransf /
  `flex:1` del cuerpo. (`Estructura de la propuesta de transformación` pasó a
  sentence case ya desde el hito de los títulos del §26.)
- **`tools/gen_ept_shot.js`** (reescrito): mismo patrón (inyecta el logo y el
  pie como `app.js`, `#report` fuera de pantalla). Audita el nuevo DOM: título,
  subtítulo (2 líneas), cabecera 1408×92, cuerpo 1408×628, **bandas**
  lógica/central/resultado/recursos, conteos, tarjetas 305×412 **iguales 3/3**,
  flechas (4 centrales, 3 de lógica, 2 de resultado), 4 nodos de lógica, 3 de
  resultado, 7 ítems de recursos, **0 clip / 0 tx / 0 frame OVERFLOW**, logo y
  pie presentes.
- **`tools/verify-all.cmd`**: sin cambios (ya incluía `gen_ept_shot.js` y la
  captura `slide09.png` desde la versión anterior).

### Verificación

- **54/54 (map) + 549/549 (focus, slides 1-9)** + `TODO OK` en
  `verify-all.cmd shot`.
- Auditoría Chrome (`gen_ept_shot.js`, `--dump-dom`): cabecera 1408×92, cuerpo
  1408×628, bandas lógica 1364×73 / central 1364×412 / resultado 1364×70 /
  recursos 1364×30; subtítulo en **2 líneas**; **3 tarjetas de 305×412 con
  anchos iguales 3/3**; cápsulas `-,NTP 324,NTP 330`; pill 5,5,5; salidas
  correctas; 7 ítems de recursos; logo presente; pie presente (oculto sin
  pantalla completa); **0 clip / 0 tx / 0 OVERFLOW**.
- Captura nueva: `tools/out/slide09.png` (2816×1440). Revisar a ojo el esquema
  de 5 franjas (lógica → central con las 3 etapas → resultado → recursos) y
  que el subtítulo quepa en 2 líneas.

---

## 27. Slide 9 (EPT): franja central al 75 % de alto y resultado esperado a continuación (2026-10-07)

### Pedido del usuario

> "En el slide 9: el alto de los bloques de etapa 1, 2, 3 redúcelo al 75 % del
> tamaño actual en vertical; el bloque de fundamento y el bloque propósito
> deberán tener la misma altura que los anteriores; el bloque de resultado
> esperado deberá subir y colocarse a continuación de los bloques
> anteriormente mencionados."

### Qué se hizo

- **`presentacion-web/css/styles.css`**:
  - `.ept-central`: pasa de `flex: 1 1 0` (estiraba la franja central a todo
    el alto disponible, 412 px) a **`flex: 0 0 auto` + `height: 309 px`**
    (412 × 0,75 = **309 px**, el 75 % pedido). Sigue con `align-items: stretch`
    y `justify-content: center`.
  - `.ept-e` (Etapas 1-2-3): no cambió su regla; con el alto fijo del contenedor
    queda **309 px** (su `min-height: 100%` resuelve contra los 309 px).
  - `.ept-side` (Fundamento / Propósito): `align-self: stretch` dentro de la
    franja de 309 px les da **la misma altura que las etapas**, como pidió el
    usuario.
  - `.ept-result`: se **eliminó `margin-top: auto`** (lo anclaba al fondo de la
    lámina). Ahora el resultado esperado queda **pegado a la franja central**,
    "a continuación" de las etapas, como pidió el usuario.
  - El alto libre (~111 px) queda al pie de la lámina (bajo la banda de
    recursos clave), al alinearse el conjunto a arriba (`justify-content:
    flex-start` del cuerpo, sin cambios).
- **Sin cambios** en `slide09EPT.js`, `transformationData.js` ni
  `focus_check.js` (no hay checks de alturas en el EPT: el total se mantiene en
  **549**).

### Verificación

- **54/54 (map) + 549/549 (focus) + `TODO OK`** en `verify-all.cmd shot`.
- Auditoría Chrome (`gen_ept_shot.js`, `--dump-dom`): cabecera 1408×92, cuerpo
  1408×628, bandas lógica 1364×75 / **central 1364×309** / resultado 1364×73 /
  recursos 1364×28; **3 tarjetas de 316×309 con anchos iguales 3/3**;
  `items 4,4,5`; cápsulas `-,NTP 324,NTP 330`; pill 5,5,5; salidas correctas;
  logo presente; pie presente (oculto sin pantalla completa);
  **0 clip / 0 tx / 0 OVERFLOW**.
- Captura nueva: `tools/out/slide09.png` (2816×1440). **Revisar a ojo** que la
  franja central quede más compacta (309 px), que Fundamento y Propósito tengan
  la misma altura que las etapas y que el resultado esperado esté pegado debajo
  de la franja central (sin hueco intermedio). Si el alto libre inferior se
  ve descompensado, el usuario decide si se centra el conjunto
  (`justify-content: center` en `.ept-body`) en lugar de alinearlo arriba.

---

## 28. Slide 9 (EPT): conjunto centrado, títulos de etapa +20 % y flechas verde/rojo alternadas (2026-10-07)

### Pedido del usuario

> "Centralo", pero: el texto de los títulos "Etapa 1, Etapa 2, Etapa 3"
> +20 % (aumentando en vertical las franjas del título si hace falta); y las
> flechas entre Fundamento, Etapas y Propósito alternadas **verde, rojo,
> verde, rojo**.

### Qué se hizo

- **`presentacion-web/css/styles.css`**:
  - `.ept-body`: `justify-content` pasa de `flex-start` a **`center`**: el
    conjunto de franjas (lógica → central → resultado → recursos) queda
    **centrado verticalmente** en la lámina, repartiendo el alto libre (~111 px)
    arriba y abajo por igual.
  - `.ept-e-head`: `font-size` de **11px → 13.2px** (+20 %) y `padding` vertical
    de **5px → 7px** para que la franja crezca un poco junto con el título
    (de ~23px a ~30px de alto). Al ser `flex: 0 0 auto`, la franja se adapta sin
    tocar el alto fijo de la tarjeta (309px); la lista `flex: 1` absorbe la
    diferencia (verificado con **0 clip**).
- **`presentacion-web/js/slides/slide09EPT.js`**: la 4.ª flecha de la franja
  central (la que precede a Propósito) pasa de `ept-arrow--green` a
  **`ept-arrow--red`**: la secuencia completa queda **verde → rojo → verde →
  rojo** (Fundamento → Etapa 1 → Etapa 2 → Etapa 3 → Propósito).
- **Sin cambios** en `transformationData.js` ni `focus_check.js` (no hay checks
  de colores de flecha ni de tamaños del título: el total sigue en **549**).

### Verificación

- **54/54 (map) + 549/549 (focus) + `TODO OK`** en `verify-all.cmd shot`.
- Auditoría Chrome (`gen_ept_shot.js`, `--dump-dom`): cabecera 1408×92, cuerpo
  1408×628, bandas lógica 1364×75 / central 1364×309 / resultado 1364×73 /
  recursos 1364×28; **3 tarjetas de 316×309 con anchos iguales 3/3**;
  `items 4,4,5`; cápsulas `-,NTP 324,NTP 330`; pill 5,5,5; salidas correctas;
  flechas centrales en orden **green, red, green, red**; logo presente; pie
  presente (oculto sin pantalla completa); **0 clip / 0 tx / 0 OVERFLOW**.
- Captura nueva: `tools/out/slide09.png` (2816×1440). **Revisar a ojo**: el
  conjunto centrado, el título de etapa más grande dentro de su franja y las
  flechas alternando verde/rojo/verde/rojo.

## 29. Slide 9 (EPT): clic en las etapas muestra su imagen de detalle (pt1..pt4) (2026-10-08)

### Pedido del usuario

> "Que al hacer clic en el bloque de la Etapa 1 aparezca la imagen pt1.png
> (rotando una vez), al hacer clic en Etapa 2 su imagen pt2.png, al hacer clic
> en Etapa 3 su imagen pt3.png; y al hacer clic sobre esta imagen que aparezca
> pt4.png; para todos, al hacer clic fuera de la imagen volver a la pantalla
> principal del slide 9. Mientras estas imágenes se muestran, en el fondo debe
> aparecer la imagen del slide 9 muy atenuada."

### Qué se hizo

- **`presentacion-web/assets/pt1.png` … `pt4.png`**: copiadas desde la raíz
  del repo al directorio de la presentación (ya había que empaquetarlas con el
  resto de imágenes del slide 9).
- **`presentacion-web/js/slides/slide09EPT.js`**:
  - Las tarjetas de etapa pasan a ser accionables: `data-focus="1|2|3"` +
    `role="button"` + `tabindex="0"` (+ `aria-label` "Abrir el detalle de la
    Etapa N"), usando el `num` que ya trae `transformationData.js`.
  - Cuatro overlays montados al final de `.ept-body`, uno por imagen:
    `<div class="ept-img ept-img--N">` con su rótulo `.ept-img-cap`, un
    `<figure class="ept-fig" data-focus="…">` y el `<img src="assets/ptN.png">`.
    **El panel `.ept-img` NO lleva `data-focus`**: así, clic *fuera de la
    imagen* (sobre el panel, la cabecera, o ESC) cierra a la pantalla principal
    mientras que clic *sobre la imagen* actúa sobre la figura.
  - Nivel 2 de la Etapa 3: **pt3 y pt4 comparten `data-focus="3img"`**. Etapa 1
    y 2 (claves `1` y `2`) se cierran solas al pulsar su imagen.
- **`presentacion-web/js/app.js`**:
  - `FOCUS_SCOPES` gana el scope
    `{ sel: 'ept-body', cls: 'ept-body--f', keys: ['1', '2', '3', '3img'] }`
    (sin `parents`: los clics fuera/ESC salen directos a la pantalla principal,
    incluido desde el nivel 2, que es lo pedido).
  - `GHOST_CFG['ept-body']` clona las cuatro franjas
    (`['.ept-logica','.ept-central','.ept-result','.ept-rc']`, pad
    `'6px 22px 8px'`, gap `'7px'`): el ghost (opacity 0.12) atenúa la lámina
    detrás del detalle abierto.
- **`presentacion-web/css/styles.css`**:
  - `.ept-body` gana `position: relative` (ancla de los overlays).
  - `.ept-img`: panel absoluto (`left/top/right/bottom: 8px`), `z-index: 3`,
    fondo **translúcido** `rgba(240,240,242,0.72)` con anillo verde suave: al
    combinarse con el ghost se ve la lámina del slide 9 «muy atenuada» detrás.
  - `.ept-fig`: figura que llena el panel (`flex: 1`, `min-width/height: 0`),
    imagen `max-width/height: 100%` con `object-fit: contain` (sin recortes).
  - Estados: `.ept-body--f1 .ept-img--1`, `--f2 .ept-img--2`, `--f3
    .ept-img--3` y `--f3img .ept-img--4` → `opacity: 1` + `visibility: visible`;
    el resto queda oculto.
  - **Efecto de aparición sencillo**: la imagen se **proyecta de menos a más
    al abrir** (transform `scale(.5 -> 1)` + opacity 0→1, .3s) y **de más a
    menos al cerrar** (transición inversa; la `visibility` se oculta con
    retardo `0s linear .28s` para que se vea la salida). Sustituye al giro de
    360° (`@keyframes ept-rotate`, eliminado) a petición del usuario — ver el
    ajuste al final de esta sección.
- **`tools/gen_ept_shot.js`**: el informe pasa a auditar **5 estados** (`== SIN
  FOCO ==`, `== FOCO 1/2/3/3img ==` y `== RESTAURADO ==`), reportando también
  el overlay visible y su imagen (p. ej. `detalles ept-img--3=1392x612` +
  `imagenes pt3.png`), y genera las capturas `ept_shot_f1/f2/f3/f3img.html`;
  el árbol completo de `assets/` se copia a `out/assets/` (ahora con las pt*).
- **`tools/verify-all.cmd`**: cuatro capturas nuevas
  `out/slide09_f1.png`, `slide09_f2.png`, `slide09_f3.png` y
  `slide09_f3img.png`.

### Decisión anotada (validar con el usuario)

- En el **nivel 2 (pt4)**, tanto el clic **sobre** pt4 como el clic **fuera**
  vuelven a la pantalla principal (sin pasar por pt3), tal como se pidió
  literalmente («para todos, al hacer clic fuera de la imagen volver a la
  pantalla principal»). Alternativa posible del estilo slide 6
  (`parents: {'3img':'3'}`): el clic sobre/ESC en pt4 regresaría primero a pt3.

### Ajuste en la misma sesión: aparición más sencilla (proyección de escala)

Pedido posterior: *"quiero que el efecto de aparición sea más sencillo; que se
proyecte de menos a más al aparecer y de más a menos para desaparecer"*. Se
sustituye el giro de 360° por transiciones de `transform: scale(.5 → 1)` +
`opacity` (0.28–0.3s). Para que la **salida** sea animada, los overlays ya no
usan `display: none` sino `opacity: 0` + `visibility: hidden` (transición de
`visibility` con retardo `0s linear .28s` al ocultarse); los estados de foco
ponen `visibility: visible` inmediato. Los checks de `focus_check.js` pasan de
`display` a `visibility`, y `gen_ept_shot.js` filtra las imágenes visibles por
`visibility` (con layout permanente, `offsetParent` ya no distingue).
Verificado: **54/54 + 593/593 + `TODO OK`**; auditoría Chrome 0 clip/tx/OVERFLOW
en los cinco estados.

### Verificación

- **54/54 (map) + 593/593 (focus, +44 checks) + `TODO OK`** en
  `verify-all.cmd shot`.
- `focus_check.js`: tarjetas accionables con claves `1,2,3`; cuatro figuras con
  `data-focus` `1,2,3img,3img` apuntando a `assets/ptN.png`; clic Etapa 1 → f1
  (muestra pt1 y oculta el resto, ghost `is-on`); clic sobre pt1 cierra; idem
  Etapa 2; Etapa 3 → f3 (pt3 sin pt4) → clic sobre pt3 → `3img` (pt4), clic
  fuera del panel → principal; ESC en los dos niveles → principal; clic en la
  cabecera (fuera de la imagen) → principal; teclado Enter sobre tarjeta e
  imagen; y regex de CSS/motor (overlays ocultos con `opacity 0` +
  `visibility hidden`, proyecto de `scale(.5) -> 1`, visibilidad con retardo al
  cerrar, **ausencia de `ept-rotate`**, FOCUS_SCOPES y GHOST_CFG de `app.js`).
- Auditoría Chrome (`gen_ept_shot.js`): reposo intacto (bandas
  1364×75/309/73/28, tarjetas 316×309); en cada foco solo su detalle
  (1392×612) con su imagen (`pt1/2/3/4.png`); **0 clip / 0 tx / 0 OVERFLOW**
  en los cinco estados.
- Capturas nuevas: `tools/out/slide09.png` (reposo) y `slide09_f1.png`,
  `slide09_f2.png`, `slide09_f3.png`, `slide09_f3img.png` (2816×1440).
  **Revisar a ojo**: el detalle en primer plano, el fondo atenuado del slide 9
  (ghost + panel translúcido) y el efecto de proyección (de menos a más al
  abrir, de más a menos al cerrar).

---

## 30. Slide 9 (EPT): la franja superior se rotula «Secuencia de transformación» (2026-10-08)

Pedido: *«cambiar el título lógica de transformación por secuencia de transformación»*.

- `presentacion-web/js/data/transformationData.js` → `logica.key = 'Secuencia de transformación'`
  (es el único texto visible: `slide09EPT.js` lo imprime en `.ept-band-k`).
  Las clases (`ept-logica`, `ept-band-k`), el CSS y el DOM **no cambian**, así
  que no hay que tocar `FOCUS_SCOPES` ni los selectores de foco.
- `tools/focus_check.js`: el check de la franja pasa a
  `/Secuencia de transformación/i` y su mensaje describe el rótulo nuevo.
- El rótulo crece 3 caracteres; no hay ancho fijo en `.ept-band-k`, y la
  auditoría de `gen_ept_shot.js` sigue dando **0 clip / 0 tx**.
- `EPTransf.md` conserva su redacción original (documento fuente, no editar).
- Verificado: **54/54 (map) + 593/593 (focus) + `TODO OK`** con
  `verify-all.cmd shot`; capturas nuevas en `tools/out/slide09*.png`.
  **Revisar a ojo**: `slide09.png` (rótulo de la franja superior).

---

## 31. Slide 10 «Validación»: mapa mental del proceso Delphi (2026-10-09)

Pedido: *«genera la diapositiva 10 validación, puedes guiarte de 1Validacion.md
y Validacion.docx, mantén el formato de las demás diapositivas, aplícalo al
panel de diapositivas … coloca el nombre 10. Validación y deja el título del
título de la diapositiva que está en el .md»*.

**Fuente.** Contenido literal de `Validacion.docx` (método Delphi con 8 expertos
en 3 rondas); `1Validacion.md` describe la estructura. Ni `1Validacion.md` ni
`Validacion.docx` se editan (documentos fuente). La paleta del `.md`
(`#087A59`/`#C9252D`) se **alinea** con los tokens ya establecidos del deck
(`#006E49`/`#C0242A`) para conservar el formato, como en el slide 9.

**Datos** — `presentacion-web/js/data/validationData.js` (nuevo, solo datos,
`window.VALIDACION`): `title` «Proceso de validación de la propuesta», `subtitle`,
`nota`, `core` (núcleo «Validación / de la propuesta» · Método Delphi · 3 rondas
· 8 expertos · criterios), `panel` (Panel experto · 8 expertos · 5 áreas · apoyo),
`rondas[3]` (Ronda 1 verde «Aceptación inicial» 99,46 % / 183 de 184; Ronda 2
roja «Evaluación técnica» 4,958 / 5 · CV 4,04 %; Ronda 3 verde «Consenso final»
2,973 / 3 · 97,32 % Sí), cada una con su tabla del modal, y `sintesis` (flujo
Aceptación inicial → Evaluación técnica → Consenso final, 3 cápsulas y la tabla
comparativa de 5 columnas).

**Render** — `presentacion-web/js/slides/slide10Validation.js` (nuevo): `.vl-map`
(grid 3×3 con áreas `panel · core · r1/r2/r3`, conectores SVG `.vl-links`
decorativos), `.vl-panel`, `.vl-core` (elipse verde oscuro) y 3 `.vl-round`
clicables (`data-focus` r1/r2/r3, `role="button"`, `tabindex="0"`), banda
`.vl-synth` (`data-focus="rn"`), `.vl-note` y 4 modales `.vl-modal--r1/r2/r3/rn`
con `.vl-card` y botón de cierre (`data-focus`, icono `compress`). Guard en fase
de captura sobre `#slideFrame`: un clic dentro de `.vl-card` que **no** caiga en
un `[data-focus]` propio de la tarjeta hace `stopPropagation()` para que no llegue
a `app.js` y cierre el modal (se corrigió el guard para ignorar el `data-focus`
del propio scope `.vl-body`).

**Registro.** `thesisData.js` → `{ id: 10, key: 'validacion', label: 'Validación' }`
(la pestaña muestra `10. Validación`). `index.html` carga
`js/data/validationData.js` y `js/slides/slide10Validation.js` antes de `app.js`.
`app.js` → `FOCUS_SCOPES` añade `{ sel: 'vl-body', cls: 'vl-body--f', keys:
['r1','r2','r3','rn'] }` y `GHOST_CFG['vl-body']` = `{ nodes: ['.vl-map',
'.vl-synth'], pad: '6px 22px 8px', gap: '8px' }`.

**CSS** — nuevo bloque `.vl-*` al final de `css/styles.css` (mapa, panel, núcleo
elipse, rondas verde/rojo, síntesis, nota, modales y los estados
`.vl-body--fr1/fr2/fr3/frn` que muestran `visibility:visible` + `scale(.86→1)`).

**Verificación.**
- `tools/focus_check.js`: carga los dos ficheros nuevos; recuentos `slidesAll`
  9→10, `logos` 8→9, `feet` 9→10, `h2s` 8→9; añade el check del slide 10 en
  `SLIDES` y ~57 `has()` nuevos (estructura, colores, tablas, modales, apertura/
  cierre por clic/teclado/ESC, guard del modal y CSS). Total **604 → 654**.
- `tools/verify-all.cmd`: `node --check` de los dos ficheros; `gen_slide10_shot.js`;
  capturas `slide10.png` + `slide10_fr1/fr2/fr3/frn.png`.
- `tools/gen_slide10_shot.js` (nuevo, modelo `gen_ept_shot.js`).
- **54/54 (map) + 654/654 (focus) + `TODO OK`** con `verify-all.cmd shot`.
  Auditoría Chrome (`vl_shot.html`, `--dump-dom`): **0 clip / 0 tx / 0 OVERFLOW /
  0 MISSING** en reposo y en los cuatro focos. Geometría: cuerpo 628 px, mapa
  528 px, núcleo 499×177, síntesis 62 px, modal 1392×612.
- **Revisar a ojo**: `slide10.png` (mapa mental) y `slide10_fr1/fr2/fr3/frn.png`
  (modales de ronda y tabla comparativa).

## 32. Slide 10 (Validación): mapa a altura natural y conjunto centrado en vertical (2026-10-10)

Pedido: *«al momento de poner en pantalla completa, asegúrate que el slide 10
esté centrado en vertical»*. Se aclaró que el mapa no debe estirarse y que el
grupo (mapa + síntesis + nota) quede centrado con aire arriba y abajo, como el
slide 9.

**Diagnóstico.** El cuerpo del slide 10 mide 628 px tanto en ventana (marco 720)
como en pantalla completa (marco 800, con pie de 80), así que el cambio es
idéntico en ambos modos. Antes, `.vl-map` tenía `flex: 1 1 auto` y **llenaba** el
cuerpo (528 px): no había hueco que centrar y el mapa se estiraba. Ahora se
midió que su altura natural es **471 px**.

**Cambio (solo CSS, `presentacion-web/css/styles.css`):**
- `.vl-body`: se añade `justify-content: center` → el conjunto se reparte con
  aire arriba y abajo (≈35/35 px) en vez de quedar pegado.
- `.vl-map`: `flex: 1 1 auto` → **`flex: 0 0 auto`** → el mapa toma su altura
  natural (471 px), más compacto, y deja de estirarse.

Sin cambios de DOM/clases ni de renderer (los modales siguen absolutos sobre
`.vl-body`, centrados).

**Verificación.**
- `tools/focus_check.js`: dos `has()` nuevos (`.vl-body` con
  `justify-content:center` y `.vl-map` con `flex: 0 0 auto`); total **654 → 656**.
- **54/54 (map) + 656/656 (focus) + `TODO OK`** con `verify-all.cmd shot`.
- Auditoría Chrome (`vl_shot.html`, `--dump-dom`): **0 clip / 0 tx / 0 OVERFLOW /
  0 MISSING** en reposo y en los cuatro focos. Geometría nueva: cuerpo 628 px,
  **mapa 1364×471**, núcleo 499×158, rondas 499×149 / 423×158 / 499×149, síntesis
  62 px, modal 1392×612 (sin cambios).
- Capturas regeneradas: `tools/out/slide10.png` y `slide10_fr1/fr2/fr3/frn.png`.
  **Revisar a ojo**: el conjunto centrado con el mapa más compacto.

## 33. Slide 9 (EPT): la Etapa 2 abre un segundo nivel con riesgos1 + riesgos2 en paralelo (2026-10-10)

Pedido: *«al hacer clic en el bloque Etapa 2 debe desplegarse la imagen pt2.png,
y al hacer clic en esta quiero que se desplieguen simultáneamente uno al lado de
otro las imágenes riesgos1.png y riesgos2.png»*.

**Cambios.**
- `presentacion-web/js/slides/slide09EPT.js`: la figura de la Etapa 2 pasa de
  `data-focus="2"` a **`data-focus="2img"`** (like la Etapa 3/pt3) y se añade el
  overlay **`.ept-img--2b`** con un contenedor **`.ept-pair`** que aloja dos
  `.ept-fig` (`data-focus="2img"`): `assets/riesgos1.png` (edificación) y
  `assets/riesgos2.png` (infraestructura), en ese orden (izq. → der.).
- `presentacion-web/css/styles.css`: `.ept-pair` (flex `row`, `gap:14px`,
  ancho 100%, `flex:1 1 auto`) con sus `.ept-fig` a `flex:1 1 50%` y cursor
  `zoom-out`; se añaden `.ept-body--f2img .ept-img--2b` (visible) y su
  `.ept-fig` (`scale(.5→1)`) a las listas de estados.
- `presentacion-web/js/app.js`: `FOCUS_SCOPES` de `ept-body` pasa a
  `keys: ['1','2','2img','3','3img','rs']`.
- `tools/gen_ept_shot.js`: el informe y las capturas incluyen el estado `2img`
  (y `.ept-pair` en las listas de clip/overflow).
- `tools/verify-all.cmd`: nueva captura `slide09_f2img.png` (`ept_shot_f2img.html`).
- `tools/focus_check.js`: figuras de detalle 5 → **7** (5 sencillas + el par);
  reordenado el `data-focus` a `1,2img,2img,2img,3img,3img,rs`; checks nuevos del
  par (assets, `.ept-pair`), de la interacción pt2 → 2img y del CSS; total
  **656 → 663**.

**Verificación.**
- **54/54 (map) + 663/663 (focus) + `TODO OK`** con `verify-all.cmd shot`.
- Auditoría Chrome (`ept_shot.html`, `--dump-dom`) del estado `2img`:
  `detalles ept-img--2b=1392×612`, `imagenes riesgos1.png,riesgos2.png` (solo el
  par visible, pt2 detrás); **0 clip / 0 tx / 0 OVERFLOW / 0 MISSING**.
- Capturas nuevas/actualizadas: `tools/out/slide09_f2img.png` (además de las ya
  existentes `slide09*.png`). **Revisar a ojo**: el par de riesgos lado a lado.

---

## 34. Slide 11 «Conclusiones»: seis bloques, chips normativos y validación Delphi como cajas; interacción en dos pasos (2026-10-10)

Slide nuevo (`js/slides/slide11Conclusions.js` + `js/data/conclusionsData.js`,
`CONCLUSIONES.docx` / `Conclusiones.md` como fuente). Cierra el deck con seis
bloques encadenados 1→6, conectores radiales hacia el nodo central
«CONCLUSIONES» y franja de **APORTE CENTRAL**.

**Diseño (verde/rojo del deck).**
- Seis `.cn-card` (213×338) encadenadas por cinco `.cn-arrow` (chevRight), con
  `.cn-strata` (SVG `.cn-links`, seis `path` Bézier) bajando al `.cn-node`
  (158×158) y `.cn-aporte` (1364×30). Alternan verde/rojo; **el bloque 6 va en
  rojo** (mismo formato que los bloques 2 y 4). Se eliminaron las reglas
  `.cn-card--dark` / `.cn-dialog--dark` y se adaptaron `.cn-checks li` y
  `.cn-checks-ico` al rojo.
- **Códigos normativos como chips**: los items con norma pasaron de `(…)` en el
  texto a objetos `{ t, c }` que el render `lista()` vuelve
  `<span class="cn-li-t">` + `<span class="cn-li-c">`. `.cn-li-c` es un
  recuadro blanco con borde de acento, radius 7, `font-size:10px`,
  `font-weight:800`, en línea propia (`.cn-list li` pasó a flex column). Items:
  b1-4 `D.E. 255, A.M. 196; A.M. 122`; b2-2 `5-I, 7-E`; b2-3 `23-I, 21-E`;
  b3-3 `NTP-330`.
- **VALIDACIÓN DELPHI como cajas** (mini del bloque 5, `tipo:'cajas'`):
  `.cn-bgrid` (flex wrap) con `.cn-caja` (`1 1 calc(50% - 4px)`), items
  `{ r, v, cv?, d }` → `.cn-caja-r` (6.8px), `.cn-caja-v` (10px),
  `.cn-caja em.cn-caja-cv` (**10px, 800, verde oscuro**; selector con
  especificidad para vencer a `.cn-caja em`), `.cn-caja em` (detalle 6.8px).
  Contenido: Ronda 1 `99,46 % / Aceptación inicial favorable`; Ronda 2
  `4,958 / 5`, `CV 4,04 %`, `Alto consenso técnico`; Ronda 3 `2,973 / 3`,
  `CV 5,45 %`, `DE global 0,162`; Ronda final `8 expertos aprueban / Aprobación
  final de la propuesta`.
- **Interacción en dos pasos** (pedido: *«…se presente después de que se
  visualice el mismo bloque agrandado… al hacer clic una vez, el otro al hacer
  clic nuevamente»*): 1.er clic en un bloque → **copia agrandada y centrada**
  (`.cn-zoom` con `.cn-zoom-card`, `transform: scale(1.72)`, foco `zbN`); 2.º
  clic sobre esa copia → **pantalla con la conclusión** (`.cn-modal--bN`,
  foco `bN`). Cerrar la conclusión (✕, ESC o fondo) vuelve al bloque agrandado;
  otro ESC (o clic fuera) vuelve a la vista completa.

**Cambios.**
- `js/app.js`: `FOCUS_SCOPES` de `cn-body` a dos niveles
  `keys:['zb1'..'zb6','b1'..'b6']` con `parents:{ bN:'zbN' }`.
- `js/slides/slide11Conclusions.js`: tarjetas con `data-focus="zbN"`; `bloque(b,
  zoom)` genera también la copia `.cn-zoom` (`data-focus="bN"`, role/tabindex)
  por bloque; guarda de clic dentro de `.cn-dialog` intacta.
- `css/styles.css`: bloque `.cn-zoom` / `.cn-zoom-card` + reglas `fzb1..fzb6`
  (copia visible, resto del diagrama oculto sobre el ghost).
- `tools/gen_slide11_shot.js`: el informe audita reposo + `zb1..zb6` + `b1..b6`
  y genera `cn_shot.html` + `cn_shot_fzb1..zb6.html` + `cn_shot_fb1..fb6.html`.
- `tools/verify-all.cmd`: `node --check` de `conclusionsData.js` /
  `slide11Conclusions.js`, `node gen_slide11_shot.js` y capturas
  `slide11.png`, `slide11_zoom1..6.png`, `slide11_fb1..fb6.png`.
- `tools/focus_check.js`: checks del slide 11 reescritos (DOM, dos niveles de
  foco, interacción en dos pasos, CSS, `app.js`); total **663 → 712**.

**Verificación.**
- **54/54 (map) + 712/712 (focus) + `TODO OK`** con `reanudar.cmd shot`.
- Auditoría Chrome (`cn_shot.html`, `--dump-dom`) en reposo, `zb1..zb6` y
  `b1..b6`: tarjetas 213×338, nodo 158×158, aporte 1364×30, zoom visible
  `cn-zoom--bN=1392×612::213×338`; **0 clip / 0 tx / 0 OVERFLOW**.
- Capturas: `tools/out/slide11.png`, `slide11_zoom1..6.png`,
  `slide11_fb1..6.png`. **Revisar a ojo**: el bloque agrandado y centrado.

---

## 35. Slide 12 nuevo — Recomendaciones (según `RECOMENDACIONES.docx` / `recomendacion1.md`)

**Pedido.** Añadir la diapositiva **RECOMENDACIONES** (slide 12) siguiendo
`recomendacion1.md`, con la misma estructura del proyecto, **sin espacios en
blanco**, con tipografías proporcionadas y conservando la paleta del deck. El
contenido es obligatorio: sale de `RECOMENDACIONES.docx` (no se inventa nada).

**Diseño (1408×720).**
- `.slide-head` (92px) con título **RECOMENDACIONES** y subtítulo «Proyección
  metodológica, aplicación práctica y continuidad académica».
- `.rc-body` (flex column, `flex:1`): **tres columnas de ámbito** (`.rc-cols` →
  `.rc-amb--green`, `.rc-amb--red`, `.rc-amb--green`) y **banda operacional**
  (`.rc-flow`: Ampliar → Aplicar → Actualizar → Investigar, con el último nodo
  en rojo). **Se eliminó** el antiguo nodo superior verde en cápsula.
- Cada columna tiene cabecera sólida y subbloques (`flex:1 1 0`, `min-height:0`)
  que **llenan la altura** (verificado sin huecos). Subbloques 1-2 metodológicos
  (verde), 3-5 prácticos (**rojo**) y 6 académico (**verde**, `modo:'lista'` con
  checklist vertical de 7 líneas de proyección).
- **Interacción por clic (un nivel)**: cada subbloque lleva
  `data-focus="rc1..rc6"` + `role`/`tabindex`. Al pulsarlo se abre su detalle
  ampliado (`.rc-modal--rcN` con `.rc-card` que pasa de `scale(.86)` a `1`,
  espejo del patrón `.vl-*` del slide 10). Cierra con ✕, ESC, clic en el fondo
  del modal o clic fuera; un clic dentro de la tarjeta no cierra (guarda de
  propagación en captura, igual que en los slides 10-11).

**Cambios.**
- `js/data/recomendacionesData.js` (NUEVO): `window.RECOMENDACIONES` con
  `title`, `subtitle`, tres `ambitos` (con `subs`: `key/num/icono/titulo/
  modo/kws/sentido/cierre/detalle`) y `flujo` de cuatro nodos.
- `js/slides/slide12Recomendaciones.js` (NUEVO): renderer
  `window.slideRenderers.recomendaciones` (helpers `subt()`/`ambito()`; sin
  logotipo/pie, que los inyecta `app.js`).
- `js/icons.js`: icono `refresh` (nodo «Actualizar»).
- `js/data/thesisData.js`: `{ id: 12, key: 'recomendaciones', label:
  'Recomendaciones' }`.
- `js/app.js`: `FOCUS_SCOPES` de `rc-body` con `keys:['rc1'..'rc6']` (sin
  `parents`) y `GHOST_CFG` atenuando `.rc-cols` y `.rc-flow`.
- `index.html`: enlaza `recomendacionesData.js` (tras `conclusionsData.js`) y
  `slide12Recomendaciones.js` (tras `slide11Conclusions.js`).
- `css/styles.css`: sección `.slide-recomendaciones` + clases `.rc-*` (tokens
  `--rc-verde/--rc-verde-osc/--rc-rojo/--rc-gris/--rc-line`), espejo del modal
  del slide 10 y reglas `frc1..frc6`.
- `tools/gen_slide12_shot.js` (NUEVO): genera `rc_shot.html` (informe reposo +
  `rc1..rc6`) y `rc_shot_frc1..6.html`.
- `tools/verify-all.cmd`: `node --check` de `recomendacionesData.js` /
  `slide12Recomendaciones.js`, `node gen_slide12_shot.js` y capturas
  `slide12.png` + `slide12_frc1..6.png`; anotación (12 slides, focus 770).
- `tools/focus_check.js`: checks del slide 12 (DOM, foco único, CSS, `app.js`),
  conteos 11→12 slides / logos 10→11 / pies 11→12 / títulos 10→11; total
  **712 → 758 → 759 → 760 → 761 → 762 → 763**.
- `tools/inventario.json`: añadidos los archivos de los slides 9-12 que faltaban
  en el manifiesto (`validationData.js`, `conclusionsData.js`,
  `recomendacionesData.js`, `slide10..12*.js`, `gen_slide10..12_shot.js`,
  `pt2..pt5.png`, `iniciar.cmd` y fuentes `.md`/`.docx`); mínimos de
  `js/data` 10→13 y `js/slides` 9→15.

**Verificación.**
- **54/54 (map) + 770/770 (focus 1-12) + `TODO OK`** con `reanudar.cmd shot`.
- Auditoría Chrome (`rc_shot.html`, `--dump-dom`) en reposo y `rc1..rc6`:
  cabecera 1408×92, cuerpo 1408×628 (llenan los 720), columnas 449×577 cada una,
  subbloques 258/170/523 de alto, banda 1372×29, modales 1392×612::600×179;
  **0 clip / 0 tx / 0 OVERFLOW**.
- Capturas: `tools/out/slide12.png` + `slide12_frc1..6.png`. **Revisar a ojo**:
  las tres columnas de ámbito y el detalle ampliado de cada subbloque.

---

## 36. Pestañas de navegación abreviadas (12 slides) + intercambio de color en el slide 12

**Pedido.** (a) Quitar el bloque superior verde en cápsula del slide 12. (b) Que
la barra de pestañas superior **se vea entera** con los 12 slides, abreviando las
palabras. (c) Que los bloques **3-5 (Ámbito práctico)** pasen a **rojo** y el
bloque **6 (Ámbito académico)** a **verde**.

**Cambios.**
- `js/slides/slide12Recomendaciones.js`: **eliminado** el nodo superior
  `.rc-node` (y `js/data/recomendacionesData.js` sin el objeto `nodo`);
  `js/app.js` `GHOST_CFG` de `rc-body` ya no atenúa `.rc-node`.
- `js/data/thesisData.js`: etiquetas de pestaña abreviadas → `Carátula`,
  `Problematización`, `Objetivos`, `Teorías`, `Metodología`, `Resultados (1)`,
  `Resultados (2)`, `Resultados (3)`, `P. Transformación`, `Validación`, `Conclusiones`, `Recomendaciones`.
- `css/styles.css`: el encabezado pasa de `height:54px` a `min-height:54px`;
  `.tabs` con `flex-wrap:wrap` (a anchos estrechos baja a dos líneas y el
  encabezado crece, **nada queda cortado**); `.tab` a `font-size:11px`,
  `padding:6px 9px`, `gap:4px`. Medido en Chrome: **una línea a ≥1366 px** y
  **dos líneas a 1280/1152** con `tabs scroll == client` (overflow 0) en todos.
- `js/data/recomendacionesData.js`: ámbito **práctico `color:'red'`** (bloques
  3-5) y ámbito **académico `color:'green'`** (bloque 6); el metodológico sigue
  `green`. Los modales heredan el acento por `--rc-accent`.
- `tools/focus_check.js`: checks de color del slide 12 actualizados (práctico
  rojo, académico verde) y `tabGo('6. Resultados (1)'/'7. Resultados (2)'/'8. Resultados (3)'/
  '9. P. Transformación')`; total **770**.
- `tools/gen_slide12_shot.js`: retirado `.rc-node` del informe de geometría.

**Verificación.**
- **54/54 (map) + 770/770 (focus 1-12) + `TODO OK`** con `reanudar.cmd shot`.
- Auditoría Chrome (`rc_shot.html`) sin nodo: columnas 1372×577, subbloques
  258/170/523 de alto, banda 1372×29; **0 clip / 0 tx / 0 OVERFLOW**.

## 37. Slide 12: subbloque 1 como diagrama radial (C. Chequeo + NTP)

**Pedido.** El subbloque 1 («Ampliación de instrumentos») ya no muestra los
minibloques en fila, sino un **diagrama radial/circular**: arriba la cápsula
**«C. Chequeo»**, alrededor los cinco tipos de riesgo —**Físicos, Químicos,
Biológicos, Ergonómicos, Psicosociales**— y al pie, enlazados con una flecha,
**NTP 324 → NTP 330**.

**Cambios.**
- `js/data/recomendacionesData.js`: subbloque `rc1` con `modo:'radial'` y nuevos
  campos `hub:'C. Chequeo'`, `radios:[…5 riesgos…]`, `ntp:['NTP 324','NTP 330']`
  (se retira la lista `kws`); se conservan `sentido` y `cierre`.
- `js/slides/slide12Recomendaciones.js`: `subt()` gana la rama `radial` que
  emite `.rc-radial > .rc-radial-canvas` (hub, anillo `.rc-radial-ring` y cinco
  `.rc-radial-node--n1..n5`) más `.rc-radial-ntp` con los dos `.rc-ntp` y la
  flecha `.rc-radial-arrow` (`Icons.svg('chevRight',11)`).
- `css/styles.css`: bloque `.rc-radial*` (canvas `position:relative`; hub
  absoluto arriba centrado; anillo de elipse `84%×66%` centrado al 60%; nodos
  absolutos por porcentajes: n1 12%/50%, n2 30%/80%, n3 50%/88%, n4 70%/80%,
  n5 88%/50%; pie NTP centrado). Todo con `min-height:0`.
- `tools/focus_check.js`: check del radial (hub + anillo + 5 nodos + 2 NTP);
  total **770**.
- `tools/gen_slide12_shot.js`: se añaden `.rc-radial`/`.rc-radial-canvas` al
  control de recorte, `.rc-radial-hub`/`.rc-radial-node`/`.rc-ntp` al de texto
  volado y `.rc-radial`/`.rc-radial-node` al de desbordamiento de lámina; el
  informe lista la caja de cada nodo y del pie NTP.

**Geometría medida (Chrome, `rc_shot.html`).** cuerpo radial 417×166; hub
«C. Chequeo» 94×20; nodos de 16 px de alto (Físicos 45, Químicos 54, Biológicos
57, Ergonómicos 68, Psicosociales 70) sin salir del canvas; chips NTP 63×17;
**0 clip / 0 tx / 0 OVERFLOW** en reposo y en `frc1..frc6`.

**Verificación.** **54/54 (map) + 770/770 (focus 1-12) + `TODO OK`** con
`reanudar.cmd shot`.

## 38. Slide 12: el detalle del subbloque 1 incorpora el radial agrandado

**Pedido.** Al pulsar el subbloque 1, además del texto de su detalle, debe
mostrarse **de forma agrandada** el mismo **diagrama radial** que ya se ve en el
subbloque.

**Cambios.**
- `js/slides/slide12Recomendaciones.js`: el diagrama se extrae a la función
  `radial(sub, big)` (reutilizada por el subbloque y por el detalle). El detalle
  pasa a `<div class="rc-card-body">` con `.rc-card-txt` (párrafos + cierre) y,
  solo si `modo==='radial'`, `.rc-card-fig` con `radial(sub, true)`
  (`.rc-radial--big`).
- `css/styles.css`: `.rc-card--radial` más ancho (`min(940px,94%)`);
  `.rc-card--radial .rc-card-body` en fila (texto 42 % / figura 58 %),
  `.rc-card-fig` 330 px de alto y `.rc-radial--big` con hub/nodos/NTP mayores.
  El resto de tarjetas no cambia (`.rc-card-body{display:block}`).
- `tools/focus_check.js`: check del radial agrandado dentro del detalle;
  total **770**.
- `tools/gen_slide12_shot.js`: `.rc-card-body`/`.rc-card-fig` al control de
  recorte y `.rc-card--radial`/`.rc-card-fig` al de desbordamiento.

**Geometría medida (Chrome, `rc_shot.html`, foco rc1).** tarjeta del detalle
**940×423**; canvas del radial grande 512×301; nodos de 24 px de alto
(Físicos 64 … Psicosociales 99) sin salir del canvas; chips NTP 89×25;
**0 clip / 0 tx / 0 OVERFLOW**.

**Verificación.** **54/54 (map) + 770/770 (focus 1-12) + `TODO OK`** con
`reanudar.cmd shot`.

## 39. Slide 12: subbloque 2 como flujo de dos niveles

**Pedido.** El subbloque 2 pasa de chips a un **diagrama de flujo en dos
niveles**: arriba **Objetividad → Trazabilidad**, bajando a **Comparabilidad**,
a la izquierda **Menor subjetividad** y subiendo de nuevo a **Objetividad**
(ciclo cerrado); además **subir el tamaño del texto**.

**Cambios.**
- `js/data/recomendacionesData.js`: subbloque `rc2` con `modo:'flujo2'` (los
  cuatro rótulos siguen en `kws`, en orden TL, TR, BR, BL).
- `js/slides/slide12Recomendaciones.js`: `subt()` gana la rama `flujo2` que
  emite `.rc-flujo2` con cuatro `.rc-f2-node--tl|tr|br|bl` y cuatro flechas
  `.rc-f2-arrow--r|d|l|u` (icono `chevRight` girado).
- `css/styles.css`: `.rc-flujo2` como rejilla `1fr auto 1fr` × `auto 1fr auto`
  con las celdas de nodo/flecha asignadas por `grid-area`; nodos a `11px` (frente
  a los 8.8px de los chips).
- `tools/focus_check.js`: check del flujo (4 nodos + 4 flechas y rótulos
  correctos); total **770**.
- `tools/gen_slide12_shot.js`: `.rc-flujo2` al control de recorte y al de
  desbordamiento y `.rc-f2-node` al de texto volado.

**Geometría medida (Chrome, `rc_shot.html`).** `.rc-flujo2` 429×193 dentro del
subbloque; **0 clip / 0 tx / 0 OVERFLOW**.

**Verificación.** **54/54 (map) + 770/770 (focus 1-12) + `TODO OK`** con
`reanudar.cmd shot`.

## 40. Slide 12: ajustes del bloque 2 (flechas, márgenes y detalle) y texto del bloque 6

**Pedido.** (a) Dar **más cuerpo** a las flechas del flujo del bloque 2.
(b) Separar los cuatro subbloques de los **bordes superior e inferior**.
(c) Al pulsar el bloque 2, mostrar **también el flujo agrandado** junto al texto
(como el bloque 1). (d) Corregir en el bloque 6 el rótulo a
**«Aplicaciones longitudinales en obra»**.

**Cambios.**
- `css/styles.css`: las flechas pasan a **insignia circular** (24 px, fondo
  `--rc-claro`, borde y color de acento) y `.rc-flujo2` cambia a filas
  `1fr auto 1fr` con `padding:14px 8px`, de modo que los nodos quedan
  centrados y **separados de los bordes**. Se añade `.rc-flujo2--big`
  (nodos a 15 px, flechas/insignias a 34 px).
- `js/slides/slide12Recomendaciones.js`: el flujo se extrae a `flujo2(sub, big)`
  (reutilizado por el subbloque y su detalle); la tarjeta ancha con figura pasa
  a `.rc-card--fig` y sirve a los bloques 1 y 2.
- `js/data/recomendacionesData.js`: rótulo del bloque 6
  `Aplicaciones longitudinales en obra`.
- `tools/focus_check.js`: check del flujo agrandado en el detalle del bloque 2;
  total **770**.
- `tools/gen_slide12_shot.js`: `.rc-card--fig` (antes `.rc-card--radial`).

**Geometría medida (Chrome, `rc_shot.html`, foco rc2).** tarjeta del detalle
**940×423**; **0 clip / 0 tx / 0 OVERFLOW**.

**Verificación.** **54/54 (map) + 770/770 (focus 1-12) + `TODO OK`** con
`reanudar.cmd shot`.

## 41. Slide 12: bloque 6 como flujo vertical + pestaña «P. Transformación»

**Pedido.** (a) El bloque 6 (académico, el más alto) pasa a un **diagrama de
flujo vertical** que aproveche la altura, uniendo sus siete líneas con flechas.
(b) Al agrandarlo, la tarjeta debe crecer para que **todo el flujo se vea**.
(c) La pestaña del slide 9 pasa a **«P. Transformación»**.

**Cambios.**
- `js/data/recomendacionesData.js`: subbloque `rc6` con `modo:'flujoV'` (los
  siete rótulos siguen en `kws`).
- `js/slides/slide12Recomendaciones.js`: `flujoV(sub, big)` encadena los nodos en
  columna con flecha `chevRight` girada; se usa en el subbloque y, agrandado, en
  su detalle (`.rc-card--fig` cubre ya radial, flujo 2 niveles y flujo vertical).
- `css/styles.css`: `.rc-fv` (columna, `justify-content:space-evenly`),
  `.rc-fv-node` (11 px), `.rc-fv-arrow` (90°) y `.rc-fv--big` (13 px); para el
  detalle, `.rc-modal--rc6 .rc-card--fig` se agranda a `min(1040px,96%)` con
  figura de **468 px** de alto.
- `js/data/thesisData.js`: pestaña del slide 9 `P. Transformación`.
- `tools/focus_check.js`: rc6 pasa a comprobar el flujo (7 nodos + 6 flechas) y
  el detalle agrandado; pestaña del slide 9 `P. Transformación`; total **770**.
- `tools/gen_slide12_shot.js`: `.rc-fv`/`.rc-fv-node` a los controles de
  recorte, texto volado y desbordamiento.

**Geometría medida (Chrome, `rc_shot.html`).** `.rc-fv` 429×458 en el subbloque;
tarjeta del detalle **1040×561** (figura 468 px) sin recorte; **0 clip / 0 tx /
0 OVERFLOW**.

**Verificación.** **54/54 (map) + 770/770 (focus 1-12) + `TODO OK`** con
`reanudar.cmd shot`.


## 42. Slide 12: bloques 3 y 5 como flujo de dos niveles, bloque 4 radial (verde) y pestañas finales

**Pedido.** (a) Los bloques 3 y 5 adoptan el diagrama de dos niveles del bloque 2;
el bloque 4 el radial del bloque 1, y al pulsarlos su detalle conserva esa misma
estructura. (b) El bloque 4 toma el color verde del bloque 1 (subbloque y
detalle) pese a vivir en el ámbito práctico. (c) Pestañas finales:
`6. Resultados (1)`, `7. Resultados (2)`, `8. Resultados (3)`,
`9. P. Transformación`. (d) Ajustes de tamaño en los detalles: texto izquierdo
+20 %, texto del gráfico -10 %.

**Cambios.**
- `js/data/recomendacionesData.js`: `rc3` y `rc5` con `modo:'flujo2'` (cuatro
  nodos: actores de la socialización / cambios del ciclo de actualización);
  `rc4` con `modo:'radial'` (`hub`, `radios`, `ntp`).
- `js/data/thesisData.js`: pestañas `Resultados (2)`, `Resultados (3)` y
  `P. Transformación`.
- `css/styles.css`: el texto izquierdo de los detalles rc1-rc5 al +20 %
  (`.rc-modal--rcN .rc-card-k/p/c`); radial agrandado al -10 %
  (`.rc-radial--big`); flujo de dos niveles agrandado al -10 %
  (`.rc-flujo2--big`); el bloque 4 y su detalle en verde
  (`.rc-sub[data-focus="rc4"]` y `.rc-modal--rc4 .rc-card`).
- `tools/focus_check.js`: estructura de rc3/rc5 (4 nodos + 4 flechas) y rc4
  (anillo + 5 nodos + cadena), detalles agrandados de rc3/rc4/rc5 y color verde
  del bloque 4; total **770**.

**Geometría medida (Chrome, `rc_shot.html`).** subbloques rc3/rc4/rc5 431x170;
radial de rc4 en 417x74 sin solapes; detalles 940x423; **0 clip / 0 tx /
0 OVERFLOW**.

**Verificación.** **54/54 (map) + 770/770 (focus 1-12) + `TODO OK`** con
`reanudar.cmd shot`.

## 43. Slide 12: ajuste fino del detalle del bloque 6

**Pedido.** En el detalle ampliado del bloque 6, subir el texto de la izquierda
un 20 % y el texto del gráfico (flujo vertical) un 5 %.

**Cambios.**
- `css/styles.css`: `rc6` se une a la lista de detalles con texto izquierdo al
  +20 % (`.rc-modal--rc6 .rc-card-k/p/c`); `.rc-fv--big .rc-fv-node` sube a
  13.65 px (`padding: 6px 19px`) y la flecha a 19 px.

**Geometría medida (Chrome, `rc_shot.html`, foco rc6).** tarjeta **1040x561**
(figura 468 px) sin recorte; **0 clip / 0 tx / 0 OVERFLOW**.

**Verificación.** **54/54 (map) + 770/770 (focus 1-12) + `TODO OK`** con
`reanudar.cmd shot`.
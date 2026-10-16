# AGENTS.md — Presentación web de la tesis doctoral (presentacion)

Presentación académica interactiva en formato página web (HTML + CSS + JavaScript
sin framework ni build) para la sustentación de la tesis doctoral, con **11
diapositivas** que replican el estilo de `Ejemplo.pptx`.

Este archivo es el punto de entrada para cualquier sesión de trabajo (incluido
opencode). Léelo antes de tocar código.

---

## 1. Cómo retomar el trabajo

La rutina de inicio está en **`CONTINUIDAD.md`** (guía completa de continuidad).
Atajo en esta computadora: doble clic en **`iniciar.cmd`** (raíz del proyecto) =
entorno (Node/Chrome/jsdom + `npm install` si falta) + verificación completa +
abre la presentación. En corto, desde `tools`:

```bash
reanudar.cmd              # entorno + verificación completa + estado git + dónde seguir
reanudar.cmd shot         # además genera las capturas PNG en tools\out\
reanudar.cmd app          # además ejecuta las 52/52 pruebas de la app hermana
```

Objetivo de verificación: **54/54 (map) + 888/888 (focus) + `TODO OK`**. Tras
cada cambio de DOM/clases/CSS hay que actualizar los `has(…)` de
`tools/focus_check.js` y el total (nº de `has()`).

Cierre de sesión / traspaso a otro equipo (**`TRASPASO.md`**):

```bash
traspaso.cmd              # inventario + estado git
traspaso.cmd paquete      # además genera tools\out\traspaso\presentacion-tesis-AAAAMMDD-HHMM.zip
```

## 2. Regla de oro: `presentacion` y `tesis` viajan juntas

`presentacion` (esta presentación) y `tesis` (la app de evaluación NTP 330) son **carpetas
hermanas** al mismo nivel (`D:\ejemplo\presentacion` y `D:\ejemplo\tesis`). El bloque
Riesgo del **slide 7** embebe la app desde `..\..\tesis\0\index.html`, y
`reanudar.cmd` comprueba que exista todo el tiempo. No moverlas por separado.

## 3. Estructura del repositorio

```text
D:\ejemplo\presentacion\
├── iniciar.cmd                atajo: entorno + verificación + abrir (doble clic)
├── AGENTS.md                  este archivo
├── CONTINUIDAD.md             guía de continuidad (proceso de trabajo, §1a) — LÉELO
├── TRASPASO.md                procedimiento de guardado/traspaso
├── EPTransf.md                especificación del slide 9 (EPT)
├── Ejemplo.pptx               referencia visual obligatoria (no copiar texto)
├── *.docx / *.md / *.png      fuentes de contenido (no editar los .docx)
├── fotos\                     galería del slide 8
├── presentacion-web\          LA PRESENTACIÓN
│   ├── index.html             carga icons + data + slides + app.js (scripts planos)
│   ├── assets\                imágenes (ref-norm.png, c-cheq.png, procesos1/2.png, riesgos1/2.png…)
│   ├── css\styles.css         tokens + todas las reglas visuales (un bloque por slide)
│   └── js\
│       ├── icons.js           window.Icons.svg(nombre, px)
│       ├── app.js             shell, navegación, escalado, motor de foco (FOCUS_SCOPES)
│       ├── components\        p. ej. justificationCard.js
│       ├── data\              SOLO datos, sin HTML ni estilos
│       │   ├── thesisData.js problematizationData.js objectivesData.js
│       │   ├── theoriesData.js methodologyData.js
│       │   ├── resultsData.js resultsData2.js resultsData3.js
│       │   ├── transformationData.js y erTables.js (generado desde ER.docx)
│       └── slides\            un renderer por slide (slide01Cover.js … slide09EPT.js)
└── tools\                     harness de verificación (NO ignorar en git)
```

**Separación de responsabilidades (no romperla):**
- `js/data/*.js` = **solo datos** (contenido puro, sin HTML, sin estilos).
- `js/slides/slideNN*.js` = **solo estructura y geometría**.
- `css/styles.css` = **todo el aspecto visual** (el CSS no usa `url()`: las
  imágenes van como `<img src="assets/…">`).

## 4. Paleta y convenciones (no cambiar sin motivo)

```css
--ink:#262626  --gray:#4c4a4f  --mid:#595959  --light:#a8a8a8  --line:#e0e0e0
--red:#c0242a  --green:#006e49  --bg:#e8e8ea
```

- Paleta extraída de `Ejemplo.pptx`. **Naranja y violeta están eliminados**: no
  reintroducirlos ni como tokens ni como clases.
- **Sin comentarios** en el código salvo que expliquen una decisión no obvia.
- Textos en español; clases BEM-ish; tipografías `calc(Npx * var(--k, 1))`.
- Lámina base **1408×720 CSS**, marco con `zoom: 2` → capturas a **2816×1440**
  (medir /2). Pantalla completa: marco 800px, pie institucional 80px al fondo.
- Iconos: solo los definidos en `Icons.svg` — no inventar nombres (dibuja vacío).

## 5. Foco/interacción por clic (slides 5-12)

El motor vive en `js/app.js`: lista `FOCUS_SCOPES`, `setScopeFocus`,
`toggleFocus`, `onFrameClick`, `onKey`, más el `ghost` (sombra de la pantalla
original). Cada bloque accionable lleva `data-focus` + `role="button"` +
`tabindex="0"`. Al añadir un foco nuevo, actualizar `GOST_SCOPES`/`FOCUS_SCOPES`,
el CSS aplicado y `tools/focus_check.js`.

Reglas que no hay que romper:
- Estado normal idéntico: `--md-k` / `--rs-k` / `--mm-fs` valen 1 en reposo.
- Bloques colapsados necesitan `min-height: 0` / `min-width: 0` (sin eso la
  lámina crece a miles de píxeles).
- Los selectores de foco usan `[data-focus]`, no las clases de color.

## 6. Verificación antes de entregar cualquier cambio

1. `cd tools && reanudar.cmd` (o `verify-all.cmd shot`): debe terminar con
   `54/54 + 888/888 + 0 clip/0 textx-overflow + TODO OK`. Nunca terminar al rojo.
2. Si el cambio afecta a geometría: crear `presentacion-web/_probe.html`
   temporal, medir con Chrome headless (`--window-size=2816,1440`,
   `--force-device-scale-factor=1`, contando `zoom:2`), y **borrarlo después**.
   Ojo con `animation: none !important` (el `fadeIn` mueve 6px y da overflow
   falso) y un `--user-data-dir` distinto por ejecución.
3. Si el cambio toca DOM/clases/CSS/recuentos: sincronizar
   `tools/focus_check.js` (total = nº de `has()`) y anotar la cifra nueva.
4. Generar capturas en `tools/out/*.png` para que el usuario revise a ojo.
5. Documentar en `CONTINUIDAD.md`: sección nueva numerada y actualizar el
   `## 0. TL;DR` (estado, cifras y capturas).

Referencia de los harness (`tools/`): `map_check.js`, `focus_check.js`,
`verify-all.cmd`, `gen_map_shot.js`, `gen_heights.js` (slide 5),
`gen_results_heights.js` (slide 6), `gen_slide7_shot.js` (slide 7),
`gen_slide8_shot.js` (slide 8), `gen_ept_shot.js` (slide 9),
`gen_slide10_shot.js` (slide 10), `gen_slide11_shot.js` (slide 11),
`png_stats.js` (leo PNG para comprobar que el iframe cargó),
`app_cdp.js` (Chrome/CDP para la app hermana).

## 7. Reglas de trabajo heredadas

- **No se hacen commits git** salvo que el usuario lo pida explícitamente.
- El asistente **no puede leer imágenes**: mide geometría con Chrome y deja
  capturas (`tools/out/`) para la revisión visual del usuario. El usuario
  impone el diseño; el asistente verifica geometría.
- Si una instrucción de estilo es ambigua, se toma la que reproduzca la
  referencia (`Ejemplo.pptx`) y se anota la decisión para que la valide.
- No depender de `%TEMP%` para material de trabajo: usar `tools/` (lo temporal
  de sesiones anteriores ya está migrado).
- Fuentes de contenido: los `.docx` originales no se editan; los datos de la
  presentación viven en `js/data/`. `erTables.js` se regenera con
  `node tools/extract_er_tables.js` desde `ER.docx`.

## 8. Estado actual (resumen)

Los **12 slides** están desarrollados y verificados: carátula (réplica del slide 1
de `Ejemplo.pptx`), problematización, objetivos+hipótesis, marco teórico,
metodología (5 fases + mapa circular con zoom por clic), resultados, resultados
(2) (flujograma NTP 330 + cuadros de `ER.docx` + app embebida de `tesis/0`),
resultados (3) (6 resultados + ART + galería de fotos), **EPT** (esquema de 5
franjas según `EPTransf.md`), **validación** (Delphi: rondas + síntesis según
`Validacion.docx`), **conclusiones** (hallazgos + aporte según `Conclusiones.md`)
y **recomendaciones** (tres ámbitos + seis subbloques según `RECOMENDACIONES.docx`).
Pendientes típicos: revisión visual del usuario, ajustes de textos/tamaños, nuevos
contenidos por slide. Detalles y capturas en `CONTINUIDAD.md` (secciones
numeradas, `## 0. TL;DR`).
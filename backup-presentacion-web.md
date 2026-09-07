# Copia de seguridad — Presentación Web de Tesis Doctoral

**Proyecto:** Tesis Doctoral · Gestión de proyectos basada en controles de ingeniería
**Ubicación:** `D:\IA\tes\presentacion-web`
**Fecha de respaldo:** 2026-09-07
**Último commit git:** `26ca6b0` — Presentación web - problematización (flujo, evidencia y justificación)

---

## 1. Estado actual del proyecto

### Archivos modificados respecto al commit `26ca6b0`

| Archivo | Descripción del cambio |
|---|---|
| `css/styles.css` | Estilos de evidencia histórica, fuentes, flujo + `obj-block`/`campo-block`, pirámide, flecha de conexión, y `zoom: 2` de resolución |
| `js/app.js` | Base de escalado ampliada: `W = 2816`, `H = 1440` (render 2x) |
| `js/data/problematizationData.js` | Datos de `sources`, `historical`, `studyObject`, `actionField`, referencias normativas en nodos |
| `js/slides/slide02Problematization.js` | Render de evidencia, fuentes, flujo, jerarquía, objeto de estudio y campo de estudio |

### Sin cambios
- `index.html`, `js/icons.js`, `js/data/thesisData.js`, `js/components/justificationCard.js`, `js/slides/slide01Cover.js`

---

## 2. Slide 02 — Problematización

### 2.1 Columna de evidencia (`evPanel`)

- **Bloques históricos** (`.ev-hist` / `.ev-period`):
  - **2014–2019:** 5.927 accidentes / 167 fallecidos
  - **2024:** 508 accidentes / 20 casos mortales
- **Donut 64%:** "de los accidentes corresponden a obreros dentro de las obras" — 3.807 de 5.927 · 2014–2019
- **Barras:** "Acciones que más exponen al trabajador" — CAMICON · 2018 (6 ítems)
- **Nota a pie** tras el bloque 508/20:
  `2024: 3,16% de los accidentes nacionales (508 de 16.067) · 27,17% concentrados en Pichincha`

### 2.2 Fuentes de consulta (`.ev-sources-block`)

1. 5.927 accidentes, 167 fallecidos y 64% obreros (2014–2019) — P. González (2023) · SGRT–IESS
2. 508 accidentes, 20 mortales y 27,17% en Pichincha (2024) — DAIE–IESS (2026)
3. Acciones que más exponen al trabajador — CAMICON (2020)

### 2.3 Flujo central (`.flow`)

7 nodos con conector de flecha entre cada uno y `flow-link` circular al nivel del problema central:

| Nº | Tag | Nodo | Detalle |
|---|---|---|---|
| 1 | CONTEXTO | Contexto del sector | Pilar de la economía — 7,9% PIB · 6.206 empresas · 158.303 empleos |
| 2 | CAUSAS (tall) | Condiciones de riesgo laboral | Mano de obra no calificada · gestión reactiva · altura, excavación e izaje |
| 3 | DEFICIENCIAS (tall) | Limitaciones de la gestión de riesgos | Prevención como requisito legal · evaluación cualitativa y fragmentada |
| 4 | **PROBLEMA CENTRAL** | Ausencia de metodología integral que articule IDENTIFICACIÓN, EVALUACIÓN y CONTROL desde enfoque de ingeniería |
| 5 | EFECTOS | Consecuencias | Accidentes, incapacidades y fatalidades · 2,78 M muertes/año (OIT) |
| 6 | BRECHA (tall) | Brecha de gestión | Marco normativo sin materialización — **D.E. 255-2024 · AM-MDT-2025-122 · AM-MDT-2024-196 (Anexo 3) · C.D. 513 (IESS)** |
| 7 | NECESIDAD (green) | Necesidad de investigación | Estrategia metodológica de gestión de proyectos basada en controles de ingeniería |

**Alturas CSS:** normal 70px, tall 76px, central 100px, green 70px; flechas 16px.

**Flecha de conexión (`flow-link`):** círculo rojo con chevron horizontal (sin línea punteada, sin rotación), posicionado en `top: 320px` al nivel del problema central, derecho `-19px`.

### 2.4 Panel derecho — JUSTIFICACIÓN (`.just-panel`)

Orden vertical del panel:

1. **JUSTIFICACIÓN** (header) + 4 tarjetas (`just-cards`)

   | Tarjeta | Título |
   |---|---|
   | TEÓRICA | Aporta conocimiento científico a la prevención de riesgos en construcción |
   | PRÁCTICA | Controles de ingeniería aplicables en obra — **AM-MDT-2025-122 · AM-MDT-2024-196 (Anexo 3) y NTP 330** |
   | SOCIAL | Protege la vida y salud de trabajadores, familias y comunidad |
   | PERSONAL | Compromiso profesional del investigador con la seguridad laboral |

   **Tipografía compactada:** iconos 28px (SVG 16), título 11px, cuerpo 9.5px lh 1.25.

2. **Jerarquía de controles de riesgos** (pirámide, `pyramid-block`)
   - Niveles: Eliminación → Sustitución → **Controles de ingeniería (activo)** → Controles administrativos → EPP
   - Escala: Más eficaz → Menos eficaz
   - Caption: Control en origen, medio y receptor — C.D. 513 (art. 53) · D.E. 255

3. **OBJETO DEL ESTUDIO** (`obj-block`) — cabecera oscura estilo JUSTIFICACIÓN
   > Estructurar una estrategia metodológica de gestión de proyectos basada en controles de ingeniería para mejorar la seguridad laboral y prevenir riesgos en proyectos de edificaciones e infraestructura en Quito (2024–2026).

4. **CAMPO DE ESTUDIO** (`campo-block`) — cabecera oscura estilo JUSTIFICACIÓN
   > Proyectos de edificaciones e infraestructura básica en Quito (público/privado).
   - En 1–2 líneas centradas (sin nowrap/ellipsis).

---

## 3. Resolución / Escalado

- Ancho base ampliado **10%** respecto al diseño original: 1280px → **1408px** (`slide-frame`).
- **Densidad 2x** para nitidez en pantalla completa:
  - CSS: `.slide-frame { zoom: 2; }` (renderiza 2816×1440 física)
  - JS `fit()`: `W = 2816`, `H = 1440` — el `s` resultante es la mitad, por lo que el tamaño visual es idéntico al de 1408×720 pero con mayor nitidez.
- Compatibilidad: Chrome, Edge y Firefox actuales. Safari requiere verificación (fallback posible con `transform: scale(0.5)` anidado).

---

## 4. Notas y pendientes

- Guardado pendiente en git (sin commit): se recomienda commit con los 4 archivos modificados.
- Documentos fuente: `probl.docx` (modificado) y `Obj.docx` (obra del campo de estudio).
- Regla del usuario: mantener **ortografía correcta** "Controles administrativos".
- Pendiente de verificación visual: confirmar nitidez en fullscreen y que la flecha horizontal aterrice en la jerarquía sin superposición.
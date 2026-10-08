# Instrucciones para OpenCode  
## Replicar el mapa mental “Metodología de la investigación”

### Objetivo
Construir una **única diapositiva/página 16:9** que replique, con alta fidelidad visual, el mapa mental metodológico utilizado en la presentación doctoral.

La solución debe ser **editable**, limpia, académica y adecuada para una defensa doctoral.  
No utilizar una tabla convencional. La composición debe funcionar visualmente como **mapa mental radial**, con un nodo central y cinco ramas temáticas.

---

# 1. Tecnología recomendada

## Opción principal
Generar una página en:

- `HTML5`
- `CSS3`
- `SVG` para las líneas/conectores
- JavaScript únicamente si es necesario para ajustar posiciones

### Razón
Para esta composición, **HTML + CSS + SVG** ofrece mayor control que Mermaid sobre:

- ubicación exacta de nodos;
- curvas de conexión;
- distribución radial;
- tipografía;
- colores;
- cajas;
- iconos;
- proporciones;
- exportación posterior a PNG/PDF.

**No usar Mermaid como solución principal**, porque el diseño requiere una composición manual y simétrica.

---

# 2. Archivos a generar

OpenCode debe producir como mínimo:

```text
/mapa-metodologia/
│
├── index.html
├── styles.css
├── app.js              # opcional
├── README.md
└── assets/
    └── icons/          # opcional
```

Si es posible, añadir además:

```text
export/
├── mapa-metodologia.png
└── mapa-metodologia.pdf
```

---

# 3. Formato general

## Lienzo
- Relación de aspecto: **16:9**
- Resolución base recomendada: **1600 × 900 px**
- Fondo: `#FFFFFF`
- Márgenes seguros: 25–35 px
- Debe poder verse completo en una sola pantalla.

## Estética
- doctoral;
- limpia;
- esquemática;
- moderna;
- institucional;
- alta legibilidad;
- sin fotografías;
- sin efectos decorativos innecesarios.

---

# 4. Estructura visual

El mapa debe tener un **núcleo circular central** y cinco ramas.

Distribución:

```text
                       FASE 1
                         │
                         │
          ┌──────────────┼──────────────┐
          │                             │
      desarrollo                     FASE 2
          │                             │
          │                             │
FASE 4 ─────── METODOLOGÍA ───────── FASE 3
          │      DE LA                  │
          │   INVESTIGACIÓN             │
          │                             │
          └──────────────┬──────────────┘
                         │
                       FASE 5
```

La distribución final debe aproximarse a:

- **Fase 1:** zona superior-centro / superior-izquierda.
- **Fase 2:** zona superior-derecha.
- **Fase 3:** zona media-derecha.
- **Fase 4:** zona media-izquierda.
- **Fase 5:** zona inferior-centro.

---

# 5. Nodo central

Crear un círculo de aproximadamente:

```css
width: 290px;
height: 290px;
```

### Apariencia
- relleno azul oscuro;
- color sugerido: `#173A5E`;
- borde exterior azul muy claro;
- doble aro sutil;
- sombra ligera;
- texto blanco.

### Contenido

```text
METODOLOGÍA
DE LA
INVESTIGACIÓN
```

Sobre el texto, incluir un icono conceptual tipo:

```text
💡 + ⚙
```

o preferiblemente un icono lineal SVG de:

- idea;
- metodología;
- engranaje;
- proceso.

### Tipografía
- Arial / Aptos / Inter / Montserrat;
- mayúsculas;
- negrita;
- entre 28 y 34 px;
- centrado.

---

# 6. Sistema de color por fases

Usar un color principal diferente para cada fase.

| Fase | Color principal | Fondo claro |
|---|---|---|
| 1 | Verde `#0B8F69` | `#E8F5F0` |
| 2 | Azul `#1477C9` | `#EAF4FC` |
| 3 | Rojo `#E3212A` | `#FCEBED` |
| 4 | Naranja `#F7770A` | `#FFF1E3` |
| 5 | Violeta `#6738C8` | `#F1EAFE` |

Todos los conectores de cada fase deben usar el mismo color de su fase.

---

# 7. Diseño de cada fase

Cada fase tendrá:

1. un **nodo principal de fase**;
2. un número grande dentro de un círculo;
3. nombre de la fase;
4. tres bloques secundarios:
   - Método;
   - Técnicas;
   - Instrumentos.

## Nodo principal

Formato:

```text
(1)  Fase 1
     Análisis documental
```

Características:

- bordes redondeados;
- color sólido;
- texto blanco;
- número grande dentro de círculo;
- ancho aproximado: 300–340 px;
- altura aproximada: 90–110 px.

---

# 8. Contenido exacto a incluir

## FASE 1 — Análisis documental

### Método
```text
Analítico-documental
```

### Técnicas
```text
Revisión documental
Análisis comparativo
```

### Instrumentos
```text
Fichas legales
Matrices de requisitos
```

### Conectores
La **Fase 1 debe estar claramente conectada con sus tres bloques secundarios**, exactamente igual que las fases 2, 3, 4 y 5.

Esto es obligatorio.

Esquema:

```text
Método ─────┐
Técnicas ───┼──── FASE 1 ───── nodo central
Instrumentos┘
```

No dejar la Fase 1 visualmente aislada de su desarrollo.

---

## FASE 2 — Elaboración de cuestionarios

### Método
```text
Inductivo-categorial
```

### Técnicas
```text
Análisis de contenido
Categorización de riesgos
```

### Instrumentos
```text
Listas de chequeo
NTP 324
```

---

## FASE 3 — Diagnóstico de campo

### Método
```text
Descriptivo y analítico
```

### Técnicas
```text
Observación directa
Registro técnico
```

### Instrumentos
```text
Fichas de campo
Matrices NTP 330
```

---

## FASE 4 — Integración instrumental

### Método
```text
Triangulación + desarrollo
```

### Técnicas
```text
Análisis de riesgos
Revisión técnica
```

### Instrumentos
```text
ART
Controles de ingeniería
```

---

## FASE 5 — Validación de la estrategia

### Método
```text
Delphi
```

### Técnicas
```text
Juicio experto
Consulta estructurada
```

### Instrumentos
```text
Likert 1–5
Matrices comparativas
```

---

# 9. Diseño de los bloques secundarios

Cada bloque secundario debe ser una tarjeta horizontal.

Ejemplo:

```text
┌───────────────────────────────┐
│ ⚙  Método                     │
│    • Analítico-documental     │
└───────────────────────────────┘
```

### Características
- fondo muy claro del color de la fase;
- bordes redondeados: 18–24 px;
- icono lineal a la izquierda;
- título en negrita;
- texto alineado a la izquierda;
- sin exceso de texto.

### Iconos sugeridos

| Categoría | Icono |
|---|---|
| Método | engranaje / libro |
| Técnicas | engranaje / red |
| Instrumentos | documento / checklist |

Usar SVG simples o una librería como:

```text
Lucide Icons
Heroicons
Font Awesome
```

Preferencia: **Lucide Icons**.

---

# 10. Conectores

Los conectores son esenciales.

### Entre nodo central y fase
Utilizar:

- SVG `<path>`;
- curvas Bézier;
- grosor 4–5 px;
- terminación redondeada;
- color de la fase.

Ejemplo:

```svg
<path
  d="M 800 450 C 700 420, 700 200, 780 170"
  stroke="#0B8F69"
  stroke-width="5"
  fill="none"
  stroke-linecap="round"
/>
```

### Entre fase y sus bloques
Usar líneas más finas:

```text
2.5–3.5 px
```

Incluir pequeños nodos circulares en las bifurcaciones.

### Regla visual
Los cinco conjuntos deben seguir la misma lógica gráfica:

```text
CENTRO
  ↓
FASE
  ↓
MÉTODO / TÉCNICAS / INSTRUMENTOS
```

o, según la posición:

```text
MÉTODO
TÉCNICAS        → FASE → CENTRO
INSTRUMENTOS
```

No permitir ramas visualmente desconectadas.

---

# 11. Posiciones recomendadas

Las posiciones pueden ajustarse, pero como punto de partida usar:

```text
Centro:
x ≈ 800
y ≈ 440
```

## Fase 1
```text
x ≈ 590–930
y ≈ 55–170
```

Bloques secundarios:

```text
x ≈ 35–450
y ≈ 35–330
```

## Fase 2
```text
x ≈ 930–1220
y ≈ 170–280
```

Bloques secundarios:

```text
x ≈ 1220–1570
y ≈ 35–330
```

## Fase 3
```text
x ≈ 940–1230
y ≈ 460–570
```

Bloques secundarios:

```text
x ≈ 1230–1580
y ≈ 365–690
```

## Fase 4
```text
x ≈ 370–690
y ≈ 460–580
```

Bloques secundarios:

```text
x ≈ 30–390
y ≈ 365–700
```

## Fase 5
```text
x ≈ 610–1000
y ≈ 610–715
```

Bloques secundarios:

```text
x ≈ 330–1280
y ≈ 720–835
```

Ajustar tamaños para no exceder el lienzo.

---

# 12. Ruta metodológica inferior

En la parte inferior incorporar una franja gris muy clara:

```text
Ruta metodológica:
Marco normativo → Instrumentos → Diagnóstico → Integración → Validación
```

### Estilo
- fondo: `#EEF1F4`;
- bordes redondeados;
- texto azul oscuro;
- “Ruta metodológica:” en negrita;
- flechas visibles;
- altura 50–60 px.

---

# 13. Jerarquía tipográfica

## Título de fase
```text
20–24 px
700
```

## Categoría
```text
Método / Técnicas / Instrumentos
16–19 px
700
```

## Contenido
```text
14–17 px
400–500
```

## Nodo central
```text
28–34 px
700
```

Evitar texto demasiado pequeño.

---

# 14. Principios de síntesis

El diseño debe mostrar solo lo esencial.

No incorporar:

- explicaciones largas;
- párrafos;
- definiciones completas;
- citas bibliográficas dentro del gráfico;
- fórmulas de NTP 330;
- texto redundante.

La finalidad del mapa mental es permitir al tribunal comprender en pocos segundos:

```text
qué se hizo
↓
con qué método
↓
mediante qué técnicas
↓
con qué instrumentos
↓
y cómo las fases se articulan
```

---

# 15. Criterio doctoral

La presentación debe transmitir:

```text
RIGOR METODOLÓGICO
        +
TRAZABILIDAD
        +
SECUENCIALIDAD
        +
VALIDACIÓN
```

No debe parecer:

- infografía escolar;
- mapa conceptual infantil;
- diagrama comercial.

Debe tener apariencia de:

> síntesis metodológica de una tesis doctoral.

---

# 16. Interactividad opcional

Si se desea, añadir hover discreto:

```css
.phase-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(0,0,0,.10);
}
```

Pero al exportar a PNG/PDF debe verse correctamente sin interacción.

---

# 17. Exportación

Incluir instrucciones en `README.md` para abrir:

```bash
open index.html
```

o servir localmente:

```bash
python -m http.server 8080
```

Luego visitar:

```text
http://localhost:8080
```

Para exportar, usar Playwright o Puppeteer.

Ejemplo sugerido con Playwright:

```javascript
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1600, height: 900 }
});

await page.goto("http://localhost:8080");

await page.screenshot({
  path: "export/mapa-metodologia.png",
  fullPage: true
});

await page.pdf({
  path: "export/mapa-metodologia.pdf",
  width: "1600px",
  height: "900px",
  printBackground: true
});

await browser.close();
```

---

# 18. Prompt listo para pegar en OpenCode

```text
Crea una página HTML 16:9 de 1600x900 px que reproduzca un mapa mental metodológico para una presentación doctoral.

La composición debe tener un nodo circular central azul oscuro con el texto:

METODOLOGÍA
DE LA
INVESTIGACIÓN

Desde ese núcleo deben salir cinco ramas curvas SVG, cada una con un color diferente:

1. Verde: Fase 1 – Análisis documental
2. Azul: Fase 2 – Elaboración de cuestionarios
3. Rojo: Fase 3 – Diagnóstico de campo
4. Naranja: Fase 4 – Integración instrumental
5. Violeta: Fase 5 – Validación de la estrategia

Cada fase debe estar conectada visualmente tanto al nodo central como a tres bloques secundarios: Método, Técnicas e Instrumentos.

IMPORTANTE: la Fase 1 debe estar conectada con sus bloques Método, Técnicas e Instrumentos de la misma manera que las demás fases. No puede quedar visualmente aislada.

Contenido:

FASE 1
Método: Analítico-documental
Técnicas:
- Revisión documental
- Análisis comparativo
Instrumentos:
- Fichas legales
- Matrices de requisitos

FASE 2
Método: Inductivo-categorial
Técnicas:
- Análisis de contenido
- Categorización de riesgos
Instrumentos:
- Listas de chequeo
- NTP 324

FASE 3
Método: Descriptivo y analítico
Técnicas:
- Observación directa
- Registro técnico
Instrumentos:
- Fichas de campo
- Matrices NTP 330

FASE 4
Método: Triangulación + desarrollo
Técnicas:
- Análisis de riesgos
- Revisión técnica
Instrumentos:
- ART
- Controles de ingeniería

FASE 5
Método: Delphi
Técnicas:
- Juicio experto
- Consulta estructurada
Instrumentos:
- Likert 1–5
- Matrices comparativas

Colores:
Fase 1: #0B8F69
Fase 2: #1477C9
Fase 3: #E3212A
Fase 4: #F7770A
Fase 5: #6738C8

Usa HTML + CSS + SVG. No uses una tabla convencional. Usa tarjetas redondeadas, conectores Bézier, iconos lineales y tipografía profesional tipo Inter, Arial, Aptos o Montserrat.

Añade al pie una banda con:

Ruta metodológica:
Marco normativo → Instrumentos → Diagnóstico → Integración → Validación

La estética debe ser limpia, académica, ejecutiva y de nivel doctoral. Evita párrafos, texto pequeño y elementos decorativos innecesarios.

Genera:
- index.html
- styles.css
- app.js solo si es necesario
- README.md

El resultado debe poder exportarse sin cambios a PNG o PDF en 1600x900 px.
```

---

# 19. Validaciones que OpenCode debe realizar antes de terminar

Comprobar visualmente que:

- [ ] el lienzo es 16:9;
- [ ] las cinco fases son visibles;
- [ ] ninguna caja queda fuera del lienzo;
- [ ] no hay solapamientos;
- [ ] todos los textos son legibles;
- [ ] el nodo central tiene cinco conexiones;
- [ ] cada fase está conectada con sus bloques;
- [ ] **la Fase 1 está conectada correctamente con Método, Técnicas e Instrumentos**;
- [ ] las líneas no atraviesan textos;
- [ ] el contenido está sintetizado;
- [ ] los colores permiten identificar cada fase;
- [ ] la banda “Ruta metodológica” es visible;
- [ ] el resultado conserva una estética doctoral;
- [ ] la exportación PNG mantiene 1600 × 900 px.

---

# 20. Criterio final de aceptación

El diseño estará correctamente replicado cuando pueda entenderse visualmente esta lógica sin leer texto adicional:

```text
MARCO NORMATIVO
      ↓
DISEÑO DE INSTRUMENTOS
      ↓
DIAGNÓSTICO DE RIESGOS
      ↓
INTEGRACIÓN / CONTROLES
      ↓
VALIDACIÓN EXPERTA
```

y cuando cada fase permita reconocer inmediatamente:

```text
MÉTODO
  +
TÉCNICAS
  +
INSTRUMENTOS
```

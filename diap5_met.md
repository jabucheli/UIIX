---
title: "5. Metodología"
subtitle: "Diseño metodológico de la investigación doctoral"
format: html
---

<!--
PÁGINA 5 · METODOLOGÍA
Objetivo visual:
- Mantener el lenguaje gráfico de Ejemplo(2).pptx: fondo blanco, título gris,
  línea superior verde/roja, contornos negros, acentos institucionales UIIX
  y etiqueta vertical roja.
- Composición 16:9, ejecutiva, doctoral, esquemática y pedagógica.
- La lectura debe seguir esta secuencia:
  1) Enfoque/diseño/tipo
  2) Cinco fases
  3) Métodos–técnicas–instrumentos
  4) Población y muestra
-->

<style>
:root {
  --uiix-green: #3D9074;
  --uiix-green-soft: #EAF3EF;
  --uiix-green-line: #749D89;
  --uiix-red: #C0242A;
  --uiix-red-bright: #FF3D3D;
  --uiix-red-soft: #F8EDEE;
  --ink: #4C4A4F;
  --black: #111111;
  --muted: #737373;
  --line: #202020;
  --light: #F7F7F7;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: #EDEEEE;
  font-family: Arial, Helvetica, sans-serif;
  color: var(--black);
}

.slide {
  width: min(1600px, 100vw);
  aspect-ratio: 16 / 9;
  margin: 0 auto;
  background: #FFFFFF;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0,0,0,.09);
}

.top-brand {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 17px;
  display: grid;
  grid-template-columns: 40% 60%;
  border-bottom: 7px solid #444444;
}
.top-brand .green { background: var(--uiix-green-line); }
.top-brand .red { background: var(--uiix-red-bright); }

.logo {
  position: absolute;
  top: 30px;
  right: 7.4%;
  width: 255px;
  height: auto;
}

.title {
  position: absolute;
  top: 75px;
  left: 0;
  width: 100%;
  text-align: center;
  color: var(--ink);
  font-size: 55px;
  font-weight: 400;
  letter-spacing: -.02em;
}
.title small {
  font-size: 18px;
  vertical-align: 18px;
  margin-right: 10px;
  color: var(--uiix-red);
  font-weight: 700;
}

.label {
  position: absolute;
  right: 0;
  top: 67%;
  width: 49px;
  height: 180px;
  background: var(--uiix-red);
  color: white;
  display: grid;
  place-items: center;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: .04em;
}

.content {
  position: absolute;
  left: 4.6%;
  right: 6.0%;
  top: 170px;
  bottom: 76px;
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  grid-template-rows: 44% 56%;
  gap: 15px 18px;
}

.panel {
  border: 2px solid var(--line);
  background: #FFFFFF;
  padding: 11px 13px 12px;
  overflow: hidden;
}

.panel h2 {
  margin: 0 0 8px;
  color: var(--ink);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.05;
}

.panel h2 .num {
  color: var(--uiix-red);
  margin-right: 6px;
}

#focus {
  background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 80%, #FAFAFA 100%);
}

.doctoral-key {
  margin: 5px 0 0;
  padding: 6px 9px;
  border-left: 5px solid var(--uiix-red);
  background: var(--uiix-red-soft);
  font-size: 11.5px;
  line-height: 1.22;
}
.doctoral-key strong { color: #8F1B20; }

.flow5 {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  align-items: stretch;
  margin-top: 4px;
}
.phase {
  position: relative;
  border: 1.5px solid var(--line);
  padding: 7px 6px;
  min-height: 148px;
  text-align: center;
  background: #fff;
}
.phase:not(:last-child)::after {
  content: "→";
  position: absolute;
  right: -11px;
  top: 42%;
  z-index: 4;
  background: white;
  color: var(--uiix-red);
  font-size: 19px;
  font-weight: 700;
}
.phase .badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin: 0 auto 4px;
  display: grid;
  place-items: center;
  background: var(--uiix-green);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}
.phase.mix .badge { background: var(--uiix-red); }
.phase .kind {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .03em;
  color: var(--uiix-green);
  background: var(--uiix-green-soft);
  padding: 2px 4px;
  margin-bottom: 4px;
}
.phase.mix .kind {
  color: #8F1B20;
  background: var(--uiix-red-soft);
}
.phase h3 {
  margin: 0 0 4px;
  font-size: 11.3px;
  line-height: 1.08;
}
.phase p {
  margin: 0;
  font-size: 9.6px;
  line-height: 1.15;
  color: #333;
}
.phase .out {
  margin-top: 5px;
  padding-top: 4px;
  border-top: 1px solid #BFBFBF;
  color: var(--muted);
  font-size: 8.9px;
  line-height: 1.1;
}

.method-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 10.2px;
  line-height: 1.12;
}
.method-table th, .method-table td {
  border: 1px solid #333;
  padding: 5px 6px;
  vertical-align: top;
}
.method-table th {
  background: var(--uiix-green-soft);
  font-size: 10.5px;
  color: #202020;
}
.method-table td:first-child {
  width: 9%;
  text-align: center;
  font-weight: 700;
}
.method-table td:nth-child(2) { width: 23%; }
.method-table td:nth-child(3) { width: 34%; }
.method-table td:nth-child(4) { width: 34%; }
.phase-chip {
  display: inline-block;
  min-width: 22px;
  padding: 2px 4px;
  background: var(--uiix-green);
  color: white;
  font-size: 9px;
}
.phase-chip.red { background: var(--uiix-red); }

.population-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 5px;
}
.pop {
  border: 1px solid #333;
  padding: 6px 7px;
  display: grid;
  grid-template-columns: 24% 76%;
  gap: 6px;
  background: #fff;
}
.pop .tag {
  font-weight: 700;
  font-size: 10.5px;
  color: var(--uiix-green);
  line-height: 1.12;
}
.pop:last-child .tag { color: var(--uiix-red); }
.pop .txt {
  font-size: 9.9px;
  line-height: 1.15;
}
.metrics {
  margin-top: 6px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}
.metric {
  border: 1px solid #9D9D9D;
  background: var(--light);
  text-align: center;
  padding: 5px 3px;
  font-size: 8.8px;
  line-height: 1.05;
}
.metric strong {
  display: block;
  font-size: 17px;
  color: var(--uiix-green);
  margin-bottom: 2px;
}
.metric:last-child strong { color: var(--uiix-red); }

.method-note {
  margin-top: 5px;
  padding: 5px 7px;
  background: #F7F7F7;
  border-left: 4px solid var(--uiix-green);
  color: #444;
  font-size: 9.7px;
  line-height: 1.15;
}

.footer-line {
  position: absolute;
  left: 7.8%;
  right: 7.7%;
  bottom: 42px;
  height: 7px;
  background: var(--uiix-green);
}
.footer {
  position: absolute;
  left: 9.3%;
  right: 8.3%;
  bottom: 12px;
  display: flex;
  justify-content: space-between;
  color: #AAAAAA;
  font-size: 12px;
}
.footer strong { color: var(--uiix-red); }

/* Mermaid sizing / doctoral visual language */
.mermaid {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
#focus .mermaid svg {
  max-width: 100% !important;
  max-height: 183px !important;
}
</style>

<div class="slide">

  <div class="top-brand">
    <div class="green"></div>
    <div class="red"></div>
  </div>

  <img class="logo" alt="UIIX" src="data:image/png;base64,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">

  <div class="title"><small>05</small>Metodología</div>

  <div class="label">METODOLOGÍA</div>

  <div class="content">

    <!-- BLOQUE 1 -->
    <section class="panel" id="focus">
      <h2><span class="num">01</span>Enfoque, diseño y tipo de investigación</h2>

<div class="mermaid">
flowchart LR
    A["ENFOQUE<br/><b>Mixto</b>"] --> B["DISEÑO<br/><b>Secuencial exploratorio</b>"]
    B --> C["FASE CUALITATIVA<br/>Fundamenta y estructura<br/>los instrumentos"]
    C --> D["FASE CUANTITATIVA<br/>Valora objetivamente<br/>los riesgos"]
    D --> E["INTEGRACIÓN<br/>Sustenta la estrategia<br/>y su validación"]

    B -. clasificación .-> F["FINALIDAD<br/><b>Aplicada + propositiva</b>"]
    B -. clasificación .-> G["MANIPULACIÓN<br/><b>No experimental</b>"]
    B -. clasificación .-> H["TEMPORALIDAD<br/><b>Transversal</b>"]

    G --> I["APLICACIÓN PILOTO ≠ EXPERIMENTO<br/>No existe manipulación deliberada,<br/>comparación pre/post ni grupos<br/>de intervención y control"]

    classDef main fill:#FFFFFF,stroke:#202020,stroke-width:1.6px,color:#111111;
    classDef qual fill:#EAF3EF,stroke:#3D9074,stroke-width:1.7px,color:#111111;
    classDef quant fill:#F7F7F7,stroke:#4C4A4F,stroke-width:1.7px,color:#111111;
    classDef red fill:#F8EDEE,stroke:#C0242A,stroke-width:1.8px,color:#8F1B20;
    class A,B,F,H main;
    class C qual;
    class D,E quant;
    class G,I red;
</div>

      <div class="doctoral-key">
        <strong>Síntesis doctoral:</strong> la secuencia cualitativa → cuantitativa → integración asegura
        trazabilidad entre fundamento normativo, medición del riesgo, formulación de la estrategia y validación.
      </div>
    </section>

    <!-- BLOQUE 2 -->
    <section class="panel">
      <h2><span class="num">02</span>Estructura metodológica · cinco fases</h2>
      <div class="flow5">
        <div class="phase">
          <div class="badge">1</div>
          <div class="kind">CUALITATIVA</div>
          <h3>Revisión normativa y fundamentación</h3>
          <p>D.E. 255-2024 · AM-MDT-2024-196 · AM-MDT-2025-122 · ISO 45001 · NTP 324/330.</p>
          <div class="out"><b>Salida:</b> matriz procesos–riesgos–requisitos.</div>
        </div>
        <div class="phase">
          <div class="badge">2</div>
          <div class="kind">CUALITATIVA</div>
          <h3>Cuestionarios de chequeo</h3>
          <p>Requisitos legales convertidos en indicadores observables y verificables.</p>
          <div class="out"><b>Salida:</b> lista NTP 324 → Nivel de Deficiencia.</div>
        </div>
        <div class="phase mix">
          <div class="badge">3</div>
          <div class="kind">CUANTITATIVA</div>
          <h3>Aplicación piloto y evaluación</h3>
          <p>Observación en obra y valoración NTP 330: ND · NE · NP · NC · NR · NI.</p>
          <div class="out"><b>Salida:</b> jerarquización y prioridades.</div>
        </div>
        <div class="phase mix">
          <div class="badge">4</div>
          <div class="kind">MIXTA</div>
          <h3>ART + controles de ingeniería</h3>
          <p>Tareas críticas → peligros → riesgo → control sobre fuente, medio o ejecución.</p>
          <div class="out"><b>Salida:</b> ART y controles operativos.</div>
        </div>
        <div class="phase mix">
          <div class="badge">5</div>
          <div class="kind">MIXTA</div>
          <h3>Validación integral</h3>
          <p>Validación científica, técnica, legal y metodológica mediante criterio experto.</p>
          <div class="out"><b>Salida:</b> 3 rondas Delphi → consenso.</div>
        </div>
      </div>
      <div class="method-note"><b>Secuencia de transformación:</b> NORMA → VERIFICACIÓN → MEDICIÓN → INTERVENCIÓN → VALIDACIÓN.</div>
    </section>

    <!-- BLOQUE 3 -->
    <section class="panel">
      <h2><span class="num">03</span>Métodos, técnicas e instrumentos</h2>
      <table class="method-table">
        <thead>
          <tr>
            <th>Fase</th>
            <th>Método</th>
            <th>Técnicas</th>
            <th>Instrumentos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="phase-chip">1</span></td>
            <td><b>Analítico-documental</b></td>
            <td>Revisión bibliográfica/documental · análisis comparativo · correspondencia normativa.</td>
            <td>Fichas de análisis legal · matrices de requisitos · registros temáticos.</td>
          </tr>
          <tr>
            <td><span class="phase-chip">2</span></td>
            <td><b>Inductivo-categorial</b></td>
            <td>Análisis de contenido · categorización de riesgos · triangulación normativa–proceso–buenas prácticas.</td>
            <td>Listas de chequeo / verificación fundamentadas en <b>NTP 324</b>.</td>
          </tr>
          <tr>
            <td><span class="phase-chip red">3</span></td>
            <td><b>Descriptivo y analítico de campo</b></td>
            <td>Observación directa estructurada · cuestionarios · registro técnico · evidencia documental.</td>
            <td>Fichas de campo · matrices y hojas de cálculo de <b>NTP 330</b>.</td>
          </tr>
          <tr>
            <td><span class="phase-chip red">4</span></td>
            <td><b>Triangulación + desarrollo instrumental</b></td>
            <td>Análisis comparativo de riesgos · revisión técnica · observación de campo · criterio técnico.</td>
            <td>Formatos estandarizados de <b>ART</b> y estructura de controles de ingeniería.</td>
          </tr>
          <tr>
            <td><span class="phase-chip red">5</span></td>
            <td><b>Delphi / validación especializada</b></td>
            <td>Revisión sistemática · juicio experto · consulta estructurada · contraste técnico-normativo.</td>
            <td>Formulario Likert 1–5 · matrices comparativas · registros de observaciones · matrices de correspondencia.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- BLOQUE 4 -->
    <section class="panel">
      <h2><span class="num">04</span>Población y muestra</h2>
      <div class="population-grid">
        <div class="pop">
          <div class="tag">FASES 1–2<br/>Base documental</div>
          <div class="txt">
            <b>Población:</b> fuentes normativas, técnicas y científicas.<br/>
            <b>Muestra:</b> intencional/no probabilística por relevancia, vigencia,
            aplicabilidad técnica y pertinencia temática.
          </div>
        </div>

        <div class="pop">
          <div class="tag">FASES 3–4<br/>Etapa aplicada</div>
          <div class="txt">
            <b>Población:</b> procesos constructivos y factores de riesgo en edificación e infraestructura básica de Quito.<br/>
            <b>Muestra:</b> intencional/no probabilística por pertinencia técnica, accesibilidad y presencia efectiva de procesos y riesgos.
            En fase 4 se seleccionan tareas críticas con riesgos importantes/intolerables según NTP 330.
          </div>
        </div>

        <div class="pop">
          <div class="tag">FASE 5<br/>Validación</div>
          <div class="txt">
            <b>Población:</b> expertos PhD con experiencia afín a SST, prevención, dirección de proyectos e investigación.<br/>
            <b>Muestra:</b> 8 validadores, selección intencional por criterio experto.
          </div>
        </div>
      </div>

      <div class="metrics">
        <div class="metric"><strong>12</strong>procesos constructivos</div>
        <div class="metric"><strong>21</strong>riesgos de seguridad</div>
        <div class="metric"><strong>106 + 83</strong>cuestionarios aplicados*</div>
        <div class="metric"><strong>3</strong>rondas Delphi</div>
      </div>

      <div class="method-note">
        *106 cuestionarios en edificación y 83 en infraestructura básica corresponden a la aplicación piloto;
        se presentan como evidencia de campo, no como equivalentes directos del tamaño poblacional.
      </div>
    </section>

  </div>

  <div class="footer-line"></div>
  <div class="footer">
    <div><strong>UIIX</strong> · Doctorado en Dirección de Proyectos</div>
    <div>Fuente: Tesis doctoral · Cap. III (3.2.1–3.2.4) + síntesis metodológica</div>
  </div>
</div>

<!--
NOTAS PARA EXPOSICIÓN DOCTORAL
1. No describir la aplicación piloto como experimento.
2. Enfatizar que la clasificación "no experimental" deriva de la ausencia de manipulación
   deliberada de variables y de comparaciones controladas pre/post o entre grupos.
3. Explicar la lógica de integración: la fase cualitativa construye el marco y los instrumentos;
   la cuantitativa produce evidencia medible; la integración convierte esa evidencia en ART y
   controles de ingeniería; Delphi aporta validación experta.
4. En población/muestra, diferenciar:
   - población documental (fases 1–2),
   - población de procesos/riesgos y muestra intencional de campo (fases 3–4),
   - población de expertos y muestra de 8 validadores (fase 5).
5. Los 106 y 83 cuestionarios representan instrumentos aplicados en los dos contextos piloto,
   no deben presentarse como si fueran el universo estadístico del estudio.
-->

<!-- Mermaid: si el visor no procesa bloques .mermaid automáticamente,
     activar Mermaid 10+ en el motor de publicación. -->

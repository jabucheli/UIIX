---
marp: true
paginate: false
size: 16:9
style: |
  section {
    background: #ffffff;
    color: #111111;
    font-family: Arial, Helvetica, sans-serif;
    padding: 28px 38px 24px 38px;
  }
  h1 {
    font-size: 30px;
    font-weight: 800;
    margin: 0 0 4px 0;
    color: #111111;
    line-height: 1.03;
  }
  h2 {
    font-size: 13px;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: #007a53;
    margin: 0 0 9px 0;
  }
  .tag {
    display: inline-block;
    background: #e30613;
    color: #ffffff;
    padding: 3px 11px;
    border-radius: 14px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .04em;
    margin-bottom: 6px;
  }
  .intro {
    border-left: 5px solid #007a53;
    background: #f4f6f5;
    padding: 7px 10px;
    font-size: 10.7px;
    line-height: 1.16;
    margin-bottom: 8px;
  }
  .main-grid {
    display: grid;
    grid-template-columns: 0.88fr 1.5fr;
    gap: 14px;
    align-items: start;
  }
  .left-column {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .section-box {
    border-left: 5px solid #007a53;
    background: #f4f6f5;
    padding: 7px 9px;
  }
  .section-box.red { border-left-color: #e30613; }
  .section-box.dark {
    background: #111111;
    color: #ffffff;
    border-left-color: #e30613;
  }
  .section-box h3 {
    font-size: 14.8px;
    margin: 0 0 3px 0;
    line-height: 1.05;
  }
  .section-box p {
    font-size: 10.1px;
    line-height: 1.13;
    margin: 0;
  }
  .section-box .mini-ref {
    font-size: 8.8px;
    margin-top: 4px;
    opacity: .8;
  }
  .timeline {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 4px;
    margin-top: 5px;
  }
  .milestone {
    background: #ffffff;
    border-top: 3px solid #007a53;
    padding: 4px 4px 3px 4px;
    min-height: 53px;
  }
  .milestone:nth-child(even) { border-top-color: #e30613; }
  .milestone b {
    display: block;
    font-size: 9.7px;
    margin-bottom: 2px;
  }
  .milestone span {
    font-size: 7.8px;
    line-height: 1.05;
    display: block;
  }
  .theory-panel {
    border: 1px solid #d7dbd9;
    padding: 8px 9px 8px 9px;
    background: #ffffff;
  }
  .theory-title {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    border-bottom: 2px solid #111111;
    padding-bottom: 4px;
    margin-bottom: 5px;
  }
  .theory-title h3 {
    margin: 0;
    font-size: 17px;
  }
  .theory-title span {
    font-size: 8.8px;
    font-weight: 700;
    color: #007a53;
    letter-spacing: .04em;
  }
  .theories {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
  }
  .theory {
    display: grid;
    grid-template-columns: 0.7fr 1.3fr;
    gap: 6px;
    align-items: stretch;
    border-bottom: 1px solid #e7e7e7;
    padding-bottom: 4px;
  }
  .theory:last-child { border-bottom: none; }
  .level-1 {
    background: #111111;
    color: #ffffff;
    padding: 6px 7px;
    border-top: 4px solid #007a53;
  }
  .level-1.red { border-top-color: #e30613; }
  .level-1 .n {
    display: block;
    color: #e30613;
    font-size: 8px;
    font-weight: 800;
    margin-bottom: 2px;
  }
  .level-1 strong {
    display: block;
    font-size: 13.4px;
    line-height: 1.02;
    margin-bottom: 3px;
  }
  .level-1 .key {
    font-size: 8.8px;
    line-height: 1.08;
    color: #d9d9d9;
  }
  .level-1 .key b { color: #ffffff; }
  .level-2 {
    background: #f6f7f7;
    padding: 5px 7px;
    border-left: 3px solid #007a53;
  }
  .level-2.red { border-left-color: #e30613; }
  .level-2 p {
    margin: 0;
    font-size: 9.4px;
    line-height: 1.1;
  }
  .level-2 .apa {
    margin-top: 3px;
    font-size: 8.6px;
    line-height: 1.05;
    font-style: italic;
    color: #555555;
  }
  .integrated-flow {
    margin-top: 6px;
    background: #111111;
    padding: 6px 7px;
    color: #ffffff;
  }
  .integrated-flow .flow-title {
    font-size: 10px;
    font-weight: 800;
    margin-bottom: 4px;
  }
  .flow-row {
    display: grid;
    grid-template-columns: 1fr 18px 1fr 18px 1fr 18px 1fr;
    align-items: center;
    gap: 2px;
  }
  .flow-node {
    background: #ffffff;
    color: #111111;
    border-top: 3px solid #007a53;
    padding: 4px 5px;
    min-height: 38px;
    text-align: center;
  }
  .flow-node.red { border-top-color: #e30613; }
  .flow-node b {
    display: block;
    font-size: 8.8px;
    margin-bottom: 1px;
  }
  .flow-node span {
    font-size: 7.6px;
    line-height: 1.02;
  }
  .flow-arrow {
    text-align: center;
    color: #e30613;
    font-size: 13px;
    font-weight: 800;
  }
  .bottom-grid {
    display: grid;
    grid-template-columns: 1.35fr .65fr;
    gap: 9px;
    margin-top: 7px;
    align-items: stretch;
  }
  .numerals {
    background: #f1f4f3;
    border-top: 4px solid #007a53;
    padding: 6px 7px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
  }
  .numerals div {
    text-align: center;
    font-size: 8.4px;
    line-height: 1.08;
  }
  .numerals b {
    display: block;
    color: #007a53;
    font-size: 9.7px;
    margin-bottom: 2px;
  }
  .legal {
    background: #111111;
    color: #ffffff;
    border-top: 4px solid #e30613;
    padding: 6px 7px;
  }
  .legal h4 {
    font-size: 10.5px;
    margin: 0 0 3px 0;
  }
  .legal p {
    font-size: 8.4px;
    line-height: 1.07;
    margin: 0 0 5px 0;
  }
  .image-placeholder {
    border: 1.5px dashed #cfcfcf;
    background: #ffffff;
    color: #666666;
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 8.5px;
    line-height: 1.05;
  }
  .footer-note {
    margin-top: 4px;
    font-size: 8.2px;
    color: #666666;
  }
---

<span class="tag">ETIQUETA</span>

# Teorías, conceptos y referentes normativos o legales
## Estado del arte → contexto → teorías base → enfoque integrado → marco legal

<div class="intro">
<b>Síntesis introductoria.</b> La investigación articula los antecedentes históricos y actuales de la prevención de riesgos laborales en la construcción con los enfoques teóricos de <b>gestión de proyectos, seguridad y salud en el trabajo y controles de ingeniería</b>. En Ecuador, la normativa ha evolucionado hacia un enfoque preventivo más riguroso y adaptado a las condiciones del sector construcción. Bajo esta lógica, incorporar controles de ingeniería desde las primeras fases del ciclo de vida permite <b>mejorar la toma de decisiones, optimizar recursos, reducir impactos negativos y fortalecer una gestión preventiva, ética, técnica y sostenible</b>.
</div>

<div class="main-grid">

<div class="left-column">

<div class="section-box">
  <h3>2.1 Estado del Arte</h3>
  <p><b>EVOLUCIÓN:</b> obligación legal → prevención → gestión sistémica → control de ingeniería.</p>
</div>

<div class="section-box red">
  <h3>Marco histórico</h3>
  <p><b>Secuencia normativa clave en Ecuador</b></p>
  <div class="timeline">
    <div class="milestone">
      <b>1921–1929</b>
      <span>Ley de Accidentes de Trabajo → Ley de Prevención de Accidentes → Ley de Responsabilidad por Accidentes.</span>
    </div>
    <div class="milestone">
      <b>1978</b>
      <span>Decreto Supremo No. 2213: prestaciones por accidentes de trabajo y enfermedades profesionales.</span>
    </div>
    <div class="milestone">
      <b>1986</b>
      <span>D.E. 2393: Reglamento de Seguridad y Salud de los Trabajadores.</span>
    </div>
    <div class="milestone">
      <b>2024</b>
      <span>D.E. 255-2024 reemplaza al D.E. 2393 y actualiza el Reglamento de SST.</span>
    </div>
    <div class="milestone">
      <b>2025</b>
      <span>AM MDT-2025-122: Reglamento de Seguridad en el Trabajo y Prevención de Riesgos Laborales para la Construcción y Obras Públicas y Privadas.</span>
    </div>
  </div>
  <p class="mini-ref">(Chancusi et al., 2018; Reglamento de Seguridad y Salud en el Trabajo, 2024; Ministerio de Trabajo, 2025)</p>
</div>

<div class="section-box">
  <h3>Marco contextual actual</h3>
  <p><b>SECTOR CONSTRUCCIÓN + QUITO + RIESGO</b><br>Importancia económica, accidentabilidad, costos por siniestros y presión regulatoria. Suárez Sánchez (2021) aborda la gestión de riesgos laborales en construcción desde una <b>perspectiva técnica y cuantitativa</b>, mediante simulación y predicción, demostrando que la accidentalidad puede analizarse sistemáticamente a partir de variables de riesgo para fortalecer la toma de decisiones.</p>
  <p class="mini-ref">(Zabala & Guamán, 2024; Toro et al., 2021; Suárez Sánchez, 2021; Nørgaard, 2018)</p>
</div>

<div class="section-box dark">
  <h3>Antecedentes científicos</h3>
  <p><b>Predicción + organización + validación</b><br>De un diagnóstico de riesgos hacia una gestión preventiva integrada en la dirección de proyectos.</p>
</div>

</div>

<div>

<div class="theory-panel">

<div class="theory-title">
  <h3>2.2 Marco teórico — TEORÍAS BASE</h3>
  <span>DOS NIVELES DE LECTURA</span>
</div>

<div class="theories">

<div class="theory">
  <div class="level-1">
    <span class="n">TEORÍA 01</span>
    <strong>Gestión basada en riesgo</strong>
    <div class="key"><b>IDENTIFICAR</b> → <b>EVALUAR</b> → <b>CONTROLAR</b></div>
  </div>
  <div class="level-2">
    <p><b>Criterios cuantificables</b> · toma de decisiones · reducción de siniestros · <b>OSH-PRM</b> · criticidad · asignación de recursos preventivos.</p>
    <p class="apa">(Ganiyev et al., 2024; Sousa et al., 2015)</p>
  </div>
</div>

<div class="theory">
  <div class="level-1 red">
    <span class="n">TEORÍA 02</span>
    <strong>Sistemas de gestión de SST</strong>
    <div class="key"><b>ISO 45001</b> · <b>PDCA</b> · mejora continua</div>
  </div>
  <div class="level-2 red">
    <p><b>Marco estructural</b> · Planificar–Hacer–Verificar–Actuar · identificación de peligros · evaluación de riesgos · mejora del desempeño.</p>
    <p class="apa">(International Organization for Standardization, 2018; Viswanathan et al., 2024)</p>
  </div>
</div>

<div class="theory">
  <div class="level-1">
    <span class="n">TEORÍA 03</span>
    <strong>Jerarquía de controles</strong>
    <div class="key"><b>ACTUAR SOBRE LA FUENTE</b></div>
  </div>
  <div class="level-2">
    <p><b>Eliminación</b> → sustitución → <b>controles de ingeniería</b> → controles administrativos → EPP. Prioridad a medidas con mayor eficacia preventiva.</p>
    <p class="apa">(National Institute for Occupational Safety and Health [NIOSH], 2026; Ajslev et al., 2022)</p>
  </div>
</div>

<div class="theory">
  <div class="level-1 red">
    <span class="n">TEORÍA 04</span>
    <strong>Sostenibilidad + gestión de proyectos</strong>
    <div class="key"><b>RESILIENCIA</b> · <b>IA</b> · <b>BIM</b> · datos</div>
  </div>
  <div class="level-2 red">
    <p><b>Seguridad = desempeño organizacional y social</b> · sostenibilidad social · resiliencia · impacto en el entorno · inteligencia artificial · modelación predictiva · BIM · gestión precisa y predictiva.</p>
    <p class="apa">(Kathayat et al., 2025; Tong et al., 2025)</p>
  </div>
</div>

</div>

<div class="integrated-flow">
  <div class="flow-title">ENFOQUE INTEGRADO DE LA INVESTIGACIÓN</div>
  <div class="flow-row">
    <div class="flow-node">
      <b>Cuestionarios de chequeo</b>
      <span>Criterios normativos estructurados</span>
    </div>
    <div class="flow-arrow">→</div>
    <div class="flow-node red">
      <b>Evaluación de riesgos</b>
      <span>Metodologías reconocidas</span>
    </div>
    <div class="flow-arrow">→</div>
    <div class="flow-node">
      <b>Análisis de riesgo en el trabajo</b>
      <span>Identificación + valoración + control</span>
    </div>
    <div class="flow-arrow">→</div>
    <div class="flow-node red">
      <b>Propuesta metodológica</b>
      <span>Técnica · sistémica · mejora continua · estándares + normativa vigente</span>
    </div>
  </div>
</div>

<div class="bottom-grid">

<div class="numerals">
  <div><b>2.2.1</b>Principios de Seguridad y Salud</div>
  <div><b>2.2.2</b>Estrategias de Control de Ingeniería</div>
  <div><b>2.2.3</b>Identificación y Evaluación de Riesgos</div>
  <div><b>2.2.4</b>Gestión Integrada de SST</div>
</div>

<div class="legal">
  <h4>2.4 Marco Legal y Normativo</h4>
  <p><b>D.E. 255-2024</b> · <b>AM-MDT-2024-196</b> · <b>AM-MDT-2025-122</b> · IESS / SGRT</p>
  <div class="image-placeholder">
    ESPACIO PARA IMAGEN<br>
    “Jerarquía de instrumentos aplicables en Ecuador”<br>
    (ubicar aquí la figura del marco legal-normativo)
  </div>
</div>

</div>

</div>

</div>

<p class="footer-note"><b>Lectura sugerida para defensa:</b> antecedentes → evolución normativa → contexto actual → cuatro teorías base → enfoque integrado → aplicación bajo normativa ecuatoriana vigente.</p>

<!--
NOTAS PARA IMPLEMENTACIÓN EN LA PLANTILLA EJEMPLO.PPTX

1. Mantener la estética institucional de la diapositiva 4:
   fondo blanco, negro para jerarquía, verde institucional para estructura y rojo para énfasis.

2. El párrafo introductorio debe colocarse inmediatamente debajo del título y antes del bloque 2.1.

3. En Marco histórico usar una línea de tiempo horizontal:
   1921–1929 | 1978 | 1986 | 2024 | 2025.

4. Las cuatro teorías deben conservar el mismo formato:
   NIVEL 1 = teoría + palabras clave.
   NIVEL 2 = resumen a la derecha mediante conceptos condensados + cita.

5. Después de las cuatro teorías, incluir el diagrama:
   Cuestionarios de chequeo → Evaluación de riesgos → Análisis de riesgo en el trabajo → Propuesta metodológica.

6. En la parte inferior derecha reservar el bloque del MARCO LEGAL-NORMATIVO y espacio para insertar:
   “Jerarquía de instrumentos aplicables en Ecuador”.

7. Palabras clave dominantes:
   PREVENCIÓN · RIESGO · IDENTIFICACIÓN · EVALUACIÓN · CONTROL · PDCA · INGENIERÍA · SOSTENIBILIDAD · RESILIENCIA · IA · BIM · MEJORA CONTINUA · NORMATIVA.
-->

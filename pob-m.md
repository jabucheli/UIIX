<!--
Archivo Markdown
Tema: Determinación secuencial de la población y muestra
Formato: página web/diapositiva 16:9 con representación secuencial
-->

<style>
:root{
  --navy:#16345E;
  --navy2:#234B82;
  --green:#0B8F69;
  --green-soft:#EAF5F0;
  --red:#D92A32;
  --red-soft:#FBECEE;
  --orange:#E98112;
  --orange-soft:#FFF1E4;
  --purple:#6A39C8;
  --purple-soft:#F1EBFC;
  --ink:#1F2B3A;
  --muted:#5A6472;
  --line:#D8DDE5;
  --bg:#F3F5F7;
  --white:#FFFFFF;
}

*{box-sizing:border-box}
body{
  margin:0;
  background:#ECEFF3;
  font-family:Arial, Helvetica, sans-serif;
  color:var(--ink);
}

.slide{
  width:min(1600px, 100%);
  margin:0 auto;
  background:var(--white);
  min-height:100vh;
  padding:28px 26px 22px;
  box-shadow:0 0 24px rgba(0,0,0,.08);
}

.title{
  text-align:center;
  color:var(--navy);
  font-size:clamp(30px, 3.5vw, 56px);
  line-height:1.05;
  font-weight:800;
  margin:10px 0 22px;
}

.flow{
  display:grid;
  grid-template-columns: 1.05fr 90px 1.12fr 90px .72fr 90px 1.05fr;
  gap:10px;
  align-items:center;
}

.stage{
  border:2px solid var(--line);
  border-radius:22px;
  overflow:hidden;
  background:#fff;
  min-height:490px;
}

.stage .head{
  position:relative;
  padding:22px 20px 16px;
  color:#fff;
  font-weight:800;
  display:flex;
  align-items:flex-start;
  gap:16px;
}
.stage .num{
  width:58px;
  height:58px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:28px;
  font-weight:800;
  background:rgba(255,255,255,.18);
  border:2px solid rgba(255,255,255,.35);
  flex:0 0 auto;
}
.stage .hgroup{
  display:flex;
  flex-direction:column;
  gap:4px;
}
.stage .hgroup .big{
  font-size:clamp(22px, 1.8vw, 34px);
  line-height:1.05;
}
.stage .hgroup .small{
  font-size:clamp(14px, 1vw, 20px);
  line-height:1.15;
  opacity:.95;
  font-weight:500;
}
.stage .body{
  padding:18px 22px 22px;
}
.chips{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-bottom:14px;
}
.chip{
  border-radius:999px;
  padding:8px 14px;
  font-size:14px;
  font-weight:700;
  border:1.5px solid;
  background:#fff;
}
.info{
  list-style:none;
  padding:0;
  margin:0;
}
.info li{
  padding:12px 0;
  border-top:1px solid #E6E9EF;
  font-size:18px;
  line-height:1.25;
}
.info li:first-child{border-top:0}
.info b{
  font-size:19px;
}
.arrowWrap{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:12px;
}
.arrow{
  font-size:72px;
  color:#8FA1BA;
  line-height:1;
  font-weight:800;
}
.label{
  background:#EDF1F6;
  color:#23405F;
  border:1px solid #CAD3DF;
  border-radius:16px;
  padding:12px 12px;
  text-align:center;
  font-size:14px;
  font-weight:700;
  line-height:1.15;
  max-width:88px;
}
.green .head{background:var(--green)}
.red .head{background:var(--red)}
.orange .head{background:var(--orange)}
.purple .head{background:var(--purple)}

.green .body{background:linear-gradient(180deg, var(--green-soft), #fff 26%)}
.red .body{background:linear-gradient(180deg, var(--red-soft), #fff 26%)}
.orange .body{background:linear-gradient(180deg, var(--orange-soft), #fff 26%)}
.purple .body{background:linear-gradient(180deg, var(--purple-soft), #fff 26%)}

.green .chip{color:var(--green); border-color:#B7D9CB; background:#F7FCFA}
.red .chip{color:var(--red); border-color:#F0B9BE; background:#FFF8F8}
.orange .chip{color:var(--orange); border-color:#F3C99C; background:#FFF9F4}
.purple .chip{color:var(--purple); border-color:#D7C8F3; background:#FBF9FF}

.logic{
  margin-top:22px;
  border:2px solid #D7DEE7;
  border-radius:18px;
  overflow:hidden;
  background:#F8FAFC;
}
.logic-grid{
  display:grid;
  grid-template-columns: 290px repeat(4, 1fr);
  align-items:stretch;
}
.logic .labelHead{
  background:var(--navy);
  color:#fff;
  padding:18px 22px;
  font-size:24px;
  font-weight:800;
  display:flex;
  align-items:center;
  gap:12px;
}
.logic .step{
  padding:18px 16px;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  font-size:18px;
  font-weight:800;
  position:relative;
}
.logic .step:not(:last-child)::after{
  content:"➜";
  position:absolute;
  right:-11px;
  top:50%;
  transform:translateY(-50%);
  font-size:24px;
  color:#6C7A8F;
}
.step.s1{background:#DFF1EA;color:#1A5F49}
.step.s2{background:#FBE9EC;color:#8F1F25}
.step.s3{background:#FDF0E3;color:#97540D}
.step.s4{background:#EFE8FB;color:#4E2A9B}

.footnote{
  margin-top:12px;
  padding-top:10px;
  border-top:2px solid #E1E6ED;
  color:#3F4A57;
  font-size:18px;
}
.footnote b{color:var(--navy)}

@media (max-width:1200px){
  .flow{grid-template-columns:1fr; gap:18px}
  .arrowWrap{flex-direction:row}
  .label{max-width:none; width:auto; padding:10px 18px}
  .logic-grid{grid-template-columns:1fr}
  .logic .step:not(:last-child)::after{content:"↓"; right:auto; top:auto; bottom:-16px; left:50%; transform:translateX(-50%)}
}
</style>

<div class="slide">

  <div class="title">Determinación secuencial de la población y muestra</div>

  <div class="flow">

    <section class="stage green">
      <div class="head">
        <div class="num">1</div>
        <div class="hgroup">
          <div class="big">Fases 1–2 · Base documental</div>
          <div class="small">Fases documentales</div>
        </div>
      </div>
      <div class="body">
        <div class="chips">
          <span class="chip">2024–2026</span>
          <span class="chip">NTP 324/330</span>
        </div>
        <ul class="info">
          <li><b>Población:</b> fuentes normativas, técnicas y científicas.</li>
          <li><b>Muestra:</b> documentos seleccionados.</li>
          <li><b>Muestreo:</b> intencional · no probabilístico.</li>
          <li><b>Criterios:</b> relevancia, vigencia, aplicabilidad y pertinencia temática.</li>
        </ul>
      </div>
    </section>

    <div class="arrowWrap">
      <div class="arrow">→</div>
      <div class="label">Sustenta el diseño de instrumentos</div>
    </div>

    <section class="stage red">
      <div class="head">
        <div class="num">2</div>
        <div class="hgroup">
          <div class="big">Fases 3–4 · Etapa aplicada</div>
          <div class="small">Campo: procesos, riesgos y proyectos</div>
        </div>
      </div>
      <div class="body">
        <div class="chips">
          <span class="chip">12 procesos</span>
          <span class="chip">21 riesgos</span>
          <span class="chip">106+83 aplicaciones*</span>
        </div>
        <ul class="info">
          <li><b>Población:</b> procesos constructivos y factores de riesgo.</li>
          <li><b>Muestra:</b> proyectos representativos y tareas críticas.</li>
          <li><b>Muestreo:</b> intencional · no probabilístico.</li>
          <li><b>Criterios:</b> pertinencia técnica, presencia de procesos y riesgos; criticidad según NTP 330.</li>
        </ul>
      </div>
    </section>

    <div class="arrowWrap">
      <div class="arrow">→</div>
      <div class="label">Identifica tareas críticas</div>
    </div>

    <section class="stage orange">
      <div class="head">
        <div class="num">3</div>
        <div class="hgroup">
          <div class="big">Fase 4 · Selección crítica</div>
          <div class="small">Priorización según resultados</div>
        </div>
      </div>
      <div class="body">
        <ul class="info">
          <li><b>Unidad de análisis:</b> actividades evaluadas.</li>
          <li><b>Muestra:</b> tareas críticas.</li>
          <li><b>Criterio:</b> nivel de riesgo NTP 330.</li>
        </ul>
      </div>
    </section>

    <div class="arrowWrap">
      <div class="arrow">→</div>
      <div class="label">Se valida la propuesta</div>
    </div>

    <section class="stage purple">
      <div class="head">
        <div class="num">4</div>
        <div class="hgroup">
          <div class="big">Fase 5 · Validación</div>
          <div class="small">Juicio de expertos – Delphi</div>
        </div>
      </div>
      <div class="body">
        <div class="chips">
          <span class="chip">8 expertos</span>
          <span class="chip">3 rondas Delphi</span>
        </div>
        <ul class="info">
          <li><b>Población:</b> profesionales expertos en SST, prevención, proyectos e investigación.</li>
          <li><b>Muestra:</b> 8 validadores.</li>
          <li><b>Muestreo:</b> intencional · criterio experto.</li>
          <li><b>Criterios:</b> formación, experiencia y trayectoria.</li>
        </ul>
      </div>
    </section>

  </div>

  <div class="logic">
    <div class="logic-grid">
      <div class="labelHead">Lógica secuencial</div>
      <div class="step s1">Base documental</div>
      <div class="step s2">Etapa aplicada</div>
      <div class="step s3">Tareas críticas</div>
      <div class="step s4">Validación experta</div>
    </div>
  </div>

  <div class="footnote">
    * <b>106</b> (edificación) + <b>83</b> (infraestructura): aplicaciones piloto; evidencia de campo, no universo estadístico.
  </div>

</div>

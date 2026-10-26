/* Harness de auditoría y captura para la diapositiva 2 (Problematización):
   tres columnas (Evidencia / flujo / Justificación). Los bloques EVIDENCIA y
   JUSTIFICACIÓN llevan el mismo formato de panel y, al hacer clic, se agrandan
   en el mismo lugar (problem-body--fev / problem-body--fjf). Genera:
     out/pb_shot.html      -> captura + informe de geometría en reposo
     out/pb_shot_fev.html  -> estado de foco del bloque Evidencia
     out/pb_shot_jf.html   -> estado de foco del bloque Justificación
     out/pb_shot_p4.html   -> Problema central y jerarquía ampliados juntos
   El informe (#report) queda fuera de la pantalla (left:-9999px) para no
   manchar la captura; se lee con --dump-dom. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'presentacion-web');
const OUT = path.join(__dirname, 'out');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const LGOUT = path.join(OUT, 'assets');
if (!fs.existsSync(LGOUT)) fs.mkdirSync(LGOUT, { recursive: true });
fs.copyFileSync(path.join(ROOT, 'assets', 'logo.png'), path.join(LGOUT, 'logo.png'));

const css = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
const icons = fs.readFileSync(path.join(ROOT, 'js/icons.js'), 'utf8');
const just = fs.readFileSync(path.join(ROOT, 'js/components/justificationCard.js'), 'utf8');
const data = fs.readFileSync(path.join(ROOT, 'js/data/problematizationData.js'), 'utf8');
const slide = fs.readFileSync(path.join(ROOT, 'js/slides/slide02Problematization.js'), 'utf8');

const boot = [
  'try{var h=window.slideRenderers.problematizacion(null,window.PROBLEMA);',
  'document.getElementById("frame").innerHTML=h;',
  'document.querySelector(".slide").classList.add("active");',
  'var s=document.querySelector(".slide");',
  '(function(){var i=document.createElement("img");i.className="slide-logo";i.src="assets/logo.png";i.alt="Logotipo";s.appendChild(i);',
  'var f=document.createElement("div");f.className="slide-foot";var fi=document.createElement("img");fi.src="assets/logo-inf.png";fi.alt="";f.appendChild(fi);s.appendChild(f);}());',
  '}catch(e){var pe=document.createElement("pre");pe.id="err";pe.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(pe);}'
].join('');

const audit = [
  'function audit(){',
  'var o="";',
  'var NL=String.fromCharCode(10);',
  'var q=function(s){return Array.prototype.slice.call(document.querySelectorAll(s));};',
  'function live(el){return el&&el.offsetParent!==null&&el.offsetHeight>0&&getComputedStyle(el).visibility!=="hidden";}',
  'var head=document.querySelector(".slide-head");',
  'var body=document.querySelector(".problem-body");',
  'var ev=document.querySelector(".ev-column");',
  'var evp=document.querySelector(".ev-panel");',
  'var evc=document.querySelector(".ev-cards");',
  'var flow=document.querySelector(".flow");',
  'var jc=document.querySelector(".just-column");',
  'var jp=document.querySelector(".just-panel");',
  'o+="titulo "+document.querySelector(".slide-head h2").textContent+NL;',
  'o+="cabecera "+(head?head.offsetWidth+"x"+head.offsetHeight:"MISSING")+NL;',
  'o+="cuerpo "+(body?body.offsetWidth+"x"+body.offsetHeight:"MISSING")+NL;',
  'o+="evidencia "+(ev?ev.offsetWidth+"x"+ev.offsetHeight:"-")+" panel "+(evp?evp.offsetWidth+"x"+evp.offsetHeight:"-")+" tarjetas "+(evc?evc.offsetWidth+"x"+evc.offsetHeight:"-")+NL;',
   'o+="flow "+(flow?flow.offsetWidth+"x"+flow.offsetHeight:"-")+" just "+(jc?jc.offsetWidth+"x"+jc.offsetHeight:"-")+" panel "+(jp?jp.offsetWidth+"x"+jp.offsetHeight:"-")+NL;',
   'o+="bloques flujo "+q(".flow > .flow-node").length+" / "+q(".flow > .flow-node .tnode-dot").map(function(n){return n.textContent;}).join(",")+NL;',
   'if(live(flow)){var ns=q(".flow > .flow-node"),frc=flow.getBoundingClientRect();o+="margenes flujo "+(ns[0].getBoundingClientRect().top-frc.top).toFixed(1)+" / "+(frc.bottom-ns[ns.length-1].getBoundingClientRect().bottom).toFixed(1)+NL;}',
   'if(live(flow)){var ar=document.querySelector(".flow-link").getBoundingClientRect(),pr=document.querySelector(".flow-node[data-focus=p4]").getBoundingClientRect(),dy=(ar.top+ar.bottom-pr.top-pr.bottom)/2;o+="flecha delta centro "+dy.toFixed(1)+NL;if(Math.abs(dy)>1)throw new Error("Flecha descentrada respecto al bloque 4");}',
  'o+="ev-header "+(document.querySelector(".ev-header")?document.querySelector(".ev-header").offsetHeight:"-")+" accent "+(document.querySelector(".ev-column .accent")?"presente":"MISSING")+NL;',
  'q(".ev-block").forEach(function(b,i){var t=b.querySelector(".ev-block-title");o+="bloque "+i+" "+(b.className.replace("ev-block ",""))+"="+b.offsetWidth+"x"+b.offsetHeight+" tit "+(t?t.offsetHeight:"-")+NL;});',
  'q(".ev-period").forEach(function(p,i){o+="periodo "+i+"="+p.offsetWidth+"x"+p.offsetHeight+NL;});',
   'q(".p-level").filter(live).forEach(function(p,i){o+="nivel "+i+"="+p.offsetWidth+"x"+p.offsetHeight+" ["+(p.textContent)+"]"+NL;});',
   'o+="jerarquia resumen "+(live(document.querySelector(".just-column .pyramid-block"))?"visible":"oculta")+NL;',
   'o+="jerarquia ampliada "+(live(document.querySelector(".hierarchy-overlay"))?"visible":"oculta")+NL;',
   'o+="problema ampliado "+(live(document.querySelector(".hierarchy-problem"))?"visible":"oculto")+NL;',
  'q(".just-card").forEach(function(c,i){o+="jc "+i+"="+c.offsetWidth+"x"+c.offsetHeight+NL;});',
  'o+="foco "+body.className+(body.getAttribute("data-focus")?" /"+body.getAttribute("data-focus"):"")+NL;',
   '[".slide-head",".problem-body",".ev-column",".ev-panel",".ev-cards",".ev-hist",".ev-period",".ev-block",".ev-sources-block",".ev-footnote",".flow",".just-column",".just-panel",".just-cards",".pyramid-block",".pyramid",".obj-block",".campo-block",".q7-card",".hierarchy-card",".hierarchy-problem",".p-level"].forEach(function(cn){',
  'q(cn).filter(live).forEach(function(el,i){var c=el.scrollHeight-el.clientHeight;if(c>0)o+="  clip "+cn+i+" "+c+NL;});});',
   'q(".ev-value,.ev-caption,.ev-period-label,.ev-block-title,.hbar-label,.hbar-value,.ev-source,.ev-donut-cap,.ev-donut-src,.src-item,.src-text,.ev-footnote,.node-title,.node-body,.just-card-title,.just-card-body,.p-level span,.pyramid-title,.pyramid-caption,.pyramid-scale,.hierarchy-hint,.hierarchy-problem-tag,.hierarchy-problem-title,.hierarchy-problem-body").filter(live).forEach(function(e,i){',
  'if(e.scrollWidth>e.clientWidth+1)o+="  tx "+i+" <"+e.className+"> w"+e.clientWidth+"/"+e.scrollWidth+NL;});',
  'var fr=document.querySelector(".slide-frame").getBoundingClientRect();',
   'q(".slide-head,.problem-body,.ev-column,.ev-panel,.ev-cards,.ev-block,.flow,.flow-node,.just-column,.just-panel,.q7-card,.q7-overlay,.hierarchy-card,.hierarchy-overlay").forEach(function(e,i){var r=e.getBoundingClientRect();if(!r.width)return;var ov=[];',
  'if(r.left<fr.left-1)ov.push("left");if(r.right>fr.right+1)ov.push("right");if(r.top<fr.top-1)ov.push("top");if(r.bottom>fr.bottom+1)ov.push("bottom");',
  'if(ov.length)o+="  frame OVERFLOW "+i+" <"+e.className+"> "+ov.join(",")+NL;});',
  'o+="logo "+(document.querySelector(".slide-logo")?"presente":"MISSING")+NL;',
  'o+="pie "+((document.querySelector(".slide-foot")||{}).offsetHeight>0?"visible":"presente (oculto sin pantalla completa)")+NL;',
  'return o;}'
].join('');

const report = [
  'var NL=String.fromCharCode(10);var o="";',
  'var q=function(s){return Array.prototype.slice.call(document.querySelectorAll(s));};',
  'o+="== SIN FOCO =="+NL;',
  'o+=audit();',
  'var body=document.querySelector(".problem-body");',
  'body.className="problem-body problem-body--fev";body.setAttribute("data-focus","ev");',
  'o+="== FOCO ev =="+NL;',
  'o+=audit();',
  'body.className="problem-body problem-body--fjf";body.setAttribute("data-focus","jf");',
   'o+="== FOCO jf =="+NL;',
   'o+=audit();',
   'body.className="problem-body problem-body--fp4";body.setAttribute("data-focus","p4");',
   'o+="== FOCO p4 =="+NL;',
   'o+=audit();',
  'body.className="problem-body problem-body--fq7";body.setAttribute("data-focus","q7");',
  'o+="== FOCO q7 =="+NL;',
  'o+=audit();',
  'body.className="problem-body";body.removeAttribute("data-focus");',
  'o+="== RESTAURADO =="+NL;',
  'o+=audit();',
  'var pre=document.createElement("pre");pre.id="report";pre.textContent=o;' +
  'pre.style.cssText="position:fixed;left:-9999px;top:0;z-index:0;";' +
  'document.body.appendChild(pre);'
].join('');

const shell = [
  '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=1408">',
  '<style>html,body{margin:0;padding:0;overflow:hidden}.slide-frame{zoom:1 !important;margin:0}',
  '.slide-frame *{transition:none !important;animation:none !important}</style>',
  '<style>' + css + '</style></head><body>',
  '<div class="slide-frame" id="frame"></div>',
  '<script>' + icons + '</script>',
  '<script>' + just + '</script>',
  '<script>' + data + '</script>',
  '<script>' + slide + '</script>',
  '<script>'
].join('');

fs.writeFileSync(path.join(OUT, 'pb_shot.html'),
  shell + boot + audit + 'try{' + report + '}catch(e){var ep=document.createElement("pre");ep.id="err";ep.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(ep);}' + '</script></body></html>');

function shot(cls, key) {
  const apply = 'setTimeout(function(){var b=document.querySelector(".problem-body");'
    + 'b.className="problem-body problem-body--' + cls + '";b.setAttribute("data-focus","' + key + '");},60);';
  return shell + boot + apply + '</script></body></html>';
}
fs.writeFileSync(path.join(OUT, 'pb_shot_fev.html'), shot('fev', 'ev'));
fs.writeFileSync(path.join(OUT, 'pb_shot_jf.html'), shot('fjf', 'jf'));
fs.writeFileSync(path.join(OUT, 'pb_shot_p4.html'), shot('fp4', 'p4'));
fs.writeFileSync(path.join(OUT, 'pb_shot_q7.html'), shot('fq7', 'q7'));

console.log('capturas: pb_shot.html + pb_shot_fev.html + pb_shot_jf.html + pb_shot_p4.html + pb_shot_q7.html');

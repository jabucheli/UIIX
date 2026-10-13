/* Harness de auditoría y captura para la diapositiva 10 (Validación): mapa
   mental del proceso Delphi según 1Validacion.md (núcleo «Validación de la
   propuesta», panel de 8 expertos, tres rondas y banda de síntesis, con un
   modal por ronda + tabla comparativa). Genera:
     out/vl_shot.html          -> captura + informe de geometría en reposo
     out/vl_shot_fr1..frn.html -> estados de foco
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
const data = fs.readFileSync(path.join(ROOT, 'js/data/validationData.js'), 'utf8');
const slide = fs.readFileSync(path.join(ROOT, 'js/slides/slide10Validation.js'), 'utf8');

const boot = [
  'try{var h=window.slideRenderers.validacion(null,{},{},{},{},null);',
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
  'var head=document.querySelector(".slide-head");',
  'var body=document.querySelector(".vl-body");',
  'var map=document.querySelector(".vl-map");',
  'var core=document.querySelector(".vl-core");',
  'var panel=document.querySelector(".vl-panel");',
  'var synth=document.querySelector(".vl-synth");',
  'var rounds=q(".vl-round");',
  'o+="titulo "+document.querySelector(".slide-head h2").textContent+NL;',
  'o+="subtitulo "+document.querySelector(".vl-subtitle").textContent+NL;',
  'var sub=document.querySelector(".vl-subtitle");',
  'var lh=parseFloat(getComputedStyle(sub).lineHeight)||14;',
  'o+="subtitulo lineas "+Math.round(sub.offsetHeight/lh)+NL;',
  'o+="cabecera "+(head?head.offsetWidth+"x"+head.offsetHeight:"MISSING")+NL;',
  'o+="cuerpo "+(body?body.offsetWidth+"x"+body.offsetHeight:"MISSING")+NL;',
  'o+="mapa "+(map?map.offsetWidth+"x"+map.offsetHeight:"-")',
  '+ " nucleo "+(core?core.offsetWidth+"x"+core.offsetHeight:"-")',
  '+ " panel "+(panel?panel.offsetWidth+"x"+panel.offsetHeight:"-")+NL;',
  'o+="rondas "+rounds.map(function(r){return (r.getAttribute("data-focus")||"?")+"="+r.offsetWidth+"x"+r.offsetHeight;}).join(" ")+NL;',
  'o+="etapas "+rounds.map(function(r){return (r.querySelector(".vl-r-etapa")||{}).textContent;}).join(" | ")+NL;',
  'o+="props "+rounds.map(function(r){return r.querySelectorAll(".vl-r-prop").length;}).join(",")+NL;',
  'o+="dictamenes "+rounds.map(function(r){return (r.querySelector(".vl-r-dic")||{}).textContent;}).join(" | ")+NL;',
  'o+="sintesis "+(synth?synth.offsetWidth+"x"+synth.offsetHeight:"-");' +
  'o+=" nodos "+q(".vl-syn-node").length+" caps "+q(".vl-cap").length+NL;',
  'o+="modales "+q(".vl-modal").length+" tarjetas "+q(".vl-card").length+" comparativa "+q(".vl-table--comp thead th").length+NL;',
  'o+="nota "+(document.querySelector(".vl-note")?"presente":"MISSING")+NL;',
  'function live(el){return el&&el.offsetParent!==null&&el.offsetHeight>0&&getComputedStyle(el).visibility!=="hidden";}',
  '[".slide-head",".vl-subtitle",".vl-body",".vl-map",".vl-panel",".vl-core",".vl-round",".vl-synth",".vl-note",".vl-modal",".vl-card"].forEach(function(cn){',
  'q(cn).filter(live).forEach(function(el,i){var c=el.scrollHeight-el.clientHeight;if(c>0)o+="  clip "+cn+i+" "+c+NL;});});',
  'q(".vl-subtitle,.vl-core-t,.vl-core-m,.vl-core-c,.vl-r-num,.vl-r-etapa,.vl-r-prop,.vl-r-meta-i,.vl-r-res-i,.vl-r-dic,.vl-syn-node,.vl-syn-concl,.vl-cap em,.vl-cap b,.vl-syn-dic").filter(live).forEach(function(e,i){',
  'if(e.scrollWidth>e.clientWidth+1)o+="  tx "+i+" <"+e.className+"> w"+e.clientWidth+"/"+e.scrollWidth+NL;});',
  'var fr=document.querySelector(".slide-frame").getBoundingClientRect();',
  'q(".slide-head,.vl-body,.vl-map,.vl-panel,.vl-core,.vl-round,.vl-synth,.vl-note").forEach(function(e,i){var r=e.getBoundingClientRect();if(!r.width)return;var ov=[];',
  'if(r.left<fr.left-1)ov.push("left");if(r.right>fr.right+1)ov.push("right");if(r.top<fr.top-1)ov.push("top");if(r.bottom>fr.bottom+1)ov.push("bottom");',
  'if(ov.length)o+="  frame OVERFLOW "+i+" <"+e.className+"> "+ov.join(",")+NL;});',
  'o+="logo "+(document.querySelector(".slide-logo")?"presente":"MISSING")+NL;',
  'o+="pie "+((document.querySelector(".slide-foot")||{}).offsetHeight>0?"visible":"presente (oculto sin pantalla completa)")+NL;',
  'return o;}'
].join('');

const report = [
  'var NL=String.fromCharCode(10);var o="";',
  'var q=function(s){return Array.prototype.slice.call(document.querySelectorAll(s));};',
  'function live(el){return el&&el.offsetParent!==null&&el.offsetHeight>0&&getComputedStyle(el).visibility!=="hidden";}',
  'o+="== SIN FOCO =="+NL;',
  'o+=audit();',
  'var body=document.querySelector(".vl-body");',
  '["r1","r2","r3","rn"].forEach(function(k){',
  'body.className="vl-body vl-body--f"+k;body.setAttribute("data-focus",k);',
  'o+="== FOCO "+k+" =="+NL;',
  'o+=audit();',
  'var mod=q(".vl-modal").filter(live);',
  'o+="modales visibles "+mod.map(function(m){return m.className.replace("vl-modal ","")+"="+m.offsetWidth+"x"+m.offsetHeight;}).join(" ")+NL;',
  '});',
  'body.className="vl-body";body.removeAttribute("data-focus");',
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
  '<script>' + data + '</script>',
  '<script>' + slide + '</script>',
  '<script>'
].join('');

fs.writeFileSync(path.join(OUT, 'vl_shot.html'),
  shell + boot + audit + 'try{' + report + '}catch(e){var ep=document.createElement("pre");ep.id="err";ep.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(ep);}' + '</script></body></html>');

/* Capturas: reposo y los cuatro estados de foco (r1, r2, r3, rn). */
function shot(focus) {
  const apply = focus
    ? 'setTimeout(function(){var b=document.querySelector(".vl-body");'
      + 'b.className="vl-body vl-body--f' + focus + '";b.setAttribute("data-focus","' + focus + '");'
      + 'document.querySelector(".vl-subtitle").textContent="Clic fuera de la tarjeta o tecla ESC para volver a la vista completa";},60);'
    : '';
  return shell + boot + apply + '</script></body></html>';
}
['r1', 'r2', 'r3', 'rn'].forEach(function (k) {
  fs.writeFileSync(path.join(OUT, 'vl_shot_f' + k + '.html'), shot(k));
});

/* Copia las imágenes referenciadas por la lámina a out/assets/ para las
   capturas headless. */
var ASSET_OUT = path.join(OUT, 'assets');
function copiarAssets(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
    var src = path.join(dir, e.name);
    var dst = path.join(ASSET_OUT, path.relative(path.join(ROOT, 'assets'), src));
    if (e.isDirectory()) {
      fs.mkdirSync(dst, { recursive: true });
      copiarAssets(src);
    } else {
      fs.copyFileSync(src, dst);
    }
  });
}
if (!fs.existsSync(ASSET_OUT)) fs.mkdirSync(ASSET_OUT, { recursive: true });
copiarAssets(path.join(ROOT, 'assets'));
console.log('capturas: vl_shot.html + fr1/fr2/fr3/frn; assets copiados a out/assets');

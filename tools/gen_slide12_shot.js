/* Harness de auditoría y captura para la diapositiva 12 (Recomendaciones):
   nodo superior + tres columnas de ámbito (metodológico, práctico y académico)
   con seis subbloques 1-6, banda operacional
   Ampliar -> Aplicar -> Actualizar -> Investigar y panel de detalle ampliado
   por subbloque (RECOMENDACIONES.docx / recomendacion1.md). Genera:
     out/rc_shot.html           -> captura + informe de geometría en reposo
     out/rc_shot_frc1..frc6.html -> estados de foco
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
const data = fs.readFileSync(path.join(ROOT, 'js/data/recomendacionesData.js'), 'utf8');
const slide = fs.readFileSync(path.join(ROOT, 'js/slides/slide12Recomendaciones.js'), 'utf8');

const boot = [
  'try{var h=window.slideRenderers.recomendaciones(null,{},{},{},{},null);',
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
  'var body=document.querySelector(".rc-body");',
  'var cols=document.querySelector(".rc-cols");',
  'var flow=document.querySelector(".rc-flow");',
  'o+="titulo "+document.querySelector(".slide-head h2").textContent+NL;',
  'var sub=document.querySelector(".rc-subtitle");',
  'o+="subtitulo "+sub.textContent+NL;',
  'o+="cabecera "+(head?head.offsetWidth+"x"+head.offsetHeight:"MISSING")+NL;',
  'o+="cuerpo "+(body?body.offsetWidth+"x"+body.offsetHeight:"MISSING")+NL;',
  'o+="columnas "+(cols?cols.offsetWidth+"x"+cols.offsetHeight:"-")+" banda "+(flow?flow.offsetWidth+"x"+flow.offsetHeight:"-")+NL;',
  'q(".rc-amb").forEach(function(a,i){var h=a.querySelector(".rc-amb-h");o+="ambito "+i+" "+a.className.replace("rc-amb ","")+"="+a.offsetWidth+"x"+a.offsetHeight+" cab "+h.offsetWidth+"x"+h.offsetHeight+NL;});',
  'q(".rc-sub").forEach(function(c){var h=c.querySelector(".rc-sub-h");var k=c.querySelector(".rc-kws,.rc-lista,.rc-radial,.rc-flujo2,.rc-fv");o+="sub "+(c.getAttribute("data-focus")||"?")+"="+c.offsetWidth+"x"+c.offsetHeight+" cab "+h.offsetHeight+" cuerpo "+(k?k.offsetWidth+"x"+k.offsetHeight:"-")+NL;});',
  'o+="banda nodos "+q(".rc-fn").length+" flechas "+q(".rc-arrow").length+NL;',
  'o+="paneles "+q(".rc-modal").length+" tarjetas "+q(".rc-card").length+NL;',
  'function live(el){return el&&el.offsetParent!==null&&el.offsetHeight>0&&getComputedStyle(el).visibility!=="hidden";}',
  'var mlive=q(".rc-modal").filter(live);',
  'o+="paneles visibles "+mlive.length+(mlive.length?" "+mlive.map(function(m){return m.className.replace("rc-modal ","")+"="+m.offsetWidth+"x"+m.offsetHeight+"::"+m.querySelector(".rc-card").offsetWidth+"x"+m.querySelector(".rc-card").offsetHeight;}).join(" "):"")+NL;',
  '[".slide-head",".rc-subtitle",".rc-cols",".rc-amb",".rc-subs",".rc-sub",".rc-sub-h",".rc-amb-h",".rc-radial",".rc-radial-canvas",".rc-flujo2",".rc-fv",".rc-flow",".rc-modal",".rc-card",".rc-card-body",".rc-card-fig"].forEach(function(cn){',
  'q(cn).filter(live).forEach(function(el,i){var c=el.scrollHeight-el.clientHeight;if(c>0)o+="  clip "+cn+i+" "+c+NL;});});',
  'q(".rc-radial-hub").forEach(function(e){o+="radial hub "+e.offsetWidth+"x"+e.offsetHeight+NL;});',
  'q(".rc-radial-node").forEach(function(e){var p=e.offsetParent?{w:e.offsetParent.offsetWidth,h:e.offsetParent.offsetHeight}:{w:0,h:0};o+="radial node "+e.textContent+" "+e.offsetWidth+"x"+e.offsetHeight+" left"+e.offsetLeft+" top"+e.offsetTop+" parent "+p.w+"x"+p.h+NL;});',
  'q(".rc-radial-ntp .rc-ntp").forEach(function(e,i){o+="ntp"+i+" "+e.offsetWidth+"x"+e.offsetHeight+NL;});',
  'q(".rc-subtitle,.rc-radial-hub,.rc-radial-node,.rc-ntp,.rc-f2-node,.rc-fv-node,.rc-amb-tt b,.rc-amb-tt em,.rc-sub-t,.rc-kw,.rc-lista li,.rc-sub-s,.rc-sub-c,.rc-fn,.rc-card-k,.rc-card-p,.rc-card-c").filter(live).forEach(function(e,i){',
  'if(e.scrollWidth>e.clientWidth+1)o+="  tx "+i+" <"+e.className+"> w"+e.clientWidth+"/"+e.scrollWidth+NL;});',
  'var fr=document.querySelector(".slide-frame").getBoundingClientRect();',
  'q(".slide-head,.rc-cols,.rc-amb,.rc-sub,.rc-radial,.rc-radial-node,.rc-flujo2,.rc-f2-node,.rc-fv,.rc-fv-node,.rc-flow,.rc-modal,.rc-card--fig,.rc-card-fig").forEach(function(e,i){var r=e.getBoundingClientRect();if(!r.width)return;var ov=[];',
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
  'var body=document.querySelector(".rc-body");',
  '["rc1","rc2","rc3","rc4","rc5","rc6"].forEach(function(k){',
  'body.className="rc-body rc-body--f"+k;body.setAttribute("data-focus",k);',
  'o+="== FOCO "+k+" =="+NL;',
  'o+=audit();',
  'var mod=q(".rc-modal").filter(live);',
  'o+="paneles visibles "+mod.map(function(m){return m.className.replace("rc-modal ","")+"="+m.offsetWidth+"x"+m.offsetHeight;}).join(" ")+NL;',
  '});',
  'body.className="rc-body";body.removeAttribute("data-focus");',
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

fs.writeFileSync(path.join(OUT, 'rc_shot.html'),
  shell + boot + audit + 'try{' + report + '}catch(e){var ep=document.createElement("pre");ep.id="err";ep.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(ep);}' + '</script></body></html>');

/* Capturas: reposo y los seis estados de foco. */
function shot(focus) {
  const apply = focus
    ? 'setTimeout(function(){var b=document.querySelector(".rc-body");'
      + 'b.className="rc-body rc-body--f' + focus + '";b.setAttribute("data-focus","' + focus + '");'
      + 'document.querySelector(".rc-subtitle").textContent="Clic fuera del panel o tecla ESC para volver a la vista completa";},60);'
    : '';
  return shell + boot + apply + '</script></body></html>';
}
['rc1', 'rc2', 'rc3', 'rc4', 'rc5', 'rc6'].forEach(function (k) {
  fs.writeFileSync(path.join(OUT, 'rc_shot_f' + k + '.html'), shot(k));
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
console.log('capturas: rc_shot.html + frc1/frc2/frc3/frc4/frc5/frc6; assets copiados a out/assets');

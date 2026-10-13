/* Harness de auditoría y captura para la diapositiva 11 (Conclusiones):
   seis tarjetas encadenadas 1 -> 6, conectores radiales hacia el nodo central
   y franja de APORTE CENTRAL, con un panel de conclusión completa por bloque
   (Conclusiones.md / CONCLUSIONES.docx). Genera:
     out/cn_shot.html          -> captura + informe de geometría en reposo
     out/cn_shot_fb1..fb6.html -> estados de foco
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
const data = fs.readFileSync(path.join(ROOT, 'js/data/conclusionsData.js'), 'utf8');
const slide = fs.readFileSync(path.join(ROOT, 'js/slides/slide11Conclusions.js'), 'utf8');

const boot = [
  'try{var h=window.slideRenderers.conclusiones(null,{},{},{},{},null);',
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
  'var body=document.querySelector(".cn-body");',
  'var flow=document.querySelector(".cn-flow");',
  'var cards=q(".cn-flow .cn-card");',
  'var node=document.querySelector(".cn-node");',
  'var aporte=document.querySelector(".cn-aporte");',
  'o+="titulo "+document.querySelector(".slide-head h2").textContent+NL;',
  'var sub=document.querySelector(".cn-subtitle");',
  'o+="subtitulo "+sub.textContent+NL;',
  'var lh=parseFloat(getComputedStyle(sub).lineHeight)||14;',
  'o+="subtitulo lineas "+Math.round(sub.offsetHeight/lh)+NL;',
  'o+="cabecera "+(head?head.offsetWidth+"x"+head.offsetHeight:"MISSING")+NL;',
  'o+="cuerpo "+(body?body.offsetWidth+"x"+body.offsetHeight:"MISSING")+NL;',
  'o+="tarjetas "+cards.map(function(c){return (c.getAttribute("data-focus")||"?")+"="+c.offsetWidth+"x"+c.offsetHeight+":"+c.className.replace("cn-card ","");}).join(" ")+NL;',
  'o+="nodo "+(node?node.offsetWidth+"x"+node.offsetHeight:"-")+" aporte "+(aporte?aporte.offsetWidth+"x"+aporte.offsetHeight:"-")+NL;',
  'o+="conceptos "+cards.map(function(c){return (c.querySelector(".cn-card-k")||{}).textContent;}).filter(function(t){return t;}).length+NL;',
  'o+="paneles "+q(".cn-modal").length+" dialogos "+q(".cn-dialog").length+NL;',
  'var zlive=q(".cn-zoom").filter(live);',
  'o+="zoom visibles "+zlive.length+(zlive.length?" "+zlive.map(function(z){return z.className.replace("cn-zoom ","")+"="+z.offsetWidth+"x"+z.offsetHeight+"::"+z.querySelector(".cn-zoom-card").offsetWidth+"x"+z.querySelector(".cn-zoom-card").offsetHeight;}).join(" "):"")+NL;',
  'function live(el){return el&&el.offsetParent!==null&&el.offsetHeight>0&&getComputedStyle(el).visibility!=="hidden";}',
  '[".slide-head",".cn-subtitle",".cn-body",".cn-flow",".cn-card",".cn-strata",".cn-node",".cn-aporte",".cn-zoom",".cn-modal",".cn-dialog"].forEach(function(cn){',
  'q(cn).filter(live).forEach(function(el,i){var c=el.scrollHeight-el.clientHeight;if(c>0)o+="  clip "+cn+i+" "+c+NL;});});',
  'q(".cn-subtitle,.cn-card-t,.cn-list li,.cn-stat b,.cn-stat em,.cn-mini-k,.cn-list--mini b,.cn-list--mini span,.cn-checks li,.cn-card-k,.cn-node-t,.cn-aporte-k,.cn-aporte-c,.cn-dialog-k,.cn-dialog-p").filter(live).forEach(function(e,i){',
  'if(e.scrollWidth>e.clientWidth+1)o+="  tx "+i+" <"+e.className+"> w"+e.clientWidth+"/"+e.scrollWidth+NL;});',
  'var fr=document.querySelector(".slide-frame").getBoundingClientRect();',
  'q(".slide-head,.cn-body,.cn-flow,.cn-card,.cn-strata,.cn-node,.cn-aporte,.cn-zoom").forEach(function(e,i){var r=e.getBoundingClientRect();if(!r.width)return;var ov=[];',
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
  'var body=document.querySelector(".cn-body");',
  '["zb1","zb2","zb3","zb4","zb5","zb6","b1","b2","b3","b4","b5","b6"].forEach(function(k){',
  'body.className="cn-body cn-body--f"+k;body.setAttribute("data-focus",k);',
  'o+="== FOCO "+k+" =="+NL;',
  'o+=audit();',
  'var mod=q(".cn-modal").filter(live);',
  'o+="paneles visibles "+mod.map(function(m){return m.className.replace("cn-modal ","")+"="+m.offsetWidth+"x"+m.offsetHeight;}).join(" ")+NL;',
  '});',
  'body.className="cn-body";body.removeAttribute("data-focus");',
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

fs.writeFileSync(path.join(OUT, 'cn_shot.html'),
  shell + boot + audit + 'try{' + report + '}catch(e){var ep=document.createElement("pre");ep.id="err";ep.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(ep);}' + '</script></body></html>');

/* Capturas: reposo y los seis estados de foco (b1..b6). */
function shot(focus) {
  const apply = focus
    ? 'setTimeout(function(){var b=document.querySelector(".cn-body");'
      + 'b.className="cn-body cn-body--f' + focus + '";b.setAttribute("data-focus","' + focus + '");'
      + 'document.querySelector(".cn-subtitle").textContent="Clic fuera del panel o tecla ESC para volver a la vista completa";},60);'
    : '';
  return shell + boot + apply + '</script></body></html>';
}
['zb1', 'zb2', 'zb3', 'zb4', 'zb5', 'zb6', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6'].forEach(function (k) {
  fs.writeFileSync(path.join(OUT, 'cn_shot_f' + k + '.html'), shot(k));
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
console.log('capturas: cn_shot.html + fb1/fb2/fb3/fb4/fb5/fb6; assets copiados a out/assets');

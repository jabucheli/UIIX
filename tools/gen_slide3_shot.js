/* Harness de auditoría y captura para la diapositiva 3 (Objetivos - hipótesis):
   columna principal (objetivo general, objetivos específicos y fotos) y lateral
   (hipótesis, alcance y delimitación). Genera:
     out/sl3_shot.html -> captura + informe de geometría (#report se lee con --dump-dom). */
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
const thesis = fs.readFileSync(path.join(ROOT, 'js/data/thesisData.js'), 'utf8');
const data = fs.readFileSync(path.join(ROOT, 'js/data/objectivesData.js'), 'utf8');
const slide = fs.readFileSync(path.join(ROOT, 'js/slides/slide03Objectives.js'), 'utf8');

const boot = [
  'try{var h=window.slideRenderers.objetivos(window.THESIS,null,window.OBJETIVOS);',
  'document.getElementById("frame").innerHTML=h;',
  'document.querySelector(".slide").classList.add("active");',
  'var s=document.querySelector(".slide");',
  '(function(){var i=document.createElement("img");i.className="slide-logo";i.src="assets/logo.png";i.alt="Logotipo";s.appendChild(i);',
  'var f=document.createElement("div");f.className="slide-foot";var fi=document.createElement("img");fi.src="assets/logo-inf.png";fi.alt="";f.appendChild(fi);s.appendChild(f);}());',
  '}catch(e){var pe=document.createElement("pre");pe.id="err";pe.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(pe);}'
].join('');

const audit = [
  'function audit(){',
  'var o="";var NL=String.fromCharCode(10);',
  'var q=function(s){return Array.prototype.slice.call(document.querySelectorAll(s));};',
  'function live(el){return el&&el.offsetParent!==null&&el.offsetHeight>0&&getComputedStyle(el).visibility!=="hidden";}',
  'var body=document.querySelector(".obj-body");',
  'o+="cabecera "+(document.querySelector(".slide-head")?document.querySelector(".slide-head").offsetWidth+"x"+document.querySelector(".slide-head").offsetHeight:"-")+NL;',
  'o+="cuerpo "+(body?body.offsetWidth+"x"+body.offsetHeight:"-")+NL;',
  'var main=document.querySelector(".obj-main");var side=document.querySelector(".obj-side");',
  'o+="principal "+(main?main.offsetWidth+"x"+main.offsetHeight:"-")+" lateral "+(side?side.offsetWidth+"x"+side.offsetHeight:"-")+NL;',
  'o+="general "+(document.querySelector(".og-block")?document.querySelector(".og-block").offsetHeight:"-")+NL;',
  'q(".oe-card").forEach(function(c,i){o+="oe "+i+"="+c.offsetWidth+"x"+c.offsetHeight+NL;});',
  'q(".photo").forEach(function(p,i){o+="foto "+i+"="+p.offsetWidth+"x"+p.offsetHeight+NL;});',
  'o+="hip "+(document.querySelector(".hyp-card")?document.querySelector(".hyp-card").offsetHeight:"-")+" alc "+(document.querySelector(".alc-card")?document.querySelector(".alc-card").offsetHeight:"-")+" delim "+(document.querySelector(".delim-card")?document.querySelector(".delim-card").offsetHeight:"-")+NL;',
  'q(".alc-item").forEach(function(p,i){var cs=getComputedStyle(p);o+="alc "+i+"="+p.offsetWidth+"x"+p.offsetHeight+" bg "+cs.backgroundColor+NL;});',
  '["slide-head",".obj-body",".obj-main",".obj-side",".og-block",".oe-card",".hyp-card",".alc-card",".alc-list",".alc-item",".delim-card",".photo"].forEach(function(cn){',
  'q(cn).filter(live).forEach(function(el,i){var c=el.scrollHeight-el.clientHeight;var w=el.scrollWidth-el.clientWidth;if(c>0||w>0)o+="  clip "+cn+i+" h"+c+" w"+w+NL;});});',
  'q(".og-text,.oe-main,.oe-sub,.hyp-intro,.alc-title,.alc-text,.delim-text,.photo-caption").filter(live).forEach(function(e,i){',
  'if(e.scrollWidth>e.clientWidth+1)o+="  tx "+i+" <"+e.className+"> w"+e.clientWidth+"/"+e.scrollWidth+NL;});',
  'var fr=document.querySelector(".slide-frame").getBoundingClientRect();',
  'q(".slide-head,.obj-body,.obj-main,.obj-side,.og-block,.oe-card,.hyp-card,.alc-card,.delim-card,.photo").forEach(function(e,i){var r=e.getBoundingClientRect();if(!r.width)return;var ov=[];',
  'if(r.left<fr.left-1)ov.push("left");if(r.right>fr.right+1)ov.push("right");if(r.top<fr.top-1)ov.push("top");if(r.bottom>fr.bottom+1)ov.push("bottom");',
  'if(ov.length)o+="  frame OVERFLOW "+i+" <"+e.className+"> "+ov.join(",")+NL;});',
  'o+="logo "+(document.querySelector(".slide-logo")?"presente":"MISSING")+NL;',
  'return o;}'
].join('');

const report = [
  'try{var pre=document.createElement("pre");pre.id="report";pre.textContent=audit();',
  'pre.style.cssText="position:fixed;left:-9999px;top:0;z-index:0;";document.body.appendChild(pre);}',
  'catch(e){var ep=document.createElement("pre");ep.id="err";ep.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(ep);}'
].join('');

const shell = [
  '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=1408">',
  '<style>html,body{margin:0;padding:0;overflow:hidden}.slide-frame{zoom:1 !important;margin:0}',
  '.slide-frame *{transition:none !important;animation:none !important}</style>',
  '<style>' + css + '</style></head><body>',
  '<div class="slide-frame" id="frame"></div>',
  '<script>' + icons + '</script>',
  '<script>' + thesis + '</script>',
  '<script>' + data + '</script>',
  '<script>' + slide + '</script>',
  '<script>'
].join('');

fs.writeFileSync(path.join(OUT, 'sl3_shot.html'),
  shell + boot + audit + '</script><script>' + report + '</script></body></html>');

console.log('captura: sl3_shot.html');

/* Harness de auditoría y captura para la diapositiva 9 (EPT): diagrama
   esquemático ejecutivo según EPTransf.md (lógica de transformación, franja
   central Fundamento · Etapas 1-2-3 · Propósito, resultado esperado y banda
   de recursos clave). Genera:
     out/ept_shot.html -> captura + informe de geometría en reposo
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
const data = fs.readFileSync(path.join(ROOT, 'js/data/transformationData.js'), 'utf8');
const slide = fs.readFileSync(path.join(ROOT, 'js/slides/slide09EPT.js'), 'utf8');

const boot = [
  'try{var h=window.slideRenderers.ept(null,{},{},{},{},null);',
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
  'var body=document.querySelector(".ept-body");',
  'var logica=document.querySelector(".ept-logica");',
  'var central=document.querySelector(".ept-central");',
  'var result=document.querySelector(".ept-result");',
  'var rc=document.querySelector(".ept-rc");',
  'var sides=q(".ept-side");',
  'var cards=q(".ept-e");',
  '/* textos clave para el informe */',
  'o+="titulo "+document.querySelector(".slide-head h2").textContent+NL;',
  'o+="subtitulo "+document.querySelector(".ept-subtitle").textContent+NL;',
  'var sub=document.querySelector(".ept-subtitle");',
  'var lh=parseFloat(getComputedStyle(sub).lineHeight)||14;',
  'o+="subtitulo lineas "+Math.round(sub.offsetHeight/lh)+NL;',
  'o+="cabecera "+(head?head.offsetWidth+"x"+head.offsetHeight:"MISSING")+NL;',
  'o+="cuerpo "+(body?body.offsetWidth+"x"+body.offsetHeight:"MISSING")+NL;',
  'o+="bandas logica "+(logica?logica.offsetWidth+"x"+logica.offsetHeight:"-")',
  '+ " central "+(central?central.offsetWidth+"x"+central.offsetHeight:"-")',
  '+ " resultado "+(result?result.offsetWidth+"x"+result.offsetHeight:"-")',
  '+ " recursos "+(rc?rc.offsetWidth+"x"+rc.offsetHeight:"-")+NL;',
  'o+="nodos logica "+q(".ept-logica .ept-nodo").length+"; ";' +
  'o+="resultado "+q(".ept-rs .ept-nodo").length+NL;',
  'o+="lados "+sides.map(function(s){return s.className.replace("ept-side ept-side--","")+"="+(s.querySelector(".ept-side-k")||{}).textContent.replace("ept-side ept-side--","");}).join(" | ")+NL;',
  'o+="etapas "+cards.map(function(c){return c.querySelector(".ept-e-head").textContent+" ";}).join(" | ")+NL;',
  'o+="componentes "+cards.map(function(c){return c.querySelector(".ept-e-nombre").textContent.replace(/\\s+/g," ");}).join(" | ")+NL;',
  'o+="items "+cards.map(function(c){return c.querySelectorAll(".ept-e-item").length;}).join(",")+NL;',
  'o+="capsulas "+cards.map(function(c){return (c.querySelector(".ept-e-cap")||{}).textContent||"-";}).join(",")+NL;',
  'o+="pillows "+cards.map(function(c){return c.querySelectorAll(".ept-pill").length;}).join(",")+NL;',
  'o+="salidas "+cards.map(function(c){return (c.querySelector(".ept-e-out")||{}).textContent;}).join(" | ")+NL;',
  'o+="rc items "+rc.querySelectorAll(".ept-rc-it").length+" "+rc.querySelectorAll(".ept-rc-it")[0].textContent+" ... "+rc.querySelectorAll(".ept-rc-it")[6].textContent+NL;',
  'o+="logica nodos "+q(".ept-logica .ept-nodo-t").map(function(n){return n.textContent;}).join(" → ")+NL;',
  'o+="resultado nodos "+q(".ept-rs .ept-nodo-t").map(function(n){return n.textContent;}).join(" → ")+NL;',
  'function live(el){return el&&el.offsetParent!==null&&el.offsetHeight>0&&getComputedStyle(el).visibility!=="hidden";}',
  '[".slide-head",".ept-subtitle",".ept-body",".ept-logica",".ept-central",".ept-side",".ept-e",".ept-e-rec",".ept-e-out",".ept-result",".ept-rs",".ept-rc",".ept-rc-items"].forEach(function(cn){',
  'q(cn).filter(live).forEach(function(el,i){var c=el.scrollHeight-el.clientHeight;if(c>0)o+="  clip "+cn+i+" "+c+NL;});});',
  'q(".ept-subtitle,.ept-nodo-t,.ept-side-t,.ept-e-nombre,.ept-e-item,.ept-pill,.ept-e-cap,.ept-e-out,.ept-rc-it").filter(live).forEach(function(e,i){',
  'if(e.scrollWidth>e.clientWidth+1)o+="  tx "+i+" <"+e.className+"> w"+e.clientWidth+"/"+e.scrollWidth+NL;});',
  'var fr=document.querySelector(".slide-frame").getBoundingClientRect();',
  'q(".slide-head,.ept-body,.ept-logica,.ept-central,.ept-side,.ept-e,.ept-result,.ept-rc,.ept-arrow").forEach(function(e,i){var r=e.getBoundingClientRect();if(!r.width)return;var ov=[];',
  'if(r.left<fr.left-1)ov.push("left");if(r.right>fr.right+1)ov.push("right");if(r.top<fr.top-1)ov.push("top");if(r.bottom>fr.bottom+1)ov.push("bottom");',
  'if(ov.length)o+="  frame OVERFLOW "+i+" <"+e.className+"> "+ov.join(",")+NL;});',
  'o+="tarjetas "+cards.map(function(c){return c.offsetWidth+"x"+c.offsetHeight;}).join(" ")+NL;',
  'o+="anchos iguales "+JSON.stringify(cards.map(function(c){return c.offsetWidth;}).filter(function(w,i,arr){return w===arr[0];}).length)+"/"+cards.length+NL;',
  'o+="flechas central "+q(".ept-central .ept-arrow").length+", logicas "+q(".ept-logica .ept-arrow").length+", resultado "+q(".ept-rs .ept-arrow").length+NL;',
  'o+="logo "+(document.querySelector(".slide-logo")?"presente":"MISSING")+NL;',
  'o+="pie "+(q(".slide-foot").length?(q(".slide-foot")[0].offsetHeight>0?q(".slide-foot")[0].offsetHeight+" px visible":"presente (oculto sin pantalla completa)"):"MISSING")+NL;',
  'return o;}'
].join('');

const report = [
  'var NL=String.fromCharCode(10);var o="";',
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

fs.writeFileSync(path.join(OUT, 'ept_shot.html'),
  shell + boot + audit + 'try{' + report + '}catch(e){var ep=document.createElement("pre");ep.id="err";ep.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(ep);}' + '</script></body></html>');
console.log('ok ept_shot.html');
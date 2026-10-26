/* Harness de auditoría y captura para la diapositiva 4 (Marco teórico):
   Marco histórico, Aplicación, Marco Legal, Marco contextual y Teorías base.
   Genera:
     out/sl4_report.html     -> informe de los seis estados
     out/sl4_shot.html       -> captura en reposo (solo años / palabras clave)
     out/sl4_shot_hist.html  -> «Marco histórico» centrado y el fondo atenuado
     out/sl4_shot_apl.html   -> «Aplicación» centrada y el fondo atenuado
     out/sl4_shot_legal.html -> «Marco Legal y Normativo» ampliado con su jerarquía
     out/sl4_shot_teo.html   -> Teorías base y diagrama legal a la derecha */
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
const data = fs.readFileSync(path.join(ROOT, 'js/data/theoriesData.js'), 'utf8');
const slide = fs.readFileSync(path.join(ROOT, 'js/slides/slide04Theories.js'), 'utf8');

const boot = [
  'try{var h=window.slideRenderers.teorias(window.THESIS,null,null,window.TEORIAS);',
  'document.getElementById("frame").innerHTML=h;',
  'document.querySelector(".slide").classList.add("active");',
  'var s=document.querySelector(".slide");',
  'var i=document.createElement("img");i.className="slide-logo";i.src="assets/logo.png";i.alt="Logotipo";s.appendChild(i);',
  'var f=document.createElement("div");f.className="slide-foot";var fi=document.createElement("img");fi.src="assets/logo-inf.png";fi.alt="";f.appendChild(fi);s.appendChild(f);',
  '}catch(e){var pe=document.createElement("pre");pe.id="err";pe.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(pe);}'
].join('');

/* Reproduce lo que hace app.js al abrir el foco: la clase en el cuerpo, el
   data-focus y la sombra atenuada de la lámina original detrás. */
const abrirFoco = [
  'function cerrarFoco(){',
  'var b=document.querySelector(".th-body");',
  'b.className="th-body";b.removeAttribute("data-focus");',
  'var old=document.querySelector(".scope-ghost");if(old)old.parentNode.removeChild(old);}',
  'function abrirFoco(boxSel,key){',
  'cerrarFoco();',
  'var b=document.querySelector(".th-body");',
  'b.className="th-body th-body--f"+key;b.setAttribute("data-focus",key);',
  'b.querySelector(boxSel).setAttribute("data-focus",key);',
  'var g=document.createElement("div");g.className="scope-ghost is-on";',
  'var inner=document.createElement("div");inner.className="scope-ghost-inner";',
  'inner.style.padding="0 18px 4px";inner.style.gap="0px";',
  'Array.prototype.slice.call(document.querySelectorAll(".th-intro,.th-grid")).forEach(function(n){',
  'var c=n.cloneNode(true);c.removeAttribute("id");',
  'Array.prototype.slice.call(c.querySelectorAll("[id]")).forEach(function(x){x.removeAttribute("id");});',
  'Array.prototype.slice.call(c.querySelectorAll("[tabindex]")).forEach(function(x){x.removeAttribute("tabindex");});',
  'inner.appendChild(c);});',
  'g.appendChild(inner);',
  'g.style.left=b.offsetLeft+"px";g.style.top=b.offsetTop+"px";',
  'g.style.width=b.offsetWidth+"px";g.style.height=b.offsetHeight+"px";',
  'document.querySelector(".slide").appendChild(g);}',
  'function abrirHist(){abrirFoco(".th-box--hist","hist");}',
  'function abrirApl(){abrirFoco(".th-box--apl","apl");}',
  'function abrirLeg(){abrirFoco(".th-legal","leg");}',
  'function abrirCtx(){abrirFoco(".th-box--ctx","ctx");}',
  'function abrirTeo(){abrirFoco(".th-panel","teo");}'
].join('');

const audit = [
  'function live(el){return el&&el.offsetParent!==null&&el.offsetHeight>0&&getComputedStyle(el).visibility!=="hidden";}',
  'function q(s,root){return Array.prototype.slice.call((root||document).querySelectorAll(s)).filter(function(e){return !e.closest(".scope-ghost");});}',
  'function d(el,p){if(!el)return "-";return getComputedStyle(el)[p]||"-";}',
  'function audit(tag){',
  'var NL=String.fromCharCode(10);var o="";',
  'var head=document.querySelector(".slide-head");',
  'var body=document.querySelector(".th-body");',
  'var intro=document.querySelector(".th-intro");',
  'var grid=document.querySelector(".th-grid");',
  'var key=body.getAttribute("data-focus");',
  'var fsel=key==="leg"?".th-legal":(key==="teo"?".th-panel":".th-box--"+key);',
  'var hist=key?document.querySelector(fsel):document.querySelector(".th-box--hist");',
  'o+=tag+" cabecera "+(head?head.offsetWidth+"x"+head.offsetHeight:"-")+NL;',
  'o+=tag+" cuerpo "+(body?body.offsetWidth+"x"+body.offsetHeight:"-")+NL;',
  'o+=tag+" intro "+(intro?intro.offsetWidth+"x"+intro.offsetHeight:"-")+" vis "+d(intro,"visibility")+NL;',
  'o+=tag+" grid "+(grid?grid.offsetWidth+"x"+grid.offsetHeight:"-")+" vis "+d(grid,"visibility")+NL;',
  'o+=tag+" izq "+(document.querySelector(".th-left")?document.querySelector(".th-left").offsetHeight:"-")+" der "+(document.querySelector(".th-right")?document.querySelector(".th-right").offsetHeight:"-")+NL;',
  'o+=tag+" panel "+(document.querySelector(".th-panel")?document.querySelector(".th-panel").offsetHeight:"-")+" teorias "+(document.querySelector(".th-theories")?document.querySelector(".th-theories").offsetHeight:"-")+" flow "+(document.querySelector(".th-flow")?document.querySelector(".th-flow").offsetHeight:"-")+NL;',
  'o+=tag+" legal "+(document.querySelector(".th-legal")?document.querySelector(".th-legal").offsetHeight:"-")+" fig "+(document.querySelector(".th-legal-fig")?document.querySelector(".th-legal-fig").offsetHeight:"-")+" filas "+q(".th-lh-row").length+" vis "+q(".th-lh-row").map(function(r){return live(r)?"1":"0";}).join("")+NL;',
   'o+=tag+" lh-tonos "+q(".th-lh-row").map(function(r){return /th-lh--r/.test(r.className)?"r":"g";}).join("")+" anchos "+q(".th-lh-row").map(function(r){return r.offsetWidth;}).join(",")+NL;',
   'if(key==="teo"){var t=document.querySelector(".th-panel").getBoundingClientRect(),l=document.querySelector(".th-legal").getBoundingClientRect(),fg=document.querySelector(".th-legal-fig").getBoundingClientRect();o+="TEO legal real "+l.width.toFixed(2)+"x"+l.height.toFixed(2)+" diagrama "+fg.width.toFixed(2)+"x"+fg.height.toFixed(2)+" separacion "+(l.left-t.right).toFixed(2)+NL;if(l.left<t.right)o+="  panel OVERLAP"+NL;}',
  'q(".th-box").forEach(function(b,i){o+=tag+" box"+i+" "+b.offsetWidth+"x"+b.offsetHeight+" vis "+d(b,"visibility")+" data-focus "+(b.getAttribute("data-focus")||"-")+NL;});',
  'o+=tag+" texto intro "+d(q(".th-box--hist p")[0],"display")+" ref "+d(q(".th-box--hist .th-ref")[0],"display")+NL;',
  'o+=tag+" años "+q(".th-box--hist .th-milestone b").map(function(b){return b.textContent;}).join(" | ")+NL;',
  'o+=tag+" detalle "+q(".th-box--hist .th-milestone span").map(function(s){return d(s,"display");}).join(",")+" vis "+q(".th-box--hist .th-milestone span").map(function(s){return live(s)?"1":"0";}).join("")+NL;',
  'o+=tag+" apl-kw "+q(".th-box--apl .th-bflow-item b").map(function(b){return b.textContent.slice(0,14);}).join(" | ")+NL;',
  'o+=tag+" apl-det "+q(".th-box--apl .th-bflow-item span").map(function(s){return d(s,"display");}).join(",")+" vis "+q(".th-box--apl .th-bflow-item span").map(function(s){return live(s)?"1":"0";}).join("")+NL;',
  'o+=tag+" ctx tarjetas "+q(".th-ccard").length+" tonos "+q(".th-ccard").map(function(c){return /th-ccard--r/.test(c.className)?"r":"g";}).join("")+" sub "+(document.querySelector(".th-ctx-sub")?document.querySelector(".th-ctx-sub").textContent:"-")+" lineas "+q(".th-ccard-b span").length+" anchos "+q(".th-ccard").map(function(c){return c.offsetWidth;}).join(",")+NL;',
  'o+=tag+" ctx-rad hub "+d(document.querySelector(".th-ctxrad-hub"),"display")+" ring "+d(document.querySelector(".th-ctxrad-ring"),"display")+" lk "+q(".th-ctxrad-lk").map(function(l){return d(l,"display");}).join("")+" lineas-vis "+q(".th-ccard-b span").map(function(s){return live(s)?"1":"0";}).join("")+" centro "+(document.querySelector(".th-ctxrad-hub")?(function(){var h=document.querySelector(".th-ctxrad-hub").getBoundingClientRect();var b=document.querySelector(".th-box--ctx").getBoundingClientRect();return Math.round((h.left+h.right)/2-b.left)+","+Math.round((h.top+h.bottom)/2-b.top);})():"-")+" caja "+(document.querySelector(".th-box--ctx")?document.querySelector(".th-box--ctx").offsetWidth+"x"+document.querySelector(".th-box--ctx").offsetHeight:"-")+NL;',
  'o+=tag+" ctx-overlap "+(function(){var cs=q(".th-box--ctx .th-ccard");var out=[];for(var i=0;i<cs.length;i++){var a=cs[i].getBoundingClientRect();for(var j=i+1;j<cs.length;j++){var b=cs[j].getBoundingClientRect();var ox=Math.min(a.right,b.right)-Math.max(a.left,b.left);var oy=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);if(ox>0&&oy>0)out.push((i+1)+"x"+(j+1)+":"+Math.round(ox)+"x"+Math.round(oy));}}var hbEl=q(".th-box--ctx .th-ctxrad-hub")[0];if(hbEl&&getComputedStyle(hbEl).display!=="none"){var hb=hbEl.getBoundingClientRect();cs.forEach(function(c,i){var r=c.getBoundingClientRect();var ox=Math.min(hb.right,r.right)-Math.max(hb.left,r.left);var oy=Math.min(hb.bottom,r.bottom)-Math.max(hb.top,r.top);if(ox>0&&oy>0)out.push("hubx"+(i+1)+":"+Math.round(ox)+"x"+Math.round(oy));});}var cv=q(".th-box--ctx .th-ctx")[0];if(cv){var cb=cv.getBoundingClientRect();cs.forEach(function(c,i){var r=c.getBoundingClientRect();if(r.left<cb.left-0.5||r.right>cb.right+0.5||r.top<cb.top-0.5||r.bottom>cb.bottom+0.5)out.push("fuera"+(i+1));});}return out.length?out.join(" "):"0";})()+NL;',
  'if(hist){',
  'var br=body.getBoundingClientRect(),hr=hist.getBoundingClientRect();',
  'var cx=(hr.left+hr.right)/2-br.left, cy=(hr.top+hr.bottom)/2-br.top;',
  'o+=tag+" ampliado caja "+Math.round(hr.width)+"x"+Math.round(hr.height)+" centro "+Math.round(cx)+","+Math.round(cy)+" (cuerpo "+Math.round(br.width/2)+","+Math.round(br.height/2)+")"+NL;',
  '}',
  'o+=tag+" ghost "+(document.querySelector(".scope-ghost.is-on")?"presente":"-")+" foco "+(body.getAttribute("data-focus")||"-")+" clase "+body.className+NL;',
   '[".slide-head",".th-body",".th-intro",".th-grid",".th-left",".th-right",".th-box",".th-timeline",".th-milestone",".th-steps",".th-bflow",".th-nflow",".th-ctx",".th-ccard",".th-ctxrad-hub",".th-ctxrad-ring",".th-panel",".th-theories",".th-flow",".th-flow-row",".th-fnode",".th-legal",".th-legal-fig",".th-lh-row",".th-lh-name",".th-lh-det"].forEach(function(cn){',
   // La flecha exterior del panel teo no es contenido recortado; se auditan sus bloques internos.
   'q(cn).filter(live).forEach(function(el,i){var c=el.scrollHeight-el.clientHeight;var w=el.scrollWidth-el.clientWidth;if(key==="teo"&&cn===".th-panel")w=0;if(c>0||w>0)o+="  clip "+cn+"["+i+"] h"+c+" w"+w+NL;});});',
  'q(".th-box h3,.th-box p,.th-ref,.th-milestone b,.th-milestone span,.th-step b,.th-step span,.th-bflow-item b,.th-bflow-item span,.th-ncell,.th-ctx-sub,.th-ccard-n,.th-ccard-b b,.th-ccard-b span,.th-lvl1 strong,.th-key,.th-lvl2 p,.th-legal h4,.th-legal>p,.th-lh-cap,.th-lh-name,.th-lh-det").filter(live).forEach(function(e,i){',
  'if(e.scrollWidth>e.clientWidth+1)o+="  tx "+i+" <"+e.className+"> w"+e.clientWidth+"/"+e.scrollWidth+NL;});',
  'var fr=document.querySelector(".slide-frame").getBoundingClientRect();',
   'q(".slide-head,.th-body,.th-intro,.th-grid,.th-box,.th-panel,.th-theories,.th-flow,.th-fnode,.th-legal,.th-legal-fig,.th-lh-row,.th-ctx,.th-ccard,.th-ctxrad-hub,.th-ctxrad-ring").forEach(function(e,i){var r=e.getBoundingClientRect();if(!r.width)return;var ov=[];',
  'if(r.left<fr.left-1)ov.push("left");if(r.right>fr.right+1)ov.push("right");if(r.top<fr.top-1)ov.push("top");if(r.bottom>fr.bottom+1)ov.push("bottom");',
  'if(ov.length)o+="  frame OVERFLOW "+i+" <"+e.className+"> "+ov.join(",")+NL;});',
  'o+=tag+" logo "+(document.querySelector(".slide-logo")?"presente":"MISSING")+NL;',
  'return o;}'
].join('');

const report = [
  'var NL=String.fromCharCode(10);var o="";',
  'o+="h2 "+document.querySelector("h2").textContent+NL;',
  'o+=audit("REPOSO")+NL;',
  'abrirHist();',
  'o+=audit("HIST")+NL;',
  'cerrarFoco();',
  'abrirApl();',
  'o+=audit("APL")+NL;',
  'cerrarFoco();',
  'abrirLeg();',
  'o+=audit("LEGAL")+NL;',
  'cerrarFoco();',
  'abrirCtx();',
  'o+=audit("CTX")+NL;',
  'cerrarFoco();',
  'abrirTeo();',
  'o+=audit("TEO");',
  'var pre=document.createElement("pre");pre.id="report";pre.textContent=o;document.body.appendChild(pre);'
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

function wrap(bodyJs) {
  return shell + boot + audit + abrirFoco + 'try{' + bodyJs +
    '}catch(e){var ep=document.createElement("pre");ep.id="err";ep.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(ep);}' +
    '</script></body></html>';
}

fs.writeFileSync(path.join(OUT, 'sl4_report.html'), wrap(report));
console.log('ok sl4_report.html');

fs.writeFileSync(path.join(OUT, 'sl4_shot.html'), shell + boot + '</script></body></html>');
console.log('ok sl4_shot.html');

fs.writeFileSync(path.join(OUT, 'sl4_shot_hist.html'),
  shell + boot + audit + abrirFoco + 'setTimeout(function(){abrirHist();},60);</script></body></html>');
console.log('ok sl4_shot_hist.html');

fs.writeFileSync(path.join(OUT, 'sl4_shot_apl.html'),
  shell + boot + audit + abrirFoco + 'setTimeout(function(){abrirApl();},60);</script></body></html>');
console.log('ok sl4_shot_apl.html');

fs.writeFileSync(path.join(OUT, 'sl4_shot_legal.html'),
  shell + boot + audit + abrirFoco + 'setTimeout(function(){abrirLeg();},60);</script></body></html>');
console.log('ok sl4_shot_legal.html');

fs.writeFileSync(path.join(OUT, 'sl4_shot_ctx.html'),
  shell + boot + audit + abrirFoco + 'setTimeout(function(){abrirCtx();},60);</script></body></html>');
console.log('ok sl4_shot_ctx.html');

fs.writeFileSync(path.join(OUT, 'sl4_shot_teo.html'),
  shell + boot + audit + abrirFoco + 'setTimeout(function(){abrirTeo();},60);</script></body></html>');
console.log('ok sl4_shot_teo.html');

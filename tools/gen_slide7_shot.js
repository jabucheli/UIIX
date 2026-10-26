/* Harness de auditoría y captura para la diapositiva 7 (Resultados 2):
   flujograma de la Fase 3 (NTP 330) + recuadros de fotografía. Los bloques
   NE, NP, NC, NR y NI abren el cuadro de ER.docx que les corresponde, y la
   Fotografía 1 aloja la aplicación web de evaluación integrada (ntp330/0).
   Genera:
     out/res2_heights.html  -> informe del estado en reposo
     out/res2_focos.html    -> informe de los 6 estados de foco (NE, NP, NC, NR, NI, F1)
     out/res2_shot.html     -> captura en reposo
     out/res2_shot_f*.html  -> una captura por cuadro abierto                     */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'presentacion-web');
const OUT = path.join(__dirname, 'out');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const LGOUT = path.join(OUT, 'assets');
if (!fs.existsSync(LGOUT)) fs.mkdirSync(LGOUT, { recursive: true });
fs.copyFileSync(path.join(ROOT, 'assets', 'logo.png'), path.join(LGOUT, 'logo.png'));
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const css = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
const icons = fs.readFileSync(path.join(ROOT, 'js/icons.js'), 'utf8');
const data = fs.readFileSync(path.join(ROOT, 'js/data/resultsData2.js'), 'utf8');
const tablas = fs.readFileSync(path.join(ROOT, 'js/data/erTables.js'), 'utf8');
const slide = fs.readFileSync(path.join(ROOT, 'js/slides/slide07Results.js'), 'utf8');

const CLAVES = ['ne', 'np', 'nc', 'nr', 'ni'];
/* La Fotografía 1 no es un cuadro de ER.docx: se audita aparte porque monta la
   app web en un <iframe>. */
const FOTOS = ['f1'];

/* La app se carga con una ruta relativa al documento de la presentación. Este
   harness vive en tools/out/, dos niveles más abajo, así que hay que resolver
   la ruta a absoluta o el <iframe> daría 404. */
const datos = { RESULTADOS2: null };
new Function('window', data)(datos);
const APP_SRC = path.resolve(ROOT, datos.RESULTADOS2.fotos[0].app.src).replace(/\\/g, '/');
if (!fs.existsSync(APP_SRC)) {
  throw new Error('no está la aplicación que debe abrir Fotografía 1: ' + APP_SRC);
}

const boot = [
  'try{var h=window.slideRenderers.resultados2(null,{},{},{},{},null);',
  'document.getElementById("frame").innerHTML=h;',
  'document.querySelector(".slide").classList.add("active");',
  'document.querySelector(".slide").appendChild(function(){var i=document.createElement("img");i.className="slide-logo";i.src="assets/logo.png";i.alt="Logotipo";return i;}());',
  '}catch(e){var pe=document.createElement("pre");pe.id="err";pe.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(pe);}'
].join('');

/* Reproduce lo que hace app.js al abrir un foco: la clase en el cuerpo, el
   data-focus y el ghost atenuado detras. Para la Fotografía 1 monta ademas el
   <iframe> de la app, como hace slide07Results.js al recibir `slide:focus`. */
const abrirFoco = [
  'function montarApp(){',
  'var slot=document.querySelector(".slide [data-frame=f1]");',
  'if(!slot||slot.firstChild)return;',
  'var fr=document.createElement("iframe");fr.className="rs-ft-app";',
  'fr.src="' + APP_SRC + '";fr.title="Evaluacion de riesgos laborales";',
  'slot.appendChild(fr);}',
  'function abrirFoco(k){',
  'var b=document.querySelector(".rs2-body");',
  'b.className="rs2-body rs2-body--f"+k;b.setAttribute("data-focus",k);',
  'var slot=document.querySelector(".slide [data-frame]");if(slot)slot.textContent="";',
  'if(k==="f1")montarApp();',
  'var g=document.createElement("div");g.className="scope-ghost is-on";',
  'var inner=document.createElement("div");inner.className="scope-ghost-inner";',
  'inner.style.padding="4px 20px 12px";inner.style.gap="8px";',
  'var copy=document.querySelector(".rs2-cols").cloneNode(true);',
  'copy.removeAttribute("id");',
  'Array.prototype.forEach.call(copy.querySelectorAll("[id]"),function(x){x.removeAttribute("id");});',
  'Array.prototype.forEach.call(copy.querySelectorAll("[tabindex]"),function(x){x.removeAttribute("tabindex");});',
  'inner.appendChild(copy);g.appendChild(inner);',
  'g.style.left=b.offsetLeft+"px";g.style.top=b.offsetTop+"px";',
  'g.style.width=b.offsetWidth+"px";g.style.height=b.offsetHeight+"px";',
  'document.querySelector(".slide").appendChild(g);',
  '}'
].join('');

const audit = [
  'function audit(){',
  'var o="";',
  'var NL=String.fromCharCode(10);',
  'var q=function(s,root){return Array.prototype.slice.call((root||document).querySelectorAll(s)).filter(function(e){return !e.closest(".scope-ghost");});};',
  'var body=document.querySelector(".rs2-body");',
  'var head=document.querySelector(".slide-head");',
  'var flow=document.querySelector(".rs2-flow");',
  'var fotos=document.querySelector(".rs2-fotos");',
  'var sc=q(".rs2-screens")[0];',
  'var tbl=q(".rs2-tbl").filter(function(e){return e.offsetParent!==null;})[0];',
  'o+="lamina "+(head?head.offsetWidth+"x"+head.offsetHeight:"MISSING")+NL;',
  'o+="cuerpo "+(body?body.offsetWidth+"x"+body.offsetHeight:"MISSING")+NL;',
  'o+="banda flujo "+(flow?flow.offsetWidth+"x"+flow.offsetHeight:"MISSING")+NL;',
  'o+="banda fotos "+(fotos?fotos.offsetWidth+"x"+fotos.offsetHeight:"MISSING")+NL;',
  'o+="pantalla "+(sc?sc.offsetWidth+"x"+sc.offsetHeight:"MISSING")+NL;',
  'function live(el){return el&&el.offsetParent!==null&&el.offsetHeight>0&&getComputedStyle(el).visibility!=="hidden";}',
  '[".slide-head",".rs2-body",".rs2-cols",".rs2-flow",".rs2-chain",".rs2-fotos",".rs2-foto",".rs2-screens",".rs2-tbl",".rs2-tb-wrap"].forEach(function(cn){',
  'q(cn,document).filter(live).forEach(function(el,i){var c=el.scrollHeight-el.clientHeight;if(c>0)o+="  clip "+cn+i+" "+c+NL;});});',
  'q(".rs-fn-c,.rs-fn-t,.rs-fn-s,.rs-fn-r,.rs-ft-t,.rs-ft-n,.rs2-tb-code,.rs2-tb-t,.rs2-tb-src,.rs2-tb thead th,.rs2-tb tbody th,.rs2-tb td,.rs2-tb-nr b,.rs2-tb-nr span,.rs2-tb-f em,.rs2-tb-f span",document).filter(live).forEach(function(e,i){',
  'if(e.scrollWidth>e.clientWidth+1)o+="  tx "+i+" <"+e.className+"> w"+e.clientWidth+"/"+e.scrollWidth+NL;});',
  'var fr=document.querySelector(".slide-frame").getBoundingClientRect();',
  'q(".slide-head,.rs2-body,.rs2-cols,.rs2-flow,.rs2-chain,.rs2-fotos,.rs2-foto,.rs2-screens,.rs2-tbl",document).forEach(function(e,i){var r=e.getBoundingClientRect();if(!r.width)return;var ov=[];',
  'if(r.left<fr.left-1)ov.push("left");if(r.right>fr.right+1)ov.push("right");if(r.top<fr.top-1)ov.push("top");if(r.bottom>fr.bottom+1)ov.push("bottom");',
  'if(ov.length)o+="  frame OVERFLOW "+i+" <"+e.className+"> "+ov.join(",")+NL;});',
  'o+="nodos "+q(".rs2-fn").map(function(n){var c=n.querySelector(".rs-fn-c").textContent;return c+":"+n.offsetWidth+"x"+n.offsetHeight;}).join(" ")+NL;',
  'o+="conectores "+q(".rs2-chain > .rs2-fx").length+" (merge "+q(".rs2-fx--merge").length+")"+NL;',
  'o+="fotos "+q(".rs2-foto").map(function(f){return f.getAttribute("data-foto")+":"+f.offsetWidth+"x"+f.offsetHeight;}).join(" ")+NL;',
  'var fr1=q(".rs2-foto--app iframe")[0];',
  'o+="app "+(fr1?fr1.offsetWidth+"x"+fr1.offsetHeight+" src="+fr1.getAttribute("src"):"sin iframe")+NL;',
  'o+="app-rect "+(function(){var s=q(".rs-ft-frame")[0];if(!s)return "-";var b=s.getBoundingClientRect();return [Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height)].join(" ");})()+NL;',
  'o+="pulsables "+q(".rs2-fn[data-focus]").map(function(n){return n.getAttribute("data-focus");}).join(",")+NL;',
  'o+="cuadros "+(tbl?tbl.getAttribute("data-tbl")+" "+tbl.offsetWidth+"x"+tbl.offsetHeight:"-")+NL;',
  'if(tbl){',
  'o+="  filas "+q(".rs2-tb tbody tr",tbl).length+" x "+q(".rs2-tb thead th",tbl).length+" col"+NL;',
  'o+="  chips "+q(".rs2-tb-nr b",tbl).map(function(b){return b.textContent;}).join(",")+NL;',
  'o+="  clases "+q(".rs2-tb tbody tr",tbl).map(function(tr){return tr.className.replace("rs2-tb-r ","");}).join(",")+NL;'+
  'o+="  chips-luz "+q(".rs2-tb-nr b",tbl).map(function(b){return b.textContent+":"+(b.className.indexOf("--red")>-1?"red":"green");}).join(",")+NL;',
  '}',
  'o+="ghost "+(document.querySelector(".scope-ghost")?"presente":"-")+NL;',
  'o+="foco "+(body&&body.getAttribute("data-focus")||"-")+NL;',
  'return o;}'
].join('');

const report = [
  'var NL=String.fromCharCode(10);var o="";',
  'o+="h2 "+document.querySelector("h2").textContent+NL;',
  'o+="== LAMINA =="+NL;',
  'o+=audit();',
  'var pre=document.createElement("pre");pre.id="report";pre.textContent=o;document.body.appendChild(pre);'
].join('');

const reportFocos = [
  'var NL=String.fromCharCode(10);var o="";',
  CLAVES.concat(FOTOS).map(function (k) {
    return 'try{var g=document.querySelector(".scope-ghost");if(g)g.parentNode.removeChild(g);' +
      'abrirFoco("' + k + '");' +
      'o+="== FOCO ' + k.toUpperCase() + ' =="+NL;o+=audit();o+=NL;}' +
      'catch(e){o+="== FOCO ' + k.toUpperCase() + ' == ERROR "+e+NL;}';
  }).join(''),
  'var pre=document.createElement("pre");pre.id="report";pre.textContent=o;document.body.appendChild(pre);'
].join('');

const shell = [
  '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=1408">',
  '<style>html,body{margin:0;padding:0;overflow:hidden}.slide-frame{zoom:1 !important;margin:0}',
  '.slide-frame *{transition:none !important;animation:none !important}</style>',
  '<style>' + css + '</style></head><body>',
  '<div class="slide-frame" id="frame"></div>',
  '<script>' + icons + '</script>',
  '<script>' + data + '</script>',
  '<script>' + tablas + '</script>',
  '<script>' + slide + '</script>',
  '<script>'
].join('');

const html = shell + boot + audit + abrirFoco
  + 'try{' + report + '}catch(e){var ep=document.createElement("pre");ep.id="err";ep.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(ep);}'
  + '</script></body></html>';

fs.writeFileSync(path.join(OUT, 'res2_heights.html'), html);
console.log('ok res2_heights.html');

fs.writeFileSync(path.join(OUT, 'res2_focos.html'), shell + boot + audit + abrirFoco
  + 'try{' + reportFocos + '}catch(e){var ep=document.createElement("pre");ep.id="err";ep.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(ep);}'
  + '</script></body></html>');
console.log('ok res2_focos.html');

function shot(focus) {
  const apply = focus
    ? 'setTimeout(function(){' + 'abrirFoco("' + focus + '");},60);'
    : '';
  return shell + boot + audit + abrirFoco + apply + '</script></body></html>';
}

fs.writeFileSync(path.join(OUT, 'res2_shot.html'), shot(''));
console.log('ok res2_shot.html');
const CAPTURAS = CLAVES.concat(FOTOS);
CAPTURAS.forEach(function (k) {
  fs.writeFileSync(path.join(OUT, 'res2_shot_f' + k + '.html'), shot(k));
});
console.log('capturas: res2_shot_f' + CAPTURAS.join('.html, res2_shot_f') + '.html');

/* Harness de auditoría y captura para la diapositiva 8 (Resultados 3):
   secuencia de los seis resultados de la prueba piloto en el proyecto de
   infraestructura (matriz ND x NE, deficiencia global y por proceso,
   presencia y distribución de riesgos, ART). Cada paso abre en la banda
   inferior la imagen del resultado.
   Genera:
     out/res3_heights.html  -> informe del estado en reposo
     out/res3_focos.html    -> informe de los 6 estados de foco (p1 a p6)
     out/res3_shot.html     -> captura en reposo
     out/res3_shot_fp*.html -> una captura por resultado abierto              */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'presentacion-web');
const OUT = path.join(__dirname, 'out');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const css = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
const icons = fs.readFileSync(path.join(ROOT, 'js/icons.js'), 'utf8');
const data = fs.readFileSync(path.join(ROOT, 'js/data/resultsData3.js'), 'utf8');
const slide = fs.readFileSync(path.join(ROOT, 'js/slides/slide08Results.js'), 'utf8');

const CLAVES = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

/* Las imágenes de los resultados viven en assets/; el harness está en
   tools/out/, dos niveles más abajo, así que hay que copiar los ficheros o
   resolver las rutas a absolutas. Se copian (como hace gen_results_heights.js
   con el resto de assets) para que la captura muestre los gráficos. */
const ASSET_OUT = path.join(OUT, 'assets');
if (!fs.existsSync(ASSET_OUT)) fs.mkdirSync(ASSET_OUT, { recursive: true });
try {
  fs.copyFileSync(path.join(ROOT, 'assets', 'logo.png'), path.join(ASSET_OUT, 'logo.png'));
} catch (e) {}

const datos = { RESULTADOS3: null };
new Function('window', data)(datos);
const PASOS = datos.RESULTADOS3.pasos || [];
if (PASOS.length !== CLAVES.length) {
  throw new Error('se esperaban ' + CLAVES.length + ' pasos y hay ' + PASOS.length);
}
PASOS.forEach(function (p) {
  const src = path.resolve(ROOT, p.imagen);
  if (!fs.existsSync(src)) throw new Error('falta la imagen del paso ' + p.key + ': ' + p.imagen);
  fs.copyFileSync(src, path.join(ASSET_OUT, path.basename(p.imagen)));
});

/* las fotografías de la galería viven en assets/fotos/; se copian también
   para que la captura muestre las miniaturas y el visor ampliado */
const FOTO_OUT = path.join(ASSET_OUT, 'fotos');
fs.mkdirSync(FOTO_OUT, { recursive: true });
(datos.RESULTADOS3.fotos || []).forEach(function (f) {
  const src = path.resolve(ROOT, f);
  if (!fs.existsSync(src)) throw new Error('falta la fotografía de la galería: ' + f);
  fs.copyFileSync(src, path.join(FOTO_OUT, path.basename(f)));
});

/* las dos figuras con las que se navega el ART no están en los datos (el
   módulo slide08Art.js las cambia sobre la misma <img>), así que se copian
   aparte para que la captura de la secuencia las muestre */
['art1.png', 'art2.png'].forEach(function (n) {
  const src = path.resolve(ROOT, 'assets', n);
  if (!fs.existsSync(src)) throw new Error('falta la figura del ART: assets/' + n);
  fs.copyFileSync(src, path.join(ASSET_OUT, n));
});

const boot = [
  'try{var h=window.slideRenderers.resultados3(null,{},{},{},{},null);',
  'document.getElementById("frame").innerHTML=h;',
  'document.querySelector(".slide").classList.add("active");',
  'document.querySelector(".slide").appendChild(function(){var i=document.createElement("img");i.className="slide-logo";i.src="assets/logo.png";i.alt="Logotipo";return i;}());',
  '}catch(e){var pe=document.createElement("pre");pe.id="err";pe.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(pe);}'
].join('');

/* Reproduce lo que hace app.js al abrir un foco: la clase en el cuerpo, el
   data-focus y el ghost atenuado detrás. */
const abrirFoco = [
  'function abrirFoco(k){',
  'var g=document.querySelector(".scope-ghost");if(g)g.parentNode.removeChild(g);',
  'var b=document.querySelector(".rs3-body");',
  'b.className="rs3-body rs3-body--f"+k;b.setAttribute("data-focus",k);',
  'if(!k)return;',
  'var ghost=document.createElement("div");ghost.className="scope-ghost is-on";',
  'var inner=document.createElement("div");inner.className="scope-ghost-inner";',
  'inner.style.padding="4px 20px 12px";inner.style.gap="8px";',
  'var copy=document.querySelector(".rs3-cols").cloneNode(true);',
  'copy.removeAttribute("id");',
  'Array.prototype.forEach.call(copy.querySelectorAll("[id]"),function(x){x.removeAttribute("id");});',
  'Array.prototype.forEach.call(copy.querySelectorAll("[tabindex]"),function(x){x.removeAttribute("tabindex");});',
  'inner.appendChild(copy);ghost.appendChild(inner);',
  'ghost.style.left=b.offsetLeft+"px";ghost.style.top=b.offsetTop+"px";',
  'ghost.style.width=b.offsetWidth+"px";ghost.style.height=b.offsetHeight+"px";',
  'document.querySelector(".slide").appendChild(ghost);',
  '}'
].join('');

const audit = [
  'function audit(){',
  'var o="";',
  'var NL=String.fromCharCode(10);',
  'var q=function(s,root){return Array.prototype.slice.call((root||document).querySelectorAll(s)).filter(function(e){return !e.closest(".scope-ghost");});};',
  'var body=document.querySelector(".rs3-body");',
  'var head=document.querySelector(".slide-head");',
  'var flow=document.querySelector(".rs3-flow");',
  'var sc=q(".rs3-screens")[0];',
  'var pn=q(".rs3-panel").filter(function(e){return e.offsetParent!==null;})[0];',
  'o+="lamina "+(head?head.offsetWidth+"x"+head.offsetHeight:"MISSING")+NL;',
  'o+="cuerpo "+(body?body.offsetWidth+"x"+body.offsetHeight:"MISSING")+NL;',
  'o+="banda pasos "+(flow?flow.offsetWidth+"x"+flow.offsetHeight:"MISSING")+NL;',
  'o+="pantalla "+(sc?sc.offsetWidth+"x"+sc.offsetHeight:"MISSING")+NL;',
  'function live(el){return el&&el.offsetParent!==null&&el.offsetHeight>0&&getComputedStyle(el).visibility!=="hidden";}',
  '[".slide-head",".rs3-body",".rs3-cols",".rs3-flow",".rs3-chain",".rs3-paso",".rs3-idle",".rs3-gal",".rs3-gal-i",".rs3-gal-view",".rs3-gal-big",".rs3-screens",".rs3-panel",".rs3-pn-body"].forEach(function(cn){',
  'q(cn,document).filter(live).forEach(function(el,i){var c=el.scrollHeight-el.clientHeight;if(c>0)o+="  clip "+cn+i+" "+c+NL;});});',
  'q(".rs3-p-c,.rs3-p-t,.rs3-p-s,.rs3-note,.rs3-pn-c,.rs3-pn-t,.rs3-pn-s,.rs3-pn-f em,.rs3-pn-f span,button.rs3-gal-i",document).filter(live).forEach(function(e,i){',
  'if(e.scrollWidth>e.clientWidth+1)o+="  tx "+i+" <"+e.getAttribute("class")+"> w"+e.clientWidth+"/"+e.scrollWidth+NL;});',
  'var fr=document.querySelector(".slide-frame").getBoundingClientRect();',
  'q(".slide-head,.rs3-body,.rs3-cols,.rs3-flow,.rs3-chain,.rs3-idle,.rs3-gal,.rs3-gal-i,.rs3-gal-view,.rs3-gal-big,.rs3-screens,.rs3-panel,.rs3-pn-body",document).forEach(function(e,i){var r=e.getBoundingClientRect();if(!r.width)return;var ov=[];',
  'if(r.left<fr.left-1)ov.push("left");if(r.right>fr.right+1)ov.push("right");if(r.top<fr.top-1)ov.push("top");if(r.bottom>fr.bottom+1)ov.push("bottom");',
  'if(ov.length)o+="  frame OVERFLOW "+i+" <"+e.className+"> "+ov.join(",")+NL;});',
  'var idle=q(".rs3-idle")[0];',
  'o+="reposo "+(idle?idle.offsetWidth+"x"+idle.offsetHeight+" gcs="+getComputedStyle(idle).display:"-")+NL;',
  'o+="galeria "+(idle?idle.querySelectorAll(".rs3-gal-i").length+" fotos is-open="+(idle.classList.contains("is-open")?"si":"no")+" data-foto="+(idle.getAttribute("data-foto")||"-"):"-")+NL;',
  'o+="foto "+(idle&&idle.classList.contains("is-open")?(function(){var v=idle.querySelector(".rs3-gal-view"),b=idle.querySelector(".rs3-gal-big");var vr=v.getBoundingClientRect(),br=b.getBoundingClientRect();return idle.getAttribute("data-foto")+" caja "+Math.round(vr.width)+"x"+Math.round(vr.height)+" img "+Math.round(br.width)+"x"+Math.round(br.height);})():"-")+NL;',
  'o+="pasos "+q(".rs3-paso").map(function(n){var c=n.querySelector(".rs3-p-c").textContent;return c+":"+n.offsetWidth+"x"+n.offsetHeight;}).join(" ")+NL;',
  'o+="conectores "+q(".rs3-chain > .rs3-fx").length+NL;',
  'o+="pulsables "+q(".rs3-paso[data-focus]").map(function(n){return n.getAttribute("data-focus");}).join(",")+NL;',
  'o+="panel "+(pn?pn.getAttribute("data-panel")+" "+pn.offsetWidth+"x"+pn.offsetHeight:"-")+NL;',
  'if(pn){',
  'var im=q(".rs3-pn-img",pn)[0];',
  'o+="  img "+(im?im.offsetWidth+"x"+im.offsetHeight+" natural="+im.naturalWidth+"x"+im.naturalHeight+" src="+im.getAttribute("src"):"sin imagen")+NL;',
  'o+="  img-caja "+(im?[Math.round(im.getBoundingClientRect().x),Math.round(im.getBoundingClientRect().y),Math.round(im.getBoundingClientRect().width),Math.round(im.getBoundingClientRect().height)].join(" "):"-")+NL;',
  'o+="  img-rect "+(function(){var s=q(".rs3-pn-body",pn)[0];if(!s)return "-";var b=s.getBoundingClientRect();return [Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height)].join(" ");})()+NL;',
  'o+="  paneles visibles "+q(".rs3-panel").filter(function(e){return e.offsetParent!==null;}).length+NL;',
  '}',
  'o+="ghost "+(document.querySelector(".scope-ghost")?"presente":"-")+NL;',
  'o+="foco "+(body&&body.getAttribute("data-focus")||"-")+NL;',
  'var zm=q(".rs3-pn-zoom").filter(function(e){return e.offsetParent!==null;})[0];',
  'o+="zoom "+(zm?zm.getAttribute("data-focus")+" "+Math.round(zm.getBoundingClientRect().width)+"x"+Math.round(zm.getBoundingClientRect().height)+" cursor="+getComputedStyle(zm).cursor:"-")+NL;',
  'o+="flujo "+(flow?getComputedStyle(flow).display:"-")+NL;',
  'o+="acercamiento "+(zm?("z="+(zm.style.getPropertyValue("--rs3-z")||"1")+" tx="+(zm.style.getPropertyValue("--rs3-tx")||"0")+" ty="+(zm.style.getPropertyValue("--rs3-ty")||"0")+" "+(zm.classList.contains("is-zoom")?"is-zoom":"fit")+" cursor="+getComputedStyle(zm).cursor):"-")+NL;',
  'o+="pista "+(zm&&zm.closest(".rs3-panel").querySelector(".rs3-zoom-tip")?getComputedStyle(zm.closest(".rs3-panel").querySelector(".rs3-zoom-tip")).display+"/"+zm.closest(".rs3-panel").querySelector(".rs3-zoom-nv").textContent:"-")+NL;',
  'return o;}'
].join('');

/* Estado ampliado: el harness no carga slide08Zoom.js (aqui los niveles se
   abren poniendo la clase a mano), asi que la transformação se escribe
   directamente en las mismas variables CSS que usa el modulo. Sirve para ver
   como queda la imagen con `--rs3-z` distinto de 1. */
const acercarEn = [
  'function acercarEn(k,z,tx,ty){',
  'abrirFoco(k+"i");',
  'var zm=document.querySelector(".rs3-panel[data-panel=\'"+k+"\'] .rs3-pn-zoom");',
  'if(!zm)return;',
  'zm.style.setProperty("--rs3-z",String(z));',
  'zm.style.setProperty("--rs3-tx",tx+"px");',
  'zm.style.setProperty("--rs3-ty",ty+"px");',
  'zm.classList.add("is-zoom");',
  '}'
].join('');

const report = [
  'var NL=String.fromCharCode(10);var o="";',
  'o+="h2 "+document.querySelector("h2").textContent+NL;',
  'o+="sub "+document.querySelector(".rs-subtitle").textContent+NL;',
  'o+="== LAMINA =="+NL;',
  'o+=audit();',
  'var pre=document.createElement("pre");pre.id="report";pre.textContent=o;document.body.appendChild(pre);'
].join('');

const reportFocos = [
  'var NL=String.fromCharCode(10);var o="";',
  CLAVES.map(function (k) {
    /* un solo try por paso: el estado del resultado y su nivel 2, sin anidar */
    return 'try{' +
      'abrirFoco("' + k + '");o+="== FOCO ' + k.toUpperCase() + ' =="+NL;o+=audit();o+=NL;' +
      'abrirFoco("' + k + 'i");o+="== NIVEL 2 ' + k.toUpperCase() + 'I =="+NL;o+=audit();o+=NL;' +
      '}catch(e){o+="== ' + k.toUpperCase() + ' == ERROR "+e+NL;}';
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
  '<script>' + slide + '</script>',
  '<script>'
].join('');

const wrap = function (cuerpo, esperarCarga) {
  /* Los informes se lanzan en `load` para que las imágenes ya tengan tamaño
     intrínseco: antes de eso `offsetWidth` sale 0 y el nivel 2 no se puede
     comprobar. Las capturas no lo necesitan (usan virtual-time-budget). */
  const bloque = esperarCarga
    ? 'window.addEventListener("load",function(){' + cuerpo + '});'
    : cuerpo;
  return shell + boot + audit + abrirFoco + acercarEn + bloque +
    '</script></body></html>';
};

const ERR = 'catch(e){var ep=document.createElement("pre");ep.id="err";ep.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(ep);}';

fs.writeFileSync(path.join(OUT, 'res3_heights.html'), wrap('try{' + report + '}' + ERR, true));
console.log('ok res3_heights.html');

fs.writeFileSync(path.join(OUT, 'res3_focos.html'), wrap('try{' + reportFocos + '}' + ERR, true));
console.log('ok res3_focos.html');

function shot(focus) {
  const apply = focus
    ? 'setTimeout(function(){abrirFoco("' + focus + '");},60);'
    : '';
  return wrap(apply);
}

fs.writeFileSync(path.join(OUT, 'res3_shot.html'), shot(''));
console.log('ok res3_shot.html');
CLAVES.forEach(function (k) {
  fs.writeFileSync(path.join(OUT, 'res3_shot_f' + k + '.html'), shot(k));
  fs.writeFileSync(path.join(OUT, 'res3_shot_f' + k + 'i.html'), shot(k + 'i'));
});

/* dos capturas con acercamiento: la matriz (vertical) y el grafico pequeño */
function shotZoom(k, z, tx, ty) {
  return wrap('setTimeout(function(){acercarEn("' + k + '",' + z + ',' + tx + ',' + ty + ');},60);');
}
fs.writeFileSync(path.join(OUT, 'res3_shot_f1z.html'), shotZoom('p1', 2.56, -120, -60));
fs.writeFileSync(path.join(OUT, 'res3_shot_f2z.html'), shotZoom('p2', 4.1, -260, 0));

/* dos capturas con la galería ampliada: la foto 1 (horizontal) y la 2
   (vertical), para ver cómo entra cada orientación en el visor */
function shotFoto(i) {
  return wrap('setTimeout(function(){' +
    'var s=document.querySelector(".rs3-idle");' +
    'var t=s.querySelector(\'.rs3-gal-i[data-foto="' + i + '"] .rs3-gal-t\');' +
    's.querySelector(".rs3-gal-big").src=t.getAttribute("src");' +
    's.setAttribute("data-foto","' + i + '");' +
    's.classList.add("is-open");' +
    '},60);');
}
fs.writeFileSync(path.join(OUT, 'res3_shot_foto1.html'), shotFoto(0));
fs.writeFileSync(path.join(OUT, 'res3_shot_foto2.html'), shotFoto(1));

/* dos capturas de la navegación del ART: la imagen a máximo tamaño ya con la
   segunda y la tercera figura de la secuencia (art1 y art2) */
function shotArt(img, nv) {
  return wrap('setTimeout(function(){' +
    'abrirFoco("p6i");' +
    'var zm=document.querySelector(".rs3-panel[data-panel=\'p6\'] .rs3-pn-zoom");' +
    'var im=zm.querySelector(".rs3-pn-img");' +
    'im.setAttribute("src",' + JSON.stringify(img) + ');' +
    'var nv=document.querySelector(".rs3-panel[data-panel=\'p6\'] .rs3-zoom-nv");' +
    'if(nv)nv.textContent=' + JSON.stringify(nv) + ';' +
    '},60);');
}
fs.writeFileSync(path.join(OUT, 'res3_shot_art1.html'), shotArt('assets/art1.png', '2/3'));
fs.writeFileSync(path.join(OUT, 'res3_shot_art2.html'), shotArt('assets/art2.png', '3/3'));
console.log('capturas: res3_shot_f' + CLAVES.join('.html, res3_shot_f') +
  '.html (+ nivel 2 f1i..f6i, + f1z y f2z, + galería foto1 y foto2, + ART art1 y art2)');
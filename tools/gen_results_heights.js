const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'presentacion-web');
const OUT = path.join(__dirname, 'out');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const css = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
const icons = fs.readFileSync(path.join(ROOT, 'js/icons.js'), 'utf8');
const data = fs.readFileSync(path.join(ROOT, 'js/data/resultsData.js'), 'utf8');
const slide = fs.readFileSync(path.join(ROOT, 'js/slides/slide06Results.js'), 'utf8');

const boot = [
  'try{var h=window.slideRenderers.resultados(null,{},{},{},{},window.RESULTADOS);',
  'document.getElementById("frame").innerHTML=h;',
  'document.querySelector(".slide").classList.add("active");',
  'document.querySelector(".slide").appendChild(function(){var i=document.createElement("img");i.className="slide-logo";i.src="assets/logo.png";i.alt="Logotipo";return i;}());',
  '}catch(e){var pe=document.createElement("pre");pe.id="err";pe.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(pe);}'
].join('');

const audit = [
  'function audit(){',
  'var o="";',
  'var NL=String.fromCharCode(10);',
  'var q=function(s,root){return Array.prototype.slice.call((root||document).querySelectorAll(s));};',
  'var vis=q(".rs-panel").filter(function(p){return p.offsetWidth>0;});',
  'o+="visibles "+vis.length+" de 3"+NL;',
  'vis.forEach(function(p,i){o+="panel"+i+" "+p.offsetWidth+"x"+p.offsetHeight+" k="+getComputedStyle(p.closest(".rs-body")).getPropertyValue("--rs-k").trim()+NL;});',
  'vis.forEach(function(p,pi){',
  'var scope=p;',
  '[".rs-panel",".rs-pbody",".rs-fase",".rs-olist",".rs-groups",".rs-note",".rs-tbl"].forEach(function(cn){',
  'q(cn,scope).forEach(function(el,i){var c=el.scrollHeight-el.clientHeight;if(c>0)o+="  clip "+cn+i+" "+c+NL;});});',
  'q(".rs-olist li",scope).forEach(function(li,i){var sp=li.querySelector(".rs-ot");',
  'var f=parseFloat(getComputedStyle(sp).fontSize)*1.16;var lin=Math.round(sp.offsetHeight/f);',
  'if(lin>1)o+="  item "+i+" "+lin+" lineas :: "+sp.textContent.slice(0,40)+NL;});',
  'q(".rs-tbl td",scope).forEach(function(td,i){',
  'if(td.scrollWidth>td.clientWidth+1)o+="  td-overflow "+i+" :: "+td.textContent.slice(0,40)+NL;',
  'var rg=document.createRange();rg.selectNodeContents(td);var ln=rg.getClientRects().length;',
  'if(ln>3)o+="  td-wrap "+i+" "+ln+" lineas :: "+td.textContent.slice(0,40)+NL;});',
  'q(".rs-chip",scope).forEach(function(c,i){if(c.scrollWidth>c.clientWidth+1)o+="  chip-overflow "+i+NL;});',
  'q(".rs-phead h3,.rs-ftitle,.rs-total-u,.rs-risk-u,.rs-note-m,.rs-note-s,.rs-ftext,.rs-seq-t,.rs-ctx,.rs-chip,.rs-ot,.rs-dist-n,.rs-dist-s,.rs-glab,.rs-bar-s,.rs-subv-n,.rs-subv-u,.rs-subv-b,.rs-subpic figcaption,.rs-fpic figcaption",scope).forEach(function(e,i){',
  'if(e.scrollWidth>e.clientWidth+1)o+="  textx-overflow "+i+" <"+e.className+"> w"+e.clientWidth+"/"+e.scrollWidth+" :: "+e.textContent.slice(0,36)+NL;});',
  'var pb=p.querySelector(".rs-pbody");var s=0;Array.prototype.forEach.call(pb.children,function(c){s+=c.offsetHeight;});',
  'o+="panel"+pi+" pbody"+pb.clientHeight+" contenido"+s+" holgura"+(pb.clientHeight-s-8*(pb.children.length-1))+NL;});',
  'o+="items "+q(".rs-olist li").length+" chips "+q(".rs-chip").length+" flechas "+q(".rs-msg-a").length+" conectores "+q(".rs-link svg").length+NL;',
  'q(".rs-chips").forEach(function(c,i){var lh=c.firstElementChild?parseFloat(getComputedStyle(c.firstElementChild).lineHeight):20;',
  'o+="chips"+i+" h"+c.offsetHeight+" filas "+Math.round(c.offsetHeight/lh)+NL;});',
  'var fr=document.querySelector(".slide-frame").getBoundingClientRect();',
  'q(".rs-panel,.rs-seq,.slide-head,.rs-hint,.rs-fpic").forEach(function(e,i){var r=e.getBoundingClientRect();if(r.width===0)return;var ov=[];',
  'if(r.left<fr.left-1)ov.push("left");if(r.right>fr.right+1)ov.push("right");if(r.top<fr.top-1)ov.push("top");if(r.bottom>fr.bottom+1)ov.push("bottom");',
  'if(ov.length)o+="  frame OVERFLOW "+i+" "+ov.join(",")+NL;});',
  'vis.forEach(function(a,i){vis.forEach(function(b,j){if(j<=i)return;',
  'if(a.getBoundingClientRect().left<b.getBoundingClientRect().right&&b.getBoundingClientRect().left<a.getBoundingClientRect().right)o+="  box OVERLAP "+i+"<->"+j+NL;});});',
  'o+="fuente tabla "+q(".rs-tbl td").map(function(td){return Math.round(parseFloat(getComputedStyle(td).fontSize)*10)/10;}).join("/")+NL;',
  'o+="fuente lista "+Math.round(parseFloat(getComputedStyle(document.querySelector(".rs-ot")).fontSize)*10)/10+NL;',
  'return o;}'
].join('');

const report = [
  'var NL=String.fromCharCode(10);var o="";',
  'o+="h2 "+document.querySelector("h2").textContent+NL;',
  'o+="subtitulo :: "+document.querySelector(".rs-subtitle").textContent.slice(0,58)+NL;',
  'o+="data-focus panel0="+(document.querySelector(".rs-panel").getAttribute("data-focus")||"-")+NL;',
  'o+="hint :: "+document.querySelector(".rs-hint").textContent+NL;',
  'o+="== SIN FOCO =="+NL;',
  'o+=audit();',
  'var b=document.querySelector(".rs-body");',
  '["1","1a","1b","2","3","2a","2b","3a","3b","3aimg","3bimg"].forEach(function(k){',
  'b.className="rs-body rs-body--f"+k;b.setAttribute("data-focus",k);',
  'o+="== FOCO "+k+" =="+NL;',
  'o+=audit();',
  '});',
  'b.className="rs-body";b.removeAttribute("data-focus");',
  'o+="== RESTAURADO =="+NL;',
  'o+=audit();',
  'var pre=document.createElement("pre");pre.id="report";pre.textContent=o;document.body.appendChild(pre);'
].join('');

const shell = [
  '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=1408">',
  '<style>html,body{margin:0;padding:0;overflow:hidden}.slide-frame{zoom:1 !important;margin:0}',
  '.slide-frame *{transition:none !important}</style>',
  '<style>' + css + '</style></head><body>',
  '<div class="slide-frame" id="frame"></div>',
  '<script>' + icons + '</script>',
  '<script>' + data + '</script>',
  '<script>' + slide + '</script>',
  '<script>'
].join('');

const html =
  shell
  + boot
  + audit
  + 'try{' + report + '}catch(e){var ep=document.createElement("pre");ep.id="err";ep.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(ep);}'
  + '</script></body></html>';

fs.writeFileSync(path.join(OUT, 'results_heights.html'), html);
console.log('ok len', html.length);

/* Capturas: estado normal y los tres estados de foco */
function shot(focus) {
  const apply = focus
    ? 'setTimeout(function(){var b=document.querySelector(".rs-body");'
      + 'b.className="rs-body rs-body--f' + focus + '";b.setAttribute("data-focus","' + focus + '");'
      + 'document.querySelector(".rs-hint").textContent="Clic de nuevo o tecla ESC para volver a la vista completa";},60);'
    : '';
  return shell + boot + apply + '</script></body></html>';
}

fs.writeFileSync(path.join(OUT, 'results_shot.html'), shot(''));
['1', '1a', '1b', '2', '3', '2a', '2b', '3a', '3b', '3aimg', '3bimg'].forEach(function (k) {
  fs.writeFileSync(path.join(OUT, 'results_shot_f' + k + '.html'), shot(k));
});
console.log('capturas: results_shot.html + f1/f1a/f1b/f2/f3/f2a/f2b/f3a/f3b/f3aimg/f3bimg');

/* Copia las imágenes referenciadas por el slide a out/assets/ para las capturas
   headless. Desde que el slide 8 cuelga fotografías de assets/fotos/, la copia
   tiene que reflejar el árbol entero (archivos y subcarpetas). */
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
console.log('assets copiados a out/assets (para capturas)');

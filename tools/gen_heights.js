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
const data = fs.readFileSync(path.join(ROOT, 'js/data/methodologyData.js'), 'utf8');
const slide = fs.readFileSync(path.join(ROOT, 'js/slides/slide05Methodology.js'), 'utf8');

const boot =
  'try{var h=window.slideRenderers.metodologia(null,{},{},{},window.METODOLOGIA);' +
  'document.getElementById("frame").innerHTML=h;' +
  'document.querySelector(".slide").classList.add("active");' +
  'document.querySelector(".slide").appendChild(function(){var i=document.createElement("img");i.className="slide-logo";i.src="assets/logo.png";i.alt="Logotipo";return i;}());' +
  '}catch(e){var pe=document.createElement("pre");pe.id="err";pe.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(pe);}';

const audit =
  'function audit(){\n' +
  'var o="";var NL=String.fromCharCode(10);\n' +
  'var q=function(s,root){return Array.prototype.slice.call((root||document).querySelectorAll(s));};\n' +
  'var visFn=function(el){var s=window.getComputedStyle(el);return el.offsetWidth>1&&parseFloat(s.opacity)>0.01;};\n' +
  'var visP=q(".md-panel").filter(visFn);\n' +
  'o+="visibles "+visP.length+NL;\n' +
  'visP.forEach(function(p,i){o+="panel"+i+" "+p.className.replace(/md-panel/,"")+" "+p.offsetWidth+"x"+p.offsetHeight+NL;\n' +
  'if(p.classList.contains("md-panel--mapa")){\n' +
  'var mt=p.querySelector(".mm-map");o+="  mapa "+mt.offsetWidth+"x"+mt.offsetHeight+NL;\n' +
  'q(".mm-rama",p).filter(visFn).forEach(function(e,f){var l=e.offsetLeft,t=e.offsetTop,r=l+e.offsetWidth,b=t+e.offsetHeight;var ov=[];\n' +
  'if(l<0)ov.push("left");if(r>mt.offsetWidth+1)ov.push("right");if(t<0)ov.push("top");if(b>mt.offsetHeight+1)ov.push("bottom");\n' +
  'if(ov.length)o+="  rama"+f+" OVERFLOW "+ov.join(",")+NL;\n' +
  'var fs=getComputedStyle(e).getPropertyValue("--mm-fs").trim();o+="  rama"+f+" "+e.offsetWidth+"x"+e.offsetHeight+" fs"+fs+NL;});}\n' +
  'q(".md-panel, .md-focus-body, .md-flow, .md-types, .md-pilot, .md-synth, .md-phases, .md-pipeline, .mm-map, .mm-rama, .mm-sub, .mm-list",p).forEach(function(cn,j){\n' +
  'var c=cn.scrollHeight-cn.clientHeight;if(c>0){o+="  clip "+cn.className+" "+c+NL;}});\n' +
  '[".md-fnode b",".md-fnode span",".md-fmain",".md-type b",".md-type span",".md-pilot",".md-synth",".md-pkind",".md-pnode b",".md-pdo",".md-pout",".md-ptok",".md-parr2",".mm-rtt b",".mm-rtt span",".mm-mti-t",".mm-chip",".mm-sub-ht",".mm-lg",".mm-note",".mm-pv",".md-hint",".md-hint--off",".md-panel-head h3"].forEach(function(cn){\n' +
  'q(cn,p).forEach(function(e,f){if(e.offsetWidth===0)return;if(e.scrollWidth>e.clientWidth+1)o+="  textx "+cn+" :: "+e.textContent.slice(0,30)+NL;});});\n' +
  '});\n' +
  'var fr=document.querySelector(".slide-frame").getBoundingClientRect();\n' +
  'q(".md-panel").filter(visFn).forEach(function(e,i){var r=e.getBoundingClientRect();var ov=[];\n' +
  'if(r.left<fr.left-1)ov.push("left");if(r.right>fr.right+1)ov.push("right");if(r.top<fr.top-1)ov.push("top");if(r.bottom>fr.bottom+1)ov.push("bottom");\n' +
  'if(ov.length)o+="  frame OVERFLOW "+i+" "+ov.join(",")+NL;});\n' +
  'visP.forEach(function(a,i){visP.forEach(function(b,j){if(j<=i)return;\n' +
  'var ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();\n' +
  'if(ra.left<rb.right&&rb.left<ra.right&&ra.top<rb.bottom&&rb.top<ra.bottom)o+="  box OVERLAP "+i+"<->"+j+NL;});});\n' +
  'return o;}\n';

const restAudit =
  'var q=function(s){return Array.prototype.slice.call(document.querySelectorAll(s));};' +
  'var elBody=document.querySelector(".md-body"),elTop=document.querySelector(".md-top");' +
  'var cs=function(el,p){return window.getComputedStyle(el).getPropertyValue(p);};' +
  'o+="body pad "+cs(elBody,"padding")+NL;' +
  'var S=[".slide-head",".md-body",".md-top",".md-panel--focus",".md-panel--phases",".md-panel--mapa",".mm-map",".mm-ruta",".mm-note",".mm-center"];' +
  'S.forEach(function(sl){var el=document.querySelector(sl);o+=sl+" "+(el?el.offsetHeight+"x"+el.offsetWidth:"MISSING")+NL;});' +
  '["md-body","md-top","md-panel--focus","md-panel--phases","md-panel--mapa","mm-map"].forEach(function(cn){var el=document.querySelector("."+cn);o+="clip "+cn+" "+(el.scrollHeight-el.clientHeight)+NL;});' +
  'q(".mm-rama").forEach(function(b,i){var subs=b.querySelector(".mm-subs"),ch=b.querySelector(".mm-chips"),hd=b.querySelector(".mm-rhead"),sb=b.querySelectorAll(".mm-sub-h");' +
  'o+="rama"+i+" "+b.offsetWidth+"x"+b.offsetHeight+" inner"+(b.scrollHeight-b.clientHeight)+" subs"+(subs.scrollHeight-subs.clientHeight)+" head"+hd.offsetHeight+" chips"+(ch?ch.offsetHeight+"/"+ch.scrollHeight:"-")+" subh"+Array.prototype.map.call(sb,function(x){return x.offsetHeight}).join("/")+NL;});' +
  'q(".mm-sub").forEach(function(s,i){var l=s.querySelector(".mm-list");var lh=l?Array.prototype.map.call(l.children,function(x){return x.offsetHeight}).join("+"):"-";' +
  'o+="sub"+i+" h"+s.offsetHeight+" list"+(l?(l.scrollHeight-l.clientHeight):"-")+(l?" ["+l.clientHeight+"/"+l.scrollHeight+" li "+lh+"]":"")+NL;});' +
  'q(".mm-list li").forEach(function(li,i){if(li.scrollWidth>li.clientWidth+1)o+="  li-overflow "+i+NL;});' +
  'var multi=0,tot=0;var sangria=[];var anchos=[];q(".mm-list li").forEach(function(li){tot++;var sp=li.lastElementChild;var lh=parseFloat(window.getComputedStyle(li).fontSize)*1.12;var lineas=Math.round(sp.offsetHeight/lh);if(lineas>1){multi++;o+="  item "+lineas+" lineas len"+sp.textContent.length+" w"+sp.clientWidth+" :: "+sp.textContent.slice(0,34)+NL;anchos.push(sp.textContent.length);}sangria.push(Math.round(sp.getBoundingClientRect().left-li.getBoundingClientRect().left));});o+="w sub"+document.querySelector(".mm-sub").offsetWidth+" texto"+document.querySelector(".mm-list li").lastElementChild.offsetWidth+" insignia"+document.querySelector(".mm-list li").querySelector(".mm-lg").offsetWidth+NL;o+="items "+tot+" una-linea "+(tot-multi)+" sangria "+(sangria.length?Math.min.apply(null,sangria)+"-"+Math.max.apply(null,sangria):"-")+(anchos.length?" wraps-len "+Math.min.apply(null,anchos)+"-"+Math.max.apply(null,anchos):"")+NL;' +
  'q(".mm-rtt b,.mm-rtt span,.mm-mti-t,.mm-chip,.mm-sub-ht,.mm-lg,.mm-note,.mm-pv").forEach(function(e,i){if(e.scrollWidth>e.clientWidth+1)o+="  textx-overflow "+i+" "+e.textContent.slice(0,28)+NL;});' +
  'var c=document.querySelector(".mm-center");o+="center inner"+(c.scrollHeight-c.clientHeight)+" sw"+(c.scrollWidth-c.clientWidth)+" sub-sw"+(c.querySelector(".mm-csub").scrollWidth-c.querySelector(".mm-csub").clientWidth)+NL;' +
  'var mt=document.querySelector(".mm-map");var mw=mt.offsetWidth,mh=mt.offsetHeight;' +
  'q(".mm-rama,.mm-center").forEach(function(e,i){var l=e.offsetLeft,t=e.offsetTop,r=l+e.offsetWidth,b=t+e.offsetHeight;var ov=[];' +
  'if(l<0)ov.push("left");if(r>mw+1)ov.push("right");if(t<0)ov.push("top");if(b>mh+1)ov.push("bottom");' +
  'if(ov.length)o+="  box"+i+" OVERFLOW "+ov.join(",")+NL;});' +
  'q(".mm-rama,.mm-center").forEach(function(a,i){q(".mm-rama,.mm-center").forEach(function(b,j){if(j<=i)return;' +
  'if(a.offsetLeft<b.offsetLeft+b.offsetWidth&&b.offsetLeft<a.offsetLeft+a.offsetWidth&&a.offsetTop<b.offsetTop+b.offsetHeight&&b.offsetTop<a.offsetTop+a.offsetHeight)o+="  box OVERLAP "+i+"<->"+j+NL;});});';

const report =
  'var NL=String.fromCharCode(10);var o="";' +
  'o+="h2 "+document.querySelector("h2").textContent+NL;' +
  'o+="subtitulo :: "+document.querySelector(".md-subtitle").textContent+NL;' +
  'o+="data-focus bloque1="+document.querySelector(".md-panel--focus").getAttribute("data-focus")+" rama-lt="+document.querySelector("[data-focus=lt]").getAttribute("data-focus")+NL;' +
  'o+="hint :: "+document.querySelector(".md-panel--mapa .md-hint").textContent+NL;' +
  'o+="== SIN FOCO (detallado) =="+NL;' + restAudit + 'o+="-- audit --"+NL;o+=audit();' +
  'var b=document.querySelector(".md-body");' +
  '["1","2","lt","lb","rt","rb","cb"].forEach(function(k){' +
  'b.className="md-body md-body--f"+k;b.setAttribute("data-focus",k);' +
  'o+="== FOCO "+k+" =="+NL;o+=audit();' +
  '});' +
  'b.className="md-body";b.removeAttribute("data-focus");' +
  'o+="== RESTAURADO =="+NL;o+=audit();' +
  'var pre=document.createElement("pre");pre.id="report";pre.textContent=o;document.body.appendChild(pre);';

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

fs.writeFileSync(path.join(OUT, 'heights.html'), html);
console.log('ok len', html.length);

/* Capturas: estado normal y los 7 estados de foco */
function shot(state) {
  const apply = state
    ? 'setTimeout(function(){var b=document.querySelector(".md-body");'
      + 'b.className="md-body md-body--f' + state + '";b.setAttribute("data-focus","' + state + '");},60);'
    : '';
  return shell + boot + apply + '</script></body></html>';
}

fs.writeFileSync(path.join(OUT, 'md_shot.html'), shot(''));
['1', '2', 'lt', 'lb', 'rt', 'rb', 'cb'].forEach(function (k) {
  fs.writeFileSync(path.join(OUT, 'md_shot_f' + k + '.html'), shot(k));
});
console.log('capturas: md_shot.html + f1/f2/flt/flb/frt/frb/fcb');
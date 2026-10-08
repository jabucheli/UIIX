const fs = require('fs');
const path = require('path');
const os = require('os');

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

const NL = '\\n';
const PRELUDE = 'var NL=String.fromCharCode(10);';
const boot =
  'try{var h=window.slideRenderers.metodologia(null,{},{},{},window.METODOLOGIA);' +
  'document.getElementById("frame").innerHTML=h;' +
  'document.querySelector(".slide").classList.add("active");' +
  'document.querySelector(".slide").appendChild(function(){var i=document.createElement("img");i.className="slide-logo";i.src="assets/logo.png";i.alt="Logotipo";return i;}());' +
  '}catch(e){var pe=document.createElement("pre");pe.id="err";pe.textContent=e&&e.stack?e.stack:String(e);document.body.appendChild(pe);}';

const report =
  'var map=document.querySelector(".md-map");if(!map){var p2=document.createElement("pre");p2.id="err2";p2.textContent="NO MAP";document.body.appendChild(p2);}else{'
  + 'var items=Array.prototype.slice.call(document.querySelectorAll(".md-mn,.md-mc,.md-mcenter"));var o="";'
  + 'function rect(e){var w=e.offsetWidth,h=e.offsetHeight,l=e.offsetLeft,t=e.offsetTop;return{l:l,t:t,w:w,h:h,r:l+w,b:t+h};}'
  + 'var mw=map.offsetWidth,mh=map.offsetHeight;o+="MAP "+mw+"x"+mh+NL;var idx=0;'
  + 'var pb=document.querySelector(".md-body"),bn=document.querySelector(".md-bottom"),pn=document.querySelector(".md-panel--map");'
  + 'o+="BODY "+pb.offsetWidth+"x"+pb.offsetHeight+" BOT "+bn.offsetWidth+" PANEL "+pn.offsetWidth+" CHECK "+pn.clientWidth+NL;'
  + 'items.forEach(function(e){var r=rect(e);var name=(e.className.split(" ")[1]||e.className);'
  + 'if(e.classList.contains("md-mc")){var sp=e.querySelector(".md-mc-tx span");var tx=sp?sp.scrollHeight+"v"+sp.clientHeight+"c "+(sp.scrollHeight>sp.clientHeight?"CLIP":"ok"):"no-span";o+="  TX "+tx+NL;}'
  + 'if(e.classList.contains("md-mn")){var bn=e.querySelector("b"),sn=e.querySelector("span");var tx=(sn.scrollHeight>sn.clientHeight?"span-clip":"")+(bn.scrollHeight>bn.clientHeight?" b-clip":"");if(tx)o+="  NODETX "+tx+NL;}'
  + 'o+=idx+" "+name+" L="+r.l+" T="+r.t+" R="+r.r+" B="+r.b+" "+r.w+"x"+r.h+NL;'
  + 'var over=[];if(r.l<0)over.push("left");if(r.r>mw+1)over.push("right(+");if(r.t<0)over.push("top");if(r.b>mh+1)over.push("bottom(+");'
  + 'if(over.length)o+="   OVERFLOW "+over.join(",")+NL;'
  + 'items.forEach(function(g,j){if(j<=idx)return;var s=rect(g);if(r.l<s.r&&s.l<r.r&&r.t<s.b&&s.t<r.b)o+="   OVERLAP "+idx+"<->"+j+NL;});idx++;});'
  + 'var pre=document.createElement("pre");pre.id="report";pre.textContent=o;document.body.appendChild(pre);}';

const html = '<!DOCTYPE html><html><head><meta charset="UTF-8">'
  + '<style>html,body{margin:0;padding:0;overflow:hidden}.slide-frame{zoom:1 !important;margin:0}</style>'
  + '<style>' + css + '</style></head><body>'
  + '<div class="slide-frame" id="frame"></div>'
  + '<script>' + icons + '</script>'
  + '<script>' + data + '</script>'
  + '<script>' + slide + '</script>'
  + '<script>' + PRELUDE + boot + report + '</script>'
  + '</body></html>';

const outFile = path.join(OUT, 'map_shot.html');
fs.writeFileSync(outFile, html);
console.log('ok len', html.length, '->', outFile);
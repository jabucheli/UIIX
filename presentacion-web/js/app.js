(function () {
  var current = 0;
  var tabsEl = document.getElementById('tabs');
  var counterEl = document.getElementById('counter');
  var frame = document.getElementById('slideFrame');
  var wrap = document.getElementById('scaleWrap');
  var prevBtn = document.getElementById('btnPrev');
  var nextBtn = document.getElementById('btnNext');
  var fsBtn = document.getElementById('btnFullscreen');

  prevBtn.innerHTML = window.Icons.svg('chevLeft', 18);
  nextBtn.innerHTML = window.Icons.svg('chevRight', 18);
  fsBtn.innerHTML = window.Icons.svg('expand', 18);

  function buildTabs() {
    window.SLIDES.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tab';
      b.textContent = s.id + '. ' + s.label;
      b.setAttribute('aria-label', 'Diapositiva ' + s.id + ': ' + s.label);
      b.addEventListener('click', function () { goto(i); });
      tabsEl.appendChild(b);
    });
  }

  function buildSlides() {
    frame.innerHTML = window.SLIDES.map(function (s) {
      var fn = window.slideRenderers[s.key];
      return fn ? fn(window.THESIS, window.PROBLEMA, window.OBJETIVOS, window.TEORIAS, window.METODOLOGIA, window.RESULTADOS) : '<section class="slide"><div style="padding:40px">Sin contenido</div></section>';
    }).join('');
/* Logotipo en la esquina superior derecha de las láminas
       (assets/logo.png, copia de logo1.png); en la carátula se omite por
       llevar su propio logocaratula.png dentro de la banda negra. */
    Array.prototype.forEach.call(frame.children, function (slide) {
      if (!slide.classList.contains('slide-cover')) {
        var img = document.createElement('img');
        img.className = 'slide-logo';
        img.src = 'assets/logo.png';
        img.alt = 'Logotipo';
        slide.appendChild(img);
      }
      /* Pie institucional: banda al borde inferior (solo visible en
         pantalla completa; CSS conmuta body.is-fullscreen-presentation,
         crece el marco para no alterar el contenido). */
      var foot = document.createElement('div');
      foot.className = 'slide-foot';
      var fi = document.createElement('img');
      fi.src = 'assets/logo-inf.png';
      fi.alt = '';
      foot.appendChild(fi);
      slide.appendChild(foot);
    });
  }

  function show(i) {
    current = Math.max(0, Math.min(window.SLIDES.length - 1, i));
    var tabs = tabsEl.children;
    for (var k = 0; k < tabs.length; k++) {
      tabs[k].classList.toggle('active', k === current);
    }
    var slides = frame.children;
    for (var j = 0; j < slides.length; j++) {
      slides[j].classList.toggle('active', j === current);
    }
    clearAllFocus();
    counterEl.textContent = (current + 1) + ' / ' + window.SLIDES.length;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === window.SLIDES.length - 1;
  }

  function goto(i) {
    show(i);
    if (history.replaceState) {
      history.replaceState(null, '', '#' + (current + 1));
    }
  }

  function initialIndex() {
    var m = /#(\d+)/.exec(location.hash);
    return m ? Math.max(0, parseInt(m[1], 10) - 1) : 0;
  }

  function fit() {
    var W = 2816;
    /* En pantalla completa el marco crece 160px (la banda del pie
       institucional, 720 -> 800), así que el área de proyección también. */
    var H = document.body.classList.contains('is-fullscreen-presentation') ? 1600 : 1440;
    var stage = document.getElementById('stage');
    var stageStyle = window.getComputedStyle(stage);
    var width = Math.max(0, stage.clientWidth - (parseFloat(stageStyle.paddingLeft) || 0) - (parseFloat(stageStyle.paddingRight) || 0));
    var height = Math.max(0, stage.clientHeight - (parseFloat(stageStyle.paddingTop) || 0) - (parseFloat(stageStyle.paddingBottom) || 0));
    var s = Math.min(width / W, height / H);
    frame.style.transform = 'scale(' + s + ')';
    wrap.style.width = (W * s) + 'px';
    wrap.style.height = (H * s) + 'px';
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen().catch(function () {});
      return;
    }
    if (document.body.classList.contains('is-fullscreen-presentation')) {
      document.body.classList.remove('is-fullscreen-presentation');
      fsBtn.innerHTML = window.Icons.svg('expand', 18);
      fit();
      return;
    }
    document.body.classList.add('is-fullscreen-presentation');
    fsBtn.innerHTML = window.Icons.svg('compress', 18);
    fit();
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(function(){
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(function(){});
          }
        });
      }
    } catch (e) {}
  }

  /* Foco por clic: bloques 1-2 y ramas del mapa (slide 5), bloques 1-3 (slide 6),
     la Fase 3 (slide 7: bloques NE, NP, NC, NR y NI, que abren el
     cuadro de ER.docx que les corresponde, y la Fotografía 1, que aloja la
     aplicación web de evaluación), la secuencia de resultados de la prueba
     piloto (slide 8: seis pasos que abren su gráfico, tabla o figura, y un
     segundo clic sobre la imagen la proyecta a máximo tamaño) y el bloque
     «Marco histórico» del slide 4, que en reposo solo enseña los años y al
     ampliarlo se centra con todo su contenido. */
  var FOCUS_SCOPES = [
    { sel: 'md-body', cls: 'md-body--f', keys: ['1', '2', 'lt', 'lb', 'rt', 'rb', 'cb'] },
    { sel: 'rs-body', cls: 'rs-body--f', keys: ['1', '1a', '1b', '2', '3', '2a', '2b', '3a', '3b', '3aimg', '3bimg'], parents: { '3aimg': '3a', '3bimg': '3b' } },
    { sel: 'rs2-body', cls: 'rs2-body--f', keys: ['ne', 'np', 'nc', 'nr', 'ni', 'f1'] },
    { sel: 'rs3-body', cls: 'rs3-body--f',
      keys: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p1i', 'p2i', 'p3i', 'p4i', 'p5i', 'p6i'],
      parents: { p1i: 'p1', p2i: 'p2', p3i: 'p3', p4i: 'p4', p5i: 'p5', p6i: 'p6' } },
    { sel: 'ept-body', cls: 'ept-body--f',
      keys: ['1', '2', '2img', '3', 'rs'] },
    { sel: 'vl-body', cls: 'vl-body--f',
      keys: ['r1', 'r2', 'r3', 'rn'] },
    { sel: 'cn-body', cls: 'cn-body--f',
      keys: ['zb1', 'zb2', 'zb3', 'zb4', 'zb5', 'zb6', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6'],
      parents: { b1: 'zb1', b2: 'zb2', b3: 'zb3', b4: 'zb4', b5: 'zb5', b6: 'zb6' } },
    { sel: 'rc-body', cls: 'rc-body--f',
      keys: ['rc1', 'rc2', 'rc3', 'rc4', 'rc5', 'rc6'] },
    { sel: 'problem-body', cls: 'problem-body--f',
      keys: ['ev', 'jf', 'p4', 'q7'] },
    { sel: 'th-body', cls: 'th-body--f',
      keys: ['hist', 'apl', 'leg', 'ctx', 'teo'] }
  ];

  /* Niveles anidados: al cerrar un nivel con `parents[key]`, se vuelve a ese
     nivel (p. ej. 3aimg -> 3a) en vez de a la pantalla inicial. */
  function parentOf(key, def) {
    return (def.parents || {})[key] || null;
  }

  function activeSlide() {
    return frame.querySelector('.slide.active');
  }

  function scopeOf(target) {
    if (!target || !target.closest) return null;
    for (var i = 0; i < FOCUS_SCOPES.length; i++) {
      var el = target.closest('.' + FOCUS_SCOPES[i].sel);
      if (el) return { el: el, def: FOCUS_SCOPES[i] };
    }
    return null;
  }

  /* Sombra de la pantalla original: clona el layout en reposo y lo muestra
     atenuado detrás del bloque ampliado. */
  var GHOST_CFG = {
    'md-body': { nodes: ['.md-top', '.md-panel--mapa'], pad: '6px 20px 12px', gap: '8px' },
    'rs-body': { nodes: ['.rs-cols'], pad: '4px 20px 12px', gap: '8px' },
    'rs2-body': { nodes: ['.rs2-cols'], pad: '4px 20px 12px', gap: '8px' },
    'rs3-body': { nodes: ['.rs3-cols'], pad: '4px 20px 12px', gap: '8px' },
    'ept-body': { nodes: ['.ept-logica', '.ept-central', '.ept-result', '.ept-rc'], pad: '6px 22px 8px', gap: '7px' },
    'vl-body': { nodes: ['.vl-map', '.vl-synth'], pad: '6px 22px 8px', gap: '8px' },
    'cn-body': { nodes: ['.cn-flow', '.cn-strata', '.cn-node-row', '.cn-aporte'], pad: '6px 22px 8px', gap: '6px' },
    'rc-body': { nodes: ['.rc-cols', '.rc-flow'], pad: '6px 18px 8px', gap: '8px' },
    'problem-body': { nodes: ['.ev-column', '.flow', '.just-column'], pad: '10px 22px 16px', gap: '16px', dir: 'row' },
    'th-body': { nodes: ['.th-intro', '.th-grid'], pad: '0 18px 4px', gap: '0px' }
  };

  function ghostSlide(el) {
    /* El ghost va siempre en la lámina que contiene el scope, no en la que
       esté activa: si no, un foco creado sobre una lámina oculta clona su
       contenido dentro de la lámina visible. */
    if (el && el.closest) {
      var own = el.closest('.slide');
      if (own) return own;
    }
    return activeSlide();
  }

  function buildGhost(el, def) {
    var slide = ghostSlide(el);
    if (!slide) return;
    var ghost = document.createElement('div');
    ghost.className = 'scope-ghost';
    ghost.setAttribute('aria-hidden', 'true');
    if ('inert' in ghost) { ghost.inert = true; }
    var cfg = GHOST_CFG[def.sel];
    var inner = document.createElement('div');
    inner.className = 'scope-ghost-inner';
    inner.style.padding = cfg.pad;
    inner.style.gap = cfg.gap;
    if (cfg.dir) { inner.style.flexDirection = cfg.dir; }
    cfg.nodes.forEach(function (sel) {
      var node = el.querySelector(sel);
      if (!node) return;
      var copy = node.cloneNode(true);
      copy.removeAttribute('id');
      copy.querySelectorAll('[id]').forEach(function (x) { x.removeAttribute('id'); });
      copy.querySelectorAll('[tabindex]').forEach(function (x) { x.removeAttribute('tabindex'); });
      copy.querySelectorAll('button').forEach(function (b) { b.setAttribute('tabindex', '-1'); });
      inner.appendChild(copy);
    });
    ghost.appendChild(inner);
    var off = el.offsetLeft;
    ghost.style.left = off + 'px';
    ghost.style.top = el.offsetTop + 'px';
    ghost.style.width = el.offsetWidth + 'px';
    ghost.style.height = el.offsetHeight + 'px';
    slide.appendChild(ghost);
  }

  function showGhost(el, def) {
    var slide = ghostSlide(el);
    if (!slide) return;
    var ghost = slide.querySelector('.scope-ghost');
    if (!ghost) { buildGhost(el, def); ghost = slide.querySelector('.scope-ghost'); }
    if (ghost) { ghost.classList.add('is-on'); }
  }

  function hideGhost(el) {
    var slide = ghostSlide(el);
    if (!slide) return;
    var ghost = slide.querySelector('.scope-ghost');
    if (ghost) { slide.removeChild(ghost); }
  }

  function setScopeFocus(el, def, key) {
    if (!el || !def) return;
    hideGhost(el);
    def.keys.forEach(function (k) { el.classList.remove(def.cls + k); });
    if (key) {
      el.classList.add(def.cls + key);
      el.setAttribute('data-focus', key);
      showGhost(el, def);
    } else {
      el.removeAttribute('data-focus');
    }
    /* Aviso a la lámina de qué foco quedó abierto (o ninguno), para que cada
       bloque pueda montar y desmontar lo que necesite. Se lanza al final, con
       el ghost ya construido, para que la copia atenuada salga sin el iframe.
       `bubbles` para que lo escuche quien esté en `document`, no solo el
       propio scope. */
    el.dispatchEvent(new CustomEvent('slide:focus', {
      detail: { key: key || '', scope: def.sel }, bubbles: true
    }));
  }

  function clearAllFocus() {
    var slide = activeSlide();
    if (!slide) return;
    FOCUS_SCOPES.forEach(function (def) {
      var el = slide.querySelector('.' + def.sel);
      if (el) setScopeFocus(el, def, '');
    });
  }

  function currentFocus() {
    var slide = activeSlide();
    if (!slide) return null;
    for (var i = 0; i < FOCUS_SCOPES.length; i++) {
      var el = slide.querySelector('.' + FOCUS_SCOPES[i].sel);
      if (el && el.getAttribute('data-focus')) {
        return { el: el, def: FOCUS_SCOPES[i], key: el.getAttribute('data-focus') };
      }
    }
    return null;
  }

  function toggleFocus(target) {
    var found = scopeOf(target);
    if (!found) return false;
    var key = target.getAttribute('data-focus');
    if (!key) return false;
    var was = found.el.getAttribute('data-focus') === key;
    clearAllFocus();
    if (was) {
      var p = parentOf(key, found.def);
      if (p) setScopeFocus(found.el, found.def, p);
    } else {
      setScopeFocus(found.el, found.def, key);
    }
    return true;
  }

  /* Cierra el foco actual; si es un nivel anidado, vuelve a su nivel padre. */
  function closeOrStep() {
    var cf = currentFocus();
    if (!cf) return;
    var p = parentOf(cf.key, cf.def);
    if (p) setScopeFocus(cf.el, cf.def, p);
    else clearAllFocus();
  }

  function onFrameClick(e) {
    var found = scopeOf(e.target);
    if (!found) {
      closeOrStep();
      return;
    }
    var item = e.target.closest('[data-focus]');
    if (!item || item === found.el) {
      closeOrStep();
      return;
    }
    toggleFocus(item);
  }

  function onKey(e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); goto(current + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goto(current - 1); }
    else if (e.key === 'Home') { e.preventDefault(); goto(0); }
    else if (e.key === 'End') { e.preventDefault(); goto(window.SLIDES.length - 1); }
    else if (e.key === 'Escape') {
      var cf = currentFocus();
      if (cf) { e.preventDefault(); closeOrStep(); }
    } else if (e.key === 'Enter' || e.key === ' ') {
      var active = document.activeElement;
      var slideEl = activeSlide();
      /* Solo se activa lo que pertenece a la lámina visible: el foco del
         teclado puede quedarse en una lámina ya oculta al cambiar de diapositiva. */
      if (active && active.getAttribute && active.getAttribute('data-focus') &&
        slideEl && slideEl.contains(active)) {
        e.preventDefault();
        toggleFocus(active);
      }
    }
  }

  function onFullscreen() {
    document.body.classList.toggle('is-fullscreen-presentation', !!document.fullscreenElement);
    fsBtn.innerHTML = window.Icons.svg(document.fullscreenElement ? 'compress' : 'expand', 18);
    fit();
  }

  function init() {
    buildTabs();
    buildSlides();
    show(initialIndex());
    fit();
    prevBtn.addEventListener('click', function () { goto(current - 1); });
    nextBtn.addEventListener('click', function () { goto(current + 1); });
    fsBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('keydown', onKey);
    frame.addEventListener('click', onFrameClick);
    document.addEventListener('fullscreenchange', function(){
    if (!document.fullscreenElement) {
      document.body.classList.remove('is-fullscreen-presentation');
      fit();
    } else {
      document.body.classList.add('is-fullscreen-presentation');
      fit();
    }
  });
  window.addEventListener('resize', fit);
    document.addEventListener('fullscreenchange', onFullscreen);
  }

  document.addEventListener('DOMContentLoaded', init);
})();

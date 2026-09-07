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
      return fn ? fn(window.THESIS, window.PROBLEMA) : '<section class="slide"><div style="padding:40px">Sin contenido</div></section>';
    }).join('');
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
    var H = 1440;
    var stage = document.getElementById('stage');
    var s = Math.min(stage.clientWidth / W, stage.clientHeight / H);
    frame.style.transform = 'scale(' + s + ')';
    wrap.style.width = (W * s) + 'px';
    wrap.style.height = (H * s) + 'px';
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }

  function onKey(e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); goto(current + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goto(current - 1); }
    else if (e.key === 'Home') { e.preventDefault(); goto(0); }
    else if (e.key === 'End') { e.preventDefault(); goto(window.SLIDES.length - 1); }
  }

  function onFullscreen() {
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
    window.addEventListener('resize', fit);
    document.addEventListener('fullscreenchange', onFullscreen);
  }

  document.addEventListener('DOMContentLoaded', init);
})();

(function () {
  window.slideRenderers = window.slideRenderers || {};

  window.slideRenderers.objetivos = function (thesis, p, o) {
    var generalBlock = '<div class="og-block">' +
      '<div class="og-head">' +
        '<span class="og-icon">' + window.Icons.svg(o.generalIcon, 17) + '</span>' +
        '<span>' + o.generalHeader + '</span>' +
      '</div>' +
      '<div class="og-text">' + o.general + '</div>' +
    '</div>';

    var downConnector = '<div class="og-connector">' + window.Icons.svg('downArrow', 26) + '</div>';

    var specificLabel = '<div class="oe-label">' + o.specificHeader + '</div>';

    var cells = o.specific.map(function (s, i) {
      var red = i === 1 || i === 2;
      return '<div class="oe-card oe-card--' + (red ? 'r' : 'g') + '">' +
        '<div class="oe-meta">' +
          '<span class="oe-num">' + s.num + '</span>' +
          '<span class="oe-main">' + s.main + '</span>' +
        '</div>' +
        '<div class="oe-sub">' + s.sub + '</div>' +
      '</div>';
    });

    var arrowR = '<div class="oe-arrow-h">' + window.Icons.svg('chevRight', 22) + '</div>';
    var arrowV = '<div class="oe-arrow-v">' + window.Icons.svg('downArrow', 30) + '</div>';

    var specificGrid = '<div class="oe-grid">' +
      cells[0] + arrowR + cells[1] +
      '<span></span>' + arrowV + '<span></span>' +
      cells[2] + arrowR + cells[3] +
    '</div>';

    var photoTiles = o.photos.map(function (f) {
      return '<div class="photo">' +
        (f.src ? '<img class="photo-img" src="' + f.src + '" alt="Fotografía">' : '') +
      '</div>';
    }).join('');

    var photoRow = '<div class="photo-tiles">' + photoTiles + '</div>';

    var hypAspectItems = o.hypothesisAspects.map(function (a, i) {
      var red = i === 1;
      return '<div class="hyp-aspect' + (red ? ' hyp-aspect--red' : '') + '">' +
        '<span class="hyp-num">' + (i + 1) + '</span>' +
        '<div class="hyp-aspect-text">' +
          '<span class="hyp-aspect-main">' + a.main + '</span>' +
          (a.sub ? '<span class="hyp-aspect-sub"> · ' + a.sub + '</span>' : '') +
        '</div>' +
      '</div>';
    }).join('');

    var hypBlock = '<div class="r-card hyp-card">' +
      '<div class="r-head hyp-head">' +
        '<span class="r-head-icon">' + window.Icons.svg(o.hypothesisIcon, 16) + '</span>' +
        '<span>' + o.hypothesisHeader + '</span>' +
      '</div>' +
      '<div class="hyp-body">' +
        '<div class="hyp-intro">' + o.hypothesisIntro + '</div>' +
        '<div class="hyp-aspects">' + hypAspectItems + '</div>' +
      '</div>' +
    '</div>';

    var alcItems = o.alcances.map(function (a) {
      return '<div class="alc-item">' +
        '<span class="alc-num">' + a.num + '</span>' +
        '<div class="alc-content">' +
          '<span class="alc-title">' + a.title + '</span> ' +
          '<span class="alc-text">' + a.text + '</span>' +
        '</div>' +
      '</div>';
    }).join('');

    var alcBlock = '<div class="r-card alc-card">' +
      '<div class="r-head alc-head">' + o.alcanceHeader + '</div>' +
      '<div class="alc-list">' + alcItems + '</div>' +
    '</div>';

    var delimBlock = '<div class="r-card delim-card">' +
      '<div class="delim-head">' +
        '<span class="delim-icon">' + window.Icons.svg(o.delimitationIcon, 14) + '</span>' +
        '<span>' + o.delimitationHeader + '</span>' +
      '</div>' +
      '<div class="delim-text">' + o.delimitation + '</div>' +
    '</div>';

    var html = '<section class="slide slide-objectives" data-slide="3">' +
      '<div class="slide-head"><h2>' + o.title + '</h2></div>' +
      '<div class="obj-body">' +
        '<div class="obj-main">' +
          generalBlock +
          downConnector +
          specificLabel +
          specificGrid +
          photoRow +
        '</div>' +
        '<div class="obj-side">' +
          hypBlock +
          '<div class="obj-side-row">' +
            alcBlock +
            delimBlock +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';
    setTimeout(function(){
      try{
        var slide = document.querySelector('.slide.slide-objectives.active') || document.querySelector('.slide.slide-objectives');
        if(!slide) return;
        var body = slide.querySelector('.obj-body');
        if(!body) return;
        var photos = body.querySelectorAll('.photo');
        photos.forEach(function(p){
          p.setAttribute('role','button');
          p.tabIndex = 0;
          p.setAttribute('aria-label','Ampliar fotografías');
        });
        function closePhotos(){
          body.classList.remove('obj-body--fphoto');
          photos.forEach(function(x){x.removeAttribute('data-focus');});
        }
        function togglePhoto(e){
          if(body.classList.contains('obj-body--fphoto')){
            closePhotos();
          }else{
            body.classList.add('obj-body--fphoto');
            photos.forEach(function(x){x.setAttribute('data-focus','photo');});
          }
          e.stopPropagation();
        }
        photos.forEach(function(p){
          p.setAttribute('role','button');
          p.tabIndex = 0;
          p.setAttribute('aria-label','Ampliar fotografías');
          p.addEventListener('click', togglePhoto);
          p.addEventListener('keydown', function(e){
            if(e.key === 'Enter' || e.key === ' '){
              e.preventDefault();
              togglePhoto(e);
            }
          });
        });
        document.addEventListener('click', function(e){
          if(!slide.classList.contains('active')) return;
          if(body.classList.contains('obj-body--fphoto') && !e.target.closest('.photo')){
            closePhotos();
          }
        });
        document.addEventListener('keydown', function(e){
          if(e.key === 'Escape'){
            if(slide.classList.contains('active') && body.classList.contains('obj-body--fphoto')){
              closePhotos();
            }
          }
        });
      }catch(err){}
    }, 0);
    return html;
  };
})();
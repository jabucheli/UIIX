(function () {
  window.JustificationCard = {
    render: function (j) {
      return '<div class="just-card just-card--' + j.color + '">' +
        '<div class="just-card-icon ' + j.color + '">' + window.Icons.svg(j.icon, 20) + '</div>' +
        '<div class="just-card-text">' +
          '<div class="just-card-title">' + j.title + '</div>' +
          '<div class="just-card-body">' + j.body +
            (j.extra ? '<span class="just-card-extra">' + j.extra + '</span>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
    }
  };
})();

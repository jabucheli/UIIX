(function () {
  window.JustificationCard = {
    render: function (j) {
      return '<div class="just-card just-card--' + j.color + '">' +
        '<div class="just-card-icon ' + j.color + '">' + window.Icons.svg(j.icon, 20) + '</div>' +
        '<div class="just-card-text">' +
          '<div class="just-card-title">' + j.title + '</div>' +
          '<div class="just-card-body">' + j.body + '</div>' +
        '</div>' +
      '</div>';
    }
  };
})();

(function () {
  var paths = {
    building: '<path d="M3 21h18"/><path d="M5 21V8l7-4.5V21"/><path d="M12 21V11h7v10"/><path d="M7 11h2M7 15h2M7 19h2"/>',
    hardhat: '<path d="M3 15a9 9 0 0 1 18 0"/><path d="M2 15h20v3.2H2z"/><path d="M7 21.5h10"/>',
    clipboard: '<rect x="5" y="4.5" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5"/><path d="M9 11h6M9 14.5h6M9 18h4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    trend: '<path d="M3 17l6-6 4 4 8-9"/><path d="M15.5 6H21v5.5"/>',
    balance: '<path d="M12 3.5v17"/><path d="M5.5 7h13"/><path d="M7.5 20.5h9"/><path d="M8.2 7L5 13h6.4z"/><path d="M15.8 7L12.6 13H19z"/>',
    flag: '<path d="M6 21V3.5"/><path d="M6 4h11l-3 4.2 3 4.3H6"/>',
    book: '<path d="M4.5 5A2.5 2.5 0 0 1 7 2.5h12.5V20H7A2.5 2.5 0 0 0 4.5 22.5z"/><path d="M4.5 20V5"/>',
    wrench: '<path d="M14.8 6.6a4.2 4.2 0 0 0-5.5 5.1L4.5 16.5v3h3l4.8-4.8a4.2 4.2 0 0 0 5.1-5.5l-3 3-3-3z"/>',
    users: '<circle cx="9" cy="8" r="4"/><path d="M2.5 21c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"/><path d="M16 4.8a4 4 0 0 1 0 6.4"/><path d="M18.5 15.2c1.9.9 3 2.6 3 5.8"/>',
    user: '<circle cx="12" cy="8.2" r="3.8"/><path d="M4.5 20.5c.6-4 3.6-6 7.5-6s6.9 2 7.5 6"/>',
    chevLeft: '<path d="M14.5 5.5L8 12l6.5 6.5"/>',
    chevRight: '<path d="M9.5 5.5L16 12l-6.5 6.5"/>',
    downArrow: '<path d="M4 8l8 8 8-8"/>',
    expand: '<path d="M8 3.5H3.5V8M16 3.5h4.5V8M8 20.5H3.5V16M16 20.5h4.5V16"/>',
    compress: '<path d="M8 8V3.5M8 8H3.5M16 8V3.5M16 8h4.5M8 16V20.5M8 16H3.5M16 16v4.5M16 16h4.5"/>'
  };

  function svg(name, size, cls) {
    var s = size || 24;
    var c = cls || 'icon';
    return '<svg class="' + c + '" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || '') + '</svg>';
  }

  function emblem(size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 48 48" aria-hidden="true">' +
      '<circle cx="24" cy="24" r="22.5" fill="#006E49"/>' +
      '<circle cx="24" cy="24" r="19" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="3 3" opacity="0.7"/>' +
      '<g stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
      '<path d="M14 27a10 10 0 0 1 20 0"/><path d="M12.5 27h23v4h-23z"/><path d="M17 34h14"/>' +
      '</g></svg>';
  }

  function donut(percent, size, color) {
    var s = size || 84;
    var sw = 12;
    var r = (s - sw) / 2;
    var c = 2 * Math.PI * r;
    var dash = percent / 100 * c;
    var gap = c - dash;
    var cx = s / 2;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 ' + s + ' ' + s + '" aria-hidden="true">' +
      '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="#eaeaea" stroke-width="' + sw + '"/>' +
      '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="' + sw + '" stroke-linecap="butt" stroke-dasharray="' + dash + ' ' + gap + '" transform="rotate(-90 ' + cx + ' ' + cx + ')"/>' +
      '</svg>';
  }

  window.Icons = { svg: svg, emblem: emblem, donut: donut };
})();

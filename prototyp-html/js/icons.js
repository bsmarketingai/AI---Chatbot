/* Ikony prototypu: tah 1.8, barva z currentColor. I('název', velikost). */
(function () {
  var s = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  var P = {
    spark: '<path d="M12 3c.4 3.6 2.4 5.6 6 6-3.6.4-5.6 2.4-6 6-.4-3.6-2.4-5.6-6-6 3.6-.4 5.6-2.4 6-6Z" fill="currentColor"/><path d="M19 14c.2 1.6 1 2.4 2.6 2.6-1.6.2-2.4 1-2.6 2.6-.2-1.6-1-2.4-2.6-2.6 1.6-.2 2.4-1 2.6-2.6Z" fill="currentColor"/><path d="M5 15.5c.15 1.2.8 1.85 2 2-1.2.15-1.85.8-2 2-.15-1.2-.8-1.85-2-2 1.2-.15 1.85-.8 2-2Z" fill="currentColor"/>',
    chat: '<path ' + s + ' d="M20 12.5a7.5 7.5 0 0 1-11.1 6.6L4 20l1-4.3A7.5 7.5 0 1 1 20 12.5Z"/><path d="M12.5 8.5c.2 1.6 1 2.4 2.6 2.6-1.6.2-2.4 1-2.6 2.6-.2-1.6-1-2.4-2.6-2.6 1.6-.2 2.4-1 2.6-2.6Z" fill="currentColor"/>',
    search: '<circle ' + s + ' cx="10.5" cy="10.5" r="6.5"/><path ' + s + ' d="m15.5 15.5 5 5"/>',
    user: '<circle ' + s + ' cx="12" cy="8" r="4"/><path ' + s + ' d="M4 21c.8-4 4-6 8-6s7.2 2 8 6"/>',
    cart: '<path ' + s + ' d="M4 8h16l-1.3 11.2a2 2 0 0 1-2 1.8H7.3a2 2 0 0 1-2-1.8L4 8Z"/><path ' + s + ' d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8"/>',
    menu: '<path ' + s + ' d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path ' + s + ' d="M6 6l12 12M18 6 6 18"/>',
    newchat: '<path ' + s + ' d="M12 5H6.5A2.5 2.5 0 0 0 4 7.5v9A2.5 2.5 0 0 0 6.5 19H8v3l4-3h5.5a2.5 2.5 0 0 0 2.5-2.5V12"/><path ' + s + ' d="M18 3v6M15 6h6"/>',
    expand: '<path ' + s + ' d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>',
    shrink: '<path ' + s + ' d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/>',
    check: '<path ' + s + ' d="m5 12.5 4.5 4.5L19 7.5"/>',
    bell: '<path ' + s + ' d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z"/><path ' + s + ' d="M10 20.5a2 2 0 0 0 4 0"/>',
    x: '<path ' + s + ' d="M7 7l10 10M17 7 7 17"/>',
    up: '<path ' + s + ' d="M7 11v9H4v-9h3Zm0 0 4-7c1.5 0 2.5 1 2.2 2.5L12.6 10H18a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7"/>',
    down: '<path ' + s + ' d="M7 13V4H4v9h3Zm0 0 4 7c1.5 0 2.5-1 2.2-2.5L12.6 14H18a2 2 0 0 0 2-2.3l-1.2-6A2 2 0 0 0 16.8 4H7"/>',
    copy: '<rect ' + s + ' x="8" y="8" width="12" height="12" rx="2"/><path ' + s + ' d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    back: '<path ' + s + ' d="M19 12H5m6-6-6 6 6 6"/>',
    send: '<path ' + s + ' d="M12 19V5m-6 6 6-6 6 6"/>',
    stop: '<rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/>',
    phone: '<rect ' + s + ' x="7" y="3" width="10" height="18" rx="2.5"/><path ' + s + ' d="M11 18h2"/>',
    headset: '<path ' + s + ' d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect ' + s + ' x="3" y="13" width="4" height="6" rx="1.5"/><rect ' + s + ' x="17" y="13" width="4" height="6" rx="1.5"/><path ' + s + ' d="M19 19c0 1.5-1.5 2.5-4 2.5h-2"/>',
    box: '<path ' + s + ' d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z"/><path ' + s + ' d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>',
    tool: '<path ' + s + ' d="M14.5 6.5a4 4 0 0 0 5 5l-8.5 8.5a2.1 2.1 0 0 1-3-3l8.5-8.5a4 4 0 0 0-2-2Z"/>',
    laptop: '<rect ' + s + ' x="5" y="5" width="14" height="10" rx="1.5"/><path ' + s + ' d="M3 18.5h18"/>',
    gift: '<rect ' + s + ' x="4" y="9" width="16" height="11" rx="1.5"/><path ' + s + ' d="M3 9h18M12 9v11M12 9c-2-4-6-4-6-1.5S9 9 12 9Zm0 0c2-4 6-4 6-1.5S15 9 12 9Z"/>',
    battery: '<rect ' + s + ' x="3" y="7" width="16" height="10" rx="2"/><path ' + s + ' d="M21 10.5v3M7 10v4M10.5 10v4"/>',
    info: '<circle ' + s + ' cx="12" cy="12" r="9"/><path ' + s + ' d="M12 11v5M12 7.5v.5"/>',
    alert: '<path ' + s + ' d="M12 3.5 21.5 20h-19L12 3.5Z"/><path ' + s + ' d="M12 10v4.5M12 17v.5"/>',
    refresh: '<path ' + s + ' d="M20 11a8 8 0 0 0-14.6-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5L20 16M20 20v-4h-4"/>',
    compare: '<rect ' + s + ' x="3.5" y="5" width="7" height="14" rx="1.5"/><rect ' + s + ' x="13.5" y="5" width="7" height="14" rx="1.5"/>',
    history: '<path ' + s + ' d="M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5"/><path ' + s + ' d="M3.5 4v4.5H8M12 7.5V12l3 2"/>',
    trash: '<path ' + s + ' d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5"/>',
    lock: '<rect ' + s + ' x="5" y="10.5" width="14" height="10" rx="2"/><path ' + s + ' d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'
  };
  window.I = function (name, size, label) {
    size = size || 20;
    var a = label ? ' role="img" aria-label="' + label + '"' : ' aria-hidden="true"';
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24"' + a + '>' + (P[name] || P.info) + '</svg>';
  };
})();

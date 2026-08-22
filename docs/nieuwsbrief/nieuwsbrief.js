/* ============================================
   Tagfilter voor het nieuwsbriefarchief
   ============================================ */
(function () {
  'use strict';

  var knoppen = document.querySelectorAll('.nb-filter');
  var items = document.querySelectorAll('.nb-item');
  var leeg = document.getElementById('nbEmpty');

  if (!knoppen.length || !items.length) return;

  function filter(tag) {
    var zichtbaar = 0;

    items.forEach(function (item) {
      var tags = (item.getAttribute('data-tags') || '').split(' ');
      var toon = tag === 'alles' || tags.indexOf(tag) !== -1;
      item.hidden = !toon;
      if (toon) zichtbaar++;
    });

    if (leeg) leeg.hidden = zichtbaar > 0;
  }

  knoppen.forEach(function (knop) {
    knop.addEventListener('click', function () {
      knoppen.forEach(function (k) {
        var actief = k === knop;
        k.classList.toggle('nb-filter--on', actief);
        k.setAttribute('aria-pressed', actief ? 'true' : 'false');
      });
      filter(knop.getAttribute('data-tag'));
    });
  });
})();

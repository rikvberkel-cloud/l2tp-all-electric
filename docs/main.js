/* ============================================
   R-010 — main.js
   ============================================ */

(function () {
  'use strict';

  /* JavaScript draait, dus animaties mogen aan. Zonder deze klasse blijft
     alle inhoud gewoon zichtbaar in plaats van op opacity 0 te hangen. */
  document.documentElement.classList.add('js');

  /* ------------------------------------------
     1. CURSOR GLOW (desktop only)
     ------------------------------------------ */
  var cursorGlow = document.getElementById('cursorGlow');
  var isTouch = window.matchMedia('(hover: none)').matches;

  if (cursorGlow && !isTouch) {
    var glowX = 0, glowY = 0, currentX = 0, currentY = 0;
    var glowActive = false;

    document.addEventListener('mousemove', function (e) {
      glowX = e.clientX;
      glowY = e.clientY;
      if (!glowActive) {
        glowActive = true;
        cursorGlow.classList.add('cursor-glow--visible');
        updateGlow();
      }
    });

    document.addEventListener('mouseleave', function () {
      glowActive = false;
      cursorGlow.classList.remove('cursor-glow--visible');
    });

    function updateGlow() {
      if (!glowActive) return;
      currentX += (glowX - currentX) * 0.15;
      currentY += (glowY - currentY) * 0.15;
      cursorGlow.style.transform = 'translate(' + (currentX - 160) + 'px,' + (currentY - 160) + 'px)';
      requestAnimationFrame(updateGlow);
    }
  }

  /* ------------------------------------------
     2. PARALLAX SCROLLING
     ------------------------------------------ */
  var parallaxSections = document.querySelectorAll('[data-parallax]');

  if (parallaxSections.length > 0 && !isTouch) {
    var ticking = false;

    function updateParallax() {
      var scrollY = window.scrollY;
      parallaxSections.forEach(function (section) {
        var speed = parseFloat(section.getAttribute('data-parallax'));
        var rect = section.getBoundingClientRect();
        var offset = (scrollY - section.offsetTop) * speed;
        var content = section.querySelector('.hero__content, .container');
        if (content) {
          content.style.transform = 'translateY(' + offset + 'px)';
        }
      });
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ------------------------------------------
     3. SKILL TREE SCROLL ANIMATION
     ------------------------------------------ */
  var skillTree = document.querySelector('.skill-tree--animate');

  if (skillTree && 'IntersectionObserver' in window) {
    var skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('skill-tree--visible');
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    skillObserver.observe(skillTree);
  } else if (skillTree) {
    skillTree.classList.add('skill-tree--visible');
  }

  /* ------------------------------------------
     4. FADE-IN ON SCROLL (IntersectionObserver)
     ------------------------------------------ */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('fade-in--visible');
    });
  }

  /* ------------------------------------------
     5. SCROLL-SPY (actieve nav-link markeren)
     ------------------------------------------ */
  var navLinks = document.querySelectorAll('.site-nav__link');

  if (navLinks.length && 'IntersectionObserver' in window) {
    var spyTargets = [];
    navLinks.forEach(function (link) {
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) spyTargets.push(target);
    });

    function setActive(id) {
      navLinks.forEach(function (link) {
        link.classList.toggle('site-nav__link--active', link.getAttribute('href') === '#' + id);
      });
    }

    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    spyTargets.forEach(function (t) { spyObserver.observe(t); });
  }

  /* ------------------------------------------
     6. AGENDA TABBLADEN
     ------------------------------------------ */
  var agendaTabs = document.querySelectorAll('.agenda-tab');

  if (agendaTabs.length) {
    var tabsArray = Array.prototype.slice.call(agendaTabs);

    function activeerTab(tab, verplaatsFocus) {
      var doel = tab.getAttribute('data-paneel');

      tabsArray.forEach(function (t) {
        var actief = t === tab;
        t.classList.toggle('agenda-tab--on', actief);
        t.setAttribute('aria-selected', actief ? 'true' : 'false');
        t.tabIndex = actief ? 0 : -1;
      });

      document.querySelectorAll('.agenda-paneel').forEach(function (paneel) {
        paneel.hidden = paneel.id !== 'paneel-' + doel;
      });

      if (verplaatsFocus) tab.focus();
    }

    tabsArray.forEach(function (tab, index) {
      /* Roving tabindex: alleen de actieve tab is met Tab bereikbaar,
         binnen de tablist navigeer je met de pijltjestoetsen. */
      tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;

      tab.addEventListener('click', function () {
        activeerTab(tab, false);
      });

      tab.addEventListener('keydown', function (e) {
        var nieuw = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          nieuw = tabsArray[(index + 1) % tabsArray.length];
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          nieuw = tabsArray[(index - 1 + tabsArray.length) % tabsArray.length];
        } else if (e.key === 'Home') {
          nieuw = tabsArray[0];
        } else if (e.key === 'End') {
          nieuw = tabsArray[tabsArray.length - 1];
        }
        if (nieuw) {
          e.preventDefault();
          activeerTab(nieuw, true);
        }
      });
    });
  }
})();

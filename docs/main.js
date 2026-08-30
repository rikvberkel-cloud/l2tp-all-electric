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
      var href = link.getAttribute('href') || '';
      var hash = href.indexOf('#') === -1 ? '' : href.slice(href.indexOf('#') + 1);
      var target = hash ? document.getElementById(hash) : null;
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
    agendaTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var doel = tab.getAttribute('data-paneel');

        agendaTabs.forEach(function (t) {
          var actief = t === tab;
          t.classList.toggle('agenda-tab--on', actief);
          t.setAttribute('aria-selected', actief ? 'true' : 'false');
        });

        document.querySelectorAll('.agenda-paneel').forEach(function (paneel) {
          paneel.hidden = paneel.id !== 'paneel-' + doel;
        });
      });
    });
  }

  /* ------------------------------------------
     7. MOBIELE NAV
     ------------------------------------------ */
  var nav = document.getElementById('siteNav') || document.querySelector('.site-nav');
  var navToggle = document.getElementById('navToggle');
  var navLinksBox = document.getElementById('siteNavLinks');

  function setNavOpen(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.textContent = open ? 'Sluit' : 'Menu';
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      setNavOpen(!nav.classList.contains('is-open'));
    });
    if (navLinksBox) {
      navLinksBox.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setNavOpen(false); });
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNavOpen(false);
    });
  }

  /* ------------------------------------------
     8. SPOTIFY: desktop meteen, mobiel na tap
     ------------------------------------------ */
  var desktopSpotify = window.matchMedia('(min-width: 641px)').matches;

  function mountSpotify(box) {
    if (!box || box.classList.contains('spotify-embed--on')) return;
    var src = box.getAttribute('data-spotify');
    var title = box.getAttribute('data-title') || 'Spotify';
    if (!src) return;
    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.width = '100%';
    iframe.height = '152';
    iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
    iframe.setAttribute('loading', 'lazy');
    iframe.title = title;
    iframe.style.borderRadius = '12px';
    var playBtn = box.querySelector('.spotify-embed__play');
    if (playBtn) playBtn.remove();
    box.appendChild(iframe);
    box.classList.add('spotify-embed--on');
  }

  document.querySelectorAll('.spotify-embed[data-spotify]').forEach(function (box) {
    if (desktopSpotify) {
      mountSpotify(box);
      return;
    }
    var playBtn = box.querySelector('.spotify-embed__play');
    if (playBtn) {
      playBtn.addEventListener('click', function () { mountSpotify(box); });
    }
  });

  /* ------------------------------------------
     9. MAILERLITE (homepage uitstellen tot de brief)
     ------------------------------------------ */
  var mlReady = false;
  var mlQueue = [];

  function withMailerLite(cb) {
    if (typeof window.ml === 'function' && mlReady) {
      cb();
      return;
    }
    mlQueue.push(cb);
    loadMailerLite();
  }

  function loadMailerLite() {
    if (document.getElementById('mailerlite-universal')) {
      return;
    }
    window.ml = window.ml || function () {
      (window.ml.q = window.ml.q || []).push(arguments);
    };
    window.ml('account', '2547241');
    var s = document.createElement('script');
    s.id = 'mailerlite-universal';
    s.src = 'https://assets.mailerlite.com/js/universal.js';
    s.async = true;
    s.onload = function () {
      mlReady = true;
      mlQueue.splice(0).forEach(function (cb) { cb(); });
    };
    document.head.appendChild(s);
  }

  document.querySelectorAll('.js-ml-form').forEach(function (btn) {
    btn.addEventListener('click', function () {
      withMailerLite(function () { window.ml('show', '6erjz7', true); });
    });
  });

  var deferMl = document.body.getAttribute('data-ml') === 'defer';
  if (deferMl) {
    var nieuwsbrief = document.getElementById('nieuwsbrief');
    var mlKicked = false;
    function kickMl() {
      if (mlKicked) return;
      mlKicked = true;
      loadMailerLite();
    }
    setTimeout(kickMl, 8000);
    if (nieuwsbrief && 'IntersectionObserver' in window) {
      var mlObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            kickMl();
            mlObs.disconnect();
          }
        });
      }, { threshold: 0.2 });
      mlObs.observe(nieuwsbrief);
    }
  } else if (document.querySelector('.js-ml-form')) {
    loadMailerLite();
  }
})();

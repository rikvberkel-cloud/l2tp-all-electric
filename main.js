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

  var compactSpotify = window.matchMedia('(max-width: 640px)');

  function wireSpotify() {
    var compact = compactSpotify.matches;
    document.querySelectorAll('.spotify-embed[data-spotify]').forEach(function (box) {
      if (!compact) {
        mountSpotify(box);
        return;
      }
      var playBtn = box.querySelector('.spotify-embed__play');
      if (playBtn && !playBtn.getAttribute('data-wired')) {
        playBtn.setAttribute('data-wired', '1');
        playBtn.addEventListener('click', function () { mountSpotify(box); });
      }
    });
  }

  wireSpotify();
  if (compactSpotify.addEventListener) {
    compactSpotify.addEventListener('change', wireSpotify);
  }

  /* ------------------------------------------
     9. INSCHRIJVEN (MailerLite op de achtergrond)
     Eigen dialoog in de stijl van de site. MailerLite
     krijgt het adres; hun balk-popup laten we weg.
     ------------------------------------------ */
  var ML_SUBSCRIBE =
    'https://assets.mailerlite.com/public/2547241/forms/194497017347573083/subscribe?signature=f6aa086ab938e58cbe3d248ddd224ef897b1ab42f9d5f92619222a492d5cbe57';

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
      mlQueue.splice(0).forEach(function (fn) { fn(); });
    };
    document.head.appendChild(s);
  }

  function mlGuid() {
    var key = 'ml_guid';
    try {
      var existing = localStorage.getItem(key);
      if (existing) return existing;
      var fresh = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      localStorage.setItem(key, fresh);
      return fresh;
    } catch (e) {
      return String(Date.now());
    }
  }

  function buildSignup() {
    var root = document.createElement('div');
    root.className = 'signup';
    root.setAttribute('hidden', '');
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'signupTitle');
    root.innerHTML =
      '<div class="signup__backdrop" data-signup-close="1"></div>' +
      '<div class="signup__panel">' +
        '<button type="button" class="signup__close" data-signup-close="1" aria-label="Sluiten">&times;</button>' +
        '<p class="signup__kicker">all-electric</p>' +
        '<h2 class="signup__title" id="signupTitle">Late 2 The Party</h2>' +
        '<p class="signup__lead">Blijf op de hoogte, volg hoe het draaien vordert, en laat je inspireren. Plaatjes, nachtcultuur, kunst, mode en de rest. Eén mail per maand.</p>' +
        '<form class="signup__form" novalidate>' +
          '<label class="sr-only" for="signupEmail">E-mailadres</label>' +
          '<input class="signup__input" id="signupEmail" name="email" type="email" autocomplete="email" required placeholder="jouw@email.nl">' +
          '<button type="submit" class="btn btn--primary">Schrijf me in</button>' +
        '</form>' +
        '<p class="signup__status" role="status"></p>' +
        '<p class="newsletter__note">Bevestigen via de mail. Uitschrijven met één click.</p>' +
      '</div>';
    document.body.appendChild(root);
    return root;
  }

  var signupRoot = null;
  var signupOpener = null;

  function signupEls() {
    return {
      form: signupRoot.querySelector('.signup__form'),
      email: signupRoot.querySelector('#signupEmail'),
      status: signupRoot.querySelector('.signup__status'),
      submit: signupRoot.querySelector('.signup__form .btn')
    };
  }

  function setSignupStatus(kind, text) {
    var status = signupEls().status;
    status.className = 'signup__status' + (kind ? ' signup__status--' + kind : '');
    status.textContent = text;
  }

  function openSignup(opener) {
    if (!signupRoot) signupRoot = buildSignup();
    signupOpener = opener || null;
    signupRoot.removeAttribute('hidden');
    document.body.classList.add('signup-open');
    setSignupStatus('', '');
    signupEls().form.hidden = false;
    var email = signupEls().email;
    email.value = '';
    email.focus();
  }

  function closeSignup() {
    if (!signupRoot || signupRoot.hasAttribute('hidden')) return;
    signupRoot.setAttribute('hidden', '');
    document.body.classList.remove('signup-open');
    if (signupOpener && typeof signupOpener.focus === 'function') {
      signupOpener.focus();
    }
  }

  function fallbackToMailerLite() {
    closeSignup();
    withMailerLite(function () { window.ml('show', '6erjz7', true); });
  }

  function submitSignup(e) {
    e.preventDefault();
    var els = signupEls();
    var email = (els.email.value || '').trim();
    if (!els.email.checkValidity()) {
      setSignupStatus('err', 'Vul een geldig e-mailadres in.');
      els.email.focus();
      return;
    }
    els.submit.disabled = true;
    setSignupStatus('', 'Bezig…');

    var body = {};
    body['fields.email'] = email;
    body.guid = mlGuid();

    fetch(ML_SUBSCRIBE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().then(function (data) {
        return { ok: res.ok, data: data };
      }).catch(function () {
        return { ok: res.ok, data: {} };
      });
    }).then(function (result) {
      els.submit.disabled = false;
      if (!result.ok || result.data.success === false) {
        throw new Error('ml');
      }
      els.form.hidden = true;
      setSignupStatus('ok', 'Check je inbox. Er komt een bevestigingsmail.');
    }).catch(function () {
      els.submit.disabled = false;
      fallbackToMailerLite();
    });
  }

  if (document.querySelector('.js-ml-form')) {
    signupRoot = buildSignup();
    signupRoot.addEventListener('click', function (e) {
      if (e.target && e.target.getAttribute('data-signup-close')) closeSignup();
    });
    signupRoot.querySelector('.signup__form').addEventListener('submit', submitSignup);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSignup();
    });
    document.querySelectorAll('.js-ml-form').forEach(function (btn) {
      btn.addEventListener('click', function () { openSignup(btn); });
    });
  }
})();

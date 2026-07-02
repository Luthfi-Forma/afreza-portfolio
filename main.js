/* ============================================================
   Afreza Luthfi Hernanda — Portfolio interactions
   ============================================================ */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
    };
    toggle.addEventListener('click', function () {
      setMenu(menu.hidden);
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
  }

  /* ---------- Work filter ---------- */
  var filters = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('.work__grid .card');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      filters.forEach(function (f) {
        var active = f === btn;
        f.classList.toggle('is-active', active);
        f.setAttribute('aria-selected', String(active));
      });
      cards.forEach(function (card) {
        var cats = (card.getAttribute('data-cat') || '').split(' ');
        var show = cat === 'all' || cats.indexOf(cat) !== -1;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- Accordion ---------- */
  var items = document.querySelectorAll('.acc__item');
  var setPanel = function (item, open) {
    var head = item.querySelector('.acc__head');
    var panel = item.querySelector('.acc__panel');
    var inner = item.querySelector('.acc__panel-inner');
    item.classList.toggle('is-open', open);
    head.setAttribute('aria-expanded', String(open));
    panel.style.height = open ? inner.offsetHeight + 'px' : '0px';
  };
  items.forEach(function (item) {
    var head = item.querySelector('.acc__head');
    // initialise heights
    setPanel(item, item.classList.contains('is-open'));
    head.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      items.forEach(function (other) { if (other !== item) setPanel(other, false); });
      setPanel(item, !isOpen);
    });
  });
  // keep open panel sized correctly on resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      items.forEach(function (item) {
        if (item.classList.contains('is-open')) {
          var inner = item.querySelector('.acc__panel-inner');
          item.querySelector('.acc__panel').style.height = inner.offsetHeight + 'px';
        }
      });
    }, 150);
  });

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    '.about__grid, .work__grid .card, .accordion, .docs__row .doc, .xp, .contact__grid, .section-head'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Active nav link on scroll ---------- */
  var navLinks = document.querySelectorAll('.nav__links a');
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href');
    if (id && id.charAt(0) === '#') {
      var sec = document.querySelector(id);
      if (sec) sections.push({ link: link, sec: sec });
    }
  });
  if (sections.length && 'IntersectionObserver' in window) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var match = sections.find(function (s) { return s.sec === entry.target; });
          navLinks.forEach(function (l) { l.style.color = ''; });
          if (match) match.link.style.color = 'var(--forest)';
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navIo.observe(s.sec); });
  }
})();

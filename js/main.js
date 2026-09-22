/* ==========================================================================
   Kshitij Raj — Portfolio  ·  main.js
   Vanilla JS, no dependencies.
   ========================================================================== */
(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------------------------------------------------------------- Theme */
  const root   = document.documentElement;
  const toggle = $('#themeToggle');
  const STORE  = 'kr-theme';

  function readTheme() {
    try {
      const saved = localStorage.getItem(STORE);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) { /* storage blocked — fall through */ }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORE, theme); } catch (e) { /* ignore */ }
  }

  applyTheme(readTheme());

  if (toggle) {
    toggle.addEventListener('click', () => {
      applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
  }

  /* ------------------------------------------------------------ Mobile nav */
  const burger   = $('#burger');
  const navLinks = $('#navLinks');

  function closeNav() {
    if (!navLinks) return;
    navLinks.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('a', navLinks).forEach(a => a.addEventListener('click', closeNav));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  }

  /* ------------------------------------ Sticky nav, progress bar, back-top */
  const nav      = $('#nav');
  const progress = $('#scrollProgress');
  const toTop    = $('#toTop');
  const sections = $$('main section[id]');
  const navAs    = $$('#navLinks a[href^="#"]');
  let ticking = false;

  function onScroll() {
    const y      = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;

    if (nav) nav.classList.toggle('is-stuck', y > 12);
    if (progress) progress.style.width = (height > 0 ? (y / height) * 100 : 0) + '%';
    if (toTop) toTop.classList.toggle('is-visible', y > 600);

    // active nav link
    let current = '';
    const probe = y + window.innerHeight * 0.32;
    for (const sec of sections) {
      if (sec.offsetTop <= probe) current = sec.id;
    }
    navAs.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current));

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* --------------------------------------------------------- Scroll reveal */
  const revealEls = $$('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('is-in'), Number(delay));
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));

    // Failsafe: if the observer never fires (prerender, odd browser, tab never
    // composited), show everything rather than leaving the page blank.
    setTimeout(() => {
      if (!document.querySelector('.reveal.is-in')) {
        revealEls.forEach(el => el.classList.add('is-in'));
      }
    }, 2500);
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  /* --------------------------------------------------------- Count-up stats */
  const counters = $$('[data-count]');

  // The real number is already in the HTML. Animating is decoration, so it may
  // only ever replace the text with a value on its way to that same number —
  // never blank it, never leave it at 0.
  function countUp(el) {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || '';
    const dur    = 1400;
    const start  = performance.now();

    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(el => cio.observe(el));

    // Failsafe — if an animation was interrupted mid-flight, snap to the real
    // number. (With no JS at all the HTML already shows it.)
    setTimeout(() => {
      counters.forEach(el => {
        const want = el.dataset.count + (el.dataset.suffix || '');
        if (el.textContent.trim() !== want) el.textContent = want;
      });
    }, 3000);
  } else {
    counters.forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
  }

  /* -------------------------------------------------------- Typing effect */
  const typedEl = $('#typed');
  const ROLES = [
    'Java Full Stack Developer',
    'Spring Boot & REST API Developer',
    'React Frontend Developer',
    'Backend Engineer'
  ];

  if (typedEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let roleIdx = 0, charIdx = 0, deleting = false;

    (function type() {
      const word = ROLES[roleIdx];
      charIdx += deleting ? -1 : 1;
      typedEl.textContent = word.slice(0, charIdx);

      let wait = deleting ? 40 : 78;

      if (!deleting && charIdx === word.length) {
        deleting = true;
        wait = 1900;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % ROLES.length;
        wait = 420;
      }
      setTimeout(type, wait);
    })();
  } else if (typedEl) {
    typedEl.textContent = ROLES[0];
  }

  /* ------------------------------------------------- Project screenshots */
  $$('.shot-thumbs').forEach(strip => {
    const main = $('#' + strip.dataset.gallery);
    if (!main) return;

    strip.addEventListener('click', e => {
      const thumb = e.target.closest('.shot-thumb');
      if (!thumb || thumb.classList.contains('is-active')) return;

      main.src = thumb.dataset.src;
      main.alt = thumb.dataset.alt || '';
      $$('.shot-thumb', strip).forEach(t => t.classList.toggle('is-active', t === thumb));
    });
  });

  /* --------------------------------------------------------- Contact form */
  const form   = $('#contactForm');
  const status = $('#formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      const action = form.getAttribute('action') || '';

      // Formspree endpoint not configured yet → fall back to a mailto: draft.
      if (action.includes('YOUR_FORM_ID')) {
        e.preventDefault();
        const data    = new FormData(form);
        const subject = data.get('subject') || 'Portfolio enquiry';
        const body    =
          'Name: '  + (data.get('name')  || '') + '\n' +
          'Email: ' + (data.get('email') || '') + '\n\n' +
          (data.get('message') || '');

        window.location.href =
          'mailto:Kshitijraj22@gmail.com?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);

        if (status) {
          status.textContent = 'Opening your email app…';
          status.className = 'form__status ok';
        }
        return;
      }

      // Formspree configured → submit via fetch so the page never navigates away.
      e.preventDefault();
      const btn = $('button[type="submit"]', form);
      const label = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      if (status) { status.textContent = ''; status.className = 'form__status'; }

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          form.reset();
          if (status) {
            status.textContent = 'Thanks — your message is on its way. I’ll reply shortly.';
            status.className = 'form__status ok';
          }
        } else {
          throw new Error('Request failed with status ' + res.status);
        }
      } catch (err) {
        if (status) {
          status.textContent = 'Something went wrong. Please email Kshitijraj22@gmail.com directly.';
          status.className = 'form__status err';
        }
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = label; }
      }
    });
  }

  /* ------------------------------------------------------------- Footer yr */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------- TODO badge helper
     Type  todo()  in the browser console to highlight every placeholder
     that still needs a real link. Type it again to hide them.            */
  window.todo = function () {
    document.body.classList.toggle('show-todo');
    const on = document.body.classList.contains('show-todo');
    const n  = $$('[data-needs-link]').length;
    console.log(on ? `Highlighting ${n} placeholder(s) that still need real links.` : 'Placeholder badges hidden.');
    return on;
  };

})();

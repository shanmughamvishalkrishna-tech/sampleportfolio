/* ============================================================
   VISHAL KRISHNAN S — PORTFOLIO ENHANCEMENTS (Vanilla JS)
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────
   1. UTILITY
───────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─────────────────────────────────────────────
   2. NAVBAR — SCROLL GLASS + ACTIVE LINK
───────────────────────────────────────────── */
function initNavbar() {
  const header = $('.site-header');
  const navLinks = $$('.site-header nav a[href^="#"]');
  const sections = navLinks.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);

  // Glass blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightNav();
  }, { passive: true });

  function highlightNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('nav-active', a.getAttribute('href') === '#' + current);
    });
  }

  highlightNav();
}

/* ─────────────────────────────────────────────
   3. MOBILE HAMBURGER MENU
───────────────────────────────────────────── */
function initMobileMenu() {
  const header = $('.site-header');
  const nav = $('nav', header);

  const btn = document.createElement('button');
  btn.className = 'hamburger';
  btn.setAttribute('aria-label', 'Toggle menu');
  btn.innerHTML = `<span></span><span></span><span></span>`;
  header.appendChild(btn);

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('mobile-open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  // close on link click
  $$('a', nav).forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
      btn.classList.remove('open');
    });
  });
}

/* ─────────────────────────────────────────────
   4. TYPING / ROTATING HEADLINE
───────────────────────────────────────────── */
function initTypingEffect() {
  const target = document.createElement('span');
  target.className = 'typed-word';

  const h1 = $('section.hero h1');
  if (!h1) return;

  // Replace "digital reality." with animated version
  h1.innerHTML = h1.innerHTML.replace(
    '<span class="gradient-text">digital reality.</span>',
    '<span class="gradient-text typed-container"><span class="typed-word"></span><span class="typed-cursor">|</span></span>'
  );

  const words = ['digital reality.', 'web experiences.', 'smart solutions.', 'cool projects.'];
  let wi = 0, ci = 0, deleting = false;
  const typedEl = $('.typed-word');

  function tick() {
    const word = words[wi];
    if (!deleting) {
      typedEl.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; return setTimeout(tick, 1800); }
    } else {
      typedEl.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; return setTimeout(tick, 400); }
    }
    setTimeout(tick, deleting ? 55 : 95);
  }

  setTimeout(tick, 800);
}

/* ─────────────────────────────────────────────
   5. SCROLL-REVEAL ANIMATIONS
───────────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = $$([
    '.skill-card',
    '.project-card',
    '.timeline-item',
    '.credential-row',
    '.about-note',
    '.about-intro',
    '.section-heading',
    '.quick-facts div',
    '.coding-stats div'
  ].join(','));

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 6) * 60 + 'ms';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => io.observe(el));
}

/* ─────────────────────────────────────────────
   6. ANIMATED COUNTERS (quick-facts & coding-stats)
───────────────────────────────────────────── */
function initCounters() {
  const counters = $$('.quick-facts strong, .coding-stats strong');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target;
      const raw = el.textContent.trim();
      const num = parseInt(raw, 10);
      const suffix = raw.replace(/[0-9]/g, '');
      const duration = 1200;
      const start = performance.now();

      function update(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * num) + suffix;
        if (p < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
}

/* ─────────────────────────────────────────────
   7. CUSTOM CURSOR GLOW
───────────────────────────────────────────── */
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mx = -200, my = -200, cx = -200, cy = -200;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function loop() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    glow.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  }
  loop();

  // grow on interactive elements
  $$('a, button, .skill-card, .project-card, .credential-row').forEach(el => {
    el.addEventListener('mouseenter', () => glow.classList.add('glow-big'));
    el.addEventListener('mouseleave', () => glow.classList.remove('glow-big'));
  });
}

/* ─────────────────────────────────────────────
   8. DARK MODE TOGGLE
───────────────────────────────────────────── */
function initDarkMode() {
  const btn = document.createElement('button');
  btn.className = 'theme-toggle';
  btn.setAttribute('aria-label', 'Toggle dark mode');
  btn.innerHTML = '🌙';

  const header = $('.site-header');
  header.insertBefore(btn, header.querySelector('nav'));

  const saved = localStorage.getItem('theme');
  if (saved === 'dark') applyDark();

  btn.addEventListener('click', () => {
    if (document.body.classList.contains('dark')) {
      document.body.classList.remove('dark');
      btn.innerHTML = '🌙';
      localStorage.setItem('theme', 'light');
    } else {
      applyDark();
      localStorage.setItem('theme', 'dark');
    }
  });

  function applyDark() {
    document.body.classList.add('dark');
    btn.innerHTML = '☀️';
  }
}

/* ─────────────────────────────────────────────
   9. SMOOTH PROGRESS BARS ON SKILL CARDS
───────────────────────────────────────────── */
function initSkillBars() {
  const skillData = {
    'Languages':          { pct: 75, color: '#7657ed' },
    'Frontend & Backend': { pct: 68, color: '#f4855a' },
    'Databases':          { pct: 60, color: '#4a9eef' },
    'Data & Concepts':    { pct: 65, color: '#2dcca7' },
    'Tools':              { pct: 80, color: '#f16ba9' },
    'Exploring':          { pct: 45, color: '#f7c340' },
  };

  $$('.skill-card').forEach(card => {
    const title = $('h3', card)?.textContent.trim();
    const info = skillData[title];
    if (!info) return;

    const wrap = document.createElement('div');
    wrap.className = 'skill-bar-wrap';
    const track = document.createElement('div');
    track.className = 'skill-bar-track';
    const fill = document.createElement('div');
    fill.className = 'skill-bar-fill';
    fill.style.background = info.color;
    fill.style.width = '0%';
    track.appendChild(fill);

    const label = document.createElement('span');
    label.className = 'skill-bar-label';
    label.textContent = info.pct + '%';

    wrap.appendChild(track);
    wrap.appendChild(label);
    card.appendChild(wrap);

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        setTimeout(() => { fill.style.width = info.pct + '%'; }, 200);
      });
    }, { threshold: 0.4 });
    io.observe(card);
  });
}

/* ─────────────────────────────────────────────
   10. PROJECT CARD — TILT ON HOVER
───────────────────────────────────────────── */
function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  $$('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ─────────────────────────────────────────────
   11. BACK-TO-TOP BUTTON
───────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─────────────────────────────────────────────
   12. PARTICLES IN HERO BACKGROUND
───────────────────────────────────────────── */
function initHeroParticles() {
  const hero = $('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  hero.insertBefore(canvas, hero.firstChild);

  const ctx2 = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const NUM = 48;
  particles = Array.from({ length: NUM }, () => makeParticle());

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.8,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      a: Math.random(),
    };
  }

  function drawParticles() {
    ctx2.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx2.beginPath();
      ctx2.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx2.fillStyle = `rgba(118,87,237,${p.a * 0.4})`;
      ctx2.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });
    // draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 110) {
          ctx2.beginPath();
          ctx2.moveTo(particles[i].x, particles[i].y);
          ctx2.lineTo(particles[j].x, particles[j].y);
          ctx2.strokeStyle = `rgba(118,87,237,${0.09 * (1 - dist / 110)})`;
          ctx2.lineWidth = 1;
          ctx2.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

/* ─────────────────────────────────────────────
   13. TOAST NOTIFICATION for email copy
───────────────────────────────────────────── */
function initEmailCopy() {
  const emailLinks = $$('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', e => {
      const email = link.getAttribute('href').replace('mailto:', '');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => showToast('Email copied to clipboard! ✦'));
      }
    });
  });
}

function showToast(msg) {
  const existing = $('.toast-msg');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2800);
}

/* ─────────────────────────────────────────────
   14. PILL HOVER RIPPLE EFFECT
───────────────────────────────────────────── */
function initPillRipple() {
  $$('.pills span, .project-stack span').forEach(pill => {
    pill.addEventListener('click', e => {
      const ripple = document.createElement('span');
      ripple.className = 'pill-ripple';
      const rect = pill.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top  = (e.clientY - rect.top)  + 'px';
      pill.style.position = 'relative';
      pill.style.overflow = 'hidden';
      pill.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ─────────────────────────────────────────────
   15. INJECT DYNAMIC STYLES
───────────────────────────────────────────── */
function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* ── Navbar scrolled glass ── */
    .site-header.scrolled {
      background: rgba(251,250,255,0.82);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 1px 0 rgba(118,87,237,0.08);
      position: sticky;
      top: 0;
    }
    .dark .site-header.scrolled {
      background: rgba(14,10,30,0.85);
    }

    /* ── Active nav link ── */
    .site-header nav a.nav-active {
      color: var(--purple);
    }

    /* ── Mobile nav ── */
    @media (max-width: 600px) {
      .site-header nav {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(251,250,255,0.97);
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 32px;
        font-size: 20px;
        z-index: 100;
      }
      .dark .site-header nav {
        background: rgba(14,10,30,0.97);
      }
      .site-header nav.mobile-open { display: flex; }
      .hamburger {
        display: flex;
        flex-direction: column;
        gap: 5px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 6px;
        z-index: 200;
        position: relative;
      }
      .hamburger span {
        display: block;
        width: 24px; height: 2px;
        background: var(--ink);
        border-radius: 2px;
        transition: transform .3s, opacity .3s;
      }
      .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
      .hamburger.open span:nth-child(2) { opacity: 0; }
      .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    }
    @media (min-width: 601px) { .hamburger { display: none; } }

    /* ── Dark Mode ── */
    .dark {
      --ink:   #e8e4ff;
      --muted: #9f9bb8;
      --paper: #0e0a1e;
      --line:  #2a2545;
    }
    .dark body { background: var(--paper); }
    .dark .site-header { background: transparent; }
    .dark .skill-card,
    .dark .project-card,
    .dark .about-note,
    .dark .credentials { background: #16112e; border-color: #2a2545; }
    .dark .profile-card { background: #16112e; border-color: #2a2545; }
    .dark .floating-chip { background: #16112e; border-color: #2a2545; }
    .dark .button-ghost  { background: #16112e; border-color: #2a2545; }
    .dark .pills span { background: #1e1840; border-color: #2a2545; }
    .dark .skill-orange .pills span { background: #2a1810; border-color: #3d2010; }
    .dark .skill-blue   .pills span { background: #101828; border-color: #102040; }
    .dark .skill-green  .pills span { background: #0a2018; border-color: #0e3020; }
    .dark .skill-pink   .pills span { background: #2a0e18; border-color: #3d1225; }
    .dark .skill-yellow .pills span { background: #201808; border-color: #3d2e08; }
    .dark .project-stack span { background: #16112e; border-color: #2a2545; }
    .dark .timeline-item { border-left-color: #2a2545; }
    .dark .credential-row { border-bottom-color: #2a2545; }
    .dark .coding-stats   { border-top-color: #2a2545; }
    .dark .site-footer    { border-top-color: #2a2545; }
    .dark .nav-contact    { border-color: #2a2545; }
    .dark .credential-row:hover { background: #1e1840; }

    /* ── Theme toggle button ── */
    .theme-toggle {
      background: none;
      border: 1px solid var(--line);
      border-radius: 50%;
      width: 36px; height: 36px;
      font-size: 16px;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: background .2s, border-color .2s, transform .2s;
      flex-shrink: 0;
    }
    .theme-toggle:hover { background: #f3eeff; transform: rotate(20deg); border-color: var(--purple); }
    .dark .theme-toggle:hover { background: #1e1840; }

    /* ── Scroll-reveal ── */
    .reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity .55s ease, transform .55s ease;
    }
    .reveal.revealed {
      opacity: 1;
      transform: none;
    }

    /* ── Typed cursor ── */
    .typed-container { display: inline; }
    .typed-cursor {
      display: inline-block;
      animation: blink .8s step-end infinite;
      color: #f16ba9;
      font-weight: 300;
      margin-left: 2px;
    }
    @keyframes blink { 50% { opacity: 0; } }

    /* ── Custom cursor glow ── */
    .cursor-glow {
      position: fixed;
      top: -16px; left: -16px;
      width: 32px; height: 32px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(118,87,237,.22) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9999;
      transition: width .3s, height .3s, top .3s, left .3s, background .3s;
      will-change: transform;
    }
    .cursor-glow.glow-big {
      width: 64px; height: 64px;
      top: -32px; left: -32px;
      background: radial-gradient(circle, rgba(118,87,237,.18) 0%, transparent 70%);
    }

    /* ── Skill progress bars ── */
    .skill-bar-wrap {
      margin-top: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .skill-bar-track {
      flex: 1;
      height: 5px;
      border-radius: 10px;
      background: #f0ecfc;
      overflow: hidden;
    }
    .dark .skill-bar-track { background: #2a2545; }
    .skill-bar-fill {
      height: 100%;
      border-radius: 10px;
      width: 0%;
      transition: width 1s cubic-bezier(.4,0,.2,1);
    }
    .skill-bar-label {
      font-size: 10px;
      font-weight: 700;
      color: var(--muted);
      flex-shrink: 0;
      min-width: 28px;
      text-align: right;
    }

    /* ── Back-to-top button ── */
    .back-top {
      position: fixed;
      bottom: 28px; right: 28px;
      width: 44px; height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7657ed, #f16ba9);
      color: #fff;
      font-size: 20px;
      border: none;
      cursor: pointer;
      box-shadow: 0 8px 24px #8663e540;
      display: grid;
      place-items: center;
      opacity: 0;
      transform: translateY(16px) scale(.9);
      transition: opacity .3s, transform .3s;
      z-index: 500;
    }
    .back-top.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    .back-top:hover { transform: translateY(-3px) scale(1.08); }

    /* ── Hero canvas ── */
    .hero-canvas {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      opacity: .6;
    }

    /* ── Toast ── */
    .toast-msg {
      position: fixed;
      bottom: 80px; left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: var(--ink);
      color: var(--paper);
      font-size: 13px;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 30px;
      box-shadow: 0 8px 28px #0002;
      z-index: 999;
      opacity: 0;
      transition: opacity .35s, transform .35s;
      white-space: nowrap;
    }
    .toast-msg.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    /* ── Pill ripple ── */
    .pill-ripple {
      position: absolute;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: rgba(118,87,237,.35);
      transform: translate(-50%, -50%) scale(0);
      animation: rippleAnim .5s ease-out forwards;
      pointer-events: none;
    }
    @keyframes rippleAnim {
      to { transform: translate(-50%, -50%) scale(14); opacity: 0; }
    }

    /* ── Highlight hero section above canvas ── */
    .hero-copy, .hero-art, .scroll-cue { position: relative; z-index: 1; }
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────────
   INIT ALL
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectStyles();
  initNavbar();
  initMobileMenu();
  initTypingEffect();
  initScrollReveal();
  initCounters();
  initCursorGlow();
  initDarkMode();
  initSkillBars();
  initCardTilt();
  initBackToTop();
  initHeroParticles();
  initEmailCopy();
  initPillRipple();
});

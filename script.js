/* ============================================================
   ANGEL COIN — Interaction & Effects Layer  (v2 — hardened)
   ------------------------------------------------------------
   Architecture:
   - AppState: single source of truth (scrollY, viewport, pointer)
   - Ticker:    one requestAnimationFrame loop; modules subscribe
   - Resize:    one resize listener (debounced); modules subscribe
   - Scroll:    one scroll listener (passive); modules subscribe
   - Every DOM lookup is null-checked before use — a missing
     element disables just that feature, never the whole script.
   ============================================================ */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const debounce = (fn, wait = 200) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  /* ============================================================
     AAA CINEMATIC LOADER
     Waits for: web fonts, the hero image, and one animation
     frame (so canvases have initialized) — then holds for a
     minimum display time so it never just flickers on fast
     connections — before revealing the page.
     ============================================================ */
  (function loaderModule() {
    const loader = $('#loader');
    if (!loader) return; // no loader markup — nothing to gate, page shows normally
    const fill = $('#loaderBarFill');
    const pctEl = $('#loaderPct');
    const MIN_DISPLAY_MS = prefersReducedMotion ? 0 : 700;
    const startedAt = performance.now();

    let progress = 0;
    const setProgress = (p) => {
      progress = Math.max(progress, Math.min(1, p));
      if (fill) fill.style.width = `${Math.round(progress * 100)}%`;
      if (pctEl) pctEl.textContent = `${Math.round(progress * 100)}%`;
    };

    const tasks = [];

    // Task 1: web fonts ready (falls back gracefully if API unsupported)
    if (document.fonts && document.fonts.ready) {
      tasks.push(document.fonts.ready.catch(() => {}));
    }

    // Task 2: the hero image, if present, fully decoded
    const heroImg = $('.angel-figure--img');
    if (heroImg) {
      if (heroImg.complete) {
        tasks.push(Promise.resolve());
      } else {
        tasks.push(new Promise((resolve) => {
          heroImg.addEventListener('load', resolve, { once: true });
          heroImg.addEventListener('error', resolve, { once: true }); // don't hang the site on a missing image
        }));
      }
    }

    // Task 3: one paint frame, so canvases (starfield etc.) have run their first draw
    tasks.push(new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

    // Hard safety timeout — never block the site for more than 6s
    // even if a task above never resolves (e.g. a stalled font load).
    const safetyTimeout = new Promise((resolve) => setTimeout(resolve, 6000));

    let doneCount = 0;
    const totalTasks = tasks.length || 1;
    tasks.forEach(t => t.then(() => { doneCount += 1; setProgress(doneCount / totalTasks); }));

    Promise.race([Promise.all(tasks), safetyTimeout]).then(() => {
      setProgress(1);
      const elapsed = performance.now() - startedAt;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => {
        loader.classList.add('is-done');
        loader.addEventListener('transitionend', () => loader.remove(), { once: true });
      }, wait);
    });

    // Progress never visually "hangs" even if fonts/images resolve
    // instantly — nudge it forward so the bar always animates in.
    setProgress(0.15);
  })();

  /* ============================================================
     CENTRAL TICKER — one rAF loop; every animated module
     registers a callback instead of starting its own loop.
     ============================================================ */
  const Ticker = (() => {
    const callbacks = new Set();
    let running = false;

    function loop(now) {
      for (const cb of callbacks) {
        try { cb(now); } catch (err) { /* isolate: one bad callback can't kill the loop */ console.error('[Ticker]', err); }
      }
      if (callbacks.size) requestAnimationFrame(loop);
      else running = false;
    }

    return {
      add(cb) {
        callbacks.add(cb);
        if (!running) { running = true; requestAnimationFrame(loop); }
        return () => callbacks.delete(cb);
      }
    };
  })();

  /* ============================================================
     CENTRAL RESIZE MANAGER — one debounced listener;
     modules register to be notified.
     ============================================================ */
  const ResizeManager = (() => {
    const callbacks = new Set();
    const notify = debounce(() => {
      for (const cb of callbacks) {
        try { cb(); } catch (err) { console.error('[ResizeManager]', err); }
      }
    }, 200);
    window.addEventListener('resize', notify, { passive: true });
    return {
      add(cb) { callbacks.add(cb); cb(); return () => callbacks.delete(cb); }
    };
  })();

  /* ============================================================
     CENTRAL SCROLL MANAGER — one passive listener;
     modules register to be notified with the current scrollY.
     ============================================================ */
  const ScrollManager = (() => {
    const callbacks = new Set();
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        for (const cb of callbacks) {
          try { cb(y); } catch (err) { console.error('[ScrollManager]', err); }
        }
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return {
      add(cb) { callbacks.add(cb); cb(window.scrollY); return () => callbacks.delete(cb); }
    };
  })();

  /* ============================================================
     NAV — scroll state, mobile menu, active-section highlight
     ============================================================ */
  (function navModule() {
    const nav = $('#nav');
    const burger = $('#navBurger');
    const mobileMenu = $('#mobileMenu');

    if (nav) {
      ScrollManager.add((y) => nav.classList.toggle('is-scrolled', y > 30));
    }

    if (burger && mobileMenu) {
      burger.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('is-open');
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
      });
      $$('a', mobileMenu).forEach(a => a.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }));
    }

    const navLinks = $$('.nav-link');
    if (navLinks.length) {
      const sections = navLinks
        .map(l => { try { return document.querySelector(l.getAttribute('href')); } catch { return null; } })
        .filter(Boolean);

      if (sections.length) {
        ScrollManager.add((y) => {
          const pos = y + 140;
          let current = sections[0];
          for (const sec of sections) {
            if (sec.offsetTop <= pos) current = sec;
          }
          navLinks.forEach(l => l.classList.remove('is-active'));
          const match = navLinks.find(l => l.getAttribute('href') === `#${current.id}`);
          if (match) match.classList.add('is-active');
        });
      }
    }
  })();

  /* ============================================================
     CURSOR AMBIENT GLOW
     ============================================================ */
  (function cursorGlowModule() {
    if (prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) return;
    const glow = $('#cursorGlow');
    if (!glow) return;

    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    let tx = gx, ty = gy;
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });

    Ticker.add(() => {
      gx += (tx - gx) * 0.09;
      gy += (ty - gy) * 0.09;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
    });
  })();

  /* ============================================================
     STARFIELD CANVAS (background)
     ============================================================ */
  (function starfieldModule() {
    const canvas = $('#starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars = [];
    let w = 0, h = 0, dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      const count = Math.floor((window.innerWidth * window.innerHeight) / 6500);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 * dpr + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.85 ? 'gold' : (Math.random() > 0.7 ? 'purple' : 'white')
      }));
    }

    ResizeManager.add(resize);

    if (prefersReducedMotion) return; // static (already painted once by resize+draw below)

    let t = 0;
    Ticker.add(() => {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      t += 1;
      for (const s of stars) {
        const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.3;
        let color = '255,255,255';
        if (s.hue === 'gold') color = '255,215,0';
        if (s.hue === 'purple') color = '186,140,240';
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color},${Math.max(0, alpha)})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  })();

  /* ============================================================
     SCROLL REVEAL (IntersectionObserver)
     ============================================================ */
  (function revealModule() {
    const revealEls = $$('[data-reveal]');
    if (!revealEls.length) return;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(el => io.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('is-visible'));
    }
  })();

  /* ============================================================
     PARALLAX (mouse-driven, hero angel)
     ============================================================ */
  (function parallaxModule() {
    if (prefersReducedMotion) return;
    const root = $('[data-parallax-root]');
    if (!root) return;
    const target = $('[data-parallax]', root);
    if (!target) return;

    let px = 0, py = 0, cx = 0, cy = 0;
    root.addEventListener('mousemove', (e) => {
      const rect = root.getBoundingClientRect();
      px = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      py = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    root.addEventListener('mouseleave', () => { px = 0; py = 0; });

    const depth = parseFloat(target.dataset.parallax) || 8;
    Ticker.add(() => {
      cx += (px - cx) * 0.06;
      cy += (py - cy) * 0.06;
      target.style.transform = `rotateY(${cx * depth}deg) rotateX(${-cy * depth}deg)`;
    });
  })();

  /* ============================================================
     ANGEL PARTICLES (rising gold motes)
     ============================================================ */
  (function angelParticlesModule() {
    const container = $('#angelParticles');
    if (!container || prefersReducedMotion) return;
    const count = 18;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'p';
      const left = 20 + Math.random() * 60;
      const delay = Math.random() * 6;
      const duration = 4 + Math.random() * 3;
      const drift = (Math.random() - 0.5) * 60;
      p.style.left = `${left}%`;
      p.style.bottom = `${Math.random() * 20}%`;
      p.style.setProperty('--drift', `${drift}px`);
      p.style.animationDelay = `${delay}s`;
      p.style.animationDuration = `${duration}s`;
      frag.appendChild(p);
    }
    container.appendChild(frag);
  })();

  /* ============================================================
     LIVE MARKET LINE CHART (canvas, static draw)
     ============================================================ */
  (function marketChartModule() {
    const canvas = $('#marketChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate the data series ONCE — resize should only re-render
    // the existing series at the new canvas size, not reroll new data.
    const points = [];
    (function generatePoints() {
      let v = 30;
      for (let i = 0; i < 28; i++) {
        v += (Math.random() - 0.38) * 8;
        v = Math.max(8, Math.min(62, v));
        points.push(v);
      }
      points[points.length - 1] = 14;
    })();

    function draw() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth || 300;
      const cssH = 70;
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, cssW, cssH);
      const stepX = cssW / (points.length - 1);

      const grad = ctx.createLinearGradient(0, 0, 0, cssH);
      grad.addColorStop(0, 'rgba(138,43,226,0.35)');
      grad.addColorStop(1, 'rgba(138,43,226,0)');

      ctx.beginPath();
      ctx.moveTo(0, points[0]);
      points.forEach((p, i) => ctx.lineTo(i * stepX, p));
      ctx.lineTo(cssW, cssH);
      ctx.lineTo(0, cssH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, points[0]);
      points.forEach((p, i) => ctx.lineTo(i * stepX, p));
      const lineGrad = ctx.createLinearGradient(0, 0, cssW, 0);
      lineGrad.addColorStop(0, '#8a2be2');
      lineGrad.addColorStop(1, '#ffd700');
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    ResizeManager.add(draw);
  })();

  /* ============================================================
     DONUT CHART (tokenomics) — animated stroke-dashoffset
     ============================================================ */
  (function donutChartModule() {
    const donut = $('#donutChart');
    if (!donut) return;
    const segs = $$('.donut-seg', donut);
    if (!segs.length) return;

    const r = 80;
    const circumference = 2 * Math.PI * r;

    segs.forEach(seg => {
      seg.style.stroke = seg.dataset.color || '#ffffff';
      seg.style.strokeDasharray = `0 ${circumference}`;
    });

    const animateSegs = () => {
      let offsetAcc = 0;
      segs.forEach(seg => {
        const pct = parseFloat(seg.dataset.pct) || 0;
        const len = (pct / 100) * circumference;
        seg.style.transition = 'stroke-dasharray 1.2s cubic-bezier(.16,1,.3,1)';
        seg.style.strokeDasharray = `${len} ${circumference - len}`;
        seg.style.strokeDashoffset = `${-offsetAcc}`;
        offsetAcc += len;
      });
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateSegs();
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      io.observe(donut);
    } else {
      animateSegs();
    }
  })();

  /* ============================================================
     COUNT-UP STATS  (uses central Ticker — self-removes when done)
     ============================================================ */
  (function countUpModule() {
    const nums = $$('.stat-num');
    if (!nums.length) return;

    const easeOutExpo = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const animateCount = (el) => {
      const target = parseInt(el.dataset.count, 10);
      if (Number.isNaN(target)) return;
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      let unsubscribe = null;
      const step = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = easeOutExpo(p);
        const val = Math.floor(eased * target);
        el.textContent = val.toLocaleString('en-US') + suffix;
        if (p >= 1) {
          el.textContent = target.toLocaleString('en-US') + suffix;
          if (unsubscribe) unsubscribe();
        }
      };
      unsubscribe = Ticker.add(step);
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      nums.forEach(n => io.observe(n));
    } else {
      nums.forEach(animateCount);
    }
  })();

  /* ============================================================
     LIVE PRICE TICKER (simulated)
     ============================================================ */
  (function priceTickerModule() {
    const priceEl = $('#priceValue');
    const deltaEl = $('#priceDelta');
    if (!priceEl || !deltaEl || prefersReducedMotion) return;

    let price = 0.000357;
    const baseline = price;

    setInterval(() => {
      const change = (Math.random() - 0.48) * 0.000004;
      price = Math.max(0.00001, price + change);
      const pct = ((price - baseline) / baseline) * 100;
      priceEl.textContent = `$${price.toFixed(6)}`;
      deltaEl.textContent = `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
      deltaEl.classList.toggle('delta--up', pct >= 0);
      deltaEl.classList.toggle('delta--down', pct < 0);
      if (priceEl.animate) {
        priceEl.animate(
          [{ opacity: 0.4, transform: 'translateY(2px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 300, easing: 'ease-out' }
        );
      }
    }, 2600);
  })();

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  (function faqModule() {
    const items = $$('.faq-item');
    if (!items.length) return;
    items.forEach(item => {
      const btn = $('.faq-q', item);
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        items.forEach(i => i.classList.remove('is-open'));
        if (!isOpen) item.classList.add('is-open');
      });
    });
  })();

  /* ============================================================
     TRUSTED-BY MARQUEE — duplicate row for seamless loop
     ============================================================ */
  (function marqueeModule() {
    const row = $('#trustedRow');
    if (!row || !row.children.length) return;
    const clone = row.cloneNode(true);
    const frag = document.createDocumentFragment();
    Array.from(clone.children).forEach(child => frag.appendChild(child));
    row.appendChild(frag);
  })();

  /* ============================================================
     CARD TILT (data-tilt elements)
     ============================================================ */
  (function tiltModule() {
    if (prefersReducedMotion) return;
    const cards = $$('[data-tilt]');
    if (!cards.length) return;
    cards.forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
      });
    });
  })();

  /* ============================================================
     MATERIAL ENGINE v2 — injects the 6-layer physical surface
     stack (rim / reflect / grain / shine / glass / glow) into
     any element marked data-material="gold|glass". Markup stays
     a single clean element; JS builds the layers once on load.
     Reflection position reuses live pointer tracking so the
     highlight moves with the mouse, matching the Lighting Engine.
     ============================================================ */
  (function materialEngineModule() {
    const hosts = $$('[data-material]');
    if (!hosts.length) return;

    const LAYER_NAMES = ['rim', 'reflect', 'grain', 'shine', 'glass', 'glow'];

    hosts.forEach(host => {
      const kind = host.dataset.material === 'glass' ? 'glass' : 'gold';
      host.classList.add('material', `material--${kind}`);

      const frag = document.createDocumentFragment();
      LAYER_NAMES.forEach(name => {
        const span = document.createElement('span');
        span.className = `m-layer m-${name}`;
        span.setAttribute('aria-hidden', 'true');
        frag.appendChild(span);
      });
      host.appendChild(frag);
    });

    // Pointer-driven reflection position — fine pointer only,
    // consistent with the Lighting Engine's own touch handling.
    if (window.matchMedia('(pointer: fine)').matches) {
      hosts.forEach(host => {
        host.addEventListener('pointermove', (e) => {
          const rect = host.getBoundingClientRect();
          const lx = ((e.clientX - rect.left) / rect.width) * 100;
          const ly = ((e.clientY - rect.top) / rect.height) * 100;
          host.style.setProperty('--lx', `${lx}%`);
          host.style.setProperty('--ly', `${ly}%`);
        });
      });
    }
  })();

  /* ============================================================
     LIGHTING ENGINE — real pointer-driven highlight (.mat-light)
     Elements opted into .mat-light get a radial highlight whose
     position tracks the actual cursor/finger, so the surface
     reads as genuinely lit rather than looping a fixed animation.
     Fine-pointer only: touch has no persistent hover position,
     so we skip it there rather than fake a light source.
     ============================================================ */
  (function lightingEngineModule() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const targets = $$('.feature-card, .stat-box, .team-card, .market-card, .panel');
    if (!targets.length) return;

    targets.forEach(el => {
      el.classList.add('mat-light');
      el.addEventListener('pointerenter', () => el.classList.add('is-lit'));
      el.addEventListener('pointerleave', () => el.classList.remove('is-lit'));
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const lx = ((e.clientX - rect.left) / rect.width) * 100;
        const ly = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--lx', `${lx}%`);
        el.style.setProperty('--ly', `${ly}%`);
      });
    });
  })();

  /* ============================================================
     CTA BANNER PARTICLE FIELD (canvas)
     ============================================================ */
  (function ctaParticlesModule() {
    const canvas = $('#ctaParticles');
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let w = 0, h = 0, dpr = 1, particles = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = parent.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      w = canvas.width = rect.width * dpr;
      h = canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      const count = Math.floor((rect.width * rect.height) / 9000);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 * dpr + 0.4,
        vy: -(Math.random() * 0.3 + 0.08) * dpr,
        alpha: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '255,215,0' : '186,140,240'
      }));
    }

    ResizeManager.add(resize);

    Ticker.add(() => {
      if (!w || !h || !particles.length) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y += p.vy;
        if (p.y < -10) p.y = h + 10;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  })();

  /* ============================================================
     NEWSLETTER FORM (front-end only demo)
     ============================================================ */
  (function newsletterModule() {
    const form = $('#newsletterForm');
    if (!form) return;
    const input = $('input', form);
    const btn = $('button', form);
    if (!input || !btn) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      input.value = 'Subscribed ✓';
      input.disabled = true;
      btn.style.opacity = '0.6';
      setTimeout(() => {
        input.disabled = false;
        input.value = '';
        input.placeholder = 'Enter your email';
        btn.style.opacity = '1';
      }, 2400);
    });
  })();

  /* ============================================================
     SMOOTH ANCHOR SCROLL W/ NAV OFFSET
     ============================================================ */
  (function smoothAnchorModule() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (!id || id.length < 2) return;
        let target;
        try { target = document.querySelector(id); } catch { return; }
        if (!target) return;
        e.preventDefault();
        const offset = 84;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });
  })();

})();

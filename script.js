/* ============================================================
   ANGEL COIN — Interaction & Effects Layer
   ============================================================ */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     NAV: scroll state + mobile menu + active link
     --------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 30);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  // active section highlight
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  const highlightNav = () => {
    const y = window.scrollY + 140;
    let current = sections[0];
    for (const sec of sections) {
      if (sec.offsetTop <= y) current = sec;
    }
    navLinks.forEach(l => l.classList.remove('is-active'));
    const match = navLinks.find(l => l.getAttribute('href') === `#${current.id}`);
    if (match) match.classList.add('is-active');
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ---------------------------------------------------------
     CURSOR AMBIENT GLOW
     --------------------------------------------------------- */
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const glow = document.getElementById('cursorGlow');
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    let tx = gx, ty = gy;
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    const animateGlow = () => {
      gx += (tx - gx) * 0.09;
      gy += (ty - gy) * 0.09;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateGlow);
    };
    animateGlow();
  }

  /* ---------------------------------------------------------
     STARFIELD CANVAS (background)
     --------------------------------------------------------- */
  (function starfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let stars = [];
    let w, h, dpr;

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

    let t = 0;
    function draw() {
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
      if (!prefersReducedMotion) requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
  })();

  /* ---------------------------------------------------------
     SCROLL REVEAL (IntersectionObserver)
     --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
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

  /* ---------------------------------------------------------
     PARALLAX (mouse-driven, hero angel)
     --------------------------------------------------------- */
  if (!prefersReducedMotion) {
    const root = document.querySelector('[data-parallax-root]');
    if (root) {
      let px = 0, py = 0, cx = 0, cy = 0;
      root.addEventListener('mousemove', (e) => {
        const rect = root.getBoundingClientRect();
        px = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        py = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      });
      root.addEventListener('mouseleave', () => { px = 0; py = 0; });
      const target = root.querySelector('[data-parallax]');
      const tick = () => {
        cx += (px - cx) * 0.06;
        cy += (py - cy) * 0.06;
        if (target) {
          const depth = parseFloat(target.dataset.parallax) || 8;
          target.style.transform = `rotateY(${cx * depth}deg) rotateX(${-cy * depth}deg)`;
        }
        requestAnimationFrame(tick);
      };
      tick();
    }
  }

  /* ---------------------------------------------------------
     ANGEL PARTICLES (rising gold motes)
     --------------------------------------------------------- */
  (function angelParticles() {
    const container = document.getElementById('angelParticles');
    if (!container || prefersReducedMotion) return;
    const count = 18;
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
      container.appendChild(p);
    }
  })();

  /* ---------------------------------------------------------
     LIVE MARKET LINE CHART (canvas)
     --------------------------------------------------------- */
  (function marketChart() {
    const canvas = document.getElementById('marketChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth || 300;
    const cssH = 70;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.scale(dpr, dpr);

    // deterministic-ish upward trending wiggle
    const points = [];
    let v = 30;
    for (let i = 0; i < 28; i++) {
      v += (Math.random() - 0.38) * 8;
      v = Math.max(8, Math.min(62, v));
      points.push(v);
    }
    points[points.length - 1] = 14; // end high (chart is y-flipped visually)

    function draw() {
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
    draw();
  })();

  /* ---------------------------------------------------------
     DONUT CHART (tokenomics) — animated stroke-dashoffset
     --------------------------------------------------------- */
  (function donutChart() {
    const donut = document.getElementById('donutChart');
    if (!donut) return;
    const segs = donut.querySelectorAll('.donut-seg');
    const r = 80;
    const circumference = 2 * Math.PI * r;
    let offsetAcc = 0;

    segs.forEach(seg => {
      const pct = parseFloat(seg.dataset.pct);
      const len = (pct / 100) * circumference;
      seg.style.stroke = seg.dataset.color;
      seg.style.strokeDasharray = `${len} ${circumference - len}`;
      seg.style.strokeDashoffset = `${-offsetAcc}`;
      seg.dataset.finalOffset = -offsetAcc;
      offsetAcc += len;
      // start fully hidden for reveal animation
      seg.style.strokeDasharray = `0 ${circumference}`;
    });

    const animateSegs = () => {
      offsetAcc = 0;
      segs.forEach(seg => {
        const pct = parseFloat(seg.dataset.pct);
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

  /* ---------------------------------------------------------
     COUNT-UP STATS
     --------------------------------------------------------- */
  (function countUp() {
    const nums = document.querySelectorAll('.stat-num');
    if (!nums.length) return;

    const animateCount = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      const easeOutExpo = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

      const step = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = easeOutExpo(p);
        const val = Math.floor(eased * target);
        el.textContent = val.toLocaleString('en-US') + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString('en-US') + suffix;
      };
      requestAnimationFrame(step);
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

  /* ---------------------------------------------------------
     LIVE PRICE TICKER (simulated)
     --------------------------------------------------------- */
  (function priceTicker() {
    const priceEl = document.getElementById('priceValue');
    const deltaEl = document.getElementById('priceDelta');
    if (!priceEl || prefersReducedMotion) return;
    let price = 0.000357;
    let baseline = price;

    setInterval(() => {
      const change = (Math.random() - 0.48) * 0.000004;
      price = Math.max(0.00001, price + change);
      const pct = ((price - baseline) / baseline) * 100;
      priceEl.textContent = `$${price.toFixed(6)}`;
      deltaEl.textContent = `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
      deltaEl.classList.toggle('delta--up', pct >= 0);
      deltaEl.classList.toggle('delta--down', pct < 0);
      priceEl.animate(
        [{ opacity: 0.4, transform: 'translateY(2px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 300, easing: 'ease-out' }
      );
    }, 2600);
  })();

  /* ---------------------------------------------------------
     FAQ ACCORDION
     --------------------------------------------------------- */
  (function faq() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
      const btn = item.querySelector('.faq-q');
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        items.forEach(i => i.classList.remove('is-open'));
        if (!isOpen) item.classList.add('is-open');
      });
    });
  })();

  /* ---------------------------------------------------------
     TRUSTED-BY MARQUEE — duplicate row for seamless loop
     --------------------------------------------------------- */
  (function marquee() {
    const row = document.getElementById('trustedRow');
    if (!row) return;
    row.innerHTML += row.innerHTML;
  })();

  /* ---------------------------------------------------------
     CARD TILT (about visual, data-tilt)
     --------------------------------------------------------- */
  if (!prefersReducedMotion) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
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
  }

  /* ---------------------------------------------------------
     CTA BANNER PARTICLE FIELD (canvas)
     --------------------------------------------------------- */
  (function ctaParticles() {
    const canvas = document.getElementById('ctaParticles');
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, particles;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
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

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y += p.vy;
        if (p.y < -10) p.y = h + 10;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
  })();

  /* ---------------------------------------------------------
     NEWSLETTER FORM (front-end only demo)
     --------------------------------------------------------- */
  (function newsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn = form.querySelector('button');
      const original = input.value;
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

  /* ---------------------------------------------------------
     SMOOTH ANCHOR SCROLL W/ NAV OFFSET
     --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 84;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

})();

/* ========================================
   J4US SOLUTION - Main JavaScript
   ======================================== */

(function () {
  'use strict';

  /* ── DOM Selectors ── */
  const header      = document.getElementById('header');
  const hamburger   = document.getElementById('hamburger');
  const navMenu     = document.getElementById('navMenu');
  const backToTop   = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  /* ─────────────────────────────────────────
     HEADER – Scroll State
  ───────────────────────────────────────── */
  let lastScrollY = 0;
  function handleScroll() {
    const y = window.scrollY;
    if (y > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    // Back to Top
    if (y > 400) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
    lastScrollY = y;
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ─────────────────────────────────────────
     HAMBURGER MENU
  ───────────────────────────────────────── */
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ─────────────────────────────────────────
     SMOOTH ANCHOR SCROLL (with header offset)
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─────────────────────────────────────────
     BACK TO TOP
  ───────────────────────────────────────── */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─────────────────────────────────────────
     SCROLL REVEAL (IntersectionObserver)
  ───────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
        revealObserver.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ─────────────────────────────────────────
     HERO COUNTER ANIMATION
  ───────────────────────────────────────── */
  function animateCount(el) {
    const target  = parseInt(el.dataset.count);
    const dur     = 2000;
    const step    = 16;
    const inc     = target / (dur / step);
    let current   = 0;
    const timer   = setInterval(() => {
      current += inc;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  }

  const statsObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.stat__num').forEach(animateCount);
        statsObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) statsObserver.observe(heroStats);

  /* ─────────────────────────────────────────
     HERO PARTICLE DOTS
  ───────────────────────────────────────── */
  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 40;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size   = Math.random() * 3 + 1;
      const x      = Math.random() * 100;
      const y      = Math.random() * 100;
      const dur    = Math.random() * 15 + 8;
      const delay  = Math.random() * 5;
      const opacity = Math.random() * 0.35 + 0.05;
      p.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        left:${x}%;top:${y}%;
        border-radius:50%;
        background:rgba(0,102,255,${opacity});
        animation:particleFloat ${dur}s ${delay}s ease-in-out infinite;
      `;
      container.appendChild(p);
    }
    // Inject keyframes if not already present
    if (!document.getElementById('particle-styles')) {
      const style = document.createElement('style');
      style.id = 'particle-styles';
      style.textContent = `
        @keyframes particleFloat {
          0%,100%{transform:translateY(0) scale(1);opacity:var(--op,0.15);}
          33%{transform:translateY(-30px) scale(1.2);opacity:calc(var(--op,0.15)*2);}
          66%{transform:translateY(20px) translateX(10px) scale(0.9);}
        }
      `;
      document.head.appendChild(style);
    }
  }
  createParticles();

  /* ─────────────────────────────────────────
     ACTIVE NAV LINK ON SCROLL
  ───────────────────────────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav__link[href^="#"]');

  const sectionObs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach(s => sectionObs.observe(s));

  // Add active nav style
  const navStyle = document.createElement('style');
  navStyle.textContent = `.nav__link.active{color:#fff!important;background:rgba(255,255,255,.1);}`;
  document.head.appendChild(navStyle);

  /* ─────────────────────────────────────────
     CONTACT FORM
  ───────────────────────────────────────── */
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn  = contactForm.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>전송 중...</span>';
      btn.disabled = true;

      // Simulate async submission
      await new Promise(r => setTimeout(r, 1200));

      btn.style.display = 'none';
      formSuccess.classList.add('show');
      contactForm.reset();

      setTimeout(() => {
        btn.innerHTML = orig;
        btn.disabled = false;
        btn.style.display = '';
        formSuccess.classList.remove('show');
      }, 6000);
    });
  }

  /* ─────────────────────────────────────────
     INPUT FLOAT LABEL EFFECT
  ───────────────────────────────────────── */
  document.querySelectorAll('.form__group input, .form__group textarea, .form__group select')
    .forEach(el => {
      el.addEventListener('focus', () => el.closest('.form__group')?.classList.add('focused'));
      el.addEventListener('blur',  () => el.closest('.form__group')?.classList.remove('focused'));
    });

  /* ─────────────────────────────────────────
     INDUSTRY ITEMS HOVER (already CSS – 
     this adds tilt micro-interaction)
  ───────────────────────────────────────── */
  document.querySelectorAll('.industry__item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      item.style.transform = `translateY(-3px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });

  /* ─────────────────────────────────────────
     SERVICE CARD 3D TILT
  ───────────────────────────────────────── */
  document.querySelectorAll('.service__card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
      card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
      card.style.perspective = '1000px';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();

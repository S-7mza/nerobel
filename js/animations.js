/* ─────────────────────────────────────────────────────────────
   NEROBEL GROUP · ANIMATIONS & INTERACTIVE CONTROLLERS
   File: js/animations.js
   - IntersectionObserver Scroll Reveal System
   - Animated Counter Engine (easeOutCubic)
   - GROHE SPA Inspired Signature Collection Slider Controller
   - Respects prefers-reduced-motion
   ───────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────────────────────
     1. SCROLL REVEAL OBSERVER
     ───────────────────────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('[data-reveal]');

  if (revealElements.length > 0) {
    const revealElement = (el) => {
      el.classList.add('revealed');
    };

    if (prefersReducedMotion) {
      revealElements.forEach(revealElement);
    } else {
      // Proactive observer with generous rootMargin
      const observerOptions = {
        root: null,
        rootMargin: '100px 0px 50px 0px',
        threshold: 0.01
      };

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      revealElements.forEach(el => revealObserver.observe(el));

      // Immediate viewport visibility check
      const checkVisibility = () => {
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        revealElements.forEach(el => {
          if (!el.classList.contains('revealed')) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= windowHeight + 80 && rect.bottom >= -80) {
              revealElement(el);
            }
          }
        });
      };

      checkVisibility();
      window.addEventListener('scroll', checkVisibility, { passive: true });
      window.addEventListener('resize', checkVisibility, { passive: true });

      // Safety timeout: ensure everything is visible after 1.2s
      setTimeout(() => {
        revealElements.forEach(revealElement);
      }, 1200);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     2. METRICS COUNTER ANIMATION
     ───────────────────────────────────────────────────────────── */
  const metricItems = document.querySelectorAll('.metric-item');

  function animateCounter(numEl, target, prefix = '', suffix = '') {
    if (prefersReducedMotion) {
      numEl.innerHTML = `${prefix}${target}<span class="plus">${suffix}</span>`;
      return;
    }
    const duration = 1400;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      numEl.innerHTML = `${prefix}${current}<span class="plus">${suffix}</span>`;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        numEl.innerHTML = `${prefix}${target}<span class="plus">${suffix}</span>`;
      }
    }
    requestAnimationFrame(update);
  }

  if (metricItems.length > 0 && !prefersReducedMotion) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numEl = entry.target.querySelector('.metric-num');
          if (numEl && !numEl.dataset.animated) {
            numEl.dataset.animated = 'true';
            const rawText = numEl.textContent.trim();
            const match = rawText.match(/^(\d+)$/);
            if (match) {
              const targetVal = parseInt(match[1], 10);
              animateCounter(numEl, targetVal, '', '');
            }
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    metricItems.forEach(item => counterObserver.observe(item));
  }

  /* ─────────────────────────────────────────────────────────────
     3. GROHE-INSPIRED SIGNATURE COLLECTION SLIDER
     ───────────────────────────────────────────────────────────── */
  const track = document.getElementById('collectionTrack');
  const prevBtn = document.getElementById('collPrevBtn');
  const nextBtn = document.getElementById('collNextBtn');
  const progressBar = document.getElementById('collProgressBar');
  const segments = progressBar ? progressBar.querySelectorAll('.progress-segment') : [];

  if (track && prevBtn && nextBtn) {
    const getScrollAmount = () => {
      const card = track.querySelector('.collection-card');
      if (!card) return 340;
      const computedGap = parseInt(window.getComputedStyle(track).gap, 10) || 24;
      return card.offsetWidth + computedGap;
    };

    // Click controls
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isRtl = document.documentElement.dir === 'rtl';
      const amount = getScrollAmount();
      track.scrollBy({ left: isRtl ? amount : -amount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isRtl = document.documentElement.dir === 'rtl';
      const amount = getScrollAmount();
      track.scrollBy({ left: isRtl ? -amount : amount, behavior: 'smooth' });
    });

    // Update segmented progress bar and button disabled states
    const updateProgress = () => {
      const scrollLeft = Math.abs(track.scrollLeft);
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) return;

      const progressRatio = scrollLeft / maxScroll;
      const count = segments.length;
      if (count > 0) {
        const activeIndex = Math.min(count - 1, Math.round(progressRatio * (count - 1)));
        segments.forEach((seg, idx) => {
          seg.classList.toggle('active', idx === activeIndex);
        });
      }

      const isRtl = document.documentElement.dir === 'rtl';
      if (!isRtl) {
        prevBtn.disabled = scrollLeft <= 4;
        nextBtn.disabled = scrollLeft >= maxScroll - 4;
      }
    };

    track.addEventListener('scroll', updateProgress, { passive: true });

    // Direct segment click
    segments.forEach((seg, idx) => {
      seg.addEventListener('click', () => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll <= 0 || segments.length <= 1) return;
        const targetScroll = (idx / (segments.length - 1)) * maxScroll;
        track.scrollTo({ left: targetScroll, behavior: 'smooth' });
      });
    });

    // Initial check
    setTimeout(updateProgress, 120);
    window.addEventListener('resize', updateProgress);
  }
});

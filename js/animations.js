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
     3. GROHE-INSPIRED SIGNATURE COLLECTION SLIDER & ARTISTIC MOTION
     ───────────────────────────────────────────────────────────── */
  const track = document.getElementById('collectionTrack');
  const prevBtn = document.getElementById('collPrevBtn');
  const nextBtn = document.getElementById('collNextBtn');
  const progressBar = document.getElementById('collProgressBar');
  const segments = progressBar ? progressBar.querySelectorAll('.progress-segment') : [];
  const showcaseSection = document.getElementById('collections-signatures');

  if (track && prevBtn && nextBtn) {
    const cards = track.querySelectorAll('.collection-card');
    const getScrollAmount = () => {
      const card = track.querySelector('.collection-card');
      if (!card) return 340;
      const computedGap = parseInt(window.getComputedStyle(track).gap, 10) || 24;
      return card.offsetWidth + computedGap;
    };

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

    // Click controls
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof pauseArtisticMotion === 'function') pauseArtisticMotion(4500);
      const isRtl = document.documentElement.dir === 'rtl';
      const amount = getScrollAmount();
      track.scrollBy({ left: isRtl ? amount : -amount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof pauseArtisticMotion === 'function') pauseArtisticMotion(4500);
      const isRtl = document.documentElement.dir === 'rtl';
      const amount = getScrollAmount();
      track.scrollBy({ left: isRtl ? -amount : amount, behavior: 'smooth' });
    });

    // Direct segment click
    segments.forEach((seg, idx) => {
      seg.addEventListener('click', () => {
        if (typeof pauseArtisticMotion === 'function') pauseArtisticMotion(4500);
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll <= 0 || segments.length <= 1) return;
        const targetScroll = (idx / (segments.length - 1)) * maxScroll;
        track.scrollTo({ left: targetScroll, behavior: 'smooth' });
      });
    });

    // Initial check
    setTimeout(updateProgress, 120);
    window.addEventListener('resize', updateProgress);

    /* ─────────────────────────────────────────────────────────
       ARTISTIC AUTO-MOTION CONTROLLER
       - Moves the showcase in an artistic, continuous silky drift
         and staggered floating wave when the mouse is NOT in any card.
       - Immediately pauses when the cursor enters any card,
         allowing the user to inspect specifications and click cleanly.
       ───────────────────────────────────────────────────────── */
    let pauseArtisticMotion = null;

    if (!prefersReducedMotion) {
      let isHovered = false;
      let isInteracting = false;
      let isVisible = false;
      let driftDirection = 1; // 1: forward to TV & Fridge, -1: back to Theros & Eurogas
      let driftPos = Math.abs(track.scrollLeft);
      let pauseUntil = performance.now() + 1600; // gentle startup breath
      let lastTime = performance.now();
      let driftRafId = null;
      let resumeTimeout = null;
      const driftSpeed = 36; // px per second: calm, elegant, museum-grade glide

      pauseArtisticMotion = (durationMs = 4000) => {
        isInteracting = true;
        pauseUntil = performance.now() + durationMs;
        track.classList.remove('is-auto-drifting', 'is-artistic-moving');
        if (showcaseSection) showcaseSection.classList.add('is-interacted');
        clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
          isInteracting = false;
          driftPos = Math.abs(track.scrollLeft);
          if (showcaseSection) showcaseSection.classList.remove('is-interacted');
        }, durationMs);
      };

      const onPointerEnterCard = () => {
        isHovered = true;
        clearTimeout(resumeTimeout);
        track.classList.remove('is-auto-drifting', 'is-artistic-moving');
        track.classList.add('is-paused');
        if (showcaseSection) showcaseSection.classList.add('is-interacted');
        driftPos = Math.abs(track.scrollLeft);
      };

      const onPointerLeaveCard = () => {
        clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
          const anyHovered = Array.from(cards).some(c => c.matches(':hover')) || track.matches(':hover');
          if (!anyHovered) {
            isHovered = false;
            track.classList.remove('is-paused');
            if (showcaseSection) showcaseSection.classList.remove('is-interacted');
            driftPos = Math.abs(track.scrollLeft);
            lastTime = performance.now();
          }
        }, 550);
      };

      cards.forEach(card => {
        card.addEventListener('mouseenter', onPointerEnterCard);
        card.addEventListener('mouseleave', onPointerLeaveCard);
        card.addEventListener('focusin', onPointerEnterCard);
        card.addEventListener('focusout', onPointerLeaveCard);
      });

      track.addEventListener('mouseenter', onPointerEnterCard);
      track.addEventListener('mouseleave', onPointerLeaveCard);

      // Mobile touch interactions
      track.addEventListener('touchstart', () => {
        pauseArtisticMotion(3500);
      }, { passive: true });

      track.addEventListener('touchend', () => {
        pauseArtisticMotion(3000);
      }, { passive: true });

      // Trackpad / wheel horizontal scroll
      track.addEventListener('wheel', () => {
        pauseArtisticMotion(2500);
      }, { passive: true });

      // Only animate when section is in viewport (saves 100% CPU when offscreen)
      if ('IntersectionObserver' in window) {
        const obsTarget = showcaseSection || track;
        const visibilityObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              lastTime = performance.now();
              driftPos = Math.abs(track.scrollLeft);
              if (!driftRafId) {
                driftRafId = requestAnimationFrame(driftStep);
              }
            } else {
              track.classList.remove('is-auto-drifting', 'is-artistic-moving');
            }
          });
        }, { threshold: 0.05 });
        visibilityObserver.observe(obsTarget);
      } else {
        isVisible = true;
        driftRafId = requestAnimationFrame(driftStep);
      }

      function driftStep(now) {
        if (!isVisible) {
          driftRafId = null;
          return;
        }

        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        const maxScroll = track.scrollWidth - track.clientWidth;

        if (maxScroll > 6 && !isHovered && !isInteracting && now > pauseUntil) {
          if (!track.classList.contains('is-auto-drifting')) {
            track.classList.add('is-auto-drifting', 'is-artistic-moving');
          }

          driftPos += driftSpeed * dt * driftDirection;

          if (driftPos >= maxScroll) {
            driftPos = maxScroll;
            driftDirection = -1;
            pauseUntil = now + 2400; // Pause at end to highlight Smart TV & Refrigerator
          } else if (driftPos <= 0) {
            driftPos = 0;
            driftDirection = 1;
            pauseUntil = now + 2400; // Pause at start to highlight Theros & Eurogas
          }

          const isRtl = document.documentElement.dir === 'rtl';
          track.scrollLeft = isRtl ? -driftPos : driftPos;
          updateProgress();
        } else if (isHovered || isInteracting) {
          if (track.classList.contains('is-auto-drifting')) {
            track.classList.remove('is-auto-drifting', 'is-artistic-moving');
          }
        }

        driftRafId = requestAnimationFrame(driftStep);
      }
    }
  }
});

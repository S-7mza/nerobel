/* ─────────────────────────────────────────────────────────────
   NEROBEL GROUP · GLOBAL LOGIC & UI (js/main.js)
   Header scrolling, Mobile menu, Audience tabs, Live Tracker
   ───────────────────────────────────────────────────────────── */

// Toast Notifications Helper
window.showToast = function(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = (type === 'success') ? 'ti-circle-check' : (type === 'error') ? 'ti-alert-circle' : 'ti-info-circle';
  toast.innerHTML = `<i class="ti ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 250);
  }, 4000);
};

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Header Effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile Drawer Toggle
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => drawer.classList.add('open'));
  }
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => drawer.classList.remove('open'));
  }
  if (drawer) {
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => drawer.classList.remove('open'));
    });
  }

  // Dual-Track Audience Switcher (Particuliers / Professionnels)
  const audienceTabs = document.querySelectorAll('.audience-tabs .tab-btn');
  const partContent = document.getElementById('audience-particuliers');
  const proContent = document.getElementById('audience-professionnels');

  if (audienceTabs.length) {
    audienceTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        audienceTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const track = tab.getAttribute('data-track');
        if (track === 'particuliers') {
          if (partContent) partContent.style.display = 'block';
          if (proContent) proContent.style.display = 'none';
        } else {
          if (partContent) partContent.style.display = 'none';
          if (proContent) proContent.style.display = 'block';
        }
      });
    });
  }

  // Form Consent & Required Validation (B2B & Contact)
  function bindStandardForm(formId, successMessage) {
    const form = document.getElementById(formId);
    if (!form) return;

    const consentCheckbox = form.querySelector('input[name="consent"]');
    const consentError = form.querySelector('.form-consent-group .field-error-msg');

    if (consentCheckbox) {
      consentCheckbox.addEventListener('change', () => {
        if (consentCheckbox.checked) {
          consentCheckbox.classList.remove('has-error');
          if (consentError) consentError.classList.remove('visible');
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('input[required]:not([type="checkbox"]), textarea[required], select[required]').forEach((field) => {
        if (!field.value.trim()) {
          field.classList.add('has-error');
          valid = false;
        } else {
          field.classList.remove('has-error');
        }
      });

      if (consentCheckbox) {
        if (!consentCheckbox.checked) {
          consentCheckbox.classList.add('has-error');
          if (consentError) consentError.classList.add('visible');
          valid = false;
        } else {
          consentCheckbox.classList.remove('has-error');
          if (consentError) consentError.classList.remove('visible');
        }
      }

      if (!valid) {
        if (consentCheckbox && !consentCheckbox.checked) {
          window.showToast("Veuillez accepter pour envoyer votre demande.", "error");
        } else {
          window.showToast("Veuillez remplir tous les champs obligatoires.", "error");
        }
        return;
      }

      window.showToast(successMessage, 'success');
      form.reset();
    });
  }

  bindStandardForm('b2bForm', 'Demande partenaire enregistrée avec succès. Notre équipe vous répond rapidement.');
  bindStandardForm('contactForm', 'Message transmis à la direction Nerobel avec succès.');
});

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE PRODUCT DEMONSTRATORS CONTROLLER
   Theros Wi-Fi, Pacific 360° Flex, Eurogas ODS Simulator
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Theros Wi-Fi Live Simulator
  const tempSlider = document.getElementById('therosTempSlider');
  const tempDisplay = document.getElementById('therosTempDisplay');
  const tempDesc = document.getElementById('therosTempDesc');
  const powerBtns = document.querySelectorAll('.power-mode-btn');

  let currentPower = 1300;

  function updateTherosMetrics(temp) {
    if (tempDisplay) tempDisplay.textContent = temp;
    if (tempDesc) {
      if (temp < 45) tempDesc.textContent = "Mode Éco Douceur · Consommation maîtrisée";
      else if (temp <= 60) tempDesc.textContent = "Température Idéale · Confort Famille & Douche";
      else tempDesc.textContent = "Température Élevée · Grand Volume 75 °C";
    }
  }

  if (tempSlider) {
    tempSlider.addEventListener('input', (e) => {
      updateTherosMetrics(parseInt(e.target.value), currentPower);
    });
  }

  if (powerBtns.length) {
    powerBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        powerBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        currentPower = parseInt(btn.getAttribute('data-power'));
        const temp = tempSlider ? parseInt(tempSlider.value) : 55;
        updateTherosMetrics(temp, currentPower);
      });

      // Keyboard arrow navigation for radiogroup
      btn.addEventListener('keydown', (e) => {
        let nextBtn = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          nextBtn = powerBtns[(idx + 1) % powerBtns.length];
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          nextBtn = powerBtns[(idx - 1 + powerBtns.length) % powerBtns.length];
        }
        if (nextBtn) {
          e.preventDefault();
          nextBtn.focus();
          nextBtn.click();
        }
      });
    });
  }

  // Brand Tabs Navigation Controller (S3-01)
  const brandTabs = document.querySelectorAll('.brand-tabs__link');
  if (brandTabs.length) {
    brandTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const href = tab.getAttribute('href');
        if (href && href.startsWith('#')) {
          brandTabs.forEach(t => {
            t.classList.remove('active');
            t.removeAttribute('aria-current');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-current', 'true');
        }
      });
    });

    const sections = ['#theros', '#eurogas', '#nerobel']
      .map(id => document.querySelector(id))
      .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = '#' + entry.target.id;
            brandTabs.forEach(tab => {
              if (tab.getAttribute('href') === id) {
                tab.classList.add('active');
                tab.setAttribute('aria-current', 'true');
              } else if (tab.getAttribute('href') && tab.getAttribute('href').startsWith('#')) {
                tab.classList.remove('active');
                tab.removeAttribute('aria-current');
              }
            });
          }
        });
      }, { rootMargin: '-20% 0px -60% 0px' });

      sections.forEach(sec => observer.observe(sec));
    }
  }

  // 2. Pacific 360° Installation Mode Toggle
  const btnH = document.getElementById('btnPacificH');
  const btnV = document.getElementById('btnPacificV');
  const tankVisual = document.getElementById('pacificTankVisual');
  const visualLabel = document.getElementById('pacificVisualLabel');
  const specTag = document.getElementById('pacificSpecTag');

  if (btnH && btnV && tankVisual) {
    btnH.addEventListener('click', () => {
      btnH.classList.add('active');
      btnV.classList.remove('active');
      tankVisual.classList.remove('vertical');
      if (visualLabel) visualLabel.textContent = "PACIFIC 80L (H)";
      if (specTag) specTag.textContent = "Parfait pour faux-plafonds, couloirs étroits ou au-dessus d'une machine à laver.";
    });

    btnV.addEventListener('click', () => {
      btnV.classList.add('active');
      btnH.classList.remove('active');
      tankVisual.classList.add('vertical');
      if (visualLabel) visualLabel.textContent = "PACIFIC 80L (V)";
      if (specTag) specTag.textContent = "Idéal pour niches de salle de bain murales et angles restreints standard.";
    });
  }

  // 3. Eurogas ODS Safety Simulator
  const btnTestOds = document.getElementById('btnTestOds');
  const odsCard = document.getElementById('odsStatusCard');
  const odsTitle = document.getElementById('odsStateTitle');
  const odsDesc = document.getElementById('odsStateDesc');
  const odsBadge = document.getElementById('odsBadge');
  const odsFlame = document.getElementById('odsFlameIcon');

  if (btnTestOds && odsCard) {
    btnTestOds.addEventListener('click', () => {
      btnTestOds.disabled = true;
      odsCard.classList.add('alert');
      if (odsTitle) odsTitle.textContent = "Sécurité ODS Activée";
      if (odsDesc) odsDesc.textContent = "Arrêt automatique de l'arrivée de gaz";
      if (odsBadge) {
        odsBadge.className = "badge badge-err";
        odsBadge.textContent = "SÉCURITÉ COUPÉE";
      }

      window.showToast("Test ODS : Arrêt automatique de l'arrivée de gaz simulé.", "success");

      setTimeout(() => {
        odsCard.classList.remove('alert');
        if (odsTitle) odsTitle.textContent = "Combustion Normale";
        if (odsDesc) odsDesc.textContent = "Sécurité ODS active · Arrivée gaz ouverte";
        if (odsBadge) {
          odsBadge.className = "badge badge-ok";
          odsBadge.textContent = "NORMAL";
        }
        btnTestOds.disabled = false;
      }, 3500);
    });
  }

  // 4. Hero Background Cinematic Slider
  const heroSection = document.getElementById('heroSection');
  const heroCard = document.getElementById('heroContextCard');
  const slides = document.querySelectorAll('.hero-bg-slide');
  const eyebrowEl = document.getElementById('heroContextEyebrow');
  const titleEl = document.getElementById('heroContextTitle');
  const descEl = document.getElementById('heroContextDesc');
  const counterEl = document.getElementById('heroContextCounter');
  const infoEl = document.getElementById('heroContextInfo');
  const indicators = document.querySelectorAll('.hero-nav-indicators .indicator-bar');
  const prevBtn = document.getElementById('heroPrevSlide');
  const nextBtn = document.getElementById('heroNextSlide');

  if (slides.length > 0) {
    const slidesData = [
      {
        eyebrow: "Theros",
        title: "Theros Pro-Slim",
        desc: "Connecté Wi-Fi · Écran tactile digital · Finition titane brossé"
      },
      {
        eyebrow: "Nerobel",
        title: "Smart TV OLED 4K 65\"",
        desc: "Dalle OLED 4K · Finition noir graphite brossé · Google TV"
      },
      {
        eyebrow: "Eurogas",
        title: "Eurogas Master Flame",
        desc: "Allumage basse pression · Sécurité ODS · Eau chaude instantanée"
      },
      {
        eyebrow: "Nerobel",
        title: "Climatiseur Split Inverter R32",
        desc: "Capacité 12 000 / 18 000 BTU · Fluide R32 · Contrôle Wi-Fi"
      }
    ];

    let currentSlide = 0;
    let slideTimer = null;
    const intervalDuration = 7000;

    function updateSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentSlide = index;
      const data = slidesData[currentSlide] || slidesData[0];

      // Update background slide layers
      slides.forEach((s, idx) => {
        if (idx === currentSlide) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });

      // Update story progress bar indicators (monochrome pure white fill)
      indicators.forEach((bar, idx) => {
        bar.classList.remove('active', 'completed');
        const fill = bar.querySelector('.bar-fill');
        if (fill) {
          fill.style.animation = 'none';
          void fill.offsetWidth; // Force reflow to cleanly restart CSS animation
        }

        if (idx < currentSlide) {
          bar.classList.add('completed');
        } else if (idx === currentSlide) {
          bar.classList.add('active');
          if (fill) fill.style.animation = '';
        }
      });

      // Update slide counter
      if (counterEl) {
        const currentPad = String(currentSlide + 1).padStart(2, '0');
        const totalPad = String(slides.length).padStart(2, '0');
        counterEl.textContent = `${currentPad}/${totalPad}`;
      }

      // Text Micro-transitions
      if (infoEl) {
        infoEl.classList.add('text-animating');
        setTimeout(() => {
          if (eyebrowEl) eyebrowEl.textContent = data.eyebrow;
          if (titleEl) titleEl.textContent = data.title;
          if (descEl) descEl.textContent = data.desc;
          infoEl.classList.remove('text-animating');
        }, 180);
      } else {
        if (eyebrowEl) eyebrowEl.textContent = data.eyebrow;
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
      }
    }

    function startTimer() {
      stopTimer();
      slideTimer = setInterval(() => {
        updateSlide(currentSlide + 1);
      }, intervalDuration);
    }

    function stopTimer() {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        updateSlide(currentSlide - 1);
        startTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        updateSlide(currentSlide + 1);
        startTimer();
      });
    }

    indicators.forEach((bar, idx) => {
      bar.addEventListener('click', () => {
        updateSlide(idx);
        startTimer();
      });
    });

    if (heroSection) {
      heroSection.addEventListener('mouseenter', () => {
        stopTimer();
        heroSection.classList.add('is-paused');
      });
      heroSection.addEventListener('mouseleave', () => {
        heroSection.classList.remove('is-paused');
        startTimer();
      });

      // Touch swipe gestures for mobile
      let touchStartX = 0;
      heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroSection.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        if (Math.abs(diffX) > 45) {
          if (diffX < 0) {
            updateSlide(currentSlide + 1); // Swipe left -> next
          } else {
            updateSlide(currentSlide - 1); // Swipe right -> prev
          }
          startTimer();
        }
      }, { passive: true });
    }

    // Keyboard navigation when user is on page
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        const rect = heroSection?.getBoundingClientRect();
        if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
          updateSlide(currentSlide - 1);
          startTimer();
        }
      } else if (e.key === 'ArrowRight') {
        const rect = heroSection?.getBoundingClientRect();
        if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
          updateSlide(currentSlide + 1);
          startTimer();
        }
      }
    });

    updateSlide(0);
    startTimer();
  }
});



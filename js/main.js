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

  // Form Submission & Hand-off Management (B2B & Contact, S3-03)
  function bindStandardForm(formId, formType) {
    const form = document.getElementById(formId);
    if (!form) return;

    const consentCheckbox = form.querySelector('input[name="consent"]');
    const consentError = form.querySelector('.form-consent-group .field-error-msg');
    const parent = form.parentElement;
    const feedbackBox = parent ? parent.querySelector('.form-feedback-card') : null;
    const errorBox = parent ? parent.querySelector('.form-submit-error') : null;

    if (consentCheckbox) {
      consentCheckbox.addEventListener('change', () => {
        if (consentCheckbox.checked) {
          consentCheckbox.classList.remove('has-error');
          if (consentError) consentError.classList.remove('visible');
        }
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot spam protection
      const hp = form.querySelector('input[name="_hp"]');
      if (hp && hp.value) return;

      if (errorBox) errorBox.style.display = 'none';

      let valid = true;
      let firstInvalid = null;
      form.querySelectorAll('input[required]:not([type="checkbox"]), textarea[required], select[required]').forEach((field) => {
        if (!field.value.trim() || !field.checkValidity()) {
          field.classList.add('has-error');
          valid = false;
          if (!firstInvalid) firstInvalid = field;
        } else {
          field.classList.remove('has-error');
        }
      });

      if (consentCheckbox) {
        if (!consentCheckbox.checked) {
          consentCheckbox.classList.add('has-error');
          if (consentError) consentError.classList.add('visible');
          valid = false;
          if (!firstInvalid) firstInvalid = consentCheckbox;
        } else {
          consentCheckbox.classList.remove('has-error');
          if (consentError) consentError.classList.remove('visible');
        }
      }

      if (!valid) {
        if (firstInvalid) firstInvalid.focus();
        if (consentCheckbox && !consentCheckbox.checked && firstInvalid === consentCheckbox) {
          window.showToast("Veuillez accepter pour envoyer votre demande.", "error");
        } else {
          window.showToast("Veuillez remplir tous les champs obligatoires.", "error");
        }
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      // Extract field values
      const formData = new FormData(form);
      const fields = {};
      const brandValues = [];
      formData.forEach((val, key) => {
        if (key === 'brands') {
          brandValues.push(val);
        } else if (key !== '_hp' && key !== 'consent') {
          fields[key] = val;
        }
      });
      if (brandValues.length) {
        fields.brands = brandValues.join(', ');
      }

      // Build WhatsApp or mailto hand-off URL
      let handoffUrl = '';
      if (formType === 'contact') {
        const deptNames = {
          commercial: 'Direction Commerciale & Ventes',
          partenariat: 'Partenariat Professionnel & Distribution',
          presse: 'Direction Générale & Presse'
        };
        const deptLabel = deptNames[fields.dept] || fields.dept || 'Général';
        const lines = [
          "Bonjour Nerobel, voici mon message de contact :",
          `- Nom : ${fields.name || ''}`,
          `- Téléphone : ${fields.phone || ''}`,
          `- Email : ${fields.email || 'Non précisé'}`,
          `- Département : ${deptLabel}`,
          `- Message : ${fields.message || ''}`
        ];
        handoffUrl = `https://wa.me/212787013201?text=${encodeURIComponent(lines.join('\n'))}`;
      } else if (formType === 'b2b') {
        const bodyLines = [
          "Demande d'ouverture de compte professionnel Nerobel :",
          `- Société : ${fields.company || ''}`,
          `- ICE / RC : ${fields.ice || 'Non précisé'}`,
          `- Responsable : ${fields.contact || ''}`,
          `- Téléphone : ${fields.phone || ''}`,
          `- Email : ${fields.email || ''}`,
          `- Ville : ${fields.city || ''}`,
          `- Activité : ${fields.activity || ''}`,
          `- Marques : ${fields.brands || 'Toutes les marques'}`,
          `- Message : ${fields.message || 'Aucun message spécifique'}`
        ];
        handoffUrl = `mailto:contact@nerobel.com?subject=${encodeURIComponent("Demande Compte Pro - " + (fields.company || 'Partenaire'))}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
      }

      if (formType === 'b2b' && window.nerobelAnalytics) {
        window.nerobelAnalytics.track('b2b_submit', {
          type: fields.activity || '',
          city: fields.city || ''
        });
      } else if (formType === 'contact' && window.nerobelAnalytics) {
        window.nerobelAnalytics.track('contact_submit', {
          dept: fields.dept || ''
        });
      }

      // If a real backend endpoint is configured (O-09)
      if (window.nerobelFormEndpoint) {
        try {
          const res = await fetch(window.nerobelFormEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              form: formType,
              fields,
              consent: true,
              timestamp: Date.now()
            })
          });

          if (!res.ok) throw new Error('Submission error');

          form.style.display = 'none';
          if (feedbackBox) {
            feedbackBox.style.display = 'block';
            const link = feedbackBox.querySelector('.btn-handoff');
            if (link && handoffUrl) link.href = handoffUrl;
          }
          window.showToast("Votre message a été transmis avec succès.", "success");
          return;
        } catch (err) {
          if (submitBtn) submitBtn.disabled = false;
          if (errorBox) {
            errorBox.style.display = 'block';
            const errorLink = errorBox.querySelector('a');
            if (errorLink && handoffUrl) errorLink.href = handoffUrl;
          }
          window.showToast("L'envoi a échoué. Réessayez ou écrivez-nous sur WhatsApp.", "error");
          return;
        }
      }

      // Default hand-off mode (O-09 open): WhatsApp or mailto
      form.style.display = 'none';
      if (feedbackBox) {
        feedbackBox.style.display = 'block';
        const link = feedbackBox.querySelector('.btn-handoff');
        if (link && handoffUrl) link.href = handoffUrl;
      }
      window.showToast("Votre message est prêt : appuyez sur Envoyer pour finaliser.", "info");

      try {
        if (handoffUrl.startsWith('https:')) {
          window.open(handoffUrl, '_blank', 'noopener');
        } else {
          window.location.href = handoffUrl;
        }
      } catch (e) {}
    });
  }

  function initB2BActivityPreselection() {
    const select = document.getElementById('b2bActivity');
    if (!select) return;

    const setActivity = (val) => {
      if (!val) return;
      const normalized = val.toLowerCase().trim();
      const map = {
        'installateur': 'installateur',
        'plombier': 'installateur',
        'revendeur': 'revendeur',
        'promoteur': 'promoteur',
        'constructeur': 'promoteur',
        'bureau': 'bureau_etudes',
        'bureau_etudes': 'bureau_etudes',
        'architecte': 'bureau_etudes'
      };
      const targetVal = map[normalized] || normalized;
      for (const opt of select.options) {
        if (opt.value === targetVal) {
          select.value = targetVal;
          break;
        }
      }
    };

    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    if (typeParam) {
      setActivity(typeParam);
    }

    const checkHash = () => {
      if (window.location.hash.includes('type=')) {
        const hashQuery = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : window.location.hash.replace('#', '');
        const hashParams = new URLSearchParams(hashQuery);
        if (hashParams.get('type')) {
          setActivity(hashParams.get('type'));
        }
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    document.querySelectorAll('.btn-b2b-target').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        if (type) setActivity(type);
      });
    });
  }

  function initContactDeptPreselection() {
    const deptSelect = document.getElementById('contactDept');
    if (!deptSelect) return;

    const notice = document.getElementById('contactPartenariatNotice');
    const updateNotice = () => {
      if (notice) {
        notice.style.display = deptSelect.value === 'partenariat' ? 'block' : 'none';
      }
    };

    const setDept = (dept) => {
      if (!dept) return;
      const normalized = dept.toLowerCase().trim();
      const map = {
        'commercial': 'commercial',
        'ventes': 'commercial',
        'partenariat': 'partenariat',
        'distribution': 'partenariat',
        'presse': 'presse',
        'direction': 'presse'
      };
      const targetVal = map[normalized] || normalized;
      for (const opt of deptSelect.options) {
        if (opt.value === targetVal) {
          deptSelect.value = targetVal;
          break;
        }
      }
      updateNotice();
    };

    deptSelect.addEventListener('change', updateNotice);

    const params = new URLSearchParams(window.location.search);
    const deptParam = params.get('dept');
    if (deptParam) {
      setDept(deptParam);
    }

    document.querySelectorAll('.contact-path-card[data-dept]').forEach(card => {
      card.addEventListener('click', (e) => {
        if (window.location.pathname.endsWith('contact.html') || window.location.pathname.endsWith('contact') || window.location.pathname.endsWith('/')) {
          const dept = card.getAttribute('data-dept');
          if (dept) {
            e.preventDefault();
            setDept(dept);
            const formEl = document.getElementById('contactForm');
            if (formEl) {
              formEl.scrollIntoView({ behavior: 'smooth' });
              setTimeout(() => deptSelect.focus(), 300);
            }
          }
        }
      });
    });

    updateNotice();
  }

  function syncFooterAccordions() {
    const isDesktop = window.innerWidth >= 768;
    document.querySelectorAll('details.footer-col').forEach(details => {
      if (isDesktop) {
        details.setAttribute('open', '');
      } else {
        details.removeAttribute('open');
      }
    });
  }

  window.addEventListener('resize', syncFooterAccordions);
  syncFooterAccordions();

  bindStandardForm('b2bForm', 'b2b');
  bindStandardForm('contactForm', 'contact');
  initB2BActivityPreselection();
  initContactDeptPreselection();
});

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE PRODUCT DEMONSTRATORS CONTROLLER
   Theros Wi-Fi, Eurogas ODS Simulator
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Theros Wi-Fi Live Simulator
  const tempSlider = document.getElementById('therosTempSlider');
  const tempDisplay = document.getElementById('therosTempDisplay');
  const tempDesc = document.getElementById('therosTempDesc');
  const durationDisplay = document.getElementById('therosDuration');
  const readyTimeDisplay = document.getElementById('therosReadyTime');
  const powerBtns = document.querySelectorAll('.power-mode-btn');

  let currentPower = 1300;

  function updateTherosMetrics(temp, power) {
    if (tempDisplay) tempDisplay.textContent = temp;
    if (tempDesc) {
      if (temp < 45) tempDesc.textContent = "Mode Éco Douceur · Consommation maîtrisée";
      else if (temp <= 60) tempDesc.textContent = "Température Idéale · Confort Famille & Douche";
      else tempDesc.textContent = "Température Élevée · Grand Volume 75 °C";
    }

    const effectivePower = power || currentPower;
    const baseMinutes = Math.round((temp - 18) * 0.7);
    const powerFactor = effectivePower === 2000 ? 0.6 : (effectivePower === 500 ? 1.8 : 1.0);
    const durationMinutes = Math.max(5, Math.round(baseMinutes * powerFactor));

    if (durationDisplay) {
      if (durationMinutes >= 60) {
        const h = Math.floor(durationMinutes / 60);
        const m = durationMinutes % 60;
        durationDisplay.textContent = m > 0 ? `~${h}h ${m}min` : `~${h}h`;
      } else {
        durationDisplay.textContent = `~${durationMinutes} min`;
      }
    }

    if (readyTimeDisplay) {
      const now = new Date();
      const readyDate = new Date(now.getTime() + durationMinutes * 60 * 1000);
      const hours = String(readyDate.getHours()).padStart(2, '0');
      const mins = String(readyDate.getMinutes()).padStart(2, '0');
      readyTimeDisplay.textContent = `${hours}h${mins}`;
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

  // Initialize Theros simulator default metrics on page load
  if (tempSlider) {
    updateTherosMetrics(parseInt(tempSlider.value) || 55, currentPower);
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

    const sections = ['#theros', '#eurogas']
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

  // 2. Eurogas ODS Safety Simulator
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

    function isMobileOrReducedMotion() {
      const isMobile = window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return isMobile || reducedMotion;
    }

    function startTimer() {
      stopTimer();
      if (isMobileOrReducedMotion()) return; // Doctrine Rule 5: No autoplay on phones
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

    // 5. Mobile Image-First Carousel Integration (Sprint MS-02)
    const mobileTrack = document.getElementById('mobileHeroTrack');
    const mobileDots = document.querySelectorAll('.mobile-carousel-dots .mobile-dot');
    const mobileCounter = document.getElementById('mobileCarouselCounter');
    const mobileSlides = document.querySelectorAll('.mobile-slide');

    if (mobileTrack && mobileSlides.length > 0) {
      function updateMobileActive(index) {
        mobileDots.forEach((dot, idx) => {
          const isActive = idx === index;
          dot.classList.toggle('active', isActive);
          dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        if (mobileCounter) {
          mobileCounter.textContent = `${index + 1} / ${mobileSlides.length}`;
        }
      }

      mobileDots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
          const targetSlide = mobileSlides[idx];
          if (targetSlide) {
            targetSlide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            updateMobileActive(idx);
          }
        });
      });

      // Synchronize scroll snap with dots
      let scrollDebounce = null;
      mobileTrack.addEventListener('scroll', () => {
        if (scrollDebounce) cancelAnimationFrame(scrollDebounce);
        scrollDebounce = requestAnimationFrame(() => {
          const trackRect = mobileTrack.getBoundingClientRect();
          const trackCenter = trackRect.left + trackRect.width / 2;
          let closestIdx = 0;
          let minDiff = Infinity;

          mobileSlides.forEach((slide, idx) => {
            const slideRect = slide.getBoundingClientRect();
            const slideCenter = slideRect.left + slideRect.width / 2;
            const diff = Math.abs(trackCenter - slideCenter);
            if (diff < minDiff) {
              minDiff = diff;
              closestIdx = idx;
            }
          });

          updateMobileActive(closestIdx);
        });
      }, { passive: true });
    }
  }
});



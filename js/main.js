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
    powerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        powerBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPower = parseInt(btn.getAttribute('data-power'));
        const temp = tempSlider ? parseInt(tempSlider.value) : 55;
        updateTherosMetrics(temp, currentPower);
      });
    });
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
});



/* ─────────────────────────────────────────────────────────────
   NEROBEL GROUP · SAV SUPPORT ENGINE (js/sav.js) - v3.0
   Full Native 3-Step Wizard, Category Brand Routing, GPS Leaflet Modal,
   Live Webcam / File Compression, Accessible Validation, & WhatsApp Bridge
   ───────────────────────────────────────────────────────────── */

class SavPortal {
  constructor() {
    this.currentStep = 1;
    this.data = {
      type: 'electric',
      fullName: '',
      phone: '',
      city: 'Casablanca',
      otherCity: '',
      address: '',
      gps: null,
      brand: 'Theros',
      serial: '',
      noSerial: false,
      symptom: "Pas d'eau chaude",
      description: '',
      photo: null,
      photoName: '',
      consent: false,
      ticketCode: null
    };

    this.leafletMap = null;
    this.webcamStream = null;
    this.lastTriggerElement = null;
  }

  init() {
    this.bindTypeSelection();
    this.bindCitySelection();
    this.bindSerialCheckbox();
    this.bindChangeDevice();
    this.bindNavigation();
    this.bindModals();
    this.bindDropzone();
    this.bindGps();
    this.bindWebcam();
    this.bindDraft();
    this.bindSubmission();

    // Check camera availability
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const webcamBtn = document.getElementById('btnWebcamTrigger');
      if (webcamBtn) webcamBtn.style.display = 'none';
    }

    // Load draft first if available
    this.loadDraft();

    // URL parameter ?brand= takes precedence and starts on Step 2
    this.handleBrandParam();
  }

  // ─────────────────────────────────────────
  // BRAND PARAMETER & CATEGORY ROUTING
  // ─────────────────────────────────────────
  handleBrandParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const brandParam = urlParams.get('brand');
    if (!brandParam) {
      this.updateBrandSelectForType(this.data.type || 'electric');
      return;
    }

    const norm = brandParam.trim().toLowerCase();
    if (norm === 'theros') {
      this.setCategoryAndBrand('electric', 'Theros', true);
    } else if (norm === 'pacific') {
      this.setCategoryAndBrand('electric', 'Pacific', true);
    } else if (norm === 'eurogas') {
      this.setCategoryAndBrand('gas', 'Eurogas', true);
    } else if (norm === 'nerobel') {
      this.setCategoryAndBrand('appliances', 'Nerobel', true);
    } else {
      this.updateBrandSelectForType(this.data.type || 'electric');
    }
  }

  setCategoryAndBrand(type, brand, fromQueryParam = false) {
    this.data.type = type;
    this.data.brand = brand;

    // Update Step 1 active card
    const cards = document.querySelectorAll('.type-select-card');
    cards.forEach(c => {
      if (c.getAttribute('data-type') === type) {
        c.classList.add('selected');
      } else {
        c.classList.remove('selected');
      }
    });

    this.updateBrandSelectForType(type, brand);

    // Update banner
    const banner = document.getElementById('changeDeviceBanner');
    const selectedText = document.getElementById('selectedDeviceText');
    if (banner && selectedText) {
      const typeNames = {
        electric: 'Chauffe-eau Électrique',
        gas: 'Chauffe-eau à Gaz',
        appliances: 'Électroménager & Télévision'
      };
      selectedText.textContent = `${brand} (${typeNames[type] || type})`;
      banner.style.display = 'flex';
    }

    if (fromQueryParam) {
      this.currentStep = 2;
      this.updateUI();
    }
  }

  updateBrandSelectForType(type, preselectedBrand = null) {
    const brandSelect = document.getElementById('savBrand');
    if (!brandSelect) return;

    brandSelect.innerHTML = '';

    if (type === 'gas') {
      const opt = document.createElement('option');
      opt.value = 'Eurogas';
      opt.textContent = 'Eurogas (Chauffe-eau à gaz)';
      opt.selected = true;
      brandSelect.appendChild(opt);
      brandSelect.disabled = true;
      this.data.brand = 'Eurogas';
    } else if (type === 'appliances') {
      const opt = document.createElement('option');
      opt.value = 'Nerobel';
      opt.textContent = 'Nerobel (Électroménager & Télévision)';
      opt.selected = true;
      brandSelect.appendChild(opt);
      brandSelect.disabled = true;
      this.data.brand = 'Nerobel';
    } else {
      // electric: Theros and Pacific
      const opt1 = document.createElement('option');
      opt1.value = 'Theros';
      opt1.textContent = 'Theros (Électrique)';

      const opt2 = document.createElement('option');
      opt2.value = 'Pacific';
      opt2.textContent = 'Pacific (Électrique Multi-Position)';

      brandSelect.appendChild(opt1);
      brandSelect.appendChild(opt2);
      brandSelect.disabled = false;

      if (preselectedBrand === 'Pacific') {
        brandSelect.value = 'Pacific';
        this.data.brand = 'Pacific';
      } else {
        brandSelect.value = 'Theros';
        this.data.brand = 'Theros';
      }
    }
  }

  bindChangeDevice() {
    const btn = document.getElementById('btnChangeDevice');
    if (btn) {
      btn.addEventListener('click', () => {
        this.goToStep(1);
      });
    }
  }

  // ─────────────────────────────────────────
  // STEP 1: TYPE SELECTION
  // ─────────────────────────────────────────
  bindTypeSelection() {
    const cards = document.querySelectorAll('.type-select-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const chosenType = card.getAttribute('data-type');
        this.data.type = chosenType;
        this.updateBrandSelectForType(chosenType);

        // Update banner text if visible
        const selectedText = document.getElementById('selectedDeviceText');
        const typeNames = {
          electric: 'Chauffe-eau Électrique',
          gas: 'Chauffe-eau à Gaz',
          appliances: 'Électroménager & Télévision'
        };
        if (selectedText) {
          selectedText.textContent = `${this.data.brand} (${typeNames[chosenType] || chosenType})`;
        }
        this.saveDraft();
      });
    });
  }

  // ─────────────────────────────────────────
  // CITIES & OTHER CITY HANDLER
  // ─────────────────────────────────────────
  bindCitySelection() {
    const citySelect = document.getElementById('savCity');
    const otherCityInput = document.getElementById('savOtherCity');
    if (!citySelect || !otherCityInput) return;

    citySelect.addEventListener('change', () => {
      if (citySelect.value === 'Autre ville') {
        otherCityInput.style.display = 'block';
        otherCityInput.focus();
      } else {
        otherCityInput.style.display = 'none';
        otherCityInput.value = '';
      }
      this.saveDraft();
    });
  }

  // ─────────────────────────────────────────
  // SERIAL NUMBER CHECKBOX
  // ─────────────────────────────────────────
  bindSerialCheckbox() {
    const noSerialCheck = document.getElementById('savNoSerial');
    const serialInput = document.getElementById('savSerial');
    const reqMark = document.getElementById('savSerialReqMark');
    const dropzoneHint = document.getElementById('dropzoneHint');

    if (!noSerialCheck || !serialInput) return;

    noSerialCheck.addEventListener('change', () => {
      const isChecked = noSerialCheck.checked;
      this.data.noSerial = isChecked;

      if (isChecked) {
        serialInput.disabled = true;
        serialInput.value = '';
        this.markFieldError(serialInput, false);
        if (reqMark) reqMark.style.display = 'none';
        if (dropzoneHint) dropzoneHint.textContent = "Ajoutez une photo de l'appareil ou de la facture (max 10 Mo)";
      } else {
        serialInput.disabled = false;
        if (reqMark) reqMark.style.display = 'inline';
        if (dropzoneHint) dropzoneHint.textContent = 'JPG, PNG ou PDF (max 10 Mo)';
      }
      this.saveDraft();
    });
  }

  // ─────────────────────────────────────────
  // STEP NAVIGATION & ACCESSIBLE VALIDATION
  // ─────────────────────────────────────────
  goToStep(stepNumber) {
    if (stepNumber === 2 && this.currentStep === 1) {
      if (!this.data.type) {
        if (window.showToast) window.showToast("Veuillez sélectionner un type d'appareil", "error");
        return;
      }
    }

    if (stepNumber === 3 && this.currentStep === 2) {
      if (!this.validateStep2()) {
        return;
      }
      this.populateReview();
    }

    this.currentStep = stepNumber;
    this.updateUI();
    window.scrollTo({ top: document.querySelector('.sav-main-card').offsetTop - 90, behavior: 'smooth' });
  }

  validateStep2() {
    let isValid = true;
    const errors = [];

    const nameInput = document.getElementById('savFullName');
    const phoneInput = document.getElementById('savPhone');
    const serialInput = document.getElementById('savSerial');
    const noSerialCheck = document.getElementById('savNoSerial');
    const consentInput = document.getElementById('savConsent');
    const consentError = document.getElementById('savConsentError');
    const errorSummary = document.getElementById('step2ErrorSummary');
    const errorList = document.getElementById('step2ErrorList');

    // Name Validation
    if (!nameInput.value.trim()) {
      this.markFieldError(nameInput, true);
      errors.push({ id: 'savFullName', element: nameInput, text: 'Nom et Prénom : ce champ est obligatoire.' });
      isValid = false;
    } else {
      this.markFieldError(nameInput, false);
      this.data.fullName = nameInput.value.trim();
    }

    // Phone Validation (Moroccan numbers)
    const phoneVal = phoneInput.value.trim().replace(/\s+/g, '');
    const moroccoRegex = /^(?:0[5-7]\d{8}|\+212[5-7]\d{8}|[5-7]\d{8})$/;
    if (!moroccoRegex.test(phoneVal)) {
      this.markFieldError(phoneInput, true);
      errors.push({ id: 'savPhone', element: phoneInput, text: 'Numéro de Téléphone : numéro marocain invalide (ex: 0612345678).' });
      isValid = false;
    } else {
      this.markFieldError(phoneInput, false);
      this.data.phone = phoneVal.startsWith('+212') ? phoneVal : phoneVal.startsWith('0') ? '+212' + phoneVal.substring(1) : '+212' + phoneVal;
    }

    // Serial Number Validation
    const isNoSerial = noSerialCheck ? noSerialCheck.checked : false;
    if (isNoSerial) {
      this.markFieldError(serialInput, false);
      this.data.serial = 'Non renseigné (sans plaque visible)';
    } else {
      const serialVal = serialInput.value.trim();
      const serialErrorText = document.getElementById('savSerialErrorText');
      if (!serialVal) {
        if (serialErrorText) serialErrorText.textContent = 'Ce champ est obligatoire';
        this.markFieldError(serialInput, true);
        errors.push({ id: 'savSerial', element: serialInput, text: 'Numéro de Série : ce champ est obligatoire (ou cochez « Je ne trouve pas mon numéro de série »).' });
        isValid = false;
      } else if (serialVal.length < 6) {
        if (serialErrorText) serialErrorText.textContent = 'Format invalide';
        this.markFieldError(serialInput, true);
        errors.push({ id: 'savSerial', element: serialInput, text: 'Numéro de Série : format invalide (minimum 6 caractères).' });
        isValid = false;
      } else {
        this.markFieldError(serialInput, false);
        this.data.serial = serialVal.toUpperCase();
      }
    }

    // City and Address
    const citySelect = document.getElementById('savCity');
    const otherCityInput = document.getElementById('savOtherCity');
    if (citySelect) {
      if (citySelect.value === 'Autre ville' && otherCityInput && otherCityInput.value.trim()) {
        this.data.city = otherCityInput.value.trim();
      } else {
        this.data.city = citySelect.value;
      }
    }

    const addressInput = document.getElementById('savAddress');
    this.data.address = addressInput ? addressInput.value.trim() : '';

    const brandSelect = document.getElementById('savBrand');
    if (brandSelect) {
      this.data.brand = brandSelect.value;
    }

    const problemSelect = document.getElementById('savProblem');
    if (problemSelect) {
      this.data.symptom = problemSelect.value;
    }

    const descInput = document.getElementById('savDescription');
    if (descInput) {
      this.data.description = descInput.value.trim();
    }

    // Consent Validation
    if (consentInput) {
      if (!consentInput.checked) {
        consentInput.classList.add('has-error');
        if (consentError) consentError.classList.add('visible');
        consentInput.setAttribute('aria-invalid', 'true');
        consentInput.setAttribute('aria-describedby', 'savConsentError');
        errors.push({ id: 'savConsent', element: consentInput, text: 'Consentement : veuillez accepter l\'utilisation de vos données pour envoyer votre demande.' });
        isValid = false;
      } else {
        consentInput.classList.remove('has-error');
        if (consentError) consentError.classList.remove('visible');
        consentInput.removeAttribute('aria-invalid');
        consentInput.removeAttribute('aria-describedby');
        this.data.consent = true;
      }
    }

    // Error Summary Management
    if (!isValid && errors.length > 0) {
      if (errorSummary && errorList) {
        errorList.innerHTML = errors.map(err => `<li><a href="#${err.id}">${err.text}</a></li>`).join('');
        errorSummary.style.display = 'block';
      }
      // Move focus to first invalid field
      errors[0].element.focus();
      if (window.showToast) {
        window.showToast("Veuillez corriger les champs en rouge avant de continuer", "error");
      }
    } else {
      if (errorSummary) errorSummary.style.display = 'none';
    }

    return isValid;
  }

  markFieldError(inputEl, isError) {
    if (!inputEl) return;
    inputEl.classList.toggle('has-error', isError);
    if (isError) {
      inputEl.setAttribute('aria-invalid', 'true');
      inputEl.setAttribute('aria-describedby', `${inputEl.id}Error`);
    } else {
      inputEl.removeAttribute('aria-invalid');
      inputEl.removeAttribute('aria-describedby');
    }
    const errorMsg = document.getElementById(`${inputEl.id}Error`) || inputEl.parentElement.querySelector('.field-error-msg');
    if (errorMsg) {
      errorMsg.classList.toggle('visible', isError);
    }
  }

  updateUI() {
    document.querySelectorAll('.sav-step').forEach(step => step.classList.remove('active'));
    const targetStep = document.getElementById(`sav-step-${this.currentStep}`);
    if (targetStep) targetStep.classList.add('active');

    const b1 = document.getElementById('bar-1');
    const b2 = document.getElementById('bar-2');
    const b3 = document.getElementById('bar-3');

    if (b1 && b2 && b3) {
      b1.className = `step-bar ${this.currentStep > 1 ? 'completed' : 'active'}`;
      b2.className = `step-bar ${this.currentStep > 2 ? 'completed' : this.currentStep === 2 ? 'active' : ''}`;
      b3.className = `step-bar ${this.currentStep === 3 ? 'active' : ''}`;
    }

    const indicator = document.getElementById('stepIndicator');
    if (indicator) {
      const stepName = (this.currentStep === 1) ? "Type d'Appareil" : (this.currentStep === 2) ? "Informations & Panne" : "Récapitulatif & Validation";
      indicator.textContent = `Étape ${this.currentStep} sur 3 · ${stepName}`;
    }
  }

  populateReview() {
    const revType = document.getElementById('revType');
    const revName = document.getElementById('revName');
    const revPhone = document.getElementById('revPhone');
    const revCity = document.getElementById('revCity');
    const revAddress = document.getElementById('revAddress');
    const revSerial = document.getElementById('revSerial');
    const revIssue = document.getElementById('revIssue');

    const typeNames = {
      electric: "Chauffe-eau Électrique (Theros / Pacific)",
      gas: "Chauffe-eau à Gaz (Eurogas)",
      appliances: "Électroménager / TV (Nerobel)"
    };

    if (revType) revType.textContent = typeNames[this.data.type] || this.data.type;
    if (revName) revName.textContent = this.data.fullName;
    if (revPhone) revPhone.textContent = this.data.phone;
    if (revCity) revCity.textContent = this.data.city;
    if (revAddress) revAddress.textContent = this.data.address || (this.data.gps ? 'Position GPS confirmée' : 'Non précisée');
    if (revSerial) revSerial.textContent = `${this.data.brand} · ${this.data.serial}`;
    if (revIssue) revIssue.textContent = this.data.description || this.data.symptom;
  }

  bindNavigation() {
    const btnToStep2 = document.getElementById('btn-to-step2');
    const btnBackToStep1 = document.getElementById('btn-back-to-step1');
    const btnToStep3 = document.getElementById('btn-to-step3');
    const btnBackToStep2 = document.getElementById('btn-back-to-step2');
    const consentInput = document.getElementById('savConsent');
    const consentError = document.getElementById('savConsentError');

    if (btnToStep2) btnToStep2.addEventListener('click', () => this.goToStep(2));
    if (btnBackToStep1) btnBackToStep1.addEventListener('click', () => this.goToStep(1));
    if (btnToStep3) btnToStep3.addEventListener('click', () => this.goToStep(3));
    if (btnBackToStep2) btnBackToStep2.addEventListener('click', () => this.goToStep(2));
    if (consentInput) {
      consentInput.addEventListener('change', () => {
        if (consentInput.checked) {
          consentInput.classList.remove('has-error');
          consentInput.removeAttribute('aria-invalid');
          if (consentError) consentError.classList.remove('visible');
        }
      });
    }
  }

  // ─────────────────────────────────────────
  // MODALS & ACCESSIBILITY TRAP
  // ─────────────────────────────────────────
  bindModals() {
    const guideBtn = document.getElementById('btnSerialGuide');
    const guideModal = document.getElementById('serialGuideModal');
    const closeBtn = document.getElementById('closeSerialGuideModal');
    const understoodBtn = document.getElementById('btnUnderstood');

    const waterHeaterGuide = document.getElementById('serialGuideWaterHeater');
    const applianceGuide = document.getElementById('serialGuideAppliance');

    const openGuide = () => {
      this.lastTriggerElement = guideBtn;
      if (this.data.type === 'appliances') {
        if (waterHeaterGuide) waterHeaterGuide.style.display = 'none';
        if (applianceGuide) applianceGuide.style.display = 'block';
      } else {
        if (waterHeaterGuide) waterHeaterGuide.style.display = 'block';
        if (applianceGuide) applianceGuide.style.display = 'none';
      }
      guideModal.classList.add('active');
      this.trapModalFocus(guideModal, closeBtn);
    };

    const closeGuide = () => {
      guideModal.classList.remove('active');
      if (this.lastTriggerElement) this.lastTriggerElement.focus();
    };

    if (guideBtn && guideModal) guideBtn.addEventListener('click', openGuide);
    if (closeBtn && guideModal) closeBtn.addEventListener('click', closeGuide);
    if (understoodBtn && guideModal) understoodBtn.addEventListener('click', closeGuide);

    // Global escape listener for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (guideModal && guideModal.classList.contains('active')) closeGuide();
        const gpsModal = document.getElementById('gpsMapModal');
        if (gpsModal && gpsModal.classList.contains('active')) {
          gpsModal.classList.remove('active');
          const trigger = document.getElementById('btnGpsTrigger');
          if (trigger) trigger.focus();
        }
        const webcamModal = document.getElementById('webcamModal');
        if (webcamModal && webcamModal.classList.contains('active')) {
          this.stopWebcam();
        }
      }
    });
  }

  trapModalFocus(modal, defaultFocusEl) {
    if (!modal) return;
    const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const firstFocusable = focusables[0];
    const lastFocusable = focusables[focusables.length - 1];

    if (defaultFocusEl) {
      defaultFocusEl.focus();
    } else {
      firstFocusable.focus();
    }

    modal.onkeydown = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };
  }

  // ─────────────────────────────────────────
  // CLIENT-SIDE PHOTO COMPRESSION & DROPZONE
  // ─────────────────────────────────────────
  bindDropzone() {
    const dropzone = document.getElementById('fileDropzone');
    const fileInput = document.getElementById('fileInput');
    const removeBtn = document.getElementById('btnRemoveFile');

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', (e) => {
      if (e.target.closest('#btnWebcamTrigger')) return;
      fileInput.click();
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        this.handleFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        this.handleFile(fileInput.files[0]);
      }
    });

    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.data.photo = null;
        this.data.photoName = '';
        fileInput.value = '';
        const previewCard = document.getElementById('filePreviewCard');
        if (previewCard) previewCard.classList.remove('visible');
      });
    }
  }

  handleFile(file) {
    if (file.size > 10 * 1024 * 1024) {
      if (window.showToast) window.showToast("Le fichier est trop volumineux (max 10 Mo)", "error");
      return;
    }

    this.data.photoName = file.name;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          const maxSide = 1600;
          if (width > maxSide || height > maxSide) {
            if (width > height) {
              height = Math.round((height * maxSide) / width);
              width = maxSide;
            } else {
              width = Math.round((width * maxSide) / height);
              height = maxSide;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG 0.8
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          this.data.photo = compressedDataUrl;

          this.updateFilePreview(file.name, compressedDataUrl, 'Image compressée');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or non-image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.data.photo = e.target.result;
        this.updateFilePreview(file.name, null, `${(file.size / (1024 * 1024)).toFixed(2)} Mo`);
      };
      reader.readAsDataURL(file);
    }
  }

  updateFilePreview(name, dataUrl, sizeText) {
    const previewCard = document.getElementById('filePreviewCard');
    const previewImg = document.getElementById('filePreviewImg');
    const previewTitle = document.getElementById('filePreviewTitle');
    const previewSize = document.getElementById('filePreviewSize');

    if (previewImg) {
      if (dataUrl) {
        previewImg.src = dataUrl;
      } else {
        previewImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%233AA0E6' stroke-width='2'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/%3E%3Cpolyline points='14 2 14 8 20 8'/%3E%3C/svg%3E";
      }
    }
    if (previewTitle) previewTitle.textContent = name;
    if (previewSize) previewSize.textContent = sizeText;
    if (previewCard) previewCard.classList.add('visible');
  }

  // ─────────────────────────────────────────
  // GPS LEAFLET MODAL & CAPTURE
  // ─────────────────────────────────────────
  bindGps() {
    const gpsBtn = document.getElementById('btnGpsTrigger');
    const gpsModal = document.getElementById('gpsMapModal');
    const closeGpsBtn = document.getElementById('closeGpsModal');
    const confirmGpsBtn = document.getElementById('btnConfirmGps');
    const gpsFeedback = document.getElementById('gpsFeedback');
    const addressInput = document.getElementById('savAddress');

    if (!gpsBtn || !gpsModal) return;

    gpsBtn.addEventListener('click', () => {
      this.lastTriggerElement = gpsBtn;

      if (!navigator.geolocation) {
        if (gpsFeedback) {
          gpsFeedback.innerHTML = '<i class="ti ti-alert-triangle"></i> Position non autorisée. Saisissez votre adresse.';
          gpsFeedback.style.color = 'var(--err)';
          gpsFeedback.style.display = 'flex';
        }
        if (addressInput) addressInput.focus();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          gpsModal.classList.add('active');
          this.initLeafletMap(latitude, longitude);
          this.trapModalFocus(gpsModal, closeGpsBtn);
        },
        (err) => {
          // Denied or error
          if (gpsFeedback) {
            gpsFeedback.innerHTML = '<i class="ti ti-alert-triangle"></i> Position non autorisée. Saisissez votre adresse.';
            gpsFeedback.style.color = 'var(--err)';
            gpsFeedback.style.display = 'flex';
          }
          if (addressInput) addressInput.focus();
        },
        { timeout: 8000 }
      );
    });

    const closeMap = () => {
      gpsModal.classList.remove('active');
      if (this.lastTriggerElement) this.lastTriggerElement.focus();
    };

    if (closeGpsBtn) closeGpsBtn.addEventListener('click', closeMap);

    if (confirmGpsBtn) {
      confirmGpsBtn.addEventListener('click', () => {
        if (this.leafletMap) {
          const center = this.leafletMap.getCenter();
          this.data.gps = { lat: center.lat.toFixed(6), lng: center.lng.toFixed(6) };
          gpsModal.classList.remove('active');
          if (gpsFeedback) {
            gpsFeedback.innerHTML = `<i class="ti ti-check"></i> Position enregistrée (${this.data.gps.lat}, ${this.data.gps.lng})`;
            gpsFeedback.style.color = 'var(--ok)';
            gpsFeedback.style.display = 'flex';
          }
          if (this.lastTriggerElement) this.lastTriggerElement.focus();
          if (window.showToast) window.showToast("Coordonnées GPS confirmées !", "success");
        }
      });
    }
  }

  initLeafletMap(initialLat = 33.5731, initialLng = -7.5898) {
    setTimeout(() => {
      if (!this.leafletMap && typeof L !== 'undefined') {
        this.leafletMap = L.map('leafletMap').setView([initialLat, initialLng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(this.leafletMap);
      } else if (this.leafletMap) {
        this.leafletMap.setView([initialLat, initialLng], 15);
        this.leafletMap.invalidateSize();
      }
    }, 200);
  }

  // ─────────────────────────────────────────
  // LIVE WEBCAM MODAL
  // ─────────────────────────────────────────
  bindWebcam() {
    const triggerBtn = document.getElementById('btnWebcamTrigger');
    const modal = document.getElementById('webcamModal');
    const closeBtn = document.getElementById('closeWebcamModal');
    const captureBtn = document.getElementById('btnCapturePhoto');
    const retakeBtn = document.getElementById('btnRetakePhoto');
    const confirmBtn = document.getElementById('btnConfirmWebcamPhoto');

    const video = document.getElementById('webcamVideo');
    const previewImg = document.getElementById('webcamCapturedPreview');

    if (!triggerBtn || !modal) return;

    triggerBtn.addEventListener('click', async () => {
      this.lastTriggerElement = triggerBtn;
      modal.classList.add('active');
      try {
        this.webcamStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (video) {
          video.srcObject = this.webcamStream;
          video.style.display = 'block';
          if (previewImg) previewImg.style.display = 'none';
          if (captureBtn) captureBtn.style.display = 'inline-flex';
          if (retakeBtn) retakeBtn.style.display = 'none';
          if (confirmBtn) confirmBtn.style.display = 'none';
        }
        this.trapModalFocus(modal, closeBtn);
      } catch (err) {
        if (window.showToast) window.showToast("Accès à la caméra non autorisé ou indisponible", "error");
        modal.classList.remove('active');
        triggerBtn.style.display = 'none';
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', () => this.stopWebcam());

    if (captureBtn && video) {
      captureBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

        video.style.display = 'none';
        if (previewImg) {
          previewImg.src = dataUrl;
          previewImg.style.display = 'block';
        }

        captureBtn.style.display = 'none';
        if (retakeBtn) retakeBtn.style.display = 'inline-flex';
        if (confirmBtn) confirmBtn.style.display = 'inline-flex';
      });
    }

    if (retakeBtn && video) {
      retakeBtn.addEventListener('click', () => {
        video.style.display = 'block';
        if (previewImg) previewImg.style.display = 'none';
        captureBtn.style.display = 'inline-flex';
        retakeBtn.style.display = 'none';
        if (confirmBtn) confirmBtn.style.display = 'none';
      });
    }

    if (confirmBtn && previewImg) {
      confirmBtn.addEventListener('click', () => {
        this.data.photo = previewImg.src;
        this.data.photoName = 'photo_camera_sav.jpg';

        this.updateFilePreview('Photo prise en direct', previewImg.src, 'Capture Caméra');
        this.stopWebcam();
        if (window.showToast) window.showToast("Photo capturée avec succès !", "success");
      });
    }
  }

  stopWebcam() {
    const modal = document.getElementById('webcamModal');
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach(t => t.stop());
      this.webcamStream = null;
    }
    if (modal) modal.classList.remove('active');
    if (this.lastTriggerElement) this.lastTriggerElement.focus();
  }

  // ─────────────────────────────────────────
  // DRAFT PERSISTENCE (sessionStorage)
  // ─────────────────────────────────────────
  bindDraft() {
    const fields = [
      'savFullName',
      'savPhone',
      'savCity',
      'savOtherCity',
      'savAddress',
      'savSerial',
      'savProblem',
      'savDescription'
    ];

    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.saveDraft());
        el.addEventListener('change', () => this.saveDraft());
      }
    });
  }

  saveDraft() {
    try {
      const draft = {
        fullName: document.getElementById('savFullName')?.value || '',
        phone: document.getElementById('savPhone')?.value || '',
        city: document.getElementById('savCity')?.value || 'Casablanca',
        otherCity: document.getElementById('savOtherCity')?.value || '',
        address: document.getElementById('savAddress')?.value || '',
        serial: document.getElementById('savSerial')?.value || '',
        noSerial: document.getElementById('savNoSerial')?.checked || false,
        problem: document.getElementById('savProblem')?.value || '',
        description: document.getElementById('savDescription')?.value || ''
      };
      sessionStorage.setItem('nerobel_sav_draft', JSON.stringify(draft));
    } catch (e) {}
  }

  loadDraft() {
    try {
      const raw = sessionStorage.getItem('nerobel_sav_draft');
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (!draft) return;

      if (draft.fullName) document.getElementById('savFullName').value = draft.fullName;
      if (draft.phone) document.getElementById('savPhone').value = draft.phone;

      if (draft.city) {
        const citySelect = document.getElementById('savCity');
        if (citySelect) {
          citySelect.value = draft.city;
          if (draft.city === 'Autre ville') {
            const otherCityInput = document.getElementById('savOtherCity');
            if (otherCityInput) {
              otherCityInput.style.display = 'block';
              if (draft.otherCity) otherCityInput.value = draft.otherCity;
            }
          }
        }
      }

      if (draft.address) document.getElementById('savAddress').value = draft.address;
      if (draft.problem) document.getElementById('savProblem').value = draft.problem;
      if (draft.description) document.getElementById('savDescription').value = draft.description;

      if (draft.noSerial) {
        const noSerialCheck = document.getElementById('savNoSerial');
        const serialInput = document.getElementById('savSerial');
        const reqMark = document.getElementById('savSerialReqMark');
        if (noSerialCheck && serialInput) {
          noSerialCheck.checked = true;
          serialInput.disabled = true;
          if (reqMark) reqMark.style.display = 'none';
          this.data.noSerial = true;
        }
      } else if (draft.serial) {
        document.getElementById('savSerial').value = draft.serial;
      }
    } catch (e) {}
  }

  clearDraft() {
    try {
      sessionStorage.removeItem('nerobel_sav_draft');
    } catch (e) {}
  }

  // ─────────────────────────────────────────
  // FINAL SUBMISSION & RECEIPT (S3-03)
  // ─────────────────────────────────────────
  bindSubmission() {
    const submitBtn = document.getElementById('btnSubmitFinal');
    const container = document.getElementById('savStepsContainer');
    const successPanel = document.getElementById('savSuccessPanel');
    const errorBox = document.getElementById('savSubmitError');

    if (!submitBtn) return;

    submitBtn.addEventListener('click', async () => {
      // Honeypot spam check
      const hp = document.getElementById('savHp');
      if (hp && hp.value) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ti ti-loader"></i> Traitement...';
      if (errorBox) errorBox.style.display = 'none';

      // Build structured WhatsApp message without photos
      const msgLines = [
        "Bonjour Nerobel, voici ma demande SAV :",
        `- Nom : ${this.data.fullName}`,
        `- Téléphone : ${this.data.phone}`,
        `- Ville : ${this.data.city}`,
        `- Adresse : ${this.data.address || (this.data.gps ? `Position GPS: ${this.data.gps.lat}, ${this.data.gps.lng}` : 'Non précisée')}`,
        `- Appareil : ${this.data.brand} (${this.data.type})`,
        `- Numéro de série : ${this.data.serial}`,
        `- Panne : ${this.data.symptom}`
      ];
      if (this.data.description) {
        msgLines.push(`- Précisions : ${this.data.description}`);
      }
      const waUrl = `https://wa.me/212787013201?text=${encodeURIComponent(msgLines.join('\n'))}`;

      // If backend endpoint is configured (O-09)
      if (window.nerobelFormEndpoint) {
        try {
          const res = await fetch(window.nerobelFormEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              form: 'sav',
              fields: {
                fullName: this.data.fullName,
                phone: this.data.phone,
                city: this.data.city,
                address: this.data.address,
                gps: this.data.gps,
                brand: this.data.brand,
                serial: this.data.serial,
                symptom: this.data.symptom,
                description: this.data.description
              },
              consent: true,
              timestamp: Date.now()
            })
          });

          if (!res.ok) throw new Error('Network error');

          const data = await res.json().catch(() => ({}));
          this.clearDraft();

          if (container) container.style.display = 'none';
          if (successPanel) successPanel.classList.add('visible');

          if (data && data.ticketCode) {
            this.data.ticketCode = data.ticketCode;
            const ticketBox = document.getElementById('savTicketBox');
            const codeEl = document.getElementById('displayTicketCode');
            if (ticketBox && codeEl) {
              codeEl.textContent = data.ticketCode;
              ticketBox.style.display = 'inline-flex';
            }
          }
          window.scrollTo({ top: 100, behavior: 'smooth' });
          return;
        } catch (err) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="ti ti-send"></i> Transmettre ma Demande SAV';
          if (errorBox) {
            errorBox.style.display = 'block';
            const errorWaBtn = document.getElementById('savErrorWhatsAppBtn');
            if (errorWaBtn) errorWaBtn.href = waUrl;
          }
          if (window.showToast) {
            window.showToast("L'envoi a échoué. Réessayez ou écrivez-nous sur WhatsApp.", "error");
          }
          return;
        }
      }

      // Default hand-off mode (O-09 open): WhatsApp hand-off
      this.clearDraft();
      if (container) container.style.display = 'none';
      if (successPanel) successPanel.classList.add('visible');

      const waBtn = document.getElementById('btnWhatsAppAction');
      if (waBtn) {
        waBtn.href = waUrl;
      }

      const pdfBtn = document.getElementById('btnDownloadPdf');
      if (pdfBtn) {
        pdfBtn.addEventListener('click', () => this.generatePdfReceipt());
      }

      if (window.showToast) {
        window.showToast("Votre message est prêt : appuyez sur Envoyer pour finaliser.", "info");
      }

      try {
        window.open(waUrl, '_blank', 'noopener');
      } catch (e) {}

      window.scrollTo({ top: 100, behavior: 'smooth' });
    });
  }

  generatePdfReceipt() {
    const printableWindow = window.open('', '_blank');
    if (!printableWindow) return;

    printableWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>Reçu SAV - ${this.data.ticketCode}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #111; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3AA0E6; padding-bottom: 20px; }
          .logo { font-size: 26px; font-weight: 900; font-style: italic; color: #050505; }
          .logo span { color: #3AA0E6; }
          .ticket-badge { background: #E0F2FE; border: 1.5px solid #0284C7; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 18px; }
          .section { margin-top: 30px; }
          .table { width: 100vw; max-width: 680px; border-collapse: collapse; margin-top: 15px; }
          .table td { padding: 12px; border-bottom: 1px solid #E2E8F0; }
          .table td.key { font-weight: 600; width: 35%; color: #64748B; }
          .footer { margin-top: 50px; font-size: 12px; color: #64748B; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">NEROBEL <span>GROUP</span></div>
          <div class="ticket-badge">RÉFÉRENCE : ${this.data.ticketCode}</div>
        </div>

        <div class="section">
          <h2>Récépissé Officiel de Demande de Service Après-Vente</h2>
          <p>Dossier enregistré le ${new Date().toLocaleDateString('fr-FR')} - Nerobel Group · Theros · Pacific · Eurogas</p>

          <table class="table">
            <tr><td class="key">Nom du Client</td><td>${this.data.fullName}</td></tr>
            <tr><td class="key">Téléphone (WhatsApp)</td><td>${this.data.phone}</td></tr>
            <tr><td class="key">Ville & Adresse</td><td>${this.data.city} - ${this.data.address || 'Précisée au technicien'}</td></tr>
            <tr><td class="key">Marque & Modèle</td><td>${this.data.brand} (${this.data.type})</td></tr>
            <tr><td class="key">Numéro de Série</td><td><strong>${this.data.serial}</strong></td></tr>
            <tr><td class="key">Panne Déclarée</td><td>${this.data.description || this.data.symptom}</td></tr>
            <tr><td class="key">Suivi</td><td>Notre équipe vous répond rapidement</td></tr>
          </table>
        </div>

        <div class="footer">
          Nerobel Group · Service Après-Vente National · Assistance WhatsApp : +212 787 013 201<br>
          Conservez ce document pour le présenter au technicien agréé lors de son passage.
        </div>
      </body>
      </html>
    `);
    printableWindow.document.close();
    printableWindow.focus();
    setTimeout(() => printableWindow.print(), 500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('savStepsContainer')) {
    window.savPortal = new SavPortal();
    window.savPortal.init();
  }
});

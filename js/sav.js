/* ─────────────────────────────────────────────────────────────
   NEROBEL GROUP · SAV SUPPORT ENGINE (js/sav.js) - v2.0
   Full Native 3-Step Wizard, GPS Leaflet Modal, Live Webcam,
   Validation, WhatsApp Bridge (+212 787 013 201), & PDF Receipt
   ───────────────────────────────────────────────────────────── */

class SavPortal {
  constructor() {
    this.currentStep = 1;
    this.data = {
      type: 'electric',
      fullName: '',
      phone: '',
      city: 'Casablanca',
      address: '',
      gps: null,
      brand: 'Theros',
      serial: '',
      symptom: 'no_hot_water',
      description: '',
      photo: null,
      photoName: '',
      ticketCode: null
    };

    this.leafletMap = null;
    this.webcamStream = null;
  }

  init() {
    this.bindTypeSelection();
    this.bindNavigation();
    this.bindModals();
    this.bindDropzone();
    this.bindGps();
    this.bindWebcam();
    this.bindSubmission();
  }

  // ─────────────────────────────────────────
  // STEP 1: Type Selection
  // ─────────────────────────────────────────
  bindTypeSelection() {
    const cards = document.querySelectorAll('.type-select-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.data.type = card.getAttribute('data-type');

        // Auto default brand based on type
        const brandSelect = document.getElementById('savBrand');
        if (brandSelect) {
          if (this.data.type === 'gas') {
            brandSelect.value = 'Eurogas';
            this.data.brand = 'Eurogas';
          } else if (this.data.type === 'appliances') {
            brandSelect.value = 'Nerobel';
            this.data.brand = 'Nerobel';
          } else {
            brandSelect.value = 'Theros';
            this.data.brand = 'Theros';
          }
        }
      });
    });
  }

  // ─────────────────────────────────────────
  // STEP NAVIGATION & VALIDATION
  // ─────────────────────────────────────────
  goToStep(stepNumber) {
    if (stepNumber === 2 && this.currentStep === 1) {
      if (!this.data.type) {
        window.showToast("Veuillez sélectionner un type d'appareil", "error");
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
    const nameInput = document.getElementById('savFullName');
    const phoneInput = document.getElementById('savPhone');
    const serialInput = document.getElementById('savSerial');
    const addressInput = document.getElementById('savAddress');

    // Name
    if (!nameInput.value.trim()) {
      this.markFieldError(nameInput, true);
      isValid = false;
    } else {
      this.markFieldError(nameInput, false);
      this.data.fullName = nameInput.value.trim();
    }

    // Phone (Moroccan validation)
    const phoneVal = phoneInput.value.trim().replace(/\s+/g, '');
    const moroccoRegex = /^(?:0[5-7]\d{8}|\+212[5-7]\d{8}|[5-7]\d{8})$/;
    if (!moroccoRegex.test(phoneVal)) {
      this.markFieldError(phoneInput, true);
      isValid = false;
    } else {
      this.markFieldError(phoneInput, false);
      this.data.phone = phoneVal.startsWith('+212') ? phoneVal : phoneVal.startsWith('0') ? '+212' + phoneVal.substring(1) : '+212' + phoneVal;
    }

    // Serial
    if (!serialInput.value.trim() || serialInput.value.trim().length < 6) {
      this.markFieldError(serialInput, true);
      isValid = false;
    } else {
      this.markFieldError(serialInput, false);
      this.data.serial = serialInput.value.trim().toUpperCase();
    }

    // Address & Brand
    this.data.address = addressInput ? addressInput.value.trim() : '';
    this.data.city = document.getElementById('savCity').value;
    this.data.brand = document.getElementById('savBrand').value;
    this.data.symptom = document.getElementById('savProblem').value;
    this.data.description = document.getElementById('savDescription').value.trim();

    if (!isValid) {
      window.showToast("Veuillez corriger les champs en rouge avant de continuer", "error");
    }

    return isValid;
  }

  markFieldError(inputEl, isError) {
    if (!inputEl) return;
    inputEl.classList.toggle('has-error', isError);
    const errorMsg = inputEl.parentElement.querySelector('.field-error-msg');
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

    if (btnToStep2) btnToStep2.addEventListener('click', () => this.goToStep(2));
    if (btnBackToStep1) btnBackToStep1.addEventListener('click', () => this.goToStep(1));
    if (btnToStep3) btnToStep3.addEventListener('click', () => this.goToStep(3));
    if (btnBackToStep2) btnBackToStep2.addEventListener('click', () => this.goToStep(2));
  }

  // ─────────────────────────────────────────
  // MODALS: SERIAL NUMBER GUIDE
  // ─────────────────────────────────────────
  bindModals() {
    const guideBtn = document.getElementById('btnSerialGuide');
    const guideModal = document.getElementById('serialGuideModal');
    const closeBtn = document.getElementById('closeSerialGuideModal');
    const understoodBtn = document.getElementById('btnUnderstood');

    if (guideBtn && guideModal) {
      guideBtn.addEventListener('click', () => guideModal.classList.add('active'));
    }
    if (closeBtn && guideModal) {
      closeBtn.addEventListener('click', () => guideModal.classList.remove('active'));
    }
    if (understoodBtn && guideModal) {
      understoodBtn.addEventListener('click', () => guideModal.classList.remove('active'));
    }
  }

  // ─────────────────────────────────────────
  // DROPZONE & FILE UPLOAD
  // ─────────────────────────────────────────
  bindDropzone() {
    const dropzone = document.getElementById('fileDropzone');
    const fileInput = document.getElementById('fileInput');
    const previewCard = document.getElementById('filePreviewCard');
    const previewImg = document.getElementById('filePreviewImg');
    const previewTitle = document.getElementById('filePreviewTitle');
    const previewSize = document.getElementById('filePreviewSize');
    const removeBtn = document.getElementById('btnRemoveFile');

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

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
        if (previewCard) previewCard.classList.remove('visible');
      });
    }
  }

  handleFile(file) {
    if (file.size > 10 * 1024 * 1024) {
      window.showToast("Le fichier est trop volumineux (max 10 Mo)", "error");
      return;
    }

    this.data.photoName = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.data.photo = e.target.result;
      const previewCard = document.getElementById('filePreviewCard');
      const previewImg = document.getElementById('filePreviewImg');
      const previewTitle = document.getElementById('filePreviewTitle');
      const previewSize = document.getElementById('filePreviewSize');

      if (previewImg) previewImg.src = e.target.result;
      if (previewTitle) previewTitle.textContent = file.name;
      if (previewSize) previewSize.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} Mo`;
      if (previewCard) previewCard.classList.add('visible');
    };
    reader.readAsDataURL(file);
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

    if (!gpsBtn || !gpsModal) return;

    gpsBtn.addEventListener('click', () => {
      gpsModal.classList.add('active');
      this.initLeafletMap();
    });

    if (closeGpsBtn) {
      closeGpsBtn.addEventListener('click', () => gpsModal.classList.remove('active'));
    }

    if (confirmGpsBtn) {
      confirmGpsBtn.addEventListener('click', () => {
        if (this.leafletMap) {
          const center = this.leafletMap.getCenter();
          this.data.gps = { lat: center.lat.toFixed(6), lng: center.lng.toFixed(6) };
          gpsModal.classList.remove('active');
          if (gpsFeedback) {
            gpsFeedback.innerHTML = `<i class="ti ti-check"></i> Position enregistrée (${this.data.gps.lat}, ${this.data.gps.lng})`;
            gpsFeedback.style.display = 'flex';
          }
          window.showToast("Coordonnées GPS confirmées !", "success");
        }
      });
    }
  }

  initLeafletMap() {
    setTimeout(() => {
      if (!this.leafletMap && typeof L !== 'undefined') {
        const defaultLat = 33.5731;
        const defaultLng = -7.5898;

        this.leafletMap = L.map('leafletMap').setView([defaultLat, defaultLng], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(this.leafletMap);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              this.leafletMap.setView([latitude, longitude], 16);
            },
            () => console.log('Geolocation fallback to default city center')
          );
        }
      } else if (this.leafletMap) {
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
      } catch (err) {
        window.showToast("Accès à la caméra non autorisé ou indisponible", "error");
        modal.classList.remove('active');
      }
    });

    const stopStream = () => {
      if (this.webcamStream) {
        this.webcamStream.getTracks().forEach(t => t.stop());
        this.webcamStream = null;
      }
      modal.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', stopStream);

    if (captureBtn && video) {
      captureBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');

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

        const filePreviewCard = document.getElementById('filePreviewCard');
        const filePreviewImg = document.getElementById('filePreviewImg');
        const filePreviewTitle = document.getElementById('filePreviewTitle');
        const filePreviewSize = document.getElementById('filePreviewSize');

        if (filePreviewImg) filePreviewImg.src = previewImg.src;
        if (filePreviewTitle) filePreviewTitle.textContent = 'Photo prise en direct';
        if (filePreviewSize) filePreviewSize.textContent = 'Capture Caméra';
        if (filePreviewCard) filePreviewCard.classList.add('visible');

        stopStream();
        window.showToast("Photo capturée avec succès !", "success");
      });
    }
  }

  // ─────────────────────────────────────────
  // FINAL SUBMISSION & RECEIPT
  // ─────────────────────────────────────────
  bindSubmission() {
    const submitBtn = document.getElementById('btnSubmitFinal');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', () => {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ti ti-loader"></i> Envoi en cours...';

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const ticketCode = `NERO-2026-${randomNum}`;
      this.data.ticketCode = ticketCode;

      setTimeout(() => {
        document.getElementById('savStepsContainer').style.display = 'none';
        const successPanel = document.getElementById('savSuccessPanel');
        if (successPanel) successPanel.classList.add('visible');

        const codeEl = document.getElementById('displayTicketCode');
        if (codeEl) codeEl.textContent = ticketCode;

        // WhatsApp direct link to official hotline: +212 787 013 201
        const waBtn = document.getElementById('btnWhatsAppAction');
        if (waBtn) {
          const msg = `Bonjour Nerobel, ma demande SAV porte le numéro ${ticketCode}`;
          waBtn.href = `https://wa.me/212787013201?text=${encodeURIComponent(msg)}`;
        }

        const copyBtn = document.getElementById('btnCopyCode');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(ticketCode).then(() => {
              copyBtn.textContent = 'Copié ✓';
              setTimeout(() => copyBtn.textContent = 'Copier', 2500);
            });
          });
        }

        const pdfBtn = document.getElementById('btnDownloadPdf');
        if (pdfBtn) {
          pdfBtn.addEventListener('click', () => this.generatePdfReceipt());
        }

        window.showToast("Votre demande SAV a été validée avec succès !", "success");
        window.scrollTo({ top: 100, behavior: 'smooth' });
      }, 1200);
    });
  }

  generatePdfReceipt() {
    const printableWindow = window.open('', '_blank');

    printableWindow.document.write(`
      <!DOCTYPE html>
      <html>
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



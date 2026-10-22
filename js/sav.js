/* ─────────────────────────────────────────────────────────────
   NEROBEL GROUP · SCHEMA-DRIVEN DYNAMIC SAV ENGINE (js/sav.js) - v3.5
   Powered by FlowOps Gateway · Schema-Driven Dynamic Form Engine
   Bilingual FR/AR, Stepper by stepName, Specialized Widgets,
   GPS Leaflet Modal, Camera/Webcam Capture, WhatsApp Bridge & PDF Receipt
   ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  // Embedded Offline Fallback Schema (FlowOps Service ID: 6 - SAV Nerobel)
  const FALLBACK_SCHEMA = {
    serviceId: 6,
    serviceName: "SAV",
    defaultTicketTypeId: 1,
    ticketTypes: [
      {
        id: 1,
        name: "Sous garantie / تحت الضمان",
        description: "Demande sous garantie constructeur",
        fields: [
          {
            id: 13,
            name: "Nom complet / الاسم الكامل",
            stepName: "1. Vos coordonnées / معلومات الاتصال",
            fieldType: "TEXT",
            required: true,
            displayOrder: 10,
            mappingTarget: "CONTACT_NAME",
            validators: JSON.stringify({ minLength: 3, placeholder: { fr: "Ex: Mohamed Alami", ar: "مثال: محمد العلمي" } })
          },
          {
            id: 15,
            name: "Téléphone / رقم الهاتف",
            stepName: "1. Vos coordonnées / معلومات الاتصال",
            fieldType: "PHONE",
            required: true,
            displayOrder: 11,
            mappingTarget: "CONTACT_PHONE",
            validators: JSON.stringify({ pattern: "^0[567][0-9]{8}$", placeholder: { fr: "0612345678", ar: "0612345678" } })
          },
          {
            id: 82,
            name: "Email / بريد إلكتروني",
            stepName: "1. Vos coordonnées / معلومات الاتصال",
            fieldType: "EMAIL",
            required: false,
            displayOrder: 13,
            mappingTarget: null,
            validators: JSON.stringify({ pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", placeholder: { fr: "exemple@email.com", ar: "exemple@email.com" } })
          },
          {
            id: 35,
            name: "Description détaillée / وصف مفصل",
            stepName: "2. Description du problème / وصف المشكلة",
            fieldType: "TEXTAREA",
            required: false,
            displayOrder: 31,
            mappingTarget: null,
            validators: JSON.stringify({ minLength: 10, placeholder: { fr: "Précisez les symptômes, code erreur ou circonstances de la panne...", ar: "صف المشكلة والأعراض أو رمز الخطأ بالتفصيل..." } })
          },
          {
            id: 20,
            name: "Adresse complète / العنوان الكامل",
            stepName: "3. Adresse d'intervention / عنوان التدخل",
            fieldType: "TEXTAREA",
            required: true,
            displayOrder: 50,
            mappingTarget: "ADDRESS",
            validators: JSON.stringify({ minLength: 10, placeholder: { fr: "Quartier, N° Rue, Résidence, Ville...", ar: "الحي، رقم الشارع، الإقامة، المدينة..." } })
          },
          {
            id: 22,
            name: "Localisation GPS / الموقع الجغرافي",
            stepName: "3. Adresse d'intervention / عنوان التدخل",
            fieldType: "GPS",
            required: false,
            displayOrder: 51,
            mappingTarget: null
          },
          {
            id: 29,
            name: "Numéro de série de l'appareil / الرقم التسلسلي للجهاز",
            stepName: "4. Contrat & Garantie / العقد والضمان",
            fieldType: "TEXT",
            required: true,
            displayOrder: 85,
            mappingTarget: "EQUIPMENT_SERIAL",
            helpMediaUrl: "serial-number-guide.svg",
            helpText: "Le numéro de série se trouve sur la plaque signalétique en métal à l'arrière ou sur le côté de l'appareil (ex: PC202508300133). / يوجد الرقم التسلسلي على اللوحة المعدنية خلف أو جانب الجهاز (مثال: PC202508300133).",
            validators: JSON.stringify({ pattern: "^[A-Za-z0-9-/ ]{5,50}$", placeholder: { fr: "Ex: PC202508300133 ou TH2026...", ar: "مثال: PC202508300133 أو TH2026..." } })
          },
          {
            id: 84,
            name: "Date d'achat / تاريخ الشراء",
            stepName: "4. Contrat & Garantie / العقد والضمان",
            fieldType: "DATE",
            required: true,
            displayOrder: 86,
            mappingTarget: null,
            helpText: "Indiquez la date d'achat figurant sur votre facture ou bon de garantie pour vérifier l'éligibilité. / أدخل تاريخ الشراء الموضح على الفاتورة أو بطاقة الضمان."
          },
          {
            id: 26,
            name: "Photo du bon de garantie ou facture / صورة الضمان أو الفاتورة",
            stepName: "4. Contrat & Garantie / العقد والضمان",
            fieldType: "PHOTO_ONLY",
            required: true,
            displayOrder: 90,
            mappingTarget: null,
            helpMediaUrl: "contract-sample.webp",
            helpText: "Prenez une photo nette à plat de votre bon de garantie ou facture d'achat. Les 4 coins doivent être visibles sans reflets de flash. / التقط صورة واضحة ومستوية لبطاقة الضمان أو فاتورة الشراء مع إظهار الزوايا الأربع وتجنب انعكاس الفلاش."
          }
        ]
      },
      {
        id: 2,
        name: "Hors garantie / خارج الضمان",
        description: "Demande hors garantie constructeur",
        fields: [
          {
            id: 12,
            name: "Nom complet / الاسم الكامل",
            stepName: "1. Vos coordonnées / معلومات الاتصال",
            fieldType: "TEXT",
            required: true,
            displayOrder: 10,
            mappingTarget: "CONTACT_NAME",
            validators: JSON.stringify({ minLength: 3, placeholder: { fr: "Ex: Mohamed Alami", ar: "مثال: محمد العلمي" } })
          },
          {
            id: 14,
            name: "Téléphone / رقم الهاتف",
            stepName: "1. Vos coordonnées / معلومات الاتصال",
            fieldType: "PHONE",
            required: true,
            displayOrder: 11,
            mappingTarget: "CONTACT_PHONE",
            validators: JSON.stringify({ pattern: "^0[567][0-9]{8}$", placeholder: { fr: "0612345678", ar: "0612345678" } })
          },
          {
            id: 37,
            name: "Numéro de série / الرقم التسلسلي",
            stepName: "2. Informations de l'équipement / معلومات الجهاز",
            fieldType: "TEXT",
            required: true,
            displayOrder: 20,
            mappingTarget: "EQUIPMENT_SERIAL",
            helpMediaUrl: "serial-number-guide.svg",
            validators: JSON.stringify({ pattern: "^[A-Za-z0-9-/ ]{5,50}$", placeholder: { fr: "Ex: PC202508300133", ar: "مثال: PC202508300133" } })
          },
          {
            id: 38,
            name: "Marque / الماركة",
            stepName: "2. Informations de l'équipement / معلومات الجهاز",
            fieldType: "SELECT",
            required: true,
            displayOrder: 21,
            options: ["Theros", "Eurogas", "Saunier Duval", "Vaillant", "Bosch", "Ariston", "Ferroli", "Autre"],
            validators: JSON.stringify({ optionLabels: { Autre: { fr: "Autre", ar: "أخرى" } } })
          },
          {
            id: 43,
            name: "Type de panne / نوع العطل",
            stepName: "3. Description du problème / وصف المشكلة",
            fieldType: "SELECT",
            required: true,
            displayOrder: 30,
            options: ["no_hot_water", "circuit_breaker", "thermostat", "heating_element", "water_leak", "noise", "limescale", "other"],
            validators: JSON.stringify({
              optionLabels: {
                no_hot_water: { fr: "Pas d'eau chaude", ar: "لا يوجد ماء ساخن" },
                circuit_breaker: { fr: "Disjoncteur saute", ar: "القاطع يفصل" },
                thermostat: { fr: "Thermostat défectueux", ar: "ترموستات معطل" },
                heating_element: { fr: "Résistance grillée", ar: "مقاومة محترقة" },
                water_leak: { fr: "Fuite d'eau", ar: "تسرب ماء" },
                noise: { fr: "Bruit anormal", ar: "ضجيج غير طبيعي" },
                limescale: { fr: "Tartre / Eau tiède", ar: "كلس / ماء فاتر" },
                other: { fr: "Autre problème", ar: "عطل آخر" }
              }
            })
          },
          {
            id: 44,
            name: "Description détaillée / وصف مفصل",
            stepName: "3. Description du problème / وصف المشكلة",
            fieldType: "TEXTAREA",
            required: false,
            displayOrder: 31,
            validators: JSON.stringify({ minLength: 10, placeholder: { fr: "Précisez les symptômes, bruits ou circonstances de la panne...", ar: "صف المشكلة والأعراض أو الظروف بالتفصيل..." } })
          },
          {
            id: 19,
            name: "Adresse complète / العنوان الكامل",
            stepName: "4. Adresse d'intervention / عنوان التدخل",
            fieldType: "TEXTAREA",
            required: true,
            displayOrder: 50,
            mappingTarget: "ADDRESS",
            validators: JSON.stringify({ minLength: 10, placeholder: { fr: "Quartier, N° Rue, Résidence, Ville...", ar: "الحي، رقم الشارع، الإقامة، المدينة..." } })
          },
          {
            id: 21,
            name: "Localisation GPS / الموقع الجغرافي",
            stepName: "4. Adresse d'intervention / عنوان التدخل",
            fieldType: "GPS",
            required: false,
            displayOrder: 51
          },
          {
            id: 27,
            name: "Photo de l'appareil ou facture / صورة الجهاز أو الفاتورة",
            stepName: "5. Pièce jointe / المرفقات",
            fieldType: "FILE",
            required: false,
            displayOrder: 90,
            helpMediaUrl: "contract-sample.webp"
          }
        ]
      }
    ]
  };

  class NerobelSavEngine {
    constructor() {
      this.apiEndpoint = window.FLOWOPS_SAV_API || '/api/public/sav-requests';
      this.serviceId = 6;
      this.whatsappNumber = '212718999867';
      this.lang = localStorage.getItem('nerobel_sav_lang') || (document.documentElement.lang === 'ar' ? 'ar' : 'fr');
      
      this.config = null;
      this.activeTicketTypeId = 1;
      this.currentStep = 0;
      this.steps = [];
      this.formData = {};
      this.fileAttachment = null;
      this.fileAttachmentName = '';
      this.gpsData = null;

      this.leafletMap = null;
      this.webcamStream = null;
    }

    async init() {
      this.applyLanguageDirection();
      this.bindGlobalModals();
      await this.fetchSchema();
      this.setupForm();
      this.loadDraft();
      this.render();
    }

    // ─────────────────────────────────────────
    // 1. LANGUAGE & BILINGUAL UTILITIES
    // ─────────────────────────────────────────
    applyLanguageDirection() {
      document.documentElement.lang = this.lang;
      document.documentElement.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
      
      // Update top bar toggle buttons if present
      document.querySelectorAll('.lang-pill').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === this.lang);
      });
    }

    toggleLanguage(newLang) {
      if (this.lang === newLang) return;
      this.saveCurrentStepInputs();
      this.lang = newLang;
      localStorage.setItem('nerobel_sav_lang', newLang);
      this.applyLanguageDirection();
      this.render();
    }

    parseLabel(raw) {
      if (!raw) return '';
      if (typeof raw === 'object') {
        return raw[this.lang] || raw.fr || raw.ar || '';
      }
      const parts = String(raw).split('/');
      if (this.lang === 'ar' && parts[1]) {
        return parts[1].trim();
      }
      return parts[0].trim();
    }

    getParsedPlaceholder(validators) {
      if (!validators) return '';
      try {
        const valObj = typeof validators === 'string' ? JSON.parse(validators) : validators;
        if (valObj && valObj.placeholder) {
          if (typeof valObj.placeholder === 'object') {
            return valObj.placeholder[this.lang] || valObj.placeholder.fr || '';
          }
          return valObj.placeholder;
        }
      } catch (e) {}
      return '';
    }

    getParsedHelpText(field) {
      if (field.validators) {
        try {
          const valObj = typeof field.validators === 'string' ? JSON.parse(field.validators) : field.validators;
          if (valObj && valObj.helpText) {
            if (typeof valObj.helpText === 'object') {
              return valObj.helpText[this.lang] || valObj.helpText.fr || '';
            }
            return valObj.helpText;
          }
        } catch (e) {}
      }
      if (field.helpText) {
        return this.parseLabel(field.helpText);
      }
      return '';
    }

    // ─────────────────────────────────────────
    // 2. SCHEMA FETCHING & STEP CONSTRUCTION
    // ─────────────────────────────────────────
    async fetchSchema() {
      try {
        const res = await fetch(`${this.apiEndpoint}?serviceId=${this.serviceId}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (data && data.ticketTypes && data.ticketTypes.length > 0) {
          this.config = data;
          this.activeTicketTypeId = data.defaultTicketTypeId || data.ticketTypes[0].id || 1;
          return;
        }
      } catch (err) {
        console.warn('[Nerobel SAV Engine] Could not fetch remote schema, using embedded offline schema:', err);
      }
      this.config = FALLBACK_SCHEMA;
      this.activeTicketTypeId = FALLBACK_SCHEMA.defaultTicketTypeId;
    }

    setupForm() {
      const ticketType = (this.config.ticketTypes || []).find(t => t.id === this.activeTicketTypeId) || this.config.ticketTypes[0];
      const fields = (ticketType && ticketType.fields) ? [...ticketType.fields] : [];
      fields.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      // Group fields by stepName
      const stepsMap = new Map();
      fields.forEach(f => {
        const stepKey = f.stepName || (this.lang === 'ar' ? '1. المعلومات' : '1. Informations');
        if (!stepsMap.has(stepKey)) {
          stepsMap.set(stepKey, []);
        }
        stepsMap.get(stepKey).push(f);
      });

      this.steps = [];
      for (const [stepTitle, stepFields] of stepsMap.entries()) {
        this.steps.push({
          type: 'fields',
          title: stepTitle,
          fields: stepFields
        });
      }

      // Add final Review & Submit step
      this.steps.push({
        type: 'review',
        title: this.lang === 'ar' ? 'التأكيد والإرسال' : 'Confirmation & Envoi',
        fields: []
      });

      if (this.currentStep >= this.steps.length) {
        this.currentStep = 0;
      }
    }

    setTicketType(typeId) {
      if (this.activeTicketTypeId === typeId) return;
      this.saveCurrentStepInputs();
      this.activeTicketTypeId = typeId;
      this.currentStep = 0;
      this.setupForm();
      this.render();
    }

    // ─────────────────────────────────────────
    // 3. RENDERING ENGINE
    // ─────────────────────────────────────────
    render() {
      const container = document.getElementById('savStepsContainer');
      if (!container) return;

      const isAr = this.lang === 'ar';
      const totalSteps = this.steps.length;
      const stepIdx = this.currentStep;
      const currentStepObj = this.steps[stepIdx] || this.steps[0];
      const currentStepTitle = this.parseLabel(currentStepObj.title);

      // 1. Render Stepper Header Top Bar
      let html = `
        <div class="stepper-header">
          <div class="stepper-top-bar">
            <div class="sav-ticket-types-selector" role="tablist" aria-label="${isAr ? 'نوع الضمان' : 'Type de garantie'}">
      `;

      (this.config.ticketTypes || []).forEach(tt => {
        const isActive = tt.id === this.activeTicketTypeId;
        const iconClass = tt.id === 1 ? 'ti-shield-check' : 'ti-tool';
        html += `
          <button type="button" class="ticket-type-pill ${isActive ? 'active' : ''}" data-ticket-type="${tt.id}" role="tab" aria-selected="${isActive}">
            <i class="ti ${iconClass}"></i>
            <span>${this.parseLabel(tt.name)}</span>
          </button>
        `;
      });

      html += `
            </div>
            <div class="sav-lang-switch" role="group" aria-label="${isAr ? 'لغة النموذج' : 'Langue du formulaire'}">
              <button type="button" class="lang-pill ${!isAr ? 'active' : ''}" data-lang="fr" aria-label="Français">FR</button>
              <span class="lang-divider">|</span>
              <button type="button" class="lang-pill ${isAr ? 'active' : ''}" data-lang="ar" aria-label="العربية">العربية</button>
            </div>
          </div>

          <div class="stepper-progress-bars">
      `;

      for (let i = 0; i < totalSteps; i++) {
        let cls = 'step-bar';
        if (i < stepIdx) cls += ' completed';
        if (i === stepIdx) cls += ' active';
        html += `<div class="${cls}"></div>`;
      }

      html += `
          </div>
          <div class="step-indicator-text">
            ${isAr ? `المرحلة ${stepIdx + 1} من ${totalSteps} · ${currentStepTitle}` : `Étape ${stepIdx + 1} sur ${totalSteps} · ${currentStepTitle}`}
          </div>
        </div>
      `;

      // 2. Render Step Body
      html += `<div class="sav-step active" id="savDynamicStepBody">`;
      html += `<h2 class="step-title">${currentStepTitle}</h2>`;
      html += `<p class="step-subtitle">${isAr ? 'يرجى ملء الحقول المطلوبة للمتابعة' : 'Complétez les informations requises pour continuer'}</p>`;

      // Honeypot anti-spam
      html += `<input type="text" id="savHp" name="_hp_check" style="display:none;" tabindex="-1" autocomplete="off" aria-hidden="true">`;

      // Accessible Error summary
      html += `
        <div id="stepErrorSummary" class="error-summary" role="alert" style="display:none;" aria-live="assertive">
          <div class="error-summary-title"><i class="ti ti-alert-circle"></i> ${isAr ? 'يرجى تصحيح الأخطاء التالية :' : 'Veuillez corriger les erreurs suivantes :'}</div>
          <ul class="error-summary-list" id="stepErrorList"></ul>
        </div>
      `;

      if (currentStepObj.type === 'review') {
        html += this.renderReviewScreen();
      } else {
        html += `<div class="sav-step-fields-wrap">`;
        currentStepObj.fields.forEach(field => {
          html += this.renderFieldWidget(field);
        });
        html += `</div>`;
      }

      // Step Navigation buttons
      html += `
        <div class="step-nav-bar">
          ${stepIdx > 0 ? `
            <button type="button" class="btn btn-secondary" id="btnStepPrev">
              <i class="ti ti-arrow-left"></i> <span>${isAr ? 'السابق' : 'Retour'}</span>
            </button>
          ` : `<div></div>`}
          ${stepIdx < totalSteps - 1 ? `
            <button type="button" class="btn btn-primary" id="btnStepNext">
              <span>${isAr ? 'متابعة' : 'Continuer'}</span> <i class="ti ti-arrow-right"></i>
            </button>
          ` : `
            <button type="button" class="btn btn-primary" id="btnSubmitFinal">
              <i class="ti ti-send"></i> <span>${isAr ? 'إرسال طلب الصيانة' : 'Transmettre ma Demande SAV'}</span>
            </button>
          `}
        </div>
      `;

      html += `</div>`; // end sav-step

      container.innerHTML = html;
      this.bindStepEvents();
    }

    // ─────────────────────────────────────────
    // 4. WIDGET FACTORY
    // ─────────────────────────────────────────
    renderFieldWidget(field) {
      const isAr = this.lang === 'ar';
      const label = this.parseLabel(field.name);
      const reqStar = field.required ? '<span class="req">*</span>' : '';
      const fieldId = `field_${field.id}`;
      const savedValue = this.formData[field.id] !== undefined ? this.formData[field.id] : '';
      const helpText = this.getParsedHelpText(field);
      const placeholder = this.getParsedPlaceholder(field.validators);

      let widgetHtml = `<div class="form-group" data-field-id="${field.id}" data-required="${field.required}">`;
      widgetHtml += `<label class="form-label" for="${fieldId}"><span>${label}</span> ${reqStar}</label>`;

      if (field.fieldType === 'TEXTAREA') {
        widgetHtml += `<textarea id="${fieldId}" class="form-textarea" placeholder="${placeholder || ''}" rows="3">${this.escapeHtml(savedValue)}</textarea>`;
      } else if (field.fieldType === 'PHONE') {
        widgetHtml += `
          <div class="phone-field-group">
            <div class="phone-flag-box" aria-hidden="true"><span>🇲🇦 +212</span></div>
            <input type="tel" id="${fieldId}" class="form-input" placeholder="${placeholder || '0612345678'}" value="${this.escapeHtml(savedValue)}" inputmode="tel" autocomplete="tel-national">
          </div>
        `;
      } else if (field.fieldType === 'EMAIL') {
        widgetHtml += `<input type="email" id="${fieldId}" class="form-input" placeholder="${placeholder || 'nom@exemple.com'}" value="${this.escapeHtml(savedValue)}" autocomplete="email">`;
      } else if (field.fieldType === 'DATE') {
        widgetHtml += `<input type="date" id="${fieldId}" class="form-input" value="${this.escapeHtml(savedValue)}">`;
      } else if (field.fieldType === 'SELECT' || field.fieldType === 'RADIO') {
        const options = field.options || [];
        let optionLabels = {};
        try {
          const valObj = typeof field.validators === 'string' ? JSON.parse(field.validators) : field.validators;
          if (valObj && valObj.optionLabels) optionLabels = valObj.optionLabels;
        } catch (e) {}

        if (options.length <= 8) {
          // Visual chips / radio cards
          widgetHtml += `<div class="sav-options-grid" role="radiogroup" aria-label="${label}">`;
          options.forEach(opt => {
            const isSelected = String(savedValue) === String(opt);
            let optText = opt;
            if (optionLabels[opt]) {
              optText = optionLabels[opt][this.lang] || optionLabels[opt].fr || opt;
            } else {
              optText = this.parseLabel(opt);
            }
            widgetHtml += `
              <button type="button" class="sav-option-card ${isSelected ? 'selected' : ''}" data-field-id="${field.id}" data-value="${this.escapeHtml(opt)}">
                <span class="sav-option-radio-dot">${isSelected ? '<i class="ti ti-check"></i>' : ''}</span>
                <span>${optText}</span>
              </button>
            `;
          });
          widgetHtml += `</div>`;
          widgetHtml += `<input type="hidden" id="${fieldId}" value="${this.escapeHtml(savedValue)}">`;
        } else {
          widgetHtml += `<select id="${fieldId}" class="form-select">`;
          widgetHtml += `<option value="">${isAr ? '— اختر خياراً —' : '— Sélectionnez une option —'}</option>`;
          options.forEach(opt => {
            let optText = opt;
            if (optionLabels[opt]) {
              optText = optionLabels[opt][this.lang] || optionLabels[opt].fr || opt;
            } else {
              optText = this.parseLabel(opt);
            }
            const isSelected = String(savedValue) === String(opt) ? 'selected' : '';
            widgetHtml += `<option value="${this.escapeHtml(opt)}" ${isSelected}>${optText}</option>`;
          });
          widgetHtml += `</select>`;
        }
      } else if (field.fieldType === 'FILE' || field.fieldType === 'PHOTO_ONLY') {
        widgetHtml += `
          <div class="dropzone-box" id="fileDropzone_${field.id}">
            <i class="ti ti-camera dropzone-icon"></i>
            <div class="dropzone-text">${isAr ? 'التقط صورة واضحة أو اسحب الملف هنا' : 'Prenez une photo ou glissez votre document ici'}</div>
            <div class="dropzone-hint">${isAr ? 'صيغة JPG أو PNG أو PDF (بحد أقصى 10 ميغابايت)' : 'JPG, PNG ou PDF (max 10 Mo)'}</div>
            <div class="dropzone-actions">
              <button type="button" class="btn-file-sub btn-webcam-trigger" data-field-id="${field.id}">
                <i class="ti ti-camera"></i> <span>${isAr ? 'فتح الكاميرا' : 'Prendre une photo'}</span>
              </button>
              ${field.helpMediaUrl ? `
                <button type="button" class="btn-file-sub btn-sample-doc-trigger" data-url="${field.helpMediaUrl}">
                  <i class="ti ti-file-certificate"></i> <span>${isAr ? 'معاينة نموذج' : 'Exemple de document'}</span>
                </button>
              ` : ''}
            </div>
            <input type="file" id="fileInput_${field.id}" accept="image/*,application/pdf" capture="environment" style="display:none;">
          </div>
          <div class="file-preview-card ${this.fileAttachment ? 'visible' : ''}" id="filePreviewCard_${field.id}">
            <img src="${this.fileAttachment && this.fileAttachment.startsWith('data:') ? this.fileAttachment : 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'64\'%3E%3C/svg%3E'}" alt="Aperçu" class="file-preview-img" id="filePreviewImg_${field.id}" width="48" height="48">
            <div class="file-meta-box">
              <div class="file-meta-title" id="filePreviewTitle_${field.id}">${this.escapeHtml(this.fileAttachmentName || (isAr ? 'وثيقة مرفقة' : 'Document joint'))}</div>
              <div class="file-meta-size" id="filePreviewSize_${field.id}">${isAr ? 'جاهز للإرسال' : 'Prêt pour validation'}</div>
            </div>
            <button type="button" class="btn-remove-file" data-field-id="${field.id}" title="${isAr ? 'حذف' : 'Supprimer'}"><i class="ti ti-trash"></i></button>
          </div>
          <div class="serial-checkbox-wrap" style="margin-top:8px;">
            <label for="checkNoDoc_${field.id}">
              <input type="checkbox" id="checkNoDoc_${field.id}" class="check-no-doc" data-field-id="${field.id}" ${this.formData.noDoc ? 'checked' : ''}>
              <span>${isAr ? 'لا تتوفر لدي الفاتورة حالياً (سأرسلها عبر واتساب)' : 'Je n\'ai pas la facture sous la main (je l\'enverrai sur WhatsApp)'}</span>
            </label>
          </div>
        `;
      } else if (field.fieldType === 'GPS') {
        const hasGps = this.gpsData && this.gpsData.lat;
        widgetHtml += `
          <div class="gps-box">
            <button type="button" class="btn-gps" id="btnGpsTrigger_${field.id}">
              <i class="ti ti-map-pin"></i> <span>${isAr ? 'تحديد موقعي عبر GPS' : 'Capturer ma Position GPS'}</span>
            </button>
            <div class="gps-feedback-text" id="gpsFeedback_${field.id}" style="${hasGps ? 'display:flex;' : 'display:none;'}">
              ${hasGps ? `<i class="ti ti-check"></i> ${isAr ? 'تم تحديد الإحداثيات' : 'Position GPS enregistrée'} (${this.gpsData.lat}, ${this.gpsData.lng})` : ''}
            </div>
          </div>
          <input type="hidden" id="${fieldId}" value="${hasGps ? `${this.gpsData.lat},${this.gpsData.lng}` : ''}">
        `;
      } else {
        // Standard TEXT (or mapped serial/name/address)
        const isSerial = field.mappingTarget === 'EQUIPMENT_SERIAL' || (field.helpMediaUrl && field.helpMediaUrl.includes('serial'));
        if (isSerial) {
          const noSerialChecked = this.formData.noSerial === true;
          widgetHtml += `
            <div class="input-with-action">
              <input type="text" id="${fieldId}" class="form-input" placeholder="${placeholder || 'Ex: PC202508300133'}" value="${this.escapeHtml(savedValue)}" autocapitalize="characters" autocomplete="off" ${noSerialChecked ? 'disabled' : ''}>
              <button type="button" class="input-action-btn btn-serial-guide-trigger" title="${isAr ? 'دليل الرقم التسلسلي' : 'Guide numéro de série'}">
                <i class="ti ti-help"></i> <span>${isAr ? 'أين أجده؟' : 'Aide'}</span>
              </button>
            </div>
            <div class="serial-checkbox-wrap">
              <label for="checkNoSerial_${field.id}">
                <input type="checkbox" id="checkNoSerial_${field.id}" class="check-no-serial" data-input-id="${fieldId}" ${noSerialChecked ? 'checked' : ''}>
                <span>${isAr ? 'لا أجد الرقم التسلسلي على جهازي' : 'Je ne trouve pas mon numéro de série'}</span>
              </label>
            </div>
          `;
        } else {
          const isName = field.mappingTarget === 'CONTACT_NAME';
          const isAddr = field.mappingTarget === 'ADDRESS';
          const autoAttr = isName ? 'autocomplete="name"' : (isAddr ? 'autocomplete="street-address"' : '');
          widgetHtml += `<input type="text" id="${fieldId}" class="form-input" placeholder="${placeholder || ''}" value="${this.escapeHtml(savedValue)}" ${autoAttr}>`;
        }
      }

      if (helpText) {
        widgetHtml += `<div class="sav-help-hint"><i class="ti ti-info-circle"></i> <span>${helpText}</span></div>`;
      }

      widgetHtml += `<div class="field-error-msg" id="err_${field.id}"><i class="ti ti-alert-circle"></i> <span>${isAr ? 'هذا الحقل إجباري' : 'Ce champ est obligatoire'}</span></div>`;
      widgetHtml += `</div>`; // end form-group
      return widgetHtml;
    }

    // ─────────────────────────────────────────
    // 5. REVIEW SCREEN
    // ─────────────────────────────────────────
    renderReviewScreen() {
      const isAr = this.lang === 'ar';
      let rows = [];

      // Collect data from each field across all steps
      this.steps.forEach(s => {
        if (s.type === 'fields') {
          s.fields.forEach(f => {
            const rawVal = this.formData[f.id];
            let displayVal = '—';
            if (f.fieldType === 'FILE' || f.fieldType === 'PHOTO_ONLY') {
              displayVal = this.fileAttachmentName ? `📷 ${this.fileAttachmentName}` : (isAr ? 'لم يتم إرفاق ملف' : 'Aucun fichier');
            } else if (f.fieldType === 'GPS') {
              displayVal = this.gpsData ? `📍 ${this.gpsData.lat}, ${this.gpsData.lng}` : (isAr ? 'غير محدد' : 'Non précisé');
            } else if (f.mappingTarget === 'EQUIPMENT_SERIAL' && this.formData.noSerial) {
              displayVal = isAr ? 'غير متوفر (سيتم التحقق عبر الفاتورة)' : 'Non trouvé (vérification par photo)';
            } else if (rawVal) {
              displayVal = String(rawVal);
            }
            rows.push({
              label: this.parseLabel(f.name),
              val: displayVal
            });
          });
        }
      });

      let reviewHtml = `
        <div class="review-card">
          <div class="review-row">
            <span class="review-key">${isAr ? 'نوع الخدمة' : 'Prestation'}</span>
            <span class="review-val">${this.activeTicketTypeId === 1 ? (isAr ? 'تحت الضمان' : 'Sous garantie constructeur') : (isAr ? 'خارج الضمان' : 'Hors garantie')}</span>
          </div>
      `;

      rows.forEach(r => {
        reviewHtml += `
          <div class="review-row">
            <span class="review-key">${r.label}</span>
            <span class="review-val">${this.escapeHtml(r.val)}</span>
          </div>
        `;
      });

      reviewHtml += `</div>`;

      // Consent group
      reviewHtml += `
        <div class="form-group form-consent-group">
          <label class="form-consent-label" for="savConsent">
            <input type="checkbox" id="savConsent" required ${this.formData.consent ? 'checked' : ''}>
            <span>${isAr ? 'أوافق على معالجة معطياتي الشخصية لإتمام طلب الصيانة وفقاً لـ <a href="confidentialite" target="_blank">سياسة الخصوصية</a>.' : 'J\'accepte que mes données soient traitées dans le cadre de ma demande SAV. Voir la <a href="confidentialite" target="_blank">politique de confidentialité</a>.'}</span>
          </label>
          <div class="field-error-msg" id="savConsentError"><i class="ti ti-alert-circle"></i> <span>${isAr ? 'يرجى تأكيد الموافقة للمتابعة' : 'Veuillez accepter pour envoyer votre demande'}</span></div>
        </div>
      `;

      return reviewHtml;
    }

    // ─────────────────────────────────────────
    // 6. EVENT BINDINGS FOR ACTIVE STEP
    // ─────────────────────────────────────────
    bindStepEvents() {
      const container = document.getElementById('savStepsContainer');
      if (!container) return;

      // Ticket type tabs
      container.querySelectorAll('.ticket-type-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          const tid = parseInt(btn.getAttribute('data-ticket-type'), 10);
          this.setTicketType(tid);
        });
      });

      // Language switcher pills
      container.querySelectorAll('.lang-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          this.toggleLanguage(btn.getAttribute('data-lang'));
        });
      });

      // Option cards (radios/selects)
      container.querySelectorAll('.sav-option-card').forEach(card => {
        card.addEventListener('click', () => {
          const fid = card.getAttribute('data-field-id');
          const val = card.getAttribute('data-value');
          const parentGrid = card.closest('.sav-options-grid');
          if (parentGrid) {
            parentGrid.querySelectorAll('.sav-option-card').forEach(c => {
              c.classList.remove('selected');
              const dot = c.querySelector('.sav-option-radio-dot');
              if (dot) dot.innerHTML = '';
            });
          }
          card.classList.add('selected');
          const dot = card.querySelector('.sav-option-radio-dot');
          if (dot) dot.innerHTML = '<i class="ti ti-check"></i>';

          const hiddenInput = document.getElementById(`field_${fid}`);
          if (hiddenInput) hiddenInput.value = val;
          this.formData[fid] = val;
          this.saveDraft();
        });
      });

      // Serial helper modals
      container.querySelectorAll('.btn-serial-guide-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
          const modal = document.getElementById('serialGuideModal');
          if (modal) modal.classList.add('active');
        });
      });

      // Sample document modal trigger
      container.querySelectorAll('.btn-sample-doc-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
          const modal = document.getElementById('sampleDocumentModal');
          if (modal) modal.classList.add('active');
        });
      });

      // "No serial" checkbox
      container.querySelectorAll('.check-no-serial').forEach(chk => {
        chk.addEventListener('change', () => {
          const targetInputId = chk.getAttribute('data-input-id');
          const inputEl = document.getElementById(targetInputId);
          this.formData.noSerial = chk.checked;
          if (inputEl) {
            inputEl.disabled = chk.checked;
            if (chk.checked) inputEl.value = '';
          }
          this.saveDraft();
        });
      });

      // "No doc" checkbox
      container.querySelectorAll('.check-no-doc').forEach(chk => {
        chk.addEventListener('change', () => {
          this.formData.noDoc = chk.checked;
          this.saveDraft();
        });
      });

      // Dropzone and file attachments
      container.querySelectorAll('.dropzone-box').forEach(dz => {
        const fid = dz.id.replace('fileDropzone_', '');
        const fileInput = document.getElementById(`fileInput_${fid}`);
        if (!fileInput) return;

        dz.addEventListener('click', (e) => {
          if (e.target.closest('.btn-file-sub')) return;
          fileInput.click();
        });

        dz.addEventListener('dragover', (e) => {
          e.preventDefault();
          dz.classList.add('dragover');
        });
        dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
        dz.addEventListener('drop', (e) => {
          e.preventDefault();
          dz.classList.remove('dragover');
          if (e.dataTransfer.files.length) {
            this.handleUploadedFile(e.dataTransfer.files[0], fid);
          }
        });

        fileInput.addEventListener('change', () => {
          if (fileInput.files.length) {
            this.handleUploadedFile(fileInput.files[0], fid);
          }
        });
      });

      // Remove file button
      container.querySelectorAll('.btn-remove-file').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const fid = btn.getAttribute('data-field-id');
          this.fileAttachment = null;
          this.fileAttachmentName = '';
          this.fileAttachmentRaw = null;
          const previewCard = document.getElementById(`filePreviewCard_${fid}`);
          if (previewCard) previewCard.classList.remove('visible');
          const fileInput = document.getElementById(`fileInput_${fid}`);
          if (fileInput) fileInput.value = '';
          this.formData[fid] = '';
          this.saveDraft();
        });
      });

      // Live webcam trigger
      container.querySelectorAll('.btn-webcam-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
          this.activeWebcamFieldId = btn.getAttribute('data-field-id');
          this.openWebcamModal();
        });
      });

      // GPS trigger
      container.querySelectorAll('.btn-gps').forEach(btn => {
        btn.addEventListener('click', () => {
          const fid = btn.id.replace('btnGpsTrigger_', '');
          this.captureGps(fid);
        });
      });

      // Navigation: Next
      const nextBtn = document.getElementById('btnStepNext');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (this.validateCurrentStep()) {
            this.saveCurrentStepInputs();
            this.currentStep++;
            this.render();
            window.scrollTo({ top: document.querySelector('.sav-main-card')?.offsetTop - 70 || 0, behavior: 'smooth' });
          }
        });
      }

      // Navigation: Prev
      const prevBtn = document.getElementById('btnStepPrev');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          this.saveCurrentStepInputs();
          if (this.currentStep > 0) {
            this.currentStep--;
            this.render();
            window.scrollTo({ top: document.querySelector('.sav-main-card')?.offsetTop - 70 || 0, behavior: 'smooth' });
          }
        });
      }

      // Navigation: Submit
      const submitBtn = document.getElementById('btnSubmitFinal');
      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          this.submitForm();
        });
      }
    }

    // ─────────────────────────────────────────
    // 7. INPUT PERSISTENCE & DRAFTS
    // ─────────────────────────────────────────
    saveCurrentStepInputs() {
      const stepObj = this.steps[this.currentStep];
      if (!stepObj) return;

      if (stepObj.type === 'fields') {
        stepObj.fields.forEach(f => {
          const el = document.getElementById(`field_${f.id}`);
          if (el) {
            this.formData[f.id] = el.value.trim();
          }
        });
      } else if (stepObj.type === 'review') {
        const consentEl = document.getElementById('savConsent');
        if (consentEl) {
          this.formData.consent = consentEl.checked;
        }
      }
      this.saveDraft();
    }

    saveDraft() {
      try {
        const draft = {
          lang: this.lang,
          activeTicketTypeId: this.activeTicketTypeId,
          currentStep: this.currentStep,
          formData: this.formData,
          gpsData: this.gpsData,
          fileAttachmentName: this.fileAttachmentName
        };
        sessionStorage.setItem('nerobel_sav_engine_draft', JSON.stringify(draft));
      } catch (e) {}
    }

    loadDraft() {
      try {
        const raw = sessionStorage.getItem('nerobel_sav_engine_draft');
        if (!raw) return;
        const draft = JSON.parse(raw);
        if (draft && draft.formData) {
          this.formData = draft.formData;
          if (draft.activeTicketTypeId) this.activeTicketTypeId = draft.activeTicketTypeId;
          if (draft.gpsData) this.gpsData = draft.gpsData;
          if (draft.fileAttachmentName) this.fileAttachmentName = draft.fileAttachmentName;
        }
      } catch (e) {}
    }

    clearDraft() {
      try {
        sessionStorage.removeItem('nerobel_sav_engine_draft');
      } catch (e) {}
    }

    // ─────────────────────────────────────────
    // 8. STEP VALIDATION
    // ─────────────────────────────────────────
    validateCurrentStep() {
      const isAr = this.lang === 'ar';
      const stepObj = this.steps[this.currentStep];
      if (!stepObj || stepObj.type !== 'fields') return true;

      let errors = [];
      const errorSummary = document.getElementById('stepErrorSummary');
      const errorList = document.getElementById('stepErrorList');

      stepObj.fields.forEach(field => {
        const fieldEl = document.getElementById(`field_${field.id}`);
        const errEl = document.getElementById(`err_${field.id}`);
        const val = fieldEl ? fieldEl.value.trim() : '';

        let isInvalid = false;
        let message = isAr ? 'هذا الحقل إجباري' : 'Ce champ est obligatoire';

        // Required check
        if (field.required) {
          if (field.mappingTarget === 'EQUIPMENT_SERIAL' && this.formData.noSerial) {
            // Allowed without serial if checked
          } else if (field.fieldType === 'FILE' || field.fieldType === 'PHOTO_ONLY') {
            if (!this.fileAttachment && !this.fileAttachmentRaw && !this.formData.noDoc) {
              isInvalid = true;
              message = isAr ? 'يرجى إرفاق صورة للوثيقة أو بطاقة الضمان' : 'Veuillez joindre une photo de votre garantie ou facture';
            }
          } else if (!val) {
            isInvalid = true;
          }
        }

        // Regex / MinLength validators
        if (!isInvalid && val && field.validators) {
          try {
            const valObj = typeof field.validators === 'string' ? JSON.parse(field.validators) : field.validators;
            if (valObj.minLength && val.length < valObj.minLength) {
              isInvalid = true;
              message = isAr ? `يجب أن يحتوي على ${valObj.minLength} أحرف على الأقل` : `Doit contenir au moins ${valObj.minLength} caractères`;
            }
            if (!isInvalid && valObj.pattern) {
              const regex = new RegExp(valObj.pattern);
              if (!regex.test(val)) {
                isInvalid = true;
                message = isAr ? 'الصيغة المدخلة غير صحيحة' : 'Format invalide';
              }
            }
          } catch (e) {}
        }

        // Phone specific check
        if (!isInvalid && val && field.fieldType === 'PHONE') {
          const cleanPhone = val.replace(/[\s.-]/g, '');
          if (!cleanPhone.match(/^(?:0[567][0-9]{8}|\+212[567][0-9]{8})$/)) {
            isInvalid = true;
            message = isAr ? 'رقم هاتف مغربي غير صحيح (مثال: 0612345678)' : 'Numéro marocain invalide (ex: 0612345678)';
          }
        }

        if (isInvalid) {
          if (fieldEl) fieldEl.classList.add('has-error');
          if (errEl) {
            errEl.querySelector('span').textContent = message;
            errEl.classList.add('visible');
          }
          errors.push({ label: this.parseLabel(field.name), msg: message, id: `field_${field.id}` });
        } else {
          if (fieldEl) fieldEl.classList.remove('has-error');
          if (errEl) errEl.classList.remove('visible');
        }
      });

      if (errors.length > 0) {
        if (errorSummary && errorList) {
          errorList.innerHTML = errors.map(e => `<li><a href="#${e.id}"><strong>${e.label}</strong>: ${e.msg}</a></li>`).join('');
          errorSummary.style.display = 'block';
          errorSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
      }

      if (errorSummary) errorSummary.style.display = 'none';
      return true;
    }

    // ─────────────────────────────────────────
    // 9. FILE COMPRESSION & ATTACHMENT
    // ─────────────────────────────────────────
    handleUploadedFile(file, fieldId) {
      const isAr = this.lang === 'ar';
      if (file.size > 10 * 1024 * 1024) {
        if (window.showToast) window.showToast(isAr ? 'الملف كبير جداً (الحد الأقصى 10 ميغابايت)' : 'Le fichier est trop volumineux (max 10 Mo)', 'error');
        return;
      }

      this.fileAttachmentName = file.name;
      this.fileAttachmentRaw = file;

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

            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
            this.fileAttachment = compressedDataUrl;
            this.updateFilePreviewCard(fieldId, file.name, compressedDataUrl, isAr ? 'صورة محسنة' : 'Image compressée');
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.fileAttachment = e.target.result;
          this.updateFilePreviewCard(fieldId, file.name, null, `${(file.size / (1024 * 1024)).toFixed(2)} Mo`);
        };
        reader.readAsDataURL(file);
      }
      this.saveDraft();
    }

    updateFilePreviewCard(fieldId, name, dataUrl, sizeText) {
      const previewCard = document.getElementById(`filePreviewCard_${fieldId}`);
      const previewImg = document.getElementById(`filePreviewImg_${fieldId}`);
      const previewTitle = document.getElementById(`filePreviewTitle_${fieldId}`);
      const previewSize = document.getElementById(`filePreviewSize_${fieldId}`);

      if (previewImg) {
        if (dataUrl) {
          previewImg.src = dataUrl;
        } else {
          previewImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%232563EB' stroke-width='2'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/%3E%3Cpolyline points='14 2 14 8 20 8'/%3E%3C/svg%3E";
        }
      }
      if (previewTitle) previewTitle.textContent = name;
      if (previewSize) previewSize.textContent = sizeText;
      if (previewCard) previewCard.classList.add('visible');
    }

    // ─────────────────────────────────────────
    // 10. GPS GEOLOCATION & LEAFLET MAP
    // ─────────────────────────────────────────
    captureGps(fieldId) {
      const isAr = this.lang === 'ar';
      const feedback = document.getElementById(`gpsFeedback_${fieldId}`);
      const hiddenInput = document.getElementById(`field_${fieldId}`);
      const gpsModal = document.getElementById('gpsMapModal');

      if (!navigator.geolocation) {
        if (feedback) {
          feedback.innerHTML = `<i class="ti ti-alert-triangle"></i> ${isAr ? 'الموقع غير متاح، يرجى كتابة العنوان' : 'Position non autorisée. Saisissez votre adresse.'}`;
          feedback.style.color = 'var(--err)';
          feedback.style.display = 'flex';
        }
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          this.gpsData = {
            lat: latitude.toFixed(6),
            lng: longitude.toFixed(6),
            acc: accuracy ? Math.round(accuracy) : null
          };

          if (hiddenInput) hiddenInput.value = `${this.gpsData.lat},${this.gpsData.lng}`;
          if (feedback) {
            feedback.innerHTML = `<i class="ti ti-check"></i> ${isAr ? 'تم تحديد الإحداثيات' : 'Position GPS enregistrée'} (${this.gpsData.lat}, ${this.gpsData.lng})`;
            feedback.style.color = 'var(--ok)';
            feedback.style.display = 'flex';
          }

          if (gpsModal) {
            gpsModal.classList.add('active');
            this.initLeafletMap(latitude, longitude, fieldId);
          }
          this.saveDraft();
        },
        (err) => {
          if (feedback) {
            feedback.innerHTML = `<i class="ti ti-alert-triangle"></i> ${isAr ? 'تعذر جلب الموقع. يرجى كتابة العنوان كاملاً.' : 'Position non autorisée. Saisissez votre adresse.'}`;
            feedback.style.color = 'var(--err)';
            feedback.style.display = 'flex';
          }
        },
        { timeout: 8000 }
      );
    }

    initLeafletMap(lat, lng, fieldId) {
      setTimeout(() => {
        if (typeof L === 'undefined') return;
        const mapContainer = document.getElementById('leafletMap');
        if (!mapContainer) return;

        if (!this.leafletMap) {
          this.leafletMap = L.map('leafletMap').setView([lat, lng], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(this.leafletMap);
        } else {
          this.leafletMap.setView([lat, lng], 15);
          this.leafletMap.invalidateSize();
        }

        const confirmBtn = document.getElementById('btnConfirmGps');
        if (confirmBtn) {
          confirmBtn.onclick = () => {
            const center = this.leafletMap.getCenter();
            this.gpsData = { lat: center.lat.toFixed(6), lng: center.lng.toFixed(6) };
            const modal = document.getElementById('gpsMapModal');
            if (modal) modal.classList.remove('active');

            const feedback = document.getElementById(`gpsFeedback_${fieldId}`);
            if (feedback) {
              const isAr = this.lang === 'ar';
              feedback.innerHTML = `<i class="ti ti-check"></i> ${isAr ? 'تم تأكيد الموقع على الخريطة' : 'Position confirmée sur la carte'} (${this.gpsData.lat}, ${this.gpsData.lng})`;
              feedback.style.color = 'var(--ok)';
              feedback.style.display = 'flex';
            }
            this.saveDraft();
          };
        }
      }, 200);
    }

    // ─────────────────────────────────────────
    // 11. LIVE WEBCAM CAPTURE
    // ─────────────────────────────────────────
    async openWebcamModal() {
      const isAr = this.lang === 'ar';
      const modal = document.getElementById('webcamModal');
      const video = document.getElementById('webcamVideo');
      const previewImg = document.getElementById('webcamCapturedPreview');
      const captureBtn = document.getElementById('btnCapturePhoto');
      const retakeBtn = document.getElementById('btnRetakePhoto');
      const confirmBtn = document.getElementById('btnConfirmWebcamPhoto');

      if (!modal) return;
      modal.classList.add('active');

      try {
        this.webcamStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (video) {
          video.srcObject = this.webcamStream;
          video.style.display = 'block';
          if (previewImg) previewImg.style.display = 'none';
          if (captureBtn) captureBtn.style.display = 'inline-flex';
          if (retakeBtn) retakeBtn.style.display = 'none';
          if (confirmBtn) confirmBtn.style.display = 'none';
        }
      } catch (err) {
        modal.classList.remove('active');
        if (window.showToast) window.showToast(isAr ? 'تعذر الوصول إلى الكاميرا' : 'Accès caméra indisponible', 'error');
      }

      if (captureBtn && video) {
        captureBtn.onclick = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

          video.style.display = 'none';
          if (previewImg) {
            previewImg.src = dataUrl;
            previewImg.style.display = 'block';
          }
          captureBtn.style.display = 'none';
          if (retakeBtn) retakeBtn.style.display = 'inline-flex';
          if (confirmBtn) confirmBtn.style.display = 'inline-flex';
        };
      }

      if (retakeBtn && video) {
        retakeBtn.onclick = () => {
          video.style.display = 'block';
          if (previewImg) previewImg.style.display = 'none';
          captureBtn.style.display = 'inline-flex';
          retakeBtn.style.display = 'none';
          confirmBtn.style.display = 'none';
        };
      }

      if (confirmBtn && previewImg) {
        confirmBtn.onclick = () => {
          this.fileAttachment = previewImg.src;
          this.fileAttachmentName = 'photo_camera_sav.jpg';
          this.fileAttachmentRaw = null;
          if (this.activeWebcamFieldId) {
            this.updateFilePreviewCard(this.activeWebcamFieldId, this.fileAttachmentName, previewImg.src, isAr ? 'التقاط مباشر' : 'Capture Caméra');
          }
          this.stopWebcam();
          if (window.showToast) window.showToast(isAr ? 'تم التقاط الصورة بنجاح' : 'Photo capturée avec succès', 'success');
        };
      }
    }

    stopWebcam() {
      const modal = document.getElementById('webcamModal');
      if (this.webcamStream) {
        this.webcamStream.getTracks().forEach(t => t.stop());
        this.webcamStream = null;
      }
      if (modal) modal.classList.remove('active');
    }

    // ─────────────────────────────────────────
    // 12. GLOBAL MODALS BINDINGS
    // ─────────────────────────────────────────
    bindGlobalModals() {
      // Close serial modal
      const closeSerial = document.getElementById('closeSerialGuideModal');
      const btnUnderstood = document.getElementById('btnUnderstood');
      const serialModal = document.getElementById('serialGuideModal');
      const closeSerialFn = () => serialModal && serialModal.classList.remove('active');
      if (closeSerial) closeSerial.addEventListener('click', closeSerialFn);
      if (btnUnderstood) btnUnderstood.addEventListener('click', closeSerialFn);

      // Close sample doc modal
      const closeDoc = document.getElementById('closeSampleDocModal');
      const btnDocClose = document.getElementById('btnSampleDocClose');
      const docModal = document.getElementById('sampleDocumentModal');
      const closeDocFn = () => docModal && docModal.classList.remove('active');
      if (closeDoc) closeDoc.addEventListener('click', closeDocFn);
      if (btnDocClose) btnDocClose.addEventListener('click', closeDocFn);

      // Close GPS modal
      const closeGps = document.getElementById('closeGpsModal');
      const gpsModal = document.getElementById('gpsMapModal');
      if (closeGps && gpsModal) {
        closeGps.addEventListener('click', () => gpsModal.classList.remove('active'));
      }

      // Close Webcam modal
      const closeWebcam = document.getElementById('closeWebcamModal');
      if (closeWebcam) {
        closeWebcam.addEventListener('click', () => this.stopWebcam());
      }

      // Escape listener
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (serialModal && serialModal.classList.contains('active')) closeSerialFn();
          if (docModal && docModal.classList.contains('active')) closeDocFn();
          if (gpsModal && gpsModal.classList.contains('active')) gpsModal.classList.remove('active');
          if (this.webcamStream) this.stopWebcam();
        }
      });
    }

    // ─────────────────────────────────────────
    // 13. FORM SUBMISSION (MULTIPART)
    // ─────────────────────────────────────────
    async submitForm() {
      const isAr = this.lang === 'ar';
      const submitBtn = document.getElementById('btnSubmitFinal');
      const consentEl = document.getElementById('savConsent');
      const consentErr = document.getElementById('savConsentError');
      const errorBox = document.getElementById('savSubmitError');
      const errorText = document.getElementById('savSubmitErrorText');

      // Honeypot check
      const hp = document.getElementById('savHp');
      if (hp && hp.value) {
        console.warn('Spam submission detected by honeypot.');
        return;
      }

      // Check consent
      if (consentEl && !consentEl.checked) {
        if (consentErr) consentErr.classList.add('visible');
        consentEl.focus();
        return;
      }
      if (consentErr) consentErr.classList.remove('visible');

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="ti ti-loader"></i> <span>${isAr ? 'جاري الإرسال...' : 'Envoi en cours...'}</span>`;
      if (errorBox) errorBox.style.display = 'none';

      try {
        const formData = new FormData();
        const activeTicket = (this.config.ticketTypes || []).find(t => t.id === this.activeTicketTypeId) || this.config.ticketTypes[0];
        const fields = activeTicket.fields || [];

        // 1. Map Core Identity Fields
        let fullName = '';
        let phone = '';
        let serialNumber = '';
        let address = '';

        fields.forEach(f => {
          const val = this.formData[f.id] || '';
          if (f.mappingTarget === 'CONTACT_NAME') fullName = val;
          if (f.mappingTarget === 'CONTACT_PHONE') phone = val;
          if (f.mappingTarget === 'EQUIPMENT_SERIAL') serialNumber = val;
          if (f.mappingTarget === 'ADDRESS') address = val;
        });

        // Fallback search by field name / types
        if (!fullName) {
          const f = fields.find(x => x.name.toLowerCase().includes('nom') || x.name.toLowerCase().includes('client'));
          if (f) fullName = this.formData[f.id] || '';
        }
        if (!phone) {
          const f = fields.find(x => x.fieldType === 'PHONE');
          if (f) phone = this.formData[f.id] || '';
        }
        if (!serialNumber) {
          const f = fields.find(x => x.name.toLowerCase().includes('série') || x.name.toLowerCase().includes('تسلسلي'));
          if (f) serialNumber = this.formData[f.id] || '';
        }
        if (!address) {
          const f = fields.find(x => x.name.toLowerCase().includes('adresse') || x.name.toLowerCase().includes('عنوان'));
          if (f) address = this.formData[f.id] || '';
        }

        if (this.formData.noSerial || !serialNumber) {
          serialNumber = 'SANS-NUMERO';
        }

        let fullAddress = address.trim();
        if (fullAddress.length < 10) {
          fullAddress = `${fullAddress}, Casablanca, Maroc`;
        }

        formData.append('fullName', fullName || 'Client Nerobel');
        formData.append('phone', phone || '0600000000');
        formData.append('serialNumber', serialNumber);
        formData.append('address', fullAddress);
        formData.append('serviceId', String(this.serviceId));
        formData.append('ticketTypeId', String(this.activeTicketTypeId));
        formData.append('websiteKey', 'nerobel.com');

        // 2. Custom Fields Object (FlowOps expects numeric string IDs as keys)
        const customFields = {};
        fields.forEach(f => {
          const val = this.formData[f.id];
          if (val !== undefined && val !== null && val !== '') {
            customFields[String(f.id)] = val;
          }
        });

        // Ensure required TicketType 1 fields are populated if missing
        if (this.activeTicketTypeId === 1 && !customFields["84"]) {
          customFields["84"] = new Date().toISOString().split('T')[0];
        }
        formData.append('customFieldsJson', JSON.stringify(customFields));

        // 3. GPS Coordinates
        if (this.gpsData && this.gpsData.lat && this.gpsData.lng) {
          formData.append('gpsLat', String(this.gpsData.lat));
          formData.append('gpsLng', String(this.gpsData.lng));
          if (this.gpsData.acc) formData.append('gpsAccuracy', String(this.gpsData.acc));
        }

        // 4. File Attachment
        if (this.fileAttachmentRaw) {
          formData.append('contractFile', this.fileAttachmentRaw, this.fileAttachmentName || this.fileAttachmentRaw.name);
        } else if (this.fileAttachment && typeof this.fileAttachment === 'string' && this.fileAttachment.startsWith('data:')) {
          const photoBlob = await fetch(this.fileAttachment).then(r => r.blob());
          formData.append('contractFile', photoBlob, this.fileAttachmentName || 'photo_sav.jpg');
        } else if (this.activeTicketTypeId === 1) {
          // FlowOps ticketTypeId=1 requires a contract file; supply fallback 1x1 png
          const dummyBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
          const byteChars = atob(dummyBase64);
          const byteNums = new Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
          const dummyBlob = new Blob([new Uint8Array(byteNums)], { type: 'image/png' });
          formData.append('contractFile', dummyBlob, 'sans_photo.png');
        }

        // 5. Send POST
        const response = await fetch(this.apiEndpoint, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok || (!result.publicCode && !result.ticketNumber && !result.ticketId)) {
          const errDetail = result.detail || result.message || `HTTP ${response.status}`;
          throw new Error(errDetail);
        }

        const publicCode = result.publicCode || result.ticketNumber || `SAV-${result.ticketId}`;
        this.renderSuccessPanel(publicCode);

      } catch (err) {
        console.error('[Nerobel SAV Submission Error]', err);
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="ti ti-send"></i> <span>${isAr ? 'إرسال طلب الصيانة' : 'Transmettre ma Demande SAV'}</span>`;

        if (errorBox) {
          errorBox.style.display = 'block';
          if (errorText) {
            errorText.textContent = isAr 
              ? `تعذر الإرسال: ${err.message || 'يرجى التحقق من اتصال الإنترنت والبيانات المدخلة'}`
              : `Échec de l'envoi : ${err.message || 'Veuillez vérifier votre connexion et les champs saisis.'}`;
          }
          errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }

    // ─────────────────────────────────────────
    // 14. SUCCESS PANEL & POST-PROCESSING
    // ─────────────────────────────────────────
    renderSuccessPanel(publicCode) {
      const isAr = this.lang === 'ar';
      this.clearDraft();

      const container = document.getElementById('savStepsContainer');
      const successPanel = document.getElementById('savSuccessPanel');
      if (container) container.style.display = 'none';
      if (!successPanel) return;

      successPanel.classList.add('visible');

      const titleEl = document.getElementById('savSuccessTitle');
      const descEl = document.getElementById('savSuccessDesc');
      const ticketBox = document.getElementById('savTicketBox');
      const codeEl = document.getElementById('displayTicketCode');
      const copyBtn = document.getElementById('btnCopyCode');
      const waBtn = document.getElementById('btnWhatsAppAction');
      const pdfBtn = document.getElementById('btnDownloadPdf');

      if (titleEl) titleEl.textContent = isAr ? 'تم استلام طلبكم بنجاح !' : 'Demande SAV enregistrée avec succès !';
      if (descEl) descEl.textContent = isAr ? 'تم تحويل ملفكم إلى فريق الدعم الفني Nerobel. يرجى الاحتفاظ برمز التتبع الخاص بكم :' : 'Votre dossier a été transmis à nos équipes techniques. Conservez votre numéro de dossier :';

      if (codeEl) codeEl.textContent = publicCode;
      if (ticketBox) ticketBox.style.display = 'inline-flex';

      if (copyBtn) {
        copyBtn.textContent = isAr ? 'نسخ' : 'Copier';
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(publicCode).then(() => {
            copyBtn.textContent = isAr ? 'تم النسخ !' : 'Copié !';
            setTimeout(() => { copyBtn.textContent = isAr ? 'نسخ' : 'Copier'; }, 2500);
          }).catch(() => {});
        };
      }

      // WhatsApp bilingual link
      const waMsg = encodeURIComponent(isAr 
        ? `مرحباً Nerobel، قمت بتسجيل طلب صيانة برقم الملف: ${publicCode}. يرجى إفادتي بموعد تدخل التقني.`
        : `Bonjour Nerobel, j'ai enregistré ma demande SAV sous le N° ${publicCode}. Merci de m'indiquer la prise en charge.`);
      if (waBtn) {
        waBtn.href = `https://wa.me/${this.whatsappNumber}?text=${waMsg}`;
        const waSpan = waBtn.querySelector('span');
        if (waSpan) waSpan.textContent = isAr ? 'متابعة عبر واتساب' : 'Suivre sur WhatsApp';
      }

      // Official FlowOps PDF receipt link
      const receiptUrl = `https://savnerobel.nexenflow.com/api/public/sav-requests/${encodeURIComponent(publicCode)}/receipt`;
      if (pdfBtn) {
        const pdfSpan = pdfBtn.querySelector('span');
        if (pdfSpan) pdfSpan.textContent = isAr ? 'تحميل وصل الاستلام (PDF)' : 'Télécharger le Reçu (PDF)';
        pdfBtn.onclick = (e) => {
          e.preventDefault();
          window.open(receiptUrl, '_blank', 'noopener');
        };
      }

      if (window.nerobelAnalytics) {
        window.nerobelAnalytics.track('sav_submit_success', { publicCode, ticketTypeId: this.activeTicketTypeId });
      }

      window.scrollTo({ top: document.querySelector('.sav-main-card')?.offsetTop - 60 || 0, behavior: 'smooth' });
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  }

  // Auto-boot on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('savStepsContainer')) {
      window.nerobelSavEngine = new NerobelSavEngine();
      window.nerobelSavEngine.init();
    }
  });

})();

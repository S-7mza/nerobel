/**
 * ─────────────────────────────────────────────────────────────────────────────
 * NEROBEL GROUP · OPTION A: EMBEDDABLE LIGHTWEIGHT SAV ENGINE
 * File: js/nerobel-sav-engine.js (v1.0 Autonomous Embed)
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop-in schema-driven customer service engine for Nerobel.com or external CMS.
 *
 * Usage:
 *   <div id="nerobel-sav-app"></div>
 *   <script src="js/nerobel-sav-engine.js" defer></script>
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // Prevent multiple initializations
  if (window.__NerobelSavEngineLoaded) return;
  window.__NerobelSavEngineLoaded = true;

  const SERVICE_ID = 6;
  const WHATSAPP_NUMBER = '212718999867';
  const PRIMARY_API = (typeof window !== 'undefined' && window.location.protocol.startsWith('http') && (window.location.hostname.includes('nerobel.com') || window.location.hostname === 'localhost'))
    ? (window.location.port === '8099' ? '/api/public/sav-requests' : '/sav-proxy.php')
    : '/api/public/sav-requests';
  const REMOTE_API = 'https://savnerobel.nexenflow.com/api/public/sav-requests';

  // Offline schema fallback to ensure the form always renders even if network is offline
  const FALLBACK_SCHEMA = {
    serviceId: 6,
    serviceName: "SAV",
    defaultTicketTypeId: 1,
    ticketTypes: [
      {
        id: 1,
        name: "Sous garantie / تحت الضمان",
        fields: [
          {
            id: 13,
            name: "Nom complet / الاسم الكامل",
            stepName: "1. Vos coordonnées / معلومات الاتصال",
            fieldType: "TEXT",
            required: true,
            mappingTarget: "CONTACT_NAME",
            validators: JSON.stringify({ minLength: 3, placeholder: { fr: "Ex: Mohamed Alami", ar: "مثال: محمد العلمي" } })
          },
          {
            id: 15,
            name: "Téléphone / رقم الهاتف",
            stepName: "1. Vos coordonnées / معلومات الاتصال",
            fieldType: "PHONE",
            required: true,
            mappingTarget: "CONTACT_PHONE",
            validators: JSON.stringify({ pattern: "^0[567][0-9]{8}$", placeholder: { fr: "0612345678", ar: "0612345678" } })
          },
          {
            id: 82,
            name: "Email / بريد إلكتروني",
            stepName: "1. Vos coordonnées / معلومات الاتصال",
            fieldType: "EMAIL",
            required: false,
            validators: JSON.stringify({ placeholder: { fr: "nom@exemple.com", ar: "nom@exemple.com" } })
          },
          {
            id: 35,
            name: "Description détaillée / وصف مفصل",
            stepName: "2. Description du problème / وصف المشكلة",
            fieldType: "TEXTAREA",
            required: false,
            validators: JSON.stringify({ minLength: 10, placeholder: { fr: "Précisez la panne ou le code erreur...", ar: "صف العطل أو رمز الخطأ بالتفصيل..." } })
          },
          {
            id: 20,
            name: "Adresse complète / العنوان الكامل",
            stepName: "3. Adresse d'intervention / عنوان التدخل",
            fieldType: "TEXTAREA",
            required: true,
            mappingTarget: "ADDRESS",
            validators: JSON.stringify({ minLength: 10, placeholder: { fr: "Quartier, N° Rue, Résidence, Ville...", ar: "الحي، رقم الشارع، الإقامة، المدينة..." } })
          },
          {
            id: 29,
            name: "Numéro de série / الرقم التسلسلي",
            stepName: "4. Contrat & Garantie / العقد والضمان",
            fieldType: "TEXT",
            required: true,
            mappingTarget: "EQUIPMENT_SERIAL",
            helpMediaUrl: "serial-number-guide.svg",
            validators: JSON.stringify({ placeholder: { fr: "Ex: PC202508300133", ar: "مثال: PC202508300133" } })
          },
          {
            id: 84,
            name: "Date d'achat / تاريخ الشراء",
            stepName: "4. Contrat & Garantie / العقد والضمان",
            fieldType: "DATE",
            required: true
          },
          {
            id: 26,
            name: "Photo du bon de garantie / facture / صورة الضمان",
            stepName: "4. Contrat & Garantie / العقد والضمان",
            fieldType: "PHOTO_ONLY",
            required: true,
            helpMediaUrl: "contract-sample.webp"
          }
        ]
      },
      {
        id: 2,
        name: "Hors garantie / خارج الضمان",
        fields: [
          {
            id: 12,
            name: "Nom complet / الاسم الكامل",
            stepName: "1. Vos coordonnées / معلومات الاتصال",
            fieldType: "TEXT",
            required: true,
            mappingTarget: "CONTACT_NAME"
          },
          {
            id: 14,
            name: "Téléphone / رقم الهاتف",
            stepName: "1. Vos coordonnées / معلومات الاتصال",
            fieldType: "PHONE",
            required: true,
            mappingTarget: "CONTACT_PHONE"
          },
          {
            id: 37,
            name: "Numéro de série / الرقم التسلسلي",
            stepName: "2. Équipement / الجهاز",
            fieldType: "TEXT",
            required: true,
            mappingTarget: "EQUIPMENT_SERIAL"
          },
          {
            id: 38,
            name: "Marque / الماركة",
            stepName: "2. Équipement / الجهاز",
            fieldType: "SELECT",
            required: true,
            options: ["Theros", "Eurogas", "Saunier Duval", "Vaillant", "Bosch", "Ariston", "Autre"]
          },
          {
            id: 43,
            name: "Type de panne / نوع العطل",
            stepName: "3. Description / تفاصيل العطل",
            fieldType: "SELECT",
            required: true,
            options: ["no_hot_water", "circuit_breaker", "thermostat", "heating_element", "water_leak", "other"],
            validators: JSON.stringify({
              optionLabels: {
                no_hot_water: { fr: "Pas d'eau chaude", ar: "لا يوجد ماء ساخن" },
                circuit_breaker: { fr: "Disjoncteur saute", ar: "القاطع يفصل" },
                thermostat: { fr: "Thermostat défectueux", ar: "ترموستات معطل" },
                heating_element: { fr: "Résistance grillée", ar: "مقاومة محترقة" },
                water_leak: { fr: "Fuite d'eau", ar: "تسرب ماء" },
                other: { fr: "Autre problème", ar: "عطل آخر" }
              }
            })
          },
          {
            id: 44,
            name: "Description détaillée / وصف مفصل",
            stepName: "3. Description / تفاصيل العطل",
            fieldType: "TEXTAREA",
            required: false
          },
          {
            id: 19,
            name: "Adresse complète / العنوان الكامل",
            stepName: "4. Adresse d'intervention / عنوان التدخل",
            fieldType: "TEXTAREA",
            required: true,
            mappingTarget: "ADDRESS",
            validators: JSON.stringify({ minLength: 10 })
          },
          {
            id: 27,
            name: "Photo de l'appareil / facture / صورة الجهاز",
            stepName: "5. Documents / المستندات",
            fieldType: "FILE",
            required: false
          }
        ]
      }
    ]
  };

  class AutonomousSavEngine {
    constructor(targetRoot) {
      this.root = targetRoot;
      this.lang = (document.documentElement.lang === 'ar' || document.documentElement.dir === 'rtl') ? 'ar' : 'fr';
      this.activeTicketTypeId = 1;
      this.currentStepIndex = 0;
      this.schema = null;
      this.steps = [];
      this.formData = {};
      this.fileBlob = null;
      this.fileName = '';
      this.gpsCoords = null;
    }

    async boot() {
      this.ensureStylesLoaded();
      this.renderLoading();
      await this.loadSchema();
      this.buildSteps();
      this.render();
    }

    ensureStylesLoaded() {
      if (!document.getElementById('nerobel-sav-engine-css')) {
        const link = document.createElement('link');
        link.id = 'nerobel-sav-engine-css';
        link.rel = 'stylesheet';
        link.href = 'css/nerobel-sav-engine.css';
        document.head.appendChild(link);
      }
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

    renderLoading() {
      const isAr = this.lang === 'ar';
      this.root.className = 'nerobel-sav-app';
      this.root.setAttribute('dir', isAr ? 'rtl' : 'ltr');
      this.root.innerHTML = `
        <div style="text-align:center; padding: 40px 20px;">
          <div style="font-size:2rem; margin-bottom:12px;">⚙️</div>
          <p style="color:var(--sav-text-muted); font-weight:600;">
            ${isAr ? 'جاري تحميل نموذج الخدمة...' : 'Chargement du formulaire SAV...'}
          </p>
        </div>
      `;
    }

    async loadSchema() {
      // 1. Try local proxy endpoint first
      try {
        const res = await fetch(`${PRIMARY_API}?serviceId=${SERVICE_ID}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.ticketTypes && data.ticketTypes.length > 0) {
            this.schema = data;
            this.activeTicketTypeId = data.defaultTicketTypeId || 1;
            return;
          }
        }
      } catch (e) {}

      // 2. Try direct remote endpoint
      try {
        const res = await fetch(`${REMOTE_API}?serviceId=${SERVICE_ID}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.ticketTypes && data.ticketTypes.length > 0) {
            this.schema = data;
            this.activeTicketTypeId = data.defaultTicketTypeId || 1;
            return;
          }
        }
      } catch (e) {}

      // 3. Fallback schema snapshot
      this.schema = FALLBACK_SCHEMA;
      this.activeTicketTypeId = FALLBACK_SCHEMA.defaultTicketTypeId;
    }

    buildSteps() {
      const ticketType = (this.schema.ticketTypes || []).find(t => t.id === this.activeTicketTypeId) || this.schema.ticketTypes[0];
      const fields = [...(ticketType.fields || [])];
      fields.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      const groups = new Map();
      fields.forEach(f => {
        const stepName = f.stepName || (this.lang === 'ar' ? '1. المعلومات' : '1. Informations');
        if (!groups.has(stepName)) groups.set(stepName, []);
        groups.get(stepName).push(f);
      });

      this.steps = [];
      for (const [title, stepFields] of groups.entries()) {
        this.steps.push({
          type: 'fields',
          title: title,
          fields: stepFields
        });
      }

      // Add Review Step
      this.steps.push({
        type: 'review',
        title: this.lang === 'ar' ? 'التأكيد والإرسال' : 'Confirmation & Envoi',
        fields: []
      });

      if (this.currentStepIndex >= this.steps.length) {
        this.currentStepIndex = 0;
      }
    }

    setTicketType(typeId) {
      this.saveStepInputs();
      this.activeTicketTypeId = typeId;
      this.currentStepIndex = 0;
      this.buildSteps();
      this.render();
    }

    setLanguage(newLang) {
      this.saveStepInputs();
      this.lang = newLang;
      this.buildSteps();
      this.render();
    }

    render() {
      const isAr = this.lang === 'ar';
      this.root.className = 'nerobel-sav-app';
      this.root.setAttribute('dir', isAr ? 'rtl' : 'ltr');

      const totalSteps = this.steps.length;
      const curStep = this.steps[this.currentStepIndex];
      const stepTitle = this.parseLabel(curStep.title);

      let html = `
        <div class="sav-engine-top-bar">
          <div class="sav-engine-type-selector">
      `;

      (this.schema.ticketTypes || []).forEach(tt => {
        const activeCls = tt.id === this.activeTicketTypeId ? 'active' : '';
        html += `<button type="button" class="sav-engine-type-btn ${activeCls}" data-tt="${tt.id}">${this.parseLabel(tt.name)}</button>`;
      });

      html += `
          </div>
          <div class="sav-engine-lang-switch">
            <button type="button" class="sav-engine-lang-btn ${!isAr ? 'active' : ''}" data-l="fr">FR</button>
            <button type="button" class="sav-engine-lang-btn ${isAr ? 'active' : ''}" data-l="ar">العربية</button>
          </div>
        </div>

        <div class="sav-engine-progress-wrap">
          <div class="sav-engine-bars">
      `;

      for (let i = 0; i < totalSteps; i++) {
        let cls = 'sav-engine-bar';
        if (i < this.currentStepIndex) cls += ' completed';
        if (i === this.currentStepIndex) cls += ' active';
        html += `<div class="${cls}"></div>`;
      }

      html += `
          </div>
          <div class="sav-engine-indicator">
            ${isAr ? `المرحلة ${this.currentStepIndex + 1} من ${totalSteps} · ${stepTitle}` : `Étape ${this.currentStepIndex + 1} sur ${totalSteps} · ${stepTitle}`}
          </div>
        </div>

        <h2 class="sav-engine-title">${stepTitle}</h2>
        <p class="sav-engine-subtitle">${isAr ? 'يرجى استكمال البيانات للمتابعة' : 'Complétez les informations requises pour continuer'}</p>

        <form id="savEngineForm" onsubmit="return false;">
          <input type="text" name="_hp_check" style="display:none;" tabindex="-1" autocomplete="off">
      `;

      if (curStep.type === 'review') {
        html += this.renderReview();
      } else {
        html += `<div class="sav-engine-fields-grid">`;
        curStep.fields.forEach(f => {
          html += this.renderWidget(f);
        });
        html += `</div>`;
      }

      html += `
        <div class="sav-engine-nav">
          ${this.currentStepIndex > 0 ? `
            <button type="button" class="sav-engine-btn sav-engine-btn-secondary" id="savPrevBtn">
              ${isAr ? 'السابق' : 'Retour'}
            </button>
          ` : `<div></div>`}

          ${this.currentStepIndex < totalSteps - 1 ? `
            <button type="button" class="sav-engine-btn sav-engine-btn-primary" id="savNextBtn">
              ${isAr ? 'متابعة' : 'Continuer'}
            </button>
          ` : `
            <button type="button" class="sav-engine-btn sav-engine-btn-primary" id="savSubmitBtn">
              ${isAr ? 'إرسال طلب الصيانة' : 'Transmettre ma Demande SAV'}
            </button>
          `}
        </div>
      </form>
      `;

      this.root.innerHTML = html;
      this.bindEvents();
    }

    renderWidget(field) {
      const isAr = this.lang === 'ar';
      const label = this.parseLabel(field.name);
      const req = field.required;
      const reqStar = req ? '<span class="req">*</span>' : '';
      const fid = `sav_f_${field.id}`;
      const savedVal = this.formData[field.id] || '';

      let w = `<div class="sav-engine-group" data-fid="${field.id}" data-req="${req}">`;
      w += `<label class="sav-engine-label" for="${fid}"><span>${label}</span> ${reqStar}</label>`;

      if (field.fieldType === 'TEXTAREA') {
        w += `<textarea id="${fid}" class="sav-engine-textarea" placeholder="${isAr ? 'اكتب التفاصيل هنا...' : 'Précisez votre demande...'}" rows="3">${this.escape(savedVal)}</textarea>`;
      } else if (field.fieldType === 'PHONE') {
        w += `
          <div class="sav-engine-phone-box">
            <div class="sav-engine-flag">🇲🇦 +212</div>
            <input type="tel" id="${fid}" class="sav-engine-input" placeholder="0612345678" value="${this.escape(savedVal)}">
          </div>
        `;
      } else if (field.fieldType === 'DATE') {
        w += `<input type="date" id="${fid}" class="sav-engine-input" value="${this.escape(savedVal)}">`;
      } else if (field.fieldType === 'SELECT' || field.fieldType === 'RADIO') {
        const opts = field.options || [];
        let optLabels = {};
        try {
          const v = typeof field.validators === 'string' ? JSON.parse(field.validators) : field.validators;
          if (v && v.optionLabels) optLabels = v.optionLabels;
        } catch (e) {}

        w += `<div class="sav-engine-chips-grid">`;
        opts.forEach(opt => {
          const isSelected = String(savedVal) === String(opt);
          let text = opt;
          if (optLabels[opt]) {
            text = optLabels[opt][this.lang] || optLabels[opt].fr || opt;
          } else {
            text = this.parseLabel(opt);
          }
          w += `
            <button type="button" class="sav-engine-chip ${isSelected ? 'selected' : ''}" data-fid="${field.id}" data-v="${this.escape(opt)}">
              <span class="sav-engine-chip-radio">${isSelected ? '✓' : ''}</span>
              <span>${text}</span>
            </button>
          `;
        });
        w += `</div><input type="hidden" id="${fid}" value="${this.escape(savedVal)}">`;
      } else if (field.fieldType === 'FILE' || field.fieldType === 'PHOTO_ONLY') {
        w += `
          <div class="sav-engine-dropzone" id="dz_${field.id}">
            <div class="sav-engine-drop-icon">📷</div>
            <div class="sav-engine-drop-title">${isAr ? 'التقط صورة واضحة للوثيقة أو اسحب الملف هنا' : 'Prendre une photo ou glisser le document'}</div>
            <div class="sav-engine-drop-hint">JPG, PNG ou PDF (max 10 Mo)</div>
            <input type="file" id="fi_${field.id}" accept="image/*,application/pdf" capture="environment" style="display:none;">
          </div>
          <div class="sav-engine-file-preview ${this.fileBlob ? 'visible' : ''}" id="fp_${field.id}">
            <img src="${this.fileBlob && this.fileBlob.startsWith('data:') ? this.fileBlob : 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'44\' height=\'44\'%3E%3C/svg%3E'}" class="sav-engine-file-thumb" width="44" height="44">
            <div class="sav-engine-file-info">
              <div class="sav-engine-file-name">${this.escape(this.fileName || (isAr ? 'ملف مرفق' : 'Document joint'))}</div>
              <div class="sav-engine-file-size">${isAr ? 'جاهز للإرسال' : 'Prêt pour envoi'}</div>
            </div>
            <button type="button" class="sav-engine-btn-remove" data-fid="${field.id}">✕</button>
          </div>
          <div class="sav-engine-checkbox-row">
            <label for="noDoc_${field.id}">
              <input type="checkbox" id="noDoc_${field.id}" class="check-no-doc" ${this.formData.noDoc ? 'checked' : ''}>
              <span>${isAr ? 'لا تتوفر لدي الوثيقة حالياً (سأرسلها عبر واتساب)' : 'Je n\'ai pas le document sous la main (je l\'enverrai sur WhatsApp)'}</span>
            </label>
          </div>
        `;
      } else {
        // Standard TEXT (or mapped serial/name)
        const isSerial = field.mappingTarget === 'EQUIPMENT_SERIAL' || (field.helpMediaUrl && field.helpMediaUrl.includes('serial'));
        if (isSerial) {
          const noSerial = this.formData.noSerial === true;
          w += `
            <input type="text" id="${fid}" class="sav-engine-input" placeholder="Ex: PC202508300133" value="${this.escape(savedVal)}" autocapitalize="characters" ${noSerial ? 'disabled' : ''}>
            <div class="sav-engine-checkbox-row">
              <label for="noSerial_${field.id}">
                <input type="checkbox" id="noSerial_${field.id}" class="check-no-serial" data-target="${fid}" ${noSerial ? 'checked' : ''}>
                <span>${isAr ? 'لا أجد الرقم التسلسلي على جهازي' : 'Je ne trouve pas mon numéro de série'}</span>
              </label>
            </div>
          `;
        } else {
          w += `<input type="text" id="${fid}" class="sav-engine-input" value="${this.escape(savedVal)}">`;
        }
      }

      w += `<div class="sav-engine-error-text" id="err_${field.id}">⚠️ <span>${isAr ? 'هذا الحقل إجباري' : 'Ce champ est obligatoire'}</span></div>`;
      w += `</div>`;
      return w;
    }

    renderReview() {
      const isAr = this.lang === 'ar';
      let html = `<div class="sav-engine-review-card">`;
      html += `
        <div class="sav-engine-review-row">
          <span class="sav-engine-review-key">${isAr ? 'نوع التغطية' : 'Prestation'}</span>
          <span class="sav-engine-review-val">${this.activeTicketTypeId === 1 ? (isAr ? 'تحت الضمان' : 'Sous garantie constructeur') : (isAr ? 'خارج الضمان' : 'Hors garantie')}</span>
        </div>
      `;

      this.steps.forEach(s => {
        if (s.type === 'fields') {
          s.fields.forEach(f => {
            const raw = this.formData[f.id];
            let val = '—';
            if (f.fieldType === 'FILE' || f.fieldType === 'PHOTO_ONLY') {
              val = this.fileName ? `📷 ${this.fileName}` : (isAr ? 'لا يوجد ملف' : 'Aucun fichier');
            } else if (f.mappingTarget === 'EQUIPMENT_SERIAL' && this.formData.noSerial) {
              val = isAr ? 'غير محدد (تحقق عبر الفاتورة)' : 'Non trouvé (vérification par photo)';
            } else if (raw) {
              val = String(raw);
            }
            html += `
              <div class="sav-engine-review-row">
                <span class="sav-engine-review-key">${this.parseLabel(f.name)}</span>
                <span class="sav-engine-review-val">${this.escape(val)}</span>
              </div>
            `;
          });
        }
      });

      html += `</div>`;
      html += `
        <div class="sav-engine-checkbox-row" style="margin-bottom:18px;">
          <label for="savEngineConsent">
            <input type="checkbox" id="savEngineConsent" ${this.formData.consent ? 'checked' : ''}>
            <span>${isAr ? 'أوافق على معالجة البيانات لإتمام طلب الصيانة' : 'J\'accepte que mes données soient traitées dans le cadre de ma demande SAV.'}</span>
          </label>
        </div>
      `;
      return html;
    }

    saveStepInputs() {
      const cur = this.steps[this.currentStepIndex];
      if (!cur) return;
      if (cur.type === 'fields') {
        cur.fields.forEach(f => {
          const el = this.root.querySelector(`#sav_f_${f.id}`);
          if (el) this.formData[f.id] = el.value.trim();
        });
      } else if (cur.type === 'review') {
        const c = this.root.querySelector('#savEngineConsent');
        if (c) this.formData.consent = c.checked;
      }
    }

    validateStep() {
      const isAr = this.lang === 'ar';
      const cur = this.steps[this.currentStepIndex];
      if (!cur || cur.type !== 'fields') return true;

      let valid = true;
      cur.fields.forEach(f => {
        const el = this.root.querySelector(`#sav_f_${f.id}`);
        const errEl = this.root.querySelector(`#err_${f.id}`);
        const val = el ? el.value.trim() : '';

        let err = false;
        let msg = isAr ? 'هذا الحقل إجباري' : 'Ce champ est obligatoire';

        if (f.required) {
          if (f.mappingTarget === 'EQUIPMENT_SERIAL' && this.formData.noSerial) {
            // ok
          } else if (f.fieldType === 'FILE' || f.fieldType === 'PHOTO_ONLY') {
            if (!this.fileBlob && !this.formData.noDoc) {
              err = true;
              msg = isAr ? 'يرجى إرفاق الوثيقة أو تحديد خيار المتابعة عبر واتساب' : 'Veuillez joindre le document ou cocher l\'option WhatsApp';
            }
          } else if (!val) {
            err = true;
          }
        }

        if (!err && val && f.fieldType === 'PHONE') {
          const clean = val.replace(/[\s.-]/g, '');
          if (!clean.match(/^(?:0[567][0-9]{8}|\+212[567][0-9]{8})$/)) {
            err = true;
            msg = isAr ? 'رقم هاتف غير صحيح (مثال: 0612345678)' : 'Numéro invalide (ex: 0612345678)';
          }
        }

        if (err) {
          valid = false;
          if (el) el.classList.add('has-error');
          if (errEl) {
            errEl.querySelector('span').textContent = msg;
            errEl.classList.add('visible');
          }
        } else {
          if (el) el.classList.remove('has-error');
          if (errEl) errEl.classList.remove('visible');
        }
      });

      return valid;
    }

    bindEvents() {
      // Type switch
      this.root.querySelectorAll('.sav-engine-type-btn').forEach(btn => {
        btn.onclick = () => this.setTicketType(parseInt(btn.getAttribute('data-tt'), 10));
      });

      // Lang switch
      this.root.querySelectorAll('.sav-engine-lang-btn').forEach(btn => {
        btn.onclick = () => this.setLanguage(btn.getAttribute('data-l'));
      });

      // Chips
      this.root.querySelectorAll('.sav-engine-chip').forEach(chip => {
        chip.onclick = () => {
          const fid = chip.getAttribute('data-fid');
          const val = chip.getAttribute('data-v');
          const grid = chip.closest('.sav-engine-chips-grid');
          grid.querySelectorAll('.sav-engine-chip').forEach(c => {
            c.classList.remove('selected');
            c.querySelector('.sav-engine-chip-radio').textContent = '';
          });
          chip.classList.add('selected');
          chip.querySelector('.sav-engine-chip-radio').textContent = '✓';
          const input = this.root.querySelector(`#sav_f_${fid}`);
          if (input) input.value = val;
          this.formData[fid] = val;
        };
      });

      // Serial checkbox
      this.root.querySelectorAll('.check-no-serial').forEach(chk => {
        chk.onchange = () => {
          this.formData.noSerial = chk.checked;
          const target = this.root.querySelector(`#${chk.getAttribute('data-target')}`);
          if (target) {
            target.disabled = chk.checked;
            if (chk.checked) target.value = '';
          }
        };
      });

      // No doc checkbox
      this.root.querySelectorAll('.check-no-doc').forEach(chk => {
        chk.onchange = () => {
          this.formData.noDoc = chk.checked;
        };
      });

      // File upload dropzones
      this.root.querySelectorAll('.sav-engine-dropzone').forEach(dz => {
        const fid = dz.id.replace('dz_', '');
        const fileInput = this.root.querySelector(`#fi_${fid}`);
        if (!fileInput) return;

        dz.onclick = () => fileInput.click();
        dz.ondragover = (e) => { e.preventDefault(); dz.classList.add('dragover'); };
        dz.ondragleave = () => dz.classList.remove('dragover');
        dz.ondrop = (e) => {
          e.preventDefault();
          dz.classList.remove('dragover');
          if (e.dataTransfer.files.length) this.handleFile(e.dataTransfer.files[0], fid);
        };
        fileInput.onchange = () => {
          if (fileInput.files.length) this.handleFile(fileInput.files[0], fid);
        };
      });

      // Remove file
      this.root.querySelectorAll('.sav-engine-btn-remove').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const fid = btn.getAttribute('data-fid');
          this.fileBlob = null;
          this.fileName = '';
          const preview = this.root.querySelector(`#fp_${fid}`);
          if (preview) preview.classList.remove('visible');
          const fi = this.root.querySelector(`#fi_${fid}`);
          if (fi) fi.value = '';
        };
      });

      // Nav: Next
      const nextBtn = this.root.querySelector('#savNextBtn');
      if (nextBtn) {
        nextBtn.onclick = () => {
          if (this.validateStep()) {
            this.saveStepInputs();
            this.currentStepIndex++;
            this.render();
          }
        };
      }

      // Nav: Prev
      const prevBtn = this.root.querySelector('#savPrevBtn');
      if (prevBtn) {
        prevBtn.onclick = () => {
          this.saveStepInputs();
          if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.render();
          }
        };
      }

      // Submit
      const submitBtn = this.root.querySelector('#savSubmitBtn');
      if (submitBtn) {
        submitBtn.onclick = () => this.submit();
      }
    }

    handleFile(file, fid) {
      if (file.size > 10 * 1024 * 1024) {
        alert(this.lang === 'ar' ? 'الملف كبير جداً (أقصى حجم 10 ميغابايت)' : 'Le fichier est trop volumineux (max 10 Mo)');
        return;
      }
      this.fileName = file.name;
      this.fileRaw = file;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;
            const max = 1600;
            if (width > max || height > max) {
              if (width > height) { height = Math.round((height * max) / width); width = max; }
              else { width = Math.round((width * max) / height); height = max; }
            }
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            this.fileBlob = canvas.toDataURL('image/jpeg', 0.82);
            this.updateFilePreview(fid);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.fileBlob = 'pdf_data';
        this.updateFilePreview(fid);
      }
    }

    updateFilePreview(fid) {
      const preview = this.root.querySelector(`#fp_${fid}`);
      if (!preview) return;
      const img = preview.querySelector('.sav-engine-file-thumb');
      const name = preview.querySelector('.sav-engine-file-name');
      if (img && this.fileBlob && this.fileBlob.startsWith('data:')) img.src = this.fileBlob;
      if (name) name.textContent = this.fileName;
      preview.classList.add('visible');
    }

    async submit() {
      const isAr = this.lang === 'ar';
      const submitBtn = this.root.querySelector('#savSubmitBtn');
      const consent = this.root.querySelector('#savEngineConsent');

      if (consent && !consent.checked) {
        alert(isAr ? 'يرجى تأكيد الموافقة للمتابعة' : 'Veuillez accepter les conditions pour continuer.');
        consent.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = isAr ? 'جاري الإرسال...' : 'Envoi en cours...';

      try {
        const formData = new FormData();
        const ticketType = (this.schema.ticketTypes || []).find(t => t.id === this.activeTicketTypeId) || this.schema.ticketTypes[0];
        const fields = ticketType.fields || [];

        let fullName = '';
        let phone = '';
        let serial = '';
        let address = '';

        fields.forEach(f => {
          const val = this.formData[f.id] || '';
          if (f.mappingTarget === 'CONTACT_NAME') fullName = val;
          if (f.mappingTarget === 'CONTACT_PHONE') phone = val;
          if (f.mappingTarget === 'EQUIPMENT_SERIAL') serial = val;
          if (f.mappingTarget === 'ADDRESS') address = val;
        });

        if (this.formData.noSerial || !serial) serial = 'SANS-NUMERO';
        if (address.length < 10) address = `${address}, Casablanca, Maroc`;

        formData.append('fullName', fullName || 'Client Nerobel');
        formData.append('phone', phone || '0600000000');
        formData.append('serialNumber', serial);
        formData.append('address', address);
        formData.append('serviceId', String(SERVICE_ID));
        formData.append('ticketTypeId', String(this.activeTicketTypeId));
        formData.append('websiteKey', 'nerobel.com');

        const custom = {};
        fields.forEach(f => {
          if (this.formData[f.id]) custom[String(f.id)] = this.formData[f.id];
        });
        if (this.activeTicketTypeId === 1 && !custom["84"]) {
          custom["84"] = new Date().toISOString().split('T')[0];
        }
        formData.append('customFieldsJson', JSON.stringify(custom));

        if (this.fileRaw) {
          formData.append('contractFile', this.fileRaw, this.fileName);
        } else if (this.fileBlob && this.fileBlob.startsWith('data:')) {
          const blob = await fetch(this.fileBlob).then(r => r.blob());
          formData.append('contractFile', blob, this.fileName || 'photo_sav.jpg');
        } else if (this.activeTicketTypeId === 1) {
          const dummy = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
          const nums = new Array(dummy.length);
          for (let i = 0; i < dummy.length; i++) nums[i] = dummy.charCodeAt(i);
          formData.append('contractFile', new Blob([new Uint8Array(nums)], { type: 'image/png' }), 'sans_photo.png');
        }

        let resp;
        try {
          resp = await fetch(PRIMARY_API, { method: 'POST', body: formData });
          if (!resp.ok && resp.status === 404) {
            resp = await fetch(REMOTE_API, { method: 'POST', body: formData });
          }
        } catch (e) {
          resp = await fetch(REMOTE_API, { method: 'POST', body: formData });
        }

        const resData = await resp.json().catch(() => ({}));
        if (!resp.ok || (!resData.publicCode && !resData.ticketNumber && !resData.ticketId)) {
          throw new Error(resData.detail || resData.message || 'Erreur lors de la soumission');
        }

        const publicCode = resData.publicCode || resData.ticketNumber || `SAV-${resData.ticketId}`;
        this.renderSuccess(publicCode);

      } catch (err) {
        alert(isAr ? `تعذر الإرسال: ${err.message}` : `Échec de l'envoi : ${err.message}`);
        submitBtn.disabled = false;
        submitBtn.textContent = isAr ? 'إرسال طلب الصيانة' : 'Transmettre ma Demande SAV';
      }
    }

    renderSuccess(code) {
      const isAr = this.lang === 'ar';
      const waText = encodeURIComponent(isAr 
        ? `مرحباً Nerobel، قمت بتسجيل طلب صيانة برقم الملف: ${code}. يرجى إفادتي بموعد تدخل التقني.`
        : `Bonjour Nerobel, j'ai enregistré ma demande SAV sous le N° ${code}. Merci de m'indiquer la prise en charge.`
      );

      this.root.innerHTML = `
        <div class="sav-engine-success-box">
          <div class="sav-engine-success-icon">✓</div>
          <h2 class="sav-engine-title" style="font-size:1.7rem;">${isAr ? 'تم استلام طلبكم بنجاح' : 'Demande SAV enregistrée avec succès !'}</h2>
          <p class="sav-engine-subtitle">${isAr ? 'رقم التتبع الخاص بملفكم :' : 'Votre numéro de dossier officiel :'}</p>

          <div class="sav-engine-code-badge">
            <span id="savPublicCode">${code}</span>
            <button type="button" class="sav-engine-copy-btn" id="savCopyBtn">${isAr ? 'نسخ' : 'Copier'}</button>
          </div>

          <div class="sav-engine-actions-row">
            <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${waText}" target="_blank" rel="noopener" class="sav-engine-btn sav-engine-btn-wa">
              💬 <span>${isAr ? 'متابعة عبر واتساب' : 'Suivre sur WhatsApp'}</span>
            </a>
            <a href="${REMOTE_API}/${encodeURIComponent(code)}/receipt" target="_blank" rel="noopener" class="sav-engine-btn sav-engine-btn-pdf">
              📄 <span>${isAr ? 'تحميل وصل الاستلام (PDF)' : 'Télécharger le Reçu PDF'}</span>
            </a>
            <button type="button" class="sav-engine-btn sav-engine-btn-secondary" id="savNewBtn">
              🔄 <span>${isAr ? 'طلب جديد' : 'Nouvelle demande'}</span>
            </button>
          </div>
        </div>
      `;

      const copyBtn = this.root.querySelector('#savCopyBtn');
      if (copyBtn) {
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(code).then(() => {
            copyBtn.textContent = isAr ? 'تم النسخ !' : 'Copié !';
            setTimeout(() => { copyBtn.textContent = isAr ? 'نسخ' : 'Copier'; }, 2000);
          }).catch(() => {});
        };
      }

      const newBtn = this.root.querySelector('#savNewBtn');
      if (newBtn) {
        newBtn.onclick = () => {
          this.formData = {};
          this.fileBlob = null;
          this.fileName = '';
          this.currentStepIndex = 0;
          this.buildSteps();
          this.render();
        };
      }
    }

    escape(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
  }

  // Auto-mount function
  function autoMount() {
    const targets = [
      document.getElementById('nerobel-sav-app'),
      document.getElementById('nerobel-sav-root')
    ];
    targets.forEach(t => {
      if (t && !t.__nerobelSavMounted) {
        t.__nerobelSavMounted = true;
        const engine = new AutonomousSavEngine(t);
        engine.boot();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMount);
  } else {
    autoMount();
  }

  // Export globally
  window.NerobelSavEngine = AutonomousSavEngine;

})();

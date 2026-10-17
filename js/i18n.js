/* ─────────────────────────────────────────────────────────────
   NEROBEL GROUP · INTERNATIONALIZATION (i18n.js) - v2.0
   Full Trilingual Parity: French (FR), Arabic (AR RTL), English (EN)
   Including Official Brands: Theros, Pacific, Eurogas, & Consumer Tech
   ───────────────────────────────────────────────────────────── */

const I18N = {
  fr: {
    // Navigation
    navHome: "Groupe",
    navBrands: "Marques",
    navSav: "Support SAV",
    navNetwork: "Showrooms",
    navB2b: "Professionnels",
    navContact: "Contact",
    ctaSav: "Demande SAV",

    // Hero
    eyebrowGroup: "Consumer Tech for Modern Homes",
    heroTitlePart1: "L'Excellence du Confort & de la ",
    heroTitleHighlight: "Maison Moderne",
    heroLead: "Groupe industriel et technologique d'avant-garde. Nerobel conçoit et distribue l'électroménager moderne, les Smart TV et les solutions thermiques leaders au Maroc : Theros, Pacific et Eurogas.",
    heroCtaBrands: "Explorer nos Marques",
    heroCtaSav: "Accéder au Portail SAV",
    statYears: "25+",
    statYearsLabel: "Ans d'Ingénierie & Innovation",
    statDistributors: "150+",
    statDistributorsLabel: "Distributeurs & Showrooms au Maroc",
    statWarranty: "100%",
    statWarrantyLabel: "Garantie Constructeur Certifiée",
    statSavSpeed: "24/48h",
    statSavSpeedLabel: "Délai Moyen d'Intervention SAV",

    // Dual-Track Selector
    tabParticuliers: "Particuliers & Résidentiel",
    tabProfessionnels: "Installateurs & Professionnels",

    // Brands Section
    brandsSectionEyebrow: "Portefeuille de Marques d'Élite",
    brandsSectionTitle: "Des Marques Leaders Dédiées à Votre Confort",
    brandsSectionDesc: "Chaque marque du groupe Nerobel répond aux normes de sécurité internationales les plus strictes pour offrir durabilité, confort et économies d'énergie.",

    // Theros
    therosBadge: "Votre Confort, Connecté",
    therosTitle: "THEROS · Smart Thermal Engineering",
    therosLead: "Pionnier du confort thermique au Maroc. Chauffe-eau Pro-Slim 50L/80L/100L connecté par smartphone, double réservoir et 3 puissances (500W / 1300W / 2000W).",
    therosF1: "Contrôlez votre chauffe-eau où que vous soyez via application mobile",
    therosF2: "Format Pro-Slim extra-plat (L: 46cm, H: 85cm, P: 25cm)",
    therosF3: "Double réservoir titane & interface digitale 75°C",
    therosLink: "Visiter theros.ma",

    // Pacific
    pacificBadge: "Eau Chaude Fiable & Flexible",
    pacificTitle: "PACIFIC · Chauffe-Eau Haute Fiabilité",
    pacificLead: "La solution de confiance pour l'eau chaude sanitaire au Maroc. Double réservoir en acier vitrifié, écran digital 75°C et montage flexible horizontal ou vertical.",
    pacificF1: "Montage universel : installation horizontale ou verticale au choix",
    pacificF2: "Double réservoir avec isolation thermique haute densité",
    pacificF3: "Interface digitale avec molette de réglage et normes européennes CE",
    pacificLink: "Détails Gamme Pacific",

    // Eurogas
    eurogasBadge: "Systèmes Gaz & Chaudières",
    eurogasTitle: "EUROGAS™ · Performance, Sécurité & Gaz",
    eurogasLead: "Référence incontournable des chauffe-eaux à gaz et chaudières murales. Conception certifiée CE avec capteurs de sécurité ODS et allumage automatique basse pression.",
    eurogasF1: "Chauffe-eaux instantanés à gaz avec triple sécurité ODS",
    eurogasF2: "Chaudières murales à condensation haute performance",
    eurogasF3: "Détendeurs, raccords et sécurité aux normes européennes",
    eurogasLink: "Visiter eurogas.ma",

    // Tracker Bar
    trackerTitle: "Suivi en Direct de votre Dossier SAV",
    trackerDesc: "Entrez votre numéro de ticket (ex: NERO-2026-8921) pour connaître l'avancement de votre intervention.",
    trackerPlaceholder: "Code ticket (ex: NERO-2026-8921)",
    trackerBtn: "Vérifier l'État",

    // SAV Page
    savEyebrow: "Service Après-Vente Officiel Nerobel",
    savHeroTitle: "Un problème avec <em>votre appareil</em> ?",
    savHeroLead: "Remplissez ce formulaire direct en 3 étapes. Notre équipe technique prend en charge votre demande sous 24 à 48 heures ouvrables.",
    savPerk1: "Intervention rapide sous 24 à 48h ouvrables",
    savPerk2: "Pièces d'origine pour Theros, Pacific et Eurogas",
    savPerk3: "Suivi personnalisé en direct via WhatsApp (+212 787 013 201)",
    savWarrantyNotice: "Garantie officielle Nerobel · Theros · Pacific · Eurogas",

    // SAV Stepper
    stepOf: "Étape {current} sur {total}",
    step1Name: "Type d'Appareil",
    step2Name: "Informations & Panne",
    step3Name: "Récapitulatif & Validation",

    step1Title: "Sélectionnez votre type d'appareil",
    step1Subtitle: "Choisissez la catégorie correspondant à votre équipement",

    typeElectric: "Chauffe-eau Électrique",
    typeElectricDesc: "Theros Pro-Slim, Pacific double réservoir, ou standard",
    typeGas: "Chauffe-eau à Gaz",
    typeGasDesc: "Eurogas instantané 6L, 10L ou chaudière gaz",
    typeSolar: "Solaire & Thermodynamique",
    typeSolarDesc: "Systèmes solaires thermiques sous pression",
    typeAppliances: "Électroménager & Télévision",
    typeAppliancesDesc: "Réfrigérateurs, Smart TV, lave-linge, climatiseurs",

    step2Title: "Détails de la Réclamation",
    step2Subtitle: "Renseignez les coordonnées et le descriptif de votre panne",

    sectionContact: "Coordonnées du Client",
    lblFullName: "Nom et Prénom",
    lblPhone: "Numéro de Téléphone (WhatsApp)",
    lblCity: "Ville / Région",
    lblAddress: "Adresse d'intervention",
    btnGps: "Capturer ma Position GPS",
    gpsCaptured: "Position GPS confirmée",

    sectionEquipment: "Équipement & Panne",
    lblBrand: "Marque de l'appareil",
    lblSerial: "Numéro de Série de l'Appareil",
    btnSerialGuide: "Où trouver le numéro ?",
    lblProblem: "Type de Panne Constatée",
    lblDescription: "Description détaillée du problème",
    lblPhotos: "Photos de l'appareil ou facture",
    dropzoneText: "Glissez vos photos ici ou <strong>cliquez pour parcourir</strong>",
    dropzoneHint: "JPG, PNG ou PDF (max 10 Mo) · Photo nette de la plaque signalétique",
    btnWebcam: "Prendre une photo",

    step3Title: "Confirmation de votre Demande",
    step3Subtitle: "Vérifiez les données avant envoi à nos équipes techniques",
    btnBack: "Retour",
    btnContinue: "Continuer",
    btnSubmit: "Transmettre ma Demande SAV",

    // Review Labels
    revType: "Catégorie",
    revName: "Client",
    revPhone: "Téléphone",
    revCity: "Ville",
    revAddress: "Adresse",
    revSerial: "Numéro de Série",
    revIssue: "Panne",

    // Success Screen
    successTitle: "Demande SAV Enregistrée avec Succès !",
    successDesc: "Votre dossier a été transmis à notre service technique. Voici votre numéro de référence :",
    btnCopy: "Copier",
    btnCopied: "Copié !",
    btnWhatsApp: "Suivre sur WhatsApp",
    btnDownloadPdf: "Télécharger le Reçu (PDF)",
    btnNewRequest: "Nouvelle Réclamation",

    // Serial Guide Modal
    guideModalTitle: "Emplacement de la Plaque Signalétique",
    guideModalSubtitle: "Guide pour trouver votre numéro de série (ex: PC202604150892)",
    guideModalTip: "La plaque métallique est généralement collée sous le chauffe-eau ou sur le panneau latéral.",
    btnModalUnderstood: "J'ai compris",

    // Validation Errors
    errRequired: "Ce champ est obligatoire",
    errPhone: "Veuillez entrer un numéro marocain valide (ex: 0612345678 ou 0522123456)",
    errSerial: "Format de numéro de série invalide (minimum 8 caractères)",

    // Signature Collections (GROHE Style)
    collectionEyebrow: "Design & Ingénierie de Précision",
    collectionTitle: "Les Collections Signatures de l'Habitat Moderne",
    collectionLead: "Découvrez la fusion de l'ingénierie thermique d'avant-garde et de matériaux rigoureusement sélectionnés. Des solutions connectées Theros à l'électroménager noir mat Nerobel.",
    collectionCardAction: "Découvrir la collection",
    aboutGroupEyebrow: "Héritage & Savoir-Faire Industriel",
    aboutGroupTitle: "Plus de 25 Ans au Cœur de l'Innovation Domestique",
    aboutGroupDesc: "Nerobel Group s'est imposé comme le partenaire technologique incontournable des foyers marocains et des professionnels du bâtiment, alliant fiabilité rigoureuse, sécurité certifiée et élégance contemporaine.",

    // Footer
    footerDesc: "Nerobel Group est le leader marocain en électroménager moderne, Smart TV et solutions de confort thermique : Theros, Pacific et Eurogas.",
    footerColBrands: "Nos Marques",
    footerColServices: "Services & Support",
    footerColGroup: "Le Groupe",
    footerRights: "© 2026 Nerobel Group. Tous droits réservés. Theros, Pacific et Eurogas sont distribués par Nerobel."
  },

  ar: {
    // Navigation
    navHome: "المجموعة",
    navBrands: "العلامات",
    navSav: "الدعم التقني",
    navNetwork: "نقاط البيع",
    navB2b: "المهنيين",
    navContact: "اتصل بنا",
    ctaSav: "طلب SAV",

    // Hero
    eyebrowGroup: "تكنولوجيا الأجهزة للمنازل العصرية",
    heroTitlePart1: "قمة الراحة و ",
    heroTitleHighlight: "المنازل العصرية",
    heroLead: "مجموعة صناعية وتكنولوجية رائدة. تصمم نيروبل وتوزع التجهيزات المنزلية العصرية والشاشات الذكية وحلول التدفئة الرائدة بالمغرب: تيروس، باسيفيك وأوروغاز.",
    heroCtaBrands: "اكتشف علاماتنا التجارية",
    heroCtaSav: "الدخول لبوابة الدعم SAV",
    statYears: "25+",
    statYearsLabel: "سنة من الخبرة والابتكار",
    statDistributors: "150+",
    statDistributorsLabel: "موزع وقاعة عرض بالمغرب",
    statWarranty: "100%",
    statWarrantyLabel: "ضمان رسمي معتمد من المصنع",
    statSavSpeed: "24/48س",
    statSavSpeedLabel: "أجل التدخل التقني المعتاد",

    // Dual-Track Selector
    tabParticuliers: "للخواص والمنازل",
    tabProfessionnels: "للمهنيين والموزعين",

    // Brands Section
    brandsSectionEyebrow: "محفظة العلامات الرائدة",
    brandsSectionTitle: "علامات رائدة مكرسة لراحتكم اليومية",
    brandsSectionDesc: "تخضع جميع منتجات مجموعة نيروبل لأدق معايير الجودة والسلامة الدولية لضمان طول العمر واقتصاد الطاقة.",

    // Theros
    therosBadge: "راحتكم، متصلة وذكية",
    therosTitle: "THEROS · الهندسة الحرارية الذكية",
    therosLead: "العلامة الأولى للراحة الحرارية بالمغرب. سخان Pro-Slim المتصل عبر الهاتف الذكي، حوض مزدوج و3 مستويات قوة (500W / 1300W / 2000W).",
    therosF1: "تحكم في سخانك أينما كنت عبر تطبيق الهاتف الذكي",
    therosF2: "تصميم Pro-Slim مسطح ومدمج (طول: 46 سم، ارتفاع: 85 سم، عمق: 25 سم)",
    therosF3: "خزان مزدوج من التيتانيوم وشاشة رقمية 75°C",
    therosLink: "زيارة موقع theros.ma",

    // Pacific
    pacificBadge: "حل موثوق للماء الساخن",
    pacificTitle: "PACIFIC · سخان ماء عالي الموثوقية",
    pacificLead: "سخان ماء Pacific: الحل الموثوق للماء الساخن في البيوت المغربية. حوض مزدوج، شاشة رقمية دقيقة وتركيب مرن أفقي أو عمودي.",
    pacificF1: "تركيب مرن : إمكانية التثبيت أفقياً أو عمودياً حسب مساحة الحمام",
    pacificF2: "حوض مزدوج مع عزل حراري عالي الكثافة واقتصاد في الطاقة",
    pacificF3: "شاشة رقمية لضبط الحرارة بدقة مع مطابقة المعايير الأوروبية CE",
    pacificLink: "تفاصيل مجموعة Pacific",

    // Eurogas
    eurogasBadge: "أنظمة التدفئة والسلامة بالغاز",
    eurogasTitle: "EUROGAS™ · القوة، الأمان والخبرة",
    eurogasLead: "المرجع المعتمد لسخانات الغاز والمراجل الحائطية بالمغرب. مطابقة تامة للمعايير الأوروبية CE مع مستشعرات الأمان ODS وتشغيل تلقائي عند الضغط المنخفض.",
    eurogasF1: "سخانات ماء فورية بالغاز بنظام أمان ثلاثي ODS",
    eurogasF2: "مراجل حائطية عالية المردودية بتقنية التكثيف",
    eurogasF3: "ملحقات وصمامات أمان مطابقة للمواصفات القياسية",
    eurogasLink: "زيارة موقع eurogas.ma",

    // Tracker Bar
    trackerTitle: "تتبع طلب خدمة ما بعد البيع مباشرة",
    trackerDesc: "أدخل رقم التذكرة (مثال: NERO-2026-8921) للاطلاع على المرحلة الحالية لطلبك.",
    trackerPlaceholder: "رقم التذكرة (مثال: NERO-2026-8921)",
    trackerBtn: "تتبع الطلب",

    // SAV Page
    savEyebrow: "الخدمة الرسمية لما بعد البيع · مجموعة نيروبل",
    savHeroTitle: "هل تواجه مشكلة مع <em>جهازك</em>؟",
    savHeroLead: "يرجى ملء الاستمارة في 3 خطوات بسيطة. يتكفل فريقنا التقني بطلبك خلال 24 إلى 48 ساعة عمل.",
    savPerk1: "تدخل تقني سريع خلال 24 إلى 48 ساعة عمل",
    savPerk2: "قطع غيار أصلية لتيروس، باسيفيك وأوروغاز",
    savPerk3: "متابعة سهلة ومباشرة عبر واتساب (+212 787 013 201)",
    savWarrantyNotice: "الضمان الرسمي المعتمد من نيروبل · تيروس · باسيفيك · أوروغاز",

    // SAV Stepper
    stepOf: "الخطوة {current} من {total}",
    step1Name: "نوع الجهاز",
    step2Name: "المعلومات والعطل",
    step3Name: "التأكيد والإرسال",

    step1Title: "اختر فئة جهازك",
    step1Subtitle: "حدد الصنف المناسب لجهازك للمتابعة",

    typeElectric: "سخان ماء كهربائي",
    typeElectricDesc: "تيروس Pro-Slim، باسيفيك بحوض مزدوج أو قياسي",
    typeGas: "سخان ماء بالغاز",
    typeGasDesc: "أوروغاز فوري 6 لتر، 10 لتر أو مرجل غاز",
    typeSolar: "سخان شمسي وديناميكي حراري",
    typeSolarDesc: "أنظمة الطاقة الشمسية المضغوطة للمنازل",
    typeAppliances: "أجهزة كهرومنزلية وتلفاز",
    typeAppliancesDesc: "ثلاجات ذكية، غسالات، مكيفات وشاشات Smart TV",

    step2Title: "تفاصيل الطلب والعطل",
    step2Subtitle: "يرجى ملء معلومات الاتصال وتوصيف المشكلة",

    sectionContact: "معلومات الاتصال بالزبون",
    lblFullName: "الاسم الكامل",
    lblPhone: "رقم الهاتف (واتساب)",
    lblCity: "المدينة / الإقليم",
    lblAddress: "عنوان السكن للتدخل",
    btnGps: "تحديد موقعي عبر GPS",
    gpsCaptured: "تم تأكيد الإحداثيات بنجاح",

    sectionEquipment: "معلومات الجهاز والعطل",
    lblBrand: "العلامة التجارية",
    lblSerial: "الرقم التسلسلي للجهاز",
    btnSerialGuide: "أين أجد الرقم؟",
    lblProblem: "طبيعة العطل الملاحظ",
    lblDescription: "وصف مفصل للمشكلة",
    lblPhotos: "صور الجهاز أو فاتورة الشراء",
    dropzoneText: "اسحب الصور هنا أو <strong>اضغط للاختيار</strong>",
    dropzoneHint: "JPG أو PNG أو PDF (أقصى حد 10 م.ب) · صورة واضحة للوحة البيانات",
    btnWebcam: "التقاط صورة بالكاميرا",

    step3Title: "مراجعة وتأكيد الطلب",
    step3Subtitle: "تحقق من صحة المعطيات قبل الإرسال النهائي",
    btnBack: "رجوع",
    btnContinue: "متابعة",
    btnSubmit: "إرسال طلب الصيانة الآن",

    // Review Labels
    revType: "نوع الجهاز",
    revName: "اسم الزبون",
    revPhone: "رقم الهاتف",
    revCity: "المدينة",
    revAddress: "العنوان",
    revSerial: "الرقم التسلسلي",
    revIssue: "طبيعة العطل",

    // Success Screen
    successTitle: "تم تسجيل طلبك بنجاح تام !",
    successDesc: "تم إرسال ملفك إلى القسم التقني المختص. هذا هو رقم المتابعة الخاص بك :",
    btnCopy: "نسخ",
    btnCopied: "تم النسخ !",
    btnWhatsApp: "متابعة عبر واتساب",
    btnDownloadPdf: "تحميل وصل الطلب (PDF)",
    btnNewRequest: "طلب صيانة جديد",

    // Serial Guide Modal
    guideModalTitle: "موقع اللوحة المعدنية للبيانات",
    guideModalSubtitle: "إرشادات للعثور على الرقم التسلسلي (مثال: PC202604150892)",
    guideModalTip: "توجد اللوحة المعدنية غالباً في الجزء السفلي أو الجانبي من السخان.",
    btnModalUnderstood: "حسناً، فهمت",

    // Validation Errors
    errRequired: "هذا الحقل إجباري",
    errPhone: "يرجى إدخال رقم هاتف مغربي صحيح (مثال: 0612345678 أو 0522123456)",
    errSerial: "صيغة الرقم التسلسلي غير صحيحة (8 أحرف على الأقل)",

    // Signature Collections (GROHE Style)
    collectionEyebrow: "تصميم وهندسة دقيقة",
    collectionTitle: "المجموعات المميزة للمنازل العصرية",
    collectionLead: "اكتشف انسجام الهندسة الحرارية المتقدمة مع خامات مختارة بعناية. من حلول تيروس الذكية إلى أجهزة نيروبل العصرية.",
    collectionCardAction: "اكتشف المجموعة",
    aboutGroupEyebrow: "عراقة وخبرة صناعية",
    aboutGroupTitle: "أكثر من 25 عاماً في قلب الابتكار المنزلي",
    aboutGroupDesc: "رسخت مجموعة نيروبل مكانتها كشريك تكنولوجي أساسي للعائلات المغربية ولمهنيي البناء، جامعة بين الموثوقية الصارمة، السلامة المعتمدة، والأناقة العصرية.",

    // Footer
    footerDesc: "مجموعة نيروبل هي الرائد المغربي في الأجهزة المنزلية العصرية، الشاشات الذكية وحلول الراحة الحرارية: تيروس، باسيفيك وأوروغاز.",
    footerColBrands: "علاماتنا التجارية",
    footerColServices: "الخدمات والدعم",
    footerColGroup: "عن المجموعة",
    footerRights: "© 2026 مجموعة نيروبل. جميع الحقوق محفوظة. تيروس، باسيفيك وأوروغاز متوفرة لدى نيروبل."
  },

  en: {
    // Navigation
    navHome: "Group",
    navBrands: "Brands",
    navSav: "SAV Support",
    navNetwork: "Showrooms",
    navB2b: "Professionals",
    navContact: "Contact",
    ctaSav: "SAV Request",

    // Hero
    eyebrowGroup: "Consumer Tech for Modern Homes",
    heroTitlePart1: "Mastering Thermal Comfort & the ",
    heroTitleHighlight: "Modern Home",
    heroLead: "The industrial and technology reference in Morocco. Nerobel designs, manufactures, and distributes modern appliances, Smart TVs, and premier heating solutions: Theros, Pacific, and Eurogas.",
    heroCtaBrands: "Explore Our Brands",
    heroCtaSav: "Access SAV Support Portal",
    statYears: "25+",
    statYearsLabel: "Years of Engineering Excellence",
    statDistributors: "150+",
    statDistributorsLabel: "Distributors & Showrooms in Morocco",
    statWarranty: "100%",
    statWarrantyLabel: "Certified Manufacturer Warranty",
    statSavSpeed: "24/48h",
    statSavSpeedLabel: "Average SAV Intervention Window",

    // Dual-Track Selector
    tabParticuliers: "Residential & Homeowners",
    tabProfessionnels: "Installers & Professionals",

    // Brands Section
    brandsSectionEyebrow: "Premier Brand Portfolio",
    brandsSectionTitle: "Industry-Leading Brands Built for Lasting Comfort",
    brandsSectionDesc: "Every brand in the Nerobel Group portfolio is certified to the highest international standards for maximum durability, comfort, and energy savings.",

    // Theros
    therosBadge: "Your Comfort, Connected",
    therosTitle: "THEROS · Smart Thermal Engineering",
    therosLead: "The thermal comfort pioneer in Morocco. Pro-Slim 50L/80L/100L smart water heaters with smartphone app control, double titanium tank, and 3 power modes (500W / 1300W / 2000W).",
    therosF1: "Control your water heater anywhere via dedicated smartphone app",
    therosF2: "Ultra-slim Pro-Slim format (W: 46cm, H: 85cm, D: 25cm)",
    therosF3: "Double titanium enameled tank with digital 75°C interface",
    therosLink: "Visit theros.ma",

    // Pacific
    pacificBadge: "Reliable Hot Water Solution",
    pacificTitle: "PACIFIC · High-Reliability Water Heating",
    pacificLead: "The trusted domestic hot water solution in Morocco. Dual-tank titanium architecture, 75°C digital display, and multi-position horizontal or vertical mounting.",
    pacificF1: "Flexible mounting: install horizontally or vertically to fit your space",
    pacificF2: "Double tank design with high-density polyurethane insulation",
    pacificF3: "Precise digital dial control certified to European CE standards",
    pacificLink: "Pacific Range Details",

    // Eurogas
    eurogasBadge: "Gas Systems & Boilers",
    eurogasTitle: "EUROGAS™ · Performance, Safety & Gas",
    eurogasLead: "The trusted authority in instantaneous gas water heaters and condensing wall boilers. Fully CE certified with ODS safety sensors and low-pressure ignition.",
    eurogasF1: "Instantaneous gas water heaters with triple-stage ODS safety",
    eurogasF2: "High-efficiency condensing wall-hung boilers",
    eurogasF3: "European standard regulators, fittings, and gas security kits",
    eurogasLink: "Visit eurogas.ma",

    // Tracker Bar
    trackerTitle: "Live SAV Ticket Status Tracker",
    trackerDesc: "Enter your ticket number (e.g. NERO-2026-8921) to check live status and technician dispatch.",
    trackerPlaceholder: "Ticket code (e.g. NERO-2026-8921)",
    trackerBtn: "Check Status",

    // SAV Page
    savEyebrow: "Official Nerobel After-Sales Service",
    savHeroTitle: "Need assistance with <em>your appliance</em>?",
    savHeroLead: "Complete our seamless 3-step form. Our certified technical team will review and process your request within 24 to 48 business hours.",
    savPerk1: "Swift response & intervention within 24–48 business hours",
    savPerk2: "Genuine spare parts for Theros, Pacific, and Eurogas",
    savPerk3: "Direct live ticket tracking updates via WhatsApp (+212 787 013 201)",
    savWarrantyNotice: "Certified official warranty · Nerobel · Theros · Pacific · Eurogas",

    // SAV Stepper
    stepOf: "Step {current} of {total}",
    step1Name: "Appliance Category",
    step2Name: "Details & Issue",
    step3Name: "Review & Submit",

    step1Title: "Select your appliance category",
    step1Subtitle: "Choose the service category that matches your equipment",

    typeElectric: "Electric Water Heater",
    typeElectricDesc: "Theros Pro-Slim, Pacific dual tank, or standard",
    typeGas: "Gas Water Heater",
    typeGasDesc: "Eurogas instant 6L, 10L or gas boiler",
    typeSolar: "Solar & Thermodynamic",
    typeSolarDesc: "High-pressure solar thermal & heat pump systems",
    typeAppliances: "Home Appliances & TV",
    typeAppliancesDesc: "Smart refrigerators, washers, AC splits, Smart TVs",

    step2Title: "Claim Details & Diagnostics",
    step2Subtitle: "Provide your contact information and describe the malfunction",

    sectionContact: "Customer Contact Information",
    lblFullName: "Full Name",
    lblPhone: "Phone Number (WhatsApp enabled)",
    lblCity: "City / Region",
    lblAddress: "Intervention Address",
    btnGps: "Capture GPS Location",
    gpsCaptured: "GPS Coordinates Confirmed",

    sectionEquipment: "Appliance & Malfunction",
    lblBrand: "Appliance Brand",
    lblSerial: "Appliance Serial Number",
    btnSerialGuide: "Where is my serial number?",
    lblProblem: "Observed Issue / Symptom",
    lblDescription: "Detailed description of the issue",
    lblPhotos: "Appliance photos or receipt",
    dropzoneText: "Drop your photos here or <strong>click to browse</strong>",
    dropzoneHint: "JPG, PNG or PDF (max 10MB) · Clear photo of metal rating plate",
    btnWebcam: "Use Camera",

    step3Title: "Review & Confirm Request",
    step3Subtitle: "Review your details before transmitting to our technical team",
    btnBack: "Back",
    btnContinue: "Continue",
    btnSubmit: "Submit SAV Request Now",

    // Review Labels
    revType: "Category",
    revName: "Customer",
    revPhone: "Phone",
    revCity: "City",
    revAddress: "Address",
    revSerial: "Serial Number",
    revIssue: "Symptom",

    // Success Screen
    successTitle: "SAV Request Registered Successfully!",
    successDesc: "Your request has been routed to our technical dispatch. Here is your tracking reference:",
    btnCopy: "Copy",
    btnCopied: "Copied!",
    btnWhatsApp: "Track on WhatsApp",
    btnDownloadPdf: "Download Receipt (PDF)",
    btnNewRequest: "New Request",

    // Serial Guide Modal
    guideModalTitle: "Serial Plate Location Guide",
    guideModalSubtitle: "How to locate your appliance serial number (e.g. PC202604150892)",
    guideModalTip: "The metal specification plate is situated at the bottom or on the side panel.",
    btnModalUnderstood: "Got it",

    // Validation Errors
    errRequired: "This field is required",
    errPhone: "Please enter a valid Moroccan phone number (e.g. 0612345678 or 0522123456)",
    errSerial: "Invalid serial number format (minimum 8 characters)",

    // Signature Collections (GROHE Style)
    collectionEyebrow: "Precision Design & Engineering",
    collectionTitle: "Signature Collections for the Modern Home",
    collectionLead: "Discover the fusion of cutting-edge thermal engineering and meticulously selected materials. From Theros smart water heating to Nerobel black titanium appliances.",
    collectionCardAction: "Discover Collection",
    aboutGroupEyebrow: "Heritage & Industrial Know-How",
    aboutGroupTitle: "Over 25 Years at the Heart of Home Innovation",
    aboutGroupDesc: "Nerobel Group has established itself as the trusted technology partner for Moroccan homes and construction professionals, blending uncompromising reliability, certified safety, and modern elegance.",

    // Footer
    footerDesc: "Nerobel Group is the Moroccan leader in modern home appliances, Smart TVs, and thermal comfort: Theros, Pacific, and Eurogas.",
    footerColBrands: "Our Brands",
    footerColServices: "Services & Support",
    footerColGroup: "The Group",
    footerRights: "© 2026 Nerobel Group. All rights reserved. Theros, Pacific, and Eurogas are distributed by Nerobel."
  }
};

// Global i18n Controller
class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('nerobel_lang') || 'fr';
    if (!['fr', 'ar', 'en'].includes(this.currentLang)) this.currentLang = 'fr';
  }

  init() {
    this.applyLanguage(this.currentLang);
    this.bindEvents();
  }

  applyLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('nerobel_lang', lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    // Update visible dropdown trigger label
    const labels = { fr: 'FR', ar: 'عربية', en: 'EN' };
    document.querySelectorAll('.lang-current-code').forEach(el => {
      el.textContent = labels[lang] || lang.toUpperCase();
    });

    document.querySelectorAll('.lang-menu-item, .lang-btn').forEach(btn => {
      const match = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-pressed', match);
    });

    const dict = I18N[lang] || I18N.fr;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = dict[key];
        } else {
          el.innerHTML = dict[key];
        }
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });

    window.dispatchEvent(new CustomEvent('nerobel:langchange', { detail: { lang } }));
  }

  t(key, params = {}) {
    const dict = I18N[this.currentLang] || I18N.fr;
    let text = dict[key] || I18N.fr[key] || key;
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, v);
    }
    return text;
  }

  bindEvents() {
    // Dropdown toggle
    document.querySelectorAll('.lang-dropdown-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = trigger.closest('.lang-dropdown');
        if (!dropdown) return;
        const isOpen = dropdown.classList.contains('open');

        // Close any other open dropdowns
        document.querySelectorAll('.lang-dropdown.open').forEach(d => {
          if (d !== dropdown) {
            d.classList.remove('open');
            d.querySelector('.lang-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
          }
        });

        dropdown.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      });
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lang-dropdown')) {
        document.querySelectorAll('.lang-dropdown.open').forEach(d => {
          d.classList.remove('open');
          d.querySelector('.lang-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.lang-dropdown.open').forEach(d => {
          d.classList.remove('open');
          d.querySelector('.lang-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Handle language selection
    document.querySelectorAll('.lang-menu-item, .lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = btn.getAttribute('data-lang');
        if (lang) {
          this.applyLanguage(lang);
          const dropdown = btn.closest('.lang-dropdown');
          if (dropdown) {
            dropdown.classList.remove('open');
            dropdown.querySelector('.lang-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });
  }
}

window.i18n = new I18nManager();
document.addEventListener('DOMContentLoaded', () => window.i18n.init());

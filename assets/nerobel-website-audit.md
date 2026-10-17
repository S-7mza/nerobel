# Nerobel Group Website — Audit & Improvement Plan

- **Site audited:** https://s-7mza.github.io/nerobel/
- **Audit date:** 2026-10-17
- **Roles:** Website auditor (content, SEO, UX, accessibility) + Web designer (visual system, images, mobile)
- **Status:** 🟢 v1 COMPLETE — all pages, design review, mobile diagnosis and roadmap written; updated whenever new evidence (screenshots, decisions) arrives

## 0. Live progress

| Section | Status |
|---|---|
| Method & limits | ✅ Done |
| Page 1 — Home (`index.html`) | ✅ Done |
| Page 2 — Brands (`brands.html`) | ✅ Done |
| Page 3 — SAV (`sav.html`) | ✅ Done |
| Page 4 — Showrooms (`network.html`) | ✅ Done |
| Page 5 — B2B (`b2b.html`) | ✅ Done |
| Page 6 — Contact (`contact.html`) | ✅ Done |
| Cross-site: message coherence | ✅ Done |
| Cross-site: images & alignment | ✅ Done (visual checks listed in 8.5) |
| Cross-site: SEO, accessibility, language, trust | ✅ Done |
| Design review | ✅ Done |
| Mobile diagnosis | ✅ Done (inferred from markup; device matrix in 6.2) |
| Improvement plan & roadmap | ✅ Done |
| Ideal-version spec & QA checklist | ✅ Done |

## Executive summary

**Overall:** the site has a solid structure and a strong service core (guided SAV flow, mobile action bar, locator concept, brand simulators). It is **not yet ready to be shared or indexed**: the message is worded several ways, a number of promises are not backed by working pages or real data, and legal basics are missing.

**Findings:** 62 page-level + 15 mobile = 77, of which **11 are P0**.

| Dimension | Score /10 (auditor estimate) | Main reason |
|---|---|---|
| Message coherence | 4 | Identity, SAV, warranty, speed, network size each stated 3–6 ways |
| Trust & legal | 3 | Dead legal links, no consent, no mentions légales, demo content that reads as real |
| Content completeness | 5 | Dead PDFs, unsupported promises, missing solar range and SAV centres |
| SEO foundations | 5 | Staging canonicals, shared og:image, JS-only locator |
| Visual consistency | 6 (inferred) | Good shared shell; uneven imagery and block templates |
| Mobile readiness | 6 (inferred) | Right patterns (action bar, stepped form); long Home, slider, filters to rework |
| Forms & service flows | 7 | SAV flow is strong; B2B form lacks email; consent missing everywhere |
| Accessibility | not scored | Needs a live DOM and device pass |

**Top 10 priorities**
1. Decide the identity (owner vs distributor) and one positioning sentence — H-04
2. Publish privacy, warranty terms and mentions légales; add form consent — H-10, S-02, C-04
3. Remove or label demo content (technician profile, demo tickets, "LIVE") — S-01, B-06
4. Source or reword safety, energy and warranty claims — B-03, B-04, B-05, S-09
5. Make the network claim true: real count, real list — N-01
6. Fix Home → Brands product-name continuity — B-01
7. One vocabulary and one set of figures for SAV, warranty and response times — H-05, S-03, 4.1
8. Make downloads work — P-01
9. Apply one image/card system and a mobile art-directed hero — 4.2, M-03
10. Shorten Home to 7 sections — H-07, 5.4

## 1. Method & limits (read first)

- Pages were read as extracted text/markup: copy, headings, links, image file names, alt text, meta tags.
- **Not available to this audit:** rendered screenshots, CSS, JavaScript behaviour, real device tests, Lighthouse/PageSpeed numbers.
- Consequence: findings about **image alignment, spacing and mobile layout are inferred from structure** and marked `VERIFY`. Findings about **copy, coherence, links, meta tags and structure are observed**.
- Priorities: **P0** = fix before any launch/sharing · **P1** = fix in the next sprint · **P2** = polish.

## 2. Page inventory

| Page | URL | Role |
|---|---|---|
| Home | `index.html` | Group hub: brands, SAV entry, B2B entry, network |
| Brands | `brands.html` | Theros, Pacific, Eurogas, Nerobel Tech (anchors `#theros`, `#pacific`, `#eurogas`, `#nerobel-tech`) |
| SAV | `sav.html` | After-sales request / ticket tracking |
| Showrooms | `network.html` | Network & service centres |
| Professionals | `b2b.html` | Installers, developers, resellers |
| Contact | `contact.html` | HQ, press, partnerships |

Primary nav: Groupe · Marques · Support SAV · Showrooms · Professionnels · Contact + CTA "Demande SAV" + language switch FR / AR / EN.

## 3. Page-by-page audit

### 3.1 Home (`index.html`) — ✅

**Structure observed:** header + language switch → hero slider (01/04) with trust strip and 4 stats → 3 entry cards (Marques, SAV, Pro) → "Collections Signatures" (5 product cards) → "Marques" (4 brand blocks) → SAV ticket tracker → heritage section → network section → mobile quick-action bar (Appeler · WhatsApp · SAV Express · Showrooms) → footer.

**What works**
- Clear single `H1`, logical `H2`/`H3` hierarchy.
- Viewport tag correct (`width=device-width, initial-scale=1.0, viewport-fit=cover`).
- Three-way entry cards (brands / SAV / pro) match real visitor intents.
- Mobile quick-action bar (call, WhatsApp, SAV, showrooms) is the right pattern for this audience.
- Brand logos are SVG; product/brand images have alt text.

**Findings**

| ID | Area | Finding | Priority | Fix |
|---|---|---|---|---|
| H-01 | SEO | `canonical` and `og:url` point to `nerobel.com` while the page is hosted on github.io; `og:image` uses a **relative** path (`assets/img/...`), so social previews will fail. | P1 | Absolute og:image URL; keep canonical for production, add `noindex` on the staging host. |
| H-02 | SEO | Title ≈ 75 characters (truncated in results); meta description ≈ 170 characters. | P2 | Title ≤ 60, description ≤ 155. |
| H-03 | Message | Hero tagline is English ("Consumer Tech for Modern Homes") above a French H1 ("L'Excellence du Confort & de la Maison Moderne"). The H1 is generic: it does not say who Nerobel is, what it sells, or where. | P1 | One language per page; H1 should state the offer, e.g. brands + category + Morocco. |
| H-04 | Message | **Identity is inconsistent:** "Distributeur et fabricant" (meta), "conçoit et distribue" (hero), "sont distribués par Nerobel" (footer), "Marque Constructeur" (Nerobel card), "leader marocain" (footer), "Groupe industriel et technologique" (hero). | P0 | Decide the brand architecture (house of brands vs distributor) and write one 15-word positioning sentence reused everywhere. |
| H-05 | Message | **Six labels for one service:** Demande SAV, Support SAV, Portail SAV, Portail Réclamation SAV, SAV Express, Suivi en Direct. "Réclamation" (complaint) also sets a negative tone. | P1 | Two terms only: **"Demande SAV"** (action) and **"Suivre mon dossier"** (tracking). |
| H-06 | Proof | Numbers do not line up: stat says **24/48h** intervention, badge says "Support SAV Réactif **48h**"; "**150+ Distributeurs & Showrooms**" in the stats vs "150+ **Showrooms**" in the hero; claims like "100% Garantie Constructeur Certifiée" are vague. | P1 | One source of truth per figure; separate "distributeurs" from "showrooms"; say what the warranty covers and for how long. |
| H-07 | Structure | "Collections Signatures" (5 cards) and "Marques" (4 blocks) present the **same four brands twice**; the fridge and the TV cards link to the same anchor (`#nerobel-tech`). Long page, diluted message. | P1 | Merge into one brand section, or make Collections product-led and Marques logo-led and short. |
| H-08 | Language | Pacific card carries an Arabic string ("متوفر لدى NEROBEL") while the other cards say "Disponible chez"; AR/EN switch exists but copy is French only. | P1 | Remove stray Arabic, or ship full AR (RTL) / EN versions. |
| H-09 | CTAs | Secondary action differs per brand: Theros → theros.ma, Pacific → SAV page, Eurogas → eurogas.ma, Nerobel → showrooms. Secondary links appear **icon-only with tooltip titles** (the extraction exposes raw URLs/file names as link text). | P1 | One pattern per card: "Détails" + "Visiter le site de la marque" (or "Où acheter"). `VERIFY` aria-labels on icon-only links. |
| H-10 | Legal | "Politique de Confidentialité" and "Conditions Générales de Garantie" link to `#` (dead). The site promotes warranties and collects SAV data. | P0 | Publish both pages; link them from the SAV form. |
| H-11 | Contact | Two numbers in different formats (`+212 787 013 201` WhatsApp; `+212 (0) 522 99 88 77` landline); the hero number has no label. | P2 | Label each (WhatsApp / Standard), one format. |
| H-12 | Footer | "Presse & Partenariats" and "Siège & Coordonnées" go to the same page; Pacific has no official-site link although Theros and Eurogas do. | P2 | Distinct targets or merge; explain Pacific's destination. |
| H-13 | Images | File naming is inconsistent (`theros_brand_article.jpg`, `pacific-waterheater-poster.jpg`, `eurogas-boiler.jpg`); some are **posters** (text baked into the image) next to product shots. `nerobel-banner-appliances.jpg` is reused as heritage image **and** og:image, with an alt ("Ingénierie et Showroom") that does not describe it. | P1 | `VERIFY` visually. Standardise: one aspect ratio, one crop rule, one treatment; no text inside images. |
| H-14 | Hero | Slide 1 is Theros-only while the site represents four brands; carousel needs pause control and keyboard support. | P2 | Hero = group promise; brand slides secondary. |
| H-15 | Feature | SAV ticket tracker (example `NERO-2026-8921`) sits mid-page; if it is not wired to a backend it will mislead. | P1 | Wire it, or replace with a link to the SAV page until live. |
| H-16 | Repetition | "Garantie Constructeur / Qualité Constructeur Garantie" appears 4+ times on one page. | P2 | Say it once, prominently, with substance. |

**Terminology drift to normalise** (also seen on Home): *double cuve* vs *double réservoir*; *cadran digital* vs *écran digital*; *Marques* vs *Portefeuille* vs *Collections*.

### 3.2 Brands (`brands.html`) — ✅

**Structure observed:** H1 "L'Alliance des Marques Leaders au Maroc" → Theros block (copy, 2 feature cards, image + "Simulateur Wi-Fi") → Pacific block (image + "Simulateur Montage" first, then copy) → Eurogas block (copy, then an article card linking to eurogas.ma) → Consumer Tech: 4 product cards (fridge, split AC, washer, OLED TV) with spec lines and "Trouver en Showroom" → mobile action bar → footer.

**What works**
- Each brand has a short narrative, two proof points and a clear next step.
- Interactive simulators (Theros temperature/power, Pacific horizontal/vertical) are a strong way to explain the products.
- Product cards use a consistent spec format (label + bold value) and one consistent CTA.
- Meta title/description are well sized and specific.

**Findings**

| ID | Area | Finding | Priority | Fix |
|---|---|---|---|---|
| B-01 | Coherence | **Home promises names the Brands page does not deliver:** "Pacific Horizon", "Eurogas Master Flame", "Black Titanium French-Door", "Vision Bezel-Less OLED" never appear here. Here the products are "Réfrigérateur Multi-Portes 520L", "Smart TV OLED 4K Ultra-Slim 65"". A visitor who clicks "Découvrir la collection" cannot find what they clicked. | P0 | One product naming system (brand + range + capacity/size), identical on every page. |
| B-02 | Coherence | **Finish naming drifts:** Home says "noir mat" / "acier noir mat anti-traces" / "Black Titanium"; Brands says "noir graphite brossé". Theros: "finition titane brossé" / "double réservoir titane" (Home) vs no titanium mention (Brands). | P1 | One finish vocabulary in the charter; reuse it. |
| B-03 | Claims | **Warranty is stated three different ways:** "100% Garantie Constructeur Certifiée" (Home), "Garantie 12 Mois sous conditions" (Theros), "Garantie moteur 10 Ans" (fridge). No page explains what is covered. | P0 | A single warranty table per brand/product, linked from every mention and from the legal page. |
| B-04 | Claims | **Eurogas safety figures look inconsistent:** "arrêt automatique en moins de 0.15 seconde" and "Basse Pression 0.15 Bar" reuse the same number for two different quantities; "Triple Sécurité ODS" calls one device (ODS) triple. Safety claims need certificates and test references. | P0 | Verify with technical sheets; show certificate/standard numbers; reword "triple" if it is not accurate. |
| B-05 | Claims | Washer says "A+++ (-30%)". The EU energy label moved to an A–G scale in 2021, so A+++ reads as outdated. "Antibactérien 99.9%" and the simulators' "-28% énergie" / "~22 min" have no stated test basis. | P1 | Use the current label scale for Morocco/EU; footnote the test method, or soften the claim. |
| B-06 | Claims | Simulator is badged "LIVE APP TEST" but is a front-end demo with invented values. | P1 | Rename "Démo interactive — valeurs indicatives". |
| B-07 | Specs | Temperature is unclear: Home shows Theros at 55°C, Brands says up to 75°C; Pacific "affichant précisément 75°C" reads like a fixed display. Home says "cadran digital", Brands "écran digital"; "double cuve" vs "double réservoir". | P1 | Define each spec once (setpoint range, display type) and reuse the wording. |
| B-08 | Images | **Consumer Tech cards show no product image**; one banner (`nerobel-banner-appliances.jpg`) stands in for four products and is also the og:image and the Home heritage image. `VERIFY` whether the cards use CSS backgrounds. | P1 | One product shot per card, same ratio, same background. |
| B-09 | Images | Theros uses a *different* file here (`theros_brand_page_withlogo_crop.jpg` — logo baked in) than on Home (`theros_brand_article.jpg`), and the Theros SVG logo is also placed next to the H2, so the logo appears twice. Pacific uses a poster (`pacific-waterheater-poster.jpg`) while Eurogas uses a product shot. | P1 | `VERIFY` visually. Clean product shots without baked-in logos or text; add logos in HTML only. |
| B-10 | Layout | Block order is not uniform: Theros = text then image; Pacific = image and simulator **before** the logo and H2; Eurogas = text then article card. On mobile, if the zig-zag is not re-ordered by CSS, Pacific shows its image before its brand name. | P1 | `VERIFY` on device. Always: logo → H2 → copy → media; desktop zig-zag via CSS only. |
| B-11 | CTAs | Secondary CTA again differs per brand: Theros "Accéder au Site Theros.ma" + SAV; Pacific "Support SAV" + "Trouver un Revendeur" (no brand site); Eurogas site + SAV; Consumer Tech showroom only. Eurogas alone embeds an editorial teaser (3 min read) pointing to eurogas.ma. | P1 | One CTA pair everywhere: "Voir le site de la marque" (or "Où acheter") + "Assistance SAV". Pacific needs a destination or a stated reason there is none. |
| B-12 | Structure | No in-page navigation (anchors exist but no sub-menu or sticky brand tabs), no spec sheets or PDF downloads, no model numbers. | P1 | Brand tabs on top; downloadable data sheets; model references for SAV matching. |
| B-13 | Message | "Leader(s)" is claimed for the group, for every brand and in the H1 ("Alliance des Marques Leaders") without evidence; "Alliance" suggests separate partners rather than one group. | P2 | Replace with a verifiable fact (years, installed base, showrooms). |

### 3.3 SAV (`sav.html`) — ✅

**Structure observed:** H1 "Portail SAV Officiel Nerobel" → two tabs (Réclamation Express / Suivi Nexenflow) → 3-step form (1. device type · 2. customer + equipment details with GPS, photo/invoice upload and nameplate help · 3. confirmation) → success screen with ticket number → live-tracking view (demo tickets, 5-step timeline, assigned technician card) → modals (nameplate guide, map pin, live camera).

**What works**
- Best page of the site in terms of purpose: a short guided flow, mobile-friendly inputs (+212 prefix, GPS capture, camera capture, photo/PDF upload up to 10 MB).
- Inline error messages exist; the nameplate help and example serial reduce abandonment.
- Success state gives a copyable ticket number, a PDF receipt and a WhatsApp follow-up.

**Findings**

| ID | Area | Finding | Priority | Fix |
|---|---|---|---|---|
| S-01 | Trust | **A named technician profile appears on the public page** ("Karim Benjelloun", 4.9/5, "148 interventions certifiées", phone and WhatsApp buttons) together with demo tickets (`NERO-2026-9842`, `-8921`, `-1044`). If this is demo data it looks like fake reviews and personal data. | P0 | Remove before sharing, or clearly label "Exemple fictif" with an anonymised persona. |
| S-02 | Privacy | The form collects name, phone, address, **GPS position**, photos and invoices, but shows **no consent text and no privacy link** (the footer link is `#`). Morocco's personal-data law (09-08, CNDP) applies. | P0 | Add a consent checkbox + short notice linked to a real privacy page; confirm obligations with counsel. |
| S-03 | Promise | Response promises conflict: Home stat says intervention in **24/48h**; this page says the team *takes charge of the file* within 24–48 business hours; the tracking demo shows a technician visit the **same day**. | P1 | Define two SLAs (file acknowledged / technician visit) and use them everywhere. |
| S-04 | Message | **"Nexenflow" is exposed to customers** ("Suivi Nexenflow", "Synchronisation Nexenflow Live · Télématique Maroc", "Réception sur Nexenflow"). Nerobel customers do not know this name; it competes with the Nerobel brand on the page that matters most. | P1 | Customer-facing label: "Suivre mon dossier". If needed, a small "Propulsé par Nexenflow" in the footer. |
| S-05 | Message | Terminology again: *Réclamation, Demande SAV, Dossier, Ticket, Intervention, Réclamation Express.* | P1 | Use "Demande SAV" (action), "Dossier n°" (object), "Suivi" (tracking). |
| S-06 | Coherence | The form offers **"Solaire & Thermodynamique"** and Eurogas "6L, 10L, chaudière", but **no page of the site presents solar or thermodynamic products**; the brand list says "Theros (Électrique / Solaire)". The demo ticket shows "Theros Pro-Slim **80L**" while Home shows "Pro-Slim **50L**". | P1 | Align the product catalogue with what SAV supports (add the missing ranges to Brands or remove the option); verify existing capacities. |
| S-07 | UX | Device category is asked in step 1 and **brand again in step 2**; serial number is **required**, which blocks customers who cannot find the plate; city list (incl. Meknès) differs from the network cities shown elsewhere. | P1 | Pre-fill the brand from the category/brand link; add "Je ne trouve pas mon numéro" + invoice fallback; use one city list. |
| S-08 | Links | Success screen: "Suivre sur WhatsApp" links to `#`. The technician "Appeler" button uses the central WhatsApp number (`+212 787 013 201`), not a technician line; the mobile bar's "Appeler" uses the landline. | P1 | Real deep link with the ticket number pre-filled; one number per purpose, labelled. |
| S-09 | Claims | "Géolocalisation de votre technicien", "temps réel", "Télématique Maroc", "Pièces d'origine 100% certifiées avec traçabilité usine", "Garantie validée (0 DH)" are strong promises; `VERIFY` they are real at launch. A warranty "validated" automatically needs published terms (dead link in footer). | P0 | Ship only what is operational; link the warranty terms next to every warranty statement. |
| S-10 | Images | Nameplate guide is a single generic icon (`serial-guide.svg`) with "généralement collée sous le chauffe-eau"; the plate location differs for electric, gas, fridge and TV. Example serial `PC202604150892` has no brand logic. | P2 | One photo/illustration per category, with the serial format per brand. |
| S-11 | Navigation | The sticky mobile bar still shows "SAV Express" while you are on the SAV page. | P2 | On this page swap it for "Suivre mon dossier". |
| S-12 | Accessibility | Heavy use of modals (map pin, live camera, nameplate guide) and step transitions. `VERIFY` focus trapping, Escape to close, labelled controls, error messages tied to fields, and a no-camera / no-GPS fallback. | P1 | Test with keyboard and a screen reader; keep a manual address field always available. |

### 3.4 Showrooms (`network.html`) — ✅

**Structure observed:** H1 "Nos Showrooms & Distributeurs Agréés" → 3 filters (Ville, Marque, Établissement) → results list ("9 Établissements") with map selection → mobile action bar → footer. The list and map are script-rendered, so store details were not visible to this audit (`VERIFY` on device).

**What works**
- The three filters (city, brand, type of outlet) match how people actually look for a point of sale.
- Brand filter lets a visitor find where Theros, Pacific, Eurogas or Nerobel products are sold.

**Findings**

| ID | Area | Finding | Priority | Fix |
|---|---|---|---|---|
| N-01 | Proof | **The page promises 150+ points of sale and shows 9.** The figure is worded four ways: "150+ Showrooms" (Home hero), "150+ Distributeurs & Showrooms" (Home stat), "plus de 150 revendeurs agréés" (this page's meta), "plus de 150 showrooms partenaires" (Contact). | P0 | Show the real list, or change the claim to a number you can display. Use one noun: *points de vente* (total) and *showrooms Nerobel* (owned). |
| N-02 | Coherence | **Three different city lists:** Home names 7 (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir, Oujda), this filter has 6 (no Oujda), the SAV form has 8 + "Autre Ville" (adds Meknès). | P1 | One city list driven by one data source. |
| N-03 | Coherence | Home promises "centres SAV agréés à Casablanca, Rabat…", but the page has **no SAV-centre type** in the Établissement filter (only Showrooms officiels / Grandes Surfaces / Grossistes). | P1 | Add "Centres SAV agréés", or remove the promise from Home. |
| N-04 | Content | Retail partners are named in the filter (Bricoma / Marjane). Confirm permission to use partner names and logos; the filter mixes owned showrooms with third-party retail and wholesalers. | P1 | Written partner approval; visual distinction owned vs partner. |
| N-05 | UX | No "Autour de moi" geolocation, no "Itinéraire" link per outlet, no opening hours or per-store phone visible, no per-store product availability. `VERIFY` list cards. | P1 | Per outlet: address, hours, phone/WhatsApp, directions link, brands carried. |
| N-06 | SEO | A JS-only locator exposes no indexable store pages; "showroom Casablanca / Marrakech…" searches cannot land here. | P1 | One static page per city (and per major outlet) with `LocalBusiness` markup; keep the locator on top. |
| N-07 | Message | Page naming drifts: nav "Showrooms", H1 "Showrooms & Distributeurs Agréés", footer "Showrooms & Distributeurs", Home "Trouver un Showroom Agréé", Brands "Trouver en Showroom" / "Trouver un Revendeur". Brand filter says "Theros (Électrique & Solaire)" (solar range is not shown elsewhere — see S-06). | P1 | One label: "Où acheter". |
| N-08 | Structure | Heading order jumps from **H1 straight to H3** ("Adresses & Contacts Showrooms"). | P2 | H1 → H2 → H3. |

### 3.5 Professionals (`b2b.html`) — ✅

**Structure observed:** H1 "Rejoignez l'Alliance des Partenaires Nerobel" → 3 value cards (Certifications & CE, Disponibilité immédiate, Nerobel Academy) → account-opening form (H2) → download area with 4 PDFs → mobile bar → footer.

**What works**
- Right audience segmentation in the form (installer, reseller, developer, design office).
- Clear 24h business-day response promise, consistent between intro and form.
- A technical download area is exactly what installers and architects look for.

**Findings**

| ID | Area | Finding | Priority | Fix |
|---|---|---|---|---|
| P-01 | Links | **All 4 PDF downloads point to `#`** (Theros Pro-Slim sheet 2.4 Mo, Pacific mounting diagram 1.8 Mo, Eurogas CE/ODS certificates 3.1 Mo, Nerobel catalogue 2026 4.8 Mo). The page promises documents that cannot be downloaded. | P0 | Upload real files, or hide the block until ready. Keep technical sheets ungated; gate price lists only. |
| P-02 | Form | **No email field** in a B2B account request (phone only); no city/region, no brand of interest, no consent text. | P1 | Add email (required), city, brands of interest, consent checkbox + privacy link. |
| P-03 | Claims | "Stock garanti", "Disponibilité immédiate", "Centres logistiques à Casablanca et Tanger", "Nerobel Academy — formations agréées", "conditions tarifaires réservées" have no supporting page: no academy programme, dates or sign-up, no stock policy, no terms. | P1 | Add a short page or section per promise, or soften the wording. |
| P-04 | Message | Audience wording drifts: Home "Promoteurs immobiliers, plombiers installateurs et revendeurs"; this page's intro "bureaux d'études, promoteurs, architectes et artisans" (resellers missing, yet resellers are in the form); labels: *Programme Pro, Espace Professionnels, Espace Installateurs & B2B, Espace Partenaires B2B, Devenir Partenaire Agréé, Alliance des Partenaires.* | P1 | One name ("Espace Pro") and one audience list; give resellers their own value proposition (terms, merchandising, logistics). |
| P-05 | Message | "Ligne B2B : +212 522 99 88 77" is the same number as the general switchboard; "Garantie Constructeur Directe" is yet another warranty phrase (see B-03). | P2 | Dedicated B2B line/WhatsApp, or label it as the switchboard. |
| P-06 | Images | The page has **no imagery** beyond logos: no installation photos, partner logos, project references or academy photos. For a trust-driven B2B page this is a visible gap (and nothing to align). | P1 | 3–4 real project photos, partner/reference logos, one academy photo, all in the same crop and treatment. |
| P-07 | Structure | Heading order starts at H3 (value cards) before the H2 form title. | P2 | Fix hierarchy. |

### 3.6 Contact (`contact.html`) — ✅

**Structure observed:** H1 "Prenez Contact avec le Groupe Nerobel" → HQ & main showroom card (address, switchboard, WhatsApp hotline, commercial email, hours) → WhatsApp "concierge" block → showroom-finder link → contact form (name, phone, optional email, department, message) → mobile bar → footer.

**What works**
- Complete HQ block: address, hours, phone, WhatsApp and email on one screen.
- Department selector routes messages; WhatsApp is promoted as the fast channel.

**Findings**

| ID | Area | Finding | Priority | Fix |
|---|---|---|---|---|
| C-01 | Routing | The department list includes **"Support Technique & SAV"**: SAV requests can arrive without a ticket, in parallel to the SAV portal. Same for B2B ("Partenariat Professionnel"). | P1 | Selecting SAV or Pro redirects to the dedicated form. |
| C-02 | Contact | One email only, labelled "Direction Commerciale" (`contact@nerobel.com`). No SAV, press or partnership address although the footer sends "Presse & Partenariats" to this page. | P1 | Role-based addresses, or remove the footer entry. |
| C-03 | Message | The same WhatsApp line is named *Hotline WhatsApp Client*, *Concierge WhatsApp Direct*, *WhatsApp Support*, and used as technician phone on SAV. Form reply promise is "dans les plus brefs délais" while other pages promise 24h. | P1 | One name ("WhatsApp Nerobel") and one stated reply time per channel. |
| C-04 | Privacy / legal | No consent text and no privacy link on the form; no **mentions légales** (company name, RC/ICE, publisher, host) anywhere in the footer. | P0 | Add both; link from every form. |
| C-05 | Trust | HQ is presented as "Siège Social & Showroom Principal" with address only: no map, no directions link, no facade or showroom photo. | P1 | Embedded map + "Itinéraire" button + one real photo. |
| C-06 | Proof | "Plus de 150 showrooms partenaires" + "carte interactive" repeat the N-01 mismatch. | P1 | See N-01. |

## 4. Cross-site diagnosis

### 4.1 Message coherence

The site's structure is sound; the problem is that **the same idea is worded several ways, and several numbers disagree**. Each row below is a message that must have exactly one wording and one source of truth.

| Topic | Variants found (where) | Decision needed |
|---|---|---|
| **Who Nerobel is** | "Distributeur et fabricant" (meta) · "conçoit et distribue" (Home hero) · "sont distribués par Nerobel" (footer) · "Marque Constructeur" (Nerobel card) · "Groupe industriel et technologique" (hero) · "leader marocain" (footer) | Owner/manufacturer or distributor, per brand. Then one sentence, reused. |
| **After-sales name** | Demande SAV · Support SAV · Portail SAV · Portail Réclamation SAV · SAV Express · Réclamation Express · Suivi en Direct · Suivi Nexenflow | "Demande SAV" + "Suivre mon dossier" |
| **After-sales speed** | 24/48h intervention (Home stat) · "Réactif 48h" (badge) · 24–48 business hours to *take charge* (SAV) · same-day visit (tracking demo) · "sous 24h" (B2B) · "dans les plus brefs délais" (Contact) | Two SLAs: file acknowledged / technician visit |
| **Warranty** | "100% Garantie Constructeur Certifiée" · "12 mois sous conditions" (Theros) · "moteur 10 ans" (fridge) · "Garantie Constructeur Directe" (B2B) · "Garantie validée 0 DH" · "extension de garantie" | One warranty table per brand + legal terms page |
| **Network size** | 150+ showrooms · 150+ distributeurs & showrooms · 150+ revendeurs · 150+ points de vente · **9 listed** · 7 / 6 / 8 cities | Real count + real list |
| **Where to buy** | Trouver un Showroom Agréé · Trouver en Showroom · Trouver un Revendeur · Nos Showrooms & Distributeurs | "Où acheter" |
| **Product names** | Home: Pro-Slim 50L, Pacific Horizon, Master Flame, Black Titanium French-Door, Vision Bezel-Less OLED · Brands: fridge 520L, OLED 65", Pacific 80L (H), none for Eurogas · SAV: Pro-Slim 80L | One catalogue (range + capacity/size + model code) |
| **Finishes & specs** | noir mat / noir graphite brossé / Black Titanium · double cuve / double réservoir · cadran / écran digital · 55°C vs 75°C | Vocabulary in the charter |
| **WhatsApp line** | Hotline WhatsApp Client · Concierge WhatsApp Direct · WhatsApp Support · technician "Appeler" | "WhatsApp Nerobel" |
| **Pro space** | Programme Pro · Espace Professionnels · Espace Installateurs & B2B · Espace Partenaires B2B · Devenir Partenaire Agréé · Alliance des Partenaires | "Espace Pro" |
| **Language** | English tagline over French H1 · Arabic string on one card · English alt texts ("Eurogas Boiler Showcase") · FR/AR/EN switch with FR-only content | One language per page |
| **Brand destinations** | Theros → theros.ma · Eurogas → eurogas.ma · Pacific → none · Nerobel → showrooms | Same CTA pair on all four brands |

**Proposed message architecture (draft to validate once the identity decision H-04 is made)**
- **Promise (one sentence, every page footer and the Home H1 area):** the brands, the category and the national after-sales — e.g. "Theros, Pacific, Eurogas et Nerobel : l'eau chaude et l'électroménager de la maison, avec un SAV partout au Maroc."
- **Three pillars, same order in nav, Home cards and footer:** **Choisir** (Marques) → **Où acheter** (Réseau) → **Être accompagné** (SAV).
- **Buying path:** this site has no cart; the path is *Choisir → Où acheter → showroom or the brand's own shop.* Every product card ends with that one action.
- **Proof points:** maximum four numbers, each defined once and reused (years, points of sale, SAV response, warranty).

### 4.2 Images & alignment

**Inventory (from markup; `VERIFY` = needs a visual check)**

| Asset | Used on | Observation |
|---|---|---|
| `nerobel-logo.svg` | every page, 5–7 times per page | Fine. In "Disponible chez [logo]" the alt "NEROBEL" duplicates the visible context. |
| `theros_brand_article.jpg` / `theros_brand_page_withlogo_crop.jpg` | Home / Brands | Two different Theros images; the second has a logo baked in and the SVG logo sits beside the H2 as well. |
| `pacific-waterheater-poster.jpg` | Home, Brands | Poster format (likely baked-in text) next to product-style shots. |
| `eurogas-boiler.jpg` | Home, Brands | Alt is French on Home, English on Brands ("Eurogas Boiler Showcase"). |
| `nerobel-tech-showcase.jpg` | Home | Brand-block image. |
| `nerobel-banner-appliances.jpg` | Home heritage, Brands (range), **og:image of all 6 pages** | One banner doing three jobs; its Home alt ("Ingénierie et Showroom") does not describe it. |
| Hero slider (4 slides) | Home | Slide images are not exposed in the markup (`VERIFY` CSS backgrounds, sizes, mobile crop). |
| `serial-guide.svg` | SAV | Generic icon for four product families. |
| — | Network, B2B, Contact | **No photography at all** (no showroom, installation or team photo). |

**Alignment risks**
- Mixed image types (poster / product shot / banner / cropped with logo) cannot align visually even with identical CSS boxes.
- Zig-zag block order differs between brands in the DOM (see B-10), so mobile order may differ from desktop.
- Consumer Tech cards have no product image, so the row of four cannot share a baseline with the brand blocks above.
- Product names and spec lines differ in length, so card heights and CTA baselines will drift unless the grid is forced.

**Target specification**
- **One ratio per role:** hero 16:9 (desktop) with a separate 4:5 crop for mobile; brand and product cards 4:3; thumbnails 1:1. `object-fit: cover` with a set `object-position` per image.
- **One treatment:** same background, lighting and shadow for product shots; no text, logo or price baked into photos; logos are added in HTML/SVG only.
- **Card alignment:** CSS grid with equal row heights; heading, spec list and CTA on fixed baselines (subgrid or fixed min-heights); logos in a fixed-height box.
- **Technical:** `width`/`height` on every image (no layout shift); WebP/AVIF with `srcset`; hero eager-loaded, the rest lazy; alt text in the page language that describes the image (decorative = empty alt).
- **Social:** a unique 1200×630 og:image per page, absolute URL.
- **Naming:** `{brand}-{subject}-{ratio}.webp`, e.g. `theros-pro-slim-card-4x3.webp`.

### 4.3 SEO, accessibility, language, trust

**SEO / technical**
- Canonical and `og:url` point to `nerobel.com` from the github.io host; `og:image` is relative and identical on all pages; add `noindex` on staging.
- Title lengths: Home ≈ 75 chars (too long), Brands and SAV ≈ 65 (borderline), Network/B2B/Contact fine.
- Not visible in the markup (`VERIFY`): JSON-LD (`Organization`, `LocalBusiness`, `Product`), `hreflang`, sitemap, robots, 404 page.
- The store locator is JS-only (see N-06); the product narrative is on one long page with anchors rather than one URL per brand.

**Accessibility (to verify on the live DOM)**
- Icon-only links (social, brand secondary actions) appear to rely on `title` tooltips; need `aria-label`.
- Auto-advancing hero slider needs pause/stop, keyboard and reduced-motion support.
- Modals on the SAV page (map, camera, nameplate) need focus trapping and Escape.
- Dark/matte theme: check text contrast on images and on grey-on-black captions (target WCAG AA 4.5:1).
- Heading order breaks on Network and B2B (H1 → H3).

**Language / RTL**
- The FR / AR / EN switch is live but the content is French only. Either ship Arabic (RTL mirror, Arabic-friendly font, number and phone formatting) and English, or hide the switch until they exist.

**Trust & legal**
- Dead links: privacy policy and warranty terms (`#` on every page), four PDFs (`#`), "Suivre sur WhatsApp" (`#`).
- No mentions légales (company name, RC/ICE, publisher, host); no consent text on three forms collecting personal data.
- Demo content that reads as real: named technician with rating, demo tickets, "LIVE" labels, unsupported percentages.
- No customer proof (reviews, installations, reference projects); certifications are mentioned in text but not shown (CE marks, certificates).

**Performance (not measured here) — budgets to hold**
- Mobile, mid-range Android on 4G: LCP < 2.5 s, CLS < 0.1, INP < 200 ms; Home weight < 1.5 MB; images ≤ 150 KB each at their displayed size.

## 5. Design review (web designer)

> Based on structure, copy and asset names, not on rendered screens. Items marked `VERIFY` need a visual pass; everything else follows from the markup.

### 5.1 Diagnosis

**Strengths**
- A real shared shell: same header, language switch, "Demande SAV" CTA, mobile action bar and footer on all six pages.
- A coherent premium voice (matte black, titanium, "Pro-Slim", OLED) that suits the product range.
- Good use of interaction to explain products (Theros and Pacific simulators) and a guided SAV flow.

**Weaknesses**
1. **Hierarchy on Home is flat.** Above the fold and just below: slider, 2 hero buttons, a WhatsApp number, a trust strip, 4 stats and 3 entry cards. Everything competes; nothing leads.
2. **Too many sections for one idea.** Home has about 10 sections and shows the four brands twice (see H-07).
3. **No visual system per brand.** Four brands (Theros, Pacific, Eurogas, Nerobel) are told apart by logo only; there is no accent colour or layout signature to help recognition, and no rule separating *group shell* from *brand identity*.
4. **Inconsistent block templates** on Brands (Theros text-first, Pacific media-first, Eurogas text + article, Consumer Tech cards without images).
5. **Badge and label noise:** "LIVE APP TEST", "FLEX 360°", "FROST-FREE", "T3 TROPICAL", "STEAM CARE", "120 HZ CINEMA" mix English jargon into French pages and compete with the real message.
6. **Imagery is uneven** (posters, product shots, banners, baked-in logos) and absent from Network, B2B and Contact (see 4.2).
7. **Utility pages are not designed as a set.** SAV is rich, Network is two filters and a list, B2B and Contact are plain forms.

### 5.2 Design system to put in place (tokens first)

| Layer | Rule |
|---|---|
| **Colour** | Neutral scale for the dark shell (900 → 50), one accent per brand (4), semantic colours for success / warning / error / info. Freeze the actual hex values in the group charter before building; contrast target WCAG AA. |
| **Typography** | Maximum two families (display + text) with an Arabic-capable pairing; fluid scale (`clamp`) from 16 px body on mobile; line length 60–75 characters; sentence case for headings, capitals only for small eyebrows. |
| **Spacing & grid** | 8-pt spacing scale; 12 columns desktop / 8 tablet / 4 mobile; section spacing 96 / 64 / 48 px. |
| **Shape & depth** | Two radii (8 and 16 px), two elevation levels, 1 px hairlines on dark surfaces. |
| **Breakpoints** | 360 · 768 · 1024 · 1280 · 1440. |
| **Touch** | Minimum 48 × 48 px targets, 8 px gaps. |
| **Motion** | Short fades/slides only; respect `prefers-reduced-motion`; no autoplay carousel. |
| **Iconography** | One SVG set, one stroke weight. |
| **Brand layer** | Group shell stays neutral; brand accent appears only on brand cards, brand headers and CTAs inside that brand's area. |

### 5.3 Core component set (build once, reuse everywhere)
Header (+ drawer) · Hero · **Brand card** · **Product card** (image, name, 3 specs, one CTA) · Spec list · **CTA pair** (primary + secondary, same wording on every brand) · Proof strip (≤ 4 numbers) · Pillar card (Choisir / Où acheter / Être accompagné) · Form step · Locator card · Download card · Footer · Mobile action bar.

### 5.4 Page-level redesign recommendations

| Page | Recommendation |
|---|---|
| **Home** | Cut to 7 sections: (1) Hero with the group promise and 2 actions — *Choisir une marque* and *Demande SAV*; (2) four equal brand cards with accent colour; (3) three pillars with the proof strip; (4) 3–4 featured products; (5) SAV tracking teaser; (6) network teaser with a map snapshot and one city picker; (7) footer. Remove the duplicate "Collections Signatures" or make it the featured-products row. |
| **Brands** | Sticky brand tabs (Theros · Pacific · Eurogas · Nerobel). One template per brand: logo + H2 → promise → 3 proof points → media → spec table → downloads → CTA pair. Simulators stay, relabelled as demos. Product cards get images. |
| **SAV** | Keep the three-step flow; add a progress bar, save-draft and a clear success page. Remove the named technician and demo tickets (or mark them as examples). Use "Suivre mon dossier". |
| **Showrooms** | Split view on desktop (list left, map right), list-first with a map toggle on mobile; filter chips; "Autour de moi"; per-outlet card with address, hours, phone, WhatsApp, directions. |
| **Professionals** | Audience tabs (Installateur · Revendeur · Promoteur · Bureau d'études), each with its own benefits; project photos and partner logos; documents as cards with real files; shorter form with email. |
| **Contact** | Three clear paths at the top (SAV → portal, Commercial, Presse/Partenariats) before the form; embedded map; facade/showroom photo. |

## 6. Mobile diagnosis

> Method: the site cannot be rendered here, so layout points are **inferred from markup** and labelled `VERIFY`. Observed facts: viewport tag is correct with `viewport-fit=cover`; a 4-action mobile bar exists on every page; navigation is duplicated for desktop and drawer; the hero is a 4-slide slider; the SAV page is a multi-step form with modals.

### 6.1 Findings

| ID | Area | Finding | Priority | Fix |
|---|---|---|---|---|
| M-01 | Action bar | The Appeler · WhatsApp · SAV Express · Showrooms bar is the right pattern for this audience. Risks: with `viewport-fit=cover` it needs `env(safe-area-inset-bottom)`; content and footer need bottom padding so they are not hidden; labels may truncate at 320–360 px; it is redundant on the SAV page. `VERIFY` | P1 | Safe-area padding, page bottom padding, 48 px targets, page-aware items. |
| M-02 | Length | Home stacks about 10 sections and repeats the brands; with images this is a very long mobile scroll. | P1 | The 7-section Home in 5.4. |
| M-03 | Hero | Slider + trust strip + 4 stats + 3 cards near the top. Swiping a slider fights vertical scrolling; autoplay burns mobile data; text on image needs contrast and a **separate mobile crop**. `VERIFY` | P1 | Static hero on mobile (one promise, two buttons), art-directed 4:5 image, no autoplay. |
| M-04 | Order | Pacific's block puts media before logo and H2 in the DOM. `VERIFY` stacked order on phone. | P1 | Same order for every brand: logo → H2 → copy → media. |
| M-05 | Simulators | Chip rows (30/55/75 °C, 500/1300/2000 W) and toggles must wrap and keep 48 px targets inside a ~340 px column; avoid horizontal overflow. `VERIFY` | P1 | Segmented controls stacked or wrapped; test at 360 px. |
| M-06 | Cards | Label + value spec lines (e.g. "Volume utile **520 Litres**") can wrap awkwardly at 360 px; five Collections cards stacked add length. | P2 | Stacked label over value; horizontal snap carousel only for featured products. |
| M-07 | SAV form | Strong base. Check: `inputmode`/`type="tel"`, `autocomplete` (name, tel, street-address), the +212 selector, camera upload via `capture`, GPS permission denial path, full-screen map modal, sticky "Continuer" visible above the keyboard, scroll to the first error, client-side photo compression (10 MB limit on mobile data), save-draft. `VERIFY` | P1 | Implement and test each; always keep a manual address field. |
| M-08 | Locator | Three filters + list + map will crowd a phone. | P1 | Filter bottom sheet, list-first with a Map toggle, "Autour de moi", call and directions buttons on each card. |
| M-09 | Header | Logo + language + "Demande SAV" + burger may crowd at 360 px; language switch is better inside the drawer. `VERIFY` | P2 | Logo + burger + one CTA; language in the drawer. |
| M-10 | Footer | Three columns and three phone formats; dead legal links. | P1 | Accordions per column; one phone format; working legal links. |
| M-11 | Performance | Unmeasured. Likely costs: hero images, five brand/product images on Home, simulators, map and locator scripts loaded everywhere. | P1 | Hero image preload, lazy-load the rest, load simulator/map scripts only on their pages, WebP/AVIF, font preconnect and `font-display: swap`. |
| M-12 | Hover | Any hover-only effects on cards or buttons need tap equivalents. `VERIFY` | P2 | No information or action that exists only on hover. |
| M-13 | Viewport units | A full-screen hero using `100vh` jumps under mobile browser bars. `VERIFY` | P2 | Use `dvh`/`svh`. |
| M-14 | Arabic | If AR ships, every component must mirror correctly (RTL) including the action bar order, form fields and chips. | P1 (if AR ships) | Logical CSS properties (`margin-inline`, `padding-inline`), RTL test pass. |
| M-15 | Tablet | The 768–1024 range is the usual blind spot (nav collapse, two-column cards). `VERIFY` | P2 | Add 768 and 1024 to the test matrix. |

### 6.2 Mobile test matrix (run before sign-off)

| Dimension | Values |
|---|---|
| Viewports | 360 × 800, 390 × 844, 430 × 932, 768 × 1024 (portrait and landscape) |
| Browsers | Chrome Android, Samsung Internet, Safari iOS |
| Network | Slow 4G + 4× CPU throttle |
| Pages | All six, FR then AR (RTL) |
| Checks | No horizontal scroll · targets ≥ 48 px · action bar clear of content · form keyboards and autofill · modals closable · LCP/CLS/INP within budget · text ≥ 16 px · contrast AA |

## 7. Improvement plan & roadmap

Timeline assumes one product owner, one designer, one front-end developer and part-time copy, legal and photo support. Adjust durations to the real team.

> **Owner decisions of 2026-10-17 (section 8.4) override this roadmap where they conflict:** French only for v1, no live tracking, no SLA or warranty figures, no "150+" claim, no named partner retailers, no solar range, a Pacific page inside the Nerobel site, and a group-owner positioning. Rows below that mention identity (Phase 0), language scope, "Suivre mon dossier", the Nexenflow name, SAV centres and the facts sheet should be read through 8.4.

### Phase 0 — Blockers (before the site is shared or indexed) · ~1 week

| Action | Findings | Owner | Done when |
|---|---|---|---|
| Decide the identity: owner/manufacturer vs distributor, per brand; write the one-sentence positioning | H-04, 4.1 | Product owner / management | Sentence approved and reused |
| Publish privacy policy, warranty terms and mentions légales; link from footer and every form; add consent to the 3 forms | H-10, S-02, C-04, P-02 | Legal + dev | No `#` legal links; consent logged |
| Remove or label demo content (technician profile, demo tickets, "LIVE" labels, invented percentages) | S-01, B-06, S-09 | Product owner | Nothing fake reads as real |
| Verify and source technical and safety claims (ODS timing, "triple" safety, energy class, antibacterial %, warranty figures) | B-03, B-04, B-05 | Brand/technical managers | Each claim has a document or is reworded |
| Make the network claim true: publish the real list or change the figure | N-01, C-06 | Sales | One number, matched by the list |
| Upload the four PDFs or hide the block | P-01 | Marketing | Real files, correct sizes |
| `noindex` on the staging host; absolute, per-page og:image | H-01 | Dev | Previews work; staging not indexed |

### Phase 1 — Message & content foundation · ~2 weeks

| Action | Findings |
|---|---|
| Create a **single facts sheet** (figures, SLAs, warranty per brand, cities, phone/WhatsApp, product names) that every page reads from | H-06, H-11, S-03, N-02, 4.1 |
| Apply the vocabulary: Demande SAV / Suivre mon dossier / Où acheter / Espace Pro / WhatsApp Nerobel | H-05, N-07, P-04, C-03, S-05 |
| Build one **product catalogue** (range, capacity/size, model code, finish, specs) and rename Home and Brands from it | B-01, B-02, B-07, S-06 |
| Rewrite Home hero and the brand blurbs; remove the double brand presentation | H-03, H-07, H-16, B-13 |
| Decide language scope: ship AR/EN or hide the switch; remove stray Arabic | H-08, 4.3 |
| Align cities and outlet types across Home, Network and SAV; add SAV centres or drop the promise | N-02, N-03, S-07 |
| Hide the "Nexenflow" name from the customer interface | S-04 |

### Phase 2 — Design system & imagery · ~2–3 weeks

| Action | Findings |
|---|---|
| Freeze tokens (colour, type, spacing, radii, breakpoints) and the 4 brand accents | 5.2 |
| Build the 13 core components | 5.3 |
| Photo brief and shoot/retouch: product shots on one background, showroom and facade, installation sites, team | B-08, B-09, H-13, P-06, C-05 |
| Export images per spec: ratios, WebP/AVIF, `srcset`, naming, alt text in the page language | 4.2 |

### Phase 3 — Page rebuilds · ~3–4 weeks (overlaps Phase 2)

| Page | Main deliverables | Findings |
|---|---|---|
| Home | 7-section structure, static mobile hero, proof strip, tracker teaser | H-03…H-16, M-02, M-03 |
| Brands | Sticky brand tabs, one template, product cards with images, spec tables, uniform CTA pair, downloads | B-01…B-13, M-04, M-05 |
| SAV | Pre-filled brand, serial fallback, consent, real WhatsApp deep link, progress bar, per-category nameplate help | S-02, S-05…S-12 |
| Showrooms | Split view / list-first with map toggle, geolocation, rich outlet cards, static city pages with `LocalBusiness` | N-01…N-08, M-08 |
| Professionals | Audience tabs, real downloads, email field, references, academy page | P-01…P-07 |
| Contact | Three routing paths, role-based emails, embedded map, photo | C-01…C-06 |

### Phase 4 — Mobile & performance · ~1–2 weeks

Implement and test M-01 to M-15; hit the budgets in 4.3 (LCP < 2.5 s, CLS < 0.1, INP < 200 ms, Home < 1.5 MB); run the matrix in 6.2.

### Phase 5 — SEO, accessibility, analytics, launch · ~1–2 weeks

| Action | Notes |
|---|---|
| Titles ≤ 60 chars, descriptions ≤ 155, unique og:image per page | H-02 |
| JSON-LD: `Organization`, `LocalBusiness` (per outlet), `Product` | 4.3 |
| `hreflang` (if several languages), sitemap, robots, 404 page | 4.3 |
| Accessibility pass: labels on icon links, slider controls, modal focus, contrast, heading order | S-12, N-08, P-07 |
| Analytics events: SAV form start/step/complete, WhatsApp and call taps, locator use, PDF downloads, B2B submissions | KPIs below |
| Redirects and canonical switch to `nerobel.com` at go-live | H-01 |

### Phase 6 — After launch · ongoing

AR/EN versions (RTL), customer reviews and installation case studies, one page per city, academy programme, real-time tracking if not live, quarterly claim review.

### KPIs

| KPI | Why |
|---|---|
| SAV form completion rate and share of requests coming through the portal vs. WhatsApp/phone | Core service goal |
| Taps on Appeler / WhatsApp / Où acheter per 100 mobile sessions | Mobile bar effectiveness |
| Locator searches and outlet clicks (directions, call) | Network usefulness |
| B2B form submissions and PDF downloads | Pro funnel |
| LCP, CLS, INP on mobile (field data) | Experience quality |
| Search impressions for "showroom + city" and brand + city queries | Local visibility |

### Expert profiles needed to reach the ideal version

Product owner (decisions, facts sheet) · Brand/UX designer (system, components) · Front-end developer (accessible, responsive build) · French copywriter, plus Arabic and English translators · Product photographer / retoucher · Legal adviser (privacy, claims, legal notices) · SEO specialist (local and structured data) · QA tester (devices, accessibility).

## 8. Ideal-version spec & QA checklist

### 8.1 What "ideal" means (acceptance criteria)

1. **One message:** a visitor can state in ten seconds who Nerobel is, which four brands it covers and what to do next (choose, where to buy, get support).
2. **One truth per fact:** every figure, SLA, warranty and name comes from the facts sheet and reads the same on every page.
3. **Every promise is operational:** no dead link, no demo content that reads as real, no claim without a source.
4. **Visual alignment by rule:** same ratios, treatments and card baselines on all pages and breakpoints.
5. **Phone-first:** all key actions (call, WhatsApp, SAV request, find a showroom) reachable in two taps, no horizontal scroll, within performance budgets.
6. **Accessible and lawful:** WCAG AA targets met, consent and legal notices present, language scope honest (what is shown is what exists).

### 8.2 Required elements per page

| Page | Must contain |
|---|---|
| Home | Promise + 2 actions · 4 brand cards · 3 pillars with proof strip · featured products · tracker teaser · network teaser |
| Brands | Brand tabs · uniform brand template · product cards with images · spec tables · downloads · CTA pair · "Où acheter" |
| SAV | 3-step form with consent · serial fallback · success with ticket and WhatsApp deep link · tracking by ticket number · nameplate help per category |
| Showrooms | Filters + list + map · geolocation · outlet cards (address, hours, phone, WhatsApp, directions, brands) · city pages |
| Professionals | Audience tabs · benefits per audience · real downloads · form with email and consent · references |
| Contact | Three routing paths · role-based emails · map and directions · photo · mentions légales link |
| All | Same header/footer · action bar (page-aware) · working legal links · unique title, description and og:image |

### 8.3 QA checklist

**Content & message**
- [ ] Positioning sentence identical in meta description, Home hero and footer
- [ ] Each term in 4.1 appears in exactly one form site-wide
- [ ] Facts sheet matches every figure on every page (150+, 24/48h, warranty, cities)
- [ ] Product names identical on Home, Brands, SAV and Network filters
- [ ] No English taglines or stray Arabic on French pages

**Images**
- [ ] One ratio per role; no stretched or inconsistent crops at 360, 768, 1280 px
- [ ] No text or logos baked into photos
- [ ] Card headings, specs and CTAs share baselines in each row
- [ ] Alt text present, descriptive, in the page language (decorative = empty)
- [ ] Unique 1200 × 630 og:image per page, absolute URL

**Mobile**
- [ ] No horizontal scroll on any page at 360 px
- [ ] Action bar clear of content and footer, safe-area respected
- [ ] Touch targets ≥ 48 px; chips and toggles wrap
- [ ] Forms: right keyboards, autofill, errors scroll into view, sticky continue button
- [ ] Hero static or controlled; no autoplay motion without a pause control

**Accessibility**
- [ ] Keyboard-only navigation works everywhere, including modals
- [ ] Icon-only links have accessible names
- [ ] Heading order H1 → H2 → H3 on all pages
- [ ] Contrast ≥ 4.5:1 for text, including over images
- [ ] Reduced-motion preference respected

**SEO**
- [ ] Titles ≤ 60 chars, descriptions ≤ 155; canonical correct; staging `noindex`
- [ ] JSON-LD validates (Organization, LocalBusiness, Product)
- [ ] Sitemap, robots, 404 and redirects in place
- [ ] One indexable page per city / major outlet

**Performance**
- [ ] LCP < 2.5 s, CLS < 0.1, INP < 200 ms on mobile (field or throttled lab)
- [ ] Home < 1.5 MB; each image ≤ 150 KB at displayed size
- [ ] Simulator and map scripts loaded only where used

**Legal & trust**
- [ ] Privacy policy, warranty terms and mentions légales published and linked
- [ ] Consent on SAV, B2B and Contact forms
- [ ] Safety, energy and performance claims backed by documents
- [ ] No fictional people, ratings or tickets presented as real

### 8.4 Owner decisions (2026-10-17) and their effect on the plan

These answers **supersede** any earlier recommendation in this file that conflicts with them (including the 4.1 vocabulary row for tracking, the 4.1 positioning draft, and findings S-04, S-06, H-15, N-04 and B-11).

| # | Question | Decision | Effect on the plan |
|---|---|---|---|
| 1 | Identity | Nerobel is the **group that owns and manages** the brands | Resolves H-04. New positioning draft: "Nerobel Group détient et gère quatre marques pour la maison : Theros, Pacific, Eurogas et Nerobel." Remove "distributeur", "conçoit et distribue", "sont distribués par Nerobel" (footer, all pages) and "Marque Constructeur". Replace "Disponible chez [logo Nerobel]" on brand blocks with "Une marque Nerobel Group". The group and the consumer-tech brand are both called "Nerobel": give the consumer brand a distinct label (naming to decide). |
| 2 | Pacific site | Not built yet; Pacific content and links stay **inside the Nerobel site** for now | Build a dedicated Pacific page on the Nerobel site using the brand template (data sheet, mounting schema, where to buy). Pacific's secondary CTA points to that page; no "Site officiel Pacific" in the footer until the site exists, then swap the target. Updates B-11, H-09, H-12. |
| 3 | Solar / thermodynamic | Not now | Remove "Solaire & Thermodynamique" (SAV step 1), "(Électrique / Solaire)" (SAV brand list) and "(Électrique & Solaire)" (Network brand filter). Closes S-06's solar part; the 50L vs 80L Theros check remains. |
| 4 | Real SLAs and warranty terms | Not built yet; future version | For v1 **remove every SLA figure and warranty duration**: 24/48h, "Réactif 48h", "24 à 48h ouvrables", B2B "sous 24h", "100% Garantie Constructeur Certifiée", "12 mois", "10 ans", "Garantie validée (0 DH)", "extension de garantie". Neutral wording instead, e.g. "Notre équipe vous répond rapidement" and "Garantie : conditions sur demande". Replace the Home stats strip with verified facts only. Also remove the "Conditions Générales de Garantie" footer link until that page exists. Reintroduce figures in v2 from the facts sheet. Closes B-03, H-06, S-03, H-16 for v1 by removal. |
| 5 | Network size | Unknown; needs research | Remove every "150+" claim (Home hero and stat, all meta descriptions mentioning it, Network, Contact). Interim wording with no figure: "Un réseau de showrooms et de points de vente au Maroc". **Research task:** build a verified outlet list (name, city, address, phone, hours, brands carried, confirmation date). Until then N-01 stays open. |
| 6 | Arabic / English | Hidden until ready | Hide the FR/AR/EN switch on all six pages, delete the stray Arabic string on the Pacific card, make sure `lang="fr"`. AR/EN and RTL (M-14) move to Phase 6. |
| 7 | Live technician tracking | Not operational | Remove: the Home "Suivi en direct" block (closes H-15), SAV tab 2 and the whole tracking view (demo tickets, timeline, **named technician card**), and the "temps réel / géolocalisation / télématique" claims. Keep the success screen: ticket number, WhatsApp follow-up, PDF receipt. Closes S-01, S-04 (no Nexenflow name left on screen) and the tracking part of S-09. Only one SAV term remains: "Demande SAV". |
| 8 | Partner retailers named | No agreement | Remove Bricoma, Marjane and any partner retailer name from the Établissement filter and from results. v1 locator lists only outlets the group can confirm; type labels stay generic. Closes N-04 by removal. |

**Blockers for v1 after these decisions**
1. Privacy policy + mentions légales published; consent on the three forms (H-10, S-02, C-04, P-02). The warranty-terms page is deferred, so its link is removed rather than fixed.
2. All demo and tracking content removed (decision 7).
3. All unverified figures removed (decisions 4 and 5).
4. Technical and safety claims on products still need sources: Eurogas ODS/safety figures, energy class, antibacterial %, simulator values (B-04, B-05, B-06).
5. Product names identical between Home and Brands (B-01).
6. Four PDFs uploaded or the block hidden (P-01).
7. New wording from decision 1 applied everywhere.

**New work created by the decisions:** a Pacific page on the Nerobel site · a short, verified facts sheet (only what is confirmed) · the outlet research list · a naming decision for the consumer-tech brand versus the group.

### 8.5 Not verified in this audit (needs a visual or device pass)

Rendered alignment of images and cards · hero slides and their mobile crops · locator list contents · icon-link accessible names · contrast ratios · action-bar behaviour with safe areas · RTL rendering · real performance numbers. Send screenshots (or a Lighthouse report) and the matching findings will be confirmed or corrected here.

## 9. Sprint plan (agent-executable)

This section turns the findings (sections 3–6) and the owner decisions (8.4) into tasks that an AI coding agent can pick up, implement and verify without further explanation. Humans keep the tasks marked 🔶.

### 9.1 Operating rules for agents

1. **Read first:** sections 3–6 (findings), 8.4 (owner decisions, which override everything else) and this section. Every task cites the finding IDs it closes.
2. **Minimal, targeted edits.** Change only what the task names. No full-file rewrites, no reformatting of untouched code, no renaming of existing CSS classes (add new classes next to old ones).
3. **One task = one branch/commit**, message format `[S0-04] Remove tracking and demo content`. Do not combine tasks.
4. **Never invent facts.** No new numbers, certificates, warranty terms, SLAs, names, partner names, addresses, legal identifiers or product specs. When a task needs a fact that is not in `content/facts.json` or this file, use the neutral wording given in the task and add the question to **9.7 Owner inputs**.
5. **French only.** All visible text in French with French typography (non-breaking space before `: ; ? !`, « guillemets »). Alt text in French. No English taglines, no Arabic.
6. **Verify before closing:** run `scripts/audit-check.sh` and `python3 scripts/audit_meta.py` (9.3), run the task's own acceptance checks, and paste the output in the commit/PR description.
7. **Update this file:** set the task's status in 9.2 (⬜ → 🟡 → ✅, or 🔶 if blocked) and add one line to the changelog (section 10).
8. **Stop and ask** when a task is 🔶 or when an instruction conflicts with the code. Do not guess; record the question in 9.7.
9. **Do not touch:** logo files, supplied product photos (replace only via the image pipeline, S2-03), and legal wording (agents draft, a human approves).
10. **Language of code/comments:** English for code and commit messages; French for user-visible copy.

Status legend: ⬜ to do · 🟡 in progress · ✅ done · 🔶 needs owner input

### 9.2 Task tracker

Size: **S** < 2 h · **M** 2–6 h · **L** 6–16 h (agent time including checks). Sprint lengths follow section 7: S0 ≈ 1 week, S1 ≈ 1 week, S2 ≈ 2 weeks, S3 ≈ 2 weeks, S4 ≈ 1–2 weeks.

| ID | Task | Closes | Size | Depends on | Status |
|---|---|---|---|---|---|
| **Sprint 0 — Blockers & cleanup** | | | | | |
| S0-01 | Repo recon + check scripts | — | S | — | ✅ |
| S0-02 | Staging protection, absolute og:image | H-01 | S | S0-01 | ✅ |
| S0-03 | Remove language switch and stray Arabic, `lang="fr"` | H-08 | S | S0-01 | ✅ |
| S0-04 | Remove tracking and demo content | H-15, S-01, S-04, S-09, S-11 | M | S0-01 | ✅ |
| S0-05 | Remove unverified figures and claims | H-06, H-16, B-03, S-03, N-01, C-06 | M | S0-01 | ✅ |
| S0-06 | SAV and locator scope cleanup (solar, partner retailers, SLA text) | S-06, N-04 | S | S0-01 | ⬜ |
| S0-07 | Positioning wording and footer (group owner) | H-04, B-13 | S | S0-01 | ⬜ |
| S0-08 | Legal pages + consent on forms 🔶 | H-10, S-02, C-04, P-02 | M | S0-01 | ⬜ |
| S0-09 | Hide the dead PDF block | P-01 | S | S0-01 | ⬜ |
| **Sprint 1 — Message & content** | | | | | |
| S1-01 | Facts file and contact normalisation | H-11 | S | S0-05 | ⬜ |
| S1-02 | Vocabulary pass | H-05, N-07, P-04, C-03, S-05 | M | S0-04 | ⬜ |
| S1-03 | Product catalogue and naming continuity 🔶 | B-01, B-02, B-07 | M | S0-05 | ⬜ |
| S1-04 | Home hero and entry-card copy | H-03 | S | S0-07, S1-02 | ⬜ |
| S1-05 | Uniform brand CTA pair, accessible icon links | H-09, H-12, B-11 | S | S1-02 | ⬜ |
| S1-06 | Pacific page inside the Nerobel site | B-11 | M | S1-03, S1-05 | ⬜ |
| S1-07 | Titles, descriptions, heading order | H-02, N-08, P-07 | S | S1-06 | ⬜ |
| S1-08 | Claims register and reword unverifiable product claims 🔶 | B-04, B-05, B-06 | M | S0-05 | ⬜ |
| **Sprint 2 — Design system, imagery, Home** | | | | | |
| S2-01 | Design tokens | 5.2 | M | S1-07 | ⬜ |
| S2-02 | Component classes | 5.3 | L | S2-01 | ⬜ |
| S2-03 | Image pipeline | H-13, B-08, B-09 | L | S2-01 | ⬜ |
| S2-04 | Home restructure (7 sections, static hero) | H-07, H-14, M-02, M-03 | L | S2-02, S2-03 | ⬜ |
| S2-05 | Card alignment and layout tests | 4.2 | M | S2-02 | ⬜ |
| S2-06 | Mobile action bar | M-01, S-11 | S | S2-01 | ⬜ |
| S2-07 | OG images per page | H-01 | M | S2-03 | ⬜ |
| **Sprint 3 — Page rebuilds & mobile** | | | | | |
| S3-01 | Brands page template and tabs | B-09, B-10, B-12, M-04, M-05 | L | S2-02, S2-03 | ⬜ |
| S3-02 | SAV form improvements | S-07, S-08, S-10, S-12, M-07 | L | S0-08, S2-02 | ⬜ |
| S3-03 | Form submission backends 🔶 | S-09 | M | S0-08 | ⬜ |
| S3-04 | Network page and outlets data 🔶 | N-01, N-05, N-06, M-08 | L | S2-02 | ⬜ |
| S3-05 | B2B page | P-02…P-07 | M | S0-08, S2-02 | ⬜ |
| S3-06 | Contact page | C-01, C-02, C-05 | M | S0-08, S2-02 | ⬜ |
| S3-07 | Mobile pass | M-06, M-09…M-15 | M | S3-01…S3-06 | ⬜ |
| **Sprint 4 — SEO, accessibility, performance, launch** | | | | | |
| S4-01 | Structured data | 4.3 | S | S3-04 | ⬜ |
| S4-02 | sitemap.xml, robots.txt, 404.html | 4.3 | S | S3-06 | ⬜ |
| S4-03 | Accessibility pass | S-12, 4.3 | M | S3-07 | ⬜ |
| S4-04 | Performance budgets | M-11 | M | S3-07 | ⬜ |
| S4-05 | Analytics events 🔶 | KPIs in 7 | M | S3-07 | ⬜ |
| S4-06 | Go-live gate | all P0 | S | S4-01…S4-05 | ⬜ |
| S4-07 | Final audit re-run and documentation | — | S | S4-06 | ⬜ |

**Dependency summary:** S0 tasks can run in parallel after S0-01 (S0-04 and S0-05 touch the same pages, so merge one before starting the other). S1 follows S0. S2-01 → S2-02/S2-03 → S2-04/S2-05. S3 page rebuilds can run in parallel after S2-02 and S2-03. S4 follows S3.

### 9.3 Assumptions and tooling

**Confirmed repository layout** (updated in S0-01): a static site served from the repository root on GitHub Pages: `index.html`, `brands.html`, `sav.html`, `network.html`, `b2b.html`, `contact.html`, `404.html`, `sitemap.xml`, `robots.txt`, `assets/img/*.{jpg,webp}`, `assets/icons/*.svg`, plus CSS under `css/` (`css/theme.css`, `css/main.css`, `css/sav.css`, `css/icons.css`) and JavaScript under `js/` (`js/main.js`, `js/sav.js`, `js/network.js`, `js/i18n.js`, `js/theme.js`, `js/animations.js`). See `docs/repo-map.md` for the full mapping.

**New files introduced by the plan:** `pacific.html`, `confidentialite.html`, `mentions-legales.html`, `404.html`, `sitemap.xml`, `robots.txt`, `content/facts.json`, `content/catalogue.json`, `content/outlets.json`, `content/claims-register.md`, `assets/css/tokens.css`, `assets/css/components.css`, `scripts/audit-check.sh`, `scripts/audit_meta.py`, `scripts/images.mjs`, `tests/layout.spec.js`, `docs/repo-map.md`.

**Banned strings for v1 (the content rules from 8.4, checkable with grep).** Each hit must be removed or replaced; the replacement is the neutral wording to use.

| Pattern | Why | Replace with |
|---|---|---|
| `150+` | Network size unknown | "Un réseau de showrooms et de points de vente au Maroc" |
| `24/48`, `24 à 48`, `sous 24h`, `Réactif 48h`, `48h`, `2 minutes` | No defined SLA | "Notre équipe vous répond rapidement." / "Déposez votre demande en ligne." |
| `100%`, `12 Mois`, `10 Ans`, `0 DH`, `extension de garantie`, `Garantie Constructeur`, `Qualité Constructeur`, `Conditions Générales de Garantie` | Warranty terms not defined | "Garantie : conditions sur demande." or remove |
| `Nexenflow`, `Karim`, `Benjelloun`, `NERO-2026-` (demo numbers), `Suivi en Direct`, `Télématique`, `LIVE APP` | Tracking not operational | remove |
| `Bricoma`, `Marjane` | No partner agreement | remove |
| `Solaire`, `Thermodynamique` | Range out of scope | remove |
| `distribués par`, `Distributeur et fabricant`, `conçoit et distribue`, `Marque Constructeur` | Identity is group owner | positioning line from S0-07 |
| `leader` | Unproven | remove or a verifiable fact |
| Arabic characters, `AR العربية`, language-switch markup | FR only for v1 | remove |
| `href="#"` | Dead links | real target or remove the element |
| `TODO`, `À COMPLÉTER` | Open placeholders | allowed during sprints, forbidden at the go-live gate (S4-06) |

**`scripts/audit-check.sh`** (created in S0-01; run from the repository root; exits 1 if a rule fails):

```bash
#!/usr/bin/env bash
# Usage: scripts/audit-check.sh [--gate]   (--gate also bans TODO / À COMPLÉTER)
export LC_ALL=C.UTF-8
cd "$(dirname "$0")/.." || exit 2
FILES=$(ls ./*.html assets/js/*.js 2>/dev/null)
fail=0
ban() {  # ban "<rule name>" "<PCRE pattern>"
  out=$(grep -nPi -- "$2" $FILES 2>/dev/null)
  if [ -n "$out" ]; then echo "✗ $1"; echo "$out" | head -20; fail=1; else echo "✓ $1"; fi
}
ban "no 150+ claim"          '150\+'
ban "no SLA figures"         '24/48|24 à 48|sous 24 ?h|réactif 48|\b48 ?h\b|2 minutes'
ban "no warranty figures"    '100 ?%|12 mois|10 ans|0 DH|extension de garantie|garantie constructeur|qualité constructeur|conditions générales de garantie'
ban "no tracking/demo"       'nexenflow|karim|benjelloun|NERO-2026-[0-9]|suivi en direct|télématique|live app'
ban "no partner retailers"   'bricoma|marjane'
ban "no solar range"         'solaire|thermodynamique'
ban "no distributor wording" 'distribués par|distributeur et fabricant|conçoit et distribue|marque constructeur'
ban "no leader claims"       'leader'
ban "no Arabic / lang switch" '[\x{0600}-\x{06FF}]|lang-switch'
ban "no dead # links"        'href="#"'
[ "${1:-}" = "--gate" ] && ban "no placeholders" 'TODO|À COMPLÉTER'
exit $fail
```

**`scripts/audit_meta.py`** (created in S0-01; structural checks on every `*.html` in the root):

```python
#!/usr/bin/env python3
"""Structural checks: lang, title/description length, og:image, img attributes,
heading order, single H1, links without an accessible name."""
import glob
from html.parser import HTMLParser

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.lang = None; self.title = ""; self._in_title = False
        self.meta = {}; self.imgs = []; self.headings = []; self.links = []; self._a = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html": self.lang = a.get("lang")
        elif tag == "title": self._in_title = True
        elif tag == "meta":
            key = a.get("name") or a.get("property")
            if key: self.meta[key] = a.get("content", "")
        elif tag == "img": self.imgs.append(a)
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"): self.headings.append(int(tag[1]))
        elif tag == "a": self._a = {"attrs": a, "text": ""}
    def handle_endtag(self, tag):
        if tag == "title": self._in_title = False
        elif tag == "a" and self._a is not None: self.links.append(self._a); self._a = None
    def handle_data(self, data):
        if self._in_title: self.title += data
        if self._a is not None: self._a["text"] += data

fails = 0
def bad(page, msg):
    global fails
    fails += 1
    print(f"✗ {page}: {msg}")

for f in sorted(glob.glob("*.html")):
    p = Page(); p.feed(open(f, encoding="utf-8").read())
    if p.lang != "fr": bad(f, f"html lang={p.lang!r}, expected 'fr'")
    t = p.title.strip()
    if not t or len(t) > 60: bad(f, f"title length {len(t)} (1-60)")
    d = p.meta.get("description", "")
    if not d or len(d) > 155: bad(f, f"description length {len(d)} (1-155)")
    if not p.meta.get("og:image", "").startswith("http"): bad(f, "og:image must be an absolute URL")
    for i in p.imgs:
        src = i.get("src", "?")
        if "alt" not in i: bad(f, f"img without alt: {src}")
        if not (i.get("width") and i.get("height")): bad(f, f"img without width/height: {src}")
    if p.headings.count(1) != 1: bad(f, f"{p.headings.count(1)} h1 (expected 1)")
    prev = 0
    for h in p.headings:
        if prev and h > prev + 1: bad(f, f"heading jump h{prev} -> h{h}")
        prev = h
    for l in p.links:
        if not l["text"].strip() and not l["attrs"].get("aria-label"):
            bad(f, f"link without text or aria-label: {l['attrs'].get('href')} (check if an img alt covers it)")

print("OK" if not fails else f"{fails} problem(s)")
raise SystemExit(1 if fails else 0)
```

**`tests/layout.spec.js`** (created in S2-05; Playwright; `npx playwright test`, with `webServer: { command: 'npx serve . -l 4173', url: 'http://localhost:4173' }` and `use.baseURL` set in `playwright.config.js`):

```js
const { test, expect } = require('@playwright/test');
const pages = ['index', 'brands', 'pacific', 'sav', 'network', 'b2b', 'contact'];
const widths = [360, 390, 430, 768, 1280];

for (const p of pages) for (const w of widths) {
  test(`${p} @${w}px has no horizontal scroll`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 800 });
    await page.goto(`/${p}.html`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('brand cards share the same heading baseline @1280', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/index.html');
  const tops = await page.$$eval('.brand-card h3', els => els.map(e => Math.round(e.getBoundingClientRect().top)));
  expect(tops.length).toBe(4);
  expect(new Set(tops).size).toBe(1);
});

test('mobile action bar targets are at least 48px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html');
  const sizes = await page.$$eval('.mobile-bar a', els => els.map(e => e.getBoundingClientRect().height));
  expect(sizes.length).toBeGreaterThan(0);
  sizes.forEach(h => expect(h).toBeGreaterThanOrEqual(48));
});
```

### 9.4 Sprint 0 — Blockers & cleanup (goal: nothing false, dead, fake or indexable remains)

**S0-01 — Repo recon + check scripts** · S · no dependency
- Steps: list the repository tree; write `docs/repo-map.md` (which file holds what: page files, CSS, JS for header/drawer, hero slider, simulators, SAV form, locator data, language switch, mobile action bar); create `scripts/audit-check.sh` and `scripts/audit_meta.py` from 9.3 (`chmod +x`); run both and save the baseline output in `docs/baseline-checks.txt`.
- Acceptance: `docs/repo-map.md` names the file for each of the 9 items above; both scripts run; the baseline shows failures (expected). Correct the "Assumed repository layout" paragraph in 9.3 if the real layout differs.

**S0-02 — Staging protection, absolute og:image** · S · closes H-01
- Files: the six HTML pages (the Pacific page gets the same later).
- Steps: add `<meta name="robots" content="noindex, nofollow">` in each `<head>` with the comment `<!-- STAGING: remove at go-live (S4-06) -->`; make `og:image` and `twitter:image` absolute, e.g. `https://s-7mza.github.io/nerobel/assets/img/nerobel-banner-appliances.jpg` (production URL is set at S4-06); leave `canonical` pointing to `https://nerobel.com/...`.
- Acceptance: every page has the robots meta; `og:image` starts with `https://`.

**S0-03 — Remove the language switch and stray Arabic, set `lang="fr"`** · S · closes H-08
- Steps: delete the FR / AR / EN switcher from the header and from the mobile drawer on all six pages, and any JavaScript that only serves it; delete the Arabic sentence on the Pacific card in `index.html` ("متوفر لدى NEROBEL") so it reads like the other cards for now (S0-07 and S1-05 refine the wording); set `<html lang="fr">`; keep `dir` unset.
- Acceptance: the Arabic and lang-switch rules in `audit-check.sh` pass; `audit_meta.py` shows no `lang` error; header still lays out correctly at 360 px (screenshot).

**S0-04 — Remove tracking and demo content** · M · closes H-15, S-01, S-04, S-09 (tracking part)
- `index.html`: delete the whole "Suivi & Prise en Charge" block (ticket input "Vérifier" and "Nouveau Dossier").
- `sav.html`: delete the second tab ("Suivi en Temps Réel"/"Suivi Nexenflow") and its panel (demo tickets `NERO-2026-9842/8921/1044`, status card, 5-step timeline, technician card "Karim Benjelloun", "Modifier le Créneau", "Imprimer"); delete the tab switcher so the page shows only the request form; delete the related JavaScript and CSS only if nothing else uses it.
- Keep: the three-step form, nameplate guide, map and camera modals, and the success screen. On the success screen replace the dead `href="#"` of "Suivre sur WhatsApp" with `https://wa.me/212787013201?text=` + the URL-encoded text "Bonjour Nerobel, ma demande SAV porte le numéro " + the generated ticket number; rename the button "Écrire sur WhatsApp".
- Remove the intro line "Suivi personnalisé en direct via WhatsApp" only if the owner does not confirm the line is staffed (🔶 add to 9.7); otherwise keep.
- Acceptance: the tracking/demo rule passes; the SAV page has no tabs; the success screen link is not `#`; the form still goes through steps 1 → 3 and the success state (manual test, record result).

**S0-05 — Remove unverified figures and claims** · M · closes H-06, H-16, B-03, S-03, N-01, C-06
- Work through every hit of the banned-strings table (9.3) in all six pages and the meta tags (`description`, `og:description`). Use the replacement wording from the table.
- Specific places: Home hero trust strip ("Garantie Constructeur", "150+ Showrooms au Maroc"); Home stats strip ("25+ Ans", "150+", "100%", "24/48h"); badges "Support SAV Réactif 48h" and "100% Pièces d'Origine"; "Qualité Constructeur Garantie"; "Déposez une réclamation en 2 minutes"; Brands: Theros "Garantie 12 Mois", fridge "Garantie moteur 10 Ans", Theros "Garantie Validée"; SAV: "sous 24 à 48 heures ouvrables", "Garantie Validée (0 DH…)", "extension de garantie", "Pièces d'origine… 100% certifiées"; Network meta ("plus de 150 revendeurs"); Contact ("plus de 150 showrooms partenaires"); B2B ("sous 24h ouvrables", "Réponse Commerciale sous 24h", "Garantie Constructeur Directe").
- Replace the Home stats strip (4 numbers) with three text-only items using only true statements: **"4 marques"** — "Theros, Pacific, Eurogas et Nerobel"; **"Showrooms et points de vente"** — "Un réseau au Maroc"; **"Service après-vente"** — "Demande en ligne ou par WhatsApp". The "25+ ans" figure stays out until the owner confirms it (🔶 9.7).
- Do not re-add any removed figure. Where a sentence loses its meaning, delete the whole sentence rather than patching it.
- Acceptance: SLA, warranty, 150+ and leader rules pass; the stats strip contains no digits except "4".

**S0-06 — SAV and locator scope cleanup** · S · closes S-06, N-04
- `sav.html`: remove the "Solaire & Thermodynamique" device card and "Solaire" in the brand option "Theros (Électrique / Solaire)" → "Theros (Électrique)"; the category grid becomes 3 cards (électrique, gaz, électroménager & télévision).
- `network.html` and the locator data/JS: remove "Grandes Surfaces (Bricoma / Marjane)" from the Établissement filter (leave "Showrooms Officiels Nerobel" and "Revendeurs agréés" only if each remaining outlet is confirmed; otherwise only "Showrooms Officiels Nerobel"); remove "(Électrique & Solaire)" from the brand filter; delete every outlet record whose name contains a partner retailer; keep the others but mark each `"confirmed": false` in the data until S3-04.
- If the list becomes empty, show "La liste de nos points de vente est en cours de mise à jour. Contactez-nous sur WhatsApp." with the WhatsApp link.
- Acceptance: solar and partner-retailer rules pass; filters still work (manual test of city, brand, type).

**S0-07 — Positioning wording and footer (Nerobel is the group that owns and manages the brands)** · S · closes H-04, B-13
- Positioning line (use verbatim): **« Nerobel Group détient et gère quatre marques pour la maison : Theros, Pacific, Eurogas et Nerobel. »**
- Footer, all pages: replace the sentence beginning "Nerobel Group est le leader marocain…" with the positioning line; replace the copyright line with "© 2026 Nerobel Group. Tous droits réservés." (remove "sont distribués par Nerobel"); remove the footer link "Conditions Générales de Garantie" now (the page does not exist; legal links are handled in S0-08).
- Home and Brands: remove "conçoit et distribue", "Groupe industriel et technologique d'avant-garde", "Marque Constructeur", "Marques Leaders", "L'Alliance des Marques Leaders au Maroc" (use H1 "Nos marques" on Brands), and replace each "Disponible chez [logo Nerobel]" (and the Pacific equivalent) with the text "Une marque Nerobel Group".
- Meta descriptions: remove "Distributeur et fabricant des marques leaders"; final meta copy is set in S1-07.
- Acceptance: distributor and leader rules pass; the positioning line appears in the footer of all pages.

**S0-08 — Legal pages and consent on forms** · M · 🔶 (human legal review) · closes H-10, S-02, C-04, P-02 (consent part)
- Create `mentions-legales.html` and `confidentialite.html` by copying the structure of `contact.html` (same header, footer, action bar; remove the form). Draft text sections only; never invent legal data. Mark every missing fact exactly as `[À COMPLÉTER PAR LE CLIENT : raison sociale]`, `[… : RC]`, `[… : ICE]`, `[… : siège social]`, `[… : directeur de la publication]`, `[… : hébergeur]`.
- `mentions-legales.html` sections: éditeur du site, directeur de la publication, hébergeur, contact (use the address, standard, WhatsApp and `contact@nerobel.com` already on the Contact page), propriété intellectuelle (brands Theros, Pacific, Eurogas, Nerobel).
- `confidentialite.html` sections: données collectées par formulaire (SAV: nom, téléphone, ville, adresse, position GPS facultative, photos, numéro de série; B2B: société, responsable, téléphone, email, ville; Contact: nom, téléphone, email, message), finalité (traiter la demande), base légale (consentement), durée de conservation `[À COMPLÉTER]`, destinataires `[À COMPLÉTER]`, droits d'accès / rectification / opposition and how to exercise them, référence à la loi marocaine 09-08 et à la CNDP (marked "à valider par le conseil juridique").
- Footer, all pages: "Politique de confidentialité" → `confidentialite.html`; add "Mentions légales" → `mentions-legales.html`.
- Consent checkbox, required, in the SAV form (step 2, above the "Continuer" button), the B2B form and the Contact form: label « J'accepte que mes données soient utilisées pour traiter ma demande. Voir la <a href="confidentialite.html">politique de confidentialité</a>. » Error text « Veuillez accepter pour envoyer votre demande. » The form must not submit without it; use the existing validation style.
- Acceptance: no `href="#"` in footers; the three forms block submission without consent (manual test); the placeholder markers exist and are listed in 9.7 (they must be gone at S4-06).

**S0-09 — Hide the dead PDF block** · S · closes P-01
- `b2b.html`: remove the "Espace Téléchargement pour Artisans & Architectes" block (four cards with `href="#"`), leaving an HTML comment `<!-- P-01: re-add download cards when PDFs exist in assets/docs/ (S3-05) -->`. Also remove "Fiches de sécurité incendie…" style promises from the first value card only if they refer to downloadable documents.
- Acceptance: no `href="#"` left on `b2b.html`.

### 9.5 Sprint 1 — Message & content foundation (goal: one wording and one source of truth for every fact)

**S1-01 — Facts file and contact normalisation** · S · closes H-11
- Create `content/facts.json` with confirmed facts only; contact values are taken from the live site:
```json
{
  "group": "Nerobel Group",
  "positioning": "Nerobel Group détient et gère quatre marques pour la maison : Theros, Pacific, Eurogas et Nerobel.",
  "brands": [
    {"id": "theros", "name": "Theros", "site": "https://theros.ma/"},
    {"id": "pacific", "name": "Pacific", "site": null, "page": "pacific.html"},
    {"id": "eurogas", "name": "Eurogas", "site": "https://eurogas.ma/"},
    {"id": "nerobel", "name": "Nerobel", "site": null, "page": "brands.html#nerobel"}
  ],
  "contact": {
    "address": "Angle Boulevard d'Anfa & Rue Mozart, Casablanca, Maroc",
    "switchboard": {"label": "Standard", "display": "+212 522 99 88 77", "tel": "+212522998877"},
    "whatsapp": {"label": "WhatsApp Nerobel", "display": "+212 787 013 201", "tel": "+212787013201"},
    "email": "contact@nerobel.com",
    "hours": "Lun - Sam : 08h30 - 19h30",
    "social": {"facebook": "https://www.facebook.com/nerobel", "linkedin": "https://www.linkedin.com/company/nerobel/"}
  }
}
```
- Normalise every phone display to the two formats above (replace `+212 (0) 522 99 88 77`); label each use ("Standard", "WhatsApp Nerobel"); the B2B line label "Ligne B2B" becomes "Standard".
- Acceptance: `grep -o 'tel:[+0-9]*' *.html | sort -u` returns only `tel:+212522998877` and `tel:+212787013201`; every `wa.me` link uses `212787013201`; no `(0)` in any phone display.

**S1-02 — Vocabulary pass** · M · closes H-05, N-07, P-04, C-03, S-05
- Apply this mapping everywhere (visible text, `title`/`aria-label`, meta tags, JavaScript strings):

| Old (examples found) | New |
|---|---|
| Support SAV (nav), Portail SAV Officiel Nerobel, Portail Réclamation SAV, SAV Express, Réclamation Express, Votre Réclamation Express, Déclarer une Réclamation, Nouvelle Réclamation, Nouveau Dossier | **SAV** (nav) · **Demande SAV** (page H1, buttons, header CTA, mobile bar) · "Faire une demande SAV" · "Nouvelle demande" |
| Showrooms (nav), Nos Showrooms & Distributeurs Agréés, Showrooms & Distributeurs, Trouver un Showroom Agréé, Trouver en Showroom, Trouver un Revendeur, Nos Showrooms au Maroc | **Où acheter** (nav, H1 of `network.html`, all buttons and footer) |
| Professionnels (nav), Espace Professionnels & B2B, Espace Installateurs & B2B, Espace Partenaires B2B, Devenir Partenaire Agréé, Découvrir le programme Pro, Rejoignez l'Alliance des Partenaires Nerobel | **Espace Pro** (nav, footer, buttons); B2B H1: "Espace Pro : devenez partenaire Nerobel" |
| Hotline WhatsApp Client, Concierge WhatsApp Direct, WhatsApp Support | **WhatsApp Nerobel** |
| ticket, dossier technique | "numéro de dossier" (success screen only) |
| double cuve, cadran digital | "double réservoir", "écran digital" |

- Final navigation order on every page: Groupe · Marques · SAV · Où acheter · Espace Pro · Contact; header CTA "Demande SAV"; mobile bar: Appeler · WhatsApp · Demande SAV · Où acheter.
- Add this line to `scripts/audit-check.sh`: `ban "one vocabulary" 'réclamation|SAV Express|Support SAV|Portail|Showrooms & Distributeurs|Trouver un|Concierge|Hotline'`.
- Acceptance: `audit-check.sh` passes the new rule; all six nav menus and mobile bars show the same labels in the same order.

**S1-03 — Product catalogue and naming continuity** · M · 🔶 (values to confirm) · closes B-01, B-02, B-07
- Create `content/catalogue.json` with one entry per product or range: `id, brand, range, name, capacity_or_size, finish, specs[], page_anchor, confirmed`. Naming rule: `{Marque} {Gamme} {capacité ou taille}`. Seed it from the site, with `"confirmed": false` for every value until the owner answers O-01:
  - Theros Pro-Slim (capacity to confirm; dimensions 46 × 85 × 25 cm, puissances 500 / 1 300 / 2 000 W, application Wi-Fi, réglage jusqu'à 75 °C as stated on Brands)
  - Pacific Horizon (80 L as shown in the mounting demo, to confirm)
  - Eurogas Master Flame (instantané, brûleur cuivre, allumage basse pression)
  - Nerobel: réfrigérateur multi-portes 520 L · climatiseur split Inverter R32 12 000 / 18 000 BTU · lave-linge 10,5 kg · Smart TV OLED 4K 65"
- Apply the catalogue names on Home (cards that today read "Pacific Horizon", "Eurogas Master Flame", "Black Titanium French-Door", "Vision Bezel-Less OLED") and on Brands so that **every product name on Home exists on Brands, spelled identically**. Where a name has no confirmed catalogue entry, use the descriptive name from Brands.
- Vocabulary fixes: finish wording "noir graphite brossé" (the more specific Brands wording) replaces "noir mat" / "acier noir mat anti-traces" / "Black Titanium"; Theros keeps "finition titane brossé" and loses "double réservoir titane"; the Home hero spec "écran tactile digital 55°C" becomes "écran tactile digital"; temperature reads "réglable jusqu'à 75 °C" for Theros and Pacific alike.
- Acceptance: a script (or manual list in the PR) shows that each product name found in `index.html` also appears in `brands.html` or `pacific.html`; the finish and spec vocabulary above appears consistently; unconfirmed values are listed in 9.7 (O-01).

**S1-04 — Home hero and entry-card copy** · S · closes H-03
- Hero (use verbatim, draft for owner approval): eyebrow « Nerobel Group » (replaces "Consumer Tech for Modern Homes"); H1 « Quatre marques pour le confort de la maison » ; sub-line = positioning line + « Chauffe-eaux, chaudières, électroménager et Smart TV. » ; primary button « Choisir une marque » → `#marques` ; secondary button « Demande SAV » → `sav.html`. Remove "Explorer les Collections" and "Accéder au Portail SAV".
- Show the WhatsApp number in the hero only as a labelled link "WhatsApp Nerobel".
- Entry cards: **Marques** — « Theros, Pacific, Eurogas et l'électroménager Nerobel. » button « Voir les marques » · **SAV** — « Déposez votre demande en ligne pour votre appareil Theros, Pacific, Eurogas ou Nerobel. » button « Faire une demande SAV » · **Espace Pro** — « Installateurs, revendeurs, promoteurs et bureaux d'études : ouvrez un compte professionnel. » button « Accéder à l'Espace Pro ».
- Acceptance: no English eyebrow or tagline remains; banned-strings and vocabulary rules pass.

**S1-05 — Uniform brand CTA pair and accessible icon links** · S · closes H-09, H-12, B-11
- Every brand card (Home and Brands page) ends with the same pair: primary « Détails » (Home → brand block on `brands.html`; Pacific → `pacific.html`) and secondary: Theros « Visiter theros.ma » (`https://theros.ma/`, `target="_blank" rel="noopener"`), Eurogas « Visiter eurogas.ma » (`https://eurogas.ma/`, same attributes), **Pacific « Voir la page Pacific » → `pacific.html`**, Nerobel « Où acheter » → `network.html`. On the Brands page the second link of each block becomes « Assistance SAV » → `sav.html?brand=<id>` (the form reads the parameter in S3-02).
- No Pacific "Site officiel" link anywhere (footer included) until a Pacific site exists; the footer "Nos marques" list links Pacific to `pacific.html`.
- Give every icon-only link (social icons, brand links) an `aria-label` in French (« Écrire sur WhatsApp », « Facebook », « LinkedIn »).
- Acceptance: all four cards show the same two-button structure; `audit_meta.py` reports no link without text or `aria-label`.

**S1-06 — Pacific page inside the Nerobel site** · M · closes B-11 (owner decision 2)
- Create `pacific.html` by copying `brands.html` (shared header, footer, action bar, tokens). Content, all taken from existing Pacific copy, minus claims removed in S0-05/S1-08:
  - eyebrow « Une marque Nerobel Group » · H1 « Pacific » · logo `assets/icons/pacific-logo.svg` · lead « Chauffe-eau électrique multi-position : montage horizontal ou vertical selon l'espace disponible. »
  - Three proof points: montage flexible (« Installation horizontale ou verticale, sans modifier la tuyauterie. ») · double réservoir · écran digital, température réglable jusqu'à 75 °C.
  - Move the "Simulateur Montage Multi-Position" widget here (reuse its markup and script; label « Démo interactive — valeurs indicatives »); remove it from `brands.html` and link « Voir la page Pacific » there.
  - Spec table from `content/catalogue.json` (only rows with values), CTA pair: « Où acheter » → `network.html?brand=pacific`, « Assistance SAV » → `sav.html?brand=pacific`.
  - Downloads: HTML comment only (`<!-- P-01: Pacific mounting schema PDF -->`).
- Add `pacific.html` to the footer brand list and to the brand tabs created in S3-01.
- Acceptance: one H1; `audit_meta.py` and `audit-check.sh` pass for the page; Home and Brands Pacific buttons open it; no link to an external Pacific site.

**S1-07 — Titles, descriptions, heading order** · S · closes H-02, N-08, P-07
- Set exactly these values (title ≤ 60, description ≤ 155 characters); `og:title` = title, `og:description` = description:

| Page | Title | Description |
|---|---|---|
| `index.html` | Nerobel Group · Theros, Pacific, Eurogas et Nerobel | Nerobel Group détient et gère Theros, Pacific, Eurogas et Nerobel : chauffe-eaux, chaudières, électroménager et Smart TV au Maroc. |
| `brands.html` | Nos marques · Theros, Pacific, Eurogas, Nerobel | Découvrez Theros (chauffe-eau connecté), Pacific (multi-position), Eurogas (gaz et chaudières) et l'électroménager Nerobel. |
| `pacific.html` | Pacific · Chauffe-eau multi-position \| Nerobel Group | Chauffe-eau électrique Pacific : montage horizontal ou vertical, double réservoir, écran digital. Où l'acheter et assistance SAV. |
| `sav.html` | Demande SAV · Nerobel Group | Déclarez une demande d'assistance pour votre appareil Theros, Pacific, Eurogas ou Nerobel en quelques étapes. |
| `network.html` | Où acheter · Showrooms Nerobel Group | Trouvez un showroom ou un point de vente des marques Theros, Pacific, Eurogas et Nerobel au Maroc. |
| `b2b.html` | Espace Pro · Partenaires \| Nerobel Group | Installateurs, revendeurs, promoteurs et bureaux d'études : demandez l'ouverture d'un compte professionnel Nerobel. |
| `contact.html` | Contact · Nerobel Group | Contactez Nerobel Group à Casablanca : standard, WhatsApp, commercial, presse et partenariats. |

- Fix heading order: `network.html` (H1 → H2 "Adresses et contacts" instead of H3) and `b2b.html` (value cards become H2 or sit under an H2 "Pourquoi devenir partenaire"); exactly one H1 per page.
- Acceptance: `audit_meta.py` reports no title, description or heading error on any page.

**S1-08 — Claims register and reword unverifiable product claims** · M · 🔶 (sources) · closes B-04, B-05, B-06
- Create `content/claims-register.md`: a table `claim | page | status (unverified/verified) | action taken | source needed`. List **every** technical, safety, energy and performance claim on the site.
- Apply these default rewrites now (an owner source may reinstate the original later):

| Claim found | Default rewrite |
|---|---|
| Eurogas "arrêt automatique en moins de 0.15 seconde" | « arrêt automatique de l'arrivée de gaz » (no figure) |
| Eurogas "Triple Sécurité ODS", "triple protection certifiée CE" | « Sécurité ODS » ; drop "triple" and "certifiée" |
| Eurogas "Basse Pression 0.15 Bar" | « Allumage basse pression » (no figure) |
| Pacific "standards européens les plus sévères (CE / EU)" | « Conformité CE » (no superlative; keep in register) |
| Washer "A+++ (-30%)" | remove the "Classe Énergie" spec row |
| Washer "antibactérien 99.9%" | « Programme vapeur » |
| Simulator outputs "~22 min" and "-28% énergie" | remove both outputs; keep the temperature and power selectors |
| Badge "LIVE APP TEST" | « Démo interactive — valeurs indicatives » |
| Badges in English ("FLEX 360°", "FROST-FREE", "T3 TROPICAL", "STEAM CARE", "120 HZ CINEMA") | keep in register; translate or remove in S2-02 |

- Acceptance: the register lists each claim; the rewrites above are applied; no new claim was added anywhere.

### 9.6 Sprint 2 — Design system, imagery, Home (goal: one visual system and a shorter Home)

**S2-01 — Design tokens** · M · closes 5.2 (tokens)
- First write `docs/current-styles.md` (colours, fonts, spacing, radii found in the existing CSS). Then create `assets/css/tokens.css` and load it **before** the other stylesheets on every page.
- Define CSS custom properties: neutral scale (`--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-border`); brand accents `--accent-theros`, `--accent-pacific`, `--accent-eurogas`, `--accent-nerobel` taken from the dominant fill colour of each logo SVG in `assets/icons/` (🔶 O-11 to confirm); semantic colours (`--color-success`, `--color-warning`, `--color-error`, `--color-info`); spacing `--space-1…9` = 4, 8, 12, 16, 24, 32, 48, 64, 96 px; radii `--radius-s: 8px`, `--radius-m: 16px`; two shadows; fluid type scale with `clamp()`, body 1 rem; breakpoints 360 / 768 / 1024 / 1280 documented in a comment (custom properties cannot be used in media queries).
- Replace existing hard-coded values by tokens **only where the value is identical**; do not restyle.
- Acceptance: tokens file loads on all pages; before/after screenshots of Home, Brands and SAV at 390 and 1280 px show no visual change.

**S2-02 — Component classes** · L · closes 5.3
- Create `assets/css/components.css` (loaded after tokens) with: `.brand-card`, `.product-card`, `.spec-list`, `.cta-pair`, `.proof-strip`, `.pillar-card`, `.section-head`, `.media-frame`, `.brand-tabs`, `.btn`, `.btn--primary`, `.btn--ghost`.
- Rules: `.media-frame { aspect-ratio: 4 / 3; overflow: hidden; }` with `img { width: 100%; height: 100%; object-fit: cover; }`; cards are grid items with equal row heights (`grid-template-rows: subgrid` where supported, otherwise fixed `min-height` per row); `.cta-pair` sits at the bottom of the card (`margin-top: auto`); buttons are at least 48 px high; spec lines stack label over value below 480 px.
- Brand card skeleton to follow:
```html
<article class="brand-card" data-brand="theros">
  <div class="media-frame"><img src="assets/img/theros-pro-slim-card-4x3.webp" alt="Chauffe-eau Theros Pro-Slim" width="1200" height="900" loading="lazy"></div>
  <img class="brand-card__logo" src="assets/icons/theros-logo.svg" alt="Theros" width="120" height="32">
  <h3>Theros · Chauffe-eau connecté</h3>
  <p>…</p>
  <p class="brand-card__tag">Une marque Nerobel Group</p>
  <div class="cta-pair">
    <a class="btn btn--primary" href="brands.html#theros">Détails</a>
    <a class="btn btn--ghost" href="https://theros.ma/" target="_blank" rel="noopener">Visiter theros.ma</a>
  </div>
</article>
```
- Apply the classes **next to** the existing ones on the Home brand blocks and the Brands product cards; do not delete existing classes. Translate English badges to French or remove them (list in the claims register).
- Acceptance: the four Home brand cards and the four Brands product cards use the classes; `tests/layout.spec.js` (S2-05) passes the baseline test.

**S2-03 — Image pipeline** · L · closes H-13, B-08, B-09
- Move current originals to `assets/img-src/` (keep them). Create `scripts/images.mjs` with `sharp`: for each source, generate WebP and AVIF at widths 480 / 800 / 1200 / 1600 into `assets/img/`, plus a 4:5 mobile crop (`position: 'attention'`) for the hero banner.
- Naming and mapping:

| Current file | New name | Note |
|---|---|---|
| `theros_brand_article.jpg` | `theros-pro-slim-card-4x3` | |
| `theros_brand_page_withlogo_crop.jpg` | `theros-pro-slim-page-4x3` | baked-in logo: flag for replacement (O-06) |
| `pacific-waterheater-poster.jpg` | `pacific-water-heater-card-4x3` | poster style: flag (O-06) |
| `eurogas-boiler.jpg` | `eurogas-boiler-card-4x3` | |
| `nerobel-tech-showcase.jpg` | `nerobel-tech-card-4x3` | |
| `nerobel-banner-appliances.jpg` | `nerobel-appliances-banner-16x9` | hero and banner only, no longer the og:image or a product card |

- Update every image reference to `<picture>`/`srcset`, with `width` and `height`, `loading="lazy"` except the hero (`fetchpriority="high"`), and a French descriptive alt (decorative images: `alt=""`). Product images for the four Nerobel product cards cannot be generated: until O-06 is answered those cards render without a media block (`.product-card--no-media`), not with an empty box.
- Acceptance: `audit_meta.py` shows no image error; no served image exceeds 150 KB at its display size; `ls assets/img` contains only the new names and `og/`.

**S2-04 — Home restructure** · L · closes H-07, H-14, M-02, M-03
- Final section order and ids: (1) `#hero` static, no slider, `<picture>` with a 4:5 mobile source; (2) `#marques` four `.brand-card`; (3) `#piliers` three `.pillar-card` — **Choisir** « Découvrez les quatre marques. » · **Où acheter** « Trouvez un showroom ou un point de vente. » · **Être accompagné** « Faites une demande SAV en ligne. » — followed by the `.proof-strip` from S0-05; (4) `#produits` three or four `.product-card` taken from `content/catalogue.json`, each with « Découvrir » to the brand block; (5) `#sav` short text + button « Demande SAV »; (6) `#ou-acheter` short text + button « Où acheter » (no map until S3-04); (7) footer.
- Delete the "Collections Signatures" section (five cards), the heritage section ("Plus de 25 Ans…" and its badges) and the "Réseau National" section; delete the slider markup, CSS and JavaScript if nothing else uses them.
- Acceptance: the page contains exactly these section ids in this order; at 390 × 844 the H1 and both hero buttons are inside the first viewport (Playwright `boundingBox` check); banned-strings rules pass; the Home is clearly shorter (record the page height at 390 px before/after in the PR).

**S2-05 — Card alignment and layout tests** · M
- Add `package.json` (dev dependency `@playwright/test`), `playwright.config.js` (`webServer` serving the repository root, `baseURL`) and `tests/layout.spec.js` from 9.3. Fix any failure with CSS (grid/subgrid, equal rows), not by editing the test.
- Add screenshot baselines for `index` and `brands` at 390 and 1280 px under `tests/__screenshots__/`.
- Acceptance: `npx playwright test` passes for no-horizontal-scroll on all pages and widths and for the brand-card baseline test.

**S2-06 — Mobile action bar** · S · closes M-01, S-11
- Class `.mobile-bar`, visible only below 1024 px. CSS: `padding-bottom: calc(env(safe-area-inset-bottom) + 8px)`; `body { padding-bottom: calc(72px + env(safe-area-inset-bottom)) }` inside the same media query; each link `min-height: 48px; flex: 1; min-width: 0`, label at least 12 px with ellipsis; `aria-label` on each link.
- Items on every page: Appeler · WhatsApp · Demande SAV · Où acheter. On `sav.html` the third item becomes « Contact » → `contact.html`.
- Acceptance: the 48 px test in `tests/layout.spec.js` passes; a screenshot at 390 × 844 shows the last footer line is not covered by the bar.

**S2-07 — OG images per page** · M · closes H-01
- Create `scripts/og.mjs` (sharp + SVG overlay) that renders a 1200 × 630 JPG per page into `assets/img/og/{page}.jpg`: dark background from the tokens, the logo SVG, the page title from S1-07. Update `og:image` and `twitter:image` on each page to its own absolute URL.
- Acceptance: seven files of 1200 × 630 px, each under 200 KB; no two pages share an `og:image`.

### 9.7 Owner inputs and open questions

Agents must not guess any of these. Each row says what to do if no answer arrives.

| ID | Needed from the owner | Needed by | Default if unanswered |
|---|---|---|---|
| O-01 | Confirm product names, capacities, finishes and spec values (catalogue) | S1-03 | Use descriptive Brands names; keep `confirmed: false` |
| O-02 | Confirm "25+ ans d'expérience" and "pièces d'origine" | S0-05 | Leave both out |
| O-03 | Is the WhatsApp line staffed for SAV follow-up? | S0-04 | Remove the "suivi personnalisé" sentence |
| O-04 | Legal identity: raison sociale, RC, ICE, siège, directeur de la publication, hébergeur, data retention, recipients | S0-08 (before S4-06) | Placeholders stay; go-live gate fails |
| O-05 | Legal review of mentions légales and privacy text (law 09-08 / CNDP) | before S4-06 | Go-live gate fails |
| O-06 | Photos: logo-free product shots on one background (Theros, Pacific, Eurogas, four Nerobel products), showroom and façade, installation photos | S2-03, S3 | Text-only product cards; no showroom photo |
| O-07 | PDFs: Theros Pro-Slim sheet, Pacific mounting schema, Eurogas certificates, Nerobel catalogue | S3-05 | Download block stays hidden |
| O-08 | Outlet list: name, city, address, phone, hours, brands carried, map link, confirmation date | S3-04 | Locator shows the "mise à jour" message |
| O-09 | Where form submissions go (address, service or SAV-system API), who receives them, spam protection | S3-03 | WhatsApp/mailto fallback (see S3-03) |
| O-10 | Source documents for claims in the register (ODS, CE, energy label, tests) | S1-08 | Default rewrites stay |
| O-11 | Brand colours and fonts | S2-01 | Colours extracted from the logos |
| O-12 | A label for the consumer-tech brand that differs from the group name | S1-04, S2-04 | Keep "Nerobel" and the tag "Une marque Nerobel Group" |
| O-13 | Production domain, hosting and DNS | S4-06 | Stay on staging with `noindex` |
| O-14 | Analytics provider and cookie/consent approach | S4-05 | Event dispatcher only, no provider |
| O-15 | B2B promises: guaranteed stock, logistics centres, Nerobel Academy — confirm or drop | S3-05 | Remove the three cards |
| O-16 | Role-based email addresses (SAV, press, partnerships) if they exist | S3-06 | Keep `contact@nerobel.com` only |

### 9.8 Sprint 3 — Page rebuilds and mobile (goal: every page follows the system and works on a phone)

**S3-01 — Brands page template and tabs** · L · closes B-09, B-10, B-12, M-04, M-05
- Add sticky `.brand-tabs` at the top: Theros (`#theros`) · Pacific (`pacific.html`) · Eurogas (`#eurogas`) · Nerobel (`#nerobel`); keyboard accessible, `aria-current` on the active tab.
- One template per block (Theros, Pacific summary, Eurogas, Nerobel): logo → H2 → lead → three proof points (`.spec-list`) → media → spec table → `.cta-pair`. **The DOM order is identical for every block**; the desktop zig-zag is done only with CSS `order` at ≥ 1024 px, so the phone order is always logo → H2 → copy → media.
- Pacific block becomes a short summary with « Voir la page Pacific » (the simulator now lives on `pacific.html`, S1-06). The Theros simulator stays: label « Démo interactive — valeurs indicatives », controls as a keyboard-operable `role="radiogroup"` that wraps at 360 px with 48 px targets, result in an `aria-live="polite"` region, animations only under `prefers-reduced-motion: no-preference`.
- Eurogas: replace the article card by one text link under the CTA pair (« Lire : chauffe-eau à gaz, comment ça fonctionne ? » → the existing eurogas.ma article URL).
- Nerobel: four `.product-card` (from the catalogue) with spec lists and one button « Où acheter » → `network.html?brand=nerobel`; English badges removed or translated per S1-08.
- Download placeholders as HTML comments only. If the Theros image still carries a baked-in logo (O-06 open), keep the HTML logo and leave the image flagged.
- Acceptance: Playwright at 390 px shows, for every `.brand-block`, the H2 above the media; no horizontal scroll at 360–1280 px; tabs reachable with Tab and activated with Enter; banned-strings and vocabulary rules pass.

**S3-02 — SAV form improvements** · L · closes S-07, S-08, S-10, S-12, M-07
1. **Brand parameter.** Read `?brand=theros|pacific|eurogas|nerobel`: preselect the brand, derive the category (Theros and Pacific → chauffe-eau électrique, Eurogas → chauffe-eau à gaz, Nerobel → électroménager & télévision), start at step 2, and show a « Changer d'appareil » link.
2. **No duplicate question.** The brand list is filtered by the chosen category (électrique: Theros, Pacific; gaz: Eurogas; électroménager: Nerobel); when only one brand remains it is preselected and shown read-only.
3. **Serial number.** Add the checkbox « Je ne trouve pas mon numéro de série »; when ticked the field is optional and the invoice/photo field gets the hint « Ajoutez une photo de l'appareil ou de la facture ». The "Format invalide" error only appears when the field is filled.
4. **Cities.** Create `content/cities.json` (seed: the eight cities currently in the form, plus « Autre ville » as free text) and use it for the SAV select and the locator filter (S3-04); a single source.
5. **Input attributes.** Name `autocomplete="name"`; phone `type="tel" inputmode="tel" autocomplete="tel-national"` (keep the +212 prefix as a separate non-editable element); address `autocomplete="street-address"`; serial `autocapitalize="characters" autocomplete="off"`.
6. **Photos.** Compress images client-side before sending (canvas, longest side 1 600 px, JPEG quality 0.8); PDFs unchanged; keep the "10 Mo" message.
7. **Errors.** On a failed step validation show an error summary (`role="alert"`) with links to the fields, set `aria-invalid` and `aria-describedby` on each field, and move focus to the first invalid field.
8. **Sticky continue button** on mobile: `position: sticky; bottom: calc(72px + env(safe-area-inset-bottom))` so it sits above the action bar and the keyboard.
9. **GPS and map.** If permission is denied show « Position non autorisée. Saisissez votre adresse. »; the address field is always available; the map modal is full-screen on phones, has a labelled close button, closes with Escape, traps focus and returns focus to its trigger.
10. **Camera.** If `getUserMedia` is missing or denied, hide « Prendre une photo en direct » and use a file input with `capture="environment"`.
11. **Nameplate help per category.** Water heaters keep the existing text and `serial-guide.svg`; appliances show « Le numéro de série figure généralement sur l'étiquette de l'appareil ou sur votre facture. » Category photos wait for O-06.
12. **Draft.** Keep the entered text fields (not photos) in `sessionStorage` so a reload does not lose them; clear on success.
13. **Success screen:** keep the PDF receipt button only if the receipt works; otherwise remove it. Ticket numbers follow S3-03.
- Acceptance: Playwright tests — `sav.html?brand=eurogas` starts on step 2 with Eurogas selected; submission is blocked without consent; ticking "Je ne trouve pas mon numéro de série" makes the serial optional; a failed validation moves focus to the first invalid field; no console errors; no horizontal scroll at 360 px.

**S3-03 — Form submission backends** · M · 🔶 O-09 · closes S-09 (fake success)
- Step 1: document in `docs/forms.md` how each of the three forms submits today (endpoint or JavaScript only).
- If there is no real endpoint, **no form may show a success screen as if the message was sent.** Default until O-09 is answered: on submit, build a prefilled WhatsApp message with the form fields (never photos) and open `https://wa.me/212787013201?text=…` (SAV and Contact) or a `mailto:contact@nerobel.com` (B2B), and display « Votre message est prêt : appuyez sur Envoyer pour finaliser. » Remove the fabricated ticket number (`NERO-2026-` plus random digits); show a « Numéro de dossier » only when a server returns one.
- Once O-09 is answered: `fetch` POST of `{form, fields, consent: true, timestamp}` to the endpoint; hidden honeypot field plus a minimum fill time as spam protection; disable the button while sending; success state only on a 2xx response; error state « L'envoi a échoué. Réessayez ou écrivez-nous sur WhatsApp. ».
- Acceptance: `docs/forms.md` exists; a Playwright test with `route.abort()` on the endpoint shows the error state and no success; no code path shows success without a send or a WhatsApp/mail hand-off.

**S3-04 — Network page and outlets data** · L · 🔶 O-08 · closes N-01, N-05, N-06, M-08
- Create `content/outlets.json` and make the locator read only entries with `"confirmed": true`:
```json
[{
  "id": "casablanca-siege", "name": "Siège Social & Showroom Principal", "type": "showroom",
  "city": "Casablanca", "address": "Angle Boulevard d'Anfa & Rue Mozart, Casablanca, Maroc",
  "phone": "+212522998877", "whatsapp": "+212787013201", "hours": "Lun - Sam : 08h30 - 19h30",
  "brands": null, "maps_url": null, "lat": null, "lng": null,
  "confirmed": true, "confirmed_on": "2026-10-17"
}]
```
(`"brands": null` means "not specified": the outlet appears under every brand filter.) Add other outlets only from O-08.
- UX: list first on phones with a « Carte » / « Liste » toggle; city, brand and type filters (a bottom-sheet `<dialog>` on phones); « Autour de moi » using `navigator.geolocation` (distance by haversine when `lat`/`lng` exist, nothing stored, message on denial); query parameters `?brand=` and `?city=` preselect filters. Use the **existing** map component; do not add a new third-party map provider (list only, with `<!-- map deferred -->`, if there is none).
- Outlet card: name, type, address, hours, brands carried, buttons « Appeler » (`tel:`), « WhatsApp », « Itinéraire » (`https://www.google.com/maps/dir/?api=1&destination=` + URL-encoded address).
- City pages: `scripts/build-city-pages.mjs` writes `ou-acheter/{ville}.html` for each city with at least one confirmed outlet: H1 « Où acheter à {Ville} », static outlet cards and one `LocalBusiness` JSON-LD per outlet (name, address, telephone; opening hours only if known). Extend the glob in `audit_meta.py` to `ou-acheter/*.html`.
- Acceptance: with the seed file the page shows the headquarters showroom and no unconfirmed outlet; filters and query parameters work; at 390 px the list shows first and the toggle shows the map; generated pages pass `audit_meta.py`; no "150+" anywhere.

**S3-05 — B2B page** · M · closes P-02…P-07
- Replace the three value cards ("Certifications & Normes CE", "Disponibilité Immédiate", "Nerobel Academy") by a « Pour qui ? » row of four cards, each with one factual sentence and a button « Demander un compte » → `#demande?type=<id>`: **Installateurs et artisans plombiers** — « Équipez vos chantiers avec les marques Theros, Pacific et Eurogas. » · **Revendeurs** — « Proposez les marques du groupe à vos clients. » · **Promoteurs et constructeurs** — « Équipez vos programmes immobiliers. » · **Bureaux d'études et architectes** — « Contactez-nous pour vos besoins techniques. » (Stock, logistics and academy promises return only if O-15 confirms them.)
- Form fields: Raison sociale\*, ICE / RC (optional), Nom du responsable\*, Téléphone\*, **Email\*** (new), Ville\*, Type d'activité\* (the four options; preselected from `?type=`), Marques d'intérêt (checkboxes), Message / volume estimé, **consent\*** (S0-08). Remove "sous 24h", "Réponse Commerciale sous 24h", "Garantie Constructeur Directe"; relabel the line "Standard".
- Downloads: when O-07 files exist, add them to `assets/docs/` as `theros-pro-slim-fiche.pdf`, `pacific-schema-montage.pdf`, `eurogas-certificats.pdf`, `nerobel-catalogue-2026.pdf`; build the cards with the **real** file size (`ls -l`), `download` attribute and `data-evt="pdf_download"`; skip any card whose file is missing. Add to `audit-check.sh`: every `href` ending in `.pdf` must exist on disk.
- Acceptance: the form blocks submission without email and consent; `?type=revendeur` preselects the activity; no banned-strings hit; all PDF links resolve (or the block is absent).

**S3-06 — Contact page** · M · closes C-01, C-02, C-05
- Add three path cards above the form: « Demande SAV » → `sav.html` · « Commercial » → `contact.html?dept=commercial` · « Presse et partenariats » → `contact.html?dept=presse`; the script preselects the department from `?dept=`; the footer "Presse & Partenariats" link uses the same URL.
- Department list: remove « Support Technique & SAV »; keep « Direction Commerciale & Ventes », « Partenariat Professionnel & Distribution » (with an inline note and link to `b2b.html#demande` when selected) and « Direction Générale & Presse ».
- Address block: add « Itinéraire » (Google Maps directions link built from `content/facts.json`; no iframe); a facade/showroom photo slot as a commented `.media-frame` until O-06.
- Rename the email label to « Contact » (keep `contact@nerobel.com`; role-based addresses only if O-16 provides them). WhatsApp block: title « WhatsApp Nerobel », text « Pour vos questions et vos demandes SAV. » (drop "Réponse rapide"). Form promise: « Nous vous répondrons dans les meilleurs délais. » Replace the "plus de 150 showrooms" paragraph by « Besoin de trouver un point de vente ? » + button « Où acheter ».
- Acceptance: the SAV option is gone; `?dept=presse` preselects the department; the directions link opens Google Maps with the address; banned-strings and vocabulary rules pass.

**S3-07 — Mobile pass** · M · closes M-06, M-09…M-15
- Footer: below 768 px each column is a `<details>` accordion (summary at least 48 px high, closed by default); desktop shows them open.
- Header on phones: logo + menu button + « Demande SAV » only; the drawer holds the navigation; check 320 and 360 px.
- Replace `100vh` by `100dvh` (or `svh`) wherever it sizes a hero or drawer (`grep -rn "100vh" assets/css`).
- Hover: any rule that reveals content or controls on `:hover` is wrapped in `@media (hover: hover)` and has a `:focus-visible` equivalent.
- Wrap all animations in `@media (prefers-reduced-motion: no-preference)`.
- Take screenshots of every page at 360, 390, 768 and 1024 px into `docs/screens/` and fix what looks broken (nav collapse point, two-column cards on tablet).
- Acceptance: `npx playwright test` passes for all pages and widths; no `100vh` left on hero or drawer; screenshots are committed.

### 9.9 Sprint 4 — SEO, accessibility, performance, launch (goal: ready to publish)

**S4-01 — Structured data** · S · 4.3
- `index.html`: `Organization` JSON-LD (name « Nerobel Group », url, absolute logo URL, address, `contactPoint` for the standard and WhatsApp with `contactType: "customer service"`, `availableLanguage: "fr"`, `sameAs`: Facebook and LinkedIn) and four `Brand` objects (name, url where a brand site exists). Values come from `content/facts.json`. City pages carry `LocalBusiness` (S3-04). **Do not** add `Product` offers, prices or ratings: none are published.
- Acceptance: every JSON-LD block parses; `scripts/check_jsonld.py` (write it: parse blocks, compare phone, address and email with `content/facts.json`) passes.

**S4-02 — sitemap.xml, robots.txt, 404.html** · S · 4.3
- `sitemap.xml` lists every page (and city page) with absolute URLs on the staging base for now; `robots.txt` contains `Disallow: /` during staging (the production version is kept as a commented block, to be switched in S4-06); `404.html` uses the shared shell, a French message and links to Accueil, Où acheter and Demande SAV.
- Acceptance: files exist; `404.html` passes `audit_meta.py`; every sitemap URL maps to a file.

**S4-03 — Accessibility pass** · M · closes S-12
- Run axe (`npx @axe-core/cli <url>`) or pa11y on every page at 390 and 1280 px; fix every *serious* and *critical* issue.
- Required: skip link as first focusable element (« Aller au contenu ») targeting `<main id="main">`; landmarks (`header`, `nav` with `aria-label`, `main`, `footer`); visible `:focus-visible` styles; text contrast at least 4.5:1; labels, `aria-describedby`, `aria-invalid` and an error summary on all forms; modals as `<dialog>` or `role="dialog" aria-modal="true"` with focus trap, Escape and focus return; simulators operable by keyboard with `aria-live` results; `prefers-reduced-motion` respected.
- Acceptance: axe reports 0 serious/critical on all pages; a recorded keyboard-only walk-through of the SAV form (Tab order, errors, modals) is added to `docs/a11y-notes.md`.

**S4-04 — Performance budgets** · M · closes M-11
- Steps: preload the hero image (`<link rel="preload" as="image" imagesrcset=…>`); `font-display: swap` and `preconnect` for any font host; `defer` all scripts; load simulator code only on `brands.html` and `pacific.html`, locator code only on `network.html`, SAV code only on `sav.html`; remove unused CSS and JavaScript.
- Add `lighthouserc.json` and run `npx lhci autorun` (run it after the noindex removal in S4-06, or add `"is-crawlable": "off"` while on staging):
```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npx serve . -l 4173",
      "url": [
        "http://localhost:4173/index.html",
        "http://localhost:4173/brands.html",
        "http://localhost:4173/sav.html",
        "http://localhost:4173/network.html"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.85}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:seo": ["error", {"minScore": 0.95}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-byte-weight": ["error", {"maxNumericValue": 1500000}]
      }
    }
  }
}
```
- Acceptance: the assertions pass on the four pages (mobile profile, default).

**S4-05 — Analytics events** · M · 🔶 O-14 · KPIs in section 7
- Create `assets/js/track.js` exposing `window.nerobelTrack(name, params)`. With no provider configured it does nothing (and logs to the console when the URL has `?debug=1`). Wire clicks with `data-evt` attributes and one delegated listener. Events: `click_call`, `click_whatsapp`, `click_where_to_buy`, `sav_start`, `sav_step` (`step`), `sav_submit`, `sav_error`, `locator_search` (`city`, `brand`, `type`), `outlet_directions`, `outlet_call`, `b2b_submit`, `contact_submit`, `pdf_download` (`file`).
- No personal data in any parameter (no names, phones, emails, addresses, free text). If O-14 names a provider, load it only after the consent approach agreed with the owner.
- Acceptance: a Playwright test reads `window.__events` (filled by the dispatcher in debug mode) and sees each event once per action; no parameter key is named `name`, `phone`, `email`, `address` or `message`.

**S4-06 — Go-live gate** · S · after O-04, O-05, O-13
- Replace the staging base URL by `https://nerobel.com/` (or the O-13 domain) in `canonical`, `og:url`, `og:image`, `twitter:image`, `sitemap.xml`, JSON-LD and `robots.txt`; remove the `noindex` meta and the "STAGING" comments; switch `robots.txt` to the production block with the sitemap line.
- Run, all must exit 0: `scripts/audit-check.sh --gate`, `python3 scripts/audit_meta.py`, `npx playwright test`, `npx lhci autorun`, axe on every page, `npx linkinator http://localhost:4173 --recurse` (zero broken links).
- Humans tick the sign-off table in `docs/go-live-signoff.md`: copy and positioning (owner), legal pages and consent (legal), product claims (brand and technical managers), outlet list (sales), photos (marketing).
- Acceptance: no `À COMPLÉTER`, `TODO` or `href="#"` left; every command above passes; the sign-off table is complete; tag the release `v1.0`.

**S4-07 — Final audit re-run and documentation** · S
- Write `docs/audit-closure.md`: a table `finding ID | closed / deferred / open | evidence (commit, test or screenshot)` that contains **every** ID from sections 3 and 6 (H-, B-, S-, N-, P-, C-, M-). Deferred items point to 9.11. Update the scorecard and the executive summary of this file, set the status line, and add a changelog entry.
- Acceptance: every finding ID appears in `docs/audit-closure.md`; no finding is silently dropped.

### 9.10 Definition of done and sprint exit criteria

**A task is done when:** the change is on its own commit; `scripts/audit-check.sh` and `python3 scripts/audit_meta.py` give no new failure; the task's acceptance checks pass and their output is in the commit/PR; the layout renders without horizontal scroll at 360 px; no new fact, number or claim was introduced; the status in 9.2 and the changelog are updated.

| Sprint | Exit criteria | Demo |
|---|---|---|
| S0 | `audit-check.sh` passes all rules except the vocabulary one (added in S1-02); staging is `noindex`; no demo/tracking content, no dead `#` links, legal pages exist with placeholders, consent on the three forms | Walk Home → Brands → SAV → Contact on a phone; show the grep report |
| S1 | One vocabulary and one set of facts; Pacific page live; every Home product name exists on Brands; titles and descriptions final; claims register complete | Compare Home and Brands side by side; show the vocabulary rule passing |
| S2 | Tokens and components in use; images converted and named; Home has the 7 sections; layout tests green; OG images generated | Home on 390 and 1280 px, Playwright report, share preview of two pages |
| S3 | Brands, SAV, Network, B2B and Contact rebuilt; forms never fake success; mobile pass screenshots committed | Full SAV request on a phone (GPS denied and granted), locator with `?brand=pacific` |
| S4 | Structured data, sitemap/robots/404, axe clean, Lighthouse thresholds met, analytics events firing, go-live checklist signed | Lighthouse and axe reports; the sign-off table |

### 9.11 Backlog for v2 (deferred by the owner decisions)

Arabic and English versions with RTL support · defined SLAs and warranty terms with a warranty page · live SAV tracking and integration with the group's SAV system · migration of the Pacific page to its own brand site · solar and thermodynamic range · more city pages and a verified full outlet list · customer reviews and installation case studies · Nerobel Academy programme page · professional portal with price lists · editorial content (installation and maintenance tips) for search · consent-management banner if a cookie-setting analytics provider is chosen · image CDN.

## 10. Changelog

| Date | Change |
|---|---|
| 2026-10-17 | File created; method, inventory and Home audit added. |
| 2026-10-17 | Brands, SAV, Showrooms, Professionals and Contact audits added (pages 2–6). |
| 2026-10-17 | Cross-site diagnosis added: message coherence matrix, image inventory and alignment spec, SEO / accessibility / language / trust. |
| 2026-10-17 | Design review, mobile diagnosis and test matrix added. |
| 2026-10-17 | Improvement plan, KPIs, ideal-version spec, QA checklist and open decisions added; executive summary and scorecard added; status set to v1 complete. |
| 2026-10-17 | Owner decisions 1–8 recorded in 8.4 with their effect on findings and roadmap; roadmap note added. The executive summary reflects the audit before these decisions. |
| 2026-10-17 | [S0-01] Completed repo recon (`docs/repo-map.md`), created `scripts/audit-check.sh` and `scripts/audit_meta.py`, and recorded baseline check output in `docs/baseline-checks.txt`. |
| 2026-10-17 | [S0-02] Added staging `noindex, nofollow` robots meta and absolute `og:image` / `twitter:image` URLs across all pages. |
| 2026-10-17 | [S0-03] Removed FR/AR/EN language switcher, `js/i18n.js`, and stray Arabic text on Pacific card; ensured `<html lang="fr">` with `dir` unset. |
| 2026-10-17 | [S0-04] Removed Home SAV quick tracker, SAV tab switcher and Nexenflow tracking panel (`#panel-tracker`), updated success WhatsApp CTA, and replaced `LIVE APP TEST` badge and demo person placeholder. |
| 2026-10-17 | [S0-05] Removed all unverified SLA, warranty, and 150+ showroom claims across pages and scripts; replaced Home metrics strip with 3 verified statements and removed warranty-terms footer links. |



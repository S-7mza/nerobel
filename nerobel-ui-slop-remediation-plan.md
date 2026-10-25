# Nerobel Group (`nerobel.com`) — UI/UX & Slop Remediation Plan

**Target Route:** `https://nerobel.com/` (Homepage DOM & Shared Layout Shell)  
**Baseline Slop Score:** `30` $\rightarrow$ **Target Slop Score:** `< 5`  
**Prioritization Model:** $\text{Criticality} = (\text{UX} \times 3) + (\text{A11Y} \times 3) + (\text{Trust} \times 2) + (\text{Slop Weight} \times 2)$

---

## Executive Sprint Roadmap

| Sprint | Focus Area | Target Findings | Score Reduction | Est. Effort |
| :--- | :--- | :--- | :---: | :---: |
| **Sprint 1 (P0 / P1)** | Broken Routing, WCAG AA Compliance & Trust Blockers | `F-07`, `F-01`, `F-06` | `-8 pts` | 1–2 Days |
| **Sprint 2 (P1)** | Actionable CTAs & Link Disambiguation | `F-02`, `F-03` | `-6 pts` | 1 Day |
| **Sprint 3 (P2 / P3)** | Taxonomy Standardization, Brand Architecture & Copy Cleanup | `F-05`, `F-08`, `F-04` | `-11 pts` | 1–2 Days |

---

## Sprint 1: Critical Routing, Accessibility & Trust Blockers (P0 & P1)

**Goal:** Eliminate dead-end product routing, bring icon-only controls into WCAG 2.1 AA compliance, and replace evasive warranty copy with concrete buyer assurance.

### 1. [F-07 | Score: 35/46 | `CODE-03`] Fix Product Card Routing Collision
* **Component / Section:** `#Les Collections Signatures de l'Habitat Moderne` (Cards 3 & 4) + Hero Carousel Slide `02/04`.
* **Root Cause:** The `Smart TV OLED 4K 65"` and `Réfrigérateur Multi-Portes 520 L` cards reuse the `href` bound to the `Theros · Confort Thermique & Bain` route instead of linking to their respective appliance categories.
* **Required Changes:**
  1. **Option A (If Nerobel Home Electronics is an active catalog):** Update the `href` props on Card 3 and Card 4 to point to their dedicated category or product routes.
  2. **Option B (If Nerobel is strictly a Theros & Eurogas distributor):** Remove the TV and Refrigerator cards from the collection grid and hero carousel (`02/04`), replacing them with actual Theros (e.g., vasques/robinetterie) and Eurogas (chaudières murales) products.

```html
<!-- BEFORE (Card 3 & Card 4 pointing to Theros thermal route) -->
<a href="/marques/theros" class="collection-card">
  <h2>Smart TV OLED 4K 65"</h2>
  <span>Découvrir la collection</span>
</a>

<!-- AFTER (Option A: Dedicated category route + specific CTA) -->
<a href="/collections/tv-oled-4k" class="collection-card">
  <h2>Smart TV OLED 4K 65"</h2>
  <span>Voir les téléviseurs OLED</span>
</a>
```

### 2. [F-01 | Score: 34/46 | `A11Y-01`] Add Accessible Names to Icon-Only Controls
* **Component / Section:** Footer Social/Contact Bar & Header Utility Controls.
* **Root Cause:** Anchor tags wrapping WhatsApp, Facebook, and LinkedIn SVG icons (DOM:52) and header utility buttons (theme toggle, mobile menu) contain no text nodes or `aria-label` attributes, rendering as empty links `[]()` to assistive technologies.
* **Required Changes:**
  * Add explicit French `aria-label` attributes to all 3 footer social links.
  * Add `aria-hidden="true"` and `focusable="false"` to all decorative child `<svg>` elements.
  * Add `aria-label` to the header theme-toggle button, header menu button, and footer "copy phone number" buttons next to `+212 787 013 201` and `+212 661 99 97 47`.

```html
<!-- BEFORE (Footer Social Links) -->
<div class="footer-socials">
  <a href="https://wa.me/212787013201"><svg>...</svg></a>
  <a href="https://facebook.com/..."><svg>...</svg></a>
  <a href="https://linkedin.com/..."><svg>...</svg></a>
</div>

<!-- AFTER (WCAG 2.1 SC 2.4.4 & 4.1.2 Compliant) -->
<div class="footer-socials">
  <a href="https://wa.me/212787013201" aria-label="Contacter Nerobel Group sur WhatsApp">
    <svg aria-hidden="true" focusable="false">...</svg>
  </a>
  <a href="https://facebook.com/..." aria-label="Page Facebook de Nerobel Group">
    <svg aria-hidden="true" focusable="false">...</svg>
  </a>
  <a href="https://linkedin.com/..." aria-label="Page LinkedIn de Nerobel Group">
    <svg aria-hidden="true" focusable="false">...</svg>
  </a>
</div>
```

### 3. [F-06 | Score: 31/46 | `STATE-02`] Replace Opaque Warranty State with Concrete Terms
* **Component / Section:** Hero Trust Indicators (DOM:6).
* **Root Cause:** Displaying *Garantie : conditions sur demande* next to a shield icon creates unnecessary skepticism for B2B buyers and homeowners.
* **Required Changes:**
  * Replace the vague string with the official warranty coverage period or convert it into an interactive link pointing to the SAV/Warranty policy section.

| Location | Current Copy (Slop / Evasive) | Proposed Replacement (Factual) |
| :--- | :--- | :--- |
| Hero Trust List (DOM:6) | Garantie : conditions sur demande | Garantie constructeur officielle (pièces d'origine et SAV agréé) |

---

## Sprint 2: CTA Specificity & Link Disambiguation (P1)

**Goal:** Enforce the Verb + Object rule across all product and brand cards so every interactive link is self-descriptive both visually and in screen-reader link lists.

### 4. [F-02 | Score: 32/46 | `COPY-03`] Replace Repeated Découvrir la collection Labels
* **Component / Section:** `#Les Collections Signatures de l'Habitat Moderne` (DOM:22, 25, 28, 31).
* **Root Cause:** Four consecutive cards use the exact same generic CTA text (`Découvrir la collection`).
* **Required Changes:** Map each card's CTA text to a specific Verb + Object label in sentence case without punctuation.

| Card Title | Current CTA | Proposed CTA (Verb + Object) |
| :--- | :--- | :--- |
| Theros Pro-Slim | Découvrir la collection | Voir le chauffe-eau Theros Pro-Slim |
| Eurogas Master Flame | Découvrir la collection | Voir la gamme Eurogas Master Flame |
| Smart TV OLED 4K 65" | Découvrir la collection | Voir la TV OLED 65" |
| Réfrigérateur Multi-Portes 520 L | Découvrir la collection | Voir le réfrigérateur 520 L |

### 5. [F-03 | Score: 26/46 | `COPY-03`] Disambiguate Détails Buttons on Brand Cards
* **Component / Section:** `#Theros & Eurogas Brand Spotlight` (DOM:38, 42).
* **Root Cause:** Single-word `Détails` buttons sit adjacent to external links (`Visiter theros.ma`, `Visiter eurogas.ma`), leaving users unsure whether `Détails` opens an internal catalog page or a spec sheet.
* **Required Changes:**

| Brand Block | Current Primary Button | Proposed Primary Button | Current Secondary Link | Proposed Secondary Link |
| :--- | :--- | :--- | :--- | :--- |
| Theros | Détails | Explorer la gamme Theros | Visiter theros.ma | Site officiel theros.ma |
| Eurogas | Détails | Explorer la gamme Eurogas | Visiter eurogas.ma | Site officiel eurogas.ma |

---

## Sprint 3: Taxonomy Standardization, Brand Alignment & Copy Polish (P2 & P3)

**Goal:** Unify entity naming across the header, hero, cards, and footer; resolve the "2 brands vs. 3 brands" architectural contradiction; and strip promotional filler words.

### 6. [F-05 | Score: 20/46 | `COPY-06`] Standardize Entity & Action Terminology
* **Component / Section:** Global Header, Hero, 3-Column Feature Row (01–03), Regional Banner, and Footer.
* **Root Cause:** The same destination routes use inconsistent phrasing across components.
* **Required Changes:** Update i18n keys or static template strings according to the canonical terminology table below:

| Target Route | Current Variants Found | Canonical Action Label (Buttons/Nav) | Canonical Noun (Headings/Text) |
| :--- | :--- | :--- | :--- |
| SAV Route | Demande SAV, Faire une demande SAV, SAV Agréé | Demander un SAV | Service après-vente agréé |
| Retail Network | Où acheter, Showrooms et revendeurs, Un réseau de showrooms et de points de vente | Trouver un point de vente | Points de vente et showrooms |
| Brands Route | Découvrir nos marques, Voir les marques, Nos Marques | Voir nos marques | Marques distribuées |
| B2B Portal | Espace Pro, Accéder à l'Espace Pro | Accéder à l'Espace Pro | Espace Pro |

### 7. [F-08 | Score: 20/46 | `COPY-06`] Resolve Brand Portfolio Contradiction ("2 Marques" vs. 3 Brands)
* **Component / Section:** Hero Stat Bar (DOM:8) & Collection Grid (DOM:26–31).
* **Root Cause:** The stat bar states **2 marques** Theros & Eurogas en distribution exclusive, while the hero carousel (02/04) and product grid showcase a third brand (NEROBEL · ENTERTAINMENT / NEROBEL · MODERN LIVING).
* **Required Changes (Requires Product Owner Decision — Gate Phase 4):**
  * **Path A (Multi-brand plus proprietary line):** Update the stat bar and hero subtitle to explicitly state: **2 marques exclusives** (Theros & Eurogas) + **gamme électroménager Nerobel**.
  * **Path B (Strict Theros & Eurogas focus):** Remove the Nerobel TV and Refrigerator items from the homepage carousel and collection grid.

### 8. [F-04 | Score: 12/46 | `COPY-01`] Strip Stock Marketing Vocabulary (NUKESLOP)
* **Component / Section:** Section Intros (DOM:19 & DOM:44).
* **Root Cause:** Promotional superlatives (fusion, d'avant-garde, rigoureusement sélectionnés, sublimer, s'est imposé comme le partenaire technologique) inflate reading time without adding technical facts.
* **Required Changes:** Replace with concise, specification-driven copy that is shorter than the original strings.

| Location | Current Copy (Char Count) | Proposed Factual Copy (Char Count) |
| :--- | :--- | :--- |
| Collections Intro (DOM:19) | "Découvrez la fusion de l'ingénierie thermique d'avant-garde et de matériaux rigoureusement sélectionnés. Des solutions connectées Theros aux systèmes gaz haute sécurité Eurogas, chaque ligne est pensée pour sublimer les intérieurs contemporains." (247 chars) | "Chauffe-eaux électriques plats connectés Theros (double cuve, Wi-Fi), systèmes à gaz Eurogas certifiés CE (sécurité ODS) et électroménager encastrable haute capacité." (167 chars — -32% length, +3 technical facts) |
| Group Intro (DOM:44) | "Nerobel Group s'est imposé comme le partenaire technologique des foyers marocains et des professionnels du bâtiment, alliant fiabilité rigoureuse et élégance contemporaine." (173 chars) | "Nerobel Group fournit les foyers marocains, installateurs et promoteurs immobiliers en équipements thermiques et sanitaires certifiés avec pièces d'origine." (158 chars — -9% length, names target B2B personas) |

---

## Verification & Definition of Done (Phase 6 Gate)

Before merging each sprint, run the following verification checks:

- [ ] **Zero Empty Links (`A11Y-01`):** Run `document.querySelectorAll('a, button')` in DevTools Console and verify every element returns a non-empty `innerText.trim() || getAttribute('aria-label')`.
- [ ] **Unique Link Context (`COPY-03`):** Verify that no two links pointing to different URLs share identical text, and no two cards for different products point to the same category URL unless filtered by query/hash.
- [ ] **Copy Length Gate:** Confirm all replacement copy in Sprint 3 is shorter than or equal to the character count of the string it replaces.
- [ ] **Multi-Viewport Visual Regression:** Capture screenshots at 1920x1080, 1440x900, and 375x812 to verify that longer specific CTA labels (e.g., `Voir le chauffe-eau Theros Pro-Slim` and `Trouver un point de vente`) do not wrap awkwardly or overflow card containers on mobile (375px).

# Nerobel Group Repository Map (`docs/repo-map.md`)

Generated during **S0-01 — Repo recon + check scripts**.

## 1. Repository Layout Overview

The repository is a static multi-page site served from the repository root (`/`):

- **Root HTML pages:** `index.html`, `brands.html`, `sav.html`, `network.html`, `b2b.html`, `contact.html`, `404.html`
- **SEO & root config:** `sitemap.xml`, `robots.txt`, `.gitignore`
- **Stylesheets (`css/`):** `css/theme.css`, `css/main.css`, `css/sav.css`, `css/icons.css`
- **JavaScript (`js/`):** `js/main.js`, `js/sav.js`, `js/network.js`, `js/i18n.js`, `js/theme.js`, `js/animations.js`
- **Assets (`assets/`):**
  - `assets/icons/` — SVG/PNG brand logos (`nerobel-logo*.svg`, `theros-logo*.svg`, `pacific-logo*.svg`, `eurogas-logo*.svg`), `favicon.svg`, `serial-guide.svg`
  - `assets/img/` — Product, hero, and banner photography (`.jpg`, `.webp`)
  - `assets/nerobel-website-audit.md` — Website audit and sprint plan
- **Scripts (`scripts/`):** Audit verification scripts (`scripts/audit-check.sh`, `scripts/audit_meta.py`) and asset utility scripts

---

## 2. Component & Feature File Mapping (9 Core Items)

| # | Area / Feature | Files Holding Markup, Styles & Logic |
|---|---|---|
| 1 | **Page files** | `index.html` (Home), `brands.html` (Brands), `sav.html` (SAV portal), `network.html` (Showrooms/locator), `b2b.html` (Professionals/B2B), `contact.html` (Contact), `404.html` (Error page) |
| 2 | **CSS stylesheets** | `css/theme.css` (CSS custom properties, dark/light theme tokens, base reset), `css/main.css` (layout, header, hero, cards, sections, footer, mobile bar, responsive rules), `css/sav.css` (SAV stepper, form controls, modals, tracker styles), `css/icons.css` (embedded data-URI SVG icon classes `.ti-*`) |
| 3 | **Header & mobile drawer** | Markup duplicated in `<header class="site-header">` and `<div class="mobile-drawer">` across all HTML pages; styles in `css/main.css`; sticky scroll effect and drawer open/close toggle in `js/main.js` (lines 29–56); theme toggle in `js/theme.js` |
| 4 | **Hero slider** | Markup in `index.html` (`#heroSection`, `.hero-bg-layer`, `.hero-bg-slide`, `#heroContextCard` controller dock); styles in `css/main.css`; slide data (`slidesData`), timer, keyboard/touch navigation in `js/main.js` (lines 280–461); scroll reveal & metrics counter in `js/animations.js` |
| 5 | **Product simulators** | Markup in `brands.html` (`#therosDemoWidget` Wi-Fi temperature/power simulator in `#theros`, `.interactive-demo-widget` 360° Horizontal/Vertical mounting simulator in `#pacific`); styles in `css/main.css`; interactive handlers in `js/main.js` (lines 172–278, including unused Eurogas ODS handler) |
| 6 | **SAV form & modals** | Markup in `sav.html` (`#panel-claim`, `#savStepsContainer`, `#sav-step-1`..`3`, `#savSuccessPanel`, plus `#serialGuideModal`, `#gpsMapModal`, `#webcamModal`) and Home quick tracker (`#quickTrackerForm` in `index.html`); styles in `css/sav.css`; `SavPortal` class, validation, GPS Leaflet modal, webcam capture, PDF receipt, and `trackerEngine` in `js/sav.js` (and `showTicketStatusModal` in `js/main.js`) |
| 7 | **Locator data & map** | Markup in `network.html` (`#filterCity`, `#filterBrand`, `#filterType`, `#networkLeafletMap`, `#showroomsList`); styles in `css/main.css`; `SHOWROOMS_DATA` array (9 outlets) and `NetworkManager` Leaflet map/directory renderer in `js/network.js` |
| 8 | **Language switch (i18n)** | Markup in `.lang-dropdown` inside `.header-actions` on every HTML page; `data-i18n` and `data-i18n-placeholder` attributes across HTML pages; dictionary (`I18N.fr`, `I18N.ar`, `I18N.en`) and `I18nManager` controller in `js/i18n.js` |
| 9 | **Mobile action bar** | Markup in `<nav class="mobile-sticky-bar">` at the bottom of `index.html`, `brands.html`, `sav.html`, `network.html`, `b2b.html`, and `contact.html`; styles (`.mobile-sticky-bar`, `.mobile-bar-btn`) in `css/main.css` |

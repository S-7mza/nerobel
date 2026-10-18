import fs from 'node:fs';
import path from 'node:path';

const outletsRaw = fs.readFileSync('content/outlets.json', 'utf8');
const outlets = JSON.parse(outletsRaw);

const confirmedOutlets = outlets.filter(o => o.confirmed === true);

// Group by city
const cityGroups = new Map();
for (const outlet of confirmedOutlets) {
  const city = outlet.city || 'Maroc';
  if (!cityGroups.has(city)) {
    cityGroups.set(city, []);
  }
  cityGroups.get(city).push(outlet);
}

const outDir = path.resolve('ou-acheter');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

for (const [city, cityOutlets] of cityGroups.entries()) {
  const slug = slugify(city);
  const targetFile = path.join(outDir, `${slug}.html`);

  const title = `Où acheter à ${city} · Nerobel Group`.slice(0, 60);
  const description = `Trouvez un showroom ou revendeur agréé des marques Nerobel Group à ${city} : adresses, horaires, contact et itinéraire.`.slice(0, 155);

  const jsonLd = cityOutlets.map(o => {
    const entry = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `Nerobel Group - ${o.name}`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": o.address,
        "addressLocality": o.city,
        "addressCountry": "MA"
      },
      "telephone": o.phone
    };
    if (o.hours) {
      entry["openingHours"] = o.hours;
    }
    return JSON.stringify(entry, null, 2);
  }).join('\n');

  const outletCardsHtml = cityOutlets.map(o => `
            <article class="outlet-card" data-id="${o.id}">
              <div class="outlet-card__header">
                <span class="outlet-card__badge ${o.type === 'showroom' ? 'badge--showroom' : 'badge--revendeur'}">
                  ${o.type === 'showroom' ? 'Showroom Officiel' : 'Revendeur Agréé'}
                </span>
                <h2 class="outlet-card__name" style="font-size:1.35rem; margin-top:8px;">${o.name}</h2>
              </div>
              <p class="outlet-card__address"><i class="ti ti-map-pin text-az"></i> ${o.address}</p>
              <p class="outlet-card__hours"><i class="ti ti-clock text-gold"></i> ${o.hours || 'Horaires sur demande'}</p>
              <p class="outlet-card__brands"><i class="ti ti-tag text-az"></i> <strong>Marques :</strong> ${o.brands ? o.brands.join(', ') : 'Toutes les marques Nerobel Group'}</p>
              <div class="outlet-card__actions" style="display:flex; flex-wrap:wrap; gap:10px; margin-top:16px;">
                <a href="tel:${o.phone}" class="btn btn-secondary" aria-label="Appeler ${o.name}">
                  <i class="ti ti-phone"></i> Appeler
                </a>
                <a href="https://wa.me/${o.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Bonjour, je souhaite me renseigner sur le showroom ' + o.name)}" target="_blank" rel="noopener" class="btn btn-whatsapp" aria-label="WhatsApp ${o.name}">
                  <i class="ti ti-brand-whatsapp"></i> WhatsApp
                </a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(o.address)}" target="_blank" rel="noopener" class="btn btn-primary" aria-label="Itinéraire vers ${o.name}">
                  <i class="ti ti-directions"></i> Itinéraire
                </a>
              </div>
            </article>
  `).join('\n');

  const html = `<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://nerobel.com/ou-acheter/${slug}.html">
  <!-- STAGING: remove at go-live (S4-06) -->
  <meta name="robots" content="noindex, nofollow">
  <link rel="icon" type="image/svg+xml" href="../assets/icons/favicon.svg">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://nerobel.com/ou-acheter/${slug}.html">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="https://s-7mza.github.io/nerobel/assets/img/og/network.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://s-7mza.github.io/nerobel/assets/img/og/network.jpg">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&family=Montserrat:ital,wght@0,700;0,800;1,800;1,900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/tokens.css">
  <link rel="stylesheet" href="../css/icons.css">
  <link rel="stylesheet" href="../css/theme.css">
  <link rel="stylesheet" href="../css/main.css">
  <link rel="stylesheet" href="../assets/css/components.css">

  <script type="application/ld+json">
${jsonLd}
  </script>
</head>
<body>

  <!-- Site Header -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="../index.html" class="brand-logo" aria-label="Nerobel Group">
        <img src="../assets/icons/nerobel-logo.svg" alt="NEROBEL" width="140" height="36">
      </a>

      <nav aria-label="Navigation Principale">
        <ul class="nav-menu">
          <li><a href="../index.html" class="nav-link">Groupe</a></li>
          <li><a href="../brands.html" class="nav-link">Marques</a></li>
          <li><a href="../sav.html" class="nav-link">SAV</a></li>
          <li><a href="../network.html" class="nav-link active">Où acheter</a></li>
          <li><a href="../b2b.html" class="nav-link">Espace Pro</a></li>
          <li><a href="../contact.html" class="nav-link">Contact</a></li>
        </ul>
      </nav>

      <div class="header-actions">
        <button type="button" class="theme-btn" aria-label="Changer de thème">
          <i class="ti ti-sun"></i>
        </button>

        <a href="../sav.html" class="btn-cta-sav">
          <i class="ti ti-tool"></i>
          <span>Demande SAV</span>
        </a>

        <button type="button" class="mobile-nav-toggle" aria-label="Menu Mobile">
          <i class="ti ti-menu-2"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Drawer -->
  <div class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu Navigation Mobile">
    <div class="mobile-drawer-header">
      <img src="../assets/icons/nerobel-logo.svg" alt="NEROBEL" width="140" height="36">
      <button type="button" class="mobile-drawer-close" aria-label="Fermer"><i class="ti ti-x"></i></button>
    </div>
    <ul class="mobile-nav-links">
      <li><a href="../index.html">Groupe</a></li>
      <li><a href="../brands.html">Marques</a></li>
      <li><a href="../sav.html">SAV</a></li>
      <li><a href="../network.html" class="active">Où acheter</a></li>
      <li><a href="../b2b.html">Espace Pro</a></li>
      <li><a href="../contact.html">Contact</a></li>
    </ul>
    <div class="drawer-cta-wrap">
      <a href="../sav.html" class="btn btn-primary btn-block"><i class="ti ti-tool"></i> <span>Demande SAV</span></a>
    </div>
  </div>

  <main id="main-content" aria-label="Où acheter à ${city}">
    <!-- Page Hero Banner -->
    <section class="page-hero">
      <div class="container text-center">
        <div class="eyebrow"><i class="ti ti-map-pin"></i> Points de Vente &amp; Showrooms</div>
        <h1 class="page-title">Où acheter à ${city}</h1>
        <p class="page-subtitle">
          Retrouvez nos espaces et revendeurs agréés pour les marques Theros, Pacific, Eurogas et Nerobel à ${city}.
        </p>
      </div>
    </section>

    <!-- Outlets Directory -->
    <section class="section section--tight">
      <div class="container" style="max-width:800px;">
        <div class="city-outlets-list" style="display:grid; gap:24px;">
${outletCardsHtml}
        </div>

        <div style="margin-top:40px; text-align:center;">
          <a href="../network.html" class="btn btn-secondary">
            <i class="ti ti-arrow-left"></i> Voir tous les points de vente au Maroc
          </a>
        </div>
      </div>
    </section>
  </main>

  <!-- Mobile Sticky Action Bar -->
  <nav class="mobile-sticky-bar mobile-bar" aria-label="Actions rapides mobiles">
    <a href="tel:+212522998877" class="mobile-bar-btn" aria-label="Appeler Nerobel">
      <i class="ti ti-phone"></i>
      <span>Appeler</span>
    </a>
    <a href="https://wa.me/212787013201?text=Bonjour%20Nerobel" target="_blank" rel="noopener" class="mobile-bar-btn wa-highlight" aria-label="WhatsApp Nerobel">
      <i class="ti ti-brand-whatsapp"></i>
      <span>WhatsApp</span>
    </a>
    <a href="../sav.html" class="mobile-bar-btn sav-highlight" aria-label="Demande SAV">
      <i class="ti ti-tool"></i>
      <span>Demande SAV</span>
    </a>
    <a href="../network.html" class="mobile-bar-btn" aria-label="Où acheter">
      <i class="ti ti-map-pin"></i>
      <span>Où acheter</span>
    </a>
  </nav>

  <!-- Site Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="../assets/icons/nerobel-logo.svg" alt="NEROBEL" width="140" height="36">
          <p>
            Nerobel Group détient et gère quatre marques pour la maison : Theros, Pacific, Eurogas et Nerobel.
          </p>
          <div class="footer-social-row">
            <a href="https://wa.me/212787013201" target="_blank" rel="noopener" class="social-btn" title="WhatsApp Nerobel" aria-label="Écrire sur WhatsApp"><i class="ti ti-brand-whatsapp text-wa"></i></a>
            <a href="https://www.facebook.com/nerobel" target="_blank" rel="noopener" class="social-btn" title="Facebook" aria-label="Facebook"><i class="ti ti-brand-facebook"></i></a>
            <a href="https://www.linkedin.com/company/nerobel/" target="_blank" rel="noopener" class="social-btn" title="LinkedIn" aria-label="LinkedIn"><i class="ti ti-brand-linkedin"></i></a>
          </div>
        </div>

        <details class="footer-col" open>
          <summary class="footer-title"><span>Nos Marques</span><i class="ti ti-chevron-down footer-accordion-icon"></i></summary>
          <ul class="footer-links">
            <li><a href="../brands.html#theros">Theros Water Heaters</a></li>
            <li><a href="../pacific.html">Pacific Chauffe-eaux</a></li>
            <li><a href="../brands.html#eurogas">Eurogas Gas Solutions</a></li>
            <li><a href="../brands.html#nerobel-tech">Nerobel Consumer Tech</a></li>
            <li><a href="https://theros.ma/" target="_blank" rel="noopener">Site Officiel Theros</a></li>
            <li><a href="https://eurogas.ma/" target="_blank" rel="noopener">Site Officiel Eurogas</a></li>
          </ul>
        </details>

        <details class="footer-col" open>
          <summary class="footer-title"><span>Services &amp; Support</span><i class="ti ti-chevron-down footer-accordion-icon"></i></summary>
          <ul class="footer-links">
            <li><a href="../sav.html">Demande SAV</a></li>
            <li><a href="../network.html">Où acheter</a></li>
            <li><a href="../b2b.html">Espace Pro</a></li>
            <li><a href="tel:+212787013201">WhatsApp Nerobel : +212 787 013 201</a></li>
          </ul>
        </details>

        <details class="footer-col" open>
          <summary class="footer-title"><span>Le Groupe</span><i class="ti ti-chevron-down footer-accordion-icon"></i></summary>
          <ul class="footer-links">
            <li><a href="../contact.html">Siège &amp; Coordonnées</a></li>
            <li><a href="../b2b.html">Espace Pro</a></li>
            <li><a href="../contact.html?dept=presse">Presse &amp; Partenariats</a></li>
            <li><a href="tel:+212522998877">Standard : +212 522 99 88 77</a></li>
          </ul>
        </details>
      </div>

      <div class="footer-bottom">
        <div>© 2026 Nerobel Group. Tous droits réservés.</div>
        <div class="footer-legal-links">
          <a href="../confidentialite.html">Politique de confidentialité</a>
          <a href="../mentions-legales.html">Mentions légales</a>
        </div>
      </div>
    </div>
  </footer>

  <script src="../js/theme.js"></script>
  <script src="../js/animations.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
`;

  fs.writeFileSync(targetFile, html.trim() + '\n', 'utf8');
  console.log(`Generated ${targetFile}`);
}

const { test, expect } = require('@playwright/test');
const pages = ['index', 'brands', 'pacific', 'sav', 'network', 'b2b', 'contact', '404'];
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

test('mobile action bar is hidden on desktop @1024', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.goto('/index.html');
  const visible = await page.$eval('.mobile-bar', el => window.getComputedStyle(el).display !== 'none');
  expect(visible).toBe(false);
});

test('sav.html mobile bar has contact link as third item', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/sav.html');
  const thirdText = await page.$eval('.mobile-bar a:nth-child(3) span', el => el.textContent.trim());
  const thirdHref = await page.$eval('.mobile-bar a:nth-child(3)', el => el.getAttribute('href'));
  expect(thirdText).toBe('Contact');
  expect(thirdHref).toBe('contact.html');
});

test('last footer line is not covered by mobile action bar @390x844', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  const lastLineBottom = await page.$eval('.footer-bottom', el => el.getBoundingClientRect().bottom);
  const barTop = await page.$eval('.mobile-bar', el => el.getBoundingClientRect().top);
  expect(lastLineBottom).toBeLessThanOrEqual(barTop);
});

test('brands.html @390px: every .brand-block has H2 above its media', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/brands.html');
  const blocks = await page.$$('.brand-block');
  expect(blocks.length).toBeGreaterThanOrEqual(3);
  for (const block of blocks) {
    const h2Top = await block.$eval('h2', el => el.getBoundingClientRect().top);
    const mediaTop = await block.$eval('.brand-block__media', el => el.getBoundingClientRect().top);
    expect(h2Top).toBeLessThan(mediaTop);
  }
});

test('brand-tabs are keyboard accessible and activate on enter', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/brands.html');
  const tabs = await page.$$('.brand-tabs__link');
  expect(tabs.length).toBe(4);
  
  await page.focus('.brand-tabs__link[href="#eurogas"]');
  await page.keyboard.press('Enter');
  const activeHref = await page.$eval('.brand-tabs__link.active', el => el.getAttribute('href'));
  expect(activeHref).toBe('#eurogas');
});

test('sav.html?brand=eurogas starts on step 2 with Eurogas selected', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/sav.html?brand=eurogas');

  const isStep2Active = await page.$eval('#sav-step-2', el => el.classList.contains('active'));
  expect(isStep2Active).toBe(true);

  const brandVal = await page.$eval('#savBrand', el => el.value);
  expect(brandVal).toBe('Eurogas');

  const isBrandDisabled = await page.$eval('#savBrand', el => el.disabled);
  expect(isBrandDisabled).toBe(true);

  const bannerVisible = await page.$eval('#changeDeviceBanner', el => window.getComputedStyle(el).display !== 'none');
  expect(bannerVisible).toBe(true);

  expect(consoleErrors).toEqual([]);
});

test('sav.html: ticking "Je ne trouve pas mon numéro de série" makes the serial optional', async ({ page }) => {
  await page.goto('/sav.html?brand=eurogas');

  await page.fill('#savFullName', 'Mohamed Alami');
  await page.fill('#savPhone', '0612345678');
  await page.check('#savNoSerial');
  await page.check('#savConsent');

  await page.click('#btn-to-step3');

  const isStep3Active = await page.$eval('#sav-step-3', el => el.classList.contains('active'));
  expect(isStep3Active).toBe(true);

  const reviewSerial = await page.$eval('#revSerial', el => el.textContent);
  expect(reviewSerial).toContain('Eurogas');
});

test('sav.html: submission is blocked without consent and moves focus to first invalid field', async ({ page }) => {
  await page.goto('/sav.html?brand=eurogas');

  await page.fill('#savFullName', 'Mohamed Alami');
  await page.fill('#savPhone', '0612345678');
  await page.fill('#savSerial', 'PC202612345');
  // Leave consent unchecked

  await page.click('#btn-to-step3');

  const isStep3Active = await page.$eval('#sav-step-3', el => el.classList.contains('active'));
  expect(isStep3Active).toBe(false);

  const errorSummaryVisible = await page.$eval('#step2ErrorSummary', el => window.getComputedStyle(el).display !== 'none');
  expect(errorSummaryVisible).toBe(true);

  const focusedId = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
  expect(focusedId).toBe('savConsent');
});

test('sav.html: empty step 2 validation moves focus to the first invalid field', async ({ page }) => {
  await page.goto('/sav.html?brand=eurogas');

  await page.click('#btn-to-step3');

  const focusedId = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
  expect(focusedId).toBe('savFullName');

  const errorSummaryVisible = await page.$eval('#step2ErrorSummary', el => window.getComputedStyle(el).display !== 'none');
  expect(errorSummaryVisible).toBe(true);
});

test('docs/forms.md exists and documents form backends', async () => {
  const fs = require('fs');
  expect(fs.existsSync('docs/forms.md')).toBe(true);
  const content = fs.readFileSync('docs/forms.md', 'utf-8');
  expect(content).toContain('sav.html');
  expect(content).toContain('contact.html');
  expect(content).toContain('b2b.html');
  expect(content).toContain('wa.me/212787013201');
});

test('sav.html: endpoint route.abort shows error state and no success', async ({ page }) => {
  await page.goto('/sav.html?brand=eurogas');
  await page.evaluate(() => { window.nerobelFormEndpoint = '/api/sav-submit'; });
  await page.route('/api/sav-submit', route => route.abort());

  await page.fill('#savFullName', 'Mohamed Alami');
  await page.fill('#savPhone', '0612345678');
  await page.fill('#savSerial', 'PC202612345');
  await page.check('#savConsent');
  await page.click('#btn-to-step3');

  await page.click('#btnSubmitFinal');

  // Verify error state is shown and success panel is not shown
  await page.waitForSelector('#savSubmitError', { state: 'visible' });
  const isSuccessVisible = await page.$eval('#savSuccessPanel', el => el.classList.contains('visible'));
  expect(isSuccessVisible).toBe(false);
});

test('contact.html: endpoint route.abort shows error state and no success', async ({ page }) => {
  await page.goto('/contact.html');
  await page.evaluate(() => { window.nerobelFormEndpoint = '/api/contact-submit'; });
  await page.route('/api/contact-submit', route => route.abort());

  await page.fill('#contactName', 'Youssef El Mansouri');
  await page.fill('#contactPhone', '0612345678');
  await page.fill('#contactMessage', 'Demande de renseignement commercial.');
  await page.check('#contactConsent');

  await page.click('#contactForm button[type="submit"]');

  await page.waitForSelector('#contactSubmitError', { state: 'visible' });
  const isFeedbackVisible = await page.$eval('#contactFeedback', el => window.getComputedStyle(el).display !== 'none');
  expect(isFeedbackVisible).toBe(false);
});

test('sav.html: default hand-off shows "Votre message est prêt" and no fabricated ticket number', async ({ page }) => {
  await page.goto('/sav.html?brand=eurogas');

  await page.fill('#savFullName', 'Mohamed Alami');
  await page.fill('#savPhone', '0612345678');
  await page.fill('#savSerial', 'PC202612345');
  await page.check('#savConsent');
  await page.click('#btn-to-step3');

  await page.click('#btnSubmitFinal');

  await page.waitForSelector('#savSuccessPanel.visible');
  const title = await page.$eval('#savSuccessTitle', el => el.textContent);
  expect(title).toContain('Votre message est prêt');

  const ticketBoxDisplay = await page.$eval('#savTicketBox', el => window.getComputedStyle(el).display);
  expect(ticketBoxDisplay).toBe('none');

  const waHref = await page.$eval('#btnWhatsAppAction', el => el.getAttribute('href'));
  expect(waHref).toContain('https://wa.me/212787013201?text=');
  expect(decodeURIComponent(waHref)).toContain('Eurogas');
});

test('network.html: seed data shows confirmed headquarters showroom and no unconfirmed outlet', async ({ page }) => {
  await page.goto('/network.html');
  await page.waitForSelector('.outlet-card');
  const cards = await page.$$('.outlet-card');
  expect(cards.length).toBe(1);

  const title = await page.$eval('.outlet-card .outlet-card__name', el => el.textContent);
  expect(title).toContain('Siège Social & Showroom Principal');

  // Verify three buttons exist
  const callBtn = await page.$('.outlet-card a[href^="tel:"]');
  const waBtn = await page.$('.outlet-card a[href*="wa.me"]');
  const dirBtn = await page.$('.outlet-card a[href*="google.com/maps"]');
  expect(callBtn).not.toBeNull();
  expect(waBtn).not.toBeNull();
  expect(dirBtn).not.toBeNull();
});

test('network.html: query parameters preselect filters and filter outlets', async ({ page }) => {
  // Test brand query param
  await page.goto('/network.html?brand=pacific');
  await page.waitForSelector('.outlet-card');
  const brandVal = await page.$eval('#filterBrand', el => el.value);
  expect(brandVal).toBe('pacific');
  // Brands: null matches all
  const cardsPacific = await page.$$('.outlet-card');
  expect(cardsPacific.length).toBe(1);

  // Test city query param with no confirmed outlet
  await page.goto('/network.html?city=rabat');
  await page.waitForSelector('.showrooms-empty-state');
  const emptyVisible = await page.$eval('.showrooms-empty-state', el => window.getComputedStyle(el).display !== 'none');
  expect(emptyVisible).toBe(true);

  // Test city query param with confirmed outlet
  await page.goto('/network.html?city=casablanca');
  await page.waitForSelector('.outlet-card');
  const cardsCasa = await page.$$('.outlet-card');
  expect(cardsCasa.length).toBe(1);
});

test('network.html: mobile toggle at 390px shows list first and toggles map', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/network.html');
  await page.waitForSelector('.outlet-card');

  // Directory wrap is visible, map frame is hidden in view-list
  const listVisible = await page.$eval('#networkDirectoryWrap', el => window.getComputedStyle(el).display !== 'none');
  const mapVisible = await page.$eval('#networkMapFrame', el => window.getComputedStyle(el).display !== 'none');
  expect(listVisible).toBe(true);
  expect(mapVisible).toBe(false);

  // Toggle map
  await page.click('#btnToggleMap');
  const listAfterToggle = await page.$eval('#networkDirectoryWrap', el => window.getComputedStyle(el).display !== 'none');
  const mapAfterToggle = await page.$eval('#networkMapFrame', el => window.getComputedStyle(el).display !== 'none');
  expect(listAfterToggle).toBe(false);
  expect(mapAfterToggle).toBe(true);
});

test('ou-acheter/casablanca.html: static city page exists with LocalBusiness JSON-LD', async ({ page }) => {
  await page.goto('/ou-acheter/casablanca.html');
  const h1 = await page.$eval('h1', el => el.textContent);
  expect(h1).toContain('Où acheter à Casablanca');

  const jsonLd = await page.$eval('script[type="application/ld+json"]', el => JSON.parse(el.textContent));
  expect(jsonLd['@type']).toBe('LocalBusiness');
  expect(jsonLd.address.addressLocality).toBe('Casablanca');
  expect(jsonLd.telephone).toBe('+212522998877');
});

test('b2b.html: blocks submission without email and consent, and sends mailto hand-off on valid submit', async ({ page }) => {
  await page.goto('/b2b.html');

  // Fill partial required fields (without email)
  await page.fill('#b2bCompany', 'Atlas Sanitaire SARL');
  await page.fill('#b2bContact', 'Youssef Bennani');
  await page.fill('#b2bPhone', '0661234567');
  await page.selectOption('#b2bCity', 'Casablanca');
  await page.selectOption('#b2bActivity', 'installateur');

  // Attempt submit without email
  await page.click('#b2bForm button[type="submit"]');
  let feedbackDisplay = await page.$eval('#b2bFeedback', el => window.getComputedStyle(el).display);
  expect(feedbackDisplay).toBe('none');

  // Fill email but without consent
  await page.fill('#b2bEmail', 'pro@atlas-sanitaire.ma');
  await page.click('#b2bForm button[type="submit"]');
  feedbackDisplay = await page.$eval('#b2bFeedback', el => window.getComputedStyle(el).display);
  expect(feedbackDisplay).toBe('none');

  // Tick consent and submit
  await page.check('#b2bConsent');
  await page.click('#b2bForm button[type="submit"]');

  await page.waitForSelector('#b2bFeedback', { state: 'visible' });
  const mailtoHref = await page.$eval('#b2bMailtoLink', el => el.getAttribute('href'));
  expect(mailtoHref).toContain('mailto:contact@nerobel.com');
  const decoded = decodeURIComponent(mailtoHref);
  expect(decoded).toContain('Atlas Sanitaire SARL');
  expect(decoded).toContain('pro@atlas-sanitaire.ma');
  expect(decoded).toContain('installateur');
});

test('b2b.html: ?type=revendeur preselects the activity and cards update selection', async ({ page }) => {
  await page.goto('/b2b.html?type=revendeur');
  const activityVal = await page.$eval('#b2bActivity', el => el.value);
  expect(activityVal).toBe('revendeur');

  // Click card button for promoteur
  await page.click('.btn-b2b-target[data-type="promoteur"]');
  const updatedVal = await page.$eval('#b2bActivity', el => el.value);
  expect(updatedVal).toBe('promoteur');
});

test('contact.html: department list has no SAV, ?dept=presse preselects department, and directions link opens Google Maps', async ({ page }) => {
  await page.goto('/contact.html?dept=presse');

  // Verify SAV is removed from department select
  const deptOptions = await page.$$eval('#contactDept option', opts => opts.map(o => ({ value: o.value, text: o.text })));
  expect(deptOptions.some(o => o.value === 'sav')).toBe(false);
  expect(deptOptions.some(o => o.text.includes('SAV'))).toBe(false);

  // Verify ?dept=presse preselected
  const deptVal = await page.$eval('#contactDept', el => el.value);
  expect(deptVal).toBe('presse');

  // Verify Partenariat notice when selecting partenariat
  await page.selectOption('#contactDept', 'partenariat');
  const noticeDisplay = await page.$eval('#contactPartenariatNotice', el => window.getComputedStyle(el).display);
  expect(noticeDisplay).toBe('block');
  const noticeLink = await page.$eval('#contactPartenariatNotice a', el => el.getAttribute('href'));
  expect(noticeLink).toContain('b2b.html#demande');

  // Verify Google Maps directions link
  const dirLink = await page.$eval('a[href*="google.com/maps/dir"]', el => el.getAttribute('href'));
  expect(dirLink).toContain('destination=Angle%20Boulevard%20d\'Anfa%20%26%20Rue%20Mozart%2C%20Casablanca%2C%20Maroc');

  // Verify 3 path cards exist
  const pathCards = await page.$$('.contact-path-card');
  expect(pathCards.length).toBe(3);
});

test('S3-07: no 100vh used for hero or drawer in stylesheets', async () => {
  const fs = require('fs');
  const cssFiles = [
    'css/main.css',
    'css/sav.css',
    'css/theme.css',
    'assets/css/tokens.css',
    'assets/css/components.css'
  ];
  for (const f of cssFiles) {
    if (fs.existsSync(f)) {
      const content = fs.readFileSync(f, 'utf8');
      expect(content).not.toMatch(/:\s*100vh\b/);
    }
  }
});

test('S3-07: footer columns are details accordions: closed at 390px, open at 1280px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html');
  const mobileDetails = await page.$$eval('footer details.footer-col', els => els.map(e => e.open));
  expect(mobileDetails.length).toBeGreaterThan(0);
  mobileDetails.forEach(isOpen => expect(isOpen).toBe(false));

  const summaryHeight = await page.$eval('footer details.footer-col summary', el => el.getBoundingClientRect().height);
  expect(summaryHeight).toBeGreaterThanOrEqual(48);

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/index.html');
  const desktopDetails = await page.$$eval('footer details.footer-col', els => els.map(e => e.open));
  expect(desktopDetails.length).toBeGreaterThan(0);
  desktopDetails.forEach(isOpen => expect(isOpen).toBe(true));
});

test('S3-07: phone header @360px shows logo, CTA SAV, and mobile menu toggle; hides theme button', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/index.html');

  const logoVisible = await page.$eval('.brand-logo', el => window.getComputedStyle(el).display !== 'none');
  expect(logoVisible).toBe(true);

  const savCtaVisible = await page.$eval('.btn-cta-sav', el => window.getComputedStyle(el).display !== 'none');
  expect(savCtaVisible).toBe(true);

  const menuToggleVisible = await page.$eval('.mobile-nav-toggle', el => window.getComputedStyle(el).display !== 'none');
  expect(menuToggleVisible).toBe(true);

  const themeBtnHidden = await page.$eval('.theme-btn', el => window.getComputedStyle(el).display === 'none');
  expect(themeBtnHidden).toBe(true);
});

test('S3-07: captures screenshots for all pages across viewports 360, 390, 768, 1024', async ({ page }) => {
  test.setTimeout(180000);
  const fs = require('fs');
  const path = require('path');
  const screenDir = path.join(__dirname, '..', 'docs', 'screens');
  if (!fs.existsSync(screenDir)) {
    fs.mkdirSync(screenDir, { recursive: true });
  }

  const screenPages = [
    { slug: 'index', path: '/index.html' },
    { slug: 'brands', path: '/brands.html' },
    { slug: 'pacific', path: '/pacific.html' },
    { slug: 'sav', path: '/sav.html' },
    { slug: 'network', path: '/network.html' },
    { slug: 'b2b', path: '/b2b.html' },
    { slug: 'contact', path: '/contact.html' },
    { slug: 'mentions-legales', path: '/mentions-legales.html' },
    { slug: 'confidentialite', path: '/confidentialite.html' },
    { slug: 'casablanca', path: '/ou-acheter/casablanca.html' }
  ];
  const screenWidths = [360, 390, 768, 1024];

  for (const p of screenPages) {
    for (const w of screenWidths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto(p.path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(100);
      const outPath = path.join(screenDir, `${p.slug}-${w}.png`);
      await page.screenshot({ path: outPath, fullPage: false });
    }
  }

  const generatedFiles = fs.readdirSync(screenDir).filter(f => f.endsWith('.png'));
  expect(generatedFiles.length).toBe(screenPages.length * screenWidths.length);
});

test('S4-01: scripts/check_jsonld.py passes and index.html contains Organization and Brand structured data', async ({ page }) => {
  const { execSync } = require('child_process');
  const out = execSync('python scripts/check_jsonld.py', { encoding: 'utf-8' });
  expect(out).toContain('all JSON-LD blocks valid');

  await page.goto('/index.html');
  const jsonLdContent = await page.$eval('script[type="application/ld+json"]', el => JSON.parse(el.textContent));
  expect(jsonLdContent['@type']).toBe('Organization');
  expect(jsonLdContent.name).toBe('Nerobel Group');
  expect(jsonLdContent.brand.length).toBe(4);
});

test('S4-02: sitemap.xml is valid XML with all pages; robots.txt allows production; 404.html has required links', async ({ page }) => {
  const fs = require('fs');

  // Verify robots.txt
  const robots = fs.readFileSync('robots.txt', 'utf8');
  expect(robots).toMatch(/User-agent:\s*\*\s*\nAllow:\s*\//);
  expect(robots).toContain('Sitemap: https://nerobel.com/sitemap.xml');

  // Verify sitemap.xml
  const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
  expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
  expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  const expectedPages = [
    'https://nerobel.com/',
    'https://nerobel.com/brands.html',
    'https://nerobel.com/pacific.html',
    'https://nerobel.com/sav.html',
    'https://nerobel.com/network.html',
    'https://nerobel.com/ou-acheter/casablanca.html',
    'https://nerobel.com/b2b.html',
    'https://nerobel.com/contact.html',
    'https://nerobel.com/mentions-legales.html',
    'https://nerobel.com/confidentialite.html'
  ];
  for (const exp of expectedPages) {
    expect(sitemap).toContain(`<loc>${exp}</loc>`);
  }

  // Verify 404.html links
  await page.goto('/404.html');
  const homeLink = await page.$('a[href="index.html"]');
  const networkLink = await page.$('a[href="network.html"]');
  const savLink = await page.$('a[href="sav.html"]');
  expect(homeLink).not.toBeNull();
  expect(networkLink).not.toBeNull();
  expect(savLink).not.toBeNull();
});

test('S4-03: skip link is first element in body, becomes visible on focus, and navigates to #main-content', async ({ page }) => {
  await page.goto('/index.html');
  const firstChildTag = await page.evaluate(() => document.body.firstElementChild.tagName);
  const firstChildClass = await page.evaluate(() => document.body.firstElementChild.className);
  expect(firstChildTag).toBe('A');
  expect(firstChildClass).toContain('skip-link');

  // Tab to focus skip link
  await page.keyboard.press('Tab');
  const focusedHref = await page.evaluate(() => document.activeElement.getAttribute('href'));
  expect(focusedHref).toBe('#main-content');
  const isVisible = await page.$eval('.skip-link', el => {
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && window.getComputedStyle(el).display !== 'none';
  });
  expect(isVisible).toBe(true);
});

const AxeBuilder = require('@axe-core/playwright').default;
const axePages = [
  'index', 'brands', 'pacific', 'sav', 'network', 'b2b', 'contact', 'mentions-legales', 'confidentialite', '404'
];

for (const p of axePages) {
  test(`S4-03: ${p}.html passes axe accessibility audit with 0 critical or serious violations`, async ({ page }) => {
    await page.goto(`/${p}.html`);
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalOrSerious = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    if (criticalOrSerious.length > 0) {
      console.log(`Violations on ${p}.html:`, JSON.stringify(criticalOrSerious.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.html) })), null, 2));
    }
    expect(criticalOrSerious.length).toBe(0);
  });
}

test('S4-04: scripts/check_perf.js passes and initial load transfer on mobile is under 1MB', async ({ page }) => {
  const { execSync } = require('child_process');
  const out = execSync('node scripts/check_perf.js', { encoding: 'utf-8' });
  expect(out).toContain('all performance budget and script defer checks passed');

  let totalBytes = 0;
  page.on('response', async res => {
    try {
      const buffer = await res.body();
      totalBytes += buffer.length;
    } catch (_) {}
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html', { waitUntil: 'load' });

  // Initial load must be < 1 MB (1024 * 1024 bytes)
  expect(totalBytes).toBeLessThan(1024 * 1024);
});


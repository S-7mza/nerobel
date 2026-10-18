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




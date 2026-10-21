const { test, expect } = require('@playwright/test');

test.describe('S4-05: Analytics event tracking', () => {

  test('5 & 6. whatsapp_click and call_click events track source', async ({ page }) => {
    await page.goto('/index.html');

    // Click WhatsApp link in mobile bar or hero
    await page.click('footer .footer-social-row a[href*="wa.me"]');
    let events = await page.evaluate(() => window.dataLayer);
    let waEvt = events.find(e => e.event === 'whatsapp_click');
    expect(waEvt).toBeDefined();
    expect(waEvt.source).toBe('footer');

    // Click call link in mobile bar or footer
    await page.click('footer a[href^="tel:"]');
    events = await page.evaluate(() => window.dataLayer);
    let callEvt = events.find(e => e.event === 'call_click');
    expect(callEvt).toBeDefined();
    expect(callEvt.source).toBe('footer');
  });

  test('8. pdf_download event tracks file', async ({ page }) => {
    await page.goto('/b2b.html');
    // If download links exist, or simulate pdf click
    await page.evaluate(() => {
      const a = document.createElement('a');
      a.href = 'assets/docs/test.pdf';
      a.setAttribute('download', '');
      document.body.appendChild(a);
      a.click();
    });
    const events = await page.evaluate(() => window.dataLayer);
    const pdfEvt = events.find(e => e.event === 'pdf_download');
    expect(pdfEvt).toBeDefined();
    expect(pdfEvt.file).toBe('test.pdf');
  });

  test('9. brand_tab_switch event tracks brand', async ({ page }) => {
    await page.goto('/brands.html');
    await page.click('.brand-tabs__link[href="#eurogas"]');
    const events = await page.evaluate(() => window.dataLayer);
    const tabEvt = events.find(e => e.event === 'brand_tab_switch');
    expect(tabEvt).toBeDefined();
    expect(tabEvt.brand).toBe('eurogas');
  });

  test('10. simulator_interact tracks Theros power modes', async ({ page }) => {
    await page.goto('/brands.html');
    await page.click('.power-mode-btn[data-power="500"]');
    const events = await page.evaluate(() => window.dataLayer);
    let therosEvt = events.find(e => e.event === 'simulator_interact' && e.brand === 'theros');
    expect(therosEvt).toBeDefined();
    expect(therosEvt.setting).toBe('500');
  });

  test('1 & 2. sav_step_complete and sav_submit tracking', async ({ page }) => {
    await page.goto('/sav.html');
    // Step 1: select electric type
    await page.click('.type-select-card[data-type="electric"]');
    await page.click('#btn-to-step2');

    let events = await page.evaluate(() => window.dataLayer);
    let step1Evt = events.find(e => e.event === 'sav_step_complete' && e.step === 1);
    expect(step1Evt).toBeDefined();

    // Step 2: fill form
    await page.fill('#savFullName', 'Karim Alami');
    await page.fill('#savPhone', '0612345678');
    await page.fill('#savAddress', '10 Rue de Fès, Casablanca');
    await page.check('#savNoSerial');
    await page.fill('#savDescription', 'Problème de chauffe eau');
    await page.check('#savConsent');
    await page.click('#btn-to-step3');

    events = await page.evaluate(() => window.dataLayer);
    let step2Evt = events.find(e => e.event === 'sav_step_complete' && e.step === 2);
    expect(step2Evt).toBeDefined();

    // Step 3: submit
    await page.click('#btnSubmitFinal');
    events = await page.evaluate(() => window.dataLayer);
    let step3Evt = events.find(e => e.event === 'sav_step_complete' && e.step === 3);
    let submitEvt = events.find(e => e.event === 'sav_submit');
    expect(step3Evt).toBeDefined();
    expect(submitEvt).toBeDefined();
    expect(submitEvt.category).toBe('electric');
  });

  test('3. b2b_submit event tracks type and city', async ({ page }) => {
    await page.goto('/b2b.html');
    await page.fill('#b2bCompany', 'Atlas Sanitaire SARL');
    await page.fill('#b2bContact', 'Youssef Bennani');
    await page.fill('#b2bPhone', '0612345678');
    await page.fill('#b2bEmail', 'contact@atlas.ma');
    await page.selectOption('#b2bCity', 'Casablanca');
    await page.selectOption('#b2bActivity', 'installateur');
    await page.check('#b2bConsent');

    await page.click('#b2bForm button[type="submit"]');

    const events = await page.evaluate(() => window.dataLayer);
    const b2bEvt = events.find(e => e.event === 'b2b_submit');
    expect(b2bEvt).toBeDefined();
    expect(b2bEvt.type).toBe('installateur');
    expect(b2bEvt.city).toBe('Casablanca');
  });

  test('4. contact_submit event tracks department', async ({ page }) => {
    await page.goto('/contact.html');
    await page.fill('#contactName', 'Hassan Idrissi');
    await page.fill('#contactPhone', '0612345678');
    await page.fill('#contactEmail', 'hassan@example.com');
    await page.selectOption('#contactDept', 'commercial');
    await page.fill('#contactMessage', 'Demande d information sur la gamme');
    await page.check('#contactConsent');

    await page.click('#contactForm button[type="submit"]');

    const events = await page.evaluate(() => window.dataLayer);
    const contactEvt = events.find(e => e.event === 'contact_submit');
    expect(contactEvt).toBeDefined();
    expect(contactEvt.dept).toBe('commercial');
  });

  test('7. outlet_filter event tracks brand, city, type on network.html', async ({ page }) => {
    await page.goto('/network.html');
    await page.selectOption('#filterCity', 'casablanca');

    const events = await page.evaluate(() => window.dataLayer);
    const filterEvt = events.find(e => e.event === 'outlet_filter');
    expect(filterEvt).toBeDefined();
    expect(filterEvt.city).toBe('casablanca');
  });

});

const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const artifactsDir = 'C:\\Users\\7mza\\.gemini\\antigravity-ide\\brain\\f3d45594-9389-402f-b5d7-adca506e73c8';

  console.log('1. Navigating to http://localhost:8099/sav.html...');
  await page.goto('http://localhost:8099/sav.html', { waitUntil: 'networkidle' });

  // Clear draft
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  await page.waitForSelector('#savDynamicStepBody');

  // Click on "Hors garantie" tab
  console.log('2. Switching to "Hors garantie" (TicketType 2)...');
  await page.click('button.ticket-type-pill[data-ticket-type="2"]');
  await page.waitForTimeout(500);

  // Step 1: Coordonnées
  console.log('3. Filling Step 1 (Hors garantie - Coordonnées)...');
  await page.fill('#field_12', 'Youssef El Amrani');
  await page.fill('#field_14', '0678901234');

  await page.click('#btnStepNext');
  await page.waitForTimeout(500);

  // Step 2: Equipement
  console.log('4. Filling Step 2 (Equipement)...');
  await page.fill('#field_37', 'PC202508300888');

  // Pick Marque (option chip or select)
  const boschChip = await page.$('.sav-option-card[data-value="Bosch"]');
  if (boschChip) {
    await boschChip.click();
  } else {
    await page.selectOption('#field_38', 'Bosch');
  }

  await page.click('#btnStepNext');
  await page.waitForTimeout(500);

  // Step 3: Description du problème
  console.log('5. Filling Step 3 (Description du problème)...');
  const noHotWaterChip = await page.$('.sav-option-card[data-value="no_hot_water"]');
  if (noHotWaterChip) {
    await noHotWaterChip.click();
  }

  await page.fill('#field_44', "Fuite d'eau constatée sous le groupe de sécurité depuis 3 jours.");

  await page.click('#btnStepNext');
  await page.waitForTimeout(500);

  // Step 4: Adresse
  console.log('6. Filling Step 4 (Adresse)...');
  await page.fill('#field_19', '52 Rue Ibn Batouta, Guéliz, Marrakech');

  await page.click('#btnStepNext');
  await page.waitForTimeout(500);

  // Step 5: Pièce jointe (optional for hors garantie)
  console.log('7. Step 5 (Pièce jointe - checking option without doc)...');
  await page.click('.check-no-doc');

  await page.click('#btnStepNext');
  await page.waitForTimeout(500);

  // Step 6: Confirmation
  console.log('8. Step 6 (Confirmation) - checking consent & submitting...');
  await page.screenshot({ path: path.join(artifactsDir, 'engine_type2_review.png'), fullPage: false });
  await page.check('#savConsent');
  await page.click('#btnSubmitFinal');

  // Await success panel
  await page.waitForSelector('#savSuccessPanel.visible', { timeout: 20000 });
  const ticketCode = await page.$eval('#displayTicketCode', el => el.textContent.trim());
  console.log(`\n========================================`);
  console.log(`HORS GARANTIE TICKET GENERATED: ${ticketCode}`);
  console.log(`========================================\n`);

  await page.screenshot({ path: path.join(artifactsDir, 'engine_type2_success.png'), fullPage: false });
  await browser.close();
  console.log('Hors garantie flow completed successfully!');
})();

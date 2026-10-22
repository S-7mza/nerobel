const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const artifactsDir = 'C:\\Users\\7mza\\.gemini\\antigravity-ide\\brain\\f3d45594-9389-402f-b5d7-adca506e73c8';

  console.log('1. Navigating to http://localhost:8099/sav.html...');
  await page.goto('http://localhost:8099/sav.html', { waitUntil: 'networkidle' });

  // Clear any existing draft session
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  // Wait for dynamic engine step body
  await page.waitForSelector('#savDynamicStepBody', { timeout: 10000 });
  console.log('   Dynamic engine initialized successfully!');

  // Capture Step 1 in French
  await page.screenshot({ path: path.join(artifactsDir, 'engine_step1_fr.png'), fullPage: false });
  console.log('   Saved engine_step1_fr.png');

  // Test Arabic Language Switch
  console.log('2. Switching to Arabic (العربية)...');
  await page.click('.lang-pill[data-lang="ar"]');
  await page.waitForTimeout(400);

  const htmlDir = await page.getAttribute('html', 'dir');
  const htmlLang = await page.getAttribute('html', 'lang');
  console.log(`   HTML dir="${htmlDir}", lang="${htmlLang}"`);
  if (htmlDir !== 'rtl' || htmlLang !== 'ar') {
    throw new Error('Arabic toggle did not set dir="rtl" or lang="ar"');
  }

  await page.screenshot({ path: path.join(artifactsDir, 'engine_step1_ar.png'), fullPage: false });
  console.log('   Saved engine_step1_ar.png');

  // Switch back to French
  console.log('3. Switching back to French...');
  await page.click('.lang-pill[data-lang="fr"]');
  await page.waitForTimeout(400);

  // Fill Step 1
  console.log('4. Filling Step 1 (Vos coordonnées)...');
  await page.fill('#field_13', 'Karim Benjelloun');
  await page.fill('#field_15', '0661234567');
  await page.fill('#field_82', 'karim.benjelloun@gmail.com');

  // Next step -> Step 2
  console.log('5. Clicking Continuer to Step 2...');
  await page.click('#btnStepNext');
  await page.waitForTimeout(600);

  await page.screenshot({ path: path.join(artifactsDir, 'engine_step2_problem.png'), fullPage: false });
  console.log('   Saved engine_step2_problem.png');

  // Fill Step 2 (Description)
  console.log('6. Filling Step 2 (Description détaillée)...');
  await page.fill('#field_35', "Le chauffe-eau Theros Pro-Slim ne produit plus d'eau chaude depuis ce matin.");

  // Next step -> Step 3
  console.log('7. Clicking Continuer to Step 3...');
  await page.click('#btnStepNext');
  await page.waitForTimeout(600);

  await page.screenshot({ path: path.join(artifactsDir, 'engine_step3_address.png'), fullPage: false });
  console.log('   Saved engine_step3_address.png');

  // Fill Step 3 (Address)
  console.log('8. Filling Step 3 (Adresse)...');
  await page.fill('#field_20', "14 Boulevard d'Anfa, Résidence les Palmiers, 4ème étage, Casablanca");

  // Next step -> Step 4
  console.log('9. Clicking Continuer to Step 4...');
  await page.click('#btnStepNext');
  await page.waitForTimeout(600);

  await page.screenshot({ path: path.join(artifactsDir, 'engine_step4_contract.png'), fullPage: false });
  console.log('   Saved engine_step4_contract.png');

  // Fill Step 4 (Serial, Date, and Photo attachment)
  console.log('10. Filling Step 4 (Numéro de série, Date d\'achat & Fichier)...');
  await page.fill('#field_29', 'PC202508300133');
  await page.fill('#field_84', '2025-09-15');

  // Attach sample contract webp
  const sampleFilePath = path.resolve('assets/icons/contract-sample.webp');
  await page.setInputFiles('input[type="file"]', sampleFilePath);
  await page.waitForTimeout(500);

  // Next step -> Step 5 (Review)
  console.log('11. Clicking Continuer to Step 5 (Confirmation & Révision)...');
  await page.click('#btnStepNext');
  await page.waitForTimeout(600);

  await page.screenshot({ path: path.join(artifactsDir, 'engine_step5_review.png'), fullPage: false });
  console.log('   Saved engine_step5_review.png');

  // Check consent
  console.log('12. Checking consent checkbox and submitting...');
  await page.check('#savConsent');

  // Submit Final
  await page.click('#btnSubmitFinal');

  // Wait for success panel
  console.log('13. Awaiting success panel...');
  await page.waitForSelector('#savSuccessPanel.visible', { timeout: 20000 });

  const ticketCode = await page.$eval('#displayTicketCode', el => el.textContent.trim());
  const waHref = await page.$eval('#btnWhatsAppAction', el => el.getAttribute('href'));
  console.log(`\n========================================`);
  console.log(`SUCCESS! TICKET GENERATED: ${ticketCode}`);
  console.log(`WhatsApp Link: ${waHref}`);
  console.log(`========================================\n`);

  await page.screenshot({ path: path.join(artifactsDir, 'engine_success_panel.png'), fullPage: false });
  console.log('   Saved engine_success_panel.png');

  await browser.close();
  console.log('All tests passed with flying colors!');
})();

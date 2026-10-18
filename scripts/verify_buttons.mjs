import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file:///c:/Users/7mza/nerobel/index.html');

  // Test Light Mode
  await page.evaluate(() => {
    window.themeManager.applyTheme('light');
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
  });
  await page.waitForTimeout(400);

  const cards = ['theros', 'pacific', 'eurogas', 'nerobel'];
  const lightReport = {};

  for (const b of cards) {
    const card = await page.$(`.brand-card[data-brand="${b}"]`);
    const details = await card.$('.cta-pair .btn--primary');
    const secondary = await card.$('.cta-pair .btn-secondary');
    const seal = await card.$('.seal-nerobel');

    const sDetails = await page.evaluate(el => {
      const s = window.getComputedStyle(el);
      return { text: el.innerText, color: s.color, bg: s.backgroundColor, border: s.border };
    }, details);

    const sSecondary = await page.evaluate(el => {
      const s = window.getComputedStyle(el);
      return { text: el.innerText, color: s.color, bg: s.backgroundColor, border: s.border };
    }, secondary);

    const sSeal = await page.evaluate(el => {
      const s = window.getComputedStyle(el);
      return { text: el.innerText, color: s.color, bg: s.backgroundColor, border: s.border };
    }, seal);

    lightReport[b] = { details: sDetails, secondary: sSecondary, seal: sSeal };
  }

  console.log('Light Mode Verification Report:');
  console.log(JSON.stringify(lightReport, null, 2));

  // Snapshots
  const grid = await page.$('.brands-grid-4');
  await grid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await grid.screenshot({
    path: 'C:/Users/7mza/.gemini/antigravity/brain/4ad7f767-114d-4533-920f-e3d80c1250e6/brands_grid_verified_light.png'
  });

  const therosCard = await page.$('.brand-card[data-brand="theros"]');
  await therosCard.screenshot({
    path: 'C:/Users/7mza/.gemini/antigravity/brain/4ad7f767-114d-4533-920f-e3d80c1250e6/theros_card_verified_light.png'
  });

  // Test Mobile Light Mode
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const mobileCard = await page.$('.brand-card[data-brand="theros"]');
  await mobileCard.scrollIntoViewIfNeeded();
  await mobileCard.screenshot({
    path: 'C:/Users/7mza/.gemini/antigravity/brain/4ad7f767-114d-4533-920f-e3d80c1250e6/mobile_theros_card_light.png'
  });

  // Test Dark Mode Regression Check
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.evaluate(() => {
    window.themeManager.applyTheme('dark');
  });
  await page.waitForTimeout(300);

  const darkDetails = await page.evaluate(() => {
    const el = document.querySelector('.brand-card[data-brand="theros"] .cta-pair .btn--primary');
    const s = window.getComputedStyle(el);
    return { text: el.innerText, color: s.color, bg: s.backgroundColor, border: s.border };
  });

  console.log('Dark Mode Verification Check:');
  console.log(JSON.stringify(darkDetails, null, 2));

  await grid.screenshot({
    path: 'C:/Users/7mza/.gemini/antigravity/brain/4ad7f767-114d-4533-920f-e3d80c1250e6/brands_grid_verified_dark.png'
  });

  await browser.close();
  console.log('All verification snapshots complete.');
})();

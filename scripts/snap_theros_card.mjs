import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file:///c:/Users/7mza/nerobel/index.html');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  
  const brandCard = await page.$('.brand-card[data-brand="theros"]');
  await brandCard.screenshot({ path: 'C:/Users/7mza/.gemini/antigravity/brain/4ad7f767-114d-4533-920f-e3d80c1250e6/theros_card_light.png' });
  
  const grid = await page.$('.brands-grid-4');
  await grid.screenshot({ path: 'C:/Users/7mza/.gemini/antigravity/brain/4ad7f767-114d-4533-920f-e3d80c1250e6/brands_grid_light.png' });
  
  await browser.close();
})();

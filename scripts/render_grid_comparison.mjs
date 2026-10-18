import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  
  // Test Obsidian Solid
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto('file:///c:/Users/7mza/nerobel/index.html');
    await page.evaluate(() => {
      window.themeManager.applyTheme('light');
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    });
    await page.addStyleTag({
      content: `
        [data-theme="light"] .brand-card .cta-pair .btn--primary {
          background: #0F172A !important;
          color: #FFFFFF !important;
          border-color: #0F172A !important;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.12) !important;
        }
        [data-theme="light"] .brand-card .cta-pair .btn--primary:hover {
          background: #1E293B !important;
          border-color: #1E293B !important;
          color: #FFFFFF !important;
        }
        [data-theme="light"] .brand-card .cta-pair .btn--ghost,
        [data-theme="light"] .brand-card .cta-pair .btn-secondary {
          background: #F1F5F9 !important;
          color: #0F172A !important;
          border: 1px solid #CBD5E1 !important;
        }
        [data-theme="light"] .brand-card .cta-pair .btn--ghost i,
        [data-theme="light"] .brand-card .cta-pair .btn-secondary i {
          color: #1D4ED8 !important;
        }
      `
    });
    const grid = await page.$('.brands-grid-4');
    await grid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await grid.screenshot({
      path: 'C:/Users/7mza/.gemini/antigravity/brain/4ad7f767-114d-4533-920f-e3d80c1250e6/grid_obsidian_solid.png'
    });
    await page.close();
  }

  // Test Saphir Impérial Solid
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto('file:///c:/Users/7mza/nerobel/index.html');
    await page.evaluate(() => {
      window.themeManager.applyTheme('light');
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    });
    await page.addStyleTag({
      content: `
        [data-theme="light"] .brand-card .cta-pair .btn--primary {
          background: #1D4ED8 !important;
          color: #FFFFFF !important;
          border-color: #1D4ED8 !important;
          box-shadow: 0 4px 12px rgba(29, 78, 216, 0.22) !important;
        }
        [data-theme="light"] .brand-card .cta-pair .btn--primary:hover {
          background: #1E40AF !important;
          border-color: #1E40AF !important;
          color: #FFFFFF !important;
        }
        [data-theme="light"] .brand-card .cta-pair .btn--ghost,
        [data-theme="light"] .brand-card .cta-pair .btn-secondary {
          background: #F1F5F9 !important;
          color: #0F172A !important;
          border: 1px solid #CBD5E1 !important;
        }
        [data-theme="light"] .brand-card .cta-pair .btn--ghost i,
        [data-theme="light"] .brand-card .cta-pair .btn-secondary i {
          color: #1D4ED8 !important;
        }
      `
    });
    const grid = await page.$('.brands-grid-4');
    await grid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await grid.screenshot({
      path: 'C:/Users/7mza/.gemini/antigravity/brain/4ad7f767-114d-4533-920f-e3d80c1250e6/grid_sapphire_solid.png'
    });
    await page.close();
  }

  await browser.close();
  console.log('Grid screenshots captured.');
})();

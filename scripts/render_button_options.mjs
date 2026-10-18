import { chromium } from 'playwright';

const options = [
  {
    id: 'opt1_obsidian_solid',
    name: 'Option 1: Obsidian Slate Solid (#0F172A) + White Text',
    css: `
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
  },
  {
    id: 'opt2_sapphire_solid',
    name: 'Option 2: Saphir Impérial Blue Solid (#1D4ED8) + White Text',
    css: `
      [data-theme="light"] .brand-card .cta-pair .btn--primary {
        background: #1D4ED8 !important;
        color: #FFFFFF !important;
        border-color: #1D4ED8 !important;
        box-shadow: 0 4px 12px rgba(29, 78, 216, 0.25) !important;
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
  },
  {
    id: 'opt3_sapphire_outline',
    name: 'Option 3: Saphir Impérial Outline (1.5px border #1D4ED8, Text #1D4ED8)',
    css: `
      [data-theme="light"] .brand-card .cta-pair .btn--primary {
        background: rgba(29, 78, 216, 0.06) !important;
        color: #1D4ED8 !important;
        border: 1.5px solid #1D4ED8 !important;
      }
      [data-theme="light"] .brand-card .cta-pair .btn--primary:hover {
        background: #1D4ED8 !important;
        color: #FFFFFF !important;
        border-color: #1D4ED8 !important;
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
  },
  {
    id: 'opt4_obsidian_outline',
    name: 'Option 4: Obsidian Outline (1.5px border #0F172A, Text #0F172A)',
    css: `
      [data-theme="light"] .brand-card .cta-pair .btn--primary {
        background: #FFFFFF !important;
        color: #0F172A !important;
        border: 1.5px solid #0F172A !important;
      }
      [data-theme="light"] .brand-card .cta-pair .btn--primary:hover {
        background: #0F172A !important;
        color: #FFFFFF !important;
        border-color: #0F172A !important;
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
  }
];

(async () => {
  const browser = await chromium.launch();
  for (const opt of options) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto('file:///c:/Users/7mza/nerobel/index.html');
    await page.evaluate(() => {
      window.themeManager.applyTheme('light');
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    });
    
    // Inject test CSS
    await page.addStyleTag({ content: opt.css });
    
    const therosCard = await page.$('.brand-card[data-brand="theros"]');
    await therosCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    
    await therosCard.screenshot({
      path: `C:/Users/7mza/.gemini/antigravity/brain/4ad7f767-114d-4533-920f-e3d80c1250e6/test_${opt.id}.png`
    });
    
    await page.close();
  }
  await browser.close();
  console.log('All option screenshots re-rendered with full reveal.');
})();

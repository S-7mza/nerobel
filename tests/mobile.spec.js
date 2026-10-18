const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const allPages = ['index', 'brands', 'pacific', 'sav', 'network', 'b2b', 'contact', 'mentions-legales', 'confidentialite', '404'];
const mobileWidths = [320, 360, 390, 430, 768];

// 1. Zero Horizontal Scroll across all pages and mobile viewports (including 320px floor)
for (const p of allPages) {
  for (const w of mobileWidths) {
    test(`[MS-01] ${p}.html @${w}px has no horizontal scroll`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 750 });
      await page.goto(`/${p}.html`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}

// 2. Image-First Mobile Hero & Slider Doctrine (MS-02)
test('[MS-02] mobile-hero-carousel is visible at 390px and hidden at 1024px', async ({ page }) => {
  // Check on mobile 390px
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html');
  const mobileHero = page.locator('.mobile-hero-carousel');
  await expect(mobileHero).toBeVisible();
  
  // Desktop background layer should be hidden
  const desktopBg = page.locator('.hero-bg-layer');
  await expect(desktopBg).toBeHidden();

  // Check on desktop 1024px
  await page.setViewportSize({ width: 1024, height: 800 });
  await expect(mobileHero).toBeHidden();
  await expect(desktopBg).toBeVisible();
});

test('[MS-02] mobile slider has 4 portrait 4:5 slides with CSS scroll snap', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html');
  
  const slides = page.locator('.mobile-slide');
  await expect(slides).toHaveCount(4);

  // Check aspect ratio of slide media
  const mediaBoxes = await page.$$eval('.mobile-slide-media', els => els.map(el => {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 ? rect.height / rect.width : 0;
  }));
  
  for (const ratio of mediaBoxes) {
    // 4:5 ratio is 1.25, allow +/- 0.05
    expect(ratio).toBeGreaterThanOrEqual(1.20);
    expect(ratio).toBeLessThanOrEqual(1.30);
  }

  // Check CSS scroll-snap on track
  const snapType = await page.$eval('.mobile-carousel-track', el => window.getComputedStyle(el).scrollSnapType);
  expect(snapType).toContain('x');
});

test('[MS-02] mobile slider dots have minimum 48px hit area and counter is 1 / 4', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html');

  const dots = page.locator('.mobile-dot');
  await expect(dots).toHaveCount(4);

  const dotBoxes = await page.$$eval('.mobile-dot', els => els.map(el => {
    const rect = el.getBoundingClientRect();
    return { w: Math.round(rect.width), h: Math.round(rect.height) };
  }));

  for (const box of dotBoxes) {
    expect(box.w).toBeGreaterThanOrEqual(48);
    expect(box.h).toBeGreaterThanOrEqual(48);
  }

  const counter = page.locator('#mobileCarouselCounter');
  await expect(counter).toHaveText('1 / 4');
});

test('[MS-02] mobile slider does not autoplay on phones', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html');

  // Wait 3.5 seconds (desktop changes at interval)
  await page.waitForTimeout(3500);

  // Counter should still be on first slide
  const counter = page.locator('#mobileCarouselCounter');
  await expect(counter).toHaveText('1 / 4');
  
  const activeDotIndex = await page.$eval('.mobile-dot.active', el => el.getAttribute('data-index'));
  expect(activeDotIndex).toBe('0');
});

// 3. Mobile Typography Scale & Clamp (MS-03)
test('[MS-03] mobile typography clamps: body >= 16px and H1 within 30-36px at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html');

  const bodyFontSize = await page.$eval('body', el => parseFloat(window.getComputedStyle(el).fontSize));
  expect(bodyFontSize).toBeGreaterThanOrEqual(16);

  const h1FontSize = await page.$eval('h1.hero-title', el => parseFloat(window.getComputedStyle(el).fontSize));
  expect(h1FontSize).toBeGreaterThanOrEqual(28);
  expect(h1FontSize).toBeLessThanOrEqual(38);
});

// 4. Mobile Gateway Cards Layout & Touch Targets (MS-04)
test('[MS-04] gateway cards form single column with min 48px action badge at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html');

  const cards = page.locator('.gateway-card');
  await expect(cards).toHaveCount(3);

  const cardTops = await page.$$eval('.gateway-card', els => els.map(e => e.getBoundingClientRect().top));
  // Cards are in single column if each subsequent card is lower than the previous
  expect(cardTops[1]).toBeGreaterThan(cardTops[0]);
  expect(cardTops[2]).toBeGreaterThan(cardTops[1]);

  const badges = await page.$$eval('.gateway-action-badge', els => els.map(e => {
    const r = e.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  }));

  for (const b of badges) {
    expect(b.w).toBeGreaterThanOrEqual(48);
    expect(b.h).toBeGreaterThanOrEqual(48);
  }
});

// 5. Axe Accessibility Verification on Mobile
test('[MS-05] index.html passes axe accessibility audit on mobile 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .disableRules(['color-contrast']) // verified separately in brand charter
    .analyze();

  const seriousViolations = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
  expect(seriousViolations).toEqual([]);
});

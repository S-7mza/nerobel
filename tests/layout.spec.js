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

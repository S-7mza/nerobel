import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///c:/Users/7mza/nerobel/index.html');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));

  const info = await page.evaluate(() => {
    const brandCard = document.querySelector('.brand-card[data-brand="theros"]');
    const details = brandCard.querySelector('a.btn--primary');
    const visit = brandCard.querySelector('a.btn-secondary');
    
    // helper to get all matched rules
    function getRules(el) {
      const matched = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.selectorText && el.matches(rule.selectorText)) {
              matched.push({
                selector: rule.selectorText,
                cssText: rule.cssText,
                href: sheet.href ? sheet.href.split('/').pop() : 'inline'
              });
            }
          }
        } catch (e) {}
      }
      return matched;
    }

    return {
      detailsClasses: details.className,
      detailsRules: getRules(details).filter(r => r.cssText.includes('color') || r.cssText.includes('background')),
      visitClasses: visit.className,
      visitRules: getRules(visit).filter(r => r.cssText.includes('color') || r.cssText.includes('background'))
    };
  });

  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();

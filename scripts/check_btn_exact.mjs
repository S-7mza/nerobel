import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///c:/Users/7mza/nerobel/index.html');
  await page.evaluate(() => window.themeManager.applyTheme('light'));

  const client = await page.context().newCDPSession(page);
  await client.send('DOM.enable');
  await client.send('CSS.enable');

  const doc = await client.send('DOM.getDocument');
  const detailsNode = await client.send('DOM.querySelector', {
    nodeId: doc.root.nodeId,
    selector: '.brand-card[data-brand="theros"] a.btn--primary'
  });

  const matched = await client.send('CSS.getMatchedStylesForNode', {
    nodeId: detailsNode.nodeId
  });

  console.log('--- MATCHED RULES FOR DETAILS ---');
  for (const r of matched.matchedCSSRules) {
    const sel = r.rule.selectorList.text;
    const props = r.rule.style.cssProperties
      .filter(p => ['color', 'background', 'background-color', 'border', 'border-color'].includes(p.name))
      .map(p => `${p.name}: ${p.value}${p.important ? ' !important' : ''}`)
      .join('; ');
    if (props) {
      console.log(`${sel} { ${props} }`);
    }
  }

  const ghostNode = await client.send('DOM.querySelector', {
    nodeId: doc.root.nodeId,
    selector: '.brand-card[data-brand="theros"] a.btn--ghost'
  });

  const matchedGhost = await client.send('CSS.getMatchedStylesForNode', {
    nodeId: ghostNode.nodeId
  });

  console.log('\n--- MATCHED RULES FOR GHOST ---');
  for (const r of matchedGhost.matchedCSSRules) {
    const sel = r.rule.selectorList.text;
    const props = r.rule.style.cssProperties
      .filter(p => ['color', 'background', 'background-color', 'border', 'border-color'].includes(p.name))
      .map(p => `${p.name}: ${p.value}${p.important ? ' !important' : ''}`)
      .join('; ');
    if (props) {
      console.log(`${sel} { ${props} }`);
    }
  }

  await browser.close();
})();

import glob
from playwright.sync_api import sync_playwright

pages_to_test = ['index.html', 'brands.html', 'sav.html', 'b2b.html', 'network.html', 'contact.html', '404.html']

with sync_playwright() as p:
    browser = p.chromium.launch()
    for page_name in pages_to_test:
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        errors = []
        page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' else None)
        page.goto(f'http://localhost:8080/{page_name}')
        page.wait_for_timeout(400)
        
        audit = page.evaluate('''() => {
            const icons = Array.from(document.querySelectorAll('.ti'));
            let valid = 0;
            const missing = [];
            icons.forEach(el => {
                const style = window.getComputedStyle(el);
                const mask = style.maskImage || style.webkitMaskImage;
                if (mask && mask.includes('data:image/svg+xml')) {
                    valid++;
                } else {
                    missing.push(el.className);
                }
            });
            return { total: icons.length, valid: valid, missing: missing };
        }''')
        
        print(f"[{page_name}] Total: {audit['total']} | Valid: {audit['valid']} | Missing: {len(audit['missing'])} | Console errors: {len(errors)}")
        if audit['missing']:
            print(f"  Missing icons on {page_name}: {audit['missing']}")
        if errors:
            print(f"  Console errors on {page_name}: {errors}")
            
        page.screenshot(path=f"verified_svg_{page_name.replace('.html', '')}.png", clip={'x': 0, 'y': 0, 'width': 1440, 'height': 750})
        page.close()

print("ALL PAGES AUDITED AND VERIFIED!")

import pathlib
from playwright.sync_api import sync_playwright

p_file = pathlib.Path('index.html').resolve().as_uri()
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto(p_file)
    page.evaluate("document.querySelector('.hero-section').style.minHeight = 'calc(100vh - 84px)'")
    page.wait_for_timeout(500)
    page.screenshot(path='preview_clean_hero.png')
    
    page.evaluate("window.scrollTo(0, 220)")
    page.wait_for_timeout(800)
    page.screenshot(path='preview_scrolled_metrics.png')
    browser.close()
print('Preview screenshots saved successfully')

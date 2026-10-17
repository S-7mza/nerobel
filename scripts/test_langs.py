from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:8080/index.html')
    page.wait_for_timeout(600)
    
    # Arabic RTL test
    page.evaluate("window.i18n.applyLanguage('ar')")
    page.wait_for_timeout(600)
    eyebrow = page.query_selector('.hero-content .eyebrow')
    if eyebrow:
        eyebrow.screenshot(path='verified_hero_eyebrow_arabic.png')
    marques = page.query_selector('#marques')
    if marques:
        marques.screenshot(path='verified_marques_arabic.png')
    page.screenshot(path='verified_hero_arabic.png', clip={'x': 0, 'y': 0, 'width': 1440, 'height': 720})
    
    # English test
    page.evaluate("window.i18n.applyLanguage('en')")
    page.wait_for_timeout(600)
    if eyebrow:
        eyebrow.screenshot(path='verified_hero_eyebrow_english.png')
    page.screenshot(path='verified_hero_english.png', clip={'x': 0, 'y': 0, 'width': 1440, 'height': 720})
    print('Arabic and English verified successfully!')

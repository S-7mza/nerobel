from playwright.sync_api import sync_playwright
import os

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    file_path = os.path.abspath('index.html')
    page.goto(f'file:///{file_path}')
    page.wait_for_timeout(500)
    
    # 1. Screenshot collapsed state
    page.screenshot(path='screenshot_lang_collapsed.png')
    
    # 2. Click trigger to open dropdown
    page.click('.lang-dropdown-trigger')
    page.wait_for_timeout(400)
    page.screenshot(path='screenshot_lang_expanded.png')
    
    # 3. Click English
    page.click('.lang-menu-item[data-lang="en"]')
    page.wait_for_timeout(500)
    page.screenshot(path='screenshot_lang_english.png')
    
    # 4. Open dropdown again and click Arabic
    page.click('.lang-dropdown-trigger')
    page.wait_for_timeout(300)
    page.click('.lang-menu-item[data-lang="ar"]')
    page.wait_for_timeout(500)
    page.screenshot(path='screenshot_lang_arabic.png')
    
    # 5. Test Light Mode Expanded
    page.evaluate("document.documentElement.setAttribute('data-theme', 'light')")
    page.click('.lang-dropdown-trigger')
    page.wait_for_timeout(300)
    page.screenshot(path='screenshot_lang_light_expanded.png')

    browser.close()
print("All test screenshots completed successfully!")

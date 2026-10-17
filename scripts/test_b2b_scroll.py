from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    c = b.new_context(viewport={'width': 1440, 'height': 900})
    page = c.new_page()
    page.goto('http://localhost:8080/b2b.html')
    page.wait_for_timeout(600)
    page.evaluate("document.querySelector('.tech-downloads-grid').scrollIntoView({behavior: 'instant'})")
    page.wait_for_timeout(500)
    page.screenshot(path='v4_b2b_downloads_visible.png')
    print("Captured v4_b2b_downloads_visible.png")
    b.close()

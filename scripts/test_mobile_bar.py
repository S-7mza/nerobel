from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    c = b.new_context(viewport={'width': 390, 'height': 844})
    page = c.new_page()
    page.goto('http://localhost:8080/brands.html')
    page.wait_for_timeout(600)
    el = page.query_selector('.mobile-sticky-bar')
    if el:
        el.screenshot(path='v4_mobile_bar_element.png')
        print("Captured v4_mobile_bar_element.png")
    page.screenshot(path='v4_mobile_viewport_clean.png')
    print("Captured v4_mobile_viewport_clean.png")
    b.close()

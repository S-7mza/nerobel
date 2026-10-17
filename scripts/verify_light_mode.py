from playwright.sync_api import sync_playwright
import os

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    file_path = os.path.abspath("index.html")
    page.goto(f"file:///{file_path}")
    page.evaluate('document.documentElement.setAttribute("data-theme", "light")')
    page.wait_for_timeout(500)
    page.screenshot(path="screenshot_index_light_verified.png")
    
    page.locator("#marques").scroll_into_view_if_needed()
    page.wait_for_timeout(500)
    page.screenshot(path="screenshot_marques_light_verified.png")
    browser.close()
print("Light mode screenshots taken successfully!")

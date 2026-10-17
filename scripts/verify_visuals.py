import time
from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()

        # 1. Homepage Index
        page.goto('http://localhost:8080/index.html')
        page.wait_for_timeout(1500)
        page.screenshot(path='v3_index_full.png', full_page=True)
        print("Captured v3_index_full.png")

        # Scroll to GROHE collection slider and test next button
        page.evaluate("document.getElementById('collections-signatures').scrollIntoView({behavior: 'instant'})")
        page.wait_for_timeout(600)
        next_btn = page.query_selector('#collNextBtn')
        prev_btn = page.query_selector('#collPrevBtn')
        if next_btn and not next_btn.is_disabled():
            next_btn.click()
            page.wait_for_timeout(800)
            page.screenshot(path='v3_slider_active.png')
            print("Captured v3_slider_active.png")

        # 2. Brands Page
        page.goto('http://localhost:8080/brands.html')
        page.wait_for_timeout(1500)
        page.screenshot(path='v3_brands_full.png', full_page=True)
        print("Captured v3_brands_full.png")

        # 3. 404 Page
        page.goto('http://localhost:8080/404.html')
        page.wait_for_timeout(1000)
        page.screenshot(path='v3_404.png')
        print("Captured v3_404.png")

        # 4. B2B Page
        page.goto('http://localhost:8080/b2b.html')
        page.wait_for_timeout(1500)
        page.screenshot(path='v3_b2b.png', full_page=True)
        print("Captured v3_b2b.png")

        # 5. Contact Page
        page.goto('http://localhost:8080/contact.html')
        page.wait_for_timeout(1500)
        page.screenshot(path='v3_contact.png', full_page=True)
        print("Captured v3_contact.png")

        # 6. Network Page
        page.goto('http://localhost:8080/network.html')
        page.wait_for_timeout(2000)
        page.screenshot(path='v3_network.png', full_page=True)
        print("Captured v3_network.png")

        # 7. Mobile Viewport Index
        mobile_context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True)
        mobile_page = mobile_context.new_page()
        mobile_page.goto('http://localhost:8080/index.html')
        mobile_page.wait_for_timeout(1500)
        mobile_page.screenshot(path='v3_index_mobile.png')
        print("Captured v3_index_mobile.png")

        browser.close()
        print("ALL VERIFICATION SCREENSHOTS CAPTURED!")

if __name__ == '__main__':
    main()

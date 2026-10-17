from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 1000})

        page.goto('http://localhost:8080/brands.html#theros')
        page.wait_for_timeout(1000)

        # Scroll to theros section
        theros_sec = page.query_selector('#theros')
        if theros_sec:
            theros_sec.scroll_into_view_if_needed()
            page.wait_for_timeout(800)
            theros_sec.screenshot(path='preview_theros_brand_replaced.png')
            print('Captured preview_theros_brand_replaced.png')

        frame = page.query_selector('.brand-showcase-frame')
        if frame:
            frame.scroll_into_view_if_needed()
            page.wait_for_timeout(400)
            frame.screenshot(path='preview_theros_brand_frame.png')
            print('Captured preview_theros_brand_frame.png')

        browser.close()

if __name__ == '__main__':
    main()

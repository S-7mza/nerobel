from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 900})

        # 1. Brands Page
        page.goto('http://localhost:8080/brands.html#theros')
        page.wait_for_timeout(1000)
        showcase = page.query_selector('#theros')
        if showcase:
            showcase.scroll_into_view_if_needed()
            page.wait_for_timeout(500)
            showcase.screenshot(path='brands_theros_final_live.png')
            print('Captured brands_theros_final_live.png')

        # 2. Homepage Collections Carousel
        page.goto('http://localhost:8080/index.html#collections')
        page.wait_for_timeout(1000)
        colls = page.query_selector('#collections')
        if colls:
            colls.scroll_into_view_if_needed()
            page.wait_for_timeout(500)
            colls.screenshot(path='homepage_collections_theros.png')
            print('Captured homepage_collections_theros.png')

        browser.close()

if __name__ == '__main__':
    main()

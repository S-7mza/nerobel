from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 900})

        # 1. Capture SAV Sidebar (Dark Theme)
        page.goto('http://localhost:8080/sav.html')
        page.wait_for_timeout(1000)
        sidebar = page.query_selector('.sav-sidebar')
        if sidebar:
            sidebar.scroll_into_view_if_needed()
            page.wait_for_timeout(400)
            sidebar.screenshot(path='final_sav_sidebar_dark.png')
            print('Captured final_sav_sidebar_dark.png')

        # 2. Capture Tracking Search Card (Dark Theme)
        track_tab = page.query_selector('[data-tab="track"]')
        if track_tab:
            track_tab.click()
            page.wait_for_timeout(600)
            search_card = page.query_selector('.tracker-search-card')
            if search_card:
                search_card.scroll_into_view_if_needed()
                page.wait_for_timeout(300)
                search_card.screenshot(path='final_sav_tracker_search_dark.png')
                print('Captured final_sav_tracker_search_dark.png')

        # 3. Capture Homepage Tracker Box (Dark Theme with scroll reveal active)
        page.goto('http://localhost:8080/index.html')
        page.wait_for_timeout(1000)
        tracker_box = page.query_selector('.tracker-box')
        if tracker_box:
            tracker_box.scroll_into_view_if_needed()
            page.wait_for_timeout(800)
            tracker_box.screenshot(path='final_homepage_tracker_box_dark.png')
            print('Captured final_homepage_tracker_box_dark.png')

        # 4. Light Mode Verification
        page.goto('http://localhost:8080/sav.html')
        page.wait_for_timeout(600)
        page.evaluate("() => document.documentElement.setAttribute('data-theme', 'light')")
        page.wait_for_timeout(400)
        sidebar_light = page.query_selector('.sav-sidebar')
        if sidebar_light:
            sidebar_light.screenshot(path='final_sav_sidebar_light.png')
            print('Captured final_sav_sidebar_light.png')

        browser.close()

if __name__ == '__main__':
    main()

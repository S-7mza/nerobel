import time
from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()

        print("--- Testing brands.html ---")
        page.goto('http://localhost:8080/brands.html')
        page.wait_for_timeout(1000)

        # 1. Theros Wi-Fi Simulator Interaction
        theros_slider = page.query_selector('#therosTempSlider')
        if theros_slider:
            page.fill('#therosTempSlider', '68')
            page.dispatch_event('#therosTempSlider', 'input')
            turbo_btn = page.query_selector('.power-mode-btn[data-power="2000"]')
            if turbo_btn:
                turbo_btn.click()
            page.wait_for_timeout(400)
            print("Interacted with Theros Wi-Fi Simulator (68C Turbo)")

        # 2. Pacific Vertical Toggle Interaction
        pacific_v = page.query_selector('#btnPacificV')
        if pacific_v:
            pacific_v.click()
            page.wait_for_timeout(400)
            print("Toggled Pacific 360 to Vertical Mode")

        # 3. Eurogas ODS Simulator Interaction
        ods_btn = page.query_selector('#btnTestOds')
        if ods_btn:
            ods_btn.click()
            page.wait_for_timeout(600)
            print("Triggered Eurogas ODS Gas Cutoff Test")

        page.screenshot(path='v4_brands_interactive.png', full_page=True)
        print("Captured v4_brands_interactive.png")

        print("--- Testing sav.html ---")
        page.goto('http://localhost:8080/sav.html')
        page.wait_for_timeout(1000)

        # Tab 2: Warranty Registration
        warranty_tab = page.query_selector('.sav-tab-btn[data-tab="warranty"]')
        if warranty_tab:
            warranty_tab.click()
            page.wait_for_timeout(400)
            page.fill('#wName', 'Mohamed Alami')
            page.fill('#wPhone', '0661234567')
            page.fill('#wSerial', 'TH202688921')
            page.fill('#wDate', '2026-03-15')
            page.fill('#wStore', 'Showroom Nerobel Casablanca')
            page.click('#warrantyRegForm button[type="submit"]')
            page.wait_for_timeout(600)
            page.screenshot(path='v4_sav_warranty_cert.png')
            print("Captured v4_sav_warranty_cert.png")

        # Tab 3: Nexenflow Live Tracker
        tracker_tab = page.query_selector('.sav-tab-btn[data-tab="tracker"]')
        if tracker_tab:
            tracker_tab.click()
            page.wait_for_timeout(400)
            page.fill('#liveTrackInput', 'NERO-2026-9842')
            page.click('#btnLiveTrack')
            page.wait_for_timeout(400)
            page.screenshot(path='v4_sav_nexenflow_tracker.png')
            print("Captured v4_sav_nexenflow_tracker.png")

        print("--- Testing network.html ---")
        page.goto('http://localhost:8080/network.html')
        page.wait_for_timeout(1500)
        # Select GSB filter
        page.select_option('#filterType', 'gsb')
        page.wait_for_timeout(600)
        page.screenshot(path='v4_network_filtered.png')
        print("Captured v4_network_filtered.png")

        print("--- Testing b2b.html ---")
        page.goto('http://localhost:8080/b2b.html')
        page.wait_for_timeout(1000)
        page.screenshot(path='v4_b2b_downloads.png', full_page=True)
        print("Captured v4_b2b_downloads.png")

        print("--- Testing Mobile Sticky Bar ---")
        mobile_context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True)
        m_page = mobile_context.new_page()
        m_page.goto('http://localhost:8080/brands.html')
        m_page.wait_for_timeout(1000)
        m_page.screenshot(path='v4_mobile_sticky_bar.png')
        print("Captured v4_mobile_sticky_bar.png")

        browser.close()
        print("All visual verification tests completed successfully!")

if __name__ == '__main__':
    main()

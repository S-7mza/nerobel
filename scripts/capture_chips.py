from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        page.goto('http://localhost:8080/sav.html')
        page.wait_for_timeout(1000)
        
        # Switch to tracker tab
        page.evaluate("document.querySelector('.sav-tab-btn[data-tab=\"tracker\"]').click()")
        page.wait_for_timeout(600)
        
        samples = page.query_selector('.tracker-samples-row')
        if samples:
            samples.screenshot(path='new_sample_chips.png')
            
        active_chip = page.query_selector('.sample-chip.active')
        if active_chip:
            active_chip.screenshot(path='new_sample_chip_active.png')
            
        print('Captured new_sample_chips.png and new_sample_chip_active.png')

if __name__ == '__main__':
    main()

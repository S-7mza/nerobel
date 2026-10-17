from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        
        # 1. Dark Mode
        page.goto('http://localhost:8080/index.html')
        page.wait_for_timeout(1000)
        
        # Clip header
        header = page.query_selector('.site-header')
        if header:
            header.screenshot(path='new_header_buttons.png')
            
        # Clip hero content actions
        hero_actions = page.query_selector('.hero-actions')
        if hero_actions:
            hero_actions.screenshot(path='new_hero_buttons.png')
            
        # Full hero area
        page.screenshot(path='new_hero_section.png', clip={'x': 0, 'y': 0, 'width': 1440, 'height': 750})
        
        # Hover on Primary CTA
        primary_btn = page.query_selector('.hero-actions .btn-primary')
        if primary_btn:
            primary_btn.hover()
            page.wait_for_timeout(400)
            hero_actions.screenshot(path='new_hero_buttons_hover_primary.png')
            
        # Hover on Secondary CTA
        outline_btn = page.query_selector('.hero-actions .btn-outline-blue')
        if outline_btn:
            outline_btn.hover()
            page.wait_for_timeout(400)
            hero_actions.screenshot(path='new_hero_buttons_hover_secondary.png')
            
        # Hover on Header SAV button
        sav_btn = page.query_selector('.btn-cta-sav')
        if sav_btn:
            sav_btn.hover()
            page.wait_for_timeout(400)
            header.screenshot(path='new_header_buttons_hover.png')

        # 2. Light Mode
        page.evaluate("document.documentElement.setAttribute('data-theme', 'light')")
        page.wait_for_timeout(500)
        page.screenshot(path='new_hero_light.png', clip={'x': 0, 'y': 0, 'width': 1440, 'height': 750})
        hero_actions = page.query_selector('.hero-actions')
        if hero_actions:
            hero_actions.screenshot(path='new_hero_buttons_light.png')
            
        print('All button screenshots successfully captured!')

if __name__ == '__main__':
    main()

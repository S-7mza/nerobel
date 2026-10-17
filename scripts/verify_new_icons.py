from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        
        # 1. Dark Mode Index
        page.goto('http://localhost:8080/index.html')
        page.wait_for_timeout(1000)
        
        # Capture Eyebrow closeup
        eyebrow = page.query_selector('.hero-content .eyebrow')
        if eyebrow:
            eyebrow.screenshot(path='verified_hero_eyebrow_dark.png')
            print('Saved verified_hero_eyebrow_dark.png')
            
        # Capture Hero Section
        page.screenshot(path='verified_hero_dark.png', clip={'x': 0, 'y': 0, 'width': 1440, 'height': 720})
        print('Saved verified_hero_dark.png')
        
        # Capture Collections Eyebrow
        coll_header = page.query_selector('.collection-header')
        if coll_header:
            coll_header.screenshot(path='verified_collections_eyebrow.png')
            print('Saved verified_collections_eyebrow.png')
            
        # Capture Brands Grid with Brand Eyebrows
        marques = page.query_selector('#marques')
        if marques:
            marques.screenshot(path='verified_marques_grid.png')
            print('Saved verified_marques_grid.png')
            
        # Capture Group Story / About Section
        group_story = page.query_selector('.group-story-grid')
        if group_story:
            group_story.screenshot(path='verified_group_story.png')
            print('Saved verified_group_story.png')
            
        # 2. Light Mode
        page.evaluate("document.documentElement.setAttribute('data-theme', 'light')")
        page.wait_for_timeout(500)
        if eyebrow:
            eyebrow.screenshot(path='verified_hero_eyebrow_light.png')
            print('Saved verified_hero_eyebrow_light.png')
            
        # 3. Arabic Mode (RTL)
        page.evaluate("setLang('ar')")
        page.wait_for_timeout(500)
        if eyebrow:
            eyebrow.screenshot(path='verified_hero_eyebrow_arabic.png')
            print('Saved verified_hero_eyebrow_arabic.png')
            
        print('All verification screenshots complete!')

if __name__ == '__main__':
    main()

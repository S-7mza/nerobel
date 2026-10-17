from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        
        # 1. Homepage Index - Story Section
        page.goto('http://localhost:8080/index.html')
        page.wait_for_timeout(1000)
        
        story = page.query_selector('#groupe')
        if story:
            story.screenshot(path='preview_story_section.png')
            
        coll = page.query_selector('#collections-signatures')
        if coll:
            coll.screenshot(path='preview_collections_updated.png')
            
        # 2. Brands Page - Nerobel Tech Showcase Frame
        page.goto('http://localhost:8080/brands.html')
        page.wait_for_timeout(1000)
        tech = page.query_selector('#nerobel-tech')
        if tech:
            tech.screenshot(path='preview_brands_tech.png')
            
        print('All previews successfully captured!')

if __name__ == '__main__':
    main()

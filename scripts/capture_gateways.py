from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 1100})
    page.goto('file:///c:/Users/7mza/nerobel/index.html')
    page.wait_for_timeout(1000)
    
    gateways = page.locator('#portails')
    gateways.scroll_into_view_if_needed()
    page.wait_for_timeout(800)
    
    # Hover over Card 1
    card1 = page.locator('.gateway-card').first
    box = card1.bounding_box()
    page.mouse.move(box['x'] + box['width']/2, box['y'] + box['height']/2)
    page.wait_for_timeout(500)
    
    gateways.screenshot(path='C:/Users/7mza/nerobel/gateways_hover_card1.png')
    print('Saved hover card 1 screenshot')
    
    browser.close()

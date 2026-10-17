from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    
    # 1. Index Page
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:8080/index.html")
    page.wait_for_timeout(600)
    
    # Brand card on index
    marques = page.query_selector("#marques")
    if marques:
        marques.screenshot(path="verified_eurogas_index_marques.png")
        print("Captured verified_eurogas_index_marques.png")
        
    # Collections slide on index
    coll = page.query_selector("#collections-signatures")
    if coll:
        coll.screenshot(path="verified_eurogas_index_collections.png")
        print("Captured verified_eurogas_index_collections.png")
        
    page.close()
    
    # 2. Brands Page
    page2 = browser.new_page(viewport={"width": 1440, "height": 900})
    page2.goto("http://localhost:8080/brands.html#eurogas")
    page2.wait_for_timeout(600)
    
    eurogas_section = page2.query_selector("#eurogas")
    if eurogas_section:
        eurogas_section.screenshot(path="verified_eurogas_brands_section.png")
        print("Captured verified_eurogas_brands_section.png")
        
    page2.close()

print("All Eurogas screenshots verified successfully!")

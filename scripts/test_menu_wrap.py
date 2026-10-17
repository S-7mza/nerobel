from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    for w in [1080, 1150, 1200, 1280, 1366, 1440, 1600]:
        c = b.new_context(viewport={'width': w, 'height': 800})
        page = c.new_page()
        page.goto('http://localhost:8080/brands.html')
        page.wait_for_timeout(300)
        h_height = page.evaluate('document.querySelector(".header-inner").getBoundingClientRect().height')
        nav_height = page.evaluate('document.querySelector(".nav-menu").getBoundingClientRect().height')
        first_top = page.evaluate('document.querySelectorAll(".nav-menu li")[0].getBoundingClientRect().top')
        last_top = page.evaluate('document.querySelectorAll(".nav-menu li")[document.querySelectorAll(".nav-menu li").length-1].getBoundingClientRect().top')
        is_multi = first_top != last_top
        print(f"Width: {w}px -> header: {h_height}px, nav: {nav_height}px, multi-row nav: {is_multi}")
    b.close()

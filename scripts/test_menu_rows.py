import time
from playwright.sync_api import sync_playwright

def verify_single_row_menus():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # 1. Test Network Page Filter Bar & Header at 1440px
        page.goto("http://localhost:8080/network.html")
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        # Check .filters-bar child positions
        filters_bar = page.locator(".filters-bar")
        groups = page.locator(".filters-bar .filter-group").all()
        print(f"Filters found: {len(groups)}")
        bboxes = [g.bounding_box() for g in groups]
        for i, box in enumerate(bboxes):
            print(f"Filter {i}: x={box['x']}, y={box['y']}, w={box['width']}, h={box['height']}")

        # Ensure all filters have identical Y (within 2px tolerance)
        y_coords = [round(b['y']) for b in bboxes]
        is_single_row_filters = len(set(y_coords)) == 1
        print(f"Filter bar single row check: {is_single_row_filters} (Y-coords: {y_coords})")
        assert is_single_row_filters, f"Filter bar is NOT single row! Y-coords: {y_coords}"

        # Check Header nav links positions
        nav_links = page.locator(".nav-menu .nav-link").all()
        print(f"Nav links found: {len(nav_links)}")
        nav_boxes = [nl.bounding_box() for nl in nav_links]
        nav_ys = [round(b['y']) for b in nav_boxes]
        print(f"Nav links Y-coords at 1440px: {nav_ys}")
        is_single_row_nav = len(set(nav_ys)) == 1
        print(f"Header nav single row check: {is_single_row_nav}")
        assert is_single_row_nav, f"Header nav is NOT single row! Y-coords: {nav_ys}"

        # Capture Network page screenshot
        page.screenshot(path="artifacts_single_row_network_1440.png")

        # 2. Test at 1200px viewport (laptop breakpoint)
        page.set_viewport_size({"width": 1200, "height": 800})
        time.sleep(0.5)
        nav_boxes_1200 = [nl.bounding_box() for nl in page.locator(".nav-menu .nav-link").all()]
        nav_ys_1200 = [round(b['y']) for b in nav_boxes_1200]
        print(f"Nav links Y-coords at 1200px: {nav_ys_1200}")
        assert len(set(nav_ys_1200)) == 1, f"Nav links wrapped at 1200px! Y-coords: {nav_ys_1200}"

        page.screenshot(path="artifacts_single_row_network_1200.png")

        # 3. Test SAV Selection Cards at 1440px
        page.set_viewport_size({"width": 1440, "height": 900})
        page.goto("http://localhost:8080/sav.html")
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        sav_cards = page.locator(".service-types-grid .type-select-card").all()
        sav_boxes = [st.bounding_box() for st in sav_cards]
        sav_ys = [round(b['y']) for b in sav_boxes]
        print(f"SAV service cards Y-coords at 1440px: {sav_ys}")
        assert len(set(sav_ys)) == 1, f"SAV cards wrapped! Y-coords: {sav_ys}"

        sav_nav_ys = [round(b['y']) for b in [nl.bounding_box() for nl in page.locator(".nav-menu .nav-link").all()]]
        assert len(set(sav_nav_ys)) == 1, f"SAV nav wrapped! Y-coords: {sav_nav_ys}"

        page.screenshot(path="artifacts_single_row_sav_1440.png")

        # 4. Test Brands page Header & Brand Tabs at 1440px
        page.goto("http://localhost:8080/brands.html")
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        brand_tabs = page.locator(".brand-tabs__list .brand-tabs__link").all()
        brand_tab_ys = [round(b['y']) for b in [bt.bounding_box() for bt in brand_tabs]]
        print(f"Brand tabs Y-coords at 1440px: {brand_tab_ys}")
        assert len(set(brand_tab_ys)) == 1, f"Brand tabs wrapped! Y-coords: {brand_tab_ys}"

        brands_nav_ys = [round(b['y']) for b in [nl.bounding_box() for nl in page.locator(".nav-menu .nav-link").all()]]
        print(f"Brands page Nav Y-coords at 1440px: {brands_nav_ys}")
        assert len(set(brands_nav_ys)) == 1, f"Brands nav wrapped! Y-coords: {brands_nav_ys}"

        page.screenshot(path="artifacts_single_row_brands_1440.png")

        browser.close()
        print("ALL SINGLE-ROW ARCHITECTURAL TESTS PASSED!")

if __name__ == "__main__":
    verify_single_row_menus()

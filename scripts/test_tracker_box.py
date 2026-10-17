from playwright.sync_api import sync_playwright

def test_tracker_box():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        page.goto('http://localhost:8080/index.html')
        page.wait_for_timeout(1000)

        tracker_css = """
        .tracker-box {
          position: relative !important;
          background: #08090D !important;
          border: 1px solid rgba(255, 255, 255, 0.09) !important;
          border-radius: var(--radius-lg) !important;
          overflow: hidden !important;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6) !important;
        }

        .tracker-box > * {
          position: relative !important;
          z-index: 2 !important;
        }

        .tracker-box::before {
          content: '' !important;
          position: absolute !important;
          top: -30% !important;
          right: -10% !important;
          width: 380px !important;
          height: 180% !important;
          background: linear-gradient(220deg, 
            rgba(2, 6, 16, 0.98) 0%, 
            rgba(4, 14, 34, 0.92) 50%, 
            rgba(8, 28, 65, 0.4) 85%, 
            transparent 100%
          ) !important;
          border-left: 2px solid #00E5FF !important;
          box-shadow: 
            0 0 6px #FFFFFF,
            -4px 0 18px rgba(0, 229, 255, 0.85),
            -12px 0 45px rgba(0, 180, 255, 0.45),
            -28px 0 85px rgba(0, 140, 255, 0.2) !important;
          transform: rotate(18deg) !important;
          pointer-events: none !important;
          z-index: 1 !important;
        }

        .tracker-box::after {
          content: '' !important;
          position: absolute !important;
          top: -20% !important;
          left: -10% !important;
          width: 320px !important;
          height: 320px !important;
          background: radial-gradient(circle, rgba(0, 229, 255, 0.06) 0%, transparent 68%) !important;
          pointer-events: none !important;
          z-index: 1 !important;
        }
        """

        page.add_style_tag(content=tracker_css)
        page.wait_for_timeout(400)
        
        tbox = page.query_selector('.tracker-box')
        if tbox:
            tbox.screenshot(path='test_homepage_tracker_box.png')
            print('Captured test_homepage_tracker_box.png')

        # Also test tracker-dashboard-card on sav.html
        page.goto('http://localhost:8080/sav.html')
        page.wait_for_timeout(1000)

        # Switch to tab track
        page.evaluate("""() => {
          const tabTrack = document.querySelector('[data-tab="track"]');
          if (tabTrack) tabTrack.click();
        }""")
        page.wait_for_timeout(500)

        dash_css = """
        .tracker-dashboard-card {
          position: relative !important;
          background: #08090D !important;
          border: 1px solid rgba(255, 255, 255, 0.09) !important;
          border-radius: var(--radius-lg) !important;
          overflow: hidden !important;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65) !important;
        }

        .tracker-dashboard-card > * {
          position: relative !important;
          z-index: 2 !important;
        }

        .tracker-dashboard-card::before {
          content: '' !important;
          position: absolute !important;
          top: -30% !important;
          right: -10% !important;
          width: 360px !important;
          height: 180% !important;
          background: linear-gradient(220deg, 
            rgba(2, 6, 16, 0.98) 0%, 
            rgba(4, 14, 34, 0.92) 50%, 
            rgba(8, 28, 65, 0.4) 85%, 
            transparent 100%
          ) !important;
          border-left: 2px solid #00E5FF !important;
          box-shadow: 
            0 0 6px #FFFFFF,
            -4px 0 18px rgba(0, 229, 255, 0.85),
            -12px 0 45px rgba(0, 180, 255, 0.45),
            -28px 0 85px rgba(0, 140, 255, 0.2) !important;
          transform: rotate(18deg) !important;
          pointer-events: none !important;
          z-index: 1 !important;
        }
        """
        page.add_style_tag(content=dash_css)
        page.wait_for_timeout(400)

        dash = page.query_selector('.tracker-dashboard-card')
        if dash:
            dash.screenshot(path='test_sav_dashboard_card.png')
            print('Captured test_sav_dashboard_card.png')

        browser.close()

if __name__ == '__main__':
    test_tracker_box()

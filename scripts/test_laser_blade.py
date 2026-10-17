from playwright.sync_api import sync_playwright

def test_full_flank():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        page.goto('http://localhost:8080/sav.html')
        page.wait_for_timeout(1000)

        page.evaluate("""() => {
          const icons = document.querySelectorAll('.sav-perk-icon');
          if (icons.length >= 3) {
            icons[0].className = 'sav-perk-icon icon-speed';
            icons[0].innerHTML = '<i class="ti ti-bolt"></i>';
            
            icons[1].className = 'sav-perk-icon icon-oem';
            icons[1].innerHTML = '<i class="ti ti-certificate"></i>';
            
            icons[2].className = 'sav-perk-icon icon-whatsapp';
            icons[2].innerHTML = '<i class="ti ti-brand-whatsapp"></i>';
          }
        }""")

        # Full right flank blade: starts at top x=78% and cuts down to bottom right x=96%
        css_flank = """
        .sav-sidebar {
          position: relative !important;
          background: #07080B !important;
          border: 1px solid rgba(255, 255, 255, 0.09) !important;
          border-radius: var(--radius-lg) !important;
          padding: 38px 30px !important;
          overflow: hidden !important;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75) !important;
        }
        .sav-sidebar > * {
          position: relative !important;
          z-index: 2 !important;
        }
        .sav-sidebar::before {
          content: '' !important;
          position: absolute !important;
          top: -25% !important;
          left: -15% !important;
          width: 110% !important;
          height: 155% !important;
          background: linear-gradient(110deg, 
            rgba(2, 5, 12, 0.98) 0%, 
            rgba(4, 12, 28, 0.94) 55%, 
            rgba(8, 24, 52, 0.45) 85%, 
            rgba(12, 36, 75, 0.15) 100%
          ) !important;
          border-right: 2px solid #00E5FF !important;
          box-shadow: 
            0 0 6px #FFFFFF,
            4px 0 18px rgba(0, 229, 255, 0.85),
            12px 0 45px rgba(0, 180, 255, 0.45),
            28px 0 85px rgba(0, 140, 255, 0.2) !important;
          transform: rotate(-10deg) !important;
          pointer-events: none !important;
          z-index: 1 !important;
        }
        .sav-sidebar::after {
          content: '' !important;
          position: absolute !important;
          top: -15% !important;
          right: -15% !important;
          width: 280px !important;
          height: 280px !important;
          background: radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 68%) !important;
          pointer-events: none !important;
          z-index: 1 !important;
        }
        .sav-perk-item {
          display: flex !important;
          align-items: center !important;
          gap: 16px !important;
          font-size: 0.92rem !important;
          font-weight: 500 !important;
          color: var(--tx) !important;
        }
        .sav-perk-icon {
          width: 46px !important;
          height: 46px !important;
          border-radius: 8px !important;
          display: grid !important;
          place-items: center !important;
          flex-shrink: 0 !important;
          font-size: 1.25rem !important;
          transition: transform 0.25s ease, box-shadow 0.25s ease !important;
          backdrop-filter: blur(10px) !important;
        }
        .sav-perk-icon.icon-speed {
          background: linear-gradient(135deg, rgba(0, 229, 255, 0.16) 0%, rgba(3, 10, 24, 0.85) 100%) !important;
          border: 1px solid rgba(0, 229, 255, 0.4) !important;
          color: #00E5FF !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 4px 18px rgba(0, 229, 255, 0.22) !important;
        }
        .sav-perk-icon.icon-oem {
          background: linear-gradient(135deg, rgba(201, 169, 106, 0.18) 0%, rgba(18, 14, 8, 0.85) 100%) !important;
          border: 1px solid rgba(201, 169, 106, 0.45) !important;
          color: #E6CA85 !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 4px 18px rgba(201, 169, 106, 0.22) !important;
        }
        .sav-perk-icon.icon-whatsapp {
          background: linear-gradient(135deg, rgba(37, 211, 102, 0.18) 0%, rgba(4, 18, 10, 0.85) 100%) !important;
          border: 1px solid rgba(37, 211, 102, 0.42) !important;
          color: #25D366 !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 18px rgba(37, 211, 102, 0.22) !important;
        }
        .sav-warranty-badge {
          display: inline-flex !important;
          align-items: center !important;
          gap: 14px !important;
          padding: 13px 20px !important;
          background: linear-gradient(135deg, rgba(201, 169, 106, 0.1) 0%, rgba(12, 12, 16, 0.95) 100%) !important;
          border: 1px solid rgba(201, 169, 106, 0.35) !important;
          border-radius: 6px !important;
          font-size: 0.86rem !important;
          color: var(--tx) !important;
          box-shadow: inset 0 1px 0 rgba(201, 169, 106, 0.25), 0 10px 24px rgba(0, 0, 0, 0.4) !important;
        }
        """

        page.add_style_tag(content=css_flank)
        page.wait_for_timeout(400)
        sidebar = page.query_selector('.sav-sidebar')
        if sidebar:
            sidebar.screenshot(path='test_laser_full_flank.png')
            print('Captured test_laser_full_flank.png')

        browser.close()

if __name__ == '__main__':
    test_full_flank()

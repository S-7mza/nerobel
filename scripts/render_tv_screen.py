from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1600, 'height': 900})
    
    with open('assets/icons/theros-logo-white.svg', 'r', encoding='utf-8') as f:
        svg_content = f.read()
        
    html = f'''<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      padding: 0;
      width: 1600px;
      height: 900px;
      background: radial-gradient(ellipse at 60% 48%, #16120c 0%, #080706 50%, #010101 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }}
    .wave-ambient {{
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(ellipse 65% 35% at 50% 55%, rgba(212, 160, 86, 0.22) 0%, rgba(180, 120, 50, 0.08) 45%, transparent 75%),
        radial-gradient(ellipse 40% 20% at 40% 65%, rgba(255, 215, 140, 0.15) 0%, transparent 65%);
      filter: blur(25px);
    }}
    .silk-strand-1 {{
      position: absolute;
      width: 130%;
      height: 320px;
      top: 42%;
      left: -15%;
      background: linear-gradient(110deg, transparent 20%, rgba(212, 165, 95, 0.18) 42%, rgba(255, 225, 165, 0.32) 50%, rgba(170, 110, 45, 0.12) 60%, transparent 78%);
      transform: rotate(-8deg) skewX(-12deg);
      filter: blur(18px);
    }}
    .silk-strand-2 {{
      position: absolute;
      width: 110%;
      height: 180px;
      top: 52%;
      left: -5%;
      background: linear-gradient(95deg, transparent 25%, rgba(230, 180, 110, 0.15) 45%, rgba(255, 240, 200, 0.28) 54%, transparent 70%);
      transform: rotate(-14deg);
      filter: blur(14px);
    }}
    .logo-container {{
      position: relative;
      z-index: 5;
      width: 580px;
      filter: drop-shadow(0 0 16px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 35px rgba(220, 170, 95, 0.45));
    }}
    .logo-container svg {{
      width: 100%;
      height: auto;
      display: block;
    }}
    .oled-sheen {{
      position: absolute;
      inset: 0;
      background: linear-gradient(125deg, rgba(255, 255, 255, 0.05) 0%, transparent 45%, rgba(0, 0, 0, 0.35) 100%);
      pointer-events: none;
      z-index: 10;
    }}
  </style>
</head>
<body>
  <div class="wave-ambient"></div>
  <div class="silk-strand-1"></div>
  <div class="silk-strand-2"></div>
  <div class="logo-container">
    {svg_content}
  </div>
  <div class="oled-sheen"></div>
</body>
</html>'''
    page.set_content(html)
    out_path = 'C:/Users/7mza/.gemini/antigravity-ide/brain/91c0eadf-5c12-47e1-9592-adb8f974273a/.tempmediaStorage/oled_tv_screen.png'
    page.screenshot(path=out_path)
    browser.close()
    print(f'Rendered to {out_path}')

import urllib.request
import urllib.parse
from playwright.sync_api import sync_playwright

def get_svg_uri(name):
    url = f"https://cdn.jsdelivr.net/npm/@tabler/icons@3.19.0/icons/outline/{name}.svg"
    try:
        svg = urllib.request.urlopen(url).read().decode('utf-8')
        svg = svg.replace('\n', ' ').replace('\r', '').replace('"', "'")
        svg = ' '.join(svg.split())
        encoded = urllib.parse.quote(svg)
        return f"url(\"data:image/svg+xml,{encoded}\")"
    except Exception as e:
        print(f"Error {name}: {e}")
        return ""

icons_to_test = ['smart-home', 'tool', 'shield-check', 'map-pin', 'wifi', 'flame', 'device-tv', 'sun', 'cpu', 'award']
css_rules = ["""
.ti {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  vertical-align: -0.2em;
  background-color: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  flex-shrink: 0;
}
"""]

for ic in icons_to_test:
    uri = get_svg_uri(ic)
    css_rules.append(f".ti-{ic} {{ --svg: {uri}; }}")

css_content = "\n".join(css_rules)

html_content = f"""<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="css/theme.css">
  <link rel="stylesheet" href="css/main.css">
  <style>
    {css_content}
    body {{
      background: #06090E;
      color: #FFF;
      padding: 40px;
      font-family: var(--fb);
    }}
    .test-box {{
      display: flex;
      gap: 20px;
      align-items: center;
      margin-bottom: 24px;
      padding: 16px;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
    }}
  </style>
</head>
<body>
  <h2>Test Pure CSS SVG Mask Icons (Zero Webfont, Zero Carré, Instant First Paint)</h2>
  <div class="test-box">
    <div class="eyebrow"><i class="ti ti-smart-home"></i> <span>Consumer Tech for Modern Homes</span></div>
    <div class="eyebrow eyebrow-gold"><i class="ti ti-cpu"></i> <span>Design & Ingénierie</span></div>
    <div class="eyebrow eyebrow-gold"><i class="ti ti-award"></i> <span>Marques d'Élite</span></div>
  </div>
  <div class="test-box">
    <span style="color:var(--az);"><i class="ti ti-tool"></i> Support SAV</span>
    <span style="color:var(--gold);"><i class="ti ti-flame"></i> Sécurité Gaz</span>
    <span style="color:#10B981;"><i class="ti ti-shield-check"></i> Garantie</span>
    <span style="color:#FFF;"><i class="ti ti-device-tv"></i> Smart TV OLED</span>
    <span style="color:#38BDF8;"><i class="ti ti-wifi"></i> Connectivité Wi-Fi</span>
  </div>
</body>
</html>
"""

with open("test_mask_icons.html", "w", encoding="utf-8") as f:
    f.write(html_content)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1000, "height": 600})
    page.goto("file:///" + __file__.replace("\\", "/").replace("scripts/test_css_icons.py", "test_mask_icons.html"))
    page.wait_for_timeout(300)
    page.screenshot(path="screenshot_mask_icons.png")
    print("Screenshot captured to screenshot_mask_icons.png")

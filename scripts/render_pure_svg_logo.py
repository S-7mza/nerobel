from playwright.sync_api import sync_playwright
from PIL import Image
import os

svg_path = os.path.abspath("assets/icons/eurogas-logo-white.svg")
html = f"""<!DOCTYPE html>
<html>
<body style="margin:0; background:transparent;">
  <img src="file:///{svg_path.replace(chr(92), '/')}" style="width:1944px; height:auto; display:block;">
</body>
</html>"""

with open("scratch_render_logo.html", "w", encoding="utf-8") as f:
    f.write(html)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 2000, "height": 600})
    page.goto(f"file:///{os.path.abspath('scratch_render_logo.html').replace(chr(92), '/')}")
    page.wait_for_timeout(300)
    img_el = page.query_selector("img")
    img_el.screenshot(path="scratch_eurogas_vector_rendered.png", omit_background=True)
    print("Vector rendered to scratch_eurogas_vector_rendered.png")

import re
import sys
from html.parser import HTMLParser

print("--- RUNNING SPRINT 1 VERIFICATION CHECKS ---")

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

failures = 0

class InteractiveChecker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.elements = []
        self.current_tag = None
        self.current_attrs = {}
        self.current_text = []

    def handle_starttag(self, tag, attrs):
        if tag in ('a', 'button'):
            self.current_tag = tag
            self.current_attrs = dict(attrs)
            self.current_text = []

    def handle_data(self, data):
        if self.current_tag:
            self.current_text.append(data)

    def handle_endtag(self, tag):
        if tag == self.current_tag:
            text = "".join(self.current_text).strip()
            self.elements.append({
                'tag': self.current_tag,
                'attrs': self.current_attrs,
                'text': text
            })
            self.current_tag = None
            self.current_attrs = {}
            self.current_text = []

parser = InteractiveChecker()
parser.feed(html)

print(f"Checking {len(parser.elements)} interactive elements for accessible names...")

for idx, el in enumerate(parser.elements):
    aria_label = el['attrs'].get('aria-label', '').strip()
    title = el['attrs'].get('title', '').strip()
    text = el['text']
    
    if not text and not aria_label and not title:
        print(f"[FAIL] A11Y-01: Element #{idx} <{el['tag']}> href='{el['attrs'].get('href')}' class='{el['attrs'].get('class')}' has no accessible text.")
        failures += 1

# 2. F-07 Product Card Routing Collision
if 'article class="collection-card" role="group" aria-roledescription="slide" aria-label="3 sur 4 : Smart TV OLED 4K 65&quot;">\n              <a href="brands#smart-tv-oled"' in html or 'href="brands#smart-tv-oled" class="collection-card-link"' in html:
    print("[PASS] F-07: Smart TV card correctly links to brands#smart-tv-oled")
else:
    print("[FAIL] F-07: Smart TV card routing check failed")
    failures += 1

if 'article class="collection-card" role="group" aria-roledescription="slide" aria-label="4 sur 4 : Réfrigérateur Multi-Portes 520 L">\n              <a href="brands#refrigerateur-520l"' in html or 'href="brands#refrigerateur-520l" class="collection-card-link"' in html:
    print("[PASS] F-07: Refrigerator card correctly links to brands#refrigerateur-520l")
else:
    print("[FAIL] F-07: Refrigerator card routing check failed")
    failures += 1

# 3. F-06 Warranty string check
if "Garantie : conditions sur demande" in html:
    print("[FAIL] F-06: Old warranty string 'Garantie : conditions sur demande' is still present in index.html")
    failures += 1
elif "Garantie constructeur officielle (pièces d'origine et SAV agréé)" in html:
    print("[PASS] F-06: Warranty string updated to factual guarantee copy.")
else:
    print("[FAIL] F-06: Expected warranty string not found.")
    failures += 1

# 4. Footer social aria-labels
if 'aria-label="Contacter Nerobel Group sur WhatsApp"' in html and \
   'aria-label="Page Facebook de Nerobel Group"' in html and \
   'aria-label="Page LinkedIn de Nerobel Group"' in html:
    print("[PASS] F-01: All footer social links have explicit French aria-labels.")
else:
    print("[FAIL] F-01: Footer social links missing expected aria-labels.")
    failures += 1

if failures == 0:
    print("[SUCCESS] ALL SPRINT 1 CHECKS PASSED PERFECTLY!")
    sys.exit(0)
else:
    print(f"[ERROR] {failures} CHECKS FAILED!")
    sys.exit(1)

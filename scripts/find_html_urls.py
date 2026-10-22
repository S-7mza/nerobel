import glob
import re
import os

pages = glob.glob('*.html') + glob.glob('ou-acheter/*.html')

ignore_pages = {
    'debug_current_favicon.html',
    'test_logo_display.html',
    'test_professional_icons.html',
    'favicon_showcase.html'
}

all_html_hrefs = {}

for p in pages:
    if os.path.basename(p) in ignore_pages:
        continue
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()
        
    hrefs = re.findall(r'href=["\']([^"\']*\.html[^"\']*)["\']', c)
    canon = re.findall(r'<link rel=["\']canonical["\'] href=["\']([^"\']+)["\']', c)
    og = re.findall(r'<meta property=["\']og:url["\'] content=["\']([^"\']+)["\']', c)
    
    print(f"\n{p}:")
    print(f"  Canonical: {canon}")
    print(f"  OG URL: {og}")
    print(f"  Hrefs ({len(hrefs)}):")
    for h in set(hrefs):
        print(f"    - {h}")
        all_html_hrefs[h] = all_html_hrefs.get(h, 0) + 1

with open('sitemap.xml', 'r', encoding='utf-8') as f:
    sm = f.read()
sm_urls = re.findall(r'<loc>([^<]+)</loc>', sm)
print("\nSitemap URLs:")
for u in sm_urls:
    print(f"  - {u}")

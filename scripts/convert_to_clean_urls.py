import re
import os
import glob

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

pages_to_update = [
    'index.html',
    'brands.html',
    'b2b.html',
    'sav.html',
    'network.html',
    'contact.html',
    'confidentialite.html',
    'mentions-legales.html',
    'pacific.html',
    '404.html',
    'ou-acheter/casablanca.html'
]

# Patterns for root pages:
# e.g. "brands.html" -> "brands", "brands.html#theros" -> "brands#theros", "sav.html?brand=theros" -> "sav?brand=theros"
# "index.html" -> "./"
# For subfolder pages like ou-acheter/casablanca.html:
# "../brands.html" -> "../brands", "../index.html" -> "../"

def clean_urls_in_content(content, is_subfolder=False):
    # 1. Canonical and OG URLs (full https:// URLs)
    content = re.sub(
        r'https://nerobel\.com/([^"\'\s>]+?)\.html',
        r'https://nerobel.com/\1',
        content
    )
    # Special case: https://nerobel.com/index.html -> https://nerobel.com/
    content = content.replace('https://nerobel.com/index', 'https://nerobel.com/')

    # 2. Pacific redirect specific
    content = content.replace('brands.html#theros', 'brands#theros')

    # 3. Subfolder links (../page.html)
    if is_subfolder:
        content = re.sub(r'href="\.\./index\.html"', 'href="../"', content)
        content = re.sub(r'href="\.\./index\.html#([^"]+)"', r'href="../#\1"', content)
        content = re.sub(
            r'href="\.\./([a-zA-Z0-9_-]+)\.html(#|\?|")',
            r'href="../\1\2',
            content
        )
        content = re.sub(
            r'href=\'\.\./([a-zA-Z0-9_-]+)\.html(#|\?|\')',
            r'href=\'../\1\2',
            content
        )

    # 4. Root page links
    # index.html
    content = re.sub(r'href="index\.html"', 'href="./"', content)
    content = re.sub(r'href="index\.html#([^"]+)"', r'href="./#\1"', content)
    content = re.sub(r'href=\'index\.html\'', 'href=\'./\'', content)
    content = re.sub(r'href=\'index\.html#([^\']+)\'', r'href=\'./#\1\'', content)

    # other .html pages
    content = re.sub(
        r'href="([a-zA-Z0-9_-]+)\.html(#|\?|")',
        r'href="\1\2',
        content
    )
    content = re.sub(
        r'href=\'([a-zA-Z0-9_-]+)\.html(#|\?|\')',
        r'href=\'\1\2',
        content
    )

    # ou-acheter/casablanca.html link from root
    content = content.replace('ou-acheter/casablanca.html', 'ou-acheter/casablanca')

    return content

def run_conversion():
    print("--- Converting URLs to clean extensionless URLs (no .html) ---")
    for page in pages_to_update:
        fpath = os.path.join(WORKSPACE_ROOT, page)
        if not os.path.exists(fpath):
            print(f"[SKIP] {page} not found.")
            continue
        with open(fpath, 'r', encoding='utf-8') as fp:
            orig = fp.read()
            
        is_sub = '/' in page or '\\' in page
        updated = clean_urls_in_content(orig, is_subfolder=is_sub)
        
        with open(fpath, 'w', encoding='utf-8') as fp:
            fp.write(updated)
            
        # Count remaining .html in href
        rem = re.findall(r'href=["\'][^"\']*\.html[^"\']*["\']', updated)
        print(f"[OK] Converted {page} (remaining .html hrefs: {len(rem)})")

    # Update sitemap.xml
    sm_path = os.path.join(WORKSPACE_ROOT, 'sitemap.xml')
    with open(sm_path, 'r', encoding='utf-8') as fp:
        sm = fp.read()
    sm_clean = re.sub(r'<loc>https://nerobel\.com/([^<]+?)\.html</loc>', r'<loc>https://nerobel.com/\1</loc>', sm)
    with open(sm_path, 'w', encoding='utf-8') as fp:
        fp.write(sm_clean)
    print("[OK] Converted sitemap.xml to clean URLs.")

    # Update scripts/build-city-pages.mjs
    bcp_path = os.path.join(WORKSPACE_ROOT, 'scripts', 'build-city-pages.mjs')
    if os.path.exists(bcp_path):
        with open(bcp_path, 'r', encoding='utf-8') as fp:
            bcp = fp.read()
        bcp_clean = bcp.replace('.html"', '"').replace('.html#', '#').replace('.html?', '?')
        # preserve index.mjs if any
        with open(bcp_path, 'w', encoding='utf-8') as fp:
            fp.write(bcp_clean)
        print("[OK] Updated scripts/build-city-pages.mjs.")

if __name__ == '__main__':
    run_conversion()

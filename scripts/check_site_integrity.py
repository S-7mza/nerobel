import os
import re
import glob
import sys

target_dir = sys.argv[1] if len(sys.argv) > 1 else '.'
target_dir = os.path.abspath(target_dir)

html_files = glob.glob(os.path.join(target_dir, '*.html')) + glob.glob(os.path.join(target_dir, 'ou-acheter', '*.html'))

broken = []
total_refs = 0

ignore_pages = {
    'debug_current_favicon.html',
    'test_logo_display.html',
    'test_professional_icons.html',
    'favicon_showcase.html'
}

for hf in html_files:
    if os.path.basename(hf) in ignore_pages:
        continue
    base_dir = os.path.dirname(hf)
    with open(hf, 'r', encoding='utf-8') as f:
        content = f.read()

    # Strip HTML comments
    clean_html = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)

    # Find src, href in tags
    matches = re.findall(r'(?:src|href)=["\']([^"\']+)["\']', clean_html)
    # Also find srcset
    srcset_matches = re.findall(r'srcset=["\']([^"\']+)["\']', clean_html)
    for sm in srcset_matches:
        for part in sm.split(','):
            url = part.strip().split(' ')[0]
            if url:
                matches.append(url)

    for ref in matches:
        ref_clean = ref.split('?')[0].split('#')[0]
        if not ref_clean or ref_clean.startswith(('http://', 'https://', 'mailto:', 'tel:', 'data:', 'javascript:')):
            continue
        total_refs += 1
        target_path = os.path.normpath(os.path.join(base_dir, ref_clean))
        
        # Check if direct target exists
        exists = os.path.exists(target_path)
        # Check if clean URL resolving to .html exists
        if not exists and os.path.exists(target_path + '.html'):
            exists = True
        # Check if directory index exists (e.g. ./ or ../)
        if not exists and (os.path.isdir(target_path) and os.path.exists(os.path.join(target_path, 'index.html'))):
            exists = True
            
        if not exists:
            broken.append((hf, ref, target_path))

css_files = glob.glob(os.path.join(target_dir, 'css', '*.css')) + glob.glob(os.path.join(target_dir, 'assets', 'css', '*.css'))
total_css_refs = 0
for cf in css_files:
    base_dir = os.path.dirname(cf)
    with open(cf, 'r', encoding='utf-8') as f:
        content = f.read()
    clean_css = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    url_matches = re.findall(r'url\(\s*["\']?([^"\'\)\s]+)["\']?\s*\)', clean_css)
    for ref in url_matches:
        ref_clean = ref.split('?')[0].split('#')[0]
        if not ref_clean or ref_clean.startswith(('http://', 'https://', 'data:')):
            continue
        total_css_refs += 1
        target_path = os.path.normpath(os.path.join(base_dir, ref_clean))
        if not os.path.exists(target_path):
            broken.append((cf, ref, target_path))

checked_pages = [hf for hf in html_files if os.path.basename(hf) not in ignore_pages]
print(f"Checked {len(checked_pages)} pages ({total_refs} refs) and {len(css_files)} CSS files ({total_css_refs} refs).")
if broken:
    print(f"Found {len(broken)} broken references:")
    for page, ref, target in broken:
        print(f"  {page}: {ref} -> {target} NOT FOUND")
else:
    print("ALL ASSET AND LINK REFERENCES ARE 100% VALID!")

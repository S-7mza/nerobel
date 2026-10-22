import os
import glob
import re

# 1. Collect all text from all production pages, css, and js
prod_files = (
    glob.glob('*.html') +
    glob.glob('ou-acheter/*.html') +
    glob.glob('css/*.css') +
    glob.glob('assets/css/*.css') +
    glob.glob('js/*.js') +
    glob.glob('content/*.json')
)

ignore_pages = {
    'debug_current_favicon.html',
    'test_logo_display.html',
    'test_professional_icons.html',
    'favicon_showcase.html'
}

all_text = ''
file_contents = {}
for pf in prod_files:
    if os.path.basename(pf) in ignore_pages:
        continue
    with open(pf, 'r', encoding='utf-8', errors='ignore') as f:
        txt = f.read()
        all_text += '\n' + txt
        file_contents[pf] = txt

print(f"Loaded {len(file_contents)} production code files.")

# Check for dynamic image constructions in JS
print("\nScanning JS files for image references...")
for jf in glob.glob('js/*.js'):
    txt = file_contents.get(jf, '')
    matches = re.findall(r'["\'`][^"\'`]*(?:assets/|\.webp|\.jpg|\.png|\.avif|\.svg)[^"\'`]*["\'`]', txt)
    if matches:
        print(f"  {jf}: {matches}")

# Check all assets in assets/img and assets/icons
all_assets = []
for root, _, files in os.walk('assets'):
    if 'img-src' in root:
        continue
    for f in files:
        full_path = os.path.join(root, f)
        rel_path = os.path.relpath(full_path, '.').replace('\\', '/')
        all_assets.append((full_path, f, rel_path))

used = []
unused = []

for full, fname, rel in all_assets:
    # Check if filename is mentioned in any production file
    # (either as relative path or by basename)
    if fname in all_text or rel in all_text:
        used.append((full, rel, os.path.getsize(full)))
    else:
        unused.append((full, rel, os.path.getsize(full)))

print(f"\nTotal assets scanned: {len(all_assets)}")
print(f"Used assets: {len(used)} ({sum(s for _, _, s in used) / 1024:.1f} KB)")
print(f"Unused assets: {len(unused)} ({sum(s for _, _, s in unused) / 1024:.1f} KB)")

print("\n--- UNUSED ASSETS DETAILS ---")
by_dir = {}
for full, rel, sz in unused:
    d = os.path.dirname(rel)
    by_dir.setdefault(d, []).append((os.path.basename(rel), sz))

for d, flist in sorted(by_dir.items()):
    total_d_sz = sum(s for _, s in flist)
    print(f"\nDirectory: {d}/ ({len(flist)} files, {total_d_sz / 1024:.1f} KB):")
    for fn, s in sorted(flist, key=lambda x: -x[1]):
        print(f"  - {fn} ({s / 1024:.1f} KB)")

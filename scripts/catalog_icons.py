import re
import glob

all_icons = set()

# Scan HTML files
for f in glob.glob("*.html"):
    content = open(f, encoding="utf-8").read()
    # match class="... ti-([a-z0-9-]+)"
    matches = re.findall(r'ti-([a-z0-9-]+)', content)
    for m in matches:
        if not any(x in m for x in ['allerg', 'monoxyde', 'portes', 'traces', 'position', 'marques']):
            all_icons.add(m)

# Scan JS files
for f in glob.glob("js/*.js"):
    content = open(f, encoding="utf-8").read()
    matches = re.findall(r'ti-([a-z0-9-]+)', content)
    for m in matches:
        all_icons.add(m)

# Add any additional essential UI icons
essential = [
    'chevron-up', 'chevron-down', 'chevron-left', 'chevron-right',
    'check', 'x', 'sun', 'moon', 'menu-2', 'search', 'tool', 'map-pin',
    'phone', 'brand-whatsapp', 'brand-facebook', 'brand-linkedin',
    'arrow-left', 'arrow-right', 'shield-check', 'smart-home', 'cpu',
    'award', 'flame', 'wifi', 'device-tv', 'fridge', 'wash-machine', 'wind',
    'dimensions', 'building-factory-2', 'building-store', 'building-community',
    'file-download', 'file-text', 'file-type-pdf', 'clock', 'camera', 'trash',
    'refresh', 'cloud-upload', 'loader', 'loader-2', 'alert-circle', 'alert-triangle',
    'user', 'user-check', 'ticket', 'navigation', 'barcode', 'help', 'bolt',
    'headset', 'headphones', 'rosette-discount-check', 'droplet', 'leaf', 'snowflake',
    'arrows-maximize', 'layout-navbar', 'layout-sidebar', 'layout-grid', 'player-play',
    'shield-lock', 'package', 'send', 'school', 'truck-delivery', 'certificate',
    'external-link', 'radar', 'activity', 'plus', 'star-filled', 'home', 'eye',
    'eye-off', 'copy', 'calendar', 'calendar-time', 'calendar-event'
]
for e in essential:
    all_icons.add(e)

print(f"Total icons to generate: {len(all_icons)}")
print(sorted(list(all_icons)))

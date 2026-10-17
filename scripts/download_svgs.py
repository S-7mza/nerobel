import urllib.request
import urllib.parse
import os

icons = [
    'activity', 'alert-circle', 'alert-triangle', 'arrow-left', 'arrow-right',
    'arrows-maximize', 'award', 'barcode', 'bolt', 'brand-facebook', 'brand-linkedin',
    'brand-whatsapp', 'building-community', 'building-factory-2', 'building-store',
    'calendar', 'calendar-event', 'calendar-time', 'camera', 'certificate', 'check',
    'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up', 'circle-check',
    'clock', 'cloud-upload', 'copy', 'cpu', 'device-mobile', 'device-tv', 'dimensions',
    'droplet', 'external-link', 'eye', 'eye-off', 'file-download', 'file-text',
    'file-type-pdf', 'flame', 'fridge', 'headphones', 'headset', 'help', 'home',
    'info-circle', 'layout-grid', 'layout-navbar', 'layout-sidebar', 'leaf',
    'loader', 'loader-2', 'map', 'map-pin', 'menu-2', 'moon', 'navigation',
    'package', 'phone', 'player-play', 'plus', 'printer', 'radar', 'refresh',
    'rosette-discount-check', 'school', 'search', 'send', 'shield-check', 'shield-lock',
    'smart-home', 'snowflake', 'star-filled', 'sun', 'ticket', 'tool', 'trash',
    'truck-delivery', 'user', 'user-check', 'wash-machine', 'wifi', 'wind', 'x'
]

success = {}
failed = []

for name in icons:
    urls_to_try = [
        f"https://cdn.jsdelivr.net/npm/@tabler/icons@3.19.0/icons/outline/{name}.svg",
        f"https://cdn.jsdelivr.net/npm/@tabler/icons@3.19.0/icons/filled/{name.replace('-filled', '')}.svg",
        f"https://cdn.jsdelivr.net/npm/@tabler/icons@3.19.0/icons/outline/{name.replace('-filled', '')}.svg",
    ]
    content = None
    for u in urls_to_try:
        try:
            req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
            content = urllib.request.urlopen(req, timeout=5).read().decode('utf-8')
            break
        except Exception:
            continue
    if content:
        success[name] = content
    else:
        failed.append(name)

print(f"Downloaded: {len(success)} / {len(icons)}")
if failed:
    print(f"Failed: {failed}")
else:
    print("ALL ICONS DOWNLOADED SUCCESSFULLY!")

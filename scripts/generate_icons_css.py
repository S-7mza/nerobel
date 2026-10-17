import urllib.request
import re
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
    'smart-home', 'snowflake', 'sparkles', 'star-filled', 'sun', 'ticket', 'tool', 'trash',
    'truck-delivery', 'user', 'user-check', 'wash-machine', 'wifi', 'wind', 'x'
]

def encode_svg(svg_str):
    # Ensure stroke is currentColor and clean whitespace
    svg = re.sub(r'<\?xml[^>]*\?>', '', svg_str)
    svg = re.sub(r'<!--.*?-->', '', svg, flags=re.DOTALL)
    svg = re.sub(r'\s+', ' ', svg).strip()
    # Normalize quotes
    svg = svg.replace('"', "'")
    # URL encode critical SVG characters
    encoded = svg.replace('<', '%3C').replace('>', '%3E').replace('#', '%23')
    return f'url("data:image/svg+xml,{encoded}")'

svg_cache = {}
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
        svg_cache[name] = content
    else:
        print(f"Warning: could not download {name}")

css_lines = [
    "/* ==========================================================================",
    "   NEROBEL HIGH-PERFORMANCE ZERO-LATENCY SVG ICONS",
    "   Replaces bulky 850KB remote webfont with pure, instantaneous CSS SVG masks.",
    "   - ZERO network latency or CDN delay",
    "   - ZERO 'carré' (missing glyph square) on first paint",
    "   - ZERO Cumulative Layout Shift (CLS)",
    "   - Synchronous first paint on frame 1",
    "   - Inherits currentColor, font-size, and transitions perfectly",
    "   ========================================================================== */",
    "",
    ".ti {",
    "  display: inline-block;",
    "  width: 1.15em;",
    "  height: 1.15em;",
    "  vertical-align: -0.18em;",
    "  background-color: currentColor;",
    "  -webkit-mask-repeat: no-repeat;",
    "  mask-repeat: no-repeat;",
    "  -webkit-mask-size: 100% 100%;",
    "  mask-size: 100% 100%;",
    "  -webkit-mask-image: var(--svg);",
    "  mask-image: var(--svg);",
    "  flex-shrink: 0;",
    "  speak: none;",
    "  font-style: normal;",
    "  font-variant: normal;",
    "  text-rendering: auto;",
    "}",
    "",
    "/* Ensure pseudo-element content from legacy webfont is disabled */",
    ".ti::before, .ti::after {",
    "  content: none !important;",
    "}",
    "",
    "/* Spinning animation for loaders */",
    "@keyframes ti-spin {",
    "  from { transform: rotate(0deg); }",
    "  to { transform: rotate(360deg); }",
    "}",
    ".ti-loader, .ti-loader-2 {",
    "  animation: ti-spin 1s linear infinite;",
    "}",
    "",
    "/* Individual Icon Definitions */"
]

for name in sorted(svg_cache.keys()):
    uri = encode_svg(svg_cache[name])
    css_lines.append(f".ti-{name} {{ --svg: {uri}; }}")

output_path = os.path.join("css", "icons.css")
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(css_lines) + "\n")

file_size = os.path.getsize(output_path)
print(f"Generated {output_path} successfully!")
print(f"Total icons packaged: {len(svg_cache)}")
print(f"File size: {file_size} bytes ({file_size/1024:.1f} KB)")

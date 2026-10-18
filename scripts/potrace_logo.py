import cv2
import numpy as np
import potrace

# 1. Load original high-res image
orig = cv2.imread(r'C:/Users/7mza/.gemini/antigravity-ide/brain/e183438f-fd04-41d9-89de-50230a48c4ec/.user_uploaded/media_1792089917006.jpg', cv2.IMREAD_GRAYSCALE)

# 2. Extract boolean mask of the white letters
thresh = orig > 128
y_indices, x_indices = np.where(thresh)
min_y, max_y = min(y_indices), max(y_indices)
min_x, max_x = min(x_indices), max(x_indices)

b1 = thresh[min_y:max_y+1, min_x:max_x+1]

# Padding
pad = 12
pad_bool = np.pad(b1, pad, mode='constant', constant_values=False)
ch, cw = pad_bool.shape

# 3. Potrace trace
bmp = potrace.Bitmap(pad_bool)
path = bmp.trace(turdsize=2, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.2)

print(f"Total curves found by potrace: {len(path)}")

svg_subpaths = []

for curve_idx, curve in enumerate(path):
    start = curve.start_point
    segments = curve.segments
    
    # Skip canvas boundary curve (Curve 0)
    if curve_idx == 0:
        print(f"Skipping canvas boundary curve 0")
        continue

    # Build path commands with cubic Bezier curves
    d = [f"M {start.x:.2f} {start.y:.2f}"]
    for seg in segments:
        if seg.is_corner:
            d.append(f"L {seg.c.x:.2f} {seg.c.y:.2f}")
            d.append(f"L {seg.end_point.x:.2f} {seg.end_point.y:.2f}")
        else:
            d.append(f"C {seg.c1.x:.2f} {seg.c1.y:.2f} {seg.c2.x:.2f} {seg.c2.y:.2f} {seg.end_point.x:.2f} {seg.end_point.y:.2f}")
    d.append("Z")
    svg_subpaths.append(" ".join(d))

print(f"Extracted {len(svg_subpaths)} letter contours into SVG path")

# Combine all subpaths
combined_path = " ".join(svg_subpaths)

# 4. Standard white logo SVG
svg_logo = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {cw} {ch}" fill="none">
  <path fill-rule="evenodd" d="{combined_path}" fill="#FFFFFF" class="nerobel-logo-mark" />
</svg>'''

with open('assets/icons/nerobel-logo.svg', 'w', encoding='utf-8') as f:
    f.write(svg_logo)

with open('assets/icons/nerobel-logo-white.svg', 'w', encoding='utf-8') as f:
    f.write(svg_logo)

# 5. Dark logo SVG for light mode
svg_dark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {cw} {ch}" fill="none">
  <path fill-rule="evenodd" d="{combined_path}" fill="#0A0E1A" class="nerobel-logo-mark" />
</svg>'''

with open('assets/icons/nerobel-logo-dark.svg', 'w', encoding='utf-8') as f:
    f.write(svg_dark)

# 6. Hero Banner SVG
banner_h = ch + 115
mid_x = cw / 2.0
line_y = ch + 24
sub1_y = line_y + 36
sub2_y = sub1_y + 28

svg_banner = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {cw} {banner_h}" fill="none">
  <defs>
    <filter id="heroLaserGlow" x="-20%" y="-50%" width="140%" height="200%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="heroLaserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563EB" stop-opacity="0" />
      <stop offset="15%" stop-color="#2563EB" stop-opacity="0.4" />
      <stop offset="50%" stop-color="#60A5FA" stop-opacity="1" />
      <stop offset="85%" stop-color="#2563EB" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Mathematically Exact Smooth Vector Logotype -->
  <path fill-rule="evenodd" d="{combined_path}" fill="#FFFFFF" />

  <!-- Saphir Laser Horizon Beam -->
  <line x1="{mid_x - 380:.1f}" y1="{line_y:.1f}" x2="{mid_x + 380:.1f}" y2="{line_y:.1f}" stroke="url(#heroLaserGrad)" stroke-width="3" filter="url(#heroLaserGlow)" />
  <circle cx="{mid_x:.1f}" cy="{line_y:.1f}" r="3" fill="#FFFFFF" />

  <!-- Official Brand Tagline -->
  <text x="{mid_x:.1f}" y="{sub1_y:.1f}" text-anchor="middle" font-family="'Inter', -apple-system, sans-serif" font-size="24" font-weight="500" letter-spacing="0.5" fill="#FFFFFF">Consumer Tech for Modern Homes</text>

  <!-- Product Universe Triad -->
  <text x="{mid_x:.1f}" y="{sub2_y:.1f}" text-anchor="middle" font-family="'Inter', -apple-system, sans-serif" font-size="16" font-weight="400" letter-spacing="1.2" fill="#8A8F99">
    Home Appliances <tspan fill="#2563EB">•</tspan> Bath &amp; Kitchen <tspan fill="#2563EB">•</tspan> Smart TV
  </text>
</svg>'''

with open('assets/icons/nerobel-logo-full.svg', 'w', encoding='utf-8') as f:
    f.write(svg_banner)

# 7. Avatar SVG
avatar_scale = 320.0 / cw
scaled_w = cw * avatar_scale
scaled_h = ch * avatar_scale
avatar_x = (400 - scaled_w) / 2.0
avatar_y = (400 - scaled_h) / 2.0

svg_avatar = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none">
  <circle cx="200" cy="200" r="195" fill="#000000" />
  <circle cx="200" cy="200" r="188" stroke="#2563EB" stroke-width="7" />
  <g transform="translate({avatar_x:.2f}, {avatar_y:.2f}) scale({avatar_scale:.4f})">
    <path fill-rule="evenodd" d="{combined_path}" fill="#FFFFFF" />
  </g>
</svg>'''

with open('assets/icons/nerobel-avatar.svg', 'w', encoding='utf-8') as f:
    f.write(svg_avatar)

print(f"SUCCESS: Generated all SVG logos via Potrace! Dimensions: {cw}x{ch}")

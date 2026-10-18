import os

pts = [
    (32, 10), (5, 146), (50, 145), (63, 83), (103, 146),
    (141, 145), (168, 10), (123, 10), (108, 71), (71, 10)
]

def get_n_points(target_h=38, center_x=32, center_y=32):
    scale = target_h / 136.0
    offset_x = center_x - (86.5 * scale)
    offset_y = center_y - (78.0 * scale)
    
    transformed = []
    for x, y in pts:
        nx = round(x * scale + offset_x, 2)
        ny = round(y * scale + offset_y, 2)
        transformed.append(f"{nx},{ny}")
    return " ".join(transformed)

def get_dual_tone_points(target_h=38, center_x=32, center_y=32):
    scale = target_h / 136.0
    offset_x = center_x - (86.5 * scale)
    offset_y = center_y - (78.0 * scale)
    def tx(x, y):
        return round(x * scale + offset_x, 2), round(y * scale + offset_y, 2)

    p_left = [tx(32, 10), tx(5, 146), tx(50, 145), tx(63, 83), tx(71, 10)]
    p_right = [tx(71, 10), tx(63, 83), tx(103, 146), tx(141, 145), tx(168, 10), tx(123, 10), tx(108, 71)]
    return " ".join(f"{x},{y}" for x, y in p_left), " ".join(f"{x},{y}" for x, y in p_right)

poly_n_opt1 = get_n_points(target_h=36, center_x=32, center_y=29.5)
poly_n = get_n_points(target_h=38, center_x=32, center_y=32)
poly_left, poly_right = get_dual_tone_points(target_h=38, center_x=32, center_y=32)

# OPTION 1: Platinum Luxury (White-Grey Ceramic Squircle + Obsidian N + Saphir Horizon)
svg1 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#F1F4F8"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="rim1" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="60%" stop-color="#CBD5E1"/>
      <stop offset="100%" stop-color="#94A3B8"/>
    </linearGradient>
    <linearGradient id="laser1" x1="6" y1="50" x2="58" y2="50" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#2563EB" stop-opacity="0"/>
      <stop offset="25%" stop-color="#2563EB" stop-opacity="0.7"/>
      <stop offset="50%" stop-color="#60A5FA" stop-opacity="1"/>
      <stop offset="75%" stop-color="#2563EB" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadow1" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#0F172A" flood-opacity="0.25"/>
    </filter>
  </defs>
  <!-- Beautiful White-Grey Rounding Squircle -->
  <rect x="2" y="2" width="60" height="60" rx="15" fill="url(#bg1)" stroke="url(#rim1)" stroke-width="1.8" filter="url(#shadow1)"/>
  <!-- Pure Logo N in Deep Obsidian -->
  <polygon points="{poly_n_opt1}" fill="#0B0F19"/>
  <!-- Saphir Precision Laser Horizon Line -->
  <line x1="8" y1="50" x2="56" y2="50" stroke="url(#laser1)" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="32" cy="50" r="1.8" fill="#60A5FA"/>
</svg>'''

# OPTION 2: Pure White-Grey Monogram (High-Contrast Luxury Ceramic + Jet-Black N)
svg2 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E8ECEF"/>
    </linearGradient>
    <filter id="shadow2" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.28"/>
    </filter>
  </defs>
  <!-- White-Grey Tile with Clean Smoke Rounding Border -->
  <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#bg2)" stroke="#CBD5E1" stroke-width="1.6" filter="url(#shadow2)"/>
  <rect x="3" y="3" width="58" height="58" rx="15" stroke="rgba(0,0,0,0.06)" stroke-width="1" fill="none"/>
  <!-- Monolithic Jet-Black Nerobel N -->
  <polygon points="{poly_n}" fill="#05070A"/>
</svg>'''

# OPTION 3: Obsidian Core with White-Grey Rounding Borders & White-Grey N
svg3 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="bg3" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0F141F"/>
      <stop offset="100%" stop-color="#06080D"/>
    </linearGradient>
    <linearGradient id="nGrad3" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="60%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <filter id="shadow3" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Dark Obsidian Tile with Exquisite White-Grey Rounding Border -->
  <rect x="2" y="2" width="60" height="60" rx="15" fill="url(#bg3)" stroke="#E2E8F0" stroke-width="2.2" filter="url(#shadow3)"/>
  <!-- Luminous White-Grey Nerobel N -->
  <polygon points="{poly_n}" fill="url(#nGrad3)"/>
  <!-- Subtle Saphir Accent Indicator -->
  <circle cx="50" cy="14" r="2" fill="#2563EB"/>
</svg>'''

# OPTION 4: Dual-Tone Saphir Platinum (White-Grey Tile + Obsidian & Saphir N)
svg4 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="bg4" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#EBF0F5"/>
    </linearGradient>
    <linearGradient id="saphirGrad4" x1="20" y1="10" x2="56" y2="52" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="60" height="60" rx="15" fill="url(#bg4)" stroke="#CBD5E1" stroke-width="1.8"/>
  <polygon points="{poly_left}" fill="#0A0E17"/>
  <polygon points="{poly_right}" fill="url(#saphirGrad4)"/>
</svg>'''

# OPTION 5: Royal Saphir Frame on White-Grey (White-Grey Tile + #2563EB Rounding Border)
svg5 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="bg5" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#EFF3F8"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="60" height="60" rx="15" fill="url(#bg5)" stroke="#2563EB" stroke-width="2.5"/>
  <polygon points="{poly_n}" fill="#0B0F19"/>
</svg>'''

# OPTION 6: Titanium Metallic Plate (Brushed Silver-Grey + Deep Ink N + Double Rim)
svg6 = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="bg6" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="50%" stop-color="#E2E8F0"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <linearGradient id="rim6" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#94A3B8"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="60" height="60" rx="15" fill="url(#bg6)" stroke="url(#rim6)" stroke-width="2"/>
  <rect x="4" y="4" width="56" height="56" rx="13" stroke="rgba(255,255,255,0.7)" stroke-width="1" fill="none"/>
  <polygon points="{poly_n}" fill="#0F172A"/>
</svg>'''

os.makedirs('assets/icons/favicons-candidates', exist_ok=True)
files = {
    'assets/icons/favicons-candidates/opt1-platinum-luxury.svg': svg1,
    'assets/icons/favicons-candidates/opt2-whitegrey-pure.svg': svg2,
    'assets/icons/favicons-candidates/opt3-whitegrey-rim-dark.svg': svg3,
    'assets/icons/favicons-candidates/opt4-dualtone-saphir.svg': svg4,
    'assets/icons/favicons-candidates/opt5-saphir-frame.svg': svg5,
    'assets/icons/favicons-candidates/opt6-titanium-plate.svg': svg6,
}

for path, content in files.items():
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated candidates successfully!")

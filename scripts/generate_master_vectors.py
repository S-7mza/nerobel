with open('assets/icons/nerobel-logo-vector.svg', 'r', encoding='utf-8') as f:
    vector_svg = f.read()

# Extract the path string
import re
match = re.search(r'd="([^"]+)"', vector_svg)
if not match:
    raise ValueError("Path not found in vector svg")

d_path = match.group(1)

# 1. Official Standard Logo (Pure Vector Path, Crisp & Exact)
logo_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 985 155" fill="none">
  <path fill-rule="evenodd" d="{d_path}" fill="#FFFFFF" class="nerobel-logo-mark" />
</svg>'''

with open('assets/icons/nerobel-logo.svg', 'w', encoding='utf-8') as f:
    f.write(logo_svg)

with open('assets/icons/nerobel-logo-white.svg', 'w', encoding='utf-8') as f:
    f.write(logo_svg)

# 2. Light mode dark version
logo_dark_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 985 155" fill="none">
  <path fill-rule="evenodd" d="{d_path}" fill="#0F172A" />
</svg>'''

with open('assets/icons/nerobel-logo-dark.svg', 'w', encoding='utf-8') as f:
    f.write(logo_dark_svg)

# 3. Full Banner Logo (Exact Vector Logo + Laser Underline + Baseline Subtitles)
banner_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 985 240" fill="none">
  <defs>
    <filter id="laserGlowFull" x="-20%" y="-50%" width="140%" height="200%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="laserGradFull" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3AA0E6" stop-opacity="0" />
      <stop offset="20%" stop-color="#3AA0E6" stop-opacity="0.5" />
      <stop offset="50%" stop-color="#00E5FF" stop-opacity="1" />
      <stop offset="80%" stop-color="#3AA0E6" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#3AA0E6" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Exact Vector Logo from Client Attachment -->
  <path fill-rule="evenodd" d="{d_path}" fill="#FFFFFF" />

  <!-- Electric Cyan Laser Underline -->
  <line x1="80" y1="168" x2="905" y2="168" stroke="url(#laserGradFull)" stroke-width="3" filter="url(#laserGlowFull)"/>
  <circle cx="492" cy="168" r="3" fill="#FFFFFF"/>

  <!-- Subtitle: Consumer Tech for Modern Homes -->
  <text x="492" y="202" text-anchor="middle" font-family="'Inter', -apple-system, sans-serif" font-size="23" font-weight="500" letter-spacing="0.5" fill="#FFFFFF">Consumer Tech for Modern Homes</text>

  <!-- Category Triad -->
  <text x="492" y="230" text-anchor="middle" font-family="'Inter', -apple-system, sans-serif" font-size="15" font-weight="400" letter-spacing="1.2" fill="#8A8F99">
    Home Appliances <tspan fill="#3AA0E6">•</tspan> Bath &amp; Kitchen <tspan fill="#3AA0E6">•</tspan> Smart TV
  </text>
</svg>'''

with open('assets/icons/nerobel-logo-full.svg', 'w', encoding='utf-8') as f:
    f.write(banner_svg)

# 4. Circular Avatar
avatar_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none">
  <circle cx="200" cy="200" r="195" fill="#000000"/>
  <circle cx="200" cy="200" r="188" stroke="#3AA0E6" stroke-width="7" />
  <g transform="translate(42, 148) scale(0.32)">
    <path fill-rule="evenodd" d="{d_path}" fill="#FFFFFF" />
  </g>
</svg>'''

with open('assets/icons/nerobel-avatar.svg', 'w', encoding='utf-8') as f:
    f.write(avatar_svg)

print("SUCCESS: Master exact vector logos generated!")

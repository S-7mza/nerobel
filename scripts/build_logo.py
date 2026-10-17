import base64
import os

with open('assets/icons/nerobel-logo-white.png', 'rb') as f:
    b64_white = base64.b64encode(f.read()).decode('utf-8')

with open('assets/icons/nerobel-logo-dark.png', 'rb') as f:
    b64_dark = base64.b64encode(f.read()).decode('utf-8')

# 1. Exact logo SVG with CSS theme switching
svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 985 155" width="100%" height="100%">
  <style>
    .logo-white {{ display: block; }}
    .logo-dark {{ display: none; }}
    @media (prefers-color-scheme: light) {{
      :root[data-theme="light"] .logo-white {{ display: none; }}
      :root[data-theme="light"] .logo-dark {{ display: block; }}
    }}
    :root[data-theme="light"] .logo-white {{ display: none; }}
    :root[data-theme="light"] .logo-dark {{ display: block; }}
  </style>
  <image class="logo-white" href="data:image/png;base64,{b64_white}" x="0" y="0" width="985" height="155" />
  <image class="logo-dark" href="data:image/png;base64,{b64_dark}" x="0" y="0" width="985" height="155" />
</svg>'''

with open('assets/icons/nerobel-logo.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

# 2. Also create full banner logo with the exact logo + laser line + subtext
svg_banner_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 985 240" width="100%" height="100%">
  <defs>
    <filter id="laserGlowBanner" x="-20%" y="-50%" width="140%" height="200%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="laserGradBanner" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3AA0E6" stop-opacity="0" />
      <stop offset="20%" stop-color="#3AA0E6" stop-opacity="0.5" />
      <stop offset="50%" stop-color="#38E8FF" stop-opacity="1" />
      <stop offset="80%" stop-color="#3AA0E6" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#3AA0E6" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Exact Logo from User Attachment -->
  <image href="data:image/png;base64,{b64_white}" x="0" y="0" width="985" height="155" />

  <!-- Cyan Laser Underline -->
  <line x1="120" y1="165" x2="865" y2="165" stroke="url(#laserGradBanner)" stroke-width="3" filter="url(#laserGlowBanner)"/>
  <circle cx="492" cy="165" r="3" fill="#FFFFFF"/>

  <!-- Subtitle matching attachment -->
  <text x="492" y="200" text-anchor="middle" font-family="'Inter', -apple-system, sans-serif" font-size="23" font-weight="500" letter-spacing="0.5" fill="#FFFFFF">Consumer Tech for Modern Homes</text>
  <text x="492" y="228" text-anchor="middle" font-family="'Inter', -apple-system, sans-serif" font-size="15" font-weight="400" letter-spacing="1.2" fill="#8A8F99">
    Home Appliances <tspan fill="#3AA0E6">•</tspan> Bath &amp; Kitchen <tspan fill="#3AA0E6">•</tspan> Smart TV
  </text>
</svg>'''

with open('assets/icons/nerobel-logo-full.svg', 'w', encoding='utf-8') as f:
    f.write(svg_banner_content)

# 3. Also circular avatar
svg_avatar_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <circle cx="200" cy="200" r="195" fill="#000000"/>
  <circle cx="200" cy="200" r="188" stroke="#3AA0E6" stroke-width="7" />
  <!-- Scaled and centered logo -->
  <image href="data:image/png;base64,{b64_white}" x="35" y="150" width="330" height="52" />
</svg>'''

with open('assets/icons/nerobel-avatar.svg', 'w', encoding='utf-8') as f:
    f.write(svg_avatar_content)

print("SUCCESS: Exact vector-embedded SVG logos generated directly from user attachment image!")

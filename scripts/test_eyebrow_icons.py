import os
from playwright.sync_api import sync_playwright

html_content = """<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css">
  <link rel="stylesheet" href="css/theme.css">
  <link rel="stylesheet" href="css/main.css">
  <style>
    body {
      background: #06090E;
      color: #FFF;
      padding: 40px;
      font-family: var(--fb);
    }
    .test-row {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 40px;
      max-width: 700px;
    }
    .test-card {
      background: #0B1017;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .label {
      font-size: 14px;
      color: #94A3B8;
      font-family: var(--fm);
    }
    .nerobel-n-icon {
      width: 14px;
      height: 14px;
      display: inline-block;
      vertical-align: middle;
    }
  </style>
</head>
<body>
  <h2>Évaluation des Icônes Métier (Linked to Business) pour l'Eyebrow Hero</h2>
  <p style="color:#64748B; margin-bottom:24px;">Remplacement de l'icône IA "sparkles" par des symboles industriels et technologiques de référence.</p>

  <div class="test-row">
    <div class="test-card">
      <div class="label">1. ti-smart-home (Consumer Tech & Maison Moderne)</div>
      <div class="eyebrow">
        <i class="ti ti-smart-home"></i>
        <span>Consumer Tech for Modern Homes</span>
      </div>
    </div>

    <div class="test-card">
      <div class="label">2. Nerobel Official N-Glyph Vector (Identité Industrielle Pure)</div>
      <div class="eyebrow">
        <svg class="nerobel-n-icon" viewBox="0 0 100 100" fill="none">
          <path d="M 37.0 80.0 L 41.0 60.0 L 45.0 60.0 L 56.0 80.0 L 68.0 80.0 L 77.0 35.0 L 64.0 35.0 L 60.0 55.0 L 49.0 35.0 L 37.0 35.0 L 29.0 80.0 Z" fill="currentColor"/>
        </svg>
        <span>Consumer Tech for Modern Homes</span>
      </div>
    </div>

    <div class="test-card">
      <div class="label">3. ti-cpu (Ingénierie & Électronique de Précision)</div>
      <div class="eyebrow">
        <i class="ti ti-cpu"></i>
        <span>Consumer Tech for Modern Homes</span>
      </div>
    </div>

    <div class="test-card">
      <div class="label">4. ti-home-bolt (Énergie, Thermique & Confort Électrique)</div>
      <div class="eyebrow">
        <i class="ti ti-home-bolt"></i>
        <span>Consumer Tech for Modern Homes</span>
      </div>
    </div>

    <div class="test-card">
      <div class="label">5. ti-flame + ti-device-tv Dual/Group Icon (Thermique & Tech)</div>
      <div class="eyebrow">
        <i class="ti ti-flame" style="color:var(--gold);"></i>
        <i class="ti ti-device-tv"></i>
        <span>Consumer Tech for Modern Homes</span>
      </div>
    </div>
  </div>

  <h2>Version Light Mode</h2>
  <div class="test-row" style="background:#F8FAFC; padding:24px; border-radius:12px;" data-theme="light">
    <div class="test-card" style="background:#FFF; border:1px solid #E2E8F0;">
      <div class="label" style="color:#475569;">Option 1: ti-smart-home</div>
      <div class="eyebrow">
        <i class="ti ti-smart-home"></i>
        <span>Consumer Tech for Modern Homes</span>
      </div>
    </div>
  </div>
</body>
</html>
"""

with open("test_icon_alternatives.html", "w", encoding="utf-8") as f:
    f.write(html_content)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1000, 'height': 900})
    page.goto(f"file:///{os.path.abspath('test_icon_alternatives.html')}")
    page.wait_for_timeout(500)
    page.screenshot(path="screenshot_icon_options.png", full_page=True)
    print("Screenshot saved to screenshot_icon_options.png")

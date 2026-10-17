/* ─────────────────────────────────────────────────────────────
   NEROBEL GROUP · THEME CONTROLLER (js/theme.js)
   Dark Luxury Default with Crisp Architectural Light Mode
   ───────────────────────────────────────────────────────────── */

class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('nerobel_theme') || 'dark';
  }

  init() {
    this.applyTheme(this.theme);
    this.bindEvents();
  }

  applyTheme(theme) {
    this.theme = theme;
    localStorage.setItem('nerobel_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    // Update icons on all theme toggle buttons
    document.querySelectorAll('button.theme-btn, .theme-toggle').forEach(btn => {
      btn.innerHTML = (theme === 'dark') ? '<i class="ti ti-sun"></i>' : '<i class="ti ti-moon"></i>';
      btn.setAttribute('title', (theme === 'dark') ? 'Mode Clair' : 'Mode Sombre');
      btn.setAttribute('aria-label', (theme === 'dark') ? 'Activer le mode clair' : 'Activer le mode sombre');
    });
  }

  toggle() {
    const next = (this.theme === 'dark') ? 'light' : 'dark';
    this.applyTheme(next);
  }

  bindEvents() {
    document.querySelectorAll('button.theme-btn, .theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  }
}

window.themeManager = new ThemeManager();
document.addEventListener('DOMContentLoaded', () => window.themeManager.init());

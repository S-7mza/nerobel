/**
 * js/analytics.js
 * Privacy-first, lightweight client event logger (S4-05).
 * Dispatches to window.dataLayer for GTM/GA4 compatibility without third-party cookies.
 */

(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  var events = [];

  window.nerobelAnalytics = {
    events: events,
    track: function (eventName, params) {
      params = params || {};
      var payload = Object.assign({
        event: eventName,
        timestamp: new Date().toISOString()
      }, params);

      events.push(payload);
      window.dataLayer.push(payload);

      try {
        window.dispatchEvent(new CustomEvent('nerobel:analytics', { detail: payload }));
      } catch (_) {}

      return payload;
    }
  };

  function deduceSource(element) {
    if (element.closest('.site-header')) return 'header';
    if (element.closest('.hero-section') || element.closest('.error-hero')) return 'hero';
    if (element.closest('.site-footer')) return 'footer';
    if (element.closest('.mobile-bar') || element.closest('.mobile-sticky-bar')) return 'bar';
    if (element.closest('.brand-card') || element.closest('.outlet-card') || element.closest('.showroom-card') || element.closest('.pillar-card') || element.closest('.feature-mini-card')) return 'card';
    return 'page';
  }

  document.addEventListener('click', function (e) {
    var target = e.target.closest('a, button');
    if (!target) return;

    var href = target.getAttribute('href') || '';

    // 5. whatsapp_click
    if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp.com') !== -1) {
      window.nerobelAnalytics.track('whatsapp_click', {
        source: deduceSource(target)
      });
      return;
    }

    // 6. call_click
    if (href.indexOf('tel:') === 0) {
      window.nerobelAnalytics.track('call_click', {
        source: deduceSource(target)
      });
      return;
    }

    // 8. pdf_download
    if (target.hasAttribute('download') || href.indexOf('.pdf') !== -1 || target.getAttribute('data-evt') === 'pdf_download') {
      window.nerobelAnalytics.track('pdf_download', {
        file: href.split('/').pop() || href
      });
      return;
    }

    // 9. brand_tab_switch
    if (target.classList.contains('brand-tabs__link')) {
      var brandId = href.replace('#', '') || target.textContent.trim().toLowerCase();
      window.nerobelAnalytics.track('brand_tab_switch', {
        brand: brandId
      });
      return;
    }


    // 10. simulator_interact (Theros power mode buttons)
    if (target.classList.contains('power-mode-btn')) {
      window.nerobelAnalytics.track('simulator_interact', {
        brand: 'theros',
        setting: target.getAttribute('data-power')
      });
      return;
    }
  }, true);

  // Theros simulator slider & radio changes
  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'therosTempSlider') {
      window.nerobelAnalytics.track('simulator_interact', {
        brand: 'theros',
        setting: e.target.value + 'C'
      });
    } else if (e.target && e.target.name === 'therosMode') {
      window.nerobelAnalytics.track('simulator_interact', {
        brand: 'theros',
        setting: e.target.value
      });
    }
  });

})();

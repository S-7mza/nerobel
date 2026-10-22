/* ─────────────────────────────────────────────────────────────
   NEROBEL GROUP · SHOWROOM & OUTLETS NETWORK (js/network.js)
   S3-04: Confirmed outlets locator, filters, mobile list/map toggle
   ───────────────────────────────────────────────────────────── */

const SEED_OUTLETS = [
  {
    "id": "casablanca-siege",
    "name": "Siège Social & Showroom Principal",
    "type": "showroom",
    "city": "Casablanca",
    "address": "Angle Boulevard d'Anfa & Rue Mozart, Casablanca, Maroc",
    "phone": "+212661999747",
    "whatsapp": "+212787013201",
    "hours": "Lun - Sam : 08h30 - 19h30",
    "brands": null,
    "maps_url": "https://maps.google.com/?q=33.5892,-7.6322",
    "lat": 33.5892,
    "lng": -7.6322,
    "confirmed": true,
    "confirmed_on": "2026-10-17"
  }
];

class NetworkManager {
  constructor() {
    this.outlets = [];
    this.map = null;
    this.markers = [];
    this.markersMap = new Map();
    this.activeId = null;
    this.currentCity = 'all';
    this.currentBrand = 'all';
    this.currentType = 'all';
    this.userCoords = null;
  }

  async init() {
    await this.loadData();
    this.readQueryParams();
    await this.initMap();
    this.initMobileToggle();
    this.initFilterSheet();
    this.initNearby();
    this.bindFilters();
    this.renderDirectory();
    this.updateMarkers();
  }

  async loadData() {
    try {
      const res = await fetch('content/outlets.json');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // STRICT RULE: only entries with "confirmed": true
          this.outlets = data.filter(item => item && item.confirmed === true);
        } else {
          this.outlets = SEED_OUTLETS.filter(item => item.confirmed === true);
        }
      } else {
        this.outlets = SEED_OUTLETS.filter(item => item.confirmed === true);
      }
    } catch (err) {
      this.outlets = SEED_OUTLETS.filter(item => item.confirmed === true);
    }

    if (!this.outlets.length) {
      this.outlets = SEED_OUTLETS.filter(item => item.confirmed === true);
    }
  }

  readQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const brandParam = params.get('brand');
    const cityParam = params.get('city');

    if (brandParam) {
      this.currentBrand = brandParam.toLowerCase().trim();
      this.syncSelectValue('filterBrand', this.currentBrand);
      this.syncSelectValue('filterSheetBrand', this.currentBrand);
    }

    if (cityParam) {
      this.currentCity = cityParam.toLowerCase().trim();
      this.syncSelectValue('filterCity', this.currentCity);
      this.syncSelectValue('filterSheetCity', this.currentCity);
    }
  }

  syncSelectValue(selectId, value) {
    const el = document.getElementById(selectId);
    if (!el) return;
    const exists = Array.from(el.options).some(opt => opt.value.toLowerCase() === value.toLowerCase());
    if (exists) {
      el.value = value;
    }
  }

  async initMap() {
    const mapEl = document.getElementById('networkLeafletMap');
    if (!mapEl || typeof L === 'undefined') return;

    // Full sovereign Moroccan territory bounds (Tangier to Lagouira)
    this.moroccoBounds = [[20.76, -17.2], [36.0, -1.0]];

    this.map = L.map('networkLeafletMap', {
      scrollWheelZoom: false,
      minZoom: 4,
      maxZoom: 18
    });

    this.map.fitBounds(this.moroccoBounds, { padding: [25, 25] });

    // Enable RTL text plugin if available
    if (typeof maplibregl !== 'undefined' && maplibregl.getRTLTextPluginStatus && maplibregl.getRTLTextPluginStatus() === 'unavailable') {
      try {
        maplibregl.setRTLTextPlugin(
          'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
          null,
          true
        );
      } catch (e) {
        // Plugin may already be queued or initialized
      }
    }

    // 1. Vector Tiles via MapLibre GL with sanitized Moroccan worldview (no Sahara dividing line)
    try {
      if (typeof maplibregl !== 'undefined' && typeof L.maplibreGL !== 'undefined') {
        const res = await fetch('https://tiles.openfreemap.org/styles/positron');
        if (res.ok) {
          const style = await res.json();

          // Remove all OpenFreeMap boundary layers to eliminate baked internal dividing lines
          style.layers = style.layers.filter(l => !(l.id && l.id.includes('boundary')) && l['source-layer'] !== 'boundary');

          // Ensure clean French / Latin typography on all place labels (removes reversed unshaped Arabic)
          style.layers.forEach(l => {
            if (l.layout && l.layout['text-field']) {
              l.layout['text-field'] = [
                'coalesce',
                ['get', 'name:fr'],
                ['get', 'name:latin'],
                ['get', 'name:en'],
                ['get', 'name']
              ];
            }
          });

          // Filter out Western Sahara country labels from place/label layers
          style.layers.forEach(l => {
            if (l.id && l.id.includes('country')) {
              const origFilter = l.filter || ['all'];
              l.filter = [
                'all',
                origFilter,
                ['!=', ['get', 'name:en'], 'Western Sahara'],
                ['!=', ['get', 'name:fr'], 'Sahara occidental'],
                ['!=', ['get', 'name:ar'], 'الصحراء الغربية'],
                ['!=', ['get', 'name'], 'Western Sahara']
              ];
            }
          });

          this.maplibreLayer = L.maplibreGL({
            style: style,
            attribution: '&copy; <a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> &copy; OpenStreetMap contributors'
          }).addTo(this.map);
        } else {
          throw new Error('Could not load vector style');
        }
      } else {
        throw new Error('MapLibre GL not available');
      }
    } catch (err) {
      console.warn('MapLibre GL vector layer fallback to raster:', err);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 18
      }).addTo(this.map);
    }

    // 2. Surrounding regional boundaries (Spain/Portugal, Mauritania/Algeria, etc.)
    try {
      const regRes = await fetch('content/boundaries_regional.geojson');
      if (regRes.ok) {
        const regGeo = await regRes.json();
        this.regionalBoundariesLayer = L.geoJSON(regGeo, {
          style: {
            color: '#94a3b8',
            weight: 1.2,
            opacity: 0.65,
            dashArray: '3, 4'
          }
        }).addTo(this.map);
      }
    } catch (e) {
      console.warn('Regional boundaries failed to load:', e);
    }

    // 3. Add the official unified Moroccan sovereign boundary polygon overlay
    try {
      const geoRes = await fetch('content/morocco.geojson');
      if (geoRes.ok) {
        const moroccoGeo = await geoRes.json();
        this.moroccoLayer = L.geoJSON(moroccoGeo, {
          style: {
            color: '#2563EB',
            weight: 2.2,
            opacity: 0.9,
            fillColor: '#2563EB',
            fillOpacity: 0.04
          }
        }).addTo(this.map);
      }
    } catch (e) {
      console.warn('Morocco GeoJSON layer failed to load:', e);
    }
  }

  initMobileToggle() {
    const btnList = document.getElementById('btnToggleList');
    const btnMap = document.getElementById('btnToggleMap');
    const grid = document.getElementById('networkMainGrid');

    if (btnList && btnMap && grid) {
      btnList.addEventListener('click', () => {
        grid.classList.remove('view-map');
        grid.classList.add('view-list');
        btnList.classList.add('active');
        btnList.setAttribute('aria-pressed', 'true');
        btnMap.classList.remove('active');
        btnMap.setAttribute('aria-pressed', 'false');
      });

      btnMap.addEventListener('click', () => {
        grid.classList.remove('view-list');
        grid.classList.add('view-map');
        btnMap.classList.add('active');
        btnMap.setAttribute('aria-pressed', 'true');
        btnList.classList.remove('active');
        btnList.setAttribute('aria-pressed', 'false');
        if (this.map) {
          setTimeout(() => {
            this.map.invalidateSize();
            if (this.maplibreLayer && this.maplibreLayer.getMaplibreMap) {
              const glMap = this.maplibreLayer.getMaplibreMap();
              if (glMap) glMap.resize();
            }
            if (this.moroccoBounds) {
              this.map.fitBounds(this.moroccoBounds, { padding: [25, 25] });
            }
          }, 150);
        }
      });
    }
  }

  initFilterSheet() {
    const btnOpen = document.getElementById('btnOpenFilterSheet');
    const dialog = document.getElementById('filterBottomSheet');
    const btnClose = document.getElementById('btnCloseFilterSheet');
    const btnApply = document.getElementById('btnApplyFilterSheet');

    if (!dialog) return;

    if (btnOpen) {
      btnOpen.addEventListener('click', () => {
        if (typeof dialog.showModal === 'function') {
          dialog.showModal();
        } else {
          dialog.setAttribute('open', '');
        }
      });
    }

    const closeDialog = () => {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    };

    if (btnClose) btnClose.addEventListener('click', closeDialog);
    if (btnApply) {
      btnApply.addEventListener('click', () => {
        closeDialog();
      });
    }

    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        closeDialog();
      }
    });
  }

  initNearby() {
    const btnNearby = document.getElementById('btnNearby');
    const feedbackEl = document.getElementById('nearbyFeedback');
    if (!btnNearby || !feedbackEl) return;

    btnNearby.addEventListener('click', () => {
      if (!navigator.geolocation) {
        feedbackEl.style.display = 'block';
        feedbackEl.textContent = 'Géolocalisation non supportée par votre navigateur. Choisissez votre ville.';
        return;
      }

      feedbackEl.style.display = 'block';
      feedbackEl.textContent = 'Recherche de votre position...';

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;
          let anyWithCoords = false;

          this.outlets.forEach(item => {
            if (item.lat != null && item.lng != null && !isNaN(item.lat) && !isNaN(item.lng)) {
              item._distanceKm = this.haversine(userLat, userLng, Number(item.lat), Number(item.lng));
              anyWithCoords = true;
            } else {
              item._distanceKm = Infinity;
            }
          });

          if (anyWithCoords) {
            this.outlets.sort((a, b) => (a._distanceKm || Infinity) - (b._distanceKm || Infinity));
            feedbackEl.textContent = 'Points de vente classés par proximité.';
          } else {
            feedbackEl.textContent = 'Coordonnées GPS des points de vente en cours de vérification. Choisissez votre ville.';
          }

          this.renderDirectory();
          this.updateMarkers();
        },
        (err) => {
          // Exact required message on denial
          feedbackEl.style.display = 'block';
          feedbackEl.textContent = 'Géolocalisation non autorisée. Choisissez votre ville.';
        },
        { timeout: 10000 }
      );
    });
  }

  haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  bindFilters() {
    const syncAndFilter = (type, value) => {
      if (type === 'city') {
        this.currentCity = value;
        this.syncSelectValue('filterCity', value);
        this.syncSelectValue('filterSheetCity', value);
      } else if (type === 'brand') {
        this.currentBrand = value;
        this.syncSelectValue('filterBrand', value);
        this.syncSelectValue('filterSheetBrand', value);
      } else if (type === 'type') {
        this.currentType = value;
        this.syncSelectValue('filterType', value);
        this.syncSelectValue('filterSheetType', value);
      }
      this.renderDirectory();
      this.updateMarkers();
      if (window.nerobelAnalytics) {
        window.nerobelAnalytics.track('outlet_filter', {
          brand: this.currentBrand,
          city: this.currentCity,
          type: this.currentType
        });
      }
    };

    const pairs = [
      ['filterCity', 'city'],
      ['filterSheetCity', 'city'],
      ['filterBrand', 'brand'],
      ['filterSheetBrand', 'brand'],
      ['filterType', 'type'],
      ['filterSheetType', 'type']
    ];

    pairs.forEach(([id, type]) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => syncAndFilter(type, e.target.value));
      }
    });
  }

  getFilteredData() {
    return this.outlets.filter(item => {
      const matchCity = (this.currentCity === 'all') ||
        (item.city && item.city.toLowerCase() === this.currentCity.toLowerCase());

      // "brands: null means not specified: the outlet appears under every brand filter."
      let matchBrand = true;
      if (this.currentBrand !== 'all') {
        if (item.brands === null) {
          matchBrand = true;
        } else if (Array.isArray(item.brands)) {
          matchBrand = item.brands.some(b => b.toLowerCase().includes(this.currentBrand));
        } else {
          matchBrand = false;
        }
      }

      const matchType = (this.currentType === 'all') ||
        (item.type && item.type.toLowerCase() === this.currentType.toLowerCase());

      return matchCity && matchBrand && matchType;
    });
  }

  updateMarkers() {
    if (!this.map) return;

    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];
    this.markersMap.clear();

    const filtered = this.getFilteredData();
    const withCoords = filtered.filter(item => item.lat != null && item.lng != null && !isNaN(item.lat) && !isNaN(item.lng));

    withCoords.forEach(item => {
      const pinColor = item.type === 'showroom' ? '#2563EB' : '#C9A96A';
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background:#0C0C0E; border:2px solid ${pinColor}; width:36px; height:36px; border-radius:50%; display:grid; place-items:center; box-shadow:0 0 16px ${pinColor}55;"><i class="ti ti-building-store" style="color:${pinColor}; font-size:16px;"></i></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([Number(item.lat), Number(item.lng)], { icon: customIcon }).addTo(this.map);

      const cleanPhone = (item.phone || '').replace(/\s+/g, '');
      const cleanWa = (item.whatsapp || item.phone || '').replace(/[^0-9]/g, '');
      const encodedAddress = encodeURIComponent(item.address || '');

      marker.bindPopup(`
        <div class="leaflet-showroom-popup">
          <div class="popup-type-tag" style="color:${pinColor};">${item.type === 'showroom' ? 'Showroom Officiel' : 'Revendeur Agréé'}</div>
          <h4 class="popup-title">${item.name}</h4>
          <p class="popup-address"><i class="ti ti-map-pin"></i> ${item.address}</p>
          <div class="popup-phone"><i class="ti ti-phone"></i> ${item.phone}</div>
          <div class="popup-actions" style="display:flex; gap:8px; margin-top:8px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}" target="_blank" rel="noopener" class="popup-btn popup-btn--gps"><i class="ti ti-directions"></i> Itinéraire</a>
            <a href="https://wa.me/${cleanWa}?text=Bonjour%2C%20je%20souhaite%20visiter%20le%20point%20de%20vente%20${encodeURIComponent(item.name)}" target="_blank" rel="noopener" class="popup-btn popup-btn--wa"><i class="ti ti-brand-whatsapp"></i> WhatsApp</a>
          </div>
        </div>
      `, { maxWidth: 280, className: 'nerobel-map-popup' });

      marker.on('click', () => {
        this.highlightCard(item.id, true);
      });

      this.markers.push(marker);
      this.markersMap.set(item.id, marker);
    });

    if (this.currentCity !== 'all' && withCoords.length === 1) {
      this.map.flyTo([Number(withCoords[0].lat), Number(withCoords[0].lng)], 13, { duration: 1.0 });
    } else if (this.currentCity !== 'all' && withCoords.length > 1) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.15));
    } else if (this.moroccoBounds) {
      this.map.fitBounds(this.moroccoBounds, { padding: [25, 25] });
    }
  }

  highlightCard(id, shouldScroll = false) {
    this.activeId = id;
    const cards = document.querySelectorAll('.outlet-card');
    cards.forEach(card => {
      const cardId = card.getAttribute('data-id');
      const isActive = cardId === String(id);
      card.classList.toggle('is-active', isActive);
      if (isActive && shouldScroll) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  renderDirectory() {
    const listEl = document.getElementById('showroomsList');
    if (!listEl) return;

    const data = this.getFilteredData();
    const countEl = document.getElementById('showroomsCount');
    if (countEl) {
      countEl.textContent = `${data.length} Établissement${data.length > 1 ? 's' : ''}`;
    }

    if (!data.length) {
      listEl.innerHTML = `
        <div class="showrooms-empty-state" style="text-align:center; padding:40px 20px; background:var(--s2, #0d0f15); border:1px solid var(--bd, rgba(255,255,255,0.1)); border-radius:12px;">
          <i class="ti ti-map-pin-off" style="font-size:2.5rem; color:var(--tx2, #94a3b8); margin-bottom:12px; display:inline-block;"></i>
          <p style="color:var(--tx2, #94a3b8); margin-bottom:16px;">Aucun point de vente confirmé ne correspond à ces critères pour le moment. Contactez-nous pour être orienté vers le revendeur le plus proche.</p>
          <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
            <a href="https://wa.me/212787013201?text=Bonjour%2C%20je%20recherche%20un%20point%20de%20vente%20Nerobel" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm">
              <i class="ti ti-brand-whatsapp"></i> Écrire sur WhatsApp
            </a>
            <button type="button" class="btn btn-secondary btn-sm" id="resetNetworkFilters">
              <i class="ti ti-rotate"></i> Réinitialiser les filtres
            </button>
          </div>
        </div>
      `;
      const resetBtn = document.getElementById('resetNetworkFilters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.resetFilters());
      }
      return;
    }

    listEl.innerHTML = data.map(item => {
      const isActive = item.id === this.activeId;
      const typeLabel = item.type === 'showroom' ? 'Showroom Officiel' : 'Revendeur Agréé';
      const badgeClass = item.type === 'showroom' ? 'badge--showroom' : 'badge--revendeur';
      const cleanPhone = (item.phone || '').replace(/\s+/g, '');
      const cleanWa = (item.whatsapp || item.phone || '').replace(/[^0-9]/g, '');
      const encodedAddress = encodeURIComponent(item.address || '');
      const brandsText = item.brands && Array.isArray(item.brands)
        ? item.brands.join(', ')
        : 'Toutes les marques Nerobel Group';

      const distanceMarkup = (item._distanceKm != null && isFinite(item._distanceKm))
        ? `<span class="outlet-distance-badge" style="display:inline-block; font-size:0.75rem; background:rgba(37,99,235,0.15); color:var(--az,#2563eb); padding:2px 8px; border-radius:9999px; margin-left:8px;"><i class="ti ti-navigation"></i> à ${item._distanceKm.toFixed(1)} km</span>`
        : '';

      return `
        <article class="outlet-card ${isActive ? 'is-active' : ''}" data-id="${item.id}" tabindex="0" role="region" aria-label="${item.name}">
          <div class="outlet-card__header">
            <span class="outlet-card__badge ${badgeClass}">${typeLabel}</span>
            ${distanceMarkup}
            <h3 class="outlet-card__name">${item.name}</h3>
          </div>
          <p class="outlet-card__address"><i class="ti ti-map-pin text-az"></i> <span>${item.address}</span></p>
          <p class="outlet-card__hours"><i class="ti ti-clock text-gold"></i> <span>${item.hours || 'Horaires non communiqués'}</span></p>
          <p class="outlet-card__brands"><i class="ti ti-tag text-az"></i> <strong>Marques :</strong> <span>${brandsText}</span></p>
          <div class="outlet-card__actions">
            <a href="tel:${cleanPhone}" class="btn btn-secondary btn-sm" aria-label="Appeler ${item.name}">
              <i class="ti ti-phone"></i> Appeler
            </a>
            <a href="https://wa.me/${cleanWa}?text=Bonjour%2C%20je%20souhaite%20me%20renseigner%20sur%20le%20point%20de%20vente%20${encodeURIComponent(item.name)}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm" aria-label="WhatsApp ${item.name}">
              <i class="ti ti-brand-whatsapp"></i> WhatsApp
            </a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}" target="_blank" rel="noopener" class="btn btn-primary btn-sm" aria-label="Itinéraire vers ${item.name}">
              <i class="ti ti-directions"></i> Itinéraire
            </a>
          </div>
        </article>
      `;
    }).join('');

    listEl.querySelectorAll('.outlet-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' || e.target.closest('a')) return;
        const id = card.getAttribute('data-id');
        const item = this.outlets.find(s => String(s.id) === String(id));
        if (item && item.lat != null && item.lng != null && this.map) {
          this.map.flyTo([Number(item.lat), Number(item.lng)], 15, { duration: 1.0 });
          const marker = this.markersMap.get(id);
          if (marker) {
            setTimeout(() => marker.openPopup(), 450);
          }
        }
        this.highlightCard(id, false);
      });
    });
  }

  resetFilters() {
    this.currentCity = 'all';
    this.currentBrand = 'all';
    this.currentType = 'all';

    ['filterCity', 'filterSheetCity', 'filterBrand', 'filterSheetBrand', 'filterType', 'filterSheetType'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = 'all';
    });

    this.renderDirectory();
    this.updateMarkers();

    if (this.map) {
      this.map.flyTo([32.5, -6.5], 6, { duration: 1.0 });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('networkLeafletMap') || document.getElementById('showroomsList')) {
    window.networkManager = new NetworkManager();
    window.networkManager.init();
  }
});

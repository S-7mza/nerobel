/* ─────────────────────────────────────────────────────────────
   NEROBEL GROUP · SHOWROOM & DISTRIBUTOR NETWORK (js/network.js) - v2.0
   Interactive Leaflet Map & City Directory across Morocco
   Covering: Theros, Pacific, Eurogas, & Nerobel Consumer Tech
   ───────────────────────────────────────────────────────────── */

const SHOWROOMS_DATA = [
  {
    id: 1,
    name: "Nerobel Flagship Showroom & Siège",
    type: "showroom",
    typeLabel: "Showroom Officiel",
    city: "Casablanca",
    address: "Angle Bd d'Anfa & Rue Mozart, Casablanca",
    phone: "+212 522 99 88 77",
    whatsapp: "+212787013201",
    hours: "Lun - Sam : 08:30 - 19:30",
    brands: ["Theros", "Pacific", "Eurogas", "Consumer Tech"],
    lat: 33.5898,
    lng: -7.6322,
    confirmed: false
  },
  {
    id: 2,
    name: "Showroom Nerobel & Theros Ain Sebaa",
    type: "showroom",
    typeLabel: "Showroom Officiel",
    city: "Casablanca",
    address: "Zone Industrielle Ain Sebaa, Route de Rabat, Casablanca",
    phone: "+212 522 354 120",
    whatsapp: "+212787013201",
    hours: "Lun - Ven : 08:00 - 18:00",
    brands: ["Theros", "Pacific", "Eurogas"],
    lat: 33.6064,
    lng: -7.5321,
    confirmed: false
  },
  {
    id: 4,
    name: "Showroom Régional Rabat Agdal",
    type: "showroom",
    typeLabel: "Showroom Officiel",
    city: "Rabat",
    address: "Avenue Fal Ould Oumeir, Agdal, Rabat",
    phone: "+212 537 778 910",
    whatsapp: "+212787013201",
    hours: "Lun - Sam : 09:00 - 19:00",
    brands: ["Theros", "Pacific", "Eurogas"],
    lat: 34.0041,
    lng: -6.8496,
    confirmed: false
  },
  {
    id: 5,
    name: "Comptoir Sanitaire & Plomberie de Rabat",
    type: "distributor",
    typeLabel: "Grossiste Sanitaire Agréé",
    city: "Rabat",
    address: "Boulevard Hassan II, Quartier Industriel, Rabat",
    phone: "+212 537 289 140",
    whatsapp: "+212787013201",
    hours: "Lun - Sam : 08:00 - 18:30",
    brands: ["Pacific", "Eurogas"],
    lat: 34.0152,
    lng: -6.8321,
    confirmed: false
  },
  {
    id: 6,
    name: "Showroom Marrakech Guéliz",
    type: "showroom",
    typeLabel: "Showroom Officiel",
    city: "Marrakech",
    address: "Boulevard Mohamed V, Guéliz, Marrakech",
    phone: "+212 524 432 100",
    whatsapp: "+212787013201",
    hours: "Lun - Sam : 09:00 - 20:00",
    brands: ["Theros", "Pacific", "Eurogas", "Consumer Tech"],
    lat: 31.6346,
    lng: -8.0142,
    confirmed: false
  },
  {
    id: 7,
    name: "Showroom Tanger Malabata",
    type: "showroom",
    typeLabel: "Showroom Officiel",
    city: "Tanger",
    address: "Boulevard Mohammed VI, Baie de Tanger",
    phone: "+212 539 340 550",
    whatsapp: "+212787013201",
    hours: "Lun - Sam : 09:00 - 19:30",
    brands: ["Theros", "Pacific", "Eurogas"],
    lat: 35.7725,
    lng: -5.7924,
    confirmed: false
  },
  {
    id: 8,
    name: "Showroom Fès Route d'Imouzzer",
    type: "showroom",
    typeLabel: "Showroom Officiel",
    city: "Fès",
    address: "Route d'Imouzzer, Ville Nouvelle, Fès",
    phone: "+212 535 654 321",
    whatsapp: "+212787013201",
    hours: "Lun - Sam : 08:30 - 19:00",
    brands: ["Theros", "Pacific", "Eurogas"],
    lat: 34.0208,
    lng: -4.9998,
    confirmed: false
  },
  {
    id: 9,
    name: "Showroom Agadir Hassan II",
    type: "showroom",
    typeLabel: "Showroom Officiel",
    city: "Agadir",
    address: "Boulevard Hassan II, Centre-Ville, Agadir",
    phone: "+212 528 840 920",
    whatsapp: "+212787013201",
    hours: "Lun - Sam : 09:00 - 19:30",
    brands: ["Theros", "Pacific", "Eurogas"],
    lat: 30.4211,
    lng: -9.5982,
    confirmed: false
  }
];

class NetworkManager {
  constructor() {
    this.map = null;
    this.markers = [];
    this.markersMap = new Map();
    this.activeId = null;
    this.currentCity = 'all';
    this.currentBrand = 'all';
    this.currentType = 'all';
  }

  init() {
    this.initMap();
    this.renderDirectory();
    this.bindFilters();
  }

  initMap() {
    const mapEl = document.getElementById('networkLeafletMap');
    if (!mapEl || typeof L === 'undefined') return;

    this.map = L.map('networkLeafletMap', {
      scrollWheelZoom: false
    }).setView([32.5, -6.5], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(this.map);

    this.updateMarkers();
  }

  updateMarkers() {
    if (!this.map) return;

    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];
    this.markersMap.clear();

    const filtered = this.getFilteredData();

    filtered.forEach(item => {
      const pinColor = item.type === 'showroom' ? '#3AA0E6' : item.type === 'gsb' ? '#C9A96A' : '#34C77B';
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background:#0C0C0E; border:2px solid ${pinColor}; width:36px; height:36px; border-radius:50%; display:grid; place-items:center; box-shadow:0 0 16px ${pinColor}55;"><i class="ti ti-building-store" style="color:${pinColor}; font-size:16px;"></i></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(this.map);

      marker.bindPopup(`
        <div class="leaflet-showroom-popup">
          <div class="popup-type-tag" style="color:${pinColor};">${item.typeLabel}</div>
          <h4 class="popup-title">${item.name}</h4>
          <p class="popup-address"><i class="ti ti-map-pin"></i> ${item.address}</p>
          <div class="popup-phone"><i class="ti ti-phone"></i> ${item.phone}</div>
          <div class="popup-actions">
            <a href="https://maps.google.com/?q=${item.lat},${item.lng}" target="_blank" rel="noopener" class="popup-btn popup-btn--gps"><i class="ti ti-navigation"></i> GPS</a>
            <a href="https://wa.me/${item.whatsapp.replace(/[^0-9]/g,'')}?text=Bonjour,%20je%20souhaite%20visiter%20votre%20point%20de%20vente%20${encodeURIComponent(item.name)}" target="_blank" rel="noopener" class="popup-btn popup-btn--wa"><i class="ti ti-brand-whatsapp"></i> WhatsApp</a>
          </div>
        </div>
      `, { maxWidth: 280, className: 'nerobel-map-popup' });

      marker.on('click', () => {
        this.highlightCard(item.id, true);
      });

      this.markers.push(marker);
      this.markersMap.set(item.id, marker);
    });

    if (filtered.length === 1) {
      this.map.flyTo([filtered[0].lat, filtered[0].lng], 13, { duration: 1.0 });
    }
  }

  highlightCard(id, shouldScroll = false) {
    this.activeId = id;
    const cards = document.querySelectorAll('.showroom-card');
    cards.forEach(card => {
      const cardId = parseInt(card.getAttribute('data-id'), 10);
      card.classList.toggle('is-active', cardId === id);
      if (cardId === id && shouldScroll) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  getFilteredData() {
    return SHOWROOMS_DATA.filter(item => {
      const matchCity = (this.currentCity === 'all') || (item.city.toLowerCase() === this.currentCity.toLowerCase());
      const matchBrand = (this.currentBrand === 'all') || (item.brands.includes(this.currentBrand));
      const matchType = (this.currentType === 'all') || (item.type === this.currentType);
      return matchCity && matchBrand && matchType;
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
        <div class="showrooms-empty-state">
          <i class="ti ti-map-pin-off"></i>
          <p>La liste de nos points de vente est en cours de mise à jour. Contactez-nous sur WhatsApp.</p>
          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:12px;">
            <a href="https://wa.me/212787013201" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm">
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
      return `
        <article class="showroom-card ${isActive ? 'is-active' : ''}" data-id="${item.id}" tabindex="0" role="button" aria-label="${item.name}">
          <!-- Meta Top: City + Type + Status -->
          <div class="showroom-meta-top">
            <div class="showroom-tags">
              <span class="showroom-city-tag">${item.city}</span>
              <span class="showroom-type-badge showroom-type--${item.type}">
                <span class="type-indicator-dot"></span>
                ${item.typeLabel}
              </span>
            </div>
            <span class="showroom-status-live" title="Ouvert aux horaires indiqués">
              <span class="live-pulse"></span>
              Ouvert
            </span>
          </div>

          <!-- Showroom Name -->
          <h4 class="showroom-name">${item.name}</h4>

          <!-- Address -->
          <p class="showroom-address">
            <i class="ti ti-map-pin"></i>
            <span>${item.address}</span>
          </p>

          <!-- Dedicated Brand Chips Row (Flex-Wrap with Clean Spacing) -->
          <div class="showroom-brands-wrap" aria-label="Marques distribuées">
            ${item.brands.map(b => {
              const slug = b.toLowerCase().replace(/[^a-z0-9]/g, '');
              return `<span class="brand-chip brand-chip--${slug}">${b}</span>`;
            }).join('')}
          </div>

          <!-- Meta Strip (Phone & Schedule) -->
          <div class="showroom-info-strip">
            <a href="tel:${item.phone.replace(/\s+/g,'')}" class="showroom-phone-link" title="Appeler le showroom">
              <i class="ti ti-phone"></i>
              <span>${item.phone}</span>
            </a>
            <span class="showroom-hours">
              <i class="ti ti-clock"></i>
              <span>${item.hours}</span>
            </span>
          </div>

          <!-- Actions Row -->
          <div class="showroom-actions-row">
            <a href="https://maps.google.com/?q=${item.lat},${item.lng}" target="_blank" rel="noopener" class="btn-showroom-action btn-showroom-gps">
              <i class="ti ti-navigation"></i>
              <span>Itinéraire GPS</span>
            </a>
            <a href="https://wa.me/${item.whatsapp.replace(/[^0-9]/g,'')}?text=Bonjour,%20je%20souhaite%20visiter%20votre%20point%20de%20vente%20${encodeURIComponent(item.name)}" target="_blank" rel="noopener" class="btn-showroom-action btn-showroom-wa">
              <i class="ti ti-brand-whatsapp"></i>
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </article>
      `;
    }).join('');

    listEl.querySelectorAll('.showroom-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' || e.target.closest('a')) return;
        const id = parseInt(card.getAttribute('data-id'), 10);
        const item = SHOWROOMS_DATA.find(s => s.id === id);
        if (item && this.map) {
          this.map.flyTo([item.lat, item.lng], 15, { duration: 1.0 });
          const marker = this.markersMap.get(id);
          if (marker) {
            setTimeout(() => marker.openPopup(), 450);
          }
          this.highlightCard(id, false);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  bindFilters() {
    const citySelect = document.getElementById('filterCity');
    const brandSelect = document.getElementById('filterBrand');
    const typeSelect = document.getElementById('filterType');

    if (citySelect) {
      citySelect.addEventListener('change', (e) => {
        this.currentCity = e.target.value;
        this.renderDirectory();
        this.updateMarkers();
      });
    }

    if (brandSelect) {
      brandSelect.addEventListener('change', (e) => {
        this.currentBrand = e.target.value;
        this.renderDirectory();
        this.updateMarkers();
      });
    }

    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        this.currentType = e.target.value;
        this.renderDirectory();
        this.updateMarkers();
      });
    }
  }

  resetFilters() {
    this.currentCity = 'all';
    this.currentBrand = 'all';
    this.currentType = 'all';

    const citySelect = document.getElementById('filterCity');
    const brandSelect = document.getElementById('filterBrand');
    const typeSelect = document.getElementById('filterType');

    if (citySelect) citySelect.value = 'all';
    if (brandSelect) brandSelect.value = 'all';
    if (typeSelect) typeSelect.value = 'all';

    this.renderDirectory();
    this.updateMarkers();

    if (this.map) {
      this.map.flyTo([32.5, -6.5], 6, { duration: 1.0 });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('networkLeafletMap')) {
    window.networkManager = new NetworkManager();
    window.networkManager.init();
  }
});


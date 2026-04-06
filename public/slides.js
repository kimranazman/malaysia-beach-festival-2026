// ===== Slide Navigation =====
const deck = document.getElementById('deck');
const slides = document.querySelectorAll('.slide');
const total = slides.length;
const counter = document.getElementById('slideCounter');
const progressFill = document.getElementById('progressFill');
const navLeft = document.getElementById('navLeft');
const navRight = document.getElementById('navRight');

function getCurrentSlide() {
  const scrollTop = deck.scrollTop;
  const slideHeight = deck.clientHeight;
  return Math.round(scrollTop / slideHeight);
}

function updateUI() {
  const idx = getCurrentSlide();
  counter.textContent = `${idx + 1} / ${total}`;
  progressFill.style.width = `${((idx + 1) / total) * 100}%`;
  navLeft.style.opacity = idx === 0 ? '0.15' : '';
  navRight.style.opacity = idx === total - 1 ? '0.15' : '';
}

function goTo(idx) {
  idx = Math.max(0, Math.min(total - 1, idx));
  slides[idx].scrollIntoView({ behavior: 'smooth' });
}

navLeft.addEventListener('click', () => goTo(getCurrentSlide() - 1));
navRight.addEventListener('click', () => goTo(getCurrentSlide() + 1));

deck.addEventListener('scroll', updateUI);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
    e.preventDefault();
    goTo(getCurrentSlide() + 1);
  }
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault();
    goTo(getCurrentSlide() - 1);
  }
  if (e.key === 'Home') { e.preventDefault(); goTo(0); }
  if (e.key === 'End') { e.preventDefault(); goTo(total - 1); }
});

updateUI();

// ===== Leaflet Map =====
function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  // Wait for the map slide to be visible
  const mapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !window._mapInit) {
        window._mapInit = true;
        buildMap();
        mapObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  mapObserver.observe(mapEl.closest('.slide'));
}

function buildMap() {
  const map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: false
  }).setView([4.2, 109.5], 6);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 18
  }).addTo(map);

  const beaches = [
    { name: 'Port Dickson', state: 'Negeri Sembilan', date: 'Jan 30 - Feb 1', lat: 2.522, lng: 101.796 },
    { name: 'Batu Ferringhi', state: 'Pulau Pinang', date: 'Mar 4 - May 4', lat: 5.469, lng: 100.241 },
    { name: 'Pantai Chenang', state: 'Kedah (Langkawi)', date: 'Apr 24 - Apr 26', lat: 6.295, lng: 99.714 },
    { name: 'Bagan Datuk', state: 'Perak', date: 'May 8 - May 10', lat: 3.988, lng: 100.789 },
    { name: 'Pantai Irama', state: 'Kelantan (Bachok)', date: 'May 5 - Jun 7', lat: 6.054, lng: 102.402 },
    { name: 'Pantai Batu Buruk', state: 'Terengganu', date: 'Jun 26 - Jun 28', lat: 5.300, lng: 103.137 },
    { name: 'Pantai Sepat', state: 'Pahang', date: 'Jul 10 - Jul 12', lat: 3.947, lng: 103.375 },
    { name: 'Pantai Tg. Lipat', state: 'Sabah', date: 'Jul 31 - Aug 2', lat: 5.974, lng: 116.073 },
    { name: 'Pantai Tg. Batu', state: 'Sarawak (Bintulu)', date: 'Aug 21 - Aug 23', lat: 3.178, lng: 113.033 },
    { name: 'Pantai K. Perlis', state: 'Perlis', date: 'Apr 9 - Jun 9', lat: 6.398, lng: 100.129 },
    { name: 'Desaru', state: 'Johor', date: 'Sep 18 - Sep 20', lat: 1.539, lng: 104.258 },
    { name: 'Pantai Morib', state: 'Selangor', date: 'Oct 23 - Oct 25', lat: 2.736, lng: 101.441 },
    { name: 'Klebang', state: 'Melaka', date: 'Nov 13 - Nov 15', lat: 2.222, lng: 102.119 },
    { name: 'Pantai Damai', state: 'Sarawak (Santubong)', date: 'Dec 11 - Dec 13', lat: 1.717, lng: 110.319 }
  ];

  const pinIcon = L.divIcon({
    className: 'custom-pin',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10]
  });

  beaches.forEach(b => {
    L.marker([b.lat, b.lng], { icon: pinIcon })
      .addTo(map)
      .bindPopup(`<strong>${b.name}</strong>${b.state}<br><em>${b.date}</em>`);
  });

  window._map = map;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}

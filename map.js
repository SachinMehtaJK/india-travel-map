// Initialize Leaflet map
const map = L.map('map').setView([22.9734, 78.6569], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let points = [];
let totalDistance = 0;
let totalDays = 0;

// Haversine distance
function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// Slideshow state
const slideIndexes = {};

// Create slideshow HTML
function createSlideshowHTML(city, index) {
  let html = `<div class="slideshow-container" id="slideshow-${index}">`;

  for (let i = 1; i <= 10; i++) {
    html += `
      <div class="slide">
        <img src="images/${city}/${i}.jpg"
             onerror="this.closest('.slide').remove()"
             style="width:100%;height:100%;object-fit:cover;border-radius:8px;">
      </div>`;
  }

  html += `
    <button class="prev" onclick="prevSlide(${index})">&#10094;</button>
    <button class="next" onclick="nextSlide(${index})">&#10095;</button>
  </div>`;

  return html;
}

// Initialize slideshow AFTER popup opens
function initSlideshow(index) {
  const slides = document.querySelectorAll(`#slideshow-${index} .slide`);
  if (!slides.length) return;

  slideIndexes[index] = 0;

  slides.forEach((s, i) => {
    s.style.display = i === 0 ? 'block' : 'none';
  });
}

// Slide navigation
function nextSlide(index) {
  const slides = document.querySelectorAll(`#slideshow-${index} .slide`);
  if (!slides.length) return;

  slides[slideIndexes[index]].style.display = 'none';
  slideIndexes[index] = (slideIndexes[index] + 1) % slides.length;
  slides[slideIndexes[index]].style.display = 'block';
}

function prevSlide(index) {
  const slides = document.querySelectorAll(`#slideshow-${index} .slide`);
  if (!slides.length) return;

  slides[slideIndexes[index]].style.display = 'none';
  slideIndexes[index] =
    (slideIndexes[index] - 1 + slides.length) % slides.length;
  slides[slideIndexes[index]].style.display = 'block';
}

// Add markers
travels.forEach((t, i) => {
  const marker = L.marker([t.lat, t.lng]).addTo(map);

  marker.bindPopup(`
    <b>${t.city}</b><br>
    ${t.state}<br>
    <small>📅 ${formatDate(t.startDate)} – ${formatDate(t.endDate)}</small><br><br>
    ${createSlideshowHTML(t.city, i)}
  `);

  marker.on('popupopen', () => {
    // wait for DOM insertion
    setTimeout(() => initSlideshow(i), 50);
  });

  points.push([t.lat, t.lng]);

  const days =
    (new Date(t.endDate) - new Date(t.startDate)) /
      (1000 * 60 * 60 * 24) + 1;
  totalDays += days;

  if (i > 0) {
    totalDistance += distance(
      travels[i - 1].lat,
      travels[i - 1].lng,
      t.lat,
      t.lng
    );
  }
});

// Route line
const route = L.polyline(points, {
  color: "#1976d2",
  weight: 4,
  opacity: 0.85
}).addTo(map);

map.fitBounds(route.getBounds(), { padding: [30, 30] });

// Stats
document.getElementById("distance").innerText = totalDistance.toFixed(2);
document.getElementById("days").innerText = totalDays;

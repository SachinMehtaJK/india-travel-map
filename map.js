const map = L.map('map').setView([22.9734, 78.6569], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let points = [];
let totalDistance = 0;
let totalDays = 0;

// Haversine formula
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

travels.forEach((t, i) => {
L.marker([t.lat, t.lng])
  .addTo(map)
  .bindPopup(`
    <b>${t.city}</b><br>
    ${t.state}<br>
    <small>📅 ${formatDate(t.startDate)} – ${formatDate(t.endDate)}</small>
  `);

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

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}


L.polyline(points, {
  color: "#007bff",
  weight: 4,
  opacity: 0.8
}).addTo(map);

const route = L.polyline(points, {
  color: "#1976d2",
  weight: 4,
  opacity: 0.9
}).addTo(map);

map.fitBounds(route.getBounds(), { padding: [30, 30] });


document.getElementById("distance").innerText = totalDistance.toFixed(2);
document.getElementById("days").innerText = totalDays;

<!-- src/views/MapView.vue -->
<template>
  <div class="container-xxl">
    <header class="page-head">
      <span class="eyebrow">Drop-off map</span>
      <h1>Find a recycling hub near you</h1>
      <p>Explore verified drop-off centres across Melbourne. Filter by material, then tap a marker to see the distance and route from the CBD.</p>
    </header>

    <!-- Controls Card: Feature 1 (Search & Filter) -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-12 col-md-5">
            <label for="filterCategory" class="form-label fw-semibold">Material type</label>
            <select id="filterCategory" v-model="selectedCategory" class="form-select" @change="applyFilters">
              <option value="ALL">All Categories</option>
              <option value="Soft Plastics">Soft Plastics</option>
              <option value="E-Waste">E-Waste</option>
              <option value="Organics">Organics</option>
              <option value="Repair">Repair</option>
            </select>
          </div>
          <div class="col-12 col-md-4">
            <label for="userLocation" class="form-label fw-semibold">Starting point</label>
            <input
              id="userLocation"
              type="text"
              class="form-control"
              value="Melbourne Town Hall (CBD)"
              readonly
            />
          </div>
          <div class="col-12 col-md-3 d-flex align-items-end">
            <button class="btn btn-outline-success w-100" @click="resetMapView">
              Reset map view
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Map & Route Info Container -->
    <div class="row g-4">
      <!-- Leaflet Map Container -->
      <div class="col-12 col-lg-8">
        <div class="card overflow-hidden">
          <div id="mapContainer" style="height: 520px; width: 100%;"></div>
        </div>
      </div>

      <!-- Feature 2: Route & Distance Info Panel -->
      <div class="col-12 col-lg-4">
        <div class="card h-100">
          <div class="card-header">
            <h2 class="h6 mb-0">Trip details</h2>
          </div>
          <div class="card-body">
            <div v-if="selectedHub" class="fade show">
              <h3 class="h5 mb-1">{{ selectedHub.name }}</h3>
              <p class="small text-muted mb-3">{{ selectedHub.address }}</p>

              <div class="list-group list-group-flush mb-3">
                <div class="list-group-item px-0 d-flex justify-content-between">
                  <span class="text-muted">Material</span>
                  <span class="badge bg-secondary">{{ selectedHub.category }}</span>
                </div>
                <div class="list-group-item px-0 d-flex justify-content-between">
                  <span class="text-muted">Distance</span>
                  <strong class="text-success">{{ calculatedDistance }} km</strong>
                </div>
                <div class="list-group-item px-0 d-flex justify-content-between">
                  <span class="text-muted">Travel time</span>
                  <strong>{{ calculatedTravelTime }} min <span class="fw-normal text-muted small">bike / car</span></strong>
                </div>
              </div>

              <p class="small text-muted mb-0">
                The dashed line on the map shows the route from Melbourne CBD to this hub.
              </p>
            </div>

            <div v-else class="map-empty">
              <span class="icon-chip mb-3" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </span>
              <p class="fw-semibold mb-1">Select a hub on the map</p>
              <p class="small text-muted mb-0">You'll see the distance, travel time and route from the CBD.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Green pin that matches the site theme (replaces Leaflet's default blue marker)
const ecoPinIcon = L.divIcon({
  className: 'eco-pin',
  html: '<svg viewBox="0 0 32 42" width="30" height="40" aria-hidden="true"><path d="M16 1C7.7 1 1 7.6 1 15.8 1 27 16 41 16 41s15-14 15-25.2C31 7.6 24.3 1 16 1Z" fill="#15803d" stroke="#fff" stroke-width="2"/><circle cx="16" cy="15.5" r="5.5" fill="#fff"/></svg>',
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -36]
})

// Default User Origin: Melbourne Town Hall
const userOrigin = { lat: -37.8149, lng: 144.9660, name: 'Melbourne Town Hall (CBD)' }

const selectedCategory = ref('ALL')
const selectedHub = ref(null)
const calculatedDistance = ref(null)
const calculatedTravelTime = ref(null)

let map = null
let markersGroup = null
let activeRouteLine = null

// Mock Melbourne Hubs with Geocoordinates
const hubsData = [
  { id: 1, name: "Carlton North Depot", address: "12 Nicholson St, Carlton", category: "Soft Plastics", lat: -37.7980, lng: 144.9750 },
  { id: 2, name: "Melbourne Central Station Hub", address: "La Trobe St, Melbourne CBD", category: "E-Waste", lat: -37.8105, lng: 144.9628 },
  { id: 3, name: "Brunswick Repair Hub", address: "233 Sydney Rd, Brunswick", category: "Repair", lat: -37.7710, lng: 144.9600 },
  { id: 4, name: "Fitzroy Compost Collective", address: "95 Napier St, Fitzroy", category: "Organics", lat: -37.8010, lng: 144.9820 },
  { id: 5, name: "South Yarra Battery Box", address: "Toorak Rd, South Yarra", category: "E-Waste", lat: -37.8390, lng: 144.9890 },
  { id: 6, name: "St Kilda Eco Hub", address: "Fitzroy St, St Kilda", category: "Soft Plastics", lat: -37.8600, lng: 144.9780 },
  { id: 7, name: "Footscray Resource Station", address: "Barkly St, Footscray", category: "Organics", lat: -37.7990, lng: 144.9000 }
]

// Haversine Formula for distance calculation
const calculateHaversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return (R * c).toFixed(2)
}

const renderMarkers = () => {
  if (!markersGroup) return
  markersGroup.clearLayers()

  const filtered = selectedCategory.value === 'ALL'
    ? hubsData
    : hubsData.filter(h => h.category === selectedCategory.value)

  filtered.forEach(hub => {
    const marker = L.marker([hub.lat, hub.lng], { icon: ecoPinIcon, title: hub.name, alt: hub.name })
    // Give the custom pin an accessible name for screen readers (WCAG 2.1 AA)
    marker.on('add', () => marker.getElement()?.setAttribute('aria-label', `${hub.name} drop-off hub`))
    marker.bindPopup(`<strong>${hub.name}</strong><br>${hub.category}<br><small>${hub.address}</small>`)

    // Non-trivial Feature 2: Route navigation on marker click
    marker.on('click', () => {
      selectHub(hub)
    })

    markersGroup.addLayer(marker)
  })
}

const selectHub = (hub) => {
  selectedHub.value = hub
  const dist = calculateHaversine(userOrigin.lat, userOrigin.lng, hub.lat, hub.lng)
  calculatedDistance.value = dist
  calculatedTravelTime.value = Math.max(3, Math.round(dist * 3.5))

  // Draw or update routing line
  if (activeRouteLine) {
    map.removeLayer(activeRouteLine)
  }
  activeRouteLine = L.polyline(
    [[userOrigin.lat, userOrigin.lng], [hub.lat, hub.lng]],
    { color: '#111a15', weight: 3, dashArray: '6, 8' }
  ).addTo(map)

  map.fitBounds(activeRouteLine.getBounds(), { padding: [40, 40] })
}

const applyFilters = () => {
  renderMarkers()
  if (activeRouteLine) {
    map.removeLayer(activeRouteLine)
    activeRouteLine = null
  }
  selectedHub.value = null
}

const resetMapView = () => {
  selectedCategory.value = 'ALL'
  selectedHub.value = null
  if (activeRouteLine) {
    map.removeLayer(activeRouteLine)
    activeRouteLine = null
  }
  renderMarkers()
  map.setView([userOrigin.lat, userOrigin.lng], 12)
}

onMounted(() => {
  // Fix Leaflet's default icon paths in bundlers like Vite
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
  })

  // Initialize Map centered on Melbourne CBD
  map = L.map('mapContainer').setView([userOrigin.lat, userOrigin.lng], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // Add distinct marker for User Origin
  const originMarker = L.circleMarker([userOrigin.lat, userOrigin.lng], {
    radius: 9,
    fillColor: '#15803d',
    color: '#ffffff',
    weight: 2,
    fillOpacity: 0.9
  }).addTo(map)
  originMarker.bindPopup('<strong>Origin:</strong> Melbourne Town Hall (CBD)')

  markersGroup = L.layerGroup().addTo(map)
  renderMarkers()
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
#mapContainer {
  z-index: 1;
}
:deep(.eco-pin) {
  background: none;
  border: 0;
  filter: drop-shadow(0 2px 3px rgba(16, 24, 20, 0.3));
}
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
  box-shadow: var(--eco-shadow-lg);
  font-family: var(--bs-body-font-family);
}
:deep(.leaflet-container) { font-family: var(--bs-body-font-family); }
.map-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1rem;
}
</style>

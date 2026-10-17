<!-- src/views/InnovationView.vue -->
<template>
  <div class="container-xxl">
    <header class="page-head">
      <span class="eyebrow">Innovations · BR F.1</span>
      <h1>Extended features</h1>
      <p>Four interactive enhancements that improve the experience, shift scheduling and recycling know-how.</p>
    </header>

    <!-- INNOVATION 4: REAL-TIME OFFLINE / ONLINE DETECTION & LOCAL STORAGE EXTENSION -->
    <div class="card mb-4">
      <div class="card-body d-flex flex-wrap justify-content-between align-items-center gap-3 py-3">
        <div class="d-flex align-items-center gap-3">
          <span class="net-dot" :class="isOnline ? 'is-online' : 'is-offline'" aria-hidden="true"></span>
          <div>
            <span class="innov-num">Innovation 4 · Offline support</span>
            <span class="fw-semibold">{{ isOnline ? 'Online' : 'Offline mode' }}</span>
            <span class="text-muted ms-1">
              · {{ isOnline ? 'Real-time sync active' : 'Local Storage fallback enabled' }}
            </span>
            <div class="small text-muted">
              {{ isOnline ? 'All operations syncing with cloud services.' : 'Changes are cached safely in browser Local Storage until connection returns.' }}
            </div>
          </div>
        </div>
        <div>
          <button
            class="btn btn-sm"
            :class="isOnline ? 'btn-outline-danger' : 'btn-outline-success'"
            @click="toggleSimulatedOffline"
          >
            {{ isOnline ? 'Simulate going offline' : 'Reconnect' }}
          </button>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <!-- INNOVATION 1: INTERACTIVE WASTE DIVERSION DATA CHART -->
      <div class="col-12 col-xl-6">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div>
              <span class="innov-num">Innovation 1</span>
              <h2 class="h6 mb-0">Waste diversion chart</h2>
            </div>
            <span class="badge bg-success">Live</span>
          </div>
          <div class="card-body">
            <p class="small text-muted mb-3">
              Monthly community waste diversion volume (kg) by material category. Hover over bars to view impact.
            </p>

            <!-- Interactive Custom SVG Chart -->
            <div class="chart-container">
              <svg viewBox="0 0 500 240" class="w-100" style="overflow: visible;">
                <!-- Grid Lines -->
                <line x1="50" y1="20" x2="480" y2="20" stroke="#e4e7e3" stroke-dasharray="3,3" />
                <line x1="50" y1="70" x2="480" y2="70" stroke="#e4e7e3" stroke-dasharray="3,3" />
                <line x1="50" y1="120" x2="480" y2="120" stroke="#e4e7e3" stroke-dasharray="3,3" />
                <line x1="50" y1="170" x2="480" y2="170" stroke="#e4e7e3" stroke-dasharray="3,3" />
                <line x1="50" y1="190" x2="480" y2="190" stroke="#d3d8d2" stroke-width="1" />

                <!-- Y-Axis Labels -->
                <text x="40" y="25" font-size="10" text-anchor="end" fill="#5f6b64">2500kg</text>
                <text x="40" y="75" font-size="10" text-anchor="end" fill="#5f6b64">1800kg</text>
                <text x="40" y="125" font-size="10" text-anchor="end" fill="#5f6b64">1200kg</text>
                <text x="40" y="175" font-size="10" text-anchor="end" fill="#5f6b64">600kg</text>

                <!-- Dynamic Data Bars -->
                <g v-for="(item, index) in chartData" :key="index">
                  <rect
                    :x="75 + index * 80"
                    :y="190 - (item.kg / 2500) * 170"
                    width="48"
                    :height="(item.kg / 2500) * 170"
                    :fill="item.color"
                    rx="4"
                    style="cursor: pointer; transition: all 0.3s;"
                    @mouseenter="activeBar = item"
                    @mouseleave="activeBar = null"
                  />
                  <!-- Bar Label -->
                  <text
                    :x="99 + index * 80"
                    y="208"
                    font-size="10"
                    text-anchor="middle"
                    fill="#3b4640"
                    font-weight="600"
                  >
                    {{ item.category }}
                  </text>
                  <!-- Value above bar -->
                  <text
                    :x="99 + index * 80"
                    :y="180 - (item.kg / 2500) * 170"
                    font-size="10"
                    text-anchor="middle"
                    fill="#111a15"
                    font-weight="bold"
                  >
                    {{ item.kg }}
                  </text>
                </g>
              </svg>
            </div>

            <!-- Active Bar Tooltip -->
            <div class="chart-note" v-if="activeBar">
              <strong>{{ activeBar.category }}:</strong> {{ activeBar.kg }} kg diverted | Equivalent to
              <span class="text-success fw-bold">{{ (activeBar.kg * 1.8).toFixed(0) }} kg CO₂e saved</span>!
            </div>
            <div class="chart-note text-muted" v-else>
              Hover over any category bar above to view equivalent CO₂e reduction calculations.
            </div>
          </div>
        </div>
      </div>

      <!-- INNOVATION 2: GENAI CIRCULAR WASTE ASSISTANT -->
      <div class="col-12 col-xl-6">
        <div class="card h-100 d-flex flex-column">
          <div class="card-header">
            <span class="innov-num">Innovation 2</span>
            <h2 class="h6 mb-0">AI recycling assistant</h2>
          </div>
          <div class="card-body d-flex flex-column">
            <p class="small text-muted mb-2">
              Instant AI assistance for tricky household recycling materials and Melbourne council disposal rules.
            </p>
            <div
              class="chat-window mb-3 flex-grow-1"
            >
              <div
                v-for="(msg, idx) in chatHistory"
                :key="idx"
                class="mb-3"
                :class="msg.sender === 'user' ? 'text-end' : 'text-start'"
              >
                <div class="chat-who">
                  {{ msg.sender === 'user' ? 'You' : 'EcoBot' }}
                </div>
                <span
                  class="bubble"
                  :class="msg.sender === 'user' ? 'bubble-user' : 'bubble-bot'"
                >
                  {{ msg.text }}
                </span>
              </div>
            </div>

            <!-- Quick Prompt Suggestions -->
            <div class="d-flex gap-2 mb-2 overflow-auto pb-1">
              <button class="btn btn-sm btn-outline-secondary chip text-nowrap" @click="askPreset('batteries')">Batteries?</button>
              <button class="btn btn-sm btn-outline-secondary chip text-nowrap" @click="askPreset('coffee cups')">Coffee cups?</button>
              <button class="btn btn-sm btn-outline-secondary chip text-nowrap" @click="askPreset('soft plastics')">Soft plastics?</button>
            </div>

            <div class="input-group chat-input">
              <input
                v-model="userQuery"
                type="text"
                class="form-control"
                placeholder="Type item (e.g. polystyrene, light bulbs)..."
                @keyup.enter="handleAiQuery"
              />
              <button class="btn btn-success px-3" @click="handleAiQuery">Ask</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- INNOVATION 3: COLLECTION SHIFT BOOKING WITH CONFLICT DETECTION -->
    <div class="card mt-4">
      <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <span class="innov-num">Innovation 3</span>
          <h2 class="h6 mb-0">Shift booking with conflict detection</h2>
        </div>
        <span class="badge bg-warning">Double-bookings blocked</span>
      </div>
      <div class="card-body p-4">
        <p class="text-muted small">
          Volunteers and community members can reserve drop-off shifts. Overlapping bookings for the same hub and slot are blocked by automated constraints.
        </p>

        <div class="row g-3 mb-4">
          <div class="col-12 col-md-3">
            <label for="bookHub" class="form-label fw-semibold">Drop-off hub</label>
            <select id="bookHub" v-model="newBooking.hub" class="form-select">
              <option>Carlton North Depot</option>
              <option>Melbourne Central Hub</option>
              <option>Brunswick Repair Hub</option>
            </select>
          </div>
          <div class="col-12 col-md-3">
            <label for="shiftDate" class="form-label fw-semibold">Date</label>
            <input id="shiftDate" v-model="newBooking.date" type="date" class="form-control" />
          </div>
          <div class="col-12 col-md-3">
            <label for="shiftSlot" class="form-label fw-semibold">Time slot</label>
            <select id="shiftSlot" v-model="newBooking.slot" class="form-select">
              <option value="09:00 - 11:00">Morning (09:00 - 11:00)</option>
              <option value="12:00 - 14:00">Midday (12:00 - 14:00)</option>
              <option value="15:00 - 17:00">Afternoon (15:00 - 17:00)</option>
            </select>
          </div>
          <div class="col-12 col-md-3 d-flex align-items-end">
            <button class="btn btn-success w-100" @click="handleBooking">
              Confirm booking
            </button>
          </div>
        </div>

        <div v-if="bookingAlert.message" :class="`alert alert-${bookingAlert.type} py-2 mb-4`">
          {{ bookingAlert.message }}
        </div>

        <!-- Interactive Schedule Timetable -->
        <h3 class="h6 mb-3">Upcoming shifts</h3>
        <div class="table-responsive">
          <table class="table table-bordered table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Booking ID</th>
                <th>Hub Location</th>
                <th>Date</th>
                <th>Reserved Time Slot</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in bookings" :key="b.id">
                <td><code>#{{ b.id }}</code></td>
                <td class="fw-semibold">{{ b.hub }}</td>
                <td>{{ b.date }}</td>
                <td><span class="badge bg-secondary">{{ b.slot }}</span></td>
                <td><span class="badge bg-success">Confirmed</span></td>
                <td>
                  <button class="btn btn-sm btn-outline-danger" @click="cancelBooking(b.id)">
                    Cancel
                  </button>
                </td>
              </tr>
              <tr v-if="bookings.length === 0">
                <td colspan="6" class="text-center text-muted py-3">No shifts scheduled yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// -------------------------------------------------------------
// INNOVATION 4: REAL-TIME OFFLINE STATUS & LOCAL STORAGE
// -------------------------------------------------------------
const isOnline = ref(navigator.onLine)
const updateStatus = () => {
  isOnline.value = navigator.onLine
}
const toggleSimulatedOffline = () => {
  isOnline.value = !isOnline.value
}

// -------------------------------------------------------------
// INNOVATION 1: INTERACTIVE CHART DATA
// -------------------------------------------------------------
import { computed } from 'vue'

const activeBar = ref(null)

// Base baseline data + live dynamic submissions from LocalStorage
const chartData = computed(() => {
  // 1. Initial base historical diversion figures
  const categoryTotals = {
    'Plastics': 1200,
    'E-Waste': 850,
    'Organics': 1900,
    'Repair': 400,
    'Textiles': 650
  }

  // 2. Fetch live drop-offs submitted through DropOffForm.vue
  const savedSubmissions = JSON.parse(localStorage.getItem('ecoloop_submissions') || '[]')

  // 3. Add every submitted weight dynamically to its matching category
  savedSubmissions.forEach(entry => {
    const wt = parseFloat(entry.weight) || 0
    if (entry.materialCategory && entry.materialCategory.includes('Plastic')) {
      categoryTotals['Plastics'] += wt
    } else if (entry.materialCategory && entry.materialCategory.includes('E-Waste')) {
      categoryTotals['E-Waste'] += wt
    } else if (entry.materialCategory && (entry.materialCategory.includes('Compost') || entry.materialCategory.includes('Organic'))) {
      categoryTotals['Organics'] += wt
    } else if (entry.materialCategory && entry.materialCategory.includes('Repair')) {
      categoryTotals['Repair'] += wt
    } else {
      categoryTotals['Textiles'] += wt
    }
  })

  // 4. Return reactive data array for SVG rendering
  return [
    { category: 'Plastics', kg: Math.round(categoryTotals['Plastics']), color: '#15803d' },
    { category: 'E-Waste', kg: Math.round(categoryTotals['E-Waste']), color: '#2563eb' },
    { category: 'Organics', kg: Math.round(categoryTotals['Organics']), color: '#d97706' },
    { category: 'Repair', kg: Math.round(categoryTotals['Repair']), color: '#7c3aed' },
    { category: 'Textiles', kg: Math.round(categoryTotals['Textiles']), color: '#0d9488' }
  ]
})

// -------------------------------------------------------------
// INNOVATION 2: GENAI CIRCULAR ASSISTANT
// -------------------------------------------------------------
const userQuery = ref('')
const chatHistory = ref([
  {
    sender: 'bot',
    text: 'Hello! I am your Eco Loop Assistant. Ask me how or where to recycle any specific item across Melbourne.'
  }
])

const askPreset = (term) => {
  userQuery.value = term
  handleAiQuery()
}

const handleAiQuery = () => {
  const query = userQuery.value.trim()
  if (!query) return

  chatHistory.value.push({ sender: 'user', text: query })
  userQuery.value = ''

  setTimeout(() => {
    const q = query.toLowerCase()
    let response = "Bring this item to our Carlton North or Melbourne Central depot for sorting and circular repurposing."

    if (q.includes('battery') || q.includes('phone') || q.includes('laptop') || q.includes('electronic')) {
      response = "⚠️ Never place batteries or e-waste in red or yellow kerbside bins due to fire hazards! Take them to our Melbourne Central or South Yarra E-Waste drop-off points."
    } else if (q.includes('coffee') || q.includes('cup')) {
      response = "Disposable coffee cups usually contain a waterproof polyethylene lining. Recycle them via dedicated Simply Cups stations or compost certified cups at our Fitzroy hub."
    } else if (q.includes('soft plastic') || q.includes('bag') || q.includes('wrapper') || q.includes('packet')) {
      response = "Clean soft plastics that can be scrunched into a ball should be dropped off at the Carlton North Soft Plastics depot."
    } else if (q.includes('food') || q.includes('compost') || q.includes('scrap')) {
      response = "Organic waste can be dropped at the Fitzroy Compost Collective or Coburg Organic Depot to enrich Melbourne community gardens."
    }

    chatHistory.value.push({ sender: 'bot', text: response })
  }, 350)
}

// -------------------------------------------------------------
// INNOVATION 3: CALENDAR BOOKING WITH CONFLICT CONSTRAINTS
// -------------------------------------------------------------
const BOOKINGS_KEY = 'ecoloop_shift_bookings'
const newBooking = ref({
  hub: 'Carlton North Depot',
  date: new Date().toISOString().slice(0, 10),
  slot: '09:00 - 11:00'
})

const bookingAlert = ref({ message: '', type: '' })
const bookings = ref([])

onMounted(() => {
  window.addEventListener('online', updateStatus)
  window.addEventListener('offline', updateStatus)

  const saved = localStorage.getItem(BOOKINGS_KEY)
  if (saved) {
    bookings.value = JSON.parse(saved)
  } else {
    // Seed initial booking to demonstrate conflict constraint
    bookings.value = [
      {
        id: 101,
        hub: 'Carlton North Depot',
        date: new Date().toISOString().slice(0, 10),
        slot: '09:00 - 11:00'
      }
    ]
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings.value))
  }
})

onUnmounted(() => {
  window.removeEventListener('online', updateStatus)
  window.removeEventListener('offline', updateStatus)
})

const handleBooking = () => {
  bookingAlert.value = { message: '', type: '' }
  const { hub, date, slot } = newBooking.value

  // Conflict Constraint Management: Disallow duplicate bookings for the same hub, date, and slot
  const isConflict = bookings.value.some(
    (b) => b.hub === hub && b.date === date && b.slot === slot
  )

  if (isConflict) {
    bookingAlert.value = {
      message: `🚫 Booking Conflict Constraint: The "${slot}" shift at ${hub} on ${date} is already reserved. Please select another slot or location.`,
      type: 'danger'
    }
    return
  }

  const created = {
    id: Math.floor(100 + Math.random() * 900),
    hub,
    date,
    slot
  }

  bookings.value.push(created)
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings.value))

  bookingAlert.value = {
    message: `✅ Shift confirmed for ${hub} on ${date} (${slot}). Stored in operational roster.`,
    type: 'success'
  }
}

const cancelBooking = (id) => {
  bookings.value = bookings.value.filter((b) => b.id !== id)
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings.value))
}
</script>

<style scoped>
.chart-container {
  padding: 0.75rem;
  border: 1px solid var(--eco-line);
  border-radius: 12px;
  background: var(--eco-surface);
}
.chart-container svg text { font-family: inherit; }
.chart-container svg rect:hover { opacity: 0.85; }
.chart-note {
  margin-top: 0.75rem;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  background: var(--eco-surface-2);
  font-size: 0.85rem;
  text-align: center;
}
.innov-num {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--eco-green);
  margin-bottom: 0.15rem;
}
.net-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.net-dot.is-online { background: #16a34a; box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.15); }
.net-dot.is-offline { background: var(--eco-red); box-shadow: 0 0 0 4px rgba(180, 35, 24, 0.15); }

.chat-window {
  border: 1px solid var(--eco-line);
  border-radius: 12px;
  background: var(--eco-surface-2);
  padding: 1rem;
  overflow-y: auto;
  min-height: 220px;
  max-height: 280px;
}
.chat-who { font-size: 0.72rem; font-weight: 600; color: var(--eco-muted); margin-bottom: 0.25rem; }
.bubble {
  display: inline-block;
  max-width: 85%;
  padding: 0.6rem 0.85rem;
  border-radius: 14px;
  font-size: 0.9rem;
  line-height: 1.45;
  text-align: left;
}
.bubble-user { background: var(--eco-green); color: #fff; border-bottom-right-radius: 4px; }
.bubble-bot { background: var(--eco-surface); color: var(--eco-ink); border: 1px solid var(--eco-line); border-bottom-left-radius: 4px; }
.chip { border-radius: 999px; }
.chat-input .form-control { border-top-right-radius: 0; border-bottom-right-radius: 0; }
</style>

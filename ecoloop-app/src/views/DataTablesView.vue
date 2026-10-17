<!-- src/views/DataTablesView.vue -->
<template>
  <div class="container-xxl">
    <header class="page-head">
      <span class="eyebrow">Operations data</span>
      <h1>Hubs &amp; volunteer roster</h1>
      <p>Click a column heading to sort, search each column on its own, and page through 10 rows at a time.</p>
    </header>

    <!-- TABLE 1: RECYCLING HUBS -->
    <div class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h2 class="h5 mb-0">Recycling &amp; drop-off hubs</h2>
        <span class="badge bg-light">10 rows / page</span>
      </div>
      <div class="card-body">

        <!-- Individual Column Search Inputs -->
        <div class="row g-2 mb-3">
          <div class="col-12 col-md-4">
            <input
              v-model="hubsFilter.name"
              type="text"
              class="form-control form-control-sm col-search"
              placeholder="Hub name"
            />
          </div>
          <div class="col-12 col-md-4">
            <input
              v-model="hubsFilter.suburb"
              type="text"
              class="form-control form-control-sm col-search"
              placeholder="Suburb"
            />
          </div>
          <div class="col-12 col-md-4">
            <input
              v-model="hubsFilter.category"
              type="text"
              class="form-control form-control-sm col-search"
              placeholder="Category"
            />
          </div>
        </div>

        <!-- Interactive Table -->
        <div class="table-responsive">
          <table class="table table-hover table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th @click="sortHubs('name')" class="sortable">
                  Hub Name <span v-if="hubsSortKey === 'name'">{{ hubsSortOrder === 1 ? '▲' : '▼' }}</span>
                </th>
                <th @click="sortHubs('suburb')" class="sortable">
                  Suburb <span v-if="hubsSortKey === 'suburb'">{{ hubsSortOrder === 1 ? '▲' : '▼' }}</span>
                </th>
                <th @click="sortHubs('category')" class="sortable">
                  Category <span v-if="hubsSortKey === 'category'">{{ hubsSortOrder === 1 ? '▲' : '▼' }}</span>
                </th>
                <th @click="sortHubs('capacityKg')" class="sortable">
                  Capacity (kg) <span v-if="hubsSortKey === 'capacityKg'">{{ hubsSortOrder === 1 ? '▲' : '▼' }}</span>
                </th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="hub in paginatedHubs" :key="hub.id">
                <td class="fw-semibold">{{ hub.name }}</td>
                <td>{{ hub.suburb }}</td>
                <td><span class="badge bg-secondary">{{ hub.category }}</span></td>
                <td>{{ hub.capacityKg }} kg</td>
                <td>
                  <span :class="hub.status === 'Open' ? 'badge bg-success' : 'badge bg-warning text-dark'">
                    {{ hub.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="paginatedHubs.length === 0">
                <td colspan="5" class="text-center text-muted py-3">No matching hubs found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div class="d-flex justify-content-between align-items-center mt-3">
          <small class="text-muted">
            Showing {{ hubsStartIndex + 1 }} to {{ Math.min(hubsStartIndex + 10, filteredHubs.length) }} of {{ filteredHubs.length }} records
          </small>
          <div class="btn-group">
            <button
              class="btn btn-outline-secondary btn-sm"
              :disabled="hubsCurrentPage === 1"
              @click="hubsCurrentPage--"
            >
              Previous
            </button>
            <button class="btn btn-outline-secondary btn-sm disabled page-indicator">
              Page {{ hubsCurrentPage }} of {{ totalHubPages || 1 }}
            </button>
            <button
              class="btn btn-outline-secondary btn-sm"
              :disabled="hubsCurrentPage >= totalHubPages"
              @click="hubsCurrentPage++"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE 2: VOLUNTEER & OPERATIONS ROSTER -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h2 class="h5 mb-0">Volunteer roster</h2>
        <span class="badge bg-light">10 rows / page</span>
      </div>
      <div class="card-body">

        <!-- Individual Column Search Inputs -->
        <div class="row g-2 mb-3">
          <div class="col-12 col-md-4">
            <input
              v-model="volFilter.fullName"
              type="text"
              class="form-control form-control-sm col-search"
              placeholder="Name"
            />
          </div>
          <div class="col-12 col-md-4">
            <input
              v-model="volFilter.role"
              type="text"
              class="form-control form-control-sm col-search"
              placeholder="Role"
            />
          </div>
          <div class="col-12 col-md-4">
            <input
              v-model="volFilter.shiftDay"
              type="text"
              class="form-control form-control-sm col-search"
              placeholder="Shift day"
            />
          </div>
        </div>

        <!-- Interactive Table -->
        <div class="table-responsive">
          <table class="table table-hover table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th @click="sortVol('fullName')" class="sortable">
                  Volunteer Name <span v-if="volSortKey === 'fullName'">{{ volSortOrder === 1 ? '▲' : '▼' }}</span>
                </th>
                <th @click="sortVol('role')" class="sortable">
                  Operational Role <span v-if="volSortKey === 'role'">{{ volSortOrder === 1 ? '▲' : '▼' }}</span>
                </th>
                <th @click="sortVol('shiftDay')" class="sortable">
                  Shift Day <span v-if="volSortKey === 'shiftDay'">{{ volSortOrder === 1 ? '▲' : '▼' }}</span>
                </th>
                <th @click="sortVol('hours')" class="sortable">
                  Weekly Hours <span v-if="volSortKey === 'hours'">{{ volSortOrder === 1 ? '▲' : '▼' }}</span>
                </th>
                <th>Suburb</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="vol in paginatedVol" :key="vol.id">
                <td class="fw-semibold">{{ vol.fullName }}</td>
                <td><span class="badge bg-primary">{{ vol.role }}</span></td>
                <td>{{ vol.shiftDay }}</td>
                <td>{{ vol.hours }} hrs</td>
                <td>{{ vol.suburb }}</td>
              </tr>
              <tr v-if="paginatedVol.length === 0">
                <td colspan="5" class="text-center text-muted py-3">No matching roster records found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div class="d-flex justify-content-between align-items-center mt-3">
          <small class="text-muted">
            Showing {{ volStartIndex + 1 }} to {{ Math.min(volStartIndex + 10, filteredVol.length) }} of {{ filteredVol.length }} records
          </small>
          <div class="btn-group">
            <button
              class="btn btn-outline-secondary btn-sm"
              :disabled="volCurrentPage === 1"
              @click="volCurrentPage--"
            >
              Previous
            </button>
            <button class="btn btn-outline-secondary btn-sm disabled page-indicator">
              Page {{ volCurrentPage }} of {{ totalVolPages || 1 }}
            </button>
            <button
              class="btn btn-outline-secondary btn-sm"
              :disabled="volCurrentPage >= totalVolPages"
              @click="volCurrentPage++"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import tableRawData from '../assets/json/tableData.json'

// Table 1 State: Hubs
const hubs = ref(tableRawData.hubs)
const hubsFilter = ref({ name: '', suburb: '', category: '' })
const hubsSortKey = ref('name')
const hubsSortOrder = ref(1) // 1: asc, -1: desc
const hubsCurrentPage = ref(1)
const PAGE_SIZE = 10

const sortHubs = (key) => {
  if (hubsSortKey.value === key) {
    hubsSortOrder.value *= -1
  } else {
    hubsSortKey.value = key
    hubsSortOrder.value = 1
  }
}

const filteredHubs = computed(() => {
  return hubs.value
    .filter((h) => {
      const matchName = h.name.toLowerCase().includes(hubsFilter.value.name.toLowerCase())
      const matchSuburb = h.suburb.toLowerCase().includes(hubsFilter.value.suburb.toLowerCase())
      const matchCategory = h.category.toLowerCase().includes(hubsFilter.value.category.toLowerCase())
      return matchName && matchSuburb && matchCategory
    })
    .sort((a, b) => {
      if (a[hubsSortKey.value] < b[hubsSortKey.value]) return -1 * hubsSortOrder.value
      if (a[hubsSortKey.value] > b[hubsSortKey.value]) return 1 * hubsSortOrder.value
      return 0
    })
})

const totalHubPages = computed(() => Math.ceil(filteredHubs.value.length / PAGE_SIZE))
const hubsStartIndex = computed(() => (hubsCurrentPage.value - 1) * PAGE_SIZE)
const paginatedHubs = computed(() => {
  return filteredHubs.value.slice(hubsStartIndex.value, hubsStartIndex.value + PAGE_SIZE)
})

// Table 2 State: Volunteers
const volunteers = ref(tableRawData.volunteers)
const volFilter = ref({ fullName: '', role: '', shiftDay: '' })
const volSortKey = ref('fullName')
const volSortOrder = ref(1)
const volCurrentPage = ref(1)

const sortVol = (key) => {
  if (volSortKey.value === key) {
    volSortOrder.value *= -1
  } else {
    volSortKey.value = key
    volSortOrder.value = 1
  }
}

const filteredVol = computed(() => {
  return volunteers.value
    .filter((v) => {
      const matchName = v.fullName.toLowerCase().includes(volFilter.value.fullName.toLowerCase())
      const matchRole = v.role.toLowerCase().includes(volFilter.value.role.toLowerCase())
      const matchDay = v.shiftDay.toLowerCase().includes(volFilter.value.shiftDay.toLowerCase())
      return matchName && matchRole && matchDay
    })
    .sort((a, b) => {
      if (a[volSortKey.value] < b[volSortKey.value]) return -1 * volSortOrder.value
      if (a[volSortKey.value] > b[volSortKey.value]) return 1 * volSortOrder.value
      return 0
    })
})

const totalVolPages = computed(() => Math.ceil(filteredVol.value.length / PAGE_SIZE))
const volStartIndex = computed(() => (volCurrentPage.value - 1) * PAGE_SIZE)
const paginatedVol = computed(() => {
  return filteredVol.value.slice(volStartIndex.value, volStartIndex.value + PAGE_SIZE)
})
</script>

<style scoped>
.sortable { cursor: pointer; user-select: none; }
.sortable:hover { color: var(--eco-ink) !important; }
.col-search { padding-left: 2.1rem; background: var(--eco-surface) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235f6b64' stroke-width='2' stroke-linecap='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='m20 20-3.5-3.5'/%3E%3C/svg%3E") no-repeat 0.7rem center / 15px; }
.page-indicator { opacity: 1 !important; color: var(--eco-ink-2) !important; }
</style>

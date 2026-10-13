<!-- src/views/DataTablesView.vue -->
<template>
  <div class="container my-5">
    <div class="mb-4">
      <h1 class="h3 fw-bold text-success">📊 Eco Loop Operations Data Tables</h1>
      <p class="text-muted">
        Interactive tables supporting multi-column sorting, independent column search, and 10 rows per page pagination.
      </p>
    </div>

    <!-- TABLE 1: RECYCLING HUBS -->
    <div class="card shadow-sm border-0 mb-5">
      <div class="card-header bg-success text-white d-flex justify-content-between align-items-center py-3">
        <h2 class="h5 mb-0">Table 1: Verified Recycling & Drop-Off Hubs</h2>
        <span class="badge bg-light text-success fw-bold">10 Rows / Page</span>
      </div>
      <div class="card-body">

        <!-- Individual Column Search Inputs -->
        <div class="row g-2 mb-3">
          <div class="col-12 col-md-4">
            <input
              v-model="hubsFilter.name"
              type="text"
              class="form-control form-control-sm"
              placeholder="Search by Hub Name..."
            />
          </div>
          <div class="col-12 col-md-4">
            <input
              v-model="hubsFilter.suburb"
              type="text"
              class="form-control form-control-sm"
              placeholder="Search by Suburb..."
            />
          </div>
          <div class="col-12 col-md-4">
            <input
              v-model="hubsFilter.category"
              type="text"
              class="form-control form-control-sm"
              placeholder="Search by Category..."
            />
          </div>
        </div>

        <!-- Interactive Table -->
        <div class="table-responsive">
          <table class="table table-hover table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th @click="sortHubs('name')" style="cursor: pointer;">
                  Hub Name <span v-if="hubsSortKey === 'name'">{{ hubsSortOrder === 1 ? '▲' : '▼' }}</span>
                </th>
                <th @click="sortHubs('suburb')" style="cursor: pointer;">
                  Suburb <span v-if="hubsSortKey === 'suburb'">{{ hubsSortOrder === 1 ? '▲' : '▼' }}</span>
                </th>
                <th @click="sortHubs('category')" style="cursor: pointer;">
                  Category <span v-if="hubsSortKey === 'category'">{{ hubsSortOrder === 1 ? '▲' : '▼' }}</span>
                </th>
                <th @click="sortHubs('capacityKg')" style="cursor: pointer;">
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
              class="btn btn-outline-success btn-sm"
              :disabled="hubsCurrentPage === 1"
              @click="hubsCurrentPage--"
            >
              Previous
            </button>
            <button class="btn btn-success btn-sm disabled text-white">
              Page {{ hubsCurrentPage }} of {{ totalHubPages || 1 }}
            </button>
            <button
              class="btn btn-outline-success btn-sm"
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
    <div class="card shadow-sm border-0">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
        <h2 class="h5 mb-0">Table 2: Community Operations & Volunteer Roster</h2>
        <span class="badge bg-light text-primary fw-bold">10 Rows / Page</span>
      </div>
      <div class="card-body">

        <!-- Individual Column Search Inputs -->
        <div class="row g-2 mb-3">
          <div class="col-12 col-md-4">
            <input
              v-model="volFilter.fullName"
              type="text"
              class="form-control form-control-sm"
              placeholder="Search by Name..."
            />
          </div>
          <div class="col-12 col-md-4">
            <input
              v-model="volFilter.role"
              type="text"
              class="form-control form-control-sm"
              placeholder="Search by Role..."
            />
          </div>
          <div class="col-12 col-md-4">
            <input
              v-model="volFilter.shiftDay"
              type="text"
              class="form-control form-control-sm"
              placeholder="Search by Shift Day..."
            />
          </div>
        </div>

        <!-- Interactive Table -->
        <div class="table-responsive">
          <table class="table table-hover table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th @click="sortVol('fullName')" style="cursor: pointer;">
                  Volunteer Name <span v-if="volSortKey === 'fullName'">{{ volSortOrder === 1 ? '▲' : '▼' }}</span>
                </th>
                <th @click="sortVol('role')" style="cursor: pointer;">
                  Operational Role <span v-if="volSortKey === 'role'">{{ volSortOrder === 1 ? '▲' : '▼' }}</span>
                </th>
                <th @click="sortVol('shiftDay')" style="cursor: pointer;">
                  Shift Day <span v-if="volSortKey === 'shiftDay'">{{ volSortOrder === 1 ? '▲' : '▼' }}</span>
                </th>
                <th @click="sortVol('hours')" style="cursor: pointer;">
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
              class="btn btn-outline-primary btn-sm"
              :disabled="volCurrentPage === 1"
              @click="volCurrentPage--"
            >
              Previous
            </button>
            <button class="btn btn-primary btn-sm disabled text-white">
              Page {{ volCurrentPage }} of {{ totalVolPages || 1 }}
            </button>
            <button
              class="btn btn-outline-primary btn-sm"
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

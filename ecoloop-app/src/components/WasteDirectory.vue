<template>
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header bg-primary text-white">
      <h2 class="h5 mb-0">🔍 Search A-Z Waste & Recycling Directory</h2>
    </div>
    <div class="card-body">
      <!-- Search n Filter my Controls -->
      <div class="row g-3 mb-3">
        <div class="col-12 col-md-8">
          <label for="searchQuery" class="form-label fw-semibold">Search Waste Item</label>
          <input
            id="searchQuery"
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Type an item (e.g., batteries, plastics)..."
            aria-label="Search Waste Item"
          />
        </div>
        <div class="col-12 col-md-4">
          <label for="categoryFilter" class="form-label fw-semibold">Filter by Category</label>
          <select id="categoryFilter" v-model="selectedCategory" class="form-select" aria-label="Filter by Category">
            <option value="ALL">All Categories</option>
            <option value="Plastics">Plastics</option>
            <option value="E-Waste">E-Waste</option>
            <option value="Organics">Organics</option>
            <option value="Repair">Repair</option>
          </select>
        </div>
      </div>

      <!-- Live Summary Metrics bro -->
      <div class="alert alert-info py-2">
        Showing <strong>{{ filteredItems.length }}</strong> item(s). Total estimated impact:
        <strong>{{ totalCarbonSaving.toFixed(1) }} kg CO₂e saved</strong> per drop-off.
      </div>

      <!-- alive Grid for Directory stuff -->
      <div class="row g-3">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="col-12 col-sm-6 col-lg-4 col-xxl-3"
        >
          <div class="card h-100 border" :class="{ 'border-success': item.accepted, 'border-warning': !item.accepted }">
            <div class="card-body">
              <span class="badge bg-secondary mb-2">{{ item.category }}</span>
              <h3 class="h6 card-title fw-bold">{{ item.name }}</h3>
              <p class="card-text text-muted small mb-1">
                📍 <strong>Location:</strong> {{ item.dropOffLocation }}
              </p>
              <p class="card-text small">
                🌱 <strong>Est. Carbon Saving:</strong> {{ item.carbonSavingKg }} kg
              </p>
            </div>
            <div class="card-footer bg-transparent border-0 pt-0">
              <span v-if="item.accepted" class="badge bg-success-subtle text-success border border-success">
                Drop-off Active
              </span>
              <span v-else class="badge bg-danger-subtle text-danger border border-danger">
                Special Handling Required
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import rawWasteData from '../assets/json/wasteData.json'

const items = ref(rawWasteData)
const searchQuery = ref('')
const selectedCategory = ref('ALL')

// some sorta filtering for Search
const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'ALL' || item.category === selectedCategory.value
    return matchesQuery && matchesCategory
  })
})

// Computed calculation for total impact
const totalCarbonSaving = computed(() => {
  return filteredItems.value.reduce((total, item) => total + item.carbonSavingKg, 0)
})
</script>

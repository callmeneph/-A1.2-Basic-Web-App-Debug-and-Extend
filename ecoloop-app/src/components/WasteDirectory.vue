<template>
  <div class="card mb-4">
    <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
      <div>
        <h2 class="h5 mb-1">A–Z waste &amp; recycling directory</h2>
        <p class="section-sub mb-0">Search any item to see where it goes and what it saves.</p>
      </div>
      <span class="result-count">
        <strong>{{ filteredItems.length }}</strong> item(s) ·
        <strong>{{ totalCarbonSaving.toFixed(1) }} kg</strong> CO₂e per drop-off
      </span>
    </div>
    <div class="card-body">
      <!-- Search n Filter my Controls -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-md-8">
          <label for="searchQuery" class="form-label fw-semibold">Search waste item</label>
          <div class="search-wrap">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <input
              id="searchQuery"
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Try batteries, soft plastics, coffee grounds..."
              aria-label="Search Waste Item"
            />
          </div>
        </div>
        <div class="col-12 col-md-4">
          <label for="categoryFilter" class="form-label fw-semibold">Category</label>
          <select id="categoryFilter" v-model="selectedCategory" class="form-select" aria-label="Filter by Category">
            <option value="ALL">All categories</option>
            <option value="Plastics">Plastics</option>
            <option value="E-Waste">E-Waste</option>
            <option value="Organics">Organics</option>
            <option value="Repair">Repair</option>
          </select>
        </div>
      </div>

      <!-- Live Summary Metrics (screen readers) -->
      <p class="visually-hidden" aria-live="polite">
        Showing {{ filteredItems.length }} item(s). Total estimated impact:
        {{ totalCarbonSaving.toFixed(1) }} kg CO₂e saved per drop-off.
      </p>

      <!-- Directory grid -->
      <div class="row g-3">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="col-12 col-sm-6 col-lg-4 col-xxl-3"
        >
          <article class="item-card">
            <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
              <span class="badge bg-secondary">{{ item.category }}</span>
              <span class="status" :class="item.accepted ? 'status-ok' : 'status-warn'">
                <span class="status-dot" aria-hidden="true"></span>
                {{ item.accepted ? 'Drop-off active' : 'Special handling' }}
              </span>
            </div>
            <h3 class="item-name">{{ item.name }}</h3>
            <dl class="item-meta">
              <div>
                <dt>Drop-off</dt>
                <dd>{{ item.dropOffLocation }}</dd>
              </div>
              <div>
                <dt>Est. carbon saving</dt>
                <dd class="saving">{{ item.carbonSavingKg }} kg CO₂e</dd>
              </div>
            </dl>
          </article>
        </div>
        <div v-if="filteredItems.length === 0" class="col-12">
          <div class="empty-state">No items match your search. Try a different word or category.</div>
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

<style scoped>
.section-sub { color: var(--eco-muted); font-size: 0.9rem; }
.result-count {
  font-size: 0.85rem;
  color: var(--eco-muted);
  background: var(--eco-surface-2);
  border: 1px solid var(--eco-line);
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
}
.result-count strong { color: var(--eco-ink); font-weight: 600; }

.search-wrap { position: relative; }
.search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  width: 18px;
  height: 18px;
  transform: translateY(-50%);
  color: var(--eco-muted);
  pointer-events: none;
}
.search-wrap .form-control { padding-left: 2.5rem; }

.item-card {
  height: 100%;
  padding: 1.15rem;
  border: 1px solid var(--eco-line);
  border-radius: 12px;
  background: var(--eco-surface);
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}
.item-card:hover {
  border-color: var(--eco-line-strong);
  box-shadow: var(--eco-shadow-lg);
  transform: translateY(-2px);
}
.item-name { font-size: 1rem; font-weight: 600; line-height: 1.35; margin-bottom: 0.9rem; }

.item-meta { margin: 0; display: grid; gap: 0.6rem; }
.item-meta dt { font-size: 0.75rem; font-weight: 500; color: var(--eco-muted); }
.item-meta dd { margin: 0; font-size: 0.9rem; color: var(--eco-ink-2); }
.item-meta .saving { color: var(--eco-green); font-weight: 600; }

.status { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; font-weight: 550; white-space: nowrap; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.status-ok { color: var(--eco-green); }
.status-warn { color: var(--eco-amber); }

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--eco-muted);
  border: 1px dashed var(--eco-line-strong);
  border-radius: 12px;
}
</style>

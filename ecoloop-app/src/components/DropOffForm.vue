<template>
  <div class="card shadow-sm border-0 mb-5">
    <div class="card-header bg-success text-white">
      <h2 class="h5 mb-0">📝 Register Community Drop-off / Member Log</h2>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit" novalidate>

        <!-- Breakpoint Row 1: Name & Email -->
        <div class="row g-3 mb-3">
          <div class="col-12 col-sm-6 col-lg-6">
            <label for="fullName" class="form-label fw-semibold">Full Name *</label>
            <input
              id="fullName"
              v-model.trim="formData.fullName"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.fullName }"
              @blur="() => validateFullName(true)"
              @input="() => validateFullName(false)"
              placeholder="e.g. Liam Smith"
            />
            <div v-if="errors.fullName" class="invalid-feedback">{{ errors.fullName }}</div>
          </div>

          <div class="col-12 col-sm-6 col-lg-6">
            <label for="email" class="form-label fw-semibold">Email Address *</label>
            <input
              id="email"
              v-model.trim="formData.email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors.email }"
              @blur="() => validateEmail(true)"
              @input="() => validateEmail(false)"
              placeholder="liam@student.monash.edu"
            />
            <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
          </div>
        </div>

        <!-- Breakpoint Row 2: Postcode & Estimated Weight -->
        <div class="row g-3 mb-3">
          <div class="col-12 col-sm-6 col-md-4">
            <label for="postcode" class="form-label fw-semibold">Melbourne Postcode (3000-3999) *</label>
            <input
              id="postcode"
              v-model.trim="formData.postcode"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.postcode }"
              @blur="() => validatePostcode(true)"
              @input="() => validatePostcode(false)"
              placeholder="3000"
            />
            <div v-if="errors.postcode" class="invalid-feedback">{{ errors.postcode }}</div>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <label for="weight" class="form-label fw-semibold">Estimated Weight (0.1 - 50 kg) *</label>
            <input
              id="weight"
              v-model.number="formData.weight"
              type="number"
              step="0.1"
              class="form-control"
              :class="{ 'is-invalid': errors.weight }"
              @blur="() => validateWeight(true)"
              placeholder="1.5"
            />
            <div v-if="errors.weight" class="invalid-feedback">{{ errors.weight }}</div>
          </div>

          <div class="col-12 col-md-4">
            <label for="itemCategory" class="form-label fw-semibold">Material Type *</label>
            <select
              id="itemCategory"
              v-model="formData.materialCategory"
              class="form-select"
              :class="{ 'is-invalid': errors.materialCategory }"
              @blur="() => validateCategory(true)"
            >
              <option value="">Select Category...</option>
              <option value="Soft Plastics">Soft Plastics</option>
              <option value="E-Waste">E-Waste</option>
              <option value="Compost / Organic">Compost / Organic</option>
              <option value="Household Repair">Household Repair</option>
            </select>
            <div v-if="errors.materialCategory" class="invalid-feedback">{{ errors.materialCategory }}</div>
          </div>
        </div>

        <!-- Breakpoint Row 3: Notes & Validation check -->
        <div class="mb-3">
          <label for="notes" class="form-label fw-semibold">Drop-off Notes (Min 10 characters) *</label>
          <textarea
            id="notes"
            v-model.trim="formData.notes"
            class="form-control"
            :class="{ 'is-invalid': errors.notes }"
            rows="3"
            @blur="() => validateNotes(true)"
            placeholder="Describe the items you are recycling or dropping off..."
          ></textarea>
          <div v-if="errors.notes" class="invalid-feedback">{{ errors.notes }}</div>
          <small v-if="formData.notes.toLowerCase().includes('volunteer')" class="text-success fw-bold d-block mt-1">
            🌟 Thank you for offering volunteer support!
          </small>
        </div>

        <!-- Terms Agreement Checkbox -->
        <div class="form-check mb-4">
          <input
            id="terms"
            v-model="formData.agreed"
            type="checkbox"
            class="form-check-input"
            :class="{ 'is-invalid': errors.agreed }"
          />
          <label for="terms" class="form-check-label">
            I confirm these items are clean and free of prohibited hazardous chemicals.
          </label>
          <div v-if="errors.agreed" class="invalid-feedback">{{ errors.agreed }}</div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-success px-4 fw-bold">Submit Record</button>
          <button type="button" class="btn btn-outline-secondary" @click="resetForm">Clear Form</button>
        </div>
      </form>

      <!-- Submitted Records Display (Local Storage Synced) -->
      <hr class="my-4" />
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="h6 fw-bold mb-0">📦 Submitted Community Drop-Offs (Stored in LocalStorage)</h3>
        <button v-if="records.length" class="btn btn-sm btn-outline-danger" @click="clearAllRecords">
          Clear Saved Data
        </button>
      </div>

      <div v-if="records.length === 0" class="text-muted small">
        No records submitted yet. Fill out the form above to persist data.
      </div>

      <div class="row g-3">
        <div
          v-for="(rec, idx) in records"
          :key="idx"
          class="col-12 col-sm-6 col-lg-4"
        >
          <div class="card h-100 bg-light border-0 shadow-sm">
            <div class="card-body">
              <h4 class="card-title h6 fw-bold text-success">{{ rec.fullName }}</h4>
              <p class="card-text small mb-1"><strong>Email:</strong> {{ rec.email }}</p>
              <p class="card-text small mb-1"><strong>Postcode:</strong> {{ rec.postcode }}</p>
              <p class="card-text small mb-1"><strong>Material:</strong> {{ rec.materialCategory }} ({{ rec.weight }} kg)</p>
              <p class="card-text small text-muted"><strong>Notes:</strong> {{ rec.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const formData = ref({
  fullName: '',
  email: '',
  postcode: '',
  weight: '',
  materialCategory: '',
  notes: '',
  agreed: false
})

const errors = ref({
  fullName: null,
  email: null,
  postcode: null,
  weight: null,
  materialCategory: null,
  notes: null,
  agreed: null
})

const records = ref([])

// Load Local Storage on startup
onMounted(() => {
  const saved = localStorage.getItem('ecoloop_submissions')
  if (saved) {
    try {
      records.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse saved records', e)
    }
  }
})

// Validation Methods
const validateFullName = (showError) => {
  if (!formData.value.fullName || formData.value.fullName.length < 3) {
    if (showError) errors.value.fullName = 'Full Name must be at least 3 characters.'
    return false
  }
  errors.value.fullName = null
  return true
}

const validateEmail = (showError) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email)) {
    if (showError) errors.value.email = 'Please provide a valid email address.'
    return false
  }
  errors.value.email = null
  return true
}

const validatePostcode = (showError) => {
  const vicPostcodeRegex = /^3\d{3}$/
  if (!vicPostcodeRegex.test(formData.value.postcode)) {
    if (showError) errors.value.postcode = 'Must be a 4-digit Victorian postcode (starts with 3).'
    return false
  }
  errors.value.postcode = null
  return true
}

const validateWeight = (showError) => {
  const wt = parseFloat(formData.value.weight)
  if (isNaN(wt) || wt < 0.1 || wt > 50) {
    if (showError) errors.value.weight = 'Weight must be between 0.1 and 50 kg.'
    return false
  }
  errors.value.weight = null
  return true
}

const validateCategory = (showError) => {
  if (!formData.value.materialCategory) {
    if (showError) errors.value.materialCategory = 'Please select a material type.'
    return false
  }
  errors.value.materialCategory = null
  return true
}

const validateNotes = (showError) => {
  if (!formData.value.notes || formData.value.notes.length < 10) {
    if (showError) errors.value.notes = 'Notes must contain at least 10 characters.'
    return false
  }
  errors.value.notes = null
  return true
}

const validateAgreement = (showError) => {
  if (!formData.value.agreed) {
    if (showError) errors.value.agreed = 'You must confirm the items meet safety guidelines.'
    return false
  }
  errors.value.agreed = null
  return true
}

// Form Submission & Local Storage Persistence
const handleSubmit = () => {
  const v1 = validateFullName(true)
  const v2 = validateEmail(true)
  const v3 = validatePostcode(true)
  const v4 = validateWeight(true)
  const v5 = validateCategory(true)
  const v6 = validateNotes(true)
  const v7 = validateAgreement(true)

  if (v1 && v2 && v3 && v4 && v5 && v6 && v7) {
    records.value.push({ ...formData.value })
    localStorage.setItem('ecoloop_submissions', JSON.stringify(records.value))
    resetForm()
  }
}

const resetForm = () => {
  formData.value = {
    fullName: '',
    email: '',
    postcode: '',
    weight: '',
    materialCategory: '',
    notes: '',
    agreed: false
  }
  Object.keys(errors.value).forEach((key) => {
    errors.value[key] = null
  })
}

const clearAllRecords = () => {
  records.value = []
  localStorage.removeItem('ecoloop_submissions')
}
</script>

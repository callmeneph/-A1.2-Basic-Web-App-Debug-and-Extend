<template>
  <div class="container my-5">
    <div class="row">
      <!-- Left Column: Form for submitting reviews -->
      <div class="col-12 col-lg-5 mb-4">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-success text-white">
            <h2 class="h5 mb-0">⭐ Rate a Recycling Drop-off Hub</h2>
          </div>
          <div class="card-body">
            <div v-if="alertMessage" class="alert alert-warning py-2">{{ alertMessage }}</div>

            <form @submit.prevent="submitReview">
              <div class="mb-3">
                <label for="hubSelect" class="form-label fw-semibold">Select Drop-Off Hub</label>
                <select id="hubSelect" v-model="newReview.hubName" class="form-select">
                  <option>Carlton Soft Plastics Depot</option>
                  <option>Melbourne Central E-Waste Hub</option>
                  <option>Inner-North Organic Compost</option>
                  <option>Brunswick Repair Café</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="ratingScore" class="form-label fw-semibold">Rating (1 to 5 Stars)</label>
                <select id="ratingScore" v-model.number="newReview.rating" class="form-select">
                  <option :value="5">⭐⭐⭐⭐⭐ (5 - Outstanding)</option>
                  <option :value="4">⭐⭐⭐⭐ (4 - Good)</option>
                  <option :value="3">⭐⭐⭐ (3 - Average)</option>
                  <option :value="2">⭐⭐ (2 - Needs Improvement)</option>
                  <option :value="1">⭐ (1 - Poor)</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="comment" class="form-label fw-semibold">Your Review / Comments</label>
                <textarea
                  id="comment"
                  v-model.trim="newReview.comment"
                  rows="3"
                  class="form-control"
                  placeholder="Share your experience (test XSS like <script>alert(1)</script> to verify sanitization)..."
                  required
                ></textarea>
              </div>

              <button type="submit" class="btn btn-success fw-bold w-100">Submit Review</button>
            </form>
          </div>
        </div>
      </div>

      <!-- Right Column: Aggregated Rating Score & Verified Reviews -->
      <div class="col-12 col-lg-7">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body text-center p-4 bg-light rounded">
            <h3 class="h6 text-muted text-uppercase mb-1">Community Aggregated Score</h3>
            <div class="display-4 fw-bold text-success mb-1">
              {{ averageRating }} <span class="fs-4 text-muted">/ 5.0</span>
            </div>
            <p class="text-muted mb-0">Based on <strong>{{ reviews.length }}</strong> verified community ratings</p>
          </div>
        </div>

        <h3 class="h5 fw-bold mb-3">Community Feedback</h3>
        <div v-if="reviews.length === 0" class="text-muted">No reviews yet. Be the first to leave one!</div>

        <div class="d-flex flex-column gap-3">
          <div v-for="rev in reviews" :key="rev.id" class="card shadow-sm border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h4 class="h6 fw-bold mb-0">{{ rev.hubName }}</h4>
                <span class="badge bg-warning text-dark">{{ '★'.repeat(rev.rating) }} ({{ rev.rating }}/5)</span>
              </div>
              <p class="card-text mb-1 text-secondary">{{ rev.comment }}</p>
              <small class="text-muted">
                Submitted by: <strong>{{ rev.author }}</strong> ({{ rev.date }})
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { currentUser } from '../utils/auth'
import { sanitizeInput } from '../utils/security'

const REVIEWS_KEY = 'ecoloop_reviews'

const reviews = ref([])
const alertMessage = ref('')

const newReview = ref({
  hubName: 'Carlton Soft Plastics Depot',
  rating: 5,
  comment: ''
})

onMounted(() => {
  const saved = localStorage.getItem(REVIEWS_KEY)
  if (saved) {
    reviews.value = JSON.parse(saved)
  } else {
    // Seed sample reviews
    reviews.value = [
      {
        id: 1,
        hubName: 'Carlton Soft Plastics Depot',
        rating: 5,
        comment: 'Clean facilities and friendly volunteers. Very easy drop-off.',
        author: 'liam',
        date: '2026-09-01'
      },
      {
        id: 2,
        hubName: 'Brunswick Repair Café',
        rating: 4,
        comment: 'Helped me fix my kettle! Great community spirit.',
        author: 'admin',
        date: '2026-09-05'
      }
    ]
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews.value))
  }
})

// Computed Aggregated Rating Score
const averageRating = computed(() => {
  if (reviews.value.length === 0) return '0.0'
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0)
  return (sum / reviews.value.length).toFixed(1)
})

const submitReview = () => {
  alertMessage.value = ''
  if (!newReview.value.comment || newReview.value.comment.length < 5) {
    alertMessage.value = 'Review comment must be at least 5 characters.'
    return
  }

  // Security measure : Sanitize comment against XSS
  const cleanComment = sanitizeInput(newReview.value.comment)

  const reviewRecord = {
    id: Date.now(),
    hubName: newReview.value.hubName,
    rating: Number(newReview.value.rating),
    comment: cleanComment,
    author: currentUser.value?.username || 'Anonymous',
    date: new Date().toISOString().split('T')[0]
  }

  reviews.value.unshift(reviewRecord)
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews.value))

  newReview.value.comment = ''
  newReview.value.rating = 5
}
</script>

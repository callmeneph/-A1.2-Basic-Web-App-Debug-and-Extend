<template>
  <div class="container-xxl">
    <header class="page-head">
      <span class="eyebrow">Hub reviews</span>
      <h1>How was your drop-off?</h1>
      <p>Rate a recycling hub and read what the community has to say.</p>
    </header>
    <div class="row g-4">
      <!-- Left Column: Form for submitting reviews -->
      <div class="col-12 col-lg-5">
        <div class="card">
          <div class="card-header">
            <h2 class="h5 mb-0">Write a review</h2>
          </div>
          <div class="card-body">
            <div v-if="alertMessage" class="alert alert-warning py-2">{{ alertMessage }}</div>

            <form @submit.prevent="submitReview">
              <div class="mb-3">
                <label for="hubSelect" class="form-label fw-semibold">Drop-off hub</label>
                <select id="hubSelect" v-model="newReview.hubName" class="form-select">
                  <option>Carlton Soft Plastics Depot</option>
                  <option>Melbourne Central E-Waste Hub</option>
                  <option>Inner-North Organic Compost</option>
                  <option>Brunswick Repair Café</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="ratingScore" class="form-label fw-semibold">Rating</label>
                <select id="ratingScore" v-model.number="newReview.rating" class="form-select">
                  <option :value="5">⭐⭐⭐⭐⭐ (5 - Outstanding)</option>
                  <option :value="4">⭐⭐⭐⭐ (4 - Good)</option>
                  <option :value="3">⭐⭐⭐ (3 - Average)</option>
                  <option :value="2">⭐⭐ (2 - Needs Improvement)</option>
                  <option :value="1">⭐ (1 - Poor)</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="comment" class="form-label fw-semibold">Your review</label>
                <textarea
                  id="comment"
                  v-model.trim="newReview.comment"
                  rows="3"
                  class="form-control"
                  placeholder="Share your experience (test XSS like <script>alert(1)</script> to verify sanitization)..."
                  required
                ></textarea>
              </div>

              <button type="submit" class="btn btn-success w-100">Submit review</button>
            </form>
          </div>
        </div>
      </div>

      <!-- Right Column: Aggregated Rating Score & Verified Reviews -->
      <div class="col-12 col-lg-7">
        <div class="card mb-4">
          <div class="card-body score">
            <div>
              <p class="score-label">Community score</p>
              <div class="score-value">{{ averageRating }}<span>/ 5.0</span></div>
            </div>
            <div class="text-sm-end">
              <div class="score-stars" aria-hidden="true">{{ '★'.repeat(Math.round(Number(averageRating))) }}<span>{{ '★'.repeat(5 - Math.round(Number(averageRating))) }}</span></div>
              <p class="small text-muted mb-0">Based on <strong class="text-body">{{ reviews.length }}</strong> community ratings</p>
            </div>
          </div>
        </div>

        <h3 class="h6 mb-3">Community feedback</h3>
        <div v-if="reviews.length === 0" class="text-muted small">No reviews yet. Be the first to leave one!</div>

        <div class="d-flex flex-column gap-3">
          <div v-for="rev in reviews" :key="rev.id" class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h4 class="h6 mb-0">{{ rev.hubName }}</h4>
                <span class="rev-rating">
                  <span class="rev-stars" aria-hidden="true">{{ '★'.repeat(rev.rating) }}<span>{{ '★'.repeat(5 - rev.rating) }}</span></span>
                  {{ rev.rating }}/5<span class="visually-hidden"> stars</span>
                </span>
              </div>
              <p class="card-text mb-2">{{ rev.comment }}</p>
              <small class="text-muted">
                <strong class="text-body">{{ rev.author }}</strong> · {{ rev.date }}
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

<style scoped>
.score { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 1rem; }
.score-label { font-size: 0.8rem; font-weight: 500; color: var(--eco-muted); margin-bottom: 0.2rem; }
.score-value { font-size: 2.75rem; font-weight: 700; letter-spacing: -0.04em; line-height: 1; }
.score-value span { font-size: 1rem; font-weight: 500; color: var(--eco-muted); letter-spacing: 0; margin-left: 0.35rem; }
.score-stars { font-size: 1.25rem; color: #e5a000; letter-spacing: 0.1em; }
.score-stars span, .rev-stars span { color: var(--eco-line-strong); }
.rev-rating { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; color: var(--eco-ink-2); white-space: nowrap; }
.rev-stars { color: #e5a000; font-size: 0.95rem; letter-spacing: 0.08em; }
</style>

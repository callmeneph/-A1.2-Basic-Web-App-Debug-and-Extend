<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-5">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-success text-white text-center py-3">
            <h2 class="h5 mb-0">🔑 Log In to Eco Loop</h2>
          </div>
          <div class="card-body p-4">
            <div v-if="errorMessage" class="alert alert-danger py-2">{{ errorMessage }}</div>

            <form @submit.prevent="handleLogin" novalidate>
              <div class="mb-3">
                <label for="username" class="form-label fw-semibold">Username or Email</label>
                <input
                  id="username"
                  v-model.trim="identifier"
                  type="text"
                  class="form-control"
                  placeholder="admin or liam"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label fw-semibold">Password</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" class="btn btn-success w-100 fw-bold py-2">Sign In</button>
            </form>

            <div class="mt-3 text-center">
              <small class="text-muted">
                Don't have an account? <router-link to="/register">Register here</router-link>
              </small>
            </div>

            <div class="mt-4 p-2 bg-light border rounded small">
              <strong>Quick Test Credentials:</strong><br />
              • Admin: <code>admin</code> / <code>AdminPassword123!</code><br />
              • Member: <code>liam</code> / <code>MemberPassword123!</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { loginUser } from '../utils/auth'

const identifier = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const route = useRoute()

const handleLogin = () => {
  errorMessage.value = ''
  try {
    loginUser(identifier.value, password.value)
    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  } catch (err) {
    errorMessage.value = err.message
  }
}
</script>

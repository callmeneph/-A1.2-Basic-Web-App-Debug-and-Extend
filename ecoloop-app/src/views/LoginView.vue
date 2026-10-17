<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-5">
        <div class="card auth-card">
          <div class="card-body">
            <div class="auth-head">
              <span class="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
              </span>
              <h1 class="h4">Welcome back</h1>
              <p>Log in to your Eco Loop account.</p>
            </div>
            <div v-if="errorMessage" class="alert alert-danger py-2">{{ errorMessage }}</div>

            <form @submit.prevent="handleLogin" novalidate>
              <div class="mb-3">
                <label for="username" class="form-label fw-semibold">Username or email</label>
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

              <button type="submit" class="btn btn-success w-100 py-2">Log in</button>
            </form>

            <div class="mt-3 text-center">
              <small class="text-muted">
                Don't have an account? <router-link to="/register" class="fw-semibold">Create one</router-link>
              </small>
            </div>

            <div class="demo-creds">
              <strong>Test accounts</strong><br />
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

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
              <h1 class="h4">Create your account</h1>
              <p>Join the Eco Loop Melbourne community.</p>
            </div>
            <div v-if="errorMessage" class="alert alert-danger py-2">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success py-2">{{ successMessage }}</div>

            <form @submit.prevent="handleRegister" novalidate>
              <div class="mb-3">
                <label for="regUser" class="form-label fw-semibold">Username</label>
                <input id="regUser" v-model.trim="form.username" type="text" class="form-control" required />
              </div>

              <div class="mb-3">
                <label for="regEmail" class="form-label fw-semibold">Email address</label>
                <input id="regEmail" v-model.trim="form.email" type="email" class="form-control" required />
              </div>

              <div class="mb-3">
                <label for="regPass" class="form-label fw-semibold">Password <span class="text-muted fw-normal">(min 8 chars, 1 number, 1 special char)</span></label>
                <input id="regPass" v-model="form.password" type="password" class="form-control" required />
              </div>

              <div class="mb-3">
                <label for="regRole" class="form-label fw-semibold">Account role</label>
                <select id="regRole" v-model="form.role" class="form-select">
                  <option value="member">Member (Community User)</option>
                  <option value="admin">Admin (NFP Coordinator)</option>
                </select>
              </div>

              <button type="submit" class="btn btn-success w-100 py-2">Create account</button>
            </form>

            <div class="mt-3 text-center">
              <small class="text-muted">
                Already registered? <router-link to="/login" class="fw-semibold">Log in</router-link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '../utils/auth'

const form = ref({ username: '', email: '', password: '', role: 'member' })
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()

const handleRegister = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (form.value.username.length < 3) {
    errorMessage.value = 'Username must be at least 3 characters.'
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    errorMessage.value = 'Please provide a valid email.'
    return
  }
  if (form.value.password.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long.'
    return
  }

  try {
    registerUser(form.value)
    successMessage.value = 'Registration successful! Redirecting to login...'
    setTimeout(() => router.push('/login'), 1200)
  } catch (err) {
    errorMessage.value = err.message
  }
}
</script>

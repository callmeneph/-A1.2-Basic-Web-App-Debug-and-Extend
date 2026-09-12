<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-5">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-primary text-white text-center py-3">
            <h2 class="h5 mb-0">📝 Register New Account</h2>
          </div>
          <div class="card-body p-4">
            <div v-if="errorMessage" class="alert alert-danger py-2">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success py-2">{{ successMessage }}</div>

            <form @submit.prevent="handleRegister" novalidate>
              <div class="mb-3">
                <label for="regUser" class="form-label fw-semibold">Username</label>
                <input id="regUser" v-model.trim="form.username" type="text" class="form-control" required />
              </div>

              <div class="mb-3">
                <label for="regEmail" class="form-label fw-semibold">Email Address</label>
                <input id="regEmail" v-model.trim="form.email" type="email" class="form-control" required />
              </div>

              <div class="mb-3">
                <label for="regPass" class="form-label fw-semibold">Password (Min 8 chars, 1 number, 1 special char)</label>
                <input id="regPass" v-model="form.password" type="password" class="form-control" required />
              </div>

              <div class="mb-3">
                <label for="regRole" class="form-label fw-semibold">Account Role</label>
                <select id="regRole" v-model="form.role" class="form-select">
                  <option value="member">Member (Community User)</option>
                  <option value="admin">Admin (NFP Coordinator)</option>
                </select>
              </div>

              <button type="submit" class="btn btn-primary w-100 fw-bold py-2">Create Account</button>
            </form>

            <div class="mt-3 text-center">
              <small class="text-muted">
                Already registered? <router-link to="/login">Login here</router-link>
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

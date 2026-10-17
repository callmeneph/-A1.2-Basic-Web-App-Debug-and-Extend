<!-- src/views/FirebaseAuthView.vue -->
<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-5">
        <div class="card auth-card">
          <div class="card-body">
            <div class="auth-head">
              <span class="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
              </span>
              <h1 class="h4">{{ isRegister ? 'Create a cloud account' : 'Cloud sign-in' }}</h1>
              <p>Secured with Firebase Authentication.</p>
            </div>
            <div v-if="errorMsg" class="alert alert-danger py-2">{{ errorMsg }}</div>
            <div v-if="successMsg" class="alert alert-success py-2">{{ successMsg }}</div>

            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="fbEmail" class="form-label fw-semibold">Email address</label>
                <input
                  id="fbEmail"
                  v-model.trim="email"
                  type="email"
                  class="form-control"
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="fbPassword" class="form-label fw-semibold">Password</label>
                <input
                  id="fbPassword"
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>

              <button type="submit" class="btn btn-success w-100 py-2 mb-3">
                {{ isRegister ? 'Create account' : 'Sign in' }}
              </button>
            </form>

            <div class="text-center">
              <button class="btn btn-link text-decoration-none btn-sm fw-semibold" @click="toggleMode">
                {{ isRegister ? 'Already have an account? Sign in' : 'New here? Create an account' }}
              </button>
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
import { auth } from '../firebase/init'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const isRegister = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const router = useRouter()

const toggleMode = () => {
  isRegister.value = !isRegister.value
  errorMsg.value = ''
  successMsg.value = ''
}

const handleSubmit = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    if (isRegister.value) {
      await createUserWithEmailAndPassword(auth, email.value, password.value)
      successMsg.value = 'Account successfully registered to Firebase!'
    } else {
      await signInWithEmailAndPassword(auth, email.value, password.value)
      successMsg.value = 'Signed in successfully!'
    }
    setTimeout(() => router.push('/'), 1200)
  } catch (err) {
    errorMsg.value = err.message
  }
}
</script>

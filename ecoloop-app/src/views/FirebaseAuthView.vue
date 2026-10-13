<!-- src/views/FirebaseAuthView.vue -->
<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-5">
        <div class="card shadow border-0">
          <div class="card-header bg-success text-white text-center py-3">
            <h2 class="h5 mb-0">{{ isRegister ? 'Create Cloud Account' : 'Firebase Cloud Sign-In' }}</h2>
          </div>
          <div class="card-body p-4">
            <div v-if="errorMsg" class="alert alert-danger py-2">{{ errorMsg }}</div>
            <div v-if="successMsg" class="alert alert-success py-2">{{ successMsg }}</div>

            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="fbEmail" class="form-label fw-semibold">Email Address</label>
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

              <button type="submit" class="btn btn-success w-100 fw-bold py-2 mb-3">
                {{ isRegister ? 'Register with Firebase' : 'Sign In with Firebase' }}
              </button>
            </form>

            <div class="text-center">
              <button class="btn btn-link text-decoration-none btn-sm" @click="toggleMode">
                {{ isRegister ? 'Already registered? Switch to Sign In' : 'New here? Switch to Register' }}
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

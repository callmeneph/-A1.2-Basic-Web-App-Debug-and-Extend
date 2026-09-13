<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-success shadow-sm mb-4">
    <div class="container-fluid container-xxl">
      <router-link class="navbar-brand fw-bold" to="/">
        🌱 Eco Loop Melbourne
      </router-link>

      <div class="d-flex align-items-center gap-2">
        <ul class="navbar-nav d-flex flex-row gap-3 me-3">
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/reviews">Hub Reviews</router-link>
          </li>
          <!-- Show Admin link only if logged-in user is admin -->
          <li v-if="currentUser?.role === 'admin'" class="nav-item">
            <router-link class="nav-link text-warning fw-bold" to="/admin">Admin Portal</router-link>
          </li>
        </ul>

        <!-- Guest links -->
        <div v-if="!currentUser" class="d-flex gap-2">
          <router-link to="/login" class="btn btn-sm btn-outline-light">Login</router-link>
          <router-link to="/register" class="btn btn-sm btn-light fw-bold text-success">Register</router-link>
        </div>

        <!-- Logged in state -->
        <div v-else class="d-flex align-items-center gap-2">
          <span class="badge bg-light text-dark">
            {{ currentUser.username }} ({{ currentUser.role }})
          </span>
          <button class="btn btn-sm btn-outline-light" @click="handleLogout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { currentUser, logoutUser } from '../utils/auth'

const router = useRouter()

const handleLogout = () => {
  logoutUser()
  router.push('/login')
}
</script>

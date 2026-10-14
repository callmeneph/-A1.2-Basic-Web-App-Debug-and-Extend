<!-- src/components/AppNavbar.vue -->
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-success shadow-sm mb-4"
  role="navigation"
  aria-label="Main Community Navigation">
    <div class="container-fluid container-xxl">
      <!-- Brand Logo -->
      <router-link class="navbar-brand fw-bold d-flex align-items-center me-3" to="/">
        <span class="fs-4 me-2">🌱</span>
        <span>Eco Loop Melbourne</span>
      </router-link>

      <!-- Mobile Toggle Button -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#ecoNavbar"
        aria-controls="ecoNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Content -->
      <div class="collapse navbar-collapse" id="ecoNavbar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/tables">Data Tables</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/map">Geolocation Map</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/export">Data Export</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/send-email">Cloud Email</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/reviews">Hub Reviews</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-warning fw-bold" to="/innovations">💡 Innovations</router-link>
          </li>
          <li v-if="currentUser?.role === 'admin'" class="nav-item">
            <router-link class="nav-link text-warning fw-bold" to="/admin">Admin Portal</router-link>
          </li>
        </ul>

        <!-- Authentication State on Right -->
        <div class="d-flex align-items-center gap-2">
          <div v-if="!currentUser" class="d-flex gap-2">
            <router-link to="/cloud-login" class="btn btn-sm btn-outline-light">Firebase Auth</router-link>
            <router-link to="/login" class="btn btn-sm btn-light fw-bold text-success">Login</router-link>
          </div>
          <div v-else class="d-flex align-items-center gap-2">
            <span class="badge bg-light text-dark py-2 px-3">
              👤 {{ currentUser.username }} ({{ currentUser.role }})
            </span>
            <button class="btn btn-sm btn-outline-light" @click="handleLogout">Logout</button>
          </div>
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

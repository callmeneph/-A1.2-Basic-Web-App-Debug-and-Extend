<!-- src/components/AppNavbar.vue -->
<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark bg-success shadow-sm mb-4"
    role="navigation"
    aria-label="Main Community Navigation"
  >
    <div class="container-fluid container-xxl">
      <!-- Brand Logo -->
      <router-link class="navbar-brand fw-bold d-flex align-items-center me-3" to="/" @click="closeNav">
        <span class="fs-4 me-2">🌱</span>
        <span>Eco Loop Melbourne</span>
      </router-link>

      <!-- Mobile Toggle Button (Native Vue State) -->
      <button
        class="navbar-toggler"
        type="button"
        aria-controls="ecoNavbar"
        :aria-expanded="isNavOpen"
        aria-label="Toggle navigation"
        @click="toggleNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Content -->
      <div
        class="collapse navbar-collapse"
        id="ecoNavbar"
        :class="{ show: isNavOpen }"
      >
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-1 pt-2 pt-lg-0">
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/" @click="closeNav">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/tables" @click="closeNav">Data Tables</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/map" @click="closeNav">Geolocation Map</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/export" @click="closeNav">Data Export</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/send-email" @click="closeNav">Cloud Email</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/reviews" @click="closeNav">Hub Reviews</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-warning fw-bold" to="/innovations" @click="closeNav">💡 Innovations</router-link>
          </li>
          <li v-if="currentUser?.role === 'admin'" class="nav-item">
            <router-link class="nav-link text-warning fw-bold" to="/admin" @click="closeNav">Admin Portal</router-link>
          </li>
        </ul>

        <!-- Authentication State -->
        <div class="d-flex flex-wrap align-items-center gap-2 pt-2 pt-lg-0 border-top border-lg-0 border-success-subtle">
          <div v-if="!currentUser" class="d-flex gap-2">
            <router-link to="/cloud-login" class="btn btn-sm btn-outline-light" @click="closeNav">Firebase Auth</router-link>
            <router-link to="/login" class="btn btn-sm btn-light fw-bold text-success" @click="closeNav">Login</router-link>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser, logoutUser } from '../utils/auth'

const router = useRouter()
const isNavOpen = ref(false)

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
}

const closeNav = () => {
  isNavOpen.value = false
}

const handleLogout = () => {
  logoutUser()
  closeNav()
  router.push('/login')
}
</script>

<style scoped>
/* Smooth mobile drawer appearance */
@media (max-width: 991.98px) {
  .navbar-collapse {
    background-color: #157347;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-top: 0.5rem;
  }
}
</style>

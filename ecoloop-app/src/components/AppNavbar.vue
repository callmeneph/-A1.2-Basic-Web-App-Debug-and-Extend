<!-- src/components/AppNavbar.vue -->
<template>
  <nav
    class="navbar navbar-expand-xl eco-nav"
    role="navigation"
    aria-label="Main Community Navigation"
  >
    <div class="container-xxl">
      <!-- Brand Logo -->
      <router-link class="navbar-brand d-flex align-items-center gap-2 me-4" to="/" @click="closeNav">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
        </span>
        <span class="brand-text">Eco Loop <span class="brand-sub">Melbourne</span></span>
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
        <svg v-if="!isNavOpen" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>

      <!-- Navigation Content -->
      <div
        class="collapse navbar-collapse"
        id="ecoNavbar"
        :class="{ show: isNavOpen }"
      >
        <ul class="navbar-nav me-auto gap-xl-1">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active" @click="closeNav">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/map" active-class="active" @click="closeNav">Map</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/tables" active-class="active" @click="closeNav">Data</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/export" active-class="active" @click="closeNav">Export</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/send-email" active-class="active" @click="closeNav">Email</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/reviews" active-class="active" @click="closeNav">Reviews</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/innovations" active-class="active" @click="closeNav">
              Innovations <span class="nav-new">New</span>
            </router-link>
          </li>
          <li v-if="currentUser?.role === 'admin'" class="nav-item">
            <router-link class="nav-link" to="/admin" active-class="active" @click="closeNav">Admin</router-link>
          </li>
        </ul>

        <!-- Authentication State -->
        <div class="nav-auth">
          <div v-if="!currentUser" class="d-flex gap-2">
            <router-link to="/cloud-login" class="btn btn-sm btn-outline-secondary" @click="closeNav">Firebase Auth</router-link>
            <router-link to="/login" class="btn btn-sm btn-success" @click="closeNav">Log in</router-link>
          </div>
          <div v-else class="d-flex align-items-center gap-2">
            <span class="user-pill">
              <span class="user-avatar" aria-hidden="true">{{ currentUser.username.charAt(0).toUpperCase() }}</span>
              <span class="user-name">{{ currentUser.username }}</span>
              <span class="user-role">{{ currentUser.role }}</span>
            </span>
            <button class="btn btn-sm btn-outline-secondary" @click="handleLogout">Log out</button>
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
.eco-nav {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid var(--eco-line);
  padding: 0.7rem 0;
}

.navbar-brand { color: var(--eco-ink); font-weight: 650; letter-spacing: -0.02em; font-size: 1.05rem; }
.navbar-brand:hover { color: var(--eco-ink); }
.brand-sub { color: var(--eco-muted); font-weight: 500; }

.navbar-toggler {
  border: 1px solid var(--eco-line-strong);
  border-radius: 10px;
  padding: 0.35rem 0.5rem;
  color: var(--eco-ink);
}
.navbar-toggler:focus { box-shadow: 0 0 0 4px rgba(21, 128, 61, 0.12); }

.nav-link {
  color: var(--eco-ink-2);
  font-size: 0.92rem;
  font-weight: 500;
  padding: 0.45rem 0.75rem !important;
  border-radius: 8px;
  transition: background-color 0.15s, color 0.15s;
}
.nav-link:hover { color: var(--eco-ink); background: var(--eco-surface-2); }
.nav-link.active { color: var(--eco-ink); background: var(--eco-surface-2); font-weight: 600; }

.nav-new {
  font-size: 0.65rem;
  font-weight: 650;
  color: var(--eco-green);
  background: var(--eco-green-soft);
  border: 1px solid var(--eco-green-line);
  border-radius: 999px;
  padding: 0.05rem 0.4rem;
  margin-left: 0.25rem;
  vertical-align: 1px;
}

.nav-auth { display: flex; align-items: center; }

.user-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 0.65rem 0.2rem 0.2rem;
  border: 1px solid var(--eco-line);
  border-radius: 999px;
  background: var(--eco-surface);
  font-size: 0.85rem;
}
.user-avatar {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--eco-green-soft);
  color: var(--eco-green);
  font-weight: 650;
  font-size: 0.8rem;
}
.user-name { font-weight: 600; color: var(--eco-ink); }
.user-role {
  color: var(--eco-muted);
  font-size: 0.75rem;
  text-transform: capitalize;
}

/* Mobile drawer */
@media (max-width: 1199.98px) {
  .navbar-collapse { padding-top: 0.75rem; }
  .navbar-nav { padding-bottom: 0.75rem; }
  .nav-link { padding: 0.65rem 0.75rem !important; }
  .nav-auth { padding-top: 0.75rem; border-top: 1px solid var(--eco-line); }
}
</style>

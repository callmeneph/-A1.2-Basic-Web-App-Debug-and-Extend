<!-- src/App.vue -->
<template>
  <div id="app" class="bg-light min-vh-100 d-flex flex-column">
    <!-- WCAG 2.1 AA: Skip to Main Content Link for Keyboard / Screen Reader Users -->
    <a href="#mainContent" class="skip-link">
      Skip to main content
    </a>

    <!-- Header Landmark -->
    <header role="banner">
      <AppNavbar />
    </header>

    <!-- Main Content Landmark -->
    <main id="mainContent" role="main" class="flex-grow-1" tabindex="-1">
      <router-view />
    </main>

    <!-- Footer Landmark -->
    <footer role="contentinfo" class="bg-dark text-white py-4 mt-5">
      <div class="container text-center">
        <p class="mb-1 fw-bold">🌱 Eco Loop Melbourne — Community Circular Hub</p>
        <p class="small text-muted mb-0">
          Compliant with WCAG 2.1 Level AA Accessibility Standards. IT for Social Good Initiative.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
</script>

<style>
/* Global Accessible Styling & Focus Management */
.skip-link {
  position: absolute;
  top: -60px;
  left: 15px;
  background: #0d6efd;
  color: #ffffff;
  padding: 10px 16px;
  z-index: 9999;
  font-weight: 700;
  border-radius: 4px;
  text-decoration: none;
  transition: top 0.2s ease-in-out;
}

.skip-link:focus {
  top: 15px;
  outline: 3px solid #ffc107;
}

/* Accessible focus outlines across all interactive controls */
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid #0d6efd !important;
  outline-offset: 2px !important;
}

/* High Contrast baseline */
body {
  margin: 0;
  color: #212529;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
</style>

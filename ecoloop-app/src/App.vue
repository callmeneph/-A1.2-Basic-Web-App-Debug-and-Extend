<!-- src/App.vue -->
<template>
  <div id="app" class="min-vh-100 d-flex flex-column">
    <!-- WCAG 2.1 AA: Skip to Main Content Link for Keyboard / Screen Reader Users -->
    <a href="#mainContent" class="skip-link">
      Skip to main content
    </a>

    <!-- Header Landmark -->
    <header role="banner" class="site-header">
      <AppNavbar />
    </header>

    <!-- Main Content Landmark -->
    <main id="mainContent" role="main" class="flex-grow-1 pb-5" tabindex="-1">
      <router-view />
    </main>

    <!-- Footer Landmark -->
    <footer role="contentinfo" class="site-footer">
      <div class="container-xxl">
        <div class="d-flex flex-column flex-md-row justify-content-between gap-4">
          <div>
            <div class="d-flex align-items-center gap-2 mb-2">
              <span class="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
              </span>
              <span class="fw-semibold">Eco Loop Melbourne</span>
            </div>
            <p class="footer-copy mb-0">
              A community circular hub helping Melbourne reduce, reuse, repair and recycle.
            </p>
          </div>
          <nav aria-label="Footer" class="footer-links">
            <router-link to="/map">Drop-off map</router-link>
            <router-link to="/tables">Data</router-link>
            <router-link to="/reviews">Reviews</router-link>
            <router-link to="/innovations">Innovations</router-link>
          </nav>
        </div>
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
  background: var(--eco-ink);
  color: #ffffff;
  padding: 10px 16px;
  z-index: 9999;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  transition: top 0.2s ease-in-out;
}

.skip-link:focus {
  top: 15px;
  outline: 3px solid var(--eco-green);
}

/* Accessible focus outlines across all interactive controls */
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid var(--eco-green) !important;
  outline-offset: 2px !important;
}

#mainContent:focus { outline: none; }

body { margin: 0; }

.site-header {
  position: sticky;
  top: 0;
  z-index: 1030;
}

.brand-mark {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: var(--eco-green);
  color: #fff;
}
.brand-mark svg { width: 17px; height: 17px; }

.site-footer {
  border-top: 1px solid var(--eco-line);
  background: var(--eco-surface);
  padding: 2.5rem 0;
  margin-top: 1rem;
  font-size: 0.92rem;
}
.footer-copy { color: var(--eco-muted); max-width: 26rem; }
.footer-links { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; align-items: flex-start; }
.footer-links a { color: var(--eco-ink-2); text-decoration: none; }
.footer-links a:hover { color: var(--eco-green); }
</style>

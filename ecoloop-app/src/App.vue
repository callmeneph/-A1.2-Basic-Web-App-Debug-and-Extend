<template>
  <div id="app" class="bg-light min-vh-100 pb-5">
    <AppNavbar />

    <main class="container-fluid container-xxl">
      <!-- my Section Header -->
      <div class="row mb-4">
        <div class="col-12 text-center text-md-start">
          <h1 class="h3 fw-bold text-success">Eco Loop Melbourne Portal</h1>
          <p class="text-muted">
            Empowering Melbourne communities with circular recycling directories and local drop-off management.
          </p>
        </div>
      </div>

      <!-- The B.2 requirement: Dynamic JSON Directory -->
      <WasteDirectory />

      <!-- The B.1 & A.2 requirement : Validated Form & Responsive Layout -->
      <DropOffForm />
    </main>
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
import WasteDirectory from './components/WasteDirectory.vue'
import DropOffForm from './components/DropOffForm.vue'
</script>

<style>
/* Global styling adjustments */
body {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f8f9fa;
}
</style>

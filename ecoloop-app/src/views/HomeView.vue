<template>
  <div>
    <div class="row mb-4">
      <div class="col-12 text-center text-md-start">
        <h1 class="h3 fw-bold text-success">Eco Loop Melbourne Portal</h1>
        <p class="text-muted">
          Empowering Melbourne communities with circular recycling directories and local drop-off management.
        </p>
      </div>
    </div>

    <WasteDirectory />
    <DropOffForm />
  </div>
</template>

<script setup>
import WasteDirectory from '../components/WasteDirectory.vue'
import DropOffForm from '../components/DropOffForm.vue'
</script>

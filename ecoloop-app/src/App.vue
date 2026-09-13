<template>
  <div id="app" class="bg-light min-vh-100 pb-5">
    <AppNavbar />
    <main class="container-fluid container-xxl">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
</script>

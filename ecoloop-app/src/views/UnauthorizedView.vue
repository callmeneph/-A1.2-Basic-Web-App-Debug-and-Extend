<template>
  <div class="container my-5 text-center">
    <div class="py-5">
      <span class="eyebrow mb-3">Error 403</span>
      <h1 class="display-5 fw-bold mt-3 mb-2">You don't have access to this page</h1>
      <p class="text-muted mb-4">
        You are signed in, but your role does not have permission to view the Admin Dashboard.
      </p>
      <router-link to="/" class="btn btn-success me-2">Back to home</router-link>
      <router-link to="/reviews" class="btn btn-outline-secondary">View reviews</router-link>
    </div>
  </div>
</template>

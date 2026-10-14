<template>
  <div class="container my-5 text-center">
    <div class="py-5">
      <h1 class="display-3 text-danger fw-bold">403</h1>
      <h2 class="h4 mb-3">Access Denied: Insufficient Permissions</h2>
      <p class="text-muted mb-4">
        You are signed in, but your role does not have permission to view the Admin Dashboard.
      </p>
      <router-link to="/" class="btn btn-success me-2">Back to Home</router-link>
      <router-link to="/reviews" class="btn btn-outline-secondary">View Reviews</router-link>
    </div>
  </div>
</template>

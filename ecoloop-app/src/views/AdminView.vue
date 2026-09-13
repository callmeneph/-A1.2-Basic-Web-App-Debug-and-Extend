<template>
  <div class="container my-5">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
        <h2 class="h5 mb-0">🛡️ NFP Operations Admin Dashboard (RBAC Protected)</h2>
        <span class="badge bg-danger">Role: ADMIN</span>
      </div>
      <div class="card-body p-4">
        <div class="alert alert-success">
          <strong>Access Granted!</strong> Welcome, <strong>{{ currentUser?.username }}</strong>. You are authorized to manage hub listings and review moderation.
        </div>

        <h3 class="h6 fw-bold mt-4 mb-3">Registered Users in System (Client-Side State)</h3>
        <div class="table-responsive">
          <table class="table table-hover table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Assigned Role</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in allUsers" :key="user.username">
                <td class="fw-bold">{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span :class="user.role === 'admin' ? 'badge bg-danger' : 'badge bg-primary'">
                    {{ user.role.toUpperCase() }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { currentUser, getUsers } from '../utils/auth'

const allUsers = ref([])

onMounted(() => {
  allUsers.value = getUsers()
})
</script>

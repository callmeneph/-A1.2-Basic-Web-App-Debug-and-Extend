<template>
  <div class="container-xxl">
    <header class="page-head d-flex flex-wrap justify-content-between align-items-end gap-3">
      <div>
        <span class="eyebrow">Admin · role-based access</span>
        <h1>Operations dashboard</h1>
        <p>Welcome, <strong class="text-body">{{ currentUser?.username }}</strong>. You can manage hub listings and moderate reviews.</p>
      </div>
      <span class="badge bg-dark">Role: Admin</span>
    </header>
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h2 class="h6 mb-0">Registered users</h2>
        <span class="badge bg-light">{{ allUsers.length }} users</span>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Assigned Role</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in allUsers" :key="user.username">
                <td class="fw-semibold">{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span :class="user.role === 'admin' ? 'badge bg-danger' : 'badge bg-primary'">
                    {{ user.role }}
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

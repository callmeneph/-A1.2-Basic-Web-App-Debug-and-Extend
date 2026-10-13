import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ReviewsView from '../views/ReviewsView.vue'
import AdminView from '../views/AdminView.vue'
import UnauthorizedView from '../views/UnauthorizedView.vue'
import FirebaseAuthView from '../views/FirebaseAuthView.vue'
import DataTablesView from '../views/DataTablesView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/cloud-login', name: 'CloudLogin', component: FirebaseAuthView },
  {
    path: '/reviews',
    name: 'Reviews',
    component: ReviewsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/tables',
    name: 'DataTables',
    component: DataTablesView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  { path: '/unauthorized', name: 'Unauthorized', component: UnauthorizedView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const sessionUser = JSON.parse(localStorage.getItem('ecoloop_current_user') || 'null')

  if (to.meta.requiresAuth && !sessionUser) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  if (to.meta.roles && (!sessionUser || !to.meta.roles.includes(sessionUser.role))) {
    return next({ name: 'Unauthorized' })
  }

  next()
})

export default router

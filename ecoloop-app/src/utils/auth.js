
import { ref } from 'vue'

const USERS_KEY = 'ecoloop_users'
const CURRENT_USER_KEY = 'ecoloop_current_user'

// ima gonna have a default accounts if empty (Admin and Member)
const initUsers = () => {
  const existing = localStorage.getItem(USERS_KEY)
  if (!existing) {
    const seedUsers = [
      {
        username: 'admin',
        email: 'admin@ecoloop.org',
        password: 'AdminPassword123!',
        role: 'admin'
      },
      {
        username: 'liam',
        email: 'liam@student.monash.edu',
        password: 'MemberPassword123!',
        role: 'member'
      }
    ]
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers))
  }
}

initUsers()

export const currentUser = ref(JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null'))

export const getUsers = () => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
}

export const registerUser = ({ username, email, password, role = 'member' }) => {
  const users = getUsers()
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('Username is already taken.')
  }
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email is already registered.')
  }
  const newUser = { username, email, password, role }
  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return newUser
}

export const loginUser = (usernameOrEmail, password) => {
  const users = getUsers()
  const found = users.find(
    u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
  )
  if (!found) {
    throw new Error('Invalid username/email or password.')
  }
  const sessionUser = { username: found.username, email: found.email, role: found.role }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser))
  currentUser.value = sessionUser
  return sessionUser
}

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY)
  currentUser.value = null
}

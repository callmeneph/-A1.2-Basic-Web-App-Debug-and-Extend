// src/firebase/init.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDUFwT8zpFouS35m4UYbrpdehn-wUJGCDY",
  authDomain: "fit5032-5449a.firebaseapp.com",
  projectId: "fit5032-5449a",
  storageBucket: "fit5032-5449a.firebasestorage.app",
  messagingSenderId: "66905204340",
  appId: "1:66905204340:web:d5338096f8ee9feae7d321"
}
  
// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app

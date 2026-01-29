import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase if config is present
let app
try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId) {
    app = initializeApp(firebaseConfig)
  } else {
    console.warn('Firebase config missing. Auth/DB disabled for this session.')
  }
} catch (e) {
  console.error('Failed to init Firebase', e)
}

export const db = app ? getFirestore(app) : null
export const storage = app ? getStorage(app) : null
export const auth = app ? getAuth(app) : { _disabled: true }

// Only users with this email will be considered admins
export const allowedAdminEmail = import.meta.env.VITE_ADMIN_EMAIL || ''
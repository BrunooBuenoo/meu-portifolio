import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDuHcDa2l0IkbKjFEnZ0J-UULKJo3nJ8zM",
  authDomain: "meu-portifolio-c2400.firebaseapp.com",
  projectId: "meu-portifolio-c2400",
  storageBucket: "meu-portifolio-c2400.firebasestorage.app",
  messagingSenderId: "565080440885",
  appId: "1:565080440885:web:af25e32daca0ad81e1b17c"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app)

let _authReady = null
export const authReady = () => {
  if (_authReady) return _authReady
  _authReady = new Promise(resolve => {
    const unsub = onAuthStateChanged(auth, () => {
      unsub(); resolve(true)
    })
  })
  return _authReady
}

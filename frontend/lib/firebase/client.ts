'use client'

import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

function assertFirebaseEnv() {
  const required: Array<keyof typeof firebaseConfig> = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ]
  const missing = required.filter((k) => !firebaseConfig[k])
  if (missing.length) {
    const map: Record<string, string> = {
      apiKey: 'NEXT_PUBLIC_FIREBASE_API_KEY',
      authDomain: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      projectId: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      storageBucket: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      messagingSenderId: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      appId: 'NEXT_PUBLIC_FIREBASE_APP_ID',
    }
    const missingEnv = missing.map((k) => map[k]).join(', ')
    throw new Error(
      `Faltan variables de entorno Firebase: ${missingEnv}. ` +
        `Asegúrate de definirlas en .env.local y reiniciar el servidor.`
    )
  }
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export function getAuthClient() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth sólo está disponible en el cliente')
  }
  assertFirebaseEnv()
  return getAuth(app)
}

export function getGoogleProvider() {
  return new GoogleAuthProvider()
}

export function getGithubProvider() {
  return new GithubAuthProvider()
}

export default app

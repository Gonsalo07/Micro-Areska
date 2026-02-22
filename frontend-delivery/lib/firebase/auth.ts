import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth'

import { deliveryDriverApi } from '@/features/delivery/api/delivery-driver'
import { getAuthClient } from '@/lib/firebase/client'

export type AuthUser = Pick<FirebaseUser, 'uid' | 'email' | 'displayName' | 'photoURL'>

function splitName(displayName?: string): { firstName: string; lastName: string } {
  const name = (displayName ?? '').trim()
  if (!name) return { firstName: 'Conductor', lastName: 'Delivery' }
  const parts = name.split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

async function syncDriverToBackend(u: FirebaseUser, authProvider: string, maxRetries = 3) {
  const fullName = u.displayName || u.email?.split('@')[0] || 'Conductor'
  
  const payload = {
    firebaseUid: u.uid,
    fullName: fullName,
    email: u.email ?? '',
    phone: '',
    authProvider: authProvider,
    emailVerified: !!u.emailVerified,
    photoUrl: u.photoURL ?? undefined,
  }

  if (!payload.email) return

  let lastError: unknown
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await deliveryDriverApi.syncWithFirebase(payload)
      return
    } catch (err) {
      console.warn(`[AuthLib] syncDriverToBackend: Error en intento ${attempt + 1}:`, err)
      lastError = err
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
      }
    }
  }

  try {
    await deleteUser(u)
    console.error('Usuario borrado de Firebase debido a error en BD:', lastError)
  } catch (deleteError) {
    console.error('Error al borrar usuario de Firebase:', deleteError)
  }

  throw new Error('No se pudo crear el conductor en la base de datos')
}

export async function loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const auth = getAuthClient()
  const cred = await signInWithEmailAndPassword(auth, email, password)
  const u = cred.user
  await syncDriverToBackend(u, 'password')
  return u
}

export async function signupWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<FirebaseUser> {
  const auth = getAuthClient()
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) {
    await updateProfile(cred.user, { displayName })
  }
  const u = cred.user
  await syncDriverToBackend(u, 'password')
  return u
}

export async function logoutFirebase(): Promise<void> {
  const auth = getAuthClient()
  await signOut(auth)
}

export async function syncCurrentDriverWithBackend(
  fallbackProvider: string = 'password'
): Promise<void> {
  const auth = getAuthClient()
  const u = auth.currentUser
  if (!u) return
  await syncDriverToBackend(u, fallbackProvider)
}

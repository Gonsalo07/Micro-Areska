import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth'

import { usersApi } from '@public/api/users'

import { getAuthClient, getGithubProvider, getGoogleProvider } from './client'

export type AuthUser = Pick<FirebaseUser, 'uid' | 'email' | 'displayName' | 'photoURL'>

function splitName(displayName?: string): { firstName: string; lastName: string } {
  const name = (displayName ?? '').trim()
  if (!name) return { firstName: 'Usuario', lastName: 'Firebase' }
  const parts = name.split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

function detectProviderFromUser(u: FirebaseUser, fallback: string): string {
  const p = u.providerData?.[0]?.providerId
  if (p) {
    if (p.includes('google')) return 'google'
    if (p.includes('github')) return 'github'
    if (p.includes('facebook')) return 'facebook'
    if (p.includes('apple')) return 'apple'
    if (p.includes('password')) return 'password'
    return p
  }
  return fallback
}

async function syncUserToBackend(u: FirebaseUser, authProvider: string, maxRetries = 3) {
  const { firstName, lastName } = splitName(u.displayName ?? undefined)
  const payload = {
    firebaseUid: u.uid,
    email: u.email ?? '',
    firstName,
    lastName,
    authProvider: detectProviderFromUser(u, authProvider),
    emailVerified: !!u.emailVerified,
    photoUrl: u.photoURL ?? null,
  }

  if (!payload.email) return

  let lastError: unknown
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const synced = await usersApi.syncWithFirebase(payload)
      if (synced?.id) {
        return
      }
    } catch (err) {
      console.warn(`[AuthLib] syncUserToBackend: Error en intento ${attempt + 1}:`, err)
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

  throw new Error('No se pudo crear el usuario en la base de datos')
}

export async function loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const auth = getAuthClient()
  const cred = await signInWithEmailAndPassword(auth, email, password)
  const u = cred.user
  await syncUserToBackend(u, 'password')
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
  await syncUserToBackend(u, 'password')
  return u
}

export async function loginWithGoogle(): Promise<FirebaseUser> {
  const auth = getAuthClient()
  const cred = await signInWithPopup(auth, getGoogleProvider())

  const u = cred.user
  await syncUserToBackend(u, 'google')

  return u
}

export async function loginWithGithub(): Promise<AuthUser> {
  const auth = getAuthClient()
  const cred = await signInWithPopup(auth, getGithubProvider())
  const u = cred.user
  await syncUserToBackend(u, 'github')
  return { uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL }
}

export async function requestPasswordReset(email: string): Promise<void> {
  const auth = getAuthClient()
  await sendPasswordResetEmail(auth, email)
}

export async function logoutFirebase(): Promise<void> {
  const auth = getAuthClient()
  await signOut(auth)
}

export async function syncCurrentUserWithBackend(
  fallbackProvider: string = 'password'
): Promise<void> {
  const auth = getAuthClient()
  const u = auth.currentUser
  if (!u) return
  await syncUserToBackend(u, fallbackProvider)
}

export async function updateProfileAndSync(
  displayName: string,
  _phone?: string,
  _address?: string
): Promise<void> {
  const auth = getAuthClient()
  const u = auth.currentUser
  if (!u) throw new Error('Usuario no autenticado')

  await updateProfile(u, { displayName })
  await u.reload()
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const auth = getAuthClient()
  const user = auth.currentUser
  if (!user || !user.email) throw new Error('Usuario no autenticado')

  const provider = detectProviderFromUser(user, 'password')
  if (provider !== 'password') {
    throw new Error('No se puede cambiar la contraseña para usuarios autenticados con ' + provider)
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
  await updatePassword(user, newPassword)
}

export async function changeEmail(currentPassword: string, newEmail: string): Promise<void> {
  const auth = getAuthClient()
  const user = auth.currentUser
  if (!user || !user.email) throw new Error('Usuario no autenticado')

  const provider = detectProviderFromUser(user, 'password')
  if (provider !== 'password') {
    throw new Error('No se puede cambiar el correo para usuarios autenticados con ' + provider)
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    await reauthenticateWithCredential(user, credential)

    await updateEmail(user, newEmail)
  } catch (error) {
    console.warn('Error al cambiar email en Firebase:', error)
    throw error
  }
}

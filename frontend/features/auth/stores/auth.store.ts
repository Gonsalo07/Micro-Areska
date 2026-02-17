'use client'

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { create } from 'zustand'

import { authApi } from '@auth/api/auth'
import { clearAuthCache, readAuthCookie, saveAuthCache } from '@auth/lib/auth-cache'
import type { UserProfile, UserRole } from '@auth/types/user-profile'

import {
  changeEmail as firebaseChangeEmail,
  changePassword as firebaseChangePassword,
  loginWithEmail,
  loginWithGoogle as loginWithGoogleFn,
  logoutFirebase,
  requestPasswordReset,
  signupWithEmail,
} from '@/lib/firebase/auth'
import { getAuthClient } from '@/lib/firebase/client'

interface AuthState {
  firebaseUser: User | null
  profile: UserProfile | null
  loading: boolean
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  role: UserRole | null
  _hydrated: boolean
}

interface AuthActions {
  _setFirebaseUser: (user: User | null) => void
  _setProfile: (profile: UserProfile | null) => void
  _setLoading: (loading: boolean) => void

  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<UserProfile | null>

  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name?: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  resetPasswordEmail: (email: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  changeEmail: (currentPassword: string, newEmail: string) => Promise<void>
  updateProfile: (
    firstName: string,
    lastName: string,
    phone: string,
    address?: string
  ) => Promise<void>
}

type AuthStore = AuthState & AuthActions

function computeDerivedState(profile: UserProfile | null) {
  const role = profile?.role ?? null
  const isAdmin = role === 'ADMIN'
  return { role, isAdmin }
}

function getInitialState(): Partial<AuthState> {
  const cached = readAuthCookie()
  if (!cached?.isAuthenticated || !cached?.profile) return {}
  return {
    profile: cached.profile,
    isAuthenticated: true,
    ...computeDerivedState(cached.profile),
  }
}

const clientInitialState = getInitialState()

export const useAuthStore = create<AuthStore>((set, get) => ({
  firebaseUser: null,
  profile: null,
  loading: true,
  isLoading: false,
  _hydrated: false,
  isAuthenticated: false,
  isAdmin: false,
  role: null,
  ...clientInitialState,

  _setFirebaseUser: (user) => {
    set({ firebaseUser: user })
  },

  _setProfile: (profile) => {
    set({
      profile,
      isAuthenticated: !!profile,
      ...computeDerivedState(profile),
      _hydrated: true,
    })
    if (profile) {
      saveAuthCache(profile)
    } else {
      clearAuthCache()
    }
  },

  _setLoading: (loading) => {
    set({ loading })
  },

  signInWithGoogle: async () => {
    const auth = getAuthClient()
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  },

  signOut: async () => {
    clearAuthCache()
    await logoutFirebase()
    set({
      profile: null,
      firebaseUser: null,
      isAuthenticated: false,
      isAdmin: false,
      role: null,
    })
  },

  refreshProfile: async () => {
    const { firebaseUser } = get()
    if (firebaseUser) {
      const updatedProfile = await authApi.getByFirebaseUid(firebaseUser.uid)
      set({
        profile: updatedProfile,
        isAuthenticated: true,
        ...computeDerivedState(updatedProfile),
      })
      saveAuthCache(updatedProfile)
      return updatedProfile
    }
    return null
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      await loginWithEmail(email, password)
    } finally {
      set({ isLoading: false })
    }
  },

  signup: async (email: string, password: string, _name?: string) => {
    set({ isLoading: true })
    try {
      await signupWithEmail(email, password, _name)
    } finally {
      set({ isLoading: false })
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true })
    try {
      await loginWithGoogleFn()
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    await get().signOut()
  },

  resetPasswordEmail: async (email: string) => {
    await requestPasswordReset(email)
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    set({ isLoading: true })
    try {
      await firebaseChangePassword(currentPassword, newPassword)
    } finally {
      set({ isLoading: false })
    }
  },

  changeEmail: async (currentPassword: string, newEmail: string) => {
    set({ isLoading: true })
    try {
      await firebaseChangeEmail(currentPassword, newEmail)
    } finally {
      set({ isLoading: false })
    }
  },

  updateProfile: async (firstName: string, lastName: string, phone: string, address?: string) => {
    set({ isLoading: true })
    try {
      const { profile } = get()
      if (!profile) throw new Error('No user logged in')

      const updated = await authApi.updateProfile(profile.firebaseUid, {
        firstName,
        lastName,
        phone,
        address,
      })
      set({
        profile: updated,
        ...computeDerivedState(updated),
      })
      saveAuthCache(updated)
    } finally {
      set({ isLoading: false })
    }
  },
}))

export function getProviderFromFirebase(user: User): string {
  const providerId = user.providerData[0]?.providerId
  switch (providerId) {
    case 'google.com':
      return 'google'
    case 'facebook.com':
      return 'facebook'
    case 'password':
    default:
      return 'email'
  }
}

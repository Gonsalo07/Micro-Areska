'use client'

import { type User } from 'firebase/auth'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { DeliveryDriverResponse } from '@/lib/types/delivery'

import { deliveryDriverApi } from '@/features/delivery/api/delivery-driver'
import { loginWithEmail, logoutFirebase, signupWithEmail } from '@/lib/firebase/auth'
import { getAuthClient } from '@/lib/firebase/client'

interface AuthState {
  firebaseUser: User | null
  driver: DeliveryDriverResponse | null
  loading: boolean
  isLoading: boolean
  isAuthenticated: boolean
  _hydrated: boolean
}

interface AuthActions {
  _setFirebaseUser: (user: User | null) => void
  _setDriver: (driver: DeliveryDriverResponse | null) => void
  _setLoading: (loading: boolean) => void

  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, fullName?: string) => Promise<void>
  logout: () => Promise<void>
  refreshDriver: () => Promise<DeliveryDriverResponse | null>
}

type AuthStore = AuthState & AuthActions

function getInitialState(): Partial<AuthState> {
  if (typeof window === 'undefined') return {}
  
  const cached = localStorage.getItem('driver-auth')
  if (!cached) return {}
  
  try {
    const parsed = JSON.parse(cached)
    if (parsed?.isAuthenticated && parsed?.driver) {
      return {
        driver: parsed.driver,
        isAuthenticated: true,
      }
    }
  } catch {
    return {}
  }
  
  return {}
}

const clientInitialState = getInitialState()

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      firebaseUser: null,
      driver: null,
      loading: true,
      isLoading: false,
      _hydrated: false,
      isAuthenticated: false,
      ...clientInitialState,

      _setFirebaseUser: (user) => {
        set({ firebaseUser: user })
      },

      _setDriver: (driver) => {
        set({
          driver,
          isAuthenticated: !!driver,
          _hydrated: true,
        })
      },

      _setLoading: (loading) => {
        set({ loading })
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          await loginWithEmail(email, password)
        } finally {
          set({ isLoading: false })
        }
      },

      signup: async (email: string, password: string, fullName?: string) => {
        set({ isLoading: true })
        try {
          await signupWithEmail(email, password, fullName)
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        await logoutFirebase()
        set({
          driver: null,
          firebaseUser: null,
          isAuthenticated: false,
        })
      },

      refreshDriver: async () => {
        const { firebaseUser } = get()
        if (firebaseUser) {
          const updatedDriver = await deliveryDriverApi.getByFirebaseUid(firebaseUser.uid)
          set({
            driver: updatedDriver,
            isAuthenticated: true,
          })
          return updatedDriver
        }
        return null
      },
    }),
    {
      name: 'driver-auth',
      partialize: (state) => ({
        driver: state.driver,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

'use client'

import { useAuthStore } from '@auth/stores/auth.store'

export function useAuth() {
  const firebaseUser = useAuthStore((state) => state.firebaseUser)
  const profile = useAuthStore((state) => state.profile)
  const loading = useAuthStore((state) => state.loading)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle)
  const signOut = useAuthStore((state) => state.signOut)
  const refreshProfile = useAuthStore((state) => state.refreshProfile)
  const isAdmin = useAuthStore((state) => state.isAdmin)

  return {
    firebaseUser,
    profile,
    loading,
    isAuthenticated,
    isAdmin,
    signInWithGoogle,
    signOut,
    refreshProfile,
  }
}

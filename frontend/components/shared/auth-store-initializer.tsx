'use client'

import { useEffect, useRef } from 'react'

import { onAuthStateChanged } from 'firebase/auth'

import { authApi } from '@auth/api/auth'
import { getProviderFromFirebase, useAuthStore } from '@auth/stores/auth.store'

import { getAuthClient } from '@/lib/firebase/client'

interface Props {
  children: React.ReactNode
}

export function AuthStoreInitializer({ children }: Props) {
  const _setFirebaseUser = useAuthStore((state) => state._setFirebaseUser)
  const _setProfile = useAuthStore((state) => state._setProfile)
  const _setLoading = useAuthStore((state) => state._setLoading)

  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const auth = getAuthClient()

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      _setFirebaseUser(user)

      if (user) {
        try {
          const syncedUser = await authApi.sync({
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
            email: user.email!,
            firebaseUid: user.uid,
            authProvider: getProviderFromFirebase(user),
            emailVerified: user.emailVerified,
            photoUrl: user.photoURL,
          })

          _setProfile(syncedUser)
        } catch {
          try {
            const profile = await authApi.getByFirebaseUid(user.uid)
            _setProfile(profile)
          } catch {
            _setProfile(null)
          }
        }
      } else {
        _setProfile(null)
      }

      _setLoading(false)
    })

    return unsubscribe
  }, [_setFirebaseUser, _setProfile, _setLoading])

  return <>{children}</>
}

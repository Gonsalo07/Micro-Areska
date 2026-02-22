'use client'

import { useEffect } from 'react'

import { onAuthStateChanged } from 'firebase/auth'

import { createAuthCookie, deleteAuthCookie } from '@/actions/auth.action'
import { deliveryDriverApi } from '@/features/delivery/api/delivery-driver'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { getAuthClient } from '@/lib/firebase/client'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { _setFirebaseUser, _setDriver, _setLoading } = useAuthStore()

  useEffect(() => {
    const auth = getAuthClient()

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      _setFirebaseUser(user)

      if (user) {
        try {
          const driver = await deliveryDriverApi.getByFirebaseUid(user.uid)
          _setDriver(driver)
          await createAuthCookie()
        } catch (error) {
          console.error('Error loading driver profile:', error)
          _setDriver(null)
          await deleteAuthCookie()
        }
      } else {
        _setDriver(null)
        await deleteAuthCookie()
      }

      _setLoading(false)
    })

    return () => unsubscribe()
  }, [_setFirebaseUser, _setDriver, _setLoading])

  return <>{children}</>
}

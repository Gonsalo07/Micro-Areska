'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { DeliveryDriverResponse } from '@/lib/types/delivery'

interface DriverState {
  driver: DeliveryDriverResponse | null
  isAvailable: boolean
  setDriver: (driver: DeliveryDriverResponse | null) => void
  updateDriver: (data: Partial<DeliveryDriverResponse>) => void
  setAvailability: (isAvailable: boolean) => void
  clearDriver: () => void
}

export const useDriverStore = create<DriverState>()(
  persist(
    (set) => ({
      driver: null,
      isAvailable: false,

      setDriver: (driver) => {
        set({ driver, isAvailable: driver?.isAvailable ?? false })
      },

      updateDriver: (data) => {
        set((state) => ({
          driver: state.driver ? { ...state.driver, ...data } : null,
        }))
      },

      setAvailability: (isAvailable) => {
        set((state) => ({
          isAvailable,
          driver: state.driver ? { ...state.driver, isAvailable } : null,
        }))
      },

      clearDriver: () => {
        set({ driver: null, isAvailable: false })
      },
    }),
    {
      name: 'driver-storage',
    }
  )
)

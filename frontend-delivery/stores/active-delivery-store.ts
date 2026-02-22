'use client'

import { create } from 'zustand'

import type { OrderResponse } from '@/lib/types/order'

interface ActiveDeliveryState {
  activeDelivery: OrderResponse | null
  setActiveDelivery: (order: OrderResponse | null) => void
  clearActiveDelivery: () => void
}

export const useActiveDeliveryStore = create<ActiveDeliveryState>()((set) => ({
  activeDelivery: null,

  setActiveDelivery: (order) => {
    set({ activeDelivery: order })
  },

  clearActiveDelivery: () => {
    set({ activeDelivery: null })
  },
}))

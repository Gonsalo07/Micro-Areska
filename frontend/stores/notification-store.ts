import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AppNotification {
  id: string
  type: 'delivery' | 'order'
  orderId: number
  label: string
  message: string
  read: boolean
  createdAt: string
}

interface NotificationStore {
  notifications: AppNotification[]
  add: (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void
  markAllRead: () => void
  markRead: (id: string) => void
  clear: () => void
  unreadCount: () => number
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],

      add: (n) =>
        set((state) => ({
          notifications: [
            {
              ...n,
              id: `${Date.now()}-${Math.random()}`,
              read: false,
              createdAt: new Date().toISOString(),
            },
            // Mantener solo las últimas 20
            ...state.notifications.slice(0, 19),
          ],
        })),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      clear: () => set({ notifications: [] }),

      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: 'areska-notifications' }
  )
)

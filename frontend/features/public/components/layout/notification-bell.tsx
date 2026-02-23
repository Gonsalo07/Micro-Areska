'use client'

import { useState } from 'react'

import { Bell, Package, Truck } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useNotificationStore } from '@/stores/notification-store'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const notifications = useNotificationStore((s) => s.notifications)
  const unreadCount = useNotificationStore((s) => s.unreadCount)()
  const markAllRead = useNotificationStore((s) => s.markAllRead)
  const clear = useNotificationStore((s) => s.clear)

  const handleOpen = (value: boolean) => {
    setOpen(value)
    if (value && unreadCount > 0) {
      // Marcar como leídas al abrir
      setTimeout(markAllRead, 1500)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 min-w-5 rounded-full px-1 tabular-nums text-[10px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={4}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-semibold text-sm">Notificaciones</span>
          {notifications.length > 0 && (
            <button
              onClick={clear}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Limpiar todo
            </button>
          )}
        </div>

        {/* Lista */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">Sin notificaciones</p>
            </div>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={`/seguimiento/${n.orderId}`}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 text-sm hover:bg-muted/50 transition-colors border-b last:border-0',
                  !n.read && 'bg-indigo-50/50 dark:bg-indigo-950/20'
                )}
              >
                <div
                  className={cn(
                    'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                    n.type === 'delivery'
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'
                      : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                  )}
                >
                  {n.type === 'delivery' ? (
                    <Truck className="h-3.5 w-3.5" />
                  ) : (
                    <Package className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    Pedido #{n.orderId} — {n.label}
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-muted-foreground text-[10px] mt-1">
                    {new Date(n.createdAt).toLocaleTimeString('es-PE', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />}
              </Link>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

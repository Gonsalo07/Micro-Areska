'use client'

import { Spinner, Tooltip } from '@nextui-org/react'
import { Wifi, WifiOff } from 'lucide-react'
import { useState } from 'react'

import { deliveryDriverApi } from '@/features/delivery/api/delivery-driver'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { cn } from '@/lib/utils'

type AvailabilityToggleProps = {
  className?: string
  showLabel?: boolean
  fullWidth?: boolean
  tooltipPlacement?: 'top' | 'bottom'
  variant?: 'default' | 'icon'
  offlineLabel?: string
}

export const AvailabilityToggle = ({
  className,
  showLabel = false,
  fullWidth = false,
  tooltipPlacement = 'bottom',
  variant = 'default',
  offlineLabel = 'Offline',
}: AvailabilityToggleProps) => {
  const { driver, _setDriver } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const isAvailable = driver?.isAvailable ?? false

  const handleToggle = async () => {
    if (!driver?.id || loading) return
    setLoading(true)
    try {
      const updated = await deliveryDriverApi.updateAvailability(
        driver.id,
        !isAvailable
      )
      _setDriver(updated)
    } catch (err) {
      console.error('Error actualizando disponibilidad:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tooltip
      content={isAvailable ? 'En línea · clic para desconectarte' : 'Offline · clic para conectarte'}
      placement={tooltipPlacement}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading || !driver}
        aria-label={isAvailable ? 'En línea' : offlineLabel}
        className={cn(
          variant === 'icon'
            ? 'inline-flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-md px-1.5 py-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-default-100'
            : 'inline-flex h-8 shrink-0 items-center gap-1 rounded-md px-2 text-[11px] font-medium leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-50',
          variant === 'icon'
            ? isAvailable
              ? 'text-success hover:text-success'
              : 'text-default-400 hover:text-default-500'
            : isAvailable
              ? 'bg-success/10 text-success hover:bg-success/15'
              : 'bg-default-100 text-default-500 hover:bg-default-200/80',
          fullWidth && variant !== 'icon' && 'w-full justify-center',
          className
        )}
      >
        {loading ? (
          <Spinner
            size="sm"
            classNames={{ wrapper: variant === 'icon' ? 'h-4 w-4' : 'h-3.5 w-3.5' }}
          />
        ) : variant === 'icon' ? (
          <Wifi
            size={16}
            className={cn('shrink-0', isAvailable ? 'text-success' : 'text-default-400')}
            strokeWidth={1.75}
          />
        ) : isAvailable ? (
          <Wifi size={14} className="shrink-0" strokeWidth={2} />
        ) : (
          <WifiOff size={14} className="shrink-0" strokeWidth={2} />
        )}
        {variant === 'icon' ? (
          <span
            className={cn(
              'text-[8px] font-semibold leading-none tracking-wide',
              isAvailable ? 'text-success' : 'text-default-400'
            )}
          >
            {isAvailable ? 'online' : 'offline'}
          </span>
        ) : (
          <span className={showLabel ? 'inline' : 'hidden lg:inline'}>
            {isAvailable ? 'En línea' : offlineLabel}
          </span>
        )}
      </button>
    </Tooltip>
  )
}

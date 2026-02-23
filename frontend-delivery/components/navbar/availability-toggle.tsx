'use client'

import { Switch, Tooltip } from '@nextui-org/react'
import React, { useState } from 'react'

import { deliveryDriverApi } from '@/features/delivery/api/delivery-driver'
import { useAuthStore } from '@/features/auth/stores/auth.store'

export const AvailabilityToggle = () => {
  const { driver, _setDriver } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const isAvailable = driver?.isAvailable ?? false

  const handleToggle = async (checked: boolean) => {
    if (!driver?.id) return
    setLoading(true)
    try {
      const updated = await deliveryDriverApi.updateAvailability(driver.id, checked)
      _setDriver(updated)
    } catch (err) {
      console.error('Error actualizando disponibilidad:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tooltip
      content={isAvailable ? 'Estás en línea' : 'Estás fuera de línea'}
      color={isAvailable ? 'success' : 'default'}
    >
      <div className='flex items-center gap-2'>
        <span
          className={`hidden sm:inline-block text-xs font-semibold ${
            isAvailable ? 'text-success' : 'text-default-400'
          }`}
        >
          {isAvailable ? 'En línea' : 'Fuera de línea'}
        </span>
        <Switch
          isSelected={isAvailable}
          isDisabled={loading || !driver}
          onValueChange={handleToggle}
          size='sm'
          color='success'
          aria-label='Disponibilidad'
          classNames={{
            wrapper: loading ? 'opacity-60' : '',
          }}
        />
        {/* Punto indicador animado */}
        <span
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
            isAvailable ? 'bg-success animate-pulse' : 'bg-default-300'
          }`}
        />
      </div>
    </Tooltip>
  )
}

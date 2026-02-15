'use client'

import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/stores/cart-store'

export function CartCount() {
  const itemCount = useCartStore((state) => state.getItemCount())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || itemCount === 0) {
    return null
  }

  return (
    <Badge
      variant="destructive"
      className="bg-destructive absolute -top-2.5 -right-2.5 h-5 min-w-5 rounded-full px-1 tabular-nums"
    >
      {itemCount}
    </Badge>
  )
}

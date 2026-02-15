'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'

import { ProductList } from '@public/schemas/product-list-schema'

import { Badge } from '@/components/ui/badge'

interface ProductCardProps {
  product: ProductList
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border shadow-sm">
      <div className="relative aspect-square overflow-hidden">
        {product.badge && <Badge className="absolute top-3 left-3 z-10">{product.badge}</Badge>}
        <button className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-card opacity-0 transition-opacity group-hover:opacity-100">
          <Heart className="size-4 text-muted-foreground" />
        </button>
        <Link href={`/productos/${product.id}`}>
          <img
            src={product.mainImage || '/images/placeholder.svg'}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="p-4 border-t">
        <Link href={`/productos/${product.id}`}>
          <h3 className="mb-2 line-clamp-2">{product.name}</h3>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm line-through text-muted-foreground">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

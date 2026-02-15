'use client'

import { useEffect, useState } from 'react'

import { ProductCard } from '@public/pages/products/detail/product-card'
import { ProductCardSkeleton } from '@public/pages/products/detail/product-card-skeleton'
import { ProductList } from '@public/schemas/product-list-schema'

import { productsApi } from '@/lib/api/products'

export function FeaturedProducts() {
  const [products, setProducts] = useState<ProductList[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await productsApi.getAll()
        setProducts(data.slice(0, 9))
      } catch (err) {
        console.error('Error fetching featured products:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar los productos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">Productos destacados</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Descubre nuestros artículos más populares, cuidadosamente seleccionados por su calidad
            excepcional y satisfacción del cliente.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No hay productos destacados disponibles.</p>
          </div>
        )}
      </div>
    </section>
  )
}

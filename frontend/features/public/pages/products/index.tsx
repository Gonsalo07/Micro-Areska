'use client'

import { useEffect, useState } from 'react'

import { ArrowUpDown, Filter } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { ProductCard } from '@public/pages/products/detail/product-card'
import { ProductList } from '@public/schemas/product-list-schema'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { productsApi } from '@/lib/api/products'

import { ProductsSkeleton } from './products-skeleton'

export function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [priceRange, setPriceRange] = useState('todos')
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<ProductList[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await productsApi.getAll()
        setProducts(data)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar los productos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const categoriaParam = searchParams.get('categoria')
    const rangoParam = searchParams.get('rango')

    if (categoriaParam) {
      setSelectedCategory(categoriaParam)
    } else {
      setSelectedCategory('todos')
    }

    if (rangoParam) {
      setPriceRange(rangoParam)
    } else {
      setPriceRange('todos')
    }
  }, [searchParams])

  const updateURL = (categoria: string, rango: string) => {
    const params = new URLSearchParams()

    if (categoria !== 'todos') {
      params.set('categoria', categoria)
    }
    if (rango !== 'todos') {
      params.set('rango', rango)
    }

    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : window.location.pathname
    router.push(newUrl, { scroll: false })
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    updateURL(value, priceRange)
  }

  const handlePriceRangeChange = (value: string) => {
    setPriceRange(value)
    updateURL(selectedCategory, value)
  }

  const categories = {
    todos: 'Todos los productos',
    perifericos: 'Periféricos',
    audio: 'Audio',
    monitores: 'Monitores',
    streaming: 'Streaming',
    muebles: 'Muebles gaming',
    iluminacion: 'Iluminación',
    accesorios: 'Accesorios',
  } as const

  const filteredProducts = products
    .filter((product) => {
      if (selectedCategory === 'todos') return true
      const categoryName = categories[selectedCategory as keyof typeof categories]
      return product.category.name === categoryName
    })
    .filter((product) => {
      if (priceRange === 'todos') return true
      if (priceRange === 'menos-50') return product.price < 50
      if (priceRange === '50-100') return product.price >= 50 && product.price <= 100
      if (priceRange === '100-200') return product.price >= 100 && product.price <= 200
      if (priceRange === 'mas-200') return product.price > 200
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return 0
    })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Loading State */}
      {isLoading ? (
        <ProductsSkeleton />
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <div className="mb-4 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                <Filter />
                Filtros
              </Button>
            </div>

            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Category Filter */}
              <div>
                <h3 className="mb-3 text-xs tracking-widest uppercase text-muted-foreground">
                  Categoría
                </h3>
                <RadioGroup
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                  className="space-y-2"
                >
                  {(Object.keys(categories) as Array<keyof typeof categories>).map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <RadioGroupItem value={category} id={`category-${category}`} />
                      <Label htmlFor={`category-${category}`}>{categories[category]}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="mb-3 text-xs tracking-widest uppercase text-muted-foreground">
                  Rango de precios
                </h3>
                <RadioGroup
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                  className="space-y-2"
                >
                  {[
                    { value: 'todos', label: 'Todos los precios' },
                    { value: 'menos-50', label: 'Menos de $50' },
                    { value: '50-100', label: '$50 - $100' },
                    { value: '100-200', label: '$100 - $200' },
                    { value: 'mas-200', label: 'Más de $200' },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`price-${option.value}`} />
                      <Label htmlFor={`price-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Error State */}
            {error && (
              <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center items-start justify-between">
              <h1 className="text-2xl font-bold">Productos ({filteredProducts.length})</h1>
              <div className="min-w-56 space-y-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="relative w-full pl-9">
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 group-has-[select[disabled]]:opacity-50">
                      <ArrowUpDown size={16} aria-hidden="true" />
                    </div>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Destacados</SelectItem>
                    <SelectItem value="newest">Más nuevos</SelectItem>
                    <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                    <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No se encontraron productos que coincidan con tus criterios.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'

import { Heart, Minus, Plus, RotateCcw, ShoppingCart, Truck } from 'lucide-react'

import { ProductDetail } from '@public/schemas/product-detail-schema'
import { ProductList } from '@public/schemas/product-list-schema'

import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'

import { ProductCard } from './product-card'

type Props = { product: ProductDetail; relatedProducts: ProductList[] }

export function ProductDetailPage({ product, relatedProducts }: Props) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0])
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        Producto no encontrado
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.imageUrl || product.mainImage,
      quantity: quantity,
    })
  }

  const productImages = product.images?.map((img) => img.imageUrl) || [
    product.mainImage,
    product.mainImage,
    product.mainImage,
    product.mainImage,
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-xl border">
            <img
              src={productImages[selectedImage] || '/images/placeholder.svg'}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-lg border-1 cursor-pointer ${
                  selectedImage === index ? 'border-primary' : 'border'
                }`}
              >
                <img
                  src={image || '/images/placeholder.svg'}
                  alt={`${product.name} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="mb-2 text-3xl font-semibold">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="mb-3 font-semibold">Color</h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`size-10 rounded-full border-2 cursor-pointer ${
                      selectedColor?.name === color.name ? 'border-primary border-3' : ''
                    }`}
                    style={{ backgroundColor: color.hexValue }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="mb-3 font-semibold">Cantidad</h3>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus />
              </Button>
              <span className="w-5 text-center font-semibold">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button onClick={handleAddToCart} size="lg">
              <ShoppingCart />
              Agregar al carrito
            </Button>
            <Button variant="outline" size="lg">
              <Heart />
              Agregar a favoritos
            </Button>
          </div>

          {/* Shipping Info */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center space-x-3">
              <Truck className="text-primary h-5 w-5" />
              <div>
                <p className="font-medium">Envío gratis</p>
                <p className="text-muted-foreground text-sm">En pedidos mayores a $100</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <RotateCcw className="text-primary h-5 w-5" />
              <div>
                <p className="font-medium">Devoluciones de 30 días</p>
                <p className="text-muted-foreground text-sm">
                  Devoluciones gratis dentro de 30 días
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="mb-3 font-semibold">Características principales</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="bg-primary h-2 w-2 rounded-full" />
                    <span className="text-muted-foreground">{feature.featureText}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 text-2xl font-semibold">Productos relacionados</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

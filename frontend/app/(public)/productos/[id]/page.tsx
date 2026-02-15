import { ProductDetailPage } from '@public/pages/products/detail'

import { productsApi } from '@/lib/api/products'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const product = await productsApi.getById(Number(id))

    const allProducts = await productsApi.getAll()
    const relatedProducts = allProducts
      .filter((p) => p.id !== product.id && p.category.name === product.category.name)
      .slice(0, 3)

    return <ProductDetailPage product={product} relatedProducts={relatedProducts} />
  } catch (error) {
    console.error('Error loading product:', error)
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold">Producto no encontrado</h1>
        <p className="text-muted-foreground">
          El producto que buscas no existe o no está disponible.
        </p>
      </div>
    )
  }
}

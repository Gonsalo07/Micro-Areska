import { productsApi } from '@public/api/products'
import { ProductDetailPage } from '@public/pages/products/detail'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let product: Awaited<ReturnType<typeof productsApi.getById>> | null = null
  let relatedProducts: Awaited<ReturnType<typeof productsApi.getAll>> = []

  try {
    product = await productsApi.getById(Number(id))

    const allProducts = await productsApi.getAll()
    relatedProducts = allProducts
      .filter((p) => p.id !== product!.id && p.category.name === product!.category.name)
      .slice(0, 3)
  } catch (error) {
    console.error('Error loading product:', error)
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold">Producto no encontrado</h1>
        <p className="text-muted-foreground">
          El producto que buscas no existe o no está disponible.
        </p>
      </div>
    )
  }

  return <ProductDetailPage product={product} relatedProducts={relatedProducts} />
}

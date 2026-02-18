export interface ProductList {
  id: number
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  mainImage: string
  stock: number
  badge: string | null
  category: {
    id: number
    name: string
  } | null
  createdAt: string
  updatedAt: string | null
}

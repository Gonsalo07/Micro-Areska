const columnLabelsByResource = {
  products: {
    id: 'ID',
    name: 'Nombre',
    category: 'Categoría',
    price: 'Precio',
    originalPrice: 'Precio anterior',
    stock: 'Stock',
    mainImage: 'Imagen',
    badge: 'Etiqueta',
    createdAt: 'Creado',
  },
  categories: {
    id: 'ID',
    name: 'Nombre',
    slug: 'Slug',
    description: 'Descripción',
    productCount: 'Productos',
    createdAt: 'Creado',
  },
  orders: {
    id: 'ID',
    code: 'Pedido',
    user: 'Cliente',
    total: 'Total',
    status: 'Estado',
    itemCount: 'Productos',
    createdAt: 'Creado',
  },
  users: {
    id: 'ID',
    fullName: 'Nombre',
    email: 'Correo',
    phone: 'Teléfono',
    authProvider: 'Proveedor',
    createdAt: 'Creado',
  },
}

export type Resource = keyof typeof columnLabelsByResource

export { columnLabelsByResource }

export function getColumnLabel(resource: string | undefined, columnId: string): string {
  if (!resource) return columnId
  return (
    (columnLabelsByResource as Record<string, Record<string, string>>)[resource]?.[columnId] ??
    columnId
  )
}

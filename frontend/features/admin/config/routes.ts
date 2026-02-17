import { Box, LayoutDashboard, Settings, ShoppingCart, Tags, Truck, Users } from 'lucide-react'

export const sidebarGroups = ['principal', 'ventas', 'sistema'] as const

export type SidebarGroup = (typeof sidebarGroups)[number]

export type AdminRoute = {
  title: string
  sidebar?: {
    icon: React.ElementType
    group: SidebarGroup
  }
  resource?: string
}

export const adminRoutes = {
  '/admin': {
    title: 'Dashboard',
    sidebar: { icon: LayoutDashboard, group: 'principal' },
  },
  '/admin/productos': {
    title: 'Productos',
    sidebar: { icon: Box, group: 'principal' },
    resource: 'products',
  },
  '/admin/categorias': {
    title: 'Categorias',
    sidebar: { icon: Tags, group: 'principal' },
    resource: 'categories',
  },
  '/admin/pedidos': {
    title: 'Pedidos',
    sidebar: { icon: ShoppingCart, group: 'ventas' },
    resource: 'orders',
  },
  '/admin/entregas': {
    title: 'Entregas',
    sidebar: { icon: Truck, group: 'ventas' },
  },
  '/admin/usuarios': {
    title: 'Usuarios',
    sidebar: { icon: Users, group: 'sistema' },
    resource: 'users',
  },
  '/admin/ajustes': {
    title: 'Ajustes',
    sidebar: { icon: Settings, group: 'sistema' },
  },
} as const satisfies Record<string, AdminRoute>

export type AdminUrl = keyof typeof adminRoutes

export function getRoute(pathname: string): AdminRoute | undefined {
  return adminRoutes[pathname as AdminUrl]
}

export const groupTitles: Record<SidebarGroup, string> = {
  principal: 'Principal',
  ventas: 'Ventas',
  sistema: 'Sistema',
}

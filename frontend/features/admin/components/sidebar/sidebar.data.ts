import { Box, LayoutDashboard, Settings, ShoppingCart, Tags, Truck, Users } from 'lucide-react'

export const sidebarData = {
  navGroups: [
    {
      title: 'Principal',
      items: [
        { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
        { title: 'Productos', url: '/admin/productos', icon: Box },
        { title: 'Categorias', url: '/admin/categorias', icon: Tags },
      ],
    },
    {
      title: 'Ventas',
      items: [
        { title: 'Pedidos', url: '/admin/pedidos', icon: ShoppingCart },
        { title: 'Entregas', url: '/admin/entregas', icon: Truck },
      ],
    },
    {
      title: 'Sistema',
      items: [
        { title: 'Usuarios', url: '/admin/usuarios', icon: Users },
        { title: 'Ajustes', url: '/admin/ajustes', icon: Settings },
      ],
    },
  ],
}

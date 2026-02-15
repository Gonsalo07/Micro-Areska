'use client'

import React from 'react'

import Link from 'next/link'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

const categories = [
  {
    name: 'Periféricos',
    slug: 'perifericos',
    description: 'Teclados, ratones y accesorios gaming de alta precisión',
  },
  {
    name: 'Audio',
    slug: 'audio',
    description: 'Auriculares y sistemas de sonido envolvente',
  },
  {
    name: 'Monitores',
    slug: 'monitores',
    description: 'Pantallas de alto rendimiento con tasas de refresco elevadas',
  },
  {
    name: 'Streaming',
    slug: 'streaming',
    description: 'Equipamiento profesional para creadores de contenido',
  },
  {
    name: 'Muebles gaming',
    slug: 'muebles',
    description: 'Sillas y escritorios ergonómicos para largas sesiones',
  },
  {
    name: 'Iluminación',
    slug: 'iluminacion',
    description: 'Iluminación RGB y ambientes personalizables',
  },
  {
    name: 'Accesorios',
    slug: 'accesorios',
    description: 'Complementos esenciales para tu setup gaming',
  },
] as const

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="mb-1 text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

export function Navigation() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Tienda</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3 overflow-hidden rounded-md">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full flex-col justify-end bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 no-underline outline-hidden select-none focus:shadow-md"
                    href="/productos"
                  >
                    <div className="bg-foreground/30 space-y-2 p-4 text-primary-foreground backdrop-blur-md rounded-md">
                      <div className="font-medium">Nuevos lanzamientos</div>
                      <p className="text-sm leading-tight">
                        Descubre lo último en periféricos gaming de alta gama.
                      </p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/productos?destacados=true" title="Más vendidos">
                Los productos favoritos de nuestra comunidad gamer.
              </ListItem>
              <ListItem href="/productos?oferta=true" title="Ofertas especiales">
                Equipamiento premium con descuentos exclusivos.
              </ListItem>
              <ListItem href="/productos?nuevo=true" title="Recién llegados">
                Las últimas novedades en tecnología gaming.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Categorías</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:grid-cols-2 lg:w-[550px]">
              {categories.map((category) => (
                <ListItem
                  key={category.name}
                  title={category.name}
                  href={`/productos?categoria=${category.slug}`}
                >
                  {category.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Soporte</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/envios">
                    <span className="font-medium">Envíos y entregas</span>
                    <span className="text-muted-foreground">
                      Información sobre tiempos y costos de envío.
                    </span>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/devoluciones">
                    <span className="font-medium">Devoluciones y garantía</span>
                    <span className="text-muted-foreground">
                      Política de devoluciones y servicio técnico.
                    </span>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/contacto">
                    <span className="font-medium">Contacto</span>
                    <span className="text-muted-foreground">
                      ¿Necesitas ayuda? Estamos aquí para ti.
                    </span>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

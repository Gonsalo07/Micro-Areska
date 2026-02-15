import { Bell, Mail } from 'lucide-react'
import Link from 'next/link'

import { Logo } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

const quickLinks = [
  { href: '/sobre-nosotros', label: 'Sobre nosotros' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/envios', label: 'Información de envíos' },
]

const legalLinks = [
  { href: '/privacidad', label: 'Política de privacidad' },
  { href: '/terminos', label: 'Términos del servicio' },
  { href: '/devoluciones', label: 'Devoluciones' },
]

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 border-b">
          <div className="col-span-1 md:col-span-2">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <Logo width={32} height={32} />
                <span className="font-medium">Areska</span>
              </Link>
              <p className="mb-6 max-w-md text-muted-foreground">
                Descubre productos premium con calidad excepcional y diseño moderno. Tu satisfacción
                es nuestra prioridad.
              </p>
            </div>

            {/* Newsletter */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm">Suscríbete a nuestro boletín</h3>
              <div className="flex space-x-2">
                <InputGroup>
                  <InputGroupInput type="email" placeholder="Ingresa tu correo electrónico" />
                  <InputGroupAddon>
                    <Mail />
                  </InputGroupAddon>
                </InputGroup>
                <Button variant="secondary">
                  <Bell />
                  Suscribirse
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-md">Enlaces rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-md">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Areska. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

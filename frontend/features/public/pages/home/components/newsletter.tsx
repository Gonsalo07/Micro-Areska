import { Bell, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

export function Newsletter() {
  return (
    <section className="py-16 border-t">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-2xl font-bold md:text-3xl">Mantente actualizado</h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Suscríbete a nuestro boletín y sé el primero en conocer nuevos productos, ofertas
          exclusivas y promociones especiales.
        </p>

        <div className="mx-auto max-w-md">
          <div className="flex flex-col gap-4 sm:flex-row">
            <InputGroup className="flex-1">
              <InputGroupInput type="email" placeholder="Ingresa tu correo electrónico" />
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>
            </InputGroup>
            <Button variant="secondary" className="whitespace-nowrap">
              <Bell />
              Suscribirse
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Respetamos tu privacidad. Cancela tu suscripción en cualquier momento.
          </p>
        </div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface CheckoutSuccessPageProps {
  code?: string
}

export function CheckoutSuccessPage({ code }: CheckoutSuccessPageProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 text-center">
      <h1 className="text-3xl font-bold mb-2">¡Pago registrado!</h1>
      <p className="text-muted-foreground">
        Hemos recibido tu pedido{' '}
        {code ? (
          <>
            <br />
            <span className="font-mono">{code}</span>
          </>
        ) : null}
        . Te avisaremos cuando validemos el pago.
      </p>

      <div className="mt-8 flex gap-3 justify-center">
        <Button asChild>
          <Link href="/tienda">Volver a la tienda</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/mis-compras">Ver mis compras</Link>
        </Button>
      </div>
    </div>
  )
}

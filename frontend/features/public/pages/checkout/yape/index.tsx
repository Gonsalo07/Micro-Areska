'use client'

import { useEffect, useMemo, useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { ordersApi } from '@/lib/api/orders'
import { usersApi } from '@/lib/api/users'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'

const supportEmail = 'ventasweb@areskastore.com'

const mapItemsForApi = (items: any[]) =>
  items.map((it: any) => ({
    productId: it.id,
    quantity: it.quantity,
    unitPrice: it.price,
    priceTotal: it.price * it.quantity,
  }))

export function YapePage() {
  const { clearCart } = useCartStore()
  const [data, setData] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const { user } = useAuthStore()
  const router = useRouter()
  const [remaining, setRemaining] = useState(300)

  useEffect(() => {
    const raw = sessionStorage.getItem('checkout-data')
    if (raw) setData(JSON.parse(raw))
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          clearInterval(id)
          Promise.resolve().then(() => router.push('/productos'))
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [router])

  const mmss = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(
    remaining % 60
  ).padStart(2, '0')}`

  const mailto = useMemo(() => {
    if (!data) return '#'
    const subject = encodeURIComponent(`${data.orderCode} - ${data.firstName} ${data.lastName}`)
    const body = encodeURIComponent(
      [
        'Hola buenas, adjunto la captura del yapeo.',
        '',
        `Pedido: ${data.orderCode}`,
        `Nombre: ${data.firstName} ${data.lastName}`,
        `Monto: S/${Number(data.total).toFixed(2)}`,
        '',
        'Gracias.',
      ].join('\n')
    )
    return `mailto:${supportEmail}?subject=${subject}&body=${body}`
  }, [data])

  async function handleConfirm() {
    if (!data) return

    setSaving(true)
    try {
      const userProfile = await usersApi.getByFirebaseUid(user!.firebaseUid)

      if (!userProfile || !userProfile.id) {
        throw new Error('Error: No se encontró el ID del usuario.')
      }

      const realUserId = userProfile.id

      await ordersApi.createOrder({
        status: 'pending',
        total: data.total,
        pickupMethod: 'shipping',
        orderCode: data.orderCode,
        userId: realUserId,
        firebaseUid: user?.firebaseUid,
        customer: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          dni: data.dni,
          docType: data.docType,
          docNumber: data.docNumber,
          firebaseUid: user?.firebaseUid,
        },
        items: mapItemsForApi(data.items || []),
      })
      clearCart()
      setSaved(true)

      router.push(`/pago/registrado?code=${encodeURIComponent(data.orderCode ?? '')}`)
    } catch (e) {
      console.error(e)

      if (data && data.orderCode) {
        clearCart()
        setSaved(true)
        router.push(`/pago/registrado?code=${encodeURIComponent(data.orderCode ?? '')}`)
        return
      }
    } finally {
      setSaving(false)
    }
  }

  if (!data) return null

  const { orderCode, total, firstName, lastName } = data

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-2xl border bg-card shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total a pagar</p>
            <p className="text-2xl font-semibold">S/ {Number(total).toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Número de pedido</p>
            <p className="font-mono">{orderCode}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:items-stretch">
          <div className="relative w-full md:h-full aspect-[3/4]">
            <Image
              src="/images/yape/yapeQRandy.jpg"
              alt="Pago con Yape - QR"
              fill
              className="rounded-xl border object-cover md:object-contain"
              priority
            />
          </div>

          <div className="space-y-3 text-sm md:self-stretch">
            <p className="font-medium">Paga con Yape</p>
            <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
              <li>
                Abre tu app <b>Yape</b>.
              </li>
              <li>
                Escanea el código QR y verifica el <b>monto</b>.
              </li>
              <li>
                En el mensaje/referencia coloca: <span className="font-mono">{orderCode}</span>.
              </li>
              <li>
                Envía la <b>captura</b> a{' '}
                <a href={mailto} className="underline">
                  {supportEmail}
                </a>{' '}
                con el asunto:{' '}
                <b>
                  {orderCode} - {firstName} {lastName}
                </b>
                .
              </li>
            </ol>

            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground">
                * Tu pedido quedará en <b>verificación de pago</b>. Te avisaremos cuando se valide.
              </p>
            </div>
            <Button
              asChild
              className="mt-2 w-full md:w-auto bg-foreground text-background hover:opacity-90"
            >
              <a href={mailto}>Abrir correo con asunto</a>
            </Button>

            <div className="rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm px-3 py-2">
              Tienes <b>{mmss}</b> para completar el pago con Yape y confirmar la compra. Al
              finalizar el tiempo te enviaremos a la página principal.
            </div>
          </div>
        </div>

        <div className="flex">
          <Button
            onClick={handleConfirm}
            disabled={saving || saved || !data?.items?.length}
            className="w-full"
          >
            {saved ? 'Pedido registrado' : saving ? 'Registrando...' : 'Confirmar pedido'}
          </Button>
        </div>
      </div>
    </div>
  )
}

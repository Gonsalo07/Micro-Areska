'use client'

import { useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { type FieldPath, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/stores/cart-store'

const schema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'El correo electrónico es requerido' })
      .email({ message: 'Por favor, ingresa un correo electrónico válido' }),
    firstName: z.string().min(1, { message: 'El nombre es requerido' }),
    lastName: z.string().min(1, { message: 'El apellido es requerido' }),

    dni: z.string().regex(/^\d{8}$/, { message: 'DNI = 8 dígitos' }),

    address: z.string().min(1, { message: 'La dirección es requerida' }),
    city: z.string().min(1, { message: 'El departamento es requerido' }),
    state: z.string().min(1, { message: 'La provincia es requerida' }),
    zipCode: z.string().min(5, { message: 'El código postal debe tener al menos 5 caracteres' }),

    docType: z.enum(['boleta', 'factura']),
    docNumber: z.string().min(1, { message: 'Ingresa DNI o RUC' }),

    paymentMethod: z.enum(['yape', 'card']).default('yape'),
  })
  .refine(
    (d) =>
      (d.docType === 'boleta' && /^\d{8}$/.test(d.docNumber)) ||
      (d.docType === 'factura' && /^\d{11}$/.test(d.docNumber)),
    { message: 'DNI = 8 dígitos, RUC = 11 dígitos', path: ['docNumber'] }
  )

type FormInput = z.input<typeof schema>
type FormOutput = z.output<typeof schema>

export function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal } = useCartStore()
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const subtotal = getTotal()
  const shipping = subtotal >= 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const orderCode = useMemo(() => {
    const d = new Date()
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
      d.getDate()
    ).padStart(2, '0')}`
    const rnd = Math.floor(1000 + Math.random() * 9000)
    return `ARES-${ymd}-${rnd}`
  }, [])

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      dni: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      docType: 'boleta',
      docNumber: '',
      paymentMethod: 'yape',
    },
    mode: 'onTouched',
  })

  const step1: Readonly<FieldPath<FormInput>[]> = ['email', 'firstName', 'lastName', 'dni']
  const step2: Readonly<FieldPath<FormInput>[]> = ['address', 'city', 'state', 'zipCode']
  const step3: Readonly<FieldPath<FormInput>[]> = ['docType', 'docNumber', 'paymentMethod']
  const fieldsByStep: Record<1 | 2 | 3, Readonly<FieldPath<FormInput>[]>> = {
    1: step1,
    2: step2,
    3: step3,
  }

  async function nextStep() {
    const ok = await form.trigger(fieldsByStep[step])
    if (!ok) return
    if (step < 3) {
      setStep((s) => (s + 1) as 1 | 2 | 3)
    } else {
      const data = form.getValues()
      sessionStorage.setItem(
        'checkout-data',
        JSON.stringify({
          ...data,
          orderCode,
          total,
          shipping,
          tax,
          subtotal,
          items,
        })
      )
      router.push('/pago/yape')
    }
  }

  function backStep() {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Proceso de pago</h1>

      <div className="mb-6 flex items-center gap-3 text-sm">
        {[1, 2, 3].map((n) => (
          <div key={n} className={`flex items-center gap-2 ${step === n ? 'font-semibold' : ''}`}>
            <div
              className={`size-6 rounded-full flex items-center justify-center ${
                step >= n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {n}
            </div>
            <span>{n === 1 ? 'Identificación' : n === 2 ? 'Envío' : 'Pago'}</span>
            {n < 3 && <span className="mx-2 text-muted-foreground">›</span>}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void nextStep()
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          <div className="space-y-6">
            {step === 1 && (
              <>
                <h2 className="text-lg">1. Información de contacto</h2>
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel required>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                      </FormControl>
                      {fieldState.error && <FormMessage />}
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    name="firstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel required>Nombres</FormLabel>
                        <FormControl>
                          <Input placeholder="Ivan" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage />}
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="lastName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel required>Apellidos</FormLabel>
                        <FormControl>
                          <Input placeholder="Castro" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name="dni"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel required>DNI (8 dígitos)</FormLabel>
                      <FormControl>
                        <Input placeholder="12345678" maxLength={8} {...field} />
                      </FormControl>
                      {fieldState.error && <FormMessage />}
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-lg">2. Envío</h2>
                <FormField
                  name="address"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel required>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Calle y número" {...field} />
                      </FormControl>
                      {fieldState.error && <FormMessage />}
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    name="city"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel required>Departamento</FormLabel>
                        <FormControl>
                          <Input placeholder="Departamento" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage />}
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="state"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel required>Provincia</FormLabel>
                        <FormControl>
                          <Input placeholder="Provincia" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage />}
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="zipCode"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel required>Código postal</FormLabel>
                        <FormControl>
                          <Input placeholder="Código Postal" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-lg">3. Documento y pago</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    name="docType"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de comprobante</FormLabel>
                        <div className="flex gap-3">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              value="boleta"
                              checked={field.value === 'boleta'}
                              onChange={(e) => field.onChange(e.target.value)}
                            />{' '}
                            Boleta
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              value="factura"
                              checked={field.value === 'factura'}
                              onChange={(e) => field.onChange(e.target.value)}
                            />{' '}
                            Factura
                          </label>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="docNumber"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>
                          {form.watch('docType') === 'factura'
                            ? 'RUC (11 dígitos)'
                            : 'DNI (8 dígitos)'}
                        </FormLabel>
                        <FormControl>
                          <Input
                            maxLength={form.watch('docType') === 'factura' ? 11 : 8}
                            {...field}
                          />
                        </FormControl>
                        {fieldState.error && <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name="paymentMethod"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Método de pago</FormLabel>
                      <div className="space-y-3">
                        <label
                          className={`flex items-center justify-between rounded-lg border p-4 ${field.value === 'yape' ? 'ring-2 ring-primary' : ''}`}
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="yape"
                              checked={field.value === 'yape'}
                              onChange={(e) => field.onChange(e.target.value)}
                            />{' '}
                            Yape
                          </span>
                          <span className="font-medium">S/ {total.toFixed(2)}</span>
                        </label>
                        <label className="flex items-center justify-between rounded-lg border p-4 opacity-60">
                          <span className="flex items-center gap-2">
                            <input type="radio" disabled /> Tarjeta (pronto)
                          </span>
                          <span className="font-medium">S/ {total.toFixed(2)}</span>
                        </label>
                      </div>
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex gap-3">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={backStep}>
                  Atrás
                </Button>
              )}
              <Button type="submit">{step < 3 ? 'Continuar' : 'Ir al pago'}</Button>
            </div>
          </div>

          <Summary
            items={items}
            orderCode={orderCode}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
          />
        </form>
      </Form>
    </div>
  )
}

function Summary({
  items,
  orderCode,
  subtotal,
  shipping,
  tax,
  total,
}: {
  items: any[]
  orderCode: string
  subtotal: number
  shipping: number
  tax: number
  total: number
}) {
  return (
    <div className="rounded-xl bg-card border shadow-sm p-6 h-fit">
      <h2 className="mb-4 text-xl">Resumen del pedido</h2>
      <div className="space-y-4 mb-6">
        {items.map((it: any) => (
          <div key={it.id} className="flex items-center gap-4">
            <img
              src={it.image || '/images/placeholder.svg'}
              alt={it.name}
              className="h-16 w-16 rounded-lg object-cover border"
            />
            <div className="flex-1">
              <p className="font-medium">{it.name}</p>
              <p className="text-sm text-muted-foreground">Cantidad: {it.quantity}</p>
            </div>
            <p className="font-medium">S/ {(it.price * it.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>S/ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Envío</span>
          <span>{shipping === 0 ? 'Gratis' : `S/ ${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Impuestos</span>
          <span>S/ {tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t pt-2 text-lg font-semibold">
          <span>Total</span>
          <span>S/ {total.toFixed(2)}</span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          N° de pedido: <span className="font-mono">{orderCode}</span>
        </div>
      </div>
    </div>
  )
}

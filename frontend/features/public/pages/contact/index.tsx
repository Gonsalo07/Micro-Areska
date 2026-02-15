'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const contactSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.email('Por favor, ingresa un correo electrónico válido'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Por favor selecciona un asunto'),
  orderNumber: z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  newsletter: z.boolean(),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      orderNumber: '',
      message: '',
      newsletter: false,
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Formulario de contacto enviado:', data)
    }
    setIsSubmitted(true)
    form.reset()
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-lg border bg-card p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Send className="size-8" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">¡Mensaje enviado con éxito!</h2>
          <p className="mb-4 text-muted-foreground">
            Gracias por contactarnos. Te responderemos dentro de las próximas 24 horas.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="bg-transparent"
          >
            Enviar otro mensaje
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Contáctanos</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Nos encantaría saber de ti. Envíanos un mensaje y te responderemos lo antes posible.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="h-full rounded-xl border p-8 bg-card">
            <h2 className="mb-6 text-2xl font-semibold">Ponerse en contacto</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-muted flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                  <MapPin className="size-6" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Dirección</h3>
                  <p className="text-muted-foreground">
                    123 Calle Comercio
                    <br />
                    Ciudad Empresarial, BC 12345
                    <br />
                    Estados Unidos
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-muted flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                  <Phone className="size-6" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Teléfono</h3>
                  <p className="text-muted-foreground">
                    Principal: 1-800-STORE-01
                    <br />
                    Soporte: 1-800-STORE-02
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-muted flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                  <Mail className="size-6" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Correo electrónico</h3>
                  <p className="text-muted-foreground">
                    General: info@store.com
                    <br />
                    Soporte: support@store.com
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t pt-8">
              <h3 className="mb-4 font-semibold">Preguntas frecuentes</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium">Estado del pedido</h4>
                  <p className="text-muted-foreground text-sm">
                    Rastrea tu pedido desde el panel de tu cuenta.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Devoluciones</h4>
                  <p className="text-muted-foreground text-sm">
                    Política de devolución de 30 días en todos los artículos.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Envíos</h4>
                  <p className="text-muted-foreground text-sm">
                    Envío gratuito en pedidos superiores a $100.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-card p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">Envíanos un mensaje</h2>

            <Form {...form}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 items-start">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel required>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese un nombre" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage />}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel required>Apellido</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese un apellido" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 items-start">
                  <FormField
                    control={form.control}
                    name="email"
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

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 items-start">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel required>Asunto</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona un asunto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">Consulta general</SelectItem>
                            <SelectItem value="order">Soporte de pedido</SelectItem>
                            <SelectItem value="returns">Devoluciones y cambios</SelectItem>
                            <SelectItem value="technical">Soporte técnico</SelectItem>
                            <SelectItem value="billing">Consulta de facturación</SelectItem>
                            <SelectItem value="partnership">Consulta de colaboración</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.error && <FormMessage />}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="orderNumber"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Número de pedido (si aplica)</FormLabel>
                        <FormControl>
                          <Input placeholder="#12345" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel required>Mensaje</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe tu consulta en detalle..."
                          className="resize-none min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && <FormMessage />}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newsletter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Me gustaría recibir novedades sobre nuevos productos y promociones.
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
                  className="w-full"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                >
                  <Send />
                  {form.formState.isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-center text-2xl font-semibold">Visita nuestra tienda</h2>
        <div className="relative h-96 overflow-hidden rounded-xl bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="text-muted-foreground mb-2 text-lg font-semibold">Mapa interactivo</h3>
              <p className="text-muted-foreground">
                123 Calle Comercio, Ciudad Empresarial, BC 12345
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() =>
                  window.open(
                    'https://maps.google.com/?q=123+Commerce+Street+Business+City+BC+12345',
                    '_blank'
                  )
                }
              >
                Ver en Google Maps
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Phone className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Llámanos</h3>
          <p className="text-muted-foreground text-balance">
            Habla directamente con nuestro equipo de atención al cliente para recibir ayuda
            inmediata.
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Mail className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Soporte por correo electrónico</h3>
          <p className="text-muted-foreground text-balance">
            Envíanos un correo y te responderemos dentro de 24 horas en días hábiles.
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Visítanos en tienda</h3>
          <p className="text-muted-foreground text-balance">
            Ven a nuestra ubicación física para conocer nuestros productos en persona.
          </p>
        </div>
      </div>
    </div>
  )
}

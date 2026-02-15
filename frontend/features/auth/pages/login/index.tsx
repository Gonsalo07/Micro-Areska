'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldSeparator } from '@/components/ui/field'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

const loginSchema = z.object({
  email: z.email({ message: 'Correo electrónico inválido' }).trim(),
  password: z.string().trim().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()
  const { login, isLoading, loginWithGoogle, init } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    init()
  }, [init])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setError(null)
    try {
      await login(data.email, data.password)
      router.push('/')
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo iniciar sesión')
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido de nuevo</CardTitle>
          <CardDescription>Inicia sesión con Google o con tu correo</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={async () => {
                      setError(null)
                      try {
                        await loginWithGoogle()
                        router.push('/')
                      } catch (e: any) {
                        setError(e?.message ?? 'No se pudo iniciar sesión con Google')
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Iniciar sesión con Google
                  </Button>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  O continuar con
                </FieldSeparator>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="correo@ejemplo.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Contraseña</FormLabel>
                        <a
                          href="/recuperar-contrasena"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          ¿Olvidaste tu contraseña?
                        </a>
                      </div>
                      <FormControl>
                        <PasswordInput
                          placeholder="Contraseña"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Field>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Spinner />}
                    {isLoading ? 'Iniciando sesión' : 'Iniciar sesión'}
                  </Button>
                  <FieldDescription className="text-center">
                    ¿No tienes una cuenta? <a href="/registrarse">Regístrate</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Al continuar, aceptas nuestros <a href="/terminos">Términos de servicio</a> y{' '}
        <a href="/privacidad">Política de privacidad</a>.
      </FieldDescription>
    </div>
  )
}

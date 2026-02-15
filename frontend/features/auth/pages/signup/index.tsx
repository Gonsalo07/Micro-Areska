'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldSeparator } from '@/components/ui/field'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
      .max(50, { message: 'El nombre no puede tener más de 50 caracteres' }),
    email: z.email({ message: 'Correo electrónico inválido' }).trim(),
    password: z
      .string()
      .trim()
      .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
      .max(50, { message: 'La contraseña no puede tener más de 50 caracteres' })
      .regex(/^\S+$/, { message: 'La contraseña no puede contener espacios en blanco' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, {
        message:
          'La contraseña debe incluir al menos una minúscula, una mayúscula, un número y un carácter especial (@$!%*?&)',
      }),
    confirmPassword: z.string().trim().min(8, { message: 'Debes confirmar la contraseña' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export function SignUpPage({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()
  const { signup, init, isLoading, loginWithGoogle } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    init()
  }, [init])

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignupFormValues) => {
    setError(null)
    try {
      await signup(data.email, data.password, data.name)
      router.push('/')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'No se pudo crear la cuenta')
    }
  }
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crea tu cuenta</CardTitle>
          <CardDescription>Crea tu cuenta con Google o con tu correo</CardDescription>
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
                      } catch (e: unknown) {
                        setError(
                          e instanceof Error ? e.message : 'No se pudo crear la cuenta con Google'
                        )
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Crear cuenta con Google
                  </Button>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  O continuar con
                </FieldSeparator>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel required>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Ingrese un nombre"
                          autoComplete="name"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel required>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="correo@ejemplo.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel required>Contraseña</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Contraseña"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel required>Confirmar contraseña</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Confirmar Contraseña"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                    </FormItem>
                  )}
                />
                <Field>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                  </Button>
                  <FieldDescription className="text-center">
                    ¿Ya tienes una cuenta? <a href="/iniciar-sesion">Inicia sesión</a>
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

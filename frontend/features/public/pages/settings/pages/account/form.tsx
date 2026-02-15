'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Check, CheckCircle2, Copy, Mail, TriangleAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useAuthStore } from '@/stores/auth-store'

const emailVerificationSchema = z.object({
  newEmail: z.email({ message: 'Introduce un correo electrónico válido.' }).trim(),
  password: z.string().trim().min(1, {
    message: 'La contraseña es obligatoria.',
  }),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().trim().min(8, {
      message: 'La contraseña actual debe tener al menos 8 caracteres.',
    }),
    newPassword: z
      .string()
      .trim()
      .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
      .max(50, {
        message: 'La contraseña no puede tener más de 50 caracteres.',
      })
      .regex(/^\S+$/, { message: 'La contraseña no puede contener espacios en blanco.' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, {
        message:
          'La contraseña debe incluir al menos una minúscula, una mayúscula, un número y un carácter especial (@$!%*?&).',
      }),
    confirmNewPassword: z
      .string()
      .trim()
      .min(8, { message: 'Debes confirmar la contraseña nueva.' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmNewPassword'],
  })

type EmailVerificationFormValues = z.infer<typeof emailVerificationSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

export function AccountForm() {
  const { user, changePassword, changeEmail } = useAuthStore()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailSuccessMessage, setEmailSuccessMessage] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)

  const emailVerificationForm = useForm<EmailVerificationFormValues>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      newEmail: '',
      password: '',
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  })

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (open) {
      emailVerificationForm.reset()
    }
  }

  const isPasswordProvider = user!.authProvider === 'password'
  const isDisabled = !isPasswordProvider

  const handleEmailVerificationSubmit = async (data: EmailVerificationFormValues) => {
    setEmailError(null)
    setEmailSuccessMessage(null)

    if (data.newEmail === user?.email) {
      setEmailError('El nuevo correo es igual al actual.')
      setIsDialogOpen(false)
      return
    }

    setIsEmailLoading(true)
    try {
      await changeEmail(data.password, data.newEmail)
      setEmailSuccessMessage('Correo actualizado exitosamente')
      setIsDialogOpen(false)
      emailVerificationForm.reset()
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string }
      if (err?.code === 'auth/invalid-credential') {
        setEmailError('La contraseña no es correcta')
      } else if (err?.code === 'auth/email-already-in-use') {
        setEmailError('Este correo ya está en uso')
      } else {
        setEmailError('Error al cambiar el correo')
      }
      setIsDialogOpen(false)
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handlePasswordSubmit = async (data: PasswordFormValues) => {
    setSuccessMessage(null)
    setErrorMessage(null)
    if (!isPasswordProvider) {
      setErrorMessage('Esta función no está disponible para tu tipo de cuenta.')
      return
    }

    setIsPasswordLoading(true)
    try {
      await changePassword(data.currentPassword, data.newPassword)
      setSuccessMessage('Contraseña actualizada exitosamente')
      passwordForm.reset()
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string }
      if (err?.code === 'auth/invalid-credential') {
        setErrorMessage('La contraseña actual no es correcta')
      } else {
        setErrorMessage('Error al cambiar la contraseña')
      }
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <div className="space-y-8">
      {!isPasswordProvider && (
        <Alert variant="warning">
          <TriangleAlert />
          <AlertTitle>Cambio de contraseña y correo no disponible</AlertTitle>
          <AlertDescription>
            <p>
              Estas funciones requieren cuenta con contraseña.
              <br />
              Tu cuenta actual es de {user!.authProvider}.
            </p>
            <ul className="list-inside list-disc text-sm">
              <li>Contacta con soporte para más ayuda</li>
              <li>Usa las opciones de tu proveedor de autenticación</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        {emailSuccessMessage && (
          <Alert variant="success">
            <CheckCircle2 />
            <AlertTitle>{emailSuccessMessage}</AlertTitle>
          </Alert>
        )}
        {emailError && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>{emailError}</AlertTitle>
          </Alert>
        )}
        <div className="space-y-6">
          <div>
            <Label htmlFor="email-copy-input">Correo electrónico</Label>
            <InputGroup className="mt-2">
              <InputGroupAddon>
                {isPasswordProvider ? (
                  <Mail />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </InputGroupAddon>
              <InputGroupInput id="email-copy-input" value={user?.email || ''} readOnly />
              <InputGroupAddon align="inline-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InputGroupButton
                      aria-label="Copiar correo"
                      size="icon-xs"
                      onClick={() => {
                        copyToClipboard(user?.email || '')
                      }}
                    >
                      {isCopied ? <Check /> : <Copy />}
                    </InputGroupButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isCopied ? 'Copiado' : 'Copiar correo'}</p>
                  </TooltipContent>
                </Tooltip>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
        <div className="flex justify-center sm:justify-start">
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button disabled={isDisabled || isEmailLoading}>Actualizar correo</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" isStatic>
              <Form {...emailVerificationForm}>
                <form onSubmit={emailVerificationForm.handleSubmit(handleEmailVerificationSubmit)}>
                  <DialogHeader>
                    <DialogTitle>Actualizar correo electrónico</DialogTitle>
                    <DialogDescription>
                      Ingresa tu nuevo correo y confirma con tu contraseña actual.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <FormField
                      control={emailVerificationForm.control}
                      name="newEmail"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Nuevo correo electrónico</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="nuevo@correo.com"
                              autoComplete="email"
                              disabled={isEmailLoading}
                              {...field}
                            />
                          </FormControl>
                          {fieldState.error && (
                            <FormMessage>{fieldState.error.message}</FormMessage>
                          )}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailVerificationForm.control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Contraseña actual</FormLabel>
                          <FormControl>
                            <PasswordInput
                              placeholder="Ingresa tu contraseña actual"
                              autoComplete="current-password"
                              disabled={isEmailLoading}
                              {...field}
                            />
                          </FormControl>
                          {fieldState.error && (
                            <FormMessage>{fieldState.error.message}</FormMessage>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" type="button" disabled={isEmailLoading}>
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isEmailLoading}>
                      {isEmailLoading && <Spinner />}
                      {isEmailLoading ? 'Actualizando correo' : 'Actualizar correo'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-8">
          {successMessage && (
            <Alert variant="success">
              <CheckCircle2 />
              <AlertTitle>{successMessage}</AlertTitle>
            </Alert>
          )}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{errorMessage}</AlertTitle>
            </Alert>
          )}

          <div className="space-y-6">
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Contraseña actual</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Contraseña actual"
                      autoComplete="current-password"
                      disabled={isDisabled}
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Contraseña nueva</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Contraseña nueva"
                        autoComplete="new-password"
                        disabled={isDisabled}
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmNewPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña nueva</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirmar contraseña nueva"
                        autoComplete="new-password"
                        disabled={isDisabled}
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-center sm:justify-start">
            <Button type="submit" disabled={isDisabled || isPasswordLoading}>
              {isPasswordLoading && <Spinner />}
              {isPasswordLoading ? 'Actualizando contraseña' : 'Actualizar contraseña'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

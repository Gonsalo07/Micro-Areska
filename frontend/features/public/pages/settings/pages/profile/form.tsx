'use client'

import { useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle2, Pencil, Trash, Upload } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { getInitials } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

const photoSchema = z.object({
  photo: z
    .instanceof(File)
    .refine(
      (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        return allowedTypes.includes(file.type)
      },
      { message: 'Solo se permiten imágenes en formato JPG, PNG, GIF o WEBP.' }
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'El tamaño máximo de la imagen es 5MB.',
    })
    .nullable(),
})

const nameSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
    .max(50, { message: 'El nombre no puede tener más de 50 caracteres.' })
    .transform((val) => val.trim().replace(/\s+/g, ' '))
    .refine((val) => /^[A-Za-zÀ-ÿ\s-]+$/.test(val), {
      message: 'El nombre solo puede contener letras, espacios y guiones (-).',
    }),
  lastName: z
    .string()
    .min(2, { message: 'El apellido debe tener al menos 2 caracteres.' })
    .max(50, { message: 'El apellido no puede tener más de 50 caracteres.' })
    .transform((val) => val.trim().replace(/\s+/g, ' '))
    .refine((val) => /^[A-Za-zÀ-ÿ\s-]+$/.test(val), {
      message: 'El apellido solo puede contener letras, espacios y guiones (-).',
    }),
  phone: z
    .string()
    .min(1, { message: 'El teléfono es obligatorio.' })
    .max(20, { message: 'El teléfono no puede tener más de 20 caracteres.' })
    .refine((val) => /^9\d{8}$/.test(val), {
      message: 'El teléfono debe tener exactamente 9 dígitos y comenzar con 9.',
    }),
  address: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 200, {
      message: 'La dirección no puede tener más de 200 caracteres.',
    }),
})

type PhotoFormValues = z.infer<typeof photoSchema>
type NameFormValues = z.infer<typeof nameSchema>

export function ProfileForm() {
  const { user, init, isLoadingInitial, isLoading, updateProfile } = useAuthStore()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const photoForm = useForm<PhotoFormValues>({
    resolver: zodResolver(photoSchema),
    defaultValues: { photo: null },
    mode: 'onChange',
  })

  const nameForm = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
    },
    mode: 'onChange',
  })

  const photoValue = useWatch({ control: photoForm.control, name: 'photo' })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    init()
  }, [init])

  const handleUploadPhoto = () => fileInputRef.current?.click()
  const handleDeletePhoto = () => {
    photoForm.setValue('photo', null)
    setAvatarUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handlePhotoSubmit = (_data: PhotoFormValues) => {}

  const handleNameSubmit = async (data: NameFormValues) => {
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      await updateProfile(data.firstName, data.lastName, data.phone, data.address || '')
      setSuccessMessage('Perfil actualizado exitosamente')
      nameForm.reset(data)
    } catch (error: unknown) {
      const err = error as { message?: string }
      setErrorMessage(err?.message || 'Error al actualizar el perfil')
    }
  }

  useEffect(() => {
    if (user) {
      nameForm.setValue('firstName', user.firstName || '')
      nameForm.setValue('lastName', user.lastName || '')
      nameForm.setValue('phone', user.phone || '')
      nameForm.setValue('address', user.address || '')
    }
  }, [user, nameForm])

  useEffect(() => {
    if (photoValue instanceof File) {
      try {
        photoSchema.shape.photo.parse(photoValue)
        const objectUrl = URL.createObjectURL(photoValue)
        setAvatarUrl(objectUrl)
        setPhotoError(null)
        photoForm.handleSubmit(handlePhotoSubmit)()
        return () => URL.revokeObjectURL(objectUrl)
      } catch (error) {
        if (error instanceof z.ZodError) {
          setPhotoError(error.issues[0].message)
          setAvatarUrl(null)
        }
      }
    }
  }, [photoValue, photoForm])

  const getFallback = () => {
    const { firstName, lastName } = nameForm.getValues()
    return getInitials(firstName, lastName)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col items-center relative">
        <div className="relative">
          {isLoadingInitial ? (
            <Skeleton className="w-32 h-32 rounded-full" />
          ) : (
            <Avatar className="w-32 h-32">
              {avatarUrl || user?.photoUrl ? (
                <AvatarImage
                  src={avatarUrl || user?.photoUrl || ''}
                  alt="Foto de perfil"
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="text-5xl">{getFallback()}</AvatarFallback>
              )}
            </Avatar>
          )}
          <div className="absolute bottom-0 right-0">
            <DropdownMenu>
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center bg-background">
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-full p-0 rounded-full"
                    aria-label="Editar"
                    title="Editar"
                  >
                    <Pencil />
                  </Button>
                </DropdownMenuTrigger>
              </div>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleUploadPhoto}>
                  <Upload className="text-current" />
                  Subir foto
                </DropdownMenuItem>
                {avatarUrl && (
                  <DropdownMenuItem variant="destructive" onClick={handleDeletePhoto}>
                    <Trash />
                    Eliminar foto
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <input
          ref={fileInputRef}
          id="photo-input"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              photoForm.setValue('photo', file)
            }
          }}
        />

        {photoError && <p className="text-xs text-destructive mt-2 text-center">{photoError}</p>}
      </div>

      <Form {...nameForm}>
        <form onSubmit={nameForm.handleSubmit(handleNameSubmit)} className="space-y-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <FormField
                control={nameForm.control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese su nombre"
                        autoComplete="given-name"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && <FormMessage />}
                  </FormItem>
                )}
              />
              <FormField
                control={nameForm.control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese su apellido"
                        autoComplete="family-name"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && <FormMessage />}
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <FormField
                control={nameForm.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese su teléfono"
                        autoComplete="tel"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && <FormMessage />}
                  </FormItem>
                )}
              />
              <FormField
                control={nameForm.control}
                name="address"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese su dirección"
                        autoComplete="address"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && <FormMessage />}
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-center sm:justify-start">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Spinner />}
              {isLoading ? 'Actualizando perfil' : 'Actualizar perfil'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

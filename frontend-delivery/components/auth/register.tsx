"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { RegisterSchema } from "@/helpers/schemas";
import { RegisterFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const Register = () => {
  const router = useRouter();
  const { signup, isLoading } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialValues: RegisterFormType = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleRegister = useCallback(
    async (values: RegisterFormType) => {
      setErrorMessage(null);
      try {
        await signup(values.email, values.password, values.name);
        await createAuthCookie();
        router.replace("/");
      } catch (error: any) {
        console.error("Registration error:", error);
        setErrorMessage(error?.message ?? "No se pudo registrar. Intenta nuevamente.");
      }
    },
    [signup, router]
  );

  return (
    <>
      <div className='text-center text-[25px] font-bold mb-6'>
        Registro - Conductor Delivery
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}>
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <>
            {errorMessage && (
              <div className='mb-4 p-3 rounded bg-red-100 text-red-700 text-sm w-1/2'>
                {errorMessage}
              </div>
            )}

            <div className='flex flex-col w-1/2 gap-4 mb-4'>
              <Input
                variant='bordered'
                label='Nombre completo'
                value={values.name}
                isInvalid={!!errors.name && !!touched.name}
                errorMessage={errors.name}
                onChange={handleChange("name")}
                disabled={isLoading}
              />
              <Input
                variant='bordered'
                label='Correo electrónico'
                type='email'
                value={values.email}
                isInvalid={!!errors.email && !!touched.email}
                errorMessage={errors.email}
                onChange={handleChange("email")}
                disabled={isLoading}
              />
              <Input
                variant='bordered'
                label='Contraseña'
                type='password'
                value={values.password}
                isInvalid={!!errors.password && !!touched.password}
                errorMessage={errors.password}
                onChange={handleChange("password")}
                disabled={isLoading}
              />
              <Input
                variant='bordered'
                label='Confirmar contraseña'
                type='password'
                value={values.confirmPassword}
                isInvalid={
                  !!errors.confirmPassword && !!touched.confirmPassword
                }
                errorMessage={errors.confirmPassword}
                onChange={handleChange("confirmPassword")}
                disabled={isLoading}
              />
            </div>

            <Button
              onPress={() => handleSubmit()}
              variant='flat'
              color='primary'
              isLoading={isLoading}
              disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
          </>
        )}
      </Formik>

      <div className='font-light text-slate-400 mt-4 text-sm'>
        ¿Ya tienes una cuenta?{" "}
        <Link href='/login' className='font-bold'>
          Inicia sesión aquí
        </Link>
      </div>
    </>
  );
};

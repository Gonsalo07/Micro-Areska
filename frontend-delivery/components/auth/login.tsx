"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const Login = () => {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialValues: LoginFormType = {
    email: "",
    password: "",
  };

  const handleLogin = useCallback(
    async (values: LoginFormType) => {
      setErrorMessage(null);
      try {
        await login(values.email, values.password);
        await createAuthCookie();
        router.replace("/");
      } catch (error: any) {
        console.error("Login error:", error);
        setErrorMessage(error?.message ?? "No se pudo iniciar sesión. Verifica tus credenciales.");
      }
    },
    [login, router]
  );

  return (
    <>
      <div className='text-center text-[25px] font-bold mb-6'>
        Iniciar Sesión - Delivery
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}>
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
            </div>

            <Button
              onPress={() => handleSubmit()}
              variant='flat'
              color='primary'
              isLoading={isLoading}
              disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </>
        )}
      </Formik>

      <div className='font-light text-slate-400 mt-4 text-sm'>
        ¿No tienes una cuenta?{" "}
        <Link href='/register' className='font-bold'>
          Regístrate aquí
        </Link>
      </div>
    </>
  );
};

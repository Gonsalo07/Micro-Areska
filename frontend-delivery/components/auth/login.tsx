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
    <div className="flex flex-col w-full max-w-md bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-zinc-800 z-10 transition-all duration-500 animate-in fade-in zoom-in-95">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center mb-4 text-3xl shadow-sm">
          🛵
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          Bienvenido
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Ingresa a tu panel de repartidor
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400 text-sm font-medium border border-danger-200 dark:border-danger-900/50 flex gap-2 items-center animate-in slide-in-from-top-2">
                <span>⚠️</span> {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-5">
              <Input
                variant="flat"
                label="Correo electrónico"
                labelPlacement="outside"
                placeholder="ejemplo@areska.com"
                type="email"
                value={values.email}
                isInvalid={!!errors.email && !!touched.email}
                errorMessage={errors.email}
                onChange={handleChange("email")}
                isDisabled={isLoading || isSubmitting}
                classNames={{
                  label: "text-sm font-semibold text-gray-700 dark:text-gray-300 pb-1.5",
                  inputWrapper: "h-12 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-900 group-data-[focus=true]:border-primary shadow-sm",
                  input: "text-base"
                }}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-lg">📧</span>
                  </div>
                }
              />
              
              <div className="space-y-1">
                <Input
                  variant="flat"
                  label="Contraseña"
                  labelPlacement="outside"
                  placeholder="••••••••"
                  type="password"
                  value={values.password}
                  isInvalid={!!errors.password && !!touched.password}
                  errorMessage={errors.password}
                  onChange={handleChange("password")}
                  isDisabled={isLoading || isSubmitting}
                  classNames={{
                    label: "text-sm font-semibold text-gray-700 dark:text-gray-300 pb-1.5",
                    inputWrapper: "h-12 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-900 group-data-[focus=true]:border-primary shadow-sm",
                    input: "text-base"
                  }}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-lg">🔒</span>
                    </div>
                  }
                />
                <div className="flex justify-end">
                  <Link href="#" className="text-xs font-medium text-primary hover:text-primary-600 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>
            </div>

            <Button
              onPress={() => handleSubmit}
              type="submit"
              color="primary"
              size="lg"
              radius="xl"
              isLoading={isLoading || isSubmitting}
              isDisabled={isLoading || isSubmitting}
              className="w-full font-bold shadow-lg shadow-primary/25 mt-2 h-12"
            >
              {isLoading ? "Iniciando sesión..." : "Ingresar al Panel"}
            </Button>
          </form>
        )}
      </Formik>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          ¿No tienes una cuenta?{" "}
          <Link 
            href="/register" 
            className="font-bold text-primary hover:text-primary-600 transition-colors ml-1"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

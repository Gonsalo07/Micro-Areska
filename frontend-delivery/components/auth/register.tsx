"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { RegisterSchema } from "@/helpers/schemas";
import { RegisterFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import {
  AlertCircle,
  Lock,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { InputIcon } from "@/components/auth/input-icon";
import { authInputClassNames } from "@/components/auth/form-styles";
import { PrimaryButton } from "@/components/primary-button";

const inputClassNames = authInputClassNames;

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
        setErrorMessage(
          error?.message ?? "No se pudo registrar. Intenta nuevamente."
        );
      }
    },
    [signup, router]
  );

  return (
    <div className="flex flex-col w-full max-w-md bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-zinc-800 z-10 transition-all duration-500 animate-in fade-in zoom-in-95">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          Únete al equipo
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Crea tu cuenta de repartidor Areska
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400 text-sm font-medium border border-danger-200 dark:border-danger-900/50 flex gap-2 items-center animate-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-5">
              <Input
                variant="bordered"
                label="Nombre completo"
                labelPlacement="outside"
                placeholder="Juan Pérez"
                value={values.name}
                isInvalid={!!errors.name && !!touched.name}
                errorMessage={errors.name}
                onChange={handleChange("name")}
                isDisabled={isLoading || isSubmitting}
                classNames={inputClassNames}
                startContent={<InputIcon icon={User} />}
              />

              <Input
                variant="bordered"
                label="Correo electrónico"
                labelPlacement="outside"
                placeholder="ejemplo@areska.com"
                type="email"
                value={values.email}
                isInvalid={!!errors.email && !!touched.email}
                errorMessage={errors.email}
                onChange={handleChange("email")}
                isDisabled={isLoading || isSubmitting}
                classNames={inputClassNames}
                startContent={<InputIcon icon={Mail} />}
              />

              <Input
                variant="bordered"
                label="Contraseña"
                labelPlacement="outside"
                placeholder="••••••••"
                type="password"
                value={values.password}
                isInvalid={!!errors.password && !!touched.password}
                errorMessage={errors.password}
                onChange={handleChange("password")}
                isDisabled={isLoading || isSubmitting}
                classNames={inputClassNames}
                startContent={<InputIcon icon={Lock} />}
              />

              <Input
                variant="bordered"
                label="Confirmar contraseña"
                labelPlacement="outside"
                placeholder="••••••••"
                type="password"
                value={values.confirmPassword}
                isInvalid={
                  !!errors.confirmPassword && !!touched.confirmPassword
                }
                errorMessage={errors.confirmPassword}
                onChange={handleChange("confirmPassword")}
                isDisabled={isLoading || isSubmitting}
                classNames={inputClassNames}
                startContent={<InputIcon icon={LockKeyhole} />}
              />
            </div>

            <PrimaryButton
              type="submit"
              fullWidth
              isLoading={isLoading || isSubmitting}
              isDisabled={isLoading || isSubmitting}
              className="mt-2"
            >
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </PrimaryButton>
          </form>
        )}
      </Formik>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-bold text-primary hover:text-primary-600 transition-colors ml-1"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

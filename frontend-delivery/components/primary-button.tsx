"use client";

import { Button, type ButtonProps } from "@nextui-org/react";

import { cn } from "@/lib/utils";

export const primaryButtonClassName =
  "h-11 min-h-11 font-bold shadow-lg shadow-primary/25 transition-transform data-[hover=true]:scale-[1.01] active:scale-[0.98]";

type PrimaryButtonProps = Omit<ButtonProps, "color" | "variant"> & {
  fullWidth?: boolean;
};

export function PrimaryButton({
  className,
  fullWidth,
  size = "lg",
  radius = "lg",
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      color="primary"
      size={size}
      radius={radius}
      className={cn(primaryButtonClassName, fullWidth && "w-full", className)}
      {...props}
    />
  );
}

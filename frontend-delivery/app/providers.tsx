"use client";
import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextUIProvider>
      <ThemeProvider
        defaultTheme="system"
        attribute="class"
      >
        {children}
      </ThemeProvider>
    </NextUIProvider>
  );
}
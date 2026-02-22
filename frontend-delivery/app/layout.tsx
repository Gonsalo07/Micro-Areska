import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import { AuthInitializer } from "@/features/auth/components/auth-initializer";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "Areska Delivery",
  description: "Sistema de delivery para conductores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='es' suppressHydrationWarning>
      <body className={clsx("font-sans antialiased", fontSans.className)}>
        <Providers>
          <AuthInitializer>{children}</AuthInitializer>
        </Providers>
      </body>
    </html>
  );
}

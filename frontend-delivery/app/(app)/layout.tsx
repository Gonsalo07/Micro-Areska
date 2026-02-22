import { Layout } from "@/components/layout/layout";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import "@/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Layout>{children}</Layout>
    </AuthGuard>
  );
}

import type { ReactNode } from "react";

export const metadata = {
  title: "Neo Nutri",
  description: "App de nutrición y progreso",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
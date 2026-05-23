import type { ReactNode } from "react";

export const metadata = {
  title: "NUT-KAIZEN",
  description: "Tu app de nutrición y entrenamiento. Mejora continua, un día a la vez.",
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
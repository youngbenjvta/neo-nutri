import type { ReactNode } from "react";

export const metadata = {
  title: "KAIZEN",
  description: "Tu app de nutrición y entrenamiento. Mejora continua, un día a la vez.",
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
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
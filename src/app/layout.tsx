import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Chrome from "@/components/Chrome";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Importadora Fidodido - Repuestos confiables para tu inventario",
  description:
    "Marca especializada en abastecimiento para tiendas de repuestos y distribuidores. Garantía de calidad y logística eficiente.",
  appleWebApp: {
    title: "Importadora Fidodido",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-title" content="Importadora Fidodido" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#f8f5f5] text-[#0d151c] min-h-screen flex flex-col`}>
        <Chrome>
          <main className="flex flex-col items-center flex-1">{children}</main>
        </Chrome>
      </body>
    </html>
  );
}

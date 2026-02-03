import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "B2B Auto Parts - Repuestos confiables para tu inventario",
  description:
    "Marca especializada en abastecimiento para tiendas de repuestos y distribuidores. Garantía de calidad y logística eficiente.",
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
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#f8f5f5] text-[#0d151c] min-h-screen flex flex-col`}>
        <Header />
        <main className="flex flex-col items-center flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

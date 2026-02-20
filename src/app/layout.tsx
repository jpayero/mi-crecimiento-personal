import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mi Crecimiento Personal - Aprendizaje con Tarjetas Kanban",
  description: "Aplicacion interactiva para estudio de libros de desarrollo personal, creacion de riquezas, emprendimiento y coaching. Aprende con tarjetas Kanban y sigue tu progreso.",
  keywords: ["crecimiento personal", "libros", "desarrollo personal", "emprendimiento", "coaching", "kanban", "aprendizaje"],
  authors: [{ name: "Mi Crecimiento Personal" }],
  icons: {
    icon: "/growth-body.png",
  },
  openGraph: {
    title: "Mi Crecimiento Personal",
    description: "Aprende de los mejores libros de desarrollo personal con tarjetas Kanban interactivas",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

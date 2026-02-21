import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Usar standalone para mejor compatibilidad
  output: "standalone",
  
  // Ignorar errores de TypeScript durante build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Desactivar modo estricto de React
  reactStrictMode: false,
  
  // Configuración experimental para mejor soporte de API routes
  experimental: {
    serverComponentsExternalPackages: ['pdfjs-dist'],
  },
};

export default nextConfig;

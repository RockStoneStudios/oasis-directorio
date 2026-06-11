import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔥 React Compiler (opcional, solo si usas React 19+)
  reactCompiler: false, // Cambia a false si no usas React 19
  images: {
    unoptimized: true, // ← Esto hace que TODAS las imágenes sean unoptimized globalmente
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "**.sanity.io",
      },
    ],
  },
  
  // 🔧 Compresión y optimización
  compress: true,
  
  // 🌐 Headers adicionales para CORS
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  

  
  // ⚡ Turbopack (Next.js 15+)
  turbopack: {
    resolveAlias: {
      // Configuraciones adicionales si usas turbopack
    },
  },
  
  
  // 🏭 Configuración de producción
  productionBrowserSourceMaps: false, // Desactiva source maps en producción
  
  // 🎯 Power para la app
  poweredByHeader: false, // Oculta "X-Powered-By: Next.js"
};

export default nextConfig;
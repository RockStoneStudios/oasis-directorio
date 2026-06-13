import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔥 React Compiler
  reactCompiler: false,
  
  images: {
    unoptimized: true,
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
  
  // 🚀 EXPERIMENTAL: Optimización de CSS y Scripts (NUEVO)
  experimental: {
    optimizeCss: false,           // ← Optimiza CSS (reduce bloqueo)
    optimizePackageImports: ["lucide-react", "leaflet"], // ← Optimiza imports
    webpackBuildWorker: true,     // ← Paraleliza builds
    mdxRs: true,                  // ← Compilación más rápida
  },
  
  // 🔧 Transpilación para navegadores modernos (reduce JavaScript antiguo)
  transpilePackages: [],

  
  // 🎯 Eliminar logs en producción
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // 🌐 Headers mejorados
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
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
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
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  
  // 🏭 Configuración de producción
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  
  // ⚡ On-Demand Revalidation (ISR)
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 hora
    pagesBufferLength: 5,
  },
};

export default nextConfig;
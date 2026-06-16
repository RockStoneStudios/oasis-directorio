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
  
  // 🚀 EXPERIMENTAL: Optimización de CSS y Scripts
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ["lucide-react", "leaflet"],
    webpackBuildWorker: true,
    mdxRs: true,
  },
  
  // 🚀 REDIRECCIONES 301 PARA CONSOLIDAR URLs
  async redirects() {
    return [
      // Redirige http a https (sin www)
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://www.ooasys.com/:path*',
        permanent: true,
      },
      // Redirige ooasys.com (sin www) a www.ooasys.com
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'ooasys.com',
          },
        ],
        destination: 'https://www.ooasys.com/:path*',
        permanent: true,
      },
      // Redirige http://www.ooasys.com a https://www.ooasys.com
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'http://www.ooasys.com',
          },
        ],
        destination: 'https://www.ooasys.com/:path*',
        permanent: true,
      },
    ];
  },
  
  // 🔧 Transpilación para navegadores modernos
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
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "**sanity.io" },
    ],
  },

  compress: true,

  experimental: {
    optimizeCss: false,
    optimizePackageImports: ["lucide-react", "leaflet"],
    webpackBuildWorker: true,
    mdxRs: true,
  },

  // 🔥 REDIRECCIONES SIMPLIFICADAS - SIN BUCLE
  async redirects() {
    return [
      // SOLO redirigir de HTTP a HTTPS + WWW (en producción)
      {
        source: "/:path*",
        has: [
          {
            type: "header",
            key: "x-forwarded-proto",
            value: "http",
          },
        ],
        destination: "https://www.ooasys.com/:path*",
        permanent: true,
      },
    ];
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
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

  // Redirecciones 301 - Mejoradas
  async redirects() {
    return [
      // HTTP → HTTPS + WWW
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: "https://www.ooasys.com/:path*",
        permanent: true,
      },
      // Sin WWW → Con WWW
      {
        source: "/:path*",
        has: [{ type: "host", value: "ooasys.com" }],
        destination: "https://www.ooasys.com/:path*",
        permanent: true,
      },
      // WWW pero HTTP → HTTPS
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ooasys.com" }],
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

  // Headers
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
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // 👇 ESTO ES LO QUE FALTA PARA ARREGLAR CLERK Y EL CORS
  async rewrites() {
    return [
      {
        source: "/__clerk/(.*)",
        destination: "https://clerk.oasis-directorio-ccg7.vercel.app/__clerk/$1",
      },
    ];
  },
};

export default nextConfig;
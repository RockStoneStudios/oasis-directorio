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
  // Los rewrites para Clerk ya no son necesarios 
  // porque el dominio está verificado nativamente.
};

export default nextConfig;
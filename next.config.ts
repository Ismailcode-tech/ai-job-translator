import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
    serverComponentsExternalPackages: ['pdf-parse'],
  },
};

export default nextConfig;

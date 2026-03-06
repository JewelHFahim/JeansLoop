import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'thefirecutter.store',
      },
      {
        protocol: 'https',
        hostname: 'api.thefirecutter.store',
      }
    ],
  },
};

export default nextConfig;

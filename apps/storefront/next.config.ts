import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      },
      {
        protocol: 'http',
        hostname: '176.57.189.196',
      },
      {
        protocol: 'https',
        hostname: '176.57.189.196',
      }
    ],
  },
};

export default nextConfig;
